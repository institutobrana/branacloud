# Contrato de Persistencia - Novo Simbolo Grafico

## Resultado da auditoria
APROVADA COM RESSALVAS

## Escopo
Auditoria de leitura do contrato de persistencia do simbolo selecionado no fluxo `Configuracoes -> Simbolos graficos -> Novo`, com foco exclusivo no que o frontend legado, o backend e os dados existentes comprovam sobre os campos futuros do payload.

## Evidencias lidas
- [backend/routes/cadastros_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/cadastros_routes.py)
- [backend/models/simbolo_grafico.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/models/simbolo_grafico.py)
- [backend/services/simbolos_service.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/services/simbolos_service.py)
- [backend/services/signup_service.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/services/signup_service.py)
- [backend/services/schema_deployment/compatibility.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/services/schema_deployment/compatibility.py)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)
- [frontend/js/modules/simbolos-graficos.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/js/modules/simbolos-graficos.js)
- [frontend/mock_simbolo_editor.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/mock_simbolo_editor.html)
- [docs/contrato_funcional_modal_novo_simbolo_grafico_react.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/contrato_funcional_modal_novo_simbolo_grafico_react.md)
- [docs/auditoria_fluxo_novo_simbolo_grafico_brana_legado.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_fluxo_novo_simbolo_grafico_brana_legado.md)
- [docs/comparativo_fluxo_novo_simbolo_grafico.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/comparativo_fluxo_novo_simbolo_grafico.md)

## Schema do backend

### Tabela
- `simbolo_grafico_catalogo`

### Campos do model
| Campo | Tipo no payload | Tipo no model | Obrigatório | Default | Tratamento |
|---|---|---|---:|---|---|
| descricao | `str` | `String(120)` | sim | nenhum | `trim`; rejeita vazio; no `POST` o backend corta em 120 caracteres |
| legacy_id | `int | None` | `Integer | null` | nao | `None` | bloqueia recriacao manual de simbolos oficiais |
| codigo | `str | None` | `String(30)` | sim no `POST`; opcional no `PUT` | derivado de `codigo` ou `icone` ou `bitmap1` | em criacao, o backend usa `codigo` e cai em `icone`/`bitmap1` se faltarem |
| especialidade | `int | None` | `Integer | null` | nao | `None` | preservado como inteiro quando enviado |
| tipo_simbolo | `int | None` | `Integer | null` | sim no contrato funcional; o backend fixa `2` na criacao de usuario | `2` para novo simbolo de usuario | `1` = sistema; `2` = usuario |
| tipo_marca | `int | None` | `Integer | null` | sim no contrato funcional | nenhum | respeita `1..6` |
| sobreposicao | `int | None` | `Integer | null` | nao | `None` | gravado somente se enviado |
| icone | `str | None` | `String(30) | null` | nao | `None` | no backend pode cair no nome do `codigo` quando omitido |
| bitmap1 | `str | None` | `String(30) | null` | nao | `None` | no backend pode cair no nome do `codigo` quando omitido |
| bitmap2 | `str | None` | `String(30) | null` | nao | `None` | opcional, sem contrato comprovado de uso distinto nesta rodada |
| bitmap3 | `str | None` | `String(30) | null` | nao | `None` | opcional, sem contrato comprovado de uso distinto nesta rodada |
| imagem_custom | `str | None` | `Text | null` | nao | `None` | recebe a imagem editada quando existe; caso contrario permanece nula |

## Fluxo legado

### Novo sem edicao manual
- O usuario escolhe um item `sim_*.bmp` na biblioteca.
- O legado usa o nome do arquivo como `codigo`.
- O legado envia `descricao`, `codigo`, `especialidade`, `tipo_simbolo`, `tipo_marca` e, quando houver, `imagem_custom`.
- Como `icone`, `bitmap1`, `bitmap2` e `bitmap3` nao sao enviados pelo frontend legado neste caminho, o backend preenche `icone` e `bitmap1` com o valor de `codigo`.
- `bitmap2` e `bitmap3` permanecem nulos.

### Novo com editor
- O usuario escolhe um item ou parte de um simbolo e abre o editor.
- O editor devolve a imagem editada por `postMessage`.
- O legado envia `imagem_custom` com a representacao editada.
- O backend continua preservando `codigo` como base do simbolo e grava `imagem_custom` como override visual.
- No React novo, `imagem_custom` so entra no payload quando a edicao existe e passa pela validacao local.

### Alteracao de simbolo existente
- Para simbolo oficial, o backend aceita alteracao restrita a descricao e especialidade.
- Para simbolo de usuario, o frontend legado envia `codigo`, `tipo_marca` e `imagem_custom` quando ha edicao.
- O payload de criacao e edicao permanece autenticado e filtrado por clinica.

## Dados existentes

### Padroes observados
- O seed oficial em `backend/services/simbolos_service.py` usa `legacy_id`, `codigo`, `icone` e `bitmap1` com o mesmo nome de arquivo para simbolos base.
- O mesmo seed grava `bitmap2 = None`, `bitmap3 = None` e `imagem_custom = None` para os simbolos base.
- A listagem do backend resolve `imagem_url` dando prioridade a `imagem_custom` e, sem ela, a `icone`/`bitmap1`/`bitmap2`/`bitmap3`.

### Excecoes observadas
- Registros oficiais possuem `legacy_id > 0`.
- Registros do usuario usam `legacy_id = None`.
- O backend impede recriar manualmente um simbolo oficial quando `legacy_id` aponta para catalogo oficial.

## Campos de imagem

| Campo | Formato real | Exemplo sanitizado | Quem produz | Quem consome |
|---|---|---|---|---|
| icone | nome de arquivo | `sim_default.bmp` | seed/backend, e backend de criacao como fallback de `codigo` | listagem, preview e consumidor de imagem |
| bitmap1 | nome de arquivo | `sim_default.bmp` | seed/backend, e backend de criacao como fallback de `codigo` | listagem e persistencia legada |
| bitmap2 | nulo ou nome de arquivo | `null` | backend quando houver dado legado | consumo futuro nao comprovado |
| bitmap3 | nulo ou nome de arquivo | `null` | backend quando houver dado legado | consumo futuro nao comprovado |
| imagem_custom | URL/data URI/texto de imagem | `data:image/...` ou URL do editor | editor via `postMessage` e legado ao persistir edicao | preview, listagem e persistencia |

## Bitmaps

### Referencias encontradas
- `backend/services/simbolos_service.py` trata `icone`, `bitmap1`, `bitmap2` e `bitmap3` como nomes de arquivo.
- O seed usa `bitmap1 = codigo` para o simbolo base.
- Nao foi encontrada prova de que `bitmap2` e `bitmap3` carreguem semantica distinta nesta frente.

### Significado pratico comprovado
| Campo | Referencias encontradas | Significado | Uso atual |
|---|---|---|---|
| bitmap1 | seed, listagem e criacao | bitmap principal do arquivo base | usado como fallback do simbolo |
| bitmap2 | model e listagem | campo adicional legado, sem uso distinto comprovado | preservado como opcional |
| bitmap3 | model e listagem | campo adicional legado, sem uso distinto comprovado | preservado como opcional |

## Prioridade de representacao

| Prioridade | Campo | Condicao | Consumidor |
|---:|---|---|---|
| 1 | imagem_custom | quando existe imagem editada | preview, listagem e retorno do editor |
| 2 | icone | quando nao ha imagem_custom | listagem e persistencia base |
| 3 | bitmap1 | fallback do simbolo base | listagem e persistencia base |
| 4 | bitmap2 | fallback remoto ou legado nao diferenciado | listagem, se presente |
| 5 | bitmap3 | fallback remoto ou legado nao diferenciado | listagem, se presente |

## Contrato do `sim_*.bmp`

### Decisao comprovada
- Opcao `E`: outro contrato comprovado.

### Evidencia
- O nome do arquivo `sim_*.bmp` vira o `codigo` funcional do simbolo.
- No caminho sem edicao manual, `icone` e `bitmap1` acabam persistindo esse mesmo nome por fallback do backend.
- O editor nao substitui esse contrato: ele adiciona `imagem_custom` quando existe edicao.

### Resposta objetiva
Quando o usuario seleciona `sim_exemplo.bmp`, o estado futuro comprovado e:
- `codigo = "sim_exemplo.bmp"`
- `icone = "sim_exemplo.bmp"` por fallback do backend quando nao enviado
- `bitmap1 = "sim_exemplo.bmp"` por fallback do backend quando nao enviado
- `bitmap2 = null`
- `bitmap3 = null`
- `imagem_custom = null` se nao houver edicao
- `legacy_id = null`
- `sobreposicao = null`

## Relacao com o editor
- Selecionar a biblioteca nao e suficiente por si so para gerar imagem editada.
- O editor devolve a imagem editada como texto de imagem, e o legado repassa isso em `imagem_custom`.
- O `postMessage` do editor usa mensagens `simbolo-editor-save`, `simbolo-editor-close` e `simbolo-editor-saved`.

## Relacao com `tipo_marca`
- O contrato persistido nao mostra uma variacao distinta de campos de imagem por `tipo_marca`.
- O campo continua importante para a regra funcional do simbolo, mas nao ha prova de que altere o formato dos bitmaps.

## Matriz final

| Campo do backend | Origem no modal | Novo com biblioteca | Novo com editor | Decisao |
|---|---|---|---|---|
| descricao | Nome do símbolo | sim | sim | COMPROVADO |
| legacy_id | nao informado | nao | nao | OMITIR |
| codigo | nome do arquivo `sim_*.bmp` | sim | sim | COMPROVADO |
| especialidade | combo de especialidade | sim | sim | COMPROVADO |
| tipo_simbolo | radio 1/2 | sim | sim | COMPROVADO |
| tipo_marca | combo 1..6 | sim | sim | COMPROVADO |
| sobreposicao | nao definido no modal atual | nao | nao | BLOQUEADO |
| icone | fallback do backend a partir de `codigo` | sim | sim | DEFAULT DO BACKEND |
| bitmap1 | fallback do backend a partir de `codigo` | sim | sim | DEFAULT DO BACKEND |
| bitmap2 | nao utilizado nesta rodada | nao | nao | NAO UTILIZADO |
| bitmap3 | nao utilizado nesta rodada | nao | nao | NAO UTILIZADO |
| imagem_custom | editor ou vazio | nao | sim | FUTURO EDITOR |

### Regra atualizada no React novo
- Sem edicao, o payload permanece reduzido a `descricao`, `codigo`, `especialidade`, `tipo_simbolo` e `tipo_marca`.
- Com edicao valida, o front acrescenta `imagem_custom` antes do `POST`.
- Entradas invalidas bloqueiam o envio e nao alteram o modal.

## Campos bloqueados para o editor
- `sobreposicao`
- `bitmap2`
- `bitmap3`

## Riscos e lacunas
- Nao foi encontrada prova de que `bitmap2` e `bitmap3` tenham semantica operacional diferente de campos legados adicionais.
- Nao foi validado que o React novo deva persistir `icone` explicitamente; hoje o contrato do backend cobre o fallback sem isso.
- Nao foi comprovada qualquer regra adicional de `sobreposicao` no modal novo.

## Conclusao
- O contrato do simbolo selecionado esta definido o suficiente para a fase atual:
  - `codigo` e o nome do arquivo `sim_*.bmp`;
  - `icone` e `bitmap1` recebem esse mesmo valor por fallback do backend quando o frontend nao os envia;
  - `imagem_custom` continua sendo o campo do editor;
  - `bitmap2`, `bitmap3` e `sobreposicao` permanecem sem contrato funcional comprovado nesta rodada.
- A ressalva da fase anterior pode ser fechada para persistencia base do simbolo selecionado.
