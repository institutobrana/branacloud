# Plano de seed obrigatório - Anamnese

## 1. Contexto

O sistema recuperou com sucesso a conta `gleissontel@gmail.com` na `clinica_id = 1`.

Para o seed obrigatório de Anamnese, três questionários devem existir em todas as clínicas:
- `Principal`
- `Implante`
- `Ficha complementar`

Os questionários `Anamnese de Saúde` e `Anamnese pessoal` não entram neste seed obrigatório.

## 2. O que foi validado na recuperação da conta `gleissontel@gmail.com`

- `GET /anamnese/questionarios` retornou status `200`
- a quantidade retornada foi `5`
- os questionários voltaram a aparecer no navegador
- `Principal` permaneceu com `17` perguntas
- `Implante` ficou com `12` perguntas
- `Ficha complementar` ficou com `12` perguntas
- `Anamnese de Saúde` ficou com `55` perguntas
- `Anamnese pessoal` ficou com `16` perguntas
- respostas clínicas não foram importadas

## 3. Escopo do seed obrigatório

### Inclui

- novas contas/clínicas
- clínicas existentes já cadastradas

### Exclui

- `Anamnese de Saúde`
- `Anamnese pessoal`
- respostas clínicas
- alteração automática de `Principal` já existente

## 4. Fonte candidata dos seeds

A fonte operacional mais segura para o seed obrigatório é a clínica 1 recuperada, pois ela já foi validada no sistema.

### Fonte candidata atual

- `Principal`: versão atual com `17` perguntas
- `Implante`: `12` perguntas
- `Ficha complementar`: `12` perguntas

### Ponto ainda em aberto

O EDS70 tinha uma versão alternativa de `Principal` com `35` perguntas. Essa versão deve permanecer em análise separada e não deve ser aplicada automaticamente ao seed obrigatório sem decisão explícita.

## 5. Auditoria das clínicas existentes

A auditoria identificou:
- clínica `1`: já possui `Principal`, `Implante` e `Ficha complementar`
- clínica `4`: possui `Principal`, mas não possui `Implante` nem `Ficha complementar`
- clínica `8`: possui `Principal`, mas não possui `Implante` nem `Ficha complementar`

## 6. Local recomendado para implementação

O ponto mais seguro para a criação automática em novas clínicas é a camada de bootstrap já existente em:

- `backend/services/signup_service.py`

Ali já existe a função `garantir_anamnese_padrao_clinica(db, clinica_id)` e ela já é chamada durante `criar_conta_saas`.

Recomendação conservadora:
- extrair a lógica de seed obrigatório para um helper compartilhado, se necessário;
- manter a criação automática de novas clínicas no fluxo de signup/bootstrapping já existente;
- usar um script administrativo separado para backfill das clínicas antigas;
- evitar startup/bootstrap global com escrita automática, porque isso aumenta risco de escrita inesperada.

## 7. Dry-run criado

Script de dry-run:
- `backend/scripts/anamnese_seed_obrigatorio_dry_run.py`

## 8. Resultado do dry-run

O dry-run deve confirmar:
- clínicas existentes: `3`
- clínicas com `Principal`: `3`
- clínicas com `Implante`: `1`
- clínicas com `Ficha complementar`: `1`
- questionários que seriam criados: `4`
- perguntas que seriam criadas: `48`
- alertas de duplicidade, se existirem

## 9. Riscos

- duplicidade de questionários
- sobrescrever dados personalizados
- ambiguidade entre `Principal` com `17` e `35` perguntas
- importação em clínica errada
- tentativa de mexer em respostas clínicas
- necessidade de backup antes de qualquer escrita

## 10. Plano futuro de execução real

Somente após autorização:
1. backup do PostgreSQL atual;
2. script transacional de backfill;
3. criação apenas dos seeds ausentes;
4. nenhuma alteração nos seeds já existentes;
5. validação por clínica;
6. validação via endpoint e navegador.

## 11. O que não foi alterado

Confirmo que:
- o banco não foi alterado
- o frontend não foi alterado
- o backend funcional não foi alterado
- os endpoints não foram alterados
- nenhum dado foi inserido
- nenhum dado foi atualizado
- nenhum dado foi apagado
- nenhum commit foi feito

## 12. Checks executados

- `node --check frontend/app.js`
- `python -m py_compile backend/scripts/anamnese_importar_eds70_gleisson.py`
- `python -m py_compile backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py`
- `git status --short`
- `git diff --stat`

## 13. Próxima decisão necessária

Antes de qualquer implementação real, é preciso decidir:
- usar `Principal` com `17` perguntas ou a versão EDS70 com `35` perguntas como seed oficial;
- autorizar a implementação do seed obrigatório para novas contas;
- autorizar o backfill para clínicas existentes.
