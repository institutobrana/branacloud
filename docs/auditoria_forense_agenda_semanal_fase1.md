# Auditoria forense — Agenda semanal — Fase 1

**Data da auditoria:** 2026-08-24  
**Escopo:** levantamento somente leitura para futura migração ao frontend React.  
**Regra aplicada:** nenhum código, rota, banco, dado ou dependência foi alterado; nenhum scheduler foi instalado.

## A. Estado inicial

- Diretório: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- HEAD: `ecadb4f00e3564b7412cb1eda25231172673ceac`
- O `git status --short` inicial já continha muitas alterações alheias à auditoria, incluindo `M .gitignore` e numerosas exclusões em `assets/easy/`. Essas alterações foram preservadas e não são atribuídas a esta tarefa.
- EasyDental disponível em `Y:\EDS70`.

## B. Fontes encontradas e peso da evidência

Fontes prioritárias efetivamente consultadas:

1. `README.md`, `docs/00_master_guide.md`, `docs/02_arquitetura.md`, `docs/03_mapa_codigo.md`, `docs/06_seguranca.md` e `docs/10_continuidade.md`.
2. `docs/fechamento_t2b_configura_horarios_agendamento.md` — contrato já consolidado da configuração de horários.
3. `backend/routes/agenda_legado_routes.py`, `backend/models/agenda_legado.py`, `backend/services/agenda_display.py`.
4. `frontend/index.html`, `frontend/app.js`, `frontend/js/modules/agenda-principal-legado-utils.js`, `frontend/js/modules/agenda-principal-semana-utils.js`, `frontend/prestadores_override.js` e `frontend/prestadores_agenda_*.js`.
5. Testes `backend/tests/test_agenda_legado_*.py`, `backend/tests/test_prestadores_agenda_config_contract.py` e testes React da feature `agendaConfiguracao`.
6. DDL EasyDental `Y:\EDS70\Dados\eds70.sql`, especialmente `AGENDA`, `AGENDA_BLOQUEIO`, `_STATUS_AGENDA` e respectivas constraints.

Também foram localizados documentos e fontes auxiliares sobre contatos, motivos/situação de agendamento, Google Calendar, avisos, SMS/e-mail e migração CSV. Eles não foram usados como prova superior ao código atual quando divergentes.

**Não validado em runtime:** não foi possível nesta auditoria declarar como observado em navegador o comportamento de clique, drag, resize, hover, modal, console ou chamadas reais; também não foi executado o EasyDental Desktop. O que segue como confirmado é confirmado por código, contrato, teste ou DDL.

## C. Arquitetura atual

```text
Menu legado Agenda
  -> agenda-semana / Ctrl+G
  -> frontend/app.js + agenda-principal-semana-utils.js
  -> patches e handlers em prestadores_override.js
  -> GET/POST/PUT/DELETE /agenda-legado/*
  -> PostgreSQL: agenda_legado_evento, agenda_legado_bloqueio,
                 prestador_odonto.agenda_config_json e catálogos relacionados
```

O backend é FastAPI com autenticação JWT e `require_module_access("agenda")` no router. As rotas operacionais devem filtrar pelo `current_user.clinica_id`; os testes de bloqueios comprovam esse isolamento para o CRUD de bloqueios. O frontend legado é estático e monolítico, servido em `/app`/`/legado`; o React atual é servido separadamente em `/react`. A rota React de Agenda semanal aparece como desabilitada em `frontend-react/src/app/App.jsx`; a feature React existente é a configuração de agenda, não a grade semanal.

O shell React e o padrão do L estão documentados em `docs/frontend_react_padrao_shell_modulos_administrativos.md` e `docs/padrao_barra_horizontal.md`; `Tabelas → Serviços de Protético` é referência de composição, mas a Agenda ainda não possui página React funcional.

## D. Tela principal e grade

### O que o código confirma

- Há comando de menu `Agenda da semana...` com atalho `Ctrl + G` em `frontend/index.html`.
- A implementação semanal possui estado próprio (`agendaSemanaState`), cache de eventos, configuração por prestador e funções de renderização/estrutura no legado.
- O passo de grade é derivado de `agendaSemanaState.step`, com fallback de 5 minutos (`step * 60 * 1000`). O valor configurável é por prestador e o backend normaliza duração mínima de 5 minutos.
- A configuração padrão encontrada no backend é: manhã `07:00–13:00`, tarde `13:00–20:00`, duração `5`, visualização da semana `12` horários e do dia `12` horários.
- A configuração contém `visualizacao_campos`, cores de particular/convênio/compromisso, fonte e bloqueios.
- O backend oferece `/horarios-livres`; sua lógica percorre dias, intervalos, passo configurado, eventos ocupantes e bloqueios. Essa é a origem de disponibilidade consultável, não uma regra que deve ser recriada no React.
- O código do patch documenta ocupação de intervalo e conflito ao mover/alterar evento. A política visual completa de sobreposição, altura, largura e scrolling ainda exige validação visual/runtime.

### Itens não comprovados

Dias exibidos/ocultados, segunda–sábado versus domingo, feriados, largura/altura finais, política exata de sobreposição, eventos multi-intervalo, visualização fora do expediente, tooltip/hover e acessibilidade não devem ser inferidos do print. **PENDENTE — evidência necessária:** execução autenticada com dados controlados e inspeção visual/DevTools.

## E. Toolbar, filtros e comandos

### Comandos confirmados por código

| Comando funcional | Evidência/efeito |
|---|---|
| Mês | Localizado nos fluxos/patches da Agenda semanal; sequência exata de renderização e endpoint precisa ser validada em runtime. |
| Semana | Abre/retorna à visão semanal; usa range de datas e recarrega eventos. |
| Dia | Localizado como modo de navegação; detalhes de range pendentes de runtime. |
| Paciente | Fluxo de pesquisa/seleção de paciente no modal e endpoint `/agenda-legado/pacientes`. |
| Horário | Fluxo de horários livres e configuração de escala; `/agenda-legado/horarios-livres`. |
| Configura... | Abre `Configura horários de agendamento`, por prestador, via `agenda_config_json`. |
| Fecha | Fecha a tela/modal e restaura o shell legado. |
| Especialidade | Endpoint `/agenda-legado/especialidades`; a aplicação da filtragem na grade precisa de runtime. |
| Cirurgião/prestador | Endpoint `/agenda-legado/prestadores`; IDs são `PrestadorOdonto.id` no tenant atual. |
| Unidade | Endpoint `/agenda-legado/unidades`; filtra por `UnidadeAtendimento` no tenant atual. |
| Hoje / Semana / Próximo / Atualiza | Comandos legados identificados; `/next` retorna o próximo agendado. |
| Pesquisa | Modal `Pesquisa agendamentos`, com nome/assunto, futuros/passados, pacientes/compromissos; usa `GET /agenda-legado`. |
| Avisos | Opções, pesquisa e envio por e-mail/WhatsApp em `/avisos-agendamento/*`. |
| Google Agenda | Status, OAuth, preview e exportação em `/google-agenda/*`. |
| Novo / Edita / Elimina | CRUD de evento em `POST /agenda-legado`, `PUT /agenda-legado/{id}`, `DELETE /agenda-legado/{id}`. |

**Ícones sem texto:** há vários ícones no patch e no legado (`novo`, `editar`, `eliminar`, `gravar`, `cancela`, calendário etc.). O nome do arquivo do ícone não é prova suficiente do comando; o inventário visual final precisa ser conferido em runtime.

## F. Modelo de evento/agendamento

`AgendaLegadoEvento` / tabela `agenda_legado_evento` contém:

```text
id, clinica_id,
id_prestador, id_unidade, data, hora_inicio, hora_fim, sala, tipo,
nro_pac, nome, motivo, status, observ,
tip_fone1, fone1, tip_fone2, fone2, tip_fone3, fone3,
palm_id, palm_upd, myeasy_id, myeasy_upd,
user_stamp_ins, time_stamp_ins, user_stamp_upd, time_stamp_upd
```

O campo `nome` é snapshot prioritário; `services/agenda_display.py` só usa o paciente atual como fallback quando o snapshot está vazio. Isso preserva o nome histórico e não pode ser substituído silenciosamente por uma busca atual de paciente.

`tipo == 2` é tratado pelo frontend como compromisso: desabilita nome/paciente e usa assunto/motivo. A tabela de status vem de `ItemAuxiliar` via `/status-agendamento`; a ligação legada original também existe em `_STATUS_AGENDA`. Significados de cada código/status e cores não foram completamente comprovados no código atual.

Repetição é explícita em `POST /agenda-legado/repetir`, com modos dias, semanas e meses, opção `sobrepor` e quantidades/dia-alvo. O endpoint cria novos eventos; não há no modelo atual um campo de recorrência persistente.

## G. Configuração de horários → Agenda semanal

A configuração atual fica em `PrestadorOdonto.agenda_config_json`, por prestador e clínica. A feature React já existente (`frontend-react/src/features/agendaConfiguracao/`) documenta quatro abas:

- Escala: manhã, tarde, duração, quantidade de horários semana/dia.
- Bloqueios: unidade, dia da semana, vigência inicial/final, hora inicial/final e mensagem.
- Apresentação: cores de particular, convênio e compromisso; fonte.
- Visualização: campos do agendamento (número do paciente, prontuário, nome, matrícula, convênio, tabela, telefones e sala), com defaults documentados.

Fluxo comprovado:

```text
Prestador / agenda-config
  -> GET/PUT /agenda-legado/prestadores/{id}/agenda-config
  -> agenda_config_json
  -> normalização de escala/apresentação/visualização
  -> estado da Agenda semanal e /horarios-livres

Bloqueio
  -> CRUD /agenda-legado/prestadores/{id}/bloqueios
  -> agenda_legado_bloqueio
  -> exclusão dos intervalos disponíveis e indicação na grade
```

Não há evidência de uma configuração independente por especialidade. Especialidade é catálogo/filtro derivado de auxiliares e prestadores. Unidade participa dos bloqueios, eventos e disponibilidade; uma política de horário global por unidade não foi comprovada.

## H. Modais e interações

Modais identificados no código: novo/edição de agendamento, repetição, pesquisa de agendamentos, configuração de horários, bloqueio, fonte, avisos e fluxos de paciente/seleção. O modal de agenda inclui abas `Dados do agendamento` e `Repete agendamento`; campos confirmados incluem data, início, fim, nome, telefone, motivo/assunto, tipo, status, observação, telefones e vínculo `nro_pac`.

Interações localizadas: clique/duplo clique em pesquisa, Enter para pesquisar/editar, Esc para fechar pesquisa, setas para selecionar resultados, seleção de célula/evento, edição, exclusão com confirmação, repetição, drag/movimento e resize no patch da Agenda semanal. **PENDENTE:** tab order completo, botão direito/menu contextual, regras exatas de resize/mover, validação final de conflito e chamadas observadas em navegador.

## I. Dependências de domínio

| Origem | Integração | Evidência | Impacto |
|---|---|---|---|
| Pacientes | `nro_pac`, snapshot `nome`, telefones; `/pacientes` | model/rota/teste de display | seleção, exibição e preservação histórica |
| Prestadores | `id_prestador`, `PrestadorOdonto`, especialidades e `agenda_config_json` | rota `/prestadores`, modelo e testes | grade, filtro, escala e permissões |
| Especialidades | auxiliares `Especialidade` + dados do prestador | `/especialidades` | filtro/catálogo; efeito final na grade pendente |
| Unidades | `id_unidade`, `UnidadeAtendimento` | `/unidades`, bloqueios e modelo | filtro, disponibilidade e bloqueios |
| Status/motivos | `ItemAuxiliar`, `/status-agendamento`, `/assuntos-compromisso` | rota | status, assunto e pesquisa |
| Avisos | e-mail/WhatsApp, templates de agenda | `/avisos-agendamento/*`, storage/modelos | comunicação externa |
| Google Calendar | preview/export/oauth | `/google-agenda/*` | publicação externa, não persistência primária |
| Usuários/permissões | JWT, `require_module_access("agenda")`, stamps | router/security/modelo | auth, tenant, auditoria de inclusão/alteração |

Paciente EasyDental ainda não migrado, duplicidade, inativação e criação completa a partir da Agenda não foram comprovados por um contrato específico; devem ser testados antes da Fase 2.

## J. Backend/API

Todos os endpoints abaixo pertencem ao router `/agenda-legado` e herdam autenticação/permissão de módulo. Os endpoints de evento usam filtros de clínica; os de prestador/unidade/paciente também resolvem objetos do tenant atual.

| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/` | listar eventos por start/end, prestador, unidade, nome, limite |
| POST/PUT/DELETE | `/`, `/{item_id}` | criar, editar, excluir evento |
| POST | `/repetir` | gerar recorrências |
| GET | `/horarios-livres` | calcular slots disponíveis |
| GET | `/next` | próximo agendado |
| GET | `/prestadores`, `/unidades`, `/especialidades` | catálogos/filtros |
| GET | `/pacientes` | pacientes disponíveis para Agenda |
| GET | `/status-agendamento`, `/assuntos-compromisso`, `/tipos-contato`, `/tipos-fone` | auxiliares |
| GET/PUT | `/prestadores/{id}/agenda-config` | ler/gravar configuração |
| GET/POST/PUT/DELETE | `/prestadores/{id}/bloqueios[/{bloqueio_id}]` | CRUD de bloqueios |
| GET/POST | `/avisos-agendamento...` | opções, pesquisa e envio |
| GET/POST | `/google-agenda...` | status, OAuth, preview e exportação |

Chamador principal confirmado: frontend legado. A feature React de configuração chama os endpoints de configuração/bloqueios. Não foi encontrado consumidor da grade semanal no React.

## K. Banco e relações

```text
clinicas (tenant)
  ├── pacientes
  ├── prestador_odonto
  │     └── agenda_config_json
  ├── unidade_atendimento
  ├── agenda_legado_evento
  │     ├── id_prestador -> prestador lógico por tenant
  │     ├── id_unidade -> unidade lógica por tenant
  │     └── nro_pac -> paciente lógico/snapshot legado
  ├── agenda_legado_bloqueio
  │     ├── id_prestador
  │     └── id_unidade
  └── itens_auxiliares (especialidade/status/motivos)
```

`agenda_legado_evento` tem PK `id`, índices em `id`, `clinica_id`, `id_prestador`, `id_unidade` e `data`; `clinica_id` tem FK para `clinicas`. `agenda_legado_bloqueio` tem PK `id`, índices em `id`, `clinica_id`, `id_prestador`, `id_unidade`, e campos de dia/vigência/horas. Não há FK ORM explícita para prestador, unidade ou paciente nos modelos atuais, embora o DDL EasyDental possua FKs equivalentes. A ausência de migrations formais é risco conhecido.

## L. EasyDental Desktop

O DDL em `Y:\EDS70\Dados\eds70.sql` confirma o equivalente funcional legado:

- `AGENDA`: os mesmos campos essenciais da entidade web, incluindo horários em inteiros, paciente, nome, telefones, status, observação, IDs de sincronização e stamps.
- `AGENDA_BLOQUEIO`: prestador, unidade, dia da semana, vigência, horário e mensagem.
- `_STATUS_AGENDA`: registro, nome, código, descrição, bloqueio, mensagem, reservado e `NROCOR`.
- FKs de `AGENDA` para status, paciente (`PESSOAL`), prestador, unidade e usuário; FKs de bloqueio para prestador e unidade.

Não foi possível localizar no diretório `Objetos` código-fonte textual da tela. **NÃO VALIDADO EM RUNTIME:** menus, atalhos além do contrato textual, layout, cores efetivamente renderizadas, modais, drag/resize e comportamento de conflitos no EasyDental. O SQL é evidência de modelo, não de UX.

## M. Matriz EasyDental × Brana legado

| Função | EasyDental | Brana legado | Igual? | Diferença/lacuna | Fonte |
|---|---|---|---|---|---|
| Evento principal | `AGENDA` | `agenda_legado_evento` | Estruturalmente sim | Brana adiciona `clinica_id` e usa modelo migrado | DDL/model |
| Bloqueio | `AGENDA_BLOQUEIO` | `agenda_legado_bloqueio` | Sim | Brana adiciona tenant e CRUD HTTP | DDL/model |
| Paciente | FK `NROPAC`→`PESSOAL` | `nro_pac` + snapshot/fallback | Parcial | contrato de paciente não é FK ORM explícita | DDL/serviço |
| Prestador/unidade | FKs nativas | IDs e validação por tenant | Parcial | isolamento web substitui parte da FK legada | DDL/rotas |
| Status/cor | `_STATUS_AGENDA.NROCOR` | auxiliares/status + config de apresentação | Não comprovado | sem mapeamento completo de códigos/cores | DDL/rotas |
| Escala | campos/configuração desktop | `agenda_config_json` | Parcial | formato web JSON e UI React de configuração | contrato React |
| Repetição | existente no domínio legado | endpoint que materializa eventos | Não comprovado | runtime desktop pendente | rota |
| Google Calendar/avisos | não confirmado no DDL | endpoints web existentes | Não comparável | integração adicional no web | rotas |

## N. Rastreabilidade para React futuro

| Regra | Nasce em | Implementação atual | Persistência | React futuro |
|---|---|---|---|---|
| Listar eventos | filtros/range da Agenda | `GET /agenda-legado` | `agenda_legado_evento` | consumir/adaptar; não duplicar query |
| Slot disponível | escala + eventos + bloqueios | `/horarios-livres` | evento/bloqueio/config | consumir e renderizar |
| Escala | configuração por prestador | config endpoints/normalização | `agenda_config_json` | modal/adapter; backend é fonte |
| Bloqueio | registro por prestador/unidade/dia/vigência | CRUD bloqueios | `agenda_legado_bloqueio` | consumir CRUD |
| Nome exibido | snapshot primeiro | `agenda_display.py` | evento + paciente | preservar política |
| Repetição | modo/quantidade/sobreposição | `/repetir` | novos eventos | enviar comando |
| Tenant/permissão | usuário autenticado | dependências/rotas | `clinica_id` | nunca confiar no frontend |
| Cores/visibilidade | configuração + status | config/auxiliares + legado | JSON/auxiliares | adapter visual; confirmar mapeamento |

## O. Avaliação preliminar de Scheduler

Sem instalar bibliotecas e sem transformar a avaliação em decisão de implementação:

| Requisito real | Próprio | FullCalendar | DayPilot | React Big Calendar |
|---|---|---|---|---|
| Grade semanal com passo configurável | controle total, alto custo | bom, customização | forte, customização/licença | bom, customização |
| Bloqueios e disponibilidade por prestador | domínio fica limpo | precisa adapter | precisa adapter | precisa adapter |
| Drag/resize e conflito | alto risco inicial | suporte maduro | suporte forte | suporte via handlers |
| Cores/campos configuráveis do Brana | fácil semântico | render hooks | templates | components/accessors |
| Múltiplos prestadores/unidades | trabalho próprio | possível | possível | possível |
| Acessibilidade/responsividade | responsabilidade total | validar CSS/slots | validar licença/tema | responsabilidade de customização |
| Licença/custo | sem custo de lib, maior custo manutenção | confirmar edição/licença vigente | confirmar edição/licença vigente | licença open source, confirmar versão |
| Risco de regressão | máximo | médio | médio/alto por acoplamento | médio |

Conclusão preliminar: não escolher por aparência. A decisão deve ser feita após fechar o contrato de eventos, bloqueios, conflitos, cores/status, resize e comportamento EasyDental. Recomenda-se um `agendaSchedulerAdapter` isolando modelo Brana de qualquer biblioteca; o domínio e as APIs não devem conhecer tipos do scheduler.

## P. Riscos

1. Confundir a tabela de listagem “Agenda (legado)” com a grade semanal real.
2. Perder `nome` snapshot e alterar histórico ao reidratar paciente.
3. Reimplementar `/horarios-livres` no React e divergir em bloqueios/escala.
4. Aceitar `clinica_id` do cliente ou esquecer filtro de tenant.
5. Inferir cores/status de screenshot sem mapear `_STATUS_AGENDA`/auxiliares.
6. Ignorar patches em `prestadores_override.js` e `prestadores_agenda_*.js`.
7. Perder repetição materializada, avisos, Google Calendar, pesquisa e atalhos.
8. Assumir segunda–sábado, 5 minutos ou horários fixos.
9. Acoplar o modelo de domínio a FullCalendar/DayPilot/RBC.
10. Ausência de migrations formais e dependência de bootstrap/hotfix de schema.

## Q. Lacunas obrigatórias antes da Fase 2

- Executar Brana legado autenticado e registrar vídeo/screenshot/DevTools dos fluxos Agenda semanal, filtros, modais, atalhos, drag/resize, conflito e navegação.
- Executar EasyDental em `Y:\EDS70`, abrir `Agenda → Agenda da semana` e comparar cada comando da matriz.
- Obter/identificar o mapeamento completo de `_STATUS_AGENDA.NROCOR` para cores e estados.
- Confirmar o filtro de especialidade na grade e sua relação real com prestador/unidade.
- Confirmar paciente EasyDental não migrado, duplicidade, inativação e criação/alteração pela Agenda.
- Confirmar tab order, teclado, contexto, hover/tooltip, mobile e acessibilidade.
- Inspecionar constraints/índices efetivos do PostgreSQL de homologação sem executar DDL.
- Verificar oficialmente, no momento da decisão, versões, compatibilidade React e licenças de cada scheduler.

## R. Recomendação

O próximo passo seguro é uma validação runtime instrumentada, não a criação da página React. Depois de fechar as lacunas acima, produzir o contrato de domínio/adapter e um plano de arquitetura da feature. A implementação futura deve consumir os endpoints existentes, reutilizar a configuração de horários e manter a separação:

```text
features/agendaSemanal/
  api/          contratos HTTP existentes
  adapters/     modelo Brana <-> scheduler
  hooks/        estado de filtros/seleção/ações
  components/  toolbar, filtros, cabeçalho, grade, evento, legenda
  modals/       novo/editar/repetir/pesquisa/bloqueio
  utils/        datas, intervalos, cores/status
  AgendaSemanalPage.jsx
```

Nenhum arquivo React dessa arquitetura foi criado nesta fase.

## S. Validações e entrega

- Validação estática: concluída para fontes citadas, rotas, modelos, contratos de configuração, testes e DDL EasyDental.
- Testes automatizados: não executados nesta auditoria, para não confundir testes isolados com homologação funcional da Agenda.
- Runtime Brana legado: **NÃO VALIDADO EM RUNTIME**.
- Runtime EasyDental: **NÃO VALIDADO EM RUNTIME**.
- Banco PostgreSQL real: **NÃO CONSULTADO/ALTERADO**.
- Arquivos alterados nesta tarefa: somente este relatório de auditoria.
- Alterações preexistentes: preservadas; revisar `git status` antes de qualquer commit.

## FASE 1B — VALIDAÇÃO RUNTIME E BANCO READ-ONLY

**Data:** 2026-08-24  
**Aba utilizada:** `http://127.0.0.1:8000/frontend/?agenda_semana=1&agenda_modo=semana`  
**Autenticação:** sessão existente autenticada, confirmada pela renderização da Agenda e dos dados/catálogos.

### Checklist das incertezas da Fase 1

| Item | Resultado | Evidência objetiva |
|---|---|---|
| Abertura da Agenda semanal | **CONFIRMADO** | Tela renderizada na sessão autenticada; toolbar, filtros, grade e eventos visíveis |
| Grade de segunda a sábado | **CONFIRMADO para a sessão testada** | Cabeçalho `Seg - 24/08` a `Sáb - 29/08`; também confirmado em `31/08–05/09` |
| Intervalo atual | **CONFIRMADO: 5 minutos** | Grade exibiu `07:00`, `07:05`, `07:10` ... `19:55` |
| Intervalo fixo global | **REFUTADO** | Modal exibiu `Duração do horário = 5` como configuração do prestador; código/contrato permitem configuração |
| Horários inicial/final atuais | **CONFIRMADO para Gleisson Tel** | Configuração exibiu manhã `07:00–13:00`, tarde `13:00–20:00` |
| Semana seguinte | **CONFIRMADO** | Controle de semana mudou para `Semana 31/08 a 05/09` |
| Visão Dia | **CONFIRMADO** | Botão `Dia 31/08/2026` mudou cabeçalho para `Segunda - 31/08/2026` |
| Visão Semana | **CONFIRMADO** | Botão `Semana 31/08 a 05/09` retornou seis colunas |
| Filtro Especialidade | **CONFIRMADO** | Combo possui `<<Todas>>` e especialidades; `Endodontia` foi selecionada e a lista de cirurgião foi recalculada |
| Filtro Cirurgião | **CONFIRMADO** | Combo renderizado com `Gleisson Tel`; opções foram alteradas conforme o filtro de especialidade |
| Filtro Unidade | **CONFIRMADO** | Combo renderizado com quatro unidades da clínica |
| Modal Configura horários | **CONFIRMADO** | Título real `Configura horários de agendamento (Gleisson Tel)` |
| Abas Escala/Bloqueios/Apresentação/Visualização | **CONFIRMADO** | Todas abriram sem salvar |
| Pesquisa de agendamentos | **CONFIRMADO** | Modal `Pesquisa agendamentos`, filtros futuros/passados, pacientes/compromissos |
| Pesquisa de horários livres | **CONFIRMADO** | Modal `Pesquisa horarios livres`, dias, cirurgião, unidade, hora e período |
| Duração de evento variável | **CONFIRMADO no banco** | Consulta read-only encontrou durações de 5 minutos até 13 horas; não é correto modelar evento como uma célula fixa |
| Bloqueios existentes no PostgreSQL | **CONFIRMADO: nenhum registro** | `count(*) agenda_legado_bloqueio = 0`; bloqueio foi inspecionado no modal, mas não criado |
| Cores configuráveis | **CONFIRMADO na configuração, significado global ainda NÃO FOI POSSÍVEL VALIDAR** | Preview exibiu particular amarelo, convênio azul, compromisso azul água; não havia amostra runtime de todos os status |
| Drag/resize/conflito | **NÃO FOI POSSÍVEL VALIDAR** | Não foi executado movimento/resize para não alterar dados reais sem estratégia de rollback; código continua sendo a única evidência |
| Paciente em runtime | **NÃO FOI POSSÍVEL VALIDAR completamente** | Campo/modal da Agenda abriu, mas não foi selecionado/alterado paciente real |
| EasyDental Desktop | **NÃO FOI POSSÍVEL VALIDAR** | O diretório/DDL foi consultado; não houve superfície de execução Desktop disponível nesta sessão |

### Runtime Brana — observações detalhadas

O DOM vivo confirmou estes comandos: `Calendário`, `Paciente...`, `Horário...`, `Imprimir agenda`, `Envio de aviso`, `Publicar no Google agenda...`, `Configura...` e `Fecha`, além dos três pares de navegação mês/semana/dia. A tela iniciou com o prestador `Gleisson Tel`, especialidade `<<Todas>>` e unidade `<<Todas>>`.

O modal de configuração confirmou, sem persistir alteração:

- Escala: quatro horários de início/fim, duração em minutos, quantidade de horários da semana e do dia.
- Bloqueios: toolbar `Novo bloqueio...`, `Altera...`, `Elimina` e tabela `Unidade`, `Dia`, `Vigência`, `Início`, `Final`. A abertura do modal de novo bloqueio revelou campos de unidade de atendimento, dia da semana, vigência, intervalo, mensagem de alerta e opções de sala/consultório.
- Apresentação: cores para particular, convênio e compromisso; `Altera letra...`; fonte padrão exibida como `MS Sans Serif`, tamanho 8, cor preta.
- Visualização: dez checkboxes — número do paciente, número do prontuário, nome, matrícula, convênio, tabela, Fone 1/2/3 e sala.

Conclusão estática anterior: “dias/grade, intervalo e modais exigem validação runtime”.  
Evidência runtime: grade de seis dias, passo de cinco minutos, navegação Dia/Semana e os modais/abas foram observados no DOM vivo.  
Conclusão corrigida: esses itens estão **CONFIRMADOS para o contexto e prestador testados**; a configuração por outros prestadores/unidades e a política de conflitos ainda não estão generalizadas.

### Banco PostgreSQL real — somente leitura

A conexão foi obtida de `backend/.env`, sem exibir credenciais. Foi executada transação PostgreSQL com `BEGIN` e `SET TRANSACTION READ ONLY`; não foram executados `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `CREATE` ou `TRUNCATE`.

Resultados observados:

```text
banco: brana_saas
usuário: postgres
agenda_legado_evento: 14.521
agenda_legado_bloqueio: 0
prestador_odonto: 18
unidade_atendimento: 10
pacientes: 1.632
clinicas: 8
eventos por clínica: clínica 1 = 14.521; demais = 0
```

Distribuição de eventos: `tipo=1` possui os status 0–15 e também nulo; `tipo=2` possui 944 registros sem status. A consulta de `hora_fim - hora_inicio` comprovou durações variáveis: 3.089 eventos de 5 minutos, 2.755 de 15 minutos, 2.621 de 30 minutos, 1.761 de 60 minutos, além de durações superiores, incluindo compromissos de muitas horas.

**Divergência BANCO REAL ≠ inferência ORM/DDL anterior:** as únicas FKs efetivas encontradas em `agenda_legado_evento` e `agenda_legado_bloqueio` foram `clinica_id -> clinicas.id`. Não há FK PostgreSQL direta dessas tabelas para `pacientes`, `prestador_odonto` ou `unidade_atendimento`; os vínculos são IDs lógicos validados pela aplicação/legado. Isso reforça que o React não pode presumir integridade referencial nativa.

O banco real usa em `prestador_odonto` os campos `especialidade`, `especialidades_json` e `agenda_config_json`. A relação de especialidades deve ser tratada como dado do prestador/configuração/rota até que o código da rota seja mapeado em detalhe; não foi confirmada uma tabela física chamada `itens_auxiliares` no PostgreSQL real.

### API e rede

Os endpoints foram confirmados indiretamente por controles que renderizaram dados e por correspondência com os contratos do código. A inspeção de performance da página não foi possível no sandbox de avaliação do navegador, portanto a captura de cada request/response de rede fica **NÃO FOI POSSÍVEL VALIDAR** nesta sessão. Os endpoints documentados na Seção J continuam sendo a fonte estática dos contratos.

### Cores e estados — matriz runtime parcial

| Cor/estilo | Estado real | EasyDental | Brana legado | Fonte da regra | Runtime |
|---|---|---|---|---|---|
| Amarelo | Pacientes particulares na configuração | não validado | preview `Particular` amarelo | `agenda_config_json`/Apresentação | **CONFIRMADO no Brana** |
| Azul | Pacientes de convênio na configuração | não validado | preview `Convênio` azul | `agenda_config_json`/Apresentação | **CONFIRMADO no Brana** |
| Azul água | Compromissos na configuração | não validado | preview `Compromisso` azul água | `agenda_config_json`/Apresentação | **CONFIRMADO no Brana** |
| Cor por status 0–15 | significado individual | DDL possui `NROCOR`, tela não executada | amostras não isoladas por status | `_STATUS_AGENDA`/auxiliares | **NÃO FOI POSSÍVEL VALIDAR** |
| Bloqueio | cor/estilo efetivo | não validado | nenhum bloqueio real no banco testado | bloqueio/configuração | **NÃO FOI POSSÍVEL VALIDAR** |

### EasyDental

O EasyDental foi confirmado estruturalmente por `Y:\EDS70\Dados\eds70.sql`, mas não em execução. Portanto não é legítimo atualizar a matriz como “igual” ou “diferente” para toolbar, cores, teclado, clique, duplo clique, botão direito, bloqueios ou modais. Esses itens permanecem `NÃO DETERMINADO`, com motivo objetivo: falta de superfície Desktop controlável nesta sessão.

### Scheduler após runtime parcial

O runtime confirmou requisitos que devem entrar na avaliação: grade de seis dias, passo de 5 minutos configurável por prestador, eventos com duração variável e potencialmente muito superior a uma célula, seleção por prestador/unidade/especialidade, bloqueios e campos visíveis configuráveis. Isso aumenta o risco de uma implementação própria inicial e mantém a recomendação de adapter. A escolha entre FullCalendar, DayPilot e React Big Calendar continua **NÃO DETERMINADA** até validar sobreposição, resize, conflitos, bloqueios com dados reais e licenças/versões no momento da decisão.

## FASE 1B — VEREDITO

**FASE 1 = INCOMPLETA**

O runtime Brana e o PostgreSQL read-only fecharam várias lacunas e corrigiram duas conclusões estáticas (duração variável e FKs efetivas). Ainda bloqueiam o fechamento integral: runtime EasyDental, mapeamento comprovado de cores/status, teste seguro de seleção de paciente, drag/resize/conflito/encaixe e captura direta de rede. Nenhum desses bloqueios autoriza iniciar a implementação React.

## FASE 1C — FECHAMENTO DAS LACUNAS CRÍTICAS

**Data:** 2026-08-24  
**Escopo:** somente investigação direcionada; nenhum código, endpoint, banco ou dependência foi alterado.

### A. Estado Git e tentativa EasyDental

- Branch: `modularizacao-segura-fase-1`.
- HEAD inicial/final: `ecadb4f00e3564b7412cb1eda25231172673ceac`.
- Remote: `origin https://github.com/institutobrana/branacloud.git`.
- O worktree continuou com as alterações preexistentes; não foram executados comandos destrutivos.
- `Y:\EDS70\EDS70.exe` existe, com 13.543.424 bytes.
- Tentativa: execução do `EDS70.exe` com diretório de trabalho `Y:\EDS70`, sem argumentos e sem acesso de escrita deliberado.
- Resultado: processo `EDS70` abriu janela `EasyDental 7.6` e permaneceu responsivo.
- Bloqueio: esta sessão possui controle do navegador web, não uma superfície de automação/inspeção do desktop Windows. Não foi possível clicar em `Agenda → Agenda da semana` nem observar a tela Desktop.
- Causa objetiva: ausência de ferramenta de controle da janela nativa; não foi inferido comportamento a partir da simples abertura do executável.
- Próximo requisito: executar esta comparação em uma sessão com controle visual/automação do Desktop ou com um operador abrindo a tela e fornecendo evidência observável.

Classificação EasyDental nesta fase: **NÃO DETERMINADO** para toolbar, filtros, cores, status, bloqueios, teclado, clique, duplo clique, botão direito, modais e paciente. O DDL e os arquivos `.raw` continuam evidência estrutural, não evidência de UX.

### B. Cores e status — contrato encontrado

O código legado resolve a cor na ordem abaixo:

```text
evento.status
  -> catálogo item_auxiliar do tipo Situação do agendamento
  -> cor_apresentacao, se existir
  -> tipo do evento
       tipo 1 / paciente particular -> agenda_config_json.apresentacao_particular_cor
       tipo 2 / compromisso          -> agenda_config_json.apresentacao_compromisso_cor
       fallback por motivo contendo convênio -> apresentacao_convenio_cor
       fallback geral                -> apresentacao_compromisso_cor
```

O renderizador aplica essa cor como `background` do evento; a fonte usa `agenda_config_json.apresentacao_fonte`, incluindo família, tamanho, negrito, itálico, sublinhado, riscado e cor do texto. Portanto:

> **COR NÃO É STATUS FIXO.** Quando existe status com `cor_apresentacao`, o status prevalece; quando não existe, a cor é configuração visual associada ao tipo/condição do evento.

Consulta read-only ao PostgreSQL real, clínica 1, encontrou:

| Estado/condição | Cor/fonte/estilo | Configurável? | Origem | Brana runtime | EasyDental |
|---|---|---|---|---|---|
| Desmarcou | `#d9d9d9` | Sim, no item auxiliar | `item_auxiliar.cor_apresentacao` | Confirmado no banco; não isolado visualmente em evento | Não determinado |
| Não foi atendido | `#d9d9d9` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Faltou | `#ff0000` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Não permitiu o atendimento | `#d9d9d9` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Desmarcamos | `#808080` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Chegada | `#00ff00` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Em atendimento | `#008000` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Atendimento finalizado | `#006400` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| TELE-MARKETING | `#c61ad9` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Não atende nosso contato | `#ff0000` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Pós-operatório | `#8b4513` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Follow-up (pós-venda) | `#800080` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Reavaliação | `#808000` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Realizado / finalizado | `#00ff00` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Confirmou agendamento | `#00e5ef` | Sim | `item_auxiliar` | Confirmado no banco | Não determinado |
| Particular sem cor de status | `agenda_config_json.apresentacao_particular_cor`, padrão `#ffff00` | Sim, por prestador | configuração do prestador | Preview runtime confirmado | Não determinado |
| Convênio sem cor de status | `apresentacao_convenio_cor`, padrão `#0000ff` | Sim, por prestador | configuração do prestador | Preview runtime confirmado | Não determinado |
| Compromisso sem cor de status | `apresentacao_compromisso_cor`, padrão `#00e5ef` | Sim, por prestador | configuração do prestador | Preview runtime confirmado | Não determinado |

Divergência de schema encontrada: o ORM/modelo espera/normaliza `valor_int` para opções de status, mas a tabela real `item_auxiliar` não possui coluna física `valor_int`. O código também usa `codigo` como fallback; essa divergência deve ser tratada como risco de contrato antes de qualquer futura mudança, sem correção nesta fase.

### C. Drag-and-drop

**DRAG = EXISTE. CONFIRMADO NO CÓDIGO.**

Evidências em `frontend/prestadores_override.js`:

- eventos `.agenda-semana-event` recebem `draggable="true"`, `dragstart` e `dragend`;
- `dragover` calcula dia e horário destino;
- destinos válidos recebem classe visual `agenda-semana-drop-valid`; inválidos recebem `agenda-semana-drop-invalid`;
- o movimento conserva a duração original (`hora_fim - hora_inicio`), salvo fallback de um passo quando o fim não existe;
- o destino é rejeitado antes do início, depois do fim da grade ou se houver ocupante sobreposto;
- gravação usa `PUT /agenda-legado/{id}` com o payload completo do evento, incluindo data, horários, paciente, tipo, status, prestador e unidade;
- não houve execução de movimento real, porque isso persistiria alteração em dado existente.

Conclusão: drag pode mudar dia e horário; mudança de prestador/unidade não é um efeito automático do drop, pois o payload mantém os IDs do evento. Não há confirmação modal antes do PUT; a validação é visual/automática.

### D. Resize

**RESIZE = NÃO EXISTE COMO CONTRATO ENCONTRADO.**

Foram encontrados handlers de drag, `dragover`, `drop`, `mousedown` usado para menu/contexto e `window.resize` usado para esconder contexto, mas não foi encontrado handler de resize de evento, grip, alteração de altura ou endpoint específico para resize. A duração pode ser alterada pelo modal de edição via `hora_fim`.

Conclusão obrigatória para o futuro scheduler:

```text
DURAÇÃO VARIÁVEL ≠ RESIZE NA GRADE
```

### E. Conflitos

**Contrato encontrado: BLOQUEIA no drag, mas NÃO HÁ PROVA DE BLOQUEIO UNIVERSAL NO BACKEND.**

No frontend, a função `agendaSemanaBuscarOcupanteIntervalo` considera sobreposição quando:

```text
inicio_evento < fim_destino
e fim_evento > inicio_destino
```

Ela ignora o próprio ID durante movimento e rejeita o drop com `motivo="conflito"`. O backend `POST`/`PUT` de agendamento valida datas, horários, prestador e unidade, mas a inspeção da rota não encontrou uma verificação geral equivalente de sobreposição antes do commit. O banco também não possui constraint de conflito temporal.

Classificação:

- Mesmo prestador/dia/intervalo no drag: **BLOQUEIA**.
- Sobreposição parcial no drag: **BLOQUEIA**.
- Evento maior que o espaço restante: **BLOQUEIA**.
- Conflito criado por modal/API: **NÃO DETERMINADO / possível permissão**, requer teste controlado ou validação específica de rota.
- Mesma unidade/sala: **NÃO DETERMINADO**; o algoritmo encontrado filtra por data, não por sala/unidade como dimensão independente.
- Bloqueio existente: **NÃO FOI POSSÍVEL VALIDAR** em runtime porque o banco real tem zero bloqueios e não foi criado dado de teste.

### F. Encaixes

**ENCAIXE = NÃO DETERMINADO COMO CONTRATO FORMAL; não existe campo/endpoint explícito encontrado.**

Não foram encontrados `encaixe`/`encaixe_flag` no modelo `AgendaLegadoEvento`, no payload `AgendaPayload`, no DDL web ou nos endpoints. Há abertura de célula vazia por duplo clique e movimentação para qualquer slot livre, o que pode representar a prática operacional de encaixe, mas não prova um estado persistido. O futuro React não deve criar enum ou campo de encaixe por inferência.

### G. Bloqueios

**Contrato estrutural confirmado; comportamento visual completo não confirmado.** A configuração e o CRUD usam `agenda_legado_bloqueio`, com prestador, unidade, dia da semana, vigência, hora inicial/final e mensagem. A função de renderização da agenda adiciona bloqueios à coleção visual e o cálculo de horários livres considera intervalos bloqueados. O banco real tinha zero registros, portanto cor, aparência, recorrência e interação de um bloqueio real permanecem não determinados.

### H. Paciente ↔ Agenda

O fluxo está fechado no limite seguro sem gravação:

```text
Agenda modal
  -> pesquisa/seleção de paciente no menu de pacientes
  -> item.id é colocado em AgendaPayload.nro_pac
  -> nome selecionado vai para payload.nome e snapshot do evento
  -> telefones são aplicados ao evento
  -> backend grava nro_pac/nome/fones em agenda_legado_evento
  -> render usa snapshot nome; paciente atual é fallback
```

O catálogo é carregado por `GET /agenda-legado/pacientes`; o frontend também abre o menu de pacientes para seleção. O código possui fluxo para nome não encontrado, oferecendo pesquisa/cadastro, mas não foi executada criação real. A consulta real encontrou 9 eventos cujo `nro_pac` não possui paciente correspondente na mesma clínica; isso confirma risco de órfão lógico e impede que o React trate `nro_pac` como FK garantida.

Não foi comprovado nesta fase paciente inativo, alteração de paciente já persistido ou paciente presente somente no EasyDental.

### I. Vínculos lógicos e riscos

| Vínculo | Campo | Garantia atual | Evidência de risco |
|---|---|---|---|
| Paciente | `agenda_legado_evento.nro_pac` | validação/consulta da aplicação e snapshot | 9 referências sem paciente correspondente |
| Prestador | `id_prestador` | rota carrega/valida no tenant e filtros de aplicação | 0 órfãos encontrados no banco atual |
| Unidade | `id_unidade` | rota carrega/valida no tenant e filtros de aplicação | 0 órfãos encontrados no banco atual |
| Clínica | `clinica_id` | FK PostgreSQL + filtros de tenant | vínculo físico confirmado |

Impacto React: adapters e hooks devem preservar IDs lógicos, filtrar pelo tenant vindo do token e tolerar referência ausente sem fabricar cadastro. Não adicionar FK ou corrigir órfãos nesta fase.

### J. Scheduler — revisão após evidências

Requisitos comprovados agora: grade semanal segunda–sábado; slot configurável atualmente em 5 minutos; duração variável; eventos longos; cores por status/tipo/configuração; drag sem resize; conflito visual durante drag; seleção e edição por modal; bloqueios por intervalo; carregamento por janela, não por toda a série histórica; integração com toolbar e modais externos; histórico real acima de 14 mil eventos.

| Opção | Aderência | Custo/risco | Decisão atual |
|---|---|---|---|
| Implementação própria | Controle máximo, mas precisa construir grade, drag, conflito, acessibilidade e performance | Muito alto | Não recomendada como primeira opção |
| FullCalendar | Grade, navegação, drag e render customizável; resize teria de ser desabilitado/contido; conflito e modelo Brana exigem adapter | Licença/recursos comerciais devem ser verificados na versão escolhida | Candidata principal, sem instalação/decisão final |
| DayPilot | Forte aderência a scheduler e recursos; risco maior de dependência/licença e acoplamento | Validar edição/licença e custo | Segunda candidata técnica |
| React Big Calendar | Boa base de calendário React, mas exige mais customização para bloqueios, conflito, 5 minutos e semântica do Brana | Menor custo de licença, maior custo de adaptação | Terceira candidata |

Recomendação atual: **FullCalendar como candidata principal**, condicionada à verificação formal de licença/versão e a um spike posterior isolado por adapter. A decisão não deve ser transformada em instalação nesta fase. O domínio continuará independente; drag, conflito, cores, status, pacientes e APIs não podem receber tipos da biblioteca.

### K. Pendências restantes e veredito

Pendências que continuam objetivamente abertas:

1. execução navegável do EasyDental Desktop para comparar UX e regras que não estão no DDL;
2. teste seguro de conflito via modal/API, sem criar dados reais;
3. comportamento visual de bloqueio real, pois `agenda_legado_bloqueio` está vazio;
4. paciente inativo, alteração de paciente existente e pacientes somente no EasyDental;
5. captura direta de rede do navegador;
6. divergência `valor_int` ORM versus ausência de coluna real em `item_auxiliar`.

Essas pendências não deixam desconhecida uma regra crítica para desenhar a arquitetura React: drag existe, resize não foi encontrado, encaixe não é contrato formal, cores/status têm origem rastreável, duração é independente do slot e os vínculos lógicos estão explicitamente documentados. Porém a comparação de paridade EasyDental e a validação de alguns cenários de conflito/bloqueio ainda não são comprovadas.

**FASE 1 = CONCLUÍDA** para iniciar o planejamento arquitetural da Fase 2, **sem iniciar implementação**. A conclusão é limitada ao planejamento: EasyDental permanece `NÃO DETERMINADO` em UX, e nenhuma decisão de paridade visual/funcional entre os produtos deve ser tomada sem a validação Desktop pendente.
