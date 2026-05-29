# Auditoria - suspeita de regressao apos prefRenderCombosModelos com conta/usuario ausentes

## 1. Contexto

- O usuario relatou que uma conta relacionada a `Paulo Gustavo` nao aparece mais no sistema.
- O usuario relatou que um usuario de outra conta tambem sumiu.
- A suspeita foi levantada apos a ultima implementacao de `prefRenderCombosModelos`.
- Esta etapa e somente leitura.

## 2. Checkpoints

- Commit atual comparado: `bcf7e2c84274c130ce47cb63c3535eb1dc2cfb62`.
- Checkpoint anterior: `5e6dd08a3d5e2bdce6d5c04b8c292e0bcea9d271`.
- Worktree temporaria criada: `D:\BRANA ARQUIVOS\BRANA CLOUD_CHECKPOINT_5e6dd08`.
- A worktree ficou em `detached HEAD` no checkpoint anterior e nao alterou a branch principal.

## 3. Estado Git

- Branch principal conferida: `modularizacao-segura-fase-1`.
- Status na pasta principal: apenas `untracked` antigos preservados.
- Commit atual conferido: `bcf7e2c84274c130ce47cb63c3535eb1dc2cfb62`.
- Checkpoint conferido: `5e6dd08a3d5e2bdce6d5c04b8c292e0bcea9d271`.
- Arquivos diferentes entre os commits: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js` e docs ligados ao recorte de `Preferencias / Configuracoes`.

## 4. Diferenca de codigo entre os commits

- O diff ficou restrito ao recorte de `Preferencias / Configuracoes`.
- Em `frontend/app.js`, a diferenca foi a delegacao da renderizacao visual dos combos de modelos.
- Em `frontend/js/modules/preferencias-opcoes-sistema.js`, foi adicionado o helper passivo `prefRenderCombosModelosModal`.
- Em `docs/`, houve registro documental da implementacao e do roadmap.
- Nao houve alteracao em fluxos de conta, usuario, permissao, backend, banco ou listagem.

## 5. Resultado da busca no banco

- Banco identificado: `brana_saas`.
- Servidor: PostgreSQL.
- `Paulo Gustavo` nao foi encontrado em `clinicas`, `usuarios`, `prestador_odonto`, `usuario_perfil_acesso`, `access_profile` ou `unidade_atendimento`.
- `Paulo` foi encontrado em registros de `pacientes` e em algumas tabelas legadas de agenda/financeiro, mas nao como conta/usuario.
- `Gustavo` foi encontrado em registros de `pacientes` e em algumas tabelas legadas de agenda, mas nao como conta/usuario.
- `paulo gustavo` exato nao apareceu em nenhuma tabela textual pesquisada.
- Nao houve indicio de exclusao por auditoria para `Paulo Gustavo`.
- A tabela `plataforma_auditoria` mostrou apenas um evento antigo de delecao de clinica relacionada a outro nome, sem relacao com `Paulo Gustavo`.

## 6. Resultado da comparacao com checkpoint

- O ambiente checkpoint foi preparado com sucesso em worktree separada.
- A comparacao de codigo entre os commits nao aponta alteracao em fluxos de conta, usuario ou listagem.
- A comparacao funcional direta na interface ficou pendente de teste manual do usuario entre a pasta principal e a worktree.

## 7. Hipoteses avaliadas

- Regressao frontend/listagem: sem evidencias no diff de codigo; nao foi confirmada.
- Filtro/permissao/contexto: possivel, mas sem identificador suficiente para fechar.
- Dado removido do banco: possivel para a conta/usuario relatados, porque nao apareceram nas tabelas de conta/usuario.
- Exclusao manual/sistema/script: nao confirmada pelos logs consultados.
- Inconclusivo: parcialmente, porque o nome citado nao corresponde a uma conta/usuario encontrado no banco e o outro usuario nao foi identificado.

## 8. Classificacao final

- **Opcao B**.

## 9. Proxima etapa recomendada

- Abrir auditoria forense de exclusao/logs para os registros ausentes, idealmente com identificador exato da conta, email, id de clinica ou nome completo do usuario que sumiu.

## 10. Confirmacoes de escopo

- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend nao foi alterado.
- Banco, schema, migrations, seeds e endpoints nao foram alterados.
- Dados do banco nao foram alterados.
- Permissoes e seeds nao foram alteradas.
- Blindagem textual/mojibake respeitada.

## 11. Registro para roadmap

- Auditoria de suspeita de regressao apos `prefRenderCombosModelos` registrada.
- Worktree de checkpoint criada para comparacao segura.
- Busca somente leitura executada no banco `brana_saas`.
- Classificacao final: `Opcao B`.
- Proxima etapa recomendada: auditoria forense de exclusao/logs com identificadores mais precisos.
- Blindagem textual/mojibake respeitada.
