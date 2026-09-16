# Auditoria do Bloco 03 - Tratamentos por Data

## Contexto

Bloco auditado:
- lista de tratamentos por paciente;
- selecao do tratamento ativo.

Referencia funcional:
- o paciente deve exibir os tratamentos disponiveis;
- o tratamento selecionado deve governar o restante da tela;
- a tela precisa refletir a selecao ativa no resumo e nos blocos correlatos.

## Evidencia observada

No browser, com o paciente piloto `214` carregado:

- o seletor de tratamento exibiu duas opcoes:
  - `Selecione um tratamento`;
  - `Tratamento 239 - 03/11/2008 - Finalizado`;
- o valor selecionado ficou `6`;
- o odontograma carregou em modo de leitura;
- o seletor permaneceu funcional e sem erro de console.

## Divergencia encontrada

O resumo lateral nao acompanhou o tratamento selecionado:

- `Tratamento` continuou como `Sem tratamento selecionado.`;
- a selecao do combo nao propagou o estado para o contexto lateral;
- o historico renderizado nao apareceu como bloco coerente com a selecao na leitura automatizada.

## Diagnostico

Status da auditoria:
- parcial

Classificacao:
- sincronia de selecao do tratamento

## Pendencia

É necessario fechar o fluxo entre:

- seletor de tratamento;
- resumo lateral;
- odontograma central;
- historico clinico.

O tratamento selecionado precisa atualizar todos os blocos dependentes, e nao apenas a lista.

## Proxima acao sugerida

Auditar o bloco de contexto clinico lateral para entender onde a propagacao do paciente e do tratamento interrompe.
