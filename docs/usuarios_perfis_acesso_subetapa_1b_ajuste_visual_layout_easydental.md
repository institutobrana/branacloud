# Usuários / Perfis de acesso — Subetapa 1B — Ajuste visual do layout ao padrão EasyDental

## 1. Contexto

- A Subetapa 1 corrigiu o carregamento da aba `Perfis`.
- O teste manual passou.
- O ajuste desta subetapa é somente visual.

## 2. Objetivo

- Colocar `Perfis` em cima.
- Colocar `Prestadores` abaixo.
- Aproximar o layout visual do padrão observado no EasyDental.

## 3. Arquivos alterados

- `frontend/index.html`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`

## 4. Correção aplicada

- A estrutura visual da aba `Perfis de acesso` estava em um grid horizontal com duas colunas.
- O layout foi ajustado para um grid de uma única coluna na classe `.users-perf-layout`.
- Com isso, o quadro/lista de `Perfil` fica empilhado acima e o quadro/lista de `Prestadores` fica abaixo.
- A mudança preservou os mesmos `id`s, classes e eventos já usados pelo JavaScript.
- Não houve alteração de chamadas HTTP, carregamento, seleção ou salvamento.

## 5. O que não foi alterado

- backend;
- banco;
- signup;
- seeds;
- bootstrap;
- `access_profile`;
- `usuario_perfil_acesso`;
- endpoints;
- textos/mojibake;
- permissões;
- lógica de carregamento;
- lógica de salvamento;
- nomes dos 10 perfis.

## 6. Onde testar

1. Entrar com conta existente da clínica 1 ou 4.
2. Abrir módulo Usuários.
3. Selecionar usuário comum.
4. Abrir `Perfis de acesso`.
5. Confirmar que `Perfis` aparecem em cima.
6. Confirmar que `Prestadores` aparecem abaixo.
7. Confirmar que os 10 perfis continuam aparecendo.
8. Alternar abas e voltar.
9. Fechar e reabrir o modal.
10. Confirmar que layout e carregamento continuam corretos.

## 7. Checks executados

- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: mostra `frontend/index.html` modificado, este documento novo e os untracked preexistentes do ambiente; `frontend/app.js` continua modificado da etapa anterior.
- `git diff --stat`: indica apenas a alteração visual em `frontend/index.html` nesta subetapa.
- `git log --oneline -30`: OK.
- `node --check frontend/app.js`: OK.
- `node --check frontend/js/modules/users-admin-modal-visual.js`: OK.
- `python -m py_compile` dos arquivos solicitados: OK, com saída compilada para diretório temporário fora do repositório.

## 8. Estado final do git status --short

- `M frontend/app.js`  (alteração anterior, mantida)
- `M frontend/index.html`
- `?? docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- demais `??` preexistentes do ambiente preservados
