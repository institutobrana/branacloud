# Anamnese - Subetapa 3B - Helper puro validar texto de pergunta

## 1. Contexto

- Subetapa 1 criou namespace passivo.
- Subetapa 2 documentou fronteiras e contratos.
- Subetapa 3A criou helper de validação de nome de questionário.
- Antes desta etapa, foi corrigido o problema recorrente de segundo clique rápido/duplo clique em perguntas.
- Esta etapa adiciona apenas um segundo helper puro.
- Ainda não há integração com `app.js`.

## 2. Arquivos alterados

- `frontend/js/modules/anamnese.js`
- `docs/anamnese_subetapa_3b_helper_validar_texto_pergunta.md`

Confirmações:
- `frontend/app.js` não foi alterado nesta etapa.
- `frontend/index.html` não foi alterado nesta etapa.

## 3. Helper criado

- `anamneseValidarTextoPergunta(texto)`

Contrato:
- Entrada: qualquer valor
- Saída:
  ```json
  {
    "valido": true,
    "mensagem": "",
    "valor": "texto normalizado"
  }
  ```

Regras:
- faz `trim` no texto;
- vazio retorna inválido;
- válido retorna valor normalizado.

## 4. O que o helper NÃO faz

- não usa DOM;
- não usa `fetch`;
- não usa `requestJson`;
- não altera cache;
- não chama `app.js`;
- não registra eventos;
- não abre modal;
- não renderiza;
- não salva;
- não exclui;
- não renumera;
- não altera respostas;
- não controla fluxo.

## 5. Estado do namespace

- `window.BranaAnamneseModule` continua existindo;
- `status` continua passivo;
- `ativo` continua false;
- `controlaFluxo` continua false;
- helpers disponíveis:
  - `anamneseValidarNomeQuestionario`
  - `anamneseValidarTextoPergunta`

## 6. Por que este helper foi escolhido

- é textual;
- é previsível;
- não depende de backend;
- não depende de DOM;
- não toca em lista de questionários;
- não toca em respostas de paciente;
- não toca em renumeração;
- não toca em modal;
- é seguro para segunda extração pura.

## 7. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/anamnese.js`
- `git diff --stat`
- `git status --short`

## 8. Como testar no console

Após `Ctrl+F5`:

```js
window.BranaAnamneseModule?.getStatus()
window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("")
window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario("Implante")
window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta("")
window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta("Você tem alergia?")
```

## 9. Onde testar no sistema

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar os 5 questionários.
5. Conferir quantidades:
   - `Principal: 17`
   - `Implante: 12`
   - `Ficha complementar: 12`
   - `Anamnese de Saúde: 55`
   - `Anamnese pessoal: 16`
6. Validar novamente:
   - clique simples em pergunta seleciona;
   - segundo clique rápido/duplo clique abre `Altera pergunta de anamnese`;
   - botão `Altera` continua funcionando.
7. Abrir ficha de paciente.
8. Validar fluxo de Anamnese/respostas.
9. Confirmar console sem `ReferenceError` ou `TypeError`.
10. Confirmar os dois helpers funcionando no console.

## 10. Recomendação para próxima etapa

- Próxima etapa pode ser Subetapa 4A integrando apenas `anamneseValidarNomeQuestionario` com fallback local no `app.js`;
- ou Subetapa 3C com normalização de tipo de pergunta, ainda sem integração;
- não mexer em lista, renderização, modais, exclusão, renumeração ou respostas.
