# Fase 2B - Correcao minima da regressao central usersPanelOverlay

## 1. Identificacao da etapa
- Fase 2B.
- Correcao minima da regressao central de abertura de paineis.
- Etapa exclusivamente documental com uma correcao pontual minima em `frontend/app.js`.

## 2. Erro observado
- O usuario informou que varios modulos nao abriam apos a tentativa de testar `Financeiro > Conta corrente`.
- No console, ao abrir `Sobre > Painel ADM`, apareceu:
  - `app.js?v=20260513-medicamentos-sub1:574 Uncaught (in promise) ReferenceError: usersPanelOverlay is not defined`
  - stack: `usersDetachOverlay` -> `hideAllPanels` -> `showSuperAdminPanel` -> `abrirPainelAdministradorToolbar`

## 3. Causa apontada pela auditoria
- A auditoria documental anterior confirmou que `usersPanelOverlay` nao existia como declaracao global no estado atual.
- `frontend/app.js` apenas referenciava `usersPanelOverlay`, mas nao a declarava.
- `usersDetachOverlay()` e `hideAllPanels()` dependiam dessa variavel sem guarda suficiente.
- Como `hideAllPanels()` e chamado por varios fluxos de abertura, a excecao interrompia a abertura de varios paineis.

## 4. Arquivo alterado
- `frontend/app.js`

## 5. Funcao/trecho corrigido
- Bloco global de estado inicial.
- Restauracao de:
  - `let usersPanelOverlay=null;`
  - `let usersPanelPlaceholder=null;`

## 6. Confirmacoes da correcao
- `usersPanelOverlay` foi restaurado como declaracao global.
- Nao houve guarda defensiva adicional.
- A correcao foi minima e focada apenas em restaurar a variavel ausente.
- Nenhum fluxo funcional foi alterado.

## 7. Confirmacoes de escopo
- `requestJson`, payload, salvamento e exclusao nao foram alterados.
- backend, banco, endpoints e permissoes nao foram alterados.
- relatórios, fluxo de caixa, recebimentos, pagamentos, valores financeiros, datas e status nao foram alterados.
- Conta corrente, Painel ADM, usuarios/login/permissoes e fluxos financeiros nao foram alterados funcionalmente.
- Blindagem textual/mojibake foi respeitada.

## 8. Teste manual obrigatorio
- Abrir o sistema.
- Abrir `Sobre > Painel ADM`.
- Confirmar que o Painel ADM abre sem erro `usersPanelOverlay is not defined`.
- Abrir alguns modulos que antes nao abriam.
- Abrir `Financeiro > Conta corrente`.
- Confirmar que a tela abre e que a tabela/lista de lancamentos carrega.
- Conferir entradas, saidas e saldo.
- Confirmar selecao visual e filtros, se possivel.
- Nao testar salvar.
- Nao testar exclusao.

## 9. Risco residual
- Ainda pode haver outros pontos centrais dependentes de variaveis globais similares.
- Se algum outro overlay tiver a mesma fragilidade, novos fluxos podem exigir auditoria pontual.

## 10. Rollback mental
- Reintroduzir a declaracao global de overlay.
- Se a regressao persistir, reverter apenas a linha adicionada e reabrir auditoria central.
