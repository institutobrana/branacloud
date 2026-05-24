# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 6 - Plano cirurgico final do recorte de leitura de preferencias

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao e consolidacao documental por frente.

A frente anterior, Editor de texto, permanece pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao confirmada
A frente atual continua sendo `Preferencias e Opcoes do Sistema`.

A classificacao multiárea foi confirmada pelo usuario como `configuracao comum`.

Essa confirmacao permanece obrigatoria para qualquer futuro recorte, porque o bloco escolhido nao deve misturar configuracao comum com area profissional especifica.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.
- Subetapa 2 concluida no commit `f7f9b22` - Mapeia tecnicamente preferencias e opcoes.
- Subetapa 3 concluida no commit `db2d646` - Isola blocos candidatos de preferencias.
- Subetapa 4 concluida no commit `a6ddf57` - Refina blocos seguros de preferencias.
- Subetapa 5 concluida no commit `7ad78c8` - Planeja recorte de leitura de preferencias.

## 4. Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_5_plano_cirurgico_leitura_usuario.md`
- `docs/fase_2_preferencias_opcoes_subetapa_4_refinamento_blocos_seguros.md`
- `docs/fase_2_preferencias_opcoes_subetapa_3_isolamento_blocos_candidatos.md`
- `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md`
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/fase_2_editor_texto_subetapa_7_consolidacao_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Backend
- `backend/routes/preferences_routes.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules`

## 5. Candidato escolhido para o primeiro recorte futuro
O candidato escolhido permanece sendo:

**Leitura isolada de preferencias de usuario sem escrita.**

## 6. Escopo cirurgico final do possivel primeiro patch
O menor patch real possivel, se um dia for autorizado, deveria se limitar a:

- ler preferencias de usuario ja persistidas;
- sincronizar a interface para exibir o estado atual;
- manter a tela em modo de leitura;
- nao produzir escrita, PATCH ou salvamento;
- nao introduzir novos dados, novos endpoints ou nova persistencia.

### O que entra
- leitura de dados de usuario ja existentes;
- renderizacao visual das abas e campos ja previstos;
- eventual ajuste de fluxo interno para separar leitura de sincronizacao, se isso for realmente necessario e minimo.

### O que nao entra
- salvamento;
- PATCH;
- permissao `configuracao` como alteracao de regra;
- senha administrativa;
- backend novo;
- banco novo;
- schema;
- migrations;
- seeds;
- opcoes por clinica;
- relatatorios/impressos;
- odontograma;
- modelos;
- financeiro;
- seguranca;
- mistura usuario/clinica.

### Funcoes que poderiam ser tocadas futuramente
- `prefCarregarDados`
- `prefEnsureUI`
- `prefSelecionarAba`
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`

### Funcoes que nao devem ser tocadas futuramente
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- qualquer rotina `PATCH /preferences/*`
- qualquer rotina de opcoes do sistema
- qualquer rotina de permissao
- qualquer rotina de senha administrativa

### Arquivos que poderiam ser alterados futuramente
- `frontend/app.js`, se o recorte minimo exigir ajuste de leitura ou organizacao visual

### Arquivos que nao devem ser alterados futuramente
- `frontend/index.html`
- `frontend/js/modules`
- `backend`
- banco
- schema
- migrations
- seeds
- endpoints
- `storage/modelos`

### Endpoints GET envolvidos apenas por consumo
- `GET /preferences/general`
- `GET /preferences/models`
- `GET /preferences/environment`
- `GET /preferences/user-data`
- `GET /preferences/odontogram`
- `GET /preferences/report-config`

### Persistencia envolvida apenas por leitura
- `usuario.preferencias_usuario_json`
- `usuario.preferencias_impressora_json`

## 7. Funcoes que devem permanecer intocadas
### Leitura/auxilio que podem existir, mas devem ficar fora do patch final se nao forem estritamente necessarias
- `prefEnsureUI`
- `prefSelecionarAba`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`

### Salvamento
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`

### PATCH
- qualquer `requestJson("PATCH", ...)` relacionado a preferencias ou opcoes do sistema

### Permissoes
- `menuActionAccessLevel`
- `menuEnsurePermission`
- grants protegidos
- `configuracao`

### Senha administrativa
- `protectedPassDialog`
- `unlockProtectedGrant`
- qualquer fluxo de desbloqueio protegido

### Opcoes por clinica
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptEnsureUI`
- qualquer rotina de `/system-options`

### Backend/banco
- qualquer router novo
- qualquer alteracao em models
- qualquer alteracao de schema, migrations ou seeds

### Relatorios/impressos, odontograma, modelos, financeiro e seguranca
- qualquer rotina que ultrapasse o carregamento de preferencias de usuario

## 8. Riscos especificos do primeiro patch real
- o frontend central `frontend/app.js` concentra muitos fluxos e pode contaminar o recorte;
- leitura e sincronizacao visual podem acabar misturadas com rotinas de salvamento;
- o contexto de `sessaoAtual` e do usuario alvo pode ser afetado se o recorte for amplo demais;
- qualquer ajuste em `prefCarregarDados` pode puxar dependencias de outras abas;
- o primeiro patch pode virar um recorte transversal sem perceber;
- se a separacao entre leitura e renderizacao nao ficar muito clara, o risco de regressao aumenta.

## 9. Medidas de contenção
- manter o patch somente em leitura e sincronizacao visual;
- não permitir qualquer `PATCH`;
- não criar novos endpoints;
- não tocar no backend;
- não tocar em opcoes por clinica;
- não tocar em permissao ou senha administrativa;
- não tocar em relatorios, odontograma, modelos, financeiro ou seguranca;
- manter a mudanca pequena o suficiente para ser auditavel em diffs curtos;
- validar manualmente o fluxo antes de qualquer alteracao persistente.

## 10. Critérios técnicos para autorizar o código
Antes de autorizar qualquer codigo, deve ficar comprovado que:

- a classificacao segue como configuracao comum;
- o recorte e somente leitura ou organizacao visual sem escrita;
- nao ha PATCH;
- nao ha salvamento;
- nao ha backend novo;
- nao ha banco novo;
- nao ha schema, migrations ou seeds;
- nao ha permissao sensivel ou senha administrativa;
- nao ha opcoes por clinica;
- nao ha mistura usuario/clinica;
- nao ha relatorios/impressos, odontograma, modelos, financeiro ou seguranca no primeiro patch;
- o diff e pequeno, auditavel e restrito ao minimo necessario.

## 11. Checks tecnicos obrigatorios para futura alteracao real
Se algum dia houver codigo, deverao ser executados:

- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules`
- `git diff -- backend`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`, se esse arquivo for alterado
- busca no diff por `PATCH`, por `requestJson("PATCH"` e por qualquer chamada de salvamento
- confirmacao de que nenhum endpoint backend foi alterado
- confirmacao de que nenhum arquivo de banco/schema/migrations/seeds foi alterado

## 12. Plano de teste humano obrigatorio
Antes e depois de qualquer alteracao funcional futura, o teste humano deve comecar em:

`Preferências e Opções do Sistema`

E validar:
- abertura da tela;
- carregamento das abas;
- carregamento das preferencias do usuario;
- carregamento das opcoes por clinica apenas para garantir que nada quebrou;
- ausencia de salvamento acidental;
- ausencia de PATCH;
- permissao configuracao;
- senha administrativa quando aplicavel apenas para garantir que nada foi afetado;
- relatorios;
- odontograma;
- modelos;
- impressos.

## 13. Estrategia de rollback manual conceitual
Se um futuro patch precisar ser desfeito conceitualmente, a reversao deve ser feita apenas reabrindo a documentacao e ajustando o plano do recorte, sem usar `git reset`, `git revert`, `git restore` ou `git clean`.

O rollback manual conceitual esperado e:

- interromper o recorte;
- revisar o contrato e o bloco escolhido;
- voltar para a etapa documental anterior;
- remover a intencao de codigo antes de qualquer novo commit.

## 14. Decisao documental
A decisao documental atual e:

**Nao autorizar a proxima subetapa com codigo ainda.**

Motivo: o candidato continua sendo o mais conservador, mas o plano final mostra que o `frontend/app.js` ainda concentra leitura, sincronizacao visual e outros fluxos; isso ainda pede um fechamento documental minimo adicional antes de qualquer patch.

## 15. Proxima subetapa recomendada
Recomenda-se uma nova subetapa documental final de aprovacao cirurgica, voltada a marcar exatamente qual trecho de leitura/sincronizacao visual poderia ser implementado sem risco excessivo.

## 16. Confirmacoes
- Editor de texto permanece pausado/consolidado;
- a frente atual continua sendo Preferencias e Opcoes do Sistema;
- a classificacao multiárea foi confirmada pelo usuario como configuracao comum;
- nenhum codigo foi alterado nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ou de mojibake foi feita.

## Registro para roadmap
- A frente atual continua sendo Preferencias e Opcoes do Sistema.
- Editor de texto permanece pausado/consolidado.
- A Subetapa 1 foi concluida no commit `7764e9b`.
- A Subetapa 2 foi concluida no commit `f7f9b22`.
- A Subetapa 3 foi concluida no commit `db2d646`.
- A Subetapa 4 foi concluida no commit `a6ddf57`.
- A Subetapa 5 foi concluida no commit `7ad78c8`.
- Esta Subetapa 6 cria o plano cirurgico final do primeiro recorte minimo.
- O candidato escolhido e leitura isolada de preferencias de usuario sem escrita.
- A classificacao multiárea foi confirmada pelo usuario como configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A decisao sobre autorizar ou nao uma proxima subetapa com codigo foi registrada explicitamente.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_6_plano_cirurgico_final_leitura_usuario.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
