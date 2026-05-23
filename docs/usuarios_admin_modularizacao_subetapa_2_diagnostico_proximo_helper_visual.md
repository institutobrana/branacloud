# Usuarios/Admin - Subetapa 2 - Diagnostico do proximo helper visual

## 1. Objetivo
Mapear, por leitura, quais helpers/trechos visuais de Usuarios/Admin ainda permanecem em `frontend/app.js`, quais helpers visuais ja estao no modulo `frontend/js/modules/users-admin-modal-visual.js` e qual e o proximo recorte pequeno e seguro para uma futura extracao.

## 2. Estado atual apos `bd6dce5` e `1f86229`
Os dois commits recentes consolidaram a retomada da modularizacao segura de Usuarios/Admin:
- `bd6dce5` - extracao de helpers visuais de senha em Usuarios/Admin;
- `1f86229` - documentacao da retomada de Usuarios/Admin apos as correcoes.

Estado funcional e documental consolidado:
- login, senha interna e perfis ja foram corrigidos e validados;
- signup com Brana ja foi validado;
- seed canonico Brana ja foi consolidado;
- exclusoes seguras ja foram documentadas;
- a retomada de Usuarios/Admin foi registrada documentalmente;
- o modulo visual extraido continua funcionando e sem alterar a persistencia.

## 3. Helpers visuais ja extraidos
Helpers ja presentes em `frontend/js/modules/users-admin-modal-visual.js`:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`
- `usersSyncSenhaAtualVisibility()`
- `usersToggleSenhaVisibilidade()`

Wrappers finos mantidos em `frontend/app.js`:
- `usersOptions(...)`
- `usersPopularModalCombos(...)`
- `usersPreencherModal(...)`
- `usersSyncSenhaAtualVisibility()`
- `usersToggleSenhaVisibilidade()`

## 4. Funcoes/trechos visuais ainda em `frontend/app.js`
Trechos ainda visuais ou de DOM que permanecem no `app.js` e podem ser avaliados para extracao futura:
- `usersAtualizarAcoesToolbar()`
- `usersRenderAdvanced()`
- `usersPermSetTab()`
- `usersPermRenderPerfilPreview()`
- `usersPermRenderProfiles()`
- `usersPermRenderFuncoes()`
- `usersPerfRenderProfiles()`
- `usersPerfRenderPrestadores()`

Trechos que parecem visuais, mas ja sao sensiveis demais para este recorte e ficam fora da recomendacao:
- `usersCarregarCombos()` - depende de carregamento de dados;
- `usersAbrirModalNovo()` - depende de chamada de codigo/proximo-codigo;
- `usersAbrirModalEditar()` - depende de dados do usuario;
- `usersSyncSenhaAtualVisibility()` / `usersToggleSenhaVisibilidade()` - ja extraidos;
- qualquer rotina que chame `requestJson`.

## 5. Candidatos para futura extracao
### Candidato recomendado
1. `usersAtualizarAcoesToolbar()`

### Candidatos secundarios possiveis
2. `usersRenderAdvanced()`
3. `usersPermRenderPerfilPreview()`
4. `usersPermRenderProfiles()`
5. `usersPermRenderFuncoes()`
6. `usersPerfRenderProfiles()`
7. `usersPerfRenderPrestadores()`
8. `usersPermSetTab()`

## 6. Classificacao de risco de cada candidato
| Candidato | Risco | Motivo |
|---|---|---|
| `usersAtualizarAcoesToolbar()` | baixo | So habilita/desabilita botoes e ajusta titles da toolbar com base no usuario selecionado; e DOM puro e nao altera dados. |
| `usersRenderAdvanced()` | medio | Renderiza a lista principal de usuarios e controla selecao visual; e puro no DOM, mas e mais central na tela. |
| `usersPermRenderPerfilPreview()` | medio | Monta preview de perfis no modal de permissoes; e visual, mas conversa com dados de perfis. |
| `usersPermRenderProfiles()` | medio | Popula lista de perfis do modal; e visual, porem ligado a contexto de permissao. |
| `usersPermRenderFuncoes()` | medio | Desenha a lista de funcoes por modulo; e visual, mas esta dentro da area de permissao. |
| `usersPerfRenderProfiles()` | medio | Renderiza lista de perfis na aba de perfis; DOM puro, mas esta em fluxo sensivel. |
| `usersPerfRenderPrestadores()` | medio | Renderiza checklist de prestadores; DOM puro, com reflexo de dados de perfil. |
| `usersPermSetTab()` | alto | Troca abas e pode disparar `usersPerfLoad()`; tem impacto funcional maior que um helper de renderizacao simples. |

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
- qualquer rotina que altere dados

## 8. Recomendacao de um unico recorte para a proxima subetapa
**Proxima subetapa recomendada: extrair apenas `usersAtualizarAcoesToolbar()` para o modulo visual**, mantendo wrappers finos em `frontend/app.js`.

Motivos:
- e um helper pequeno;
- e puro de apresentacao/DOM;
- nao faz request;
- nao altera dados;
- nao toca no fluxo protegido;
- e facil de testar manualmente no painel de usuarios.

## 9. O que deve entrar em commit depois desta etapa documental
Se a futura extracao for confirmada, o commit deve incluir somente:
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `docs/usuarios_admin_modularizacao_subetapa_3_<nome_da_subetapa>.md`

Opcionalmente, se o processo de modularizacao exigir registro de roadmap ja na conclusao da proxima subetapa, incluir tambem:
- `docs/11_roadmap_desenvolvimento.md`

Nesta etapa atual, o roadmap nao foi alterado.

## 10. O que deve entrar no roadmap se a proxima extracao for feita
Se a proxima extracao ocorrer, o roadmap deve receber apenas uma nota curta e objetiva, por exemplo:
- Subetapa 3 de Usuarios/Admin concluida: extracao de `usersAtualizarAcoesToolbar()` para o modulo visual, sem tocar em salvar, senha, permissoes ou backend, com validacao manual no painel de usuarios.

## 11. Onde testar depois da futura alteracao de codigo
Quando essa futura extracao for aplicada, testar exatamente:
1. abrir o painel de usuarios;
2. selecionar usuarios diferentes;
3. confirmar que os botoes de editar/excluir/preferencias/permissoes continuam habilitando/desabilitando corretamente;
4. confirmar que a conta base protegida continua bloqueada;
5. reabrir o modal de novo usuario e o de edicao apenas para garantir que o comportamento global nao foi afetado;
6. verificar que permissões/perfis continuam intactos.

## 12. Blindagem textual / mojibake
A blindagem textual foi respeitada:
- nenhum texto visivel foi corrigido;
- nenhuma label, placeholder ou mensagem foi reescrita;
- qualquer aparencia de mojibake foi deixada como estava;
- esta subetapa foi apenas diagnostica.

## 13. Confirmacoes finais
- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado.
- `backend` nao foi alterado.
- banco e seeds nao foram alterados.
- roadmap nao foi alterado nesta etapa.
- Git nao foi alterado por `add`/`commit`/`push`/`reset`/`restore`/`clean`.
- Apenas este documento foi criado.
