# Diagnóstico - Duplo clique em Unidades - Subetapa 1

## Estado confirmado do repositório

- Branch atual: `modularizacao-segura-fase-1`
- `frontend/app.js` está alterado no working tree atual.
- `frontend/index.html` não está alterado.
- O working tree não está limpo.

## Carregamento do módulo novo

- `frontend/index.html` não carrega `frontend/js/modules/unidades.js`.
- O arquivo `frontend/js/modules/unidades.js` existe no disco, mas não é incluído pelo HTML.
- O módulo novo está restrito ao namespace `window.BranaUnidadesModule` e não registra eventos.

## Fluxo atual de Unidades no `app.js`

- `unidadeAbrir()` é a entrada do painel de Unidades.
- O clique simples na linha é tratado no bloco de vínculo da grade de Unidades dentro de `unidadeEnsureUI()`.
- O duplo clique também está tratado no mesmo bloco, no listener `dblclick` do `tbody`.
- O clique simples chama `unidadeSelecionarLinha(tr)`.
- O duplo clique chama `unidadeSelecionarLinha(tr)` e depois `unidadeAbrirModal(item)`.
- O botão `Altera...` usa `unidadeSelecionada()` e, se houver item, chama `unidadeAbrirModal(item)`.

## Funções observadas

- Função responsável pelo duplo clique: o listener `dblclick` anexado ao `tbody` de Unidades dentro de `unidadeEnsureUI()`.
- Função usada pelo botão `Editar/Alterar`: o listener do botão `unidade-btn-editar`, que pega `unidadeSelecionada()` e chama `unidadeAbrirModal(item)`.

## Diagnóstico provável

- No estado da Subetapa 1 puro, o módulo novo não poderia abrir a tela de alteração porque ele não é carregado pelo HTML e não registra eventos.
- O problema, portanto, parece pré-existente à Subetapa 1 e não causado pela estrutura modular controlada.
- No estado atual do arquivo `app.js` existe o listener de `dblclick`; se o teste manual ainda não abriu a janela, a causa mais provável é o navegador estar executando uma versão anterior em cache ou outra cópia carregada da aplicação.

## Comparações solicitadas

- O botão `Editar/Alterar` funciona de acordo com o fluxo atual do `app.js`.
- O clique simples seleciona a linha via `unidadeSelecionarLinha(tr)`.
- O `tbody` correto é o `tbody` montado em `unidadeEnsureUI()`, identificado por `unidade-tbody`.
- O callback de ativação chama `unidadeAbrirModal(item)` com o item selecionado.
- As linhas da tabela usam `data-id`, e o seletor do listener procura `tr[data-id]`.
- O vínculo do evento é guardado com `dataset.unidadeDblBound` para evitar duplicação.

## Se é seguro commitar a estrutura modular agora

- A estrutura modular controlada é segura por si só, porque o módulo não afeta o sistema.
- Porém, para o objetivo funcional de duplo clique, ainda existe uma dependência do `app.js`.
- Recomenda-se corrigir ou validar primeiro o fluxo real do `app.js` antes de considerar a etapa concluída.

## Recomendação de correção mínima, sem aplicar agora

- Manter o duplo clique como responsabilidade do `app.js` até a modularização avançar para uma etapa em que o módulo seja realmente carregado.
- Confirmar no navegador que não há cache antigo do `frontend/app.js`.
- Se houver necessidade de modularização futura, mover apenas o binding de eventos numa etapa própria, sem tocar em salvar/excluir ou no backend.
