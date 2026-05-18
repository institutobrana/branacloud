# Correcao da contaminacao de materiais locais entre intervencoes com o mesmo Procedimento Generico

## Objetivo
Corrigir a contaminacao de materiais proprios entre Intervencoes / Procedimentos diferentes que usam o mesmo Procedimento Generico, garantindo que cada intervencao exiba apenas:

- materiais herdados do Procedimento Generico selecionado;
- materiais proprios da intervencao atual.

## Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`

## Arquivos criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_contaminacao_material_local_entre_intervencoes_mesmo_generico.md`

## Confirmacoes
- `frontend/app.js` foi alterado.
- `backend/routes/procedimentos_routes.py` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- banco, schema, migrations e endpoints publicos nao foram alterados.
- a blindagem textual/mojibake foi respeitada.
- nenhuma string visivel existente foi alterada.

## Diagnostico da origem
A origem da contaminacao estava no frontend, no estado local do editor de procedimentos.

O ponto sensivel era a recomposicao visual dos materiais vinculados:

- o editor precisa combinar materias proprios da intervencao atual com os materiais herdados do genérico selecionado;
- antes da correcao, o snapshot ativo do procedimento podia ficar fora de sincronia com a intervencao realmente carregada;
- isso permitia que materiais proprios de uma intervencao anterior fossem reaproveitados indevidamente na recomposicao visual de outra intervencao com o mesmo genérico.

## Solucao aplicada
Em `frontend/app.js`:

1. Foi criado um marcador local para identificar o procedimento atualmente carregado no editor.
2. O editor passou a limpar o estado de materiais ao aplicar os dados de uma intervencao.
3. O snapshot do procedimento passou a ser gravado com o `id` do procedimento atual.
4. A recomposicao passou a validar se o snapshot pertence ao procedimento ativo antes de renderizar.
5. A carga do retorno de `GET /procedimentos/{id}` continua sendo a base oficial para materiais proprios + herdados.

## Como a separacao ficou
- Materiais proprios da intervencao atual continuam vindo do retorno do procedimento atual.
- Materiais herdados continuam vindo apenas do Procedimento Generico selecionado.
- Materiais proprios de outra intervencao deixam de entrar na recomposicao.
- O Procedimento Generico nao recebe contaminacao da intervencao.
- A deduplicacao por `material_id` continua preservada.
- A prioridade do material proprio da intervencao atual continua preservada.

## Itens preservados
- duplo clique em material vinculado.
- edicao de quantidade por modal completo.
- vincular material novo.
- desvincular material.
- custo, preco, relacao, quantidade, parse e formatacao monetaria.

## Riscos preservados
- Se existir dado legado incoerente no cadastro, o sistema ainda depende da consistencia do retorno do procedimento atual.
- A correcao nao altera o backend nem corrige registros antigos no banco.

## Checks executados
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - ok
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - ok
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - ok
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - ok
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py` - ok
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py` - ok

## Onde testar no navegador
1. Fazer Ctrl+F5.
2. Abrir Procedimentos Geneticos e localizar um genérico com materiais.
3. Abrir Intervencoes / Procedimentos.
4. Carregar Intervencao 1, associar o genérico e adicionar um material proprio.
5. Abrir Intervencao 2 com o mesmo genérico.
6. Confirmar que o material proprio da Intervencao 1 nao aparece na Intervencao 2.
7. Reabrir ambas e confirmar isolamento entre elas.

## Proxima etapa recomendada
Validar manualmente o fluxo no navegador e, se surgir qualquer caso legado residual, tratar apenas esse caso especifico sem misturar com outras regras do editor.
