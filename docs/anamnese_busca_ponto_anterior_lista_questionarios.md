# Busca de ponto anterior - Lista de Questionarios de Anamnese

## 1. Contexto

O modulo Anamnese esta apresentando um comportamento inconsistente com a expectativa informada pelo usuario.

Comportamento esperado:
- Anamnese de Saude
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

Comportamento observado:
- apenas `Principal`

Nesta investigacao nao houve tentativa de correcao funcional, modularizacao, refatoracao ou restauracao de banco sem evidencia clara.

## 2. Estado inicial do Git

Branch atual:
- `modularizacao-segura-fase-1`

Status inicial observado:
- apenas documentos untracked relacionados a investigacao anterior

Diff inicial:
- vazio para arquivos funcionais

Remote:
- `origin` -> `https://github.com/institutobrana/branacloud.git`

Log e reflog:
- nao foram encontrados commits especificos de Anamnese na linha atual
- o reflog mostra apenas a historia recente da branch de modularizacao segura

Observacao importante:
- `git fetch --all --prune` nao completou por permissao negada em `.git/FETCH_HEAD`

## 3. Fontes consultadas

- Git local
- GitHub/origin
- reflog local
- backup de reversao `_BACKUP_ESTADO_MODULARIZACAO_QUEBRADA_20260511` citado anteriormente
- legado em `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`
- backups CSV de 20260330 e 20260413 encontrados no legado
- banco atual via PostgreSQL local
- endpoint atual `/anamnese/questionarios`
- frontend atual `frontend/app.js`
- backend atual `backend/routes/anamnese_routes.py`
- backend atual `backend/models/anamnese.py`
- backend atual `backend/models/anamnese_resposta.py`

Observacao de caminho:
- os backups citados como estando em `BRANA CLOUD` foram encontrados no disco sob `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\...`

## 4. Candidatos de restauracao encontrados

Nao encontrei candidato seguro com evidencia de que contenha a lista com os cinco questionarios esperados.

Candidatos avaliados:
- `frontend/app.js` atual
  - origem: BRANA CLOUD atual
  - evidencia: possui fluxo API-driven de Anamnese, igual ao legado observado
  - risco: baixo para restauracao, mas nao resolve a ausencia de dados
  - uso: nao recomendado como restauracao isolada neste momento

- `backend/routes/anamnese_routes.py`
  - origem: BRANA CLOUD atual
  - evidencia: lista questionarios por `current_user.clinica_id`
  - risco: medio se o problema for filtro/tenant, mas nao ha prova de regressao no codigo
  - uso: nao recomendado restaurar sem provar diferenca frente ao legado

- `anamnese_questionarios.csv` dos backups de 20260330 / 20260413
  - origem: legado / backups CSV
  - evidencia: contem apenas `Principal`
  - risco: alto se usado como fonte de expectativa dos cinco nomes, porque nao contem os nomes esperados
  - uso: nao serve como ponto anterior funcional para o caso reportado

- `pre_delete_clinicas_2_5_20260413_142730/anamnese_questionarios.csv`
  - origem: legado / backup posterior
  - evidencia: tambem contem apenas `Principal`
  - risco: alto para restaurar a lista esperada
  - uso: nao serve como ponto anterior funcional

Nao encontrei:
- commit especifico de Anamnese com lista rica de questionarios
- backup CSV com `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` e `Implante`
- arquivo de legado com dados de questionarios contendo esses nomes

## 5. Comparacao do frontend

Frontend atual `frontend/app.js`:
- possui a implementacao API-driven de Anamnese em torno de `anamneseRenderQuestionarios()`, `anamneseCarregarQuestionarios()`, `anamneseCarregarPerguntas()` e `anamneseAbrir()`
- a combo de questionarios e preenchida a partir do retorno de `/anamnese/questionarios`
- nao foi encontrado filtro local que force a lista para `Principal` nessa trilha ativa

Legado `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`:
- tambem possui o mesmo fluxo API-driven de Anamnese
- `anamneseRenderQuestionarios()` monta a combo a partir do array de questionarios
- `anamneseCarregarQuestionarios()` chama `/anamnese/questionarios`
- `anamneseAbrir()` chama `anamneseCarregarQuestionarios()` e `anamneseCarregarPerguntas()`

Conclusao do frontend:
- nao encontrei diferenca funcional relevante entre o frontend atual e o legado neste fluxo
- a evidencia nao aponta para o frontend como causa principal

## 6. Comparacao do backend/endpoints

`backend/routes/anamnese_routes.py`:
- `GET /anamnese/questionarios` usa `current_user.clinica_id`
- nao foi encontrado filtro adicional que limite por nome
- ordena por `ordem` e `nome`
- nao faz fallback local para `Principal`

`backend/models/anamnese.py`:
- modelo de questionario contem `clinica_id`, `nome`, `ativo`, `ordem`
- modelo de pergunta amarra `questionario_id` e `clinica_id`

`backend/models/anamnese_resposta.py`:
- resposta amarra `clinica_id`, `paciente_id`, `questionario_id` e `pergunta_id`

Conclusao do backend:
- o backend parece coerente para listar todos os questionarios da clinica atual
- se a clinica atual so tem `Principal`, o endpoint vai retornar apenas isso

## 7. Comparacao dos dados

Banco atual PostgreSQL local:
- `anamnese_questionarios`: 3 linhas
- nomes encontrados: apenas `Principal`
- `clinica_id` encontrados: `1`, `4`, `8`
- `anamnese_perguntas`: 17 perguntas por questionario
- questionarios retornados pelo banco:
  - `(2, 1, 'Principal', true, 1)`
  - `(3, 4, 'Principal', true, 1)`
  - `(7, 8, 'Principal', true, 1)`

Backups CSV do legado:
- `brana_saas_full_20260330_204101`
  - `anamnese_questionarios.csv`: 3 linhas
  - nomes: apenas `Principal`
  - clinicas: `1`, `2`, `4`
  - `anamnese_perguntas.csv`: 51 linhas, 17 por questionario

- `brana_saas_full_20260330_204513`
  - mesmos dados do backup anterior

- `brana_saas_full_20260413_130945`
  - mesmos dados do backup anterior

- `brana_saas_to_render_20260406`
  - mesmos dados do backup anterior

- `pre_delete_clinicas_2_5_20260413_142730`
  - `anamnese_questionarios.csv`: 4 linhas
  - nomes: apenas `Principal`
  - clinicas: `1`, `2`, `4`, `5`
  - `anamnese_perguntas.csv`: 68 linhas, 17 por questionario

Conclusao dos dados:
- nao existe, nas fontes verificadas, evidenza dos cinco questionarios esperados
- os backups e o banco atual convergem para uma estrutura onde cada clinica tem apenas o questionario `Principal`

## 8. Resultado do endpoint

Endpoint identificado:
- `GET /anamnese/questionarios`

Teste executado:
- chamada sem token para `http://127.0.0.1:8000/anamnese/questionarios`

Resultado:
- HTTP 401
- JSON/erro: `{"detail":"Token nao informado"}`

Interpretacao:
- o endpoint exige autenticacao
- sem token nao foi possivel inspecionar o JSON autentico da lista
- mesmo assim, o codigo do backend mostra que a resposta depende de `current_user.clinica_id`

## 9. Diagnostico mais provavel

Classificacao com base nas evidencias:
- codigo frontend: pouco provavel
- codigo backend: pouco provavel
- dados ausentes/limpos por clinica: muito provavel
- filtro por clinica/tenant: muito provavel
- cache/localStorage: nao comprovado
- outro: possivel divergencia entre a clinica usada no login e a clinica que contem os dados esperados

Resumo do diagnostico:
- a trilha de codigo atual e o legado nao mostram um stub que force a lista para `Principal`
- o banco atual e os backups consultados so exibem `Principal`
- nao achei ponto historico seguro com os cinco nomes esperados

## 10. Ação executada, se alguma

Nao houve restauracao de arquivo.

Motivo:
- nao apareceu fonte confiavel com a lista completa de questionarios
- o codigo atual e o legado convergem para o mesmo fluxo API-driven
- os dados consultados nao continham os cinco questionarios esperados

## 11. Próximo passo recomendado

Recomendacao minima:
- identificar a clinica/tenant correta que deveria possuir os cinco questionarios
- localizar uma fonte de dados real com `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` e `Implante`
- apenas depois disso decidir entre:
  - restauracao seletiva de dados de `anamnese_questionarios` e `anamnese_perguntas`
  - ou ajuste minimo de filtro/tenant no backend

Nao recomendo:
- restaurar `frontend/app.js`
- restaurar `frontend/index.html`
- mexer no banco sem uma fonte clara e backup previo

## 12. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git remote -v`
- `git log --oneline --decorate --graph -40`
- `git reflog --date=local -40`
- `node --check frontend/app.js`
- `git log --oneline --all --grep=anamnese -i`
- `git log --oneline --all --grep=restaura -i`
- `git log --oneline --all --grep=revers -i`
- `git log --oneline --all --grep=frontend -i`
- `git log --oneline --all -- frontend/app.js`
- `git log --oneline --all -- frontend/index.html`
- `git log --oneline --all -- backend/routes/anamnese_routes.py`
- `git log --oneline --all -- backend/models/anamnese.py`
- `git log --oneline --all -- backend/models/anamnese_resposta.py`
- `git branch -avv`
- `git tag`
- `git fetch --all --prune` 
- consulta SQL no banco atual com SELECT apenas
- leitura dos CSVs de backup no legado
- leitura do legado `saas\frontend\app.js`

## 13. Onde testar

Testar:

1. Fazer Ctrl+F5.
2. Abrir o sistema.
3. Abrir Anamnese.
4. Abrir lista de Questionarios.
5. Confirmar que aparecem:
   - Anamnese de Saude
   - Anamnese pessoal
   - Ficha complementar
   - Implante
   - Principal
6. Selecionar cada questionario.
7. Confirmar que as perguntas aparecem corretamente.
8. Abrir ficha de paciente.
9. Validar aba/fluxo de Anamnese.
10. Verificar console sem ReferenceError ou TypeError.

## 14. Confirmação final

Confirmo que:
- `frontend/app.js` nao foi alterado nesta investigacao
- `backend` nao foi alterado
- `banco` nao foi alterado
- `endpoints` nao foram alterados
- nao houve restauracao de arquivo
- houve apenas diagnostico e coleta de evidencias
- nenhum commit foi feito

