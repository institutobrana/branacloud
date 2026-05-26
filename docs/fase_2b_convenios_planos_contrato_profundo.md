# Fase 2B - Convênios e Planos - Contrato profundo do primeiro recorte médio controlado

## 1. Identificação da etapa
- Fase 2B.
- Convênios e Planos.
- Frente comum/core transversal.
- Contrato profundo.
- Etapa exclusivamente documental.
- Sem implementação.

## 2. Histórico e contexto
- `Preferências` foi pausada após dois recortes validados para evitar avanço para `sysOpt*`, `Odontograma`, `requestJson`, payload ou salvamento.
- `Prestadores` foi pausado após um recorte validado para evitar avanço para modal, salvar, excluir, agenda, credenciamento, comissões, permissões ou backend.
- A nova matriz comparativa pós-Prestadores recomendou `Convênios e Planos` como próxima frente para contrato profundo.
- `Convênios e Planos` entra com cautela por ser transversal e por tocar cadastro, pacientes, agenda e financeiro em outras partes do sistema.
- Qualquer futura implementacao deve ser pequena, visual/local e precedida deste contrato.

## 3. Mapa das funcoes atuais no app.js

### 3.1 Funcoes visuais/localmente seguras
- `convPlanStatusDotV2(inativo)` para o estado visual da linha.
- `convPlanTabSetV2(modal, tab)` para alternancia visual de abas da modal.
- `convPlanCurrentConvenioV2()` e `convPlanCurrentPlanoV2()` para leitura local de selecao atual.
- `convPlanSetObjectOptionsV2(selectEl, itens, blankLabel)` para popular selects locais sem alterar dados.

### 3.2 Funcoes de renderizacao
- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanCalRender()`

### 3.3 Funcoes de modal
- `convPlanEnsureModalUiV2()`
- `convPlanVincularModaisV2()`
- `convPlanConvenioModalPreencherV2(item = null)`
- `convPlanPlanoModalPreencherV2(item = null)`
- `convPlanAbrirModalConvenioV2(modo)`
- `convPlanAbrirModalPlanoV2(modo)`
- `convPlanCloseModalV2(backdrop)`

### 3.4 Funcoes de listagem
- `convPlanCarregar()`
- `convPlanCalCarregar()`

### 3.5 Funcoes de selecao
- `convPlanSelecionarConvenio(tr)`
- `convPlanSelecionarPlano(tr)`
- `convPlanCalSelecionar(tr)`

### 3.6 Funcoes de filtros/busca
- Nao ha filtro textual dedicado visivel no bloco principal de Convênios e Planos nesta leitura; a selecao do convenio atual atua como recorte de contexto para a lista de planos.
- `convPlanCalCfg.convenio` atua como filtro/escopo visual local do calendario de faturamento.

### 3.7 Funcoes de validacao
- Validacoes de nome e normalizacao ficam parcialmente delegadas ao namespace passivo `window.BranaConveniosPlanosModule`.
- Funcoes locais de normalizacao:
  - `convPlanNormalizarCampoTextoLocal(valor, helperName)`
  - `convPlanNormalizarNomeConvenioLocal(valor)`
  - `convPlanNormalizarNomePlanoLocal(valor)`
  - `convPlanNormalizarCodigoRegistroLocal(valor)`

### 3.8 Funcoes de eventos
- `convPlanVincularEventos()`
- `convPlanCalBind()`

### 3.9 Funcoes que chamam requestJson
- `convPlanCarregar()`
- `convPlanCarregarAuxConvenioV2(item = null)` depende de carregamento auxiliar via `materiaisCarregarAuxTipo()`, que por sua vez faz `requestJson` em `materiais`.
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalCarregar()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`

### 3.10 Funcoes que montam payload
- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`
- `convPlanCalModalPayload()`

### 3.11 Funcoes que salvam
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanCalSalvar()`

### 3.12 Funcoes que excluem
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalExcluir()`

### 3.13 Funcoes que dependem de backend/endpoints
- `convPlanCarregar()`
- `convPlanCarregarAuxConvenioV2(item = null)` indiretamente depende dos auxiliares carregados via API.
- `convPlanSalvarConvenioV2()`
- `convPlanSalvarPlanoV2()`
- `convPlanExcluirConvenioV2()`
- `convPlanExcluirPlanoV2()`
- `convPlanCalCarregar()`
- `convPlanCalSalvar()`
- `convPlanCalExcluir()`

### 3.14 Funcoes que dependem de permissões
- O bloco de Convênios e Planos conversa com a navegacao global e com o mapeamento de modulo do sistema, entao a leitura documental deve manter cautela com regras de acesso.
- Nesta etapa, nenhuma permissao sera alterada.

### 3.15 Areas proibidas para Fase 2B
- backend.
- banco.
- endpoints.
- permissoes.
- `requestJson`.
- payload efetivo.
- salvamento.
- exclusao.
- criacao/edicao real de convenio.
- criacao/edicao real de plano.
- validacoes criticas.
- vinculo com pacientes.
- vinculo com agenda.
- vinculo com financeiro.
- vinculo com recebimentos.
- vinculo com procedimentos.
- vinculo com prestadores.

## 4. Mapa de modulos existentes
- Arquivo encontrado: `frontend/js/modules/convenios-planos.js`.
- Exportacao identificada:
  - `meta`
  - `helpers`
  - `getInfo()`
  - `getStatus()`
- Helpers passivos identificados:
  - `normalizarNomeConvenio`
  - `validarNomeConvenio`
  - `normalizarNomePlano`
  - `validarNomePlano`
  - `normalizarCodigoRegistro`
- Status do modulo:
  - passivo
  - `ativo: false`
  - `controlaFluxo: false`
- O modulo ja e usado pelo `app.js` via `window.BranaConveniosPlanosModule?.helpers`.
- O namespace existente e suficiente para receber helpers puros futuros sem criar novo modulo nesta etapa.

## 5. Mapa de DOM

### 5.1 DOM visual/local
- `#convenios-planos-panel`
- `#convplan-tb-convenios`
- `#convplan-total-convenios`
- `#convplan-tb-planos`
- `#convplan-total-planos`

### 5.2 DOM de tabela/lista
- Linha principal de convênios em `#convplan-tb-convenios`
- Linha principal de planos em `#convplan-tb-planos`
- Linha de calendario em `#convplan-cal-tbody`

### 5.3 DOM de formulario/modal
- `#convplan-convenio-modal-backdrop`
- `#convplan-plano-modal-backdrop`
- Campos do convenio: codigo, nome, razao, ANS, logradouro, endereco, numero, complemento, bairro, cidade, CEP, UF, telefones, contatos, e-mail, homepage, CNPJ, inscricoes, modalidade de faturamento, observacoes e inativo.
- Campos do plano: codigo, nome, cobertura, inativo.
- `#convplan-cal-modal-backdrop`
- Campos do calendario: convenio, data de fechamento, data de pagamento.

### 5.4 DOM de filtros/busca
- `#convplan-cal-convenio` atua como filtro/escopo do calendario.

### 5.5 DOM de botoes
- `#convplan-btn-novo-convenio`
- `#convplan-btn-editar-convenio`
- `#convplan-btn-excluir-convenio`
- `#convplan-btn-calendario`
- `#convplan-btn-novo-plano`
- `#convplan-btn-editar-plano`
- `#convplan-btn-excluir-plano`
- `#convplan-btn-fechar`
- botoes da modal de convenio e da modal de plano
- botoes da modal de calendario

### 5.6 DOM de abas
- `#convplan-convenio-tab-principal`
- `#convplan-convenio-tab-detalhes`

### 5.7 DOM que dispara eventos
- linhas clicaveis de convenios e planos
- botoes de acao do painel principal
- tabs da modal
- botoes de salvar/cancelar/fechar das modais
- backdrop das modais

### 5.8 DOM que participa de requestJson
- qualquer campo da modal de convenio/plano usado na montagem dos payloads.
- o select do calendario que define o escopo do carregamento da agenda de faturamento.

### 5.9 DOM que participa de payload/salvamento
- campos da modal de convenio
- campos da modal de plano
- campos da modal de calendario

### 5.10 DOM que participa de exclusao
- selecao de linha em `#convplan-tb-convenios`
- selecao de linha em `#convplan-tb-planos`
- selecao de linha em `#convplan-cal-tbody`

### 5.11 DOM sensivel/proibido
- modais de convenio/plano/calendario
- botoes de excluir
- campos que afetam persistencia
- qualquer area que conecte Convênios e Planos a pacientes, agenda, financeiro, prestadores ou recebimentos

## 6. Mapa de eventos
- eventos visuais apenas: alternancia de abas da modal via `convPlanTabSetV2`.
- eventos de selecao: clique e duplo clique nas linhas de convenios, planos e calendario.
- eventos de abertura/fechamento de modal: abrir modal de convenio, plano e calendario; fechar por botao ou backdrop.
- eventos de filtros/busca: mudanca do select do calendario.
- eventos de carregamento/listagem: `convPlanCarregar()`, `convPlanCalCarregar()`.
- eventos que disparam requestJson: salvar, excluir e carregar.
- eventos que salvam: botoes `Ok` das modais e acao de salvar do calendario.
- eventos que excluem: botoes de eliminar convenio/plano/calendario.
- eventos que podem impactar pacientes, agenda ou financeiro: abertura do calendario de faturamento e qualquer fluxo futuro que use os convênios/plano como base transversal.
- eventos proibidos para o primeiro recorte medio: salvar, excluir, migrar, validar integracoes ou alterar permissões.

## 7. Mapa de requestJson / payload / salvamento / exclusao

### 7.1 `convPlanCarregar()`
- Função chamadora: `convPlanAbrir()`
- Endpoint: `GET /cadastros/convenios-planos/combos`
- Método: GET
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Risco: medio, porque alimenta os dois grids principais e o fluxo de ficha via `fichaCarregarCombos()`

### 7.2 `convPlanCarregarAuxConvenioV2(item = null)`
- Função chamadora: `convPlanAbrirModalConvenioV2(modo)`
- Endpoint direto: nao usa `requestJson` propria, mas depende de `materiaisCarregarAuxTipo(...)`, que faz requestJson em `materiais`
- Carrega dados: sim, de forma indireta
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Risco: medio/alto por preencher selects de apoio e reusar auxiliares transversais

### 7.3 `convPlanSalvarConvenioV2()`
- Função chamadora: botao `Ok` da modal de convenio
- Endpoint: `POST /cadastros/convenios-planos/convenios` ou `PUT /cadastros/convenios-planos/convenios/{id}`
- Método: POST/PUT
- Carrega dados: nao
- Salva dados: sim
- Exclui dados: nao
- Monta payload: sim
- Risco: alto

### 7.4 `convPlanSalvarPlanoV2()`
- Função chamadora: botao `Ok` da modal de plano
- Endpoint: `POST /cadastros/convenios-planos/planos` ou `PUT /cadastros/convenios-planos/planos/{id}`
- Método: POST/PUT
- Carrega dados: nao
- Salva dados: sim
- Exclui dados: nao
- Monta payload: sim
- Risco: alto

### 7.5 `convPlanExcluirConvenioV2()`
- Função chamadora: botao excluir convenio
- Endpoint: `DELETE /cadastros/convenios-planos/convenios/{row_id}`
- Método: DELETE
- Carrega dados: nao
- Salva dados: nao
- Exclui dados: sim
- Monta payload: nao
- Risco: alto

### 7.6 `convPlanExcluirPlanoV2()`
- Função chamadora: botao excluir plano
- Endpoint: `DELETE /cadastros/convenios-planos/planos/{row_id}`
- Método: DELETE
- Carrega dados: nao
- Salva dados: nao
- Exclui dados: sim
- Monta payload: nao
- Risco: alto

### 7.7 `convPlanCalCarregar()`
- Função chamadora: `convPlanCalAbrir()`, mudanca do select de convenio do calendario
- Endpoint: `GET /cadastros/convenios-planos/calendario-faturamento`
- Método: GET
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Risco: medio/alto

### 7.8 `convPlanCalSalvar()`
- Função chamadora: botao `Ok` da modal de calendario
- Endpoint: `POST /cadastros/convenios-planos/calendario-faturamento` ou `PUT /cadastros/convenios-planos/calendario-faturamento/{row_id}`
- Método: POST/PUT
- Carrega dados: nao
- Salva dados: sim
- Exclui dados: nao
- Monta payload: sim
- Risco: alto

### 7.9 `convPlanCalExcluir()`
- Função chamadora: botao excluir do calendario
- Endpoint: `DELETE /cadastros/convenios-planos/calendario-faturamento/{row_id}`
- Método: DELETE
- Carrega dados: nao
- Salva dados: nao
- Exclui dados: sim
- Monta payload: nao
- Risco: alto

## 8. Mapa de backend / endpoints / permissoes / impactos transversais
- Endpoints backend identificados:
  - `/cadastros/convenios-planos/combos`
  - `/cadastros/convenios-planos/convenios`
  - `/cadastros/convenios-planos/convenios/{id}`
  - `/cadastros/convenios-planos/planos`
  - `/cadastros/convenios-planos/planos/{id}`
  - `/cadastros/convenios-planos/calendario-faturamento`
  - `/cadastros/convenios-planos/calendario-faturamento/{row_id}`
- Permissoes: o bloco e tratado pelo shell global da aplicacao e pelo mapeamento de modulos, portanto qualquer extracao futura precisa manter cautela com permissao de acesso e navegação.
- Perfis: nao ha alteracao direta nesta etapa, mas a frente conversa com cadastro e com fluxo compartilhado de uso.
- Clinica: o bloco pode variar por contexto da clinica e por dados carregados.
- Pacientes: impacto indireto via ficha e selecao de convenio/plano.
- Agenda: impacto indireto via calendario de faturamento e possiveis rotinas futuras.
- Financeiro/recebimentos: impacto indireto e transversal.
- Procedimentos: impacto indireto em relacoes de cobertura/uso.
- Prestadores: impacto indireto em dependencias transversais.
- Contratos/tabelas: o bloco tem relacao com tabela de convenios, planos e calendario de faturamento.

## 9. Partes proibidas para Fase 2B
- backend.
- banco.
- endpoints.
- permissoes.
- `requestJson`.
- payload efetivo.
- salvamento.
- exclusao.
- criacao/edicao real de convenio.
- criacao/edicao real de plano.
- regras de validacao critica.
- vinculo com pacientes.
- vinculo com agenda.
- vinculo com financeiro.
- vinculo com recebimentos.
- vinculo com procedimentos.
- vinculo com prestadores.
- correcoes textuais.
- labels/placeholders/mensagens.
- mojibake.

## 10. Recortes medios possiveis

### Candidato 1 - Renderizacao visual/local da lista principal e contador
- Descricao: extrair a composicao visual das grids de convenios e planos e os contadores, mantendo os dados ja carregados e a selecao visual.
- Funcoes envolvidas: `convPlanRenderConvenios()`, `convPlanRenderPlanos()`, parte de `convPlanSelecionarConvenio()` e `convPlanSelecionarPlano()`
- DOM envolvido: `#convplan-tb-convenios`, `#convplan-total-convenios`, `#convplan-tb-planos`, `#convplan-total-planos`
- Eventos envolvidos: clique e duplo clique nas linhas
- Toca requestJson: nao
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: nao diretamente
- Toca permissoes: nao
- Toca pacientes/agenda/financeiro: nao diretamente
- Risco: medio
- Ganho esperado: real, com reducao do bloco visual no `app.js`
- Teste manual possivel: abrir `Convênios e Planos`, conferir lista, contador e selecao visual
- Rollback mental: recolocar a composicao HTML das linhas e contadores em `app.js`
- Decisao: recomendado

### Candidato 2 - Renderizacao visual local do calendario de faturamento
- Descricao: separar a renderizacao da grade e do contador do calendario de faturamento.
- Funcoes envolvidas: `convPlanCalRender()`, parte de `convPlanCalSelecionar()`
- DOM envolvido: `#convplan-cal-tbody`, `#convplan-cal-total`
- Eventos envolvidos: clique nas linhas e mudanca do select de convenio
- Toca requestJson: sim, indiretamente pelo carregamento do calendario
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: sim, indiretamente
- Toca permissoes: nao diretamente
- Toca pacientes/agenda/financeiro: sim, por ser o calendario de faturamento
- Risco: medio/alto
- Ganho esperado: moderado
- Teste manual possivel: verificar o calendario, filtro por convenio e selecao
- Rollback mental: devolver a renderizacao do calendario para o `app.js`
- Decisao: rejeitado como primeiro recorte

### Candidato 3 - Tab visual e preenchimento de modal
- Descricao: extrair apenas a alternancia visual das tabs da modal e o preenchimento local dos campos.
- Funcoes envolvidas: `convPlanTabSetV2()`, `convPlanConvenioModalPreencherV2()`, `convPlanPlanoModalPreencherV2()`
- DOM envolvido: modal de convenio e modal de plano
- Eventos envolvidos: tabs, abertura de modal
- Toca requestJson: nao diretamente
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: nao diretamente
- Toca permissoes: nao
- Toca pacientes/agenda/financeiro: nao diretamente
- Risco: medio
- Ganho esperado: baixo a medio
- Teste manual possivel: abrir modais e alternar abas
- Rollback mental: devolver o preenchimento das modais para `app.js`
- Decisao: possivel, mas inferior ao candidato 1

## 11. Recomendacao de UM unico recorte
- Recomendacao: extrair a renderizacao visual/local da lista principal de Convênios e Planos e dos contadores, mantendo o calendario, modais, salvar, excluir e demais fluxos fora do recorte.
- Classificacao: frente comum/core transversal.
- Motivo da escolha: entrega ganho real de organizacao do `app.js`, tem teste manual claro e nao toca `requestJson`, payload, salvamento, exclusao, pacientes, agenda ou financeiro.
- O candidato do calendario foi rejeitado por risco transversal maior.
- O candidato de modal foi mantido como secundario.
- A futura implementacao deve continuar pequena e visual/local.

## 12. Teste manual previsto
- Menu/tela: abrir `Cadastro > Convênios e Planos`.
- Acoes: conferir a lista principal, os contadores, a selecao visual de convênios e planos e a alternancia de contexto entre itens.
- Comportamento esperado: as grids continuam populadas e com selecao coerente.
- O que nao pode quebrar: abertura/fechamento do painel, ordem das linhas, contadores, selecao visual e o calendario de faturamento ja existente.
- Testar salvar: nao.
- Testar exclusao: nao.
- Testar fechamento/reabertura: sim.
- Comparar listagem antes/depois: sim.
- Verificar ausencia de impacto em pacientes, agenda e financeiro: sim, por leitura do fluxo e por teste visual de regressao.

## 13. Risco residual e rollback mental
- Riscos principais: lista vazia inesperada, contador incorreto, selecao visual incoerente, quebra de renderizacao das linhas, regressao no fluxo do calendario por dependencia compartilhada.
- Como perceber quebra: grids sem linhas, selecao nao destacada, contador fora do esperado, painel abrindo com layout quebrado.
- Como comparar com comportamento anterior: repetir a abertura do painel, alternar convênio/plano e observar se a selecao e os contadores permanecem iguais.
- Como reverter mentalmente: devolver a montagem HTML das linhas e contadores para `app.js` e manter apenas helpers puros no modulo passivo.
- Por que o recorte e aceitavel: ha ganho real e o caminho e visual/local, sem tocar persistencia.

## 14. Registro para roadmap
- O contrato profundo de `Convênios e Planos` foi criado como etapa exclusivamente documental da Fase 2B.
- A frente foi classificada como comum/core transversal.
- O contexto ficou amarrado a nova matriz comparativa pos-Prestadores, que recomendou `Convênios e Planos` como proxima frente apenas para contrato profundo.
- O mapa documental registrou funcoes de `app.js`, modulos existentes, DOM, eventos, `requestJson`, payload, salvamento, exclusao, backend, endpoints, permissoes e impactos transversais apenas por leitura.
- As areas proibidas permaneceram intocadas: backend, banco, endpoints, permissoes, `requestJson`, payload efetivo, salvamento, exclusao, validacoes criticas, vinculos com pacientes, agenda, financeiro, recebimentos, procedimentos e prestadores, alem de correcoes textuais e mojibake.
- Foram avaliados candidatos pequenos de recorte medio controlado dentro de `Convênios e Planos`, com recomendacao futura para a lista principal e o contador.
- O teste manual previsto foi registrado para uma futura implementacao minima, sem executar nada nesta etapa.
- Nenhuma implementacao direta foi escolhida.
- A blindagem textual/mojibake foi respeitada.
