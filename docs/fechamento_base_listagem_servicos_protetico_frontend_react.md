# Fechamento da base da listagem - Brana Cloude - Tabelas -> Serviços de protético

## 1. Objetivo

Consolidar o estado funcional já aprovado da listagem de `Tabelas -> Serviços de protético` no novo frontend React do Brana Cloude, mantendo somente a base de leitura, filtros, ordenação, visibilidade de colunas, seleção, shell integrado e contador no rodapé.

## 2. Auditoria de origem

A base desta frente foi sustentada por:

- [`docs/auditoria_servicos_protetico_frontend_legado.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_servicos_protetico_frontend_legado.md)
- [`docs/contrato_implementacao_servicos_protetico_frontend_react.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/contrato_implementacao_servicos_protetico_frontend_react.md)
- [`docs/fechamento_etapa_1_servicos_protetico_frontend_react.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/fechamento_etapa_1_servicos_protetico_frontend_react.md)
- [`docs/fechamento_ajustes_visuais_servicos_protetico_frontend_react.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/fechamento_ajustes_visuais_servicos_protetico_frontend_react.md)
- [`docs/fechamento_correcao_final_uniao_l_servicos_protetico_frontend_react.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/fechamento_correcao_final_uniao_l_servicos_protetico_frontend_react.md)
- [`docs/fechamento_definitivo_uniao_l_shell_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_definitivo_uniao_l_shell_servicos_protetico.md)
- [`docs/fechamento_ajuste_tabela_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_ajuste_tabela_servicos_protetico.md)
- [`docs/fechamento_integracao_rodape_tabela_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_integracao_rodape_tabela_servicos_protetico.md)
- [`docs/fechamento_equivalencia_filtros_auxiliares_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_equivalencia_filtros_auxiliares_servicos_protetico.md)
- [`docs/fechamento_visibilidade_colunas_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_visibilidade_colunas_servicos_protetico.md)
- [`docs/fechamento_largura_combo_protetico_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_largura_combo_protetico_servicos_protetico.md)
- [`docs/fechamento_remocao_filtro_duplicado_codigo_servicos_protetico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fechamento_remocao_filtro_duplicado_codigo_servicos_protetico.md)

Os documentos acima existem e foram reaproveitados como rastreabilidade da frente.

## 3. Rota e menu

- Menu e rota do módulo: `Tabelas -> Serviços de protético`
- Rota React: `/app/tabelas/servicos-protetico`
- Registro de rota e shell: [`frontend-react/src/app/App.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx) e [`frontend-react/src/app/routes.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/routes.jsx)

## 4. Shell, toolbar e combo

- A tela opera dentro do shell do Brana Cloud, com banda horizontal integrada.
- A toolbar é compacta e mantém os botões de ação ainda desabilitados nesta fase.
- O combo `Protético` carrega a lista de protéticos e preserva o texto completo no viewport normal.
- A origem dos dados do combo e da lista de serviços está no backend de leitura já existente.

Arquivos centrais:

- [`frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)

## 5. Endpoints de leitura

- `GET /api/proteticos`
- `GET /api/proteticos/{id}/servicos`

Esses endpoints são consumidos por [`frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProteticoApi.js).

## 6. Tabela

- A tabela possui cinco colunas: `Código`, `Serviço`, `Índice`, `Preço`, `Prazo`.
- A listagem é compacta, centralizada e usa cabeçalho fixo com scroll vertical.
- A seleção de linha é única.
- O rodapé exibe o total de serviços do protético selecionado.
- O código exibido na listagem é derivado de `ServicoProtetico.id`.

Arquivo principal:

- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)

## 7. Filtros

- Os filtros por coluna funcionam no cabeçalho compartilhado.
- A coluna `Código` mantém apenas um controle funcional de filtro.
- A funcionalidade de aplicar e limpar permanece ativa.
- A visibilidade de colunas segue o mesmo padrão dos módulos auxiliares já validados.

Arquivo compartilhado:

- [`frontend-react/src/components/TableColumnFilterHeader.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/TableColumnFilterHeader.jsx)

## 8. Ordenação

- A listagem mantém ordenação ascendente e descendente via cabeçalho.
- A ordenação se aplica sobre os dados já carregados.

## 9. Visibilidade de colunas

- A coluna `Código` pode ser ocultada e restaurada.
- A regra de impedir ocultar a última coluna visível foi preservada.

## 10. Seleção e troca de protético

- A seleção de protético recarrega a listagem.
- A seleção da linha é limpa quando o protético muda.
- O estado da toolbar reflete o protético selecionado.

## 11. Largura, centralização e 15 linhas

- A tabela foi ajustada para permanecer centralizada.
- A área da tabela usa largura controlada para evitar estourar a viewport.
- O scroll vertical foi fixado para comportar a quantidade compacta de linhas visíveis.

## 12. UTF-8

- A frente foi consolidada com correções de codificação visível nos rótulos e textos da UI.
- Os textos aprovados foram mantidos em português com acentuação correta.

## 13. Tema claro e tema escuro

- A frente herda o tema global do shell.
- As classes compartilhadas de filtro e toolbar permanecem compatíveis com os dois temas.

## 14. Testes

- `node --test tests/servicosProtetico.test.js`
- O conjunto validou normalizadores, leitura, filtros, ordenação, visibilidade de colunas, footer e regressões do cabeçalho.

## 15. Build

- `npm.cmd run build`
- O build passou com warning de chunk grande, sem erro funcional.

## 16. Runtime

- A validação runtime autenticada confirmou a rota, o shell, o combo `Protético`, a lista de serviços e o texto completo do laboratório selecionado.
- Não houve criação, alteração ou exclusão de registros.

## 17. Arquivos consolidados

- [`frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [`frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [`frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProteticoApi.js)
- [`frontend-react/src/features/servicosProtetico/servicosProtetico.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js)

## 18. Alterações compartilhadas

- [`frontend-react/src/components/TableColumnFilterHeader.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/TableColumnFilterHeader.jsx)
- [`frontend-react/src/styles/globals.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/styles/globals.css)

Esses arquivos passaram a sustentar filtro funcional compartilhado e estilos do popover de coluna.

## 19. Riscos

- Não incluir `App.jsx`, `routes.jsx` ou CSS global inteiro sem staging seletivo.
- Não misturar mudanças de outras frentes no mesmo commit.
- Não levar temporários, screenshots, logs, node_modules ou artefatos de validação.
- Não afirmar CRUD ou impressão como concluídos.

## 20. Itens ainda não implementados

- Novo serviço
- Altera
- Elimina
- Imprime

## 21. Próxima etapa

Se a frente avançar, a próxima entrega natural é `Novo serviço`, preservando o contrato já consolidado da listagem.

## 22. Ausência de backend, banco e migration

- Nenhum endpoint novo foi criado.
- Nenhuma migration foi criada.
- Nenhum banco foi alterado.

## 23. Estratégia do commit

- Commit seletivo e limpo.
- Incluir somente os arquivos e hunks da frente `Serviços de protético` e os compartilhamentos indispensáveis.
- Excluir arquivos temporários e artefatos de validação.
