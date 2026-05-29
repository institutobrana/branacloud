# Auditoria forense - conta ausente e usuario Wilker ausente

## 1. Contexto

- Houve anteriormente um problema com exclusao de usuario.
- A correcao foi aplicada e validada manualmente pelo usuario.
- Em seguida ocorreram modularizacoes posteriores em `Preferencias / Configuracoes`.
- No momento atual, o usuario relatou ausencia de uma conta/clinica e do usuario `Wilker`.
- Esta etapa e somente leitura.

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
  - Relacao com exclusao: direta.
- `1b1f0f3` - `Documenta validacao da exclusao de usuario comum`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao: validacao manual.
- `e286373` - `Documenta validacao aprovada da 8W-B`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_validacao_8w_b_usuarios_novos_aprovada.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao: indireta, por estar depois da validacao de exclusao de usuario.
- `0795fe4` - `Extrai renderizacao visual de combos de preferencias`.
  - Arquivos: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos.md`.
  - Alterou codigo: sim.
  - Alterou banco: nao.
  - Relacao com exclusao: nao direta.
- `bcf7e2c` - `Extrai renderizacao visual de combos de modelos`.
  - Arquivos: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md`, `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos_modelos.md`.
  - Alterou codigo: sim.
  - Alterou banco: nao.
  - Relacao com exclusao: nao direta.
- `dd6a75d` - `Audita suspeita de regressao apos prefRenderCombosModelos`.
  - Arquivos: `docs/11_roadmap_desenvolvimento.md`, `docs/auditoria_regressao_pos_pref_render_combos_modelos_conta_usuario_sumidos.md`.
  - Alterou codigo: nao.
  - Alterou banco: nao.
  - Relacao com exclusao: apenas documental.

## 4. Estrutura tecnica de exclusao encontrada

- Rota de exclusao de usuario: `backend/routes/user_admin_routes.py`, endpoint `DELETE /admin/users/{user_id}` em `admin_delete_user()`.
- Guardas presentes:
  - nao permite excluir usuario base/sistemico;
  - nao permite excluir o proprio usuario logado;
  - nao permite excluir o ultimo administrador da clinica.
- Limpeza realizada antes do `DELETE`:
  - desvincula `prestador_odonto.usuario_id`;
  - remove `usuario_perfil_acesso`;
  - remove `relatorio_config`;
  - zera `controle_protetico.cirurgiao_id`;
  - zera `tratamento.cirurgiao_responsavel_id`, `cirurgiao_contratado_id`, `cirurgiao_solicitante_id` e `cirurgiao_executante_id`.
- Efeito extra do fluxo de usuario:
  - se a clinica ficar sem outros usuarios, o sistema arquiva o e-mail da clinica e marca `clinica.ativo = False`.
- Rota de exclusao de clinica/conta: `backend/routes/superadmin_routes.py`, endpoint `DELETE /superadmin/clinicas/{clinica_id}` em `superadmin_delete_clinica()`.
- Estrategia de conta/clinica:
  - `_delete_clinica_definitiva()` remove dependencias e depois apaga `clinicas`.
  - a exclusao e definitiva, nao soft delete.
- Scripts relacionados:
  - `backend/scripts/remover_conta_teste.py`.
  - `backend/scripts/delete_test_clinic_9_runner.py`.
  - `backend/scripts/delete_test_clinic_10_runner.py`.
  - `backend/scripts/delete_test_clinic_12_runner.py`.
  - `backend/scripts/delete_test_clinic_15_runner.py`.
  - `backend/scripts/delete_test_clinic_runner.py`.

## 5. Busca por Wilker

- Termos pesquisados:
  - `Wilker`
  - `wilker`
  - `WILKER`
  - `wilker1983@gmail.com`
- Banco consultado: `brana_saas`.
- Tabelas principais consultadas:
  - `clinicas`
  - `usuarios`
  - `prestador_odonto`
  - `usuario_perfil_acesso`
  - `access_profile`
  - `unidade_atendimento`
  - `plataforma_auditoria`
- Resultado nas tabelas principais:
  - `clinicas`: sem registro atual para `Wilker`.
  - `usuarios`: sem registro atual para `Wilker`.
  - `prestador_odonto`: sem registro atual para `Wilker`.
  - `usuario_perfil_acesso`: sem registro atual para `Wilker`.
  - `access_profile`: sem registro atual para `Wilker`.
  - `unidade_atendimento`: sem registro atual para `Wilker`.
- Resultado na auditoria:
  - `plataforma_auditoria` registrou `usuario_status_update` para `alvo_id = 3`, com `detalhes_json` contendo `{"ativo": false, "email": "wilker1983@gmail.com"}`.
  - `plataforma_auditoria` registrou `clinica_delete_definitivo` para `alvo_id = 3`, com `detalhes_json` contendo `{"clinica_id": 3, "clinica_nome": "Wilker", "clinica_email": "wilker1983@gmail.com", "usuarios_removidos": 1}`.
  - Autor da acao: `actor_user_id = 1`, `actor_email = gleissontel@gmail.com`.
  - IP registrado: `127.0.0.1`.
  - Data/hora: `2026-03-06 10:57:28.960366-03:00` e `2026-03-06 16:12:51.016505-03:00`.
- Arquivos/docs onde `Wilker` apareceu:
  - `docs/anamnese_legado_busca_textual_id1.txt`
  - `storage/modelos/clinicas/15/outros/Novo modelo Wilker.txt`

## 6. Resultado sobre Wilker

- `Wilker` nao existe atualmente nas tabelas principais consultadas.
- Ha evidencias de que o usuario foi marcado como inativo e a clinica foi excluida definitivamente.
- A autoria da exclusao esta registrada na tabela de auditoria.
- Classificacao para `Wilker`: **Opcao C**.

## 7. Busca sobre conta/clinica ausente

- A auditoria conseguiu identificar uma conta/clinica concreta: `clinica_id = 3`, nome `Wilker`, e-mail `wilker1983@gmail.com`.
- Nao ha registro atual desta clinica na tabela `clinicas`.
- A tabela de auditoria confirma a exclusao definitiva dessa clinica.
- Se existir uma segunda conta ausente alem dessa, ela permanece inconclusiva por falta de identificador exato.

## 8. Resultado sobre conta/clinica ausente

- Conta identificada na auditoria: `clinica_id = 3`, `Wilker`, excluida definitivamente.
- Classificacao para a conta identificada: **Opcao E**.
- Para eventual outra conta sem identificador, a situacao permanece **Opcao F**.

## 9. Relacao com a correcao de exclusao de usuario

- A correcao mexeu apenas na exclusao de usuario e no tratamento de dependencias do proprio usuario.
- A correcao nao mostra capacidade de apagar outra clinica de forma arbitraria.
- Ela pode, por regra, inativar/arquivar a propria clinica se o ultimo usuario for removido.
- Nao ha evidencia de que essa regra tenha causado o desaparecimento atual de `Wilker`.
- Nao ha evidencia de execucao dessa rota recente para `Wilker` na trilha atual da modularizacao.

## 10. Relacao com as modularizacoes recentes

- As implementacoes recentes de `Preferencias / Configuracoes` ficaram restritas a renderizacao visual de combos.
- O diff entre `5e6dd08` e `bcf7e2c` nao tocou `user_admin_routes.py`, `superadmin_routes.py`, banco ou scripts de exclusao.
- Nao ha indicio de que as modularizacoes recentes tenham causado o desaparecimento de `Wilker` ou da conta identificada.
- Classificacao para efeito de modularizacao/regressao: **Opcao H**.

## 11. Conclusao

- `Wilker`: **Opcao C**.
- Conta/clinica identificada: **Opcao E**.
- Outra conta sem identificador: **Opcao F**.
- Regresao ligada a modularizacao recente: **Opcao H**.

## 12. Foi possivel identificar quem excluiu?

- Sim.
- Quem: `actor_user_id = 1`, `actor_email = gleissontel@gmail.com`.
- Rotina registrada: `usuario_status_update` seguido de `clinica_delete_definitivo`.
- Se a pergunta for sobre uma segunda conta sem identificador, nao foi possivel identificar por falta de dados.

## 13. Proxima etapa recomendada

- Para `Wilker`: validar se a exclusao definitiva foi esperada e documentar o historico.
- Para eventual segunda conta: pedir ao usuario nome, e-mail, id_clinica ou data aproximada.
- Nao ha indicio de regressao de Preferencias a corrigir nesta trilha.

## 14. Confirmacoes de escopo

- Nenhum codigo alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Dados do banco nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## 15. Registro para roadmap

- Auditoria forense de conta ausente e usuario `Wilker` registrada.
- A conta identificada foi encontrada em auditoria de exclusao definitiva.
- A autoria foi identificada.
- A regressao ligada as modularizacoes recentes nao foi confirmada.
- Proxima etapa: validar o historico da exclusao ou pedir identificador da eventual segunda conta ausente.
- Blindagem textual/mojibake respeitada.
