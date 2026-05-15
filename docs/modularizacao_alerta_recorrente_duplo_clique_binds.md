# Alerta recorrente - Duplo clique e binds em modularizações

- Este problema já apareceu em módulos anteriores durante a migração gradual para componentes.
- Em tabelas dinâmicas com rerender, confiar apenas no `dblclick` nativo pode ser frágil.
- Quando o clique simples altera seleção e redesenha a tabela, o segundo clique pode perder o contexto.
- Dependência exclusiva de estado global de seleção tende a falhar em fluxos com renderização frequente.
- Em grids dinâmicos, preferir um padrão explícito e resistente:
  - bind direto na linha durante a renderização, ou
  - delegação no `tbody` com `closest("tr[data-id]")` e detecção de segundo clique rápido no `click`.
- Sempre selecionar a linha antes de abrir o modal de alteração.
- Sempre validar separadamente:
  - clique simples
  - duplo clique
  - botão `Altera`
- Sempre testar após `Ctrl+F5`.
- Sempre conferir o console sem `ReferenceError` ou `TypeError`.
- Em novas modularizações, mapear `dblclick`, `binds`, `data-id` e rerender logo na Subetapa 2.
