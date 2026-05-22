# Access Profile - Subetapa 6A: consolidacao da trilha validada

## Branch
`modularizacao-segura-fase-1`

## Commit base
`ffc8d26 - Corrige bootstrap de perfis de acesso no signup`

## Objetivo da consolidacao
Consolidar a trilha Access Profile do modulo Usuarios apos a validacao real do signup em banco isolado, deixando claro o que foi feito, o que foi validado, o que ainda nao foi feito, os riscos pendentes e a ordem segura para os proximos passos.

## Linha do tempo resumida das subetapas 1 a 5G
1. Subetapa 1: criada a fonte versionada passiva dos perfis base em `backend/seeds/access_profiles_default.py`.
2. Subetapa 2: criado o bootstrap idempotente controlado em `backend/seeds/access_profiles_bootstrap.py`.
3. Subetapa 3A: criado o dry-run controlado em `backend/seeds/access_profiles_dry_run.py`.
4. Subetapa 3B: executado dry-run somente leitura contra o banco real, com diagnostico das clinicas 1, 4 e 8.
5. Subetapa 4: acoplado o bootstrap oficial ao signup de novas clinicas em `backend/services/signup_service.py`.
6. Subetapa 4A: avaliado que o signup real no banco principal nao era seguro.
7. Subetapa 5A: documentada a necessidade de ambiente isolado.
8. Subetapa 5B: documentado o roteiro operacional para banco de teste.
9. Subetapa 5C: preparado o banco isolado `brana_saas_test`.
10. Subetapa 5D: executado signup real no banco isolado e identificado que os 10 perfis nao foram materializados.
11. Subetapa 5E: diagnosticada a causa provavel, que o bootstrap ainda era passivo.
12. Subetapa 5F: corrigido o bootstrap para materializar `AccessProfile` com `db.add(...)`.
13. Subetapa 5G: repetido o signup real no banco isolado, agora com sucesso na criacao dos 10 perfis base.

## Lista de arquivos funcionais envolvidos
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/services/signup_service.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/database.py`

## Lista de documentos produzidos
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`
- `docs/access_profile_subetapa_3a_dry_run_controlado.md`
- `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md`
- `docs/access_profile_subetapa_5b_roteiro_operacional_banco_teste.md`
- `docs/access_profile_subetapa_5c_banco_teste_isolado_preparado.md`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5e_diagnostico_signup_sem_access_profile.md`
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`

## Resumo do contrato funcional
- `access_profile` e a base funcional por clinica.
- `usuario_perfil_acesso` e o vinculo `usuario + perfil + prestador`.
- `usuario_perfil_acesso` pode nascer vazio.
- Nova clinica deve nascer com `access_profile` base.
- ADM nao exibe a aba `Perfis de acesso`.
- Usuario comum nao ADM deve exibir a aba `Perfis de acesso`.

## O que ficou validado
- O signup chama o bootstrap oficial.
- O bootstrap materializa os 10 perfis.
- O teste real passou em `brana_saas_test`.
- O banco principal `brana_saas` nao foi tocado.

## O que ainda nao foi feito
- Clinicas existentes nao foram corrigidas.
- Clinica 1 nao foi corrigida.
- Clinica 4 nao foi corrigida.
- Clinica 8 nao foi completada.
- A UI da aba `Perfis de acesso` nao foi corrigida.
- `usuario_perfil_acesso` nao foi preenchido no fluxo de validacao.
- O fluxo visual de perfil funcional + prestadores ainda nao foi estabilizado.

## Riscos pendentes
- Clinicas existentes podem continuar sem `access_profile` ou com base incompleta.
- A UI pode continuar vazia ou incompleta nessas clinicas.
- A correcao de clinicas existentes exige autorizacao propria.
- A UI deve ser corrigida somente depois da estrategia de dados existentes.

## Proxima decisao recomendada
Preparar a estrategia para clinicas existentes e, somente depois, retomar a UI da aba `Perfis de acesso`.

## Ordem segura recomendada
1. 6B: estrategia documental para clinicas existentes.
2. 6C: dry-run ou correcao controlada de clinicas existentes, se autorizado.
3. Depois: estabilizacao da UI da aba `Perfis de acesso`.
4. Depois: retomar a modularizacao do modulo Usuarios.

## Confirmacoes de escopo
- Nenhum codigo foi alterado nesta consolidacao.
- Nenhum banco foi alterado nesta consolidacao.
- Nenhum signup foi executado nesta consolidacao.
- Nenhuma conta foi criada nesta consolidacao.
- Frontend e UI nao foram alterados.
- Rotas e endpoints nao foram alterados.
- `usuario_perfil_acesso` nao foi alterado.

