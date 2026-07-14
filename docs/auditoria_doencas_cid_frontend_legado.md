# Auditoria do m\xF3dulo Doen\xE7as (CID) no frontend legado

## Contexto
Esta auditoria \xE9 exclusivamente investigativa e cobre o m\xF3dulo legado de `Configura\xE7\xF5es -> Tabelas -> Doen\xE7as (CID)`, com foco na migra\xE7\xE3o futura para o novo frontend React em `Tabelas -> Doen\xE7as (CID)`.

Nao houve implementa\xE7\xE3o de rota React, altera\xE7\xE3o de menu, backend, banco, migration, seed, commit ou push.

## Escopo e arquivos auditados

### Frontend legado
- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/cid.js`

### Backend
- `backend/routes/cid_routes.py`
- `backend/models/doenca_cid.py`
- `backend/services/signup_service.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `backend/main.py`
- `backend/security/permissions.py`

### Frontend React
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`

### Documenta\xE7\xE3o
- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/frontend_react_padrao_shell_modulos_administrativos.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`

## Fluxo do legado

### Conclusao operacional desta continuidade
- A implementacao funcional ativa do CID continua em `frontend/app.js`.
- O arquivo `frontend/js/modules/cid.js` existe, mas atua como helper/passivo e nao conduz abertura de tela, requisicoes HTTP nem fluxo principal.
- O carregamento historico da pagina confirma isso: o modulo `cid.js` e carregado, mas `app.js` e quem define o painel, os eventos e as chamadas reais.
- Portanto, para qualquer migracao futura, o comportamento a espelhar deve ser extraido de `frontend/app.js`, e nao do helper isolado.

### Menu e abertura da tela
- O item vis\xEDvel no menu legado \xE9 `Doen\xE7as (CID)...` dentro do agrupador `Tabelas`.
- O agrupador \xE9 `Tabelas` e a ordem real dos itens no HTML \xE9:
  - `Interven\xE7\xF5es / Procedimentos...`
  - `Servi\xE7os de prot\xE9tico...`
  - `Materiais`
  - `Doen\xE7as (CID)...`
  - `Procedimentos gen\xE9ricos...`
- A tela real do legacy \xE9 criada por `cidEnsureUI()` em `frontend/app.js`.
- O painel \xE9 `#cid-panel`, inserido ap\xF3s `#workspace-empty`.
- A fun\xE7\xE3o que abre o m\xF3dulo \xE9 `cidAbrir()`.
- Ordem de abertura:
  1. `cidEnsureUI()`
  2. `cidVincularEventos()`
  3. `hideAllPanels()`
  4. `ensurePanelChrome(cid.panel)`
  5. mostrar `#cid-panel`
  6. ocultar `#workspace-empty`
  7. `await cidCarregar()`
  8. atualizar rodap\xE9 para `Tabela de doen\xE7as (CID) aberta.`
- O legado n\xE3o tem um menu React funcional para a tela; no React o item est\xE1 apenas listado e desabilitado.

### Barra e a\xE7\xF5es
- T\xEDtulo do painel: `Tabela de doen\xE7as (CID)`.
- Bot\xF5es vis\xEDveis:
  - `Nova doen\xE7a...` com \xEDcone `/desktop-assets/novo.png`
  - `Altera...` com \xEDcone `/desktop-assets/editar.png`
  - `Elimina` com \xEDcone `/desktop-assets/eliminar.png`
  - `Fecha` com \xEDcone `/desktop-assets/cancela.png`
- N\xE3o foram encontrados atalhos de teclado dedicados para esses bot\xF5es.
- O bot\xE3o `Altera...` depende de sele\xE7\xE3o.
- O bot\xE3o `Elimina` depende de sele\xE7\xE3o.
- `Fecha` apenas oculta o painel.
- N\xE3o h\xE1 a\xE7\xF5es separadas de `Imprime` ou `Atualiza` no legado.

### Busca, filtros e ordena\xE7\xE3o
- Existe apenas um campo de busca local: `Pesquisar doen\xE7a:`.
- A busca filtra por c\xF3digo ou descri\xE7\xE3o, localmente, no array `cidCache`.
- A filtragem \xE9 incremental com `setTimeout` de 120 ms.
- N\xE3o h\xE1 filtro enviado ao backend.
- N\xE3o h\xE1 combo `Todos` no legado do CID.
- N\xE3o h\xE1 ordena\xE7\xE3o por clique em coluna; a ordem vem da listagem recebida.
- N\xE3o h\xE1 pagina\xE7\xE3o; a renderiza\xE7\xE3o usa batch de 400 linhas via `requestAnimationFrame`, mas a consulta retorna tudo.
- O backend ordena por `codigo ASC, id ASC`.

### Tabela do legado
- Colunas, na ordem:
  - `C\xF3digo` -> `codigo`
  - `Doen\xE7a` -> `descricao`
- Larguras:
  - `C\xF3digo`: `80px`
  - `Doen\xE7a`: largura livre
- Tipo de dado:
  - `C\xF3digo`: texto
  - `Doen\xE7a`: texto
- Tipos ocultos/t\xE9cnicos:
  - `id`
  - `legacy_registro` no payload/retorno, mas n\xE3o exibido
- Sele\xE7\xE3o:
  - simples, por linha
  - linha selecionada recebe classe `selected`
- Duplo clique:
  - abre a edi\xE7\xE3o da linha
- Clique com bot\xE3o direito:
  - n\xE3o identificado
- Estado vazio:
  - n\xE3o h\xE1 mensagem espec\xEDfica de vazio no HTML da tabela; a tabela simplesmente fica sem linhas e o contador mostra `0 itens`
- Loading:
  - a listagem n\xE3o exibe um loading visual espec\xEDfico pr\xF3prio; a fun\xE7\xE3o `cidCarregar()` apenas chama a API
- Erro:
  - mensagem de rodap\xE9 `Falha ao carregar CID.`

### Modal / formul\xE1rio
- T\xEDtulos:
  - inclus\xE3o: `Nova doen\xE7a`
  - altera\xE7\xE3o: `Alterar doen\xE7a`
- Largura aproximada: `min(520px,96vw)`
- Campos:
  - `C\xF3digo`
  - `Doen\xE7a`
  - `Observa\xE7\xF5es`
  - `Incluir na lista de preferidos`
- Ordem visual:
  1. c\xF3digo
  2. doen\xE7a
  3. observa\xE7\xF5es
  4. preferidos
- Tipos:
  - `C\xF3digo`: input texto
  - `Doen\xE7a`: input texto
  - `Observa\xE7\xF5es`: textarea
  - `Incluir na lista de preferidos`: checkbox
- Somente leitura:
  - nenhum
- Obrigat\xF3rios:
  - `C\xF3digo`
  - `Doen\xE7a`
- Valores padr\xE3o:
  - campos vazios, checkbox desmarcado
- Valida\xE7\xF5es:
  - frontend v\xEA c\xF3digo e doen\xE7a n\xE3o vazios
  - backend tamb\xE9m rejeita se c\xF3digo ou descri\xE7\xE3o estiverem vazios
- Payload:
  - `codigo`
  - `descricao`
  - `observacoes`
  - `preferido`
- Bot\xF5es:
  - `Ok`
  - `Cancela`
- Escape:
  - n\xE3o foi identificado tratamento espec\xEDfico
- Enter:
  - n\xE3o foi identificado tratamento espec\xEDfico local; o save depende do clique em `Ok`

### Inclus\xE3o
1. Bot\xE3o `Nova doen\xE7a...`
2. `cidAbrirModal("novo")`
3. modal com t\xEDtulo `Nova doen\xE7a`
4. campos vazios
5. valida\xE7\xE3o local em `cidSalvarModal()`
6. endpoint `POST /cid`
7. payload com `codigo`, `descricao`, `observacoes`, `preferido`
8. resposta espera JSON do item salvo
9. se sucesso: fecha modal e recarrega listagem
10. se erro: `Falha ao salvar CID.`
11. a tabela \xE9 recarregada com `cidCarregar()`
12. a sele\xE7\xE3o \xE9 movida para o `id` retornado, ou permanece quando poss\xEDvel

### Altera\xE7\xE3o
- Exige linha selecionada.
- `cidAbrirModal("editar")` abre o modal com o item atual.
- O registro \xE9 recuperado de `cidSelecionado()`, n\xE3o de uma chamada por ID.
- Endpoint: `PUT /cid/{cid_id}`
- Payload: igual ao de inclus\xE3o.
- Em sucesso:
  - modal fecha
  - a lista recarrega
  - a sele\xE7\xE3o tenta permanecer no item salvo
- Em erro:
  - alerta `Falha ao salvar CID.`

### Exclus\xE3o
- A\xE7\xE3o: bot\xE3o `Elimina`
- Confirma\xE7\xE3o: `Deseja eliminar o CID '{codigo} - {descricao}'?`
- Endpoint: `DELETE /cid/{id}`
- Exclus\xE3o: f\xEDsica, via `db.delete(item)`
- Bloqueios por depend\xEAncia:
  - n\xE3o h\xE1 bloqueio expl\xEDcito no c\xF3digo legado ou na rota
- Ap\xF3s excluir:
  - limpa sele\xE7\xE3o
  - recarrega a listagem

### Refer\xEAncias externas
- `frontend/js/modules/cid.js` existe como m\xF3dulo passivo com `BranaCidModule`
- N\xE3o foram encontrados `.ui` nem imagens espec\xEDficas do CID neste recorte
- A busca textual encontrou o assistente de atestado em `frontend/app.js`, mas ele \xE9 um fluxo diferente do cadastro do CID

### Valida\xE7\xE3o visual executada nesta continuidade
- O backend foi inicializado localmente e a aplica\xE7\xE3o respondeu em `http://127.0.0.1:8000/app`.
- A inspe\xE7\xE3o via browser mostrou a tela de login, nao o modulo autenticado do CID.
- Sem credenciais validas de sessao, nao foi possivel navegar ate `Configura\xE7\xF5es -> Tabelas -> Doen\xE7as (CID)` para validar cliques, modal e listagem no estado autenticado.
- Nenhuma credencial foi criada, reutilizada ou inferida.

## Backend

### Endpoint encontrado
- M\xE9todo HTTP: `GET`
  - Rota: `/cid`
  - Arquivo: `backend/routes/cid_routes.py`
  - Fun\xE7\xE3o: `listar_cid`
  - Autentica\xE7\xE3o: `get_current_user`
  - Permiss\xE3o: `require_module_access("anamnese")`
  - Par\xE2metros: `current_user`, `db`
  - Query parameters: `q`
  - Path parameters: nenhum
  - Payload: nenhum
  - Resposta de sucesso: lista de objetos CID
  - Filtros: `codigo ilike` ou `descricao ilike`
  - Ordena\xE7\xE3o: `codigo ASC, id ASC`
  - Regra de tenant/cl\xEDnica: `DoencaCid.clinica_id == current_user.clinica_id`

- M\xE9todo HTTP: `POST`
  - Rota: `/cid`
  - Fun\xE7\xE3o: `criar_cid`
  - Autentica\xE7\xE3o: `get_current_user`
  - Permiss\xE3o: `require_module_access("anamnese")`
  - Par\xE2metros: `current_user`, `db`, `payload`
  - Payload:
    - `codigo`
    - `descricao`
    - `observacoes`
    - `preferido`
  - Campos obrigat\xF3rios: `codigo`, `descricao`
  - Resposta de sucesso: objeto criado
  - C\xF3digos HTTP: `400` para dados vazios, `200` no sucesso
  - Regra de tenant/cl\xEDnica: grava `clinica_id=current_user.clinica_id`

- M\xE9todo HTTP: `PUT`
  - Rota: `/cid/{cid_id}`
  - Fun\xE7\xE3o: `atualizar_cid`
  - Autentica\xE7\xE3o: `get_current_user`
  - Permiss\xE3o: `require_module_access("anamnese")`
  - Path parameters: `cid_id`
  - Payload: igual ao `POST`
  - Bloqueio: busca por `id` + `clinica_id` via `_load_or_404`
  - Resposta de sucesso: objeto atualizado

- M\xE9todo HTTP: `DELETE`
  - Rota: `/cid/{cid_id}`
  - Fun\xE7\xE3o: `excluir_cid`
  - Autentica\xE7\xE3o: `get_current_user`
  - Permiss\xE3o: `require_module_access("anamnese")`
  - Path parameters: `cid_id`
  - Exclus\xE3o: f\xEDsica
  - Resposta de sucesso: `{\"detail\": \"CID excluido.\"}`

### Model e schema
- Model: `DoencaCid`
- Arquivo: `backend/models/doenca_cid.py`
- Tabela f\xEDsica: `doenca_cid`
- Chave prim\xE1ria: `id`
- Campos:
  - `clinica_id` -> FK `clinicas.id`, `nullable=False`
  - `legacy_registro` -> `Integer`, `nullable=True`
  - `codigo` -> `String(20)`, `nullable=False`
  - `descricao` -> `String(500)`, `nullable=False`
  - `observacoes` -> `Text`, `nullable=True`
  - `preferido` -> `Boolean`, `nullable=False`, default `False`
- Constraint:
  - `UniqueConstraint("clinica_id", "legacy_registro", name="uq_doenca_cid_clinica_registro")`
- Indices:
  - `id`
  - `clinica_id`
  - `legacy_registro`
- Exclus\xE3o l\xF3gica:
  - n\xE3o existe no model atual
- Timestamps:
  - n\xE3o existem no model

### Regras de neg\xF3cio confirmadas
- O c\xF3digo CID aceita texto livre no backend atual, depois de `_clean_text()`.
- N\xE3o h\xE1 normaliza\xE7\xE3o para caixa alta/baixa.
- N\xE3o h\xE1 limite de caracteres validado na rota; o limite vem do schema do banco/model.
- A descri\xE7\xE3o \xE9 obrigat\xF3ria.
- A exclus\xE3o \xE9 f\xEDsica.
- O tenant \xE9 sempre o `clinica_id` do usu\xE1rio autenticado.
- O m\xF3dulo fica sob permiss\xE3o de `anamnese`, o que \xE9 um ponto importante para a futura decis\xE3o de acesso.

### Scripts e bootstrap
- `backend/services/signup_service.py` replica CID padr\xE3o da cl\xEDnica 1 para novas cl\xEDnicas.
- `backend/scripts/aplicar_compatibilidade_schema.py` garante `doenca_cid`, `legacy_registro`, \xEDndices e a unique constraint aditiva.
- O bootstrap usa `INSERT ... SELECT ... ON CONFLICT (clinica_id, legacy_registro) DO NOTHING` para copiar dados da cl\xEDnica origem.

## Banco

### Situa\xE7\xE3o da leitura
- O banco n\xE3o p\xF4de ser consultado neste shell porque faltam drivers PostgreSQL no ambiente local (`sqlalchemy`, `psycopg2`, `psycopg`, `pg8000`) e `psql` tamb\xE9m n\xE3o est\xE1 instalado.
- Assim, esta auditoria do banco ficou limitada a:
  - model
  - rotas
  - scripts de compatibilidade
  - servi\xE7os de bootstrap
- N\xE3o foi poss\xEDvel confirmar por SQL direto contagem de linhas, distribui\xE7\xE3o por cl\xEDnica, chaveamentos reais ou depend\xEAncias efetivas em tabelas de uso clinico.

### Estrutura inferida do banco
- Tabela f\xEDsica: `doenca_cid`
- Schema: n\xE3o foi confirmado por consulta direta; o c\xF3digo assume o schema padr\xE3o da conex\xE3o ativa
- Colunas confirmadas por model/script:
  - `id`
  - `clinica_id`
  - `legacy_registro`
  - `codigo`
  - `descricao`
  - `observacoes`
  - `preferido`

### Depend\xEAncias funcionais
- N\xE3o foi encontrada depend\xEAncia direta em pacientes, prontu\xE1rio, ficha cl\xEDnica, prescri\xE7\xF5es ou atestados dentro da rota do CID.
- O uso encontrado fora do cadastro \xE9 no assistente de atestado do editor de textos, mas isso \xE9 um consumo de consulta, n\xE3o um bloqueio de exclus\xE3o comprovado.

## React existente

### Menu e rota futura
- Arquivo do menu raiz: `frontend-react/src/app/App.jsx`
- Arquivo do agrupador `Tabelas`: `frontend-react/src/layout/BranaIconRail.jsx`
- O item futuro j\xE1 aparece em `contextualMenus.tabelas` como `doencas-cid`, mas est\xE1 `disabled: true`.
- O padr\xE3o real de rota j\xE1 usado para tabelas no React \xE9:
  - `/app/tabelas/procedimentos`
  - `/app/tabelas/procedimentos-genericos`
  - `/app/tabelas/materiais-estoque`
- A rota coerente futura para CID \xE9 muito provavelmente `/app/tabelas/doencas-cid`, mas isso ainda n\xE3o est\xE1 implementado.

### Padr\xE3o reutiliz\xE1vel
- Shell administrativo:
  - `BranaIconRail`
  - `BranaContextPanel`
  - `BranaActionTopbar`
  - `BranaWorkspace`
- Tabela:
  - `BranaTable`
  - `TableColumnFilterHeader`
- Padr\xE3o de toolbar:
  - `BranaActionTopbar` e os topbars por m\xF3dulo em `App.jsx`
- Padr\xE3o de modal:
  - `antd Modal`, `Form`, `Select`, `Input`, `message`

### Refer\xEAncias reais compar\xE1veis
- `TiposIndicacaoPage.jsx` \xE9 a melhor refer\xEAncia para shell/tabela/modal de um cadastro administrativo.
- `ProcedimentosPage.jsx` mostra tabela com cabe\xE7alho filtr\xE1vel e modal separado do grid.
- `MateriaisEstoquePage.jsx` mostra toolbar com filtros na barra superior e a\xE7\xF5es dependentes da sele\xE7\xE3o.

## Proposta modular inicial

### Estrutura sugerida
- `frontend-react/src/features/doencasCid/DoencasCidPage.jsx`
- `frontend-react/src/features/doencasCid/doencasCidApi.js`
- `frontend-react/src/features/doencasCid/doencasCidMappers.js`
- `frontend-react/src/features/doencasCid/doencasCidConstants.js`
- `frontend-react/src/features/doencasCid/components/DoencaCidToolbar.jsx`
- `frontend-react/src/features/doencasCid/components/DoencaCidTable.jsx`
- `frontend-react/src/features/doencasCid/components/DoencaCidModal.jsx`
- `frontend-react/src/features/doencasCid/hooks/useDoencasCid.js`

### Responsabilidade de cada componente
- `DoencasCidPage.jsx`
  - orquestra estado, carregamento, sele\xE7\xE3o e composi\xE7\xE3o da tela
- `DoencaCidToolbar.jsx`
  - concentra a barra de a\xE7\xF5es e a busca
- `DoencaCidTable.jsx`
  - renderiza a tabela com `BranaTable` e `TableColumnFilterHeader`
- `DoencaCidModal.jsx`
  - cuida do formul\xE1rio de inclus\xE3o/edi\xE7\xE3o
- `doencasCidApi.js`
  - encapsula `/cid`
- `doencasCidMappers.js`
  - normaliza payload e retorno
- `doencasCidConstants.js`
  - guarda t\xEDtulos, labels, defaults e constantes visuais
- `useDoencasCid.js`
  - opcional; vale a pena se houver complexidade de carregamento/sele\xE7\xE3o suficiente para justificar extra\xE7\xE3o

### Arquivos existentes que futuramente precisariam ser alterados
- `frontend-react/src/app/App.jsx`
- possivelmente `frontend-react/src/layout/BranaIconRail.jsx`
- possivelmente `frontend-react/src/layout/BranaContextPanel.jsx` se a navega\xE7\xE3o for padronizada para o novo screen

## Riscos e lacunas
- A rota React do CID ainda n\xE3o existe; o item est\xE1 desabilitado.
- O backend usa permiss\xE3o `anamnese`, o que pode exigir revis\xE3o de produto antes da implementa\xE7\xE3o.
- O banco n\xE3o foi lido por SQL direto neste ambiente.
- A valida\xE7\xE3o visual autenticada do legado nao foi conclu\xEDda por ausencia de credenciais.
- N\xE3o foi comprovado bloqueio de exclus\xE3o por depend\xEAncias reais em outras tabelas.
- O legado do CID aceita texto livre; se o contrato futuro exigir formato de CID, isso precisar\xE1 ser definido antes da implementa\xE7\xE3o.
- A rota atual n\xE3o faz pagina\xE7\xE3o nem ordena\xE7\xE3o interativa.

## Trechos de evid\xEAncia
- `frontend/index.html`: menu `Doen\xE7as (CID)...`
- `frontend/app.js`: `cid-panel`, `cidAbrir()`, `cidCarregar()`, `cidSalvarModal()`, `cidExcluirSelecionado()`
- `frontend/js/modules/cid.js`: m\xF3dulo passivo `BranaCidModule`
- `backend/routes/cid_routes.py`: `/cid` com GET/POST/PUT/DELETE
- `backend/models/doenca_cid.py`: tabela e campos do model
- `frontend-react/src/app/App.jsx`: item `doencas-cid` desabilitado
- `frontend-react/src/layout/BranaIconRail.jsx`: grupo `Tabelas`

## Confirma\xE7\xF5es finais
- Nenhuma implementa\xE7\xE3o React foi feita.
- Nenhuma rota foi criada.
- Nenhuma altera\xE7\xE3o no menu foi aplicada.
- Nenhuma altera\xE7\xE3o no backend foi feita.
- Nenhuma altera\xE7\xE3o no banco foi feita.
- Nenhum commit foi feito.
- Nenhum push foi feito.

## Recomenda\xE7\xE3o da pr\xF3xima etapa
Antes de implementar, alinhar:
1. se o CID deve continuar sob permiss\xE3o de `anamnese` ou ganhar permiss\xE3o pr\xF3pria;
2. se a lista futura precisa replicar somente o legado ou tamb\xE9m ganhar melhorias de filtro/ordena\xE7\xE3o;
3. se a rota definitiva ser\xE1 mesmo `/app/tabelas/doencas-cid`.
