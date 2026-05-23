# Clínica 10 - Exclusão segura - Etapa 2 - Runner, backup e dry-run sem execute

## 1. Contexto

- A Etapa 1 diagnosticou a clinica 10 somente por leitura.
- A conta teste atual pode ter sido contaminada pelo bug anterior de senha interna/login.
- O objetivo desta etapa foi preparar a exclusao segura para recriar a conta limpa depois, sem executar `--execute`.

## 2. Contratos/documentos consultados

- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- Scripts de referencia lidos somente para modelo tecnico:
  - `backend/scripts/delete_test_clinic_9_runner.py`
  - `backend/scripts/export_test_clinic_9_backup.py`
  - `backend/scripts/delete_test_clinic_runner.py`
  - `backend/scripts/export_test_clinic_backup.py`

## 3. Arquivos criados/alterados

Arquivos criados nesta etapa:
- `backend/scripts/export_test_clinic_10_backup.py`
- `backend/scripts/delete_test_clinic_10_runner.py`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`

Pasta criada/gerada:
- `backups/clinica_10_pre_exclusao/`

## 4. Backup criado

Arquivos gerados em `backups/clinica_10_pre_exclusao/`:
- `manifest.json`
- `counts_pre_exclusao.json`
- `clinica_10_core.json`
- `usuarios_23_24_25.json`
- `prestadores_15_16.json`
- `access_profile_clinica_10.json`
- `etiqueta_modelo_clinica_10.json`
- `email_codes_institutobrana.json`
- `convenio_odonto_clinica_10.json`
- `plano_odonto_clinica_10.json`
- `procedimento_tabela_clinica_10.json`
- `procedimento_generico_clinica_10.json`
- `procedimento_clinica_10.json`
- `lista_material_clinica_10.json`
- `material_lista_clinica_10.json`
- `anamnese_questionarios_clinica_10.json`
- `anamnese_perguntas_clinica_10.json`
- `categoria_financeira_clinica_10.json`
- `grupo_financeiro_clinica_10.json`
- `indice_financeiro_clinica_10.json`
- `item_auxiliar_clinica_10.json`
- `simbolo_grafico_catalogo_clinica_10.json`
- `doenca_cid_clinica_10.json`
- `assinaturas_clinica_10.json`
- `plataforma_assinaturas_clinica_10.json`
- `plataforma_cobrancas_clinica_10.json`

## 5. Validacoes do backup/export

Validacoes confirmadas no export somente leitura:
- `DATABASE_ATUAL = brana_saas`
- `clinica_id = 10`
- e-mail bateu exatamente com `institutobrana@gmail.com`
- clinica confirmada como `Tel`
- usuarios 23, 24 e 25 encontrados
- prestadores 15 e 16 encontrados
- `access_profile = 10`
- `etiqueta_modelo = 8`
- `etiqueta_modelo IDs = 91 a 98`
- `email_codes = 1`
- `assinaturas = 0`
- `plataforma_assinaturas = 0`
- `plataforma_cobrancas = 0`
- dados impeditivos confirmados como zerados

## 6. Runner criado

O runner de exclusao segura da clinica 10 foi criado com:
- execucao protegida por `if __name__ == "__main__":`
- argumentos obrigatorios `--clinica-id` e `--expected-email`
- argumento opcional `--execute`
- modo dry-run por padrao
- validacao de `brana_saas`
- validacao da clinica 10 e do e-mail `institutobrana@gmail.com`
- validacao dos usuarios 23, 24 e 25
- validacao dos prestadores 15 e 16
- validacao do `access_profile = 10`
- validacao do `etiqueta_modelo = 8`
- validacao de `email_codes`
- bloqueio se houver dados reais ou vinculos inesperados
- transacao planejada para o futuro `--execute`
- `DELETE` final da clinica por ultimo, com `rowcount = 1` na execucao futura
- preservacao de `modelos_documento` e `etiqueta_padrao`

## 7. Ordem planejada de exclusao

Ordem planejada registrada no runner:
1. `email_codes` relacionados a `institutobrana@gmail.com`
2. `usuario_perfil_acesso`
3. `access_profile`
4. `etiqueta_modelo`
5. `anamnese_perguntas`
6. `anamnese_questionarios`
7. `procedimento_material / procedimento_fase / procedimento_generico_fase / procedimento_generico_material`
8. `material` por `lista_material`
9. `lista_material`
10. `procedimento`
11. `procedimento_generico`
12. `procedimento_tabela`
13. `convenio_odonto`
14. `plano_odonto`
15. `categoria_financeira`
16. `grupo_financeiro`
17. `indice_financeiro`
18. `item_auxiliar`
19. `simbolo_grafico_catalogo`
20. `doenca_cid`
21. `assinaturas`
22. `plataforma_assinaturas`
23. `plataforma_cobrancas`
24. `prestador_odonto` 15 e 16
25. `usuarios` 23, 24 e 25
26. `clinicas.id = 10` por ultimo

## 8. Resultado do dry-run

Resultado confirmado:
- `DATABASE_ATUAL = brana_saas`
- `CLINICA_ENCONTRADA` correta
- `E_MAIL_ESPERADO = institutobrana@gmail.com`
- `USUARIOS_ENCONTRADOS = 23, 24, 25`
- `PRESTADORES_ENCONTRADOS = 15, 16`
- `ACCESS_PROFILE_RELATORIO` com 10 perfis e nomes exatos
- `ETIQUETA_MODELO_RELATORIO` com 8 registros e IDs 91 a 98
- `EMAIL_CODES_ENCONTRADOS = 1`
- `DADOS_IMPEDITIVOS = 0` para:
  - pacientes
  - tratamento
  - lancamento
  - agenda_legado_evento
  - agenda_legado_bloqueio
  - anamnese_respostas
  - plataforma_cobrancas
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- nada foi alterado no banco

## 9. Confirmacao de que --execute nao foi usado

- `--execute` nao foi usado nesta etapa.
- O runner foi validado apenas em dry-run.

## 10. Confirmacao de que nada foi excluido

- Nenhuma exclusao foi executada.
- Nenhum DELETE foi aplicado ao banco.
- Nenhuma clinica foi removida.

## 11. Confirmacao de que banco nao foi alterado

- O backup/export e o dry-run foram somente leitura.
- O banco permaneceu sem modificacoes.

## 12. Decisao vigente PARTICULAR -> Brana

- Para novas contas/clinicas, a tabela atualmente chamada PARTICULAR deve passar a nascer como Brana.
- Novas contas devem nascer com Tabela exemplo e Brana.
- Contas existentes podem manter PARTICULAR como esta.
- Nenhuma alteracao disso foi feita nesta etapa.

## 13. O que nao foi alterado

- login/senha interna
- signup
- seeds
- access_profile
- Intervencoes/Procedimentos
- PARTICULAR/Brana
- frontend/backend de aplicacao
- contratos vigentes

## 14. Proxima etapa recomendada

Se backup e dry-run passarem, a proxima etapa e:
- Etapa 3 - execucao real controlada da exclusao da clinica 10, com autorizacao explicita, usando `--execute` uma unica vez.

## 15. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/scripts/export_test_clinic_10_backup.py`
- `python -m py_compile backend/scripts/delete_test_clinic_10_runner.py`
- `python -m py_compile backend/routes/auth_routes.py`
- `python -m py_compile backend/security/admin_password.py`
- `python -m py_compile backend/models/usuario.py`
- `python -m py_compile backend/database.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/routes/user_admin_routes.py`
- `python -m py_compile backend/services/access_profiles_service.py`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`

## 16. Estado final do git status --short

O estado final do `git status --short` inclui os arquivos criados nesta etapa e os arquivos alterados preexistentes do ambiente. Nao houve `git add`, `git commit` ou `git push`.
