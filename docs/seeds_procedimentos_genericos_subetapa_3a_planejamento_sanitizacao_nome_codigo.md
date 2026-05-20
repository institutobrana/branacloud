# Planejamento funcional - Subetapa 3A

## Objetivo

Preparar a futura sanitizacao de `procedimento_generico` no nascimento de novas contas/clinicas do Brana Cloud, sem alterar comportamento nesta etapa.

## Contratos e documentos respeitados

Este planejamento segue obrigatoriamente:

- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Regra de base assumida para a futura 3A:

- novas contas/clinicas, inclusive DEMO/trial de 7 dias, devem nascer com procedimentos genericos sanitizados;
- procedimentos genericos devem manter apenas `codigo`, `descricao`/`nome`, `clinica_id` e os campos tecnicos obrigatorios do schema;
- procedimentos genericos nao devem nascer com tempo, custo_lab, peso, simbolo, especialidade nao obrigatoria, observacoes, materiais vinculados, fases vinculadas, composicoes ou heranca automatica pronta.

## Arquivos analisados

- `backend/seeds/procedimentos_genericos.py`
- `backend/services/signup_service.py`
- `backend/routes/cadastros_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/services/procedimentos_legado_service.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/material.py`
- `backend/services/vinculos_materiais.py`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`

## Fluxo atual de criacao de procedimentos genericos em novas contas

O carregamento automatico de procedimentos genericos acontece no `signup_service` durante o nascimento da nova clinica:

- `criar_conta_saas()` chama `seed_procedimentos_genericos(db, clinica.id)`;
- esse e o unico fluxo operacional relevante para o nascimento de novas contas que foi encontrado na leitura;
- `create_conta_saas()` nao chama rotinas de fases ou vinculos de genericos no nascimento;
- os fluxos de fases e materiais de genericos aparecem depois em rotas de cadastro/edicao e em servicos legados, nao no signup da nova conta.

## Origem real dos dados de procedimentos genericos

A origem real atual vem de:

- `backend/seeds/procedimentos_genericos.py`

A leitura do arquivo mostra uma lista estatica `PROCEDIMENTOS_GENERICOS_PADRAO` e uma funcao `seed_procedimentos_genericos(db, clinica_id)` que faz o upsert desses registros.

Nao foi identificado, no fluxo de nascimento de novas contas, um seed CSV/hospedado equivalente ao caso de materiais.

## Ponto real de persistencia

O ponto real de persistencia dos procedimentos genericos e:

- `seed_procedimentos_genericos(db, clinica_id)` em `backend/seeds/procedimentos_genericos.py`

O `signup_service` apenas consome essa funcao no nascimento da conta:

- `backend/services/signup_service.py` -> `criar_conta_saas()` -> `seed_procedimentos_genericos(db, clinica.id)`

## Campos obrigatorios

Pelo schema e pela funcao de seed, os campos tecnicos que precisam permanecer sao:

- `codigo`
- `descricao`/`nome`
- `clinica_id`

No schema atual de `ProcedimentoGenerico`, os campos relevantes sao:

- `clinica_id` - `NOT NULL`, FK para `clinicas.id`
- `codigo` - `NOT NULL`
- `descricao` - `NOT NULL`
- `tempo` - `NOT NULL`, default `0`
- `custo_lab` - `NOT NULL`, default `0`
- `peso` - `NOT NULL`, default `0`
- `mostrar_simbolo` - `NOT NULL`, default `False`
- `inativo` - `NOT NULL`, default `False`
- `especialidade` - nullable
- `simbolo_grafico` - nullable
- `observacoes` - nullable
- `data_inclusao` - nullable
- `data_alteracao` - nullable
- unique constraint: `uq_procedimento_generico_clinica_codigo`

## Campos que podem ser zerados, nulificados ou omitidos

Para a futura 3A, os campos abaixo podem e devem sair do nascimento como valores seguros ou vazios, conforme o schema permitir:

- `tempo` -> `0`
- `custo_lab` -> `0`
- `peso` -> `0`
- `especialidade` -> `NULL`
- `simbolo_grafico` -> `NULL`
- `observacoes` -> `NULL`
- `data_inclusao` -> `NULL` ou valor tecnico minimo, se estritamente necessario
- `data_alteracao` -> `NULL` ou valor tecnico minimo, se estritamente necessario
- `mostrar_simbolo` -> `False`
- `inativo` -> `False`

Campos nao presentes no seed atual, mas que devem ser tratados como nao desejados caso aparecam em qualquer origem futura:

- `materiais_vinculados`
- `fases_vinculadas`
- `composicoes`
- `heranca_automatica`

## Campos que precisam permanecer

Devem permanecer no minimo funcional:

- `codigo`
- `descricao`
- `clinica_id`
- os demais campos tecnicos exigidos pelo schema para persistir sem quebrar NOT NULL/FK/default

## Existencia de materiais vinculados no nascimento da conta

Nao ha criacao de `procedimento_generico_material` no fluxo de nascimento de nova conta.

Na leitura feita:

- `seed_procedimentos_genericos(db, clinica.id)` cria apenas `procedimento_generico`;
- os vinculos de materiais de genericos sao tratados depois, em `backend/routes/cadastros_routes.py` por `_sync_procedimento_generico_materiais()`;
- a heranca de materiais para procedimentos normais aparece em `backend/routes/procedimentos_routes.py` e em `backend/services/procedimentos_legado_service.py`, nao no nascimento da conta.

## Existencia de fases vinculadas no nascimento da conta

Nao ha criacao de `procedimento_generico_fase` no fluxo de nascimento de nova conta.

Na leitura feita:

- `seed_procedimentos_genericos(db, clinica.id)` nao persiste fases;
- as fases de genericos sao tratadas depois em `backend/routes/cadastros_routes.py` por `_sync_procedimento_generico_fases()`;
- a heranca de fases para procedimentos normais aparece em `backend/routes/procedimentos_routes.py` e em `backend/services/procedimentos_legado_service.py`.

## Existencia de heranca para procedimentos normais no nascimento da conta

No fluxo de nascimento da conta, nao foi identificado repasse automatico de heranca para procedimentos normais a partir do seed de genericos.

A heranca aparece em caminhos posteriores:

- `backend/routes/procedimentos_routes.py` aplica heranca quando um procedimento normal tem `procedimento_generico_id`;
- `backend/services/procedimentos_legado_service.py` tambem pode propagar dados do generico para procedimentos existentes;
- `backend/routes/cadastros_routes.py` pode sincronizar genericos com fases e materiais quando o usuario cria/edita o generico manualmente.

## Menor ponto seguro de alteracao futura

O menor ponto seguro para a futura implementacao e:

- `backend/seeds/procedimentos_genericos.py`

Motivo:

- e ali que a lista estatica de novos genericos e persistida;
- o `signup_service` apenas chama a funcao de seed;
- sanitizar a origem reduz o risco de carregar tempo, custo_lab, peso, simbolo, observacoes e datas no nascimento da nova conta;
- nao exige mexer em frontend nem em dados de clinicas existentes.

## Necessidade de alterar `backend/seeds/procedimentos_genericos.py`

Sim.

Motivo:

- e o arquivo que contem a fonte real dos dados de novos genericos;
- e a funcao `seed_procedimentos_genericos()` que faz o upsert no nascimento da conta.

Funcoes provaveis para ajuste:

- a lista `PROCEDIMENTOS_GENERICOS_PADRAO`
- `seed_procedimentos_genericos(db, clinica_id)`

Em principio, o ajuste pode ficar restrito ao seed, sem alterar amplamente o restante do backend para a regra de nascimento de novas contas.

## Necessidade de alterar `backend/services/signup_service.py`

Nao para a Subetapa 3A de nascimento de novas contas.

Motivo:

- o `signup_service` apenas chama `seed_procedimentos_genericos(db, clinica.id)`;
- nao foi identificado um segundo upsert de genericos no signup que reintroduza campos;
- a limpeza pode ficar concentrada no seed.

Se, no futuro, o objetivo for endurecer tambem caminhos manuais ou legados, ai sim pode haver ajuste adicional no `signup_service.py`, mas isso nao parece necessario para a 3A do nascimento da conta.

## Necessidade de uma Subetapa 3B separada para vinculos/fases/composicoes

Para o fluxo de nascimento de novas contas, nao parece obrigatoria uma 3B separada.

Motivo:

- o seed de genericos nao cria vinculos nem fases no nascimento;
- os vinculos aparecem depois, em rotas de cadastro/edicao e em servicos legados.

Porem, se a meta seguinte for endurecer tambem os caminhos manuais e legados, entao vale um desdobramento posterior, que pode cobrir:

- `backend/routes/cadastros_routes.py` para `_sync_procedimento_generico_fases()` e `_sync_procedimento_generico_materiais()`;
- `backend/routes/procedimentos_routes.py` para `_aplicar_heranca_procedimento_generico()`;
- `backend/services/procedimentos_legado_service.py` para harmonizacao/heranca legada.

## Riscos relacionados ao contrato de vinculos

Sanitizar o seed de genericos nao quebra o contrato de vinculos por si so, mas ha riscos que precisam ser observados:

- `backend/routes/procedimentos_routes.py` usa `procedimento_generico_id` para herdar tempo, custo_lab, simbolo, observacoes, fases e materiais;
- `backend/routes/cadastros_routes.py` continua aceitando e persistindo fases e materiais de genericos na edicao manual;
- `backend/services/procedimentos_legado_service.py` pode repovoar campos de genericos e propagalos para procedimentos normais;
- materiais e fases ja existentes em clinicas atuais nao devem ser alterados por esta futura 3A;
- o caso 5000 e as regras auditadas de materiais genericos/intervencoes continuam relevantes e nao devem ser violados;
- dashboards e calculos que dependem de `custo_lab` e `peso` vao refletir zero nas novas contas, o que e esperado pelo contrato.

## Plano recomendado para a futura Subetapa 3A

### 3A.1 - Sanitizacao da origem
- alterar `backend/seeds/procedimentos_genericos.py`;
- manter apenas `codigo`, `descricao`, `clinica_id` e os campos tecnicos exigidos pelo schema;
- zerar ou nulificar tempo, custo_lab, peso, simbolo, observacoes e datas, conforme permitido;
- nao alterar outras areas do backend.

### 3A.2 - Validacao tecnica
- rodar `python -m py_compile` no arquivo alterado;
- garantir que o seed continua persistindo sem quebrar a criacao de nova conta.

### 3A.3 - Teste controlado
- criar nova conta/clinica em ambiente seguro;
- abrir Procedimentos Genericos;
- confirmar que os genericos nasceram com codigo/descricao e somente os campos tecnicos obrigatorios;
- confirmar ausencia de fases, materiais e heranca pronta no nascimento;
- verificar que procedimentos normais nao foram afetados.

## Sequencia recomendada das proximas subetapas

Sequencia mais segura para o escopo atual:

1. Subetapa 3A - sanitizar `backend/seeds/procedimentos_genericos.py` para novas contas.
2. Subetapa 3B - somente se houver necessidade de endurecer tambem as rotas manuais, revisar `backend/routes/cadastros_routes.py` para materiais/fases de genericos.
3. Subetapa 3C - somente se quiser bloquear propagacao/replicacao em caminhos posteriores, revisar `backend/routes/procedimentos_routes.py` e `backend/services/procedimentos_legado_service.py`.
4. Subetapa 3D - teste em nova conta de validacao.

Se a intencao for manter o escopo restrito a novos nascimentos, a 3A pode ser suficiente sozinha.

## Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- leitura de `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- leitura de `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- leitura de `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- leitura de `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`
- leitura de `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- leitura de `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `Select-String` em `backend/services/signup_service.py` para `seed_procedimentos_genericos`, `criar_conta_saas` e funcoes de seed relacionadas
- `Select-String` em `backend/seeds/procedimentos_genericos.py` para o seed e os campos persistidos
- `Select-String` em `backend/routes/cadastros_routes.py`, `backend/routes/procedimentos_routes.py` e `backend/services/procedimentos_legado_service.py` para fases, materiais e heranca

## Onde testar depois da implementacao futura

Depois da futura 3A e antes de qualquer commit futuro, testar em ambiente seguro:

1. Criar nova conta/clinica de teste, inclusive fluxo DEMO/trial de 7 dias.
2. Abrir Procedimentos Genericos.
3. Confirmar que os procedimentos genericos nasceram com codigo e descricao.
4. Confirmar que nao nasceram com tempo.
5. Confirmar que nao nasceram com custo_lab.
6. Confirmar que nao nasceram com peso.
7. Confirmar que nao nasceram com simbolo grafico, observacoes ou datas sensiveis.
8. Confirmar que nao nasceram com materiais vinculados.
9. Confirmar que nao nasceram com fases vinculadas.
10. Confirmar que procedimentos normais nao receberam heranca pronta no nascimento da conta.
11. Editar manualmente um procedimento generico.
12. Salvar e reabrir.
13. Verificar console do navegador sem erro.
14. Verificar backend sem erro.

## Conclusao de planejamento

A futura Subetapa 3A pode avancar para implementacao no seed `backend/seeds/procedimentos_genericos.py`.

Nao foi identificada necessidade de alterar `backend/services/signup_service.py` para o nascimento de novas contas.

Uma 3B separada nao parece obrigatoria para o birth flow, mas pode ser util se o objetivo passar a incluir tambem os caminhos manuais e legados de `cadastros_routes.py`, `procedimentos_routes.py` e `procedimentos_legado_service.py`.

