# Diagnostico pos-teste dos 403 em admin/usuarios

## Objetivo da verificação
Verificar, sem alterar codigo, se os `403 Forbidden` observados no console ao testar a conta ADM apos o commit `22e7652`:
- ja existiam antes;
- foram introduzidos pela extracao visual;
- dependem de estado de sessao/token/permissao ja existente;
- estao ligados a `/admin/users` e `/admin/users/{id}/permissions`;
- podem vir de chamadas repetidas do frontend;
- podem ser efeito da ponte em `frontend/app.js`, da ordem de carga em `frontend/index.html` ou do novo modulo visual;
- ou sao problema anterior/externo ao recorte visual.

## Data e etapa
- Data: `2026-05-20`
- Etapa: verificacao pos-teste detalhada, somente leitura

## Branch conferida
- `modularizacao-segura-fase-1`

## Commit analisado
- `22e7652` - `Extrai visual do modal admin de usuarios`

## Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -10`
- `git show --stat 22e7652`
- `git show --name-only 22e7652`
- `git diff 22e7652^ 22e7652 -- frontend/app.js frontend/index.html frontend/js/modules/users-admin-modal-visual.js`
- `git grep -n "admin/users"`
- `git grep -n "permissions"`
- `git grep -n "carregarUsuarios"`
- `git grep -n "usersPreencherModal"`
- `git grep -n "usersPopularModalCombos"`
- `git grep -n "usersOptions"`
- `git grep -n "requestJson"`
- `git grep -n "403"`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `Get-Content frontend/app.js` em trechos relevantes
- `Get-Content frontend/index.html` em trechos relevantes
- `Get-Content backend/routes/user_admin_routes.py` em trechos relevantes
- `Get-Content backend/security/dependencies.py` em trechos relevantes
- `Get-Content docs/auditoria_console_pos_reversao_erros_reais.md`

## Resumo do diff de `22e7652`
O commit fez apenas isto:
- removeu `usersOptions()` de `frontend/app.js`;
- removeu `usersPopularModalCombos()` de `frontend/app.js`;
- removeu `usersPreencherModal()` de `frontend/app.js`;
- inseriu tres wrappers finos em `frontend/app.js` para delegar ao namespace novo;
- adicionou `frontend/js/modules/users-admin-modal-visual.js` com o nucleo visual do modal;
- inseriu a carga do novo modulo em `frontend/index.html` antes de `app.js`;
- criou o documento de execucao da etapa.

Nao apareceu no diff qualquer alteracao em:
- `requestJson()`;
- auth / sessao / grant;
- backend;
- rotas;
- permissao;
- persistencia;
- senha;
- exclusao;
- `showUsersPanel()`;
- `carregarUsuarios()`;
- `usersEditarSelecionado()`;
- `usersSalvarPermissoes()`.

## Confirmacao sobre requestJson, auth, backend e permissões
- `requestJson()` nao foi alterado pelo commit.
- `auth / sessao / grant` nao foram alterados pelo commit.
- backend nao foi alterado pelo commit.
- permissões nao foram alteradas pelo commit.

## Confirmacao sobre `/admin/users` e `/admin/users/{id}/permissions`
- As chamadas a `/admin/users` e `/admin/users/{id}/permissions` ja existiam em `frontend/app.js` antes do commit.
- O commit nao acrescentou nenhuma nova chamada a esses endpoints.
- O novo modulo visual nao chama `requestJson()`.
- O wrapper novo em `frontend/app.js` apenas encaminha chamadas ja existentes.

## Analise especifica dos 403 vistos no console
### 1. O commit introduziu novas chamadas que possam gerar 403?
Nao. O novo modulo `frontend/js/modules/users-admin-modal-visual.js` contem apenas:
- montagem de `<option>`;
- popular combos do modal;
- preenchimento visual do modal.

Ele nao faz requisicoes de rede. Portanto, ele nao criou novo ponto de 403.

### 2. A ponte fina em `frontend/app.js` pode ter criado chamadas extras?
Nao ha evidencia disso.
As wrappers novas apenas delegam para o namespace `window.BranaUsersAdminModalVisualModule` e nao alteram frequencia, metodo, headers, payloads ou endpoints.

### 3. A ordem de carregamento em `frontend/index.html` parece correta?
Sim.
O novo modulo foi carregado antes de `app.js`, o que e consistente com o objetivo de expor as funcoes visuais antes do arquivo principal.

### 4. O cache-bust antigo de `app.js` pode confundir o teste?
Sim, pode confundir a leitura do navegador se a aba estiver cacheada.
O `index.html` ainda referencia `app.js?v=20260513-medicamentos-sub1`, entao um teste feito sem hard refresh pode continuar exibindo uma versao cacheada do `app.js`.
Isso pode confundir a verificacao de carga, mas nao explica por si so os `403` vistos no console.

### 5. Os `403` podem ser resposta normal do fluxo protegido?
Sim, isso e plausivel.
O `frontend/app.js` possui `requestJson()` com tratamento de `403` e desbloqueio protegido via grant quando o backend responde `protected_password_required`.
O backend tambem protege `admin/users` com:
- `require_module_access("usuarios")`
- `require_admin_password_if_user_control_enabled("usuarios")`

Ou seja, um `403` inicial pode aparecer como parte do handshake de protecao e depois ser tratado pelo frontend.

### 6. Os `403` podem vir de chamadas repetidas do frontend?
Sim.
`carregarUsuarios()` e chamado na abertura do painel e tambem por `usersStartRefresh()` a cada 3 segundos enquanto o painel esta aberto.
`usersAbrirPermissoes()` tambem faz chamada a `/admin/users/{id}/permissions`.
Isso explica repeticao dos endpoints no console sem exigir que a extracao visual tenha criado novo comportamento.

### 7. Os `403` estao ligados ao novo modulo visual?
Nao ha indicio concreto disso.
O modulo visual novo nao faz chamadas de rede e nao toca em permissao, grant ou sessao.

### 8. Os `403` estao ligados ao endpoint `/admin/users`?
Sim, os logs citados batem com esse endpoint.
Mas isso nao prova regressao da extracao visual, porque o endpoint ja era chamado antes e continua protegido pelo backend.

### 9. Os `403` estao ligados ao endpoint `/admin/users/{id}/permissions`?
Sim, os logs citados tambem batem com esse endpoint.
Mas, de novo, isso nao indica alteracao introduzida pelo recorte visual, porque o fluxo de permissoes ja existia.

## Evidencia documental anterior
Ha registro anterior no projeto sobre o mesmo tipo de evento:
- `docs/auditoria_console_pos_reversao_erros_reais.md`

Esse documento ja registrava `GET /admin/users 403 Forbidden` como observacao anterior e nao como algo criado por esta extracao visual.

## Conclusao sobre regressao
Conclusao: **nao ha indicio concreto de regressao da extracao visual**.

Classificacao pratica dos `403`:
- ja existiam antes: **provavel**
- parecem externos ou anteriores ao recorte: **sim**
- ha indicio concreto de regressao da extracao visual: **nao**
- ficou inconclusivo: **apenas no sentido de que o navegador pode estar exibindo 403 de handshake/protecao, e isso precisa ser confirmado no response body**

## Leitura conservadora do diagnostico
O mais provavel e que os `403` sejam:
- resposta do proprio esquema de protecao do modulo `usuarios`;
- ou reflexo de permissao/grant/sessao ja existente;
- ou resultado de refresh normal do painel e abertura do modal de permissoes;
- nao um efeito do novo modulo visual.

## Recomendacao conservadora do proximo passo
Antes de qualquer nova separacao, o proximo passo mais seguro e:
1. confirmar no Network se os `403` trazem `detail.error = protected_password_required`;
2. confirmar se depois do 403 ha retry bem-sucedido ou resposta final;
3. testar com hard refresh para eliminar confusao de cache;
4. comparar com uma conta ADM e uma conta Super Admin para ver se o comportamento depende de grant/protecao do modulo.

## Onde o usuario deve testar novamente
1. Abrir o sistema com hard refresh.
2. Abrir o painel de usuarios.
3. Abrir o modal de novo usuario.
4. Abrir o modal de permissões de um usuario.
5. Observar o Network para:
   - `GET /admin/users`
   - `GET /admin/users/{id}/permissions`
   - eventual retry com grant.
6. Conferir se o console mostra apenas o 403 inicial de protecao ou se existe falha final.

## Confirmacoes finais
- Nenhum codigo foi alterado nesta verificacao.
- `frontend/app.js` nao foi alterado nesta verificacao.
- `frontend/index.html` nao foi alterado nesta verificacao.
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado nesta verificacao.
- backend, banco, rotas, permissões e endpoints nao foram alterados nesta verificacao.
- A blindagem textual/mojibake foi respeitada: nao houve correcao de strings, labels, placeholders ou mensagens.
- Nada foi criado, editado, salvo, movido ou apagado nas pastas proibidas.
