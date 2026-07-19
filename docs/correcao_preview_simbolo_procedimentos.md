# Correcao do preview do simbolo grafico em Procedimentos

## Sintoma

No frontend React, em Tabelas -> Procedimentos -> Novo ou Alterar procedimento -> Painel de Cadastro, o preview do simbolo grafico podia exibir o icone de imagem quebrada do navegador.

Exemplo auditado:

- Simbolo: Cirurgia
- Arquivo: `int_cirur.bmp`
- URL errada reconstruida pelo React: `/assets/easy/int_cirur.bmp`
- Resultado da URL errada no dominio principal: `401`, `application/json`
- URL correta retornada pelo backend: `/desktop-assets/easy/int_cirur.bmp`
- Resultado da URL correta: `200`, `image/x-ms-bmp`

## Causa

A funcao `resolveProcedimentoSymbolPreviewCandidates(...)` descartava a URL publica valida retornada em `imagem_url` quando ela continha `/desktop-assets/easy/` e reconstruia caminhos em `/assets/...`. No dominio principal, esses caminhos nao sao o contrato publico dos assets do legado e podem cair em respostas autenticadas JSON.

## Correcao

A prioridade de candidatos passa a ser:

1. `imagem_url` publica valida fornecida pelo backend.
2. Fallback legado estavel em `/desktop-assets/easy/<arquivo>`.
3. Assets empacotados no React sob `/app/assets/...`, apenas como fallback posterior.

URLs publicas validas sao preservadas sem reescrita quando começam com:

- `/`
- `http://`
- `https://`
- `data:image/`
- `blob:`

## Fallback visual

O preview tenta os candidatos em sequencia. Se uma imagem falhar, o componente avanca para a proxima candidata. Se todas falharem ou nao houver arquivo, a tela mostra um placeholder controlado com `Sem imagem`, evitando o icone quebrado do navegador.

O texto alternativo da imagem usa o formato `Simbolo grafico: <descricao>`.

## Testes

Foram previstos e executados testes para:

- preservar `/desktop-assets/easy/int_cirur.bmp` como primeira candidata para Cirurgia;
- preservar URLs `https://`, `data:image/` e `blob:`;
- gerar fallback por `codigo` em `/desktop-assets/easy/`;
- remover duplicatas;
- ignorar campos vazios;
- nao gerar `/react/assets/`;
- nao trocar `/desktop-assets` por `/assets`;
- tentar candidatas em sequencia no componente;
- mostrar placeholder controlado.

## Escopo

Nao houve alteracao de backend, banco, migrations, RDS, ECS, ECR, DNS ou certificado.

## Publicacao futura

A publicacao AWS futura deve ser feita por novo build integrado frontend/backend, nova imagem ECR e nova revisao ECS.

O rollback futuro deve retornar para a task definition vigente no momento do deploy.

## Publicacao AWS em 2026-07-19

O commit funcional foi publicado e sincronizado:

```text
021cab6143c54c860a219a87f6deecbdd96370e0
fix(procedimentos): corrige preview do simbolo grafico
```

Snapshot limpo:

```text
commit = 021cab6143c54c860a219a87f6deecbdd96370e0
sem .git
sem frontend-react/node_modules
sem frontend-react/dist preexistente
sem .env real
sem dumps
```

O diretorio `storage/modelos/clinicas` existe no historico do commit, mas esta excluido do contexto Docker por `.dockerignore` e nao e copiado pelo Dockerfile. A imagem copia apenas `storage/modelos/base`.

Build Docker:

```text
platform = linux/amd64
imagem local = brana-cloud:procedimentos-fixes-021cab61
usuario = brana
workdir = /app/backend
```

Smoke local da imagem:

```text
GET /health = 200
GET /app = 200 React
GET /legado = 200 legado
GET /desktop-assets/easy/int_cirur.bmp = 200 image/x-ms-bmp
POST /api/procedimentos/dashboard-preview sem token = 401 JSON
bundle sem /assets/easy/int_cirur.bmp
bundle sem /react/assets/easy/int_cirur.bmp
```

Imagem publicada no ECR:

```text
810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:procedimentos-fixes-021cab61
sha256:4a38b9bb1ee665073e2348580e11cb0c339d51900e025b999cbcfa4ae273c119
```

Task definition final:

```text
default-brana-hml-backend:10
Main = 810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:4a38b9bb1ee665073e2348580e11cb0c339d51900e025b999cbcfa4ae273c119
desired = 1
running = 1
pending = 0
rollout = COMPLETED
```

Validacao HTTP em AWS:

```text
https://app.institutobrana.com.br/desktop-assets/easy/int_cirur.bmp = 200 image/x-ms-bmp
https://br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws/desktop-assets/easy/int_cirur.bmp = 200 image/x-ms-bmp
```

O endpoint de API sem token retornou `401 JSON`, confirmando que nao houve retorno indevido de HTML React:

```text
POST /api/procedimentos/dashboard-preview sem token = 401 JSON
```

## ALB e target groups

O ALB auditado foi:

```text
ecs-express-gateway-alb-cc2efd45
```

Regra do dominio:

```text
host-header = app.institutobrana.com.br
priority = 20
```

Durante o deploy para `default-brana-hml-backend:10`, a task saudavel foi registrada no target group:

```text
ecs-gateway-tg-755fef69195f7dbe3
10.20.21.97:8080 = healthy
```

A regra do dominio ainda apontava para o target group anterior em draining:

```text
ecs-gateway-tg-e9a92e7d6f31c7aaa
10.20.5.91:8080 = draining
```

Foi feito backup temporario da regra e alterada somente a action da regra do host `app.institutobrana.com.br` para o target group saudavel. Nao foram alterados DNS, certificado, listener, prioridade, condicao de host, security groups, subnets ou outros dominios.

Validacao apos ajuste:

```text
https://app.institutobrana.com.br/health = 200
https://app.institutobrana.com.br/app = 200 React
https://app.institutobrana.com.br/legado = 200 legado
sem 503
```

## Validacao visual autenticada

A validacao automatizada autenticada em `Novo` e `Alterar` nao foi executada nesta rodada por ausencia de sessao autenticada compartilhada com a automacao. A ferramenta nao solicitou, capturou ou registrou e-mail, senha, tokens, cookies, localStorage, headers de autorizacao ou payloads sensiveis.

A validacao local anterior confirmou:

```text
Cirurgia -> src inicial /desktop-assets/easy/int_cirur.bmp
naturalWidth = 24
sem chamada para /assets/easy/int_cirur.bmp
arquivo inexistente -> placeholder Sem imagem
```

A verificacao funcional autenticada em AWS permanece como acompanhamento manual de homologacao, sem bloquear a publicacao tecnica da correcao.

## CloudWatch em 2026-07-19

Log group:

```text
/aws/ecs/default/brana-hml-backend-f5f1
```

Resultado dos filtros:

```text
GET /desktop-assets/easy/int_cirur.bmp = 200 OK
405 = nao observado
500 = nao observado
ERROR = nao observado
Exception = nao observado
Traceback = nao observado
CORS = nao observado
localhost = nao observado
```

Ocorrencias filtradas por `503` eram portas de origem `503xx` em linhas `GET /health 200 OK`, nao status HTTP 503.

## Rollback

Rollback da aplicacao:

```text
default-brana-hml-backend:8
```

Rollback da regra ALB:

```text
apontar novamente a regra app.institutobrana.com.br para o target group anterior salvo no backup:
ecs-gateway-tg-e9a92e7d6f31c7aaa
```

Nao houve alteracao de backend adicional, banco, RDS, schema ou migrations nesta publicacao.
