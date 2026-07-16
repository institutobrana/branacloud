# Fechamento consolidado - `Serviços de protético` com `Código`, `Descrição` e `Novo serviço`

## 1. Objetivo

Consolidar a evolução da frente `Brana Cloud -> Tabelas -> Serviços de protético`, fechando o ciclo técnico de banco, backend, frontend React, testes e validação runtime para os contratos `Código`, `Descrição` e `Novo serviço`.

## 2. Commit-base

- Base funcional da listagem React: `ee586bdc feat(servicos-protetico): consolida listagem no frontend React`

## 3. Decisões funcionais

- `id` continua técnico.
- `codigo` passa a ser o código de negócio exibido na grade.
- `descricao` passa a ser observação multilinha do serviço.
- `Novo serviço` ficou funcional.
- `Altera`, `Elimina` e `Imprime` permanecem pendentes.

## 4. Banco

- Tabela: `servico_protetico`
- Colunas novas: `codigo`, `descricao`
- `codigo`: `String(30)`, nullable na transição
- `descricao`: `Text`, nullable na transição
- unicidade: `clinica_id + protetico_id + codigo`

## 5. Script aditivo

Arquivo:

- [backend/scripts/migrar_servico_protetico_codigo_descricao.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/scripts/migrar_servico_protetico_codigo_descricao.py)

O script:

- adiciona `codigo` e `descricao`;
- faz backfill de `codigo` com `id` textual apenas quando necessário;
- verifica duplicidades antes do índice único;
- cria o índice único `uq_servico_protetico_clinica_protetico_codigo`;
- não apaga dados;
- não altera `prazo`.

## 6. Backfill

- Backfill aplicado localmente com sucesso.
- Registros sem código receberam `codigo = id::text`.
- Códigos já existentes foram preservados.

## 7. Unicidade

- A unicidade foi fixada por clínica, protético e código.
- Conflitos retornam `409`.

## 8. Model

Arquivo:

- [backend/models/protetico.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/protetico.py)

Pontos principais:

- `codigo` em `String(30)`
- `descricao` em `Text`
- `codigo` indexado
- constraint de unicidade por `clinica_id + protetico_id + codigo`

## 9. GET

Arquivo:

- [backend/routes/proteticos_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/proteticos_routes.py)

Listagem de serviços:

- retorna `codigo`
- retorna `descricao`
- mantém os campos antigos

## 10. POST

- `POST /proteticos/{protetico_id}/servicos`
- aceita payload antigo e novo
- cria com `codigo` e `descricao` quando enviados
- continua aceitando o contrato anterior sem esses campos

## 11. PUT

- `PUT /proteticos/servicos/{servico_id}`
- mantém compatibilidade com payload antigo e novo
- valida duplicidade de `codigo`

## 12. Compatibilidade

- O contrato antigo continua funcionando.
- O contrato novo já está disponível.
- O frontend legado não foi alterado.

## 13. Testes backend

- [backend/tests/test_servicos_protetico_codigo_descricao.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_servicos_protetico_codigo_descricao.py)

Cobertura:

- migração;
- backfill;
- leitura;
- criação;
- edição;
- duplicidade.

## 14. Frontend React

Arquivos principais:

- [frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/ServicosProteticoPage.jsx)
- [frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx)
- [frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ProteticoSelect.jsx)
- [frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx)
- [frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx)
- [frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx)
- [frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicoProteticoCreate.js)
- [frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/hooks/useServicosProtetico.js)
- [frontend-react/src/features/servicosProtetico/servicosProteticoApi.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProteticoApi.js)
- [frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js)
- [frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoValidators.js)
- [frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoMappers.js)
- [frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/utils/servicosProteticoFilters.js)

## 15. Coluna Código

- A grade passou a exibir `codigo`.
- `id` segue como chave técnica.
- filtro e ordenação usam `codigo`.

## 16. Modal

- `Novo serviço de protético`
- modal compacto
- protético somente leitura
- botão salvar com bloqueio de dupla submissão

## 17. Campos

- `Código`
- `Nome do serviço`
- `Índice`
- `Preço`
- `Prazo (Tempo médio em dias)`
- `Descrição`

## 18. Prazo spin

- `Prazo` usa `InputNumber`
- inteiro
- passo `1`
- mínimo `0`

## 19. Descrição

- campo multilinha
- opcional
- texto puro

## 20. Compactação visual

- `Índice` e `Preço` dividem a mesma linha.
- o modal ficou mais curto sem perder o contrato.

## 21. Validações

- `codigo` obrigatório
- `nome` obrigatório
- `preco` válido
- `prazo` inteiro
- `descricao` opcional

## 22. Payload

Exemplo final:

```json
{
  "codigo": "PRT-001",
  "nome": "Serviço exemplo",
  "indice": "R$",
  "preco": 100.5,
  "prazo": 7,
  "descricao": "Texto opcional"
}
```

## 23. Duplo envio

- bloqueado no hook de criação
- modal mantém estado de envio

## 24. Refresh

- a listagem recarrega após sucesso
- o novo registro é selecionado por `id`

## 25. Contador

- o contador continua representando os serviços do protético selecionado

## 26. Seleção

- a seleção da linha usa `id`
- o novo registro é destacado após o POST

## 27. Validação runtime

- login autenticado validado
- rota do módulo aberta
- modal de novo serviço aberto
- salvamento real validado
- exclusão do registro temporário validada

## 28. Limpeza do registro de teste

- o serviço temporário criado para validação foi removido com sucesso

## 29. Testes frontend

- [frontend-react/tests/servicosProtetico.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)

## 30. Build

- `npm.cmd run build` concluído com sucesso
- warning de chunk grande preservado como warning

## 31. Segurança

- nenhuma credencial foi versionada neste fechamento
- nenhuma alteração de autenticação foi realizada
- nenhum token, cookie ou senha entrou no commit

## 32. Arquivos incluídos

- backend/modelo
- backend/rota
- backend/script aditivo
- backend/teste
- frontend React da feature
- teste frontend
- documentos da evolução

## 33. Arquivos compartilhados

- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)
- [docs/validacao_runtime_servicos_protetico_novo_servico_frontend_react.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/validacao_runtime_servicos_protetico_novo_servico_frontend_react.md)

## 34. Riscos

- o `codigo` ainda depende de governança de negócio para futuras edições;
- a etapa de alteração e impressão continua fora deste commit;
- arquivos de outras frentes seguem sujos no worktree e precisam ser preservados.

## 35. Pendências

- `Altera`
- `Elimina`
- `Imprime`

## 36. Próxima etapa: Altera

- próximo foco funcional natural: habilitar a edição do serviço de protético

## 37. Estado final

- `Altera` não foi implementado
- `Elimina` não foi implementado
- `Imprime` não foi implementado
