# Contrato - Coluna Online - ADM Usuarios React

Data: 2026-07-22

## 1. Objetivo

Definir o contrato futuro da coluna `Online` em `ADM -> Usuarios`, sem implementar nesta rodada.

A coluna deve informar presenca recente por atividade autenticada, separada do status cadastral ativo/inativo.

## 2. Definicao oficial

`Online` significa atividade autenticada recente, nao garantia de que a pessoa esta olhando para a tela naquele segundo.

Janela oficial recomendada: 3 minutos.

Estados:

- `Online`: `last_seen_at` dentro dos ultimos 3 minutos;
- `Offline`: `last_seen_at` existente, mas anterior a 3 minutos;
- `Nunca acessou`: sem `last_seen_at`;
- `Nao aplicavel`: usuario sistemico sem sessao interativa.

## 3. Dados futuros

Campo recomendado:

```text
usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL
```

Payload futuro de `GET /superadmin/usuarios`:

```json
{
  "last_seen_at": "2026-07-22T17:30:00Z",
  "is_online": true
}
```

Timezone:

- persistir em UTC;
- retornar ISO 8601 com timezone;
- formatar no frontend em `DD/MM/AAAA HH:mm`.

## 4. Fonte de verdade

Fonte de verdade: backend.

O backend deve:

- gravar `last_seen_at`;
- aplicar throttle;
- calcular `is_online`;
- retornar timestamp em UTC.

O frontend deve:

- exibir o valor calculado;
- formatar tooltip;
- filtrar e ordenar localmente quando aplicavel.

## 5. Registro de atividade

Eventos futuros recomendados:

- login bem-sucedido;
- request autenticada em ponto backend comum;
- `/auth/renew`, desde que use o mesmo helper de atividade e nao seja a unica fonte.

Throttle:

- gravar no maximo uma vez a cada 60 segundos por usuario;
- se `last_seen_at` for nulo, gravar imediatamente;
- se `last_seen_at < now - 60s`, gravar;
- caso contrario, nao gravar.

## 6. Logout e fechamento

Logout explicito:

- pode manter a limpeza de `usuarios.online` legado;
- nao deve ser a unica forma de marcar offline;
- a coluna nova deve considerar offline por timeout.

Fechamento abrupto, travamento e queda de conexao:

- nao depender de `beforeunload`;
- usuario fica online ate expirar a janela de 3 minutos.

## 7. Posicao visual

Ordem futura principal:

```text
ID | Nome | E-mail | Clinica | Plano | Perfil | Status | Online
```

Posicao obrigatoria:

- imediatamente apos `Status`.

Nao alterar:

- significado de `Status`;
- selecao unica;
- filtros existentes;
- ordenacao existente;
- shell ADM em L;
- toolbar;
- exportacao CSV;
- `Ver detalhes`.

## 8. Visual

Valores:

| Estado | Rotulo | Indicador |
|---|---|---|
| online | `Online` | verde |
| offline | `Offline` | cinza |
| never | `Nunca acessou` | neutro |
| not_applicable | `Nao aplicavel` | neutro |

Tooltip:

```text
Ultima atividade: DD/MM/AAAA HH:mm
```

Para `Nunca acessou`:

```text
Sem atividade registrada
```

Para `Nao aplicavel`:

```text
Usuario sistemico sem sessao interativa
```

## 9. Filtro e ordenacao

Filtro futuro:

- todos;
- online;
- offline;
- nunca acessou;
- nao aplicavel.

Ordenacao:

- por `last_seen_at`;
- valores nulos no fim;
- usuario sistemico pode ficar no fim.

## 10. Usuario sistemico

Recomendacao: exibir `Nao aplicavel`.

Justificativa:

- conta sistemica nao deve ter login interativo;
- `Nunca acessou` poderia sugerir uma pendencia operacional;
- `Nao aplicavel` preserva a semantica de conta protegida.

## 11. Owner

Owner deve seguir a regra normal de usuario interativo:

- se tiver atividade recente: `Online`;
- se tiver atividade antiga: `Offline`;
- se nunca tiver `last_seen_at`: `Nunca acessou`.

Nao hardcodar e-mail no frontend.

## 12. Privacidade

Nao exibir:

- IP;
- navegador;
- dispositivo;
- localizacao;
- token;
- session ID.

## 13. Fora do escopo da primeira implementacao

- tabela de sessoes;
- refresh token;
- revogacao por dispositivo;
- logout remoto;
- Redis;
- lider entre abas;
- heartbeat dedicado obrigatorio;
- atualizacao automatica da tabela ADM por timer.

## 14. Testes obrigatorios futuros

Backend:

- migration adiciona `last_seen_at`;
- login atualiza `last_seen_at`;
- dependency autenticada atualiza com throttle;
- renew passa pelo helper ou preserva contrato documentado;
- throttle evita multiplas escritas;
- `GET /superadmin/usuarios` retorna `last_seen_at` e `is_online`;
- usuario sem timestamp;
- usuario dentro/fora da janela;
- usuario sistemico;
- timezone UTC.

Frontend:

- normalizador aceita `last_seen_at` e `is_online`;
- coluna `Online` fica apos `Status`;

## 15. Fase 1 backend implementada

Em 2026-07-22, a Fase 1 criou a base de persistencia e registro de atividade:

- `usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL`;
- sem default;
- sem backfill;
- UTC timezone-aware;
- helper central com `PRESENCE_WRITE_THROTTLE_SECONDS = 60`;
- requests autenticadas registram atividade com sessao curta propria e fail-open;
- login e setup registram atividade com `force=True`;
- logout preserva `last_seen_at` e continua apenas limpando `usuarios.online`.

O contrato visual e de payload da coluna continua pendente para a Fase 2.

## 16. Fase 2 - Endpoint ADM e coluna React

Em 2026-07-22, a Fase 2 implementou o contrato visual e de payload da coluna `Online` em `ADM -> Usuarios`.

Backend:

- `GET /superadmin/usuarios` retorna `last_seen_at`;
- `GET /superadmin/usuarios` retorna `is_online`;
- `is_online` e calculado por `last_seen_at >= now_utc - 3 minutos`;
- usuario sistemico retorna `last_seen_at = null` e `is_online = false`;
- `GET /superadmin/usuarios/export.csv` nao foi alterado.

Frontend React:

- a tabela principal exibe `Online` imediatamente apos `Status`;
- a coluna visual independente `Protecao` foi removida da tabela principal;
- a protecao continua no subtitulo `Usuario de sistema`, no modal `Ver detalhes`, no badge `Protegido`, na normalizacao e nas regras internas;
- valores exibidos: `Online`, `Offline`, `Nunca acessou` e `Nao aplicavel`;
- tooltip: ultima atividade, sem atividade registrada ou usuario sistemico sem sessao interativa;
- filtro e ordenacao usam a presenca normalizada;
- o botao `Atualizar` preserva o comportamento existente de refazer `GET /superadmin/usuarios`.

Continuam fora do escopo:

- heartbeat dedicado;
- atualizacao automatica por timer;
- Redis, WebSocket, SSE e sessao persistida;
- mudancas no CSV;
- commit, push e AWS.
- valores visuais corretos;
- tooltip correto;
- filtro correto;
- ordenacao correta;
- `Atualizar` recarrega a presenca;
- `Status` ativo/inativo nao muda;
- shell ADM em L preservado;
- exportacao e `Ver detalhes` preservados.

## 15. Criterio de aceite

A coluna so pode ser considerada concluida quando:

- houver fonte real `last_seen_at`;
- `is_online` for calculado pelo backend;
- a janela de 3 minutos estiver testada;
- throttle de 60 segundos estiver testado;
- `Status` e `Online` permanecerem conceitos separados;
- runtime autenticado validar dois usuarios, logout, timeout e multiplas abas.
