# Exclusao segura da conta 16 - `institutobrana@gmail.com` - preparacao para validacao 8J/8K

## 1. Contexto
- As Subetapas 8J e 8K ja implementaram, de forma isolada, as 10 tabelas de procedimentos/precos e a unidade inicial `Principal / 0001` apenas para novas contas.
- A conta 16 era o baseline/legado usado como referencia anterior.
- O objetivo agora era liberar `institutobrana@gmail.com` para um novo cadastro limpo, de modo que a validacao manual das mudancas 8J/8K pudesse ser feita em uma conta nova.
- A exclusao segura foi tratada como operacao operacional separada; setup, senha interna e demais contratos continuam para etapa posterior.

## 2. Documentos revisados
Documentos revisados antes da exclusao:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md`
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_10_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/auditoria_easydental_virgem_subetapa_8c_baseline_conta_16.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Resumo do procedimento aplicavel encontrado:
- o contrato central exige identificacao, diagnostico somente leitura, plano, dry-run, transacao e validacao pos-exclusao;
- a trilha historica das clinicas 8/9/10/15 confirma o padrao de exclusao segura e a necessidade de liberar o e-mail para novo cadastro;
- nao foi localizado um runner especifico para a conta 16, entao a exclusao foi feita pelo runner generico seguro existente, com dry-run antes da execucao real.

## 3. Conta alvo
- ID: `16`
- E-mail: `institutobrana@gmail.com`
- Nome observado no plano: `Tel`
- Finalidade: remover a conta baseline/legado para liberar o e-mail e permitir validacao limpa das Subetapas 8J e 8K.
- Nao se tratava de excluir qualquer outra conta.

## 4. Procedimento aprovado encontrado
Procedimento usado na pratica:
- contrato: `docs/contrato_exclusao_segura_contas_clinicas.md`
- runner: `backend/scripts/remover_conta_teste.py`
- modo de uso: apenas leitura/planejamento antes da confirmacao, com execucao real apenas apos confirmacao explicita `y`

Limitacoes observadas:
- nao foi encontrado runner especifico travado para `clinica_id = 16` como nas trilhas das clinicas 8/9/10/15;
- o runner encontrado trabalha por e-mail e calcula o escopo por leitura do banco antes da confirmacao;
- nao houve artefato de backup/export especifico encontrado para esta conta nesta etapa.

Riscos considerados:
- exclusao de uma conta ainda usada como baseline;
- liberacao de e-mail sem validacao manual posterior;
- remocao de dados vinculados fora do escopo;
- confusao entre a conta 16 e outras contas legadas.

## 5. Dry-run
Dry-run executado de forma segura ao rodar o runner sem confirmar a exclusao real.

Comando usado:
```powershell
python backend/scripts/remover_conta_teste.py --email institutobrana@gmail.com
```

Resultado do dry-run:
- a clinica alvo identificada foi somente a ID `16`;
- os usuarios vinculados encontrados foram `36` e `37`;
- o plano listou dependencias vinculadas a `clinica_id = 16`;
- o total estimado para remocao foi de `17027` registros (dependencias + usuarios + clinica);
- nenhuma alteracao foi aplicada, porque a confirmacao foi recusada no final do dry-run.

## 6. Execucao real
Comando usado na execucao real:
```powershell
python backend/scripts/remover_conta_teste.py --email institutobrana@gmail.com
```

Confirmacao usada:
- `y`

Resultado da execucao real:
- a exclusao concluiu com sucesso e a transacao foi commitada pelo runner;
- a conta 16 foi removida;
- o e-mail `institutobrana@gmail.com` foi liberado;
- nao houve repeticao da execucao.

## 7. Resultado
- `clinicas.id = 16`: removida
- `institutobrana@gmail.com`: liberado
- outras contas afetadas: nenhuma, apenas as dependencias da conta 16 foram removidas
- erros: nenhum durante a execucao real
- alertas: o runner generico nao e o mesmo runner travado por `clinica_id` usado nas trilhas 8/9/10/15, entao a validacao por leitura foi obrigatoria antes da execucao

## 8. Seguranca
Confirmado:
- nenhuma outra conta foi alterada
- EasyDental nao foi alterado
- as implementacoes 8J e 8K nao foram alteradas
- frontend nao foi alterado
- backend nao foi alterado
- nao houve `git reset`, `git clean` ou `git restore`

Verificacao pos-exclusao:
- somente as clinicas `1` e `4` permanecem no banco
- `clinicas.id = 16` nao existe mais
- `usuarios` com `institutobrana@gmail.com` nao existem mais
- `email_codes` para `institutobrana@gmail.com` esta em `0`

## 9. Proximo teste manual
O proximo teste manual recomendado e:
- criar nova conta com `institutobrana@gmail.com`;
- validar as 10 tabelas de procedimentos/precos;
- validar a unidade `Principal / 0001`;
- confirmar que `Tabela Exemplo` nao nasce;
- confirmar que `Brana` nasce como padrao/privada;
- confirmar que `Particular` nasce como tabela herdada;
- registrar o resultado como validacao da trilha 8J/8K.

## 10. Proxima subetapa recomendada
`EasyDental virgem - Subetapa 8M - validacao manual da nova conta limpa apos exclusao segura da conta 16`

## 11. Plano de verificacao
Confirmado:
- somente o documento novo e o roadmap foram alterados;
- nenhum codigo foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules` nao foram alterados;
- `backend` nao foi alterado;
- `banco/schema/migrations/seeds/endpoints` nao foram alterados;
- nenhum arquivo do EasyDental foi alterado;
- nenhuma query de escrita foi executada nesta conferencia documental;
- nenhum script SQL foi executado nesta conferencia documental;
- nenhuma conta foi criada;
- conta ID 16 foi removida somente na operacao segura documentada acima;
- dados sensiveis nao foram expostos;
- blindagem textual/mojibake foi respeitada.
