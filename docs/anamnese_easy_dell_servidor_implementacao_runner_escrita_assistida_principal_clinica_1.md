# Ficha Pessoal - Anamnese - Implementacao do runner assistido do Principal na clinica 1

## 1. Objetivo
- Implementar um runner/controlador seguro para a futura escrita assistida das respostas do questionario `Principal` na clinica 1.
- Manter `dry-run` como modo padrao e exigir `--execute` para qualquer escrita real futura.
- Garantir regra de nao sobrescrita, backup previo, validacao antes da escrita e relatorio pos-execucao.

## 2. Contexto
- A expansao estrutural do `Principal` da clinica 1 ja foi executada e validada.
- O dry-run das respostas do `Principal` apos a estrutura completa ja tinha sido aprovado.
- O contrato de escrita assistida do `Principal` na clinica 1 ja estava documentado.
- O paciente legado e o paciente Brana correspondente continuam sendo `Joon Yun Lee Lee` (`id=273`).
- O questionario no escopo continua sendo `Principal`, com 35 perguntas no Brana.

## 3. Commit de base
- Expansao estrutural: `d161a4ad3303ae564f22c14b3092b0edc02d9ccc`
- Validacao da expansao: `f79f779882468e9879231a286c2f7129d11185a4`
- Dry-run das respostas apos estrutura completa: `1f0fbc32a55359f8a0b8853aa4f6ecdf83f7dbbb`
- Contrato de escrita assistida: `2304bea936e535a58fc793d40f1b93100ee4eddf`

## 4. Arquivo implementado
- [`D:\BRANA ARQUIVOS\BRANA CLOUD\backend\scripts\runner_anamnese_principal_clinica1_write_assisted.py`](D:\BRANA%20ARQUIVOS%20BRANA%20CLOUD\backend\scripts\runner_anamnese_principal_clinica1_write_assisted.py)

## 5. Backup criado
Backup manual criado antes da validacao do runner:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\anamnese_principal_write_assisted_runner_clinica_1\`

Arquivos gerados no backup:

- `anamnese_questionarios_before.csv`
- `anamnese_perguntas_before.csv`
- `anamnese_respostas_before.csv`
- `principal_plan_before.csv`
- `manifest_before.json`
- copia do runner `runner_anamnese_principal_clinica1_write_assisted.py`

## 6. Resultado do dry-run do runner
O runner foi executado em modo padrao `dry-run` e retornou:

- `PRINCIPAL_WRITE_ASSISTED_DRY_RUN_OK`
- `clinic_id=1`
- `questionario=Principal (id=2)`
- `patient_legacy_id=273`
- `patient_name=Joon Yun Lee Lee`
- `principal_questions_total=35`
- `existing_responses_on_target_patient=0`
- `plan_total=35`
- `migravel_sem_conflito=35`
- `conflicts=0`
- `EXECUTE_DISABLED_IN_THIS_STAGE`

Resumo do preview:

- o plano carregado permaneceu com 35 respostas candidatas;
- o destino no Brana continua completo;
- nao ha respostas existentes de Principal para o paciente alvo;
- o backup de snapshot foi criado com sucesso;
- nenhuma escrita real foi executada.

## 7. Regra de escrita do runner
- `dry-run` e o modo padrao.
- `--execute` deve ser informado explicitamente para qualquer escrita real futura.
- O runner deve abortar se houver conflito de resposta existente.
- O runner deve abortar se o total esperado de 35 respostas mudar.
- O runner deve abortar se o match do paciente deixar de ser inequivoco.
- O runner deve manter backup anterior obrigatorio.

## 8. Compatibilidade do envelope
- O runner preserva a saida no formato B2 ja adotado na aba `Anamnese`.
- A saida futura continua baseada em envelope textual JSON stringificado.
- O `resposta` foi mantido no conteudo semanticamente compatível com `sim` / `nao`.
- O `complemento` segue preservado para o caso de extensoes futuras.

## 9. Confirmacoes de nao alteracao
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado nesta etapa.
- backend funcional de rotas/modelos nao foi alterado.
- banco nao foi alterado.
- migrations, seeds, endpoints, `.env`, payload e formato externo de salvamento nao foram alterados.
- nenhum arquivo do EasyDental foi alterado.

## 10. Checks executados
- `python -m py_compile backend/scripts/runner_anamnese_principal_clinica1_write_assisted.py`
- execucao do runner em `dry-run`
- validacao de snapshot no backup
- `git status --short`
- `git diff --stat`
- `git diff -- docs/11_roadmap_desenvolvimento.md`
- `git diff -- backend/scripts/runner_anamnese_principal_clinica1_write_assisted.py`

## 11. Conclusao
- O runner assistido do `Principal` da clinica 1 ficou pronto em modo seguro.
- O `dry-run` passou.
- O backup snapshot foi criado.
- A escrita real continua bloqueada para esta etapa, aguardando `--execute` explicito e autorizacao posterior.

## 12. Proxima recomendacao
- Manter o runner apenas em dry-run ate nova autorizacao.
- Se houver ordem para execucao real, revalidar o estado do banco e o plano antes de qualquer escrita.
