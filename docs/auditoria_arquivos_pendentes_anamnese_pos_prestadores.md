# Auditoria de arquivos pendentes - Anamnese e legados

## 1. Objetivo

Auditar os arquivos nao rastreados relacionados a Anamnese, restauracao, extracao legada, SQL Server, dry-run e recomendacoes, para decidir com seguranca o que merece:

- manter e versionar;
- revisar manualmente antes de versionar;
- manter fora do commit por enquanto;
- ou considerar candidato a remocao futura.

Esta auditoria e documental e analitica.

## 2. Escopo observado

Arquivos pendentes conhecidos na revisao:

- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_dry_run_plano_perguntas_eds70.json`
- `docs/anamnese_dry_run_plano_questionarios_eds70.json`
- `docs/anamnese_dry_run_resumo_eds70.txt`
- `docs/anamnese_dry_run_sql_preview_eds70.sql`
- `docs/anamnese_eds70_busca_strings.txt`
- `docs/anamnese_eds70_descoberta_colunas.txt`
- `docs/anamnese_eds70_descoberta_tabelas.txt`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_eds70_mapeamento_tabelas.txt`
- `docs/anamnese_eds70_restore_filelistonly.txt`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

## 3. Como os arquivos foram classificados

### 3.1 Documentos historicos que provavelmente devem ser mantidos / versionados

| Arquivo | Tipo | Provavel finalidade | Risco | Recomendacao | Justificativa |
|---|---|---|---|---|---|
| `docs/anamnese_auditoria_legado_desktop_id1.md` | `.md` | auditoria documental do legado desktop | baixo | versionar agora | registra diagnostico historico e contexto tecnico |
| `docs/anamnese_auditoria_legado_id1.md` | `.md` | auditoria documental principal do legado | baixo | versionar agora | material historico de alto valor para rastreabilidade |
| `docs/anamnese_busca_ponto_anterior_lista_questionarios.md` | `.md` | busca de ponto anterior da lista | baixo | versionar agora | documenta regressao e criterio de retorno |
| `docs/anamnese_diagnostico_conta_gleissontel.md` | `.md` | diagnostico da conta/clinica | medio | versionar agora | diagnostico importante para recuperar fonte correta |
| `docs/anamnese_dry_run_importacao_eds70_gleisson.md` | `.md` | relato de dry-run de importacao | medio | versionar agora | registra ensaio de importacao e conclusoes |
| `docs/anamnese_dry_run_resumo_eds70.txt` | `.txt` | resumo do dry-run | medio | versionar agora | resumo pequeno e historico do ensaio |
| `docs/anamnese_extracao_eds70_sqlserver_resultado.md` | `.md` | resultado da extracao SQL Server | medio | versionar agora | evidencia central da recuperacao EDS70 |
| `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md` | `.md` | investigacao da fonte de dados | medio | versionar agora | ajuda a explicar a origem da base recuperada |
| `docs/anamnese_roteiro_extracao_eds70_sqlserver.md` | `.md` | roteiro de extracao | baixo | versionar agora | roteiro tecnico tem valor de reproducao |
| `docs/anamnese_varredura_eds70_bak_mdf_id1.md` | `.md` | varredura de artefatos legados | baixo | versionar agora | registra analise de origem dos arquivos SQL Server |
| `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md` | `.md` | recomendacao de proximo modulo | baixo | versionar agora | documenta a decisao de continuidade |
| `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | `.md` | recomendacao anterior de modulo | baixo | versionar agora | mantem a trilha de decisao da modularizacao |
| `docs/restauracao_pre_anamnese.md` | `.md` | relato de restauracao controlada | baixo | versionar agora | explica a volta conservadora ao ponto anterior |
| `docs/restauracao_pre_anamnese_status_antes.txt` | `.txt` | estado antes da restauracao | baixo | versionar agora | ajuda a auditar o contexto da reversao |
| `docs/sqlserver_anamnese_descoberta_eds70.sql` | `.sql` | script de descoberta SQL | medio | revisar manualmente antes de versionar | tem valor tecnico, mas precisa conferencia de seguranca |
| `docs/sqlserver_restore_eds70_anamnese_readonly.sql` | `.sql` | restore readonly isolado | medio | revisar manualmente antes de versionar | util como roteiro, mas deve ser revisto antes de entrar no commit |

### 3.2 Arquivos operacionais que talvez devam ser mantidos temporariamente, mas nao necessariamente versionados

| Arquivo | Tipo | Provavel finalidade | Risco | Recomendacao | Justificativa |
|---|---|---|---|---|---|
| `docs/anamnese_eds70_busca_strings.txt` | `.txt` | busca textual em binarios/artefatos | baixo | manter fora do commit por enquanto | util como suporte, mas ainda e operacional |
| `docs/anamnese_eds70_descoberta_colunas.txt` | `.txt` | descoberta de colunas | baixo | manter fora do commit por enquanto | apoio tecnico intermedio |
| `docs/anamnese_eds70_descoberta_tabelas.txt` | `.txt` | descoberta de tabelas | baixo | manter fora do commit por enquanto | apoio tecnico intermedio |
| `docs/anamnese_eds70_mapeamento_tabelas.txt` | `.txt` | mapeamento de tabelas | baixo | manter fora do commit por enquanto | artefato de trabalho, nao necessariamente de entrega |
| `docs/anamnese_eds70_restore_filelistonly.txt` | `.txt` | saida de `RESTORE FILELISTONLY` | baixo | manter fora do commit por enquanto | suporte para restauraçao, mais operacional que historico |
| `docs/anamnese_legado_bancos_sqlite_id1.txt` | `.txt` | inventario de bancos SQLite legados | baixo | manter fora do commit por enquanto | util para auditoria, ainda operacional |
| `docs/anamnese_legado_inventario_fontes_id1.txt` | `.txt` | inventario de fontes legadas | baixo | manter fora do commit por enquanto | suporte de analise, pode ser mantido temporariamente |
| `docs/anamnese_legado_zips_id1.txt` | `.txt` | inventario de zips | baixo | manter fora do commit por enquanto | apoio para rastreabilidade, sem valor final claro |
| `docs/anamnese_dry_run_plano_perguntas_eds70.json` | `.json` | plano de dry-run | medio | manter fora do commit por enquanto | pode ser util operacionalmente, mas ainda e plano de execucao |
| `docs/anamnese_dry_run_plano_questionarios_eds70.json` | `.json` | plano de dry-run | medio | manter fora do commit por enquanto | apoio tecnico de execucao |
| `docs/anamnese_seed_obrigatorio_plano.md` | `.md` | plano de seed obrigatorio | medio | manter fora do commit por enquanto | documento de trabalho, pode ficar fora ate consolidacao |
| `docs/anamnese_seed_obrigatorio_plano_por_clinica.json` | `.json` | plano por clinica | medio | manter fora do commit por enquanto | configuracao operacional de seed |
| `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt` | `.txt` | resultado pequeno de dry-run | medio | manter fora do commit por enquanto | pode servir como artefato, mas ainda e operacional |
| `docs/anamnese_seed_obrigatorio_implementacao_resultado.md` | `.md` | resultado de implementacao de seed | medio | manter fora do commit por enquanto | pode ser historico, mas precisa contexto antes de commit |

### 3.3 Arquivos de dados extraidos / candidatos que exigem cuidado antes de versionar

| Arquivo | Tipo | Provavel finalidade | Risco | Recomendacao | Justificativa |
|---|---|---|---|---|---|
| `docs/anamnese_eds70_extraido_perguntas.csv` | `.csv` | perguntas extraidas do EDS70 | alto | revisar manualmente antes de versionar | pode conter estrutura sensivel da anamnese |
| `docs/anamnese_eds70_extraido_questionarios.csv` | `.csv` | questionarios extraidos | medio | revisar manualmente antes de versionar | menos sensivel, mas ainda e dado extraido |
| `docs/anamnese_eds70_extraido_respostas_resumo.csv` | `.csv` | resumo agregado de respostas | alto | revisar manualmente antes de versionar | mesmo agregado, pode conter indicios de dado real |
| `docs/anamnese_seed_auditoria_clinicas_existentes.csv` | `.csv` | auditoria de clinicas existentes | alto | revisar manualmente antes de versionar | pode conter identificacao de tenants/clinicas reais |
| `docs/anamnese_seed_candidato_perguntas.csv` | `.csv` | candidato a seed de perguntas | alto | revisar manualmente antes de versionar | pode misturar conteudo real e candidata a importacao |
| `docs/anamnese_seed_candidato_questionarios.csv` | `.csv` | candidato a seed de questionarios | alto | revisar manualmente antes de versionar | precisa revisao de origem e granularidade |
| `docs/anamnese_legado_extraido_perguntas_id1.csv` | `.csv` | perguntas legadas extraidas | alto | revisar manualmente antes de versionar | pode refletir estrutura real ou legado sensivel |
| `docs/anamnese_legado_extraido_questionarios_id1.csv` | `.csv` | questionarios legados extraidos | alto | revisar manualmente antes de versionar | revisar se ha correspondencia com dados reais |
| `docs/anamnese_legado_extraido_respostas_id1.csv` | `.csv` | respostas legadas extraidas | muito alto | revisar manualmente antes de versionar | maior risco de conter dado clinico ou identificavel |

### 3.4 Arquivos SQL ou preview que exigem revisao antes de versionar

| Arquivo | Tipo | Provavel finalidade | Risco | Recomendacao | Justificativa |
|---|---|---|---|---|---|
| `docs/anamnese_dry_run_sql_preview_eds70.sql` | `.sql` | preview de importacao | medio | revisar manualmente antes de versionar | script de preview precisa checagem de impacto |
| `docs/sqlserver_anamnese_descoberta_eds70.sql` | `.sql` | descoberta SQL | medio | revisar manualmente antes de versionar | pode conter queries uteis, mas requer revisao |
| `docs/sqlserver_restore_eds70_anamnese_readonly.sql` | `.sql` | restore readonly | medio | revisar manualmente antes de versionar | ja listado como historico, mas continua exigindo leitura cuidadosa |
| `docs/restauracao_pre_anamnese_diff_antes.patch` | `.patch` | diff de restauracao anterior | baixo | manter fora do commit por enquanto | artefato de trabalho, nao e documento final |

### 3.5 Arquivos que podem ser candidatos a remocao futura

| Arquivo | Tipo | Provavel finalidade | Risco | Recomendacao | Justificativa |
|---|---|---|---|---|---|
| `docs/anamnese_legado_dumps_sql_id1.txt` | `.txt` | inventario/saida de dumps SQL | baixo | candidato a remocao futura | arquivo vazio, sem valor historico aparente |
| `docs/restauracao_pre_anamnese_diff_antes.patch` | `.patch` | suporte de restauracao | baixo | candidato a remocao futura | artefato intermediario de trabalho, pode ser redundante depois da documentacao final |
| `docs/anamnese_dry_run_resumo_eds70.txt` | `.txt` | resumo de dry-run | baixo | candidato a remocao futura | pode se tornar redundante se o conteudo ja estiver consolidado em MD final |
| `docs/anamnese_eds70_busca_strings.txt` | `.txt` | busca binaria/textual | baixo | candidato a remocao futura | util apenas como apoio operacional temporario |

## 4. Leitura geral por categoria

### Mais seguros para commit documental agora

Os arquivos abaixo parecem mais seguros para versionamento agora, porque sao historicos, descritivos e com baixo risco de conter dado sensivel:

- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_status_antes.txt`

### Exigem abertura manual antes

Os arquivos abaixo merecem leitura manual antes de qualquer commit:

- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_dry_run_sql_preview_eds70.sql`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

### Devem ser tratados como sensiveis

Os arquivos com maior cautela sao os que podem carregar dados reais, clinicos, identificaveis ou proximos do dado original:

- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`

### Nao devem entrar em commit ainda

Arquivos com papel mais operacional ou transitório:

- `docs/anamnese_eds70_busca_strings.txt`
- `docs/anamnese_eds70_descoberta_colunas.txt`
- `docs/anamnese_eds70_descoberta_tabelas.txt`
- `docs/anamnese_eds70_mapeamento_tabelas.txt`
- `docs/anamnese_eds70_restore_filelistonly.txt`
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/anamnese_dry_run_plano_perguntas_eds70.json`
- `docs/anamnese_dry_run_plano_questionarios_eds70.json`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_seed_obrigatorio_plano_por_clinica.json`
- `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`

## 5. Sugestao final de proximo passo

1. Versionar primeiro os documentos historicos de auditoria, roteiro, investigacao, restauracao e recomendacao.
2. Abrir manualmente os CSVs, seeds e SQLs antes de decidir qualquer commit.
3. Tratar como sensiveis os arquivos que podem expor dados reais ou identificaveis.
4. Deixar os artefatos operacionais, previews e sobras intermediarias fora do commit por enquanto.
5. Avaliar remocao futura apenas para arquivos vazios, redundantes ou puramente transitorios.

