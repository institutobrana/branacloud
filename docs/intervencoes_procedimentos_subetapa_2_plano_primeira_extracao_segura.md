# Intervencoes / Procedimentos - Subetapa 2 (Documental)

Data: 2026-05-18

## 1) Resumo Executivo

- A Subetapa 1 (namespace passivo) foi regularizada e enviada ao GitHub no commit `efe78f6`.
- A modularizacao do modulo **ainda nao moveu logica real** do `frontend/app.js` para `frontend/js/modules/intervencoes-procedimentos.js`.
- Esta Subetapa 2 e **somente documental** e tem como objetivo escolher o **primeiro bloco minimo e seguro** para extracao futura, sem tocar em vinculos, materiais, genericos, custos ou reajuste de tabela.

## 2) Estado Atual (somente leitura)

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Ultimo commit (oneline): `efe78f6 Subetapa 1: namespace passivo Intervencoes Procedimentos`
- Commits recentes (contexto):

```
efe78f6 Subetapa 1: namespace passivo Intervencoes Procedimentos
a205870 Documenta fechamento do ciclo de reajuste de tabela
5e96bdd Subetapa B2A: aplicar reajuste de tabela com confirmacao
0755bc6 Subetapa B1: preview reajuste de tabela sem gravacao
```

- `git diff --stat`: (vazio)
- `git diff --cached --stat`: (vazio)
- `git status --short` (resumo):
  - Existem muitos arquivos `??` untracked antigos (pendencias preexistentes, fora do escopo desta subetapa).
  - Nenhum arquivo tracked foi alterado nesta subetapa.

## 3) Mapa Resumido do frontend/app.js (Procedimentos / Intervencoes)

Base de referencia: Subetapa 0 documental (mapeamento monolitico).

### 3.1 Grupos principais observados

- Inicializacao/estado do modulo:
  - caches e estados (`procedimentosCache`, `procedimentoAtualId`, `procedimentoLinks`, `procEditorSnapshot`, `procMateriaisGenerico*`, `procCenario`, etc.).
  - referencias de UI (`proc`, `procTabelaModal`, `procReajusteModal`, `procRelatorio`, etc.).

- Helpers de parse/formatacao/normalizacao:
  - exemplos encontrados no `app.js`:
    - `procParse` (parse numerico com virgula/ponto)
    - `procFmtBr` (formatacao 2 casas com virgula)
    - `procFmtMoeda` (formatacao monetaria via helper global)
    - `procFormatarCampoBr` (aplica parse+format no input)

- Lista, filtros e tabela:
  - `abrirProcedimentos`, `procCarregarFiltros`, `procCarregarLista`, `procRenderList`, `procTabelaSelecionadaAtual`, etc.

- Editor de procedimento:
  - abertura/fechamento: `procAbrirEditor`, `procFecharEditor`
  - preenchimento: `procAplicarDadosEditor`
  - combos: `procCarregarCombosEditor`
  - salvamento: `procSalvar` (sensivel)

- Vinculos de materiais / heranca (sensivel):
  - `procRenderLinks`, `procRecarregarLinks`, `procEditarVinculoSelecionado`, `procConfirmarVinculo`
  - recomposicao por generico: `procAtualizarMateriaisEditorVisualizacao`, `procComporMateriaisEditorPorGenerico`, etc.

- Calculo financeiro/custos (sensivel):
  - `procAtualizarFinanceiro` (usa `procCenario`, custo de materiais e custo laboratorio)

- Reajuste de tabela (concluido em B1/B2A; nao mexer agora):
  - `procReajuste*` e binds do modal (fora do escopo da modularizacao agora)

### 3.2 Funcoes sensiveis (nao extrair na proxima etapa)

Proibido selecionar como "primeira extracao":

- materiais/vinculos/heranca:
  - `procAtualizarMateriaisEditorVisualizacao`
  - `procRecarregarLinks`
  - `procRenderLinks`
  - `procConfirmarVinculo`
  - `procEditarVinculoSelecionado`
  - `procComporMateriaisEditorPorGenerico`

- dados persistidos / CRUD:
  - `procSalvar`
  - `procExcluirSelecionado`
  - exclusoes de tabela/vinculos

- reajuste de tabela:
  - `procReajustePreview`
  - `procReajusteAplicar`
  - `procReajustarTabela`

- custos/calculo:
  - `procAtualizarFinanceiro`

Motivo: alto risco de regressao em contratos ja estabilizados (proprios/herdados, deduplicacao, "Selecione...", duplo clique, bloqueio de duplicidade, custos e ciclo de reajuste).

## 4) Contratos Que Nao Podem Ser Quebrados (referencia)

Esta modularizacao deve preservar integralmente:

- material proprio permanece local da intervencao;
- material herdado vem do Procedimento Generico atual;
- deduplicacao por `material_id`;
- proprio vence herdado;
- troca de generico troca herdados e preserva proprios;
- "Selecione..." remove herdados e preserva proprios reais;
- material proprio nao entra no generico e nao aparece em outra intervencao;
- reajuste de tabela atua somente em `procedimento.preco` e `procedimento.valor_repasse` e nao toca materiais/genericos/vinculos.

## 5) Blocos Proibidos Para a Proxima Etapa (Subetapa 2A)

- Qualquer logica ligada a:
  - vinculos de materiais, heranca e recomposicao;
  - `procedimento_generico_id` e troca de generico;
  - salvamento/exclusao;
  - duplicidade/duplo clique em vinculos;
  - reajuste de tabela (B1/B2A);
  - backend/endpoints.

## 6) Bloco Recomendado Para a Primeira Extracao Segura (Subetapa 2A)

### 6.1 Recomendacao

Extrair **apenas helpers de parse/formatacao numerica** do dominio de Procedimentos, mantendo compatibilidade:

- `procParse` (linha aproximada: 672)
- `procFmtBr` (linha aproximada: 674)

Opcional (avaliar somente se realmente ficar isolado e sem impacto):

- `procFormatarCampoBr` (linha aproximada: 3460) - altera somente `el.value` e e acionado em blur; nao faz fetch nem grava.

### 6.2 Por que e seguro

- Sao funcoes pequenas e de efeito colateral minimo (parse/formatacao).
- Nao fazem `fetch`/`requestJson`.
- Nao alteram banco/dados persistidos por si.
- Nao tocam em materiais, vinculos, heranca, `procedimento_generico_id` ou reajuste.
- Permitem um teste simples: abrir editor e verificar parse/formatacao nos campos de preco/lab/repasse.

### 6.3 Riscos e mitigacoes

- Risco: helpers podem ser usados em outros pontos do `app.js` (escopo amplo).
  - Mitigacao: na Subetapa 2A, manter wrappers no `app.js` com os mesmos nomes (`procParse`, `procFmtBr`) chamando o modulo, para nao mudar chamadores.
- Risco: `procFmtMoeda` depende de helper global (`formatMoney`/`toFloat`), e entra em calculo financeiro.
  - Decisao: **nao extrair `procFmtMoeda` agora** (deixar para etapa posterior, apos testes focados em calculo/custos).

## 7) Alternativas Avaliadas e Descartadas (por risco)

- Extrair `procAtualizarFinanceiro`:
  - descartado (custo/material/lab, depende de `procCenario`, risco alto).
- Extrair `procAplicarDadosEditor`:
  - descartado (toca `procedimento_generico_id`, aciona renderizacao de vinculos e recomposicao visual).
- Extrair `procRecarregarLinks`/`procRenderLinks`:
  - descartado (vinculos, heranca, duplo clique, deduplicacao, risco central).
- Extrair `procReajuste*`:
  - descartado (ciclo de reajuste acabou de ser estabilizado; nao misturar com modularizacao).
- Extrair `esc`:
  - descartado como "primeira extracao" porque e utilitario global usado por varios modulos, e nao e exclusivo de Procedimentos.

## 8) Plano da Proxima Subetapa Funcional (Subetapa 2A) - Sem Implementar Agora

Objetivo: mover somente o bloco recomendado, sem mudar comportamento.

Arquivos que **seriam alterados** na Subetapa 2A:

- `frontend/js/modules/intervencoes-procedimentos.js`
  - adicionar um namespace passivo+helpers (por exemplo `helpers.procParse`, `helpers.procFmtBr`), sem registrar eventos e sem chamadas de rede.
- `frontend/app.js`
  - manter compatibilidade: wrappers com o mesmo nome chamando o modulo (ou fallback para implementacao local se o modulo nao estiver disponivel).

Arquivos que **nao** devem ser alterados na Subetapa 2A:

- `frontend/index.html` (nao mexer)
- backend (nao mexer)
- qualquer arquivo ligado a materiais/vinculos/genericos/reajuste

## 9) Checks Obrigatorios (Subetapa 2A)

- `node --check frontend/app.js`
- `node --check frontend/js/modules/intervencoes-procedimentos.js`

## 10) Onde Testar (Subetapa 2A)

1. Ctrl+F5.
2. Abrir: Configuracoes > Tabelas > Intervencoes / Procedimentos...
3. Abrir procedimento existente (com e sem generico).
4. Focar em campos de preco/lab/repasse:
   - digitar valores com virgula e ponto;
   - sair do campo (blur) e confirmar formatacao.
5. Conferir que materiais proprios/herdados continuam iguais (apenas observacao, sem salvar).
6. Botao `% Reajusta tabela...`:
   - abrir modal e rodar Preview somente (nao aplicar em tabela real).
7. Verificar console do navegador (sem novos erros).

## 11) Recomendacao Objetiva

- Primeira extracao (Subetapa 2A): **apenas `procParse` + `procFmtBr`**.
- Manter `procFmtMoeda` e qualquer logica de custo/vinculos/heranca/reajuste fora da modularizacao inicial.
- Proximo prompt recomendado (Subetapa 2A):
  - "Mover `procParse` e `procFmtBr` para `frontend/js/modules/intervencoes-procedimentos.js` como helpers, mantendo wrappers no `frontend/app.js`, sem alterar comportamento e sem mudar textos; rodar `node --check` nos dois arquivos."

## 12) Notas / Limitacoes

- O arquivo `docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md` nao foi localizado neste workspace no momento desta subetapa (nao foi possivel ler como fonte adicional). Caso exista em outro local/branch, deve ser incorporado como referencia antes de extracoes sensiveis (vinculos/heranca).
