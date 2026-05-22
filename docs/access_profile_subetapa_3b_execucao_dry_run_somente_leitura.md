# Access profile subetapa 3B - execucao dry-run somente leitura

## 1. Objetivo
Executar de forma operacional e controlada o dry-run criado na Subetapa 3A, em modo somente leitura, para diagnosticar a situacao real de `access_profile` por clinica.

## 2. Branch
- `modularizacao-segura-fase-1`

## 3. Commit base
- `f628635` - `Adiciona dry-run controlado de perfis de acesso`

## 4. Arquivos analisados
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/models/clinica.py`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`
- `docs/access_profile_subetapa_3a_dry_run_controlado.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 5. Forma segura de execucao usada
O dry-run foi executado com:
- `SessionLocal` de `backend/database.py`;
- Python do ambiente do projeto em `.venv`;
- carga temporaria dos modulos de modelo em memoria para registrar os mappers do SQLAlchemy no runtime;
- somente leitura;
- sem `db.add`;
- sem `db.flush`;
- sem `db.commit`;
- sem `db.delete`;
- sem `rollback` forcado;
- sem qualquer escrita em banco.

## 6. O dry-run foi executado
Sim. O dry-run foi executado contra o banco real em modo somente leitura.

## 7. Clinicas analisadas
Foram analisadas:
- clinica `1`;
- clinica `8`;
- todas as clinicas retornadas pela consulta de ids, que neste ambiente foram `1`, `4` e `8`.

## 8. Resultado por clinica
### 8.1 Clinica 1
- `clinica_id`: `1`
- `total_expected`: `10`
- `existing`: `0`
- `missing`: `10`
- `skipped`: `0`
- `would_create_count`: `10`

### 8.2 Clinica 4
- `clinica_id`: `4`
- `total_expected`: `10`
- `existing`: `0`
- `missing`: `10`
- `skipped`: `0`
- `would_create_count`: `10`

### 8.3 Clinica 8
- `clinica_id`: `8`
- `total_expected`: `10`
- `existing`: `3`
- `missing`: `7`
- `skipped`: `0`
- `would_create_count`: `7`

#### Observacao da clinica 8
Os perfis existentes encontrados para a clinica 8 foram:
- `Pacientes`
- `Controle de estoque`
- `Controle de recibos`

Os `source_id` observados nesses registros legados nao batem com a numeracao da fonte versionada atual. O dry-run comparou por nome para evitar falso negativo, mas essa divergencia deve ser observada em etapa futura de normalizacao, sem correcao nesta subetapa.

## 9. Resultado consolidado de todas as clinicas
`build_access_profiles_dry_run_for_all_clinics(db)` retornou:
- `clinica_ids`: `[1, 4, 8]`
- `total_clinicas`: `3`
- resumo individual de cada clinica conforme acima

## 10. Funcao executada
- `build_access_profiles_dry_run_for_clinic(db, clinica_id)`
- `build_access_profiles_dry_run_for_all_clinics(db, clinica_ids=None)`

## 11. Confirnacao de que nao houve alteracao de banco
Confirmado. Nenhum dado foi alterado no banco.

## 12. Confirmacao de que nenhum seed real foi executado
Confirmado. Nenhum seed real foi executado.

## 13. Confirmacao de que nenhuma migration foi executada
Confirmado. Nenhuma migration foi executada.

## 14. Confirmacao de que ensure_default_access_profiles_for_clinic nao foi chamada contra banco real
Confirmado. A execucao usou apenas o dry-run de leitura.

## 15. Confirmacoes adicionais de escopo
Nesta subetapa:
- `signup_service.py` nao foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado;
- rotas/endpoints nao foram alterados;
- `usuario_perfil_acesso` nao foi alterado;
- a clinica 1 nao foi corrigida;
- a UI/aba Perfis de acesso nao foi corrigida;
- protected grant nao foi alterado;
- autenticacao nao foi alterada.

## 16. Regra funcional de UI registrada para contexto
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

## 17. Modelo de clinica localizado
Foi localizado o modelo de clinica em:
- `backend/models/clinica.py`

Campos relevantes:
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

## 18. Limitacoes
- O dry-run precisou de carga de mapeadores em memoria no comando de execucao para resolver o registry do SQLAlchemy.
- Isso nao gerou escrita nem alterou o repositório de forma persistente.
- A consulta comparou perfis por nome, para evitar falso negativo em dados legados com `source_id` divergente.
- A etapa nao corrige a clinica 1 nem normaliza `access_profile`.

## 19. Proximos passos recomendados
### Subetapa 4
Acoplamento controlado ao signup para novas clinicas, se aprovado.

### Subetapa 5
Tratamento de clinicas existentes, incluindo clinica 1, somente com autorizacao explicita.

### Depois
Estabilizacao da UI da aba `Perfis de acesso`.

### Em seguida
Retomada da modularizacao do modulo Usuarios.

## 20. Onde testar antes de prosseguir
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

## 21. Checks executados
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> ok

## 22. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- O workspace continua com varios `?? docs/...` antigos do trabalho paralelo.
- Os arquivos desta subetapa ficaram salvos para revisao posterior.

