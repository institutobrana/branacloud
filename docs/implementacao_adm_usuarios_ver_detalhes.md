# Implementacao ADM Usuarios - Ver detalhes

Data: 2026-07-21

## Escopo

Foi implementada a acao read-only `Ver detalhes` na toolbar global de `ADM -> Usuarios`.

A toolbar da subetapa passa a ser:

1. `Atualizar`
2. `Exportar CSV`
3. `Ver detalhes`
4. `Buscar usuario`

## Comportamento

- O botao `Ver detalhes` fica desabilitado sem linha selecionada ou durante o carregamento inicial.
- Ao selecionar uma linha, o botao abre o modal `Detalhes do usuario`.
- O modal usa o objeto ja carregado e normalizado pela listagem.
- Nao foi criado endpoint de detalhe.
- Nao ha operacao de escrita, confirmacao, exclusao, ativacao ou reset.
- Fechar o modal preserva a selecao atual.
- Se busca, filtro local ou refresh removerem o usuario selecionado da lista visivel, a selecao e limpa e o modal fecha para evitar dado antigo.

## Campos exibidos

Secao `Identificacao`:

- ID
- Nome
- E-mail
- Tipo/perfil
- Administrador
- Status
- Usuario protegido

Secao `Conta`:

- Clinica
- ID da clinica
- E-mail da clinica
- Plano
- Status da clinica
- Trial ate

Secao `Vinculos`:

- Unidade
- Prestador
- Usuario sistemico
- Primeiro acesso

Secao `Sistema`:

- Data de inclusao
- Data de alteracao
- Ultimo acesso
- Protecao

Campos ausentes sao exibidos como `Nao disponivel`, sem inventar valores.

## Usuario protegido

Quando `is_system_user` ou indicador confiavel de conta proprietaria vem do backend, o modal exibe badge `Protegido` e explicacao read-only. A tela nao desbloqueia acao administrativa.

## Arquivos principais

- `frontend-react/src/features/admin/users/UsersPage.jsx`
- `frontend-react/src/features/admin/users/components/UsersToolbarContent.jsx`
- `frontend-react/src/features/admin/users/components/UserDetailsModal.jsx`
- `frontend-react/src/features/admin/users/utils/adminUsersDetails.js`
- `frontend-react/src/features/admin/admin.css`
- `frontend-react/tests/adminUsersDetails.test.js`

## Validacao

Validacoes automatizadas devem confirmar:

- botao contextual por selecao;
- modal read-only com footer unico `Fechar`;
- ausencia de endpoint novo e metodos `POST`, `PUT`, `PATCH` e `DELETE`;
- placeholder `Nao disponivel` para campos ausentes;
- preservacao de busca, selecao, filtros locais, ordenacao, tabela e exportacao.

Validacao runtime autenticada em `/app/adm/usuarios` deve confirmar:

- botao desabilitado sem selecao;
- botao habilitado apos selecionar linha;
- abertura do modal;
- fechamento sem limpar selecao;
- fechamento automatico quando o usuario selecionado sai da lista visivel;
- tema claro e escuro.

## Resultado runtime desta execucao

Na execucao de 2026-07-21, a validacao automatizada no navegador local foi bloqueada porque `/app/adm/usuarios` redirecionou para `/app/login`. Portanto, a checagem visual autenticada de habilitacao do botao, abertura do modal e temas claro/escuro permanece pendente de uma sessao MASTER autenticada no navegador.

## Fora do escopo

- `Novo usuario`
- `Ver conta`
- editar usuario
- ativar ou inativar usuario
- alterar perfil
- redefinir senha
- excluir usuario
- backend
- banco
- migration
- AWS
- commit
- push

## Atualizacao - correcao do acionamento na toolbar

Em 2026-07-22, a toolbar de `ADM -> Usuarios` foi padronizada visualmente com `auxiliary-shell-button` e o botao `Ver detalhes` deixou de depender dos botoes do Ant Design.

A selecao contextual continua sendo unica. O usuario selecionado agora e resolvido a partir de `users.rows`, a lista normalizada carregada do backend, enquanto a limpeza de selecao por filtro, busca ou refresh permanece controlada pela visao atual da tabela.

Documento complementar: `docs/correcao_toolbar_adm_usuarios_padrao_visual.md`.

## Atualizacao - redimensionamento visual do modal

Em 2026-07-22, o modal `Detalhes do usuario` foi compactado visualmente sem alterar dados, secoes, campos, protecao, presenca online ou comportamento read-only.

Resumo visual aplicado:

- largura reduzida de `760` para `660`;
- limite visual em `width: min(660px, calc(100vw - 32px))`;
- body rolavel com `max-height: calc(74vh - 94px)`;
- header, footer, aviso `Protegido`, titulos, linhas, labels, valores e badges compactados;
- duas colunas preservadas em desktop/tablet;
- uma coluna em telas menores;
- scroll horizontal bloqueado no body do modal.

Documento complementar: `docs/correcao_redimensionamento_modal_detalhes_usuario.md`.

## Atualizacao - segunda compactacao visual

Ainda em 2026-07-22, o modal recebeu uma segunda compactacao visual:

- largura de `660` para `580`;
- `max-height` de `74vh` para `66vh`;
- body, header, footer, aviso `Protegido`, secoes, titulos, celulas, labels, valores e badges ficaram mais densos;
- breakpoint especifico do modal passou para `760px`;
- conteudo, protecao, presenca online, ordem dos campos e comportamento read-only foram preservados.

## Atualizacao - terceira correcao visual sem scroll desktop

Ainda em 2026-07-22, a terceira correcao visual ajustou a estrategia do modal para eliminar a scrollbar interna no desktop normal:

- largura de `580` para `680`, preservando `calc(100vw - 24px)`;
- `max-height` desktop de `66vh` para `calc(100vh - 24px)`;
- body desktop sem altura fixa e sem `overflow-y: auto`;
- campos longos com ellipsis e tooltip, evitando quebra excessiva;
- scroll vertical interno permanece apenas como fallback no breakpoint pequeno;
- secoes `Identificacao`, `Conta`, `Vinculos` e `Sistema` permanecem preservadas.

## Atualizacao - ajuste horizontal final

Em 2026-07-22, o modal manteve a altura aprovada e recebeu apenas ajuste horizontal:

- largura de `680` para `800`;
- CSS `width: min(800px, calc(100vw - 24px))`;
- proporcao de colunas ajustada para `label 14% / valor 36%`;
- ellipsis e tooltip preservados em campos longos;
- `max-height`, overflow desktop, header, body, footer, padding vertical e altura das linhas nao foram alterados nesta etapa.

## Atualizacao - grade estrutural final

Em 2026-07-22, o modal manteve a largura `800` e recebeu ajuste estrutural interno:

- o uso visual de `Descriptions` foi substituido por uma grade propria por secao;
- todas as secoes agora usam a mesma regua de seis trilhas: rotulo/valor repetido tres vezes;
- `Identificacao`, `Conta`, `Vinculos` e `Sistema` ficam alinhados pelas mesmas divisoes verticais;
- `Ultimo acesso` e `Protecao` na secao `Sistema` deixam de ocupar colunas estreitas desalinhadas;
- altura natural, `max-height`, overflow, header, body, footer, padding vertical, campos, presenca online e protecao foram preservados.

## Atualizacao - respiro visual final

Em 2026-07-22, o modal recebeu o refinamento final de leitura:

- espacamento uniforme entre blocos de `8px`;
- distancia entre titulo da secao e grade preservada em `2px`;
- labels internos em `11px` e valores em `12px`;
- titulos de secao preservados em `13px`;
- largura `800`, altura natural, `max-height`, grade de seis trilhas, responsividade, presenca online e protecao preservadas.
