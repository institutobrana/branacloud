# Implementação do seed obrigatório de Anamnese

## 1. Contexto

Os seeds obrigatórios de Anamnese foram definidos como:
- `Principal`
- `Implante`
- `Ficha complementar`

Nesta etapa:
- `Anamnese de Saúde` não faz parte do seed obrigatório;
- `Anamnese pessoal` não faz parte do seed obrigatório;
- o `Principal` oficial do seed obrigatório é a versão atual validada com `17` perguntas.

## 2. Estado inicial

- branch atual preservada no repositório de trabalho
- `frontend/app.js` sem alteração funcional
- `frontend/index.html` sem alteração funcional
- o backend funcional já estava estável antes desta etapa
- os scripts de dry-run e de importação EDS70 já existiam como apoio

## 3. Alteração em novas clínicas

Arquivo alterado:
- `backend/services/signup_service.py`

### O que foi feito

O helper `garantir_anamnese_padrao_clinica()` passou a trabalhar com um conjunto oficial de três seeds:
- `Principal`
- `Implante`
- `Ficha complementar`

### Comportamento atual

- a lógica é idempotente
- se o questionário já existir para a clínica, ele não é duplicado
- se o questionário já existir, ele não é alterado
- perguntas só são criadas quando o questionário é criado pela primeira vez
- não há mexida em `Anamnese de Saúde`
- não há mexida em `Anamnese pessoal`
- não há mexida em respostas

## 4. Backfill para clínicas existentes

Script criado:
- `backend/scripts/anamnese_seed_obrigatorio_backfill.py`

### Comportamento do script

- sem `--execute`, ele faz apenas dry-run e validação
- com `--execute`, ele roda em transação
- cria backup CSV antes de escrever
- faz rollback se houver erro
- não altera questionários já existentes
- não altera `Principal` existente
- não importa respostas

## 5. Backup criado

Pasta de backup utilizada:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\backups\anamnese_seed_backfill_20260515_122507`

Arquivos criados:
- `anamnese_questionarios_before_seed_backfill.csv`
- `anamnese_perguntas_before_seed_backfill.csv`
- `anamnese_respostas_before_seed_backfill.csv`
- `anamnese_seed_backfill_validation_before.txt`

Observação:
- `pg_dump` não estava disponível nesta máquina, então o backup foi CSV-only.

## 6. Resultado do dry-run sem escrita

O dry-run original, executado antes da escrita, confirmou:
- clínicas totais: `3`
- questionários a criar: `4`
- perguntas a criar: `48`
- `Principal` preservado em todas as clínicas

Depois do backfill real, uma nova execução sem escrita confirmou o estado idempotente atual:
- questionários a criar: `0`
- perguntas a criar: `0`
- `Principal` permanece preservado

## 7. Resultado do backfill real

Execução real:
- `--execute` foi utilizado
- commit ocorreu com sucesso
- rollback não foi necessário

Quantidade criada:
- questionários inseridos: `4`
- perguntas inseridas: `48`

## 8. Validação pós-backfill

Resultado verificado no banco:
- `Principal` presente em `3` clínicas, com `17` perguntas em cada uma
- `Implante` presente em `3` clínicas, com `12` perguntas em cada uma
- `Ficha complementar` presente em `3` clínicas, com `12` perguntas em cada uma
- `Anamnese de Saúde` e `Anamnese pessoal` não foram criadas como seeds obrigatórios
- respostas não foram alteradas
- não houve duplicidade por `nome + clinica_id`

Matriz pós-backfill salva em:
- `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv`

## 9. O que não foi alterado

Confirmo que:
- `frontend/app.js` não foi alterado
- `frontend/index.html` não foi alterado
- endpoints não foram alterados nesta etapa
- `Principal` existente não foi alterado
- `Anamnese de Saúde` não foi criada como seed obrigatório
- `Anamnese pessoal` não foi criada como seed obrigatório
- respostas não foram importadas ou alteradas
- nenhum dado foi apagado
- nenhum commit Git foi feito

## 10. Checks executados

- `node --check frontend/app.js`
- `python -m py_compile backend/scripts/anamnese_seed_obrigatorio_dry_run.py`
- `python -m py_compile backend/scripts/anamnese_seed_obrigatorio_backfill.py`
- `python -m py_compile backend/services/signup_service.py`
- `git status --short`
- `git diff --stat`

## 11. Onde testar

1. Entrar com `gleissontel@gmail.com`.
2. Abrir Anamnese.
3. Confirmar os cinco questionários já recuperados.
4. Em outra conta/clínica existente:
   - confirmar `Principal`;
   - confirmar `Implante`;
   - confirmar `Ficha complementar`.
5. Criar uma nova conta/clínica de teste, se o fluxo permitir:
   - confirmar que nasce com `Principal`;
   - confirmar que nasce com `Implante`;
   - confirmar que nasce com `Ficha complementar`.
6. Confirmar console sem `ReferenceError` ou `TypeError`.

## 12. Pendências futuras

- analisar a variante do `Principal` do EDS70 com `35` perguntas separadamente;
- analisar a resposta órfã separadamente;
- decidir sobre migração de respostas EDS70 separadamente.
