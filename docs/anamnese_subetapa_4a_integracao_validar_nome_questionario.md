# Anamnese - Subetapa 4A - Integração do helper validar nome de questionário

## 1. Contexto

- Subetapa 3A criou o helper puro `anamneseValidarNomeQuestionario`.
- Subetapa 3B criou o helper puro `anamneseValidarTextoPergunta`.
- Esta etapa integra apenas `anamneseValidarNomeQuestionario`.
- A integração usa fallback local no `app.js`.
- O módulo continua passivo.

## 2. Arquivos alterados

- `frontend/app.js`
- `docs/anamnese_subetapa_4a_integracao_validar_nome_questionario.md`

`frontend/js/modules/anamnese.js` não foi alterado nesta etapa.

## 3. Função alterada

- `anamneseSalvarQuestionario()`

## 4. O que foi integrado

- Uso seguro de `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`.
- Validação do formato do retorno antes de confiar no helper.
- Fallback local se o helper não existir, falhar ou retornar formato inválido.
- Preservação da mensagem original: `Informe o nome do questionário.`
- Preservação do payload e do fluxo de salvamento.

## 5. O que NÃO foi alterado

- `anamneseValidarTextoPergunta` não foi integrado.
- Renderização não foi alterada.
- Lista de questionários não foi alterada.
- Fluxo de perguntas não foi alterado.
- Modais não foram alterados além da validação textual mínima.
- Exclusão não foi alterada.
- Renumeração não foi alterada.
- Respostas de paciente não foram alteradas.
- Ficha do paciente não foi alterada.
- backend não foi alterado.
- banco não foi alterado.
- endpoints não foram alterados.
- seed obrigatório não foi alterado.

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
5. Abrir o modal de novo questionário.
6. Tentar salvar com nome vazio.
7. Confirmar que a validação continua exibindo `Informe o nome do questionário.`
8. Preencher um nome válido, mas cancelar para não criar dado desnecessário.
9. Abrir alteração de questionário existente, se houver fluxo seguro.
10. Confirmar que o nome continua carregando corretamente.
11. Validar novamente:
    - clique simples em pergunta seleciona;
    - segundo clique rápido/duplo clique abre `Altera pergunta de anamnese`;
    - botão `Altera` continua funcionando.
12. Abrir ficha de paciente.
13. Validar fluxo de Anamnese/respostas.
14. Confirmar console sem `ReferenceError` ou `TypeError`.
15. Confirmar namespace passivo no console.

## 10. Recomendação para próxima etapa

- Se os testes passarem, próxima etapa pode ser `Subetapa 4B` integrando `anamneseValidarTextoPergunta` com fallback local.
- Ou encerrar este mini ciclo e aguardar teste manual.
- Não mexer em renderização, lista, modais complexos, exclusão, renumeração ou respostas.
