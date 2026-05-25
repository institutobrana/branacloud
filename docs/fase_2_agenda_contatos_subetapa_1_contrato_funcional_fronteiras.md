# Fase 2 - Agenda de contatos - Subetapa 1 - Contrato funcional e fronteiras documentais

## 1. Contexto
Esta etapa inicia documentalmente o modulo `Agenda de contatos` dentro da Fase 2 de modularizacao/refatoracao do frontend.

O objetivo e registrar o contrato funcional inicial e as fronteiras do modulo sem alterar codigo, sem modularizar e sem escolher funcao para extracao.

Diretriz registrada nesta etapa:

- `Agenda de contatos` deve ser tratada como `core / comum`;
- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional.

## 2. Documentos consultados
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_reavaliacao_modulos_frontend_sem_modularizacao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 3. Confirmacao do commit anterior
Confirmado:

- `317e25ffabf03fa01af41a275136f895af28f783` - `Reavalia modulos frontend sem modularizacao`

Esse commit permanece valido e nao e reescrito por esta etapa.

## 4. Diretriz core/comum
Nesta frente, `Agenda de contatos` e tratada como modulo `core / comum`.

Regras de condução:

- nao implementar multiarea;
- nao criar flags multiarea;
- nao separar comportamento por area profissional;
- nao usar classificacao por area como criterio de conducao;
- nao alterar comportamento nesta etapa.

## 5. Contrato funcional inicial da Agenda de contatos
A `Agenda de contatos` e um cadastro/tabulacao de contatos acessado pela interface principal de agenda, com comportamento de consulta, inclusao, edicao, exclusao e filtragem.

Contrato funcional inicial observado:

- listar contatos da clinica atual;
- permitir filtrar por texto e tipo;
- permitir abrir modal de novo contato;
- permitir editar contato existente;
- permitir excluir contato selecionado;
- permitir carregar campos auxiliares de apoio;
- manter sincronismo com dados de contato existentes no backend;
- preservar isolamento por `clinica_id`.

## 6. Fronteiras do que pertence ao modulo
Pertence ao modulo `Agenda de contatos`:

- listagem de contatos;
- busca textual por nome, contato, e-mail e telefones;
- filtro por tipo;
- abertura do painel especifico de contatos;
- abertura do modal de novo/editar contato;
- salvamento de contato;
- exclusao de contato;
- carga de tipos, especialidades e auxiliares usados pelo formulario;
- selecao de linha na grid;
- acoes locais de imprimir e relatorio como planejamentos ainda internos ao modulo.

## 7. Fronteiras do que NAO pertence ao modulo
Nao pertence ao primeiro recorte deste modulo:

- agenda principal e recorrencia;
- agenda legado;
- quadro de avisos;
- agenda semanal;
- agenda do dia;
- proximo agendado;
- exportacoes e integracoes externas de agenda;
- fluxo de pacientes completo;
- ficha pessoal;
- conta corrente;
- financeiro;
- relatorios globais fora do contexto de contatos;
- controle multiarea;
- permissao nova dedicada por area.

## 8. Mapa frontend
### 8.1 Telas, menus e acoes visiveis
Os pontos visiveis associados ao modulo sao:

- `Agenda de contatos...` no menu;
- `Pesquisa contatos...` como entrada relacionada em relatorios;
- painel `Agenda de contatos`;
- botoes `Novo...`, `Altera...`, `Elimina`, `Imprime`, `Relatorio` e `Fecha`;
- modal `Novo contato` / `Alterar contato`.

### 8.2 Funcoes e prefixos em `frontend/app.js`
Funcoes e prefixos encontrados ligados ao modulo:

- `agendaContatos*`
- `agendaContatosAbrir`
- `agendaContatosCarregar`
- `agendaContatosRender`
- `agendaContatosAbrirModal`
- `agendaContatosSalvarModal`
- `agendaContatosExcluir`
- `agendaContatosVincularEventos`
- `agendaContatosFecharModal`

### 8.3 Presenca ou ausencia em `frontend/js/modules`
Nao existe arquivo proprio completo em `frontend/js/modules` para `Agenda de contatos`.

O modulo continua concentrado em `frontend/app.js`, o que confirma a necessidade de modularizacao futura, mas nao autoriza extracao nesta etapa.

### 8.4 Riscos de acoplamento no frontend
Riscos observados:

- renderizacao dinamica no `app.js`;
- dependencia de DOM montado sob demanda;
- uso de modal e grid com eventos acoplados;
- dependencia de `bindStandardGridActivation`;
- dependencia de carregamento de tipos, especialidades e auxiliares;
- possibilidade de efeitos colaterais com a agenda principal.

## 9. Mapa backend
### 9.1 Rotas envolvidas
Rota principal identificada:

- `backend/routes/agenda_contatos_routes.py`

Rota relacionada para entendimento de fronteira:

- `backend/routes/agenda_legado_routes.py`

### 9.2 Arquivo principal
O arquivo principal do dominio e `backend/routes/agenda_contatos_routes.py`.

### 9.3 Dependencias com agenda principal
Dependencias documentais observadas:

- o modulo e protegido pela permissao `agenda`;
- o contexto de agenda principal reaproveita contatos de agenda via chamada a `/agenda-contatos`;
- o arquivo legado de agenda consulta contatos para preenchimento de listas e atalhos;
- existe acoplamento indireto entre a agenda de contatos e o fluxo maior de agenda.

### 9.4 Dependencias com pacientes, prestadores e unidades
Dependencias observadas ou adjacentes:

- `current_user.clinica_id` como limite de tenant;
- `protetico_id` sincronizado a partir do contato;
- uso indireto de dados relacionados a paciente/prestador/unidade no ecossistema de agenda;
- `agenda_legado_routes.py` importa `Paciente`, `PrestadorOdonto` e `UnidadeAtendimento`, o que aumenta o risco de mistura de fronteiras.

## 10. Riscos tecnicos
Principais riscos:

- salvamento e edicao de contato;
- exclusao de contato com impacto imediato na lista;
- sincronismo com `protetico_id`;
- dependencia de permissao `agenda`;
- tenant por `clinica_id`;
- acoplamento com `agenda_legado`;
- comportamento dinamico montado em `app.js`;
- eventual expansao para fluxos que nao pertencem ao modulo.

## 11. Itens proibidos para o primeiro recorte funcional
Ficam fora do primeiro recorte:

- agenda completa;
- recorrencia e repeticao;
- agenda do dia e agenda semanal;
- avisos da agenda;
- proximo agendado;
- integracao externa de calendario;
- fluxos de paciente;
- financeiro;
- conta corrente;
- qualquer alteracao de permissao;
- qualquer controle multiarea;
- qualquer patch funcional.

## 12. Proxima subetapa recomendada
Recomenda-se como continuidade documental:

- `Fase 2 - Agenda de contatos - Subetapa 2 - Mapa documental de dependencias com agenda principal, agenda legado e tenant`

## 13. Onde testar futuramente quando houver alteracao real
Quando houver alteracao real, testar futuramente:

- abrir `Agenda de contatos...`;
- criar contato novo;
- editar contato existente;
- excluir contato existente;
- filtrar por texto e tipo;
- abrir `Agenda` e confirmar que recorrencia e agenda principal continuam intactas;
- abrir `Agenda legado` e confirmar que a lista auxiliar continua funcionando;
- abrir relatorios relacionados a contatos;
- confirmar ausencia de `ReferenceError`, `TypeError` e regressao de DOM;
- confirmar preservacao de `clinica_id` e da permissao `agenda`.

## 14. Blindagem textual/mojibake
Esta etapa respeita integralmente `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

Nao houve correcao textual, acentuacao, label, placeholder, string visivel ou mojibake.

Se algum texto estranho ou acento incorreto aparecer nos arquivos lidos, ele deve ser tratado apenas como pendencia futura, sem correcao nesta etapa.

## 15. Registro para roadmap
- O inicio documental do modulo `Agenda de contatos` foi registrado.
- O modulo foi tratado como `core / comum`.
- A Subetapa 1 foi criada sem alteracao de codigo.
- Nenhum backend, banco, endpoint ou permissao foi alterado.
- A proxima subetapa recomendada e `Agenda de contatos - Subetapa 2 - Mapa documental de dependencias com agenda principal, agenda legado e tenant`.

## 16. Commit seletivo obrigatorio
Se esta etapa permanecer restrita a este documento e, se necessario, ao roadmap, o commit deve ser seletivo.

Nao usar:

- `git add .`
- `git add docs/`
- qualquer forma de selecao ampla de arquivos

Usar apenas:

- `git add docs/fase_2_agenda_contatos_subetapa_1_contrato_funcional_fronteiras.md`
- se alterado, `git add docs/11_roadmap_desenvolvimento.md`

Depois:

- `git commit -m "Documenta contrato funcional de agenda contatos"`
- `git push`

