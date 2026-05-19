# Anamnese — Subetapa 2 — Análise documental do ponto de delegação controlada no app.js

## Objetivo

Esta etapa documenta o ponto exato em que `frontend/app.js` consulta os helpers puros do modulo passivo de Anamnese.

O foco e avaliar se existe uma fronteira segura para delegacao controlada futura, sem alterar comportamento, mensagens, payload, salvamento ou fluxo clinico.

## Escopo

Permitido nesta etapa:

- ler arquivos do projeto Brana Cloud;
- consultar documentos anteriores em `docs/`;
- consultar `frontend/app.js`;
- consultar `frontend/js/modules/anamnese.js`;
- consultar `frontend/index.html`;
- criar este documento novo em `docs/`;
- fazer comandos de leitura e auditoria;
- fazer commit e push apenas se este for o unico arquivo criado/modificado.

Proibido nesta etapa:

- alterar codigo funcional;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules/anamnese.js`;
- criar novo modulo JS;
- mover comportamento real;
- alterar chamadas existentes;
- remover fallback inline;
- alterar regra de validacao;
- alterar mensagens de alerta;
- alterar strings visiveis;
- alterar payload;
- alterar salvamento;
- alterar exclusao;
- alterar questionarios, perguntas ou respostas;
- alterar pacientes;
- alterar ficha clinica;
- alterar impressao;
- alterar importacao;
- alterar EDS70;
- alterar EasyDental;
- alterar editor de textos;
- alterar prescricoes;
- alterar receitas;
- alterar medicamentos;
- alterar materiais;
- alterar custos;
- alterar reajustes;
- alterar backend, banco, schema, migrations ou endpoints;
- corrigir texto, acentos, labels, mensagens, placeholders, strings visiveis ou mojibake.

## Checks iniciais

Comandos de leitura e validacao registrados antes da escrita:

- `git branch --show-current` -> `modularizacao-segura-fase-1`
- `git status --short` -> havia apenas `??` preexistentes em `docs/` e dois itens raiz untracked (`git` e `modularizacao-segura-fase-1`), sem alteracao funcional desta etapa
- `git diff --stat` -> vazio
- `git log --oneline -6` -> topo com `96a1e9a Documenta helpers puros de Anamnese`
- `node --check frontend/app.js` -> sem erro
- `node --check frontend/js/modules/anamnese.js` -> sem erro

## Fontes consultadas

Documentos de contexto analisados:

- `docs/anamnese_subetapa_0_retomada_estado_atual.md`
- `docs/anamnese_subetapa_1_documental_helpers_puros_existentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Arquivos consultados obrigatoriamente:

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- `frontend/index.html`

## Resumo executivo

O `app.js` ja usa os dois helpers do namespace passivo:

- `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`
- `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`

Esse uso ocorre dentro dos fluxos de salvamento de questionario e pergunta, com fallback inline preservado.

Conclusao curta:

- existe um ponto real de delegacao controlada;
- o namespace esta carregado antes do `app.js`;
- o formato do namespace e estavel o bastante para uso controlado;
- a etapa futura, se houver, deve apenas padronizar a delegacao, sem mudar regra de negocio;
- o fallback deve ser preservado obrigatoriamente.

## Função: `anamneseSalvarQuestionario()`

### Onde esta localizada no app.js

- `frontend/app.js:24433` em diante.

### Qual helper do modulo passivo ela consulta

- consulta `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`.

### Como a consulta ao helper e feita

- guarda o retorno em `const helper`;
- verifica `typeof helper === "function"`;
- chama `helper(nomeOriginal)`;
- valida o formato do retorno antes de confiar no resultado.

### Qual e o fallback inline existente

- se o helper nao existir ou nao retornar no formato esperado, o fluxo cai para:
  - `valido: !!nome`
  - `mensagem: nome ? "" : "Informe o nome do questionÃ¡rio."`
  - `valor: nome`
- antes disso, o proprio fluxo ja faz `nome = String(nomeOriginal || "").trim();`.

### Se o fallback inline replica exatamente a regra minima do helper

- funcionalmente, sim, para o caso de obrigatoriedade minima do nome.
- o helper faz `String(...).trim()` no valor original e devolve `valor` aparado.
- o fallback usa o `nome` ja aparado pelo fluxo antes da validacao.
- portanto, a regra minima efetiva coincide para este caminho.

### Se existe risco de diferenca entre helper e fallback

- risco baixo, mas nao zero.
- a diferenca teorica e que o helper recebe o valor bruto, enquanto o fallback opera sobre o valor ja aparado no fluxo.
- na pratica, o comportamento observado converge para a mesma regra minima.

### Se existe alteracao de mensagem visivel associada a validacao

- nao ha alteracao visivel prevista nesta etapa.
- a mensagem de erro continua a mesma no fallback e no helper.
- nao ha autorizacao para trocar texto nesta subetapa.

### Se a validacao acontece antes ou depois de montar payload

- antes de montar o payload.
- `nome` e validado primeiro, depois o payload e montado.

### Se a validacao acontece antes ou depois de chamar API/requestJson

- antes de chamar `requestJson`.
- o fluxo valida, monta o payload e so depois chama `requestJson`.

### Se a validacao interfere em DOM

- nao interfere em DOM por si so.
- ela le do DOM via `anamneseCfg.modalQNome.value`, mas a validacao em si e local.

### Se a validacao interfere em cache global

- nao altera cache global.

### Se a validacao interfere em paciente

- nao interfere diretamente em paciente.

### Se a validacao interfere em questionario/pergunta/resposta

- sim, indiretamente no contexto do questionario, porque bloqueia salvamento de questionario vazio.
- nao altera pergunta, resposta ou paciente por si so.

### Se a validacao interfere em impressao

- nao interfere em impressao.

### Se ha risco de backend/banco/endpoints

- nao ha risco direto de backend/banco/endpoints a partir da validacao isolada.
- o risco estaria apenas se a regra fosse alterada e passasse a enviar payload diferente, o que nao acontece nesta etapa.

### Se ha risco de alteracao textual/mojibake

- o texto da mensagem continua com mojibake no arquivo atual.
- nesta etapa nao houve correcao.
- o risco documental existe apenas se alguem tentar "normalizar" a mensagem sem autorizacao.

### Se ha risco de regressao funcional

- baixo, porque a etapa atual e apenas documental.
- para o sistema em si, o fluxo de salvamento continua dependente de fallback e do helper passivo.

### Se uma etapa futura poderia apenas padronizar a delegacao sem alterar comportamento

- sim.
- seria possivel criar um wrapper minimo no `app.js` para centralizar a chamada ao helper, mantendo o fallback e a mesma mensagem.

### Se uma etapa futura deveria preservar obrigatoriamente o fallback

- sim, obrigatoriamente.
- o fallback e a rede de seguranca para o caso de o namespace nao estar disponivel ou retornar algo inesperado.

### Se uma etapa futura deveria ou nao mexer em mensagens visiveis

- nao deveria mexer em mensagens visiveis.
- qualquer ajuste de texto seria uma etapa propria e bloqueada pela blindagem textual.

## Função: `anamneseSalvarPergunta()`

### Onde esta localizada no app.js

- `frontend/app.js:24519` em diante.

### Qual helper do modulo passivo ela consulta

- consulta `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`.

### Como a consulta ao helper e feita

- guarda o retorno em `const helper`;
- verifica `typeof helper === "function"`;
- chama `helper(textoOriginal)`;
- valida o formato do retorno antes de confiar no resultado.

### Qual e o fallback inline existente

- se o helper nao existir ou nao retornar no formato esperado, o fluxo cai para:
  - `valido: !!texto`
  - `mensagem: texto ? "" : "Informe o texto da pergunta."`
  - `valor: texto`
- antes disso, o fluxo ja faz `texto = String(textoOriginal || "").trim();`.

### Se o fallback inline replica exatamente a regra minima do helper

- funcionalmente, sim, para a obrigatoriedade minima do texto da pergunta.
- o helper aparada o valor original e devolve `valor` limpo.
- o fallback usa o `texto` ja aparado pelo proprio fluxo.
- para a validacao minima observada, os dois caminhos convergem.

### Se existe risco de diferenca entre helper e fallback

- risco baixo, com a mesma ressalva: helper recebe valor bruto, fallback recebe valor ja aparado pelo fluxo.
- a regra minima observada permanece a mesma.

### Se existe alteracao de mensagem visivel associada a validacao

- nao ha alteracao visivel prevista nesta etapa.
- a mensagem continua sendo a mesma no caminho helper e no fallback.

### Se a validacao acontece antes ou depois de montar payload

- antes de montar o payload.
- o texto e validado antes de construir o objeto enviado.

### Se a validacao acontece antes ou depois de chamar API/requestJson

- antes de chamar `requestJson`.
- o fluxo valida primeiro e so entao monta o payload e chama a API.

### Se a validacao interfere em DOM

- nao interfere em DOM por si so.
- apenas le o valor do textarea via `anamneseCfg.modalPTexto.value`.

### Se a validacao interfere em cache global

- nao altera cache global.

### Se a validacao interfere em paciente

- nao interfere diretamente em paciente.

### Se a validacao interfere em questionario/pergunta/resposta

- sim, indiretamente no fluxo de pergunta, porque bloqueia salvamento de pergunta vazia.
- nao altera resposta, paciente ou questionario diretamente.

### Se a validacao interfere em impressao

- nao interfere em impressao.

### Se ha risco de backend/banco/endpoints

- nao ha risco direto de backend/banco/endpoints a partir da validacao isolada.

### Se ha risco de alteracao textual/mojibake

- o texto da mensagem continua com mojibake no arquivo atual.
- nao houve correcao.

### Se ha risco de regressao funcional

- baixo neste momento, porque nao houve alteracao de codigo.
- a continuidade do fluxo ainda depende de fallback e do helper passivo.

### Se uma etapa futura poderia apenas padronizar a delegacao sem alterar comportamento

- sim.
- um wrapper minimo pode centralizar a chamada ao helper e manter o mesmo resultado.

### Se uma etapa futura deveria preservar obrigatoriamente o fallback

- sim, obrigatoriamente.

### Se uma etapa futura deveria ou nao mexer em mensagens visiveis

- nao deveria mexer em mensagens visiveis.

## Estado do namespace e risco de disponibilidade

### Se o index.html carrega o modulo de Anamnese antes do app.js

- sim.
- `frontend/index.html` carrega `frontend/js/modules/anamnese.js` na linha `3928` e `frontend/app.js` depois, na linha `3934`.

### Se ha risco de o namespace nao estar disponivel no momento do uso

- risco baixo, porque o script do modulo vem antes do `app.js`.
- ainda assim, o fallback inline existe exatamente para cobrir ausencia do namespace, falha de script ou retorno inesperado.

### Se o namespace tem formato estavel suficiente para uso controlado

- sim.
- o namespace esta em `window.BranaAnamneseModule`, com `helpers` imutaveis/frozen e API pequena.

### Se os helpers estao em `window.BranaAnamneseModule.helpers`

- sim.
- isso foi confirmado na etapa anterior e tambem no arquivo passivo atual.

### Se ha algum outro ponto no app.js chamando esses helpers

- nao.
- a busca documental encontrou apenas:
  - `anamneseSalvarQuestionario()`
  - `anamneseSalvarPergunta()`

### Se ha validacoes similares em outros fluxos de Anamnese

- sim, no proprio fluxo de salvar ha fallback inline equivalente.
- fora disso, o resto do modulo continua com validacoes de modal, selecao e pergunta/questionario, mas nao com esses helpers especificamente.

## Menor proximo passo funcional possivel

Se houver etapa futura autorizada, o menor passo funcional possivel seria:

- criar um wrapper minimo no `app.js` para centralizar a consulta ao helper do namespace;
- manter o fallback inline exatamente como esta;
- nao alterar payload, salvamento, API ou mensagens visiveis;
- nao mexer em DOM, selecao, paciente, pergunta, resposta ou impressao.

## Alteracao funcional que deve continuar proibida

Continuam proibidas:

- remoção do fallback;
- alteracao da regra minima de obrigatoriedade;
- mudanca nas mensagens visiveis;
- mudanca de payload;
- mudanca de salvamento;
- mudanca de endpoint;
- mudanca de fluxo de paciente;
- mudanca de pergunta/resposta;
- mudanca de impressao;
- qualquer extracao funcional ampla antes de nova analise.

## Decisao recomendada

Decisao recomendada: **avancar para Subetapa 3 funcional minima de padronizacao/delegacao controlada, apenas se o objetivo for criar wrapper minimo sem alterar comportamento; caso contrario, pausar Anamnese e manter a trilha documental.**

Justificativa:

- existe um ponto claro de delegacao;
- o namespace passivo ja esta carregado antes do `app.js`;
- os helpers sao pequenos e puros;
- o `app.js` ja usa os helpers com fallback;
- a padronizacao futura pode ser feita sem mudar regra de negocio.

## Proxima etapa recomendada

Proxima etapa recomendada:

- `Anamnese — Subetapa 3 — wrapper minimo de delegacao controlada no app.js`

Essa seria a menor evolucao funcional possivel, se e somente se o objetivo for padronizar a chamada dos helpers mantendo fallback e comportamento.

## Roteiro de teste futuro

Como esta etapa e documental, nao ha teste funcional obrigatorio no navegador agora.

Se houver wrapper futuro, o roteiro conservador deve ser:

1. `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir Anamnese.
4. Tentar salvar questionario vazio e confirmar a mesma mensagem.
5. Tentar salvar pergunta vazia e confirmar a mesma mensagem.
6. Confirmar que o fallback continua presente.
7. Confirmar console sem `ReferenceError` ou `TypeError`.
