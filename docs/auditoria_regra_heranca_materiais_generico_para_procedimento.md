# Auditoria tecnica: regra de heranca de materiais do Procedimento Generico para Procedimento/Intervencao

Data da auditoria: 2026-05-16

## 1. Objetivo da auditoria
Auditar, sem alterar codigo, o fluxo de heranca de materiais entre Procedimentos Genericos e Procedimentos/Intervencoes, localizando onde a regra esta sendo atendida, onde esta falhando e qual seria o ponto conservador de correcao futura.

## 2. Confirmacao de inalteracao
Nenhum codigo funcional foi alterado nesta etapa.

Nao houve alteracao de:

- frontend/app.js
- frontend/index.html
- frontend/js/modules
- backend
- banco
- endpoints

## 3. Documentos analisados
Documentos explicitamente analisados e/ou consultados:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/materiais_subetapa_0_mapeamento_monolitico.md`
- `docs/materiais_subetapa_2_fronteiras_contratos.md`
- `docs/materiais_subetapa_6_consolidacao_pos_integracao.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/11_roadmap_desenvolvimento.md`

## 4. Documentos relacionados encontrados
Documentos relacionados que apareceram na busca e ajudaram a reconstruir o fluxo:

- `docs/05_banco_dados.md`
- `docs/01_visao_produto.md`
- `docs/04_funcionalidades.md`
- `docs/03_mapa_codigo.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/materiais_subetapa_0_mapeamento_monolitico.md`
- `docs/materiais_subetapa_2_fronteiras_contratos.md`
- `docs/materiais_subetapa_6_consolidacao_pos_integracao.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md`

## 5. Documentos esperados que nao foram encontrados
Documento esperado nao encontrado:

- `docs/planejamento_relatorio_tabela_intervencoes.md`

## 6. Arquivos frontend analisados
Arquivos frontend lidos em modo leitura:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend/js/modules/materiais.js`

## 7. Arquivos backend analisados
Arquivos backend lidos em modo leitura:

- `backend/routes/procedimentos_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_generico.py`
- `backend/seeds/procedimentos_genericos.py` para o rastro historico `0082`

## 8. Fluxo funcional esperado
O fluxo funcional esperado e:

1. O Procedimento Generico possui materiais vinculados.
2. A combo `Procedimento Generico` e carregada na tela de insere/altera intervencao.
3. Ao selecionar o generico, a intervencao deve exibir os materiais herdados.
4. O usuario pode adicionar materiais extras no procedimento.
5. O generico original nao deve ser alterado.
6. O retorno final do detalhe do procedimento deve representar a composicao completa, com deduplicacao e preferencia do material proprio.

## 9. Fluxo atual observado no codigo
O fluxo atual observado e diferente do esperado:

- o frontend carrega a combo de genericos em `procCarregarCombosEditor()`;
- o frontend preenche `proc.cboGenerico` com dados de `/cadastros/procedimentos-genericos?q=`;
- `procAplicarDadosEditor()` apenas seta o valor da combo e renderiza `materiais_vinculados` quando o backend o devolve;
- nao foi encontrado listener de `change` no `proc.cboGenerico` para recompor materiais ao selecionar o generico;
- `procSalvar()` envia apenas `procedimento_generico_id` e o restante do payload de procedimento;
- a recarga de materiais apos abrir/salvar depende novamente de `GET /procedimentos/{id}`.

## 10. Onde o Procedimento Generico grava seus materiais vinculados
O Procedimento Generico grava seus materiais vinculados em:

- model `ProcedimentoGenerico.materiais_vinculados` em `backend/models/procedimento_generico.py`;
- rotina `_sync_procedimento_generico_materiais()` em `backend/routes/cadastros_routes.py`;
- tabela/entidade `procedimento_generico_material`.

Essa rotina apaga os vinculos antigos do generico e recria os novos a partir do payload de materiais do generico.

## 11. Onde o Procedimento/Intervencao le seus materiais vinculados
O Procedimento/Intervencao le seus materiais vinculados em:

- model `Procedimento.materiais_vinculados` em `backend/models/procedimento.py`;
- funcao `_listar_materiais_vinculados()` em `backend/routes/procedimentos_routes.py`;
- funcao `_procedimento_com_vinculos()` em `backend/routes/procedimentos_routes.py`;
- endpoint `GET /procedimentos/{id}`.

Esse caminho atualmente le apenas os vinculos diretos do procedimento em `procedimento_material`.

## 12. Onde a combo Procedimento Generico e carregada na tela Insere/Altera Intervencao
A combo e carregada em `frontend/app.js` dentro de `procCarregarCombosEditor()`, usando:

- `GET /cadastros/procedimentos-genericos?q=`

Ela e preenchida em `proc.cboGenerico` antes do editor ser exibido.

## 13. O que acontece no frontend quando o usuario seleciona um Procedimento Generico nessa combo
Pelo codigo analisado, o frontend nao executa nenhuma composicao automatica imediata ao mudar a combo.

O que acontece e:

- a combo guarda o `procedimento_generico_id`;
- o valor e enviado no `POST` ou `PUT` quando o usuario grava;
- os materiais exibidos dependem do que veio no `GET /procedimentos/{id}` ou da recarga posterior;
- nao foi encontrado codigo de heranca em tempo real no `change` da combo.

## 14. Se o frontend espera que os materiais herdados venham do backend
Sim.

O frontend espera que o backend retorne `materiais_vinculados` pronto para renderizacao em:

- `procAplicarDadosEditor(data)`
- `procRecarregarLinks()`

Se `materiais_vinculados` nao vier no retorno, o frontend volta a chamar `GET /procedimentos/{id}` para tentar recarregar.

## 15. Se o backend compoe materiais proprios + materiais herdados
Nao no caminho de leitura atual.

O endpoint `GET /procedimentos/{id}` chama `_procedimento_com_vinculos()`, e esta funcao monta `materiais_vinculados` apenas com `_listar_materiais_vinculados(db, proc.id)`, ou seja, somente os materiais diretos do procedimento.

## 16. Se existe deduplicacao por `material_id`
Nao foi encontrada deduplicacao do tipo "materiais proprios + materiais herdados" no retorno de leitura.

No fluxo atual:

- a leitura nao compoe as duas origens;
- a composicao historica esperada nao aparece no endpoint;
- no save, quando o generico muda, a rotina apaga os vinculos diretos e recria os materiais do generico, o que evita duplicidade por substituicao, mas nao implementa a fusao de origens com preferencia do item proprio.

## 17. Se ha preferencia pelo material proprio do procedimento quando existe conflito
Nao foi encontrada preferencia explicita de material proprio no caminho de leitura.

O comportamento atual no save quando o generico muda e mais agressivo:

- apaga vinculos diretos do procedimento;
- recria os materiais do generico;
- nao faz merge com preferencia do material proprio.

## 18. Se GET /procedimentos/{id} retorna `materiais_vinculados` ja compostos
Nao.

O endpoint retorna `materiais_vinculados` apenas com os registros diretos do procedimento. Nao foi encontrada composicao com materiais herdados do generico associado.

## 19. Se POST/PUT de procedimento preserva materiais proprios e herdados
Parcialmente.

Observado:

- se o generico nao muda, os materiais diretos do procedimento sao preservados;
- se o generico muda, a rotina pode substituir os vinculos diretos pelos materiais do generico;
- nao existe preservacao separada de "proprios" e "herdados" como duas fontes distintas.

## 20. Se POST/PUT esta apagando, sobrescrevendo ou ignorando materiais herdados
No estado atual, o backend tende a:

- ignorar a composicao de materiais herdados como fonte separada na leitura;
- sobrescrever os vinculos diretos quando o generico muda;
- nao aplicar merge conservador com deduplicacao por `material_id`.

## 21. Se a regra antiga parece ter sido perdida por reversao, refatoracao ou modularizacao
Pelo formato atual do codigo, a regra antiga parece ter sido perdida ou parcialmente descaracterizada em uma separacao de responsabilidades:

- a leitura deixou de compor a heranca;
- o save passou a materializar ou substituir os vinculos do generico;
- o frontend ficou dependente do retorno do backend, mas sem recomposicao propria.

Isso e compativel com perda por refatoracao/modularizacao, ou com uma mudanca que deslocou a heranca do read path para o write path.

## 22. Local provavel da quebra
Local provavel da quebra:

- backend, principalmente no endpoint `GET /procedimentos/{id}`;
- frontend como segundo ponto, por nao recompor a heranca ao selecionar o generico;
- portanto, o mais provavel e que a quebra seja em ambos, com predominancia no backend.

## 23. Diagnostico provavel
Diagnostico provavel:

- a heranca de materiais nao esta sendo montada como lista composta na leitura do procedimento;
- o frontend depende dessa lista composta;
- ao salvar, o backend ora preserva os vinculos diretos, ora substitui-os quando o generico muda, mas nao faz merge com preferencia do item proprio.

## 24. Solucao anterior encontrada ou reconstruida
Nao foi encontrada uma implementacao atual de merge por leitura.

A solucao reconstruida pelo historico e pela regra esperada seria:

- buscar materiais proprios do procedimento;
- buscar materiais do Procedimento Generico associado;
- compor `materiais_vinculados` em memoria;
- deduplicar por `material_id`;
- manter preferencia pelo material proprio do procedimento;
- nao alterar o Procedimento Generico original.

## 25. Proposta conservadora de correcao futura, sem implementar
Proposta conservadora futura:

1. Criar uma composicao explicita em backend para `GET /procedimentos/{id}`.
2. Manter a origem direta do procedimento separada da origem herdada do generico.
3. Deduplicar por `material_id`.
4. Preservar o item proprio quando houver conflito.
5. Deixar o frontend apenas consumir a lista composta.
6. Evitar mudar o payload de salvamento neste primeiro ajuste, a nao ser que a analise de regressao exija.

## 26. Riscos de corrigir
Riscos a tratar com cuidado:

- custo incorreto;
- duplicidade indevida;
- perda de materiais extras adicionados localmente;
- contaminacao do Procedimento Generico;
- regressao em Procedimentos;
- regressao em Procedimentos Genericos;
- divergencia visual entre tela e relatorio de intervencoes.

## 27. Checks executados
Checks seguros executados nesta auditoria:

- `node --check D:\\BRANA ARQUIVOS\\BRANA CLOUD\\frontend\\app.js`
- `node --check D:\\BRANA ARQUIVOS\\BRANA CLOUD\\frontend\\js\\modules\\materiais.js`
- `node --check D:\\BRANA ARQUIVOS\\BRANA CLOUD\\frontend\\js\\modules\\procedimentos-genericos.js`
- `python -m py_compile D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend\\routes\\procedimentos_routes.py`
- `python -m py_compile D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend\\routes\\cadastros_routes.py`
- `python -m py_compile D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend\\models\\procedimento.py`
- `python -m py_compile D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend\\models\\procedimento_generico.py`

Resultado: todos os checks passaram.

## 28. Onde testar depois da futura correcao
Depois de uma futura correcao, testar:

1. Criar ou localizar um Procedimento Generico com materiais vinculados.
2. Abrir Procedimentos / Intervencoes.
3. Inserir ou alterar uma intervencao.
4. Selecionar o Procedimento Generico na combo.
5. Confirmar que os materiais herdados aparecem.
6. Adicionar material extra no Procedimento/Intervencao.
7. Confirmar que o material extra aparece somente no Procedimento/Intervencao.
8. Reabrir o Procedimento Generico e confirmar que ele nao recebeu o material extra.
9. Reabrir o Procedimento/Intervencao e confirmar composicao final correta.
10. Confirmar ausencia de duplicidade indevida.
11. Confirmar custo correto.
12. Confirmar console sem erro.
13. Confirmar que Materiais continua normal.
14. Confirmar que Procedimentos Genericos continua normal.

## 29. Conclusao objetiva
A auditoria aponta que a regra historica de heranca nao esta sendo entregue como composicao no read path. O ponto mais provavel de correcao futura e o backend, com o frontend funcionando apenas como consumidor da lista composta.
