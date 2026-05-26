# Fase 2B - Convenios e Planos - Implementacao minima da lista principal e contadores

## Objetivo da etapa
- Implementar o primeiro recorte medio controlado da Fase 2B em `Convenios e Planos`.
- Delegar para o modulo passivo existente apenas a renderizacao visual/local da lista principal e dos contadores de convenios e planos.
- Manter calendario, modais, salvar, excluir, payload e `requestJson` fora do recorte.

## Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/convenios-planos.js`
- `docs/fase_2b_convenios_planos_lista_contadores_implementacao_minima.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes tocadas
- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanStatusDotV2(inativo)` permanece como formatacao de apoio visual
- `convPlanCurrentConvenioV2()` como apoio local de selecao
- `convPlanCurrentPlanoV2()` como apoio local de selecao

## Helpers criados ou ajustados
- `escHtml(valor)`
- `montarLinhasConvenios(lista, selectedId, statusFormatter)`
- `montarLinhasPlanos(lista, convenioSelecionadoId, selectedPlanoId, statusFormatter)`

## O que saiu parcialmente do app.js
- Montagem visual da lista principal de convenios.
- Montagem do contador total de convenios.
- Montagem visual da lista principal de planos.
- Montagem do contador total de planos.
- Composicao HTML das linhas, preservando a selecao visual e o estado exibido.

## O que permaneceu no app.js
- `convPlanCarregar()`
- selecao de convenio e plano
- abertura e fechamento do painel
- botoes de acao
- modais de convenio, plano e calendario
- calendario de faturamento
- `convPlanCarregarAuxConvenioV2()`
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalCarregar()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`
- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`
- `convPlanCalModalPayload()`

## Confirmacoes de escopo
- `requestJson`, payload efetivo, salvamento e exclusao nao foram alterados.
- Backend, banco, endpoints e permissoes nao foram alterados.
- Calendario, modais, pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores nao foram alterados.
- Blindagem textual/mojibake foi respeitada.

## Riscos
- Lista vazia inesperada.
- Contador incorreto.
- Selecao visual incoerente.
- Regressao por dependencia compartilhada de renderizacao.

## Rollback mental
- Voltar a montagem das linhas e dos contadores para `app.js`.
- Manter no modulo passivo apenas os helpers puros de normalizacao.

## Teste manual obrigatorio
1. Abrir o sistema.
2. Ir em `Cadastro > Convenios e Planos`.
3. Confirmar que a lista de Convenios carrega normalmente.
4. Conferir se o contador de Convenios continua coerente.
5. Clicar em convenios diferentes.
6. Confirmar que a selecao visual de Convenios continua funcionando.
7. Conferir se a lista de Planos do convenio selecionado aparece normalmente.
8. Conferir se o contador de Planos continua coerente.
9. Clicar em planos diferentes.
10. Confirmar que a selecao visual de Planos continua funcionando.
11. Fechar o painel.
12. Reabrir `Cadastro > Convenios e Planos`.
13. Confirmar que lista, contadores, selecao visual, botoes, calendario e modais continuam coerentes, sem testar salvar ou exclusao.
