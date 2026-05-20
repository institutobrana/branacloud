# Intervencoes / Procedimentos - Correcao / Auditoria funcional

## Contexto

Esta etapa tratou dois pontos sensiveis no modulo de Intervencoes / Procedimentos:

1. O botao `% Reajusta tabela...` na tela de tabelas.
2. O combo de `Procedimento Generico` quando o usuario escolhe `Selecione...` e a grade de materiais precisa limpar os herdados antigos.

Foram respeitados os contratos ja consolidados para Materiais, Procedimentos Genericos e Intervencoes.

## Estado inicial de referencia

- Branch: `modularizacao-segura-fase-1`
- Commit consolidado: `a18cb48 - Conclui modularizacao segura parcial de materiais`
- `git diff --cached --stat`: vazio
- `git diff --stat`: antes da correcao mostrava apenas a alteracao anterior em `frontend/index.html`
- `git status --short`: continha as pendencias untracked preexistentes e os artefatos desta frente

## Diagnostico do botao `% Reajusta tabela...`

### O que foi encontrado

- O botao existe em `frontend/index.html` com o id `proc-btn-reajuste`.
- Em `frontend/app.js`, o botao esta ligado a `procReajustarTabela`.
- A funcao encontrada nao abre modal nem tela de reajuste.
- O corpo atual da funcao era apenas um stub com mensagem de rodape.
- Nao foi localizada rota backend especifica para reajuste de tabela nos caminhos auditados.
- Nao foi encontrado modal web pronto para esse fluxo.

### Conclusao

- O problema nao era falta de bind.
- O problema era ausencia de implementacao funcional no web atual.
- Nesta etapa nao foi criada implementacao nova para nao inventar fluxo completo sem base web existente.

### Recomendacao

- Se o fluxo de reajuste existir em legado e precisar ser reativado, ele deve ser documentado antes de qualquer restauracao.
- Caso nao exista no web atual, a proxima etapa deve ser apenas um levantamento documental adicional, nao uma extracao.

## Diagnostico do problema `Selecione...`

### Causa encontrada

- O editor calculava o estado visual dos materiais a partir do combo de `Procedimento Generico`.
- Havia fallbacks que podiam reaproveitar o `procedimento_generico_id` antigo quando o combo estava vazio.
- Isso fazia a recomposicao continuar usando o genérico anterior em vez de zerar a parte herdada.

### Blocos afetados

- `procAtualizarMateriaisEditorVisualizacao`
- `procRecarregarLinks`
- `procAplicarDadosEditor`

### Correcao aplicada

- A visualizacao passou a considerar apenas o valor atual do combo.
- Quando o combo esta vazio, o valor visual passa a ser `0`.
- Assim, o editor recompõe apenas os materiais proprios reais e remove os herdados antigos da visualizacao.
- O payload de salvamento ja permanecia coerente com `null` quando o combo esta vazio.

## Contratos preservados

- Materiais proprios continuam proprios.
- Materiais herdados continuam herdados.
- `procedimento_generico_id` vazio continua significando `null`/vazio.
- Herdados antigos saem ao trocar para `Selecione...`.
- Proprios reais permanecem.
- Lista vazia continua valida quando nao houver proprios.
- Deduplicacao por `material_id` permanece.
- Criterio de proprio vence herdado permanece.
- Nao houve mexida em calculo financeiro/custos.
- Nao houve mexida em backend, schema, migrations ou endpoints.
- O namespace `frontend/js/modules/intervencoes-procedimentos.js` permaneceu passivo.

## Arquivos alterados

- `frontend/app.js`
- `docs/intervencoes_procedimentos_correcao_reajuste_tabela_e_selecione_materiais.md`

## Checks realizados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/intervencoes-procedimentos.js`

## Resumo do diff

- Correcao pequena no editor de materiais de procedimentos para nao reaproveitar o genérico anterior quando o combo estiver vazio.
- Documento de auditoria e correcao adicionado.
- Nao houve criacao de novo fluxo de reajuste.

## Onde testar antes de avancar

1. Fazer `Ctrl+F5`.
2. Abrir `Configuracoes > Tabelas > Intervencoes / Procedimentos...`.
3. Abrir um procedimento que possua materiais herdados.
4. Trocar o combo de `Procedimento Generico` para `Selecione...`.
5. Confirmar que os herdados antigos somem.
6. Confirmar que os proprios reais permanecem.
7. Confirmar que a grade fica vazia se nao houver proprios.
8. Trocar para outro Procedimento Generico e validar que os novos herdados entram.
9. Clicar em `% Reajusta tabela...` e confirmar que, no estado atual, o web nao oferece modal funcional de reajuste.
10. Verificar console e rede do navegador.

