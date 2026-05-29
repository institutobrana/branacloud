Validação - Conta teste ID 18 e persistencia do signup

## Contexto
- Auditoria de persistencia anterior concluida.
- Usuario criou manualmente nova conta.
- ID informado: 18.
- A conta nasceu corretamente segundo o usuario.
- Etapa somente leitura/documental.

## Resultado informado pelo usuario
“O usuário informou que criou uma nova conta, que ela nasceu corretamente como configurado, que o ID é 18 e que tudo está ok com a nova conta.”

## Resultado dos SELECTs
- Banco consultado: `brana_saas`.
- Clinica/conta `ID 18` encontrada.
- `ID`: 18.
- `nome`: `Gleisson`.
- `email`: `tel.meinberg.odonto@gmail.com`.
- `ativo`: `true`.
- `criado_em`: `2026-05-29 06:40:53.676399-03:00`.
- `tipo_conta`: `DEMO 7 dias`.
- `trial_ate`: `2026-06-05 09:40:53.684724`.
- `nome_tabela_procedimentos`: `Brana`.
- `opcoes_sistema_json`: `null`.

## Estrutura inicial encontrada
- Usuario ADM inicial encontrado: sim.
- Usuario ADM:
  - `id`: 43.
  - `codigo`: 1.
  - `nome`: `Gleisson`.
  - `email`: `tel.meinberg.odonto@gmail.com`.
  - `ativo`: `true`.
  - `is_admin`: `true`.
  - `clinica_id`: 18.
  - `prestador_id`: 25.
  - `unidade_atendimento_id`: 3.
  - `is_system_user`: `false`.
  - `setup_completed`: `true`.
  - `forcar_troca_senha`: `false`.
- Usuario sistemico da conta encontrado: sim.
  - `id`: 42.
  - `codigo`: 255.
  - `nome`: `Clínica`.
  - `email`: `clinica.255.c18@system.brana.local`.
  - `ativo`: `true`.
  - `is_admin`: `false`.
  - `clinica_id`: 18.
  - `prestador_id`: 24.
  - `is_system_user`: `true`.
- Prestadores encontrados:
  - `id 24`: `source_id 255`, `codigo 001`, `nome Clínica`, `usuario_id 42`.
  - `id 25`: `source_id 1`, `codigo 002`, `nome Gleisson`, `usuario_id NULL`.
- Unidade principal encontrada:
  - `id`: 3.
  - `source_id`: 1.
  - `codigo`: `0001`.
  - `nome`: `Principal`.
  - `clinica_id`: 18.
  - `inativo`: `false`.
  - `data_inclusao`: `29/05/2026`.
- Perfis/access profiles iniciais encontrados:
  - IDs `177` a `186`, todos reservados e com `source_id` padrao.
  - Nenhum registro em `usuario_perfil_acesso` para a conta `18` no momento da validação.
- Opções iniciais:
  - `clinicas.opcoes_sistema_json` ficou `null` na conta validada.
- Eventos em `plataforma_auditoria` para a conta `18`:
  - nenhum registro localizado na consulta executada.

## Conclusão
- A criação da conta `ID 18` confirma que o fluxo atual de signup está persistindo no banco atual `brana_saas`.
- A conta nasceu com usuário ADM, usuário sistemico, prestadores, unidade principal e perfis reservados iniciais.

## Limite da validação
- Esta etapa valida a criação da conta `ID 18`.
- Ainda não valida:
  - criação de usuário comum dentro da conta;
  - persistência do checkbox/opcoes_sistema_json;
  - persistência após reinício do Uvicorn, se ainda não testado.

## Próxima etapa recomendada
- Teste controlado de usuário comum na conta `ID 18` e teste controlado do checkbox/opcoes_sistema_json.

## Confirmações de escopo
- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- Banco/schema/migrations/seeds/endpoints não alterados.
- Permissões/seeds não alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Conta teste `ID 18` validada por SELECT no banco atual, com estrutura inicial esperada e próxima etapa definida para usuário comum e `opcoes_sistema_json`.
