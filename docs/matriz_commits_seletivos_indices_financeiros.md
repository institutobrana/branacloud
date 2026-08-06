# Matriz de Commits Seletivos - Indices Financeiros

## 1. Objetivo

Definir a sequencia de commits seletivos para a futura implementacao do modulo `Configuracoes -> Indices financeiros` no frontend React.

## 2. Regras

- Nao criar commit agora.
- Nao fazer stage agora.
- Nao misturar com Plano de contas.
- Nao misturar com shell global fora do necessario.
- Nao misturar com backend nao relacionado.

## 3. Criterio de leitura

- `Sim`: arquivo pode entrar inteiro no commit.
- `Parcial`: arquivo precisa de corte por hunk.
- `Nao`: arquivo deve ficar fora do commit.

## 4. Matriz

| Arquivo | Situacao | Frentes contidas | Pode entrar inteiro? | Precisa de hunk? | Commit sugerido | Dependencias |
|---|---|---|---|---|---|---|
| `frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx` | Parcial | pagina, selecao, dialogs, integracao de toolbar | nao | sim | 1 e 2 | hooks, api, tabela |
| `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceiros.js` | Sim | estado e orquestracao | sim | nao | 1 | api, mappers, selection |
| `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceirosSelection.js` | Sim | selecao de indice e cotacao | sim | nao | 1 | mappers, reserved |
| `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceirosCotacoes.js` | Sim | detalhe e resposta fora de ordem | sim | nao | 2 | api |
| `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceirosMigration.js` | Sim | estado e reconciliação de migracao | sim | nao | 5 | api, selection |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx` | Parcial | toolbar, botao, estados | nao | sim | 1 e 2 | pagina, shell |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosTable.jsx` | Sim | lista principal | sim | nao | 1 | hook, mapper |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesCotacoesTable.jsx` | Sim | lista secundaria | sim | nao | 2 | hook detalhe |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosIndexDialog.jsx` | Sim | criar e alterar indice | sim | nao | 3 | validators, api |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosQuotationDialog.jsx` | Sim | criar e alterar cotacao | sim | nao | 6 | validators, api |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosDeletionDialog.jsx` | Sim | exclusao simples | sim | nao | 4 | api, selection |
| `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosMigrationDialog.jsx` | Sim | migracao e exclusao | sim | nao | 5 | hook de migracao |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js` | Sim | endpoints do dominio | sim | nao | 1 a 6 | backend de indices |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosMappers.js` | Sim | adaptacao de respostas | sim | nao | 1 e 2 | api |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosValidators.js` | Sim | validacao local | sim | nao | 3 e 6 | api, forms |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosReserved.js` | Sim | indices reservados | sim | nao | 1 | contrato funcional |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosFormatters.js` | Sim | data e decimal | sim | nao | 1 | helpers compartilhados |
| `frontend-react/tests/indicesFinanceirosRouting.test.js` | Sim | rota | sim | nao | 1 | App, routes |
| `frontend-react/tests/indicesFinanceirosToolbar.test.js` | Sim | toolbar inicial | sim | nao | 1 | toolbar |
| `frontend-react/tests/indicesFinanceirosSelection.test.js` | Sim | selecao | sim | nao | 1 | selection |
| `frontend-react/tests/indicesFinanceirosCotacoes.test.js` | Sim | detalhe | sim | nao | 2 | cotacoes hook |
| `frontend-react/tests/indicesFinanceirosIndexForm.test.js` | Sim | formulario de indice | sim | nao | 3 | dialog, validators |
| `frontend-react/tests/indicesFinanceirosDeletion.test.js` | Sim | exclusao simples | sim | nao | 4 | deletion hook |
| `frontend-react/tests/indicesFinanceirosMigration.test.js` | Sim | migracao | sim | nao | 5 | migration hook |
| `frontend-react/tests/indicesFinanceirosQuotationForm.test.js` | Sim | formulario de cotacao | sim | nao | 6 | dialog, validators |
| `frontend-react/tests/indicesFinanceirosTheme.test.js` | Sim | tema e contraste | sim | nao | 7 | shell, globals |
| `frontend-react/tests/indicesFinanceirosBuild.test.js` | Sim | build e integridade | sim | nao | 7 | todos os arquivos |

## 5. Sequencia recomendada de commits

### Commit 1 - Fundacao do modulo

Objetivo:

- tornar o modulo navegavel e legivel, sem mutacao destrutiva.

Inclui:

- `useIndicesFinanceiros.js`
- `useIndicesFinanceirosSelection.js`
- `indicesFinanceirosApi.js`
- `indicesFinanceirosMappers.js`
- `indicesFinanceirosReserved.js`
- `indicesFinanceirosFormatters.js`
- `IndicesFinanceirosTable.jsx`
- `IndicesFinanceirosToolbar.jsx` apenas com acoes basicas
- `indicesFinanceirosRouting.test.js`
- `indicesFinanceirosToolbar.test.js`
- `indicesFinanceirosSelection.test.js`

Riscos:

- toolbar ou pagina trazer fluxo destrutivo cedo demais.

Mensagem sugerida:

- `feat(indices-financeiros): fundacao do modulo`

### Commit 2 - Leitura de cotacoes

Objetivo:

- carregar o detalhe de cotacoes por indice.

Inclui:

- `useIndicesFinanceirosCotacoes.js`
- `IndicesCotacoesTable.jsx`
- testes de cotacoes.

Riscos:

- resposta fora de ordem nao tratada.

Mensagem sugerida:

- `feat(indices-financeiros): leitura de cotacoes`

### Commit 3 - CRUD de indice

Objetivo:

- criar e alterar indice.

Inclui:

- `IndicesFinanceirosIndexDialog.jsx`
- `indicesFinanceirosValidators.js`
- testes de formulario de indice.

Riscos:

- validacao local divergir do backend.

Mensagem sugerida:

- `feat(indices-financeiros): crud de indice`

### Commit 4 - Exclusao simples de indice

Objetivo:

- excluir indice sem migracao.

Inclui:

- `IndicesFinanceirosDeletionDialog.jsx`
- logica de exclusao no hook principal
- testes de exclusao.

Riscos:

- 409 ser tratado como se ja fosse migracao completa.

Mensagem sugerida:

- `feat(indices-financeiros): exclusao simples de indice`

### Commit 5 - Migracao de indice em uso

Objetivo:

- tratar o 409 com destino e exclusao final.

Inclui:

- `useIndicesFinanceirosMigration.js`
- `IndicesFinanceirosMigrationDialog.jsx`
- testes de migracao.

Riscos:

- destino invalido ou selecao incoerente.

Mensagem sugerida:

- `feat(indices-financeiros): migracao de indice em uso`

### Commit 6 - CRUD de cotacao

Objetivo:

- criar e alterar cotacoes.

Inclui:

- `IndicesFinanceirosQuotationDialog.jsx`
- `indicesFinanceirosQuotationValidators` se existir como arquivo proprio ou bloco equivalente em `indicesFinanceirosValidators.js`
- testes de formulario de cotacao.

Riscos:

- frontend repetir calculo de valor atual.

Mensagem sugerida:

- `feat(indices-financeiros): crud de cotacao`

### Commit 7 - Tema, acessibilidade e homologacao documental

Objetivo:

- fechar o modulo com tema e verificacoes finais.

Inclui:

- `indicesFinanceirosTheme.test.js`
- `indicesFinanceirosBuild.test.js`
- eventuais ajustes visuais finais do modulo.

Riscos:

- misturar shell global com o modulo.

Mensagem sugerida:

- `test(indices-financeiros): cobre fluxo e integridade`

## 6. Arquivos que exigem corte por hunk

- `frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosToolbar.jsx`

## 7. Arquivos de stage mais seguro

- `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceiros.js`
- `frontend-react/src/features/indicesFinanceiros/hooks/useIndicesFinanceirosSelection.js`
- `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js`
- `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosMappers.js`
- `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosReserved.js`
- `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosFormatters.js`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosTable.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesCotacoesTable.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosIndexDialog.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosQuotationDialog.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosDeletionDialog.jsx`
- `frontend-react/src/features/indicesFinanceiros/components/IndicesFinanceirosMigrationDialog.jsx`

## 8. Criterios de interrupcao

- qualquer calculo local de valor atual;
- qualquer controle manual de tenant;
- qualquer mistura com Plano de contas;
- qualquer arquivo compartilhado sem corte seguro;
- qualquer commit antes da validacao da rota e da leitura.

## 9. Conclusao

A sequencia minima recomendada e:

1. fundacao do modulo;
2. leitura de cotacoes;
3. CRUD de indice;
4. exclusao simples;
5. migracao;
6. CRUD de cotacao;
7. fechamento visual e de teste.

## 10. Fechamento da matriz seletiva

Classificacao consolidada para a rodada atual:

- `frontend-react/src/app/App.jsx` - arquivo misto, precisa de stage futuro por hunk e nao deve receber stage cego;
- `frontend-react/src/app/basePath.js` - correcao geral de ambiente, commit tecnico separado se mantida;
- `frontend-react/vite.config.js` - correcao geral de ambiente, commit tecnico separado se mantida;
- `frontend-react/src/features/indicesFinanceiros/**` - pertence a frente e pode compor o commit seletivo da feature;
- `backend/routes/indices_financeiros_routes.py` - backend autorizado da frente, candidato a commit coerente da feature;
- `backend/tests/test_indices_financeiros_patch_reserved.py` - backend autorizado da frente, candidato ao mesmo bloco de backend;
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx` - outra frente, fora do commit de indices financeiros;
- `frontend-react/src/features/auth/AuthProvider.jsx`, `authApi.js` e `authStorage.js` - alteracoes de autenticacao gerais, nao entram automaticamente no commit da feature.

Mensagem de commit ainda proposta, sem execucao:

- `feat(indices-financeiros): encerra contrato e consolidacao documental`
