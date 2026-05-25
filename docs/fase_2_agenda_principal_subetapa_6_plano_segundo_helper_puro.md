# Fase 2 - Agenda principal - Subetapa 6 - Planejamento documental do segundo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um segundo recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um segundo candidato;
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

## 4. Resumo das Subetapas 1, 2, 3, 4 e 5
Subetapa 1:
- definiu o contrato funcional inicial da frente;
- registrou fronteiras com agenda do dia, semana, proximo agendado, avisos, configuracao de agendas, recorrencia, Google Calendar e agenda legado;
- deixou claro que `Agenda de contatos` permanece consolidada.

Subetapa 2:
- mapeou os fluxos de abertura;
- documentou modos dia/semana, proximo agendado, quadro de avisos e configuracao de agendas;
- registrou a fronteira com agenda legado e a consolidacao da agenda de contatos.

Subetapa 3:
- reavaliou os candidatos a helper puro;
- escolheu `agendaLegadoNumOrNull` como primeiro helper para futura implementacao;
- registrou a fronteira exata e os riscos.

Subetapa 4:
- extraiu minimamente `agendaLegadoNumOrNull` para `frontend/js/modules/agenda-principal-legado-utils.js`;
- preservou a semantica;
- manteve o carregamento do modulo antes de `frontend/app.js`.

Subetapa 5:
- validou a extracao anterior;
- confirmou ausencia de duplicidade em `frontend/app.js`;
- confirmou a ordem de carregamento do novo modulo;
- nao trouxe nova extracao.

## 5. Arquivos analisados
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/fase_2_agenda_principal_subetapa_3_plano_primeiro_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_4_implementacao_agenda_legado_num_or_null.md`
- `docs/fase_2_agenda_principal_subetapa_5_validacao_agenda_legado_num_or_null.md`
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
- ausencia de alteracao visual;
- baixo risco de regressao;
- facilidade de teste manual apos futura implementacao;
- compatibilidade com o modulo `agenda-principal-legado-utils.js`;
- tamanho da superficie afetada.

## 7. Mapa comparativo dos candidatos restantes

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Risco de regressao | Teste manual futuro | Adequado ao modulo atual? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11048` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Nao, depende do browser | Nao | Sim, `window.location` | Nao | Nao | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao como segundo recorte |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11057` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Nao, depende do browser | Nao | Sim, `window.location` | Nao | Nao | Medio | Sim, com query string | Nao, e mais ligado a navegacao | Nao como segundo recorte |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11065` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Parcial | Nao | Sim, `window.location` | Nao | Nao | Medio | Sim, conferindo URL gerada | Nao, tende a ficar com fluxo de navegacao | Nao como segundo recorte |
| `agendaLegadoRangeHoje` | `frontend/app.js:8925` | Montar faixa de hoje | data atual | `{inicio, fim}` | Parcial, temporal | Nao | Sim, tempo atual | Nao | Nao | Baixo a medio | Sim, abrindo botao Hoje | Sim, cabe no modulo atual | Pode ser, mas nao e a melhor opcao |
| `agendaLegadoRangeSemana` | `frontend/app.js:8930` | Montar faixa de 7 dias | data atual | `{inicio, fim}` | Parcial, temporal | Nao | Sim, tempo atual | Nao | Nao | Baixo a medio | Sim, abrindo botao Semana | Sim, cabe no modulo atual | Pode ser, mas nao e a melhor opcao |
| `agendaLegadoFmtHora` | `frontend/app.js:8379` | Formatar milissegundos em `HH:MM` | `ms` | `string` | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo lista e modal | Sim, cabe diretamente no modulo atual | **Sim, candidato recomendado** |
| `agendaLegadoFmtDataInput` | `frontend/app.js:8386` | Converter data para formato de input | `valor` | `dd/mm/aaaa` ou texto | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo modal | Sim, cabe no modulo atual | Nao como segundo recorte |
| `agendaLegadoParseDataInput` | `frontend/app.js:8401` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo modal | Sim, cabe no modulo atual | Nao como segundo recorte |
| `agendaLegadoFmtData` | `frontend/app.js:8413` | Formatar data para exibicao | `valor` | `string` em `pt-BR` | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo tabela | Sim, cabe no modulo atual | Nao como segundo recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8542` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao como segundo recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:9027` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao como segundo recorte |

## 8. Candidato recomendado para segunda implementacao futura
Candidato recomendado:

- `agendaLegadoFmtHora`

## 9. Justificativa da escolha
A escolha de `agendaLegadoFmtHora` e a mais segura para o segundo recorte porque:

- e pequena e deterministica;
- nao depende de DOM;
- nao depende de estado global;
- nao depende de backend;
- nao depende de tenant/clinica_id;
- nao depende de permissao;
- nao produz alteracao estrutural de navegacao;
- cabe naturalmente no modulo ja criado `agenda-principal-legado-utils.js`;
- e mais simples que helpers de data ou normalizacao de hora de input;
- e facil de testar manualmente porque o resultado aparece na lista e no modal da agenda legado.

Comparacao resumida:
- `agendaSemana*` tem risco de navegacao e usa `window.location`;
- `agendaLegadoRangeHoje` e `agendaLegadoRangeSemana` sao puros, mas temporais e ligados ao recorte de periodo;
- `agendaLegadoFmtDataInput`, `agendaLegadoParseDataInput` e `agendaLegadoFmtData` sao puros, mas envolvem data e podem carregar mais risco de comportamento de input ou exibicao;
- `agendaLegadoCoerceHoraTexto` mexe com input/blur e exige mais cenario;
- `agendaLegadoNormalizarHexCor` e util, mas mais exposto a fallback e renderizacao de cor;
- `agendaLegadoFmtHora` e o recorte mais pequeno entre os restantes e continua no mesmo dominio de utilitarios simples da agenda legado.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a logica de formatacao de milissegundos para `HH:MM`;
- manter o comportamento atual:
  - `parseInt(ms||0, 10)`;
  - saturacao em `0` para valores negativos;
  - retorno de string vazia para `0h00`/`0m00`;
  - `padStart(2, "0")` para horas e minutos.

Fronteira funcional:
- apenas formatacao;
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

- `agendaLegadoRender`;
- `agendaLegadoSalvarModal`;
- `agendaLegadoExcluir`;
- `agendaLegadoColetarRepeticaoConfig`;
- `agendaLegadoCoerceHoraTexto`;
- `agendaLegadoFmtData`;
- qualquer leitura de DOM;
- qualquer `requestJson`;
- qualquer ajuste de modal;
- qualquer validacao de tenant;
- qualquer verificacao de permissao;
- qualquer regra de Google Calendar;
- qualquer regra de agenda semana;
- qualquer rotina de contato ou paciente;
- qualquer ajuste visual ou textual.

## 13. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a representacao textual de hora em lista e modal;
- quebrar a expectativa de `HH:MM` em horas zero, truncadas ou com valores parciais;
- introduzir diferenca sutil entre valores numericos e strings numericas;
- afetar exibicao de duracao/horario se a semantica original nao for preservada;
- gerar regressao visual em lista e modal da agenda legado.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 14. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `agenda-legado`.
2. Verificar a listagem de agendamentos com horarios exibidos.
3. Abrir um modal existente e confirmar que o horario continua sendo exibido em `HH:MM`.
4. Criar e editar um agendamento com duracao/hora para conferir o formato.
5. Conferir que a agenda do dia, semana e proximo agendado continuam iguais.
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

- `Agenda principal - Subetapa 7 - Implementacao minima do helper puro agendaLegadoFmtHora e validacao manual do impacto visual em lista e modal`

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao de textos visiveis, labels, placeholders, acentos ou mojibake.

Se houver texto estranho ou corrompido em arquivos lidos, isso deve ser apenas registrado como pendencia futura, sem qualquer correcao nesta etapa.

## 18. Registro para roadmap
- A Subetapa 6 foi concluida como planejamento documental do segundo helper puro.
- O segundo helper recomendado para futura implementacao foi `agendaLegadoFmtHora`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a implementacao minima de `agendaLegadoFmtHora` com validacao manual do impacto visual.

## 19. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_6_plano_segundo_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md`

