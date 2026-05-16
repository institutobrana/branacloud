# Convênios e Planos - Subetapa 0 - Mapeamento monolítico

## 1. Contexto

Esta Subetapa 0 é somente documental.
O objetivo é mapear o bloco de `Convênios e Planos` existente em `frontend/app.js`, sem mover código, sem criar módulo novo e sem alterar comportamento.

## 2. Documentos de referência consultados

### Encontrados e lidos

- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`

### Não usados como destino de trabalho

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`

## 3. Confirmacao de escopo

Esta etapa não alterou:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/*`
- backend
- banco
- endpoints
- comportamento funcional

Também não foi criado qualquer arquivo fora de `D:\BRANA ARQUIVOS\BRANA CLOUD`.

## 4. Localização geral no `app.js`

### Termos encontrados

Os termos `convenio`, `convênio`, `convenios`, `convênios`, `plano`, `planos` e `convPlan` aparecem em vários pontos de `frontend/app.js`, mas o núcleo do módulo está concentrado e relativamente bem delimitado.

Pontos principais observados:

- `MENU_ACTION_MODULE_OVERRIDES["cadastro-convenios-planos"] = "configuracao"`
- dispatcher para `action === "cadastro-convenios-planos"` chamando `convPlanAbrir()`
- `convPlanRenderConvenios()`
- `convPlanRenderPlanos()`
- `convPlanSelecionarConvenio()`
- `convPlanSelecionarPlano()`
- `convPlanEnsureUI()`
- `convPlanCarregar()`
- `convPlanVincularEventos()`
- `convPlanAbrir()`
- bloco de modal/CRUD com nomes `convPlan...V2`
- bloco do calendário de faturamento com nomes `convPlanCal...`

### Região aproximada do bloco

- Núcleo principal de listagem e abertura: por volta das linhas `6776-6857`.
- Dispatcher do menu: por volta da linha `22762`.
- Uso como consumidor em ficha do paciente: por volta das linhas `5436-5475`.
- Mapas de shell e fechamento: por volta das linhas `570`, `609`, `613`, `614`.
- Relação com prestadores/credenciamentos: por volta das linhas `23087` e seguintes, via botão e contratos de credenciamento.

### Concentrado ou espalhado

- O bloco funcional próprio está concentrado em um trecho único do `app.js`.
- Há referências espalhadas em outros fluxos, principalmente:
  - ficha do paciente;
  - credenciamento de prestadores;
  - shell de painéis e modais;
  - menu global.

### Possíveis trechos legados

- Há uma primeira camada simples de painel/listagem e uma camada posterior com modal completo e calendário de faturamento.
- Isso sugere evolução incremental do mesmo módulo dentro do monólito, não um módulo separado.
- O arquivo usa nomes `V2` para várias rotinas de convênio/plano, o que indica reforço posterior da implementação.

### Duplicidades e reassignment posterior

- Não foi identificado `reassignment` direto do mesmo nome por atribuição, como ocorreu em outros módulos.
- O que existe é uma combinação de funções de listagem e funções `V2` de modal/CRUD, convivendo no mesmo bloco.
- O padrão de ativação da grade aparece tanto por `bindStandardGridActivation` quanto por clique rápido manual nas tabelas.

## 5. Função principal de abertura

### Função encontrada

- `convPlanAbrir()`

### Fluxo ativo

1. `convPlanEnsureUI()` garante a UI e o painel.
2. `convPlanVincularEventos()` instala os binds uma única vez.
3. `hideAllPanels()` fecha os demais painéis.
4. `ensurePanelChrome(convPlanCfg.panel)` reforça o chrome do painel.
5. `convPlanCfg.panel.classList.remove("hidden")` exibe o painel.
6. `workspaceEmpty.classList.add("hidden")` oculta a área vazia.
7. `await convPlanCarregar()` carrega convênios e planos.
8. `footerMsg.textContent = "Cadastro > Convênios e planos aberto."`

### Observação funcional

O fluxo ativo atual não abre ainda um submódulo separado; ele mantém tudo dentro do `app.js`.

## 6. Funções de criação de UI

### Tela / painel

- `convPlanEnsureUI()`

O que ela faz:

- injeta estilo para o painel;
- cria `<section id="convenios-planos-panel">`;
- cria a barra superior de ações;
- cria o grid de convênios;
- cria o grid de planos;
- cria os contadores de total;
- captura as referências DOM em `convPlanCfg`;
- chama `ensurePanelChrome(convPlanCfg.panel)`;
- inicia a estrutura dos modais com `convPlanEnsureModalUiV2()`;
- conecta os modais com `convPlanVincularModaisV2()`.

### Grids

- grid de convênios: `#convplan-tb-convenios`
- grid de planos: `#convplan-tb-planos`

### Botões

- `#convplan-btn-novo-convenio`
- `#convplan-btn-editar-convenio`
- `#convplan-btn-excluir-convenio`
- `#convplan-btn-calendario`
- `#convplan-btn-fechar`
- `#convplan-btn-novo-plano`
- `#convplan-btn-editar-plano`
- `#convplan-btn-excluir-plano`

### Modal de convênio

- `convPlanBuildConvenioModalHtmlV2()`
- `convPlanCaptureConvenioModalV2()`
- `convPlanEnsureModalUiV2()`

### Modal de plano

- `convPlanBuildPlanoModalHtmlV2()`
- `convPlanCapturePlanoModalV2()`
- `convPlanEnsureModalUiV2()`

### Modal de calendário

- `convPlanCalEnsureUI()`
- `convPlanCalBind()`
- `convPlanCalAbrir()`

## 7. Funções de carregamento / listagem

### Função encontrada

- `convPlanCarregar()`

### Como os dados são carregados

- Usa `requestJson("GET", "/cadastros/convenios-planos/combos", undefined, true)`.
- Espera um objeto com:
  - `data.convenios`
  - `data.planos`

### Quando são carregados

- na abertura do painel;
- na atualização após salvar;
- na atualização após excluir;
- ao abrir o calendário de faturamento;
- ao carregar a ficha do paciente, que também busca os combos.

### Cache local

- `convPlanConveniosCache`
- `convPlanPlanosCache`
- `convPlanSelConvenioId`
- `convPlanSelPlanoId`

### Uso de fetch/requestJson

- o carregamento usa `requestJson`;
- o bloco não mostra cache persistente fora das variáveis globais do próprio módulo.

## 8. Funções de renderização

### Convênios

- `convPlanRenderConvenios()`

### Planos

- `convPlanRenderPlanos()`

### Linha selecionada

- `convPlanSelecionarConvenio(tr)`
- `convPlanSelecionarPlano(tr)`

### Estado vazio e status visual

- o status visual é um ponto verde quando ativo e vazio quando inativo, via `convPlanStatusDotV2(inativo)`;
- o total de convênios e planos é atualizado no rodapé de cada grid;
- o bloco não mostra uma mensagem de vazio muito elaborada, apenas a grade vazia sem linhas e o contador correspondente.

## 9. Seleção e ativação de linha

### Convênios

- seleção simples: clique no `tbody` de convênios;
- segundo clique rápido: detectado manualmente por `dataset.lastConvId` / `dataset.lastConvAt`;
- duplo clique também passa por `bindStandardGridActivation` em outra camada, mas o comportamento robusto está no clique rápido manual.

### Planos

- seleção simples: clique no `tbody` de planos;
- segundo clique rápido: detectado manualmente por `dataset.lastPlanId` / `dataset.lastPlanAt`;
- duplo clique também dispara edição se o tempo entre cliques for curto.

### `bindStandardGridActivation`

- o helper é usado no bloco de convênios e planos;
- o módulo também implementa lógica manual de clique rápido para não depender só de `dblclick` nativo;
- isso é importante porque a grade é dinâmica e o `tbody` é recriado ao renderizar.

### Risco por tabela dinâmica

- `convPlanRenderConvenios()` e `convPlanRenderPlanos()` recriam o `tbody`;
- isso torna o segundo clique e o duplo clique sensíveis a tempo e ao redesenho;
- o módulo já evita depender exclusivamente de `dblclick` nativo, o que é bom, mas ainda exige cautela.

## 10. Funções de modal

### Convênio

- abrir: `convPlanAbrirModalConvenioV2("novo" | "editar")`
- preencher: `convPlanConvenioModalPreencherV2(item)`
- salvar: `convPlanSalvarConvenioV2()`
- fechar: `convPlanCloseModalV2(backdrop)`

### Plano

- abrir: `convPlanAbrirModalPlanoV2("novo" | "editar")`
- preencher: `convPlanPlanoModalPreencherV2(item)`
- salvar: `convPlanSalvarPlanoV2()`
- fechar: `convPlanCloseModalV2(backdrop)`

### Calendário de faturamento

- abrir: `convPlanCalAbrir()`
- preencher modal: `convPlanCalModalPreencher(item)`
- salvar: `convPlanCalSalvar()`
- excluir: `convPlanCalExcluir()`
- fechar modal: `convPlanCloseModalV2(backdrop)`

### Modo novo / alterar

- existe claramente nos modais `V2`;
- o título muda entre novo e alteração;
- o `editRowId` define se o salvamento vai por `POST` ou `PUT`.

## 11. Funções de salvar

### Convênio

- `convPlanSalvarConvenioV2()`

Fluxo:

- monta payload com `convPlanConvenioPayloadV2()`;
- valida se há modal e payload;
- escolhe `POST` ou `PUT` com base em `editRowId`;
- usa endpoint em `/cadastros/convenios-planos/convenios`;
- fecha o modal;
- atualiza seleção e recarrega a lista;
- mostra mensagem de sucesso no `footerMsg`.

### Plano

- `convPlanSalvarPlanoV2()`

Fluxo:

- monta payload com `convPlanPlanoPayloadV2()`;
- valida se há convênio selecionado;
- escolhe `POST` ou `PUT` com base em `editRowId`;
- usa endpoint em `/cadastros/convenios-planos/planos`;
- fecha o modal;
- atualiza seleção e recarrega a lista;
- mostra mensagem de sucesso no `footerMsg`.

### Calendário de faturamento

- `convPlanCalSalvar()`

Fluxo:

- monta payload com `convPlanCalModalPayload()`;
- valida convênio;
- usa `POST` ou `PUT` no endpoint de calendário;
- fecha modal;
- recarrega calendário;
- atualiza mensagem de sucesso.

### Mensagens

- falhas usam `window.alert(...)`;
- sucesso vai para `footerMsg.textContent`.

## 12. Funções de excluir / inativar

### Convênio

- `convPlanExcluirConvenioV2()`

### Plano

- `convPlanExcluirPlanoV2()`

### Calendário

- `convPlanCalExcluir()`

### Inativação

- existe checkbox `inativo` nos modais;
- o módulo também usa status visual na grade;
- não há indicação de exclusão lógica complexa além do campo `inativo` e do `DELETE` real.

### Confirmações

- exclusões pedem confirmação com `window.confirm(...)`;
- em calendário, a confirmação inclui o nome do convênio.

### Atualização após operação

- após salvar ou excluir, o módulo recarrega os combos/grades;
- a seleção é revalidada.

## 13. Eventos e binds

### Binds no painel principal

- `bindStandardGridActivation(convPlanCfg.tbConvenios, ...)`
- `bindStandardGridActivation(convPlanCfg.tbPlanos, ...)`
- `click` nos botões de novo/alterar/excluir convênio
- `click` no botão de calendário
- `click` nos botões de novo/alterar/excluir plano
- `click` no botão fechar

### Binds nos modais

- `click` em abas do modal de convênio
- `click` no `Ok` e `Cancelar` dos modais
- `click` no backdrop para fechar
- no calendário, `change` no combo de convênio
- no calendário, `click` em novo, alterar, excluir e fechar

### Binds relacionados a duplo clique

- o painel principal usa segundo clique rápido manual em convênios e planos;
- isso é explicitamente relevante por causa da tabela dinâmica.

### Binds de teclado

- o código observado não destaca um fluxo de teclado relevante para convênios e planos nesta etapa.

## 14. Estados e caches globais

### Principais estados

- `convPlanCfg`
- `convPlanConveniosCache`
- `convPlanPlanosCache`
- `convPlanSelConvenioId`
- `convPlanSelPlanoId`
- `convPlanCalCfg`
- `convPlanCalSelId`
- `convPlanCalItens`

### Estados auxiliares

- `convPlanUltimoCliqueConvenioId`
- `convPlanUltimoCliqueConvenioEm`
- flags `dataset.bound`, `dataset.modalBound`, `dataset.convDblBound`, `dataset.planDblBound`

### Uso do estado

- seleção de linha;
- destaque visual;
- controle de modais;
- controle de duplo clique;
- recarga de dados.

## 15. Endpoints usados

### Listagem principal

- `GET /cadastros/convenios-planos/combos`

### Convênios

- `POST /cadastros/convenios-planos/convenios`
- `PUT /cadastros/convenios-planos/convenios/{id}`
- `DELETE /cadastros/convenios-planos/convenios/{row_id}`

### Planos

- `POST /cadastros/convenios-planos/planos`
- `PUT /cadastros/convenios-planos/planos/{id}`
- `DELETE /cadastros/convenios-planos/planos/{row_id}`

### Calendário de faturamento

- `GET /cadastros/convenios-planos/calendario-faturamento`
- `GET /cadastros/convenios-planos/calendario-faturamento?convenio_row_id=...`
- `POST /cadastros/convenios-planos/calendario-faturamento`
- `PUT /cadastros/convenios-planos/calendario-faturamento/{id}`
- `DELETE /cadastros/convenios-planos/calendario-faturamento/{row_id}`

### Consumo em ficha do paciente

- `GET /cadastros/convenios-planos/combos` também é usado pela ficha para montar convênio/plano/tabela.

## 16. Contratos DOM

### Painel principal

- `#convenios-planos-panel`
- `#convplan-tb-convenios`
- `#convplan-tb-planos`
- `#convplan-total-convenios`
- `#convplan-total-planos`
- `#convplan-btn-novo-convenio`
- `#convplan-btn-editar-convenio`
- `#convplan-btn-excluir-convenio`
- `#convplan-btn-calendario`
- `#convplan-btn-fechar`
- `#convplan-btn-novo-plano`
- `#convplan-btn-editar-plano`
- `#convplan-btn-excluir-plano`

### Modal de convênio

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

### Modal de plano

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

### Modal de calendário

- `#convplan-cal-panel`
- `#convplan-cal-tbody`
- `#convplan-cal-total`
- `#convplan-cal-btn-novo`
- `#convplan-cal-btn-editar`
- `#convplan-cal-btn-excluir`
- `#convplan-cal-btn-fechar`
- `#convplan-cal-convenio`
- `#convplan-cal-modal-backdrop`
- `#convplan-cal-modal-title`
- `#convplan-cal-modal-close`
- `#convplan-cal-modal-convenio`
- `#convplan-cal-modal-fechamento`
- `#convplan-cal-modal-pagamento`
- `#convplan-cal-modal-ok`
- `#convplan-cal-modal-cancelar`

## 17. Dependências com outros módulos

### Ficha do paciente

- `fichaCarregarCombos()` busca convênios e planos via `/cadastros/convenios-planos/combos`.
- `fichaAtualizarPlanosFiltro()`, `fichaConvenioNomePorValor()` e `fichaPlanoNomePorValor()` consomem `fichaConveniosCache` e `fichaPlanosCache`.

### Prestadores

- o bloco de prestadores mostra botão `Convênios...`, ainda como placeholder;
- o módulo de convênios e planos é a base natural para futuros vínculos com credenciamentos.

### Credenciamento de prestadores

- `prestCredConvenios` existe como estado relacionado;
- isso sugere dependência de convênios no fluxo de credenciamento.

### Procedimentos

- não há consumo direto evidente no bloco principal de convênios/plano;
- a relação parece indireta via demais cadastros e faturamento.

### Agenda

- não foi identificado uso direto do módulo de convênios/planos na agenda nesta leitura;
- o risco de impacto existe apenas por compartilhamento de shell e de listas auxiliares.

### Financeiro

- o calendário de faturamento toca a área financeira e deve ser tratado com cuidado.

### Materiais

- o modal de convênio reaproveita listas auxiliares de materiais para combos de logradouro, bairro e cidade;
- isso confirma dependência utilitária com o módulo de Materiais.

### Cadastro de usuários

- não foi identificado consumo direto relevante do módulo de convênios/planos.

## 18. Riscos

### Riscos principais observados

- duplo clique / segundo clique rápido em tabelas dinâmicas;
- recriação do `tbody` a cada render;
- modais grandes com muitos campos;
- payload extenso de convênio;
- payload do plano ligado ao convênio selecionado;
- calendário de faturamento com relacionamento próprio;
- seleção de convênio influenciando a lista de planos;
- dependências externas da ficha do paciente;
- dependências futuras de credenciamento;
- risco de mover cedo um cadastro que já é consumidor em outros fluxos;
- risco de mexer no shell antes de separar fronteiras.

### Risco de mover código cedo demais

Por segurança, não deve ser extraído ainda:

- a abertura principal;
- criação de UI;
- `requestJson` / `fetch`;
- renderização;
- seleção de linha;
- `bindStandardGridActivation`;
- binds de segundo clique;
- modais;
- salvar;
- excluir;
- integrações com backend;
- integrações com outros cadastros;
- vínculos entre convênios e planos;
- calendário de faturamento.

## 19. Helpers puros candidatos

Os candidatos abaixo são somente sugestões futuras. Nada foi implementado nesta Subetapa 0.

### 1. Normalizar nome de convênio

- entrada esperada: texto bruto do convênio;
- saída esperada: nome aparado, com espaços normalizados;
- por que é puro: opera só em string;
- por que não depende de DOM: não lê nem escreve elementos;
- por que não depende de `requestJson`/`fetch`: não acessa rede;
- risco de integração futura: baixo, mas deve preservar acentuação e não alterar código comercial.

### 2. Validar nome de convênio

- entrada esperada: texto bruto;
- saída esperada: `{ ok, nome, mensagem }` ou equivalente simples;
- por que é puro: valida apenas texto;
- por que não depende de DOM: só lê parâmetro;
- por que não depende de `requestJson`/`fetch`: não consulta servidor;
- risco de integração futura: baixo, porém precisa respeitar regras de obrigatoriedade atuais.

### 3. Normalizar nome de plano

- entrada esperada: texto bruto do plano;
- saída esperada: nome aparado;
- por que é puro: só trata string;
- por que não depende de DOM: não usa elementos;
- por que não depende de `requestJson`/`fetch`: não usa rede;
- risco de integração futura: baixo.

### 4. Validar nome de plano

- entrada esperada: texto bruto;
- saída esperada: estrutura mínima de validação;
- por que é puro: cálculo local;
- por que não depende de DOM: não toca interface;
- por que não depende de `requestJson`/`fetch`: não chama backend;
- risco de integração futura: baixo.

### 5. Normalizar código / registro

- entrada esperada: código textual ou numérico;
- saída esperada: string normalizada para exibição ou payload;
- por que é puro: transformação local;
- por que não depende de DOM: só recebe valor;
- por que não depende de `requestJson`/`fetch`: não acessa rede;
- risco de integração futura: médio, porque convênio tem código, código ANS e row_id distintos.

### 6. Formatar status visual / textual

- entrada esperada: booleano de inativo/ativo;
- saída esperada: marcador textual simples;
- por que é puro: apenas converte estado em texto;
- por que não depende de DOM: pode retornar string;
- por que não depende de `requestJson`/`fetch`: nenhuma rede;
- risco de integração futura: baixo.

### 7. Montar label textual simples de convênio

- entrada esperada: item simples com nome e código;
- saída esperada: label curta para grade ou lookup;
- por que é puro: concatenação/seleção de campos;
- por que não depende de DOM: recebe objeto e devolve string;
- por que não depende de `requestJson`/`fetch`: não faz consulta;
- risco de integração futura: baixo.

### 8. Montar label textual simples de plano

- entrada esperada: item com nome e cobertura;
- saída esperada: label curta;
- por que é puro: só transforma campos;
- por que não depende de DOM: sem interface;
- por que não depende de `requestJson`/`fetch`: sem rede;
- risco de integração futura: baixo.

### 9. Normalizar cobertura / carência somente se textual

- entrada esperada: texto de cobertura;
- saída esperada: texto aparado e padronizado;
- por que é puro: só trata string;
- por que não depende de DOM: não toca tela;
- por que não depende de `requestJson`/`fetch`: não consulta API;
- risco de integração futura: médio, porque cobertura pode virar regra de negócio mais sensível.

## 20. O que não deve ser movido cedo

Por segurança, não devem ser movidos agora:

- abertura principal;
- criação de UI;
- `requestJson` / `fetch`;
- renderização;
- seleção de linha;
- `bindStandardGridActivation`;
- binds de duplo clique;
- modais;
- salvar;
- excluir;
- integrações com backend;
- integrações com outros cadastros;
- vínculos entre convênios e planos;
- calendário de faturamento.

## 21. Recomendação para a próxima etapa

Recomendação objetiva: seguir para a Subetapa 1.

Sugestão conservadora:

- criar `frontend/js/modules/convenios-planos.js` ou nome equivalente conservador;
- expor `window.BranaConveniosPlanosModule`;
- incluir `meta`, `getInfo()` e `getStatus()`;
- manter status passivo;
- `ativo: false`;
- `controlaFluxo: false`;
- sem DOM;
- sem `fetch` / `requestJson`;
- sem eventos;
- sem controle de fluxo;
- carregar no `frontend/index.html` antes de `frontend/app.js`.

## 22. Resumo final

O módulo de Convênios e Planos está hoje concentrado no `app.js`, com:

- painel próprio;
- duas grades principais;
- modais próprios para convênio, plano e calendário;
- consumo por outros fluxos, principalmente ficha do paciente;
- risco real de clique duplo em tabela dinâmica;
- dependência de dados auxiliares de materiais para composição de opções.

A fronteira está clara o bastante para uma próxima etapa passiva, mas ainda não é prudente mover abertura, renderização, modais ou salvamento para fora do monólito.
