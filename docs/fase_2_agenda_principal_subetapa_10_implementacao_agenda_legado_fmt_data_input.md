# Fase 2 - Agenda principal - Subetapa 10 - Implementacao minima do helper puro agendaLegadoFmtDataInput e validacao manual do impacto visual no modal de agenda legado

## 1. Titulo da etapa
Implementacao minima do helper puro `agendaLegadoFmtDataInput` e validacao manual do impacto visual no modal de agenda legado.

## 2. Objetivo
Extrair de forma minima e controlada o helper puro `agendaLegadoFmtDataInput` de `frontend/app.js` para o modulo ja existente `frontend/js/modules/agenda-principal-legado-utils.js`, preservando exatamente a semantica atual e sem alterar o comportamento visivel do modal e da abertura de novo agendamento na agenda legado.

## 3. Escopo
Escopo desta subetapa:

- mover somente `agendaLegadoFmtDataInput`;
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

## 5. Resumo das Subetapas 1, 2, 3, 4, 5, 6, 7, 8 e 9
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

## 6. Helper extraido
Helper extraido nesta subetapa:

- `agendaLegadoFmtDataInput`

Semantica preservada:
- strings vazias continuam retornando string vazia;
- `null` e `undefined` continuam sendo tratados como vazio;
- strings no formato `dd/mm/aaaa` continuam retornando o proprio valor;
- strings no formato `aaaa-mm-dd` continuam sendo convertidas para `dd/mm/aaaa`;
- datas genericas continuam passando por `Date(txt)` e, quando validas, sao convertidas para `dd/mm/aaaa`;
- quando a data nao e valida, o texto original continua sendo devolvido.

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
- exposicao direta de `window.agendaLegadoFmtDataInput` para manter a compatibilidade com as chamadas ja existentes em `frontend/app.js`.

## 9. Pontos de uso preservados
Pontos de uso mantidos sem alteracao:

- `agendaLegadoModalPreencher` continua usando `agendaLegadoFmtDataInput` para preencher o campo de data do modal;
- `agendaSemanaAbrirModalNovo` continua usando `agendaLegadoFmtDataInput` ao abrir novo agendamento;
- os pontos de chamada continuam os mesmos;
- nao houve mudanca de regra ou de fluxo.

## 10. Semantica preservada
Foi preservado o comportamento original:

- campos com valor vazio continuam produzindo string vazia;
- `null` e `undefined` continuam se comportando como vazio;
- `dd/mm/aaaa` continua sendo mantido como entrada valida;
- `aaaa-mm-dd` continua sendo convertido para `dd/mm/aaaa`;
- datas genericas continuam sendo tratadas com `Date`;
- quando a data nao e valida, o texto original continua sendo retornado;
- nao houve ajuste de regra;
- nao houve ajuste visual;
- nao houve ajuste textual.

## 11. Confirmacao sobre formato de entrada aceito
Confirmado:
- a funcao continua aceitando `dd/mm/aaaa`;
- a funcao continua aceitando `aaaa-mm-dd`;
- a funcao continua aceitando outros textos que possam ser interpretados por `Date(txt)`.

## 12. Confirmacao sobre formato final retornado/preenchido
Confirmado:
- o formato final continua sendo `dd/mm/aaaa`;
- esse valor continua sendo usado para preencher o campo de data do modal.

## 13. Confirmacao sobre tratamento de null/undefined/vazio
Confirmado:
- `null`, `undefined` e string vazia continuam retornando string vazia;
- nao houve mudanca nesse comportamento.

## 14. Confirmacao sobre uso de Date ou manipulacao de string
Confirmado:
- a funcao continua usando manipulacao de string via `String(valor).trim()`, regex e `split("-")` / `split("/")`;
- a funcao continua usando `new Date(txt)` para a rota generica;
- a conversao final continua usando `padStart` para dia e mes quando a data generica e valida.

## 15. Arquivos alterados
Arquivos alterados nesta subetapa:

- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_10_implementacao_agenda_legado_fmt_data_input.md`
- `docs/11_roadmap_desenvolvimento.md`

## 16. Arquivos nao alterados
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
- `agendaLegadoNumOrNull`;
- `agendaLegadoFmtHora`;
- qualquer outro helper;
- qualquer fluxo de salvamento, edicao, exclusao, modal, lista, payload, recorrencia ou Google Calendar.

## 17. Riscos tecnicos
Riscos tecnicos identificados:

- alterar o preenchimento do campo de data do modal;
- quebrar a abertura de novo agendamento quando a data vem de `dataIso`;
- introduzir divergencia entre `dd/mm/aaaa` e `aaaa-mm-dd` se a semantica nao for preservada;
- afetar casos em que a funcao recebe texto generico nao valido;
- gerar regressao visual discreta no fluxo de agenda legado.

Mitigacao aplicada:
- o helper foi movido sem alterar a logica;
- o modulo ja existia e ja era carregado antes de `frontend/app.js`;
- `frontend/index.html` nao precisou ser alterado nesta etapa.

## 18. Validacao tecnica executada
Validacao tecnica executada nesta subetapa:

- conferencia dos pontos de uso de `agendaLegadoFmtDataInput` em `frontend/app.js`;
- conferencia de que `frontend/js/modules/agenda-principal-legado-utils.js` ja carregava antes de `frontend/app.js`;
- remocao somente da definicao local duplicada em `frontend/app.js`;
- preservacao da assinatura e do formato visual do helper.

Checks a executar:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`

## 19. Plano de teste manual para o usuario
Depois da entrega, o usuario deve testar:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Abrir um agendamento existente.
4. Conferir o campo de data no modal.
5. Confirmar que a data aparece no mesmo formato visual de antes.
6. Abrir um novo agendamento.
7. Conferir o preenchimento inicial do campo de data.
8. Criar um novo agendamento com data definida.
9. Salvar.
10. Editar o agendamento criado.
11. Confirmar que a data permanece no formato esperado.
12. Salvar novamente.
13. Confirmar que a tabela/listagem da agenda legado continua intacta.
14. Confirmar que `Agenda do dia` continua abrindo.
15. Confirmar que `Agenda da semana` continua abrindo.
16. Confirmar que `Próximo agendado` continua aparecendo sem erro.
17. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 20. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- alterar `agendaLegadoNumOrNull`;
- alterar `agendaLegadoFmtHora`;
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

## 21. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 11 - Validacao manual da extracao de agendaLegadoFmtDataInput e revisao do impacto visual no modal de agenda legado`

## 22. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 23. Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A terceira extracao minima de helper puro foi concluida.
- O helper extraido foi `agendaLegadoFmtDataInput`.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `frontend/index.html` nao foi alterado nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a validacao manual da extracao de `agendaLegadoFmtDataInput` no impacto visual do modal da agenda legado.

## 24. Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_10_implementacao_agenda_legado_fmt_data_input.md`
- `docs/11_roadmap_desenvolvimento.md`

