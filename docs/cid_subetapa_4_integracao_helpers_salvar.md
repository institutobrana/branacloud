# CID - Subetapa 4: integracao minima dos helpers no salvar

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. git status --short antes

```text
 M docs/cid_subetapa_0_mapeamento_monolitico.md
 M frontend/app.js
 M frontend/index.html
?? docs/cid_correcao_duplo_clique_checkbox_modal.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? docs/cid_subetapa_2_fronteiras_contratos.md
?? docs/cid_subetapa_3_helpers_puros.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? frontend/js/modules/cid.js
```

## 3. git status --short depois

```text
 M docs/cid_subetapa_0_mapeamento_monolitico.md
 M frontend/app.js
 M frontend/index.html
?? docs/cid_correcao_duplo_clique_checkbox_modal.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? docs/cid_subetapa_2_fronteiras_contratos.md
?? docs/cid_subetapa_3_helpers_puros.md
?? docs/cid_subetapa_4_integracao_helpers_salvar.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? frontend/js/modules/cid.js
```

## 4. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/cid.js`

## 5. Documentos consultados

- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/cid_subetapa_1_estrutura_modular_passiva.md`
- `docs/cid_subetapa_2_fronteiras_contratos.md`
- `docs/cid_subetapa_3_helpers_puros.md`
- `docs/cid_correcao_duplo_clique_checkbox_modal.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## 6. Arquivos alterados

- `frontend/app.js`
- `docs/cid_subetapa_4_integracao_helpers_salvar.md`

## 7. Funcao alterada

- `cidSalvarModal()`

## 8. Helpers integrados

- `window.BranaCidModule.helpers.validarCodigoCid(codigo)`
- `window.BranaCidModule.helpers.validarDescricaoCid(descricao)`
- `window.BranaCidModule.helpers.montarPayloadCid(codigo, descricao, observacoes, preferido)`

## 9. Confirmacao de fallback seguro

- Confirmado.
- Se `window.BranaCidModule` ou `helpers` nao existir, `cidSalvarModal()` continua usando a validacao local e `cidMontarPayload()`.
- Se o helper falhar ou retornar algo inesperado, o fluxo cai no fallback local antes de salvar.

## 10. Confirmacao de que endpoints nao foram alterados

- Confirmado.
- Permanecem os mesmos caminhos e metodos:
  - `POST /cid`
  - `PUT /cid/{id}`

## 11. Confirmacao de que requestJson nao foi alterado

- Confirmado.
- A chamada a `requestJson()` permanece a mesma.

## 12. Confirmacao de que modal/checkbox nao foram alterados

- Confirmado.
- Nao houve nova mudanca no HTML/CSS do modal nesta subetapa.
- O checkbox e seu espacamento permanecem como estavam apos as correcoes visuais anteriores.

## 13. Confirmacao de que busca/filtro nao foram alterados

- Confirmado.
- A integracao desta subetapa ficou restrita ao salvar.

## 14. Confirmacao de que binds/duplo-clique nao foram alterados

- Confirmado.
- Abertura da lista, selecao, duplo-clique e binds continuam com a mesma estrutura funcional anterior.

## 15. Confirmacao de que cid.js nao assumiu controle funcional

- Confirmado.
- O modulo `frontend/js/modules/cid.js` continua passivo e apenas expande o namespace com helpers puros.

## 16. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/cid.js`: OK

## 17. Riscos remanescentes

- A validacao funcional ainda depende do alinhamento exato entre o fluxo local e o contrato dos helpers.
- `compararTextoCid()` ainda nao foi integrado ao filtro, entao a busca continua 100% no monolito.
- Qualquer futura extracao de busca, renderizacao ou binds deve continuar em ciclo separado e conservador.

## 18. Recomendacao para Subetapa 5

- Auditar apenas a integracao feita em `cidSalvarModal()` e encerrar o ciclo desta parte se o comportamento manual continuar igual.
- Nao avancar para filtro/renderizacao/binds nesta rodada.

## 19. Onde testar no navegador

1. Fazer `Ctrl+F5`.
2. Abrir `Doenças (CID)...`.
3. Confirmar que a lista carrega.
4. Abrir `Nova doença...`.
5. Tentar salvar sem código, se houver validacao atual.
6. Tentar salvar sem doença/descrição, se houver validacao atual.
7. Salvar um CID válido, se for seguro no ambiente.
8. Abrir `Alterar doença` pelo botao `Altera...`.
9. Alterar e salvar um CID existente, se for seguro.
10. Abrir `Alterar doença` por duplo-clique.
11. Confirmar que o duplo-clique continua funcionando.
12. Confirmar que o checkbox continua alinhado e com espaco.
13. Marcar/desmarcar preferido e confirmar que o valor continua sendo salvo corretamente, se for seguro.
14. Testar busca/filtro.
15. Testar `Elimina`, se for seguro.
16. Fechar e reabrir CID.
17. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
