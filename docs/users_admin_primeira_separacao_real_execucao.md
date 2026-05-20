# Execucao da primeira separacao real de usuarios/admin

## 1. Escopo aprovado
O escopo desta etapa ficou restrito ao nucleo visual do modal de usuarios:
- `usersOptions()`
- `usersPopularModalCombos()`
- partes estritamente visuais de `usersPreencherModal()`
- composicao de `option`, `placeholder` e `default`
- leitura de `usersTiposCache`
- leitura de `usersPrestadoresLookup`
- leitura de `usersUnidadesLookup`
- preenchimento visual de `usersModalTipo`
- preenchimento visual de `usersModalPrestador`
- preenchimento visual de `usersModalUnidade`

## 2. O que foi movido
Foi criado um modulo frontend proprio com a logica visual aprovada do modal:
- montagem de options e placeholder
- popular os combos do modal
- preencher visualmente o modal de usuarios

## 3. O que nao foi movido
Nao foram movidos, alterados nem reescritos:
- `usersSalvarEstrutural()`
- `usersSalvarNovo()`
- `usersSalvarSenha()`
- `usersSalvarPermissoes()`
- `usersExcluirSelecionado()`
- `usersEditarSelecionado()`
- `showUsersPanel()`
- `carregarUsuarios()`
- `requestJson()`
- auth / sessao / grant
- permissões
- backend
- rotas / endpoints
- persistencia
- senha
- exclusao
- `TrialMiddleware`
- `permissions.py`
- `user_admin_routes.py`

## 4. Namespace e modulo novo
O modulo novo ficou exposto em `window.BranaUsersAdminModalVisualModule`, com funcoes passiveis e controladas para o recorte visual aprovado.

## 5. Ponte minima no `app.js`
O `frontend/app.js` ficou apenas com uma ponte fina para o namespace novo:
- `usersOptions(...args)`
- `usersPopularModalCombos(...args)`
- `usersPreencherModal(...args)`

## 6. Arquivos alterados
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/index.html`
- `frontend/app.js`
- `docs/users_admin_primeira_separacao_real_execucao.md`

## 7. Checks executados
Checks obrigatorios executados:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`

## 8. Onde testar
Testar no painel de usuarios:
1. Abrir painel de usuarios.
2. Abrir modal de novo usuario.
3. Verificar placeholders de tipo, prestador e unidade.
4. Verificar combos carregados sem erro.
5. Abrir edicao de usuario existente.
6. Verificar tipo, prestador e unidade ja persistidos.
7. Verificar caso de combo vazio, se reproduzivel.
8. Confirmar que salvar, senha, permissoes e exclusao continuam intactos.

## 9. Riscos residuais
Riscos residuais mantidos sob controle:
- o recorte continua dependente dos caches de combo ja existentes;
- um dataset vazio pode expor diferencas visuais de placeholder, que precisam ser conferidas manualmente;
- a separacao foi propositalmente estreita para nao tocar em persistencia.

## 10. Blindagem textual e mojibake
A blindagem textual/mojibake foi respeitada:
- nenhuma string visivel foi corrigida;
- nenhum label, placeholder ou mensagem foi reescrito;
- nao houve limpeza textual ou ajuste de acentuacao;
- o recorte ficou restrito ao deslocamento funcional aprovado.
