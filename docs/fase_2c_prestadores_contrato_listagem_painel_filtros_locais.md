# Fase 2C - Prestadores - Contrato da listagem, painel e filtros locais

## Objetivo

- Registrar o contrato especifico para o bloco visual complementar de `Prestadores`.
- A frente foi confirmada como `comum/core`.
- A origem da decisao foi `F2C-CURTA2-B`.
- O recorte proposto junta listagem/painel e filtros locais simples como a fronteira documental mais util para o proximo passo.
- Nenhum codigo ou banco foi alterado nesta etapa documental.

## Contexto

- `Prestadores` foi classificado como modulo comum/core.
- A matriz curta anterior apontou `Prestadores` como melhor proxima frente na Fase 2C.
- A recomendacao operacional foi o bloco visual complementar da listagem/painel com filtros locais simples.
- O contrato precisa manter distancia de carga remota, salvamento, exclusao, permissao e backend.
- A blindagem textual/mojibake foi respeitada.

## Estado atual de Prestadores

- `frontend/app.js` ainda concentra as funcoes principais da frente.
- `frontend/js/modules/prestadores.js` ja expoe helpers passivos para listagem, selecao visual e filtros.
- O painel principal possui toolbar, filtros por especialidade e nome, grid/tabela e selecao de linha.
- A carga remota continua em `prestCarregar()`, via `requestJson("GET", "/cadastros/prestadores", ...)`.
- O fluxo visual e local ja tem base suficiente para um contrato de reducao real.

## Classificacao multi-area confirmada

- `Prestadores` e tratado como modulo comum/core.
- A superficie da frente mistura visual, filtros locais, carregamento remoto e estados de selecao.
- A parte visual e local e a unica candidata segura para a proxima extracao.
- As areas remotas e sensiveis permanecem fora do contrato.

## Mapa de arquivos e funcoes

### `frontend/app.js`

- `prestFiltrarLista()`
- `prestRender()`
- `prestSelecionarLinha(tr)`
- `prestCarregar()`
- `prestAcoesPlaceholder(rotulo)`
- `prestEnsureUI()`
- `prestAbrir()`
- `prestSelecionado()`
- `prestStatusHtml()`
- `prestFmtCodigo()`

### `frontend/js/modules/prestadores.js`

- `prestFmtCodigo`
- `prestSelecionado`
- `prestFiltrarLista`
- `prestStatusHtml`
- `prestRenderLista`
- `prestSelecionarLinhaVisual`

### Leitura tecnica

- `prestRender()` pode delegar a montagem da lista ao modulo passivo.
- `prestFiltrarLista()` ja concentra a filtragem local por especialidade e nome.
- `prestSelecionarLinha(tr)` ja separa selecao funcional de destaque visual.
- `prestEnsureUI()` monta o shell do painel e os campos de filtro.
- `prestCarregar()` continua como fronteira remota e nao deve entrar neste contrato.

## Separacao entre visual/local e sensivel

- Visual/local:
  - renderizacao da listagem
  - destaque visual da linha selecionada
  - filtros locais por especialidade e nome
  - shell/painel visual
- Sensivel:
  - `requestJson`
  - carga remota
  - payload
  - salvamento
  - exclusao
  - agenda
  - convenios
  - comissoes
  - permissões
  - backend
  - banco

## Riscos por area

- Renderizacao da listagem: baixo.
- Filtros locais simples: medio.
- Shell visual/painel: baixo-medio.
- Selecao funcional: medio.
- Carga remota: alto.
- Salvamento/exclusao: alto.
- Integracoes com agenda/convenios/comissoes: alto.
- Backend/banco/permissoes: critico.

## Micro-recortes avaliados

### PREST-F2C-1

- Apenas renderizacao visual da listagem.
- Risco baixo.
- Boa fronteira, mas ainda muito curta para absorver o valor da frente.

### PREST-F2C-2

- Apenas filtros locais simples.
- Risco medio.
- Pega uma area util, mas fica acoplada ao estado da listagem.

### PREST-F2C-3

- Listagem/painel visual + filtros locais simples.
- Risco medio controlado.
- E o recorte mais coerente com o estado atual do codigo.

### PREST-F2C-4

- Selecao funcional junto do visual.
- Risco medio-alto.
- Fica perto demais de estado global e sincronizacao.

### PREST-F2C-5

- Carga remota, payload ou salvamento.
- Risco alto.
- Nao e candidato seguro para esta rodada.

## Decisao final

- A decisao final registrada e `F2C-PREST-C`.
- O recorte recomendado une listagem/painel visual com filtros locais simples.
- A selecao funcional, a carga remota e os fluxos sensiveis continuam fora do contrato imediato.
- O contrato deve preservar fallback local em `frontend/app.js` caso a implementacao venha a ser feita.

## Proxima etapa recomendada

- Se houver autorizacao para implementacao, criar uma extracao real pequena para o bloco visual/painel + filtros locais simples.
- Antes de qualquer codigo, criar backup controlado da area afetada.
- Preservar `requestJson`, payload, salvamento, exclusao, agenda, convenios, comissoes, permissões e backend fora do recorte.

## Arquivos permitidos e proibidos

### Permitidos

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/11_roadmap_desenvolvimento.md`
- um futuro documento de implementacao/validacao da Fase 2C

### Proibidos

- `frontend/index.html`
- backend funcional
- banco
- schema/migrations/seeds/endpoints
- `.env`
- dumps e backups fora do backup controlado da rodada

## Backup futuro

- Se a implementacao for autorizada depois, criar backup controlado em uma pasta especifica da Fase 2C para `Prestadores`.
- O backup deve cobrir `frontend/app.js` e `frontend/js/modules/prestadores.js` antes de qualquer edicao.

## Onde testar

- Abrir a tela de `Prestadores`.
- Conferir a listagem principal.
- Conferir filtros por especialidade e nome.
- Conferir abertura e fechamento do painel.
- Conferir destaque visual da linha selecionada como nao-regressao.
- Verificar que agenda, convenios e comissoes continuam fora do recorte.

## Confirmacoes de escopo

- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- `frontend/index.html` nao foi alterado.
- backend nao foi alterado.
- banco/schema/migrations/seeds/endpoints nao foram alterados.
- `requestJson`, payload, salvamento, exclusao, agenda, convenios, comissoes e permissões nao foram alterados.
- A blindagem textual/mojibake foi respeitada.

## Registro para roadmap

- Este contrato documental de `Prestadores` deve ser refletido no roadmap.
- O roadmap deve registrar a classificacao `comum/core`, a origem `F2C-CURTA2-B`, a decisao final `F2C-PREST-C` e a recomendacao de listagem/painel + filtros locais simples.
