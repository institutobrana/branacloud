# Ficha Pessoal - Historico - Ordenacao por data com linha rascunho no final

## Objetivo
- Manter a aba Historico mais fiel ao EasyDental, com a lista ordenada por data e a linha rascunho sempre no final.
- Impedir insercao entre linhas.
- Preservar a coluna `Cirurgiao` bloqueada para duplo clique.

## Regra aplicada
- `Inserir linha` sempre cria uma nova linha no fim da tabela.
- Se ja existir uma linha rascunho, uma nova insercao consecutiva continua bloqueada.
- A ordem da tabela passa a ser reavaliada por data ao confirmar a linha e ao serializar a ficha.
- A linha rascunho permanece por ultimo.
- O criterio de desempate usa a ordem original da linha.

## Comportamento preservado
- Clique simples continua selecionando a linha inteira.
- Duplo clique continua editando a linha, exceto a coluna `Cirurgiao`.
- `ESC` continua restaurando o estado anterior da linha.
- `Enter` continua confirmando a linha atual e abrindo a proxima.
- `Grava` continua validando a linha atual antes do salvamento.

## Backup
- Backup previo da etapa: `D:\\BRANA ARQUIVOS\\_backups_brana\\historico\\ordenacao_20260602_170212`

## Observacao
- Nao houve alteracao de backend, banco, migration ou endpoint.
