# Auditoria forense - Wilker digitalprodutora, clinica 17 e conta criada em 27/05/2026

## 1. Contexto corrigido

- A auditoria anterior encontrou a clinica antiga `id = 3`, `Wilker`, `wilker1983@gmail.com`, com exclusao definitiva registrada.
- O usuario esclareceu que esse era um alvo historico correto, mas nao o caso atual.
- O alvo atual e o usuario `Wilker@digitalprodutora.com.br`, cadastrado pelo ADM da conta/clinica `ID 17`.
- Tambem existe o relato de uma conta/clinica criada em `27/05/2026` que sumiu do sistema.
- Esta etapa foi executada somente em modo leitura.

## 2. Escopo e proibicoes

- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum script de correcao foi executado.
- Nao houve recriacao de conta ou usuario.
- Nao houve restauracao de dados.

## 3. Linha do tempo

- `ee56c2a0579e04db93d0f3ac4b24ea1b96e3ac4e` - `Corrige exclusao de usuario no modulo usuarios`.
  - Arquivos: `backend/routes/user_admin_routes.py`, `docs/11_roadmap_desenvolvimento.md`, `docs/correcao_exclusao_usuario_modulo_usuarios.md`.
  - Alterou codigo: sim.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: direta.
- `1b1f0f3` - `Documenta validacao da exclusao de usuario comum`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: validacao manual.
- `e286373` - `Documenta validacao aprovada da 8W-B`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_validacao_8w_b_usuarios_novos_aprovada.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: indireta.
- `0795fe4` - `Extrai renderizacao visual de combos de preferencias`.
  - Arquivos: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos.md`.
  - Alterou codigo: sim.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: nao direta.
- `bcf7e2c` - `Extrai renderizacao visual de combos de modelos`.
  - Arquivos: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos_modelos.md`.
  - Alterou codigo: sim.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: nao direta.
- `dd6a75d` - `Audita suspeita de regressao apos prefRenderCombosModelos`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/auditoria_regressao_pos_pref_render_combos_modelos_conta_usuario_sumidos.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: apenas documental.
- `f527ba7` - `Audita conta ausente e usuario Wilker`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/auditoria_forense_exclusao_conta_usuario_wilker.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao de usuario/conta: apenas documental.
- `commit atual da branch` - auditado apenas em leitura para esta etapa.

## 4. Resultado sobre Wilker@digitalprodutora.com.br

- Buscas executadas por:
  - `Wilker@digitalprodutora.com.br`
  - `wilker@digitalprodutora.com.br`
  - `digitalprodutora.com.br`
  - `Wilker`
  - `wilker`
- Tabelas principais consultadas:
  - `usuarios`
  - `clinicas`
  - `prestador_odonto`
  - `usuario_perfil_acesso`
  - `access_profile`
  - `unidade_atendimento`
  - `plataforma_auditoria`
  - `email_codes`
- Resultado nas tabelas principais:
  - nao foi encontrado usuario com `Wilker@digitalprodutora.com.br`;
  - nao foi encontrado usuario com `wilker@digitalprodutora.com.br`;
  - nao foi encontrado registro com `digitalprodutora.com.br`;
  - nao foi encontrado registro ativo, inativo ou soft-deleted para esse email nas tabelas principais consultadas.
- Resultado na auditoria:
  - nao apareceu evento de criacao, atualizacao ou exclusao para `Wilker@digitalprodutora.com.br`;
  - nao apareceu evento de autoria relacionado a esse email;
  - os unicos registros de `Wilker` continuam sendo os historicos do caso antigo `id = 3 / wilker1983@gmail.com`.
- Conclusao para Wilker:
  - o alvo correto nao foi localizado nas tabelas principais nem na auditoria consultada;
  - nao ha evidencia suficiente de autoria para esse usuario;
  - classificacao: **W-D**.

## 5. Resultado sobre clinica ID 17

- A clinica `ID 17` existe no banco atual.
- Dados encontrados:
  - `id = 17`
  - `nome = Tel`
  - `email = institutobrana@gmail.com`
  - `ativo = true`
  - `criado_em = 2026-05-26 18:32:17.857708-03:00`
- Usuarios vinculados atualmente:
  - `id = 39`, `codigo = 255`, `nome = Clinica`, `email = clinica.255.c17@system.brana.local`, `is_system_user = true`
  - `id = 40`, `codigo = 1`, `nome = Tel`, `email = institutobrana@gmail.com`, `is_admin = true`
- Resultado na auditoria para `clinica_id = 17`:
  - nao encontrei eventos de exclusao ou criacao vinculados a `17` na `plataforma_auditoria`;
  - nao encontrei evento com `digitalprodutora.com.br` ligado a essa clinica;
  - nao encontrei `Wilker@digitalprodutora.com.br` vinculado a `17`.
- Conclusao para a clinica `17`:
  - a clinica existe ativa e nao apresenta indicio de exclusao;
  - ela nao corresponde ao alvo informado pelo usuario com `digitalprodutora.com.br`;
  - classificacao: **C17-A**.

## 6. Resultado sobre conta criada em 27/05/2026

- Buscas executadas:
  - clinicas com `criado_em::date = 2026-05-27`;
  - clinicas com `data_ativacao::date = 2026-05-27`;
  - auditoria com `criado_em::date = 2026-05-27`;
  - auditoria com referencias a `2026-05-27`, `27/05/2026`, `signup`, `create_clinic`, `create_user`, `delete`, `excluir`, `removido`.
- Resultado nas tabelas principais:
  - nao encontrei clinica criada em `2026-05-27`.
  - nao encontrei conta/clinica candidata nessa data no conjunto consultado.
- Resultado na auditoria:
  - nao encontrei evento de criacao de conta/clinica nessa data.
  - nao encontrei evento de exclusao/inativacao posterior associado a uma conta criada em `27/05/2026`.
- Conclusao para a conta de `27/05/2026`:
  - com os identificadores atuais, a conta permanece inconclusiva;
  - nao ha candidato confirmado no banco consultado;
  - classificacao: **D27-D**.

## 7. Relacao com a correcao de exclusao de usuario

- A correcao de exclusao de usuario foi analisada em leitura.
- Ela atua no fluxo de exclusao do proprio usuario e na limpeza de dependencias do usuario removido.
- Nao ha evidencia de que ela apague outra clinica arbitrariamente.
- Nao ha evidencia de chamada `DELETE /admin/users` para `Wilker@digitalprodutora.com.br`.
- Nao ha evidencia de que essa correcao tenha sido executada para o alvo correto informado nesta etapa.
- Classificacao: **R-C**.

## 8. Relacao com as modularizacoes recentes

- As modularizacoes recentes de `Preferencias / Configuracoes` permaneceram restritas a renderizacao visual e documentacao.
- Nao houve alteracao em rotas de usuario, rotas de clinica, banco ou scripts de exclusao.
- Nao ha indicio de relacao causal entre essas modularizacoes e a ausencia do alvo correto.
- Classificacao: **R-C**.

## 9. Foi possivel identificar quem excluiu?

- Para `Wilker@digitalprodutora.com.br`: nao.
- Para a conta/clinica de `27/05/2026`: nao.
- Para a clinica `ID 17`: nao houve exclusao identificada.
- Motivo: nao foi encontrado evento de auditoria correspondente aos alvos corretos nesta trilha.

## 10. Classificacao final

- `Wilker@digitalprodutora.com.br`: **W-D**.
- `clinica ID 17`: **C17-A**.
- `conta criada em 27/05/2026`: **D27-D**.
- `relacao com regressao`: **R-C**.

## 11. Proxima etapa recomendada

- Para `Wilker@digitalprodutora.com.br`: pedir ao usuario um identificador complementar da conta correta, como nome da clinica, id interno, data aproximada ou email alternativo.
- Para a conta de `27/05/2026`: pedir nome, email ou `id_clinica`.
- Nao ha base, nesta leitura, para atribuir o desaparecimento as modularizacoes recentes.

## 12. Confirmacoes de escopo

- Nenhum codigo alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Dados do banco nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## 13. Registro para roadmap

- Nova auditoria forense com alvo corrigido, `Wilker@digitalprodutora.com.br`, foi executada em leitura.
- A clinica `ID 17` encontrada no banco atual e `Tel / institutobrana@gmail.com`, sem relacao com o alvo correto.
- Nao foi encontrada conta criada em `27/05/2026` no conjunto consultado.
- A classificacao final ficou em `W-D`, `C17-A`, `D27-D` e `R-C`.
- A blindagem textual/mojibake foi respeitada.
