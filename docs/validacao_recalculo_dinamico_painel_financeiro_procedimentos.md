# Validacao do recálculo dinamico do Painel Financeiro de Procedimentos

## Estado validado

- O modal `Nova intervenção` atualiza o Painel Financeiro enquanto o usuario edita os campos monetarios e de tempo.
- O React nao mantem formula financeira local.
- O preview usa o backend como fonte unica da formula.
- O card `Rendimento %` foi alinhado ao contrato do legado usando `rendimento_proc`.

## Validacao real

- `GET /me`: `200`
- `POST /procedimentos/dashboard-preview`: `200`
- `npm.cmd run build`: concluido com sucesso

## Cenário de teste

- Valor do paciente: `1.200,00`
- Tempo: `90`
- Custo de laboratorio: `250,00`

## Resultado observado

- `CFPH`: `R$ 207,90`
- `Mat. Consumo`: `R$ 0,00`
- `Custo R$`: `R$ 457,90`
- `Imposto`: `R$ 120,00`
- `Comissão CD`: `R$ 240,00`
- `Taxa Cartão`: `R$ 48,00`
- `Valor Mínimo`: `R$ 911,69`
- `Lucro Bruto`: `R$ 742,10`
- `Lucro Líquido`: `R$ 334,10`
- `Rendimento %`: `27,84%`
- `Lucro por hora`: `R$ 222,73`

## Observacao

O preview nao grava dados e nao depende de calculo financeiro local no frontend.

## Atualizacao recente

- O card `Rendimento %` passou a exibir `rendimento_proc` explicitamente, sem fallback silencioso para `rendimento`.
- Os demais cartoes permanecem consumindo o preview oficial sem calculo local.

## Validacao dinamica complementar

- `Valor do paciente = 0,00` retornou `rendimento_proc = -100` e a interface mostrou `-100,00%`.
- `Valor do paciente` igual ao `Custo R$` retornou `rendimento_proc` muito proximo de `0`, com exibicao `0,00%`.
- `Valor do paciente` abaixo do `Custo R$` retornou `rendimento_proc` negativo, com sinal preservado na interface.
- Em todas as mudancas testadas, o `POST /api/procedimentos/dashboard-preview` respondeu `200` antes do save.
- `Valor Mínimo` permaneceu calculado pelo backend sem qualquer ajuste local nesta etapa.

## Rastreabilidade complementar

- O endpoint de preview nao recebe os percentuais de `ir`, `cd` e `cartao` no payload.
- Esses parametros sao lidos do `Cenario` da clinica.
- O React apenas redispara o preview oficial ao alterar o campo `Valor do paciente`.
- A diferenca historica foi corrigida nesta implementacao, alinhando o backend ao contrato legado.
