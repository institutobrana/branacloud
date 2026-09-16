# Diagnóstico - Anamnese da conta gleissontel@gmail.com

## 1. Contexto

A conta `gleissontel@gmail.com` deveria exibir na lista de Questionarios de Anamnese:

- Anamnese de Saude
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

O comportamento observado na sessao autenticada do navegador foi `Array(1)` no endpoint de questionarios, com a lista mostrando apenas `Principal`.

## 2. Estado inicial do projeto

- Branch: `modularizacao-segura-fase-1`
- `git status --short`: apenas documentos `docs/*` untracked
- `git diff --stat`: vazio
- `git diff -- frontend/app.js`: vazio
- `git diff -- frontend/index.html`: vazio
- `node --check frontend/app.js`: OK

## 3. Resultado autenticado informado pelo usuario

- Token presente no `localStorage`, sem expor o valor
- `GET /me`: status `200`
- `GET /anamnese/questionarios`: status `200`
- retorno do endpoint: `Array(1)`
- conta informada: `gleissontel@gmail.com`

Conclusao parcial: o frontend nao parece estar ocultando os questionarios; a API autenticada esta retornando apenas um item para a sessao real.

## 4. Usuario e clinica da conta gleissontel@gmail.com

Consulta no banco atual:

- usuario `id=1`
- `nome=Gleisson Tel`
- `email=gleissontel@gmail.com`
- `clinica_id=1`

Clinica vinculada:

- `id=1`
- `nome=Instuto Brana - Odontologia`

## 5. Questionarios atuais da clinica do Gleisson

Consulta em `anamnese_questionarios` para `clinica_id=1`:

- `id=2`
- `nome=Principal`
- `clinica_id=1`

Total na clinica do Gleisson: `1`

Campos de status encontrados no backup/estrutura:

- `ativo`
- `ordem`
- `criado_em`
- `atualizado_em`

Conclusao: os cinco questionarios esperados nao existem no banco atual para a clinica `1`.

## 6. Busca em outras clinicas

Consulta global no banco atual em `anamnese_questionarios`:

- `clinica_id=1`: `Principal`
- `clinica_id=4`: `Principal`
- `clinica_id=8`: `Principal`

Contagem por clinica:

- `1`: `1`
- `4`: `1`
- `8`: `1`

Conclusao: os quatro questionarios ausentes nao foram encontrados em outra clinica/tenant no banco atual.

## 7. Perguntas e respostas relacionadas

No banco atual, o conjunto de perguntas associado aos questionarios existentes pertence ao fluxo de `Principal`.

Nao foi localizado, nas consultas realizadas, um conjunto de perguntas que evidenciasse os quatro questionarios ausentes como registros ativos e vinculados a outra questionario da conta do Gleisson.

Quanto a respostas:

- nao houve alteracao de dados
- nao houve tentativa de reconstruir vinculos
- nao foram expostos dados de pacientes

## 8. Busca em backups, dumps, legado e bancos locais

Locais pesquisados:

- `D:\BRANA ARQUIVOS\BRANA CLOUD`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
- backups ZIP de Anamnese acessiveis em `saas/backend/backups`
- arquivos textuais, JSON, CSV, SQL, MD, HTML e JS com busca ampla

Resultados relevantes:

- os ZIPs acessiveis com `anamnese_questionarios.csv` mostraram apenas `Principal`
- os backups acessiveis de 2026-03-30, 2026-04-06 e 2026-04-13 nao trouxeram `Anamnese de Saude`, `Anamnese pessoal`, `Ficha complementar` ou `Implante`
- a busca textual ampla encontrou menções aos nomes em docs, scripts e relatorios, mas nao como fonte de dados confiavel com os registros esperados

Fonte mais promissora localizada:

- nenhuma fonte confiavel com os cinco questionarios foi encontrada

## 9. Diagnostico provavel

Evidencias apontam para:

- dados ausentes na clinica do Gleisson
- nao foi localizada fonte confiavel dos quatro questionarios ausentes
- o endpoint esta filtrando corretamente por `current_user.clinica_id`
- frontend nao parece ser a causa principal, porque a API autenticada ja retorna `Array(1)`

## 10. Plano seguro recomendado

Como nao foi encontrada fonte confiavel com os cinco questionarios:

- nao restaurar automaticamente
- localizar outro backup externo/manual, se existir
- se o usuario autorizar e fornecer a fonte correta, reconstruir manualmente os quatro questionarios ausentes com perguntas e validacao posterior

Se uma fonte confiavel aparecer no futuro, o plano deve incluir:

1. backup do banco atual
2. export dos registros atuais de `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`
3. comparacao por nome e `clinica_id`
4. inserir somente os questionarios ausentes
5. inserir perguntas relacionadas
6. nao mexer em respostas existentes sem mapeamento
7. validar endpoint autenticado
8. testar no navegador

## 11. O que nao foi alterado

Confirmado:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum dado foi inserido
- nenhum dado foi atualizado
- nenhum dado foi apagado
- nenhum commit foi feito

## 12. Checks executados

- `node --check frontend/app.js`
- `git status --short`
- `git diff --stat`

## 13. Proximo teste recomendado

Sem qualquer correcao aplicada, o navegador continuara mostrando apenas `Principal` ate que haja restauracao ou correcao de dados.

## 14. Confirmacao final

Esta etapa foi apenas diagnostica. Nenhuma logica funcional foi alterada.

## 15. Onde testar depois da futura correcao

1. Fazer Ctrl+F5.
2. Abrir Anamnese.
3. Abrir lista de Questionarios.
4. Confirmar que aparecem:
   - Anamnese de Saude
   - Anamnese pessoal
   - Ficha complementar
   - Implante
   - Principal
5. Selecionar cada questionario.
6. Confirmar perguntas de cada questionario.
7. Abrir ficha de paciente.
8. Validar aba/fluxo de Anamnese.
9. Confirmar console sem `ReferenceError` ou `TypeError`.
