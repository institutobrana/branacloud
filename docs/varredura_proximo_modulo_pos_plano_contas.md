# Varredura comparativa - proximo modulo apos Plano de Contas

## 1. Branch e estado do git

- Branch atual: `modularizacao-segura-fase-1`
- `git status --short` antes: limpo
- `git diff --stat` antes: sem diff
- Ultimos commits relevantes:
  - `39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas`
  - `b415b5c Encerra ciclo seguro de helpers de Unidades`
  - `ab102c8 Audita helpers modulares de Unidades`
  - `91b65e9 Usa helper modular de telefone em Unidades com fallback`
  - `45419a5 Usa helper modular de codigo em Unidades com fallback`
  - `795c664 Usa helper modular de status em Unidades com fallback`
  - `6b2ae0e Carrega modulo de Unidades de forma passiva`
  - `7ea7c65 Compara helpers de Unidades no modulo controlado`

## 2. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`

## 3. Documentos consultados

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_diagnostico_400_teste_manual_pre_commit.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`

## 4. Resumo executivo

- O proximo modulo recomendado para iniciar um novo ciclo de modularizacao segura e `CID`.
- `Medicamentos` e um candidato possivel, mas tem area de tela maior, mais binds, modal maior e maior risco de regressao.
- `Materiais` e alto risco para este momento por volume, acoplamento com buscas/indices/valores e maior superficie de DOM e API.
- `Auxiliares / Tabelas auxiliares` compartilha scaffold com `Plano de Contas`, entao pede mais cautela.
- `Indices financeiros` e `Cenarios financeiros` sao mais sensiveis por dependencia de calculos e area financeira/procedimental.
- Nao houve alteracao de codigo funcional nesta varredura.

## 5. Tabela comparativa dos candidatos

| Modulo | Abertura principal | Funcoes principais | Estado/cache | DOM usado | Eventos/binds | API/endpoints | Dependencias compartilhadas | Possiveis helpers puros | Risco | Facilidade de teste | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CID | `cidAbrir()` | `cidEnsureUI`, `cidFiltrar`, `cidRender`, `cidSelecionado`, `cidCarregar`, `cidPreencherModal`, `cidMontarPayload`, `cidSalvarModal`, `cidExcluirSelecionado`, `cidAbrirModal`, `cidFecharModal`, `cidVincularEventos` | `cid`, `cidCache`, `cidSelId`, `cidBuscaTimer`, `cidRenderToken` | painel, filtro, tabela, modal | clique em botao, filtro, binds de modal e lista | `GET /cid`, `POST /cid`, `PUT /cid/{id}`, `DELETE /cid/{id}` | shell do app e modal comum | nenhum helper puro seguro identificado | baixo/medio | alta | **recomendado agora** |
| Medicamentos | `medicamentosAbrir()` | `medicamentosEnsureUI`, `medicamentosSelecionado`, `medicamentosSelecionarLinha`, `medicamentosRender`, `medicamentosSetSelectOptions`, `medicamentosAplicarTab`, `medicamentosLimparModal`, `medicamentosAplicarModalDados`, `medicamentosCarregarFiltrosGrupo`, `medicamentosCarregarLista`, `medicamentosCarregarCombosModal`, `medicamentosFecharModal`, `medicamentosAbrirModal`, `medicamentosPayloadModal`, `medicamentosSalvarModal`, `medicamentosExcluirSelecionado`, `medicamentosExcluirNoModal`, `medicamentosVincularEventos` | `medicamentosCache`, `medicamentoSelId`, `medicamentosFiltroTimer`, `medicamentosUltimoCliqueId`, `medicamentosUltimoCliqueEm` | lista, filtros, tabs, modal e combos | varios clicks, tabs, click duplo por timing e binds de modal | `GET /medicamentos`, `GET /medicamentos/opcoes/grupos`, `GET /medicamentos/opcoes/apresentacoes`, `GET /medicamentos/opcoes/usos`, `GET/POST/PUT/DELETE /medicamentos` | depende de selects, modal, filtros, lookup e estado local mais amplo | sem helper puro seguro claro | medio/alto | media | possivel, mas nao ideal agora |
| Materiais | `abrirMateriais()` / fluxo de panel de materiais | `materiaisCarregarListas`, `materiaisCarregar`, `materiaisAbrirModal`, `materiaisSalvarModal`, `materiaisExcluirSelecionado`, `materiaisTabelaAbrirModal`, `materiaisTabelaSalvarModal`, `materiaisCriarTabela`, `materiaisAlterarTabela`, `materiaisExcluirTabela` e varios helpers de carga | `materiaisCache`, `materialSelecionadoId`, `materialModalId`, `materiaisAuxTiposCache`, `materiaisAuxUndsCache`, `materiaisListasCache`, `materiaisIndicesCache`, `materiaisTabelaModalModo`, `materiaisTabelaModalListaId` | lista, modal principal, modal de tabela, combos, filtros | diversos binds de botao, change, input, click e dblclick | `/materiais`, `/materiais/listas`, `/materiais/listas/{id}`, `/materiais/listas/{id}/proximo-codigo`, `/materiais/indices`, `/cadastros/auxiliares?tipo=...` | depende de auxiliares, indices, formato numerico e bastante DOM | `parseMaterialNumber`, `materiaisUniqueAuxDescricoes` e outros helpers locais existem, mas o conjunto nao e simples | alto | media/baixa | nao recomendado agora |
| Auxiliares / Tabelas auxiliares | `auxAbrir()` | `auxCarregarTipos`, `auxCarregarItens`, `auxSelecionarTipoLinha`, `auxSelecionarItemLinha`, `auxDialogItem`, `auxExcluirItem`, `auxAplicarLayoutDesktop`, `auxTecladoTipos`, `auxTecladoItens` | `aux`, `auxItensCache`, `auxSelId` | painel compartilhado, lista e itens, modal comum | click, teclado, binds de botao | leitura/gravação de itens auxiliares | compartilha scaffold com `planoEnsureUI`, `cadModalAbrir`, `hideAllPanels`, `closeWorkspacePanel` | nao apareceu helper puro seguro prioritario | medio | media | possivel, mas com cautela |
| Indices financeiros | `indicesAbrir()` | `indicesEnsureUI`, `indicesCarregar`, `indicesRender`, `indicesCarregarCotacoes`, `indicesRenderCotacoes`, `indicesSelecionado`, `indicesNovo`, `indicesAlterar`, `indicesExcluir` | `indicesCfg`, `indicesCache`, `cotacoesCache`, `indiceSelNumero`, `cotacaoSelId` | modal/painel de indices e cotações | binds de botao e grid | `GET /indices-financeiros`, `GET /indices-financeiros/{id}/cotacoes`, `POST`, `PATCH`, `DELETE`, `GET /em-uso`, `POST /migrar-e-excluir` | `cadModalAbrir`, calculos financeiros e fluxo de cotações | nao ha helper puro prioritario claro | alto | media | nao recomendado agora |
| Cenarios financeiros | `abrirCenario()` / `carregarCenario()` | `procCarregarCenario`, `procAtualizarFinanceiro`, `procAbrirEditor` e calculos correlatos | `procCenario` e estado de procedimento | painel de configuracao de cenario e editor de procedimento | event handlers de painel e edicao de procedimento | `/cenario`, `/procedimentos/...` | forte dependencia de procedimentos e calculos | nao ha helper puro seguro claro | alto | baixa/media | nao recomendado agora |

## 6. Analise resumida de cada candidato

### CID

- Menor superficie entre os candidatos.
- Tem um painel principal, uma lista, um filtro e um modal de CRUD.
- Nao mostrou helper puro seguro para extraacao imediata, mas e bom para Subetapa 0 de mapeamento.
- Nao depende de scaffold compartilhado complexo como Plano de Contas/Auxiliares.
- Risco geral menor que os demais candidatos.

### Medicamentos

- Tem lista, filtros, tabs, modal maior e fluxo de exclusao.
- Usa ativacao por timing de clique e varios binds de UI.
- O fluxo e funcional, mas a superficie e mais extensa que CID.
- E um candidato possivel, porem nao o mais conservador para iniciar o proximo ciclo.

### Materiais

- E o modulo com maior volume e maior numero de subfluxos entre os candidatos.
- Mistura lista, modal principal, modal de tabela, indices, filtros e dependencias de auxiliares.
- Tem varias chamadas de API e manipulacao numerica sensivel.
- Alto risco para uma retomada conservadora agora.

### Auxiliares / Tabelas auxiliares

- Compartilha scaffold com Plano de Contas.
- Ainda que o painel seja relativamente organizado, a dependencia de `planoEnsureUI`, `cadModalAbrir`, `hideAllPanels` e `closeWorkspacePanel` pede mais cuidado.
- Pode ser modularizado depois, mas nao e o melhor primeiro passo apos Plano de Contas.

### Indices financeiros

- A area e sensivel porque envolve cotações, valores e regras de exclusao com validacao de uso.
- Usa `cadModalAbrir` e varios endpoints de mutacao.
- E um modulo funcionalmente util, mas nao e a escolha mais conservadora.

### Cenarios financeiros

- Esta muito acoplado ao fluxo de procedimentos e calculos financeiros.
- Nao e um bom candidato para um ciclo inicial de modularizacao segura.

## 7. Modulos descartados e motivo

- `Materiais`: superficie muito grande, varios subfluxos e dependencia sensivel de numeros, indices e auxiliares.
- `Indices financeiros`: financeiro sensivel, mutacoes e exclusao com regra de uso.
- `Cenarios financeiros`: calculos e dependencia de procedimentos, alto risco.
- `Auxiliares / Tabelas auxiliares`: compartilha scaffold com Plano de Contas, exige mais cautela.
- `Medicamentos`: possivel, mas mais complexo que CID para primeiro ciclo.
- Fora do conjunto principal e portanto nao escolhidos agora:
  - `Editor de Textos`
  - `Símbolos Gráficos`
  - `Agenda`
  - `Convênios e Planos`
  - `Prestadores`
  - `Procedimentos`
  - `Procedimentos Genéricos`

## 8. Mapa sintetico de fronteiras observadas

- `CID`:
  - abertura/painel: `cidAbrir()`
  - lista/render: `cidRender()`
  - selecao: `cidSelecionado()`
  - modal: `cidAbrirModal()`, `cidFecharModal()`
  - salvar/excluir: `cidSalvarModal()`, `cidExcluirSelecionado()`
  - eventos: `cidVincularEventos()`
  - API: `/cid`
- `Medicamentos`:
  - abertura/painel: `medicamentosAbrir()`
  - lista/render: `medicamentosCarregarLista()`, `medicamentosRender()`
  - selecao: `medicamentosSelecionado()`, `medicamentosSelecionarLinha()`
  - modal: `medicamentosAbrirModal()`, `medicamentosFecharModal()`
  - salvar/excluir: `medicamentosSalvarModal()`, `medicamentosExcluirSelecionado()`, `medicamentosExcluirNoModal()`
  - eventos: `medicamentosVincularEventos()`
  - API: `/materiais` e varias rotas de apoio, conforme subfluxo
- `Materiais`:
  - abertura/painel: `abrirMateriais()`
  - lista/tabela: `materiaisCarregarListas()`, `materiaisCarregar()`
  - modal principal e modal de tabela: `materiaisAbrirModal()`, `materiaisTabelaAbrirModal()`
  - salvar/excluir: `materiaisSalvarModal()`, `materiaisExcluirSelecionado()`, `materiaisTabelaSalvarModal()`, `materiaisExcluirTabela()`
  - API: varias rotas de materiais, listas, indices e auxiliares
- `Auxiliares`:
  - abertura/painel: `auxAbrir()`
  - scaffold compartilhado: `planoEnsureUI()`, `auxAplicarLayoutDesktop()`
  - modal compartilhado: `cadModalAbrir()`
- `Indices financeiros`:
  - abertura/painel: `indicesAbrir()`
  - lista/render: `indicesRender()`, `indicesCarregarCotacoes()`
  - modal CRUD: `indicesNovo()`, `indicesAlterar()`, `indicesExcluir()`
  - API: `/indices-financeiros`
- `Cenarios financeiros`:
  - abertura/painel: `abrirCenario()`
  - calculo/carregamento: `carregarCenario()`, `procCarregarCenario()`, `procAtualizarFinanceiro()`
  - dependencia forte de procedimentos e calculos

## 9. Helpers puros candidatos

- `CID`: nenhum helper puro seguro foi identificado como candidato imediato.
- `Medicamentos`: nenhum helper puro seguro foi identificado como candidato imediato.
- `Materiais`: existem funcoes locais que parecem utilitarias, mas o risco geral e alto; nao recomendo extracao agora.
- `Auxiliares`: nao apareceu helper puro prioritario para primeira extraicao.
- `Indices financeiros`: sem helper puro prioritario claro para iniciar um ciclo seguro.
- `Cenarios financeiros`: nao apareceu helper puro seguro para extracao inicial.

## 10. Módulo recomendado

- **Recomendado agora: `CID`**

### Justificativa tecnica

- Menor superficie entre os candidatos analisados.
- Menos dependencias compartilhadas que `Materiais`, `Indices financeiros` e `Cenarios financeiros`.
- Nao depende do scaffold compartilhado de `Plano de Contas`.
- Nao mostrou um conjunto grande de helpers ou fluxos secundarios como `Medicamentos`.
- E um bom encaixe para repetir o mesmo ciclo conservador:
  - Subetapa 0: mapeamento
  - Subetapa 1: namespace passivo
  - Subetapa 2: fronteiras/contratos
  - Subetapa 3: helpers puros, se existirem
  - Subetapa 4: wrappers opcionais, se fizer sentido
  - Subetapa 5: encerramento e commit

### Riscos do modulo escolhido

- No fluxo de exclusao/salvar pode haver validacoes e retorno de backend que exigem cuidado.
- O modulo nao aparenta ter helpers puros claros para mover ja de inicio; o primeiro ciclo deve ser de mapeamento, nao de extracao.
- Como em qualquer modulo de CRUD, existe risco de binds e renderizacao se a migracao avancar sem nova auditoria.

## 11. Proposta de Subetapa 0 para CID

- Mapear somente o CID monolitico em `frontend/app.js`.
- Confirmar:
  - funcao principal de abertura;
  - funcoes relacionadas;
  - estado/cache;
  - DOM;
  - eventos/binds;
  - endpoints/API;
  - dependencias compartilhadas;
  - risco de duplo clique, se houver;
  - possibilidade de helpers puros, se existir alguma;
  - itens proibidos para mover em seguida.
- Nao criar modulo novo ainda.
- Nao alterar `app.js` nem `index.html` nesta primeira subetapa.

## 12. Teste manual recomendado antes de iniciar o novo ciclo

- Fazer `Ctrl+F5`.
- Abrir `Tabelas > Doencas (CID)...`.
- Confirmar abertura do painel.
- Confirmar carregamento da lista.
- Testar selecao de item.
- Testar filtro/busca, se existir.
- Testar abrir/alterar/excluir, se houver modal.
- Fechar o painel.
- Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
- Fazer regressao rapida em `Medicamentos`, `Materiais`, `Indices financeiros`, `Cenario financeiro` e `Plano de Contas` para garantir que o shell continua intacto.

## 13. Confirmacao final

- Nenhum codigo funcional foi alterado nesta varredura.
