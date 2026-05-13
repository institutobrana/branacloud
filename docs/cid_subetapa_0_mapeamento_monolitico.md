# CID - Subetapa 0: mapeamento monolitico

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. Status do working tree antes

- `git status --short` antes: `?? docs/varredura_proximo_modulo_pos_plano_contas.md`
- `git diff --stat` antes: sem alteracoes funcionais

## 3. Observacao sobre arquivos pendentes

- Havia apenas o arquivo documental pendente `docs/varredura_proximo_modulo_pos_plano_contas.md`.
- O arquivo `docs/cid_subetapa_0_mapeamento_monolitico.md` ja existia no historico e foi atualizado com o estado atual do app.js, preservando a trilha documental.
- Nenhum JS funcional estava pendente nesta auditoria.

## 4. Ultimos commits relevantes

- `39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas`
- `b415b5c Encerra ciclo seguro de helpers de Unidades`
- `ab102c8 Audita helpers modulares de Unidades`
- `91b65e9 Usa helper modular de telefone em Unidades com fallback`
- `45419a5 Usa helper modular de codigo em Unidades com fallback`
- `795c664 Usa helper modular de status em Unidades com fallback`
- `6b2ae0e Carrega modulo de Unidades de forma passiva`
- `7ea7c65 Compara helpers de Unidades no modulo controlado`

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`

## 6. Documentos consultados

- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md` ja existia no historico e foi revisado nesta auditoria

## 7. Confirmacao de que nenhum codigo funcional foi alterado

- Nenhum arquivo funcional foi alterado nesta etapa.
- Esta subetapa foi apenas de auditoria e mapeamento.

## 8. Onde o modulo CID aparece no menu/shell

- Menu:
  - `frontend/index.html:2635` - botao `data-menu-action="tabelas-cid"` com label `Doenças (CID)...`
- Shell/painel:
  - `frontend/app.js:10873` - estilos do painel `cid-panel`
  - `frontend/app.js:10875` - markup do painel `cid-panel` e do modal `cid-modal-backdrop`
  - `frontend/app.js:11001` - fluxo de abertura `cidAbrir()`

## 9. Funcoes encontradas e classificacao

| Funcao | Classificacao | Observacao |
|---|---|---|
| `cidEnsureUI()` | abertura/painel + DOM | cria painel, modal e referencia elementos |
| `cidRender()` | renderizacao | aplica filtro e pinta a tabela |
| `cidSelecionado()` | selecao/lookup | retorna item selecionado em cache |
| `cidCarregar()` | carregamento/API | faz `GET /cid` e atualiza cache |
| `cidSalvarModal()` | modal/salvar/API | grava com `POST` ou `PUT` e recarrega |
| `cidExcluirSelecionado()` | excluir/API | faz `DELETE /cid/{id}` e recarrega |
| `cidAbrirModal(modo)` | modal | abre modal para novo/editar |
| `cidFecharModal()` | modal | fecha o modal |
| `cidVincularEventos()` | evento/bind | liga busca, tabela e botoes |
| `cidAbrir()` | abertura/painel | fluxo de entrada pelo shell/menu |

## 10. Variaveis/estado/cache

- `cid`
- `cidCache`
- `cidSelId`
- `cidBuscaTimer`
- `cidRenderToken`

## 11. Elementos de DOM usados

- `cid-panel`
- `cid-tbody`
- `cid-busca`
- `cid-total`
- `cid-btn-novo`
- `cid-btn-editar`
- `cid-btn-excluir`
- `cid-btn-fechar`
- `cid-modal-backdrop`
- `cid-modal-title`
- `cid-modal-codigo`
- `cid-modal-doenca`
- `cid-modal-observacoes`
- `cid-modal-preferidos`
- `cid-modal-ok`
- `cid-modal-cancelar`

## 12. Eventos/binds

- `input` em `cid-busca` para limpar filtro e re-renderizar
- `click` em linha da tabela para selecionar item
- `click` em `cid-btn-novo`
- `click` em `cid-btn-editar`
- `click` em `cid-btn-excluir`
- `click` em `cid-btn-fechar`
- `click` em `cid-modal-ok`
- `click` em `cid-modal-cancelar`
- nao foi identificado duplo-clique nativo no CID

## 13. Fluxo de abertura

- O menu `Doenças (CID)...` chama `cidAbrir()` via dispatcher do app.
- `cidAbrir()` chama `cidEnsureUI()`, depois `cidVincularEventos()`, abre o painel, limpa busca e faz `cidCarregar()`.

## 14. Fluxo de carregamento/listagem

- `cidCarregar()` faz `GET /cid`.
- A resposta alimenta `cidCache`.
- `cidRender()` desenha a tabela filtrando por `cid.busca.value`.
- O token `cidRenderToken` protege contra re-render concorrente.

## 15. Fluxo de selecao

- O clique em uma linha define `cidSelId`.
- `cidSelecionado()` resolve o item atual em `cidCache`.
- O fluxo de busca zera a selecao e chama `cidRender()`.

## 16. Fluxo de novo/alterar

- `cid.btnNovo` abre `cidAbrirModal("novo")`.
- `cid.btnEditar` verifica se existe selecao e chama `cidAbrirModal("editar")`.
- `cidAbrirModal()` preenche ou limpa os campos do modal.

## 17. Fluxo de excluir

- `cidExcluirSelecionado()` usa o item selecionado.
- Faz `DELETE /cid/{id}`.
- Em sucesso, limpa selecao e chama `cidCarregar()`.

## 18. Fluxo de modal

- Modal proprio do CID existe em `cid-modal-backdrop`.
- `cidAbrirModal()` controla abertura e preenchimento.
- `cidSalvarModal()` monta payload e grava via `requestJson`.
- `cidFecharModal()` fecha o modal.

## 19. Endpoints/API usados

- `GET /cid`
- `POST /cid`
- `PUT /cid/{id}`
- `DELETE /cid/{id}`

## 20. Dependencias compartilhadas

- `requestJson`
- `esc`
- `hideAllPanels`
- `workspaceEmpty`
- `footerMsg`
- `ensureModalChrome`
- `ensurePanelChrome`
- `closeWorkspacePanel`
- `cadModalAbrir` nao e usado diretamente pelo CID
- `bindStandardGridActivation` nao e usado pelo CID
- nao foi identificado uso de `window.*` funcional para o CID

## 21. Possiveis helpers puros candidatos

- Nenhum helper puro seguro foi identificado para mover de imediato.
- O conjunto parece orientado a DOM, estado e API desde o inicio.

## 22. Itens que NAO devem ser movidos nas proximas subetapas

- `cidEnsureUI()`
- `cidAbrir()`
- `cidCarregar()`
- `cidRender()`
- `cidSelecionado()`
- `cidAbrirModal()`
- `cidFecharModal()`
- `cidSalvarModal()`
- `cidExcluirSelecionado()`
- `cidVincularEventos()`
- qualquer bind de botao, busca ou tabela
- qualquer uso de `requestJson`
- qualquer dependencia de modal/painel do shell
- qualquer fluxo de abertura pelo menu

## 23. Riscos especificos do modulo CID

- Alta dependencia de DOM e estado local.
- Fluxo pequeno, mas sem helper puro seguro para extração imediata.
- Salvamento e exclusao dependem de contrato de backend e validação de regras que ainda nao foram segmentadas.

## 24. Recomendacao para Subetapa 1

- Criar apenas uma estrutura modular passiva e controlada para CID, sem mover comportamento funcional.
- Nao tentar wrapper, extração de helper ou controle de fluxo antes de uma nova fronteira ser documentada.

## 25. Onde testar no navegador antes de avançar

- Fazer `Ctrl+F5`.
- Abrir `Doenças (CID)...`.
- Confirmar abertura do painel.
- Confirmar carregamento da lista.
- Testar selecao de uma linha.
- Testar busca/filtro.
- Testar botao `Nova doença...`.
- Testar botao `Altera...`.
- Testar botao `Elimina`.
- Fechar o painel.
- Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
