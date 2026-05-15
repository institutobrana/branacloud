# Anamnese - Subetapa 4B - Integração do helper validar texto de pergunta

## 1. Contexto

- Subetapa 3B criou o helper puro `anamneseValidarTextoPergunta`.
- Esta etapa integra apenas `anamneseValidarTextoPergunta`.
- A integração é com fallback local no `app.js`.
- O módulo continua passivo.

## 2. Arquivos alterados

- `frontend/app.js`
- `docs/anamnese_subetapa_4b_integracao_validar_texto_pergunta.md`

`frontend/js/modules/anamnese.js` não foi alterado nesta etapa.

## 3. Função alterada

- `anamneseSalvarPergunta()`

## 4. O que foi integrado

- Uso seguro de `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`.
- Validação de formato do retorno.
- Fallback local se o helper não existir, falhar ou retornar formato inválido.
- Preservação da mensagem original.
- Preservação do payload.

## 5. O que NÃO foi alterado

- Renderização não foi alterada.
- Lista de questionários não foi alterada.
- Lista de perguntas não foi alterada.
- Tipo da pergunta não foi alterado.
- Tipo da resposta não foi alterado.
- Mensagem de alerta não foi alterada.
- Exclusão não foi alterada.
- Renumeração não foi alterada.
- Respostas de paciente não foram alteradas.
- Ficha do paciente não foi alterada.
- backend não foi alterado.
- banco não foi alterado.
- endpoints não foram alterados.
- seed obrigatório não foi alterado.
- segundo clique rápido/duplo clique não foi alterado.

## 6. Estado do namespace

- `window.BranaAnamneseModule` existe.
- `helpers` existem.
- `status` continua passivo.
- `ativo` continua false.
- `controlaFluxo` continua false.

## 7. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`

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
4. Confirmar os 5 questionários:
   - `Principal`
   - `Implante`
   - `Ficha complementar`
   - `Anamnese de Saúde`
   - `Anamnese pessoal`
5. Abrir modal de nova pergunta.
6. Tentar salvar com texto da pergunta vazio.
7. Confirmar que a validação continua exibindo `Informe o texto da pergunta.`
8. Preencher texto válido, mas cancelar para não criar dado desnecessário.
9. Abrir alteração de pergunta existente pelo segundo clique rápido/duplo clique.
10. Confirmar que o texto continua carregando corretamente.
11. Testar botão `Altera`.
12. Abrir ficha de paciente.
13. Validar fluxo de Anamnese/respostas.
14. Confirmar console sem `ReferenceError` ou `TypeError`.
15. Confirmar namespace passivo no console.

## 10. Recomendação para próxima etapa

- Se os testes passarem, pode encerrar este mini ciclo de helpers textuais.
- Ou fazer uma Subetapa 5 documental de encerramento do ciclo atual.
- Não mexer em renderização, lista, modais complexos, exclusão, renumeração ou respostas.
