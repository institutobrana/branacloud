# Encerramento temporario - Materiais

## 1. Objetivo

Registrar o fechamento temporario da frente `Tabelas -> Materiais de estoque` no novo frontend React do Brana Cloude, consolidando o que ja foi entregue e deixando a frente em pausa controlada sem abrir nova funcionalidade.

## 2. Referencias usadas

- `README.md`
- `docs/00_master_guide.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/frontend_react_padrao_shell_modulos_administrativos.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/contrato_implementacao_procedimentos_genericos_frontend_react.md`

## 3. O que foi auditado

- Local de entrada da frente no novo frontend React.
- Shell visual administrativo com lateral e barra horizontal em L.
- Fluxo da listagem principal, filtros e tabelas.
- Modal de tabela de materiais.
- Modal de material com abas `Principal` e `Detalhes`.
- Rotas e contratos de API relacionados a listas, materiais, indices e auxiliares.
- Campos reais e dependencias visuais do modal, inclusive a correcao textual de `Apresentação`.
- Modais proprios de confirmacao/aviso para exclusao de material e tabela.

## 4. O que foi implementado

### Shell e listagem

- Entrada lateral em `Tabelas -> Materiais de estoque`.
- Shell em `L` com barra lateral e barra horizontal integradas.
- Barra horizontal com acoes de tabela e material.
- Filtros principais dentro da barra horizontal.
- Tabela principal com largura e centralizacao ajustadas.
- Nome lateral ajustado para `Materiais`.

### Modal de tabela

- Modal proprio para `Nova tabela`.
- Modal proprio para `Alterar tabela`.
- Modal proprio para `Excluir tabela` e aviso de tabela em uso.

### Modal de material

- Modal proprio para `Novo material`.
- Abas `Principal` e `Detalhes`.
- Aba `Principal` reorganizada e compactada de forma fiel ao contrato visual confirmado.
- Aba `Detalhes` com `Fabricante` como combo e `Apresentação` como campo editavel.
- Correcao textual do label `Apresentação`, eliminando mojibake.

### Confirmacoes e avisos

- Modais proprios substituindo confirm/alert nativos do navegador.
- Fluxos de exclusao preservados sem alterar regra de negocio.

## 5. Referencias tecnicas

- `backend/routes/cadastros_routes.py`
- `backend/routes/materiais_routes.py`
- `backend/models/material.py`
- `backend/models/lista_material.py`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisMaterialModal.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisTabelaModal.jsx`
- `frontend-react/src/features/materiaisEstoque/materiaisEstoqueApi.js`
- `frontend-react/src/styles/globals.css`

## 6. Estado atual

- A frente ficou funcionalmente consolidada no novo frontend React para o escopo auditado.
- O contrato visual principal foi fechado sem mexer em backend, banco ou migrations.
- O modal de material ficou alinhado ao fluxo esperado, com a aba `Detalhes` corrigida e sem mojibake.
- A listagem principal e os modais proprios de confirmacao/aviso ficaram padronizados.

## 7. Observacoes sobre Procedimentos genericos

- O ajuste recente da tabela de `Procedimentos genericos` foi mantido como parte do mesmo padrao visual de densidade e centralizacao horizontal adotado em `Materiais`.
- O fechamento atual registra essa equivalencia visual como decisao de shell compartilhado, sem reabrir a frente.

## 8. Conclusao

A frente `Materiais` fica encerrada de forma temporaria e controlada neste ponto, suficiente para pausa segura e retomada futura sem nova descoberta funcional obrigatoria.
