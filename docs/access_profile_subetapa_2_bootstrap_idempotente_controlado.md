# Access profile subetapa 2 - bootstrap idempotente controlado

## 1. Objetivo
Desenhar uma funcao idempotente e controlada para bootstrap de `access_profile` usando a fonte versionada passiva criada na Subetapa 1, sem executar nada no banco.

## 2. Contrato usado como base
- `docs/contrato_funcional_usuarios_novas_contas.md`

## 3. Arquivo criado
- `backend/seeds/access_profiles_bootstrap.py`

## 4. Funcao criada
- `ensure_default_access_profiles_for_clinic(db, clinica_id)`

## 5. Comportamento idempotente planejado
A funcao foi desenhada para:
- receber `db` explicitamente;
- receber `clinica_id` explicitamente;
- ler a lista versionada de `backend/seeds/access_profiles_default.py`;
- consultar os perfis existentes da clinica;
- criar somente perfis ausentes em um futuro uso controlado;
- nao sobrescrever perfis existentes;
- nao apagar perfis existentes;
- nao alterar nomes existentes;
- nao alterar `usuario_perfil_acesso`;
- preservar dados existentes;
- respeitar `clinica_id`.

## 6. Campos reais usados do modelo `access_profile`
A funcao foi alinhada com o modelo real observado em `backend/models/access_profile.py`:
- `clinica_id`
- `source_id`
- `nome`
- `reservado`

## 7. O que foi feito nesta subetapa
Esta subetapa criou apenas a funcao de planejamento/preview controlado.

Ela nao:
- abre conexao por conta propria;
- cria sessao propria;
- executa escrita no banco;
- executa commit;
- executa bootstrap automatico;
- altera signup;
- altera endpoint;
- altera frontend;
- altera a clinica 1;
- altera `usuario_perfil_acesso`.

## 8. O que nao foi feito nesta subetapa
Nao houve:
- alteracao de banco;
- execucao de seed;
- execucao de migration;
- acoplamento ao signup;
- chamada automatica da funcao em import;
- correcao da clinica 1.

## 9. Retorno esperado da funcao
A funcao retorna um resumo simples em formato de dicionario, contendo:
- `version`
- `clinica_id`
- `created`
- `existing`
- `skipped`

## 10. Limitacoes encontradas
- A funcao foi desenhada como preview controlado, sem persistencia.
- A escrita real em banco fica para etapa futura separada.
- Nao foi alterado `access_profiles_service.py`.
- Nao foi acoplado ao signup.
- Nao foi criado `usuario_perfil_acesso`.

## 11. Proximos passos
### Subetapa 3
Acoplamento controlado ao signup ou teste controlado em dry-run, conforme decisao.

### Subetapa 4
Dry-run para clinicas existentes.

### Subetapa 5
Correcao controlada da clinica 1, se autorizada.

### Depois
Estabilizacao da UI e retomada da modularizacao.

## 12. Onde testar antes de prosseguir
Como esta etapa nao executa banco nem UI, o teste e indireto:
1. confirmar que o sistema continua abrindo normalmente;
2. fazer login como ADM;
3. abrir modulo Usuarios;
4. confirmar que a senha protegida continua funcionando igual;
5. abrir usuario existente;
6. confirmar que o modal abre;
7. confirmar que a aba Perfis de acesso ainda nao foi alterada nesta etapa;
8. confirmar que nenhum perfil foi criado automaticamente no banco;
9. confirmar que signup/cadastro de nova conta nao foi alterado nesta etapa.

## 13. Arquivos tocados
- `backend/seeds/access_profiles_bootstrap.py`
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`

## 14. Checks executados
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok

## 15. Confirmacoes de escopo
Nesta subetapa:
- nenhum banco foi alterado;
- nenhum seed foi executado;
- nenhuma migration foi executada;
- `signup_service.py` nao foi alterado;
- a clinica 1 nao foi corrigida;
- `usuario_perfil_acesso` nao foi alterado;
- frontend nao foi alterado;
- rotas/endpoints nao foram alterados;
- protected grant nao foi alterado;
- permissões nao foram alteradas.

## 16. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- O workspace continua com varios `?? docs/...` antigos do trabalho paralelo.
- Os arquivos desta subetapa ficaram salvos para revisao posterior.

## 17. Observacao futura sobre UI da aba Perfis de acesso
### Regra funcional a registrar
1. A tela e aberta pelo botao `Permissoes`.
2. Para usuario ADM, a aba `Perfis de acesso` nao deve aparecer.
3. Isso esta correto, porque o ADM nao passa por esse filtro funcional por prestador.
4. Para usuario comum / nao ADM, a aba `Perfis de acesso` deve aparecer.
5. A aba correta deve seguir o comportamento herdado/esperado:
   - quadro superior/lista de Perfis funcionais;
   - quadro inferior/lista de Prestadores com checkboxes;
   - ao selecionar um Perfil funcional no quadro superior, os checkboxes dos prestadores no quadro inferior representam os vinculos daquele usuario naquele perfil;
   - salvar deve persistir em `usuario_perfil_acesso`;
   - reabrir deve carregar `assignments` corretamente.
6. O estado atual observado no Brana Cloud ainda esta incorreto:
   - a lista de Perfis pode aparecer vazia quando `access_profile` da clinica esta ausente;
   - prestadores aparecem no quadro da direita / inferior;
   - layout e comportamento ainda nao correspondem a tela correta;
   - este ajuste fica para etapa futura de estabilizacao da UI, depois de estabilizar `access_profile`.
7. A correcao da UI nao deve ser feita nesta etapa.
