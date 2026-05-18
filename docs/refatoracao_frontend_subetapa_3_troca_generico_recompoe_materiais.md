# Refatoracao Frontend - Subetapa 3 - Troca de Generico Recompoe Materiais

## 1. Objetivo da subetapa
Corrigir de forma conservadora a recomposicao da lista de materiais ao trocar ou associar Procedimento Generico em Intervencoes / Procedimentos, usando origem confiavel recebida do backend.

## 2. Diretorio real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`

## 4. Confirmacao de que backend nao foi alterado
Nenhum arquivo de backend foi alterado nesta subetapa.

## 5. Confirmacao de que `frontend/index.html` nao foi alterado
`frontend/index.html` nao foi alterado.

## 6. Confirmacao de que `frontend/js/modules` nao foi alterado
Nenhum arquivo em `frontend/js/modules` foi alterado.

## 7. Contrato funcional usado como base
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`

## 8. Auditorias usadas como base
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`

## 9. Subetapas anteriores usadas como base
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`

## 10. Funcoes frontend analisadas
- `proc.cboGenerico`
- `addEventListener("change")`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procCarregarMateriaisGenericoDetalhe`
- `procRenderLinks`
- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`
- `procClonarItemVinculado`
- `procOrigemMaterialVinculado`
- `procMaterialEhHerdado`
- `procMaterialEhProprio`
- `procNormalizarOrigemMaterialVinculado`
- `procMateriaisGenericoBaseId`
- `procMateriaisGenericoVisualId`
- `procMateriaisGenericoRenderSeq`
- `procMateriaisGenericoCache`

## 11. Funcoes frontend alteradas
- `procNormalizarOrigemMaterialVinculado(...)`
- `procClonarItemVinculado(...)`
- `procAtualizarMateriaisEditorVisualizacao(...)`
- `procRecarregarLinks(...)`
- `procComporMateriaisEditorPorGenerico(...)`
- `procRenderLinks(...)`

## 12. Helpers criados
Esta subetapa nao precisou criar novos helpers com nome adicional. Foram ajustados os helpers ja existentes da Subetapa 2 para respeitar a origem do backend e para manter fallback conservador.

## 13. Como a troca do Generico preserva proprios
Na recomposicao, o frontend preserva os itens marcados como `origem: "proprio"` ou `herdado: false`, mantendo apenas os materiais proprios da intervencao atual.

## 14. Como remove herdados antigos
Itens marcados como `origem: "herdado"` ou `herdado: true` sao descartados antes da nova composicao. Assim, herdados do generico anterior nao permanecem na grade.

## 15. Como busca herdados novos
O frontend chama `procCarregarMateriaisGenericoDetalhe(...)` para buscar os materiais do novo generico selecionado e os normaliza como herdados.

## 16. Como trata Generico sem materiais
Se o novo generico nao tiver materiais, a funcao de detalhe retorna `[]` e a composicao final usa lista herdada vazia.

## 17. Como trata lista vazia
Lista vazia e considerada resposta valida. Nao ha reaproveitamento da lista anterior quando o novo generico nao devolve materiais.

## 18. Como usa origem/herdado
O frontend passou a reconhecer primeiro:
- `origem: "proprio"`
- `origem: "herdado"`
- `herdado: false`
- `herdado: true`

Se os campos nao existirem em registros legados, o fallback conservador anterior ainda pode ser usado.

## 19. Como deduplica por `material_id`
A lista final e deduplicada por `material_id`, com prioridade do material proprio da intervencao atual sobre o herdado do generico.

## 20. Como evita material de outra Intervencao
O snapshot continua sendo validado pelo `id` da intervencao atual e a recomposicao trabalha com a lista local da intervencao em curso, sem reaproveitar itens de outra intervencao como base principal.

## 21. Como evita cache contaminado
O cache de detalhes do generico continua sendo usado apenas para materiais do generico, e o frontend normaliza esses itens como herdados antes de recompor a grade.

## 22. Como evita snapshot antigo
O snapshot usado para recomposicao precisa pertencer a intervencao ativa; ao recompor, o estado local e atualizado com a nova lista composta.

## 23. Confirmacao de que nao houve autosave
Nao houve autosave nesta subetapa.

## 24. Confirmacao de que fluxo de salvar nao foi alterado
O fluxo de salvar foi preservado.

## 25. Confirmacao de que backend nao foi alterado
Nenhum arquivo de backend foi alterado nesta subetapa.

## 26. Confirmacao de que calculo financeiro nao foi alterado
O calculo financeiro nao foi alterado.

## 27. Confirmacao de que duplo clique/modal nao foi alterado
O modal completo de duplo clique continua preservado e sem alteracao funcional nesta etapa.

## 28. Confirmacao de que textos visiveis nao foram alterados
Nenhuma string visivel do sistema foi alterada nesta subetapa.

## 29. Riscos preservados
- materiais herdados legados sem marcador confiavel ainda podem depender do fallback conservador;
- a materializacao legada no banco nao foi limpa;
- a etapa corrige a recomposicao da visualizacao, nao o legado persistido;
- o sistema ainda depende de leitura confiavel do backend para os fluxos mais novos.

## 30. Checks executados
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 31. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Intervencoes / Procedimentos`.
3. Abrir uma intervencao sem procedimento generico associado.
4. Confirmar que a tela abre normalmente.
5. Abrir uma intervencao com procedimento generico associado.
6. Confirmar que a lista de materiais aparece normalmente.
7. Abrir uma intervencao com materiais proprios.
8. Confirmar que materiais proprios aparecem normalmente.
9. Abrir uma intervencao com materiais herdados.
10. Confirmar que materiais herdados aparecem normalmente.
11. Trocar de generico e confirmar que os herdados antigos saem e os novos entram.
12. Trocar para um generico sem materiais e confirmar que a lista herdada fica vazia.
13. Dar duplo clique em material vinculado.
14. Confirmar que o modal completo continua abrindo.
15. Cancelar ou fechar sem salvar, se preferir.
16. Conferir console sem erro novo.

## 32. Proxima etapa recomendada
Validar manualmente a troca entre genericos no navegador; se o comportamento estiver coerente, a proxima evolucao deve ser apenas consolidar eventuais ajustes finos de origem sem mexer em backend.
