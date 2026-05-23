# Clínica 8 — Exclusão segura — Etapa 8F — Execução real controlada pós-correção de transação

## 1. Título da etapa
Etapa 8F — Nova revisão final curta e execução real controlada após correção de transação.

## 2. Autorização explícita registrada
Houve autorização humana explícita para tentar a exclusão real da clínica 8 com:
- `clinica_id = 8`
- `expected_email = institutobrana@gmail.com`

## 3. Contexto
- A Etapa 8 bloqueou por `etiqueta_modelo`.
- A Etapa 8B auditou `etiqueta_modelo`.
- A Etapa 8C ajustou runner e backup.
- A Etapa 8D bloqueou por erro técnico de transação.
- A Etapa 8E corrigiu o controle de transação.

## 4. Comando de dry-run pré-execução
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com
```

## 5. Resultado do dry-run pré-execução
O dry-run pré-execução foi executado com o Python do venv do projeto e confirmou:
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
- dados impeditivos zerados:
  - `pacientes = 0`
  - `tratamento = 0`
  - `anamnese_respostas = 0`
  - `lancamento = 0`
  - `agenda_legado_evento = 0`
  - `agenda_legado_bloqueio = 0`
  - `plataforma_cobrancas = 0`
  - `usuario_perfil_acesso = 0`

## 6. Comando real executado com `--execute`
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute
```

## 7. Confirmação de execução única
O comando real foi executado uma única vez.

## 8. Resultado da execução real
A execução real concluiu a maior parte das remoções, mas não removeu a linha da clínica 8.

Resultado relevante da execução:
- `MODO: EXECUTE`
- `CONTAGENS_DEPOIS` zeradas para os vínculos removidos
- `AVISO: execute controlado concluido em transacao; commit ocorreu somente ao final da rotina.`

Consulta de validação posterior confirmou:
- `clinicas.id = 8` ainda existe

## 9. Contagens antes
Contagens antes da execução:
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

## 10. Contagens depois
Após a execução real, a validação direta confirmou:
- `clinicas.id = 8` ainda existe
- `usuarios` com IDs `19` e `20` não retornam mais
- `prestador_odonto.id = 13` não retorna mais
- `etiqueta_modelo` para `clinica_id = 8` retornou `0`
- `access_profile` para a clínica 8 retornou `0`
- `usuario_perfil_acesso` para a clínica 8 retornou `0`
- `plataforma_assinaturas` para a clínica 8 retornou `0`
- o banco continua `brana_saas`

## 11. Commit de banco
O runner informou commit ao final da rotina de execução. No entanto, a clínica 8 não foi removida.

## 12. Rollback
Não houve rollback explícito nesta etapa.

## 13. Validações pós-exclusão
Validação pós-execução confirmou:
- `clinicas.id = 8` ainda existe
- `institutobrana@gmail.com` ainda aparece como e-mail da clínica
- `usuarios.id 19 e 20` não retornam
- `prestador_odonto.id 13` não retorna
- `access_profile` da clínica 8 = 0
- `etiqueta_modelo` da clínica 8 = 0
- `usuario_perfil_acesso` da clínica 8 = 0
- `plataforma_assinaturas.id 11` não retorna
- clínicas `1` e `4` não foram afetadas
- banco continua `brana_saas`

## 14. Confirmação de que modelos_documento não foi apagado
Confirmado: `modelos_documento` não foi apagado.

## 15. Confirmação de que etiqueta_padrao não foi apagada
Confirmado: `etiqueta_padrao` não foi apagada.

## 16. Confirmação de que clínicas 1 e 4 não foram afetadas
Confirmado.

## 17. Confirmação de que frontend não foi alterado
`frontend` não foi alterado.

## 18. Confirmação de que seeds/signup não foram alterados
`seeds` e `signup` não foram alterados.

## 19. Confirmação de que não houve git add/commit/push
Não houve `git add`, `commit` ou `push`.

## 20. Resultado dos checks
- `git branch --show-current` → `modularizacao-segura-fase-1`
- `git status --short` → conferido
- `git diff --stat` → sem diff em arquivos versionados
- `git log --oneline -10` → conferido
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py` → OK
- `python -m py_compile backend/scripts/export_test_clinic_backup.py` → OK
- dry-run pré-execução → OK
- execução real `--execute` → executada uma única vez
- `node --check frontend/app.js` → OK
- `node --check frontend/js/modules/users-admin-modal-visual.js` → OK
- `python -m py_compile backend/seeds/access_profiles_default.py` → OK
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` → OK
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` → OK
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py` → OK
- `python -m py_compile backend/services/signup_service.py` → OK
- `python -m py_compile backend/database.py` → OK

## 21. Estado final do git status --short
O repositório continua com os untracked preexistentes e com os artefatos desta trilha.

## 22. Próxima etapa recomendada
Etapa 9 — correção específica do runner para remover também `clinicas.id = 8` de forma segura, ou validação de um novo plano de finalização antes de tentar liberar o e-mail.
