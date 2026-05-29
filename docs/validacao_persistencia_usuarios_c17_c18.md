# Validacao - Persistencia de usuarios nas clinicas 17 e 18

## Contexto
- Auditoria de persistencia em andamento.
- Conta ID 18 ja validada anteriormente.
- O usuario criou dois usuarios manualmente pelo sistema.
- O checkbox foi informado como correto pelo usuario no momento.
- Esta etapa foi somente leitura por SELECT, sem alteracao direta de banco pelo Codex.

## Usuarios informados pelo usuario
- Milene Flor / `mileneflor99@gmail.com` / clinica 18.
- TESTE / `mileneflor17@gmail.com` / clinica 17.

## Resultado por SELECT - clinica 18
- Clinica: `id 18`, nome `Gleisson`, e-mail `tel.meinberg.odonto@gmail.com`, `ativo = true`, `criado_em = 2026-05-29 06:40:53-03:00`, `opcoes_sistema_json = null`.
- Usuarios vinculados na clinica 18:
  - `id 42`: `Clínica`, `clinica.255.c18@system.brana.local`, `is_system_user = true`, `setup_completed = true`, `ativo = true`, `prestador_id = 24`, `unidade_atendimento_id = null`.
  - `id 43`: `Gleisson`, `tel.meinberg.odonto@gmail.com`, `is_admin = true`, `setup_completed = true`, `ativo = true`, `prestador_id = 25`, `unidade_atendimento_id = 3`.
  - `id 45`: `Milene Flor`, `mileneflor99@gmail.com`, `is_admin = false`, `is_system_user = false`, `setup_completed = true`, `ativo = true`, `prestador_id = 25`, `unidade_atendimento_id = 3`, `tipo_usuario = "Dentista (CD)"`.
- `usuario_perfil_acesso`: sem vinculos encontrados para o usuario de teste.
- `prestador_odonto`: `id 25` vinculado ao usuario `id 45`.
- `plataforma_auditoria`: nenhum evento encontrado para `mileneflor99@gmail.com` ou para o usuario de teste nesta leitura.

## Resultado por SELECT - clinica 17
- Clinica: `id 17`, nome `Tel`, e-mail `institutobrana@gmail.com`, `ativo = true`, `criado_em = 2026-05-26 18:32:17-03:00`.
- `opcoes_sistema_json` contem `seguranca.ativar_controle_usuarios = true`.
- Usuarios vinculados na clinica 17:
  - `id 39`: `Clínica`, `clinica.255.c17@system.brana.local`, `is_system_user = true`, `setup_completed = true`, `ativo = true`, `prestador_id = 23`.
  - `id 40`: `Tel`, `institutobrana@gmail.com`, `is_admin = true`, `setup_completed = true`, `ativo = true`.
  - `id 44`: `TESTE`, `mileneflor17@gmail.com`, `is_admin = false`, `is_system_user = false`, `setup_completed = true`, `ativo = true`, `unidade_atendimento_id = 2`, `tipo_usuario = "Dentista (CD)"`.
- `usuario_perfil_acesso`: sem vinculos encontrados para o usuario de teste.
- `prestador_odonto`: sem vinculo encontrado para o usuario de teste.
- `plataforma_auditoria`: nenhum evento encontrado para `mileneflor17@gmail.com` nesta leitura.

## Estado das clinicas 17 e 18
- Clinica 17: `opcoes_sistema_json` preenchido, com `seguranca.ativar_controle_usuarios = true`, e 3 usuarios vinculados.
- Clinica 18: `opcoes_sistema_json = null` nesta leitura, e 3 usuarios vinculados.
- Os usuarios criados no teste aparecem na listagem por banco nas respectivas clinicas.

## Resultado sobre opcoes_sistema_json
- A leitura atual mostra a clinica 17 com `seguranca.ativar_controle_usuarios = true`.
- A clinica 18 permanece com `opcoes_sistema_json = null` nesta leitura.
- O usuario informou que o checkbox esta correto no momento, entao nao ha acao bloqueante sobre esse ponto nesta etapa.
- Se surgir inconsistencias futuras, uma auditoria especifica devera ser aberta apenas para o checkbox.

## Classificacao
- `PERSIST-USERS-A`: os dois usuarios foram persistidos corretamente no banco `brana_saas`.
- `PERSIST-OPCOES-OK-INFORMADO`: o usuario informou que o checkbox esta correto no momento e a leitura por SELECT nao indica acao imediata.

## Conclusao
- A criacao de usuarios comuns pelo sistema esta persistindo no banco `brana_saas` para os dois casos testados.
- Nao ha indicio de sucesso visual sem persistencia neste teste.
- O checkbox nao precisa de acao agora e fica apenas observado.

## Limite da validacao
- Esta etapa valida a persistencia dos usuarios criados nas clinicas 17 e 18.
- Ainda nao valida persistencia apos reinicio do Uvicorn.

## Proxima etapa recomendada
- Se quiser fechar a auditoria de persistencia por completo, preparar a validacao apos recarga/reinicio do Uvicorn.
- Se o checkbox voltar a divergir no futuro, abrir auditoria especifica.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado diretamente pelo Codex.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Validacao de persistencia de usuarios nas clinicas 17 e 18 concluida por SELECT, com usuarios de teste persistidos no `brana_saas` e checkbox apenas observado.
