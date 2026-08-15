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
6. Backend registra `usuarios.last_seen_at` em UTC no login bem-sucedido, sem alterar o payload.
7. Frontend salva token em `localStorage` como `brana_token`.

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
6. Backend tenta registrar atividade autenticada em `usuarios.last_seen_at` com throttle de 60 segundos e sessao curta propria.
7. Rota retorna contexto do usuario.

O que pode quebrar:

- Token ausente: 401.
- Token expirado/invalido: 401.
- `JWT_SECRET_KEY` diferente da usada para criar o token: 401.
- Usuario removido/inativo depois do login: 401 ou 403.
- `setup_completed` falso tentando acessar rota fora da lista permitida: 403 `setup_required`.

Observacao: falha auxiliar no registro de `last_seen_at` nao deve transformar uma autenticacao valida em erro para o frontend.

## Primeiro acesso no frontend React

Rota real:

```text
/app/primeiro-acesso
```

Sequencia:

1. Usuario faz login no React.
2. Backend retorna token normalmente.
3. React chama `/me`.
4. Se `/me` retornar `setup_completed === false`, o guard global redireciona para `/app/primeiro-acesso`.
5. O shell principal nao e renderizado.
6. A pagina exibe e-mail readonly, senha interna e confirmacao.
7. A pagina informa que a senha interna nao e a senha de login e que a senha de login continua sendo usada para acessar a conta.
8. Submit valido chama `POST /auth/setup/complete`.
9. Payload enviado: `{ "senha": "...", "confirma_senha": "..." }`.
10. Backend grava a senha interna, conclui setup e registra `last_seen_at` em UTC sem limpar historico.
11. Apos sucesso, React chama `refreshSession()`.
12. Com `setup_completed === true`, redireciona para `/app`.

O que pode quebrar:

- `refreshSession()` falhar apos setup.
- usuario pendente tentar rota interna manualmente.
- token expirado durante setup.
- payload com senha curta ou confirmacao divergente.

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
3. A dependencia comum tenta registrar `last_seen_at` com throttle de 60 segundos.
4. Rota pega `current_user.clinica_id`.
5. Banco consulta apenas registros daquela clinica.
6. Resposta volta em JSON.

O que pode quebrar:

- Rota sem dependencia de autenticacao: risco de seguranca.
- Query sem filtro por `clinica_id`: risco de vazamento entre clinicas.
- Frontend tentando enviar `clinica_id` manualmente: deve ser ignorado como fonte de verdade.
- Permissao do modulo desabilitada: 403.
- Modulo protegido sem senha/grant: 403 com `protected_password_required`.

## Conta corrente do cirurgiao

Fluxo documental futuro:

1. O frontend consulta `GET /cadastros/prestadores` para montar o combo `Cirurgião`.
2. A tela principal consulta `GET /financeiro/lancamentos` com `mes`, `ano`, `conta`, `filtro` e, futuramente, `prestador_id`.
3. O backend valida a clínica do usuário e a relação do prestador com a mesma clínica.
4. Para `conta = CLINICA`, não há prestador individual.
5. Para `conta = CIRURGIAO`, o frontend futuro deverá operar sobre o prestador selecionado.

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

## ADM Cobranca React - contrato de leitura

Sequencia prevista para a primeira fase segura:

1. Usuario MASTER acessa `/app/adm/cobrancas`.
2. `App.jsx` monta a barra global ADM no shell em L.
3. `AdminRoutes` renderiza a frente `billing` quando habilitada.
4. A pagina futura deve chamar apenas `GET /superadmin/cobrancas` com token Bearer.
5. O backend valida `_require_superadmin`.
6. A resposta vem de `plataforma_cobrancas`, ordenada por `criado_em desc` e `id desc`.
7. A tabela React deve renderizar `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.

Nao faz parte deste fluxo inicial: checkout, Pix, boleto, confirmacao de pagamento, sincronizacao Mercado Pago, webhook, cancelamento, reembolso, baixa manual ou qualquer POST/PUT/PATCH/DELETE financeiro.

`GET /superadmin/assinaturas` existe como visao complementar derivada de estado de plano/licenca, mas nao deve substituir a tabela principal de cobrancas na primeira fase.

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

## ADM Usuarios React - leitura

Sequencia:

1. Usuario MASTER acessa `/app/adm/usuarios`.
2. `App.jsx` monta a barra global do ADM no shell em L.
3. `AdminRoutes` renderiza `UsersPage` com `activeSection="users"`.
4. `UsersPage` publica a toolbar global com `Atualizar`, `Exportar CSV`, `Ver detalhes` e `Buscar usuario`, usando botoes `auxiliary-shell-button` no padrao visual dos modulos de tabelas.
5. `useAdminUsers` consulta `GET /superadmin/usuarios` com token Bearer.
6. O backend inclui `last_seen_at` e `is_online` calculado pela janela de 3 minutos.
7. O normalizador React converte esses campos para `lastSeenAt` e `isOnline`.
8. A tabela exibe `Online` apos `Status`; usuario sistemico aparece como `Nao aplicavel`.
6. O payload e normalizado e exibido em `UsersTable`.
7. Filtros, ordenacao e visibilidade de colunas sao aplicados localmente.

O que pode quebrar:

- Sessao expirada ou token ausente.
- Usuario sem permissao MASTER.
- Backend retornar payload diferente de array.
- `setup_completed` ausente no endpoint, exibindo `Nao disponivel` quando a coluna opcional e habilitada.

Nao ha fluxo de escrita em Usuarios nesta fase.

## ADM Usuarios React - Ver detalhes

Sequencia:

1. Usuario MASTER acessa `/app/adm/usuarios`.
2. A listagem carrega usuarios por `GET /superadmin/usuarios`.
3. Sem linha selecionada, `Ver detalhes` permanece desabilitado.
4. Ao selecionar uma linha, `Ver detalhes` abre o modal `Detalhes do usuario`.
5. O modal usa o objeto normalizado da listagem carregada, sem endpoint adicional.
6. O footer possui somente `Fechar`, em formato compacto.
7. Fechar o modal preserva a selecao.
8. Se busca, filtro local ou refresh removerem o usuario selecionado da lista visivel, a selecao e limpa e o modal fecha.

O que pode quebrar:

- Sessao expirada ou token ausente na carga da lista.
- Usuario sem permissao MASTER.
- Backend nao enviar campos opcionais, que serao exibidos como `Nao disponivel`.

Nao ha fluxo de escrita em `Ver detalhes`.

Observacao visual: o modal de detalhes usa largura compacta densa ajustada para `800px`, grade interna comum de seis trilhas em desktop/tablet (`rotulo | valor` repetido tres vezes), espacamento uniforme de `8px` entre blocos, ellipsis com tooltip para campos longos e nao forca scroll interno no desktop normal. Em telas menores, a partir do breakpoint especifico de `760px`, a grade volta para um par por linha e o body pode rolar internamente.

## ADM Usuarios React - Ver conta

Sequencia:

1. Usuario MASTER/Owner acessa `/app/adm/usuarios`.
2. Sem linha selecionada, `Ver conta` permanece desabilitado.
3. Ao selecionar uma linha com `clinica_id` valido, `Ver conta` habilita.
4. O clique usa navegacao React para `/app/adm/clinicas` com estado transitorio do `App.jsx` contendo `selectedClinicId`.
5. `ADM -> Clinicas` aguarda a listagem carregar e procura a clinica por ID exato.
6. Se a clinica existir, a linha e selecionada; filtros locais conflitantes sao limpos apenas se ocultarem a linha.
7. Se a clinica nao existir no resultado carregado, a selecao e limpa e a mensagem `A conta vinculada a este usuario nao foi encontrada.` e exibida.

Nao ha request mutavel neste fluxo. Nao ha fallback por nome, e-mail, indice visual ou posicao da linha.

## ADM Usuarios React - exportacao CSV

1. Usuario MASTER acessa `/app/adm/usuarios`.
2. A toolbar global exibe `Atualizar`, `Exportar CSV` e `Buscar usuario`.
3. Ao clicar em `Exportar CSV`, o frontend chama `GET /superadmin/usuarios/export.csv` com token Bearer no header.
4. A busca server-side atual (`q`) e enviada junto com `limit=5000`.
5. O frontend valida status HTTP, Content-Type CSV e blob nao vazio.
6. O nome de arquivo vem do `Content-Disposition`; se ausente ou inseguro, usa `usuarios-adm-YYYY-MM-DD.csv`.
7. O download e iniciado no navegador sem alterar filtros locais, ordenacao, selecao ou dados renderizados.

## ADM Cobrancas React - leitura

Sequencia:

1. Usuario MASTER acessa `/app/adm/cobrancas`.
2. `App.jsx` monta a barra global do ADM no shell em L.
3. `AdminRoutes` renderiza `BillingPage` com `activeSection="billing"`.
4. `BillingPage` publica a toolbar global com `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Ver conta` e `Buscar cobranca`.
5. `useAdminBilling` consulta `GET /superadmin/cobrancas` com token Bearer.
6. O payload e normalizado por `normalizeAdminBilling`.
7. A tabela exibe `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.
8. Busca textual, filtros, ordenacao e visibilidade de colunas sao aplicados localmente.
9. `Atualizar` refaz a leitura sem executar acao financeira.

O que pode quebrar:

- Sessao expirada ou token ausente.
- Usuario sem permissao MASTER.
- Backend retornar payload diferente de array.
- Volume real exigir paginacao ou filtro backend em fase futura.

Nao ha fluxo de escrita em `ADM -> Cobrancas` nesta fase.

## ADM Cobrancas React - Ver detalhes

Sequencia:

1. Usuario MASTER acessa `/app/adm/cobrancas`.
2. A listagem carrega cobrancas por `GET /superadmin/cobrancas`.
3. Sem linha selecionada, `Ver detalhes` permanece desabilitado.
4. Ao selecionar uma linha, `Ver detalhes` abre o modal `Detalhes da cobranca`.
5. O modal usa o objeto normalizado da listagem carregada, sem endpoint adicional.
6. O footer possui somente `Fechar`, em formato compacto.
7. Ao iniciar refresh, o modal fecha para evitar snapshot obsoleto.
8. Se a selecao desaparecer por busca, filtro ou refresh, o modal fecha.

Nao ha fluxo de escrita em `Ver detalhes`.

Observacao visual: o modal usa largura `800px`, altura natural, `max-height: calc(100vh - 24px)`, grade interna comum de seis trilhas em desktop/tablet (`rotulo | valor` repetido tres vezes), ellipsis com tooltip para campos longos e empilhamento em telas menores a partir de `760px`.

Estado vazio:

1. Se `GET /superadmin/cobrancas` retornar `[]`, a tabela continua montada.
2. Os cabecalhos permanecem visiveis.
3. O corpo mostra `Nenhuma cobrança encontrada.`.
4. O rodape mostra zero registros.
5. Se houver cobrancas carregadas, mas busca/filtro zerar a lista visivel, o corpo mostra `Nenhuma cobrança corresponde aos filtros aplicados.` e o rodape preserva o total carregado.

## ADM Auditoria - leitura histórica

Sequencia observada no legado:

1. Usuario SUPERADMIN acessa o painel ADM.
2. A tela carrega a secao de auditoria com `saCarregarAuditoria()`.
3. O frontend chama `GET /superadmin/auditoria?limit=80`.
4. A resposta e renderizada por `saRenderAuditoria()`.
5. O corpo mostra as cinco colunas do legado: `ID`, `Data`, `Ação`, `Autor`, `Alvo`.

O que pode quebrar:

- campo `detalhes_json` expor dados demais em fase futura;
- ausencia de filtros server-side;
- ausencia de `request_id` e `user_agent`;
- uso de `alvo` como string sem contrato navegavel.

Nao ha fluxo de escrita em `ADM -> Auditoria` nesta fase.
### Contrato de datas no fluxo da conta corrente

- `mes` e `ano` continuam sendo filtros de periodo e nao substituem um campo de data isolado.
- Campos como `data_lancamento` e `data_vencimento` seguem o contrato mestre de data generica.
- Se o fluxo exigir intervalo, o contrato deve explicitar `inicio` e `fim` e documentar os defaults de periodo.

### Fechamento da frente DATA

- O fluxo `Pesquisa fluxo de caixa -> Criterios gerais` foi homologado com o contrato mestre.
- O fluxo `Insere lancamento -> Vencimento / Data do lancamento` foi homologado com o mesmo motor.
- A proxima evolucao de fluxo deve esperar novo consumidor ou evidencia tecnica para extrair um componente compartilhado.
