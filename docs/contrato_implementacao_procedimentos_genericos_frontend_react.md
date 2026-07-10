# Contrato de Implementação - Procedimentos Genéricos

## Contexto consolidado

A frente de `Procedimentos genéricos` já existia no legado do Brana Cloud e já possui backend, modelo ORM e vínculo com fases e materiais.

Esta etapa consolidou apenas o contrato funcional e a implementação inicial do novo frontend React.

## Fontes auditadas

- `backend/routes/cadastros_routes.py`
- `backend/routes/procedimentos_routes.py`
- `backend/models/procedimento_generico.py`
- `backend/models/procedimento.py`
- `backend/models/procedimento_tabela.py`
- `backend/models/material.py`
- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/auxiliaresApi.js`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`

## Contrato funcional confirmado

### Listagem

- `Código`
- `Procedimento genérico`
- `Especialidade`
- `Status`

### Status visual

- círculo verde = ativo
- círculo vermelho = inativo

### Barra de ações

- `Novo procedimento`
- `Altera...`
- `Elimina...`
- `Fases`
- `Materiais`

### Filtros

- `Especialidades`
- `Procedimentos`

Mapeamento da API:

- `especialidade`
- `q`

## Decisão de escopo

- Não mexer em backend nesta etapa.
- Não mexer em banco nesta etapa.
- Não inventar modal completo.
- Não inventar editor de fases.
- Não inventar editor de materiais.
- Não pedir arquivos `.ui` nesta etapa.

## Implementação inicial no React

- A rota nova foi ligada em `Tabelas > Procedimentos genéricos`.
- A página nova lista os registros do backend existente.
- Os filtros trabalham com `q` e `especialidade`.
- A listagem usa o padrão visual da frente de tabelas auxiliares.
- Os botões principais estão renderizados e com comportamento mínimo controlado.

## Próximo passo recomendado

Consolidar o modal/edição desta frente em uma etapa separada, quando houver validação visual suficiente para isso.

