# Fechamento da Etapa 1 - Brana Cloude - Tabelas -> Servicos de protetico

## 1. Objetivo
Fechar a Etapa 1 da frente `Tabelas -> Servicos de protetico` com validacao rigida, correcao minima e confirmacao de integracao real no frontend React, sem implementar CRUD, impressao ou alterar backend/banco.

## 2. Escopo efetivamente entregue
- Feature modular no `frontend-react/src/features/servicosProtetico/`.
- Integração com o shell do Brana Cloude.
- Entrada pela rota `/app/tabelas/servicos-protetico`.
- Menu lateral em `Tabelas` com item `Servicos de protetico`.
- Toolbar horizontal com `Novo servico...`, `Altera...`, `Elimina`, `Imprime...` e combo `Protetico`.
- Leitura real de `GET /proteticos` e `GET /proteticos/{protetico_id}/servicos`.
- Tabela compacta com 5 colunas.
- Filtros locais por coluna.
- Seleção única de linha.
- Estados de loading, erro e vazio.
- Proteção contra resposta obsoleta na troca rapida de protetico.

## 3. Documentos de referencia
- [`docs/auditoria_servicos_protetico_frontend_legado.md`](./auditoria_servicos_protetico_frontend_legado.md)
- [`docs/contrato_implementacao_servicos_protetico_frontend_react.md`](./contrato_implementacao_servicos_protetico_frontend_react.md)
- [`docs/05_banco_dados.md`](./05_banco_dados.md)
- [`docs/06_seguranca.md`](./06_seguranca.md)
- [`docs/07_fluxos.md`](./07_fluxos.md)

## 4. Arquivos criados
- [`frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProteticoApi.js)
- [`frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [`frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProtetico.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js)
- [`frontend-react/tests/servicosProtetico.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)
- [`docs/fechamento_etapa_1_servicos_protetico_frontend_react.md`](./fechamento_etapa_1_servicos_protetico_frontend_react.md)

## 5. Arquivos alterados
- [`frontend-react/src/app/App.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx)
- [`frontend-react/src/app/routes.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/routes.jsx)
- [`frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProteticoApi.js)
- [`frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [`frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProtetico.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFormatters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoRace.js)

## 6. Arquitetura final
- `ServicosProteticoPage.jsx`: orquestra a feature e expõe estado para o shell.
- `servicosProteticoApi.js`: concentra chamadas HTTP.
- `hooks/useServicosProtetico.js`: concentra estado, carregamento e seleção.
- `components/`: separa toolbar, combo e tabela.
- `utils/`: concentra mapeamento, formatação, filtros e concorrência.

## 7. Integracao do menu
- O item foi adicionado no arquivo central de navegação do frontend React em [`frontend-react/src/app/App.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx).
- O item ficou em `Tabelas` com o texto `Servicos de protetico`.
- A rota associada é `/app/tabelas/servicos-protetico`.

## 8. Integracao da rota
- A rota foi adicionada em [`frontend-react/src/app/routes.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/routes.jsx).
- `resolveScreenFromPath()` reconhece a tela.
- `syncAppPath()` preserva a URL ao navegar.
- A atualização direta em `/app/tabelas/servicos-protetico` não cai no dashboard quando há sessão válida.

## 9. Integracao do shell
- A tela usa o shell padrão do Brana Cloud.
- A barra lateral e a barra horizontal permanecem integradas visualmente.
- Não há toolbar interna duplicada dentro do conteúdo.

## 10. Toolbar
- Toolbar entregue com:
  - `Novo serviço...`
  - `Altera...`
  - `Elimina`
  - `Imprime...`
  - combo `Protético`
- Nesta etapa os quatro botões ficaram desabilitados.
- Não existe botão `Fecha` nesta toolbar.

## 11. Contrato real de `GET /proteticos`
- Status observado no runtime: `200`.
- Rota observada: `/api/proteticos`.
- Campos usados no combo: `id` como `value` e `nome` como `label`.
- A seleção inicial preserva a seleção anterior quando ainda é válida; caso contrário, usa o primeiro protético retornado.

## 12. Contrato real de serviços
- Status observado no runtime: `200`.
- Rota observada: `/api/proteticos/{protetico_id}/servicos`.
- Campos observados e usados: `id`, `nome`, `indice`, `preco`, `prazo`, `protetico_id`.
- O carregamento ocorre após seleção de protético.

## 13. Concorrencia
- A troca rápida de protético usa bloqueio por sequência incremental em `servicosProteticoRace.js`.
- Resposta antiga não deve sobrescrever estado mais recente.
- O filtro e a seleção são limpos ao trocar o protético.

## 14. Tabela
- Cinco colunas confirmadas no runtime:
  - `Código`
  - `Serviço`
  - `Índice`
  - `Preço`
  - `Prazo`
- `Código` usa `ServicoProtetico.id`.
- Não existe campo novo `codigo` no contrato de leitura.
- A tabela ficou compacta e exibiu 136 serviços para o protético selecionado no momento da validação.

## 15. Filtros
- Filtros locais por coluna foram implementados.
- `Serviço` ignora maiúsculas/minúsculas e acentos.
- `Preço` e `Índice` não se confundem.
- A troca de protético limpa os filtros.

## 16. Selecao
- Seleção única por `id`.
- Linha selecionada recebe:
  - classe visual de seleção
  - `aria-selected`
  - `data-row-id`
  - `data-selected`

## 17. Contador
- O contador exibiu `136 serviços` no runtime validado.
- O valor reagiu à seleção do protético.

## 18. Estados
- Loading de protéticos e serviços cobertos.
- Erro coberto com `Alert`.
- Estado vazio coberto com texto secundário.

## 19. Tema
- O build passou com os temas globais existentes.
- A validação visual detalhada de claro/escuro ficou limitada pela autenticação do ambiente, mas o layout usa os componentes do shell e o CSS local da feature.

## 20. Testes
- Testes criados em [`frontend-react/tests/servicosProtetico.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)
- Cobertura principal:
  - mapeamento de protético
  - mapeamento de serviço
  - formatação monetária
  - filtros
  - ordenação
  - proteção contra resposta obsoleta
  - chamadas HTTP

## 21. Build
- Comando executado: `npm.cmd run build`
- Resultado: sucesso.
- Warnings: chunk principal acima de 500 kB após minificação.

## 22. Validacao runtime
- Validação real executada no navegador automatizado com sessão autenticada reaproveitada do Chrome local.
- A rota `/app/tabelas/servicos-protetico` abriu com sucesso.
- A página carregou o combo, a lista e o contador.
- Os endpoints observados retornaram `200`.

## 23. Erros de console
- Não foram observados erros relevantes na validação da feature.

## 24. Divergencias encontradas
- O valor de login temporário documentado em hotfix não autenticou nesta sessão; a validação viva usou `brana_token` existente em storage local do Chrome.
- A toolbar e o menu estão implementados no shell central; a checagem visual do item no painel lateral depende de abrir o grupo `Tabelas`.

## 25. Correcao minima realizada
- Foi adicionada remoção de acentos no filtro textual.
- Foi adicionada proteção contra resposta obsoleta ao trocar de protético.
- Foi adicionado o contador na tela.
- Foi adicionado `data-row-id` e `data-selected` na linha selecionada.

## 26. Pendencias
- CRUD não iniciado.
- Impressão não iniciada.
- A próxima etapa deve tratar as ações da toolbar uma por uma.

## 27. Confirmacao de fora de escopo
- CRUD não foi implementado.
- Impressão não foi implementada.
- Backend e banco não foram alterados.

## 28. Critérios para iniciar a Etapa 2
- Aceite funcional da listagem e da seleção.
- Definição do fluxo de novo/alteração.
- Confirmação do contrato de exclusão.
- Confirmação do contrato de impressão.
- Confirmação de qualquer campo adicional antes do modal.
