# Intervenções / Procedimentos - Subetapa 0 documental

## 1. Estado inicial do Git

- Branch atual: `modularizacao-segura-fase-1`
- Último commit consolidado: `a18cb48 - Conclui modularizacao segura parcial de materiais`
- `git status --short` no início da etapa: `46` arquivos untracked, todos já existentes e fora deste trabalho
- `git diff --stat`: sem diferenças no tree versionado
- `git diff --cached --stat`: sem arquivos staged

Observação de blindagem operacional: este documento foi criado depois da leitura do status inicial. O estado acima registra a fotografia documental do começo da subetapa, antes da própria criação deste arquivo.

## 2. Identificação funcional

- Nome funcional da tela: `Configurações > Tabelas > Intervenções / Procedimentos...`
- Caminho provável no sistema: painel de configuração de tabela de preços/procedimentos, com editor de intervenção, modal de tabela, vínculos de materiais e relatório
- Nome técnico provável no frontend: `Procedimentos`
- Prefixo provável de funções: `proc*`
- Principais blocos encontrados no `frontend/app.js`:
  - bloco de inicialização e cache de elementos DOM do módulo, incluindo `proc`, `procTabelaModal`, `procRelatorio` e estados auxiliares
  - bloco de helpers de formatação, seleção e normalização
  - bloco de carregamento de filtros, lista, editor e tabela
  - bloco de vínculo de materiais, composição de herança e recálculo visual
  - bloco de relatório/tabela de procedimentos
  - bloco de binds e eventos do painel e do editor
  - camada posterior de overrides e reaplicações de funções no mesmo arquivo, o que eleva o risco de extração prematura

## 3. Funções `proc*` encontradas

### Abertura da tela

- `abrirProcedimentos`
- `procCarregarFiltros`
- `procCarregarLista`
- `procAplicarRegrasTabelaSelecionada`

### Renderização

- `procRenderList`
- `procSelectRow`
- `procSelecionado`
- `procRenderLinks`
- `procAtualizarPreviewSimbolo`
- `procAplicarDadosEditor`
- `procRelatorioEnsureUI`
- `procRelatorioEnsurePreviewUI`
- `procRelatorioRenderPagina`

### Filtros

- `procCarregarFiltros`
- `procPreencherEspecialidadesEditor`
- `procPreencherSelect`
- `procGarantirOpcaoSelect`
- `procTabelaPreencherIndices`
- `procTabelaPreencherTiposTiss`
- `procTabelaPreencherOrigens`

### Busca

- `procCarregarLista`
- `procVinculaCarregarMateriais`
- `procVinculaLocalizarMaterialEdicao`
- `procCarregarMateriaisGenericoDetalhe`
- `procBuscarSimbolo`
- `procEspecialidadeNomeV2`

### Novo / Alterar / Excluir

- `procAbrirEditor`
- `procSalvar`
- `procExcluirSelecionado`
- `procCriarTabela`
- `procAlterarTabela`
- `procExcluirTabela`
- `procTabelaSalvarModal`
- `procDesvincularSelecionado`

### Editor / modal

- `procCarregarCombosEditor`
- `procAplicarDadosEditor`
- `procCorrigirRotulosEditor`
- `procFecharEditor`
- `procLimparEstadoMateriaisEditor`
- `procAbrirVincular`
- `procFecharVincular`
- `procAvisoMaterialJaVinculadoEnsureUI`
- `procAvisoMaterialJaVinculadoAbrir`
- `procAvisoMaterialJaVinculadoFechar`
- `procTabelaAbrirModal`
- `procTabelaFecharModal`
- `procTabelaAtualizarCopia`
- `procTabelaAtualizarFonte`
- `procRelatorioAbrir`
- `procRelatorioFechar`
- `procRelatorioAbrirPreview`

### Vínculos de materiais

- `procVinculaMaterialAtual`
- `procVinculaConfigurarModoEdicao`
- `procVinculaCarregarListas`
- `procVinculaCarregarMateriais`
- `procVinculaMaterialSelecionado`
- `procVinculaAtualizarCustoTotal`
- `procConfirmarVinculo`
- `procRecarregarLinks`
- `procEditarVinculoSelecionado`
- `procVinculaPrepararEdicao`
- `procVinculaMaterialJaEstaVinculado`

### Vínculos com procedimento genérico

- `procCarregarMateriaisGenericoDetalhe`
- `procComporMateriaisEditorPorGenerico`
- `procAtualizarMateriaisEditorVisualizacao`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `procClonarItemVinculado`
- `procMateriaisVinculadosIguais`
- `procResumoMateriaisVinculados`

### Cálculo / custos

- `procAtualizarFinanceiro`
- `procRelatorioMontarParams`
- `procRelatorioFormatarCampo`
- `procRelatorioAplicarEstilosConfig`
- `procRelatorioValidaCampos`
- `procFmtMoeda`
- `procFmtBr`
- `procParse`

### Salvamento

- `procSalvar`
- `procTabelaSalvarModal`
- `procConfirmarVinculo`
- `procRelatorioExportarArquivo`

### Eventos

- `procVinculaEventBind` não apareceu como função dedicada, mas os binds diretos do módulo estão concentrados no rodapé do arquivo
- `proc.tbody.addEventListener("click", ...)`
- `proc.tbody.addEventListener("dblclick", ...)`
- `proc.linksTbody.addEventListener("dblclick", ...)`
- `proc.cboGenerico.addEventListener("change", ...)`
- `proc.btnVincular.addEventListener("click", ...)`
- `proc.btnDesvincular.addEventListener("click", ...)`
- `procTabelaModal.hotkeys.forEach(...)`
- `procRelatorio` usa bindings internos para alternar abas, mover campos e atualizar preview

### Outras funções relevantes

- `procTabelaAtualId`
- `procTabelaAtualNome`
- `procTabelaSelecionadaAtual`
- `procTabelaTabelaSelecionada`
- `procAplicarRegrasTabelaSelecionada`
- `procReajustarTabela`
- `procCarregarCenario`
- `procRelatorioAtualizarOrdem`
- `procRelatorioMover`
- `procRelatorioMostrarAba`
- `procRelatorioResetar`
- `procRelatorioClasseCampo`
- `procRelatorioCamposSelecionados`
- `procRelatorioValorCampo`
- `procRelatorioAbrirDialogoImpressao`
- `procRelatorioImprimirPreview`
- `procRelatorioVoltarFiltros`
- `procRelatorioFecharPreview`
- `procRelatorioMontarHtml`
- `procRelatorioExecutar`

## 4. Fronteiras do módulo

### O que parece pertencer diretamente a Intervenções / Procedimentos

- lista principal de procedimentos
- abertura do editor `novo-proc-panel`
- gravação de procedimento
- exclusão de procedimento
- carregamento de filtros da tabela
- modal de tabela de procedimentos
- cálculo financeiro do procedimento
- relatório de tabela de procedimentos
- vinculação manual de materiais no procedimento
- edição de vínculo de material por código
- eventos de clique e duplo clique da grade principal

### O que pertence a Procedimentos Genéricos

- carregamento do combo de genéricos no editor
- leitura de materiais herdados do genérico
- composição dos materiais herdados + próprios
- sincronização do genérico com o procedimento
- herança de fases e de campos preenchidos a partir do genérico
- atualização visual ao trocar o genérico selecionado

### O que pertence a Materiais

- busca, seleção e edição de materiais vinculados
- cálculo de custo unitário e total do vínculo
- aviso de material já vinculado
- composição visual de vínculos no grid
- normalização de origem `proprio` / `herdado`
- service de vínculos de materiais no backend

### O que pertence a Convênios / Planos

- `fonte_pagadora` na tabela de procedimentos
- `nro_credenciamento`
- `tipo_tiss_id`
- adaptação de tipo TISS no modal de tabela
- reuso de tabela particular como referência de preço em relatórios
- resolução de preço particular e comparação com convênio no backend

### O que pertence a Prestadores

- neste bloco de procedimentos, a dependência direta de prestadores não aparece como fronteira principal
- o módulo consome contexto geral da clínica, permissões e tabelas, mas não mostra uma extração natural com prestadores nesta subetapa

### O que pertence a financeiro / cálculo

- `procAtualizarFinanceiro`
- custo fixo por tempo
- custo de material
- custo de laboratório
- valor mínimo
- lucro bruto e lucro líquido
- rendimento por procedimento
- relatório com colunas financeiras
- backend de relatório de tabela e dashboard financeiro

### O que não deve ser extraído agora

- funções de abertura/fechamento de painel com manipulação direta de DOM
- funções de bind de eventos
- funções de modal
- fluxo de salvar e recarregar lista
- lógica que mistura composição de materiais com requests ao backend
- helpers que dependem de estado global do módulo
- qualquer reaproveitamento que precise tocar em `requestJson`, `ensureModalChrome`, `bindStandardGridActivation`, `hideAllPanels` ou fluxo de double click

## 5. Dependências sensíveis

- `procedimento_generico_id`
- materiais próprios
- materiais herdados
- `backend/services/vinculos_materiais.py`
- `backend/routes/procedimentos_routes.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento_tabela.py`
- tabelas `procedimento`, `procedimento_generico`, `procedimento_tabela`, `procedimento_material`, `procedimento_generico_material`, `procedimento_fase`, `procedimento_generico_fase`
- vínculos, custos e cálculos
- modais do editor, da tabela e do relatório
- eventos de clique e duplo clique na grade principal
- recomposição visual baseada em snapshot e sequência de renderização
- o guardião `procMateriaisGenericoRenderSeq`, que evita corrida de atualização

Pontos de risco já conhecidos:

- troca do genérico pode recompôr materiais e fases
- o cálculo financeiro depende do custo material e do custo de laboratório
- a edição de vínculo por código pode tocar em material com mesmo código em listas diferentes
- a renderização dos materiais mistura estado próprio, herdado e snapshot da última leitura
- há diversas funções com nomes reaplicados mais abaixo no arquivo, o que indica evolução em camadas e aumenta o risco de regressão por extração precoce

## 6. Relação com a regra validada de Materiais

- a regra consolidada continua sendo `próprios + herdados`
- o material próprio vence sobre o herdado em conflito
- ao trocar o Procedimento Genérico, os materiais herdados devem ser recompostos
- ao colocar o combo em `Selecione...`, os herdados devem sair e permanecer somente materiais próprios reais
- não reabrir saneamento de vínculos legados nesta etapa

Esta subetapa não altera a regra; ela apenas registra que o bloco de Procedimentos a reutiliza e depende dela.

## 7. Candidatos futuros para modularização

### Helpers puros e passivos candidatos

- `procParse`
- `procFmtMoeda`
- `procFmtBr`
- `procSetSelectValue`
- `procIndiceSiglaFromValor`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procEspecialidadeNomeV2`
- `procValorSimboloComboV3`
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `procClonarItemVinculado`
- `procMateriaisVinculadosIguais`
- `procResumoMateriaisVinculados`

### Funções que talvez possam ir para um namespace passivo no futuro

- normalizadores de origem e de rótulo
- formatadores de moeda e texto
- comparação de itens de vínculo
- resumo de totais de materiais
- conversores de combo e labels auxiliares

### Funções que NÃO devem ser movidas ainda

- `procAbrirEditor`
- `procSalvar`
- `procAplicarDadosEditor`
- `procCarregarCombosEditor`
- `procAtualizarFinanceiro`
- `procRecarregarLinks`
- `procComporMateriaisEditorPorGenerico`
- `procAtualizarMateriaisEditorVisualizacao`
- `procTabelaAbrirModal`
- `procTabelaSalvarModal`
- `procRelatorio*`
- qualquer função de bind de eventos

### Pontos que exigem teste manual antes de qualquer delegação

- abrir a tela principal de procedimentos
- abrir o editor de novo e de edição
- salvar procedimento novo
- salvar procedimento existente
- trocar o Procedimento Genérico
- vincular e desvincular materiais
- editar vínculo por código
- testar duplo clique na grade principal e na grade de vínculos
- abrir o modal de tabela e alterar fonte particular/convênio
- validar o relatório de tabela de procedimentos

## 8. Riscos

- risco de quebrar cálculo
- risco de quebrar vínculos de materiais
- risco de quebrar Procedimentos Genéricos
- risco de quebrar edição ou salvamento
- risco de quebrar tabelas
- risco de quebrar relatório e totais financeiros
- risco de mexer em textos, labels ou mojibake indevidamente
- risco de contaminar pendências untracked já existentes
- risco de atingir blocos reescritos em camadas dentro do mesmo `frontend/app.js`

## 9. Recomendação da próxima etapa

Recomendação objetiva: iniciar uma nova documentação complementar de validação manual dos fluxos mais sensíveis de Intervenções / Procedimentos antes de qualquer namespace passivo.

Motivo:

- o módulo tem alto acoplamento com materiais, genéricos, cálculo e relatórios
- há funções reaplicadas ao longo do arquivo
- o comportamento de recomposição de vínculos ainda é sensível
- a fronteira mais segura agora é documentar e testar, não extrair

Se e quando houver uma etapa de namespace passivo, ela deve ficar restrita a helpers puros e sem comportamento, sem mover fluxo e sem tocar em funções sensíveis.

## 10. Onde testar antes de avançar

Testar no sistema em:

- `Configurações > Tabelas > Intervenções / Procedimentos...`

Fluxos mínimos de verificação:

- abrir e fechar o painel
- filtrar e selecionar tabela
- abrir novo procedimento
- abrir procedimento existente
- trocar Procedimento Genérico
- salvar procedimento
- vincular, editar e desvincular material
- dar duplo clique na linha da grade principal
- dar duplo clique em vínculo de material
- abrir o modal de tabela e alterar fonte
- abrir o relatório de tabela de procedimentos

## 11. Observação de blindagem textual / mojibake

Nenhum texto funcional foi corrigido nesta etapa. Se houver labels corrompidos, eles permanecem apenas como risco documental, em conformidade com a blindagem textual.

## 12. Fechamento

Este documento é somente um mapeamento documental conservador do módulo Intervenções / Procedimentos no monólito. Não há alteração funcional, não há mudança de backend, não há alteração de banco e não há extração de código nesta subetapa.
