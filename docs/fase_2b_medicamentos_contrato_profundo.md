# Fase 2B - Medicamentos - Contrato profundo do primeiro recorte medio controlado

## 1. Identificacao da etapa

- Fase 2B.
- Medicamentos.
- Frente comum/core transversal.
- Contrato profundo.
- Etapa exclusivamente documental.
- Sem implementacao.

## 2. Historico e contexto

- `Preferências` foi pausada apos dois recortes validados.
- `Prestadores` foi pausado apos um recorte validado.
- `Convênios e Planos` foi pausado apos um recorte validado e corrigido pontualmente quando necessario.
- A nova matriz comparativa recomendou `Medicamentos`.
- `Medicamentos` deve entrar com cautela por ser transversal e sensivel.
- Se houver futura implementacao, ela devera ser pequena, visual/local e precedida deste contrato.

## 3. Mapa das funcoes atuais no `app.js`

### Funcoes visuais/localmente seguras

- `medicamentosRender()`
- `medicamentosSelecionarLinha(tr)`

### Funcoes de renderizacao

- `medicamentosRender()`

### Funcoes de modal

- `medicamentosEnsureUI()`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosAplicarTab(tab)`
- `medicamentosFecharModal()`
- `medicamentosAbrirModal(modo)`

### Funcoes de listagem

- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosAbrir()`

### Funcoes de filtros/busca

- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`

### Funcoes de selecao

- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`

### Funcoes de validacao

- `medicamentosSalvarModal()` usando `window.BranaMedicamentosModule.helpers.validarNomeMedicamento`

### Funcoes de eventos

- `medicamentosVincularEventos()`

### Funcoes que chamam `requestJson`

- `medicamentosCarregarFiltrosGrupo()` -> `GET /medicamentos/opcoes/grupos`
- `medicamentosCarregarLista()` -> `GET /medicamentos?...`
- `medicamentosCarregarCombosModal()` -> `GET /medicamentos/opcoes/grupos`, `GET /medicamentos/opcoes/apresentacoes`, `GET /medicamentos/opcoes/usos`
- `medicamentosAbrirModal(modo)` -> `GET /medicamentos/{id}` quando edita
- `medicamentosSalvarModal()` -> `POST /medicamentos` ou `PUT /medicamentos/{id}`
- `medicamentosExcluirSelecionado()` -> `DELETE /medicamentos/{id}`
- `medicamentosExcluirNoModal()` -> `DELETE /medicamentos/{id}`

### Funcoes que montam payload

- `medicamentosPayloadModal()`

### Funcoes que salvam

- `medicamentosSalvarModal()`

### Funcoes que excluem

- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`

### Funcoes relacionadas ao Assistente de receitas

- `editorTextosAssistRenderMenuMedicamentosAlfabeto()`
- `editorTextosAssistRenderMenuMedicamentosTabela()`
- `editorTextosAssistAplicarFiltrosMenuMedicamentos()`
- `editorTextosAssistFecharMenuMedicamentos()`
- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistConfirmarMenuMedicamentos()`
- `editorTextosAssistAplicarMedicamentoSelecionado()`
- `editorTextosAssistMontarItemAtual()`
- `editorTextosAssistAtualizarAcoes()`

### Funcoes relacionadas ao editor de texto

- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistConfirmarMenuMedicamentos()`
- `editorTextosAssistMontarTextoItens()`
- `editorTextosAssistCapturarConteudoBase()`

### Funcoes relacionadas a documento gerado

- `editorTextosAssistMontarTextoItens()`
- `editorTextosAssistCapturarConteudoBase()`

### Funcoes relacionadas a receitas/receituario

- `editorTextosAssistMontarItemAtual()`
- `editorTextosAssistAplicarMedicamentoSelecionado()`
- `editorTextosAssistMontarTextoItens()`

### Funcoes relacionadas a atendimento/paciente

- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistMontarTextoItens()`
- `editorTextosAssistCapturarConteudoBase()`

### Funcoes que dependem de backend/endpoints

- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosAbrirModal(modo)`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `editorTextosAssistAbrirMenuMedicamentos()`

### Funcoes que dependem de permissoes

- `medicamentosAbrir()`
- `medicamentosAbrirModal(modo)`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `editorTextosAssistAbrirMenuMedicamentos()`

### Areas proibidas para Fase 2B

- todo fluxo de salvar/excluir;
- todo fluxo do Assistente de receitas;
- todo fluxo do editor de texto;
- todo fluxo de documento gerado;
- todo fluxo de receitas/receituario;
- todo fluxo de pacientes e atendimentos;
- todo fluxo de backend/API.

## 4. Mapa de modulos existentes

### `frontend/js/modules/medicamentos.js`

- Exporta namespace passivo `window.BranaMedicamentosModule`.
- Exporta `meta`, `helpers`, `getStatus()` e `info()`.
- Helpers existentes:
  - `normalizarTextoMedicamento`
  - `validarNomeMedicamento`
  - `validarGrupoMedicamento`
  - `compararTextoMedicamento`
- E um modulo passivo.
- Ja e usado pelo `app.js` para validacao de nome em `medicamentosSalvarModal()`.
- Pode receber helpers futuros sem criar novo modulo, mas o bloqueio funcional atual e alto.
- Nao ha indicacao de que criar outro modulo seja melhor do que reaproveitar este, caso um futuro contrato muito restrito seja aprovado.

### `frontend/js/modules/editor_textos_bootstrap.js`

- Nao e um modulo de Medicamentos, mas consome Medicamentos no assistente de receitas.
- Nao expõe namespace dedicado a Medicamentos.
- Ja e usado pelo `app.js` como fluxo adjacente e sensivel.
- E melhor tratar como consumidor existente do ecossistema, nao como alvo de extracao de Medicamentos.

### `frontend/js/modules/auxiliares.js`

- Nao e modulo de Medicamentos, mas contem apoio de classificacao para `grupo_medicamento`.
- Nao expõe namespace de Medicamentos.
- E apenas consumidor/apoio adjacente.

## 5. Mapa de DOM

### DOM visual/local

- `#medicamentos-panel`
- `#medic-total`
- `#medic-tbody`

### DOM de tabela/lista

- `#medic-tbody`
- `#medic-total`

### DOM de formulario/modal

- `#medicamentos-modal-backdrop`
- `#medic-modal-title`
- `#medic-tab-principal`
- `#medic-tab-detalhes`
- `#medic-modal-nome`
- `#medic-modal-grupo`
- `#medic-modal-descricao`
- `#medic-modal-apresentacao`
- `#medic-modal-uso`
- `#medic-modal-pos-adulto`
- `#medic-modal-qtd-adulto`
- `#medic-modal-pos-crianca`
- `#medic-modal-qtd-crianca`
- `#medic-modal-preferido`
- `#medic-modal-lab`
- `#medic-modal-observacoes`
- `#medic-modal-advertencias`

### DOM de filtros/busca

- `#medic-cbo-grupo`
- `#medic-txt-nome`

### DOM de botoes

- `#medic-btn-novo`
- `#medic-btn-editar`
- `#medic-btn-excluir`
- `#medic-btn-fechar`
- `#medic-tab-principal-btn`
- `#medic-tab-detalhes-btn`
- `#medic-modal-eliminar`
- `#medic-modal-ok`
- `#medic-modal-cancelar`

### DOM de assistente

- `#editor-textos-assist-medicamento`
- `#editor-textos-assist-medicamento-btn`
- `#editor-textos-assist-med-menu-backdrop`
- `#editor-textos-assist-med-menu-alpha`
- `#editor-textos-assist-med-menu-tbody`
- `#editor-textos-assist-med-menu-filtro`
- `#editor-textos-assist-med-menu-q`

### DOM de editor/receita/documento

- `#editor-textos-assist-medicamento`
- `#editor-textos-assist-medicamento-btn`
- `#editor-textos-assist-...` componentes do assistente ligados a prescricao, quantidade, uso e observacoes

### DOM que dispara eventos

- linhas do `tbody` de Medicamentos
- filtros de grupo e nome
- botoes de abrir/editar/excluir/fechar
- tabs principal/detalhes
- botoes do modal
- elementos do assistente de receitas

### DOM que participa de `requestJson`

- os mesmos filtros, lista e modal acima, pois definem o fluxo de carga e persistencia

### DOM que participa de payload/salvamento

- campos do modal principal e do modal de assistente

### DOM que participa de exclusao

- botao principal de excluir
- botao eliminar no modal

### DOM sensivel/proibido

- tudo ligado ao Assistente de receitas
- tudo ligado ao editor de textos
- tudo ligado a documento gerado
- tudo ligado a receitas/receituario
- tudo ligado a pacientes/atendimentos

## 6. Mapa de eventos

### Eventos apenas visuais

- renderizacao da lista
- realce da linha selecionada
- abertura/fechamento visual do modal

### Eventos de selecao

- clique em linha do `tbody`
- selecao do medicamento no assistente

### Eventos de abertura/fechamento de modal

- `medicamentosAbrirModal(modo)`
- `medicamentosFecharModal()`
- botao fechar do painel
- clique no backdrop do modal

### Eventos de filtros/busca

- `change` em grupo
- `input` em nome com debounce
- filtros do assistente por grupo, nome e alfa

### Eventos de carregamento/listagem

- abertura do painel
- retorno do `requestJson` de lista e combos

### Eventos do Assistente de receitas

- abrir menu
- filtrar alfabeto
- confirmar selecao
- atualizar acoes

### Eventos do editor/receituario/documento

- abrir assistente
- confirmar item
- atualizar item atual

### Eventos que disparam `requestJson`

- abrir painel
- abrir modal de edicao
- filtrar lista
- salvar
- excluir
- abrir assistente

### Eventos que salvam

- `medicamentosSalvarModal()`

### Eventos que excluem

- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`

### Eventos que podem impactar pacientes, atendimentos ou documentos

- confirmacao do assistente de receitas
- aplicacao do medicamento no editor
- montagem do texto gerado

### Eventos proibidos para o primeiro recorte medio

- salvar
- excluir
- abrir assistente
- aplicar no editor
- qualquer coisa que altere receituario/documento gerado

## 7. Mapa de `requestJson` / payload / salvamento / exclusao

### Chamadas `requestJson` relacionadas a Medicamentos

- `medicamentosCarregarFiltrosGrupo()` -> `GET /medicamentos/opcoes/grupos`
- `medicamentosCarregarLista()` -> `GET /medicamentos?...`
- `medicamentosCarregarCombosModal()` -> `GET /medicamentos/opcoes/grupos`, `GET /medicamentos/opcoes/apresentacoes`, `GET /medicamentos/opcoes/usos`
- `medicamentosAbrirModal(modo)` -> `GET /medicamentos/{id}`
- `medicamentosSalvarModal()` -> `POST /medicamentos` ou `PUT /medicamentos/{id}`
- `medicamentosExcluirSelecionado()` -> `DELETE /medicamentos/{id}`
- `medicamentosExcluirNoModal()` -> `DELETE /medicamentos/{id}`
- `editorTextosAssistAbrirMenuMedicamentos()` -> `GET /editor-textos/assistente-receitas/medicamentos?limit=1000`

### Payload

- `medicamentosPayloadModal()`

### Salvamento

- `medicamentosSalvarModal()`

### Exclusao

- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`

### Risco

- alto para qualquer extracao funcional adicional porque os fluxos sao backend-driven e se conectam ao editor/receitas e ao assistente.

## 8. Mapa de backend / endpoints / permissoes / impactos transversais

- Endpoints backend:
  - `/medicamentos`
  - `/medicamentos/{id}`
  - `/medicamentos/opcoes/grupos`
  - `/medicamentos/opcoes/apresentacoes`
  - `/medicamentos/opcoes/usos`
  - `/editor-textos/assistente-receitas/medicamentos`
- Permissoes:
  - o bloco permanece ligado ao fluxo de permissao do modulo e do editor; nao foi alterado nesta etapa.
- Clinica:
  - o fluxo e contextualmente dependente da clinica ativa.
- Pacientes:
  - o assistente de receitas e o editor podem tocar contexto de paciente.
- Atendimentos:
  - podem ser afetados pelo fluxo do editor e do receituario.
- Receituario:
  - ha integracao direta no assistente de receitas.
- Editor de texto:
  - dependencia direta.
- Documentos gerados:
  - dependencia direta via assistente.
- Procedimentos:
  - impacto indireto possivel, mas nao alvo deste contrato.
- Prescricoes:
  - impacto direto via assistente.
- Historico clinico:
  - impacto indireto pelo contexto de atendimento e receituario.

## 9. Partes proibidas para Fase 2B

- backend;
- banco;
- endpoints;
- permissoes;
- `requestJson`;
- payload efetivo;
- salvamento;
- exclusao;
- criacao/edicao real de medicamento;
- regras de validacao critica;
- Assistente de receitas;
- editor de texto;
- documento gerado;
- receituario;
- receitas;
- prescricoes;
- vinculacao com pacientes;
- vinculacao com atendimentos;
- vinculacao com historico clinico;
- correcoes textuais;
- labels/placeholders/mensagens;
- mojibake.

## 10. Recortes medios possiveis

### Candidato 1: lista principal e contador

- Descricao: extrair a montagem visual da lista principal e do contador para um helper passivo.
- Funcoes envolvidas: `medicamentosRender()`, `medicamentosSelecionarLinha(tr)`.
- DOM envolvido: `#medic-tbody`, `#medic-total`.
- Eventos envolvidos: clique em linha e re-render apos carga/filtro.
- Toca `requestJson`: sim, pois depende de `medicamentosCarregarLista()`.
- Toca payload: nao diretamente.
- Toca salvamento: nao diretamente, mas fica acoplado ao fluxo geral.
- Toca exclusao: nao diretamente, mas fica acoplado ao fluxo geral.
- Toca backend/endpoints: indiretamente, pela lista backend-driven.
- Toca permissoes: indiretamente.
- Toca Assistente de receitas: nao diretamente, mas a lista e o modulo dividem estado e contexto.
- Toca editor/documento gerado: nao diretamente.
- Toca pacientes/atendimentos: nao diretamente.
- Risco: medio/alto.
- Ganho esperado: medio.
- Teste manual possivel: lista, contador e selecao visual.
- Rollback mental: devolver renderizacao para `app.js`.
- Decisao: rejeitado, porque a superficie ainda depende de carga backend, selecao, modal e estado compartilhado.

### Candidato 2: comboboxes e tab do modal

- Descricao: extrair a montagem visual dos combos do modal e a alternancia de tabs.
- Funcoes envolvidas: `medicamentosCarregarCombosModal()`, `medicamentosSetSelectOptions(select,itens,placeholder)`, `medicamentosAplicarTab(tab)`, `medicamentosLimparModal()`, `medicamentosAplicarModalDados(item)`.
- DOM envolvido: campos do modal principal e tabs.
- Eventos envolvidos: abertura de modal e clique nas tabs.
- Toca `requestJson`: sim.
- Toca payload: indiretamente sim, via modal.
- Toca salvamento: indiretamente sim.
- Toca exclusao: indiretamente sim.
- Toca backend/endpoints: sim.
- Toca permissoes: sim.
- Toca Assistente de receitas: nao diretamente.
- Toca editor/documento gerado: nao diretamente.
- Toca pacientes/atendimentos: nao diretamente.
- Risco: alto.
- Ganho esperado: baixo/medio.
- Teste manual possivel: abrir modal e alternar tabs.
- Rollback mental: retornar a montagem dos combos e tabs para o bloco atual.
- Decisao: rejeitado.

### Candidato 3: helper textual `compararTextoMedicamento`

- Descricao: mover ou reutilizar a comparacao textual como helper puro para algum isolamento futuro.
- Funcoes envolvidas: `window.BranaMedicamentosModule.helpers.compararTextoMedicamento`.
- DOM envolvido: nenhum isolado com seguranca clara.
- Eventos envolvidos: busca do assistente de receitas e filtros correlatos.
- Toca `requestJson`: nao diretamente, mas depende de um fluxo backend-driven de busca/assistente.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca exclusao: nao.
- Toca backend/endpoints: indiretamente, pois o consumo real atual esta ligado ao assistente de receitas.
- Toca permissoes: indiretamente.
- Toca Assistente de receitas: sim.
- Toca editor/documento gerado: sim, por dependencias do assistente.
- Toca pacientes/atendimentos: sim, por contexto clinico.
- Risco: alto.
- Ganho esperado: baixo, porque nao existe consumidor local claro para um recorte medio controlado.
- Teste manual possivel: reduzido e indireto.
- Rollback mental: manter o helper no modulo passivo.
- Decisao: rejeitado.

## 11. Recomendacao

- Nao existe recorte medio controlado suficientemente seguro para Medicamentos agora.
- `Medicamentos` deve ser pausado nesta rodada.
- A proxima etapa deve ser nova matriz comparativa documental ou a escolha de outra frente.
- Nao deve haver implementacao direta sem novo contrato.
- O ciclo atual nao mostrou um recorte visual/local isolado com fronteira limpa suficiente para manter fora Assistente de receitas, editor, documento gerado, receituario, pacientes e atendimentos.

## 12. Teste manual previsto

- Nao ha implementacao recomendada para testar agora.
- Se uma futura matriz liberar um recorte realmente seguro, o teste deve começar em `Cadastro > Medicamentos`.
- O teste futuro devera validar apenas o comportamento visual/local explicitamente contratado.
- Nao devera testar salvar nem exclusao nesta rodada futura, salvo novo contrato.
- Devera confirmar ausencia de impacto no Assistente de receitas, no editor/documento gerado e em pacientes/atendimentos.

## 13. Risco residual e rollback mental

- Riscos principais:
  - quebra silenciosa do assistente de receitas;
  - alteracao de busca backend-driven;
  - regressao em validacao textual;
  - impacto indireto no editor/documento gerado;
  - impacto em pacientes e atendimentos.
- Como perceber quebra:
  - listas, combos ou modal deixam de carregar corretamente;
  - busca do assistente passa a devolver resultados errados;
  - validacao do nome ou grupo muda de comportamento;
  - o fluxo de receitas deixa de preencher a prescricao.
- Como comparar com comportamento anterior:
  - abrir Medicamentos e o Assistente de receitas antes/depois;
  - verificar se os mesmos dados aparecem e se o menu continua funcional.
- Rollback mental:
  - manter o bloco inteiro como esta;
  - nao extrair nenhuma parte adicional sem novo contrato;
  - se houver futura tentativa, retornar qualquer helper local para o bloco original.
- Porque deve ser rejeitado:
  - a superficie funcional continua grande;
  - os vinculos com assistente, editor e documento gerado deixam a separacao insegura.

## 14. Registro para roadmap

- A criacao do contrato profundo de `Medicamentos` foi registrada.
- Nao houve implementacao.
- A frente foi classificada como `comum/core transversal`.
- Os candidatos avaliados foram insuficientes para liberar um recorte medio controlado realmente seguro.
- A recomendacao foi nao implementar agora e voltar para nova matriz comparativa ou outra frente.
- Os limites da Fase 2B continuam vigentes.
- O teste manual previsto foi registrado somente para uma futura decisao, nao para esta rodada.
- `requestJson`, payload, salvamento, exclusao, backend, permissoes, Assistente de receitas, editor, documento gerado, receituario, pacientes e atendimentos seguem fora do escopo.
- A blindagem textual/mojibake foi respeitada.
