# Implementacao - ADM Usuarios - Fase 1 leitura

Data: 2026-07-21

## Escopo implementado

- Rota React validada: `/app/adm/usuarios`.
- Item `ADM -> Usuarios` liberado no submenu administrativo.
- Consulta real ao endpoint existente `GET /superadmin/usuarios`.
- Tela modular em `frontend-react/src/features/admin/users/`.
- Toolbar global do shell ADM com apenas `Atualizar` e `Buscar usuario`.
- Tabela compacta com selecao unica, filtros por coluna, ordenacao, controle de colunas visiveis e rodape.
- Usuario de sistema e conta proprietaria aparecem na listagem com indicacao visual de protecao.

## Contrato de dados usado

O endpoint de leitura retorna usuarios com dados do usuario e da clinica associada:

- `id`
- `nome`
- `email`
- `is_admin`
- `ativo`
- `clinica_id`
- `clinica_nome`
- `clinica_email`
- `clinica_ativa`
- `clinica_tipo_conta`
- `clinica_status`
- `clinica_plano`
- `clinica_trial_ate`
- `clinica_data_ativacao`
- `clinica_cnpj`
- `is_owner_account`
- `is_system_user`

`setup_completed` nao faz parte do payload atual de `GET /superadmin/usuarios`; por isso a coluna opcional de primeiro acesso exibe `Nao disponivel` quando habilitada, sem inferencia ou mock.

## Nao implementado nesta fase

- Criar usuario.
- Alterar usuario.
- Ativar ou inativar usuario.
- Alternar perfil administrativo.
- Redefinir senha.
- Excluir usuario.
- Exportar CSV.
- Modais de escrita.
- Endpoints POST, PUT, PATCH ou DELETE.

## Arquitetura

- Service: `frontend-react/src/features/admin/users/services/adminUsersApi.js`.
- Normalizador: `frontend-react/src/features/admin/users/normalizers/adminUsersNormalizer.js`.
- Hook de dados: `frontend-react/src/features/admin/users/hooks/useAdminUsers.js`.
- Hook de tabela: `frontend-react/src/features/admin/users/hooks/useAdminUsersTableState.js`.
- Componentes: `frontend-react/src/features/admin/users/components/`.
- CSS: regras `admin-users-*` em `frontend-react/src/features/admin/admin.css`.

## Validacao esperada

- A tela deve usar a barra global `admin-shell-band` montada em `App.jsx`.
- A pagina de usuarios nao deve criar faixa local `brana-shell-band`.
- A toolbar deve conter somente controles de leitura.
- A tabela deve renderizar dados reais autenticados e preservar filtros/ordenacao locais.
- Em telas pequenas, a tabela pode ocupar 100% da largura sem overflow horizontal da pagina.

## Atualizacao - contrato da toolbar futura

Auditoria/contrato criados em 2026-07-21:

- `docs/auditoria_toolbar_adm_usuarios_historico_atual.md`;
- `docs/contrato_toolbar_adm_usuarios_react.md`.

A Fase 1 permanece sem acoes mutaveis. A toolbar atual continua restrita a `Atualizar` e `Buscar usuario`.

## Atualizacao - Exportacao CSV read-only

Em 2026-07-21, a acao `Exportar CSV` foi implementada na toolbar global de `ADM -> Usuarios`.

Contrato aplicado:

- endpoint existente `GET /superadmin/usuarios/export.csv`;
- token Bearer exclusivamente no header;
- download via blob;
- nome do arquivo lido de `Content-Disposition`;
- fallback sanitizado `usuarios-adm-YYYY-MM-DD.csv`;
- busca server-side atual (`q`) enviada ao backend;
- filtros locais, ordenacao e selecao preservados na tabela;
- nenhuma acao mutavel adicionada.

Documento complementar: `docs/implementacao_adm_usuarios_exportacao_csv.md`.

## Atualizacao - Ver detalhes read-only

Em 2026-07-21, a acao `Ver detalhes` foi adicionada a toolbar global de `ADM -> Usuarios`.

Contrato aplicado:

- botao contextual a selecao unica da tabela;
- desabilitado sem usuario selecionado ou durante carregamento inicial;
- modal `Detalhes do usuario` somente leitura;
- footer unico `Fechar`;
- dados reutilizados da listagem normalizada, sem endpoint novo;
- campos ausentes exibidos como `Nao disponivel`;
- badge `Protegido` quando o backend informa usuario sistemico ou conta proprietaria;
- fechamento do modal sem limpar selecao;
- limpeza da selecao e fechamento do modal quando filtros, busca ou refresh removem o usuario visivel;
- nenhuma acao mutavel adicionada.

Documento complementar: `docs/implementacao_adm_usuarios_ver_detalhes.md`.

## Atualizacao - Toolbar no padrao visual Brana

Em 2026-07-22, a toolbar global de `ADM -> Usuarios` foi corrigida para reutilizar o padrao visual dos modulos de tabelas.

Alteracoes de contrato visual:

- `Button` do Ant Design e icones foram removidos dos controles de acao;
- `Atualizar`, `Exportar CSV` e `Ver detalhes` usam `button type="button"` com `auxiliary-shell-button`;
- o agrupador de acoes reutiliza `materiais-estoque-toolbar-actions`;
- a busca permanece no grupo direito;
- `Ver detalhes` passa a resolver a selecao a partir da lista normalizada carregada, preservando o modal read-only.

Documento complementar: `docs/correcao_toolbar_adm_usuarios_padrao_visual.md`.

## Atualizacao - Ver conta read-only

Em 2026-07-22, a acao `Ver conta` foi adicionada a toolbar global de `ADM -> Usuarios`.

Contrato aplicado:

- botao textual no mesmo padrao visual `auxiliary-shell-button`;
- ordem `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Ver conta`, `Buscar usuario`;
- habilitado somente quando ha usuario selecionado com `clinica_id` valido;
- navegacao interna para `/app/adm/clinicas` usando estado transitorio controlado por `App.jsx`;
- selecao automatica da clinica por ID exato;
- nenhuma mutacao de usuario ou clinica.

Documento complementar: `docs/implementacao_adm_usuarios_ver_conta.md`.
