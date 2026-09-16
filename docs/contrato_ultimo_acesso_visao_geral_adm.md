# Contrato de ultimo acesso na Visao geral ADM

## 1. Definicao funcional

`Ultimo acesso` significa data e hora do ultimo login autenticado com sucesso do usuario responsavel pela clinica.

## 2. Fonte encontrada

A auditoria nao encontrou fonte confiavel existente em modelo, banco, sessao, auditoria ou log de login.

## 3. Resultado da auditoria

Classificacao: `D`. O campo nao existia e precisou ser criado.

## 4. Decisao

Foi criado o campo `usuarios.ultimo_login_em`, nullable, sem default e sem backfill.

## 5. Migration

Script manual reversivel: `backend/scripts/migrar_usuarios_ultimo_login_em.py`.

- Upgrade: adiciona `usuarios.ultimo_login_em TIMESTAMP WITH TIME ZONE`.
- Downgrade: remove somente `usuarios.ultimo_login_em`.
- Registros antigos permanecem `null`.

## 6. Modelo

`backend/models/usuario.py` passou a declarar `ultimo_login_em = Column(DateTime(timezone=True), nullable=True)`.

## 7. Login

`backend/routes/auth_routes.py` grava `datetime.now(timezone.utc)` somente depois de senha valida e antes do commit ja existente do login.

## 8. Renew

`/auth/renew` nao atualiza `ultimo_login_em`, porque renovacao de token nao e login.

## 9. Logout

`/logout` nao apaga nem altera `ultimo_login_em`.

## 10. Endpoint

`GET /superadmin/overview` retorna `ultimo_acesso` em cada item de `acessos_clinicas`, usando o `ultimo_login_em` do usuario responsavel.

## 11. Schema

O backend retorna ISO string quando houver valor e `null` quando o responsavel nunca tiver login registrado.

## 12. Frontend

A tabela da Visao geral formata `ultimo_acesso` em `dd/MM/yyyy HH:mm`, no timezone `America/Sao_Paulo`.

## 13. Tratamento de vazio

- Campo presente com `null`: `Nao registrado`.
- Campo ausente no payload: `Nao disponivel`.
- Data invalida: `Nao registrado`.

## 14. Testes

- Backend: login valido atualiza, login invalido nao atualiza, renew nao altera, logout nao apaga e overview retorna o valor do responsavel.
- Frontend: data valida, null, campo ausente e data invalida.

## 15. Validacao local

Migration aplicada no banco local. A coluna foi confirmada como `timestamp with time zone`, nullable e sem default. O banco reportou timezone `America/Sao_Paulo`.

## 16. Rollback

Executar `python backend/scripts/migrar_usuarios_ultimo_login_em.py --downgrade` para remover a coluna.

## 17. Riscos

Contas antigas continuam sem historico ate o proximo login bem-sucedido. Isso e esperado para evitar backfill falso.

## 18. Git

Sem commit e sem push nesta etapa.
