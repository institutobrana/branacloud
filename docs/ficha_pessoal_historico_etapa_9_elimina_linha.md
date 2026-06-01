# Ficha Pessoal - Historico - Etapa 9 - Elimina linha

## Objetivo

Implementar de forma conservadora o fluxo de eliminacao da linha selecionada na aba Historico.

## Escopo aplicado

- O botao `Elimina linha` passou a atuar sobre a linha atualmente selecionada.
- A remocao eh local, feita apenas na grade da tela.
- A selecao remanescente eh reencaixada de forma previsivel.
- Se nao houver linha selecionada, a tela nao quebra e exibe um feedback simples.

## Como a remocao local funciona

- A linha selecionada eh removida do DOM da grade.
- Apos a remocao, a selecao tenta ir para a linha anterior ou posterior disponivel.
- Se nao restarem linhas, a selecao eh limpa.
- O fluxo reaproveita a infraestrutura local ja existente de selecao, foco e estados da aba.

## Compatibilidade com a persistencia da Etapa 7

- A persistencia continua passando pelo fluxo ja existente de `extra.historico_aba`.
- Como a remocao ocorre na grade local antes do salvamento, a serializacao posterior reflete corretamente a linha eliminada.
- Nao houve alteracao de backend, schema, migration, seed ou endpoint.

## O que nao mudou

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.
- Nao houve alteracao de outras abas da Ficha Pessoal.
- Nao foi implementada a funcionalidade de Propriedades da linha.

## Riscos observados

- Se o usuario eliminar uma linha enquanto nao houver selecao valida, o sistema apenas nao executa a acao.
- O comportamento foi mantido conservador para evitar perda de contexto da linha ativa.

## Como testar no sistema

- Abrir Ficha Pessoal.
- Selecionar um paciente.
- Entrar na aba Historico.
- Confirmar primeiro se o conteudo gravado anteriormente reaparece apos reabrir o paciente.
- Selecionar uma linha existente.
- Clicar em `Elimina linha`.
- Confirmar se a linha some da grade sem quebrar a tela.
- Confirmar se a selecao restante fica coerente.
- Clicar no botao geral `Grava`.
- Fechar e reabrir a Ficha Pessoal do mesmo paciente.
- Confirmar se a linha eliminada nao reaparece.
- Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada

Propriedades da linha funcional.
