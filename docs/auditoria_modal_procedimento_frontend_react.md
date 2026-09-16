# Auditoria - Modal de procedimento no frontend React

## 1. Objetivo

Auditar o modal real de inclusao e alteracao de procedimento da frente `Tabelas -> Procedimentos`, usando o legado web, o backend e os modelos atuais como fonte de verdade. Esta etapa nao implementa o modal completo.

## 2. Verificacao inicial

- DiretÃ³rio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote esperado: `https://github.com/institutobrana/branacloud.git`
- O worktree estava sujo com alteracoes preexistentes e arquivos untracked fora desta frente. Nenhuma reversao foi feita.

## 3. Varredura de legado

### 3.1 Arquivos pesquisados

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/intervencoes-procedimentos.js`
- `frontend/orcamento/modals/propriedades-da-intervencao.js`
- `frontend/orcamento/modals/propriedades-da-intervencao-financeiro.js`
- `frontend/orcamento/modals/elimina-intervencao.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `backend/routes/procedimentos_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/material.py`
- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`

### 3.2 Arquivo `.ui`

- Nenhum arquivo `.ui` foi localizado no workspace principal por `rg --files | rg '\.ui$'`.
- O modal legado encontrado no repositÃ³rio atual e implementado em HTML/JS, nao em `.ui` local.

### 3.3 Controlador legado do modal

- O painel principal de procedimentos e aberto em `frontend/app.js` pela funcao `abrirProcedimentos()`.
- O editor de procedimento e aberto por `procAbrirEditor(id = null)`.
- O fechamento do editor e feito por `procFecharEditor()`.
- O modal de vinculo de materiais e aberto por `procAbrirVincular()`.
- O modal de exclusao usa `procExcluirSelecionado()` e o dialogo auxiliar de `frontend/orcamento/modals/elimina-intervencao.js`.

## 4. Legado web encontrado

### 4.1 Entrada visual

- Menu: `IntervenÃ§Ãµes / Procedimentos...` em `frontend/index.html`.
- Painel principal: `procedimentos-panel`.
- Painel do editor: `novo-proc-panel`.
- Titulo do painel principal no shell antigo: `Configura tabela de preÃ§os`.
- Titulo do editor: `Insere intervenÃ§Ã£o`.

### 4.2 Estrutura visual do modal

O modal legado do editor esta em `frontend/index.html` dentro de `#novo-proc-panel` e tem:

- barra de acoes com `Gravar`, `Voltar`, `Vincular material` e `Desvincular material`;
- `Painel de Cadastro` a esquerda;
- `Painel Financeiro` a direita;
- tabela inferior de materiais vinculados.

### 4.3 Funcoes e eventos reais

- `procAbrirEditor(null)` carrega o proximo codigo e abre o modal vazio.
- `procAbrirEditor(id)` carrega `GET /procedimentos/{id}` e hidrata o modal.
- `procSalvar()` grava por `POST /procedimentos` ou `PUT /procedimentos/{id}`.
- `procAbrirVincular()` abre o modal de vinculo de material.
- `procDesvincularSelecionado()` remove o vinculo selecionado.
- `procAtualizarFinanceiro()` recalcula os boxes do painel financeiro.
- Duplo clique na grade principal abre o editor de alteracao.
- Duplo clique na grade de materiais vincula ou edita o vinculo, conforme o estado do modal.

## 5. Backend confirmado

### 5.1 Rotas

Arquivo principal: `backend/routes/procedimentos_routes.py`

- `GET /procedimentos/tabelas`
- `POST /procedimentos/tabelas`
- `PATCH /procedimentos/tabelas/{codigo}`
- `DELETE /procedimentos/tabelas/{codigo}`
- `GET /procedimentos`
- `GET /procedimentos/proximo-codigo`
- `GET /procedimentos/tabelas/reajuste-preview`
- `POST /procedimentos/tabelas/reajuste-aplicar`
- `GET /procedimentos/dashboard`
- `GET /procedimentos/relatorio-tabela`
- `GET /procedimentos/filtros`
- `GET /procedimentos/{procedimento_id}`
- `POST /procedimentos`
- `PUT /procedimentos/{procedimento_id}`
- `DELETE /procedimentos/{procedimento_id}`
- `POST /procedimentos/{procedimento_id}/materiais-vinculados`
- `PUT /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`
- `DELETE /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`

### 5.2 Modelo persistido

`backend/models/procedimento.py` confirma:

- `codigo`
- `nome`
- `tempo`
- `preco`
- `custo`
- `custo_lab`
- `lucro_hora`
- `tabela_id`
- `especialidade`
- `procedimento_generico_id`
- `simbolo_grafico`
- `simbolo_grafico_legacy_id`
- `mostrar_simbolo`
- `garantia_meses`
- `forma_cobranca`
- `valor_repasse`
- `preferido`
- `inativo`
- `observacoes`
- `data_inclusao`
- `data_alteracao`
- `clinica_id`

Relacoes:

- `materiais_vinculados`
- `fases_vinculadas`

### 5.3 Heranca e calculo

- `backend/routes/procedimentos_routes.py` aplica heranca do procedimento generico em `_aplicar_heranca_procedimento_generico()`.
- A mesma rota sincroniza tempo e custo de laboratorio para genericos em `_sincronizar_generico_com_procedimento()`.
- O painel financeiro de dashboard e calculado em `_calcular_financeiro_dashboard()`.
- O backend usa `current_user.clinica_id` e `require_module_access("procedimentos")`.

## 6. Contrato funcional do modal

### 6.1 Bloco de cadastro

Campos confirmados no legado:

- Nome da intervencao / procedimento
- Area de simbolo / preview
- Procedimento generico
- Codigo
- Especialidade
- Simbolo grafico
- Garantia em meses
- Forma de cobranca
- Valor de repasse
- Valor do paciente / preco
- Custo de laboratorio
- Tempo de execucao
- Inativar intervencao
- Incluir na lista de preferidos
- Observacoes
- Inclusao
- Alteracao

### 6.2 Bloco financeiro

Itens confirmados no HTML legado:

- CFPH
- Mat. Consumo
- Custo R$
- Imposto
- Comissao CD
- Taxa Cartao
- Valor Minimo
- Lucro Bruto
- Lucro Liquido
- Rendimento %
- Bom 30 a 40%
- Bom 10 a 20%
- Lucro por hora
- A fonte oficial do calculo confirmada no backend e `_calcular_financeiro_dashboard(proc, cenario, custo_material)` em `backend/routes/procedimentos_routes.py`.
- O endpoint ja existente para a leitura do painel financeiro e `GET /procedimentos/dashboard`.
- A auditoria concluiu que o React nao deve duplicar formulas; deve consumir o dado oficial e apenas formatar a exibicao.
- O contrato funcional detalhado do painel financeiro foi separado em `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`.

### 6.3 Materiais vinculados

- A grade inferior possui 7 colunas.
- Fluxos confirmados: vincular, alterar quantidade e desvincular.
- O backend oferece endpoints dedicados para os dois sentidos de alteracao.
- O custo material usado no painel financeiro e agregado a partir dos materiais vinculados do procedimento, nao de mock local.
- O contrato real do vinculo usa `procedimento_material` no backend, com `material_id` e `quantidade` como dados persistidos e `custo_und`, `preco`, `relacao` e `custo_total` derivados na leitura.
- O modal legado de vinculacao depende de procedimento ja salvo, lista de materiais da clinica ativa e bloqueia quantidade menor ou igual a zero.
- O fluxo de vinculo no React deve seguir o mesmo contrato do legado: abrir modal proprio, selecionar lista/material, informar quantidade, confirmar, recarregar grade e atualizar painel financeiro.
- O fluxo de desvinculo deve usar confirmacao propria do React e o endpoint de remocao por codigo, sem `window.confirm`.
- O duplo clique em material vinculado no legado reabre o contexto para edicao da quantidade, nao uma nova tela.

## 7. React atual

Arquivos lidos:

- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx`
- `frontend-react/src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx`

Estado atual:

- a tela principal de Procedimentos ja existe;
- o modal estrutural ainda e placeholder;
- a tabela principal ja recebe os filtros;
- o combo de especialidade ja e resolvido por lookup na listagem;
- o modal real de procedimento ainda nao foi implementado.

## 8. Arquitetura React modular proposta

Sugestao de estrutura para a implementacao posterior:

- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoMateriaisTable.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoMaterialVinculoModal.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorActions.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoEditor.js`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoFinanceiro.js`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoMateriais.js`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosMappers.js`
- `frontend-react/src/features/procedimentos/procedimentosValidators.js`
- `frontend-react/src/features/procedimentos/procedimentosConstants.js`

## 9. DÃºvidas remanescentes

Nao restaram duvidas bloqueantes para iniciar a implementacao estrutural do modal. Os pontos criticos estao confirmados pelo codigo:

- modal proprio dentro da tela `Tabelas -> Procedimentos`;
- `Nova intervenÃ§Ã£o...` abre vazio;
- `Altera intervenÃ§Ã£o...` hidrata o mesmo modal;
- cancelamento retorna para a tabela preservando filtros;
- materiais usam modal/submodal proprio.

## 10. Conclusao

Ha informacao suficiente para implementar o modal React sem inventar regra, desde que a implementacao siga a estrutura modular e os endpoints ja existentes.

## 11. Estado atual da implementacao

- A estrutura modular inicial do modal foi criada no React.
- O editor esta dividido em componentes para acao, cadastro, financeiro e materiais.
- Ainda nao ha integracao funcional completa de campos, heranca, formulas ou materiais.

## 12. Fechamento documental

- O Painel de Cadastro foi confirmado como concluido funcionalmente.
- O contrato de dados permanece alinhado ao backend real, com `tabela_id` em string no payload do frontend.
- O catalogo de simbolos grafico continua sendo consumido por ID fisico com label descritivo e preview ligado ao item selecionado.
- A forma de cobranca permanece limitada a `INTERVENCAO` e `ELEMENTO_FACE`.
- Os testes reais de persistencia e hidratacao ja foram executados e documentados.
- O Painel Financeiro permaneceu read-only e Materiais passaram a estar integrados no modal React com fluxo modular proprio, sem duplicacao de formulas no cliente.
## 14. Validacao desta etapa

- O Painel Financeiro foi integrado e validado no navegador autenticado.
- O modal novo continua neutro e sem formulas artificiais.
- Materiais vinculados ja foram integrados e validados no navegador com criacao e exclusao reais do vinculo de teste.

## 15. Ajuste visual do painel financeiro

- O Painel Financeiro foi consolidado em leitura compacta de 3 colunas.
- O texto tecnico da origem oficial nao deve aparecer na interface visivel.
- O destaque discreto dos indicadores de rendimento positivo permanece ativo.
- Nenhuma regra funcional foi alterada.

## 17. Validacao visual do submodal

- A validação em navegador autenticado confirmou o submodal `Vincular material` compacto.
- A hierarquia visual deixou de usar duas colunas e passou para fluxo vertical.
- Os campos `Classificação`, `Material` e `Nome do material` ficaram em coluna única.
- Os valores de custo permanecem read-only com fundo ciano.
- `Relação` e `Preço R$` não aparecem mais na janela do submodal.
