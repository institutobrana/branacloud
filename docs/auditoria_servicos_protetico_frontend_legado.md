# Auditoria inicial rígida - Brana Cloude - Tabelas -> Serviços de protético

## 1. Objetivo
Mapear tecnicamente o módulo existente de `Configurações -> Tabelas -> Serviços de protético` no Brana Cloude, comparando o frontend legado, o backend atual, o modelo de dados e a referência do EasyDental Desktop, sem alterar código, banco, documentação existente ou comportamento.

## 2. Escopo
Foram investigados:

- frontend legado em `frontend/app.js` e `frontend/index.html`;
- backend em `backend/routes/proteticos_routes.py`, `backend/models/protetico.py`, `backend/models/controle_protetico.py`, `backend/routes/relatorios_routes.py`, `backend/routes/agenda_contatos_routes.py` e integrações correlatas;
- documentação existente em `docs/`;
- referência local do EasyDental Desktop em `Y:\EDS70`;
- padrões reutilizáveis do frontend React existente.

## 3. Restrições da auditoria
Esta etapa foi somente de leitura e documentação.

- Nenhum arquivo de código foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi criada.
- Nenhum endpoint foi criado ou alterado.
- Nenhum commit ou push foi feito.
- Nenhuma frente externa foi tocada.
- A única escrita prevista nesta auditoria foi este documento.

## 4. Estado inicial do repositório

- Diretório usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch atual: `modularizacao-segura-fase-1`
- Remote origin: `https://github.com/institutobrana/branacloud.git`
- Status inicial: havia diversas alterações preexistentes em outras frentes, incluindo backend, frontend legado, frontend React, docs e arquivos temporários/untracked.
- Confirmação: não houve tentativa de limpar, reverter ou tocar nessas alterações externas.

Comandos de referência:

- `git status --short --branch`
- `git log --oneline -10`

## 5. Documentos existentes encontrados

### 5.1. Documentos diretamente reaproveitáveis

- [`docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`](./fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md)
- [`docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md`](./fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md)
- [`docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md`](./fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md)
- [`docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md`](./fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md)
- [`docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`](./fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md)
- [`docs/05_banco_dados.md`](./05_banco_dados.md)
- [`docs/01_visao_produto.md`](./01_visao_produto.md)
- [`docs/11_roadmap_desenvolvimento.md`](./11_roadmap_desenvolvimento.md)
- [`docs/06_seguranca.md`](./06_seguranca.md)

### 5.2. O que pôde ser reaproveitado

- O módulo já estava identificado como primeira frente da Fase 2.
- O frontend legado centraliza a tela em `frontend/app.js`.
- A lista/seleção de protético e a lista de serviços já tinham contratos documentais prévios.
- Os helpers puros de relatório/exportação já estavam isolados em `frontend/js/modules/tabela-proteticos-helpers.js`.
- A decisão documental anterior já havia pausado a extração de `protServicoSelecionado`.
- O banco já tinha as entidades `protetico`, `servico_protetico` e `controle_protetico`.
- A proteção por clínica e a exigência de permissão no módulo `procedimentos` já estavam documentadas e implementadas.

## 6. Arquivos do frontend legado

### 6.1. Arquivos relevantes

- [`frontend/index.html`](../frontend/index.html)
- [`frontend/app.js`](../frontend/app.js)
- [`frontend/js/modules/tabela-proteticos-helpers.js`](../frontend/js/modules/tabela-proteticos-helpers.js)

### 6.2. Ponto de menu e bootstrap

- Menu de abertura:
  - `data-menu-action="tabelas-protetico"` em `frontend/index.html:2645`
- Outros pontos relacionados:
  - `relatorio-proteticos` em `frontend/index.html:2622`
  - `cadastro-controle-proteticos` em `frontend/index.html:2570`
- Script carregado:
  - `frontend/index.html:3935` carrega `frontend/js/modules/tabela-proteticos-helpers.js`
- Handler de clique:
  - `frontend/app.js:22552` liga o clique de `tabelas-protetico` a `protAbrir()`

## 7. Fluxo de abertura do módulo

Fluxo comprovado no legado:

1. Clique no menu `Serviços de protético...`.
2. O handler chama `protAbrir()`.
3. `protAbrir()` chama `protEnsureUI()`, `protVincularEventos()`, `hideAllPanels()` e exibe `proteticos-panel`.
4. `protCarregar()` chama `GET /proteticos`.
5. O combo de protéticos é preenchido.
6. `protCarregarServicos()` chama `GET /proteticos/{protetico_id}/servicos`.
7. A grade é renderizada por `protRender()`.
8. O rodapé mostra o total de serviços do protético selecionado.

Referências:

- `frontend/app.js:7009-7010`
- `frontend/app.js:7008`
- `frontend/app.js:7007`

## 8. Estrutura visual atual

### 8.1. Painel

- Painel: `proteticos-panel`
- Título: `Configura tabelas de protéticos`
- Combo: `Protético:`
- Toolbar:
  - `Novo serviço...`
  - `Altera...`
  - `Elimina`
  - `Imprime...`
  - `Fecha`

### 8.2. Grade

Colunas atuais no legado:

- `Serviço`
- `Índice`
- `Preço`
- `Prazo`

O DOM usa `colgroup` com larguras fixas para as colunas de índice, preço e prazo.

Referências:

- `frontend/app.js:6831`
- `frontend/app.js:7007`

## 9. Combo Protético

### 9.1. Origem real

No Brana Cloud, o combo vem de:

- `GET /proteticos`
- tabela/modelo `protetico`
- filtro por `current_user.clinica_id`

### 9.2. Ordenação e seleção

- Ordenação no backend: `sorted(itens, key=lambda item: _sort_key(item.nome))`
- O combo é preenchido com `id` e `nome`.
- Se houver seleção anterior válida, ela é preservada.
- Se não houver seleção válida, o primeiro protético da lista é adotado.

### 9.3. O que não foi encontrado

- Não há evidência de campo próprio de “código do protético” no combo do Brana Cloud.
- Não há filtro de ativo/inativo no modelo atual.
- Não há persistência explícita da última seleção fora do estado em memória da tela.

### 9.4. Interpretação segura

O “Protético” do módulo atual no Brana Cloud é uma entidade persistida na tabela `protetico`, não apenas uma string de tela.

No EasyDental Desktop, o material de base sugere forte relação com `CONTATO` e com `TAB_PRT_ITEM.NROPRO`, então a terminologia pode variar entre:

- protético como entidade de contato;
- protético como laboratório/fornecedor;
- protético como cadastro separado.

Essa divergência terminológica precisa ser tratada com cautela na futura implementação.

## 10. Tabela e colunas

### 10.1. Frontend legado

O legado mostra 4 colunas:

- Serviço
- Índice
- Preço
- Prazo

### 10.2. Backend atual

O payload de serviço retornado por `GET /proteticos/{id}/servicos` contém:

- `id`
- `nome`
- `indice`
- `preco`
- `prazo`
- `protetico_id`

Referência:

- `backend/routes/proteticos_routes.py:43-51`

### 10.3. Viabilidade de coluna Código

No módulo atual do Brana Cloud, não foi encontrado um campo funcional de “Código” para o serviço de protético.

O que existe no backend atual:

- `ServicoProtetico.id` como identificador técnico do registro.
- `ServicoProtetico.nome` como chave de exibição.
- unicidade por `protetico_id + nome`.

Portanto:

- a coluna `Código` não deve ser presumida como um campo já existente;
- a fonte mais segura tecnicamente, se o React precisar exibir algo, é `ServicoProtetico.id`;
- isso não equivale a um código de negócio do desktop;
- a decisão futura precisa separar `id técnico` de `código funcional`.

## 11. Formulário de inclusão e alteração

### 11.1. Modal legado

- Título dinâmico:
  - `Insere serviço`
  - `Altera serviço`
- Campos:
  - `Descrição` -> `prot-modal-nome`
  - `Preço` -> `prot-modal-indice`
  - `Valor` -> `prot-modal-preco`
  - `Prazo médio para entrega` -> `prot-modal-prazo`

### 11.2. Tipos e regras visíveis

- `nome`: texto livre, obrigatório
- `indice`: select textual, default `R$`
- `preco`: campo textual formatado, convertido por `procFmtBr`/`procParse`
- `prazo`: campo numérico inteiro, mínimo `0`

### 11.3. Observações

- O rótulo visual do select está como `Preço:`, mas o nome técnico do campo é `indice`.
- O valor do preço é armazenado em `preco`.
- O prazo é armazenado em `prazo`.
- O modal não mostra campo `Código`.

## 12. Ação Novo serviço

### 12.1. Frontend

- Botão: `prot.btnNovo`
- Função: `protAbrirModal()`

### 12.2. Pré-condições

- Exige protético selecionado.
- Sem protético selecionado, exibe alerta: `Selecione um protético.`

### 12.3. Comportamento

- Abre modal em modo inserção.
- Preenche:
  - nome vazio
  - índice `R$`
  - preço `0,00`
  - prazo `0`
- Foca no campo nome.

### 12.4. Backend

- `POST /proteticos/{protetico_id}/servicos`
- Payload:
  - `nome`
  - `indice`
  - `preco`
  - `prazo`

### 12.5. Validações

- nome obrigatório
- nome único por protético
- prazo não negativo no backend
- preço convertido para `float`

### 12.6. Pós-salvar

- fecha modal
- recarrega a lista de serviços
- mantém o protético selecionado

## 13. Ação Altera

### 13.1. Frontend

- Botão: `prot.btnEditar`
- Função: `protEditarSelecionado()`

### 13.2. Pré-condições

- Exige linha de serviço selecionada.

### 13.3. Identificação do registro

- A seleção usa `protServicoSelecionadoId`.
- `protServicoSelecionado()` resolve o objeto na cache.

### 13.4. Backend

- `PUT /proteticos/servicos/{servico_id}`

### 13.5. Pós-salvar

- recarrega somente os serviços do protético atual
- mantém o contexto do protético

## 14. Ação Elimina

### 14.1. Serviço

- Botão: `prot.btnExcluir`
- Função: `protExcluirServico()`
- Exige serviço selecionado.
- Confirmação: `Deseja realmente eliminar o serviço '...' ?`
- Endpoint: `DELETE /proteticos/servicos/{servico_id}`
- Após excluir: recarrega os serviços.

### 14.2. Protético

- No legado existe também exclusão de protético com `protExcluirCadastro()`
- Função: `DELETE /proteticos/{protetico_id}`
- Confirmação: remove também todos os serviços do protético, conforme mensagem de UI.

### 14.3. Restrição real do backend

- O modelo `ServicoProtetico` usa `ondelete="CASCADE"` em `protetico_id`.
- O modelo `Protetico.servicos` usa `cascade="all, delete-orphan"`.

## 15. Ação Imprime

### 15.1. Frontend

- Botão: `prot.btnImprimir`
- Função: `protAbrirRelatorio()`

### 15.2. Escopo

- O relatório usa a lista de serviços do protético atual.
- No modal de relatório existe combo de protético para escolher a tabela.

### 15.3. Saídas suportadas

- `Tela`
- `Impressora`
- `Arquivo`

### 15.4. Formatos de arquivo

- `PDF`
- `HTML`
- `RTF`
- `XLS`
- `TXT`
- `CSV`

### 15.5. Backend

- Para e-mail: `POST /relatorios/enviar-email`
- O restante da geração é feito no frontend legado, sem endpoint específico de impressão para protéticos.

### 15.6. Reuso futuro

O relatório pode ser reaproveitado na nova interface sem mudar backend, desde que o React use os mesmos dados já expostos por `GET /proteticos/{id}/servicos`.

## 16. Ação Fecha

- Botão: `prot.btnFechar`
- Comportamento real: oculta o painel e reexibe `workspaceEmpty`.
- Não há lógica adicional além de fechar a tela.
- No shell atual, o botão é funcionalmente um fechamento de painel, não de aplicação.

## 17. Backend e endpoints

### 17.1. Arquivo principal

- [`backend/routes/proteticos_routes.py`](../backend/routes/proteticos_routes.py)

### 17.2. Endpoints identificados

| Método | Rota | Função | Uso |
| --- | --- | --- | --- |
| GET | `/proteticos` | `listar_proteticos` | Lista protéticos da clínica |
| POST | `/proteticos` | `criar_protetico` | Cria protético |
| PATCH | `/proteticos/{protetico_id}` | `alterar_protetico` | Altera protético |
| DELETE | `/proteticos/{protetico_id}` | `excluir_protetico` | Exclui protético |
| GET | `/proteticos/{protetico_id}/servicos` | `listar_servicos` | Lista serviços do protético |
| POST | `/proteticos/{protetico_id}/servicos` | `criar_servico` | Cria serviço |
| PUT | `/proteticos/servicos/{servico_id}` | `alterar_servico` | Altera serviço |
| DELETE | `/proteticos/servicos/{servico_id}` | `excluir_servico` | Exclui serviço |

### 17.3. Segurança e contexto

- Todos os endpoints usam `get_current_user`.
- O router depende de `require_module_access("procedimentos")`.
- Todas as leituras/escritas relevantes filtram por `current_user.clinica_id`.

### 17.4. Validações relevantes

- protético sem nome -> `400`
- serviço sem nome -> `400`
- nome duplicado por clínica/protético -> `400`
- protético ausente/fora da clínica -> `404`
- serviço ausente/fora da clínica -> `404`

### 17.5. Efeitos colaterais

- criação e alteração fazem `commit()` e `refresh()`
- exclusão remove o registro e confirma em banco
- exclusão de protético remove seus serviços por cascata

## 18. Banco e relacionamentos

### 18.1. Estruturas do Brana Cloud

- `protetico`
- `servico_protetico`
- `controle_protetico`
- `contato` possui `protetico_id` como FK opcional

### 18.2. `protetico`

- `id`: inteiro, PK
- `nome`: `String(150)`, obrigatório
- `clinica_id`: FK para `clinicas.id`, obrigatório
- unicidade: `uq_protetico_clinica_nome`

### 18.3. `servico_protetico`

- `id`: inteiro, PK
- `protetico_id`: FK para `protetico.id`, obrigatório, cascata
- `clinica_id`: FK para `clinicas.id`, obrigatório
- `nome`: `String(180)`, obrigatório
- `indice`: `String(10)`, obrigatório, default `R$`
- `preco`: `Float`, obrigatório, default `0`
- `prazo`: `Integer`, obrigatório, default `0`
- unicidade: `uq_servico_protetico_nome` por `protetico_id + nome`

### 18.4. `controle_protetico`

- `protetico_id`: FK obrigatória com `RESTRICT`
- `servico_protetico_id`: FK opcional com `SET NULL`
- `indice`: `String(20)`, opcional
- `valor`: `Float`, obrigatório, default `0`
- `data_envio`, `data_entrega`, `numero_elementos`, `cor`, `escala`, `material`, `pago`, `situacao`, `observacoes`

### 18.5. Relação com `contato`

- `contato.protetico_id` aponta para `protetico.id`
- no fluxo de agenda de contatos, o tipo textual com `protet` sincroniza/cria protético

### 18.6. O que não foi comprovado por acesso ao banco

- Não houve inspeção direta de DDL do banco em execução nesta auditoria.
- O mapeamento acima veio de models, routes e SQL do EasyDental.

## 19. EasyDental Desktop

### 19.1. Arquivos lidos

- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Mensagens.txt`
- `Y:\EDS70\Mesclagem.txt`
- `Y:\EDS70\Reports\TISS_*.fr3` foram localizados, mas não são prova direta do módulo de protético
- `Y:\EDS70\Textos\TERMO_PROTESE_FIXA_BRANA.rtf`
- ícones e bitmaps relacionados:
  - `Y:\EDS70\Icones\avi_protetico.bmp`
  - `Y:\EDS70\Icones\int_protese.bmp`
  - `Y:\EDS70\Bitmaps\ger_protese.bmp`

### 19.2. Estruturas relevantes encontradas

- `CTRLPROTETICO`
- `TAB_PRT_ITEM`
- `_INDICE`
- `CONTATO`
- `TAB_PRC`

### 19.3. Evidências importantes

- `CTRLPROTETICO` possui:
  - `NROREGISTRO` identity
  - `NROPRO`
  - `NROSER`
  - `ID_PRESTADOR`
  - `NROPAC`
  - `NROIND`
  - `VALOR`
  - `DATAENV`
  - `DATARET`
  - `NROELEM`
  - `COR`
  - `ESCALA`
  - `MATERIAL`
  - `PAGO`
  - `SITUACAO`
  - `OBSERV`
- `TAB_PRT_ITEM` possui:
  - `NROPRO`
  - `NROSER`
  - `DESCRICAO`
  - `NROIND`
  - `PRECO`
  - `PRAZO`
- `TAB_PRT_ITEM.NROPRO` referencia `CONTATO.NROCONTATO`
- `TAB_PRT_ITEM.NROIND` referencia `_INDICE.NROIND`

### 19.4. Leitura segura do desktop

O desktop sugere que o módulo histórico não trabalha com um campo “Código” separado para o serviço, pelo menos na estrutura SQL observada.

O identificador funcional mais próximo é a dupla:

- `NROPRO`
- `NROSER`

Mas isso parece ser chave relacional, não necessariamente “código de exibição”.

### 19.5. Diferenças em relação ao Brana Cloud

- Brana Cloud modela `protetico` e `servico_protetico` como tabelas próprias.
- EasyDental Desktop histórico, pelo SQL, ancora o serviço em `TAB_PRT_ITEM` e `CONTATO`.
- O Brana Cloud já expõe `indice`, `preco` e `prazo` no backend.
- O desktop ainda sugere uma estrutura ligada a controle e contato, não a um “código” visível equivalente.

## 20. Campos e regras

### 20.1. CÓDIGO

Fatos comprovados:

- Não existe campo `codigo` no modelo `ServicoProtetico`.
- Não existe `codigo` no payload do backend de serviços de protético.
- Não existe coluna `Código` no modal legado.

Hipóteses seguras:

- O melhor candidato a um identificador técnico exibível seria `ServicoProtetico.id`.
- No desktop, `NROPRO`/`NROSER` parecem ser chaves de estrutura, não coluna de UI.

### 20.2. SERVIÇO

- Campo real: `nome`
- Tipo: texto livre
- Obrigatório: sim
- Unicidade: por protético
- Ordenação: alfabética sem acento no backend
- Não há evidência de catálogo compartilhado no módulo atual

### 20.3. ÍNDICE

- Campo real: `indice`
- Tipo no backend: `String(10)`
- Default: `R$`
- No legado aparece na coluna “Índice”
- No modal o rótulo visual está como “Preço:”, mas a coluna/payload é `indice`
- No desktop SQL, o índice é FK para `_INDICE`

### 20.4. PREÇO

- Campo real: `preco`
- Tipo no backend: `Float`
- Default: `0`
- Formatação no frontend: moeda pt-BR via `procFmtBr`
- No desktop SQL, o preço em `TAB_PRT_ITEM` aparece como `PRECO float`

### 20.5. PRAZO

- Campo real: `prazo`
- Tipo no backend: `Integer`
- Default: `0`
- No legado é exibido como número puro de dias
- No desktop SQL, `PRAZO` em `TAB_PRT_ITEM` é `smallint`

## 21. Código do serviço

### 21.1. Conclusão técnica

Não há prova de um `código` de negócio do serviço de protético no Brana Cloud atual.

### 21.2. Fonte real disponível

- `ServicoProtetico.id` é o identificador técnico real do serviço.
- `nome` é o identificador funcional visível.

### 21.3. No EasyDental Desktop

O SQL consultado mostra referências a `NROPRO` e `NROSER`, mas não um campo textual explícito chamado `CODIGO` para o serviço de protético.

### 21.4. Viabilidade de exibir Código no React

É viável exibir uma coluna Código apenas se a equipe aceitar que ela represente:

- o `id` técnico do registro, ou
- uma regra derivada a partir de `NROPRO`/`NROSER` no desktop.

O que não é seguro:

- inventar um código funcional sem prova de origem.

## 22. Índice

### 22.1. Brana Cloud

- Modelo: `String(10)`
- Valor padrão: `R$`
- Payload e retorno: texto

### 22.2. EasyDental Desktop

- `TAB_PRT_ITEM.NROIND` aponta para `_INDICE`
- `_INDICE` tem:
  - `NROIND`
  - `NOME`
  - `SIGLA`

### 22.3. Interpretação

No desktop, o índice é uma entidade própria. No Brana Cloud, ele foi simplificado para uma string textual.

## 23. Preço

- No frontend legado, o preço é formatado como moeda.
- No backend atual, o campo é `Float`.
- O formulário usa `procFmtBr` ao carregar e `procParse` ao salvar.
- O valor zero é aceito.
- Não há histórico próprio de preço no módulo de protéticos.

## 24. Prazo

- No backend atual, é inteiro.
- O frontend legado usa `input type="number"`.
- O backend normaliza com `max(0, int(...))`.
- Não há evidência de prazo em dias úteis; o texto da UI fala apenas em `dias`.

## 25. Permissões

### 25.1. Backend

- O router de protéticos depende de `require_module_access("procedimentos")`.
- Isso significa que o módulo está protegido pelo módulo de procedimentos.

### 25.2. Clínica

- Todas as consultas relevantes filtram por `current_user.clinica_id`.
- O `Contato` também usa `clinica_id` e `protetico_id`.

### 25.3. Risco de acesso indevido

- O backend atual bloqueia leitura fora da clínica por filtro explícito.
- Não foi identificado vazamento intencional de dados de outra clínica nesse recorte.

## 26. Tratamento de erros

### 26.1. Frontend legado

- Usa `window.alert` e `window.confirm`.
- Em erro de leitura/carregamento, escreve mensagem no `footerMsg`.
- Em falha de impressão/exportação, avisa por alert.

### 26.2. Backend

- Usa `HTTPException` com:
  - `400` para validação de nome duplicado/vazio
  - `404` para registro inexistente
- Mensagens observadas:
  - `Protetico nao encontrado.`
  - `Servico de protetico nao encontrado.`
  - `Informe o nome do protetico.`
  - `Informe o nome do servico.`
  - `Ja existe um protetico com esse nome.`
  - `Ja existe um servico com esse nome para este protetico.`

## 27. Dependências

### 27.1. Frontend legado

- `requestJson`
- `formatMoney`
- `formatDec2`
- `procFmtBr`
- `procParse`
- `esc`
- `bindStandardGridActivation`
- `ensurePanelChrome`
- `ensureModalChrome`
- `hideAllPanels`
- `relatorioConfigAtual`
- `relatorioDataHoraAtual`
- `relatorioUsuarioAtual`

### 27.2. Backend

- `get_current_user`
- `require_module_access("procedimentos")`
- `get_db`
- SQLAlchemy ORM

### 27.3. Banco

- `clinicas`
- `protetico`
- `servico_protetico`
- `controle_protetico`
- `contato`
- `_INDICE`

## 28. Diferenças entre as implementações

### 28.1. Brana Cloud

- modelagem própria em `protetico` e `servico_protetico`
- CRUD já exposto no backend
- front legado já funcional
- impressão/exportação feita no cliente

### 28.2. EasyDental Desktop

- SQL histórico sugere `TAB_PRT_ITEM` e `CTRLPROTETICO`
- forte acoplamento com `CONTATO` e `_INDICE`
- evidência de estrutura relacional diferente da modelagem atual do Brana Cloud

### 28.3. Ponto crítico

- a coluna `Código` não tem origem comprovada no Brana Cloud atual
- a origem mais confiável para o futuro React precisa ser escolhida entre:
  - `ServicoProtetico.id`
  - um código de negócio derivado do desktop
  - uma decisão funcional nova, se a empresa quiser introduzir código próprio

## 29. Referências do frontend React

Módulos React com padrão útil para reuso:

- [`frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`](../frontend-react/src/features/procedimentos/ProcedimentosPage.jsx)
- [`frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js`](../frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js)
- [`frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx`](../frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx)
- [`frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisTable.jsx`](../frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisTable.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`](../frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx)
- [`frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`](../frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx)
- [`frontend-react/src/features/doencasCid/DoencasCidPage.jsx`](../frontend-react/src/features/doencasCid/DoencasCidPage.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx`](../frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx)
- [`frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`](../frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx)
- [`frontend-react/src/features/planoContas/PlanoContasPage.jsx`](../frontend-react/src/features/planoContas/PlanoContasPage.jsx)
- [`frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`](../frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx)
- [`frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js`](../frontend-react/src/features/planoContas/hooks/usePlanoContasSelection.js)
- [`frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`](../frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx)
- [`frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx`](../frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx)

### 29.1. Padrões reutilizáveis

- separação `Page / components / hooks / api / mappers / validators`
- toolbar compacta
- grade com seleção
- modal de cadastro separado
- hook de seleção separado
- hook de leitura e mutação separado
- validação isolada

## 30. Proposta modular futura

Sugestão documental, sem criar arquivos agora:

```text
frontend-react/src/features/servicosProtetico/
  ServicosProteticoPage.jsx
  components/
    ServicosProteticoToolbar.jsx
    ServicosProteticoTable.jsx
    ServicosProteticoModal.jsx
    ProteticoSelect.jsx
    ServicosProteticoDeleteModal.jsx
    ServicosProteticoPrintModal.jsx
  hooks/
    useServicosProtetico.js
    useServicosProteticoSelection.js
    useServicosProteticoMutation.js
  services/
    servicosProteticoApi.js
  utils/
    servicosProteticoFormatters.js
    servicosProteticoMappers.js
  constants/
    servicosProteticoColumns.js
  validation/
    servicosProteticoValidators.js
```

### 30.1. Responsabilidades

- `Page`: orquestra estado e layout
- `Toolbar`: ações da tela
- `ProteticoSelect`: origem do contexto pai
- `Table`: renderização da lista
- `Modal`: inclusão/alteração
- `DeleteModal`: confirmação de exclusão
- `PrintModal`: parâmetros de impressão/exportação
- `hooks`: leitura, seleção e mutação
- `api`: chamadas HTTP
- `mappers`: conversão entre API e tela
- `formatters`: moeda, prazo e rótulos
- `validators`: validações de formulário

### 30.2. Regra de ouro

Não concentrar barra, combo, tabela, modal, impressão e regras de negócio no mesmo componente monolítico.

## 31. Lacunas

- Não foi validado acesso direto ao banco PostgreSQL em execução.
- Não foi encontrado código-fonte do EasyDental Desktop, apenas SQL, textos e recursos.
- Não foi comprovado que exista um código funcional próprio para serviço de protético.
- Não foi encontrado campo ativo/inativo em `servico_protetico`.
- Não foi comprovada paginação no módulo legado.
- Não foi encontrado filtro textual de busca na tela de serviços de protético.

## 32. Riscos

- risco de tratar `ServicoProtetico.id` como código funcional sem validação de negócio;
- risco de duplicar contratos se a nova tela React inventar coluna Código;
- risco de quebrar impressão se o novo React não preservar os mesmos dados de saída;
- risco de permissão se o módulo deixar de exigir `procedimentos`;
- risco de regressão em seleção de protético e recarga da grade;
- risco de confundir `indice` com preço;
- risco de misturar terminologia desktop e web;
- risco de interpretar `NROPRO/NROSER` como código de exibição sem prova;
- risco de alterar comportamento ao substituir relatório em HTML/preview por outro fluxo;
- risco de acesso cruzado entre clínicas se o filtro por `clinica_id` for perdido.

## 33. Decisões pendentes

- Se a futura coluna `Código` exibirá `ServicoProtetico.id` ou outro valor derivado.
- Se o React manterá `índice` como string textual ou se haverá integração com tabela de índices.
- Se o relatório continuará 100% no frontend ou se a equipe quer futuramente um backend formal de impressão.
- Se o desktop será tomado apenas como referência visual ou também como referência estrutural de dados.
- Se será necessário introduzir um código de negócio novo para o serviço de protético.

## 34. Critérios de aceite da futura implementação

- manter endpoints atuais;
- manter filtros por clínica;
- manter proteção por `procedimentos`;
- manter o combo de protético funcional;
- manter a grade com serviço, índice, preço e prazo;
- não inventar regra de código;
- preservar impressão/exportação;
- preservar exclusão do serviço e do protético;
- não mover regra de negócio para o componente visual;
- não quebrar a seleção ou a recarga após CRUD.

## 35. Lista completa dos arquivos lidos

### 35.1. Raiz e docs

- `README.md`
- `docs/00_master_guide.md`
- `docs/01_visao_produto.md`
- `docs/03_mapa_codigo.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`
- `docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md`
- `docs/fase_2_subetapa_15_reavaliacao_documental_protServicoSelecionado.md`
- `docs/fase_2_subetapa_17_mapeamento_funcoes_selecao_estado_tabela_proteticos.md`
- `docs/fase_2_subetapa_18_contrato_interface_camada_selecao_estado_tabela_proteticos.md`
- `docs/fase_2_subetapa_19_consolidacao_interface_selecao_estado_tabela_proteticos.md`
- `docs/fase_2_subetapa_20_fechamento_parcial_frente_tabela_proteticos.md`
- `docs/auditoria_easydental_virgem_subetapa_8h_contrato_tabelas_procedimentos_precos.md`

### 35.2. Frontend legado

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/tabela-proteticos-helpers.js`

### 35.3. Backend

- `backend/main.py`
- `backend/routes/proteticos_routes.py`
- `backend/routes/relatorios_routes.py`
- `backend/routes/agenda_contatos_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/models/protetico.py`
- `backend/models/controle_protetico.py`
- `backend/models/contato.py`
- `backend/scripts/migrar_proteticos_csv.py`

### 35.4. EasyDental Desktop

- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Mensagens.txt`
- `Y:\EDS70\Mesclagem.txt`
- `Y:\EDS70\Textos\TERMO_PROTESE_FIXA_BRANA.rtf`

### 35.5. Referências React

- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisTable.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`
- `frontend-react/src/features/doencasCid/DoencasCidPage.jsx`
- `frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`
- `frontend-react/src/features/planoContas/PlanoContasPage.jsx`
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`

## 36. Conclusão

O módulo `Serviços de protético` já existe e está funcional no Brana Cloud com backend, frontend legado, tabela própria e impressão/exportação no cliente.

O ponto mais importante desta auditoria é que:

- não foi comprovado um campo funcional próprio de `Código` no serviço;
- o identificador técnico real hoje é `ServicoProtetico.id`;
- o desktop EasyDental sugere outra estrutura histórica (`TAB_PRT_ITEM`, `CTRLPROTETICO`, `CONTATO`, `_INDICE`);
- o novo React pode ser feito sem tocar no backend, mas a coluna `Código` precisa de decisão de negócio explícita antes da implementação.

### Validação da própria auditoria

- nenhum código foi alterado;
- nenhum arquivo externo a este documento foi alterado nesta auditoria;
- banco não foi modificado;
- nenhuma migration foi criada;
- nenhum serviço foi incluído, alterado ou excluído;
- nenhum commit foi feito;
- nenhum push foi feito;
- alterações preexistentes foram preservadas;
- a coluna Código foi investigada, não presumida;
- impressão foi mapeada;
- EasyDental foi investigado;
- endpoints e tabelas foram identificados.
