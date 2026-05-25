# Fase 2 - Agenda principal - Subetapa 9 - Planejamento documental do terceiro helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um terceiro recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um terceiro candidato;
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

## 4. Resumo das Subetapas 1, 2, 3, 4, 5, 6, 7 e 8
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

## 5. Arquivos analisados
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/fase_2_agenda_principal_subetapa_3_plano_primeiro_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_4_implementacao_agenda_legado_num_or_null.md`
- `docs/fase_2_agenda_principal_subetapa_5_validacao_agenda_legado_num_or_null.md`
- `docs/fase_2_agenda_principal_subetapa_6_plano_segundo_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_7_implementacao_agenda_legado_fmt_hora.md`
- `docs/fase_2_agenda_principal_subetapa_8_validacao_agenda_legado_fmt_hora.md`
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

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Risco de regressao | Teste manual futuro | Adequado ao modulo atual? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11041` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11050` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Nao | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11058` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Parcial | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Medio | Sim, conferindo URL gerada | Nao, tende a ficar com fluxo de navegacao | Nao |
| `agendaLegadoRangeHoje` | `frontend/app.js:8918` | Montar faixa de hoje | data atual | `{inicio, fim}` | Nao totalmente, depende do calendario atual | Nao | Sim, tempo atual | Nao | Nao | Sim | Nao | Baixo a medio | Sim, abrindo botao Hoje | Sim, cabe no modulo atual | Pode ser, mas nao e a melhor opcao |
| `agendaLegadoRangeSemana` | `frontend/app.js:8923` | Montar faixa de 7 dias | data atual | `{inicio, fim}` | Nao totalmente, depende do calendario atual | Nao | Sim, tempo atual | Nao | Nao | Sim | Nao | Baixo a medio | Sim, abrindo botao Semana | Sim, cabe no modulo atual | Pode ser, mas nao e a melhor opcao |
| `agendaLegadoFmtDataInput` | `frontend/app.js:8379` | Converter data para formato de input `dd/mm/aaaa` | `valor` | `dd/mm/aaaa` ou texto original | Sim, com dependencia de parse de data para casos genericos | Nao | Nao | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo modal e abertura de novo agendamento | Sim, cabe no modulo atual | **Sim, candidato recomendado** |
| `agendaLegadoParseDataInput` | `frontend/app.js:8394` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Medio | Sim, conferindo salvar/editar | Sim, cabe no modulo atual | Nao |
| `agendaLegadoFmtData` | `frontend/app.js:8406` | Formatar data para exibicao | `valor` | `string` em `pt-BR` | Sim, com dependencia de `Date` e locale | Nao | Nao | Nao | Nao | Nao | Nao | Baixo a medio | Sim, conferindo tabela | Sim, cabe no modulo atual | Nao |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8535` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:9020` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao |

## 8. Candidato recomendado para terceira implementacao futura
Candidato recomendado:

- `agendaLegadoFmtDataInput`

## 9. Justificativa da escolha
A escolha de `agendaLegadoFmtDataInput` e a mais equilibrada para o terceiro recorte porque:

- e pequena e focada em formatacao;
- nao depende de DOM;
- nao depende de estado global;
- nao depende de backend;
- nao depende de tenant/clinica_id;
- nao depende de permissao;
- nao toca em escrita de payload;
- nao altera navegacao standalone nem URL;
- tem impacto previsivel e testavel em modal de agenda legado e na abertura de novo agendamento;
- continua cabendo no modulo ja criado `frontend/js/modules/agenda-principal-legado-utils.js`;
- evita os helpers de maior risco ligados a querystring, payload, cor ou coercao de hora.

Comparacao resumida:
- os helpers `agendaSemana*` dependem diretamente de URL/querystring e navegacao, entao nao sao o terceiro recorte mais seguro;
- `agendaLegadoRangeHoje` e `agendaLegadoRangeSemana` dependem do calendario atual e do dia corrente;
- `agendaLegadoParseDataInput` mexe diretamente na saida ISO usada para salvar, o que aumenta o risco operacional;
- `agendaLegadoFmtData` e visual, mas depende de `Date` e locale e nao e mais simples que `FmtDataInput` para o fluxo de input;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitação/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta aparencia de cor;
- `agendaLegadoFmtDataInput` e o menor passo util restante com impacto previsivel no modal e na abertura de novo agendamento.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a logica de conversao/formatacao de data para o formato de input `dd/mm/aaaa`;
- manter o comportamento atual:
  - retornar o proprio texto quando ja estiver em `dd/mm/aaaa`;
  - converter `aaaa-mm-dd` para `dd/mm/aaaa`;
  - tentar formatar `Date` generico de forma identica ao comportamento atual;
  - retornar o texto original quando a data nao for valida.

Fronteira funcional:
- apenas formatacao de valor de data para input;
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
- `agendaLegadoFmtData`;
- `agendaLegadoSalvarModal`;
- `agendaLegadoExcluir`;
- `agendaLegadoCoerceHoraTexto`;
- qualquer leitura de DOM;
- qualquer `requestJson`;
- qualquer ajuste de modal fora da formatacao de data;
- qualquer validacao de tenant;
- qualquer verificacao de permissao;
- qualquer regra de Google Calendar;
- qualquer regra de agenda semana;
- qualquer rotina de contato ou paciente;
- qualquer ajuste visual ou textual fora do formato de data.

## 13. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a exibicao do campo de data no modal;
- quebrar o preenchimento do modal em abertura de novo agendamento ou edicao;
- introduzir diferenca no tratamento entre `yyyy-mm-dd` e `dd/mm/aaaa`;
- afetar casos em que a funcao recebe texto generico nao valido;
- gerar regressao visual discreta mas perceptivel no fluxo de agenda legado.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 14. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `agenda-legado`.
2. Abrir um agendamento existente e conferir o campo de data no modal.
3. Abrir um novo agendamento e conferir o preenchimento do campo de data.
4. Verificar se `yyyy-mm-dd` continua aparecendo em `dd/mm/aaaa` no modal.
5. Testar editar e salvar sem alterar o comportamento do campo de data.
6. Conferir que a tabela da agenda legado continua intacta.
7. Conferir console sem `ReferenceError` ou `TypeError`.

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

- `Agenda principal - Subetapa 10 - Implementacao minima do helper puro agendaLegadoFmtDataInput e validacao manual do impacto visual no modal de agenda legado`

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 18. Registro para roadmap
- A Subetapa 9 foi concluida como planejamento documental do terceiro helper puro.
- O terceiro helper recomendado para futura implementacao foi `agendaLegadoFmtDataInput`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a implementacao minima de `agendaLegadoFmtDataInput` com validacao manual do impacto visual no modal da agenda legado.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_9_plano_terceiro_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega

