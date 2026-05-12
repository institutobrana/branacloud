# Comparacao `app.js` legado vs Git/HEAD pos-reversao

## Situação encontrada

O frontend foi revertido para a base monolitica funcional do legado em `frontend/app.js`, mas essa base nao e a versao mais atual do projeto.

Comparacao estrutural:

- `frontend/app.js` atual restaurado e o `app.js` do legado tem o mesmo tamanho observado no sistema local: `1.792.977` caracteres.
- O `git show HEAD:frontend/app.js` e maior: `2.058.318` caracteres.
- O `git show HEAD:frontend/index.html` tambem e maior e carrega scripts auxiliares que o `index.html` restaurado nao carregava.

Conclusao:

- Sim, o `app.js` do Git/HEAD e mais atual que o legado usado na reversao.
- O menu principal nao perdeu rotas visiveis entre o legado restaurado e o HEAD.
- A diferenca funcional encontrada ficou nos helpers monoliticos carregados pelo `index.html`, nao em um novo menu do shell.

## Fontes comparadas

1. `frontend/app.js`
2. `frontend/index.html`
3. `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511/app.js`
4. `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511/index.html`
5. `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`
6. `git show HEAD:frontend/app.js`
7. `git show HEAD:frontend/index.html`

## Resultado do `git status --short`

O repositório esta com varios arquivos modificados e muitos arquivos de auditoria ainda nao rastreados.

Principais itens observados:

- modificados: `backend/routes/auth_routes.py`, `backend/routes/cadastros_routes.py`, `backend/routes/procedimentos_routes.py`, `backend/security/dependencies.py`, `backend/security/trial_middleware.py`, `frontend/app.js`, `frontend/index.html`
- nao rastreados: `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511/`, `frontend/js/`, e diversos `docs/` de auditoria

## Diferencas entre as fontes

### 1. Legado restaurado vs legado local

- O `frontend/app.js` atual restaurado e o `app.js` do legado local estao equivalentes em tamanho e data observada.
- Isso confirma que a reversao para o legado foi efetiva.

### 2. Git/HEAD vs legado restaurado

- O `HEAD` contem um `app.js` maior e mais novo.
- O `HEAD` tambem mantem carregamentos adicionais no `index.html` que o shell restaurado nao tinha.
- O conjunto de `data-menu-action` do menu permaneceu equivalente; nao apareceu um menu novo faltando no HTML restaurado.

### 3. Backup quebrado vs legado restaurado

- O backup quebrado e menor e representa o estado modularizado instavel.
- Ele foi mantido apenas como referencia historica.

## Modulos e funcoes relevantes no Git/HEAD que faltavam no shell restaurado

O que ficou comprovado como ausente do `index.html` restaurado foi o carregamento dos helpers monoliticos abaixo:

- `easy_font_dialog.js`
- `prestadores_override.js`
- `prestadores_agenda_hotfix.js`
- `prestadores_agenda_apresentacao_patch.js`
- `prestadores_agenda_refino.js`
- `prestadores_agenda_fonte_color_patch.js`
- `prestadores_agenda_utf_fix.js`

Esses scripts sao usados pelo shell atual para:

- dialogo de fontes e normalizacao de estilo
- ajuste de agenda/prestadores
- compatibilidade de apresentacao e codificacao

No `frontend/app.js` atual existem chamadas defensivas para:

- `window.easyFontAbrir`
- `window.easyFontNormalizeStyleId`

Sem o script `easy_font_dialog.js`, esses fluxos ficam degradados.

## Tabela resumida

| Nome do modulo/tela | data-menu-action | funcao esperada | Existe no app.js atual? | Existe no HEAD/Git? | Existe no backup quebrado? | Existe no legado? | Risco de restaurar | Recomendacao |
|---|---|---|---|---|---|---|---|---|
| Editor de textos / utilitarios de fonte | `ferr-editor-textos` | `window.easyFontAbrir` / `window.easyFontNormalizeStyleId` | Sim, com dependencia opcional | Sim | Sim | Sim | Baixo | Restaurar helper monolitico do HTML |
| Prestadores / Agenda compat | `cadastro-prestadores`, `agenda-dia`, `agenda-semana`, `agenda-proximo`, `agenda-contatos` | patches de prestadores/agenda | Parcial | Sim | Sim | Sim | Baixo | Restaurar os scripts monoliticos de compatibilidade |

## Correcao aplicada

Foi feita uma restauracao minima e segura no `frontend/index.html` para voltar a carregar os helpers monoliticos que o `HEAD` ja usava:

- `easy_font_dialog.js`
- `prestadores_override.js`
- `prestadores_agenda_hotfix.js`
- `prestadores_agenda_apresentacao_patch.js`
- `prestadores_agenda_refino.js`
- `prestadores_agenda_fonte_color_patch.js`
- `prestadores_agenda_utf_fix.js`

Nao houve reativacao de `frontend/js/modules/`.

## Arquivos alterados

- `frontend/index.html`
- `docs/comparacao_appjs_legado_vs_github_pos_reversao.md`

## Arquivos preservados

- `frontend/app.js` permaneceu restaurado na base monolitica do legado.
- `frontend/js/modules/` permaneceu inativo no `index.html`.
- O backup da modularizacao quebrada foi preservado.

## Riscos remanescentes

- Ainda ha muitos arquivos de auditoria e varios arquivos backend fora do escopo desta etapa.
- A restauracao dos helpers do `index.html` deve ser validada no navegador.
- Se algum fluxo de prestadores, agenda ou editor de textos continuar falhando, a causa agora tende a ser funcional local, nao a ausencia do helper basico.

## Testes manuais recomendados

1. Fazer `Ctrl+F5`.
2. Entrar no sistema.
3. Testar `Configuracoes > Preferencias`.
4. Testar `Configuracoes > Relatorios`.
5. Testar `Ferramentas > Editor de textos`.
6. Testar `Cadastro > Prestadores`.
7. Testar `Agenda > Agenda do dia` e `Agenda > Agenda da semana`.
8. Conferir o console do navegador em busca de `ReferenceError` ou `TypeError`.

