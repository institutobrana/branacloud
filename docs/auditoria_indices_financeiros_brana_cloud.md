# Auditoria Técnica e Funcional - Índices Financeiros no Brana Cloud

## 1. Objetivo

Documentar integralmente o módulo `Configurações → Índices financeiros` já existente no Brana Cloud, com base exclusiva no repositório local, sem alterar código, banco, frontend ou backend.

## 2. Escopo

Esta auditoria cobre somente o Brana Cloud em `D:\BRANA ARQUIVOS\BRANA CLOUD`.

Inclui:

- frontend legado;
- backend;
- banco de dados;
- serviços;
- rotas e endpoints;
- modelos e schemas;
- permissões e isolamento por clínica;
- testes existentes;
- documentação e roadmap;
- referências cruzadas com módulos correlatos;
- comparação estrutural inicial com `Plano de contas` React.

Não inclui auditoria funcional profunda do EasyDental Desktop. Essa etapa fica reservada para depois.

## 3. Fontes auditadas

- [README.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/README.md)
- [docs/00_master_guide.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/00_master_guide.md)
- [docs/02_arquitetura.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/02_arquitetura.md)
- [docs/03_mapa_codigo.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/03_mapa_codigo.md)
- [docs/04_funcionalidades.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/04_funcionalidades.md)
- [docs/05_banco_dados.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/05_banco_dados.md)
- [docs/06_seguranca.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/06_seguranca.md)
- [docs/10_continuidade.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/10_continuidade.md)
- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)
- [frontend/index.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py)
- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py)
- [backend/models/indice_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/indice_financeiro.py)
- [backend/routes/materiais_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/materiais_routes.py)
- [backend/routes/procedimentos_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/procedimentos_routes.py)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/security/dependencies.py)
- [backend/main.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/main.py)
- [backend/tests/test_cadastros_grupos.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_cadastros_grupos.py)
- [backend/tests/test_cadastros_categorias.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_cadastros_categorias.py)
- [backend/tests/test_procedimentos_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_procedimentos_financeiro.py)
- [docs/varredura_proximo_modulo_pos_plano_contas.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/varredura_proximo_modulo_pos_plano_contas.md)
- [docs/varredura_proximo_modulo_pos_cid.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/varredura_proximo_modulo_pos_cid.md)
- [docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md)
- [backend/estrutura_precificacao.txt](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/estrutura_precificacao.txt)

## 4. Estado do repositório

Estado confirmado no início desta etapa:

- diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- raiz do repositório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- branch: `modularizacao-segura-fase-1`
- remote origin: `https://github.com/institutobrana/branacloud.git`
- HEAD: `0abb0f94ae94a5e60026f253d5e82187183aa22c`
- stage: vazio
- ahead/behind da branch rastreada: `0/0`

O worktree já estava muito sujo com alterações preexistentes de outras frentes. Nada foi alterado por esta auditoria fora do documento criado.

## 5. Inventário geral de arquivos

Arquivos centrais localizados para o módulo:

- `frontend/index.html`
- `frontend/app.js`
- `backend/routes/indices_financeiros_routes.py`
- `backend/services/indices_service.py`
- `backend/models/indice_financeiro.py`
- `docs/04_funcionalidades.md`
- `docs/05_banco_dados.md`
- `docs/11_roadmap_desenvolvimento.md`
- `backend/estrutura_precificacao.txt`

Referências cruzadas úteis:

- `backend/routes/materiais_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/security/dependencies.py`
- `backend/main.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/planoContas/*`

## 6. Entrada de menu no frontend legado

Evidência:

- [frontend/index.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html:2654)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:21945)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:22216)

Conclusão:

- o menu existe como `data-menu-action="config-indices-financeiros"`;
- o shell associa essa ação ao módulo `financeiro`;
- a ação abre `indicesAbrir()`.

## 7. Estrutura da janela principal

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12061)

Resumo:

- o módulo cria uma janela modal própria em `indicesEnsureUI()`;
- o título é `Configuração de índices financeiros`;
- a janela contém duas grades:
  - `Índices financeiros`
  - `Cotações`
- há botões para:
  - `Novo índice`
  - `Altera`
  - `Elimina`
  - `Fecha`
  - `Novo valor`
  - `Altera`
  - `Elimina`
- o fechamento ocorre por `indicesFechar()`;
- a abertura ocorre por `indicesAbrir()`.

## 8. Tabela Índices financeiros

Evidência principal:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12064)
- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py:81)

Observações:

- a tabela vem de `GET /indices-financeiros`;
- a renderização mostra `Índice`, `Sigla` e `Valor Atual`;
- o valor atual é formatado com 4 casas em `formatNumFixed(..., 4)`;
- a seleção de índice é mantida por `indiceSelNumero`;
- quando não há registros, a UI mostra `Nenhum índice cadastrado.`;
- a linha selecionada recebe classe `selected`;
- a seleção inicial cai no primeiro índice disponível se o selecionado sumir.

## 9. Tabela Cotações para Reais

Evidência principal:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12066)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:191)
- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py:195)

Observações:

- a lista é carregada por `GET /indices-financeiros/{numero}/cotacoes`;
- a ordenação é por `data asc`, depois `id asc`;
- a tabela mostra `Data` e `Cotação`;
- a data é exibida em `dd/mm/aaaa` quando a origem é ISO;
- quando não há cotações, a UI mostra `Nenhuma cotação cadastrada.`;
- ao trocar o índice, a lista de cotações é recarregada.

## 10. Fluxo mestre/detalhe

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12061)

Resumo:

- o clique na tabela de índices redefine `indiceSelNumero` e limpa `cotacaoSelId`;
- a tabela de cotações depende do índice ativo;
- o título das cotações passa a usar o nome do índice selecionado;
- o estado mestre/detalhe é mantido em memória de tela com `indicesCache`, `cotacoesCache`, `indiceSelNumero` e `cotacaoSelId`.

## 11. Botão Novo índice

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12071)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:76)

Comportamento:

- abre `cadModalAbrir`;
- pede apenas `Nome` e `Sigla`;
- faz trim dos dois campos;
- exige nome e sigla não vazios;
- usa `POST /indices-financeiros`;
- se falhar, mostra `Falha ao criar índice.`;
- depois de salvar, recarrega o módulo.

## 12. Botão Altera índice

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12072)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:105)

Comportamento:

- exige índice selecionado;
- bloqueia índice reservado;
- usa `PATCH /indices-financeiros/{numero}`;
- mantém o mesmo modal simples com `Nome` e `Sigla`;
- faz trim dos campos;
- recarrega a tela após sucesso.

## 13. Botão Elimina índice

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12073)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:172)
- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py:160)

Comportamento:

- exige índice selecionado;
- bloqueia índice reservado do sistema;
- consulta `GET /indices-financeiros/{numero}/em-uso`;
- se não estiver em uso, pede confirmação com `window.confirm`;
- se estiver em uso, abre migração via `cadModalAbrir`;
- caso haja conflito de uso, o backend responde `409`;
- na migração, o frontend envia `POST /indices-financeiros/{numero}/migrar-e-excluir`.

Dependências de uso detectadas:

- `ProcedimentoTabela.nro_indice`
- `ListaMaterial.nro_indice`
- `Tratamento.indice`

## 14. Botão Novo valor

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12074)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:213)

Comportamento:

- exige índice selecionado;
- o modal abre com data padrão de hoje em `dd/mm/aaaa`;
- o valor padrão é `1.0000`;
- o input de valor usa `type="number"` e `step="0.0001"`;
- exige data preenchida;
- exige valor numérico positivo;
- usa `POST /indices-financeiros/{numero}/cotacoes`;
- a data aceita `DD/MM/AAAA` e `YYYY-MM-DD` no backend.

## 15. Botão Altera valor

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12075)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:239)

Comportamento:

- exige índice e cotação selecionados;
- usa o mesmo modal do novo valor;
- preenche a data com a data já salva;
- preenche o valor salvo;
- usa `PATCH /indices-financeiros/{numero}/cotacoes/{cotacao_id}`;
- valida data e valor positivo novamente.

## 16. Botão Elimina valor

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12076)
- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:265)

Comportamento:

- exige índice e cotação selecionados;
- pede confirmação com `window.confirm`;
- usa `DELETE /indices-financeiros/{numero}/cotacoes/{cotacao_id}`;
- depois recarrega índices e cotações.

## 17. Botão Fecha

Evidência:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js:12062)

Comportamento:

- fecha a modal principal via `indicesFechar()`;
- não altera o banco;
- não altera seleção persistida em servidor porque a seleção é só de tela.

## 18. Modais e campos

### Índice

Campos:

- `Nome`
- `Sigla`

Comportamento:

- `trim` nos dois campos;
- validação de obrigatoriedade no frontend e no backend;
- o backend normaliza sigla com `upper()`;
- índice reservado não pode ser alterado nem excluído.

### Cotação

Campos:

- `Data`
- `Cotação`

Comportamento:

- data em texto no frontend, com aceitação de `DD/MM/AAAA` e `YYYY-MM-DD`;
- valor numérico com `step=0.0001`;
- valores zero ou negativos são rejeitados;
- o backend guarda data como ISO `YYYY-MM-DD`.

### Migração

Campos:

- índice de origem informado pelo contexto;
- `indice destino` em `<select>`.

Comportamento:

- só aparece quando o índice está em uso;
- exige destino válido;
- o payload é `{ numero_destino }`.

## 19. Validações

Confirmadas:

- nome do índice obrigatório;
- sigla do índice obrigatória;
- índice reservado do sistema bloqueado para alteração e exclusão;
- índice em uso bloqueia exclusão simples;
- cotação exige data;
- cotação exige valor positivo;
- destino de migração é obrigatório;
- cotação só pode ser alterada/excluída dentro do índice selecionado.

## 20. Mensagens e confirmações

Mensagens de frontend observadas:

- `Informe o nome do índice.`
- `Informe a sigla do índice.`
- `Falha ao criar índice.`
- `Falha ao alterar índice.`
- `Selecione um índice.`
- `Índice reservado do sistema.`
- `Deseja eliminar este índice?`
- `Não há índice destino para migração.`
- `Selecione o índice destino.`
- `Informe a data.`
- `Informe uma cotação válida.`
- `Falha ao salvar cotação.`
- `Selecione uma cotação.`
- `Deseja eliminar esta cotação?`

Mensagens de backend observadas:

- `Índice não encontrado.`
- `Cotação não encontrada.`
- `Informe o nome do índice.`
- `Informe a sigla do índice.`
- `Limite de índices atingido.`
- `Índice reservado do sistema.`
- `Índice em uso. Migre os registros para outro índice antes de excluir.`
- `Selecione o índice destino.`
- `Cotação não pertence ao índice selecionado.`
- `Informe um valor válido.`

## 21. Endpoints

### Índices

- `GET /indices-financeiros`
- `POST /indices-financeiros`
- `PATCH /indices-financeiros/{numero}`
- `GET /indices-financeiros/{numero}/em-uso`
- `POST /indices-financeiros/{numero}/migrar-e-excluir`
- `DELETE /indices-financeiros/{numero}`

### Cotações

- `GET /indices-financeiros/{numero}/cotacoes`
- `POST /indices-financeiros/{numero}/cotacoes`
- `PATCH /indices-financeiros/{numero}/cotacoes/{cotacao_id}`
- `DELETE /indices-financeiros/{numero}/cotacoes/{cotacao_id}`

Todos esses endpoints passam por `require_module_access("financeiro")` e `get_current_user`.

### Tabela detalhada de endpoints

| Método | Caminho | Função de rota | Arquivo | Evidência de linha | Path params | Query params | Body | Schema de entrada | Schema de saída | Auth | Autorização | Tenant/clínica | Sucesso | Erros | Side effects |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/indices-financeiros` | `listar` | `backend/routes/indices_financeiros_routes.py` | `68-73` | - | - | - | - | lista de índices | sim | `require_module_access("financeiro")` | `current_user.clinica_id` | lista ordenada de índices com `valor_atual` | `401/403` via dependência | garante índices padrão por clínica antes de listar |
| `POST` | `/indices-financeiros` | `criar` | `backend/routes/indices_financeiros_routes.py` | `76-102` | - | - | `{ nome, sigla }` | `IndicePayload` | índice calculado por `dados_indice_por_numero(...)` | sim | módulo financeiro | `current_user.clinica_id` | cria novo índice ativo e não reservado | `400`, `401`, `403` | cria linha em `indice_financeiro` e pode acionar criação de padrões |
| `PATCH` | `/indices-financeiros/{numero}` | `atualizar` | `backend/routes/indices_financeiros_routes.py` | `105-123` | `numero` | - | `{ nome?, sigla? }` | `IndiceUpdatePayload` | índice calculado por `dados_indice_por_numero(...)` | sim | módulo financeiro | `current_user.clinica_id` | atualiza nome/sigla | `400`, `404`, `401`, `403` | altera registro existente |
| `GET` | `/indices-financeiros/{numero}/em-uso` | `verificar_em_uso` | `backend/routes/indices_financeiros_routes.py` | `126-132` | `numero` | - | - | - | `{ em_uso: bool }` | sim | módulo financeiro | `current_user.clinica_id` | informa se há dependências | `401`, `403`, `404` indireto se a carga falhar | nenhuma escrita |
| `POST` | `/indices-financeiros/{numero}/migrar-e-excluir` | `migrar_e_excluir` | `backend/routes/indices_financeiros_routes.py` | `135-170` | `numero` | - | `{ numero_destino }` | corpo livre validado manualmente | `{ detail: "Índice migrado e excluído com sucesso." }` | sim | módulo financeiro | `current_user.clinica_id` | migra referências e exclui origem | `400`, `404`, `401`, `403` | atualiza `procedimento_tabela`, `lista_material`, `tratamento` e apaga a origem |
| `DELETE` | `/indices-financeiros/{numero}` | `excluir` | `backend/routes/indices_financeiros_routes.py` | `172-188` | `numero` | - | - | - | `{ detail: "Índice eliminado." }` | sim | módulo financeiro | `current_user.clinica_id` | exclui índice não reservado e não usado | `400`, `404`, `409`, `401`, `403` | remove linha de `indice_financeiro` |
| `GET` | `/indices-financeiros/{numero}/cotacoes` | `listar_cotacoes` | `backend/routes/indices_financeiros_routes.py` | `191-210` | `numero` | - | - | - | lista `{ id, data, valor }` | sim | módulo financeiro | `current_user.clinica_id` | lista cotações do índice | `401`, `403`, `404` | nenhuma escrita |
| `POST` | `/indices-financeiros/{numero}/cotacoes` | `criar_cotacao` | `backend/routes/indices_financeiros_routes.py` | `213-237` | `numero` | - | `{ data, valor }` | `CotacaoPayload` | `{ detail: "Cotação salva." }` | sim | módulo financeiro | `current_user.clinica_id` | cria cotações novas | `400`, `404`, `401`, `403` | insere linha em `indice_cotacao` |
| `PATCH` | `/indices-financeiros/{numero}/cotacoes/{cotacao_id}` | `atualizar_cotacao` | `backend/routes/indices_financeiros_routes.py` | `239-263` | `numero`, `cotacao_id` | - | `{ data, valor }` | `CotacaoPayload` | `{ detail: "Cotação atualizada." }` | sim | módulo financeiro | `current_user.clinica_id` | atualiza a cotação selecionada | `400`, `404`, `401`, `403` | altera linha em `indice_cotacao` |
| `DELETE` | `/indices-financeiros/{numero}/cotacoes/{cotacao_id}` | `excluir_cotacao` | `backend/routes/indices_financeiros_routes.py` | `265-277` | `numero`, `cotacao_id` | - | - | - | `{ detail: "Cotação eliminada." }` | sim | módulo financeiro | `current_user.clinica_id` | exclui a cotação selecionada | `404`, `401`, `403` | remove linha de `indice_cotacao` |

## 22. Payloads e respostas

Payloads confirmados:

- criação de índice: `{ nome, sigla }`
- atualização de índice: `{ nome?, sigla? }`
- criação/alteração de cotação: `{ data, valor }`
- migração: `{ numero_destino }`

Respostas confirmadas:

- criação/alteração/consulta de índice retornam o formato de `dados_indice_por_numero(...)`;
- lista de cotações retorna `{ id, data, valor }`;
- criação de cotação retorna `{ detail: "Cotação salva." }`;
- alteração de cotação retorna `{ detail: "Cotação atualizada." }`;
- exclusão de cotação retorna `{ detail: "Cotação eliminada." }`;
- migração retorna `{ detail: "Índice migrado e excluído com sucesso." }`;
- exclusão de índice retorna `{ detail: "Índice eliminado." }`.

## 23. Modelos e schemas

### Modelo

Evidência:

- [backend/models/indice_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/indice_financeiro.py:7)

Campos:

- `IndiceFinanceiro.id`
- `IndiceFinanceiro.clinica_id`
- `IndiceFinanceiro.numero`
- `IndiceFinanceiro.sigla`
- `IndiceFinanceiro.nome`
- `IndiceFinanceiro.reservado`
- `IndiceFinanceiro.ativo`
- `IndiceCotacao.id`
- `IndiceCotacao.clinica_id`
- `IndiceCotacao.indice_id`
- `IndiceCotacao.data`
- `IndiceCotacao.valor`

### Schema de entrada

No router há:

- `IndicePayload`
- `IndiceUpdatePayload`
- `CotacaoPayload`

Observação:

- não foi localizada uma camada separada de `schemas/`, `repository/` ou `service` para validação de payloads do módulo; a validação está concentrada no router e no service.

## 24. Estrutura de banco

Evidência:

- [backend/models/indice_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/models/indice_financeiro.py:7)
- [docs/05_banco_dados.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/05_banco_dados.md:23)
- [backend/estrutura_precificacao.txt](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/estrutura_precificacao.txt:4472)

Tabelas relacionadas:

- `indice_financeiro`
- `indice_cotacao`

Relacionamento:

- `IndiceCotacao.indice_id` referencia `indice_financeiro.id` com `ondelete="CASCADE"`.
- `IndiceFinanceiro.cotacoes` usa `cascade="all, delete-orphan"`.
- `clinica_id` existe nas duas tabelas.

### Estrutura persistida confirmada

| Tabela | Modelo | Campo | Tipo | Nullable | Default | Observação |
| --- | --- | --- | --- | --- | --- | --- |
| `indice_financeiro` | `IndiceFinanceiro` | `id` | `Integer` | não | - | PK |
| `indice_financeiro` | `IndiceFinanceiro` | `clinica_id` | `Integer` | não | - | FK para `clinicas.id`, indexado |
| `indice_financeiro` | `IndiceFinanceiro` | `numero` | `Integer` | não | - | identificador lógico do índice |
| `indice_financeiro` | `IndiceFinanceiro` | `sigla` | `String(20)` | não | - | normalizada em maiúsculas no backend |
| `indice_financeiro` | `IndiceFinanceiro` | `nome` | `String(120)` | não | - | nome do índice |
| `indice_financeiro` | `IndiceFinanceiro` | `reservado` | `Boolean` | não | `False` | protege índices nativos |
| `indice_financeiro` | `IndiceFinanceiro` | `ativo` | `Boolean` | não | `True` | filtrável via service |
| `indice_cotacao` | `IndiceCotacao` | `id` | `Integer` | não | - | PK |
| `indice_cotacao` | `IndiceCotacao` | `clinica_id` | `Integer` | não | - | FK para `clinicas.id`, indexado |
| `indice_cotacao` | `IndiceCotacao` | `indice_id` | `Integer` | não | - | FK para `indice_financeiro.id`, `CASCADE` |
| `indice_cotacao` | `IndiceCotacao` | `data` | `String(20)` | não | - | armazena data ISO `YYYY-MM-DD` |
| `indice_cotacao` | `IndiceCotacao` | `valor` | `Float` | não | `1.0` | valor da cotação |

## 25. Índices e constraints

Confirmados:

- PK em `IndiceFinanceiro.id`
- PK em `IndiceCotacao.id`
- índice em `clinica_id` nas duas tabelas
- índice em `indice_id` em `indice_cotacao`
- unique constraint `uq_indice_financeiro_clinica_numero`

Classificação:

- confirmada por modelo ORM;
- a forma exata de DDL do banco físico não foi inspecionada nesta etapa.
- não foi localizada migration específica neste recorte para provar os mesmos índices/constraints em DDL SQL nativo.

## 26. Seeds e registros nativos

Confirmados:

- `INDICES_PADRAO` em `backend/services/indices_service.py`
- números padrão:
  - `255` -> `R$` / `Reais`
  - `2` -> `UHO`
  - `3` -> `UPO`
  - `1` -> `USO`
- esses registros são marcados como `reservado=True`
- a função `garantir_indices_padrao_clinica()` cria e corrige esses índices por clínica

## 27. Regras de negócio

### Confirmadas

- o módulo é multi-tenant por `current_user.clinica_id`;
- o frontend não é barreira de segurança;
- criação de índice exige nome e sigla;
- sigla é armazenada em maiúsculas;
- índice reservado não pode ser alterado nem excluído;
- exclusão simples de índice exige que ele não esteja em uso;
- quando o índice está em uso, o fluxo de migração troca referências em:
  - `procedimento_tabela.nro_indice`
  - `lista_material.nro_indice`
  - `tratamento.indice`
- a cotação mais recente define o valor atual;
- o critério de “mais recente” é `data desc, id desc`;
- se não houver cotação:
  - índice reservado retorna `1.0`;
  - índice não reservado retorna `0.0`.

### Parcialmente confirmadas

- unicidade de nome do índice: não foi encontrada constraint explícita;
- unicidade de sigla do índice: não foi encontrada constraint explícita;
- sensibilidade a maiúsculas/minúsculas: a sigla é normalizada em `upper()`, mas a unicidade não foi formalizada no banco;
- obrigatoriedade de primeira cotação: não foi encontrada;
- exclusão física histórica: existe exclusão física de cotações e índice, mas o histórico não é imutável.

## 28. Atualização do valor atual

Evidência:

- [backend/services/indices_service.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/services/indices_service.py:69)

Resumo:

- `valor_atual` é calculado em tempo de leitura;
- a consulta busca a última cotação por `data desc, id desc`;
- se houver cotação, o valor dela vira `valor_atual`;
- se não houver cotação, o fallback depende de ser índice reservado.

## 29. Dependências

Dependências diretas confirmadas:

- `backend/routes/materiais_routes.py` usa `listar_indices()` e resolve número de índice;
- `backend/routes/procedimentos_routes.py` usa `listar_indices()`, `resolver_numero_indice()` e `dados_indice_por_numero()`;
- `backend/security/dependencies.py` aplica `require_module_access("financeiro")`;
- `frontend/app.js` usa o módulo no shell legado;
- `docs/04_funcionalidades.md` e `docs/11_roadmap_desenvolvimento.md` reconhecem o módulo como parte do financeiro.

Referências cruzadas de risco:

- materiais;
- procedimentos;
- tratamentos;
- financeiro;
- cenário anual;
- toolbar principal do shell.

### Matriz de dependências por arquivo

| Módulo dependente | Arquivo | Função, classe ou campo | Entidade/propriedade usada | Leitura ou escrita | Finalidade | Risco de alteração | Efeito possível da exclusão | Evidência |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Procedimentos | `backend/routes/procedimentos_routes.py` | uso de `listar_indices`, `resolver_numero_indice`, `dados_indice_por_numero` | `nro_indice` e exibição de índice/moeda | leitura | mostrar e resolver índice aplicável | alto | telas de procedimento podem perder resolução de índice | confirmado por uso direto em rota e service |
| Materiais | `backend/routes/materiais_routes.py` | uso de `listar_indices` | `nro_indice` e lista de índices | leitura | listar índices válidos para materiais | alto | telas de material podem perder seleção/visualização correta | confirmado por uso direto em rota |
| Tratamentos | `backend/routes/indices_financeiros_routes.py` e `backend/services/indices_service.py` | `indice_em_uso` e migração | `Tratamento.indice` | leitura e escrita | bloquear exclusão e migrar referências | alto | migração de índices usados pode falhar ou deixar vínculo órfão | confirmado por update em massa antes da exclusão |
| Financeiro | `frontend/app.js` | `indicesAbrir`, `indicesNovo`, `cotacaoNova` | ação de menu `config-indices-financeiros` | leitura e escrita | exibir e operar a tela legada | médio | usuário perde acesso ao módulo pela UI | confirmado por menu e handlers |
| Permissão | `backend/security/dependencies.py` | `require_module_access("financeiro")` | módulo financeiro | leitura | proteger todas as rotas do módulo | alto | acesso indevido ao módulo | confirmado por dependência no router |
| Documento de referência | `docs/04_funcionalidades.md` | seção de funcionalidades financeiras | menção a `indices_financeiros_routes.py` e `indice_financeiro.py` | leitura | rastrear função esperada | baixo | perda de rastreabilidade documental | confirmado por documentação atual |

## 30. Permissões e isolamento por clínica

Evidência:

- [backend/routes/indices_financeiros_routes.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/routes/indices_financeiros_routes.py:19)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/security/dependencies.py:96)

Resumo:

- o router exige `require_module_access("financeiro")`;
- todas as consultas relevantes usam `current_user.clinica_id`;
- a criação grava `clinica_id=current_user.clinica_id`;
- os loads de índice e cotação filtram por clínica;
- o isolamento depende do backend, não do frontend.

## 31. Tratamento de erros

Confirmado:

- backend retorna `400` para validação de entrada;
- backend retorna `404` quando o índice ou cotação não existe;
- backend retorna `409` quando o índice está em uso e a exclusão simples é tentada;
- frontend mostra `window.alert` com `detail` quando a API devolve erro;
- frontend também usa `window.confirm` nas exclusões simples.

## 32. Testes existentes

Testes relacionados direta ou indiretamente:

- [backend/tests/test_cadastros_grupos.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_cadastros_grupos.py)
- [backend/tests/test_cadastros_categorias.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_cadastros_categorias.py)
- [backend/tests/test_procedimentos_financeiro.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/tests/test_procedimentos_financeiro.py)
- [frontend-react/tests/planoContasToolbar.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasToolbar.test.js)
- [frontend-react/tests/planoContasRouting.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasRouting.test.js)

Correção de inventário:

- os arquivos acima não existem com esses nomes no repositório atual;
- os testes realmente localizados para o comparativo do `Plano de contas` são:
  - [frontend-react/tests/planoContasToolbar.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasToolbar.test.js)
  - [frontend-react/tests/planoContasRouting.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasRouting.test.js)
  - [frontend-react/tests/planoContasPageDelete.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasPageDelete.test.js)
  - [frontend-react/tests/planoContasCategoryMigration.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigration.test.js)
  - [frontend-react/tests/planoContasCategoryMigrationModal.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigrationModal.test.js)
  - [frontend-react/tests/planoContasCategoryMigrationFlow.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/planoContasCategoryMigrationFlow.test.js)
- para `indices-financeiros`, não foi localizado teste dedicado com esse nome.

Situação:

- não foi localizado um teste dedicado com nome próprio para `indices_financeiros`;
- há cobertura indireta de financeiro e de módulo compartilhado;
- nesta etapa não executei testes que possam gravar em banco.

## 33. Comparação estrutural inicial com Plano de contas React

Reutilizável como referência estrutural:

- shell em `L`;
- barra horizontal operacional;
- duas tabelas mestre/detalhe;
- seleção de linha;
- estados de loading, vazio e erro;
- modal simples para CRUD;
- confirmação de exclusão;
- refresh após mutação.

Adaptar com cuidado:

- a semântica de `valor_atual`;
- o fluxo de migração quando o índice está em uso;
- o tratamento de cotações por data;
- a proteção dos índices nativos.

Não reaproveitar de forma literal:

- regras de negócio específicas de Plano de contas;
- nomes de ações e entidades;
- lógica de seleção e exclusão pensada para grupos/categorias.

## 34. Situação no roadmap

Texto atual localizado:

- [docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md:719)

Estado informado:

- a fase 4 do roteiro já marca `Índices financeiros e cotacoes existem em indices_financeiros_routes.py`.

Inconsistências observadas:

- o roadmap reconhece o backend, mas ainda não documenta a auditoria funcional completa da UI legada no formato esperado para esta frente;
- o módulo existe como tela legada com dois grids, mas a documentação atual ainda precisa de uma consolidação específica para a frente de `Índices financeiros`.

## 35. Dúvidas não resolvidas

- existe ou não unicidade formal de sigla no banco;
- existe ou não unicidade formal de nome no banco;
- quais campos exatos do legado desktop definem cada sigla no histórico original;
- há algum relatório oculto que consuma `indice_cotacao` diretamente além das referências cruzadas já confirmadas;
- se há exigência funcional de primeira cotação obrigatória no momento da criação do índice;
- se a UI futura do React manterá exatamente o mesmo comportamento de migração.

## 36. Riscos

- reuso indevido de regras de Plano de contas;
- divergência entre histórico, frontend legado e backend atual;
- mojibake em documentos e strings legadas;
- worktree com muitas mudanças preexistentes;
- confusão entre `valor_atual` calculado e `cotação` persistida;
- alteração futura do conceito de índice reservado sem contrato.

## 37. Conclusões

O módulo `Índices financeiros` já está implementado no Brana Cloud e é composto por:

- menu legível no frontend legado;
- janela modal própria em `frontend/app.js`;
- backend dedicado em `indices_financeiros_routes.py`;
- serviço dedicado em `indices_service.py`;
- modelo dedicado em `indice_financeiro.py`;
- dependências diretas com materiais, procedimentos e tratamentos;
- proteção de índices nativos e cálculo dinâmico de valor atual.

O inventário confirma que o módulo não é apenas um rótulo documental. Ele possui comportamento real, endpoints reais e dependências funcionais já ativas.

## 38. Próxima etapa recomendada

1. Fazer a auditoria funcional comparativa com o EasyDental Desktop, agora que o contrato Brana Cloud já está documentado.
2. Consolidar a matriz de divergências entre legado, backend e React.
3. Só depois disso definir a implementação ou o redesenho no frontend React.

## 39. Fechamento desta rodada

Consolidação adicional em `06/08/2026` para a frente documental e de matriz seletiva:

- a chave real do auth no frontend React é `brana_token`;
- a validação de sessão depende de `GET /api/me` com `200`;
- a homologação runtime confirmou abertura direta da rota do módulo autenticado;
- os seis modais finais foram confirmados em runtime e sem mutação ao cancelar;
- os temas claro e escuro foram validados;
- `35` testes da feature passaram novamente;
- `vite build` passou;
- `git diff --check` passou;
- o stage continuou vazio;
- nenhum commit, push ou deploy foi realizado.
