# Freeze 5G.3B — AgendaEventModal visual e funcional

**Data do freeze:** 2026-08-29  
**Branch:** `modularizacao-segura-fase-1`  
**HEAD:** `49b00c62b3d04260283fe3ffcb7f0cf5f1ba1e11`

## Escopo e estado do worktree

Este documento registra o baseline observado no runtime React. O worktree já
continha alterações e arquivos não relacionados antes desta etapa; nenhum
arquivo funcional ou visual foi alterado para produzir o freeze. A única
alteração desta etapa é este documento.

Arquivos diretamente envolvidos no baseline:

- `frontend-react/src/features/agendaSemanal/components/AgendaEventModal.jsx`
- `frontend-react/src/features/agendaSemanal/components/agendaEventModal.css`
- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`
- `frontend-react/tests/agendaEventModal.test.mjs`

O componente compartilhado para os dois fluxos é `AgendaEventModal`. O
`AgendaScheduler` o renderiza e fornece `editor`, `initialDuration` e
`statusCatalog`. A inicialização permanece separada em `createNewDraft(...)` e
`createEditDraft(...)`.

## Baseline visual observado

### Modal e cabeçalho

- superfície/retângulo observado: `x=326.5`, `y=174.25`, `width=608`,
  `height≈507.5`, `right=934.5`, `bottom≈681.75`;
- background: `rgb(245, 240, 230)` (`#f5f0e6`);
- border radius computado: `14px`;
- overflow: `visible`;
- título: `Edita agendamento` no fluxo novo e `Editar agendamento` no fluxo de
  edição;
- footer sem persistência, com `Novo | Elimina | Ok | Cancela`.

### Abas

O componente é Ant Design `Tabs` com `type="card"`, contendo exatamente
`Dados do agendamento` e `Repete agendamento`. A troca de aba é local e não
altera dados persistidos.

### Arquitetura espacial congelada

```text
HEADER
TABS
LINHA 1: Data | Horário | Duração | min | Sala | períodos gráficos
LINHA 2: Tipo | Nome | ...
LINHA 3: Situação | Assunto
CENTRAL: Telefones | Observações
INFERIOR: Inclusão | Alteração
FOOTER: Novo | Elimina | Ok | Cancela
```

Medidas representativas observadas:

| Região | x | y | largura | altura |
|---|---:|---:|---:|---:|
| Data | 360.5 | 279.75 | 110 | 38 |
| Horário | 475.5 | 279.75 | 70 | 38 |
| Duração | 550.5 | 279.75 | 90 | 38 |
| min | 645.5 | 292.75 | 35 | 25 |
| Sala | 685.5 | 279.75 | 90 | 38 |
| período 1 | 780.5 | 292.75 | 25 | 25 |
| período 2 | 810.5 | 292.75 | 25 | 25 |
| período 3 | 840.5 | 292.75 | 25 | 25 |
| Telefones | 360.5 | 428.75 | 280 | 130 |
| Observações | 646.5 | 441.75 | 219 | 117 |
| Inclusão | 360.5 | 569.75 | 250 | 38 |
| Alteração | 615.5 | 569.75 | 250 | 38 |
| Footer | 350.5 | 618.75 | 560 | 43 |

Tipo/Situação e Nome/Assunto estão alinhados verticalmente no estado atual.
Duração e Sala permanecem como `InputNumber`, com valor e handlers visíveis;
os períodos permanecem gráficos, na ordem atual e sem interseção observada.

### Campos e dropdowns

- combos fechadas de Tipo e Situação permanecem compactadas, sem alteração de
  value/options/onChange;
- o dropdown de Situação foi observado com 16 opções, itens de `26px`, popup
  de aproximadamente `424px`, sem scrollbar e sem espaço vazio inferior
  excessivo;
- o comportamento congelado é natural até o limite máximo, com overflow
  vertical automático quando a lista exceder esse limite;
- Observações é textarea multilinha e ocupa a região vertical central;
- Telefones conserva três linhas `tipo | telefone | WhatsApp`.

## Contrato funcional congelado

### `mode=new`

Foi validado no runtime React: slot livre com clique simples não abriu o modal;
duplo clique abriu o mesmo `AgendaEventModal` em `mode="novo"`, com data do
slot `2026-08-29`, duração default `5`, horário do slot `07:00`, sala default
`1`, tipo `Paciente` e repetição desligada/controles no estado default. O
cancelamento fechou o modal; nenhum evento foi criado.

### `mode=edit`

Foi validado no runtime semanal: evento existente abriu o mesmo componente em
modo de edição, preservando a identidade real do evento e os dados fornecidos
pela normalização/`extendedProps`. A fonte continua sendo `event.id`, com
`createEditDraft(event)` e duração calculada a partir do evento quando
disponível; não há segundo modal.

### Isolamento, repetição e writes

- `createNewDraft(...)` e `createEditDraft(...)` continuam independentes;
- cancelamento descarta apenas o draft local;
- aba Repete: OFF mantém controles desabilitados; ON habilita as opções
  existentes; Domingo não é adicionado;
- POST, PUT, PATCH, DELETE e POST de repetição: `0` nesta validação;
- Novo, Elimina e Ok não persistem nesta fase; Cancela fecha e descarta.

## Smoke das agendas

- **Semanal:** modal novo, modal de edição, abas, dropdowns, repetição e
  cancelamento observados; cards, grade, régua e escala permaneceram
  operacionais.
- **Diária:** página carregada e slot livre testado; duplo clique abriu o mesmo
  modal em `mode="novo"` com data `2026-08-29`; cancelamento fechou sem write.
  Não foi encontrado no viewport observado um evento diário disponível para
  uma segunda validação de edição populada. Portanto esse subcaso diário fica
  registrado como pendência de homologação, não como PASS.
- **Clínica:** após a correção 5G.3A-C1, a view própria passou a encaminhar
  slots e eventos ao mesmo controlador de interação. Clique simples em slot
  não abriu modal; duplo clique em slot abriu `mode="novo"` com data
  `2026-08-24`; duplo clique em evento abriu `mode="edição"`. O cancelamento
  fechou ambos os fluxos sem write.

## Complemento 5G.3A-C1

Diagnóstico: `AgendaClinicaView` era uma grade própria, não FullCalendar, e
renderizava `.agenda-clinica-slot`/`.agenda-clinica-event` sem handlers. A
correção mínima adicionou callbacks de slot/evento no `AgendaScheduler`,
reutilizando `isAgendaDoubleClick`, `openNewEditor`, `openEditEditor` e o
`AgendaEventModal`. Nenhum CSS do modal foi alterado.

Resultado runtime: **Clínica new PASS** e **Clínica edit PASS**. O contexto do
slot conservou data, hora e prestador; no evento a identidade continuou sendo
`event.id`.

## Validações automatizadas e build

- suíte focada executada: `node --test tests/agenda*.test.*`;
- resultado: **51 PASS / 0 FAIL** (inclui a proteção específica da Clínica);
- build: `npm run build` concluído com sucesso (`built in 22.18s`);
- warning não bloqueante: chunks maiores que 500 kB reportados pelo bundler.

## Referências visuais

Foram observados no runtime os estados: novo, edição, aba Repete, dropdown
Tipo e dropdown Situação. As capturas foram usadas como inspeção durante a
execução e não foram adicionadas ao repositório para manter este freeze como
alteração documental única.

## Regra de regressão

A partir deste freeze, qualquer alteração futura no `AgendaEventModal` deve
ser comparada contra este baseline. Alterações não intencionais de geometria,
aparência, comportamento `new/edit`, drafts, cancelamento, dropdowns,
repetição ou integração com a Agenda devem ser tratadas como regressão. Em
caso de regressão, a correção deve restaurar este contrato, e não reconstruir
o modal por memória ou suposição.

POST/PUT/PATCH/DELETE, repetição persistente e demais fluxos de gravação são
frentes futuras e não fazem parte deste freeze.

## Classificação

Este documento é um baseline técnico/visual. Não é commit, release, deploy ou
publicação em produção. O componente e o CSS permanecem inalterados nesta
etapa.

**5G.3B VISUAL/FUNCIONAL FREEZE: INCOMPLETO**, pois a validação de edição
populada na agenda diária não estava disponível no runtime observado.

**Homologação visual do usuário: PENDENTE.**
