# Anamnese — Subetapa 3 — Wrapper mínimo de delegação controlada

## Objetivo

Esta subetapa aplica uma mudanca funcional minima e controlada em `frontend/app.js` para centralizar a validacao de Anamnese em wrappers locais, preservando exatamente o comportamento atual.

O objetivo e evitar duplicacao da consulta direta ao namespace sem alterar regra de negocio, mensagens, payload, salvamento ou fluxo clinico.

## Arquivos alterados

- `frontend/app.js`
- `docs/anamnese_subetapa_3_wrapper_minimo_delegacao_controlada.md`

## Funcoes criadas no app.js

Wrappers locais criados no bloco de Anamnese:

- `anamneseValidarNomeQuestionarioSeguro(nomeOriginal, nomeNormalizado)`
- `anamneseValidarTextoPerguntaSeguro(textoOriginal, textoNormalizado)`

Esses wrappers:

- consultam `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`;
- consultam `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`;
- verificam `typeof helper === "function"`;
- validam o formato do retorno;
- preservam fallback inline equivalente ao atual;
- preservam as mensagens visiveis atuais;
- preservam o valor final validado.

## Funcoes existentes tocadas

### `anamneseSalvarQuestionario()`

- localizada no bloco de Anamnese em `frontend/app.js`;
- continuou lendo `anamneseCfg.modalQNome.value`;
- continuou aplicando `trim()` exatamente como antes;
- passou a chamar `anamneseValidarNomeQuestionarioSeguro(nomeOriginal, nome)` no lugar do bloco repetido de consulta direta;
- manteve a validacao antes do payload;
- manteve o payload igual;
- manteve a chamada de `requestJson` igual;
- manteve o restante do fluxo igual.

### `anamneseSalvarPergunta()`

- localizada no bloco de Anamnese em `frontend/app.js`;
- continuou lendo `anamneseCfg.modalPTexto.value`;
- continuou aplicando `trim()` exatamente como antes;
- passou a chamar `anamneseValidarTextoPerguntaSeguro(textoOriginal, texto)` no lugar do bloco repetido de consulta direta;
- manteve a validacao antes do payload;
- manteve o payload igual;
- manteve a chamada de `requestJson` igual;
- manteve o restante do fluxo igual.

## Confirmacao de fallback preservado

O fallback foi preservado nos wrappers locais com a mesma regra minima observada antes:

- `valido: !!nome`
- `valor: nome`
- `valido: !!texto`
- `valor: texto`

O wrapper continua retornando a mensagem atual quando o valor aparado fica vazio.

## Confirmacao de mensagens preservadas

As mensagens visiveis permanecem exatamente as mesmas:

- `Informe o nome do questionário.`
- `Informe o texto da pergunta.`

Nenhuma correção textual, de acento ou de mojibake foi feita.

## Confirmacao de payload preservado

O payload nao foi alterado.

### Questionario

- continua usando `nome` e `ativo: true`;
- continua adicionando `copiar_do_questionario_id` apenas quando aplicavel;
- continua chamando `POST` ou `PUT` exatamente como antes.

### Pergunta

- continua usando `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta` e `ativo: true`;
- continua chamando `POST` ou `PUT` exatamente como antes.

## Confirmacao de requestJson preservado

`requestJson` nao foi alterado.

Continuam iguais:

- metodo;
- rota;
- payload;
- parametro de autenticacao no fluxo;
- ordem de chamada.

## Confirmacao de backend, banco e endpoints

- backend nao foi alterado;
- banco nao foi alterado;
- schema nao foi alterado;
- migrations nao foram alteradas;
- endpoints nao foram alterados.

## Confirmacao de index.html

`frontend/index.html` nao foi alterado.

Ele continua carregando `frontend/js/modules/anamnese.js` antes de `frontend/app.js`, o que mantem o namespace passivo disponivel no momento do uso.

## Confirmacao de frontend/js/modules/anamnese.js

`frontend/js/modules/anamnese.js` nao foi alterado.

O namespace `window.BranaAnamneseModule.helpers` continua sendo a fonte passiva dos helpers.

## Riscos residuais

Os riscos residuais continuam baixos, mas nao nulos:

- o wrapper adiciona uma camada minima entre o `app.js` e o namespace passivo;
- o fluxo ainda depende de `window.BranaAnamneseModule` estar disponivel;
- qualquer futura mudanca de mensagem ou regra minima precisaria respeitar a blindagem textual;
- Anamnese continua sensivel por envolver questionarios, perguntas, respostas, paciente e impressao.

## Onde testar no sistema

1. Fazer `Ctrl+F5`.
2. Abrir o sistema normalmente.
3. Abrir a area de configuracao/cadastro de Anamnese.
4. Abrir o modal de novo questionario.
5. Tentar salvar questionario sem nome.
6. Confirmar que a mesma mensagem anterior aparece: `Informe o nome do questionário.`
7. Fechar/cancelar sem criar questionario real.
8. Abrir o modal de nova pergunta.
9. Tentar salvar pergunta sem texto.
10. Confirmar que a mesma mensagem anterior aparece: `Informe o texto da pergunta.`
11. Fechar/cancelar sem criar pergunta real.
12. Confirmar que a tela de Anamnese abre normalmente.
13. Confirmar que listas e botoes continuam aparecendo.
14. Verificar o console do navegador.
15. Nao criar questionario real.
16. Nao criar pergunta real.
17. Nao excluir nada.
18. Nao importar nada.
19. Nao imprimir nada.
20. Nao alterar paciente.

## Proxima etapa recomendada

Proxima etapa recomendada:

- `Anamnese — Subetapa 4 — validacao conservadora dos wrappers e encerramento do mini ciclo`

Se a validacao manual confirmar comportamento identico, o ciclo pode ser encerrado documentalmente e pausado antes de qualquer extracao adicional.

