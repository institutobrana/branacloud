# Auditoria Git/read-only: fluxo de materiais vinculados em Intervencoes / Procedimentos

## 1. Objetivo da auditoria Git
Localizar, no historico Git e no estado local atual, o ultimo ponto em que o fluxo de materiais vinculados em `Intervencoes / Procedimentos` parecia consistente e identificar onde a situacao passou a divergir novamente, sem alterar qualquer arquivo.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacao de que nenhum codigo foi alterado
Nenhum codigo funcional foi alterado nesta auditoria. O trabalho foi somente de leitura, consulta ao historico Git e documentacao.

## 4. Confirmacao de que nao houve checkout, reset, restore, commit, push, pull ou merge
Confirmado. Nao executei `checkout`, `reset`, `restore`, `commit`, `push`, `pull`, `merge`, `rebase`, `stash`, `apply` nem troca de branch.

## 5. Branch atual
`modularizacao-segura-fase-1`

## 6. Remotos configurados
- `origin https://github.com/institutobrana/branacloud.git (fetch)`
- `origin https://github.com/institutobrana/branacloud.git (push)`

## 7. Commits analisados
Os principais commits e refs analisados foram:
- `c132c45` - `Versao inicial do Brana Cloud`
- `1dc8b18` - `Restaura frontend monolitico e corrige contratos globais pos-reversao`
- `f3cab35` - `Corrige duplo clique em convenios e planos no monolitico`
- `26dc1b9` - `feat(frontend): inicia ciclo seguro de procedimentos genericos`
- `2ee1e94` - `modularizacao simbolos graficos com helpers passivos`
- `717f59c` - `refs/stash` / `On main: Pendencias backend restantes antes da modularizacao`

## 8. Comandos Git read-only executados
- `git branch --show-current`
- `git remote -v`
- `git log --oneline --decorate --all -n 80`
- `git log --oneline --decorate --all -- frontend/app.js backend/routes/procedimentos_routes.py`
- `git log --oneline --decorate --all --grep='material'`
- `git log --oneline --decorate --all --grep='Tabela de procedimentos'`
- `git log --oneline --decorate --all --grep='Vincular material'`
- `git log --oneline --decorate --all --grep='duplo'`
- `git log --oneline --decorate --all --grep='quantidade'`
- `git log --oneline --decorate --all --grep='procedimento'`
- `git log --oneline --decorate --all --grep='generico'`
- `git log --oneline --decorate --all --grep='materiais'`
- `git log --oneline --decorate --all -S 'Informe a nova quantidade' -- frontend/app.js`
- `git log --oneline --decorate --all -S 'Tabela de procedimentos nao encontrada' -- backend/routes/procedimentos_routes.py`
- `git log --oneline --decorate --all -S 'procConfirmarVinculo' -- frontend/app.js`
- `git log --oneline --decorate --all -S 'procEditarVinculoSelecionado' -- frontend/app.js`
- `git log --oneline --decorate --all -S 'proc.linksTbody.addEventListener("dblclick"' -- frontend/app.js`
- `git log --oneline --decorate --all -S '_load_tabela_or_404' -- backend/routes/procedimentos_routes.py`
- `git diff -- frontend/app.js`
- `git diff -- backend/routes/procedimentos_routes.py`
- `git status --short`

## 9. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_alerta_tabela_procedimentos_nao_encontrada_vinculo_material.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_6_consolidacao_pos_integracao.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_auditoria_appjs.md`

## 10. Resultado da busca por "Tabela de procedimentos nao encontrada"
- A string existe no backend e foi localizada em `backend/routes/procedimentos_routes.py`.
- O helper responsavel e `_load_tabela_or_404`.
- O texto exato continua presente no historico e no estado atual.

## 11. Resultado da busca por "Informe a nova quantidade"
- A string existe em `frontend/app.js`.
- Ela aparece na funcao `procEditarVinculoSelecionado()`, ligada ao duplo clique na grade de materiais vinculados.
- No historico acessivel, essa forma de edicao por prompt ja aparece desde `c132c45`.

## 12. Resultado da busca por "Vincular material"
- A string existe em `frontend/app.js` e `frontend/index.html`.
- Em `index.html`, ela identifica o modal de vinculo.
- Em `app.js`, ela aparece no mapeamento de titulos do backdrop.

## 13. Resultado da busca por "procConfirmarVinculo"
- A funcao existe em `frontend/app.js` desde `c132c45`.
- Ela aciona `POST /procedimentos/{procedimentoAtualId}/materiais-vinculados`.
- Nao houve commit visivel no historico que alterasse a sua forma basica de confirmacao.

## 14. Resultado da busca por "procEditarVinculoSelecionado"
- A funcao existe em `frontend/app.js` desde `c132c45`.
- Ela usa `window.prompt("Informe a nova quantidade:", atual)` e depois `PUT /procedimentos/{procedimentoAtualId}/materiais-vinculados/por-codigo/{codigo}`.
- Nao foi encontrado no historico acessivel um commit que a transforme em modal completo.

## 15. Resultado da busca por "procVincula"
- O fluxo de vinculo aparece em `frontend/app.js` como `procConfirmarVinculo`, `procRecarregarLinks`, `procFecharVincular`, `procVincula...` relacionados ao modal e ao editor.
- O comportamento de confirmacao continua concentrado no modal de vinculo, nao no duplo clique de edicao.

## 16. Resultado da busca por "procRenderLinks"
- A funcao existe em `frontend/app.js` e e o ponto central da renderizacao da grade de materiais vinculados.
- No estado atual do projeto, ela recebe `materiais_vinculados` do backend e redesenha a lista e os totais.

## 17. Resultado da busca por "materiais_vinculados"
- O contrato existe em frontend, backend, modelos e docs.
- No historico acessivel, o `GET /procedimentos/{id}` em `backend/routes/procedimentos_routes.py` devolvia apenas os materiais diretos do procedimento.
- No estado atual do working tree, ha composicao em memoria com materiais herdados do generico.

## 18. Resultado da busca por "procedimento_generico_id"
- O campo existe em `frontend/app.js`, `backend/models/procedimento.py`, `backend/models/procedimento_generico.py` e em varios trechos de `backend/routes/procedimentos_routes.py`.
- O frontend grava o campo no payload do procedimento.
- O backend usa esse campo para carregar ou compor materiais herdados.

## 19. Ultimo commit ou periodo em que o fluxo parecia correto
Nao encontrei, no historico Git acessivel, um commit que mostre o comportamento completo esperado de `duplo clique abrindo modal completo` para materiais vinculados de procedimento.

O que o historico mostra e:
- o fluxo de adicao de vinculo via modal `Vincular material` ja existe desde `c132c45`;
- a edicao por duplo clique com `window.prompt("Informe a nova quantidade:")` tambem ja existe desde `c132c45`;
- o alerta `Tabela de procedimentos nao encontrada.` tambem ja existe desde `c132c45`.

Como resultado, o ultimo ponto "claramente correto" para o subconjunto de materiais vinculados nao apareceu como um commit distinto no historico acessivel.

## 20. Primeiro commit ou periodo em que o fluxo parece ter quebrado
Pelo historico Git acessivel, nao houve um commit claro que introduzisse a quebra do prompt/double-click, porque esse comportamento ja estava presente desde o commit inicial.

Para o fluxo de heranca de materiais, a divergencia visivel mais recente esta no estado local atual em relacao ao `HEAD` `2ee1e94`, onde:
- o backend passou a compor `materiais_vinculados` em memoria;
- o frontend passou a recompor a lista ao trocar `procedimento_generico_id`.

Ou seja:
- nao apareceu uma quebra nova rastreavel por commit para o prompt/double-click;
- o ponto de divergencia funcional mais recente esta no working tree atual, nao em um commit publicado.

## 21. Diferencas encontradas em frontend/app.js
Comparando o working tree atual com `HEAD`:
- foram adicionados estados novos para a composicao de materiais herdados (`procEditorSnapshot`, `procMateriaisGenericoBaseId`, `procMateriaisGenericoVisualId`, `procMateriaisGenericoRenderSeq`, `procMateriaisGenericoCache`);
- foram adicionadas funcoes de composicao em memoria (`procCarregarMateriaisGenericoDetalhe`, `procComporMateriaisEditorPorGenerico`, `procAtualizarMateriaisEditorVisualizacao`);
- foi adicionado o `change` em `proc.cboGenerico` para atualizar a lista visual;
- o duplo clique da grade de materiais vinculados continua chamando `procEditarVinculoSelecionado()` com `window.prompt`, sem abrir modal completo;
- `procConfirmarVinculo()` continua chamando `POST /procedimentos/{id}/materiais-vinculados`.

## 22. Diferencas encontradas em backend/routes/procedimentos_routes.py
Comparando o working tree atual com `HEAD`:
- foram adicionadas `_listar_materiais_vinculados_generico()` e `_compor_materiais_vinculados_procedimento()`;
- `detalhar_procedimento()` passou a devolver `materiais_vinculados` composto;
- o helper `_load_tabela_or_404()` continua sendo o ponto que levanta `HTTPException(status_code=404, detail="Tabela de procedimentos nao encontrada.")`;
- os endpoints de vinculacao de material continuam dependendo da tabela do procedimento atual via `proc.tabela_id`.

## 23. Como era o duplo clique antes
No historico acessivel, o duplo clique em material vinculado ja abria o prompt de quantidade:
`window.prompt("Informe a nova quantidade:", atual)`.

Nao foi encontrado um commit visivel com modal completo para edicao de material vinculado nesse fluxo.

## 24. Como esta o duplo clique agora
No estado atual do working tree, o duplo clique continua abrindo o mesmo prompt simples de quantidade.

Ou seja, a exibicao atual segue sendo:
- selecionar linha;
- dar duplo clique;
- informar quantidade;
- confirmar via `PUT`.

## 25. Como era a edicao de material vinculado antes
No historico acessivel, a edicao ja era feita por prompt simples de quantidade, sem modal completo.

## 26. Como esta a edicao agora
Permanece igual:
- `procEditarVinculoSelecionado()` usa `window.prompt`;
- o fluxo nao foi trocado para um modal de edicao completo neste conjunto de commits revisados.

## 27. Como era a resolucao de tabela de procedimentos antes
Nos commits acessiveis, os endpoints de vinculo de material ja chamavam `_load_tabela_or_404(db, current_user.clinica_id, int(proc.tabela_id or 1))`.

Isso significa que o fluxo ja dependia da tabela do procedimento antes da correcao recente.

## 28. Como esta agora
Permanece o mesmo no trecho que dispara o alerta:
- se a tabela nao for localizada ou nao pertencer ao contexto esperado, o backend retorna `404` com `Tabela de procedimentos nao encontrada.`.

## 29. Como era a heranca de materiais do generico antes
No estado anterior ao working tree atual, `GET /procedimentos/{id}` retornava apenas os materiais diretos do procedimento, sem composicao com os materiais herdados do `procedimento_generico_id`.

## 30. Como esta agora
No working tree atual, o backend compoe `materiais_vinculados` em memoria:
- materiais diretos do procedimento;
- materiais herdados do procedimento generico;
- deduplicacao por `material_id`.

## 31. Se a correcao antiga foi perdida em reversao, modularizacao ou nova correcao
Para o fluxo exato de materiais vinculados:
- nao encontrei uma "correcao antiga" de modal completo para o duplo clique que tenha sido perdida;
- o prompt simples parece ser o comportamento historico desde o inicio acessivel;
- a heranca de materiais do generico foi adicionada no working tree atual, nao removida por reversao visivel no Git acessivel.

## 32. Lista dos trechos antigos candidatos a restauracao/reaplicacao
Trechos candidatos, caso a intencao seja consolidar o fluxo de materiais vinculados:
- `frontend/app.js`:
  - `procConfirmarVinculo()`
  - `procEditarVinculoSelecionado()`
  - `procRenderLinks()`
  - `procAbrirEditor()`
  - o bind `proc.linksTbody.addEventListener("dblclick", ...)`
- `backend/routes/procedimentos_routes.py`:
  - `_load_tabela_or_404()`
  - `detalhar_procedimento()`
  - `_compor_materiais_vinculados_procedimento()`

Observacao importante:
- nao encontrei, no historico acessivel, um trecho antigo de modal completo para edicao por duplo clique em materiais vinculados de procedimento.

## 33. Lista dos trechos atuais que parecem ter quebrado o fluxo
Os trechos que mais merecem atencao no estado atual sao:
- `backend/routes/procedimentos_routes.py`, no helper `_load_tabela_or_404()`, porque e ele que emite o alerta `Tabela de procedimentos nao encontrada.`;
- os endpoints de vinculo de material do procedimento, que continuam dependendo da tabela resolvida;
- `frontend/app.js`, na combinacao entre `procEditorSnapshot`, recomposicao de materiais herdados e a edicao simples por prompt, porque o estado visual agora e mais dinamico do que o contrato historico simples.

## 34. Diagnostico provavel
O erro `Tabela de procedimentos nao encontrada.` nao nasce no frontend. Ele nasce no backend ao tentar resolver a tabela do procedimento atual no fluxo de adicionar, editar ou desvincular material.

Quanto ao duplo clique:
- o comportamento de prompt simples nao parece ser uma regressao recente visivel no Git;
- o modal completo esperado nao foi encontrado no historico acessivel.

Quanto a heranca de materiais:
- o fluxo historico usava apenas materiais diretos na leitura do procedimento;
- o working tree atual tenta compor a lista em memoria, o que e um avanco funcional, nao a origem do alerta.

## 35. Ponto exato ou mais provavel em que comecou a quebrar
Nao encontrei um commit especifico que marque a quebra do prompt/double-click para materiais vinculados.

O que foi encontrado com clareza e:
- o comportamento atual do prompt e do alerta ja estava presente no commit inicial acessivel `c132c45`;
- o ponto de divergencia mais recente no fluxo de heranca e atualizacao imediata esta no working tree atual em relacao ao `HEAD` `2ee1e94`, nao em um commit publicado.

## 36. Plano de correcao futura, sem aplicar
Proposta conservadora, sem implementar agora:
1. Fechar a origem do alerta `Tabela de procedimentos nao encontrada.` validando o contexto da tabela antes de confirmar/editar/desvincular material.
2. Separadamente, decidir se o duplo clique deve continuar com prompt simples ou ser trocado para modal completo.
3. Se o modal completo for a regra correta, implementar em etapa propria, sem misturar com a correcao da tabela.
4. Manter a heranca de materiais do generico no `GET /procedimentos/{id}` consistente com o comportamento da tela.

## 37. Ordem recomendada das correcoes
1. Resolver o contexto de tabela no backend para eliminar o alerta.
2. Validar a composicao de `materiais_vinculados` no `GET /procedimentos/{id}`.
3. Reavaliar o comportamento do duplo clique e, se necessario, substituir o prompt por modal completo em etapa separada.

## 38. Riscos de restaurar codigo antigo sem adaptacao
- reintroduzir perda de materiais proprios;
- quebrar a composicao de herdados do generico;
- mascarar o problema de tabela inexistente;
- alterar custo ou quantidade sem o contexto correto;
- retornar a uma navegacao incoerente entre modal de vinculo e edicao por prompt.

## 39. Checklist de testes depois da futura correcao
1. Fazer `Ctrl+F5`.
2. Abrir `Intervencoes / Procedimentos`.
3. Abrir um procedimento existente.
4. Abrir o modal `Vincular material`.
5. Adicionar material vinculado.
6. Editar material vinculado existente.
7. Desvincular material.
8. Trocar `Procedimento Generico` na combo.
9. Confirmar que materiais herdados mudam corretamente.
10. Adicionar material proprio apos trocar o generico.
11. Salvar e reabrir.
12. Confirmar que nao aparece `Tabela de procedimentos nao encontrada`.
13. Confirmar que custos permanecem corretos.
14. Confirmar que `Materiais` continua normal.
15. Confirmar que `Procedimentos Genericos` continua normal.
16. Confirmar console sem erro.
