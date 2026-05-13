# Auxiliares / Tabelas auxiliares - Subetapa 4 - Integracao minima de helpers puros

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. `git status --short` antes

```text
 M frontend/index.html
 A frontend/js/modules/auxiliares.js
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/auxiliares_subetapa_2_fronteiras_contratos.md
?? docs/auxiliares_subetapa_3_helpers_puros.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
```

## 3. `git status --short` depois

```text
 M frontend/app.js
 M frontend/index.html
 A frontend/js/modules/auxiliares.js
?? docs/auxiliares_subetapa_0_mapeamento_monolitico.md
?? docs/auxiliares_subetapa_1_namespace_passivo.md
?? docs/auxiliares_subetapa_2_fronteiras_contratos.md
?? docs/auxiliares_subetapa_3_helpers_puros.md
?? docs/auxiliares_subetapa_4_integracao_helpers_puros.md
?? docs/varredura_proximo_modulo_pos_medicamentos.md
```

## 4. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/auxiliares.js`

## 5. Documentos consultados

- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/auxiliares_subetapa_3_helpers_puros.md`
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/cid_subetapa_2_fronteiras_contratos.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`

## 6. Helpers avaliados

- `auxTipoEh(tipo, chave)`
- `auxNormalizarHexCor(value)`
- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`
- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`

## 7. Helpers integrados

- `auxTipoEh(tipo, chave)`
- `auxNormalizarHexCor(value)`

## 8. Helpers nao integrados nesta etapa

- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`
- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`

## 9. Justificativa da selecao

- `auxTipoEh` e `auxNormalizarHexCor` sao helpers textuais e de normalizacao estritamente parametrizados.
- Eles nao dependem de DOM, `requestJson`, `cadModal`, bind, estado global mutavel, shell ou endpoint.
- Os helpers de cor/apresentacao foram mantidos apenas no namespace passivo porque dependem indiretamente de `window.prestAgendaApresCorOptions` via fonte de cores e, no caso de `auxCorApresentacaoOpcoesHtml`, produzem HTML de `option`.
- Assim, a integracao nesta etapa ficou reduzida ao menor recorte seguro.

## 10. Confirmação de fallback

- Sim.
- `frontend/app.js` consulta `window.BranaAuxiliaresModule?.helpers?.auxTipoEh` e `window.BranaAuxiliaresModule?.helpers?.auxNormalizarHexCor` de forma opcional.
- Se o namespace passivo nao existir, se os helpers nao existirem, se a chamada falhar ou se o modulo nao carregar, o fluxo recai na implementacao local equivalente.

## 11. Confirmacao de que nao houve alteracao de fluxo principal

- `auxAbrir()` continua no `app.js`.
- `auxAplicarLayoutDesktop()` continua no `app.js`.
- `auxCarregarTipos()` continua no `app.js`.
- `auxCarregarItens()` continua no `app.js`.
- `auxSelecionarTipoLinha()` continua no `app.js`.
- `auxSelecionarItemLinha()` continua no `app.js`.
- `auxDialogItem()` continua no `app.js`.
- `auxExcluirItem()` continua no `app.js`.
- `auxPosSalvarDependencias()` continua no `app.js`.
- Nenhum endpoint foi alterado.
- Nenhum modal foi alterado.
- Nenhum bind foi alterado.
- Nenhuma renderizacao foi alterada.
- Nao houve mudanca de dispatcher ou menu.

## 12. Confirmacao de que `frontend/app.js` continua dono das funcoes `aux*`

- Sim.
- O monolito segue como fonte funcional da verdade.
- A integracao desta etapa foi apenas complementar e com fallback.

## 13. Confirmacao de que `frontend/index.html` nao foi alterado nesta etapa

- Confirmado.
- O HTML continua apenas com a carga do modulo passivo anterior.
- Nenhum ajuste novo de script foi necessario nesta Subetapa 4.

## 14. Confirmacao de que `frontend/js/modules/auxiliares.js` continua passivo

- Confirmado.
- O arquivo permanece como namespace controlado, com metadados e helpers.
- Nao registra eventos.
- Nao faz query de DOM.
- Nao faz `fetch`.
- Nao usa `requestJson`.
- Nao assume controle funcional.

## 15. Dependencias preservadas

- `requestJson`
- `cadModal`
- `planoEnsureUI`
- `bindStandardGridActivation`
- `agendaLegadoRecarregarStatus`
- `agendaSemanaRenderEventos`
- `ensurePanelChrome`
- `ensureModalChrome`
- `hideAllPanels`
- `closeWorkspacePanel`
- `workspaceEmpty`
- `footerMsg`

## 16. Riscos remanescentes

- O scaffold compartilhado com Plano de Contas continua sendo o principal ponto sensivel.
- Os helpers de cor/apresentacao continuam no namespace passivo por dependerem de fonte externa de cores.
- `auxPosSalvarDependencias()` segue no monolito e precisa continuar sendo preservado em qualquer extracao futura.

## 17. Recomendacao objetiva para a Subetapa 5

- Encerrar o ciclo com validacao manual do painel e, se tudo estiver consistente, manter este estado para commit.
- Nao integrar os helpers de cor/apresentacao na funcionalidade do `app.js`.
- Se houver nova extracao, ela deve vir apenas de helpers realmente puros e independentes.

## 18. Onde testar no navegador antes de avançar

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

## 19. Conclusao

- A Subetapa 4 foi aplicada de forma restrita ao recorte seguro definido.
- Apenas `auxTipoEh` e `auxNormalizarHexCor` entraram no caminho opcional do `app.js`.
- Os helpers de cor/apresentacao ficaram apenas no namespace passivo, sem uso funcional nesta etapa.
