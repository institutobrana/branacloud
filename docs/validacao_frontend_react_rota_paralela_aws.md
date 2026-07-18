# Validacao da rota paralela do frontend React na AWS

## Escopo

Publicacao concluida da rota paralela do frontend React do Brana Cloude em homologacao AWS.

- `/app` permanece como frontend legado.
- `/frontend/` permanece como frontend legado.
- `/react` entrega o frontend React em homologacao controlada.
- Nao houve troca definitiva de `/app`.
- Nao houve alteracao de banco, RDS, schema, dados ou migrations.
- Nao houve remocao do frontend legado.

## Commits publicados

- `5898b291a7a01b5f788e5903510fb79b930f48d6` - `feat(aws): publica frontend react em rota paralela`
- `a98cd390404dc97fdd539bb44acda1b7a8032af2` - `fix(aws): corrige validacao da rota paralela react`

Branch publicada:

```text
modularizacao-segura-fase-1
```

## Imagem publicada

Repositorio ECR:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend
```

Tag:

```text
react-parallel-a98cd390
```

Digest efetivo:

```text
sha256:882cd71de996e475a860cebd4d3762212bff3199f3a7cf9db693ff7d76525977
```

Imagem usada pela task:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:882cd71de996e475a860cebd4d3762212bff3199f3a7cf9db693ff7d76525977
```

Observacao sobre scan:

- O ECR retornou `UnsupportedImageTypeException` para scan classico porque a imagem foi publicada como `application/vnd.oci.image.index.v1+json`.
- A ausencia de scan classico disponivel foi registrada como limitacao do mecanismo de scan para esse tipo de manifesto.

## ECS

Conta/regiao:

```text
810204249111 / sa-east-1
```

Cluster:

```text
default
```

Servico:

```text
brana-hml-backend
```

Task definition anterior para rollback:

```text
arn:aws:ecs:sa-east-1:810204249111:task-definition/default-brana-hml-backend:6
```

Task definition atual:

```text
arn:aws:ecs:sa-east-1:810204249111:task-definition/default-brana-hml-backend:7
```

Estado final do servico:

```text
status: ACTIVE
desired: 1
running: 1
pending: 0
deployment: COMPLETED
```

Task final observada:

```text
arn:aws:ecs:sa-east-1:810204249111:task/default/759188acc42641aa9f3c7fe195e09ea6
```

Eventos relevantes:

- Deployment da task definition `:7` concluido.
- Servico atingiu steady state.
- Task anterior foi drenada e substituida pela nova task.

## Validacao HTTP publica

Endpoint:

```text
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws
```

Resultados:

| Rota | Resultado | Observacao |
| --- | --- | --- |
| `GET /health` | `200`, JSON | backend saudavel |
| `GET /app` | `200`, HTML legado | contem `/frontend/app.js` |
| `GET /frontend/` | `200`, HTML legado | contem `/frontend/app.js` |
| `GET /react` | `200`, HTML React | contem `/react/assets/` |
| `GET /react/tabelas/procedimentos` | `200`, HTML React | fallback SPA sem 404 servidor |
| `GET /react/configuracoes/plano-de-contas` | `200`, HTML React | segundo refresh/fallback interno validado |
| `GET /react/assets/index-DlBI7EQB.js` | `200`, JavaScript | asset real carregado |
| `GET /react/assets/index-593qoFQ9.css` | `200`, CSS | asset real carregado |
| `GET /react/assets/arquivo-inexistente.js` | `404` | nao retornou HTML React |
| `GET /api/rota-inexistente` | `401`, JSON | nao retornou HTML React |
| `GET /api/me` sem token | `401`, JSON | esperado sem sessao |
| `POST /api/auth/renew` sem token | `401`, JSON | esperado sem sessao |

## Validacao autenticada

Login real em `/react/login`:

```text
APROVADO manualmente pelo usuario responsavel pela homologacao no ambiente AWS.
```

Captura automatizada de sessao posterior ao login:

```text
NAO EXECUTADA.
```

Motivo:

```text
A sessao autenticada do navegador pessoal do usuario nao e compartilhada com a aba controlada pela automacao.
Essa e uma limitacao operacional da ferramenta, nao defeito da aplicacao.
```

Itens autenticados nao observados pela automacao nesta rodada:

- `GET /api/me` autenticado.
- Contexto de clinica autenticado.
- Renovacao de sessao autenticada.
- Logout autenticado.
- Novo login automatizado.
- Navegacao detalhada dos modulos protegidos.

Evidencias complementares:

- `/api/me` sem token retornou `401`, conforme esperado.
- `/api/auth/renew` sem token retornou `401`, conforme esperado.
- `/api/login` foi validado anteriormente como alias funcional equivalente a `/login`.
- O usuario homologador confirmou que o login real em `/react/login` funcionou.
- Nao foram observadas chamadas para `localhost` nos testes publicos e na tela de login automatizada.
- Nao houve erro de CORS ou erro critico observado na tela de login.

## Modulos

Os modulos autenticados abaixo nao foram revalidados pela automacao por ausencia de sessao compartilhada:

- tela inicial
- unidades de atendimento
- prestadores
- pacientes
- agenda
- tabelas auxiliares
- procedimentos
- tratamentos
- plano de contas
- cenario anual

Classificacao:

```text
Nao revalidado pela automacao por ausencia de sessao compartilhada.
O login real foi aprovado manualmente pelo usuario.
A verificacao funcional detalhada dos modulos permanece como acompanhamento de homologacao e nao bloqueia a publicacao da rota paralela.
```

## Console, rede e logs

Console/rede:

- Tela de login React sem erro critico observado.
- Nenhuma chamada para `localhost` observada nas verificacoes automatizadas realizadas.
- Nenhum erro de CORS observado nas verificacoes automatizadas realizadas.
- APIs testadas nao retornaram HTML React indevidamente.

CloudWatch:

```text
Log group: /aws/ecs/default/brana-hml-backend-f5f1
```

Busca pos-deploy por `ERROR`, `Exception`, `Traceback`, `500`, falha de banco, falha de assets, `CORS` e `localhost` nao encontrou erro critico introduzido pela nova imagem.

Os eventos retornados na busca filtrada foram trafego informativo, principalmente `GET /health` e assets estaticos com `200 OK`.

## Rollback

Rollback operacional, se necessario:

```powershell
aws ecs update-service `
  --region sa-east-1 `
  --cluster default `
  --service brana-hml-backend `
  --task-definition arn:aws:ecs:sa-east-1:810204249111:task-definition/default-brana-hml-backend:6
```

Depois aguardar estabilidade:

```powershell
aws ecs wait services-stable `
  --region sa-east-1 `
  --cluster default `
  --services brana-hml-backend
```

Nao ha rollback de banco para esta frente.

## Conclusao

A rota paralela `/react` esta publicada e homologada para uso controlado com a ressalva documentada:

```text
O login real foi validado manualmente pelo responsavel pela homologacao.
A inspecao automatizada da sessao posterior ao login nao foi possivel porque
a ferramenta nao compartilha a sessao do navegador pessoal do usuario.
```

Essa ressalva nao exige rollback e nao bloqueia o encerramento da publicacao paralela.
