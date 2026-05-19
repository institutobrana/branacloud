# Subetapa 2O - Fechamento e reavaliacao conservadora do modulo Intervencoes / Procedimentos

## 1. Objetivo da etapa
Esta etapa e somente documental. O objetivo foi fechar e reavaliar de forma conservadora a rodada atual de modularizacao do modulo **Configuracoes > Tabelas > Intervencoes / Procedimentos...**, sem mover codigo e sem alterar comportamento.

## 2. Branch e diretório verificados
- Branch: `modularizacao-segura-fase-1`
- Diretorio real: `D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Checks iniciais executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -10`
- `git diff --stat`
- `git diff --cached --stat`

Resultado resumido dos checks iniciais:
- Branch correta
- Nenhum arquivo staged
- Muitos arquivos `??` antigos em `docs/`
- Nenhum diff tracked ativo antes da criacao deste documento

## 4. Resumo da rodada atual de modularizacao
A rodada atual concentrou a extracao conservadora de helpers pequenos e seguros do `frontend/app.js` para `frontend/js/modules/intervencoes-procedimentos.js`, mantendo wrappers/fallbacks compatíveis no `app.js` quando necessario.

Nesta rodada, os helpers claramente seguros ja foram extraidos:
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

Os proximos blocos avaliados passaram a tocar DOM/select, options, valor selecionado e fluxos mais amplos do editor, filtros, modal e Procedimentos Genéricos, elevando o risco de regressao visual e funcional.

## 5. Helpers ja extraidos com seguranca
- `procParse`
- `procFmtBr`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procIndiceSiglaFromValor`

## 6. Confirmacao do modulo passivo atual
O modulo passivo atual continua em:
- `frontend/js/modules/intervencoes-procedimentos.js`

O arquivo de modulo segue com helpers puros, sem rede e sem DOM automatico, e continua sendo o destino seguro para as extracoes ja consolidadas.

## 7. Wrappers/fallbacks no `app.js`
O `frontend/app.js` continua mantendo wrappers/fallbacks compatíveis para os helpers ja extraidos, preservando a assinatura publica e reduzindo o risco de quebra imediata.

## 8. Resultado consolidado dos helpers de select
- `procSetSelectValue`: **cautela**
- `procGarantirOpcaoSelect`: **cautela**
- `procPreencherSelect`: **cautela**

## 9. Por que os helpers de select nao devem ser movidos agora
Os tres helpers de select foram mantidos em cautela porque:
- dependem de DOM/select;
- alteram `value`, `selected`, `options` ou `innerHTML`;
- podem criar, recriar ou garantir options em tempo de execucao;
- tem risco visual direto no editor, filtros, modal, relatorio e tela de tabela;
- podem influenciar valores que serao lidos depois por payload e salvamento;
- aparecem em fluxos de editor, filtros, modal, relatorio, vinculo de material e Procedimentos Genéricos;
- mover um deles sem um plano proprio aumentaria a chance de regressao.

## 10. Blocos que permanecem proibidos nesta fase
Permanecem proibidos nesta fase:
- payload
- salvamento
- materiais
- vínculos
- Procedimentos Genéricos
- herança de materiais
- `procedimento_generico_id`
- custos
- preço
- repasse
- reajuste
- `procNormalizarFormaCobranca`
- `procNormalizarFormaCobrancaV2`

## 11. Reavaliacao de proximidade para nova extracao
Depois de `procIndiceSiglaFromValor`, nao foi encontrado um proximo helper simples, puro e claramente seguro que justificasse extracao funcional imediata sem entrar em DOM/select ou em fluxos sensiveis.

Os helpers de select restantes ainda exigem documentacao propria, testes visuais e cuidado com os valores exibidos no DOM.

## 12. Classificacao atual do modulo
- Seguro para continuar extraindo helpers simples? **Nao, nao ha um candidato novo claramente simples o bastante nesta rodada**
- Cautela para helpers de DOM/select? **Sim**
- Proibido para fluxos sensiveis? **Sim**

## 13. Recomendacao objetiva
Recomendacao: **pausar Intervencoes / Procedimentos nesta rodada**

Justificativa:
- os helpers claramente seguros ja foram extraidos;
- os proximos pontos relevantes tem risco acoplado a DOM/select, payload, salvamento ou regras sensiveis;
- continuar sem um plano proprio de DOM/select aumentaria o risco de regressao;
- o ganho de modularizacao adicional agora e menor do que o risco de quebra visual ou funcional.

## 14. Roteiro futuro se o modulo for retomado
Se o modulo for retomado depois, o caminho conservador e:
1. Criar um plano proprio para DOM/select
2. Congelar o comportamento visual atual
3. Criar checklist de testes manuais
4. Testar editor
5. Testar filtros
6. Testar relatorio/modal
7. Testar vinculo de material
8. Testar Procedimentos Genéricos
9. Testar troca de genérico
10. Testar materiais proprios/herdados
11. Testar payload e salvamento comparativo
12. Testar custos/reajuste apenas em etapa propria, sem executar reajuste real

## 15. Recomendacao de proximo modulo ou proxima acao documental
Se nao houver candidato simples e seguro neste modulo, a recomendacao e registrar um novo plano documental para outro modulo mais isolado, em vez de iniciar outra extracao funcional aqui.

Nao iniciar outro modulo nesta mesma etapa.

## 16. Confirmações finais de segurança
- Nenhum codigo foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules/intervencoes-procedimentos.js` nao foi alterado
- Backend nao foi alterado
- Banco/schema/migrations/endpoints nao foram alterados
- Nao houve `UPDATE/DELETE/INSERT`
- Nao houve execucao de reajuste real
- Nao houve `git add/commit/push/clean/reset/restore`
- Nada foi criado, editado, salvo ou documentado nas pastas proibidas
- Blindagem textual/mojibake foi respeitada
