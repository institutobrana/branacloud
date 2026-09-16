# Persistencia de `imagem_custom` no novo simbolo grafico

## Status
`SUSPENSA E RETIRADA TEMPORARIAMENTE DO FLUXO ATIVO`

## Motivo
O fluxo de `Configuracoes -> Simbolos graficos -> Novo` foi revertido para o contrato funcional da Fase 2D.1 após regressoes observadas em runtime na selecao da biblioteca, no preview e na estabilidade da Especialidade.

## Situação atual
- O editor secundario foi retirado do fluxo ativo.
- `imagemCustom` foi removida do estado ativo do modal.
- `imagem_custom` foi removida do payload ativo de criacao.
- O POST basico permanece valido com `descricao`, `codigo`, `especialidade`, `tipo_simbolo` e `tipo_marca`.
- A biblioteca base, a selecao unica, o preview-base, a validacao local e o POST basico continuam preservados.

## Rastreabilidade
Os achados tecnicos das auditorias anteriores permanecem documentados e podem ser retomados em uma nova implementacao isolada no futuro, sem tocar no modal funcional atual.
