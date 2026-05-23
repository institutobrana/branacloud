# Clínica 15 — Exclusão segura — Etapa 2 — Runner, backup e dry-run sem `--execute`

## 1. Objetivo
Preparar o backup/export e o runner de exclusão segura da clínica 15, executar apenas backup/export e dry-run sem `--execute`, e deixar a exclusão real para uma etapa futura controlada.

## 2. Contexto
A clínica 15 é a conta contaminada do teste manual com `institutobrana@gmail.com`. O diagnóstico da etapa anterior confirmou:
- `clinica_id = 15`
- nome `Tel`
- `Tabela exemplo = 681`
- `Brana = 0`
- `PARTICULAR` ausente
- `email_codes` com resíduo pendente
- ausência de dados reais impeditivos pesados como pacientes, tratamentos e lançamentos

## 3. Contratos e documentos consultados
Documentos consultados nesta etapa:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 4. Confirmação de que não houve execução real
- `--execute` não foi usado.
- Nenhuma exclusão real foi executada.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi aplicado ao banco.
- O backup/export e o dry-run foram somente leitura.

## 5. Arquivos/scripts criados ou alterados
Arquivos criados nesta etapa:
- [`backend/scripts/export_test_clinic_15_backup.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD%5Cbackend%5Cscripts%5Cexport_test_clinic_15_backup.py)
- [`backend/scripts/delete_test_clinic_15_runner.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD%5Cbackend%5Cscripts%5Cdelete_test_clinic_15_runner.py)
- [`docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD%5Cdocs%5Cclinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md)

## 6. Caminho do backup/export gerado
Diretório gerado:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\clinica_15_pre_exclusao`

## 7. Resumo do backup/export
O export somente leitura foi executado com sucesso e gerou arquivos como:
- `clinica_15_core.json`
- `usuarios_34_35.json`
- `prestador_21.json`
- `access_profile_clinica_15.json`
- `usuario_perfil_acesso_clinica_15.json`
- `etiqueta_modelo_clinica_15.json`
- `email_codes_institutobrana.json`
- `convenio_odonto_clinica_15.json`
- `plano_odonto_clinica_15.json`
- `procedimento_tabela_clinica_15.json`
- `procedimento_generico_clinica_15.json`
- `procedimento_clinica_15.json`
- `procedimento_material_clinica_15.json`
- `procedimento_fase_clinica_15.json`
- `procedimento_generico_material_clinica_15.json`
- `procedimento_generico_fase_clinica_15.json`
- `lista_material_clinica_15.json`
- `material_lista_15.json`
- `anamnese_questionarios_clinica_15.json`
- `anamnese_perguntas_clinica_15.json`
- `categoria_financeira_clinica_15.json`
- `grupo_financeiro_clinica_15.json`
- `indice_financeiro_clinica_15.json`
- `item_auxiliar_clinica_15.json`
- `simbolo_grafico_catalogo_clinica_15.json`
- `doenca_cid_clinica_15.json`
- `assinaturas_clinica_15.json`
- `plataforma_assinaturas_clinica_15.json`
- `plataforma_cobrancas_clinica_15.json`
- `counts_pre_exclusao.json`
- `manifest.json`

## 8. Runner criado/adaptado
Foi criado o runner específico:
- [`backend/scripts/delete_test_clinic_15_runner.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD%5Cbackend%5Cscripts%5Cdelete_test_clinic_15_runner.py)

Características:
- `dry-run` por padrão
- `--execute` obrigatório para futura execução real
- trava para `clinica_id = 15`
- trava para `expected_email = institutobrana@gmail.com`
- validação do nome `Tel`
- validação dos usuários 34 e 35
- validação do prestador 21
- validação de `access_profile = 10`
- validação de `usuario_perfil_acesso = 0`
- validação de `Tabela Exemplo` e `Brana`
- inclusão de `email_codes` no plano de liberação futura do e-mail

## 9. Comando de dry-run executado
Comando executado:
```powershell
.\\.venv\\Scripts\\python.exe backend\\scripts\\delete_test_clinic_15_runner.py --clinica-id 15 --expected-email institutobrana@gmail.com
```

## 10. Saída/resumo do dry-run
O dry-run confirmou:
- `DATABASE_ATUAL = brana_saas`
- `CLINICA_ENCONTRADA` correta
- `USUARIOS_ENCONTRADOS` com IDs 34 e 35
- `PRESTADORES_ENCONTRADOS` com ID 21
- `ACCESS_PROFILE_RELATORIO` com 10 perfis
- `USUARIO_PERFIL_ACESSO = []`
- `PROCEDIMENTO_TABELA_RELATORIO` com `Tabela Exemplo` e `Brana`
- `EMAIL_CODES_ENCONTRADOS` com IDs 25 e 26
- `PLATAFORMA_AUDITORIA_ENCONTRADA = []`
- `PROCEDIMENTO_MIX_ESTRANHO = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- `ORDEM_PLANEJADA_DE_EXCLUSAO` listando dependentes antes dos pais

## 11. Contagens que seriam removidas
Contagens principais confirmadas no dry-run:
- `access_profile = 10`
- `usuario_perfil_acesso = 0`
- `procedimento_tabela = 2`
- `procedimento = 681`
- `procedimento_material = 1627`
- `procedimento_fase = 0`
- `procedimento_generico = 591`
- `procedimento_generico_material = 0`
- `procedimento_generico_fase = 0`
- `lista_material = 1`
- `anamnese_questionarios = 3`
- `anamnese_perguntas = 41`
- `categoria_financeira = 86`
- `grupo_financeiro = 13`
- `indice_financeiro = 4`
- `item_auxiliar = 1226`
- `simbolo_grafico_catalogo = 138`
- `doenca_cid = 14486`
- `plataforma_assinaturas = 1`
- `plataforma_cobrancas = 0`
- `assinaturas = 0`
- `pacientes = 0`
- `tratamento = 0`
- `lancamento = 0`
- `agenda_legado_evento = 0`
- `agenda_legado_bloqueio = 0`
- `anamnese_respostas = 0`

Também ficou claro que o backup exportou a lista de materiais da clínica (`material_lista_15.json`) e o runner prevê a liberação do e-mail na execução futura.

## 12. Confirmação de identidade da clínica 15
Confirmação mantida:
- `clinica_id = 15`
- nome `Tel`
- e-mail `institutobrana@gmail.com`
- conta demo ativa
- clínica contaminada do teste manual anterior

## 13. Confirmação de que `email_codes` serão limpos na execução real futura
Sim. O runner mantém a etapa de limpeza de `email_codes` relacionados a `institutobrana@gmail.com` como primeira ação do plano de exclusão real futura.

## 14. Confirmação de que não houve `UPDATE`/`DELETE`/`INSERT`
- não houve `UPDATE`
- não houve `DELETE`
- não houve `INSERT`

## 15. Confirmação de que nenhuma clínica foi excluída
Nenhuma clínica foi excluída nesta etapa. A clínica 15 permanece no banco para a futura execução controlada.

## 16. Riscos remanescentes
- a clínica 15 continua contaminada e não deve ser usada para novo teste manual até a exclusão segura futura
- o e-mail ainda ficará preso até a execução real futura da limpeza de `email_codes`
- a exclusão real ainda depende de autorização explícita na próxima etapa

## 17. Próxima etapa recomendada
Subetapa 3L — revisão final e execução real controlada da exclusão da clínica 15 com `--execute`, uma única vez, seguida de auditoria pós-exclusão.

## 18. Confirmações finais
- nenhum código foi alterado fora dos scripts desta etapa e deste documento
- banco não foi alterado por esta etapa
- Git não foi organizado nesta etapa
- frontend, login/senha interna, perfis e seeds Brana não foram alterados
- mojibake/UTF-8 não foi corrigido
