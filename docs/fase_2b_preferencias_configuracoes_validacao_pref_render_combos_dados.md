# Validação - prefRenderCombosDados em Preferências / Configurações

## 1. Contexto

- Contrato profundo pós-`prefRenderCombosModelos`.
- Implementação mínima de `prefRenderCombosDados` concluída.
- Etapa atual registra validação manual.
- Módulo comum/core.

## 2. Resultado informado pelo usuário

“O usuário informou que testou e que passou / está ok.”

## 3. Escopo validado

- Tela Preferências.
- Abertura da modal.
- Aba Dados.
- Select de UF.
- Fechamento e reabertura.
- Reabertura sem salvar.
- Opções do Sistema apenas como não-regressão visual.

## 4. Limite da validação

- Valida apenas o recorte visual/DOM do select de UF da aba Dados.
- Não valida carregamento.
- Não valida payload.
- Não valida salvamento.
- Não valida `sysOpt*`.
- Não valida backend.
- Não valida banco.
- Não valida permissões.
- Não valida seeds.
- Não implica novo recorte.

## 5. Estado consolidado

- Sincronização visual básica da modal validada.
- `prefRenderCombos` validado.
- `prefRenderCombosModelos` validado.
- `prefRenderCombosDados` agora validado.
- Preferências / Configurações segue estável.

## 6. Próxima etapa recomendada

- Decisão conservadora para definir se haverá novo contrato profundo em Preferências / Configurações ou retorno à matriz comparativa.
- Não iniciar novo recorte automaticamente nesta etapa.

## 7. Confirmações de escopo

- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- `.env` não alterado.
- Banco, schema, migrations, seeds e endpoints não alterados.
- PostgreSQL 18 não excluído/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## 8. Registro para roadmap

- Validação manual de `prefRenderCombosDados` aprovada.
- Recorte visual/DOM do select de UF da aba Dados consolidado.
- Preferências / Configurações segue estável.
- Próxima etapa recomendada: decisão conservadora antes de qualquer novo recorte.
- Blindagem textual/mojibake respeitada.
