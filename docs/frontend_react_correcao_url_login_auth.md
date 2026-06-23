# Correcao da URL do login no frontend React

## Problema reportado

O login em `http://localhost:5173/login` estava exibindo:

- `Falha de conexao com o servidor de autenticacao em http://localhost:8000/.`

## Causa encontrada

A montagem da URL no `frontend-react` precisava ficar mais robusta:

- a base da API podia ser usada sem normalizacao forte;
- a mensagem de erro de conexao mencionava a raiz do servidor em vez do endpoint real;
- isso confundia o diagnostico entre raiz do host e endpoint `/login`.

O backend respondeu normalmente nos testes de `GET /me` e no `POST /login` com credenciais de teste, então o problema foi tratado apenas no `frontend-react`.

## Arquivos analisados

- [`frontend-react/src/services/api.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\services\api.js)
- [`frontend-react/src/features/auth/authApi.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\authApi.js)
- [`frontend-react/src/features/auth/AuthProvider.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\AuthProvider.jsx)
- [`frontend-react/src/features/auth/LoginPage.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\LoginPage.jsx)

## Correcao feita

- A montagem de URL foi centralizada e normalizada em [`frontend-react/src/services/api.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\services\api.js).
- `buildApiUrl('/login')` agora produz uma URL completa e consistente no formato:
  - `http://localhost:8000/login`
- O `authApi.js` passou a exibir mensagem de rede com o endpoint correto.
- Erros HTTP `400` e `401` no login passaram a ser tratados como credenciais invalidas ou login recusado, em vez de falha de conexao.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.

## Como testar manualmente

1. Abrir `http://localhost:5173/login`.
2. Informar usuario e senha reais.
3. Confirmar que o login chama `POST http://localhost:8000/login`.
4. Confirmar que respostas `400`/`401` aparecem como credenciais invalidas ou login recusado.
5. Confirmar que `GET /me` continua sendo chamado com o token salvo quando o login for aceito.

## Confirmacoes

- Nenhuma senha foi registrada.
- Nenhum token foi registrado.
- O backend nao foi alterado.
- O banco nao foi alterado.
- O frontend legado nao foi alterado.
- Migrations nao foram alteradas.

## Riscos remanescentes

- Se o ambiente local alternar entre `localhost` e `127.0.0.1`, pode haver nova necessidade de padronizacao visual, mas o join da URL agora evita barra duplicada ou raiz solta.

## Proximo passo recomendado

- Repetir o teste manual de login real em `http://localhost:5173/login`.
