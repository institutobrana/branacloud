# Correcao backend: resolucao de tabela no fluxo de vinculo de material

## 1. Objetivo da correcao
Corrigir o erro backend `Tabela de procedimentos nao encontrada.` que aparecia ao confirmar, editar ou desvincular material vinculado em `Intervencoes / Procedimentos`, sem alterar frontend, banco, schema, migrations ou o contrato publico dos endpoints.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados/criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_tabela_procedimentos_vinculo_material.md`

## 4. Confirmacao de que backend/routes/procedimentos_routes.py foi alterado ou nao
Foi alterado somente no ponto do fluxo de material vinculado.

## 5. Confirmacao de que frontend/app.js foi alterado ou nao
Nao foi alterado nesta etapa.

## 6. Confirmacao de que frontend/index.html nao foi alterado
Confirmado.

## 7. Confirmacao de que frontend/js/modules nao foi alterado
Confirmado.

## 8. Confirmacao de que banco, schema, migrations e endpoints publicos nao foram alterados
Confirmado. A correcao nao alterou banco, schema, migrations nem o contrato publico dos endpoints. O ajuste foi interno ao backend existente.

## 9. Confirmacao de blindagem textual/mojibake
Respeitada. A string `Tabela de procedimentos nao encontrada.` foi preservada exatamente como esta.

## 10. Endpoint exato que disparava o erro
O erro aparecia no fluxo que chamava:
- `PUT /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}` ao clicar Ok no modal em modo edicao;
- o mesmo helper tambem era usado em `POST /procedimentos/{procedimento_id}/materiais-vinculados` e `DELETE /procedimentos/{procedimento_id}/materiais-vinculados/por-codigo/{codigo}`.

## 11. Funcao exata que chamava _load_tabela_or_404
- `atualizar_vinculo_por_codigo`
- `vincular_material`
- `desvincular_por_codigo`

## 12. Parametro errado/ausente identificado
O ponto chamador estava passando `int(proc.tabela_id or 1)` para `_load_tabela_or_404`, mas `proc.tabela_id` e a chave interna da tabela no banco, nao o codigo exibido da tabela. O helper `_load_tabela_or_404` procura por `ProcedimentoTabela.codigo`, entao o valor passado estava incompativel.

## 13. Como a tabela passou a ser resolvida corretamente
A resolucao passou a usar o caminho:
1. carregar o procedimento com `_load_proc_or_404`;
2. resolver o codigo da tabela do procedimento com `_codigo_tabela_do_procedimento(db, proc)`;
3. se nao houver codigo valido, manter o erro 404 existente;
4. chamar `_load_tabela_or_404(db, current_user.clinica_id, tabela_codigo)`.

## 14. Confirmacao de que nao foi removida validacao de clinica
Confirmado. O helper continua filtrando por `clinica_id`, e o fluxo segue exigindo procedimento valido da clinica atual.

## 15. Confirmacao de que nao foi criado fallback perigoso para qualquer tabela
Confirmado. Nao foi criado fallback generico para outra tabela. Se o procedimento nao tiver tabela resolvida, o fluxo continua retornando o mesmo 404.

## 16. Confirmacao de que nao foram alterados preco, relacao, custo, quantidade, parse ou formatacao monetaria
Confirmado. Nenhuma regra financeira foi tocada.

## 17. Confirmacao de que nao foi alterada a heranca de materiais do Procedimento Generico
Confirmado. A composicao de `materiais_vinculados` no `GET /procedimentos/{id}` permaneceu intacta.

## 18. Riscos preservados
- Se o cadastro do procedimento estiver inconsistente e sem tabela resolvida, o backend continua apontando erro em vez de inventar uma tabela.
- O fluxo de materiais depende do procedimento atual possuir uma tabela valida na clinica corrente.
- A string de erro foi preservada para nao misturar esta correcao com blindagem textual.

## 19. Checks executados e resultado
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - passou

## 20. Onde testar no navegador
1. Fazer Ctrl+F5.
2. Abrir `Intervencoes / Procedimentos`.
3. Abrir um procedimento/intervencao existente com materiais vinculados.
4. Dar duplo clique em um material vinculado.
5. Confirmar que abre o modal completo `Vincular material`.
6. Alterar a quantidade.
7. Clicar Ok.
8. Confirmar que nao aparece `Tabela de procedimentos nao encontrada.`
9. Confirmar que a linha foi atualizada, sem duplicar.
10. Clicar no botao `Vincular material`.
11. Adicionar um novo material.
12. Confirmar que nao aparece `Tabela de procedimentos nao encontrada.`
13. Confirmar que o novo material aparece na grade.
14. Testar `Desvincular material`.
15. Confirmar que nao aparece `Tabela de procedimentos nao encontrada.`
16. Confirmar que o painel financeiro atualiza.
17. Salvar o procedimento/intervencao.
18. Fechar e reabrir.
19. Confirmar que os materiais continuam corretos.
20. Confirmar console sem erro.
21. Depois disso, testar a troca de Procedimento Generico separadamente.

## 21. Proxima etapa recomendada
Validar manualmente o fluxo no navegador e, se ainda houver inconsistencias, investigar apenas o cadastro do procedimento e a resolucao de tabela por clinica, sem mexer em frontend ou em heranca de materiais.
