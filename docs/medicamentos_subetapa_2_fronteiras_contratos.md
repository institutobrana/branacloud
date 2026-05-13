# Medicamentos - Subetapa 2 - Fronteiras e contratos

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. `git status --short` antes

```text
 M docs/medicamentos_subetapa_0_mapeamento_monolitico.md
 M frontend/index.html
?? docs/medicamentos_subetapa_1_estrutura_modular_passiva.md
?? docs/varredura_proximo_modulo_pos_cid.md
?? frontend/js/modules/medicamentos.js
```

## 3. `git status --short` depois

```text
 M docs/medicamentos_subetapa_0_mapeamento_monolitico.md
 M frontend/index.html
?? docs/medicamentos_subetapa_1_estrutura_modular_passiva.md
?? docs/medicamentos_subetapa_2_fronteiras_contratos.md
?? docs/varredura_proximo_modulo_pos_cid.md
?? frontend/js/modules/medicamentos.js
```

## 4. Observacao sobre arquivos pendentes anteriores

- `docs/varredura_proximo_modulo_pos_cid.md` permanecia pendente antes desta etapa.
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md` e `frontend/index.html` ja estavam modificados em etapas anteriores e foram mantidos como base documental/estrutural do ciclo.
- `frontend/js/modules/medicamentos.js` e `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md` tambem ja estavam pendentes antes desta etapa.

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/medicamentos.js`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`

## 6. Documentos consultados

- `docs/varredura_proximo_modulo_pos_cid.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`

## 7. Confirmacao de que nao houve alteracao funcional nesta etapa

- Nao houve movimento de funcoes funcionais para o modulo novo.
- Nao houve alteracao de filtros, listagem, modal, abas, salvar, excluir, endpoints ou binds do Medicamentos.
- Esta etapa foi apenas documental e de mapeamento de fronteiras.

## 8. Confirmacao de que `frontend/app.js` nao foi alterado nesta etapa

- Sim, `frontend/app.js` permaneceu inalterado nesta etapa.
- Toda a implementacao funcional continua no monolitico legado.

## 9. Confirmacao de que `frontend/index.html` nao foi alterado nesta etapa

- O HTML nao recebeu alteracao nova nesta etapa.
- O carregamento de `frontend/js/modules/medicamentos.js` ja vinha da etapa anterior e permaneceu como estava.

## 10. Confirmacao de que `frontend/js/modules/medicamentos.js` nao assumiu controle funcional

- Sim.
- O arquivo permanece passivo, com namespace, metadados e `getStatus()/info()`.
- Nao consulta DOM, nao faz `fetch`, nao usa `requestJson` e nao registra eventos/binds.

## 11. Mapa de fronteiras do Medicamentos

### Fronteira de shell/painel

- `medicamentosEnsureUI()`
- `medicamentosAbrir()`
- `ensurePanelChrome()`
- `hideAllPanels()`
- `closeWorkspacePanel()`
- `workspaceEmpty`
- `footerMsg`

### Fronteira de estado/cache

- `medicamentosCfg`
- `medicamentosCache`
- `medicamentoSelId`
- `medicamentosFiltroTimer`
- `medicamentosUltimoCliqueId`
- `medicamentosUltimoCliqueEm`
- `medicamentosCfg.modalBackdrop.dataset.editId`
- `medicamentosCfg.panel.dataset.bound`

### Fronteira de renderizacao

- `medicamentosRender()`
- depende de `esc()`
- depende de `medicamentosCache`
- depende de `medicamentoSelId`
- depende do HTML da tabela/colgroups/`tbody`

### Fronteira de filtros

- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- filtro por grupo via `medicamentosCfg.cboGrupoFiltro`
- filtro por nome via `medicamentosCfg.txtNomeFiltro`
- debounce com `medicamentosFiltroTimer`
- relacao direta com recarga da lista e com a selecao corrente

### Fronteira de selecao

- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`
- clique simples na tabela
- segundo clique rapido no mesmo `click`
- risco futuro se a heuristica for migrada para `dblclick` real sem reavaliar o render

### Fronteira de eventos/binds

- `medicamentosVincularEventos()`
- botoes Novo, Altera, Elimina, Fechar
- filtros por grupo e nome
- tabela principal
- abas do modal
- botoes do modal
- backdrop do modal
- guard de bind via `medicamentosCfg.panel.dataset.bound`

### Fronteira de modal

- `medicamentosAbrirModal()`
- `medicamentosFecharModal()`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosAplicarTab(tab)`
- `medicamentosCarregarCombosModal()`
- campos do modal principal e da aba detalhes
- validacao de nome em `medicamentosSalvarModal()`
- modo novo/alterar via `dataset.editId`

### Fronteira de salvar/payload

- `medicamentosPayloadModal()`
- `medicamentosSalvarModal()`
- payload com `nome`, `grupo`, `descricao_substancia`, `apresentacao`, `uso`, `posologia_adulto`, `quantidade_padrao_adulto`, `posologia_crianca`, `quantidade_padrao_crianca`, `preferido`, `laboratorio`, `observacoes`, `advertencias`, `inativo`
- `POST /medicamentos`
- `PUT /medicamentos/{id}`
- recarrega filtro e lista apos salvar

### Fronteira de exclusao

- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `DELETE /medicamentos/{id}`
- confirmacao via `window.confirm`
- recarrega lista apos excluir

### Fronteira de API/endpoints

- `GET /medicamentos?grupo=...&nome=...&limit=1000`
- `GET /medicamentos/opcoes/grupos`
- `GET /medicamentos/opcoes/apresentacoes`
- `GET /medicamentos/opcoes/usos`
- `GET /medicamentos/{id}`
- `POST /medicamentos`
- `PUT /medicamentos/{id}`
- `DELETE /medicamentos/{id}`

## 12. Mapa de estado/cache

| Variavel | Papel | Observacao |
|---|---|---|
| `medicamentosCfg` | referencia DOM/estado do modulo | guarda painel, modal, campos, tabs e botões |
| `medicamentosCache` | lista/cache principal | itens carregados para a tabela |
| `medicamentoSelId` | selecao atual | id selecionado na grade |
| `medicamentosFiltroTimer` | debounce | controla recarga do filtro por nome |
| `medicamentosUltimoCliqueId` | heuristica de duplo clique | apoia segundo clique rapido |
| `medicamentosUltimoCliqueEm` | heuristica de duplo clique | apoia segundo clique rapido |

## 13. Mapa de filtros

- Filtro por grupo:
  - campo `medic-cbo-grupo`
  - carrega opcoes via `GET /medicamentos/opcoes/grupos`
  - aplica parametro `grupo` na lista
- Filtro por nome:
  - campo `medic-txt-nome`
  - usa debounce de `220ms`
  - aplica parametro `nome` na lista
- Relacao com `medicamentosCarregarLista()`:
  - ambos os filtros convergem para a mesma chamada de recarga
- Relacao com `medicamentosRender()`:
  - a renderizacao e sempre dependente do cache recarregado

## 14. Mapa de eventos/binds

| Evento | Onde | Observacao |
|---|---|---|
| `click` | `medicamentosCfg.tbody` | seleciona linha e detecta segundo clique rapido |
| `click` | `medicamentosCfg.btnNovo` | abre modal em modo novo |
| `click` | `medicamentosCfg.btnEditar` | abre modal em modo editar |
| `click` | `medicamentosCfg.btnExcluir` | exclui item selecionado |
| `click` | `medicamentosCfg.btnFechar` | fecha o painel |
| `change` | `medicamentosCfg.cboGrupoFiltro` | recarrega lista |
| `input` | `medicamentosCfg.txtNomeFiltro` | recarrega lista com debounce |
| `click` | `medicamentosCfg.tabBtnPrincipal` | volta para a aba principal |
| `click` | `medicamentosCfg.tabBtnDetalhes` | abre a aba detalhes |
| `click` | `medicamentosCfg.btnModalCancelar` | fecha o modal |
| `click` | `medicamentosCfg.btnModalOk` | salva o modal |
| `click` | `medicamentosCfg.btnModalEliminar` | exclui a partir do modal |
| `click` | `medicamentosCfg.modalBackdrop` | fecha o modal ao clicar fora |

## 15. Mapa de modal/abas

- `medicamentosAbrirModal(modo)`:
  - `modo === "editar"` carrega item atual via `GET /medicamentos/{id}`
  - `modo !== "editar"` limpa o modal
  - configura `dataset.editId`
  - habilita/desabilita o botao de eliminar do modal
- `medicamentosFecharModal()`:
  - oculta o backdrop do modal
- `medicamentosLimparModal()`:
  - limpa todos os campos
- `medicamentosAplicarModalDados(item)`:
  - preenche campos do item carregado
- `medicamentosAplicarTab(tab)`:
  - alterna entre `Principal` e `Detalhes`
- `medicamentosCarregarCombosModal()`:
  - popula selects do modal com opcoes remotas

## 16. Mapa de endpoints

| Endpoint | Metodo | Uso |
|---|---|---|
| `/medicamentos?grupo=...&nome=...&limit=1000` | `GET` | lista principal |
| `/medicamentos/opcoes/grupos` | `GET` | filtro e combo do modal |
| `/medicamentos/opcoes/apresentacoes` | `GET` | combo do modal |
| `/medicamentos/opcoes/usos` | `GET` | combo do modal |
| `/medicamentos/{id}` | `GET` | carregar item para edicao |
| `/medicamentos` | `POST` | salvar novo |
| `/medicamentos/{id}` | `PUT` | salvar edicao |
| `/medicamentos/{id}` | `DELETE` | excluir da grade |
| `/medicamentos/{editId}` | `DELETE` | excluir no modal |

## 17. Tabela de candidatos a futura extracao

| Candidato | Origem provavel | Depende de DOM? | Depende de requestJson/fetch? | Depende de estado global mutavel? | Depende de modal? | Depende de shell? | Risco | Recomendacao |
|---|---|---|---|---|---|---|---|---|
| `normalizarTextoMedicamento(texto)` | limpeza de entradas de nome/grupo | nao | nao | nao | nao | nao | baixo | seguro para proxima subetapa |
| `validarNomeMedicamento(nome)` | validacao do salvar | nao | nao | nao | nao | nao | baixo | seguro para proxima subetapa |
| `validarGrupoMedicamento(grupo)` | validacao do salvar/filtros | nao | nao | nao | nao | nao | baixo | seguro para proxima subetapa |
| `compararTextoMedicamento(texto, termo)` | futura busca/filtro | nao | nao | nao | nao | nao | baixo | seguro para proxima subetapa |
| `montarPayloadMedicamento(...)` | `medicamentosPayloadModal()` | nao | nao | sim, se mantiver leitura do estado atual | sim | nao | medio/alto | depende de desacoplamento previo |
| `normalizarListaOpcoesMedicamentos(itens)` | `medicamentosSetSelectOptions()` / combos | nao | nao | nao | nao | nao | medio | depende de desacoplamento previo |
| `formatarRotuloMedicamento(item)` | render/lista e combos | nao | nao | nao | nao | nao | medio | depende de desacoplamento previo |

## 18. Classificacao de risco de cada candidato

- `normalizarTextoMedicamento(texto)`: seguro para proxima subetapa
- `validarNomeMedicamento(nome)`: seguro para proxima subetapa
- `validarGrupoMedicamento(grupo)`: seguro para proxima subetapa
- `compararTextoMedicamento(texto, termo)`: seguro para proxima subetapa
- `montarPayloadMedicamento(...)`: depende de desacoplamento previo
- `normalizarListaOpcoesMedicamentos(itens)`: depende de desacoplamento previo
- `formatarRotuloMedicamento(item)`: depende de desacoplamento previo

## 19. Itens que nao devem ser movidos

- `medicamentosEnsureUI()`
- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`
- `medicamentosRender()`
- `medicamentosSetSelectOptions(select, itens, placeholder)`
- `medicamentosAplicarTab(tab)`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosFecharModal()`
- `medicamentosAbrirModal(modo)`
- `medicamentosPayloadModal()`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosVincularEventos()`
- `medicamentosAbrir()`
- qualquer coisa ligada a `medicamentosCfg`
- qualquer coisa ligada a `medicamentosCache`
- qualquer coisa ligada a `medicamentoSelId`
- qualquer coisa ligada a `medicamentosFiltroTimer`
- qualquer coisa ligada a `medicamentosUltimoCliqueId`
- qualquer coisa ligada a `medicamentosUltimoCliqueEm`
- qualquer bind que use `requestJson`
- qualquer bind do painel/modal/lista

## 20. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/medicamentos.js`: OK

## 21. Recomendacao objetiva para a Subetapa 3

- Se avancarmos, o proximo passo deve ser apenas procurar helpers realmente pequenos e puros, como normalizacao e validacao textual simples.
- `montarPayloadMedicamento(...)` e qualquer normalizacao de lista/opcoes ainda dependem de desacoplamento previo e nao devem ser movidos de imediato.
- Se nao surgir um helper menor e claramente puro, a Subetapa 3 deve ser apenas isolamento/documentacao, sem extração funcional.

## 22. Onde testar no navegador antes de prosseguir

1. Fazer `Ctrl+F5`.
2. Abrir `Cadastro > Medicamentos...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Testar filtro por grupo.
6. Testar filtro por nome.
7. Selecionar uma linha.
8. Testar o segundo clique rapido, se esse for o comportamento atual.
9. Testar o botao `Altera...`.
10. Testar `Novo medicamento...`.
11. Trocar abas do modal.
12. Tentar salvar sem campos obrigatorios, se houver validacao.
13. Testar `Elimina`, se for seguro no ambiente.
14. Fechar e reabrir o painel.
15. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
