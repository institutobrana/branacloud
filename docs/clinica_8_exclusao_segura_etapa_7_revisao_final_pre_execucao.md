# Clínica 8 — Exclusão segura — Etapa 7 — Revisão final pré-execução real

## 1. Objetivo
Fazer a revisão final antes de uma eventual exclusão real da clínica 8, apenas com conferência de ambiente, backups, documentos, dry-run e critérios de parada. Nesta etapa não houve `--execute`.

## 2. Confirmação de revisão final somente
Esta etapa foi somente revisão final pré-execução real. Nenhum DELETE foi executado e nenhum dado foi alterado.

## 3. `--execute` não foi usado
`--execute` não foi usado nesta etapa.

## 4. Nada foi excluído
Nada foi excluído nesta etapa.

## 5. Banco não foi alterado
O banco não foi alterado.

## 6. Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado
Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.

## 7. Diretório e branch
- Diretório correto confirmado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch confirmada: `modularizacao-segura-fase-1`

## 8. Estado do Git
- `git status --short` foi conferido.
- `git diff --stat` foi conferido.
- Não há diff em arquivos versionados nesta trilha.
- Arquivos relevantes untracked da trilha:
  - `backend/scripts/delete_test_clinic_runner.py`
  - `backend/scripts/export_test_clinic_backup.py`
  - `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
  - `docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md`
  - `docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md`
  - `docs/clinica_8_exclusao_segura_etapa_3b_auditoria_localizacao_arquivos.md`
  - `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
  - `docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md`
  - `docs/clinica_8_exclusao_segura_etapa_5b_auditoria_localizacao_backup.md`
  - `docs/clinica_8_exclusao_segura_etapa_6_runner_execucao_controlada_sem_executar.md`
  - `docs/clinica_8_exclusao_segura_etapa_7_revisao_final_pre_execucao.md`

## 9. Documentos anteriores confirmados
Foram confirmados no `BRANA CLOUD`:
- Etapa 1
- Etapa 2
- Etapa 3
- Etapa 3B
- Etapa 4
- Etapa 5
- Etapa 5B
- Etapa 6

## 10. Scripts confirmados
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/export_test_clinic_backup.py`

## 11. Pasta de backup e arquivos principais
A pasta `backups/clinica_8_pre_exclusao/` existe no `BRANA CLOUD` e contém, entre outros:
- `manifest.json`
- `counts_pre_exclusao.json`
- `clinica_8_core.json`
- `usuarios_19_20.json`
- `prestador_13.json`
- `plataforma_assinaturas_11.json`
- `access_profile_clinica_8.json`
- demais arquivos gerados na Etapa 5

## 12. Resultado do dry-run final
O dry-run final foi executado sem `--execute` com o Python do venv do projeto e confirmou:
- `DATABASE_ATUAL: brana_saas`
- clínica 8 encontrada com nome `Instituto Brana`
- `expected_email = institutobrana@gmail.com`
- usuários `19` e `20` encontrados
- prestador `13` encontrado
- assinatura/plataforma `11` encontrada
- `AUDITORIA_EMAIL: []`
- `VINCULOS_NAO_MAPEADOS: []`
- `VINCULOS_USUARIO_EXTRA: []`
- `VINCULOS_PRESTADOR_EXTRA: []`
- nenhuma trava foi acionada
- nada foi alterado

## 13. Contagens principais confirmadas
- `access_profile: 16`
- `usuarios: 2`
- `prestador_odonto: 1`
- `plataforma_assinaturas: 1`
- `convenio_odonto: 10`
- `plano_odonto: 10`
- `procedimento_tabela: 2`
- `procedimento_generico: 591`
- `procedimento: 56`
- `lista_material: 1`
- `material: 244`
- `anamnese_questionarios: 3`
- `anamnese_perguntas: 41`
- `doenca_cid: 14486`
- `item_auxiliar: 1226`
- `simbolo_grafico_catalogo: 142`
- `categoria_financeira: 86`
- `grupo_financeiro: 13`
- `indice_financeiro: 4`
- `assinaturas: 0`
- `plataforma_cobrancas: 0`
- `pacientes: 0`
- `tratamento: 0`
- `anamnese_respostas: 0`
- `lancamento: 0`
- `agenda_legado_evento: 0`
- `agenda_legado_bloqueio: 0`
- `relatorio_config: 0`
- `usuario_perfil_acesso: 0`

## 14. Dados impeditivos zerados
Confirmado:
- `pacientes = 0`
- `tratamento = 0`
- `anamnese_respostas = 0`
- `lancamento = 0`
- `agenda_legado_evento = 0`
- `agenda_legado_bloqueio = 0`
- `plataforma_cobrancas = 0`
- `usuario_perfil_acesso = 0`

## 15. Auditorias vazias
Confirmado:
- `AUDITORIA_EMAIL = []`
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`

## 16. Comando futuro de execução real
Comando documentado, mas não executado nesta etapa:
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute
```

## 17. Checklist de autorização humana para a próxima etapa
- Confirmar autorização explícita para executar a exclusão real.
- Confirmar novamente que o backup da Etapa 5 existe.
- Confirmar que o dry-run final da Etapa 7 permaneceu consistente.
- Confirmar que o `git status --short` não trouxe diffs inesperados em arquivos versionados.
- Confirmar que não surgiu nenhum dado impeditivo novo.

## 18. Critérios de parada
Parar imediatamente se:
- qualquer contagem mudar inesperadamente;
- surgir paciente, tratamento, lancamento, agenda ou cobrança;
- surgir vínculo não mapeado;
- o e-mail não bater exatamente;
- `current_database` deixar de ser `brana_saas`;
- os backups deixarem de existir;
- houver diff inesperado em arquivos versionados;
- qualquer check falhar;
- houver dúvida humana sobre a autorização.

## 19. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python` do venv do projeto para o dry-run final do runner
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## 20. Estado final do git status --short
O repositório continua com os untracked preexistentes da árvore de trabalho e com os arquivos relevantes desta trilha, incluindo os documentos das Etapas 1 a 7, os dois scripts e os backups da Etapa 5.

## 21. Próxima etapa recomendada
Etapa 8 — execução real controlada da exclusão da clínica 8, somente com autorização humana explícita, usando:
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute
```
