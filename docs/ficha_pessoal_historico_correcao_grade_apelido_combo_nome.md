# Ficha Pessoal - Historico - Correcao da grade para apelido e busca do combo por nome

## Objetivo
- Ajustar a aba `Historico` para ficar mais fiel ao EasyDental sem tocar em backend, banco ou fluxo global.
- Fazer a grade mostrar o `apelido` do prestador na coluna `Cirurgiao`.
- Fazer a combo `Cirurgiao responsavel` listar todos os prestadores, ordenar por nome e permitir busca por nome.

## Baseline e backup
- Branch: `modularizacao-segura-fase-1`
- Baseline congelado antes da mudanca.
- Backup criado em `D:\BRANA ARQUIVOS\_backups_brana\historico\20260602_121520`
- Arquivos preservados no backup:
  - `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
  - `docs/11_roadmap_desenvolvimento.md`

## O que foi alterado
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - a coluna `Cirurgiao` passou a priorizar o `apelido` do prestador como texto visivel
  - a normalizacao do prestador passou a separar nome, apelido e texto visivel
  - a persistencia local continua baseada no ID e no envelope atual
- `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js`
  - a combo `Cirurgiao responsavel` continuou nativa
  - a lista passou a ser ordenada por `nome`
  - a exibicao da opcao ficou orientada ao `apelido`
  - a busca por teclado passou a procurar por `nome`
  - prestadores inativos continuam disponiveis

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

## Pendencias ainda abertas
- Validacao manual visual da tela.
- Confirmacao final da regra de `Regiao`.
- Conferencia de `Cor de fundo`.
- Fechamento da dependencia com `INTERVENCAO`.

## Observacao
- Esta correcao foi mantida localmente nos modulos da aba `Historico` para reduzir o risco de regressao.
