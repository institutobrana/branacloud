# Correção do duplo clique - Unidades - Subetapa 1

## Estado confirmado

- Branch atual: `modularizacao-segura-fase-1`
- `frontend/index.html` não foi alterado nesta correção.
- `frontend/js/modules/unidades.js` não foi alterado nesta correção.
- A correção ficou no `frontend/app.js` monolítico.

## Causa real da falha

- O duplo clique nativo não abria o modal porque o clique simples da grade de Unidades chama `unidadeSelecionarLinha(tr)`, e essa função dispara `unidadeRender()`.
- Como a tabela é re-renderizada logo no primeiro clique, o `dblclick` nativo fica frágil nesse fluxo.
- Em prática, o segundo clique não conseguia chegar de forma confiável ao caminho que abriria o modal.

## Botão `Altera...`

- O botão `Altera...` funciona pelo fluxo `unidadeSelecionada() -> unidadeAbrirModal(item)`.
- Esse caminho não dependia do `dblclick` nativo e por isso seguia funcionando.

## Função usada pelo botão `Altera...`

- Listener do botão `unidade-btn-editar` dentro de `unidadeEnsureUI()`.
- Sequência: obtém `unidadeSelecionada()` e chama `unidadeAbrirModal(item)`.

## Função usada pelo duplo clique antes

- Listener de `dblclick` no `tbody` de Unidades.
- Fluxo anterior: localizar `tr[data-id]`, chamar `unidadeSelecionarLinha(tr)` e então `unidadeAbrirModal(item)`.

## Correção aplicada

- Substituído o gatilho frágil de `dblclick` por detecção mínima de dois cliques rápidos no `click` do `tbody`.
- O novo fluxo:
  - pega a linha com `closest("tr[data-id]")`
  - lê o `id` da linha
  - chama `unidadeSelecionarLinha(tr)`
  - obtém o item via `unidadeSelecionada()`
  - se o mesmo `id` reaparece dentro da janela de tempo configurada, chama `unidadeAbrirModal(item)`
- Nenhum salvar/excluir, endpoint, backend, index.html ou módulo novo foi alterado.

## Validação

- `node --check frontend/app.js` passou.
- `node --check frontend/js/modules/unidades.js` passou.

## Teste manual recomendado

- Abrir `Cadastro > Unidades de atendimento`.
- Clicar uma vez na linha para selecionar.
- Dar dois cliques rápidos na mesma linha.
- Confirmar que abre o modal `Altera unidade`.

