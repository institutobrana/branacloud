# Unidades - Subetapa 1: Estrutura modular controlada

## Branch atual

- `modularizacao-segura-fase-1`

## Status do working tree antes da alteração

- Working tree limpo antes desta alteração.

## Arquivos alterados

- `frontend/js/modules/unidades.js`
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md`

## Arquivos criados

- `frontend/js/modules/unidades.js`
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md`

## `frontend/index.html`

- Não foi alterado.
- O arquivo modular não foi carregado no `index.html` nesta etapa, conforme a preferência conservadora definida para a subetapa.

## `frontend/app.js`

- Não foi alterado.
- Nenhum comportamento funcional foi deslocado para o módulo nesta subetapa.

## Namespace criado

- `window.BranaUnidadesModule = window.BranaUnidadesModule || {}`

## Contrato do namespace

- `meta`
  - `nome: "Unidades"`
  - `versao: "subetapa-1"`
  - `status: "estrutura-controlada"`
  - `helpersPlanejados: ["fmtCodigo", "statusHtml", "telefonePadrao"]`
- `status`
  - espelha o status controlado do módulo
- `helpers`
  - conjunto congelado com os helpers puros desta etapa

## Helpers declarados no módulo

- `fmtCodigo(valor, idx = 0)`
- `statusHtml(ativo)`
- `telefonePadrao(idx)`

## Confirmações

- Nenhum comportamento funcional foi deslocado do `app.js`.
- Nenhum evento foi registrado no módulo.
- Nenhum DOM foi manipulado pelo módulo.
- Nenhum `fetch` ou chamada de API foi executado pelo módulo.
- Nenhuma função global funcional foi sobrescrita pelo módulo.

## Riscos residuais

- O módulo ainda não está carregado pelo `index.html`, então ele permanece apenas como estrutura de comparação futura.
- Os helpers foram disponibilizados apenas no namespace novo; a integração real com o fluxo existente fica para a próxima subetapa.

## Teste manual recomendado

- Abrir o sistema e confirmar que o fluxo atual de Unidades continua operando pelo `app.js` sem qualquer mudança de comportamento.
- Confirmar, em inspeção do console, que `window.BranaUnidadesModule` existe e expõe apenas o namespace controlado.

## Próxima subetapa recomendada

- Subetapa 2: comparação controlada dos helpers puros com o `app.js`, mantendo `unidadeAbrir()`, `unidadeRender()`, `unidadeCarregar()`, eventos, modal e chamadas de API ainda intactos.
