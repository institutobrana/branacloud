# Ficha Pessoal - Historico - Trava da coluna Cirurgiao no duplo clique

## Objetivo
- Ajustar a grade da aba `Historico` para ficar mais fiel ao EasyDental.
- Garantir que a coluna 2 `Cirurgiao` permaneça bloqueada para edicao por duplo clique.

## Baseline e backup
- Branch: `modularizacao-segura-fase-1`
- Backup criado antes da mudanca:
  - `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_123621`

## O que foi alterado
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - a coluna `Cirurgiao` foi travada para nao entrar em edicao por duplo clique
  - o foco e a selecao ainda podem chegar nela, mas sem transformar a célula em editavel
  - as demais colunas continuam editaveis quando permitido

## Checks executados
- `node --check frontend/js/modules/ficha-pessoal-aba-historico.js`
- `node --check frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
- `git diff --stat`

## O que nao foi alterado
- `frontend/app.js`
- `frontend/index.html`
- backend
- banco
- migrations
- seeds
- endpoints
- modulo `Propriedades da linha`

## Pendencias ainda abertas
- Validacao manual da trava da coluna `Cirurgiao`.
- Validacao final de `Regiao`.
- Fechamento de `Cor de fundo`.
- Revisao da dependencia com `INTERVENCAO`.

## Observacao
- A mudanca foi feita apenas no comportamento da grade da aba `Historico`, sem mexer no resto do sistema.
