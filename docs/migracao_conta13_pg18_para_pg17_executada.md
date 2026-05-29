# Migração executada - Conta Paulo Gustavo ID 13 do PostgreSQL 18 para PostgreSQL 17

## Contexto

- PostgreSQL 17 permaneceu como cluster oficial.
- PostgreSQL 18 permaneceu como cluster de origem temporária, preservado apenas para a migração desta conta.
- Os backups dos dois clusters já tinham sido feitos e validados antes desta etapa.
- O inventário da conta `Paulo Gustavo ID 13` e o dry-run já estavam concluídos.
- O usuário autorizou explicitamente a execução real da migração da conta ID 13 para o cluster PostgreSQL 17.

## Autorização

"O usuário autorizou explicitamente a execução real da migração da conta ID 13 para o cluster PostgreSQL 17."

## Escopo

- Migração apenas da conta `Paulo Gustavo ID 13` e dos dados vinculados ao tenant.
- Sem restore.
- Sem exclusão do cluster 18.
- Sem alteração de código ou de `.env`.
- Sem migração de dados globais sem `clinica_id`.
- `plataforma_auditoria` permaneceu fora desta etapa.

## Backups conferidos

- [brana_saas_pg17_oficial_20260529_143341.dump](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backups/postgres_clusters_20260529_143341/brana_saas_pg17_oficial_20260529_143341.dump) - `3047721` bytes
- [brana_saas_pg17_oficial_20260529_143341.schema.sql](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backups/postgres_clusters_20260529_143341/brana_saas_pg17_oficial_20260529_143341.schema.sql) - `162588` bytes
- [brana_saas_pg18_conta13_20260529_143341.dump](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backups/postgres_clusters_20260529_143341/brana_saas_pg18_conta13_20260529_143341.dump) - `3044707` bytes
- [brana_saas_pg18_conta13_20260529_143341.schema.sql](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backups/postgres_clusters_20260529_143341/brana_saas_pg18_conta13_20260529_143341.schema.sql) - `162707` bytes

## Estado pre-migracao

- Cluster de destino: PostgreSQL 17.8, `brana_saas`, porta 5432, `data_directory = C:/Program Files/PostgreSQL/17/data`.
- Cluster de origem: PostgreSQL 18.3, `brana_saas`, porta 5433, `data_directory = C:/Program Files/PostgreSQL/18/data`.
- Os conflitos principais continuaram ausentes no cluster 17 para a conta 13.
- Foi identificada uma dependencia externa nao listada no dry-run: `material` com `lista_id = 30`, com `244` linhas a mover.
- O `plataforma_auditoria` permaneceu fora da migracao.

## SQL/script executado

- Registro local: [migracao_executada_conta13_pg18_para_pg17.sql](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/migracao_executada_conta13_pg18_para_pg17.sql)
- A execucao foi controlada dentro de uma transacao.
- O resultado final foi `COMMIT`.

## Tabelas migradas

Tabela | origem | destino pos-migracao | status
--- | ---: | ---: | ---
clinicas | 1 | 5 | migrada
access_profile | 10 | 50 | migrada
anamnese_questionarios | 3 | 17 | migrada
anamnese_perguntas | 41 | 276 | migrada
categoria_financeira | 86 | 446 | migrada
convenio_odonto | 10 | 50 | migrada
doenca_cid | 14486 | 72430 | migrada
etiqueta_modelo | 8 | 41 | migrada
grupo_financeiro | 13 | 69 | migrada
indice_financeiro | 4 | 20 | migrada
item_auxiliar | 1226 | 6133 | migrada
lista_material | 1 | 6 | migrada
material | 244 | 1233 | migrada
plano_odonto | 10 | 50 | migrada
plataforma_assinaturas | 1 | 5 | migrada
prestador_odonto | 2 | 11 | migrada
procedimento_generico | 591 | 2371 | migrada
procedimento_tabela | 10 | 37 | migrada
procedimento | 1599 | 7814 | migrada
simbolo_grafico_catalogo | 138 | 698 | migrada
unidade_atendimento | 1 | 4 | migrada
usuarios | 2 | 17 | migrada

## Tabelas nao migradas

- `plataforma_auditoria`
- dados globais sem `clinica_id`
- dados de outros tenants
- backups/dumps
- `usuario_perfil_acesso` permaneceu sem linhas da clínica 13

## Validações pos-migracao

- Clinica `ID 13` presente no cluster 17.
- Usuarios `30` e `31` presentes e vinculados a `clinica_id = 13`.
- Prestadores `19` e `20` presentes e vinculados a `usuario_id = 30/31`.
- Unidade `8` presente.
- `access_profile` `101..110` presentes.
- `procedimento_tabela` remapeada para `95..104`.
- `procedimento` remapeado para `64427..66025`.
- `doenca_cid` permaneceu com os IDs de origem e teve sequence ajustada ao novo maximo.
- `material` da lista `30` foi migrado com `244` linhas.
- `ID 17/18` e usuarios `44/45` continuaram presentes no cluster 17.

## Sequences

- Ajustadas sem reduzir valores.
- Houve necessidade de ajuste para:
  - `doenca_cid_id_seq` -> `15624269`
  - `procedimento_tabela_id_seq` -> `104`
  - `procedimento_id_seq` -> `66025`
  - `unidade_atendimento_id_seq` -> `8`
- As demais sequences relevantes permaneceram coerentes com o maior `id` atual.

## Estado final dos clusters

- PostgreSQL 17 permaneceu ativo na porta 5432 ao final.
- PostgreSQL 18 temporario foi parado ao final.
- O cluster 18 nao foi excluido.
- Nenhum restore foi executado.
- Os backups continuaram locais e fora do Git.

## Onde testar no sistema

- Abrir o sistema no backend apontando para o PostgreSQL 17 oficial.
- Verificar se `Paulo Gustavo ID 13` aparece.
- Verificar a conta `pagamentosccb@gmail.com`.
- Conferir os usuarios, prestadores, unidade e perfis da conta 13.
- Confirmar que `ID 17/18` continuam aparecendo como antes.
- Confirmar que nenhuma conta foi perdida.

## Proxima etapa recomendada

- Validacao manual no sistema pelo usuario.
- Depois, se aprovado, seguir para uma etapa separada de estabilizacao/desativacao eventual do cluster 18.

## Confirmacoes de escopo

- nenhum codigo alterado
- frontend/app.js nao alterado
- frontend/index.html nao alterado
- frontend/js/modules nao alterado
- backend nao alterado
- .env nao alterado
- schema/migrations/seeds/endpoints nao alterados
- nenhum restore executado
- cluster 18 nao excluido
- backups nao versionados
- blindagem textual/mojibake respeitada

## Registro para roadmap

Esta execucao deve ser registrada no roadmap como a migracao real concluida da conta `Paulo Gustavo ID 13` do PostgreSQL 18 para o PostgreSQL 17 oficial, com `MIG-A` preservando `clinica_id = 13` e incluindo a dependencia externa `material` identificada durante a execucao.
