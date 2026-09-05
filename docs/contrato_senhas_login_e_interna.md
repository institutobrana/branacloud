# Contrato de senhas — Brana Cloude

## Modelo

O sistema possui duas credenciais com finalidades distintas:

- **Senha de login**: persistida em `Usuario.senha_hash`, usada no login, no módulo Usuários (`POST /admin/users/change-password`) e no reset (`POST /password/reset`).
- **Senha interna**: persistida em `Usuario.senha_interna_hash`, usada para liberar ações e módulos protegidos. A interface oficial é Topbar → Alterar senha interna.

Quando `senha_interna_hash` existe, a proteção usa a senha interna. Quando está nula, a compatibilidade legada permite fallback para `senha_hash`; isso não torna as credenciais conceitualmente iguais.

## Alteração da senha interna

Rota: `POST /auth/internal-password/change`.

O usuário é obtido exclusivamente pelo JWT autenticado e pelo tenant da sessão. O request contém exatamente:

```json
{
  "senha_interna_atual": "...",
  "nova_senha_interna": "...",
  "confirma_senha_interna": "..."
}
```

A senha interna atual é obrigatória e é validada contra `senha_interna_hash`, com fallback legado para `senha_hash` quando o hash interno não existe. A nova senha é obrigatória, deve atender ao mínimo vigente de 6 caracteres e a confirmação deve ser idêntica.

Em sucesso, somente `Usuario.senha_interna_hash` é substituído por um hash; `senha_hash`, `setup_completed`, `forcar_troca_senha`, `online`, a sessão e os demais dados do usuário permanecem inalterados. A resposta é `Senha interna alterada com sucesso.`. Falhas de entrada ou de validação retornam erro HTTP sem expor credenciais ou hashes.

## Fluxos React

- Topbar → **Alterar senha interna** → modal **Alterar senha interna**.
- Campos: **Senha interna atual**, **Nova senha interna**, **Confirmação**.
- Rodapé: **Esta confirmação irá alterar a senha interna do sistema.**
- Cancelar/X limpam o estado e fecham o modal; sucesso limpa o estado, fecha o modal e mantém a sessão.
- O fluxo não usa `X-Protected-Password`, `X-Protected-Grant`, grant, senha de login ou a rota de alteração de senha de login.

O módulo Usuários continua responsável exclusivamente pela senha de login. Nenhuma credencial é armazenada em storage, URL ou logs.

## Homologação

Foi realizada alteração real e reversível em runtime: senha interna temporária aceita, senha anterior rejeitada, senha original restaurada e validada novamente. Nenhum segredo, hash ou token é registrado neste documento.
