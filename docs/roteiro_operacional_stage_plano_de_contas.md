# Roteiro operacional seguro de stage - Plano de contas

Data de referência: 2026-07-15

Este documento valida a matriz de commits seletivos já criada e a converte em um roteiro operacional seguro de seleção por arquivo e por hunk.

Regras desta etapa:

- não fazer `git add`;
- não fazer `git add -p`;
- não fazer commit;
- não fazer push;
- não alterar código nesta etapa;
- não limpar o worktree.

## Estado inicial confirmado

- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- O worktree continua muito sujo por alterações preexistentes e misturas de várias frentes.

### Comandos de estado executados

- `git status --short --branch`
- `git diff --name-status`
- `git diff --stat`
- `git ls-files --others --exclude-standard`

## Validações técnicas executadas

- Suíte frontend React: `node --test tests\\*.test.js`
- Testes backend:
  - `backend.tests.test_cadastros_categorias`
  - `backend.tests.test_cadastros_grupos`
  - `backend.tests.test_auth_renew`
  - `backend.tests.test_procedimentos_financeiro`
- Build frontend React: `npm.cmd run build`

### Resultado

- Frontend: 122 testes passando.
- Backend: 30 testes passando.
- Build: concluído com sucesso.
- Risco residual do build: aviso de chunk grande acima de 500 kB.

## Revisão crítica da matriz anterior

Documento analisado: [`docs/matriz_commits_seletivos_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_commits_seletivos_plano_de_contas.md)

### O que a matriz já cobre bem

- separa Plano de contas, shell global, documentação e regressões externas;
- distingue arquivos que podem entrar inteiros de arquivos parciais;
- propõe uma sequência de commits por frente funcional;
- reconhece `App.jsx`, `PlanoContasPage.jsx`, `PlanoContasToolbar.jsx` e `globals.css` como arquivos mistos.

### Lacunas encontradas

- a matriz não registrava explicitamente o status rastreado/untracked por arquivo;
- a matriz não listava risco, arquivos relacionados, testes relacionados e documentação relacionada em cada linha;
- a matriz não dizia de forma explícita quais documentos obrigatórios estavam ausentes;
- a matriz tratava alguns commits como mais autocontidos do que a análise real permite.

### Arquivos/documents ausentes para reabertura

- `docs/auditoria_seletiva_final_diff_plano_de_contas.md` não existe no repositório.
- `docs/auditoria_seletiva_diff_plano_de_contas.md` não existe no repositório.

Conclusão:

- a matriz é útil como guia;
- não é suficiente para decidir stage sem corte por hunk nos arquivos mistos.

## Validação dos commits propostos

### Commit 1 - Fundação do módulo

Objetivo:

- deixar o módulo de Plano de contas navegável e operacional como base.

Arquivos integrais:

- `frontend-react/src/features/planoContas/hooks/usePlanoContas.js`
- `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`
- `frontend-react/src/features/planoContas/planoContasApi.js`
- `frontend-react/src/features/planoContas/planoContasMappers.js`
- `frontend-react/src/features/planoContas/planoContasValidators.js`

Arquivos por hunk:

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`

Dependências:

- `App.jsx` importa a página e a toolbar do módulo.
- `usePlanoContas.js` depende de API, mappers, validators e seleção.
- `PlanoContasPage.jsx` depende dos hooks e dos modais do módulo.

Testes correspondentes:

- `frontend-react/tests/planoContasRouting.test.js`
- `frontend-react/tests/planoContasToolbar.test.js`
- `frontend-react/tests/planoContasPageDelete.test.js` quando a exclusão base estiver acoplada ao estado inicial do módulo

Documentos correspondentes:

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

Build isolado:

- possível, mas só se os hunks de `App.jsx` e `PlanoContasPage.jsx` preservarem os imports usados pelo shell.

Riscos:

- código posterior pode entrar antes da hora se o hunk de `App.jsx` trouxer integração de exclusão/migração;
- commit intermediário quebrado se a toolbar for incluída sem o estado que a alimenta.

### Commit 2 - CRUD de grupos

Objetivo:

- consolidar criação e edição de grupos.

Arquivos integrais:

- `frontend-react/src/features/planoContas/components/PlanoContasGroupModal.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasGroupsTable.jsx`

Arquivos por hunk:

- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/app/App.jsx` apenas se houver integração de evento ou rota afetada

Dependências:

- usa `usePlanoContas.js`
- usa `planoContasApi.js`
- usa `usePlanoContasSelection.js`

Testes correspondentes:

- `backend/tests/test_cadastros_grupos.py`
- `frontend-react/tests/planoContasGrupoForm.test.js`

Documentos correspondentes:

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

Build isolado:

- viável, desde que o page shell continue renderizando as tabelas e o modal sem dependência de categorias destrutivas.

Riscos:

- o hunk de página pode misturar grupo, categoria e toolbar;
- `git add -p` é útil, mas pode não separar modal, handlers e estado se estiverem no mesmo bloco.

### Commit 3 - CRUD de categorias

Objetivo:

- consolidar criação e edição de categorias sem a parte destrutiva.

Arquivos integrais:

- `frontend-react/src/features/planoContas/components/PlanoContasCategoryModal.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx`
- `frontend-react/src/features/planoContas/planoContasCategoryValidators.js`

Arquivos por hunk:

- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/app/App.jsx` se a rota ou o handler de toolbar estiverem no mesmo trecho

Dependências:

- `usePlanoContas.js`
- `planoContasApi.js`
- `planoContasMappers.js`

Testes correspondentes:

- `frontend-react/tests/planoContasCategoryForm.test.js`
- `frontend-react/tests/planoContasCategoryRouting.test.js`

Documentos correspondentes:

- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

Build isolado:

- viável se as dependências de grupo já estiverem presentes e o estado da página continuar íntegro.

Riscos:

- selecionar categoria sem a seleção de grupo pode quebrar o comportamento da página;
- `git add -p` pode ser suficiente apenas se o arquivo não estiver misturando handlers de delete.

### Commit 4 - Exclusão simples

Objetivo:

- fechar a exclusão simples de categoria, sem migração.

Arquivos integrais:

- `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`
- `frontend-react/tests/planoContasDeletionSelection.test.js`
- `frontend-react/tests/planoContasPageDelete.test.js`

Arquivos por hunk:

- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasCategoriesTable.jsx` se o botão estiver embutido na linha
- `frontend-react/src/app/App.jsx` somente se o handler global for o mesmo bloco

Dependências:

- `planoContasApi.js`
- `usePlanoContasSelection.js`
- backend de categorias

Testes correspondentes:

- `backend/tests/test_cadastros_categorias.py`
- `frontend-react/tests/planoContasDeletionSelection.test.js`
- `frontend-react/tests/planoContasPageDelete.test.js`

Documentos correspondentes:

- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`

Build isolado:

- possível, mas exige que a página continue compilando com o estado de delete e sem modal de migração.

Riscos:

- se `PlanoContasPage.jsx` levar delete e migração no mesmo bloco, `git add -p` pode não ser suficiente;
- melhor alternativa: patch temporário ou commit consolidado maior apenas para o bloco destrutivo, se o hunk vier inseparável.

### Commit 5 - Migração de categoria

Objetivo:

- tratar o `409` com migração e exclusão atômica.

Arquivos integrais:

- `frontend-react/src/features/planoContas/hooks/usePlanoContasCategoryMigration.js`
- `frontend-react/src/features/planoContas/components/PlanoContasCategoryMigrationModal.jsx`
- `frontend-react/tests/planoContasCategoryMigrationModal.test.js`
- `frontend-react/tests/planoContasCategoryMigrationFlow.test.js`

Arquivos por hunk:

- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` se o estado de migrar estiver acoplado

Dependências:

- `planoContasApi.js`
- `planoContasCategoryDeletion.js`
- backend de categorias

Testes correspondentes:

- `backend/tests/test_cadastros_categorias.py`
- `frontend-react/tests/planoContasCategoryMigrationModal.test.js`
- `frontend-react/tests/planoContasCategoryMigrationFlow.test.js`

Documentos correspondentes:

- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`

Build isolado:

- viável se a API e a página já tiverem o fluxo de delete simples estável.

Riscos:

- o modal de migração depende de seleção correta de destino e de reconciliação por ID;
- `git add -p` pode precisar de `s` para dividir blocos do handler de exclusão em `PlanoContasPage.jsx`.

### Commit 6 - Shell global

Objetivo:

- manter a correção visual global fora do CRUD.

Arquivos integrais:

- `docs/frontend_react_refino_visual_shell_operacional.md`

Arquivos por hunk:

- `frontend-react/src/styles/globals.css`
- `frontend-react/src/app/App.jsx` se a banda auxiliar estiver publicada junto de outros estados
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx` se o estado do shell estiver acoplado à toolbar

Dependências:

- shell visual operacional;
- `App.jsx` publica e consome o estado do toolbar do shell.

Testes correspondentes:

- `frontend-react/tests/auxiliaryShellBandContract.test.js`
- `frontend-react/tests/planoContasToolbar.test.js` apenas na parte que verifica publicação/consumo do estado global

Documentos correspondentes:

- `docs/frontend_react_refino_visual_shell_operacional.md`

Build isolado:

- viável, mas não deve ser misturado com fluxo de delete, migração ou CRUD.

Riscos:

- `globals.css` é o arquivo mais sensível para seleção errada;
- se a correção estiver junto de outras regras do shell, `git add -p` pode ser insuficiente e exigir patch temporário.

### Commit 7 - Documentação

Objetivo:

- registrar contratos e checklist operacional.

Arquivos integrais:

- `docs/checklist_implementacao_exclusao_categoria_plano_de_contas.md`
- `docs/contrato_exclusao_migracao_plano_de_contas.md`
- `docs/contrato_funcional_plano_de_contas.md`
- `docs/roadmap_plano_de_contas_frontend_react.md`

Arquivos por hunk:

- nenhum obrigatório, se o objetivo for apenas consolidar documentação já alinhada.

Dependências:

- contrato funcional;
- contrato de exclusão/migração;
- validações executadas em runtime.

Testes correspondentes:

- não há teste funcional novo, apenas referência de fechamento.

Documentos correspondentes:

- os próprios documentos acima.

Build isolado:

- não aplicável diretamente.

Riscos:

- documentação que mistura frentes diferentes pode gerar contradição futura;
- `docs/11_roadmap_desenvolvimento.md` não deve entrar neste commit sem revisão separada.

## Roteiro operacional por arquivo e por hunk

### `frontend-react/src/app/App.jsx`

| Ordem | Hunk/símbolo | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | import `PlanoContasPage` / `PlanoContasToolbar` | Fundação | incluir hunk inteiro | 1 | feature carregada | baixo se os imports forem mantidos juntos |
| 2 | menu `plano-contas` | Fundação | incluir hunk inteiro | 1 | menu do shell | risco baixo |
| 3 | resolvedor de rota `/app/configuracoes/plano-de-contas` | Fundação | incluir hunk inteiro | 1 | navigation shell | risco baixo |
| 4 | render da página `screen === 'plano-contas'` | Fundação | incluir hunk inteiro | 1 | page component | risco médio se o bloco trouxer outros screens |
| 5 | listener `brana-plano-contas-toolbar-state` | shell/global | combinar com outro commit | 6 | toolbar publica estado | risco de acoplamento com outras frentes |
| 6 | handler `brana-plano-contas-toolbar-action` | shell/global | dividir com `s` | 1 ou 6 | toolbar actions | risco de incluir ações futuras cedo |
| 7 | ação `novo-grupo` | CRUD grupos | dividir com `s` | 2 | modal de grupo | risco médio |
| 8 | ação `alterar-grupo` | CRUD grupos | dividir com `s` | 2 | seleção de grupo | risco médio |
| 9 | ação `nova-categoria` | CRUD categorias | dividir com `s` | 3 | seleção de grupo | risco médio |
| 10 | ação `alterar-categoria` | CRUD categorias | dividir com `s` | 3 | seleção de categoria | risco médio |
| 11 | ação `eliminar-categoria` | exclusão simples/migração | revisar manualmente | 4 e 5 | delete e migration | risco alto de misturar frentes |
| 12 | banda auxiliar do shell | shell global | combinar com outro commit | 6 | globals.css | risco alto se entrar junto com CRUD |
| 13 | código externo de outras frentes | externo | não incluir | fora | outros módulos | risco alto |

### `frontend-react/src/features/planoContas/PlanoContasPage.jsx`

| Ordem | Bloco | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | imports dos modais/tabelas/hooks | Fundação | incluir hunk inteiro | 1 | módulos do Plano de contas | baixo |
| 2 | `usePlanoContas()` e destructuring | Fundação | incluir hunk inteiro | 1 | hook principal | médio |
| 3 | publicação de estado do toolbar | shell/global | combinar com outro commit | 6 | `App.jsx` | médio |
| 4 | listener `brana-plano-contas-toolbar-action` | shell/global | dividir com `s` | 1, 4 ou 5 | eventos globais | alto |
| 5 | painel de grupos | CRUD grupos | incluir hunk inteiro | 2 | `PlanoContasGroupsTable` | médio |
| 6 | painel de categorias | CRUD categorias | incluir hunk inteiro | 3 | `PlanoContasCategoriesTable` | médio |
| 7 | modal de grupo | CRUD grupos | incluir hunk inteiro | 2 | `PlanoContasGroupModal` | médio |
| 8 | modal de categoria | CRUD categorias | incluir hunk inteiro | 3 | `PlanoContasCategoryModal` | médio |
| 9 | bloco de exclusão simples | exclusão simples | dividir com `s` | 4 | `planoContasCategoryDeletion.js` | alto |
| 10 | bloco de migração | migração | dividir com `s` | 5 | hook/modal de migração | alto |
| 11 | código não relacionado | externo | não incluir | fora | outras frentes | alto |

### `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`

| Ordem | Bloco | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | render do toolbar | Fundação | incluir hunk inteiro | 1 | `App.jsx`/página | baixo |
| 2 | botões Novo grupo / Alterar grupo | CRUD grupos | incluir hunk inteiro | 2 | seleção de grupo | médio |
| 3 | botões Nova categoria / Alterar categoria | CRUD categorias | incluir hunk inteiro | 3 | seleção de categoria | médio |
| 4 | botão Eliminar | exclusão simples/migração | revisar manualmente | 4 e 5 | delete state | alto |
| 5 | estados disabled/loading | shell/global | combinar com outro commit | 6 | publicação de estado | médio |

### `frontend-react/src/features/planoContas/hooks/usePlanoContas.js`

| Ordem | Função/bloco | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | `usePlanoContas` - estado base | Fundação | incluir hunk inteiro | 1 | API, seleção, mappers | baixo |
| 2 | carregamento inicial / refresh | Fundação | incluir hunk inteiro | 1 | `listarPlanoContasGrupos` | baixo |
| 3 | `handleSaveGroup` | CRUD grupos | incluir hunk inteiro | 2 | validators e API | médio |
| 4 | `handleSaveCategory` | CRUD categorias | incluir hunk inteiro | 3 | validators e API | médio |
| 5 | `handleDeleteCategory` | exclusão simples | dividir com `s` | 4 | API, seleção, classificação de erro | alto |
| 6 | abertura do modal de migração | migração | dividir com `s` | 5 | classify error / migration state | alto |
| 7 | `handleConfirmCategoryMigration` | migração | dividir com `s` | 5 | endpoint migrar-e-excluir | alto |

### `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`

| Ordem | Função | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | `createPlanoContasSelectionState` | Fundação | incluir hunk inteiro | 1 | normalização de grupos | baixo |
| 2 | `selectPlanoContasGroup` | Fundação | incluir hunk inteiro | 1 | grupos normalizados | baixo |
| 3 | `selectPlanoContasCategory` | CRUD categorias | incluir hunk inteiro | 3 | grupo selecionado | médio |
| 4 | `updatePlanoContasSelectionAfterGroupSave` | CRUD grupos | incluir hunk inteiro | 2 | grupo salvo | médio |
| 5 | `updatePlanoContasSelectionAfterCategoryDelete` | exclusão simples | incluir hunk inteiro | 4 | grupo/categoria atual | médio |

### `frontend-react/src/features/planoContas/planoContasApi.js`

| Ordem | Função | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | `listarPlanoContasGrupos` | Fundação | incluir hunk inteiro | 1 | backend de listas | baixo |
| 2 | `criarPlanoContasGrupo` / `atualizarPlanoContasGrupo` | CRUD grupos | incluir hunk inteiro | 2 | sanitizer de grupo | baixo |
| 3 | `criarPlanoContasCategoria` / `atualizarPlanoContasCategoria` | CRUD categorias | incluir hunk inteiro | 3 | sanitizer de categoria | baixo |
| 4 | `excluirPlanoContasCategoria` | exclusão simples | incluir hunk inteiro | 4 | classificador de erro | baixo |
| 5 | `migrarEExcluirPlanoContasCategoria` | migração | incluir hunk inteiro | 5 | build payload de migração | baixo |

### `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`

| Ordem | Função | Frente | Ação futura | Commit | Dependência | Risco |
|---|---|---|---|---|---|---|
| 1 | `toPlanoContasPositiveInteger` | suporte | incluir hunk inteiro | 4 e 5 | validação numérica | baixo |
| 2 | `normalizePlanoContasCategoryDestinationList` | migração | incluir hunk inteiro | 5 | lista de categorias | baixo |
| 3 | `selectFirstPlanoContasCategoryDestination` | migração | incluir hunk inteiro | 5 | normalização da lista | baixo |
| 4 | `buildPlanoContasCategoryMigrationPayload` | migração | incluir hunk inteiro | 5 | destino selecionado | baixo |
| 5 | `normalizePlanoContasCategoryDeletionResult` | exclusão simples | incluir hunk inteiro | 4 | resposta backend | baixo |
| 6 | `classifyPlanoContasCategoryError` | exclusão/migração | incluir hunk inteiro | 4 e 5 | status HTTP | baixo |

## Arquivos de alto risco

### `frontend-react/src/app/App.jsx`

Resposta consolidada:

- pode ser staged integralmente apenas se a seleção ficar restrita aos trechos do Plano de contas e do shell publicados no mesmo fluxo;
- os hunks existentes misturam várias frentes;
- `git add -p` ajuda, mas não garante separação segura sem `s` ou edição de patch;
- o hunk contém linhas inseparáveis quando import, menu, rota e render compartilham o mesmo bloco;
- patch temporário pode ser mais seguro para isolar a parte do Plano de contas;
- há risco real de selecionar código sem a dependência correspondente se o handler de shell vier junto com outras telas;
- há risco de documentação contraditória se o arquivo for stageado junto de alterações de outras frentes.

### `frontend-react/src/features/planoContas/PlanoContasPage.jsx`

Resposta consolidada:

- não deve ser staged integralmente sem revisão;
- os hunks misturam grupos, categorias, toolbar, exclusão e migração;
- `git add -p` sozinho pode ser insuficiente;
- provavelmente será necessário dividir manualmente com `s`;
- há blocos inseparáveis no listener de toolbar e no bloco de modais;
- patch temporário é mais seguro quando delete e migração estiverem no mesmo hunk;
- risco de dependência faltando é médio;
- documentação contraditória não é o principal risco aqui, mas o estágio prematuro de migração é.

### `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`

- não é seguro stagear inteiro se o botão Eliminar ainda estiver ligado ao fluxo destrutivo;
- os hunks podem misturar estado do shell e ações do módulo;
- `git add -p` pode ser suficiente apenas para o bloco de botões simples;
- para `Eliminar`, a divisão manual costuma ser necessária;
- patch temporário é preferível se o mesmo bloco acoplar exclusão e migração.

### `frontend-react/src/features/planoContas/hooks/usePlanoContas.js`

- não deve ser stageado integralmente se delete e migration estiverem no mesmo trecho;
- `git add -p` é útil, mas pode precisar de `s`;
- há risco de capturar chamada sem importar helper de seleção ou API;
- commit consolidado maior só faria sentido se o trecho estiver realmente inseparável e ainda compilável.

### `frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`

- é o mais próximo de safe full-stage;
- os helpers são coesos;
- `git add -p` tende a ser suficiente, embora não necessário;
- risco baixo.

### `frontend-react/src/features/planoContas/planoContasApi.js`

- pode ser staged integralmente com menor risco, porque as funções são coesas por endpoint;
- `git add -p` normalmente não é necessário;
- cuidado apenas com dependências de helper e import circular;
- risco baixo.

### `frontend-react/src/features/planoContas/planoContasCategoryDeletion.js`

- pode ser staged integralmente com segurança;
- `git add -p` não é necessário;
- risco baixo.

### `frontend-react/src/styles/globals.css`

- não deve ser stageado inteiro;
- o hunk exato da correção global é apenas:

```css
.auxiliary-shell-band {
  box-shadow: none;
}
```

- `git add -p` pode ser suficiente se o hunk estiver isolado;
- se estiver colado a outras regras de shell, dividir com `s` ou editar patch será mais seguro;
- este arquivo é sensível a seleção errada porque concentra correções visuais globais.

### `docs/11_roadmap_desenvolvimento.md`

- não deve entrar neste pacote;
- está misturado com várias frentes;
- `git add -p` só seria aceitável com revisão manual linha a linha;
- o mais seguro é mantê-lo fora desta seleção.

### `docs/contrato_funcional_plano_de_contas.md`

- pode ser staged inteiro;
- não há sinal de mistura com outra frente dentro do conteúdo lido;
- risco baixo;
- porém, se o objetivo do commit for só implementação, este arquivo pode ser separado para um commit documental.

### `docs/roadmap_plano_de_contas_frontend_react.md`

- pode ser staged inteiro;
- está coeso com a sequência do módulo;
- risco baixo;
- também pode ficar para commit documental separado.

## Alternativas seguras quando `git add -p` não basta

1. `s` para dividir hunks em `App.jsx`, `PlanoContasPage.jsx` e `PlanoContasToolbar.jsx`.
2. `e` para editar o patch quando o hunk mistura imports, handlers e render.
3. patch temporário para isolar a frente de Plano de contas e deixar o shell global para depois.
4. commit consolidado maior apenas se o bloco for inseparável e ainda compilar sozinho.

## Itens ausentes ou genéricos demais na matriz anterior

- status rastreado/untracked por linha;
- risco por arquivo;
- arquivos relacionados;
- testes relacionados;
- documentação relacionada;
- distinção explícita entre commit funcional e commit documental;
- análise formal dos documentos ausentes;
- roteiro por símbolo/hunk em `App.jsx`.

## Conclusão operacional

- A matriz anterior está útil, mas ainda não é suficiente para stage automático.
- `App.jsx`, `PlanoContasPage.jsx`, `PlanoContasToolbar.jsx` e `globals.css` exigem seleção cuidadosa por hunk.
- `planoContasApi.js`, `planoContasCategoryDeletion.js` e `usePlanoContasSelection.js` são candidatos mais seguros para stage integral.
- `docs/11_roadmap_desenvolvimento.md` deve permanecer fora deste pacote.
- Nenhum stage foi feito.
