# Auditoria da origem da lista de materiais ao associar ou trocar Procedimento Generico em Intervencoes / Procedimentos

## 1. Objetivo da auditoria
Mapear, somente por leitura, de onde vem a lista de materiais quando uma Intervencao / Procedimento e aberta, quando o usuario associa um Procedimento Generico e quando troca esse Procedimento Generico.

A auditoria serve para explicar por que ainda pode aparecer material quando o novo Procedimento Generico nao tem materiais e por que a troca nem sempre remove corretamente os herdados antigos.

## 2. Diretorio real de trabalho
`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Confirmacao de natureza documental
Esta etapa e somente auditoria documental.

Nao houve alteracao de codigo funcional, nao houve patch, nao houve ajuste de comportamento e nao houve gravacao em banco.

## 4. Contrato funcional usado como base
Contrato consultado e adotado como referencia:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`

## 5. Documentos analisados
Documentos lidos em apoio a auditoria:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_regra_heranca_materiais_generico_para_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_heranca_materiais_generico_get_procedimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_combo_generico_atualiza_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_contaminacao_material_local_entre_intervencoes_mesmo_generico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_duplo_clique_material_vinculado_abre_modal.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_backend_tabela_procedimentos_vinculo_material.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_mensagem_material_ja_vinculado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_frontend_modal_sistema_material_ja_vinculado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_gravacao_material_procedimento_generico_preserva_heranca.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_definitiva_pgen_falha_gravar_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_git_fluxo_materiais_vinculados_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_ampliada_stash_branches_fluxo_materiais_vinculados.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\procedimentos_genericos_subetapa_2_fronteiras_contratos.md`

Documento listado no prompt e nao encontrado:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\correcao_pgen_gravacao_material_e_step_quantidade.md` -> nao encontrado

## 6. Arquivos consultados somente em leitura
Arquivos funcionalmente analisados nesta auditoria:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 7. Confirmacoes de integridade
- nenhum codigo foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules` nao foi alterado;
- backend, banco, schema, migrations e endpoints nao foram alterados;
- a blindagem textual/mojibake foi respeitada;
- nenhuma string visivel do sistema foi alterada.

## 8. Funcoes frontend encontradas
Funcoes e estados relevantes localizados em `frontend/app.js`:

- `procAbrirEditor`
- `procAplicarDadosEditor`
- `procSalvar`
- `proc.cboGenerico`
- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`
- `procMateriaisGenericoBaseId`
- `procMateriaisGenericoVisualId`
- `procMateriaisGenericoRenderSeq`
- `procMateriaisGenericoCache`
- `procRenderLinks`
- `procRecarregarLinks`
- `procConfirmarVinculo`
- `procAbrirVincular`
- `procVinculaEdicao`
- `procLimparEstadoMateriaisEditor`
- `procAtualizarMateriaisEditorVisualizacao`
- `procComporMateriaisEditorPorGenerico`
- `procCarregarMateriaisGenericoDetalhe`
- `change`
- `addEventListener("change")`
- `requestJson`
- `cadastros/procedimentos-genericos/detalhe`

## 9. Funcoes backend encontradas
Funcoes e rotinas relevantes em backend:

### 9.1 `backend/routes/procedimentos_routes.py`
- `detalhar_procedimento`
- `_compor_materiais_vinculados_procedimento`
- `_listar_materiais_vinculados`
- `_listar_materiais_vinculados_generico`
- `procedimento_generico_id`
- `materiais_vinculados`
- `material_id`
- `procedimento_id`
- `tabela_id`
- `origem`
- `herdado`

### 9.2 `backend/routes/cadastros_routes.py`
- `procedimentos-genericos`
- `detalhe`
- `materiais`
- `procedimento_generico_id`
- `material_id`
- `_sync_procedimento_generico_materiais`

## 10. Fluxo atual ao abrir Intervencao / Procedimento
O ponto de entrada e `procAbrirEditor(id=null)`.

Fluxo observado:

1. A tela limpa estado visual e zera marcadores locais.
2. Apos isso, faz `GET /procedimentos/{id}` quando existe id.
3. O retorno do backend e aplicado por `procAplicarDadosEditor(data)`.
4. Se o retorno nao trouxer `materiais_vinculados`, o frontend chama `procRecarregarLinks()`.
5. `procAplicarDadosEditor` grava `procEditorSnapshot`, `procEditorSnapshotProcedimentoId`, `procMateriaisGenericoBaseId` e `procMateriaisGenericoVisualId`.
6. A grade final e renderizada por `procRenderLinks(...)`.

Conclusao:

- a lista inicial vem do backend `GET /procedimentos/{id}`;
- depois ela e reprocessada localmente quando necessario.

## 11. Fluxo atual ao associar Procedimento Generico
Ao associar ou alterar o `Procedimento Generico` no editor de Intervencoes / Procedimentos, o listener de `proc.cboGenerico` chama:

- `procAtualizarMateriaisEditorVisualizacao(procEditorSnapshot)`

Esse fluxo:

1. pega o snapshot do procedimento atual;
2. identifica o generico visual atual;
3. busca materiais do generico base e do generico atual;
4. recompõe a lista com `procComporMateriaisEditorPorGenerico(...)`;
5. renderiza o resultado com `procRenderLinks(...)`.

## 12. Fluxo atual ao trocar Procedimento Generico
Ao trocar o generico:

- o frontend nao usa a lista visual anterior como base;
- ele usa `procEditorSnapshot`;
- ele busca o generico selecionado via `GET /cadastros/procedimentos-genericos/detalhe/{id}`;
- ele recompoe a lista a partir do snapshot + generico atual.

Esse e o ponto onde a regra do contrato precisa ser respeitada com muita precisao.

## 13. Fluxo atual ao selecionar Generico sem materiais
O endpoint de detalhe do generico retorna `data.materiais`.

Se o generico nao tiver materiais:

- o retorno pode ser uma lista vazia valida;
- o cache `procMateriaisGenericoCache` armazena o resultado da consulta por id;
- `procComporMateriaisEditorPorGenerico(...)` recebe `[]` para a parte herdada.

Pela regra do contrato, lista vazia e resposta valida e deve limpar herdados antigos.

## 14. Origem da lista inicial
Origem confirmada:

- `GET /procedimentos/{id}`

O backend monta `materiais_vinculados` em memoria na resposta do detalhe do procedimento.

## 15. Origem dos materiais proprios
Os materiais proprios do procedimento sao lidos do backend a partir de `ProcedimentoMaterial` por meio de:

- `_listar_materiais_vinculados(db, procedimento_id)`

No frontend, eles entram no snapshot e sao renderizados como parte da lista final.

## 16. Origem dos materiais herdados
Os materiais herdados do generico sao lidos de:

- `GET /cadastros/procedimentos-genericos/detalhe/{id}`
- `_listar_materiais_vinculados_generico(db, clinica_id, procedimento_generico_id)`

O frontend cacheia apenas esse retorno em `procMateriaisGenericoCache`.

## 17. Origem da lista visual renderizada
A lista visual renderizada vem de:

- `procRenderLinks(info)`

`info` pode vir de:

- `procAplicarDadosEditor(data)` na abertura;
- `procRecarregarLinks()` depois de salvar/desvincular/vincular;
- `procAtualizarMateriaisEditorVisualizacao(snapshot)` ao trocar o generico.

## 18. Uso de snapshot
O frontend usa:

- `procEditorSnapshot`
- `procEditorSnapshotProcedimentoId`

Esses valores sao usados para reconstruir a lista atual e evitar reaproveitamento de outra Intervencao.

Observacao importante:

- o estado anterior e limpo ao abrir um procedimento;
- o snapshot de uma intervencao anterior nao deveria seguir vivo quando outra intervencao e aberta.

## 19. Uso de cache
O cache local relevante e:

- `procMateriaisGenericoCache`

Esse cache guarda apenas o retorno de `GET /cadastros/procedimentos-genericos/detalhe/{id}`.

Pelo codigo lido:

- nao ha evidencia de que ele receba material local de Intervencao;
- ele parece cachear somente materias do proprio generico;
- o risco principal nao e contaminacao por material local, e sim falta de marcador de origem.

## 20. Tratamento de lista vazia
O tratamento de lista vazia existe no fluxo de composicao:

- `procCarregarMateriaisGenericoDetalhe(id)` retorna `[]` se o generico nao possui materiais;
- `procComporMateriaisEditorPorGenerico(snapshot, genericoVisualId)` recebe a lista herdada vazia e recompõe com o snapshot;
- `procRenderLinks(info)` renderiza o que recebeu, inclusive lista vazia.

Conclusao:

- a lista vazia e considerada valida;
- o problema nao parece ser a existencia de um branch "mantem lista anterior" no ponto principal de composicao;
- a violacao surge da falta de origem confiavel para separar o que e proprio do que e herdado.

## 21. Como o codigo remove ou nao remove herdados antigos
O frontend tenta remover herdados antigos por comparacao estrutural:

- `procComporMateriaisEditorPorGenerico(...)` compara o item atual com os materiais do generico base usando `procMateriaisVinculadosIguais(...)`.

Se o item parecer igual ao material do generico base:

- ele e tratado como herdado e pode ser descartado da lista propria;

Se o item nao bater exatamente com o generico base:

- ele e tratado como proprio e e preservado.

Conclusao da auditoria:

- existe remocao heuristica;
- nao existe marcador de origem confiavel no item para garantir essa remocao com 100% de seguranca.

## 22. Como o codigo preserva proprios da Intervencao atual
O frontend preserva proprios da Intervencao atual por heuristica:

- itens que nao batem com os materiais do generico base sao mantidos;
- quando ha conflito por `material_id`, o proprio deveria prevalecer.

Problema:

- isso depende de comparacao de campos;
- se a origem nao estiver explicitamente marcada, a classificacao pode falhar.

## 23. Existe marcador confiavel de origem do material?
Nao foi encontrado marcador confiavel na resposta lida.

O que foi encontrado:

- `GET /procedimentos/{id}` retorna `materiais_vinculados` composto;
- os itens retornados por `_listar_materiais_vinculados` e `_listar_materiais_vinculados_generico` usam o mesmo formato principal;
- nao aparece um campo `origem` ou `herdado` na composicao retornada;
- no frontend, `procClonarItemVinculado(...)` adiciona `__origem`, mas esse marcador e local e temporario, nao vem do backend.

## 24. O frontend consegue distinguir proprio/herdado?
Consegue apenas por heuristica.

Base lida:

- `procComporMateriaisEditorPorGenerico(...)`
- `procMateriaisVinculadosIguais(a, b)`
- `procEditorSnapshot`
- `procMateriaisGenericoCache`

Essa heuristica tenta comparar o snapshot atual com o generico base, mas nao e o mesmo que ter origem explicitamente marcada no dado.

## 25. O backend devolve origem suficiente?
Nao.

Motivos observados:

- `detalhar_procedimento` devolve `materiais_vinculados` compostos;
- `_compor_materiais_vinculados_procedimento` junta diretos e herdados;
- os itens nao saem com `origem` ou `herdado` explicitamente declarados;
- o backend ainda materializa materiais do generico no procedimento em `_aplicar_heranca_procedimento_generico(...)`, o que reduz ainda mais a separacao entre proprio e herdado.

## 26. Onde a regra do contrato e violada
A violacao aparece em dois pontos principais:

### 26.1 Backend
Em `backend/routes/procedimentos_routes.py`, a composicao e a heranca sao feitas sem um marcador de origem robusto:

- `_aplicar_heranca_procedimento_generico(...)` materializa materiais do generico no proprio procedimento;
- `_compor_materiais_vinculados_procedimento(...)` devolve uma lista unificada sem origem confiavel.

### 26.2 Frontend
Em `frontend/app.js`, a recomposicao depende de comparacao heuristica:

- `procComporMateriaisEditorPorGenerico(...)`
- `procMateriaisVinculadosIguais(...)`

Isso obriga o frontend a adivinhar o que e herdado e o que e proprio.

## 27. Qual hipotese foi confirmada
Hipoteses confirmadas pela leitura:

- o backend nao expõe origem suficiente;
- o frontend usa snapshot + cache + comparacao heuristica;
- lista vazia e tratada como valida, mas a ausencia de origem confiavel permite que materiais antigos sejam mantidos como se fossem proprios;
- a preservacao de itens antigos ocorre porque o sistema nao separa de forma nativa proprio e herdado.

Hipoteses nao confirmadas como causa principal:

- contaminacao do `procMateriaisGenericoCache` com material local;
- reutilizacao do snapshot de outra Intervencao depois de abertura nova;
- uso direto da lista visual antiga como base principal.

## 28. Diagnostico provavel
O problema mais provavel e estrutural:

- o backend materializa materiais herdados dentro da lista do procedimento sem fornecer um marcador de origem;
- o frontend tenta reconstruir a verdade funcional por heuristica;
- quando o generico selecionado nao tem materiais, a lista herdada deveria ficar vazia, mas o sistema pode continuar exibindo itens porque eles ficaram indistinguiveis de materiais proprios ou porque foram reaproveitados da composicao anterior.

## 29. Local provavel da futura correcao
Local mais provavel:

- `backend/routes/procedimentos_routes.py`

Complemento provavel:

- `frontend/app.js`

## 30. Correcao futura recomendada, sem aplicar
Recomendacao conservadora futura:

1. separar formalmente materiais proprios e herdados no backend ou anexar marcador de origem confiavel;
2. fazer o frontend usar esse marcador em vez de comparar campos por heuristica;
3. impedir que a troca de generico mantenha herdados antigos quando o novo generico vier vazio;
4. manter os materiais proprios da intervencao atual;
5. nao fazer copia em massa para outras intervencoes.

## 31. Riscos de corrigir sem marcador de origem
- apagar material proprio pensando que e herdado;
- manter material herdado pensando que e proprio;
- esconder divergencia real de cadastro;
- quebrar a regra de deduplicacao por `material_id`;
- criar regressao em Intervencoes diferentes com o mesmo generico;
- reforcar um comportamento baseado em heuristica fraca.

## 32. Riscos de corrigir somente no frontend
- a tela pode parecer correta, mas o dado persistido continua sem origem confiavel;
- o frontend pode continuar dependendo de comparacao estrutural;
- qualquer divergencia no backend pode reaparecer como bug visual.

## 33. Riscos de corrigir somente no backend
- o frontend ainda pode interpretar mal a resposta se continuar usando heuristica;
- se nao houver ajuste no contrato da resposta, a recomposicao pode continuar fraca;
- a lista pode seguir sujeita a cache/snapshot local interpretado de forma ambigua.

## 34. Checklist obrigatorio depois de uma futura correcao
Depois de qualquer correcao futura neste fluxo, validar manualmente:

1. abrir Intervencao sem associacao anterior;
2. abrir Intervencao ja associada a um generico;
3. trocar de generico com materiais para generico vazio;
4. trocar de generico mantendo apenas proprios;
5. abrir outra Intervencao com o mesmo generico;
6. confirmar que material local da primeira nao aparece na segunda;
7. confirmar que generico vazio resulta em lista herdada vazia;
8. confirmar que duplo clique continua abrindo modal completo;
9. confirmar que duplicidade continua bloqueada;
10. confirmar que o modal de aviso continua proprio do sistema;
11. confirmar que o campo de quantidade continua coerente;
12. confirmar console sem erro.

## 35. Proxima etapa recomendada
Auditoria da origem da lista sem alterar codigo, focando em:

- como o backend entrega os materiais vinculados;
- se existe ou nao marcador de origem;
- em que ponto a composicao passa a depender de heuristica;
- onde o generico vazio deveria zerar a parte herdada;
- se o backend precisa separar proprio de herdado antes da frontend recomposicao.

