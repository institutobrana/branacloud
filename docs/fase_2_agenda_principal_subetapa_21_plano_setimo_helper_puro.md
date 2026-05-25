# Fase 2 - Agenda principal - Subetapa 21 - Planejamento documental do setimo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um setimo recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um setimo candidato;
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

## 4. Resumo das Subetapas 1 a 20
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
- `docs/fase_2_agenda_principal_subetapa_18_plano_sexto_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_19_implementacao_agenda_legado_range_semana.md`
- `docs/fase_2_agenda_principal_subetapa_20_validacao_agenda_legado_range_semana.md`
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
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11008` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta abertura | Medio | Sim, com query string | Nao, sugere modulo futuro de navegacao | **Sim, candidato recomendado** |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11017` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta modo exibido | Medio | Sim, com query string | Nao, sugere modulo futuro de navegacao | Nao como setimo recorte |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11025` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, conferindo URL gerada | Nao, sugere modulo futuro de navegacao | Nao como setimo recorte |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | Sim, cabe no modulo atual | Nao como setimo recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8514` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao como setimo recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:8994` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao como setimo recorte |

## 8. Candidato recomendado para sétima implementacao futura
Candidato recomendado:

- `agendaSemanaIsStandaloneRequest`

## 9. Justificativa da escolha
A escolha de `agendaSemanaIsStandaloneRequest` e a mais equilibrada para o setimo recorte porque:

- e a menor unidade restante de leitura de querystring;
- e uma funcao pura, sem escrita, sem DOM e sem backend;
- nao altera payload, salvar, editar, excluir, renderizacao ou lista;
- o risco operacional fica concentrado em um unico booleano de abertura standalone;
- embora dependa de URL/querystring, ainda e mais isolada do que os outros helpers restantes;
- os outros candidatos ainda envolvem payload, blur/input ou cores/visual, o que aumenta a superficie de regressao;
- este helper e a porta de entrada mais simples para a camada de navegacao standalone da agenda semana, caso futuramente se decida separar essa fronteira;
- por ser pequeno e previsivel, e o recorte restante com menor impacto operacional.

Comparacao resumida:
- `agendaSemanaStandaloneModeFromQuery` e `agendaSemanaBuildStandaloneUrl` sao proximos, mas ja carregam mais regra de modo/URL do que o booleano de abertura;
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, aumentando o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaSemanaIsStandaloneRequest` permanece o menor recorte util restante com impacto restrito a uma verificacao booleana de querystring.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a verificacao booleana da querystring `agenda_semana`;
- manter o comportamento atual:
  - criar `new URLSearchParams(window.location.search || "")` no momento da chamada;
  - ler o parametro `agenda_semana`;
  - considerar verdadeiro apenas `1`, `true` ou `yes`;
  - retornar `false` em falha de parse ou ausencia do parametro.

Fronteira funcional:
- apenas leitura de querystring;
- sem DOM;
- sem integracao com backend;
- sem selecao de tela;
- sem modal;
- sem evento;
- sem alteracao de renderizacao estrutural.

## 11. Se o helper deve entrar no modulo ja criado ou exigir novo modulo
O helper nao deve entrar no modulo ja criado de utilitarios da agenda legado.

Motivo:
- o helper pertence ao fluxo de `Agenda semana` standalone;
- a responsabilidade e de navegacao e abertura de tela, nao de utilitario legado;
- a separacao documental mais coerente e um futuro modulo proprio de navegacao da agenda semana, e nao `agenda-principal-legado-utils.js`.

## 12. O que NAO deve entrar na futura extracao
Nao devem entrar na futura extracao:

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
- qualquer alteracao de payload;
- qualquer ajuste de visual fora da abertura standalone.

## 13. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a deteccao de abertura standalone da agenda semana;
- quebrar a expectativa de leitura de `agenda_semana` na URL;
- introduzir divergencia caso valores falsos/verdadeiros sejam interpretados de forma diferente;
- afetar a abertura da agenda semana em aba dedicada;
- gerar regressao de navegacao discreta, mas importante.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 14. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na agenda semana.
2. Conferir se a abertura standalone continua ocorrendo quando a query indicar isso.
3. Abrir a mesma tela sem o parametro `agenda_semana` e confirmar o retorno esperado.
4. Testar `agenda_semana=1`, `true` e `yes`.
5. Conferir console sem `ReferenceError` ou `TypeError`.

## 15. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo arquivo JS;
- alterar `frontend/app.js` para alem da remocao local do helper;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules` fora do modulo futuro proprio;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper escolhido.

## 16. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 22 - Implementacao minima do helper puro agendaSemanaIsStandaloneRequest e validacao manual da abertura standalone da agenda semana`

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 18. Registro para roadmap
- A Subetapa 21 foi concluida como planejamento documental do setimo helper puro.
- O setimo helper recomendado para futura implementacao foi `agendaSemanaIsStandaloneRequest`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a implementacao minima de `agendaSemanaIsStandaloneRequest` em um modulo futuro proprio da agenda semana, com validacao manual da abertura standalone.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_21_plano_setimo_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
