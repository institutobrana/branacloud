# Auxiliares / Tabelas auxiliares - Subetapa 2 - Fronteiras e contratos

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. Status do working tree antes

```text
 M frontend/index.html
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
?? frontend/js/modules/auxiliares.js
```

## 3. Status do working tree depois

```text
 M frontend/index.html
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/auxiliares_subetapa_2_fronteiras_contratos.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
?? frontend/js/modules/auxiliares.js
```

## 4. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/auxiliares.js`

## 5. Documentos consultados

- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/cid_subetapa_2_fronteiras_contratos.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

## 6. Confirmacao de que nao houve alteracao funcional

- Esta etapa foi apenas documental.
- Nenhuma funcao funcional foi movida.
- Nenhum endpoint foi alterado.
- Nenhum bind foi alterado.
- Nenhum modal foi alterado.
- Nenhuma regra de agenda foi alterada.
- `frontend/app.js` permaneceu como fonte funcional da verdade.

## 7. Confirmacao de que `app.js` continua dono das funcoes `aux*`

- Sim.
- As funcoes `auxAbrir()`, `auxAplicarLayoutDesktop()`, `auxCarregarTipos()`, `auxCarregarItens()`, `auxSelecionarTipoLinha()`, `auxSelecionarItemLinha()`, `auxDialogItem()`, `auxExcluirItem()`, `auxPosSalvarDependencias()`, `auxGerarCodigoAutomatico()`, `auxAtualizarTotal()` e as demais funcoes `aux*` continuam no monolito em `frontend/app.js`.
- O modulo passivo nao recebeu wrappers funcionais e nao assumiu controle de abertura, renderizacao, salvamento ou exclusao.

## 8. Confirmacao de que `auxiliares.js` continua passivo

- Sim.
- `frontend/js/modules/auxiliares.js` continua apenas com namespace, metadados e funcoes de inspeção.
- Nao consulta DOM.
- Nao faz `fetch`.
- Nao usa `requestJson`.
- Nao registra eventos.
- Nao altera fluxo funcional.

## 9. Confirmacao de que `index.html` apenas carrega o modulo passivo

- O HTML continua carregando `frontend/js/modules/auxiliares.js` antes de `frontend/app.js`, como definido na Subetapa 1.
- Nao houve alteracao nova de HTML nesta Subetapa 2.
- O carregamento permanece apenas para manter o padrao de namespace passivo/controlado.

## 10. Fronteira entre modulo passivo e monolito

- `frontend/js/modules/auxiliares.js` expõe contrato passivo de leitura e metadados.
- `frontend/app.js` continua controlando:
  - abertura do painel
  - carregamento de tipos
  - carregamento de itens
  - selecao
  - modal generico
  - salvar
  - excluir
  - relacao com agenda
- A fronteira continua clara: o modulo novo nao decide fluxo, apenas documenta o contrato.

## 11. Contrato atual do namespace `window.BranaAuxiliaresModule`

- Namespace exposto: `window.BranaAuxiliaresModule`
- Metadados e campos presentes:
  - `meta`
  - `nome`
  - `subetapa`
  - `status`
  - `ativo`
  - `controlaFluxo`
  - `helpers`
  - `funcoesMonoliticas`
  - `helpersCandidatosFuturos`
  - `dependenciasCompartilhadas`
  - `endpoints`
  - `getInfo()`
  - `getStatus()`
  - `info()`
- O contrato e passivo e nao aciona comportamento funcional.

## 12. Funcoes que continuam no app.js

- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `auxCarregarTipos()`
- `auxCarregarItens()`
- `auxSelecionarTipoLinha(tr, carregar=true)`
- `auxSelecionarItemLinha(tr)`
- `auxDialogItem(ed=null)`
- `auxExcluirItem()`
- `auxPosSalvarDependencias(tipo)`
- `auxGerarCodigoAutomatico()`
- `auxAtualizarTotal()`
- `auxSel()`
- `auxCorApresentacaoGarantirEstiloCombo()`
- `auxCorApresentacaoFecharListas()`
- `auxCorApresentacaoMontarCombo(select)`

## 13. Funcoes que nao devem ser movidas ainda

- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `auxCarregarTipos()`
- `auxCarregarItens()`
- `auxSelecionarTipoLinha(tr, carregar=true)`
- `auxSelecionarItemLinha(tr)`
- `auxDialogItem(ed=null)`
- `auxExcluirItem()`
- `auxPosSalvarDependencias(tipo)`
- `auxGerarCodigoAutomatico()`
- `auxAtualizarTotal()`
- `auxSel()`
- qualquer wrapper de `cadModal`
- qualquer wrapper de `requestJson`
- qualquer integracao com agenda

## 14. Helpers candidatos para ciclos futuros

- `auxTipoEh(tipo, chave)`
- `auxNormalizarHexCor(value)`
- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`
- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`

## 15. Dependencias compartilhadas

- `requestJson`
- `esc`
- `ensurePanelChrome`
- `ensureModalChrome`
- `hideAllPanels`
- `closeWorkspacePanel`
- `workspaceEmpty`
- `footerMsg`
- `window.alert`
- `window.confirm`
- `cadModal`
- `planoEnsureUI`
- `bindStandardGridActivation`
- `agendaLegadoRecarregarStatus`
- `agendaSemanaRenderEventos`

## 16. Endpoints preservados

- `GET /cadastros/auxiliares/tipos`
- `GET /cadastros/auxiliares?tipo=...`
- `POST /cadastros/auxiliares`
- `PUT /cadastros/auxiliares/{id}`
- `DELETE /cadastros/auxiliares/{id}`

## 17. Contratos de `cadModal`

- `auxDialogItem()` continua dependendo de `cadModalAbrir()`
- O modal generico continua sendo o ponto de edicao/insersao para:
  - especialidade
  - situacao_agendamento
  - situacao_paciente
  - grupo_medicamento
  - ramos padrao
- O contrato do modal nao foi alterado nesta etapa.

## 18. Contratos de `planoEnsureUI` e scaffold compartilhado

- `planoEnsureUI()` continua criando o scaffold compartilhado.
- O painel de Auxiliares continua sendo montado e garantido junto do scaffold de Plano de Contas.
- O compartimento visual e os elementos do shell continuam dependentes desse contrato compartilhado.

## 19. Contratos de `requestJson`

- `auxCarregarTipos()` continua chamando `GET /cadastros/auxiliares/tipos`
- `auxCarregarItens()` continua chamando `GET /cadastros/auxiliares?tipo=...`
- `auxDialogItem()` continua fazendo `POST`/`PUT` para `cadastros/auxiliares`
- `auxExcluirItem()` continua fazendo `DELETE /cadastros/auxiliares/{id}`
- Nenhum contrato de `requestJson` foi alterado nesta etapa

## 20. Contratos de agenda afetados por `auxPosSalvarDependencias`

- `auxPosSalvarDependencias(tipo)` continua sendo o unico ponto de integracao pos-salvar com agenda.
- O contrato atual preserva o comportamento para `situacao_agendamento`.
- A agenda permanece fora do modulo passivo.

## 21. Riscos remanescentes

- Scaffold compartilhado com Plano de Contas continua sendo o principal risco estrutural.
- O modal generico (`cadModal`) ainda atende varios ramos de formulario dentro do mesmo fluxo.
- `auxPosSalvarDependencias()` segue sendo um ponto de efeito colateral e precisa ser preservado em qualquer extracao futura.
- Existem helpers com aparencia pura, mas ainda presos a pequenas dependencias de DOM/HTML, exigindo cautela antes de mover.

## 22. Recomendacao objetiva para a Subetapa 3

- A Subetapa 3 deve procurar apenas helpers pequenos, puramente parametrizados e sem dependencia de DOM, fetch, modal, shell ou estado global mutavel.
- Os candidatos mais promissores sao `auxTipoEh`, `auxNormalizarHexCor`, `auxCorrigirMojibake` e os helpers de rotulo de cor.
- Nao mover `auxPosSalvarDependencias` nem qualquer logica de modal, lista ou exclusao ainda.

## 23. Onde testar no navegador antes de avancar

1. Fazer `Ctrl+F5`.
2. Abrir `Configurações > Tabelas auxiliares...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista de tipos carrega.
5. Trocar o tipo selecionado.
6. Selecionar um item e conferir o destaque.
7. Testar `Novo`.
8. Testar `Altera`.
9. Testar `Elimina`, se for seguro.
10. Fechar e reabrir o painel.
11. Confirmar no console:
    - `window.BranaAuxiliaresModule`
    - `window.BranaAuxiliaresModule.getInfo && window.BranaAuxiliaresModule.getInfo()`
    - `window.BranaAuxiliaresModule.getStatus && window.BranaAuxiliaresModule.getStatus()`
12. Confirmar que nao apareceu `ReferenceError`, `TypeError` ou erro novo de carregamento.

## 24. Conclusao

- A Subetapa 2 permanece apenas documental.
- O contrato entre o modulo passivo e o monolito foi documentado sem qualquer mudança funcional.
