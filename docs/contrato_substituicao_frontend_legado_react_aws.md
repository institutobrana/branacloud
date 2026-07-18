# Contrato de substituicao gradual do frontend legado pelo React na AWS

## Objetivo

Este contrato define a etapa local de preparacao para tornar o frontend React a interface principal do Brana Cloude, mantendo o frontend legado disponivel como contingencia temporaria.

Esta etapa nao publica imagem na AWS, nao altera DNS, nao altera certificado, nao altera banco de dados e nao remove fisicamente o frontend legado.

## Estado anterior

- `/` redirecionava para `/app`.
- `/app` servia o frontend legado.
- `/frontend/` servia os arquivos estaticos do frontend legado.
- `/legado` servia o frontend legado como alias temporario.
- `/react` servia o novo frontend React em rota paralela.
- As APIs permaneciam em `/api` por alias de prefixo, sem fallback para HTML.

## Estado novo esperado

- `/` redireciona com `307` relativo para `/app`.
- `/app` serve o frontend React.
- `/app/` serve o frontend React.
- `/app/...` usa fallback SPA do React.
- `/legado` serve o frontend legado temporario.
- `/legado/` serve o frontend legado temporario.
- `/legado/...` usa fallback SPA do legado.
- `/frontend/` permanece disponivel para scripts e assets absolutos do legado.
- `/react` redireciona com `307` relativo para `/app`.
- `/react/` redireciona com `307` relativo para `/app`.
- `/react/...` redireciona com `307` relativo para o caminho equivalente em `/app/...`.
- Query strings nos redirects de `/react` sao preservadas.

## API

- As APIs continuam em `/api`.
- O alias `/api` continua removendo o prefixo antes de entregar a chamada aos routers internos.
- Rotas de API nao podem ser interceptadas pelo fallback SPA.
- Respostas de API nao devem retornar HTML do React indevidamente.

## Frontend legado

O frontend legado nao deve ser removido fisicamente nesta etapa.

`/frontend/` deve permanecer porque o legado referencia scripts e assets absolutos como `/frontend/app.js`.

Alguns redirects internos historicos do legado podem continuar apontando para `/app`. Apos o corte, esses redirects levarao ao React. Essa limitacao e aceita nesta etapa e deve ser tratada separadamente se o legado precisar operar por longo prazo em `/legado`.

## Build React

O build React deve ser deterministico para a nova base principal:

- Vite com `base: '/app/'`.
- `frontend-react/dist/index.html` deve referenciar `/app/assets/`.
- `frontend-react/dist` nao deve conter referencias a `/react/assets/`.
- `frontend-react/dist` nao deve conter chamadas para `localhost`, `127.0.0.1` ou `http://localhost` em artefatos publicados.

## Middleware de trial

As rotas publicas de frontend devem ser liberadas com verificacao exata de base e separador:

- `/app` e `/app/*`.
- `/legado` e `/legado/*`.
- `/frontend` e `/frontend/*`.
- `/react` e `/react/*`, apenas para permitir redirect.
- `/desktop-assets` e `/desktop-assets/*`.

Nao usar prefixos genericos que liberem caminhos indesejados, como `path.startswith("/app")` sem validar separador.

## Testes obrigatorios

Backend:

- `/` retorna `307` para `/app`.
- `/app`, `/app/`, `/app/login` e rotas internas autenticadas retornam HTML React.
- Assets reais em `/app/assets/` retornam `200` com `Content-Type` correto.
- Asset inexistente em `/app/assets/` retorna `404` sem HTML React.
- `/legado`, `/legado/` e `/frontend/` retornam HTML legado.
- `/react`, `/react/` e `/react/...` retornam `307` para `/app`.
- Query string de `/react` e preservada.
- `/health` retorna `200`.
- `/api/me` sem token retorna `401` JSON.
- `/api/auth/renew` sem token retorna `401` JSON.
- `/api/rota-inexistente` nao retorna HTML React.

Node:

- `getAppBasePath('/app')` retorna `/app`.
- `getAppBasePath('/app/')` retorna `/app`.
- `getAppBasePath('/app/login')` retorna `/app`.
- `getAppBasePath('/app/tabelas/procedimentos')` retorna `/app`.
- `appPath('/login', '/app')` retorna `/app/login`.
- `appPath('/tabelas/procedimentos', '/app')` retorna `/app/tabelas/procedimentos`.
- Os helpers nao devem gerar `/app/app/...` nem `/react/...` para navegacao principal.

## Publicacao futura

A publicacao futura deve ocorrer em rodada separada, com:

- commit local validado;
- build Docker limpo;
- push normal do commit;
- build e push ECR;
- nova task definition ECS;
- update do servico ECS;
- validacao HTTP publica;
- validacao manual segura de login quando necessario.

## Rollback

Enquanto a troca definitiva nao for publicada, a task definition atual de rollback para o ambiente AWS e:

```text
default-brana-hml-backend:7
```

Essa revisao preserva `/app` como legado e `/react` como React em rota paralela.

## Proibicoes desta etapa

- Nao publicar no ECR.
- Nao atualizar ECS.
- Nao alterar DNS ou certificado.
- Nao alterar RDS.
- Nao alterar migrations.
- Nao alterar schema, tabelas ou dados.
- Nao remover `/frontend/`.
- Nao remover fisicamente o frontend legado.
- Nao commitar secrets, dumps, logs ou dados reais.
