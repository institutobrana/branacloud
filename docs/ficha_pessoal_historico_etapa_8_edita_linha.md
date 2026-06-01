# Ficha Pessoal - Historico - Etapa 8 - Edita linha

## Objetivo

Adicionar a acao local de edicao da linha selecionada na aba Historico, reaproveitando a infraestrutura ja criada nas etapas anteriores.

## O que foi feito

- O botao `Edita linha` passou a abrir a linha selecionada para edicao local.
- A edicao reaproveita a navegacao, a selecao e o foco ja existentes na grade.
- Se nao houver linha selecionada, a tela apenas informa que e necessario selecionar uma linha.
- O comportamento continua compatível com `ENTER`, `ESC` e com a persistencia em `extra.historico_aba`.

## O que nao mudou

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.
- Nao houve mudanca em outras abas da Ficha Pessoal.

## Arquivos alterados

- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `docs/11_roadmap_desenvolvimento.md`

## Observacao

Esta etapa mantem a mesma linha de seguranca das anteriores e prepara a base para a Etapa 9, que sera a eliminacao da linha.
