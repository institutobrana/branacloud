# Fase 2 - Agenda principal - Subetapa 17 - Validacao manual da extracao de agendaLegadoRangeHoje e revisao do impacto visual nos filtros de periodo da agenda legado

## 1. Objetivo
Validar a extracao minima de `agendaLegadoRangeHoje` realizada na Subetapa 16, revisar o impacto visual nos filtros de periodo da `Agenda legado` e confirmar que nao houve refatoracao acidental fora do helper autorizado.

Esta etapa nao autoriza nova extracao, nao altera comportamento e nao modifica a semantica do botao/filtro Hoje.

## 2. Escopo
Escopo desta subetapa:

- revisar a extraicao anterior;
- conferir o volume do diff da Subetapa 16;
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

## 4. Resumo das Subetapas 1 a 16
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

## 5. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_16_implementacao_agenda_legado_range_hoje.md`
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
- `agendaLegadoRangeHoje` esta disponivel para `frontend/app.js` da mesma forma que os demais globais extraidos;
- `frontend/app.js` nao manteve definicao duplicada de `agendaLegadoRangeHoje`;
- as chamadas continuam preservadas;
- `new Date()` continua sendo usado no momento da chamada;
- o formato retornado foi preservado;
- `inicio` e `fim` continuam iguais para a data corrente;
- o botao/filtro Hoje nao teve regra alterada;
- `agendaLegadoNumOrNull`, `agendaLegadoFmtHora`, `agendaLegadoFmtDataInput` e `agendaLegadoFmtData` nao foram alterados;
- nenhum outro helper foi alterado;
- filtros, botao Hoje, tabela, lista, modal, payload, salvamento, edicao, exclusao, renderizacao, recorrencia, Google Calendar, permissao e backend nao foram alterados alem da extracao.

## 8. Conferencia do volume do diff da Subetapa 16
O diff do commit `6f7c50b` foi conferido e ficou assim:

- `docs/11_roadmap_desenvolvimento.md`: 16 linhas adicionadas;
- `docs/fase_2_agenda_principal_subetapa_16_implementacao_agenda_legado_range_hoje.md`: 365 linhas adicionadas;
- `frontend/app.js`: 6 linhas removidas;
- `frontend/js/modules/agenda-principal-legado-utils.js`: 11 linhas adicionadas e 0 removidas no trecho relevante;
- total do commit: 391 insercoes e 6 delecoes em 4 arquivos.

Conclusao da conferencia:

- o volume alto foi causado por documentacao/roadmap e pela extracao autorizada;
- nao foi identificado refatoracao acidental fora de `agendaLegadoRangeHoje`.

## 9. Confirmacao da ordem de carregamento
Confirmacao da ordem de carregamento:

- o modulo `frontend/js/modules/agenda-principal-legado-utils.js` continua sendo carregado antes de `frontend/app.js` em `frontend/index.html`.

## 10. Confirmacao da ausencia de duplicidade em frontend/app.js
Confirmacao de duplicidade:

- nao ha definicao duplicada de `agendaLegadoRangeHoje` em `frontend/app.js`;
- a referencia em `agendaLegado.btnHoje` continua apontando para o helper global.

## 11. Confirmacao de que os helpers anteriores nao foram alterados
Confirmado:

- `agendaLegadoNumOrNull` nao foi alterado;
- `agendaLegadoFmtHora` nao foi alterado;
- `agendaLegadoFmtDataInput` nao foi alterado;
- `agendaLegadoFmtData` nao foi alterado.

## 12. Confirmacao dos pontos de uso preservados
Os pontos de uso preservados sao:

- o clique do botao Hoje continua chamando `agendaLegadoRangeHoje()`;
- o retorno continua preenchendo `agendaLegado.inputInicio.value` e `agendaLegado.inputFim.value`;
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
- o formato das strings continua `aaaa-mm-dd`.

## 15. Confirmacao sobre inicio/fim do range
Confirmado:

- `inicio` continua igual ao dia corrente;
- `fim` continua igual ao dia corrente;
- nao houve ampliacao de faixa.

## 16. Confirmacao de que o botao/filtro Hoje nao teve regra alterada
Confirmado:

- o botao/filtro Hoje continua com a mesma regra de negocio;
- a alteracao foi somente a extracao do helper;
- nao houve alteracao de comportamento.

## 17. Resultado dos checks
Checks executados nesta etapa:

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`: OK

## 18. Roteiro de validacao manual para o usuario
Testar manualmente:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Acionar o botao/filtro Hoje.
4. Conferir se os campos de inicio e fim continuam iguais para a data corrente.
5. Confirmar que a listagem continua carregando sem erro.
6. Alterar manualmente o periodo e depois voltar para Hoje, se essa interacao existir.
7. Confirmar que o comportamento permanece igual ao anterior.
8. Confirmar que `Agenda do dia` continua abrindo.
9. Confirmar que `Agenda da semana` continua abrindo.
10. Confirmar que `Proximo agendado` continua aparecendo sem erro.
11. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 19. Riscos residuais
Riscos residuais:

- divergencia futura caso o helper seja alterado sem manter a equivalencia exata;
- regressao visual ou de filtro se o range deixar de ser “hoje para hoje”;
- quebra de compatibilidade se a ordem de carregamento dos scripts mudar no futuro.

## 20. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- nova extracao;
- novo helper;
- novo modulo;
- alteracao de `frontend/index.html`;
- alteracao de `agendaLegadoNumOrNull`, `agendaLegadoFmtHora`, `agendaLegadoFmtDataInput` e `agendaLegadoFmtData`;
- alteracao de filtros, botao Hoje, tabela, lista, modal, payload, salvamento, edicao, exclusao, renderizacao, recorrencia, Google Calendar, backend, banco, schema, migrations, seeds, endpoints ou permissoes;
- correcao textual;
- correcao de mojibake;
- refatoracao ampla.

## 21. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 18 - Planejamento documental do sexto helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 22. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 23. Registro para roadmap
- A Subetapa 17 foi concluida como validacao e revisao de impacto dos filtros de periodo.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoRangeHoje` permanece como a quinta extracao minima.
- O volume do diff da Subetapa 16 foi conferido e isolado em documentacao/roadmap e na extracao autorizada.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do sexto helper puro de menor risco.

## 24. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_17_validacao_agenda_legado_range_hoje.md`
- `docs/11_roadmap_desenvolvimento.md`
