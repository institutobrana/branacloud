# Fase 2 - Preferencias / Configuracoes comuns - Subetapa 3 - Isolamento documental dos candidatos mais seguros

## Objetivo

Documentar, por leitura, quais candidatos de menor risco podem ser considerados para uma primeira implementacao futura dentro de `Preferencias / Configuracoes comuns`, sem alterar codigo, sem mover comportamento e sem ampliar o modulo passivo existente.

## Escopo

- Confirmar o contexto operacional desta subetapa.
- Reavaliar apenas os candidatos de menor risco identificados na Subetapa 2.
- Determinar a ordem conservadora de extracao futura.
- Delimitar o proximo recorte funcional minimo, ainda sem implementacao.
- Registrar o que continua proibido nesta rodada.

## Confirmacao de classificacao

`Preferencias / Configuracoes comuns` continua classificado como `core / comum`.

Nao foi feita separacao por area profissional.
Nao foi criada flag multiarea.
Nao foi introduzido comportamento por clinica, especialidade ou perfil profissional.

## Contexto da decisao

Esta subetapa sucede a reavaliacao pos-`Agenda principal`, que concluiu que a continuidade dessa frente passou a ter risco mais sensivel por envolver parse de data, hora e cor nos helpers remanescentes.

A frente `Agenda principal` permanece pausada temporariamente apos as extracoes ja validadas.
A frente `Agenda de contatos` permanece pausada/consolidada e nao deve ser reaberta.

## Resumo da reavaliacao que levou a esta frente

- A `Agenda principal` ja passou por nove helpers extraidos e validados.
- Os helpers restantes da `Agenda principal` foram considerados mais sensiveis.
- `Ficha pessoal`, `Conta corrente`, `Relatorios` e `Indices financeiros` tambem foram avaliados e mantidos fora desta rodada inicial.
- `Preferencias / Configuracoes comuns` surgiu como a frente mais adequada para seguir com modularizacao conservadora.
- A Subetapa 2 mostrou que o fluxo de preferencias ainda esta concentrado em `frontend/app.js`, mas ja existe um modulo passivo inicial para apoio/fallback.

## Confirmacao do ambiente

- Diretorio usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch usada: `modularizacao-segura-fase-1`.
- `git status --short` inicial mostrou somente pendencias antigas de documentos em `docs/`, sem alteracao de codigo nesta etapa.
- Os documentos das Subetapas 1 e 2 existem e foram consultados antes desta analise.

## Estado atual do modulo existente

Arquivo: `frontend/js/modules/preferencias-opcoes-sistema.js`

Estado observado:

- modulo passivo e inicial;
- exposto em `window.BranaPreferenciasOpcoesSistemaModule`;
- contem `getMetadata`, `prefOdontoNorm`, `prefValoresPadraoModelos` e `prefOdontoFindByLabel`;
- carregado no `frontend/index.html` antes de `frontend/app.js`;
- usado como apoio/fallback para tres helpers de modelos e odontograma;
- ainda parcial, nao completo;
- deve continuar passivo por enquanto.

Risco de duplicidade:

- existe duplicidade controlada para `prefValoresPadraoModelos`, `prefOdontoNorm` e `prefOdontoFindByLabel`;
- a duplicidade ainda funciona como fallback, nao como divergencia operacional;
- o modulo atual nao deve absorver comportamentos de DOM, payload, salvamento ou fluxo visual complexo nesta subetapa.

Adequacao como destino futuro:

- o arquivo e adequado como apoio para helpers puros e pequenos;
- nao e adequado, por enquanto, para funcoes de salvamento, coleta de payload, requestJson, estado de modal ou UI complexa;
- se um futuro recorte crescer demais, sera melhor considerar outro arquivo especifico em etapa posterior.

## Candidatos de menor risco reavaliados

### 1) `prefAmbEstiloPadrao`

- Helper puro: sim.
- Usa DOM: nao.
- Usa `window`/`document`: nao.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao.
- Depende de aba ativa: nao.
- Depende de ordem de execucao: apenas para ser consumido por helpers que montam estilos de ambiente.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para `frontend/js/modules/preferencias-opcoes-sistema.js`: sim, com baixo acoplamento.
- Risco real de extracao: baixo.
- Observacoes de compatibilidade: a funcao apenas fornece o estilo padrao base para ambiente, e e usada em outros helpers como valor de referencia.

### 2) `prefValoresPadraoDados`

- Helper puro: sim.
- Usa DOM: nao.
- Usa `window`/`document`: nao.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao diretamente; apenas fornece base padrao para carregamento e fallback de dados.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao.
- Depende de aba ativa: nao.
- Depende de ordem de execucao: nao, mas e chamado como fallback em carregamento e estado inicial.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para o modulo passivo: sim, se houver interesse em agrupar defaults puros.
- Risco real de extracao: baixo.
- Observacoes de compatibilidade: e uma colecao estavel de valores padrao de dados do usuario, sem dependencia de UI.

### 3) `prefValoresPadraoOdontograma`

- Helper puro: sim.
- Usa DOM: nao.
- Usa `window`/`document`: nao.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao diretamente; apenas fornece fallback/base padrao de preferencia do odontograma.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao.
- Depende de aba ativa: nao.
- Depende de ordem de execucao: nao.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para o modulo passivo: sim, por ser um default puro.
- Risco real de extracao: baixo.
- Observacoes de compatibilidade: e estavel, mas envolve varias chaves de preferencias; o recorte continua seguro porque nao faz IO nem altera UI.

### 4) `prefAmbienteTextoExemplo`

- Helper puro: sim.
- Usa DOM: nao.
- Usa `window`/`document`: nao.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao diretamente; apenas devolve texto de exemplo para preview.
- Depende de aba ativa: apenas indiretamente, porque o preview do ambiente usa a secao ativa.
- Depende de ordem de execucao: nao.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para o modulo passivo: sim, mas e menos prioritario que defaults puros.
- Risco real de extracao: baixo.
- Observacoes de compatibilidade: o retorno e apenas uma chave de preview; o unico cuidado e nao misturar com correcao textual/mojibake.

### 5) `prefAmbienteDialogoValor`

- Helper puro: sim, com leitura de `window.easyFontNormalizeStyleId` apenas como adaptacao opcional.
- Usa DOM: nao.
- Usa `window`/`document`: apenas leitura condicional de um helper global externo, sem tocar DOM.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao.
- Depende de aba ativa: nao.
- Depende de ordem de execucao: depende apenas de `window.easyFontNormalizeStyleId` existir para normalizacao mais precisa; caso contrario faz fallback local.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para o modulo passivo: sim, mas exige manter dependencia defensiva do helper global externo.
- Risco real de extracao: baixo a medio.
- Observacoes de compatibilidade: continua seguro, mas ja conversa com a integracao de fonte; por isso nao deve ser o primeiro recorte se quisermos o menor blast radius possivel.

### 6) `prefAmbienteEstiloDeDialogo`

- Helper puro: quase puro, mas com dependencia opcional de `window.easyFontNormalizeStyleId`.
- Usa DOM: nao.
- Usa `window`/`document`: apenas leitura condicional de helper global externo.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Usa tenant/clinica/user_id/contexto: nao.
- Altera interface: nao diretamente.
- Altera texto visivel: nao.
- Depende de aba ativa: nao.
- Depende de ordem de execucao: sim, por causa da normalizacao de estilo e do uso de `prefAmbEstiloPadrao` como base.
- Duplicidade com o modulo passivo: nao existe hoje.
- Pode ser movido futuramente para o modulo passivo: sim, mas com cautela maior que os defaults simples.
- Risco real de extracao: baixo a medio.
- Observacoes de compatibilidade: e util para converter o retorno do dialogo em estilo persistido, mas ja toca a ponte entre preview e estado salvo da aba ambiente.

## Resultado da reavaliacao

- Os candidatos realmente mais seguros para primeira implementacao futura sao os helpers puros de default.
- Entre eles, `prefAmbEstiloPadrao` e o candidato mais conservador.
- `prefValoresPadraoDados` e `prefValoresPadraoOdontograma` tambem sao seguros, mas carregam mais chaves e sao consumidos em fluxos mais amplos de carregamento/salvamento.
- `prefAmbienteTextoExemplo` e seguro, mas e mais ligado ao preview visual do modal.
- `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo` permanecem seguros, mas ja fazem ponte com integracao de fonte e com a coerencia do preview, entao devem ficar apos os defaults mais simples.

## Primeiro candidato recomendado para implementacao futura

`prefAmbEstiloPadrao`

### Justificativa tecnica

- e um helper puro, literal e pequeno;
- nao usa DOM;
- nao usa `requestJson`;
- nao monta payload;
- nao conhece tenant, clinica ou `user_id`;
- nao depende de aba ativa;
- nao altera texto visivel;
- nao altera comportamento de salvamento;
- e consumido como base por outros helpers de ambiente, portanto sua extracao reduz repeticao sem tocar em fluxos sensiveis;
- tem o menor blast radius entre os candidatos revisados.

## Ordem conservadora de extracao futura

1. `prefAmbEstiloPadrao`.
2. `prefValoresPadraoDados`.
3. `prefValoresPadraoOdontograma`.
4. `prefAmbienteTextoExemplo`.
5. `prefAmbienteDialogoValor`.
6. `prefAmbienteEstiloDeDialogo`.

Esta ordem privilegia defaults simples antes de qualquer ponte com preview ou dialogo visual.

## Escopo exato da proxima implementacao futura

Se houver uma proxima implementacao, o recorte recomendado deve ser apenas o helper `prefAmbEstiloPadrao`.

### Arquivo de destino

- `frontend/js/modules/preferencias-opcoes-sistema.js`.

### Exposicao esperada

- o helper pode ser exportado via `window.BranaPreferenciasOpcoesSistemaModule`;
- o modulo pode manter `getMetadata` como hoje;
- a exposicao deve continuar passiva e simples, sem transformar o arquivo em modulo de UI.

### Como `frontend/app.js` chamaria o helper

- `prefAmbEstiloPadrao` passaria a consultar primeiro o modulo passivo quando houver exportacao disponivel;
- em caso de ausencia, `frontend/app.js` manteria um fallback local equivalente;
- o comportamento do usuario nao deve mudar.

### Preservacao de fallback

- manter fallback local identico no primeiro momento;
- nao remover imediatamente a implementacao local ate a validacao manual;
- nao converter a chamada em fluxo dependente de rede ou de DOM.

### Arquivos provavelmente alterados na futura implementacao

- `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js` apenas se o fallback local precisar consultar a nova exportacao.
- possivelmente `frontend/index.html` somente se for necessario ajustar ordem de carregamento, o que nao parece necessario nesta fase.

### Arquivos que nao devem ser alterados na futura implementacao

- backend.
- banco.
- schema.
- migrations.
- seeds.
- endpoints.
- permissoes.
- qualquer arquivo de configuracao.
- qualquer fluxo de multiarea.
- qualquer texto visivel ou mojibake.

### Checks recomendados para a futura implementacao

- confirmar que o helper novo retorna exatamente o mesmo objeto que a implementacao local;
- verificar que a tela de preferencias continua abrindo normalmente;
- conferir que o preview do ambiente permanece igual;
- validar que a janela de usuarios continua abrindo a mesma aba de preferencias;
- confirmar que nao houve regressao nos fluxos de carregamento de preferencias gerais, modelos, ambiente, dados e odontograma.

### Teste funcional que o usuario deve fazer depois

- abrir `Preferencias / Configuracoes comuns` pelo menu e conferir que a aba `Ambiente` continua exibindo o mesmo layout, o mesmo preview e o mesmo comportamento de restauracao de estilo.
- se a extracao futura for apenas de `prefAmbEstiloPadrao`, o teste principal e garantir que o modal abre, troca de aba funciona e a restauracao do estilo padrao continua igual.

## O que nao sera permitido na proxima implementacao

- nao mexer em salvamento;
- nao mexer em `requestJson`;
- nao mexer em payload;
- nao mexer em endpoints;
- nao mexer em senha administrativa;
- nao mexer em permissoes;
- nao mexer em `tenant`/`clinica`/`user_id`;
- nao mexer em renderizacao visual complexa;
- nao mexer em abas;
- nao corrigir textos ou mojibake;
- nao alterar backend, banco, schema, migrations ou seeds.

## Blindagem textual/mojibake

Foi feita leitura sem correcoes de textos visiveis.
Se aparecer algum texto quebrado, label estranha, placeholder inconsistente ou mojibake em leituras futuras, isso deve ser apenas registrado como pendencia documental, sem alteracao de string.

## Pontos de entrada relacionados

- menu global `config-preferencias`.
- menu global `config-opcoes-sistema`.
- janela de usuarios via `usersBtnPreferencias` e `usersAbrirPreferencias`.
- entrada de seguranca via `sysOptCfg.btnSegPermissoes`.
- fechamento global por `closeModalByBackdropId`.
- rotulacao por `modalTitleByBackdropId` e `modalInsetsById`.
- carregamento do modulo passivo antes de `frontend/app.js` no `frontend/index.html`.

## Pendencias futuras registradas

- o modulo passivo ainda e parcial e nao cobre toda a frente;
- a duplicidade controlada entre `frontend/app.js` e o modulo passivo precisa ser tratada com cautela nas proximas etapas;
- qualquer texto quebrado identificado durante leituras futuras deve permanecer apenas como registro documental.

## Recomendacao da proxima subetapa

`Preferencias / Configuracoes comuns - Subetapa 4 - Implementacao minima do helper puro prefAmbEstiloPadrao e validacao manual do fluxo de ambiente`

## Registro para roadmap

- A Subetapa 3 foi concluida como etapa exclusivamente documental.
- Nenhum codigo foi alterado.
- Candidatos de baixo risco foram isolados por leitura.
- O primeiro candidato recomendado para implementacao futura foi `prefAmbEstiloPadrao`.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada foi registrada como implementacao minima do helper puro mais seguro.

## Commit seletivo obrigatorio

Quando a etapa estiver consolidada e apenas os documentos autorizados tiverem sido atualizados, o commit seletivo deve incluir somente:

- `docs/fase_2_preferencias_configuracoes_subetapa_3_isolamento_candidatos_seguros.md`
- `docs/11_roadmap_desenvolvimento.md`

Mensagem sugerida: `Documenta candidatos seguros de preferencias`
