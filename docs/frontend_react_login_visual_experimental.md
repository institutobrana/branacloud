# Frontend React - Login Visual Experimental

## Objetivo da etapa

Criar somente a tela visual de login experimental no `frontend-react\`, sem autenticação real, sem backend, sem token e sem alterar o frontend legado.

## Arquivos criados/alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/auth/LoginPage.jsx`
- `frontend-react/src/features/auth/login.css`
- `docs/frontend_react_login_visual_experimental.md`
- `docs/11_roadmap_desenvolvimento.md`

## O que a tela faz

- Exibe uma página de login visual com Ant Design.
- Mostra a marca `Brana Cloud`.
- Mostra o subtítulo `Sistema odontológico em nuvem`.
- Apresenta campos de e-mail e senha.
- Exibe o botão `Entrar`.
- Exibe os links visuais `Esqueci minha senha` e `Criar nova conta`.
- Exibe o aviso de que a autenticação real ainda não está conectada.
- Valida apenas campos obrigatórios.
- Ao clicar em `Entrar` com os campos preenchidos, exibe uma mensagem visual informando que a integração real virá em etapa posterior.

## O que a tela ainda não faz

- Não chama `POST /login`.
- Não chama backend nenhum.
- Não cria `AuthProvider` real.
- Não salva `brana_token`.
- Não redireciona para a área logada.
- Não simula token.
- Não altera sessão real.

## Confirmações de segurança

- Não altera `localStorage`.
- Não altera `sessionStorage`.
- Não altera o frontend legado.
- Não altera backend.
- Não altera banco de dados.
- Não altera migrations.

## Roteamento temporário

O `frontend-react` usa uma verificação simples de `window.location.pathname` para mostrar:

- `/login` -> tela de login visual
- `/` ou outras rotas -> shell/home experimental

Esse roteamento é temporário e foi adotado para evitar dependências novas nesta etapa.

## Próximos passos recomendados

1. Criar `AuthProvider` ou `SessionProvider`.
2. Criar `authApi.js` seguindo o contrato documentado.
3. Ligar `GET /me` no boot do React.
4. Implementar logout.
5. Validar sessão com usuário real.
6. Comparar com o comportamento do frontend legado.
