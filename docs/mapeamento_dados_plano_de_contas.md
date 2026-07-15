# Mapeamento de Dados - Plano de Contas

## Fonte principal

- Backend atual do Brana Cloude
- Banco legado do EasyDental Desktop

## Backend atual

### Modelos

- `backend/models/financeiro.py`

### Tabelas ORM confirmadas

- `grupo_financeiro`
- `categoria_financeira`
- `lancamento`

### Campos confirmados

#### `grupo_financeiro`

- `id`
- `clinica_id`
- `nome`
- `tipo`

#### `categoria_financeira`

- `id`
- `clinica_id`
- `grupo_id`
- `nome`
- `tipo`
- `tributavel`

#### `lancamento`

- `id`
- `clinica_id`
- `categoria_id`
- `historico`
- `valor`
- `data_lancamento`
- `data_pagamento`
- `tipo`
- `conta`
- `situacao`
- `forma_pagamento`
- `data_vencimento`
- `data_inclusao`
- `data_alteracao`
- `documento`
- `referencia`
- `complemento`
- `tributavel`
- `parcelado`
- `qtd_parcelas`
- `parcela_atual`

### Relacionamentos confirmados

- `GrupoFinanceiro.categorias -> CategoriaFinanceira`
- `CategoriaFinanceira.grupo -> GrupoFinanceiro`
- `CategoriaFinanceira.lancamentos -> Lancamento`

## Rotas do backend

Arquivo: `backend/routes/cadastros_routes.py`

### Endpoints confirmados

- `GET /cadastros/grupos`
- `POST /cadastros/grupos`
- `PUT /cadastros/grupos/{grupo_id}`
- `DELETE /cadastros/grupos/{grupo_id}`
- `GET /cadastros/categorias/{categoria_id}/em-uso`
- `POST /cadastros/categorias`
- `PUT /cadastros/categorias/{categoria_id}`
- `DELETE /cadastros/categorias/{categoria_id}`
- `POST /cadastros/categorias/{categoria_id}/migrar-e-excluir`

### Regras de negócio confirmadas

- Grupo exige `nome` e `tipo`.
- Categoria exige `nome`, `tipo`, `grupo_id` e `tributavel`.
- Grupo não pode ser removido quando possui categorias.
- Categoria não pode ser removida quando possui lançamentos.
- Migração de categoria atualiza `categoria_id` nos lançamentos antes de excluir a origem.
- Todas as consultas operam com filtro por `current_user.clinica_id`.

### Dependência por permissão

- Os endpoints usam `require_module_access("financeiro")`.

## Banco legado EasyDental

### Tabelas observadas

- `DEF_GRUPO`
- `PLANO`
- `_GRUPO_CONTA`
- `_PLANO_CONTA`

### Evidências observadas

- `Y:\EDS70\Dados\eds70.sql`
- `Y:\EDS70\Dados\PLANO.raw`
- `Y:\EDS70\Dados\DEF_GRUPO.raw`
- `Y:\EDS70\Dados\_GRUPO_CONTA.raw`
- `Y:\EDS70\Dados\_PLANO_CONTA.raw`

## Correspondência técnica provisória

| Brana Cloud | EasyDental Desktop | Situação |
|---|---|---|
| `grupo_financeiro` | `DEF_GRUPO` / `_GRUPO_CONTA` | equivalente parcial |
| `categoria_financeira` | `_PLANO_CONTA` | equivalente parcial |
| `lancamento` | referências em `CCCIRURGIAO` e outras contas financeiras | dependência confirmada, mapeamento completo não fechado |

## O que ficou confirmado

- Grupo e categoria usam tabelas diferentes no Brana Cloud.
- Há vínculo pai-filho por `categoria_financeira.grupo_id`.
- `tributavel` existe como booleano no Brana Cloud.
- O legado usa conjunto de arquivos/dados próprios para grupos e contas.
- O contrato visual do novo React não depende de árvore única com sete colunas.
- O contrato visual do novo React depende de mestre-detalhe com grupo à esquerda e categoria à direita.

## O que ficou NÃO CONFIRMADO

- Não foi confirmado o significado funcional das colunas visuais do desktop, como cadeado e indicador verde.
- Não foi confirmado um campo de bloqueio nativo no Brana Cloud para o módulo.
- Não foi confirmado se há soft delete específico para essas tabelas.
- Não foi confirmado se há triggers, views ou sequences dedicadas ao módulo no backend atual.
- Não foi confirmado mapeamento completo de todas as dependências de outros módulos além dos lançamentos financeiros.
- Não foi confirmado o shape final dos estados vazios, loading e erro do futuro React.

## Conclusão

O backend atual já sustenta o fluxo mínimo do Plano de Contas com grupo, categoria, vínculo e migração de lançamentos. O legado desktop possui estrutura própria de grupos e contas, com indícios claros de dependência em dados financeiros e lançamentos.
