# Revisao humana dos .md pendentes de Anamnese

## 1. Objetivo
Revisar somente os arquivos `.md` pendentes de Anamnese, separando o que parece seguro para versionamento futuro, o que exige revisao humana mais cuidadosa, o que deve ficar local e o que apresenta risco de dados sensiveis.

## 2. Diretorio real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Branch atual
`modularizacao-segura-fase-1`

## 4. Ultimo commit confirmado
`a18cb48 - Conclui modularizacao segura parcial de materiais`

## 5. Confirmacao de revisao documental
Esta e uma revisao documental, sem alteracao funcional, sem commit, sem push, sem escrita em banco e sem modificacao de arquivos.

## 6. Escopo
- Confirmar o `git status --short` real para os `.md` de Anamnese
- Classificar arquivo por arquivo
- Separar documentos seguros, duvidosos, operacionais e de alto risco
- Identificar risco de dados sensiveis
- Recomendar o destino futuro de cada arquivo sem alterar nada

## 7. Fora de escopo
- Alterar codigo
- Alterar documentacao existente
- Apagar, mover ou renomear arquivos
- Executar `git add`, `git commit`, `git push`, `git restore`, `git clean`, `git reset` ou `git stash`
- Rodar servidor
- Mexer em banco

## 8. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -5`
- `Get-ChildItem -Path 'D:\BRANA ARQUIVOS\BRANA CLOUD\docs' -Filter 'anamnese*.md'`
- leitura da blindagem textual/mojibake em `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- leitura de `docs/auditoria_pendencias_pos_commit_materiais.md`
- leitura de `docs/auditoria_especifica_pendencias_anamnese.md`
- leitura parcial dos arquivos `.md` de Anamnese para validacao de risco

## 9. Estado do `git status --short` analisado
O status real analisado mostrou 42 arquivos `??` untracked. Desses, 23 eram arquivos `.md` de Anamnese nesta revisao.

## 10. Lista de arquivos `.md` de Anamnese analisados
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_correcao_duplo_clique_pergunta.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_importacao_eds70_gleisson_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`
- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`

## 11. Quantidade total de `.md` de Anamnese analisados
`23` arquivos.

## 12. Classificacao por categoria
- Documentacao segura candidata a commit futuro: `8`
- Revisao humana obrigatoria: `3`
- Nao recomendado para GitHub agora: `4`
- Manter local / operacional: `2`
- Alto risco de dados sensiveis: `6`

## 13. Tabela arquivo por arquivo
| nome | tema provavel | categoria | risco | recomendacao | justificativa curta |
| --- | --- | --- | --- | --- | --- |
| `docs/anamnese_auditoria_legado_desktop_id1.md` | auditoria de legado desktop | E | Alto | Manter local; revisar manualmente antes de qualquer commit | Auditoria ligada a conta/clinica especifica e possivel inventario historico. |
| `docs/anamnese_auditoria_legado_id1.md` | auditoria de legado | E | Alto | Manter local; revisar manualmente antes de qualquer commit | Documento de legado com referencia a identificadores e fontes historicas. |
| `docs/anamnese_busca_ponto_anterior_lista_questionarios.md` | investigacao de comportamento de listas | B | Medio | Revisar manualmente antes de commit | Documento tecnico util, mas ligado a caso real e a listas de questionarios. |
| `docs/anamnese_correcao_duplo_clique_pergunta.md` | correcao funcional pontual | B | Medio | Revisar manualmente antes de commit | Bug fix de UI; e util, mas precisa confirmar que nao carrega dado sensivel. |
| `docs/anamnese_diagnostico_conta_gleissontel.md` | diagnostico de conta | E | Alto | Manter local; nao enviar ao GitHub agora | Referencia diretamente conta real e contexto clinico. |
| `docs/anamnese_dry_run_importacao_eds70_gleisson.md` | dry-run de importacao | E | Alto | Manter local; nao enviar ao GitHub agora | Artefato operacional com identificacao nominal e risco alto. |
| `docs/anamnese_extracao_eds70_sqlserver_resultado.md` | resultado de extracao | C | Medio | Nao versionar agora; revisar manualmente | Resultado bruto de extracao; e util, mas ainda nao e seguro para commit imediato. |
| `docs/anamnese_importacao_eds70_gleisson_resultado.md` | resultado de importacao | C | Medio | Nao versionar agora; revisar manualmente | Resultado operacional de importacao; melhor manter fora do GitHub agora. |
| `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md` | investigacao de tenant e fonte | E | Alto | Manter local; nao enviar ao GitHub agora | Traz tenant/clinica/fonte de dados de caso real. |
| `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md` | recuperacao e consolidacao de seed | D | Medio | Manter local / operacional | Registro operacional de recuperacao e seed, com valor historico limitado. |
| `docs/anamnese_roteiro_extracao_eds70_sqlserver.md` | roteiro tecnico de extracao | A | Baixo | Candidato a commit futuro | Documento tecnico mais estavel, sem indicio de dado bruto. |
| `docs/anamnese_seed_obrigatorio_implementacao_resultado.md` | resultado de implementacao de seed | C | Medio | Nao versionar agora; revisar manualmente | Resultado de implementacao/operacao, mais util localmente neste momento. |
| `docs/anamnese_seed_obrigatorio_plano.md` | plano de seed obrigatorio | D | Medio | Manter local / operacional | Plano operacional de recuperacao/seed; nao precisa ir ao GitHub agora. |
| `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md` | revisao pos-recuperacao | B | Medio | Revisar manualmente antes de commit | Contexto tecnico util, mas ligado a recuperacao de conta/clinica especifica. |
| `docs/anamnese_subetapa_1_namespace_passivo.md` | namespace passivo | A | Baixo | Candidato a commit futuro | Documento tecnico estavel e sem dados sensiveis aparentes. |
| `docs/anamnese_subetapa_2_fronteiras_contratos.md` | fronteiras e contratos | A | Baixo | Candidato a commit futuro | Documento tecnico estavel e util para historico do modulo. |
| `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md` | helper puro de validacao | A | Baixo | Candidato a commit futuro | Documento tecnico de helper puro, sem indicios de dados sensiveis. |
| `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md` | helper puro de validacao | A | Baixo | Candidato a commit futuro | Continuidade tecnica do ciclo de helpers textuais. |
| `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md` | integracao com fallback local | A | Baixo | Candidato a commit futuro | Registro tecnico de integracao minima e conservadora. |
| `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md` | integracao com fallback local | A | Baixo | Candidato a commit futuro | Registro tecnico estavel, sem exposicao de dados brutos. |
| `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md` | encerramento do ciclo tecnico | A | Baixo | Candidato a commit futuro | Documento de fechamento tecnico do ciclo de helpers textuais. |
| `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md` | validacao final apos importacao | C | Medio | Nao versionar agora; revisar manualmente | Resultado de validacao operacional de caso real. |
| `docs/anamnese_varredura_eds70_bak_mdf_id1.md` | varredura de backup/mdf | E | Alto | Manter local; nao enviar ao GitHub agora | Explora backup e banco legado de caso real; alto risco de informacao sensivel. |

## 14. Arquivos que podem ser candidatos a commit futuro
- `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`

## 15. Arquivos que exigem revisao humana antes de commit
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_correcao_duplo_clique_pergunta.md`
- `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`

## 16. Arquivos que devem ficar fora do GitHub agora
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_busca_ponto_anterior_lista_questionarios.md`
- `docs/anamnese_correcao_duplo_clique_pergunta.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_importacao_eds70_gleisson_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
- `docs/anamnese_subetapa_1_namespace_passivo.md`
- `docs/anamnese_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`

## 17. Arquivos que parecem locais/operacionais
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`
- `docs/anamnese_seed_obrigatorio_plano.md`

## 18. Arquivos com maior risco de dados sensiveis
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/anamnese_diagnostico_conta_gleissontel.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/anamnese_varredura_eds70_bak_mdf_id1.md`

## 19. Recomendacao especifica para arquivos citados

### `anamnese_roteiro_extracao_eds70_sqlserver.md`
- Parece ser o melhor candidato a commit futuro entre os `.md` revisados.
- Ainda assim, vale uma confirmacao final do usuario antes de versionar.

### `anamnese_diagnostico_conta_gleissontel.md`
- Deve ficar local por enquanto.
- Nao deve ir ao GitHub sem revisao humana mais cuidadosa, pois cita conta real e contexto clinico.

### `anamnese_dry_run_importacao_eds70_gleisson.md`
- Deve permanecer local.
- O risco e alto por ser dry-run de importacao com identificacao nominal.

### `anamnese_investigacao_clinica_tenant_fonte_dados.md`
- Deve permanecer fora do GitHub agora.
- Requer revisao humana obrigatoria por envolver tenant, clinica e fonte de dados.

### `anamnese_extracao_eds70_sqlserver_resultado.md`
- Nao deve entrar no GitHub agora.
- E um resultado de extracao e deve passar por revisao humana antes de qualquer commit.

## 20. Recomendacao objetiva
- O que poderia ser commitado futuramente: apenas os 8 documentos da categoria A, apos confirmacao explicita do usuario
- O que manter pendente: os documentos da categoria B
- O que revisar manualmente: os documentos da categoria B antes de qualquer commit
- O que manter local: as categorias C, D e E
- O que nao deve ir ao GitHub agora: qualquer arquivo com resultado bruto, operacao local, dry-run, conta real, tenant, clinica ou contexto de extracao/validacao de caso real

## 21. Proxima etapa recomendada
ROTA A - commit separado futuro apenas dos `.md` realmente seguros, apos confirmacao explicita do usuario, mantendo o restante pendente e fora do GitHub.

## 22. Confirmacao de ausencia de alteracoes de Git
Nenhum `git add` foi executado.

## 23. Confirmacao de ausencia de commit
Nenhum `git commit` foi executado.

## 24. Confirmacao de ausencia de push
Nenhum `git push` foi executado.

## 25. Confirmacao de ausencia de alteracoes em arquivos
Nenhum arquivo foi apagado, movido ou alterado.

## 26. Confirmacao de ausencia de alteracoes funcionais
Backend, frontend e banco nao foram alterados.

## 27. Confirmacao da blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada; nenhum texto do sistema foi corrigido ou alterado nesta revisao.
