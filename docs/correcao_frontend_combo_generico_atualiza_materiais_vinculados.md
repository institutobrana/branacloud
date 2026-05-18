# Correcao frontend - combo Procedimento Generico atualiza materiais vinculados

## 1. Objetivo
Registrar a correcao minima e conservadora que faz a troca da combo `Procedimento Generico` atualizar imediatamente a lista visual de `materiais_vinculados` na tela de `Procedimentos / Intervencoes`.

## 2. Diretorio real usado
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`

## 4. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`

## 5. Escopo da correcao
- A correcao foi limitada ao frontend.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend, banco, schema, migrations e endpoints nao foram alterados.

## 6. Blindagem textual
- A blindagem textual/mojibake foi respeitada.
- Nenhum texto visivel, label, mensagem, placeholder, acento ou string de usuario foi alterado.

## 7. Problema tecnico
- O backend ja compoe `materiais_vinculados` no `GET /procedimentos/{id}`.
- O frontend, porem, nao recompunha a lista quando o usuario trocava o `Procedimento Generico` na tela de edicao.
- Resultado: a tela nao refletia imediatamente o novo conjunto de materiais herdados.

## 8. Solucao aplicada
- Foi adicionado no `frontend/app.js` um fluxo local de recomposicao de materiais para o editor de procedimentos.
- Ao mudar a combo `Procedimento Generico`, a lista visual e recomposta com base no snapshot atual do editor e no generico selecionado.
- Para procedimentos ja salvos, o editor preserva materiais proprios e substitui apenas os herdados do generico anterior.
- Para novo procedimento ainda sem persistencia, a tela passa a mostrar os materiais do generico selecionado.

## 9. Onde fica a combo Procedimento Generico
- No editor de `Procedimentos / Intervencoes`, em `frontend/app.js`, no fluxo do modal/painel de procedimento.

## 10. Evento ajustado
- Foi adicionado um listener `change` para `proc.cboGenerico`.
- Esse listener chama a recomposicao local dos materiais vinculados sem autosave.

## 11. Como os materiais do generico selecionado sao buscados
- Foi usado o endpoint ja existente:
  - `GET /cadastros/procedimentos-genericos/detalhe/{id}`
- O retorno detalhado do generico fornece a lista `materiais`.
- Um cache local em memoria evita chamadas repetidas quando possivel.

## 12. Como a lista visual/local e atualizada
- O editor guarda um snapshot do procedimento carregado.
- Na troca do generico, o snapshot atual e recomposto em memoria.
- O resultado final e enviado para `procRenderLinks`, que atualiza a grade e os totais.

## 13. Como materiais proprios sao preservados
- A recomposicao separa o que veio do generico antigo do que deve permanecer como material proprio.
- A separacao usa comparacao conservadora por:
  - `material_id`
  - `codigo`
  - `nome`
  - `quantidade`
  - `relacao`
  - `preco`
  - `custo_und`
  - `custo_total`
- Itens nao reconhecidos como herdados sao preservados como proprios.

## 14. Como materiais herdados do generico anterior sao removidos ou substituidos
- Ao trocar o generico, os itens classificados como herdados do generico anterior deixam de compor a lista final.
- Em seguida entram os materiais do novo generico selecionado.
- Isso evita contaminar o generico original e evita persistencia automatica.

## 15. Como a deduplicacao por `material_id` foi feita
- A composicao usa `Set` em memoria para impedir repeticao do mesmo `material_id`.
- Quando o mesmo `material_id` aparece mais de uma vez, a primeira ocorrencia valida prevalece.

## 16. Como a preferencia pelo material proprio foi preservada
- Materiais proprios entram primeiro na composicao.
- Se um `material_id` ja existir como proprio, o material herdado do novo generico e ignorado.
- Assim, o proprio prevalece em caso de conflito.

## 17. Confirmacao sobre o Procedimento Generico
- O Procedimento Generico nao e alterado.
- A alteracao apenas le os materiais do generico selecionado para compor a tela do procedimento.

## 18. Confirmacao sobre salvamento
- Nao ha salvamento automatico ao trocar a combo.
- O salvamento continua seguindo o fluxo ja existente.

## 19. Confirmacao sobre custo, relacao e parse
- Nao houve alteracao de parse numerico.
- Nao houve alteracao de formatacao monetaria.
- Nao houve alteracao da regra de custo, relacao ou calculo financeiro.

## 20. Riscos preservados
- Se existir material proprio visualmente indistinguivel de um herdado, a separacao continua dependente do snapshot atual do editor.
- O risco de ambiguidade existe porque o contrato atual nao traz um marcador de origem obrigatorio para cada item.
- O comportamento conservador reduz o risco de perda de material proprio, mas ainda depende da consistencia do dado legado.

## 21. Checks executados
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- Resultado: todos passaram.

## 22. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genericos`.
3. Localizar ou criar `Procedimento Generico A` com materiais vinculados.
4. Localizar ou criar `Procedimento Generico B` com materiais vinculados diferentes.
5. Abrir `Procedimentos / Intervencoes`.
6. Inserir ou alterar uma intervencao/procedimento.
7. Selecionar `Procedimento Generico A` na combo.
8. Confirmar que os materiais de `A` aparecem imediatamente.
9. Trocar para `Procedimento Generico B`.
10. Confirmar que os materiais herdados de `A` saem e os de `B` entram.
11. Adicionar material extra diretamente no procedimento.
12. Confirmar que o material proprio nao e perdido.
13. Salvar o procedimento.
14. Fechar e reabrir.
15. Confirmar materiais herdados + material proprio, sem duplicidade.
16. Reabrir o Procedimento Generico e confirmar que nao recebeu material extra.
17. Conferir custo total, preco, relacao e custo.
18. Confirmar ausencia de erro novo no console.
19. Abrir `Materiais` e confirmar que continua normal.
20. Abrir `Procedimentos Genericos` e confirmar que continua normal.

## 23. Recomendacao objetiva para a proxima etapa
- Validar manualmente o fluxo completo no navegador e, se houver algum caso legado ambguo, avaliar apenas um refinamento pontual do criterio de separacao entre material proprio e herdado.
