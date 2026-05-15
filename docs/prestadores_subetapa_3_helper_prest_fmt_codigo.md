# Prestadores - Subetapa 3 - Helper `prestFmtCodigo`

## 1. Objetivo da etapa

Criar o primeiro helper puro do namespace passivo de Prestadores, sem integrar ainda o helper ao `frontend/app.js`.

## 2. Arquivo alterado

- `frontend/js/modules/prestadores.js`

## 3. Helper criado

- `prestFmtCodigo(valor)`

## 4. Entradas aceitas

O helper aceita qualquer valor de entrada, incluindo:

- `null`
- `undefined`
- string vazia
- string com espacos
- numero
- string numerica
- texto com prefixo ou rotulo
- objeto simples convertido para string

## 5. Saidas esperadas

Comportamento esperado:

- `null` -> `"-"`
- `undefined` -> `"-"`
- `""` -> `"-"`
- `"   "` -> `"-"`
- `12` -> `"12"`
- `"12"` -> `"12"`
- `"  12  "` -> `"12"`
- `"PREST-12"` -> `"PREST-12"`

## 6. Exemplos de comportamento

```js
prestFmtCodigo(null)        // "-"
prestFmtCodigo(undefined)   // "-"
prestFmtCodigo("")          // "-"
prestFmtCodigo("   ")       // "-"
prestFmtCodigo(12)          // "12"
prestFmtCodigo("12")        // "12"
prestFmtCodigo("  12  ")    // "12"
prestFmtCodigo("PREST-12")  // "PREST-12"
```

## 7. Garantias de pureza

O helper e puro porque:

- nao acessa DOM;
- nao usa `fetch`;
- nao usa `requestJson`;
- nao depende de estado global do `app.js`;
- nao altera estado;
- nao registra eventos;
- nao chama funcoes do `app.js`.

## 8. Confirmacao de que nao acessa DOM

O helper nao usa `document`, nao busca elementos e nao depende de UI.

## 9. Confirmacao de que nao usa fetch/requestJson

O helper nao faz chamadas de rede e nao conversa com backend.

## 10. Confirmacao de que nao registra eventos

O helper nao cria listeners, nao usa `addEventListener` e nao altera binds.

## 11. Confirmacao de que nao depende de estado global do `app.js`

O helper so trabalha com o valor de entrada recebido por parametro.

## 12. Confirmacao de que nao foi integrado ao `app.js`

Esta etapa nao alterou `frontend/app.js`.
O helper permanece no namespace passivo de `Prestadores`.

## 13. Confirmacao de que `frontend/app.js` ficou intocado

`frontend/app.js` nao foi alterado.

## 14. Riscos preservados

Permanecem preservados para as proximas etapas:

- integracao com `prestRender()`;
- integracao com `prestCarregar()`;
- integracao com validacao ou salvamento futuro;
- riscos de compatibilidade com a tabela dinamica;
- riscos de mover comportamento cedo demais.

## 15. Recomendacao para a Subetapa 4

Integrar `prestFmtCodigo` no `app.js` com fallback local e validacao de retorno, somente se os testes desta Subetapa 3 passarem.
