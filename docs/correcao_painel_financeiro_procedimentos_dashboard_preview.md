# Correcao do Painel Financeiro de Procedimentos

## Sintoma

No frontend React publicado em `/app`, o fluxo `Tabelas -> Procedimentos -> Novo` ou `Alterar` exibia:

```text
Nao foi possivel carregar o painel financeiro.
Method Not Allowed
```

## Causa

O React chama `POST /api/procedimentos/dashboard-preview` para calcular valores ainda nao persistidos no modal. O alias `/api` preserva metodo e corpo, encaminhando para `POST /procedimentos/dashboard-preview`.

O backend publicado nao tinha essa rota. Como existia a rota dinamica `/procedimentos/{procedimento_id}`, o caminho `dashboard-preview` terminava sem metodo `POST` permitido, resultando em `405 Method Not Allowed`.

## Contrato implementado

Rota:

```text
POST /procedimentos/dashboard-preview
```

Entrada:

```text
procedimento_id: opcional
tabela_id: opcional conforme contrato do modal
procedimento_generico_id: opcional
preco: numero, padrao 0
tempo: numero inteiro, padrao 0
custo_lab: numero, padrao 0
custo: numero, padrao 0
materiais: lista de material_id, quantidade e custo_und opcional
```

Saida:

```text
itens: lista com um item financeiro
grafico: lista com um item financeiro
cenario: parametros financeiros da clinica
materiais: resumo dos materiais considerados
```

## Caracteristicas de seguranca

- A rota exige usuario autenticado.
- O router mantem permissao do modulo `procedimentos`.
- Todas as consultas usam `current_user.clinica_id`.
- `clinica_id` nao e aceito do cliente.
- Procedimento de outra clinica nao retorna dados.
- Material de outra clinica nao retorna dados.
- A rota e semanticamente somente leitura, apesar de usar `POST` para transportar o estado provisorio do modal.
- Nao executa `db.add`, `db.delete`, `db.commit`, `flush`, `INSERT`, `UPDATE` ou `DELETE`.

## Casos suportados

- Novo procedimento sem `procedimento_id`.
- Alteracao de procedimento com `procedimento_id`.
- Materiais enviados explicitamente pelo modal.
- Materiais vinculados ao procedimento existente quando o modal nao envia lista.
- Materiais herdados do procedimento generico quando aplicavel.

## Testes

Testes backend adicionados em `backend/tests/test_procedimentos_dashboard_preview.py`:

- Sem token retorna `401`.
- Preview autenticado de novo procedimento retorna `200`.
- Preview autenticado de procedimento existente da mesma clinica retorna `200`.
- Procedimento ou material de outra clinica nao vaza dados.
- Payload invalido retorna `422`.
- `POST /procedimentos/dashboard-preview` nao colide com `/procedimentos/{procedimento_id}`.
- Alias `POST /api/procedimentos/dashboard-preview` preserva metodo, corpo, status e estrutura.
- O preview nao altera quantidade de procedimentos nem vinculos.

Teste frontend adicionado em `frontend-react/tests/procedimentosDashboardPreview.test.mjs`:

- Confirma `POST`.
- Confirma URL `/api/procedimentos/dashboard-preview`.
- Confirma `Content-Type: application/json`.
- Confirma payload serializado.
- Confirma normalizacao da resposta para o hook/painel.

## Publicacao AWS em 2026-07-18

Commit funcional publicado:

```text
4e3ed24371cd081d132f8982fe33e291810868fe
fix(procedimentos): adiciona preview do painel financeiro
```

Imagem criada e enviada ao ECR:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:procedimentos-preview-4e3ed243
sha256:9b75c0d1b936d850fb2e070572715fcfa8fa55b430c762c4caf59244d9ad39f9
```

Task definition anterior, usada como rollback:

```text
default-brana-hml-backend:8
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:cc95c985a3b368a8edfff3d954564be46aa1902e31d91d5cc40bc139db63b5d4
```

Task definition nova registrada:

```text
default-brana-hml-backend:9
```

A comparacao entre `:8` e `:9` confirmou preservacao de family, execution role, network mode, CPU, memoria, runtime platform, container name, portas, environment variable names, secret names, logs, command e entrypoint. A unica mudanca funcional foi a imagem do container principal.

## Resultado do deploy AWS

O servico ECS foi atualizado temporariamente para `default-brana-hml-backend:9` e ficou estavel:

```text
desired = 1
running = 1
pending = 0
rollout = COMPLETED
```

Validacao no endpoint tecnico:

```text
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/health = 200
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/app = 200
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/legado = 200
POST /api/procedimentos/dashboard-preview sem token = 401 JSON
```

Validacao no dominio principal durante `:9`:

```text
https://app.institutobrana.com.br/health = 503 awselb/2.0
https://app.institutobrana.com.br/app = 503 awselb/2.0
https://app.institutobrana.com.br/legado = 503 awselb/2.0
```

A investigacao mostrou que a regra ALB do host `app.institutobrana.com.br` ainda apontava para o target group antigo em `draining`, enquanto o host tecnico apontava para o target group novo saudavel. Como esta rodada proibia alteracao de load balancer e exigia rollback em falha de validacao, o servico foi revertido para `default-brana-hml-backend:8`.

## Resultado apos rollback

Rollback executado:

```text
default-brana-hml-backend:8
```

Estado apos rollback:

```text
desired = 1
running = 1
pending = 0
rollout = COMPLETED
```

Validacao apos rollback:

```text
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/health = 200
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/app = 200
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/legado = 200
https://app.institutobrana.com.br/health = 200
https://app.institutobrana.com.br/app = 200
https://app.institutobrana.com.br/legado = 200
```

## Validacao funcional autenticada

Nao foi executada nesta rodada porque o deploy foi revertido antes da etapa de login e navegacao funcional no dominio principal. A rota continua validada localmente por testes automatizados e por smoke sem token na imagem, mas ainda precisa de nova publicacao coordenada com a regra ALB correta para validacao manual de `Novo` e `Alterar` no ambiente AWS.

## CloudWatch

No periodo do deploy e rollback, os logs registraram startup normal da task, politica de producao com schema bootstrap desativado e health checks `GET /health 200`. Nao foram observados `Traceback`, `Exception`, `500`, `CORS`, `localhost` ou falha de banco relacionados a esta correcao no filtro consultado.

## Banco e migrations

Nao ha alteracao de schema, banco, RDS ou migrations.
