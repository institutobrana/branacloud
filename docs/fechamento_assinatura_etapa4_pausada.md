# Fechamento — Assinatura digital / Etapa 4

**Estado:** `ETAPA 4 = PAUSADA / PARCIAL`

Este documento registra o checkpoint da etapa de infraestrutura local para assinatura digital. Ele não declara homologação operacional nem autoriza retomada automática.

## Evidências registradas

- Serviço WinSW `BranaCloudeMtls`: normalmente observado como `Stopped/Disabled`.
- Papel dedicado e conexão PostgreSQL: verificados nas provas administrativas registradas.
- Material mTLS: provisionado; `MTLS_POSTFLIGHT=PASS`.
- XML e configuração operacional: alinhados conforme os pós-voos registrados.
- ACL mínima do diretório `mtls` e do executável WinSW: aplicada com `MTLS_ACL_APPLY=PASS`.
- O teste de inicialização não passou. Após a ACL, o SCM registrou `7034`; o WinSW iniciou `python.exe` com PID `13300`.
- O stderr registrou `No Python at ...`; `runtime\pyvenv.cfg` aponta para Python 3.10.11 no perfil de Tel.

Esses itens são evidências do checkpoint e não equivalem a uma nova leitura do ambiente nesta revisão documental.

## Pendências

1. Preparar e validar um Python base compartilhado, independente do perfil de Tel.
2. Reconstruir o runtime com Python 3.10.11, lock e 42 wheels aprovados.
3. Testar o runtime sob a identidade do serviço antes de trocar o destino operacional.
4. Investigar separadamente o erro de registro de eventos do WinSW.

Não houve assinatura real, uso de PIN, chamada real a `/sign` ou homologação operacional concluída nesta etapa.

## Procedimento curto de retomada

1. Confirmar `Stopped/Disabled`, listeners preservados e origem do runtime.
2. Validar assinatura e SHA-256 do instalador oficial Python 3.10.11 AMD64.
3. Criar um candidato isolado fora do runtime operacional.
4. Instalar os 42 wheels offline com `--require-hashes` e o lock aprovado.
5. Executar `pip check`, imports e o entrypoint sem referência a `C:\Users\Tel`.
6. Fazer backup verificável e troca transacional reversível.
7. Repetir uma única prova controlada de TLS, sem assinatura.
8. Somente depois avaliar o caminho de assinatura.

## Segurança do checkpoint

Não incluir no commit de fechamento: `database-url.secret`, `mtls-service.json` operacional, chaves, certificados privados, logs, backups ACL/SDDL, dumps, credenciais, ambientes virtuais, `bin/`, `obj/`, `node_modules/`, `tmp/`, staging ou PDFs temporários.

As alterações preexistentes de backend, frontend, `local_bridge`, storage e testes permanecem preservadas e devem ser separadas em commits próprios. O arquivo literal `` `r`nexit `` também permanece fora deste checkpoint.

## Estado

`COMMIT/PUSH = NÃO EXECUTADO`

O branch permanece com alterações não relacionadas e artefatos locais. A etapa 4 continua pausada/parcial.
