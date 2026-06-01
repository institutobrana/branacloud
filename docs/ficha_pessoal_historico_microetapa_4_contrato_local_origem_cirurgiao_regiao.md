# Ficha Pessoal - Historico - Microetapa 4 - contrato local de origem para Cirurgiao e Regiao

## Objetivo

Criar no modulo da aba `Historico` um contrato local explicito de origem para os campos `Cirurgiao` e `Regiao`, sem alterar comportamento funcional percebido.

Esta microetapa e documental e organizacional. Nao altera frontend global, backend, banco, schema, migration, seed, endpoint ou modelo.

## Estrutura local criada

- Foi criado um mapa local de campos com metadados para `Cirurgiao` e `Regiao`.
- O mapa registra:
  - chave logica;
  - indice da celula;
  - rotulo atual;
  - tipo atual;
  - origem atual.
- O contrato ficou no proprio modulo `frontend/js/modules/ficha-pessoal-aba-historico.js`.

## Como Cirurgiao e Regiao passam a ficar descritos no modulo

### Cirurgiao

- chave: `cirurgiao`
- indice: `1`
- rotulo: `Cirurgiao`
- tipo atual: `texto local`
- origem atual: `local/manual`

### Regiao

- chave: `regiao`
- indice: `2`
- rotulo: `Regiao`
- tipo atual: `texto local`
- origem atual: `local/manual`

## O que foi organizado a partir do contrato

- A leitura e a escrita dos campos no modal passaram a usar o contrato local em vez de depender de indices literais espalhados pelo codigo.
- O comportamento funcional permanece o mesmo.
- A serializacao, a reaplicacao e a edicao inline continuam preservadas.

## Confirmacao de que continuam textuais e locais

- `Cirurgiao` continua como texto local na segunda celula da linha.
- `Regiao` continua como texto local na terceira celula da linha.
- Nao houve conversao para combo, lookup ou integracao externa.

## Confirmacao de ausencia de mudanca funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+Tab`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Riscos observados

- Risco baixo, porque o contrato local apenas nomeia e organiza campos que ja eram textuais.
- O principal cuidado e nao transformar esse contrato em uma dependencia externa prematura.
- O uso de indices continua presente no modelo de linha, entao a evolucao futura deve manter a compatibilidade com a serializacao atual.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Inserir ou editar uma linha.
5. Conferir que `Cirurgiao` e `Regiao` continuam funcionando exatamente como antes.
6. Abrir `Propriedades da linha`.
7. Confirmar que nao houve mudanca perceptivel no comportamento.
8. Gravar e reabrir o paciente.
9. Confirmar que a reaplicacao continua funcionando.
10. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima microetapa recomendada

Avaliar se vale introduzir uma sugestao ou lista local nao vinculante para `Cirurgiao` e `Regiao`, ou manter os campos textuais por enquanto.

## Conclusao

O contrato local foi criado para deixar explicito que `Cirurgiao` e `Regiao` sao campos textuais locais nesta etapa, preparando evolucao futura sem quebrar o fluxo atual da aba `Historico`.
