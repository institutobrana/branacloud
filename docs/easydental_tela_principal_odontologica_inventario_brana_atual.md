# Inventario do Brana Cloud atual para a futura tela principal odontologica

## 1. Objetivo
Este documento registra o inventario do que ja existe no Brana Cloud e pode ser reaproveitado futuramente para a tela principal odontologica inspirada no EasyDental.

Esta e uma etapa documental.
Nenhuma implementacao foi iniciada.
Nao ha mudanca de backend, banco, seeds, endpoints, assets ou `frontend/app.js` nesta etapa.

## 2. Documentos-base consultados

### 2.1 Documentos principais desta trilha
- `docs/easydental_tela_principal_odontograma_auditoria_prints_fontes_locais.md`
- `docs/easydental_tela_principal_odontologica_contrato_funcional.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

### 2.2 Outros documentos relevantes encontrados
- `docs/easydental_tela_principal_odontograma_mapeamento_e_plano.md`
- `docs/easydental_investigacao_tela_principal_odontograma_y_eds70.md`
- `docs/brana_odontograma_especificacao_implementacao_modular.md`
- `docs/brana_odontograma_plano_subtarefas_implementacao.md`
- `docs/odontograma_v1_frontend_bootstrap_leitura.md`
- `docs/odontograma_v1_refino_visual_arcada_leitura.md`
- `docs/odontograma_v1_reorganizacao_layout_clinico.md`
- `docs/odontograma_v1_refino_geometria_arcada_por_referencia_easy.md`
- `docs/odontograma_assets_easy_auditoria.md`
- `docs/odontograma_assets_easy_inspecao_visual_bmps.md`
- `docs/ficha_pessoal_aba_historico.md`
- `docs/ficha_pessoal_historico_contrato_refatoracao_propriedades_da_linha.md`

## 3. Inventario geral do frontend atual

### 3.1 Shell, menu, toolbar e apresentacao geral
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/index.html` | Host principal da aplicacao, com menus, scripts e pontos de entrada visuais | Base de shell global onde a futura tela odontologica deve conviver | Core/comum | Sim | Alto | Ja concentra estrutura global e includes de varios modulos | Reaproveitar como shell, sem mexer agora |
| `frontend/js/modules/odontograma-v1-shell.js` | Moldura visual da tela odontologica V1 | E o ponto mais direto de reaproveitamento para a tela principal odontologica | Especifico de Odontologia | Sim | Medio | Ja organiza contexto, painel direito e area principal | Reaproveitar e estudar depois |
| `frontend/js/modules/odontograma-v1-layout.js` | Layout responsivo e composicao visual do odontograma V1 | Apoia a distribuicao das regioes da tela principal | Especifico de Odontologia | Sim | Medio | Centraliza grid, hero, contexto e rail lateral | Reaproveitar, mas sem expandir agora |
| `frontend/js/modules/users-admin-modal-visual.js` | Visual de modal de administracao de usuarios | Pode servir de referencia de chrome/modal global | Core/comum | Parcialmente | Medio | Auxilia padroes de janela/modais | Estudar depois |
| `frontend/prestadores_override.js` e `frontend/prestadores_agenda_*.js` | Patches/ajustes visuais e de agenda associados a prestadores | Indicam acoplamentos existentes entre prestadores e agenda | Core/comum com uso clinico | Parcialmente | Alto | Sao patches legados e podem tocar comportamento sensivel | Nao mexer agora |

### 3.2 Odontograma e fluxo clinico odontologico
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/js/modules/odontograma-v1.js` | Orquestracao do fluxo V1 do odontograma | E o principal candidato para o fluxo de paciente, tratamento, resumo e historico | Especifico de Odontologia | Sim | Alto | Usa estado, tratamento, resumo, agenda e historico | Reaproveitar, mas nao mexer agora |
| `frontend/js/modules/odontograma-v1-paciente-search.js` | Busca e abertura de paciente | Base direta para o campo Paciente do contrato funcional | Core/comum com uso odontologico | Sim | Medio | Ja pesquisa por codigo/nome e abre contexto | Reaproveitar |
| `frontend/js/modules/odontograma-v1-arcada-render.js` | Renderizacao da arcada e elementos do odontograma | Base visual direta para o bloco odontograma | Especifico de Odontologia | Sim | Alto | Trata a arcada como area principal visual | Reaproveitar, com cautela |
| `frontend/js/modules/odontograma-v1-history-grid.js` | Grade de historico do odontograma V1 | Base para o historico inferior da tela principal | Especifico de Odontologia | Sim | Medio | Ja sabe renderizar grade e vazio controlado | Reaproveitar e estudar depois |
| `frontend/js/modules/intervencoes-procedimentos.js` | Namespace passivo para intervencoes/procedimentos | Pode apoiar a futura faixa de procedimentos e regras | Especifico de Odontologia | Parcialmente | Medio | Foi marcado como namespace passivo controlado | Estudar depois, sem mexer agora |
| `frontend/js/modules/procedimentos-genericos.js` | Helpers e namespace de procedimentos genericos | Apoia catalogo, simbolos e fluxo de procedimentos | Especifico de Odontologia | Parcialmente | Medio | Possui helpers e lista de funcoes monoliticas antigas | Reaproveitar com wrapper/fallback depois |
| `frontend/js/modules/tabela-proteticos-helpers.js` | Helpers da tabela protetica | Pode influenciar a area de procedimentos especializados | Especifico de Odontologia | Parcialmente | Medio | Relacionado a procedimentos/protese | Estudar depois |

### 3.3 Ficha pessoal, historico e prontuario clinico
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/js/modules/ficha-pessoal-aba-historico.js` | Grade e regras do historico do paciente | E o paralelo mais forte para a grade inferior odontologica | Especifico de Odontologia | Sim | Alto | Ja lida com linha, selecao, data e prestador | Reaproveitar conceitualmente, nao mexer agora |
| `frontend/js/modules/ficha-pessoal-aba-historico-propriedades-da-linha.js` | Modal/propriedades da linha do historico | Pode inspirar dialogo/propriedades futuras do odontograma | Especifico de Odontologia | Parcialmente | Medio | Comportamento de propriedades e edicao controlada | Estudar depois |
| `frontend/js/modules/ficha-pessoal-aba-anamnese.js` | Aba de anamnese | Pode ser contexto clinico associado ao prontuario | Especifico de Odontologia | Parcialmente | Medio | Relacionado ao prontuario, mas nao a tela principal diretamente | Estudar depois |
| `frontend/js/modules/ficha_pessoal_anotacoes.js` | Anotacoes clinicas | Pode apoiar observacoes/resumos da futura tela | Core/comum com uso clinico | Parcialmente | Medio | Area de texto/anotacao de paciente | Reaproveitar se necessario, com cautela |
| `frontend/js/modules/anamnese.js` | Fluxo de anamnese | Contexto clinico complementar, nao bloco principal | Especifico de Odontologia | Parcialmente | Medio | Pode apoiar prontuario e observacoes | Estudar depois |

### 3.4 Agenda, prestadores e contexto operacional
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/js/modules/agenda-principal-legado-utils.js` | Utilitarios de agenda legada | Pode sustentar a agenda resumida do dia | Core/comum com uso odontologico | Sim | Medio | Expõe formatacao de data, hora e ranges | Reaproveitar, sem tocar agora |
| `frontend/js/modules/agenda-principal-semana-utils.js` | Utilitarios de agenda semanal/standalone | Pode apoiar agenda resumida e navegação futura | Core/comum com uso odontologico | Sim | Medio | Ajuda com modo standalone e query params | Reaproveitar, sem tocar agora |
| `frontend/js/modules/agenda-contatos-telefones.js` | Agenda de contatos/telefones | Indica infra de contatos ligada ao contexto agenda | Core/comum | Parcialmente | Medio | Area adjacente, nao tela principal | Estudar depois |
| `frontend/js/modules/agenda-contatos-listagem.js` | Listagem de contatos | Pode ser apoio lateral ao contexto do paciente | Core/comum | Parcialmente | Medio | Nao e odontograma, mas ajuda em dados de apoio | Estudar depois |
| `frontend/js/modules/prestadores.js` | Cadastro/listagem de prestadores | Pode apoiar cabecalhos, cirurgiao e contexto clinico | Core/comum com uso clinico | Sim | Medio | Interface de listagem/seleção de prestadores | Reaproveitar futuramente, sem mexer agora |

### 3.5 Procedimentos, materiais, tabelas e catalogos auxiliares
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/js/modules/procedimentos-genericos.js` | Helpers de procedimentos genericos | Base de catalogo/labels de procedimento | Especifico de Odontologia | Sim | Medio | Namespace passivo controlado | Reaproveitar depois |
| `frontend/js/modules/intervencoes-procedimentos.js` | Regras/namespace de intervencoes | Apoio para lista/tabela de procedimentos | Especifico de Odontologia | Parcialmente | Medio | Ainda marcado como passivo | Estudar depois |
| `frontend/js/modules/cid.js` | Catalogo de CID | Pode apoiar historico e tratamentos | Core/comum com uso clinico | Parcialmente | Medio | Bloco clinico auxiliar, nao principal | Estudar depois |
| `frontend/js/modules/materiais.js` | Cadastro/listagem de materiais | Pode interferir em procedimentos e historico | Core/comum com uso odontologico | Parcialmente | Alto | Tem impacto em outros modulos | Nao mexer agora |
| `frontend/js/modules/medicamentos.js` | Cadastro/listagem de medicamentos | Apoio clinico paralelo ao prontuario | Core/comum com uso clinico | Parcialmente | Medio | Nao e bloco principal da tela odontologica | Estudar depois |
| `frontend/js/modules/simbolos-graficos.js` | Simbolos/legendas graficas | Pode ajudar na semantica visual do odontograma | Especifico de Odontologia | Parcialmente | Medio | Relacionado a iconografia e simbolos | Reaproveitar depois, sem copiar assets |
| `frontend/js/modules/convenios-planos.js` | Convenios e planos | Pode influenciar tratamento e agenda administrativa | Core/comum | Parcialmente | Medio | Mais administrativo que visual | Estudar depois |
| `frontend/js/modules/plano-contas.js` | Planos/contas | Baixa relacao direta com a tela odontologica | Core/comum | Pouco | Medio | Area adjacente, nao central | Nao mexer agora |
| `frontend/js/modules/unidades.js` | Unidades de atendimento | Contexto operacional da tela principal | Core/comum | Sim | Medio | Pode apoiar cabecalho e contexto da clinica | Reaproveitar se surgir necessidade |

### 3.6 Documentos, textos, editor e apoio visual
| Caminho | Funcao provavel | Relacao com a futura tela odontologica | Classificacao | Reutilizavel? | Risco de mexer agora | Observacoes | Recomendacao |
|---|---|---|---|---|---|---|---|
| `frontend/js/modules/editor_textos_bootstrap.js` | Bootstrap de editor de textos | Pode apoiar documentos e observacoes | Core/comum | Parcialmente | Medio | Ligado a editor de textos/documentos | Estudar depois |
| `frontend/js/modules/etiquetas.js` | Etiquetas e modelos | Pode apoiar impressos/documentos do contexto odontologico | Core/comum | Parcialmente | Medio | Relacionado a modelos/impressao | Estudar depois |
| `frontend/js/modules/users-admin-modal-visual.js` | Modal visual admin | Pode servir de referencia de chrome/padrao de modal | Core/comum | Parcialmente | Medio | Ajuda a identificar componentes padrao | Estudar depois |

### 3.7 Resumo rapido do frontend reaproveitavel
- Reaproveitamento alto: `frontend/index.html`, `frontend/js/modules/odontograma-v1.js`, `frontend/js/modules/odontograma-v1-shell.js`, `frontend/js/modules/odontograma-v1-paciente-search.js`, `frontend/js/modules/odontograma-v1-layout.js`, `frontend/js/modules/odontograma-v1-history-grid.js`, `frontend/js/modules/ficha-pessoal-aba-historico.js`, `frontend/js/modules/agenda-principal-legado-utils.js`, `frontend/js/modules/agenda-principal-semana-utils.js`
- Reaproveitamento medio: `frontend/js/modules/intervencoes-procedimentos.js`, `frontend/js/modules/procedimentos-genericos.js`, `frontend/js/modules/prestadores.js`, `frontend/js/modules/simbolos-graficos.js`, `frontend/js/modules/cid.js`, `frontend/js/modules/etiquetas.js`, `frontend/js/modules/editor_textos_bootstrap.js`
- Nao recomendado mexer agora: `frontend/index.html` como estrutura global, `frontend/prestadores_agenda_*.js`, `frontend/js/modules/materiais.js`, `frontend/js/modules/plano-contas.js`

## 4. Inventario do backend atual

### 4.1 Pacientes, clinica e contexto de cadastro
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/paciente.py` | Modelo de pacientes | Base direta para campo paciente e historico | Alto | Reaproveitar conceitualmente, sem mexer agora |
| `backend/routes/cadastros_routes.py` | Rotas de cadastro e busca de pacientes | Fonte principal para carregar paciente ativo | Alto | Reaproveitar, nao alterar nesta etapa |
| `backend/models/clinica.py` | Modelo de clinica | Contexto de multi-clinica e identidade da tela | Medio | Reaproveitar se necessario |
| `backend/models/unidade_atendimento.py` | Unidade de atendimento | Contexto operacional da tela e agenda | Medio | Reaproveitar se necessario |
| `backend/models/usuario.py` | Usuario logado e links de sessao | Relacionado a contexto de prestador e unidade | Medio | Reaproveitar se necessario |
| `backend/models/contato.py` | Contatos auxiliares | Pode influenciar agenda e informacoes de paciente | Medio | Estudar depois |

### 4.2 Odontograma e tratamento
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/odontograma_model.py` | Estrutura persistente do odontograma V1 | E o nucleo tecnico do odontograma futuro | Alto | Reaproveitar, mas nao mexer agora |
| `backend/contracts/odontograma_contract.py` | Contratos tipados do odontograma | Define leitura e payloads futuros | Alto | Reaproveitar conceitualmente |
| `backend/schemas/odontograma_schema.py` | Schemas do odontograma | Valida entrada/saida do odontograma | Alto | Reaproveitar, sem alterar |
| `backend/repositories/odontograma_repository.py` | Repositorio de acesso ao odontograma | Base de leitura e persistencia futura | Alto | Reaproveitar |
| `backend/services/odontograma_service.py` | Servico de orquestracao do odontograma | Monta resumo e conversoes de dados | Alto | Reaproveitar |
| `backend/routes/odontograma_routes.py` | Endpoints do odontograma | Endpoint direto para a tela principal | Alto | Reaproveitar, sem mexer agora |
| `backend/scripts/aplicar_migracao_odontograma_v1.py` | Migracao do odontograma V1 | Indica o estado tecnico ja existente | Alto | Nao executar nem alterar |
| `backend/models/tratamento.py` | Modelo de tratamento | Base da tela com paciente aberto | Alto | Reaproveitar conceitualmente |
| `backend/routes/tratamentos_routes.py` | Rotas de tratamentos por paciente | Necessario para estado com paciente e historico | Alto | Reaproveitar, sem tocar agora |

### 4.3 Procedimentos, tabelas e catalogos
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/procedimento.py` | Procedimento base | Apoio direto para lista/tabela de procedimentos | Alto | Reaproveitar |
| `backend/models/procedimento_generico.py` | Procedimento generico e fases/materiais | Apoio para catalogo e composicao de procedimentos | Alto | Reaproveitar com cautela |
| `backend/models/procedimento_tabela.py` | Tabela de procedimentos | Base para menu/filtro de procedimentos | Alto | Reaproveitar |
| `backend/routes/procedimentos_routes.py` | Rotas de procedimentos | Endpoints principais para lista e consulta | Alto | Reaproveitar |
| `backend/seeds/procedimentos_padrao.py` | Seeds padrao de procedimentos | Fonte de dados iniciais | Alto | Nao alterar agora |
| `backend/seeds/procedimentos_genericos.py` | Seeds de procedimentos genericos | Fonte de dados estruturais | Alto | Nao alterar agora |
| `backend/seeds/procedimentos_easy_tabelas.py` | Seeds oriundas do Easy | Fonte de compatibilidade legada | Alto | Nao alterar agora |
| `backend/seeds/procedimentos_brana.py` | Seeds do Brana | Base local do catalogo | Alto | Nao alterar agora |
| `backend/services/procedimentos_legado_service.py` | Servico legado de procedimentos | Pode explicar herancas e compatibilidade | Alto | Estudar depois |
| `backend/scripts/migrar_tabelas_procedimentos_easy.py` | Migracao de tabelas de procedimentos | Indicio de processo de importacao legado | Alto | Nao executar nem alterar |

### 4.4 Agenda, prestadores e contatos
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/agenda_legado.py` | Agenda legada persistida | Base da agenda resumida e do dia | Alto | Reaproveitar com cautela |
| `backend/routes/agenda_legado_routes.py` | Rotas da agenda legada | Fonte mais rica para agenda resumida, export e consultas | Alto | Reaproveitar, sem mexer agora |
| `backend/routes/agenda_contatos_routes.py` | Agenda de contatos | Apoio lateral ao contexto de agenda | Medio | Estudar depois |
| `backend/services/google_calendar_service.py` | Integracao com Google Calendar | Pode ser dependencia futura da agenda | Alto | Nao mexer agora |
| `backend/services/modelos_service.py` | Modelos de texto/documento | Apoio a documentos e lembretes de agenda | Medio | Estudar depois |
| `backend/scripts/migrar_agenda_legado_csv.py` | Migracao da agenda legada | Indica importacao/import history | Alto | Nao executar nem alterar |
| `backend/scripts/migrar_agenda_config_easy_para_saas.py` | Migracao de config da agenda | Indica compatibilidade legada | Alto | Nao executar nem alterar |
| `backend/models/prestador.py` | Prestador base | Apoio a assinatura/cirurgiao/prestador | Alto | Reaproveitar conceitualmente |
| `backend/models/prestador_odonto.py` | Prestador odontologico | Relacao direta com tratamento, agenda e usuario | Alto | Reaproveitar com cautela |
| `backend/routes/prestadores_routes.py` | Rotas de prestadores | Pode alimentar campos de cirurgiao/prestador | Alto | Reaproveitar |
| `backend/scripts/migrar_prestadores_easy_para_saas.py` | Migracao de prestadores | Indicio de importacao legada | Alto | Nao executar nem alterar |
| `backend/scripts/sincronizar_prestadores_padrao.py` | Sincronizacao de prestadores padrao | Pode manter base inicial consistente | Alto | Nao executar nem alterar |

### 4.5 Documentos, imagens, simbolos, relatorios e assinaturas
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/modelo_documento.py` | Modelos de documento | Apoio a documentos e impressos na coluna direita | Medio | Reaproveitar se necessario |
| `backend/routes/editor_textos_routes.py` | Rotas de editor de textos | Apoio a observacoes e textos de apoio | Medio | Estudar depois |
| `backend/services/editor_pdf_service.py` | Geração/edição de PDF | Apoio a documentos e relatorios | Medio | Estudar depois |
| `backend/services/digital_signature_service.py` | Assinatura digital | Dependencia de documentos formais | Medio | Estudar depois |
| `backend/models/simbolo_grafico.py` | Catalogo de simbolos graficos | Pode apoiar semantica visual do odontograma | Alto | Reaproveitar conceitualmente |
| `backend/services/simbolos_service.py` | Servico de simbolos | Apoio aos simbolos graficos e catalogos | Alto | Reaproveitar depois |
| `backend/models/relatorio_config.py` | Configuracao de relatorios | Apoio lateral a documentos/impressos | Medio | Estudar depois |
| `backend/routes/relatorios_routes.py` | Rotas de relatorios | Apoio a documentos e visualizacao de saidas | Medio | Estudar depois |
| `backend/models/assinatura.py` | Assinaturas da plataforma | Relevancia indireta para documentos | Medio | Estudar depois |

### 4.6 Permissoes, usuarios e seguranca
| Caminho | Funcao provavel | Dependencia para a tela odontologica | Risco | Recomendacao futura |
|---|---|---|---|---|
| `backend/models/access_profile.py` | Perfis de acesso | Indica matriz de permissoes da aplicacao | Alto | Reaproveitar conceitualmente |
| `backend/models/usuario_perfil_acesso.py` | Vinculo usuario/prestador/perfil | Pode impactar visibilidade da tela e recursos | Alto | Reaproveitar, sem tocar agora |
| `backend/security/permissions.py` | Regras de permissao | Dependencia transversal de acesso | Alto | Nao mexer agora |
| `backend/services/access_profiles_service.py` | Servico de perfis de acesso | Suporte a regras de visibilidade | Alto | Estudar depois |
| `backend/seeds/access_profiles_default.py` | Seeds padrao de perfis | Fonte de permissao inicial | Alto | Nao alterar agora |
| `backend/seeds/access_profiles_bootstrap.py` | Bootstrap de perfis | Fonte de inicializacao | Alto | Nao alterar agora |
| `backend/seeds/access_profiles_dry_run.py` | Dry-run de perfis | Evidencia de operacoes controladas | Alto | Nao alterar agora |
| `backend/routes/user_admin_routes.py` | Admin de usuarios e vinculos | Pode impactar links com prestador/unidade/permissao | Alto | Nao mexer agora |
| `backend/routes/auth_routes.py` | Autenticacao | Base de sessao para a tela | Alto | Reaproveitar somente via fluxo existente |
| `backend/routes/system_options_routes.py` | Opcoes de sistema | Pode influenciar comportamento global da tela | Alto | Estudar depois |
| `backend/routes/preferences_routes.py` | Preferencias | Pode afetar comportamentos visuais/funcionais | Alto | Estudar depois |

### 4.7 Inventario backend resumido
- Odontograma e tratamento ja existem em backend com modelos, schemas, servico, repositorio e rotas.
- Pacientes, prestadores, usuarios, unidade e clinica ja existem como base de contexto.
- Procedimentos, tabelas e seeds existem em varias camadas, com suporte a legado.
- Agenda legada e contatos de agenda ja possuem rotas e modelos proprios.
- Documentos, relatorios, simbolos e assinatura ja existem como blocos adjacentes.
- Permissoes e perfis ja existem e devem ser tratados como dependencia sensivel.

## 5. Inventario de banco/schema/seeds/migrations
### 5.1 Indicios de tabelas/modelos relevantes por categoria
| Categoria | Tabelas/modelos indicados pelo codigo | Observacoes | Risco de mexer agora |
|---|---|---|---|
| Pacientes | `pacientes` | Base direta da tela principal | Alto |
| Odontograma | `odontograma_intervencao_status`, `odontograma_arcada_slots`, `odontograma_intervencoes`, `odontograma_dentes`, `odontograma_faces` | E o nucleo tecnico do odontograma V1 | Alto |
| Tratamento | `tratamento` | Base do estado com paciente e historico | Alto |
| Procedimentos | `procedimento`, `procedimento_generico`, `procedimento_tabela`, `procedimento_material`, `procedimento_fase` | Base para lista/tabela e filtros | Alto |
| Agenda | `agenda_legado_evento`, `agenda_legado_bloqueio` | Base da agenda resumida e agendamento | Alto |
| Prestadores | `prestador`, `prestador_odonto`, `prestador_credenciamento`, `prestador_comissao`, `prestador_credenciamento_odonto`, `prestador_comissao_odonto` | Base de cirurgiao/prestador e agenda | Alto |
| Documentos/relatorios/imagens | `modelos_documento`, `assinaturas`, `simbolo_grafico_catalogo`, `relatorio_config` | Suporte a impressos, docs e simbolos | Medio/alto |
| Permissoes | `usuarios`, `usuario_perfil_acesso`, `access_profile`, `unidade_atendimento`, `clinicas` | Eixo de acesso e contexto da sessao | Alto |
| Anamnese/prontuario | `anamnese_questionarios`, `anamnese_perguntas`, `anamnese_respostas` | Contexto clinico complementar | Medio |
| Convenios/planos | `convenio_odonto`, `plano_odonto`, `calendario_faturamento_odonto` | Apoio administrativo e financeiro | Medio |
| Materiais/medicamentos/proteticos | `lista_material`, `material`, `medicamento`, `restricao_terapeutica`, `protetico`, `servico_protetico`, `controle_protetico` | Areas adjacentes, nao centrais para a tela principal | Medio |

### 5.2 Seeds, migrations e scripts mais ligados ao inventario
- `backend/seeds/procedimentos_padrao.py`
- `backend/seeds/procedimentos_genericos.py`
- `backend/seeds/procedimentos_easy_tabelas.py`
- `backend/seeds/procedimentos_brana.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/seeds/simbolos_graficos.py`
- `backend/scripts/aplicar_migracao_odontograma_v1.py`
- `backend/scripts/aplicar_schema_anamnese_etapa1.py`
- `backend/scripts/aplicar_schema_medicamentos.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `backend/scripts/migrar_agenda_legado_csv.py`
- `backend/scripts/migrar_agenda_config_easy_para_saas.py`
- `backend/scripts/migrar_pacientes_gleisson.py`
- `backend/scripts/extrair_pacientes_eds70.py`
- `backend/scripts/migrar_prestadores_easy_para_saas.py`
- `backend/scripts/migrar_tabelas_procedimentos_easy.py`
- `backend/scripts/migrar_permissoes_usuarios_eds70.py`
- `backend/scripts/relatorio_permissoes_modulo_eds70.py`

### 5.3 Leitura conservadora do banco/schema
- O banco/schema ja contem suporte direto ao odontograma, tratamento e pacientes.
- As tabelas de procedimentos e prestadores tambem estao presentes e so devem ser consumidas por contrato.
- Seeds de procedimentos e perfis ja existem, mas nao devem ser alteradas nesta etapa.
- Scripts de migracao/compatibilidade indicam que o repo carrega herancas de bases legadas e devem ser tratados somente como referencia.

## 6. Mapa por bloco do contrato funcional
| Bloco do contrato | Situacao no Brana Cloud | Classificacao | Observacoes |
|---|---|---|---|
| Menu superior | Existe via `frontend/index.html` | Existente e reaproveitavel | E shell global e nao deve ser recriado |
| Toolbar superior | Existe em shell e modais/atalhos existentes | Existente, mas precisa estudar | Patches e toolbars espalhados exigem cuidado |
| Campo paciente ativo | Existe via `odontograma-v1-paciente-search.js` e `cadastros_routes.py` | Existente e reaproveitavel | Base forte para o contrato funcional |
| Estado sem paciente | Existe no odontograma V1 | Existente e reaproveitavel | Ja ha leitura vazia/neutral |
| Estado com paciente aberto | Existe no odontograma V1 e tratamento | Existente, mas precisa estudar | Depende de tratamento e resumo |
| Odontograma | Existe em V1 completo com arcada | Existente, mas precisa estudar | Area mais sensivel para reaproveitamento |
| Filtro intervencoes/tratamento | Existe em V1 como selecao de tratamento/filtro | Existente, mas precisa estudar | Depende do ciclo de tratamento |
| Lista/tabela de procedimentos | Existe em modulos de procedimentos e intervencoes | Existente, mas precisa estudar | Forte dependencia de catalogo |
| Historico inferior | Existe em V1 e na ficha pessoal | Existente e reaproveitavel | Grande candidato a reaproveitamento |
| Atalhos laterais | Existe em partes de procedimentos e shell | Existente, mas nao recomendado mexer agora | Pode virar area de acao controlada |
| Abas/resumos (Paciente, Tratamento, Observacoes, Imagens, Documentos, Agenda) | Existe parcialmente no shell e em modulos adjacentes | Existente, mas precisa estudar | Muito distribuido e sensivel |
| Agenda resumida do dia | Existe nos modulos de agenda | Existente e reaproveitavel | Precisa estudo para convivencia com odontograma |
| Integracao futura com prontuario/tratamento | Existe em parte, mas fragmentada | Existente, mas precisa estudar | Depende de contrato tecnico proprio |

## 7. Riscos encontrados
- risco de aumentar monolitico;
- risco de mexer em `frontend/app.js`;
- risco de acoplar odontograma com ficha pessoal;
- risco de misturar agenda com tratamento;
- risco de alterar banco antes do contrato tecnico;
- risco de misturar correcoes visuais com mojibake/textos;
- risco de interferir em permissoes;
- risco de reutilizar modulos sem wrapper/fallback;
- risco de tratar modules passivos como prontos para producao;
- risco de puxar agenda/paciente/tratamento para o mesmo fluxo sem separacao clara.

## 8. Recomendacao tecnica para a proxima etapa
Recomendo a Subetapa C: inventario tecnico somente leitura das fontes EasyDental.

Justificativa:
- o Brana Cloud atual ja mostra varias pecas reutilizaveis, mas elas estao distribuidas em shells, modulos, routes, modelos e seeds;
- antes de desenhar qualquer layout estatico novo, ainda falta comparar o que existe hoje com a referencia legada viva;
- a Subetapa C ajuda a separar o que e heranca real do legado do que e apenas equivalente aproximado no Brana;
- isso reduz o risco de reuso incorreto e evita que a proxima fase seja baseada apenas em inferencia interna.

Se, apos a Subetapa C, houver evidencia suficiente, a proxima etapa natural pode ser um desenho tecnico preliminar do layout estatitico sem implementacao.

## 9. Plano conservador de implementacao futura
- Arquivos atuais que provavelmente serao usados:
  - `frontend/index.html`
  - `frontend/js/modules/odontograma-v1.js`
  - `frontend/js/modules/odontograma-v1-shell.js`
  - `frontend/js/modules/odontograma-v1-paciente-search.js`
  - `frontend/js/modules/odontograma-v1-layout.js`
  - `frontend/js/modules/odontograma-v1-arcada-render.js`
  - `frontend/js/modules/odontograma-v1-history-grid.js`
  - `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - `frontend/js/modules/agenda-principal-legado-utils.js`
  - `frontend/js/modules/agenda-principal-semana-utils.js`
  - `backend/routes/cadastros_routes.py`
  - `backend/routes/tratamentos_routes.py`
  - `backend/routes/odontograma_routes.py`
  - `backend/routes/agenda_legado_routes.py`
  - `backend/routes/procedimentos_routes.py`
  - `backend/models/odontograma_model.py`
  - `backend/models/paciente.py`
  - `backend/models/tratamento.py`
  - `backend/models/procedimento.py`
  - `backend/models/agenda_legado.py`
  - `backend/models/prestador_odonto.py`

- Arquivos que nao devem ser tocados agora:
  - `frontend/app.js`
  - `frontend/prestadores_agenda_*.js`
  - `backend/seeds/*`
  - `backend/scripts/*migrar*`
  - `backend/scripts/*aplicar*`
  - qualquer arquivo de banco/compatibilidade ou importacao legada

- Modulos novos que podem surgir futuramente:
  - separador de estados da tela principal odontologica;
  - coordenador de resumo/historico do paciente;
  - painel de agenda resumida;
  - wrapper de procedimentos da tela principal;
  - adaptador de prontuario odontologico.

- Dependencias que precisam de contrato tecnico proprio:
  - prontuario/tratamento;
  - agenda resumida;
  - historico inferior;
  - lista/tabela de procedimentos;
  - odontograma editavel;
  - integracao com documentos/imagens.

## 10. Registro para roadmap
- criado o inventario do Brana Cloud atual para a tela principal odontologica;
- confirmacao de que a implementacao ainda nao comecou;
- principais areas existentes encontradas: odontograma V1, busca de paciente, historico, agenda, prestadores, procedimentos, fichas clinicas, permissao e documento/modelos;
- proxima etapa recomendada: Subetapa C, inventario tecnico somente leitura das fontes EasyDental.
