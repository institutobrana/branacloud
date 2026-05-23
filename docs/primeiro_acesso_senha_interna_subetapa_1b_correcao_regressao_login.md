# Primeiro acesso / senha interna — Subetapa 1B — Correção da regressão de login

## 1. Contexto

- Subetapa 1 separou `senha_interna_hash`.
- Após isso, o usuário não conseguiu login na conta teste nem na conta `id 1`.
- O servidor subiu normalmente, mas o login falhou.
- O objetivo desta etapa foi restaurar a autenticação comum.

## 2. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`

## 3. Diagnóstico técnico

- A separação de senha interna permaneceu correta em `auth_routes.py` e `admin_password.py`.
- O login comum continua usando `usuarios.senha_hash`.
- O frontend continua enviando `POST /login` com `username` e `password`.
- O problema da regressão veio do caminho automático de garantia de schema em `backend/database.py`, que entrou no fluxo crítico de autenticação e passou a bloquear/atrasar o acesso à tabela `usuarios`.
- O banco atual já contém a coluna `senha_interna_hash`.
- Não houve evidência de que o login comum tenha passado a validar `senha_interna_hash`.
- Não houve evidência de mudança indevida em `setup_completed` ou `forcar_troca_senha` no login.
- A correção emergencial foi retirar a execução automática da DDL de `senha_interna_hash` do caminho de abertura da sessão.

## 4. Correção aplicada

- Arquivo ajustado nesta etapa: `backend/database.py`.
- O helper de compatibilidade para `senha_interna_hash` permaneceu disponível, mas deixou de ser executado automaticamente no fluxo crítico de login.
- O login comum continua usando apenas `usuarios.senha_hash`.
- `senha_interna_hash` continua separada para ações sensíveis.
- `admin_password.py` continua restrito às validações protegidas.
- Os arquivos `backend/models/usuario.py`, `backend/routes/auth_routes.py` e `backend/security/admin_password.py` permanecem com a separação conceitual introduzida na Subetapa 1.

## 5. O que não foi alterado

- banco manualmente;
- senhas;
- usuários;
- clínicas;
- signup;
- seeds;
- access_profile;
- Intervenções/Procedimentos;
- regra `PARTICULAR -> Brana`.

## 6. Decisão vigente `PARTICULAR -> Brana`

- Para novas contas/clínicas, a tabela atualmente chamada `PARTICULAR` deve passar a nascer como `Brana`.
- Novas contas devem nascer com `Tabela exemplo` e `Brana`.
- Contas existentes podem manter `PARTICULAR` como está.
- Nenhuma alteração disso foi feita nesta etapa.

## 7. Validação realizada

- Checks executados:
  - `python -m py_compile backend/database.py`
  - `python -m py_compile backend/routes/auth_routes.py`
  - `python -m py_compile backend/security/admin_password.py`
  - `python -m py_compile backend/models/usuario.py`
  - `python -m py_compile backend/services/signup_service.py`
  - `python -m py_compile backend/routes/user_admin_routes.py`
  - `python -m py_compile backend/services/access_profiles_service.py`
  - `python -m py_compile backend/seeds/access_profiles_default.py`
  - `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
  - `python -m py_compile backend/seeds/access_profiles_dry_run.py`
  - `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- Foi confirmado por leitura que `frontend/app.js` continua enviando `POST /login` corretamente.
- Não foi possível validar credenciais reais sem registrar senha.
- Foi observado que a coluna `senha_interna_hash` já existe no banco atual.

## 8. Onde testar no sistema

1. Reiniciar o backend.
2. Atualizar a página no navegador.
3. Fazer login com a conta `id 1` usando a senha de login.
4. Confirmar que entra.
5. Fazer login com a conta teste usando a senha de login.
6. Confirmar que entra.
7. Tentar login com a senha interna.
8. Confirmar que não entra como login comum.
9. Testar uma ação sensível com senha interna.

## 9. Riscos e observações

- Contas existentes podem continuar dependendo de `senha_hash` para login comum.
- O fallback legado de `admin_password.py` permanece apenas para ações sensíveis.
- Pode ser necessário um passo explícito de migration posterior se a garantia de schema voltar a ser exigida em ambientes novos.
- `backend/database.py` ainda contém o helper de compatibilidade, mas ele não executa automaticamente no caminho crítico do login.

## 10. Próxima etapa recomendada

- Validar manualmente o fluxo de primeiro acesso/login com o backend reiniciado.
- Se o login voltar a funcionar, fechar documentalmente esta trilha.
- Depois disso, retomar o problema 2: Intervenções / Procedimentos e a seed da tabela Brana para novas contas.

## 11. Confirmações da etapa

- código alterado nesta etapa: sim, apenas `backend/database.py`;
- banco manual não alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT` manual;
- nenhuma senha alterada manualmente;
- nenhuma clínica criada/excluída;
- `signup`, `seeds` e `access_profile` não alterados;
- `Intervenções/Procedimentos` não alterado;
- tabela `PARTICULAR`/`Brana` não alterada;
- pastas proibidas não tocadas;
- blindagem textual/mojibake respeitada;
- sem `git add`, `git commit` ou `git push`.
