# Fase 2 - Agenda principal - Subetapa 22 - Implementacao minima do helper puro agendaSemanaIsStandaloneRequest e validacao manual da abertura standalone da agenda semana

## 1. Objetivo
Extrair minimamente o helper puro `agendaSemanaIsStandaloneRequest` de `frontend/app.js` para um modulo proprio da `Agenda semana`, preservando exatamente a semantica atual de abertura standalone e sem alterar o comportamento da navegacao.

## 2. Escopo
Escopo desta subetapa:

- mover somente `agendaSemanaIsStandaloneRequest` para um novo modulo proprio;
- manter os pontos de uso existentes;
- preservar a semantica atual de leitura da querystring;
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

## 4. Resumo das Subetapas 1 a 21
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

## 5. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `docs/fase_2_agenda_principal_subetapa_21_plano_setimo_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/fase_2_agenda_principal_subetapa_3_plano_primeiro_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_18_plano_sexto_helper_puro.md`
- `docs/fase_2_agenda_principal_subetapa_19_implementacao_agenda_legado_range_semana.md`
- `docs/fase_2_agenda_principal_subetapa_20_validacao_agenda_legado_range_semana.md`

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
- compatibilidade com o dominio funcional da agenda semana;
- tamanho da superficie afetada.

## 7. Mapa comparativo dos candidatos restantes

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Data/hora atual? | URL/querystring? | Dependencia visual no modal/lista/tabela/filtros? | Risco de regressao | Teste manual futuro | Adequado ao modulo atual? | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11008` | Detectar se a agenda da semana deve abrir em modo standalone | `window.location.search` | `boolean` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta abertura | Medio | Sim, com query string | Nao, pede modulo proprio | **Sim, candidato recomendado** |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11017` | Ler o modo da agenda standalone pela query | `window.location.search` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta modo exibido | Medio | Sim, com query string | Nao, pede modulo proprio | Nao como setimo recorte |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11025` | Montar URL da agenda standalone | `modo`, `window.location.href` | `string` | Sim | Nao | Sim, `window.location` | Nao | Nao | Nao | Sim | Sim, afeta navegacao | Medio | Sim, conferindo URL gerada | Nao, pede modulo proprio | Nao como setimo recorte |
| `agendaLegadoParseDataInput` | `frontend/app.js:8379` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim, mas toca regra de saida do payload | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta salvar/editar | Medio | Sim, conferindo salvar/editar | Sim, cabe no modulo atual | Nao como setimo recorte |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8514` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta campo de hora | Medio | Sim, mas com mais cenario | Sim, cabe no modulo atual | Nao como setimo recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:8994` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback a helper global | Nao | Nao | Nao | Nao | Nao | Nao | Sim, afeta cor/visual | Medio | Sim, conferindo cor renderizada | Sim, cabe no modulo atual | Nao como setimo recorte |

## 8. Candidato recomendado para sétima implementacao futura
Candidato recomendado:

- `agendaSemanaIsStandaloneRequest`

## 9. Justificativa da escolha
A escolha de `agendaSemanaIsStandaloneRequest` e a mais equilibrada para o setimo recorte porque:

- e o recorte mais pequeno e isolado entre os candidatos restantes;
- faz apenas leitura booleana da querystring;
- nao tem escrita;
- nao depende de DOM;
- nao depende de backend;
- nao impacta visual direto;
- e mais simples do que `agendaSemanaStandaloneModeFromQuery`, `agendaSemanaBuildStandaloneUrl`, `agendaLegadoParseDataInput`, `agendaLegadoCoerceHoraTexto` e `agendaLegadoNormalizarHexCor`;
- embora dependa de URL/querystring, ainda e a menor unidade funcional restante da agenda semana;
- a fronteira futura fica naturalmente em um modulo proprio de navegacao/standalone da agenda semana.

Comparacao resumida:
- `agendaSemanaStandaloneModeFromQuery` e `agendaSemanaBuildStandaloneUrl` sao proximos, mas ja carregam mais regra de modo/URL do que o booleano de abertura;
- `agendaLegadoParseDataInput` toca diretamente a saida ISO usada para salvar, aumentando o risco operacional;
- `agendaLegadoCoerceHoraTexto` e mais complexa e ligada a interacao de digitacao/blur;
- `agendaLegadoNormalizarHexCor` tem fallback para helper externo e afeta cor/visual;
- `agendaSemanaIsStandaloneRequest` permanece o menor recorte util restante com impacto restrito a uma verificacao booleana de querystring.

## 10. Helper extraido
Helper extraido nesta subetapa:

- `agendaSemanaIsStandaloneRequest`

## 11. Arquivo de origem
Arquivo de origem:

- `frontend/app.js`

## 12. Arquivo de destino
Arquivo de destino:

- `frontend/js/modules/agenda-principal-semana-utils.js`

## 13. Justificativa do novo modulo
Justificativa do novo modulo:

- o helper pertence ao fluxo de `Agenda semana` / navegacao standalone;
- ele nao e um utilitario da `Agenda legado`;
- a fronteira tecnica e funcional e diferente da frente de agenda legado;
- a separacao em modulo proprio evita misturar responsabilidades de navegacao standalone com utilitarios do legado;
- o novo modulo permite manter a organizacao por dominio funcional sem contaminar `agenda-principal-legado-utils.js`.

## 14. Confirmacao de que nao foi usado agenda-principal-legado-utils.js
Confirmado:

- `frontend/js/modules/agenda-principal-legado-utils.js` nao foi usado como destino desta extracao;
- nenhum helper de agenda legado foi alterado nesta etapa;
- a nova responsabilidade ficou em modulo proprio.

## 15. Pontos de uso preservados
Pontos de uso preservados:

- `agendaSemanaIsStandaloneRequest()` continua sendo chamada nos mesmos pontos de `frontend/app.js`;
- a logica de abertura standalone continua usando o mesmo booleano de entrada;
- a navegacao e a renderizacao nao tiveram alteracao.

## 16. Semantica preservada
A semantica atual foi preservada:

- o helper continua baseado na leitura da querystring `window.location.search`;
- o parametro observado continua sendo `agenda_semana`;
- os valores aceitos continuam sendo `1`, `true` e `yes`;
- valores inesperados continuam retornando `false`;
- ausencia de parametro continua retornando `false`.

## 17. Confirmacao sobre parametro de querystring observado
Confirmado:

- o parametro observado continua sendo `agenda_semana`;
- nao houve mudanca para outro nome de parametro;
- a leitura continua via `URLSearchParams(window.location.search || "")`.

## 18. Confirmacao sobre valores aceitos
Confirmado:

- `agenda_semana=1` continua valido;
- `agenda_semana=true` continua valido;
- `agenda_semana=yes` continua valido;
- valores inesperados continuam sendo tratados como `false`.

## 19. Confirmacao sobre comportamento sem parametro
Confirmado:

- sem o parametro `agenda_semana`, o helper continua retornando `false`;
- nao houve mudanca nesse comportamento.

## 20. Confirmacao de que abertura standalone nao teve regra alterada
Confirmado:

- a regra de abertura standalone nao foi alterada;
- a extracao foi apenas do helper de deteccao booleana;
- nao houve mudanca de navegacao ou abertura visual.

## 21. Arquivos alterados
Arquivos alterados nesta etapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `docs/fase_2_agenda_principal_subetapa_22_implementacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`

## 22. Arquivos nao alterados
Arquivos nao alterados nesta etapa:

- `frontend/js/modules/agenda-principal-legado-utils.js`
- `agendaLegadoNumOrNull`
- `agendaLegadoFmtHora`
- `agendaLegadoFmtDataInput`
- `agendaLegadoFmtData`
- `agendaLegadoRangeHoje`
- `agendaLegadoRangeSemana`
- `agendaSemanaStandaloneModeFromQuery`
- `agendaSemanaBuildStandaloneUrl`
- `agendaLegadoParseDataInput`
- `agendaLegadoCoerceHoraTexto`
- `agendaLegadoNormalizarHexCor`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissoes

## 23. Fronteira exata da futura extracao
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

## 24. Se o helper deve entrar no modulo ja criado ou exigir novo modulo
O helper nao deve entrar no modulo ja criado de utilitarios da agenda legado.

Motivo:
- o helper pertence ao fluxo de `Agenda semana` e a navegacao standalone;
- a responsabilidade e diferente da agenda legado;
- a separacao adequada e um modulo proprio de agenda semana / standalone.

## 25. O que NAO deve entrar na futura extracao
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

## 26. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar a deteccao de abertura standalone da agenda semana;
- quebrar a expectativa de leitura de `agenda_semana` na URL;
- introduzir divergencia caso valores falsos/verdadeiros sejam interpretados de forma diferente;
- afetar a abertura da agenda semana em aba dedicada;
- gerar regressao de navegacao discreta, mas importante.

Risco geral:
- baixo, desde que a extracao preserve exatamente a semantica atual.

## 27. Validacao tecnica executada
Validacao tecnica executada nesta etapa:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-semana-utils.js`

## 28. Plano de teste manual para o usuario
Quando houver validacao manual futura, testar:

1. Abrir a `Agenda principal` normalmente.
2. Entrar na `Agenda semana` pelo fluxo normal.
3. Confirmar que a `Agenda semana` continua abrindo sem erro.
4. Abrir a `Agenda semana` em modo standalone, usando a querystring esperada.
5. Testar `agenda_semana=1`, `agenda_semana=true` e `agenda_semana=yes`.
6. Abrir a mesma rota sem o parametro `agenda_semana` e confirmar o comportamento esperado.
7. Confirmar que `Agenda legado` continua abrindo.
8. Confirmar que `Agenda do dia` continua abrindo.
9. Confirmar que `Proximo agendado` continua aparecendo sem erro.
10. Conferir console sem `ReferenceError` ou `TypeError`.

## 29. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper de forma diferente da semantica atual;
- criar novo helper alem de `agendaSemanaIsStandaloneRequest`;
- usar `agenda-principal-legado-utils.js` como destino;
- alterar `frontend/js/modules/agenda-principal-legado-utils.js`;
- alterar `agendaSemanaStandaloneModeFromQuery`;
- alterar `agendaSemanaBuildStandaloneUrl`;
- alterar helpers de agenda legado;
- alterar `frontend/index.html` para alem de incluir o novo modulo antes de `frontend/app.js`;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper escolhido.

## 30. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 23 - Validacao manual da extracao de agendaSemanaIsStandaloneRequest e revisao da abertura standalone da agenda semana`

## 31. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 32. Registro para roadmap
- A Subetapa 22 foi concluida como implementacao minima do setimo helper puro.
- O helper extraido foi `agendaSemanaIsStandaloneRequest`.
- Foi criado o modulo proprio `frontend/js/modules/agenda-principal-semana-utils.js`.
- `frontend/index.html` foi alterado apenas para carregar o novo modulo antes de `frontend/app.js`.
- `agenda-principal-legado-utils.js` nao foi usado como destino desta extracao.
- Nenhum helper de agenda legado foi alterado.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a validacao manual da abertura standalone da agenda semana.

## 33. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-principal-semana-utils.js`
- `docs/fase_2_agenda_principal_subetapa_22_implementacao_agenda_semana_is_standalone_request.md`
- `docs/11_roadmap_desenvolvimento.md`
