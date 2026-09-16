# Auditoria do Bloco 02 - Odontograma

## Contexto

Bloco auditado:
- odontograma / arcada clinica / resumo do tratamento

Referencia funcional:
- o odontograma deve refletir o paciente piloto e o tratamento piloto;
- o bloco lateral de contexto deve permanecer sincronizado com o mesmo paciente e tratamento.

## Evidencia observada

No browser, apos abrir o paciente piloto `214`:

- o painel principal do odontograma ficou visivel;
- o seletor de tratamento exibiu `Tratamento 239 - 03/11/2008 - Finalizado`;
- o seletor ficou com valor selecionado `6`;
- o feedback indicou `Odontograma carregado em modo de leitura.`;
- a legenda do odontograma apareceu com 3 itens;
- o bloco principal da arcada permaneceu carregado;
- nao houve erro de console durante a navegacao.

## Divergencia encontrada

O painel lateral de contexto nao permaneceu sincronizado com o caso carregado:

- `Paciente` continuou como `Sem paciente selecionado.`;
- `Tratamento` continuou como `Sem tratamento selecionado.`;
- `Observações`, `Imagens`, `Documentos` e `Agenda` ficaram nos estados vazios padrao;
- a grade de historico nao apareceu como completada na leitura automatizada;
- isso indica que o odontograma central funciona, mas o estado lateral ainda nao acompanha o paciente ativo corretamente.

## Diagnostico

Status da auditoria:
- parcial

Classificacao:
- sincronia funcional entre odontograma central e contexto lateral

## Pendencia

É necessario sincronizar o estado do paciente e do tratamento entre:

- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`

para que o painel lateral deixe de exibir o vazio padrao enquanto o caso piloto esta carregado.

## Proxima acao sugerida

Auditar o bloco de tratamentos por data e o fluxo de selecao ativa para entender onde o estado deixa de propagar para o contexto lateral.
