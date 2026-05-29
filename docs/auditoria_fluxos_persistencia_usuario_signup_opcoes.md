Auditoria - fluxos de persistencia de usuario, signup e opcoes do sistema

## Contexto
- Wilker@digitalprodutora.com.br segue ausente no banco atual consultado.
- A conta criada em 27/05/2026 segue ausente no banco atual consultado.
- O checkbox/configuracao relatado voltou a estado antigo segundo o usuario.
- O banco atual continua sendo `brana_saas`.
- A modularizacao permanece pausada enquanto esta auditoria nao for encerrada.

## Escopo e proibicoes
- Esta etapa foi somente leitura.
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum usuario, conta ou checkbox foi recriado/alterado.

## Fluxo de criacao de usuario
- Frontend: `frontend/app.js`.
- Funcoes principais: `usersSalvarEstrutural()` e `usersSalvarNovo()`.
- Endpoint: `POST /admin/users`.
- Backend: `backend/routes/user_admin_routes.py`.
- Funcao principal: `admin_create_user()`.
- Payload esperado: `codigo`, `nome`, `apelido`, `tipo_usuario`, `email`, `prestador_row_id`, `unidade_row_id`, `ativo`, `is_admin`, `forcar_troca_senha`, `senha`, `confirma_senha`.
- Tabelas afetadas: `usuarios`, `usuario_perfil_acesso` por derivacao de permissao, `prestador_odonto` e `unidade_atendimento` quando ha vinculo.
- Persistencia: a rota faz `db.add(usuario)`, `db.flush()`, aplica vinculos e executa `db.commit()` antes de responder.
- Retorno HTTP: o frontend considera sucesso quando `res.ok` vem verdadeiro e entao recarrega a lista.
- Risco observado: nao ha otimizacao visual antes do await; o risco principal e um sucesso HTTP 2xx que venha sem refletir falha de negocio no payload. Nao houve indicio de isso no codigo lido.
- Audit trail: nao foi encontrado `registrar_auditoria()` para criacao de usuario neste fluxo.

## Fluxo de criacao de conta / signup
- Frontend: `frontend/app.js`.
- Funcoes principais: `signupRequestCode()`, `signupConfirm()` e `setupComplete()`.
- Endpoint principal de signup: `POST /signup/request-code` e `POST /signup/confirm`.
- Backend: `backend/routes/auth_routes.py`.
- Funcao principal: `signup_confirm()`.
- Servico de criacao: `backend/services/signup_service.py`, funcao `criar_conta_saas()`.
- Fluxos auxiliares: `_upsert_google_user()` pode reaproveitar a mesma criacao de conta para Google OAuth.
- Tabelas afetadas esperadas: `clinicas`, `usuarios`, `prestador_odonto`, `unidade_atendimento`, `access_profile` e tabelas/seed relacionadas a bootstrap.
- Persistencia: `criar_conta_saas()` adiciona objetos, executa varios `flush()` e faz um unico `db.commit()` no final.
- Rollback: nao ha `rollback()` explicito no fluxo de criacao, mas tudo fica sob a mesma sessao/transacao ate o commit final; se ocorrer erro antes do commit, a sessao e encerrada pelo dependency e o trabalho nao fica comitado.
- Risco observado: o frontend valida apenas `res.ok`, entao qualquer resposta 2xx sera tratada como sucesso visual. Nao ha indicio de confirmacao otimista antes do await.
- Audit trail: nao foi encontrado registro dedicado em `plataforma_auditoria` para signup/criacao de conta neste fluxo.

## Fluxo de salvamento de opcoes_sistema_json
- Tela/aba: `Opcoes do sistema` em `frontend/app.js`.
- Funcoes frontend: `sysOptCarregar()`, `sysOptSyncUI()`, `sysOptColetarPayload()` e `sysOptSalvar()`.
- Checkbox citado: `seguranca.ativar_controle_usuarios`.
- Endpoint: `GET /system-options` e `PATCH /system-options`.
- Backend: `backend/routes/system_options_routes.py`.
- Funcao principal: `atualizar_opcoes_sistema()`.
- Persistencia: o backend sanitiza e normaliza o payload, monta o JSON completo e grava em `clinica.opcoes_sistema_json`, seguido de `db.commit()` e `db.refresh(clinica)`.
- Merge/sobrescrita: `_sanitize_values()` aplica defaults e `_merge_defaults()` mescla com o payload recebido; a escrita final substitui o campo inteiro com o JSON saneado.
- Risco observado: se o frontend salvar com estado local desatualizado, o JSON inteiro pode ser regravado com valores antigos do formulario. Esse e o principal risco de sobrescrita identificado na leitura.
- Risco de sucesso visual: o frontend so atualiza a interface apos `res.ok`, entao nao ha sucesso visual antes da resposta. O retorno do backend inclui `values` e `options`, o que ajuda a confirmar a persistencia.
- Estado atual verificado: na clinica `ID 17`, `seguranca.ativar_controle_usuarios` esta `true`.

## requestJson e tratamento de sucesso/erro no frontend
- Definicao: `requestJsonBase()` e `requestJson()` em `frontend/app.js`.
- Comportamento: `requestJsonBase()` faz `fetch`, tenta decodificar JSON/texto/blob e retorna `{res,data}` sem lancar erro automaticamente para HTTP 4xx/5xx.
- `requestJson()` trata unlock protegido e guarda de sessao, mas continua devolvendo `{res,data}` ao chamador.
- Padrao dos fluxos auditados: `usersSalvarEstrutural()`, `signupConfirm()`, `setupComplete()` e `sysOptSalvar()` verificam `res.ok` antes de anunciar sucesso.
- Risco observado: se um backend responder 2xx com payload incoerente, o frontend pode mostrar sucesso. Nao foi visto esse comportamento nos fluxos lidos.
- Nao foi identificado caminho de atualizacao otimista nesses tres fluxos.

## Logs e auditoria encontrados
- Nao foram encontrados arquivos persistidos de log de backend/Unicorn para estes fluxos.
- `backend/backups/runtime_bootstrap_audit.jsonl` nao existe no workspace atual.
- A tabela `plataforma_auditoria` existe, mas nao mostrou entradas de criacao de usuario, signup ou salvamento de opcoes do sistema nesta trilha.
- A auditoria historica encontrada para `Wilker` continua sendo a exclusao da antiga clinica `ID 3`, nao relacionada a este fluxo.

## Consultas de consistencia
- Banco efetivo: `brana_saas` em `localhost:5432`, usuario `postgres`.
- Clinica `ID 17`: `Tel / institutobrana@gmail.com`, ativa, criada em `2026-05-26 18:32:17`, com `opcoes_sistema_json` preenchido e `seguranca.ativar_controle_usuarios=true`.
- Usuarios da clinica `17`: IDs `39` e `40`, ambos ativos.
- Busca por `wilker@digitalprodutora.com.br`, `digitalprodutora.com.br` e `wilker` em usuarios: nenhum registro encontrado.
- Busca por clinica criada em `27/05/2026`: nenhum registro encontrado; a clinica mais proxima e a `17`, criada em `26/05/2026`.
- `plataforma_auditoria` nao mostrou eventos em `2026-05-27`.
- Maximos atuais: `clinica_id = 17`, `usuario_id = 40`.

## Pontos provaveis de falha
- P1: risco generico de o frontend aceitar qualquer `2xx` como sucesso; nao houve evidencia direta neste codigo.
- P2: baixo risco de backend retornar sucesso sem commit real nos fluxos lidos; user creation, signup e system options fazem commit antes de responder.
- P3: risco baixo de persistencia parcial; o signup faz varios `flush()` e um `commit()` final, entao um erro antes do commit tende a nao persistir.
- P4: risco medio de sobrescrita do JSON de opcoes do sistema com estado local antigo.
- P5: alto risco de falta de logs suficientes para comprovar autoria ou falha.
- P6: risco de identificador incorreto continua valido quando a busca depende de email/nome exato.
- P7: leitura estatica nao mostrou erro estrutural obvio nestes fluxos; a validacao controlada continua sendo a melhor proxima prova.

## Plano de teste controlado futuro
- Teste A: criar usuario controlado na clinica `ID 17`, conferir HTTP, SELECT imediato, auditoria e persistencia apos recarga e reinicio autorizado.
- Teste B: criar conta controlada via signup, conferir HTTP, SELECT imediato, auditoria e persistencia apos recarga e reinicio autorizado.
- Teste C: alternar `seguranca.ativar_controle_usuarios`, salvar, conferir HTTP, SELECT imediato, recarregar tela e validar apos reinicio autorizado.
- Em todos os testes: usar identificadores de teste, registrar horario, fazer backup antes de qualquer operacao que altere dados e manter a validacao somente com autorizacao futura.

## Conclusao
- Nao ha indicio forte de que o frontend mostre sucesso sem persistencia nestes fluxos, mas existe um risco generico porque o frontend confia em HTTP 2xx.
- Nao ha indicio de que o backend esteja retornando sucesso sem commit real nos trechos lidos.
- Ha risco real de `opcoes_sistema_json` ser sobrescrito por estado local antigo.
- Faltam logs persistidos suficientes para fechar autoria/falha.
- Nao e possivel concluir completamente sem um teste controlado futuro, principalmente para o checkbox de opcoes do sistema.

## Confirmacoes de escopo
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- Banco, schema, migrations, seeds e endpoints nao foram alterados.
- Dados do banco nao foram alterados.
- Permissoes e seeds nao foram alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Auditoria somente leitura dos fluxos de persistencia de usuario, signup e opcoes do sistema, com foco em sucesso HTTP versus persistencia real e risco de sobrescrita de JSON.
