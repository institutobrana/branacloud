# Subetapa 2 - Fronteiras e contratos de Etiquetas / Configuracao de modelos de etiqueta

## 1. Contexto

Esta etapa revisa contratos e fronteiras do modulo Etiquetas / Configuracao de modelos de etiqueta sem mover comportamento funcional.

Referencia obrigatoria:

- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`

Contexto registrado:

- branch esperada: `modularizacao-segura-fase-1`
- baseline funcional conhecido: `38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares`
- HEAD documental esperado: `1f7ed77 docs: registra varredura do proximo modulo pos-medicamentos`
- pendencias documentais pre-existentes:
  - `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
  - `docs/etiquetas_subetapa_1_namespace_passivo.md`
  - `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- objetivo conservador: validar pureza e fronteiras dos helpers candidatos sem extracao funcional ainda

## 2. Comandos iniciais executados

### `git branch --show-current`

```text
modularizacao-segura-fase-1
```

### `git status --short`

```text
 M frontend/index.html
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
?? docs/etiquetas_subetapa_1_namespace_passivo.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

### `git diff --stat`

```text
 frontend/index.html | 1 +
 1 file changed, 1 insertion(+)
```

### `git log --oneline -10`

```text
1f7ed77 docs: registra varredura do proximo modulo pos-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
795c664 Usa helper modular de status em Unidades com fallback
```

## 3. Arquivos lidos

Documentos obrigatorios encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos ausentes:

- nenhum

## 4. Arquivos de codigo analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/etiquetas.js`

## 5. Arquivos alterados

Arquivos realmente alterados nesta etapa:

- `frontend/js/modules/etiquetas.js`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`

Observacao:

- `frontend/index.html` nao foi alterado nesta etapa; o status acima reflete pendencia pre-existente de etapa anterior.
- `frontend/app.js` nao foi alterado nesta etapa.

## 6. Fronteira atual do modulo

Frente atual observada:

- o fluxo funcional principal continua no `app.js`
- o namespace passivo em `frontend/js/modules/etiquetas.js` agora expoe informacoes documentais e contratos
- a listagem, selecao, edicao, salvamento, exclusao e teste de impressao seguem 100% monoliticos
- os riscos preservados continuam concentrados em `etqEnsureUI`, `etqAbrir`, `etqCarregarDados`, `etqRender`, `etqAbrirModal`, `etqSalvarModal`, `etqExcluirSelecionado`, `etqTesteImprimir` e nos binds instalados no bootstrap do painel

## 7. Contrato de etqNumero

- assinatura atual: `etqNumero(valor, padrao)`
- entrada: qualquer valor e um fallback numerico
- saida: numero valido ou o fallback informado
- comportamento observado: converte a entrada para texto, troca virgula por ponto, tenta `Number(...)` e aplica `Number.isFinite`
- dependencias: nenhuma externa alem do argumento recebido
- efeitos colaterais: nenhum
- locais de chamada:
  - `etqSyncPreview()`
  - `etqLayoutFromItem(item)`
  - `etqSalvarModal()`
- classificacao: `PURO`
- justificativa: a saida depende apenas dos argumentos e nao ha acesso a DOM, API ou estado global
- risco de extracao futura: baixo

## 8. Contrato de etqFormatNumero

- assinatura atual: `etqFormatNumero(valor)`
- entrada: um valor numerico ou convertivel
- saida: string com duas casas e virgula, ou string vazia se o valor nao for finito
- comportamento observado: usa `Number(valor)`, valida finitude e formata com `toFixed(2).replace(".", ",")`
- dependencias: nenhuma externa alem do argumento
- efeitos colaterais: nenhum
- locais de chamada:
  - `etqAplicarPadraoSelecionado()`
  - `etqAbrirModal(modo)`
- classificacao: `PURO`
- justificativa: funcao deterministica, sem DOM, sem API e sem estado global
- risco de extracao futura: baixo

## 9. Contrato de etqLayoutFromItem

- assinatura atual: `etqLayoutFromItem(item)`
- entrada: objeto do modelo de etiqueta
- saida: objeto com dimensoes da pagina e lista de labels calculadas, ou `null` se o item for ausente
- comportamento observado: calcula grade de impressao a partir de `item.nro_colunas`, `item.nro_linhas`, `item.margem_esq`, `item.margem_sup`, `item.esp_horizontal`, `item.esp_vertical`, e trata o caso envelope
- dependencias: usa apenas o helper `etqNumero` e o objeto recebido
- efeitos colaterais: nenhum
- locais de chamada:
  - `etqTesteImprimir()`
- classificacao: `PURO`
- justificativa: depende apenas dos argumentos e de calculos locais; nao acessa DOM, fetch, estado global ou item selecionado diretamente
- risco de extracao futura: baixo

## 10. Dependencia com Preferencias

A dependencia com `pref-modelo-etiqueta` continua no fluxo funcional do `app.js`, especialmente em:

- `prefRenderCombosModelos()`
- `prefColetarPayloadModelos()`
- criacao do campo `pref-modelo-etiqueta`

Essa dependencia nao afeta diretamente nenhum dos tres helpers candidatos. Ela permanece no fluxo funcional do `app.js` e nao foi alterada.

## 11. Dependencia com impressao / teste de impressao

O helper `etqLayoutFromItem` e usado por `etqTesteImprimir()`, mas nao depende do mecanismo de impressao em si.

Conclusao:

- os helpers candidatos nao acessam janela, `print()`, `window.open()` ou DOM de impressao
- o fluxo de teste de impressao continua no `app.js`
- a extracao futura de `etqLayoutFromItem` parece segura, desde que a assinatura seja preservada

## 12. Atualizacao opcional do namespace passivo

O namespace foi atualizado com metadados passivos e documentais.

Metodo adicionado:

- `getContracts()`

Dados estaticos adicionados:

- descricao do ciclo de contratos
- classificacao documental dos helpers
- fronteiras preservadas

Confirmacoes:

- nao houve chamada funcional
- nao houve acesso a DOM
- nao houve acesso a API
- nao houve registro de eventos
- nao houve alteracao de estado funcional

## 13. O que nao foi alterado

Confirmado explicitamente:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado nesta etapa
- funcoes `etq*` nao foram movidas
- helpers nao foram extraidos
- chamadas funcionais nao foram alteradas
- namespace nao delega comportamento
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados

## 14. Recomendacao conservadora para Subetapa 3

Como os tres helpers candidatos foram classificados como `PURO` e o risco observado e baixo, a recomendacao conservadora para a Subetapa 3 e:

1. mover apenas `etqNumero` primeiro
2. manter wrapper/fallback no `app.js` se o padrao anterior do projeto exigir
3. preservar assinatura e comportamento
4. testar antes de mover o proximo helper
5. depois avaliar `etqFormatNumero`
6. por ultimo avaliar `etqLayoutFromItem`

Nao mexer em abertura, listagem, edicao, salvamento, exclusao ou impressao nessa proxima etapa.

## 15. Checks finais

### `node --check frontend/app.js`

```text
sem saida (exit code 0)
```

### `node --check frontend/js/modules/etiquetas.js`

```text
sem saida (exit code 0)
```

### `git status --short`

```text
 M frontend/index.html
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
?? docs/etiquetas_subetapa_1_namespace_passivo.md
?? docs/etiquetas_subetapa_2_fronteiras_contratos.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

### `git diff --stat`

```text
 frontend/index.html | 1 +
 1 file changed, 1 insertion(+)
```

Resultado esperado confirmado:

- `frontend/app.js` nao aparece alterado nesta etapa
- `frontend/index.html` nao recebeu alteracao nova nesta etapa
- as pendencias exibidas sao documentais ou dos arquivos desta etapa

## 16. Onde testar antes de avancar

1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuracao de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edicao.
7. Fechar edicao/modal, se existir.
8. Fechar e reabrir o painel.
9. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console, se possivel:

- `window.BranaEtiquetasModule`
- `window.BranaEtiquetasModule.getInfo && window.BranaEtiquetasModule.getInfo()`
- `window.BranaEtiquetasModule.getStatus && window.BranaEtiquetasModule.getStatus()`
- `window.BranaEtiquetasModule.getContracts && window.BranaEtiquetasModule.getContracts()`

Essas chamadas devem retornar apenas dados informativos e nao devem alterar tela, backend, banco ou estado funcional.

## 17. Confirmacao final

Confirmo explicitamente:

- Subetapa 2 concluida
- etapa foi de fronteiras e contratos
- nenhum comportamento funcional foi alterado
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado nesta etapa
- nenhum helper foi movido
- nenhuma funcao foi delegada
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum commit foi feito
