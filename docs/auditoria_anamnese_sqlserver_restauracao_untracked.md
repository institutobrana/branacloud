# Auditoria de Anamnese / SQLServer / Restauracao - untracked

## 1. Objetivo
Auditar todos os arquivos untracked relacionados a Anamnese, SQLServer e restauracao, separar o que e documentacao humana, o que e artefato tecnico bruto, o que pode virar commit futuro e o que deve ficar fora do Git por enquanto, sem alterar qualquer arquivo alem deste relatorio.

## 2. Contexto
As trilhas principais recentes ja foram corrigidas, testadas, documentadas e versionadas.

Os commits recentes relevantes sao:

- `5c8ef7a` - Corrige login, senha interna e perfis de usuarios
- `8c1f7c5` - Corrige seed canonico Brana no signup
- `cb20715` - Documenta exclusao segura da clinica 15
- `9c4df78` - Documenta exclusoes seguras de clinicas de teste
- `680749d` - Documenta validacao final do signup com Brana
- `58c913d` - Audita documentacao geral do Brana Cloud
- `a513b67` - Atualiza indice e roadmap documental
- `0701705` - Atualiza READMEs do Brana Cloud
- `579a76d` - Documenta triagem dos untracked restantes
- `ceb9784` - Preserva documentos importantes de contratos e modulos
- `6db88df` - Preserva contratos e documentos importantes de modulos
- `8968ded` - Preserva plano de reajuste em intervencoes e procedimentos
- `20e03c2` - Preserva historico de correcao mojibake no frontend
- `3d25b93` - Audita CSVs de vinculos entre materiais e procedimentos
- `aea80ef` - Preserva auditorias Git da organizacao recente

A trilha de Anamnese / SQLServer / restauracao e grande e sensivel. Ela nao deve ser misturada com Brana, usuarios, exclusoes seguras, documentacao principal ou contratos gerais.

## 3. Branch e estado Git
- Branch atual: `modularizacao-segura-fase-1`
- Estado inicial observado: sem tracked modificados, apenas arquivos `untracked`
- Quantidade de arquivos desta trilha auditados: `61`
- Arquivos suspeitos na raiz, fora de `docs/`: `git`, `modularizacao-segura-fase-1`
- Nenhum `git add`, `git commit`, `git push`, `git reset`, `git restore` ou `git clean` foi executado nesta auditoria

## 4. Metodologia
Foi feita leitura somente de arquivos e classificacao por nome, tipo e conteudo inicial/representativo. Tambem foram usados como contexto:

- `docs/triagem_untracked_restantes_pos_documentacao_principal.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `README.md`
- `backend/README.md`

Foram observados, em especial, arquivos com nomes contendo:

- `anamnese`
- `sqlserver`
- `restauracao`
- `eds70`
- `questionarios`
- `perguntas`
- `respostas`
- `sqlite`
- `legado`
- `dump`
- `restore`
- `filelistonly`
- `dry_run`
- `importacao`

## 5. Classificacao geral por grupos

- Grupo A - Documentos humanos de diagnostico / historico / modularizacao de Anamnese: `26`
- Grupo B - Planos, isolamento e revisao humana: `5`
- Grupo C - Dry-runs e previews: `5`
- Grupo D - Extraicoes CSV/TXT e inventarios brutos: `19`
- Grupo E - SQLServer / restore SQL / filelistonly: `3`
- Grupo F - Restauracao: `3`
- Grupo G - Artefatos suspeitos na raiz fora de `docs/`: `2`

## 6. Auditoria arquivo por arquivo

### Grupo A - Documentos humanos de diagnostico / historico / modularizacao

1. `docs/anamnese_auditoria_legado_desktop_id1.md` - auditoria de legado desktop; documento historico sensivel. Recomendacao: revisar manualmente antes de commit futuro.
2. `docs/anamnese_auditoria_legado_id1.md` - auditoria de legado da clinica 1; historico sensivel. Recomendacao: revisar manualmente antes de commit futuro.
3. `docs/anamnese_busca_ponto_anterior_lista_questionarios.md` - investigacao de regressao na lista de questionarios. Recomendacao: candidato a commit futuro, com revisao humana.
4. `docs/anamnese_correcao_duplo_clique_pergunta.md` - correcao funcional pontual de duplo clique na pergunta. Recomendacao: candidato a commit futuro, com revisao humana.
5. `docs/anamnese_diagnostico_conta_gleissontel.md` - diagnostico de conta real / clinica real. Recomendacao: manter fora por enquanto e submeter a revisao humana.
6. `docs/anamnese_extracao_eds70_sqlserver_resultado.md` - resultado humano de extracao EDS70/SQLServer. Recomendacao: candidato a commit futuro, mas revisar manualmente por conter resultado operacional.
7. `docs/anamnese_importacao_eds70_gleisson_resultado.md` - resultado humano de importacao. Recomendacao: candidato a commit futuro, com revisao humana.
8. `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md` - investigacao de tenant e fonte de dados; sensivel. Recomendacao: manter fora por enquanto e revisar manualmente.
9. `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md` - consolidacao de recuperacao e seed obrigatorio. Recomendacao: candidato a commit futuro.
10. `docs/anamnese_roteiro_extracao_eds70_sqlserver.md` - roteiro tecnico de extracao; documento estavel. Recomendacao: candidato a commit futuro.
11. `docs/anamnese_seed_obrigatorio_implementacao_resultado.md` - resultado de implementacao do seed obrigatorio. Recomendacao: revisar manualmente antes de qualquer commit.
12. `docs/anamnese_subetapa_0_retomada_estado_atual.md` - retomada documental do modulo Anamnese. Recomendacao: candidato a commit futuro.
13. `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md` - revisao pos-recuperacao EDS70. Recomendacao: candidato a commit futuro.
14. `docs/anamnese_subetapa_1_documental_helpers_puros_existentes.md` - helpers puros ja existentes. Recomendacao: candidato a commit futuro.
15. `docs/anamnese_subetapa_1_namespace_passivo.md` - namespace passivo do modulo. Recomendacao: candidato a commit futuro.
16. `docs/anamnese_subetapa_2_documental_delegacao_controlada_appjs.md` - fronteira de delegacao controlada no `app.js`. Recomendacao: candidato a commit futuro.
17. `docs/anamnese_subetapa_2_fronteiras_contratos.md` - fronteiras e contratos da trilha. Recomendacao: candidato a commit futuro.
18. `docs/anamnese_subetapa_3_wrapper_minimo_delegacao_controlada.md` - wrapper minimo de delegacao controlada. Recomendacao: candidato a commit futuro.
19. `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md` - helper puro de validacao. Recomendacao: candidato a commit futuro.
20. `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md` - helper puro de validacao. Recomendacao: candidato a commit futuro.
21. `docs/anamnese_subetapa_4_validacao_wrappers_encerramento.md` - validacao e encerramento do mini ciclo. Recomendacao: candidato a commit futuro.
22. `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md` - integracao da validacao. Recomendacao: candidato a commit futuro.
23. `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md` - integracao da validacao. Recomendacao: candidato a commit futuro.
24. `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md` - encerramento do ciclo tecnico. Recomendacao: candidato a commit futuro.
25. `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md` - validacao final apos importacao real. Recomendacao: revisar manualmente antes de commit.
26. `docs/anamnese_varredura_eds70_bak_mdf_id1.md` - varredura de backup e MDF do legado. Recomendacao: manter fora por enquanto e revisar manualmente.

### Grupo B - Planos, isolamento e revisao humana

1. `docs/plano_isolamento_pendencias_anamnese_restauracao.md` - plano de isolamento dos pendentes. Recomendacao: candidato a commit futuro, porque organiza a trilha.
2. `docs/revisao_humana_md_anamnese_pendentes.md` - revisao humana dos .md pendentes. Recomendacao: revisar manualmente antes de commit.
3. `docs/anamnese_seed_obrigatorio_plano.md` - plano do seed obrigatorio de Anamnese. Recomendacao: candidato a commit futuro.
4. `docs/anamnese_seed_obrigatorio_plano_por_clinica.json` - plano tecnico por clinica em JSON. Recomendacao: manter local por enquanto; se virar documento oficial, requer revisao humana.
5. `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt` - resultado de dry-run do seed obrigatorio. Recomendacao: manter local por enquanto; pode virar apoio historico com revisao humana.

### Grupo C - Dry-runs e previews

1. `docs/anamnese_dry_run_importacao_eds70_gleisson.md` - dry-run de importacao. Recomendacao: manter fora por enquanto; revisar manualmente se for virar historico.
2. `docs/anamnese_dry_run_plano_perguntas_eds70.json` - plano bruto de perguntas para dry-run. Recomendacao: artefato tecnico; manter local.
3. `docs/anamnese_dry_run_plano_questionarios_eds70.json` - plano bruto de questionarios para dry-run. Recomendacao: artefato tecnico; manter local.
4. `docs/anamnese_dry_run_resumo_eds70.txt` - resumo do dry-run. Recomendacao: artefato tecnico; manter local.
5. `docs/anamnese_dry_run_sql_preview_eds70.sql` - preview SQL do dry-run. Recomendacao: artefato tecnico; manter local e considerar `.gitignore` futura.

### Grupo D - Extraicoes CSV/TXT e inventarios brutos

1. `docs/anamnese_eds70_busca_strings.txt` - busca textual bruta. Recomendacao: artefato tecnico; manter local.
2. `docs/anamnese_eds70_descoberta_colunas.txt` - descoberta de colunas. Recomendacao: artefato tecnico; manter local.
3. `docs/anamnese_eds70_descoberta_tabelas.txt` - descoberta de tabelas. Recomendacao: artefato tecnico; manter local.
4. `docs/anamnese_eds70_extraido_perguntas.csv` - extraicao bruta de perguntas. Recomendacao: manter local; possivel `.gitignore` futura.
5. `docs/anamnese_eds70_extraido_questionarios.csv` - extraicao bruta de questionarios. Recomendacao: manter local; possivel `.gitignore` futura.
6. `docs/anamnese_eds70_extraido_respostas_resumo.csv` - resumo bruto de respostas. Recomendacao: manter local; possivel `.gitignore` futura.
7. `docs/anamnese_eds70_mapeamento_tabelas.txt` - mapeamento bruto de tabelas. Recomendacao: artefato tecnico; manter local.
8. `docs/anamnese_legado_bancos_sqlite_id1.txt` - inventario de bancos SQLite do legado. Recomendacao: manter local por sensibilidade.
9. `docs/anamnese_legado_busca_textual_id1.txt` - busca textual no legado. Recomendacao: manter local; revisar manualmente antes de qualquer commit.
10. `docs/anamnese_legado_dumps_sql_id1.txt` - dumps SQL do legado. Recomendacao: manter fora do Git por risco de dados.
11. `docs/anamnese_legado_extraido_perguntas_id1.csv` - perguntas extraidas do legado. Recomendacao: manter local; artefato bruto.
12. `docs/anamnese_legado_extraido_questionarios_id1.csv` - questionarios extraidos do legado. Recomendacao: manter local; artefato bruto.
13. `docs/anamnese_legado_extraido_respostas_id1.csv` - respostas extraidas do legado. Recomendacao: manter local; artefato bruto.
14. `docs/anamnese_legado_inventario_fontes_id1.txt` - inventario de fontes do legado. Recomendacao: manter local; revisar manualmente antes de commit.
15. `docs/anamnese_legado_zips_id1.txt` - zips do legado inventariados. Recomendacao: manter local por sensibilidade.
16. `docs/anamnese_seed_auditoria_clinicas_existentes.csv` - auditoria de clinicas existentes para seed. Recomendacao: revisar manualmente; pode ser material de apoio.
17. `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv` - auditoria pos-backfill. Recomendacao: revisar manualmente; pode ser material de apoio.
18. `docs/anamnese_seed_candidato_perguntas.csv` - candidatos de perguntas. Recomendacao: manter local; dado bruto.
19. `docs/anamnese_seed_candidato_questionarios.csv` - candidatos de questionarios. Recomendacao: manter local; dado bruto.

### Grupo E - SQLServer / restore SQL / filelistonly

1. `docs/anamnese_eds70_restore_filelistonly.txt` - saida de `RESTORE FILELISTONLY`. Recomendacao: artefato tecnico; manter local.
2. `docs/sqlserver_anamnese_descoberta_eds70.sql` - script read-only de descoberta SQLServer. Recomendacao: manter local; pode virar apoio historico se houver necessidade.
3. `docs/sqlserver_restore_eds70_anamnese_readonly.sql` - script-modelo de restore isolado. Recomendacao: manter local; sensivel e de alto risco.

### Grupo F - Restauracao

1. `docs/restauracao_pre_anamnese.md` - nota humana de restauracao/conservacao do ponto anterior. Recomendacao: candidato a commit futuro se houver consolidacao historica.
2. `docs/restauracao_pre_anamnese_diff_antes.patch` - patch bruto. Recomendacao: artefato tecnico; manter local e considerar `.gitignore` futura.
3. `docs/restauracao_pre_anamnese_status_antes.txt` - status bruto antes da restauracao. Recomendacao: artefato tecnico; manter local e considerar `.gitignore` futura.

### Grupo G - Artefatos suspeitos na raiz

1. `git` - arquivo solto na raiz; nao e documento funcional. Recomendacao: revisar manualmente antes de remover ou ignorar.
2. `modularizacao-segura-fase-1` - arquivo solto na raiz com nome de branch. Recomendacao: revisar manualmente antes de remover ou ignorar.

## 7. Arquivos importantes para reconstruir a historia da trilha

### 7.1 Candidatos a commit futuro como documentacao util

- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`
- `docs/anamnese_subetapa_0_retomada_estado_atual.md`
- `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
- `docs/anamnese_subetapa_1_documental_helpers_puros_existentes.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_subetapa_2_documental_delegacao_controlada_appjs.md`
- `docs/anamnese_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_subetapa_3_wrapper_minimo_delegacao_controlada.md`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_4_validacao_wrappers_encerramento.md`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`

### 7.2 Documentos que exigem revisao humana antes de qualquer commit

- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_correcao_duplo_clique_pergunta.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_importacao_eds70_gleisson_resultado.md`
- `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt`
- `docs/anamnese_seed_obrigatorio_plano_por_clinica.json`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`

## 8. Arquivos tecnicos / brutos que devem ficar fora do Git por enquanto

- `docs/anamnese_dry_run_plano_perguntas_eds70.json`
- `docs/anamnese_dry_run_plano_questionarios_eds70.json`
- `docs/anamnese_dry_run_resumo_eds70.txt`
- `docs/anamnese_dry_run_sql_preview_eds70.sql`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`

## 9. Candidatos a `.gitignore` futura

Se estes artefatos continuarem sendo gerados repetidamente, eles podem entrar numa regra futura de ignorar:

- `docs/anamnese_dry_run_plano_*.json`
- `docs/anamnese_dry_run_resumo_eds70.txt`
- `docs/anamnese_dry_run_sql_preview_eds70.sql`
- `docs/anamnese_eds70_extraido_*.csv`
- `docs/anamnese_legado_extraido_*.csv`
- `docs/anamnese_seed_auditoria_*.csv`
- `docs/anamnese_seed_candidato_*.csv`
- `docs/sqlserver_*.sql`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`

Observacao: isso e apenas uma candidatura futura. Nada foi alterado nesta etapa.

## 10. Riscos avaliados

- Committar dumps, CSVs brutos ou SQL de restore pode expor informacao sensivel e poluir o historico.
- Manter tudo fora do Git tambem pode fazer perder rastreabilidade de decisao, especialmente nos documentos humanos da trilha.
- Misturar Anamnese com documentacao principal ou com contratos vigentes pode dificultar revisao e rollback.
- Mover ou apagar arquivos sem revisao humana pode destruir evidencias utiles da trilha.

## 11. Recomendacao de proxima etapa

1. Separar, em commit futuro e apenas se o usuario aprovar, os documentos humanos mais estaveis da trilha Anamnese.
2. Manter os artefatos brutos (CSV, TXT, JSON, SQL, patch) fora do Git ate uma decisao explicita.
3. Tratar `docs/plano_isolamento_pendencias_anamnese_restauracao.md` e `docs/revisao_humana_md_anamnese_pendentes.md` como referencia de triagem, nao como sobra.
4. Revisar os arquivos soltos `git` e `modularizacao-segura-fase-1` em etapa separada, com revisao humana antes de qualquer limpeza.

## 12. Confirmacao final

Nada foi alterado alem deste relatorio novo.
