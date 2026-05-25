# Fase 2 - Agenda principal - Subetapa 26 - Validacao manual da extracao de agendaSemanaStandaloneModeFromQuery e revisao do modo standalone da agenda semana

## 1. Objetivo
Validar documentalmente a extracao minima de `agendaSemanaStandaloneModeFromQuery` feita na Subetapa 25, revisando o modo standalone da `Agenda semana` e confirmando que nao houve regressao direta no fluxo.

## 2. Escopo
Escopo desta subetapa:

- revisar a extracao anterior sem criar novo helper;
- confirmar a ordem de carregamento dos modulos;
- confirmar a ausencia de duplicidade em `frontend/app.js`;
- confirmar que o fallback/padrao continua `semana`;
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

## 4. Resumo das Subetapas 1 a 25
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

Subetapa 23:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e os pontos de uso;
- confirmou o parametro `agenda_semana`, os valores aceitos e o retorno `false` sem parametro;
- registrou que o usuario validou o fluxo normal da agenda principal e, posteriormente, informou que conseguiu testar o modo URL/standalone e que a agenda abriu corretamente;
- nao alterou helpers de agenda legado nem a regra de abertura standalone.

Subetapa 24:
- planejou documentalmente o oitavo helper puro;
- escolheu `agendaSemanaStandaloneModeFromQuery` como o oitavo recorte recomendado;
- definiu o modulo correto como `frontend/js/modules/agenda-principal-semana-utils.js`;
- registrou os riscos da leitura de `agenda_modo` na URL;
- apontou a limitacao do teste manual standalone anterior, depois superada pelo usuario com a validacao URL/standalone.

Subetapa 25:
- extraiu minimamente `agendaSemanaStandaloneModeFromQuery` para `frontend/js/modules/agenda-principal-semana-utils.js`;
- preservou `new URLSearchParams(window.location.search || "")`;
- preservou o parametro `agenda_modo`;
- preservou o fallback `semana`;
- preservou os valores especiais `dia` e `clinica`.

## 5. Observacao sobre a validacao manual da Subetapa 23
O usuario validou o fluxo normal da `Agenda principal` e, posteriormente, informou que conseguiu testar o modo URL/standalone e que a agenda abriu corretamente.

Essa validacao posterior e relevante porque confirma que a fronteira standalone continua funcionando apos a extracao do helper de leitura do modo.

## 6. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_25_implementacao_agenda_semana_standalone_mode_from_query.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 7. Criterios usados para avaliacao
Os criterios usados foram:

- preservacao de semantica;
- ausencia de duplicidade em `frontend/app.js`;
- ordem de carregamento correta dos scripts;
- ausencia de alteracao em helpers de agenda legado;
- ausencia de alteracao funcional em navegacao, renderizacao e backend;
- baixo risco de regressao;
- aderencia ao dominio da agenda semana / standalone.

## 8. Revisao tecnica da extracao
Revisao tecnica da Subetapa 25:

- `frontend/js/modules/agenda-principal-semana-utils.js` segue carregado antes de `frontend/app.js`;
- `agendaSemanaStandaloneModeFromQuery` esta disponivel globalmente para `frontend/app.js` da mesma forma que os demais helpers extraidos;
- `frontend/app.js` nao manteve definicao local duplicada do helper;
- os pontos de uso foram preservados;
- o parametro observado continua sendo `agenda_modo`;
- `agenda_modo=dia` continua aceito;
- `agenda_modo=clinica` continua aceito;
- sem `agenda_modo`, o retorno continua caindo no padrao;
- o fallback/padrao continua `semana`;
- a abertura standalone nao teve regra alterada.

## 9. Confirmacao da ordem de carregamento
Confirmado:

- `frontend/js/modules/agenda-principal-semana-utils.js` continua carregado antes de `frontend/app.js` em `frontend/index.html`.

## 10. Confirmacao da ausencia de duplicidade em frontend/app.js
Confirmado:

- `frontend/app.js` nao manteve definicao local duplicada de `agendaSemanaStandaloneModeFromQuery`.

## 11. Confirmacao de que agenda-principal-legado-utils.js nao foi alterado
Confirmado:

- `frontend/js/modules/agenda-principal-legado-utils.js` nao foi alterado nesta etapa.

## 12. Confirmacao de que helpers de agenda legado nao foram alterados
Confirmado:

- `agendaLegadoNumOrNull` nao foi alterado;
- `agendaLegadoFmtHora` nao foi alterado;
- `agendaLegadoFmtDataInput` nao foi alterado;
- `agendaLegadoFmtData` nao foi alterado;
- `agendaLegadoRangeHoje` nao foi alterado;
- `agendaLegadoRangeSemana` nao foi alterado.

## 13. Confirmacao de que agendaSemanaIsStandaloneRequest e agendaSemanaBuildStandaloneUrl nao foram alterados
Confirmado:

- `agendaSemanaIsStandaloneRequest` nao foi alterado;
- `agendaSemanaBuildStandaloneUrl` nao foi alterado.

## 14. Confirmacao dos pontos de uso preservados
Confirmado:

- os pontos de uso do helper continuam os mesmos;
- a chamada em `frontend/app.js` permanece apontando para o helper global extraido;
- nao houve alteracao de navegacao ou de abertura standalone.

## 15. Confirmacao sobre parametro de querystring observado
Confirmado:

- o parametro observado continua sendo `agenda_modo`.

## 16. Confirmacao sobre valores aceitos
Confirmado:

- `agenda_modo=dia` continua aceito;
- `agenda_modo=clinica` continua aceito;
- valores inesperados continuam caindo no padrao `semana`.

## 17. Confirmacao sobre comportamento sem parametro
Confirmado:

- sem o parametro `agenda_modo`, o helper continua retornando o padrao da tela;
- na pratica, continua caindo em `semana`.

## 18. Confirmacao sobre fallback/padrao semana
Confirmado:

- o fallback/padrao continua `semana`.

## 19. Confirmacao de que abertura standalone nao teve regra alterada
Confirmado:

- a abertura standalone da agenda semana nao teve regra alterada nesta etapa;
- houve apenas validacao documental da extracao anterior.

## 20. Arquivos alterados
Arquivos alterados nesta etapa:

- `docs/fase_2_agenda_principal_subetapa_26_validacao_agenda_semana_standalone_mode_from_query.md`
- `docs/11_roadmap_desenvolvimento.md`

## 21. Arquivos nao alterados
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

## 22. Riscos tecnicos
Riscos residuais identificados:

- divergencia futura se a querystring `agenda_modo` mudar sem atualizacao do helper;
- quebra na abertura standalone se a ordem de carregamento dos scripts for alterada;
- regressao de navegacao se o helper for reutilizado fora da fronteira prevista.

## 23. Validacao tecnica executada
Validacao tecnica executada nesta etapa:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-semana-utils.js`

## 24. Plano de teste manual para o usuario
Quando houver revisao manual, testar:

1. Abrir a `Agenda principal` normalmente.
2. Entrar na `Agenda semana` pelo fluxo normal.
3. Confirmar que a `Agenda semana` continua abrindo sem erro.
4. Abrir a `Agenda semana` em modo standalone pela URL já testada pelo usuário.
5. Testar:
   - `agenda_modo=dia`
   - `agenda_modo=clinica`
   - sem `agenda_modo`, confirmando que o padrão continua `semana`
6. Confirmar que `Agenda legado` continua abrindo.
7. Confirmar que `Agenda do dia` continua abrindo.
8. Confirmar que `Proximo agendado` continua aparecendo sem erro.
9. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 25. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- extrair novo helper;
- alterar `frontend/js/modules/agenda-principal-legado-utils.js`;
- alterar helpers de agenda legado;
- alterar `agendaSemanaIsStandaloneRequest`;
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

## 26. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 27 - Planejamento documental do nono helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 27. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 28. Registro para roadmap
- A Subetapa 26 foi executada apenas como validacao documental do modo standalone da agenda semana.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- O helper `agendaSemanaStandaloneModeFromQuery` permanece como a oitava extracao minima.
- `frontend/js/modules/agenda-principal-semana-utils.js` e `frontend/js/modules/agenda-principal-legado-utils.js` nao foram alterados nesta etapa.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O usuario informou que ja conseguiu testar modo URL/standalone.
- O proximo passo recomendado e o planejamento documental do nono helper puro de menor risco.

## 29. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_26_validacao_agenda_semana_standalone_mode_from_query.md`
- `docs/11_roadmap_desenvolvimento.md`
