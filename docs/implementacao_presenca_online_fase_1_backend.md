# Implementacao - Presenca online - Fase 1 backend

Data: 2026-07-22

## Escopo

Foi implementada a fundacao backend para presenca online de usuarios.

Esta fase nao altera `GET /superadmin/usuarios`, CSV, frontend React, normalizador, tabela, filtro ou coluna `Online`.

## Migration

Migration manual:

- `backend/scripts/migrar_usuarios_last_seen_at.py`
- identificador: `usuarios_last_seen_at_20260722`

Campo adicionado:

```text
usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL
```

Regras:

- nullable;
- sem default;
- sem backfill;
- usuarios existentes permanecem com `last_seen_at = NULL`;
- downgrade remove somente `last_seen_at`.

O script de compatibilidade de schema tambem recebeu a coluna de forma aditiva para ambientes que usam bootstrap controlado.

## Model

`backend/models/usuario.py` recebeu:

```python
last_seen_at = Column(DateTime(timezone=True), nullable=True)
```

Nao foi criada propriedade persistida `is_online`.

## Helper

Servico central:

```text
backend/services/user_presence_service.py
```

Constantes:

- `PRESENCE_WRITE_THROTTLE_SECONDS = 60`
- `ONLINE_WINDOW_SECONDS = 180`

Funcoes principais:

- `should_update_last_seen(last_seen_at, now=None, throttle_seconds=60)`
- `mark_user_activity(usuario, db=None, force=False, isolated_session=True, now=None)`
- `mark_user_activity_fail_open(usuario, db=None, force=False, isolated_session=True, now=None)`

Regra de atualizacao:

- atualiza se `last_seen_at` for nulo;
- atualiza se `last_seen_at <= now_utc - 60 segundos`;
- ignora se houver atividade ha menos de 60 segundos;
- `force=True` grava independentemente do throttle e e usado somente em eventos de login/setup.

## UTC

O helper usa `datetime.now(timezone.utc)` e normaliza comparacoes para UTC timezone-aware.

## Integracoes

Login por senha:

- preserva `ultimo_login_em`;
- preserva `online=True`;
- grava `last_seen_at` com `force=True`;
- nao altera token nem response.

Google OAuth:

- preserva `online=True`;
- grava `last_seen_at` com `force=True`;
- nao altera token nem redirect.

Requests autenticadas:

- `get_current_user` chama o helper apos token valido, usuario localizado, conta sistemica bloqueada, usuario inativo bloqueado e regra de primeiro acesso validada;
- token invalido, usuario inexistente, usuario inativo bloqueado, setup bloqueado e usuario sistemico nao atualizam presenca.

`/auth/renew`:

- passa por `get_current_user`;
- reutiliza a integracao central;
- o throttle evita escrita duplicada;
- contrato de token e response preservado.

Setup complete:

- preserva `senha_interna_hash`, `forcar_troca_senha=False`, `setup_completed=True` e `online=True`;
- grava `last_seen_at` com `force=True`;
- nao altera payload nem response.

Logout:

- preserva o comportamento legado `usuarios.online = False`;
- nao limpa `last_seen_at`;
- nao cria revogacao de token.

Usuario sistemico:

- o helper ignora `is_system_user=True`;
- conta sistemica continua sem sessao interativa.

## Estrategia transacional

Requests autenticadas usam `UPDATE` isolado em uma sessao curta propria, aberta via `SessionLocal`.

Motivo:

- evitar `commit()` indiscriminado dentro da dependencia;
- evitar confirmar alteracoes funcionais da request principal;
- preservar rollback das rotas mutaveis;
- manter presenca como funcionalidade auxiliar.

Login, Google OAuth e setup complete usam a sessao atual porque essas rotas ja possuem commit funcional proprio e precisam garantir o registro imediato do evento autenticado.

## Fail-open

Falha ao gravar presenca:

- nao derruba login valido;
- nao derruba renew valido;
- nao derruba request autenticada valida;
- registra warning tecnico sem token, senha ou payload clinico.

## Testes

Testes adicionados/atualizados:

- `backend/tests/test_user_presence_service.py`
- `backend/tests/test_auth_renew.py`

Coberturas principais:

- migration upgrade nullable sem backfill;
- downgrade remove somente a coluna;
- model possui `last_seen_at` timezone-aware;
- primeiro registro atualiza;
- menos de 60 segundos nao atualiza;
- exatamente 60 segundos atualiza;
- mais de 60 segundos atualiza;
- `force=True` atualiza;
- usuario sistemico nao atualiza;
- helper nao altera `online`, `ultimo_login_em`, `setup_completed`, `ativo` ou senha;
- login valido atualiza `last_seen_at`;
- login invalido nao atualiza;
- token invalido nao atualiza;
- usuario inativo bloqueado nao atualiza;
- `get_current_user` chama presenca sem commit da sessao funcional;
- renew preserva `ultimo_login_em`.

## Fora do escopo preservado

- `GET /superadmin/usuarios` nao retorna `last_seen_at` nem `is_online`;
- CSV preservado;
- frontend React preservado;
- coluna `Online` ainda ausente;
- filtro, ordenacao e tooltip ainda pendentes;
- Redis, WebSocket, SSE, heartbeat e sessoes persistidas nao foram criados.

## Proximos passos

Fase 2:

- calcular `is_online` no backend pela janela de 3 minutos;
- retornar `last_seen_at` e `is_online` em `GET /superadmin/usuarios`;
- atualizar normalizador React;
- adicionar coluna `Online` apos `Status`;
- implementar filtro, ordenacao e tooltip.

## Atualizacao - Fase 2 concluida em codigo

Em 2026-07-22, a Fase 2 foi implementada:

- `GET /superadmin/usuarios` retorna `last_seen_at` e `is_online`;
- `is_online` usa a janela oficial de 3 minutos;
- usuario sistemico permanece `Nao aplicavel` no frontend;
- coluna `Online` foi adicionada imediatamente apos `Status`;
- coluna visual `Protecao` foi removida da tabela principal;
- protecao permanece no subtitulo do nome, modal de detalhes, badge e dados normalizados;
- filtro, ordenacao e tooltip foram adicionados na coluna `Online`;
- CSV nao foi alterado.

## Git

Sem commit.

Sem push.
