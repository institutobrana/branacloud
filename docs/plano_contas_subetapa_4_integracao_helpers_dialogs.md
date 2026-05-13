# Plano de Contas - Subetapa 4: Integração dos Helpers nos Dialogs

## 1. Branch atual
`modularizacao-segura-fase-1`

## 2. git status --short antes
```text
 M frontend/app.js
 M frontend/index.html
?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md
?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md
?? docs/plano_contas_subetapa_2_fronteiras_contratos.md
?? docs/plano_contas_subetapa_3_helpers_puros.md
?? frontend/js/modules/plano-contas.js
```

## 3. git status --short depois
```text
 M frontend/app.js
 M frontend/index.html
?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md
?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md
?? docs/plano_contas_subetapa_2_fronteiras_contratos.md
?? docs/plano_contas_subetapa_3_helpers_puros.md
?? docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md
?? frontend/js/modules/plano-contas.js
```

## 4. Arquivos analisados
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [frontend/index.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html)
- [frontend/js/modules/plano-contas.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/plano-contas.js)

## 5. Documentos consultados
- [docs/plano_retomada_modularizacao_segura_pos_reversao.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_retomada_modularizacao_segura_pos_reversao.md)
- [docs/varredura_comparativa_primeiro_modulo_modularizacao.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/varredura_comparativa_primeiro_modulo_modularizacao.md)
- [docs/plano_contas_subetapa_0_mapeamento_monolitico.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_0_mapeamento_monolitico.md)
- [docs/plano_contas_subetapa_1_estrutura_modular_passiva.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_1_estrutura_modular_passiva.md)
- [docs/plano_contas_subetapa_2_fronteiras_contratos.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_2_fronteiras_contratos.md)
- [docs/plano_contas_subetapa_3_helpers_puros.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_3_helpers_puros.md)
- [docs/plano_contas_correcao_duplo_clique.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_correcao_duplo_clique.md)
- [docs/frontend_correcao_convenios_planos_duplo_clique_pos_reversao.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/frontend_correcao_convenios_planos_duplo_clique_pos_reversao.md)
- [docs/unidades_subetapa_8_encerramento_ciclo_helpers.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/unidades_subetapa_8_encerramento_ciclo_helpers.md)

## 6. Arquivos alterados
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md)

## 7. Funções alteradas
- `planoDialogGrupo(ed = null)`
- `planoDialogCategoria(ed = null)`

## 8. Helpers integrados
- `window.BranaPlanoContasModule.helpers.validarNomeGrupo(nome)`
- `window.BranaPlanoContasModule.helpers.validarNomeCategoria(nome)`
- `window.BranaPlanoContasModule.helpers.montarPayloadGrupo(nome, tipo)`
- `window.BranaPlanoContasModule.helpers.montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`

## 9. Confirmação de fallback seguro
- Sim. Se `window.BranaPlanoContasModule` ou `helpers` não existir, o `app.js` usa a lógica local equivalente.
- As mensagens de validação foram preservadas.
- Os nomes de campos e o contrato com o backend foram preservados.

## 10. Confirmação de que endpoints não foram alterados
- Nenhum endpoint foi alterado.
- Permanecem os mesmos fluxos de `POST /cadastros/grupos`, `PUT /cadastros/grupos/{id}`, `POST /cadastros/categorias` e `PUT /cadastros/categorias/{id}`.

## 11. Confirmação de que `requestJson` não foi alterado
- `requestJson` não foi alterado.
- O fluxo de `await requestJson(...)` permanece o mesmo.

## 12. Confirmação de que `cadModalAbrir` não foi alterado
- `cadModalAbrir()` não foi alterado.
- Os dialogs continuam sendo montados no `app.js`.

## 13. Confirmação de que Auxiliares não foi alterado
- O módulo de Auxiliares não foi alterado.
- Nenhum fluxo compartilhado com Auxiliares foi movido nesta etapa.

## 14. Confirmação de que binds/duplo-clique não foram alterados
- Os binds de Plano de Contas não foram alterados nesta etapa.
- O duplo-clique corrigido permanece como estava.

## 15. Confirmação de que `plano-contas.js` não assumiu controle funcional
- Sim. O módulo segue passivo.
- Os helpers continuam apenas disponíveis no namespace.
- O painel, renderização, modal, seleção, salvar e excluir continuam no `app.js`.

## 16. Resultado dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/plano-contas.js`: OK

## 17. Riscos remanescentes
- A integração depende de que os helpers do namespace mantenham o mesmo contrato.
- `tributavel` foi mantido como booleano, mas qualquer futura mudança de contrato no backend exigirá revisão.
- O carregamento passivo do módulo continua intencionalmente separado do controle funcional.

## 18. Recomendação para a Subetapa 5
- Seguir para a próxima extração apenas se houver outro helper pequeno, puramente parametrizado e com rollback fácil.
- Se o próximo candidato tocar em DOM, `requestJson`, modal ou estado global, manter no `app.js`.

## 19. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Cadastros > Plano de contas...`.
3. Confirmar que o painel abre.
4. Confirmar que grupos carregam.
5. Confirmar que categorias carregam ao selecionar grupo.
6. Testar `Novo grupo`.
7. Tentar salvar grupo sem nome e confirmar que a validação segue igual.
8. Salvar grupo com nome válido.
9. Alterar grupo existente.
10. Testar clique simples em grupo.
11. Testar duplo-clique em grupo e confirmar que abre alteração.
12. Testar `Nova categoria`.
13. Tentar salvar categoria sem nome e confirmar que a validação segue igual.
14. Salvar categoria com nome válido.
15. Alterar categoria existente.
16. Testar clique simples em categoria.
17. Testar duplo-clique em categoria e confirmar que abre alteração.
18. Testar `Excluir categoria`, inclusive fluxo de migração se houver categoria em uso.
19. Fechar o painel.
20. Abrir `Tabelas auxiliares`.
21. Confirmar que `Auxiliares` abre normalmente.
22. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
