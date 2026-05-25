# Fase 2 - Agenda principal - Subetapa 28 - Implementacao minima do helper puro agendaSemanaBuildStandaloneUrl e validacao manual da abertura standalone da agenda semana

## 1. Objetivo
Extrair minimamente o helper puro `agendaSemanaBuildStandaloneUrl` de `frontend/app.js` para o modulo proprio da `Agenda semana`, preservando exatamente a semantica atual de montagem da URL standalone e sem alterar o comportamento da navegacao.

## 2. Escopo
Escopo desta subetapa:

- mover somente `agendaSemanaBuildStandaloneUrl` para o modulo proprio da agenda semana;
- manter os pontos de uso existentes;
- preservar a semantica atual de montagem da URL;
- documentar arquivos alterados e nao alterados;
- registrar riscos e roteiro manual de validacao;
- atualizar o roadmap com a nova entrada objetiva.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 a 27
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

Subetapa 26:
- validou a extracao anterior;
- confirmou a ordem de carregamento, a ausencia de duplicidade e os pontos de uso;
- confirmou o parametro `agenda_modo`, os valores aceitos e o fallback `semana`;
- registrou que o usuario validou URL/standalone, `agenda_modo=dia`, `agenda_modo=clinica` e sem `agenda_modo` sem identificar erros;
- nao alterou helpers de agenda legado nem a regra de abertura standalone.

Subetapa 27:
- planejou documentalmente o nono helper puro;
- escolheu `agendaSemanaBuildStandaloneUrl` como o nono recorte recomendado;
- definiu o modulo correto como `frontend/js/modules/agenda-principal-semana-utils.js`;
- registrou os riscos da montagem da URL standalone;
- confirmou auditoria posterior do commit 91986b2 e a limpeza documental da Subetapa 27.

## 5. Registro da auditoria posterior da Subetapa 27
A auditoria posterior do commit `91986b2819e4e5399eff30f71416d26dc1c7333d` confirmou que ele foi somente documental.

Arquivos realmente contidos no commit:
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_principal_subetapa_27_plano_nono_helper_puro.md`

Arquivos de codigo que nao entraram no commit:
- `frontend/app.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/index.html`

Essa auditoria mostrou que a Subetapa 27 foi limpa e nao teve alteracao funcional.

## 6. Observacao sobre a validacao manual da Subetapa 26
O usuario validou a abertura URL/standalone e tambem testou `agenda_modo=dia`, `agenda_modo=clinica` e ausencia de `agenda_modo`, sem identificar erros.

Esse resultado confirma que a fronteira standalone da `Agenda semana` segue consistente apos as extracoes anteriores.

## 7. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `frontend/js/modules/`
- `docs/fase_2_agenda_principal_subetapa_21_plano_setimo_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_22_implementacao_agenda_semana_is_standalone_request.md`
- `docs/fase_2_agenda_principal_subetapa_23_validacao_agenda_semana_is_standalone_request.md`
- `docs/fase_2_agenda_principal_subetapa_24_plano_oitavo_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_25_implementacao_agenda_semana_standalone_mode_from_query.md`
- `docs/fase_2_agenda_principal_subetapa_26_validacao_agenda_semana_standalone_mode_from_query.md`
- `docs/fase_2_agenda_principal_subetapa_27_plano_nono_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 8. Criterios usados para avaliacao
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

## 9. Mapa comparativo dos candidatos restantes

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Dependencia visual no modal/lista/tabela/filtros? | Risco de regressao | Teste manual futuro | Módulo correto | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11009` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, clicando no fluxo de abertura standalone | `frontend/js/modules/agenda-principal-semana-utils.js` | **Sim, candidato recomendado** |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como nono recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8514` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como nono recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:8987` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | `frontend/js/modules/agenda-principal-legado-utils.js` | Nao como nono recorte |

## 10. Candidato recomendado para nona implementacao futura
Candidato recomendado:

- `agendaSemanaBuildStandaloneUrl`

## 11. Justificativa da escolha
A escolha de `agendaSemanaBuildStandaloneUrl` e a mais equilibrada para o nono recorte porque:

- continua sendo uma funcao pura e pequena;
- pertence ao dominio de `Agenda semana` standalone;
- nao mexe em backend, banco, payload, agenda legado ou renderizacao;
- e a ultima peca pequena da fronteira standalone da agenda semana que ainda faltava tratar;
- o usuario ja validou a abertura URL/standalone e os modos `dia`, `clinica` e padrão `semana`, entao a validacao manual futura pode ser objetiva;
- apesar de manipular a URL, o helper continua isolado e previsivel, sem tocar em dados persistidos;
- os helpers legados restantes tocam fluxo de salvar/editar ou visual, o que aumenta mais o risco operacional do que a montagem da URL standalone;
- apos a extracao dos leitores da querystring, este e o proximo passo natural para completar a fronteira de navegacao standalone;
- a auditoria posterior da Subetapa 27 confirmou que a trilha documental anterior ficou limpa, sem codigo indevido.

Comparacao resumida:
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, aumentando o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaSemanaBuildStandaloneUrl` e o recorte mais pequeno e isolado restante, com impacto restrito a montagem do target de abertura standalone.

## 12. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a montagem da URL standalone da agenda semana;
- manter o comportamento atual:
  - criar `new URL(window.location.href)` no momento da chamada;
  - setar `agenda_semana=1`;
  - setar `agenda_modo` como `dia`, `clinica` ou `semana` conforme o argumento;
  - retornar a string final da URL.

Fronteira funcional:
- apenas montagem de URL;
- sem DOM;
- sem integracao com backend;
- sem selecao de tela;
- sem modal;
- sem evento;
- sem alteracao de renderizacao estrutural.

## 13. Módulo correto para o helper
O helper deve entrar em:

- `frontend/js/modules/agenda-principal-semana-utils.js`

Motivo:
- o helper pertence ao fluxo de `Agenda semana` standalone;
- ele completa a mesma fronteira funcional iniciada pela Subetapa 22;
- nao e utilitario de agenda legado;
- manter no modulo de semana evita contaminar `agenda-principal-legado-utils.js`.

## 14. O que NAO deve entrar na futura extracao
Nao devem entrar na futura extracao:

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

## 15. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- montar uma URL incorreta para a agenda semana standalone;
- quebrar a expectativa de leitura de `agenda_semana` e `agenda_modo` na URL gerada;
- introduzir divergencia caso `dia`, `clinica` e padrao `semana` sejam tratados de forma diferente da atual;
- afetar a abertura da agenda semana em aba dedicada;
- gerar regressao de navegacao discreta, mas importante.

Risco geral:
- baixo a medio, porque o helper e pequeno, mas depende de URL e tem efeito direto na experiencia standalone.

## 16. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `Agenda semana`.
2. Acionar a abertura standalone pelo fluxo normal da interface.
3. Confirmar que a URL gerada continua contendo `agenda_semana=1`.
4. Testar `agenda_modo=dia`.
5. Testar `agenda_modo=clinica`.
6. Testar ausencia de `agenda_modo` e confirmar `semana` como padrao.
7. Confirmar que a agenda continua abrindo na URL ja validada pelo usuario.
8. Conferir console sem `ReferenceError` ou `TypeError`.

## 17. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo helper alem de `agendaSemanaBuildStandaloneUrl`;
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

## 18. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 28 - Validacao manual da extracao de agendaSemanaBuildStandaloneUrl e revisao da abertura standalone da agenda semana`

## 19. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 20. Registro para roadmap
- A Subetapa 28 foi concluida como implementacao minima do nono helper puro.
- O helper extraido foi `agendaSemanaBuildStandaloneUrl`.
- A extracao foi feita no modulo `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` nao precisou ser alterado.
- `agendaSemanaIsStandaloneRequest` nao foi alterado.
- `agendaSemanaStandaloneModeFromQuery` nao foi alterado.
- `agenda-principal-legado-utils.js` nao foi alterado.
- Nenhum helper de agenda legado foi alterado.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- A auditoria posterior da Subetapa 27 confirmou commit documental limpo.
- O usuario ja validou URL/standalone e os modos sem identificar erros.
- O proximo passo recomendado e a validacao manual da extracao de `agendaSemanaBuildStandaloneUrl` e da abertura standalone da agenda semana.

## 21. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `frontend/app.js`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `docs/fase_2_agenda_principal_subetapa_28_implementacao_agenda_semana_build_standalone_url.md`
- `docs/11_roadmap_desenvolvimento.md`
