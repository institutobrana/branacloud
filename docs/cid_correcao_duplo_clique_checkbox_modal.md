# CID - Correcao de duplo clique e checkbox do modal

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. git status --short antes

```text
M docs/cid_subetapa_0_mapeamento_monolitico.md
M frontend/app.js
M frontend/index.html
?? docs/cid_correcao_duplo_clique_checkbox_modal.md
?? docs/cid_subetapa_1_estrutura_modular_passiva.md
?? docs/varredura_proximo_modulo_pos_plano_contas.md
?? frontend/js/modules/cid.js
```

## 3. Problemas corrigidos

- O checkbox de preferidos no modal de CID estava desalinhado em relacao ao texto.
- O duplo-clique real na lista de CID nao estava abrindo a tela de alteracao como o botao `Altera...`.

## 4. Causa encontrada para o duplo-clique

- O CID tinha sido levado para uma heuristica de "segundo clique rapido" no `click`, com selecao e abertura separadas do evento `dblclick`.
- Esse atalho fugia do padrao dos modulos estaveis e podia confundir o teste manual, alem de depender mais do ciclo de selecao/re-render.
- A correcao restaurou o uso do fluxo de grid padronizado com `bindStandardGridActivation`, mantendo `click` para selecao e `dblclick` para abrir o modal de alteracao.

## 5. Causa encontrada para o desalinhamento do checkbox

- O checkbox estava em um `label` inline simples, sem o mesmo padrao flex usado em modulos estaveis.
- Isso deixava o checkbox visualmente acima/deslocado em relacao ao texto.
- O ajuste foi local ao modal, sem mudar o nome do campo, a leitura do valor ou o payload salvo.
- Depois do alinhamento, o espaçamento foi levemente aumentado para separar melhor o checkbox do texto.
- Foi feito um ajuste fino adicional no `gap` para evitar que o texto ficasse colado no checkbox.
- O primeiro ajuste com `gap` nao refletiu no navegador; a correção definitiva foi aplicada com margem direta no próprio checkbox.

## 6. Arquivos alterados

- `frontend/app.js`
- `frontend/index.html`
- `docs/cid_correcao_duplo_clique_checkbox_modal.md`

## 6.1. Escopo da alteracao

- `frontend/app.js`: restaurou o `dblclick` real na grade do CID e alinhou o checkbox do modal.
- `frontend/index.html`: atualizou o cache-bust para `20260513-cid-checkbox-gap2`.
- `frontend/js/modules/cid.js`: sem alteracao funcional.

## 7. Funcoes alteradas

- `cidEnsureUI()`
- `cidSelecionarLinha()`
- `cidVincularEventos()`

## 8. Confirmacao de que a modularizacao nao avancou

- `frontend/js/modules/cid.js` continua passivo.
- Nenhuma funcao CID foi movida para o modulo.
- Nenhum comportamento funcional passou a depender do modulo novo.

## 9. Confirmacao de que cid.js nao assumiu controle funcional

- O modulo CID nao registrou eventos.
- O modulo CID nao consultou DOM.
- O modulo CID nao fez `fetch` ou `requestJson`.

## 10. Confirmacao de que endpoints/requestJson nao foram alterados

- Nao houve alteracao de endpoints.
- Nao houve alteracao de `requestJson`.

## 11. Confirmacao de que salvar/excluir nao foram alterados

- Os fluxos de salvar e excluir permaneceram os mesmos.
- O botao `Altera...`, `Nova doença...` e `Elimina` seguem usando o fluxo original do `app.js`.

## 12. Confirmacao de que outros modulos nao foram alterados

- Nao houve alteracao em Unidades.
- Nao houve alteracao em Plano de Contas.
- Nao houve alteracao em outros modulos do sistema.

## 13. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/cid.js`: OK

## 14. Onde testar no navegador

- Fazer `Ctrl+F5`.
- Abrir `Doenças (CID)...`.
- Confirmar que a lista carrega.
- Clicar uma vez em uma linha e confirmar selecao.
- Confirmar que clique simples nao abre o modal.
- Dar duplo-clique em uma linha e confirmar que abre `Alterar doença`.
- Fechar/cancelar o modal.
- Testar o botao `Altera...` e confirmar que abre a mesma tela.
- Testar `Nova doença...` e confirmar que abre modal de inclusao.
- Confirmar que o checkbox `Incluir na lista de preferidos` ficou alinhado com o texto.
- Marcar/desmarcar o checkbox e confirmar que o valor continua sendo lido corretamente, se for seguro salvar.
- Testar busca/filtro.
- Apos filtrar, dar duplo-clique em um resultado e confirmar que abre alteracao.
- Fechar e reabrir o painel CID.
- Repetir clique simples e duplo-clique para garantir que nao ha bind duplicado.
- Testar `Elimina`, se for seguro.
- Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
