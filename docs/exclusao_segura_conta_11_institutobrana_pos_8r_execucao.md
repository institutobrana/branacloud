# Exclusão segura da clínica 11 — `institutobrana@gmail.com` — execução após 8R

## 1. Contexto

- As Subetapas 8P, 8K e 8R precisam ser validadas em uma nova conta limpa.
- O e-mail `institutobrana@gmail.com` foi confirmado na clínica 11.
- A etapa anterior bloqueou a execução porque o runner seguro existente estava travado para a clínica 8.
- Esta etapa cria e usa um runner seguro específico para a clínica 11.
- Setup, senha interna e o erro textual da tela de setup ficam fora desta etapa.

## 2. Documentos revisados

Documentos revisados:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/exclusao_segura_conta_institutobrana_pos_8r.md`
- `docs/exclusao_segura_conta_institutobrana_validacao_8j_8k_8p.md`
- `docs/exclusao_segura_conta_16_institutobrana_validacao_8j_8k.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md`
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Resumo do procedimento aprovado encontrado:
- o contrato central exige identificação, diagnóstico somente leitura, backup/export, dry-run, transação e validação pós-exclusão;
- a trilha histórica já apontava uso de runner controlado travado por `clinica_id` e `expected_email`;
- como o runner base estava travado para a clínica 8, foi necessário criar um wrapper seguro específico para a clínica 11.

## 3. Scripts revisados/alterados

Scripts revisados:
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/delete_test_clinic_15_runner.py`
- `backend/scripts/export_test_clinic_15_backup.py`

Scripts alterados ou criados:
- `backend/scripts/delete_test_clinic_11_runner.py`
- `backend/scripts/export_test_clinic_11_backup.py`

Justificativa:
- foram criados wrappers pequenos e travados para a clínica 11, reaproveitando a lógica segura já validada para exclusão controlada;
- isso evitou mexer no runner 8 e preservou as etapas históricas existentes.

## 4. Conta alvo

- E-mail alvo: `institutobrana@gmail.com`
- ID confirmado: `11`
- IDs inicialmente suspeitos pelo usuário: `25` ou `11`
- Confirmação: `25` não é a conta alvo; a clínica alvo é a `11`.
- Não há duplicidade de e-mail no banco.

## 5. Backup/export

Comando usado:
```powershell
python backend/scripts/export_test_clinic_11_backup.py --clinica-id 11 --expected-email institutobrana@gmail.com
```

Resultado:
- backup/export somente leitura concluído com sucesso;
- diretório usado: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\clinica_11_pre_exclusao`;
- o backup incluiu manifest, contagens e exportações JSON da clínica 11;
- após a validação, os artefatos de backup foram removidos do workspace para não poluir o status do Git.

## 6. Dry-run

Comando usado:
```powershell
python backend/scripts/delete_test_clinic_11_runner.py --clinica-id 11 --expected-email institutobrana@gmail.com
```

Resultado do dry-run:
- alvo único confirmado: clínica 11;
- e-mail confirmado: `institutobrana@gmail.com`;
- usuários vinculados encontrados: `25` e `26`;
- prestador vinculado encontrado: `16`;
- assinatura/plataforma vinculada encontrada: `12`;
- `email_codes` encontrados para o e-mail;
- dependências listadas pelo runner;
- nenhuma alteração foi aplicada no dry-run.

## 7. Execução real

Comando usado:
```powershell
python backend/scripts/delete_test_clinic_11_runner.py --clinica-id 11 --expected-email institutobrana@gmail.com --execute
```

Execução:
- concluída com sucesso;
- foi executada uma única vez;
- a clínica 11 foi removida;
- o e-mail `institutobrana@gmail.com` foi liberado.

## 8. Resultado

- conta removida: sim
- ID removido: `11`
- e-mail liberado: sim
- outras contas afetadas: nenhuma
- pendências: nenhuma para a exclusão em si

## 9. Segurança

Confirmado:
- nenhuma outra conta foi afetada;
- 8P, 8K e 8R foram preservadas;
- frontend não foi alterado;
- setup e senha interna não foram alterados;
- EasyDental não foi alterado;
- não houve `git reset`, `git clean` ou `git restore`.

## 10. Próximo teste manual

O próximo teste manual recomendado é:
- criar nova conta com `institutobrana@gmail.com`;
- validar unidade `Principal / 0001`;
- validar tabelas de procedimentos com as contagens da 8P;
- validar `Tabela Exemplo` ausente;
- validar `Brana` como padrão/privada;
- validar prestadores:
  - `Clínica`;
  - prestador ADM/Mestre funcional com nome do cadastro;
  - tipo `Cirurgião dentista`;
- validar que setup ainda não foi alterado.

## 11. Próxima subetapa recomendada

`EasyDental virgem - Subetapa 8T - validacao manual da nova conta apos 8P/8K/8R`

## 12. Plano de verificação

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- nenhum código funcional fora dos scripts de exclusão foi alterado;
- `frontend/app.js` não foi alterado;
- `frontend/index.html` não foi alterado;
- `frontend/js/modules` não foram alterados;
- backend funcional não foi alterado;
- `banco/schema/migrations/seeds/endpoints` não foram alterados;
- nenhum arquivo do EasyDental foi alterado;
- nenhuma conta foi criada automaticamente;
- conta ID 16 não foi alterada nesta etapa;
- dados sensíveis não foram expostos;
- blindagem textual/mojibake foi respeitada.
