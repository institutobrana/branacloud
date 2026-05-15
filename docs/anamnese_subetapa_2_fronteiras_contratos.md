# Anamnese - Subetapa 2 - Fronteiras e contratos

## 1. Contexto

- Commit base: `49d1e41 Modulo Anamnese sem modularização`
- A Subetapa 0 revisada foi concluída em `docs/anamnese_subetapa_0_revisada_pos_recuperacao_eds70.md`
- A Subetapa 1 criou o namespace passivo em `frontend/js/modules/anamnese.js`
- O namespace foi validado manualmente no navegador
- Esta etapa ainda e documental

## 2. Estado inicial

- Branch: `modularizacao-segura-fase-1`
- `frontend/app.js` sem diff funcional nesta etapa
- `frontend/index.html` manteve apenas a linha da Subetapa 1 para carregar o namespace passivo
- `frontend/js/modules/anamnese.js` permanece passivo
- `git diff --stat` nao mostrou alteracao funcional nova nesta etapa
- `git log --oneline -8` continua contendo `49d1e41`
- Arquivos untracked antigos de auditoria continuam fora do escopo desta Subetapa 2

Checks de partida:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -8`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/anamnese.js`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/anamnese.js`
- `python -m py_compile backend/services/signup_service.py`

## 3. Validação manual já realizada

URL validada:

`http://127.0.0.1:8000/app`

Console validado:

`window.BranaAnamneseModule?.getStatus()`

Resultado observado:

```json
{
  "nome": "Anamnese",
  "subetapa": 1,
  "status": "passivo",
  "ativo": false,
  "controlaFluxo": false
}
```

Conclusao:

- O namespace passivo carregou corretamente.
- O namespace nao assumiu controle funcional.

## 4. Fronteira do app.js

### 4.1 Bloco legado

- Regiao aproximada identificada na Subetapa 0: `frontend/app.js` em torno da linha `11220`
- Esse bloco forca o select inicial com `Principal` e carrega perguntas locais
- Ele e historico/legado para auditoria e explica a regressao antiga que ja ocorreu
- Nao deve ser tratado como origem de extracao funcional nesta Subetapa 2

### 4.2 Fluxo ativo API-driven

- Regiao aproximada identificada na Subetapa 0: `frontend/app.js` em torno da linha `24144`
- Funcoes principais:
  - `anamneseAbrir()`
  - `anamneseEnsureUI()`
  - `anamneseRenderQuestionarios()`
  - `anamneseCarregarQuestionarios()`
  - `anamneseCarregarPerguntas()`
  - `anamneseSalvarQuestionario()`
  - `anamneseSalvarPergunta()`
  - `anamneseExcluirQuestionario()`
  - `anamneseExcluirPergunta()`
  - `anamneseRenumeraPerguntas()`
  - `anamneseVincularEventos()`
  - `anamneseAbrirModalQuestionario()`
  - `anamneseAbrirModalPergunta()`
- Esse bloco usa `requestJson` e o backend autenticado para operar o painel
- Ele e o fluxo funcional real do modulo

### 4.3 Ficha do paciente / respostas

- Regiao aproximada identificada na Subetapa 0: `frontend/app.js` em torno da linha `23378`
- Funcoes principais:
  - `fichaAnamneseCarregar()`
  - `fichaAnamneseSalvarSelecionada()`
  - `fichaAnamneseImprimir()`
  - `fichaAnamneseSelecionar()`
  - `fichaAnamneseRender()`
- Endpoints de respostas sao consumidos a partir do contexto da ficha do paciente
- Esse fluxo e sensivel porque envolve dados clinicos e respostas por paciente

## 5. Contratos de estado/cache

### Estado do painel Anamnese

- `anamneseCfg`
  - nasce em `anamneseEnsureUI()`
  - lido em quase todas as funcoes do painel
  - alterado em `anamneseEnsureUI()`
  - risco se mover cedo: quebra de DOM, modal e binds

- `anamneseQuestionariosCache`
  - nasce em `anamneseCarregarQuestionarios()`
  - lido em `anamneseRenderQuestionarios()`, `anamneseQuestionarioSelecionado()`, `anamneseRenderComboCopiarQuestionario()`, `anamneseAbrirModalQuestionario()`
  - alterado em `anamneseCarregarQuestionarios()` e ao salvar/excluir questionarios
  - risco: lista incorreta, regressao do select, perda de selecao

- `anamneseQuestionarioSelId`
  - nasce como `null`
  - lido em `anamneseCarregarPerguntas()`, `anamneseSalvarQuestionario()`, `anamneseExcluirQuestionario()`, `anamneseSalvarPergunta()`, `anamneseRenumeraPerguntas()`, `anamneseAbrirModalQuestionario()`
  - alterado em `anamneseRenderQuestionarios()`, `anamneseVincularEventos()`, exclusao e selecao do select
  - risco: troca de questionario errado

- `anamneseCache`
  - nasce em `anamneseCarregarPerguntas()`
  - lido em `anamneseRender()`, `anamneseSelecionado()`, salvar/excluir/renumerar
  - alterado em `anamneseCarregarPerguntas()`
  - risco: grade e selecao de perguntas inconsistentes

- `anamneseSelId`
  - nasce como `null`
  - lido em `anamneseRender()`, `anamneseSelecionado()`, edicao/exclusao de pergunta
  - alterado em `anamneseVincularEventos()`, `anamneseCarregarPerguntas()`
  - risco: alterar a pergunta alvo errada

### Estado da ficha do paciente

- `fichaAnamneseCache`
  - nasce em `fichaAnamneseCarregar()`
  - lido em `fichaAnamneseRender()`, `fichaAnamneseImprimir()`, salvar resposta
  - alterado em `fichaAnamneseCarregar()`, `fichaLimparNovo()`
  - risco: respostas exibidas incorretamente

- `fichaAnamneseSelId`
  - nasce como `null`
  - lido em `fichaAnamneseSelecionado()`, salvar resposta, renderizacao
  - alterado em `fichaAnamneseCarregar()`, `fichaAnamneseSelecionar()`, `fichaLimparNovo()`
  - risco: resposta ser salva no item errado

- `fichaAnamneseQuestionarioId`
  - nasce como `null`
  - lido em `fichaAnamneseCarregar()`
  - alterado em `fichaAnamneseCarregar()`, `fichaLimparNovo()`
  - risco: carregar questionario errado na ficha

- `fichaAnamneseQuestionarioNome`
  - nasce como string vazia
  - lido na ficha e no print
  - alterado em `fichaAnamneseCarregar()`, `fichaLimparNovo()`
  - risco: diagnostico/print inconsistente

## 6. Contratos DOM

### Painel principal

- `#anamnese-panel`
  - usado em `anamneseEnsureUI()`, `anamneseAbrir()`, `anamneseVincularEventos()`
  - risco: montagem e visibilidade do painel

- `#anamnese-questionario`
  - usado em `anamneseEnsureUI()`, `anamneseRenderQuestionarios()`, `anamneseVincularEventos()`
  - evento: `change`
  - risco: regressao na lista de questionarios

- `#anamnese-tbody`
  - usado em `anamneseEnsureUI()`, `anamneseRender()`, `anamneseVincularEventos()`
  - eventos: `click`, `dblclick`
  - risco: selecao e edicao da pergunta errada

- `#anamnese-total`
  - usado em `anamneseRender()`
  - risco: contagem incorreta

- botoes:
  - `#anamnese-btn-novo`
  - `#anamnese-btn-editar`
  - `#anamnese-btn-excluir`
  - `#anamnese-btn-imprimir`
  - `#anamnese-btn-fechar`
  - `#anamnese-btn-nova-pergunta`
  - `#anamnese-btn-alterar-pergunta`
  - `#anamnese-btn-excluir-pergunta`
  - `#anamnese-btn-renumerar`
  - usados em `anamneseVincularEventos()`
  - risco: controles principais de CRUD

### Modais

- `#anamnese-modal-questionario-backdrop`
- `#anamnese-modal-questionario-title`
- `#anamnese-modal-questionario-nome`
- `#anamnese-modal-questionario-copiar`
- `#anamnese-modal-questionario-copiar-select`
- `#anamnese-modal-questionario-ok`
- `#anamnese-modal-questionario-cancelar`
- `#anamnese-modal-pergunta-backdrop`
- `#anamnese-modal-pergunta-title`
- `#anamnese-modal-pergunta-numero`
- `#anamnese-modal-pergunta-tipo`
- `#anamnese-modal-resposta-tipo`
- `#anamnese-modal-pergunta-texto`
- `#anamnese-modal-pergunta-alerta`
- `#anamnese-modal-pergunta-ok`
- `#anamnese-modal-pergunta-cancelar`

Usados em:

- `anamneseEnsureUI()`
- `anamneseAbrirModalQuestionario()`
- `anamneseAbrirModalPergunta()`
- `anamneseAtualizarEstadoCopiarQuestionario()`
- `anamneseSalvarQuestionario()`
- `anamneseSalvarPergunta()`
- `anamneseVincularEventos()`

Risco:

- perder modal compartilhado, validação de campos ou comportamento de copiar questionario

### Ficha do paciente

- `#ficha-anamnese-atualizar`
- `#ficha-anamnese-list`
- `#ficha-anamnese-resposta`
- `#ficha-anamnese-alerta`

Usados em:

- `fichaEnsureUI()` override
- `fichaAnamneseRender()`
- `fichaAnamneseSelecionar()`
- `fichaAnamneseCarregar()`
- `fichaAnamneseSalvarSelecionada()`
- `fichaAnamneseImprimir()`

Risco:

- fluxo de respostas por paciente e impressao

## 7. Contratos de eventos

### Painel de Anamnese

- `click` em linha da tabela
  - bind em `anamneseVincularEventos()`
  - chama selecao de pergunta
  - depende de `anamneseSelId`

- `dblclick` em linha da tabela
  - bind em `anamneseVincularEventos()`
  - abre modal de edicao de pergunta
  - depende de selecao corrente

- `change` no select de questionario
  - bind em `anamneseVincularEventos()`
  - atualiza `anamneseQuestionarioSelId`
  - recarrega perguntas

- `click` nos botoes de CRUD e impressao
  - bind em `anamneseVincularEventos()`
  - chama funcoes de abrir modal, excluir e renumerar
  - risco alto se mover cedo

- eventos dos modais
  - `click` em OK e Cancelar
  - `click` no backdrop para fechar
  - `change` no checkbox de copiar
  - tudo em `anamneseVincularEventos()`

### Ficha do paciente

- `click` na lista de respostas
  - bind em `fichaEnsureUI()` override
  - chama `fichaAnamneseSelecionar()`

- `blur` no textarea de resposta
  - bind em `fichaEnsureUI()` override
  - chama `fichaAnamneseSalvarSelecionada()`

- `click` no botao atualizar anamnese
  - bind em `fichaEnsureUI()` override
  - salva e recarrega

- `tab === "anamnese"`
  - bind em `fichaSetTab()` override
  - chama `fichaAnamneseCarregar()`

Risco:

- esses binds fazem parte do fluxo clinico e nao devem ser movidos antes de helpers puros estarem prontos

## 8. Contratos de endpoints

### Painel de questionarios

- `GET /anamnese/questionarios`
  - chamada por `anamneseCarregarQuestionarios()`
  - payload: nenhum
  - resposta esperada: lista de questionarios da clinica do usuario atual
  - dependência: `current_user.clinica_id`
  - risco: regressao na lista, filtro por tenant, selecao errada

- `POST /anamnese/questionarios`
  - chamada por `anamneseSalvarQuestionario()`
  - payload: `{ nome, ativo, copiar_do_questionario_id? }`
  - resposta esperada: questionario criado
  - dependência: `current_user.clinica_id`

- `PUT /anamnese/questionarios/{id}`
  - chamada por `anamneseSalvarQuestionario()` quando edita
  - payload: `{ nome, ativo, ordem? }`
  - resposta esperada: sucesso de atualizacao
  - dependência: `current_user.clinica_id`

- `DELETE /anamnese/questionarios/{id}`
  - chamada por `anamneseExcluirQuestionario()`
  - payload: nenhum
  - resposta esperada: exclusao ou erro de conflito se houver perguntas
  - dependência: `current_user.clinica_id`

- `GET /anamnese/questionarios/{id}/perguntas`
  - chamada por `anamneseCarregarPerguntas()`
  - payload: nenhum
  - resposta esperada: lista de perguntas do questionario selecionado
  - dependência: `current_user.clinica_id`

- `POST /anamnese/questionarios/{id}/perguntas`
  - chamada por `anamneseSalvarPergunta()` quando cria
  - payload: `{ numero, tipo_pergunta, tipo_resposta, texto, mensagem_alerta, ativo }`
  - resposta esperada: pergunta criada
  - dependência: `current_user.clinica_id`

- `PUT /anamnese/perguntas/{id}`
  - chamada por `anamneseSalvarPergunta()` quando edita
  - payload: `{ numero, tipo_pergunta, tipo_resposta, texto, mensagem_alerta, ativo }`
  - resposta esperada: atualizacao da pergunta
  - dependência: `current_user.clinica_id`

- `DELETE /anamnese/perguntas/{id}`
  - chamada por `anamneseExcluirPergunta()`
  - payload: nenhum
  - resposta esperada: exclusao da pergunta
  - dependência: `current_user.clinica_id`

- `POST /anamnese/questionarios/{id}/renumerar`
  - chamada por `anamneseRenumeraPerguntas()`
  - payload: vazio
  - resposta esperada: renumeracao das perguntas
  - dependência: `current_user.clinica_id`

### Respostas por paciente

- `GET /anamnese/pacientes/{paciente_id}/respostas`
  - chamada por `fichaAnamneseCarregar()`
  - payload: nenhum, opcional `questionario_id`
  - resposta esperada: `{ questionario_id, questionario_nome, itens }`
  - dependência: `current_user.clinica_id`

- `PUT /anamnese/pacientes/{paciente_id}/respostas`
  - chamada por `fichaAnamneseSalvarSelecionada()`
  - payload: `{ pergunta_id, resposta }`
  - resposta esperada: salvar/limpar resposta
  - dependência: `current_user.clinica_id`

## 9. Contrato com seed obrigatório

Contexto consultado sem alteracao:

- `backend/services/signup_service.py`
- `backend/scripts/anamnese_seed_obrigatorio_backfill.py`
- `backend/scripts/anamnese_seed_obrigatorio_dry_run.py`

Regras atuais documentadas:

- seeds obrigatorios: `Principal`, `Implante`, `Ficha complementar`
- novas clinicas recebem esses seeds
- clinicas antigas ja receberam backfill
- `Principal` oficial atual tem `17` perguntas
- `Principal` EDS70 com `35` perguntas continua pendente para decisao futura
- `Anamnese de Saúde` e `Anamnese pessoal` nao sao seeds obrigatorios

Observacao para a modularizacao:

- esse contrato nao deve ser mexido na modularizacao do frontend
- os seeds sao responsabilidade de bootstrap/backfill, nao do namespace passivo

## 10. Funções por grupo de extração

### Grupo A - possiveis helpers puros futuros

- normalizacao de nome de questionario
- validacao de nome de questionario
- normalizacao de texto de pergunta
- validacao de texto de pergunta
- normalizacao de tipo de pergunta
- normalizacao de tipo de resposta
- ordenacao local de perguntas
- ordenacao local de questionarios
- formatacao simples de status/labels

### Grupo B - nao mover nas proximas etapas

- `anamneseAbrir`
- `anamneseEnsureUI`
- `anamneseCarregarQuestionarios`
- `anamneseRenderQuestionarios`
- `anamneseCarregarPerguntas`
- `anamneseRender`
- `anamneseSalvarQuestionario`
- `anamneseSalvarPergunta`
- `anamneseExcluirQuestionario`
- `anamneseExcluirPergunta`
- `anamneseRenumeraPerguntas`
- `anamneseVincularEventos`
- modais
- `fichaAnamnese*`
- qualquer fluxo de respostas

### Grupo C - avaliar em ciclo futuro

- renderizacao parcial
- montagem de payload
- funcoes de impressao
- funcoes ligadas a ficha do paciente
- migracao de respostas
- sincronizacao com seed

## 11. Riscos

- bloco legado que força Principal
- regressao da lista de questionarios
- respostas clinicas
- ficha do paciente
- renumeracao
- modais
- exclusao
- cache
- endpoints
- seed obrigatorio
- dados sensiveis
- confusao entre bloco legado e fluxo ativo
- mover helpers cedo demais

## 12. Recomendação para Subetapa 3

Recomendacao conservadora:

- seguir apenas com helpers puros muito pequenos
- se quiser reduzir risco ainda mais, fazer uma Subetapa 3A com um helper puro de validacao textual
- o helper mais seguro para um primeiro teste e algo como:
  - `anamneseValidarNomeQuestionario(nome)`
  - ou `anamneseValidarTextoPergunta(texto)`
- nao integrar ainda com DOM, modais, listagem ou responses

## 13. Onde testar antes de avançar

1. `Ctrl+F5`.
2. Entrar com `gleissontel@gmail.com`.
3. Abrir `Anamnese`.
4. Confirmar 5 questionarios.
5. Conferir quantidades:
   - `Principal`: 17
   - `Implante`: 12
   - `Ficha complementar`: 12
   - `Anamnese de Saúde`: 55
   - `Anamnese pessoal`: 16
6. Abrir ficha de paciente.
7. Validar fluxo de Anamnese/respostas.
8. Confirmar:
   - `window.BranaAnamneseModule.getStatus()`
   - `status: "passivo"`
   - `ativo: false`
   - `controlaFluxo: false`
9. Confirmar console sem `ReferenceError` ou `TypeError`.

## 14. Confirmação final

- nenhum codigo funcional foi alterado nesta etapa
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado nesta etapa
- `frontend/js/modules/anamnese.js` nao foi alterado funcionalmente
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum commit foi feito

