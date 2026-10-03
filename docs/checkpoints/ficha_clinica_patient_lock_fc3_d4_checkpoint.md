# Brana Cloude — FC3-D4 checkpoint

## Origem e status

- Origem: FC3-D3 checkpoint `c653e8ba884ddb190b188dbde0a168a7d08e6da1`.
- FC3-D4: `HOMOLOGATED`.
- Escopo: `TREATMENT_ODONTOGRAM_WRITE_DOMAIN`.

## Implementação

Novo guard: `backend/services/clinical_patient_lease_guard.py`.

Endpoints protegidos, exatamente quatro:

1. `POST /tratamentos/novo`
2. `PUT /tratamentos/{tratamento_id}`
3. `PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id}`
4. `POST /orcamento/tratamentos/{tratamento_id}/aprovar`

O guard valida tenant, sessão ativa, owner, sessão owner, token e `expires_at > CURRENT_TIMESTAMP` no PostgreSQL. Usa `SELECT ... FOR UPDATE`, não commita, não adquire, renova, libera ou rotaciona lease. A mutation protegida compartilha a mesma Session/transação e o lock permanece até commit/rollback.

Contratos: `PATIENT_NOT_FOUND_IN_CLINIC` (404), `SESSION_INSTANCE_INVALID` (409), `CLINICAL_PATIENT_LEASE_LOST` (409) e `CLINICAL_PATIENT_LEASE_NOT_OWNER` (409).

## Validação

- D4: 21/21 testes aplicáveis PASS; G13–G15 `NOT_APPLICABLE_CURRENT_API`.
- D3: 5/5 PASS.
- D2 crítica: 5/5 PASS.
- G20: PASS — mutation HTTP real em `PUT /tratamentos/3`, guard real, lock PostgreSQL, transaction aberta antes do commit, acquire concorrente iniciado enquanto A estava aberta, B bloqueada, A commitou primeiro, B concluiu como `RESTRICTED`, exactly one lease e zero partial write.
- Parcela não bloqueada pelo guard; print permitido sem escrita.
- Backend import PASS; frontend build PASS.
- Sem migration, sem mudança visual e sem alteração do frontend legado.

## Frontend e escopo

O único caller React atual é `frontend-react/src/features/fichaClinica/novoTratamentoApi.js`, acionado por `NovoTratamentoModal.jsx`. Ele envia `X-Session-Instance-Id` e `X-Clinical-Lease-Token` obtidos dos providers D1/D3, sem persistir token e sem interceptor global.

`frontend/` permanece `REFERENCE_ONLY`, sem participação no runtime moderno. Ficha Pessoal, Histórico, leituras, impressão e parcelas permanecem fora do guard. Nenhuma UI D5 foi implementada.

## Arquivos da D4

- `backend/routes/tratamentos_routes.py`
- `backend/routes/orcamento_routes.py`
- `backend/services/orcamento_service.py`
- `backend/services/orcamento_financeiro_service.py`
- `backend/services/clinical_patient_lease_guard.py`
- `frontend-react/src/features/fichaClinica/NovoTratamentoModal.jsx`
- `frontend-react/src/features/fichaClinica/novoTratamentoApi.js`
- `docs/ficha_clinica_estado_atual.md`
- este checkpoint

## Cleanup e continuidade

A master fixture sintética do banco descartável 55432 foi usada somente para validação e removida após a conclusão dos testes; scripts e manifesto temporários também foram removidos. O ambiente descartável não é necessário para D5. Playwright e a infraestrutura oficial permanecem intactos.

Próximo estágio: planejamento explícito de FC3-D5. Nenhuma implementação D5 faz parte deste checkpoint.
