# Correcao frontend: duplo clique em material vinculado abre modal completo

## 1. Objetivo da correcao
Corrigir o duplo clique na grade de materiais vinculados em Intervencoes / Procedimentos para que ele abra o modal completo "Vincular material" em vez do prompt simples "Informe a nova quantidade:".

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos alterados/criados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_duplo_clique_material_vinculado_abre_modal.md`

## 4. Confirmacao de que apenas frontend/app.js foi alterado em codigo
Sim. A alteracao funcional ficou restrita a `frontend/app.js`.

## 5. Confirmacao de que frontend/index.html nao foi alterado
Confirmado. O modal ja existia no HTML e nao foi preciso editar `frontend/index.html`.

## 6. Confirmacao de que frontend/js/modules nao foi alterado
Confirmado. Nao houve alteracao em `frontend/js/modules/materiais.js` nem em `frontend/js/modules/procedimentos-genericos.js`.

## 7. Confirmacao de que backend, banco e endpoints nao foram alterados
Confirmado. Nao houve alteracao de backend, banco, schema, migrations ou contrato de endpoint.

## 8. Confirmacao de blindagem textual/mojibake
Respeitada. Nenhum texto visivel do sistema foi corrigido ou reescrito nesta etapa.

## 9. Funcao antiga que abria o prompt
`procEditarVinculoSelecionado()` era a funcao que abria `window.prompt("Informe a nova quantidade:")` no duplo clique da grade.

## 10. Funcao/evento de duplo clique ajustado
O evento de duplo clique continua apontando para `procEditarVinculoSelecionado()`, mas a funcao passou a montar contexto de edicao e abrir o modal completo com `procAbrirVincular("editar")`.

## 11. Como o modal completo passou a ser aberto
A edicao agora reutiliza o mesmo modal `vincula-backdrop` / "Vincular material". Ao abrir em modo edicao, o frontend preenche os campos do vinculo selecionado e exibe o modal inteiro, sem prompt.

## 12. Como o vinculo existente e identificado
O item selecionado e lido da linha marcada na grade e da lista interna `procedimentoLinks`. O contexto de edicao guarda `codigo`, `material_id`, `nome`, `custo_und`, `custo_total` e `quantidade` do vinculo clicado.

## 13. Como o vinculo existente e atualizado sem duplicar
`procConfirmarVinculo()` passou a verificar se ha um contexto de edicao ativo. Nesse caso, ela envia `PUT` para o vinculo existente por codigo, atualiza apenas a quantidade e depois recarrega a lista, evitando duplicidade.

## 14. Como novo vinculo continua funcionando
Quando o modal e aberto pelo botao "Vincular material", o modo de edicao e limpo e o fluxo continua usando `POST` para criar um novo vinculo, como antes.

## 15. Como desvincular material continua preservado
O fluxo de desvincular nao foi alterado. `procDesvincularSelecionado()` segue usando a mesma acao de exclusao da linha selecionada.

## 16. Confirmacao de que nao houve autosave indevido
Confirmado. Abrir o modal nao salva nada automaticamente. A gravacao so ocorre ao clicar em Ok.

## 17. Confirmacao de que preco, relacao, custo, parse e formatacao monetaria nao foram alterados
Confirmado. A correcao nao mexe nas regras monetarias. O modal reaproveita os campos ja existentes e apenas ajusta o fluxo de abertura e confirmacao.

## 18. Riscos preservados
- A edicao continua limitada ao vinculo existente sem alterar o backend.
- Se o usuario tentar mudar o material em vez da quantidade, o contrato atual nao suporta troca completa de material por este caminho e a estrategia conservadora e preservar o vinculo original.
- O erro "Tabela de procedimentos nao encontrada." continua como proximo problema backend conhecido e nao foi tratado aqui.

## 19. Checks executados e resultado
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - passou

## 20. Onde testar no navegador
1. Fazer Ctrl+F5.
2. Abrir Intervencoes / Procedimentos.
3. Abrir um procedimento existente com materiais vinculados.
4. Dar duplo clique em um material vinculado.
5. Confirmar que abre o modal completo "Vincular material".
6. Confirmar que nao aparece o prompt "Informe a nova quantidade".
7. Confirmar que o modal vem preenchido com o material selecionado.
8. Alterar somente a quantidade.
9. Clicar Ok.
10. Confirmar que a linha foi atualizada, sem duplicar.
11. Dar duplo clique novamente na mesma linha.
12. Confirmar que o modal abre novamente preenchido.
13. Testar o botao "Vincular material" para adicionar novo material.
14. Confirmar que adicionar novo material continua funcionando.
15. Testar "Desvincular material".
16. Confirmar que desvincular continua funcionando.
17. Confirmar que o painel financeiro atualiza como antes.
18. Confirmar console sem erro.

## 21. Proxima etapa recomendada
Validar manualmente o fluxo completo no navegador e, em seguida, tratar separadamente o proximo problema conhecido do backend, sem misturar essa correcao com heranca de materiais ou resolucao de tabela de procedimentos.
