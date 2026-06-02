# Ficha Pessoal - Historico - Controle de linha unica e descricao obrigatoria

## Objetivo
- Impedir a criacao de multiplas linhas rascunho ao clicar repetidamente em `Inserir linha`.
- Exigir que a descricao do procedimento seja preenchida antes de concluir a linha com `Enter` ou salvar a ficha com `Grava`.
- Exibir a mensagem legada `Campo descrição do procedimento não pode ser nulo.` quando a descricao estiver vazia.

## Regras aplicadas
- `Inserir linha` cria apenas uma linha rascunho por vez.
- Se ja existir uma linha rascunho, novo clique em `Inserir linha` nao cria outra linha.
- Se a linha rascunho estiver sem descricao, o sistema exibe a mensagem do legado e nao avanca.
- `Enter` salva a linha atual apenas quando a descricao estiver preenchida e entao abre a proxima linha.
- `Grava` valida a existencia de uma linha rascunho vazia antes de salvar a ficha inteira.

## O que foi alterado
- A linha padrao passou a nascer sem texto automatico na coluna `Historico`.
- O modulo da aba Historico ganhou validacao local de descricao obrigatoria.
- O botao principal `Grava` da ficha passou a consultar essa validacao antes de serializar o Historico.

## O que nao mudou
- A grade continua com 4 colunas.
- O modal de `Propriedades do histórico` continua intacto.
- Nao houve alteracao em backend, banco, migrations, seeds ou endpoints.

## Backup
- Backup criado antes da alteracao: `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_130144`

## Checks
- `node --check frontend/js/modules/ficha-pessoal-aba-historico.js`: OK
- `node --check frontend/app.js`: OK

