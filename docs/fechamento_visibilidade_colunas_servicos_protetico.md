# Fechamento da visibilidade de colunas - Serviços de protético

## 1. Defeito recebido
Os checkboxes da seção `COLUNAS` do menu do cabeçalho apareciam, mas não alteravam a visibilidade real das colunas na tabela de `Serviços de protético`.

## 2. Referência Unidades de medida
A referência solicitada foi `Tabelas -> Tabelas auxiliares -> Unidades de medida`.
Na prática, a implementação funcional equivalente encontrada no código reutiliza `TableColumnFilterHeader` com estado de visibilidade/colunas em módulos que já controlam esse contrato.

## 3. Comportamento da referência
O cabeçalho compartilhado exibe a seção `COLUNAS` e recebe `columns` com `visible` e `locked`.
O estado real é mantido pela feature e o array final enviado à tabela é filtrado antes do render.

## 4. Causa encontrada
Em `ServicosProteticoTable.jsx`, os checkboxes eram apenas renderizados, mas a tabela continuava recebendo o array completo de colunas.
Além disso, o módulo não mantinha estado explícito de visibilidade por coluna.

## 5. Estado de visibilidade
Foi implementado estado explícito para:
- `codigo`
- `nome`
- `indice`
- `preco`
- `prazo`

Todas começam visíveis.

## 6. Ligação dos checkboxes
Os checkboxes agora recebem `visible` derivado do estado da feature e acionam `onToggleVisibleColumn`.

## 7. Montagem das colunas
A tabela passou a receber apenas `resolvedColumns`, calculado com base em `visibleColumns`.

## 8. Código
`codigo` pode ser ocultado e restaurado.
No runtime validado, ao ocultá-lo o cabeçalho sumiu e, ao reabrir o menu e marcar novamente, ele voltou.

## 9. Serviço
`nome` pode ser ocultado e restaurado.
O mesmo padrão vale para os demais campos textuais e numéricos.

## 10. Índice
`indice` pode ser ocultado e restaurado.

## 11. Preço
`preco` pode ser ocultado e restaurado.

## 12. Prazo
`prazo` pode ser ocultado e restaurado.

## 13. Coluna de seleção
A coluna de seleção foi preservada fora do grupo de colunas controladas por checkbox.

## 14. Regra da última coluna
Foi aplicada proteção mínima para evitar deixar todas as colunas de dados ocultas ao mesmo tempo.

## 15. Filtros de colunas ocultas
Os filtros continuam preservados no estado da feature.
Quando a coluna volta a ser exibida, o cabeçalho correspondente volta funcional.

## 16. Ordenação de colunas ocultas
A ordenação existente foi preservada junto do modelo de colunas; a estrutura não foi reescrita.

## 17. Redistribuição de largura
Ao ocultar a coluna, o espaço é redistribuído porque a coluna sai do array final renderizado.
Ao reexibir, a largura volta junto com a coluna.

## 18. Contador
O contador do rodapé permaneceu intacto.

## 19. Rodapé
O rodapé integrado foi preservado.

## 20. Scroll
O scroll vertical foi preservado.

## 21. Tema claro
Validado no runtime com o tema padrão claro.

## 22. Tema escuro
Não foi feita navegação completa em tema escuro nesta rodada.

## 23. Regressão nas auxiliares
Não foram alterados arquivos das tabelas auxiliares nesta correção.

## 24. Testes
Executado com sucesso:
- `node --test tests/servicosProtetico.test.js`

## 25. Build
Executado com sucesso:
- `npm.cmd run build`

## 26. Validação runtime
Validada em navegador com API mockada apenas para leitura:
- carregamento da tela;
- abertura do menu de colunas;
- ocultação de `Código`;
- reexibição de `Código`;
- cabeçalho realmente removido e restaurado.

## 27. Arquivos alterados
- [frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [frontend-react/tests/servicosProtetico.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)

## 28. Confirmação de preservação do layout
O shell, toolbar, rodapé, contador, seleção, altura da grade e scroll vertical foram preservados.

## 29. Confirmação de que CRUD e impressão não foram implementados
Esta correção tratou apenas visibilidade de colunas. Nenhuma operação de CRUD ou impressão foi adicionada.
