# Fase 2 - Agenda principal - Subetapa 23 - Validacao manual da extracao de agendaSemanaIsStandaloneRequest e revisao da abertura standalone da agenda semana

## 1. Objetivo
Validar documentalmente a extracao minima de `agendaSemanaIsStandaloneRequest` feita na Subetapa 22, revisando a abertura standalone da `Agenda semana` e confirmando que nao houve regressao direta no fluxo.

## 2. Escopo
Escopo desta subetapa:

- revisar a extracao anterior sem criar novo helper;
- confirmar a ordem de carregamento dos modulos;
- confirmar a ausencia de duplicidade em `frontend/app.js`;
- confirmar que a abertura standalone permaneceu igual;
- documentar arquivos alterados e nao alterados;
- atualizar o roadmap com uma entrada objetiva;
- registrar riscos, validacao tecnica e roteiro manual.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 22
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

Subetapa 20:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade, os pontos de uso e o volume do diff;
- confirmou que nao houve refatoracao acidental fora do helper `agendaLegadoRangeSemana`.

Subetapa 21:
- planejou documentalmente o setimo helper puro;
- escolheu `agendaSemanaIsStandaloneRequest` como o setimo recorte recomendado;
- decidiu que o helper nao deveria entrar no modulo de agenda legado, mas sim em um modulo proprio da agenda semana / navegacao standalone.

Subetapa 22:
- extraiu minimamente `agendaSemanaIsStandaloneRequest` para `frontend/js/modules/agenda-principal-semana-utils.js`;
- alterou `frontend/index.html` apenas para carregar o novo modulo antes de `frontend/app.js`;
- preservou a semantica da querystring `agenda_semana` com aceitos `1`, `true` e `yes`;
- confirmou que `agenda-principal-legado-utils.js` nao foi usado como destino;
- nao alterou helpers de agenda legado.

## 5. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_22_implementacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 6. Criterios usados para avaliacao
Os criterios usados foram:

- preservacao de semantica;
- ausencia de duplicidade em `frontend/app.js`;
- ordem de carregamento correta dos scripts;
- ausencia de alteracao em helpers de agenda legado;
- ausencia de alteracao funcional em navegacao, renderizacao e backend;
- baixo risco de regressao;
- aderencia ao dominio da agenda semana / standalone.

## 7. Revisao tecnica da extracao
Revisao tecnica da Subetapa 22:

- `frontend/js/modules/agenda-principal-semana-utils.js` segue carregado antes de `frontend/app.js`;
- `agendaSemanaIsStandaloneRequest` esta disponivel globalmente para `frontend/app.js` da mesma forma que os demais helpers extraidos;
- `frontend/app.js` nao manteve definicao duplicada do helper;
- os pontos de uso foram preservados;
- o parametro observado continua sendo `agenda_semana`;
- os valores aceitos continuam sendo `1`, `true` e `yes`;
- sem parametro, o retorno continua `false`;
- a abertura standalone nao teve regra alterada.

## 8. Confirmacao da ordem de carregamento
Confirmado:

- `frontend/js/modules/agenda-principal-semana-utils.js` continua carregado antes de `frontend/app.js` em `frontend/index.html`.

## 9. Confirmacao da ausencia de duplicidade em frontend/app.js
Confirmado:

- `frontend/app.js` nao manteve definicao local duplicada de `agendaSemanaIsStandaloneRequest`.

## 10. Confirmacao de que agenda-principal-legado-utils.js nao foi alterado
Confirmado:

- `frontend/js/modules/agenda-principal-legado-utils.js` nao foi alterado nesta etapa.

## 11. Confirmacao de que helpers de agenda legado nao foram alterados
Confirmado:

- `agendaLegadoNumOrNull` nao foi alterado;
- `agendaLegadoFmtHora` nao foi alterado;
- `agendaLegadoFmtDataInput` nao foi alterado;
- `agendaLegadoFmtData` nao foi alterado;
- `agendaLegadoRangeHoje` nao foi alterado;
- `agendaLegadoRangeSemana` nao foi alterado.

## 12. Confirmacao de que agendaSemanaStandaloneModeFromQuery e agendaSemanaBuildStandaloneUrl nao foram alterados
Confirmado:

- `agendaSemanaStandaloneModeFromQuery` nao foi alterado;
- `agendaSemanaBuildStandaloneUrl` nao foi alterado.

## 13. Confirmacao dos pontos de uso preservados
Confirmado:

- os pontos de uso do helper continuam os mesmos;
- a chamada em `frontend/app.js` permanece apontando para o helper global extraido;
- nao houve alteracao de navegacao ou de abertura standalone.

## 14. Confirmacao sobre parametro de querystring observado
Confirmado:

- o parametro observado continua sendo `agenda_semana`.

## 15. Confirmacao sobre valores aceitos
Confirmado:

- `agenda_semana=1` continua aceito;
- `agenda_semana=true` continua aceito;
- `agenda_semana=yes` continua aceito;
- valores inesperados continuam retornando `false`.

## 16. Confirmacao sobre comportamento sem parametro
Confirmado:

- sem o parametro `agenda_semana`, o helper continua retornando `false`.

## 17. Confirmacao de que abertura standalone nao teve regra alterada
Confirmado:

- a abertura standalone da agenda semana nao teve regra alterada nesta etapa;
- houve apenas validacao documental da extracao anterior.

## 18. Arquivos alterados
Arquivos alterados nesta etapa:

- `docs/fase_2_agenda_principal_subetapa_23_validacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`

## 19. Arquivos nao alterados
Arquivos nao alterados nesta etapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissoes

## 20. Riscos tecnicos
Riscos residuais identificados:

- divergencia futura se a querystring `agenda_semana` mudar sem atualizacao do helper;
- quebra na abertura standalone se a ordem de carregamento dos scripts for alterada;
- regressao de navegacao se o helper for reutilizado fora da fronteira prevista.

## 21. Validacao tecnica executada
Validacao tecnica executada nesta etapa:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-semana-utils.js`

## 22. Plano de teste manual para o usuario
Quando houver revisao manual, testar:

1. Abrir a `Agenda principal` normalmente.
2. Entrar na `Agenda semana` pelo fluxo normal.
3. Confirmar que a `Agenda semana` continua abrindo sem erro.
4. Abrir a `Agenda semana` em modo standalone usando a querystring esperada.
5. Testar:
   - `agenda_semana=1`
   - `agenda_semana=true`
   - `agenda_semana=yes`
6. Abrir a mesma rota sem `agenda_semana` e confirmar o comportamento esperado.
7. Confirmar que `Agenda legado` continua abrindo.
8. Confirmar que `Agenda do dia` continua abrindo.
9. Confirmar que `Proximo agendado` continua aparecendo sem erro.
10. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 23. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- extrair novo helper;
- alterar `frontend/js/modules/agenda-principal-legado-utils.js`;
- alterar helpers de agenda legado;
- alterar `agendaSemanaStandaloneModeFromQuery`;
- alterar `agendaSemanaBuildStandaloneUrl`;
- alterar abertura standalone;
- alterar navegacao;
- alterar URL/querystring fora da validacao documental;
- alterar renderizacao;
- alterar filtros;
- alterar tabela/lista;
- alterar modal;
- alterar salvamento;
- alterar edicao;
- alterar exclusao;
- alterar payload;
- alterar recorrencia;
- alterar Google Calendar;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir textos visiveis;
- corrigir mojibake;
- fazer refatoracao ampla.

## 24. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 24 - Planejamento documental do oitavo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 25. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 26. Registro para roadmap
- A Subetapa 23 foi executada apenas como validacao documental da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaIsStandaloneRequest` permanece como a setima extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e o planejamento documental do oitavo helper puro de menor risco.

## 27. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_23_validacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`
