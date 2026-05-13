# Medicamentos - Subetapa 1 - Estrutura modular passiva

## 1. Branch atual

- `modularizacao-segura-fase-1`

## 2. `git status --short` antes

```text
 M docs/medicamentos_subetapa_0_mapeamento_monolitico.md
?? docs/varredura_proximo_modulo_pos_cid.md
```

## 3. `git status --short` depois

```text
 M docs/medicamentos_subetapa_0_mapeamento_monolitico.md
 M frontend/index.html
?? docs/medicamentos_subetapa_1_estrutura_modular_passiva.md
?? docs/varredura_proximo_modulo_pos_cid.md
?? frontend/js/modules/medicamentos.js
```

## 4. Observacao sobre arquivos pendentes anteriores

- `docs/varredura_proximo_modulo_pos_cid.md` permanecia pendente antes desta etapa.
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md` ja estava atualizado e permaneceu como base documental do ciclo.

## 5. Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/plano-contas.js`
- `frontend/js/modules/cid.js`
- `frontend/js/modules/medicamentos.js`

## 6. Documentos consultados

- `docs/varredura_proximo_modulo_pos_cid.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`

## 7. Arquivos criados

- `frontend/js/modules/medicamentos.js`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`

## 8. Arquivos alterados

- `frontend/index.html`

## 9. Confirmacao de que nao houve alteracao funcional

- Nao houve movimento de funcoes funcionais para o modulo novo.
- Nao houve alteracao de filtros, lista, modal, abas, salvar, excluir, endpoints ou binds do Medicamentos.
- A etapa foi apenas estrutural e documental.

## 10. Confirmacao de que `app.js` continua como fonte funcional da verdade

- Sim.
- Toda a funcionalidade de Medicamentos continua no `frontend/app.js`.
- O novo arquivo nao assumiu abertura, renderizacao, carregamento, modal, filtros, selecao, salvar ou excluir.

## 11. Confirmacao de que nenhuma funcao Medicamentos foi movida

- Nenhuma funcao funcional foi movida para `frontend/js/modules/medicamentos.js`.
- As funcoes `medicamentosEnsureUI()`, `medicamentosSelecionado()`, `medicamentosSelecionarLinha()`, `medicamentosRender()`, `medicamentosSetSelectOptions()`, `medicamentosAplicarTab()`, `medicamentosLimparModal()`, `medicamentosAplicarModalDados()`, `medicamentosCarregarFiltrosGrupo()`, `medicamentosCarregarLista()`, `medicamentosCarregarCombosModal()`, `medicamentosFecharModal()`, `medicamentosAbrirModal()`, `medicamentosPayloadModal()`, `medicamentosSalvarModal()`, `medicamentosExcluirSelecionado()`, `medicamentosExcluirNoModal()`, `medicamentosVincularEventos()` e `medicamentosAbrir()` permanecem no `app.js`.

## 12. Confirmacao de que nenhum endpoint foi alterado

- Nenhum endpoint de Medicamentos foi alterado nesta etapa.
- Nao houve alteracao de `requestJson`.

## 13. Confirmacao de que nenhum bind foi alterado

- Nenhum bind foi alterado nesta etapa.
- O comportamento de clique, segundo clique rapido, filtros e botoes permanece no `app.js`.

## 14. Confirmacao de que filtros/listagem/modal/abas/salvar/excluir nao foram alterados

- Nao houve alteracao de filtro por grupo.
- Nao houve alteracao de filtro por nome.
- Nao houve alteracao de tabela/listagem.
- Nao houve alteracao de modal.
- Nao houve alteracao de abas do modal.
- Nao houve alteracao de salvar.
- Nao houve alteracao de excluir.

## 15. Estrutura criada no namespace passivo

- Namespace global criado: `window.BranaMedicamentosModule`
- Estrutura passiva criada:
  - `meta` com `nome`, `versao`, `status` e `controlaFluxo`
  - `nome`
  - `subetapa`
  - `status`
  - `ativo`
  - `controlaFluxo`
  - `helpers` vazio para expansao futura
  - `getStatus()`
  - `info()`
- O arquivo nao consulta DOM, nao faz `fetch`, nao usa `requestJson` e nao registra eventos/binds.

## 16. Resultado dos checks

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/medicamentos.js`: OK

## 17. Riscos remanescentes

- O modulo ainda e grande e continua totalmente monolitico em `app.js`.
- O duplo clique atual usa heuristica de segundo clique rapido, o que exige cuidado em eventuais correcoes futuras.
- Ainda nao foi identificado helper puro seguro para extração funcional imediata.

## 18. Recomendacao para Subetapa 2

- Mapear fronteiras e contratos do Medicamentos no `app.js`, sem mover comportamento.
- Manter a mesma cautela usada em CID: primeiro fronteiras, depois helpers pequenos, e so entao integracao minima se houver payload puro claro.

## 19. Onde testar no navegador

1. Fazer `Ctrl+F5`.
2. Abrir `Cadastro > Medicamentos...`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Testar filtro por grupo.
6. Testar filtro por nome.
7. Selecionar uma linha.
8. Testar o segundo clique rapido, se esse for o comportamento atual.
9. Testar o botao `Altera...`.
10. Testar `Novo medicamento...`.
11. Trocar abas do modal.
12. Tentar salvar sem campos obrigatorios, se houver validacao.
13. Testar `Elimina`, se for seguro no ambiente.
14. Fechar e reabrir o painel.
15. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
