# Materiais - Mapa de extracao de funcoes apos consolidacao dos vinculos

## 1. Titulo

Mapa tecnico de extracao de funcoes do modulo Materiais apos a consolidacao do fluxo de vinculos entre Materiais, Procedimentos Genericos e Intervencoes / Procedimentos.

## 2. Objetivo

Inventariar as funcoes e blocos relevantes de Materiais para decidir, com risco controlado, o que pode ser extraido primeiro de `frontend/app.js` para `frontend/js/modules/materiais.js`.

## 3. Diretorio real

`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 4. Confirmacao de que e etapa documental, sem alteracao funcional

Esta etapa e somente documental. Nenhum codigo funcional foi alterado.

## 5. Escopo

- classificar funcoes e blocos de Materiais por risco;
- identificar dependencias de DOM, estado global, request, backend, modais, calculos e vinculos;
- apontar o que ja esta no namespace passivo;
- indicar candidatos seguros para a proxima subetapa funcional, se existirem;
- registrar o que deve permanecer no `app.js` por enquanto.

## 6. Fora de escopo

- modularizar agora;
- mover helpers agora;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules/materiais.js`;
- alterar backend, banco, endpoints, schema, migrations ou CSS;
- corrigir textos, labels, acentos ou mojibake;
- executar Git ou rodar servidor.

## 7. Documentos analisados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`

## 8. Arquivos consultados somente em leitura

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 9. Estado atual da modularizacao de Materiais

A modularizacao de Materiais esta em estado intermediario:

- existe um namespace passivo em `frontend/js/modules/materiais.js`;
- existe um helper puro exposto pelo namespace;
- `frontend/app.js` ainda concentra a maior parte do fluxo funcional e das chamadas operacionais de Materiais;
- o backend de vinculos foi centralizado em `backend/services/vinculos_materiais.py`;
- a fronteira funcional ja esta documentada e validada manualmente.

## 10. Lista de funcoes/grupos ainda no `frontend/app.js`

### 10.1 Funcoes e blocos de listagem / selecao / tabela

- `materiaisListaIdAtual`
- `materiaisListaAtual`
- `materiaisSetTotal`
- `materiaisSelecionar`
- `materiaisSelecionadoAtual`
- `materiaisLimparTabela`
- `materiaisRender`
- `materiaisFiltroClassificacaoAtual`

### 10.2 Funcoes e blocos de suporte DOM

- `materiaisSetSelectValue`
- binds de eventos da tela de Materiais
- inicializacao da tela de Materiais

### 10.3 Funcoes de carregamento assíncrono

- `materiaisCarregarAuxTipo`
- `materiaisCarregarFiltroClassificacao`
- `materiaisCarregarCombosModal`
- `materiaisCarregarIndicesTabela`
- `materiaisCarregarListas`
- `materiaisCarregar`
- `materiaisNovoCodigo`

### 10.4 Funcoes de modal

- `materiaisSetModalTab`
- `materiaisAbrir`
- `materiaisFecharModal`
- `materiaisAbrirModal`
- `materiaisSalvarModal`
- `materiaisTabelaFecharModal`
- `materiaisTabelaAtualNome`
- `materiaisTabelaAtualIndice`
- `materiaisTabelaAbrirModal`
- `materiaisTabelaSalvarModal`
- `materiaisCriarTabela`
- `materiaisAlterarTabela`
- `materiaisExcluirTabela`
- `materiaisExcluirSelecionado`

### 10.5 Funcoes de calculo

- `materiaisCalcularCustoModal`

### 10.6 Funcoes / trechos de integracao com request e backend

- `requestJson`
- possiveis usos globais de `apiFetch`, quando presentes em outros fluxos do monolito
- fluxos que montam payloads e chamam backend via Materiais

### 10.7 Funcoes e blocos relacionados a vinculos e Procedimentos

- `procAplicarDadosEditor`
- `procSalvar`
- `procAbrirEditor`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procCarregarMateriaisGenericoDetalhe`
- `procRenderLinks`
- `procRecarregarLinks`
- `procClonarItemVinculado`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `procMateriaisGenericoBaseId`
- `procMateriaisGenericoVisualId`
- `procMateriaisGenericoRenderSeq`
- `procMateriaisGenericoCache`
- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`

## 11. Lista de itens ja existentes em `frontend/js/modules/materiais.js`

- `meta`
- `nome`
- `modulo`
- `versaoSubetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `descricao`
- `riscosPreservados`
- `dependenciasDocumentais`
- `helpersCandidatosFuturos`
- `materiaisUniqueAuxDescricoes(arr)`
- `helpers.materiaisUniqueAuxDescricoes`
- `getInfo()`
- `info()`

## 12. Classificacao por categoria

### 12.1 Helper puro

**Baixo risco**

- `materiaisUniqueAuxDescricoes(arr)` em `frontend/js/modules/materiais.js`

Motivo:

- recebe array;
- retorna array novo;
- nao acessa DOM;
- nao usa request;
- nao altera estado global;
- nao toca em vínculos;
- nao faz calculo numerico.

### 12.2 Helper com dependencia leve

**Medio risco**

- `materiaisSetSelectValue`
- `materiaisListaIdAtual`
- `materiaisListaAtual`
- `materiaisFiltroClassificacaoAtual`
- `materiaisSetTotal`
- `materiaisSelecionar`
- `materiaisSelecionadoAtual`
- `materiaisLimparTabela`

Motivo:

- leem ou alteram DOM ou estado local;
- nao salvam por si sós;
- podem afetar visualizacao e selecao.

### 12.3 Renderizacao

**Medio risco**

- `materiaisRender`

Motivo:

- reescreve grade;
- depende de estado carregado;
- altera visualizacao, mas nao persiste sozinha.

### 12.4 Listagem / filtro

**Medio risco**

- `materiaisCarregarFiltroClassificacao`
- `materiaisCarregarListas`
- `materiaisCarregar`

Motivo:

- dependem de DOM e estado global;
- usam backend indiretamente;
- afetam visualizacao da tela de Materiais.

### 12.5 Carregamento assíncrono / request

**Alto risco**

- `materiaisCarregarAuxTipo`
- `materiaisCarregarCombosModal`
- `materiaisCarregarIndicesTabela`
- `materiaisCarregarListas`
- `materiaisCarregar`
- `materiaisNovoCodigo`
- `requestJson`

Motivo:

- chamam backend direta ou indiretamente;
- podem afetar listas e payloads;
- alguns alimentam modais e estruturas de dados.

### 12.6 Modal

**Alto risco**

- `materiaisSetModalTab`
- `materiaisAbrir`
- `materiaisFecharModal`
- `materiaisAbrirModal`
- `materiaisSalvarModal`
- `materiaisTabelaFecharModal`
- `materiaisTabelaAtualNome`
- `materiaisTabelaAtualIndice`
- `materiaisTabelaAbrirModal`
- `materiaisTabelaSalvarModal`
- `materiaisCriarTabela`
- `materiaisAlterarTabela`
- `materiaisExcluirTabela`
- `materiaisExcluirSelecionado`

Motivo:

- mexem com estado de modal;
- salvam ou excluem dados;
- podem alterar backend;
- interagem com validacoes e mensagens.

### 12.7 Calculo

**Alto risco**

- `materiaisCalcularCustoModal`

Motivo:

- mexe com preco, relacao e custo;
- altera o valor visual derivado;
- qualquer ajuste precisa de regressao financeira.

### 12.8 Tabelas auxiliares

**Medio a alto risco**

- `materiaisCarregarIndicesTabela`
- `materiaisTabelaAtualNome`
- `materiaisTabelaAtualIndice`

Motivo:

- ligadas a modal/tabela auxiliar;
- podem afetar selecao e persistencia de tabelas de materiais.

### 12.9 Bind / eventos

**Alto risco**

- binds de Materiais na inicializacao do `app.js`

Motivo:

- controlam comportamento da tela inteira;
- podem disparar requests, modal, renderizacao e salvamento.

### 12.10 Fluxo sensivel

**Alto risco**

- `procAplicarDadosEditor`
- `procSalvar`
- `procAbrirEditor`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procCarregarMateriaisGenericoDetalhe`
- `procRenderLinks`
- `procRecarregarLinks`
- `procClonarItemVinculado`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `procMateriaisGenericoBaseId`
- `procMateriaisGenericoVisualId`
- `procMateriaisGenericoRenderSeq`
- `procMateriaisGenericoCache`
- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`

Motivo:

- conversam com Procedimentos Genericos e Intervencoes / Procedimentos;
- dependem de origem/herdado;
- podem afetar o checklist de regressao;
- podem contaminar ou limpar lista errada se extraidos sem contrato.

## 13. Classificacao de risco

- **Baixo risco:** helper puro independente, sem DOM, sem request, sem estado global.
- **Medio risco:** DOM, renderizacao, listagem, filtro, selecao, suporte visual.
- **Alto risco:** request, modal, calculo financeiro, salvar, excluir, vinculos, origem/herdado, Procedimentos Genericos, Intervencoes / Procedimentos, snapshot e cache.
- **Nao extrair agora:** qualquer coisa acoplada a vinculos, origem/herdado, salvar, modal de edicao, troca de generico ou lista composta.

## 14. Dependencias de cada grupo

### 14.1 DOM

- `materiaisSetSelectValue`
- `materiaisSetTotal`
- `materiaisSelecionar`
- `materiaisLimparTabela`
- `materiaisRender`
- `materiaisCarregarFiltroClassificacao`
- `materiaisCarregarCombosModal`
- `materiaisCarregarIndicesTabela`
- `materiaisCarregarListas`
- `materiaisCarregar`
- todas as funcoes de modal e bind

### 14.2 Estado global

- `materiaisListaIdAtual`
- `materiaisListaAtual`
- `materiaisSelecionadoAtual`
- `materiaisCarregar`
- `materiaisAbrir`
- `materiaisSalvarModal`
- `procEditorSnapshot`
- `procMateriaisGenericoBaseId`
- `procMateriaisGenericoVisualId`
- `procMateriaisGenericoRenderSeq`
- `procMateriaisGenericoCache`

### 14.3 requestJson / apiFetch

- `materiaisCarregarAuxTipo`
- `materiaisCarregarCombosModal`
- `materiaisCarregarIndicesTabela`
- `materiaisCarregarListas`
- `materiaisCarregar`
- `materiaisNovoCodigo`
- `materiaisSalvarModal`
- `materiaisExcluirSelecionado`
- `materiaisTabelaSalvarModal`
- `procCarregarMateriaisGenericoDetalhe`
- `procSalvar`
- `procAbrirEditor`
- `procRecarregarLinks`

Observacao:

- `apiFetch` nao foi localizado como funcao material-especifica no recorte examinado; se aparecer em outro ponto do monolito, deve ser tratado como dependencia global de request e nao como candidato puro.

### 14.4 Backend

- `requestJson` como camada de acesso
- `materiaisSalvarModal`
- `materiaisExcluirSelecionado`
- `materiaisTabelaSalvarModal`
- `procSalvar`
- `procAbrirEditor`

### 14.5 Vinculos de materiais

- `procRenderLinks`
- `procRecarregarLinks`
- `procComporMateriaisEditorPorGenerico`
- `procAtualizarMateriaisEditorVisualizacao`
- `procCarregarMateriaisGenericoDetalhe`
- `procClonarItemVinculado`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `backend/services/vinculos_materiais.py`

### 14.6 Origem / herdado

- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `backend/services/vinculos_materiais.py`
- `procComporMateriaisEditorPorGenerico`
- `procAtualizarMateriaisEditorVisualizacao`

### 14.7 Procedimentos Genericos

- `procAplicarDadosEditor`
- `procSalvar`
- `procAbrirEditor`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procCarregarMateriaisGenericoDetalhe`
- `procRenderLinks`
- `procRecarregarLinks`

### 14.8 Intervencoes / Procedimentos

- `procAplicarDadosEditor`
- `procSalvar`
- `procAbrirEditor`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procRenderLinks`
- `procRecarregarLinks`
- `procEditorSnapshot`

## 15. Candidatos seguros para proxima extracao

O unico candidato claramente seguro e ja validado em subetapas anteriores e:

- `materiaisUniqueAuxDescricoes(arr)` como helper puro e passivo do namespace de Materiais.

Se houver nova extracao funcional, ela precisa continuar neste padrao:

- pequena;
- reversivel;
- sem DOM;
- sem request;
- sem salvar;
- sem mudar visual;
- sem tocar em vinculos;
- sem tocar em origem/herdado.

## 16. Candidatos que devem permanecer no `app.js`

Devem permanecer no `app.js` por enquanto:

- todo o fluxo de modal de Materiais;
- todo o carregamento assíncrono;
- todo o salvamento;
- toda exclusao;
- toda a logica de tabela auxiliar;
- toda a composicao de vinculos;
- toda a recomposicao de Procedimentos Genericos;
- todo o fluxo que depende de origem/herdado ou snapshot;
- toda parte que conversa com Intervencoes / Procedimentos.

## 17. Justificativa tecnica

A fronteira funcional de Materiais ainda nao e madura para extracoes maiores sem risco. Os trechos sensiveis envolvem:

- requests;
- persistencia;
- modais;
- calculos financeiros;
- vinculacao entre materiais e procedimentos;
- recomposicao por origem/herdado.

Isso torna inadequado mover qualquer bloco amplo antes de uma confirmacao de risco muito baixa.

## 18. Protecoes do contrato funcional

- nao remover `origem`
- nao remover `herdado`
- nao voltar a depender somente de heuristica por comparacao estrutural
- nao usar lista visual anterior como fonte da verdade
- nao manter herdados antigos ao trocar Generico
- nao interpretar lista vazia como "manter anterior"
- nao copiar material proprio/local entre Intervencoes ou para o Generico
- nao criar autosave na troca da combo
- nao alterar `backend/services/vinculos_materiais.py` sem revisar o contrato
- nao alterar `frontend/app.js` nesse fluxo sem checklist
- nao alterar Materiais sem testar Procedimentos Genericos e Intervencoes
- nao misturar correcao textual/mojibake com regra funcional

## 19. Checklist obrigatorio a rodar depois da futura subetapa funcional

Referenciar e repetir o checklist consolidado em:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`

### Minimo exigido antes de validar uma futura extracao funcional

1. Abrir Materiais.
2. Abrir Procedimentos Genericos.
3. Abrir Intervencoes / Procedimentos.
4. Testar troca de Generico A para B.
5. Testar troca para Generico sem materiais.
6. Testar nao contaminacao entre Intervencoes.
7. Testar duplo clique/modal.
8. Testar console sem erro novo.

## 20. Proxima subetapa recomendada

Recomenda-se manter a proxima subetapa como ainda documental, a menos que o objetivo seja extrair um helper puro ja isolado e comprovadamente sem dependencia funcional.

Se houver decisao por fase funcional, o passo mais seguro e apenas consolidar outro helper puro e pequeno, mantendo o resto em `app.js`.

## 21. Arquivos que a proxima subetapa funcional podera alterar

Somente se houver ordem explicita e checklist completo:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

## 22. Arquivos que a proxima subetapa funcional nao podera alterar

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- banco, schema, migrations, CSS e endpoints novos

## 23. Checks recomendados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 24. Onde testar antes da proxima alteracao

- Abrir Materiais.
- Abrir Procedimentos Genericos.
- Abrir Intervencoes / Procedimentos.
- Confirmar que a troca de Generico continua correta.
- Confirmar que generico sem materiais produz lista herdada vazia.
- Confirmar que nao ha contaminacao entre intervencoes.
- Confirmar que o duplo clique continua abrindo o modal completo.
- Confirmar console sem erro novo.

## 25. Onde testar depois da proxima alteracao

- Repetir o checklist de regressao completo registrado em `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`.

## 26. Confirmacao sobre Git

O Git deve continuar aguardando ate a conclusao e validacao da proxima subetapa funcional, salvo ordem explicita do usuario.

