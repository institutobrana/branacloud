# Fase 2 - Agenda principal - Subetapa 3 - Plano documental do primeiro helper puro candidato, com avaliacao de risco e fronteira de extracao

## 1. Objetivo
Documentar, sem alterar codigo, a avaliacao dos candidatos a helper puro identificados na Subetapa 2 e registrar um unico primeiro recorte recomendado para futura implementacao minima.

Esta etapa nao autoriza patch, nao escolhe mais de um helper e nao inicia modularizacao funcional.

## 2. Escopo
Escopo desta subetapa:

- reavaliar os candidatos a helper puro listados na Subetapa 2;
- comparar pureza, dependencias e risco;
- escolher documentalmente apenas um primeiro candidato;
- registrar fronteira exata para futura extracao;
- registrar o que nao deve entrar na futura extracao;
- atualizar o roadmap apenas com registro objetivo.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo das Subetapas 1 e 2
Subetapa 1:
- definiu o contrato funcional inicial da `Agenda principal`;
- registrou fronteiras com agenda do dia, semana, proximo agendado, avisos, configuracao de agendas, recorrencia, Google Calendar e agenda legado;
- deixou claro que `Agenda de contatos` permanece consolidada;
- nao alterou codigo.

Subetapa 2:
- mapeou os fluxos de abertura;
- documentou modos dia/semana;
- documentou proximo agendado, quadro de avisos, configuracao de agendas e fronteira com agenda legado;
- classificou os fluxos em visual, orquestracao, leitura/escrita e backend;
- nao alterou codigo.

Esta Subetapa 3 apenas escolhe documentalmente o primeiro helper puro candidato para futura implementacao minima.

## 5. Arquivos analisados
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/agenda_contatos_routes.py`

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
- tamanho da superficie afetada;
- previsibilidade da saida.

## 7. Mapa comparativo dos candidatos

| Candidato | Localizacao aproximada | Finalidade aparente | Entradas | Saidas | Pura? | DOM? | Estado global? | Backend? | Tenant / permissoes? | Risco de regressao | Teste manual futuro | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `agendaSemanaIsStandaloneRequest` | `frontend/app.js:11052` | Detectar abertura standalone da agenda | `window.location.search` | `boolean` | Nao, depende do browser | Nao | Sim, `window.location` | Nao | Nao | Medio, afeta abertura inicial | Sim, com query string | Nao como primeiro recorte |
| `agendaSemanaStandaloneModeFromQuery` | `frontend/app.js:11061` | Ler modo dia/semana/clinica da query | `window.location.search` | `string` | Nao, depende do browser | Nao | Sim, `window.location` | Nao | Nao | Medio, afeta modo exibido | Sim, com query string | Nao como primeiro recorte |
| `agendaSemanaBuildStandaloneUrl` | `frontend/app.js:11069` | Montar URL de agenda standalone | `modo`, `window.location.href` | `string` URL | Parcial, mas depende do browser | Nao | Sim, `window.location` | Nao | Nao | Medio, afeta navegacao | Sim, comparando URL gerada | Nao como primeiro recorte |
| `agendaLegadoRangeHoje` | `frontend/app.js:8929` | Montar faixa de hoje | data atual | `{inicio,fim}` | Parcial, mas temporal | Nao | Sim, tempo atual | Nao | Nao | Baixo a medio | Sim, abrindo botao Hoje | Talvez, mas nao e o primeiro |
| `agendaLegadoRangeSemana` | `frontend/app.js:8934` | Montar faixa de 7 dias | data atual | `{inicio,fim}` | Parcial, mas temporal | Nao | Sim, tempo atual | Nao | Nao | Baixo a medio | Sim, abrindo botao Semana | Talvez, mas nao e o primeiro |
| `agendaLegadoFmtHora` | `frontend/app.js:8383` | Formatar milissegundos em `HH:MM` | `ms` | `string` | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo lista e modal | Sim, mas nao o primeiro |
| `agendaLegadoFmtDataInput` | `frontend/app.js:8390` | Converter data para formato de input | `valor` | `dd/mm/aaaa` ou texto | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo modal | Sim, mas nao o primeiro |
| `agendaLegadoParseDataInput` | `frontend/app.js:8405` | Converter input de data para ISO | `valor` | `aaaa-mm-dd` ou vazio | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo modal | Sim, mas nao o primeiro |
| `agendaLegadoFmtData` | `frontend/app.js:8417` | Formatar data para exibicao | `valor` | `string` em `pt-BR` | Sim | Nao | Nao | Nao | Nao | Baixo | Sim, conferindo tabela | Sim, mas nao o primeiro |
| `agendaLegadoNumOrNull` | `frontend/app.js:7682` | Converter valor numerico ou null | `value` | numero truncado ou `null` | Sim | Nao | Nao | Nao | Nao | Muito baixo | Sim, conferindo payload | **Sim, candidato recomendado** |
| `agendaLegadoCoerceHoraTexto` | `frontend/app.js:8546` | Normalizar horas de input/blur | `value`, flags de formato | `HH:MM` ou vazio | Sim, mas mais complexa | Nao | Nao | Nao | Nao | Medio, porque mexe em digitação | Sim, mas exige mais cenario | Nao como primeiro recorte |
| `agendaLegadoNormalizarHexCor` | `frontend/app.js:9031` | Normalizar cor hex | `value` | `#rrggbb` ou vazio | Parcial, possui fallback para helper global | Nao | Nao | Nao | Nao | Medio, por afetar cor/status | Sim, conferindo cor renderizada | Nao como primeiro recorte |

## 8. Candidato recomendado para primeira implementacao futura
Candidato recomendado:

- `agendaLegadoNumOrNull`

## 9. Justificativa da escolha
A escolha de `agendaLegadoNumOrNull` e a mais segura para o primeiro recorte porque:

- e a menor funcao da lista;
- e puramente deterministica;
- nao depende de DOM;
- nao depende de estado global;
- nao depende de backend;
- nao depende de tenant/clinica_id;
- nao depende de permissao;
- nao produz alteracao visual;
- e usada como conversao simples de payload, com risco de regressao muito baixo;
- e facil de testar manualmente em fluxo de salvar/editar da agenda legado;
- reduz o risco de introduzir efeito colateral em entrada de data, hora, cor ou navegacao.

Comparacao resumida:
- candidatos de `agendaSemana*` dependem de browser/navegacao;
- candidatos de data/hora sao puros, mas mais complexos ou mais expostos a fluxos de entrada;
- `agendaLegadoNormalizarHexCor` tem dependencia opcional de helper global;
- `agendaLegadoNumOrNull` e o recorte mais pequeno e mais isolado.

## 10. Fronteira exata da futura extracao
Fronteira futura pretendida:

- extrair apenas a logica de conversao numerica de `agendaLegadoNumOrNull`;
- manter o mesmo comportamento atual:
  - `Number(value)`;
  - `Math.trunc(n)` quando o numero e finito;
  - `null` quando nao for finito.

Fronteira funcional:
- apenas conversao de valor;
- sem DOM;
- sem leitura de URL;
- sem integracao com backend;
- sem selecao de tela;
- sem modal;
- sem evento;
- sem alteracao de renderizacao.

## 11. O que NAO deve entrar na futura extracao
Nao devem entrar na futura extracao:

- `agendaLegadoModalPayload`;
- `agendaLegadoSalvarModal`;
- `agendaLegadoExcluir`;
- `agendaLegadoColetarRepeticaoConfig`;
- `agendaLegadoCoerceHoraTexto`;
- `agendaLegadoFmtHora`;
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

## 12. Riscos da futura extracao
Riscos tecnicos da futura extracao:

- alterar silenciosamente a diferenca entre `null` e numero valido;
- afetar payload de tipo/status da agenda legado;
- introduzir comportamento diferente em edicao versus criacao;
- quebrar casos onde strings numericas devem virar inteiro truncado;
- afetar validacoes de backend que esperam valor numerico ou `null`.

Risco geral:
- baixo, desde que a extração mantenha exatamente a semântica atual.

## 13. Plano minimo de teste manual para quando houver implementacao
Quando houver implementacao futura, testar manualmente:

1. Abrir `Agenda principal` e entrar na `agenda-legado`.
2. Criar um agendamento novo com campos numericos ligados a `tipo` e `status`.
3. Editar um agendamento existente e confirmar que o payload continua coerente.
4. Salvar com valores vazios para verificar se continuam virando `null`.
5. Salvar com valores numericos em string para verificar truncamento igual ao atual.
6. Conferir que a abertura da agenda do dia, semana e proximo agendado continua igual.
7. Conferir console sem `ReferenceError` ou `TypeError`.

## 14. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- implementar o helper;
- criar novo arquivo JS;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules`;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento de agenda semana, Google Calendar ou recorrencia;
- alterar qualquer fluxo de DOM ou renderizacao.

## 15. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 4 - Implementacao minima do helper puro agendaLegadoNumOrNull e validacao manual do fluxo de agenda legado`

## 16. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao de textos visiveis, labels, placeholders, acentos ou mojibake.

Se houver texto estranho ou corrompido em arquivos lidos, isso deve ser apenas registrado como pendencia futura, sem qualquer correcao nesta etapa.

## 17. Registro para roadmap
- Subetapa 3 criada documentalmente para `Agenda principal`.
- Os candidatos a helper puro foram reavaliados.
- O primeiro helper recomendado para futura implementacao foi `agendaLegadoNumOrNull`.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi implementado.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 4 - Implementacao minima do helper puro agendaLegadoNumOrNull e validacao manual do fluxo de agenda legado`.

## 18. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_3_plano_primeiro_helper_puro.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
