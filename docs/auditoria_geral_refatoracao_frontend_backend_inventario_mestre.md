# Auditoria geral para refatoração do frontend e backend — Inventário mestre de módulos e responsabilidades

## 1. Objetivo, escopo e travas

Esta auditoria registra o inventário técnico geral do Brana Cloud para preparar uma refatoração/modularização futura e segura do frontend e do backend. A modularização funcional está pausada. Esta etapa é exclusivamente documental e não deve escolher próximo helper nem iniciar extração funcional.

Confirmações de escopo:

- Nenhum código funcional foi planejado para alteração nesta etapa.
- `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, `frontend/js/utils`, CSS, backend, banco, schema, migrations e endpoints devem permanecer intocados.
- Correções textuais, acentos, labels, placeholders, strings visíveis e mojibake estão bloqueados por `docs/regras_blindagem_correcoes_textuais_mojibake.md`.
- Se houver mojibake em strings lidas, ele fica apenas registrado como risco documental.
- Pastas proibidas não fazem parte da auditoria. A leitura ficou limitada ao projeto `D:\BRANA ARQUIVOS\BRANA CLOUD`.

## 2. Branch, Git e pendências preexistentes

Checks iniciais autorizados:

- Branch: `modularizacao-segura-fase-1`.
- `git status --short`: havia diversas pendências `??` antigas em `docs/`, além de entradas soltas `git` e `modularizacao-segura-fase-1`.
- `git diff --stat`: sem diff rastreado no início.
- Topo do log: `1221c1e Reavalia proximo modulo apos Simbolos Graficos`.

Regra sobre untracked em `docs/`: os arquivos preexistentes foram apenas registrados. Esta etapa não adiciona, apaga, move, renomeia, limpa ou reorganiza essas pendências.

## 3. Arquivos e documentos consultados

Arquivos/pastas analisados somente em leitura:

- `frontend/index.html`, `frontend/app.js`, `frontend/js`, `frontend/js/modules`, `frontend/css`.
- `backend`, `backend/routes`, `backend/models`, `backend/services`, `backend/security`, `backend/database.py`, `backend/main.py`.
- `backend/requirements.txt`, `README.md`, `.env.example`.

Documentos obrigatórios e relevantes consultados/localizados:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`.
- `docs/reavaliacao_pos_fechamento_simbolos_graficos_proximo_modulo.md`.
- `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md`.
- `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md`.
- `docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md`.
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`.
- `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md`.
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`.
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`.
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`.
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`.
- `docs/recomendacao_proximo_modulo_pos_anamnese.md`.
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`.
- `docs/recomendacao_proximo_modulo_pos_materiais.md`.
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`.
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`.
- `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`.
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`.

O documento `docs/recomendacao_proximo_modulo_pos_medicamentos.md` não foi encontrado com esse nome exato. O equivalente encontrado foi `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`.

## 4. Regra anti-reciclagem registrada

Módulos já pausados, encerrados ou retomados recentemente não devem ser recomendados novamente apenas porque já existe módulo JS, namespace, documentação, helpers candidatos ou trabalho anterior.

Para retomar qualquer módulo já explorado, será obrigatório demonstrar: helper puro específico e inédito; contrato claro de entrada e saída; ausência de DOM, cache, estado, payload, salvamento, exclusão, API/requestJson, eventos, clique, duplo clique, seleção, renderização, modais, vínculos com pacientes/procedimentos/materiais/financeiro/backend/banco; e justificativa de que esse caminho é mais seguro do que qualquer módulo ainda não esgotado.

## 5. Frontend/index.html — scripts carregados

Foram encontrados 22 scripts, nesta ordem:

1. `/frontend/js/modules/unidades.js`
2. `/frontend/js/modules/plano-contas.js`
3. `/frontend/js/modules/cid.js`
4. `/frontend/js/modules/medicamentos.js`
5. `/frontend/js/modules/auxiliares.js?v=20260513-aux-sub1`
6. `/frontend/js/modules/etiquetas.js`
7. `/frontend/js/modules/procedimentos-genericos.js?v=20260514-pgen-sub1`
8. `/frontend/js/modules/materiais.js`
9. `/frontend/js/modules/anamnese.js`
10. `/frontend/js/modules/prestadores.js`
11. `/frontend/js/modules/convenios-planos.js`
12. `/frontend/js/modules/simbolos-graficos.js`
13. `/frontend/js/modules/intervencoes-procedimentos.js`
14. `/frontend/js/modules/preferencias-opcoes-sistema.js`
15. `/frontend/app.js?v=20260513-medicamentos-sub1`
16. `/frontend/easy_font_dialog.js?v=20260330-pref-amb-font3`
17. `/frontend/prestadores_override.js?v=20260407-prest-agenda-persist2`
18. `/frontend/prestadores_agenda_hotfix.js?v=20260329-prest-agenda-hotfix-restore7`
19. `/frontend/prestadores_agenda_apresentacao_patch.js?v=20260407-prest-agenda-apres-sync16`
20. `/frontend/prestadores_agenda_refino.js?v=20260329-prest-agenda-refino25`
21. `/frontend/prestadores_agenda_fonte_color_patch.js?v=20260328-prest-agenda-fonte-color4`
22. `/frontend/prestadores_agenda_utf_fix.js?v=20260328-prest-agenda-utf-fix2`

Leitura: os módulos passivos carregam antes de `app.js`, mas `app.js` continua concentrando comportamento. Os scripts de prestadores/agenda carregados depois do `app.js` indicam patches históricos fora de `frontend/js/modules`.

## 6. Frontend/index.html — menus, ações, telas e modais

Números encontrados:

- `data-menu-action` únicos: 75.
- IDs únicos: 354.
- Botões HTML: 179.
- Forms nativos: 0.
- Painéis por ID: 10.
- IDs de modal/backdrop/campos de modal: 64.

`data-menu-action` encontrados: `agenda-avisos`, `agenda-contatos`, `agenda-dia`, `agenda-proximo`, `agenda-semana`, `aux`, `cadastro-abre-paciente`, `cadastro-conectar`, `cadastro-controle-estoque`, `cadastro-controle-proteticos`, `cadastro-controle-retornos`, `cadastro-convenios-planos`, `cadastro-dados-complementares`, `cadastro-desconectar`, `cadastro-fecha-paciente`, `cadastro-ficha-anamnese`, `cadastro-ficha-historico`, `cadastro-ficha-pessoal`, `cadastro-ficha-rapida`, `cadastro-medicamentos`, `cadastro-novo-paciente`, `cadastro-prestadores`, `cadastro-restricoes-terapeuticas`, `cadastro-sair`, `cadastro-unidades-atendimento`, `cenario`, `config-agendas`, `config-alterar-senha`, `config-anamnese`, `config-etiquetas`, `config-indices-financeiros`, `config-opcoes-sistema`, `config-preferencias`, `config-relatorios`, `config-simbolos-graficos`, `ferr-auditoria`, `ferr-chat`, `ferr-easycapture`, `ferr-editor-msword`, `ferr-editor-textos`, `ferr-slide-show`, `ferr-usuarios-conectados`, `financeiro-cc-cirurgiao`, `financeiro-cc-paciente`, `financeiro-comissoes-internas`, `financeiro-contas-receber`, `financeiro-controle-recibos`, `financeiro-mensalidades-ortodontia`, `financeiro-parametros-custo-fixo`, `licenca`, `materiais`, `plano`, `relatorio-agendas`, `relatorio-contatos`, `relatorio-estatistico-fluxo-caixa`, `relatorio-estoque`, `relatorio-fichas-branco`, `relatorio-financeiro-conta-corrente`, `relatorio-mala-direta`, `relatorio-pacientes`, `relatorio-proteticos`, `relatorio-tratamentos`, `sobre`, `superadmin`, `tabelas-cid`, `tabelas-procedimentos`, `tabelas-procedimentos-genericos`, `tabelas-protetico`, `tratamento-altera`, `tratamento-elimina`, `tratamento-finaliza`, `tratamento-imprime`, `tratamento-novo`, `tratamento-orcamento`, `usuarios`.

Painéis/áreas estáticas principais: `login-wrap`, `panel-login`, `panel-signup`, `panel-forgot`, `panel-setup`, `cenario-panel`, `materiais-panel`, `procedimentos-panel`, `novo-proc-panel`, `users-panel`, `superadmin-panel`.

Modais/backdrops principais: `materiais-modal-backdrop`, `materiais-tabela-modal-backdrop`, `vincula-backdrop`, `proc-tabela-modal-backdrop`, `proc-reajuste-modal-backdrop`, `users-modal-backdrop`, `users-pass-backdrop`, `users-perm-backdrop`, `protected-pass-backdrop`, `sobre-backdrop`, `licenca-backdrop`.

Telas que aparecem no menu/HTML mas não têm painel estático próprio equivalente: agenda, relatórios, editor de textos, preferências/opções, convênios e planos, prestadores, medicamentos, auxiliares, etiquetas, símbolos gráficos, CID, plano de contas, unidades, prótese/protéticos e tratamentos. A hipótese forte é que essas telas são montadas dinamicamente por `app.js`.

## 7. Frontend/js/modules — arquivos, namespaces e helpers

Foram encontrados 14 arquivos em `frontend/js/modules`:

| Arquivo | Namespace capturado | Helpers/funções principais | Estado |
|---|---|---|---|
| `anamnese.js` | `window.BranaAnamneseModule` | `anamneseValidarNomeQuestionario`, `anamneseValidarTextoPergunta` | passivo/helpers |
| `auxiliares.js` | não capturado como Brana | helpers de cor, hex, tipo, mojibake, source list | requer confirmar namespace |
| `cid.js` | não capturado | payload/helper interno citado | requer auditoria própria |
| `convenios-planos.js` | `window.BranaConveniosPlanosModule` | normalizações e validações de convênio/plano | passivo/helpers |
| `etiquetas.js` | não capturado como Brana | `formatNumber`, `layoutFromItem`, contratos | requer confirmar namespace |
| `intervencoes-procedimentos.js` | `window.BranaIntervencoesProcedimentosModule` | `procFmtAuxLabel`, `procFmtBr`, `procFmtSimboloLabel`, `procIndiceSiglaFromValor`, `procParse` | passivo/helpers |
| `materiais.js` | `window.BranaMateriaisModule` | `materiaisUniqueAuxDescricoes` | passivo/helper |
| `medicamentos.js` | não capturado | arquivo próprio sem namespace Brana capturado | requer auditoria |
| `plano-contas.js` | `window.BranaPlanoContasModule` | helpers/payloads citados | passivo |
| `preferencias-opcoes-sistema.js` | `window.BranaPreferenciasOpcoesSistemaModule` | defaults/normalização/localização | passivo/helpers |
| `prestadores.js` | `window.BranaPrestadoresModule` | `prestFmtCodigo`, `prestStatusHtml` | passivo/helpers |
| `procedimentos-genericos.js` | `window.BranaProcedimentosGenericosModule` | `statusDot`, contratos e candidatos | passivo/helper |
| `simbolos-graficos.js` | `window.BranaSimbolosGraficosModule` | helpers de texto, imagem, sistema, biblioteca, tipo/marca | passivo/helpers |
| `unidades.js` | `window.BranaUnidadesModule` | arquivo próprio | requer auditoria se retomar |

Namespaces Brana encontrados: `window.BranaAnamneseModule`, `window.BranaConveniosPlanosModule`, `window.BranaIntervencoesProcedimentosModule`, `window.BranaMateriaisModule`, `window.BranaPlanoContasModule`, `window.BranaPreferenciasOpcoesSistemaModule`, `window.BranaPrestadoresModule`, `window.BranaProcedimentosGenericosModule`, `window.BranaSimbolosGraficosModule`, `window.BranaUnidadesModule`.

## 8. Frontend/app.js — inventário estrutural

Tamanho e indicadores:

- Linhas: 25.237.
- Bytes: 1.842.389.
- Declarações `function`: 1.458.
- Chamadas `requestJson`: 279.
- Chamadas diretas com método HTTP literal: 247.
- Endpoints literais/templates únicos chamados: 194.
- Chamadas `fetch`: 4.
- `addEventListener`: 968.

Prefixos por domínio no `app.js`:

| Prefixo | Funções aprox. | Domínio |
|---|---:|---|
| `editorTextos` | 381 | Editor, documentos, PDF, assinatura, mesclagem, imagens, tabela, régua |
| `agenda` | 189 | Agenda geral/legado/semana/contatos |
| `proc` | 107 | Procedimentos, tabelas, reajuste, materiais vinculados |
| `agendaSemana` | 88 | Agenda semanal |
| `users` | 76 | Usuários, permissões, perfis, senhas |
| `ficha` | 76 | Pacientes/ficha |
| `agendaLegado` | 73 | Agenda legado |
| `pgen` | 69 | Procedimentos genéricos |
| `convPlan` | 55 | Convênios, planos, calendário |
| `simbolos` | 54 | Símbolos gráficos |
| `pref` | 51 | Preferências |
| `prot` | 38 | Protéticos/serviços |
| `procRelatorio` | 33 | Relatórios de procedimentos |
| `cnfRelatorio` | 31 | Configuração de relatórios |
| `anamnese` | 28 | Anamnese |
| `agendaContatos` | 28 | Contatos de agenda |
| `aux` | 27 | Auxiliares |
| `sa` | 23 | Superadmin |
| `materiais` | 22 | Materiais |
| `unidade` | 21 | Unidades |
| `etq` | 20 | Etiquetas |
| `medicamentos` | 19 | Medicamentos |
| `cc` | 17 | Conta corrente |
| `cid` | 14 | CID |
| `dash` | 13 | Dashboard/cenário |
| `fcx` | 13 | Fluxo de caixa |
| `indices` | 11 | Índices financeiros |
| `plano` | 11 | Plano de contas |
| `prest` | 10 | Prestadores |
| `sysOpt` | 9 | Opções do sistema |

Responsabilidades concentradas no `app.js`: autenticação/sessão, usuários/permissões, superadmin, pacientes/ficha, materiais, procedimentos, procedimentos genéricos, convênios, prestadores, agenda, editor, conta corrente, fluxo de caixa, relatórios, índices, prótese, preferências, opções, etiquetas, símbolos, caches globais, seleção, DOM, eventos, modais, renderização, payloads, salvamento, exclusão e chamadas API.

## 9. Backend — estrutura e concentradores

O backend é Python/FastAPI com SQLAlchemy e PostgreSQL. Dependências principais: FastAPI, Uvicorn, SQLAlchemy, psycopg2, python-dotenv, Pydantic, JWT/passlib/bcrypt, multipart, requests, pyHanko, reportlab, pillow e pypdf.

Arquivos principais:

- `backend/main.py`: app FastAPI, CORS, startup, hotfixes de schema, middlewares, routers e static mounts.
- `backend/database.py`: engine/session/base.
- `backend/routes`: 26 arquivos de rota.
- `backend/models`: modelos SQLAlchemy.
- `backend/services`: services por domínio/parciais.
- `backend/security`: autenticação, permissões, tenant, trial e contexto.

Arquivos grandes/concentradores:

- `backend/routes/editor_textos_routes.py`: 3.362 linhas.
- `backend/routes/agenda_legado_routes.py`: 2.465 linhas.
- `backend/routes/cadastros_routes.py`: 2.416 linhas.
- `backend/routes/procedimentos_routes.py`: 1.983 linhas.
- `backend/routes/prestadores_routes.py`: 1.257 linhas.
- `backend/routes/preferences_routes.py`: 1.121 linhas.
- `backend/services/signup_service.py`: 2.237 linhas.
- `backend/services/procedimentos_legado_service.py`: 1.217 linhas.
- `backend/services/editor_pdf_service.py`: 538 linhas.
- `backend/security/permissions.py`: 506 linhas.
- `backend/services/simbolos_service.py`: 485 linhas.

Riscos backend misturados: `main.py` ainda contém hotfixes de schema/startup; `cadastros_routes.py` reúne símbolos, plano de contas, auxiliares, pacientes e procedimentos genéricos; `agenda_legado_routes.py` reúne eventos, combos, Google Agenda e pacientes/prestadores; `editor_textos_routes.py` mistura modelos, PDF, assinatura e assistentes; `procedimentos_routes.py` mistura tabelas, reajuste, dashboard, relatórios, CRUD e vínculos materiais; `signup_service.py` faz bootstrap/replicação de muitos domínios.

## 10. Backend — endpoints por arquivo de rota

Foram encontrados 26 arquivos de rota e 269 endpoints declarados.

| Arquivo | Prefixo | Qtd. | Endpoints principais |
|---|---|---:|---|
| `agenda_contatos_routes.py` | `/agenda-contatos` | 4 | GET/POST/PUT/DELETE contatos |
| `agenda_legado_routes.py` | `/agenda-legado` | 22 | agenda, avisos, Google Agenda, horários livres, next, prestadores, unidades, especialidades, status, assuntos, tipos, pacientes, CRUD e repetição |
| `anamnese_routes.py` | `/anamnese` | 11 | questionários, perguntas, renumeração e respostas por paciente |
| `auth_routes.py` | sem prefixo | 12 | `/login`, Google auth, signup, password, setup, `/logout`, `/auth/protected/unlock`, `/me` |
| `cadastros_routes.py` | `/cadastros` | 39 | símbolos gráficos, grupos, categorias, auxiliares, pacientes e procedimentos genéricos |
| `cenario_routes.py` | sem prefixo | 3 | `GET /cenario`, `POST /cenario`, `POST /cenario/calcular-fixos` |
| `cid_routes.py` | `/cid` | 4 | CRUD de CID |
| `controle_proteticos_routes.py` | `/controle-proteticos` | 2 | filtros e listagem |
| `convenios_planos_routes.py` | `/cadastros/convenios-planos` | 11 | combos, convênios, planos, calendário de faturamento |
| `editor_textos_routes.py` | `/editor-textos` | 20 | mesclagem, campos, assistentes, modelos, PDF, assinatura, Acrobat, renomear, excluir |
| `etiquetas_routes.py` | `/config/etiquetas` | 6 | padrões, arquivos, modelos CRUD |
| `financeiro_routes.py` | `/financeiro` | 10 | categorias, formas, situações, lançamentos, relatório CC, fluxo de caixa |
| `indices_financeiros_routes.py` | `/indices-financeiros` | 10 | índices, em uso, migrar/excluir, cotações CRUD |
| `licenca_routes.py` | `/licenca` | 4 | info, checkout, confirmar, sincronizar |
| `materiais_routes.py` | `/materiais` | 10 | índices, listas, próximo código, materiais CRUD |
| `medicamentos_routes.py` | `/medicamentos` | 8 | listagem, opções, detalhe, CRUD |
| `preferences_routes.py` | `/preferences` | 12 | general, models, environment, user-data, odontogram, report-config |
| `prestadores_routes.py` | `/cadastros/prestadores` | 13 | prestadores, tipos, credenciamentos, comissões |
| `procedimentos_routes.py` | `/procedimentos` | 18 | tabelas, procedimentos, reajuste, dashboard, relatório, filtros, materiais vinculados |
| `proteticos_routes.py` | `/proteticos` | 8 | protéticos e serviços CRUD |
| `relatorios_routes.py` | `/relatorios` | 1 | enviar email |
| `superadmin_routes.py` | `/superadmin` | 15 | overview, clínicas, usuários, cobrança, auditoria, assinaturas |
| `system_options_routes.py` | `/system-options` | 2 | GET/PATCH opções do sistema |
| `tratamentos_routes.py` | `/tratamentos` | 3 | tratamentos do paciente, combos e novo tratamento |
| `unidades_atendimento_routes.py` | `/cadastros/unidades-atendimento` | 6 | unidades, combos, próximo código, CRUD |
| `user_admin_routes.py` | `/admin/users` | 15 | usuários admin, permissões, perfis, senha, exclusão, tipo de conta |

## 11. Frontend x Backend — endpoints chamados pelo frontend

O `app.js` chama `requestJson` 279 vezes e aciona endpoints de autenticação, usuários, superadmin, materiais, procedimentos, procedimentos genéricos, pacientes, anamnese, convênios, prestadores, agenda, editor, financeiro, índices, protéticos, preferências, etiquetas, símbolos, CID, unidades e licença.

Cruzamento principal:

| Área | Frontend | Backend | Risco |
|---|---|---|---|
| Autenticação/sessão | `login`, `signup`, `forgot`, `setup`, `carregarSessao` | `auth_routes.py`, `security/*`, `models/usuario.py` | crítico |
| Usuários/permissões | `users*`, painéis/modais | `user_admin_routes.py`, `security/permissions.py` | crítico |
| Materiais | `materiais*`, painéis/modais, módulo passivo | `materiais_routes.py`, `models/material.py` | alto/crítico |
| Procedimentos | `proc*`, reajuste, vínculos | `procedimentos_routes.py`, `services/vinculos_materiais.py` | crítico |
| Procedimentos genéricos | `pgen*`, módulo passivo | `cadastros_routes.py`, `models/procedimento_generico.py` | alto/crítico |
| Agenda | `agenda*`, scripts externos | `agenda_legado_routes.py`, `agenda_contatos_routes.py` | alto/crítico |
| Editor | `editorTextos*` | `editor_textos_routes.py`, services PDF/modelos/assinatura | crítico |
| Financeiro | `cc*`, `fcx*`, `rcc*`, `dash*` | `financeiro_routes.py`, `models/financeiro.py` | crítico |
| Índices financeiros | `indices*`, `cotacao*` | `indices_financeiros_routes.py`, `services/indices_service.py` | crítico |
| Protéticos/prótese | `prot*`, `ctrlProt*` | `proteticos_routes.py`, `controle_proteticos_routes.py` | alto |
| Preferências/opções | `pref*`, `sysOpt*` | `preferences_routes.py`, `system_options_routes.py` | alto |

Endpoints frontend notáveis por domínio:

- Auth/sessão: `/login`, `/logout`, `/me`, `/auth/protected/unlock`, signup e reset.
- Usuários: `/admin/users`, `/admin/users/proximo-codigo`, `/admin/users/permissions/schema`, permissões, perfis e senha.
- Superadmin: `/superadmin/overview`, `/superadmin/clinicas`, `/superadmin/usuarios`, cobranças, auditoria e exportação.
- Materiais: `/materiais`, `/materiais/listas`, `/materiais/indices`, próximo código.
- Procedimentos: `/procedimentos`, `/procedimentos/tabelas`, reajuste-preview, reajuste-aplicar, dashboard, relatório, filtros e materiais vinculados.
- Procedimentos genéricos: `/cadastros/procedimentos-genericos`, detalhe, próximo código e migrar.
- Pacientes: `/cadastros/pacientes`, menu, opções, navegação, por código, próximo código.
- Anamnese: `/anamnese/questionarios`, perguntas, renumerar, respostas por paciente.
- Convênios/planos: `/cadastros/convenios-planos/combos`, convênios, planos e calendário.
- Agenda: `/agenda-legado`, `/agenda-legado/next`, `/agenda-legado/prestadores`, unidades, especialidades, status, pacientes, `/agenda-contatos`.
- Editor: `/editor-textos/campos`, modelos, mesclar, exportar PDF, assinatura, assistentes, Acrobat.
- Financeiro: `/financeiro/lancamentos`, categorias, formas, relatório CC e fluxo de caixa.
- Índices: `/indices-financeiros`, cotações, em-uso, migrar/excluir.
- Protéticos: `/proteticos`, serviços, controle protético.
- Preferências/opções: `/preferences/*`, `/system-options`.
- Etiquetas: `/config/etiquetas/*`.
- Símbolos: `/cadastros/simbolos-graficos` com scopes.
- CID: `/cid`.
- Unidades: `/cadastros/unidades-atendimento`.
- Licença: `/licenca/info`, checkout, confirmar, sincronizar.

## 12. Módulos reais identificados

Módulos reais do sistema por evidência combinada de menu, HTML, `app.js`, módulos JS, backend e docs:

- Login/sessão/autenticação.
- Usuários/perfis/permissões.
- Superadmin/licença/plataforma.
- Pacientes/ficha clínica/ficha pessoal.
- Anamnese.
- Materiais/estoque/listas.
- Procedimentos/intervenções.
- Procedimentos genéricos.
- Convênios e planos.
- Prestadores.
- Medicamentos.
- Auxiliares/tabelas auxiliares.
- CID.
- Plano de contas.
- Unidades de atendimento.
- Etiquetas.
- Símbolos gráficos.
- Preferências e opções do sistema.
- Configuração de relatórios.
- Relatórios.
- Conta corrente/financeiro.
- Fluxo de caixa/cenário financeiro/dashboard.
- Índices financeiros/cotações.
- Agenda/agenda semana/agenda legado/contatos/avisos.
- Editor de textos/documentos/PDF/assinatura.
- Protéticos/tabela de serviços de prótese/controle protético.
- Tratamentos/orçamentos.
- Sobre/licença.

## 13. Classificação mestre por módulo

### Usuários

- HTML/menu: `usuarios`, `users-panel`, modais de usuário, senha e permissões.
- `app.js`: `users*`, `carregarUsuarios`, `abrirPainelUsuariosConfig`.
- JS próprio/namespace: não.
- Backend/endpoints: `user_admin_routes.py`, `/admin/users/*`, `security/permissions.py`.
- Banco provável: `usuarios`, perfis/acesso/permissões.
- Status frontend: não iniciado, concentrado no `app.js`, alto risco.
- Status backend: organizado por rota, mas acoplado a security/permissões.
- Tem `requestJson`, payload, salvamento, exclusão, renderização, modal, eventos, seleção e backend/banco.
- Relações: prestador, unidade, sessão, perfil, permissões.
- Risco principal: quebrar acesso administrativo, senhas ou permissões.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Login/sessão/autenticação

- HTML/menu: painéis `panel-login`, `panel-signup`, `panel-forgot`, `panel-setup`.
- `app.js`: `login`, `carregarSessao`, `signup*`, `forgot*`, `setup*`.
- JS próprio/namespace: não.
- Backend/endpoints: `auth_routes.py`, `/login`, `/logout`, `/me`, Google auth, signup, password, setup, protected unlock.
- Banco provável: `usuarios`, `email_codes`, `clinicas`.
- Status frontend: não iniciado, concentrado no `app.js`.
- Status backend: parcialmente separado por auth/security.
- Tem `requestJson`, payload, renderização de painéis e eventos.
- Relações: usuário, tenant, licença/trial, permissões.
- Risco principal: impedir acesso ou corromper sessão/tenant.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Conta corrente

- HTML/menu: `financeiro-cc-cirurgiao`, `financeiro-cc-paciente`, `relatorio-financeiro-conta-corrente`.
- `app.js`: `cc*`, `rcc*`, `fcx*`.
- JS próprio/namespace: não.
- Backend/endpoints: `financeiro_routes.py`, `/financeiro/lancamentos`, categorias, formas, relatório CC, fluxo de caixa.
- Banco provável: lançamentos, categorias, formas de pagamento, plano de contas.
- Status frontend: não iniciado, concentrado no `app.js`.
- Status backend: rota separada, regras no arquivo de rota.
- Tem `requestJson`, payload, salvamento, exclusão, renderização, modal, eventos e seleção.
- Relações: paciente, cirurgião/prestador, financeiro, banco.
- Risco principal: lançar/excluir valores indevidos ou quebrar relatórios.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Relatórios

- HTML/menu: `relatorio-*`, `config-relatorios`.
- `app.js`: `relatorio*`, `cnfRelatorio*`, `procRelatorio*`, `rcc*`, `fcx*`, `protRelatorio*`.
- JS próprio/namespace: não.
- Backend/endpoints: `/relatorios/enviar-email`, `/procedimentos/relatorio-tabela`, `/financeiro/relatorio-cc`, endpoints de editor/protéticos.
- Status frontend: não iniciado, espalhado no `app.js`.
- Status backend: espalhado por rotas de domínio.
- Tem impressão/exportação/renderização intensa.
- Risco principal: relatórios cruzam financeiro, procedimentos, editor e protéticos.
- Classificação: Alto risco.
- Prioridade futura: auditoria alta; refatoração somente após nova auditoria.

### Índices financeiros

- HTML/menu: `config-indices-financeiros`.
- `app.js`: `indices*`, `cotacao*`.
- JS próprio/namespace: não.
- Backend/endpoints: `indices_financeiros_routes.py`, `/indices-financeiros/*`, `services/indices_service.py`.
- Banco provável: índices/cotações e referências em procedimentos/materiais/tratamentos.
- Status frontend: não iniciado; citado antes, mas não auditado profundamente como módulo próprio.
- Status backend: rota + service parcialmente separado.
- Tem `requestJson`, payload, salvamento, exclusão, seleção e modal.
- Risco principal: reajuste/cálculo e referências em uso.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Tabela de serviços de prótese

- HTML/menu: `tabelas-protetico`, `relatorio-proteticos`, `cadastro-controle-proteticos`.
- `app.js`: `prot*`, `ctrlProt*`.
- JS próprio/namespace: não.
- Backend/endpoints: `proteticos_routes.py`, `controle_proteticos_routes.py`, `/proteticos/*`, `/controle-proteticos`.
- Banco provável: protéticos, serviços protéticos, controle protético.
- Status frontend: não iniciado, concentrado no `app.js`.
- Status backend: parcialmente separado por rotas.
- Tem `requestJson`, payload, salvamento, exclusão, relatórios, modal e seleção.
- Relações: procedimentos/custos/serviços e relatórios.
- Risco principal: serviços e relatórios com impacto operacional/financeiro.
- Classificação: Alto risco.
- Prioridade futura: auditoria alta; refatoração após nova auditoria.

### Plano de Contas

- HTML/menu: `plano`.
- `app.js`: `plano*`.
- JS próprio/namespace: `frontend/js/modules/plano-contas.js`, `window.BranaPlanoContasModule`.
- Backend/endpoints: `/cadastros/grupos`, `/cadastros/categorias`, em-uso, migrar/excluir em `cadastros_routes.py`.
- Status frontend: helpers delegados; ciclo encerrado.
- Status backend: centralizado em `cadastros_routes.py`.
- Risco: financeiro/categorias em uso.
- Classificação: Alto risco.
- Prioridade futura: auditoria média; refatoração bloqueada pela anti-reciclagem.

### Etiquetas

- HTML/menu: `config-etiquetas`.
- `app.js`: `etq*`.
- JS próprio/namespace: `frontend/js/modules/etiquetas.js`; namespace Brana não capturado.
- Backend/endpoints: `etiquetas_routes.py`, `/config/etiquetas/*`, `services/etiquetas_service.py`.
- Status frontend: helpers delegados; ciclo encerrado.
- Risco: layout, impressão e modelos.
- Classificação: Médio risco.
- Prioridade futura: auditoria média; refatoração baixa.

### Preferências e Opções do Sistema

- HTML/menu: `config-preferencias`, `config-opcoes-sistema`.
- `app.js`: `pref*`, `sysOpt*`.
- JS próprio/namespace: `frontend/js/modules/preferencias-opcoes-sistema.js`, `window.BranaPreferenciasOpcoesSistemaModule`.
- Backend/endpoints: `preferences_routes.py`, `system_options_routes.py`, `/preferences/*`, `/system-options`.
- Status frontend: parcialmente modularizado; fechado/pausado.
- Risco: configuração transversal.
- Classificação: Alto risco.
- Prioridade futura: auditoria média; refatoração bloqueada.

### Auxiliares / Tabelas auxiliares

- HTML/menu: `aux`; também alimenta selects de especialidade, fase, contato, cobrança e símbolos.
- `app.js`: `aux*`.
- JS próprio/namespace: `frontend/js/modules/auxiliares.js`; namespace Brana não capturado.
- Backend/endpoints: `/cadastros/auxiliares`, tipos, especialidades ativas em `cadastros_routes.py`.
- Status frontend: helpers delegados; ciclo encerrado.
- Risco: módulo alimenta vários outros domínios.
- Classificação: Médio/alto.
- Prioridade futura: auditoria média; refatoração bloqueada/baixa.

### Símbolos Gráficos

- HTML/menu: `config-simbolos-graficos`.
- `app.js`: `simbolos*`.
- JS próprio/namespace: `frontend/js/modules/simbolos-graficos.js`, `window.BranaSimbolosGraficosModule`.
- Backend/endpoints: `/cadastros/simbolos-graficos` em `cadastros_routes.py`, `services/simbolos_service.py`.
- Status frontend: parcialmente modularizado; helper `validarTipoMarcaSimbolo` documentado; módulo fechado novamente.
- Risco: editor, biblioteca, imagens, postMessage, salvar/excluir e vínculo com procedimentos.
- Classificação: Alto risco.
- Prioridade futura: auditoria média; refatoração bloqueada.

### Medicamentos

- HTML/menu: `cadastro-medicamentos`; editor usa medicamentos em assistente de receitas.
- `app.js`: `medicamentos*`.
- JS próprio/namespace: `frontend/js/modules/medicamentos.js`; namespace Brana não capturado.
- Backend/endpoints: `medicamentos_routes.py`, `/medicamentos/*`, e editor assistente.
- Status frontend: mini ciclo encerrado/pausado.
- Risco: CRUD, opções e uso no editor/receitas.
- Classificação: Médio risco.
- Prioridade futura: auditoria média; refatoração baixa/bloqueada.

### Prestadores

- HTML/menu: `cadastro-prestadores`; aparece também em agenda e usuários.
- `app.js`: `prest*` e acoplamentos com agenda/usuários.
- JS próprio/namespace: `frontend/js/modules/prestadores.js`, `window.BranaPrestadoresModule`.
- Backend/endpoints: `prestadores_routes.py`, `/cadastros/prestadores/*`.
- Status frontend: parcialmente modularizado; retomado documentalmente e pausado.
- Risco: UI, renderização, seleção, cache, agenda, convênios e comissões.
- Classificação: Alto risco.
- Prioridade futura: auditoria média; refatoração bloqueada.

### Anamnese

- HTML/menu: `cadastro-ficha-anamnese`, `config-anamnese`.
- `app.js`: `anamnese*`, `fichaAnamnese*`.
- JS próprio/namespace: `frontend/js/modules/anamnese.js`, `window.BranaAnamneseModule`.
- Backend/endpoints: `anamnese_routes.py`, `/anamnese/*`.
- Status frontend: helpers delegados; mini ciclo encerrado.
- Risco: dados clínicos, paciente, perguntas/respostas e duplo clique.
- Classificação: Alto risco.
- Prioridade futura: auditoria média; refatoração bloqueada.

### Materiais

- HTML/menu: `materiais`, `cadastro-controle-estoque`, `materiais-panel`, modais de material/tabela.
- `app.js`: `materiais*`.
- JS próprio/namespace: `frontend/js/modules/materiais.js`, `window.BranaMateriaisModule`.
- Backend/endpoints: `materiais_routes.py`, `/materiais/*`, vínculos via procedimentos.
- Status frontend: parcialmente modularizado; helper delegado; DOM/API/payload no `app.js`.
- Risco: custos, preços, listas e vínculos com procedimentos.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Procedimentos Genéricos

- HTML/menu: `tabelas-procedimentos-genericos`.
- `app.js`: `pgen*`.
- JS próprio/namespace: `frontend/js/modules/procedimentos-genericos.js`, `window.BranaProcedimentosGenericosModule`.
- Backend/endpoints: `/cadastros/procedimentos-genericos/*` em `cadastros_routes.py`.
- Status frontend: parcialmente modularizado; helper `statusDot`; payload auditado documentalmente, mas lógica segue no `app.js`.
- Risco: fases, materiais, custos, payload e vínculo com procedimentos.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Intervenções / Procedimentos

- HTML/menu: `tabelas-procedimentos`, `procedimentos-panel`, `novo-proc-panel`, tratamento.
- `app.js`: `proc*`, `procRelatorio*`.
- JS próprio/namespace: `frontend/js/modules/intervencoes-procedimentos.js`, `window.BranaIntervencoesProcedimentosModule`.
- Backend/endpoints: `procedimentos_routes.py`, `/procedimentos/*`, materiais vinculados e reajuste.
- Status frontend: parcialmente modularizado e pausado por risco.
- Risco: preço, custo, repasse, reajuste, materiais, seleção e relatórios.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Convênios e Planos

- HTML/menu: `cadastro-convenios-planos`.
- `app.js`: `convPlan*`.
- JS próprio/namespace: `frontend/js/modules/convenios-planos.js`, `window.BranaConveniosPlanosModule`.
- Backend/endpoints: `convenios_planos_routes.py`, `/cadastros/convenios-planos/*`.
- Status frontend: helpers delegados; mini ciclo encerrado; wrappers novos não recomendados.
- Risco: vínculo convênio/plano, calendário, pacientes e agenda.
- Classificação: Médio/alto.
- Prioridade futura: auditoria média; refatoração bloqueada nesta rodada.

### Agenda

- HTML/menu: `agenda-dia`, `agenda-semana`, `agenda-proximo`, `agenda-contatos`, `agenda-avisos`, `config-agendas`.
- `app.js`: `agenda*`, `agendaSemana*`, `agendaLegado*`, `agendaContatos*`.
- JS próprio/namespace: não em `frontend/js/modules`; há scripts externos de patch de prestadores/agenda.
- Backend/endpoints: `agenda_legado_routes.py`, `agenda_contatos_routes.py`, Google Agenda service.
- Status frontend: não iniciado; concentrado no `app.js` e patches externos.
- Risco: eventos complexos, calendário, resize, impressão, integrações, pacientes/prestadores.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração após auditoria específica.

### Editor de Textos

- HTML/menu: `ferr-editor-textos`, `ferr-editor-msword`.
- `app.js`: `editorTextos*`.
- JS próprio/namespace: não.
- Backend/endpoints: `editor_textos_routes.py`, `/editor-textos/*`, services PDF/modelos/assinatura.
- Status frontend: não iniciado; maior bloco funcional do `app.js`.
- Risco: DOM rico, cursor/seleção, imagens, tabelas, PDF, assinatura e arquivos.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Cenário financeiro

- HTML/menu: `cenario`, `cenario-panel`, botões/campos de custos.
- `app.js`: `carregarCenario`, `salvarCenario`, `calcularFixosAno`, `dash*`.
- JS próprio/namespace: não.
- Backend/endpoints: `cenario_routes.py`, `/cenario`, `/cenario/calcular-fixos`, `/procedimentos/dashboard`.
- Status frontend: não iniciado; HTML estático + `app.js`.
- Risco: custos, horas, cálculos e indicadores.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Pacientes / Ficha

- HTML/menu: novo/abre/fecha paciente, ficha pessoal, ficha rápida, anamnese, histórico, dados complementares.
- `app.js`: `ficha*`, `fichaAnamnese*`.
- JS próprio/namespace: não.
- Backend/endpoints: `/cadastros/pacientes/*`, `/anamnese/pacientes/*`, `/tratamentos/paciente/*`.
- Status frontend: não iniciado; concentrado no `app.js`.
- Risco: dados clínicos/pessoais, foto, anamnese, convênios e tratamentos.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Caixa/Financeiro

- HTML/menu: relatórios financeiros e menus de financeiro.
- `app.js`: `cc*`, `fcx*`, `rcc*`.
- JS próprio/namespace: não.
- Backend/endpoints: `financeiro_routes.py`, `/financeiro/*`.
- Status frontend: não iniciado.
- Risco: lançamentos, exclusão, gráficos e relatórios financeiros.
- Classificação: Crítico / não mexer agora.
- Prioridade futura: auditoria alta; refatoração bloqueada.

### Configurações gerais

- HTML/menu: `config-relatorios`, `config-opcoes-sistema`, `config-preferencias`, `config-agendas`, `config-alterar-senha`.
- `app.js`: `cnfRelatorio*`, `pref*`, `sysOpt*`, senha em usuários.
- JS próprio/namespace: parcial em preferências/opções.
- Backend/endpoints: preferences, system-options e user-admin.
- Status frontend: parcialmente modularizado só em preferências/opções.
- Risco: configuração transversal e comportamento global.
- Classificação: Alto risco.
- Prioridade futura: auditoria alta; refatoração após nova auditoria.

### Outros módulos encontrados

- Unidades: `unidade*`, `frontend/js/modules/unidades.js`, `window.BranaUnidadesModule`, `/cadastros/unidades-atendimento`; risco médio por agenda/usuários/prestadores.
- CID: `cid*`, `frontend/js/modules/cid.js`, `/cid`; risco médio por uso clínico/editor.
- Tratamentos/orçamentos: menus `tratamento-*`, backend `tratamentos_routes.py`; frontend pouco delimitado e acoplado a paciente/procedimento; risco crítico.
- Superadmin/licença/plataforma: `sa*`, `lic*`, `/superadmin/*`, `/licenca/*`; risco crítico por clínicas, cobrança, trial e licença.

## 14. Listas consolidadas obrigatórias

Módulos com arquivo JS próprio:

- Anamnese, Auxiliares, CID, Convênios e Planos, Etiquetas, Intervenções/Procedimentos, Materiais, Medicamentos, Plano de Contas, Preferências e Opções do Sistema, Prestadores, Procedimentos Genéricos, Símbolos Gráficos, Unidades.

Módulos sem arquivo JS próprio claro:

- Login/sessão/autenticação, Usuários/perfis/permissões, Superadmin/licença/plataforma, Pacientes/ficha, Conta corrente/financeiro, Relatórios/configuração de relatórios, Índices financeiros, Tabela de serviços de prótese/protéticos, Agenda, Editor de textos, Cenário financeiro/dashboard, Tratamentos/orçamentos e configurações gerais fora de preferências/opções.

Módulos com namespace próprio confirmado:

- Anamnese, Convênios e Planos, Intervenções/Procedimentos, Materiais, Plano de Contas, Preferências e Opções do Sistema, Prestadores, Procedimentos Genéricos, Símbolos Gráficos, Unidades.

Módulos com backend/endpoints claros:

- Autenticação, usuários, superadmin/licença, pacientes, anamnese, materiais, procedimentos, procedimentos genéricos, convênios/planos, prestadores, medicamentos, auxiliares, CID, plano de contas, unidades, etiquetas, símbolos, preferências/opções, financeiro, índices, agenda, editor, protéticos, tratamentos e cenário.

Módulos sem separação clara ou com backend espalhado:

- Relatórios gerais, configurações gerais, tratamentos/orçamentos, ferramentas de menu como auditoria/chat/EasyCapture/slide show/usuários conectados, e menus financeiros específicos como comissões internas, contas a receber, recibos, mensalidades e parâmetros de custo fixo.

Módulos com helpers já delegados/documentados:

- Anamnese, Auxiliares, Convênios e Planos, Etiquetas, Intervenções/Procedimentos, Materiais, Medicamentos, Plano de Contas, Preferências e Opções do Sistema, Prestadores, Procedimentos Genéricos, Símbolos Gráficos, Unidades e CID.

Módulos parcialmente modularizados:

- Todos os módulos com arquivo em `frontend/js/modules`, com a ressalva de que a modularização é majoritariamente passiva/de helpers.

Módulos ainda concentrados no `frontend/app.js`:

- Editor de textos, agenda, procedimentos/intervenções, procedimentos genéricos, usuários/permissões, pacientes/ficha, financeiro/conta corrente, cenário financeiro, índices financeiros, protéticos, relatórios, preferências/opções, materiais, convênios, prestadores, anamnese, auxiliares, etiquetas, símbolos, CID, unidades e plano de contas.

Módulos concentrados em arquivos centrais do backend:

- Pacientes, auxiliares, plano de contas, símbolos e procedimentos genéricos em `cadastros_routes.py`.
- Agenda em `agenda_legado_routes.py`.
- Editor em `editor_textos_routes.py`.
- Procedimentos/intervenções em `procedimentos_routes.py`.
- Prestadores em `prestadores_routes.py`.
- Preferências/opções em `preferences_routes.py`.
- Signup/bootstrap em `signup_service.py`.
- Procedimentos legado/vínculos/migração em `procedimentos_legado_service.py`.

Módulos citados em documentos mas não encontrados claramente como menu/painel próprio completo:

- Índices financeiros, cenário financeiro, conta corrente, editor, agenda, usuários, login/sessão, tabela de serviços de prótese, relatórios gerais e superadmin/licença. Eles existem em menu/backend/app.js, mas não foram historicamente auditados com a mesma profundidade dos mini ciclos de helpers.

Módulos encontrados no HTML/menu mas sem documentação adequada/profunda nesta rodada:

- Usuários, login/sessão, conta corrente, relatórios, índices financeiros, tabela de serviços de prótese, agenda, editor de textos, pacientes/ficha, tratamentos, superadmin/licença e ferramentas auxiliares.

## 15. Módulos pausados, encerrados ou retomados recentemente

- Símbolos Gráficos: retomado e fechado novamente; integração funcional não recomendada.
- Prestadores: retomado documentalmente e pausado.
- Convênios e Planos: mini ciclo encerrado; wrappers novos não recomendados.
- Medicamentos: mini ciclo encerrado/pausado.
- Anamnese: mini ciclo encerrado; pausa mantida.
- Preferências e Opções do Sistema: fechado/pausado.
- Auxiliares: ciclo de helpers puros encerrado.
- Etiquetas: ciclo encerrado.
- Plano de Contas: ciclo encerrado.
- Procedimentos Genéricos: parcial, mas alto risco.
- Intervenções/Procedimentos: pausado por risco funcional, materiais, custos e reajustes.
- Materiais: fechamento parcial, com alto risco estrutural remanescente.

Esses módulos não devem voltar como recomendação automática por já terem JS/namespace/docs.

## 16. Módulos não auditados profundamente ou possivelmente esquecidos

- Usuários/perfis/permissões.
- Login/sessão/autenticação.
- Conta corrente/financeiro operacional.
- Relatórios gerais e configuração de relatórios.
- Índices financeiros.
- Tabela de serviços de prótese/protéticos.
- Agenda completa.
- Editor de textos.
- Pacientes/ficha.
- Tratamentos/orçamentos.
- Superadmin/licença/plataforma.
- Cenário financeiro/dashboard.
- Ferramentas de menu: auditoria, chat, EasyCapture, slide show e usuários conectados.
- Menus financeiros específicos: contas a receber, recibos, mensalidades, comissões internas, parâmetros de custo fixo.

## 17. Áreas misturadas entre frontend e backend

- Pacientes: menu/ficha/anamnese/tratamentos no frontend; pacientes em `cadastros_routes.py`, anamnese e tratamentos em rotas separadas.
- Procedimentos: `proc*` e `pgen*` no frontend; backend dividido entre `procedimentos_routes.py`, `cadastros_routes.py`, `services/vinculos_materiais.py` e `procedimentos_legado_service.py`.
- Materiais: módulo próprio passivo, DOM e payload no `app.js`, backend em `materiais_routes.py`, vínculos em procedimentos.
- Financeiro: conta corrente, fluxo de caixa, cenário, índices e plano de contas cruzam `app.js`, `financeiro_routes.py`, `indices_financeiros_routes.py`, `cadastros_routes.py` e `cenario_routes.py`.
- Agenda: frontend muito grande e patches externos; backend legado grande e integração Google.
- Editor: frontend gigante; backend grande e serviços múltiplos de PDF/modelos/assinatura.
- Usuários/permissões: HTML/app.js/backend/security conectados por sessão, senha e autorização.
- Preferências/opções: módulo passivo, `app.js`, preferences backend, system options e configuração de relatórios.

## 18. Matriz de risco por módulo

| Módulo | Classificação | Motivo principal | Auditoria futura | Refatoração futura |
|---|---|---|---|---|
| Login/sessão/autenticação | Crítico / não mexer agora | acesso, tenant, token, trial | alta | bloqueada |
| Usuários/permissões | Crítico / não mexer agora | senha, perfis, permissões | alta | bloqueada |
| Superadmin/licença | Crítico / não mexer agora | plataforma, clínicas, cobrança | alta | bloqueada |
| Pacientes/ficha | Crítico / não mexer agora | dados clínicos/pessoais | alta | bloqueada |
| Anamnese | Alto risco | paciente, perguntas/respostas | média | bloqueada por anti-reciclagem |
| Materiais | Crítico / não mexer agora | custos, listas, vínculos | alta | bloqueada |
| Procedimentos/intervenções | Crítico / não mexer agora | preços, reajustes, materiais | alta | bloqueada |
| Procedimentos genéricos | Crítico / não mexer agora | fases, materiais, payload | alta | bloqueada |
| Convênios e Planos | Médio/alto | vínculo e faturamento | média | bloqueada nesta rodada |
| Prestadores | Alto risco | agenda, convênios, comissões | média | bloqueada nesta rodada |
| Medicamentos | Médio risco | CRUD e editor/receitas | média | baixa/bloqueada |
| Auxiliares | Médio/alto | alimenta selects globais | média | baixa/bloqueada |
| CID | Médio risco | clínico/editor atestado | média | baixa |
| Plano de Contas | Alto risco | financeiro/categorias | média | bloqueada |
| Unidades | Médio risco | agenda, usuários, prestadores | média | baixa |
| Etiquetas | Médio risco | layout/impressão | média | baixa |
| Símbolos Gráficos | Alto risco | editor, imagem, postMessage | média | bloqueada |
| Preferências/opções | Alto risco | configuração transversal | média | bloqueada |
| Relatórios | Alto risco | impressão/exportação/domínios | alta | após auditoria |
| Conta corrente/financeiro | Crítico / não mexer agora | lançamentos/exclusões | alta | bloqueada |
| Índices financeiros | Crítico / não mexer agora | reajustes/cálculos | alta | bloqueada |
| Prótese/protéticos | Alto risco | serviços/relatórios | alta | após auditoria |
| Agenda | Crítico / não mexer agora | eventos, calendário, integrações | alta | após auditoria |
| Editor de textos | Crítico / não mexer agora | DOM rico, PDF, assinatura | alta | bloqueada |
| Cenário financeiro | Crítico / não mexer agora | custos e cálculos | alta | bloqueada |
| Tratamentos/orçamentos | Crítico / exige auditoria própria | paciente/procedimento/financeiro | alta | após auditoria |

## 19. Ordem sugerida para auditorias documentais futuras

1. Auditoria específica de Usuários, Perfis e Permissões.
2. Auditoria específica de Login, Sessão e Autenticação.
3. Auditoria específica de Conta Corrente e Financeiro operacional.
4. Auditoria específica de Índices Financeiros e reajustes/cotações.
5. Auditoria específica de Tabela de Serviços de Prótese e Protéticos.
6. Mapa visual de menus, telas, painéis, modais e IDs do `index.html`.
7. Auditoria backend/endpoints por domínio, começando por `cadastros_routes.py`, `procedimentos_routes.py`, `agenda_legado_routes.py` e `editor_textos_routes.py`.
8. Auditoria específica de Pacientes/Ficha.
9. Auditoria específica de Agenda.
10. Auditoria específica de Editor de Textos.
11. Plano de reorganização documental dos `untracked` antigos em `docs/`, sem limpar automaticamente.

## 20. Ordem sugerida para modularização futura

Nenhuma modularização funcional deve ocorrer antes da revisão humana deste documento.

Quando houver revisão e autorização, a ordem segura deve ser:

1. Mapear visualmente menus/telas/IDs e contratos HTML x `app.js`.
2. Auditar backend/endpoints por domínio sem alterar rotas.
3. Escolher apenas helper puro, inédito, sem DOM, sem estado, sem payload, sem `requestJson`, sem eventos e sem vínculos.
4. Evitar como primeira escolha: usuários, autenticação, financeiro, índices, procedimentos, materiais, agenda e editor.
5. Não reciclar módulos pausados/encerrados sem justificativa objetiva excepcional.

Candidatos futuros de frontend somente após auditoria adicional:

- Pequenos helpers de configuração de relatórios, se forem puros e sem DOM/API.
- Pequenos helpers de protéticos, se forem apenas formatadores e não tocarem serviços/relatórios/backend.
- Pequenos normalizadores de usuários apenas se não tocarem senha, permissões, API ou sessão; ainda assim não recomendado como primeira escolha.

Candidatos futuros de backend somente após auditoria adicional:

- Separar serviços de `cadastros_routes.py` por domínio.
- Separar regras de `procedimentos_routes.py` para services específicos.
- Separar `agenda_legado_routes.py` em agenda, avisos, Google e combos.
- Separar `editor_textos_routes.py` em modelos, PDF, assinatura e assistentes.
- Extrair `signup_service.py` em bootstrap, replicação e seed.

## 21. Conclusão e próxima etapa documental

Nenhuma alteração funcional deve ocorrer antes de esta auditoria ser revisada pelo usuário.

Próxima etapa documental recomendada:

1. Auditoria específica de módulos ainda não auditados profundamente, começando por Usuários/Permissões e Login/Sessão.
2. Mapa visual de menus/telas/IDs do `index.html`.
3. Auditoria backend/endpoints por domínio, com foco nos concentradores `cadastros_routes.py`, `procedimentos_routes.py`, `agenda_legado_routes.py` e `editor_textos_routes.py`.

## 22. Resultado consolidado

- Inventário mestre dos módulos do sistema: concluído.
- Mapa do que está concentrado no `frontend/app.js`: editor, agenda, procedimentos, usuários, ficha, financeiro, módulos parcialmente passivos, API, eventos e renderização.
- Mapa do que está concentrado no `frontend/index.html`: menus, painéis críticos, modais, CSS e IDs consumidos pelo `app.js`.
- Mapa dos arquivos em `frontend/js/modules`: 14 arquivos.
- Mapa dos namespaces: 10 namespaces `window.Brana...Module` capturados.
- Mapa inicial do backend/endpoints: 26 arquivos de rota e 269 endpoints.
- Módulos com frontend e backend identificados: maioria dos domínios centrais, mas com frontend ainda centralizado no `app.js`.
- Módulos sem separação clara: relatórios gerais, configurações gerais, tratamentos/orçamentos, ferramentas auxiliares e financeiros específicos.
- Módulos ainda não auditados profundamente: usuários, login/sessão, conta corrente, relatórios, índices financeiros, serviços de prótese, agenda, editor, pacientes, superadmin/licença e tratamentos.
- Áreas bloqueadas por alto risco: autenticação, usuários/permissões, financeiro, índices, materiais, procedimentos, agenda, editor, pacientes, superadmin/licença e cenário financeiro.
