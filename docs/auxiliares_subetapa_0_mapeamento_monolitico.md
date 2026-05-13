# Auxiliares / Tabelas auxiliares - Subetapa 0 - Mapeamento monolitico

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. Status do working tree antes

```text
?? docs/varredura_proximo_modulo_pos_medicamentos.md
```

## 3. Observacao sobre arquivos pendentes

- O arquivo pendente esperado antes desta etapa era `docs/varredura_proximo_modulo_pos_medicamentos.md`.
- Nao havia outros arquivos inesperados no `git status --short` antes de iniciar esta Subetapa 0.

## 4. Ultimos commits relevantes

- `59da421` feat(frontend): encerra ciclo seguro dos helpers de medicamentos
- `8a1b799` feat(frontend): encerra ciclo seguro dos helpers de cid
- `39330d3` feat(frontend): encerra ciclo seguro dos helpers de plano de contas
- `b415b5c` Encerra ciclo seguro de helpers de Unidades
- `ab102c8` Audita helpers modulares de Unidades
- `91b65e9` Usa helper modular de telefone em Unidades com fallback
- `45419a5` Usa helper modular de codigo em Unidades com fallback
- `795c664` Usa helper modular de status em Unidades com fallback
- `6b2ae0e` Carrega modulo de Unidades de forma passiva
- `7ea7c65` Compara helpers de Unidades no modulo controlado

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/plano-contas.js`

## 6. Documentos consultados

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/varredura_proximo_modulo_pos_cid.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

## 7. Confirmacao de que nenhum codigo funcional foi alterado

- Esta etapa foi apenas de auditoria e mapeamento.
- Nenhum arquivo JS foi alterado.
- Nenhum endpoint foi alterado.
- Nenhum comportamento funcional foi alterado.

## 8. Onde o modulo Auxiliares / Tabelas auxiliares aparece no menu/shell

- No menu lateral/shell, o botao aparece como `Tabelas auxiliares...` em `frontend/index.html`.
- O dispatcher do shell em `frontend/app.js` direciona `action === "aux"` para `auxAbrir()`.
- O shell tambem reconhece o painel `aux-panel` em `PANEL_TITLE_DEFAULTS`, `panelInsetsById`, `hideAllPanels()` e `closeWorkspacePanel()`.

## 9. Funcoes encontradas e classificacao

| Funcao | Classificacao | Papel |
|---|---|---|
| `auxAbrir()` | nao mover | abertura do painel e inicializacao da tela |
| `auxAplicarLayoutDesktop()` | nao mover | adapta o layout desktop do painel |
| `auxCarregarTipos()` | nao mover | carrega a lista de tipos |
| `auxCarregarItens()` | nao mover | carrega a lista de itens do tipo selecionado |
| `auxSelecionarTipoLinha(tr, carregar=true)` | nao mover | selecao do tipo e disparo da recarga |
| `auxSelecionarItemLinha(tr)` | nao mover | selecao do item na grade |
| `auxDialogItem(ed=null)` | nao mover | cria/edita item no modal generico |
| `auxExcluirItem()` | nao mover | exclusao do item selecionado |
| `auxPosSalvarDependencias(tipo)` | nao mover | pos-salvar com efeitos colaterais em agenda |
| `auxTipoEh(tipo, chave)` | seguro para futura subetapa | helper textual/puro de classificacao |
| `auxNormalizarHexCor(value)` | seguro para futura subetapa | helper puro de normalizacao de cor |
| `auxCorrigirMojibake(texto)` | seguro para futura subetapa | helper puro de limpeza de texto |
| `auxCorApresentacaoNormLabelKey(texto)` | seguro para futura subetapa | helper puro de chave textual |
| `auxCorApresentacaoHexPorLabel(label)` | seguro para futura subetapa | helper puro de lookup textual |
| `auxCorApresentacaoCorLabel(hex)` | seguro para futura subetapa | helper puro de rotulo de cor |
| `auxCorApresentacaoOpcoesHtml(corAtual)` | depende de desacoplamento previo | gera HTML de opcoes; ainda acoplado ao layout do modal |
| `auxCorApresentacaoFonteSistema()` | depende de desacoplamento previo | depende de fonte externa de opcoes, ainda nao ideal para extracao imediata |
| `auxCorApresentacaoGarantirEstiloCombo()` | nao mover | injeta estilo/DOM do combo |
| `auxCorApresentacaoFecharListas()` | nao mover | controla DOM/aberturas do combo |
| `auxCorApresentacaoMontarCombo(select)` | nao mover | ativa o combo customizado de cor |
| `auxGerarCodigoAutomatico()` | nao mover | usa cache/estado dos itens |
| `auxAtualizarTotal()` | nao mover | atualiza DOM com total de itens |
| `auxSel()` | nao mover | leitura do item selecionado |

## 10. Relacao com scaffold compartilhado

- Sim, existe scaffold compartilhado com `Plano de Contas`.
- Em `frontend/app.js`, `planoEnsureUI()` e o bootstrap do painel fazem `ensurePanelChrome(plano.panel); ensurePanelChrome(aux.panel);`.
- `planoEnsureUI()` e o fluxo adjacente tratam `plano` e `aux` juntos, o que confirma que Auxiliares nao e totalmente isolado do scaffold do Plano de Contas.

## 11. Relacao com `cadModal` ou modal generico

- Sim.
- `auxDialogItem()` usa `cadModalAbrir()` para abrir o modal generico de criacao/edicao.
- O modal muda de estrutura conforme o tipo auxiliar selecionado:
  - `especialidade`
  - `situacao_agendamento`
  - `situacao_paciente`
  - `grupo_medicamento`
  - ramo padrao
- Isso reforca que o modulo usa contrato de modal compartilhado e nao um modal proprio.

## 12. Variaveis/estado/cache

- `aux`
- `auxItensCache`
- `auxSelId`
- `auxLayoutDesktopAplicado`
- `auxCorComboBound`
- `aux.tbTipos`
- `aux.tbItens`
- `aux.btnOpen`
- `aux.btnFechar`
- `aux.btnNovo`
- `aux.btnAltera`
- `aux.btnElimina`

## 13. Elementos de DOM usados

- Painel:
  - `#aux-panel`
  - `.aux-window-title`
  - `.aux-wrap`
  - `.aux-col-left`
  - `.aux-col-right`
  - `.aux-list`
  - `.aux-cont`
  - `.aux-toolbar`
  - `.aux-total`
- Grades:
  - `aux.tbTipos`
  - `aux.tbItens`
- Botoes:
  - `aux.btnOpen`
  - `aux.btnFechar`
  - `aux.btnNovo`
  - `aux.btnAltera`
  - `aux.btnElimina`
- Modal generico:
  - `cad-modal-backdrop`
  - `cad-modal`
  - `cad-cod`
  - `cad-desc`
  - `cad-ordem`
  - `cad-img`
  - `cad-inativo`
  - `cad-cor`
  - `cad-msg`
  - `cad-desativar`

## 14. Eventos/binds

| Evento | Onde | Observacao |
|---|---|---|
| `click` | `aux.btnOpen` | abre o painel |
| `click` | `aux.btnFechar` | fecha o painel |
| `click` | `aux.btnNovo` | abre o modal em novo |
| `click` | `aux.btnAltera` | abre o modal em edicao |
| `click` | `aux.btnElimina` | elimina item selecionado |
| `keydown` | `aux.tbTipos` | navega/aciona a lista de tipos |
| `click` | `aux.tbTipos` | seleciona o tipo e recarrega itens |
| `keydown` | `aux.tbItens` | navega/aciona a lista de itens |
| `bindStandardGridActivation` | `aux.tbItens` | ativacao padrao da grade de itens |

- O item selecionado na grade de itens usa ativacao padrao via `bindStandardGridActivation`, que e a mesma familia de comportamento conservador usada em outros modulos.
- A lista de tipos usa clique simples e teclado, sem filtro textual adicional.

## 15. Fluxo de abertura

- O menu `Tabelas auxiliares...` chama a acao `aux`.
- O dispatcher chama `auxAbrir()`.
- `auxAbrir()` chama `planoEnsureUI()`, aplica layout desktop, esconde os demais paineis, garante chrome do painel e mostra o painel de Auxiliares.
- Depois disso, carrega os tipos e foca a lista de tipos.

## 16. Fluxo de carregamento/listagem

- `auxCarregarTipos()` busca `GET /cadastros/auxiliares/tipos`.
- A primeira linha de tipo encontrada e selecionada automaticamente.
- `auxSelecionarTipoLinha(first, true)` dispara `auxCarregarItens()`.
- `auxCarregarItens()` busca `GET /cadastros/auxiliares?tipo=...` e renderiza a lista de itens do tipo selecionado.

## 17. Fluxo de troca de tipo/tabela

- A troca de tipo acontece ao clicar em uma linha da tabela de tipos.
- `auxSelecionarTipoLinha(tr, true)`:
  - remove selecao anterior;
  - seleciona a nova linha;
  - reseta o item selecionado;
  - chama `auxCarregarItens()`.
- Nao ha filtro textual separado de tipo.

## 18. Fluxo de selecao

- Tipo:
  - selecao por clique na lista esquerda.
- Item:
  - selecao via `auxSelecionarItemLinha(tr)`.
  - a grade de itens usa `bindStandardGridActivation`, que centraliza o comportamento de ativacao da linha.
- Nao foi identificado um filtro complexo adicional para a lista.

## 19. Fluxo de novo/alterar

- `auxDialogItem()` abre o `cadModalAbrir()`.
- A funcao determina o `tipo` a partir do tipo selecionado e define `method = ed ? "PUT" : "POST"` e `path = ed ? /cadastros/auxiliares/{id} : /cadastros/auxiliares`.
- O formulario e montado por ramo de tipo:
  - `especialidade`
  - `situacao_agendamento`
  - `situacao_paciente`
  - `grupo_medicamento`
  - padrao
- A validacao e minima e preserva os contratos atuais.

## 20. Fluxo de excluir

- `auxExcluirItem()` pega o item selecionado.
- Exige confirmacao com `window.confirm`.
- Executa `DELETE /cadastros/auxiliares/{id}`.
- Ao concluir, recarrega a lista e chama `auxPosSalvarDependencias(it?.tipo||"")`.

## 21. Fluxo de modal

- O modal e generico, via `cadModalAbrir()`.
- O titulo do modal muda para `Edita item` ou `Insere item`.
- Alguns tipos usam campos extras e widgets especiais:
  - especialidade usa codigo, descricao, ordem, imagem e checkbox inativo;
  - situacao_agendamento usa cor de apresentacao e checkbox de historico;
  - situacao_paciente usa mensagem/alerta e checkbox desativar;
  - grupo_medicamento usa apenas descricao;
  - padrao usa codigo e descricao.
- Isso confirma que o modulo e funcionalmente heterogeneo dentro de um unico scaffold.

## 22. Endpoints/API usados

- `GET /cadastros/auxiliares/tipos`
- `GET /cadastros/auxiliares?tipo=...`
- `POST /cadastros/auxiliares`
- `PUT /cadastros/auxiliares/{id}`
- `DELETE /cadastros/auxiliares/{id}`

## 23. Dependencias compartilhadas

- `requestJson`
- `esc`
- `ensurePanelChrome`
- `ensureModalChrome`
- `hideAllPanels`
- `closeWorkspacePanel`
- `workspaceEmpty`
- `footerMsg`
- `window.alert`
- `window.confirm`
- `cadModal`
- `planoEnsureUI`
- `bindStandardGridActivation`
- `agendaLegadoRecarregarStatus` e `agendaSemanaRenderEventos` como dependencias pos-salvar, quando aplicavel

## 24. Pontos de acoplamento com Plano de Contas ou outros modulos

- `planoEnsureUI()` cria/estrutura o painel de Auxiliares junto do Plano de Contas.
- `ensurePanelChrome(aux.panel)` e `ensurePanelChrome(plano.panel)` aparecem no mesmo bootstrap.
- `auxPanel` e `planoPanel` compartilham o mesmo estilo de scaffold do shell.
- `cadModalAbrir()` e `cadModal` sao compartilhados com o ecossistema de modais do app.
- `auxPosSalvarDependencias(tipo)` ainda conversa com agenda quando o tipo e `situacao_agendamento`.

## 25. Helpers puros candidatos

- `auxTipoEh(tipo, chave)`
- `auxNormalizarHexCor(value)`
- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`
- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`

- Candidatos que ainda dependem de desacoplamento previo:
  - `auxCorApresentacaoFonteSistema()`
  - `auxCorApresentacaoOpcoesHtml(corAtual)`
- Nao candidatos agora:
  - `auxGerarCodigoAutomatico()`
  - `auxPosSalvarDependencias(tipo)`
  - `auxAplicarLayoutDesktop()`
  - `auxCorApresentacaoGarantirEstiloCombo()`
  - `auxCorApresentacaoFecharListas()`
  - `auxCorApresentacaoMontarCombo(select)`

## 26. Itens que nao devem ser movidos

- `auxAbrir()`
- `auxAplicarLayoutDesktop()`
- `auxCarregarTipos()`
- `auxCarregarItens()`
- `auxSelecionarTipoLinha(tr, carregar=true)`
- `auxSelecionarItemLinha(tr)`
- `auxDialogItem(ed=null)`
- `auxExcluirItem()`
- `auxPosSalvarDependencias(tipo)`
- `auxCorApresentacaoGarantirEstiloCombo()`
- `auxCorApresentacaoFecharListas()`
- `auxCorApresentacaoMontarCombo(select)`
- `auxAtualizarTotal()`
- `auxGerarCodigoAutomatico()`
- qualquer bind ou comportamento ligado ao `cadModalAbrir()`
- qualquer chamada de `requestJson`
- qualquer acoplamento com `planoEnsureUI()` ou o scaffold compartilhado

## 27. Riscos

- O modulo compartilha scaffold com `Plano de Contas`, entao qualquer mudanca de estrutura pode afetar duas telas ao mesmo tempo.
- O modal genericamente reutilizado (`cadModal`) atende varios tipos diferentes, o que aumenta o risco de regressao se houver wrapper funcional cedo demais.
- Existem tipos com campos bem diferentes dentro do mesmo fluxo, o que pode induzir a extracoes prematuras erradas.
- `auxPosSalvarDependencias()` adiciona efeitos colaterais em agenda, entao o ciclo precisa preservar essa pos-salva.

## 28. Recomendacao para Subetapa 1

- Criar apenas uma estrutura modular passiva/controlada para `Auxiliares / Tabelas auxiliares`.
- Nao mover comportamento funcional ainda.
- Nao integrar helpers de imediato, a menos que uma futura varredura prove um helper realmente puro e pequeno.
- O foco da Subetapa 1 deve ser namespace passivo, metadados e seguranca de carregamento.

## 29. Onde testar no navegador antes de avancar

1. Fazer `Ctrl+F5`.
2. Abrir `Tabelas auxiliares...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista de tipos carrega.
5. Clicar em um tipo e confirmar que a lista de itens troca.
6. Selecionar um item e confirmar o destaque.
7. Testar `Novo`.
8. Testar `Altera`.
9. Testar `Elimina`, se for seguro no ambiente.
10. Abrir um tipo com formulario especial, se necessario, e confirmar que o modal generico continua funcionando.
11. Fechar e reabrir o painel.
12. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
