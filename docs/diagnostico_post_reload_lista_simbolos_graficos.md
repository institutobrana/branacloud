# Diagnostico do POST, persistencia, recarga e composicao da grade de simbolos graficos

Data: 2026-08-03

## Resultado
- A falha de leitura foi confirmada e o comportamento de `scope=biblioteca` foi medido no banco real.
- Nao houve vazamento de outra clinica na base observada.
- O `scope=biblioteca` continua amplo demais apenas no sentido historico de nao separar oficiais, seeds e testes, mas e o contrato funcional aprovado da grade.

## Sintoma observado
- O modal de criacao fecha apos o envio.
- O novo registro passa a aparecer na grade apos o reload.
- Na sessao autenticada observada, a grade ficou com 143 registros.

## Causa raiz anterior
- A tela de `SÃ­mbolos grÃ¡ficos` carregava a listagem com o `scope` padrao `catalogo`.
- No backend, esse `scope` restringe a resposta ao catalogo oficial identificado por `legacy_id`.
- Registros novos criados pelo fluxo `Novo` nao possuem `legacy_id`, portanto ficavam fora da lista.

## Medicao da composicao real da grade
- Clinica observada: `clinica_id = 1`.
- Total de simbolos ativos retornados por `scope=biblioteca`: `143`.
- Registros com `legacy_id`: `81`.
- Registros sem `legacy_id`: `62`.
- Grupos duplicados no conjunto ativo atual da clinica: `0`.
- O mesmo banco contem outras clinicas, mas cada uma aparece isolada no seu proprio tenant; nao foi identificado retorno cruzado de outra clinica neste recorte.

## Composicao dos 62 sem legacy_id
- `59` sao biblioteca-base/seed local da clinica.
- `2` sao testes ativos da propria frente.
- `1` e copia/seed de simbolo oficial com `tipo_simbolo = 2`.
- Nenhum dos 62 foi confirmado como registro de outra clinica.

## Leitura tecnica do contrato
- `scope=catalogo` retorna apenas o subconjunto oficial carregado do snapshot legado.
- `scope=biblioteca` retorna todos os simbolos ativos da clinica autenticada.
- `scope=procedimentos` mistura catalogo oficial e simbolos pessoais conforme a regra do backend.
- `scope=genericos` segue outra regra de deduplicacao por codigo.
- Portanto, a discrepancia de 143 itens nao vem de vazamento entre tenants, e sim do contrato atual de `biblioteca`, que inclui toda a biblioteca local da clinica.

## Evidencias no codigo
- `frontend-react/src/features/simbolosGraficos/hooks/useSimbolosGraficosTableState.js`
- `backend/routes/cadastros_routes.py`
- `backend/services/simbolos_service.py`
- `backend/models/simbolo_grafico.py`

## Ajuste aplicado anteriormente
- A listagem da tabela passou a chamar `listSimbolosGraficos({ scope: 'biblioteca' })`.
- Esse modo retorna os simbolos ativos da clinica sem o filtro exclusivo do catalogo oficial.

## Conclusao operacional
- A correcao de `scope` resolve o sumico dos itens criados.
- A composicao atual da grade em `biblioteca` inclui catalogo oficial mais biblioteca-base/seed local da clinica e dois testes ativos, o que explica a contagem de 143.
- Nao ha indicio de quebra de isolamento entre clinicas na observacao feita nesta rodada.

## Testes executados
- `node --test frontend-react/tests/simbolosGraficosApi.test.js`
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js`
- `node --test frontend-react/tests/simbolosGraficosMapper.test.js`
- `npm.cmd run build`

## Observacao
- Esta rodada fechou a auditoria de composicao da grade no banco real. A confirmacao final de UX segue dependente da sessao autenticada que demonstra o fluxo completo de create, reload e F5.
