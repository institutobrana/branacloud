# Materiais - Subetapa funcional minima de delegacao do helper `materiaisUniqueAuxDescricoes`

## 1. Titulo

Delegacao funcional minima do helper puro `materiaisUniqueAuxDescricoes(arr)` para `frontend/js/modules/materiais.js`.

## 2. Objetivo da subetapa

Consolidar o uso do helper puro existente no modulo de Materiais, fazendo `frontend/app.js` priorizar o helper exposto pelo namespace passivo quando ele estiver disponivel, sem alterar comportamento, textos, modal, calculo, request, backend ou o fluxo de vinculos.

## 3. Diretorio real

`D:\BRANA ARQUIVOS\BRANA CLOUD`

## 4. Escopo

- delegacao minima do helper puro `materiaisUniqueAuxDescricoes(arr)`;
- preservacao de fallback local em `frontend/app.js`;
- nenhuma alteracao no fluxo visual;
- nenhuma alteracao textual;
- nenhuma alteracao de backend;
- nenhuma alteracao em vinculos de materiais.

## 5. Fora de escopo

- extracao grande;
- mover fluxo de tela;
- mover renderizacao;
- mover modal;
- mover calculo;
- mover carregamento assíncrono;
- mover requestJson/apiFetch;
- mover binds/eventos;
- alterar Procedimentos Genericos;
- alterar Intervencoes / Procedimentos;
- alterar origem/herdado;
- alterar backend/services/vinculos_materiais.py;
- alterar banco, schema, migrations, CSS ou endpoints.

## 6. Documentos analisados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_2_fronteiras_contratos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`

## 7. Arquivos alterados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md`

## 8. Arquivos consultados somente em leitura

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

## 9. Helper consolidado/delegado

O helper consolidado foi:

- `materiaisUniqueAuxDescricoes(arr)`

O modulo `frontend/js/modules/materiais.js` ja expoe o helper no namespace passivo em:

- `window.BranaMateriaisModule.helpers.materiaisUniqueAuxDescricoes`

## 10. Por que esse helper e baixo risco

- recebe um array;
- retorna um array novo;
- nao altera o array original;
- nao acessa DOM;
- nao registra eventos;
- nao usa requestJson;
- nao usa fetch;
- nao salva nada;
- nao altera vinculos;
- nao toca em origem/herdado;
- nao mexe em modal nem calculo financeiro.

## 11. Como o `app.js` delega para `frontend/js/modules/materiais.js`

`frontend/app.js` agora:

1. verifica se `window.BranaMateriaisModule` existe;
2. verifica se `window.BranaMateriaisModule.helpers.materiaisUniqueAuxDescricoes` existe e e funcao;
3. tenta delegar para esse helper do modulo;
4. em caso de falha inesperada, executa a implementacao local de fallback;
5. preserva a mesma assinatura e o mesmo resultado esperado.

## 12. Como o fallback local foi preservado

Se o namespace nao existir, se o helper nao estiver disponivel ou se ocorrer excecao inesperada, `frontend/app.js` continua executando a logica local original:

- ignora entrada nao-array sem quebrar;
- ignora descricoes vazias;
- remove duplicidades por `toLowerCase()`;
- preserva a primeira ocorrencia;
- retorna novo array.

## 13. Confirmacao de que assinatura e comportamento foram preservados

Confirmado:

- assinatura continua `materiaisUniqueAuxDescricoes(arr)`;
- retorno continua sendo um array de descricoes unicas;
- comportamento para `null`, `undefined`, array vazio e repeticoes permanece conservador;
- nenhum contrato visivel foi alterado.

## 14. Confirmacao de que nao houve alteracao visual

Nao houve alteracao visual.

## 15. Confirmacao de que nao houve alteracao textual

Nao houve alteracao textual, de labels, mensagens, placeholders ou strings visiveis.

## 16. Confirmacao de que nao houve alteracao em modal

Nao houve alteracao em modal.

## 17. Confirmacao de que nao houve alteracao em calculo

Nao houve alteracao em calculo financeiro, preco, relacao ou custo.

## 18. Confirmacao de que nao houve alteracao em request/backend

Nao houve alteracao de request, backend, endpoints ou payloads.

## 19. Confirmacao de que nao houve alteracao em vinculos

Nao houve alteracao em vinculos de materiais.

## 20. Confirmacao de que origem/herdado nao foram alterados

Origem/herdado nao foram alterados nesta subetapa.

## 21. Riscos preservados

- o restante do fluxo de Materiais continua no monolito;
- `requestJson`, modal, renderizacao, filtros e calculos continuam no `app.js`;
- Procedimentos Genericos e Intervencoes / Procedimentos continuam fora desta extracao;
- o fallback local foi mantido para nao quebrar ambientes onde o namespace nao esteja disponivel;
- a blindagem textual/mojibake continua apenas documentada, sem correcao.

## 22. Checks executados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `python -m py_compile D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`

Resultado:

- os checks de sintaxe passaram.

## 23. Onde testar no navegador

### Teste de Materiais

1. Fazer `Ctrl+F5`.
2. Abrir Materiais.
3. Confirmar que a tela abre normalmente.
4. Abrir o modal de novo/alterar material.
5. Confirmar que os combos/listas auxiliares carregam normalmente.
6. Confirmar que nao houve erro no console.
7. Fechar sem salvar, se quiser evitar gravacao.

### Teste de vinculos

1. Abrir Procedimentos Genericos.
2. Abrir um Genérico com materiais.
3. Confirmar que a lista aparece normalmente.
4. Abrir um Genérico sem materiais.
5. Confirmar que nao aparecem materiais indevidos.
6. Abrir Intervencoes / Procedimentos.
7. Abrir intervencao associada a Genérico A.
8. Trocar para Genérico B com materiais diferentes.
9. Confirmar que herdados de A saem e herdados de B entram.
10. Trocar para Genérico sem materiais.
11. Confirmar que herdados antigos saem e lista herdada fica vazia.
12. Confirmar que materiais proprios da intervencao permanecem.
13. Confirmar que nao ha contaminacao entre intervencoes.
14. Dar duplo clique em material vinculado.
15. Confirmar que modal completo continua abrindo.
16. Conferir console sem erro novo.

## 24. Proxima etapa recomendada

Se esta delegacao se mantiver estavel nos testes manuais, a proxima etapa deve continuar pequena e conservadora, sempre com checklist completo, antes de qualquer nova extracao de helper ou deslocamento de responsabilidade.

