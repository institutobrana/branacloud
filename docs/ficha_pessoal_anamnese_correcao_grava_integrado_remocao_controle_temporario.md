# Ficha Pessoal - Correcao do Grava integrado e remocao do controle temporario da Anamnese

## Contexto

A implementacao B2 da aba `Anamnese` da `Ficha Pessoal` estava funcional, mas ainda exibindo controles temporarios que nao deveriam permanecer na interface:

- o texto `Persistencia B2 ativa.`
- o botao `Salvar anamnese`

O fluxo correto definido para a `Ficha Pessoal` e que a gravacao da Anamnese aconteca pelo botao geral `Grava`, mantendo a confirmacao local da aba para saidas com alteracoes pendentes.

## Commit validado

`750945ba5a8f8d2d0154965a2dac58c42fbbc839`

## Correcoes validadas

- remocao do texto temporario `Persistencia B2 ativa.`
- remocao do botao temporario `Salvar anamnese`
- integracao da gravacao da Anamnese no botao geral `Grava` da `Ficha Pessoal`
- preservacao do modal local de confirmacao da Anamnese com `Sim`, `Nao` e `Cancelar`
- preservacao do comportamento de saida da aba sem regressao global

## Resultado informado pelo usuario

Nao informado ainda nesta etapa.

## Fluxo esperado apos a correcao

- abrir `Ficha Pessoal`
- editar a `Anamnese`
- clicar em `Grava`
- salvar a Anamnese pelo fluxo geral da ficha
- manter a confirmacao local funcionando para saidas/abandono de alteracoes pendentes

## Decisao pos-correcao

A Anamnese passa a usar o botao geral `Grava` da `Ficha Pessoal` para persistir as respostas B2, sem controles temporarios de UI.

## Confirmacoes de nao alteracao

- nenhum codigo foi alterado fora do escopo da `Ficha Pessoal`
- `frontend/index.html` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- schema/migrations/seeds/endpoints nao foram alterados
- `.env` nao foi alterado
- `requestJson` nao foi alterado
- payload nao foi alterado
- formato de salvamento nao foi alterado fora do contrato ja existente da Anamnese
- exclusao nao foi alterada
- permissões nao foram alteradas

## Proxima recomendacao

Validar manualmente o uso do botao `Grava` com alteracoes pendentes na `Anamnese` e confirmar que:

- o texto temporario desapareceu
- o botao temporario desapareceu
- o salvamento acontece pelo fluxo geral da ficha
- `Sim`, `Nao` e `Cancelar` seguem funcionando

