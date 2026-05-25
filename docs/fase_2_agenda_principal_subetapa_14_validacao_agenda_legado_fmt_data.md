# Fase 2 - Agenda principal - Subetapa 14 - Validacao manual da extracao de agendaLegadoFmtData e revisao do impacto visual na tabela da agenda legado

## 1. Objetivo
Registrar a validacao tecnica da quarta extracao minima feita na Subetapa 13, confirmando que `agendaLegadoFmtData` segue disponivel para `frontend/app.js`, que a ordem de carregamento continua correta e que nao houve regressao direta observavel na exibicao da tabela/lista da agenda legado.

## 2. Escopo
Esta etapa e documental, com verificacao tecnica e revisao de impacto visual do helper ja extraido.

Nao ha nova extracao.
Nao ha novo helper.
Nao ha novo patch funcional.
Nao ha alteracao de comportamento, salvo eventual correcao minima de regressao direta, que nao foi necessaria nesta revisao.

## 3. Confirmacao de que Agenda principal e core / comum
`Agenda principal` continua tratada como `core / comum`, sem classificacao por area profissional, sem multiarea e sem flags de segregacao.

## 4. Resumo das Subetapas 1 a 13
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

## 5. Revisao tecnica da extracao
A revisao desta subetapa confirma que:
- o helper `agendaLegadoFmtData` permanece disponivel para `frontend/app.js` via o modulo carregado antes dele;
- `frontend/app.js` nao manteve definicao local duplicada do helper;
- `agendaLegadoNumOrNull` permanece inalterado;
- `agendaLegadoFmtHora` permanece inalterado;
- `agendaLegadoFmtDataInput` permanece inalterado;
- os pontos de uso continuam os mesmos;
- a semantica continua consistente com a implementacao anterior;
- nao houve impacto em salvamento, edicao, exclusao, modal, renderizacao, lista, tabela, payload, recorrencia, Google Calendar, permissoes ou backend.

## 6. Confirmacao da ordem de carregamento em frontend/index.html
O carregamento segue com o modulo `frontend/js/modules/agenda-principal-legado-utils.js` antes de `frontend/app.js`, mantendo o padrao necessario para disponibilidade global do helper.

## 7. Confirmacao da ausencia de duplicidade em frontend/app.js
Nao existe definicao duplicada de `agendaLegadoFmtData` em `frontend/app.js`; o arquivo apenas consome o helper exposto pelo modulo.

## 8. Confirmacao de que agendaLegadoNumOrNull nao foi alterado
Confirmado:
- `agendaLegadoNumOrNull` continua com a mesma implementacao;
- o helper de numero nao sofreu qualquer alteracao nesta etapa;
- a quarta extracao nao afetou a primeira extracao minima.

## 9. Confirmacao de que agendaLegadoFmtHora nao foi alterado
Confirmado:
- `agendaLegadoFmtHora` continua com a mesma implementacao;
- o helper de hora nao sofreu qualquer alteracao nesta etapa;
- a quarta extracao nao afetou a segunda extracao minima.

## 10. Confirmacao de que agendaLegadoFmtDataInput nao foi alterado
Confirmado:
- `agendaLegadoFmtDataInput` continua com a mesma implementacao;
- o helper de data input nao sofreu qualquer alteracao nesta etapa;
- a quarta extracao nao afetou a terceira extracao minima.

## 11. Confirmacao dos pontos de uso preservados
Os pontos de uso continuam preservados na tabela/lista da agenda legado, sem alteracao de regra ou de fluxo.

## 12. Confirmacao sobre formato visual de data
Confirmado:
- o formato visual da tabela/lista continua sendo o mesmo padrao usado antes da extracao;
- a exibicao na agenda legado continua dependente desse mesmo formato.

## 13. Confirmacao sobre toLocaleDateString("pt-BR")
Confirmado:
- a funcao continua usando `toLocaleDateString("pt-BR")`;
- nao houve mudanca de locale.

## 14. Confirmacao sobre new Date(String(valor))
Confirmado:
- a funcao continua usando `new Date(String(valor))`;
- a saida visual continua seguindo esse mesmo comportamento.

## 15. Confirmacao sobre tratamento de null/undefined/vazio
Confirmado:
- `null`, `undefined` e string vazia continuam retornando string vazia;
- nao houve mudanca nesse comportamento.

## 16. Confirmacao sobre fallback/texto original para data invalida
Confirmado:
- quando a data nao e valida, o helper continua retornando o texto original;
- esse fallback permanece inalterado.

## 17. Resultado dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`: OK

## 18. Roteiro de validacao manual para o usuario
Antes de prosseguir, o usuario deve testar:
1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Verificar a listagem/tabela de agendamentos com datas exibidas.
4. Confirmar que as datas aparecem no mesmo formato visual de antes.
5. Abrir um agendamento existente.
6. Confirmar que a data relacionada ao agendamento segue coerente com a listagem.
7. Criar um novo agendamento com data definida.
8. Salvar.
9. Verificar a data exibida na tabela/lista apos salvar.
10. Editar o agendamento criado.
11. Salvar novamente.
12. Confirmar que a data exibida na tabela/lista permanece correta.
13. Confirmar que `Agenda do dia` continua abrindo.
14. Confirmar que `Agenda da semana` continua abrindo.
15. Confirmar que `Próximo agendado` continua aparecendo sem erro.
16. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 19. Riscos residuais
- Divergencia futura na exibicao de data se a semantica atual nao for preservada em novas alteracoes.
- Regressao visual pontual na tabela/lista caso o helper seja reutilizado de forma incorreta.
- Possivel quebra de compatibilidade se a ordem de carregamento dos modulos for alterada em etapas futuras.

## 20. Itens explicitamente fora do escopo
- Nova extracao de helper.
- Alteracao de `agendaLegadoNumOrNull`.
- Alteracao de `agendaLegadoFmtHora`.
- Alteracao de `agendaLegadoFmtDataInput`.
- Alteracao de salvamento, edicao, exclusao, modal, renderizacao, lista, tabela, payload, recorrencia ou Google Calendar.
- Alteracao de backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Reabertura da `Agenda de contatos`.
- Correcao de textos visiveis ou de mojibake.

## 21. Proxima subetapa recomendada
`Agenda principal - Subetapa 15 - Planejamento documental do quinto helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 22. Blindagem textual/mojibake
Esta etapa respeita integralmente a blindagem textual/mojibake.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 23. Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A Subetapa 14 foi executada como validacao e revisao de impacto visual na tabela/lista.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaLegadoFmtData` permanece como a quarta extracao minima.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e o planejamento documental do quinto helper puro de menor risco.

## 24. Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `docs/fase_2_agenda_principal_subetapa_14_validacao_agenda_legado_fmt_data.md`
- `docs/11_roadmap_desenvolvimento.md`

