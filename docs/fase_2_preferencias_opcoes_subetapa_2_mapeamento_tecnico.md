# Fase 2 - Preferencias e Opcoes do Sistema - Subetapa 2 - Mapeamento tecnico por leitura

## 1. Contexto da Fase 2
A Fase 2 continua em evolucao com modularizacao, consolidacao documental por frente e reavaliacao conservadora do proximo caminho.

A frente anterior, Editor de texto, foi pausada/consolidada apos o recorte Bootstrap/abertura e nao deve ser reaberta sem decisao explicita futura do usuario.

## 2. Frente atual e classificacao preliminar
A frente atual e `Preferencias e Opcoes do Sistema`.

A classificacao multiarea preliminar registrada para esta frente continua sendo `configuracao comum`.

Esta leitura e coerente com a dependencia de permissao `configuracao`, com a presenca de configuracoes por usuario e por clinica, e com o fato de o modulo atravessar varios fluxos do sistema sem parecer especifico de uma area clinica isolada.

## 3. Referencias de consolidacao anterior
- Commit `3f2b255` - Consolida recorte bootstrap do editor.
- Commit `c94b8cd` - Reavalia proxima frente apos editor.
- Subetapa 1 da frente atual concluida no commit `7764e9b` - Documenta contrato funcional de preferencias.

## 4. Arquivos lidos
### Documentos
- `docs/fase_2_preferencias_opcoes_subetapa_1_contrato_funcional.md`
- `docs/fase_2_reavaliacao_proxima_frente_pos_editor_texto.md`
- `docs/fase_2_editor_texto_subetapa_7_consolidacao_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`

### Backend
- `backend/routes/preferences_routes.py`
- `backend/routes/system_options_routes.py`
- `backend/main.py`
- `backend/models/clinica.py`
- `backend/models/usuario.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`

### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules`

## 5. Rotas backend identificadas
### `backend/routes/preferences_routes.py`
Router de preferencias por usuario, com prefixo `/preferences` e dependencia de acesso `configuracao`.

Funcoes e rotas identificadas por leitura:
- `_load_preferences_json`
- `_dump_preferences_json`
- `_resolve_target_user`
- `_sanitize_preferences_values`
- `_catalogo_modelos_para_usuario`
- `_sanitize_model_choice`
- `_sanitize_model_preferences`
- `_sanitize_environment_preferences`
- `_sanitize_user_data_values`
- `_sanitize_odontogram_preferences`
- `_load_report_config`
- `_sanitize_report_config`
- `_build_general_payload`
- `_build_model_payload`
- `_build_environment_payload`
- `_build_user_data_payload`
- `_build_odontogram_payload`
- `get_general_preferences`
- `update_general_preferences`
- `get_model_preferences`
- `update_model_preferences`
- `get_environment_preferences`
- `update_environment_preferences`
- `get_user_data_preferences`
- `update_user_data_preferences`
- `get_odontogram_preferences`
- `update_odontogram_preferences`
- `get_report_config`
- `update_report_config`

### `backend/routes/system_options_routes.py`
Router de opcoes por clinica, com prefixo `/system-options` e dependencias de acesso `configuracao` e senha administrativa quando o controle de usuarios esta habilitado.

Funcoes e rotas identificadas por leitura:
- `_default_local_paths`
- `_load_json`
- `_dump_json`
- `_sanitize_response`
- `_merge_defaults`
- `_to_bool`
- `_to_int`
- `_to_str`
- `_normalize_choice`
- `_sanitize_values`
- `_carregar_opcoes_auxiliares`
- `_garantir_admin`
- `_carregar_clinica`
- `obter_opcoes_sistema`
- `atualizar_opcoes_sistema`

## 6. Endpoints identificados
### Preferencias
- `GET /preferences/general`
- `PATCH /preferences/general`
- `GET /preferences/models`
- `PATCH /preferences/models`
- `GET /preferences/environment`
- `PATCH /preferences/environment`
- `GET /preferences/user-data`
- `PATCH /preferences/user-data`
- `GET /preferences/odontogram`
- `PATCH /preferences/odontogram`
- `GET /preferences/report-config`
- `PATCH /preferences/report-config`

### Opcoes do sistema
- `GET /system-options`
- `PATCH /system-options`

## 7. Funcoes frontend identificadas
### Entrada e roteamento de menu
- `menuActionModule`
- `menuActionAccessLevel`
- `menuEnsurePermission`
- bloco de `menuAction` que chama `prefAbrir()` para `config-preferencias`
- bloco de `menuAction` que chama `sysOptAbrir()` para `config-opcoes-sistema`

### Preferencias do usuario
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefTituloAtual`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAtualizarTitulo`
- `prefSelecionarAba`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`
- `prefAmbienteSecoesAtuais`
- `prefAmbienteSecaoAtiva`
- `prefAmbienteEstiloAtual`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`
- `prefAbrirDialogoFonteAmbiente`
- `prefCarregarDados`
- `prefColetarPayload`
- `prefColetarPayloadModelos`
- `prefColetarPayloadAmbiente`
- `prefColetarPayloadDados`
- `prefColetarPayloadOdontograma`
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- `prefEnsureUI`
- `prefAbrir`

### Opcoes do sistema
- `sysOptSelecionarAba`
- `sysOptRenderSelects`
- `sysOptSyncUI`
- `sysOptColetarPayload`
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptFechar`
- `sysOptAbrir`
- `sysOptEnsureUI`

### Modulo passivo de apoio
- `frontend/js/modules/preferencias-opcoes-sistema.js`
  - `getMetadata`
  - `prefOdontoNorm`
  - `prefValoresPadraoModelos`
  - `prefOdontoFindByLabel`

## 8. IDs, seletores e elementos DOM identificados
### Menu e gatilhos
- `data-menu-action="config-preferencias"`
- `data-menu-action="config-opcoes-sistema"`
- `#users-btn-preferencias`

### Backdrops e modais
- `#config-preferencias-backdrop`
- `#config-opcoes-sistema-backdrop`

### Preferencias do usuario
- `#pref-geral-pesquisa`
- `#pref-geral-tabela`
- `#pref-geral-convenio`
- `#pref-geral-msg`
- `#pref-geral-historico`
- `#pref-geral-quadro`
- `#pref-geral-busca`
- `#pref-geral-alarme`
- `#pref-geral-alarme-min`
- `#pref-modelo-atestado`
- `#pref-modelo-receita`
- `#pref-modelo-recibo`
- `#pref-modelo-etiqueta`
- `#pref-modelo-email`
- `#pref-modelo-orcamento`
- `#pref-modelo-whatsapp`
- `#pref-amb-lista`
- `#pref-amb-alterar`
- `#pref-amb-restaurar`
- `#pref-ambiente-fonte`
- `#pref-ambiente-tamanho`
- `#pref-ambiente-cor`
- `#pref-amb-enunciado`
- `#pref-amb-campo-label`
- `#pref-amb-campo-input`
- `#pref-amb-botao-funcao`
- `#pref-amb-lista-1`
- `#pref-amb-lista-2`
- `#pref-amb-lista-3`
- `#pref-dados-nome`
- `#pref-dados-apelido`
- `#pref-dados-email`
- `#pref-dados-endereco`
- `#pref-dados-bairro`
- `#pref-dados-cidade`
- `#pref-dados-cep`
- `#pref-dados-uf`
- `#pref-dados-pais`
- `#pref-dados-telefones`
- `#pref-dados-cro`
- `#pref-dados-cpf`
- `#pref-odonto-especialidade`
- `#pref-odonto-filtro`
- `#pref-odonto-anamnese`
- `#pref-odonto-icones`
- `#pref-odonto-imagens`
- `#pref-odonto-cirurgiao`
- `#pref-odonto-historico-desc`
- `#pref-odonto-dados-paciente`
- `#pref-odonto-dados-tratamento`
- `#pref-odonto-observacoes`
- `#pref-odonto-documentos`
- `#pref-odonto-agenda-dia`
- `#pref-odonto-cor-realizar`
- `#pref-odonto-cor-realizado`
- `#pref-odonto-cor-observada`
- `#pref-odonto-cor-anomalia`
- `#pref-odonto-hint`
- `#pref-btn-ok`
- `#pref-btn-cancel`

### Opcoes do sistema
- `#sysopt-clinica-nome`
- `#sysopt-clinica-endereco`
- `#sysopt-clinica-complemento`
- `#sysopt-clinica-bairro`
- `#sysopt-clinica-cidade`
- `#sysopt-clinica-cep`
- `#sysopt-clinica-uf`
- `#sysopt-clinica-telefones`
- `#sysopt-clinica-cnpj`
- `#sysopt-clinica-ie`
- `#sysopt-fin-indice`
- `#sysopt-fin-moeda`
- `#sysopt-fin-sigla`
- `#sysopt-fin-periodo`
- `#sysopt-fin-cobranca`
- `#sysopt-fin-cat-orto`
- `#sysopt-fin-indice-rel`
- `#sysopt-fin-indices-diarios`
- `#sysopt-fin-baixa-clinica`
- `#sysopt-fin-debitos-convenio`
- `#sysopt-fin-creditos-futuros`
- `#sysopt-seg-usuarios`
- `#sysopt-seg-auditoria`
- `#sysopt-seg-permissoes`
- `#sysopt-data-formato`
- `#sysopt-data-atual`
- `#sysopt-hora-hh`
- `#sysopt-hora-mm`
- `#sysopt-ano-2000`
- `#sysopt-semanas`
- `#sysopt-av-captura`
- `#sysopt-av-word`
- `#sysopt-av-email`
- `#sysopt-av-imagens`
- `#sysopt-av-cpf`
- `#sysopt-av-dup-cpf`
- `#sysopt-av-debug`
- `#sysopt-av-ignorar`
- `#sysopt-av-salvar`
- `#sysopt-av-agenda`
- `#sysopt-av-orcamento`
- `#sysopt-av-dente3d`
- `#sysopt-av-cep`
- `#sysopt-av-protese`
- `#sysopt-seg-permissoes`
- `#sysopt-btn-ok`
- `#sysopt-btn-cancel`

## 9. Eventos e handlers identificados
### Preferencias
- clique nas abas -> `prefSelecionarAba`
- clique em `#pref-amb-alterar` -> `prefAbrirDialogoFonteAmbiente`
- clique em `#pref-amb-restaurar` -> restauracao do estilo padrao do ambiente
- clique em `#pref-btn-ok` -> salva a aba atual
- clique em `#pref-btn-cancel` -> fecha o backdrop
- `change`/sincronizacao de campos de preferencias conforme carregamento e renderizacao

### Opcoes do sistema
- clique nas abas -> `sysOptSelecionarAba`
- clique em `#sysopt-seg-permissoes` -> `abrirPainelUsuariosConfig(true, true)`
- clique em `#sysopt-btn-ok` -> `sysOptSalvar`
- clique em `#sysopt-btn-cancel` -> `sysOptFechar`
- clique no backdrop -> fecha o modal

### Menu global
- acionamento de `config-preferencias` -> `prefAbrir()`
- acionamento de `config-opcoes-sistema` -> `sysOptAbrir()`

## 10. Estados, variaveis globais, caches e dependencias
Variaveis e estados relevantes identificados em `frontend/app.js`:

- `sessaoAtual`
- `prefCfg`
- `sysOptCfg`
- `protectedGrantCache`
- `protectedGrantPending`
- `usersGrantOverride`
- `footerMsg`
- `menuActionModule`
- `menuActionAccessLevel`
- `MENU_ACTION_MODULE_OVERRIDES`
- `prefLoaded`
- `window.easyFontAbrir` como dependencia do dialogo visual de fonte do ambiente

O modulo `frontend/js/modules/preferencias-opcoes-sistema.js` atua apenas como apoio passivo, com metadata e utilitarios de modelos/odontograma.

## 11. Separacao entre preferencias de usuario e opcoes por clinica
### Preferencias de usuario
Persistidas e manipuladas por meio de `usuario.preferencias_usuario_json` e, no caso de impressao, `usuario.preferencias_impressora_json`.

Essas preferencias incluem:
- gerais;
- modelos;
- ambiente;
- dados do usuario;
- odontograma;
- configuracao de relatorio/impressos.

### Opcoes por clinica
Persistidas em `clinica.opcoes_sistema_json`.

Essa camada controla opcoes sistêmicas da clinica e depende de permissao `configuracao`, com senha administrativa quando o controle de usuarios esta habilitado.

## 12. Mapeamento de dados
Campos identificados por leitura:

- `usuario.preferencias_usuario_json`
- `usuario.preferencias_impressora_json`
- `usuario.preferencias_agenda_json`
- `usuario.preferencias_etiqueta_json`
- `clinica.opcoes_sistema_json`
- `clinica.nome`
- `clinica.cnpj`

Outros dados encontrados no contrato de preferencias:
- `modelo_impresso_atestados_id`
- `modelo_impresso_receitas_id`
- `modelo_impresso_recibos_id`
- `modelo_padrao_etiquetas_id`
- `modelo_texto_email_agenda_id`
- `modelo_padrao_orcamentos_id`
- `modelo_texto_whatsapp_agenda_id`
- `pesquisa_padrao_odontograma`
- `tabela_padrao_id`
- `convenio_padrao_id`
- `mensagem_padrao_orcamentos`
- `historico_padrao_conta_corrente`
- `exibir_quadro_avisos`
- `busca_automatica_pacientes_agendados`
- `alarme_habilitado`
- `alarme_minutos_antecedencia`

## 13. Fluxos funcionais mapeados
### Abertura da tela
- o menu global chama `prefAbrir()` ou `sysOptAbrir()`;
- os modais sao montados por `prefEnsureUI()` e `sysOptEnsureUI()`;
- a tela e exibida como backdrop modal sobre o shell.

### Carregamento
- `prefCarregarDados()` faz chamadas sequenciais aos endpoints de preferencias;
- `sysOptCarregar()` busca as opcoes do sistema da clinica;
- os dados retornam com `values`, `options` e, quando aplicavel, `user`, `clinica` e `integration_hint`.

### Edicao
- a tela de preferencias organiza tabs de geral, modelos, ambiente, dados e odontograma;
- a tela de opcoes organiza tabs de clinica, financeiro, seguranca, data e avancado;
- campos sao preenchidos a partir dos payloads carregados.

### Validacao
- o backend sanitiza e normaliza campos numericos, booleanos, escolhas, modelos e cores;
- a camada de opcoes do sistema valida tambem condicoes de acesso administrativo.

### Salvamento
- preferencias gerais: `PATCH /preferences/general`;
- modelos: `PATCH /preferences/models`;
- ambiente: `PATCH /preferences/environment`;
- dados do usuario: `PATCH /preferences/user-data`;
- odontograma: `PATCH /preferences/odontogram`;
- relatorio/impressos: `PATCH /preferences/report-config`;
- opcoes do sistema: `PATCH /system-options`.

### Permissao configuracao
- o acesso a preferencias e opcoes depende da permissao `configuracao`;
- o fluxo de opcoes do sistema adiciona senha administrativa quando o controle de usuarios esta habilitado.

### Senha administrativa
- a rotina do backend em `system_options_routes.py` chama `_garantir_admin` e `require_admin_password_if_user_control_enabled("configuracao")`;
- o frontend tambem respeita o acesso protegido antes de abrir o fluxo.

## 14. Dependencias com outros modulos
### Clinica
- `clinica.opcoes_sistema_json`;
- `clinica.nome`;
- `clinica.cnpj`.

### Usuario
- preferencias persistidas em JSON;
- contexto de usuario na abertura das telas;
- fluxo de usuario selecionado no painel de usuarios para carregar preferencias de um usuario especifico.

### Sessao
- `sessaoAtual` define o contexto padrao;
- influencia permissao, usuario ativo e abertura inicial.

### Permissoes e perfis
- permissao `configuracao`;
- leitura de grants protegidos;
- perfis e permissao de usuarios conectados.

### Relatorios
- preferencia de relatorio/impressos;
- configuracoes de modelos e contexto de impressos.

### Odontograma
- preferencia de especialidade, filtros e visibilidade de elementos do odontograma;
- cores e flags ligadas a futura integracao.

### Modelos
- catalogo de modelos para atestados, receitas, recibos, etiquetas, email e orcamento;
- apoio do modulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.

### Impressos
- configuracao de impressora e preferencia de impressos;
- interacao com o fluxo de impressao do navegador.

### Outros consumidores
- usuarios conectados;
- agenda;
- financeiro;
- fluxo de configuracao global do sistema.

## 15. Riscos tecnicos identificados
- modulo central e acoplado ao shell principal;
- preferencias e opcoes aparecem misturadas em diferentes niveis de persistencia;
- risco de alterar os campos JSON errados;
- risco de confundir configuracao de usuario com configuracao de clinica;
- risco de bloquear fluxos protegidos por permissao ou senha;
- risco de regressao em relatorios, odontograma e impressos;
- risco de aumentar complexidade se o recorte funcional vier cedo demais.

## 16. Riscos de regressao identificados
- perder os valores padrao ao salvar;
- afetar o perfil de usuario logado;
- sobrescrever opcoes da clinica ao editar preferencias do usuario;
- quebrar a abertura dos modais centrais;
- desalinhar o contrato de permissao `configuracao`;
- impactar telas dependentes de relatorios, odontograma ou modelos.

## 17. Blocos candidatos para futura modularizacao
Blocos que podem ser considerados em futuras subetapas, apenas depois de contrato e decisao de risco:

- `prefEnsureUI` e o shell visual de preferencias;
- `prefCarregarDados` e os cinco endpoints de preferencias;
- `prefSalvar*` por aba;
- `sysOptEnsureUI` e o shell visual de opcoes do sistema;
- `sysOptCarregar` e `sysOptSalvar`;
- grupo `report-config` dentro de preferencias;
- grupo de modelos dentro de preferencias;
- grupo de odontograma dentro de preferencias;
- grupo clinica/financeiro/seguranca/data/avancado dentro de opcoes do sistema.

## 18. Blocos que nao devem ser o primeiro recorte real
Nao parecem bons primeiros recortes imediatos:

- toda a tela de opcoes do sistema de uma vez;
- todo o bloco de preferencias com carregamento e salvamento completo;
- o fluxo de permissao e senha administrativa;
- o bloco de relatorios/impressos;
- o bloco de odontograma;
- qualquer parte que misture usuario e clinica ao mesmo tempo sem contrato granular;
- qualquer recorte que atravesse frontend central, backend e permissao global em um unico passo.

## 19. Blocos candidatos mais seguros para primeiro recorte futuro
Se houver futura modularizacao funcional e o usuario confirmar a classificacao novamente, os candidatos mais conservadores tendem a ser:

- um bloco isolado de leitura de preferencias de usuario sem salvamento;
- um bloco isolado de leitura de opcoes da clinica sem escrita;
- o shell visual de uma aba especifica, com o comportamento intacto e sem alterar persistencia;
- um bloco apenas de montagem de UI auxiliar, desde que nao mude comportamento.

Mesmo assim, esta etapa recomenda nao iniciar recorte funcional ainda, porque o contrato tecnico deve ser fechado com leitura mais detalhada e validacao humana posterior.

## 20. Criterios minimos para permitir uma futura primeira alteracao de codigo
Antes de qualquer primeira alteracao funcional futura, sera necessario:

- definir a aba/bloco exato;
- definir se o dado pertence ao usuario ou a clinica;
- confirmar a rota de leitura e a rota de escrita;
- confirmar a dependencia de permissao `configuracao`;
- confirmar a necessidade de senha administrativa;
- confirmar o impacto em relatorios, odontograma, modelos e impressos;
- confirmar a classificacao multiarea do bloco escolhido;
- validar o comportamento no sistema antes e depois da mudanca.

## 21. Plano conservador sugerido para proximas subetapas
1. Continuar documentalmente com o isolamento tecnico de blocos candidatos.
2. Confirmar o contrato funcional por aba ou por grupo de campos.
3. Somente depois avaliar se existe um recorte funcional pequeno e seguro.

## 22. Onde testar futuramente antes de qualquer alteracao funcional
Antes de qualquer alteracao funcional futura, o teste humano deve começar em:

`Preferencias e Opcoes do Sistema`

E validar:
- abertura da tela;
- carregamento das abas;
- carregamento de preferencias do usuario;
- carregamento de opcoes por clinica;
- salvamento das preferencias;
- salvamento das opcoes;
- permissao `configuracao`;
- senha administrativa quando aplicavel;
- impacto em relatorios;
- impacto em odontograma;
- impacto em modelos;
- impacto em impressos.

## 23. Confirmacoes
- Editor de texto permanece pausado/consolidado;
- a frente atual continua sendo Preferencias e Opcoes do Sistema;
- a classificacao preliminar permanece configuracao comum;
- nenhuma mudanca de codigo foi feita nesta etapa;
- nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado;
- nenhuma correcao textual ampla ou de mojibake foi feita.

## Registro para roadmap
- A frente atual continua sendo Preferencias e Opcoes do Sistema.
- Editor de texto permanece pausado/consolidado.
- A reavaliacao pos-Editor recomendou Preferencias e Opcoes do Sistema no commit `c94b8cd`.
- A Subetapa 1 foi concluida no commit `7764e9b`.
- Esta Subetapa 2 cria o mapeamento tecnico por leitura.
- A classificacao preliminar continua sendo configuracao comum.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario foi alterado.
- A proxima subetapa recomendada deve ser escolhida com base no risco dos blocos mapeados.
- Antes de iniciar qualquer recorte funcional futuro, o usuario devera confirmar novamente a classificacao multiarea do bloco escolhido, se houver duvida.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_preferencias_opcoes_subetapa_2_mapeamento_tecnico.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
