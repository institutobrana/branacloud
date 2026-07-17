# Contrato de Implantacao de Schema One-Shot

## Objetivo

Definir o fluxo manual e idempotente para inicializar um PostgreSQL vazio com o schema oficial do Brana Cloude, sem bootstrap no startup permanente.

## Comandos

- `backend/scripts/apply_schema_baseline.py --plan`
- `backend/scripts/apply_schema_baseline.py --apply`
- `backend/scripts/apply_schema_baseline.py --validate`

## Protecoes

- exige `BRANA_SCHEMA_DEPLOYMENT_ACK`
- exige perfil permitido em `BRANA_RUNTIME_PROFILE`
- usa advisory lock para impedir concorrencia
- bloqueia localhost sem sinalizacao explicita
- nao expõe URL nem senha em logs
- nao dispara via HTTP

## Regra permanente

- o startup normal do backend permanece sem bootstrap automatico
- compatibilidades aditivas devem ficar fora do fluxo permanente
- o schema aplicado deve ser versionado e validado antes de uso
