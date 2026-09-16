# Validação runtime - renovação de sessão no frontend React

## 1. Ambiente usado

- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- Backend local: `http://127.0.0.1:8000`
- Frontend React local: `http://127.0.0.1:5173`
- Banco local: PostgreSQL em `localhost:5432`
- Navegador de validação: Chromium via Playwright, em modo headless
- Conta local de teste usada: `institutobrana@gmail.com`

## 2. Documentos lidos

- `docs/auditoria_sessao_autenticacao_renovacao_frontend_react.md`
- `docs/contrato_implementacao_renovacao_sessao_frontend_react.md`
- `docs/frontend_react_contrato_autenticacao.md`
- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/06_seguranca.md`
- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/10_continuidade.md`

## 3. Comandos executados

- `git status --short --branch`
- `git remote -v`
- `git log --oneline -5`
- `Get-Content backend\.env`
- `npm run build` em `frontend-react`
- `node --test frontend-react/tests/*.test.js`
- `Invoke-WebRequest http://127.0.0.1:5173/login`
- scripts Playwright para login, renovacao, falhas, logout e reload
- `git diff --check`

## 4. Estado inicial

- A tela `/login` abriu normalmente no frontend React.
- Antes do login, `brana_token` estava ausente no `localStorage`.
- Antes do login, não houve chamada a `POST /api/auth/renew`.
- Antes do login, não havia timer operacional de renovação visível na rede.

## 5. Método temporário para reduzir o intervalo

- Foi reduzido temporariamente o controlador em `frontend-react/src/features/auth/authRenewalController.js`.
- Intervalo de produção foi trocado para `2 * 1000` ms durante a validação.
- Delays de retry foram reduzidos para `3 * 1000` e `6 * 1000` ms.
- Essa alteração foi usada apenas para observar os ciclos no runtime e foi revertida antes do fechamento.

## 6. Restauração para 15 minutos

- O arquivo do controlador foi restaurado para:
  - `AUTH_RENEW_INTERVAL_MS = 15 * 60 * 1000`
  - `AUTH_RENEW_RETRY_DELAYS_MS = [30 * 1000, 60 * 1000]`
- A restauração foi conferida no diff final antes do encerramento.

## 7. Login

- Login realizado com sucesso no frontend React.
- `POST /api/login` respondeu `200`.
- `GET /api/me` respondeu `200`.
- A sessão entrou na área protegida em `/app`.
- O token foi armazenado em `localStorage` como `brana_token`.

## 8. Bootstrap por `/me`

- O bootstrap por `/api/me` ocorreu logo após o login.
- O contexto retornado trouxe usuário autenticado, `setup_completed: true`, `is_admin: true` e demais dados esperados.

## 9. Início do controlador

- O controlador de renovação começou somente depois da autenticação confirmada por `/me`.
- Não houve início do controlador com a tela desautenticada.

## 10. Renovação silenciosa

- Houve renovação automática real por `POST /api/auth/renew`.
- O usuário permaneceu na mesma tela protegida.
- Não houve recarregamento visual.
- O token salvo foi substituído por um novo JWT.

## 11. Substituição do JWT

- O token do `localStorage` mudou após a renovação.
- O JWT renovado teve novo valor e novo `exp`.
- `expires_in` retornado pela renovação foi `3600`.

## 12. Três ciclos

- Foram observados três ciclos completos de renovação em sequência.
- Houve exatamente uma chamada por ciclo na janela observada.
- Não houve acúmulo de timers visível na rede.
- O usuário permaneceu estável em `/app`.

## 13. Requisição protegida posterior

- Após a renovação, uma requisição protegida a `/api/me` foi executada com sucesso.
- O cliente leu o token atualizado do storage.
- A resposta permaneceu `200`.

## 14. Falha transitória

- A falha transitória foi simulada com resposta `500` temporária em `POST /api/auth/renew`.
- A sessão não foi encerrada imediatamente.
- O token não foi limpo de forma imediata.
- Houve retry automático.
- O retry apareceu dentro da política reduzida de teste.
- A sessão permaneceu no app após a recuperação.

## 15. Retries observados

- Política temporária usada no teste: `3s` e `6s`.
- Foi observado um `500` inicial, seguido por `200` no retry e por nova renovação normal depois disso.
- Não houve retries paralelos.

## 16. Recuperação

- Depois do erro transitório, a renovação conseguiu voltar ao fluxo normal.
- O usuário permaneceu autenticado.

## 17. Falha definitiva

- A falha definitiva foi simulada com token adulterado no `localStorage`.
- A próxima renovação resultou em limpeza da sessão.
- O frontend voltou para a tela de login.
- O token inválido foi removido.
- Não houve loop de renovação.

## 18. Logout normal

- O logout foi executado pela UI.
- O menu do usuário exibiu a ação `Sair`.
- `POST /api/logout` foi chamado.
- O token foi removido.
- O usuário foi limpo.
- A tela voltou para login.

## 19. Logout com renovação pendente

- Foi simulada uma renovação pendente com interceptação temporária de `POST /api/auth/renew`.
- O logout ocorreu antes da resposta ser liberada.
- O token foi limpo antes do retorno da resposta pendente.
- Ao liberar a resposta, ela foi ignorada e não restaurou a sessão.

## 20. Login posterior

- Após logout, um novo login funcionou.
- O novo token foi diferente do anterior.
- Não houve reaproveitamento de estado residual da sessão anterior.

## 21. Reload com token válido

- Com token válido, o reload restaurou a sessão por `/api/me`.
- A tela protetida voltou corretamente.
- O controlador voltou a operar normalmente.

## 22. Reload com token inválido

- Com token adulterado, o reload voltou para `/login`.
- O token inválido foi removido.
- O controlador não permaneceu ativo.

## 23. StrictMode

- O app usa `React.StrictMode` em `frontend-react/src/main.jsx`.
- No runtime de desenvolvimento houve comportamento compatível com StrictMode, mas os ciclos de renovação permaneceram únicos por ciclo.

## 24. Console

- Não foram observados erros relevantes de React durante a validação.
- Não houve warning persistente de atualização após unmount.
- Não houve loop visual de renderização.

## 25. Network

- `POST /api/login` apareceu com sucesso.
- `GET /api/me` apareceu no bootstrap e em chamadas posteriores válidas.
- `POST /api/auth/renew` apareceu para cada ciclo e para a falha transitória.
- `POST /api/logout` apareceu no logout normal.
- Não houve uso de `storage`, `focus`, `visibilitychange` ou `BroadcastChannel`.

## 26. Defeitos encontrados

- Nenhum defeito funcional bloqueante foi confirmado na frente de renovação.
- O único ponto operacional mais sensível foi o clique de logout no headless, resolvido com seleção direta do item `Sair` no DOM.

## 27. Correções realizadas

- Foi feita apenas a redução temporária do intervalo de renovação para validar o runtime.
- A alteração foi revertida antes do fechamento.

## 28. Limitações

- A validação foi feita em headless com Playwright, não em interação humana manual visível.
- A conta usada já existia no banco local e teve a senha ajustada apenas no ambiente local para teste.
- Não houve validação contra ambiente produtivo.

## 29. Critérios aprovados

- Login funcionou.
- `/me` funcionou.
- O controlador iniciou após autenticação.
- Houve renovação real.
- O token foi substituído.
- Requisição protegida posterior funcionou.
- Três ciclos não criaram duplicidade persistente.
- Falha transitória não causou logout imediato.
- Falha definitiva encerrou a sessão.
- Logout parou a renovação.
- Resposta tardia não restaurou o token após logout.
- Novo login funcionou.
- Reload válido restaurou a sessão.
- Reload inválido exigiu login.
- `React.StrictMode` permaneceu ativo.
- O intervalo final foi restaurado para 15 minutos.
- Nenhuma instrumentação temporária permaneceu no código.

## 30. Critérios não validados

- Não foram executadas validações com múltiplas abas simultâneas.
- Não foi validado o navegador em modo offline do SO; a simulação foi via rede HTTP controlada.
- Não foi validado comportamento fora do Chrome/Chromium.

## 31. Conclusão

A validação runtime da renovação automática de autenticação no frontend React foi concluída com sucesso no ambiente local. O ciclo básico funcionou, a sessão permaneceu estável durante as renovações, falhas transitórias e definitivas se comportaram como esperado, logout encerrou a renovação e o intervalo final foi restaurado para 15 minutos.
