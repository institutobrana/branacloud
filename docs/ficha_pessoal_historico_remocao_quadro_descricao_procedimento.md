# Ficha Pessoal - Historico - Remocao do quadro separado de descricao

## Objetivo
- Remover da aba Historico o quadro separado de texto rotulado como "Detalhamento do historico" / "Descricao do procedimento" no corpo principal da tela.
- Manter apenas a grade unica do Historico, com fundo branco, como no EasyDental.
- Ajustar o rodape da ficha para mostrar "Ficha de histórico".

## O que foi alterado
- O bloco separado de texto abaixo da grade foi removido do HTML da ficha em `frontend/app.js`.
- As referencias locais ao campo `ficha-historico-texto` foram eliminadas do bootstrap da tela e do fluxo de limpeza/aplicacao do Historico.
- O status/rodape da ficha passou a exibir `Ficha de histórico` quando a aba Historico é selecionada.
- O módulo do Historico deixou de depender do textarea separado, mantendo apenas a tabela principal e o modal de propriedades da linha.

## O que nao mudou
- A grade principal do Historico continua com 4 colunas.
- O modal `Propriedades do histórico` foi preservado.
- Nao houve alteracao em backend, banco, migrations, seeds ou endpoints.
- A persistencia continua no envelope existente do Historico.

## Backup
- Backup criado antes da alteracao: `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_125316`

## Checks
- `node --check frontend/js/modules/ficha-pessoal-aba-historico.js`: OK
- `node --check frontend/app.js`: OK

## Observacao
- O texto da coluna `Historico` na tabela continua existindo; o que foi removido foi o quadro separado abaixo da grade.
