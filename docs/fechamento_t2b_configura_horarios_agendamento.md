# FECHAMENTO-T2B — Configura horários de agendamento

## Status e fronteira

**Frente B — Configura horários de agendamento**

Status: **funcionalmente concluída e homologada para documentação**, com auditoria seletiva do diff, testes finais, stage, commit e push ainda pendentes para a publicação.

O fluxo pode ser aberto a partir de `Prestadores -> Agenda`, mas esse botão é somente o ponto de entrada. A implementação interna pertence a esta frente. Prestadores, Credenciamentos, Comissões, Unidades de atendimento, Motivos de agendamento, ADM e Financeiro permanecem frentes próprias.

## Arquitetura React

Feature: `frontend-react/src/features/agendaConfiguracao/`.

Arquivos e responsabilidades encontrados:

- `AgendaConfiguracaoModal.jsx`: modal, contexto do prestador, abas e rodapé `Ok`/`Cancela`.
- `hooks/useAgendaConfiguracao.js`: carregamento, draft, estado de salvamento, erros e recarga de bloqueios.
- `agendaConfiguracaoApi.js`: leitura/gravação da configuração, mapeamento e CRUD de bloqueios.
- `agendaConfiguracaoState.js`: defaults de Escala, Apresentação e Visualização.
- `agendaConfiguracaoConstants.js`: título e abas.
- `agendaConfiguracaoBloqueios.js`: dias, máscaras, normalização de data/hora e payload de bloqueio.
- `agendaConfiguracaoFonte.js`, `agendaConfiguracaoColors.js` e `utils/`: fonte, cores e horários.
- `components/tabs/AgendaEscalaTab.jsx`.
- `components/tabs/AgendaBloqueiosTab.jsx`.
- `components/tabs/AgendaApresentacaoTab.jsx`.
- `components/tabs/AgendaVisualizacaoTab.jsx`.
- `components/bloqueios/AgendaBloqueioModal.jsx`.
- `components/fonte/AgendaFonteModal.jsx`.
- `components/AgendaColorDropdown.jsx`.
- `agendaConfiguracao.css`: estilos scoped da feature.

O modal usa `BranaModal`, tem o título `Configura horários de agendamento`, largura configurada em `740px`, abas em cartões e rodapé próprio com `Cancela` e `Ok`. O X do modal chama o cancelamento; `destroyOnClose` descarta a instância visual ao fechar.

## Escala

A aba `Escala` mantém os quadros `Manhã`, `Tarde`, `Duração do horário` e `Visualizar horários`. Os campos de início/fim usam horário `HH:MM`; os defaults encontrados são `07:00`, `13:00`, `13:00`, `20:00`, duração `5`, agenda da semana `12` e agenda do dia `12`. O backend normaliza horários e garante duração mínima de cinco minutos.

## Bloqueios

A aba lista bloqueios do prestador e oferece seleção, inclusão, alteração e eliminação. O registro contém unidade de atendimento, dia da semana, vigência inicial/final, horário inicial/final e mensagem da agenda. A confirmação de exclusão é separada e a lista é recarregada após mutação bem-sucedida.

Endpoints reais:

- `GET /agenda-legado/prestadores/{prestador_id}/bloqueios`
- `POST /agenda-legado/prestadores/{prestador_id}/bloqueios`
- `PUT /agenda-legado/prestadores/{prestador_id}/bloqueios/{bloqueio_id}`
- `DELETE /agenda-legado/prestadores/{prestador_id}/bloqueios/{bloqueio_id}`

A identidade operacional é o `bloqueio_id` dentro do prestador e da clínica. As rotas validam o prestador e a unidade no tenant do usuário, persistem fisicamente o registro e retornam a representação serializada. O frontend recarrega a listagem após criação, alteração ou exclusão.

## Apresentação

A aba `Apresentação` configura as cores de pacientes particulares, pacientes de convênio e compromissos, exibe prévias e abre o modal `Fonte` para família, estilo, tamanho, script e cor. A fonte é normalizada por helpers próprios e armazenada na configuração do prestador.

## Visualização

A aba `Visualização` controla os campos exibidos no agendamento. O catálogo real contém: Número do paciente, Número do prontuário, Nome do paciente, Matrícula, Convênio, Tabela, Fone 1, Fone 2, Fone 3 e Sala. Os defaults atuais são Número do paciente, Nome do paciente, Fone 1, Fone 2 e Sala.

## Persistência, Ok, Cancela e X

Ao abrir, o hook resolve o `prestadorId` do contexto de abertura ou do usuário, carrega o registro e bloqueios, e cria um draft local. `Ok` envia uma única gravação da configuração em:

`PUT /agenda-legado/prestadores/{prestador_id}/agenda-config`

com `agenda_config` normalizado. Após sucesso, o registro retornado passa a ser a base do draft. Erros permanecem no modal.

`Cancela` restaura o draft a partir da base carregada e fecha pelo fluxo externo quando aplicável. O X usa o callback de cancelamento do modal e não cria um contrato de persistência próprio. As mutações específicas de Bloqueios são independentes do salvamento do rodapé e ocorrem nos endpoints próprios.

## Datas, horas e contexto

Datas de bloqueio são exibidas em formato brasileiro e normalizadas pelos helpers compartilhados de parsing de datas. Horários usam `HH:MM`, máscara/normalização no campo e conversão para milissegundos no payload, mantendo também as representações legadas `inicio`, `final`, `hora_ini` e `hora_fin`. A data final é opcional conforme o registro retornado.

O contexto é o prestador SaaS da clínica, identificado pelo `id` da linha de Prestador. O backend restringe leitura e gravação por `current_user.clinica_id` e verifica o prestador no mesmo tenant. Não foi transportado para esta frente nenhum contrato especial de Clínica oriundo de Comissões.

## Backend e arquivos compartilhados

Rotas principais da Frente B:

- `backend/routes/agenda_legado_routes.py`: configuração por prestador, bloqueios e demais contratos da Agenda legado.
- `backend/models/agenda_legado.py`: entidades de bloqueio/evento utilizadas pelas rotas.

Arquivo compartilhado com a Frente A:

- `backend/routes/prestadores_routes.py`: serialização e normalização do campo `agenda_config` do prestador. Os endpoints de configuração e bloqueios permanecem em `agenda_legado_routes.py`; o arquivo de Prestadores não é classificado integralmente como Frente B.
- `frontend-react/src/app/App.jsx`: ponto de entrada em Prestadores e montagem do modal, junto com outras frentes do aplicativo.
- `backend/tests/test_prestadores_agenda_config_contract.py`: contrato de fronteira entre Prestador e Configura horários.

Unidades de atendimento participa como dependência explícita da seleção de unidade em bloqueios; o módulo `UnidadesAtendimento` não pertence à Frente B. Motivos/Situação de agendamento também permanecem separados.

## Tema

`agendaConfiguracao.css` concentra os estilos da feature e mantém superfícies, abas, tabelas/listas, inputs e rodapé integrados aos temas light/dark. A homologação deve preservar a ausência de faixas claras indevidas no dark e o light existente; não há alteração de contrato dos demais módulos nesta documentação.

## Testes e runtimes registrados

Testes frontend encontrados para esta frente:

- `frontend-react/tests/agendaConfiguracaoApi.test.js`
- `frontend-react/tests/agendaConfiguracaoBloqueios.test.js`
- `frontend-react/tests/agendaConfiguracaoContracts.test.js`
- `frontend-react/tests/agendaConfiguracaoDelete.test.js`
- `frontend-react/tests/agendaConfiguracaoEscala.test.js`
- `frontend-react/tests/agendaConfiguracaoFonte.test.js`
- `frontend-react/tests/agendaConfiguracaoPersistence.test.js`

Testes backend encontrados:

- `backend/tests/test_agenda_legado_bloqueios_crud.py`
- `backend/tests/test_agenda_legado_prestador_system_config.py`
- `backend/tests/test_prestadores_agenda_config_contract.py` — compartilhado na fronteira Prestador/Frente B.

O conjunto cobre contratos de API, estado/persistência, Escala, Fonte, bloqueios e exclusão. Os runtimes registrados para esta frente abrangem abertura a partir do prestador, Escala, Bloqueios, Apresentação, Visualização, CRUD de bloqueios, Ok/Cancelar/X, datas/horários e light/dark. Esta consolidação não afirma novos cenários além dos registros e testes existentes.

Falhas de infraestrutura conhecidas, como caminhos relativos duplicados `frontend-react/frontend-react/...` em testes antigos, devem permanecer registradas como preexistentes e não são tratadas como regressão desta frente.

## Pendências futuras

- Auditoria seletiva do diff, execução final dos testes e preparação seletiva para publicação.
- Evoluções futuras reais de agenda, se necessárias, sem reabrir os contratos já homologados.
- Unidades de atendimento e Motivos/Situação de agendamento continuam em frentes próprias.

## Fechamento

**FRENTE B — CONFIGURA HORÁRIOS DE AGENDAMENTO**
**STATUS: FUNCIONALMENTE CONCLUÍDA E HOMOLOGADA**

O cadastro/configuração de horários foi documentado separadamente de Prestadores. O documento não encerra Prestadores, Credenciamentos, Comissões, Unidades ou Motivos.
