# Prestadores - Retomada pos varredura de modulos parciais - Estado atual

## Objetivo

Documentar a retomada do modulo Prestadores como um modulo parcial ja iniciado, sem tratar o tema como um modulo novo e sem alterar codigo.

## Escopo

Esta fase e somente documental.

Foram inspecionados apenas documentos, `frontend/js/modules/prestadores.js`, `frontend/app.js` e `frontend/index.html`.

Nao houve alteracao de codigo, DOM, payload, backend, banco, permissao, agenda, financeiro, materiais ou textos visiveis.

## Arquivos inspecionados

- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `frontend/js/modules/prestadores.js`
- `frontend/app.js`
- `frontend/index.html`

## Checks iniciais

- branch atual: `modularizacao-segura-fase-1`
- `HEAD` e `origin/modularizacao-segura-fase-1` estavam em `d38107e` antes desta fase
- havia pendencias nao relacionadas no worktree, mas nenhum diff rastreado de codigo
- `git diff --stat` estava vazio
- `git diff --cached --stat` estava vazio

## Base documental encontrada

| Documento | Papel aparente | Observacao |
|---|---|---|
| `docs/prestadores_subetapa_0_mapeamento_monolitico.md` | Mapeamento do bloco monolitico | Confirma que o fluxo principal de Prestadores ainda morava em `app.js` e mapeia os candidatos pequenos. |
| `docs/prestadores_subetapa_1_namespace_passivo.md` | Namespace passivo | Registra a criacao do namespace `window.BranaPrestadoresModule` e o carregamento antes de `app.js`. |
| `docs/prestadores_subetapa_2_fronteiras_contratos.md` | Fronteiras e contratos | Consolida a fronteira entre `app.js` e o namespace passivo e aponta `prestFmtCodigo` como candidato seguro. |
| `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md` | Helper puro | Registra a criacao do helper puro `prestFmtCodigo` no modulo passivo. |
| `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md` | Integracao do helper | Mostra que `app.js` passou a delegar `prestFmtCodigo` ao namespace quando disponivel, com fallback local. |
| `docs/prestadores_subetapa_5_encerramento_ciclo.md` | Encerramento do mini ciclo | Resume o estado consolidado: namespace passivo, helper puro exposto e `app.js` como fonte funcional da verdade. |
| `docs/recomendacao_proximo_modulo_pos_prestadores.md` | Recomendacao posterior ao ciclo | Serve como referencia historica, mas nao muda o fato de que Prestadores ja estava iniciado. |
| `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md` | Varredura comparativa | Reclassifica Prestadores como modulo parcial ja iniciado, nao como modulo novo. |

## Estado atual do modulo JS

O arquivo `frontend/js/modules/prestadores.js` existe e expoe `window.BranaPrestadoresModule`.

Estado observado do namespace:

- `name: "prestadores"`
- `version: "0.2.0"`
- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- `subetapa: "1_namespace_passivo"`

Funcoes expostas no namespace:

- `meta`
- `getInfo()`
- `getStatus()`
- `prestFmtCodigo()`

O modulo nao acessa DOM, nao faz `fetch`, nao chama `requestJson` e nao toca backend.

## Estado atual do carregamento no index.html

O `frontend/index.html` ja carrega `frontend/js/modules/prestadores.js` antes de `frontend/app.js`.

Trecho observado:

- `frontend/js/modules/prestadores.js` esta incluido por volta da linha 3929
- `frontend/app.js` vem depois
- os scripts de apoio de Prestadores/agenda continuam depois de `app.js`

Isso significa que o namespace passivo ja esta disponivel quando `app.js` executa.

## Estado atual no frontend/app.js

`frontend/app.js` continua sendo a fonte funcional da verdade para Prestadores.

O bloco atual ainda concentra:

- abertura do painel (`prestAbrir`)
- criacao da UI dinamica (`prestEnsureUI`)
- carregamento da lista (`prestCarregar`)
- renderizacao da grade (`prestRender`)
- selecao de linha (`prestSelecionarLinha`)
- filtro e selecao corrente (`prestFiltrarLista`, `prestSelecionado`)
- placeholder das acoes (`prestAcoesPlaceholder`)
- integracao com o chrome do painel e com os binds da grade

O helper `prestFmtCodigo` dentro de `app.js` agora atua como wrapper local e tenta usar `window.BranaPrestadoresModule.prestFmtCodigo` antes de cair no fallback antigo.

## Funcoes/helpers ja movidos ou delegados

- `prestFmtCodigo` foi o unico helper funcional delegado ao namespace passivo
- `app.js` ainda possui wrapper local para o helper, com fallback
- `getInfo()` e `getStatus()` existem apenas como introspeccao do modulo passivo

## Funcoes ainda concentradas no app.js

- `prestSelecionado`
- `prestStatusHtml`
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`
- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`

## Dependencias identificadas

### DOM

Dependem de DOM o painel `prestadores-panel`, o `tbody`, os botoes `prest-btn-novo`, `prest-btn-editar`, `prest-btn-excluir`, `prest-btn-agenda`, `prest-btn-convenios`, `prest-btn-comissoes`, `prest-btn-fechar`, o select `prest-cbo-especialidade`, o input `prest-txt-nome`, o total `prest-total`, alem de `workspaceEmpty` e `footerMsg`.

### Estado global

Dependem de estado global `prestCfg`, `prestadoresCache`, `prestadorSelId` e `sessaoAtual`.

### Backend/API

O fluxo principal atual usa `GET /cadastros/prestadores`.

Se a chamada falha, existe fallback local com dados derivados da sessao ou de um registro minimo de apoio.

### Payload/salvamento

Nao ha payload de salvamento real nesta fatia do fluxo. Os botoes de acao atuais ainda sao placeholders e nao disparam persistencia efetiva.

### Permissoes

Prestadores aparece como modulo relevante na estrutura de permissoes de usuarios, inclusive nos mapas de fallback, e tambem alimenta combos de usuario.

### Financeiro/custos

O ponto mais sensivel e o botao `Comissoes...`, mas nesta fase ele ainda e apenas placeholder. Nao ha fluxo financeiro efetivo movido ou documentado para extracao agora.

### Materiais

Nao foi identificado acoplamento direto com materiais no bloco principal de Prestadores.

### Agenda/editor

O botao `Agenda...` permanece como placeholder e a agenda continua sendo um consumidor sensivel de prestadores em outras partes do sistema.

### Strings visiveis/mojibake

Existem strings legadas e alguns trechos com mojibake no codigo e na documentacao historica. Nesta fase nao foi feita qualquer correcao textual.

## Possiveis helpers puros candidatos

- `prestStatusHtml` - candidato mais simples e isolado depois de `prestFmtCodigo`
- `prestSelecionado` - pequeno e util, mas ainda preso ao estado global de selecao
- `prestFiltrarLista` - ainda relativamente pequeno, porem mais acoplado a filtro e cache

## Funcoes ou blocos que nao devem ser movidos agora

- `prestAbrir`
- `prestEnsureUI`
- `prestCarregar`
- `prestRender`
- o bind da grade via `bindStandardGridActivation`
- os contratos de painel em `closeWorkspacePanel`, `PANEL_TITLE_DEFAULTS`, `panelInsetsById`, `modalInsetsById`, `closeModalByBackdropId` e `modalTitleByBackdropId`
- os placeholders de `Agenda...`, `Convênios...` e `Comissões...`
- qualquer fluxo de payload, salvamento, exclusao ou integracao de backend

## Riscos remanescentes

- UI dinamica criada dentro do `app.js`
- rerender da grade e selecao de linha ainda centralizados
- fallback de carregamento ainda presente
- consumidores externos continuam dependendo da lista de prestadores
- agenda e permissoes seguem acopladas ao dado de prestadores
- o bloco ainda nao tem fluxo real de salvar/excluir
- existem strings legadas e mojibake historico que nao devem ser corrigidos junto com modularizacao

## Roteiro de teste recomendado

Como esta fase e documental, nao houve teste funcional agora.

Roteiro futuro provavel:

1. `Ctrl+F5`.
2. Abrir o cadastro/tela de Prestadores.
3. Conferir a abertura da tela ou do painel.
4. Conferir a listagem sem salvar.
5. Conferir os botoes principais sem executar exclusao.
6. Nao salvar e nao excluir nada nesta etapa.
7. Verificar o console.

## Decisao recomendada

3. continuar com helper puro ja mapeado, se houver seguranca.

Motivo: o namespace passivo ja existe e `prestFmtCodigo` ja foi isolado; o proximo passo mais conservador e um helper puro pequeno, antes de tocar em blocos maiores.

## Proxima etapa recomendada

Subetapa documental do helper `prestStatusHtml`, com revisao de consumidores e limites, antes de qualquer nova extracao funcional.

## Observacao final

Nao houve alteracao de JavaScript nesta fase.
