# Unidades - Subetapa 3 - Carregamento passivo

## Contexto

- Branch atual: `modularizacao-segura-fase-1`
- Objetivo: carregar `frontend/js/modules/unidades.js` no `frontend/index.html` de forma passiva/controlada
- O `frontend/app.js` continua como fonte funcional oficial

## Estado inicial

- Working tree limpo antes da alteração: sim

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`

## Arquivos alterados

- `frontend/index.html`
- Nenhum arquivo funcional do monolito foi alterado
- `frontend/app.js` nao foi alterado
- `frontend/js/modules/unidades.js` nao foi alterado em conteudo nesta etapa

## Confirmacoes

- `frontend/app.js` nao foi alterado
- `frontend/js/modules/unidades.js` nao foi alterado em conteudo
- `frontend/js/modules/unidades.js` passou a ser carregado no `frontend/index.html`
- O script de `unidades.js` foi colocado antes de `frontend/app.js`
- O `frontend/app.js` continua sendo a fonte funcional oficial
- Nenhum comportamento funcional foi deslocado do `app.js`
- O modulo nao registra eventos
- O modulo nao acessa DOM
- O modulo nao faz fetch/API
- O modulo nao sobrescreve funcoes globais funcionais como `unidadeAbrir`, `unidadeRender` ou `unidadeCarregar`

## Cache-bust do app.js

- Valor anterior: `20260512-unidades-duploclique1`
- Valor novo: nao alterado

## Observacoes tecnicas

- O carregamento do modulo foi passivo: ele apenas inicializa o namespace `window.BranaUnidadesModule`
- Nao houve ativacao da modularizacao antiga
- Nao houve mudanca no fluxo funcional do sistema

## Validacoes

- `node --check frontend/js/modules/unidades.js`: sem erros
- `node --check frontend/app.js`: sem erros
- `git diff -- frontend/app.js`: sem alteracoes
- `git diff -- frontend/index.html`: mostra apenas a inclusao do script do modulo
- `git diff -- frontend/js/modules/unidades.js`: sem alteracoes em conteudo

## Riscos residuais

- O modulo esta carregado, mas ainda nao e consumido pelo `app.js`
- Qualquer migracao funcional futura deve continuar sendo feita de forma conservadora para nao interferir no monolito estabilizado

## Teste manual recomendado

1. Abrir o sistema com recarga limpa do navegador
2. Conferir no console que `window.BranaUnidadesModule` existe
3. Abrir `Cadastro > Unidades de atendimento`
4. Confirmar que a tela continua funcionando normalmente com o comportamento ja estabilizado

## Proxima subetapa recomendada

- Subetapa 4: decidir se algum ponto de leitura auxiliar do modulo sera usado apenas para comparacao interna, sem substituir ainda o fluxo funcional do monolito
