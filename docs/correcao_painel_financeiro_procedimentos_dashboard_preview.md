# Correcao do Painel Financeiro de Procedimentos

## Sintoma

No frontend React publicado em `/app`, o fluxo `Tabelas -> Procedimentos -> Novo` ou `Alterar` exibia:

```text
Nao foi possivel carregar o painel financeiro.
Method Not Allowed
```

## Causa

O React chama `POST /api/procedimentos/dashboard-preview` para calcular valores ainda nao persistidos no modal. O alias `/api` preserva metodo e corpo, encaminhando para `POST /procedimentos/dashboard-preview`.

O backend publicado nao tinha essa rota. Como existia a rota dinamica `/procedimentos/{procedimento_id}`, o caminho `dashboard-preview` terminava sem metodo `POST` permitido, resultando em `405 Method Not Allowed`.

## Contrato implementado

Rota:

```text
POST /procedimentos/dashboard-preview
```

Entrada:

```text
procedimento_id: opcional
tabela_id: opcional conforme contrato do modal
procedimento_generico_id: opcional
preco: numero, padrao 0
tempo: numero inteiro, padrao 0
custo_lab: numero, padrao 0
custo: numero, padrao 0
materiais: lista de material_id, quantidade e custo_und opcional
```

Saida:

```text
itens: lista com um item financeiro
grafico: lista com um item financeiro
cenario: parametros financeiros da clinica
materiais: resumo dos materiais considerados
```

## Caracteristicas de seguranca

- A rota exige usuario autenticado.
- O router mantem permissao do modulo `procedimentos`.
- Todas as consultas usam `current_user.clinica_id`.
- `clinica_id` nao e aceito do cliente.
- Procedimento de outra clinica nao retorna dados.
- Material de outra clinica nao retorna dados.
- A rota e semanticamente somente leitura, apesar de usar `POST` para transportar o estado provisorio do modal.
- Nao executa `db.add`, `db.delete`, `db.commit`, `flush`, `INSERT`, `UPDATE` ou `DELETE`.

## Casos suportados

- Novo procedimento sem `procedimento_id`.
- Alteracao de procedimento com `procedimento_id`.
- Materiais enviados explicitamente pelo modal.
- Materiais vinculados ao procedimento existente quando o modal nao envia lista.
- Materiais herdados do procedimento generico quando aplicavel.

## Testes

Testes backend adicionados em `backend/tests/test_procedimentos_dashboard_preview.py`:

- Sem token retorna `401`.
- Preview autenticado de novo procedimento retorna `200`.
- Preview autenticado de procedimento existente da mesma clinica retorna `200`.
- Procedimento ou material de outra clinica nao vaza dados.
- Payload invalido retorna `422`.
- `POST /procedimentos/dashboard-preview` nao colide com `/procedimentos/{procedimento_id}`.
- Alias `POST /api/procedimentos/dashboard-preview` preserva metodo, corpo, status e estrutura.
- O preview nao altera quantidade de procedimentos nem vinculos.

Teste frontend adicionado em `frontend-react/tests/procedimentosDashboardPreview.test.mjs`:

- Confirma `POST`.
- Confirma URL `/api/procedimentos/dashboard-preview`.
- Confirma `Content-Type: application/json`.
- Confirma payload serializado.
- Confirma normalizacao da resposta para o hook/painel.

## Deploy futuro

Esta correcao e local e documental nesta etapa. Nao houve publicacao AWS.

Em uma proxima rodada de publicacao, o plano e gerar nova imagem, registrar nova task definition e atualizar o servico ECS.

Rollback futuro permanece disponivel retornando para:

```text
default-brana-hml-backend:8
```

## Banco e migrations

Nao ha alteracao de schema, banco, RDS ou migrations.
