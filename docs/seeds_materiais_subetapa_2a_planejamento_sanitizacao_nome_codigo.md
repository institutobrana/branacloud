# Planejamento funcional - Subetapa 2A

## Objetivo

Preparar a futura implementacao da sanitizacao de Materiais no nascimento de novas contas/clinicas do Brana Cloud, sem alterar comportamento nesta etapa.

## Contratos e documentos respeitados

Este planejamento segue obrigatoriamente:

- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Regra de base assumida para a futura 2A:

- novas contas/clinicas, inclusive DEMO/trial de 7 dias, devem nascer com materiais sanitizados;
- materiais devem manter apenas `codigo`, se existir, `nome` e campos tecnicos obrigatorios do schema, como `lista_id`;
- materiais nao devem nascer com custo, preco, relacao, validade, unidade nao obrigatoria, classificacao nao obrigatoria, fabricante, estoque ou qualquer outro campo financeiro/tecnico nao obrigatorio.

## Arquivos analisados

- `backend/services/signup_service.py`
- `backend/routes/materiais_routes.py`
- `backend/models/material.py`
- `backend/routes/procedimentos_routes.py`
- `backend/services/vinculos_materiais.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/seeds/procedimentos_genericos.py`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`

## Fluxo atual de criacao de materiais em novas contas

O carregamento automatico de materiais acontece no `signup_service` durante o nascimento da nova clinica:

- `criar_conta_saas()` chama `garantir_lista_padrao_clinica(db, clinica.id)`;
- `garantir_lista_padrao_clinica()` chama `_carregar_seed_materiais(db)`;
- `_carregar_seed_materiais(db)` tenta primeiro `_carregar_seed_materiais_clinica(db)` e, se nao houver seed valido, cai em `_carregar_seed_materiais_hosted()`;
- `_upsert_materiais_na_lista()` eh o ponto que persiste/atualiza os materiais na lista da nova conta.

O fluxo atual nao passa por `backend/seeds/*.py` para materiais. Na arvore de `backend/seeds`, ha seeds para procedimentos, procedimentos genericos e simbolos graficos, mas nao ha um seed Python dedicado a materiais.

## Origem real dos dados de materiais

A origem real atual vem de CSVs carregados pelo `signup_service` a partir de `HOSTED_SEED_DIR`:

- `lista_material.csv`
- `material.csv`

Esses arquivos sao lidos por `_seed_csv_rows()` e usados por `_carregar_seed_materiais_hosted()`.

Quando existe uma base clinica aproveitavel, `_carregar_seed_materiais_clinica()` tambem pode fornecer a origem dos materiais, usando a lista padrao da propria clinica.

Resumo da origem:

- fonte hospedada/empacotada via CSV;
- fallback por clinica existente;
- persistencia final via `_upsert_materiais_na_lista()`.

## Campos obrigatorios

Pelo schema e pelo fluxo atual, os campos tecnicos que precisam permanecer sao:

- `codigo`
- `nome`
- `lista_id`

No schema atual de `Material` e de `ListaMaterial`, os campos obrigatorios relevantes sao:

- `Material.codigo` - `NOT NULL`
- `Material.nome` - `NOT NULL`
- `Material.lista_id` - `NOT NULL`, FK para `lista_material.id`
- `ListaMaterial.nome` - `NOT NULL`
- `ListaMaterial.clinica_id` - `NOT NULL`, FK para `clinicas.id`

## Campos que podem ser zerados, nulificados ou omitidos

Para a futura 2A, o contrato permite manter os seguintes campos no valor minimo seguro ou vazios, conforme o schema e o padrao de gravacao:

- `relacao` -> `0`
- `custo` -> `0`
- `preco` -> `0`
- `validade_dias` -> `0`
- `preferido` -> `False`
- `unidade_compra` -> `""` ou `NULL`, se o schema/rota aceitar
- `unidade_consumo` -> `""` ou `NULL`, se o schema/rota aceitar
- `classificacao` -> `""` ou `NULL`, se o schema/rota aceitar

Campos que nao aparecem no model atual de `Material` nem no payload de `backend/routes/materiais_routes.py`, mas que devem ser tratados como nao desejados caso surjam em qualquer origem externa/snapshot:

- `fabricante`
- `estoque`

## Campos que precisam permanecer

Devem permanecer no minimo funcional:

- `codigo`
- `nome`
- `lista_id`
- `clinica_id` da lista associada

Esses campos sao os que permitem inserir, listar e editar sem quebrar o schema ou a segregacao por clinica.

## Menor ponto seguro de alteracao futura

O menor ponto seguro para a futura implementacao nao e o router manual de materiais; e sim o carregamento de seed do signup.

Recomendacao tecnica:

- sanitizar dentro de `_upsert_materiais_na_lista()`;
- opcionalmente, criar um helper local de sanitizacao antes do insert/update, se for preciso deixar a regra mais explicita;
- manter `_carregar_seed_materiais_hosted()` e `_carregar_seed_materiais_clinica()` como origem de leitura, mas sem permitir que campos sensiveis atravessem para o persistido.

Essa abordagem e a menor alteracao porque:

- intercepta o dado no momento exato em que ele entra na nova conta;
- nao altera dados antigos;
- nao exige mexer no frontend;
- nao muda o contrato manual de criacao/edicao de materiais;
- preserva a separacao entre fonte e persistencia.

## Necessidade de alterar `backend/services/signup_service.py`

Sim.

Motivo:

- e esse arquivo que carrega e persiste os materiais na criacao de novas contas;
- o fluxo automatico de novas contas passa por `garantir_lista_padrao_clinica()` e `_upsert_materiais_na_lista()`;
- o seed de materiais nao vem de um arquivo Python dedicado em `backend/seeds`, entao a sanitizacao precisa acontecer no proprio `signup_service.py`.

Funcao mais provavel para ajuste:

- `_upsert_materiais_na_lista()`

Se necessario, o ajuste pode ficar restrito a um helper pequeno dentro do mesmo arquivo, sem mexer em rotas ou telas.

## Alteracao apenas para novas contas

A futura 2A deve atingir apenas o nascimento de novas contas/clinicas.

Nao deve haver:

- `UPDATE` em materiais existentes;
- alteracao em clinicas atuais;
- reprocessamento de dados antigos;
- script de backfill;
- migracao de banco;
- ajuste em frontends para “corrigir” dados ja persistidos.

## Riscos relacionados ao contrato de vinculos

Sanitizar materiais nao quebra, por si so, o contrato de vinculos entre procedimentos e procedimentos genericos, porque os vinculos sao estruturas separadas dos campos financeiros dos materiais.

Mesmo assim, ha riscos funcionais que precisam ser observados:

- `backend/routes/procedimentos_routes.py` calcula custo usando `Material.custo`;
- `backend/services/vinculos_materiais.py` monta visualizacao de custo com base em `Material.custo` e `Material.preco`;
- materiais novos com custo/preco zero vao produzir custo zero em novas contas, o que e esperado pelo contrato, mas pode impactar dashboards e telas que exibem resumo financeiro;
- a heranca de materiais entre procedimento generico e procedimento continua existindo e nao deve ser removida nesta 2A;
- materiais ja vinculados em clinicas existentes nao devem ser alterados;
- o contrato de materiais genericos/intervencoes continua vigente e deve ser respeitado quando a 2A for implementada.

## Plano recomendado para a futura Subetapa 2A

### 2A.1 - Sanitizacao de origem no signup
- alterar `backend/services/signup_service.py`;
- sanitizar os dados retornados para materiais antes de persistir;
- manter `codigo`, `nome` e `lista_id`;
- zerar/omitir custo, preco, relacao, validade e demais campos nao obrigatorios.

### 2A.2 - Helper local de sanitizacao, se necessario
- criar helper pequeno no mesmo arquivo para reduzir duplicacao;
- usar o helper apenas no fluxo de novas contas;
- nao mexer em rotas manuais nem em dados antigos.

### 2A.3 - Validacao tecnica
- rodar `python -m py_compile` no arquivo alterado;
- verificar que o fluxo de signup continua operacional.

### 2A.4 - Teste controlado
- criar nova conta/clinica em ambiente seguro;
- abrir Materiais;
- conferir que os materiais nasceram apenas com identificacao e campos tecnicos obrigatorios;
- confirmar ausencia de custo, preco, relacao, validade e demais campos sensiveis.

## Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- leitura de `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- leitura de `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- leitura de `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- leitura de `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `findstr /s /i "garantir_lista_padrao_clinica _upsert_materiais_na_lista _carregar_seed_materiais material lista_id custo preco relacao validade" backend\\*.py`
- leitura de `backend/services/signup_service.py`
- leitura de `backend/routes/materiais_routes.py`
- leitura de `backend/models/material.py`
- leitura de `backend/routes/procedimentos_routes.py`
- leitura de `backend/services/vinculos_materiais.py`
- inventario de `backend/seeds`

## Onde testar depois da implementacao futura

Depois que a futura 2A for implementada, testar em ambiente seguro:

1. Criar nova conta/clinica de teste, inclusive fluxo DEMO/trial de 7 dias.
2. Abrir Materiais.
3. Confirmar que os materiais nasceram com `codigo` e `nome`.
4. Confirmar que nao nasceram com `custo`.
5. Confirmar que nao nasceram com `preco`.
6. Confirmar que nao nasceram com `relacao`.
7. Confirmar que nao nasceram com `validade_dias` preenchido de forma sensivel.
8. Confirmar que nao nasceram com `unidade_compra`, `unidade_consumo` ou `classificacao` sensiveis, se nao forem obrigatorios.
9. Confirmar que o `lista_id` e os demais obrigatorios tecnicos foram mantidos.
10. Editar manualmente um material.
11. Salvar e reabrir.
12. Verificar console do navegador sem erro.
13. Verificar backend sem erro.

## Conclusao de planejamento

A futura Subetapa 2A pode avancar para implementacao, mas o ponto certo de alteracao ainda precisa ser `backend/services/signup_service.py`, principalmente em `_upsert_materiais_na_lista()`.

