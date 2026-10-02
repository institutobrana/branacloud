# Checkpoint FC3-D1 — identidade operacional por aba

## Identificação

- Nome: `FICHA_CLINICA_PATIENT_LOCK_FC3_D1`
- Branch: `modularizacao-segura-fase-1`
- HEAD antes do checkpoint: `f608fccd1f6fdc1737ef585538b58e1bb8ff4ab7`
- Status: `HOMOLOGATED`
- Push/merge/tag: não realizados

## Escopo homologado

- identidade operacional própria por aba;
- registry persistente de instâncias autenticadas;
- validação backend da instância;
- preservação no F5;
- nova aba independente;
- resolução de duplicação por `BroadcastChannel`;
- fallback seguro sem `BroadcastChannel`;
- logout com invalidação;
- renew preservando a instância;
- isolamento completo de `PatientInUse`.

Não fazem parte da D1: patient lease funcional, acquire/release clínico, heartbeat, expiry, guards de Tratamento/Odontograma, OWNER/RESTRICTED, polling ou promoção automática.

## Arquivos D1

- `backend/main.py`
- `backend/routes/auth_routes.py`
- `backend/routes/session_instance_routes.py`
- `backend/models/authenticated_session_instance.py`
- `backend/models/clinical_patient_lease.py`
- `backend/services/schema_deployment/fc3_d1_session_instance.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/auth/AuthProvider.jsx`
- `frontend-react/src/features/auth/authApi.js`
- `frontend-react/src/shared/sessionInstance/sessionInstanceStorage.js`
- `frontend-react/src/shared/sessionInstance/SessionInstanceProvider.jsx`
- `frontend-react/tests/sessionInstanceStorage.test.mjs`

## Evidências finais

- D1 testes: 22/22 PASS, 0 FAIL, 0 NOT_RUN;
- F5, nova aba e duplicação: PASS;
- fallback sem `BroadcastChannel`: PASS;
- `PatientInUse` preservado: PASS;
- logout/invalidação e renew: PASS;
- frontend build: PASS;
- backend tests/imports relevantes: PASS;
- visual: sem alteração detectada;
- runtime final: HTTPS 5173, backend 8000, uma instância Vite;
- backend isolado 18000: encerrado;
- banco real e dados clínicos reais: não alterados.

## Riscos remanescentes

- O PostgreSQL descartável em `127.0.0.1:55432`, o banco `brana_fc3_d1_test_20261002_115558` e suas fixtures permanecem temporariamente para a validação imediata da D2; devem ser removidos em cleanup posterior controlado.
- O pacote Playwright preexistente permanece como infraestrutura reutilizável de teste.
- D2 ainda não foi iniciada.

## Próximos passos

Planejar D2 somente após revisão deste checkpoint. A próxima fase poderá especificar o patient lease funcional, sem modificar silenciosamente os contratos homologados da FC2-D2-R5 ou desta D1.
