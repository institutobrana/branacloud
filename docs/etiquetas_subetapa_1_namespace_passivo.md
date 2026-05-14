# Subetapa 1 — Namespace passivo de Etiquetas / Configuração de modelos de etiqueta

## 1. Contexto

Esta etapa criou apenas um namespace passivo/controlado para o módulo de Etiquetas / Configuração de modelos de etiqueta.

Referência documental da Subetapa 0:

- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`

Contexto registrado:

- branch esperada: `modularizacao-segura-fase-1`
- baseline funcional conhecido: `38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares`
- HEAD documental real esperado: `1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos`
- pendências documentais pré-existentes:
  - `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
  - `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- objetivo conservador da etapa: expor apenas informações documentais e um namespace passivo, sem mover comportamento funcional

## 2. Comandos iniciais executados

### `git branch --show-current`

```text
modularizacao-segura-fase-1
```

### `git status --short`

```text
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
```

### `git diff --stat`

```text
```

### `git log --oneline -10`

```text
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
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

Documentos obrigatórios encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos obrigatórios ausentes:

- nenhum

## 4. Arquivos alterados

Arquivos alterados nesta etapa:

- `frontend/js/modules/etiquetas.js`
- `frontend/index.html`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`

Nenhum outro arquivo foi alterado nesta etapa.

## 5. Namespace criado

Namespace criado:

- `window.BranaEtiquetasModule`

Métodos expostos:

- `getInfo()`
- `getStatus()`

O namespace é passivo/controlado: ele apenas expõe informações documentais e não executa fluxo funcional.

## 6. Conteúdo informativo do namespace

O namespace expõe informações documentais sobre o módulo, incluindo:

- nome do módulo: `Etiquetas / Configuração de modelos de etiqueta`
- versão da subetapa: `subetapa-1-namespace-passivo`
- função principal mapeada: `etqAbrir`
- helpers candidatos documentais:
  - `etqNumero`
  - `etqFormatNumero`
  - `etqLayoutFromItem`
- aviso explícito de que o namespace é passivo
- aviso explícito de que nenhuma função funcional foi movida

Além disso, o namespace mantém listas documentais de funções mapeadas e helpers candidatos, sem chamar nenhuma delas.

## 7. Alteração no index.html

O script foi inserido no bloco de módulos já carregados, antes do `frontend/app.js`.

Posição observada:

- após `frontend/js/modules/auxiliares.js?v=20260513-aux-sub1`
- antes de `frontend/app.js?v=20260513-medicamentos-sub1`

Confirmação:

- `frontend/js/modules/etiquetas.js` é carregado antes de `frontend/app.js`
- a ordem dos demais scripts não foi alterada

## 8. O que NÃO foi alterado

Confirmado explicitamente:

- `frontend/app.js` não foi alterado
- nenhuma função foi movida
- nenhum helper foi extraído
- nenhum wrapper foi criado
- nenhuma chamada funcional foi delegada
- nenhum endpoint foi alterado
- nenhum backend foi alterado
- nenhum banco foi alterado
- nenhum comportamento funcional foi alterado

## 9. Riscos preservados

Os riscos mapeados na Subetapa 0 permanecem preservados para etapas futuras:

- `etqAbrir` continua no `app.js`
- o fluxo de abertura continua no `app.js`
- a listagem continua no `app.js`
- a seleção continua no `app.js`
- a edição continua no `app.js`
- o salvamento continua no `app.js`
- a exclusão continua no `app.js`
- o teste de impressão continua no `app.js`
- a dependência com Preferências via `pref-modelo-etiqueta` não foi tocada

## 10. Checks finais

### `node --check frontend/app.js`

```text
sem saída (exit code 0)
```

### `node --check frontend/js/modules/etiquetas.js`

```text
sem saída (exit code 0)
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

Resultado esperado confirmado:

- aparecem apenas pendências documentais e os arquivos desta etapa
- `frontend/app.js` não aparece como alterado
- não houve alteração em backend, banco ou endpoints

## 11. Onde testar antes de avançar

1. Abrir o sistema no navegador com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta` no menu.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edição.
7. Fechar edição/modal, se existir.
8. Fechar e reabrir o painel.
9. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console, se possível:

- `window.BranaEtiquetasModule`
- `window.BranaEtiquetasModule.getInfo && window.BranaEtiquetasModule.getInfo()`
- `window.BranaEtiquetasModule.getStatus && window.BranaEtiquetasModule.getStatus()`

Essas chamadas devem retornar dados informativos/passivos e não devem alterar tela, dados, backend ou estado funcional.

## 12. Recomendação para Subetapa 2

Recomendação conservadora:

- revisar contratos e fronteiras do módulo
- validar se `etqNumero`, `etqFormatNumero` e `etqLayoutFromItem` são realmente puros e seguros para futura extração
- não mover helpers na Subetapa 2 sem nova validação

## 13. Confirmação final

Confirmo explicitamente:

- namespace passivo criado
- `frontend/js/modules/etiquetas.js` criado
- `frontend/index.html` alterado apenas para carregar o script
- `frontend/app.js` não foi alterado
- nenhuma função funcional foi movida
- nenhuma delegação funcional foi criada
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito
- comportamento funcional preservado
