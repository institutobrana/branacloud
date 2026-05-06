# 07 - Fluxos

## Login

Endpoint real: `POST /login`.

O backend usa `OAuth2PasswordRequestForm`, entao o corpo real e `application/x-www-form-urlencoded`, nao JSON. Em forma logica, os dados sao:

```json
{
  "username": "usuario@clinica.com",
  "password": "senha_do_usuario"
}
```

Exemplo PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:8000/login `
  -ContentType "application/x-www-form-urlencoded" `
  -Body @{ username = "usuario@clinica.com"; password = "senha" }
```

Response esperado:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

Sequencia:

1. `frontend/app.js` envia email/senha para `POST /login`.
2. `auth_routes.py` normaliza email.
3. Banco consulta `usuarios`.
4. Backend valida status, conta sistemica e senha.
5. `jwt_handler.py` cria token com `user_id`, `clinica_id` e `is_admin`.
6. Frontend salva token em `localStorage` como `brana_token`.

O que pode quebrar:

- `backend/.env` sem `JWT_SECRET_KEY`: erro ao criar token.
- `DATABASE_URL` invalida: falha de banco.
- Senha incorreta: 400.
- Usuario inativo: 403.
- Conta sistemica: 403.
- Frontend enviando JSON em vez de form-urlencoded: FastAPI nao recebe o formulario esperado.

## Autenticacao e `/me`

Endpoint real: `GET /me`.

Request:

```http
GET /me
Authorization: Bearer eyJ...
```

Response tipico, simplificado:

```json
{
  "id": 1,
  "nome": "Usuario",
  "email": "usuario@clinica.com",
  "clinica_id": 1,
  "is_admin": true
}
```

Sequencia:

1. Frontend pega `brana_token` do `localStorage`.
2. Frontend chama `/me` com header `Authorization`.
3. `get_current_user` decodifica JWT.
4. Banco busca o usuario por `user_id`.
5. Backend valida ativo, setup e conta sistemica.
6. Rota retorna contexto do usuario.

O que pode quebrar:

- Token ausente: 401.
- Token expirado/invalido: 401.
- `JWT_SECRET_KEY` diferente da usada para criar o token: 401.
- Usuario removido/inativo depois do login: 401 ou 403.
- `setup_completed` falso tentando acessar rota fora da lista permitida: 403 `setup_required`.

## Uso autenticado do sistema

Exemplo de endpoint operacional: `GET /cadastros/pacientes`.

Request:

```http
GET /cadastros/pacientes
Authorization: Bearer eyJ...
```

Response simplificado:

```json
[
  {
    "id": 10,
    "codigo": 123,
    "nome": "Paciente Exemplo",
    "clinica_id": 1
  }
]
```

Sequencia:

1. Frontend chama uma rota operacional com Bearer token.
2. Dependencia de modulo valida acesso, por exemplo `require_module_access("procedimentos")`.
3. Rota pega `current_user.clinica_id`.
4. Banco consulta apenas registros daquela clinica.
5. Resposta volta em JSON.

O que pode quebrar:

- Rota sem dependencia de autenticacao: risco de seguranca.
- Query sem filtro por `clinica_id`: risco de vazamento entre clinicas.
- Frontend tentando enviar `clinica_id` manualmente: deve ser ignorado como fonte de verdade.
- Permissao do modulo desabilitada: 403.
- Modulo protegido sem senha/grant: 403 com `protected_password_required`.

## Criacao de usuario

Cadastro externo:

- `POST /signup/request-code`
- `POST /signup/confirm`

Exemplo logico de request para solicitar codigo:

```json
{
  "email": "novo@clinica.com"
}
```

Criacao administrativa:

- `POST /admin/users`

A criacao administrativa exige token, permissao no modulo `usuarios` e pode exigir senha administrativa.

O que pode quebrar:

- Email invalido ou descartavel.
- Email transacional sem SMTP/Resend configurado.
- Falta de permissao em `usuarios`.
- Controle de usuarios ativo exigindo senha administrativa.

## Recuperacao de senha

Endpoints:

- `POST /password/forgot`
- `POST /password/reset`

Exemplo logico:

```json
{
  "email": "usuario@clinica.com"
}
```

O que pode quebrar:

- Email nao configurado.
- Codigo expirado.
- Usuario inexistente ou inativo.
- Nova senha fora da regra esperada pela rota.

## Documentos e PDF

Exemplos de endpoints:

- `GET /editor-textos/modelos`
- `POST /editor-textos/modelos`
- `POST /editor-textos/mesclar`
- `POST /editor-textos/exportar-pdf`
- `POST /editor-textos/assinar-pdf`

Sequencia geral:

1. Frontend seleciona modelo ou texto.
2. Backend busca contexto de paciente/prestador/clinica quando necessario.
3. Backend mescla campos.
4. Backend gera PDF ou prepara assinatura/local bridge.
5. Arquivo resultante deve ser tratado como sensivel.

O que pode quebrar:

- Modelo inexistente ou de outra clinica.
- Storage de modelos ausente.
- Caminho registrado no banco nao bater com a localizacao fisica do arquivo em `storage/modelos/clinicas/<id>`.
- Arquivo legado `.rtf`, `.mod`, `.doc` ou `.docx` abrir com conteudo, mas sem preservar toda a formatacao visual original.
- Template PDF ausente em `backend/data/pdf_templates/`.
- Dependencias de assinatura/local bridge nao configuradas.

Observacao operacional: no projeto ativo `D:\BRANA ARQUIVOS\BRANA CLOUD`, a abertura de modelos clinicos agora resolve nesta ordem: caminho clinico registrado, busca recursiva dentro de `storage/modelos/clinicas/{clinica_id}`, fallback base compativel e vazio somente se nada existir.

## Agenda e Google Calendar

Exemplos de endpoints:

- `GET /agenda-legado`
- `POST /agenda-legado`
- `PUT /agenda-legado/{item_id}`
- `DELETE /agenda-legado/{item_id}`
- `GET /agenda-legado/google-agenda/status`
- `POST /agenda-legado/google-agenda/exportar`

O que pode quebrar:

- Evento sem `clinica_id` correto.
- Prestador, paciente ou unidade de outra clinica.
- Variaveis Google ausentes.
- Token Google expirado.
- Repeticao de agenda gerando eventos indesejados.

## Licenca e pagamento

Exemplos de endpoints:

- `GET /licenca/info`
- `POST /licenca/checkout`
- `POST /licenca/confirmar`
- `POST /licenca/sincronizar`
- `POST /licenca/mercadopago/webhook`

O que pode quebrar:

- `MERCADOPAGO_ACCESS_TOKEN` ausente para checkout real.
- URL publica de webhook incorreta.
- Webhook exposto sem validacao adequada.
- Estado de assinatura divergente do provedor.

## Bootstrap local

Sequencia:

1. `main.py` carrega `backend/.env`.
2. `runtime_profile_service.py` resolve flags.
3. `Base.metadata.create_all` pode criar tabelas ausentes.
4. Hotfixes aditivos garantem colunas criticas.
5. Bootstrap runtime pode executar seeds/sincronizacoes.

O que pode quebrar:

- Banco indisponivel.
- Usuario do banco sem permissao de ALTER/CREATE.
- `BRANA_SKIP_BOOTSTRAP` mal configurado.
- Jobs de bootstrap rodando em ambiente errado.
