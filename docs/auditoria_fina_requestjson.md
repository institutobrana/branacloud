# Auditoria fina documental — requestJson()

## 1. Resumo executivo

Esta auditoria fina documenta a função/contrato `requestJson()` em nível operacional. A conclusão principal é que ele não é apenas um helper de rede: ele é o orquestrador central do transporte autenticado, do retry protegido, da normalização de resposta e da guarda de sessão quando o frontend conversa com o backend.

Na prática, `requestJson()` concentra quatro responsabilidades sensíveis:

- monta e executa chamadas HTTP autenticadas;
- interpreta respostas JSON, texto, blob e raw;
- tenta recuperar automaticamente módulos protegidos com grant;
- aciona o tratamento de sessão expirada/401/403 e de estados de licença/setup.

Isso o coloca entre os contratos mais frágeis do sistema. Qualquer alteração pequena pode quebrar login, grant protegido, sessão, exportação e fluxos administrativos.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração de código foi feita

## 3. Arquivos analisados

Frontend:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`

Backend e contratos correlatos:

- `backend/main.py`
- `backend/routes/auth_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/security/trial_middleware.py`
- `backend/security/user_context.py`

Documentos anteriores usados apenas como contexto:

- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/auditoria_contratos_auth_requestjson_me_security.md`
- `docs/auditoria_requestjson_categorias_uso.md`
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`

## 4. Local exato de definição

A função base e a função de alto nível estão em `frontend/app.js`:

- `requestJsonBase` em torno da linha `306`
- `requestJson` em torno da linha `524`

A relação entre elas é importante:

- `requestJsonBase()` executa o transporte HTTP real;
- `requestJson()` faz a orquestração de normalização, retry protegido e guarda de sessão.

## 5. Assinatura e parâmetros

### `requestJsonBase(method, path, payload, auth = false, options = {})`

Parâmetros identificados:

- `method`: método HTTP
- `path`: rota relativa do backend
- `payload`: corpo em JSON, quando aplicável
- `auth`: indica se deve enviar Bearer token
- `options`: controle fino do transporte

### `requestJson(method, path, payload, auth = false, options = {})`

Parâmetros idênticos, mas com comportamento adicional.

### Flags e opções relevantes

- `options.rawBody`
- `options.headers`
- `options.responseType`
- `options.skipProtectedAutoUnlock`
- `options.skipSessionGuard`
- `options.heartbeat`

## 6. Fluxo textual sequencial da função

### 6.1 Transporte base

1. `requestJsonBase()` recebe método, rota, payload, autenticação e opções.
2. Se `auth=true`, monta `Authorization: Bearer <token>` usando `getToken()`.
3. Se houver `options.headers`, mescla os headers extras.
4. Se existir `rawBody`, usa o corpo bruto sem `JSON.stringify`.
5. Se houver `payload` normal, serializa com `JSON.stringify(payload)`.
6. Se não houver `Content-Type` definido, injeta `application/json`.
7. Executa `fetch(baseUrl + path, ...)`.
8. Decodifica a resposta conforme `responseType`.

### 6.2 Orquestração superior

1. `requestJson()` chama `requestJsonBase()`.
2. Se o retorno puder conter texto com acentos quebrados, aplica normalização de mojibake.
3. Analisa se a resposta é um erro protegido via `parseProtectedError()`.
4. Se for protegido e o modo automático estiver habilitado, chama `ensureProtectedGrant()`.
5. Se receber grant, repete a requisição com `X-Protected-Grant`.
6. Se ainda existir erro protegido após o retry, limpa o cache daquele módulo.
7. Se a chamada for autenticada e não houver `skipSessionGuard`, avalia erro de sessão.
8. Se detectar 401/403 ou estado correlato, aciona o tratamento de sessão.
9. Retorna `{ res, data }` ao chamador.

## 7. Construção de headers

### Headers base

- Se `auth=true`, o header `Authorization` é montado com `Bearer <token>`.
- Se `options.headers` existir, ele é mesclado por cima do header base.
- Se o corpo é JSON e não existe `Content-Type`, o helper injeta `application/json`.

### Implicação documental

O backend depende desse formato para aceitar chamadas autenticadas. Se esse contrato mudar, o sistema inteiro pode perder acesso.

## 8. Regras de Authorization/Bearer

- O Bearer token sai de `getToken()`.
- O token está salvo em `localStorage` com a chave `brana_token`.
- O header é aplicado somente quando a chamada é declarada como autenticada.
- `TrialMiddleware` no backend também espera `Authorization: Bearer ...` em rotas protegidas.

Esse é um contrato transversal entre frontend e backend.

## 9. Regras de X-Protected-Grant

- O grant protegido é aplicado somente no retry após erro protegido.
- O header usado é `X-Protected-Grant`.
- O valor vem de `ensureProtectedGrant()` e do cache de grants por módulo.
- O cache aceita chave global `*` e uma exceção de reaproveitamento de `configuracao` para `usuarios`.

O fluxo existe para evitar repetir senha do administrador em cada operação protegida.

## 10. Tratamento de body, JSON, text, blob, raw e FormData

### `rawBody`

- Se `options.rawBody` existe, o corpo é enviado cru.
- Isso é usado para `FormData` e outros formatos fora do JSON simples.

### `responseType`

Os modos identificados são:

- `raw`: não tenta parsear a resposta e retorna `data = null`
- `blob`: tenta `res.blob()` em sucesso; em erro, tenta JSON e cai para texto se necessário
- `text`: tenta `res.text()`
- padrão `json`: tenta `res.json()` e, em falha, retorna `{}`

### FormData

`requestJson()` aceita `rawBody` com `FormData` em fluxos como:

- preparo de PDF no editor de textos
- envio de e-mail com arquivo anexado
- outras chamadas que precisam escapar do JSON simples

## 11. Tratamento de respostas de sucesso

- Se a resposta é bem-sucedida, o retorno padrão é `{ res, data }`.
- Em `blob`, o `data` pode ser um `Blob`.
- Em `text`, o `data` pode ser string.
- Em `raw`, `data` é `null`.
- Em JSON, `data` tende a ser objeto/array decodificado.

Esse contrato é importante porque o frontend usa o mesmo helper para leitura de listas, gravação, exportação e abertura de arquivo.

## 12. Respostas sem corpo ou fora do JSON simples

- Em JSON, se `res.json()` falhar, o helper devolve `{}`.
- Em `blob`, se a resposta falhar e não houver JSON, tenta extrair texto e embrulha em `detail`.
- Em `text`, se falhar, retorna string vazia.
- Em `raw`, não há parsing adicional.

Isso evita quebra imediata do frontend, mas também pode mascarar divergências de contrato se o backend mudar silenciosamente.

## 13. Tratamento de erros HTTP

- `requestJson()` trabalha com o objeto `res` retornado por `fetch`.
- O helper não lança erro apenas porque `res.ok` é falso; ele devolve o resultado ao chamador.
- Em caso de erro protegido, o fluxo é especial e tenta desbloqueio.
- Em caso de erro de sessão, o fluxo é desviado para o guardião de sessão.

## 14. Tratamento de 401, 403 e sessão expirada

### 401

- `parseSessionIssue()` transforma `401` em `unauthorized`.
- A mensagem padrão aponta para sessão expirada e novo login.

### 403

- `parseSessionIssue()` interpreta `403` de forma semântica.
- Pode virar `setup_required`, `license_expired` ou `account_suspended` dependendo do texto do backend.
- `parseProtectedError()` também usa `403`, mas com formato específico de erro protegido.

### Sessão expirada

- `requestJson()` chama o tratamento de sessão apenas quando `auth=true` e `skipSessionGuard` não está ativo.
- O tratamento pode esconder login, abrir setup ou manter a tela bloqueada, conforme o tipo do problema.

## 15. Fluxo do erro protegido e retry

1. O backend responde `403` com `detail.error = protected_password_required`.
2. `parseProtectedError()` reconhece o erro.
3. `requestJson()` chama `ensureProtectedGrant()` com o módulo e a mensagem.
4. O usuário informa a senha do administrador.
5. `unlockProtectedGrant()` faz `POST /auth/protected/unlock`.
6. O backend devolve `grant_token`.
7. `requestJson()` repete a mesma chamada original com `X-Protected-Grant`.
8. Se o erro persistir, o grant daquele módulo é removido do cache.

## 16. Integração com `ensureProtectedGrant()`

- `requestJson()` não abre a janela de senha diretamente; ele delega isso a `ensureProtectedGrant()`.
- A função mantém cache por módulo e evita prompts duplicados com `protectedGrantPending`.
- Há fallback de reaproveitamento entre `usuarios` e `configuracao`.
- Esse comportamento reduz fricção, mas cria acoplamento forte entre autorização, cache e módulo corrente.

## 17. Integração com `handleSessionIssue()` ou equivalentes

No código atual, o equivalente funcional é a combinação de:

- `parseSessionIssue()`
- `enforceSessionIssue()`

Esses blocos interpretam 401/403 e direcionam o frontend para login, setup, licença expirada ou conta suspensa.

## 18. Contratos implícitos exigidos do backend

O backend precisa manter estes contratos estáveis:

- autenticação via Bearer token
- `401` para sessão inválida ou ausente
- `403` com `protected_password_required` para módulos protegidos
- `403` legível para `setup_required`
- `403` legível para licença expirada ou conta suspensa
- `grant_token` válido em `/auth/protected/unlock`
- payload de `/me` compatível com o estado esperado pelo frontend
- resposta JSON legível quando a chamada não é de `blob`/`text`/`raw`

## 19. Pontos mais frágeis

1. Alterar `responseType` ou seus valores aceitos.
2. Mudar o formato de `403` protegido.
3. Mudar o nome do header `X-Protected-Grant`.
4. Alterar a regra de cache de grant por módulo.
5. Trocar o formato de `/auth/protected/unlock`.
6. Fazer o backend passar a responder texto onde hoje responde JSON.
7. Remover o fallback de `detail` em erros de blob.
8. Mudar o comportamento de `skipSessionGuard` ou `skipProtectedAutoUnlock`.

## 20. Riscos críticos

- Quebrar todo o tráfego autenticado se `Authorization` ou `Bearer` mudar.
- Romper o desbloqueio protegido e travar módulos administrativos.
- Fazer o retry entrar em loop ou parar de retryar quando deveria.
- Fazer o frontend tratar uma sessão válida como expirada.
- Quebrar exportação/download porque `blob` e `rawBody` deixariam de ser respeitados.
- Ocultar erros reais convertendo tudo em `{}` ou string vazia sem contexto.

## 21. O que não deve ser modularizado ainda

Não modularizar ainda:

- `requestJsonBase()` como transporte central
- `requestJson()` como orquestrador de retry e sessão
- `ensureProtectedGrant()` e cache de grant protegido
- `parseProtectedError()` e `parseSessionIssue()`
- `enforceSessionIssue()`
- qualquer contrato com `Authorization`, `X-Protected-Grant`, `rawBody` ou `responseType`

## 22. Subtemas para auditoria fina posterior

- comparação entre `requestJsonBase()` e `requestJson()` em chamadas internas
- casos específicos de `blob` usados em exportação de arquivo
- casos específicos de `text` e `raw` se surgirem novos fluxos
- possíveis variações de contrato de `403` vindas do backend
- chamadas que usam `skipSessionGuard` ou `skipProtectedAutoUnlock`
- revisão individual dos módulos que dependem fortemente de retry protegido

## 23. Próxima etapa documental recomendada

A próxima auditoria fina recomendada é o inventário de chamadas `requestJson()` por domínio crítico, mas agora com foco em subgrupos específicos de transporte:

1. exportações/downloads em `blob`
2. formulários com `rawBody`/`FormData`
3. chamadas de sessão e retry protegido
4. chamadas de licença e administração que dependem de headers adicionais

## 24. Conclusão

`requestJson()` deve permanecer congelado até que todo o contrato de auth, grant, sessão e tratamento de formatos esteja suficientemente estabilizado. Ele é um ponto de acoplamento transversal e, por isso, não é candidato seguro a modularização imediata.
