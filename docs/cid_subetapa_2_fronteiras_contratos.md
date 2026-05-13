# CID - Subetapa 2: fronteiras e contratos

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. git status --short antes

```text
 M docs/cid_subetapa_0_mapeamento_monolitico.md
 M frontend/app.js
 M frontend/index.html
?? docs/cid_correcao_duplo_clique_checkbox_modal.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? frontend/js/modules/cid.js
```

## 3. git status --short depois

```text
 M docs/cid_subetapa_0_mapeamento_monolitico.md
 M frontend/app.js
 M frontend/index.html
?? docs/cid_correcao_duplo_clique_checkbox_modal.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? docs/cid_subetapa_2_fronteiras_contratos.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? frontend/js/modules/cid.js
```

## 4. Observacao sobre arquivos pendentes anteriores

- Os arquivos pendentes esperados ja existiam antes desta etapa:
  - `docs/cid_subetapa_0_mapeamento_monolitico.md`
  - `docs/cid_subetapa_1_estrutura_modular_passiva.md`
  - `docs/cid_correcao_duplo_clique_checkbox_modal.md`
  - `docs/varredura_proximo_modulo_pos_plano_contas.md`
  - `frontend/js/modules/cid.js`
- Nao havia arquivo inesperado fora desse conjunto conhecido.
- Esta etapa nao alterou nenhum arquivo funcional; apenas criou este relatorio documental.

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/cid.js`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`

## 6. Documentos consultados

- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/cid_subetapa_1_estrutura_modular_passiva.md`
- `docs/cid_correcao_duplo_clique_checkbox_modal.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## 7. Confirmacao de que nao houve alteracao funcional nesta etapa

- Confirmado.
- Esta etapa foi apenas de auditoria e mapeamento.
- Nenhuma funcao funcional foi movida.
- Nenhum endpoint foi alterado.
- Nenhum bind foi alterado.
- Nenhum comportamento de busca, filtro, modal, salvar, excluir ou menu foi modificado.

## 8. Confirmacao de que `frontend/app.js` nao foi alterado nesta etapa

- Confirmado.
- O arquivo continua como fonte funcional da verdade do CID.
- As alteracoes visuais e de duplo-clique ja existentes no workspace vieram de etapas anteriores, nao desta subetapa.

## 9. Confirmacao de que `frontend/index.html` nao foi alterado nesta etapa

- Confirmado.
- O HTML segue carregando `frontend/js/modules/cid.js` antes de `frontend/app.js`.
- O cache-bust atual do `app.js` permanece `20260513-cid-checkbox-gap2`, herdado das correcoes anteriores.

## 10. Confirmacao de que `cid.js` nao assumiu controle funcional

- Confirmado.
- `frontend/js/modules/cid.js` continua passivo.
- O namespace `window.BranaCidModule` expõe apenas metadados e `getStatus()`/`info()`.
- Nenhum DOM, `fetch`, `requestJson` ou bind foi adicionado ao modulo.

## 11. Mapa de fronteiras do CID

### Fronteira de shell/painel

- `cidEnsureUI()` cria o painel, o modal e referencia os elementos.
- `cidAbrir()` aciona o fluxo de abertura.
- `ensurePanelChrome()` ajusta o chrome do painel.
- `hideAllPanels()` e `workspaceEmpty` controlam a troca de visibilidade.
- `closeWorkspacePanel()` tem branch especifico para `cid-panel`.
- `footerMsg` recebe mensagens de estado ao abrir/fechar.

### Fronteira de estado/cache

- `cid` guarda as referencias de UI.
- `cidCache` guarda a lista carregada do backend.
- `cidSelId` guarda o item selecionado.
- `cidBuscaTimer` controla o debounce da busca.
- `cidRenderToken` protege o render assíncrono em lotes.
- `cid.modalBackdrop.dataset.editId` guarda o id em modo de edicao no modal.
- `cid.panel.dataset.bound` evita bind duplicado.

### Fronteira de renderizacao

- `cidRender()` desenha a tabela em lotes.
- `cidFiltrar()` decide quais itens entram na listagem visivel.
- `cidRender()` depende de `esc()` para escapar codigo e descricao.
- A tabela usa `cid.tbody`.
- O texto de total usa `cid.total`.

### Fronteira de busca/filtro

- O campo `cid-busca` alimenta o filtro.
- O evento `input` aplica debounce via `cidBuscaTimer`.
- A busca atual usa `trim()` e `toLowerCase()`.
- A comparacao e por `includes()` sobre codigo e descricao.
- Nao foi observada normalizacao de acentos.

### Fronteira de selecao

- `cidSelecionado()` resolve o item em `cidCache`.
- `cidSelecionarLinha(id)` atualiza `cidSelId` e a classe visual da linha.
- O click simples apenas seleciona.
- O `dblclick` real chama a edicao por meio de `bindStandardGridActivation`.
- O risco de perder dblclick por recriacao da linha foi reduzido porque o bind fica no `tbody`, nao em cada `tr`.

### Fronteira de eventos/binds

- `cidVincularEventos()` centraliza os binds.
- `cid.busca` recebe `input` com debounce.
- `cid.tbody` recebe `click` e `dblclick` via `bindStandardGridActivation`.
- `cid.btnNovo`, `cid.btnEditar`, `cid.btnExcluir` e `cid.btnFechar` possuem binds proprios.
- `cid.modalOk`, `cid.modalCancelar` e o backdrop do modal tambem tem binds.
- `cid.panel.dataset.bound` evita listeners duplicados.

### Fronteira de modal

- `cidAbrirModal()` monta o modo `novo` ou `editar`.
- `cidFecharModal()` fecha o backdrop.
- Campos usados:
  - codigo
  - descricao/doenca
  - observacoes
  - preferido
- O checkbox de preferidos foi corrigido visualmente, mas a logica continua a mesma.

### Fronteira de salvar

- `cidSalvarModal()` valida codigo e descricao.
- `cidMontarPayload()` monta `codigo`, `descricao`, `observacoes` e `preferido`.
- O endpoint usa `POST /cid` ou `PUT /cid/{id}` conforme o modo.
- Em sucesso, o modal fecha e `cidCarregar()` recarrega a lista.

### Fronteira de excluir

- `cidExcluirSelecionado()` pede confirmacao.
- O endpoint usa `DELETE /cid/{id}`.
- Em sucesso, a lista e recarregada por `cidCarregar()`.

### Fronteira de API/endpoints

- `GET /cid`
- `POST /cid`
- `PUT /cid/{id}`
- `DELETE /cid/{id}`

## 12. Mapa de estado/cache

- `cid` - objeto de UI com referencias do painel e modal
- `cidCache` - lista de itens CID carregada do backend
- `cidSelId` - id do item selecionado
- `cidBuscaTimer` - timer do debounce da busca
- `cidRenderToken` - token de controle do render em lotes
- `cid.modalBackdrop.dataset.editId` - estado do modal em modo editar

## 13. Mapa de eventos/binds

- `input` em `cid-busca`
- `click`/`dblclick` em `cid.tbody` via `bindStandardGridActivation`
- `click` em `cid-btn-novo`
- `click` em `cid-btn-editar`
- `click` em `cid-btn-excluir`
- `click` em `cid-btn-fechar`
- `click` em `cid-modal-ok`
- `click` em `cid-modal-cancelar`
- `click` no backdrop `cid-modal-backdrop`

## 14. Mapa de endpoints

- `GET /cid`
- `POST /cid`
- `PUT /cid/{id}`
- `DELETE /cid/{id}`

## 15. Tabela de candidatos a futura extracao

| Candidato | Origem provavel | Depende de DOM? | Depende de requestJson/fetch? | Depende de estado global mutavel? | Depende de modal? | Depende de shell? | Risco | Recomendacao |
|---|---|---|---|---|---|---|---|---|
| `normalizarCodigoCid(codigo)` | validacao do codigo em `cidSalvarModal()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `validarCodigoCid(codigo)` | validacao inline em `cidSalvarModal()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `validarDescricaoCid(descricao)` | validacao inline em `cidSalvarModal()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `montarPayloadCid(codigo, descricao, observacoes, preferido)` | montagem em `cidMontarPayload()` | Nao, se parametrizado | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `compararTextoCid(texto, termo)` | trecho de `cidFiltrar()` | Nao | Nao | Nao | Nao | Nao | Baixo | seguro para proxima subetapa |
| `filtrarCid(lista, termo)` | logica atual de `cidFiltrar()` | Nao, se parametrizado | Nao | Nao, se parametrizado | Nao | Nao | Baixo/medio | depende de desacoplamento previo |
| `gerarStatusPassivo()` | metadados do namespace passivo | Nao | Nao | Nao | Nao | Nao | Baixo | nao mover agora |

## 16. Classificacao de risco de cada candidato

- `normalizarCodigoCid`: baixo
- `validarCodigoCid`: baixo
- `validarDescricaoCid`: baixo
- `montarPayloadCid`: baixo
- `compararTextoCid`: baixo
- `filtrarCid`: baixo/medio, por depender de separar acesso a `cid.busca` e `cidCache`
- `gerarStatusPassivo`: baixo, mas sem prioridade pratica agora

## 17. Itens que nao devem ser movidos

- `cidEnsureUI()`
- `cidRender()`
- `cidSelecionado()`
- `cidSelecionarLinha()`
- `cidCarregar()`
- `cidSalvarModal()`
- `cidExcluirSelecionado()`
- `cidAbrirModal()`
- `cidFecharModal()`
- `cidVincularEventos()`
- `cidAbrir()`
- `cidPreencherModal()`
- `cidMontarPayload()`
- `cidFiltrar()` as is
- qualquer bind de botao, busca, tabela ou modal
- qualquer uso de `requestJson`
- qualquer dependencia de shell/painel
- qualquer alteracao de endpoint

## 18. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/cid.js`: OK

## 19. Recomendacao objetiva para a Subetapa 3

- Ha helpers pequenos e seguros para extracao futura, principalmente:
  - `normalizarCodigoCid`
  - `validarCodigoCid`
  - `validarDescricaoCid`
  - `montarPayloadCid`
  - `compararTextoCid`
- A proxima subetapa pode extrair primeiro os helpers de validacao e normalizacao, que sao os mais simples e com rollback mais facil.
- O helper `filtrarCid` e possivel, mas deve vir depois de desacoplar a entrada de busca e a lista de cache.

## 20. Onde testar no navegador antes de prosseguir

1. Fazer `Ctrl+F5`.
2. Abrir `Doencas (CID)...`.
3. Confirmar que a lista carrega.
4. Clicar uma vez em uma linha e confirmar selecao.
5. Confirmar que clique simples nao abre o modal.
6. Dar duplo-clique em uma linha e confirmar que abre `Alterar doenca`.
7. Fechar/cancelar o modal.
8. Testar o botao `Altera...` e confirmar que abre a mesma tela.
9. Testar `Nova doenca...` e confirmar que abre modal de inclusao.
10. Confirmar que o checkbox `Incluir na lista de preferidos` continua alinhado e com espaco.
11. Marcar/desmarcar o checkbox e confirmar que o valor continua sendo lido corretamente, se for seguro salvar.
12. Testar busca/filtro.
13. Apos filtrar, dar duplo-clique em um resultado e confirmar que abre alteracao.
14. Fechar e reabrir o painel CID.
15. Repetir clique simples e duplo-clique para garantir que nao ha bind duplicado.
16. Testar `Elimina`, se for seguro.
17. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.

## 21. Confirmacao final

- Nenhum codigo funcional foi alterado nesta etapa.
