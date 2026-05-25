# Prestadores - Subetapa 0 - Retomada documental e mapeamento tecnico complementar

## Objetivo da retomada
Retomar documentalmente a frente `Prestadores`, confirmar o estado atual do modulo e mapear tecnicamente os proximos candidatos seguros, sem alterar codigo.

## Contexto das frentes pausadas

- `Agenda de contatos` permanece pausada/consolidada e nao deve ser reaberta nesta etapa.
- `Agenda principal` permanece pausada temporariamente.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada nesta rodada.

## Motivo da escolha de Prestadores

`Prestadores` foi escolhido como proxima frente porque:

- possui namespace passivo proprio;
- ja tem helper puro isolado e validado (`prestFmtCodigo`);
- parece ter fronteira mais clara;
- parece ter superficie residual menor que `Convênios e Planos`, `Materiais`, `Procedimentos`, `Conta corrente`, `Ficha pessoal`, `Relatorios` e `Indices financeiros`;
- e mais previsivel para retomada documental conservadora.

## Classificacao documental

- Aproximadamente `core / comum`.
- Administrativo e transversal.
- Esta classificacao e apenas documental nesta subetapa.
- Nao implica multiárea, segmentacao nova por area profissional ou alteracao de permissões.

## Documentos anteriores encontrados

### Prestadores - mapeamento, fronteiras, helpers e pausa

- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_6_documental_prest_status_html.md`
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md`
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`
- `docs/prestadores_retomada_pos_varredura_parciais_estado_atual.md`
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`

### Recomendacoes e varreduras relacionadas

- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/varredura_proximo_modulo_pos_cid.md`

### Contexto comparativo recente

- `docs/fase_2_reavaliacao_comparativa_pos_preferencias_configuracoes.md`
- `docs/fase_2_preferencias_configuracoes_subetapa_17_fechamento_pausa.md`

## Estado atual do modulo

### Arquivo existente

- `frontend/js/modules/prestadores.js`

### Namespace global

- `window.BranaPrestadoresModule`

### Estado observado

- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- `subetapa: "1_namespace_passivo"`
- continua carregado antes de `frontend/app.js`

### Helpers presentes

- `prestFmtCodigo`
- `prestStatusHtml`

### Preservacoes importantes

- o modulo permanece passivo;
- o modulo nao recebeu DOM;
- o modulo nao recebeu `requestJson`;
- o modulo nao recebeu payload;
- o modulo nao recebeu salvamento;
- o modulo nao recebeu endpoints;
- o modulo nao recebeu permissões;
- a duplicidade controlada/fallback com `frontend/app.js` permanece.

## Estado atual do bloco em frontend/app.js

O bloco de Prestadores ainda fica concentrado em `frontend/app.js` como fonte funcional da verdade.

### Pontos de entrada encontrados

- `cadastro-prestadores` chama `prestAbrir()`;
- `closeWorkspacePanel("prestadores-panel")` fecha o painel;
- `PANEL_TITLE_DEFAULTS`, `panelInsetsById`, `modalInsetsById` e `closeModalByBackdropId` conhecem os contratos de Prestadores;
- `frontend/index.html` carrega `frontend/js/modules/prestadores.js` antes de `frontend/app.js`.

### Bloco funcional ainda concentrado

- abertura da tela/painel;
- listagem;
- filtros;
- selecao de linha;
- renderizacao;
- eventos;
- carregamento;
- placeholders de agenda, convenios e comissoes;
- apoio ao combo de prestadores em outros fluxos.

### Wrappers/fallbacks observados

- `prestFmtCodigo` possui wrapper local no `app.js`;
- `prestStatusHtml` possui wrapper local no `app.js`.

## Responsabilidades mapeadas

### Helper puro

- `prestFmtCodigo`
- `prestStatusHtml`

### Helper quase puro

- `prestSelecionado`

### DOM / renderizacao

- `prestEnsureUI`
- `prestRender`
- `prestAbrir`

### Evento / click

- `bindStandardGridActivation`
- binds de `change`, `input` e botoes do painel

### Fluxo visual

- abertura/fechamento do painel
- filtros da grade
- selecao de linha
- indicadores de status

### requestJson

- `prestCarregar` usa `GET /cadastros/prestadores`

### payload

- nao ha payload de salvamento consolidado neste recorte atual

### salvamento

- nao ha fluxo funcional consolidado de salvar neste bloco principal

### exclusao

- existe acao visual, mas o fluxo funcional ainda e sensivel e nao foi retomado nesta etapa

### permissões

- a frente se relaciona com permissao `prestadores`, mas nao houve alteracao desta classificacao aqui

### estado global

- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`

## Candidatos futuros a helper seguro

### `prestSelecionado`

- Tipo: helper quase puro
- Risco: baixo-medio
- Motivo: pequeno e simples, mas depende de `prestadoresCache` e `prestadorSelId`
- Pode ser candidato futuro: sim, mas apenas se o contrato de entrada/saida for isolado

### `prestStatusHtml`

- Tipo: helper puro
- Risco: baixo
- Motivo: ja foi extraido e validado
- Pode ser candidato futuro: nao, porque ja esta resolvido nesta rodada

### `prestFmtCodigo`

- Tipo: helper puro
- Risco: baixo
- Motivo: ja foi extraido e validado
- Pode ser candidato futuro: nao, porque ja esta resolvido nesta rodada

### Possiveis normalizadores/formatadores futuros

- `prestNormalizarNomePrestador`
- `prestValidarNomePrestador`
- `prestNormalizarEspecialidade`
- `prestMontarLabelPrestador`

Classificacao estimada:

- risco baixo a medio, se forem apenas textuais e sem dependencia de estado;
- ainda nao foram confirmados no codigo como candidatos reais desta rodada;
- exigiriam uma nova analise documental antes de qualquer implementacao.

## Classificacao de risco dos candidatos

- `prestFmtCodigo`: baixo
- `prestStatusHtml`: baixo
- `prestSelecionado`: baixo-medio
- `prestNormalizarNomePrestador`: baixo-medio, se aparecer como funcao textual isolada
- `prestValidarNomePrestador`: baixo-medio, se aparecer como regra textual isolada
- `prestNormalizarEspecialidade`: baixo-medio, se for apenas saneamento textual
- `prestMontarLabelPrestador`: medio, por depender de formato do item

## O que nao deve ser extraido agora

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
- qualquer fluxo de agenda, convenios ou comissoes
- qualquer fluxo de salvamento, exclusao ou payload
- qualquer alteracao em permissões

## Riscos

- UI dinamica continua centralizada em `frontend/app.js`;
- a grade e recriada em renderizacao;
- a selecao depende de estado global e cache;
- ha consumidores externos da lista de prestadores;
- o fluxo de salvar/excluir nao esta modularizado;
- a frente ja passou por ciclo parcial e nao deve ser reaberta sem novo contrato claro.

## Proxima subetapa recomendada

`Prestadores - Subetapa 1 - Fronteiras e contratos do helper `prestSelecionado` ou reavaliacao documental para definir se a frente deve permanecer pausada.`

## Blindagem textual/mojibake

- A blindagem textual/mojibake foi respeitada.
- Nao houve correcao de textos visiveis, labels, placeholders ou mensagens.
- Qualquer texto quebrado ja observado permanece somente como pendencia documental futura.

