# Correcao backend: heranca de materiais do Procedimento Generico no GET /procedimentos/{id}

Data da correcao: 2026-05-16

## 1. Objetivo da correcao
Aplicar uma correcao minima e conservadora para que o endpoint `GET /procedimentos/{id}` retorne `materiais_vinculados` ja composto com:

- materiais proprios do Procedimento/Intervencao;
- materiais herdados do Procedimento Generico associado;
- deduplicacao por `material_id`;
- preferencia pelo material proprio quando houver conflito;
- sem alterar o Procedimento Generico original;
- sem gravar dados no banco durante o GET.

## 2. Diretorio real usado
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos analisados
Arquivos analisados em leitura antes da correcao:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 4. Arquivos alterados
Arquivos alterados nesta etapa:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`

## 5. Confirmacao de escopo
A correcao foi limitada ao backend no ponto do detalhe do procedimento.

## 6. Confirmacoes de nao alteracao no frontend
Confirmado:

- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules` nao foi alterado.

## 7. Confirmacao de banco, schema e migrations
Confirmado:

- banco nao foi alterado;
- schema nao foi alterado;
- migrations nao foram alteradas.

## 8. Confirmacao de blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada.

Nao foram alterados textos visiveis, labels, mensagens, placeholders ou strings de interface.

## 9. Problema tecnico
O endpoint de detalhe do procedimento retornava apenas os materiais diretos do procedimento em `materiais_vinculados`.

Com isso, o frontend recebia uma lista incompleta quando o procedimento tinha um `procedimento_generico_id` com materiais herdados.

## 10. Solucao aplicada
Foi criada uma composicao em memoria para o detalhe do procedimento.

No `GET /procedimentos/{id}` o retorno agora:

- carrega os materiais diretos do procedimento;
- carrega os materiais do Procedimento Generico associado, quando existir;
- compoe uma unica lista em memoria;
- deduplica por `material_id`;
- preserva o material proprio do procedimento quando existe conflito;
- inclui apenas os herdados que nao existem no procedimento;
- nao grava nada no banco.

## 11. Como materiais proprios sao carregados
Os materiais proprios continuam vindo de:

- `ProcedimentoMaterial`;
- funcao `_listar_materiais_vinculados(db, procedimento_id)`.

Essa origem permanece sendo a base prioritaria da composicao.

## 12. Como materiais herdados do generico sao carregados
Os materiais herdados sao carregados por:

- `ProcedimentoGenericoMaterial`;
- nova funcao `_listar_materiais_vinculados_generico(db, clinica_id, procedimento_generico_id)`.

Essa funcao le os vinculos do generico associado ao procedimento e monta o mesmo formato de item usado pelo frontend.

## 13. Como a deduplicacao por material_id foi feita
A composicao usa um conjunto de `material_id` ja vistos.

Regra aplicada:

- primeiro entram os materiais proprios do procedimento;
- depois entram os herdados do generico apenas se `material_id` ainda nao tiver aparecido;
- assim, conflitos sao resolvidos em favor do material proprio;
- o herdado duplicado e ignorado.

## 14. Como a preferencia pelo material proprio foi preservada
A preferencia pelo material proprio foi preservada porque a composicao inclui primeiro os itens diretos do procedimento.

Se o mesmo `material_id` existir no generico, o item herdado e descartado.

## 15. Confirmacao de que o Procedimento Generico nao e alterado
Confirmado.

A correcao nao altera o Procedimento Generico nem seus materiais armazenados.

## 16. Confirmacao de que o GET nao grava dados no banco
Confirmado.

O `GET /procedimentos/{id}` apenas le e compoe em memoria.

## 17. Confirmacao de que POST/PUT nao foram alterados
Confirmado.

Os fluxos de `POST /procedimentos` e `PUT /procedimentos/{id}` nao foram alterados nesta etapa.

## 18. Riscos preservados
Riscos que continuam sendo monitorados:

- custo incorreto;
- duplicidade indevida;
- dependencia de contrato antigo no frontend;
- eventual necessidade de alinhar a resposta de salvamento em uma etapa futura;
- regressao em Procedimentos;
- regressao em Procedimentos Genericos.

## 19. Checks executados
Checks seguros executados e com sucesso:

- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 20. Onde testar no navegador
Depois desta correcao, testar manualmente:

1. Fazer `Ctrl+F5`.
2. Criar ou localizar um Procedimento Generico com materiais vinculados.
3. Abrir `Procedimentos / Intervencoes`.
4. Inserir ou alterar uma intervencao/procedimento.
5. Selecionar ou confirmar um Procedimento Generico na combo.
6. Salvar, se o fluxo exigir.
7. Reabrir o Procedimento/Intervencao.
8. Confirmar que os materiais herdados do Procedimento Generico aparecem.
9. Adicionar um material extra diretamente no Procedimento/Intervencao.
10. Salvar o Procedimento/Intervencao.
11. Reabrir o Procedimento/Intervencao.
12. Confirmar que aparecem materiais herdados, material proprio extra e ausencia de duplicidade indevida.
13. Reabrir o Procedimento Generico.
14. Confirmar que o material extra nao foi incluido no Procedimento Generico.
15. Conferir custo total dos materiais.
16. Conferir se preco, relacao e custo nao mudaram indevidamente.
17. Confirmar ausencia de erro novo no console.
18. Abrir `Materiais` e confirmar que continua normal.
19. Abrir `Procedimentos Genericos` e confirmar que continua normal.

## 21. Recomendacao objetiva para a proxima etapa
Validar o fluxo manual de abrir, reabrir e editar o procedimento com generico associado.
Se houver necessidade de refletir a composicao herdada imediatamente na resposta de salvamento, tratar isso em uma etapa separada e ainda conservadora.
