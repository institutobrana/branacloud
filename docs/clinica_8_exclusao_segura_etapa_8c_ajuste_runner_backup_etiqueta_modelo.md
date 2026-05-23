# Clínica 8 — Exclusão segura — Etapa 8C — Ajuste do runner e backup para etiqueta_modelo

## 1. Título da etapa
Etapa 8C — Ajuste do runner e do backup para incluir `etiqueta_modelo`, sem executar `--execute`.

## 2. Contexto
- A Etapa 8 foi bloqueada por `etiqueta_modelo`.
- A Etapa 8B confirmou que os 8 registros de `etiqueta_modelo` da clínica 8 são exclusivos por `clinica_id`.
- Nada foi excluído.
- O banco não foi alterado.

## 3. Objetivo
Incluir `etiqueta_modelo` como vínculo mapeado no runner de exclusão e exportá-lo no backup pré-exclusão, mantendo `dry-run` como padrão e sem executar exclusão real.

## 4. Arquivos alterados
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/export_test_clinic_backup.py`

## 5. Backup específico criado ou atualizado
Criado/atualizado:
- `backups/clinica_8_pre_exclusao/etiqueta_modelo_clinica_8.json`

## 6. Ajustes feitos no runner
- `etiqueta_modelo` foi incluído nas contagens esperadas da clínica 8.
- `etiqueta_modelo` foi incluído como vínculo mapeado, deixando de aparecer em `VINCULOS_NAO_MAPEADOS`.
- Foi adicionada validação explícita para `etiqueta_modelo` com:
  - contagem esperada de `8` registros;
  - IDs esperados `75, 76, 77, 78, 79, 80, 81, 82`.
- O dry-run agora imprime:
  - o relatório de `etiqueta_modelo`;
  - a contagem;
  - os IDs encontrados;
  - aviso de que `modelos_documento` e `etiqueta_padrao` não serão removidos.
- O caminho futuro de execução real foi ajustado para incluir `etiqueta_modelo` na ordem de exclusão.
- O DELETE futuro de `etiqueta_modelo` ficou posicionado depois de `access_profile` e antes de `plataforma_assinaturas`.
- O runner continua com `dry-run` por padrão e `--execute` continua obrigatório para execução real futura.

## 7. Ajustes feitos no export
- O backup/export passou a gerar `backups/clinica_8_pre_exclusao/etiqueta_modelo_clinica_8.json`.
- O export permaneceu somente leitura.
- O export validou:
  - `clinica_id = 8`
  - `expected_email = institutobrana@gmail.com`
  - `current_database = brana_saas`
- O `manifest.json` e `counts_pre_exclusao.json` passaram a refletir `etiqueta_modelo` de forma controlada.

## 8. `modelos_documento` e `etiqueta_padrao` não serão apagados
Confirmado. A inclusão de `etiqueta_modelo` no fluxo não implica apagar:
- `modelos_documento`
- `etiqueta_padrao`
- qualquer catálogo global

## 9. `--execute` não foi usado
`--execute` não foi usado nesta etapa.

## 10. Nada foi excluído
Nada foi excluído nesta etapa.

## 11. Banco não foi alterado
O banco não foi alterado.

## 12. Resultado do export/backup
O export/backup foi executado somente leitura e gerou, entre outros:
- `etiqueta_modelo_clinica_8.json`
- `manifest.json`
- `counts_pre_exclusao.json`
- `clinica_8_core.json`
- `usuarios_19_20.json`
- `prestador_13.json`
- `plataforma_assinaturas_11.json`
- `access_profile_clinica_8.json`

## 13. Resultado do dry-run
O dry-run do runner voltou com:
- `DATABASE_ATUAL: brana_saas`
- clínica 8 conferida
- e-mail `institutobrana@gmail.com` conferido
- usuários `19` e `20` encontrados
- prestador `13` encontrado
- assinatura `11` encontrada
- `ETIQUETA_MODELO_RELATORIO` com `count = 8`
- `ETIQUETA_MODELO_IDS = [75, 76, 77, 78, 79, 80, 81, 82]`
- `VINCULOS_NAO_MAPEADOS = []`
- `AUDITORIA_EMAIL = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- aviso final de que nada foi alterado

## 14. Contagens principais confirmadas
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
- `etiqueta_modelo: 8`
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

## 15. Auditorias vazias
Confirmado:
- `AUDITORIA_EMAIL = []`
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`

## 16. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python backend/scripts/export_test_clinic_backup.py --clinica-id 8 --expected-email institutobrana@gmail.com` com o Python do venv do projeto
- `python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com` com o Python do venv do projeto
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## 17. Estado final do `git status --short`
O repositório continua com os untracked preexistentes da árvore de trabalho e com os artefatos desta trilha, incluindo o novo backup `etiqueta_modelo_clinica_8.json`.

## 18. Próxima etapa recomendada
Etapa 8D — revisão final curta e nova execução real controlada, com autorização explícita, usando `--execute` uma única vez.
