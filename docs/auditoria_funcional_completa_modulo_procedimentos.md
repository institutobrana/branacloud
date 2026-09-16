# Auditoria funcional completa do modulo Procedimentos

Data da validacao: 2026-07-14

## Escopo validado

Correcoes confirmadas nos campos monetarios do modal de procedimentos:

- Valor de repasse
- Valor do paciente
- Custo de laboratorio

## Resultado funcional

- A digitacao continua agora aceita entrada incremental.
- A normalizacao ocorre no `blur`.
- O `PUT /procedimentos/{id}` passou a enviar valores monetarios como numeros.
- A reapresentacao do modal manteve a formatacao `pt-BR`.

## Registro tecnico usado

- Id: `66927`
- Codigo: `44`
- Nome: `TESTE CONTROLADO PROCEDIMENTO REACT`
- Tabela: `1`

## Evidencias de persistencia

### GET de detalhe

- `valor_repasse`: `210.75`
- `preco`: `1750.9`
- `custo_lab`: `245.3`
- `tempo`: `22`

### Reabertura no modal

- Valor de repasse: `210,75`
- Valor do paciente: `1.750,90`
- Custo de laboratorio: `245,30`
- Tempo de execucao: `22`

## Dashboard financeiro

O painel carregou com `GET /procedimentos/dashboard` e retornou 200.
O preview dinamico passou a usar `POST /procedimentos/dashboard-preview` com a mesma regra oficial do backend.

Campos observados no retorno:

- `custo_fph`
- `custo_material`
- `custo_proc`
- `ir`
- `cd`
- `cartao`
- `lucro_bruto`
- `lucro_liquido`
- `valor_minimo`
- `rendimento_proc`
- `rendimento_3040`
- `rendimento_1020`
- `rendimento`
- `lucro_hora`

## Papel de `valor_repasse`

Na leitura do backend, `valor_repasse`:

- permanece persistido no procedimento;
- entra em consultas e ajustes de precificacao relacionados ao modulo;
- nao participa do calculo do dashboard financeiro em `_calcular_financeiro_dashboard`.

## Pendencias restantes

- Nenhuma pendencia funcional direta desta correcao foi observada durante a validacao.
