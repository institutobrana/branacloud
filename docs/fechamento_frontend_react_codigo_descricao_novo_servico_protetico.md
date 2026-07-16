# Fechamento frontend React - `Serviços de protético` com `Código` e `Novo serviço`

## 1. Objetivo

Fechar a etapa C da frente `Tabelas -> Serviços de protético` no novo frontend React do Brana Cloude, usando o contrato backend já concluído para `codigo` e `descricao`, sem alterar backend, banco, frontend legado ou impressão.

## 2. Contratos backend usados

- `GET /proteticos`
- `GET /proteticos/{protetico_id}/servicos`
- `POST /proteticos/{protetico_id}/servicos`
- retorno de serviço com `id`, `codigo`, `descricao`, `nome`, `indice`, `preco`, `prazo`, `protetico_id`

O React passou a consumir `codigo` e `descricao` diretamente, mantendo `id` apenas como chave técnica da linha.

## 3. Arquivos alterados

### Feature React

- [`frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx`](../frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProteticoApi.js`](../frontend-react/src/features/servicosProtetico/servicosProteticoApi.js)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx`](../frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx)
- [`frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js`](../frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js)
- [`frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js`](../frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js`](../frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js`](../frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js`](../frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js)
- [`frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js`](../frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js)
- [`frontend-react/tests/servicosProtetico.test.js`](../frontend-react/tests/servicosProtetico.test.js)

## 4. Modularização

A implementação ficou dividida em:

- `ServicosProteticoPage.jsx`: coordena estado, refresh, seleção e abertura do modal.
- `ServicosProteticoToolbar.jsx`: expõe o botão `Novo serviço...` e o combo `Protético`.
- `ServicosProteticoTable.jsx`: renderiza a grade compacta com cinco colunas.
- `ServicoProteticoModal.jsx`: estrutura o modal de criação.
- `ServicoProteticoForm.jsx`: concentra os campos do formulário.
- `useServicoProteticoCreate.js`: encapsula o POST e o estado de envio.
- `servicosProteticoCreatePayload.js`: normaliza o payload.
- `servicosProteticoValidators.js`: aplica validações locais.
- `servicosProteticoMappers.js`: adapta retorno da API.
- `servicosProteticoFilters.js`: filtra e ordena a listagem.

## 5. Coluna Código

- A coluna visual `Código` passa a exibir `codigo`.
- `id` segue como chave técnica de linha.
- Não foi criada coluna separada de `ID`.
- Filtro e ordenação da coluna `Código` passaram a operar sobre `codigo`.

## 6. Uso de `codigo`

- `codigo` é enviado no `POST /proteticos/{protetico_id}/servicos`.
- O valor é trimado.
- Preserva zeros à esquerda.
- Preserva hífen e caixa.
- Não é convertido para número.

## 7. Preservação do `id`

- `id` continua sendo usado em:
  - `rowKey`
  - seleção da linha
  - seleção do novo registro após salvar
- `id` não é exibido como código de negócio.

## 8. Filtro

- O filtro da coluna `Código` ficou ligado a `codigo`.
- O filtro de `Índice` continua compatível com o contrato textual existente.
- A listagem preserva filtros por coluna e visibilidade.

## 9. Ordenação

- A ordenação da coluna `Código` passou a usar o valor textual de `codigo`.
- A ordenação da listagem continua funcionando nas demais colunas.

## 10. Botão Novo

- `Novo serviço...` fica habilitado apenas com protético selecionado e sem loading.
- O botão não depende de linha selecionada.
- Os botões `Altera...`, `Elimina` e `Imprime...` permanecem desabilitados.

## 11. Modal

- Título: `Novo serviço de protético`
- Modal compacto.
- O protético é somente leitura.
- O envio é bloqueado durante `saving`.
- O modal fica aberto em caso de erro.

## 12. Protético

- O protético selecionado é capturado na abertura do modal.
- A troca de protético durante o cadastro é bloqueada por validação de contexto.
- O body do `POST` não envia `protetico_id`, porque o ID já segue no path.

## 13. Código

- Campo obrigatório.
- Máximo de 30 caracteres.
- Trim nas extremidades.
- Sem conversão numérica.

## 14. Nome do serviço

- Campo obrigatório.
- Máximo de 180 caracteres.
- Sem alteração de caixa.

## 15. Índice

- Continua textual.
- Campo separado do preço.
- Preserva o contrato atual do backend.

## 16. Preço

- Campo monetário.
- Formatação pt-BR na UI.
- Payload numérico.
- Zero preservado.

## 17. Prazo como spin

- Usa `InputNumber`.
- Passo `1`.
- Mínimo `0`.
- Inteiro.
- Sem texto livre.

## 18. Descrição

- Campo multilinha.
- Opcional.
- Trim nas extremidades.
- Vazio vira `null` no payload.

## 19. Payload

O payload final do `POST` ficou assim:

```json
{
  "codigo": "PRT-001",
  "nome": "Nome do serviço",
  "indice": "R$",
  "preco": 100.5,
  "prazo": 7,
  "descricao": "Texto opcional"
}
```

Sem:

- `id`
- `protetico_id`
- `clinica_id`
- campos de UI

## 20. Validações

- `codigo` obrigatório
- `codigo` com no máximo 30 caracteres
- `nome` obrigatório
- `nome` com no máximo 180 caracteres
- `preco` válido
- `prazo` inteiro e não negativo
- `descricao` opcional

## 21. Duplo envio

- O hook de criação bloqueia submissão concorrente.
- O botão salvar mostra loading.
- O modal impede fechamento indevido enquanto o envio está ativo.

## 22. Erro

- Erro de backend permanece visível no modal.
- O modal continua aberto.
- Os campos digitados são preservados.

## 23. Sucesso

- O modal fecha somente após sucesso.
- A lista é recarregada.
- O contador é atualizado.
- A nova linha é selecionada pelo `id`.

## 24. Refresh

- O refresh é feito pelo mecanismo já existente da feature.
- Filtros são limpos após o sucesso para garantir visibilidade do novo registro.
- A visibilidade de colunas foi preservada.

## 25. Contador

- O contador do rodapé continua mostrando o total de serviços do protético selecionado.

## 26. Seleção

- A seleção da linha continua sendo por `id`.
- A seleção do novo registro é feita pelo `id` retornado no POST.

## 27. Filtros após criação

- Os filtros são limpos após sucesso para não ocultar o novo serviço.

## 28. Visibilidade

- A visibilidade de colunas continua funcionando.
- A coluna `Código` segue ocultável.

## 29. Tema claro

- Validado por build e pela herança do shell.

## 30. Tema escuro

- Preservado pelo shell e pelos tokens já utilizados na feature.

## 31. Testes

Arquivo validado:

- [`frontend-react/tests/servicosProtetico.test.js`](../frontend-react/tests/servicosProtetico.test.js)

Coberturas principais:

- normalização de `codigo` e `descricao`
- payload de criação
- validações
- listagem com `codigo`
- filtro e ordenação por `codigo`
- contrato visual da tabela
- contrato visual da página
- contrato da CSS da feature

## 32. Build

Comando executado:

```bash
npm.cmd run build
```

Resultado:

- build concluído com sucesso
- warning de chunk grande

## 33. Runtime

A validação runtime completa com navegador autenticado e API real não foi executada nesta passagem, mas a suíte automatizada e o build passaram.

## 34. Registro criado

Nesta etapa foi mantido o foco na UI e no contrato do formulário. Não houve criação de registro em banco nesta passagem.

## 35. Limitações

- `Altera`, `Elimina` e `Imprime` continuam pendentes.
- A validação runtime ainda precisa de execução manual autenticada.
- O contrato de `Índice` segue textual e não foi reinterpretado como preço.

## 36. Altera pendente

Permanece desabilitado.

## 37. Elimina pendente

Permanece desabilitado.

## 38. Imprime pendente

Permanece desabilitado.

## 39. Backend e banco

- Nenhum endpoint novo foi criado.
- Nenhuma migration nova foi criada.
- Nenhuma alteração adicional de backend ou banco foi feita nesta etapa.

## 40. Conclusão

O frontend React da frente `Serviços de protético` passou a exibir `Código` a partir de `codigo`, a abrir o modal funcional de `Novo serviço`, a aceitar `descricao`, a tratar `prazo` como spin e a postar o contrato já acordado com o backend.
