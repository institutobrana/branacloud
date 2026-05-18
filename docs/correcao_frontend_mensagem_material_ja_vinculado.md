# Correcao frontend - mensagem de material ja vinculado

1. Objetivo da correcao.
Bloquear a tentativa de criar um novo vinculo com um material que ja existe na grade de materiais vinculados do procedimento/intervencao e exibir a mensagem amigavel permitida nesta etapa.

2. Diretorio real de trabalho.
D:\BRANA ARQUIVOS\BRANA CLOUD

3. Arquivos alterados/criados.
- Alterado: D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js
- Criado: D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_mensagem_material_ja_vinculado.md

4. Confirmacao de que frontend/app.js foi alterado ou nao.
Foi alterado, de forma localizada no fluxo de confirmacao do vinculo.

5. Confirmacao de que backend foi alterado ou nao.
Nao foi alterado.

6. Confirmacao de que frontend/index.html nao foi alterado.
Confirmado.

7. Confirmacao de que frontend/js/modules nao foi alterado.
Confirmado.

8. Confirmacao de que banco, schema, migrations e endpoints publicos nao foram alterados.
Confirmado.

9. Confirmacao de blindagem textual/mojibake.
Respeitada. Nao houve correcao de textos existentes.

10. Confirmacao da unica mensagem nova adicionada.
"Este material ja esta vinculado neste procedimento."

11. Onde a duplicidade e detectada.
No frontend/app.js, dentro de `procConfirmarVinculo()`, antes de enviar o `POST`, usando a lista atual de `procedimentoLinks`.

12. Como evita bloquear a edicao do proprio vinculo.
O bloqueio so vale para novo vinculo. Quando o modal esta em modo edicao, a rotina segue pelo `PUT` do item atual e nao aplica a checagem de duplicidade.

13. Como impede criar duplicidade.
Se o material selecionado ja existe na grade, a confirmacao exibe a mensagem permitida e retorna sem enviar `POST`.

14. Como preserva adicionar material novo.
Se o material ainda nao existe na grade, o fluxo continua normal e cria o novo vinculo.

15. Como preserva editar por duplo clique.
A edicao existente continua usando o fluxo de modal em modo edicao e nao e tratada como duplicidade.

16. Como preserva desvincular material.
O fluxo de desvinculo nao foi alterado.

17. Confirmacao de que nao houve autosave indevido.
Confirmado. A validacao ocorre apenas ao clicar em Ok.

18. Confirmacao de que preco, relacao, custo, quantidade, parse e formataçao monetaria nao foram alterados.
Confirmado.

19. Riscos preservados.
- A validacao depende da lista atual de materiais vinculados estar carregada.
- Se existir inconsistencia previa na grade, a mensagem pode refletir o estado ja presente.

20. Checks executados e resultado.
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - passou

21. Onde testar no navegador.
Abrir `Intervencoes / Procedimentos`, vincular um material novo, tentar vincular novamente o mesmo material e confirmar a mensagem:
Este material ja esta vinculado neste procedimento.

22. Proxima etapa recomendada.
Validar manualmente o fluxo completo no navegador e, se necessario, revisar apenas casos de dados legado que possam afetar a lista atual de vinculados.
