# Correcao da orientacao de senha interna no primeiro acesso React

Data: 2026-07-21

## Escopo

Esta etapa corrige apenas a orientacao visual/textual da pagina React de primeiro acesso.

Nao houve alteracao de backend, banco, endpoint, payload, token, sessao, renew, logout ou `setup_completed`.

## Fonte legado localizada

- Arquivo: `frontend/index.html`
- Painel: `section#panel-setup`
- Funcao de abertura: `abrirTelaSetup(user)` em `frontend/app.js`
- Submit: `setupComplete()` em `frontend/app.js`

Texto funcional encontrado no legado:

- Titulo: `Bem-vindo ao BranaCloud`
- Texto inicial: `Estamos quase prontos para começar.`
- Orientacao: o usuario acessa como administrador da clinica e precisa definir uma senha de seguranca interna antes de entrar no sistema.
- Destaque: `Esta NÃO é sua senha de login`
- Avisos:
  - `Ela será usada para proteger ações importantes no sistema`
  - `Será solicitada apenas em operações sensíveis`
  - `Você poderá alterá-la posteriormente nas configurações`
  - `Esta etapa ocorre apenas no primeiro acesso`
- Labels:
  - `E-mail`
  - `Defina sua senha interna`
  - `Confirme a senha`
- Botoes:
  - `Concluir primeiro acesso`
  - `Sair`

## Matriz comparativa

| Elemento | Legado | React anterior | Ajuste aplicado |
|---|---|---|---|
| Titulo | Bem-vindo ao BranaCloud / painel de primeiro acesso | Primeiro acesso | Mantido `Primeiro acesso` na pagina React, com contexto Brana Cloude |
| Texto introdutorio | Estamos quase prontos para começar | Frase curta sobre configuracao inicial | Incluido texto de preparacao e administracao da clinica |
| Explicacao da senha interna | Senha de seguranca interna | Senha interna mencionada brevemente | Expandida com caixa informativa |
| Diferenca para login | Esta NÃO é sua senha de login | Frase curta sem explicar permanencia da senha de login | Incluido que a senha de login continua a mesma |
| E-mail readonly | `setup-email` readonly | Input readonly | Preservado |
| Campo senha | Defina sua senha interna | Senha interna | Preservado como `Senha interna` |
| Confirmacao | Confirme a senha | Confirmar senha | Alterado para `Confirmar senha interna` |
| Aviso | Lista com uso interno, operacoes sensiveis, alteracao posterior e primeiro acesso unico | Alert curto | Alert com descricao e lista |
| Botao concluir | Concluir primeiro acesso | Concluir configuracao | Alterado para `Concluir primeiro acesso` |
| Botao sair | Sair | Sair | Preservado |

## Finalidade da senha interna

A senha criada no primeiro acesso e a senha interna/de seguranca interna do sistema.

Ela protege acoes importantes e pode ser solicitada em operacoes sensiveis. A documentacao de separacao de senha registra que ela e armazenada em `usuarios.senha_interna_hash`, separada da senha de login.

## Diferenca para a senha de login

A senha interna nao substitui a senha de login.

O usuario continua entrando no Brana Cloude com a senha normal de login. O primeiro acesso apenas conclui o setup e grava a senha interna.

## Implementacao React

- Arquivo: `frontend-react/src/features/firstAccess/FirstAccessPage.jsx`
- CSS: `frontend-react/src/features/firstAccess/firstAccess.css`
- Teste: `frontend-react/tests/firstAccess.test.js`

A pagina continua dedicada, sem shell e sem modal legado.

Componentes usados:

- `Card`
- `Typography`
- `Alert`
- `Form`
- `Input`
- `Input.Password`
- `Button`

## Contratos preservados

- Rota: `/app/primeiro-acesso`
- Endpoint: `POST /auth/setup/complete`
- Payload: `{ senha, confirma_senha }`
- E-mail nao e enviado no payload
- `refreshSession` preservado
- `signOut` preservado
- bloqueio de duplicidade no hook preservado
- guard global preservado
- ausencia do shell preservada

## Validacao

Testes atualizados para cobrir:

- titulo;
- texto de primeiro acesso;
- explicacao de senha interna;
- destaque de que nao e senha de login;
- senha de login permanece a mesma;
- e-mail readonly;
- labels finais;
- botoes finais;
- endpoint e payload preservados;
- textos sem mojibake;
- classe visual da caixa informativa.
