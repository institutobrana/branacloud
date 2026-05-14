# Correção/Auditoria — Procedimentos Genéricos — valores monetários de custos e dependências

## 1. Contexto
Esta etapa foi uma auditoria corretiva conservadora do módulo Procedimentos Genéricos, antes de qualquer nova modularização.

O objetivo foi diagnosticar e corrigir, se seguro, a distorção de valores monetários exibidos na aba de custos do editor de Procedimentos Genéricos, sem mover lógica funcional para o namespace passivo e sem iniciar a Subetapa 2 de fronteiras e contratos.

## 2. Comandos iniciais executados
Comandos executados no início da análise:

```text
git branch --show-current
git status --short
git diff --stat
git log --oneline -10
```

Resultado observado:

```text
branch: modularizacao-segura-fase-1
```

```text
 M frontend/index.html
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

```text
 frontend/index.html | 1 +
 1 file changed, 1 insertion(+)
```

```text
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
```

## 3. Documentos lidos
Documentos obrigatórios encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- documentos que citam procedimento generico, pgen, material, cenarios financeiros, moeda, parse, decimal e virgula/ponto, encontrados via busca em `docs/`

Documentos ausentes entre os itens obrigatorios consultados:

- nenhum documento obrigatorio da lista acima estava ausente

## 4. Arquivos analisados
Arquivos de codigo analisados:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`

Arquivos de backend e contrato analisados apenas para auditoria de origem de dados:

- `backend/routes/cenario_routes.py`
- `backend/models/cenario.py`
- `backend/routes/procedimentos_routes.py`
- `backend/routes/materiais_routes.py`
- `backend/models/material.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`

## 5. Sintomas observados
Os sintomas observados na tela foram:

- `Custo da hora clínica` exibido como `R$ 13.889,00`
- valor esperado `R$ 138,89`
- `Custo de materiais` exibido como `R$ 62.700.000.000.010,00`
- valor claramente explodido por multiplicação de casa decimal / reinterpretação numérica

## 6. Origem provável dos valores
### Hora clínica
Origem provável:

- `GET /cenario`
- campo `cfph`
- armazenamento em `procCenario.cfph` em `frontend/app.js`
- exibição em `pgenCalcularCustos()`

O contrato backend mostrou `cfph` e `cfpm` como `Float`, então o valor chega como número e nao como centavos.

### Materiais
Origem provável:

- `GET /procedimentos/{id}`
- campo `materiais_vinculados`
- totais `total_custo_und` e `total_custo`
- custos individuais `custo_und`, `quantidade`, `custo_total`
- cálculo agregado em `procRenderLinks()` e `pgenCalcularCustos()`

O contrato backend também mostra `Material.custo` e `ProcedimentoGenericoMaterial.quantidade` como `Float`, então o problema não parecia ser centavos no contrato do backend.

## 7. Funções envolvidas
Funções pgen/procedimentos envolvidas no fluxo investigado:

- `pgenAbrir()`
- `pgenAbrirEditor(id)`
- `pgenCalcularCustos()`
- `pgenRenderLinks(data)`
- `pgenAtualizarCustoMaterialEditor()`
- `pgenMaterialEditSalvar()`
- `procCarregarCenario()`
- `procAplicarDadosEditor(data, resetLinks)`
- `procAtualizarFinanceiro()`
- `procRenderLinks(data)`
- `procFmtMoeda(v)`
- `toFloat(v)`
- `formatMoney(v)`
- `procFmtBr(v)`
- `procParse(v)`

## 8. Causa raiz encontrada
A causa raiz foi identificada com segurança.

A função compartilhada `procFmtMoeda(v)` estava definida como:

```js
const procFmtMoeda=(v)=>formatMoney(toFloat(v));
```

Esse comportamento era seguro para texto monetário em formato brasileiro, mas se tornava incorreto quando `v` já chegava como número real, por exemplo:

- `138.89` virava a string `"138.89"`
- `toFloat()` removia o ponto
- o valor se transformava em `13889`
- a exibição final virava `R$ 13.889,00`

O mesmo mecanismo afetava totais de materiais e outras saídas numéricas do módulo.

## 9. Alteração aplicada
Foi aplicada uma correção mínima e localizada em `frontend/app.js`.

Antes:

```js
const procFmtMoeda=(v)=>formatMoney(toFloat(v));
```

Depois:

```js
const procFmtMoeda=(v)=>{if(Number.isFinite(v))return formatMoney(v);const n=Number(v);return formatMoney(Number.isFinite(n)?n:toFloat(v))};
```

Efeito da correção:

- preserva números já numéricos
- mantém compatibilidade com strings numéricas simples
- mantém fallback para strings monetárias brasileiras, como `"R$ 138,89"`
- evita reaplicar parser BR em valores que já estão em ponto decimal puro

## 10. Justificativa da correção
A correção foi considerada segura porque:

- não altera backend
- não altera banco
- não altera endpoints
- não altera payloads
- não altera o namespace passivo de Procedimentos Genéricos
- não extrai helper novo
- não muda o fluxo de abertura, listagem, edição, salvamento ou exclusão
- corrige apenas a borda de exibição monetária que estava multiplicando por 100 valores já numéricos

## 11. Riscos de regressão
Riscos residuais:

- qualquer outro ponto que passe string não padronizada para `procFmtMoeda` precisa ser revisado se aparecer depois
- a função compartilhada agora aceita melhor números e strings dot-decimal, então call sites ocultos com formato muito heterogêneo devem ser testados manualmente

Módulos/pontos potencialmente impactados:

- Procedimentos
- Procedimentos Genéricos
- relatório e visualização de materiais vinculados
- totais e valores monetários exibidos via `procFmtMoeda`

Pontos preservados:

- `procParse(v)` permanece intocado
- `toFloat(v)` permanece intocado para os fluxos de entrada textual
- `frontend/js/modules/procedimentos-genericos.js` permaneceu intacto

## 12. Validações rápidas
Checks executados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/procedimentos-genericos.js`

Resultado:

- ambos passaram sem erro de sintaxe

Teste rápido de comportamento executado em linha de comando:

```text
["R$ 138,89","R$ 138,89","R$ 138,89","R$ 13.889,00","R$ 627.000.000.000,10"]
```

Casos testados:

- `procFmtMoeda(138.89)` -> `R$ 138,89`
- `procFmtMoeda("138,89")` -> `R$ 138,89`
- `procFmtMoeda("138.89")` -> `R$ 138,89`
- `procFmtMoeda("13.889,00")` -> `R$ 13.889,00`
- `procFmtMoeda(627000000000.1)` -> `R$ 627.000.000.000,10`

## 13. Estado do git
Estado antes da correção:

```text
 M frontend/index.html
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

Estado depois da correção:

```text
 M frontend/app.js
 M frontend/index.html
?? docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

`frontend/index.html` permaneceu como pendência preexistente e não foi alterado nesta correção.

## 14. Onde testar manualmente
Teste manual recomendado:

1. Fazer `Ctrl+F5`.
2. Abrir o sistema normalmente.
3. Abrir `Procedimentos Genéricos` pelo menu existente.
4. Abrir ou alterar o procedimento usado no teste.
5. Ir na aba de custos.
6. Confirmar que `Custo da hora clínica` mostra `R$ 138,89` e não `R$ 13.889,00`.
7. Confirmar que `Custo de materiais` não explode para `R$ 62.700.000.000.010,00`.
8. Confirmar que `Custo total` permanece coerente com hora clínica, tempo de execução, custo fixo/intervenção, protético e materiais.
9. Testar pelo menos um procedimento sem materiais vinculados.
10. Testar pelo menos um procedimento com materiais vinculados.
11. Testar cancelar/fechar sem salvar.
12. Se for seguro, testar salvar e reabrir para confirmar que o valor não foi gravado errado.
13. Confirmar console sem `ReferenceError` ou `TypeError`.
14. Confirmar que `window.BranaProcedimentosGenericosModule` continua carregando.
15. Confirmar que `window.BranaProcedimentosGenericosModule.getStatus()` continua retornando o status passivo esperado.

## 15. Confirmação final
- nenhuma modularização nova foi feita
- nenhum helper foi extraído
- backend, banco e endpoints não foram alterados
- `frontend/js/modules/procedimentos-genericos.js` não foi alterado
- `frontend/app.js` recebeu apenas a correção mínima no formatador monetário compartilhado
- `frontend/index.html` não recebeu nova alteração nesta correção
- a causa raiz foi identificada com segurança
- a correção aplicada é localizada e conservadora

