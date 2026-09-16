# Arquitetura da Agenda semanal no React — Fase 2

**Produto:** Brana Cloude  
**Fase:** 2 — planejamento arquitetural  
**Baseline:** [`docs/auditoria_forense_agenda_semanal_fase1.md`](auditoria_forense_agenda_semanal_fase1.md)  
**Data:** 2026-08-24  
**Escopo:** planejamento; nenhum código funcional foi alterado.

## A. Contexto

A Fase 1 concluiu que a Agenda semanal existente é um módulo legado funcional, sustentado por contratos já utilizados pelo Brana Cloude. Esta fase transforma as evidências em um plano de implementação incremental. Ela não migra a tela, não cria rota, não instala scheduler e não altera API, banco ou legado.

### Estado inicial

| Item | Valor |
|---|---|
| Diretório | `D:\BRANA ARQUIVOS\BRANA CLOUD` |
| Branch | `modularizacao-segura-fase-1` |
| HEAD | `ecadb4f00e3564b7412cb1eda25231172673ceac` |
| Remote | `origin https://github.com/institutobrana/branacloud.git` |
| Alterações preexistentes | Sim; preservadas e não relacionadas a esta documentação |

O arquivo de auditoria continua sendo a fonte do que existe. Quando este plano usa “contrato congelado”, significa que a futura implementação deve reproduzir a evidência da Fase 1; não significa que os contratos legados estejam livres de dívida técnica.

## B. Contratos congelados

| Contrato comprovado | Decisão arquitetural |
|---|---|
| Visão semanal de segunda a sábado | O domínio calcula a janela real; não assumir domingo nem usar a semana padrão da biblioteca sem configuração. |
| Slot atual de 5 minutos | Valor inicial vem da configuração; 5 minutos não será hardcoded. |
| Duração variável | `start` e `end` são preservados; duração não é derivada somente do slot. |
| Configuração por prestador | Configuração é carregada e normalizada antes de montar a grade. |
| Dia/Semana | Navegação é estado da feature, exposto à toolbar global. |
| Especialidade, Cirurgião/Prestador e Unidade | Filtros pertencem ao domínio da feature, não ao scheduler. |
| Cores configuráveis | Estilo final é resolvido por configuração, tipo e override de status. |
| Status pode sobrescrever a cor do tipo | A precedência é centralizada em `agendaColors`; não criar mapa fixo status → cor. |
| Drag | Move dia/horário, preserva duração, valida destino/conflito e persiste com `PUT /agenda-legado/{id}`. |
| Resize | Não faz parte do contrato comprovado; será desabilitado. |
| Encaixe | Não possui contrato formal comprovado; não será criado na migração. |
| Bloqueios | São funcionalidade existente; devem ser modelados separadamente de eventos de paciente. |
| Identidades | Paciente, prestador e unidade são vínculos lógicos na estrutura legada. |
| Paciente órfão | Evento não desaparece por falha de resolução; usar snapshot legado disponível. |

## C. Shell, rota e integração

### Contrato existente

O shell real está distribuído em:

- `frontend-react/src/app/App.jsx`: resolve tela ativa, menu, toolbar e sincronização de caminho;
- `frontend-react/src/app/routes.jsx`: catálogo atual de rotas React;
- `frontend-react/src/layout/BranaShell.jsx`: `Layout.Sider` de 272px, cabeçalho e conteúdo;
- `frontend-react/src/layout/BranaIconRail.jsx` e `BranaSidebar.jsx`: navegação lateral;
- `frontend-react/src/layout/BranaTopbar.jsx` e `BranaActionTopbar.jsx`: banda superior;
- `frontend-react/src/layout/BranaWorkspace.jsx`: corpo da aplicação;
- `docs/padrao_barra_horizontal.md`: contrato visual da emenda em L.

Fluxo futuro:

```text
App.jsx
  → resolução Atendimento / Agenda semanal
  → BranaShell
      → rail/sidebar
      → banda horizontal global
          → AgendaSemanalToolbar
      → BranaWorkspace
          → AgendaSemanalPage
```

A página não renderizará uma segunda toolbar, topbar, sidebar ou CSS para reconstruir o L. A toolbar será apenas composição visual e callbacks; fetch, validação e persistência ficarão nos hooks/API da feature. `Tabelas → Serviços de Protético` permanece referência de integração, não fonte de regras da Agenda.

### Trabalho futuro de shell

O menu de Atendimento já contém `Agenda semanal`, atualmente desabilitado. Em fase posterior será necessário:

1. habilitar o item somente quando a feature estiver homologada;
2. adicionar a resolução de tela no `App.jsx`;
3. registrar o caminho no `routes.jsx`;
4. ligar active item, submenu e URL;
5. preservar permissões do módulo `agenda` e o isolamento de clínica no backend.

Nenhuma dessas alterações pertence à Fase 2.

### Rota proposta

`/app/atendimento/agenda-semanal` é a proposta de caminho canônico. Ela é uma decisão de planejamento, não uma rota criada nesta fase. Query parameters de modo/período deverão ser definidos pelo contrato de navegação existente antes da implementação e não devem duplicar estado conflitante no componente.

## D. Estrutura modular proposta

```text
frontend-react/src/features/agendaSemanal/
  api/
    agendaApi.js
    agendaConfigApi.js
    agendaPatientsApi.js
    agendaCatalogsApi.js
  adapters/
    agendaSchedulerAdapter.js
  components/
    AgendaToolbar.jsx
    AgendaFilters.jsx
    AgendaScheduler.jsx
    AgendaEvent.jsx
    AgendaEventContent.jsx
    AgendaTimeHeader.jsx
    AgendaDayHeader.jsx
    AgendaLoadingState.jsx
    AgendaEmptyState.jsx
  hooks/
    useAgendaSemanal.js
    useAgendaFilters.js
    useAgendaNavigation.js
    useAgendaConfig.js
    useAgendaActions.js
  modals/
    AgendaAppointmentModal.jsx
    AgendaPatientSearchModal.jsx
    AgendaScheduleModal.jsx
    AgendaBlockModal.jsx
    AgendaSettingsModal.jsx
  utils/
    agendaDates.js
    agendaColors.js
    agendaEvents.js
    agendaValidation.js
  AgendaSemanalPage.jsx
```

Essa árvore é uma fronteira proposta. Nomes e divisão final devem ser ajustados somente após o spike e o primeiro contrato de leitura, sem criar um componente monolítico.

## E. Modelo de domínio interno

O scheduler não consumirá o DTO bruto. A feature usará um modelo interno equivalente a:

```text
BranaAgendaEvent {
  id: string
  clinicId: string | number        // contexto recebido do backend; não vem de filtro confiável do cliente
  start: Date
  end: Date
  durationMinutes: number
  patient: {
    logicalId: string | number | null
    nameSnapshot: string | null
    phoneSnapshot: string | null
    mobileSnapshot: string | null
    existsInCatalog: boolean | null
  }
  providerId: string | number | null
  unitId: string | number | null
  specialtyId: string | number | null
  roomId: string | number | null
  chairId: string | number | null
  type: string | number | null
  status: string | number | null
  confirmation: string | number | null
  observation: string | null
  source: string | null
  rawLegacyFields: object
  display: BranaAgendaDisplay
}
```

`rawLegacyFields` é uma fronteira temporária para campos ainda necessários ao contrato legado; não deve vazar para o componente visual. IDs lógicos podem ser nulos ou órfãos. A ausência de uma FK física não autoriza o React a inventar uma relação.

```text
AgendaConfig {
  slotMinutes
  startTime
  endTime
  workingDays
  lunchIntervals
  blockedIntervals
  providerId
  unitId
  specialtyId
  defaultDuration
  visibleFields
  fontConfig
  typeColors
  statusColorOverrides
}
```

```text
AgendaFilterState {
  specialtyId | ALL
  providerId | ALL
  unitId | ALL
  view: DAY | WEEK
  anchorDate
}
```

Bloqueio terá modelo próprio (`BranaAgendaBlock`), mesmo que o scheduler o receba como evento visual não editável. Assim, não se confunde bloqueio com um agendamento de paciente.

## F. DTOs e normalização

```text
DTO da API
  → parse seguro de datas, números e nulos
  → normalização de IDs lógicos e snapshots
  → BranaAgendaEvent / BranaAgendaConfig / BranaAgendaBlock
  → adapter do scheduler
  → renderização
```

Transformações obrigatórias:

- converter datas legadas para uma representação única, preservando timezone da clínica;
- calcular `durationMinutes` de `end - start`, sem substituir duração por `slotMinutes`;
- manter `nro_pac`, `id_prestador` e `id_unidade` como identificadores lógicos;
- priorizar nome/telefone snapshot do evento quando o paciente não for encontrado;
- diferenciar `null`, string vazia e zero quando o contrato fizer essa distinção;
- separar estado/status de estilo visual;
- preservar campos desconhecidos durante a leitura até comprovar que não são usados pelo legado;
- nunca enviar `clinicId` escolhido pelo usuário para contornar o tenant.

Para os nove eventos com referência de paciente sem correspondência, a normalização produz um evento renderizável. Não haverá fetch obrigatório de paciente para montar a semana, ocultação ou correção automática do vínculo.

## G. Adapter do Scheduler

```text
API Brana
  → agendaApi
  → normalizador de domínio
  → BranaAgendaEvent
  → agendaSchedulerAdapter.toSchedulerEvent()
  → Scheduler escolhido

Interação do Scheduler
  → agendaSchedulerAdapter.fromDrop()
  → ação de domínio moveEvent()
  → validação conhecida
  → PUT /agenda-legado/{id}
  → atualização/reload da janela
```

O adapter será o único lugar que conhecerá propriedades específicas do scheduler: `eventContent`, `eventAllow`, `eventDrop`, `slotDuration`, recursos e callbacks equivalentes. API, hooks, modelos, modais e regras não importarão tipos da biblioteca.

## H. Estado e responsabilidades

Não há evidência que justifique Redux, Zustand ou outro estado global para a primeira implementação. O plano é estado local da feature, com composição da toolbar pelo shell:

| Estado | Responsável |
|---|---|
| Período, modo Dia/Semana e data âncora | `useAgendaNavigation` |
| Especialidade, prestador e unidade | `useAgendaFilters` |
| Configuração da grade e campos visíveis | `useAgendaConfig` |
| Eventos, bloqueios, loading e erro | `useAgendaSemanal` |
| Seleção e evento em drag | `useAgendaActions` |
| Modal atual e payload de edição | controlador de modais da feature |
| Rótulos/botões da banda | `AgendaToolbar`, com callbacks recebidos da feature |

O `App.jsx` continuará dono da montagem da banda, não do domínio. Se a implementação precisar compartilhar estado entre página e toolbar, usar o padrão de callbacks/contexto da feature; não criar eventos globais ou store por conveniência.

## I. API e operações reutilizáveis

Os caminhos abaixo são o inventário da Fase 1 e devem ser confirmados pelo contrato efetivamente escolhido na implementação. Esta fase não cria nem altera endpoints.

| Operação React | Endpoint legado mapeado | Reutilizável? | Adapter | Lacuna |
|---|---|---:|---|---|
| Carregar janela semanal | `GET /agenda-legado` com período/filtros | Sim, se payload suportar a janela | DTO → domínio | Confirmar limites e paginação |
| Carregar dia | `GET /agenda-legado` com janela de um dia | Sim | Mesmo adapter | Nenhuma conhecida |
| Atualizar evento por drag | `PUT /agenda-legado/{id}` | Sim | Drop → payload legado | Conflito universal no backend não comprovado |
| Criar/editar evento | rotas `agenda-legado` existentes | Reutilizar contrato do modal legado | Modal → DTO | Validar payload final em contrato |
| Paciente | endpoints/catalogo de pacientes existentes | Sim | paciente → vínculo lógico | Órfãos e pacientes apenas no EasyDental |
| Prestadores | catálogos/endpoints existentes | Sim | catálogo → filtro | Sem agenda ou inativo |
| Unidades | catálogos/endpoints existentes | Sim | catálogo → filtro | Regras por unidade |
| Especialidades | catálogo existente | Sim | catálogo → filtro | Opção `<Todas>` |
| Configuração de horários | configuração do prestador em `agenda_config_json` | Sim | JSON → `AgendaConfig` | Validar todos os campos no primeiro slice |
| Bloqueios | CRUD de `agenda_legado_bloqueio` | Sim | bloco → evento não editável | Tabela estava vazia na auditoria |
| Horários livres | endpoint/fluxo existente, se acionado pelo modal | Condicional | resposta → opções | Confirmar chamada no runtime futuro |

O primeiro slice React deve ser somente leitura e por janela temporal (`start_date`, `end_date`, filtros). Se o endpoint atual não fornecer limite adequado, isso será uma lacuna de contrato a resolver antes de produção, não um motivo para carregar os mais de 14 mil registros.

## J. Scheduler — análise comparativa

### Requisitos reais

Semana e dia; segunda a sábado; slots de 5 minutos configuráveis; início/fim de expediente; duração variável; customização de evento/cabeçalho/célula; cores e fonte configuráveis; bloqueios; validação de drop; toolbar externa; modais próprios; janela temporal; resize desabilitado; adapter substituível.

| Critério | Implementação própria | FullCalendar padrão | DayPilot Lite | React Big Calendar |
|---|---|---|---|---|
| Dia/Semana | Total, custo alto | Nativo via timeGrid | Nativo | Nativo |
| Slot 5 min/configuração | Total | `slotDuration` | Duração de célula configurável | `step`/`timeslots` |
| Duração variável | Total | Nativo | Nativo | Nativo |
| Drag e validação | Total, maior risco | `eventDrop`/`eventAllow` | Nativo | DnD addon |
| Conflito/bloqueio | Código Brana obrigatório | callbacks/constraints + backend | parte nativa; regras Brana | Código customizado |
| Renderização/cor/fonte | Total | `eventContent` + CSS | conteúdo/CSS | componentes/styles |
| Toolbar externa | Total | Suportada por API/ref | Suportada | Suportada |
| Multi-recurso/mode Clínica | Total, custo muito alto | Pode exigir Premium | Lite/Pro conforme recurso | Customização relevante |
| Resize | Controlável | deve ser desabilitado | deve ser desabilitado | deve ser desabilitado |
| Performance | Responsabilidade integral | Boa para janela | Lite oferece progressive rendering limitado | depende do volume/render |
| Licença | Sem licença, alto custo de manutenção | Standard MIT; Premium separado | Lite Apache 2.0; Pro comercial | MIT |
| Risco de acoplamento | Alto se mal projetado | Médio, reduzido pelo adapter | Médio | Médio/alto pela customização |

### FullCalendar

Opção principal para a primeira fatia: `@fullcalendar/react` com a API standard de time grid e o pacote de interação correspondente. O contrato documenta React 17–19, licença MIT para a versão standard, `eventContent` para JSX, toolbar externa via API/ref e `eventAllow` para autorização programática do drop. Fontes oficiais: [React connector](https://fullcalendar.io/docs/react), [eventAllow](https://fullcalendar.io/docs/eventAllow) e [Premium plugins](https://fullcalendar.io/docs/premium).

Plugins planejados apenas no spike, sem instalar nesta fase: time grid/day grid, interação e locale conforme a versão escolhida. A versão exata deve ser fixada somente no spike, compatível com o React realmente instalado.

**FullCalendar Premium para a primeira fatia: NÃO NECESSÁRIO.** A visão vertical de uma agenda selecionada pode usar o time grid standard; filtros de prestador/unidade ficam fora do scheduler. **Para o modo Clínica multi-recurso: AINDA NÃO DETERMINADO.** Se a paridade exigir recursos como colunas simultâneas de prestadores/unidades, os plugins Resource/Resource TimeGrid são Premium e a decisão deverá considerar licença comercial. Não introduzir esse modo sem spike de paridade.

### DayPilot

É a opção reserva quando a paridade exigir uma experiência mais especializada de scheduling ou múltiplos recursos. A edição Lite para React é Apache 2.0 e oferece calendário diário/semanal, duração de célula, drag/drop, conteúdo customizado, dias configuráveis e business hours. A edição Pro é comercial e adiciona, entre outros, progressive rendering avançado, colunas largas, células desabilitadas, prevenção de overlap e recursos avançados. Fontes: [DayPilot React](https://www.daypilot.org/react/), [documentação do Scheduler React](https://doc.daypilot.org/scheduler/react/) e [download/licenças Lite](https://javascript.daypilot.org/download/).

O risco é depender de Pro para o modo Clínica, prevenção de overlap ou ergonomia avançada. Nenhuma licença Pro deve ser assumida antes de um spike e cotação atual.

### React Big Calendar

Tem licença MIT e cobre o calendário tradicional, intervalos, durações e customização por componentes. O DnD é uma integração adicional e a biblioteca exige um localizer. Fonte oficial: [repositório e README](https://github.com/jquense/react-big-calendar). É opção tecnicamente possível, porém com maior trabalho artesanal para regras de bloqueio, conflito, campos densos, segunda–sábado e eventual modo Clínica. Fica em terceiro lugar.

## K. Decisão arquitetural

**Opção principal:** FullCalendar standard, encapsulado por adapter, inicialmente em uma visão vertical de Agenda por janela e filtros.

**Opção reserva:** DayPilot Lite para a mesma fatia; DayPilot Pro somente se o spike comprovar que recursos avançados são indispensáveis e a licença for aprovada.

Razões: FullCalendar tem melhor equilíbrio entre time grid, drag, custom render, toolbar externa, React e licença standard. A recomendação não autoriza instalação nem compromisso financeiro. O modo Clínica multi-recurso é a condição que pode alterar a decisão.

## L. Spike isolado futuro

O spike não acessará API, banco, autenticação ou dados reais. Usará uma fixture local com uma semana, segunda–sábado, slots de 5 minutos, eventos de 5/30/90 minutos, sobreposição, bloqueio visual e paciente órfão.

### Critérios de aprovação

1. Renderiza segunda–sábado sem domingo.
2. Slot e horário inicial/final são recebidos por configuração.
3. Eventos preservam duração variável.
4. Evento usa cor de tipo e override de status sem regra fixa no componente.
5. Evento órfão continua visível por snapshot.
6. Drag muda dia/horário, preserva duração e rejeita destino inválido.
7. Conflito rejeitado mostra erro sem alterar a fixture final.
8. Resize não aparece nem altera duração.
9. Toolbar fica fora do scheduler e controla navegação.
10. O adapter pode trocar o renderer sem alterar o modelo de domínio.

## M. Drag, conflito e persistência

Fluxo planejado:

```text
drop
  → calcular novo início e fim = novo início + duração original
  → validar grade, expediente, bloqueio e conflito conhecido
  → mostrar estado pending
  → PUT /agenda-legado/{id}
  → sucesso: aceitar e recarregar janela
  → erro/conflito: rollback visual e mensagem do contrato legado
```

A estratégia inicial será pessimista, não optimistic: conserva a posição antiga até a confirmação da API. Isso reduz divergência quando o backend rejeita o destino. A validação local melhora feedback, mas não substitui o backend; a auditoria não comprovou uma validação universal de conflitos em todas as rotas. Fica registrada a dívida técnica **validação universal de conflito no backend**.

Resize ficará **DESABILITADO** no desenho futuro. Duração será alterada somente pelo modal que já representa esse contrato.

Não haverá botão ou flag novo de Encaixe. O comportamento só poderá ser adicionado após contrato formal.

## N. Cores, estados e campos visíveis

Resolução planejada:

```text
configuração de apresentação
  + cor do tipo de agendamento
  + override de status (item_auxiliar.cor_apresentacao)
  + dados do evento
  → BranaAgendaDisplay
```

Regra congelada: a cor não é status fixo. A auditoria encontrou fallback de tipo/configuração e override de status; os valores observados (`#ffff00`, `#0000ff`, `#00e5ef`) permanecem dados da configuração legada, não enum do React. Fonte, campos visíveis, destaque e borda também devem ser resolvidos por configuração quando o contrato os expuser.

`AgendaEventContent` receberá `(event, displayConfig)` e renderizará somente os campos permitidos. Não hardcodar paciente + telefone como card universal.

## O. Configuração de horários

O React consumirá a configuração existente, cuja evidência principal é `prestador_odonto.agenda_config_json` e seus grupos de escala, bloqueios, apresentação e visualização. O fluxo planejado é:

```text
Configura horários de agendamento
  → persistência existente
  → leitura/configuração normalizada
  → useAgendaConfig
  → slot, expediente, dias, intervalos e displayConfig
  → adapter
  → Agenda semanal
```

Não duplicar cálculo de disponibilidade no componente. Se houver exceção, almoço, bloqueio ou regra por unidade/especialidade, a camada de configuração deve entregá-la como dado normalizado e o adapter apenas traduzi-la para a grade.

## P. Modais

Os modais serão separados por fluxo, reutilizando contratos existentes: agendamento (novo/alteração), paciente/pesquisa, horário, configuração, bloqueio, repetição/recorrência quando comprovada e ações de cancelamento/confirmação/falta. A página somente orquestrará abertura, seleção e retorno; cada modal terá schema, validação e chamada de API próprios. Não haverá modal gigante nem criação de fluxo de Encaixe sem contrato.

## Q. Pacientes órfãos e vínculos lógicos

O renderer deve usar o snapshot do evento como fonte imediata. O catálogo de pacientes é enriquecimento, não pré-condição de renderização. O evento mantém `logicalId` para auditoria/edição, mas não deve ser descartado quando o ID não resolver.

Paciente, prestador e unidade continuam vínculos lógicos (`nro_pac`, `id_prestador`, `id_unidade`) e a consistência é responsabilidade do contrato de aplicação/tenant. Riscos: órfãos, referências de outra clínica, divergência de nomes snapshot/catálogo e dificuldades de sincronização futura. O React não adicionará FK, não reconciliará dados e não aceitará IDs de outra clínica por confiar em filtro visual.

## R. Performance, janela e responsividade

- Buscar somente a janela Dia/Semana e filtros atuais.
- Manter cache por chave `view + start + end + specialty + provider + unit` quando o contrato permitir.
- Não carregar os mais de 14 mil eventos históricos no DOM.
- Memoizar normalização/estilo e evitar recalcular eventos não afetados por um filtro.
- Preservar scroll ao navegar quando a biblioteca permitir.
- Debounce apenas em pesquisa de paciente e campos que realmente disparem consulta.
- Medir a densidade real no spike antes de introduzir virtualização.
- Priorizar desktop operacional; em larguras menores, manter scroll horizontal e não transformar a Agenda em fluxo mobile novo.

## S. Segurança e tenant

As chamadas usarão a sessão autenticada existente. O backend permanece autoridade para clínica, permissões, paciente, prestador e unidade. O frontend não enviará nem confiará em `clinica_id` editável, não exibirá dados de outra clínica e deverá tratar 403/404 sem vazar detalhes. Testes futuros incluirão usuário sem módulo, ID de outra clínica e paciente/prestador inexistente.

## T. Plano de testes futuro

### Unitários

Normalização de DTO, datas/timezone, duração, precedência de cores, paciente órfão, adapter, janela e validação local de destino.

### Contrato

Payload e resposta de leitura, filtros, configuração, blocos e `PUT /agenda-legado/{id}`.

### Componentes

Toolbar, filtros, cabeçalhos, renderer de evento, estados loading/empty/error e resize desabilitado.

### Runtime

Semana, dia, navegação, filtros, abertura de modal, cores, campos configuráveis, evento órfão, drag aprovado/rejeitado e falha de API; incluir console sem erros.

### Regressão

Comparar janela, duração, snapshots, bloqueios, status/cores e permissões com o legado antes de qualquer troca de rota.

## U. Roadmap incremental

1. **Fase 2A — arquitetura (esta fase):** documento, contratos congelados, adapter, riscos e spike definidos.
2. **Fase 2B — shell vazio:** rota, active item e banda global, sem dados e sem CRUD; homologar L.
3. **Fase 2C — spike:** fixture local e comparação objetiva de FullCalendar standard/DayPilot Lite.
4. **Fase 2D — leitura:** DTO, domínio, configuração e carregamento de uma janela real, sem edição.
5. **Fase 2E — navegação/filtros:** Dia/Semana, Especialidade, Prestador e Unidade.
6. **Fase 2F — renderer:** cores, fonte, campos visíveis, estados e fallback órfão.
7. **Fase 2G — seleção/modais:** somente fluxos já comprovados e com contratos de teste.
8. **Fase 2H — drag:** validação, PUT, rollback e homologação de conflito.
9. **Fase 2I — bloqueios/configuração:** leitura e fluxos de bloqueio conforme contrato.
10. **Fase 2J — paridade:** comparação Brana legado, EasyDental quando disponível, permissões, performance e cutover incremental.

Cada etapa deve ser pequena, reversível e homologável. O legado continua funcional em paralelo até aprovação formal.

## V. Pendências

### Não bloqueadoras para iniciar a primeira implementação pequena

- comportamento visual nativo completo do EasyDental Desktop;
- amostra real de bloqueio, pois a tabela estava vazia;
- validação controlada de conflitos contra todos os fluxos de backend;
- captura de rede durante todos os modais;
- pacientes somente no EasyDental/inativos;
- divergência histórica de `valor_int` entre ORM/documentação e banco real.

### Bloqueadora do modo Clínica multi-recurso, não da primeira fatia

- decidir se a paridade exige colunas simultâneas de recursos (prestadores/unidades). Se exigir, o spike deve comparar FullCalendar Premium/Resource TimeGrid, DayPilot Pro e alternativa própria antes de comprar licença ou acoplar o domínio.

### Fora de escopo

Migração de pacientes, correção de órfãos, nova API, FK, CRUD novo, alteração de regra, instalação de scheduler e implementação da Agenda.

## W. Conclusão da Fase 2

Há arquitetura suficiente para iniciar a primeira implementação pequena e controlada: shell vazio, seguido de spike local. O domínio Brana Cloude está separado do scheduler, o contrato de drag/resize/cores/órfãos está explicitado, os endpoints existentes são reutilizados e a condição de licença para modo multi-recurso está documentada.

**FASE 2 = CONCLUÍDA**

Esta conclusão não autoriza iniciar a Fase 2B automaticamente.

## Fontes oficiais consultadas para a avaliação de scheduler

- [FullCalendar React](https://fullcalendar.io/docs/react)
- [FullCalendar eventAllow](https://fullcalendar.io/docs/eventAllow)
- [FullCalendar Premium](https://fullcalendar.io/docs/premium)
- [DayPilot for React](https://www.daypilot.org/react/)
- [DayPilot React Scheduler](https://doc.daypilot.org/scheduler/react/)
- [DayPilot Lite download](https://javascript.daypilot.org/download/)
- [React Big Calendar — repositório oficial](https://github.com/jquense/react-big-calendar)
