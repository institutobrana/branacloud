# Correcao controlada do refresh/protected grant em usuarios

## 1. Objetivo da correcao
Estabilizar o refresh do painel de usuarios quando o modulo `usuarios` esta protegido, evitando chamadas concorrentes e reduzindo o ruido repetido de `403 protected_password_required`, sem mexer em perfis de acesso, seed, banco, backend ou layout.

## 2. Branch conferida
- `modularizacao-segura-fase-1`

## 3. Estado inicial do git
- Havia varios arquivos `untracked` antigos ja existentes no workspace.
- Nesta etapa foi adicionada uma alteracao em `frontend/app.js` e este documento novo.
- Nenhum outro arquivo de codigo foi alterado.

## 4. Arquivos alterados
- `frontend/app.js`
- `docs/users_admin_correcao_refresh_protected_grant.md`

## 5. Funcoes alteradas
- `carregarUsuarios()`
- `usersStartRefresh()`
- `usersStopRefresh()` nao precisou mudar
- `requestJson()`, `requestJsonBase()`, `ensureProtectedGrant()` e `unlockProtectedGrant()` nao foram alteradas

## 6. Problema anterior
- `usersStartRefresh()` mantinha `setInterval(..., 3000)`.
- Cada ciclo podia disparar `carregarUsuarios(true)` mesmo quando uma requisicao anterior ainda estava em andamento.
- Quando o modulo `usuarios` nao tinha grant reaproveitado de forma direta, o carregamento podia entrar no fluxo normal de `requestJson()`, o que gerava primeiro `403 protected_password_required` e depois retry com grant.
- Isso criava alternancia ruidosa de `403` e `200` no console/Network.

## 7. Solucao aplicada
- Foi adicionada uma trava minima de reentrada em `carregarUsuarios()` com duas flags:
  - `usersCarregarEmAndamento`
  - `usersCarregarPendente`
- Quando ja existe grant salvo no cache, `carregarUsuarios()` passa a reutiliza-lo diretamente via `requestJsonBase()` com o header de grant protegido, evitando o 403 inicial repetido em cada refresh.
- Se o grant direto voltar a falhar com `protected_password_required`, o fluxo cai novamente para `requestJson()`, preservando o prompt e o retry automatico existentes.
- Se uma chamada de carga ja estiver em andamento, uma nova tentativa nao entra em paralelo; ela fica marcada como pendente e roda uma unica vez depois que a requisicao atual termina.

## 8. O que nao foi alterado
- Perfis de acesso
- Seed de perfis
- Banco de dados
- Backend
- Rotas
- Endpoints
- `frontend/index.html`
- `frontend/js/modules/users-admin-modal-visual.js`
- `requestJson()` e `requestJsonBase()`
- auth / sessao / grant
- permissões
- senha
- exclusao
- layout
- textos visiveis
- mojibake

## 9. Confirmacao sobre arquivos nao tocados
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado nesta correcao.
- `frontend/index.html` nao foi alterado nesta correcao.

## 10. Confirmacao textual/mojibake
- Nenhum texto, label, placeholder, mensagem visivel ou string de interface foi corrigido nesta etapa.
- A blindagem textual/mojibake foi respeitada.

## 11. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 12. Onde testar no sistema
1. Fazer hard refresh no navegador.
2. Abrir o painel de usuarios.
3. Confirmar que o prompt de senha protegida continua abrindo quando necessario.
4. Conferir no Network:
   - a primeira chamada pode retornar `403 protected_password_required`;
   - o retry com grant continua funcionando;
   - as chamadas seguintes nao devem ficar alternando `403` e `200` como ping desnecessario.
5. Deixar o painel aberto por pelo menos 15 segundos e observar o console.
6. Abrir novo usuario.
7. Abrir edicao de usuario.
8. Abrir permissões de usuario.
9. Confirmar que `Perfis de acesso` continua como estava, sem tentativa de correcao nesta etapa.
10. Confirmar que salvar, senha, permissões e exclusao nao foram alterados.

## 13. Riscos residuais
- Se o grant protegido expirar ou for invalidado, o fluxo pode voltar ao caminho de prompt/retry, o que e esperado.
- Se houver outra rotina externa chamando `carregarUsuarios()` em paralelo, a trava de reentrada evita duplicacao, mas ainda pode haver uma chamada pendente aguardando finalizacao.
- Esta correcao nao trata perfis de acesso nem seed da clinica 1.

## 14. Proximo passo recomendado
- Testar o fluxo protegido no navegador e confirmar que o ruido de refresh desapareceu.
- Se o comportamento estiver estavel, seguir depois para a frente separada de perfis/seed da clinica 1, sem misturar as duas correcções.
## Teste pos-correcao 1 e ajuste 2
- O teste do usuario mostrou que o ping `403/200` continuou mesmo sem interacao na tela, apenas com o painel aberto.
- Isso mostrou que a primeira correcao foi insuficiente porque o refresh silencioso ainda conseguia entrar no caminho protegido e repetir o ciclo de carregamento.
- A nova estrategia aplicada foi pausar o refresh silencioso quando a protecao reaparece, evitando nova insistencia automatica em `403` e reduzindo o ping no console/network.
- Funcoes alteradas no ajuste 2:
  - `carregarUsuarios()`
  - `usersStartRefresh()`
- O escopo continuou limitado ao fluxo de usuarios/protected grant.
- Riscos residuais:
  - se o grant protegido expirar, o refresh pode permanecer pausado ate uma acao manual;
  - o carregamento manual continua podendo abrir o prompt e retomar o fluxo;
  - esta etapa continua sem tocar em perfis, seed, banco, backend, rotas ou layout.
- Testar novamente:
  1. Fazer hard refresh no navegador.
  2. Abrir o painel de usuarios.
  3. Confirmar no Network se o `403/200` parou de se repetir enquanto a tela fica parada.
  4. Deixar o painel aberto por pelo menos 15 segundos.
  5. Abrir novo usuario, editar usuario e permissões para confirmar que o fluxo manual continua funcionando.
