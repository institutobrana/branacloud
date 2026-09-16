# Rastreabilidade dos parametros de Valor Minimo em Procedimentos

## Objetivo

Documentar a cadeia completa que leva ao calculo de `Valor Minimo` no modal de Procedimentos, diferenciando:

- o comportamento historico observado no legado;
- o comportamento do backend atual;
- a origem dos percentuais;
- a base de calculo usada em cada fonte.

## Fontes lidas

- `backend/routes/procedimentos_routes.py`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `frontend/app.js`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosFinanceiroMappers.js`
- `docs/auditoria_comparativa_valor_minimo_rendimento_procedimentos.md`
- `docs/contrato_painel_financeiro_procedimentos_frontend_react.md`
- `docs/validacao_recalculo_dinamico_painel_financeiro_procedimentos.md`
- `docs/mapa_integracoes_modulo_procedimentos.md`
- `docs/11_roadmap_desenvolvimento.md`

## 1. Onde os percentuais sao configurados

### 1.1 Cenario financeiro da clinica

O mapeamento real dos percentuais usados pelo Painel Financeiro vem do modulo financeiro:

- rota de leitura: `GET /cenario`
- rota de gravacao: `POST /cenario`
- backend: `backend/routes/cenario_routes.py`
- modelo: `backend/models/cenario.py`

Campos relevantes no modelo:

- `cfph`
- `cfpm`
- `cartao`
- `ir`
- `cd`

### 1.2 Escopo

Os percentuais sao por `clinica_id`.

Nao foram encontrados percentuais de `ir`, `cd` e `cartao` com escopo de procedimento, especialidade ou forma de cobranca no calculo do Painel Financeiro do modulo `Procedimentos`.

## 2. Mapeamento dos parametros

| Parametro | Módulo de origem | Tela | Campo | Tabela | Coluna | Escopo |
|---|---|---|---|---|---|---|
| Imposto | Financeiro | Cenario | `ir` | `cenario` | `ir` | clinica |
| Comissão CD | Financeiro | Cenario | `cd` | `cenario` | `cd` | clinica |
| Taxa cartao | Financeiro | Cenario | `cartao` | `cenario` | `cartao` | clinica |
| Adicional 10% | Procedimentos | Painel Financeiro | literal `10/100` | backend de procedimentos | expressao fixa | procedimento |

## 3. Frontend legado

### 3.1 Expressao literal

No `frontend/app.js`, o calculo de `Valor Minimo` aparece literalmente assim:

```javascript
const valor_min=custo_proc+(custo_proc*procCenario.ir/100)+(custo_proc*procCenario.cd/100)+(custo_proc*procCenario.cartao/100)+(custo_proc*0.1);
```

### 3.2 Base de calculo do legado

O legado usa `custo_proc` como base para todas as parcelas do `Valor Minimo`.

As parcelas monetarias mostradas no painel para `Imposto`, `Comissão CD` e `Taxa Cartão` continuam sendo calculadas sobre `preco` no mesmo bloco:

```javascript
const irv=preco*procCenario.ir/100;
const cdv=preco*procCenario.cd/100;
const cartv=preco*procCenario.cartao/100;
```

Ou seja:

- os cards monetarios usam `preco`;
- `Valor Minimo` usa `custo_proc`.

## 4. Backend atual

### 4.1 Funcao oficial

A funcao oficial e `_calcular_financeiro_dashboard(proc, cenario, custo_material)`.

### 4.2 Variaveis usadas

- `preco = float(proc.preco or 0)`
- `tempo = float(proc.tempo or 0)`
- `lab = float(proc.custo_lab or 0)`
- `cfpm = float(cenario.cfpm or 0) if cenario else 0.0`
- `ir_pct = float(cenario.ir or 0) if cenario else 0.0`
- `cd_pct = float(cenario.cd or 0) if cenario else 0.0`
- `cartao_pct = float(cenario.cartao or 0) if cenario else 0.0`
- `custo_fph = cfpm * tempo`
- `custo_proc = custo_fph + float(custo_material or 0) + lab`
- `valor_ir = preco * ir_pct / 100`
- `valor_cd = preco * cd_pct / 100`
- `valor_cartao = preco * cartao_pct / 100`

### 4.3 Formula literal do backend

```python
valor_minimo = custo_proc + valor_ir + valor_cd + valor_cartao + (custo_proc * 10 / 100)
```

### 4.4 Base usada pelo backend

O backend usa:

- `custo_proc` para a parcela base;
- `preco` para `valor_ir`, `valor_cd` e `valor_cartao`.

Isso mistura duas bases diferentes no mesmo `Valor Minimo`.

## 5. Fluxo do preview

### 5.1 Endpoint

`POST /procedimentos/dashboard-preview`

### 5.2 Payload real

O payload contem:

- `procedimento_id`
- `tabela_id`
- `procedimento_generico_id`
- `preco`
- `tempo`
- `custo_lab`
- `custo`
- `materiais`

Nao envia percentuais de `ir`, `cd` ou `cartao`.

### 5.3 Origem dos percentuais no preview

O backend do preview busca os percentuais em `Cenario` pela `clinica_id`.

### 5.4 Resposta real do preview

A resposta retorna:

- `cfpm`
- `ir`
- `cd`
- `cartao`
- `custo_fph`
- `custo_proc`
- `valor_minimo`
- `rendimento_proc`
- `rendimento_3040`
- `rendimento_1020`
- `rendimento`
- `lucro_hora`

## 6. Reproducao dos cenarios validados

### 6.1 Cenario com paciente = 300

Dados observados:

- `custo_proc = 139,175`
- `valor_ir = 30,00`
- `valor_cd = 60,00`
- `valor_cartao = 12,00`
- `custo_proc * 10% = 13,9175`

Backend atual:

- `valor_minimo = 255,0925`
- exibicao: `R$ 255,09`

### 6.2 Cenario com paciente = 0

Dados observados:

- `custo_proc = 139,175`
- `valor_ir = 0,00`
- `valor_cd = 0,00`
- `valor_cartao = 0,00`
- `custo_proc * 10% = 13,9175`

Backend atual:

- `valor_minimo = 153,0925`
- exibicao: `R$ 153,09`

### 6.3 Cenario com paciente = custo

Dados observados:

- `preco = 139,18`
- `custo_proc = 139,175`
- `valor_ir = 13,918`
- `valor_cd = 27,836`
- `valor_cartao = 5,5672`
- `custo_proc * 10% = 13,9175`

Backend atual:

- `valor_minimo = 200,4137`
- exibicao: `R$ 200,41`

### 6.4 Cenario abaixo do custo

Dados observados:

- `preco = 138,18`
- `custo_proc = 139,175`
- `valor_ir = 13,818`
- `valor_cd = 27,636`
- `valor_cartao = 5,5272`
- `custo_proc * 10% = 13,9175`

Backend atual:

- `valor_minimo = 200,0737`
- exibicao: `R$ 200,07`

## 7. Causa-raiz

A causa-raiz comprovada e:

- o legado do `frontend/app.js` usa `custo_proc` como base de `Valor Minimo`;
- o backend atual usa `custo_proc` apenas na parcela principal e aplica `ir`, `cd` e `cartao` sobre `preco`;
- o `Valor Minimo` atual cresce com o `preco` porque as parcelas monetarias entram da base errada para esse indicador.

Classificacao:

- base de calculo errada;
- uso de valor monetario no lugar de percentual na parcela aplicada ao custo;
- dependencia de preco onde o legado usa custo;
- causa composta.

## 8. Regras de fallback

Nao foi identificado fallback seguro que converta automaticamente a base do backend atual para a do legado.

O React atual apenas consome a resposta oficial do backend.

## 9. Menor correcao futura

A menor correção futura, sem hardcode, e:

- manter `Cenario` como fonte dos percentuais;
- separar os cards monetarios baseados em `preco`;
- corrigir o backend do preview para que `Valor Minimo` reaplique `ir`, `cd` e `cartao` sobre `custo_proc` se esse for o contrato legado esperado;
- manter o React como consumidor passivo do resultado oficial.

## 10. Arquivos provaveis para a correcao futura

- `backend/routes/procedimentos_routes.py`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `frontend/app.js`
- `frontend-react/src/features/procedimentos/procedimentosApi.js`
- `frontend-react/src/features/procedimentos/procedimentosFinanceiroMappers.js`
- `frontend-react/src/features/procedimentos/components/ProcedimentoFinanceiroPanel.jsx`

## 11. Conclusao

O contrato historico correto para `Valor Minimo` usa `custo_proc` como base das parcelas percentuais.

O backend atual nao reproduz esse contrato integralmente porque mistura a base `preco` nas parcelas monetarias `ir`, `cd` e `cartao`.

O React atual nao inventa formula; ele apenas exibe o que o backend envia.
