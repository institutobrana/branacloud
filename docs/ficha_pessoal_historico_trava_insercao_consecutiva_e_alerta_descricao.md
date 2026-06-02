# Ficha Pessoal - Historico - Trava de insercao consecutiva e alerta de descricao

## Objetivo
- Permitir a criacao da primeira linha rascunho ao clicar em `Inserir linha`.
- Bloquear apenas a insercao de uma nova linha enquanto ja existir uma linha rascunho ativa.
- Exibir a mensagem do legado quando a descricao obrigatoria estiver vazia.

## Regra observada
- A linha rascunho deve ser salva por `Enter` ou por `Grava`.
- Se o usuario clicar novamente em `Inserir linha` antes de concluir a linha atual, a tela deve impedir a nova insercao.
- Se a descricao estiver vazia, o bloqueio deve exibir o alerta:
  - `Campo descrição do procedimento não pode ser nulo.`

## O que foi ajustado
- A rotina de insercao passou a permitir a primeira linha rascunho normalmente.
- O bloqueio de insercao consecutiva passou a atuar apenas quando ja existe uma linha rascunho.
- A validacao de descricao obrigatoria continua sendo aplicada em `Enter` e em `Grava`.

## O que nao mudou
- A grade continua com 4 colunas.
- O modal de propriedades continua intacto.
- Nao houve alteracao em backend, banco, migrations, seeds ou endpoints.

## Backup
- Backup criado antes da alteracao: `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_130144`

## Checks
- `node --check frontend/js/modules/ficha-pessoal-aba-historico.js`: OK
- `node --check frontend/app.js`: OK
