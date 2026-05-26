# Fase 2B - Auditoria da regressao central de abertura de paineis

## 1. Identificacao da etapa
- Fase 2B.
- Auditoria central de abertura de paineis.
- Etapa exclusivamente documental.
- Sem implementacao.

## 2. Descricao da regressao
- O teste pos-correcao da Conta corrente revelou que nao e apenas `Financeiro > Conta corrente` que deixa de abrir.
- Outros modulos tambem falham ao abrir, enquanto poucos ainda conseguem entrar na tela.
- O console informou:
  - `app.js?v=20260513-medicamentos-sub1:574 Uncaught (in promise) ReferenceError: usersPanelOverlay is not defined`
  - stack: `usersDetachOverlay` -> `hideAllPanels` -> `showSuperAdminPanel` -> `abrirPainelAdministradorToolbar`

## 3. Auditoria leve e comparacoes
- `git status --short` no momento da auditoria mostrou apenas arquivos untracked antigos em `docs/`, sem alteracao de codigo nesta etapa.
- `git log --oneline -8` confirmou os commits recentes relevantes:
  - `abdf2fa Corrige abertura da conta corrente na fase 2B`
  - `ad2627d Audita regressao na abertura da conta corrente`
  - `beee5d7 Extrai tabela de conta corrente na fase 2B`
  - `eb437df Documenta contrato profundo de conta corrente na fase 2B`
  - `cb454df Reavalia proxima frente da fase 2B apos ficha pessoal`
  - `09544fc Documenta contrato profundo de ficha pessoal na fase 2B`
  - `8b68db1 Reavalia proxima frente da fase 2B apos medicamentos`
  - `db5fc02 Documenta contrato profundo de medicamentos na fase 2B`
- Arquivos comparados:
  - `frontend/app.js`
  - `frontend/js/modules/conta-corrente.js`
- Diff avaliado:
  - `git diff eb437dfad95f004f43a06d1db071438203ede90a..abdf2fa2144b3dac9f3c4d4fea7646632515f185 -- frontend/app.js frontend/js/modules/conta-corrente.js`
  - `git diff eb437dfad95f004f43a06d1db071438203ede90a..beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647 -- frontend/app.js frontend/js/modules/conta-corrente.js`
- `git show --name-only --stat --oneline abdf2fa2144b3dac9f3c4d4fea7646632515f185` listou:
  - `docs/11_roadmap_desenvolvimento.md`
  - `docs/fase_2b_conta_corrente_correcao_abertura_tela.md`
  - `frontend/app.js`
- `git show --name-only --stat --oneline beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647` listou:
  - `docs/11_roadmap_desenvolvimento.md`
  - `docs/fase_2b_conta_corrente_tabela_totais_implementacao_minima.md`
  - `frontend/app.js`
  - `frontend/js/modules/conta-corrente.js`

## 4. Funcoes investigadas
- `usersPanelOverlay`
- `usersDetachOverlay`
- `usersAttachOverlay`
- `hideAllPanels`
- `showSuperAdminPanel`
- `abrirPainelAdministradorToolbar`
- referencias relacionadas a overlay/painel de usuarios em `frontend/app.js`

## 5. Resultado da investigacao tecnica
- No estado atual de `frontend/app.js`, nao foi encontrada declaracao global de `usersPanelOverlay`.
- O arquivo apenas usa `usersPanelOverlay` em funcoes como `usersAttachOverlay`, `usersDetachOverlay`, `sysOptSyncUI` e `sysOptFechar`.
- `usersDetachOverlay` nao tem guard seguro para uma variavel inexistente; ele assume que `usersPanelOverlay` exista.
- `hideAllPanels()` chama `usersDetachOverlay()` sem protecao adicional.
- Portanto, qualquer fluxo que passe por `hideAllPanels()` pode quebrar antes de abrir o painel alvo.

## 6. Causa provavel
- A regressao central foi criada pelo commit `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647`.
- O diff mostra que a declaracao global de `usersPanelOverlay=null` saiu da inicializacao de estado em `frontend/app.js` nesse caminho de alteracao.
- A correcao posterior `abdf2fa2144b3dac9f3c4d4fea7646632515f185` removeu o bootstrap assincrono da Conta corrente, mas nao restaurou essa declaracao.
- Assim, o problema e central e afeta varios paineis, nao apenas Conta corrente.

## 7. Abrangencia do problema
- Sim, isso explica por que varios modulos nao abrem.
- Como muitos caminhos de abertura chamam `hideAllPanels()`, a excecao em `usersDetachOverlay()` interrompe a sequencia antes do painel ser mostrado.
- O erro observado no Painel ADM e consistente com essa falha central.

## 8. Observacao sobre `app.js?v=20260513-medicamentos-sub1`
- A referencia parece ser um querystring de cache-busting antigo/estatico do `app.js`.
- Como `frontend/index.html` nao foi alterado nesta auditoria, a referencia deve ser tratada como possivel cache/asset versionado antigo, nao como correção realizada aqui.

## 9. Checks executados
- `node --check frontend/app.js` -> passou sem saida, exit code `0`.
- `node --check frontend/js/modules/conta-corrente.js` -> passou sem saida, exit code `0`.
- Os checks validam sintaxe, nao o runtime; por isso o erro permanece como falha funcional de execucao.

## 10. Risco de correcao
- Risco alto, porque a variavel afeta o fluxo central de abertura/fechamento de paineis.
- Corrigir de forma errada pode reabrir regressao em usuarios, Super Admin e modais conectados ao overlay.

## 11. Proposta de correcao minima futura
- Restaurar a declaracao global de `usersPanelOverlay` no estado inicial, ou
- adicionar guard defensivo em `usersDetachOverlay()` e pontos adjacentes, sem ampliar escopo, ou
- se necessario, desfazer temporariamente a parte de refatoracao que removeu a variavel, mantendo o restante do trabalho isolado.

## 12. Confirmacoes finais
- Nenhuma correcao foi feita nesta auditoria.
- A validacao pos-teste do commit `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647` continua bloqueada.
- A Conta corrente continua nao validada ate o fluxo central de abertura voltar a funcionar.
