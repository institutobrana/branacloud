# Correcao do CORS/preflight do `/me` no frontend React via proxy Vite

## Problema reportado

No teste manual do login em `http://localhost:5173/login`, o fluxo mostrava:

- `login -> 200`
- `me -> CORS error`
- `me -> 401 preflight`

## Evidencia analisada

- `POST /login` foi aceito.
- O navegador passou a falhar na validacao da sessao com `GET /me` por causa do header `Authorization`.
- O preflight `OPTIONS` do `/me` retornou `401` quando o navegador tentou falar diretamente com o backend.

## Causa provavel

O `GET /me` com `Authorization` disparava preflight no navegador, e esse caminho direto ao backend estava gerando o bloqueio de CORS/preflight durante a validacao da sessao.

## Por que o proxy Vite foi escolhido

- Resolve o problema apenas no `frontend-react`.
- Evita alterar backend, banco, migrations ou frontend legado.
- Mantem o contrato de `Authorization: Bearer <token>` sem expor token.
- Faz o navegador chamar `/api/me` e `/api/login`, enquanto o Vite encaminha internamente para o backend local.

## Arquivos alterados

- [`frontend-react/vite.config.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\vite.config.js)
- [`frontend-react/src/services/api.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\services\api.js)
- [`frontend-react/src/features/auth/authApi.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\authApi.js)
- [`frontend-react/src/features/auth/AuthProvider.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\auth\AuthProvider.jsx)

## Como testar novamente

1. Abrir `http://localhost:5173/login`.
2. Fazer login real.
3. No Network, confirmar:
   - `POST /api/login -> 200`
   - `GET /api/me -> 200`
4. Confirmar que a sessão segue para a area principal.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.

## Confirmacoes

- Backend nao foi alterado.
- Frontend legado nao foi alterado.
- Banco nao foi alterado.
- Migrations nao foram alteradas.
- Nenhuma senha ou token foi registrada.

## Riscos remanescentes

- Se o navegador ou a extensao local bloquear a rota proxy, ainda pode haver erro de rede.
- Se o backend rejeitar o token por outro motivo, o problema deixara de ser CORS e passara a ser sessao/token.

## Proximo passo recomendado

- Repetir o teste manual de login real e verificar o Network em `POST /api/login` e `GET /api/me`.
