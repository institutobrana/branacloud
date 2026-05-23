# Usuários / Perfis de acesso — Subetapa 1 — Correção de carregamento da aba Perfis

## 1. Contexto

- A Subetapa 0 diagnosticou um problema provável de UI/estado.
- O banco das clínicas 1 e 4 está correto, com 10 `access_profile` em cada uma.
- Esta correção não mexe em signup, seeds ou bootstrap.

## 2. Objetivo

- Corrigir apenas o carregamento e a exibição da aba `Perfis` no módulo Usuários.

## 3. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/sintese_primeira_separacao_real_usuarios_admin.md`

## 4. Arquivos alterados

- `frontend/app.js`

## 5. Diagnóstico técnico confirmado

- A causa provável confirmada estava na restauração incompleta da visibilidade da aba `Perfis` em `usersAbrirPermissoes()`.
- Quando a última conta aberta era admin/dono/protegida, a aba podia ficar escondida e não era reexibida ao abrir uma conta comum.
- O carregamento em `usersPerfLoad()` já existia e o endpoint esperado continua sendo `GET /admin/users/{id}/profiles`.
- O problema principal estava no estado visual da aba, não no backend nem no banco.

## 6. Correção aplicada

- Em `frontend/app.js`, `usersAbrirPermissoes()` passou a restaurar explicitamente a visibilidade da aba e do painel de `Perfis` quando a conta selecionada não é admin.
- A lógica continua respeitando a proteção de contas admin/dono/protegidas.
- O ponto de carregamento permanece no fluxo já existente: ao ativar a aba `perfis`, `usersPerfLoad()` continua sendo chamado por `usersPermSetTab("perfis")`.

## 7. O que não foi alterado

- backend;
- banco;
- signup;
- seeds;
- bootstrap;
- `access_profile`;
- `usuario_perfil_acesso`;
- textos/mojibake;
- frontend fora do recorte;
- endpoints;
- schema.

## 8. Riscos preservados

- admin/dono/protegido;
- protected/grant;
- senha protegida;
- licença/permissões.

## 9. Onde testar

1. Entrar com uma conta existente da clínica 1 ou 4.
2. Abrir o módulo Usuários.
3. Selecionar um usuário existente.
4. Abrir a aba `Perfis de acesso`.
5. Confirmar que aparecem os 10 perfis.
6. Alternar para outra aba e voltar para `Perfis de acesso`.
7. Fechar e reabrir o modal.
8. Confirmar que a lista continua aparecendo.
9. Se houver seleção/salvamento de perfil, testar sem alterar regra de seed/signup.

## 10. Resultado dos checks

- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: mostra `frontend/app.js` modificado, este novo documento e os untracked preexistentes do ambiente.
- `git diff --stat`: indica apenas `frontend/app.js` com 1 inserção e 1 remoção.
- `git log --oneline -30`: OK.
- `node --check frontend/app.js`: OK.
- `node --check frontend/js/modules/users-admin-modal-visual.js`: OK.
- `python -m py_compile` dos arquivos solicitados: validação realizada com compilação para caminho temporário fora do repositório.

## 11. Estado final do git status --short

- `M frontend/app.js`
- `?? docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- demais `??` preexistentes do ambiente preservados
