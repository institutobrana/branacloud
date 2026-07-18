# Contrato de Provisionamento do Tenant Inicial para AWS

## Objetivo

Definir o fluxo one-shot separado para provisionar o primeiro tenant de homologacao do Brana Cloude apos a baseline de schema estar aplicada.

## Escopo

Incluido:

- criar a primeira clinica de homologacao;
- criar a unidade de atendimento principal;
- criar o prestador principal;
- criar o usuario administrador inicial;
- criar ou reutilizar o perfil administrativo nativo;
- criar os vinculos necessarios entre usuario, prestador, unidade e perfil;
- executar `--plan`, `--apply` e `--validate` em banco PostgreSQL descartavel;
- bloquear concorrencia com advisory lock;
- exigir ACK intencional antes do `--apply`;
- validar rollback transacional.

Excluido:

- bootstrap no startup;
- migrations automáticas;
- `Base.metadata.create_all`;
- criacao de paciente;
- criacao de dados clinicos adicionais;
- acesso a AWS ou RDS real nesta fase local;
- alteracao de frontend;
- alteracao de schema de base.

## Comando oficial

- `python -m backend.scripts.provision_initial_tenant --plan`
- `python -m backend.scripts.provision_initial_tenant --apply`
- `python -m backend.scripts.provision_initial_tenant --validate`

## Variaveis obrigatorias

- `BRANA_RUNTIME_PROFILE=homologation`
- `BRANA_INITIAL_CLINIC_NAME`
- `BRANA_INITIAL_CLINIC_EMAIL`
- `BRANA_INITIAL_UNIT_NAME`
- `BRANA_INITIAL_PROVIDER_NAME`
- `BRANA_INITIAL_PROVIDER_CODE`
- `BRANA_INITIAL_ADMIN_NAME`
- `BRANA_INITIAL_ADMIN_EMAIL`
- `BRANA_INITIAL_ADMIN_PASSWORD`

### Por modo

- `--plan`: exige somente os seis identificadores do tenant inicial; nao usa senha e nao usa ACK.
- `--apply`: exige os seis identificadores, `BRANA_INITIAL_ADMIN_PASSWORD` e `BRANA_INITIAL_TENANT_ACK`.
- `--validate`: exige os seis identificadores; nao usa senha original e nao usa ACK.

## ACK obrigatorio

- `BRANA_INITIAL_TENANT_ACK=BRANA_INITIAL_TENANT_PROVISIONING_ACKNOWLEDGED`

## Regras de seguranca

- A senha inicial nao deve ser passada em argumento CLI visivel.
- O comando nao deve imprimir senha, hash completo, `DATABASE_URL` ou segredo.
- O provisionamento deve falhar se a baseline de schema nao estiver aplicada.
- O provisionamento deve falhar se o estado indicar conflito ou tenant ja provisionado.
- O `--apply` deve usar transacao unica e fazer rollback integral em caso de erro.
- O provisionamento deve usar advisory lock proprio.

## Ordem funcional validada

1. confirmar baseline aplicada;
2. carregar modelos ORM completos;
3. validar entrada;
4. confirmar ACK;
5. adquirir advisory lock;
6. criar ou localizar clinica;
7. criar ou localizar unidade principal;
8. criar ou localizar perfil administrativo nativo;
9. criar ou localizar prestador principal;
10. criar usuario administrador;
11. vincular usuario ao prestador e a unidade;
12. criar `usuario_perfil_acesso`;
13. validar estado final;
14. confirmar commit apenas ao final.

## Idempotencia e conflitos

- segunda execucao com os mesmos dados deve ser recusada;
- e-mail existente deve bloquear;
- codigo de prestador existente deve bloquear;
- estado parcialmente criado deve bloquear;
- concorrencia deve ser bloqueada pelo advisory lock.

## Rollback

Falhas provocadas apos qualquer etapa devem deixar o banco no mesmo estado anterior ao comando, sem registros parciais em `clinicas`, `unidade_atendimento`, `prestador_odonto`, `usuarios`, `access_profile` e `usuario_perfil_acesso`.

## Validacao

O `--validate` deve confirmar:

- clinica criada;
- unidade criada;
- prestador criado;
- usuario criado;
- perfil administrativo criado ou reutilizado;
- vinculos corretos;
- senha com hash valido;
- ausencia de pacientes;
- ausencia de duplicidade;
- baseline de schema reconhecida.

## Doc-base relacionado

Este contrato complementa:

- `docs/05_banco_dados.md`
- `docs/08_setup_execucao.md`
- `docs/10_continuidade.md`
- `docs/contrato_docker_backend_aws.md`
