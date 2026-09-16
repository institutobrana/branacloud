# Inventario de remocao da toolbar legada - Brana Cloude

## 1. Objetivo

Registrar o que ainda sobra da toolbar antiga no frontend para que a remocao aconteca em etapas seguras, sem quebrar a shell, a autenticacao ou os atalhos existentes.

## 2. Situacao validada agora

- A nova toolbar primeira onda esta montada e renderiza 5 botoes.
- O navegador automatizado conseguiu montar a barra com sucesso.
- A validacao autenticada reutilizando o token encontrado no perfil local acabou bloqueada por expiracao de sessao.
- O bloqueio observado foi de sessao expirada, nao de falha de renderizacao da toolbar.

## 3. Residuos antigos identificados

### 3.1 HTML estatico da barra antiga

Arquivo:

- `frontend/index.html`

Trecho ainda presente:

- bloco `.toolbar-left` com os botoes antigos
- bloco `.toolbar-right` com usuario, licenca, painel ADM e sair

Itens legados dentro da toolbar esquerda:

- `btn-open-cenario`
- `btn-open-materiais`
- `btn-open-procedimentos`
- botao de `Conta corrente` com `data-modulo="Conta corrente"`
- `btn-open-dashboard`

### 3.2 CSS legado da barra

Arquivo:

- `frontend/index.html`

Seletores ainda presentes:

- `.toolbar-left`
- `.toolbar-right`
- `.toolbar-btn`
- `.toolbar-btn.exit`

Observacao:

- a nova primeira onda reaproveita parte dessas classes, entao a retirada precisa ser graduada para nao quebrar visual nem fallback.

### 3.3 Bindings diretos em `frontend/app.js`

Arquivo:

- `frontend/app.js`

Referencias ainda existentes:

- `document.getElementById("btn-open-cenario").addEventListener("click", abrirCenario)`
- `document.getElementById("btn-open-dashboard").addEventListener("click", dashAbrir)`
- `document.querySelectorAll("[data-modulo]").forEach(...)`

Dependencias indiretas importantes:

- `btn-open-materiais`
- `btn-open-procedimentos`
- `btn-open-users`
- `btn-sair`
- `user-email`
- `user-role`
- `user-license`

### 3.4 Riscos de remocao imediata

- remover a toolbar-left do HTML sem retirar o modulo novo quebra a home da shell;
- remover os binds do `app.js` sem confirmar os atalhos e modulos atuais pode deixar funcionalidades sem clique;
- remover classes CSS ainda usadas pela toolbar direita pode quebrar o logout e a identidade visual;
- remover o fallback antes de validacao autenticada real elimina caminho de reversao rapida.

## 4. Ordem segura de limpeza sugerida

1. Manter a toolbar nova como fonte de verdade visual.
2. Preservar a toolbar direita e seus ids ate a segunda onda ser fechada.
3. Separar os botoes da esquerda em um unico modulo de toolbar.
4. Remover apenas os binds que ficarem 100 por cento redundantes.
5. Conferir logout, painel ADM e atalhos de menu apos cada corte.
6. So entao apagar o HTML/CSS legado que nao tiver mais uso.

## 5. Pendencias para a proxima etapa

- Validar a shell em sessao autenticada real antes de cortar o fallback.
- Confirmar se algum atalho do menu depende indiretamente dos antigos botao/ids.
- Definir se a toolbar esquerda antiga sera mantida como fallback por uma onda extra ou removida de uma vez.

## 6. Conclusao

Este inventario nao remove nada. Ele apenas separa o que e legado, o que ainda e dependencia e o que pode ser eliminado com menor risco na proxima onda.
