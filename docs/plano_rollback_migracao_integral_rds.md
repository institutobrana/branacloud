# Plano de rollback da migração integral

## Princípio

Rollback real baseado em restauração de snapshot manual pré-importação.

## Procedimento

1. Declarar falha.
2. Interromper tráfego para o destino ruim.
3. Restaurar o snapshot pré-importação em nova instância.
4. Confirmar endpoint e security groups.
5. Redirecionar a aplicação de forma controlada.
6. Testar `/health`.
7. Testar banco.
8. Liberar acesso apenas após validação.

## Simulação local validada

- banco descartável iniciado;
- restauração iniciada;
- falha provocada;
- banco parcial descartado;
- estado original recriado;
- validação retornando ao cenário inicial.

## Tempo operacional

O tempo de rollback deve ser medido na janela de corte real antes da autorização definitiva.
