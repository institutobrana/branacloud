# Lista prática de stage seletivo - Plano de contas

Data de referência: 2026-07-15

Este documento transforma o roteiro operacional de stage em uma lista prática, precisa e executável para os futuros commits do Plano de contas e da correção global do shell.

Base:

- [`docs/roteiro_operacional_stage_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roteiro_operacional_stage_plano_de_contas.md)
- [`docs/matriz_commits_seletivos_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_commits_seletivos_plano_de_contas.md)

Regras desta etapa:

- não executar `git add`;
- não executar `git add -p`;
- não fazer stage;
- não fazer commit;
- não fazer push;
- não alterar código;
- não alterar documentos existentes, salvo este novo arquivo.

## Estado inicial confirmado

- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- O worktree segue muito misto.

## Validação já confirmada

- Frontend React: 122 testes passando.
- Backend: 30 testes passando.
- Build frontend: sucesso.
- Os documentos inexistentes foram confirmados como inexistentes:
  - `docs/auditoria_seletiva_final_diff_plano_de_contas.md`
  - `docs/auditoria_seletiva_diff_plano_de_contas.md`

## Regra de leitura

- `integralmente` significa que o arquivo pode entrar completo sem antecipar funcionalidade posterior.
- `por hunk` significa que o arquivo é misto e precisa de seleção por bloco.
- `recusar` significa que o trecho não deve entrar naquele commit.
- `adiar` significa que o trecho deve ficar para um commit posterior.

## COMMIT 1 - Fundação e integração inicial do Plano de contas

Objetivo:

- deixar o módulo navegável, carregável e conectado ao shell sem trazer delete/migração antes da hora.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | 1 | infraestrutura de seleção base | `planoContasMappers.js` | `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` |
| `frontend-react/src/features/planoContas/planoContasApi.js` | 1 | camada de API coesa por endpoint | backend de cadastros | `git add -- frontend-react/src/features/planoContas/planoContasApi.js` |
| `frontend-react/src/features/planoContas/planoContasMappers.js` | 1 | normalização central do domínio | API e seleção | `git add -- frontend-react/src/features/planoContas/planoContasMappers.js` |
| `frontend-react/src/features/planoContas/planoContasValidators.js` | 1 | validação base de grupo | page e API | `git add -- frontend-react/src/features/planoContas/planoContasValidators.js` |

### Arquivos untracked integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/tests/planoContasRouting.test.js` | 1 | valida a rota base do módulo | `App.jsx` | `git add -- frontend-react/tests/planoContasRouting.test.js` |
| `frontend-react/tests/planoContasToolbar.test.js` | 1 | valida estados iniciais da toolbar | `App.jsx` e toolbar | `git add -- frontend-react/tests/planoContasToolbar.test.js` |
| `frontend-react/tests/planoContasMappers.test.js` | 1 | cobre normalização base | mappers | `git add -- frontend-react/tests/planoContasMappers.test.js` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/app/App.jsx` | import `PlanoContasPage` / `PlanoContasToolbar` | Fundação | incluir hunk inteiro | 1 | imports de outras frentes | baixo |
| 2 | `frontend-react/src/app/App.jsx` | item de menu `plano-contas` | Fundação | incluir hunk inteiro | 1 | menu de outras frentes | baixo |
| 3 | `frontend-react/src/app/App.jsx` | rota `'/app/configuracoes/plano-de-contas'` | Fundação | incluir hunk inteiro | 1 | rotas de outras telas | baixo |
| 4 | `frontend-react/src/app/App.jsx` | render de `PlanoContasPage` | Fundação | incluir hunk inteiro | 1 | páginas de outras frentes | médio |
| 5 | `frontend-react/src/app/App.jsx` | `brana-plano-contas-toolbar-state` | shell / fundação | dividir com `s` | 1 ou 6 | handlers de outras telas | alto |
| 6 | `frontend-react/src/app/App.jsx` | `brana-plano-contas-toolbar-action` base | shell / fundação | dividir com `s` | 1 | ações de delete/migração antecipadas | alto |
| 7 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | estrutura base da página | Fundação | incluir hunk inteiro | 1 | blocos de delete/migração | médio |
| 8 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | leitura inicial e carregamento | Fundação | incluir hunk inteiro | 1 | lógica de delete/migração | médio |
| 9 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | seleção inicial | Fundação | incluir hunk inteiro | 1 | helpers posteriores de migração | médio |
| 10 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | botões iniciais | Fundação | incluir hunk inteiro | 1 | botão Eliminar e estados destrutivos | baixo |

### Hunk a recusar

- em `App.jsx`, qualquer trecho que já traga `Novo grupo`, `Alterar grupo`, `Nova categoria`, `Alterar categoria`, `Eliminar`, `canDelete`, `deleting`, `migrating` ou `migrationModalOpen` antes do commit correspondente;
- em `PlanoContasPage.jsx`, qualquer bloco que já acople confirmação simples de exclusão, `409` ou modal de migração;
- em `PlanoContasToolbar.jsx`, qualquer prop destrutiva antes do commit 4 ou 5;
- em `globals.css`, qualquer regra que não seja a banda auxiliar mínima;
- qualquer hunk de outras frentes.

### Dependências anteriores

- nenhum commit anterior do próprio Plano de contas é obrigatório para a fundação além da base já presente no branch;
- `App.jsx` depende da feature já importada e dos componentes existirem.

### Testes que devem acompanhar

- `frontend-react/tests/planoContasRouting.test.js`
- `frontend-react/tests/planoContasToolbar.test.js`
- `frontend-react/tests/planoContasMappers.test.js`

### Documentos correspondentes

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`
- `git add -- frontend-react/src/features/planoContas/planoContasApi.js`
- `git add -- frontend-react/src/features/planoContas/planoContasMappers.js`
- `git add -- frontend-react/src/features/planoContas/planoContasValidators.js`
- `git add -- frontend-react/tests/planoContasRouting.test.js`
- `git add -- frontend-react/tests/planoContasToolbar.test.js`
- `git add -- frontend-react/tests/planoContasMappers.test.js`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/app/App.jsx`
- `git diff -- frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `git diff -- frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`

### Testes futuros

- `node --test tests\\*.test.js`
- teste focado de rota do Plano de contas

### Build futuro

- `npm.cmd run build`

### Riscos

- código posterior entrar cedo se o hunk de `App.jsx` misturar integração e ações destrutivas;
- componente esperar prop inexistente se a toolbar for stageada antes da página;
- seleção de `PlanoContasPage.jsx` pode puxar handlers de delete sem necessidade.

### Mensagem sugerida de commit

- `feat(plano-contas): fundacao e integracao inicial`

## COMMIT 2 - CRUD de grupos

Objetivo:

- consolidar criação e edição de grupos.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx` | 2 | modal coeso de grupo | `usePlanoContas.js` | `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx` |
| `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx` | 2 | tabela de grupos coesa | seleção e API | `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx` |
| `backend/tests/test_cadastros_grupos.py` | 2 | regressão backend de grupos | backend isolado | `git add -- backend/tests/test_cadastros_grupos.py` |
| `frontend-react/tests/planoContasGrupoForm.test.js` | 2 | cobre formulário de grupo | modal e hook | `git add -- frontend-react/tests/planoContasGrupoForm.test.js` |

### Arquivos untracked integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/tests/planoContasCategoryRouting.test.js` | 2 ou 3 | valida navegação entre contexto e categoria | `App.jsx` | `git add -- frontend-react/tests/planoContasCategoryRouting.test.js` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleSaveGroup` | CRUD grupos | incluir hunk inteiro | 2 | qualquer delete/migration junto | médio |
| 2 | `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | `updatePlanoContasSelectionAfterGroupSave` | CRUD grupos | incluir hunk inteiro | 2 | lógica de destino de migração | médio |
| 3 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de grupo | CRUD grupos | incluir hunk inteiro | 2 | callbacks de categoria ou delete | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | `Novo grupo` / `Alterar grupo` | CRUD grupos | incluir hunk inteiro | 2 | props de categoria e delete | médio |
| 5 | `frontend-react/src/app/App.jsx` | ações `novo-grupo` / `alterar-grupo` | CRUD grupos | dividir com `s` | 2 | ações de categoria e delete | alto |

### Hunk a recusar

- qualquer trecho de delete de categoria;
- qualquer trecho de migração;
- qualquer bloco que puxe `Eliminar`;
- qualquer prop de toolbar que ainda não exista para o grupo.

### Dependências anteriores

- commit 1 já precisa existir ou, no mínimo, os arquivos base da fundação já precisam estar selecionados.

### Testes que devem acompanhar

- `frontend-react/tests/planoContasGrupoForm.test.js`
- `backend/tests/test_cadastros_grupos.py`

### Documentos correspondentes

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx`
- `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx`
- `git add -- backend/tests/test_cadastros_grupos.py`
- `git add -- frontend-react/tests/planoContasGrupoForm.test.js`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `git diff -- frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `git diff -- frontend-react/src/app/App.jsx`

### Testes futuros

- `node --test tests\\planoContasGrupoForm.test.js`
- `python -m unittest backend.tests.test_cadastros_grupos`

### Build futuro

- `npm.cmd run build`

### Riscos

- `App.jsx` pode misturar eventos de grupo com outras frentes;
- `usePlanoContas.js` pode carregar estado de categoria junto se o hunk não for bem cortado;
- risco médio de commit intermediário quebrado se a página depender de props ainda não stageadas.

### Mensagem sugerida de commit

- `feat(plano-contas): crud de grupos`

## COMMIT 3 - CRUD de categorias

Objetivo:

- consolidar criação e edição de categorias sem exclusão nem migração.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` | 3 | modal coeso de categoria | `usePlanoContas.js` | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` | 3 | tabela de categorias coesa | seleção e API | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` |
| `frontend-react/src/features/planoContas/planoContasCategoryValidators.js` | 3 | validação de categoria | API e mappers | `git add -- frontend-react/src/features/planoContas/planoContasCategoryValidators.js` |
| `frontend-react/tests/planoContasCategoryForm.test.js` | 3 | cobre formulário de categoria | modal e hook | `git add -- frontend-react/tests/planoContasCategoryForm.test.js` |

### Arquivos untracked integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/tests/planoContasCategoryRouting.test.js` | 3 | navegação categoria | `App.jsx` | `git add -- frontend-react/tests/planoContasCategoryRouting.test.js` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleSaveCategory` | CRUD categorias | incluir hunk inteiro | 3 | delete/migration no mesmo bloco | médio |
| 2 | `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | `selectPlanoContasCategory` | CRUD categorias | incluir hunk inteiro | 3 | seleção de destino de migração | médio |
| 3 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de categoria | CRUD categorias | incluir hunk inteiro | 3 | delete e migration handlers | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | `Nova categoria` / `Alterar categoria` | CRUD categorias | incluir hunk inteiro | 3 | botão Eliminar | médio |
| 5 | `frontend-react/src/app/App.jsx` | ações `nova-categoria` / `alterar-categoria` | CRUD categorias | dividir com `s` | 3 | delete e migração | alto |

### Hunk a recusar

- qualquer bloco de exclusão;
- qualquer bloco de `409`;
- qualquer bloco de modal de migração;
- qualquer prop destrutiva antecipada.

### Dependências anteriores

- commits 1 e 2, ou os trechos equivalentes já selecionados, devem estar presentes para a página continuar íntegra.

### Testes que devem acompanhar

- `frontend-react/tests/planoContasCategoryForm.test.js`
- `frontend-react/tests/planoContasCategoryRouting.test.js`

### Documentos correspondentes

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx`
- `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx`
- `git add -- frontend-react/src/features/planoContas/planoContasCategoryValidators.js`
- `git add -- frontend-react/tests/planoContasCategoryForm.test.js`
- `git add -- frontend-react/tests/planoContasCategoryRouting.test.js`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `git diff -- frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `git diff -- frontend-react/src/app/App.jsx`

### Testes futuros

- `node --test tests\\planoContasCategoryForm.test.js`
- `node --test tests\\planoContasCategoryRouting.test.js`

### Build futuro

- `npm.cmd run build`

### Riscos

- categoria pode puxar delete junto se o corte for frouxo;
- `App.jsx` é especialmente sensível a mistura de ações;
- commit intermediário pode quebrar se a toolbar esperar prop de delete antes da hora.

### Mensagem sugerida de commit

- `feat(plano-contas): crud de categorias`

## COMMIT 4 - Exclusão simples de categoria

Objetivo:

- fechar a exclusão simples sem migrar ainda.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` | 4 | helpers coesos de exclusão simples | API e seleção | `git add -- frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` |
| `backend/tests/test_cadastros_categorias.py` | 4 | cobre delete simples e 409 | backend isolado | `git add -- backend/tests/test_cadastros_categorias.py` |
| `frontend-react/tests/planoContasDeletionSelection.test.js` | 4 | seleção após excluir | seleção e página | `git add -- frontend-react/tests/planoContasDeletionSelection.test.js` |
| `frontend-react/tests/planoContasPageDelete.test.js` | 4 | delete na página | `PlanoContasPage.jsx` | `git add -- frontend-react/tests/planoContasPageDelete.test.js` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleDeleteCategory` | exclusão simples | dividir com `s` | 4 | migração e helpers futuros | alto |
| 2 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | confirmação simples de exclusão | exclusão simples | dividir com `s` | 4 | tratamento do `409` e modal de migração | alto |
| 3 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | prop `onDeleteCategory` / botão `Eliminar` | exclusão simples | incluir hunk inteiro | 4 | props de migração se aparecerem | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` | ação da linha de exclusão | exclusão simples | incluir hunk inteiro | 4 | modal de migração | médio |
| 5 | `frontend-react/src/app/App.jsx` | ação `eliminar-categoria` básica | exclusão simples | dividir com `s` | 4 | migração futura e outras telas | alto |

### Hunk a recusar

- qualquer bloco que já abra modal de migração;
- qualquer bloco com `migrating` ou `migrationModalOpen`;
- qualquer bloco que já chame `migrar-e-excluir`;
- qualquer bloco de shell global.

### Dependências anteriores

- commits 1, 2 e 3 precisam estar presentes ou equivalentes para a UI continuar estável.

### Testes que devem acompanhar

- `frontend-react/tests/planoContasDeletionSelection.test.js`
- `frontend-react/tests/planoContasPageDelete.test.js`
- `backend/tests/test_cadastros_categorias.py`

### Documentos correspondentes

- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`
- `git add -- frontend-react/tests/planoContasDeletionSelection.test.js`
- `git add -- frontend-react/tests/planoContasPageDelete.test.js`
- `git add -- backend/tests/test_cadastros_categorias.py`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `git diff -- frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `git diff -- frontend-react/src/app/App.jsx`

### Testes futuros

- `node --test tests\\planoContasDeletionSelection.test.js`
- `node --test tests\\planoContasPageDelete.test.js`
- `python -m unittest backend.tests.test_cadastros_categorias`

### Build futuro

- `npm.cmd run build`

### Riscos

- `git add -p` pode não bastar em `usePlanoContas.js` e `PlanoContasPage.jsx`;
- há risco de selecionar código de migração sem os imports necessários;
- `App.jsx` pode puxar handlers futuros se o hunk não for recortado.

### Mensagem sugerida de commit

- `feat(plano-contas): exclusao simples de categoria`

## COMMIT 5 - Migração e exclusão de categoria em uso

Objetivo:

- tratar o `409` com migração controlada antes da exclusão.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js` | 5 | estado e reconciliação da migração | API e seleção | `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx` | 5 | modal coeso de migração | hook de migração | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx` |
| `frontend-react/tests/planoContasCategoryMigrationModal.test.js` | 5 | cobre modal de migração | modal e hook | `git add -- frontend-react/tests/planoContasCategoryMigrationModal.test.js` |
| `frontend-react/tests/planoContasCategoryMigrationFlow.test.js` | 5 | cobre fluxo completo | API, modal e página | `git add -- frontend-react/tests/planoContasCategoryMigrationFlow.test.js` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleDeleteCategory` com `409` | migração | dividir com `s` | 5 | delete simples já fechado no commit 4 | alto |
| 2 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleConfirmCategoryMigration` | migração | dividir com `s` | 5 | outras ações do formulário | alto |
| 3 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | tratamento do `409` | migração | dividir com `s` | 5 | delete simples e callbacks não relacionados | alto |
| 4 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de migração | migração | dividir com `s` | 5 | blocos de grupo/categoria não destrutivos | alto |
| 5 | `frontend-react/src/features/planoContas/PlanoContasToolbar.jsx` | `migrating` / `migrationModalOpen` / `canDelete` | migração | dividir com `s` | 5 | props de grupo/categoria sem relação | alto |
| 6 | `frontend-react/src/app/App.jsx` | `migrating` / `migrationModalOpen` / ação `eliminar-categoria` avançada | migração | dividir com `s` | 5 | outros módulos e ações genéricas | alto |
| 7 | `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` | payload / filtro / classificação de erro da migração | migração | incluir hunk inteiro | 5 | nada do commit 4 | baixo |

### Hunk a recusar

- qualquer bloco que ainda trate exclusão simples como se fosse o fluxo final;
- qualquer bloco de shell global;
- qualquer bloco de outros módulos;
- qualquer tentativa de misturar grupo com categoria.

### Dependências anteriores

- commit 4 precisa estar concluído ou equivalente, para não deixar a exclusão simples dependente do modal de migração;
- commits 1, 2 e 3 também precisam estar estáveis.

### Testes que devem acompanhar

- `frontend-react/tests/planoContasCategoryMigrationModal.test.js`
- `frontend-react/tests/planoContasCategoryMigrationFlow.test.js`
- `backend/tests/test_cadastros_categorias.py`

### Documentos correspondentes

- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`
- `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`
- `git add -- frontend-react/tests/planoContasCategoryMigrationModal.test.js`
- `git add -- frontend-react/tests/planoContasCategoryMigrationFlow.test.js`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `git diff -- frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `git diff -- frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`

### Testes futuros

- `node --test tests\\planoContasCategoryMigrationModal.test.js`
- `node --test tests\\planoContasCategoryMigrationFlow.test.js`
- `python -m unittest backend.tests.test_cadastros_categorias`

### Build futuro

- `npm.cmd run build`

### Riscos

- o hunk de migração é o mais propenso a exigir `s` e `e`;
- `usePlanoContas.js` pode carregar delete simples e migração no mesmo bloco;
- `App.jsx` e `PlanoContasPage.jsx` podem misturar ações destrutivas com estados globais.

### Mensagem sugerida de commit

- `feat(plano-contas): migracao e exclusao de categoria em uso`

## COMMIT 6 - Correção global da banda auxiliar do shell

Objetivo:

- manter a correção global visual do shell separada do CRUD.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `docs/frontend_react_refino_visual_shell_operacional.md` | 6 | documentação da correção global | shell visual | `git add -- docs/frontend_react_refino_visual_shell_operacional.md` |

### Arquivos rastreados por hunk

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/styles/globals.css` | `.auxiliary-shell-band { box-shadow: none; }` | shell global | incluir hunk inteiro se isolado | 6 | qualquer outra regra visual global | alto |
| 2 | `frontend-react/src/app/App.jsx` | estado publicado para o shell, se houver acoplamento | shell global | combinar com outro commit | 6 | CRUD de Plano de contas | alto |
| 3 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | props ligadas ao estado global do shell | shell global | combinar com outro commit | 6 | props destrutivas e CRUD | alto |

### Hunk a recusar

- qualquer regra de estilo que não seja a banda auxiliar mínima;
- qualquer bloco do Plano de contas que antecipe CRUD;
- qualquer bloco de outras frentes.

### Dependências anteriores

- nenhum commit funcional novo do Plano de contas depende desta correção;
- esta frente deve ficar isolada.

### Testes que devem acompanhar

- `frontend-react/tests/auxiliaryShellBandContract.test.js`
- `frontend-react/tests/planoContasToolbar.test.js` apenas se o estado do shell for realmente publicado por ela

### Documentos correspondentes

- `docs/frontend_react_refino_visual_shell_operacional.md`

### Comandos futuros de stage

- `git add -- frontend-react/src/styles/globals.css`
- `git add -- docs/frontend_react_refino_visual_shell_operacional.md`

### Comandos futuros de inspeção

- `git diff -- frontend-react/src/styles/globals.css`
- `git diff -- frontend-react/src/app/App.jsx`

### Testes futuros

- `node --test tests\\auxiliaryShellBandContract.test.js`

### Build futuro

- `npm.cmd run build`

### Riscos

- `globals.css` é muito sensível a seleção errada;
- se o hunk vier colado a outras regras, `git add -p` pode não ser suficiente;
- patch temporário pode ser mais seguro do que stage direto.

### Mensagem sugerida de commit

- `fix(shell): remover divisor inferior da banda auxiliar`

## COMMIT 7 - Consolidação documental, somente se necessário

Objetivo:

- consolidar os documentos de apoio apenas se ainda houver pendências documentais reais.

### Arquivos integrais

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md` | 7 | checklist de implementação | contratos e validações | `git add -- docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md` |
| `docs/contrato_exclusao_migracao_plano_de_contas.md` | 7 | contrato funcional de exclusão/migração | validações e runtime | `git add -- docs/contrato_exclusao_migracao_plano_de_contas.md` |
| `docs/contrato_funcional_plano_de_contas.md` | 7 | contrato funcional base | backend e frontend | `git add -- docs/contrato_funcional_plano_de_contas.md` |
| `docs/roadmap_plano_de_contas_frontend_react.md` | 7 | roadmap do módulo | sequência funcional | `git add -- docs/roadmap_plano_de_contas_frontend_react.md` |
| `docs/matriz_commits_seletivos_plano_de_contas.md` | 7 | matriz seletiva já validada | roteiros anteriores | `git add -- docs/matriz_commits_seletivos_plano_de_contas.md` |
| `docs/roteiro_operacional_stage_plano_de_contas.md` | 7 | roteiro operacional já validado | matriz anterior | `git add -- docs/roteiro_operacional_stage_plano_de_contas.md` |

### Arquivos rastreados por hunk

- nenhum obrigatório, desde que a etapa seja apenas consolidação documental.

### Hunk a recusar

- `docs/11_roadmap_desenvolvimento.md` continua fora;
- qualquer documentação de outras frentes;
- qualquer texto que contradiga o contrato de Plano de contas.

### Dependências anteriores

- commits 1 a 6 ou a parte equivalente já definida.

### Testes que devem acompanhar

- nenhum teste novo obrigatório.

### Documentos correspondentes

- todos os listados acima.

### Comandos futuros de stage

- `git add -- docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`
- `git add -- docs/contrato_exclusao_migracao_plano_de_contas.md`
- `git add -- docs/contrato_funcional_plano_de_contas.md`
- `git add -- docs/roadmap_plano_de_contas_frontend_react.md`
- `git add -- docs/matriz_commits_seletivos_plano_de_contas.md`
- `git add -- docs/roteiro_operacional_stage_plano_de_contas.md`

### Comandos futuros de inspeção

- `git diff -- docs/contrato_funcional_plano_de_contas.md`
- `git diff -- docs/roadmap_plano_de_contas_frontend_react.md`

### Testes futuros

- não aplicável

### Build futuro

- não aplicável

### Riscos

- consolidar documentação demais pode misturar contratos de frentes diferentes;
- `docs/11_roadmap_desenvolvimento.md` não deve ser puxado por conveniência.

### Mensagem sugerida de commit

- `docs(plano-contas): consolidacao documental`

## Arquivos untracked que precisam de stage por caminho

Estes arquivos podem entrar por `git add -- caminho` sem `-p` se forem mantidos no commit correspondente:

- `frontend-react/tests/planoContasRouting.test.js`
- `frontend-react/tests/planoContasToolbar.test.js`
- `frontend-react/tests/planoContasMappers.test.js`
- `frontend-react/tests/planoContasGrupoForm.test.js`
- `frontend-react/tests/planoContasCategoryForm.test.js`
- `frontend-react/tests/planoContasCategoryRouting.test.js`
- `frontend-react/tests/planoContasDeletionSelection.test.js`
- `frontend-react/tests/planoContasPageDelete.test.js`
- `frontend-react/tests/planoContasCategoryMigrationModal.test.js`
- `frontend-react/tests/planoContasCategoryMigrationFlow.test.js`
- `backend/tests/test_cadastros_grupos.py`
- `backend/tests/test_cadastros_categorias.py`

## Arquivos que exigem `git add -p`

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`
- `frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `frontend-react/src/styles/globals.css`

## Quando usar `s`

Use `s` quando o hunk vier com:

- import e handler misturados;
- action shell e CRUD misturados;
- delete simples e migração no mesmo bloco;
- render da página e callbacks futuros no mesmo bloco;
- regras globais do shell junto de outras regras visuais.

## Quando usar `e`

Use `e` quando:

- o hunk contiver linhas inseparáveis e uma única seleção ainda traga código de outra frente;
- for preciso manter só a importação ou só o handler sem trazer o bloco inteiro;
- `s` não separar suficientemente `App.jsx`, `PlanoContasPage.jsx` ou `usePlanoContas.js`.

## Quando recusar

Recusar deve ser a escolha padrão para:

- `docs/11_roadmap_desenvolvimento.md`;
- qualquer hunk de Medicamentos, Procedimentos, CID, Auth, Preferências ou outras frentes;
- qualquer bloco de delete/migração antes dos commits 4 e 5;
- qualquer regra visual global além da banda auxiliar mínima.

## Inspeção futura recomendada

Antes de executar qualquer stage futuro:

1. confirmar diff do arquivo alvo;
2. confirmar que o hunk não carrega outra frente;
3. confirmar que os imports necessários já existem ou virão junto;
4. confirmar que o commit anterior não ficou pendente;
5. confirmar que os testes correspondentes já foram executados.

## Conclusão

- Esta lista já é executável como plano de `git add -- caminho` e `git add -p` futuro, mas ainda não deve ser aplicada agora.
- `App.jsx`, `PlanoContasPage.jsx`, `PlanoContasToolbar.jsx`, `usePlanoContas.js` e `globals.css` continuam sendo os pontos críticos de corte.
- Os arquivos de API, seleção, depreciação lógica de exclusão e os testes de base são os melhores candidatos para stage integral.
- Nenhum índice Git foi modificado.
