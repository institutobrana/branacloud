# Agenda principal - Subetapa 5 - Validacao manual da extracao do helper agendaLegadoNumOrNull e revisao do primeiro impacto funcional

## Objetivo
Registrar a validacao tecnica da primeira extracao minima feita na Subetapa 4, confirmando que o helper `agendaLegadoNumOrNull` segue disponivel para `frontend/app.js`, que a ordem de carregamento continua correta e que nao houve regressao direta observavel nesta revisao.

## Escopo
Esta etapa e documental, com verificacao tecnica e revisao de impacto funcional da extracao ja realizada.

Nao ha nova extracao.
Nao ha novo helper.
Nao ha novo patch funcional.
Nao ha alteracao de comportamento, salvo eventual correcao minima de regressao direta, que nao foi necessaria nesta revisao.

## Confirmacao de que Agenda principal e core / comum
`Agenda principal` continua tratada como `core / comum`, sem classificacao por area profissional, sem multiarea e sem flags de segregacao.

## Resumo das Subetapas 1, 2, 3 e 4
- Subetapa 1: definiu contrato funcional e fronteiras documentais da frente.
- Subetapa 2: mapeou os fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteira com agenda legado.
- Subetapa 3: avaliou candidatos de helper puro e escolheu `agendaLegadoNumOrNull` como primeiro recorte futuro.
- Subetapa 4: extraiu minimamente `agendaLegadoNumOrNull` para `frontend/js/modules/agenda-principal-legado-utils.js`, preservando a semantica.

## Revisao tecnica da extracao
A revisao desta subetapa confirma que:
- o helper `agendaLegadoNumOrNull` permanece disponivel para `frontend/app.js` via o modulo carregado antes dele;
- `frontend/app.js` nao manteve definicao local duplicada do helper;
- os pontos de uso continuam os mesmos;
- a semantica continua consistente com a implementacao anterior;
- nao houve impacto em salvamento, edicao, exclusao, modal, renderizacao, recorrencia, Google Calendar, permissoes ou backend.

## Confirmacao da ordem de carregamento em frontend/index.html
O carregamento segue com o modulo `frontend/js/modules/agenda-principal-legado-utils.js` antes de `frontend/app.js`, mantendo o padrao necessario para disponibilidade global do helper.

## Confirmacao da ausencia de duplicidade em frontend/app.js
Nao existe definicao duplicada de `agendaLegadoNumOrNull` em `frontend/app.js`; o arquivo apenas consome o helper exposto pelo modulo.

## Confirmacao dos pontos de uso preservados
Os pontos de uso continuam preservados nas atribuicoes relacionadas a `tipo` e `status` do fluxo de agenda legado, sem alteracao de regra ou de fluxo.

## Resultado dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/agenda-principal-legado-utils.js`: OK

## Roteiro de validacao manual para o usuario
Antes de prosseguir, o usuario deve testar:
1. Abrir a Agenda principal.
2. Abrir a Agenda legado.
3. Criar um agendamento na agenda legado.
4. Salvar com campos tipo/status preenchidos, se existirem.
5. Editar o mesmo agendamento.
6. Salvar novamente.
7. Testar salvar com campos tipo/status vazios, se possivel.
8. Confirmar que Agenda do dia continua abrindo.
9. Confirmar que Agenda da semana continua abrindo.
10. Confirmar que Proximo agendado continua aparecendo sem erro.
11. Verificar se nao aparece erro no console do navegador.

## Riscos residuais
- Divergencia futura entre `null` e numero inteiro caso novas regras de agenda legado sejam adicionadas sem revisao da funcao pura.
- Regressoes pontuais de integracao se o padrao de carregamento de modulos for alterado em etapas futuras.
- Pequena area de risco ligada a campos numericos de agenda legado, ainda que a semantica atual tenha sido preservada nesta validacao.

## Itens explicitamente fora do escopo
- Nova extracao de helper.
- Alteracao de salvamento, edicao, exclusao, modal, renderizacao, recorrencia ou Google Calendar.
- Alteracao de backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Reabertura da Agenda de contatos.
- Correcao de textos visiveis ou de mojibake.

## Proxima subetapa recomendada
`Agenda principal - Subetapa 6 - Planejamento documental do segundo helper puro de menor risco, com reavaliacao de fronteira e sem implementacao imediata`

## Blindagem textual/mojibake
Esta etapa respeita integralmente a blindagem textual/mojibake. Nenhum texto visivel foi corrigido, nenhuma label foi alterada e nenhum possivel mojibake foi tratado como ajuste funcional.

Se surgir texto estranho ou quebrado em revisoes futuras, ele deve ser apenas registrado como pendencia futura, sem correcao nesta linha de modularizacao.

## Registro para roadmap
- `Agenda principal` segue como `core / comum`.
- A Subetapa 5 foi concluida como validacao e revisao de impacto da extracao anterior.
- Nenhuma nova extracao foi realizada.
- Nenhuma alteracao funcional nova foi aplicada.
- `agendaLegadoNumOrNull` permanece como primeira extracao minima da frente.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhuma alteracao de backend, banco, schema, migrations, seeds, endpoints ou permissoes foi realizada.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o planejamento documental do segundo helper puro de menor risco.

## Commit seletivo obrigatorio
Se este documento for o unico artefato novo junto da atualizacao do roadmap, o commit deve ser seletivo apenas para:
- `docs/fase_2_agenda_principal_subetapa_5_validacao_agenda_legado_num_or_null.md`
- `docs/11_roadmap_desenvolvimento.md`

