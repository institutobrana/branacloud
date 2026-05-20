# Detalhamento dos v?nculos de materiais do caso 5000 / PARTICULAR

## Nota de consist?ncia
- O snapshot vivo consultado nesta auditoria retornou `17` v?nculos diretos e `17` materiais ?nicos para o `40595`.
- Os relat?rios anteriores desta mesma frente documentavam `18` v?nculos diretos, `17` materiais ?nicos e uma duplicidade de `Babador Descartavel`.
- Para n?o esconder esse drift, o relat?rio preserva a compara??o hist?rica, mas deixa expl?cito que o dado atual consultado hoje n?o exibiu a mesma contagem de `18`.

## Resumo do caso
- procedimento_id: `40595`
- procedimento_codigo: `5000`
- procedimento_nome: `Adequao de meio bucal`
- tabela_nome: `PARTICULAR`
- procedimento_generico_id_atual: `None`
- v?nculos diretos: `17`
- materiais ?nicos: `17`
- duplicidades internas: `nenhuma`
- gen?rico hist?rico prov?vel: `00205 - Botox`

## Por que os materiais permanecem ao selecionar ?Selecione...?
O caso 5000 j? foi documentado como revis?o manual obrigat?ria porque os materiais aparentam estar materializados como v?nculos diretos no procedimento. Quando o combo de Procedimento Gen?rico vai para ?Selecione...?, o sistema preserva os v?nculos diretos j? gravados no procedimento, ent?o a grade n?o zera sozinha apenas pela troca do combo. Isso ? compat?vel com a hip?tese de heran?a antiga j? materializada como dado local.

## Compara??o com o gen?rico 00205 - Botox
- materiais vinculados no 5000: `17` linhas, `17` materiais ?nicos
- materiais vinculados ao 00205 - Botox: `34` linhas, `34` materiais ?nicos
- materiais do 5000 tamb?m presentes no 00205: `17`
- materiais do 5000 n?o presentes no 00205: `0`

## Tabela detalhada dos v?nculos
| procedimento_id | procedimento_codigo | tabela_nome | procedimento_generico_id_atual | generico_referencia_codigo | generico_referencia_nome | vinculo_id | material_id | material_descricao | quantidade | unidade | valor_unitario | origem_atual_no_sistema | existe_no_generico_00205 | quantidade_no_generico_00205 | classificacao_sugerida | observacao | decisao_usuario |
| --- | ---: | --- | --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: | --- | --- | --- | --- | --- | --- |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119962 | 3355 | Álcool 70% | 20 |  |  | v?nculo direto do procedimento 5000 | sim | 20 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119963 | 3358 | Algodão Hidrófilo 500mg | 3 |  |  | v?nculo direto do procedimento 5000 | sim | 3 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119964 | 3365 | Babador Descartável | 1 |  |  | v?nculo direto do procedimento 5000 | sim | 1 | duplicado | material tamb?m existe no footprint do gen?rico 00205; duplicidade destacada nos relat?rios anteriores |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119965 | 3558 | BARREIRA - Saco Hamburguer 22x17 - Pacote com 100 | 2 |  |  | v?nculo direto do procedimento 5000 | sim | 2 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119966 | 3556 | BARREIRA - Saquinho de Juju (canetas) - Pacote com | 3 |  |  | v?nculo direto do procedimento 5000 | sim | 3 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119967 | 3559 | BARREIRA - Saquinho para Óculos - Pacote com 100 u | 1 |  |  | v?nculo direto do procedimento 5000 | sim | 1 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119968 | 3557 | BARREIRA - Saquinho para Refletor - Pacote com 150 | 2 |  |  | v?nculo direto do procedimento 5000 | sim | 2 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119969 | 3434 | BOTOX | 1 |  |  | v?nculo direto do procedimento 5000 | sim | 1 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119970 | 3445 | Copo Descartável Café CONSULTÓRIO | 1 |  |  | v?nculo direto do procedimento 5000 | sim | 1 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119971 | 3481 | Gorro Branco com Elástico | 3 |  |  | v?nculo direto do procedimento 5000 | sim | 3 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119972 | 3482 | Guardanapo de Papel Grande - Pacote com 100 unidad | 2 |  |  | v?nculo direto do procedimento 5000 | sim | 2 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119973 | 3517 | Luva de Procedimento | 4 |  |  | v?nculo direto do procedimento 5000 | sim | 4 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119974 | 3518 | Máscara com Elastico | 2 |  |  | v?nculo direto do procedimento 5000 | sim | 2 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119975 | 3563 | Seringa Descartável - 1ml | 2 |  |  | v?nculo direto do procedimento 5000 | sim | 2 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119976 | 3562 | Seringa Descartável - 3ml | 1 |  |  | v?nculo direto do procedimento 5000 | sim | 1 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119977 | 3577 | Vaselina Líquida | 10 |  |  | v?nculo direto do procedimento 5000 | sim | 10 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |
| 40595 | 5000 | PARTICULAR | null | 00205 | Botox | 119978 | 3578 | Vaselina Sólida | 5 |  |  | v?nculo direto do procedimento 5000 | sim | 5 | prov?vel herdado antigo do gen?rico 00205 | material tamb?m existe no footprint do gen?rico 00205 |  |

## Duplicidades identificadas
- Nenhuma duplicidade interna identificada.

## Itens que parecem herdados antigos
- `Álcool 70%` (`material_id 3355`) -> tamb?m existe no footprint do 00205.
- `Algodão Hidrófilo 500mg` (`material_id 3358`) -> tamb?m existe no footprint do 00205.
- `BARREIRA - Saco Hamburguer 22x17 - Pacote com 100` (`material_id 3558`) -> tamb?m existe no footprint do 00205.
- `BARREIRA - Saquinho de Juju (canetas) - Pacote com` (`material_id 3556`) -> tamb?m existe no footprint do 00205.
- `BARREIRA - Saquinho para Óculos - Pacote com 100 u` (`material_id 3559`) -> tamb?m existe no footprint do 00205.
- `BARREIRA - Saquinho para Refletor - Pacote com 150` (`material_id 3557`) -> tamb?m existe no footprint do 00205.
- `BOTOX` (`material_id 3434`) -> tamb?m existe no footprint do 00205.
- `Copo Descartável Café CONSULTÓRIO` (`material_id 3445`) -> tamb?m existe no footprint do 00205.
- `Gorro Branco com Elástico` (`material_id 3481`) -> tamb?m existe no footprint do 00205.
- `Guardanapo de Papel Grande - Pacote com 100 unidad` (`material_id 3482`) -> tamb?m existe no footprint do 00205.
- `Luva de Procedimento` (`material_id 3517`) -> tamb?m existe no footprint do 00205.
- `Máscara com Elastico` (`material_id 3518`) -> tamb?m existe no footprint do 00205.
- `Seringa Descartável - 1ml` (`material_id 3563`) -> tamb?m existe no footprint do 00205.
- `Seringa Descartável - 3ml` (`material_id 3562`) -> tamb?m existe no footprint do 00205.
- `Vaselina Líquida` (`material_id 3577`) -> tamb?m existe no footprint do 00205.
- `Vaselina Sólida` (`material_id 3578`) -> tamb?m existe no footprint do 00205.

## Itens que podem ser pr?prios reais
- Nenhum item com alta confian?a para essa categoria.

## Itens que exigem revis?o manual
- Nenhum item adicional al?m das duplicidades e dos match diretos.

## Recomenda??o
- N?o executar saneamento ainda.
- O usu?rio deve revisar a coluna `decisao_usuario` no CSV.
- S? depois gerar um script preview/rollback para qualquer a??o controlada.

## Onde testar futuramente ap?s saneamento
- Abrir `Configura??es > Tabelas > Interven??es / Procedimentos...`.
- Carregar a tabela `PARTICULAR` e reabrir o procedimento `5000`.
- Trocar o Procedimento Gen?rico para `Selecione...` e para `00205 - Botox`.
- Confirmar se os materiais herdados saem e se os pr?prios reais permanecem, somente ap?s valida??o humana e eventual saneamento controlado.
