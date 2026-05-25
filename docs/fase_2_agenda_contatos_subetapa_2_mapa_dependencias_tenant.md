# Fase 2 - Agenda de contatos - Subetapa 2 - Mapa documental de dependencias com agenda principal, agenda legado e tenant

## 1. Contexto
Esta etapa continua documentalmente o modulo `Agenda de contatos` dentro da Fase 2 de modularizacao/refatoracao do frontend.

O foco aqui e mapear dependencias reais de frontend e backend, com destaque para agenda principal, agenda legado, tenant e permissao, sem alterar codigo e sem escolher funcao para extracao.

Diretriz registrada nesta etapa:

- `Agenda de contatos` deve ser tratada como `core / comum`;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Confirmado:

- `55716e7dd9b5dd0af489bd6b5884392fde89fdcd` - `Documenta contrato funcional de agenda contatos`

Esse commit permanece valido e nao e reescrito por esta etapa.

## 4. Diretriz core/comum
Nesta frente, `Agenda de contatos` continua tratada como modulo `core / comum`.

Regras de conducao:

- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional;
- nao usar classificacao por area como criterio de conducao;
- nao alterar comportamento nesta etapa.

## 5. Mapa de funcoes `agendaContatos*` no frontend
Funcoes localizadas em `frontend/app.js`:

- `agendaContatosSelecionarLinha`
- `agendaContatosNode`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosField`
- `agendaContatosBuildPhoneRow`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosReconstruirModalBody`
- `agendaContatosEnsureUI`
- `agendaContatosFiltrar`
- `agendaContatosSelecionado`
- `agendaContatosTelefonesTexto`
- `agendaContatosEnsureOption`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosRender`
- `agendaContatosSetTab`
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`
- `agendaContatosVincularEventos`
- `agendaContatosAbrir`

## 6. Separacao por tipo de responsabilidade
### 6.1 Funcoes visuais / renderizacao
- `agendaContatosSelecionarLinha`
- `agendaContatosNode`
- `agendaContatosOption`
- `agendaContatosSelect`
- `agendaContatosField`
- `agendaContatosBuildPhoneRow`
- `agendaContatosGarantirAbaDetalhes`
- `agendaContatosReconstruirModalBody`
- `agendaContatosEnsureUI`
- `agendaContatosFiltrar`
- `agendaContatosTelefonesTexto`
- `agendaContatosAtualizarFiltroTipos`
- `agendaContatosRender`
- `agendaContatosSetTab`

### 6.2 Funcoes de carregamento
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosAbrir`

### 6.3 Funcoes de modal
- `agendaContatosPreencherModal`
- `agendaContatosAbrirModal`
- `agendaContatosFecharModal`

### 6.4 Funcoes de salvamento
- `agendaContatosMontarPayload`
- `agendaContatosSalvarModal`

### 6.5 Funcoes de exclusao
- `agendaContatosExcluir`

### 6.6 Funcoes de vinculo / eventos
- `agendaContatosVincularEventos`

### 6.7 Funcoes com `requestJson`
- `agendaContatosCarregarTipos`
- `agendaContatosCarregarEspecialidades`
- `agendaContatosCarregarAuxiliares`
- `agendaContatosCarregar`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`

### 6.8 Funcoes com estado global / cache
- `agendaContatos`
- `agendaContatosCache`
- `agendaContatosTiposCache`
- `agendaContatosEspecialidadesCache`
- `agendaContatosSelId`

## 7. Mapa de endpoints backend em `agenda_contatos_routes.py`
Endpoints localizados:

- `GET /agenda-contatos` - listar contatos
- `POST /agenda-contatos` - criar contato
- `PUT /agenda-contatos/{contato_id}` - atualizar contato
- `DELETE /agenda-contatos/{contato_id}` - excluir contato

Dependencias de apoio observadas no mesmo dominio:

- `Contato`
- `Protetico`
- `Usuario`

## 8. Mapa de fronteiras com `agenda_legado_routes.py`
Dependencias indiretas observadas:

- `agenda_legado_routes.py` usa `requestJson("GET", "/agenda-contatos?limit=5000")` no frontend para montar contatos auxiliares da agenda legado;
- `agenda_legado_routes.py` tambem carrega `"/agenda-legado/pacientes?limit=5000"` no mesmo fluxo;
- o backend legado possui filtros por `Paciente`, `PrestadorOdonto` e `UnidadeAtendimento`, ampliando a fronteira da agenda maior;
- o arquivo legado consulta contatos para datalist, busca por nome e preenchimento de agenda, mas isso nao transforma `Agenda de contatos` em subparte interna do motor legado.

## 9. Mapa de tenant / `clinica_id`
Protecao de tenant observada:

- `agenda_contatos_routes.py` recebe `current_user` via `Depends(get_current_user)`;
- listagem filtra `Contato.clinica_id == current_user.clinica_id`;
- criacao grava `clinica_id=current_user.clinica_id`;
- atualizacao carrega o registro com `clinica_id == current_user.clinica_id`;
- exclusao tambem carrega com `clinica_id == current_user.clinica_id`;
- sincronismo de `Protetico` e consultas correlatas tambem respeitam `clinica_id`;
- `agenda_legado_routes.py` repete esse padrÃ£o em diversos pontos, reforcando que a fronteira por clinica e obrigatoria para a agenda maior.

## 10. Mapa da permissao `agenda`
Onde a permissao aparece:

- `backend/routes/agenda_contatos_routes.py` usa `dependencies=[Depends(require_module_access("agenda"))]`;
- `backend/routes/agenda_legado_routes.py` usa o mesmo padrao de permissao `agenda`;
- `backend/security/permissions.py` registra `agenda` como modulo de permissao existente;
- no frontend, `Agenda de contatos` e aberta como parte do bloco de agenda sob o mesmo contexto de permissao.

## 11. Dependencias com pacientes, prestadores, unidades, proteticos, tipos, especialidades
### 11.1 Pacientes
- Indiretas, via `agenda_legado_routes.py` e busca legada de contatos/pacientes.
- `agendaContatos` em si nao usa `Paciente` diretamente no fluxo principal.

### 11.2 Prestadores
- Indiretas, via agenda legado e contexto maior da agenda.
- `agenda_contatos_routes.py` nao consulta prestador diretamente no CRUD principal.

### 11.3 Unidades
- Indiretas, via agenda legado.
- O CRUD de contatos nao depende de unidade no backend principal.

### 11.4 Proteticos
- Diretas no backend principal de contatos, via `_sincronizar_protetico_contato`.
- O contato pode carregar/sincronizar `protetico_id`.

### 11.5 Tipos / especialidades / auxiliares
- Diretas no frontend:
  - `agendaContatosCarregarTipos` usa `/cadastros/auxiliares?tipo=Tipos de contato`;
  - `agendaContatosCarregarAuxiliares` usa `/cadastros/auxiliares?tipo=Bairro`, `Cidade`, `Palavra chave` e `Tipos de contato`;
  - `agendaContatosCarregarEspecialidades` usa `/procedimentos/filtros`;
  - esses dados alimentam selects, filtros e modal.

## 12. Riscos tecnicos por dependencia
### 12.1 Riscos que travam extracao funcional imediata
- salvamento via `POST/PUT`;
- exclusao via `DELETE`;
- uso de modal dinâmico e DOM reconstruido;
- dependencia de `requestJson` em multiplos pontos;
- sincronismo com `Protetico`;
- acoplamento com agenda legado por leitura compartilhadada de contatos;
- tenant obrigatorio por `clinica_id`;
- permissao `agenda` compartilhada com o motor maior da agenda.

### 12.2 Riscos secundarios
- tipos e filtros carregados de `cadastros/auxiliares`;
- especialidades carregadas de `procedimentos/filtros`;
- renderizacao dinamica em `app.js`;
- estados globais e caches compartilhados.

## 13. O que fica proibido para o primeiro recorte funcional
Ficam fora do primeiro recorte:

- agenda principal;
- agenda legado inteira;
- repeticao e recorrencia;
- horarios livres;
- avisos da agenda;
- exportacao Google Calendar;
- pesquisa de pacientes da agenda maior;
- conta corrente;
- financeiro;
- qualquer alteracao de permissao;
- qualquer controle multiarea;
- qualquer patch funcional.

## 14. Menor recorte futuro possivel, como hipotese documental
Hipotese mais conservadora para um recorte futuro:

- isolar somente a leitura/listagem e a filtragem de contatos, mantendo modal, salvamento, exclusao e sincronismo de protetico fora do primeiro corte.

Hipotese alternativa ainda segura:

- separar apenas o carregamento e a renderizacao da grade de contatos, sem tocar no fluxo de persistencia.

## 15. Proxima subetapa recomendada
Recomenda-se como continuidade documental:

- `Fase 2 - Agenda de contatos - Subetapa 3 - Mapa documental do fluxo de listagem, filtros e carregamento de apoio`

## 16. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, testar futuramente:

- abrir `Agenda de contatos`;
- filtrar por texto e tipo;
- abrir modal de novo contato;
- editar contato existente;
- excluir contato existente;
- abrir `Agenda` e confirmar que a agenda maior continua funcionando;
- abrir `Agenda legado` e confirmar que a lista auxiliar e o preenchimento por nome continuam funcionando;
- validar `clinica_id` ao alternar entre clinicas;
- conferir console sem `ReferenceError`, `TypeError` ou regressao de DOM;
- confirmar que a permissao `agenda` continua a mesma.

## 17. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder, string visivel ou mojibake.

Se algum texto estranho ou acento incorreto aparecer nos arquivos lidos, ele deve ser tratado apenas como pendencia futura, sem correcao nesta etapa.

## 18. Registro para roadmap
- A Subetapa 2 de `Agenda de contatos` foi criada documentalmente.
- O mapa de dependencias com agenda principal, agenda legado e tenant foi registrado.
- O modulo continua tratado como `core / comum`.
- Nenhum codigo foi alterado.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 3 - Mapa documental do fluxo de listagem, filtros e carregamento de apoio`.

## 19. Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_agenda_contatos_subetapa_2_mapa_dependencias_tenant.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Mapeia dependencias de agenda contatos"`
- `git push`

