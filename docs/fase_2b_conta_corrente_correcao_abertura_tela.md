# Fase 2B - Conta corrente - Correcao minima da abertura da tela

## Objetivo da etapa

- Corrigir a regressao funcional da abertura da tela `Financeiro > Conta corrente`.
- Reverter temporariamente a dependencia que fazia a tela depender do bootstrap assíncrono do novo módulo.

## Causa apontada pela auditoria

- A regressao foi criada pelo commit `beee5d72cc3ebf82dd8bbcef35a3f4ca5f748647`.
- O `node --check` passou em `frontend/app.js` e `frontend/js/modules/conta-corrente.js`, entao a suspeita ficou concentrada no bootstrap/runtime do navegador.
- A causa provável era o preloader assíncrono `contaCorrenteModulePromise=import("/frontend/js/modules/conta-corrente.js").catch(()=>null);` junto com a delegação de `ccRenderTabela()` para o módulo passivo.

## Arquivos alterados

- `frontend/app.js`
- `docs/fase_2b_conta_corrente_correcao_abertura_tela.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcao ou trecho corrigido

- `ccRenderTabela()` voltou a ser síncrona e autônoma, com a renderização direta que já existia antes da delegação.
- O preloader assíncrono da conta corrente foi removido do bootstrap.

## Como a correção foi aplicada

- A delegação foi temporariamente desativada em `app.js`.
- O módulo `frontend/js/modules/conta-corrente.js` foi preservado como artefato passivo para futura integração mais segura.
- A correção foi mínima e não ampliou o recorte.

## Confirmacoes de escopo

- `requestJson`, payload, salvamento e exclusão não foram alterados.
- backend, banco, endpoints e permissões não foram alterados.
- relatórios, fluxo de caixa, recebimentos, pagamentos, pacientes, agenda, convênios, prestadores e procedimentos não foram alterados.
- valores financeiros, datas, status e formas de pagamento não foram alterados.
- a blindagem textual/mojibake foi respeitada.

## Teste manual obrigatorio

1. Abrir o sistema.
2. Ir em `Financeiro > Conta corrente`.
3. Confirmar que a tela abre.
4. Confirmar que a tabela/lista de lancamentos carrega normalmente.
5. Conferir os totais/resumo mensal.
6. Clicar em linhas diferentes da tabela.
7. Alterar filtros de mês/ano/conta/filtro, se existirem.
8. Fechar e reabrir o painel.
9. Nao testar salvar.
10. Nao testar exclusao.

## Risco residual

- Ainda pode haver regressão visual/local na tabela caso o módulo passivo seja reintroduzido sem nova auditoria.
- A frente continua sensível por ser financeira.

## Rollback mental

- Se a abertura falhar novamente, restaurar o comportamento síncrono direto de `ccRenderTabela()` e manter o módulo passivo sem uso até uma nova tentativa segura.

