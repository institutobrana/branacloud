# Fase G.3A.1 - Validacao runtime do Novo simbolo grafico

Data: 2026-08-04

## Resultado
- Validacao executada em leitura de codigo e build local.
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js frontend-react/tests/simbolosGraficosApi.test.js`: 24 testes aprovados, 0 falhas.
- `frontend-react`: build aprovado via `npm.cmd run build`.

## Contrato verificado
- Endpoint: `POST /cadastros/simbolos-graficos`.
- Hook de submit: `useCreateSimboloGrafico`.
- Modal envia payload com `descricao`, `especialidade`, `tipo_simbolo`, `tipo_marca`, `legacy_id`, `codigo`, `imagem_custom`, `desenho`, `bibliotecaSelecionadaId` e `bibliotecaSelecionada`.
- O backend responde com `id`, `codigo` e `descricao`.
- O `id` usado pelo React para selecao e recarga e `result.data.id`.
- A pagina recarrega a grade com `reload()` e tenta restaurar a selecao com `selectRow(createdSymbol.id)`.
- O modal fecha somente apos sucesso.
- Erro de submit permanece visivel no modal.

## Limites
- Nao foi executado fluxo manual no navegador.
- Nao foi feito POST real contra banco local nesta rodada.
- Trilha de origem/backfill permaneceu congelada.
