# Checkpoint Ficha Clínica FC2-D2-R5

## Identificação

- CHECKPOINT_NAME: `FICHA_CLINICA_FC2_D2_R5`
- CHECKPOINT_PURPOSE: Estado estável da Ficha Clínica após cabeçalho contextual do paciente, abertura contextual da Ficha Pessoal e fechamento do paciente em uso.
- CHECKPOINT_STATUS: `READY_AS_REGRESSION_CHECKPOINT`
- CHECKPOINT_DATE: `2026-09-10`
- CURRENT_BRANCH: `modularizacao-segura-fase-1`
- CURRENT_HEAD: `a49813c1c6cf6e976ea80842f242e61a1de6473e`
- WORKTREE_STATUS: dirty/preexistente; há amplo conjunto de alterações e documentos fora desta rodada. Este checkpoint não deve ser interpretado como limpeza ou aprovação desse worktree.

## Regra de ouro

Contratos `HOMOLOGADO`, `COMPLETE`, `LOCKED` e `REGRESSION_BASELINE` só podem mudar com motivo explícito, evidência de regressão e autorização do usuário.

## Contratos congelados

- Rota e shell da Ficha Clínica: HOMOLOGADO.
- Toolbar oficial de oito ícones e ordem visual: LOCKED.
- Geometria do odontograma: LOCKED — canvas 576px, 16×36px, dentes 32px, frame mínimo 212px, coluna esquerda aproximada 618px.
- PatientInUseContext como fonte clínica contextual: LOCKED.
- Cabeçalho do paciente e `icon_combo.png` 16×16: HOMOLOGADO.
- Menu contextual com `Abre ficha pessoal` e `Fecha ficha clínica`: LOCKED.
- Abertura contextual: `openExistingPatient(patientInUse.id)` → `FichaPessoalModal` `mode=existing`: HOMOLOGADO.
- Fechamento contextual: `clearPatientInUse()` → `clearPatient()`, sem navegação: HOMOLOGADO.
- Estado sem paciente permanece na mesma Ficha Clínica: LOCKED.
- Fluxo Novo paciente e abertura de Novo tratamento: LOCKED.
- Aba Principal: datas, índice, cirurgião, unidade, metadados e visual homologados conforme contratos anteriores.
- Aba Convênio: TISS, três cirurgiões, sinais, tecidos moles e texto livre homologados.

## Pendências explícitas

1. `NEW_TREATMENT_CONVENIO_LABEL_STATUS = PENDING`: o contrato correto é Convênio da Ficha Pessoal do mesmo paciente, mas o label fechado `Convenio 1` ainda não foi homologado como label canônico.
2. A Tabela principal baseada no paciente deve permanecer `PENDING_VERIFICATION` se a prova runtime atual não estiver disponível.

Preferências não devem ser tratadas como fonte dos defaults de Convênio/Tabela quando o contrato vigente aponta para o paciente em uso.

## Testes

Arquivos executados:

- `frontend-react/tests/fichaClinicaPatientInUse.test.mjs`
- `frontend-react/tests/fichaClinicaNewPatientContext.test.mjs`
- `frontend-react/tests/novoTratamentoModal.test.mjs`

Resultado: `34` testes totais, `34` pass, `0` fail.

Build: `PASS` via `npm run build`. Houve somente warning não bloqueante sobre chunks maiores que 500 kB.

## Inventário de arquivos críticos

- `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx`
- `frontend-react/src/features/fichaClinica/fichaClinica.css`
- `frontend-react/src/features/fichaClinica/NovoTratamentoModal.jsx`
- `frontend-react/src/features/fichaClinica/NovoTratamentoPrincipalTab.jsx`
- `frontend-react/src/features/fichaClinica/NovoTratamentoConvenioTab.jsx`
- `frontend-react/src/features/fichaClinica/novoTratamentoApi.js`
- `frontend-react/src/features/fichaClinica/novoTratamentoMappers.js`
- `frontend-react/src/shared/patientInUse/PatientInUseContext.jsx`
- `frontend-react/src/shared/patientInUse/patientInUseUtils.js`
- `frontend-react/src/features/pacientes/components/fichaPessoal/FichaPessoalModal.jsx`
- `frontend-react/src/app/App.jsx`
- `frontend-react/tests/fichaClinicaPatientInUse.test.mjs`
- `frontend-react/tests/fichaClinicaNewPatientContext.test.mjs`
- `frontend-react/tests/novoTratamentoModal.test.mjs`
- `docs/ficha_clinica_estado_atual.md`

## SHA-256

| Arquivo | SHA-256 |
|---|---|
| `frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx` | `AB521145581BA07378067E82D9DCBC2A22EAABCD146880AAFB55A97AC3386FE4` |
| `frontend-react/src/features/fichaClinica/fichaClinica.css` | `C5594FCC57DF5EFBA680D93F92280F78BC057A52A9F47C58D8DD0F28677A160A` |
| `frontend-react/src/features/fichaClinica/NovoTratamentoModal.jsx` | `359DBC18EFDE25E133B0A37563B417333F50303CF3DF640BA5741779F586BF08` |
| `frontend-react/src/features/fichaClinica/NovoTratamentoPrincipalTab.jsx` | `67DCC5F49B1FC636759F7631F0C25C0BAE29DE83340DBFA153F9B41D09C29FD5` |
| `frontend-react/src/features/fichaClinica/novoTratamentoMappers.js` | `FE2BA3B127D4C28585CDC6CD899B1140BCAB55A96249E3C9E18DA8170CDC46AA` |
| `frontend-react/src/shared/patientInUse/PatientInUseContext.jsx` | `6052A280E684376F6EA98AACB14ACEE9319D339E4E5384D487F8AB4B6EC193C3` |
| `frontend-react/src/features/pacientes/components/fichaPessoal/FichaPessoalModal.jsx` | `497035BC081DD888CD4B2836E7C0637487A6472A7E0B10E712EF8BA8FA21D279` |
| `frontend-react/src/app/App.jsx` | `0899068182D3BB9C46E549D97335F7F4ADCCAA9AE1EE2BB32FD544FE85C1C75C` |
| `frontend-react/tests/fichaClinicaPatientInUse.test.mjs` | `E52BCCE469E20B6F7C2F971E5D2A90A482D2F57E39CA62BFB53DC6B20C58C1C7` |
| `frontend-react/tests/fichaClinicaNewPatientContext.test.mjs` | `3F5E2A5E8D6A0F49A7A73E55C8CAC9B9E580AFD06882AA53311F5BE507E57111` |
| `docs/ficha_clinica_estado_atual.md` | `F5764EEDE81BD69A7BE8CF31921D1E409DCFF66822EDB945E97817047474A38D` |

## Runtime fixo

- Frontend: HTTPS 5173.
- Backend: 8000.
- Não iniciar segunda instância, trocar porta/protocolo/certificados ou alterar `.env`/`vite.config` para contornar regressão.
- Incidente histórico: listener ghost/stale reportado no PID 8716; registrar para diagnóstico, sem transformá-lo em contrato funcional.

## Rollback seletivo

1. Comparar a regressão com este manifesto.
2. Isolar o diff da feature.
3. Preservar alterações posteriores não relacionadas.
4. Restaurar somente a região contratual regressiva.
5. Reexecutar os 34 testes do checkpoint.
6. Revalidar visualmente no runtime.

Não usar `git reset --hard` como procedimento padrão.

## Ações proibidas neste checkpoint

- FUNCTIONAL_CODE_CHANGED: `NÃO`
- COMMIT: `NÃO`
- PUSH: `NÃO`
- TAG: `NÃO`
- MERGE: `NÃO`
- REBASE: `NÃO`
- CHERRY_PICK: `NÃO`
- RESET: `NÃO`
- VITE_RESTARTED: `NÃO`
- BACKEND_RESTARTED: `NÃO`
- BAT_EXECUTED: `NÃO`
- GITHUB_ACTION: `NONE`
