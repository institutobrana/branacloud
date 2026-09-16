# Matriz de Divergencias da Tela Principal

## Status geral atual

- contratos da Fase 1: fechados;
- auditorias realizadas: A01 a A10 iniciadas;
- blocos com leitura boa: procedimentos registrados, avisos e paineis auxiliares;
- blocos parciais: cabeçalho, odontograma, tratamentos, contexto, agenda, historico, imagens, documentos.

## Classificacao por bloco

| Bloco | Status | Tipo de divergencia | Observacao resumida |
|---|---|---|---|
| A01 Cabecalho do paciente | Parcial | Sincronia de cabecalho | Nome e estado aparecem, mas o codigo nao fechou de forma confiavel na inspeção automatizada |
| A02 Odontograma | Parcial | Sincronia funcional | O tratamento carrega, mas o contexto lateral nao acompanha o mesmo estado |
| A03 Tratamentos por data | Parcial | Sincronia de selecao | A lista existe e o item piloto aparece, mas o resumo lateral nao acompanha a selecao |
| A04 Contexto clinico | Parcial | Sincronia lateral | Os cards laterais permanecem no vazio padrao durante o caso piloto |
| A05 Agenda | Parcial | Origem de dados nao confirmada | O bloco fica vazio e ainda falta confirmar se o vazio e legitimo |
| A06 Procedimentos registrados | Concluido | Sem divergencia critica observada | A lista de procedimentos do piloto apareceu coerente |
| A07 Historico clinico | Parcial | Preenchimento ausente | O container nao apareceu populado na leitura automatizada |
| A08 Imagens | Parcial | Fonte nao confirmada | Mostra estado vazio coerente, mas sem validacao da fonte |
| A09 Documentos | Parcial | Fonte nao confirmada | Mostra estado vazio coerente, mas sem validacao da fonte |
| A10 Avisos e paineis auxiliares | Concluido | Sem divergencia critica observada | Os paineis existem e nao bloquearam o fluxo clinico |

## Leitura executiva

O problema dominante nao e mais a existencia da tela:

- a tela sobe;
- o odontograma carrega;
- os procedimentos do piloto aparecem;
- os auxiliares nao bloqueiam.

O que continua impedindo a equivalencia visual/funcional completa e a sincronizacao entre:

- paciente em uso;
- tratamento selecionado;
- contexto lateral;
- historico clinico.

## Proxima acao recomendada

Auditar o fluxo de propagacao do paciente e do tratamento entre:

- `frontend/js/modules/prontuario.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/js/modules/odontograma-v1.js`
- wrappers de `fichaAplicarPaciente` em `frontend/app.js`
