# Fase 2 - Agenda principal - Subetapa 29 - Validacao manual da extracao de agendaSemanaBuildStandaloneUrl e revisao da abertura standalone da agenda semana

## 1. Objetivo
Validar documentalmente a extracao minima do helper puro `agendaSemanaBuildStandaloneUrl`, confirmando que a montagem da URL standalone da `Agenda semana` permaneceu equivalente ao comportamento anterior.

## 2. Escopo
Escopo desta subetapa:

- revisar a extracao feita na Subetapa 28;
- confirmar a ordem de carregamento dos scripts;
- confirmar a ausencia de duplicidade em `frontend/app.js`;
- registrar os pontos de uso preservados e os riscos residuais;
- atualizar o roadmap com a revisao documental.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 28
Subetapa 1:
- definiu o contrato funcional inicial e as fronteiras documentais da frente.

Subetapa 2:
- mapeou os fluxos de abertura, modos dia/semana, proximo agendado, avisos e a fronteira com agenda legado.

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
- preservou o formato `HH:MM`.

Subetapa 8:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual.

Subetapa 9:
- planejou documentalmente o terceiro helper puro;
- escolheu `agendaLegadoFmtDataInput` como o terceiro recorte recomendado.

Subetapa 10:
- extraiu minimamente `agendaLegadoFmtDataInput` para `frontend/js/modules/agenda-principal-legado-utils.js`.

Subetapa 11:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual no modal.

Subetapa 12:
- planejou documentalmente o quarto helper puro;
- escolheu `agendaLegadoFmtData` como o quarto recorte recomendado.

Subetapa 13:
- extraiu minimamente `agendaLegadoFmtData` para `frontend/js/modules/agenda-principal-legado-utils.js`.

Subetapa 14:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a preservacao visual na tabela/lista.

Subetapa 15:
- planejou documentalmente o quinto helper puro;
- escolheu `agendaLegadoRangeHoje` como o quinto recorte recomendado.

Subetapa 16:
- extraiu minimamente `agendaLegadoRangeHoje` para `frontend/js/modules/agenda-principal-legado-utils.js`.

Subetapa 17:
- validou a extracao anterior;
- confirmou a ausencia de duplicidade, os pontos de uso preservados e o filtro Hoje sem regra alterada.

Subetapa 18:
- planejou documentalmente o sexto helper puro;
- escolheu `agendaLegadoRangeSemana` como o sexto recorte recomendado.

Subetapa 19:
- extraiu minimamente `agendaLegadoRangeSemana` para `frontend/js/modules/agenda-principal-legado-utils.js`.

Subetapa 20:
- validou a extracao anterior;
- confirmou a ausencia de duplicidade, os pontos de uso preservados e o filtro Semana sem regra alterada.

Subetapa 21:
- planejou documentalmente o sétimo helper puro;
- escolheu `agendaSemanaIsStandaloneRequest` como o recorte recomendado.

Subetapa 22:
- extraiu minimamente `agendaSemanaIsStandaloneRequest` para `frontend/js/modules/agenda-principal-semana-utils.js`.

Subetapa 23:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e a abertura standalone sem regressao.

Subetapa 24:
- planejou documentalmente o oitavo helper puro;
- escolheu `agendaSemanaStandaloneModeFromQuery` como o recorte recomendado.

Subetapa 25:
- extraiu minimamente `agendaSemanaStandaloneModeFromQuery` para `frontend/js/modules/agenda-principal-semana-utils.js`.

Subetapa 26:
- validou a extracao anterior;
- confirmou o parametro `agenda_modo`, os valores `dia` e `clinica` e o fallback `semana`.

Subetapa 27:
- planejou documentalmente o nono helper puro;
- escolheu `agendaSemanaBuildStandaloneUrl` como o recorte recomendado.

Subetapa 28:
- extraiu minimamente `agendaSemanaBuildStandaloneUrl` para `frontend/js/modules/agenda-principal-semana-utils.js`;
- preservou a montagem da URL standalone, `agenda_semana=1` e a normalizacao de `agenda_modo`.

## 5. Registro de auditoria pos-Subetapa 27
Foi feita auditoria do commit `91986b2819e4e5399eff30f71416d26dc1c7333d` antes de prosseguir.

Conclusao da auditoria:
- o commit foi somente documental;
- entradas no commit: `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2_agenda_principal_subetapa_27_plano_nono_helper_puro.md`;
- `frontend/app.js` nao entrou no commit;
- `frontend/js/modules/agenda-principal-semana-utils.js` nao entrou no commit;
- `frontend/index.html` nao entrou no commit;
- nao havia alteracoes rastreadas pendentes;
- permaneciam apenas untracked antigos e nao relacionados em `docs/`.

## 6. Confirmacao da ordem de carregamento
`frontend/js/modules/agenda-principal-semana-utils.js` continua carregado antes de `frontend/app.js`.

## 7. Ausencia de duplicidade em frontend/app.js
Nao ha definicao duplicada de `agendaSemanaBuildStandaloneUrl` em `frontend/app.js`.

## 8. Pontos de uso preservados
Os pontos de uso continuam preservados:
- `agendaSemanaAbrirEmAbaUnica(modo)` continua chamando `agendaSemanaBuildStandaloneUrl(modo)`;
- a abertura standalone continua usando a URL gerada pelo helper extraido.

## 9. Confirmacoes tecnicas
- a montagem da URL foi preservada;
- a URL continua sendo gerada a partir de `window.location.href`;
- `agenda_semana=1` continua sendo setado;
- `agenda_modo` continua sendo usado conforme a regra anterior;
- os modos `dia`, `clinica` e `semana` permanecem preservados;
- sem modo explicito, o fallback continua `semana`;
- a abertura standalone nao teve regra alterada;
- `agendaSemanaIsStandaloneRequest` nao foi alterado;
- `agendaSemanaStandaloneModeFromQuery` nao foi alterado;
- `agenda-principal-legado-utils.js` nao foi alterado;
- os helpers de agenda legado nao foram alterados.

## 10. Arquivos alterados
Nesta subetapa, somente documentos foram alterados:
- `docs/fase_2_agenda_principal_subetapa_29_validacao_agenda_semana_build_standalone_url.md`
- `docs/11_roadmap_desenvolvimento.md`

## 11. Arquivos nao alterados
Nao houve alteracao em:
- `frontend/app.js`;
- `frontend/index.html`;
- `frontend/js/modules/agenda-principal-semana-utils.js`;
- `frontend/js/modules/agenda-principal-legado-utils.js`;
- backend;
- banco;
- schema;
- migrations;
- seeds;
- endpoints;
- permissões.

## 12. Riscos residuais
- divergencia futura se `agendaSemanaBuildStandaloneUrl` deixar de manter a composicao atual da URL;
- regressao se a ordem de carregamento dos scripts mudar em etapas futuras;
- erro na abertura standalone se `agenda_semana` ou `agenda_modo` deixarem de ser preservados.

## 13. Validacao tecnica executada
Checks executados:
- `node --check frontend/app.js` -> OK
- `node --check frontend/js/modules/agenda-principal-semana-utils.js` -> OK

## 14. Roteiro de validacao manual para o usuario
O usuario deve testar antes de prosseguir:

1. Abrir a `Agenda principal` normalmente.
2. Entrar na `Agenda semana` pelo fluxo normal.
3. Acionar a abertura standalone pelo fluxo normal da interface, se houver.
4. Conferir se a URL gerada continua contendo `agenda_semana=1`.
5. Testar a URL standalone ja validada anteriormente.
6. Testar `agenda_modo=dia`.
7. Testar `agenda_modo=clinica`.
8. Testar sem `agenda_modo`, confirmando que o padrao continua `semana`.
9. Confirmar que `Agenda legado` continua abrindo.
10. Confirmar que `Agenda do dia` continua abrindo.
11. Confirmar que `Proximo agendado` continua aparecendo sem erro.
12. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 15. Itens explicitamente fora do escopo
- extrair novo helper;
- criar novo modulo;
- alterar navegacao;
- alterar URL/querystring;
- alterar agenda legado;
- alterar filtros;
- alterar tabela/lista;
- alterar modal;
- alterar salvamento;
- alterar edicao;
- alterar exclusao;
- alterar payload;
- alterar recorrencia;
- alterar Google Calendar;
- alterar permissões;
- alterar backend;
- corrigir textos visiveis;
- corrigir mojibake;
- fazer refatoracao ampla.

## 16. Proxima subetapa recomendada
`Agenda principal - Subetapa 30 - Planejamento documental do decimo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 17. Blindagem textual/mojibake
Nao houve correcoes textuais nesta etapa.
Se houver texto quebrado ou mojibake, registrar em etapa futura sem corrigir.

## 18. Registro para roadmap
- `Agenda principal` continua como `core / comum`.
- A Subetapa 29 foi apenas documental.
- `agendaSemanaBuildStandaloneUrl` permanece como nona extracao minima.
- Nenhum codigo foi alterado.
- Nao houve alteracao de frontend, backend, banco, endpoints, seeds ou permissões.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O usuario ja havia testado URL/standalone e `agenda_modo` sem identificar erros.
- A proxima subetapa recomendada e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## 19. Commit seletivo obrigatorio
Arquivos autorizados para o commit seletivo desta subetapa:
- `docs/fase_2_agenda_principal_subetapa_29_validacao_agenda_semana_build_standalone_url.md`
- `docs/11_roadmap_desenvolvimento.md`

Mensagem sugerida:
`Documenta validacao da URL standalone da agenda semana`

