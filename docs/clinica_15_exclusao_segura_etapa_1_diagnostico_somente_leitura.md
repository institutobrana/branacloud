# Exclusão Segura da Clínica 15 — Etapa 1 — Diagnóstico somente leitura

## 1. Objetivo
Documentar, em leitura somente, o estado real da clínica 15 antes de qualquer runner, backup, dry-run ou execução de exclusão segura.

## 2. Contexto
A clínica 15 foi criada no teste manual com `institutobrana@gmail.com` e ficou contaminada pelo fluxo anterior de signup/seed. O diagnóstico anterior já apontava o estado incorreto dos procedimentos, com `Tabela exemplo = 681` e `Brana = 0`. Esta etapa apenas confirma a situação para preparar a exclusão segura futura.

## 3. Contratos e documentos consultados
Documentos consultados para esta leitura:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`

## 4. Confirmação de que é somente leitura
Foram usados apenas comandos de leitura, `git status`/`git diff`/`git log` e consultas `SELECT`. Nenhum `UPDATE`, `DELETE`, `INSERT`, `signup`, `cleanup`, `runner --execute` ou operação de versionamento foi executada.

## 5. Banco identificado
- Banco: `brana_saas`
- Schema: `public`

## 6. Identidade da clínica 15
- `clinica_id = 15`
- nome: `Tel`
- e-mail: `institutobrana@gmail.com`
- tipo de conta: `DEMO 7 dias`
- ativo: `true`
- `criado_em`: `2026-05-23 15:44:57.179972-03:00`
- `trial_ate`: `2026-05-30 18:44:57.184422`
- `data_ativacao`: `null`
- `nome_tabela_procedimentos`: `Tabela Exemplo`

## 7. Confirmação de que é a conta contaminada
Sim. A clínica 15 corresponde ao teste manual contaminado do e-mail `institutobrana@gmail.com`, com a trilha anterior de Procedimentos incorreta (`Tabela exemplo = 681`, `Brana = 0`) e com resíduo de `email_codes`.

## 8. Usuários encontrados
Foram encontrados 2 usuários na clínica 15:
- `id=34`, `codigo=255`, nome `Clínica`, e-mail `clinica.255.c15@system.brana.local`, `is_admin=false`, `is_system_user=true`, `ativo=true`, `setup_completed=true`, `forcar_troca_senha=false`, `senha_hash` preenchido, `senha_interna_hash` nulo
- `id=35`, `codigo=1`, nome `Tel`, e-mail `institutobrana@gmail.com`, `is_admin=true`, `is_system_user=false`, `ativo=true`, `setup_completed=true`, `forcar_troca_senha=false`, `senha_hash` preenchido, `senha_interna_hash` preenchido

## 9. Prestadores encontrados
Foi encontrado 1 prestador na clínica 15:
- `id=21`, `clinica_id=15`, `usuario_id=34`, `source_id=255`, `codigo=001`, nome `Clínica`, apelido `Clínica`, tipo `Clínica odontológica`, `is_system_prestador=true`, `inativo=false`, `executa_procedimento=true`

## 10. Perfis / access_profile
Há 10 perfis padrão na clínica 15:
- `Agenda de horarios`
- `Controle de estoque`
- `Controle de protetico`
- `Controle de recibos`
- `Creditos na conta corrente`
- `Debitos na conta corrente`
- `Intervencoes`
- `Pacientes`
- `Relatorios estatisticos`
- `Relatorios financeiros`

Todos vieram como reservados. Não foi identificado perfil extra inesperado.

## 11. usuario_perfil_acesso
- quantidade encontrada: `0`
- não foram encontrados vínculos em `usuario_perfil_acesso` para a clínica 15

## 12. Procedimentos / tabelas
Tabelas de procedimento encontradas na clínica 15:
- `id=71`, `codigo=1`, nome `Tabela Exemplo`
- `id=72`, `codigo=4`, nome `Brana`

Não existe `PARTICULAR` na clínica 15.

Contagem de procedimentos:
- total da clínica 15: `681`
- `Tabela exemplo` (`tabela_id=71`): `681`
- `Brana` (`tabela_id=72`): `0`

Não foram encontradas duplicidades reais por `clinica_id + tabela_id + codigo`.
Não houve mistura com tabela de outra clínica.
Não foram encontrados procedimentos da clínica 15 apontando para `tabela_id` de outra clínica, nem o inverso.

## 13. Confirmação de Tabela exemplo e Brana
Confirmação registrada:
- `Tabela exemplo = 681`
- `Brana = 0`

O estado ainda é contaminado para a trilha de Procedimentos, embora a criação da conta tenha ocorrido com a tabela privada nomeada corretamente como `Brana`.

## 14. Vínculos de materiais / fases / procedimento generico
Situação encontrada na clínica 15:
- `procedimento_material`: `1627`
- `procedimento_fase`: `0`
- `procedimento.procedimento_generico_id` diferente de nulo: `0`

Conclusão:
- há vínculos de materiais em procedimentos já existentes
- não há fases vinculadas
- não há `procedimento_generico_id` preenchido nos procedimentos da clínica 15

## 15. email_codes
Para `institutobrana@gmail.com` foram encontrados 2 registros:
- `id=25`, `purpose=signup`, `used=false`, `created_at=2026-05-23 15:31:47.297773-03:00`, `expires_at=2026-05-23 18:41:47.297691`
- `id=26`, `purpose=signup`, `used=true`, `created_at=2026-05-23 15:44:30.132507-03:00`, `expires_at=2026-05-23 18:54:30.127251`

Conclusão: o e-mail ainda fica parcialmente preso por `email_codes` pendente (`used=false`).

## 16. Dados reais impeditivos
Não foram encontrados os bloqueios mais pesados esperados para exclusão de uma clínica com operação real:
- `pacientes`: `0`
- `tratamento`: `0`
- `lancamento`: `0`
- `assinaturas`: `0`
- `plataforma_cobrancas`: `0`
- `anamnese_respostas`: `0`
- `agenda_legado_evento`: `0`
- `agenda_legado_bloqueio`: `0`

Há dados operacionais e de catálogo vinculados à clínica:
- `usuarios`: `2`
- `prestador_odonto`: `1`
- `access_profile`: `10`
- `procedimento_tabela`: `2`
- `procedimento`: `681`
- `procedimento_material`: `1627`
- `procedimento_generico`: `591`
- `plataforma_assinaturas`: `1`

Conclusão: não apareceu impedimento real que descarte a clínica 15 da trilha segura; o cenário parece de conta de teste contaminada, com dados operacionais e de catálogo esperados para uma exclusão completa.

## 17. Catálogos / seeds encontrados
Contagens relevantes na clínica 15:
- `anamnese_perguntas`: `41`
- `anamnese_questionarios`: `3`
- `categoria_financeira`: `86`
- `convenio_odonto`: `10`
- `doenca_cid`: `14486`
- `grupo_financeiro`: `13`
- `indice_financeiro`: `4`
- `item_auxiliar`: `1226`
- `lista_material`: `1`
- `plano_odonto`: `10`
- `procedimento_generico`: `591`
- `simbolo_grafico_catalogo`: `138`
- `etiqueta_modelo`: `8`

Esses registros aparecem como catálogo/seed da clínica e devem entrar no planejamento de backup/exclusão futura conforme o contrato, mas não configuram impedimento para a fase de diagnóstico.

## 18. FKs / constraints relevantes
Principais relações relevantes para a ordem futura de exclusão:
- `usuario_perfil_acesso.perfil_id -> access_profile.id`
- `usuario_perfil_acesso.clinica_id -> clinicas.id`
- `usuario_perfil_acesso.usuario_id -> usuarios.id`
- `usuario_perfil_acesso.prestador_id -> prestador_odonto.id`
- `access_profile.clinica_id -> clinicas.id`
- `usuarios.clinica_id -> clinicas.id`
- `prestador_odonto.clinica_id -> clinicas.id`
- `prestador_odonto.usuario_id -> usuarios.id`
- `procedimento_tabela.clinica_id -> clinicas.id`
- `procedimento.clinica_id -> clinicas.id`
- `procedimento.tabela_id -> procedimento_tabela.id`
- `procedimento_material.procedimento_id -> procedimento.id`
- `procedimento_material.clinica_id -> clinicas.id`
- `procedimento_fase.procedimento_id -> procedimento.id`
- `procedimento_fase.clinica_id -> clinicas.id`

Outras tabelas com `clinica_id` também existem e devem ser consideradas no runner/backup futuro, incluindo catálogos, financeiros e agenda legada.

## 19. Riscos
- a clínica 15 ainda tem resíduo em `email_codes`
- há volume alto de dados de catálogo e procedimento, o que exige ordem segura de exclusão
- há 2 usuários e 1 prestador com vínculo à clínica
- há `procedimento_material` em volume alto
- o histórico de Procedimentos já mostrou roteamento incorreto em testes anteriores, então o próximo passo deve evitar qualquer alteração funcional e ficar apenas na trilha segura de exclusão

## 20. Recomendação da próxima etapa
Subetapa 3K — preparar runner/backup/dry-run para exclusão segura da clínica 15, sem `--execute`.

## 21. Confirmações finais
- nenhum código foi alterado nesta etapa
- banco não foi alterado
- não houve `UPDATE`, `DELETE` ou `INSERT`
- nenhuma clínica foi excluída
- nenhum `email_code` foi limpo
- Git não foi alterado
- a clínica 15 permanece como conta contaminada do teste manual e não deve ser usada para novo teste funcional
