# Fase 2 - Agenda principal - Subetapa 20 - Validacao manual da extracao de agendaLegadoRangeSemana e revisao do impacto visual nos filtros de periodo da agenda legado

## 1. Objetivo
Validar a extracao minima de `agendaLegadoRangeSemana` realizada na Subetapa 19, revisar o impacto visual nos filtros de periodo da `Agenda legado` e confirmar que nao houve refatoracao acidental fora do helper autorizado.

Esta etapa nao autoriza nova extracao, nao altera comportamento e nao modifica a semantica do botao/filtro Semana.

## 2. Escopo
Escopo desta subetapa:

- revisar a extracao anterior;
- conferir o volume do diff da Subetapa 19;
- confirmar a ordem de carregamento e os pontos de uso;
- executar checks de sintaxe novamente;
- registrar validacao manual e riscos residuais;
- atualizar o roadmap apenas com uma entrada objetiva.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 19
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

Subetapa 11:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual no modal.

Subetapa 12:
- planejou documentalmente o quarto helper puro;
- escolheu `agendaLegadoFmtData` como o quarto recorte recomendado.

Subetapa 13:
- extraiu minimamente `agendaLegadoFmtData` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou `new Date(String(valor))`, `toLocaleDateString("pt-BR")` e o fallback para texto original.

Subetapa 14:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual na tabela/lista.

Subetapa 15:
- planejou documentalmente o quinto helper puro;
- escolheu `agendaLegadoRangeHoje` como o quinto recorte recomendado.

Subetapa 16:
- extraiu minimamente `agendaLegadoRangeHoje` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou `new Date()` no momento da chamada;
- preservou o retorno `{ inicio, fim }` com os dois campos iguais para a data corrente;
- preservou a regra do botao/filtro Hoje.

Subetapa 17:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade, os pontos de uso e o volume do diff;
- confirmou que nao houve refatoracao acidental fora do helper `agendaLegadoRangeHoje`.

Subetapa 18:
- planejou documentalmente o sexto helper puro;
- escolheu `agendaLegadoRangeSemana` como o sexto recorte recomendado.

Subetapa 19:
- extraiu minimamente `agendaLegadoRangeSemana` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou `new Date()` no momento da chamada;
- preservou o retorno `{ inicio, fim }` com inicio igual ao dia corrente e fim 6 dias adiante;
- preservou a regra do botao/filtro Semana.

## 5. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_19_implementacao_agenda_legado_range_semana.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/fase_2_agenda_principal_subetapa_3_plano_primeiro_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_4_implementacao_agenda_legado_num_or_null.md`
- `docs/fase_2_agenda_principal_subetapa_5_validacao_agenda_legado_num_or_null.md`
- `docs/fase_2_agenda_principal_subetapa_6_plano_segundo_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_7_implementacao_agenda_legado_fmt_hora.md`
- `docs/fase_2_agenda_principal_subetapa_8_validacao_agenda_legado_fmt_hora.md`
- `docs/fase_2_agenda_principal_subetapa_9_plano_terceiro_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_10_implementacao_agenda_legado_fmt_data_input.md`
- `docs/fase_2_agenda_principal_subetapa_11_validacao_agenda_legado_fmt_data_input.md`
- `docs/fase_2_agenda_principal_subetapa_12_plano_quarto_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_13_implementacao_agenda_legado_fmt_data.md`
- `docs/fase_2_agenda_principal_subetapa_14_validacao_agenda_legado_fmt_data.md`
- `docs/fase_2_agenda_principal_subetapa_15_plano_quinto_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_16_implementacao_agenda_legado_range_hoje.md`
- `docs/fase_2_agenda_principal_subetapa_17_validacao_agenda_legado_range_hoje.md`
- `docs/fase_2_agenda_principal_subetapa_18_plano_sexto_helper_puro.md`

## 6. Criterios usados para avaliacao
Os criterios desta validacao foram:

- conferencia da ordem de carregamento;
- conferencia de duplicidade ou ausencia de duplicidade;
- preservacao dos pontos de uso;
- preservacao da semantica do helper;
- conferencia do volume do diff;
- verificacao de que nao houve refatoracao acidental fora do helper;
- verificacao de que nao houve mudanca em filtros, tabela, lista, modal, payload, salvamento, edicao, exclusao, recorrencia, Google Calendar, backend ou permissao.

## 7. Revisao tecnica da extracao
Confirmacoes tecnicas:

- `frontend/js/modules/agenda-principal-legado-utils.js` segue carregado antes de `frontend/app.js`;
- `agendaLegadoRangeSemana` esta disponivel para `frontend/app.js` da mesma forma que os demais globais extraidos;
- `frontend/app.js` nao manteve definicao duplicada de `agendaLegadoRangeSemana`;
- as chamadas continuam preservadas;
- `new Date()` continua sendo usado no momento da chamada;
- o formato retornado foi preservado;
- `inicio` continua igual ao dia corrente;
- `fim` continua 6 dias adiante;
- o botao/filtro Semana nao teve regra alterada;
- `agendaLegadoRangeHoje` nao foi alterado;
- `agendaLegadoNumOrNull`, `agendaLegadoFmtHora`, `agendaLegadoFmtDataInput` e `agendaLegadoFmtData` nao foram alterados;
- nenhum outro helper foi alterado;
- filtros, botao Semana, botao Hoje, tabela, lista, modal, payload, salvamento, edicao, exclusao, renderizacao, recorrencia, Google Calendar, permissao e backend nao foram alterados alem da extracao.

## 8. Conferencia do volume do diff da Subetapa 19
O diff do commit `bd48784` foi conferido e ficou assim:

- `docs/11_roadmap_desenvolvimento.md`: 17 linhas adicionadas;
- `docs/fase_2_agenda_principal_subetapa_19_implementacao_agenda_legado_range_semana.md`: 390 linhas adicionadas;
- `frontend/app.js`: 7 linhas removidas, somente a definicao local do helper;
- `frontend/js/modules/agenda-principal-legado-utils.js`: 13 linhas adicionadas e 0 removidas no trecho relevante;
- total do commit: 419 insercoes e 8 delecoes em 4 arquivos.

Conclusao da conferencia:

- o volume alto foi causado por documentacao/roadmap e pela extracao autorizada;
- nao foi identificado refatoracao acidental fora de `agendaLegadoRangeSemana`.

## 9. Confirmacao da ordem de carregamento
Confirmacao da ordem de carregamento:

- o modulo `frontend/js/modules/agenda-principal-legado-utils.js` continua sendo carregado antes de `frontend/app.js` em `frontend/index.html`.

## 10. Confirmacao da ausencia de duplicidade em frontend/app.js
Confirmacao de duplicidade:

- nao ha definicao duplicada de `agendaLegadoRangeSemana` em `frontend/app.js`;
- a referencia em `agendaLegado.btnSemana` continua apontando para o helper global.

## 11. Confirmacao de que os helpers anteriores nao foram alterados
Confirmado:

- `agendaLegadoRangeHoje` nao foi alterado;
- `agendaLegadoNumOrNull` nao foi alterado;
- `agendaLegadoFmtHora` nao foi alterado;
- `agendaLegadoFmtDataInput` nao foi alterado;
- `agendaLegadoFmtData` nao foi alterado.

## 12. Confirmacao dos pontos de uso preservados
Os pontos de uso preservados sao:

- o clique do botao Semana continua chamando `agendaLegadoRangeSemana()`;
- o resultado continua preenchendo `agendaLegado.inputInicio.value` e `agendaLegado.inputFim.value`;
- a chamada subsequente a `agendaLegadoCarregar()` continua presente.

## 13. Confirmacao sobre uso de Date/data atual
Confirmado:

- o helper continua baseado em `new Date()` no momento da chamada;
- nao houve introducao de leitura de URL, DOM ou backend para calcular o range;
- a data usada continua sendo a corrente do navegador.

## 14. Confirmacao sobre formato retornado
Confirmado:

- o retorno continua sendo um objeto simples;
- o objeto continua com as chaves `inicio` e `fim`;
- o formato das strings continua ISO `aaaa-mm-dd`.

## 15. Confirmacao sobre inicio/fim do range
Confirmado:

- `inicio` continua igual ao dia corrente;
- `fim` continua 6 dias adiante;
- nao houve ampliacao ou reducao da faixa semanal.

## 16. Confirmacao sobre fim 6 dias adiante
Confirmado:

- a regra de fim 6 dias adiante continua sendo a mesma da implementacao anterior;
- nao houve mudanca nesta regra;
- o helper continua calculando `fim` com `setDate(getDate() + 6)`.

## 17. Confirmacao de que o botao/filtro Semana nao teve regra alterada
Confirmado:

- o botao/filtro Semana continua com a mesma regra de negocio;
- a alteracao foi somente a extracao do helper;
- nao houve alteracao de comportamento.

## 18. Resultado dos checks
Checks executados nesta etapa:

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`: OK

## 19. Roteiro de validacao manual para o usuario
Testar manualmente:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Acionar o botao/filtro de faixa semanal.
4. Conferir se o inicio permanece no dia corrente.
5. Conferir se o fim continua 6 dias adiante.
6. Confirmar que a listagem continua carregando sem erro.
7. Alterar manualmente o periodo e depois voltar para Semana, se essa interacao existir.
8. Confirmar que o comportamento permanece igual ao anterior.
9. Confirmar que `Agenda do dia` continua abrindo.
10. Confirmar que `Agenda da semana` continua abrindo.
11. Confirmar que `Proximo agendado` continua aparecendo sem erro.
12. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 20. Riscos residuais
Riscos residuais:

- divergencia futura se o helper `agendaLegadoRangeSemana` deixar de manter a equivalencia exata;
- regressao visual ou de filtro se a ordem de carregamento dos scripts mudar em etapas futuras;
- alteracao indevida se a proxima extracao tocar mais do que o helper escolhido.

## 21. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- nova extracao;
- novo helper;
- novo modulo;
- alteracao de `frontend/index.html`;
- alteracao de `agendaLegadoNumOrNull`, `agendaLegadoFmtHora`, `agendaLegadoFmtDataInput`, `agendaLegadoFmtData` e `agendaLegadoRangeHoje`;
- alteracao de filtros, botao Semana, botao Hoje, tabela, lista, modal, payload, salvamento, edicao, exclusao, renderizacao, recorrencia, Google Calendar, backend, banco, schema, migrations, seeds, endpoints ou permissoes;
- correcao textual;
- correcao de mojibake;
- refatoracao ampla.

## 22. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 21 - Planejamento documental do setimo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 23. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 24. Registro para roadmap
- A Subetapa 20 foi concluida como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeSemana` permanece como a sexta extracao minima.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do setimo helper puro de menor risco.

## 25. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_20_validacao_agenda_legado_range_semana.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
