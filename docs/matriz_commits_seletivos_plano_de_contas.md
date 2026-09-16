# Matriz de commits seletivos - Plano de contas e shell global

Data de referência: 2026-07-15

Este documento consolida a análise seletiva para permitir commits pequenos, seguros e rastreáveis no projeto Brana Cloude.

Escopo deste registro:

- Plano de contas no frontend React.
- Regressões associadas no backend.
- Testes automatizados do fluxo.
- Correção visual global do shell, tratada em frente separada.

Fora de escopo:

- CRUDs de outras áreas.
- Refatorações amplas.
- Mudanças destrutivas de banco.
- Commit, push ou stage.

## Critério de leitura

Cada item abaixo foi classificado para indicar se pode entrar inteiro em um commit seletivo ou se precisa ser quebrado em hunks mais finos.

- `Sim`: o arquivo é coeso o bastante para um commit próprio.
- `Parcial`: o arquivo está misturado com outras frentes e precisa de seleção por trecho.
- `Não`: o arquivo deve ficar fora deste pacote.

## Matriz

| Arquivo | Situação | Frentes contidas | Pode entrar inteiro? | Precisa de hunk? | Commit sugerido | Dependências |
|---|---|---|---|---|---|---|
| `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | Parcial | Integração da página, eventos do toolbar, estado de seleção, ações de categoria/grupo | Não | Sim | Commit 1 e/ou Commit 3 | `usePlanoContas.js`, `usePlanoContasSelection.js`, `PlanoContasToolbar.jsx` |
| `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | Sim | Estado principal e orquestração do módulo | Sim | Não | Commit 1 | `planoContasApi.js`, `planoContasMappers.js`, validators |
| `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | Sim | Persistência/controle de seleção | Sim | Não | Commit 1 | `usePlanoContas.js` |
| `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js` | Sim | Fluxo de migração de categoria em uso | Sim | Não | Commit 5 | `planoContasApi.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | Parcial | Toolbar do módulo, publicação de estado, botões de ação | Não | Sim | Commit 1 e/ou Commit 4 | `PlanoContasPage.jsx`, `App.jsx` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx` | Sim | Modal de migração + exclusão | Sim | Não | Commit 5 | `usePlanoContasCategoryMigration.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` | Sim | Listagem de categorias e ações da linha | Sim | Não | Commit 3 e 4 | `usePlanoContas.js`, `usePlanoContasSelection.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx` | Sim | Listagem de grupos | Sim | Não | Commit 2 | `usePlanoContas.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` | Sim | Modal de cadastro/edição de categoria | Sim | Não | Commit 3 | `usePlanoContas.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx` | Sim | Modal de cadastro/edição de grupo | Sim | Não | Commit 2 | `usePlanoContas.js` |
| `frontend-react/src/features/planoContas/planoContasApi.js` | Sim | Camada de API do domínio | Sim | Não | Commit 1, 2, 3, 4 e 5 | backend de cadastros |
| `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` | Sim | Regras de exclusão de categoria | Sim | Não | Commit 4 e 5 | `planoContasApi.js` |
| `frontend-react/src/features/planoContas/planoContasCategoryValidators.js` | Sim | Validações de categoria | Sim | Não | Commit 3 e 5 | `planoContasMappers.js` |
| `frontend-react/src/features/planoContas/planoContasMappers.js` | Sim | Mapeamento de dados do domínio | Sim | Não | Commit 1, 2, 3 e 5 | API e validators |
| `frontend-react/src/features/planoContas/planoContasValidators.js` | Sim | Validações gerais do módulo | Sim | Não | Commit 1 | `PlanoContasPage.jsx` |
| `frontend-react/src/app/App.jsx` | Parcial | Rota, menu, estado do toolbar, callbacks do módulo e outras frentes | Não | Sim | Commit 1 e Commit 6 | `PlanoContasPage.jsx`, `PlanoContasToolbar.jsx` |
| `frontend-react/src/styles/globals.css` | Parcial | Shell global, incluindo a correção da banda auxiliar | Não | Sim | Commit 6 | `App.jsx`, shell global |
| `backend/tests/test_cadastros_categorias.py` | Sim | Delete, 409, migração, tenant, rollback | Sim | Não | Commit 4 e 5 | backend de categorias |
| `backend/tests/test_cadastros_grupos.py` | Sim | CRUD e regressões de grupos | Sim | Não | Commit 2 | backend de grupos |
| `backend/tests/test_auth_renew.py` | Não | Regressão paralela não específica de Plano de contas | Não | Não | Fora deste pacote | sessão/autenticação |
| `backend/tests/test_procedimentos_financeiro.py` | Não | Regressão paralela não específica de Plano de contas | Não | Não | Fora deste pacote | procedimentos/financeiro |
| `frontend-react/tests/planoContasCategoryMigrationModal.test.js` | Sim | Modal de migração | Sim | Não | Commit 5 | modal e hook de migração |
| `frontend-react/tests/planoContasCategoryMigrationFlow.test.js` | Sim | Fluxo de migração e exclusão | Sim | Não | Commit 5 | API e modal |
| `frontend-react/tests/planoContasDeletionSelection.test.js` | Sim | Preservação de seleção ao excluir | Sim | Não | Commit 4 | seleção, tabela, exclusão |
| `frontend-react/tests/planoContasToolbar.test.js` | Sim | Estado do toolbar e ações | Sim | Não | Commit 1 e 6 | `App.jsx`, toolbar |
| `frontend-react/tests/planoContasPageDelete.test.js` | Sim | Fluxo de delete na página | Sim | Não | Commit 4 | `PlanoContasPage.jsx` |
| `frontend-react/tests/planoContasRouting.test.js` | Sim | Roteamento do módulo | Sim | Não | Commit 1 | `App.jsx` |
| `frontend-react/tests/planoContasCategoryRouting.test.js` | Sim | Roteamento de categoria | Sim | Não | Commit 1 e 3 | `App.jsx` |
| `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md` | Sim | Registro operacional da etapa | Sim | Não | Commit 7 | documentação |
| `docs/contrato_exclusao_migracao_plano_de_contas.md` | Sim | Contrato funcional do fluxo | Sim | Não | Commit 7 | documentação |
| `docs/contrato_funcional_plano_de_contas.md` | Sim | Contrato funcional base | Sim | Não | Commit 7 | documentação |
| `docs/roadmap_plano_de_contas_frontend_react.md` | Sim | Roadmap específico do módulo | Sim | Não | Commit 7 | documentação |
| `docs/frontend_react_refino_visual_shell_operacional.md` | Sim | Shell visual e correção da banda auxiliar | Sim | Não | Commit 6 | `globals.css` |
| `docs/11_roadmap_desenvolvimento.md` | Não | Documento muito misturado com várias frentes | Não | Sim | Fora deste pacote ou commit próprio posterior | revisão manual por frente |

## Sequência recomendada de commits

### Commit 1 - Fundação do módulo

Objetivo:

- Entregar a espinha dorsal do Plano de contas sem depender de telas isoladas.

Inclui:

- `usePlanoContas.js`
- `usePlanoContasSelection.js`
- `planoContasApi.js`
- `planoContasMappers.js`
- `planoContasValidators.js`
- hunks estritamente necessários de `PlanoContasPage.jsx`
- hunks estritamente necessários de `PlanoContasToolbar.jsx`
- hunks estritamente necessários de `App.jsx`
- testes de roteamento e toolbar que dependam da fundação

Observação:

- Este commit só é seguro se a página ainda compilar e abrir o módulo sem abandonar o estado atual.

### Commit 2 - Grupos

Objetivo:

- Consolidar o fluxo de grupos.

Inclui:

- `PlanoContasGroupModal.jsx`
- `PlanoContasGroupsTable.jsx`
- hunk correspondente em `PlanoContasPage.jsx`
- backend de grupos
- teste de grupos

### Commit 3 - Categorias base

Objetivo:

- Consolidar cadastro/edição de categorias.

Inclui:

- `PlanoContasCategoryModal.jsx`
- `PlanoContasCategoriesTable.jsx`
- `planoContasCategoryValidators.js`
- hunks correspondentes em `PlanoContasPage.jsx`
- teste de roteamento de categoria

### Commit 4 - Exclusão simples

Objetivo:

- Implementar a exclusão simples de categoria com seleção preservada.

Inclui:

- `planoContasCategoryDeletion.js`
- hunks correspondentes em `PlanoContasPage.jsx`
- `PlanoContasCategoriesTable.jsx` se a ação de exclusão estiver acoplada à linha
- testes de delete e seleção
- backend de exclusão simples e regressões relacionadas

### Commit 5 - Migração de categoria em uso

Objetivo:

- Tratar o `409` com migração controlada antes da exclusão.

Inclui:

- `usePlanoContasCategoryMigration.js`
- `PlanoContasCategoryMigrationModal.jsx`
- `planoContasCategoryValidators.js` se houver regra extra de migração
- testes do modal e do fluxo
- backend de migração e cenários de rollback

### Commit 6 - Shell global

Objetivo:

- Manter a correção visual global do shell separada do domínio Plano de contas.

Inclui:

- hunk mínimo em `frontend-react/src/styles/globals.css`
- hunk mínimo em `App.jsx` se houver publicação de estado do shell
- hunk mínimo em `PlanoContasToolbar.jsx` se houver integração visual/estado
- `docs/frontend_react_refino_visual_shell_operacional.md`

Observação:

- Este commit não deve ser misturado com CRUD de Plano de contas.

### Commit 7 - Documentação

Objetivo:

- Registrar os contratos e o fechamento operacional.

Inclui:

- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`
- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

## Arquivos que exigem corte por hunk

Os seguintes arquivos não devem ser levados inteiros para um commit seletivo porque concentram múltiplas frentes:

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`
- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

Critério prático:

- separar por símbolo, fluxo ou bloco de integração;
- não misturar shell global com CRUD;
- não misturar plano de contas com outras frentes;
- não incluir documentação genérica que cite muitas etapas em um mesmo patch.

## Regras de segurança para execução seletiva

- Não stage, commit ou push enquanto a seleção não estiver fechada.
- Não usar este documento como justificativa para limpar o worktree.
- Não restaurar arquivos de outras frentes.
- Não inferir que build verde confirma correção visual.
- Validar no navegador quando a dúvida for geométrica ou visual.

## Fechamento

Conclusão operacional:

- O pacote de Plano de contas é selecionável em commits menores, mas `App.jsx`, `PlanoContasPage.jsx`, `PlanoContasToolbar.jsx` e `globals.css` precisam ser fatiados por hunk.
- A correção do shell global deve seguir separada do CRUD.
- `docs/11_roadmap_desenvolvimento.md` está misturado demais para entrar neste pacote sem risco.
- Nenhum arquivo foi staged, commitado ou enviado.
