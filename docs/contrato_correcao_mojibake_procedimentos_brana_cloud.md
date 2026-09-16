# Contrato de Preparacao da Correcao Controlada de Mojibake - Tabelas -> Procedimentos

## 1. Frente e escopo

- Frente: `Tabelas -> Procedimentos`
- Rota: `/app/tabelas/procedimentos`
- Tabelas tecnicas afetadas: `5`, `10`, `11`
- Tabela de referencia limpa: `4`

## 2. Confirmacao tecnica da origem

- O texto corrompido nao vem do React.
- O texto corrompido nao vem de um endpoint novo.
- O texto corrompido ja estava persistido na origem importada.
- O importador atual de procedimentos estava lendo a saida do `OSQL.EXE` como `latin-1` com descarte de erros.
- A leitura bruta de amostras da saida do `OSQL.EXE` valida melhor a decodificacao em `cp850`.
- O dry-run de preparacao foi executado com sucesso e retornou `rows=360`, que significa o total de linhas comparadas na clinica alvo 1 para as tabelas em escopo.

## 3. Resultado desta etapa

- Nao executar `UPDATE`, `INSERT`, `DELETE`, `ALTER`, `TRUNCATE` ou reimportacao.
- Nao alterar backend funcional, banco, migrations ou endpoints para gravacao nesta etapa.
- Preparar apenas:
  - script de preview/dry-run;
  - contrato documental;
  - ajuste preventivo do importador para futura execucao.

## 4. Estrategia segura

1. Ler a origem legada somente para comparacao.
2. Comparar nomes atuais do banco com os nomes recuperados da origem EasyDental.
3. Classificar diferencas por tabela e codigo.
4. Gerar saida JSON/CSV de preview, sem gravacao.
5. Preservar referencia limpa da tabela `PARTICULAR` como amostra de controle.

## 4.1 Chave de correspondencia

- Chave operacional: `tabela_codigo + procedimento_codigo`.
- Campos equivalentes no banco/origem: `tabela_id` com a tabela tecnica e `codigo`/`NROPROCTAB` do procedimento.
- Comportamento quando a chave nao e unica: bloquear a linha, nao escolher o primeiro registro.
- Comportamento quando nao existe correspondente: classificar como `E` e manter fora de qualquer escrita automatica.
- O preview e os scripts futuros exportam `procedimento_id`, `clinica_id`, `tabela_id`, `codigo`, `nome_atual`, `nome_origem`, `categoria` e `chave_origem`.
- Regra final de B: apenas mojibake comprovado no nome atual com fonte única e segura; Regra final de C: diferenças editoriais, numéricas, de pontuação, sufixo ou texto sem marcador confiável de encoding.

## 5. Regras de preparacao

- O importador de `backend/scripts/migrar_tabelas_procedimentos_easy.py` deve decodificar a saida do `OSQL.EXE` em `cp850`.
- Em caso de erro de decodificacao, o preview deve substituir caracteres invalidos em vez de apagar silenciosamente.
- O script de preview nao grava dados e nao aceita modo de aplicacao.
- O modo `apply` ainda nao foi implementado nesta passada; a etapa permanece somente de leitura.
- O preview usa transacao apenas como futura exigencia de escrita, ainda nao executada aqui.
- `backend/scripts/aplicar_correcao_mojibake_procedimentos.py` exige `--apply` e `--table-id` para qualquer escrita futura.
- `backend/scripts/rollback_correcao_mojibake_procedimentos.py` exige `--apply-rollback` e `--table-id` para qualquer reversao futura.
- `backend/scripts/backup_correcao_mojibake_procedimentos.py` valida conteudo e contagem antes de gerar backup JSON.
- `backend/scripts/validar_classificacao_mojibake_procedimentos.py` valida os exemplos de B/C/A do contrato sem escrita.

## 6. Saidas esperadas

- Lista dos procedimentos com divergencia textual entre banco atual e origem EasyDental.
- Resumo por tabela.
- Arquivo JSON opcional.
- Arquivo CSV opcional.

## 7. Validacao esperada antes de qualquer escrita futura

- Conferir amostras da tabela 5, 10 e 11 contra a origem.
- Conferir que a tabela 4 permanece como referencia limpa.
- Conferir que a decodificacao do preview corresponde a acentuacao correta observada no source.
- Confirmar que apenas as linhas classificadas como `B` sao candidatas seguras a escrita, e que `C`, `D`, `E`, `F`, `G`, `H` e `I` ficam bloqueadas ou manuais.
- Se a contagem do preview nao corresponder ao contrato fechado de candidatos seguros, a geração de backup deve abortar.
- Os números atuais do preview reclassificado ficaram em `B=54` para a tabela `5` e `B=114` para a tabela `11`.
- O backup real da tabela 5 foi gerado com sucesso em `backend/backups/mojibake_procedimentos/backup_tabela_5.json`.
- A tabela 4 foi reaberta apenas para leitura/preview/exportacao; continua sem apply e sem candidatos B seguros nesta etapa.
- A tabela 11 permanece apenas validada em preview e continua sem apply nesta etapa.
- No backup gerado, `tabela_id` representa a FK técnica interna do procedimento (`47` para a tabela de código `5`); a identificação de negócio continua sendo feita por `tabela_codigo = 5`.
- A aplicação controlada foi executada apenas para a tabela código `5`, com `54` atualizações confirmadas e sem impacto documentado em `4`, `10` ou `11`.
- A validação real pós-apply confirmou `GET /me` com `200`, `GET /procedimentos?tabela_id=5` com `200`, `GET /procedimentos/filtros` com `200` e abertura autenticada da tela no navegador local.

## 7.1 Backup e rollback planejados

- Backup futuro: exportar somente as colunas de controle `id`, `tabela_id`, `codigo`, `nome`, `clinica_id`.
- Formato sugerido: CSV UTF-8 ou JSON UTF-8 com carimbo de data/hora.
- Local seguro: pasta de backup fora da arvore de escrita operacional, com nome incluindo data e hora.
- Comando de geraçao futura: deve ser um dry-run/export isolado, nunca integrado ao apply.
- Rollback futuro: restaurar somente os registros afetados a partir do backup validado.
- Validacao do backup antes do apply: checar contagem, hash do arquivo e amostra de linhas.

## 8. Regra de rollback conceitual

- Como nenhuma escrita foi executada nesta etapa, nao existe rollback de dados a fazer.
- O rollback futuro, se autorizado, deve ser feito por backup do banco antes de qualquer `UPDATE` em massa.

## 9. Estado final

- A preparacao ficou fechada para autorizacao humana.
- Nenhum registro foi alterado.
- Nenhuma reimportacao foi executada.
- O contrato segue aguardando autorizacao explicita para escrita.
- A validação do backup da tabela 5 passou em modo somente leitura para `apply` e `rollback`.
- A tabela `4` entrou no preview somente leitura desta etapa, fechando `336` linhas e `0` candidatos B seguros; continua sem backup e sem apply.

- A tabela 11 passou por preview, backup, valida??o de seguran?a e apply controlado, com `114` atualiza??es e sem impacto nas tabelas 4, 5 ou 10.
- A API validada permaneceu em `200` em `GET /me`, `GET /procedimentos?tabela_id=11` e `GET /procedimentos/filtros`; a valida??o visual autenticada no navegador tamb?m foi conclu?da.

- O fechamento documental do Painel de Cadastro foi registrado sem abrir nova frente de código ou dados; a tabela 10 continua bloqueada e a frente 11 segue como concluída em mojibake.
