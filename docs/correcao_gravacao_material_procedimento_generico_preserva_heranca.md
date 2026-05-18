# Correcao de gravacao de material do Procedimento Generico preservando heranca

Data: 2026-05-17

## 1. Objetivo da correcao
Corrigir a falha ao gravar alteracao de material vinculado dentro do modulo Procedimentos Genericos, sem contaminar Intervencoes / Procedimentos e sem alterar a heranca existente.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados/criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_gravacao_material_procedimento_generico_preserva_heranca.md`

## 4. Confirmacoes de escopo
- `frontend/app.js` nao foi alterado nesta etapa.
- `backend/routes/cadastros_routes.py` foi alterado.
- `backend/routes/procedimentos_routes.py` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- banco, schema, migrations e endpoints publicos nao foram alterados.

## 5. Blindagem textual / mojibake
A blindagem textual foi respeitada.

- a mensagem existente `Falha ao gravar materiais do procedimento.` foi preservada
- nenhuma string visivel existente foi alterada
- nao houve correcao de acentos, labels, placeholders ou textos de interface

## 6. Funcao frontend que disparava a gravacao
- `pgenMaterialEditSalvar()` em `frontend/app.js`

## 7. Endpoint backend chamado
- `PUT /cadastros/procedimentos-genericos/{item_id}`

## 8. Causa tecnica da falha
O fluxo de sincronizacao de materiais do Procedimento Generico apagava todos os vinculos e recriava a lista inteira a cada salvamento. Isso forca revalidacao completa de todos os materiais e aumenta a chance de falha quando existe algum vinculo legado ou quando a edicao e pontual.

## 9. Correcao aplicada
O backend passou a fazer sincronizacao incremental por `material_id`:

- mantem e atualiza os vinculos ja existentes quando o `material_id` continua presente no payload
- remove apenas os vinculos que nao vieram mais no payload
- valida apenas os materiais realmente novos

## 10. Payload antes/depois
O contrato do payload nao foi alterado.

- continua enviando `codigo`, `descricao`, `especialidade`, `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `mostrar_simbolo`, `inativo`, `observacoes`, `fases` e `materiais`
- em `materiais`, continuam sendo enviados `material_id` e `quantidade`

## 11. Como a gravacao agora atualiza somente o vinculo do Procedimento Generico
Durante a sincronizacao, o backend identifica os vinculos existentes por `material_id` e atualiza a quantidade diretamente nesses registros. Assim, a alteracao fica restrita ao Procedimento Generico atual.

## 12. Como evita criar material local nas intervencoes
Nao existe copia para Intervencoes / Procedimentos. O fluxo continua gravando apenas no vinculo do Procedimento Generico.

## 13. Como preserva materiais proprios das intervencoes
Os materiais proprios das intervencoes continuam fora deste fluxo. Nao houve atualizacao em massa nas intervencoes.

## 14. Como a alteracao do generico reflete nas intervencoes por heranca
As intervencoes continuam lendo os materiais herdados do Procedimento Generico ja atualizado. A heranca permanece no mecanismo de composicao ja corrigido anteriormente.

## 15. Cache
Nao houve alteracao de cache nesta etapa.

## 16. Confirmacoes adicionais
- nao houve atualizacao em massa nas intervencoes
- nao houve copia de materiais para intervencoes
- nao foi alterado o fluxo de Intervencoes / Procedimentos
- nao foi alterado o duplo clique
- nao foi alterada a mensagem de duplicidade
- preco, relacao, custo, quantidade, parse e formacao monetaria nao foram alterados

## 17. Riscos preservados
- se existir inconsistencia legado grave de dados, ela continua sendo tratada pela validacao do proprio cadastro
- a gravacao continua dependente da existencia do material novo na clinica
- a heranca continua sendo resolvida pelo GET ja corrigido em etapa anterior

## 18. Checks executados
Checklist seguro executado:

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`

Resultado:

- sem erro de sintaxe nos arquivos verificados

## 19. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genericos`.
3. Escolher um Procedimento Generico A com materiais vinculados.
4. Abrir os materiais do Generico A.
5. Alterar a quantidade de um material vinculado.
6. Clicar `Ok`.
7. Confirmar que nao aparece `Falha ao gravar materiais do procedimento.`
8. Reabrir o Generico A e confirmar que a alteracao permaneceu.
9. Abrir `Intervencoes / Procedimentos`.
10. Verificar que as intervencoes associadas ao Generico A continuam recebendo a heranca atualizada.

## 20. Proxima etapa recomendada
Validar manualmente o salvamento de materiais do Procedimento Generico no navegador e, se aparecer qualquer outra inconsistencia pontual, tratar separadamente sem mexer no fluxo de Intervencoes / Procedimentos.
