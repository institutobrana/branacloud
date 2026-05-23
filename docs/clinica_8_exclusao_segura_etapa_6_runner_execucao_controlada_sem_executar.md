# Clínica 8 — Exclusão segura — Etapa 6 — Runner de execução controlada sem executar

## 1. Objetivo
Revisar e implementar a lógica de exclusão real controlada no runner da clínica 8, mantendo `dry-run` como padrão e sem executar `--execute` nesta etapa.

## 2. Arquivo alterado
- `backend/scripts/delete_test_clinic_runner.py`

## 3. Confirmação de não execução real
Não houve execução real de exclusão nesta etapa.

## 4. Confirmação de que `--execute` não foi usado
`--execute` não foi usado.

## 5. Confirmação de que nada foi excluído
Nada foi excluído.

## 6. Confirmação de que o banco não foi alterado
O banco não foi alterado.

## 7. Resumo das validações implementadas ou revisadas
- Travamento de `--clinica-id` em `8`.
- Travamento de `--expected-email` em `institutobrana@gmail.com`.
- Validação de `current_database = brana_saas`.
- Validação da clínica 8 e do e-mail exato.
- Validação dos usuários esperados `19` e `20`.
- Validação do prestador esperado `13`.
- Validação da assinatura/plataforma esperada `11`.
- Validação de `lista_material` relacionada, com referência confirmada no backup `25`.
- Bloqueio se houver pacientes, tratamentos, lançamentos, agenda legada, cobranças ou respostas de anamnese.
- Bloqueio se houver `usuario_perfil_acesso` com registros.
- Checagem de vínculos adicionais por `clinica_id`, `usuario_id` e `prestador_id`.
- Checagem de registros de auditoria de e-mail em `email_codes` e `plataforma_auditoria`.
- Uso de queries parametrizadas.
- Manutenção de transação com rollback em erro e commit apenas no fim do caminho `--execute`.

## 8. Resumo da ordem de exclusão implementada ou bloqueada
Ordem registrada no runner:
1. `procedimento_material` / `procedimento_fase` / `procedimento_generico_fase` / `procedimento_generico_material`
2. `material` por `lista_material` relacionada
3. `lista_material`
4. `anamnese_perguntas`
5. `anamnese_questionarios`
6. `plano_odonto`
7. `convenio_odonto`
8. `procedimento`
9. `procedimento_generico`
10. `procedimento_tabela`
11. `categoria_financeira`
12. `grupo_financeiro`
13. `indice_financeiro`
14. `item_auxiliar`
15. `simbolo_grafico_catalogo`
16. `doenca_cid`
17. `usuario_perfil_acesso`
18. `access_profile`
19. `plataforma_assinaturas`
20. `prestador_odonto`
21. `usuarios.id 19 e 20`
22. `clinicas.id 8` por último

## 9. Execução real ainda bloqueada ou liberável tecnicamente
O runner ficou tecnicamente preparado para um caminho `--execute` controlado, com transação, validações e ordem explícita de remoção. Nesta etapa, porém, a execução real continuou não acionada porque `--execute` não foi usado e não houve autorização para exclusão real.

## 10. Resultado do dry-run após a alteração
O dry-run continuou funcionando e retornou:
- `DATABASE_ATUAL: brana_saas`
- clínica `Instituto Brana` encontrada
- usuários `19` e `20` encontrados
- prestador `13` encontrado
- assinatura/plataforma `11` encontrada
- `AUDITORIA_EMAIL: []`
- `VINCULOS_NAO_MAPEADOS: []`
- `VINCULOS_USUARIO_EXTRA: []`
- `VINCULOS_PRESTADOR_EXTRA: []`
- aviso final de que nada foi alterado

## 11. Contagens principais confirmadas
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

## 12. Riscos remanescentes
- FKs reais ainda precisam ser revalidadas no momento da autorização da exclusão.
- Tabelas adicionais com `clinica_id`, `usuario_id` ou `prestador_id` fora do conjunto conhecido podem aparecer em execução futura e devem ser rechecadas imediatamente antes do `--execute`.
- `email_codes` e `plataforma_auditoria` continuam sendo pontos de atenção para liberação do e-mail.

## 13. Próxima etapa recomendada
Etapa 7 — revisão final pré-execução real, com checklist de backup, `git status`, dry-run final, confirmação humana explícita e comando exato para a execução real autorizada.

## 14. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com` com o `python` do venv do projeto para validar o dry-run
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`
