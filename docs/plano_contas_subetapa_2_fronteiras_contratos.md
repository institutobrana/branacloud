# Plano de Contas - Subetapa 2: fronteiras e contratos

## Estado da analise

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da analise:
  - `M frontend/app.js`
  - `M frontend/index.html`
  - `?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
  - `?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
  - `?? frontend/js/modules/plano-contas.js`
- Status do working tree depois da analise:
  - igual ao estado anterior, com a adicao deste relatorio em `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- Observacao sobre arquivos untracked ou pendentes:
  - os arquivos untracked acima ja existiam antes desta etapa
  - nesta analise nao houve alteracao funcional nova em JS
  - `frontend/app.js` e `frontend/index.html` seguem com alteracoes pre-existentes de etapas anteriores
- `git diff --stat` antes da analise:
  - `frontend/app.js | 3 +--`
  - `frontend/index.html | 3 ++-`

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/unidades.js`

## Documentos consultados

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/unidades_subetapa_0_mapeamento_monolitico.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- `docs/frontend_auditoria_appjs.md`

## Documentos antigos relacionados

- Nao encontrei `docs/plano_contas_correcao_duplo_clique.md`
- Nao encontrei `docs/frontend_correcao_convenios_planos_duplo_clique_pos_reversao.md`
- Encontrei `docs/frontend_auditoria_appjs.md`
- Mantive `docs/plano_contas_subetapa_0_mapeamento_monolitico.md` e `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md` como referencia historica

## Confirmacoes de integridade

- Nao houve alteracao funcional nesta analise
- `frontend/app.js` nao foi alterado nesta etapa
- `frontend/index.html` nao foi alterado nesta etapa
- `frontend/js/modules/plano-contas.js` nao foi alterado nesta etapa
- `frontend/js/modules/unidades.js` nao foi alterado nesta etapa
- `frontend/js/modules/plano-contas.js` nao assumiu controle funcional
- `app.js` continua como fonte funcional da verdade
- nenhum endpoint foi alterado
- nenhum bind foi alterado
- `cadModal`, `aux` e shell nao foram alterados

## Contrato passivo do modulo

- Namespace: `window.BranaPlanoContasModule`
- Estado atual do namespace:
  - `meta`
  - `status`
  - `ativo`
  - `controlaFluxo`
  - `getStatus()`
  - `info()`
- O modulo e passivo:
  - nao chama `planoAbrir()`
  - nao chama `planoCarregar()`
  - nao chama `planoEnsureUI()`
  - nao registra eventos
  - nao faz query de DOM
  - nao faz fetch/API
  - nao usa `requestJson`
  - nao sobrescreve funcoes globais funcionais

## Mapa de fronteiras do Plano de Contas

### 1. Fronteira de shell / painel

- `planoEnsureUI()`
- `planoAbrir()`
- `ensurePanelChrome()`
- `workspaceEmpty`
- `footerMsg`
- `hideAllPanels()`
- `closeWorkspacePanel()`

Observacao:
- `planoEnsureUI()` cria o proprio painel `plano-panel`
- a mesma rotina cria tambem o `aux-panel` e o `cad-modal-backdrop`
- o painel de Plano de Contas ainda depende do shell para esconder/exibir telas

### 2. Fronteira de scaffold compartilhado com Auxiliares

- `aux`
- `auxItensCache`
- `auxSelId`
- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `aux-panel`
- `cad-modal-backdrop`
- reaproveitamento de estrutura entre Plano e Auxiliares dentro de `planoEnsureUI()`

Observacao:
- `auxAbrir()` chama `planoEnsureUI()` para garantir o scaffold compartilhado
- isso mostra que Plano e Auxiliares ainda compartilham base visual e modal

### 3. Fronteira de estado / cache

- `plano`
- `gruposCache`
- `grupoSelId`
- `catSelId`

Observacao:
- o estado do modulo permanece global no `app.js`
- a selecao atual e a grade dependem desse estado mutavel

### 4. Fronteira de renderizacao

- `planoRenderGrupos()`
- `planoRenderCats()`
- dependencia de `esc()`
- dependencia de `gruposCache`, `grupoSelId` e `catSelId`
- dependencia da estrutura HTML gerada em `planoEnsureUI()`

Observacao:
- as duas funcoes escrevem diretamente em `innerHTML`
- a renderizacao continua presa ao DOM do `app.js`

### 5. Fronteira de selecao

- `planoGrupoSel()`
- `planoCatSel()`
- clique simples em grupo
- clique simples em categoria
- re-renderizacao apos selecao

Observacao:
- o fluxo atual de Plano usa um bind local no `app.js` para resolver o problema do duplo clique
- o `dblclick` nativo nao e mais a referencia pratica da grade; o disparo de abertura ficou baseado em dois cliques rapidos no mesmo item

### 6. Fronteira de eventos / binds

- botoes de novo / alterar / excluir / fechar
- `bindPlanoGridActivation()` local dentro do bloco de Plano
- duplo clique em grupo emulado por dois cliques rapidos no mesmo item
- duplo clique em categoria emulado por dois cliques rapidos no mesmo item
- risco de bind duplicado controlado por `tbody.dataset[flag]`

Observacao:
- o Plano de Contas nao esta usando `bindStandardGridActivation()` neste ponto
- a logica de ativacao ficou local para evitar o problema observado no modulo anterior

### 7. Fronteira de modal / salvar

- `planoDialogGrupo()`
- `planoDialogCategoria()`
- `cadModalAbrir()`
- leitura direta de campos por `document.getElementById(...)`
- validacao minima de texto
- montagem de payload
- `requestJson(...)`

Observacao:
- o modal continua generico e compartilhado
- o fluxo de salvar ainda depende do callback do `cadModalAbrir()`

### 8. Fronteira de exclusao / migracao

- `planoExcluirGrupo()`
- `planoExcluirCategoria()`
- `GET /cadastros/categorias/{id}/em-uso`
- `POST /cadastros/categorias/{id}/migrar-e-excluir`
- `DELETE /cadastros/grupos/{id}`
- `DELETE /cadastros/categorias/{id}`

Observacao:
- a exclusao de categoria ainda contem o ramo de migracao de lancamentos
- isso continua fortemente acoplado ao estado `gruposCache`

### 9. Fronteira de API / endpoints

- `GET /cadastros/grupos`
- `POST /cadastros/grupos`
- `PUT /cadastros/grupos/{id}`
- `DELETE /cadastros/grupos/{id}`
- `POST /cadastros/categorias`
- `PUT /cadastros/categorias/{id}`
- `GET /cadastros/categorias/{id}/em-uso`
- `POST /cadastros/categorias/{id}/migrar-e-excluir`

Observacao:
- todos os endpoints continuam no monolito
- o modulo passivo nao conhece esses endpoints

## Mapa de estado / cache

- `plano` - objeto de UI principal do painel
- `gruposCache` - lista de grupos e categorias
- `grupoSelId` - id do grupo selecionado
- `catSelId` - id da categoria selecionada
- `aux` - objeto de UI compartilhado com Auxiliares
- `auxItensCache` - cache de itens auxiliares
- `auxSelId` - selecao atual de Auxiliares
- `cadModal` - utilitario global de modal
- `workspaceEmpty` - area central do shell
- `footerMsg` - status rodape do shell

## Mapa de eventos / binds

- `plano.btnOpen` abre o painel
- `plano.btnFechar` fecha o painel
- `plano.btnNovoGrupo` abre novo grupo
- `plano.btnAlteraGrupo` abre edicao do grupo selecionado
- `plano.btnEliminaGrupo` elimina grupo selecionado
- `plano.btnNovaCat` abre nova categoria
- `plano.btnAlteraCat` abre edicao da categoria selecionada
- `plano.btnEliminaCat` elimina categoria selecionada
- `bindPlanoGridActivation(plano.tbGrupos, ...)`
- `bindPlanoGridActivation(plano.tbCats, ...)`
- `bindStandardGridActivation(aux.tbItens, ...)` para Auxiliares
- dispatcher do menu `action === "plano"` continua no `app.js`

Observacao:
- o bind local de Plano usa `click` com janela de tempo curta para simular a abertura por duplo clique
- o bind local tem guard `dataset` para evitar dupla inscricao

## Mapa de endpoints

- `GET /cadastros/grupos`
- `POST /cadastros/grupos`
- `PUT /cadastros/grupos/{id}`
- `DELETE /cadastros/grupos/{id}`
- `POST /cadastros/categorias`
- `PUT /cadastros/categorias/{id}`
- `GET /cadastros/categorias/{id}/em-uso`
- `POST /cadastros/categorias/{id}/migrar-e-excluir`

## Dependencias compartilhadas

### Com Auxiliares

- `aux`
- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `aux-panel`
- `auxItensCache`
- `auxSelId`
- `planoEnsureUI()` criando o `aux-panel` e o `cad-modal-backdrop`

### Com cadModal

- `cadModalAbrir()`
- `cad-modal-backdrop`
- `cad-modal-body`
- `cad-modal-ok`
- `cad-modal-cancelar`

### Com shell

- `hideAllPanels()`
- `closeWorkspacePanel()`
- `ensurePanelChrome()`
- `workspaceEmpty`
- `footerMsg`

## Candidatos a futura extracao

| Candidato | Origem provavel | Depende de DOM? | Depende de fetch/requestJson? | Depende de estado global mutavel? | Depende de Auxiliares? | Depende de cadModal? | Risco | Recomendacao |
|---|---|---:|---:|---:|---:|---:|---|---|
| `validarNomeGrupo(nome)` | Dentro de `planoDialogGrupo()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `validarNomeCategoria(nome)` | Dentro de `planoDialogCategoria()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `montarPayloadGrupo(nome, tipo)` | Callback de salvamento do grupo | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `montarPayloadCategoria(nome, grupo_id, tipo, tributavel)` | Callback de salvamento da categoria | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `gerarOpcoesGrupoParaCategoria(grupos, gid, escFn)` | Montagem do select da categoria | Nao | Nao | Nao, se receber dados por parametro | Nao | Nao | Medio | depende de desacoplamento previo |
| `ordenarCategoriasParaMigracao(categorias, idAtual)` | Ramificacao de exclusao de categoria | Nao | Nao | Nao, se receber dados por parametro | Nao | Nao | Medio | depende de desacoplamento previo |
| `planoGrupoSel()` / `planoCatSel()` | Lookup de selecao atual | Nao | Nao | Sim | Nao | Nao | Alto | nao mover |

Observacao:
- nao encontrei helper puro ja pronto para mover sem primeiro separar o fluxo de modal, selecao e estado
- os candidatos mais promissores sao pequenos e parametricos, mas ainda estao embutidos em callbacks do `app.js`

## Itens que nao devem ser movidos

- `planoEnsureUI()`
- `planoAbrir()`
- `planoCarregar()`
- `planoRenderGrupos()`
- `planoRenderCats()`
- `planoGrupoSel()`
- `planoCatSel()`
- `planoDialogGrupo()`
- `planoDialogCategoria()`
- `planoExcluirGrupo()`
- `planoExcluirCategoria()`
- `cadModalAbrir()`
- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `hideAllPanels()`
- `closeWorkspacePanel()`
- `bindStandardGridActivation()`
- dispatcher do menu `action === "plano"`
- o bind local `bindPlanoGridActivation()` usado no fluxo atual de Plano

## Resultado dos checks

- `node --check frontend/app.js`: sem erros
- `node --check frontend/js/modules/plano-contas.js`: sem erros

## Recomendacao objetiva para a Subetapa 3

- Se o time quiser mover algo na proxima etapa, começar por um helper pequeno e puramente parametricamente isolado, como `validarNomeGrupo` ou `montarPayloadGrupo`
- Nao mover renderizacao, eventos, modal, exclusao, migracao, shell ou scaffold compartilhado
- Se a intencao for manter risco minimo absoluto, a Subetapa 3 deve ser apenas isolamento/documentacao adicional, sem extracao funcional

## Onde testar no navegador antes de prosseguir

1. Fazer `Ctrl+F5`
2. Abrir `Cadastros > Plano de contas...`
3. Confirmar que o painel abre
4. Confirmar que os grupos carregam
5. Confirmar que as categorias carregam ao selecionar grupo
6. Testar clique simples em grupo
7. Testar duplo-clique em grupo
8. Confirmar que abre alteracao de grupo
9. Testar botao Alterar grupo
10. Testar clique simples em categoria
11. Testar duplo-clique em categoria
12. Confirmar que abre alteracao de categoria
13. Testar botao Alterar categoria
14. Testar Novo grupo
15. Testar Nova categoria
16. Testar Excluir categoria, inclusive fluxo de migracao se houver categoria em uso
17. Fechar o painel
18. Abrir `Tabelas auxiliares`
19. Confirmar que `Auxiliares` abre normalmente
20. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo

