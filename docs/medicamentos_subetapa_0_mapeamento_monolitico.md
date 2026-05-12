# Medicamentos - Subetapa 0 - Mapeamento monolitico

## Branch e estado inicial

- Branch atual: `modularizacao-segura-fase-1`
- Working tree antes da analise: limpo
- Ultimos commits relevantes:
  - `e5a04fc` - Mapeia CID para modularizacao segura
  - `46f49b9` - Cria plano de retomada da modularizacao segura
  - `f3cab35` - Corrige duplo clique em convenios e planos no monolitico
  - `1dc8b18` - Restaura frontend monolitico e corrige contratos globais pos-reversao

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`

## Documentos consultados

Lidos com sucesso:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`

Nao encontrados no estado atual:

- `docs/frontend_modularizacao_fase_4_medicamentos.md`
- `docs/frontend_auditoria_pos_fase_4_medicamentos.md`

## Mapa de funcoes Medicamentos no `app.js`

### Funcoes identificadas

| Funcao | Categoria | Observacao |
|---|---|---|
| `medicamentosEnsureUI()` | helper com DOM | Cria estilo, painel, tabela, modal e referencias DOM |
| `medicamentosSelecionado()` | estado global | Retorna o medicamento selecionado no cache |
| `medicamentosSelecionarLinha(tr)` | evento/bind | Atualiza selecao a partir da linha clicada |
| `medicamentosRender()` | renderizacao/listagem | Renderiza a tabela de medicamentos |
| `medicamentosSetSelectOptions(select,itens,placeholder)` | helper com DOM | Monta `<option>` em selects do modal |
| `medicamentosAplicarTab(tab)` | modal/formulario | Alterna entre abas do modal |
| `medicamentosLimparModal()` | modal/formulario | Limpa campos do modal |
| `medicamentosAplicarModalDados(item={})` | modal/formulario | Preenche campos do modal para edicao |
| `medicamentosCarregarFiltrosGrupo()` | fetch/API | Busca opcoes de grupo |
| `medicamentosCarregarLista()` | fetch/API | Busca a lista paginada/filtrada |
| `medicamentosCarregarCombosModal()` | fetch/API | Busca combos auxiliares do modal |
| `medicamentosFecharModal()` | modal/formulario | Fecha o modal |
| `medicamentosAbrirModal(modo)` | modal/formulario | Abre modal novo/editar |
| `medicamentosPayloadModal()` | modal/formulario | Monta payload de persistencia |
| `medicamentosSalvarModal()` | fetch/API | Salva novo/editar |
| `medicamentosExcluirSelecionado()` | fetch/API | Exclui item selecionado |
| `medicamentosExcluirNoModal()` | fetch/API | Exclui a partir do modal |
| `medicamentosVincularEventos()` | evento/bind | Liga cliques, duplo clique, filtros e modal |
| `medicamentosAbrir()` | integracao com shell | Abre o painel do modulo via menu |

### Funcao de abertura do modulo

- `medicamentosAbrir()`
- Resumo: cria UI se necessario, liga eventos, esconde outros paineis, mostra o painel, carrega filtros e lista, e escreve a mensagem de status.

### Funcao de carregamento/listagem

- `medicamentosCarregarLista()`
- Endpoint: `GET /medicamentos?grupo=...&nome=...&limit=1000`

### Funcao de renderizacao/lista

- `medicamentosRender()`
- Atualiza `tbody` com as linhas e marca a linha selecionada.

### Funcao de selecao de linha

- `medicamentosSelecionarLinha(tr)`
- A linha selecionada e guardada em `medicamentoSelId`.

### Funcao de duplo clique

- Nao existe handler nativo `dblclick`.
- O duplo clique e detectado por tempo no `click` da tabela em `medicamentosVincularEventos()`.
- Se o segundo clique rapido ocorrer na mesma linha, o modulo chama `medicamentosAbrirModal("editar")`.

### Funcao de novo

- `medicamentosAbrirModal("novo")`
- Acionada pelo botao `medicamentosCfg.btnNovo`.

### Funcao de alterar / editar

- `medicamentosAbrirModal("editar")`
- Acionada pelo botao `medicamentosCfg.btnEditar` e pelo duplo clique.

### Funcao de salvar

- `medicamentosSalvarModal()`

### Funcao de excluir

- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`

### Funcao de fechar modal

- `medicamentosFecharModal()`

## Mapa de variaveis e estado Medicamentos

### Estado local do modulo

- `medicamentosCfg`
- `medicamentosCache`
- `medicamentoSelId`
- `medicamentosFiltroTimer`
- `medicamentosUltimoCliqueId`
- `medicamentosUltimoCliqueEm`

### Classificacao

| Variavel | Categoria | Observacao |
|---|---|---|
| `medicamentosCfg` | estado global / referencia DOM | Guarda painel, tabela, modal, tabs e campos |
| `medicamentosCache` | estado global | Lista de itens carregados |
| `medicamentoSelId` | estado global | ID selecionado na tabela |
| `medicamentosFiltroTimer` | estado global | Timer do filtro por nome |
| `medicamentosUltimoCliqueId` | estado global | Apoio para detectar duplo clique |
| `medicamentosUltimoCliqueEm` | estado global | Timestamp do clique anterior |

## Mapa de eventos e binds Medicamentos

### Eventos identificados

| Evento | Onde | Categoria | Observacao |
|---|---|---|---|
| `click` | `medicamentosCfg.tbody` | evento/bind | Seleciona linha e detecta duplo clique |
| `click` | `medicamentosCfg.btnNovo` | evento/bind | Abre modal de novo medicamento |
| `click` | `medicamentosCfg.btnEditar` | evento/bind | Abre modal de edicao |
| `click` | `medicamentosCfg.btnExcluir` | evento/bind | Exclui selecionado |
| `click` | `medicamentosCfg.btnFechar` | evento/bind | Fecha painel |
| `change` | `medicamentosCfg.cboGrupoFiltro` | evento/bind | Recarrega lista |
| `input` | `medicamentosCfg.txtNomeFiltro` | evento/bind | Recarrega lista com debounce |
| `click` | `medicamentosCfg.tabBtnPrincipal` | evento/bind | Volta para a aba principal |
| `click` | `medicamentosCfg.tabBtnDetalhes` | evento/bind | Abre a aba detalhes |
| `click` | `medicamentosCfg.btnModalCancelar` | evento/bind | Fecha modal |
| `click` | `medicamentosCfg.btnModalOk` | evento/bind | Salva modal |
| `click` | `medicamentosCfg.btnModalEliminar` | evento/bind | Exclui item do modal |
| `click` no backdrop | `medicamentosCfg.modalBackdrop` | evento/bind | Fecha modal ao clicar fora |
| menu `data-menu-action="cadastro-medicamentos"` | `frontend/index.html` + dispatcher | integracao com shell | Abre o modulo Medicamentos |

### Bind de shell / override importante

- `medicamentosAbrir()` e chamado dentro do dispatcher principal.
- Existe override final que intercepta `cadastro-medicamentos` e garante:
  - permissao do modulo via `menuEnsurePermission(action)`
  - `menuCloseAll()`
  - `medicamentosAbrir()`

## Mapa de seletores e IDs DOM Medicamentos

### IDs / classes usados

- `medicamentos-panel`
- `medic-tbody`
- `medic-total`
- `medic-cbo-grupo`
- `medic-txt-nome-filtro`
- `medic-btn-novo`
- `medic-btn-editar`
- `medic-btn-excluir`
- `medic-btn-fechar`
- `medicamentos-modal-backdrop`
- `medic-modal-title`
- `medic-tab-principal-btn`
- `medic-tab-detalhes-btn`
- `medic-modal-ok`
- `medic-modal-cancelar`
- `medic-modal-eliminar`
- `medic-txt-nome`
- `medic-cbo-grupo-modal`
- `medic-txt-descricao`
- `medic-cbo-apresentacao`
- `medic-cbo-uso`
- `medic-txt-pos-adulto`
- `medic-txt-qtd-adulto`
- `medic-txt-pos-crianca`
- `medic-txt-qtd-crianca`
- `medic-chk-preferido`
- `medic-txt-lab`
- `medic-txt-observacoes`
- `medic-txt-advertencias`
- `medic-tab-principal`
- `medic-tab-detalhes`

### Observacao tecnica

- O modulo depende fortemente do DOM do proprio painel e modal.
- O render e a edicao estao integrados ao mesmo bloco de referencias.

## Mapa de endpoints Medicamentos

| Acao | Endpoint | Metodo | Categoria |
|---|---|---|---|
| carregar lista | `/medicamentos?grupo=...&nome=...&limit=1000` | `GET` | fetch/API |
| opcoes de grupo | `/medicamentos/opcoes/grupos` | `GET` | fetch/API |
| opcoes de apresentacao | `/medicamentos/opcoes/apresentacoes` | `GET` | fetch/API |
| opcoes de uso | `/medicamentos/opcoes/usos` | `GET` | fetch/API |
| salvar novo | `/medicamentos` | `POST` | fetch/API |
| salvar edicao | `/medicamentos/{id}` | `PUT` | fetch/API |
| excluir da lista | `/medicamentos/{id}` | `DELETE` | fetch/API |
| excluir no modal | `/medicamentos/{editId}` | `DELETE` | fetch/API |
| carregar item para edicao | `/medicamentos/{id}` | `GET` | fetch/API |

## Contratos globais e `window.*`

- Nao foi identificado contrato `window.medicamentos*` exposto diretamente.
- O modulo depende de contratos globais do shell:
  - `hideAllPanels()`
  - `ensurePanelChrome()`
  - `ensureModalChrome()`
  - `workspaceEmpty`
  - `footerMsg`
  - `requestJson()`
  - `esc()`
  - `window.alert()`
  - `window.confirm()`
  - `menuEnsurePermission()`
  - `menuCloseAll()`

## Dependencias compartilhadas

### Shell / menu

- `executarAcaoMenu("cadastro-medicamentos")`
- `menuEnsurePermission(action)`
- `menuCloseAll()`
- `hideAllPanels()`
- `ensurePanelChrome()`
- `ensureModalChrome()`

### Estado compartilhado

- `medicamentosCfg`
- `medicamentosCache`
- `medicamentoSelId`
- `medicamentosFiltroTimer`
- `medicamentosUltimoCliqueId`
- `medicamentosUltimoCliqueEm`

### API compartilhada

- `requestJson()`

## Classificacao por risco

| Item | Risco | Motivo |
|---|---|---|
| `medicamentosEnsureUI()` | alto | Cria estrutura DOM inteira do modulo |
| `medicamentosSelecionado()` | medio | Depende do cache e do ID selecionado |
| `medicamentosSelecionarLinha()` | medio | Altera selecao e re-renderiza |
| `medicamentosRender()` | alto | Lista principal visivel e acoplada ao estado |
| `medicamentosSetSelectOptions()` | medio | Auxiliar de DOM, mas ainda acoplado a selects |
| `medicamentosAplicarTab()` | medio | Controla abas do modal |
| `medicamentosLimparModal()` | medio | Manipula DOM do modal |
| `medicamentosAplicarModalDados()` | medio | Preenche campos do modal |
| `medicamentosCarregarFiltrosGrupo()` | alto | Depende da API |
| `medicamentosCarregarLista()` | alto | Depende da API e da selecao |
| `medicamentosCarregarCombosModal()` | alto | Depende da API e do modal |
| `medicamentosFecharModal()` | medio | Fecha o modal |
| `medicamentosAbrirModal()` | alto | Junta DOM, estado e API |
| `medicamentosPayloadModal()` | medio | Monta payload a partir do modal |
| `medicamentosSalvarModal()` | alto | Persiste dados |
| `medicamentosExcluirSelecionado()` | alto | Remove dados |
| `medicamentosExcluirNoModal()` | alto | Remove dados do modal |
| `medicamentosVincularEventos()` | alto | Binds, duplo clique, filtros e modal |
| `medicamentosAbrir()` | alto | Integra com shell e carrega o modulo |

## Candidatos seguros para Subetapa 1/2

### Resultado da analise

Nao foram encontrados helpers puros seguros para mover primeiro.

### Explicacao

- Mesmo os auxiliares sao dependentes de DOM, modal ou selecao.
- O modulo nao oferece, no estado atual, um bloco claro de utilitarios puros sem efeito colateral.

## Itens proibidos de mover agora

- `medicamentosAbrir()`
- `medicamentosVincularEventos()`
- `medicamentosRender()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosAbrirModal()`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosFecharModal()`
- `medicamentosSelecionarLinha()`
- qualquer coisa ligada a `medicamentoSelId`
- qualquer coisa ligada a `medicamentosUltimoCliqueId` ou `medicamentosUltimoCliqueEm`
- qualquer coisa ligada ao menu ou ao shell
- qualquer coisa que use `requestJson()`
- qualquer manipulacao direta de DOM do painel ou modal

## Comparacao com o resultado do CID

| Ponto | CID | Medicamentos |
|---|---|---|
| Tem helper puro claro para extracao inicial? | Nao | Nao |
| Preso a DOM? | Sim | Sim |
| Preso a estado global? | Sim | Sim |
| Preso a eventos? | Sim | Sim |
| Preso a fetch/API? | Sim | Sim |
| Risco de extracao agora | Alto | Alto |
| Melhor primeiro passo | mapear e procurar utilitarios puros | mapear e procurar utilitarios puros |

Conclusao da comparacao:

- Medicamentos nao e um candidato para mover comportamento principal na Subetapa 1.
- A estrutura do modulo sugere a mesma prudencia aplicada ao CID.

## Recomendacao tecnica para a proxima subetapa

- Procurar, dentro do Medicamentos, apenas pequenas funcoes realmente puras que possam ser destacadas sem DOM, sem estado e sem fetch.
- Se nao houver, manter o modulo inteiro no `app.js` por enquanto.
- O proximo passo seguro e uma revisao fina de pequenos utilitarios, nao do fluxo principal.

## Checklist manual futuro para testar Medicamentos

1. Abrir `Cadastro > Medicamentos...`
2. Confirmar que o painel abre.
3. Aplicar filtro por grupo.
4. Filtrar por nome.
5. Selecionar uma linha.
6. Dar duplo clique e confirmar abertura do modal de edicao.
7. Abrir modal de novo medicamento.
8. Testar troca de abas do modal.
9. Testar salvar em ambiente apropriado.
10. Testar excluir em ambiente apropriado.
11. Conferir console sem `ReferenceError`.

