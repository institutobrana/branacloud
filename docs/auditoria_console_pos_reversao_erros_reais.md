# Auditoria do console pos reversao

## Situação encontrada

Depois da reversao controlada, o frontend monolitico voltou a abrir a maior parte dos modulos, mas o console mostrou tres erros locais que precisavam de correcao dirigida:

- `simbolosEspecialidadeNome is not defined`
- `unidadeAbrir is not defined`
- `auxAbrir is not defined`

Tambem foram observados:

- `GET /admin/users 403 Forbidden`
- `GET /anamnese/pacientes/303/respostas 500 Internal Server Error`

Os dois ultimos foram classificados, mas nao corrigidos nesta etapa.

## Arquivos lidos

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/simbolos-graficos.js`
- `frontend/js/modules/unidades.js`
- `frontend/js/modules/auxiliares.js`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`
- `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511\index.html`
- `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511\docs\frontend_auditoria_pos_fase_1_restauro_abertura_e_globais.md`

## Scripts carregados no `index.html`

O `frontend/index.html` atual carrega:

- `frontend/app.js?v=20260511-console-fix1`
- `frontend/easy_font_dialog.js?v=20260330-pref-amb-font3`
- `frontend/prestadores_override.js?v=20260407-prest-agenda-persist2`
- `frontend/prestadores_agenda_hotfix.js?v=20260329-prest-agenda-hotfix-restore7`
- `frontend/prestadores_agenda_apresentacao_patch.js?v=20260407-prest-agenda-apres-sync16`
- `frontend/prestadores_agenda_refino.js?v=20260329-prest-agenda-refino25`
- `frontend/prestadores_agenda_fonte_color_patch.js?v=20260328-prest-agenda-fonte-color4`
- `frontend/prestadores_agenda_utf_fix.js?v=20260328-prest-agenda-utf-fix2`

Nao ha carregamento ativo de:

- `frontend/js/modules/simbolos-graficos.js`
- `frontend/js/modules/unidades.js`
- qualquer outro `frontend/js/modules/*.js`

## Diagnostico

### 1. `simbolos-graficos.js`

Pela fonte atual, o `index.html` nao carrega `frontend/js/modules/simbolos-graficos.js`.

O erro observado no console indica uma destas situacoes:

- browser com cache antigo de HTML
- aba antiga ainda com o bundle anterior
- pagina carregada antes da reversao e nao recarregada por completo

Como medida de seguranca, o `frontend/app.js` passou a exportar:

- `window.simbolosEspecialidadeNome`
- `window.simbolosAbrir`

Isso cobre tanto o fallback do shell monolitico quanto um eventual resíduo de carga antiga.

### 2. `unidadeAbrir`

O `frontend/app.js` atual possui `function unidadeAbrir(){...}` e a funcao foi exposta em `window.unidadeAbrir`.

O erro de console foi tratado de forma conservadora com:

- exportacao global de `window.unidadeAbrir`
- exportacao global de `window.unidadeAbrirModal`
- atualizacao do cache-bust do `index.html`

### 3. `auxAbrir`

O `frontend/app.js` atual possui `async function auxAbrir(){...}` e a funcao foi exposta em `window.auxAbrir`.

O erro foi tratado de forma conservadora com:

- exportacao global de `window.auxAbrir`
- atualizacao do cache-bust do `index.html`

## `frontend/js/modules/` ficou inativo?

Sim.

O `frontend/index.html` nao reativou `frontend/js/modules/` como fonte ativa. A pasta continua existindo no disco e no backup historico, mas nao esta carregada pelo HTML atual.

## Correções aplicadas

1. `frontend/app.js`
   - exportadas as funcoes globais:
     - `window.unidadeAbrir`
     - `window.unidadeAbrirModal`
     - `window.auxAbrir`
     - `window.simbolosEspecialidadeNome`
     - `window.simbolosAbrir`

2. `frontend/index.html`
   - cache-bust do `app.js` atualizado para `v=20260511-console-fix1`
   - mantidos os helpers monoliticos de fonte e prestadores/agenda

## Erros classificados e nao corrigidos

- `GET /admin/users 403 Forbidden`
  - classificado como permissao/admin
  - nao corrigido nesta etapa

- `GET /anamnese/pacientes/303/respostas 500 Internal Server Error`
  - classificado como backend/dado/endpoint
  - nao corrigido nesta etapa

## Arquivos alterados

- `frontend/app.js`
- `frontend/index.html`
- `docs/auditoria_console_pos_reversao_erros_reais.md`

## Riscos remanescentes

- Se o navegador mantiver cache agressivo, ainda pode mostrar carga antiga por um tempo.
- A acentuacao e os textos de alguns fluxos continuam dependentes dos helpers monoliticos carregados em runtime.
- `admin/users` e `anamnese` seguem fora do escopo desta etapa e precisam de analise propria.

## Testes manuais recomendados

1. Fazer `Ctrl+F5`.
2. Abrir o sistema em uma nova aba.
3. Testar `Cadastro > Unidades de atendimento`.
4. Testar `Cadastro > Controle de estoque` e `Tabelas auxiliares`.
5. Testar `Configurações > Símbolos gráficos`.
6. Testar `Agenda > Agenda do dia` e `Agenda > Agenda da semana`.
7. Abrir o console e verificar se os tres `ReferenceError` sumiram.

