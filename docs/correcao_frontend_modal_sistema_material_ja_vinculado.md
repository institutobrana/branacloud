# Correcao frontend - modal de material ja vinculado

1. Objetivo da correcao.
Trocar a mensagem de duplicidade exibida em alert nativo por um modal proprio do sistema, mantendo exatamente o mesmo texto funcional.

2. Diretorio real de trabalho.
D:\BRANA ARQUIVOS\BRANA CLOUD

3. Arquivos alterados/criados.
- Alterado: D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js
- Criado: D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_modal_sistema_material_ja_vinculado.md

4. Confirmacao se frontend/app.js foi alterado.
Sim.

5. Confirmacao se frontend/index.html foi ou nao alterado.
Nao foi alterado.

6. Confirmacao de que frontend/js/modules nao foi alterado.
Confirmado.

7. Confirmacao de que backend, banco e endpoints nao foram alterados.
Confirmado.

8. Confirmacao de blindagem textual/mojibake.
Respeitada. Nenhuma string visivel existente foi modificada.

9. Confirmacao de que a mensagem foi mantida exatamente.
Este material ja esta vinculado neste procedimento.

10. Onde estava o alert nativo.
No fluxo de confirmacao do vinculo, dentro de `procConfirmarVinculo()`.

11. Como a mensagem passou a ser exibida.
Ao detectar duplicidade no novo vinculo, o fluxo chama um modal local criado em `frontend/app.js` e exibe a mensagem no painel proprio do sistema.

12. Se foi reutilizado modal existente ou criado modal local.
Foi criado um modal local pequeno em `frontend/app.js`, com visual compatível com os modais do sistema.

13. Como o modal fecha.
Fecha ao clicar em `Ok` ou ao clicar fora da caixa do modal.

14. Como o modal "Vincular material" e preservado.
O modal principal continua aberto por tras do aviso e nao teve seu fluxo alterado.

15. Confirmacao de que a regra de duplicidade nao foi alterada.
Confirmado. A validacao continua bloqueando o novo vinculo quando o material ja existe na grade.

16. Confirmacao de que nao houve POST indevido.
Confirmado. Quando ha duplicidade, o fluxo retorna antes do envio do `POST`.

17. Confirmacao de que preco, relacao, custo, quantidade, parse e formataçao monetaria nao foram alterados.
Confirmado.

18. Riscos preservados.
- O aviso depende da lista atual de materiais vinculados carregada no editor.
- Nao houve ajuste no backend, entao qualquer inconsistencia de dados continua sendo tratada fora desta etapa.

19. Checks executados e resultado.
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js` - passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js` - passou
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py` - passou

20. Onde testar no navegador.
Abrir `Intervencoes / Procedimentos`, tentar vincular novamente um material ja existente e confirmar que o sistema mostra um modal proprio com a mensagem:
Este material ja esta vinculado neste procedimento.

21. Proxima etapa recomendada.
Validar manualmente no navegador se o modal ficou acima do dialogo de vinculo e se nao interfere com adicionar, editar ou desvincular materiais.
