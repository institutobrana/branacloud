# Contrato específico - Convênios e Planos lista/seleção visual

## Contexto

- Esta etapa registra apenas a delimitação documental do recorte mais seguro para `Convênios e Planos`.
- O contrato profundo anterior já havia mapeado o bloco funcional principal em `frontend/app.js` e o módulo passivo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- O objetivo agora foi reduzir o escopo ao menor núcleo visual possível, sem abrir fluxos sensíveis.
- Nenhum código foi alterado e nenhum dado de banco foi modificado nesta etapa.

## Mapeamento técnico confirmado

- O bloco principal permanece em [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js), com funções de lista, seleção, shell, carregamento, wiring e calendário/faturamento.
- O módulo passivo continua em [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js), com helpers puros de normalização, validação e montagem de linhas.
- A fronteira sensível continua concentrada em `requestJson`, payload, salvamento, exclusão, calendário/faturamento, permissões, backend e banco.

## Sub-recortes comparados

- `CONVPLAN-ESPEC-A`: render visual das listas apenas.
- `CONVPLAN-ESPEC-B`: render + seleção visual.
- `CONVPLAN-ESPEC-C`: render + seleção + shell.
- `CONVPLAN-ESPEC-D`: não avançar ainda.

## Decisão

- A decisão registrada foi `CONVPLAN-ESPEC-A`.
- O menor núcleo seguro para avanço futuro ficou restrito à renderização visual das listas.
- Seleção, shell, wiring, `requestJson`, payload, salvamento, exclusão e calendário/faturamento foram mantidos fora do recorte imediato.

## Fronteira permitida

- Renderização visual das listas de convênios e planos.
- Helpers puros já existentes para montagem de linhas.
- Apenas suporte visual local, sem mutação funcional.

## Fronteira proibida

- `convPlanCarregar`
- `convPlanCal*`
- `requestJson`
- payload
- salvamento
- exclusão
- calendário/faturamento
- backend
- banco
- permissões
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)

## Onde testar futuramente

- Tela de `Convênios e Planos`.
- Lista principal.
- Renderização visual das linhas.
- Reabertura e fechamento do painel apenas como não-regressão.

## Confirmações de escopo

- Nenhum código foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum backend foi alterado.
- Nenhum schema, migration, seed ou endpoint foi alterado.
- A blindagem textual/mojibake foi respeitada.

## Registro para roadmap

- `Convênios e Planos` ficou consolidado documentalmente no recorte mais mínimo possível.
- O avanço futuro deve começar por render visual de listas apenas, sem abrir seleção, shell ou fluxos sensíveis.
