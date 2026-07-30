# Bloqueio tecnico de migracao ROLLING para ExpressGatewayServices

## Sintese

A migracao controlada de `CANARY` para `ROLLING` foi tentada no service `default / brana-hml-backend` e rejeitada pela AWS.

Mensagem recebida:

`Updating to ROLLING deployment strategy is not supported for ExpressGatewayServices.`

## Causa

O service observado pertence a uma classe que nao aceita a estrategia `ROLLING` na operacao solicitada.

Isso nao e um erro de sintaxe do runner, nem uma falha de infraestrutura temporaria. E uma limitacao funcional do tipo do service.

## Impacto

- a publicacao nao avancou;
- o service permaneceu em `CANARY`;
- nenhuma mudanca foi aplicada na AWS;
- nao houve rollback;
- o Portao 3 segue bloqueado;
- a Anamnese segue nao publicada.

## Relacao com o runner e a configuracao

O runner local ainda modela `ROLLING` como contrato de configuracao em `ops/release/config/hml.json` e valida o fluxo conceitual.

Porem, o runner nao tinha um bloqueio especifico para a incompatibilidade do tipo de service com `ROLLING`.

Por isso, a validacao documental e operacional precisa tratar esta combinacao como indisponivel para o service atual.

## Caminhos futuros

1. Manter o service em `CANARY`.
2. Avaliar reconstrucao em outra arquitetura, em etapa separada.
3. Se um novo service for desenhado, validar antes a compatibilidade da estrategia de deployment.

## Recomendacao

Nao repetir a tentativa no service atual.

Qualquer mudanca futura deve nascer de nova decisao arquitetural e nova autorizacao executiva.

## Status final

- AWS intocada
- Portao 3 bloqueado
- Anamnese nao publicada
- nenhuma escrita executada
