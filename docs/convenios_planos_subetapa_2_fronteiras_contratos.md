# Convênios e Planos - Subetapa 2 - Fronteiras e contratos

## 1. Contexto

Esta Subetapa 2 é somente documental.
O objetivo é mapear fronteiras e contratos do módulo `Convênios e Planos` entre `frontend/app.js`, o namespace passivo, DOM, endpoints, estados/caches, eventos e consumidores externos, sem alterar comportamento.

## 2. Arquivos consultados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/convenios-planos.js`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`

## 3. Confirmacao de escopo

Esta etapa não alterou:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/convenios-planos.js`
- backend
- banco
- endpoints
- comportamento funcional

Também não foi criado, salvo, editado ou documentado nada em:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`

## 4. Fronteira funcional atual

### O que continua 100% dentro de `frontend/app.js`

O fluxo funcional principal ainda está no monólito:

- `convPlanAbrir()`
- `convPlanEnsureUI()`
- `convPlanCarregar()`
- `convPlanVincularEventos()`
- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanSelecionarConvenio()`
- `convPlanSelecionarPlano()`
- `convPlanAbrirModalConvenioV2()`
- `convPlanAbrirModalPlanoV2()`
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalAbrir()`
- `convPlanCalCarregar()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`

### O que o namespace passivo ainda não controla

O namespace `window.BranaConveniosPlanosModule` ainda não controla:

- DOM;
- `fetch`;
- `requestJson`;
- eventos;
- seleção;
- renderização;
- modais;
- calendário de faturamento;
- endpoint;
- estado global funcional;
- fluxo de abertura;
- fluxo de salvamento;
- fluxo de exclusão.

### Função fonte da verdade

`frontend/app.js` continua sendo a fonte funcional da verdade.

### Confirmação explícita

`convPlanAbrir()` continua no `app.js`.

## 5. Contrato do namespace passivo

### O que o namespace expõe hoje

`window.BranaConveniosPlanosModule` expõe:

- `meta`
- `getInfo()`
- `getStatus()`

### Propósito atual

- `meta` identifica o módulo e seu estado passivo;
- `getInfo()` devolve um resumo estrutural do namespace;
- `getStatus()` devolve um status mínimo e estável para inspeção;
- o namespace existe como contrato estrutural, não como controlador funcional.

### Garantias atuais

O namespace ainda não deve receber:

- DOM;
- `requestJson`;
- `fetch`;
- eventos;
- controle de fluxo;
- renderização;
- modais;
- integração funcional com o `app.js`.

## 6. Contratos DOM

### Painel principal

Contrato DOM principal:

- `#convenios-planos-panel`

### Grade de convênios

- `#convplan-tb-convenios`
- `#convplan-total-convenios`

### Grade de planos

- `#convplan-tb-planos`
- `#convplan-total-planos`

### Botões

- `#convplan-btn-novo-convenio`
- `#convplan-btn-editar-convenio`
- `#convplan-btn-excluir-convenio`
- `#convplan-btn-calendario`
- `#convplan-btn-fechar`
- `#convplan-btn-novo-plano`
- `#convplan-btn-editar-plano`
- `#convplan-btn-excluir-plano`

### Campos e modais V2

#### Modal de convênio

- `#convplan-convenio-modal-backdrop`
- `#convplan-convenio-modal-title`
- `#convplan-convenio-tab-principal`
- `#convplan-convenio-tab-detalhes`
- `#convplan-convenio-pane-principal`
- `#convplan-convenio-pane-detalhes`
- `#convplan-convenio-codigo`
- `#convplan-convenio-nome`
- `#convplan-convenio-razao`
- `#convplan-convenio-ans`
- `#convplan-convenio-tipolog`
- `#convplan-convenio-endereco`
- `#convplan-convenio-numero`
- `#convplan-convenio-complemento`
- `#convplan-convenio-bairro`
- `#convplan-convenio-cidade`
- `#convplan-convenio-cep`
- `#convplan-convenio-uf`
- `#convplan-convenio-fone1`
- `#convplan-convenio-contato1`
- `#convplan-convenio-fone2`
- `#convplan-convenio-contato2`
- `#convplan-convenio-fone3`
- `#convplan-convenio-contato3`
- `#convplan-convenio-fone4`
- `#convplan-convenio-contato4`
- `#convplan-convenio-inclusao`
- `#convplan-convenio-alteracao`
- `#convplan-convenio-email`
- `#convplan-convenio-email-tec`
- `#convplan-convenio-homepage`
- `#convplan-convenio-cnpj`
- `#convplan-convenio-ie`
- `#convplan-convenio-im`
- `#convplan-convenio-fat`
- `#convplan-convenio-obs`
- `#convplan-convenio-inativo`
- `#convplan-convenio-ok`
- `#convplan-convenio-cancelar`

#### Modal de plano

- `#convplan-plano-modal-backdrop`
- `#convplan-plano-modal-title`
- `#convplan-plano-codigo`
- `#convplan-plano-nome`
- `#convplan-plano-cobertura`
- `#convplan-plano-inativo`
- `#convplan-plano-inclusao`
- `#convplan-plano-alteracao`
- `#convplan-plano-ok`
- `#convplan-plano-cancelar`

#### Calendário de faturamento

- `#convplan-cal-panel`
- `#convplan-cal-convenio`
- `#convplan-cal-tbody`
- `#convplan-cal-total`
- `#convplan-cal-btn-novo`
- `#convplan-cal-btn-editar`
- `#convplan-cal-btn-excluir`
- `#convplan-cal-btn-fechar`
- `#convplan-cal-modal-backdrop`
- `#convplan-cal-modal-title`
- `#convplan-cal-modal-close`
- `#convplan-cal-modal-convenio`
- `#convplan-cal-modal-fechamento`
- `#convplan-cal-modal-pagamento`
- `#convplan-cal-modal-ok`
- `#convplan-cal-modal-cancelar`

### Pontos de rerender de `tbody`

- `convPlanRenderConvenios()` recria `convPlanCfg.tbConvenios.innerHTML`;
- `convPlanRenderPlanos()` recria `convPlanCfg.tbPlanos.innerHTML`;
- `convPlanCalRender()` recria `convPlanCalCfg.tbody.innerHTML`;
- o redesenho total é parte do contrato atual do módulo.

## 7. Contratos de estado/cache

### Estados centrais

- `convPlanCfg`
- `convPlanConveniosCache`
- `convPlanPlanosCache`
- `convPlanSelConvenioId`
- `convPlanSelPlanoId`
- `convPlanCalCfg`
- `convPlanCalItens`
- `convPlanCalSelId`

### Flags de bind e proteção contra repetição

- `convPlanCfg.panel.dataset.bound`
- `convPlanCfg.panel.dataset.modalBound`
- `convPlanCfg.tbConvenios.dataset.convDblBound`
- `convPlanCfg.tbPlanos.dataset.planDblBound`
- `convPlanCfg.tbConvenios.dataset.lastConvId`
- `convPlanCfg.tbConvenios.dataset.lastConvAt`
- `convPlanCfg.tbPlanos.dataset.lastPlanId`
- `convPlanCfg.tbPlanos.dataset.lastPlanAt`
- `convPlanCalCfg.panel.dataset.bound`

### Outras variáveis relacionadas

- `CONVPLAN_LOGRADOUROS_V2`
- `CONVPLAN_TIPOS_FONE_V2`
- `CONVPLAN_MODALIDADE_FAT_V2`
- `convPlanCalCurrentItem()`

## 8. Contratos de endpoint / payload

### Listagem principal

- `GET /cadastros/convenios-planos/combos`

### Salvar convênio

- `POST /cadastros/convenios-planos/convenios`
- `PUT /cadastros/convenios-planos/convenios/{id}`

### Salvar plano

- `POST /cadastros/convenios-planos/planos`
- `PUT /cadastros/convenios-planos/planos/{id}`

### Excluir convênio

- `DELETE /cadastros/convenios-planos/convenios/{row_id}`

### Excluir plano

- `DELETE /cadastros/convenios-planos/planos/{row_id}`

### Calendário de faturamento

- `GET /cadastros/convenios-planos/calendario-faturamento`
- `GET /cadastros/convenios-planos/calendario-faturamento?convenio_row_id=...`
- `POST /cadastros/convenios-planos/calendario-faturamento`
- `PUT /cadastros/convenios-planos/calendario-faturamento/{id}`
- `DELETE /cadastros/convenios-planos/calendario-faturamento/{row_id}`

### Formato geral dos payloads

#### Convênio

`convPlanConvenioPayloadV2()` monta um payload amplo com campos de cadastro, contato, endereço, faturamento, observações e status.

#### Plano

`convPlanPlanoPayloadV2()` monta payload com:

- `convenio_row_id`
- `codigo`
- `nome`
- `cobertura`
- `inativo`

#### Calendário

`convPlanCalModalPayload()` monta payload com:

- `convenio_row_id`
- `data_fechamento`
- `data_pagamento`

### Riscos de alterar nomes de campos

Os payloads têm nomes específicos e já consumidos pelo backend.
Alterar campos como `convenio_row_id`, `codigo_ans`, `tipo_faturamento`, `convenio_id`, `row_id`, `data_fechamento` ou `data_pagamento` pode quebrar gravação, exclusão e carregamento de listas.

## 9. Contratos de eventos

### Clique simples

- convênios: clique seleciona linha e atualiza a lista de planos;
- planos: clique seleciona a linha;
- calendário: clique seleciona a data.

### Duplo clique / segundo clique rápido

- convênios: um segundo clique rápido abre edição de convênio;
- planos: um segundo clique rápido abre edição de plano;
- o comportamento é implementado com `dataset.lastConvId` / `dataset.lastConvAt` e `dataset.lastPlanId` / `dataset.lastPlanAt`.

### `bindStandardGridActivation`

- usado nas grades principais para manter o padrão conservador do projeto;
- continua sendo parte do contrato de ativação da grade.

### Binds manuais

- há binds manuais adicionais nos `tbody` para detectar duplo clique por intervalo de tempo;
- essa lógica não deve ser mexida nas etapas iniciais.

### Dataset usado para impedir bind duplicado

- `dataset.bound`
- `dataset.modalBound`
- `dataset.convDblBound`
- `dataset.planDblBound`
- `dataset.gridActivationBound`

### Risco de tabela dinâmica

- o `tbody` é recriado por renderização;
- o segundo clique rápido pode falhar se o redesenho mudar o contexto;
- por isso, a área é sensível e não deve ser extraída cedo.

### Pontos que não devem ser mexidos nas próximas etapas iniciais

- clique simples;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- renderização de `tbody`;
- seleção de linha;
- abertura de modal;
- fechamento de modal;
- atualização de seleção após salvar/excluir.

## 10. Consumidores externos e integrações

### Ficha pessoal / ficha clínica / paciente

- `fichaCarregarCombos()` consome `/cadastros/convenios-planos/combos`;
- `fichaAtualizarPlanosFiltro()` filtra planos por convênio;
- `fichaConvenioNomePorValor()` e `fichaPlanoNomePorValor()` lêem os caches;
- isso confirma consumo direto e risco de regressão em cadastro usado pelo paciente.

### Prestadores

- o botão de convênios em prestadores existe como contrato futuro;
- o módulo de convênios e planos é candidato natural para credenciamento e vínculos externos.

### Procedimentos

- não há consumo direto explícito no núcleo de convênios e planos, mas o módulo compartilha o ecossistema de cadastros e faturamento;
- o risco é indireto, principalmente por vínculos futuros.

### Agenda

- não foi identificado consumo direto relevante;
- o risco é baixo nesta leitura, mas existe dependência de shell e de padrões de painel.

### Financeiro

- o calendário de faturamento é a maior ponte com a área financeira;
- isso aumenta a sensibilidade do módulo.

### Materiais

- `convPlanCarregarAuxConvenioV2()` reaproveita listas auxiliares de materiais para montar opções de logradouro, tipos de contato, bairro e cidade;
- esta é uma dependência utilitária real do módulo.

### Credenciamento

- o módulo está naturalmente ligado a credenciamento de prestadores e planos de atendimento;
- ainda não há extração funcional separada, então o risco é de integração futura.

### Outros consumidores

- `closeWorkspacePanel()`, `hideAllPanels()`, `PANEL_TITLE_DEFAULTS`, `panelInsetsById()` e `modalInsetsById()` tratam o módulo como painel do shell.

## 11. Riscos para extrações futuras

### Baixo risco

- criar helper puro e pequeno que só normaliza string local;
- criar helper simples de rotulagem textual;
- documentar contratos adicionais sem tocar em código.

### Médio risco

- separar constantes de apoio;
- separar funções puramente textuais que ainda ficam próximas de payloads;
- extrair pequenos formatadores sem mexer em fluxo de tela.

### Alto risco

- renderização;
- seleção de linha;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- `requestJson`;
- endpoints;
- payloads;
- salvar;
- excluir;
- modais;
- calendário de faturamento;
- consumidores externos.

## 12. Próximas extrações permitidas

Os únicos helpers que parecem potencialmente seguros para a Subetapa 3 são os puramente textuais e pequenos:

- normalizar nome de convênio;
- validar nome de convênio;
- normalizar nome de plano;
- validar nome de plano;
- normalizar código/registro;
- formatar status textual/visual simples;
- montar label textual simples de convênio;
- montar label textual simples de plano;
- normalizar cobertura/carência somente se for textual, local e sem dependência de DOM/estado.

## 13. O que ainda não é seguro mover

Ainda não é seguro mover:

- abertura principal;
- criação de UI;
- carregamento;
- renderização;
- seleção;
- modais;
- salvamento;
- exclusão;
- calendário de faturamento;
- qualquer integração externa.

## 14. Recomendação para a próxima etapa

Recomendação conservadora:

- seguir para a Subetapa 3 apenas se for possível validar um helper puro e pequeno sem acoplar DOM, `requestJson` ou estado global;
- caso não haja um helper realmente seguro, encerrar a rodada documental aqui ou aprofundar a documentação antes de mexer em código.

## 15. Resumo final

O módulo continua concentrado em `frontend/app.js`, com:

- painel próprio;
- duas grades;
- modais V2;
- calendário de faturamento;
- consumo direto pela ficha do paciente;
- uso de `bindStandardGridActivation` combinado com clique rápido manual;
- risco elevado em renderização e event-driven behavior.

O namespace passivo existe apenas como fronteira estrutural. A funcionalidade ainda está toda no monólito.
