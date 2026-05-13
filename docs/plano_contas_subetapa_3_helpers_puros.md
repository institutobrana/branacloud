# Plano de Contas - Subetapa 3: Helpers Puros

## Contexto
Esta subetapa extrai apenas helpers puros e parametrizados para o namespace passivo de Plano de Contas, sem mover controle funcional para `frontend/js/modules/plano-contas.js`.

## Branch atual
`modularizacao-segura-fase-1`

## Estado do working tree antes da alteração
```text
 M frontend/app.js
 M frontend/index.html
?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md
?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md
?? docs/plano_contas_subetapa_2_fronteiras_contratos.md
?? frontend/js/modules/plano-contas.js
```

## Estado do working tree depois da alteração
```text
 M frontend/app.js
 M frontend/index.html
?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md
?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md
?? docs/plano_contas_subetapa_2_fronteiras_contratos.md
?? docs/plano_contas_subetapa_3_helpers_puros.md
?? frontend/js/modules/plano-contas.js
```

## Arquivos analisados
- [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [frontend/index.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/index.html)
- [frontend/js/modules/plano-contas.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/plano-contas.js)

## Documentos consultados
- [docs/plano_retomada_modularizacao_segura_pos_reversao.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_retomada_modularizacao_segura_pos_reversao.md)
- [docs/varredura_comparativa_primeiro_modulo_modularizacao.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/varredura_comparativa_primeiro_modulo_modularizacao.md)
- [docs/unidades_subetapa_0_mapeamento_monolitico.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/unidades_subetapa_0_mapeamento_monolitico.md)
- [docs/unidades_subetapa_8_encerramento_ciclo_helpers.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/unidades_subetapa_8_encerramento_ciclo_helpers.md)
- [docs/plano_contas_subetapa_0_mapeamento_monolitico.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_0_mapeamento_monolitico.md)
- [docs/plano_contas_subetapa_1_estrutura_modular_passiva.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_1_estrutura_modular_passiva.md)
- [docs/plano_contas_subetapa_2_fronteiras_contratos.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_2_fronteiras_contratos.md)
- [docs/frontend_auditoria_appjs.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/frontend_auditoria_appjs.md)

## Arquivos criados
- [docs/plano_contas_subetapa_3_helpers_puros.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_contas_subetapa_3_helpers_puros.md)

## Arquivos alterados
- [frontend/js/modules/plano-contas.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/plano-contas.js)

## Helpers criados
- `window.BranaPlanoContasModule.helpers.validarNomeGrupo(nome)`
- `window.BranaPlanoContasModule.helpers.validarNomeCategoria(nome)`
- `window.BranaPlanoContasModule.helpers.montarPayloadGrupo(nome, tipo)`
- `window.BranaPlanoContasModule.helpers.montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`

## Se `app.js` foi alterado
- Não. `frontend/app.js` não foi alterado nesta subetapa.

## Confirmações
- Não houve avanço de controle funcional.
- `frontend/js/modules/plano-contas.js` segue sem DOM, fetch, binds e `requestJson`.
- Endpoints não foram alterados.
- `cadModalAbrir()` não foi alterado.
- `auxAbrir()` não foi alterado.
- `auxAplicarLayoutDesktop()` não foi alterado.
- `hideAllPanels()` não foi alterado.
- `closeWorkspacePanel()` não foi alterado.
- `bindStandardGridActivation()` não foi alterado.
- O dispatcher `action === "plano"` não foi alterado.
- Auxiliares não foi alterado.
- O módulo continua passivo; os helpers existem, mas ainda não estão conectados ao fluxo funcional.

## Resultados dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/plano-contas.js`: OK

## Riscos remanescentes
- Os helpers ainda não estão acoplados ao fluxo funcional de `planoDialogGrupo()` e `planoDialogCategoria()`.
- A integração futura precisa preservar exatamente os nomes de campos e a normalização de `tributavel`.
- O módulo continua intencionalmente sem controle de abertura, renderização, modal ou persistência.

## Recomendação para a Subetapa 4
- Integrar os helpers puros ao `app.js` apenas em pontos triviais e localizados, começando por validação/payload dos dialogs, sem mover controle funcional nem alterar contratos com backend.

## Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Cadastros > Plano de contas...`.
3. Confirmar que o painel abre.
4. Confirmar que grupos carregam.
5. Confirmar que categorias carregam ao selecionar grupo.
6. Testar clique simples em grupo.
7. Testar duplo-clique em grupo.
8. Confirmar que abre alteração de grupo.
9. Testar botão Alterar grupo.
10. Testar Novo grupo.
11. Testar salvar grupo com nome válido.
12. Testar cancelar grupo.
13. Testar clique simples em categoria.
14. Testar duplo-clique em categoria.
15. Confirmar que abre alteração de categoria.
16. Testar botão Alterar categoria.
17. Testar Nova categoria.
18. Testar salvar categoria com nome válido.
19. Testar cancelar categoria.
20. Testar Excluir categoria, inclusive fluxo de migração se houver categoria em uso.
21. Fechar o painel.
22. Abrir `Tabelas auxiliares`.
23. Confirmar que `Auxiliares` abre normalmente.
24. Confirmar console sem `ReferenceError`, `TypeError` ou erro novo.
