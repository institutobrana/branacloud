# Preferências e Opções do Sistema — Subetapa 1 — Namespace passivo

## Objetivo

Criar apenas um namespace passivo para o módulo Preferências e Opções do Sistema, sem mover comportamento real do `frontend/app.js`.

## Escopo

Esta etapa é conservadora e limitada a:
- criar o novo arquivo de módulo passivo;
- carregar esse módulo no `frontend/index.html` antes de `frontend/app.js`;
- registrar a estrutura criada nesta documentação.

Não houve:
- movimentação de comportamento real;
- alteração de payload;
- alteração de salvamento;
- alteração de backend/API;
- alteração de permissões;
- alteração de strings visíveis;
- correção de texto ou mojibake;
- alteração de banco, schema, migrations ou endpoints;
- UPDATE, DELETE ou INSERT;
- reajuste real.

## Arquivos alterados

- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/index.html`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`

## Arquivos não alterados

- `frontend/app.js`
- backend
- banco
- schema
- migrations
- endpoints
- qualquer outro módulo JS existente em `frontend/js/modules`

## Base documental usada

- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## O que foi criado

Foi criado o arquivo `frontend/js/modules/preferencias-opcoes-sistema.js` com uma IIFE passiva e namespace global:

- `window.BranaPreferenciasOpcoesSistemaModule`

O conteúdo é propositalmente mínimo e apenas expõe metadados técnicos:

- nome do módulo;
- versão da subetapa;
- indicação de que o módulo é passivo;
- indicação de que não houve movimentação de comportamento.

## O que foi alterado no index.html

Foi adicionado somente um carregamento de script novo, antes de `frontend/app.js`:

- `frontend/js/modules/preferencias-opcoes-sistema.js`

A ordem dos demais scripts foi preservada.

## O que NÃO foi movido

Não foram movidos:

- DOM;
- abertura/fechamento;
- payload;
- salvamento;
- backend/API;
- permissões;
- estado global;
- strings visíveis;
- mojibake.

## Checks executados

Checks de leitura e auditoria realizados nesta etapa:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -12`
- `git diff --stat`
- `git diff --cached --stat`
- conferência de módulos existentes em `frontend/js/modules`
- leitura de `frontend/index.html`
- leitura de `frontend/app.js`
- leitura de `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- leitura de `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Checks de sintaxe executados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`

## Roteiro de teste no navegador

Como houve alteração no `index.html` e novo JS carregado:

1. Fazer `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir o menu/painel de Preferências.
4. Confirmar que abre como antes.
5. Alternar abas principais de Preferências, sem salvar.
6. Fechar o painel/modal.
7. Abrir Opções do Sistema.
8. Confirmar que abre como antes.
9. Alternar abas principais de Opções do Sistema, sem salvar.
10. Fechar o painel/modal.
11. Confirmar no console que não há erro relacionado a `preferencias-opcoes-sistema.js`.
12. Não executar salvamento real nesta etapa.

## Riscos remanescentes

- O namespace passivo foi mantido sem comportamento, mas sempre existe risco baixo de colisão de nome global quando se cria um novo `window.*`.
- O `index.html` passa a carregar mais um script, então qualquer erro de sintaxe nesse arquivo pode impedir o carregamento do `app.js`.
- Esta etapa não reduz o acoplamento do bloco monolítico; ela apenas cria a fronteira passiva inicial.

## Próxima etapa recomendada

Subetapa 2 documental, antes de mover helpers, para escolher apenas defaults puros e funções sem DOM/API/payload/salvamento.
