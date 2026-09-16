# Auditoria do Painel Financeiro de Procedimentos no frontend React

## 1. Objetivo

Auditar o painel financeiro exibido no modal de Procedimentos da frente `Tabelas -> Procedimentos`, usando o backend real, o legado web e os arquivos React atuais como fonte de verdade. Esta etapa nao implementa o painel.

## 2. Verificacao inicial

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote esperado: `https://github.com/institutobrana/branacloud.git`
- O worktree ja estava sujo com alteracoes preexistentes fora desta frente. Nenhuma reversao foi feita.

## 3. Fontes lidas

- `backend/routes/procedimentos_routes.py`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorModal.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoEditor.js`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoCadastroForm.js`
- `frontend-react/src/features/procedimentos/procedimentosEditorMappers.js`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentos.css`
- `docs/contrato_implementacao_tabela_procedimentos_frontend_react.md`
- `docs/auditoria_modal_procedimento_frontend_react.md`

## 4. Backend confirmado

### 4.1 Funcao oficial

- `_calcular_financeiro_dashboard(proc, cenario, custo_material)`

### 4.2 Endpoint oficial ja existente

- `GET /procedimentos/dashboard`

### 4.3 Campos retornados

- `id`
- `codigo`
- `nome`
- `preco`
- `tempo`
- `tempo_grafico`
- `lab`
- `custo_material`
- `custo_fph`
- `custo_proc`
- `ir`
- `cd`
- `cartao`
- `lucro_bruto`
- `lucro_liquido`
- `valor_minimo`
- `rendimento_proc`
- `rendimento_3040`
- `rendimento_1020`
- `rendimento`
- `lucro_hora`

### 4.4 Formulas verificadas

- `custo_fph = cfpm * tempo`
- `custo_proc = custo_fph + custo_material + lab`
- `valor_ir = preco * ir_pct / 100`
- `valor_cd = preco * cd_pct / 100`
- `valor_cartao = preco * cartao_pct / 100`
- `lucro_bruto = preco - custo_proc`
- `lucro_liquido = lucro_bruto - (valor_ir + valor_cd + valor_cartao)`
- `rendimento_proc = lucro_bruto * 100 / custo_proc` quando `custo_proc > 0`, senao `0.0`
- `rendimento_3040 = lucro_bruto * 100 / preco` quando `preco > 0`, senao `0.0`
- `rendimento_1020 = lucro_liquido * 100 / preco` quando `preco > 0`, senao `0.0`
- `rendimento = rendimento_1020`
- `lucro_hora = lucro_liquido * 60 / tempo` quando `tempo > 0`, senao `0.0`
- `valor_minimo = custo_proc + valor_ir + valor_cd + valor_cartao + (custo_proc * 10 / 100)`

## 5. Painel visual legado

Itens confirmados no HTML legado:

- `CFPH`
- `Mat. Consumo`
- `Custo R$`
- `Imposto`
- `Comissao CD`
- `Taxa Cartao`
- `Valor Minimo`
- `Lucro Bruto`
- `Lucro Liquido`
- `Rendimento %`
- `Bom 30 a 40%`
- `Bom 10 a 20%`
- `Lucro por hora`

## 6. React atual

- `ProcedimentoFinanceiroPanel.jsx` hoje renderiza os cards do painel como estado read-only.
- O componente ainda nao consome a resposta oficial do backend.
- O painel nao deve conter formulas locais duplicadas.

## 7. Estrategia confirmada

- O React deve consumir a resposta oficial do backend.
- O componente deve apenas formatar a exibicao.
- A presentacao deve permanecer compacta, read-only e sem calculo local.
- Estados sem dado oficial devem permanecer neutros.

## 8. Conclusao

Ha informacao suficiente para implementar o painel financeiro sem inventar regra. O ponto de verdade fica no backend, e o React deve ser apenas consumidor e formatador visual.
## 9. Validacao real

- O navegador autenticado confirmou o consumo real de `GET /procedimentos/dashboard`.
- O painel financeiro renderizou os campos oficiais no modal de edicao.
- Em `Nova intervencao`, o painel exibiu estado neutro com `—`.

## 10. Atualizacao visual validada

- O painel foi ajustado para manter leitura compacta em 3 colunas.
- O rastro tecnico da origem oficial foi removido da interface visivel.
- Os cards de `Bom 30 a 40%` e `Bom 10 a 20%` ficaram com realce verde discreto.
- O contrato tecnico permanece inalterado em backend, formulas e payloads.
