# Contrato funcional - Medicamentos no novo frontend React

## 1. Objetivo
Definir o contrato funcional da frente `Tabelas -> Medicamentos` no novo frontend React do Brana Cloud, com base no comportamento confirmado no legado do Brana Cloud, nas dependencias reais do backend e nas restricoes observadas em runtime.

## 2. Escopo
- Navegacao da frente em `Tabelas -> Medicamentos`.
- Shell em "L" com lateral + barra superior.
- Toolbar compacta com `Novo medicamento`, `Altera`, `Elimina`, combo `Grupo` e pesquisa por nome.
- Tabela com `Nome`, `Grupo` e `Apresentacao`.
- Selecionar, filtrar, abrir modal, salvar e excluir.
- Combos `Grupo`, `Apresentacao` e `Uso`.
- Validacoes, mensagens, loading, erro, estado vazio e tema.

## 3. Fora de escopo
- Alterar backend.
- Alterar banco.
- Criar migrations.
- Mudar permissões do contrato atual.
- Reescrever o fluxo legado monolitico.
- Copiar a UI do EasyDental desktop como arquitetura.

## 4. Referencias documentais
- [`docs/00_master_guide.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\00_master_guide.md)
- [`docs/02_arquitetura.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\02_arquitetura.md)
- [`docs/03_mapa_codigo.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\03_mapa_codigo.md)
- [`docs/04_funcionalidades.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\04_funcionalidades.md)
- [`docs/05_banco_dados.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\05_banco_dados.md)
- [`docs/06_seguranca.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\06_seguranca.md)
- [`docs/10_continuidade.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\10_continuidade.md)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)
- [`docs/fase_2b_medicamentos_contrato_profundo.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\fase_2b_medicamentos_contrato_profundo.md)
- [`docs/fase_2b_nova_matriz_comparativa_pos_medicamentos.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\fase_2b_nova_matriz_comparativa_pos_medicamentos.md)
- [`docs/medicamentos_subetapa_0_mapeamento_monolitico.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_0_mapeamento_monolitico.md)
- [`docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_1_estrutura_modular_passiva.md)
- [`docs/medicamentos_subetapa_2_fronteiras_contratos.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_2_fronteiras_contratos.md)
- [`docs/medicamentos_subetapa_3_helpers_textuais_puros.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_3_helpers_textuais_puros.md)
- [`docs/medicamentos_subetapa_4_integracao_validacao_nome.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_4_integracao_validacao_nome.md)
- [`docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\medicamentos_subetapa_5_encerramento_ciclo_helpers.md)
- [`docs/auditoria_grupo_medicamento_brana_cloud_easydental.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_grupo_medicamento_brana_cloud_easydental.md)
- [`docs/contrato_implementacao_grupo_medicamento_frontend_react.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_implementacao_grupo_medicamento_frontend_react.md)

## 5. Origem funcional
O codigo atual do Brana Cloud e a fonte da verdade para o contrato funcional:
- rota principal: `backend/routes/medicamentos_routes.py`
- modelo principal: `backend/models/medicamento.py`
- apoio de combos: `backend/models/financeiro.py` via `ItemAuxiliar`
- assistente de receitas: `backend/routes/editor_textos_routes.py`

O legado documentado em `frontend/app.js` define:
- listagem com filtro por grupo e nome
- tabela com `Nome`, `Grupo` e `Apresentacao`
- modal com abas `Principal` e `Detalhes`
- abertura por duplo clique heuristico
- selecao de linha
- exclusao com confirmacao

## 6. Navegacao
- A rota funcional do React deve ser `Tabelas -> Medicamentos`.
- A abertura deve respeitar o shell em "L".
- O fechamento deve retornar o usuario ao shell sem perder o estado do aplicativo.
- O item de menu do React atual ainda aparece desabilitado em runtime e isso deve ser tratado como pendencia de navegacao, nao como contratacao do modulo.

## 7. Shell em "L"
- A barra lateral e a barra superior formam um "L".
- A toolbar da frente ocupa a faixa superior da area principal.
- O corpo da tela deve usar o padrao visual dos modulos React ja consolidados.
- A frente nao deve depender do legado monolitico para layout final.

## 8. Toolbar
- Botoes: `Novo medicamento`, `Altera`, `Elimina`.
- Filtros: combo `Grupo` e pesquisa por nome.
- O conjunto deve caber em uma linha quando houver espaco.
- Sem filtros duplicados no cabeçalho da tabela, salvo decisao formal posterior.
- `Altera` e `Elimina` dependem de selecao de linha.
- `Novo medicamento` nao depende de selecao.

## 9. Combo Grupo
- Fonte: `GET /medicamentos/opcoes/grupos`.
- Origem de dados: `ItemAuxiliar` com tipo `Grupo de medicamento`.
- Opcoes devem vir ordenadas pelo backend.
- O contrato atual do backend retorna apenas itens ativos ou nao inativos.
- O valor vazio significa `Todos`.
- A interface nao deve transformar o combo em campo de texto livre.

## 10. Pesquisa por Nome
- Fonte: `GET /medicamentos?nome=...`.
- Pesquisa remota, nao local.
- O backend usa correspondencia parcial por nome.
- A busca deve ser case-insensitive conforme o contrato do backend.
- O debounce legado observado e de aproximadamente 220 ms.
- Ao limpar a busca, a lista volta ao estado filtrado apenas por grupo.

## 11. Tabela
- Colunas obrigatorias: `Nome`, `Grupo`, `Apresentacao`.
- Ordenacao base: nome, depois grupo, depois id.
- A linha selecionada deve ser destacada visualmente.
- O contador deve mostrar a quantidade total de itens carregados.
- Quando nao houver itens, o estado vazio deve ficar claro.
- O carregamento deve exibir estado de loading no padrao do projeto.

## 12. Selecao
- A selecao de linha e por clique.
- O duplo clique abre edicao.
- Ao filtrar, a selecao pode ser preservada se o item ainda existir.
- Ao excluir o item selecionado, a selecao deve ser limpa.
- Sem linha selecionada, `Altera` e `Elimina` devem exibir mensagem de orientacao.

## 13. Contador
- O contador deve refletir o total retornado pela consulta.
- No legado, o texto observado e `N itens`.
- O valor precisa atualizar apos filtro, salvar e excluir.

## 14. Modal
- Tamanho observado no legado: aproximadamente `760 x 515`.
- Titulo de inclusao: `Insere medicamento`.
- Titulo de alteracao: `Altera medicamento`.
- O modal deve abrir com a aba `Principal`.
- O modal tem botoes `Elimina`, `Ok` e `Cancela`.
- O botao `Elimina` fica desabilitado na inclusao.

## 15. Abas
- Ordem: `Principal`, `Detalhes`.
- Troca de aba nao deve apagar valores ja digitados.
- O estado ativo deve ficar visualmente destacado.

## 16. Campos

### Aba Principal
- `nome` -> `Nome`
- `grupo` -> `Grupo`
- `descricao_substancia` -> `Descrição/Substância`
- `apresentacao` -> `Apresentação`
- `uso` -> `Uso`
- `posologia_adulto` -> `Posologia/Adulto`
- `quantidade_padrao_adulto` -> `Quant. padrão` adulto
- `posologia_crianca` -> `Posologia/Criança`
- `quantidade_padrao_crianca` -> `Quant. padrão` criança
- `preferido` -> `Incluir na lista de preferidos`

### Aba Detalhes
- `laboratorio` -> `Laboratório`
- `observacoes` -> `Observações`
- `advertencias` -> `Advertências/Contra-indicações`

## 17. Comportamento dos campos
- `nome` e obrigatorio.
- Os demais campos admitem vazio.
- `preferido` e checkbox.
- `posologia_*` sao textos multiline.
- `quantidade_padrao_*` sao textos simples.
- Os selects `grupo`, `apresentacao` e `uso` sao preenchidos por API.

## 18. Combos
- `Grupo`: `GET /medicamentos/opcoes/grupos`
- `Apresentacao`: `GET /medicamentos/opcoes/apresentacoes`
- `Uso`: `GET /medicamentos/opcoes/usos`
- Cada combo deve mostrar opcao vazia.
- O valor salvo que nao existir mais deve ser tratado sem quebrar o modal.
- A selecao deve respeitar a clinica atual.

## 19. Validações
- Nome vazio deve bloquear salvamento.
- Conflito de nome duplicado deve retornar erro de conflito.
- O backend valida novamente o nome e o tenant.
- A interface pode usar helper passivo para normalizacao textual, mas o contrato principal e do backend.

## 20. Payloads
- `POST /medicamentos` e `PUT /medicamentos/{id}` usam o mesmo payload base.
- Campos nulos e vazios devem ser normalizados para `null` quando apropriado.
- `inativo` existe no contrato, mas o legado envia `false`.

## 21. Endpoints
- `GET /medicamentos`
- `GET /medicamentos/{id}`
- `POST /medicamentos`
- `PUT /medicamentos/{id}`
- `DELETE /medicamentos/{id}`
- `GET /medicamentos/opcoes/grupos`
- `GET /medicamentos/opcoes/apresentacoes`
- `GET /medicamentos/opcoes/usos`
- `GET /editor-textos/assistente-receitas/medicamentos`

## 22. Inclusão
- Deve abrir modal limpo.
- Deve permitir preencher o medicamento e gravar.
- Deve recarregar a lista apos sucesso.
- Deve selecionar o registro criado, quando possivel.

## 23. Alteração
- Deve partir de linha selecionada ou duplo clique.
- Deve carregar dados atuais por id.
- Deve salvar via `PUT /medicamentos/{id}`.
- Deve manter a lista sincronizada apos o save.

## 24. Exclusão
- Deve exigir confirmação.
- Deve remover o registro da lista apos sucesso.
- A exclusão do backend e fisica, nao soft delete.
- O banco usa `ON DELETE CASCADE` na restrição terapeutica.

## 25. Dependências
- `restricao_terapeutica` referencia `medicamento`.
- O assistente de receitas consulta medicamentos para prescricao.
- O combo `Grupo` depende de `ItemAuxiliar`.
- `Grupo de medicamento`, `Tipos de apresentação` e `Tipos de uso` dependem de `item_auxiliar`.

## 26. Permissões
- O router atual usa `require_module_access("anamnese")`.
- O backend também exige funcoes:
  - `Inserir medicamento`
  - `Alterar medicamento`
  - `Eliminar medicamento`
- O React nao deve mudar essa regra nesta fase.

## 27. Tenant
- O escopo e por `current_user.clinica_id`.
- O frontend nao pode definir a clinica como fonte de verdade.
- A listagem, o detalhe, o save e a exclusao devem respeitar a clinica autenticada.

## 28. Erros
- Erro de falta de permissao deve ser exibido.
- Erro de nome vazio deve ser bloqueante.
- Erro de conflito por nome duplicado deve ser comunicado.
- Erro de rede ou token expirado deve seguir o padrao do shell/app.

## 29. Loading
- Listagem e combos devem mostrar loading.
- O modal pode carregar combos antes de habilitar o preenchimento.
- O loading nao deve travar o shell inteiro.

## 30. Estado vazio
- Sem registros, mostrar mensagem clara.
- Sem selecao, desabilitar ou bloquear acao de alteracao/exclusao.
- Sem resultados de busca, manter a toolbar acessivel.

## 31. Tema claro e escuro
- O modulo deve seguir o tema global do Brana Cloud.
- Nao deve criar estilos fixos que rompam o contraste.
- O modo escuro precisa manter legibilidade de tabela, modal e toolbar.

## 32. Acessibilidade
- Labels devem estar associados aos campos.
- A ordem de tabulacao deve ser previsivel.
- Botões precisam ter texto compreensivel.
- O contraste deve ser consistente com o shell.

## 33. Comportamento responsivo
- A toolbar precisa quebrar com elegancia em telas menores.
- A tabela deve continuar navegavel com scroll horizontal se necessario.
- O modal nao deve ultrapassar a viewport.

## 34. Decisoes pendentes
- Se o menu React vai permanecer desabilitado ate a integracao completa.
- Se o duplo clique deve continuar heuristico ou virar `dblclick`.
- Se o filtro por grupo vai continuar so na toolbar.
- Se o teclado tera atalho adicional na primeira entrega.

## 35. Critérios de aceite
- A tela abre em `Tabelas -> Medicamentos`.
- Lista carrega, filtra e seleciona.
- Modal abre para novo e alteracao.
- Salvar e excluir respeitam os contratos reais.
- Os combos carregam pela API.
- O comportamento em tema claro e escuro continua legivel.

## 36. Conclusao
O contrato funcional esta fechado o suficiente para orientar a implementacao modular no React sem depender do monolito legado para decidir comportamento basico.
