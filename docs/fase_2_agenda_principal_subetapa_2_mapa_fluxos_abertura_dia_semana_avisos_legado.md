# Fase 2 - Agenda principal - Subetapa 2 - Mapa documental dos fluxos de abertura, modos dia/semana, proximo agendado, avisos e fronteiras com agenda legado

## 1. Objetivo
Documentar, sem alterar codigo, os fluxos reais da `Agenda principal` observados em `frontend/app.js`, com foco na abertura da agenda, modos dia/semana, proximo agendado, quadro de avisos e fronteira operacional com a agenda legado.

Esta subetapa nao escolhe helper, nao autoriza patch e nao inicia modularizacao funcional.

## 2. Escopo
Escopo desta subetapa:

- mapear os fluxos de abertura da agenda principal;
- separar o que e visual, orquestracao, leitura/escrita e dependencia de backend;
- registrar a fronteira com `Agenda de contatos`, sem reabrir essa frente;
- registrar riscos tecnicos e candidatos futuros a helper puro;
- atualizar o roadmap apenas com um registro objetivo da subetapa.

## 3. Confirmacao de que Agenda principal e core / comum
A `Agenda principal` continua tratada como `core / comum`.

Regra mantida:
- sem classificacao por area profissional;
- sem multiarea;
- sem flags multiarea;
- sem separacao por area profissional.

## 4. Resumo da Subetapa 1
A Subetapa 1 documentou:

- contrato funcional inicial da `Agenda principal`;
- fronteiras do modulo;
- ausencia de arquivo proprio completo em `frontend/js/modules`;
- dependencia forte de `frontend/app.js`;
- fronteira com `Agenda de contatos` consolidada;
- mapa inicial de backend e tenant.

Esta Subetapa 2 aprofunda o mapa dos fluxos internos e nao altera o contrato ja estabelecido.

## 5. Arquivos analisados
- `docs/fase_2_agenda_principal_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/agenda-contatos-telefones.js`
- `frontend/js/modules/agenda-contatos-listagem.js`
- `frontend/prestadores_agenda_apresentacao_force.js`
- `frontend/prestadores_agenda_apresentacao_patch.js`
- `frontend/prestadores_agenda_fonte_color_patch.js`
- `frontend/prestadores_agenda_hotfix.js`
- `frontend/prestadores_agenda_refino.js`
- `frontend/prestadores_agenda_utf_fix.js`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/agenda_contatos_routes.py`

## 6. Mapa dos fluxos de abertura
Fluxos de abertura observados em `frontend/app.js`:

- `agendaSemanaAbrir`
- `agendaSemanaAbrirEmAbaUnica`
- `agendaSemanaIsStandaloneRequest`
- `agendaSemanaStandaloneModeFromQuery`
- `agendaSemanaBuildStandaloneUrl`
- `agendaLegadoAbrir`
- `agendaLegadoAbrirModal`
- `agendaContatosAbrir` apenas como fronteira consolidada, fora do recorte funcional

Fluxo de menu/orquestracao:

- `menuActionModule`
- o handler central que decide `agenda-dia`, `agenda-semana`, `agenda-proximo`, `agenda-avisos` e `config-agendas`

Leitura documental:
- a abertura da agenda do dia e da agenda da semana passa por aba unica/standalone;
- o fluxo do proximo agendado passa pela agenda legado;
- o quadro de avisos ainda aparece como item de menu, mas sem fluxo completo implementado no frontend.

## 7. Mapa dos modos dia/semana
Observado no frontend:

- `agenda-dia` abre a agenda em modo dedicado de dia;
- `agenda-semana` abre a agenda em modo dedicado de semana;
- `agendaSemanaBuildStandaloneUrl` monta a URL com `agenda_semana` e `agenda_modo`;
- `agendaSemanaIsStandaloneRequest` identifica quando a agenda precisa abrir como tela dedicada;
- `agendaSemanaStandaloneModeFromQuery` define o modo por query string;
- `agendaSemanaAplicarModoStandalone` ajusta a aparencia quando a agenda esta em modo dedicado;
- `agendaSemanaEnsureWindowControls`, `agendaSemanaToggleMinimize` e `agendaSemanaToggleMaximize` tratam a experiencia visual da janela;
- `agendaSemanaRenderEstrutura` e `agendaSemanaRenderEventos` atualizam a visao da agenda.

Classificacao documental:
- fluxo majoritariamente visual e de orquestracao;
- leitura da query string;
- dependencia de estado global da agenda;
- risco moderado/alto por afetar navegacao e renderizacao.

## 8. Mapa de proximo agendado
Observado no frontend:

- `agenda-proximo` chama `agendaLegadoAbrir({})`;
- em seguida chama `agendaLegadoCarregarProximo`;
- `agendaLegadoCarregarProximo` consulta o backend para o proximo registro;
- `agendaLegadoRender` reexibe apenas o item carregado quando ha retorno.

Classificacao documental:
- fluxo de leitura com alto acoplamento ao backend;
- risco maior que os fluxos puramente visuais;
- ponto importante para futura separacao de helper apenas se a parte de filtragem/normalizacao for isolada sem tocar na navegacao.

## 9. Mapa do quadro de avisos
Observado no frontend:

- `agenda-avisos` existe no menu visivel;
- o handler atual apenas escreve `Quadro de avisos: em planejamento.`;
- nao foi identificado fluxo funcional completo de avisos no recorte frontend lido.

Classificacao documental:
- fluxo placeholder/planejamento no frontend;
- nao iniciar recorte funcional aqui;
- manter como fronteira nao implementada.

## 10. Mapa de configuracao de agendas
Observado no frontend:

- `config-agendas` aciona um caminho especifico no handler central;
- o fluxo usa `prestEnsureUI` e `prestCarregar` como apoio;
- seleciona um prestador alvo na memoria de prestadores;
- chama `prestAgendaAbrir` se a funcao existir;
- caso contrario, escreve `Agendas: em planejamento.`.

Classificacao documental:
- fluxo de orquestracao e dependencia de prestadores;
- forte indicio de acoplamento com tela de agenda de prestador;
- nao confundir com `Agenda de contatos`;
- nao confundir com agenda principal do dia/semana.

## 11. Mapa da fronteira com agenda legado
`agendaLegado*` concentra a maior parte da agenda operacional observada.

Fluxos e funcoes candidatos/observados:

- `agendaLegadoEnsureUI`
- `agendaLegadoVincularEventos`
- `agendaLegadoCarregarCombos`
- `agendaLegadoBuscarStatusAuxiliares`
- `agendaLegadoCarregarContatos`
- `agendaLegadoGarantirContatosCarregados`
- `agendaLegadoAplicarContato`
- `agendaLegadoRender`
- `agendaLegadoModalPreencher`
- `agendaLegadoSalvarModal`
- `agendaLegadoExcluir`
- `agendaLegadoColetarRepeticaoConfig`
- `agendaLegadoHorarioDentroDaFaixa`
- `agendaLegadoCalcularMaxDuracaoPermitida`
- `agendaLegadoAbrirMenuPacientesParaRetorno`
- `agendaLegadoResolverNomeModal`
- `agendaLegadoAbrir`

Fronteira documental:
- agenda legado nao e a mesma coisa que agenda contatos;
- agenda legado usa contatos e pacientes como apoio;
- agenda legado concentra leitura/escrita, modal, conflitos, repeticao e apoio a Google Calendar;
- o fluxo legado deve ser visto como parte sensivel da `Agenda principal`.

## 12. Mapa da fronteira com Agenda de contatos
`Agenda de contatos` permanece:

- pausada/consolidada;
- fora do primeiro recorte funcional;
- fora de qualquer novo patch desta etapa;
- fora da reabertura documental de fluxo.

Observacao:
- `agendaContatosAbrir` e os auxiliares de `agendaContatos*` aparecem apenas como fronteira consolidada e dependencias indiretas do fluxo legado;
- esta subetapa nao reabre a frente de contatos;
- nao ha autorizacao para alterar ou ampliar o contrato de `Agenda de contatos`.

## 13. Dependencias com pacientes, prestadores e unidades
Dependencias identificadas:

- pacientes para busca, vinculo e apoio ao nome;
- prestadores para filtro, agenda, configuracao, conflitos e retorno;
- unidades para filtro e agenda dedicada;
- `agendaLegadoCarregarCombos` carrega prestadores, unidades, tipos de telefone e assuntos;
- `agendaLegadoCarregarContatos` combina contatos e pacientes para o apoio do modal.

## 14. Dependencias com tenant/clinica_id
Dependencias documentadas:

- o backend da agenda trabalha com `current_user.clinica_id`;
- o frontend reflete essa dependencia via carregamento autenticado e estado da sessao;
- o fluxo de agenda nao e neutro em tenant;
- qualquer futura extracao precisa preservar o escopo da clinica.

## 15. Dependencias com permissões
Dependencia encontrada:

- a agenda usa a permissao `agenda` no backend via `require_module_access("agenda")`.

No frontend:
- o handler central decide o acesso por module code e permissao da sessao;
- isso afeta a abertura da agenda e das telas derivadas.

## 16. Dependencias com Google Calendar
Dependencias encontradas no backend da agenda legado:

- `services.google_calendar_service`
- `GET /agenda-legado/google-agenda/status`
- `GET /agenda-legado/google-agenda/oauth/start`
- `GET /agenda-legado/google-agenda/preview`
- `POST /agenda-legado/google-agenda/exportar`

No frontend analisado nesta subetapa:
- nao foi localizado novo helper proprio de Google Calendar;
- a dependencia permanece concentrada no backend e no fluxo legado.

## 17. Fluxos que parecem apenas visuais
Esses fluxos tem predominancia visual/orquestracional:

- `agendaSemanaEnsureUI`
- `agendaSemanaEnsureWindowControls`
- `agendaSemanaEnsureStandaloneStyle`
- `agendaSemanaAplicarModoStandalone`
- `agendaSemanaToggleMinimize`
- `agendaSemanaToggleMaximize`
- `agendaSemanaRenderEstrutura`
- `agendaSemanaRenderEventos`
- `agendaLegadoEnsureUI`
- `agendaLegadoEnriquecerModal`
- `agendaLegadoAplicarBloqueioPorTipo`
- `agendaLegadoAplicarFocoPorTipo`

## 18. Fluxos que parecem de orquestracao
Esses fluxos coordenam tela, estado e navegacao:

- `agendaSemanaAbrir`
- `agendaSemanaAbrirEmAbaUnica`
- `agendaSemanaIsStandaloneRequest`
- `agendaSemanaStandaloneModeFromQuery`
- `agendaSemanaBuildStandaloneUrl`
- `agendaLegadoAbrir`
- `agendaLegadoVincularEventos`
- `agendaLegadoCarregar`
- `agendaLegadoCarregarCombos`
- `agendaLegadoCarregarContatos`
- `menuActionModule`
- o handler central de `agenda-dia`, `agenda-semana`, `agenda-proximo`, `agenda-avisos` e `config-agendas`

## 19. Fluxos que fazem leitura/escrita
Esses fluxos ja tocam dados e backend:

- `agendaLegadoCarregar`
- `agendaLegadoCarregarProximo`
- `agendaLegadoCarregarCombos`
- `agendaLegadoCarregarContatos`
- `agendaLegadoSalvarModal`
- `agendaLegadoExcluir`
- `agendaLegadoColetarRepeticaoConfig`
- `agendaLegadoAplicarContato`
- `agendaLegadoAbrirMenuPacientesParaRetorno`
- `agendaLegadoResolverNomeModal`
- `agendaLegadoHorarioDentroDaFaixa`
- `agendaLegadoCalcularMaxDuracaoPermitida`

## 20. Fluxos que dependem de backend/endpoints
Enderecos de backend associados ao recorte:

- `/agenda-legado`
- `/agenda-legado/next`
- `/agenda-legado/prestadores`
- `/agenda-legado/unidades`
- `/agenda-legado/especialidades`
- `/agenda-legado/status-agendamento`
- `/agenda-legado/assuntos-compromisso`
- `/agenda-legado/tipos-fone`
- `/agenda-legado/pacientes`
- `/agenda-legado/repetir`
- `/agenda-legado/avisos-agendamento`
- rotas de Google Calendar da agenda legado

## 21. Fluxos de maior risco
Fluxos com maior risco tecnico:

- salvamento e exclusao em `agendaLegadoSalvarModal` e `agendaLegadoExcluir`;
- repeticao e sobreposicao em `agendaLegadoColetarRepeticaoConfig` e `agendaLegadoHorarioDentroDaFaixa`;
- abertura da agenda em abas dedicadas;
- carregamento de contatos/pacientes no apoio do modal;
- configuracao de agendas via prestadores;
- integracao com Google Calendar;
- dependencia de tenant e permissao;
- renderizacao dinamica da semana/legado;
- uso de estado global compartilhado.

## 22. Candidatos futuros a helper puro
Ainda sem autorizacao de implementacao, os candidatos mais provaveis observados foram:

- `agendaSemanaIsStandaloneRequest`
- `agendaSemanaStandaloneModeFromQuery`
- `agendaSemanaBuildStandaloneUrl`
- `agendaLegadoRangeHoje`
- `agendaLegadoRangeSemana`
- `agendaLegadoFmtHora`
- `agendaLegadoFmtDataInput`
- `agendaLegadoParseDataInput`
- `agendaLegadoFmtData`
- `agendaLegadoNumOrNull`
- `agendaLegadoCoerceHoraTexto`
- `agendaLegadoNormalizarHexCor`

Observacao:
- os candidatos acima podem ainda depender de contexto da tela ou de fallback visual;
- nenhum deles foi escolhido para extração nesta etapa;
- alguns podem parecer puros, mas precisam de auditoria adicional antes de qualquer uso.

## 23. Itens explicitamente fora do escopo
Ficam fora desta subetapa:

- criar helper;
- escolher helper para extracao;
- criar modulo JS;
- aplicar patch funcional;
- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar `frontend/js/modules`;
- alterar backend;
- alterar banco/schema/migrations/seeds/endpoints;
- alterar permissoes;
- alterar comportamento;
- reabrir `Agenda de contatos`;
- corrigir texto visivel;
- corrigir mojibake;
- iniciar qualquer multiarea.

## 24. Proxima subetapa recomendada
Proxima subetapa recomendada:

- `Agenda principal - Subetapa 3 - Plano documental do primeiro helper puro candidato, com avaliacao de risco e fronteira de extracao`

## 25. Registro para roadmap
- Subetapa 2 criada documentalmente para `Agenda principal`.
- O mapa de abertura, modos dia/semana, proximo agendado, avisos e fronteira com agenda legado foi registrado.
- `Agenda principal` continua tratada como `core / comum`.
- `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhuma alteracao foi feita em frontend, backend, banco, schema, migrations, seeds, endpoints ou permissoes.
- Nenhum helper foi escolhido.
- Nenhum patch foi autorizado.
- Proxima subetapa recomendada: `Agenda principal - Subetapa 3 - Plano documental do primeiro helper puro candidato, com avaliacao de risco e fronteira de extracao`.

## 26. Commit seletivo obrigatorio
Commit seletivo obrigatorio desta subetapa:

- `docs/fase_2_agenda_principal_subetapa_2_mapa_fluxos_abertura_dia_semana_avisos_legado.md`
- `docs/11_roadmap_desenvolvimento.md` se ele for alterado nesta entrega

## 27. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao de textos visiveis, labels, placeholders, acentos ou mojibake.

Se houver texto estranho ou corrompido em arquivos lidos, isso deve ser apenas registrado como pendencia futura, sem qualquer correcao nesta etapa.
