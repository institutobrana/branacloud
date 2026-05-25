# Fase 2 - Agenda principal - Subetapa 18 - Planejamento documental do sexto helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um sexto recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um sexto candidato;
- registrar se a futura extracao cabe no modulo ja criado ou se exigiria novo modulo;
- registrar o que nao deve entrar na futura extracao;
- atualizar o roadmap apenas com registro objetivo.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 17
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

## 5. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/`
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
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 6. Criterios usados para avaliacao
Os candidatos foram avaliados por:

- pureza funcional;
- dependencia de DOM;
- dependencia de estado global;
- dependencia de backend;
- dependencia de tenant/clinica_id;
- dependencia de permissoes;
- ausencia de escrita;
- ausencia de alteracao visual ampla;
- previsibilidade de impacto;
- baixo risco de regressao;
- facilidade de teste manual apos futura implementacao;
- compatibilidade com o modulo `agenda-principal-legado-utils.js`;
- tamanho da superficie afetada.

## 7. Mapa comparativo dos candidatos restantes

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Dependencia visual no modal/lista/tabela/filtros? | Risco de regressao | Teste manual futuro | Adequado ao modulo atual? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11026` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta abertura | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11035` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta modo exibido | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11043` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Parcial | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, conferindo URL gerada | Nao, tende a ficar com fluxo de navegacao | Nao |
| `agendaLegadoRangeSemana` | `frontend/app.js:8897` | Montar faixa semanal da agenda legado | data atual | `{inicio, fim}` | Parcial, temporal | Nao | Sim, tempo atual | Nao | Nao | Sim | Nao | Sim, afeta filtros de periodo | Baixo | Sim, clicando botao Semana | Sim, cabe no modulo atual | **Sim, candidato recomendado** |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | Sim, cabe no modulo atual | Nao como sexto recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8514` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao como sexto recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:8994` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao como sexto recorte |

## 8. Candidato recomendado para sexta implementacao futura
Candidato recomendado:

- `agendaLegadoRangeSemana`

## 9. Justificativa da escolha
A escolha de `agendaLegadoRangeSemana` e a mais equilibrada para o sexto recorte porque:

- e um helper puro e pequeno;
- nao depende de DOM;
- nao depende de backend;
- nao depende de tenant/clinica_id;
- nao depende de permissao;
- nao produz escrita de payload;
- nao altera navegacao standalone nem URL;
- o impacto e limitado aos filtros de periodo da agenda legado;
- cabe naturalmente no modulo ja criado `frontend/js/modules/agenda-principal-legado-utils.js`;
- evita os helpers com maior risco de payload, input de hora ou querystring;
- continua sendo mais facil de testar manualmente do que os helpers restantes.

Comparacao resumida:
- os helpers `agendaSemana*` dependem de URL/querystring e navegacao, entao continuam mais ligados ao fluxo de standalone do que ao núcleo simples da agenda legado;
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, aumentando o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaLegadoRangeSemana` permanece o menor recorte util restante com impacto restrito a um intervalo temporal previsivel.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a montagem da faixa semanal para os filtros da agenda legado;
- manter o comportamento atual:
  - criar `new Date()` no momento da chamada;
  - criar `inicio` como a data corrente;
  - criar `fim` como a data corrente acrescida de 6 dias;
  - retornar o mesmo objeto `{ inicio, fim }` com as strings ISO.

Fronteira funcional:
- apenas montagem de faixa de periodo;
- sem DOM;
- sem leitura de URL;
- sem integracao com backend;
- sem selecao de tela;
- sem modal;
- sem evento;
- sem alteracao de renderizacao estrutural.

## 11. Se o helper deve entrar no modulo ja criado ou exigir novo modulo
O helper deve entrar no modulo ja criado:

- `frontend/js/modules/agenda-principal-legado-utils.js`

Motivo:
- o modulo ja concentra utilitarios puros da agenda legado;
- a nova funcao compartilha o mesmo dominio funcional;
- nao ha justificativa documental para criar outro modulo nesta etapa.

## 12. O que NAO deve entrar na futura extracao
Nao devem entrar na futura extracao:

- `agendaSemanaIsStandaloneRequest`;
- `agendaSemanaStandaloneModeFromQuery`;
- `agendaSemanaBuildStandaloneUrl`;
- `agendaLegadoParseDataInput`;
- `agendaLegadoCoerceHoraTexto`;
- `agendaLegadoNormalizarHexCor`;
- qualquer leitura de DOM;
- qualquer `requestJson`;
- qualquer ajuste de modal;
- qualquer validacao de tenant;
- qualquer verificacao de permissao;
- qualquer regra de Google Calendar;
- qualquer rotina de contato ou paciente;
- qualquer ajuste de visual fora do filtro semanal;
- qualquer alteracao de payload.

## 13. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a faixa de 7 dias usada pelos filtros;
- quebrar a expectativa de inicio e fim com base na data corrente;
- introduzir divergencia caso o helper seja chamado fora do momento esperado;
- afetar a leitura dos filtros da agenda legado;
- gerar regressao visual discreta, mas importante, no comportamento dos campos de periodo.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 14. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `agenda-legado`.
2. Acionar o botao de faixa semanal.
3. Conferir se o inicio permanece no dia corrente.
4. Conferir se o fim continua 6 dias adiante.
5. Verificar se a listagem continua carregando sem erro.
6. Conferir console sem `ReferenceError` ou `TypeError`.

## 15. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo arquivo JS;
- alterar `frontend/app.js` para alem da remocao local do helper;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules` fora do modulo existente;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper escolhido.

## 16. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 19 - Implementacao minima do helper puro agendaLegadoRangeSemana e validacao manual do impacto visual nos filtros de periodo da agenda legado`

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 18. Registro para roadmap
- A Subetapa 18 foi concluida como planejamento documental do sexto helper puro.
- O sexto helper recomendado para futura implementacao foi `agendaLegadoRangeSemana`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a implementacao minima de `agendaLegadoRangeSemana` com validacao manual do impacto visual nos filtros de periodo da agenda legado.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_18_plano_sexto_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
