# Auditoria fina documental — interface administrativa de usuários no frontend/app.js

## Resumo executivo

A interface administrativa de usuários está concentrada no `frontend/app.js` e opera como um bloco amplo de administração, misturando lista, criação, edição, senha, vínculos, permissões e algumas ações de apoio ao menu administrativo.

O recorte mostra que a UI de usuários é funcionalmente coerente, mas ainda não isolada. Ela depende de vários estados globais, de um conjunto grande de caches e de muitas chamadas a `requestJson()` para diferentes subfluxos.

Mesmo sem reauditar o backend em profundidade, o comportamento visível no frontend mostra contratos rígidos para:

- listar usuários da clínica;
- abrir o painel administrativo;
- criar e editar usuário;
- alterar/verificar senha;
- abrir vínculos por perfil;
- abrir e salvar permissões;
- bloquear a conta base `Clínica`;
- respeitar grant protegido para áreas sensíveis.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`
- `backend/routes/user_admin_routes.py` apenas para contexto
- Documentos de auditoria anteriores desta trilha

## Funções/blocos do frontend envolvidos

| Bloco/função | Papel prático | Observação |
|---|---|---|
| `showUsersPanel()` / `usersAttachOverlay()` / `usersDetachOverlay()` | abre, flutua e fecha o painel | controla o shell administrativo |
| `usersHasOpenChildModal()` / `usersCanClosePanel()` | trava fechamento quando há modais filhos | evita perda de contexto |
| `usersCarregarCombos()` | carrega listas auxiliares para cadastro | prepara prestador, unidade e tipos |
| `carregarUsuarios()` | busca e renderiza a lista | é o ponto central da tela |
| `usersAbrirModalNovo()` | inicia criação | pré-carrega código e combos |
| `usersAbrirModalEditar()` / `usersEditarSelecionado()` | abre edição | reutiliza estado da lista |
| `usersSalvarEstrutural()` / `usersSalvarNovo()` | grava cadastro/edição | concentra criação e edição |
| `usersSalvarSenha()` | altera senha | trata mensagem de erro e reabre fluxo de sessão quando necessário |
| `usersExcluirSelecionado()` | exclui usuário | bloqueia conta base protegida |
| `usersAbrirPermissoes()` / `usersSalvarPermissoes()` | abre e salva permissões | painel próprio de permissões |
| `usersAbrirSenhaSessaoAtual()` | fluxo de troca de senha da sessão | conecta o usuário logado ao painel |
| `usersAbrirImpressos()` / `usersAbrirPreferencias()` | ações auxiliares do menu | ficam no mesmo bloco administrativo |

## Fluxo de abertura e listagem de usuários

### Sequência observada

1. O botão de entrada no menu chama `abrirPainelAdministradorToolbar()`.
2. O painel de usuários é mostrado por `showUsersPanel(true)`.
3. O overlay é anexado por `usersAttachOverlay()`.
4. A lista é carregada por `carregarUsuarios()`.
5. Se houver `usersGrantOverride`, a lista tenta primeiro `requestJsonBase()` com `X-Protected-Grant`.
6. Caso não haja grant, usa `requestJson()` normal com auth.
7. A resposta alimenta `usersCache` e o grid é renderizado.

### Contratos aparentes

- a lista deve representar usuários da mesma clínica;
- o grid depende de campos como nome, e-mail, clínica e estado;
- a interface assume que a tela de usuários pode continuar viva mesmo com modais internos abertos.

## Fluxo de criação de usuário

### Sequência observada

1. `usersAbrirModalNovo()` inicializa o modo de criação.
2. `usersCarregarCombos()` prepara os dados de vínculo.
3. O frontend pede `GET /admin/users/proximo-codigo`.
4. O modal é preenchido por `usersPreencherModal(null)`.
5. `usersSalvarEstrutural()` valida campos e monta payload.
6. Em modo novo, exige senha e confirmação.
7. O frontend envia `POST /admin/users`.
8. Ao concluir, fecha modal, atualiza status e recarrega lista.

### Payload aparente de criação

- `codigo`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `prestador_row_id`
- `unidade_row_id`
- `ativo`
- `is_admin`
- `forcar_troca_senha`
- `senha`
- `confirma_senha`

## Fluxo de edição de usuário

### Sequência observada

1. `usersEditarSelecionado()` valida se o usuário pode ser manipulado.
2. `usersAbrirModalEditar()` abre o modal com o registro selecionado.
3. `usersSalvarEstrutural()` monta o mesmo payload base da criação.
4. Se houver alteração de senha no mesmo modal, o frontend pede senha atual e nova senha.
5. O fluxo de senha usa `POST /admin/users/change-password`.
6. Depois a edição cadastral segue por `PATCH /admin/users/{user_id}`.
7. Em sucesso, fecha modal e recarrega a lista.

### Decisão crítica

- o frontend mistura edição cadastral e troca de senha no mesmo caminho estrutural;
- isso reduz telas, mas aumenta a fragilidade do contrato.

## Fluxo de senha e verificação de senha

### Sequência observada

1. O fluxo de senha usa `usersSalvarSenha()`.
2. O frontend monta `usuario`, `senha_atual`, `nova_senha`, `confirma_senha` e `codigo`.
3. O endpoint chamado é `POST /admin/users/change-password`.
4. Se a senha atual estiver incorreta, o frontend reabre o fluxo de senha da sessão atual.
5. `usersPermConfirmPassword()` também usa `POST /admin/users/{user_id}/verify-password` para confirmar acesso ao painel de permissões.

### Fallbacks relevantes

- mensagem de senha incorreta reabre o fluxo de confirmação da sessão;
- confirmação vazia ou divergente é bloqueada no cliente;
- o frontend trata mensagens textuais do backend como parte do contrato.

## Fluxo de vínculo com prestador e unidade

### Sequência observada

1. O modal de usuário carrega listas auxiliares.
2. `usersSalvarEstrutural()` lê `usersModalPrestador` e `usersModalUnidade`.
3. Esses campos entram no payload como `prestador_row_id` e `unidade_row_id`.
4. O backend devolve o usuário já com os campos de vínculo preenchidos.
5. O frontend usa a mesma lista para editar e para criar.

### Observação

- o vínculo não é uma tela separada; ele está acoplado ao cadastro/edição de usuário.

## Fluxo de ativação e inativação

### Sequência observada

1. O checkbox de ativo é lido como parte do modal.
2. `usersSalvarEstrutural()` transforma o estado para o payload.
3. `usersExcluirSelecionado()` também respeita bloqueio da conta base.
4. Em sessão, o logout limpa caches e fecha o painel.

### Observação

- o frontend trata ativação/inativação como parte da edição, não como fluxo isolado.

## Fluxo de permissões no frontend, apenas para contexto

- `usersAbrirPermissoes()` carrega o esquema e o estado do usuário.
- `usersSalvarPermissoes()` envia o payload de permissões.
- `usersPermBuildPayload()` alterna entre `permissoes` e `easy_modules/easy_funcoes`.
- O painel mostra tabs de acesso e perfis.
- A conta base `Clínica` é protegida também no frontend.

## Endpoints consumidos

- `GET /admin/users`
- `GET /admin/users/proximo-codigo`
- `POST /admin/users`
- `PATCH /admin/users/{user_id}`
- `DELETE /admin/users/{user_id}`
- `POST /admin/users/change-password`
- `POST /admin/users/{user_id}/verify-password`
- `GET /admin/users/permissions/schema`
- `GET /admin/users/{user_id}/permissions`
- `PATCH /admin/users/{user_id}/permissions`
- `GET /admin/users/{user_id}/profiles`
- `PATCH /admin/users/{user_id}/profiles`

## Payloads aparentes principais

### Cadastro / edição

- `codigo`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `prestador_row_id`
- `unidade_row_id`
- `ativo`
- `is_admin`
- `forcar_troca_senha`
- `senha`
- `confirma_senha`

### Senha

- `usuario`
- `senha_atual`
- `nova_senha`
- `confirma_senha`
- `codigo`

### Permissões

- `permissoes`
- `easy_modules`
- `easy_funcoes`
- `easy_mode`

### Perfis / vínculos

- `perfil_id`
- `prestador_ids`

## Decisões críticas e fallbacks

- `usersGrantOverride` tenta manter a lista aberta quando há grant protegido.
- `usersCanManageSelected()` barra a conta base `Clínica`.
- `usersSalvarEstrutural()` decide entre criação e edição pelo `usersModalMode`.
- Se houver troca de senha no modal de edição, o frontend usa fluxo adicional de senha antes de salvar.
- `usersAbrirPermissoes()` adapta a UI para modo fácil ou completo com base no payload retornado.
- O painel de usuários compartilha o mesmo escopo visual com permissões e perfis, o que simplifica navegação mas aumenta acoplamento.

## Partes mais misturadas com o restante do menu administrativo

- abertura do painel administrativo de usuários;
- grant protegido usado em lista de usuários;
- ações de impressos e preferências no mesmo bloco;
- permissões e perfis no mesmo painel;
- senha de usuário e senha da sessão convivendo no mesmo espaço de eventos;
- bloqueios e overlays compartilhados com outros painéis do sistema.

## Pontos mais frágeis

- mistura de criação, edição e troca de senha no mesmo método estrutural;
- contrato de mensagem de erro de senha;
- dependência de `usersGrantOverride` na listagem;
- bloqueio da conta base `Clínica` espalhado por vários handlers;
- decisão do frontend entre modo fácil e modo completo no painel de permissões;
- acoplamento alto com a lista global de usuários e com o estado de seleção.

## Riscos críticos

- quebrar criação ou edição e travar o painel administrativo;
- perder o fluxo de troca de senha e confirmação;
- permitir ação sobre a conta base `Clínica`;
- comprometer o vínculo com prestador/unidade;
- fazer o painel de permissões abrir em estado incoerente;
- quebrar a recarga da lista após salvar;
- confundir uma edição cadastral com uma alteração de senha.

## O que não deve ser modularizado ainda

- painel administrativo de usuários como um todo;
- criação/edição e troca de senha no mesmo bloco de UI sem nova separação;
- vínculo com prestador/unidade acoplado ao modal principal;
- permissões e perfis dentro do mesmo workspace administrativo;
- bloqueio da conta base `Clínica`;
- lógica de `usersGrantOverride` e lista privilegiada;
- handlers de overlay e fechamento compartilhados com outros painéis.

## Lacunas restantes

- auditoria fina de `usersCarregarCombos()` e do conteúdo dos selects;
- auditoria fina de `usersAbrirImpressos()` e `usersAbrirPreferencias()`;
- auditoria fina da renderização da tabela e dos estados de seleção;
- auditoria fina da relação entre permissões e a lista principal fora do painel.

## Próxima auditoria fina recomendada

- Auditoria fina de `usersCarregarCombos()` e dos datasets de vínculo, para fechar a parte de criação/edição sem reabrir o backend de permissões.
