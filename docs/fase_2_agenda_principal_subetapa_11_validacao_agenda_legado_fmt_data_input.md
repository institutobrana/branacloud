# Fase 2 - Agenda principal - Subetapa 11 - Validacao manual da extracao de agendaLegadoFmtDataInput e revisao do impacto visual no modal de agenda legado

## 1. Objetivo
Registrar a validacao tecnica da terceira extracao minima feita na Subetapa 10, confirmando que `agendaLegadoFmtDataInput` segue disponivel para `frontend/app.js`, que a ordem de carregamento continua correta e que nao houve regressao direta observavel na abertura e no preenchimento do modal da agenda legado.

## 2. Escopo
Esta etapa e documental, com verificacao tecnica e revisao de impacto visual do helper ja extraido.

Nao ha nova extracao.
Nao ha novo helper.
Nao ha novo patch funcional.
Nao ha alteracao de comportamento, salvo eventual correcao minima de regressao direta, que nao foi necessaria nesta revisao.

## 3. Confirmacao de que Agenda principal e core / comum
`Agenda principal` continua tratada como `core / comum`, sem classificacao por area profissional, sem multiarea e sem flags de segregacao.

## 4. Resumo das Subetapas 1 a 10
Subetapa 1:
- definiu o contrato funcional inicial e as fronteiras documentais da frente.

Subetapa 2:
- mapeou os fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteira com agenda legado.

Subetapa 3:
- avaliou os candidatos a helper puro e escolheu `agendaLegadoNumOrNull` como primeiro recorte.

Subetapa 4:
- extraiu minimamente `agendaLegadoNumOrNull` para `frontend/js/modules/agenda-principal-legado-utils.js`.

Subetapa 5:
- validou a extracao anterior;
- confirmou a ordem de carregamento e a ausencia de duplicidade.

Subetapa 6:
- planejou documentalmente o segundo helper puro;
- escolheu `agendaLegadoFmtHora` como o segundo recorte recomendado.

Subetapa 7:
- extraiu minimamente `agendaLegadoFmtHora` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou `parseInt(ms || 0, 10)`, `padStart(2, "0")` e o formato `HH:MM`.

Subetapa 8:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual.

Subetapa 9:
- planejou documentalmente o terceiro helper puro;
- escolheu `agendaLegadoFmtDataInput` como o terceiro recorte recomendado.

Subetapa 10:
- extraiu minimamente `agendaLegadoFmtDataInput` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou `String(valor).trim()`, regex, `split("-")`, `split("/")` e `new Date(txt)` na rota generica.

## 5. Revisao tecnica da extracao
A revisao desta subetapa confirma que:
- o helper `agendaLegadoFmtDataInput` permanece disponivel para `frontend/app.js` via o modulo carregado antes dele;
- `frontend/app.js` nao manteve definicao local duplicada do helper;
- `agendaLegadoNumOrNull` permanece inalterado;
- `agendaLegadoFmtHora` permanece inalterado;
- os pontos de uso continuam os mesmos;
- a semantica continua consistente com a implementacao anterior;
- nao houve impacto em salvamento, edicao, exclusao, modal, renderizacao, lista, payload, recorrencia, Google Calendar, permissoes ou backend.

## 6. Confirmacao da ordem de carregamento em frontend/index.html
O carregamento segue com o modulo `frontend/js/modules/agenda-principal-legado-utils.js` antes de `frontend/app.js`, mantendo o padrao necessario para disponibilidade global do helper.

## 7. Confirmacao da ausencia de duplicidade em frontend/app.js
Nao existe definicao duplicada de `agendaLegadoFmtDataInput` em `frontend/app.js`; o arquivo apenas consome o helper exposto pelo modulo.

## 8. Confirmacao de que agendaLegadoNumOrNull nao foi alterado
Confirmado:
- `agendaLegadoNumOrNull` continua com a mesma implementacao;
- o helper de numero nao sofreu qualquer alteracao nesta etapa;
- a terceira extracao nao afetou a primeira extracao minima.

## 9. Confirmacao de que agendaLegadoFmtHora nao foi alterado
Confirmado:
- `agendaLegadoFmtHora` continua com a mesma implementacao;
- o helper de hora nao sofreu qualquer alteracao nesta etapa;
- a terceira extracao nao afetou a segunda extracao minima.

## 10. Confirmacao dos pontos de uso preservados
Os pontos de uso continuam preservados na abertura do modal, no preenchimento do campo de data e na abertura de novo agendamento, sem alteracao de regra ou de fluxo.

## 11. Confirmacao sobre formatos de entrada aceitos
Confirmado:
- `dd/mm/aaaa` continua aceito;
- `aaaa-mm-dd` continua aceito;
- textos genericos reconhecidos por `Date(txt)` continuam aceitos.

## 12. Confirmacao sobre formato final dd/mm/aaaa
Confirmado:
- o formato final continua sendo `dd/mm/aaaa`;
- esse valor continua sendo usado para preencher o campo de data do modal.

## 13. Confirmacao sobre tratamento de null/undefined/vazio
Confirmado:
- `null`, `undefined` e string vazia continuam retornando string vazia;
- nao houve mudanca nesse comportamento.

## 14. Confirmacao sobre uso de Date e manipulacao de string
Confirmado:
- a funcao continua usando manipulacao de string via `String(valor).trim()`, regex e `split("-")` / `split("/")`;
- a funcao continua usando `new Date(txt)` para a rota generica;
- a conversao final continua usando `padStart` para dia e mes quando a data generica e valida.

## 15. Resultado dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`: OK

## 16. Roteiro de validacao manual para o usuario
Antes de prosseguir, o usuario deve testar:
1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Abrir um agendamento existente.
4. Conferir o campo de data no modal.
5. Confirmar que a data aparece no mesmo formato visual de antes.
6. Abrir um novo agendamento.
7. Conferir o preenchimento inicial do campo de data.
8. Criar um novo agendamento com data definida.
9. Salvar.
10. Editar o agendamento criado.
11. Confirmar que a data permanece no formato esperado.
12. Salvar novamente.
13. Confirmar que a tabela/listagem da agenda legado continua intacta.
14. Confirmar que `Agenda do dia` continua abrindo.
15. Confirmar que `Agenda da semana` continua abrindo.
16. Confirmar que `Proximo agendado` continua aparecendo sem erro.
17. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 17. Riscos residuais
- Divergencia futura no preenchimento do campo de data se a semantica atual nao for preservada em novas alteracoes.
- Regressao visual pontual no modal ou na abertura de novo agendamento caso o helper seja reutilizado de forma incorreta.
- Possivel quebra de compatibilidade se a ordem de carregamento dos modulos for alterada em etapas futuras.

## 18. Itens explicitamente fora do escopo
- Nova extracao de helper.
- Alteracao de `agendaLegadoNumOrNull`.
- Alteracao de `agendaLegadoFmtHora`.
- Alteracao de salvamento, edicao, exclusao, modal, renderizacao, lista, payload, recorrencia ou Google Calendar.
- Alteracao de backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Reabertura da `Agenda de contatos`.
- Correcao de textos visiveis ou de mojibake.

## 19. Proxima subetapa recomendada
`Agenda principal - Subetapa 12 - Planejamento documental do quarto helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 20. Blindagem textual/mojibake
Esta etapa respeita integralmente a blindagem textual/mojibake.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 21. Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A Subetapa 11 foi executada como validacao e revisao de impacto visual no modal.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtDataInput` permanece como a terceira extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e o planejamento documental do quarto helper puro de menor risco.

## 22. Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `docs/fase_2_agenda_principal_subetapa_11_validacao_agenda_legado_fmt_data_input.md`
- `docs/11_roadmap_desenvolvimento.md`

