# Auditoria - retomada pos-estabilizacao do PostgreSQL 17

## Contexto
- Houve uma crise de alternancia entre PostgreSQL 17 e PostgreSQL 18.
- A conta `ID 13` foi migrada para o PostgreSQL 17.
- A validacao pos-reinicio foi aprovada como `ESTABILIDADE-A`.
- O objetivo desta etapa e retomar a modularizacao com seguranca, sem tocar no banco.

## Confirmacao do banco oficial
- PostgreSQL 17 segue como ambiente oficial.
- `brana_saas` no PostgreSQL 17 continua ativo.
- `current_setting('data_directory') = C:/Program Files/PostgreSQL/17/data`.
- As contas `13`, `17` e `18` continuam presentes.
- Os usuarios `30`, `31`, `44` e `45` continuam presentes.

## Encerramento operacional da crise
- A alternancia entre clusters foi identificada e documentada.
- O PostgreSQL 17 foi oficializado como cluster oficial.
- A conta `Paulo Gustavo ID 13` foi migrada do PostgreSQL 18 para o PostgreSQL 17.
- A validacao manual via painel de Super ADM foi aprovada.
- O teste pos-reinicio foi aprovado como `ESTABILIDADE-A`.
- O PostgreSQL 18 permanece preservado e nao excluido.
- Nao ha pendencia de recuperacao de contas para retomar a modularizacao.
- Qualquer desativacao ou exclusao definitiva do PostgreSQL 18 fica para etapa futura separada, com autorizacao explicita.

## O que permanece pendente fora da modularizacao
- PostgreSQL 18 permanece preservado.
- Eventual desativacao/exclusao definitiva fica para etapa futura.
- Backups devem ser preservados.

## Ultimo ponto seguro da modularizacao
- Ultimo recorte implementado em codigo: `prefRenderCombosModelos` em `Preferencias / Configuracoes`.
- Ultimo recorte validado manualmente de forma documental: `prefRenderCombos`.
- `prefRenderCombosModelos` foi implementado, mas nao ha documento de validacao manual concluindo esse recorte antes da pausa.
- O ultimo documento de decisao/consolidacao antes da pausa foi o que registrou a pausa temporaria por suspeita de regressao apos `prefRenderCombosModelos`.
- O commit mais recente ligado a esse ponto foi `bcf7e2c84274c130ce47cb63c3535eb1dc2cfb62`.

## Decisao de retomada
- `RET-B`.
- A crise de banco esta encerrada operacionalmente, mas falta registrar/validar manualmente o ultimo recorte implementado de Preferencias / Configuracoes antes de abrir novo recorte.

## Proxima etapa recomendada
- Registrar validacao manual pendente de `prefRenderCombosModelos` antes de qualquer novo recorte.
- Depois dessa validacao, a modularizacao pode voltar a ser avaliada de forma conservadora.

## Onde testar antes de prosseguir
- Tela `Preferencias`.
- Abertura da modal.
- Aba dos modelos.
- Combos de modelos.
- Alternancia de abas.
- Fechamento e reabertura.
- `Opcoes do Sistema` como nao-regressao visual.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `.env` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- PostgreSQL 18 nao excluido ou desativado nesta etapa.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Auditoria de retomada pos-estabilizacao do PostgreSQL 17 concluida, com `RET-B` e validacao manual pendente de `prefRenderCombosModelos`.
