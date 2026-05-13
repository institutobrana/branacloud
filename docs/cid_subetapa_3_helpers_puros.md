# CID - Subetapa 3: helpers puros

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
- `docs/cid_correcao_duplo_clique_checkbox_modal.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## 6. Arquivos alterados

- `frontend/js/modules/cid.js`
- `docs/cid_subetapa_3_helpers_puros.md`

## 7. Helpers criados

- `window.BranaCidModule.helpers.normalizarCodigoCid(codigo)`
- `window.BranaCidModule.helpers.validarCodigoCid(codigo)`
- `window.BranaCidModule.helpers.validarDescricaoCid(descricao)`
- `window.BranaCidModule.helpers.montarPayloadCid(codigo, descricao, observacoes, preferido)`
- `window.BranaCidModule.helpers.compararTextoCid(texto, termo)`

## 8. Confirmacao de que frontend/app.js nao foi alterado nesta etapa

- Confirmado.
- O `app.js` permaneceu com as correcoes funcionais anteriores, mas nao recebeu nova alteracao nesta subetapa.
- Nao houve integracao funcional dos helpers no monolito.

## 9. Confirmacao de que frontend/index.html nao foi alterado nesta etapa

- Confirmado.
- O HTML continua carregando `frontend/js/modules/cid.js` antes de `frontend/app.js`.
- Nao houve mudanca nova no cache-bust nesta subetapa.

## 10. Confirmacao de que nao houve integracao funcional ainda

- Confirmado.
- Os helpers foram adicionados apenas ao namespace passivo `window.BranaCidModule`.
- Nao houve wrapper, nao houve uso dos helpers em `app.js` e nao houve impacto no fluxo funcional.

## 11. Confirmacao de que cid.js continua sem DOM, fetch, requestJson, binds e estado global

- Confirmado.
- Os helpers sao puramente parametrizados.
- O modulo continua sem `document.querySelector`, sem `fetch`, sem `requestJson`, sem binds e sem acesso a cache/lista/estado do CID.

## 12. Confirmacao de que endpoints nao foram alterados

- Confirmado.
- Continuam inalterados:
  - `GET /cid`
  - `POST /cid`
  - `PUT /cid/{id}`
  - `DELETE /cid/{id}`

## 13. Confirmacao de que modal/salvar/excluir nao foram alterados

- Confirmado.
- Nenhum trecho do modal, do salvar ou do excluir foi movido para o modulo.

## 14. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/cid.js`: OK

## 15. Riscos remanescentes

- `validarCodigoCid()` e `validarDescricaoCid()` ainda nao estao integrados ao fluxo funcional; o contrato foi preparado, mas a validacao real continua no `app.js`.
- `compararTextoCid()` ainda nao e usada pelo filtro funcional.
- A integracao futura precisa respeitar o formato atual do payload e a mensagem de validacao para nao alterar comportamento.

## 16. Recomendacao para Subetapa 4

- Integrar os helpers no `app.js` somente nos pontos triviais de validacao e montagem de payload, com fallback local.
- Nao mexer em renderizacao, eventos ou modal antes disso.

## 17. Onde testar no navegador

- Como nao houve integracao funcional nesta subetapa, o teste e apenas de seguranca de carregamento:
  1. Fazer `Ctrl+F5`.
  2. Abrir `Doenças (CID)...`.
  3. Confirmar que a lista carrega.
  4. Testar busca/filtro.
  5. Clicar uma vez em uma linha e confirmar selecao.
  6. Dar duplo-clique e confirmar que abre `Alterar doença`.
  7. Abrir `Nova doença...`.
  8. Confirmar que o checkbox continua alinhado e espaçado.
  9. Cancelar o modal.
  10. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
