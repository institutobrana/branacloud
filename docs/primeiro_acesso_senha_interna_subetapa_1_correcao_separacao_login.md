# Primeiro acesso / senha interna — Subetapa 1 — Correção da separação entre senha interna e login

## 1. Contexto

- Subetapa 0 diagnosticou que setup e login usam `usuarios.senha_hash`.
- Texto correto definido pelo usuário: `Essa NÃO é sua senha de login`.
- Comportamento observado: a senha interna virou senha de login.
- Objetivo desta etapa foi separar as credenciais.
- Decisão vigente registrada para a trilha de seeds/procedimentos: para novas contas/clínicas, a tabela atualmente chamada `PARTICULAR` deve passar a nascer como `Brana`; novas contas devem nascer com `Tabela exemplo` e `Brana`; contas existentes podem manter `PARTICULAR` como estão.

## 2. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`

## 3. Diagnostico tecnico confirmado

- O setup inicial sobrescrevia a senha de login porque `POST /auth/setup/complete` gravava o hash no campo `usuarios.senha_hash`.
- O login validava em `POST /login` usando `verify_password(form_data.password, usuario.senha_hash)`.
- A senha administrativa/interna tambem era validada contra `usuarios.senha_hash` em `backend/security/admin_password.py`.
- Foi necessario criar um campo separado para senha interna: `usuarios.senha_interna_hash`.

## 4. Correcao aplicada

- Arquivos alterados:
  - `backend/models/usuario.py`
  - `backend/routes/auth_routes.py`
  - `backend/security/admin_password.py`
  - `backend/database.py`
- Campo novo criado no modelo: `senha_interna_hash`.
- Schema/compatibilidade:
  - a camada de acesso ao banco passou a garantir a coluna `senha_interna_hash` ao abrir a sessão.
- `setup_complete(...)` passou a gravar a senha interna em `usuarios.senha_interna_hash` e nao mais em `usuarios.senha_hash`.
- `verify_admin_password(...)` passou a validar primeiro a senha interna e, apenas para compatibilidade legada, usar `senha_hash` quando `senha_interna_hash` ainda nao existir/nestiver vazia.
- O login comum continua validando apenas `usuarios.senha_hash`.
- O frontend nao precisou de alteracao de payload nesta etapa.
- Para usuarios existentes sem senha interna separada, a validacao protegida ficou com fallback legado controlado para nao quebrar o acesso administrativo ate a proxima etapa de consolidacao.

## 5. O que nao foi alterado

- seeds.
- access_profile.
- Intervencoes / Procedimentos.
- tabela `PARTICULAR` / `Brana`.
- exclusoes.
- contratos vigentes.
- textos / mojibake.
- senha de login na rotina de setup.
- login comum para senha interna.

## 6. Regra registrada sobre PARTICULAR -> Brana

- A tabela atualmente chamada `PARTICULAR` deve passar a nascer como `Brana` apenas para novas contas/clinicas.
- Contas existentes podem manter `PARTICULAR`.
- Nenhuma alteracao sobre isso foi feita nesta etapa.

## 7. Validacao realizada

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- backend/routes/auth_routes.py backend/security/admin_password.py backend/models/usuario.py frontend/app.js frontend/index.html`
- `git log --oneline -30`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/routes/auth_routes.py`
- `python -m py_compile backend/security/admin_password.py`
- `python -m py_compile backend/models/usuario.py`
- `python -m py_compile backend/database.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/routes/user_admin_routes.py`
- `python -m py_compile backend/services/access_profiles_service.py`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`

## 8. Onde testar no sistema

1. Entrar com a conta de teste.
2. Se necessario, concluir setup com senha interna diferente da senha de login.
3. Sair.
4. Fazer login com senha de login.
5. Confirmar que funciona.
6. Tentar login com senha interna.
7. Confirmar que nao funciona como login comum.
8. Testar a acao sensivel que pede senha interna.
9. Confirmar que a senha interna funciona apenas para acao sensivel.

## 9. Riscos e observacoes

- Contas antigas sem `senha_interna_hash` usam fallback legado para a validacao protegida.
- Pode haver necessidade de consolidar a estrategia de migracao posterior para popular `senha_interna_hash` nas contas antigas, se a regra de produto assim exigir.
- O login nao foi enfraquecido; ele continua usando apenas `senha_hash`.

## 10. Proxima etapa recomendada

- Validacao manual do fluxo primeiro acesso/login.
- Depois disso, retomar o problema 2: Intervencoes / Procedimentos, seed da tabela Brana para novas contas.

## 11. Confirmacoes da etapa

- banco alterado ou nao alterado: o banco nao foi alterado manualmente nesta etapa; apenas a compatibilidade de schema foi preparada em codigo.
- migration criada ou nao criada: nao foi criada migration separada; a compatibilidade foi preparada em `backend/database.py`.
- nenhum DELETE/UPDATE/INSERT manual.
- nenhuma senha foi alterada manualmente fora do fluxo.
- signup/seeds/access_profile nao alterados.
- Intervencoes/Procedimentos nao alterado.
- tabela `PARTICULAR`/`Brana` nao alterada nesta etapa.
- pastas proibidas nao tocadas.
- blindagem textual/mojibake respeitada.
- sem git add/commit/push.
