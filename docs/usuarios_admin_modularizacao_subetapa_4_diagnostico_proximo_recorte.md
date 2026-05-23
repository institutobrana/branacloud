# Usuarios/Admin - Subetapa 4 - Diagnostico do proximo recorte

## 1. Objetivo da Subetapa 4
Reavaliar, por leitura, o estado da modularizacao segura de Usuarios/Admin depois da Subetapa 3, identificar quais trechos visuais/DOM ainda permanecem em `frontend/app.js`, quais helpers ja estao no modulo visual e concluir se existe ainda um proximo recorte baixo risco ou se e melhor pausar a modularizacao deste modulo por enquanto.

## 2. Estado atual apos o commit `aab97d7`
O commit `aab97d7` concluiu a Subetapa 3:
- `usersAtualizarAcoesToolbar()` foi extraida para `frontend/js/modules/users-admin-modal-visual.js`;
- `frontend/app.js` ficou apenas com wrapper fino;
- testes manuais do painel de usuarios passaram;
- `docs/11_roadmap_desenvolvimento.md` foi atualizado com a conclusao da Subetapa 3;
- backend, banco, seeds, senha interna, permissoes, perfis e fluxo protegido nao foram alterados;
- textos visiveis / mojibake foram preservados.

## 3. Helpers visuais ja extraidos
Helpers atualmente existentes em `frontend/js/modules/users-admin-modal-visual.js`:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`
- `usersSyncSenhaAtualVisibility()`
- `usersToggleSenhaVisibilidade()`
- `usersAtualizarAcoesToolbar()`

Wrappers finos mantidos em `frontend/app.js`:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`
- `usersSyncSenhaAtualVisibility()`
- `usersToggleSenhaVisibilidade()`
- `usersAtualizarAcoesToolbar()`

## 4. Funcoes / trechos visuais ainda em `frontend/app.js`
Trechos visuais ainda concentrados em `app.js` que podem ser avaliados para extracao futura:
- `usersRenderAdvanced()`
- `usersPermSetTab()`
- `usersPermRenderPerfilPreview()`
- `usersPermRenderProfiles()`
- `usersPermRenderFuncoes()`
- `usersPerfRenderProfiles()`
- `usersPerfRenderPrestadores()`

Trechos de apoio visual que ja ficam perto da fronteira, mas nao entram na recomendacao desta etapa:
- `usersAtualSelecionado()`
- `usersSelecionar()`
- `usersCanManageSelected()`
- `usersAtualizarAcoesToolbar()` - ja extraida
- `usersSyncSenhaAtualVisibility()` - ja extraida
- `usersToggleSenhaVisibilidade()` - ja extraida

## 5. Candidatos para futura extracao
### Candidatos ainda possiveis
1. `usersRenderAdvanced()`
2. `usersPermRenderPerfilPreview()`
3. `usersPermRenderProfiles()`
4. `usersPermRenderFuncoes()`
5. `usersPerfRenderProfiles()`
6. `usersPerfRenderPrestadores()`
7. `usersPermSetTab()`

## 6. Classificacao de risco de cada candidato
| Candidato | Risco | Observacao |
|---|---|---|
| `usersRenderAdvanced()` | medio | Apenas renderiza a tabela, controla selecao e chama a toolbar; nao faz request, mas e o principal ponto visual da lista. |
| `usersPermRenderPerfilPreview()` | medio | E visual, mas vive dentro do modal de permissoes e depende de dados de perfil. |
| `usersPermRenderProfiles()` | medio | Popula a lista de perfis do modal; ainda conversa com o fluxo de permissoes. |
| `usersPermRenderFuncoes()` | medio | Renderiza as funcoes do modulo; ainda esta dentro da area de permissao/protecao. |
| `usersPerfRenderProfiles()` | medio | Renderiza a lista de perfis na aba de perfis; e DOM puro, mas em tela sensivel. |
| `usersPerfRenderPrestadores()` | medio | Renderiza o checklist de prestadores; DOM puro, com reflexo direto de dados de perfil. |
| `usersPermSetTab()` | alto | Pode disparar carga de dados e troca de abas; mexe na orquestracao do modal, nao e um helper visual isolado. |

## 7. Funcoes sensiveis explicitamente excluidas
Ficam fora de qualquer recomendacao de extracao nesta etapa:
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
- qualquer chamada que altere dados
- backend
- banco
- seeds

## 8. Recomendacao: proximo recorte ou pausa
**Recomendacao desta etapa: pausar a modularizacao de Usuarios/Admin por enquanto.**

Motivo:
- depois das Subetapas 1 a 3, os proximos helpers restantes ja estao em faixa de risco medio;
- `usersRenderAdvanced()` e o candidato mais natural, mas ele ja concentra selecao da lista principal e parte do comportamento visual da tela;
- os outros candidatos restantes estao mais proximos do fluxo de permissoes/perfis, o que aumenta a chance de acoplamento;
- manter a trilha em pausa agora reduz a chance de entrar em refatoracao maior sem ganho proporcional.

Se for realmente necessario continuar depois, o candidato mais prudente para reavaliacao e `usersRenderAdvanced()`, mas somente com autorizacao explicita e consciencia de risco medio.

## 9. O que deve entrar em commit depois desta etapa documental
Esta subetapa e exclusivamente diagnostica. Nao ha commit de codigo recomendado agora.

Se a modularizacao for retomada no futuro, um commit subsequente deveria incluir apenas:
- o helper visual efetivamente extraido;
- `frontend/app.js`;
- `frontend/js/modules/users-admin-modal-visual.js`;
- o documento da subetapa correspondente.

## 10. O que deve entrar no roadmap apenas se houver futura extracao real
Somente se houver nova extracao real, o roadmap deve ganhar uma linha curta, por exemplo:
- Subetapa X de Usuarios/Admin concluida: helper visual extraido para o modulo visual, mantendo wrapper fino em `frontend/app.js` e sem alterar salvar, senha interna, permissoes, perfis, backend, banco, seeds ou textos visiveis.

Neste momento, nao houve alteracao de roadmap.

## 11. Onde testar depois de uma futura alteracao de codigo
Se a modularizacao for retomada e um helper visual for extraido no futuro, testar exatamente:
1. abrir o painel de usuarios;
2. selecionar usuarios diferentes;
3. confirmar que editar/excluir/preferencias/permissoes habilitam e desabilitam corretamente;
4. confirmar que a conta base protegida continua bloqueada;
5. abrir modal de novo usuario;
6. abrir edicao de usuario existente;
7. confirmar que combos e campos continuam funcionando;
8. confirmar que permissões/perfis continuam intactos;
9. confirmar que o fluxo protegido por senha interna continua funcionando.

## 12. Blindagem textual / mojibake
A blindagem textual foi respeitada:
- nenhum texto visivel foi corrigido;
- nenhuma label, placeholder ou mensagem foi reescrita;
- qualquer aparencia de mojibake foi mantida sem alteracao;
- a etapa foi exclusivamente diagnostica.

## 13. Confirmacoes finais
- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado.
- `backend` nao foi alterado.
- banco e seeds nao foram alterados.
- `docs/11_roadmap_desenvolvimento.md` nao foi alterado nesta etapa.
- Git nao foi alterado por `add`/`commit`/`push`/`reset`/`restore`/`clean`.
- Apenas este documento foi criado.
