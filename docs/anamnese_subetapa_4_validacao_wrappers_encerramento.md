# Anamnese — Subetapa 4 — Validação conservadora dos wrappers e encerramento do mini ciclo

## Objetivo

Esta etapa valida documentalmente a alteração feita na Subetapa 3 e encerra o mini ciclo de Anamnese nesta rodada, salvo risco claro identificado na leitura.

O foco e confirmar que os wrappers locais de validacao preservam o comportamento atual sem alterar regra de negocio, mensagens, payload, salvamento ou fluxo clinico.

## Commits anteriores considerados

- `6d27d40` - `Documenta retomada de Anamnese`
- `96a1e9a` - `Documenta helpers puros de Anamnese`
- `ae967eb` - `Documenta delegacao controlada de Anamnese`
- `e2a49d3` - `Padroniza delegacao minima de validacao de Anamnese`

## Arquivos conferidos

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- `frontend/index.html`
- `docs/anamnese_subetapa_0_retomada_estado_atual.md`
- `docs/anamnese_subetapa_1_documental_helpers_puros_existentes.md`
- `docs/anamnese_subetapa_2_documental_delegacao_controlada_appjs.md`
- `docs/anamnese_subetapa_3_wrapper_minimo_delegacao_controlada.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Checks iniciais

Comandos de leitura e auditoria registrados antes da escrita:

- `git branch --show-current` -> `modularizacao-segura-fase-1`
- `git status --short` -> apenas `??` preexistentes em `docs/` e dois itens raiz untracked (`git` e `modularizacao-segura-fase-1`), sem alteracao funcional desta etapa
- `git diff --stat` -> vazio
- `git log --oneline -8` -> topo com `e2a49d3 Padroniza delegacao minima de validacao de Anamnese`
- `node --check frontend/app.js` -> sem erro
- `node --check frontend/js/modules/anamnese.js` -> sem erro

## Resultado da validação dos wrappers

Wrappers existentes e conferidos no `frontend/app.js`:

- `anamneseValidarNomeQuestionarioSeguro(nomeOriginal, nomeNormalizado)`
- `anamneseValidarTextoPerguntaSeguro(textoOriginal, textoNormalizado)`

Validação documental:

- os wrappers existem;
- estao posicionados proximo ao bloco de Anamnese e antes das funcoes que os usam;
- consultam `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`;
- consultam `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`;
- preservam `typeof helper === "function"`;
- preservam a validacao do formato do retorno;
- preservam o fallback inline;
- preservam as mensagens atuais.

## Resultado da validação de `anamneseSalvarQuestionario()`

Conferido em `frontend/app.js` em torno da linha `24433`.

Resultado:

- usa `anamneseValidarNomeQuestionarioSeguro(nomeOriginal, nome)`;
- continua lendo `anamneseCfg.modalQNome.value`;
- continua aplicando `trim()` antes da validacao;
- valida antes de montar o payload;
- valida antes de chamar `requestJson`;
- mantem o payload igual;
- mantem a chamada de API igual;
- nao altera exclusao, renderizacao, impressao, paciente ou backend.

## Resultado da validação de `anamneseSalvarPergunta()`

Conferido em `frontend/app.js` em torno da linha `24554`.

Resultado:

- usa `anamneseValidarTextoPerguntaSeguro(textoOriginal, texto)`;
- continua lendo `anamneseCfg.modalPTexto.value`;
- continua aplicando `trim()` antes da validacao;
- valida antes de montar o payload;
- valida antes de chamar `requestJson`;
- mantem o payload igual;
- mantem a chamada de API igual;
- nao altera exclusao, renderizacao, impressao, paciente ou backend.

## Confirmacao de preservacao de fallback

O fallback foi preservado nos wrappers e continua equivalente ao comportamento anterior:

- `valido: !!nome`
- `valor: nome`
- `valido: !!texto`
- `valor: texto`

O caminho auxiliar continua protegendo o fluxo caso o namespace nao esteja disponivel ou o retorno venha em formato inesperado.

## Confirmacao de preservacao de mensagens

As mensagens visiveis permanecem exatamente as mesmas:

- `Informe o nome do questionário.`
- `Informe o texto da pergunta.`

Nao houve alteracao textual, acentual ou de mojibake.

## Confirmacao de preservacao de payload

O payload nao foi alterado.

### Questionario

- continua usando `nome` e `ativo: true`;
- continua adicionando `copiar_do_questionario_id` apenas quando necessario;
- continua chamando `POST` ou `PUT` como antes.

### Pergunta

- continua usando `numero`, `tipo_pergunta`, `tipo_resposta`, `texto`, `mensagem_alerta` e `ativo: true`;
- continua chamando `POST` ou `PUT` como antes.

## Confirmacao de preservacao de requestJson

`requestJson` nao foi alterado.

Continuam iguais:

- metodo;
- rota;
- payload;
- ordem de execucao;
- fluxo de autenticacao;
- momento da chamada.

## Confirmacao de que index.html não precisa de alteração

`frontend/index.html` continua carregando `frontend/js/modules/anamnese.js` antes de `frontend/app.js`.

Conclusao:

- o namespace esta disponivel no momento do uso;
- nao e necessario alterar o HTML para suportar esta etapa.

## Confirmacao de que frontend/js/modules/anamnese.js não precisa de alteração

`frontend/js/modules/anamnese.js` continua passivo e inalterado.

O namespace `window.BranaAnamneseModule.helpers` continua sendo a fonte dos helpers e nao precisa de ajuste para esta subetapa.

## Riscos residuais

Os riscos restantes sao baixos:

- o fluxo ainda depende da disponibilidade do namespace passivo;
- Anamnese continua sensivel por envolver questionarios, perguntas, respostas, paciente e impressao;
- qualquer futura mudanca em mensagens ou regra minima precisa respeitar a blindagem textual;
- wrappers futuros nao devem ampliar escopo alem da validacao minima.

## Roteiro de teste manual

1. Fazer `Ctrl+F5` no navegador.
2. Abrir o sistema normalmente.
3. Abrir a area de configuracao/cadastro de Anamnese.
4. Abrir o modal de novo questionario.
5. Tentar salvar questionario sem nome.
6. Confirmar que aparece exatamente: `Informe o nome do questionário.`
7. Fechar/cancelar sem criar questionario real.
8. Abrir o modal de nova pergunta.
9. Tentar salvar pergunta sem texto.
10. Confirmar que aparece exatamente: `Informe o texto da pergunta.`
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

## Decisão recomendada

Decisao recomendada: **encerrar o mini ciclo de Anamnese nesta rodada**.

Justificativa:

- os wrappers foram validados e preservam a regra minima observada;
- o carregamento do namespace continua seguro;
- nao apareceu erro claro que justificasse nova etapa funcional imediata;
- seguir adiante agora aumentaria risco sem necessidade pratica.

## Próximo módulo/caminho recomendado

Proximo caminho recomendado:

- pausar Anamnese nesta rodada;
- retomar o proximo modulo conservador ja recomendado em rodadas anteriores, conforme a linha documental existente do projeto.

