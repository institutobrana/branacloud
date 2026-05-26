# Fase 2B - Ficha pessoal - Contrato profundo do primeiro recorte medio controlado

## 1. Identificacao da etapa
- Fase 2B.
- `Ficha pessoal`.
- Frente comum/core transversal.
- Contrato profundo.
- Etapa exclusivamente documental.
- Sem implementacao.

## 2. Historico e contexto
- `Preferencias`, `Prestadores` e `Convênios e Planos` foram pausados apos recortes validados.
- `Medicamentos` foi pausado sem implementacao apos contrato profundo, por falta de recorte medio suficientemente seguro nesta rodada.
- A nova matriz comparativa pos-Medicamentos recomendou `Ficha pessoal`.
- `Ficha pessoal` deve entrar com cautela por ser transversal, clinica-central e sensivel.
- Qualquer implementacao futura precisaria ser pequena, visual/local e precedida deste contrato.

## 3. Mapa das funcoes atuais no app.js
### Funcoes visuais/localmente seguras
- `fichaEnsureUI()`
- `fichaSetTab(tab)`
- `fichaSetSelectValue(el,val)`
- `fichaIsoToInput(value)`
- `fichaInputToApi(value)`
- `fichaDateBr(value)`
- `fichaAtualizarIdade()`
- `fichaSetSelectOptions(selectEl,values,placeholder)`
- `fichaSetUfOptions(selectEl,valorPreferido)`

### Funcoes de renderizacao / selecao / lista
- `fichaMenuPacRender()`
- `fichaMenuPacSelecionarLinha(tr)`
- `fichaAnamneseRender()`
- `fichaAnamneseSelecionar(id)`
- `fichaAbrirNovo()`
- `fichaAbrirExistente()`
- `fichaFecharPaciente()`
- `fichaMenuPacAplicarLayout()`

### Funcoes de modal / abas / eventos
- `fichaFechar()`
- `fichaMenuPacEnsureUI()`
- `fichaMenuPacAbrir(prefill,opts)`
- `fichaMenuPacFechar(reason)`
- `fichaMenuPacConfirmar()`
- `fichaMenuPacLimpar()`
- `fichaFotoEnsureUI()`
- `fichaFotoAbrirMenu()`
- `fichaFotoAbrirStream(deviceId)`
- `fichaFotoCapturarAtual()`
- `fichaFotoFecharCaptura()`
- `fichaFotoStopStream()`
- `fichaFotoAtualizarDispositivos()`
- `fichaFotoAplicar(dataUrl,nome)`
- `fichaFotoImportarArquivo(file)`

### Funcoes que chamam requestJson / montam payload / salvam / excluem
- `fichaCarregarPacientePorId(id,quiet)`
- `fichaAbrirPorCodigo(codigo,quiet)`
- `fichaSalvarPaciente()`
- `fichaNavegarPaciente(sentido,quiet)`
- `fichaExcluirPaciente()`
- `fichaMenuPacCarregarPreferencias()`
- `fichaMenuPacSalvarPreferencias(parcial)`
- `fichaMenuPacCarregarOptions()`
- `fichaMenuPacPesquisar()`
- `fichaAnamneseCarregar()`
- `fichaAnamneseSalvarSelecionada()`

### Funcoes relacionadas a pacientes / dados pessoais / convenios / contatos / anamnese / historico / atendimento / documentos / agenda / financeiro
- `fichaAplicarPaciente(item)`
- `fichaPayloadAtual()`
- `fichaCarregarCombos()`
- `fichaLimparNovo()`
- `fichaAtalhoCodigoKeydown(ev)`
- `fichaAtalhoCodigoBlur()`
- `fichaProcurarPaciente()`
- `fichaMenuPacPesquisar()`
- `fichaMenuPacCarregarOptions()`
- `fichaMenuPacAplicarLayout()`
- `fichaMenuPacConfirmar()`
- `fichaMenuPacAbrir(prefill,opts)`
- `fichaAnamnesePodeImprimir()`
- `fichaAnamneseImprimir()`
- `fichaAnamneseCarregar()`
- `fichaAnamneseSalvarSelecionada()`
- `fichaAplicarPaciente()` e os fluxos ligados a `fichaAnamneseCarregar()` por encaixe posterior

### Areas proibidas para Fase 2B
- CRUD real de paciente.
- Dados pessoais sensiveis.
- Responsaveis/contatos.
- Convenio/plano do paciente.
- Anamnese.
- Historico clinico.
- Documentos.
- Atendimento.
- Agenda.
- Financeiro.
- Odontograma.
- Procedimentos.
- Backend, payload efetivo, requestJson, salvamento, exclusao e permissoes.

## 4. Mapa de modulos existentes
- Nao foi identificado modulo dedicado em `frontend/js/modules` para `Ficha pessoal`.
- Os modulos mais proximos encontrados sao:
  - `frontend/js/modules/anamnese.js`
  - `frontend/js/modules/editor_textos_bootstrap.js`
  - `frontend/js/modules/auxiliares.js`
- Esses modulos atuam como adjacentes/consumidores de fluxo, nao como um modulo passivo isolado de `Ficha pessoal`.
- Neste momento nao ha base clara para reaproveitar um modulo dedicado existente sem tocar areas sensiveis.

## 5. Mapa de DOM
- DOM visual/local: painel principal de `Ficha pessoal`, titulo, barra de status, botoes gerais.
- DOM de lista/menu: `#ficha-menu-tbody`, `#ficha-menu-total`, tabela do menu de pacientes.
- DOM de formulario/modal: campos principais do cadastro, blocos de foto e modal do menu de pacientes.
- DOM de abas: abas de dados, complementares, anotacoes, anamnese e historico.
- DOM de filtros/busca: campos e selects do menu de pacientes.
- DOM de dados pessoais: codigo, nome, nascimento, CPF, RG, sexo, estado civil, endereco, cidade, UF e contatos.
- DOM de contatos/responsaveis: indicacao, telefones e botoes de WhatsApp.
- DOM de convenio: selects e campos ligados a convenio/plano/tabela.
- DOM de anamnese/historico: listas, resposta, alerta e botoes de acao.
- DOM de documentos: pontos de integracao com assistente/editor e fluxos de impressao.
- DOM que dispara eventos: botoes, tabs, selects, campos de codigo, campo de nascimento, foto e menu de pacientes.
- DOM que participa de requestJson/payload/salvamento/exclusao: areas de carga, gravacao, exclusao, menu de preferencias e anamnese.
- DOM sensivel/proibido: tudo que altera dados clinicos, historicos, documentos, atendimento, agenda, financeiro ou permissao.

## 6. Mapa de eventos
- Eventos apenas visuais: troca de abas, foco de campos, abertura/fechamento de modal.
- Eventos de selecao: linha do menu de pacientes, item de anamnese, selecao de convenio/plano e foto.
- Eventos de abertura/fechamento: `fichaFechar()`, `fichaMenuPacAbrir()`, `fichaMenuPacFechar()`, `fichaFotoEnsureUI()` e fluxos de captura.
- Eventos de abas: `fichaSetTab()` e listeners associados.
- Eventos de filtros/busca: pesquisa do menu de pacientes, cirurgiao, status, visualizacao e ordenacao alfa.
- Eventos de carregamento/listagem: abertura de paciente, busca por codigo e carregamento de anamnese.
- Eventos de dados pessoais: blur/change de CPF, nascimento, nome e campos basicos.
- Eventos de contatos/responsaveis: indicacao, botoes de WhatsApp e campos auxiliares.
- Eventos de convenio: change de convenio para atualizar planos.
- Eventos de anamnese/historico: click em linha, blur da resposta e acao de atualizar/imprimir.
- Eventos de documentos: acao no assistente/editor ligada ao paciente atual.
- Eventos que disparam requestJson: busca de paciente, menu, preferencias, anamnese e navegação.
- Eventos que salvam: gravacao do paciente, preferencias do menu e resposta de anamnese.
- Eventos que excluem: exclusao do paciente.
- Eventos que podem impactar pacientes, atendimentos, agenda, financeiro ou documentos: praticamente toda a area principal de `Ficha pessoal`.
- Eventos proibidos para o primeiro recorte medio: tudo que encoste em save/delete, dados clinicos, anamnese, historico, documentos, agenda ou financeiro.

## 7. Mapa de requestJson / payload / salvamento / exclusao
- `fichaCarregarPacientePorId()` -> `GET /cadastros/pacientes/{id}`.
- `fichaAbrirPorCodigo()` -> `GET /cadastros/pacientes/por-codigo/{cod}`.
- `fichaSalvarPaciente()` -> `POST` ou `PUT /cadastros/pacientes` com `fichaPayloadAtual()`.
- `fichaNavegarPaciente()` -> `GET /cadastros/pacientes/navegar?...`.
- `fichaExcluirPaciente()` -> `DELETE /cadastros/pacientes/{fichaPacienteAtualId}`.
- `fichaMenuPacCarregarPreferencias()` -> `GET /cadastros/pacientes/menu-preferences`.
- `fichaMenuPacSalvarPreferencias()` -> `PATCH /cadastros/pacientes/menu-preferences`.
- `fichaMenuPacCarregarOptions()` -> `GET /cadastros/pacientes/menu-options`.
- `fichaMenuPacPesquisar()` -> `GET /cadastros/pacientes/menu?...` e, no modo contato, `GET /agenda-contatos?limit=5000`.
- `fichaAnamneseCarregar()` -> `GET /anamnese/pacientes/{fichaPacienteAtualId}/respostas`.
- `fichaAnamneseSalvarSelecionada()` -> `PUT /anamnese/pacientes/{fichaPacienteAtualId}/respostas`.
- `requestJson`, payload, salvamento e exclusao continuam fora do escopo de qualquer recorte medio agora.

## 8. Mapa de backend / endpoints / permissoes / impactos transversais
- Endpoints backend: pacientes, menu, menu-preferences, navegaçao e anamnese.
- Permissoes: ha risco de dependencias de acesso e visibilidade por perfil.
- Clinica/pacientes: dependencia direta e central.
- Responsaveis/contatos: dependencia direta no menu e campos auxiliares.
- Convenios: dependencia direta no formulario.
- Agenda: dependencia indireta e sensivel.
- Financeiro: dependencia indireta e sensivel.
- Atendimentos: dependencia indireta via anamnese e historico.
- Anamnese/historico clinico: dependencia direta.
- Documentos: dependencia indireta via assistente/editor e impressao.
- Odontograma/procedimentos: potenciais impactos indiretos e riscos de acoplamento.
- Nenhuma alteracao foi feita nesta etapa.

## 9. Partes proibidas para Fase 2B
- backend
- banco
- endpoints
- permissoes
- `requestJson`
- payload efetivo
- salvamento
- exclusao
- criacao/edicao real de paciente
- criacao/edicao real de dados pessoais
- criacao/edicao real de responsaveis/contatos
- alteracao de convenio/plano do paciente
- regras de validacao critica
- anamnese
- historico clinico
- atendimento
- documentos
- agenda
- financeiro
- odontograma
- procedimentos
- correcoes textuais
- labels/placeholders/mensagens
- mojibake

## 10. Recortes medios possiveis
### Candidato 1: lista/menu de pacientes
- Descricao: extrair montagem visual da lista do menu de pacientes.
- Funcoes envolvidas: `fichaMenuPacRender()`, `fichaMenuPacSelecionarLinha()`.
- DOM: `#ficha-menu-tbody`, `#ficha-menu-total`.
- Eventos: clique e duplo clique em linhas.
- Toca requestJson: nao diretamente, mas depende de `fichaMenuPacPesquisar()`.
- Toca payload/salvamento/exclusao: nao diretamente, mas depende do fluxo completo.
- Toca backend/endpoints: sim, por dependencia de listagem.
- Toca permissoes: potencialmente sim.
- Toca pacientes/dados reais: sim, e de forma central.
- Toca anamnese/historico/documentos/agenda/financeiro: pode acoplar por fluxo.
- Risco: alto.
- Ganho esperado: medio.
- Teste manual: claro.
- Rollback mental: simples.
- Decisao: rejeitado.

### Candidato 2: abas e formulario principal
- Descricao: separar composicao visual das abas e campos principais.
- Funcoes envolvidas: `fichaSetTab()`, `fichaEnsureUI()`, `fichaAplicarPaciente()`.
- DOM: abas, formulario, blocos de dados pessoais e contatos.
- Eventos: clique em abas, change/blur de campos.
- Toca requestJson/payload/salvamento/exclusao: indiretamente sim, pois faz parte do fluxo de cadastro.
- Toca backend/endpoints: sim, por ser parte do carregamento e gravacao.
- Toca permissoes: possivel.
- Toca pacientes/dados reais: sim.
- Toca anamnese/historico/documentos/agenda/financeiro: muito provavel.
- Risco: muito alto.
- Ganho esperado: medio.
- Teste manual: claro, mas amplo demais.
- Rollback mental: medio.
- Decisao: rejeitado.

### Candidato 3: helper de normalizacao de selects e datas
- Descricao: isolar helper puro de conversao/normalizacao de valores de campos.
- Funcoes envolvidas: `fichaSetSelectValue()`, `fichaIsoToInput()`, `fichaInputToApi()`, `fichaDateBr()`, `fichaSetSelectOptions()`, `fichaSetUfOptions()`.
- DOM: varios campos, mas de forma auxiliar.
- Eventos: nao diretamente.
- Toca requestJson/payload/salvamento/exclusao: nao diretamente, mas serve ao fluxo completo.
- Toca backend/endpoints: nao diretamente.
- Toca permissoes: nao diretamente.
- Toca pacientes/dados reais: sim, porque formata dados reais.
- Toca anamnese/historico/documentos/agenda/financeiro: nao diretamente.
- Risco: medio-alto, pois mexe na espinha dorsal do formulario.
- Ganho esperado: baixo-medio.
- Teste manual: razoavel.
- Rollback mental: medio.
- Decisao: rejeitado.

### Candidato 4: foto/WhatsApp
- Descricao: extrair partes visuais da foto e botoes auxiliares de telefone.
- Funcoes envolvidas: `fichaFoto*` e `fichaAbrirWhatsAppComTelefone()`.
- DOM: foto, botoes de camera/importacao e contato.
- Eventos: click/change/capture.
- Toca requestJson/payload/salvamento/exclusao: nao diretamente.
- Toca backend/endpoints: nao diretamente.
- Toca permissoes: nao diretamente.
- Toca pacientes/dados reais: sim, por usar dados do cadastro.
- Toca anamnese/historico/documentos/agenda/financeiro: possivel via fluxo do paciente.
- Risco: medio.
- Ganho esperado: baixo.
- Teste manual: claro.
- Rollback mental: simples.
- Decisao: rejeitado por nao entregar ganho suficiente nesta rodada.

## 11. Recomendacao de um unico recorte
- Nao existe recorte medio controlado suficientemente seguro para `Ficha pessoal` nesta rodada.
- A superficie e grande, clinica-central e muito acoplada a paciente, dados pessoais, anamnese, historico, documentos, agenda e financeiro.
- Recomendacao: `Ficha pessoal` deve ficar pausada por enquanto e a proxima decisao deve ser uma nova matriz comparativa ou a escolha de outra frente.
- Nao ha implementacao direta recomendada.

## 12. Teste manual previsto
- Nao ha implementacao nova para testar agora.
- Se uma futura matriz liberar um recorte realmente seguro, o teste deve comecar em `Ficha pessoal` e validar apenas o comportamento visual/local contratado.
- O teste futuro nao deve incluir salvar, exclusao, anamnese, historico, documentos, agenda ou financeiro.
- Deve ser confirmado que nao houve impacto em pacientes, dados reais, convenio/plano do paciente, atendimentos ou permissoes.

## 13. Risco residual e rollback mental
- Riscos principais: quebra silenciosa de pacientes, dados pessoais, anamnese, historico, documentos, agenda, financeiro, preferencias de menu e fluxo de atendimento.
- Como perceber quebra: lista/menu, tabs, campos, filtros ou integracoes ficarem diferentes.
- Como comparar com comportamento anterior: reabrir `Ficha pessoal`, navegar pelos mesmos passos e observar se o formulario e os fluxos sensiveis permanecem identicos.
- Rollback mental: manter `Ficha pessoal` sem extração adicional e nao mover nenhuma parte do fluxo para helpers/modulos sem novo contrato.
- O recorte, neste momento, deve ser rejeitado por excesso de risco.

## 14. Registro para roadmap
- O contrato profundo de `Ficha pessoal` foi criado como etapa exclusivamente documental.
- Nenhuma implementacao foi feita.
- A classificacao da frente permanece como comum/core transversal.
- Os candidatos avaliados nao liberaram um recorte medio suficientemente seguro.
- A recomendacao registrada e pausar `Ficha pessoal` e abrir nova matriz comparativa ou escolher outra frente.
- Os limites da Fase 2B permanecem vigentes.
- `requestJson`, payload, salvamento, exclusao, backend, permissoes, pacientes, anamnese, historico, documentos, atendimento, agenda e financeiro continuam fora do escopo.
- A blindagem textual/mojibake foi respeitada.
