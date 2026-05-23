# Usuarios/Admin - Subetapa 0 - Diagnostico de retomada pos correcao

## 1. Objetivo
Registrar, somente por leitura, onde a modularizacao segura do modulo Usuarios/Admin parou, qual e o estado atual do frontend, quais contratos o protegem e qual deve ser o proximo recorte seguro para retomar a modularizacao sem misturar com login, senha interna, perfis ou backend.

## 2. Contexto
A modularizacao do frontend foi interrompida quando a trilha de Usuarios/Admin estava em andamento e surgiram problemas funcionais sensiveis que precisaram ser corrigidos antes de continuar:
- login e senha interna;
- permissoes e perfis;
- criacao de nova conta;
- seed canonico Brana / Tabela exemplo;
- exclusoes seguras de clinicas contaminadas;
- organizacao documental e Git.

Esses pontos ja foram corrigidos, testados, documentados e versionados em commits separados. A organizacao documental principal tambem foi concluida.

## 3. Commits recentes relevantes
- `5c8ef7a` - Corrige login, senha interna e perfis de usuarios
- `8c1f7c5` - Corrige seed canonico Brana no signup
- `cb20715` - Documenta exclusao segura da clinica 15
- `9c4df78` - Documenta exclusoes seguras de clinicas de teste
- `680749d` - Documenta validacao final do signup com Brana
- `58c913d` - Audita documentacao geral do Brana Cloud
- `a513b67` - Atualiza indice e roadmap documental
- `0701705` - Atualiza READMEs do Brana Cloud
- `579a76d` - Documenta triagem dos untracked restantes
- `ceb9784` - Preserva documentos importantes de contratos e modulos
- `6db88df` - Preserva contratos e documentos importantes de modulos
- `8968ded` - Preserva plano de reajuste em intervencoes e procedimentos
- `20e03c2` - Preserva historico de correcao mojibake no frontend
- `3d25b93` - Audita CSVs de vinculos entre materiais e procedimentos
- `aea80ef` - Preserva auditorias Git da organizacao recente
- `b8ef612` - Audita pendencias de anamnese e restauracao
- `bf18afd` - Documenta fechamento da organizacao documental

## 4. Documentos consultados
- `README.md`
- `README_WEB.md`
- `backend/README.md`
- `docs/00_master_guide.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fechamento_organizacao_documental_retomada_modularizacao.md`
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/triagem_untracked_restantes_pos_documentacao_principal.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- `docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md`
- `docs/usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md`

## 5. Contratos vigentes aplicaveis
- contrato funcional de usuarios / novas contas
- contrato de seeds minimos / seed canonico Brana
- contrato funcional de Materiais / Procedimentos Genericos / Intervencoes
- contrato de exclusao segura
- regra permanente de blindagem textual / mojibake

## 6. Estado atual do Git
- Branch atual: `modularizacao-segura-fase-1`
- `git status --short` mostra apenas untracked antigos fora da trilha principal
- nao ha tracked modificados
- nao houve organizacao Git nesta subetapa

Untracked resumidos ainda presentes no workspace:
- trilha de Anamnese / SQLServer / restauracao
- CSVs brutos ja auditados
- arquivos soltos `git` e `modularizacao-segura-fase-1`

## 7. Estado atual do modulo Usuarios/Admin
O modulo continua grande e sensivel, mas a modularizacao ja iniciou corretamente:
- o recorte visual do modal foi extraido para `frontend/js/modules/users-admin-modal-visual.js`;
- o restante do fluxo continua em `frontend/app.js`;
- `frontend/index.html` ainda concentra o markup do painel, modais de senha e permissoes;
- login, senha interna, perfis e fluxo protegido ja foram corrigidos e validados em trilha separada;
- o modulo ainda depende de `requestJson`, `X-Protected-Grant`, schemas de permissao e endpoints `/admin/users/*`.

## 8. Funcoes ainda em `frontend/app.js`
O `app.js` ainda concentra a maior parte da logica de Usuarios/Admin:
- selecao, estado e toolbar:
  - `usersAtualSelecionado`
  - `usersNormalizeText`
  - `usersIsContaMasterBase`
  - `usersCanManageSelected`
  - `usersAtualizarAcoesToolbar`
  - `usersSelecionar`
- carga e refresh:
  - `usersCarregarCombos`
  - `carregarUsuarios`
  - `usersStartRefresh`
  - `usersStopRefresh`
  - `usersRenderAdvanced`
- modal de cadastro/edicao/senha:
  - `usersSyncSenhaAtualVisibility`
  - `usersToggleSenhaVisibilidade`
  - `usersAbrirModalNovo`
  - `usersAbrirModalEditar`
  - `usersFecharModal`
  - `usersSalvarEstrutural`
  - `usersSalvarSenha`
  - `usersEditarSelecionado`
  - `usersExcluirSelecionado`
  - `usersAbrirImpressos`
  - `usersAbrirPreferencias`
- permissoes e perfis:
  - `usersPermNormalizeLevel`
  - `usersPermIcon`
  - `usersPermModuleCode`
  - `usersPermModuleName`
  - `usersPermFunctionCode`
  - `usersPermFunctionName`
  - `usersPermSortKey`
  - `usersPermSortModules`
  - `usersPermSortFunctions`
  - `usersPermNormalizeFunctionsByModule`
  - `usersPermGetFunctionsForModule`
  - `usersPermFuncLevel`
  - `usersPermConfirmPassword`
  - `usersPermApplyLevel`
  - `usersPermSyncModuleRadios`
  - `usersPermSyncFuncRadios`
  - `usersPermBuildPayload`
  - `usersPermAutoSave`
  - `usersPermScheduleAutoSave`
  - `usersPermFlushAutoSave`
  - `usersPermSetModuleLevel`
  - `usersPermSetFuncLevel`
  - `usersBuildFallbackProfiles`
  - `usersBuildFallbackFunctionsByModule`
  - `usersCarregarPermissoesSchema`
  - `usersPermGetProfileByCode`
  - `usersPermSelecionarFuncao`
  - `usersPermRenderFuncoes`
  - `usersPermSelecionarModulo`
  - `usersPermGetRows`
  - `usersPermMoveSelection`
  - `usersPermHandleModuleKeydown`
  - `usersPermHandleFunctionKeydown`
  - `usersPermRenderPerfilPreview`
  - `usersPermRenderProfiles`
  - `usersPermAplicarPerfilSelecionado`
  - `usersFecharPermissoes`
  - `usersRenderPermissoes`
  - `usersAbrirPermissoes`
  - `usersSalvarPermissoes`
- perfis de acesso:
  - `usersPerfSelectPerfil`
  - `usersPerfRenderProfiles`
  - `usersPerfRenderPrestadores`
  - `usersPerfHandlePrestadorChange`
  - `usersPerfLoad`
  - `usersPermInferProfileCode`
  - `usersPermSetTab`
- ponte para o modulo extraido:
  - `usersOptions`
  - `usersPopularModalCombos`
  - `usersPreencherModal`

## 9. Funcoes ja extraidas para `frontend/js/modules/users-admin-modal-visual.js`
O modulo extraido esta pequeno e focado no visual do modal:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`

Ele fica exposto em `window.BranaUsersAdminModalVisualModule` e o `app.js` apenas faz a ponte fina para esse namespace.

## 10. Riscos do modulo
- o bloco ainda e extenso e acoplado a refresh, permissao, senha e backend;
- um recorte grande demais pode reabrir problemas de login / grant / perfis;
- a tela depende de estados e caches que ja estavam em funcionamento antes da separacao;
- o painel de usuarios tambem conversa com perfis de acesso e com o fluxo protegido de senha;
- a area ainda nao e boa candidata para uma extracao ampla sem manter o recorte extremamente estreito.

## 11. O modulo Usuarios/Admin ainda e o melhor para retomar?
Sim. Este continua sendo o melhor modulo para retomar a modularizacao segura, por tres motivos principais:
1. ele ja estava em andamento e possui uma separacao inicial real;
2. a base funcional sensivel que interrompeu a modularizacao ja foi corrigida e validada;
3. o restante pode ser dividido em recortes pequenos e previsiveis, com testes manuais claros.

Condição importante:
- a retomada deve continuar limitada a helpers puros de apresentacao / DOM e nao deve tocar em salvar, senha, permissoes, protected grant, backend ou textos visiveis.

## 12. Recomendacao da proxima subetapa
**Subetapa 1 - retomada da extracao visual e de helpers puros do painel de Usuarios/Admin**, mantendo fora:
- salvamento estrutural;
- senha;
- permissoes;
- perfis de acesso;
- refresh protegido;
- endpoints backend;
- qualquer ajuste textual / mojibake.

Escopo sugerido para a proxima subetapa:
- mover apenas helpers de montagem e renderizacao visual que sejam puros e previsiveis;
- manter a ponte minima em `frontend/app.js`;
- nao alterar `frontend/index.html` nesta primeira retomada;
- nao mexer em backend.

## 13. Onde testar futuramente
Quando a proxima subetapa existir, testar exatamente:
1. abrir o painel de usuarios;
2. abrir o modal de novo usuario;
3. abrir edicao de usuario existente;
4. verificar preenchimento dos combos de tipo, prestador e unidade;
5. verificar se a toolbar continua respeitando a conta base protegida;
6. abrir permissões e perfis apenas para confirmar que o comportamento anterior continua intacto;
7. confirmar que o fluxo protegido de senha nao foi afetado.

## 14. Confirmacoes finais
- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado.
- `backend` nao foi alterado.
- banco nao foi alterado.
- Git nao foi alterado por `add`/`commit`/`push`/`reset`/`restore`/`clean`.
- Nenhum documento existente foi alterado.
- Apenas este documento foi criado.
