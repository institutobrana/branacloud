# Fase 2B - Prestadores remanescentes - Implementacao minima da lista principal e contador

## Objetivo da etapa
Registrar a implementacao minima do primeiro recorte medio controlado de `Prestadores remanescentes` na Fase 2B, extraindo do `app.js` apenas a renderizacao visual/local da lista principal e do contador para o modulo passivo existente.

## Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/fase_2b_prestadores_lista_contador_implementacao_minima.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes tocadas
- `prestRender()`
- `prestFiltrarLista()`
- `prestStatusHtml(ativo)`
- `prestFmtCodigo(valor, idx=0)`
- `prestSelecionarLinha(tr)`, apenas por depender da renderizacao da lista
- `prestSelecionado()`, apenas por dependencia local da linha selecionada

## Helpers criados ou ajustados
- `escHtml(valor)` em `frontend/js/modules/prestadores.js`
- `prestRenderLista(lista, selId)` em `frontend/js/modules/prestadores.js`

## O que saiu parcialmente do app.js
- A montagem visual da lista principal de Prestadores.
- A composicao da linha selecionada na grade, enquanto estado visual dependente da renderizacao.
- A montagem do contador total/visivel exibido no painel.

## O que permaneceu no app.js
- `prestCarregar()`
- filtros
- selecao
- abertura/fechamento
- botoes de acao
- qualquer fluxo adjacente de agenda, credenciamento e comissoes
- a orquestracao do painel principal

## Confirmacoes de escopo
- `requestJson`, payload, salvamento e exclusao nao foram alterados.
- backend, banco, endpoints e permissoes nao foram alterados.
- agenda, financeiro, usuarios/perfis, credenciamento e comissoes nao foram alterados.
- `frontend/index.html` nao foi alterado.
- blindagem textual/mojibake foi respeitada.

## Riscos
- quebra de selecao visual na grade;
- divergencia do contador;
- lista vazia por erro de renderizacao;
- regressao no filtro por especialidade ou nome;
- alteracao acidental de classe/estado visual.

## Rollback mental
- devolver a composicao da grade e do contador para `app.js`;
- manter o modulo passivo apenas com helpers puros ja seguros;
- preservar `prestCarregar()`, filtros, selecao e abertura/fechamento sem mudanca.

## Teste manual obrigatorio
1. Abrir o sistema.
2. Ir em `Cadastro > Prestadores`.
3. Confirmar que a lista principal carrega normalmente.
4. Conferir se o contador continua coerente.
5. Filtrar por especialidade.
6. Digitar um nome no filtro.
7. Clicar em linhas diferentes da lista.
8. Confirmar que a selecao visual continua funcionando.
9. Fechar o painel.
10. Reabrir `Cadastro > Prestadores`.
11. Confirmar que lista, contador, filtros, selecao visual e botoes continuam coerentes, sem testar salvar ou exclusao.
