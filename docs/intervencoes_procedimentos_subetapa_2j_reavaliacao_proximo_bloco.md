# Subetapa 2J - Reavaliacao do proximo bloco apos extracao dos helpers seguros

## 1. Objetivo
Esta etapa e somente documental. O foco e pausar novas extracoes funcionais em Intervencoes / Procedimentos e reavaliar, com criterio conservador, qual deve ser o proximo bloco seguro da modularizacao depois da extracao dos helpers mais simples e de menor risco.

## 2. Estado inicial
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit: `92ffa7c Subetapa 2I: extrai procIndiceSiglaFromValor para modulo de Intervencoes`
- Status resumido: muitos `??` antigos em `docs/`, sem arquivos staged
- Diff inicial: `git diff --stat` vazio e `git diff --cached --stat` vazio no inicio desta etapa

## 3. Historico dos helpers ja extraidos
Os helpers pequenos considerados mais seguros ja foram extraidos para `frontend/js/modules/intervencoes-procedimentos.js` com wrappers compativeis no `frontend/app.js`:
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 4. Funcoes e blocos inspecionados
Foram inspecionados, sem alterar nada, os seguintes blocos remanescentes em `frontend/app.js` e o namespace do modulo:
- `procSetSelectValue`
- `procGarantirOpcaoSelect`
- `procPreencherSelect`
- `procBuscarSimbolo`
- `procSimboloDescricao`
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`
- funcoes sensiveis proximas de editor, payload, salvamento, materiais, vinculos e reajuste

## 5. Classificacao geral dos remanescentes

### Baixo risco
Nao foi identificado um novo helper que seja claramente baixo risco e imediato, alem dos ja extraidos. Os helpers remanescentes pequenos tendem a depender de DOM/select ou aparecem em fluxos amplos do editor.

### Risco medio
Os helpers de select e de simbolo possuem corpo pequeno, mas aparecem em pontos amplos do editor e dependem de elementos de tela. Isso eleva o risco de regressao visual ou de comportamento em fluxos de preenchimento.

### Alto risco / proibido agora
As funcoes de normalizacao de forma de cobranca continuam proibidas para mover neste momento, porque participam de payload e salvamento e podem alterar o valor persistido.

### Fora do escopo
Backend, endpoints, banco, schema/migrations, limpeza ampla, correcoes textuais/mojibake e reorganizacao geral continuam fora do escopo desta modularizacao.

## 6. Analise especifica

### `procSetSelectValue`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Classe: risco medio
- Motivo: helper pequeno e utilitario, mas atua diretamente sobre `select` e e usado em varios fluxos de preenchimento visual do modulo e em outros pontos da tela
- Impacto: nao grava nem faz fetch, mas pode afetar comportamento visual e selecao ativa
- Recomendacao: documentar melhor antes de mover; nao tratar como extracao funcional imediata sem mapear chamadas

### `procGarantirOpcaoSelect`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Classe: risco medio
- Motivo: insere opcoes no DOM de `select`, e chamado em varios trechos de preenchimento e edicao
- Impacto: nao grava nem faz fetch, mas altera DOM e pode influenciar selecao e exibicao
- Recomendacao: manter em observacao e documentar primeiro

### `procPreencherSelect`
- Localizacao aproximada: bloco de helpers do editor em `frontend/app.js`
- Classe: risco medio
- Motivo: preenche o HTML de `select`, e e helper de DOM com uso amplo
- Impacto: nao grava, mas altera DOM de forma relevante e sustenta varios combos do editor
- Recomendacao: documentar antes de qualquer extracao funcional

### `procBuscarSimbolo`
- Localizacao aproximada: area de simbolos em `frontend/app.js`
- Classe: cautela
- Motivo: e pequeno, mas depende de cache global de simbolos e alimenta visualizacao e salvamento indireto por descoberta de simbolo
- Impacto: nao faz fetch, mas participa de fluxo sensivel do editor e da representacao visual
- Recomendacao: nao mover agora sem nova documentacao especifica do bloco de simbolos

### `procSimboloDescricao`
- Localizacao aproximada: area de simbolos em `frontend/app.js`
- Classe: cautela
- Motivo: e um wrapper de descricao apoiado em `procBuscarSimbolo` e com uso visual amplo
- Impacto: nao grava, mas pode afetar rotulos exibidos e selecao visual
- Recomendacao: manter no app.js por enquanto, com documentacao previa se for considerado numa etapa futura

### `procNormalizarFormaCobranca`
- Localizacao aproximada: bloco de helpers de procedimentos em `frontend/app.js`
- Classe: alto risco / proibido agora
- Motivo: e usado em fluxo de aplicacao de dados e salvamento; influencia o valor de `forma_cobranca`
- Impacto: pode alterar payload e persistencia
- Recomendacao: nao mover

### `procNormalizarFormaCobrancaV2`
- Localizacao aproximada: bloco de helpers de procedimentos em `frontend/app.js`
- Classe: alto risco / proibido agora
- Motivo: tambem e usado em fluxo de aplicacao de dados e salvamento; influencia o payload persistido
- Impacto: pode alterar valor enviado ao backend e comportamento salvo
- Recomendacao: nao mover

## 7. Blocos intocados obrigatorios
Permanecem intocados e fora de qualquer extracao imediata:
- materiais
- vinculos
- genéricos
- `procedimento_generico_id`
- `Procedimentos Genéricos`
- payload
- salvamento
- custos
- reajuste
- backend
- endpoints

## 8. Riscos encontrados
- Helpers de select sao pequenos, mas dependem de DOM e aparecem em varios fluxos do editor
- Helpers de simbolo podem parecer simples, mas continuam ligados a cache e visualizacao
- Normalizacao de forma de cobranca continua associada a payload e salvamento, com risco alto de regressao
- Nao foi identificado, apos a 2I, um novo helper claramente seguro e pequeno o suficiente para extração funcional imediata sem nova documentacao

## 9. Recomendacao objetiva da proxima etapa
Recomendacao conservadora: **B. Subetapa documental especifica sobre helpers de select**

Motivo:
- os helpers de select sao os candidatos mais proximos de uma futura extracao, mas ainda precisam de mapeamento proprio por dependerem de DOM e uso amplo
- antes de mover qualquer codigo, e melhor documentar chamadas, efeito visual e riscos de regressao
- a normalizacao de forma de cobranca deve permanecer proibida agora

## 10. Onde testar caso a proxima etapa venha a ser funcional
Se uma futura subetapa funcional mexer em helpers de select, o teste deve incluir:
- Ctrl+F5
- abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- abrir a listagem
- abrir procedimento existente
- abrir procedimento com generico
- abrir procedimento sem generico
- conferir materiais proprios e herdados visualmente
- abrir `% Reajusta tabela` apenas ate `Preview`, sem aplicar
- conferir console

## 11. Confirmacoes finais de seguranca
- Nenhum codigo foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules/intervencoes-procedimentos.js` nao foi alterado
- Backend nao foi alterado
- Banco, schema, migrations e endpoints nao foram alterados
- Nao houve `UPDATE`, `DELETE` ou `INSERT`
- Nao houve reajuste real
- Nao houve `git add`, `git commit`, `git push`, `git clean`, `git reset` ou `git restore`
- Nao foi criado, editado, salvo ou documentado nada nas pastas proibidas
- A blindagem textual/mojibake foi respeitada

