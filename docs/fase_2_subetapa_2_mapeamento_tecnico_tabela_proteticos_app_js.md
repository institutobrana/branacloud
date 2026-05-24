# Fase 2 - Subetapa 2 - Mapeamento tecnico detalhado da Tabela de proteticos no app.js

## 1. Contexto
Esta subetapa deriva diretamente do contrato funcional da Subetapa 1 e existe para mapear, por leitura, as dependencias tecnicas reais da Tabela de proteticos antes de qualquer modularizacao.

O objetivo e preparar uma futura extracao com seguranca, reduzindo risco funcional, sem alterar comportamento e sem mover ainda nenhum codigo.

Esta etapa e exclusivamente documental e de auditoria.

## 2. Arquivos lidos
Arquivos e blocos consultados nesta leitura:

- `docs/fase_2_subetapa_1_contrato_funcional_tabela_proteticos.md`
- `frontend/app.js`
- `frontend/index.html`
- `backend/routes/proteticos_routes.py`
- `backend/routes/controle_proteticos_routes.py`
- `backend/models/protetico.py`
- `backend/models/controle_protetico.py`
- `backend/routes/agenda_contatos_routes.py`
- `backend/security/permissions.py`
- `backend/main.py`
- `docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`
- `docs/fase_2_subetapa_0_comparacao_frentes_refatoracao_controlada.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Visao tecnica resumida
A Tabela de proteticos esta concentrada em `frontend/app.js`, sem modulo separado em `frontend/js/modules`.

O fluxo principal:

1. abre o painel `proteticos-panel`;
2. carrega proteticos via `GET /proteticos`;
3. carrega servicos do protetico selecionado via `GET /proteticos/{id}/servicos`;
4. renderiza a grade local com `protRender()`;
5. abre modal de serviço com `protAbrirModal()`;
6. salva ou altera via `protSalvarModal()`;
7. exclui protetico via `protExcluirCadastro()`;
8. exclui servico via `protExcluirServico()`;
9. gera relatorio via `protExecutarRelatorio()`;
10. exporta arquivo e e-mail via `protSalvarRelatorioArquivo()`.

O maior acoplamento tecnico esta em:

- estado global do `app.js`;
- helpers globais de painel e modal;
- `requestJson`;
- sessao/autenticacao;
- relatorio/exportacao;
- dependencias indiretas com agenda de contatos e controle de proteticos.

## 4. Funcoes prot* encontradas

### 4.1. `protEnsureUI`
- Responsabilidade aparente: montar a UI da Tabela de proteticos e seus modais dinamicamente.
- Tipo: helper de construcao visual.
- Dependencias diretas: `document.createElement`, `workspaceEmpty.insertAdjacentHTML`, `ensurePanelChrome`, `ensureModalChrome`.
- Dependencias globais: `prot`, `proteticosCache`, `proteticoSelecionadoId`, `protServicosCache`, `protServicoSelecionadoId`.
- Endpoints: nenhum.
- DOM: `proteticos-panel`, `prot-cbo`, `prot-tbody`, `prot-total`, `prot-btn-*`, `prot-modal-*`, `prot-relatorio-*`, `prot-relatorio-arquivo-*`.
- Risco de extracao: medio. E um helper visual, mas cria toda a superficie DOM e inicializa referencias.

### 4.2. `protServicoSelecionado`
- Responsabilidade aparente: retornar o servico atualmente selecionado da cache.
- Tipo: helper de selecao.
- Dependencias diretas: `protServicosCache`, `protServicoSelecionadoId`.
- Dependencias globais: caches da area.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.3. `protSelecionarLinha`
- Responsabilidade aparente: marcar a linha selecionada na grade.
- Tipo: helper de selecao visual.
- Dependencias diretas: `prot`, `protServicoSelecionadoId`, `prot.tbody`.
- Dependencias globais: DOM do painel e cache de selecao.
- Endpoints: nenhum.
- DOM: `prot-tbody`, linhas `tr[data-id]`.
- Risco de extracao: baixo/medio.

### 4.4. `protEditarSelecionado`
- Responsabilidade aparente: abrir o modal de edicao do servico selecionado.
- Tipo: ação de edicao.
- Dependencias diretas: `protServicoSelecionado()`, `protAbrirModal()`.
- Dependencias globais: `window.alert`.
- Endpoints: nenhum.
- DOM: indireta via modal.
- Risco de extracao: medio.

### 4.5. `protFecharRelatorio`
- Responsabilidade aparente: fechar o modal de relatorio.
- Tipo: helper de modal.
- Dependencias diretas: `prot.relBackdrop`.
- Dependencias globais: `prot`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-backdrop`.
- Risco de extracao: baixo.

### 4.6. `protFecharRelatorioArquivo`
- Responsabilidade aparente: fechar o modal de arquivo e limpar contexto.
- Tipo: helper de modal/limpeza.
- Dependencias diretas: `prot.relArquivoBackdrop`, `prot.relArquivoHandle`, `prot.relArquivoContext`.
- Dependencias globais: `prot`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-arquivo-backdrop`.
- Risco de extracao: medio.

### 4.7. `protAtualizarEmailRelatorioUI`
- Responsabilidade aparente: habilitar ou desabilitar os campos de e-mail do relatorio.
- Tipo: helper visual.
- Dependencias diretas: `prot.relArquivoEmailCheck`, `prot.relArquivoEmail`, `prot.relArquivoAssunto`, `prot.relArquivoCorpo`, `prot.relArquivoEmailRow`.
- Dependencias globais: `prot`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-arquivo-email-row`, `prot-relatorio-arquivo-email-check`, `prot-relatorio-arquivo-email`, `prot-relatorio-arquivo-assunto`, `prot-relatorio-arquivo-corpo`.
- Risco de extracao: baixo/medio.

### 4.8. `protNomeArquivoBase`
- Responsabilidade aparente: normalizar o nome base do arquivo do relatorio.
- Tipo: helper de string.
- Dependencias diretas: nenhuma relevante alem do proprio texto.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.9. `protRelatorioRows`
- Responsabilidade aparente: transformar a cache de servicos em linhas de relatorio.
- Tipo: helper de exportacao.
- Dependencias diretas: `protServicosCache`, `formatMoney`.
- Dependencias globais: cache da tabela.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: medio.

### 4.10. `protCsvEsc`
- Responsabilidade aparente: escapar valores para CSV.
- Tipo: helper de exportacao.
- Dependencias diretas: nenhuma relevante.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.11. `protRelatorioCsv`
- Responsabilidade aparente: montar CSV do relatorio.
- Tipo: helper de exportacao.
- Dependencias diretas: `protCsvEsc`.
- Dependencias globais: nenhuma relevante alem do conteúdo.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo/medio.

### 4.12. `protRelatorioTxt`
- Responsabilidade aparente: montar relatorio em texto puro.
- Tipo: helper de exportacao.
- Dependencias diretas: nenhuma além dos argumentos.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.13. `protRtfEscape`
- Responsabilidade aparente: escapar texto para RTF.
- Tipo: helper de exportacao.
- Dependencias diretas: nenhuma relevante.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.14. `protRelatorioRtf`
- Responsabilidade aparente: montar relatorio em RTF.
- Tipo: helper de exportacao.
- Dependencias diretas: `protRelatorioTxt`, `protRtfEscape`.
- Dependencias globais: nenhuma relevante.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo/medio.

### 4.15. `protRelatorioXlsHtml`
- Responsabilidade aparente: montar HTML compatível com exportacao XLS.
- Tipo: helper de exportacao.
- Dependencias diretas: `esc`, `formatMoney` indiretamente via rows.
- Dependencias globais: nenhuma relevante.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: medio.

### 4.16. `protPdfEscape`
- Responsabilidade aparente: escapar texto para PDF simples.
- Tipo: helper de exportacao.
- Dependencias diretas: nenhuma.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.17. `protRelatorioPdfBlob`
- Responsabilidade aparente: gerar PDF simples do relatorio.
- Tipo: helper de exportacao.
- Dependencias diretas: `protPdfEscape`.
- Dependencias globais: nenhuma relevante.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: medio.

### 4.18. `protFormatoInfo`
- Responsabilidade aparente: traduzir o formato escolhido para extensao e MIME.
- Tipo: helper de exportacao.
- Dependencias diretas: nenhuma.
- Dependencias globais: nenhuma.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: baixo.

### 4.19. `protRelatorioBlob`
- Responsabilidade aparente: escolher o gerador certo do relatorio conforme o formato.
- Tipo: helper de exportacao.
- Dependencias diretas: `protRelatorioHtml`, `protRelatorioRtf`, `protRelatorioXlsHtml`, `protRelatorioTxt`, `protRelatorioCsv`, `protRelatorioPdfBlob`.
- Dependencias globais: nenhuma relevante.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: medio/alto.

### 4.20. `protEnviarEmailRelatorio`
- Responsabilidade aparente: enviar o relatorio por e-mail.
- Tipo: ação de exportacao/integracao.
- Dependencias diretas: `getToken`, `requestJson`, `extractApiDetail`.
- Dependencias globais: sessao autenticada.
- Endpoints: `POST /relatorios/enviar-email`.
- DOM: nenhum.
- Risco de extracao: alto.

### 4.21. `protSelecionarDestinoRelatorio`
- Responsabilidade aparente: escolher arquivo de destino do relatorio.
- Tipo: helper de exportacao.
- Dependencias diretas: `window.showSaveFilePicker`, `protFormatoInfo`, `protNomeArquivoBase`.
- Dependencias globais: `prot.relArquivo*`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-arquivo-path`, `prot-relatorio-arquivo-picker`, `prot-relatorio-arquivo-formato`.
- Risco de extracao: alto.

### 4.22. `protSalvarRelatorioArquivo`
- Responsabilidade aparente: gerar blob, gravar arquivo ou download e opcionalmente enviar e-mail.
- Tipo: ação de exportacao.
- Dependencias diretas: `protRelatorioRows`, `protRelatorioBlob`, `protEnviarEmailRelatorio`, `window.URL`, `FormData`.
- Dependencias globais: `prot.relArquivo*`, `footerMsg`.
- Endpoints: `POST /relatorios/enviar-email`.
- DOM: `prot-relatorio-arquivo-*`.
- Risco de extracao: muito alto.

### 4.23. `protAbrirRelatorioArquivo`
- Responsabilidade aparente: preparar o modal de salvar relatorio em arquivo.
- Tipo: helper de modal/exportacao.
- Dependencias diretas: `protNomeArquivoBase`, `protAtualizarEmailRelatorioUI`.
- Dependencias globais: `prot.relArquivo*`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-arquivo-*`.
- Risco de extracao: medio.

### 4.24. `protAbrirRelatorio`
- Responsabilidade aparente: abrir o modal de relatorio e preencher a tabela.
- Tipo: ação de relatorio.
- Dependencias diretas: `proteticosCache`, `proteticoSelecionadoId`, `esc`.
- Dependencias globais: `prot`.
- Endpoints: nenhum.
- DOM: `prot-relatorio-backdrop`, `prot-relatorio-tabela`, `prot-relatorio-titulo`, `prot-relatorio-saida`.
- Risco de extracao: medio.

### 4.25. `protRelatorioHtml`
- Responsabilidade aparente: montar HTML completo do relatorio para tela/impressora.
- Tipo: helper de exportacao.
- Dependencias diretas: `relatorioConfigAtual`, `relatorioDataHoraAtual`, `relatorioUsuarioAtual`, `relatorioCssFromStyle`, `protServicosCache`, `formatMoney`, `esc`.
- Dependencias globais: configurações de relatorio e cache de servicos.
- Endpoints: nenhum.
- DOM: nenhum.
- Risco de extracao: alto.

### 4.26. `protExecutarRelatorio`
- Responsabilidade aparente: executar a saida do relatorio conforme a escolha do usuario.
- Tipo: ação de relatorio.
- Dependencias diretas: `protFecharRelatorio`, `protAbrirRelatorioArquivo`, `procRelatorioAbrirPreview`, `procRelatorioImprimirPreview`, `protRelatorioHtml`, `protServicosCache`.
- Dependencias globais: `prot`, `procRelatorioView`, `workspaceEmpty`, `footerMsg`.
- Endpoints: indireto quando exporta ou e-mail.
- DOM: `prot-relatorio-*`, `procRelatorioView`.
- Risco de extracao: muito alto.

### 4.27. `protRender`
- Responsabilidade aparente: renderizar a grade de serviços e o total.
- Tipo: função de listagem/visão.
- Dependencias diretas: `protServicosCache`, `protServicoSelecionadoId`, `formatMoney`, `esc`.
- Dependencias globais: `prot`.
- Endpoints: nenhum direto.
- DOM: `prot-tbody`, `prot-total`.
- Risco de extracao: medio.

### 4.28. `protCarregarServicos`
- Responsabilidade aparente: carregar serviços do protético selecionado.
- Tipo: função de carga/listagem.
- Dependencias diretas: `requestJson`, `protRender`, `proteticoSelecionadoId`, `footerMsg`.
- Dependencias globais: `protServicosCache`, `protServicoSelecionadoId`.
- Endpoints: `GET /proteticos/{protetico_id}/servicos`.
- DOM: indireta via renderização.
- Risco de extracao: alto.

### 4.29. `protCarregar`
- Responsabilidade aparente: carregar lista de protéticos e encadear os serviços.
- Tipo: função de carga principal.
- Dependencias diretas: `protEnsureUI`, `requestJson`, `protCarregarServicos`.
- Dependencias globais: `proteticosCache`, `proteticoSelecionadoId`, `prot`.
- Endpoints: `GET /proteticos`.
- DOM: `prot-cbo`.
- Risco de extracao: alto.

### 4.30. `protAbrir`
- Responsabilidade aparente: abrir o painel da Tabela de protéticos.
- Tipo: função de abertura de tela.
- Dependencias diretas: `protEnsureUI`, `protVincularEventos`, `hideAllPanels`, `ensurePanelChrome`, `protCarregar`.
- Dependencias globais: `workspaceEmpty`, `footerMsg`.
- Endpoints: indireto via `protCarregar`.
- DOM: `proteticos-panel`.
- Risco de extracao: alto.

### 4.31. `protFecharModal`
- Responsabilidade aparente: fechar o modal de serviço e limpar `editId`.
- Tipo: helper de modal.
- Dependencias diretas: `prot.modalBackdrop`.
- Dependencias globais: `prot`.
- Endpoints: nenhum.
- DOM: `prot-modal-backdrop`.
- Risco de extracao: baixo.

### 4.32. `protAbrirModal`
- Responsabilidade aparente: abrir modal de serviço para criar ou editar.
- Tipo: ação de modal.
- Dependencias diretas: `prot`, `proteticoSelecionadoId`, `procFmtBr`.
- Dependencias globais: `window.alert`.
- Endpoints: nenhum.
- DOM: `prot-modal-*`.
- Risco de extracao: medio.

### 4.33. `protSalvarModal`
- Responsabilidade aparente: criar ou atualizar serviço.
- Tipo: ação de persistencia.
- Dependencias diretas: `procParse`, `requestJson`, `protFecharModal`, `protCarregarServicos`.
- Dependencias globais: `prot`, `proteticoSelecionadoId`, `footerMsg`.
- Endpoints: `POST /proteticos/{protetico_id}/servicos`, `PUT /proteticos/servicos/{servico_id}`.
- DOM: `prot-modal-*`.
- Risco de extracao: muito alto.

### 4.34. `protNovoCadastro`
- Responsabilidade aparente: criar protetico principal.
- Tipo: ação de persistencia.
- Dependencias diretas: `window.prompt`, `requestJson`, `protCarregar`.
- Dependencias globais: `proteticosCache`, `proteticoSelecionadoId`.
- Endpoints: `POST /proteticos`.
- DOM: nenhum direto.
- Risco de extracao: alto.

### 4.35. `protEditarCadastro`
- Responsabilidade aparente: alterar nome do protetico principal.
- Tipo: ação de persistencia.
- Dependencias diretas: `window.prompt`, `requestJson`, `protCarregar`.
- Dependencias globais: `proteticosCache`, `proteticoSelecionadoId`.
- Endpoints: `PATCH /proteticos/{id}`.
- DOM: nenhum direto.
- Risco de extracao: alto.

### 4.36. `protExcluirCadastro`
- Responsabilidade aparente: excluir protetico principal.
- Tipo: ação de persistencia destrutiva.
- Dependencias diretas: `window.confirm`, `requestJson`, `protCarregar`.
- Dependencias globais: `proteticosCache`, `proteticoSelecionadoId`.
- Endpoints: `DELETE /proteticos/{id}`.
- DOM: nenhum direto.
- Risco de extracao: muito alto.

### 4.37. `protExcluirServico`
- Responsabilidade aparente: excluir servico selecionado.
- Tipo: ação de persistencia destrutiva.
- Dependencias diretas: `window.confirm`, `protServicoSelecionado`, `requestJson`, `protCarregarServicos`.
- Dependencias globais: `protServicoSelecionadoId`, `proteticoSelecionadoId`.
- Endpoints: `DELETE /proteticos/servicos/{servico_id}`.
- DOM: indireta via grade.
- Risco de extracao: muito alto.

### 4.38. `protVincularEventos`
- Responsabilidade aparente: ligar eventos do painel, modal e relatorio.
- Tipo: inicializador de listeners.
- Dependencias diretas: `bindStandardGridActivation`, `protAbrirModal`, `protEditarSelecionado`, `protExcluirServico`, `protAbrirRelatorio`, `protSalvarModal`, `protFecharModal`, `protExecutarRelatorio`, `protFecharRelatorio`, `protSelecionarDestinoRelatorio`, `protAtualizarEmailRelatorioUI`, `protSalvarRelatorioArquivo`, `protFecharRelatorioArquivo`.
- Dependencias globais: `prot.panel.dataset.bound`, `workspaceEmpty`.
- Endpoints: nenhum direto.
- DOM: todos os elementos do painel e modais da Tabela de protéticos.
- Risco de extracao: medio/alto, porque e o ponto de amarracao de toda a tela.

## 5. Blocos nao prot* mas relacionados
Os blocos abaixo nao comecam com `prot*`, mas sao parte da superfice tecnica da Tabela de proteticos:

- `requestJson`: camada unica de chamadas autenticadas com tratamento de sessao/protecao;
- `requestJsonBase`: transporte base usado por `requestJson`;
- `getToken`: leitura do token da sessao;
- `footerMsg`: canal de feedback para sucesso/erro;
- `hideAllPanels`: esconde painéis e limpa a area de trabalho;
- `closeWorkspacePanel`: fecha o painel da Tabela de protéticos via `prot.btnFechar`;
- `closeModalByBackdropId`: fecha `prot-modal-backdrop`, `prot-relatorio-backdrop` e `prot-relatorio-arquivo-backdrop`;
- `ensurePanelChrome`: aplica chrome visual e botão de fechar no painel;
- `ensureModalChrome`: aplica chrome visual e botão de fechar nos modais;
- `bindStandardGridActivation`: padrão de seleção e duplo clique na grade;
- `modalInsetsById`: define margens/padding para modais, incluindo os de protéticos;
- `panelInsetsById`: define espaçamento do painel;
- `PANEL_TITLE_DEFAULTS`: nomeia `proteticos-panel`;
- `menu action handlers`: mapeiam `data-menu-action="tabelas-protetico"` para `protAbrir()`;
- `workspaceEmpty`: alterna a visibilidade do workspace quando a tela abre/fecha;
- `window.confirm` / `window.alert`: feedback e confirmação de exclusão;
- `window.showSaveFilePicker`: integração de exportacao do relatorio;
- `FormData`: envio de relatorio por e-mail;
- `procFmtBr` / `procParse`: formatação e leitura numérica reaproveitada do domínio de procedimentos;
- `procRelatorioAbrirPreview` / `procRelatorioImprimirPreview`: visualização e impressão do relatorio em tela;
- `extractApiDetail`: leitura da mensagem de erro no envio de e-mail;
- `esc`, `formatMoney`, `formatDec2`: helpers de renderização e formatação usados na tela.

## 6. IDs e elementos DOM relevantes

### 6.1. Painel principal
- `proteticos-panel`
- `prot-cbo`
- `prot-tbody`
- `prot-total`

### 6.2. Botões do painel
- `prot-btn-novo`
- `prot-btn-editar`
- `prot-btn-excluir`
- `prot-btn-imprimir`
- `prot-btn-fechar`

### 6.3. Modal de serviço
- `prot-modal-backdrop`
- `prot-modal-title`
- `prot-modal-nome`
- `prot-modal-indice`
- `prot-modal-preco`
- `prot-modal-prazo`
- `prot-modal-ok`
- `prot-modal-cancelar`

### 6.4. Modal de relatorio
- `prot-relatorio-backdrop`
- `prot-relatorio-tabela`
- `prot-relatorio-titulo`
- `prot-relatorio-saida`
- `prot-relatorio-ok`
- `prot-relatorio-cancelar`

### 6.5. Modal de relatorio em arquivo
- `prot-relatorio-arquivo-backdrop`
- `prot-relatorio-arquivo-path`
- `prot-relatorio-arquivo-picker`
- `prot-relatorio-arquivo-formato`
- `prot-relatorio-arquivo-email-row`
- `prot-relatorio-arquivo-email-check`
- `prot-relatorio-arquivo-email`
- `prot-relatorio-arquivo-assunto`
- `prot-relatorio-arquivo-corpo`
- `prot-relatorio-arquivo-ok`
- `prot-relatorio-arquivo-cancelar`

### 6.6. Menu de entrada
- `data-menu-action="tabelas-protetico"`
- `data-menu-action="cadastro-controle-proteticos"`
- `data-menu-action="relatorio-proteticos"`

## 7. Endpoints e rotas identificadas

| Método | Rota | Função frontend | Finalidade aparente | Risco de alteração futura |
|---|---|---|---|---|
| `GET` | `/proteticos` | `protCarregar()` | Listar proteticos da clinica | Alto |
| `POST` | `/proteticos` | `protNovoCadastro()` | Criar protetico | Alto |
| `PATCH` | `/proteticos/{id}` | `protEditarCadastro()` | Alterar protetico | Alto |
| `DELETE` | `/proteticos/{id}` | `protExcluirCadastro()` | Excluir protetico | Muito alto |
| `GET` | `/proteticos/{protetico_id}/servicos` | `protCarregarServicos()` | Listar servicos do protetico selecionado | Alto |
| `POST` | `/proteticos/{protetico_id}/servicos` | `protSalvarModal()` | Criar servico | Alto |
| `PUT` | `/proteticos/servicos/{servico_id}` | `protSalvarModal()` | Atualizar servico | Alto |
| `DELETE` | `/proteticos/servicos/{servico_id}` | `protExcluirServico()` | Excluir servico | Muito alto |
| `POST` | `/relatorios/enviar-email` | `protEnviarEmailRelatorio()` | Enviar relatorio por e-mail | Alto |

## 8. Estados globais e caches
Variáveis e estados globais observados na Tabela de protéticos:

- `prot`: estrutura principal da tela e referencias DOM;
- `proteticosCache`: lista de proteticos carregada do backend;
- `proteticoSelecionadoId`: protetico ativo na tela;
- `protServicosCache`: lista de servicos do protetico ativo;
- `protServicoSelecionadoId`: servico ativo na grade;
- `prot.relArquivoHandle`: handle do File Picker;
- `prot.relArquivoContext`: contexto de relatorio;
- `prot.relArquivoWarned`: flag de aviso do navegador, quando usada;
- `prot.panel.dataset.bound`: guarda de listeners para nao duplicar eventos;
- `footerMsg`: feedback global compartilhado;
- `workspaceEmpty`: controle da tela vazia do shell;
- `sessaoAtual`: influencia escopo de acesso e contexto de usuario;
- `getToken()`: valida a autenticacao para o envio de relatorio;
- `protectedGrantCache` / protecoes equivalentes: pode interferir em chamadas autenticadas;
- `procRelatorioView`: janela de visualizacao de relatorio compartilhada;
- `cnfRelatorio` e helpers de relatorio: influenciam a geracao HTML/impressao.

Risco principal ao mover essas dependencias sem encapsulamento:

- a tela passar a depender de ordem de inicializacao;
- a selecao perder sincronizacao com a cache;
- o relatorio deixar de enxergar estado suficiente;
- o modal de arquivo perder contexto entre abrir e salvar;
- listeners duplicados ou ausentes.

## 9. Dependencias com outros modulos

### 9.1. Procedimentos
Dependencia confirmada e critica:

- permissao backend `require_module_access("procedimentos")`;
- o menu de entrada mapeia a area para esse eixo funcional;
- a Tabela de protéticos convive no mesmo dominio de catalogos de procedimentos e custos.

### 9.2. Agenda de contatos
Dependencia indireta confirmada:

- `backend/routes/agenda_contatos_routes.py` importa `Protetico`;
- contatos do tipo protético podem ser sincronizados com a tabela principal;
- alterar o cadastro pode afetar essa vinculação.

### 9.3. Controle de protéticos
Dependencia indireta confirmada:

- `backend/routes/controle_proteticos_routes.py` usa `Protetico` e `ServicoProtetico`;
- o controle depende da base cadastrada aqui;
- exclusao de protetico ou servico pode afetar esse fluxo.

### 9.4. Relatorios
Dependencia forte:

- relatorio de servicos;
- exportacao em tela/impressora/arquivo;
- envio por e-mail via `POST /relatorios/enviar-email`.

### 9.5. Permissoes
Dependencia confirmada:

- acesso ao backend amarrado ao modulo `procedimentos`;
- qualquer modularizacao precisa preservar esse escopo.

### 9.6. Autenticacao / sessao
Dependencia confirmada:

- `getToken()` e `requestJson(..., true)` sustentam o fluxo autenticado;
- sem sessao valida, o relatorio por e-mail falha;
- o backend usa `get_current_user` para filtrar por clinica.

### 9.7. Outros modulos observados
- `procedimentos`: compartilha helpers de formato e relatorio;
- `relatorios`: compartilha preview e exportacao;
- `users/login`: influencia o estado de autenticacao;
- `ficha pessoal`: nao apareceu como dependencia direta confirmada nesta leitura;
- `editor de texto`: nao apareceu como dependencia direta confirmada nesta leitura.

## 10. Classificacao de risco por bloco

| Bloco / funcao | Classificacao | Motivo |
|---|---|---|
| `protServicoSelecionado` | baixo | leitura pura de cache |
| `protNomeArquivoBase` | baixo | helper puro de string |
| `protCsvEsc` | baixo | escape simples de CSV |
| `protRelatorioTxt` | baixo | monta texto sem tocar em DOM ou backend |
| `protRtfEscape` | baixo | escape simples |
| `protPdfEscape` | baixo | escape simples |
| `protFormatoInfo` | baixo | mapeamento de formato |
| `protFecharRelatorio` | baixo | apenas esconde modal |
| `protFecharRelatorioArquivo` | medio | limpa contexto de exportacao e estado |
| `protAtualizarEmailRelatorioUI` | baixo/medio | mexe em campos visuais do modal |
| `protSelecionarLinha` | medio | altera estado global de selecao e visual da grade |
| `protRelatorioRows` | medio | depende da cache de serviços |
| `protRelatorioCsv` | medio | exportacao simples, mas ligada ao modelo da tela |
| `protRelatorioRtf` | medio | exportacao simples, mas ligada ao modelo da tela |
| `protRelatorioXlsHtml` | medio | exportacao simples com HTML embutido |
| `protRelatorioPdfBlob` | medio | gerador local de PDF, sem backend, mas sensivel |
| `protRelatorioBlob` | medio/alto | despacha formatos e pode quebrar todo o relatorio |
| `protAbrirRelatorio` | medio | depende da cache e da UI do modal |
| `protAbrirRelatorioArquivo` | medio | prepara contexto e campos do modal |
| `protRender` | medio | se quebrar, a grade desaparece ou fica inconsistente |
| `protCarregarServicos` | alto | depende de endpoint, estado e renderização |
| `protCarregar` | alto | é o ponto de entrada da tela e da lista base |
| `protAbrir` | alto | abre a tela inteira e encadeia a carga inicial |
| `protAbrirModal` | medio | depende de selecao ativa e DOM |
| `protSalvarModal` | muito alto | grava dados no backend e recarrega a tela |
| `protNovoCadastro` | alto | cria protético e mexe na seleção global |
| `protEditarCadastro` | alto | altera cadastro principal da tela |
| `protExcluirCadastro` | muito alto | destrutivo e com impacto em outras tabelas |
| `protExcluirServico` | muito alto | destrutivo e diretamente ligado ao cadastro |
| `protEnviarEmailRelatorio` | alto | integracao autenticada com backend de relatorios |
| `protSelecionarDestinoRelatorio` | alto | depende de API do navegador e estado do modal |
| `protSalvarRelatorioArquivo` | muito alto | exportacao, download, gravação e e-mail na mesma rotina |
| `protExecutarRelatorio` | muito alto | orquestra preview, arquivo e impressora, com saidas diferentes |
| `protVincularEventos` | medio/alto | amarra toda a tela; se duplicar ou falhar, quebra fluxo inteiro |
| `protEnsureUI` | medio | cria toda a UI, mas e mais previsivel que o salvamento |

## 11. Candidatos a primeiro recorte futuro
Os candidatos mais seguros, por ordem conservadora, são:

1. `protServicoSelecionado`
2. `protNomeArquivoBase`
3. `protCsvEsc`
4. `protRelatorioTxt`
5. `protRtfEscape`
6. `protPdfEscape`
7. `protFormatoInfo`
8. `protFecharRelatorio`
9. `protAtualizarEmailRelatorioUI`

Justificativa:

- são helpers pequenos;
- têm baixa dependência de backend;
- não gravam dados;
- não alteram a seleção principal nem o escopo por clínica;
- tendem a ser mais fáceis de testar manualmente e de isolar depois.

## 12. Blocos que nao devem ser extraidos primeiro
Nao devem ser o primeiro recorte:

- `protSalvarModal`;
- `protNovoCadastro`;
- `protEditarCadastro`;
- `protExcluirCadastro`;
- `protExcluirServico`;
- `protCarregar`;
- `protCarregarServicos`;
- `protExecutarRelatorio`;
- `protSalvarRelatorioArquivo`;
- `protEnviarEmailRelatorio`;
- `protSelecionarDestinoRelatorio`;
- `protAbrir`;
- `protVincularEventos`.

Motivo:

- dependem de estado global;
- fazem chamadas de backend;
- alteram dados persistidos;
- possuem efeito lateral em relatorio, preview, arquivo e e-mail;
- podem quebrar permissao, sessao, clinica e selecao.

## 13. Plano sugerido para Subetapa 3
Recomendacao conservadora:

**Fase 2 — Subetapa 3 — Recorte minimo dos helpers puros da Tabela de protéticos**

Objetivo da proxima subetapa:

- isolar apenas os helpers puramente visuais/de string/exportacao sem backend;
- desenhar fronteira inicial de extracao sem tocar em salvar, excluir, relatorio executavel ou carga de dados;
- validar quais dependencias podem sair primeiro com menor risco;
- manter a tela funcional igual antes e depois do recorte.

Se houver duvida sobre qualquer helper, a regra deve ser adiar a extracao para uma subetapa tecnica posterior.

## 14. Registro para roadmap

- A Tabela de proteticos continua como a primeira frente ativa da Fase 2.
- Esta etapa nao altera comportamento; apenas mapeia dependencias tecnicas.
- Editor de texto, Ficha pessoal, Agenda, Conta corrente, Usuarios/Login e Seeds/tabelas padrao continuam fora desta frente.
- Qualquer recorte futuro deve ser pequeno, reversivel e testavel.
- O contrato funcional da Subetapa 1 segue como limite obrigatorio.

## 15. Confirmacoes finais obrigatorias

- Esta etapa e documental.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- banco, schema, migrations, seeds e endpoints nao foram alterados.
- Nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado.
- Nenhum texto visivel, acento, label, mensagem, placeholder ou string foi corrigido.
- A blindagem textual/mojibake foi respeitada.
- Untracked antigos foram preservados.
- O unico arquivo criado/modificado nesta etapa foi `docs/fase_2_subetapa_2_mapeamento_tecnico_tabela_proteticos_app_js.md`.

## 16. Onde testar futuramente
Como esta etapa e documental, nao ha teste funcional de tela agora.

Checklist futuro antes de qualquer proxima subetapa funcional:

- abrir a Tabela de protéticos pelo menu Configurações > Tabelas > Serviços de protético;
- listar protéticos;
- trocar o protético selecionado;
- listar serviços;
- abrir o modal de serviço;
- criar protético;
- editar protético;
- criar serviço;
- editar serviço;
- excluir serviço;
- excluir protético;
- abrir o relatorio em tela;
- exportar relatorio em arquivo;
- testar envio de e-mail;
- confirmar o comportamento com usuario autenticado e com usuario sem permissao;
- validar que a agenda de contatos e o controle de proteticos continuam dependentes da mesma base.
