# FICHA CLÍNICA — FC3-D2 CHECKPOINT

Status: `HOMOLOGATED`

Origem: FC3-D1 checkpoint `8f9b7cb4530a088ebcd1a5f1b4fb1dab2088cc02`.

## Escopo

Implementado somente o mecanismo backend de Clinical Patient Lease:

- `POST /clinical-locks/{patient_id}/acquire`
- `GET /clinical-locks/{patient_id}`
- `POST /clinical-locks/{patient_id}/release`

Headers:

- `X-Session-Instance-Id`
- `X-Clinical-Lease-Token` no release

O tenant é derivado do JWT. O paciente é validado por `clinica_id`.

## Arquivos D2

- `backend/main.py`
- `backend/routes/clinical_lock_routes.py`
- `backend/services/clinical_patient_lease_service.py`
- `backend/tests/test_clinical_patient_lease_d2.py`

Não houve alteração de frontend, migration ou modelos D1.

## Validação

- D2-T1 a D2-T15: `15 PASS`, `0 FAIL`, `0 NOT_RUN`.
- Concorrência real: exatamente um `OWNER`.
- Privacy, multi-tenant, token semantics, stale release e rollback: PASS.
- T11 foi inicialmente marcado incorretamente por defeito do harness; após correção da preparação/leitura do teste, takeover expirado passou.
- Frontend build: PASS, com warning não bloqueante de chunks grandes.
- Backend import/check: PASS.

## Limites preservados

Não implementados nesta fase:

- heartbeat;
- polling;
- promoção automática;
- guards de Tratamento/Odontograma;
- UI `OWNER`/`RESTRICTED`;
- D3.

## Artefatos de teste

O harness temporário foi removido após a validação. O PostgreSQL descartável `127.0.0.1:55432`, banco `brana_fc3_d1_test_20261002_115558` e fixtures sintéticas permanecem classificados como `KEEP_FOR_D3`, pois serão reutilizados na validação de heartbeat/expiry.

## Próximo passo

Planejamento de FC3-D3, sem iniciar implementação nesta etapa.
