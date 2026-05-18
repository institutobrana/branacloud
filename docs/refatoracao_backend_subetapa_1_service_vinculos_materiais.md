# Refatoracao Backend - Subetapa 1 - Service de Vinculos de Materiais

## 1. Objetivo da subetapa
Criar uma camada backend central para compor materiais vinculados entre Intervencoes / Procedimentos e Procedimentos Genericos, com origem confiavel em memoria/JSON, deduplicacao por `material_id` e compatibilidade com o contrato funcional ja documentado.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacao de que e documentacao sem alteracao funcional
Esta subetapa foi tratada como uma refatoracao backend conservadora, com documentacao obrigatoria. O objetivo foi centralizar a leitura/composicao de materiais no backend, sem alterar frontend, banco, schema ou endpoints publicos novos.

## 4. Contrato funcional usado como base
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`

## 5. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_contaminacao_material_local_entre_intervencoes_mesmo_generico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_definitiva_pgen_falha_gravar_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

## 6. Arquivos consultados somente em leitura
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

## 7. Arquivos criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\__init__.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`

## 8. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`

## 9. Confirmacao de que frontend nao foi alterado
Nenhum arquivo de frontend foi alterado nesta subetapa.

## 10. Service criado
O service central criado foi:
- `backend/services/vinculos_materiais.py`

## 11. Funcoes criadas no service
- `normalizar_material_vinculado(...)`
- `marcar_material_proprio(...)`
- `marcar_material_herdado(...)`
- `deduplicar_materiais_por_material_id(...)`
- `listar_materiais_proprios_procedimento(...)`
- `listar_materiais_herdados_generico(...)`
- `compor_materiais_vinculados_procedimento(...)`

## 12. Como o service separa proprios e herdados
O service lista materiais proprios a partir dos vinculos do procedimento atual e materiais herdados a partir dos vinculos do Procedimento Generico atual. Depois compoe a lista final em memoria.

## 13. Como o service marca origem
Cada item retornado pela composicao recebe:
- `origem: "proprio"` e `herdado: false` para materiais proprios
- `origem: "herdado"` e `herdado: true` para materiais herdados

## 14. Como o service deduplica por `material_id`
A deduplicacao e feita por `material_id`, com prioridade do material proprio sobre o herdado. Em conflito, o item proprio permanece na lista final.

## 15. Como trata Procedimento Generico sem materiais
Quando o Procedimento Generico nao possui materiais, a funcao de herdados retorna lista vazia e a composicao final fica somente com os materiais proprios do procedimento atual. Se nao houver proprios, o resultado tambem e vazio.

## 16. Como preserva compatibilidade dos campos antigos
Os campos atuais dos itens foram mantidos:
- `vinculo_id`
- `material_id`
- `codigo`
- `nome`
- `relacao`
- `preco`
- `custo_und`
- `quantidade`
- `custo_total`

Os campos novos foram apenas adicionados:
- `origem`
- `herdado`

## 17. Como foi integrado ao GET /procedimentos/{id}
O `GET /procedimentos/{id}` e a resposta de `POST/PUT /procedimentos` passaram a usar a composicao central do service por meio de wrappers em `procedimentos_routes.py`.

## 18. Confirmacao de que `_aplicar_heranca_procedimento_generico` ainda nao foi removida
`_aplicar_heranca_procedimento_generico(...)` continua existindo em `procedimentos_routes.py`.

## 19. Risco preservado de materializacao legada
Os vinculos herdados antigos ainda podem existir materializados no banco como se fossem proprios. Esta subetapa nao limpa esse legado e nao altera persistencia.

## 20. Confirmacao de que nao houve limpeza de dados
Nao houve exclusao, atualizacao em massa, migracao ou limpeza de dados legados nesta subetapa.

## 21. Confirmacao de que nao houve alteracao de banco, schema ou migration
Nao houve alteracao de banco, schema ou migration.

## 22. Checks executados
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`

## 23. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Intervencoes / Procedimentos`.
3. Abrir uma intervencao sem procedimento generico associado.
4. Confirmar que a tela abre normalmente.
5. Abrir uma intervencao com procedimento generico associado.
6. Confirmar que a lista de materiais continua aparecendo.
7. Abrir uma intervencao com materiais proprios.
8. Confirmar que os materiais proprios continuam aparecendo.
9. Abrir uma intervencao com generico associado e materiais herdados.
10. Confirmar que nao houve erro visual.
11. Abrir o console do navegador e confirmar que nao surgiu erro novo.

## 24. Proxima etapa recomendada
A proxima etapa deve focar na reutilizacao desse service pela leitura do frontend para substituir a heuristica atual, sem mexer ainda na troca da combo Procedimento Generico.
