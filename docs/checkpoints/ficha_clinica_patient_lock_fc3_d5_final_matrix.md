# Brana Cloude — FC3-D5 matriz final

## Estado

Este checkpoint documental consolida a FC3-D5 homologada pela matriz final atual. V1–V8 e os lifecycles R1B, R1D, R1E, R1F e pagehide estão registrados como comprovados. As definições históricas V9–V12 não foram localizadas e permanecem `UNRECOVERED`.

## Matriz atual

| ID | Teste | Status inicial |
|---|---|---|
| D5-FINAL-1 | Acesso normal de OWNER | `PASS` |
| D5-FINAL-2 | Segunda sessão bloqueada corretamente | `PASS` |
| D5-FINAL-3 | Promoção automática após liberação, incluindo multi-restricted | `PASS` |
| D5-FINAL-4 | Indisponibilidade de confirmação clínica | `NOT_MANUALLY_REPRODUCED` |

## Contratos consolidados

- `OWNER` é obrigatório para mutations protegidas.
- `RESTRICTED` permite leitura e funções fora do domínio protegido.
- `UNKNOWN` é fail-closed.
- Recheck `RESTRICTED`: 20 segundos; sem garantia rígida em background.
- Heartbeat `OWNER`: 20 segundos; TTL: 90 segundos.
- Release explícito: fechar ficha, troca de paciente e logout.
- Release best-effort: pagehide, fechamento, navegação externa e F5.
- `event.persisted === true` não libera lease.
- Multi-restricted: `FIRST_SUCCESSFUL_ACQUIRE`; sem fila e sem FIFO; exactly one owner no backend.
- Takeover não pertence ao escopo atual.

## Fora do escopo

Ficha Pessoal, Histórico, reads, parcela financeira, print e catálogos/configurações não recebem bloqueio global.

## Cleanup e estado

A instrumentação temporária foi removida; `TEMP_DEBUG_REFERENCES_REMAINING = 0`. Nenhuma migration, backend change, legacy change ou nova feature faz parte deste checkpoint.

`FC3_D5_HOMOLOGATION = HOMOLOGATED`.

`FC3_D5_OVERALL_STATUS = HOMOLOGATED`.

Próximo passo: preservar o checkpoint e não iniciar D6 nesta rodada.
