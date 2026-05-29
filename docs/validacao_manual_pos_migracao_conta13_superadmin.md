# Validação manual - Conta Paulo Gustavo ID 13 pós-migração

## Contexto
- A migração da conta `ID 13` do PostgreSQL 18 para o PostgreSQL 17 foi executada.
- O PostgreSQL 17 é o cluster oficial.
- Esta etapa registra a validação manual da conta após a migração.

## Resultado informado pelo usuário
“O usuário informou que a conta apareceu no sistema. Ele não acessou com a senha do usuário final, pois a senha é do usuário, mas conseguiu verificar a conta pelo painel de Super ADM.”

## Interpretação da validação
- Validação administrativa aprovada.
- A conta `ID 13` ficou visível no sistema pelo painel de Super ADM.
- O login direto do usuário `pagamentosccb@gmail.com` não foi testado por falta de senha.
- O login do usuário final permanece como validação complementar opcional.

## Resultado por SELECT, se executado
- A clínica `ID 13` permanece presente no PostgreSQL 17 oficial como `Paulo Gustavo`, `pagamentosccb@gmail.com`, `ativo = true`.
- Os usuários `30` e `31` permanecem presentes e vinculados à clínica 13.
- As clínicas `17` e `18` continuam presentes e ativas.

## Limite da validação
- Esta validação não confirma senha/login do usuário final.
- Esta validação não confirma o uso operacional completo da clínica.
- Esta validação confirma a visibilidade administrativa e a presença da conta após a migração.

## Próxima etapa recomendada
- Etapa separada de estabilização do PostgreSQL 17 como cluster oficial.
- Avaliar desativação controlada do PostgreSQL 18 depois de nova autorização.
- Antes de excluir o cluster 18, preferir desativar e testar reinício.
- A modularização só deve ser retomada após a estabilização do ambiente.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- Nenhuma senha alterada.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `.env` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Cluster 18 nao excluido ou desativado nesta etapa.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Validacao manual administrativa da conta `ID 13` aprovada, com visibilidade confirmada no painel de Super ADM.
