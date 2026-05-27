Exclusão segura da conta `institutobrana@gmail.com` — preparação para validação 8J/8K/8P

## 1. Contexto

- As Subetapas 8J, 8K e 8P já estão implementadas e precisam ser validadas em uma nova conta limpa.
- O e-mail `institutobrana@gmail.com` precisava ser liberado para novo cadastro.
- O usuário informou inicialmente a hipótese de `ID 17`, mas a confirmação por leitura do banco mostrou que a conta correta era a clínica `ID 8`.
- A exclusão segura foi tratada como operação operacional separada.
- Setup, senha interna e o erro textual da tela de setup ficam fora desta etapa.

## 2. Documentos revisados

Documentos revisados antes da exclusão:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md`
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/exclusao_segura_conta_16_institutobrana_validacao_8j_8k.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auditoria_easydental_virgem_subetapa_8c_baseline_conta_16.md`

Resumo do procedimento aplicavel encontrado:
- o contrato central exige identificação, diagnóstico somente leitura, backup/export, dry-run, transação e validação pós-exclusão;
- a trilha histórica da clínica 8 confirmou que a exclusão segura precisa ser conduzida por runner controlado e validada por leitura antes da execução real;
- a conta alvo correta foi confirmada por e-mail no banco como clínica `ID 8`, não `17`.

## 3. Conta alvo

- E-mail: `institutobrana@gmail.com`
- ID informado pelo usuário: `17`
- ID confirmado no banco: `8`
- Confirmação: e-mail e ID não batiam com a hipótese inicial do usuário, mas o e-mail bate exatamente com a clínica 8.
- Finalidade: remover a conta de teste para liberar o e-mail e permitir validação limpa das Subetapas 8J, 8K e 8P.

## 4. Procedimento aprovado encontrado

Procedimento usado na prática:
- contrato: `docs/contrato_exclusao_segura_contas_clinicas.md`
- backup/export somente leitura: `backend/scripts/export_test_clinic_backup.py`
- runner: `backend/scripts/delete_test_clinic_runner.py`
- modo de uso: dry-run primeiro; execução real apenas com `--execute` e confirmação explícita

Limitações observadas:
- o runner é travado para a clínica 8 e para `institutobrana@gmail.com`;
- o dry-run do runner genérico confirmou a clínica 8, usuários vinculados e dependências;
- a execução real exige o mesmo runner controlado com `clinica_id` e `expected_email` válidos.

Riscos considerados:
- exclusão de uma conta ainda usada como baseline;
- confusão entre o ID inicialmente imaginado e o ID confirmado no banco;
- remoção de dados vinculados fora do escopo;
- necessidade de validação manual posterior em nova conta limpa.

## 5. Dry-run

Comando usado no dry-run:
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com
```

Resultado do dry-run:
- a clínica alvo identificada foi somente a ID `8`;
- o e-mail confirmou exatamente `institutobrana@gmail.com`;
- usuários vinculados encontrados: `19` e `20`;
- prestador vinculado encontrado: `13`;
- assinatura/plataforma vinculada encontrada: `11`;
- dependências por tabela foram listadas pelo runner;
- nenhuma alteração foi aplicada no dry-run.

Resumo do dry-run:
- `access_profile: 10`
- `anamnese_perguntas: 17`
- `anamnese_questionarios: 1`
- `categoria_financeira: 86`
- `convenio_odonto: 10`
- `doenca_cid: 14486`
- `etiqueta_modelo: 8`
- `grupo_financeiro: 13`
- `indice_financeiro: 4`
- `item_auxiliar: 1226`
- `lista_material: 1`
- `plano_odonto: 10`
- `plataforma_assinaturas: 1`
- `prestador_odonto: 1`
- `procedimento: 448`
- `procedimento_generico: 591`
- `procedimento_generico_fase: 4`
- `procedimento_generico_material: 1714`
- `procedimento_material: 1530`
- `procedimento_tabela: 2`
- `simbolo_grafico_catalogo: 142`
- total estimado na execução real: `20308`

## 6. Execução real

Comando usado na execução real:
```powershell
python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute
```

Confirmação usada:
- `y`

Resultado da execução real:
- a exclusão concluiu com sucesso;
- a clínica `ID 8` foi removida;
- o e-mail `institutobrana@gmail.com` foi liberado;
- a execução ocorreu uma única vez;
- o commit de banco ocorreu ao final da rotina.

## 7. Resultado

- conta removida: sim
- ID removido: `8`
- e-mail liberado: sim
- outras contas afetadas: nenhuma
- erros/alertas: nenhum na exclusão real concluída
- pendências: nenhuma para a exclusão em si

## 8. Segurança

Confirmado:
- nenhuma outra conta foi alterada;
- EasyDental não foi alterado;
- as implementações 8J, 8K e 8P foram preservadas;
- frontend funcional não foi alterado;
- backend funcional não foi alterado;
- setup e senha interna não foram alterados;
- não houve `git reset`, `git clean` ou `git restore`.

Verificação pós-exclusão:
- `clinicas.id = 8` não existe mais;
- `institutobrana@gmail.com` não aparece mais como clínica/usuário;
- `usuarios.id 19 e 20` não existem mais;
- `prestador_odonto.id 13` não existe mais;
- `access_profile`, `etiqueta_modelo`, `usuario_perfil_acesso` e `plataforma_assinaturas` da clínica 8 ficaram zerados/removidos;
- somente as clínicas legadas remanescentes continuam no banco.

## 9. Próximo teste manual

O próximo teste manual recomendado é:
- criar nova conta com `institutobrana@gmail.com`;
- validar a unidade `Principal / 0001`;
- validar as 10 tabelas de procedimentos/preços;
- confirmar as contagens esperadas da Subetapa 8P;
- confirmar que `Tabela Exemplo` não nasce;
- confirmar que `Brana` nasce como padrão/privada;
- confirmar que `Particular` nasce como tabela herdada;
- registrar o resultado como validação da trilha 8J/8K/8P.

## 10. Próxima subetapa recomendada

`EasyDental virgem - Subetapa 8Q - validacao manual da nova conta apos 8J/8K/8P`

## 11. Plano de verificação

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
- conta ID 16 já havia sido tratada na trilha anterior e não foi alterada nesta etapa;
- dados sensíveis não foram expostos;
- blindagem textual/mojibake foi respeitada.
