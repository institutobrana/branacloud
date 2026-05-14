# Subetapa 1 - Namespace passivo/controlado de Procedimentos genericos

Data: 2026-05-14

## 1. Contexto
Esta subetapa criou apenas um namespace passivo/controlado para Procedimentos genericos.

Referencias usadas:

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- `docs/unidades_subetapa_0_mapeamento_monolitico.md`

## 2. Comandos iniciais executados
Saidas registradas:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md

git diff --stat

```

## 3. Arquivos lidos
Documentos encontrados e analisados:

- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md`
- `docs/unidades_subetapa_0_mapeamento_monolitico.md`

Documentos ausentes observados na revisao:

- nenhum documento adicional obrigatorio ausente foi identificado nesta etapa

## 4. Arquivos alterados
Arquivos realmente alterados nesta etapa:

- `frontend/js/modules/procedimentos-genericos.js`
- `frontend/index.html`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`

`frontend/app.js` nao foi alterado.

## 5. Namespace criado
Namespace criado:

- `window.BranaProcedimentosGenericosModule`

Metodos expostos:

- `getInfo()`
- `getStatus()`
- `info()`

O namespace e passivo e nao executa fluxo funcional.

## 6. Conteudo informativo do namespace
Informacoes expostas:

- nome do modulo
- modulo
- versao da subetapa
- status passivo
- `ativo: false`
- `controlaFluxo: false`
- `moveuLogicaFuncional: false`
- lista documental de funcoes monoliticas
- lista de helpers candidatos futuros
- lista de dependencias compartilhadas
- lista de riscos conhecidos

Funcoes mapeadas no namespace:

- `pgenAbrir()`
- `pgenCarregar()`
- `pgenSelecionado()`
- `pgenSelecionar(id)`
- `pgenAbrirEditor(id)`
- `pgenSalvarEditor()`
- `pgenExcluirSelecionado()`
- `pgenAbrirFases()`
- `pgenFaseEditAbrir(idx)`
- `pgenFaseEditSalvar()`
- `pgenFaseExcluirSelecionada()`
- `pgenAbrirMateriais()`
- `pgenMaterialEditAbrir(idx)`
- `pgenMaterialEditSalvar()`
- `pgenMaterialExcluirSelecionado()`
- `pgenCarregarEspecialidades()`
- `pgenCarregarSimbolos()`
- `pgenCarregarAuxFases()`
- `pgenCarregarListasMateriais()`
- `pgenBuscarMateriais()`
- `pgenAtualizarCustoMaterialEditor()`
- `pgenCorrigirRotulos()`
- `pgenPayloadFromState(state)`
- `pgenDetalheParaEstado(data)`
- `pgenStatusDot(inativo)`

Helpers candidatos futuros:

- `pgenStatusDot(inativo)`
- `pgenPayloadFromState(state)`

## 7. Alteracao no index.html
O script foi inserido antes do carregamento de `frontend/app.js`:

```html
<script src="/frontend/js/modules/procedimentos-genericos.js?v=20260514-pgen-sub1"></script>
<script src="/frontend/app.js?v=20260513-medicamentos-sub1"></script>
```

## 8. O que NAO foi alterado
Confirmado explicitamente:

- `frontend/app.js` nao foi alterado
- nenhuma funcao funcional foi movida
- nenhum helper funcional foi extraido
- nenhuma chamada funcional foi delegada
- nenhum endpoint foi alterado
- nenhum backend foi alterado
- nenhum banco foi alterado
- nenhum comportamento funcional foi alterado

## 9. Riscos preservados
Riscos preservados para etapas futuras:

- o bloco legado e o bloco atual continuam no `app.js`
- fases e materiais continuam acoplados ao editor principal
- custo monetario continua sendo calculado no `app.js`
- dependencias com `Procedimentos` reais continuam intactas
- dependencias com `Materiais` continuam intactas
- dependencias com `Financeiro` continuam intactas
- a tela ainda depende de DOM montado dinamicamente

## 10. Checks finais
Checks executados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/procedimentos-genericos.js`
- `git diff --stat`
- `git status --short`

Resultado esperado:

- o novo namespace existe em `window.BranaProcedimentosGenericosModule`
- `frontend/app.js` permanece funcionalmente intacto
- `frontend/index.html` apenas carrega o novo modulo antes do `app.js`

## 11. Onde testar antes de avancar
1. Fazer Ctrl+F5.
2. Abrir o sistema normalmente.
3. Abrir o modulo `Procedimentos genericos` pelo menu existente.
4. Confirmar que a tela abre como antes.
5. Confirmar que listar, selecionar, novo, alterar, salvar/cancelar e fechar continuam com o mesmo comportamento.
6. Confirmar que nenhum erro novo aparece no console.
7. Opcionalmente conferir no console:
   - `window.BranaProcedimentosGenericosModule`
   - `window.BranaProcedimentosGenericosModule.getInfo()`
   - `window.BranaProcedimentosGenericosModule.getStatus()`

## 12. Critério de sucesso
A etapa e bem-sucedida se:

- o novo namespace passivo existir
- o `index.html` carregar o modulo antes do `app.js`
- `frontend/app.js` continuar como fonte funcional da verdade
- nenhuma funcao funcional de Procedimentos genericos tiver sido movida
- os checks passarem
- o comportamento visual e funcional permanecer igual

## 13. Recomendacao para a proxima subetapa
Proxima etapa recomendada:

- Subetapa 2: revisar fronteiras e contratos, validando com calma se `pgenStatusDot(inativo)` e `pgenPayloadFromState(state)` sao realmente puros e seguros para futura extracao.

## 14. Confirmacao final
- namespace passivo criado
- `frontend/js/modules/procedimentos-genericos.js` criado
- `frontend/index.html` alterado apenas para carregar o script
- `frontend/app.js` nao foi alterado
- nenhuma funcao funcional foi movida
- nenhuma delegacao funcional foi criada
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum commit foi feito
- comportamento funcional preservado
