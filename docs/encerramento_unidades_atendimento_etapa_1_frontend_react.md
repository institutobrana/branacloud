# Encerramento - Unidades de atendimento, Etapa 1

## 1. Escopo realizado

- Item de menu em `Configurações`.
- Rota do novo frontend React em `/app/configuracoes/unidades-atendimento`.
- Integração com o shell padrão em `L`.
- Toolbar com `Nova unidade...`, `Altera...` e `Elimina` desabilitado.
- Listagem real com cinco colunas.
- Modal modular para inclusão e alteração.
- Validações de nome obrigatório.
- Testes automatizados leves.
- Validação real no navegador autenticado.

## 2. Documentos usados

- `docs/auditoria_unidades_atendimento_brana_easydental.md`
- `docs/contrato_implementacao_unidades_atendimento_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/unidades_subetapa_0_mapeamento_monolitico.md`
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md`
- `docs/unidades_subetapa_4_wrapper_status_html.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/auditoria_easydental_virgem_subetapa_4_clinica_unidade_configuracao.md`
- `docs/auditoria_easydental_virgem_subetapa_6_comparacao_seeds_brana.md`
- `docs/auditoria_easydental_virgem_subetapa_8k_implementacao_unidade_principal.md`

## 3. Arquitetura criada

- `frontend-react/src/features/unidadesAtendimento/UnidadesAtendimentoPage.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadesAtendimentoToolbar.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadesAtendimentoTable.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadeAtendimentoModal.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadeIdentificacaoSection.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadeEnderecoSection.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadeTelefonesSection.jsx`
- `frontend-react/src/features/unidadesAtendimento/components/UnidadeMetadataSection.jsx`
- `frontend-react/src/features/unidadesAtendimento/hooks/useUnidadesAtendimento.js`
- `frontend-react/src/features/unidadesAtendimento/services/unidadesAtendimentoApi.js`
- `frontend-react/src/features/unidadesAtendimento/utils/unidadeAtendimentoMappers.js`
- `frontend-react/src/features/unidadesAtendimento/utils/unidadeAtendimentoValidation.js`
- `frontend-react/src/features/unidadesAtendimento/constants/unidadeAtendimentoColumns.js`

## 4. Rota

- Rota consolidada: `/app/configuracoes/unidades-atendimento`
- Identificador funcional usado no shell: `unidades-atendimento`

## 5. Menu

- O item foi inserido em `Configurações` com o rótulo `Unidades de atendimento`.
- A ordem do grupo de Configurações permaneceu alfabética no contexto do menu vigente.

## 6. Toolbar

- `Nova unidade...` abre o modal vazio.
- `Altera...` exige seleção.
- `Elimina` permanece desabilitado.
- O texto de apoio informa que a exclusão aguarda definição das regras de proteção.

## 7. Tabela

- Colunas finais: `Código`, `Nome da unidade`, `Telefone 1`, `Telefone 2`, `Status`.
- Status exibido como `Ativo` ou `Inativo`, derivado de `ativo/inativo` da API.
- A seleção é única e o item criado/editado permanece selecionado após recarga.

## 8. Modal

- Campos de identificação, endereço, quatro blocos de telefone e metadados foram modularizados em seções.
- `nome` é obrigatório.
- `qtd_sala` permaneceu fora da UI nesta etapa.
- O `id` foi incluído como campo oculto para permitir `PUT` real.

## 9. Endpoints consumidos

- `GET /cadastros/unidades-atendimento`
- `GET /cadastros/unidades-atendimento/proximo-codigo`
- `POST /cadastros/unidades-atendimento`
- `PUT /cadastros/unidades-atendimento/{row_id}`

## 10. Regras preservadas

- Clínica continua resolvida pelo backend.
- `clinica_id` não é controlado pelo frontend.
- Exclusão não foi habilitada.
- O botão `Fecha` do legado não foi reproduzido.

## 11. Inclusão

- O modal busca o próximo código ao abrir.
- O código pode ser exibido e editado.
- O payload é enviado ao backend sem geração artificial no frontend.
- Após salvar, a lista é recarregada e o registro criado permanece selecionado.

## 12. Alteração

- O registro da linha selecionada é reutilizado para preencher o modal.
- O `PUT` usa o `id` real do item.
- O registro alterado é recarregado e permanece selecionado.

## 13. Exclusão

- O botão `Elimina` aparece, mas fica desabilitado.
- Nenhum `DELETE` foi chamado na validação da etapa.

## 14. Testes executados

- `node frontend-react/tests/unidadesAtendimento.contract.test.mjs`
- `node frontend-react/tests/unidadesAtendimento.routing.test.mjs`
- `cmd /c npm run build` em `frontend-react`

## 15. Validação no navegador

- Login realizado com sessão local de teste.
- A rota `/app/configuracoes/unidades-atendimento` abriu corretamente.
- A tabela exibiu cinco colunas.
- Foi criada uma unidade real.
- A mesma unidade foi alterada com sucesso.
- O botão `Elimina` permaneceu desabilitado.
- Nenhuma requisição `DELETE` foi disparada.

## 16. Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/app/routes.jsx`
- `frontend-react/src/features/unidadesAtendimento/*`
- `frontend-react/tests/unidadesAtendimento.contract.test.mjs`
- `frontend-react/tests/unidadesAtendimento.routing.test.mjs`
- `docs/11_roadmap_desenvolvimento.md`

## 17. Limitações

- A exclusão funcional permanece fora do escopo.
- Os registros criados na validação do navegador não foram removidos nesta etapa.
- Há avisos de compatibilidade do ambiente React/Antd observados no navegador, mas não bloqueantes para a tela.

## 18. Próxima etapa recomendada

- Definir o contrato de proteção da exclusão para liberar o botão `Elimina` de forma segura.
- Depois disso, implementar a etapa seguinte do módulo sem mexer no backend já consolidado.

## Auditoria corretiva da Etapa 1

- Contrato final do status: a API do backend segue oficialmente com `ativo` em GET/POST/PUT, enquanto o frontend interno trabalha com `inativo` como estado normalizado e converte apenas no mapper de saida.
- Regra final de `qtd_sala`: o valor nao fica na interface e nao e enviado por padrao no POST; no PUT ele e preservado a partir do registro carregado, evitando sobrescrita indevida.
- Payload final de criacao: `codigo`, `nome`, endereco, quatro blocos de telefone, `ativo`, `inclusao` e `alteracao`, sem `qtd_sala` artificial e sem campos tecnicos.
- Payload final de alteracao: `codigo`, `nome`, endereco, quatro blocos de telefone, `ativo`, `inclusao`, `alteracao` e `qtd_sala` preservado do registro atual.
- Registros de teste identificados na listagem real: `id=11` / `codigo=0002` / `nome=Unidade Codex Teste` e `id=12` / `codigo=0003` / `nome=Unidade Codex Teste Ajustada`.
- Registros removidos: nenhum, porque nao foi feita exclusao funcional nem limpeza destrutiva.
- Registros mantidos e motivo: os dois registros de teste permanecem no banco local para nao violar o bloqueio da etapa e para evitar exclusao manual fora do contrato.
- Investigacao do 404: o erro observado no navegador foi `GET http://127.0.0.1:5176/favicon.ico`, recurso global inexistente no shell, sem origem na feature de Unidades de atendimento.
- Validacoes repetidas: testes de contrato e roteamento, build do frontend React e navegacao autenticada com edicao real do registro `id=12`.
- Conclusao tecnica: a Etapa 1 ficou pronta para commit seletivo apenas no escopo da feature, com exclusao funcional ainda pendente de contrato.

## Correção visual e compactação do modal

- Referências usadas: imagem do modal legado enviada pelo usuário e a nova imagem React.
- Causa do tamanho excessivo: largura grande demais, seções com títulos extras, telefones em blocos verticais e metadados muito afastados.
- Organização anterior: cada seção carregava seu próprio título e a área de telefones usava labels repetidos por linha.
- Nova malha: `Código` + `Nome` na primeira linha; endereço em duas linhas; telefones com cabeçalho único e quatro linhas; checkbox após telefones; metadados lado a lado; ações no rodapé.
- Largura anterior e nova: a janela saiu de `560px` para `584px` para abrir um pouco a malha sem voltar ao excesso anterior.
- Altura/rolagem anterior e nova: o corpo ficou mais curto, com `max-height` reduzido para favorecer a visualização integral no desktop.
- Arquivos alterados: `frontend-react/src/features/unidadesAtendimento/components/UnidadeAtendimentoModal.jsx`, `frontend-react/src/features/unidadesAtendimento/components/UnidadeIdentificacaoSection.jsx`, `frontend-react/src/features/unidadesAtendimento/components/UnidadeEnderecoSection.jsx`, `frontend-react/src/features/unidadesAtendimento/components/UnidadeTelefonesSection.jsx`, `frontend-react/src/features/unidadesAtendimento/components/UnidadeMetadataSection.jsx`, `frontend-react/src/features/unidadesAtendimento/unidadesAtendimento.css`, `frontend-react/tests/unidadesAtendimento.contract.test.mjs`.
- Preservação funcional: payload, status, `qtd_sala`, inclusão, alteração e ausência de `DELETE` permaneceram intactos.
- Testes: contrato e roteamento continuaram verdes.
- Build: `npm run build` concluiu com sucesso.
- Validação no navegador: a nova malha ficou mais próxima do legado, com os campos principais em posições equivalentes.
- Resultado visual final: modal mais compacto, sem títulos de seção desnecessários e com distribuição interna mais fiel ao legado.
## Apendice - Auditoria funcional dos campos e combos

- O contrato do backend continua fechado com `ativo` nas respostas e `inativo` como estado interno normalizado no React.
- Os combos de `logradouro_tipo`, `bairro` e `cidade` foram ligados ao endpoint reaproveitado `/cadastros/auxiliares?tipo=...`.
- `UF` e tipos de telefone continuam vindo de listas estáveis do proprio contrato da feature.
- A malha visual do modal permaneceu inalterada.
- `qtd_sala` seguiu fora da UI e sem envio artificial por padrao.
- O botao `Elimina` permanece fora de escopo funcional.
- A validacao foi repetida com `unidadesAtendimento.contract.test.mjs`, `unidadesAtendimento.routing.test.mjs` e `npm run build`.
