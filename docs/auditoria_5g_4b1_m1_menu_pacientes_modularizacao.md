# 5G.4B1-M1 — Auditoria de modularização do Menu de pacientes

**Data:** 2026-08-30  
**Escopo:** somente leitura, mapeamento e plano. Nenhum arquivo de código,
CSS, teste, backend ou dado foi alterado nesta etapa.

## A. Escopo

| Item | Resultado |
|---|---|
| Visual alterado | Não |
| Funcional alterado | Não |
| Código alterado | Não |
| Backend/API alterado | Não |
| Documentação criada | Este arquivo |

## B. Localização e inventário atual

| Arquivo | Responsabilidade | Menu pacientes? | Agenda? | Compartilhado? |
|---|---|---:|---:|---:|
| `frontend-react/src/features/agendaSemanal/components/AgendaPatientSearchModal.jsx` | Modal, filtros, lista, seleção e retorno | Sim | Não | Não |
| `frontend-react/src/features/agendaSemanal/components/agendaPatientSearch.css` | Estilo exclusivo do modal | Sim | Não | Não |
| `frontend-react/src/features/agendaSemanal/api/agendaPatientsApi.js` | Leitura de pacientes | Sim | Não | Não |
| `frontend-react/src/features/agendaSemanal/components/AgendaEventModal.jsx` | Editor Agenda e integração consumidora | Não | Sim | Não |
| `frontend-react/tests/agendaEventModal.test.mjs` | Contratos de editor e pesquisa integrada | Parcial | Sim | Misto |
| `docs/auditoria_funcional_5g_4a_agenda_event_modal.md` | Histórico funcional das fases | Referência | Referência | Não |

Não foram encontrados outros consumidores de `AgendaPatientSearchModal`,
`agendaPatientsApi` ou `agendaPatientSearch.css`. As únicas dependências
reversas atuais são `AgendaEventModal.jsx` e o teste de contrato.

## C. Dependências e integração

`AgendaPatientSearchModal.jsx` importa React (`useEffect`, `useMemo`,
`useState`), componentes Ant Design (`Button`, `Input`, `Modal`, `Select`,
`Spin`), `fetchAgendaPatients` e seu CSS local. Não importa
`AgendaScheduler`, `AgendaClinicaView`, FullCalendar ou qualquer draft.

O `AgendaEventModal` controla `patientSearchRequested`. O clique explícito no
botão `Pesquisar paciente`, habilitado somente quando `draft.type === '1'`,
monta o modal. A Agenda fornece implicitamente o draft via closure e recebe o
objeto selecionado por `onSelect`; `onCancel` fecha apenas a pesquisa.

O contrato mínimo futuro deve ser:

```jsx
<MenuPacientesModal
  open={requested}
  onClose={() => setRequested(false)}
  onSelect={(patient) => applyPatient(patient)}
/>
```

O módulo não deve receber `draft`, `mode`, evento, scheduler ou contexto de
Agenda. O retorno atual é um paciente bruto para seleção e o adaptador local
`mapAgendaPatientToDraft` produz:

```text
patientId, name,
phones: [fone1, fone2, fone3],
phoneTypes: [tip_fone1, tip_fone2, tip_fone3]
```

Esse adaptador pertence ao consumidor na extração; o módulo deve retornar o
registro selecionado, sem conhecer a estrutura do draft.

## D. Estado interno

| Estado | Local atual | Classificação futura |
|---|---|---|
| Cirurgião | Select local, opção `<<Todos>>` | Interno |
| Filtro | Select local, opção `<<Todos>>` | Interno |
| Visualização | Select local, `Nome, número` | Interno |
| Pesquisar | Não há modo separado; query filtra localmente | Interno |
| Texto | `query` local | Interno |
| A-Z/* | `letter` local | Interno |
| Selecionado | `selectedId` local | Interno |
| Loading | `loading` local | Interno |
| Erro | `error` local | Interno |
| Abertura | `open`/montagem controlados pelo consumidor | Externo |

A-Z filtra nomes por prefixo; texto filtra nome e número. A tabela usa a
identidade real do paciente, não índice. Clique seleciona; duplo clique na
linha chama `onSelect`; Ok chama `onSelect`; Cancela/X chamam `onCancel`.
`Novo...` é renderizado, mas disabled e sem handler.

## E. API

Arquivo atual: `agendaPatientsApi.js`. Função:
`fetchAgendaPatients({ signal })`. Endpoint:
`GET /agenda-legado/pacientes?limit=5000`, com Bearer token obtido da sessão.
Aceita resposta array ou envelopes `items`, `data` e `patients`; retorna array
normalizado. Runtime autenticado atual: status efetivo 200, 1.631 pacientes
retornados/renderizados. O nome atual `agendaPatientsApi.js` funciona, mas é
semanticamente ligado à Agenda; na feature própria recomenda-se
`menuPacientesApi.js`, preservando a rota backend existente.

## F. CSS e baseline runtime

Todas as regras de `agendaPatientSearch.css` são exclusivas do Menu. Os
prefixos atuais `agenda-patient-search-*` são seguros, mas devem ser
renomeados para `menu-pacientes-*` somente durante M2, com revisão de todas as
referências. Não há regra dependente de Agenda além do nome histórico.

Medições runtime na sessão autenticada, após abrir a pesquisa:

| Elemento | Rect |
|---|---|
| Modal | x=285.5, y=100, width=690, height=690 |
| Primeira linha | x=325.5, y=164, width=610, height=56 |
| Régua A-Z | x=325.5, y=290, width=610, height=26 |
| Tabela/lista | x=325.5, y=324, width=610, height=360 |
| Footer | x=325.5, y=702, width=610, height=32 |

Dados observados: 1.631 linhas, sem paginação, lista com scroll interno,
footer dinâmico “1631 pacientes listados”, título “Menu de pacientes”.

## G. Testes atuais

`frontend-react/tests/agendaEventModal.test.mjs` mistura contratos do editor,
pesquisa e integração. Os testes de Menu devem ser separados em M2 em uma
suíte própria; testes de duplo clique permanecem na Agenda. Não existem
consumidores atuais além da Agenda.

O módulo Cadastro de Pacientes possui `pacientesApi.js`, hooks, tabela e
alfabeto próprios. Há infraestrutura semelhante, mas o Cadastro é CRUD/ficha
principal e não deve ser fundido ao seletor de pacientes. Compartilhamento
futuro de normalizadores só deve ocorrer após contrato comum comprovado.

## H. Arquitetura recomendada

Recomendação única: `features/menuPacientes`.

```text
frontend-react/src/features/menuPacientes/
├── components/
│   └── MenuPacientesModal.jsx
├── api/
│   └── menuPacientesApi.js
├── menuPacientes.css
├── menuPacientes.test.mjs
└── index.js   (somente se a feature passar a usar barrel público)
```

Componente público: `MenuPacientesModal`. API pública: apenas o componente e,
se necessário, um tipo/normalizador explicitamente documentado. Internos não
devem ser importados por consumidores.

O fluxo permitido é unidirecional:

```text
Agenda / outros consumidores → MenuPacientesModal
```

Não deve existir dependência reversa para `agendaSemanal`. Lazy mount é
requisito arquitetural obrigatório: o modal não pode estar montado antes do
clique explícito. O duplo clique da Agenda deve continuar abrindo somente
`AgendaEventModal`.

## I. Movimentação planejada

| Atual | Destino futuro | Ação M2 |
|---|---|---|
| `AgendaPatientSearchModal.jsx` | `features/menuPacientes/components/MenuPacientesModal.jsx` | mover/renomear |
| `agendaPatientSearch.css` | `features/menuPacientes/menuPacientes.css` | mover/renomear sem mudar valores |
| `agendaPatientsApi.js` | `features/menuPacientes/api/menuPacientesApi.js` | mover/renomear |
| testes mistos | `tests/menuPacientes*` + integração Agenda | separar |
| `AgendaEventModal.jsx` | permanece em Agenda | ajustar import e adaptador |

Devem permanecer na Agenda: `AgendaEventModal.jsx`, `AgendaScheduler.jsx`,
`AgendaClinicaView.jsx` e `agendaEventModal.css`. Backend e endpoint não devem
ser movidos ou alterados.

Alteração mínima prevista no editor: novo import, montagem condicional lazy,
callback `onSelect` que aplica o paciente ao draft e `onClose`. Nenhuma mudança
no gesto de duplo clique ou no visual do editor.

## J. Riscos

| Risco | Probabilidade/impacto | Mitigação |
|---|---|---|
| R1 imports quebrados | média/alto | mover em uma etapa, testar build e busca reversa |
| R2 CSS perdido | média/alto | snapshot computed before/after e CSS sem alteração semântica |
| R3 lazy mount perdido | média/crítico | teste DOM ausente antes de `...` |
| R4 regressão de duplo clique | alta/crítico | teste Agenda separado e smoke nas três views |
| R5 testes misturados | alta/médio | separar unidade do Menu e integração |
| R6 dependência circular | baixa/crítico | feature não importar Agenda |
| R7 contratos brutos/draft acoplados | média/alto | retorno paciente bruto; adaptação no consumidor |
| R8 lista/scroll alterados por mover CSS | média/médio | comparar rects e computed styles |

## K. Plano 5G.4B1-M2

1. **M2.1** criar a feature destino sem duplicação permanente.
2. **M2.2** mover componente preservando JSX e comportamento.
3. **M2.3** mover CSS preservando valores e namespace.
4. **M2.4** mover API mantendo endpoint e autenticação.
5. **M2.5** ajustar somente imports, lazy mount e adaptador do editor.
6. **M2.6** separar testes unitários do Menu e integração Agenda.
7. **M2.7** remover arquivos antigos e provar ausência de imports órfãos.
8. **M2.8** executar runtime before/after em Semana, Dia e Clínica, incluindo
   duplo clique, `...`, seleção, Cancela/X e zero writes.

## L. Critérios de aceitação da M2

- Feature própria, Agenda somente consumidora.
- Menu não montado antes de `...`.
- Dia, Semana e Clínica continuam usando o mesmo editor e seletor.
- Duplo clique abre `Edita agendamento`, nunca o Menu diretamente.
- Seleção retorna paciente sem conhecer draft Agenda.
- Cancela/X preservam o draft do consumidor.
- Visual, tabela, régua, filtros, lista, scroll e footer equivalentes ao
  baseline runtime.
- Sem dependência circular, sem remount indevido, sem scroll novo.
- Testes verdes, build verde e zero writes.

## M. Validações desta M1

Baseline funcional observado: duplo clique da Agenda abre o editor; o Menu é
aberto somente pela ação explícita `...`; Cancela fecha somente o Menu. O
runtime atual mostrou 1.631 pacientes. Não foram executadas ações de escrita.

`git diff --check` apresenta apenas avisos preexistentes em outros arquivos do
worktree; nenhum arquivo funcional foi alterado nesta M1. Não houve commit,
push, deploy, reset, clean, checkout, restore ou stash.

## Veredito

Responsabilidade compreendida: **SIM**  
Arquivos a extrair identificados: **SIM**  
Contrato público definido: **SIM**  
Dependências com Agenda identificadas: **SIM**  
Estrutura futura definida: **SIM**  
Riscos definidos: **SIM**  
Plano M2 definido: **SIM**

**5G.4B1-M1 = CONCLUÍDA**  
**PRONTO PARA 5G.4B1-M2 = SIM**, condicionado à preservação do lazy mount e
do contrato de duplo clique durante a movimentação.

## 5G.4B1-M2 — execução da modularização

- A implementação foi extraída para `src/features/menuPacientes/`, sem
  alteração de contrato, estilos ou endpoint.
- Componente público interno: `MenuPacientesModal`; cliente da API:
  `menuPacientes/api/menuPacientesApi.js`; estilos:
  `menuPacientes/menuPacientes.css`.
- `AgendaEventModal` permanece consumidor e mantém o lazy mount: durante a
  abertura do editor o Menu não está montado; somente após o clique explícito
  em `Pesquisar paciente` ele é montado.
- Testes focados da Agenda: 53 PASS / 0 FAIL.
- Build: `npm run build` concluído com exit code 0 (`✓ built in 23.40s`), com
  apenas o aviso conhecido de chunks grandes.
- Runtime HTTPS reutilizado na porta 5173. Semana, Dia e Clínica alternaram
  sem alteração de rotas ou shell; no fluxo da Semana, o editor permaneceu
  aberto ao cancelar o Menu de pacientes.
- Backend, `AgendaScheduler`, `AgendaClinicaView`,
  `agendaEventModal.css` e demais regras visuais do editor não foram alterados.
- Nenhum commit, push ou deploy foi realizado; homologação visual/funcional
  manual permanece necessária.

**5G.4B1-M2 = CONCLUÍDA**

Nota operacional: a suíte foi executada nesta rodada com 53 PASS / 0 FAIL.
`npm run build` iniciou e transformou os módulos, mas excedeu o limite de
execução da sessão antes de emitir a linha final de conclusão; repetir o build
antes da M2.

## Fechamento do build

- Build: `npm run build` concluído com exit code 0; Vite reportou `✓ built in
  25.15s`.
- Warning: somente o aviso existente de chunks maiores que 500 kB após
  minificação.
- Suíte baseline focada da Agenda: 53 testes, 53 PASS, 0 FAIL.
- Vite runtime: listener HTTPS reutilizado na porta 5173 (PID 19604), com
  `200 OK` em `https://localhost:5173/app/` e
  `https://192.168.3.41:5173/app/`.
- Código, CSS, testes, backend e API: não alterados nesta confirmação.

**5G.4B1-M1 = CONCLUÍDA**  
**PRONTO PARA 5G.4B1-M2 = SIM**, condicionado à preservação do lazy mount e
do contrato de duplo clique durante a movimentação.
