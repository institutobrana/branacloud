# Auditoria documental dos pendentes pós-commit da modularização de Materiais

## 1. Objetivo
Documentar o estado atual dos arquivos pendentes após o commit/push da modularização segura parcial/conservadora de Materiais, classificando o que ficou como untracked e recomendando o tratamento conservador para cada grupo, sem alterar código, arquivos ou estado do Git.

## 2. Diretório real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Branch atual
`modularizacao-segura-fase-1`

## 4. Último commit confirmado
`a18cb48 - Conclui modularizacao segura parcial de materiais`

## 5. Confirmação de auditoria documental
Esta é uma auditoria documental, sem alteração funcional, sem commit, sem push, sem escrita em banco e sem modificação de arquivos.

## 6. Escopo
- Confirmar o `git status --short` real após o commit de Materiais
- Classificar os arquivos pendentes por grupo temático
- Identificar arquivos com possível risco de dados sensíveis
- Separar o que pertence a Anamnese, restauração, recomendações, mojibake e SQL auxiliar
- Recomendar o que fazer com cada grupo sem misturar com o próximo módulo

## 7. Fora de escopo
- Alterar código
- Alterar documentação existente
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
- leitura da blindagem textual/mojibake em `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 9. Estado do `git status --short` analisado
O status real analisado mostrou apenas arquivos `??` untracked, sem staged changes.

## 10. Quantidade total de arquivos pendentes
`42` arquivos untracked.

## 11. Classificação por grupo

### Grupo A - Anamnese / auditoria / extração / dry-run
`32` arquivos.

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

### Grupo B - Restauração / segurança de estado
`3` arquivos.

- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`

### Grupo C - Recomendações de próximos módulos
`4` arquivos.

- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`

### Grupo D - Mojibake / correção textual
`1` arquivo.

- `docs/frontend_correcao_mojibake_textos_interface.md`

### Grupo E - SQL auxiliar
`2` arquivos.

- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

## 12. Classificação por risco e destino

### Grupo F - Exige revisão antes de qualquer commit
Este grupo inclui os arquivos dos grupos A, B e D.

**Risco:** alto, porque a maior parte é extração bruta, auditoria, dados de legado, material de restauração ou documentação de correção textual que deve continuar sob blindagem.

**Recomendação:** revisão manual obrigatória antes de qualquer commit.

### Grupo G - Candidato a commit futuro
Este grupo inclui os arquivos do grupo C.

**Risco:** baixo a médio, por serem documentos de recomendação e planejamento.

**Recomendação:** podem ser commitados em fase própria, depois de conferência final de escopo, sem misturar com a próxima modularização.

### Grupo H - Candidato a não versionar / ignorar
Este grupo inclui os arquivos do grupo E.

**Risco:** alto, porque são SQL auxiliar / leitura read-only e podem ser artefatos temporários de descoberta.

**Recomendação:** manter local ou revisar manualmente antes de qualquer decisão de versionamento; não levar ao GitHub sem avaliação explícita.

## 13. Risco por grupo
- **Anamnese / auditoria / extração / dry-run:** risco alto de conter dados brutos, legado, seeds, CSVs, dumps e resultados de extração.
- **Restauração / segurança de estado:** risco médio/alto por conter patch, status anterior e artefatos temporários.
- **Recomendações de próximos módulos:** risco baixo, mas ainda recomendável revisão de escopo antes de commit.
- **Mojibake / correção textual:** risco médio, pois toca em orientação textual e precisa continuar blindado.
- **SQL auxiliar:** risco alto, pois tende a ser artefato operacional temporário e não deve ir automaticamente para GitHub.

## 14. Recomendação por grupo
- **Grupo A:** manter pendente e revisar manualmente antes de qualquer commit.
- **Grupo B:** manter pendente; decidir se o `.md` deve ser versionado em fase própria e descartar `patch/status` como artefato local.
- **Grupo C:** candidato a commit futuro em etapa separada.
- **Grupo D:** revisar manualmente antes de qualquer commit por envolver blindagem textual/mojibake.
- **Grupo E:** não versionar automaticamente; tratar como artefato local ou revisar manualmente antes de GitHub.

## 15. Arquivos que parecem não pertencer à próxima modularização
Todos os arquivos dos grupos A, B, D e E não devem ser misturados com a próxima modularização do próximo módulo.

## 16. Arquivos que não devem ser misturados com o próximo módulo
- os 32 arquivos do grupo A;
- os 3 arquivos do grupo B;
- o arquivo do grupo D;
- os 2 arquivos do grupo E.

## 17. Arquivos que podem exigir decisão do usuário
- `docs/restauracao_pre_anamnese.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- os 4 arquivos do grupo C, caso o usuário queira já organizá-los em um commit separado
- qualquer arquivo do grupo A que tenha conteúdo sensível e precise ficar local

## 18. Arquivos com maior risco de dados sensíveis
Principalmente os artefatos brutos do grupo A e os arquivos auxiliares do grupo E:
- CSVs de extração
- TXT de descoberta de tabelas/colunas/busca textual
- SQL de preview/restore
- dumps e inventários de legado
- arquivos de seed

## 19. Arquivos candidatos a commit futuro
Os candidatos mais seguros, em tese, são os do grupo C:
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`

## 20. Recomendação objetiva
**Revisar manualmente antes de qualquer commit** para os grupos A, B, D e E.  
**Separar em commit futuro próprio** apenas os documentos do grupo C, se forem realmente necessários.  
**Não apagar** nem `git clean` nada agora.

## 21. Próxima etapa recomendada
ROTA B como prioridade: abrir uma etapa específica para Anamnese e decidir, arquivo por arquivo, o que deve ficar local e o que pode ser versionado.  
Se o objetivo for apenas organizar o repositório, a ROTA C também é apropriada em etapa futura: criar uma regra de `.gitignore` para resultados brutos, CSVs, dumps e SQLs auxiliares.  
O próximo módulo só deve começar depois que esses pendentes forem isolados.

## 22. Confirmação de que nenhum `git add` foi executado
Confirmado. Nenhum `git add` foi executado.

## 23. Confirmação de que nenhum commit foi executado
Confirmado. Nenhum `git commit` foi executado.

## 24. Confirmação de que nenhum push foi executado
Confirmado. Nenhum `git push` foi executado.

## 25. Confirmação de que nenhum arquivo foi apagado, movido ou alterado
Confirmado. Nenhum arquivo pendente foi apagado, movido, renomeado ou alterado.

## 26. Confirmação de que backend/frontend/banco não foram alterados
Confirmado. Nada foi alterado no frontend, backend, banco, schema, migrations ou endpoints.

## 27. Confirmação de que a blindagem textual/mojibake foi respeitada
Confirmado. A análise foi documental e não alterou qualquer texto visível do sistema.

