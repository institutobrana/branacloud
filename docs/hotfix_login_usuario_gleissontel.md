# Hotfix de login - usuario `gleissontel@gmail.com`

## 1. Objetivo da etapa

Restaurar apenas o acesso do usuario `gleissontel@gmail.com`, sem alterar o login global do sistema, sem mexer em Tratamento e sem tocar em outros usuarios alem do estritamente necessario.

## 2. Usuario afetado

- `gleissontel@gmail.com`

## 3. Sintoma observado

- O usuario afetado recebia a mensagem de senha incorreta.
- No backend aparecia `POST /login HTTP/1.1 400 Bad Request`.

## 4. Usuario de comparacao que funciona

- `joziclerteosampaio1981@gmail.com`

## 5. Arquivos auditados

- `frontend/app.js`
- `frontend/index.html`
- `backend/routes/auth_routes.py`
- `backend/security/hash.py`
- `backend/security/superadmin.py`
- `backend/models/usuario.py`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/reversao_regressao_fluxo_novo_tratamento_d895078.md`

## 6. Estado encontrado para `gleissontel@gmail.com`

- Usuario existe no banco.
- Email esta normalizado corretamente.
- Usuario esta ativo.
- Usuario esta como `is_admin = true`.
- Usuario esta vinculado a `clinica_id = 1`.
- Usuario esta vinculado a `prestador_id = 1`.
- Usuario esta vinculado a `unidade_atendimento_id = 1`.
- `senha_hash` estava preenchido.
- `senha_interna_hash` estava vazio.
- O registro estrutural nao apresentava falta de campos.

## 7. Causa raiz do problema

- O endpoint `POST /login` retorna `400` apenas quando o usuario nao e encontrado ou quando a verificacao de senha falha.
- Como o usuario existia e o email estava normalizado corretamente, a causa real do `400` foi incompatibilidade entre a senha tentada e o `senha_hash` armazenado para esse usuario.
- Nao houve evidencia de quebra global do login.
- O login global do sistema continuou funcional.

## 8. Correcao aplicada

- Foi redefinida somente a senha do usuario `gleissontel@gmail.com`.
- Novo valor temporario aplicado: `Brana#Gleisson@2026!`
- Nenhum outro usuario foi alterado.
- Nenhuma migration ou seed foi criada.

## 9. Validacao executada

- `git status` inicial coletado.
- Leitura do frontend e backend de login concluida.
- Consulta de banco executada para comparar `gleissontel@gmail.com` com `joziclerteosampaio1981@gmail.com`.
- Login real validado com `gleissontel@gmail.com` usando a nova senha.
- Resposta obtida no teste real: `200 OK` com `access_token`.
- O registro comparativo de `joziclerteosampaio1981@gmail.com` nao foi alterado.
- O login real do usuario comparativo nao foi reexecutado porque a credencial nao foi fornecida nesta etapa.

## 10. Confirmacao de que nao houve alteracao ampla no sistema

- Backend de login nao foi refatorado.
- Frontend de login nao foi alterado.
- Tratamento nao foi mexido.
- Novo tratamento nao foi mexido.
- Odontograma nao foi mexido.
- Nenhum outro usuario foi alterado.
- Nenhuma migration foi criada.
- Nenhuma seed foi criada.

## 11. Riscos remanescentes

- A senha nova e temporaria e deve ser tratada como credencial ativa ate o usuario trocar.
- O usuario comparativo nao teve login real reexecutado porque a credencial nao foi fornecida para este teste.
- Se o usuario original esperava outra senha, sera necessario ajustar a senha definitiva em etapa posterior.

## 12. Proxima etapa recomendada

- Confirmar com o usuario que o acesso voltou.
- Trocar a senha temporaria por uma senha definitiva, se desejado.
- Retomar a trilha de Tratamento apenas depois do aceite final do login.
