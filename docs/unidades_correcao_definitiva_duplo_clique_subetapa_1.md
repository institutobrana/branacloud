# Unidades - correcao definitiva do duplo clique

## Contexto

- Branch atual: `modularizacao-segura-fase-1`
- Escopo: ajuste minimo e seguro no fluxo monolitico de Unidades
- Modo modular: mantido apenas como estrutura controlada; o modulo `frontend/js/modules/unidades.js` nao foi carregado no HTML

## Estado observado

- `frontend/app.js` foi alterado
- `frontend/index.html` foi alterado apenas no cache-bust do `app.js`
- `frontend/js/modules/unidades.js` nao foi alterado nesta correcao
- `frontend/js/modules/unidades.js` nao foi carregado no `frontend/index.html`

## Causa provavel da falha

A causa real foi a existencia de duas definicoes de `unidadeEnsureUI()` no `frontend/app.js`. A segunda definicao, que vinha depois, sobrescrevia a versao com o binding novo e ainda chamava `bindStandardGridActivation(...)`, fazendo o navegador executar o fluxo antigo da grade de Unidades. O cache-bust antigo tambem atrapalhava a validacao durante os testes por poder manter uma versao desatualizada do `app.js` em cache.

## Cache-bust

- Valor anterior: `20260512-convplan-plano2`
- Valor novo: `20260512-unidades-duploclique1`

## Correcao aplicada

No bloco de Unidades em `frontend/app.js`, o listener da grade passou a usar detecao explicita de dois cliques rapidos no proprio `click` da tabela:

- captura robusta da linha com `ev.target.closest("tr[data-id]")`
- selecao imediata da linha com `unidadeSelecionarLinha(tr)`
- leitura do `id` da linha
- obtencao do item pelo mesmo fluxo do botao `Altera...` via `unidadeSelecionada()`
- fallback direto em `unidadesCache` quando necessario
- abertura do modal com `unidadeAbrirModal(item)` ao detectar o segundo clique no mesmo `id` dentro da janela curta de tempo
- protecao contra bind duplicado com `dataset.unidadeClickBound`
- log temporario unico para confirmar a versao carregada: `console.log("[unidades] grade pronta - duploclique1")`

## Fluxo de referencia mantido

- O botao `Altera...` continua usando `unidadeSelecionada() -> unidadeAbrirModal(item)`
- Nao houve alteracao de salvar, excluir, backend, endpoints ou banco

## Validacoes

- `node --check frontend/app.js`: sem erros
- `node --check frontend/js/modules/unidades.js`: sem erros

## Relatorio tecnico

- A correcao ficou somente no `frontend/app.js` monolitico
- O `frontend/index.html` recebeu apenas o novo cache-bust do `app.js`
- Nenhuma funcao funcional foi deslocada para o modulo novo

## Teste manual recomendado

1. Abrir o sistema com recarga limpa do navegador
2. Entrar em `Cadastro > Unidades de atendimento`
3. Confirmar o log `"[unidades] grade pronta - duploclique1"` no console
4. Clicar uma vez em uma linha e verificar a selecao
5. Dar dois cliques rapidos na mesma linha e confirmar que o modal `Altera unidade` abre

