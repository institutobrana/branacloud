# Clinica 8 - Exclusao segura - Etapa 4 - Dry-run controlado do runner

## 1. Objetivo
Executar o runner de exclusao controlada em modo dry-run, sem `--execute`, para validar banco, clinica, e-mail, usuarios, prestador, assinatura/plataforma, contagens por tabela e ordem planejada de exclusao, sem qualquer alteracao no banco.

## 2. Comando executado
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com
```

## 3. Confirmacao explicita de que `--execute` nao foi usado
- O comando executado nao incluiu `--execute`.
- O runner operou em modo `DRY-RUN`.

## 4. Resultado do dry-run
O runner abriu corretamente, reconheceu o database atual, validou a clinica 8, validou o e-mail esperado e imprimiu o conjunto principal de dados e contagens sem executar escrita.

Saida resumida:
- `MODO: DRY-RUN`
- `DATABASE_ATUAL: brana_saas`
- `CLINICA_ENCONTRADA`: `Instituto Brana`
- `E_MAIL_ESPERADO`: `institutobrana@gmail.com`
- `USUARIOS_ENCONTRADOS`: ids `19` e `20`
- `PRESTADOR_ENCONTRADO`: id `13`
- `ASSINATURA_ENCONTRADA`: id `11`
- `CONTAGENS_POR_TABELA` impressas
- `ORDEM_PLANEJADA_DE_EXCLUSAO` impressa
- `VINCULOS_NAO_MAPEADOS: []`
- aviso final de que nada foi alterado

## 5. Contagens principais retornadas
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
- `material` via `lista_material.id = 25`: mantido como dependência volumosa já conhecida do diagnóstico anterior
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
- `controle_protetico: 0`
- `calendario_faturamento_odonto: 0`
- `medicamento: 0`
- `restricao_terapeutica: 0`

## 6. Validações que passaram
- `current_database = brana_saas`
- `clinica_id = 8` validado
- `expected_email = institutobrana@gmail.com` validado
- clínica encontrada com nome `Instituto Brana`
- e-mail da clínica conferiu exatamente
- usuários esperados encontrados
- prestador esperado encontrado
- assinatura/plataforma esperada encontrada
- contagens por tabela impressas
- ordem planejada de exclusao impressa
- nenhum vínculo inesperado foi reportado
- nenhuma alteração foi feita em dry-run

## 7. Travas testadas ou confirmadas
- O runner ficou em dry-run por padrão.
- `--execute` não foi usado.
- `current_database` foi validado e passou.
- `clinica_id` foi validado e passou.
- `expected_email` foi validado e passou.
- Não houve tentativa de exclusão real.
- Não houve commit.

## 8. Erros encontrados
- Nenhum erro no dry-run.
- Nenhuma trava foi acionada.

## 9. Correção mínima no runner
- Não houve correção mínima no runner nesta etapa.
- O arquivo `backend/scripts/delete_test_clinic_runner.py` permaneceu inalterado.
- A lógica de dry-run já estava funcional e bloqueou a execução real por design.

## 10. Confirmações de segurança
- Nada foi excluído.
- O banco não foi alterado.
- O frontend não foi alterado.
- `seeds`, `signup` e `access_profile` não foram alterados.

## 11. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## 12. Proxima etapa recomendada
Etapa 5 - preparar backup/export documental pre-exclusao e/ou aprimorar o runner para execucao real controlada, ainda sem executar `--execute`, caso a execucao real continue bloqueada no codigo.

## 13. Confirmacoes finais
- Somente `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md` foi criado/modificado nesta etapa.
- `--execute` nao foi usado.
- Nada foi excluido.
- O banco nao foi alterado.
- Nao houve commit de banco.
- O frontend nao foi alterado.
- `seeds`, `signup` e `access_profile` nao foram alterados.
