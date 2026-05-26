# Fase 2B - Conta corrente - Implementacao minima da tabela de lancamentos e totais

## Objetivo da etapa

- Implementar o primeiro recorte medio controlado de `Conta corrente` na Fase 2B.
- Delegar apenas a renderizacao visual/local da tabela de lancamentos e dos totais/resumo mensal.
- Manter persistencia, `requestJson`, payload, salvamento, exclusao, relatorios e fluxo de caixa fora do recorte.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/conta-corrente.js`
- `docs/fase_2b_conta_corrente_tabela_totais_implementacao_minima.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes tocadas

- `ccRenderTabela()`
- carregamento passivo inicial do modulo `conta-corrente` em `app.js`

## Modulo criado ou ajustado

- Foi criado o modulo passivo `frontend/js/modules/conta-corrente.js`.
- O modulo nao chama `requestJson`, nao salva e nao exclui.
- O modulo fica responsavel apenas pela composicao visual/local da tabela e dos totais.

## Helpers criados ou ajustados

- `contaCorrenteFormatarMoeda(valor)`
- `contaCorrenteFormatarDataISO(valor)`
- `contaCorrenteMontarLinhasLancamentos(lista, opts)`
- `contaCorrenteAtualizarTotais(data, refs, opts)`
- `contaCorrenteRenderTabela(refs, data, opts)`

## O que saiu parcialmente do app.js

- A composicao visual/local das linhas da tabela de lancamentos.
- A atualizacao visual/local dos totais/resumo mensal.

## O que permaneceu no app.js

- `ccCarregar()`
- filtros
- selecao
- abertura/fechamento
- modal
- salvar
- excluir
- imprimir
- relatorios
- fluxo de caixa
- `requestJson`
- payload
- regras financeiras

## Confirmacoes de escopo

- `requestJson`, payload, salvamento e exclusao nao foram alterados.
- backend, banco, endpoints e permissoes nao foram alterados.
- relatorios, fluxo de caixa, recebimentos, pagamentos, pacientes, agenda, convenios, prestadores e procedimentos nao foram alterados.
- valores financeiros, datas, status e formas de pagamento nao foram alterados.
- a blindagem textual/mojibake foi respeitada.

## Riscos

- Regressoes em saldo ou totais.
- Regressoes visuais na tabela de lancamentos.
- Risco operacional por ser uma frente financeira e transversal.

## Rollback mental

- Recolocar a montagem da tabela e dos totais diretamente em `app.js` caso a delegacao apresente qualquer divergencia.
- Manter o modulo apenas como namespace passivo, sem efeitos colaterais.

## Teste manual obrigatorio

1. Abrir o sistema.
2. Ir em `Financeiro > Conta corrente`.
3. Confirmar que a tabela/lista de lancamentos carrega normalmente.
4. Conferir se os totais/resumo mensal continuam coerentes.
5. Clicar em linhas diferentes da tabela.
6. Confirmar que a selecao visual continua funcionando.
7. Alterar filtros de mes/ano/conta/filtro, se existirem nessa tela.
8. Confirmar que a tabela e os totais continuam coerentes apos os filtros.
9. Fechar o painel.
10. Reabrir `Financeiro > Conta corrente`.
11. Confirmar que a tabela aparece normalmente, os totais permanecem coerentes e os botoes continuam aparecendo.
12. Confirmar que relatorios/fluxo de caixa nao foram afetados visualmente.
13. Nao testar salvar.
14. Nao testar exclusao.
15. Confirmar que valores financeiros reais nao foram alterados.

