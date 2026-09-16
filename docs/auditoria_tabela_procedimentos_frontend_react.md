# Auditoria - Tabela de Procedimentos no frontend React

## 1. Objetivo

Este documento consolida a auditoria funcional, visual e arquitetural da frente `Tabelas -> Tabela de procedimentos` para o novo frontend React do Brana Cloude.

A fonte da verdade para comportamento continua sendo o codigo legado e o backend existente. Esta auditoria nao implementa nada.

## 2. Escopo auditado

- Entrada da frente no legado e no React.
- Shell visual administrativo.
- Barra de acoes.
- Filtros da listagem.
- Tabela principal.
- Editor de procedimento.
- Procedimento generico como dependencia.
- Materiais vinculados.
- Fases vinculadas.
- CRUD de tabelas.
- Reajuste.
- Relatorio.
- Endpoints, modelos e payloads relacionados.

## 3. Evidencias do legado

### 3.1 Entrada e navegacao

- Menu legado em `frontend/index.html` abre o painel `procedimentos-panel` por `data-menu-action="tabelas-procedimentos"`.
- No novo frontend React, a entrada confirmada pelo usuario e `Tabelas -> Procedimentos`.
- O agrupador lateral permanece `Tabelas`.
- O nome visual do item lateral deve ser exatamente `Procedimentos`.
- A rota tecnica recomendada permanece `/app/tabelas/procedimentos`.
- O painel principal tem o titulo `Configura tabela de preços`.
- A abertura funcional esta em `frontend/app.js`, na funcao `abrirProcedimentos()`.
- A rota/recurso backend central e `backend/routes/procedimentos_routes.py`.

### 3.2 Shell e layout legado

- O painel principal usa uma lista superior, uma barra de acoes, filtros e uma grade central.
- O editor abre como `novo-proc-panel`, com estrutura interna dividida em `Painel de Cadastro` e `Painel Financeiro`.
- Para o novo frontend React, o contrato confirmado e:
  - shell em L;
  - tela principal no workspace;
  - modal proprio para inclusao e alteracao;
  - fechamento do modal retornando para a tabela com filtros preservados.
- O fluxo legado nao usa pagina separada por rota, e sim painel interno do monolito.

### 3.3 Barra de acoes

Controles confirmados no legado:

- `Nova tabela`
- `Altera tabela`
- `Elimina tabela`
- `Imprime`
- `Fechar`
- `Nova intervenção...`
- `Altera intervenção...`
- `Elimina`
- `% Reajusta tabela...`

No editor:

- `Gravar`
- `Voltar`
- `Vincular material`
- `Desvincular material`

### 3.4 Filtros

- Combo `Tabelas`.
- Combo `Especialidade`.
- Busca textual `Nome da intervenção / procedimento`.
- A lista de tabelas vem de `GET /procedimentos/filtros`.
- A listagem usa `GET /procedimentos?q=...&tabela_id=...&especialidade=...`.

### 3.5 Tabela principal

Colunas visiveis no HTML legado:

- `Código`
- `Procedimento`
- `Tempo`
- `Preço`
- `Custo Lab`

Na implementacao do app.js, a tabela e renderizada por `procRenderList()` com os campos:

- `codigo`
- `nome`
- `tempo`
- `preco`
- `custo_lab`

### 3.6 Editor de procedimento

O editor legado possui:

- bloco principal de cadastro;
- bloco financeiro;
- grade de materiais vinculados.

Campos confirmados no HTML:

- `codigo`
- `nome`
- `procedimento_generico_id`
- `especialidade`
- `simbolo_grafico`
- `garantia_meses`
- `forma_cobranca`
- `valor_repasse`
- `preco`
- `custo_lab`
- `tempo`
- `inativar`
- `preferidos`
- `observacoes`
- `inclusao`
- `alteracao`

Campos financeiros exibidos:

- `CFPH`
- `Mat. Consumo`
- `Custo R$`
- `Imposto`
- `Comissão CD`
- `Taxa Cartão`
- `Valor Mínimo`
- `Lucro Bruto`
- `Lucro Líquido`
- `Rendimento %`
- `Bom 30 a 40%`
- `Bom 10 a 20%`
- `Lucro por hora`

O painel financeiro do modal foi auditado separadamente e possui contrato proprio em `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`.

### 3.7 Procedimento generico

- O combo vem de `GET /cadastros/procedimentos-genericos?q=`.
- O valor exibido no combo no legado usa `id` do registro generico.
- O label combinado usa `codigo - descricao`.
- Ao carregar o editor, o legado busca `procedimento_generico_id`, `especialidade`, `simbolo_grafico`, `tempo`, `custo_lab`, `observacoes` e o preview do simbolo.
- O comportamento de heranca e reaproveitamento existe no backend de procedimentos.

### 3.8 Materiais vinculados

- A grade aparece no rodape do editor.
- O legado usa modal proprio para vincular material.
- Endpoints confirmados:
  - `POST /procedimentos/{procedimento_id}/materiais-vinculados`
  - `PUT /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`
  - `DELETE /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`

### 3.9 Fases vinculadas

- O backend expõe `fases_vinculadas` no detalhe do procedimento.
- A auditoria nao encontrou uma interface de fases dentro do painel `Tabela de procedimentos` no legado.
- O fluxo de fases esta presente para heranca e persistencia, mas nao como subpainel visivel nesse modulo.

### 3.10 CRUD de tabelas

Contrato real do modal:

- nome da tabela;
- fonte pagadora;
- indice monetario;
- numero de credenciamento quando convênio;
- tipo TISS;
- inativar tabela;
- copiar de outra tabela.

Rotas:

- `GET /procedimentos/tabelas`
- `POST /procedimentos/tabelas`
- `PATCH /procedimentos/tabelas/{codigo}`
- `DELETE /procedimentos/tabelas/{codigo}`

### 3.11 Reajuste e relatorio

- Reajuste:
  - `GET /procedimentos/tabelas/reajuste-preview`
  - `POST /procedimentos/tabelas/reajuste-aplicar`
- Relatorio:
  - `GET /procedimentos/relatorio-tabela`

### 3.12 Dependencias de backend e modelo

Modelos principais:

- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento_tabela.py`

Entidades relacioandas:

- `procedimento_material`
- `procedimento_fase`
- `procedimento_generico_material`
- `procedimento_generico_fase`
- `material`
- `simbolo_grafico_catalogo`
- `tiss_tipo_tabela`
- `cenario`

## 4. React existente que serve de padrao

Arquivos lidos:

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/layout/BranaShell.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`

Padrões reutilizáveis confirmados:

- shell administrativo em `L`;
- barra horizontal integrada à lateral;
- header filtravel de tabela via `TableColumnFilterHeader`;
- pagina administrativa por rota `/app/tabelas/...`;
- uso de `message` para feedback de UI no React atual;
- componentes de modal reutilizáveis como `BranaModal`.

## 5. Descobertas complementares

- O modulo de procedimentos no legado eh mais amplo que o recorte visual inicial, porque inclui CRUD de tabelas, CRUD de procedimentos, materiais vinculados, reajuste e relatorio.
- O backend ja trata tenant por `current_user.clinica_id`.
- O editor legado sincroniza simbolo grafico e procedimento generico sem depender de invento no frontend.
- O legado expõe `fases_vinculadas`, mas nao encontrei interface de fases no painel principal desta frente.
- O novo React ja possui padrao de shell e de header filtravel suficiente para suportar a recriacao.

## 6. Conclusao

Existe contrato suficiente para implementar a frente no React sem inventar regra.

Os pontos ainda nao abertos na implementacao sao principalmente de recorte de entrega, nao de contrato funcional.
