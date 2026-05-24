# Fase 2 - Editor de texto - Subetapa 5 - Plano cirurgico documental do recorte Bootstrap/abertura

## 1. Contexto da Fase 2
A Fase 2 continua apos o fechamento parcial da frente Tabela de proteticos e apos a correcao de trilha documentada em torno do commit `ae98032`.

A trilha correta permanece voltada para o Editor de texto, que segue como a proxima frente recomendada da Fase 2.

Esta subetapa e exclusivamente documental e prepara o primeiro patch real minimo do recorte Bootstrap/abertura antes de qualquer mudanca de codigo, recorte ou modularizacao.

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

## 7. Referencia a Subetapa 3
A Subetapa 3 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`

Commit de referencia:

- `8214557` - `Isola blocos candidatos do editor de texto`

## 8. Referencia a Subetapa 4
A Subetapa 4 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_4_preparacao_primeiro_recorte.md`

Commit de referencia:

- `0053cf0` - `Prepara primeiro recorte do editor de texto`

## 9. Arquivos lidos

### 9.1 Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

### 9.2 Backend
- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/security/permissions.py`

### 9.3 Docs
- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`
- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_editor_texto_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_editor_texto_subetapa_4_preparacao_primeiro_recorte.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_fina_editor_textos_editor_puro.md`
- `docs/auditoria_fina_editor_textos_resto_domino.md`
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`

## 10. Funcoes e trechos provaveis do bootstrap/abertura identificados

### 10.1 Trecho de inicializacao do app
No fluxo de inicializacao geral do frontend existe o trecho:

- `frontend/app.js:12218-12221`

Esse trecho mostra o desvio de entrada quando `editorTextosIsStandaloneRequest()` retorna verdadeiro, e confirma que o bootstrap/abertura do editor conversa com o arranque geral do app, mas nao e a mesma coisa que standalone em si.

### 10.2 Funcao de montagem da UI
Funcao central de bootstrap visual:

- `frontend/app.js:16501`
- `editorTextosEnsureUI()`

Esse ponto concentra a montagem do shell visual do editor e e a principal ancora segura para um futuro recorte minimo.

### 10.3 Funcao de abertura principal
Funcao principal de abertura:

- `frontend/app.js:22755-22765`
- `editorTextosAbrir()`

Esse ponto executa a abertura do painel, prepara a UI e ainda chama carregamento de modelos e campos. Para o recorte minimo, a parte de UI/abertura e a parte de carregamento devem continuar claramente separadas.

### 10.4 Trechos de fronteira com standalone
Trechos que delimitam a fronteira, mas nao devem entrar no primeiro recorte real:

- `frontend/app.js:22769-22828`
- `editorTextosIsStandaloneRequest()`
- `editorTextosBuildStandaloneUrl()`
- `editorTextosAbrirEmAbaUnica()`
- `editorTextosEnsureStandaloneStyle()`
- `editorTextosAplicarModoStandalone()`

### 10.5 Trecho de entrada pelo menu
Trecho de entrada por acao de menu:

- `frontend/index.html:2661`
- `data-menu-action="ferr-editor-textos"`

E o roteamento interno do menu no frontend:

- `frontend/app.js:23200-23201`

## 11. Ancoras seguras para futura extracao
As ancoras mais seguras para um futuro recorte sao:

- `data-menu-action="ferr-editor-textos"` como gatilho de entrada do usuario;
- `editorTextosAbrir()` como ponto unico de orquestracao de abertura;
- `editorTextosEnsureUI()` como ponto unico de montagem do shell visual;
- referencias `#editor-textos-panel`, `#editor-textos-page`, `#editor-textos-status`, `work`, `panel`, `page` e `status`;
- o ajuste inicial de foco e titulo executado apos a abertura;
- o texto de status inicial "Ferramentas > Editor de textos aberto.";
- a chamada de entrada que seleciona apenas a via de editor normal e nao a via standalone.

## 12. Menor recorte possivel sugerido
O menor recorte possivel sugerido e extremamente restrito:

- extrair apenas a montagem do shell visual e DOM do editor para um helper pequeno, mantendo `editorTextosAbrir()` como ponto de orquestracao;
- manter em `frontend/app.js` a chamada que abre o painel, posiciona o foco e preserva a compatibilidade com o fluxo atual;
- nao mover carregamento de modelos, campos, salvar, standalone, lock, toolbar, document model ou qualquer fluxo de dados.

Se o recorte minimo exigir mais do que isso, a implementacao nao deve ser autorizada sem nova leitura documental.

## 13. Arquivos que poderiam ser criados em futura etapa de codigo
Se e somente se a autorizacao futura permanecer valida, os arquivos mais provaveis sao:

- `frontend/js/modules/editor_textos_bootstrap.js`

Opcionalmente, se a wiring precisar de adaptacao:

- `frontend/app.js`
- `frontend/index.html`

## 14. Arquivos que poderiam ser alterados em futura etapa de codigo
Em uma etapa futura de codigo, os arquivos mais provaveis de alteracao sao:

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`

`frontend/index.html` so deve ser alterado se a integracao da nova ajuda de bootstrap realmente exigir wiring adicional. Caso contrario, deve permanecer intacto.

## 15. Funcoes que poderiam sair parcialmente do frontend/app.js
As funcoes que poderiam sair parcialmente do `frontend/app.js` sao:

- `editorTextosEnsureUI()` - candidato principal para extrair a montagem visual e a definicao do shell do editor;
- parte nao decisoria de `editorTextosAbrir()` - apenas a porcao de preparacao visual, se mantiver compatibilidade com o fluxo atual.

### 15.1 O que pode sair
- montagem do style inline do editor;
- montagem do HTML estrutural do painel;
- referencia e organizacao dos elementos DOM basicos do editor;
- inicializacao visual minima do painel.

### 15.2 O que deve continuar no app.js
- orquestracao da abertura;
- chamadas de carregamento de modelos e campos;
- atualizacao de titulo e status, caso fiquem acoplados ao shell principal;
- qualquer gateway para standalone, lock ou contexto de sessao.

## 16. Funcoes que devem obrigatoriamente permanecer intocadas no primeiro recorte
O primeiro recorte real nao deve tocar em:

- `editorTextosIsStandaloneRequest()`
- `editorTextosBuildStandaloneUrl()`
- `editorTextosAbrirEmAbaUnica()`
- `editorTextosEnsureStandaloneStyle()`
- `editorTextosAplicarModoStandalone()`
- `editorTextosIniciarLockStandalone()`
- `editorTextosLiberarOwnerStandalone()`
- `editorTextosPerderPosseStandalone()`
- `editorTextosStorageOwnerChanged()`
- `editorTextosCarregarModelos()`
- `editorTextosCarregarCampos()`
- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`
- `editorTextosOpenContextoRenomearSelecionado()`
- `editorTextosOpenContextoExcluirSelecionado()`
- `editorTextosMesclarConteudoAtual()`
- `editorTextosExportarPdfAtual()`
- `editorTextosAssinarPdfViaPonteLocal()`
- qualquer rotina de tabela, imagem, regua, contenteditable, cursor, selecao, backend, permissao, sessao, clinica ou usuario.

## 17. Dependencias globais identificadas
Dependencias globais relevantes para o bootstrap/abertura:

- `editorTextosCfg`
- `panel`
- `page`
- `status`
- `work`
- `workspaceEmpty`
- `footerMsg`
- `hideAllPanels()`
- `ensurePanelChrome()`
- `requestAnimationFrame`
- `setTimeout`
- `document`
- `window`
- `URLSearchParams`
- `localStorage`
- `EDITOR_TEXTOS_WINDOW_NAME`
- `EDITOR_TEXTOS_STANDALONE_CLASS`
- `EDITOR_TEXTOS_STANDALONE_OWNER_KEY`

Estas dependencias mostram que o bootstrap ainda conversa com o shell global do app, mas nao obrigam um recorte de backend ou de dados.

## 18. Separacao explicita entre bootstrap/abertura e standalone/lock/heartbeat
Bootstrap/abertura:

- entrada por menu;
- abertura do painel;
- montagem da UI minima;
- foco inicial;
- estado visual inicial;
- ponto de saida para o fluxo normal do editor.

Standalone/lock/heartbeat:

- `editorTextosIsStandaloneRequest()`;
- `editorTextosBuildStandaloneUrl()`;
- `editorTextosAbrirEmAbaUnica()`;
- `editorTextosEnsureStandaloneStyle()`;
- `editorTextosAplicarModoStandalone()`;
- `editorTextosIniciarLockStandalone()`;
- `editorTextosLiberarOwnerStandalone()`;
- `editorTextosPerderPosseStandalone()`;
- `editorTextosStorageOwnerChanged()`.

A regra documental desta subetapa e clara: o primeiro patch real nao deve misturar estas duas camadas.

## 19. Separacao explicita entre bootstrap/abertura e listagem/modelos/salvar/backend
Bootstrap/abertura nao inclui:

- consulta de modelos;
- consulta de campos;
- persistencia;
- renomeacao;
- exclusao;
- mesclagem;
- PDF;
- assinatura;
- qualquer rota do backend.

No estado atual do codigo, `editorTextosAbrir()` ainda chama `editorTextosCarregarModelos()` e `editorTextosCarregarCampos()`. Isso confirma que o bootstrap continua misturado com carregamento funcional, e o futuro patch precisa manter essa fronteira muito clara ou, se necessario, continuar apenas documental.

## 20. Riscos especificos do patch real
O patch real do bootstrap/abertura traz estes riscos:

- dependencias ocultas de globais no `frontend/app.js`;
- quebra da abertura visual do editor;
- quebra da navegacao por menu;
- quebra do foco inicial e do status da tela;
- regressao de compatibilidade com o fluxo standalone, mesmo sem tocar nele;
- impacto indireto na sequencia de carregamento do editor;
- introducao de mudança textual ou mojibake por transitar por labels e mensagens;
- mistura acidental com listagem, campos ou backend.

## 21. Medidas de contencao para o patch real
Para conter esses riscos, o patch futuro precisa:

- manter o diff restrito ao bootstrap/abertura;
- separar claramente shell visual e carregamento funcional;
- nao tocar em standalone, lock, listagem, salvar ou backend;
- preservar os textos visiveis existentes;
- manter compatibilidade com o comportamento atual;
- ser commitado de forma seletiva e auditada;
- passar por leitura de diff antes do commit;
- ser validado humanamente no navegador antes de qualquer continuidade.

## 22. Critrios minimos para autorizar a proxima subetapa com codigo
A proxima subetapa com codigo so deve ser autorizada se todos os criterios abaixo forem atendidos:

- o recorte toca somente bootstrap/abertura;
- nao toca em salvar, PDF, assinatura, contenteditable, cursor, selecao, tabela, imagem, regua, backend, permissoes, sessao, clinica ou usuario;
- nao altera texto visivel;
- nao altera strings com risco de mojibake;
- nao altera comportamento funcional fora da abertura;
- cria no maximo um modulo pequeno ou uma reorganizacao minima e rastreavel;
- preserva fallback ou compatibilidade com as chamadas atuais;
- possui teste humano claro em `Ferramentas > Editor de textos`;
- produz diff pequeno e auditavel;
- e acompanhado de commit seletivo unico.

## 23. Checks tecnicos obrigatorios para a futura alteracao
Antes de qualquer alteracao real futura, os checks obrigatorios devem incluir:

- `git status --short`;
- `git diff -- frontend/app.js`;
- `git diff -- frontend/index.html`;
- `git diff -- frontend/js/modules`;
- `git diff -- backend`;
- `git diff -- arquivo(s) realmente alterado(s) do bootstrap`;
- `node --check` nos arquivos JS alterados, se houver JS alterado;
- revisao de diff para confirmar ausencia de impacto em standalone, listagem, salvar e backend;
- teste no navegador com o Editor de textos aberto pelo menu;
- conferencia de console sem erros na abertura.

## 24. Plano de teste humano obrigatorio
Antes e depois de qualquer alteracao funcional futura, o teste humano deve comecar em:

Ferramentas > Editor de textos

Validações minimas obrigatorias:

- abertura do Editor de textos pelo menu;
- painel principal carregado;
- status inicial visivel;
- ausencia de erro no console;
- modo standalone continua funcionando, mesmo fora do recorte;
- abertura de modelo continua funcionando;
- criacao de novo texto/modelo continua funcionando;
- edicao continua funcionando;
- salvar continua funcionando;
- salvar como continua funcionando;
- renomear continua funcionando;
- excluir quando permitido continua funcionando;
- mesclagem de campos continua funcionando;
- formatacao continua funcionando;
- imagens continuam funcionando;
- tabela continua funcionando;
- regua continua funcionando;
- layout/configuracao de pagina continua funcionando;
- impressao/exportacao/PDF continua funcionando;
- assinatura/PDF/ponte local continua funcionando;
- assistente de receitas continua funcionando;
- assistente de atestados continua funcionando;
- uso em prontuario/documentos/modelos continua funcionando, se aplicavel.

## 25. Decisao documental
Decisao documental: a proxima subetapa com codigo fica autorizada de forma condicional, mas somente se o recorte permanecer estritamente limitado ao Bootstrap/abertura e o diff continuar pequeno, auditavel e sem tocar nos blocos proibidos.

Se a leitura ou a implementacao revelarem que o bootstrap ainda depende demais de globais sensiveis, do shell principal ou de qualquer mistura com standalone/lock/heartbeat, a autorizacao deve ser suspensa e a proxima etapa deve voltar a ser documental.

## 26. Proxima subetapa recomendada
Proxima subetapa recomendada: primeiro patch real minimo do Bootstrap/abertura, com diff extremamente pequeno e commit seletivo, apenas se os checks acima se mantiverem validos.

Se a dependencia global continuar pesada demais, a proxima subetapa recomendada deve ser documental novamente, sem autorizacao de codigo.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- Tabela de proteticos permanece pausada/consolidada.
- A Subetapa 1 foi concluida no commit `4839177`.
- A Subetapa 2 foi concluida no commit `32ade5b`.
- A Subetapa 3 foi concluida no commit `8214557`.
- A Subetapa 4 foi concluida no commit `0053cf0`.
- Esta Subetapa 5 cria o plano cirurgico documental do recorte Bootstrap/abertura.
- O Editor de texto continua classificado preliminarmente como comum/core.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- A decisao sobre autorizar ou nao uma proxima subetapa com codigo foi registrada explicitamente.
- Agenda, Conta corrente, Usuarios/Login, Seeds/tabelas padrao e Ficha pessoal continuam fora desta frente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md` deve entrar no commit.
- Nao usar `git add .`
- Nao usar `git add docs/`
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.

## 27. Confirmacoes finais
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

- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`
