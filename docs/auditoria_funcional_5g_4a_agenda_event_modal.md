# Auditoria funcional 5G.4A — AgendaEventModal

**Data:** 2026-08-29  
**Escopo:** auditoria read-only; nenhum save, delete ou repetição persistente foi executado.

## 1. Escopo e fontes

Fontes examinadas: implementação React, `AgendaScheduler`, `AgendaClinicaView`,
`agendaInteraction.js`, normalização/adaptador da Agenda, implementação legada
em `frontend/app.js`, modelo/rotas `backend/routes/agenda_legado_routes.py` e
`backend/models/agenda_legado.py`, além dos smoke tests autenticados já
realizados nas views Semana, Dia e Clínica.

Arquivos alterados nesta fase: somente este documento. `AgendaEventModal.jsx`,
`agendaEventModal.css`, testes, frontend legado e backend permaneceram sem
alteração.

## 2. Arquitetura funcional

Semana e Dia usam FullCalendar: `dateClick` e `eventClick` passam pelo
`isAgendaDoubleClick`, que abre o mesmo `AgendaEventModal`. Clínica usa a
grade própria `AgendaClinicaView`; desde 5G.3A-C1 seus slots e eventos passam
pelos mesmos callbacks do `AgendaScheduler` e pelo mesmo detector de `detail`.

O modal atual é local: `DataTab` e `RepeatTab` alteram apenas `draft`. O
componente não chama `fetch`; os botões `Novo`, `Elimina` e `Ok` estão
desabilitados e `Cancela` chama `onCancel`.

## 3. Matriz campo a campo

| Elemento | Legado / código | React atual | Origem/backend | New | Edit | Veredito |
|---|---|---|---|---|---|---|
| Data | readonly; slot em novo, evento em edição | `Input readOnly` | `data` | slot | `event.start` | PASS |
| Horário | texto/time editável | `Input` editável | `hora_inicio` | slot | evento | PARCIAL: efeito de save não implementado |
| Fim | controle legado oculto/derivado | calculado em `endTime` | `hora_fim` | derivado | derivado/real | PARCIAL |
| Duração | number, min 5, step 5 | `InputNumber min=5 step=5` | intervalo | config | `hora_fim-hora_inicio` | PASS local |
| min | unidade readonly | `Input readOnly` | nenhum | visual | visual | PASS |
| Sala | number | `InputNumber` | `sala` | `1` | evento | PASS local |
| Manhã/tarde/dia todo | atalho local de duração/horário | estado `period` | nenhum direto | estado local | estado resetado | PARCIAL: sem semântica legada reproduzida |
| Tipo | select 1 Paciente / 2 Compromisso | `Select` com as mesmas opções | `tipo` | Paciente | evento | PASS |
| Nome | paciente ou compromisso; busca no legado | `Input` livre | `nome`, `nro_pac` | vazio | evento | PARCIAL |
| `...` | abre pesquisa de pacientes | botão presente desabilitado | pacientes | vazio | evento | NÃO IMPLEMENTADO |
| Situação | select alimentado por status | `Select` de `statusCatalog` | `status` | vazio | evento | PASS |
| Assunto | texto/datalist no legado | `Input` | `motivo` | vazio | evento | PARCIAL |
| Telefone 1–3 | tipo + telefone editáveis | Select/Input locais | `tip_fone1`, `fone1` etc. | defaults | evento | PASS local |
| Tipo telefone | catálogo legado | Residencial, Comercial, Celular, Recado | `tip_fone*` | defaults 1–3 | evento | PARCIAL: ordem/default Recado requer conferência runtime |
| WhatsApp | ação externa condicionada | botão visual disabled | telefone | nenhum | nenhum | NÃO IMPLEMENTADO |
| Observações | textarea | `Input.TextArea` | `observ` | vazio | evento | PASS local |
| Inclusão | timestamp/usuário do registro | readonly | `time_stamp_ins`, `user_stamp_ins` | vazio | metadata se normalizada | PARCIAL |
| Alteração | timestamp/usuário da alteração | readonly | `time_stamp_upd`, `user_stamp_upd` | vazio | metadata se normalizada | PARCIAL |

## 4. Períodos

No legado, os três botões são atalhos locais ligados a
`agendaLegadoAplicarDuracaoPeriodo("manha"|"tarde"|"dia")`, alterando o
intervalo horário/duração conforme a escala. Não são um campo persistido
separado. O React atual apenas grava `draft.period` com o rótulo clicado; não
recalcula `startTime`, `duration` ou `endTime`. Portanto os três controles são
**PARCIAL/DIVERGENTE** funcionalmente, embora a apresentação e os handlers
locais estejam preservados.

## 5. Tipo, Nome e pesquisa

O legado oferece `Paciente` (`1`) e `Compromisso` (`2`). O botão de pesquisa
usa a lista de pacientes e, no legado, pode preencher nome, telefones e
identificador do paciente. O React exibe o botão `...`, porém ele está
desabilitado e não há autocomplete, busca ou preenchimento de `nro_pac`.

Para `Tipo=Paciente`, o React mantém `name` e `patientId` no draft, mas não
implementa a relação de pesquisa. Para `Tipo=Compromisso`, mantém texto livre,
sem regra funcional adicional comprovada.

## 6. Situação e Assunto

`statusCatalog` vem de `GET /agenda-legado/status-agendamento`; o React
preserva os valores internos e labels recebidos. O campo visual é editável
localmente. `Assunto` corresponde a `motivo`; a rota legada também expõe
`GET /agenda-legado/assuntos-compromisso`, mas o modal React atual não carrega
esse catálogo nem usa datalist. Classificação: Situação PASS; Assunto PARCIAL.

## 7. Telefones e WhatsApp

O modelo possui exatamente `tip_fone1/fone1`, `tip_fone2/fone2` e
`tip_fone3/fone3`. O backend também expõe `GET /agenda-legado/tipos-fone` e
`/tipos-contato`. O React usa quatro labels locais (`Residencial`,
`Comercial`, `Celular`, `Recado`) e três linhas. Em novo, defaults são
Residencial/Celular/Comercial; em edição, os valores vêm do metadata do
evento. Os Inputs são editáveis localmente. O botão WhatsApp é visual e
disabled; a ação/normalização/URL do legado não está implementada.

## 8. Inclusão, alteração e footer

O backend grava timestamps e usuários de inclusão/alteração, mas o React só
preenche esses campos se existirem na metadata (`inclusao`, `created_at`,
`alteracao`, `updated_at`). Sem metadata, permanecem vazios.

No legado, `Novo` troca o editor para novo, `Elimina` conduz confirmação e
DELETE, e `Ok` valida e persiste. No React atual, `Novo`, `Elimina` e `Ok`
estão disabled e não fazem nada; `Cancela` fecha e descarta o draft. Assim:

- Novo: NÃO IMPLEMENTADO;
- Elimina: NÃO IMPLEMENTADO;
- Ok new: NÃO IMPLEMENTADO;
- Ok edit: NÃO IMPLEMENTADO;
- Cancela: PASS para descarte local/zero write.

## 9. Repete agendamento

No legado, a aba cria novas ocorrências a partir do evento-base; não é uma
edição de uma série abstrata. O payload é `AgendaRepeticaoPayload`:

```text
item_id, modo, sobrepor, qtd_dias, qtd_semanas, dia_semana,
dia_mes, qtd_meses
```

Modos: `dias`, `semanas`, `meses`; dias da semana são segunda a sábado;
`sobrepor` controla conflitos. A rota é `POST /agenda-legado/repetir`.

O React reproduz somente estado visual/local: checkbox, radios, quantidades,
dia da semana e sobreposição. Não envia o payload nem cria ocorrências.
Classificação: controles locais PASS; persistência NÃO IMPLEMENTADA.

## 10. Backend e validações

`AgendaPayload` contém:

```text
data, hora_inicio, hora_fim, sala, tipo, nro_pac, nome, motivo, status,
observ, tip_fone1, fone1, tip_fone2, fone2, tip_fone3, fone3,
id_prestador, id_unidade
```

`POST /agenda-legado` e `PUT /agenda-legado/{item_id}` exigem data válida,
`hora_inicio > 0`, prestador e unidade resolvidos, e rejeitam conflitos de
intervalo. O fim é normalizado pelo backend. O modelo aceita campos nulos
para a maioria dos dados, mas `data`, `id_prestador`, `id_unidade` e
`hora_inicio` são estruturalmente obrigatórios no registro. `DELETE
/agenda-legado/{item_id}` remove o evento após carregamento por tenant.

O endpoint de repetição valida o evento-base, intervalo e conflitos; com
`sobrepor=true` aplica a política de sobreposição. Nenhum desses endpoints
mutáveis foi chamado nesta auditoria.

| UI | Payload | Obrigatório no backend | Nullable | Conversão |
|---|---|---|---|---|
| Data | `data` | sim | não no modelo | string ISO |
| Horário | `hora_inicio` | sim | não | minutos inteiros |
| Fim/duração | `hora_fim` | intervalo normalizado | sim | minutos |
| Sala | `sala` | não | sim | int |
| Tipo | `tipo` | não | sim | int |
| Paciente | `nro_pac` | não no schema | sim | int |
| Nome | `nome` | não | sim | trim |
| Situação | `status` | não | sim | int |
| Assunto | `motivo` | não | sim | trim |
| Telefones | `tip_fone*`, `fone*` | não | sim | int/string |
| Contexto | `id_prestador`, `id_unidade` | resolvidos | schema não nulo | int |

## 11. Inventário do React atual

**Funcional/local:** data, hora, duração, sala, tipo, nome, situação, assunto,
telefones, observações, inclusão/alteração read-only, tabs, repetição local,
cancelamento, modo new/edit e isolamento de drafts.

**Parcial:** fim derivado, períodos, assunto por catálogo, timestamps e
relação paciente/número.

**Visual/stub:** botão de pesquisa, WhatsApp e footer de gravação/exclusão.

**Não implementado:** POST, PUT, DELETE, POST de repetição, autocomplete de
paciente e confirmação de exclusão.

## 12. Divergências registradas

1. Períodos React apenas marcam `draft.period`; legado altera intervalo.
2. Botão `...` de pesquisa está disabled e não abre pesquisa.
3. WhatsApp está disabled e não executa a ação do legado.
4. Footer não persiste nem exclui; é stub congelado por contrato atual.
5. React não carrega/usa catálogo de assuntos de compromisso.
6. Inclusão/alteração dependem de metadata já normalizada.
7. Repetição React é somente local; endpoint não está ligado.
8. Edição diária populada ainda não foi validada no runtime disponível.

**Quantidade total:** 8 divergências, sendo 7 funcionais e 1 de cobertura de
validação.

## 13. Próximas fases recomendadas

- **5G.4B:** implementar payload e validação de `Ok` para novo, após contrato
  explícito de autorização.
- **5G.4C:** implementar edição via PUT e refresh controlado.
- **5G.4D:** pesquisa de paciente, `nro_pac` e preenchimento de contatos.
- **5G.4E:** períodos e repetição persistente, incluindo conflitos.
- **5G.4F:** exclusão/WhatsApp e auditoria de permissões.

## 14. Validações desta auditoria

- Alteração visual: **NÃO**.
- Alteração funcional: **NÃO**.
- Writes: POST/PUT/PATCH/DELETE/POST repetir = **0**.
- Suíte focada: **51 PASS / 0 FAIL**.
- Build: **PASS**, com warning não bloqueante de chunks grandes.
- Worktree: preservado; sem reset, clean, checkout, restore, stash, commit,
  push ou deploy.

## Veredito

O contrato local do modal, o pipeline React e o contrato de leitura/backend
foram mapeados. As divergências acima foram documentadas e não corrigidas.
Como os comportamentos de períodos, pesquisa, WhatsApp, footer persistente e
repetição ainda não são equivalentes ao legado, e a edição diária populada não
foi observável nesta execução:

**5G.4A = INCOMPLETA.**  
**Pronto para 5G.4B = NÃO**, até decisão explícita sobre as divergências.

## 15. 5G.4A-R1 — Fechamento das lacunas

Esta seção complementa a auditoria original. A investigação foi read-only:
nenhum POST, PUT, PATCH, DELETE ou POST de repetição foi executado, e nenhum
arquivo de código ou teste foi alterado.

### L1 — Manhã, tarde e dia todo

O legado usa `agendaLegadoAplicarDuracaoPeriodo(periodo)`, ligado aos três
botões em `frontend/app.js`. O handler consulta
`agendaLegadoPeriodoIntervaloMs(periodo, cfg)`, valida disponibilidade por
data, altera a duração para `info.durMin` e chama
`agendaLegadoSincronizarFimPorDuracao()`. A origem é a configuração do
prestador e a data do modal. Sala, Tipo e outros campos não são alterados por
este handler.

| Controle | Início/fim | Duração | React |
|---|---|---|---|
| Manhã | derivados de `PeriodoIntervaloMs('manha', cfg)` | `info.durMin` | parcial: grava apenas `draft.period` |
| Tarde | derivados de `PeriodoIntervaloMs('tarde', cfg)` | `info.durMin` | parcial |
| Dia todo | derivados de `PeriodoIntervaloMs('dia', cfg)` | `info.durMin` | parcial |

Os valores numéricos finais de início/fim não foram observados nesta rodada;
ficam **NÃO COMPROVADOS** como números, embora handler e origem estejam
comprovados no código.

### L2 — Tipo

Catálogo comprovado: `1 = Paciente` e `2 = Compromisso`; default novo é
Paciente. No legado, Compromisso desabilita e limpa Nome, remove o vínculo do
paciente e desabilita Situação; Paciente reabre o foco do Nome. A regra está
em `agendaLegadoAplicarBloqueioPorTipo`. React preserva as opções e o binding,
mas não reproduz esses efeitos de habilitação. **Contrato comprovado; React
parcial.**

### L3 — Nome e botão `...`

O handler legado é `agendaLegadoAbrirMenuPacientesParaRetorno(prefill)`, ligado
ao `#agenda-legado-modal-nome-btn`. A fonte é `GET /agenda-legado/pacientes`,
com dados do modelo `Paciente`. O fluxo seleciona um paciente e pode preencher
vínculo, nome e telefones; as colunas e todos os campos preenchidos não foram
confirmados em runtime seguro. O React mantém o botão disabled e não possui
busca/autocomplete. **Legado parcial; React não implementa.**

### L4 — Assuntos

Existe `GET /agenda-legado/assuntos-compromisso`, com opções retornadas por
`_assuntos_compromisso_raw_options`; o legado sincroniza a lista ao trocar
Tipo por `agendaLegadoSyncMotivoOptions`. React não consulta esse endpoint e
mantém Assunto como Input livre. Catálogo final e regra completa por Tipo:
**PARCIALMENTE COMPROVADOS**.

### L5 — Telefones

`agenda_legado_evento` mantém snapshot próprio dos três pares
`tip_foneN/foneN`, também presentes em `AgendaPayload`. O legado copia contatos
ao selecionar paciente e permite editar os valores do agendamento. Não foi
comprovado se a edição também altera o cadastro do paciente. Tipos canônicos
do conversor: Residencial=`1`, Comercial=`2`, Celular/Fax=`4`, Recado/Outro=`5`.
React implementa três linhas localmente, com defaults
Residencial/Celular/Comercial. **Snapshot comprovado; efeito no cadastro não
comprovado.**

### L6 — WhatsApp

O legado liga cada botão a `fichaAbrirWhatsAppComTelefone(modalTelefone |
modalFone2 | modalFone3)`. A escolha é por linha e a normalização/URL ficam
nessa função compartilhada. A ação não foi disparada. React possui somente
botão visual disabled; não foi localizado utilitário React equivalente.

### L7 — Inclusão/Alteração

O backend grava `user_stamp_ins`, `time_stamp_ins`, `user_stamp_upd` e
`time_stamp_upd`. O formato textual exibido no legado e a combinação exata de
usuário/timestamp permanecem **NÃO COMPROVADOS**. React mostra campos
readonly; em novo ficam vazios e em edit dependem de metadata
`inclusao/created_at` e `alteracao/updated_at`.

### L8/L9 — Novo e Elimina

O legado `modalNovo` chama `agendaLegadoAbrirModal('novo')` e não grava
sozinho. `Elimina` exige seleção, confirmação e usa
`DELETE /agenda-legado/{item.id}`; após sucesso limpa a seleção e recarrega a
agenda. React mantém ambos disabled. A identidade de exclusão é `id`, não
`myeasy_id`/`palm_id`. **Contratos legados comprovados estaticamente; React
não implementa.**

### L10/L11 — Ok new/edit

`agendaLegadoSalvarModal` normaliza horário, sincroniza fim, resolve nome,
valida data/hora e faixa de expediente e chama POST em novo ou PUT em edit.
Conflito `409` abre o diálogo de duração permitida; depois a agenda é
recarregada. O payload é `AgendaPayload` conforme a seção 10. O PUT substitui
os campos de negócio recebidos; stamps, `palm_id`, `myeasy_id` e `clinica_id`
ficam fora do modal e são responsabilidade do backend. Um futuro React deverá
preservar esses campos invisíveis; isso é bloqueio semântico para writes.
React não implementa nenhum dos dois saves.

### L12 — Repetição

O legado cria novas ocorrências a partir do evento-base via
`POST /agenda-legado/repetir`, com `item_id`, `modo`, `sobrepor`, `qtd_dias`,
`qtd_semanas`, `dia_semana`, `dia_mes` e `qtd_meses`. Modos são dias,
semanas e meses; a UI oferece segunda a sábado, sem Domingo. `sobrepor=false`
rejeita conflitos; `true` usa `_aplicar_sobreposicao_intervalo` para remover ou
ajustar segmentos. O algoritmo geral e o payload estão comprovados; o
tratamento de meses sem o dia solicitado, incluindo fevereiro/29/30/31, fica
**NÃO COMPROVADO**. React reproduz apenas controles locais.

### L13 — Agenda Diária edit

Foi possível abrir/cancelar new na Agenda Diária, mas não havia evento
populado disponível no runtime observado para uma validação separada de edit.
Resultado: **NÃO TESTÁVEL nesta execução**, sem fabricar registro.

## 16. Matriz R1

| ID | Legado | Backend | React atual | Implementação necessária |
|---|---|---|---|---|
| L1 | handler/origem comprovados; valores numéricos pendentes | agenda_config | parcial | 5G.4B3 |
| L2 | comprovado | `tipo` | parcial | 5G.4B1 |
| L3 | fluxo parcial | `/pacientes` | ausente | 5G.4B1 |
| L4 | parcial | `/assuntos-compromisso` | ausente | 5G.4B2 |
| L5 | snapshot comprovado | campos no payload | local | 5G.4B4 |
| L6 | handler comprovado | sem rota própria | ausente | 5G.4B4 |
| L7 | stamps comprovados; exibição pendente | stamps | parcial | 5G.4B5 |
| L8 | handler comprovado | n/a | ausente | 5G.4B6 |
| L9 | DELETE comprovado | rota existente | ausente | 5G.4B6 |
| L10 | POST/validações comprovados | `AgendaPayload` | ausente | 5G.4C |
| L11 | PUT/validações comprovados | full replacement | ausente | 5G.4D |
| L12 | payload/conflitos comprovados; meses pendente | rota existente | local | 5G.4F |
| L13 | não testado | leitura existente | não aplicável | smoke posterior |

## 17. Contratos ainda não comprovados e bloqueadores

- C1: números efetivos dos intervalos de Manhã/Tarde/Dia todo;
- C2: seleção completa de paciente e campos preenchidos pelo menu;
- C3: catálogo final de assuntos em runtime;
- C4: normalização/URL do WhatsApp;
- C5: formato exibido de Inclusão/Alteração;
- C6: regra para meses sem o dia solicitado;
- C7: edição populada na Agenda Diária.

Bloqueadores reais para iniciar writes: C2, C4, C5, C6 e a estratégia de
preservação de campos invisíveis no PUT. Ausência de implementação, por si
só, foi classificada como backlog e não como incerteza.

## 18. Ordem recomendada

5G.4B1 Tipo/paciente/pesquisa → 5G.4B2 Compromisso/assuntos → 5G.4B3
períodos → 5G.4B4 telefones/WhatsApp → 5G.4B5 Inclusão/Alteração → 5G.4B6
footer/validações → 5G.4C POST → 5G.4D PUT → 5G.4E DELETE → 5G.4F repetição.

## 19. Resultado R1

Documentação alterada: somente este arquivo. Código, CSS, backend e testes:
não alterados. Suíte baseline: **51 PASS / 0 FAIL**. Build baseline: **PASS**,
com warning não bloqueante de chunks grandes. Writes: **0**.

**5G.4A-R1 = INCOMPLETA**: as lacunas foram separadas entre contrato
comprovado, contrato parcial e implementação ausente, mas C1–C7 permanecem
pendentes. **5G.4A = INCOMPLETA.** **Pronto para 5G.4B = NÃO.**

## 20. 5G.4A-R2 — Fechamento final dos contratos semânticos

Data: 2026-08-30. Esta rodada foi somente read-only. A aba React estava
autenticada; a aba EasyDental legada estava com “Sessão expirada, faça login
novamente”. Logo, runtime legado não observado é explicitamente marcado como
não comprovado.

### P1 — Manhã, Tarde e Dia todo

`agendaLegadoAplicarDuracaoPeriodo(periodo)` chama
`agendaLegadoPeriodoIntervaloMs(periodo, cfg)` e depois
`agendaLegadoSincronizarFimPorDuracao()`. A configuração vem de
`agendaLegadoConfigAtualModal()`, priorizando configuração da agenda, mapa do
prestador e configuração padrão. Manhã usa `manha_inicio/manhã_fim`; Tarde usa
`tarde_inicio/tarde_fim`; Dia todo usa `min(inícios)` até `max(fins)`. A duração
é a diferença em minutos e o fim é recalculado. Sala e Tipo não são alterados.
Os números de um contexto real não puderam ser observados com a sessão legada
expirada. Contrato: **PARCIAL**; impacto: somente B3; React: **PARCIAL** (guarda
`draft.period`, sem recalcular intervalo).

### P2 — Pesquisa de paciente

`agendaLegadoAbrirMenuPacientesParaRetorno(prefill)` usa
`GET /agenda-legado/pacientes`; a seleção chama `agendaLegadoSetPacienteVinculo`
e `agendaLegadoAplicarContato`. São copiados vínculo/número, nome, três números
de telefone e seus tipos. O endpoint atual entrega `id`, `nome`,
`nome_completo`, `tipo_fone1..3`, `fone1..3`, além de dados auxiliares. Portanto
é suficiente para o fluxo comprovado por código/API. Runtime de seleção ficou
pendente por sessão expirada. Contrato: **COMPROVADO por código/API**; impacto:
não bloqueia B1; React: **PARCIAL**, pois `...`/pesquisa não estão implementados.

### P3 — Assuntos de compromisso

O legado sincroniza o catálogo ao trocar para Compromisso, chamando a busca de
assuntos. `GET /assuntos-compromisso` retorna itens com `id`, `codigo`,
`descricao`, `ordem` e `valor_int`, deduplicados por descrição e ordenados pela
ordem de extração. Não há flag ativo/inativo nesse retorno. Quantidade e lista
apresentada não puderam ser confirmadas em runtime legado. Contrato: **PARCIAL**;
impacto: somente B2; React: **PARCIAL** (texto livre). Endpoint React futuro:
`GET /assuntos-compromisso`, label `descricao`, value a definir conforme o
contrato do legado.

### P4 — WhatsApp

`fichaAbrirWhatsAppComTelefone(inputEl)` é ligado individualmente às linhas 1,
2 e 3. Remove tudo que não seja dígito; para 10 ou 11 dígitos prefixa `55`; não
adiciona DDD; abre `https://wa.me/${numeroBr}` em nova janela. Não foi encontrada
implementação equivalente no React. Contrato: **COMPROVADO**; impacto: não
bloqueia B4; React: **NÃO IMPLEMENTA**. Nenhuma comunicação foi disparada.

### P5 — Inclusão e Alteração

O modelo possui `user_stamp_ins`, `time_stamp_ins`, `user_stamp_upd` e
`time_stamp_upd`; `_to_dict()` expõe apenas os dois timestamps em ISO 8601,
sem usuário e sem os nomes `inclusao/alteracao` usados como fallback no React.
O formato literal exibido no modal legado não foi observado por sessão expirada.
Contrato: **PARCIAL**; impacto: somente B5; API suficiente para reproduzir o
contrato visual: **NÃO**; React: **PARCIAL**.

### P6 — Meses sem o dia solicitado

`_datas_repeticao()` usa `_ultimo_dia_mes()` e cria
`date(ano, mês, min(dia_mes, último_dia))`. Assim, 29/02 em ano não bissexto,
30/02 e 31/02 resultam no último dia de fevereiro; 31/04, 31/06, 31/09 e 31/11
resultam no dia 30. Depois aplica a normalização mensal de domingo e remove
duplicidades. O endpoint de repetição usa esse algoritmo; não foi executado.
Equivalência com o legado não pôde ser confirmada sem sessão legada. Contrato
backend: **COMPROVADO**; legado × backend: **NÃO COMPROVADO**; impacto: somente
5G.4F/persistência.

### P7 — Edição populada na Agenda Diária

Nenhum evento foi criado ou alterado. A edição diária populada não foi testável
nesta rodada: a aba legada estava expirada e não havia evento seguro já aberto
para o teste solicitado. Contrato: **NÃO COMPROVADO**; impacto: pendência de
homologação, sem bloqueio das subfases B1–B5.

### Matriz, dependências e liberação

| Pendência | Contrato | Impacto | React atual | Liberação |
|---|---|---|---|---|
| P1 Períodos | PARCIAL | B3 | PARCIAL | B3 não |
| P2 Paciente | COMPROVADO por código/API | não bloqueia B1 | PARCIAL | B1 sim |
| P3 Assuntos | PARCIAL | B2 | PARCIAL | B2 não |
| P4 WhatsApp | COMPROVADO | não bloqueia B4 | não implementa | B4 sim |
| P5 Stamps | PARCIAL | B5 | PARCIAL | B5 não |
| P6 Repetição | backend comprovado; comparação pendente | 5G.4F | fora do escopo | não |
| P7 Diária edit | NÃO COMPROVADO | homologação | não aplicável | não bloqueia B1–B5 |

Dependências: P1→B3; P2→B1; P3→B2; P4→B4; P5→B5; P6→Persistência/5G.4F;
P7→smoke de edição diária. Não há bloqueador real para B1 ou B4. B2, B3 e B5
aguardam catálogo, números/contexto de períodos e formato dos stamps. POST,
PUT, DELETE e REPETIR permanecem fora desta fase e não estão prontos.

Ordem recomendada: **5G.4B1**, **5G.4B4**, fechar P3 e executar **B2**, fechar
P1 e executar **B3**, fechar P5 e executar **B5**; depois 5G.4C POST, 5G.4D
PUT, 5G.4E DELETE e 5G.4F REPETIR.

### Fechamento R2

Somente este documento foi alterado; JSX, CSS, backend, testes e dados: zero.
Writes: POST=0, PUT=0, PATCH=0, DELETE=0, POST repetir=0. **5G.4A-R2 =
INCOMPLETA** e **5G.4A = INCOMPLETA**. Primeiras subfases liberadas:
**5G.4B1 Tipo/Paciente/Pesquisa** e **5G.4B4 Telefones/WhatsApp**. A
homologação visual/funcional permanece pendente onde indicado.

## 21. 5G.4B1-R2 — Correção do Menu de pacientes

Implementação limitada ao fluxo de pesquisa de pacientes. O modal principal do
AgendaEventModal e seu CSS não foram redesenhados. O modal de pesquisa passou a
usar componente e CSS próprios, seguindo a estrutura comprovada no legado:
“Menu de pacientes”, filtros superiores, busca por Nome/Número, barra
alfabética, tabela Nome/Número, seleção de linha e footer com total, Novo...,
Ok e Cancela.

Arquivos envolvidos:

- `frontend-react/src/features/agendaSemanal/components/AgendaPatientSearchModal.jsx`;
- `frontend-react/src/features/agendaSemanal/components/agendaPatientSearch.css`;
- `frontend-react/src/features/agendaSemanal/api/agendaPatientsApi.js`;
- `frontend-react/src/features/agendaSemanal/components/AgendaEventModal.jsx`;
- `frontend-react/tests/agendaEventModal.test.mjs`.

O endpoint permanece `GET /agenda-legado/pacientes?limit=5000`; backend = não
alterado. A seleção usa o ID real e preenche `patientId`, `name`, três telefones
e seus tipos. A troca de paciente substitui o snapshot inteiro. Cancelar ou
fechar o modal de pesquisa não altera o draft. `Novo...` permanece exibido,
porém desabilitado, pois o cadastro de paciente está fora desta subfase.

Runtime: o modal React abriu com o título correto, estrutura horizontal,
alfabeto, tabela sem paginação e footer. A resposta disponível no contexto de
teste não apresentou pacientes, portanto seleção real, confirmação Ok e
substituição A→B não foram homologadas. Semana/Dia/Clínica compartilham o
mesmo AgendaPatientSearchModal por meio do AgendaEventModal.

Testes: 54 PASS / 0 FAIL. Build: PASS, com warning existente de chunks grandes.
Writes: POST=0, PUT=0, PATCH=0, DELETE=0, repetir=0. AgendaEventModal visual
principal preservado; `agendaEventModal.css` não alterado.

**5G.4B1-R2 = INCOMPLETA** até haver pacientes retornados no runtime e serem
confirmados seleção, Ok local, cancelamento, A→B e os fluxos nas três views.

## 5G.4B1-R4 — investigação forense do duplo clique

A reprodução visual do problema continuou possível: o duplo clique montou
“Edita agendamento” e, em seguida, “Menu de pacientes”. Entretanto, a prova
forense exigida não foi obtida. A automação CDP permitiu observar os dois
diálogos, mas a sessão expôs `window` e `document` não extensíveis, impedindo
anexar um coletor persistente de eventos; uma tentativa de reconexão expirou
antes de disponibilizar a sequência cronológica.

Assim, não foi comprovado o `event.type`, `detail`, `target`,
`currentTarget`, coordenadas, `elementFromPoint` no instante do segundo
clique, nem o stack do handler que altera `patientSearchOpen`. A hipótese
anterior de hit-test do segundo clique permanece não comprovada por esses
dados e não foi aplicada nova correção em R4.

O código permanece apenas com a proteção introduzida em R3; não houve nova
alteração funcional, visual, CSS ou backend nesta investigação. Testes locais
seguem em 55 PASS / 0 FAIL e o build segue PASS com warning de chunks grandes.
Writes permanecem zerados. R4 fica BLOQUEADA até uma sessão de automação que
permita capturar a sequência real de eventos e validar Semana, Dia e Clínica.

## 5G.4B1-R3 — regressão de abertura do Menu de pacientes

Reprodução: no runtime autenticado, o duplo clique abriu simultaneamente
“Edita agendamento” e “Menu de pacientes”. O editor estava aberto, mas o
segundo disparo do duplo clique alcançava o botão `...` durante a montagem do
editor, abrindo a pesquisa como efeito colateral.

Correção cirúrgica em `AgendaEventModal.jsx`: `patientSearchOpen` passou a ser
estado controlado pelo `AgendaEventModal` pai, é resetado para `false` a cada
abertura/troca de editor e o botão `...` só abre a pesquisa em um clique
explícito, após a janela de montagem do editor. Cancelar/X/selecionar na
pesquisa alteram somente `patientSearchOpen`; o editor permanece aberto.

Não houve alteração em `agendaEventModal.css`,
`agendaPatientSearch.css`, backend ou API. Nenhuma persistência foi executada:
POST=0, PUT=0, PATCH=0, DELETE=0 e POST repetir=0.

Testes: suíte Agenda 54 PASS / 0 FAIL antes da validação final do bundle.
Runtime: a reprodução confirmou o estado regressivo antes; a validação final
após a correção ficou limitada por timeout do comando CDP, devendo ser repetida
manualmente em Semana, Dia e Clínica. A homologação funcional permanece
pendente.

## 5G.4B1-V2 — reimplementação segura a partir do baseline

A pesquisa de pacientes foi reintroduzida modularmente após o rollback. O
`AgendaPatientSearchModal` utiliza montagem tardia: enquanto o
`AgendaEventModal` está aberto sem intenção explícita, o componente de
pesquisa não é montado no DOM. O único gatilho é o clique no botão `...` quando
Tipo=Paciente.

Foram recriados `AgendaPatientSearchModal.jsx`, `agendaPatientSearch.css` e
`agendaPatientsApi.js`, e a integração mínima foi feita em
`AgendaEventModal.jsx`. O endpoint permanece
`GET /agenda-legado/pacientes?limit=5000`; backend e `agendaEventModal.css` não
foram alterados. A seleção atualiza o snapshot de paciente e telefones, Ok ou
duplo clique da linha retornam ao editor, e Cancela/X fecham somente a pesquisa.

Testes: 53 PASS / 0 FAIL. Build: PASS, com warning de chunks grandes. Writes:
POST=0, PUT=0, PATCH=0, DELETE=0 e repetir=0. A validação runtime autenticada
nas três views e a confirmação de seleção real permanecem pendentes porque a
sessão CDP foi resetada após timeout; portanto V2 não deve ser considerada
homologada até essa validação manual.

## 5G.4B1-RB1 — rollback para baseline pré-B1

A cadeia B1/R2/R3/R4 foi suspensa por regressão persistente: o duplo clique
montava o editor e o Menu de pacientes aparecia sobre ele. Os artefatos de
pesquisa eram exclusivos da B1 e não possuíam consumidores fora desse fluxo.

O rollback removeu a integração de pesquisa de `AgendaEventModal.jsx`,
restaurou o botão `...` como disabled e removeu `AgendaPatientSearchModal.jsx`,
`agendaPatientSearch.css` e `agendaPatientsApi.js`. Foram removidos apenas os
testes específicos da pesquisa; os testes anteriores de editor, drafts e
interação foram preservados.

Não houve alteração no shell da Agenda, FullCalendar, `AgendaClinicaView`,
`agendaEventModal.css` ou backend. A validação runtime final nas três views
deve ser repetida após recompilação; portanto este documento não considera o
rollback homologado sem essa prova.

## 5G.4B1-V2.R1 — ajuste visual da primeira linha e régua alfabética

Alteração exclusivamente em `agendaPatientSearch.css`. A primeira linha foi
normalizada para labels empilhados com combos alinhados: antes a combo de
Visualização começava 22px abaixo das demais; depois as três combos ficaram no
mesmo `top` (188px). A régua tinha 27 itens em duas/mais linhas; depois passou
a `flex-wrap: nowrap`, 27 controles uniformes de aproximadamente 20,66px ×
26px, todos no mesmo `top` (290px) dentro do container de 610px.

Não houve alteração funcional, de API, backend, modal principal, tabela ou
footer. Os cliques `*`, `A`, `M` e `Z` continuaram mudando o estado ativo.
Testes: 53 PASS / 0 FAIL. Build: PASS, com warning de chunks grandes. Writes:
POST=0, PUT=0, PATCH=0, DELETE=0 e repetir=0. Homologação visual permanece
pendente.

Runtime V2 posterior: após reconexão da aba autenticada, o duplo clique DOM no
evento/slot livre abriu somente `Edita agendamento`; `AgendaPatientSearchModal`
estava ausente do DOM. O botão `Pesquisar paciente` estava habilitado para o
draft Paciente; clique explícito abriu o segundo modal, com 1.631 linhas
renderizadas e total dinâmico. `Cancela` fechou somente a pesquisa e manteve o
editor aberto. Semana foi comprovada nesta sessão; Dia e Clínica ainda
precisam do smoke equivalente.
