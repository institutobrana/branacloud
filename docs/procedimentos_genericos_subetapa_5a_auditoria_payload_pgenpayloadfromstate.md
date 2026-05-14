# Subetapa 5-A - Auditoria de payload de `pgenPayloadFromState`

Data: 2026-05-14

## 1. Contexto
Esta etapa e somente documental e faz parte do ciclo seguro de Procedimentos Genericos.

Objetivo desta subetapa:

- auditar `pgenPayloadFromState(state)`
- mapear contrato de entrada e saida
- identificar campos sensiveis e riscos
- definir se a extracao futura pode ocorrer com seguranca

Estado de referencia:

- branch esperada: `modularizacao-segura-fase-1`
- ciclo inicial de Procedimentos Genericos ja esta consolidado
- apenas `pgenStatusDot(inativo)` foi extraido ate agora
- `pgenPayloadFromState(state)` permanece no `frontend/app.js`

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

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md`
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- documentos localizados por busca em `docs/` com termos relacionados a:
  - procedimento generico
  - pgen
  - cenario financeiro
  - materiais vinculados
  - monetario
  - moeda
  - decimal
  - parse
  - centavos
  - virgula
  - ponto

Documento ausente conhecido:

- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos analisados
Arquivos de codigo analisados:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`

Arquivos de backend e contrato consultados para fechar origem e formato do payload:

- `backend/routes/cadastros_routes.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/material.py`
- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`

## 5. Assinatura atual de `pgenPayloadFromState(state)`
Assinatura observada no `frontend/app.js`:

```js
function pgenPayloadFromState(state)
```

Resumo da responsabilidade:

- montar o payload de persistencia a partir de um objeto de estado interno
- nao ler DOM
- nao chamar API
- nao alterar estado global
- nao formatar moeda
- nao consultar `procCenario`
- nao consultar backend

Classificacao tecnica:

- `pgenPayloadFromState(state)` e puro no sentido de nao produzir side effects
- porem e um helper sensivel de contrato, porque define o formato do payload aceito pelo backend

## 6. Mapa de entrada `state`
Campos lidos diretamente por `pgenPayloadFromState(state)`:

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

Campos do `state` nao usados pelo helper:

- `id`
- `mostrar_simbolo`
- `data_inclusao`
- `data_alteracao`
- `vinculos`
- quaisquer outros campos auxiliares do editor ou de caches

## 7. Mapa de saida `payload`
O helper retorna um objeto com estes campos:

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

Observacao importante:

- o `id` nao vai no corpo do payload; ele e passado na URL pelos chamadores
- isso e coerente com os endpoints de atualizacao

## 8. Tabela campo a campo
### 8.1 Campos escalares

| Campo de entrada | Campo de saida | Conversao aplicada | Sensibilidade |
| --- | --- | --- | --- |
| `state.codigo` | `codigo` | `String(...).trim()` | alto, porque e parte do contrato de chave natural |
| `state.descricao` | `descricao` | `String(...).trim()` | alto, porque e obrigatorio no backend |
| `state.especialidade` | `especialidade` | `String(...).trim()` | medio, pode ficar vazio |
| `state.tempo` | `tempo` | `Math.max(0, Number(...))` | alto, campo numerico sensivel |
| `state.custo_lab` | `custo_lab` | `Number(...)` | alto, campo monetario/numerico sensivel |
| `state.peso` | `peso` | `Number(...)` | medio/alto, campo numerico de contrato |
| `state.simbolo_grafico` | `simbolo_grafico` | `String(...).trim()` | medio |
| `state.simbolo_grafico` | `mostrar_simbolo` | `!!String(...).trim()` | medio, derivado de texto, nao do booleano do state |
| `state.inativo` | `inativo` | `!!state?.inativo` | medio, booleano de status |
| `state.observacoes` | `observacoes` | `String(...).trim()` | medio |

### 8.2 Campo derivado de lista de fases

| Origem | Saida | Conversao aplicada | Observacao |
| --- | --- | --- | --- |
| `state.fases` | `fases` | `Array.isArray(...) ? ... : []` | default vazio |
| `x.codigo` | `codigo` | `String(...).trim()` | opcional |
| `x.descricao` | `descricao` | `String(...).trim()` | obrigatorio para manter a fase |
| indice do array | `sequencia` | `idx + 1` | o helper ignora `x.sequencia` de entrada |
| `x.tempo` | `tempo` | `Number(... )` | numerico |
| `descricao` vazia | item removido | `filter(x => x.descricao)` | evita fases sem descricao |

### 8.3 Campo derivado de lista de materiais

| Origem | Saida | Conversao aplicada | Observacao |
| --- | --- | --- | --- |
| `state.materiais` | `materiais` | `Array.isArray(...) ? ... : []` | default vazio |
| `x.material_id` | `material_id` | `Number(... )` | obrigatorio |
| `x.quantidade` | `quantidade` | `Number(... )` | obrigatorio |
| id e quantidade validos | item mantido | `filter(x => x.material_id > 0 && x.quantidade > 0)` | evita linhas vazias ou negativas |

## 9. Campos sensiveis
Campos mais sensiveis para regressao:

- `tempo`
- `custo_lab`
- `peso`
- `mostrar_simbolo`
- `inativo`
- `fases`
- `materiais`
- `codigo`
- `descricao`

Campos monetarios ou numericos sensiveis:

- `custo_lab`
- `tempo`
- `peso`
- `fases[].tempo`
- `materiais[].quantidade`
- `materiais[].material_id`

Nota:

- o helper nao faz parse monetario BR
- o helper assume estado interno ja normalizado
- se algum campo vier como string monetaria BR com virgula, `Number(...)` pode falhar

## 10. Dependencias externas e contratos relacionados
### 10.1 Dependencias diretas
`pgenPayloadFromState` nao chama diretamente:

- DOM
- `fetch`
- `requestJson`
- `procFmtMoeda`
- `procParse`
- `toFloat`
- `procFmtBr`
- `procCenario`

### 10.2 Dependencias de contrato
O helper depende indiretamente do contrato do backend:

- `POST /cadastros/procedimentos-genericos`
- `PUT /cadastros/procedimentos-genericos/{item_id}`
- `PUT /cadastros/procedimentos-genericos/{state.id}` nos fluxos de fases e materiais

O payload esperado pelo backend, conforme o modelo consultado, inclui:

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

### 10.3 Relacao com os chamados atuais
Chamadores observados no `frontend/app.js`:

- `pgenPersistirFases(state)`
- `pgenPersistirMateriais(state)`

Esses dois chamadores usam:

- `const payload = pgenPayloadFromState(state)`
- `requestJson("PUT", \`/cadastros/procedimentos-genericos/${state.id}\`, payload, true)`

Importante:

- `pgenSalvarEditor()` nao usa `pgenPayloadFromState`
- o salvamento principal ja tem payload inline proprio no `app.js`
- portanto, esta auditoria nao autoriza mover automaticamente o helper para o namespace passivo

## 11. Riscos
Riscos identificados:

- alterar nomes de campos e quebrar o backend
- alterar tipos numericos e gerar `NaN` ou coercao errada
- alterar `mostrar_simbolo` e mudar o comportamento visual do editor
- alterar `inativo` e inverter status
- alterar `fases[].sequencia` e desordenar fases
- alterar o filtro de `fases` e salvar fases vazias
- alterar o filtro de `materiais` e salvar materiais sem id ou sem quantidade
- alterar o contrato de `custo_lab` e afetar o fluxo monetario sensivel
- assumir que o helper faz parse BR, quando ele hoje nao faz
- extrair o helper sem antes comparar o payload com fixtures reais do editor

Riscos de contrato com outros blocos:

- `pgenDetalheParaEstado(data)` ainda e a porta de entrada do estado vindo do backend
- `procFmtMoeda` ja teve correcao recente e nao deve ser tocado nesta etapa
- `procParse` e `toFloat` sao compartilhados com outros modulos e nao devem ser reabertos agora

## 12. Classificacao e recomendacao
Classificacao:

- puro: sim
- extraivel agora: nao
- extraivel em futura subetapa: sim, mas apenas com testes de contrato e fixtures

Conclusao conservadora:

- `pgenPayloadFromState(state)` deve permanecer no `app.js` por enquanto
- ele pode virar candidato de uma futura Subetapa 5-B somente depois de validar o payload com fixtures reais e confirmar que nao ha dependencia de coercao implícita

Pre-condicoes para extracao futura:

- comparar a saida do helper com o payload inline atual usado em `pgenSalvarEditor()`
- validar estado vazio, estado parcial e estado completo com fases e materiais
- testar um item com:
  - sem fases
  - sem materiais
  - com uma fase valida
  - com um material valido
  - com valores numericos zero e positivos
- confirmar que o backend aceita o shape sem ajuste adicional

Menor teste seguro antes de extrair:

1. montar fixtures representativas do `state` interno
2. comparar JSON do helper com o payload esperado do editor
3. salvar e reabrir um procedimento genérico com fases e materiais em ambiente manual
4. confirmar que nenhum campo numeric ou booleano mudou de tipo

## 13. Onde testar antes de qualquer extracao futura
Antes de mover `pgenPayloadFromState(state)`, testar no navegador:

1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Procedimentos Genericos`.
3. Abrir um item existente com fases e materiais.
4. Conferir se o editor carrega `codigo`, `descricao`, `especialidade`, `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `inativo` e `observacoes`.
5. Conferir se o painel de custos continua coerente.
6. Conferir se as fases continuam ordenadas e persistidas.
7. Conferir se os materiais continuam com quantidade e custo corretos.
8. Salvar apenas se for seguro e reversivel.
9. Reabrir o item salvo.
10. Confirmar que console permanece sem `ReferenceError` ou `TypeError`.

Teste de apoio em console, se necessario, apenas com fixtures controlados:

- comparar o objeto montado manualmente com o shape do helper
- checar se `codigo` e `descricao` saem trimados
- checar se `fases` e `materiais` filtram itens invalidos

## 14. Resumo do estado do namespace
O namespace `window.BranaProcedimentosGenericosModule` permanece passivo e controlado.

Estado observado do modulo:

- namespace existe
- `getInfo()` existe
- `getStatus()` existe
- `info()` existe
- `statusDot(inativo)` existe
- `helpersExtraidos` contem apenas `pgenStatusDot(inativo)`
- `helpersCandidatosFuturos` ainda cita `pgenPayloadFromState(state)` como fronteira futura
- o modulo nao controla fluxo principal, DOM, API, payload, custos, materiais ou financeiro

## 15. Confirmacao final
- nenhum codigo foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules/procedimentos-genericos.js` nao foi alterado
- backend, banco e endpoints nao foram alterados
- nenhuma nova modularizacao foi feita
- `pgenPayloadFromState(state)` permanece no `app.js`
- a recomendacao atual e manter o helper no `app.js` ate uma Subetapa 5-B especifica de auditoria/extracao com fixtures

