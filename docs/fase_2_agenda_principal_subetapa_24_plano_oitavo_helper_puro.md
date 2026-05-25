# Fase 2 - Agenda principal - Subetapa 24 - Planejamento documental do oitavo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata

## 1. Objetivo
Documentar a reavaliacao dos candidatos restantes a helper puro da `Agenda principal`, selecionar apenas um oitavo recorte recomendado para futura implementacao minima e registrar a fronteira exata dessa futura extracao.

Esta etapa nao autoriza patch, nao implementa helper e nao altera comportamento.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos restantes a helper puro;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um oitavo candidato;
- registrar o modulo correto para a futura extracao;
- registrar o que nao deve entrar na futura extracao;
- atualizar o roadmap apenas com registro objetivo.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 23
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
- registrou que o usuario validou o fluxo normal, mas nao conseguiu testar diretamente a querystring standalone porque nao sabia a rota exata;
- nao alterou helpers de agenda legado nem a regra de abertura standalone.

## 5. Observacao sobre a validacao manual da Subetapa 23
O usuario validou o fluxo normal da `Agenda principal`, as abas e os agendamentos e informou que nao encontrou erros.

A validacao manual direta da querystring standalone ficou limitada porque o usuario nao sabia a rota exata usada para abrir a `Agenda semana` em modo standalone.

Essa limitacao nao indica regressao funcional; apenas registra um ponto de teste que continua pendente para uma verificacao manual completa.

## 6. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/`
- `docs/fase_2_agenda_principal_subetapa_21_plano_setimo_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_22_implementacao_agenda_semana_is_standalone_request.md`
- `docs/fase_2_agenda_principal_subetapa_23_validacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 7. Criterios usados para avaliacao
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
- compatibilidade com o modulo correto de agenda semana ou agenda legado;
- tamanho da superficie afetada.

## 8. Mapa comparativo dos candidatos restantes

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Dependencia visual no modal/lista/tabela/filtros? | Risco de regressao | Teste manual futuro | Módulo correto | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11008` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta o modo exibido | Medio | Sim, com query string e modo aberto | `frontend/js/modules/agenda-principal-semana-utils.js` | **Sim, candidato recomendado** |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11016` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, conferindo URL gerada | `frontend/js/modules/agenda-principal-semana-utils.js` | Nao como oitavo recorte |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como oitavo recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8514` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como oitavo recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:8987` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como oitavo recorte |

## 9. Candidato recomendado para oitava implementacao futura
Candidato recomendado:

- `agendaSemanaStandaloneModeFromQuery`

## 10. Justificativa da escolha
A escolha de `agendaSemanaStandaloneModeFromQuery` e a mais equilibrada para o oitavo recorte porque:

- continua sendo uma funcao pura e pequena;
- pertence ao mesmo dominio da agenda semana / standalone;
- nao altera backend, banco, payload, agenda legado ou lista/tabela;
- apos a extracao do booleano de abertura standalone, esse helper e o proximo passo natural para completar a fronteira de leitura da querystring do modo standalone;
- apesar de depender de `agenda_modo` na URL, o seu comportamento e mais simples e previsivel do que o gerador de URL `agendaSemanaBuildStandaloneUrl`;
- os helpers de agenda legado restantes tocam fluxo de salvar/editar ou visual, o que aumenta mais o risco operacional do que a leitura do modo standalone;
- a validacao manual futura pode ser objetiva: `agenda_modo=dia`, `agenda_modo=clinica` e ausencia de parametro.

Comparacao resumida:
- `agendaSemanaBuildStandaloneUrl` manipula a URL atual e, por isso, introduz mais superficie de alteracao do que a leitura do modo;
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, aumentando o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaSemanaStandaloneModeFromQuery` permanece o recorte mais pequeno e isolado entre os candidatos restantes, apos a separacao do booleano de standalone.

## 11. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a leitura do modo da agenda standalone a partir da querystring;
- manter o comportamento atual:
  - criar `new URLSearchParams(window.location.search || "")` no momento da chamada;
  - ler o parametro `agenda_modo`;
  - aceitar apenas `dia` e `clinica` como valores especiais;
  - retornar `semana` como padrao e em qualquer valor inesperado.

Fronteira funcional:
- apenas leitura de querystring;
- sem DOM;
- sem integracao com backend;
- sem selecao de tela;
- sem modal;
- sem evento;
- sem alteracao de renderizacao estrutural.

## 12. Módulo correto para o helper
O helper deve entrar em:

- `frontend/js/modules/agenda-principal-semana-utils.js`

Motivo:
- o helper pertence ao fluxo de `Agenda semana` standalone;
- ele e parte da mesma fronteira funcional iniciada pela Subetapa 22;
- nao e utilitario de agenda legado;
- manter no modulo de semana evita contaminar `agenda-principal-legado-utils.js`.

## 13. O que NAO deve entrar na futura extracao
Nao devem entrar na futura extracao:

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

## 14. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar o modo exibido na agenda standalone;
- quebrar a expectativa de leitura de `agenda_modo` na URL;
- introduzir divergencia caso `dia`, `clinica` e padrao `semana` sejam tratados de forma diferente da atual;
- afetar a abertura da agenda semana em aba dedicada;
- gerar regressao de navegacao discreta, mas importante.

Risco geral:
- baixo a medio, porque o helper e pequeno, mas depende de querystring e tem efeito direto na experiencia standalone.

## 15. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `Agenda semana`.
2. Abrir a `Agenda semana` em modo standalone na rota correta do sistema.
3. Testar `agenda_modo=dia`.
4. Testar `agenda_modo=clinica`.
5. Testar ausencia de `agenda_modo` e confirmar `semana` como padrao.
6. Conferir que `agenda_semana=1` continua abrindo a tela correta e nao interfere no modo lido.
7. Confirmar console sem `ReferenceError` ou `TypeError`.

## 16. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo helper alem de `agendaSemanaStandaloneModeFromQuery`;
- alterar `frontend/app.js` para alem da remocao local do helper no futuro;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules/agenda-principal-legado-utils.js`;
- alterar helpers de agenda legado;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper escolhido.

## 17. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 25 - Planejamento documental do nono helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## 18. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 19. Registro para roadmap
- A Subetapa 24 foi executada apenas como planejamento documental do oitavo helper puro.
- O oitavo helper recomendado para futura implementacao foi `agendaSemanaStandaloneModeFromQuery`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- A blindagem textual/mojibake foi respeitada.
- O teste manual direto de querystring standalone da Subetapa 23 ficou limitado porque o usuario nao sabia a rota exata, entao essa pendencia permanece registrada para a validacao futura.
- O proximo passo recomendado e a implementacao minima de `agendaSemanaStandaloneModeFromQuery` em `frontend/js/modules/agenda-principal-semana-utils.js`, com validacao manual da agenda semana standalone.

## 20. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_24_plano_oitavo_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
