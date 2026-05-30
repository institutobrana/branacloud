# Fase 2C - Implementacao bootstrap/shell visual do Editor de Textos

## 1. Objetivo da implementacao

- Executar a primeira reducao real da Fase 2C no `Editor de Textos`.
- Separar o bootstrap/shell visual inicial de `frontend/app.js` para o modulo passivo `frontend/js/modules/editor_textos_bootstrap.js`.
- Reduzir o monolito de forma real, mas sem tocar em salvamento, payload, PDF, assinatura, anexos, permissões, banco ou backend.

## 2. Decisao de origem

- Decisao de origem: `F2C-MATRIZ-D`.

## 3. Motivo da escolha do Editor de Textos

- O `Editor de Textos` e o maior bloco concentrado em `frontend/app.js`.
- Ja existia a base passiva `frontend/js/modules/editor_textos_bootstrap.js`.
- O recorte permitiu tirar de `app.js` a preparacao visual/bootstrap de estado, mantendo a fachada publica.

## 4. Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2c_editor_textos_implementacao_bootstrap_shell_visual.md`
- `docs/11_roadmap_desenvolvimento.md`

## 5. Arquivos copiados no backup

- `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 6. Caminho da pasta de backup

- `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/`

## 7. Trecho/função extraido ou delegado

- A fachada `editorTextosEnsureUI()` em `frontend/app.js` foi enxugada para apenas:
  - localizar o modulo passivo;
  - chamar `bootstrapModule.ensureUI(...)`;
  - passar as dependencias visuais e constantes de bootstrap.
- O modulo `frontend/js/modules/editor_textos_bootstrap.js` passou a assumir:
  - inicializacao do estado base do Editor de Textos;
  - criacao do `documentModel` inicial quando a factory e fornecida;
  - populacao do combo inicial do modal de abertura;
  - aplicacao do bootstrap visual dos modais com `ensureChromeDraggable`, quando disponivel.

## 8. Como frontend/app.js foi reduzido

- `editorTextosEnsureUI()` deixou de carregar o bloco grande de `Object.assign(...)` com o estado inicial do editor.
- A preparacao dos defaults visuais e estruturais passou para o modulo passivo.
- A fachada em `app.js` ficou menor e mais declarativa, reduzindo a concentracao de bootstrap local.

## 9. Como a fachada/wrapper foi preservada

- A funcao publica antiga `editorTextosEnsureUI()` continua existindo em `frontend/app.js`.
- O contrato de chamada permaneceu conhecido pelo restante do sistema.
- `app.js` continua sendo a fachada/orquestrador da abertura do Editor de Textos.

## 10. Como o fallback foi preservado

- O comportamento defensivo foi mantido: `app.js` ainda valida a existencia do modulo passivo antes de usar o bootstrap.
- Nao existia um fallback local real para duplicar sem aumentar o risco do recorte, entao a implementacao preservou o caminho defensivo existente.

## 11. Confirmacao do que nao foi alterado

- Nao houve alteracao em `frontend/index.html`.
- Nao houve alteracao em backend.
- Nao houve alteracao em banco, schema, migrations, seeds ou endpoints.
- Nao houve alteracao em `requestJson`.
- Nao houve alteracao em payload, salvamento, PDF, assinatura, anexos, impressao, permissões, autenticação/sessão, editor de conteudo rico, regras de TAB/Shift+Tab, reancoragem multi-node, model-first ou comportamento clinico/odontologico.
- Nao houve correcoes textuais, de labels, strings, mensagens ou mojibake fora do escopo tecnico.

## 12. Riscos assumidos

- O bootstrap base do editor passou a depender mais do modulo passivo.
- A inicializacao visual ficou mais concentrada no helper do bootstrap.
- O recorte ainda encosta em um modulo muito grande e deve ser validado manualmente.

## 13. Riscos evitados

- Nao mexer em salvamento, PDF, assinatura, anexos ou banco.
- Nao tocar em `frontend/index.html`.
- Nao reescrever o modelo de documento.
- Nao alterar contratos publicos sensiveis do editor.
- Nao fazer movimentacao cosmetica sem reducao real.

## 14. Plano de retorno manual

- Usar a copia de seguranca em `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/`.
- Comparar os arquivos alterados com a copia de backup.
- Reverter manualmente o conteudo com edicao controlada, sem `git reset`, `git restore`, `git clean` ou `git revert`.
- Se necessario, reabrir a matriz antes de qualquer novo recorte.

## 15. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js frontend/js/modules/editor_textos_bootstrap.js docs/fase_2c_editor_textos_implementacao_bootstrap_shell_visual.md docs/11_roadmap_desenvolvimento.md`
- `git status --short`

## 16. Onde o usuario deve testar

- Abrir o sistema normalmente.
- Entrar no Editor de Textos.
- Confirmar que o editor abre como antes.
- Confirmar que o shell visual/area principal aparece como antes.
- Abrir um modelo/documento existente, se o fluxo continuar disponivel.
- Criar/abrir uma tela nova do editor, se aplicavel.
- Verificar visualmente toolbar, area de edicao, painel lateral/shell e botoes principais.
- Recarregar a tela e abrir novamente o Editor de Textos.

## 17. Commit seletivo obrigatorio

- Arquivos efetivamente alterados/criados para o commit:
  - `frontend/app.js`
  - `frontend/js/modules/editor_textos_bootstrap.js`
  - `docs/fase_2c_editor_textos_implementacao_bootstrap_shell_visual.md`
  - `docs/11_roadmap_desenvolvimento.md`
  - `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/frontend/app.js`
  - `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 18. Registro para roadmap

- Primeira implementacao real da Fase 2C executada no `Editor de Textos`.
- Origem: `F2C-MATRIZ-D`.
- Fluxo implementado: bootstrap/shell visual inicial.
- `frontend/app.js` foi reduzido de forma real e passou a atuar como fachada fina.
- `frontend/js/modules/editor_textos_bootstrap.js` passou a concentrar a inicializacao visual/base do editor.
- Backup controlado foi criado antes da alteracao.
- Nenhum backend, banco, `frontend/index.html`, `requestJson`, payload, salvamento, PDF, assinatura ou permissao foi alterado.
- A próxima etapa recomendada e o teste manual do usuario antes de qualquer novo avanco.
