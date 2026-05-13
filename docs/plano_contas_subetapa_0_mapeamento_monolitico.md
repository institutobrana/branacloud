# Plano de Contas - Subetapa 0: mapeamento monolítico

- Branch atual: `modularizacao-segura-fase-1`
- Status do working tree antes da análise: limpo
- Arquivos analisados: `frontend/app.js`, `frontend/index.html`
- Documentos consultados:
  - `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
  - `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
  - `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
  - `docs/03_mapa_codigo.md`
  - `docs/04_funcionalidades.md`
  - `docs/07_fluxos.md`
  - `docs/10_continuidade.md`
- Documentos antigos relacionados a Plano de Contas encontrados:
  - `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
  - Referências textuais em `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`, `docs/unidades_subetapa_0_mapeamento_monolitico.md` e `docs/frontend_auditoria_appjs.md`

## Confirmação de integridade

- `frontend/app.js` foi alterado: não
- `frontend/index.html` foi alterado: não
- `frontend/js/modules/unidades.js` foi alterado: não
- `frontend/js/modules/unidades.js` continua carregado antes do `app.js`: sim
- Nenhum código funcional foi alterado nesta análise: confirmado

## Onde o módulo aparece no shell

- Menu principal: `frontend/index.html` possui `data-menu-action="plano"` com o rótulo `Plano de contas...`
- Dispatcher do shell: `frontend/app.js` trata `action === "plano"` e chama `planoAbrir()`
- Fechamento de painel: `closeWorkspacePanel("plano-panel")` e `hideAllPanels()` conhecem o painel

## Funções encontradas e classificação

| Função | Classificação | Observação |
|---|---|---|
| `planoEnsureUI()` | abertura/painel + DOM + dependência compartilhada | Cria `plano-panel`, `aux-panel` e `cad-modal-backdrop`; é o ponto mais sensível |
| `planoCarregar()` | carregamento/API + gatilho de renderização | Busca grupos e inicializa seleção |
| `planoRenderGrupos()` | renderização | Atualiza a grade de grupos |
| `planoRenderCats()` | renderização | Atualiza a grade de categorias |
| `planoAbrir()` | abertura/painel | Mostra painel e dispara carga inicial |
| `planoGrupoSel()` | seleção / helper de estado | Lookup em `gruposCache` e `grupoSelId`; não toca DOM |
| `planoCatSel()` | seleção / helper de estado | Lookup em `gruposCache` e `catSelId`; não toca DOM |
| `planoDialogGrupo()` | modal + salvar | Usa `cadModalAbrir` e `requestJson` |
| `planoDialogCategoria()` | modal + salvar | Usa `cadModalAbrir` e `requestJson` |
| `planoExcluirGrupo()` | excluir | Confirma e chama `DELETE` |
| `planoExcluirCategoria()` | excluir + migração | Valida uso, pode migrar lançamentos e excluir |
| `cadModalAbrir()` | helper compartilhado com DOM | Infraestrutura modal genérica usada por outros módulos |
| `executarAcaoMenu()` / dispatcher do shell | evento/bind de menu | Trata o `data-menu-action="plano"` |
| `bindStandardGridActivation()` aplicado em `plano.tbGrupos` e `plano.tbCats` | evento/bind compartilhado | Seleção por clique e edição por duplo clique |
| `auxAbrir()` | dependência compartilhada | Chama `planoEnsureUI()` para reaproveitar layout/modal do shell |
| `closeWorkspacePanel()` e `hideAllPanels()` | dependência compartilhada do shell | Conhecem `plano-panel` e `aux-panel` |

## Variáveis / estado / cache

- `plano = null`
- `gruposCache = []`
- `grupoSelId = null`
- `catSelId = null`
- `aux = null`
- `auxItensCache = []`
- `auxSelId = null`
- `cadModal` como objeto utilitário de modal genérico
- `workspaceEmpty` e `footerMsg` como estado do shell/foco de tela
- `plano` como objeto de UI com `btnOpen`, `panel`, `tbGrupos`, `tbCats`, botões de CRUD e fechamento
- `aux` como objeto de UI compartilhado com o mesmo scaffold

## Elementos de DOM usados

- `#btn-open-plano`
- `#plano-panel`
- `#plano-grupos`
- `#plano-cats`
- `#plano-btn-novo-grupo`
- `#plano-btn-altera-grupo`
- `#plano-btn-elimina-grupo`
- `#plano-btn-fechar`
- `#plano-btn-nova-cat`
- `#plano-btn-altera-cat`
- `#plano-btn-elimina-cat`
- `#aux-panel`
- `#aux-tipos`
- `#aux-itens`
- `#aux-btn-novo`
- `#aux-btn-altera`
- `#aux-btn-elimina`
- `#aux-btn-fechar`
- `#cad-modal-backdrop`
- `#cad-modal-body`
- `#cad-modal-ok`
- `#cad-modal-cancelar`

## Fluxo de abertura pelo menu

1. O usuário clica em `Plano de contas...` no menu.
2. O botão carrega `data-menu-action="plano"`.
3. O dispatcher de `frontend/app.js` executa `await planoAbrir();`.
4. `planoAbrir()` chama `planoEnsureUI()`.
5. `planoEnsureUI()` monta o painel, o painel auxiliar e o modal genérico se ainda não existirem.
6. `hideAllPanels()` esconde os demais módulos.
7. O painel de Plano de Contas é exibido.
8. `planoCarregar()` carrega os dados iniciais.

## Fluxo de renderização

1. `planoCarregar()` chama `GET /cadastros/grupos`.
2. A resposta preenche `gruposCache`.
3. `grupoSelId` recebe o primeiro grupo, se existir.
4. `catSelId` é limpo.
5. `planoRenderGrupos()` escreve a tabela de grupos.
6. `planoRenderCats()` escreve a tabela de categorias do grupo selecionado.
7. A seleção ativa usa a classe `selected`.

## Fluxo de seleção

- Clique em linha de grupo:
  - `bindStandardGridActivation(plano.tbGrupos, ...)`
  - atualiza `grupoSelId`
  - limpa `catSelId`
  - re-renderiza grupos e categorias
- Duplo clique em grupo:
  - chama `planoDialogGrupo(g)`
- Clique em linha de categoria:
  - `bindStandardGridActivation(plano.tbCats, ...)`
  - atualiza `catSelId`
  - re-renderiza categorias
- Duplo clique em categoria:
  - chama `planoDialogCategoria(c)`

## Fluxo de modal

- Não há modal dedicado separado por panel principal.
- `planoDialogGrupo()` e `planoDialogCategoria()` usam `cadModalAbrir()`.
- O modal é genérico, criado uma vez e reutilizado por vários fluxos.
- O botão Ok do modal executa a callback passada por cada função.

## Fluxo de salvar / alterar / excluir

- Grupo novo/alterado:
  - `planoDialogGrupo()`
  - `POST /cadastros/grupos` ou `PUT /cadastros/grupos/{id}`
- Categoria nova/alterada:
  - `planoDialogCategoria()`
  - `POST /cadastros/categorias` ou `PUT /cadastros/categorias/{id}`
- Excluir grupo:
  - `planoExcluirGrupo()`
  - `DELETE /cadastros/grupos/{id}`
- Excluir categoria:
  - `planoExcluirCategoria()`
  - `GET /cadastros/categorias/{id}/em-uso`
  - se não estiver em uso, `DELETE /cadastros/categorias/{id}`
  - se estiver em uso, `POST /cadastros/categorias/{id}/migrar-e-excluir`

## Endpoints / API usados

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/cadastros/grupos` | Carregar grupos e categorias |
| `POST` | `/cadastros/grupos` | Criar grupo |
| `PUT` | `/cadastros/grupos/{id}` | Alterar grupo |
| `DELETE` | `/cadastros/grupos/{id}` | Excluir grupo |
| `GET` | `/cadastros/categorias/{id}/em-uso` | Validar exclusão de categoria |
| `POST` | `/cadastros/categorias/{id}/migrar-e-excluir` | Migrar lançamentos e excluir categoria |
| `POST` | `/cadastros/categorias` | Criar categoria |
| `PUT` | `/cadastros/categorias/{id}` | Alterar categoria |

## Dependências compartilhadas com outros módulos

- `requestJson`
- `esc`
- `bindStandardGridActivation`
- `cadModalAbrir`
- `ensurePanelChrome`
- `hideAllPanels`
- `closeWorkspacePanel`
- `workspaceEmpty`
- `footerMsg`
- `auxAbrir()` / `auxAplicarLayoutDesktop()` porque o scaffold é compartilhado
- `aux-panel` e `cad-modal-backdrop` criados junto com o Plano de Contas

## Helpers puros candidatos

- Nenhum helper puro seguro foi identificado
- `planoGrupoSel()` e `planoCatSel()` parecem helpers pequenos, mas dependem de estado global mutável (`gruposCache`, `grupoSelId`, `catSelId`)
- `cadModalAbrir()` é reutilizável, mas acessa DOM e portanto não é puro

## Itens que não devem ser movidos nas próximas subetapas

- `planoEnsureUI()`
- `planoAbrir()`
- `planoCarregar()`
- `planoRenderGrupos()`
- `planoRenderCats()`
- `planoGrupoSel()`
- `planoCatSel()`
- `planoDialogGrupo()`
- `planoDialogCategoria()`
- `planoExcluirGrupo()`
- `planoExcluirCategoria()`
- o trecho do dispatcher do menu `if(action==="plano"){ await planoAbrir(); }`
- os binds de `bindStandardGridActivation` em `plano.tbGrupos` e `plano.tbCats`
- `cadModalAbrir()`
- `hideAllPanels()` e `closeWorkspacePanel()` enquanto continuam conhecendo `plano-panel`
- qualquer `requestJson` e qualquer endpoint listado acima
- qualquer integração com `aux` que dependa do scaffold compartilhado
- qualquer contrato `window.*` ou shell global utilizado pelo fluxo

## Riscos

- O bloco é relativamente acoplado ao shell, especialmente por compartilhar `cadModalAbrir` e o scaffold com `aux`
- Não há helper puro seguro para iniciar extração de comportamento
- O uso de endpoints genéricos de financeiro/cadastros aumenta a chance de regressão se a extração antecipar demais
- A criação do `aux-panel` dentro de `planoEnsureUI()` mostra que o painel não está isolado
- A exclusão de categorias tem fluxo especial de migração, o que exige cautela adicional

## Recomendação para a Subetapa 1

- Recomendo criar apenas uma estrutura modular controlada vazia para Plano de Contas, sem mover comportamento ainda
- Antes de mover qualquer função, fazer nova análise das dependências compartilhadas de `cadModal`, `aux` e do shell
- Não recomendo wrappers nem extração de helpers nesta primeira aproximação, porque nenhum helper puro seguro apareceu

## Conclusão

- O módulo atual de Plano de Contas existe no monólito como painel financeiro compartilhado com `aux`
- A abertura, renderização, seleção, modal, salvar e excluir permanecem no `frontend/app.js`
- O ciclo desta Subetapa 0 termina com mapeamento suficiente para uma estrutura controlada, mas não para migração de comportamento
