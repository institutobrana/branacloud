# CID - Subetapa 1: estrutura modular passiva

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. git status --short antes

```text
M docs/cid_subetapa_0_mapeamento_monolitico.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
```

## 3. git status --short depois

```text
M docs/cid_subetapa_0_mapeamento_monolitico.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? frontend/js/modules/cid.js
M frontend/index.html
```

## 4. Observacao sobre arquivos pendentes anteriores

- O arquivo `docs/varredura_proximo_modulo_pos_plano_contas.md` ja estava pendente antes desta etapa.
- O arquivo `docs/cid_subetapa_0_mapeamento_monolitico.md` tambem ja estava pendente antes desta etapa e foi mantido como trilha documental.

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`

## 6. Documentos consultados

- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/cid_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`

## 7. Arquivos criados

- `frontend/js/modules/cid.js`
- `docs/cid_subetapa_1_estrutura_modular_passiva.md`

## 8. Arquivos alterados

- `frontend/index.html`

## 9. Confirmacao de que nao houve alteracao funcional

- Nenhuma funcao funcional do CID foi movida.
- Nenhum endpoint foi alterado.
- Nenhum bind foi alterado.
- Nao houve mudanca em busca, filtro, modal, salvar ou excluir.

## 10. Confirmacao de que app.js continua como fonte funcional da verdade

- `frontend/app.js` continua intacto nesta etapa.
- O fluxo real do CID segue no monolito.
- O `index.html` passou a carregar `frontend/js/modules/cid.js` antes de `frontend/app.js`.
- O cache-bust do `app.js` foi atualizado para `20260513-cid-sub1` para forcar recarga do HTML atualizado.

## 11. Confirmacao de que nenhuma funcao CID foi movida

- `cidEnsureUI()`
- `cidRender()`
- `cidSelecionado()`
- `cidCarregar()`
- `cidSalvarModal()`
- `cidExcluirSelecionado()`
- `cidAbrirModal()`
- `cidFecharModal()`
- `cidVincularEventos()`
- `cidAbrir()`

## 12. Confirmacao de que nenhum endpoint foi alterado

- Nao houve mudanca em:
  - `GET /cid`
  - `POST /cid`
  - `PUT /cid/{id}`
  - `DELETE /cid/{id}`

## 13. Confirmacao de que nenhum bind foi alterado

- Nao houve mudanca nos binds de botao, busca, clique simples, modal ou fechamento de painel.

## 14. Confirmacao de que busca/filtro nao foi alterado

- O filtro de CID permanece inteiramente em `app.js`.

## 15. Confirmacao de que modal/salvar/excluir nao foram alterados

- O modal do CID continua no `app.js`.
- O fluxo de salvar e excluir continua no `app.js`.

## 16. Estrutura criada no namespace passivo

- Namespace: `window.BranaCidModule`
- Metadados:
  - `nome: "CID"`
  - `versao: "subetapa-1"`
  - `status: "estrutura-controlada-passiva"`
  - `controlaFluxo: false`
- API passiva:
  - `getStatus()`
  - `info()`
- Sem DOM, sem fetch, sem requestJson, sem binds e sem chamadas `cid*`.

## 17. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/cid.js`: OK

## 18. Riscos remanescentes

- O modulo CID segue totalmente monolitico no `app.js`.
- A estrutura passiva nao garante ainda helper puro seguro para extracao futura.
- A ordem de carregamento do `index.html` precisa continuar antes do `app.js`.
- O CID ainda nao possui helper puro seguro identificado, entao a Subetapa 2 deve ser conservadora.

## 19. Recomendacao para Subetapa 2

- Mapear fronteiras e contratos de CID no `app.js`, sem mover comportamento.
- Se nao houver helper puro seguro, manter a proxima etapa apenas como documentacao de fronteiras.

## 20. Onde testar no navegador

- Fazer `Ctrl+F5`.
- Abrir `Doenças (CID)...`.
- Confirmar que o painel abre.
- Confirmar que a lista carrega.
- Testar busca/filtro.
- Selecionar uma linha.
- Testar `Nova doença...`.
- Testar `Altera...`.
- Testar `Elimina` se for seguro no ambiente de teste.
- Fechar o painel.
- Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
