# Anamnese — Subetapa 0 — Retomada documental e estado atual

## Objetivo

Esta e uma retomada documental do modulo Anamnese para mapear o estado atual antes de qualquer alteracao funcional.

Nesta etapa nao ha alteracao de comportamento, nao ha movimento de codigo e nao ha mudanca em banco, schema, payload, salvamento, backend ou HTML funcional.

## Escopo

Permitido:

- ler arquivos do projeto Brana Cloud;
- consultar documentos anteriores em `docs/`;
- consultar `frontend/app.js`;
- consultar `frontend/index.html`;
- consultar `frontend/js/modules` apenas para leitura;
- criar este documento novo em `docs/`.

Proibido:

- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar qualquer arquivo em `frontend/js/modules`;
- criar novo modulo JS;
- mover funcao;
- copiar logica para modulo;
- alterar chamada existente;
- alterar namespace;
- alterar ordem de scripts;
- alterar HTML funcional;
- alterar CSS;
- alterar payload;
- alterar salvamento;
- alterar exclusao;
- alterar importacao;
- alterar questionarios, perguntas ou respostas;
- alterar pacientes;
- alterar editor de textos;
- alterar impressao;
- alterar prescricoes, receitas, medicamentos, materiais, custos ou reajustes;
- alterar backend, banco, schema, migrations ou endpoints;
- corrigir texto, acento, label, placeholder, mensagem, string visivel ou mojibake.

## Checks iniciais

Comandos de leitura e validacao executados nesta retomada:

- `git branch --show-current` -> `modularizacao-segura-fase-1`
- `git status --short` -> apenas pendencias `??` preexistentes em `docs/` e dois itens raiz untracked (`git` e `modularizacao-segura-fase-1`), sem alteracao rastreada funcional nesta etapa
- `git log --oneline -6` -> topo com `2b18273 Reavalia Medicamentos e recomenda proximo modulo`
- `git diff --stat` -> vazio
- `node --check frontend/app.js` -> sem erro

## Documentos anteriores encontrados

| Categoria | Documentos encontrados | Papel documental |
|---|---|---|
| Auditoria | `docs/anamnese_auditoria_legado_desktop_id1.md`, `docs/anamnese_auditoria_legado_id1.md`, `docs/auditoria_especifica_pendencias_anamnese.md`, `docs/revisao_humana_md_anamnese_pendentes.md` | Inventario de legado, pendencias e revisao humana do estado de Anamnese. |
| Importacao / EDS70 | `docs/anamnese_dry_run_importacao_eds70_gleisson.md`, `docs/anamnese_importacao_eds70_gleisson_resultado.md`, `docs/anamnese_extracao_eds70_sqlserver_resultado.md`, `docs/anamnese_investigacao_clinica_tenant_fonte_dados.md`, `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`, `docs/anamnese_roteiro_extracao_eds70_sqlserver.md`, `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md` | Planejamento, extracao, recuperacao e validacao do seed/importacao EDS70. |
| Dry-run | `docs/anamnese_dry_run_plano_questionarios_eds70.json`, `docs/anamnese_dry_run_plano_perguntas_eds70.json`, `docs/anamnese_dry_run_resumo_eds70.txt`, `docs/anamnese_dry_run_sql_preview_eds70.sql` | Previa de importacao e de SQL para questionarios, perguntas e respostas. |
| Legado | `docs/anamnese_legado_bancos_sqlite_id1.txt`, `docs/anamnese_legado_busca_textual_id1.txt`, `docs/anamnese_legado_dumps_sql_id1.txt`, `docs/anamnese_legado_extraido_perguntas_id1.csv`, `docs/anamnese_legado_extraido_questionarios_id1.csv`, `docs/anamnese_legado_extraido_respostas_id1.csv`, `docs/anamnese_legado_inventario_fontes_id1.txt`, `docs/anamnese_legado_zips_id1.txt` | Inventario do legado e extracoes de questionarios, perguntas e respostas. |
| SQL preview / descoberta | `docs/anamnese_eds70_busca_strings.txt`, `docs/anamnese_eds70_descoberta_colunas.txt`, `docs/anamnese_eds70_descoberta_tabelas.txt`, `docs/anamnese_eds70_mapeamento_tabelas.txt`, `docs/anamnese_eds70_restore_filelistonly.txt`, `docs/sqlserver_anamnese_descoberta_eds70.sql`, `docs/sqlserver_restore_eds70_anamnese_readonly.sql` | Descoberta de estrutura e consulta readonly de restauracao. |
| Seeds e candidatos | `docs/anamnese_seed_auditoria_clinicas_existentes.csv`, `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv`, `docs/anamnese_seed_candidato_perguntas.csv`, `docs/anamnese_seed_candidato_questionarios.csv`, `docs/anamnese_seed_obrigatorio_plano.md`, `docs/anamnese_seed_obrigatorio_plano_por_clinica.json`, `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt`, `docs/anamnese_seed_obrigatorio_implementacao_resultado.md` | Base documental do seed obrigatorio e dos candidatos de dados. |
| Recomendacoes / varreduras | `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`, `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`, `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`, `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`, `docs/recomendacao_proximo_modulo_pos_prestadores.md`, `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md` | Linha de decisao para priorizacao de modulos e risco comparado. |

Documento procurado e nao encontrado no tree atual:

- `docs/recomendacao_proximo_modulo_pos_medicamentos.md`

## Estado atual do modulo JS

O arquivo `frontend/js/modules/anamnese.js` existe.

Estado documental do modulo:

- namespace: `window.BranaAnamneseModule`;
- nome interno: `BranaAnamneseModule`;
- versao: `subetapa-3b-helper-validar-texto-pergunta`;
- meta: `name`, `version`, `description`, `createdAt`;
- status: `passivo`;
- `ativo: false`;
- `controlaFluxo: false`;
- helpers expostos: `anamneseValidarNomeQuestionario`, `anamneseValidarTextoPergunta`;
- helpers candidatos futuros listados: normalizacao, validacao, ordenacao e rotulo de status;
- riscos conhecidos listados: bloco legado, fluxo API-driven, ficha do paciente, renumeracao, modais, exclusao e cache;
- endpoints mapeados no namespace: `/anamnese/questionarios`, `/anamnese/questionarios/{id}/perguntas`, `/anamnese/respostas`;
- o modulo nao usa DOM, nao usa `requestJson`, nao renderiza, nao salva, nao exclui e nao controla fluxo funcional.

## Estado atual do carregamento no index.html

O `frontend/index.html` carrega o modulo em:

- `frontend/index.html:3928` -> `<script src="/frontend/js/modules/anamnese.js"></script>`

Tambem ha itens visiveis relacionados a Anamnese no menu:

- `frontend/index.html:2549` -> `data-menu-action="cadastro-ficha-anamnese"`
- `frontend/index.html:2640` -> `data-menu-action="config-anamnese"`

Conclusao:

- existe carga de script de Anamnese;
- existe acao de menu para ficha de anamnese;
- existe acao de menu para configuracao de anamnese;
- nao foi encontrada neste HTML uma rota nova dedicada que altere o fluxo funcional.

## Estado atual no frontend/app.js

O arquivo `frontend/app.js` contem dois blocos de Anamnese:

- um bloco legado/local mais antigo em torno de `11423-11428`, que monta a UI e chama `anamneseCarregarLocal()`;
- um bloco ativo API-driven mais abaixo, em torno de `24330-24683`, que usa `requestJson` e governa o fluxo atual;
- o bloco posterior e o que governa o runtime por declaracao tardia das funcoes.

### Funcoes do bloco legado/local

| Funcao | Classe documental | Observacao |
|---|---|---|
| `anamneseEnsureUI` | abertura/tela e DOM setup | Cria estilo, monta painel e prepara a tela. Nao e candidata a extracao agora. |
| `anamneseRender` | renderizacao | Desenha a grade local de perguntas. Nao e pura por depender de cache global e DOM. |
| `anamneseSelecionado` | selecao | Leitura de item selecionado via cache global. Nao e pura pelo criterio estrito. |
| `anamneseCarregarLocal` | carregamento local / fallback historico | Popula a lista fixa de `Principal` e define selecao. E historica e sensivel a regressao de dados. |
| `anamneseVincularEventos` | eventos | Liga clique, duplo clique e botoes. Nao deve ser movida agora. |
| `anamneseAbrir` | abertura/tela | Abre o painel, vincula eventos e carrega o conjunto local. |

### Funcoes do bloco ativo API-driven

| Funcao | Classe documental | Observacao |
|---|---|---|
| `anamneseQuestionarioSelecionado` | selecao | Leitura do questionario atual via cache global. Depende de estado e nao e pura no criterio estrito. |
| `anamneseRenderComboCopiarQuestionario` | renderizacao / modal | Preenche o combo de copia no modal de questionario. |
| `anamneseAtualizarEstadoCopiarQuestionario` | modal / estado sensivel | Habilita ou desabilita controles do modal conforme edicao/copia/base. |
| `anamneseRenderQuestionarios` | renderizacao / carregamento visual | Popula o select de questionarios e sincroniza selecao. |
| `anamneseCarregarQuestionarios` | carregamento API | Faz `GET /anamnese/questionarios`. |
| `anamneseCarregarPerguntas` | carregamento API | Faz `GET /anamnese/questionarios/{id}/perguntas`. |
| `anamneseAbrirModalQuestionario` | modal | Abre modal de criar/editar questionario. |
| `anamneseFecharModalQuestionario` | modal | Fecha modal de questionario. |
| `anamneseSalvarQuestionario` | payload / salvamento / fluxo sensivel | Monta payload, pode copiar questionario e faz `POST` ou `PUT`. |
| `anamneseExcluirQuestionario` | exclusao / fluxo sensivel | Faz `DELETE /anamnese/questionarios/{id}`. |
| `anamneseAbrirModalPergunta` | modal | Abre modal de criar/editar pergunta. |
| `anamneseFecharModalPergunta` | modal | Fecha modal de pergunta. |
| `anamneseSalvarPergunta` | payload / salvamento / fluxo sensivel | Monta payload com numero, tipos e texto, depois faz `POST` ou `PUT`. |
| `anamneseExcluirPergunta` | exclusao / fluxo sensivel | Faz `DELETE /anamnese/perguntas/{id}`. |
| `anamneseRenumeraPerguntas` | integracao externa / fluxo sensivel | Faz `POST /anamnese/questionarios/{id}/renumerar` e altera a ordem das perguntas. |
| `anamneseVincularEventos` | eventos | Liga `click`, `dblclick`, `change` e eventos dos modais. |
| `anamneseAbrir` | abertura/tela | Inicializa UI, eventos, painel e carrega questionarios/perguntas. |

### Funcoes de ficha do paciente relacionadas a Anamnese

| Funcao | Classe documental | Observacao |
|---|---|---|
| `fichaAnamnesePodeImprimir` | helper de permissao / fluxo sensivel | Restringe impressao a `gleissontel@gmail.com`. Depende de `sessaoAtual`. |
| `fichaAnamneseSelecionado` | selecao | Leitura da resposta/pergunta selecionada via cache. |
| `fichaAnamneseRender` | renderizacao | Desenha a lista de perguntas/respostas do paciente. |
| `fichaAnamneseSelecionar` | selecao | Atualiza selecao e o campo de resposta. |
| `fichaAnamneseCarregar` | carregamento API / paciente | Faz `GET /anamnese/pacientes/{paciente_id}/respostas` e depende de `fichaPacienteAtualId`. |
| `fichaAnamneseSalvarSelecionada` | payload / salvamento / paciente | Faz `PUT /anamnese/pacientes/{paciente_id}/respostas`. |
| `fichaAnamneseImprimir` | impressao / fluxo sensivel | Gera HTML de impressao da ficha de anamnese. |

## Variaveis globais, cache e estado identificados

Variaveis diretamente ligadas a Anamnese no `app.js`:

- `anamneseCfg`
- `anamneseQuestionariosCache`
- `anamneseQuestionarioSelId`
- `anamneseCache`
- `anamneseSelId`
- `fichaAnamneseCache`
- `fichaAnamneseSelId`
- `fichaAnamneseQuestionarioId`
- `fichaAnamneseQuestionarioNome`

Variaveis adjacentes que afetam o fluxo:

- `fichaPacienteAtualId`
- `sessaoAtual`

Conclusao:

- o estado principal ainda vive no monolito;
- os caches sao centrais para renderizacao, selecao, salvamento e impressao;
- qualquer movimentacao precoce de estado tem risco de regressao silenciosa.

## Relacao com questionarios, perguntas e respostas

Anamnese depende diretamente de questionarios, perguntas, respostas, ordem e selecao.

Observacoes visiveis no frontend:

- questionarios sao carregados por `GET /anamnese/questionarios`;
- perguntas sao carregadas por `GET /anamnese/questionarios/{id}/perguntas`;
- a renumeracao usa `POST /anamnese/questionarios/{id}/renumerar`;
- perguntas usam `tipo_pergunta` e `tipo_resposta` no modal;
- a exclusao de questionario e de pergunta e parte do fluxo ativo;
- a selecao do questionario muda a lista de perguntas;
- a ficha do paciente usa respostas persistidas por paciente e questionario;
- a impressao mistura pergunta, ordem e resposta no mesmo fluxo.

Conclusao:

- a relacao com questionarios/perguntas/respostas e estrutural;
- nao deve ser quebrada por movimentacao funcional prematura;
- qualquer mudanca em ordem ou selecao pode afetar dados clinicos e historico.

## Relacao com pacientes

Existe relacao direta com paciente atual, ficha clinica e prontuario.

Evidencias:

- `fichaAnamneseCarregar` usa `fichaPacienteAtualId`;
- `fichaAnamneseSalvarSelecionada` grava resposta para o paciente atual;
- `fichaAnamneseImprimir` monta a ficha impressa do paciente;
- os docs de investigacao mostram relacao com tenant/clinica e com respostas clinicas;
- o fluxo de anamnese aparece no menu de ficha do paciente e no painel de configuracao.

Conclusao:

- Anamnese nao e um bloco isolado;
- ha dependencia clara de paciente atual e de contexto clinico;
- mover qualquer parte sem mapear paciente e resposta cria risco alto.

## Relacao com importacao, EDS70 e EasyDental

Nao existe, no frontend visivel, uma importacao direta de EDS70 ou EasyDental executada em runtime por este modulo.

O que existe e relacao documental e historica:

- os docs de dry-run e recuperacao EDS70 mostram que questionarios, perguntas e respostas vieram de um processo de consolidacao de dados;
- os docs de legado e descoberta mostram nomes, colunas e mapeamento de estruturas antigas;
- os docs de investigacao explicam a relacao com clinica/tenant e com respostas recuperadas;
- a implementacao atual do frontend continua consumindo a API normal do sistema.

Conclusao:

- nao ha chamada direta a EDS70/EasyDental neste trecho do frontend;
- o risco esta no historico dos dados e na dependencia documental da recuperacao;
- qualquer nova alteracao em importacao precisa ficar fora desta etapa.

## Relacao com editor de textos, impressao, receitas, medicamentos

Nao ha dependencia direta com editor de textos, receitas, prescricoes, medicamentos, materiais ou custos no fluxo ativo de Anamnese que foi mapeado aqui.

O ponto sensivel visivel e a impressao:

- `fichaAnamneseImprimir` gera HTML de impressao;
- isso significa que o fluxo toca em saida impressa e em dados clinicos;
- qualquer movimento em impressao deve ser tratado como fluxo sensivel.

Conclusao:

- nao mover para editor, receitas, prescricoes, medicamentos, materiais ou custos nesta etapa;
- nao usar Anamnese como atalho para alterar outros fluxos do sistema;
- manter impressao fora de qualquer extracao precoce.

## Relacao com backend, API e banco

Contratos visiveis no frontend:

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{id}`
- `DELETE /anamnese/questionarios/{id}`
- `GET /anamnese/questionarios/{id}/perguntas`
- `POST /anamnese/questionarios/{id}/perguntas`
- `PUT /anamnese/perguntas/{id}`
- `DELETE /anamnese/perguntas/{id}`
- `POST /anamnese/questionarios/{id}/renumerar`
- `GET /anamnese/pacientes/{paciente_id}/respostas`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

Contratos documentados em revisoes anteriores:

- o backend usa `current_user.clinica_id` para filtrar questionarios da clinica;
- modelos citados nos docs anteriores incluem `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`;
- nao foi inferida nem proposta mudanca de schema;
- nao foi necessario mexer em migrations ou banco nesta etapa.

Conclusao:

- a relacao com backend e banco e direta e sensivel;
- payload, selecao, ordem e respostas nao devem ser alterados agora;
- qualquer ajuste de schema ou endpoint fica fora deste documento.

## Possiveis helpers puros candidatos

Pelo criterio estrito desta etapa, os melhores candidatos puros estao no modulo passivo e nao no monolito:

| Candidato | Porque parece seguro | Observacao |
|---|---|---|
| `anamneseValidarNomeQuestionario` | Nao usa DOM, nao usa `requestJson`, nao acessa cache global e nao altera estado. | Retorna um objeto de validacao simples. |
| `anamneseValidarTextoPergunta` | Tambem e local, deterministico e sem efeito colateral. | Retorna um objeto de validacao simples. |

Conclusao:

- nao encontrei, no `app.js`, helper que cumpra o criterio estrito de pureza para extracao imediata;
- os helpers puros reais estao no namespace passivo existente;
- qualquer outro candidato aparentemente pequeno ja encosta em DOM, cache, selecao, modal, API ou estado.

## Funcoes com cautela

Funciona como area de cautela tudo que pareca pequeno, mas encoste em DOM, cache, selecao, modal, API ou paciente:

- `anamneseSelecionado`
- `anamneseQuestionarioSelecionado`
- `anamneseRenderComboCopiarQuestionario`
- `anamneseAtualizarEstadoCopiarQuestionario`
- `anamneseRenderQuestionarios`
- `anamneseCarregarQuestionarios`
- `anamneseCarregarPerguntas`
- `anamneseAbrirModalQuestionario`
- `anamneseFecharModalQuestionario`
- `anamneseAbrirModalPergunta`
- `anamneseFecharModalPergunta`
- `anamneseVincularEventos`
- `fichaAnamneseSelecionado`
- `fichaAnamneseRender`
- `fichaAnamneseSelecionar`
- `fichaAnamneseCarregar`
- `fichaAnamneseSalvarSelecionada`
- `fichaAnamneseImprimir`

Motivos da cautela:

- dependem de estado global;
- dependem de selecao corrente;
- mexem em DOM;
- mexem em modais;
- chamam API;
- alteram ou exibem dados clinicos;
- podem quebrar fluxos silenciosamente se movidos cedo.

## Funcoes que NAO devem ser movidas agora

Nao mover nesta etapa qualquer funcao ligada a:

- abertura de tela;
- montagem de UI;
- renderizacao;
- selecao;
- modal;
- payload;
- salvamento;
- exclusao;
- carregamento via API;
- importacao;
- paciente atual;
- questionario, perguntas ou respostas;
- editor, impressao, receitas ou medicamentos.

Lista explicita de funcoes bloqueadas:

- `anamneseEnsureUI`
- `anamneseRender`
- `anamneseCarregarLocal`
- `anamneseVincularEventos`
- `anamneseAbrir`
- `anamneseQuestionarioSelecionado`
- `anamneseRenderComboCopiarQuestionario`
- `anamneseAtualizarEstadoCopiarQuestionario`
- `anamneseRenderQuestionarios`
- `anamneseCarregarQuestionarios`
- `anamneseCarregarPerguntas`
- `anamneseAbrirModalQuestionario`
- `anamneseFecharModalQuestionario`
- `anamneseSalvarQuestionario`
- `anamneseExcluirQuestionario`
- `anamneseAbrirModalPergunta`
- `anamneseFecharModalPergunta`
- `anamneseSalvarPergunta`
- `anamneseExcluirPergunta`
- `anamneseRenumeraPerguntas`
- `fichaAnamnesePodeImprimir`
- `fichaAnamneseSelecionado`
- `fichaAnamneseRender`
- `fichaAnamneseSelecionar`
- `fichaAnamneseCarregar`
- `fichaAnamneseSalvarSelecionada`
- `fichaAnamneseImprimir`

## Riscos de texto e mojibake

Riscos textuais observados:

- ha textos visiveis, labels, mensagens e nomes de questionarios/perguntas que nao devem ser corrigidos nesta etapa;
- os docs e o frontend ainda exibem strings com mojibake em varios trechos historicos;
- nenhuma correcao textual foi feita;
- nenhuma correcao de acento, label, mensagem, placeholder ou string visivel foi feita;
- qualquer correcao textual ou de mojibake deve ser uma etapa propria futura, se algum dia for autorizada.

Conclusao:

- a blindagem textual foi respeitada;
- nada foi alterado para "corrigir" texto visivel;
- o documento apenas registra o risco.

## Riscos funcionais

Riscos principais mapeados:

- quebrar questionarios;
- quebrar o vinculo com paciente;
- quebrar respostas;
- alterar payload;
- alterar importacao;
- alterar ordem de perguntas;
- afetar historico ou prontuario;
- afetar backend ou banco;
- afetar editor ou impressao;
- provocar regressao silenciosa em dados clinicos.

Conclusao:

- Anamnese segue sensivel;
- o maior risco nao e visual, e sim clinico e de persistencia;
- qualquer extracao precoce precisa ser muito conservadora.

## Decisao recomendada

Decisao recomendada: **B) criar uma etapa documental especifica de helper candidato**.

Justificativa:

- o modulo JS ja existe e esta passivo;
- `frontend/index.html` ja carrega o script;
- o fluxo funcional ainda vive no `app.js`;
- ha pelo menos dois helpers puros claros no namespace passivo;
- ao mesmo tempo, o restante do bloco continua fortemente acoplado a DOM, cache, paciente, API, modal, payload e impressao;
- por isso, a melhor proxima acao e documentar helper candidato especifico, nao mover fluxo.

## Proxima etapa recomendada

Proxima etapa recomendada:

- `Anamnese — Subetapa 1 — helper puro candidato`

Esta e a continuidade mais conservadora porque:

- nao mexe em fluxo funcional;
- aproveita o modulo passivo existente;
- permite estudar um helper isolado antes de qualquer extracao;
- evita tocar em tela, perguntas, respostas, paciente e persistencia.

## Roteiro de teste futuro

Esta etapa e documental, entao nao ha teste funcional obrigatorio no navegador agora.

Se houver futura alteracao JS ou HTML, o roteiro conservador continua sendo:

1. `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir a area de Anamnese, se existir.
4. Abrir ou listar questionarios sem salvar.
5. Abrir perguntas e respostas sem salvar.
6. Nao criar questionario real.
7. Nao excluir.
8. Nao importar.
9. Nao imprimir.
10. Nao mexer em paciente real.
11. Confirmar console sem `ReferenceError` ou `TypeError`.
