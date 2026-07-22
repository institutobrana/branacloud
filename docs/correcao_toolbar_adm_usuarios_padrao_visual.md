# Correcao - Toolbar ADM Usuarios no padrao visual Brana

Data: 2026-07-22

## Escopo

Correcao visual e funcional pontual em `ADM -> Usuarios`, rota `/app/adm/usuarios`.

Nao foram alterados backend, banco, migration, presenca online, coluna `Online`, ADM Clinicas, Materiais, Medicamentos, autenticacao, endpoints, AWS, commit ou push.

## Causa visual encontrada

A toolbar de `ADM -> Usuarios` usava `Button` do Ant Design com icones importados de `@ant-design/icons`:

- `ReloadOutlined`;
- `DownloadOutlined`;
- `EyeOutlined`;
- `SearchOutlined`.

Esse padrao renderizava botoes brancos/caixados do Ant Design e divergia da barra turquesa usada nos modulos de referencia.

## Referencias auditadas

Padrao correto observado em codigo:

- `frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx`;
- `frontend-react/src/features/admin/clinics/components/ClinicsToolbarContent.jsx`;
- `frontend-react/src/features/planoContas/components/PlanoContasToolbar.jsx`;
- `frontend-react/src/features/medicamentos/MedicamentosToolbar.jsx`;
- `frontend-react/src/styles/globals.css`.

Os botoes de acao desses modulos usam `button type="button"` com `auxiliary-shell-button`, agrupados por `materiais-estoque-toolbar-actions` quando aplicavel.

## Correcao aplicada

`frontend-react/src/features/admin/users/components/UsersToolbarContent.jsx` passou a usar:

- botoes nativos;
- classe compartilhada `auxiliary-shell-button`;
- agrupador `materiais-estoque-toolbar-actions admin-users-toolbar-actions`;
- busca no grupo direito com `Input.Search`;
- estados `disabled` e `aria-busy` para `Atualizar` e `Exportar CSV`;
- guarda de clique para nao executar acao durante loading ou sem selecao.

`frontend-react/src/features/admin/admin.css` recebeu apenas regras escopadas a `admin-users-toolbar-actions` para estados `disabled`, `aria-busy` e `focus-visible`, alem de largura do `Input.Search`.

## Correcao do Ver detalhes

O botao `Ver detalhes` continuava dependendo de `selectedUser`, mas a resolucao anterior buscava o usuario em `tableState.rows`. A correcao passou a resolver o usuario selecionado a partir de `users.rows`, a lista normalizada carregada do backend, preservando o fechamento automatico quando filtro, busca ou refresh removem a linha da visao atual.

O botao permanece desabilitado sem selecao e abre o modal somente leitura quando uma linha valida esta selecionada.

## Validacao esperada

Em runtime autenticado:

1. `Atualizar`, `Exportar CSV` e `Ver detalhes` aparecem como botoes textuais turquesa integrados a barra global.
2. Nao ha botoes brancos/caixados do Ant Design nem icones na toolbar.
3. A busca permanece na direita.
4. `Ver detalhes` fica desabilitado sem linha selecionada.
5. Apos selecionar uma linha, `Ver detalhes` abre o modal `Detalhes do usuario`.
6. A coluna `Online` permanece imediatamente apos `Status`.
7. A coluna visual `Protecao` permanece fora da tabela principal.
8. Tema claro e escuro preservam contraste e foco visivel.

## Testes

Cobertura estrutural atualizada em:

- `frontend-react/tests/adminUsers.test.js`;
- `frontend-react/tests/adminUsersDetails.test.js`;
- `frontend-react/tests/adminUsersExport.test.js`.

Os testes garantem ausencia de `Button` do Ant Design na toolbar, ausencia dos icones antigos, uso de `auxiliary-shell-button`, uso do agrupador compartilhado, estado contextual do detalhe e preservacao da exportacao read-only.
