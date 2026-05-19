# Anamnese — Subetapa 1 — Análise documental dos helpers puros existentes

## Objetivo

Esta etapa documenta, de forma conservadora, os helpers puros ja existentes no modulo passivo de Anamnese.

O foco e confirmar o que eles fazem hoje, como sao usados no `app.js`, e se permanecem seguros como helpers passivos antes de qualquer delegacao funcional futura.

## Escopo

Permitido nesta etapa:

- ler arquivos do projeto Brana Cloud;
- consultar documentos anteriores em `docs/`;
- consultar `frontend/js/modules/anamnese.js`;
- consultar `frontend/index.html`;
- consultar `frontend/app.js`;
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
- `git log --oneline -6` -> topo com `6d27d40 Documenta retomada de Anamnese`
- `node --check frontend/app.js` -> sem erro
- `node --check frontend/js/modules/anamnese.js` -> sem erro

## Fontes consultadas

Documentos de contexto analisados:

- `docs/anamnese_subetapa_0_retomada_estado_atual.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/anamnese_auditoria_legado_desktop_id1.md`
- `docs/anamnese_auditoria_legado_id1.md`
- `docs/auditoria_especifica_pendencias_anamnese.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `docs/anamnese_dry_run_importacao_eds70_gleisson.md`
- `docs/anamnese_dry_run_plano_questionarios_eds70.json`
- `docs/anamnese_dry_run_plano_perguntas_eds70.json`
- `docs/anamnese_dry_run_resumo_eds70.txt`
- `docs/anamnese_dry_run_sql_preview_eds70.sql`
- `docs/anamnese_importacao_eds70_gleisson_resultado.md`
- `docs/anamnese_extracao_eds70_sqlserver_resultado.md`
- `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`
- `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`

## Resumo executivo

Os dois helpers analisados sao pequenos, deterministas e passivos:

- `anamneseValidarNomeQuestionario`
- `anamneseValidarTextoPergunta`

Eles vivem em `frontend/js/modules/anamnese.js`, sao expostos em `window.BranaAnamneseModule.helpers` e ja sao consultados pelo `frontend/app.js` nos fluxos de salvar questionario e salvar pergunta.

Conclusao curta:

- podem permanecer como helpers passivos;
- podem ser reutilizados futuramente por wrappers no `app.js`;
- nao devem receber delegacao funcional mais ampla agora;
- nao ha justificativa para mover comportamento de tela, payload ou persistencia nesta subetapa.

## Helper 1: `anamneseValidarNomeQuestionario`

### Onde esta definido

- `frontend/js/modules/anamnese.js`
- assinatura observada no arquivo: `function anamneseValidarNomeQuestionario(nome) { ... }`

### Exposicao no namespace

- sim, esta exposto em `window.BranaAnamneseModule.helpers.anamneseValidarNomeQuestionario`

### Assinatura observada

- entrada: `nome`
- saida: objeto com `valido`, `mensagem` e `valor`

### Entradas esperadas

- qualquer valor que possa representar o nome do questionario
- o helper converte para string e aplica `trim()`

### Saida esperada

- se o valor final ficar vazio: `valido: false`, `mensagem: "Informe o nome do questionÃ¡rio."`, `valor: ""`
- se houver texto: `valido: true`, `mensagem: ""`, `valor` aparado

### Determinismo

- sim, e deterministico
- a mesma entrada produz a mesma saida

### Uso de DOM

- nao usa DOM

### Uso de requestJson/fetch/API

- nao usa requestJson, fetch nem API

### Uso de cache global

- nao usa cache global

### Alteracao de estado global

- nao altera estado global

### Alteracao de paciente

- nao altera paciente

### Alteracao de questionario

- nao altera questionario

### Alteracao de pergunta

- nao altera pergunta

### Alteracao de resposta

- nao altera resposta

### Alteracao de payload

- nao altera payload

### Alteracao de salvamento

- nao altera salvamento

### Alteracao de banco, backend ou endpoints

- nao altera banco, backend ou endpoints

### Dependencia de ordem de perguntas

- nao depende de ordem de perguntas

### Dependencia de importacao, EDS70 ou EasyDental

- nao depende de importacao, EDS70 ou EasyDental

### Risco textual / mojibake

- existe risco textual apenas no conteudo da mensagem de validacao, porque a string visivel no modulo ainda esta com mojibake no arquivo atual
- nesta etapa nao houve correcao
- o risco e documental, nao funcional

### Pode permanecer como helper passivo

- sim
- e o melhor estado atual para ele

### Pode ser usado futuramente por wrappers no app.js

- sim
- e um bom candidato para wrappers de validacao no `app.js` sem mudar regra de negocio

### Deve ou nao receber delegacao funcional futura

- deve receber apenas delegacao funcional minima e controlada, se houver etapa futura autorizada
- nao deve virar ponto de controle amplo do fluxo

## Helper 2: `anamneseValidarTextoPergunta`

### Onde esta definido

- `frontend/js/modules/anamnese.js`
- assinatura observada no arquivo: `function anamneseValidarTextoPergunta(texto) { ... }`

### Exposicao no namespace

- sim, esta exposto em `window.BranaAnamneseModule.helpers.anamneseValidarTextoPergunta`

### Assinatura observada

- entrada: `texto`
- saida: objeto com `valido`, `mensagem` e `valor`

### Entradas esperadas

- qualquer valor que possa representar o texto da pergunta
- o helper converte para string e aplica `trim()`

### Saida esperada

- se o valor final ficar vazio: `valido: false`, `mensagem: "Informe o texto da pergunta."`, `valor: ""`
- se houver texto: `valido: true`, `mensagem: ""`, `valor` aparado

### Determinismo

- sim, e deterministico

### Uso de DOM

- nao usa DOM

### Uso de requestJson/fetch/API

- nao usa requestJson, fetch nem API

### Uso de cache global

- nao usa cache global

### Alteracao de estado global

- nao altera estado global

### Alteracao de paciente

- nao altera paciente

### Alteracao de questionario

- nao altera questionario

### Alteracao de pergunta

- nao altera pergunta

### Alteracao de resposta

- nao altera resposta

### Alteracao de payload

- nao altera payload

### Alteracao de salvamento

- nao altera salvamento

### Alteracao de banco, backend ou endpoints

- nao altera banco, backend ou endpoints

### Dependencia de ordem de perguntas

- nao depende de ordem de perguntas

### Dependencia de importacao, EDS70 ou EasyDental

- nao depende de importacao, EDS70 ou EasyDental

### Risco textual / mojibake

- a mensagem visivel do helper eh simples e nao apresenta alteracao funcional nesta etapa
- qualquer correcao textual futura deve respeitar a blindagem documental e nao pode ser embutida aqui

### Pode permanecer como helper passivo

- sim
- e seguro mantê-lo passivo neste momento

### Pode ser usado futuramente por wrappers no app.js

- sim
- e bom candidato para wrapper de validacao local no `app.js`

### Deve ou nao receber delegacao funcional futura

- deve receber apenas delegacao funcional minima e controlada, se houver etapa futura autorizada
- nao deve abrir delegacao para fluxo, DOM ou persistencia

## Como o app.js usa esses helpers hoje

O `frontend/app.js` ja chama os dois helpers diretamente via namespace passivo, dentro dos fluxos de salvamento:

- `anamneseSalvarQuestionario()` consulta `window.BranaAnamneseModule?.helpers?.anamneseValidarNomeQuestionario`
- `anamneseSalvarPergunta()` consulta `window.BranaAnamneseModule?.helpers?.anamneseValidarTextoPergunta`

Isso significa:

- o app.js ja delega a validacao textual minima para o modulo passivo;
- ainda existe fallback inline dentro do proprio `app.js`;
- os helpers nao substituem o fluxo principal, apenas alimentam a validacao local.

## Funcoes equivalentes ou duplicadas no app.js

Nao foi encontrada uma funcao global equivalente com nome identico no `app.js`.

Mas existe validacao inline similar dentro dos fluxos de salvar:

- em `anamneseSalvarQuestionario()`, ha fallback que valida `nome` com `trim()` e gera a mesma mensagem de erro quando vazio;
- em `anamneseSalvarPergunta()`, ha fallback que valida `texto` com `trim()` e gera a mesma mensagem de erro quando vazio.

Conclusao:

- nao ha duplicacao estrutural completa;
- ha duplicacao parcial de regra minima de obrigatoriedade;
- os helpers do modulo passivo ja reduzem essa duplicacao, mas o fallback continua no monolito.

## Validacoes similares embutidas nos fluxos de salvar

### Salvar questionario

O fluxo de `anamneseSalvarQuestionario()`:

- tenta usar o helper do namespace passivo;
- se o helper falhar ou nao estiver disponivel, faz validacao inline;
- mantem a mesma mensagem visivel de obrigatoriedade;
- depois monta payload com `nome` e `ativo: true`;
- eventualmente adiciona `copiar_do_questionario_id`.

### Salvar pergunta

O fluxo de `anamneseSalvarPergunta()`:

- tenta usar o helper do namespace passivo;
- se o helper falhar ou nao estiver disponivel, faz validacao inline;
- mantem a mesma mensagem visivel de obrigatoriedade;
- depois monta payload com `numero`, `tipo_pergunta`, `tipo_resposta`, `texto` e `mensagem_alerta`.

Conclusao:

- os helpers sao usados como fonte preferencial de validacao, mas nao como unica fonte de verdade;
- o app.js preserva fallback local para nao quebrar o fluxo.

## Menor proximo passo funcional possivel

Se houver etapa futura autorizada, o menor passo funcional possivel seria:

- manter os helpers passivos como estao;
- criar wrappers muito pequenos no `app.js` para centralizar o acesso aos helpers do namespace;
- preservar o fallback inline atual;
- nao alterar mensagens visiveis;
- nao alterar payload;
- nao alterar salvamento;
- nao alterar DOM, eventos ou APIs.

Esse passo ainda seria minimo porque:

- nao mudaria regra de negocio;
- nao mudaria contrato externo;
- apenas reduziria repeticao de acesso ao namespace.

## Riscos que impedem avanco funcional imediato

Os principais bloqueios para um avanco funcional maior agora sao:

- o fluxo de Anamnese ainda depende de DOM, modal, cache, selecao e API;
- o `app.js` continua sendo a fonte funcional da verdade;
- a parte de pergunta e questionario ainda centraliza payload e salvamento;
- a ficha do paciente continua acoplada a paciente atual e impressao;
- a ordem das perguntas e a renumeracao seguem sensiveis;
- qualquer erro aqui pode impactar dados clinicos e historico sem sintoma visual imediato.

Conclusao:

- nao ha base para extracao funcional ampla;
- a etapa atual deve continuar documental ou, no maximo, de delegacao minima muito controlada.

## Decisao recomendada

Decisao recomendada: **avancar para uma subetapa funcional minima de delegacao controlada, somente se o objetivo for wrapper local sem alterar regra de negocio; caso contrario, manter Anamnese em pausa funcional e seguir documentalmente.**

Justificativa:

- os dois helpers sao realmente puros e ja estao expostos no namespace passivo;
- o `app.js` ja os usa com fallback;
- existe, portanto, uma fronteira segura para wrappers futuros;
- por outro lado, o restante do modulo segue muito sensivel para uma extracao funcional mais ampla.

## Proxima etapa recomendada

Proxima etapa recomendada:

- `Anamnese — Subetapa 2 — analise documental do ponto de delegacao controlada no app.js`

Motivo:

- antes de qualquer wrapper ou delegacao maior, e melhor documentar exatamente onde o `app.js` consulta os helpers, quais fallbacks existem e qual o impacto de centralizar esse acesso;
- isso reduz risco de mexer em salvamento ou em mensagens visiveis sem necessidade.

## Roteiro de teste futuro

Como esta etapa e documental, nao ha teste funcional obrigatorio no navegador agora.

Se uma etapa futura introduzir wrappers no `app.js`, o roteiro conservador deve ser:

1. `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir Anamnese.
4. Abrir questionarios sem salvar.
5. Abrir pergunta sem salvar.
6. Salvar apenas em ambiente de teste, se autorizado.
7. Confirmar que as mensagens visiveis permanecem inalteradas.
8. Confirmar console sem `ReferenceError` ou `TypeError`.

