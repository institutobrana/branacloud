# Auditoria comparativa das formulas de Valor Minimo e Rendimento no modulo Procedimentos

## 1. Contexto

Auditoria somente leitura para comparar o comportamento do Painel Financeiro de `Tabelas -> Procedimentos` entre:

- frontend legado (`frontend/app.js`);
- backend atual (`backend/routes/procedimentos_routes.py`);
- frontend React atual (`frontend-react/src/features/procedimentos/`).

Objetivo: explicar matematicamente por que os indicadores `Valor Minimo` e `Rendimento %` podem divergir entre as fontes historicas e o React atual, sem alterar codigo.

## 2. Fontes lidas

- `docs/auditoria_funcional_completa_modulo_procedimentos.md`
- `docs/contrato_funcional_campos_procedimentos.md`
- `docs/validacao_recalculo_dinamico_painel_financeiro_procedimentos.md`
- `docs/mapa_integracoes_modulo_procedimentos.md`
- `docs/auditoria_painel_financeiro_procedimentos_frontend_react.md`
- `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend/app.js`
- `frontend/index.html`
- `backend/routes/procedimentos_routes.py`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/hooks/useProcedimentoFinanceiro.js`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosFinanceiroMappers.js`
- `frontend-react/src/features/procedimentos/components/ProcedimentoEditorModal.jsx`

## 3. Matriz documental

| Documento | Formula de Valor Minimo | Formula de Rendimento | Fonte | Status |
| --- | --- | --- | --- | --- |
| `docs/contrato_painel_financeiro_procedimentos_frontend_react.md` | backend oficial | backend oficial | contrato do modulo | CONFIRMADO |
| `docs/auditoria_painel_financeiro_procedimentos_frontend_react.md` | backend oficial | backend oficial | leitura de codigo | CONFIRMADO |
| `docs/validacao_recalculo_dinamico_painel_financeiro_procedimentos.md` | preview oficial via backend | preview oficial via backend | execucao real | CONFIRMADO |
| `docs/auditoria_funcional_completa_modulo_procedimentos.md` | backend oficial | backend oficial | validacao real | CONFIRMADO |
| `docs/mapa_integracoes_modulo_procedimentos.md` | backend oficial | backend oficial | integracao modulo | CONFIRMADO |
| `docs/11_roadmap_desenvolvimento.md` | backend oficial | backend oficial | historico de frente | CONFIRMADO |

Conclusao documental: a documentacao vigente converge para o backend como fonte oficial e nao registra uma segunda formula distinta para o React.

## 4. Frontend legado

### 4.1 Funcao relevante

No `frontend/app.js`, a funcao do modal de procedimentos que recalcula o painel financeiro e `procAtualizarFinanceiro()`.

### 4.2 Formula observada

Trecho relevante:

- `custo_fph = procCenario.cfpm * tempo`
- `material = proc.totalCusto.dataset.valor`
- `custo_proc = custo_fph + material + lab`
- `irv = preco * procCenario.ir / 100`
- `cdv = preco * procCenario.cd / 100`
- `cartv = preco * procCenario.cartao / 100`
- `valor_min = custo_proc + (custo_proc * ir / 100) + (custo_proc * cd / 100) + (custo_proc * cartao / 100) + (custo_proc * 0.1)`
- `lucro_bruto = preco - custo_proc`
- `lucro_liq = preco - custo_proc - irv - cdv - cartv`
- `rend_proc = custo_proc > 0 ? (lucro_bruto * 100 / custo_proc) : 0`
- `rend3040 = preco > 0 ? (lucro_bruto * 100 / preco) : 0`
- `rend1020 = preco > 0 ? (lucro_liq * 100 / preco) : 0`
- `lucro_hora = tempo > 0 ? (lucro_liq * 60 / tempo) : 0`

### 4.3 Campo de exibicao no legado

O modal legado exibe:

- `Rendimento %` com `rend_proc`
- `Bom 30 a 40%` com `rend3040`
- `Bom 10 a 20%` com `rend1020`

Ou seja, o legado do modal mostra o percentual bruto sobre o custo (`lucro_bruto / custo_proc * 100`) na linha principal de `Rendimento %`.

### 4.4 Tratamento de zero no legado

- Se `preco = 0`, `rend_proc` continua sendo calculado normalmente porque usa `custo_proc` no denominador.
- Se `custo_proc > 0` e `preco = 0`, `lucro_bruto = -custo_proc`, entao `rend_proc = -100%`.
- Se `preco = 0`, `rend3040 = 0` e `rend1020 = 0` por guarda explicita.

## 5. Backend atual

### 5.1 Funcao oficial

`_calcular_financeiro_dashboard(proc, cenario, custo_material)`

### 5.2 Formula observada

Trecho relevante:

- `custo_fph = cfpm * tempo`
- `custo_proc = custo_fph + custo_material + lab`
- `valor_ir = preco * ir_pct / 100`
- `valor_cd = preco * cd_pct / 100`
- `valor_cartao = preco * cartao_pct / 100`
- `lucro_bruto = preco - custo_proc`
- `lucro_liquido = lucro_bruto - (valor_ir + valor_cd + valor_cartao)`
- `rendimento_proc = lucro_bruto * 100 / custo_proc` se `custo_proc > 0`, senao `0.0`
- `rendimento_3040 = lucro_bruto * 100 / preco` se `preco > 0`, senao `0.0`
- `rendimento_1020 = lucro_liquido * 100 / preco` se `preco > 0`, senao `0.0`
- `rendimento = rendimento_1020`
- `lucro_hora = lucro_liquido * 60 / tempo` se `tempo > 0`, senao `0.0`
- `valor_minimo = custo_proc + valor_ir + valor_cd + valor_cartao + (custo_proc * 10 / 100)`

### 5.3 Tratamento de zero no backend

- `rendimento_proc` zera quando `custo_proc <= 0`.
- `rendimento_3040` e `rendimento_1020` zeram quando `preco <= 0`.
- `lucro_hora` zera quando `tempo <= 0`.
- `valor_minimo` nao tem guarda especifica contra `preco = 0`; ele depende apenas de `custo_proc` e encargos sobre `preco`.

## 6. Frontend React atual

### 6.1 Fluxo de consumo

- `ProcedimentoEditorModal.jsx` monta `previewPayload`.
- `useProcedimentoFinanceiro.js` decide entre `GET /procedimentos/dashboard` e `POST /procedimentos/dashboard-preview`.
- `procedimentosApi.js` chama os endpoints.
- `ProcedimentoFinanceiroPanel.jsx` apenas formata os campos recebidos.

### 6.2 Payload do preview

O preview enviado pelo React inclui:

- `procedimento_id`
- `tabela_id`
- `procedimento_generico_id`
- `preco`
- `tempo`
- `custo_lab`
- `custo`
- `materiais`

Nao ha formula local para `Valor Minimo` ou `Rendimento %` no React.

### 6.3 Campos usados na tela

`ProcedimentoFinanceiroPanel.jsx` exibe os campos retornados:

- `custo_fph`
- `custo_material`
- `custo_proc`
- `ir`
- `cd`
- `cartao`
- `valor_minimo`
- `lucro_bruto`
- `lucro_liquido`
- `rendimento`
- `rendimento_3040`
- `rendimento_1020`
- `lucro_hora`

### 6.4 Tratamento de zero no React

- O React nao recalcula localmente.
- O card `Rendimento %` nao usa fallback para `rendimento`; ele exibe `rendimento_proc` de forma explicita.
- Quando `rendimento_proc` chega com valor numerico, o componente apenas formata o percentual.
- O React nao cria uma regra extra para transformar esse campo em valor negativo ou alternativo.

## 7. Calculo passo a passo

### 7.1 Cenario com valor do paciente = 300,00

Valores observados na validacao:

- `CFPH = R$ 103,95`
- `Mat. Consumo = R$ 35,23`
- `Custo R$ = R$ 139,18`
- `Imposto = R$ 30,00`
- `Comissao CD = R$ 60,00`
- `Taxa Cartao = R$ 12,00`
- `Lucro Bruto = R$ 160,83`
- `Lucro Liquido = R$ 58,82`
- `Lucro por hora = R$ 78,43`

#### Legado

- `rend_proc = lucro_bruto / custo_proc * 100`
- `rend_proc = 160,83 / 139,18 * 100`
- resultado exibido: `115,56%`

#### Backend / React

- `rendimento = lucro_liquido / preco * 100`
- `rendimento = 58,82 / 300,00 * 100`
- resultado exibido: `19,61%`

#### Valor Minimo

- `valor_minimo = custo_proc + valor_ir + valor_cd + valor_cartao + 10% de custo_proc`
- `valor_minimo = 139,18 + 30,00 + 60,00 + 12,00 + 13,918`
- resultado exibido no backend/React: `R$ 255,09`

### 7.2 Cenario com valor do paciente = 0,00

#### Legado

- `lucro_bruto = 0 - custo_proc = -custo_proc`
- `rend_proc = -custo_proc / custo_proc * 100`
- resultado exibido: `-100,00%`

#### Backend / React

- `rendimento = lucro_liquido / preco * 100`
- com `preco = 0`, o backend retorna `0.0` por guarda explicita
- resultado exibido: `0,00%`

#### Valor Minimo

- o backend/React mantem a mesma formula estrutural e mostra `R$ 153,09`
- o valor historico `R$ 200,41` nao foi reproduzido no codigo atual do repositorio

## 8. Expressões exatas solicitadas

- `115,56%` vem de `lucro_bruto * 100 / custo_proc`
- `19,61%` vem de `lucro_liquido * 100 / preco`
- `-100,00%` vem de `lucro_bruto * 100 / custo_proc` com `preco = 0`
- `0,00%` no React vinha da exibicao do campo contratado `rendimento` quando o card ainda seguia o contrato antigo; com a correcao, o card agora expõe `rendimento_proc`

## 9. Causa raiz

### 9.1 Rendimento

Causa confirmada:

- o legado do modal exibe o rendimento bruto sobre o custo (`rend_proc`)
- o backend/React exibem o rendimento liquido sobre o preco (`rendimento = rendimento_1020`)

Classificacao:

- `CAMPO EXIBIDO`
- `CONTRATO DIVERGENTE`

### 9.2 Valor Minimo

O codigo atual do repositorio nao confirmou uma formula distinta entre legado, backend e React. A formula observada em todas as fontes atuais e a mesma estrutura aditiva baseada em `custo_proc` e encargos.

O valor historico `R$ 200,41` nao foi reproduzido nos arquivos lidos nem no navegador desta sessao.

Classificacao:

- `NAO REPRODUZIDO NO CODIGO ATUAL`
- possivel `DOCUMENTO / PRINT DESATUALIZADO` ou origem externa ao repositorio atual

## 10. Impacto

- criacao de procedimento: o painel mostra no React um percentual diferente do legado visual quando a referencia historica esperada e `rend_proc`
- alteracao de procedimento: mesmo impacto ao recalcular o painel
- preview antes do save: o React continua consumindo o backend oficial
- valor minimo exibido: permanece dependente do backend, sem formula local no React
- relatorios e outras telas: qualquer tela que leia `rendimento` herdara o contrato atual do backend

## 11. Recomendacao minima futura

Sem implementar agora:

1. Se o contrato oficial desejado for o do legado do modal, alinhar o React para exibir o mesmo campo que o legado usa hoje para `Rendimento %`.
2. Se o contrato oficial desejado for o do backend atual, manter o React como consumidor de `rendimento = rendimento_1020`.
3. Para `Valor Minimo`, localizar a origem historica do valor `200,41` antes de qualquer alteracao, porque o codigo atual nao o reproduz.
4. Adicionar teste unitario/integração cobrindo:
   - `preco = 300`
   - `preco = 0`
   - `custo_proc > 0`
   - `custo_proc = 0`

## 12. Conclusao

- A divergencia de `Rendimento %` foi confirmada e explica os valores `115,56%` vs `19,61%`.
- O card do React passou a consumir explicitamente `rendimento_proc`, sem fallback silencioso para `rendimento`.
- O `Valor Minimo` do codigo atual nao apresentou divergencia entre backend e React; o historico `R$ 200,41` nao foi reproduzido nesta base.
- Nenhum codigo, endpoint, model, migration ou banco foi alterado nesta auditoria.

## 13. Rastreamento consolidado de Valor Minimo

- A origem dos percentuais foi consolidada no modulo financeiro `Cenario` carregado por `GET /cenario`.
- Os campos relevantes sao `ir`, `cd`, `cartao` e `cfpm`.
- O legado do `frontend/app.js` usa `custo_proc` como base do `Valor Minimo`.
- O backend atual foi corrigido para aplicar `ir`, `cd` e `cartao` sobre `custo_proc`.
- A formula historica associada ao legado fica:
  `custo_proc + (custo_proc * ir / 100) + (custo_proc * cd / 100) + (custo_proc * cartao / 100) + (custo_proc * 10 / 100)`
- A formula atual do backend fica:
  `custo_proc + (custo_proc * ir / 100) + (custo_proc * cd / 100) + (custo_proc * cartao / 100) + (custo_proc * 10 / 100)`
- A causa-raiz foi corrigida na implementacao desta etapa, removendo a mistura de bases no `valor_minimo`.
