# Subetapa 5-B - Fixtures e comparacao de payload de `pgenPayloadFromState`

Data: 2026-05-14

## 1. Contexto
Esta etapa e somente documental e de validacao.

Ela continua a auditoria iniciada na Subetapa 5-A, mas ainda nao extrai `pgenPayloadFromState(state)`.

Objetivos desta subetapa:

- criar fixtures controladas para o estado interno do editor
- comparar o payload atual gerado por `pgenPayloadFromState(state)`
- confirmar quais contratos estao estaveis
- identificar quais contratos ainda sao sensiveis demais para extracao

Estado de referencia:

- branch esperada: `modularizacao-segura-fase-1`
- working tree esperado: limpo no inicio
- `pgenPayloadFromState(state)` continua no `frontend/app.js`
- nenhuma nova modularizacao funcional foi iniciada

## 2. Comandos iniciais executados
Saidas registradas no inicio da revisao:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short

git diff --stat
```

Interpretacao:

- o working tree estava limpo no inicio desta subetapa
- nao havia alteracoes pendentes antes da criacao deste relatorio

## 3. Documentos consultados
Documentos obrigatorios encontrados e analisados:

- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- documentos equivalentes de:
  - `Etiquetas`
  - `Auxiliares`
  - `Medicamentos`
  - `CID`
  - `Plano de Contas`
  - `Unidades`

Documentos ausentes conhecidos:

- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos analisados
Arquivos de codigo analisados:

- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`

Arquivos de contrato e apoio consultados:

- `backend/routes/cadastros_routes.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/material.py`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`

## 5. Confirmacao de escopo
Esta etapa nao alterou:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`
- backend
- banco
- endpoints
- regras de negocio
- payload salvo no sistema

`pgenPayloadFromState(state)` nao foi extraido.

## 6. Assinatura atual e contrato observado
Assinatura observada no `frontend/app.js`:

```js
function pgenPayloadFromState(state)
```

Contrato ja auditado na Subetapa 5-A:

- helper puro, sem DOM, sem API e sem side effects
- helper sensivel de contrato
- continua no `app.js`

Campos de entrada relevantes:

- `codigo`
- `descricao`
- `especialidade`
- `tempo`
- `custo_lab`
- `peso`
- `simbolo_grafico`
- `inativo`
- `observacoes`
- `fases`
- `materiais`

Campos de saida relevantes:

- `codigo`
- `descricao`
- `especialidade`
- `tempo`
- `custo_lab`
- `peso`
- `simbolo_grafico`
- `mostrar_simbolo`
- `inativo`
- `observacoes`
- `fases`
- `materiais`

## 7. Metodo de validacao
Foi usado um script temporario somente em memoria, executado com `node -`, sem criar arquivo no repositório.

O teste comparou a saida real do helper com fixtures controladas.

Casos suportados foram comparados por igualdade estrutural.

Caso negativo foi avaliado separadamente para registrar comportamento com string monetaria brasileira.

## 8. Fixtures documentais
### 8.1 Fixture minima, sem fases e sem materiais
Estado:

- `codigo: "001"`
- `descricao: "  Item minimo  "`
- `especialidade: ""`
- `tempo: 0`
- `custo_lab: 0`
- `peso: 0`
- `simbolo_grafico: ""`
- `inativo: false`
- `observacoes: ""`
- `fases: []`
- `materiais: []`

Payload esperado e observado:

- `codigo: "001"`
- `descricao: "Item minimo"`
- `especialidade: ""`
- `tempo: 0`
- `custo_lab: 0`
- `peso: 0`
- `simbolo_grafico: ""`
- `mostrar_simbolo: false`
- `inativo: false`
- `observacoes: ""`
- `fases: []`
- `materiais: []`

Risco:

- baixo

### 8.2 Fixture ativo com simbolo
Estado:

- `codigo: "12"`
- `descricao: "Item ativo"`
- `especialidade: "ORT"`
- `tempo: 45`
- `custo_lab: 138.89`
- `peso: 2.5`
- `simbolo_grafico: "S1"`
- `inativo: false`
- `observacoes: "obs"`

Payload esperado e observado:

- `codigo: "12"`
- `descricao: "Item ativo"`
- `especialidade: "ORT"`
- `tempo: 45`
- `custo_lab: 138.89`
- `peso: 2.5`
- `simbolo_grafico: "S1"`
- `mostrar_simbolo: true`
- `inativo: false`
- `observacoes: "obs"`

Risco:

- medio, por envolver numericos e booleano derivado

### 8.3 Fixture inativo sem simbolo
Estado:

- `codigo: "13"`
- `descricao: "Item inativo"`
- `especialidade: ""`
- `tempo: 30`
- `custo_lab: 0`
- `peso: 0`
- `simbolo_grafico: ""`
- `inativo: true`
- `observacoes: null`

Payload esperado e observado:

- `codigo: "13"`
- `descricao: "Item inativo"`
- `especialidade: ""`
- `tempo: 30`
- `custo_lab: 0`
- `peso: 0`
- `simbolo_grafico: ""`
- `mostrar_simbolo: false`
- `inativo: true`
- `observacoes: ""`

Risco:

- medio, por validar null/vazio e status

### 8.4 Fixture com `mostrar_simbolo` derivado do texto
Estado:

- `codigo: "14"`
- `descricao: "Derivado"`
- `simbolo_grafico: "SIG"`
- `mostrar_simbolo: false` no state

Payload esperado e observado:

- `simbolo_grafico: "SIG"`
- `mostrar_simbolo: true`

Observacao:

- o helper ignora `state.mostrar_simbolo`
- o valor de saida e derivado apenas de `simbolo_grafico`

Risco:

- alto, porque o contrato deriva um booleano a partir de texto e nao preserva o booleano original do state

### 8.5 Fixture com campos vazios e nulos
Estado:

- `codigo: null`
- `descricao: undefined`
- `especialidade: null`
- `tempo: null`
- `custo_lab: null`
- `peso: undefined`
- `simbolo_grafico: null`
- `inativo: undefined`
- `observacoes: undefined`
- `fases: null`
- `materiais: null`

Payload esperado e observado:

- `codigo: ""`
- `descricao: ""`
- `especialidade: ""`
- `tempo: 0`
- `custo_lab: 0`
- `peso: 0`
- `simbolo_grafico: ""`
- `mostrar_simbolo: false`
- `inativo: false`
- `observacoes: ""`
- `fases: []`
- `materiais: []`

Risco:

- medio/alto, porque esse fixture confirma defaults fortes e coercao implícita

### 8.6 Fixture com fases e filtragem
Estado:

- `fases` com tres entradas
  - uma fase valida
  - uma fase com descricao vazia
  - uma fase valida com `tempo` em string

Payload esperado e observado:

- somente as fases com descricao nao vazia entram
- `sequencia` e reatribuida pelo indice do array filtrado/original na ordem de iteracao
- `tempo` vira numero com `Number(...)`

Risco:

- alto, porque o helper renumera sequencias e filtra fases vazias

### 8.7 Fixture com materiais validos e invalidos
Estado:

- `materiais` com quatro entradas
  - `material_id: 10`, `quantidade: 2`
  - `material_id: 0`, `quantidade: 3`
  - `material_id: 11`, `quantidade: 0`
  - `material_id: "12"`, `quantidade: "1.5"`

Payload esperado e observado:

- entram apenas os itens com `material_id > 0` e `quantidade > 0`
- `material_id` e `quantidade` sao convertidos com `Number(...)`

Risco:

- alto, porque o filtro remove linhas e a coerção pode aceitar strings numericas

### 8.8 Fixture negativa com string monetaria brasileira em `custo_lab`
Estado:

- `custo_lab: "138,89"`

Comportamento observado:

- `custo_lab: NaN`

Conclusao:

- esse valor nao parece fazer parte do contrato atual do estado interno
- a funcao nao faz parse monetario BR
- este caso serve como alerta de contrato, nao como fixture suportado para extracao

Risco:

- muito alto, porque revela que strings monetarias BR nao sao aceitas por este helper

## 9. Resultados da comparacao
Comparacao automatica executada em memoria:

```text
minimo_sem_fases_sem_materiais: OK
ativo_com_simbolo: OK
inativo_sem_simbolo: OK
mostrar_simbolo_derivado_do_texto: OK
campos_vazios_nulos: OK
com_fases_e_filtragem: OK
com_materiais_validos_e_invalidos: OK
negative_custo_lab_string_brasileira = {
  codigo: '17',
  descricao: 'String BR',
  especialidade: '',
  tempo: 10,
  custo_lab: NaN,
  peso: 0,
  simbolo_grafico: '',
  mostrar_simbolo: false,
  inativo: false,
  observacoes: '',
  fases: [],
  materiais: []
}
```

Resumo:

- nenhum desvio foi encontrado nos casos suportados
- o caso negativo confirmou o limite de contrato para string monetaria BR

## 10. Campos sensiveis
Campos que continuam merecendo cautela:

- `custo_lab`
- `tempo`
- `peso`
- `mostrar_simbolo`
- `inativo`
- `fases`
- `materiais`
- `codigo`
- `descricao`

Campos monetarios/numericos mais sensiveis:

- `custo_lab`
- `tempo`
- `peso`
- `fases[].tempo`
- `materiais[].quantidade`
- `materiais[].material_id`

## 11. Riscos remanescentes
Riscos que ainda impedem extracao imediata:

- `custo_lab` pode virar `NaN` se receber string monetaria BR
- o helper depende de coerencia forte do estado interno
- `mostrar_simbolo` e derivado do texto do simbolo, nao de um booleano do state
- fases e materiais sao filtrados e renumerados, o que afeta o shape final
- a relacao com backend continua sensivel porque o helper define o contrato enviado pelos fluxos de persistencia

Risco de fluxo:

- `pgenPersistirFases(state)` e `pgenPersistirMateriais(state)` continuam dependendo de `pgenPayloadFromState(state)`
- qualquer alteracao sem fixture comparativa pode quebrar salvamento de fases e materiais

## 12. Recomendacao objetiva
Recomendacao atual:

- **ainda nao extrair `pgenPayloadFromState(state)`**

Motivo:

- os casos suportados estao coerentes, mas o helper ainda e sensivel demais para sair do `app.js` sem uma camada adicional de testes de contrato
- o caso negativo com string monetaria brasileira mostra que o helper espera estado interno numerico e nao faz parse BR

Proxima etapa segura:

- preparar uma futura **Subetapa 5-C** apenas se houver necessidade real de extracao
- antes disso, criar comparacao formal entre:
  - o payload do helper atual
  - o payload inline de `pgenSalvarEditor()`
  - fixtures reais de estado do editor

Se a extracao vier a acontecer:

- deve entrar com fallback conservador
- deve ser acompanhada de fixtures automatizadas
- deve ser validada com item sem fases, com fases, com materiais e com estado parcialmente vazio

## 13. Onde testar antes de qualquer extracao futura
Antes de mover `pgenPayloadFromState(state)`, testar:

1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Procedimentos Genericos`.
3. Abrir um item existente com fases e materiais.
4. Conferir se o editor carrega `codigo`, `descricao`, `especialidade`, `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `inativo` e `observacoes`.
5. Conferir se fases e materiais seguem coerentes.
6. Salvar apenas se for seguro e reversivel.
7. Reabrir o item salvo.
8. Confirmar que console permanece sem `ReferenceError` ou `TypeError`.
9. Se houver proxima etapa de extracao, comparar a saida do helper com os fixtures acima antes de tocar no `app.js`.

## 14. Confirmacao final
- nenhum codigo funcional foi alterado nesta etapa
- `pgenPayloadFromState(state)` nao foi extraido
- `frontend/app.js` nao foi alterado
- `frontend/js/modules/procedimentos-genericos.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend, banco e endpoints nao foram alterados
- o objetivo desta subetapa foi apenas validar fixtures e contrato

