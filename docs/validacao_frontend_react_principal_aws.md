# Validacao do frontend React como interface principal na AWS

## Resumo

Em `2026-07-18T19:16:32-03:00`, o frontend React foi publicado como interface principal do Brana Cloude no ambiente AWS de homologacao.

O frontend legado nao foi removido. Ele permanece disponivel temporariamente em `/legado` e seus assets continuam preservados em `/frontend/`.

## Commit publicado

```text
f733fbf99fde5d293097b5244ddc1c1ad8f89c49
feat(aws): define frontend react como interface principal
```

O commit foi publicado em `origin/modularizacao-segura-fase-1` antes do build AWS.

## Snapshot e build

O build definitivo foi feito a partir de snapshot limpo criado por `git archive` do commit publicado.

Snapshot usado:

```text
C:\Users\Tel\AppData\Local\Temp\brana-cloud-react-primary-f733fbf99fde5d293097b5244ddc1c1ad8f89c49
```

Confirmacoes:

- Sem `.git`.
- Sem `frontend-react/node_modules`.
- Sem `frontend-react/dist` preexistente.
- Sem `backend/.env`.
- O Dockerfile copia apenas `storage/modelos/base` e cria `storage/modelos/clinicas` vazio para runtime.

Imagem local definitiva:

```text
brana-cloud:react-primary-f733fbf9
sha256:cc95c985a3b368a8edfff3d954564be46aa1902e31d91d5cc40bc139db63b5d4
```

Caracteristicas:

- Arquitetura: `amd64`.
- Tamanho: `98198936` bytes localmente.
- Usuario final: `brana`.
- Workdir: `/app/backend`.
- `frontend-react/dist/index.html` referencia `/app/assets/`.
- Nao houve referencia critica a `/react/assets`, `localhost:8000`, `http://localhost` ou `127.0.0.1`.

## ECR

Repositorio:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend
```

Tag publicada:

```text
react-primary-f733fbf9
```

Digest publicado:

```text
sha256:cc95c985a3b368a8edfff3d954564be46aa1902e31d91d5cc40bc139db63b5d4
```

Imagem usada na task definition:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:cc95c985a3b368a8edfff3d954564be46aa1902e31d91d5cc40bc139db63b5d4
```

Scan:

- O repositorio esta com `scanOnPush=true`.
- O scan classico nao foi gerado para esta imagem.
- `start-image-scan` retornou `UnsupportedImageTypeException` porque a midia e `application/vnd.oci.image.index.v1+json`.

## ECS

Cluster:

```text
default
```

Servico:

```text
brana-hml-backend
```

Task definition anterior efetiva:

```text
arn:aws:ecs:sa-east-1:810204249111:task-definition/default-brana-hml-backend:7
```

Imagem anterior:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:882cd71de996e475a860cebd4d3762212bff3199f3a7cf9db693ff7d76525977
```

Task definition nova:

```text
arn:aws:ecs:sa-east-1:810204249111:task-definition/default-brana-hml-backend:8
```

Comparacao entre task definitions:

- A definicao nova foi gerada a partir da `:7`.
- Campos somente leitura foram removidos antes do registro.
- A comparacao mecanica ignorando `containerDefinitions[0].image` retornou igualdade.
- A unica mudanca funcional foi a imagem do container `Main`.

Configuracoes preservadas:

- Family: `default-brana-hml-backend`.
- CPU: `512`.
- Memoria: `1024`.
- Network mode: `awsvpc`.
- Requires compatibilities: `FARGATE`.
- Runtime platform: `X86_64/LINUX`.
- Execution role: `arn:aws:iam::810204249111:role/brana-hml-ecs-task-execution-role`.
- Container: `Main`.
- Porta: `8080/tcp`.
- Log group: `/aws/ecs/default/brana-hml-backend-f5f1`.
- Variaveis de ambiente preservadas por nome.
- Secrets preservados por nome: `DB_PASSWORD`, `DB_USER`, `JWT_SECRET_KEY`.

Estado apos deploy:

```text
service = ACTIVE
desired = 1
running = 1
pending = 0
rolloutState = COMPLETED
```

Task ativa:

```text
arn:aws:ecs:sa-east-1:810204249111:task/default/179247a3822b44e99a7fb20786cf3b10
```

Imagem efetivamente usada:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:cc95c985a3b368a8edfff3d954564be46aa1902e31d91d5cc40bc139db63b5d4
```

Eventos relevantes:

- Deployment `ecs-svc/1955665648443109188` concluido.
- Servico atingiu steady state.
- Task anterior foi drenada e parada.
- Nova task foi iniciada e registrada no target group.

## Smoke local da imagem definitiva

Resultado:

- `/` retornou `307` para `/app`.
- `/app` retornou React.
- `/app/login` retornou React.
- `/app/tabelas/procedimentos` retornou React.
- `/app/configuracoes/plano-de-contas` retornou React.
- `/app/assets/index-Cq7PLSKC.js` retornou `200` JavaScript.
- `/app/assets/index-593qoFQ9.css` retornou `200` CSS.
- `/app/assets/inexistente.js` retornou `404`.
- `/legado` retornou legado.
- `/frontend/` retornou legado.
- `/react` retornou `307` para `/app`.
- `/react/login` retornou `307` para `/app/login`.
- `/react/tabelas/procedimentos` retornou `307` para `/app/tabelas/procedimentos`.
- `/react/login?next=/alguma-rota` preservou query string.
- `/health` retornou `200` JSON.
- `/api/me` sem token retornou `401` JSON.
- `/api/auth/renew` sem token retornou `401` JSON.
- `/api/rota-inexistente` sem token retornou `401` JSON.

## Endpoint tecnico ECS

Base:

```text
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws
```

Resultados:

- `/` retornou `307`, `Location: /app`.
- `/app` retornou `200`, React, `text/html`.
- `/app/login` retornou `200`, React, `text/html`.
- `/app/tabelas/procedimentos` retornou `200`, React, `text/html`.
- `/app/configuracoes/plano-de-contas` retornou `200`, React, `text/html`.
- `/app/assets/index-Cq7PLSKC.js` retornou `200`, `application/javascript`.
- `/app/assets/index-593qoFQ9.css` retornou `200`, `text/css`.
- `/app/assets/inexistente.js` retornou `404`.
- `/legado` retornou `200`, legado.
- `/frontend/` retornou `200`, legado.
- `/react` retornou `307`, `Location: /app`.
- `/react/login` retornou `307`, `Location: /app/login`.
- `/health` retornou `200`, JSON.
- `/api/me` sem token retornou `401`, JSON.
- `/api/auth/renew` sem token retornou `401`, JSON.
- `/api/rota-inexistente` sem token retornou `401`, JSON.
- As APIs nao retornaram HTML React.

## Dominio principal

Base:

```text
https://app.institutobrana.com.br
```

Certificado:

- HTTPS validado por `curl` e pelo navegador sem alerta de certificado.

Resultados:

- `/` retornou `307`, `Location: /app`.
- `/app` retornou `200`, React, `text/html`.
- `/app/login` retornou `200`, React, `text/html`.
- `/app/tabelas/procedimentos` retornou `200`, React, `text/html`.
- `/app/configuracoes/plano-de-contas` retornou `200`, React, `text/html`.
- `/app/assets/index-Cq7PLSKC.js` retornou `200`, `application/javascript`.
- `/app/assets/index-593qoFQ9.css` retornou `200`, `text/css`.
- `/app/assets/inexistente.js` retornou `404`.
- `/legado` retornou `200`, legado.
- `/frontend/` retornou `200`, legado.
- `/react` retornou `307`, `Location: /app`.
- `/react/login` retornou `307`, `Location: /app/login`.
- `/health` retornou `200`, JSON.
- `/api/me` sem token retornou `401`, JSON.
- `/api/auth/renew` sem token retornou `401`, JSON.
- `/api/rota-inexistente` sem token retornou `401`, JSON.

Confirmacoes de corpo:

- `/app` contem assets `/app/assets/`.
- `/app` nao contem `/react/assets/`.
- `/app` nao contem `/frontend/app.js`.
- `/legado` contem `/frontend/app.js`.
- `/legado` nao contem `/app/assets/`.
- APIs sem token retornaram JSON e nao HTML React.

## Navegador

No navegador:

- `https://app.institutobrana.com.br/` chegou a `/app/login` com React.
- `https://app.institutobrana.com.br/app/login` abriu React.
- `https://app.institutobrana.com.br/react/login` redirecionou para `/app/login`.
- Rotas protegidas em `/app/...` carregaram React e redirecionaram para `/app/login` por ausencia de sessao compartilhada.
- Refresh direto em duas rotas protegidas nao gerou 404 de servidor nem retorno do legado; a guarda de autenticacao restaurou `/app/login`.
- Console sem erros criticos.
- Nao foram observados assets `/react/assets`.

## Autenticacao

Validacao automatizada sem token:

- `/api/me` retornou `401` JSON.
- `/api/auth/renew` retornou `401` JSON.

Validacao autenticada:

- Nao executada nesta rodada porque a automacao nao recebeu uma sessao autenticada compartilhada no dominio principal.
- Nenhuma credencial foi solicitada por texto.
- Nenhuma senha, token, cookie, `localStorage`, header `Authorization` ou payload completo de autenticacao foi capturado ou registrado.

## Modulos

Sem sessao compartilhada, os modulos protegidos foram classificados como:

```text
nao revalidado por ausencia de sessao compartilhada
```

Modulos verificados quanto ao carregamento do React e guarda de autenticacao:

- Tela inicial.
- Unidades de atendimento.
- Prestadores.
- Pacientes.
- Agenda.
- Tabelas auxiliares.
- Procedimentos.
- Tratamentos.
- Plano de contas.
- Cenario anual.

## Console, rede e CloudWatch

Console:

- Sem erro critico observado no navegador.

Rede/HTML:

- Assets usam `/app/assets`.
- Nao foram observadas referencias a `/react/assets`.
- Nao houve evidencia de chamada para `localhost:8000`.
- Nao houve erro de CORS observado.

CloudWatch:

Log group:

```text
/aws/ecs/default/brana-hml-backend-f5f1
```

Busca apos o deploy:

- `Traceback`: 0 ocorrencias.
- `ERROR`: 0 ocorrencias.
- `Exception`: 0 ocorrencias.
- `500`: 0 ocorrencias.
- `falha de banco`: 0 ocorrencias.
- `falha de autenticacao`: 0 ocorrencias.
- `falha de assets`: 0 ocorrencias.
- `CORS`: 0 ocorrencias.
- `localhost`: 0 ocorrencias.
- `/react/assets`: 0 ocorrencias em filtragem local dos eventos recentes.

Eventos recentes observados eram trafego informativo e health checks `200`.

## Problemas e ressalvas

- Scan classico do ECR indisponivel para a imagem por tipo de manifesto OCI index.
- Validacao autenticada completa nao foi automatizada por ausencia de sessao compartilhada.
- A validacao funcional detalhada dos modulos autenticados permanece como acompanhamento de homologacao.

## Rollback

Rollback principal:

```text
default-brana-hml-backend:7
```

Comando operacional:

```powershell
aws ecs update-service `
  --cluster default `
  --service brana-hml-backend `
  --task-definition default-brana-hml-backend:7 `
  --profile tel-admin `
  --region sa-east-1
```

Validacao esperada apos rollback:

- `/health = 200`.
- `/app = frontend legado`.
- `/react = frontend React em rota paralela`.

## Banco de dados

Nao houve alteracao no banco, RDS, schema, tabelas, dados ou migrations.

## Conclusao

A publicacao definitiva do frontend React como interface principal foi concluida com sucesso no ambiente AWS.

Estado publicado:

- `/app` e a interface principal React.
- `/legado` preserva o frontend legado temporariamente.
- `/frontend/` permanece disponivel para compatibilidade do legado.
- `/react` redireciona para `/app`.
- APIs permanecem em `/api` e nao sao interceptadas pelo fallback React.
