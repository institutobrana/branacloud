# Encerramento ADM - Cobrancas React

Data de encerramento: 2026-07-23.

## Escopo encerrado

A frente `ADM -> Cobrancas` foi concluida em modo read-only no frontend React, sem alterar backend, banco, migration, endpoint, seed, webhook, fluxo financeiro ou AWS.

Entrega consolidada:

- rota `/app/adm/cobrancas`;
- guard ADM;
- shell global em L;
- toolbar final `Atualizar | Exportar CSV | Ver detalhes | Ver conta | Buscar cobranca`;
- listagem real de `GET /superadmin/cobrancas?limit=80`;
- tabela compacta com selecao unica;
- filtros por coluna;
- ordenacao;
- controle de colunas visiveis;
- rodape;
- loading;
- vazio real;
- vazio por filtros;
- erro total;
- erro em refresh;
- exportacao CSV client-side;
- navegacao `Ver conta` por `clinica_id`;
- modal read-only `Detalhes da cobranca`.

## Inventario dos arquivos da frente

### Exclusivos de Cobranças

- `frontend-react/src/features/admin/billing/BillingPage.jsx`
- `frontend-react/src/features/admin/billing/components/BillingDetailsModal.jsx`
- `frontend-react/src/features/admin/billing/components/BillingToolbarContent.jsx`
- `frontend-react/src/features/admin/billing/utils/adminBillingCsv.js`
- `frontend-react/src/features/admin/billing/utils/adminBillingDetails.js`
- `frontend-react/tests/adminBilling.test.js`
- `frontend-react/tests/adminBillingDetails.test.js`
- `docs/implementacao_adm_cobrancas_fase_1_leitura.md`
- `docs/implementacao_adm_cobrancas_ver_detalhes.md`
- `docs/auditoria_adm_cobranca_react.md`

### Mistos, mas com alteracao aplicada para Cobranças

- `frontend-react/src/features/admin/admin.css`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/matriz_paridade_painel_adm_legado_react.md`
- `docs/plano_migracao_funcional_painel_adm_react.md`

### Alheios, preservados sem inclusao no encerramento

Todos os demais arquivos modificados ou untracked no worktree pertencem a outras frentes, auditorias, testes, assets temporarios, rascunhos ou materiais de apoio e ficaram fora deste encerramento.

## Classificacao final

- Exclusivos: arquivos criados ou alterados diretamente para a frente `ADM -> Cobrancas`.
- Mistos: documentos compartilhados do roadmap e do contrato que receberam apenas as seções de Cobranças.
- Alheios: todo o restante do worktree, preservado sem stage.

## Validacoes executadas

- `node --test frontend-react/tests/adminBilling.test.js frontend-react/tests/adminBillingDetails.test.js`
- `node --test frontend-react/tests/adminBilling.test.js frontend-react/tests/adminBillingDetails.test.js frontend-react/tests/adminClinics.test.js frontend-react/tests/adminUsersDetails.test.js frontend-react/tests/adminRoutes.test.js`
- `node --test frontend-react/tests/admin*.test.js`
- `npm.cmd run build` em `frontend-react`
- `Invoke-WebRequest http://localhost:5173/app/adm/cobrancas`
- `Invoke-WebRequest http://localhost:8000/health`

## Resultado das validacoes

- Testes: aprovados.
- Build: aprovado.
- Runtime local: front e backend responderam `200`.
- `GET /superadmin/cobrancas?limit=80`: confirmado com `[]` no ambiente local.

## Observacoes finais

- O stage deve permanecer seletivo.
- Nao houve commit antes deste encerramento.
- Nao houve push antes deste encerramento.
- As alteracoes alheias existentes no worktree nao foram limpas, revertidas ou incluídas.
