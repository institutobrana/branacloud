# Materiais - Subetapa 2 - Fronteiras e contratos

## 1. Objetivo da Subetapa 2

Esta etapa e exclusivamente documental.

Confirmacoes centrais:

- `frontend/app.js` permanece como fonte funcional da verdade;
- `frontend/js/modules/materiais.js` continua passivo;
- nenhuma logica funcional foi movida;
- nenhum comportamento foi alterado;
- nenhum helper novo foi criado.

## 2. Estado atual apos a Subetapa 1

Estado confirmado antes desta documentacao:

- namespace criado: `window.BranaMateriaisModule`;
- carregamento incluido no `frontend/index.html` antes de `frontend/app.js`;
- `ativo: false`;
- `controlaFluxo: false`;
- sem DOM;
- sem eventos;
- sem `requestJson`/`fetch`;
- sem integracao funcional;
- sem controle de modal, grade, selecao ou salvamento.

O arquivo `frontend/js/modules/materiais.js` existe apenas como fronteira passiva e contrato documental.

## 3. Fronteira funcional do modulo Materiais

### Pertence claramente ao modulo Materiais

- painel principal de materiais;
- lista de materiais por tabela/lista;
- filtros de classificacao;
- busca textual;
- grade/tabela de materiais;
- selecao de linha;
- abertura por clique na toolbar/menu;
- modal principal de cadastro/edicao;
- modal auxiliar de tabela/lista;
- carregar combos auxiliares de classificacao, unidade, fabricante e apresentacao;
- salvar material;
- excluir material;
- criar/alterar/excluir tabela de materiais;
- calculo de custo tecnico a partir de preco e relacao.

### E dependencia externa, nao fronteira propria

- `requestJson` e `fetch`;
- endpoints do backend;
- auxiliar de tipos, unidades, fabricantes e apresentacao;
- `ensurePanelChrome` e `ensureModalChrome`;
- `hideAllPanels` e o shell global;
- `workspaceEmpty` e `footerMsg`;
- `esc`, `formatDec2`, `formatDec2Dot`, `parseMaterialNumber`;
- integracoes com Procedimentos e Procedimentos Genericos;
- contratos de `window` do monolito.

### Nao deve entrar na modularizacao inicial

- salvar;
- excluir;
- criar/alterar/excluir tabela;
- qualquer `requestJson`/`fetch`;
- qualquer endpoint;
- qualquer payload;
- qualquer calculo numerico sensivel;
- qualquer renderizacao de grade;
- qualquer bind de eventos;
- qualquer contrato de modal;
- qualquer integracao com Procedimentos ou Procedimentos Genericos.

## 4. Contratos DOM

### Elementos principais do painel

- `#btn-open-materiais`
- `#materiais-panel`
- `#materiais-cbo-listas`
- `#materiais-cbo-classificacao`
- `#materiais-btn-nova-tabela`
- `#materiais-btn-altera-tabela`
- `#materiais-btn-excluir-tabela`
- `#materiais-btn-fechar`
- `#materiais-btn-novo`
- `#materiais-btn-editar`
- `#materiais-btn-excluir`
- `#materiais-txt-pesquisar`
- `#materiais-tbody`
- `#materiais-total`

### Elementos do modal principal

- `#materiais-modal-backdrop`
- `#materiais-modal-title`
- `#materiais-modal-tab-principal-btn`
- `#materiais-modal-tab-detalhes-btn`
- `#materiais-modal-tab-principal`
- `#materiais-modal-tab-detalhes`
- `#materiais-modal-codigo`
- `#materiais-modal-nome`
- `#materiais-modal-preco`
- `#materiais-modal-relacao`
- `#materiais-modal-custo`
- `#materiais-modal-classificacao`
- `#materiais-modal-und-compra`
- `#materiais-modal-und-consumo`
- `#materiais-modal-validade`
- `#materiais-modal-preferido`
- `#materiais-modal-fabricante`
- `#materiais-modal-apresentacao`
- `#materiais-modal-observacao`
- `#materiais-modal-cancelar`
- `#materiais-modal-gravar`

### Elementos do modal de tabela

- `#materiais-tabela-modal-backdrop`
- `#materiais-tabela-modal-title`
- `#materiais-tabela-modal-label`
- `#materiais-tabela-modal-nome`
- `#materiais-tabela-modal-indice`
- `#materiais-tabela-modal-ok`
- `#materiais-tabela-modal-cancelar`
- `#materiais-tabela-modal-close`
- `.materiais-tabela-hotkey`

### Classes relevantes

- `.materiais-btn`
- `.materiais-panel`
- `.materiais-lista-select`
- `.materiais-top-group`
- `.materiais-top-actions`
- `.materiais-action-row`
- `.materiais-divider`
- `.materiais-filters`
- `.materiais-head`
- `.materiais-table-wrap`
- `.materiais-table`
- `.materiais-modal-stack`
- `.materiais-modal-top`
- `.materiais-modal-name`
- `.materiais-modal-line`
- `.materiais-modal-form-row`
- `.materiais-modal-detail`
- `.materiais-modal-preferido`
- `.materiais-tabela-modal-body`
- `.materiais-tabela-modal-frame`
- `.materiais-tabela-modal-grid`

### Campos obrigatorios e sensiveis

- `#materiais-modal-codigo`
- `#materiais-modal-nome`
- `#materiais-modal-preco`
- `#materiais-modal-relacao`
- `#materiais-modal-custo`
- `#materiais-modal-validade`
- `#materiais-modal-classificacao`
- `#materiais-modal-und-compra`
- `#materiais-modal-und-consumo`
- `#materiais-modal-fabricante`
- `#materiais-modal-apresentacao`
- `#materiais-modal-observacao`

### Elementos que nao devem ser tocados cedo

- `#materiais-modal-backdrop`
- `#materiais-tabela-modal-backdrop`
- `#materiais-tbody`
- `#materiais-cbo-listas`
- `#materiais-cbo-classificacao`
- `#materiais-modal-tab-principal-btn`
- `#materiais-modal-tab-detalhes-btn`
- qualquer botao de salvar, excluir ou fechar

## 5. Contratos de eventos

### Clique simples

- abrir Materiais pela toolbar;
- fechar painel;
- novo material;
- editar material;
- excluir material;
- criar tabela;
- alterar tabela;
- excluir tabela;
- salvar modal principal;
- cancelar modal principal;
- salvar modal de tabela;
- cancelar modal de tabela.

### Duplo clique

- duplo clique na linha da grade reabre o material em edicao.

### Binds diretos

- `m.btnOpen.addEventListener("click",abrirMateriais)`
- `m.btnFechar.addEventListener("click",()=>showMateriaisPanel(false))`
- `m.cboListas.addEventListener("change",materiaisCarregar)`
- `m.cboClassificacao.addEventListener("change",materiaisCarregar)`
- `m.txtPesquisar.addEventListener("input",materiaisCarregar)`
- `m.btnNovaTabela.addEventListener("click",materiaisCriarTabela)`
- `m.btnAlteraTabela.addEventListener("click",materiaisAlterarTabela)`
- `m.btnExcluirTabela.addEventListener("click",materiaisExcluirTabela)`
- `m.btnNovo.addEventListener("click",()=>materiaisAbrirModal(null))`
- `m.btnEditar.addEventListener("click",...)`
- `m.btnExcluir.addEventListener("click",materiaisExcluirSelecionado)`
- `m.btnModalCancelar.addEventListener("click",materiaisFecharModal)`
- `m.btnModalGravar.addEventListener("click",materiaisSalvarModal)`
- `m.tabBtnPrincipal.addEventListener("click",...)`
- `m.tabBtnDetalhes.addEventListener("click",...)`
- `m.txtPreco.addEventListener("input",materiaisCalcularCustoModal)`
- `m.txtRelacao.addEventListener("input",materiaisCalcularCustoModal)`
- `m.tbody.addEventListener("click",...)`
- `m.tbody.addEventListener("dblclick",...)`
- `materiaisTabelaModal.btnOk.addEventListener("click",materiaisTabelaSalvarModal)`
- `materiaisTabelaModal.btnCancelar.addEventListener("click",materiaisTabelaFecharModal)`
- `materiaisTabelaModal.btnClose.addEventListener("click",materiaisTabelaFecharModal)`
- `materiaisTabelaModal.backdrop.addEventListener("click",...)`
- `materiaisTabelaModal.hotkeys.forEach(...keydown...)`

### Binds indiretos e helpers genericos

- o bloco nao usa `bindStandardGridActivation()` na grade principal;
- a selecao e o duplo clique sao tratados manualmente;
- `closeModalByBackdropId()` conhece os dois backdrops do modulo;
- `ensurePanelChrome()` e `ensureModalChrome()` continuam sendo helpers globais de infraestrutura.

### Pontos onde alteracao pode quebrar selecao ou modal

- `m.tbody` e a logica de clique/duplo clique;
- `materiaisSelecionar(id)`;
- `materiaisSelecionadoAtual()`;
- `materiaisAbrirModal(item)`;
- `materiaisFecharModal()`;
- `materiaisTabelaAbrirModal(modo)`;
- `materiaisTabelaFecharModal()`;
- `materiaisSetModalTab(tab)`.

## 6. Contratos de dados e estado

### Variaveis globais relacionadas

- `materiaisCache`
- `materialSelecionadoId`
- `materialModalId`
- `materiaisAuxTiposCache`
- `materiaisAuxUndsCache`
- `materiaisListasCache`
- `materiaisIndicesCache`
- `materiaisTabelaModalModo`
- `materiaisTabelaModalListaId`

### Estado de lista atual

- `materiaisListaIdAtual()`
- `materiaisListaAtual()`

### Estado de material selecionado

- `materialSelecionadoId`
- `materiaisSelecionadoAtual()`
- `materiaisSelecionar(id)`

### Estado de cache

- `materiaisCache` para materiais da lista;
- `materiaisListasCache` para tabelas/listas;
- `materiaisIndicesCache` para indices do modal de tabela;
- `materiaisAuxTiposCache` para tipos/classificacao;
- `materiaisAuxUndsCache` para unidades auxiliares.

### Estado de modal

- `materialModalId`
- `materiaisTabelaModalModo`
- `materiaisTabelaModalListaId`

### Estado de filtros

- `materiaisFiltroClassificacaoAtual()`
- `m.txtPesquisar.value`
- `m.cboClassificacao.value`
- `m.cboListas.value`

### Estado de classificacao, preferido, unidades e indices

- `m.cboModalClassificacao`
- `m.chkModalPreferido`
- `m.cboModalUndCompra`
- `m.cboModalUndConsumo`
- `materiaisIndicesCache`
- `materiaisAuxTiposCache`
- `materiaisAuxUndsCache`

### Acoplamento com `window` e variaveis do app.js

- `window.BranaMateriaisModule` existe apenas como namespace passivo;
- `workspaceEmpty` e `footerMsg` continuam sendo globais do monolito;
- `requestJson`, `hideAllPanels`, `ensurePanelChrome`, `ensureModalChrome`, `esc` e helpers numericos continuam vindos do `app.js`;
- nao ha leitura ou escrita de `localStorage`/`sessionStorage` pelo namespace passivo.

## 7. Contratos de endpoints

### Cadastro de auxiliares

- `GET /cadastros/auxiliares?tipo=Tipos de material`
- metodo: `GET`
- finalidade: carregar classificacao para lista e modal
- origem: `materiaisCarregarAuxTipo()` e `materiaisCarregarFiltroClassificacao()`
- resposta esperada: lista de descricoes/itens auxiliares
- risco: dependencia externa para combos e filtragem

- `GET /cadastros/auxiliares?tipo=Unidades de medida`
- metodo: `GET`
- finalidade: carregar unidades de compra e consumo
- origem: `materiaisCarregarCombosModal()`
- resposta esperada: lista de unidades
- risco: dependencia de cadastro auxiliar e de strings exibidas

- `GET /cadastros/auxiliares?tipo=Fabricantes`
- metodo: `GET`
- finalidade: carregar fabricantes no modal
- origem: `materiaisCarregarCombosModal()`
- resposta esperada: lista de fabricantes
- risco: dependencia de cadastro auxiliar

- `GET /cadastros/auxiliares?tipo=Tipos de apresentação`
- metodo: `GET`
- finalidade: carregar apresentacoes no modal
- origem: `materiaisCarregarCombosModal()`
- resposta esperada: lista de apresentacoes
- risco: dependencia de cadastro auxiliar

### Indices

- `GET /materiais/indices`
- metodo: `GET`
- finalidade: carregar indices da tabela de materiais
- origem: `materiaisCarregarIndicesTabela()`
- resposta esperada: lista de indices
- risco: influencia o modal de tabela e o indice da lista

### Listas / tabelas de materiais

- `GET /materiais/listas`
- metodo: `GET`
- finalidade: carregar as listas/tabelas de materiais
- origem: `materiaisCarregarListas()`
- resposta esperada: array de listas
- risco: define a tabela atual e habilita a listagem

- `POST /materiais/listas`
- metodo: `POST`
- finalidade: criar nova tabela/lista de materiais
- origem: `materiaisTabelaSalvarModal()`
- payload: `nome`, `nro_indice`
- resposta esperada: objeto com `id` da lista criada
- risco: cria nova tabela e altera o estado do seletor

- `PATCH /materiais/listas/{listaId}`
- metodo: `PATCH`
- finalidade: alterar tabela/lista existente
- origem: `materiaisTabelaSalvarModal()`
- payload: `nome`, `nro_indice`
- resposta esperada: objeto com `id` atualizado
- risco: altera a tabela ativa e pode impactar materiais associados

- `DELETE /materiais/listas/{listaId}`
- metodo: `DELETE`
- finalidade: excluir tabela/lista de materiais
- origem: `materiaisExcluirTabela()`
- payload: nenhum
- resposta esperada: confirmacao de exclusao
- risco: alto, pois a confirmacao informa que os materiais da tabela serao excluidos

### Materiais

- `GET /materiais?lista_id=...&q=...&classificacao=...`
- metodo: `GET`
- finalidade: listar materiais por tabela, busca e classificacao
- origem: `materiaisCarregar()`
- resposta esperada: array de materiais
- risco: alto, porque alimenta a grade principal

- `GET /materiais/listas/{listaId}/proximo-codigo`
- metodo: `GET`
- finalidade: gerar proximo codigo de material
- origem: `materiaisNovoCodigo()`
- resposta esperada: objeto com `codigo`
- risco: medio, porque afeta preenchimento automatizado

- `POST /materiais`
- metodo: `POST`
- finalidade: criar material
- origem: `materiaisSalvarModal()`
- payload: material completo
- resposta esperada: objeto com `id`
- risco: alto, porque grava cadastro principal

- `PUT /materiais/{id}`
- metodo: `PUT`
- finalidade: atualizar material
- origem: `materiaisSalvarModal()`
- payload: material completo
- resposta esperada: objeto com dados atualizados
- risco: alto, porque altera cadastro principal

- `DELETE /materiais/{id}`
- metodo: `DELETE`
- finalidade: excluir material
- origem: `materiaisExcluirSelecionado()`
- payload: nenhum
- resposta esperada: confirmacao de exclusao
- risco: alto, porque remove registro da lista

## 8. Contratos de payload

### Material

- `codigo`
  - tipo aparente: texto numerico curto
  - risco: medio
  - observacao: preenchido por texto, nao por inteiro puro

- `nome`
  - tipo aparente: texto
  - risco: alto, por ser campo visivel e obrigatorio

- `preco`
  - tipo aparente: numero decimal
  - risco: alto
  - observacao: usado em calculo e exibicao

- `relacao`
  - tipo aparente: numero decimal
  - risco: alto
  - observacao: divisor do custo tecnico

- `custo`
  - tipo aparente: numero decimal
  - risco: alto
  - observacao: derivado de calculo

- `lista_id`
  - tipo aparente: inteiro identificador
  - risco: alto
  - observacao: vincula o material a uma tabela

- `unidade_compra`
  - tipo aparente: texto de combo
  - risco: medio
  - observacao: depende de auxiliar

- `unidade_consumo`
  - tipo aparente: texto de combo
  - risco: medio
  - observacao: depende de auxiliar

- `validade_dias`
  - tipo aparente: inteiro
  - risco: medio
  - observacao: conversao via `parseInt`

- `preferido`
  - tipo aparente: booleano
  - risco: medio
  - observacao: vem de checkbox

- `classificacao`
  - tipo aparente: texto de combo
  - risco: medio
  - observacao: depende do cadastro auxiliar

### Tabela / lista

- `nome`
  - tipo aparente: texto
  - risco: alto, por ser o nome da tabela

- `nro_indice`
  - tipo aparente: numero inteiro / texto numerico
  - risco: alto
  - observacao: selecionado via combo do modal

### Campos com risco numerico

- `preco`
- `relacao`
- `custo`
- `validade_dias`
- `nro_indice`

### Campos com risco textual/mojibake

- `nome`
- `classificacao`
- `unidade_compra`
- `unidade_consumo`
- `fabricante`
- `apresentacao`
- observacoes do modal

Nenhuma string foi corrigida nesta etapa.

## 9. Contratos numericos e monetarios

### Leitura, parse e exibicao

- `parseMaterialNumber(v)` le texto numerico e transforma em numero;
- `formatDec2(v)` exibe numero com duas casas no padrao `pt-BR`;
- `formatDec2Dot(v)` exibe numero com duas casas usando ponto decimal;
- `materiaisCalcularCustoModal()` calcula `preco / relacao` e grava o resultado em `#materiais-modal-custo`;
- `materiaisSalvarModal()` faz parse de `preco`, `relacao` e `custo` antes de montar o payload.

### Riscos com virgula e ponto

- entrada com virgula pode ser convertida de forma simplificada;
- entrada com ponto pode ser interpretada como decimal;
- separadores milhar podem quebrar parsing;
- custo pode variar de forma indevida se a relacao for zero ou invalida.

### Riscos com separador decimal brasileiro

- o fluxo mistura `pt-BR` na exibicao com parsing simples na leitura;
- o usuario pode ver virgula e o backend pode receber ponto;
- qualquer divergencia entre exibicao e parse pode gerar custo incorreto.

### Riscos de multiplicacao e divisao indevida

- custo tecnico e obtido por divisao;
- integracoes externas podem multiplicar custo por quantidade;
- uma relacao zero ou invalida derruba o calculo;
- valores podem explodir se a relacao estiver invertida ou vazia.

### Funcoes que nao devem ser movidas cedo

- `materiaisCalcularCustoModal()`
- `materiaisSalvarModal()`
- `materiaisTabelaSalvarModal()`
- `parseMaterialNumber(v)`
- `formatDec2(v)`
- `formatDec2Dot(v)`

## 10. Dependencias com outros modulos

### Procedimentos

- usa listas de materiais;
- usa custo do material em vinculos;
- usa quantidade vinculada;
- grava e altera vinculos por codigo;
- risco alto de regressao se Materiais mudar cedo.

### Procedimentos Genericos

- carrega listas de materiais;
- busca materiais por lista e classificacao;
- persiste materiais vinculados;
- depende do custo e da quantidade;
- risco alto de regressao se Materiais mudar cedo.

### Unidades

- consome `materiaisCarregarAuxTipo("Tipos de logradouro")`;
- dependencia compartilhada de auxiliares;
- risco baixo a medio, mas documentado.

### Auxiliares / Tabelas auxiliares

- fornece tipos de material;
- fornece unidades de medida;
- fornece fabricantes;
- fornece tipos de apresentacao;
- dependencia externa central do modulo.

### Financeiro

- nao ha endpoint financeiro direto no bloco Materiais;
- a relacao e indireta, por custo/preco;
- risco conceitual, nao integracao funcional direta.

### Cenario financeiro

- nao ha integracao direta observada;
- a relacao e indireta, por custo/preco;
- risco conceitual.

### Estoque

- nao identifiquei integracao direta no recorte analisado;
- se existir, nao apareceu como contrato ativo desta etapa.

### Outros modulos

- `Materiais` depende estruturalmente de `app.js`;
- `Materiais` e consumido por `Procedimentos` e `Procedimentos Genericos`;
- `Materiais` compartilha o padrao de scaffold com outros modulos do monolito.

## 11. Fronteiras de risco

### Baixo risco

- `materiaisUniqueAuxDescricoes(arr)`, como candidato documental futuro;
- metadados do namespace passivo;
- lista documental de dependencias;
- lista documental de riscos.

### Medio risco

- `formatDec2(v)`;
- `formatDec2Dot(v)`;
- `materiaisSetSelectValue(el,val)`, porque mexe no DOM;
- `materiaisNovoCodigo(listaId)`, porque consulta endpoint de apoio;
- `materiaisCarregarIndicesTabela(prefer)`, por depender de fallback e combo.

### Alto risco

- `parseMaterialNumber(v)`;
- `materiaisCarregarListas(preferId)`;
- `materiaisCarregar()`;
- `materiaisAbrirModal(item)`;
- `materiaisSalvarModal()`;
- `materiaisExcluirSelecionado()`;
- `materiaisTabelaAbrirModal(modo)`;
- `materiaisTabelaSalvarModal()`;
- `materiaisExcluirTabela()`;
- qualquer renderizacao de grade;
- qualquer bind de eventos;
- qualquer endpoint de escrita;
- qualquer payload.

### Classificacao por tipo

- helpers puros: baixo a medio, com excecao de parse numerico;
- DOM: medio a alto;
- eventos: alto;
- payload: alto;
- endpoints: alto;
- calculos: alto;
- renderizacao: alto;
- integracao externa: alto.

## 12. Helpers candidatos para Subetapa 3

### Reavaliacao dos candidatos

- `materiaisUniqueAuxDescricoes(arr)`
  - pode entrar como helper puro passivo;
  - baixo risco;
  - nao usa DOM, eventos ou backend;
  - ainda assim deve ser extraido apenas se houver necessidade real.

- `formatDec2(v)`
  - nao deve entrar por enquanto;
  - risco medio por tocar a exibicao numerica da grade;
  - depende do contrato visual de custo/preco.

- `formatDec2Dot(v)`
  - nao deve entrar por enquanto;
  - risco medio a alto porque alimenta o custo tecnicamente sensivel;
  - influencia leitura visual de valores monetarios.

- `parseMaterialNumber(v)`
  - nao deve entrar por enquanto;
  - risco alto;
  - e o ponto mais sensivel do contrato numerico do modulo.

- `materiaisSetSelectValue(el,val)`
  - nao deve entrar por enquanto;
  - apesar de util, depende de DOM;
  - portanto nao e helper puro.

### Recomendacao conservadora para a Subetapa 3

- se houver extracao inicial, limitar a um unico helper documentalmente seguro: `materiaisUniqueAuxDescricoes(arr)`;
- se preferir ainda mais conservadorismo, fazer nova pausa documental antes de mover qualquer helper;
- nao recomendar integracao funcional ainda.

## 13. O que nao mover na Subetapa 3

- salvar material;
- excluir material;
- criar/alterar/excluir tabela;
- `requestJson`/`fetch`;
- endpoints;
- payloads;
- DOM;
- eventos;
- modal;
- renderizacao;
- selecao de linha;
- calculo de custo/preco/relacao;
- parse numerico sensivel;
- integracao com Procedimentos;
- integracao com Procedimentos Genericos.

## 14. Riscos preservados

- regressao no painel principal;
- regressao no modal principal;
- regressao no modal de tabela;
- regressao em selecao de linha e duplo clique;
- regressao em custo tecnico;
- regressao em payloads numericos;
- regressao em integrações com Procedimentos e Procedimentos Genericos;
- risco textual/mojibake preservado sem correcoes;
- risco de endpoints e backend preservado.

## 15. Checks executados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

## 16. Onde testar

Como esta etapa e apenas documental, nao ha teste funcional novo no navegador.

Orientacao:

- revisar o documento criado;
- confirmar se os contratos e fronteiras do modulo Materiais estao coerentes;
- nao testar fluxo funcional novo, pois nenhum comportamento deveria ter sido alterado.

## 17. Confirmacao final

- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules/materiais.js` nao foi alterado;
- backend, banco e endpoints nao foram alterados;
- a blindagem textual/mojibake foi respeitada;
- nenhum texto, acento, mojibake, label, mensagem, placeholder ou string visivel foi alterado.

