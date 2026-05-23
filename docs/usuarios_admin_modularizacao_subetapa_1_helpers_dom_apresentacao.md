# Usuarios/Admin - Subetapa 1 - Extracao de helpers puros de apresentacao/DOM

## 1. Objetivo
Executar uma retomada pequena e conservadora da modularizacao segura do modulo Usuarios/Admin, extraindo apenas helpers puros de apresentacao/DOM do painel e modal de usuarios, sem tocar em salvamento, senha, permissoes, refresh protegido, backend ou contratos sensiveis.

## 2. Contexto
A subetapa documental anterior confirmou que Usuarios/Admin continua sendo o melhor modulo para retomar a modularizacao segura depois das correcoes recentes de:
- login e senha interna;
- perfis e permissoes;
- signup com Brana;
- seed canonico;
- exclusoes seguras;
- documentacao principal e organizacao do Git.

O recorte aprovado agora e apenas visual/apresentacao, com foco em helpers pequenos e previsiveis do modal de usuarios.

## 3. Commits recentes relevantes
- `bf18afd` - Documenta fechamento da organizacao documental
- `b8ef612` - Audita pendencias de anamnese e restauracao
- `aea80ef` - Preserva auditorias Git da organizacao recente
- `3d25b93` - Audita CSVs de vinculos entre materiais e procedimentos
- `20e03c2` - Preserva historico de correcao mojibake no frontend
- `8968ded` - Preserva plano de reajuste em intervencoes e procedimentos
- `6db88df` - Preserva contratos e documentos importantes de modulos
- `ceb9784` - Preserva documentos importantes de contratos e modulos
- `579a76d` - Documenta triagem dos untracked restantes
- `0701705` - Atualiza READMEs do Brana Cloud
- `a513b67` - Atualiza indice e roadmap documental
- `58c913d` - Audita documentacao geral do Brana Cloud
- `680749d` - Documenta validacao final do signup com Brana
- `9c4df78` - Documenta exclusoes seguras de clinicas de teste
- `cb20715` - Documenta exclusao segura da clinica 15
- `8c1f7c5` - Corrige seed canonico Brana no signup
- `5c8ef7a` - Corrige login, senha interna e perfis de usuarios

## 4. Documentos consultados
- `README.md`
- `README_WEB.md`
- `backend/README.md`
- `docs/00_master_guide.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/usuarios_admin_modularizacao_retomada_subetapa_0_diagnostico_pos_correcoes.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md`

## 5. Contratos e regras aplicaveis
- contrato funcional de usuarios / novas contas
- contrato de seeds minimos / seed canonico Brana
- contrato funcional de Materiais / Procedimentos Genericos / Intervencoes
- contrato de exclusao segura
- regra permanente de blindagem textual / mojibake

## 6. Estado inicial do Git
- Branch atual: `modularizacao-segura-fase-1`
- `git status --short` segue com untracked antigos fora da trilha principal
- nenhum tracked modificado antes desta etapa
- nenhuma organizacao Git foi feita aqui

## 7. Arquivos modificados nesta etapa
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `docs/usuarios_admin_modularizacao_subetapa_1_helpers_dom_apresentacao.md`

## 8. O que foi extraido
Foram movidos para o modulo de apresentacao/DOM os seguintes helpers puros:
- `usersSyncSenhaAtualVisibility()`
- `usersToggleSenhaVisibilidade()`

Esses helpers ficam agora no modulo `frontend/js/modules/users-admin-modal-visual.js`, junto com os helpers visuais ja existentes:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`

O `frontend/app.js` ficou apenas com wrappers finos de compatibilidade para esses helpers, sem mudanca de comportamento.

## 9. Funcoes sensiveis que ficaram intocadas
Nao foram mexidas nesta etapa:
- `usersSalvarEstrutural`
- `usersSalvarNovo`
- `usersSalvarSenha`
- `usersSalvarPermissoes`
- `usersExcluirSelecionado`
- `carregarUsuarios`
- `usersAbrirPermissoes`
- `usersAbrirModalNovo`
- `usersAbrirModalEditar`
- `usersCarregarCombos`
- fluxo de senha protegida
- `protected_password_required`
- `X-Protected-Grant`
- `access_profile`
- `usuario_perfil_acesso`
- backend
- banco
- seeds

## 10. Riscos
- o modulo Usuarios/Admin continua grande e fortemente acoplado a estado, refresh e permissoes;
- uma extracao maior agora poderia reabrir riscos funcionais sensiveis;
- a modularizacao precisa seguir em recortes pequenos e verificaveis;
- qualquer expansao para salvar, permissao, senha ou backend deve ficar para subetapas futuras.

## 11. Analise da retomada
Usuarios/Admin continua sendo o melhor modulo para retomar porque:
1. a modularizacao ja tinha uma separacao inicial real;
2. os problemas funcionais que interromperam a trilha foram corrigidos e validados;
3. o recorte atual e pequeno e seguro;
4. a proxima extracao pode continuar sendo visual, sem tocar no fluxo protegido.

## 12. Proxima subetapa recomendada
**Subetapa 2 - extracao apenas de mais helpers puros de DOM/renderizacao do painel de usuarios, se necessario, mantendo fora qualquer logica de persistencia, permissao, refresh protegido ou backend.**

Se a proxima revisao indicar pouco ganho adicional, o melhor caminho pode ser parar neste ponto e seguir apenas com testes manuais da tela para confirmar que os wrappers finos mantiveram o comportamento.

## 13. Onde testar futuramente
Depois de qualquer proxima alteracao, testar exatamente:
1. abrir o painel de usuarios;
2. abrir o modal de novo usuario;
3. abrir edicao de usuario existente;
4. conferir preenchimento dos combos;
5. verificar toolbar e protecao da conta base;
6. reabrir permissões/perfis apenas para confirmar que permanecem intactos;
7. confirmar que o 403 inicial em `/admin/users` continua sendo apenas o gatilho esperado da protecao e que, apos a senha interna, o painel carrega normalmente.

## 14. Blindagem textual / mojibake
A blindagem textual foi respeitada:
- nenhuma string visivel foi corrigida;
- nenhum label, placeholder ou mensagem foi reescrito;
- qualquer texto com aparencia de mojibake foi mantido como estava;
- a etapa se limitou a movimento de helpers funcionais/DOM.

## 15. Confirmacoes finais
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhum seed foi alterado.
- `frontend/index.html` nao foi alterado.
- Nenhum texto visivel foi corrigido.
- Nenhum documento existente foi alterado.
- Nenhum arquivo foi removido.
- Nenhum comando Git destrutivo foi executado.
- Apenas este documento novo e as pequenas alteracoes de frontend listadas acima foram feitas.
