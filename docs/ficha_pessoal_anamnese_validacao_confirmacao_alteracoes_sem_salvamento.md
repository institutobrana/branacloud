# Ficha pessoal - Validacao da confirmacao local da Anamnese sem salvamento

## Contexto

A etapa anterior implementou a confirmacao local de alteracoes da aba `Anamnese`, sem salvamento real, conforme o contrato `FICHA-ANAM-CONFIRM-A`.

## Modulo validado

Ficha Pessoal - Aba Anamnese.

## Classificacao

Ficha Pessoal / Anamnese e modulo comum/core.

## Commit da implementacao validada

`4e6bc554126ca40077940294a2984a7404353197`

## Decisao contratual

`FICHA-ANAM-CONFIRM-A`

## Confirmacao do usuario

`teste passou`

## Comportamento validado

- modal de confirmacao apareceu quando havia alteracao local pendente;
- `Cancelar` manteve o usuario na Anamnese;
- `Nao` descartou alteracao local e prosseguiu;
- `Sim` nao gravou e apenas avisou limitacao;
- alteracao de `Sim` / `Nao` marcou estado alterado;
- alteracao do complemento marcou estado alterado;
- troca de aba foi protegida;
- `Procura...` foi protegida;
- `Novo` foi protegido;
- `Fechar` foi protegido;
- `Sair` foi protegido;
- navegacao entre pacientes foi protegida;
- troca de questionario foi protegida;
- reentrancia do `Procura...` permaneceu funcional;
- nao houve regressao global percebida pelo usuario.

## Confirmacao sobre salvamento

Ainda nao existe salvamento real de `Sim` / `Nao` + complemento.

Persistencia real precisa de contrato futuro separado.

## Escopo nao alterado

- backend;
- banco;
- payload;
- `requestJson`;
- formato de salvamento;
- endpoints;
- migrations;
- seeds;
- permissoes;
- exclusao.

## Proxima etapa recomendada

Abrir contrato de persistencia real da Anamnese para `Sim` / `Nao` + complemento, se autorizado pelo usuario.
