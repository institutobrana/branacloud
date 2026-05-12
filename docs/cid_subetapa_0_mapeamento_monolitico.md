# CID - Subetapa 0 - Mapeamento monolitico

## Branch e estado inicial

- Branch atual: `modularizacao-segura-fase-1`
- Working tree antes da analise: limpo
- Ultimos commits relevantes:
  - `46f49b9` - Cria plano de retomada da modularizacao segura
  - `f3cab35` - Corrige duplo clique em convenios e planos no monolitico
  - `1dc8b18` - Restaura frontend monolitico e corrige contratos globais pos-reversao

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`

## Documentos consultados

Lidos com sucesso:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`

Nao encontrados no estado atual:

- `docs/frontend_modularizacao_fase_3_cid.md`
- `docs/frontend_auditoria_pos_fase_3_cid.md`
- `docs/frontend_correcao_cid_duplo_clique_checkbox.md`

## Mapa de funcoes CID no `app.js`

### Funcoes identificadas

| Funcao | Categoria | Observacao |
|---|---|---|
| `cidEnsureUI()` | helper com DOM | Cria estilos, HTML do painel e referencias do CID |
| `cidFiltrar()` | helper com DOM | Filtra usando o campo de busca do proprio painel |
| `cidRender()` | renderizacao/listagem | Renderiza a tabela em batches e atualiza selecao |
| `cidSelecionado()` | estado global | Retorna o CID selecionado no cache |
| `cidCarregar()` | fetch/API | Busca registros em `GET /cid` |
| `cidPreencherModal(item)` | modal/formulario | Preenche o modal de CID com item existente |
| `cidMontarPayload()` | modal/formulario | Monta payload para salvar CID |
| `cidSalvarModal()` | fetch/API | Faz `POST /cid` ou `PUT /cid/{id}` |
| `cidExcluirSelecionado()` | fetch/API | Faz `DELETE /cid/{id}` |
| `cidAbrirModal(modo)` | modal/formulario | Abre modal de novo/editar |
| `cidFecharModal()` | modal/formulario | Fecha modal |
| `cidVincularEventos()` | evento/bind | Liga busca, clique, botoes e modal |
| `cidAbrir()` | integracao com shell | Abre painel via menu e carrega lista |

### Funcao de abertura do modulo

- `cidAbrir()`
- Resumo: prepara UI, liga eventos, esconde outros paineis, mostra o painel CID, carrega os dados e atualiza a mensagem de rodape.

### Funcao de carregamento/listagem

- `cidCarregar()`
- Endpoint: `GET /cid`

### Funcao de renderizacao/lista

- `cidRender()`
- Usa `requestAnimationFrame` e renderiza em lotes para a tabela.

### Funcao de selecao de linha

- `cidSelecionado()` para ler o item atual
- A selecao visual e atualizada em `cidRender()`
- O clique na tabela atualiza `cidSelId` em `cidVincularEventos()`

### Funcoes de duplo clique

- Nao ha handler separado de duplo clique no bloco CID atual
- O modulo usa clique simples na tabela e botoes de editar para abrir o modal

### Funcao de checkbox

- `cidPreencherModal(item)` e `cidMontarPayload()` tratam o campo `preferido`
- O checkbox aparece como `cid.modalPreferidos`

### Funcoes de novo / editar

- `cidAbrirModal("novo")`
- `cidAbrirModal("editar")`

### Funcao de salvar

- `cidSalvarModal()`

### Funcao de excluir

- `cidExcluirSelecionado()`

### Funcao de fechar modal

- `cidFecharModal()`

## Mapa de variaveis e estado CID

### Estado local do modulo

- `cid`
- `cidCache`
- `cidSelId`
- `cidBuscaTimer`
- `cidRenderToken`

### Classificacao

| Variavel | Categoria | Observacao |
|---|---|---|
| `cid` | estado global / referencia DOM | Armazena ponteiros do painel e do modal |
| `cidCache` | estado global | Cache dos itens carregados |
| `cidSelId` | estado global | ID selecionado na tabela |
| `cidBuscaTimer` | estado global | Timer do filtro de busca |
| `cidRenderToken` | estado global | Protege o render em lotes contra corrida |

## Mapa de eventos e binds CID

### Eventos identificados

| Evento | Onde | Categoria | Observacao |
|---|---|---|---|
| `input` | `cid.busca` | evento/bind | Debounce do filtro |
| `click` | `cid.tbody` | evento/bind | Seleciona a linha clicada |
| `click` | `cid.btnNovo` | evento/bind | Abre modal de novo CID |
| `click` | `cid.btnEditar` | evento/bind | Abre modal de edicao |
| `click` | `cid.btnExcluir` | evento/bind | Exclui CID selecionado |
| `click` | `cid.btnFechar` | evento/bind | Fecha o painel CID |
| `click` | `cid.modalCancelar` | evento/bind | Fecha o modal |
| `click` | `cid.modalOk` | evento/bind | Salva o modal |
| `click` no backdrop | `cid.modalBackdrop` | evento/bind | Fecha o modal ao clicar fora |
| menu `data-menu-action="tabelas-cid"` | `frontend/index.html` + dispatcher | integracao com shell | Abre o modulo CID |

## Mapa de seletores e IDs DOM CID

### IDs / classes usados

- `cid-panel`
- `cid-search`
- `cid-grid`
- `cid-total`
- `cid-modal-backdrop`
- `cid-modal`
- `cid-modal-body`
- `cid-modal-actions`
- `cid-modal-title`
- `cid-modal-codigo`
- `cid-modal-doenca`
- `cid-modal-observacoes`
- `cid-modal-preferidos`
- `cid-modal-ok`
- `cid-modal-cancelar`
- `cid-tbody`

### Observacao tecnica

- O CID usa um painel proprio com tabela, busca, modal e rodape.
- A renderizacao depende de `cid.tbody`, `cid.total`, `cid.busca` e dos campos do modal.

## Mapa de endpoints CID

| Acao | Endpoint | Metodo | Categoria |
|---|---|---|---|
| carregar lista | `/cid` | `GET` | fetch/API |
| salvar novo | `/cid` | `POST` | fetch/API |
| salvar edicao | `/cid/{id}` | `PUT` | fetch/API |
| excluir | `/cid/{id}` | `DELETE` | fetch/API |

## Contratos globais e `window.*`

- Nao foi identificado contrato especifico `window.cid*` no trecho analisado
- O modulo depende de contratos globais do shell:
  - `hideAllPanels()`
  - `ensurePanelChrome()`
  - `ensureModalChrome()`
  - `workspaceEmpty`
  - `footerMsg`
  - `requestJson()`
  - `esc()`
  - `window.requestAnimationFrame()`
  - `window.setTimeout()`
  - `window.alert()`
  - `window.confirm()`

## Dependencias compartilhadas

### Shell / menu

- `executarAcaoMenu("tabelas-cid")`
- `data-menu-action="tabelas-cid"` no HTML
- `hideAllPanels()`
- `ensurePanelChrome()`
- `ensureModalChrome()`

### Estado compartilhado

- `cid`
- `cidCache`
- `cidSelId`
- `cidBuscaTimer`
- `cidRenderToken`

### API compartilhada

- `requestJson()`

## Classificacao por risco

| Item | Risco | Motivo |
|---|---|---|
| `cidFiltrar()` | medio | Depende do DOM do painel e do estado da busca |
| `cidRender()` | medio | Faz render em lotes e controla selecao |
| `cidSelecionado()` | baixo | Leitura de estado, mas ainda acoplada ao cache do modulo |
| `cidCarregar()` | alto | Depende de API e autenticao |
| `cidPreencherModal()` | medio | Manipula DOM do modal |
| `cidMontarPayload()` | medio | Depende do modal e dos campos visiveis |
| `cidSalvarModal()` | alto | Escreve na API |
| `cidExcluirSelecionado()` | alto | Remove dados na API |
| `cidAbrirModal()` | alto | Depende de estado, DOM e modal |
| `cidFecharModal()` | medio | Opera no DOM do modal |
| `cidVincularEventos()` | alto | Ligacao critica com a UI |
| `cidAbrir()` | alto | Integra com o shell e carrega a tela |

## Candidatos seguros para Subetapa 1/2

### Candidatos iniciais reais

No trecho CID analisado, nao foram encontrados helpers verdadeiramente puros que sejam candidatos ideais para mover primeiro.

### Observacao importante

- As funcoes do CID estao todas ligadas a DOM, estado, eventos ou API.
- O unico reaproveitamento inicial aceitavel deve vir de:
  - pequenas constantes
  - mapeamentos
  - formatacoes simples, se forem separadas em utilitario puro no futuro

## Itens proibidos de mover agora

- `cidAbrir()`
- `cidVincularEventos()`
- `cidRender()`
- `cidCarregar()`
- `cidAbrirModal()`
- `cidSalvarModal()`
- `cidExcluirSelecionado()`
- `cidPreencherModal()`
- `cidFecharModal()`
- qualquer coisa dependente de `cidSelId`, `cidCache`, `cidRenderToken` ou `cidBuscaTimer`
- qualquer coisa que dependa de `requestJson()`
- qualquer coisa que dependa do menu ou do shell

## Recomendaçao tecnica para a proxima subetapa

- Fazer uma revisao de granularidade dentro do CID para descobrir se ha pequenas funcoes puras auxiliares que possam ser destacadas sem DOM.
- Se nao houver helpers puros suficientes, seguir com uma modularizacao por consolidacao de wrapper:
  - manter `cidAbrir()` no `app.js`
  - mover apenas a construcao de HTML ou constantes realmente puras, se aparecerem
- Evitar mover renderizacao ou binds antes de uma divisao de helpers puros.

## Checklist manual futuro para testar CID

1. Abrir `Tabelas > Doenças (CID)...`
2. Confirmar que o painel abre.
3. Digitar na busca e verificar o filtro.
4. Clicar em uma linha e verificar a selecao.
5. Abrir o modal de novo CID.
6. Abrir o modal de edicao com um item selecionado.
7. Salvar um CID de teste em ambiente apropriado.
8. Excluir um CID de teste em ambiente apropriado.
9. Conferir o console do navegador em busca de erros.

