# Refatoracao Frontend - Subetapa 2 - Consumo de Origem de Materiais

## 1. Objetivo da subetapa
Preparar o frontend para respeitar os marcadores confiaveis de origem recebidos do backend em `materiais_vinculados`, preservando `origem` e `herdado` e reduzindo a dependencia de heuristica.

## 2. Diretorio real
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`

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
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_contaminacao_material_local_entre_intervencoes_mesmo_generico.md`

## 9. Service backend usado como base
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`

## 10. Funcoes frontend analisadas
- `procAplicarDadosEditor`
- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`
- `procComporMateriaisEditorPorGenerico`
- `procMateriaisVinculadosIguais`
- `procAtualizarMateriaisEditorVisualizacao`
- `procCarregarMateriaisGenericoDetalhe`
- `procRenderLinks`
- `procSalvar`
- `procConfirmarVinculo`
- `proc.cboGenerico`

## 11. Funcoes frontend alteradas
- `procRenderLinks(...)`
- `procOrigemMaterialVinculado(...)`
- `procMaterialEhHerdado(...)`
- `procMaterialEhProprio(...)`
- `procNormalizarOrigemMaterialVinculado(...)`
- `procClonarItemVinculado(...)`
- `procCarregarMateriaisGenericoDetalhe(...)`
- `procComporMateriaisEditorPorGenerico(...)`

## 12. Helpers criados
- `procOrigemMaterialVinculado(item)`
- `procMaterialEhHerdado(item)`
- `procMaterialEhProprio(item)`
- `procNormalizarOrigemMaterialVinculado(item, fallbackOrigem)`

## 13. Como origem/herdado sao preservados
Quando o frontend recebe `materiais_vinculados`, os itens sao normalizados sem perder `origem` e `herdado`. A clonagem interna tambem preserva esses campos em memoria.

## 14. Como proprios/herdados podem ser identificados agora
O frontend passa a ler primeiro:
- `origem: "proprio"` ou `origem: "herdado"`
- `herdado: false` ou `herdado: true`

Se esses campos nao existirem, a heuristica antiga continua como fallback conservador.

## 15. Fallback mantido para itens sem origem/herdado
Se o item nao vier com marcador confiavel, o frontend ainda aceita o comportamento anterior por heuristica estrutural, sem quebrar a tela nem o fluxo de salvar.

## 16. Confirmacao de que a troca da combo ainda nao foi corrigida nesta etapa
Sim. A troca da combo `Procedimento Generico` ainda nao foi refeita de forma ampla nesta subetapa.

## 17. Confirmacao de que fluxo de salvar nao foi alterado
O fluxo de salvar foi preservado.

## 18. Confirmacao de que calculo financeiro nao foi alterado
O calculo financeiro foi preservado.

## 19. Confirmacao de que textos visiveis nao foram alterados
Nenhuma string visivel do sistema foi alterada nesta subetapa.

## 20. Riscos preservados
- registros legados sem marcador confiavel ainda dependem de fallback conservador;
- a troca completa da combo ainda pode exigir a proxima subetapa;
- o backend ja expõe origem em memoria/JSON, mas o frontend ainda nao usa isso para resolver toda a troca de genérico.

## 21. Checks executados
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 22. Onde testar no navegador
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
11. Dar duplo clique em material vinculado.
12. Confirmar que o modal completo continua abrindo.
13. Cancelar ou fechar sem gravar, se preferir evitar alteracoes.
14. Conferir console sem erro novo.

## 23. Proxima etapa recomendada
A proxima subetapa deve usar essa origem preservada para corrigir a troca da combo de Procedimento Generico e remover herdados antigos sem depender de heuristica.
