# Triagem dos untracked restantes pos documentacao principal

## 1. Objetivo
Classificar os arquivos `untracked` restantes apos a consolidacao das trilhas principais do Brana Cloud, para orientar o que pode virar commit futuro, o que deve permanecer fora, o que e candidato a `.gitignore` e o que exige revisao humana antes de qualquer decisao.

## 2. Contexto
As trilhas principais recentes ja foram corrigidas, documentadas, commitadas e enviadas:

- `5c8ef7a` - Corrige login, senha interna e perfis de usuarios
- `8c1f7c5` - Corrige seed canonico Brana no signup
- `cb20715` - Documenta exclusao segura da clinica 15
- `9c4df78` - Documenta exclusoes seguras de clinicas de teste
- `680749d` - Documenta validacao final do signup com Brana
- `58c913d` - Audita documentacao geral do Brana Cloud
- `a513b67` - Atualiza indice e roadmap documental
- `0701705` - Atualiza READMEs do Brana Cloud

Os testes manuais passaram e o `git status` ainda exibe somente arquivos antigos fora do escopo principal.

## 3. Branch e estado Git
- Branch atual: `modularizacao-segura-fase-1`
- Estado inicial: sem tracked modificados, apenas `untracked`
- Quantidade aproximada de `untracked` restantes: `42`
- Nenhum `git add`, `git commit`, `git push`, `git reset`, `git restore` ou `git clean` foi executado nesta triagem

## 4. Comits recentes
Ultimos commits relevantes observados no log:

- `0701705` Atualiza READMEs do Brana Cloud
- `a513b67` Atualiza indice e roadmap documental
- `58c913d` Audita documentacao geral do Brana Cloud
- `680749d` Documenta validacao final do signup com Brana
- `9c4df78` Documenta exclusoes seguras de clinicas de teste
- `cb20715` Documenta exclusao segura da clinica 15
- `8c1f7c5` Corrige seed canonico Brana no signup
- `5c8ef7a` Corrige login, senha interna e perfis de usuarios
- `1472461` Documenta execucao parcial e diagnostico da clinica 8
- `ada701f` Documenta decisao para tratamento da clinica 8
- `f2e6d05` Documenta execucao e validacao da clinica 4
- `c3bed5a` Documenta decisao para demais clinicas existentes

## 5. Lista completa de untracked
```text
docs/anamnese_diagnostico_conta_gleissontel.md
docs/anamnese_dry_run_importacao_eds70_gleisson.md
docs/anamnese_dry_run_plano_perguntas_eds70.json
docs/anamnese_dry_run_plano_questionarios_eds70.json
docs/anamnese_dry_run_resumo_eds70.txt
docs/anamnese_dry_run_sql_preview_eds70.sql
docs/anamnese_eds70_busca_strings.txt
docs/anamnese_eds70_descoberta_colunas.txt
docs/anamnese_eds70_descoberta_tabelas.txt
docs/anamnese_eds70_extraido_perguntas.csv
docs/anamnese_eds70_extraido_questionarios.csv
docs/anamnese_eds70_extraido_respostas_resumo.csv
docs/anamnese_eds70_mapeamento_tabelas.txt
docs/anamnese_eds70_restore_filelistonly.txt
docs/anamnese_legado_bancos_sqlite_id1.txt
docs/anamnese_legado_busca_textual_id1.txt
docs/anamnese_legado_dumps_sql_id1.txt
docs/anamnese_legado_extraido_perguntas_id1.csv
docs/anamnese_legado_extraido_questionarios_id1.csv
docs/anamnese_legado_extraido_respostas_id1.csv
docs/anamnese_legado_inventario_fontes_id1.txt
docs/anamnese_legado_zips_id1.txt
docs/anamnese_seed_auditoria_clinicas_existentes.csv
docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md
docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md
docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv
docs/contrato_exclusao_segura_contas_clinicas.md
docs/frontend_correcao_mojibake_textos_interface.md
docs/indice_usuarios_access_profile_perfis_acesso.md
docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md
docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md
docs/inventario_organizacional_contratos_regras_seeds_usuarios.md
docs/plano_isolamento_pendencias_anamnese_restauracao.md
docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv
docs/restauracao_pre_anamnese.md
docs/restauracao_pre_anamnese_diff_antes.patch
docs/restauracao_pre_anamnese_status_antes.txt
docs/revisao_humana_md_anamnese_pendentes.md
docs/sqlserver_anamnese_descoberta_eds70.sql
docs/sqlserver_restore_eds70_anamnese_readonly.sql
git
modularizacao-segura-fase-1
```

## 6. Classificacao por grupos

### Grupo A - Anamnese / SQLServer / restauracao
Quantidade: `8`

- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `docs/restauracao_pre_anamnese.md`

Risco: alto para mistura de trilhas antigas com a documentacao principal.
Recomendacao: manter fora dos commits atuais; so retomar em trilha separada.

### Grupo B - Contratos gerais / indices / inventarios ainda pendentes
Quantidade: `4`

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`

Risco: medio-alto; podem ser documentos importantes, mas exigem confirmacao de vigencia antes de virar commit.
Recomendacao: candidatos a commit futuro em trilha propria de consolidacao documental.

### Grupo C - Auditorias Git / organizacao
Quantidade: `2`

- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`
- `docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md`

Risco: baixo para o sistema, medio para a organizacao do repositório.
Recomendacao: candidatos a commit futuro de organizacao/auditoria, sem misturar com funcionalidade.

### Grupo D - Materiais / Procedimentos / Intervencoes antigos fora da trilha ja commitada
Quantidade: `4`

- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`

Risco: medio; podem ser historicos uteis, mas nao devem entrar no fluxo atual de Brana/signup/exclusao segura.
Recomendacao: candidatos a commit futuro em trilha historica separada, se ainda forem relevantes.

### Grupo E - Arquivos tecnicos temporarios, dumps, CSVs, patches
Quantidade: `22`

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
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

Risco: alto de serem apenas artefatos de leitura, dump ou preview.
Recomendacao: candidatos fortes a `.gitignore` ou limpeza futura, mas nao remover sem revisao humana.

### Grupo F - Arquivos suspeitos ou soltos
Quantidade: `2`

- `git`
- `modularizacao-segura-fase-1`

Risco: alto; nomes estranhos na raiz, possivel sobra de processo manual.
Recomendacao: nao remover sem revisao humana; tratar em etapa separada.

### Grupo G - Candidatos a `.gitignore`
Quantidade: `22`

Os melhores candidatos a ignorar ou tratar como artefatos temporarios sao os arquivos do Grupo E, sobretudo:

- previews, dry-runs, dumps, patches e extracoes temporarias
- `docs/anamnese_dry_run_*`
- `docs/anamnese_eds70_*`
- `docs/anamnese_legado_*` de extração/dump
- `docs/restauracao_pre_anamnese_*`
- `docs/sqlserver_*`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`

Recomendacao: antes de qualquer `.gitignore`, confirmar se algum desses arquivos precisa virar historico versionado.

### Grupo H - Candidatos a commit futuro
Quantidade: `10` em prioridade mais alta

Prioridade alta para commit futuro, em trilhas proprias:

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`
- `docs/auditoria_git_pre_organizacao_commits_pos_clinica15.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`
- `docs/frontend_correcao_mojibake_textos_interface.md`

Observacao: alguns desses arquivos tambem sao candidatos a padronizacao ou consolidacao antes de um commit futuro.

## 7. Arquivos que nao devem entrar em commit agora
- Toda a familia `docs/anamnese_*`
- Toda a familia `docs/sqlserver_*`
- Toda a familia `docs/restauracao_*`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `git`
- `modularizacao-segura-fase-1`
- dumps, previews, patches e extracoes temporarias do Grupo E

## 8. Candidatos a limpeza futura
Sem remover agora e sem decidir sem revisao humana:

- `git`
- `modularizacao-segura-fase-1`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`
- `docs/anamnese_dry_run_*`
- `docs/sqlserver_*`
- `docs/anamnese_legado_dumps_sql_id1.txt`

## 9. Riscos
- Misturar anamnese/SQLServer/restauracao com a documentacao principal pode confundir o estado valido atual.
- Arquivos temporarios podem ser confundidos com historico oficial se entrarem em commit sem triagem.
- Os arquivos soltos da raiz podem ser artefatos de processo manual e merecem revisao humana antes de qualquer limpeza.
- Contratos e indices pendentes devem ser conferidos antes de virar commit futuro, para nao cristalizar documento desatualizado.

## 10. Recomendacao da proxima etapa
1. Tratar os documentos do Grupo B e do Grupo C em trilhas separadas, se forem realmente vigentes.
2. Separar o que e historico do que e artefato temporario no Grupo E antes de qualquer decisao de commit ou limpeza.
3. Revisar os arquivos soltos da raiz com validacao humana antes de remover qualquer coisa.
4. Manter fora da trilha principal os arquivos de anamnese/SQLServer/restauracao ate haver decisao explicita.

## 11. Confirmacoes
- Somente este documento foi criado nesta etapa.
- Nenhum codigo foi alterado.
- Nenhum documento existente foi alterado.
- Nao houve `git add`, `git commit`, `git push`, `git reset`, `git restore` ou `git clean`.
- Nao houve execucao de scripts, runners, signup ou alteracoes de banco.
- A blindagem textual/mojibake foi respeitada.
