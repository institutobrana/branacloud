# Auditoria de Prestadores - Brana Cloude, legado e EasyDental

## Objetivo

Registrar a auditoria funcional e tecnica do modulo `Prestadores` para a nova frente React `Cadastro -> Corpo clinico`, sem iniciar implementacao funcional.

## Fontes consultadas primeiro

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`

## Documentacao existente encontrada

Documentos relevantes ja existentes e ainda validos:

- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/05_banco_dados.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_6_documental_prest_status_html.md`
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md`
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`
- `docs/fase_2c_prestadores_contrato_listagem_painel_filtros_locais.md`
- `docs/fase_2c_prestadores_decisao_pos_validacao_listagem_painel_filtros_locais.md`
- `docs/fase_2c_revisao_geral_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_reavaliado.md`

Documentos validos, mas parciais ou historicos:

- `docs/prestadores_subetapa_0_mapeamento_monolitico.md` - ainda util para mapear o bloco legado, mas nao cobre o contrato atual completo.
- `docs/prestadores_subetapa_0_retomada_estado_atual.md` - util como retomada, mas nao substitui a auditoria atual.
- `docs/prestadores_subetapa_1_namespace_passivo.md` e `docs/prestadores_subetapa_2_fronteiras_contratos.md` - validos para helpers ja extraidos.
- `docs/fase_2c_*prestadores*.md` - validos para o recorte visual/local ja consolidado, mas nao cobrem a nova frente React de corpo clinico.

Documentos desatualizados para esta etapa:

- quaisquer trechos que tratem `Prestadores` como apenas listagem/painel visual, porque o backend atual ja expoe CRUD, credenciamento, comissoes e combos auxiliares.

Informacoes que precisaram ser confirmadas diretamente no codigo:

- rotas reais do backend;
- contratos de payload;
- campos reais do modelo;
- lista real de especialidades/auxiliares;
- comportamento de selecao e filtragem no frontend legado;
- existencia e formato do namespace passivo em `frontend/js/modules/prestadores.js`.

## Diretório e estado inicial

- Diretório usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch usada: `modularizacao-segura-fase-1`
- Remote confirmado: `https://github.com/institutobrana/branacloud.git`
- HEAD inicial: `2d7563a3db5b16f4ff69da81e6af4765d2eea0da`
- Estado inicial do Git: branch local a frente de `origin/modularizacao-segura-fase-1`, com alteracoes preexistentes no worktree.
- Stage inicial: vazio.

## Frontend legado auditado

Arquivos observados:

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `frontend/prestadores_override.js`
- `frontend/prestadores_agenda_utf_fix.js`
- `frontend/prestadores_agenda_refino.js`
- `frontend/prestadores_agenda_hotfix.js`
- `frontend/prestadores_agenda_fonte_color_patch.js`
- `frontend/prestadores_agenda_apresentacao_patch.js`
- `frontend/prestadores_agenda_apresentacao_force.js`

### Resumo funcional da listagem no legado

- A entrada do menu `Cadastro -> Prestadores` dispara `prestAbrir()` em `frontend/app.js`.
- A lista usa os campos `Código`, `Nome`, `Fone 1`, `Fone 2` e `Status`.
- A filtragem atual considera especialidade e texto livre de nome/telefone.
- A linha selecionada e destacada e mantida por `prestadorSelId`.
- A selecao de linha e centralizada em `bindStandardGridActivation`.
- O status visual usa `prestStatusHtml(...)`.
- O combo de especialidade e preenchido a partir da lista carregada.
- O carregamento atual busca `GET /cadastros/prestadores`.
- Quando nao ha dados, existe fallback sintetico local.
- Os comandos da barra hoje estao presentes como:
  - `Novo prestador`
  - `Altera`
  - `Elimina`
  - `Agenda`
  - `Convênios`
  - `Comissões`

### Matriz resumida dos cinco campos da tabela

| Campo | Origem atual observada | Observacao |
| --- | --- | --- |
| Codigo | `item.codigo` | Se vazio, o frontend legado aplica formatação sequencial local. |
| Nome | `item.nome` ou fallback sintetico | Nome exibido e o principal campo textual. |
| Fone 1 | `item.fone1` | Pode vir vazio; e usado na pesquisa. |
| Fone 2 | `item.fone2` | Pode vir vazio; e usado na pesquisa. |
| Status | `item.ativo !== false` | Exibido como indicador visual ativo/inativo. |

## Backend auditado

Arquivos observados:

- `backend/routes/prestadores_routes.py`
- `backend/models/prestador.py`
- `backend/models/prestador_odonto.py`
- `backend/models/agenda_legado.py`
- `backend/models/convenio_odonto.py`
- `backend/models/financeiro.py`

### Rotas identificadas

Endpoints principais do modulo:

- `GET /cadastros/prestadores`
- `GET /cadastros/prestadores/tipos`
- `POST /cadastros/prestadores`
- `PUT /cadastros/prestadores/{row_id}`
- `DELETE /cadastros/prestadores/{row_id}`
- `GET /cadastros/prestadores/credenciamentos`
- `POST /cadastros/prestadores/credenciamentos`
- `PUT /cadastros/prestadores/credenciamentos/{row_id}`
- `DELETE /cadastros/prestadores/credenciamentos/{row_id}`
- `GET /cadastros/prestadores/comissoes`
- `POST /cadastros/prestadores/comissoes`
- `PUT /cadastros/prestadores/comissoes/{row_id}`
- `DELETE /cadastros/prestadores/comissoes/{row_id}`

### Dependencias e bloqueios de exclusao

- `Prestador` e referenciado por credenciamentos e comissoes.
- `PrestadorOdonto` e referenciado por credenciamentos e comissoes do desktop/contrato odonto.
- A exclusao fisica em cascata existe em alguns relacionamentos do ORM, mas a regra funcional real precisa ser confirmada com o comportamento do usuario e da base.
- O modulo depende de `get_current_user` e `require_module_access("prestadores")`.
- O isolamento efetivo e por `current_user.clinica_id`.

### Resumo tecnico do backend

- O modulo usa modelos separados para a camada atual e a camada odonto/legado.
- O backend normaliza texto, datas, booleanos e listas JSON auxiliares.
- O filtro de especialidade vem de `ItemAuxiliar` com tipos de auxiliar de especialidade.
- O status ativo/inativo e derivado de `ativo` ou `inativo`, conforme a camada.
- Ha seeds/defaults para tipos de prestador e CBO-S.

## Banco de dados e dependencias

Tabelas identificadas:

- `prestador`
- `prestador_credenciamento`
- `prestador_comissao`
- `prestador_odonto`
- `prestador_credenciamento_odonto`
- `prestador_comissao_odonto`
- `agenda_legado_evento`
- `agenda_legado_bloqueio`
- `convenio_odonto`
- `procedimento_generico`
- `item_auxiliar`

### Campos e relacoes confirmadas

- `prestador` possui `clinica_id`, `codigo`, `nome`, `ativo`, telefones, endereco, dados bancarios, especialidade e observacoes.
- `prestador_odonto` possui `clinica_id`, `source_id`, `usuario_id`, `codigo`, `nome`, `inativo`, `especialidade`, `especialidades_json` e `agenda_config_json`.
- `prestador_credenciamento*` vinculam prestador e convenio.
- `prestador_comissao*` vinculam prestador, convenio e, no odonto, opcionalmente procedimento generico e especialidade.
- A agenda usa `id_prestador` e, portanto, depende da integridade do cadastro de prestadores.

## EasyDental Desktop

Fontes locais e documentos de apoio confirmados:

- `Y:\EDS70`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/14_especificacao_tela_orcamento_easy_dental.md`
- `docs/auditoria_easydental_virgem_subetapa_2_usuarios_prestadores_vinculos.md`
- `docs/auditoria_easydental_virgem_subetapa_8a_decisao_tabelas_usuarios_prestadores.md`
- `docs/auditoria_easydental_virgem_subetapa_8r_prestador_adm_mestre_funcional.md`
- `docs/auditoria_easydental_virgem_subetapa_8tb_comparacao_direta_usuario_prestador_setup.md`
- `docs/auditoria_easydental_virgem_subetapa_8tc_confirmacao_unc_usuario_prestador_setup.md`
- `docs/auditoria_easydental_virgem_subetapa_8u_usuario_adm_dentista_prestador_unidade.md`

### O que o EasyDental ajudou a confirmar

- `PRESTADOR` e a tabela estrutural clara do legado.
- `PREST_ESP` e a relacao formal com especialidades.
- `PESSOAL` aparece como cadastro amplo de pessoas com FK relacionada.
- `CCCIRURGIAO` e uma estrutura operacional com `ID_PRESTADOR`.
- O caminho `Y:\EDS70` existe e contem `Dados`, `Reports`, `Help`, `Objetos`, `Textos`, `TISS` e outros recursos do sistema.

### Distincao funcional

- Regra ainda vigente no Brana Cloud: prestadores, especialidades, agenda, credenciamentos, comissoes e vinculacao com usuarios continuam reais.
- Comportamento exclusivo do EasyDental: estrutura e nomes historicos do legado, inclusive `PREST_ESP`, `PESSOAL` e `CCCIRURGIAO`.
- Referencia visual: tela de cadastro de prestadores e contratos de menu.
- Regra abandonada ou nao confirmada no Brana Cloud: qualquer detalhe de UI antiga que nao tenha sido confirmado no codigo atual.
- Possivel requisito ainda nao migrado: subfluxos de agenda, convenios e comissoes como janelas ou paginas isoladas.
- Comportamento que precisa de decisao futura: nivel de isolamento do submódulo Agenda, Convênios e Comissões dentro da nova frente React.

## Modal de cadastro

Campos confirmados no backend atual e no legado React passivo:

- `codigo`
- `nome`
- `apelido`
- `tipo_prestador`
- `inicio`
- `termino`
- `ativo`
- `executa_procedimento`
- `cro`
- `uf_cro`
- `cpf`
- `rg`
- `inss`
- `ccm`
- `contrato`
- `cnes`
- `cbos`
- `nascimento`
- `sexo`
- `estado_civil`
- `prefixo`
- `inclusao`
- `alteracao`
- `id_interno`
- `fone1_tipo`
- `fone1`
- `fone2_tipo`
- `fone2`
- `email`
- `homepage`
- `logradouro_tipo`
- `endereco`
- `numero`
- `complemento`
- `bairro`
- `cidade`
- `cep`
- `uf`
- `banco`
- `agencia`
- `conta`
- `nome_conta`
- `modo_pagamento`
- `faculdade`
- `formatura`
- `alerta_agendamentos`
- `especialidade`
- `especialidades_exec`
- `agenda_config`
- `observacoes`

### Resumo do modal

- O legado atual tem modal completo no recorte React passivo.
- O backend aceita um payload amplo, mas a etapa atual nao vai redesenhar o modal ainda.
- Agenda, convenios e comissoes exigem front separado ou subblocos isolados, nao um componente monolitico.

## Matriz dos seis comandos da barra

| Comando | Pre-condicao | Rotas envolvidas | Situaçao atual |
| --- | --- | --- | --- |
| Novo prestador | Nenhum registro precisa estar selecionado, mas o fluxo pode partir de uma linha atual | `POST /cadastros/prestadores` | Ja existe no backend; no frontend legado o fluxo ainda esta acoplado ao painel existente. |
| Altera | Requer selecao de linha valida | `PUT /cadastros/prestadores/{row_id}` | Existe no backend; precisa de contrato visual modular para a nova frente. |
| Elimina | Requer selecao e confirmacao | `DELETE /cadastros/prestadores/{row_id}` | Existe no backend; exclusao precisa ser protegida por dependencias reais. |
| Agenda | Idealmente exige prestador selecionado | ainda sem contrato fechado nesta etapa | Deve nascer como subfluxo isolado. |
| Convênios | Idealmente exige prestador selecionado | `credenciamentos` e possiveis consultas auxiliares | Deve ser tratado separadamente do CRUD principal. |
| Comissões | Idealmente exige prestador selecionado | `comissoes` e possiveis consultas auxiliares | Deve ser tratado separadamente do CRUD principal. |

## Comparacao Brana Cloud versus EasyDental

- Brana Cloud ja tem backend real para prestadores e odonto.
- O legado confirma a existencia estrutural de prestadores, especialidades e vinculos.
- O Brana Cloud atual mistura camadas administrativas e odontologicas no mesmo dominio tecnico.
- O EasyDental ajuda a confirmar o que e estrutural e o que e apenas visual/historico.
- O que nao foi confirmado no codigo atual nao entra como regra nesta etapa.

## Componentes React reutilizaveis

Componentes/padroes existentes que podem ajudar na futura implementacao:

- shell em `L`
- barra horizontal unica
- tabela compacta com linha selecionavel
- filtros locais por coluna
- campo de busca
- modal com abas
- confirmacao de exclusao
- padrao de loading e erro
- helpers de selecao visual
- adaptacao de payload/estado para lista e modal

## Riscos e duvidas pendentes

- Como separar Agenda, Convênios e Comissões sem reintroduzir monolito.
- Se o combo de especialidade deve vir de auxiliar geral, tabela propria ou endpoint dedicado.
- Se o filtro por nome/codigo deve reproduzir alguma regra historica adicional ainda nao confirmada.
- Se existe bloqueio funcional de exclusao por uso em agenda, tratamentos ou financeiro que precise de mensagem especifica.
- Se o modal principal deve usar um arquivo unico ou se deve nascer em seções/propriedades pequenas.

## Conclusao da auditoria

- O modulo `Prestadores` existe e e funcional no backend, banco, frontend legado e contrato odonto.
- A nova frente React deve tratar `Agenda`, `Convênios` e `Comissões` como fluxos separados ou submodulos isolados.
- A etapa atual e exclusivamente documental.

## Consolidacao final da Frente A

O fechamento documental final esta em `docs/fechamento_t2a_prestadores.md`.
O codigo atual contempla Novo, Altera e Elimina de Prestadores, as abas
Principal, Contato, Detalhes e Observacoes, Credenciamentos e Comissoes.

As conclusoes acima sao registro da auditoria original. Para o estado vigente,
prevalecem o codigo atual e o fechamento final. A implementacao interna de
Agenda permanece fora desta frente.
