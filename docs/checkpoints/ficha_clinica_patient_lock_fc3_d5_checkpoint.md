# Brana Cloude — FC3-D5 checkpoint final

## Origem e status

- Base anterior: FC3-D4 checkpoint `44bb1358871b987d767bda116e6a3e3d658bbc44`.
- FC3-D5: `HOMOLOGATED` pela matriz final atual.
- As definições históricas V9–V12 não foram recuperadas e permanecem `UNRECOVERED`; a matriz D5-FINAL-1..4 não as substitui historicamente.

## Escopo funcional

Escopo: `TREATMENT_ODONTOGRAM_WRITE_DOMAIN`.

Estados: `AVAILABLE`, `OWNER`, `RESTRICTED` e `UNKNOWN`. Mutations protegidas exigem `OWNER`; `RESTRICTED` e `UNKNOWN` são fail-closed para esse domínio. Ficha Pessoal, Histórico, reads, parcela financeira e print permanecem fora do bloqueio global.

Endpoints protegidos:

1. `POST /tratamentos/novo`
2. `PUT /tratamentos/{tratamento_id}`
3. `PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id}`
4. `POST /orcamento/tratamentos/{tratamento_id}/aprovar`

## Arquivos funcionais FC3-D5

- `frontend-react/src/shared/clinicalLease/ClinicalLeaseProvider.jsx`: acquire, estado, heartbeat, release, polling, lifecycle e pagehide.
- `frontend-react/src/shared/clinicalLease/clinicalLeaseApi.js`: cliente dos endpoints de lease e opção fetch keepalive.
- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`: integração visual do estado clínico.
- `frontend-react/src/features/fichaClinica/NovoTratamentoModal.jsx`: bloqueio fail-closed e reconciliação de mutations.
- `frontend-react/src/app/App.jsx`: lifecycle de fechamento, troca e logout.
- `frontend-react/src/shared/clinicalLease/ClinicalLeaseStatusBanner.jsx`: banner visual de estado.

Backend e frontend legado não foram alterados nesta fase.

## Lifecycle e timers

- Release explícito: fechar ficha, troca de paciente e logout.
- Release best-effort: pagehide, fechamento de aba/navegador, navegação externa e F5.
- `event.persisted === true`: não libera, preservando retorno por BFCache.
- Heartbeat OWNER: 20 segundos.
- Recheck RESTRICTED: 20 segundos.
- TTL: 90 segundos; autoridade final para falhas abruptas.
- Crash, queda de energia e interrupção abrupta de rede/processo não são garantidos pelo pagehide.

## Concorrência

Política: `FIRST_SUCCESSFUL_ACQUIRE`. Não existe fila ou garantia FIFO. Com múltiplas sessões `RESTRICTED`, a primeira aquisição válida torna-se `OWNER`, a outra permanece `RESTRICTED`, e o backend mantém exatamente um owner.

Takeover/“Assumir acesso clínico” está fora do escopo D5 e não foi implementado.

## Matriz final

- D5-FINAL-1 — Acesso normal de OWNER: `PASS`.
- D5-FINAL-2 — Segunda sessão bloqueada corretamente: `PASS`.
- D5-FINAL-3 — Promoção automática após liberação: `PASS`.
- D5-FINAL-4 — Indisponibilidade de confirmação clínica: `NOT_MANUALLY_REPRODUCED`; fail-closed coberto por contrato técnico, sem forçar falha operacional.

V1–V8: `PASS`. Lifecycles R1B, R1D, R1E, R1F e pagehide: `PASS`.

## Cleanup e riscos residuais

- Instrumentação diagnóstica temporária R1F-E: removida.
- Referências ativas de diagnóstico do clinical lease: 0.
- Cleanup temporário: `COMPLETE`.
- Risco residual: pagehide é best-effort; TTL permanece fallback.
- Incidente Vite/esbuild resolvido; não é requisito funcional.

## Fechamento

`FC3_D5_FUNCTIONAL_OBJECTIVE = COMPLETE`

`FC3_D5_HOMOLOGATION = HOMOLOGATED`

`CHECKPOINT_COMMIT = este commit`
