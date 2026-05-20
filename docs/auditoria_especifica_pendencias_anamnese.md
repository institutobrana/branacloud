# Auditoria espec?fica dos pendentes de Anamnese

## 1. Objetivo
Auditar exclusivamente os arquivos pendentes de Anamnese identificados no `git status --short`, classificando arquivo por arquivo com foco em risco de dados sens?veis, resultado bruto de extra??o, documenta??o segura e artefatos operacionais locais.

## 2. Diret?rio real
D:\BRANA ARQUIVOS\BRANA CLOUD

## 3. Branch atual
modularizacao-segura-fase-1

## 4. ?ltimo commit confirmado
a18cb48 - Conclui modularizacao segura parcial de materiais

## 5. Confirma??o de auditoria documental
Esta ? uma auditoria documental, sem altera??o funcional, sem commit, sem push, sem escrita em banco e sem modifica??o de arquivos.

## 6. Escopo
- Confirmar a lista real de pend?ncias de Anamnese no Git
- Classificar arquivo por arquivo
- Identificar risco de dados sens?veis
- Separar documenta??o segura de resultados brutos e artefatos operacionais
- Recomendar o destino futuro de cada arquivo

## 7. Fora de escopo
- Alterar c?digo
- Alterar documenta??o existente
- Apagar, mover ou renomear arquivos
- Executar `git add`, `git commit`, `git push`, `git restore`, `git clean`, `git reset` ou `git stash`
- Rodar servidor
- Mexer em banco

## 8. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -5`
- `git diff --cached --stat`
- `git diff --stat`
- `dir docs\anamnese*`
- leitura da blindagem textual/mojibake em `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- leitura do contexto anterior em `docs/auditoria_pendencias_pos_commit_materiais.md`

## 9. Estado do `git status --short` analisado
O status real analisado mostrou apenas arquivos `??` untracked. Nesta auditoria, 32 desses arquivos eram de Anamnese; os demais 10 j? haviam sido classificados no relat?rio de pend?ncias gerais.

## 10. Lista total de arquivos de Anamnese pendentes encontrados
32 arquivos.

## 11. Quantidade total de arquivos de Anamnese analisados
32 arquivos.

## 12. Classifica??o por categoria
- documenta??o segura candidata a commit futuro: 1
- documenta??o que exige revis?o manual: 7
- resultado bruto de extra??o: 6
- arquivo auxiliar local/operacional: 8
- alto risco de dados sens?veis: 10
- indefinido: 0

## 13. Tabela arquivo por arquivo
| nome | tipo | categoria | risco | recomenda??o | justificativa |
| --- | --- | --- | --- | --- | --- |
| docs/anamnese_auditoria_legado_desktop_id1.md | md | B | M?dio | Revisar manualmente antes de commit | Auditoria de legado com prov?vel refer?ncia a fontes, caminhos e invent?rio hist?rico. |
| docs/anamnese_auditoria_legado_id1.md | md | B | M?dio | Revisar manualmente antes de commit | Documento de auditoria de legado; pode citar caminhos, ids e fontes hist?ricas. |
| docs/anamnese_busca_ponto_anterior_lista_questionarios.md | md | B | M?dio | Revisar manualmente antes de commit | Roteiro/resultado de busca com chance de expor listas e refer?ncias internas. |
| docs/anamnese_diagnostico_conta_gleissontel.md | md | B | M?dio | Revisar manualmente antes de commit | Diagn?stico com refer?ncia a conta/tenant; pode conter contexto sens?vel. |
| docs/anamnese_dry_run_importacao_eds70_gleisson.md | md | E | Alto | Manter local; revis?o manual obrigat?ria | Dry-run de importa??o com nome pr?prio no t?tulo e alto risco de conte?do sens?vel. |
| docs/anamnese_dry_run_plano_perguntas_eds70.json | json | D | M?dio | Manter local/operacional | Plano de dry-run; artefato operacional sem valor claro para GitHub agora. |
| docs/anamnese_dry_run_plano_questionarios_eds70.json | json | D | M?dio | Manter local/operacional | Plano de dry-run; artefato operacional que deve ficar fora do pr?ximo commit. |
| docs/anamnese_dry_run_resumo_eds70.txt | txt | D | M?dio | Manter local/operacional | Resumo de execu??o/dry-run; artefato auxiliar de an?lise local. |
| docs/anamnese_dry_run_sql_preview_eds70.sql | sql | C | M?dio | N?o versionar agora; revisar manualmente | SQL de preview/dry-run; resultado auxiliar e n?o deve ir ao GitHub sem revis?o. |
| docs/anamnese_eds70_busca_strings.txt | txt | C | M?dio | N?o versionar agora; revisar manualmente | Busca textual de descoberta; artefato bruto de extra??o. |
| docs/anamnese_eds70_descoberta_colunas.txt | txt | C | M?dio | N?o versionar agora; revisar manualmente | Descoberta de colunas; artefato bruto de explora??o. |
| docs/anamnese_eds70_descoberta_tabelas.txt | txt | C | M?dio | N?o versionar agora; revisar manualmente | Descoberta de tabelas; artefato bruto de explora??o. |
| docs/anamnese_eds70_extraido_perguntas.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV extra?do; pode conter perguntas/respostas com conte?do sens?vel. |
| docs/anamnese_eds70_extraido_questionarios.csv | csv | C | M?dio | N?o versionar agora; revisar manualmente | CSV extra?do; resultado bruto de extra??o, sem seguran?a para commit imediato. |
| docs/anamnese_eds70_extraido_respostas_resumo.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV com resumo de respostas; alto risco de dados cl?nicos/extra?dos. |
| docs/anamnese_eds70_mapeamento_tabelas.txt | txt | C | M?dio | N?o versionar agora; revisar manualmente | Mapeamento de tabelas; artefato de descoberta bruto. |
| docs/anamnese_eds70_restore_filelistonly.txt | txt | D | M?dio | Manter local/operacional | Filelistonly de restore; artefato operacional de recupera??o. |
| docs/anamnese_extracao_eds70_sqlserver_resultado.md | md | B | M?dio | Revisar manualmente antes de commit | Resultado de extra??o; documenta??o ?til, mas pode conter nomes, ids e refer?ncias de origem. |
| docs/anamnese_investigacao_clinica_tenant_fonte_dados.md | md | B | M?dio | Revisar manualmente antes de commit | Investiga??o de tenant/fonte de dados; pode expor contexto sens?vel de origem. |
| docs/anamnese_legado_bancos_sqlite_id1.txt | txt | D | M?dio | Manter local/operacional | Invent?rio de bancos SQLite legados; ?til localmente, n?o essencial ao GitHub. |
| docs/anamnese_legado_busca_textual_id1.txt | txt | E | Alto | N?o versionar; revis?o manual obrigat?ria | Busca textual de legado com alto risco de expor dados, nomes ou trechos sens?veis. |
| docs/anamnese_legado_dumps_sql_id1.txt | txt | D | M?dio | Manter local/operacional | Refer?ncia a dumps SQL/legado; artefato operacional local. |
| docs/anamnese_legado_extraido_perguntas_id1.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV extra?do de legado com alto risco de conte?do sens?vel. |
| docs/anamnese_legado_extraido_questionarios_id1.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV extra?do de legado com alto risco de conte?do sens?vel. |
| docs/anamnese_legado_extraido_respostas_id1.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV extra?do de legado com alto risco de conte?do sens?vel. |
| docs/anamnese_legado_inventario_fontes_id1.txt | txt | D | M?dio | Manter local/operacional | Invent?rio de fontes/legado; pode ser ?til localmente, mas n?o ? candidato imediato ao GitHub. |
| docs/anamnese_legado_zips_id1.txt | txt | D | M?dio | Manter local/operacional | Invent?rio de zips/legado; artefato operacional local. |
| docs/anamnese_roteiro_extracao_eds70_sqlserver.md | md | A | Baixo | Candidato a commit futuro | Roteiro t?cnico/documental com baixa sensibilidade aparente e utilidade hist?rica. |
| docs/anamnese_seed_auditoria_clinicas_existentes.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV de seed/auditoria com risco de dados cl?nicos/entidades reais. |
| docs/anamnese_seed_candidato_perguntas.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV de seed candidato; pode expor dados cl?nicos ou estruturas sens?veis. |
| docs/anamnese_seed_candidato_questionarios.csv | csv | E | Alto | N?o versionar; revis?o manual obrigat?ria | CSV de seed candidato; alto risco de exposi??o de dados de origem. |
| docs/anamnese_varredura_eds70_bak_mdf_id1.md | md | B | M?dio | Revisar manualmente antes de commit | Varredura de backup/restore; pode expor caminhos, fontes e contexto legado. |

## 14. Lista dos arquivos que n?o devem ir para GitHub agora
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_eds70_busca_strings.txt`
- `docs/anamnese_eds70_descoberta_colunas.txt`
- `docs/anamnese_eds70_descoberta_tabelas.txt`
- `docs/anamnese_eds70_mapeamento_tabelas.txt`
- `docs/anamnese_eds70_restore_filelistonly.txt`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`

## 15. Arquivos que poderiam ir para Git somente ap?s revis?o humana
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`

## 16. Arquivos que parecem apenas locais/operacionais
- `docs/anamnese_dry_run_plano_perguntas_eds70.json`
- `docs/anamnese_dry_run_plano_questionarios_eds70.json`
- `docs/anamnese_dry_run_resumo_eds70.txt`
- `docs/anamnese_eds70_restore_filelistonly.txt`
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`

## 17. Arquivos com maior risco de dados sens?veis
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`

## 18. Recomenda??o sobre os CSVs
N?o versionar automaticamente. CSVs de extra??o e seed devem permanecer fora do Git at? revis?o humana expl?cita, por poderem conter dados cl?nicos, nomes e conte?do de legado.

## 19. Recomenda??o sobre os JSONs
Tratar como artefatos operacionais locais. Os JSONs de plano de dry-run n?o devem ir ao Git sem revis?o e sem confirmar que n?o carregam dados derivados sens?veis.

## 20. Recomenda??o sobre os SQLs
Manter como resultado bruto ou auxiliar local. SQLs de preview/descoberta/restaura??o n?o devem ir ao GitHub agora sem revis?o manual e sem valida??o de conte?do sens?vel.

## 21. Recomenda??o sobre os TXT de descoberta/busca/invent?rio
N?o versionar automaticamente. Esses TXT tendem a ser resultados brutos de explora??o, descoberta ou invent?rio e podem expor estrutura interna, caminhos ou dados sens?veis.

## 22. Recomenda??o sobre os MDs
Os MDs devem ser divididos entre documenta??o segura candidata a commit futuro e documenta??o que exige revis?o manual. S? o roteiro t?cnico mais neutro parece candidato mais seguro; os demais documentos de auditoria/resultado devem ser revisados antes de qualquer commit.

## 23. Recomenda??o objetiva
- manter pendente todo arquivo de risco alto ou bruto;
- revisar manualmente os .md de auditoria/resultados antes de qualquer commit;
- separar em commit futuro apenas a documenta??o segura realmente ?til;
- considerar `.gitignore` futuro para CSVs, SQLs, previews, extra??es e artefatos operacionais;
- n?o apagar nada sem autoriza??o expl?cita;
- n?o fazer `git add` em massa.

## 24. Pr?xima etapa recomendada
ROTA A: revis?o humana dos arquivos `.md` de Anamnese para decidir o que pode virar commit seguro.
ROTA B: manter CSV/SQL/TXT/JSON de extra??o fora do Git at? decis?o expl?cita.
ROTA C: criar etapa futura de `.gitignore` para artefatos brutos, CSVs, dumps, previews e dry-runs.
ROTA D: s? escolher novo m?dulo depois que esses pendentes forem isolados ou conscientemente mantidos fora do pr?ximo commit.

## 25. Confirma??es finais
- nenhum `git add` foi executado;
- nenhum `git commit` foi executado;
- nenhum `git push` foi executado;
- nenhum arquivo foi apagado, movido ou alterado;
- backend/frontend/banco n?o foram alterados;
- a blindagem textual/mojibake foi respeitada.
