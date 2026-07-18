# Validacao local da rota paralela do frontend React na AWS

## Escopo

Esta rodada consolidou localmente a publicacao paralela do frontend React do Brana Cloude.

- `/app` permanece como frontend legado.
- `/frontend/` permanece como frontend legado.
- `/react` passa a ser a rota do frontend React em homologacao.
- Nao houve troca definitiva de `/app`.
- Nao houve operacao em AWS, ECR, ECS, RDS ou banco.

## Implementacao validada

- FastAPI serve o build React em `frontend-react/dist`.
- `/react` e `/react/` entregam o `index.html` do React.
- `/react/{path:path}` aplica fallback SPA somente para rotas de navegacao.
- Arquivos estaticos inexistentes com extensao retornam `404`, evitando mascarar erro de asset como HTML.
- `/api/...` e encaminhado para as rotas backend equivalentes sem cair no fallback React.
- `TrialMiddleware` permite `/react` como frontend estatico publico, preservando autenticacao nas APIs.
- Vite usa `base: '/react/'`.
- A URL padrao da API do React permanece `/api`.

## Validacoes locais

Comandos executados:

```powershell
Set-Location 'D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react'
npm.cmd ci
npm.cmd run build
node --test tests/reactParallelRoute.test.js

Set-Location 'D:\BRANA ARQUIVOS\BRANA CLOUD'
.\.venv\Scripts\python.exe -m unittest backend.tests.test_frontend_react_parallel_routes
```

Resultados:

- `npm.cmd ci`: aprovado, 0 vulnerabilidades reportadas.
- `npm.cmd run build`: aprovado, com aviso nao bloqueante de chunk acima de 500 kB.
- Testes React da rota paralela: aprovados.
- Smoke FastAPI da rota paralela: aprovado.

O build gerou `frontend-react/dist/index.html` com assets em `/react/assets/`.

## Limitacao local

O build Docker local nao foi concluido porque o daemon Docker Desktop nao estava disponivel:

```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

Essa limitacao e externa ao codigo validado nesta rodada.

## Rollback futuro

Se a publicacao em homologacao apresentar regressao, o rollback previsto e reverter o servico ECS para a task definition anterior:

```text
default-brana-hml-backend:6
```

Nao existe rollback de banco para esta frente.
