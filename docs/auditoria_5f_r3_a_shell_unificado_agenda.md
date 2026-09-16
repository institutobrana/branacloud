# Auditoria 5F.R3-A — shell unificado da Agenda

**Data:** 2026-08-29  
**Escopo:** auditoria estrutural e runtime read-only. Nenhum JSX, CSS,
backend, teste ou contrato funcional foi alterado.

## A. Rotas e árvore real

| View | Rota | Componente | Arquivo |
|---|---|---|---|
| Semana | `/app/atendimento/agenda-semanal` | `AgendaSemanalPage` | `src/features/agendaSemanal/AgendaSemanalPage.jsx` |
| Dia | `/app/atendimento/agenda-diaria` | `AgendaDiariaPage` | `src/features/agendaDiaria/AgendaDiariaPage.jsx` |
| Clínica | sem rota própria; estado interno | `AgendaClinicaView` | `src/features/agendaSemanal/components/AgendaClinicaView.jsx` |

Árvore:

```text
App
└── rotas/seleção de tela (src/app/routes.jsx e src/app/App.jsx)
    ├── AgendaSemanalPage
    │   ├── useAuth
    │   ├── useAgendaFilters
    │   ├── useAgendaSemanalReal
    │   └── AgendaScheduler
    └── AgendaDiariaPage
        ├── useAuth
        ├── useAgendaFilters
        ├── useAgendaSemanalReal
        └── AgendaScheduler
            ├── AgendaTemporalStrip
            ├── FullCalendar (Semana/Dia)
            ├── AgendaClinicaView (Clínica)
            └── AgendaEventModal
```

O menu possui duas entradas: Agenda diária e Agenda semanal. Clínica não é
entrada de menu; é um terceiro botão na `AgendaTemporalStrip`.

## B. Controle de view

O estado controlador vive dentro de `AgendaScheduler`:

```text
const [view, setView] = useState(...)
const [mode, setMode] = useState(...)
```

`AgendaTemporalStrip` emite `brana-agenda-spike-view`; o scheduler recebe o
evento, atualiza `mode`, ajusta `view` e chama `FullCalendar.changeView` para
Dia/Semana. Clínica não usa FullCalendar: o JSX troca condicionalmente para
`AgendaClinicaView`.

| Item | Semana | Dia | Clínica |
|---|---|---|---|
| controlador | `AgendaScheduler` | `AgendaScheduler` | `AgendaScheduler` |
| view | FullCalendar `timeGridWeek` | FullCalendar `timeGridDay` | grade própria |
| state | `mode='semana'`, `view='timeGridWeek'` | `mode='dia'`, `view='timeGridDay'` | `mode='clinica'` |
| callback | `dateClick`, `eventClick` | `dateClick`, `eventClick` | callbacks locais de slot/evento |
| modal | `AgendaEventModal` | `AgendaEventModal` | `AgendaEventModal` |

## C. Dados e estados que precisam sobreviver

| Estado | Local atual | Escopo | Risco futuro |
|---|---|---|---|
| data atual | `visibleDateRef`, `temporalDate`, FullCalendar | scheduler | médio; há mais de uma representação |
| prestador | `useAgendaFilters`/prop `selectedProviderId` | página/filtros | baixo |
| unidade | `useAgendaFilters`/`apiFilters` | página/filtros | baixo |
| especialidade | `useAgendaFilters` | página/filtros | baixo |
| filtros | `useAgendaFilters` | página | médio em troca de rota |
| eventos | `useAgendaSemanalReal` | página | médio em remount/novo fetch |
| loading/error | `useAgendaSemanalReal` e filtros | página | baixo |
| selected event | `selectedEventId` | scheduler | alto se scheduler for recriado |
| editor/modal | `editor` | scheduler | alto; remount fecha o modal |
| draft | estado interno do `AgendaEventModal` | modal | alto; qualquer unmount descarta |
| scroll | DOM FullCalendar/grade | view | médio; troca de view pode resetar |

`AgendaScheduler` é reutilizado pelas duas páginas. Cada rota, porém, monta
sua própria página e seus próprios hooks, portanto a troca por rota pode
refazer filtros e carregamento.

## D. FullCalendar e Clínica

FullCalendar usa `timeGridWeek` e `timeGridDay`, `datesSet`, `dateClick`,
`eventClick`, `slotDuration`, `slotMinTime`, `slotMaxTime`, `slotMinHeight` e
`expandRows={false}`. A troca Dia/Semana chama `changeView`; a atualização de
intervalo chama `onVisibleRangeChange`, que é ligado a `agenda.loadRange`.

`AgendaClinicaView` recebe `date`, `providers`, `events`, `statusCatalog` e
`onVisibleRangeChange`. Calcula slots a partir de `provider.agenda_config`,
agrupa eventos por `providerId`, posiciona eventos por `top/height` e chama o
callback de slot/evento fornecido pelo scheduler. Os callbacks preservam
data, hora e prestador; o modal continua fora da view, no scheduler.

Clínica tem CSS próprio em `agendaScheduler.css`, com grade, colunas, slots e
overflow vertical da página/área. Não há `height:100%` próprio da grade; a
altura cresce conforme os slots (`22px` por slot). Isso precisa ser tratado
antes de envolver a grade em uma altura limitada.

## E. Runtime atual

Viewport autenticado observado: 1246×895 aproximadamente.

| View | Retângulo observado |
|---|---|
| Semana | `x=72, y=151, width=1174, height=738` |
| Dia | `x=72, y=151, width=946, height=738` |
| Clínica | `x=72, y=127, width=1174, height=3462` |

A barra atual de seleção está acima do conteúdo, no mesmo shell, com os três
controles Dia/Semana/Clínica. Medidas observadas dos tabs: Dia `94.77×34`,
Semana `124.09×34`, Clínica `110.66×34`.

A área de conteúdo começa aproximadamente em `x=72`; o restante depende da
sidebar e dos filtros superiores renderizados pelo `App`. Não foi aplicada
nenhuma alteração de viewport ou CSS.

## F. Referência “Configura horários de agendamento”

Arquivos reais:

- `src/features/agendaConfiguracao/AgendaConfiguracaoModal.jsx`;
- `src/features/agendaConfiguracao/agendaConfiguracao.css`;
- `src/components/BranaModal.jsx` (shell compartilhado).

Runtime do modal autenticado:

| Camada | Medida/estilo |
|---|---|
| `.ant-modal-content` | `740×419`, background `rgb(245,240,230)`, radius `14px`, shadow `rgba(56,53,41,.18) 0 20px 48px`, padding `20px 24px` |
| `.ant-modal-header` | background bege, height `24px`, radius superior `18px 18px 0 0` |
| `.ant-modal-body` | background bege, padding `8px 10px 10px` |
| tabs | Ant Design, quatro tabs observadas, height `34px`, fonte `14px/22px Inter` |

O modal de referência também possui overlay, posicionamento, X e ações de
modal. Esses elementos não devem ser copiados para a página. Para o futuro
shell são referências apenas: superfície bege, borda/radius, tabs, padding e
densidade. O futuro shell não terá overlay, X, Ok, Cancela nem footer modal.

## G. Remount e resize

- Semana → Dia e Dia → Semana: o branch FullCalendar permanece montado e a
  API troca a view; `mode` e classes mudam, podendo alterar o DOM interno e o
  scroll.
- Semana/Dia → Clínica: FullCalendar é desmontado e `AgendaClinicaView` é
  montado.
- Clínica → Semana/Dia: a grade própria é desmontada e FullCalendar é
  montado novamente.

Em remount podem ser perdidos scroll, seleção visual e editor/modal se o
estado não for elevado. Eventos e filtros pertencem aos hooks da página, mas
mudança entre rotas pode recriá-los.

FullCalendar está com `height="100%"`, `expandRows=false`; não há
`contentHeight` nem `handleWindowResize` configurados localmente. O futuro
shell deverá medir o container e poderá precisar de `updateSize()` após
mudança de dimensões. A Clínica cresce por conteúdo e usa overflow dos
containers existentes; deve ser verificada contra scroll duplo.

## H. Ponto seguro para o shell

**Arquivo recomendado:**
`frontend-react/src/features/agendaSemanal/components/AgendaTemporalStrip.jsx`

**Componente recomendado:** um novo wrapper de apresentação imediatamente
acima de `AgendaScheduler` dentro das páginas, preferencialmente elevado a um
componente de shell da feature. O wrapper deve controlar somente a navegação e
renderizar o `AgendaScheduler` existente; `AgendaTemporalStrip` atual pode ser
reaproveitado ou adaptado em fase de implementação, mas não deve receber
responsabilidade de dados.

Motivo: `AgendaScheduler` já é o controlador comum e mantém o modal, filtros e
interações. O shell deve ficar acima dele, abaixo da banda global, sem duplicar
as agendas. `AgendaEventModal.jsx` e `agendaEventModal.css` ficam protegidos.

## I. Estratégia recomendada

**Opção A: tabs visuais sincronizadas com as rotas existentes.**

Manter `/app/atendimento/agenda-semanal` e
`/app/atendimento/agenda-diaria` para deep links, refresh e Back/Forward.
Clínica deve ser estado interno inicialmente, pois não possui rota atual;
uma futura URL de Clínica só deve ser criada com contrato explícito.

As tabs devem delegar para `handleNavigate`/evento existente, sem duplicar
`AgendaScheduler`. Essa estratégia preserva links atuais e reduz o risco de
perder filtros e autenticação. O custo é que uma troca Semana↔Dia pode trocar
de página e refazer hooks; isso deve ser tratado com preservação de filtros e
data, não por uma terceira agenda.

## J. Impacto estimado e scroll

Não foi criado container nesta auditoria. Qualquer borda, tab e padding
retirará espaço da altura útil atual; o valor exato depende do contrato visual
do novo shell e deve ser medido antes do patch. Critérios mínimos: nenhum
FullCalendar com altura zero, nenhuma quebra da grade e nenhum scroll duplo.

Scroll observado/esperado: Semana e Dia possuem scroll interno do calendário;
Clínica possui grade alta com scroll da área/página. A Clínica é o maior risco:
um shell com `overflow:auto` ao redor dela pode criar dois scrolls.

## K. Arquivos para futura 5F.R3-B

**Obrigatórios prováveis:**

- `src/features/agendaSemanal/components/AgendaTemporalStrip.jsx` ou novo
  `AgendaViewShell.jsx`: tabs e casca visual;
- `src/features/agendaSemanal/components/AgendaScheduler.jsx`: somente
  integração de props/medição se necessário;
- `src/app/App.jsx` ou rotas: somente se a navegação das tabs precisar manter
  deep links.

**Possível:** CSS local da feature para o shell, sem tocar no CSS temporal
existente além de regras comprovadamente do wrapper.

**Protegidos:** `AgendaEventModal.jsx`, `agendaEventModal.css`, backend, API,
normalizador, regras de escala, renderização de cards e interação de duplo
clique.

## L. Riscos

| ID | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| R1 remount perde modal/scroll/seleção | média | alto | elevar apenas estado necessário e testar todas as transições |
| R2 FullCalendar calcula tamanho incorreto | média | alto | medir container e chamar `updateSize` somente após prova |
| R3 Clínica gera scroll duplo/altura excessiva | alta | médio | manter grade reutilizada, testar overflow e não impor altura cega |
| R4 troca de rota perde filtros/data | média | alto | sincronizar URL e preservar filtros/data antes da navegação |
| R5 quebra do double-click/modal | baixa | alto | smoke new/edit nas três views e zero alteração no modal |

## M. Plano futuro 5F.R3-B

1. **B1 — baseline:** capturar retângulos e scroll das três views.
2. **B2 — shell:** criar wrapper local abaixo da banda global, sem agenda nova.
3. **B3 — tabs:** conectar Dia/Semana às rotas atuais e Clínica ao estado
   interno existente.
4. **B4 — encaixe:** renderizar `AgendaScheduler` sem alterar seus contratos.
5. **B5 — Clínica:** encaixar `AgendaClinicaView` e validar altura/overflow.
6. **B6 — resize:** validar FullCalendar, data, filtros, scroll e remount.
7. **B7 — regressão:** testar new/edit, modal congelado, cards, régua,
   escala, zero writes e deep links.

## N. Critérios de aceitação futuros

- Dia, Semana e Clínica abrem pelo shell.
- Data, filtros, prestador, unidade e eventos são preservados.
- Slot livre mantém clique simples sem modal e duplo clique em `new`.
- Evento existente mantém duplo clique em `edit`.
- `AgendaEventModal` e seu CSS permanecem visualmente congelados.
- Nenhuma agenda nova é criada.
- Sem scroll duplo, altura zero, overflow indevido ou perda de escala.
- Sem POST/PUT/PATCH/DELETE ou repetição indevida.
- Deep links de Semana/Dia, refresh e Back/Forward continuam funcionando.

## O. Validações da auditoria

- Alteração visual: **NÃO**.
- Alteração funcional: **NÃO**.
- Código/CSS/backend/testes persistentes alterados: **NÃO**.
- Suíte baseline: **51 PASS / 0 FAIL**.
- Build baseline: **PASS**, com warning não bloqueante de chunks grandes.
- Git destrutivo, commit, push e deploy: **não executados**.

## Veredito

- Arquitetura atual compreendida: **SIM**.
- Ponto seguro para shell localizado: **SIM**.
- Estratégia de tabs definida: **SIM — rotas existentes + estado interno da Clínica**.
- Risco de remount compreendido: **SIM**.
- Resize compreendido: **SIM, com validação obrigatória na implementação**.
- Clínica contemplada: **SIM**.
- Freeze do modal preservado: **SIM**.

**5F.R3-A = CONCLUÍDA.**  
**PRONTO PARA 5F.R3-B = SIM, condicionado aos critérios de aceitação e à
validação runtime descritos neste documento.**

## 5F.R3-B — implementação

**Data:** 2026-08-29. A implementação adicionou somente a casca visual local
ao `AgendaScheduler`; o seletor já existente `AgendaTemporalStrip` foi
reutilizado, sem segunda barra de tabs e sem criar novas agendas.

### Arquivos alterados

- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`:
  classe visual `agenda-unified-shell` na raiz já existente;
- `frontend-react/src/features/agendaSemanal/components/agendaScheduler.css`:
  superfície, borda, radius, padding e largura do shell;
- `frontend-react/tests/agendaInteraction.test.mjs`: proteção contratual da
  casca única e das três views;
- este documento.

Não foram alterados `AgendaEventModal.jsx`, `agendaEventModal.css`, backend,
API, escala temporal ou renderização de cards.

### Contrato final do shell

```text
AgendaScheduler
└── agenda-unified-shell
    ├── AgendaTemporalStrip: Dia | Semana | Clínica
    └── conteúdo existente
        ├── FullCalendar (Dia/Semana)
        └── AgendaClinicaView (Clínica)
```

O shell usa `width:100%`, `box-sizing:border-box`, padding `8px`, borda
`1px solid #d7d0c4`, radius `14px`, background `#f5f0e6` e `overflow:hidden`.
Não foram copiados overlay, X, footer ou posicionamento de modal.

### Runtime before/after

| View | Before | After | Diferença observada |
|---|---|---|---|
| Semana | `1174×738`, x=`72`, y=`151` | shell `1174×802`, x=`72`, y=`87`; conteúdo `1156×744`, x=`81`, y=`136` | shell visual/padding; agenda preservada dentro |
| Dia | `946×738`, x=`72`, y=`151` | mesma raiz compartilhada; conteúdo passa a respeitar padding do shell | sem mudança funcional |
| Clínica | `1174×3462`, x=`72`, y=`127` | shell `1174×3520`, grid `1156×3462`, x=`81`, y=`136` | grade reutilizada; altura de conteúdo preservada |

Tabs observadas: altura `34px`, ordem Dia/Semana/Clínica, estado ativo
correspondente ao `mode`. Semana e Dia continuam FullCalendar; Clínica continua
`AgendaClinicaView`.

### Estado, remount e resize

O estado de view continua exclusivamente em `AgendaScheduler` (`mode`/`view`).
Data, filtros, eventos, selected event e editor continuam no mesmo controlador.
Não foi criado `activeTab`. A troca Semana↔Dia usa o mecanismo existente;
Semana/Dia↔Clínica mantém o remount estrutural já existente por branch
condicional, sem nova perda de estado introduzida pelo shell.

FullCalendar recalculou o conteúdo dentro da área útil observada; não foi
necessário chamar `updateSize()`. Não houve clipping de header/colunas na
view semanal observada. A Clínica manteve sua grade alta e continua sendo o
caso que exige atenção ao scroll; o shell não adicionou um segundo wrapper de
scroll.

### Runtime funcional

- Semana: tabs e conteúdo renderizados; smoke new/edit preservado.
- Dia: tab e conteúdo renderizados; deep link preservado; smoke new preservado.
- Clínica: tab ativa em `mode=clinica`, `AgendaClinicaView` reutilizada e
  grade renderizada; smoke de duplo clique new/edit preservado.
- `AgendaEventModal`: mesmo componente nos três contextos, sem diff visual ou
  funcional.
- POST/PUT/PATCH/DELETE/POST repetir: `0`.

### Testes e build

- suíte focada: **52 PASS / 0 FAIL**;
- build: **PASS**;
- warning: chunks maiores que 500 kB, sem falha de build.

### Responsividade e pendências

A composição usa largura integral e `min-width:0`, evitando largura fixa de
modal. A validação principal foi feita no viewport autenticado atual. Uma
validação visual dedicada em viewport desktop menor e uma checagem de
Back/Forward com mudança de rota permanecem recomendadas antes da
homologação final do usuário.

**HOMOLOGAÇÃO VISUAL DO USUÁRIO = PENDENTE.**
