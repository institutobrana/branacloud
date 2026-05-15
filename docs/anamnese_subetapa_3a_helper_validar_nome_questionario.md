# Anamnese - Subetapa 3A - Helper puro validar nome de questionário

## 1. Contexto

- A Subetapa 1 criou o namespace passivo de Anamnese.
- A Subetapa 2 documentou fronteiras e contratos.
- Esta etapa adiciona apenas um helper puro.
- Ainda nao ha integracao com `frontend/app.js`.

## 2. Arquivos alterados

- `frontend/js/modules/anamnese.js`
- `docs/anamnese_subetapa_3a_helper_validar_nome_questionario.md`

Confirmacao:

- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado nesta etapa.

## 3. Helper criado

Helper:

- `anamneseValidarNomeQuestionario(nome)`

Contrato:

Entrada:

- qualquer valor

Saida:

```js
{
  valido: boolean,
  mensagem: string,
  valor: string
}
```

Regras:

- aplica `trim` no texto
- vazio retorna invalido
- valido retorna o valor normalizado

## 4. O que o helper NÃO faz

- nao usa DOM
- nao usa fetch
- nao usa requestJson
- nao altera cache
- nao chama app.js
- nao registra eventos
- nao abre modal
- nao renderiza
- nao salva
- nao exclui
- nao renumera
- nao altera respostas
- nao controla fluxo

## 5. Estado do namespace

- `window.BranaAnamneseModule` continua existindo
- `status` continua `passivo`
- `ativo` continua `false`
- `controlaFluxo` continua `false`

## 6. Por que este helper foi escolhido

- e textual
- e previsivel
- nao depende de backend
- nao depende de DOM
- nao toca em lista de questionarios
- nao toca em respostas de paciente
- e seguro para primeira extracao

## 7. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/anamnese.js`
- `git diff --stat`
- `git status --short`

## 8. Como testar no console

Depois de `Ctrl+F5`, testar:

- `window.BranaAnamneseModule?.getStatus()`
- `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("")`
- `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("Implante")`

Resultados esperados:

Para vazio:

```js
{
  valido: false,
  mensagem: "Informe o nome do questionário.",
  valor: ""
}
```

Para `"Implante"`:

```js
{
  valido: true,
  mensagem: "",
  valor: "Implante"
}
```

## 9. Onde testar no sistema

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar os 5 questionarios:
   - `Principal`
   - `Implante`
   - `Ficha complementar`
   - `Anamnese de Saúde`
   - `Anamnese pessoal`
5. Conferir quantidades:
   - `Principal`: 17
   - `Implante`: 12
   - `Ficha complementar`: 12
   - `Anamnese de Saúde`: 55
   - `Anamnese pessoal`: 16
6. Abrir ficha de paciente.
7. Validar fluxo de Anamnese/respostas.
8. Confirmar console sem `ReferenceError` ou `TypeError`.
9. Confirmar helper funcionando no console.

## 10. Recomendação para próxima etapa

- Nao integrar ainda se houver duvida.
- A proxima etapa pode ser Subetapa 3B com outro helper puro ou Subetapa 4 para integrar este helper com fallback local no `app.js`.
- So integrar se o teste manual passar.

