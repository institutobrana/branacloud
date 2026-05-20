# Subetapa A (somente documental) - Mapeamento de equivalencias - Reajuste de tabela EasyDental -> Brana Cloud

## 1) Resumo executivo

- A regra do EasyDental (desktop) foi parcialmente recuperada via strings em `Y:\EDS70\EDS70.exe`: tela de reajuste, opcoes aumentar/diminuir, campo percentual e aplicacao por `NROTAB` em `TAB_PRC_ITEM` sobre `VALOR_PACIENTE` e `VALOR_REPASSE`.
- Esta subetapa mapeia, somente documentalmente, os equivalentes no Brana Cloud (models, tabelas, campos, rotas e fluxo do frontend), sem qualquer implementacao.
- Resultado do mapeamento: os equivalentes no Brana Cloud sao altamente provaveis e ja aparecem end-to-end (frontend -> rotas -> models):
  - `TAB_PRC_ITEM` -> `procedimento` (`backend/models/procedimento.py`)
  - `NROTAB` -> `procedimento.tabela_id` (FK logica para `procedimento_tabela.id`)
  - `VALOR_PACIENTE` -> `procedimento.preco`
  - `VALOR_REPASSE` -> `procedimento.valor_repasse`

## 2) Mapa EasyDental (referencia)

Fonte documental:

- Evidencias: `docs/investigacao_profunda_y_eds70_reajuste_tabela.md`
- Especificacao consolidada: `docs/intervencoes_procedimentos_especificacao_reajuste_tabela_precos_y_eds70.md`

Entidades/campos (EasyDental):

- tabela: `TAB_PRC_ITEM`
- chave da tabela de precos: `NROTAB`
- campos de preco: `VALOR_PACIENTE`, `VALOR_REPASSE`
- regra: update em massa por tabela selecionada:
  - `WHERE NROTAB = [pNrotab]`
  - aumento/diminuicao por fator percentual

## 3) Mapa Brana Cloud (evidencias no monolito atual)

### 3.1) Models (backend)

Procedimento / intervencao (item da tabela de precos):

- `backend/models/procedimento.py`
  - `__tablename__ = "procedimento"`
  - campos relevantes:
    - `tabela_id` (Integer)
    - `preco` (Float)
    - `valor_repasse` (Float)
    - campos que NAO devem ser reajustados:
      - `custo`, `custo_lab`, `lucro_hora`, etc.

Tabela de precos:

- `backend/models/procedimento_tabela.py`
  - `__tablename__ = "procedimento_tabela"`
  - campos relevantes:
    - `id` (PK)
    - `codigo` (codigo humano/legado de tabela)
    - `nome`
    - `fonte_pagadora` (ex.: "particular" / "convenio")
    - `inativo`

### 3.2) Rotas (backend)

Arquivo: `backend/routes/procedimentos_routes.py`

Evidencias de que `preco`, `valor_repasse` e `tabela_id` sao parte do payload e persistencia:

- payload inclui:
  - `preco` (`procedimentos_routes.py:92`)
  - `tabela_id` (`procedimentos_routes.py:95`)
  - `valor_repasse` (`procedimentos_routes.py:103`)
- endpoints relevantes (decorators):
  - tabelas:
    - `@router.get("/tabelas")` (`procedimentos_routes.py:982`)
    - `@router.post("/tabelas")` (`procedimentos_routes.py:990`)
    - `@router.delete("/tabelas/{codigo}")` (`procedimentos_routes.py:1139`)
  - lista/CRUD de procedimentos:
    - `@router.get("")` (`procedimentos_routes.py:1192`) com filtro `tabela_id` (Query) e `query.filter(Procedimento.tabela_id == ...)` (`procedimentos_routes.py:1195`, `1208`)
    - `@router.get("/{procedimento_id}")` (`procedimentos_routes.py:1446`)
    - `@router.post("")` (`procedimentos_routes.py:1459`) cria gravando `preco` e `valor_repasse` (`procedimentos_routes.py:1504`, `1515`)
    - `@router.put("/{procedimento_id}")` (`procedimentos_routes.py:1533`) atualiza `proc.preco` e `proc.valor_repasse` (`procedimentos_routes.py:1584`, `1595`)

Observacao: o mesmo arquivo contem calculos derivados a partir de `preco` (porcentagens/indicadores), o que aumenta o risco de reajustar campo errado.

### 3.3) Frontend (tela Intervencoes / Procedimentos)

Arquivo: `frontend/app.js`

Evidencias do carregamento/salvamento de `preco` e `valor_repasse` no editor:

- inputs:
  - `nproc-preco` (`frontend/app.js:45`)
  - `nproc-repasse` (`frontend/app.js:44`)
- salvar (`procSalvar`):
  - parse do preco: `preco=procParse(proc.txtPreco.value);` (`frontend/app.js:23542`)
  - parse do repasse: `repasse=procParse(proc.txtRepasse?.value||"0");` (`frontend/app.js:23544`)
  - payload inclui:
    - `preco`
    - `valor_repasse: repasse`
    - `tabela_id: String(proc.cboTabela?.value||"1")`
    (`frontend/app.js:23556`)
  - endpoint:
    - `POST /procedimentos` ou `PUT /procedimentos/{id}` (`frontend/app.js:23558`)

Evidencia de carregamento de filtros/tabelas (para escolher tabela):

- `GET /procedimentos/filtros` (`frontend/app.js:23365`)

## 4) Tabela de equivalencias (EasyDental -> Brana Cloud)

| EasyDental | Brana Cloud provavel | Evidencia | Grau de confianca | Observacao |
| --- | --- | --- | --- | --- |
| `TAB_PRC_ITEM` | tabela `procedimento` (model `Procedimento`) | `backend/models/procedimento.py` + rotas `backend/routes/procedimentos_routes.py` (CRUD) + `frontend/app.js` usa `/procedimentos` | Alta | No Brana Cloud, o item de tabela de precos parece ser o proprio `procedimento`. |
| `NROTAB` | `procedimento.tabela_id` (referencia a `procedimento_tabela.id`) | `backend/models/procedimento.py` (`tabela_id`) + filtro por tabela em `procedimentos_routes.py:1208` + payload em `frontend/app.js:23556` | Alta | Brana Cloud usa `tabela_id` como chave da tabela selecionada; `procedimento_tabela` possui `codigo` (humano/legado). |
| `VALOR_PACIENTE` | `procedimento.preco` | `backend/models/procedimento.py:17` + payload `preco` em `frontend/app.js:23556` + rotas gravam `payload.preco` (`procedimentos_routes.py:1504`, `1584`) | Alta | Nome difere (paciente vs preco), mas o uso no editor e rotas sugere equivalencia funcional. |
| `VALOR_REPASSE` | `procedimento.valor_repasse` | `backend/models/procedimento.py:29` + payload `valor_repasse` em `frontend/app.js:23556` + rotas gravam `payload.valor_repasse` (`procedimentos_routes.py:1515`, `1595`) | Alta | No UI aparece como "Valor repasse"; no relatorio backend aparece como "Val convenio (R$)" em algumas saidas do relatorio de tabela (`procedimentos_routes.py:1395`). |

## 5) Campos que NAO devem ser alterados pelo reajuste

Mesmo que existam na tela/fluxo, o reajuste de tabela (precos) nao deve tocar em:

- materiais e vinculos de materiais (tabelas/rotas/services de materiais);
- `procedimento_generico_id` e qualquer regra de heranca/proprio/herdado;
- custos e derivados:
  - `procedimento.custo`
  - `procedimento.custo_lab`
  - qualquer calculo financeiro que dependa desses campos
- saneamento de vinculos legados (fora de escopo).

## 6) Endpoint futuro sugerido (somente recomendacao documental)

Com a base atual, se for seguir para implementacao em subetapa separada:

- Preview (somente leitura): usar `tabela_id` como parametro (igual ao filtro atual da listagem) e calcular antes/depois sobre `procedimento.preco` e `procedimento.valor_repasse`.
- Aplicacao real (escrita): atualizar somente registros `procedimento` com `procedimento.tabela_id == tabela_id_selecionada`, alterando apenas os dois campos equivalentes a preco/repasse.

Se houver duvida sobre `codigo` vs `id` da tabela:

- o backend ja possui resolucao de tabela por codigo/id (`procedimentos_routes.py` tem `_resolver_tabela_id` e carrega tabela), entao o endpoint deve padronizar para 1 forma (preferivel `tabela_id` real).

## 7) Riscos documentados

- Reajustar o campo errado (confundir `preco` com custo/derivados).
- Confundir "valor paciente" (particular) com "repasse/convenio" e aplicar em campo trocado.
- Aplicar em todas as tabelas em vez da tabela selecionada (escopo deve ser `procedimento.tabela_id`).
- Arredondamento e casas decimais (nao confirmado no EasyDental; pode impactar comparacoes e UI).
- Valores nulos/zero: decidir se atualiza ou ignora (nao confirmado).

## 8) Recomendacao objetiva

- O mapeamento de equivalencias esta **alto** o suficiente para seguir para a Subetapa B (modal + preview sem gravacao), desde que:
  - a Subetapa B nao grave nada;
  - o preview deixe claro quais campos serao alterados (`preco` e `valor_repasse`);
  - o preview seja por `tabela_id` selecionada.
- Ainda falta confirmar (antes de aplicacao real):
  - arredondamento;
  - regra de nulo/zero;
  - se o desktop aplicava o mesmo percentual para ambos os campos (ou se eram parametros diferentes).

## 9) Proxima subetapa sugerida

- Subetapa B: modal + preview sem gravacao.
- Se aparecer duvida sobre equivalencia em ambiente real: Subetapa A2 (documental) com SELECT somente leitura para validar amostra de registros por `tabela_id`, `preco`, `valor_repasse` e seus significados por fonte pagadora.

## 10) Onde testar futuramente (apos implementacao segura)

- Selecionar uma tabela de teste em `Configuracoes > Tabelas > Intervencoes / Procedimentos...`.
- Rodar preview e conferir amostra antes/depois.
- Confirmar que apenas a tabela selecionada seria afetada.
- Confirmar que materiais/genericos/vinculos nao mudam.

## Observacao sobre documentos citados

O arquivo citado em algumas instrucoes como `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace; foi usado como referencia de contrato o documento existente `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`.

