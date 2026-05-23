# Clínica 15 — Exclusão segura — Etapa 3 — Execução real controlada

## 1. Objetivo
Executar uma única vez a exclusão real controlada da clínica 15 e validar, por auditoria pós-exclusão somente leitura, que a conta contaminada foi removida integralmente e que `institutobrana@gmail.com` ficou liberado para novo cadastro.

## 2. Contexto
A clínica 15 era a conta de teste contaminada do e-mail `institutobrana@gmail.com`, criada antes da correção final do seed canônico da Brana. O diagnóstico anterior confirmou o estado incorreto:
- `Tabela Exemplo = 681`
- `Brana = 0`
- `PARTICULAR` ausente
- `email_codes` com resíduo pendente
- sem dados reais impeditivos pesados para exclusão segura

## 3. Contrato / documentos consultados
Documentos consultados nesta etapa:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 4. Confirmação do backup existente
Backup prévio confirmado em:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\clinica_15_pre_exclusao`

## 5. Confirmação do dry-run anterior
O dry-run anterior foi documentado com sucesso em:
- `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`

## 6. Comando exato executado com `--execute`
Comando executado uma única vez:
```powershell
.\.venv\Scripts\python.exe backend\scripts\delete_test_clinic_15_runner.py --clinica-id 15 --expected-email institutobrana@gmail.com --execute
```

## 7. Confirmação de execução única
Sim. O comando com `--execute` foi executado uma única vez e não foi repetido após o sucesso.

## 8. Resultado da execução
A execução real controlada concluiu com sucesso.

Resumo do runner:
- `DELETE email_codes por email: 2`
- `DELETE procedimento_material: 1627`
- `DELETE procedimento_fase: 0`
- `DELETE procedimento_generico_material: 0`
- `DELETE procedimento_generico_fase: 0`
- `DELETE material por lista_material: 244`
- `DELETE lista_material: 1`
- `DELETE anamnese_perguntas: 41`
- `DELETE anamnese_questionarios: 3`
- `DELETE procedimento: 681`
- `DELETE procedimento_generico: 591`
- `DELETE procedimento_tabela: 2`
- `DELETE plano_odonto: 10`
- `DELETE convenio_odonto: 10`
- `DELETE categoria_financeira: 86`
- `DELETE grupo_financeiro: 13`
- `DELETE indice_financeiro: 4`
- `DELETE item_auxiliar: 1226`
- `DELETE simbolo_grafico_catalogo: 138`
- `DELETE doenca_cid: 14486`
- `DELETE anamnese_respostas: 0`
- `DELETE assinaturas: 0`
- `DELETE plataforma_assinaturas: 1`
- `DELETE plataforma_cobrancas: 0`
- `DELETE usuario_perfil_acesso: 0`
- `DELETE access_profile: 10`
- `DELETE etiqueta_modelo: 8`
- `DELETE prestador_odonto: 1`
- `DELETE usuarios: 2`
- `DELETE clinicas por id/email: 1`

O runner informou que a transação foi concluída com commit apenas ao final da rotina.

## 9. Contagens removidas pelo runner
Contagens principais removidas:
- `email_codes = 2`
- `procedimento_material = 1627`
- `material = 244`
- `lista_material = 1`
- `anamnese_perguntas = 41`
- `anamnese_questionarios = 3`
- `procedimento = 681`
- `procedimento_generico = 591`
- `procedimento_tabela = 2`
- `plano_odonto = 10`
- `convenio_odonto = 10`
- `categoria_financeira = 86`
- `grupo_financeiro = 13`
- `indice_financeiro = 4`
- `item_auxiliar = 1226`
- `simbolo_grafico_catalogo = 138`
- `doenca_cid = 14486`
- `plataforma_assinaturas = 1`
- `access_profile = 10`
- `etiqueta_modelo = 8`
- `prestador_odonto = 1`
- `usuarios = 2`
- `clinicas = 1`

## 10. Auditoria pós-exclusão
Auditoria pós-exclusão somente leitura confirmou:
- `clinicas.id = 15`: `0`
- clínica com e-mail `institutobrana@gmail.com`: `0`
- usuário com e-mail `institutobrana@gmail.com`: `0`
- `usuarios.id IN (34, 35)`: `0`
- usuários com `clinica_id = 15`: `0`
- `prestador_odonto.id = 21`: `0`
- prestadores com `clinica_id = 15`: `0`
- `access_profile` com `clinica_id = 15`: `0`
- `usuario_perfil_acesso` com `clinica_id = 15`: `0`
- `procedimento_tabela` com `clinica_id = 15`: `0`
- `procedimento` com `clinica_id = 15`: `0`
- `procedimento_material` vinculado à clínica 15: `0`
- `procedimento_fase` vinculado à clínica 15: `0`
- `procedimento_generico` com `clinica_id = 15`: `0`
- `procedimento_generico_material` ligado à clínica 15: `0`
- `procedimento_generico_fase` ligado à clínica 15: `0`
- `lista_material` com `clinica_id = 15`: `0`
- `material` ligado à clínica 15: `0`
- `etiqueta_modelo` com `clinica_id = 15`: `0`
- `convenio_odonto` com `clinica_id = 15`: `0`
- `plano_odonto` com `clinica_id = 15`: `0`
- `anamnese_questionarios` com `clinica_id = 15`: `0`
- `anamnese_perguntas` com `clinica_id = 15`: `0`
- `categoria_financeira` com `clinica_id = 15`: `0`
- `grupo_financeiro` com `clinica_id = 15`: `0`
- `indice_financeiro` com `clinica_id = 15`: `0`
- `item_auxiliar` com `clinica_id = 15`: `0`
- `simbolo_grafico_catalogo` com `clinica_id = 15`: `0`
- `doenca_cid` com `clinica_id = 15`: `0`
- `assinaturas` com `clinica_id = 15`: `0`
- `plataforma_assinaturas` com `clinica_id = 15`: `0`
- `plataforma_cobrancas` com `clinica_id = 15`: `0`
- `email_codes` para `institutobrana@gmail.com`: `0`

Total de clínicas remanescentes no banco:
- `2`

## 11. Confirmação de que clínica 15 não existe mais
Confirmado por SELECT: a clínica 15 não existe mais no banco.

## 12. Confirmação de que `institutobrana@gmail.com` foi liberado
Confirmado por SELECT: não existe mais clínica nem usuário com `institutobrana@gmail.com`, e `email_codes` para esse e-mail está em `0`.

## 13. Confirmação de que `email_codes` foram removidos
Sim. Os dois registros de `email_codes` foram removidos na execução real controlada.

## 14. Confirmação de remoção dos vínculos da clínica 15
Confirmado:
- usuários removidos
- prestador removido
- perfis/access_profile removidos
- procedimentos, tabelas, materiais vinculados e seeds de catálogo removidos
- registros de assinatura/plataforma removidos

## 15. Confirmação de que nenhuma outra clínica foi afetada
Confirmado. As demais clínicas permanecem no banco; a auditoria indicou `2` clínicas remanescentes.

## 16. Riscos / remanescentes
Não há risco remanescente identificado para a clínica 15, pois a conta e seus vínculos foram removidos. O próximo passo já pode ser o teste manual limpo do signup.

## 17. Próxima etapa recomendada
Subetapa 3M — novo teste manual limpo criando conta com `institutobrana@gmail.com`, validando login/senha interna e seed canônico Brana.

## 18. Confirmações finais
- Git não foi alterado nesta etapa
- nenhum `UPDATE`, `DELETE` ou `INSERT` manual foi executado fora do runner
- nenhuma outra clínica foi tocada
- mojibake/UTF-8 não foi corrigido nesta etapa
