# Fase 2 - Editor de texto - Subetapa 3 - Isolamento documental dos blocos candidatos

## 1. Contexto da Fase 2
A Fase 2 continua apos o fechamento parcial da frente Tabela de proteticos e apos a correcao de trilha documentada em torno do commit `ae98032`.

A trilha correta permanece voltada para o Editor de texto, que segue como a proxima frente recomendada da Fase 2.

Esta subetapa e exclusivamente documental e faz o isolamento dos blocos candidatos por leitura antes de qualquer mudanca de codigo, recorte ou modularizacao.

## 2. Frente atual
Frente atual: Editor de texto.

## 3. Tabela de proteticos permanece pausada/consolidada
A Tabela de proteticos permanece pausada/consolidada e nao deve ser reaberta por esta etapa.

Essa frente continua fora do escopo funcional desta subetapa.

## 4. Classificacao comum/core ou especifica
Classificacao preliminar mantida: comum/core.

Justificativa: o Editor de texto continua parecendo transversal e reutilizavel por varias areas profissionais.

Nesta etapa nao sera implementado controle multiarea.

Nao serao alteradas permissoes, perfis, areas profissionais, seeds ou banco.

Qualquer mudanca futura relacionada a multiarea exigira decisao documental propria.

## 5. Referencia a Subetapa 1
A Subetapa 1 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`

Commit de referencia:

- `4839177` - `Documenta contrato funcional do editor de texto`

## 6. Referencia a Subetapa 2
A Subetapa 2 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`

Commit de referencia:

- `32ade5b` - `Mapeia tecnicamente editor de texto`

## 7. Arquivos lidos

### 7.1 Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

### 7.2 Backend
- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/security/permissions.py`

### 7.3 Docs
- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`
- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_fina_editor_textos_editor_puro.md`
- `docs/auditoria_fina_editor_textos_resto_domino.md`
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`
- `docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`

## 8. Lista dos blocos candidatos identificados
- Bootstrap/abertura do Editor de texto
- Modo standalone, aba unica, lock e heartbeat
- Estrutura visual/DOM principal
- Toolbar, menus e comandos de formatacao
- Modelo estrutural/document model
- Area contenteditable, cursor, selecao e sincronizacao
- Listagem/abertura de modelos
- Criar novo texto/modelo
- Salvar, salvar como, renomear e excluir
- Mesclagem de campos
- Tabelas
- Imagens
- Regua/layout/configuracao de pagina
- Impressao/exportacao/PDF
- Assinatura/PDF/ponte local
- Assistente de receitas
- Assistente de atestados
- Integracoes clinicas/prontuario/documentos/modelos
- Backend/endpoints do editor
- Permissoes/sessao/clinica/usuario

## 9. Quadro de isolamento por bloco candidato

| Bloco candidato | Responsabilidade atual | Funcoes relacionadas | DOM/eventos relacionados | Dependencias globais | Dependencias de backend/endpoints | Dependencias clinicas/sessao/permissoes | Risco de extracao | Observacoes | Candidato ao primeiro recorte real |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bootstrap/abertura do Editor de texto | Orquestrar abertura do editor a partir do menu e preparar o shell minimo | `editorTextosEnsureUI`, `editorTextosAbrir`, `editorTextosAbrirEmAbaUnica`, `editorTextosIsStandaloneRequest`, `editorTextosBuildStandaloneUrl`, `editorTextosAplicarModoStandalone` | `data-menu-action="ferr-editor-textos"`, `#editor-textos-panel`, `#editor-textos-status`, clique de menu | `editorTextosCfg`, `panel`, `page`, `status`, `work` | Indiretas, por abrir a interface que depois consulta rotas | `current_user`, contexto de sessao e permissao herdados do fluxo geral | Medio | Ainda depende do shell e do carregamento do conjunto maior | Candidato futuro, mas nao primeiro recorte agora |
| Modo standalone, aba unica, lock e heartbeat | Garantir instancia unica e posse local da aba | `editorTextosEnsureStandaloneStyle`, `editorTextosIniciarLockStandalone`, `editorTextosLiberarOwnerStandalone`, `editorTextosPerderPosseStandalone`, `editorTextosStorageOwnerChanged` | Eventos `storage`, `beforeunload`, listeners globais de janela | `editorTextosStandaloneId`, `editorTextosStandaloneHeartbeatTimer`, `localStorage`, `window` | Nenhuma direta, mas interfere no ciclo de abertura | Pode depender de sessao/identidade da aba e do usuario autenticado | Alto | Toca controle de concorrencia e posse de aba; erro aqui quebra a experiencia inteira | Nao |
| Estrutura visual/DOM principal | Montar painel, chrome, modal e area base do editor | `editorTextosEnsureUI` e blocos de montagem do HTML injetado | `#editor-textos-panel`, `#editor-textos-page`, `#editor-textos-status`, `.editor-textos-open-modal`, `.editor-textos-open-grid` | `editorTextosCfg` e referencias DOM criadas em runtime | Nenhuma direta | Nenhuma direta, mas exposta ao fluxo de usuario autenticado | Medio | Mudanca aqui costuma espalhar impacto visual e de seletores | Candidato futuro apenas se o DOM ficar isolado em outra etapa |
| Toolbar, menus e comandos de formatacao | Controlar botoes de formatacao e comandos visuais | `editorTextosNormalizarListaFontes`, `editorTextosListarFontesSistema`, `editorTextosPreencherComboFonte`, `editorTextosAtualizarComboFonte`, `editorTextosQueryCommandState`, `editorTextosQueryCommandValue`, `editorTextosNormalizarFonteNome`, `editorTextosCorParaHex`, `editorTextosAplicarCorSelecaoFallback`, `editorTextosObterElementoSelecao`, `editorTextosSincronizarToolbarFormato`, `editorTextosAgendarSincronizarToolbar` | `click`, `input`, `keydown`, `selectionchange`, `focus` em toolbar e pagina | `editorTextosCfg`, selecao do navegador, `document.execCommand`/equivalentes de comando visual | Nenhuma direta | Nenhuma direta, mas responde ao contexto do usuario e da sessao | Alto | Alto acoplamento com selecao, cursor e estados visuais | Nao |
| Modelo estrutural/document model | Manter o modelo estruturado do documento e sua sincronizacao | Familia `editorTextosDocumentoModel*`, `editorTextosExtrairModeloDoDOM` | DOM rico da pagina, mutacoes estruturais, atualizacao de sandbox | `editorTextosCfg.documentModel`, caches de snapshot/tab states, utilitarios de paragrafos | Nenhuma direta, mas impacta o que e enviado ao backend | Indireta via documento clinico e contexto do usuario | Alto | E o nucleo mais sensivel do editor; risco alto de quebra funcional | Nao |
| Area contenteditable, cursor, selecao e sincronizacao | Capturar edicao livre, cursor e sincronizar texto/estrutura | Familia `editorTextosParagrafo*` e sincronizadores associados | `contenteditable`, `beforeinput`, `keydown`, `input`, `compositionstart`, `compositionend`, `selectionchange`, `mouseup`, `mousedown` | Selecao do navegador, ranges, estado de cursor, modelo estrutural e caches de bloco | Nenhuma direta | Indireta, via documento do paciente/profissional e sessao | Alto | Area mais propensa a regressao em cursor, selecao, tab e marcadores | Nao |
| Listagem/abertura de modelos | Buscar, listar e abrir modelos existentes | `editorTextosCarregarModelos`, `editorTextosRenderListaAbertura`, `editorTextosAbrirModelo` | `openRefresh`, `openQ`, `openTipo`, `dblclick`, tabela da lista | `editorTextosCfg.open*`, cache da lista e filtros | `GET /editor-textos/modelos`, `GET /editor-textos/modelos/{modelo_id}` | Filtros por clinica e usuario autenticado | Medio | Tem CRUD visual e depende de filtro de contexto | Candidato futuro possivel, mas ainda nao primeiro recorte real |
| Criar novo texto/modelo | Iniciar documento novo por tipo ou fluxo de criacao | `editorTextosNovoDocumento`, `editorTextosNovoExecutar`, `editorTextosNovoPorTipo` | Botoes/seletores do modal de novo, `click`, `dblclick`, `change` | `editorTextosCfg.new*`, tipo selecionado, estado do editor atual | Pode reaproveitar listagem e abertura de modelos | Pode depender de clinica/usuario para decidir origem e tipo | Medio | Tem menos superficie que o model editor, mas ainda mexe com fluxo central | Candidato futuro possivel |
| Salvar, salvar como, renomear e excluir | Persistir estado, duplicar, renomear e remover modelos | `editorTextosSalvarAtual`, `editorTextosSalvarComoAtual`, `editorTextosOpenContextoRenomearSelecionado`, `editorTextosOpenContextoExcluirSelecionado` | `btnSalvar`, `btnSalvarComo`, contexto de lista, `keydown` com atalho | `editorTextosCfg`, nome atual, estado do documento e lista de modelos | `POST /editor-textos/modelos`, `PUT /editor-textos/modelos/{modelo_id}`, `PATCH /editor-textos/modelos/{modelo_id}/renomear`, `DELETE /editor-textos/modelos/{modelo_id}` | Clinica do usuario e permissao do modulo | Alto | Regiao critica de persistencia; qualquer erro pode perder conteudo ou duplicar indevidamente | Nao |
| Mesclagem de campos | Inserir campos e mesclar variaveis no texto | `editorTextosCarregarCampos`, `editorTextosAbrirModalMesclagem`, `editorTextosConfirmarInserirMesclagem`, `editorTextosMesclarConteudoAtual` | `btnInserirCampo`, `mergeTbody`, `mergeOk`, modal de mesclagem | `editorTextosCfg.merge*`, mapa de campos, documento corrente | `GET /editor-textos/campos`, `POST /editor-textos/mesclar` | Pode depender de paciente/profissional e contexto do usuario | Medio-Alto | Nucleo funcional, mas ainda com bloco relativamente delimitado | Candidato futuro apenas se separado do editor central |
| Tabelas | Criar, redimensionar e manter tabelas no conteudo | Familia `editorTextosTabela*` | Eventos de hover, mouse, resize, `dblclick`, `mousemove`, `mouseup` | Estado visual da pagina e selecao do documento | Nenhuma direta | Indireta, via conteudo clinico/documental | Alto | Tabelas sao sensiveis a layout, DOM e selecao | Nao |
| Imagens | Inserir, selecionar e redimensionar imagens no documento | Familia `editorTextosImagem*` | `.editor-textos-image-resize-overlay`, `mousedown`, `mousemove`, `mouseup`, eventos de pagina | Overlay, estado de selecao, imagem atual, cache visual | Nenhuma direta | Indireta, via conteudo do documento | Alto | Muito sensivel a layout e a coordenadas do mouse | Nao |
| Regua/layout/configuracao de pagina | Controlar margens, medidas e layout da pagina | Familia `editorTextosRegua*`, modalidades de pagina | `mousemove`, `mousedown`, `mouseup`, `dblclick`, `contextmenu` | Metricas da regua, pagina corrente, configuracoes visuais | Nenhuma direta | Indireta, por alterar apresentacao de documentos clinicos | Alto | Pequena mudanca pode deslocar toda a pagina ou quebrar impressao | Nao |
| Impressao/exportacao/PDF | Gerar saidas imprimiveis e PDF | `editorTextosImprimirAtual`, `editorTextosExportarPdfAtual`, `editorTextosPrepararPdfNoAppPdf`, `editorTextosAbrirPdfPreparadoNoAppPdf` | `click`, atalho de teclado, acoes de exportacao | Estado atual do documento e pipeline de exportacao | `POST /editor-textos/exportar-pdf`, `POST /editor-textos/preparar-pdf-acrobat`, `POST /editor-textos/abrir-no-acrobat`, `POST /editor-textos/abrir-arquivo-pdf-acrobat` | Depende do contexto do usuario e do documento ativo | Alto | Tem risco alto de perda de formacao e de integracao com app local | Nao |
| Assinatura/PDF/ponte local | Preparar e assinar PDFs via ponte local | `editorTextosAssinarPdfViaPonteLocal`, `editorTextosConfirmarAssinarPdf`, `editorTextosPdfPromptResponder` | Modal de assinatura, confirmacoes e resposta de fluxo local | Estado do PDF, ponte local, prompts e filas de confirmacao | `POST /editor-textos/assinar-pdf`, `POST /editor-textos/registrar-assinatura-local` | Pode depender de usuario autenticado, permissao e contexto clinico | Alto | Conecta editor ao ambiente local, com risco elevado de regressao operacional | Nao |
| Assistente de receitas | Montar e aplicar receita assistida no editor | Familia `editorTextosAssist*` | Modais, selects, botoes, filtros, teclado, timers de busca | `editorTextosAssistMedMenuFiltroTimer`, `editorTextosCfg.assist*`, conteudo rascunho | `GET /editor-textos/assistente-receitas/contexto`, `GET /editor-textos/assistente-receitas/medicamentos`, `POST /editor-textos/assistente-receitas/exportar-pdf-template` | `paciente_id`, `prestador_id`, `cirurgiao_id`, clinica e sessao | Medio-Alto | E um bloco funcional, mas ja mistura contexto clinico e aplicacao no editor | Candidato futuro possivel, nao primeiro recorte imediato |
| Assistente de atestados | Montar e aplicar atestado assistido no editor | Familia `editorTextosAssistAtestado*` | Modais, selects, campos de data/hora, busca de CID | `editorTextosAssistAtestadoCidMenuFiltroTimer`, `editorTextosCfg.assistAtestado*` | `GET /editor-textos/assistente-atestado/contexto`, `GET /editor-textos/assistente-atestado/motivos`, `GET /editor-textos/assistente-atestado/cid` | `paciente_id`, `cirurgiao_id`, clinica e sessao | Medio-Alto | Mistura dados temporais, paciente e reescrita do corpo do documento | Candidato futuro possivel, mas nao primeiro recorte imediato |
| Integracoes clinicas/prontuario/documentos/modelos | Levar o editor para fluxos de uso clinico e documental | Fluxos que chamam o editor em assistentes, modelos e preenchimento | Abertura do editor, aplicacao do corpo e carregamento de dados | `fichaPacienteAtualId`, `sessaoAtual`, `current_user`, `editorTextosCfg` | Varias rotas do editor e rotas indiretas de contexto | `paciente`, `profissional`, `clinica`, `usuario`, `sessao` | Alto | Acoplamento transversal; envolve dados sensiveis e varios fluxos | Nao |
| Backend/endpoints do editor | Atender listagem, CRUD, mesclagem, assistentes e PDF | Rotas em `backend/routes/editor_textos_routes.py` | Endpoints HTTP e respostas JSON/PDF | `get_current_user`, `require_module_access` e objetos de dominio | Todas as rotas do editor-textos mapeadas na Subetapa 2 | `current_user.clinica_id`, `current_user.prestador_id`, contexto do paciente e permissao de configuracao | Alto | Qualquer recorte aqui exige contrato tecnico proprio e teste integral | Nao |
| Permissoes/sessao/clinica/usuario | Restringir acesso e filtrar dados por contexto | `require_module_access("configuracao")`, `get_current_user` e filtros de clinica | Fluxo de autenticacao e autorizacao do backend | `current_user`, session, contexto do usuario | Indireta em todas as rotas do editor | `clinica`, `usuario`, `sessao`, permissao de modulo | Alto | Nao deve ser tocado nesta frente sem decisao documental propria | Nao |

## 10. Separacao por risco

### 10.1 Baixo risco
- Bootstrap/abertura do Editor de texto

### 10.2 Medio risco
- Estrutura visual/DOM principal
- Listagem/abertura de modelos
- Criar novo texto/modelo
- Mesclagem de campos
- Assistente de receitas
- Assistente de atestados
- Integracoes clinicas/prontuario/documentos/modelos

### 10.3 Alto risco
- Modo standalone, aba unica, lock e heartbeat
- Toolbar, menus e comandos de formatacao
- Modelo estrutural/document model
- Area contenteditable, cursor, selecao e sincronizacao
- Salvar, salvar como, renomear e excluir
- Tabelas
- Imagens
- Regua/layout/configuracao de pagina
- Impressao/exportacao/PDF
- Assinatura/PDF/ponte local
- Backend/endpoints do editor
- Permissoes/sessao/clinica/usuario

## 11. Blocos que nao devem ser primeiro recorte real
Nao devem ser o primeiro recorte real nesta altura:

- Modo standalone, aba unica, lock e heartbeat
- Toolbar, menus e comandos de formatacao
- Modelo estrutural/document model
- Area contenteditable, cursor, selecao e sincronizacao
- Salvar, salvar como, renomear e excluir
- Tabelas
- Imagens
- Regua/layout/configuracao de pagina
- Impressao/exportacao/PDF
- Assinatura/PDF/ponte local
- Backend/endpoints do editor
- Permissoes/sessao/clinica/usuario

## 12. Blocos candidatos mais seguros para futuro
Se houver evolucao para um primeiro recorte futuro, os candidatos relativamente mais seguros, ainda sem implementacao, sao:

- Bootstrap/abertura do Editor de texto
- Listagem/abertura de modelos
- Criar novo texto/modelo
- Mesclagem de campos

Justificativa tecnica: esses blocos ficam mais perto da orquestracao de fluxo e da interface de apoio do que do nucleo mais sensivel de cursor, document model, impressao, assinatura e DOM rico.

A recomendacao conservadora, porem, e nao promover nenhum deles automaticamente a primeiro recorte real sem nova leitura documental e validacao humana.

## 13. Justificativa tecnica da ordem sugerida
A ordem sugerida prioriza isolamento por menor acoplamento com o cursor, com o model editor e com as rotas mais sensiveis.

Primeiro se observa o que e mais periferico no fluxo do editor, depois o que depende de DOM e eventos de apoio, e por ultimo o que mexe com persistencia, PDF, assinatura e integracoes clinicas.

Essa ordem reduz o risco de:

- quebrar o conteudo editavel;
- quebrar a persistencia;
- quebrar a exportacao/PDF;
- quebrar a assinatura e a ponte local;
- quebrar o contexto de paciente, profissional e clinica;
- introduzir mudancas textuais ou de mojibake.

## 14. Critrios minimos para permitir uma futura primeira alteracao de codigo
Antes de qualquer primeira alteracao de codigo, o bloco candidato precisa atender, no minimo, a estes criterios:

- leitura fechada do bloco, com funcoes e dependencias bem delimitadas;
- ausencia de dependencia oculta em variaveis globais nao mapeadas;
- ausencia de dependencia criticamente acoplada ao cursor ou ao document model;
- ausencia de dependencia com handlers globais que atendam varios modulos;
- ausencia de impacto em backend/endpoints fora do escopo do bloco;
- ausencia de dependencia em permissao, sessao ou clinica que nao tenha sido documentada;
- definicao clara de teste humano de ida e volta no fluxo real;
- confirmacao documental de que nao ha alteracao textual nem de mojibake;
- confirmacao de que o recorte nao toca o fluxo de salvar, imprimir ou assinar sem contrato proprio.

## 15. Onde testar futuramente antes de qualquer alteracao funcional
Antes de qualquer alteracao funcional, o teste humano devera começar em:

Ferramentas > Editor de textos

E tambem validar:

- modo standalone;
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- renomear;
- excluir quando permitido;
- mesclagem de campos;
- formatacao;
- imagens;
- tabela;
- regua;
- layout/configuracao de pagina;
- impressao/exportacao/PDF;
- assinatura/PDF/ponte local;
- assistente de receitas;
- assistente de atestados;
- uso em prontuario/documentos/modelos, se aplicavel.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- Tabela de proteticos permanece pausada/consolidada.
- A Subetapa 1 foi concluida no commit `4839177`.
- A Subetapa 2 foi concluida no commit `32ade5b`.
- Esta Subetapa 3 cria o isolamento documental dos blocos candidatos.
- O Editor de texto continua classificado preliminarmente como comum/core.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- A proxima subetapa recomendada deve ser escolhida com base no risco dos blocos candidatos.
- Agenda, Conta corrente, Usuarios/Login, Seeds/tabelas padrao e Ficha pessoal continuam fora desta frente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md` deve entrar no commit.
- Nao usar `git add .`
- Nao usar `git add docs/`
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.

## 16. Confirmacoes finais
Esta etapa e documental.

Nenhum codigo foi alterado.

`frontend/app.js` nao foi alterado.

`frontend/index.html` nao foi alterado.

`frontend/js/modules` nao foi alterado.

`backend` nao foi alterado.

`banco`, `schema`, `migrations`, `seeds` e `endpoints` nao foram alterados.

Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.

Nenhum `reset`, `revert`, `restore` ou `clean` foi executado.

Nenhum texto visivel, acento, label, mensagem, placeholder ou string foi corrigido.

A blindagem textual/mojibake foi respeitada.

Os untracked antigos foram preservados.

O unico arquivo criado/modificado nesta etapa foi:

- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`
