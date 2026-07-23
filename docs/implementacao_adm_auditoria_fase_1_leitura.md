# Implementação ADM Auditoria - Fase 1 leitura

## 1. Status

A Fase 1 funcional do painel `ADM -> Auditoria` foi implementada no frontend React.

## 2. Escopo entregue

- rota funcional em `/app/adm/auditoria`;
- item `Auditoria` habilitado no menu ADM;
- shell global em `L`;
- toolbar horizontal read-only;
- botão `Atualizar`;
- botão `Exportar CSV`;
- busca local por evento;
- listagem real do endpoint `GET /superadmin/auditoria?limit=80`;
- tabela compacta com cinco colunas;
- seleção única;
- filtros por coluna;
- ordenação;
- controle de colunas;
- rodapé;
- loading;
- refreshing;
- vazio;
- erro;
- testes;
- documentação.

## 3. Colunas exibidas

1. `ID`
2. `Data`
3. `Ação`
4. `Autor`
5. `Alvo`

## 4. Campos reais normalizados

O frontend consome os campos:

- `id`;
- `actor_user_id`;
- `actor_email`;
- `acao`;
- `alvo_tipo`;
- `alvo_id`;
- `detalhes_json`;
- `ip`;
- `criado_em`.

## 5. Campos não implementados nesta fase

- exportação CSV;
- modal de detalhes;
- navegação para alvo;
- paginação server-side;
- mutações;
- backend novo;
- banco;
- migration.

## 6. Arquivos criados

- `frontend-react/src/features/admin/audit/services/adminAuditApi.js`
- `frontend-react/src/features/admin/audit/normalizers/adminAuditNormalizer.js`
- `frontend-react/src/features/admin/audit/utils/adminAuditFormatters.js`
- `frontend-react/src/features/admin/audit/constants/adminAuditColumns.js`
- `frontend-react/src/features/admin/audit/hooks/useAdminAudit.js`
- `frontend-react/src/features/admin/audit/hooks/useAdminAuditTableState.js`
- `frontend-react/src/features/admin/audit/components/AuditToolbarContent.jsx`
- `frontend-react/src/features/admin/audit/components/AuditTable.jsx`
- `frontend-react/src/features/admin/audit/utils/adminAuditCsv.js`

## 7. Arquivos alterados

- `frontend-react/src/features/admin/audit/AuditPage.jsx`
- `frontend-react/src/features/admin/adminNavigation.js`
- `frontend-react/src/features/admin/admin.css`
- `frontend-react/src/features/admin/AdminRoutes.jsx`
- `frontend-react/src/app/App.jsx`
- `frontend-react/tests/adminRoutes.test.js`
- `frontend-react/tests/adminAudit.test.js`

## 8. Validações executadas

- testes Node do recorte de Auditoria;
- testes Node de Billing e rotas ADM;
- nenhum acesso a backend, banco ou mutation foi adicionado.

## 9. Observação

A fase inicial segue somente leitura, alinhada ao legado e ao contrato já auditado.
