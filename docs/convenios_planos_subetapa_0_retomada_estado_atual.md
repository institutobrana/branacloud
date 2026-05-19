# Convênios e Planos — Subetapa 0 — Retomada documental e estado atual

## 1. Objetivo da retomada

Esta subetapa registra, de forma exclusivamente documental, o estado atual do módulo Convênios e Planos antes de qualquer nova mudança funcional.

O foco aqui é mapear fronteiras, dependências, riscos e candidatos seguros para análise futura, sem alterar código, HTML, backend, banco, schema, migrations, endpoints, eventos, clique, duplo clique, renderização ou payload.

## 2. Documentos anteriores encontrados

Documentos principais localizados e lidos:

| Documento | Situação | Observação |
|---|---|---|
| `docs/recomendacao_proximo_modulo_pos_anamnese.md` | Encontrado | Recomendou Convênios e Planos como próximo módulo após Anamnese. |
| `docs/recomendacao_proximo_modulo_pos_convenios_planos.md` | Encontrado | Recomendação posterior ao encerramento do ciclo de Convênios e Planos. |
| `docs/regras_blindagem_correcoes_textuais_mojibake.md` | Encontrado | Regra obrigatória de blindagem textual. |
| `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md` | Encontrado | Retomada documental anterior do mesmo módulo. |
| `docs/convenios_planos_subetapa_1_namespace_passivo.md` | Encontrado | Namespace passivo já criado para o módulo. |
| `docs/convenios_planos_subetapa_2_fronteiras_contratos.md` | Encontrado | Documento de fronteiras/contratos já existente. |
| `docs/convenios_planos_subetapa_3_helpers_puros.md` | Encontrado | Documento de helpers puros já existente. |
| `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md` | Encontrado | Integração posterior documentada. |
| `docs/convenios_planos_subetapa_5_encerramento_ciclo.md` | Encontrado | Encerramento do ciclo anterior. |
| `docs/frontend_correcao_convenios_duplo_clique.md` | Encontrado | Histórico real de correção de duplo clique localizado. |
| `docs/frontend_correcao_convenios_planos_duplo_clique_pos_reversao.md` | Não localizado | O nome solicitado não apareceu; o equivalente real encontrado foi `frontend_correcao_convenios_duplo_clique.md`. |

Documentos de contexto adicionais consultados:

| Documento | Situação | Observação |
|---|---|---|
| `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md` | Encontrado | Ajuda a entender a posição do módulo no ranking de risco. |
| `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md` | Encontrado | Mostra o padrão de decisão conservadora usado em ciclos recentes. |
| `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md` | Encontrado | Contexto comparativo de módulos parciais e risco. |

## 3. Histórico conhecido

O módulo já passou por um ciclo conservador documentado. O histórico relevante encontrado foi:

- o ciclo anterior de Convênios e Planos foi encerrado documentalmente;
- há um histórico explícito de correção sensível de duplo clique;
- o estado atual foi consolidado como namespace passivo em `frontend/js/modules/convenios-planos.js`;
- o `frontend/app.js` continua carregando a lógica funcional real do módulo;
- o módulo já possui calendário de faturamento e dois grids principais, o que amplia a sensibilidade do fluxo.

Sobre o duplo clique:

- o documento histórico localizado é `docs/frontend_correcao_convenios_duplo_clique.md`;
- ele descreve clique simples, segundo clique rápido e reaproveitamento do fluxo de edição existente;
- nesta subetapa 0 não foi feita nenhuma nova alteração de clique, seleção, renderização ou evento;
- o risco de regressão de duplo clique permanece alto porque a grade é dinâmica e a lógica ainda está fortemente acoplada ao `app.js`.

## 4. Módulo JS e namespace

### Existe módulo JS

Sim. O arquivo existe em:

- `frontend/js/modules/convenios-planos.js`

### Existe namespace

Sim. O namespace global passivo encontrado é:

- `window.BranaConveniosPlanosModule`

### Estado do namespace

O módulo expõe um namespace passivo com:

- `meta`
- `helpers`
- `getInfo()`
- `getStatus()`

E o estado declarado no próprio módulo é:

- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- `subetapa: "1_namespace_passivo"`

## 5. Carregamento no `index.html`

### O `index.html` já carrega o módulo

Sim. O arquivo:

- `frontend/js/modules/convenios-planos.js`

é carregado antes de:

- `frontend/app.js`

### Ações e menu relacionados

No `index.html` há uma ação direta de menu relacionada ao módulo:

- `data-menu-action="cadastro-convenios-planos"`

Também há o script de carregamento explícito do módulo:

- `<script src="/frontend/js/modules/convenios-planos.js"></script>`

### Observação

O `index.html` também carrega outros módulos do shell, mas esta retomada se limita ao bloco de Convênios e Planos e ao contexto mínimo necessário para entender sua posição no carregamento.

## 6. Funções relacionadas no `frontend/app.js`

### Funções principais de Convênios e Planos

- `convPlanEnsureUI()`
- `convPlanCarregar()`
- `convPlanVincularEventos()`
- `convPlanAbrir()`
- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanSelecionarConvenio()`
- `convPlanSelecionarPlano()`
- `convPlanStatusDotV2()`
- `convPlanCurrentConvenioV2()`
- `convPlanSetObjectOptionsV2()`
- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`
- `convPlanAbrirModalConvenioV2()`
- `convPlanAbrirModalPlanoV2()`
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCloseModalV2()`
- `convPlanBuildConvenioModalHtmlV2()`
- `convPlanBuildPlanoModalHtmlV2()`
- `convPlanCaptureConvenioModalV2()`
- `convPlanCapturePlanoModalV2()`
- `convPlanEnsureModalUiV2()`
- `convPlanVincularModaisV2()`

### Funções do calendário de faturamento

- `convPlanCalEnsureUI()`
- `convPlanCalBind()`
- `convPlanCalAbrir()`
- `convPlanCalCarregar()`
- `convPlanCalRender()`
- `convPlanCalSelecionar()`
- `convPlanCalCurrentItem()`
- `convPlanCalModalPayload()`
- `convPlanCalModalPreencher()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`
- `convPlanCalAbrirModal()`

### Integração de menu e shell

- `MENU_ACTION_MODULE_OVERRIDES`
- o dispatcher de ações que chama `convPlanAbrir()` quando a ação é `cadastro-convenios-planos`
- `hideAllPanels()`
- `closeWorkspacePanel()`
- `closeModalByBackdropId()`

### Relação com outros fluxos

- `fichaCarregarCombos()` usa os combos de Convênios e Planos;
- há consumo indireto em credenciamento de prestadores e em outras telas que dependem de convênio/plano;
- o calendário de faturamento traz uma conexão funcional com a área financeira.

## 7. Variáveis globais, cache e estado

### Estado encontrado no topo do `app.js`

- `convPlanCfg`
- `convPlanConveniosCache`
- `convPlanPlanosCache`
- `convPlanSelConvenioId`
- `convPlanSelPlanoId`
- `convPlanUltimoCliqueConvenioId`
- `convPlanUltimoCliqueConvenioEm`

### Estado do calendário de faturamento

- `convPlanCalCfg`
- `convPlanCalSelId`
- `convPlanCalItens`

### Estado de consumo cruzado

- `fichaConveniosCache`
- `fichaPlanosCache`
- `prestCredConvenios`

### Observação

O estado do módulo não está isolado em um namespace único no `app.js`; ele permanece espalhado em variáveis globais e estruturas de tela já existentes.

## 8. Funções que parecem helpers puros candidatos

Os candidatos mais seguros, com base nos critérios de pureza definidos, são os helpers que operam só em strings ou metadados locais e não tocam DOM, cache global, API, payload, salvamento, exclusão, seleção ou clique.

### Candidatos no módulo JS passivo

- `normalizeText()`
- `normalizarNomeConvenio()`
- `validarNomeConvenio()`
- `normalizarNomePlano()`
- `validarNomePlano()`
- `normalizarCodigoRegistro()`

### Candidatos secundários

- `getInfo()`
- `getStatus()`

Esses dois são seguros do ponto de vista documental, mas são menos interessantes como primeiros alvos do que os normalizadores/validadores puros.

## 9. Funções sensíveis que não devem ser movidas agora

### Renderização

- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanCalRender()`

### Eventos, clique e duplo clique

- `convPlanVincularEventos()`
- `convPlanVincularModaisV2()`
- `convPlanCalBind()`
- o `click` manual com detecção de segundo clique rápido dentro de `convPlanVincularEventos()`
- `bindStandardGridActivation()` quando aplicado ao bloco do módulo

### Modais

- `convPlanEnsureModalUiV2()`
- `convPlanAbrirModalConvenioV2()`
- `convPlanAbrirModalPlanoV2()`
- `convPlanCalEnsureUI()`
- `convPlanCalAbrirModal()`
- `convPlanCloseModalV2()`

### Payload

- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`
- `convPlanCalModalPayload()`

### Salvamento

- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanCalSalvar()`

### Exclusão

- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalExcluir()`

### API e `requestJson`

- `convPlanCarregar()`
- `convPlanCalCarregar()`
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanCalSalvar()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalExcluir()`

## 10. Relações funcionais sensíveis

### Convênio e plano

- o plano depende do convênio selecionado;
- o painel usa dois grids separados e o filtro do segundo depende do primeiro;
- o calendário de faturamento também depende do convênio corrente.

### Pacientes

- há relação direta com a ficha do paciente, porque os combos de convênio e plano são consumidos por esse fluxo;
- isso amplia o risco de regressão caso o shell seja movido sem fronteiras muito claras.

### Procedimentos

- não encontrei, nesta leitura, um acoplamento direto tão explícito quanto o de pacientes e faturamento;
- a relação parece indireta por dependências de negócio e por outros cadastros ligados ao ecossistema.

### Tabelas, preços, custos, reajustes e financeiro

- o calendário de faturamento coloca o módulo na borda financeira do sistema;
- por isso, qualquer alteração funcional deve ser tratada como sensível;
- esta subetapa não alterou nenhum cálculo, tabela, preço, custo ou reajuste.

### Backend, API e banco

- os endpoints do módulo já existem e estão documentados no `app.js` e nos docs;
- os dados dependem de rotas sob `/cadastros/convenios-planos/*`;
- a camada de banco aparece nos docs como `convenio_odonto`, `plano_odonto` e `calendario_faturamento_odonto`;
- nada disso foi alterado nesta subetapa.

## 11. Risco textual e mojibake

Há risco textual/documental relevante.

### Evidências observadas

- o módulo JS passivo contém mensagem visível com mojibake em validação de convênio;
- os docs do repositório também exibem várias ocorrências antigas de mojibake;
- a blindagem textual é obrigatória e não deve ser contornada.

### Decisão nesta subetapa

- não corrigir textos;
- não corrigir acentos;
- não corrigir labels;
- não corrigir mensagens;
- não corrigir placeholders;
- não corrigir strings visíveis;
- não corrigir mojibake.

## 12. Risco específico de regressão no duplo clique

O risco específico de duplo clique continua alto.

Motivos:

- há histórico anterior de correção sensível de duplo clique;
- o módulo possui duas grades dinâmicas;
- o `tbody` é recriado em renderizações;
- a lógica de segundo clique rápido ainda está presente no `app.js`;
- a manutenção de seleção e edição depende de timings curtos e de DOM dinâmico.

Conclusão operacional:

- eventos e duplo clique devem continuar classificados como sensíveis;
- nenhuma mudança em seleção, clique ou duplo clique deve ser feita agora.

## 13. Decisão recomendada

**Analisar helper puro específico**

Motivo:

- o namespace passivo já existe;
- o `app.js` ainda concentra a lógica funcional e sensível;
- existe um conjunto claro de helpers puros de string no módulo passivo;
- começar por um helper isolado reduz muito o risco em comparação com mexer em eventos, modais, renderização ou payload.

## 14. Próxima etapa recomendada

**Subetapa 1 documental focada em um helper puro específico**

Sugestão de primeiro alvo:

- `normalizeText()`
- ou, se preferir começar pelo nome de negócio, `normalizarCodigoRegistro()`

Critério para a próxima etapa:

- continuar sem tocar em clique, duplo clique, renderização, salvamento, exclusão, payload ou backend;
- documentar apenas fronteira, contrato e pureza do helper escolhido;
- manter a blindagem textual/mojibake integralmente.

## 15. Fechamento

Este documento registra apenas a retomada documental do módulo Convênios e Planos.

Nada foi alterado em:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- backend
- banco
- schema
- migrations
- endpoints

E nenhuma correção textual foi aplicada.
