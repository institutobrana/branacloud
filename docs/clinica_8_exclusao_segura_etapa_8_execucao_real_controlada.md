# Clínica 8 — Exclusão segura — Etapa 8 — Execução real controlada da exclusão da clínica 8

## 1. Título da etapa
Etapa 8 — Execução real controlada da exclusão da clínica 8.

## 2. Autorização explícita registrada
Houve autorização humana explícita para executar a exclusão real da clínica 8, vinculada ao e-mail `institutobrana@gmail.com`.

## 3. Comando de dry-run pré-execução
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com
```

## 4. Resultado do dry-run pré-execução
O dry-run pré-execução foi executado com o Python do venv do projeto e confirmou:
- `DATABASE_ATUAL: brana_saas`
- clínica `Instituto Brana` encontrada
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

## 5. Comando real executado com `--execute`
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute
```

## 6. Confirmação de execução única
O comando real foi executado uma única vez.

## 7. Resultado da execução real
A execução real não chegou a iniciar a exclusão. O runner bloqueou com segurança antes de qualquer DELETE devido a um vínculo inesperado:
- `etiqueta_modelo` com `clinica_id = 8` e `qtd = 8`

Mensagem relevante retornada:
- `ERRO: execucao real bloqueada: tabelas adicionais com clinica_id=8 encontradas [{"table": "etiqueta_modelo", "column": "clinica_id", "qtd": 8}]`

## 8. Contagens antes
As contagens antes da execução real permaneceram as mesmas do dry-run:
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

## 9. Contagens depois
O runner bloqueou antes de qualquer exclusão; portanto, as contagens depois permaneceram inalteradas e o dry-run pós-bloqueio confirmou o mesmo estado:
- `DATABASE_ATUAL: brana_saas`
- clínica 8 ainda encontrada
- usuários 19 e 20 ainda encontrados
- prestador 13 ainda encontrado
- assinatura/plataforma 11 ainda encontrada
- `AUDITORIA_EMAIL: []`
- `VINCULOS_NAO_MAPEADOS: []`
- `VINCULOS_USUARIO_EXTRA: []`
- `VINCULOS_PRESTADOR_EXTRA: []`

## 10. Commit de banco
Nenhum commit de banco foi feito pelo runner porque a execução real foi bloqueada antes de qualquer DELETE.

## 11. Rollback
Não houve rollback explícito porque nenhuma escrita foi iniciada; a execução real foi bloqueada por validação de segurança antes da etapa destrutiva.

## 12. Validações pós-exclusão
Não houve pós-exclusão real porque a exclusão não ocorreu. O dry-run pós-bloqueio confirmou o estado inalterado:
- `current_database = brana_saas`
- clínica 8 ainda presente
- e-mail `institutobrana@gmail.com` ainda presente
- usuários 19 e 20 ainda presentes
- prestador 13 ainda presente
- `AUDITORIA_EMAIL = []`
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`

## 13. Frontend não alterado
`frontend` não foi alterado.

## 14. Seeds/signup não alterados
`seeds` e `signup` não foram alterados.

## 15. Git add/commit/push
Não houve `git add`, `commit` ou `push`.

## 16. Resultado dos checks
- `git branch --show-current` → `modularizacao-segura-fase-1`
- `git status --short` → conferido
- `git diff --stat` → sem diff em arquivos versionados
- `git log --oneline -10` → conferido
- `dir backend\scripts\delete_test_clinic_runner.py` → existente
- `dir backend\scripts\export_test_clinic_backup.py` → existente
- `dir backups\clinica_8_pre_exclusao` → existente
- `dir docs\clinica_8_exclusao_segura_etapa_7_revisao_final_pre_execucao.md` → existente
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py` → OK
- `python -m py_compile backend/scripts/export_test_clinic_backup.py` → OK
- dry-run pré-execução → OK
- comando real `--execute` → executado uma única vez e bloqueado com segurança
- dry-run pós-bloqueio → OK
- `node --check frontend/app.js` → OK
- `node --check frontend/js/modules/users-admin-modal-visual.js` → OK
- `python -m py_compile backend/seeds/access_profiles_default.py` → OK
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` → OK
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` → OK
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py` → OK
- `python -m py_compile backend/services/signup_service.py` → OK
- `python -m py_compile backend/database.py` → OK

## 17. Estado final do git status --short
O repositório permanece com os untracked preexistentes da árvore de trabalho e com os artefatos desta trilha.

## 18. Próxima etapa recomendada
Etapa 9 — validação do novo cadastro limpo com `institutobrana@gmail.com`, sem mexer em seeds/access_profile salvo necessidade diagnosticada.
