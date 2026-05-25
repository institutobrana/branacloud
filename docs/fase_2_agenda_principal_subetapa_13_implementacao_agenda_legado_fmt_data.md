# Fase 2 - Agenda principal - Subetapa 13 - Implementacao minima do helper puro agendaLegadoFmtData e validacao manual do impacto visual na tabela da agenda legado

## 1. Titulo da etapa
Implementacao minima do helper puro `agendaLegadoFmtData` e validacao manual do impacto visual na tabela da agenda legado.

## 2. Objetivo
Extrair de forma minima e controlada o helper puro `agendaLegadoFmtData` de `frontend/app.js` para o modulo ja existente `frontend/js/modules/agenda-principal-legado-utils.js`, preservando exatamente a semantica atual e sem alterar o comportamento visivel da tabela/lista da agenda legado.

## 3. Escopo
Escopo desta subetapa:

- mover somente `agendaLegadoFmtData`;
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

## 5. Resumo das Subetapas 1 a 12
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

## 6. Helper extraido
Helper extraido nesta subetapa:

- `agendaLegadoFmtData`

Semantica preservada:
- valores vazios continuam retornando string vazia;
- `null` e `undefined` continuam sendo tratados como vazio;
- datas validas continuam sendo formatadas com `toLocaleDateString("pt-BR")`;
- datas invalidas continuam retornando o texto original.

## 7. Arquivo de origem
Arquivo de origem da definicao removida:

- `frontend/app.js`

Localizacao aproximada anterior:

- por volta da linha `8391` no bloco de helpers de `agendaLegado`.

## 8. Arquivo de destino
Arquivo de destino utilizado para o helper:

- `frontend/js/modules/agenda-principal-legado-utils.js`

Padrao de exposicao:
- modulo IIFE;
- exportacao em `window.BranaAgendaPrincipalLegadoUtils`;
- exposicao direta de `window.agendaLegadoFmtData` para manter a compatibilidade com as chamadas ja existentes em `frontend/app.js`.

## 9. Pontos de uso preservados
Pontos de uso mantidos sem alteracao:

- `agendaLegadoRender` continua usando `agendaLegadoFmtData` na tabela/lista da agenda legado;
- os pontos de chamada continuam os mesmos;
- nao houve mudanca de regra ou de fluxo.

## 10. Semantica preservada
Foi preservado o comportamento original:

- valores vazios continuam produzindo string vazia;
- `null` e `undefined` continuam se comportando como vazio;
- datas validas continuam sendo formatadas com `toLocaleDateString("pt-BR")`;
- datas invalidas continuam retornando o texto original;
- nao houve ajuste de regra;
- nao houve ajuste visual;
- nao houve ajuste textual.

## 11. Confirmacao sobre formato visual de data
Confirmado:
- o formato visual da tabela/lista continua sendo o mesmo padrao `pt-BR` usado antes da extracao;
- a exibicao na agenda legado continua dependente desse mesmo formato.

## 12. Confirmacao sobre locale pt-BR
Confirmado:
- a locale `pt-BR` continua sendo utilizada no helper extraido;
- nao houve mudanca de locale.

## 13. Confirmacao sobre Date/toLocaleDateString
Confirmado:
- a funcao continua usando `new Date(String(valor))`;
- a funcao continua usando `toLocaleDateString("pt-BR")`;
- a saida visual continua seguindo esse mesmo comportamento.

## 14. Confirmacao sobre tratamento de null/undefined/vazio
Confirmado:
- `null`, `undefined` e string vazia continuam retornando string vazia;
- nao houve mudanca nesse comportamento.

## 15. Confirmacao sobre fallback/texto original para data invalida
Confirmado:
- quando a data nao e valida, o helper continua retornando o texto original;
- esse fallback permanece inalterado.

## 16. Arquivos alterados
Arquivos alterados nesta subetapa:

- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_13_implementacao_agenda_legado_fmt_data.md`
- `docs/11_roadmap_desenvolvimento.md`

## 17. Arquivos nao alterados
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
- `agendaLegadoFmtDataInput`;
- qualquer outro helper;
- qualquer fluxo de salvamento, edicao, exclusao, modal, lista, tabela, payload, recorrencia ou Google Calendar.

## 18. Riscos tecnicos
Riscos tecnicos identificados:

- alterar a exibicao da data na tabela/lista da agenda legado;
- quebrar a expectativa de `pt-BR` se a locale nao for preservada;
- introduzir divergencia entre datas validas e texto original quando a entrada for invalida;
- afetar comparacao visual de registros na lista;
- gerar regressao visual discreta, mas importante, na tabela.

Mitigacao aplicada:
- o helper foi movido sem alterar a logica;
- o modulo ja existia e ja era carregado antes de `frontend/app.js`;
- `frontend/index.html` nao precisou ser alterado nesta etapa.

## 19. Validacao tecnica executada
Validacao tecnica executada nesta subetapa:

- conferencia dos pontos de uso de `agendaLegadoFmtData` em `frontend/app.js`;
- conferencia de que `frontend/js/modules/agenda-principal-legado-utils.js` ja carregava antes de `frontend/app.js`;
- remocao somente da definicao local duplicada em `frontend/app.js`;
- preservacao da assinatura e do formato visual do helper.

Checks a executar:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`

## 20. Plano de teste manual para o usuario
Depois da entrega, o usuario deve testar:

1. Abrir a `Agenda principal`.
2. Abrir a `Agenda legado`.
3. Verificar a listagem/tabela de agendamentos com datas exibidas.
4. Confirmar que as datas aparecem no mesmo formato visual de antes.
5. Abrir um agendamento existente.
6. Confirmar que a data relacionada ao agendamento segue coerente com a listagem.
7. Criar um novo agendamento com data definida.
8. Salvar.
9. Verificar a data exibida na tabela/lista apos salvar.
10. Editar o agendamento criado.
11. Salvar novamente.
12. Confirmar que a data exibida na tabela/lista permanece correta.
13. Confirmar que `Agenda do dia` continua abrindo.
14. Confirmar que `Agenda da semana` continua abrindo.
15. Confirmar que `Proximo agendado` continua aparecendo sem erro.
16. Verificar se nao aparece `ReferenceError`, `TypeError` ou erro novo no console do navegador.

## 21. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- alterar `agendaLegadoNumOrNull`;
- alterar `agendaLegadoFmtHora`;
- alterar `agendaLegadoFmtDataInput`;
- alterar qualquer outro helper;
- extrair outro candidato;
- alterar salvamento;
- alterar edicao;
- alterar exclusao;
- alterar modal;
- alterar renderizacao;
- alterar lista;
- alterar tabela;
- alterar payload;
- alterar recorrencia;
- alterar Google Calendar;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints/permissoes;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- alterar comportamento funcional fora da compatibilidade do helper extraido.

## 22. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 14 - Validacao manual da extracao de agendaLegadoFmtData e revisao do impacto visual na tabela da agenda legado`

## 23. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## 24. Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A quarta extracao minima de helper puro foi concluida.
- O helper extraido foi `agendaLegadoFmtData`.
- `agendaLegadoNumOrNull` nao foi alterado.
- `agendaLegadoFmtHora` nao foi alterado.
- `agendaLegadoFmtDataInput` nao foi alterado.
- `frontend/index.html` nao foi alterado nesta etapa.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum backend, banco, schema, migrations, seeds, endpoints ou permissoes foi alterado.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e a validacao manual da extracao de `agendaLegadoFmtData` no impacto visual na tabela da agenda legado.

## 25. Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `frontend/app.js`
- `frontend/js/modules/agenda-principal-legado-utils.js`
- `docs/fase_2_agenda_principal_subetapa_13_implementacao_agenda_legado_fmt_data.md`
- `docs/11_roadmap_desenvolvimento.md`

