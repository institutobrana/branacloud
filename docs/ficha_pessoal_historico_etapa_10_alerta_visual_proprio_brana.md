# Ficha Pessoal - Historico - Etapa 10 - alerta visual proprio do Brana

## Objetivo
Substituir o `window.alert` do navegador, usado na validacao da descricao obrigatoria do Historico, por uma janela visual propria do Brana Cloud, mantendo o mesmo texto e a mesma regra de bloqueio.

## Ajuste aplicado
- O aviso de descricao vazia passou a abrir um modal interno da aba Historico.
- O modal usa o titulo da propria Ficha Pessoal, para ficar integrado ao restante da interface.
- O texto do aviso continua sendo o mesmo: a descricao do procedimento nao pode ser nula.
- A regra funcional nao mudou: a linha continua bloqueada ate a descricao ser preenchida.

## Arquivo alterado
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

## O que nao foi alterado
- Nao houve mudanca em backend.
- Nao houve mudanca em endpoints, payload ou persistencia.
- Nao houve mudanca no comportamento do `ENTER` e do `Grava`.
- Nao houve mudanca global nos demais `window.alert` do sistema.

## Validacao esperada
1. Deixar a descricao do Historico vazia.
2. Tentar confirmar a linha.
3. Conferir que abre um aviso proprio do Brana Cloud.
4. Confirmar que o modal pode ser fechado por `Ok` ou `X`.
5. Preencher a descricao e repetir para confirmar que o bloqueio desaparece.

## Risco observado
- O ajuste e local e limitado a esta validacao, portanto o risco de regressao para outras telas e baixo.

## Proxima subetapa recomendada
Proxima etapa sugerida: refinar detalhes visuais finos do aviso, se o usuario quiser aproximar ainda mais do layout do EasyDental.
