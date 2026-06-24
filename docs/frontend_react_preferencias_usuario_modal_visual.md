# Frontend React - Modal visual de Preferências do usuário

## Objetivo da etapa

Implementar somente o modal visual da tela Preferências no `frontend-react`, com base no contrato funcional documentado anteriormente, sem persistência e sem chamadas de API.

## Contrato funcional usado como base

- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`

## Arquivos lidos

- `docs/frontend_react_preferencias_usuario_contrato_funcional.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/package.json`

## Arquivos criados

- `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`
- `frontend-react/src/features/preferencias/preferenciasUsuario.css`
- `docs/frontend_react_preferencias_usuario_modal_visual.md`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Como o modal visual foi criado

- Foi criado um componente dedicado em `frontend-react/src/features/preferencias/PreferenciasUsuarioModal.jsx`.
- O modal usa `Modal`, `Tabs`, `Form`, `Select`, `Input`, `Checkbox`, `Avatar` e `message` do Ant Design.
- O layout foi estruturado em estilo desktop/ERP, com abas no topo, conteúdo em colunas e ações alinhadas à direita.
- A aba NFS-e foi tratada como pendência visual, sem campos inventados.

## Como a abertura do modal foi ligada à topbar

- O item `Preferências` já existente no menu do usuário foi usado como gatilho mínimo.
- `App.jsx` passou a manter o estado local `preferenciasOpen`.
- O handler do menu abre o modal quando a ação é `preferencias`.
- Não foi criada nova ação funcional nem novo botão de navegação.

## Abas implementadas visualmente

- Geral
- Ficha clínica
- Orçamento
- NFS-e

## Campos implementados visualmente na aba Geral

- área de foto/avatar;
- botões visuais de câmera/upload;
- Nome;
- CPF;
- CRO;
- UF;
- Apresentação/CV resumido;
- Envio padrão para mensagens;
- Conta bancária padrão;
- Estoque padrão;
- Módulo de abertura;
- combo com as opções observadas no contrato.

## Campos implementados visualmente na aba Ficha clínica

- Especialidade(s);
- botão Incluir;
- área/lista grande de especialidades incluídas;
- checkbox `Abrir automaticamente painel de aceleradores`;
- checkbox `Solicitar assinatura eletrônica na finalização de procedimentos`;
- lista visual de especialidades observadas no contrato.

## Campos implementados visualmente na aba Orçamento

- Modelo padrão de orçamentos;
- Mensagem para impressão;
- checkbox `Apresentar CPF/CNPJ`;
- checkbox `Apresentar CRO/UF`.

## Como a aba NFS-e foi tratada como pendência

- A aba foi criada visualmente.
- Não foram inventados campos novos.
- Foi exibida apenas uma mensagem segura de pendência de mapeamento complementar.

## Confirmações funcionais

- `Gravar preferências` não salva dados.
- `Gravar preferências` não chama API.
- `Cancelar` fecha o modal.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.
- Backend não foi alterado.
- Frontend legado não foi alterado.
- Banco e migrations não foram alterados.
- `Dashboard` foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- Login/logout foram preservados.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
