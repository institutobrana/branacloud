# Ficha Clínica — FC3-D3 Checkpoint

## Identificação

- Nome: `FICHA_CLINICA_PATIENT_LOCK_FC3_D3`
- Status: `HOMOLOGATED`
- Checkpoint D1: `8f9b7cb4530a088ebcd1a5f1b4fb1dab2088cc02`
- Checkpoint D2: `6aa1adf69ec9b81cf047764904def6ee64a6887e`
- Escopo seguinte: D4; não implementado neste checkpoint.

## Entrega D3

Arquivos backend:

- `backend/routes/clinical_lock_routes.py`
- `backend/services/clinical_patient_lease_service.py`
- `backend/services/clinical_patient_lease_config.py`

Arquivos frontend:

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/shared/clinicalLease/clinicalLeaseApi.js`
- `frontend-react/src/shared/clinicalLease/ClinicalLeaseProvider.jsx`
- `frontend-react/src/shared/clinicalLease/clinicalLeaseConfig.js`

Endpoint:

`POST /clinical-locks/{patient_id}/heartbeat`

Headers obrigatórios: `Authorization`, `X-Session-Instance-Id` e `X-Clinical-Lease-Token`.

## Contratos

- Intervalo do heartbeat: 20 segundos.
- Duração do lease: 90 segundos.
- PostgreSQL é a autoridade temporal exclusiva.
- Heartbeat válido renova `last_heartbeat_at`, `expires_at` e `updated_at`.
- O token não é rotacionado durante o mesmo ownership.
- Lease expirado não é ressuscitado.
- `CLINICAL_PATIENT_LEASE_LOST` representa ownership perdido.
- Session inválida, tenant inválido e paciente fora da clínica continuam protegidos.
- Timer existe somente em `OWNER`.
- Focus e visibility revalidam ownership.
- Erro de rede leva o estado interno para `UNKNOWN`.
- `UNKNOWN` é fail-closed.
- Não há migration nova.
- Não há guards D4 nem UI D5.

## Evidências

- D3: H1–H20, 20/20 PASS.
- H12 heartbeat versus takeover: PASS.
- H13 heartbeat versus release: PASS.
- Concorrência: exatamente um owner.
- Regressão D2 crítica: 10/10 PASS.
- Backend import: PASS.
- Frontend build: PASS.
- Mudança visual: nenhuma.

## Artefatos de teste

- PostgreSQL `127.0.0.1:55432`: `KEEP_FOR_D4_INITIAL_VALIDATION`.
- Banco `brana_fc3_d1_test_20261002_115558`: `KEEP_FOR_D4_INITIAL_VALIDATION`.
- Fixtures sintéticas: `KEEP_FOR_D4_INITIAL_VALIDATION`.
- Playwright preexistente: `OFFICIAL_TEST_INFRASTRUCTURE`.

Remover após a validação inicial D4, se não houver necessidade comprovada.

## Próximo passo

Planejamento/implementação D4, somente após revisão deste checkpoint. D4 não faz parte desta entrega.
