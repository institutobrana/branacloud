# Fase 2 - Agenda principal - Subetapa 12 - Planejamento documental do quarto helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um quarto recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um quarto candidato;
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

## 4. Resumo das Subetapas 1 a 11
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

## 5. Arquivos analisados
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
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/`

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

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Dependencia visual no modal/lista/tabela? | Risco de regressao | Teste manual futuro | Adequado ao modulo atual? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11026` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta abertura | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11035` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta modo exibido | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11043` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Parcial | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, conferindo URL gerada | Nao, tende a ficar com fluxo de navegacao | Nao |
| `agendaLegadoRangeHoje` | `frontend/app.js:8903` | Montar faixa de hoje | data atual | `{inicio, fim}` | Parcial, temporal | Nao | Sim, tempo atual | Nao | Nao | Sim | Nao | Sim, afeta filtros de periodo | Baixo a medio | Sim, clicando botao Hoje | Sim, cabe no modulo atual | Nao como quarto recorte |
| `agendaLegadoRangeSemana` | `frontend/app.js:8908` | Montar faixa de 7 dias | data atual | `{inicio, fim}` | Parcial, temporal | Nao | Sim, tempo atual | Nao | Nao | Sim | Nao | Sim, afeta filtros de periodo | Baixo a medio | Sim, clicando botao Semana | Sim, cabe no modulo atual | Nao como quarto recorte |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | Sim, cabe no modulo atual | Nao como quarto recorte |
| `agendaLegadoFmtData` | `frontend/app.js:8391` | Formatar data para exibicao na tabela | `valor` | `string` em `pt-BR` | Sim | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta tabela/lista | Baixo | Sim, conferindo lista | Sim, cabe no modulo atual | **Sim, candidato recomendado** |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8520` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao como quarto recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:9005` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao como quarto recorte |

## 8. Candidato recomendado para quarta implementacao futura
Candidato recomendado:

- `agendaLegadoFmtData`

## 9. Justificativa da escolha
A escolha de `agendaLegadoFmtData` e a mais equilibrada para o quarto recorte porque:

- e pequena e deterministica;
- nao depende de DOM;
- nao depende de estado global;
- nao depende de backend;
- nao depende de tenant/clinica_id;
- nao depende de permissao;
- nao produz escrita de payload;
- nao altera navegacao standalone nem URL;
- afeta apenas a exibicao da data na tabela/lista da agenda legado;
- o impacto visual e previsivel e facil de validar manualmente;
- cabe naturalmente no modulo ja criado `frontend/js/modules/agenda-principal-legado-utils.js`;
- evita os helpers de maior risco ligados a range temporal, querystring, payload ou interacao de hora.

Comparacao resumida:
- os helpers `agendaSemana*` dependem diretamente de URL/querystring e navegacao, entao nao sao o quarto recorte mais seguro;
- `agendaLegadoRangeHoje` e `agendaLegadoRangeSemana` dependem do calendario atual e do dia corrente, ampliando o risco temporal;
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, o que aumenta o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaLegadoFmtData` permanece puro, com impacto visual restrito a tabela/lista e teste manual simples.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a formatação de data para a exibicao da tabela da agenda legado;
- manter o comportamento atual:
  - retornar string vazia quando nao houver valor;
  - converter o valor em `Date(String(valor))`;
  - se a data for invalida, retornar o texto original;
  - se a data for valida, retornar `toLocaleDateString("pt-BR")`.

Fronteira funcional:
- apenas formatacao de valor para exibicao;
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

- `agendaLegadoParseDataInput`;
- `agendaLegadoFmtDataInput`;
- `agendaLegadoSalvarModal`;
- `agendaLegadoExcluir`;
- `agendaLegadoCoerceHoraTexto`;
- qualquer leitura de DOM;
- qualquer `requestJson`;
- qualquer ajuste de modal;
- qualquer validacao de tenant;
- qualquer verificacao de permissao;
- qualquer regra de Google Calendar;
- qualquer regra de agenda semana;
- qualquer rotina de contato ou paciente;
- qualquer ajuste de visual de cor ou de hora;
- qualquer alteracao de payload.

## 13. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a exibicao da data na tabela/lista da agenda legado;
- quebrar a expectativa de `pt-BR` se a locale nao for preservada;
- introduzir divergencia entre datas validas e texto original quando a entrada for invalida;
- afetar comparacao visual de registros na lista;
- gerar regressao visual discreta, mas importante, na tabela.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 14. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `agenda-legado`.
2. Verificar a listagem de agendamentos com datas exibidas.
3. Abrir um agendamento existente e conferir se a data continua no mesmo formato visual de antes.
4. Abrir um novo agendamento e conferir se a tabela nao mudou.
5. Criar e editar um agendamento para confirmar que a lista continua igual.
6. Conferir console sem `ReferenceError` ou `TypeError`.

## 15. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo arquivo JS;
- alterar `frontend/app.js`;
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

- `Agenda principal - Subetapa 13 - Implementacao minima do helper puro agendaLegadoFmtData e validacao manual do impacto visual na tabela da agenda legado`

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 18. Registro para roadmap
- A Subetapa 12 foi concluida como planejamento documental do quarto helper puro.
- O quarto helper recomendado para futura implementacao foi `agendaLegadoFmtData`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a implementacao minima de `agendaLegadoFmtData` com validacao manual do impacto visual na tabela da agenda legado.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_12_plano_quarto_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega

