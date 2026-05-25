# Preferencias / Configuracoes comuns - Subetapa 2 - Mapeamento tecnico detalhado por leitura

## 1. Objetivo
Registrar o mapeamento tecnico detalhado, apenas por leitura, dos fluxos de `Preferencias / Configuracoes comuns` ainda presentes em `frontend/app.js` e a relacao deles com o modulo passivo existente.

## 2. Escopo
Esta subetapa e exclusivamente documental.

Escopo permitido nesta fase:
- leitura de `docs/11_roadmap_desenvolvimento.md`;
- leitura de `docs/fase_2_preferencias_configuracoes_subetapa_1_contrato_funcional_fronteiras.md`;
- leitura de `docs/fase_2_reavaliacao_pos_agenda_principal_comparacao_modulos.md`;
- leitura de `docs/regras_blindagem_correcoes_textuais_mojibake.md`;
- leitura de `frontend/app.js`;
- leitura de `frontend/index.html`;
- leitura de `frontend/js/modules/preferencias-opcoes-sistema.js`;
- leitura de `frontend/js/modules/`;
- criacao deste documento;
- atualizacao documental do roadmap.

## 3. Confirmacao de classificacao
`Preferencias / Configuracoes comuns` continua tratada como modulo `core / comum`.

Nao deve ser classificada como modulo especifico por area profissional.
Nao deve haver controle multiarea, flags multiarea ou separacao de comportamento por area profissional.

## 4. Contexto da frente
A frente foi iniciada documentalmente na Subetapa 1 e segue como a recomendacao tecnica apos a reavaliacao pos-`Agenda principal`.

O estado atual da frente anterior permanece:
- `Agenda principal` pausada temporariamente apos 9 helpers extraidos e validados;
- `Agenda de contatos` pausada/consolidada e nao reaberta.

## 5. Estado atual do modulo passivo existente
Arquivo analisado: `frontend/js/modules/preferencias-opcoes-sistema.js`.

Estado identificado:
- modulo passivo e inicial;
- exposto globalmente em `window.BranaPreferenciasOpcoesSistemaModule`;
- exporta apenas `getMetadata`, `prefOdontoNorm`, `prefValoresPadraoModelos` e `prefOdontoFindByLabel`;
- marca `passive: true` e `movedBehavior: false`;
- depende de `PREF_ODONTO_PALETTE`, que ainda vive em `frontend/app.js`;
- e carregado em `frontend/index.html` antes de `frontend/app.js`;
- funciona como apoio e fallback para o `app.js`;
- nao abre telas, nao faz render completo, nao salva dados e nao controla fluxo de rede por conta propria;
- continua parcial e nao deve ser ampliado nesta etapa.

Conclusao:
- o modulo atual e adequado como suporte passivo para helpers puros;
- nao e, por enquanto, um destino adequado para DOM pesado, payload, `requestJson` ou salvamento;
- a duplicidade com `app.js` existe apenas como fallback controlado, nao como fonte de comportamento independente.

## 6. Pontos de entrada do fluxo

- Menu global: `config-preferencias` chama `prefAbrir()`.
- Menu global: `config-opcoes-sistema` chama `sysOptAbrir()` apos a checagem de admin.
- Janela de usuarios: `usersBtnPreferencias` chama `usersAbrirPreferencias()`.
- Janela de usuarios: `usersAbrirPreferencias()` chama `prefAbrir({ targetUser, origin: "usuarios" })`.
- Janela de opcoes do sistema: `sysOptCfg.btnSegPermissoes` chama `abrirPainelUsuariosConfig(true, true)`.
- Fechamento global por backdrop: `closeModalByBackdropId("config-preferencias-backdrop")`.
- Fechamento global por backdrop: `closeModalByBackdropId("config-opcoes-sistema-backdrop")`.
- Rotulacao visual por backdrop: `modalTitleByBackdropId("config-preferencias-backdrop")` e `modalTitleByBackdropId("config-opcoes-sistema-backdrop")`.
- Insets visuais por backdrop: `modalInsetsById("config-preferencias-backdrop")` e `modalInsetsById("config-opcoes-sistema-backdrop")`.
- Carregamento do modulo passivo: `frontend/index.html` inclui `frontend/js/modules/preferencias-opcoes-sistema.js` antes de `frontend/app.js`.

## 7. Mapas de responsabilidade por funcao

### 7.1 Helpers puros ou quase puros

- `prefValoresPadrao` - helper puro; define defaults gerais do usuario; risco baixo; pode ser futuro helper puro.
- `prefAmbEstiloPadrao` - helper puro; define o objeto base de estilo do ambiente; risco muito baixo; melhor primeiro recorte futuro.
- `prefValoresPadraoAmbiente` - helper quase puro; monta o mapa de secoes a partir de `prefAmbEstiloPadrao` e da constante `PREF_AMB_SECOES_PADRAO`; risco baixo.
- `prefValoresPadraoDados` - helper puro; define defaults dos dados pessoais do usuario; risco baixo.
- `prefValoresPadraoOdontograma` - helper puro; define defaults do odontograma; risco baixo.
- `prefAmbienteTextoExemplo` - helper puro; gera texto de preview por secao; risco muito baixo.
- `prefAmbienteDialogoValor` - helper de transformacao pura; converte estilo interno para o formato do dialogo `easyFont`; risco baixo.
- `prefAmbienteEstiloDeDialogo` - helper de transformacao pura; converte o retorno do dialogo de fonte para o formato interno; risco baixo.

Observacao tecnica:
- estes helpers sao os candidatos mais seguros para futura extracao porque nao tocam em DOM, rede, salvamento, permissao ou tenant;
- entre eles, `prefAmbEstiloPadrao` e o recorte mais conservador.

### 7.2 Helpers com estado global

- `prefContextoPadrao` - usa `sessaoAtual` para definir o contexto default; risco medio; depende de tenant/usuario.
- `prefResolverContexto` - escolhe entre usuario selecionado e contexto padrao; risco medio; depende de entrada externa e de `sessaoAtual`.
- `prefContextoAtual` - resolve o contexto corrente a partir de `prefCfg`; risco medio-baixo, mas continua acoplado ao estado global.
- `prefAmbienteSecoesAtuais` - mistura defaults com estado atual de `prefCfg.ambienteValues`; risco medio; depende de merge de estado e estrutura de secao.
- `prefAmbienteSecaoAtiva` - valida a secao ativa com base em `prefCfg.ambienteValues` e `prefCfg.ambienteOptions`; risco medio.
- `prefAmbienteEstiloAtual` - compoe secao ativa e estilos atuais; risco medio.
- `prefTituloAtual` - monta string de titulo a partir do contexto; risco baixo-medio.

Leitura tecnica:
- estes helpers ainda sao pequenos, mas nao sao candidatos ideais para primeira extracao porque dependem do estado corrente da tela e do usuario.

### 7.3 Helpers com DOM e renderizacao visual

- `prefAtualizarTitulo` - atualiza o titulo do modal; risco medio.
- `prefSelecionarAba` - alterna abas, panes e mensagem de rodape; risco medio-alto.
- `prefRenderCombos` - preenche combos da aba geral; risco medio.
- `prefRenderCombosModelos` - preenche combos de modelos; risco medio.
- `prefRenderCombosDados` - preenche UF a partir de `FICHA_UFS_PADRAO`; risco medio por dependencia cruzada com outra area.
- `prefRenderListaAmbiente` - monta lista lateral de secoes do ambiente; risco medio-alto.
- `prefAplicarEstiloAmbiente` - aplica estilo em elementos de preview; risco medio.
- `prefAplicarPreviewAmbiente` - aplica estilos em varios elementos do preview; risco alto por espalhar efeito visual.
- `prefEnsureAmbienteOverrides` - injeta CSS para ajustar layout do ambiente; risco medio-alto.
- `prefRebuildAmbientePreview` - construcao do preview do ambiente e binds internos; risco alto por DOM e por reconstruir interface.
- `prefOdontoEnsureColorDropdowns` - inicializa dropdowns de cor do odontograma; risco alto por DOM e por dependencia de palette.
- `prefSincronizarUI` - sincroniza praticamente toda a tela de preferencias; risco muito alto.
- `prefEnsureUI` - monta todo o modal, styles, listeners e estrutura; risco muito alto.
- `sysOptEnsureUI` - monta o modal de opcoes do sistema, styles e listeners; risco muito alto.

Leitura tecnica:
- estes blocos nao devem ser os primeiros recortes futuros;
- qualquer extracao aqui tende a carregar DOM, estado e efeitos visuais sensiveis.

### 7.4 Helpers de payload, leitura e salvamento

- `prefColetarPayload` - monta payload da aba geral com `user_id`; risco alto.
- `prefColetarPayloadModelos` - monta payload de modelos com `user_id`; risco alto.
- `prefColetarPayloadAmbiente` - monta payload do ambiente com `user_id`; risco alto.
- `prefColetarPayloadDados` - monta payload dos dados com `user_id`; risco alto.
- `prefColetarPayloadOdontograma` - monta payload do odontograma com `user_id`; risco alto.
- `prefCarregarDados` - faz sequencia de `requestJson` para varias rotas; risco muito alto.
- `prefSalvarGeral` - persiste a aba geral; risco muito alto.
- `prefSalvarModelos` - persiste a aba de modelos; risco muito alto.
- `prefSalvarAmbiente` - persiste a aba de ambiente; risco muito alto.
- `prefSalvarDados` - persiste os dados e pode atualizar `sessaoAtual`; risco muito alto.
- `prefSalvarOdontograma` - persiste o odontograma; risco muito alto.
- `sysOptColetarPayload` - monta payload completo das opcoes da clinica; risco muito alto.
- `sysOptCarregar` - faz `GET /system-options`; risco muito alto.
- `sysOptSalvar` - faz `PATCH /system-options`; risco muito alto.

Leitura tecnica:
- estes blocos nao devem ser extraidos agora;
- eles carregam schema de payload, dependencia de `requestJson`, contexto de usuario/clinica e efeitos posteriores em estado global.

### 7.5 Entradas e wrappers de fluxo

- `prefAbrirDialogoFonteAmbiente` - abre o dialogo de fonte e grava de volta no estado do ambiente; risco medio-alto.
- `prefAbrir` - entrada principal da tela de preferencias; risco alto por encadear contexto, render e carregamento.
- `sysOptFechar` - fecha ou bloqueia o fechamento quando a janela de usuarios esta aberta; risco medio-alto.
- `sysOptAbrir` - entrada principal da tela de opcoes do sistema; risco alto.
- `usersAbrirPreferencias` - atalho da janela de usuarios para preferencias; risco medio.

### 7.6 Pontos de fallback e duplicidade entre app.js e modulo passivo

- `prefValoresPadraoModelos` - em `app.js` funciona como wrapper/fallback para `window.BranaPreferenciasOpcoesSistemaModule.prefValoresPadraoModelos`.
- `prefOdontoNorm` - em `app.js` funciona como wrapper/fallback para `window.BranaPreferenciasOpcoesSistemaModule.prefOdontoNorm`.
- `prefOdontoFindByLabel` - em `app.js` funciona como wrapper/fallback para `window.BranaPreferenciasOpcoesSistemaModule.prefOdontoFindByLabel`.

Leitura tecnica:
- a duplicidade atual e controlada;
- o comportamento continua vindo do `app.js` se o modulo passivo faltar;
- qualquer mudanca futura nesses helpers exige manter a paridade entre `app.js` e o modulo passivo para nao criar divergencia silenciosa.

## 8. Resumo tecnico por area de responsabilidade

- Helper puro: `prefAmbEstiloPadrao`, `prefAmbienteTextoExemplo`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`.
- Helper com DOM: `prefAtualizarTitulo`, `prefSelecionarAba`, `prefRenderCombos`, `prefRenderListaAmbiente`, `prefSincronizarUI`, `prefEnsureUI`, `sysOptEnsureUI`.
- Helper com estado global: `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva`, `prefAmbienteEstiloAtual`.
- Renderizacao visual: `prefAplicarPreviewAmbiente`, `prefOdontoEnsureColorDropdowns`, `prefEnsureAmbienteOverrides`, `prefRebuildAmbientePreview`.
- Evento/click: `prefAbrirDialogoFonteAmbiente`, `prefAbrir`, `sysOptAbrir`, `usersAbrirPreferencias`, tabs e botoes ligados em `prefEnsureUI` e `sysOptEnsureUI`.
- Leitura de configuracao: `prefCarregarDados`, `sysOptCarregar`.
- Salvamento: `prefSalvarGeral`, `prefSalvarModelos`, `prefSalvarAmbiente`, `prefSalvarDados`, `prefSalvarOdontograma`, `sysOptSalvar`.
- Payload: `prefColetarPayload`, `prefColetarPayloadModelos`, `prefColetarPayloadAmbiente`, `prefColetarPayloadDados`, `prefColetarPayloadOdontograma`, `sysOptColetarPayload`.
- `requestJson`: `prefCarregarDados`, `prefSalvar*`, `sysOptCarregar`, `sysOptSalvar`.
- Senha administrativa: `config-opcoes-sistema` -> `sysOptAbrir` -> `sysOptCfg.btnSegPermissoes` -> `abrirPainelUsuariosConfig(true, true)`.
- Tenant/clinica/user_id/contexto: `prefContextoPadrao`, `prefResolverContexto`, `prefCarregarDados`, `prefColetarPayload*`, `usersAbrirPreferencias`.
- Fallback entre app.js e modulo existente: `prefValoresPadraoModelos`, `prefOdontoNorm`, `prefOdontoFindByLabel`.

## 9. Riscos de extraacao por candidato

- `prefAmbEstiloPadrao` - risco muito baixo; sem DOM, sem rede, sem contexto; melhor primeiro recorte futuro.
- `prefValoresPadrao` - risco baixo; puro, mas influencia baseline global da aba geral.
- `prefValoresPadraoAmbiente` - risco baixo; puro, porem depende de helper e constante.
- `prefValoresPadraoDados` - risco baixo; puro e local.
- `prefValoresPadraoOdontograma` - risco baixo; puro e local.
- `prefAmbienteTextoExemplo` - risco muito baixo; puro e previsivel.
- `prefAmbienteDialogoValor` - risco baixo; depende de transformacao pequena e opcional de estilo.
- `prefAmbienteEstiloDeDialogo` - risco baixo; mesma categoria anterior.
- `prefContextoPadrao` - risco medio; depende de `sessaoAtual` e define contexto de usuario.
- `prefResolverContexto` - risco medio; depende de entrada de usuario selecionado e do fluxo da tela.
- `prefAmbienteSecoesAtuais` - risco medio; mistura estado atual e defaults.
- `prefAmbienteSecaoAtiva` - risco medio; valida contexto ativo com base em opcoes carregadas.
- `prefAmbienteEstiloAtual` - risco medio; encadeia estado e defaults.
- `prefAtualizarTitulo` - risco medio; DOM simples, mas em tela central.
- `prefSelecionarAba` - risco medio-alto; controla visibilidade e mensagem de rodape.
- `prefRenderCombos*` - risco medio; DOM e dependencia de dados remotos.
- `prefCarregarDados` - risco alto; varias rotas e contexto de `user_id`.
- `prefSalvar*` - risco muito alto; payload, `requestJson`, persistencia e efeitos posteriores.
- `prefEnsureUI` - risco muito alto; monta estrutura completa da tela.
- `sysOptColetarPayload` - risco muito alto; schema amplo de clinica, financeiro, seguranca e avancado.
- `sysOptCarregar` / `sysOptSalvar` - risco muito alto; rede e persistencia de opcoes da clinica.
- `sysOptEnsureUI` - risco muito alto; DOM amplo e listeners.

## 10. Primeiro candidato recomendado para futura extracao
Recomendacao: `prefAmbEstiloPadrao`.

Justificativa tecnica:
- e um helper puro e literal;
- nao depende de DOM, rede, tenant, permissao ou `requestJson`;
- nao altera payload;
- nao mexe em `sessaoAtual`;
- nao altera o comportamento do modal;
- pode ser validado com impacto muito pequeno;
- e a menor unidade segura identificada no mapeamento atual.

Segundo nivel recomendado, se houver continuidade sem regressao:
- `prefValoresPadrao`;
- `prefValoresPadraoDados`;
- `prefAmbienteTextoExemplo`.

## 11. O que nao deve ser extraido agora
Nao deve ser extraido nesta etapa:

- `prefCarregarDados`;
- `prefSalvarGeral`;
- `prefSalvarModelos`;
- `prefSalvarAmbiente`;
- `prefSalvarDados`;
- `prefSalvarOdontograma`;
- `sysOptColetarPayload`;
- `sysOptCarregar`;
- `sysOptSalvar`;
- `prefEnsureUI`;
- `sysOptEnsureUI`;
- `prefSincronizarUI`;
- `prefAplicarPreviewAmbiente`;
- `prefRenderListaAmbiente`;
- `prefOdontoEnsureColorDropdowns`;
- qualquer fluxo que misture tenant, `user_id`, clinica e persistencia;
- qualquer fluxo com `requestJson`;
- qualquer fluxo de senha administrativa;
- qualquer fluxo visual sensivel de abas;
- qualquer bloco que dependa de `easyFontAbrir` com gravacao de estado;
- qualquer bloco com efeito cascata sobre `sessaoAtual`.

## 12. Analise do modulo passivo como destino futuro

- O modulo atual deve continuar passivo por enquanto.
- A duplicidade com `app.js` existe, mas e apenas fallback controlado.
- O modulo atual e um bom destino futuro para helpers puros e pequenos de defaults ou transformacao.
- O modulo atual nao e destino adequado para DOM, payload, `requestJson` ou fluxos de salvamento.
- Se uma futura etapa precisar mover mais do que helpers puros, talvez seja melhor criar outro arquivo especifico em vez de ampliar este modulo passivo.
- Por enquanto, a melhor estrategia e manter o modulo atual como suporte e nao como centro funcional.

## 13. Pendencias futuras registradas

- Ha textos quebrados/mojibake no codigo lido.
- Nenhum texto foi corrigido nesta etapa.
- Nenhuma string visivel foi alterada.
- O bloco de opcoes do sistema continua com alto acoplamento visual e de payload.
- O bloco de preferencias continua concentrado em `frontend/app.js`.
- A futura extracao deve ser por recorte minimo e com validacao manual.

## 14. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Preferencias / Configuracoes comuns - Subetapa 3 - Isolamento documental dos candidatos mais seguros`

Motivo:
- a leitura tecnica detalhada ja separou responsabilidades;
- agora faz mais sentido isolar os candidatos puros em ordem de risco;
- isso permite planejar a primeira extracao sem tocar em rede, DOM ou salvamento.

## 15. Blindagem textual/mojibake
Regra respeitada integralmente nesta subetapa.

Constatacoes:
- ha textos visiveis com mojibake no codigo lido;
- nenhum texto foi corrigido;
- nenhum acento foi normalizado;
- nenhum label foi renomeado;
- nenhum placeholder foi alterado;
- nenhuma string de interface foi reescrita;
- qualquer texto quebrado permanece apenas como pendencia futura registrada.

## 16. Registro para roadmap
- A Subetapa 2 foi concluida como etapa exclusivamente documental.
- Nenhum codigo foi alterado.
- O mapeamento tecnico detalhado foi realizado.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O proximo passo recomendado e o isolamento documental dos candidatos mais seguros.

## 17. Commit seletivo obrigatorio
Arquivos autorizados para commit desta etapa:
- `docs/fase_2_preferencias_configuracoes_subetapa_2_mapeamento_tecnico_detalhado.md`
- `docs/11_roadmap_desenvolvimento.md`

Mensagem sugerida:
`Documenta mapeamento tecnico de preferencias`
