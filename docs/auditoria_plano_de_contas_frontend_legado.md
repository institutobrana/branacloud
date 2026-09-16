# Auditoria - Plano de Contas no Frontend Legado

## Escopo

Auditoria documental do módulo `Plano de contas` no frontend legado do Brana Cloude.

## Fontes consultadas

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/plano_contas_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- `docs/plano_contas_subetapa_3_helpers_puros.md`
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## Arquivos confirmados

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/plano-contas.js`

## Entrada no menu

- O item do menu existe em `frontend/index.html` com `data-menu-action="plano"`.
- O rótulo exibido é `Plano de contas...`.
- O dispatcher do shell em `frontend/app.js` trata `action === "plano"` e chama `planoAbrir()`.

## Estrutura visual confirmada

- O painel é criado por `planoEnsureUI()` em `frontend/app.js`.
- A tela usa dois blocos principais:
  - `Grupo de contas`
  - `Categorias do grupo`
- Há uma barra de ações superior com:
  - `Novo grupo`
  - `Altera`
  - `Elimina`
  - `Fechar`
- Há uma barra de ações inferior para categorias com:
  - `Nova categoria`
  - `Altera`
  - `Elimina`
- A seleção de linha usa a classe `selected`.
- A lista é renderizada em duas tabelas simples com `<tbody>`.

## Arquivos e funções

- `frontend/app.js`
  - `planoEnsureUI()`
  - `planoCarregar()`
  - `planoRenderGrupos()`
  - `planoRenderCats()`
  - `planoAbrir()`
  - `planoGrupoSel()`
  - `planoCatSel()`
  - `planoDialogGrupo()`
  - `planoDialogCategoria()`
  - `planoExcluirGrupo()`
  - `planoExcluirCategoria()`
- `frontend/js/modules/plano-contas.js`
  - namespace passivo `window.BranaPlanoContasModule`
  - helpers puros integrados de forma opcional no `app.js`

## Botões e contratos observados

- `Novo grupo`
  - abre modal de grupo novo
  - exige nome
  - envia `POST /cadastros/grupos`
- `Altera` do grupo
  - exige grupo selecionado
  - envia `PUT /cadastros/grupos/{id}`
- `Elimina` do grupo
  - exige grupo selecionado
  - envia `DELETE /cadastros/grupos/{id}`
  - bloqueia quando o grupo possui categorias
- `Nova categoria`
  - exige grupo selecionado
  - abre modal de categoria nova
  - envia `POST /cadastros/categorias`
- `Altera` da categoria
  - exige categoria selecionada
  - envia `PUT /cadastros/categorias/{id}`
- `Elimina` da categoria
  - exige categoria selecionada
  - primeiro consulta `GET /cadastros/categorias/{id}/em-uso`
  - se não estiver em uso, envia `DELETE /cadastros/categorias/{id}`
  - se estiver em uso, abre migração com `POST /cadastros/categorias/{id}/migrar-e-excluir`

## Formulários e campos

- Grupo
  - `nome`
  - `tipo`
- Categoria
  - `nome`
  - `tipo`
  - `grupo_id`
  - `tributavel`

## Regras funcionais confirmadas

- Grupo e categoria são mantidos na mesma tela, mas em listas separadas.
- Categoria exige vínculo com grupo.
- Grupo não pode ser excluído se houver categorias vinculadas.
- Categoria não pode ser excluída se estiver em uso por lançamentos.
- Se a categoria estiver em uso, o fluxo pede migração para outra categoria.
- A lista é recarregada após salvar, excluir ou migrar.
- O nome do módulo em documentações e UI é `Plano de contas`.

## Contratos técnicos confirmados

- A UI depende de `requestJson`.
- A UI depende de `cadModalAbrir()` para a migração de categoria.
- O frontend legado continua sendo a fonte funcional atual do módulo.
- O módulo passivo `frontend/js/modules/plano-contas.js` não assumiu o fluxo funcional.

## O que ficou NÃO CONFIRMADO

- A árvore hierárquica real com múltiplos níveis não foi confirmada no frontend legado.
- Não foi confirmada a existência de expansão/recolhimento por `+` e `-` no frontend legado atual.
- Não foi confirmado layout em formato de `L` na implementação legado atual.
- Não foi confirmada presença de colunas adicionais além de grupo, nome e tipo na tela atual.
- Não foi confirmada a existência de ações `Detalhes`, `Preferências` e `Imprimir` no frontend legado atual.
- Não foi confirmada lógica de bloqueio/desbloqueio/ativação/desativação.

## Conclusão

O frontend legado do Brana Cloude implementa o módulo de Plano de Contas de forma monolítica em `frontend/app.js`, com entrada no menu em `frontend/index.html`, carregamento de grupos e categorias via API de cadastros e operações de CRUD com regra de exclusão protegida.
