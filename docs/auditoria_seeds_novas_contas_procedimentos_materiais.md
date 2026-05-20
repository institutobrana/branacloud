# Auditoria documental - seeds de novas contas

## Objetivo
Mapear, por leitura בלבד, quais arquivos e rotinas populam `procedimento`, `material`, `procedimento_generico` e os vinculos/composicoes relacionados quando uma nova conta/clinca e criada no Brana Cloud.

Esta auditoria nao altera codigo, nao altera banco, nao altera schemas e nao altera comportamento.

## Escopo
Inclui apenas leitura e rastreio em:
- `backend/seeds/*`
- `backend/main.py`
- `backend/routes/*`
- `backend/services/*`
- `backend/scripts/*`
- `backend/models/*`
- `backend/schemas/*` quando necessario para entender payloads
- rotinas de signup/criacao de clinica/conta
- rotinas que clonam/populam dados iniciais para nova clinica

Fora de escopo:
- alteracoes em codigo
- migrations
- inserts/updates/deletes
- execucao de scripts que alterem banco
- criacao real de conta/clinca
- limpeza textual
- refatoracao
- modularizacao
- correcao de mojibake/textos

## Blindagem textual
Segui obrigatoriamente:
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Nao foi feito ajuste de textos, acentos, labels, strings visiveis, placeholders ou mensagens.

## Comandos executados
Comandos de leitura e auditoria usados nesta etapa:
- `git status --short`
- `git branch --show-current`
- `git diff --stat`
- `Get-ChildItem -Path 'D:\BRANA ARQUIVOS\BRANA CLOUD' -Force | Select-Object Mode,LastWriteTime,Name`
- `Get-ChildItem -Recurse -File backend\seeds | Select-Object FullName`
- `Get-Content -Raw 'docs/regras_blindagem_correcoes_textuais_mojibake.md'`
- `rg -n --hidden -S "seed|procedimento|material|procedimento_generico|fase|vinculo|clinica_id|signup|criar_clinica|create_clinica|tenant|populate|bootstrap|initial" backend docs -g '!docs/*'`
- `Get-Content -Raw 'backend\main.py'`
- `Get-Content -Raw 'backend\services\signup_service.py'`
- `Get-Content -Raw 'backend\seeds\procedimentos_padrao.py'`
- `Get-Content -Raw 'backend\seeds\procedimentos_genericos.py'`
- `Get-Content -Raw 'backend\models\procedimento.py'`
- `Get-Content -Raw 'backend\models\procedimento_generico.py'`
- `Get-Content -Raw 'backend\models\material.py'`
- `Get-Content -Raw 'backend\models\procedimento_tabela.py'`
- `Get-Content -Raw 'backend\routes\auth_routes.py'`
- `Get-Content -Raw 'backend\routes\materiais_routes.py'`
- `Get-Content -Raw 'backend\routes\procedimentos_routes.py'`
- `Get-Content -Raw 'backend\routes\cadastros_routes.py'`
- `Get-Content -Raw 'backend\services\procedimentos_legado_service.py'`
- `Get-Content -Raw 'backend\services\vinculos_materiais.py'`
- `Get-Content -Raw 'backend\scripts\migrar_tabelas_procedimentos_easy.py'`
- `Get-Content -Raw 'backend\scripts\recriar_particular_easydental.py'`
- `Get-Content -Raw 'backend\scripts\migrar_materiais_instituto_brana.py'`
- `Get-Content -Raw 'backend\scripts\aplicar_compatibilidade_schema.py'`

## Arquivos analisados
Arquivos principais analisados nesta auditoria:
- `backend/main.py`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/seeds/procedimentos_genericos.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- `backend/models/material.py`
- `backend/models/procedimento_tabela.py`
- `backend/routes/auth_routes.py`
- `backend/routes/materiais_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/services/vinculos_materiais.py`
- `backend/scripts/migrar_tabelas_procedimentos_easy.py`
- `backend/scripts/recriar_particular_easydental.py`
- `backend/scripts/migrar_materiais_instituto_brana.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `backend/scripts/corrigir_tabela_exemplo_particular.py`
- `backend/scripts/export_seed_modelo.py`

## Achados por tabela

### 1) `procedimento`
Arquivos que populam:
- `backend/services/signup_service.py`
  - `criar_conta_saas()` em `backend/services/signup_service.py:2200`
  - chama `seed_procedimentos(db, clinica.id)` em `backend/services/signup_service.py:2240`
  - a base de seed vem de `backend/seeds/procedimentos_padrao.py:1198`
  - a funcao interna `_upsert_procedimentos_na_clinica()` em `backend/services/signup_service.py:1184` tambem popula procedimentos quando o fluxo usa o seed hospedado/historico
  - `separar_tabela_exemplo_particular_todas_clinicas()` em `backend/services/signup_service.py:1660` regrava procedimentos e pode inserir novos registros
- `backend/seeds/procedimentos_padrao.py`
  - `seed_procedimentos()` em `backend/seeds/procedimentos_padrao.py:1198`
  - hoje esta e a fonte executada no signup
- `backend/routes/procedimentos_routes.py`
  - `criar_procedimento()` em `backend/routes/procedimentos_routes.py:1697`
  - `atualizar_procedimento()` em `backend/routes/procedimentos_routes.py:1771`
  - ao criar/editar um procedimento com `procedimento_generico_id`, chama heranca de fases/materiais em `backend/routes/procedimentos_routes.py:1763`, `:1764`, `:1840`, `:1841`
- `backend/scripts/migrar_tabelas_procedimentos_easy.py`
  - `_aplicar_tabela()` cria `Procedimento` via ORM
  - esse script e manual/backfill
- `backend/scripts/recriar_particular_easydental.py`
  - insere `procedimento` via SQL em `backend/scripts/recriar_particular_easydental.py:168`
  - e script manual/backfill
- `backend/scripts/corrigir_tabela_exemplo_particular.py`
  - chama `separar_tabela_exemplo_particular_todas_clinicas()`
  - e wrapper manual de backfill

Roda na criacao de nova conta/clinca?
- Sim, via `criar_conta_saas()` -> `seed_procedimentos()`
- Nao depende de acao manual para nova conta

Observacao importante:
- o seed atual de `procedimento` em `backend/seeds/procedimentos_padrao.py` carrega campos financeiros e operacionais completos, nao apenas nome/codigo
- o fluxo de criacao manual em `procedimentos_routes.py` tambem pode herdar campos do procedimento generico

### 2) `material`
Arquivos que populam:
- `backend/services/signup_service.py`
  - `garantir_lista_padrao_clinica()` em `backend/services/signup_service.py:1594`
  - `_upsert_materiais_na_lista()` em `backend/services/signup_service.py:1151`
  - `criar_conta_saas()` chama `garantir_lista_padrao_clinica(db, clinica.id)` em `backend/services/signup_service.py:2236`
  - a origem do seed pode vir de `_carregar_seed_materiais_hosted()` em `backend/services/signup_service.py:676`
  - ou de `_carregar_seed_materiais_clinica()` em `backend/services/signup_service.py:992` quando existe uma clinica fonte
- `backend/routes/materiais_routes.py`
  - `criar_tabela()` cria `ListaMaterial`
  - `criar_material()` em `backend/routes/materiais_routes.py:263`
  - `atualizar_material()` em `backend/routes/materiais_routes.py:298`
  - fluxo manual de cadastro/edição
- `backend/scripts/migrar_materiais_instituto_brana.py`
  - insere `material` via SQL em `backend/scripts/migrar_materiais_instituto_brana.py:545`
  - script manual/backfill

Roda na criacao de nova conta/clinca?
- Sim, via `criar_conta_saas()` -> `garantir_lista_padrao_clinica()`
- Nao depende de acao manual para nova conta

Observacao importante:
- o seed atual de materiais nao cria apenas nome/codigo; ele tambem carrega custo/preco/relacao e outros campos opcionais do snapshot de origem

### 3) `procedimento_generico`
Arquivos que populam:
- `backend/services/signup_service.py`
  - `criar_conta_saas()` chama `seed_procedimentos_genericos(db, clinica.id)` em `backend/services/signup_service.py:2239`
  - a funcao de seed e `_carregar_seed_procedimentos_hosted_por_tabela()` em `backend/services/signup_service.py:718`
  - a fonte final executada no signup e `backend/seeds/procedimentos_genericos.py`
- `backend/seeds/procedimentos_genericos.py`
  - `seed_procedimentos_genericos()` em `backend/seeds/procedimentos_genericos.py:7102`
- `backend/routes/cadastros_routes.py`
  - `criar_procedimento_generico()` em `backend/routes/cadastros_routes.py:2273`
  - `editar_procedimento_generico()` em `backend/routes/cadastros_routes.py:2321`
  - `migrar_procedimentos_genericos()` em `backend/routes/cadastros_routes.py:2191`
  - esses endpoints tambem sincronizam fases e materiais
- `backend/services/procedimentos_legado_service.py`
  - harmonizacao/copia de genericos em `backend/services/procedimentos_legado_service.py:694` e `:730`
  - manual/backfill

Roda na criacao de nova conta/clinca?
- Sim, via `criar_conta_saas()` -> `seed_procedimentos_genericos()`

Observacao importante:
- o seed atual de genericos tambem carrega `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `mostrar_simbolo`, `inativo`, `observacoes` e datas
- os novos genericos nao nascem vazios em termos de metadados

### 4) Vinculos, fases e composicao
Arquivos e rotinas relevantes:
- `backend/services/signup_service.py`
  - `_upsert_procedimentos_na_clinica()` em `backend/services/signup_service.py:1184`
  - cria/atualiza `ProcedimentoMaterial` com base em `seed["links"]`
  - `garantir_procedimentos_padrao_clinica()` em `backend/services/signup_service.py:1617` tambem pode criar procedimentos com links quando usada
  - `_upsert_procedimentos_particular_na_clinica()` em `backend/services/signup_service.py:1274` pode ligar `procedimento_generico_id` e copiar campos para procedimentos da tabela particular
- `backend/routes/procedimentos_routes.py`
  - `_aplicar_heranca_procedimento_generico()` em `backend/routes/procedimentos_routes.py:535`
  - cria `ProcedimentoFase` a partir de `ProcedimentoGenericoFase`
  - pode copiar `ProcedimentoMaterial` a partir de `ProcedimentoGenericoMaterial`
  - `criar_procedimento()` em `backend/routes/procedimentos_routes.py:1697`
  - `atualizar_procedimento()` em `backend/routes/procedimentos_routes.py:1771`
  - `vincular_material()` em `backend/routes/procedimentos_routes.py:1868`
  - `desvincular_por_codigo()` em `backend/routes/procedimentos_routes.py:1947`
- `backend/routes/cadastros_routes.py`
  - `_sync_procedimento_generico_fases()` em `backend/routes/cadastros_routes.py:436`
  - `_sync_procedimento_generico_materiais()` em `backend/routes/cadastros_routes.py:468`
  - `criar_procedimento_generico()` e `editar_procedimento_generico()` sempre sincronizam fases/materiais enviados no payload
- `backend/services/procedimentos_legado_service.py`
  - copia `ProcedimentoGenericoFase` e `ProcedimentoGenericoMaterial` quando harmoniza genericos canonicos
- `backend/scripts/migrar_tabelas_procedimentos_easy.py`
  - remove `ProcedimentoMaterial` existente antes de recriar procedimentos da tabela destino
- `backend/scripts/recriar_particular_easydental.py`
  - reconstroi procedimentos particulares, mas nao recria vinculos/fases nesta leitura

## Colunas obrigatorias, defaults, nullable e FKs

### `procedimento`
Base:
- arquivo: `backend/models/procedimento.py:8`
- unique constraint: `uq_procedimento_clinica_tabela_codigo` em `backend/models/procedimento.py:9`

Colunas:
- `id` - PK
- `codigo` - obrigatoria, sem nullable
- `nome` - obrigatoria, sem nullable
- `tempo` - default `0`
- `preco` - default `0`
- `custo` - default `0`
- `custo_lab` - default `0`
- `lucro_hora` - default `0`
- `tabela_id` - obrigatoria, default `1`, FK lida no codigo como indice de tabela
- `especialidade` - nullable
- `procedimento_generico_id` - nullable, FK `procedimento_generico.id`
- `simbolo_grafico` - nullable
- `simbolo_grafico_legacy_id` - nullable
- `mostrar_simbolo` - obrigatoria, default `False`
- `garantia_meses` - default `0`
- `forma_cobranca` - nullable
- `valor_repasse` - default `0`
- `preferido` - obrigatoria, default `False`
- `inativo` - obrigatoria, default `False`
- `observacoes` - nullable
- `data_inclusao` - nullable
- `data_alteracao` - nullable
- `clinica_id` - obrigatoria, FK `clinicas.id`

### `procedimento_material`
Base:
- arquivo: `backend/models/procedimento.py:51`

Colunas:
- `id` - PK
- `procedimento_id` - obrigatoria, FK `procedimento.id` com `ondelete=CASCADE`
- `material_id` - obrigatoria, FK `material.id` com `ondelete=CASCADE`
- `quantidade` - default `1`
- `clinica_id` - obrigatoria, FK `clinicas.id`

### `procedimento_fase`
Base:
- arquivo: `backend/models/procedimento.py:65`

Colunas:
- `id` - PK
- `procedimento_id` - obrigatoria, FK `procedimento.id` com `ondelete=CASCADE`
- `clinica_id` - obrigatoria, FK `clinicas.id`
- `codigo` - nullable
- `descricao` - obrigatoria
- `sequencia` - obrigatoria, default `1`
- `tempo` - obrigatoria, default `0`

### `procedimento_generico`
Base:
- arquivo: `backend/models/procedimento_generico.py:8`
- unique constraint: `uq_procedimento_generico_clinica_codigo` em `backend/models/procedimento_generico.py:9`

Colunas:
- `id` - PK
- `clinica_id` - obrigatoria, FK `clinicas.id`
- `codigo` - obrigatoria
- `descricao` - obrigatoria
- `especialidade` - nullable
- `tempo` - obrigatoria, default `0`
- `custo_lab` - obrigatoria, default `0`
- `peso` - obrigatoria, default `0`
- `simbolo_grafico` - nullable
- `mostrar_simbolo` - obrigatoria, default `False`
- `inativo` - obrigatoria, default `False`
- `observacoes` - nullable
- `data_inclusao` - nullable
- `data_alteracao` - nullable

### `procedimento_generico_fase`
Base:
- arquivo: `backend/models/procedimento_generico.py:44`

Colunas:
- `id` - PK
- `procedimento_generico_id` - obrigatoria, FK `procedimento_generico.id` com `ondelete=CASCADE`
- `clinica_id` - obrigatoria, FK `clinicas.id`
- `codigo` - nullable
- `descricao` - obrigatoria
- `sequencia` - obrigatoria, default `1`
- `tempo` - obrigatoria, default `0`

### `procedimento_generico_material`
Base:
- arquivo: `backend/models/procedimento_generico.py:64`

Colunas:
- `id` - PK
- `procedimento_generico_id` - obrigatoria, FK `procedimento_generico.id` com `ondelete=CASCADE`
- `material_id` - obrigatoria, FK `material.id` com `ondelete=CASCADE`
- `quantidade` - obrigatoria, default `1`
- `clinica_id` - obrigatoria, FK `clinicas.id`

### `material`
Base:
- arquivo: `backend/models/material.py:27`
- unique constraint: `uq_material_lista_codigo` em `backend/models/material.py:28`

Colunas:
- `id` - PK
- `codigo` - obrigatoria
- `nome` - obrigatoria
- `relacao` - default `0`
- `custo` - default `0`
- `preco` - default `0`
- `unidade_compra` - nullable, default `""`
- `unidade_consumo` - nullable, default `""`
- `validade_dias` - obrigatoria, default `0`
- `preferido` - obrigatoria, default `False`
- `classificacao` - nullable, default `""`
- `lista_id` - obrigatoria, FK `lista_material.id` com `ondelete=CASCADE`

### `lista_material`
Base:
- arquivo: `backend/models/material.py:8`
- unique constraint: `uq_lista_material_clinica_nome` em `backend/models/material.py:9`

Colunas:
- `id` - PK
- `nome` - obrigatoria
- `nro_indice` - obrigatoria, default `255`
- `clinica_id` - obrigatoria, FK `clinicas.id`

### `procedimento_tabela`
Base:
- arquivo: `backend/models/procedimento_tabela.py:8`
- unique constraint: `uq_proc_tabela_clinica_codigo` em `backend/models/procedimento_tabela.py:9`

Colunas:
- `id` - PK
- `clinica_id` - obrigatoria, FK `clinicas.id`
- `codigo` - obrigatoria
- `nome` - obrigatoria
- `nro_indice` - obrigatoria, default `255`
- `fonte_pagadora` - obrigatoria, default `"particular"`
- `nro_credenciamento` - nullable
- `inativo` - obrigatoria, default `False`
- `tipo_tiss_id` - obrigatoria, FK `tiss_tipo_tabela.id`, default `1`

## Campos que podem ser zerados ou deixados nulos com seguranca

### `procedimento`
Pode ser zero/nulo, do ponto de vista de schema:
- `tempo = 0`
- `preco = 0`
- `custo = 0`
- `custo_lab = 0`
- `lucro_hora = 0`
- `garantia_meses = 0`
- `valor_repasse = 0`
- `mostrar_simbolo = False`
- `preferido = False`
- `inativo = False`
- `especialidade = NULL`
- `procedimento_generico_id = NULL`
- `simbolo_grafico = NULL`
- `simbolo_grafico_legacy_id = NULL`
- `forma_cobranca = NULL`
- `observacoes = NULL`
- `data_inclusao = NULL`
- `data_alteracao = NULL`

Nao pode ser removido:
- `codigo`
- `nome`
- `tabela_id`
- `clinica_id`

### `material`
Pode ser zero/nulo:
- `relacao = 0`
- `custo = 0`
- `preco = 0`
- `validade_dias = 0`
- `preferido = False`
- `unidade_compra = ""` ou `NULL`
- `unidade_consumo = ""` ou `NULL`
- `classificacao = ""` ou `NULL`

Nao pode ser removido:
- `codigo`
- `nome`
- `lista_id`

### `procedimento_generico`
Pode ser zero/nulo:
- `tempo = 0`
- `custo_lab = 0`
- `peso = 0`
- `mostrar_simbolo = False`
- `inativo = False`
- `especialidade = NULL`
- `simbolo_grafico = NULL`
- `observacoes = NULL`
- `data_inclusao = NULL`
- `data_alteracao = NULL`

Nao pode ser removido:
- `codigo`
- `descricao`
- `clinica_id`

### Tabelas de vinculo/composicao/fase
Pode ficar vazio:
- `procedimento_material` sem linhas
- `procedimento_fase` sem linhas
- `procedimento_generico_material` sem linhas
- `procedimento_generico_fase` sem linhas

Se houver linha:
- `procedimento_id`, `material_id`, `procedimento_generico_id`, `clinica_id` nao podem ser nulos
- `descricao` nao pode ser nula em tabelas de fase
- `quantidade` tem default, mas o codigo atual espera valor positivo quando cria/edita

## Campos que nao podem ser removidos ou zerados sem risco

### `procedimento`
Risco alto se remover/zerar:
- `codigo` e `nome` sao usados em listagem, edicao, filtros e chaves unicas
- `tabela_id` e `clinica_id` sao obrigatorios por FK e por filtros de API
- `preco`, `custo`, `custo_lab`, `valor_repasse` e `tempo` sao usados em calculos e relatorios em `backend/routes/procedimentos_routes.py`
- `procedimento_generico_id` pode ser nulo, mas quando presente aciona heranca de fases/materiais e sincronizacao de campos em `backend/routes/procedimentos_routes.py:535` e `:627`
- `mostrar_simbolo`, `simbolo_grafico` e `simbolo_grafico_legacy_id` afetam exibicao
- `forma_cobranca` e `garantia_meses` aparecem em respostas e edicao

### `material`
Risco alto se remover/zerar:
- `codigo`, `nome`, `lista_id`
- `custo` e `preco` entram em calculos de custo material e exibicao
- `relacao` e `classificacao` aparecem em listagem/edicao de materiais

### `procedimento_generico`
Risco alto se remover/zerar:
- `codigo` e `descricao`
- `clinica_id` por segregacao tenant
- `tempo` e `custo_lab` sao propagados para procedimentos por `backend/routes/procedimentos_routes.py:535` e `:627`
- `mostrar_simbolo` e `simbolo_grafico` afetam exibicao

### Vinculos e fases
Risco alto se remover:
- qualquer `procedimento_id`, `material_id`, `procedimento_generico_id`, `clinica_id`
- `descricao` de fases

Motivo:
- FKs/constraints quebram
- o frontend e as rotas dependem desses dados para listar, editar e calcular custos
- o relatorio de procedimentos usa custo de materiais e custo de genericos

## Riscos identificados
1. O signup atual nao cria apenas nomes/codigos: o seed de `procedimento`, `material` e `procedimento_generico` leva valores extras do modelo/origem.
2. Se a futura limpeza for feita so nos seeds, ainda restara heranca/sincronizacao em `procedimentos_routes.py` e `cadastros_routes.py`.
3. `backend/routes/procedimentos_routes.py` pode copiar fases e materiais do generico ao criar/editar procedimento.
4. `backend/routes/cadastros_routes.py` sempre persiste fases e materiais enviados no payload do procedimento generico.
5. `backend/services/procedimentos_legado_service.py` tem rotinas de harmonizacao que podem reintroduzir fases e materiais.
6. Scripts manuais de migracao e reparo continuam capazes de repopular dados financeiros/composicao se forem executados fora do fluxo de signup.

## Plano exato de alteracao futura
Plano conservador e em subetapas pequenas:

### Subetapa A - ajustar seeds de procedimento
- reduzir `backend/seeds/procedimentos_padrao.py` para manter apenas `codigo` e `nome` no seed de novas contas
- revisar `backend/services/signup_service.py` para garantir que o fluxo de signup nao reintroduza preco, custo, lucro, tempo, simbolo ou campos auxiliares
- manter `tabela_id`, `clinica_id` e demais campos obrigatorios no minimo necessario para persistir

### Subetapa B - ajustar seeds de material
- reduzir o seed de materiais carregado por `backend/services/signup_service.py` para manter apenas `codigo` e `nome`
- manter `lista_id` e `clinica_id` por obrigacao de schema
- zerar/omitir custo, preco, relacao, unidade e classificacao quando possivel

### Subetapa C - ajustar seeds de procedimento_generico
- reduzir `backend/seeds/procedimentos_genericos.py` para manter apenas `codigo` e `descricao`
- remover do seed os campos de tempo, custo_lab, peso, simbolo e observacoes, salvo o minimo necessario para schema
- manter `clinica_id`

### Subetapa D - impedir criacao automatica de vinculos/fases/composicoes
- revisar `backend/routes/procedimentos_routes.py` para nao herdar fases/material automaticamente ao criar novo procedimento
- revisar `backend/routes/cadastros_routes.py` para nao aceitar seed automatico de fases e materiais como padrao de nova conta
- revisar `backend/services/procedimentos_legado_service.py` para nao repovoar dados sensiveis em harmonizacoes de rotina
- revisar scripts manuais para garantir que eles nao sejam usados no signup ou bootstrap de novas contas

### Subetapa E - testes controlados
- testar em ambiente isolado com uma nova clinica
- comparar os registros antes/depois
- validar que novos cadastros nascem apenas com o minimo de identificacao

## Classificacao da alteracao futura
Classificacao: `complexa`

Justificativa tecnica:
- ha varios pontos de escrita para as mesmas tabelas
- parte do comportamento esta no signup, parte em rotas de edicao e parte em scripts manuais/backfill
- existe heranca de campos entre `procedimento_generico` e `procedimento`
- ha calculos de custo/relatorio que assumem a existencia desses campos
- qualquer ajuste precisa ser feito com cuidado para nao quebrar listagem, edicao e relatorios

## Onde testar antes de qualquer commit futuro
Teste minimo recomendado em ambiente controlado:
1. Criar uma nova conta/clinca de teste, se existir ambiente seguro para isso
2. Abrir `Procedimentos`
3. Abrir `Materiais`
4. Abrir `Procedimentos Genericos`
5. Confirmar que os cadastros aparecem apenas com `nome` e `codigo` quando aplicavel
6. Confirmar que precos, custos, margens, lucro, tempo, quantidade, composicao, fases e vinculos nao vieram preenchidos
7. Editar manualmente um procedimento
8. Editar manualmente um material
9. Salvar e reabrir
10. Verificar console do navegador e logs do backend sem erros

Pontos tecnicos para checagem:
- `backend/routes/procedimentos_routes.py`
- `backend/routes/materiais_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/services/signup_service.py`
- resposta de `GET /procedimentos`
- resposta de `GET /materiais`
- resposta de `GET /procedimentos-genericos`

## Confirmacoes finais
- Documento criado: `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- Somente este documento foi criado/modificado nesta etapa
- Nenhum codigo foi alterado
- `backend/seeds` nao foi alterado
- `backend/main.py` nao foi alterado
- `backend/routes` nao foi alterado
- `backend/services` nao foi alterado
- `backend/models` nao foi alterado
- `backend/schemas` nao foi alterado
- Banco, schema, migrations e endpoints nao foram alterados
- Nao houve INSERT, UPDATE, DELETE ou execucao de script que altere banco
- Nenhuma conta/clinca real foi criada
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules` nao foi alterado
- Nenhuma pasta proibida foi tocada
- A blindagem textual/mojibake foi respeitada
