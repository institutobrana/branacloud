# Fechamento AN.CLOSE - Ficha Pessoal / Anotações

Data: 2026-08-27

## Status

`Ficha Pessoal -> Anotações` está implementada no React e encerrada nesta frente.

- TipTap com toolbar de texto, alinhamentos, marcadores e tabela.
- Clipboard homologado manualmente no HTTPS LAN: Copy, Cut, Paste e paste inline sem quebra extra.
- Conteúdo integrado ao estado central e ao botão global `Grava`.
- Payload global de paciente envia `anotacoes` para POST/PUT.
- Conteúdo novo usa o marcador `BRANA_ANOTACOES_HTML_V1`.
- Conteúdo novo é sanitizado antes da persistência.
- Conteúdo legado RTF é detectado e preservado sem conversão.
- Os 1.356 registros RTF existentes não foram migrados nem alterados.

## Compatibilidade e segurança

O campo existente `pacientes.anotacoes` continua sendo utilizado. O backend já aceitava `Text` no payload e não foi alterado. RTF legado é mantido como valor opaco e não é editado pelo editor React, evitando sobrescrita acidental.

Não foi usado `dangerouslySetInnerHTML`, não houve acesso ao EasyDental e não houve migração ou conversão em massa.

## Homologação

A persistência de uma anotação nova pelo botão global `Grava` foi confirmada manualmente pelo usuário em runtime. Testes focais da frente: 9 PASS / 0 FAIL. Build React: PASS.

O smoke adicional desta auditoria não foi executado pelo agente porque a sessão de navegador conectada não disponibilizou abas controláveis. Isso não invalida a homologação manual já fornecida.

## Frente futura

`EasyDental -> Brana Cloud` permanece como follow-up separado para futura migração de Anotações. Esta pendência não mantém a aba React aberta como incompleta.
