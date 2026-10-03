# Ficha Clínica / Odontograma — checkpoint canônico

## Status

Este documento registra o estado atual do módulo React. A fonte de verdade é o código atual, o CSS atual, o contexto de paciente em uso e os testes dedicados. Relatórios históricos são apenas contexto.

- Módulo: Ficha Clínica
- Frontend: React
- Rota: /app/ficha-clinica
- Entrada: Topbar → Ficha Clínica; botão 8 da esquerda para a direita
- Runtime esperado: frontend HTTPS 5173; backend 8000
- Alteração de produto neste checkpoint: não
- GitHub/remote: nenhuma ação

## Arquivos principais

Primários:

- frontend-react/src/features/fichaClinica/FichaClinicaPage.jsx
- frontend-react/src/features/fichaClinica/fichaClinica.css
- frontend-react/tests/fichaClinicaPatientInUse.test.mjs

Suporte:

- frontend-react/src/app/App.jsx
- frontend-react/src/shared/patientInUse/PatientInUseContext.jsx
- frontend-react/src/shared/patientInUse/patientInUseUtils.js
- frontend-react/src/features/menuPacientes/components/MenuPacientesModal.jsx
- frontend-react/src/features/menuPacientes/api/menuPacientesApi.js
- frontend-react/src/layout/topbar/config/topbarActions.jsx
- frontend-react/src/layout/topbar/icons/BranaFichaClinicaIcon.jsx

Assets da toolbar: frontend-react/public/assets/fichaClinica/toolbar/. A origem autorizada é D:\BRANA ARQUIVOS\BRANA CLOUD\assets\images; a pasta legada não é dependência React.

## Paciente em uso

Sem paciente:

1. A Ficha Clínica é montada.
2. MenuPacientesModal abre uma vez.
3. O usuário seleciona ou cancela.
4. Na seleção, App.jsx chama setPatientInUse(patient).
5. A mesma Ficha Clínica passa a exibir o paciente.

Com paciente em uso, o paciente é preservado e o modal não reabre automaticamente. Cancelar fecha a seleção sem loop e mantém a Ficha aberta sem paciente.

PatientInUseProvider/usePatientInUse é a autoridade de runtime. sessionStorage, pela chave brana.fichaClinica.pacienteEmUso, serve somente para persistência e reidratação.

## Cabeçalho

Estado homologado:

    [foto] Nome completo
           número | X anos, Y meses | telefone 1

O código atual usa foto_data_url, codigo, nome, data_nascimento via calculatePatientAge e formatTelefone(patient), com fallback existente. Não reabrir sem solicitação.

## Toolbar superior

Status: HOMOLOGADA.

1. ico_novo_paciente_transp.png
2. ico_ficha_pesquisar.png
3. ico_filtro.PNG
4. ico_select.png
5. ico_trocar.png
6. ico_tabelas_auxiliares.PNG
7. ico_orcamento.png
8. ico_odonto_imprime.png

Origem oficial: D:\BRANA ARQUIVOS\BRANA CLOUD\assets\images.
Runtime: appPath('assets/fichaClinica/toolbar').

Tamanhos renderizados homologados: posições 1, 2, 3, 4, 5 e 8 = 24px; posições 6 e 7 = 30px.

Não copiar assets da pasta legada em futuras correções.

## Rail esquerdo

Status visual: HOMOLOGADO. Os botões preservam a posição global padrão. A continuação teal superior é feita por .brana-shell-band.ficha-clinica-shell-band::before, com width var(--brana-rail-width, 72px), pointer-events: none e sem hit-area. A continuidade inferior usa .ficha-clinica-shell-body > .brana-icon-rail com height auto e min-height 100%.

## Fundo geral

Override local: .ficha-clinica-shell-body { background: #f5f0e6; }.

Valor atual: #f5f0e6 / rgb(245, 240, 230). Valor anterior registrado: rgb(246, 248, 248). Não altera tokens globais ou outros módulos.

## Painel superior do odontograma

Componente: UpperOdontogramPanel, em FichaClinicaPage.jsx.

- Painel embutido na Ficha Clínica.
- Ant Design Tabs, type card, tabPosition bottom.
- Não é Modal, Drawer, overlay, portal ou popup.
- O conteúdo fica dentro de .ficha-clinica-odontogram-frame.
- A referência visual é Agenda de Contatos → Novo contato, sem reutilizar seu conteúdo funcional.

Valores atuais lidos do CSS:

| Propriedade | Valor |
| --- | --- |
| posição | bottom |
| altura | 30px |
| min-width | 84px |
| padding | 0 8px |
| border-radius | 0 0 12px 12px |
| gap do nav | 2px |
| fundo ativo | #f5f0e6 |
| fundo inativo | rgb(255, 255, 255) |
| indicador | teal, 2px, bottom |
| texto ativo | rgb(22, 51, 40) |
| texto inativo | rgb(82, 98, 106) |

A tab atual é vazia quando não há tratamento integrado.

## Tratamento e Boca/Dente

Sem tratamento integrado, o painel superior e a tab permanecem visíveis, sem data ou tratamento inventado. A aba Novo... do EasyDental não é funcional no React atual.

Boca e Dente não são tabs do painel superior. São quadro inferior independente:

    odontograma superior
    ↓ tabs próprias do odontograma
    ↓ barra de procedimentos
    ↓ barra de especialidades
    ↓ quadro Boca / Dente

Não misturar esses grupos.

## Geometria horizontal

Estado corrigido:

- canvas: width 576px; min-width 576px; flex 0 0 576px
- 16 slots
- grid: repeat(16, 36px)
- passo: 36px
- dente: 32px
- faces e números acompanham os slots fixos
- telas menores usam overflow local, sem compressão ou redistribuição

Não reintroduzir width 100% no canvas clínico ou repeat(16, minmax(0, 1fr)) nas linhas fixas.

## Geometria externa e altura

No intervalo desktop de 769–1400px, o CSS atual usa:

    .ficha-clinica-stage {
      grid-template-columns: 618px minmax(0, 1fr) 198px;
    }

Com rail recolhido, a terceira coluna é 44px. Até 768px permanecem regras responsivas separadas.

O frame .ficha-clinica-odontogram-frame usa min-height: 212px. O histórico homologado foi 286px → 212px para eliminar espaço inferior excessivo sem alterar a geometria horizontal.

Alinhamento superior atual:

- seletor: .ficha-clinica-upper-odontogram-panel
- propriedade: padding-top
- valor: 0px

O objetivo homologado é o alinhamento superior com o painel Tratamento. Não usar margem negativa, top negativo ou transform como substitutos.

## dente_vazio.png

Arquivo oficial auditado: D:\BRANA ARQUIVOS\BRANA CLOUD\assets\images\dente_vazio.png.

- dimensões: 739×255px
- SHA-256: 065928c65755e4faad0db940dc617c5f733beea83504d20a9a5b2a77a9c30b64
- uso legado: imagem inicial/vazia da arcada completa, ligada ao estado Novo...
- uso React: não implementado

O React compõe dentes, faces e numeração individualmente. Não substituir o grid por dente_vazio.png sem nova auditoria e autorização.

## Referência EasyDental

Separada do estado React: SVG ativo, width 576px, height 251px, viewBox 0 0 768 334, escala 0.75, posições fixas e passo visual 36px. Isso justifica a geometria fixa, mas não significa reprodução integral do SVG legado.

## Não implementado ainda

- integração real de tratamentos
- tabs por data
- aba Novo... funcional
- criação, seleção e troca de tratamentos
- carregamento do odontograma por tratamento
- intervenções clínicas reais
- nova persistência clínica
- integração completa de /odontograma/*
- integração completa de /tratamentos/*

O estado atual é principalmente shell, paciente em uso e estrutura visual do odontograma. Endpoints existentes não provam integração React.

## Testes atuais

Arquivo: frontend-react/tests/fichaClinicaPatientInUse.test.mjs.

- Casos declarados: 11
- Última execução: 11/11 PASS
- As asserções históricas do caso CC foram atualizadas para padding 0 14px 6px, min-width 84px e height 30px, sem alterar cobertura.
- Checkpoint: READY

## Matriz de regressão

| Área | Estado esperado | Contrato canônico | Arquivo |
| --- | --- | --- | --- |
| Rota | Ficha React | /app/ficha-clinica | App.jsx, routes.jsx |
| Paciente | Fonte compartilhada | PatientInUseProvider | PatientInUseContext.jsx, App.jsx |
| Cabeçalho | Foto, nome, código, idade, telefone | X anos, Y meses | FichaClinicaPage.jsx |
| Toolbar | Oito ícones na ordem | assets oficiais e tamanhos acima | FichaClinicaPage.jsx, fichaClinica.css |
| Fundo | Bege local | #f5f0e6 | fichaClinica.css |
| Rail | Botões globais e teal contínuo | pseudo-elemento local + min-height 100% | fichaClinica.css |
| Painel superior | Embutido e tabulado | UpperOdontogramPanel | FichaClinicaPage.jsx |
| Tab | Rodapé compacta | bottom, 30px, 84px, 0 8px, radius inferior | fichaClinica.css |
| Canvas | Fixo | 576px, 16×36px, dentes 32px | fichaClinica.css |
| Frame | Compacto | min-height 212px | fichaClinica.css |
| Duas colunas | Centro ao lado quando possível | coluna esquerda 618px aplicável | fichaClinica.css |
| Alinhamento | Painéis alinhados | padding-top 0 | fichaClinica.css |
| Procedimentos | Fora do painel superior | rail separado | FichaClinicaPage.jsx |
| Especialidades | Fora do painel superior | container separado | FichaClinicaPage.jsx |
| Boca/Dente | Independente | footer inferior do board | FichaClinicaPage.jsx |
| dente_vazio | Auditado, não usado | não substituir grid | FichaClinicaPage.jsx / assets |
| Tratamento | Não integrado | sem API clínica nova | FichaClinicaPage.jsx, testes |

## Checklist de recuperação

1. Conferir a estrutura DOM de FichaClinicaPage.jsx.
2. Conferir o CSS local.
3. Confirmar canvas 576px.
4. Confirmar grid repeat(16, 36px).
5. Confirmar dente 32px.
6. Confirmar frame min-height 212px.
7. Confirmar tab bottom.
8. Confirmar tab 30px, 84px, 0 8px e radius 0 0 12px 12px.
9. Confirmar fundo #f5f0e6.
10. Confirmar grid externo e coluna 618px aplicável.
11. Confirmar padding-top 0 no painel superior.
12. Conferir PatientInUseProvider e abertura única do menu.
13. Conferir assets oficiais da toolbar.

Não usar reset Git nem sobrescrever arquivos cegamente; comparar o delta e restaurar somente a regra comprovadamente regressiva.

## FC3-D1 — identidade operacional por aba

Status: `HOMOLOGATED`.

A FC3-D1 implementa somente a fundação da identidade operacional da aba:

- o backend registra e valida `session_instance_id` associado ao usuário e à clínica;
- cada aba possui identidade própria;
- F5 preserva a identidade da mesma aba;
- nova aba recebe identidade independente;
- duplicação de aba resolve a colisão automaticamente, mantendo a aba original;
- `BroadcastChannel` coordena a colisão entre abas, sem autenticar, autorizar ou conceder lease;
- existe fallback seguro quando `BroadcastChannel` não está disponível;
- logout invalida a instância;
- renew preserva a mesma instância;
- `PatientInUse` permanece independente e inalterado.

Esta fase não implementa o `clinical patient lease`, aquisição/liberação de lease, heartbeat, expiração, guards clínicos, modo OWNER/RESTRICTED ou bloqueio de Tratamento/Odontograma. Esses itens pertencem às fases posteriores e não estão ativos neste checkpoint.

## Documentos relacionados

Foram encontrados documentos históricos ou de auditoria relacionados, incluindo:

- docs/auditoria_bloco_01_cabecalho_paciente.md
- docs/auditoria_bloco_02_odontograma.md
- docs/auditoria_bloco_03_tratamentos_por_data.md
- docs/auditoria_bloco_04_contexto_clinico.md
- docs/auditoria_runtime_fluxo_menu_pacientes_para_novo_tratamento.md
- docs/auditoria_shell_visual_blocos_laterais_odontograma.md
- docs/brana_odontograma_checklist_execucao_por_commit.md
- docs/brana_odontograma_especificacao_implementacao_modular.md
- docs/easydental_tela_principal_odontograma_auditoria_prints_fontes_locais.md
- docs/easydental_tela_principal_odontologica_contrato_funcional.md

Este arquivo é o checkpoint canônico do estado atual e deve ser conferido contra o código antes de qualquer restauração.

## Checkpoint FC2-D2-R5

Esta seção é a atualização canônica do estado após `FICHA_CLINICA_PATIENT_CONTEXT_ACTIONS_FC2_D2_R5`.

- CHECKPOINT_NAME: `FICHA_CLINICA_FC2_D2_R5`
- CHECKPOINT_PURPOSE: Estado estável da Ficha Clínica após cabeçalho contextual do paciente, abertura contextual da Ficha Pessoal e fechamento do paciente em uso.
- CHECKPOINT_STATUS: `READY_AS_REGRESSION_CHECKPOINT`
- CHECKPOINT_DATE: `2026-09-10`
- CURRENT_BRANCH: `modularizacao-segura-fase-1`
- CURRENT_HEAD: `a49813c1c6cf6e976ea80842f242e61a1de6473e`
- WORKTREE_STATUS: sujo, com alterações e arquivos preexistentes fora do escopo deste checkpoint; nenhum arquivo funcional foi alterado nesta rodada documental.

### Regra de ouro

Qualquer contrato marcado como `HOMOLOGADO`, `COMPLETE`, `LOCKED` ou `REGRESSION_BASELINE` exige motivo explícito, evidência de regressão e autorização do usuário antes de ser alterado. Não usar restauração cega nem `git reset --hard`.

### Entrada, shell e geometria congelados

- Rota: `/app/ficha-clinica`.
- Entrada: toolbar → Ficha Clínica.
- Runtime esperado: React/Vite HTTPS 5173; backend 8000.
- Fundo: `#f5f0e6`.
- Toolbar oficial, layout, odontograma, painéis e tabs permanecem congelados.
- TOOLBAR_ORDER_LOCKED: `SIM`.
- ODONTOGRAM_GEOMETRY_LOCKED: `SIM` — canvas 576px, 16 slots × 36px, dentes 32px, frame min-height 212px, coluna esquerda aproximada de 618px e tabs compactas.

### PatientInUse e cabeçalho

`PatientInUseContext` é a autoridade do paciente em uso e não deve ser substituído por último paciente, query param, lista ou exemplo.

O cabeçalho preserva avatar, nome, número, idade, telefone e layout atual. A seta contextual usa `frontend-react/public/assets/fichaClinica/icon_combo.png`, URL `/app/assets/fichaClinica/icon_combo.png`, elemento `ficha-clinica-patient-context-arrow`, parent `.ficha-clinica-patient-context`, tamanho renderizado 16×16. PATIENT_HEADER_ARROW_LOCKED: `SIM`.

### Menu contextual do paciente

O menu usa Ant Design `Dropdown`, placement `bottomLeft`, com os itens:

1. `Abre ficha pessoal`
2. `Fecha ficha clínica`

`Abre ficha pessoal` usa exatamente `PatientInUse`, chama `openExistingPatient(patientInUse.id)`, abre o mesmo `FichaPessoalModal` em modo `existing`, mantém a Ficha Clínica montada e preserva o paciente ao fechar ou salvar. O callback `onSaved` atualiza o objeto compartilhado com o registro salvo.

`Fecha ficha clínica` fecha o menu, chama `clearPatientInUse()` → `clearPatient()`, permanece na rota e renderiza o estado sem paciente. O contrato antigo `handleNavigate('dashboard')` está substituído/obsoleto. NAVIGATION_AFTER_CLOSE_PATIENT: `NONE`.

- PATIENT_IN_USE_CONTRACT_LOCKED: `SIM`
- PATIENT_CONTEXT_MENU_LOCKED: `SIM`
- OPEN_PERSONAL_RECORD_CONTRACT: `HOMOLOGADO`
- CLOSE_CLINICAL_RECORD_PATIENT_CONTRACT: `HOMOLOGADO`
- EMPTY_CLINICAL_RECORD_STATE_LOCKED: `SIM`

### Novo paciente e Novo tratamento

O fluxo `+ → Novo paciente` permanece contextual e reutiliza `FichaPessoalModal`. O fluxo `+ → Novo tratamento` permanece condicionado ao paciente em uso; `activePage` considera `fichaNewTreatmentOpen`. NEW_PATIENT_CONTEXT_FLOW_LOCKED e NEW_TREATMENT_OPENING_FLOW_LOCKED: `SIM`.

Na aba Principal permanecem homologados datas, índice, cirurgião responsável, unidade, metadados e visual. A Tabela principal baseada na Ficha Pessoal do paciente permanece registrada como `PENDING_VERIFICATION` quando não houver prova runtime atual suficiente.

Na aba Convênio permanecem homologados TISS, os três cirurgiões, sinais clínicos, tecidos moles e os dois campos de texto livre. O contrato de Convênio está definido como paciente em uso → Ficha Pessoal → opção canônica, mas o label fechado `Convenio 1` continua pendente de confirmação/correção. Não declarar Convênio homologado.

### Testes e build do checkpoint

- CHECKPOINT_TEST_FILES:
  - `frontend-react/tests/fichaClinicaPatientInUse.test.mjs`
  - `frontend-react/tests/fichaClinicaNewPatientContext.test.mjs`
  - `frontend-react/tests/novoTratamentoModal.test.mjs`
- CHECKPOINT_TEST_CASES_TOTAL: `34`
- CHECKPOINT_TEST_CASES_PASS: `34`
- CHECKPOINT_TEST_CASES_FAIL: `0`
- CHECKPOINT_BUILD: `PASS` (warning não bloqueante de chunks acima de 500 kB)

### Arquivos do checkpoint

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
- `docs/checkpoints/ficha_clinica_fc2_d2_r5_checkpoint.md`

### Hashes SHA-256

Os hashes completos estão no manifesto `docs/checkpoints/ficha_clinica_fc2_d2_r5_checkpoint.md`.

### Regra de rollback

Em caso de regressão futura, comparar primeiro com este checkpoint, identificar o diff da região afetada, preservar alterações posteriores não relacionadas, restaurar seletivamente apenas o contrato regressivo, executar os testes do checkpoint e repetir a validação visual. Não usar `git reset --hard` como procedimento padrão.

### FC3-D2 — Clinical Patient Lease

FC3-D2 = `HOMOLOGATED`.

O backend implementa o lease clínico parcial por `(clinica_id, paciente_id)`:

- `POST /clinical-locks/{patient_id}/acquire` adquire ownership, é idempotente para o mesmo owner e retorna `RESTRICTED` para outra sessão;
- `GET /clinical-locks/{patient_id}` consulta `AVAILABLE`, `OWNER` ou `RESTRICTED`;
- `POST /clinical-locks/{patient_id}/release` libera somente com instância e token atuais;
- aquisição concorrente mantém exatamente um owner;
- lease expirado pode ser assumido por outra sessão;
- token obsoleto não libera lease atual;
- validação de sessão, paciente e clínica é feita no backend;
- isolamento multi-clínica e privacidade foram validados em PostgreSQL descartável;
- T1–T15: `15 PASS`, `0 FAIL`.

A camada frontend ainda não usa visualmente `OWNER`/`RESTRICTED`. Heartbeat, renovação, polling, guards clínicos e promoção automática permanecem reservados para FC3-D3 e fases posteriores.

### FC3-D3 — Heartbeat e expiração

FC3-D3 = `HOMOLOGATED`.

- O owner envia heartbeat pelo endpoint `POST /clinical-locks/{patient_id}/heartbeat`.
- Os headers são `Authorization`, `X-Session-Instance-Id` e `X-Clinical-Lease-Token`.
- O intervalo frontend é de 20 segundos e a duração do lease é de 90 segundos.
- PostgreSQL é a autoridade exclusiva de tempo; decisões usam `CURRENT_TIMESTAMP`.
- Heartbeat renova `last_heartbeat_at`, `expires_at` e `updated_at` atomically.
- O token permanece igual durante o mesmo ownership.
- Lease expirado não pode ser ressuscitado por heartbeat.
- Focus e visibility revalidam ownership.
- Falha de rede leva o estado interno para `UNKNOWN`, em fail-closed.
- Não foram adicionados guards D4 de mutação clínica nem UI D5 de OWNER/RESTRICTED.

## FC3-D4 — estado homologado

FC3-D4 = HOMOLOGATED. O escopo protegido é `TREATMENT_ODONTOGRAM_WRITE_DOMAIN`.

O backend exige ownership clínico comprovado para as quatro mutations atuais:

- `POST /tratamentos/novo`
- `PUT /tratamentos/{tratamento_id}`
- `PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id}`
- `POST /orcamento/tratamentos/{tratamento_id}/aprovar`

O guard central está em `backend/services/clinical_patient_lease_guard.py`. Ele valida tenant do paciente, sessão ativa, usuário owner, sessão owner, token e lease vigente com `expires_at > CURRENT_TIMESTAMP` no PostgreSQL, usando `SELECT ... FOR UPDATE`. Guard, mutation e commit compartilham a mesma Session/transação; o guard não adquire, renova, libera nem commita lease.

O contrato é fail-closed: paciente fora do tenant retorna `PATIENT_NOT_FOUND_IN_CLINIC`; sessão inválida retorna `SESSION_INSTANCE_INVALID`; lease ausente/expirado retorna `CLINICAL_PATIENT_LEASE_LOST`; owner, sessão ou token divergente retorna `CLINICAL_PATIENT_LEASE_NOT_OWNER`.

Parcelas, Ficha Pessoal, Histórico, leituras de tratamento/orçamento e impressão permanecem fora do guard. A validação final registrou 21/21 testes aplicáveis D4, regressão D3 5/5, regressão crítica D2 5/5 e G20 PASS com mutation HTTP real, lock PostgreSQL, espera concorrente e zero partial write.

O único caller React protegido atualmente é o novo tratamento. Ele obtém a session instance do provider D1 e o token em memória do `ClinicalLeaseProvider` D3, enviando os dois headers somente para a mutation protegida. Não há interceptor global, novo storage ou UI D5.

O frontend legado em `frontend/` é somente referência funcional/contratual (`REFERENCE_ONLY`) e não participa de D1–D4. Clients React futuros de edição, intervenção e aprovação deverão cumprir o mesmo contrato de session instance, token memory-only e headers clínicos.

Antes da D3, a comparação de expiração da D2 foi alinhada do relógio Python local para `PostgreSQL CURRENT_TIMESTAMP`. A regressão crítica D2 permaneceu em 10/10 PASS.

# FC3-D5 — consolidação final atual

Esta seção consolida o estado técnico comprovado da FC3-D5. A fase está homologada pela matriz final atual; as definições históricas V9–V12 permanecem não recuperadas.

Escopo: `TREATMENT_ODONTOGRAM_WRITE_DOMAIN`.

Estados do clinical lease:

- `AVAILABLE`: paciente disponível para aquisição.
- `OWNER`: sessão proprietária; mutations protegidas liberadas.
- `RESTRICTED`: outra sessão é proprietária; leitura permanece disponível e mutations protegidas ficam bloqueadas.
- `UNKNOWN`: disponibilidade não pôde ser confirmada; comportamento fail-closed.

Em `RESTRICTED` há banner compacto com o nome do owner quando disponível. Não existe overlay global. Ficha Pessoal, Histórico, leituras, parcela financeira e print permanecem fora do bloqueio clínico.

## Segurança e endpoints protegidos

Mutation protegida exige `OWNER`. O backend é a autoridade final; o frontend apenas representa o estado.

Endpoints protegidos homologados em D4:

1. `POST /tratamentos/novo`
2. `PUT /tratamentos/{tratamento_id}`
3. `PATCH /orcamento/tratamentos/{tratamento_id}/intervencoes/{intervencao_id}`
4. `POST /orcamento/tratamentos/{tratamento_id}/aprovar`

## Lifecycle

Release explícito comprovado:

- fechar Ficha Clínica;
- troca de paciente;
- logout.

Release best-effort comprovado:

- `pagehide`;
- fechamento de aba;
- fechamento de navegador;
- navegação externa;
- F5/reload.

`pagehide` não é garantia. Crash, perda de energia e falha abrupta de rede/processo continuam dependendo do TTL final de 90 segundos.

Quando `event.persisted === true`, o release não é enviado, pois a página pode retornar preservada pelo BFCache.

Heartbeat de `OWNER`: 20 segundos. `RESTRICTED` não envia heartbeat; executa recheck periódico de 20 segundos, além dos gatilhos de foco/visibilidade.

## Aquisição concorrente

Não existe fila nem garantia FIFO. A política é `FIRST_SUCCESSFUL_ACQUIRE`.

Se A é `OWNER` e B/C são `RESTRICTED`, após a liberação B e C podem detectar `AVAILABLE` e competir. A primeira aquisição válida torna-se `OWNER`; a outra permanece `RESTRICTED`. O backend garante exatamente um owner válido.

Takeover emergencial, incluindo “Assumir acesso clínico”, não faz parte do escopo atual da D5 e não foi implementado.

## Status de validação

- V1–V8: `PASS`.
- R1B auto-acquire: `PASS`.
- R1D fechamento da ficha: `PASS`.
- R1E troca de paciente/logout: `PASS`.
- R1F polling e promoção sem F5: `PASS`.
- pagehide/keepalive e cenários de fechamento: `PASS`.
- Cleanup da instrumentação temporária: `COMPLETE`.

As definições históricas V9–V12 não foram recuperadas. Elas não são reconstruídas por inferência e permanecem `UNRECOVERED`.

## Incidente de runtime

Durante o diagnóstico R1F, o Vite estava servindo o worktree correto, mas o serviço interno esbuild havia parado e um módulo retornava HTTP 500. A única instância Vite oficial foi reiniciada de forma controlada; o backend não foi tocado, o esbuild foi recuperado e o polling passou a funcionar. Esse fato é somente um incidente de runtime, não um requisito funcional.

## Matriz final pendente

Os testes abaixo são uma nova matriz atual, não uma reconstrução de V9–V12 históricos:

### D5-FINAL-1 — Acesso normal de OWNER

Pré-condição: paciente sem lease ativo.

Passos: abrir a Ficha Clínica, selecionar paciente livre e aguardar aquisição normal.

Resultado esperado: `OWNER`, nenhum banner, Novo Tratamento liberado, patient visível, sem `UNKNOWN` e sem F5.

Status: `PASS`.

### D5-FINAL-2 — Segunda sessão bloqueada corretamente

Pré-condição: A já é `OWNER` do paciente X.

Passos: B abre o mesmo paciente e observa a Ficha Clínica.

Resultado esperado: B `RESTRICTED`, banner correto, Novo Tratamento bloqueado, patient e leituras visíveis, Ficha Pessoal e Histórico acessíveis, sem mutation protegida.

Status: `PASS`.

### D5-FINAL-3 — Promoção automática após liberação

Pré-condição: A `OWNER`, B `RESTRICTED`.

Passos: A libera X por fechamento, troca, logout ou fechamento da página; B permanece aberta e aguarda o recheck.

Resultado esperado: B consulta, tenta acquire se disponível, torna-se `OWNER` se vencer, remove o banner e libera Novo Tratamento sem F5. O recheck é de 20 segundos, sem garantia rígida em aba suspensa/background.

Subcenário: com B e C `RESTRICTED`, não exigir qual sessão vence; exigir apenas first successful acquire e exatamente um owner.

Status: `PASS`.

### D5-FINAL-4 — Indisponibilidade de confirmação clínica

Resultado esperado: `UNKNOWN`, mensagem “Não foi possível confirmar a disponibilidade para alterações clínicas.”, patient visível, Novo Tratamento e mutations protegidas bloqueados, sem owner otimista e com recuperação por revalidação posterior.

Não foi definida reprodução manual segura sem interromper infraestrutura, rede ou código. O teste pode ser avaliado por contratos e evidências existentes, ou permanecer `NOT_MANUALLY_REPRODUCED`.

Status: `NOT_MANUALLY_REPRODUCED`.

## Estado de homologação

`HISTORICAL_V9_V12_DEFINITIONS_FOUND = NÃO`

`HISTORICAL_V9_V12_STATUS = UNRECOVERED`

`D5_FINAL_1 = PASS`

`D5_FINAL_2 = PASS`

`D5_FINAL_3 = PASS`

`D5_FINAL_4 = NOT_MANUALLY_REPRODUCED`

`FC3_D5_HOMOLOGATION = HOMOLOGATED`

`FC3_D5_OVERALL_STATUS = HOMOLOGATED`

Nenhuma implementação D5 adicional é declarada nesta consolidação.
