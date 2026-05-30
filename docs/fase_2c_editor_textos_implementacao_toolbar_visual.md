# Fase 2C - Implementacao da atualizacao visual da toolbar do Editor de Textos

## 1. Objetivo da implementacao

Extrair a atualizacao visual da toolbar do Editor de Textos para um helper/modulo passivo, reduzindo de forma real a concentracao de logica em `frontend/app.js`, sem alterar handlers de edicao, comandos, selecao/caret, model-first, reancoragem, TAB/Shift+Tab, salvamento, PDF, assinatura, anexos, impressao, permissões, backend ou banco.

## 2. Decisao de origem

- Decisao de origem: `F2C-TOOLBAR-A`

## 3. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2c_editor_textos_implementacao_toolbar_visual.md`
- `docs/11_roadmap_desenvolvimento.md`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 4. Arquivos copiados no backup

- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 5. Caminho da pasta de backup

- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/`

## 6. Trecho/funcoes extraidos ou delegados

Foram extraidos para o bootstrap do Editor de Textos os helpers de atualizacao visual da toolbar:

- `toolbarSetButtonAtivo`
- `toolbarAtualizarVisualComboCor`
- `toolbarSincronizarToolbarFormato`
- `toolbarAgendarSincronizarToolbar`

Esses helpers passaram a compor o namespace passivo `window.BranaEditorTextosToolbarModule`, exposto a partir de `frontend/js/modules/editor_textos_bootstrap.js`.

## 7. Como `frontend/app.js` foi reduzido

O `frontend/app.js` deixou de concentrar o corpo completo da sincronizacao visual da toolbar e passou a atuar como fachada defensiva:

- `editorTextosAtualizarVisualComboCor()` consulta o modulo passivo e delega a atualizacao visual.
- `editorTextosSetToolbarButtonAtivo()` consulta o modulo passivo e delega a ativacao visual do botao.
- `editorTextosSincronizarToolbarFormato()` consulta o modulo passivo e delega a sincronizacao visual completa.
- `editorTextosAgendarSincronizarToolbar()` consulta o modulo passivo e delega o agendamento visual.

O fluxo de toolbar continua funcional, mas o algoritmo visual principal foi deslocado para o bootstrap/module do Editor de Textos.

## 8. Modulo usado ou criado

Nao foi criado um arquivo novo `frontend/js/modules/editor_textos_toolbar.js` nesta etapa.

A logica extraida foi concentrada no modulo ja carregado pelo sistema:

- `frontend/js/modules/editor_textos_bootstrap.js`

O namespace novo exposto foi:

- `window.BranaEditorTextosToolbarModule`

## 9. Como a fachada/wrapper foi preservada

As funcoes publicas antigas continuaram existindo em `frontend/app.js` com o mesmo nome, preservando a superficie chamada por outras partes do sistema.

O wrapper usa recuperacao defensiva:

- primeiro tenta `window.BranaEditorTextosToolbarModule`
- depois tenta `window.BranaEditorTextosBootstrapModule.toolbar`
- somente na ausencia do modulo faz o fallback local minimo disponivel

## 10. Como o fallback foi preservado

O comportamento de fallback foi preservado de forma defensiva no proprio `app.js`, com:

- preservacao das assinaturas publicas antigas
- tentativa de consumo do modulo novo/exposto antes de qualquer execucao local
- manutencao do agendamento visual via `requestAnimationFrame`/`setTimeout` no wrapper, quando necessario

Como o bootstrap do Editor de Textos e carregado antes do `app.js`, o modulo visual deve estar disponivel em runtime normal.

## 11. O que nao foi alterado

Nao houve alteracao em:

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- `requestJson`
- payload
- salvamento
- PDF
- assinatura
- handlers de edicao
- selecao/caret
- model-first
- reancoragem
- TAB/Shift+Tab
- permissões
- textos/labels/mensagens/mojibake fora do escopo

## 12. Riscos assumidos

- A toolbar visual passou a depender do namespace passivo exposto pelo bootstrap do Editor de Textos.
- O wrapper em `app.js` ficou mais fino, e a leitura do estado visual agora ocorre via modulo.
- O recorte continua acoplado ao DOM do Editor de Textos existente.

## 13. Riscos evitados

- Nao mexer em comandos de edicao.
- Nao mexer em selecao/caret.
- Nao tocar em salvamento, payload, `requestJson`, PDF, assinatura ou backend.
- Nao abrir um novo arquivo de module sem necessidade.
- Nao alterar `frontend/index.html`.
- Nao alterar banco ou schema.

## 14. Plano de retorno manual

Se for necessario voltar atras, usar apenas o backup controlado desta etapa:

- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/js/modules/editor_textos_bootstrap.js`

Nao usar `git reset`, `git restore`, `git clean` ou `git revert`.

## 15. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js frontend/js/modules/editor_textos_bootstrap.js docs/fase_2c_editor_textos_implementacao_toolbar_visual.md docs/11_roadmap_desenvolvimento.md`
- `git status --short`

Resultado:

- os checks de sintaxe passaram;
- o diff ficou restrito ao recorte esperado;
- os demais arquivos untracked antigos permanecem fora do escopo.

## 16. Onde o usuario deve testar

1. Abrir o sistema normalmente.
2. Entrar no Editor de Textos.
3. Confirmar que o editor abre como antes.
4. Verificar visualmente a toolbar.
5. Clicar em botoes visuais basicos da toolbar apenas para observar se o estado visual continua como antes.
6. Confirmar que botoes continuam aparecendo habilitados/desabilitados como antes.
7. Confirmar que a area de edicao continua visivel.
8. Recarregar a tela e abrir novamente o Editor de Textos.
9. Nao focar em salvamento, PDF, assinatura ou anexos como objetivo principal desta etapa, mas observar se algo quebrou visualmente.

## 17. Commit seletivo obrigatorio

Arquivos alvo do commit seletivo desta etapa:

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2c_editor_textos_implementacao_toolbar_visual.md`
- `docs/11_roadmap_desenvolvimento.md`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 18. Registro para roadmap

Registrar no roadmap:

- implementacao da atualizacao visual da toolbar do Editor de Textos;
- origem em `F2C-TOOLBAR-A`;
- arquivos alterados;
- backup criado;
- confirmacao de reducao real de `frontend/app.js`;
- confirmacao de que nao houve alteracao de `frontend/index.html`, backend, banco, `requestJson`, payload, salvamento, PDF, assinatura, handlers de edicao ou permissões;
- proximo passo recomendado: teste manual pelo usuario antes de qualquer novo avanço.
