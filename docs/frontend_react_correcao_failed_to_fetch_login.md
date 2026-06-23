# Correcao do erro Failed to fetch no login do frontend React

## Problema reportado

Ao tentar fazer login em `http://localhost:5173/login`, o frontend mostrava:

- `Failed to fetch`

## Causa encontrada

A causa ficou no lado do `frontend-react`:

- o fluxo de autenticacao usava uma base de API separada e pouco clara, em vez de centralizar a URL do backend local;
- a excecao de rede do `fetch` era propagada sem uma mensagem mais explicita para o contexto de login;
- o backend respondeu normalmente em `127.0.0.1:8000` e `localhost:8000`, e o preflight de CORS tambem respondeu com sucesso, entao o problema nao estava no backend nesta etapa.

## Arquivos analisados

- [`frontend-react/src/features/auth/authApi.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\authApi.js)
- [`frontend-react/src/features/auth/AuthProvider.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\AuthProvider.jsx)
- [`frontend-react/src/services/api.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\services\api.js)
- [`frontend-react/src/features/auth/LoginPage.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\LoginPage.jsx)
- [`frontend-react/vite.config.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\vite.config.js)

## Correcao feita

- A URL base da API foi centralizada em [`frontend-react/src/services/api.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\services\api.js).
- O backend local foi padronizado para `http://localhost:8000`.
- O `authApi.js` passou a usar essa base compartilhada.
- A falha de rede do `fetch` ganhou uma mensagem mais clara no contexto de autenticacao.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.

## Como testar manualmente

1. Abrir `http://localhost:5173/login`.
2. Informar usuario e senha reais ja existentes.
3. Confirmar que o login chama `POST /login` no backend local.
4. Confirmar que a sessao valida com `GET /me`.
5. Confirmar que a area principal abre.

## Confirmacoes

- Nenhuma senha foi registrada.
- Nenhum token foi registrado.
- O backend nao foi alterado.
- O banco nao foi alterado.
- O frontend legado nao foi alterado.

## Riscos remanescentes

- Se houver divergencia de ambiente entre `localhost` e `127.0.0.1`, um novo ajuste de URL pode ser necessario em etapa futura.
- Se o navegador ainda bloquear a chamada por alguma extensao, proxy ou politica local, isso precisara ser revalidado no proprio ambiente.

## Proximo passo recomendado

- Repetir o teste manual de login real em `http://localhost:5173/login`.
