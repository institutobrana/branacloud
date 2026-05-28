# Exclusao segura da clinica 12 - `institutobrana@gmail.com` - preparacao para teste apos 8U

## 1. Contexto

- Esta etapa prepara uma nova conta limpa para validar as Subetapas 8P, 8K, 8R e 8U em conjunto.
- O usuario informou `clinica_id = 12`, mas a exclusao segura exigia confirmar o alvo pelo e-mail antes de qualquer escrita.
- O contrato de exclusao segura existente foi seguido: diagnostico somente leitura, backup/export, dry-run, execucao unica e validacao pos-execucao.
- Setup, senha interna, Opcoes do Sistema, frontend, EasyDental e contas de outras clinicas ficaram fora do escopo.

## 2. Documentos revisados

Documentos revisados:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/exclusao_segura_conta_11_institutobrana_pos_8r_execucao.md`
- `docs/exclusao_segura_conta_institutobrana_pos_8r.md`
- `docs/exclusao_segura_conta_institutobrana_validacao_8j_8k_8p.md`
- `docs/exclusao_segura_conta_16_institutobrana_validacao_8j_8k.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md`
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/auditoria_easydental_virgem_subetapa_8u_usuario_adm_dentista_prestador_unidade.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Resumo do procedimento aprovado encontrado:
- a trilha segura exige confirmar o alvo por banco antes de excluir;
- o procedimento anterior da clinica 11 serviu como referencia de padrao;
- backup/export e dry-run antecedem a execucao real;
- a exclusao final precisa validar que o alvo foi removido e o e-mail liberado.

## 3. Scripts revisados/alterados

Scripts revisados:
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/delete_test_clinic_11_runner.py`
- `backend/scripts/export_test_clinic_11_backup.py`
- `backend/scripts/delete_test_clinic_10_runner.py`
- `backend/scripts/export_test_clinic_10_backup.py`

Scripts alterados ou criados:
- `backend/scripts/delete_test_clinic_12_runner.py`
- `backend/scripts/export_test_clinic_12_backup.py`

Justificativa:
- foram criados wrappers especificos para a clinica 12, reaproveitando a rotina segura existente;
- o runner foi ajustado para trabalhar de forma isolada e validar o alvo antes da exclusao;
- o backup/export foi mantido como etapa somente leitura para apoiar reversibilidade.

## 4. Conta alvo

- E-mail alvo: `institutobrana@gmail.com`
- ID informado pelo usuario: `12`
- ID confirmado no banco: `12`
- Confirmacao: ID e e-mail batem exatamente.
- Duplicidade de e-mail: nao havia duplicidade de clinica alvo; o e-mail estava concentrado na clinica 12 e nos registros ligados a ela.
- Confirmacao de conta de teste: sim, tratava-se da conta de teste a ser removida para liberar novo cadastro.

## 5. Backup/export

Comando usado:
```powershell
.\.venv\Scripts\python.exe backend/scripts/export_test_clinic_12_backup.py --clinica-id 12 --expected-email institutobrana@gmail.com
```

Resultado:
- backup/export somente leitura concluido com sucesso;
- caminho do backup/export: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\clinica_12_pre_exclusao`;
- o export incluiu a unidade da clinica 12, alem de usuarios, prestadores, assinaturas, access_profile, etiqueta_modelo e email_codes;
- os artefatos temporarios de backup foram removidos do workspace apos a validacao.

## 6. Dry-run

Comando usado:
```powershell
.\.venv\Scripts\python.exe backend/scripts/delete_test_clinic_12_runner.py --clinica-id 12 --expected-email institutobrana@gmail.com
```

Resultado do dry-run:
- alvo unico confirmado: clinica 12;
- e-mail correto confirmado: `institutobrana@gmail.com`;
- usuarios vinculados encontrados: `27`, `28` e `29`;
- prestadores vinculados encontrados: `17` e `18`;
- assinatura/plataforma vinculada encontrada;
- dependencias listadas sem bloqueio;
- nenhuma alteracao foi aplicada.

## 7. Execucao real

Comando usado:
```powershell
.\.venv\Scripts\python.exe backend/scripts/delete_test_clinic_12_runner.py --clinica-id 12 --expected-email institutobrana@gmail.com --execute
```

Execucao:
- concluida com sucesso;
- foi executada uma unica vez;
- a clinica 12 foi removida;
- o e-mail `institutobrana@gmail.com` foi liberado.

## 8. Resultado

- conta removida: sim
- e-mail liberado: sim
- outras contas afetadas: nenhuma detectada
- pendencias: nenhuma para a exclusao em si

## 9. Seguranca

Confirmado:
- nenhuma outra conta foi afetada;
- frontend e backend funcional nao foram alterados;
- banco, schema, migrations, seeds e endpoints nao foram alterados;
- setup e senha interna nao foram alterados;
- EasyDental nao foi alterado;
- 8P, 8K, 8R e 8U foram preservadas;
- a blindagem textual/mojibake foi respeitada.

## 10. Proximo teste manual

Se o teste for refeito, o proximo passo e criar nova conta com `institutobrana@gmail.com` e validar:
- unidade `Principal / 0001`;
- tabelas de procedimentos com as contagens da 8P;
- `Tabela Exemplo` ausente;
- `Brana` como padrao/privada;
- prestadores `Clínica` e prestador ADM/Mestre funcional com nome do cadastro;
- tipo do prestador ADM como `Cirurgiao dentista`;
- usuario ADM com `Tipo de usuario = Dentista (CD)`, prestador ADM/Mestre funcional e unidade `Principal / 0001`;
- setup continua aparecendo para o ADM inicial;
- registrar resultado antes da 8V.

## 11. Proxima subetapa recomendada

`8U-C` - validacao manual da nova conta apos 8P/8K/8R/8U.

## 12. Plano de verificacao

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- nenhum codigo funcional fora dos scripts de exclusao foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules` nao foram alterados;
- backend funcional nao foi alterado;
- banco/schema/migrations/seeds/endpoints nao foram alterados;
- nenhum arquivo do EasyDental foi alterado;
- nenhuma conta foi criada automaticamente;
- a blindagem textual/mojibake foi respeitada.

