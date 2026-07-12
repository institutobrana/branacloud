# Encerramento temporario - Procedimentos genericos

## 1. Objetivo

Registrar o fechamento temporario da frente `Tabelas -> Procedimentos genericos` no novo frontend React do Brana Cloud.

Esta documentacao consolida o estado atual da frente e serve como marco de pausa controlada para retomada futura, sem abrir nova funcionalidade agora.

## 2. Referencias usadas

- EasyDental Desktop como modelo oficial de comportamento funcional.
- Brana Cloud legado como referencia historica e de migracao.
- `docs/contrato_implementacao_procedimentos_genericos_frontend_react.md`
- `docs/frontend_react_padrao_shell_modulos_administrativos.md`
- `docs/11_roadmap_desenvolvimento.md`

## 3. O que foi consolidado

### Shell e listagem

- Barra horizontal integrada ao shell administrativo.
- Filtros principais na barra.
- Listagem com as colunas corretas:
  - `Codigo`
  - `Procedimento generico`
  - `Especialidade`
  - `Status`
- Coluna de especialidade exibindo nome amigavel em vez de codigo numerico.
- Remocao da coluna falsa `/` da grade de materiais.

### Modal principal

- Modal principal de novo procedimento.
- Abas:
  - `Principal`
  - `Custos diretos`
  - `Vinculos`
- Ajustes visuais de compactacao e distribuicao interna.
- Combo de simbolo grafico com preview funcional.
- Campo `Sequencia de execucao` validado no contrato da frente de fases.

### Fluxo de edicao

- Fluxo `Altera...` ligado ao item selecionado.
- Persistencia via contrato existente do procedimento generico.
- Modal proprio de confirmacao de exclusao para `Fases`.
- Modal proprio de confirmacao de exclusao para `Materiais`.

### Fases

- Modal principal de `Fases`.
- Submodal de fase com tres campos confirmados no contrato:
  - `Nome da fase`
  - `Sequencia de execucao`
  - `Duracao em minutos`
- Tabela compactada e ajustada para leitura sem scroll horizontal.
- Confirmacao de exclusao substituida por modal proprio.

### Materiais

- Modal principal de `Materiais`.
- Submodal de material.
- Tabela ajustada para tres colunas reais:
  - `Material`
  - `Quantidade`
  - `Custo total`
- Confirmacao de exclusao substituida por modal proprio.

## 4. Estado atual

- A frente ficou funcionalmente consolidada para o escopo atual.
- Os modais e tabelas principais receberam acabamento visual coerente com o novo frontend.
- O contrato confirmado do EasyDental Desktop foi incorporado no fluxo de fases.
- Materiais e fases receberam fluxos proprios de confirmacao de exclusao.

## 5. Pontos que podem ficar para retomada futura

- Acabamento fino de textos, titulos e densidade visual em telas filhas.
- Eventual revisao de pequenos detalhes de responsividade.
- Qualquer refinamento futuro de layout deve respeitar o shell compartilhado e o contrato ja consolidado.

## 6. Conclusao

A frente `Procedimentos genericos` fica pausada temporariamente neste ponto, com o estado funcional e visual consolidado para retomada posterior sem abrir nova funcionalidade nesta rodada.
