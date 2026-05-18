# Correcao definitiva da falha ao gravar materiais do Procedimento Generico

Data: 2026-05-17

## 1. Objetivo da correcao
Eliminar a falha ao gravar alteracao de material vinculado no modulo Procedimentos Genericos, preservando a heranca para Intervencoes / Procedimentos e sem alterar a mensagem visivel existente.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados/criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_definitiva_pgen_falha_gravar_materiais.md`

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

## 6. Funcao frontend que dispara a gravacao
- `pgenMaterialEditSalvar()` em `frontend/app.js`

## 7. Endpoint backend chamado
- `PUT /cadastros/procedimentos-genericos/{item_id}`

## 8. Diagnostico tecnico encontrado
O frontend envia o payload completo do Procedimento Generico para o `PUT` do proprio generico. O erro nao nasce no modal visual nem no step da quantidade.

O ponto sensivel estava no backend: o `PUT` executava sempre, na mesma requisicao:

- sincronizacao de fases
- sincronizacao de materiais
- propagacao de campos do generico para os procedimentos vinculados
- `commit`
- montagem do retorno detalhado

Para a edicao de material, parte desse trabalho era desnecessaria e ampliava a chance de falha em dados legados ou em relacoes que nao precisavam ser tocadas.

## 9. Correcao aplicada
O backend passou a comparar o estado atual com o payload recebido antes de sincronizar:

- se as fases nao mudaram, nao regrava fases
- se os materiais nao mudaram, nao regrava materiais
- se `tempo` e `custo_lab` nao mudaram, nao propaga esses campos para procedimentos

Assim, ao editar apenas a quantidade de um material, o fluxo evita resyncs laterais desnecessarios e grava somente o que realmente foi alterado.

## 10. Payload antes/depois
O contrato do payload nao foi alterado.

- continua enviando `codigo`, `descricao`, `especialidade`, `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `mostrar_simbolo`, `inativo`, `observacoes`, `fases` e `materiais`
- em `materiais`, continuam sendo enviados `material_id` e `quantidade`

## 11. Como a gravacao agora atualiza somente o vinculo do Procedimento Generico
O backend agora evita tocar em estruturas que nao mudaram e sincroniza apenas os conjuntos realmente alterados. A gravacao continua pertencendo ao Procedimento Generico, sem copiar nada para Intervencoes.

## 12. Como preserva heranca para as intervencoes
As intervencoes continuam refletindo os materiais herdados do Procedimento Generico por composicao, sem atualizacao em massa.

## 13. Como evita criar/copiar materiais em intervencoes
Nao existe copia para Intervencoes / Procedimentos. O fluxo segue exclusivo do Procedimento Generico.

## 14. Como preserva materiais proprios das intervencoes
Os materiais proprios das intervencoes continuam fora deste fluxo.

## 15. Step / spin
Nao foi alterado nesta etapa.

## 16. Fluxos nao alterados
- nao foi alterado o fluxo de Intervencoes / Procedimentos
- nao foi alterado o duplo clique
- nao foi alterada a mensagem de duplicidade
- nao foi alterado o modal visual
- nao foi alterado o cadastro de Materiais

## 17. Riscos preservados
- se existir inconsistencia legado grave de dados, ela continua sendo tratada pela validacao do proprio cadastro
- a gravacao continua dependente da existencia do material valido na clinica
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

## 19. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genericos`.
3. Escolher um procedimento generico com materiais vinculados.
4. Abrir `Materiais`.
5. Dar duplo clique em um material vinculado.
6. Alterar a quantidade.
7. Clicar `Ok`.
8. Confirmar que nao aparece `Falha ao gravar materiais do procedimento.`
9. Reabrir o procedimento generico e confirmar que a alteracao permaneceu.
10. Abrir `Intervencoes / Procedimentos` e verificar que a heranca continua coerente.

## 20. Proxima etapa recomendada
Validar manualmente o salvamento de materiais do Procedimento Generico no navegador. Se ainda aparecer qualquer inconsistncia, tratar separadamente sem mexer no fluxo de Intervencoes / Procedimentos.
