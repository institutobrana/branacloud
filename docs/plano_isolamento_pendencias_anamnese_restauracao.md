# Plano de isolamento dos pendentes de Anamnese e restauracao

## 1. Objetivo
Consolidar o destino recomendado para os arquivos pendentes atuais, separando Anamnese, restauracao, CSV, JSON, SQL, TXT, mojibake e recomendacoes, sem alterar nada e sem misturar com o proximo modulo.

## 2. Diretorio real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Branch atual
`modularizacao-segura-fase-1`

## 4. Ultimo commit confirmado
`a18cb48 - Conclui modularizacao segura parcial de materiais`

## 5. Confirmacao de plano documental
Este e um plano documental, sem alteracao funcional, sem commit, sem push, sem escrita em banco e sem modificacao de arquivos.

## 6. Escopo
- Consolidar a decisao sobre os pendentes atuais no Git
- Separar o que fica fora do proximo commit
- Separar o que pode virar commit futuro separado
- Separar o que deve permanecer local ou operacional
- Preparar o terreno para escolher o proximo modulo sem misturar pendencias antigas

## 7. Fora de escopo
- Alterar codigo
- Alterar documentacao existente
- Apagar, mover ou renomear arquivos
- Executar `git add`, `git commit`, `git push`, `git restore`, `git clean`, `git reset` ou `git stash`
- Rodar servidor
- Mexer em banco
- Criar `.gitignore` nesta etapa

## 8. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -5`
- `git diff --stat`
- `git diff --cached --stat`
- `dir docs`
- `dir docs\anamnese*`
- leitura de `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- leitura de `docs/auditoria_pendencias_pos_commit_materiais.md`
- leitura de `docs/auditoria_especifica_pendencias_anamnese.md`
- leitura de `docs/revisao_humana_md_anamnese_pendentes.md`

## 9. Estado do `git status --short` analisado
O status real observado no inicio desta etapa mostrava `45` arquivos `??` untracked. Depois da criacao deste proprio plano, o working tree passou a ter `46` arquivos `??` untracked.

## 10. Resumo das auditorias anteriores
- O commit de Materiais foi concluido com sucesso em `a18cb48`
- A auditoria de pendencias pos-commit classificou os pendentes gerais
- A auditoria especifica de Anamnese separou os arquivos de Anamnese
- A revisao humana dos `.md` de Anamnese consolidou o que parece seguro, o que precisa revisao e o que e risco alto

## 11. Quantidade total de pendentes atuais
`46` arquivos untracked.

## 12. Grupos de isolamento

### Grupo A - Anamnese `.md` candidatos seguros
Quantidade: `1`

- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`

Destino recomendado:
- possivel commit futuro separado
- somente apos confirmacao explicita do usuario
- nao misturar com o proximo modulo

### Grupo B - Anamnese `.md` com revisao humana obrigatoria
Quantidade: `1`

- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`

Destino recomendado:
- manter pendente
- revisao humana obrigatoria antes de GitHub
- nao misturar com o proximo modulo

### Grupo C - Anamnese `.md` nao recomendado para GitHub agora
Quantidade: `1`

- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`

Destino recomendado:
- manter local ou pendente
- nao versionar agora
- avaliar sanitizacao futura, se necessario

### Grupo D - Anamnese `.md` local / operacional
Quantidade: `0`

Destino recomendado:
- nenhum arquivo atual neste grupo

### Grupo E - Anamnese `.md` alto risco de dados sensiveis
Quantidade: `6`

- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`

Destino recomendado:
- manter fora do GitHub agora
- revisao humana obrigatoria
- nao commitar
- nao apagar
- nao mover nesta etapa

### Grupo F - CSV / JSON / SQL / TXT brutos de Anamnese
Quantidade: `25`

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
- `docs/anamnese_legado_bancos_sqlite_id1.txt`
- `docs/anamnese_legado_busca_textual_id1.txt`
- `docs/anamnese_legado_dumps_sql_id1.txt`
- `docs/anamnese_legado_extraido_perguntas_id1.csv`
- `docs/anamnese_legado_extraido_questionarios_id1.csv`
- `docs/anamnese_legado_extraido_respostas_id1.csv`
- `docs/anamnese_legado_inventario_fontes_id1.txt`
- `docs/anamnese_legado_zips_id1.txt`
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv`
- `docs/anamnese_seed_candidato_perguntas.csv`
- `docs/anamnese_seed_candidato_questionarios.csv`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

Destino recomendado:
- manter fora do GitHub agora
- candidatos a `.gitignore` futuro
- nao commitar
- nao apagar
- nao mover nesta etapa

### Grupo G - Restauracao / seguranca de estado
Quantidade: `3`

- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`

Destino recomendado:
- revisao humana obrigatoria antes de GitHub
- pode conter diff, status ou caminhos sensiveis
- nao misturar com o proximo modulo

### Grupo H - Recomendacoes de proximos modulos
Quantidade: `4`

- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`

Destino recomendado:
- candidatos a commit futuro separado
- baixo risco relativo
- nao misturar com codigo funcional
- confirmar antes com o usuario

### Grupo I - Mojibake / correcao textual
Quantidade: `1`

- `docs/frontend_correcao_mojibake_textos_interface.md`

Destino recomendado:
- revisao humana obrigatoria
- nao misturar com modularizacao
- respeitar as regras de blindagem textual/mojibake

### Grupo J - Documentos de suporte da trilha de auditoria
Quantidade: `4`

- `docs/plano_isolamento_pendencias_anamnese.md`
- `docs/auditoria_especifica_pendencias_anamnese.md`
- `docs/auditoria_pendencias_pos_commit_materiais.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`

Destino recomendado:
- manter isolados da proxima mudanca funcional
- podem virar commit documental separado futuro se o usuario quiser preservar a trilha
- nao misturar com o proximo modulo

## 13. Destino recomendado por grupo
- Grupo A: possivel commit futuro separado, somente com confirmacao explicita
- Grupo B: manter pendente e revisar manualmente
- Grupo C: manter local ou pendente, sem GitHub agora
- Grupo D: nenhum atual
- Grupo E: manter fora do GitHub agora
- Grupo F: manter fora do GitHub agora e considerar `.gitignore` futuro
- Grupo G: revisao humana obrigatoria antes de GitHub
- Grupo H: possivel commit futuro separado
- Grupo I: revisao humana obrigatoria
- Grupo J: manter isolados; decidir depois se vao para um commit documental separado

## 14. Risco por grupo
- Grupo A: baixo
- Grupo B: medio
- Grupo C: medio
- Grupo D: medio
- Grupo E: alto
- Grupo F: alto por natureza de dado bruto
- Grupo G: medio/alto
- Grupo H: baixo
- Grupo I: medio
- Grupo J: baixo, mas deve ficar isolado do proximo modulo

## 15. O que deve ficar fora do proximo commit
- Todos os arquivos dos Grupos B, C, D, E, F, G e I
- Os documentos de suporte do Grupo J, ate o usuario decidir se quer versiona-los em commit documental separado
- Qualquer arquivo bruto de extraicao, preview, dump, seed, restore ou inventario

## 16. O que pode virar commit separado futuro
- Grupo A
- Grupo H
- Grupo J, somente se o usuario quiser preservar a trilha documental como historico versionado

## 17. O que deve ficar local / pendente
- Grupos B, C, D, E, F, G e I
- Grupo J, ate decisao explicita do usuario

## 18. O que pode futuramente entrar em `.gitignore`
- Artefatos brutos do Grupo F
- Previews, dry-runs, dumps, extractions, seeds e resultados auxiliares
- Nenhum ajuste de `.gitignore` nesta etapa

## 19. O que exige revisao humana obrigatoria
- Grupos B, E, G e I
- Qualquer item do Grupo C que possa conter dado real ou resultado bruto
- Qualquer item do Grupo J se o usuario quiser transforma-lo em commit futuro

## 20. Regras para nao misturar com o proximo modulo
- Nao apagar nada
- Nao mover nada
- Nao renomear nada
- Nao usar `git add` geral
- Nao usar `git clean`
- Nao usar `git restore`
- Nao commitar nada agora
- Nao criar `.gitignore` agora
- Nao misturar pendencias antigas com a proxima modularizacao

## 21. Recomendacao objetiva
- Manter os grupos F, G, I e a maior parte dos B/E fora do GitHub agora
- Separar o Grupo A como unico candidato claro a commit futuro tecnico
- Tratar o Grupo H como possivel commit documental separado futuro
- Manter o Grupo J isolado ate decisao explicita do usuario
- Escolher o proximo modulo somente depois de isolar conscientemente essas pendencias

## 22. Proxima etapa recomendada
ROTA D - escolher o proximo modulo mantendo os pendentes isolados conscientemente; se houver necessidade de versionamento, abrir antes uma etapa separada para os Grupos A, H e J.

## 23. Confirmacao de ausencia de alteracoes de Git
Nenhum `git add` foi executado.

## 24. Confirmacao de ausencia de commit
Nenhum `git commit` foi executado.

## 25. Confirmacao de ausencia de push
Nenhum `git push` foi executado.

## 26. Confirmacao de ausencia de alteracoes em arquivos
Nenhum arquivo foi apagado, movido ou alterado.

## 27. Confirmacao de ausencia de alteracoes funcionais
Backend, frontend e banco nao foram alterados.

## 28. Confirmacao da blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada; nenhum texto do sistema foi corrigido ou alterado nesta etapa.
