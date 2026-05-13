# Varredura comparativa - proximo modulo apos CID

## 1. Branch e estado do git

- Branch atual: `modularizacao-segura-fase-1`
- `git status --short` antes: limpo
- `git diff --stat` antes: sem diff
- Ultimos commits relevantes:
  - `8a1b799` feat(frontend): encerra ciclo seguro dos helpers de cid
  - `39330d3` feat(frontend): encerra ciclo seguro dos helpers de plano de contas
  - `b415b5c` Encerra ciclo seguro de helpers de Unidades
  - `ab102c8` Audita helpers modulares de Unidades
  - `91b65e9` Usa helper modular de telefone em Unidades com fallback
  - `45419a5` Usa helper modular de codigo em Unidades com fallback
  - `795c664` Usa helper modular de status em Unidades com fallback
  - `6b2ae0e` Carrega modulo de Unidades de forma passiva
  - `7ea7c65` Compara helpers de Unidades no modulo controlado
  - `eda2e54` Cria estrutura modular de Unidades e estabiliza duplo clique

## 2. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`

## 3. Documentos consultados

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`

## 4. Resumo executivo

- O proximo modulo recomendado para iniciar um novo ciclo de modularizacao segura e `Medicamentos`.
- `CID` ja foi fechado, e `Medicamentos` e o melhor passo seguinte porque e o modulo mais natural e ainda relativamente isolado.
- `Auxiliares / Tabelas auxiliares` e um candidato possivel, mas nao ideal agora por compartilhar scaffold com `Plano de Contas` e usar `cadModal`.
- `Materiais` tem risco alto por volume, numeros, multiplas listas, modais e dependencia de outras tabelas.
- `Indices financeiros` e `Cenarios financeiros` sao mais sensiveis por regras de uso, exclusao, cotacoes e calculos.
- Nao houve alteracao de codigo funcional nesta varredura.

## 5. Tabela comparativa dos candidatos

| Modulo | Abertura principal | Funcoes principais | Variaveis/caches | DOM usado | Eventos/binds | API/endpoints | Dependencias compartilhadas | Possiveis helpers puros | Risco | Facilidade de teste | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Medicamentos | `medicamentosAbrir()` | `medicamentosEnsureUI`, `medicamentosCarregarFiltrosGrupo`, `medicamentosCarregarLista`, `medicamentosCarregarCombosModal`, `medicamentosAbrirModal`, `medicamentosPayloadModal`, `medicamentosSalvarModal`, `medicamentosExcluirSelecionado`, `medicamentosExcluirNoModal`, `medicamentosVincularEventos` | `medicamentosCache`, `medicamentoSelId`, `medicamentosFiltroTimer`, `medicamentosUltimoCliqueId`, `medicamentosUltimoCliqueEm` | painel, tabela, filtro, abas, modal e varios campos | click, filtro com debounce, abas, modal e heuristica de duplo clique por tempo | `GET /medicamentos`, `GET /medicamentos/{id}`, `GET /medicamentos/opcoes/*`, `POST /medicamentos`, `PUT /medicamentos/{id}`, `DELETE /medicamentos/{id}` | shell do app, `requestJson`, `ensurePanelChrome`, `ensureModalChrome`, `hideAllPanels`, `footerMsg` | sem helper puro seguro claro, mas a estrutura e bem delimitada | medio | alta | **recomendado agora** |
| Auxiliares / Tabelas auxiliares | `auxAbrir()` | `auxAplicarLayoutDesktop`, `auxCarregarTipos`, `auxCarregarItens`, `auxSelecionarTipoLinha`, `auxSelecionarItemLinha`, `auxDialogItem`, `auxExcluirItem` | `aux`, `auxItensCache`, `auxSelId` | painel compartilhado, lista de tipos, lista de itens, modal comum | click, teclado, `bindStandardGridActivation` para itens | `GET /cadastros/auxiliares/tipos`, `GET /cadastros/auxiliares?tipo=...`, `POST/PATCH/DELETE /cadastros/auxiliares/...` | comparte scaffold com `Plano de Contas`, usa `planoEnsureUI`, `cadModalAbrir`, `hideAllPanels`, `closeWorkspacePanel` | nao apareceu helper puro prioritario | medio | media | possivel, mas nao ideal |
| Materiais | `materiaisCarregarListas()` / `materiaisAbrirModal()` | `materiaisCarregarAuxTipo`, `materiaisCarregarFiltroClassificacao`, `materiaisCarregarCombosModal`, `materiaisCarregarIndicesTabela`, `materiaisCarregarListas`, `materiaisCarregar`, `materiaisAbrirModal`, `materiaisSalvarModal`, `materiaisExcluirSelecionado`, `materiaisTabelaAbrirModal`, `materiaisTabelaSalvarModal`, `materiaisExcluirTabela` | `materiaisCache`, `materialSelecionadoId`, `materiaisAuxTiposCache`, `materiaisAuxUndsCache`, `materiaisListasCache`, `materiaisIndicesCache`, `materiaisTabelaModalModo`, `materiaisTabelaModalListaId` | lista principal, filtros, tabs, modal principal e modal de tabela | varios clicks, inputs, change, debounce e binds de modal | `/materiais`, `/materiais/listas`, `/materiais/listas/{id}`, `/materiais/listas/{id}/proximo-codigo`, `/materiais/indices`, `/cadastros/auxiliares?...` | depende de auxiliares, indices, calculos e varios fluxos de DOM | helpers utilitarios existem, mas o conjunto nao e pequeno | alto | media/baixa | nao recomendado agora |
| Indices financeiros | `indicesAbrir()` | `indicesEnsureUI`, `indicesCarregar`, `indicesRender`, `indicesCarregarCotacoes`, `indicesRenderCotacoes`, `indicesNovo`, `indicesAlterar`, `indicesExcluir` | `indicesCache`, `cotacoesCache`, `indiceSelNumero`, `cotacaoSelId` | modal/painel com duas grades | `bindStandardGridActivation`, botoes do modal e da tabela | `GET /indices-financeiros`, `GET /indices-financeiros/{id}/cotacoes`, `POST`, `PATCH`, `DELETE`, `GET /em-uso`, `POST /migrar-e-excluir` | `cadModalAbrir`, regras de exclusao com uso e cotacoes | nao ha helper puro prioritario claro | alto | media | nao recomendado agora |
| Cenarios financeiros | `abrirCenario()` / `carregarCenario()` | `carregarCenario`, `salvarCenario`, `calcularFixosAno`, `procCarregarCenario`, `procAtualizarFinanceiro` | `procCenario` e campos do cenario | painel de configuracao de cenario e calculos | eventos de painel, salvar e calcular | `GET /cenario`, `POST /cenario`, `POST /cenario/calcular-fixos` | depende de procedimentos, calculos e fluxo operacional critico | nao ha helper puro seguro claro | alto | baixa/media | nao recomendado agora |

## 6. Analise resumida de cada candidato

### Medicamentos

- E o melhor candidato desta varredura.
- E um modulo autonomo, com painel proprio, lista, modal, filtros e CRUD.
- Tem mais superficie que CID, mas ainda e bem mais isolavel que Materiais, Indices financeiros e Cenarios financeiros.
- O duplo clique atual usa heuristica por tempo no click, mas isso e um problema local e previsivel para um futuro ciclo.
- Nao compartilha scaffold critico com Plano de Contas.

### Auxiliares / Tabelas auxiliares

- E um modulo razoavelmente contido, mas compartilha scaffold com `Plano de Contas`.
- Usa `planoEnsureUI`, `cadModalAbrir`, `hideAllPanels` e `closeWorkspacePanel`.
- Isso aumenta o risco de colateral em duas areas ja delicadas do shell.
- E possivel, mas nao ideal como proximo passo.

### Materiais

- Possui muitas rotas, varias listas e dois niveis de modal.
- Trabalha com valores, indices, unidades e dependencias de auxiliares.
- O volume de DOM e de chamadas de API e alto.
- Nao e o momento ideal para iniciar a modularizacao segura por aqui.

### Indices financeiros

- Sensivel por tratar de indices e cotacoes.
- A exclusao tem validacao de uso e caminho de migracao.
- Usa `cadModalAbrir` e varios pontos de mutacao.
- Risco alto para um novo ciclo logo apos CID.

### Cenarios financeiros

- Esta acoplado ao fluxo de procedimentos e calculos.
- A superficie funcional e mais sensivel do que parece.
- Nao e adequado como proximo candidato.

## 7. Modulos descartados e motivo

- `Auxiliares / Tabelas auxiliares`: possivel, mas nao ideal agora por compartilhar scaffold com `Plano de Contas` e usar `cadModal`.
- `Materiais`: superficie grande, multiplas listas, modais e dependencias numericas.
- `Indices financeiros`: regras de uso, cotacoes, exclusao e migracao com risco financeiro.
- `Cenarios financeiros`: calculos e dependencia de procedimentos, alto risco.
- Fora do conjunto principal e portanto nao escolhidos agora:
  - `Editor de Textos`
  - `Símbolos Gráficos`
  - `Agenda`
  - `Convênios e Planos`
  - `Prestadores`
  - `Procedimentos`
  - `Procedimentos Genéricos`

## 8. Mapa sintetico de fronteiras observadas

### Medicamentos

- Abertura/painel: `medicamentosAbrir()`
- Lista/render: `medicamentosCarregarLista()`, `medicamentosRender()`
- Modal: `medicamentosAbrirModal()`, `medicamentosFecharModal()`
- Salvar/excluir: `medicamentosSalvarModal()`, `medicamentosExcluirSelecionado()`, `medicamentosExcluirNoModal()`
- Eventos: `medicamentosVincularEventos()`
- API: `/medicamentos`, `/medicamentos/opcoes/grupos`, `/medicamentos/opcoes/apresentacoes`, `/medicamentos/opcoes/usos`

### Auxiliares

- Abertura/painel: `auxAbrir()`
- Lista/render: `auxCarregarTipos()`, `auxCarregarItens()`
- Seleção: `auxSelecionarTipoLinha()`, `auxSelecionarItemLinha()`
- Modal: `auxDialogItem()`
- Excluir: `auxExcluirItem()`
- API: `/cadastros/auxiliares/tipos`, `/cadastros/auxiliares?tipo=...`, `/cadastros/auxiliares/{id}`

### Materiais

- Abertura/painel: bloco de materiais principal e modal
- Lista/render: `materiaisCarregarListas()`, `materiaisCarregar()`, `materiaisRender()`
- Modal: `materiaisAbrirModal()`, `materiaisFecharModal()`
- Salvar/excluir: `materiaisSalvarModal()`, `materiaisExcluirSelecionado()`
- Tabelas auxiliares internas: `materiaisTabelaAbrirModal()`, `materiaisTabelaSalvarModal()`, `materiaisExcluirTabela()`
- API: `/materiais`, `/materiais/listas`, `/materiais/indices`, `/cadastros/auxiliares?...`

### Indices financeiros

- Abertura/painel: `indicesAbrir()`
- Lista/render: `indicesCarregar()`, `indicesRender()`, `indicesCarregarCotacoes()`, `indicesRenderCotacoes()`
- CRUD: `indicesNovo()`, `indicesAlterar()`, `indicesExcluir()`
- API: `/indices-financeiros`, `/indices-financeiros/{id}/cotacoes`, `/indices-financeiros/{id}/em-uso`, `/indices-financeiros/{id}/migrar-e-excluir`

### Cenarios financeiros

- Abertura/painel: `abrirCenario()`
- Carregamento/salvar: `carregarCenario()`, `salvarCenario()`
- Calculo: `calcularFixosAno()`
- API: `/cenario`, `/cenario/calcular-fixos`

## 9. Possiveis helpers puros

- `Medicamentos`: nao apareceu helper puro seguro claro para extraacao inicial.
- `Auxiliares`: nao apareceu helper puro prioritario claro.
- `Materiais`: ha utilitarios locais, mas o conjunto e grande demais para iniciar agora.
- `Indices financeiros`: sem helper puro prioritario claro.
- `Cenarios financeiros`: sem helper puro seguro claro.

## 10. Módulo recomendado

- **Recomendado agora: `Medicamentos`**

### Justificativa tecnica

- E o primeiro candidato que combina:
  - fluxo ainda contido;
  - modulo proprio e isolado;
  - sem dependencia do scaffold compartilhado de `Plano de Contas`;
  - sem acoplamento tão pesado quanto `Materiais`, `Indices financeiros` e `Cenarios financeiros`.
- Mesmo com o duplo clique atual por heuristica de tempo, o raio de impacto tende a ser menor que nos demais candidatos.
- E o candidato mais natural depois de `CID` para manter a sequencia segura.

### Riscos do modulo escolhido

- O fluxo de lista e modal e maior que o de CID, entao a Subetapa 0 precisa ser bem detalhada.
- O duplo clique ainda usa detectacao por tempo no click, o que exige cuidado em futuras correcoes.
- A tela possui varios selects e campos, entao qualquer wrapper futuro precisa preservar o contrato dos payloads.

## 11. Proposta de Subetapa 0 para Medicamentos

- Mapear somente o modulo monolitico de Medicamentos em `frontend/app.js`.
- Confirmar:
  - funcao principal de abertura;
  - funcoes relacionadas;
  - variaveis/cache;
  - DOM usado;
  - eventos/binds;
  - endpoints/API;
  - dependencias compartilhadas;
  - riscos de duplo clique e filtros;
  - possiveis helpers puros;
  - itens que nao devem ser movidos nas proximas subetapas.
- Nao criar modulo novo ainda.
- Nao alterar `app.js` nem `index.html` nesta primeira subetapa.

## 12. Teste manual recomendado antes de iniciar o novo ciclo

1. Fazer `Ctrl+F5`.
2. Abrir `Cadastro > Medicamentos...`.
3. Confirmar abertura do painel.
4. Confirmar carregamento da lista.
5. Testar filtro por nome e grupo.
6. Clicar em uma linha e confirmar selecao.
7. Testar o segundo clique rapido e confirmar abertura do modal de edicao.
8. Testar o botao `Altera...`.
9. Testar `Novo medicamento...`.
10. Testar salvar sem campo obrigatorio.
11. Testar salvar com dados validos.
12. Testar `Elimina`.
13. Fechar e reabrir o painel.
14. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
15. Fazer regressao rapida em `CID`, `Plano de Contas` e `Unidades` para garantir que o shell continua intacto.

## 13. Confirmacao final

- Nenhum codigo funcional foi alterado nesta varredura.
