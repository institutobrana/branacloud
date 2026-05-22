# Subetapa 4 - Acoplamento controlado do bootstrap de `access_profile` ao signup para novas clinicas

## Objetivo
Registrar o acoplamento controlado do bootstrap de `access_profile` ao fluxo de signup/cadastro de nova conta, para que novas clinicas passem a nascer com a lista base funcional de perfis de acesso. Esta versao foi revisada antes de qualquer commit para remover duplicacao de logica no signup.

## Base funcional e documental
- Contrato funcional: `docs/contrato_funcional_usuarios_novas_contas.md`
- Plano tecnico: `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- Fonte passiva versionada: `backend/seeds/access_profiles_default.py`
- Bootstrap idempotente controlado: `backend/seeds/access_profiles_bootstrap.py`
- Dry-run controlado: `backend/seeds/access_profiles_dry_run.py`
- Execucao operacional do dry-run: `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- Blindagem textual/mojibake: `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Branch conferida
- `modularizacao-segura-fase-1`

## Commit base
- `ece9fc8 - Documenta execucao do dry-run de perfis de acesso`

## Arquivo alterado
- `backend/services/signup_service.py`

## Ponto exato do acoplamento
O bootstrap foi acoplado dentro de `criar_conta_saas(db, nome, email, senha)`, logo apos a criacao da clinica e do usuario sistemico, no trecho que sucede:
- `_garantir_usuario_sistemico_clinica(db, clinica.id, prestador_sistemico)`

e antecede a criacao do usuario ADM/dono da nova conta.

## Justificativa tecnica
- A chamada ocorre somente depois de existir `clinica.id` valido.
- A mesma sessao `db` do signup eh reutilizada.
- Nao ha abertura de conexao propria no bootstrap.
- Nao ha commit interno no bootstrap.
- O fluxo continua idempotente por desenho, pois a fonte oficial de criacao fica concentrada em `backend/seeds/access_profiles_bootstrap.py`.
- O signup permanece responsavel pela persistencia final no commit ja existente ao fim do fluxo.

## Garantia de idempotencia
- A lista funcional base continua sendo lida de `backend/seeds/access_profiles_default.py` pela fonte oficial.
- O signup nao recria `AccessProfile` diretamente.
- O helper de bootstrap continua permitindo criacao apenas dos perfis ausentes.
- Perfis existentes nao sao sobrescritos.
- Perfis existentes nao sao apagados.

## Garantia de mesma sessao e transacao
- O bootstrap foi acoplado usando a mesma sessao `db` do signup.
- Nao existe nova sessao.
- Nao existe commit interno no bootstrap.
- A persistencia final segue o commit ja existente do fluxo de signup.

## O que nao foi alterado nesta etapa
- Nao houve alteracao de `usuario_perfil_acesso`.
- Nao houve correcao de clinicas existentes.
- Nao houve correcao da clinica 1.
- Nao houve alteracao de frontend.
- Nao houve alteracao da UI/aba `Perfis de acesso`.
- Nao houve alteracao de rotas/endpoints.
- Nao houve alteracao da lista base de perfis.
- Nao houve seed real.
- Nao houve migration.
- Nao houve criacao direta de `AccessProfile` dentro do signup.
- Nao houve leitura direta de `get_default_access_profiles()` ou `get_default_access_profiles_version()` no signup para esse fluxo.

## Garantia sobre clinicas existentes
- As clinicas existentes nao foram corrigidas por esta etapa.
- Clinica 1, clinica 4 e clinica 8 nao foram alteradas diretamente.
- O acoplamento foi pensado para o nascimento de novas clinicas no signup.

## Garantia sobre `usuario_perfil_acesso`
- Nao foram criados vinculos `usuario + perfil funcional + prestador`.
- A tabela `usuario_perfil_acesso` continua sem alteracoes nesta etapa.

## Como testar no sistema
Se houver ambiente seguro para criar nova conta, testar:
1. Abrir o sistema normalmente.
2. Fazer login como ADM ja existente.
3. Confirmar que o modulo Usuarios continua abrindo.
4. Confirmar que a senha protegida continua funcionando.
5. Confirmar que usuario existente continua abrindo no modal.
6. Criar uma nova conta/clinica pelo fluxo normal de signup/cadastro.
7. Confirmar que a nova clinica foi criada.
8. Confirmar que a nova clinica nasceu com os 10 `access_profile` base.
9. Confirmar que `usuario_perfil_acesso` continua vazio para a nova clinica, salvo se outro fluxo ja o preencher por motivo independente.
10. Confirmar que clinicas antigas nao foram modificadas.
11. Confirmar que a aba `Perfis de acesso` ainda nao foi corrigida visualmente nesta etapa.

Se nao houver ambiente seguro para criar nova conta, o teste deve permanecer pendente para validacao manual do usuario.

## Riscos e proximos passos
- Risco de divergencia futura caso a forma de retorno da rotina de bootstrap mude.
- Risco de o fluxo de signup precisar de ajuste fino caso a persistencia final do commit mude.
- Proxima etapa recomendada:
  - validar em ambiente seguro a criacao de uma nova clinica;
  - depois avaliar a estabilizacao da UI da aba `Perfis de acesso`;
  - depois retomar a modularizacao do modulo Usuarios.

## Revisao desta versao
- A primeira versao da subetapa 4 foi revisada antes de commit.
- A duplicacao de logica no signup foi removida.
- A fonte unica de criacao dos perfis base permanece em `backend/seeds/access_profiles_bootstrap.py`.
- O signup apenas chama `ensure_default_access_profiles_for_clinic(db, clinica_id)`.
- Nao ha criacao direta de `AccessProfile` no signup.
- Nao ha leitura direta de `get_default_access_profiles()` ou `get_default_access_profiles_version()` no signup.
- A mesma sessao/transacao `db` continua sendo usada.

## Resultados esperados desta etapa
- Nova clinica nascendo com a lista base funcional de perfis de acesso.
- Clinicas existentes permanecendo inalteradas.
- Sem impacto na UI, em rotas, em `usuario_perfil_acesso` ou em `access_profiles_default.py`.
