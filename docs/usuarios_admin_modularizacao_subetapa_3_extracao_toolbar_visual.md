# Usuarios/Admin - Subetapa 3 - Extracao da toolbar visual

## 1. Objetivo
Executar uma extracao pequena e conservadora de um helper puro de apresentacao/DOM do modulo Usuarios/Admin, movendo a montagem visual da toolbar para o modulo de modal visual, sem tocar em salvamento, senha, permissoes, backend ou fluxo protegido.

## 2. Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `docs/usuarios_admin_modularizacao_subetapa_3_extracao_toolbar_visual.md`

## 3. Funcao extraida
Foi extraida apenas:
- `usersAtualizarAcoesToolbar()`

O `frontend/app.js` manteve um wrapper fino com o mesmo nome para preservar compatibilidade.

## 4. Por que o recorte e baixo risco
O helper extraido:
- so habilita/desabilita botoes da toolbar;
- ajusta titles informativos da interface;
- depende apenas do usuario selecionado e das regras ja existentes;
- nao faz `requestJson`;
- nao altera dados;
- nao toca em senha, permissao, exclusao, cadastro, refresh protegido ou backend.

## 5. O que ficou explicitamente fora
Ficaram fora desta subetapa:
- `usersSalvarEstrutural`
- `usersSalvarNovo`
- `usersSalvarSenha`
- `usersSalvarPermissoes`
- `usersExcluirSelecionado`
- `carregarUsuarios`
- fluxo de senha protegida
- `protected_password_required`
- `X-Protected-Grant`
- `access_profile`
- `usuario_perfil_acesso`
- qualquer chamada a `requestJson`
- qualquer alteracao de backend, banco, seeds ou HTML

## 6. Blindagem textual / mojibake
A blindagem textual foi respeitada:
- nenhuma string visivel foi corrigida;
- nenhum label, placeholder ou mensagem foi reescrito;
- qualquer aparencia de mojibake foi preservada;
- a mudanca foi apenas funcional/estrutural no helper.

## 7. O que deve entrar em commit depois do teste
Se a validacao manual confirmar que a toolbar segue funcionando, o pacote de commit deve incluir:
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- este documento de subetapa

O roadmap nao foi alterado nesta etapa. Se houver commit futuro de consolidacao, a linha do roadmap deve registrar apenas que a toolbar visual foi extraida para o modulo visual sem alterar o comportamento funcional.

## 8. O que deve entrar no roadmap apos o teste
Se a consolidacao for confirmada, a observacao no roadmap deve ser curta, por exemplo:
- Subetapa 3 de Usuarios/Admin concluida: `usersAtualizarAcoesToolbar()` extraida para o modulo visual, mantendo wrappers finos em `frontend/app.js` e sem alterar o fluxo sensivel.

## 9. Onde testar manualmente
Testar exatamente:
1. abrir o painel de usuarios;
2. selecionar usuarios diferentes;
3. confirmar que editar/excluir/preferencias/permissoes habilitam e desabilitam corretamente;
4. confirmar que a conta base protegida continua bloqueada;
5. abrir modal de novo usuario;
6. abrir edicao de usuario existente;
7. confirmar que combos e campos continuam funcionando;
8. confirmar que permissões/perfis continuam intactos;
9. confirmar que o fluxo protegido por senha interna continua funcionando.

## 10. Confirmacoes finais
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhum seed foi alterado.
- `frontend/index.html` nao foi alterado.
- Nenhum texto visivel foi corrigido.
- Nenhum documento existente foi alterado.
- Nenhum arquivo foi removido.
- Nenhum comando Git destrutivo foi executado.
- Apenas esta extração pequena e este documento novo foram feitos nesta etapa.
