# Plano final de execução - stage seletivo do Plano de contas

Data de referência: 2026-07-15

Este documento converte a lista prática de stage seletivo em uma ordem operacional final de execução, commit por commit.

Base de leitura:

- [`docs/lista_pratica_stage_seletivo_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/lista_pratica_stage_seletivo_plano_de_contas.md)
- [`docs/matriz_commits_seletivos_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_commits_seletivos_plano_de_contas.md)
- [`docs/roteiro_operacional_stage_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roteiro_operacional_stage_plano_de_contas.md)
- [`docs/contrato_funcional_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [`docs/roadmap_plano_de_contas_frontend_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roadmap_plano_de_contas_frontend_react.md)
- [`docs/contrato_exclusao_migracao_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_exclusao_migracao_plano_de_contas.md)
- [`docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md)
- [`docs/frontend_react_refino_visual_shell_operacional.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/frontend_react_refino_visual_shell_operacional.md)

Documentos inexistentes já confirmados e fora da dependência:

- `docs/auditoria_seletiva_final_diff_plano_de_contas.md`
- `docs/auditoria_seletiva_diff_plano_de_contas.md`

## Estado técnico já validado

- Frontend: 122 testes passando.
- Backend: 30 testes passando.
- Build frontend: sucesso.
- Warning de chunk grande do Vite: conhecido.
- Nenhum stage, commit ou push foi realizado.

## Comparação com o estado anterior

Não houve alteração de código desde a última validação. Os arquivos novos adicionados nas etapas anteriores são apenas documentação. Portanto:

- não é necessário repetir testes ou build para esta etapa documental;
- o plano abaixo pode ser executado futuramente sem nova decisão de escopo;
- a execução ainda depende de corte por hunk nos arquivos mistos já conhecidos.

## Regra de parada geral

Interromper e não criar o commit se ocorrer qualquer um dos itens abaixo:

- import inexistente;
- componente não montado;
- callback ausente;
- prop obrigatória ausente;
- teste referente a código ainda não incluído;
- documentação afirmando funcionalidade futura como se já estivesse entregue;
- build quebrado;
- hunk misturando duas frentes inseparáveis sem divisão segura;
- seleção puxando código de Medicamentos, Procedimentos, CID, Auth, Preferências ou outra frente externa.

## Commit 1 — Fundação e integração inicial do Plano de contas

### Objetivo

Conectar a base do módulo para abrir a rota, visualizar grupos e categorias, selecionar linhas e compilar sem trazer exclusão ou migração.

### Dependência anterior

Nenhum commit funcional anterior deste módulo é obrigatório, desde que a base já existente do branch permaneça intacta.

### Estado funcional esperado após o commit

- rota `'/app/configuracoes/plano-de-contas'` abre;
- grupos são listados;
- categorias do grupo selecionado são listadas;
- seleção de grupo e categoria funciona;
- toolbar inicial aparece;
- build passa;
- nenhum fluxo de criação, alteração, exclusão ou migração é exposto ainda.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | 1 | infraestrutura de seleção base | `planoContasMappers.js` | `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` |
| `frontend-react/src/features/planoContas/planoContasApi.js` | 1 | camada de API coesa por endpoint | backend de cadastros | `git add -- frontend-react/src/features/planoContas/planoContasApi.js` |
| `frontend-react/src/features/planoContas/planoContasMappers.js` | 1 | normalização do domínio | API e seleção | `git add -- frontend-react/src/features/planoContas/planoContasMappers.js` |
| `frontend-react/src/features/planoContas/planoContasValidators.js` | 1 | validação base de grupo | page e API | `git add -- frontend-react/src/features/planoContas/planoContasValidators.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx` | 1 | tabela de grupos coesa | seleção e API | `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` | 1 | tabela de categorias coesa para leitura e seleção | seleção e API | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` |
| `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | 1 | toolbar inicial sem ações destrutivas | `App.jsx` e page | `git add -- frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` |
| `frontend-react/tests/planoContasRouting.test.js` | 1 | valida a rota do módulo | `App.jsx` | `git add -- frontend-react/tests/planoContasRouting.test.js` |
| `frontend-react/tests/planoContasToolbar.test.js` | 1 | valida estados iniciais da toolbar | `App.jsx` e toolbar | `git add -- frontend-react/tests/planoContasToolbar.test.js` |
| `frontend-react/tests/planoContasMappers.test.js` | 1 | cobre normalização base | mappers | `git add -- frontend-react/tests/planoContasMappers.test.js` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/app/App.jsx` | import `PlanoContasPage` / `PlanoContasToolbar` | Fundação | incluir hunk inteiro | 1 | imports de outras frentes | baixo |
| 2 | `frontend-react/src/app/App.jsx` | item de menu `plano-contas` | Fundação | incluir hunk inteiro | 1 | outros menus | baixo |
| 3 | `frontend-react/src/app/App.jsx` | rota `'/app/configuracoes/plano-de-contas'` | Fundação | incluir hunk inteiro | 1 | outras rotas | baixo |
| 4 | `frontend-react/src/app/App.jsx` | render de `PlanoContasPage` | Fundação | incluir hunk inteiro | 1 | outros screens | médio |
| 5 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | estrutura base da página | Fundação | incluir hunk inteiro | 1 | delete e migração | médio |
| 6 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | leitura inicial e carregamento | Fundação | incluir hunk inteiro | 1 | callbacks destrutivos | médio |
| 7 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | seleção inicial | Fundação | incluir hunk inteiro | 1 | helpers posteriores de migração | médio |

### Hunks a recusar expressamente

- qualquer trecho de `Novo grupo`, `Alterar grupo`, `Nova categoria`, `Alterar categoria`, `Eliminar`, `canDelete`, `deleting`, `migrating` ou `migrationModalOpen`;
- qualquer trecho de confirmação simples de exclusão;
- qualquer trecho de `409` ou modal de migração;
- qualquer trecho de shell global;
- qualquer código de outras frentes.

### Arquivos proibidos neste commit

- `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`;
- `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` se o modal já trouxer ações futuras;
- `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx`;
- `backend/tests/test_cadastros_categorias.py`;
- `backend/tests/test_cadastros_grupos.py` se estiver misturado com outra frente.

### Inspeção do índice

Comandos futuros:

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- `App.jsx` trouxe handlers de delete ou migração;
- `PlanoContasPage.jsx` trouxe modal de migração;
- a toolbar já espera `canDelete` sem o estado correspondente;
- algum teste de exclusão ou migração entrou antes da funcionalidade;
- a inspeção do índice mostra arquivo de outra frente;
- build mostra import ausente.

### Testes específicos

- `node --test tests\\planoContasRouting.test.js`
- `node --test tests\\planoContasToolbar.test.js`
- `node --test tests\\planoContasMappers.test.js`

### Testes de regressão

- `node --test tests\\*.test.js`
- `python -m unittest backend.tests.test_auth_renew backend.tests.test_procedimentos_financeiro`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- o módulo abre;
- o shell mantém a integração mínima;
- não há quebra de import;
- o build continua verde.

### Mensagem sugerida de commit

- `feat(plano-contas): fundacao e integracao inicial`

## Commit 2 — CRUD de grupos

### Objetivo

Implementar criação e alteração de grupos sem antecipar categoria destrutiva.

### Dependência anterior

Commit 1 concluído ou equivalente.

### Estado funcional esperado após o commit

- `Novo grupo` funciona;
- `Alterar grupo` funciona;
- refresh após salvar funciona;
- seleção é preservada;
- nenhum fluxo de categoria destrutiva aparece ainda.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx` | 2 | modal coeso de grupo | `usePlanoContas.js` | `git add -- frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx` |
| `frontend-react/tests/planoContasGrupoForm.test.js` | 2 | cobre formulário de grupo | modal e hook | `git add -- frontend-react/tests/planoContasGrupoForm.test.js` |
| `backend/tests/test_cadastros_grupos.py` | 2 | regressão backend de grupos | backend isolado | `git add -- backend/tests/test_cadastros_grupos.py` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleSaveGroup` | CRUD grupos | incluir hunk inteiro | 2 | delete/migration no mesmo bloco | médio |
| 2 | `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | `updatePlanoContasSelectionAfterGroupSave` | CRUD grupos | incluir hunk inteiro | 2 | lógica de destino de migração | médio |
| 3 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de grupo | CRUD grupos | incluir hunk inteiro | 2 | delete e migração | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | `Novo grupo` / `Alterar grupo` | CRUD grupos | incluir hunk inteiro | 2 | props de categoria e delete | médio |
| 5 | `frontend-react/src/app/App.jsx` | ações `novo-grupo` / `alterar-grupo` | CRUD grupos | dividir com `s` | 2 | ações de categoria e delete | alto |

### Hunks a recusar expressamente

- qualquer trecho de `Eliminar`;
- qualquer trecho de categoria;
- qualquer trecho de migração;
- qualquer trecho de shell global;
- qualquer prop nova que ainda não seja usada por grupos.

### Arquivos proibidos neste commit

- `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`;
- `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` se estiver trazendo categoria;
- `backend/tests/test_cadastros_categorias.py`.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- a toolbar ficou esperando uma prop de categoria destrutiva;
- `App.jsx` trouxe outra frente;
- o modal de grupo depende de handler não stageado;
- houve seleção de teste de categoria antes da hora.

### Testes específicos

- `node --test tests\\planoContasGrupoForm.test.js`
- `python -m unittest backend.tests.test_cadastros_grupos`

### Testes de regressão

- `node --test tests\\*.test.js`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- grupo cria e altera;
- refresh funciona;
- nenhuma funcionalidade de categoria foi antecipada.

### Mensagem sugerida de commit

- `feat(plano-contas): crud de grupos`

## Commit 3 — CRUD de categorias

### Objetivo

Implementar criação e alteração de categorias, ainda sem exclusão ou migração.

### Dependência anterior

Commit 1 e Commit 2 concluídos ou equivalentes.

### Estado funcional esperado após o commit

- `Nova categoria` funciona;
- `Alterar categoria` funciona;
- grupo pai e tributável são preservados;
- ainda não existe exclusão nem modal de migração.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` | 3 | modal coeso de categoria | `usePlanoContas.js` | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` |
| `frontend-react/src/features/planoContas/planoContasCategoryValidators.js` | 3 | validação de categoria | API e mappers | `git add -- frontend-react/src/features/planoContas/planoContasCategoryValidators.js` |
| `frontend-react/tests/planoContasCategoryForm.test.js` | 3 | cobre formulário de categoria | modal e hook | `git add -- frontend-react/tests/planoContasCategoryForm.test.js` |
| `frontend-react/tests/planoContasCategoryRouting.test.js` | 3 | navegação categoria | `App.jsx` | `git add -- frontend-react/tests/planoContasCategoryRouting.test.js` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleSaveCategory` | CRUD categorias | incluir hunk inteiro | 3 | delete/migration no mesmo bloco | médio |
| 2 | `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js` | `selectPlanoContasCategory` | CRUD categorias | incluir hunk inteiro | 3 | seleção de destino de migração | médio |
| 3 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de categoria | CRUD categorias | incluir hunk inteiro | 3 | delete e migração | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | `Nova categoria` / `Alterar categoria` | CRUD categorias | incluir hunk inteiro | 3 | botão Eliminar | médio |
| 5 | `frontend-react/src/app/App.jsx` | ações `nova-categoria` / `alterar-categoria` | CRUD categorias | dividir com `s` | 3 | delete e migração | alto |

### Hunks a recusar expressamente

- qualquer bloco de exclusão;
- qualquer bloco de `409`;
- qualquer bloco de modal de migração;
- qualquer prop destrutiva antecipada;
- qualquer trecho de shell global.

### Arquivos proibidos neste commit

- `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`;
- `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`;
- `backend/tests/test_cadastros_categorias.py` se ainda estiver misturado com delete.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- a toolbar já esperava `canDelete` sem a exclusão existir;
- o hunk do `App.jsx` trouxe delete ou migração;
- `PlanoContasPage.jsx` trouxe o fluxo destrutivo junto;
- o teste de categoria ficou apontando para código ainda não stageado.

### Testes específicos

- `node --test tests\\planoContasCategoryForm.test.js`
- `node --test tests\\planoContasCategoryRouting.test.js`

### Testes de regressão

- `node --test tests\\*.test.js`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- categoria cria e altera;
- grupo pai e tributável seguem válidos;
- sem exclusão e sem modal de migração.

### Mensagem sugerida de commit

- `feat(plano-contas): crud de categorias`

## Commit 4 — Exclusão simples de categoria

### Objetivo

Entregar a exclusão simples sem abrir o fluxo de migração.

### Dependência anterior

Commit 1, Commit 2 e Commit 3 concluídos ou equivalentes.

### Estado funcional esperado após o commit

- categoria sem uso exclui;
- grupo é preservado;
- categoria removida é limpa;
- categoria em uso gera tratamento seguro;
- nenhum modal de destino aparece;
- nenhuma chamada `migrar-e-excluir` é executada ainda.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` | 4 | helpers coesos de exclusão simples | API e seleção | `git add -- frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` |
| `frontend-react/tests/planoContasDeletionSelection.test.js` | 4 | seleção após excluir | seleção e página | `git add -- frontend-react/tests/planoContasDeletionSelection.test.js` |
| `frontend-react/tests/planoContasPageDelete.test.js` | 4 | delete na página | `PlanoContasPage.jsx` | `git add -- frontend-react/tests/planoContasPageDelete.test.js` |
| `backend/tests/test_cadastros_categorias.py` | 4 | cobre delete simples e 409 | backend isolado | `git add -- backend/tests/test_cadastros_categorias.py` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleDeleteCategory` sem migração | exclusão simples | dividir com `s` | 4 | helpers de migração do commit 5 | alto |
| 2 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | confirmação simples de exclusão | exclusão simples | dividir com `s` | 4 | tratamento do `409` e modal de migração | alto |
| 3 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | prop `onDeleteCategory` / botão `Eliminar` | exclusão simples | incluir hunk inteiro | 4 | props de migração se aparecerem | médio |
| 4 | `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` | ação da linha de exclusão | exclusão simples | incluir hunk inteiro | 4 | modal de migração | médio |
| 5 | `frontend-react/src/app/App.jsx` | ação `eliminar-categoria` básica | exclusão simples | dividir com `s` | 4 | migração futura e outras telas | alto |

### Hunks a recusar expressamente

- qualquer bloco que já abra modal de migração;
- qualquer bloco com `migrating` ou `migrationModalOpen`;
- qualquer bloco que já chame `migrar-e-excluir`;
- qualquer bloco de shell global;
- qualquer bloco de outras frentes.

### Arquivos proibidos neste commit

- `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`;
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx` se trouxer migração;
- `docs/frontend_react_refino_visual_shell_operacional.md`;
- `frontend-react/src/styles/globals.css` além da banda auxiliar futura.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- o hunk de `usePlanoContas.js` já trouxe migração;
- `PlanoContasPage.jsx` abriu modal de destino;
- o botão Eliminar ficou dependente de prop ainda não stageada;
- o teste de exclusão passou a depender do modal de migração;
- o build passou a acusar import ausente.

### Testes específicos

- `node --test tests\\planoContasDeletionSelection.test.js`
- `node --test tests\\planoContasPageDelete.test.js`
- `python -m unittest backend.tests.test_cadastros_categorias`

### Testes de regressão

- `node --test tests\\*.test.js`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- categoria sem uso exclui;
- categoria em uso não salta para migração ainda;
- a UI continua íntegra;
- nenhum fluxo de destino foi antecipado.

### Mensagem sugerida de commit

- `feat(plano-contas): exclusao simples de categoria`

## Commit 5 — Migração e exclusão de categoria em uso

### Objetivo

Fechar o tratamento completo do `409` com migração e exclusão transacional.

### Dependência anterior

Commit 4 concluído ou equivalente.

### Estado funcional esperado após o commit

- categoria em uso abre modal de migração;
- destinos elegíveis são filtrados;
- primeira opção é pré-selecionada;
- operação usa `migrar-e-excluir`;
- reconciliação por ID acontece;
- exclusão simples continua preservada;
- nenhum fluxo de grupo é alterado.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js` | 5 | estado e reconciliação da migração | API e seleção | `git add -- frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js` |
| `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx` | 5 | modal coeso de migração | hook de migração | `git add -- frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx` |
| `frontend-react/tests/planoContasCategoryMigrationModal.test.js` | 5 | cobre modal de migração | modal e hook | `git add -- frontend-react/tests/planoContasCategoryMigrationModal.test.js` |
| `frontend-react/tests/planoContasCategoryMigrationFlow.test.js` | 5 | cobre fluxo completo | API, modal e página | `git add -- frontend-react/tests/planoContasCategoryMigrationFlow.test.js` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/features/planoContas/planoContasApi.js` | `migrarEExcluirPlanoContasCategoria` | migração | incluir hunk inteiro | 5 | nada do commit 4 | baixo |
| 2 | `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js` | payload / filtro / classificação de erro de migração | migração | incluir hunk inteiro | 5 | comportamento de delete simples se ainda estiver misturado | baixo |
| 3 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleDeleteCategory` com `409` | migração | dividir com `s` | 5 | delete simples já fechado no commit 4 | alto |
| 4 | `frontend-react/src/features/planoContas/hooks/usePlanoContas.js` | `handleConfirmCategoryMigration` | migração | dividir com `s` | 5 | outras ações de formulário | alto |
| 5 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | tratamento do `409` | migração | dividir com `s` | 5 | blocos de grupo e delete simples | alto |
| 6 | `frontend-react/src/features/planoContas/PlanoContasPage.jsx` | abertura do modal de migração | migração | dividir com `s` | 5 | outros callbacks não relacionados | alto |
| 7 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | `migrating` / `migrationModalOpen` / `canDelete` | migração | dividir com `s` | 5 | props de grupo/categoria sem relação | alto |
| 8 | `frontend-react/src/app/App.jsx` | `migrating` / `migrationModalOpen` / ação `eliminar-categoria` avançada | migração | dividir com `s` | 5 | outras telas e frentes externas | alto |

### Hunks a recusar expressamente

- qualquer bloco que ainda trate exclusão simples como se fosse o fluxo final;
- qualquer bloco de shell global;
- qualquer bloco de outras frentes;
- qualquer tentativa de misturar grupo com categoria;
- qualquer trecho que introduza nova regra de destino sem contrato.

### Arquivos proibidos neste commit

- `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx`;
- `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx`;
- `backend/tests/test_cadastros_grupos.py`;
- qualquer documento de shell global;
- `docs/11_roadmap_desenvolvimento.md`.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- o modal de migração permitiu destino inválido;
- o hunk de `usePlanoContas.js` carregou delete e migração inseparáveis sem corte seguro;
- `App.jsx` misturou outras frentes;
- o backend não tiver cenário de rollback na suíte correspondente.

### Testes específicos

- `node --test tests\\planoContasCategoryMigrationModal.test.js`
- `node --test tests\\planoContasCategoryMigrationFlow.test.js`
- `python -m unittest backend.tests.test_cadastros_categorias`

### Testes de regressão

- `node --test tests\\*.test.js`
- `python -m unittest backend.tests.test_auth_renew backend.tests.test_procedimentos_financeiro`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- fluxo de categoria em uso completo;
- exclusão simples preservada;
- nenhuma exclusão de grupo.

### Mensagem sugerida de commit

- `feat(plano-contas): migracao e exclusao de categoria em uso`

## Commit 6 — Correção global da banda auxiliar do shell

### Objetivo

Corrigir a emenda visual do shell sem misturar com CRUD.

### Dependência anterior

Independente dos commits do Plano de contas, mas deve ser mantido separado.

### Estado funcional esperado após o commit

- a banda auxiliar não exibe o divisor inferior interno;
- a correção vale para os módulos afetados pelo shell global;
- nenhum fluxo de Plano de contas é alterado por esta correção.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `docs/frontend_react_refino_visual_shell_operacional.md` | 6 | documentação da correção global | shell visual | `git add -- docs/frontend_react_refino_visual_shell_operacional.md` |

### Arquivos por hunk, na ordem

| Ordem | Arquivo | Símbolo ou bloco | Frente | Ação futura | Commit | Recusar o quê | Risco |
|---:|---|---|---|---|---|---|---|
| 1 | `frontend-react/src/styles/globals.css` | `.auxiliary-shell-band { box-shadow: none; }` | shell global | incluir hunk inteiro se isolado | 6 | qualquer outra regra visual global | alto |
| 2 | `frontend-react/src/app/App.jsx` | estado publicado para o shell, se houver acoplamento | shell global | combinar com outro commit | 6 | CRUD de Plano de contas | alto |
| 3 | `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` | props ligadas ao estado global do shell | shell global | combinar com outro commit | 6 | props destrutivas e CRUD | alto |

### Hunks a recusar expressamente

- qualquer regra de estilo que não seja a banda auxiliar mínima;
- qualquer bloco do Plano de contas que antecipe CRUD;
- qualquer bloco de outras frentes.

### Arquivos proibidos neste commit

- qualquer arquivo de Plano de contas além da integração shell necessária;
- qualquer backend;
- qualquer teste de CRUD de categorias ou grupos.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- o hunk de `globals.css` veio colado a outras regras visuais;
- a correção global puxou outro módulo;
- o teste de regressão da banda auxiliar não bateu com o hunk selecionado;
- qualquer sinal de que a alteração visual voltou a tocar no CRUD.

### Testes específicos

- `node --test tests\\auxiliaryShellBandContract.test.js`

### Testes de regressão

- `node --test tests\\*.test.js`

### Build

- `cmd /c npm.cmd run build`

### Resultado esperado

- a linha divisória inferior da banda auxiliar desaparece;
- o shell permanece coerente;
- nada do Plano de contas é antecipado.

### Mensagem sugerida de commit

- `fix(shell): remover divisor inferior da banda auxiliar`

## Commit 7 — Consolidação documental, somente se realmente necessária

### Objetivo

Consolidar somente a documentação que ainda ficar pendente após os commits funcionais.

### Dependência anterior

Somente se os commits 1 a 6 já tiverem sido preparados e houver documentação realmente pendente.

### Estado funcional esperado após o commit

- documentação final alinhada ao que foi implementado;
- nenhuma informação de futuro é apresentada como concluída;
- não há alteração funcional de código.

### Arquivos integrais, na ordem

| Arquivo | Commit | Motivo | Dependências | Comando futuro |
|---|---|---|---|---|
| `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md` | 7 | checklist de implementação | contratos e validações | `git add -- docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md` |
| `docs/contrato_exclusao_migracao_plano_de_contas.md` | 7 | contrato funcional de exclusão/migração | validações e runtime | `git add -- docs/contrato_exclusao_migracao_plano_de_contas.md` |
| `docs/contrato_funcional_plano_de_contas.md` | 7 | contrato funcional base | frontend e backend | `git add -- docs/contrato_funcional_plano_de_contas.md` |
| `docs/roadmap_plano_de_contas_frontend_react.md` | 7 | roadmap do módulo | sequência funcional | `git add -- docs/roadmap_plano_de_contas_frontend_react.md` |
| `docs/matriz_commits_seletivos_plano_de_contas.md` | 7 | matriz seletiva validada | roteiros anteriores | `git add -- docs/matriz_commits_seletivos_plano_de_contas.md` |
| `docs/roteiro_operacional_stage_plano_de_contas.md` | 7 | roteiro operacional validado | matriz anterior | `git add -- docs/roteiro_operacional_stage_plano_de_contas.md` |
| `docs/lista_pratica_stage_seletivo_plano_de_contas.md` | 7 | lista prática validada | roteiros anteriores | `git add -- docs/lista_pratica_stage_seletivo_plano_de_contas.md` |

### Arquivos por hunk, na ordem

- nenhum obrigatório, se este commit for apenas consolidação documental.

### Hunks a recusar expressamente

- `docs/11_roadmap_desenvolvimento.md`;
- qualquer documentação de outras frentes;
- qualquer texto que contradiga o contrato de Plano de contas;
- qualquer documento que reabra auditoria funcional.

### Arquivos proibidos neste commit

- código de frontend;
- código de backend;
- testes novos;
- shell global.

### Inspeção do índice

```bash
git status --short
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached
```

### Critérios para interromper

- a documentação passou a afirmar algo que ainda não foi validado;
- `docs/11_roadmap_desenvolvimento.md` entrou por conveniência;
- qualquer arquivo funcional foi puxado junto.

### Testes específicos

- não aplicável

### Testes de regressão

- não aplicável

### Build

- não aplicável

### Resultado esperado

- documentação fechada e coerente;
- sem mudança funcional;
- sem stage de código.

### Mensagem sugerida de commit

- `docs(plano-contas): consolidacao documental`

## Combinação mínima necessária

Após a inspeção real dos hunks, a separação em sete commits continua tecnicamente viável. Não há evidência suficiente para combinar commits neste momento. O único cuidado é:

- se `App.jsx`, `PlanoContasPage.jsx` ou `usePlanoContas.js` vierem com blocos inseparáveis de exclusão e migração, usar `s` ou `e` antes de recuar para um commit combinado;
- se `globals.css` vier colado a outras regras, manter a correção da banda auxiliar isolada ou adiar a seleção daquele hunk;
- se a documentação final não tiver pendência real, omitir o Commit 7.

## Ordem executável resumida

1. stagear a fundação;
2. validar índice e build;
3. stagear grupos;
4. validar índice e build;
5. stagear categorias;
6. validar índice e build;
7. stagear exclusão simples;
8. validar índice e build;
9. stagear migração;
10. validar índice e build;
11. stagear shell global;
12. validar índice e build;
13. stagear documentação apenas se ainda necessária;
14. validar índice final.

## Resposta final

Esse plano permite executar os commits sem decidir no momento do stage:

- qual arquivo vem primeiro;
- qual comando usar;
- qual hunk aceitar;
- qual hunk rejeitar;
- quando dividir;
- quando editar patch;
- quais testes executar;
- quando abortar;
- qual mensagem de commit usar.

Nenhum índice Git foi modificado nesta etapa.
