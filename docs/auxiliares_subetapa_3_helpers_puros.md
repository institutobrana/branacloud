# Auxiliares / Tabelas auxiliares - Subetapa 3 - Helpers puros

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. `git status --short` antes

```text
 M frontend/index.html
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/auxiliares_subetapa_2_fronteiras_contratos.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
?? frontend/js/modules/auxiliares.js
```

## 3. `git status --short` depois

```text
 M frontend/index.html
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/auxiliares_subetapa_2_fronteiras_contratos.md
?? docs/auxiliares_subetapa_3_helpers_puros.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
?? frontend/js/modules/auxiliares.js
```

## 4. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/auxiliares.js`

## 5. Documentos consultados

- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/cid_subetapa_2_fronteiras_contratos.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

## 6. Helpers avaliados

- `auxTipoEh(tipo, chave)`
- `auxNormalizarHexCor(value)`
- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`
- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`
- suporte interno observado para equivalencia:
  - fonte de cores normalizada a partir de `prestAgendaApresCorOptions()` quando disponivel

## 7. Helpers adicionados ao modulo

- `window.BranaAuxiliaresModule.helpers.auxTipoEh`
- `window.BranaAuxiliaresModule.helpers.auxNormalizarHexCor`
- `window.BranaAuxiliaresModule.helpers.auxCorrigirMojibake`
- `window.BranaAuxiliaresModule.helpers.auxCorApresentacaoNormLabelKey`
- `window.BranaAuxiliaresModule.helpers.auxCorApresentacaoHexPorLabel`
- `window.BranaAuxiliaresModule.helpers.auxCorApresentacaoCorLabel`
- `window.BranaAuxiliaresModule.helpers.auxCorApresentacaoOpcoesHtml`

## 8. Helpers nao adicionados

- Nao houve candidato publico avaliado e deixado de fora entre os sete helpers principais.
- `auxCorApresentacaoFonteSistema()` foi mantido apenas como apoio interno do modulo para preservar a equivalencia da logica de apresentacao sem expor mais superficie publica do que o necessario.

## 9. Justificativa de pureza de cada helper

### `auxTipoEh(tipo, chave)`

- Pureza confirmada.
- Recebe apenas parametros.
- Faz apenas normalizacao e comparacao de texto.
- Nao consulta DOM.
- Nao usa `requestJson`.
- Nao usa `cadModal`.
- Nao registra binds.
- Nao altera estado global.

### `auxNormalizarHexCor(value)`

- Pureza confirmada.
- Transforma apenas o valor recebido.
- Nao depende de DOM, estado, modal, requestJson ou endpoints.

### `auxCorrigirMojibake(texto)`

- Pureza confirmada.
- Opera somente sobre a string de entrada.
- Nao produz efeito colateral.

### `auxCorApresentacaoNormLabelKey(texto)`

- Pureza confirmada.
- Normaliza a chave textual sem tocar em DOM, estado ou API.

### `auxCorApresentacaoHexPorLabel(label)`

- Considerado seguro para esta subetapa.
- Usa a lista de cores do proprio namespace como fonte de leitura, sem alterar estado.
- Nao usa DOM, modal, binds, requestJson ou endpoints.

### `auxCorApresentacaoCorLabel(hex)`

- Considerado seguro para esta subetapa.
- E derivado do mesmo contrato textual/nominal da apresentacao de cores.
- Nao produz efeito colateral.

### `auxCorApresentacaoOpcoesHtml(corAtual)`

- Considerado seguro para esta subetapa.
- Apenas formata HTML de opcoes a partir de fonte de cores lida de maneira passiva.
- Usa escape local e nao conversa com DOM, modal, binds, requestJson ou endpoints.

## 10. Confirmacao de que nao houve alteracao de fluxo principal

- Confirmado.
- Nao houve alteracao em `auxAbrir()`.
- Nao houve alteracao em `auxAplicarLayoutDesktop()`.
- Nao houve alteracao em `auxCarregarTipos()`.
- Nao houve alteracao em `auxCarregarItens()`.
- Nao houve alteracao em `auxSelecionarTipoLinha()`.
- Nao houve alteracao em `auxSelecionarItemLinha()`.
- Nao houve alteracao em `auxDialogItem()`.
- Nao houve alteracao em `auxExcluirItem()`.
- Nao houve alteracao em `auxPosSalvarDependencias()`.
- Nao houve alteracao em `cadModal`.
- Nao houve alteracao em `planoEnsureUI()`.
- Nao houve alteracao em `requestJson`.
- Nao houve alteracao em binds, renderizacao, menu ou dispatcher.

## 11. Confirmacao de que `frontend/app.js` continua dono das funcoes `aux*`

- Sim.
- O monolito continua responsavel pelo fluxo funcional completo do modulo.
- O modulo passivo apenas recebeu helpers puros no namespace controlado.

## 12. Confirmacao de que nao houve alteracao de endpoints

- Confirmado.
- Nenhum endpoint foi mudado nesta etapa.

## 13. Confirmacao de que nao houve alteracao de modal / `cadModal`

- Confirmado.
- O modal compartilhado continua igual ao da etapa anterior.

## 14. Confirmacao de que nao houve alteracao de `requestJson`

- Confirmado.
- A integracao com API continua inteiramente no `app.js`.

## 15. Confirmacao de que nao houve alteracao de binds

- Confirmado.
- Nenhum evento novo foi registrado e nenhum listener funcional foi movido.

## 16. Confirmacao de que nao houve alteracao de agenda

- Confirmado.
- `auxPosSalvarDependencias()` permaneceu no monolito.
- Nao houve mudanca na relacao com `agendaLegadoRecarregarStatus` ou `agendaSemanaRenderEventos`.

## 17. Estrutura final do namespace passivo

- `window.BranaAuxiliaresModule`
- `meta`
- `nome`
- `subetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `helpers`
- `funcoesMonoliticas`
- `helpersCandidatosFuturos`
- `dependenciasCompartilhadas`
- `endpoints`
- `getInfo()`
- `getStatus()`
- `info()`

## 18. Riscos remanescentes

- O scaffold compartilhado com Plano de Contas continua sendo a principal area sensivel.
- O contrato com `cadModal` continua compartilhado e heterogeneo entre tipos auxiliares.
- `auxPosSalvarDependencias()` segue sendo um ponto de efeito colateral em agenda e nao deve ser extraido sem analise propria.
- Alguns helpers de cor ainda dependem da fonte de opcoes fornecida por `prestAgendaApresCorOptions()`, entao qualquer integracao futura deve manter esse contrato.

## 19. Recomendacao objetiva para a Subetapa 4

- A proxima subetapa deve ser apenas de integracao minima e opcional, se existir um ponto realmente pequeno e reversivel.
- O candidato natural e um helper textual simples, mas para Auxiliares o maior ganho agora e manter a separacao de responsabilidades sem tocar em modal, agenda ou scaffold.
- Se houver integracao, ela deve seguir o padrao de fallback local ja usado nos ciclos anteriores.

## 20. Onde testar no navegador antes de avançar

1. Fazer `Ctrl+F5`.
2. Abrir `Configurações > Tabelas auxiliares...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista de tipos carrega.
5. Trocar o tipo selecionado.
6. Selecionar um item e conferir o destaque.
7. Testar `Novo`.
8. Testar `Altera`.
9. Testar `Elimina`, se for seguro.
10. Abrir algum tipo que use cor/apresentacao, se existir na lista.
11. Fechar e reabrir o painel.
12. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
13. Se possivel, testar no console:
    - `window.BranaAuxiliaresModule`
    - `window.BranaAuxiliaresModule.helpers`
    - `window.BranaAuxiliaresModule.getInfo && window.BranaAuxiliaresModule.getInfo()`
    - `window.BranaAuxiliaresModule.getStatus && window.BranaAuxiliaresModule.getStatus()`

## 21. Conclusao

- A Subetapa 3 foi concluida sem alterar o fluxo principal.
- Os helpers puros e seguros foram levados para o modulo passivo, com contrato preservado e sem mexer em endpoints, modal, binds, agenda ou renderizacao.
