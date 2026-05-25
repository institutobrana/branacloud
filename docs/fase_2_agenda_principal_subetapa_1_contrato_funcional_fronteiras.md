# Fase 2 - Agenda principal - Subetapa 1 - Contrato funcional e fronteiras documentais

## 1. Contexto
Esta subetapa inicia documentalmente a frente `Agenda principal` dentro da Fase 2 de modularizacao/refatoracao do frontend.

A frente `Agenda de contatos` foi consolidada anteriormente e permanece pausada/consolidada. Esta etapa nao reabre essa frente e nao autoriza recortes funcionais.

O objetivo aqui e apenas registrar o contrato funcional inicial, mapear fronteiras, localizar dependencias e definir o primeiro recorte documental seguro antes de qualquer patch.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_15_consolidacao_pos_recortes.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/prestadores_agenda_apresentacao_force.js`
- `frontend/prestadores_agenda_apresentacao_patch.js`
- `frontend/prestadores_agenda_fonte_color_patch.js`
- `frontend/prestadores_agenda_hotfix.js`
- `frontend/prestadores_agenda_refino.js`
- `frontend/prestadores_agenda_utf_fix.js`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/agenda_contatos_routes.py`

## 3. Confirmacao do commit anterior
Confirmado o commit de consolidacao da frente anterior:

- `3823a201af76d84cd8371082e2864f22fe0b25f6` - `Consolida recortes de agenda contatos`

Documento consolidado naquele marco:

- `docs/fase_2_agenda_contatos_subetapa_15_consolidacao_pos_recortes.md`

## 4. Diretriz core/comum
Todos os modulos da modularizacao/refatoracao devem ser tratados como `core / comum`.

Regra aplicada nesta etapa:
- nao classificar por area profissional;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional;
- nao usar diferenca de area como criterio de recorte.

## 5. Contrato funcional inicial da Agenda principal
A `Agenda principal` e a superficie funcional que concentra a navegacao e o fluxo principal de agenda do sistema, incluindo:

- abertura da agenda do dia;
- abertura da agenda da semana;
- abertura do proximo agendado;
- quadro de avisos da agenda;
- configuracao de agendas;
- apoio de modal, selecao, renderizacao e impressao da agenda;
- integracao com recorrencia e com Google Calendar quando configurado;
- uso de filtros e combos de prestador, unidade, especialidade e status;
- dependencia operacional com paciente, prestador, unidade e tenant da clinica.

Contrato inicial desta subetapa:
- a frente e tratada como um conjunto funcional unico de agenda;
- o primeiro recorte e apenas documental;
- nenhum helper foi escolhido para extracao;
- nenhuma fronteira foi autorizada para patch;
- `Agenda de contatos` fica fora deste recorte por estar consolidada.

## 6. Fronteiras do que pertence ao modulo
Pertence ao modulo `Agenda principal`:

- menu visivel de agenda do dia;
- menu visivel de agenda da semana;
- menu visivel de proximo agendado;
- menu visivel de quadro de avisos;
- menu visivel de agendas/configuracao de agendas;
- painel de agenda da semana;
- painel de agenda legado;
- modais, selecao, filtros, renderizacao e carregamento destes fluxos;
- repeticao de agendamentos;
- integracao com Google Calendar;
- carregamento de prestadores, unidades, especialidades, status e pacientes usados pela agenda;
- vinculos que dependem de `clinica_id`.

## 7. Fronteiras do que NAO pertence ao modulo
Nao pertence ao primeiro recorte da `Agenda principal`:

- `Agenda de contatos`, pois foi consolidada e permanece pausada;
- qualquer mudanca de texto visivel, label, placeholder ou mojibake;
- qualquer alteracao de backend, banco, schema, migration, seed, endpoint ou permissao;
- qualquer implementacao de multiarea;
- qualquer separacao por area profissional;
- qualquer novo arquivo em `frontend/js/modules` sem autorizacao posterior;
- qualquer reabertura documental da frente `Agenda de contatos` nesta etapa;
- qualquer tentativa de tratar `Agenda principal` como area isolada do contexto core/comum.

## 8. Mapa frontend

### 8.1 Telas e menus visiveis
Os itens visiveis ligados a agenda no `frontend/index.html` sao:

- `agenda-dia`
- `agenda-semana`
- `agenda-proximo`
- `agenda-contatos`
- `agenda-avisos`
- `config-agendas`

Esses itens aparecem no mesmo grupo visual de navegacao, mas nao representam o mesmo nivel de fronteira funcional.

### 8.2 Prefixos e funcoes encontrados em `frontend/app.js`
Prefixos e blocos relevantes encontrados:

- `agendaSemana*`
- `agendaLegado*`
- `agenda*` como orquestracao de menu e abertura
- `agendaContatos*` apenas como fronteira consolidada, fora do primeiro recorte

Funcoes representativas da `Agenda principal` encontradas em `frontend/app.js`:

- `agendaSemanaEnsureUI`
- `agendaSemanaAbrir`
- `agendaSemanaAbrirEmAbaUnica`
- `agendaSemanaCarregarEventos`
- `agendaSemanaRenderEstrutura`
- `agendaSemanaRenderEventos`
- `agendaSemanaImprimir`
- `agendaSemanaAbrirModalNovo`
- `agendaLegadoEnsureUI`
- `agendaLegadoAbrir`
- `agendaLegadoCarregar`
- `agendaLegadoCarregarProximo`
- `agendaLegadoAbrirModal`
- `agendaLegadoSalvarModal`
- `agendaLegadoExcluir`
- `agendaLegadoCarregarCombos`
- `agendaLegadoBuscarStatusAuxiliares`
- `agendaLegadoCarregarContatos`
- `agendaLegadoAplicarContato`
- `agendaLegadoVincularEventos`
- `menuActionModule`
- `agenda-dia`, `agenda-semana`, `agenda-proximo`, `agenda-avisos`, `config-agendas` como rotas de menu dentro do handler

Observacao documental:
- o conjunto `agendaSemana*` aparece como superficie da agenda do dia/semana;
- o conjunto `agendaLegado*` concentra o fluxo legado e o proximo agendado;
- a agenda usa compartilhamento de estado e componentes comuns entre esses fluxos.

### 8.3 Ausencia ou presenca de arquivo em `frontend/js/modules`
Resultado da leitura:

- nao existe arquivo proprio completo para `Agenda principal` em `frontend/js/modules`;
- existem apenas os arquivos consolidados de `Agenda de contatos`:
  - `agenda-contatos-telefones.js`
  - `agenda-contatos-listagem.js`
- os arquivos `frontend/prestadores_agenda_*.js` existem como patches historicos relacionados a agenda, mas nao configuram um modulo proprio da `Agenda principal`.

### 8.4 Riscos de acoplamento no frontend
Riscos observados:

- forte acoplamento entre agenda do dia, agenda da semana e agenda legado;
- compartilhamento de modal e de estado global entre fluxos;
- dependencia de `agendaLegado` dentro da abertura da agenda da semana;
- dependencia de filtros e combos carregados em tempo de execucao;
- uso de renderizacao dinamica extensa em `app.js`;
- risco de regressao em selecao, eventos, abertura e fechamento de paines;
- risco de quebra ao mexer em roteamento de menu, porque o handler central decide o fluxo por `data-menu-action`.

## 9. Mapa backend

### 9.1 Rotas envolvidas
Arquivo principal identificado:

- `backend/routes/agenda_legado_routes.py`

Fronteira consolidada apenas para referencia:

- `backend/routes/agenda_contatos_routes.py`

### 9.2 Dependencias com Agenda de contatos
`agenda_legado_routes.py` depende de `agenda-contatos` como fonte de apoio para o fluxo de agenda legado:

- carrega contatos para vinculacao e busca;
- usa contatos e pacientes como apoio para resolucao de nomes;
- mantem compatibilidade operacional com o fluxo legado;
- nao deve ser confundido com a frente `Agenda de contatos` consolidada.

### 9.3 Dependencias com pacientes, prestadores e unidades
`backend/routes/agenda_legado_routes.py` importa e usa:

- `Paciente`
- `PrestadorOdonto`
- `UnidadeAtendimento`
- `ConvenioOdonto`
- `ModeloDocumento`
- `ItemAuxiliar`
- `Usuario`
- `AgendaLegadoEvento`
- `AgendaLegadoBloqueio`

Funcionalmente, a agenda depende de:

- paciente para vinculo do agendamento e das buscas de apoio;
- prestador para agenda, filtros, conflitos, configuracao e Google Calendar;
- unidade para filtro, conflitos e local da agenda;
- auxiliares para status, especialidade e assuntos;
- documentos modelo para avisos;
- usuario autenticado para tenant e permissao.

### 9.4 Dependencias com Google Calendar e recorrencia
Dependencias de integracao e repeticao identificadas:

- `services.google_calendar_service`
- `GET /agenda-legado/google-agenda/status`
- `GET /agenda-legado/google-agenda/oauth/start`
- `GET /agenda-legado/google-agenda/preview`
- `POST /agenda-legado/google-agenda/exportar`
- `POST /agenda-legado/repetir`

### 9.5 Tenant e permissao
O backend aplica:

- `dependencies=[Depends(require_module_access("agenda"))]`
- filtro por `current_user.clinica_id` em consultas e mutacoes relevantes

Isso confirma que a agenda depende diretamente de tenant e permissao.

## 10. Riscos tecnicos
Riscos tecnicos registrados para a `Agenda principal`:

- salvamento;
- edicao;
- exclusao;
- recorrencia;
- integracao externa;
- vinculo com paciente;
- vinculo com prestador;
- vinculo com unidade;
- tenant;
- permissao;
- renderizacao dinamica em `app.js`;
- acoplamento entre agenda do dia, da semana e legado;
- dependencia de modal compartilhado e de estado global;
- risco de regressao em roteamento de menu;
- risco de alterar o comportamento da agenda sem perceber impacto no fluxo legado.

## 11. Itens proibidos para o primeiro recorte funcional
Proibido nesta subetapa:

- escolher helper para extracao;
- autorizar patch;
- modularizar;
- alterar comportamento;
- alterar textos;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules`;
- alterar backend;
- alterar rotas;
- alterar banco;
- alterar schema;
- alterar migrations;
- alterar seeds;
- alterar endpoints;
- alterar permissoes;
- implementar controle multiarea;
- reabrir `Agenda de contatos`;
- tratar a frente como se fosse area profissional especifica.

## 12. Proxima subetapa recomendada
Proxima subetapa documental recomendada antes de qualquer patch:

- `Agenda principal - Subetapa 2 - Mapa documental dos fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteiras com agenda legado`

## 13. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, testar futuramente:

- abrir `Agenda do dia`;
- abrir `Agenda da semana`;
- abrir `Abre o proximo agendado`;
- abrir `Quadro de avisos`;
- abrir `Agendas`;
- abrir e fechar a agenda sem perder selecao;
- criar, editar, excluir e repetir agendamentos;
- validar filtros de prestador, unidade e especialidade;
- validar fluxo com tenant correto;
- validar integracao com Google Calendar quando configurada;
- confirmar que `Agenda de contatos` continua separada e sem regressao;
- confirmar console sem `ReferenceError` ou `TypeError`.

## 14. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao de textos visiveis, labels, placeholders, acentos ou mojibake.

Se algum texto estranho for observado, ele deve ser apenas registrado como pendencia futura, sem correcao nesta etapa.

## 15. Registro para roadmap
- Inicio documental da frente `Agenda principal` registrado.
- `Agenda de contatos` permanece pausada/consolidada.
- Subetapa 1 criada sem alteracao de codigo.
- A frente foi tratada como `core / comum`.
- Nenhuma alteracao de `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, backend, banco, schema, migrations, seeds, endpoints ou permissao foi feita.
- Nenhum controle multiarea foi implementado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 2 - Mapa documental dos fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteiras com agenda legado`.

## 16. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega
