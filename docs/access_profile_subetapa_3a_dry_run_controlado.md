# Access profile subetapa 3A - dry-run controlado

## 1. Objetivo
Criar um mecanismo de dry-run tecnico e somente leitura para diagnosticar a situacao de `access_profile` por clinica e simular, sem escrita no banco, quais perfis funcionais seriam criados pela base versionada.

## 2. Contrato usado como base
- `docs/contrato_funcional_usuarios_novas_contas.md`

## 3. Documento tecnico usado como base
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`

## 4. Arquivos criados
- `backend/seeds/access_profiles_dry_run.py`
- `docs/access_profile_subetapa_3a_dry_run_controlado.md`

## 5. Funcoes criadas e nomes exatos
- `build_access_profiles_dry_run_for_clinic(db, clinica_id)`
- `build_access_profiles_dry_run_for_all_clinics(db, clinica_ids=None)`

## 6. Comportamento somente leitura
O dry-run foi desenhado para:
- receber `db` explicitamente;
- consultar `access_profile` existente da clinica;
- comparar com a lista versionada da Subetapa 1;
- identificar `existing`, `missing` e `skipped`;
- nao escrever no banco;
- nao chamar `db.add`;
- nao chamar `db.flush`;
- nao chamar `db.commit`;
- nao abrir conexao propria;
- nao executar automaticamente no import.

## 7. Bootstrap real nao executado
A funcao real de bootstrap idempotente da Subetapa 2 nao foi executada.

## 8. Banco nao alterado
Nao houve qualquer alteracao em banco nesta subetapa.

## 9. Clinica 1 nao corrigida
A clinica 1 nao foi corrigida nesta subetapa.

## 10. Signup nao alterado
O fluxo de signup/cadastro de nova conta nao foi alterado.

## 11. Frontend/UI nao alterado
Nao houve alteracao em frontend nem na UI.

## 12. Aba Perfis de acesso segue para etapa futura
A aba `Perfis de acesso` permanece para etapa futura de estabilizacao da UI, depois de consolidar `access_profile`.

## 13. Regra documentada sobre a UI
### Regra funcional observada e registrada
1. A tela e aberta pelo botao `Permissoes`.
2. Para usuario ADM, a aba `Perfis de acesso` nao deve aparecer.
3. Isso esta correto, porque o ADM nao passa por esse filtro funcional por prestador.
4. Para usuario comum / nao ADM, a aba `Perfis de acesso` deve aparecer.
5. A aba correta deve ter:
   - quadro superior/lista de Perfis funcionais;
   - quadro inferior/lista de Prestadores com checkboxes;
   - selecao de perfil no quadro superior controlando os checkboxes dos prestadores no quadro inferior;
   - salvar persistindo em `usuario_perfil_acesso`;
   - reabrir carregando `assignments` corretamente.
6. O estado atual observado no Brana Cloud ainda esta incorreto:
   - a lista de Perfis pode aparecer vazia quando `access_profile` da clinica esta ausente;
   - prestadores aparecem;
   - layout e comportamento ainda nao correspondem ao esperado;
   - a correcao da UI fica para etapa futura, depois de estabilizar `access_profile`.

## 14. Campos reais usados do modelo `access_profile`
A funcao de dry-run utiliza o modelo real com os campos:
- `clinica_id`
- `source_id`
- `nome`
- `reservado`

## 15. Modelo de clinica localizado
Foi localizado o modelo de clinica em:
- `backend/models/clinica.py`

Campos relevantes observados:
- `id`
- `nome`
- `email`
- `tipo_conta`
- `licenca_usuario`
- `chave_licenca`
- `data_ativacao`
- `nome_tabela_procedimentos`
- `opcoes_sistema_json`
- `trial_ate`
- `ativo`

## 16. Retorno esperado do dry-run
O dry-run retorna um resumo estruturado com:
- `version`
- `clinica_id` ou `clinica_ids`
- `total_expected`
- `existing`
- `missing`
- `skipped`
- `would_create_count`

## 17. Limitacoes
- O dry-run e somente leitura e nao executa bootstrap real.
- Nao foi acoplado ao signup.
- Nao foi criado `usuario_perfil_acesso`.
- Nao foi alterado `access_profiles_service.py`.
- Nao foi corrigida a UI.
- A etapa nao resolve a clinica 1.

## 18. Proximos passos
### Subetapa 3B
Executao controlada/dry-run operacional, se necessario.

### Subetapa 4
Acoplamento controlado ao signup para novas clinicas.

### Subetapa 5
Tratamento de clinicas existentes, incluindo clinica 1, somente com autorizacao explicita.

### Depois
Estabilizacao da UI.

### Em seguida
Retomada da modularizacao do modulo Usuarios.

## 19. Onde testar antes de prosseguir
Como esta etapa nao deve alterar banco nem UI, o teste e indireto:
1. Abrir o sistema normalmente.
2. Fazer login como ADM.
3. Abrir modulo Usuarios.
4. Confirmar que a senha protegida continua funcionando igual.
5. Abrir um usuario existente.
6. Confirmar que o modal abre.
7. Confirmar que a aba `Perfis de acesso` ainda nao foi corrigida nesta etapa.
8. Confirmar que nenhum perfil foi criado automaticamente no banco.
9. Confirmar que signup/cadastro de nova conta nao foi alterado.
10. Confirmar que usuario ADM continua sem aba `Perfis de acesso`, quando aplicavel.
11. Confirmar que usuario nao ADM continua no comportamento atual ate etapa futura de UI.

## 20. Confirmacoes de escopo
Nesta subetapa:
- nenhum banco foi alterado;
- nenhum INSERT/UPDATE/DELETE foi executado;
- nenhum DROP/ALTER/TRUNCATE foi executado;
- nenhuma migration foi executada;
- nenhum seed real foi executado;
- nenhuma escrita foi feita pelo dry-run;
- `signup_service.py` nao foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado;
- rotas/endpoints nao foram alterados;
- protected grant nao foi alterado;
- permissoes nao foram alteradas;
- autenticao nao foi alterada.

## 21. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- O workspace continua com varios `?? docs/...` antigos do trabalho paralelo.
- Os arquivos desta subetapa ficaram salvos para revisao posterior.

