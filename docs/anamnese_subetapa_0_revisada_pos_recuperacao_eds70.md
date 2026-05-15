# Anamnese - Subetapa 0 revisada pós-recuperação EDS70

## 1. Contexto

- A modularizacao anterior de Anamnese foi interrompida e revertida.
- A correcao de dados foi feita em etapa separada, com recuperacao EDS70 da conta `gleissontel@gmail.com`.
- O seed obrigatorio de Anamnese foi implementado e consolidado depois da recuperacao.
- O commit base desta fase e `49d1e41 Modulo Anamnese sem modularização`.
- A partir daqui se inicia um novo ciclo de modularizacao, com conservadorismo reforcado.

## 2. Referências de padrão consultadas

Documentos de padrao consultados de modulos anteriores:

- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md`

Padrao observado:

- Subetapa 0 documental: primeiro mapear a fronteira real do modulo e os pontos sensiveis no monolito.
- Namespace passivo: quando usado, e apenas um contrato de leitura/diagnostico, sem fetch, sem DOM e sem controle de fluxo.
- Fronteiras e contratos: identificar o que pertence ao monolito e o que pode ser apenas descrito ou preparado.
- Helpers puros: escolher somente funcoes sem DOM, sem requestJson/fetch, sem estado global mutavel e sem efeitos colaterais.
- Fallback local: nas etapas anteriores, o fallback local ficou sempre no `app.js` e nao foi movido cedo.
- Checks e testes manuais: `node --check`, `py_compile`, validacao funcional do painel e do endpoint antes de avancar.

## 3. Estado inicial do Git

- Branch atual: `modularizacao-segura-fase-1`
- Commit consolidado presente no log: `49d1e41 Modulo Anamnese sem modularização`
- `frontend/app.js` sem diff nesta etapa
- `frontend/index.html` sem diff nesta etapa
- `git diff --stat` nao mostrou alteracao funcional rastreada para esta Subetapa 0
- Existem varios arquivos untracked de auditoria anteriores no repositorio e eles nao fazem parte desta Subetapa 0
- Os untracked pre-existentes nao foram alterados nesta etapa

Checks iniciais executados:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -8`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `node --check frontend/app.js`
- `python -m py_compile backend/services/signup_service.py`

## 4. Estado funcional atual de Anamnese

- Conta recuperada: `gleissontel@gmail.com`
- `clinica_id = 1`
- O endpoint autenticado `GET /anamnese/questionarios` voltou a responder `200` com quantidade `5` para a conta recuperada.
- A clinica 1 tem:
  - `Principal` com `17` perguntas
  - `Implante` com `12` perguntas
  - `Ficha complementar` com `12` perguntas
  - `Anamnese de Saúde` com `55` perguntas
  - `Anamnese pessoal` com `16` perguntas
- O `Principal` atual foi preservado com `17` perguntas.
- Respostas clinicas do EDS70 nao foram importadas nesta fase.

## 5. Mapeamento do frontend/app.js

### Estado global e caches

- `anamneseCfg`
- `anamneseQuestionariosCache`
- `anamneseQuestionarioSelId`
- `anamneseCache`
- `anamneseSelId`
- `fichaAnamneseCache`
- `fichaAnamneseSelId`
- `fichaAnamneseQuestionarioId`
- `fichaAnamneseQuestionarioNome`

### Funcoes principais de painel / questionarios / perguntas

- `anamneseEnsureUI()`
- `anamneseRender()`
- `anamneseSelecionado()`
- `anamneseQuestionarioSelecionado()`
- `anamneseRenderComboCopiarQuestionario()`
- `anamneseAtualizarEstadoCopiarQuestionario()`
- `anamneseRenderQuestionarios()`
- `anamneseCarregarQuestionarios()`
- `anamneseCarregarPerguntas()`
- `anamneseAbrirModalQuestionario()`
- `anamneseFecharModalQuestionario()`
- `anamneseSalvarQuestionario()`
- `anamneseExcluirQuestionario()`
- `anamneseAbrirModalPergunta()`
- `anamneseFecharModalPergunta()`
- `anamneseSalvarPergunta()`
- `anamneseExcluirPergunta()`
- `anamneseRenumeraPerguntas()`
- `anamneseVincularEventos()`
- `anamneseAbrir()`

### Funcoes de ficha do paciente

- `fichaAnamnesePodeImprimir()`
- `fichaAnamneseSelecionado()`
- `fichaAnamneseRender()`
- `fichaAnamneseSelecionar()`
- `fichaAnamneseCarregar()`
- `fichaAnamneseSalvarSelecionada()`
- `fichaAnamneseImprimir()`

### Blocos legados e historicos

- Ha um bloco legado antigo em torno da Subetapa 0 historica que montava apenas `<option>Principal</option>` e carregava perguntas locais com `anamneseCarregarLocal()`.
- Esse bloco antigo permanece como referencia historica no arquivo, mas nao e o caminho ativo atual.
- O fluxo ativo atual e o bloco API-driven mais abaixo, que usa `requestJson` para `/anamnese/questionarios` e `/anamnese/questionarios/{id}/perguntas`.
- Existe ainda um bloco de ficha do paciente com overrides posteriores, incluindo `fichaAnamneseCarregar()` e `fichaAnamneseSalvarSelecionada()`.

## 6. Fluxo ativo e blocos legados

### Fluxo ativo

- Abertura do painel: `anamneseAbrir()`
- Carregamento de questionarios: `anamneseCarregarQuestionarios()`
- Renderizacao do select: `anamneseRenderQuestionarios()`
- Carregamento de perguntas: `anamneseCarregarPerguntas()`
- Persistencia de questionario: `anamneseSalvarQuestionario()`
- Persistencia de pergunta: `anamneseSalvarPergunta()`
- Exclusao: `anamneseExcluirQuestionario()` e `anamneseExcluirPergunta()`
- Renumeracao: `anamneseRenumeraPerguntas()`
- Ficha do paciente: `fichaAnamneseCarregar()`, `fichaAnamneseSalvarSelecionada()`, `fichaAnamneseImprimir()`

### Bloco historico/duplicado

- O bloco historico com `anamneseCarregarLocal()` e o select fixo com `Principal` e um artefato de ciclo anterior.
- Ele e importante para auditoria porque explica o tipo de regressao que ja ocorreu antes.
- Nao deve ser tratado como fonte de movimentacao funcional nesta Subetapa 0 revisada.

## 7. Estado/caches

- `anamneseQuestionariosCache` guarda a lista de questionarios do endpoint.
- `anamneseQuestionarioSelId` guarda o questionario atual selecionado no painel.
- `anamneseCache` guarda as perguntas do questionario selecionado.
- `anamneseSelId` guarda a pergunta selecionada na grade.
- `fichaAnamneseCache` guarda as respostas exibidas na ficha do paciente.
- `fichaAnamneseQuestionarioId` e `fichaAnamneseQuestionarioNome` guardam o contexto do questionario da ficha.
- Esses caches sao centrais para o fluxo, portanto nao devem ser movidos cedo.

## 8. DOM e eventos

### Elementos principais do painel

- `#anamnese-panel`
- `#anamnese-questionario`
- `#anamnese-tbody`
- `#anamnese-total`
- `#anamnese-btn-novo`
- `#anamnese-btn-editar`
- `#anamnese-btn-excluir`
- `#anamnese-btn-imprimir`
- `#anamnese-btn-fechar`
- `#anamnese-btn-nova-pergunta`
- `#anamnese-btn-alterar-pergunta`
- `#anamnese-btn-excluir-pergunta`
- `#anamnese-btn-renumerar`
- `#anamnese-modal-questionario-backdrop`
- `#anamnese-modal-pergunta-backdrop`

### Elementos da ficha do paciente

- `#ficha-anamnese-atualizar`
- `#ficha-anamnese-list`
- `#ficha-anamnese-resposta`
- `#ficha-anamnese-alerta`

### Eventos/binds do painel

- `click` e `dblclick` na tabela de perguntas
- `change` no select de questionarios
- `click` nos botoes Novo, Altera, Elimina, Imprime, Fecha
- `click` nos botoes de perguntas
- `click` e `change` nos modais

### Eventos/binds da ficha

- `click` na lista de perguntas da ficha
- `blur` na resposta da ficha
- `click` no botao de atualizar anamnese
- `tab === "anamnese"` dispara `fichaAnamneseCarregar()`

## 9. Endpoints e contratos

### Endpoints do painel de Anamnese

- `GET /anamnese/questionarios`
- `POST /anamnese/questionarios`
- `PUT /anamnese/questionarios/{questionario_id}`
- `DELETE /anamnese/questionarios/{questionario_id}`
- `GET /anamnese/questionarios/{questionario_id}/perguntas`
- `POST /anamnese/questionarios/{questionario_id}/perguntas`
- `PUT /anamnese/perguntas/{pergunta_id}`
- `DELETE /anamnese/perguntas/{pergunta_id}`
- `POST /anamnese/questionarios/{questionario_id}/renumerar`

### Endpoints da ficha do paciente

- `GET /anamnese/pacientes/{paciente_id}/respostas`
- `PUT /anamnese/pacientes/{paciente_id}/respostas`

### Contrato de seguranca

- Todos os endpoints usam `get_current_user` via `Authorization: Bearer <token>`.
- O acesso ao modulo usa `require_module_access("anamnese")`.
- O filtro funcional do backend e por `current_user.clinica_id`.

## 10. Integração com ficha do paciente

- A ficha do paciente usa o mesmo backend de Anamnese, mas com foco em respostas por paciente.
- O carregamento da ficha chama `/anamnese/pacientes/{paciente_id}/respostas`.
- O salvamento da resposta chama `PUT /anamnese/pacientes/{paciente_id}/respostas`.
- O print da anamnese da ficha e condicionado a conta `gleissontel@gmail.com`.
- Essa integracao e sensivel e nao deve ser movida cedo.

## 11. Integração com seed obrigatório

Contexto de backend consultado sem alteracao:

- `backend/services/signup_service.py`
- `backend/routes/anamnese_routes.py`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `backend/scripts/anamnese_seed_obrigatorio_backfill.py`
- `backend/scripts/anamnese_seed_obrigatorio_dry_run.py`
- `backend/scripts/anamnese_importar_eds70_gleisson.py`
- `backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py`

Regra atual do seed obrigatorio:

- `Principal`
- `Implante`
- `Ficha complementar`

Pontos confirmados:

- `garantir_anamnese_padrao_clinica(db, clinica_id)` e idempotente.
- `criar_conta_saas()` chama `garantir_anamnese_padrao_clinica(db, clinica.id)`.
- O seed obrigatorio atual nao inclui `Anamnese de Saúde` nem `Anamnese pessoal`.
- O `Principal` oficial desta fase e a versao atual validada com `17` perguntas.
- O `Principal` EDS70 de `35` perguntas ficou pendente para decisao futura separada.

## 12. Helpers candidatos

Helpers puros candidatos para futura extracao, sem mover ainda:

| Nome sugerido | Função atual | Risco | Dependencias | Seguro para futura Subetapa 3? |
|---|---|---|---|---|
| `anamneseNormalizarNomeQuestionario()` | normalizacao textual implícita em salvar/editar questionario | baixo | string/trim | sim, se isolado de DOM |
| `anamneseValidarNomeQuestionario()` | valida o nome em salvar/editar questionario | baixo | string e regras de negocio | sim, se nao chamar alert/fetch |
| `anamneseNormalizarTextoPergunta()` | limpeza de `texto` em salvar/editar pergunta | baixo | string/trim | sim |
| `anamneseValidarTextoPergunta()` | valida texto nao vazio em salvar/editar pergunta | baixo | string | sim |
| `anamneseNormalizarTipoPergunta()` | `Number(...)` + validacao de faixa | baixo | numeros simples | sim |
| `anamneseNormalizarTipoResposta()` | `Number(...)` + validacao de faixa | baixo | numeros simples | sim |
| `anamneseOrdenarPerguntasLocal()` | ordenacao local de perguntas na grade | medio | arrays e campos numericos | possivelmente sim |
| `anamneseOrdenarQuestionariosLocal()` | ordenacao local de questionarios | medio | arrays e campos numericos | possivelmente sim |
| `anamneseFormatarRotuloStatus()` | rotulo simples de status | baixo | string/boolean | sim |

Nao foram considerados candidatos puros nesta fase:

- qualquer funcao que chame `requestJson`
- qualquer funcao que mexa em DOM
- qualquer funcao que abra/feche modal
- qualquer funcao que leia/grave cache global
- qualquer funcao que salve, exclua ou renumere dados

## 13. Itens que NÃO devem ser movidos cedo

Nao mover nas primeiras etapas:

- abertura principal do modulo
- carregamento via `requestJson`
- renderizacao principal do painel
- modais de questionario e pergunta
- exclusao
- salvamento
- renumeracao
- respostas do paciente
- integracao com ficha do paciente
- seed obrigatorio
- scripts de importacao e backfill
- qualquer fluxo com backend, banco ou dados clinicos
- qualquer integracao com token, sessao ou localStorage

## 14. Riscos

- dados clinicos
- respostas de paciente
- renumeracao
- modais
- fluxo duplicado/historico
- seed obrigatorio
- cache/localStorage/token
- risco de repetir regressao da lista de questionarios
- risco de mexer cedo em DOM ou `requestJson`
- risco de confundir bloco legado com bloco ativo

## 15. Recomendação para Subetapa 1

Recomendacao conservadora para o proximo passo:

- criar `frontend/js/modules/anamnese.js` como namespace passivo
- expor `window.BranaAnamneseModule`
- conter apenas `meta`, `getInfo()`, `getStatus()` e diagnostico de fronteira
- sem helpers funcionais ainda, se houver risco
- sem controlar fluxo
- sem `fetch`
- sem DOM
- sem binds
- sem mexer no `app.js`
- alterar `frontend/index.html` apenas para carregar o script passivo antes de `app.js`

Se a analise indicar risco elevado:

- recomendar uma Subetapa 0B de contratos antes do namespace
- manter o monolito como fonte funcional da verdade por mais uma rodada

## 16. Onde testar antes de qualquer próxima etapa

1. Fazer `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar 5 questionarios.
5. Conferir:
   - `Principal`: 17
   - `Implante`: 12
   - `Ficha complementar`: 12
   - `Anamnese de Saúde`: 55
   - `Anamnese pessoal`: 16
6. Abrir ficha de paciente.
7. Validar fluxo de Anamnese/respostas.
8. Confirmar console sem `ReferenceError` ou `TypeError`.
9. Validar o endpoint no console, se necessario:
   - `/anamnese/questionarios` com status `200` e quantidade `5`

## 17. Confirmação final

- nenhum codigo funcional foi alterado nesta Subetapa 0 revisada
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum commit foi feito nesta etapa

