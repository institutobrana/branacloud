# Decisão - manter estado atual do banco e não recuperar contas ID 17/18

## Contexto
- Auditorias anteriores apontaram divergência de estado entre documentos históricos e o banco atual.
- As contas `ID 17/18` e os usuários `44/45` foram documentados em testes anteriores.
- Na leitura atual do `brana_saas`, esses registros não aparecem mais.
- `Paulo Gustavo` `ID 13` permanece presente no estado atual.
- A auditoria de bancos confirmou `brana_saas` como banco oficial aparente e configurado no backend.
- O usuário decidiu manter o estado atual.

## Decisão do usuário
“O usuário decidiu manter o estado atual. O banco brana_saas atual será tratado como oficial. As contas ID 17/18 e os usuários 44/45 não serão recuperados. O banco saas_local não será usado como fonte oficial.”

## Estado oficial definido
- Banco oficial: `brana_saas` atual.
- PostgreSQL ativo: `18`.
- `brana_saas` é o banco usado pelo backend via `DATABASE_URL`.
- `Paulo Gustavo` `ID 13` permanece no estado oficial.
- `ID 17` e `ID 18` não serão recuperadas.
- Usuários `44` e `45` não serão recuperados.

## Bancos / ambientes não oficiais
- `saas_local` é um banco separado e antigo.
- `postgres` é o banco padrão sem tabelas Brana.
- PostgreSQL 17 está parado.
- Nenhum desses será usado como fonte oficial nesta decisão.

## O que não será feito
- Não restaurar `ID 17`.
- Não restaurar `ID 18`.
- Não migrar usuários `44/45`.
- Não buscar unificação com banco antigo.
- Não usar `saas_local` como base oficial.
- Não apagar `saas_local` nesta etapa.
- Não apagar backups nesta etapa.
- Não restaurar backups/dumps nesta etapa.
- Não executar correção destrutiva nesta etapa.

## Resultado dos SELECTs
- `clinicas.id = 13` confirmou `Paulo Gustavo`, `pagamentosccb@gmail.com`, `ativo = true`, `criado_em = 2026-05-27 14:36:36.671179-03`, `trial_ate = 2027-05-27 21:12:09.601728`, `opcoes_sistema_json = null`.
- `clinicas.id = 17` não existe no estado atual.
- `clinicas.id = 18` não existe no estado atual.
- `max(clinicas.id) = 15`.
- `max(usuarios.id) = 36`.
- As últimas clínicas visíveis são `15:Gleisson`, `13:Paulo Gustavo`, `4:Alisson Cristóvão Butarelo` e `1:Instuto Brana - Odontologia`.

## Impacto
- As auditorias de persistência com `ID 17/18` passam a ser tratadas como históricas e transitórias, não como base para recuperação.
- A modularização só deve ser retomada após uma auditoria curta de retomada pós-decisão.

## Próxima etapa recomendada
- Abrir uma auditoria curta de retomada pós-decisão.
- Confirmar o último ponto seguro da modularização.
- Confirmar que o banco oficial é `brana_saas`.
- Retomar o desenvolvimento somente depois disso.
- Se houver necessidade futura de remover banco antigo ou de teste, abrir etapa separada de inventário, backup e remoção autorizada.

## Confirmacoes de escopo
- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- `backend` não alterado.
- `banco`, schema, migrations, seeds e endpoints não alterados.
- Permissões e seeds não alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Decisão registrada para manter `brana_saas` como banco oficial, sem recuperar `ID 17/18` nem os usuários `44/45`, sem usar `saas_local` como fonte oficial e sem restaurar backups/dumps nesta etapa.
