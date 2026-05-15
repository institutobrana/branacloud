# Correção - Duplo clique em pergunta de Anamnese

## 1. Contexto

- O bug foi encontrado durante a validação da Subetapa 3A.
- O duplo clique em uma pergunta da tabela de Anamnese deveria abrir o modal de alteração.
- A modularização continuou pausada para esta correção funcional pontual.
- Uma primeira tentativa com `dblclick` no fluxo ativo não resolveu o problema no navegador.

## 2. Diagnóstico

- A função de bind do painel de Anamnese fica em `anamneseVincularEventos()`.
- A tabela de perguntas é renderizada por `anamneseRender()`.
- A abertura do modal de edição é feita por `anamneseAbrirModalPergunta("editar", item)`.
- O botão `Altera` continuou funcionando porque usa o fluxo de seleção já existente.
- O clique simples continuou funcionando e segue apenas selecionando a pergunta.
- A causa real foi a fragilidade do `dblclick` nativo quando o clique simples re-renderiza a tabela.
- O padrão já visto em outros módulos mostra que, nesses casos, o segundo clique rápido no `click` é mais confiável.

## 3. Correção aplicada

- Arquivo alterado: `frontend/app.js`
- Função alterada: `anamneseVincularEventos()`
- Lógica corrigida:
  - o clique simples continua selecionando a pergunta;
  - um segundo clique rápido na mesma linha detecta a intenção de edição;
  - a própria pergunta clicada é resolvida no cache e passada ao modal de alteração;
  - o `dblclick` nativo foi substituído por detecção explícita de segundo clique rápido no `click`.
- Essa é uma correção mínima porque não altera payload, endpoint, modal, cache de questionários, respostas de paciente ou backend.

## 4. O que foi preservado

- `frontend/js/modules/anamnese.js` continua passivo.
- `frontend/index.html` não recebeu alteração nova nesta etapa.
- backend não foi alterado.
- banco não foi alterado.
- endpoints não foram alterados.
- seed obrigatório não foi alterado.
- respostas de paciente não foram alteradas.
- payloads não foram alterados.

## 5. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/anamnese.js`
- `git diff --stat`
- `git status --short`

## 6. Onde testar

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar os 5 questionários.
5. Selecionar um questionário.
6. Na tabela de perguntas, clicar uma vez em uma pergunta.
7. Confirmar seleção visual.
8. Dar duplo clique na pergunta.
9. Confirmar que abre o modal `Altera pergunta de anamnese`.
10. Cancelar.
11. Repetir com outra pergunta.
12. Testar botão `Altera`.
13. Testar `Novo`, sem salvar se não for necessário.
14. Confirmar que `Elimina` não foi afetado, sem excluir se não for seguro.
15. Abrir ficha de paciente.
16. Validar fluxo de Anamnese/respostas.
17. Confirmar:
    - `window.BranaAnamneseModule.getStatus()`
    - `status` passivo
    - `ativo` false
    - `controlaFluxo` false
18. Confirmar console sem `ReferenceError` ou `TypeError` novo.

## 7. Próxima etapa

- Só retomar a Subetapa 3B depois da validação do duplo clique no navegador.
- Não avançar modularização antes desse teste.
