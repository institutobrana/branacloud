# Primeiro acesso / senha interna — Subetapa 0 — Diagnóstico do conflito com login

## 1. Contexto

- Nova conta manual criada com `institutobrana@gmail.com`.
- A tela de primeiro acesso exibiu o texto de senha interna.
- O texto correto definido pelo usuário é: `Essa NÃO é sua senha de login`.
- Após sair, a senha de login original não funcionou.
- A senha definida na tela inicial de setup funcionou para login.
- O comportamento observado contradiz a regra esperada.

## 2. Objetivo

Diagnóstico sem alteração de código ou banco.

## 3. Documentos consultados

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`

## 4. Conta diagnosticada

Conta criada manualmente:

- `clinica_id`: `10`
- `clinica`: `Tel`
- `tipo_conta`: `DEMO 7 dias`
- `trial_ate`: `2026-05-30 10:19:42.715020`
- `data_ativacao`: `null`

Usuário admin/dono:

- `usuarios.id`: `24`
- `codigo`: `1`
- `nome`: `Tel`
- `email`: `institutobrana@gmail.com`
- `is_admin`: `true`
- `ativo`: `true`
- `online`: `true`
- `setup_completed`: `true`
- `forcar_troca_senha`: `false`
- `prestador_id`: `null`
- `unidade_atendimento_id`: `null`
- `senha_hash`: preenchido
- prefixo mascarado do hash: `$bcrypt-sha2`

Usuário sistema:

- `usuarios.id`: `23`
- `codigo`: `255`
- `nome`: `Clínica`
- `email`: `clinica.255.c10@system.brana.local`
- `is_admin`: `false`
- `ativo`: `true`
- `online`: `false`
- `setup_completed`: `true`
- `forcar_troca_senha`: `false`
- `prestador_id`: `15`
- `unidade_atendimento_id`: `null`
- `senha_hash`: preenchido
- prefixo mascarado do hash: `$bcrypt-sha2`

Prestador sistemico vinculado:

- `prestador_odonto.id`: `15`
- `clinica_id`: `10`
- `source_id`: `255`
- `codigo`: `001`
- `nome`: `Clínica`
- `apelido`: `Clínica`
- `tipo_prestador`: `Clínica odontológica`
- `inativo`: `false`
- `executa_procedimento`: `true`
- `usuario_id`: `23`
- `is_system_prestador`: `true`

Outro usuário da mesma clínica:

- `usuarios.id`: `25`
- `codigo`: `256`
- `nome`: `Jozicler Teodoro Sampaio`
- `email`: `joziclerteodorosampa.256.c10@local.brana`
- `is_admin`: `false`
- `ativo`: `true`
- `online`: `false`
- `setup_completed`: `false`
- `forcar_troca_senha`: `false`
- `prestador_id`: `16`
- `unidade_atendimento_id`: `null`
- `senha_hash`: preenchido
- prefixo mascarado do hash: `$bcrypt-sha2`

Campos relevantes encontrados na tabela `usuarios`:

- `senha_hash`
- `forcar_troca_senha`
- `setup_completed`
- `is_system_user`

Não foi encontrado campo separado para senha interna em outro nome de coluna.

## 5. Mapeamento frontend

Arquivos relevantes:

- `frontend/index.html`
- `frontend/app.js`

Na tela de primeiro acesso, o HTML expõe:

- `panel-setup`
- `setup-email`
- `setup-senha`
- `setup-confirma`
- botão `Concluir primeiro acesso`

O frontend usa:

- `abrirTelaSetup(...)`
- `setupComplete()`
- `login()`
- `carregarSessao()`

Fluxo observado:

- `login()` envia `username` e `password` para `POST /login`;
- `abrirTelaSetup()` mostra o painel de primeiro acesso quando `setup_completed` vem falso;
- `setupComplete()` envia `{ senha, confirma_senha }` para `POST /auth/setup/complete`;
- após sucesso, o frontend chama `carregarSessao()` novamente.

## 6. Mapeamento backend

Arquivos principais:

- `backend/routes/auth_routes.py`
- `backend/services/signup_service.py`
- `backend/security/dependencies.py`
- `backend/security/admin_password.py`
- `backend/models/usuario.py`

Rotas e funções relevantes:

- `backend/routes/auth_routes.py:250` - `def login(...)`
- `backend/routes/auth_routes.py:275` - `verify_password(form_data.password, usuario.senha_hash)`
- `backend/routes/auth_routes.py:661` - `def setup_complete(...)`
- `backend/routes/auth_routes.py:679` - `usuario.senha_hash = hash_password(senha)`
- `backend/routes/auth_routes.py:681` - `usuario.setup_completed = True`

Fluxo de criação de conta:

- `backend/services/signup_service.py:2191` - `criar_conta_saas(...)`
- `backend/services/signup_service.py:2215` - `senha_hash=hash_password(senha)`
- `backend/services/signup_service.py:2219` - `setup_completed=False`

Dependências de primeiro acesso e autenticação:

- `backend/security/dependencies.py` bloqueia rotas quando `setup_completed` está falso, exceto caminhos permitidos;
- `backend/security/admin_password.py:45` usa `verify_admin_password(...)`;
- `verify_admin_password(...)` valida a senha do administrador contra `admin.senha_hash`.

Modelo de usuário:

- `backend/models/usuario.py` mostra apenas uma coluna persistida para senha: `senha_hash`.

## 7. Mapeamento do login

Fluxo de login identificado:

- endpoint: `POST /login`
- parâmetro: `OAuth2PasswordRequestForm`
- campo de senha validado: `usuario.senha_hash`
- validação: `verify_password(form_data.password, usuario.senha_hash)`

Não foi encontrado fallback para um campo separado de senha interna.

O login não valida contra outra coluna e não faz distinção entre senha de login e senha interna no banco.

## 8. Diagnóstico provável

Hipótese principal:

- a senha definida no primeiro acesso sobrescreve a senha de login porque `POST /auth/setup/complete` grava o novo hash diretamente em `usuario.senha_hash`, que é o mesmo campo usado por `POST /login`.

Hipóteses secundárias:

- o texto da tela está conceitualmente correto, mas a implementação não separa credencial interna e credencial de login;
- o desbloqueio protegido também usa `senha_hash`, então o mesmo segredo acaba servindo para login e para operações protegidas;
- não existe uma coluna própria para a senha interna, então a separação não pode acontecer sem ajuste estrutural.

## 9. Risco

Impactos potenciais do conflito:

- autenticação do usuário;
- segurança das operações sensíveis;
- comportamento de admin/dono/protegido;
- confiança no texto da tela de setup;
- comportamento de novas clínicas;
- risco de confundir senha de login com senha interna e travar o acesso esperado depois do primeiro acesso.

## 10. Próximo recorte seguro recomendado

O menor recorte seguro para correção futura deve começar por:

- `backend/routes/auth_routes.py` (`login` e `setup_complete`)
- `backend/security/admin_password.py`

Motivo:

- os dois fluxos usam a mesma coluna `usuarios.senha_hash`;
- se a decisão de produto for separar senha de login e senha interna, será necessário criar/usar um segundo armazenamento e ajustar o login e o desbloqueio protegido em conjunto;
- se a decisão for reaproveitar a mesma credencial, então o texto da tela e o contrato precisam ser alinhados formalmente antes de qualquer ajuste adicional.

## 11. Onde testar depois da futura correção

1. Criar/usar conta de teste.
2. Fazer login com a senha de login.
3. Definir senha interna no primeiro acesso.
4. Sair.
5. Login deve continuar funcionando com a senha de login.
6. Login não deve funcionar com a senha interna, se a senha interna for diferente.
7. Ações sensíveis devem pedir senha interna.
8. O texto da tela deve permanecer coerente.

## 12. Confirmações da etapa

- somente este documento foi criado;
- nenhum código foi alterado;
- banco não foi alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT`;
- nenhuma senha foi alterada;
- nenhum usuário foi alterado;
- nenhuma clínica foi criada ou excluída;
- `signup`, `seeds`, `bootstrap` e `access_profile` não foram alterados;
- `frontend` e `backend` não foram alterados;
- textos/mojibake não foram corrigidos;
- pastas proibidas não foram tocadas;
- sem `git add`, `git commit` ou `git push`.
