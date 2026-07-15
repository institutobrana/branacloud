# Auditoria Comparativa de Padrões React para Plano de Contas

## 1. Objetivo

Identificar, com evidência real, quais padrões já consolidados no frontend React do Brana Cloud devem ser reutilizados na futura implementação do módulo `Configurações -> Plano de contas`.

## 2. Documentos lidos

- [`docs/plano_contas_subetapa_0_mapeamento_monolitico.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_0_mapeamento_monolitico.md)
- [`docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_1_estrutura_modular_passiva.md)
- [`docs/plano_contas_subetapa_2_fronteiras_contratos.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_2_fronteiras_contratos.md)
- [`docs/plano_contas_subetapa_3_helpers_puros.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_3_helpers_puros.md)
- [`docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md)
- [`docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md)
- [`docs/auditoria_plano_de_contas_frontend_legado.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_frontend_legado.md)
- [`docs/auditoria_plano_de_contas_easydental_desktop.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_plano_de_contas_easydental_desktop.md)
- [`docs/mapeamento_dados_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/mapeamento_dados_plano_de_contas.md)
- [`docs/contrato_funcional_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [`docs/contrato_visual_plano_de_contas_frontend_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_visual_plano_de_contas_frontend_react.md)
- [`docs/roadmap_plano_de_contas_frontend_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roadmap_plano_de_contas_frontend_react.md)
- [`docs/00_master_guide.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/00_master_guide.md)
- [`docs/02_arquitetura.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/02_arquitetura.md)
- [`docs/03_mapa_codigo.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/03_mapa_codigo.md)
- [`docs/06_seguranca.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/06_seguranca.md)
- [`docs/10_continuidade.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/10_continuidade.md)
- [`docs/11_roadmap_desenvolvimento.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)

## 3. Módulos React auditados

Auditados como referência principal:

1. `Materiais`
2. `Procedimentos`
3. `Procedimentos genéricos`
4. `Doenças/CID`
5. `Tabelas auxiliares`
6. `Preferências`
7. `Cenário anual`

Referências adicionais usadas quando traziam padrão diretamente reaproveitável:

1. `Dashboard`
2. `Ficha clínica`
3. `Pacientes`

## 4. Arquivos encontrados

### Shell e navegação

- [`frontend-react/src/app/App.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx)
- [`frontend-react/src/app/routes.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/routes.jsx)
- [`frontend-react/src/layout/BranaShell.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaShell.jsx)
- [`frontend-react/src/layout/BranaSidebar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaSidebar.jsx)
- [`frontend-react/src/layout/BranaActionTopbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaActionTopbar.jsx)
- [`frontend-react/src/layout/BranaTopbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaTopbar.jsx)
- [`frontend-react/src/layout/BranaWorkspace.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaWorkspace.jsx)
- [`frontend-react/src/layout/BranaContextPanel.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaContextPanel.jsx)
- [`frontend-react/src/layout/BranaIconRail.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaIconRail.jsx)

### Tabelas e filtros

- [`frontend-react/src/components/BranaTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaTable.jsx)
- [`frontend-react/src/components/TableColumnFilterHeader.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/TableColumnFilterHeader.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)

### Modais

- [`frontend-react/src/components/BranaModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaModal.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidModal.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidDeleteModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidDeleteModal.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisTabelaModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisTabelaModal.jsx)
- [`frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx)
- [`frontend-react/src/features/cenarioAnual/CenarioAnualModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/CenarioAnualModal.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx)

### Hooks, serviços e mapeadores

- [`frontend-react/src/features/doencasCid/hooks/useDoencasCid.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/hooks/useDoencasCid.js)
- [`frontend-react/src/features/doencasCid/doencasCidApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/doencasCidApi.js)
- [`frontend-react/src/features/materiaisEstoque/materiaisEstoqueApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/materiaisEstoqueApi.js)
- [`frontend-react/src/features/procedimentos/procedimentosApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosApi.js)
- [`frontend-react/src/features/procedimentos/procedimentosEditorMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosEditorMappers.js)
- [`frontend-react/src/features/procedimentos/procedimentosEditorValidators.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosEditorValidators.js)
- [`frontend-react/src/features/procedimentos/procedimentosFinanceiroMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosFinanceiroMappers.js)
- [`frontend-react/src/features/procedimentos/procedimentosMateriaisApi.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosMateriaisApi.js)
- [`frontend-react/src/features/procedimentos/procedimentosMateriaisMappers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/procedimentosMateriaisMappers.js)
- [`frontend-react/src/features/procedimentos/hooks/useProcedimentoEditor.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/hooks/useProcedimentoEditor.js)
- [`frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js)
- [`frontend-react/src/features/procedimentos/hooks/useProcedimentoFinanceiro.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/hooks/useProcedimentoFinanceiro.js)
- [`frontend-react/src/features/procedimentos/hooks/useProcedimentoMateriais.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentos/hooks/useProcedimentoMateriais.js)
- [`frontend-react/src/features/cenarioAnual/hooks/useCenarioAnual.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/hooks/useCenarioAnual.js)
- [`frontend-react/src/features/cenarioAnual/utils/cenarioAnualValidation.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/utils/cenarioAnualValidation.js)
- [`frontend-react/src/features/cenarioAnual/utils/cenarioAnualNormalizers.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/utils/cenarioAnualNormalizers.js)
- [`frontend-react/src/features/cenarioAnual/utils/cenarioAnualCalculations.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/utils/cenarioAnualCalculations.js)

### Tema e estilos

- [`frontend-react/src/styles/globals.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/styles/globals.css)
- [`frontend-react/src/theme/branaTokens.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/theme/branaTokens.css)
- [`frontend-react/src/theme/branaTheme.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/theme/branaTheme.js)

### Testes

- [`frontend-react/tests/authApi.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/authApi.test.js)
- [`frontend-react/tests/AuthProvider.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/AuthProvider.test.js)
- [`frontend-react/tests/authStorage.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/authStorage.test.js)
- [`frontend-react/tests/authRenewalController.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/authRenewalController.test.js)
- [`frontend-react/tests/authBrowserSessionSync.test.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/authBrowserSessionSync.test.js)

## 5. Comparação de shell

### Principal referência

- `[`frontend-react/src/app/App.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/app/App.jsx)` e [`frontend-react/src/layout/BranaShell.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaShell.jsx)

### Evidência

- A estrutura do app usa `BranaIconRail`, `BranaContextPanel` e `BranaWorkspace` no mesmo shell.
- O shell é baseado em `Layout.Sider` e `Layout.Header`.
- A barra lateral e a barra superior já formam uma composição visual próxima do contrato de `L`.

### Conclusão

- O módulo de referência mais próximo para o shell é `Dashboard`/shell global via `App.jsx` + `BranaShell`.
- O padrão global é de shell com rail lateral, topbar e workspace separado.

## 6. Comparação de toolbars

### Principais referências

- [`frontend-react/src/layout/BranaActionTopbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/layout/BranaActionTopbar.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)

### Padrão encontrado

- Barra compacta com botões pequenos.
- Agrupamento por blocos com divisores.
- Ações principais na esquerda e filtros na direita.
- Uso de `disabled` quando não há seleção.
- Uso de evento global em alguns módulos para desacoplar toolbar da tela.

### Melhor referência para Plano de contas

- `Doencas/CID` para toolbar curta, com ações e busca.
- `Materiais` e `Procedimentos` para botões agrupados com filtros.

### Recomendação

- Usar uma toolbar única e compacta.
- Contexto ativo deve ser explícito.
- `Alterar` e `Eliminar` precisam ser desabilitados sem seleção válida.

## 7. Comparação de tabelas

### Principais referências

- [`frontend-react/src/components/BranaTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaTable.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)

### Padrão encontrado

- Tabelas compactas com `size="small"` e `tableLayout="fixed"`.
- Colunas com `TableColumnFilterHeader`.
- Seleção por rádio para item único.
- `rowSelection` + `onRow` + classe de linha selecionada.
- `pagination={false}` em algumas telas e paginação local/ remota em outras.

### Melhor referência para Plano de contas

- `Doencas/CID` para seleção, filtro e paginação local.
- `Materiais` para tabela compacta com coluna configurável.
- `Procedimentos genéricos` para combinação de seleção + filtro + reuso de header filtrável.

### Recomendação

- Para Plano de contas, o contrato deve usar duas tabelas compactas lado a lado.
- A tabela de categorias deve ser derivada do grupo selecionado.

## 8. Comparação de seleção

### Principais referências

- [`frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)

### Padrão encontrado

- `selectedRowKeys` em seleção única.
- `rowClassName` para destacar a linha ativa.
- `aria-selected` e `data-*` em `Doencas/CID`.
- Preservação de seleção quando o item ainda existe após recarregar.
- Limpeza de seleção ao paginar ou quando o item deixa de existir.

### Melhor referência para Plano de contas

- `Doencas/CID` é a melhor referência para seleção formal.
- `Materiais` é bom para preservação de seleção após troca de lista.

### Recomendação

- Grupo deve usar seleção controlada e atualizar categorias.
- Categoria deve limpar ou redefinir quando o grupo mudar.
- Alterar/Eliminar devem ler o contexto ativo e a seleção vigente.

## 9. Comparação de filtros e paginação

### Padrão encontrado

- `Doencas/CID` usa busca global e paginação local.
- `Materiais` usa filtros por lista/classificação/busca.
- `Procedimentos genéricos` usa busca e especialidade.
- `TableColumnFilterHeader` dá acesso a ordenação e visibilidade de colunas.

### Recomendação para Plano de contas

- Não há evidência de necessidade de paginação para grupos/categorias.
- Scroll simples deve ser suficiente.
- Busca por coluna não foi confirmada como necessária.
- O padrão mais coerente é filtro leve e seleção clara, não paginação complexa.

## 10. Comparação de modais

### Principal referência

- [`frontend-react/src/components/BranaModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/components/BranaModal.jsx)

### Bons exemplos

- [`frontend-react/src/features/doencasCid/components/DoencaCidModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidModal.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisTabelaModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisTabelaModal.jsx)
- [`frontend-react/src/features/cenarioAnual/CenarioAnualModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/cenarioAnual/CenarioAnualModal.jsx)

### Padrão encontrado

- `BranaModal` como wrapper base.
- Formulários com `destroyOnClose`, `maskClosable`, `confirmLoading`.
- Modo inclusão/edição no mesmo modal.
- Confirmação de exclusão em modal separado quando necessário.

### Melhor referência para Plano de contas

- `Doencas/CID` para modal simples de cadastro.
- `Materiais` para modais de inclusão/edição mais densos.

### Recomendação

- Modal de grupo: simples, compacto, com nome e tipo.
- Modal de categoria: simples, com nome, tipo, grupo e tributável.
- Migração deve usar modal específico de confirmação/seleção de destino.

## 11. Comparação de exclusão

### Principais referências

- [`frontend-react/src/features/doencasCid/components/DoencaCidDeleteModal.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/doencasCid/components/DoencaCidDeleteModal.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)

### Padrão encontrado

- Confirmação explícita.
- Botão perigoso com `danger`.
- Mensagem contextual com nome/código do item.
- Modal bloqueia fechamento quando a operação está em andamento.

### Melhor referência para Plano de contas

- `Doencas/CID` para confirmação simples.
- `Materiais` para exclusão com impacto em cascata e aviso mais forte.

### Recomendação

- Grupo exclui com confirmação e bloqueio se possuir categorias.
- Categoria exclui com confirmação e, se estiver em uso, exige fluxo intermediário de migração.

## 12. Padrão recomendado para migração

### Evidência real

- Não existe um componente reutilizável direto para migração de categoria no conjunto auditado.
- O mais próximo é o uso de modal de confirmação/seleção e alertas em `Materiais`.

### Recomendação

- Construção futura com:
  - modal base `BranaModal`
  - formulário simples de seleção de destino
  - confirmação explícita
  - botão perigoso somente na etapa final

## 13. Comparação de hooks, serviços e mapeadores

### Padrão encontrado

- Serviços ficam em `src/features/*/*Api.js` e `src/services/api.js`.
- Hooks concentram estado, seleção, paginação, loading, erro e mutações.
- Mapeadores e validadores ficam próximos do domínio em `procedimentos`.

### Melhor referência para Plano de contas

- `useDoencasCid` para fluxo de estado, seleção, modal, loading e erro.
- `useProcedimentoEditor` e mapeadores de `procedimentos` para separação de contratos e regras.
- `Materiais` para orquestração com múltiplas listas e modais.

### Recomendação

- Futuro Plano de contas deve ter:
  - página orquestradora
  - hook de dados
  - hook de seleção/contexto
  - serviço de API
  - mapeadores
  - validações
  - modais separados

## 14. Padrão de tema claro e escuro

### Evidência real

- [`frontend-react/src/theme/branaTokens.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/theme/branaTokens.css)
- [`frontend-react/src/theme/branaTheme.js`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/theme/branaTheme.js)
- [`frontend-react/src/styles/globals.css`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/styles/globals.css)

### Padrão encontrado

- Tokens globais com superfícies, textos, bordas e tabelas.
- Tema escuro troca superfícies, bordas, texto e realce.
- Tabelas, modais, inputs e dropdowns já respeitam as variáveis globais.

### Recomendação

- Plano de contas deve reutilizar os tokens globais.
- Não duplicar CSS local para superfícies e seleção se o token global já existir.
- Evitar blocos brancos no dark mode usando `brana-surface-panel`, `brana-surface-table` e `brana-surface-modal`.

## 15. Padrão de loading, erro e estado vazio

### Evidência real

- `Doencas/CID` mostra loading, erro e vazio.
- `Materiais` e `Procedimentos genéricos` também tratam erro, loading e empty state.
- `Cenario anual` usa `Spin` e `Alert` para estados de carregamento e erro.

### Recomendação para Plano de contas

- Estados obrigatórios:
  - carregando grupos
  - erro ao carregar grupos
  - nenhum grupo cadastrado
  - grupo selecionado sem categorias
  - erro ao carregar categorias
  - salvamento em andamento
  - exclusão em andamento
  - migração em andamento

## 16. Padrão de testes

### Evidência real

- Apenas testes de auth foram localizados em `frontend-react/tests`.
- Não foi localizado conjunto de testes para shell, tabelas, modais ou seleção dos módulos auditados.

### Conclusão

- Não existe cobertura de teste reutilizável direta para Plano de contas entre os módulos já finalizados.
- O contrato futuro deve incluir testes novos para seleção, transformação de dados, payload e migração.

## 17. Matriz de reutilização

| Necessidade do Plano de contas | Módulo React de referência | Arquivo/componente | Padrão encontrado | Pode ser reutilizado diretamente | Precisa adaptação | Não reutilizar | Justificativa | Risco | Observação |
|---|---|---|---|---|---|---|---|---|---|
| Shell em `L` | Shell global | `App.jsx`, `BranaShell`, `BranaSidebar`, `BranaActionTopbar`, `BranaWorkspace` | Rail lateral + topbar + workspace | Sim | Parcial | Não | A estrutura visual já é a mais próxima do contrato | Baixo | Ajustar altura/largura e banda superior |
| Menu | Shell global | `App.jsx`, `BranaSidebar` | Menu lateral por grupos | Sim | Parcial | Não | Existe submenu de `Configuração` com item `Plano de contas` já marcado como disabled | Baixo | Só para aderência visual futura |
| Rota | `App.jsx` | `routes.jsx`, `App.jsx` | Navegação por pathname | Parcial | Sim | Não | A convenção atual não inclui a rota final do Plano de contas | Médio | Aderência ainda é apenas de convenção |
| Toolbar | `Doenças/CID`, `Materiais`, `Procedimentos genéricos` | `DoencaCidToolbar`, topbars de `App.jsx` | Toolbar compacta com ações + busca | Sim | Sim | Não | Melhor base para barra compacta de ações | Baixo | `Doencas/CID` é a melhor base de contexto ativo |
| Botões | `Doenças/CID`, `Materiais` | `DoencaCidToolbar`, `MateriaisEstoquePage` | Botões habilitados/desabilitados por seleção | Sim | Sim | Não | Controles por seleção já existem | Baixo | Usar contexto ativo para evitar ambiguidade |
| Tabelas | `Doenças/CID`, `Materiais`, `Procedimentos genéricos` | `BranaTable`, `DoencaCidTable`, `ProcedimentosGenericosPage` | Tabela compacta com seleção e filtros | Sim | Sim | Não | Base sólida para duas tabelas lado a lado | Baixo | Grupo à esquerda e categoria à direita |
| Filtros | `Procedimentos genéricos`, `Materiais`, `Doenças/CID` | `TableColumnFilterHeader`, toolbar filters | Busca e ordenação leves | Sim | Sim | Não | Plano de contas não precisa de filtro pesado | Baixo | Evitar paginação se possível |
| Seleção | `Doenças/CID`, `Materiais` | `rowSelection`, `rowClassName`, `aria-selected`, `data-*` | Seleção única, foco e preservação | Sim | Sim | Não | Melhor contrato para contexto ativo | Baixo | Útil para grupo e categoria |
| Painel ativo | Shell global | `BranaContextPanel`, `BranaIconRail` | Contexto visual e navegação | Parcial | Sim | Não | Bom para indicar entidade ativa | Médio | Não confundir com seleção da tabela |
| Modal | `Doenças/CID`, `Materiais`, `Cenário anual` | `BranaModal`, modais de domínio | Modal base reutilizável | Sim | Sim | Não | Base comum para grupo, categoria e migração | Baixo | `BranaModal` deve ser o wrapper |
| Confirmação | `Doenças/CID`, `Materiais` | delete modal / `Modal` | Confirmação perigosa clara | Sim | Sim | Não | Necessário para exclusão protegida | Baixo | Migração precisa etapa extra |
| Migração | `Materiais` (somente como analogia) | sem componente direto | Não existe componente direto | Não | Sim | Não | Não há modal de migração reaproveitável direto | Médio | Compor com `BranaModal` |
| Serviço de API | `auth`, `procedimentos`, `materiais`, `cid` | `*Api.js`, `services/api.js` | API por domínio | Sim | Sim | Não | Padrão consistente do projeto | Baixo | Seguir separação por feature |
| Hook | `useDoencasCid`, `useCenarioAnual`, `useProcedimentoEditor` | hooks por feature | Estado e ações centralizados | Sim | Sim | Não | Melhor para orquestrar lista e seleção | Baixo | Plano de contas precisa de hook próprio |
| Estado vazio | `Doenças/CID`, `Materiais`, `Cenário anual` | `emptyText`, `Typography.Text`, `Alert` | Mensagem simples e explícita | Sim | Sim | Não | Padrão claro e reutilizável | Baixo | Separar vazio por grupo/categoria |
| Loading | `Doenças/CID`, `Cenário anual` | `loading`, `Spin`, `confirmLoading` | Indicação clara de operação | Sim | Sim | Não | Requisito obrigatório para grupos e categorias | Baixo | UI deve bloquear ações durante mutação |
| Erro | `Doenças/CID`, `Materiais`, `Cenário anual` | `message.error`, `Typography.Text type="danger"`, `Alert` | Erro explícito e não silencioso | Sim | Sim | Não | Plano de contas precisa do mesmo padrão | Baixo | Incluir erro ao carregar grupo e categoria |
| Tema escuro | Shell global | `branaTokens.css`, `branaTheme.js`, `globals.css` | Tokens globais claros/escuros | Sim | Parcial | Não | Base global já cobre tabelas, modais e inputs | Baixo | Evitar CSS novo redundante |
| Testes | auth | `frontend-react/tests/*` | Apenas auth testado | Não | Sim | Não | Não há referência direta para Plano de contas | Médio | Precisará criar suíte nova |

## 18. Arquitetura modular recomendada

- Página orquestradora
- Toolbar
- Painel de grupos
- Tabela de grupos
- Painel de categorias
- Tabela de categorias
- Hook de dados
- Hook de seleção/contexto ativo
- Serviço de API
- Mapeadores
- Modal de grupo
- Modal de categoria
- Modal de migração
- Validações
- Tipos
- Testes

## 19. Escopo da primeira implementação

### Deve incluir

- Registro no menu
- Rota
- Página
- Shell
- Toolbar com ações desabilitadas ou parcialmente inativas
- Painel de grupos
- Painel de categorias
- Carregamento dos grupos
- Seleção de grupo
- Apresentação das categorias
- Seleção de categoria
- Estados de loading, erro e vazio
- Tema claro e escuro
- Responsividade básica
- Testes dos helpers e da seleção

### Não deve incluir

- Criação
- Alteração
- Exclusão
- Migração
- Preferências
- Impressão
- Detalhes não confirmados
- Mudanças no backend
- Mudanças no banco

## 20. Critérios de aceite da primeira implementação

1. A página abre no shell correto.
2. O layout mestre-detalhe é visível.
3. A seleção de grupo carrega categorias.
4. A seleção de categoria funciona.
5. Estados de loading e vazio existem.
6. O tema escuro não quebra superfícies, tabelas e modais.
7. A toolbar não executa ações ainda não autorizadas.
8. Não há ambiguidade visual entre grupo e categoria.

## 21. Riscos

- Reutilizar um shell que é muito genérico sem ajustar o contexto ativo.
- Copiar padrão de tabela único onde o contrato agora exige duas tabelas.
- Incluir paginação ou filtros excessivos sem necessidade real.
- Criar modal de migração sem um padrão direto já existente.
- Duplicar CSS local em vez de usar tokens globais.

## 22. Pontos não confirmados

- Componente reutilizável direto para migração
- Padrão pronto de mestre-detalhe em produção
- Rota final já existente para o novo módulo
- Testes de tabela/seleção/modais além de auth
- Detalhamento exato de estilos do futuro Plano de contas

## 23. Próximo passo

Fechar um documento de implementação inicial do Plano de contas com base nesta matriz, priorizando shell, layout mestre-detalhe, seleção e estados, sem entrar em CRUD.