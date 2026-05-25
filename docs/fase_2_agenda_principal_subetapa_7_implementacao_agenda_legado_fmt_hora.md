# Fase 2 - Agenda principal - Subetapa 7 - Implementacao minima do helper puro agendaLegadoFmtHora e validacao manual do impacto visual em lista e modal

## 1. Titulo da etapa
Implementacao minima do helper puro `agendaLegadoFmtHora` e validacao manual do impacto visual em lista e modal.

## 2. Objetivo
Extrair de forma minima e controlada o helper puro `agendaLegadoFmtHora` de `frontend/app.js` para o modulo ja existente `frontend/js/modules/agenda-principal-legado-utils.js`, preservando exatamente a semantica atual e sem alterar o comportamento visivel da agenda legado.

## 3. Escopo
Escopo desta subetapa:

- mover somente `agendaLegadoFmtHora`;
- manter exatamente a mesma semantica atual;
- reutilizar o modulo ja criado para helpers puros da agenda principal/legado;
- remover apenas a definicao local duplicada em `frontend/app.js`;
- registrar a alteracao documental no roadmap;
- validar sintaticamente os arquivos JS alterados;
- preparar o plano de teste manual do usuario.

## 4. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 5. Resumo das Subetapas 1, 2, 3, 4, 5 e 6
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

## 6. Helper extraido
Helper extraido nesta subetapa:

- `agendaLegadoFmtHora`

Semantica preservada:
- `parseInt(ms || 0, 10)` continua sendo a base da conversao;
- `Math.max(0, ...)` continua garantindo saturacao em zero;
- `Math.floor` continua sendo aplicado para horas e minutos;
- `padStart(2, "0")` continua garantindo o formato visual final;
- valores sem hora e sem minuto continuam retornando string vazia.

## 7. Arquivo de origem
Arquivo de origem da definicao removida:

- `frontend/app.js`

Localizacao aproximada anterior:

- por volta da linha `8379` no bloco de helpers de `agendaLegado`.

## 8. Arquivo de destino
Arquivo de destino utilizado para o helper:

- `frontend/js/modules/agenda-principal-legado-utils.js`

Padrao de exposicao:
- modulo IIFE;
- exportacao em `window.BranaAgendaPrincipalLegadoUtils`;
- exposicao direta de `window.agendaLegadoFmtHora` para manter a compatibilidade com as chamadas ja existentes em `frontend/app.js`.

## 9. Pontos de uso preservados
Pontos de uso mantidos sem alteracao:

- `agendaLegadoRender` continua usando `agendaLegadoFmtHora` na tabela da agenda legado;
- `agendaLegadoModalPreencher` continua usando `agendaLegadoFmtHora` para inicio e fim no modal;
- `agendaLegadoSincronizarFimPorDuracao` continua usando `agendaLegadoFmtHora`;
- `agendaSemanaEventoTexto` e `agendaSemanaEventoTextoDia` continuam usando `agendaLegadoFmtHora`;
- `agendaSemanaRenderEventos` continua usando `agendaLegadoFmtHora` ao montar o texto e os dados de exibicao.

## 10. Semantica preservada
Foi preservado o comportamento original:

- horarios validos continuam sendo formatados em `HH:MM`;
- valores vazios continuam retornando string vazia;
- valores `0` continuam retornando string vazia;
- valores numericos e strings numericas continuam seguindo a mesma conversao;
- nao houve ajuste de regra;
- nao houve ajuste visual;
- nao houve ajuste textual.

## 11. Confirmacao sobre parseInt
Confirmado:
- `parseInt(ms || 0, 10)` permanece no helper extraido;
- a base numerica continua identica ao comportamento anterior.

## 12. Confirmacao sobre padStart
Confirmado:
- `padStart(2, "0")` permanece no helper extraido;
- o formato de dois digitos continua identico ao comportamento anterior.

## 13. Confirmacao sobre formato de horario
Confirmado:
- o formato final continua sendo `HH:MM`;
- a renderizacao visivel da agenda legado continua dependente desse mesmo padrao.

## 14. Arquivos alterados
Arquivos alterados nesta subetapa:

- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_7_implementacao_agenda_legado_fmt_hora.md`
- `docs/11_roadmap_desenvolvimento.md`

## 15. Arquivos nao alterados
Nao foram alterados:

- `frontend/index.html`;
- backend;
- banco;
- schema;
- migrations;
- seeds;
- endpoints;
- permissoes;
- `Agenda de contatos`;
- qualquer outro helper;
- qualquer fluxo de salvamento, edicao, exclusao, modal, lista, payload, recorrencia ou Google Calendar.

## 16. Riscos tecnicos
Riscos tecnicos identificados:

- alterar a representacao textual de hora em lista e modal caso a semantica nao seja mantida exatamente;
- quebrar expectativas em `0`, valores parciais ou strings numericas;
- introduzir divergencia entre exibicao da tabela e do modal se a formula nao for preservada;
- gerar regressao visual sem impacto de sintaxe.

Mitigacao aplicada:
- o helper foi movido sem alterar a logica;
- o modulo ja existia e ja era carregado antes de `frontend/app.js`;
- `frontend/index.html` nao precisou ser alterado nesta etapa.

## 17. Validacao tecnica executada
Validacao tecnica executada nesta subetapa:

- conferencia dos pontos de uso de `agendaLegadoFmtHora` em `frontend/app.js`;
- conferencia de que `frontend/js/modules/agenda-principal-legado-utils.js` ja carregava antes de `frontend/app.js`;
- remocao somente da definicao local duplicada em `frontend/app.js`;
- preservacao da assinatura e do formato visual do helper.

Checks a executar:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`

## 18. Plano de teste manual para o usuario
Depois da entrega, o usuario deve testar:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Verificar a listagem de agendamentos com horarios exibidos.
4. Abrir um agendamento existente e confirmar que o horario continua no mesmo formato visual de antes.
5. Criar um novo agendamento com horario definido.
6. Salvar.
7. Editar o agendamento criado.
8. Confirmar que o horario continua em formato `HH:MM`.
9. Salvar novamente.
10. Confirmar que `Agenda do dia` continua abrindo.
11. Confirmar que `Agenda da semana` continua abrindo.
12. Confirmar que `Proximo agendado` continua aparecendo sem erro.
13. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 19. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- alterar `agendaLegadoNumOrNull`;
- alterar qualquer outro helper;
- extrair outro candidato;
- alterar salvamento;
- alterar edicao;
- alterar exclusao;
- alterar modal;
- alterar renderizacao;
- alterar lista;
- alterar payload;
- alterar recorrencia;
- alterar Google Calendar;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper extraido.

## 20. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 8 - Validacao manual da extracao de agendaLegadoFmtHora e revisao do impacto visual na agenda legado`

## 21. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 22. Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A segunda extracao minima de helper puro foi concluida.
- O helper extraido foi `agendaLegadoFmtHora`.
- `agendaLegadoNumOrNull` nao foi alterado.
- `frontend/index.html` nao foi alterado nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a validacao manual da extracao de `agendaLegadoFmtHora` no impacto visual da agenda legado.

## 23. Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_7_implementacao_agenda_legado_fmt_hora.md`
- `docs/11_roadmap_desenvolvimento.md`

