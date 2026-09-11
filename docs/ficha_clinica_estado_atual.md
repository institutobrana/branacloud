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
