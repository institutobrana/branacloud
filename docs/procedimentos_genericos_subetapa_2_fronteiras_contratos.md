# Subetapa 2 - Fronteiras, contratos e dependencias monetarias de Procedimentos Genericos

Data: 2026-05-14

## 1. Contexto
Esta etapa e documental e nao move comportamento funcional.

Ela consolida a fronteira atual do modulo Procedimentos Genericos depois de:

- Subetapa 0: mapeamento monolitico
- Subetapa 1: namespace passivo/controlado
- correcao monetaria posterior ao teste manual, que ajustou `procFmtMoeda(v)` para nao reinterpretar numeros ja numericos como texto BR

Estado de referencia:

- branch esperada: `modularizacao-segura-fase-1`
- modulo ativo continua no `frontend/app.js`
- namespace passivo continua em `frontend/js/modules/procedimentos-genericos.js`
- o fluxo monetario sensivel continua sendo parte do app monolitico

## 2. Comandos iniciais executados
Saidas registradas no inicio da revisao:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short
 M frontend/app.js
 M frontend/index.html
?? docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js

git diff --stat
 frontend/app.js     | 2 +-
 frontend/index.html | 1 +
 2 files changed, 2 insertions(+), 1 deletion(-)
```

```text
git log --oneline -10
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
```

## 3. Documentos lidos
Documentos obrigatorios encontrados e analisados:

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- documentos localizados via busca em `docs/` com termos como:
  - procedimento generico
  - pgen
  - cenario financeiro
  - materiais vinculados
  - monetario
  - moeda
  - decimal
  - parse
  - centavos
  - virgula
  - ponto

Documentos ausentes:

- nenhum documento obrigatorio da lista acima estava ausente
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`: presente
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`: presente
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`: presente
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`: presente

## 4. Arquivos analisados
Arquivos de codigo analisados:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`

Arquivos de backend e contrato consultados para fechar origem e formato dos valores:

- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`
- `backend/routes/materiais_routes.py`
- `backend/models/material.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`

## 5. Localizacao do modulo no app.js
Os pontos mais importantes do modulo ainda estao no monolito `frontend/app.js`.

Referencias aproximadas encontradas:

- `pgenAbrir()` em torno de `23175`
- `pgenCalcularCustos()` em torno de `3748`
- `pgenStatusDot(inativo)` em torno de `3783`
- binds do modulo em torno de `4207-4255`
- `pgenPayloadFromState(state)` em torno de `3647`
- `pgenDetalheParaEstado(data)` em torno de `3663`
- `procFmtMoeda(v)` em torno de `671`
- `procParse(v)` em torno de `670`
- `procCarregarCenario()` em torno de `738`
- `procAtualizarFinanceiro()` em torno de `739`
- `procRenderLinks(data)` em torno de `740`
- `procRecarregarLinks()` / vinculos de materiais em torno de `3293-3296`

## 6. Fronteira atual do modulo
A fronteira atual ficou assim:

- `frontend/app.js` continua sendo a fonte funcional da verdade
- `frontend/js/modules/procedimentos-genericos.js` e passivo, apenas documenta o modulo
- nenhuma funcao funcional de Procedimentos Genericos foi movida nesta etapa
- o fluxo de abertura, lista, edicao, salvamento, exclusao, fases, materiais e custos continua no `app.js`
- a dependencia monetaria mais sensivel continua sendo compartilhada com o restante do monolito

Pontos que continuam no `app.js` por risco de acoplamento:

- abertura principal do painel
- carregamento da lista
- editor principal
- persistencia
- exclusao
- vinculos de fases
- vinculos de materiais
- calculo de custos
- leitura do cenario financeiro
- formatacao monetaria compartilhada

## 7. Contrato monetario e dependencias financeiras
### 7.1 Funcoes monetarias compartilhadas
As funcoes compartilhadas que definem o contrato monetario atual sao:

- `toFloat(v)`
- `formatMoney(v)`
- `procParse(v)`
- `procFmtMoeda(v)`
- `procFmtBr(v)`

Contrato observado:

- `toFloat(v)` normaliza texto monetario BR para numero
- `procParse(v)` trata entrada textual do editor e retorna numero ou erro
- `formatMoney(v)` formata moeda BR via `toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`
- `procFmtMoeda(v)` formata valores monetarios exibidos no modulo
- `procFmtBr(v)` formata numero com duas casas e virgula para campos de entrada/edicao

### 7.2 Correcao monetaria aplicada antes desta subetapa
A correcao anterior foi consolidada no `app.js`:

- `procFmtMoeda(v)` nao reinterpreta mais numero ja numerico como texto BR
- isso evita transformar `138.89` em `13889`
- a funcao ainda preserva fallback para strings monetarias brasileiras

### 7.3 Dependencia com Cenario Financeiro
O custo da hora clinica vem do contrato do cenario financeiro:

- `GET /cenario`
- campos relevantes: `cfph`, `cfpm`, `ir`, `cd`, `cartao`
- backend model trata esses campos como `Float`
- o frontend armazena em `procCenario`
- `pgenCalcularCustos()` usa `procCenario.cfph` para `custoHoraClinica`
- `pgenCalcularCustos()` usa `procCenario.cfpm * tempo` para custo fixo de intervencao

O contrato observado nao sugere centavos no backend. O problema original foi de formatacao na borda de exibicao, nao de schema.

### 7.4 Dependencia com Materiais
O custo de materiais vem do contrato de materiais vinculados:

- `GET /procedimentos/{id}`
- campo `materiais_vinculados`
- totais observados: `total_custo_und`, `total_custo`
- campos observados por item: `custo_und`, `quantidade`, `custo_total`
- backend usa `Float` para `Material.custo` e `ProcedimentoGenericoMaterial.quantidade`

Em `pgenCalcularCustos()`, o custo de materiais e calculado a partir de:

- `pgenEditorState.materiais`
- `Number(item.custo_und||0) * Number(item.quantidade||0)`

### 7.5 Dependencia com Procedimentos
O modulo Procedimentos Genericos compartilha contratos com Procedimentos normais:

- leitura de cenario
- calculos de custo
- formatacao monetaria
- materiais vinculados
- helpers de entrada monetaria

Isso significa que qualquer alteracao em `procFmtMoeda`, `procParse`, `toFloat` ou `procFmtBr` pode impactar mais de um modulo.

## 8. Contrato dos helpers candidatos
### 8.1 `pgenStatusDot(inativo)`
Situacao:

- helper puro e isolado
- retorna um `span`/HTML de status com base apenas no argumento
- nao usa DOM, API, estado global ou side effect

Classificacao atual:

- PURO

Risco de extracao:

- baixo

### 8.2 `pgenPayloadFromState(state)`
Situacao:

- monta payload de procedimento generico a partir de um objeto `state`
- converte campos numericos, filtra listas de fases e materiais e normaliza textos
- nao chama API
- nao usa DOM
- nao altera estado global

Classificacao atual:

- PURO, mas com contrato de forma de objeto bem amplo

Observacao de fronteira:

- e um candidato futuro bom, mas ainda deve permanecer no `app.js` ate a proxima subetapa de extracao
- qualquer mudanca no shape de `state` precisa ser validada contra o backend

### 8.3 `pgenDetalheParaEstado(data)`
Situacao:

- transforma resposta do backend em estado de editor
- depende de `pgenTabelaNomePorId()` para resolver nomes de vinculos
- usa cache compartlhado e lookup de tabela

Classificacao atual:

- QUASE PURO ou NAO PURO, dependendo do ponto de vista do cache

Conclusao conservadora:

- nao e bom candidato para extracao nesta etapa
- deve continuar em `app.js`

## 9. Funcoes e trechos que nao devem ser movidos agora
Permanecem no `app.js` por risco de acoplamento:

- `pgenAbrir()`
- `pgenCarregar()`
- `pgenAbrirEditor()`
- `pgenSalvarEditor()`
- `pgenExcluirSelecionado()`
- `pgenAbrirFases()`
- `pgenFaseEditAbrir()`
- `pgenFaseEditSalvar()`
- `pgenFaseExcluirSelecionada()`
- `pgenAbrirMateriais()`
- `pgenMaterialEditAbrir()`
- `pgenMaterialEditSalvar()`
- `pgenMaterialExcluirSelecionado()`
- `pgenCalcularCustos()`
- `pgenAtualizarCustoMaterialEditor()`
- `procCarregarCenario()`
- `procAtualizarFinanceiro()`
- `procRenderLinks()`
- `procRecarregarLinks()`
- `procFormatarCampoBr()`
- `procParse()`
- `procFmtMoeda()`
- `procFmtBr()`

Trechos especialmente sensiveis:

- qualquer fluxo que mexa em `procCenario`
- qualquer fluxo que leia `materiais_vinculados`
- qualquer fluxo que atualize `pgenEditorState`
- qualquer fluxo que formate ou parseie moeda

## 10. Riscos especificos
Riscos tecnicos identificados:

- `procFmtMoeda` e compartilhada por mais de um modulo
- `toFloat` remove milhares em ponto e e sensivel a texto BR
- `procParse` e mais restritiva para entrada textual
- o editor usa `pgenEditorState` e DOM ao mesmo tempo
- o custo de materiais depende do vinculo entre procedimento e material
- o custo da hora clinica depende do cenario financeiro carregado via API
- o modulo ainda compartilha cache e lookup com o restante do `app.js`

Riscos de acoplamento:

- Procedimentos
- Cenario Financeiro
- Materiais
- Tabelas auxiliares
- helpers monetarios compartilhados

## 11. Recomendacao conservadora para Subetapa 3
Recomendacao para a proxima subetapa, se os testes de navegador continuarem verdes:

- extrair primeiro apenas `pgenStatusDot(inativo)`
- depois avaliar `pgenPayloadFromState(state)`
- nao extrair `pgenDetalheParaEstado(data)` ainda
- nao tocar em `pgenCalcularCustos()`, `procFmtMoeda()` ou `procParse()` nesta rodada

Motivo:

- `pgenStatusDot` e o candidato mais isolado
- `pgenPayloadFromState` ainda e seguro, mas seu contrato de payload e mais sensivel
- o restante continua preso ao contrato monetario e a caches globais do monolito

## 12. Checks finais
Checks executados e/ou confirmados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/procedimentos-genericos.js`

Resultado:

- ambos passaram sem erro de sintaxe

Estado do git apos a criacao deste relatorio:

```text
 M frontend/app.js
 M frontend/index.html
?? docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

`git diff --stat` continua refletindo apenas as mudancas de codigo ja existentes em `frontend/app.js` e `frontend/index.html`; este relatorio aparece como arquivo novo nao rastreado.

## 13. Onde testar antes de avancar
Teste manual recomendado:

1. Fazer `Ctrl+F5`.
2. Abrir o sistema normalmente.
3. Abrir `Procedimentos Genericos` pelo menu existente.
4. Confirmar que a tela abre como antes.
5. Abrir um procedimento no editor.
6. Ir na aba de custos.
7. Confirmar que `Custo da hora clinica` mostra `R$ 138,89`.
8. Confirmar que `Custo de materiais` nao explode para valores absurdos.
9. Conferir que o custo total continua coerente com hora clinica, tempo, protetico e materiais.
10. Testar um procedimento sem materiais vinculados.
11. Testar um procedimento com materiais vinculados.
12. Fechar sem salvar.
13. Se for seguro, salvar e reabrir para confirmar persistencia.
14. Verificar console sem `ReferenceError` ou `TypeError`.
15. Conferir no console:
   - `window.BranaProcedimentosGenericosModule`
   - `window.BranaProcedimentosGenericosModule.getInfo()`
   - `window.BranaProcedimentosGenericosModule.getStatus()`

## 14. Confirmacao final
- etapa concluida como documental
- nenhum codigo funcional foi alterado nesta etapa
- frontend/app.js nao foi alterado nesta etapa
- frontend/index.html nao foi alterado nesta etapa
- frontend/js/modules/procedimentos-genericos.js nao foi alterado nesta etapa
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhuma modularizacao nova foi feita
- nenhum helper foi extraido
- nenhum commit foi feito

