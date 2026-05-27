# Exclusão segura da conta `institutobrana@gmail.com` após 8R

## 1. Contexto

- As Subetapas 8P, 8K e 8R precisam ser validadas em uma nova conta limpa.
- O e-mail `institutobrana@gmail.com` precisava ser liberado para novo cadastro.
- O usuário informou como hipótese os IDs `25` ou `11`.
- A conta alvo precisava ser confirmada por leitura do banco antes de qualquer exclusão.
- Setup, senha interna e o erro textual da tela de setup ficam fora desta etapa.

## 2. Documentos revisados

Documentos revisados:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/exclusao_segura_conta_institutobrana_validacao_8j_8k_8p.md`
- `docs/exclusao_segura_conta_16_institutobrana_validacao_8j_8k.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md`
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auditoria_easydental_virgem_subetapa_8c_baseline_conta_16.md`

Resumo do procedimento aprovado encontrado:
- o contrato central exige identificação, diagnóstico somente leitura, backup/export, dry-run, transação e validação pós-exclusão;
- a trilha histórica existente usa runner controlado travado por `clinica_id` e `expected_email`;
- os scripts disponíveis no repositório foram escritos para a clínica 8 e não para `ID 11`.

## 3. Conta alvo

- E-mail: `institutobrana@gmail.com`
- IDs informados pelo usuário: `25` ou `11`
- ID confirmado no banco: `11`
- Confirmação: o e-mail bate exatamente com a clínica `11`.
- Finalidade: remover a conta de teste para liberar o e-mail e permitir nova validação limpa das Subetapas 8P, 8K e 8R.

## 4. Procedimento aprovado encontrado

Procedimento usado como referência:
- contrato: `docs/contrato_exclusao_segura_contas_clinicas.md`
- backup/export somente leitura: `backend/scripts/export_test_clinic_backup.py`
- runner: `backend/scripts/delete_test_clinic_runner.py`
- modo esperado: dry-run primeiro; execução real somente com `--execute` e confirmação explícita

Limitação crítica encontrada nesta etapa:
- o runner seguro disponível no repositório está travado para `clinica_id = 8` e `expected_email = institutobrana@gmail.com`;
- não foi localizado runner aprovado para `clinica_id = 11`;
- portanto, não havia ferramenta aprovada no estado atual para executar a exclusão da clínica 11 sem alterar código.

Risco principal:
- tentar improvisar exclusão para `ID 11` quebraria o contrato de segurança e poderia afetar dados fora do escopo.

## 5. Backup/export

- Não executado.
- Justificativa: o export/backup seguro disponível está travado para a clínica 8 e não cobre a clínica 11.
- Como não existe runner aprovado para a clínica 11, não houve etapa de backup/export segura para esta conta.

## 6. Dry-run

- Não executado.
- Justificativa: o runner seguro existente não aceita `clinica_id = 11`.
- Sem runner aprovado específico, não foi seguro inventar comando alternativo nem fazer SQL manual.

## 7. Execução real

- Não executada.
- Motivo: não existe, neste estado do repositório, um runner aprovado e específico para `clinica_id = 11`.
- A exclusão real ficou bloqueada por contrato e por ausência de ferramenta segura aplicável.

## 8. Resultado

- conta removida: não
- ID removido: nenhum
- e-mail liberado: não
- outras contas afetadas: nenhuma
- erros/alertas: ausência de runner seguro para `ID 11`
- pendências: definir um contrato/runner específico para a clínica 11 antes de qualquer exclusão

## 9. Segurança

Confirmado:
- nenhuma outra conta foi alterada;
- EasyDental não foi alterado;
- as implementações 8P, 8K e 8R foram preservadas;
- frontend funcional não foi alterado;
- backend funcional não foi alterado;
- setup e senha interna não foram alterados;
- não houve `git reset`, `git clean` ou `git restore`.

## 10. Próximo teste manual

Se e somente se a exclusão vier a ser concluída em etapa própria, o próximo teste manual recomendado será:
- criar nova conta com `institutobrana@gmail.com`;
- validar unidade `Principal / 0001`;
- validar tabelas de procedimentos com as contagens da 8P;
- confirmar `Tabela Exemplo` ausente;
- confirmar `Brana` como padrão/privada;
- confirmar prestadores:
  - `Clínica`;
  - prestador ADM/Mestre funcional com nome do cadastro;
  - tipo `Cirurgião dentista`;
- validar que setup ainda não foi alterado.

## 11. Próxima subetapa recomendada

`EasyDental virgem - Subetapa 8S - execução segura da exclusão da conta 11 após runner específico aprovado`

## 12. Plano de verificação

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- nenhum código foi alterado;
- `frontend/app.js` não foi alterado;
- `frontend/index.html` não foi alterado;
- `frontend/js/modules` não foram alterados;
- `backend` não foi alterado;
- `banco/schema/migrations/seeds/endpoints` não foram alterados;
- nenhum arquivo do EasyDental foi alterado;
- nenhuma query de escrita foi executada nesta conferência documental;
- nenhum script SQL foi executado nesta conferência documental;
- nenhuma conta foi criada;
- conta ID 16 não foi alterada nesta etapa;
- dados sensíveis não foram expostos;
- blindagem textual/mojibake foi respeitada.
