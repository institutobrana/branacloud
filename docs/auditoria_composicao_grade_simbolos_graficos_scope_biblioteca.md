# Auditoria da composicao da grade de simbolos graficos com `scope=biblioteca`

Data: 2026-08-03

## Objetivo
- Entender por que a listagem de `Configurações -> Símbolos gráficos` passou a exibir 143 registros quando a tela foi ajustada para `scope=biblioteca`.
- Verificar se existe vazamento entre clinicas.
- Classificar a composicao da grade entre catalogo oficial, biblioteca local e registros sem `legacy_id`.

## Escopo da auditoria
- Nao criar novos simbolos.
- Nao executar POST.
- Nao alterar codigo.
- Apenas ler backend, banco e runtime observavel.

## Hipoteses avaliadas
1. A grade estava vazia por usar `scope=catalogo`.
2. `scope=biblioteca` retornava registros de outra clinica.
3. A grade continha mistura de catalogo oficial, biblioteca local e registros de teste da propria clinica.

## Resultado da medicao
- Clinica observada: `clinica_id = 1`.
- Total de simbolos ativos retornados por `scope=biblioteca`: `143`.
- Registros com `legacy_id`: `81`.
- Registros sem `legacy_id`: `62`.
- Duplicidade ativa no recorte medido: `0`.

## Classificacao funcional
- `legacy_id != null`: simbolos oriundos do catalogo oficial replicado para a clinica.
- `legacy_id == null`: simbolos locais da clinica, incluindo biblioteca-base, seeds auxiliares e registros de teste.
- O conjunto observado nao mostrou duplicacao de chave natural no estado ativo atual.

## Composicao dos 62 sem legacy_id
- `59` sao biblioteca-base/seed local da propria clinica.
- `2` sao registros de teste ativos.
- `1` e uma copia/seed de simbolo oficial com `tipo_simbolo = 2`.
- Nenhum dos 62 foi identificado como cadastro legitimo de usuario independente do seed.

## Comparacao de contratos
- `scope=catalogo`: subset oficial, filtrado pelo snapshot legado.
- `scope=biblioteca`: retorna todos os simbolos ativos da clinica autenticada.
- `scope=procedimentos`: mistura regras de oficial + pessoal conforme o backend.
- `scope=genericos`: aplica outra regra de selecao e deduplicacao por codigo.

## Leitura do backend
- O backend continua impondo tenant por `current_user.clinica_id`.
- A resposta de `scope=biblioteca` nao ultrapassou o tenant observado.
- Nao foi encontrado indicio de outra clinica dentro do recorte validado.

## Conclusao
- O numero 143 nao indica vazamento entre clinicas.
- Ele reflete a composicao real da biblioteca local da clinica, somando oficiais replicados, biblioteca-base local, seeds auxiliares e testes ainda ativos.
- Para a necessidade funcional da tela, `scope=biblioteca` deve permanecer, porque e o contrato aprovado da grade.

## Evidencias consultadas
- `backend/routes/cadastros_routes.py`
- `backend/services/simbolos_service.py`
- `backend/models/simbolo_grafico.py`
- `frontend-react/src/features/simbolosGraficos/hooks/useSimbolosGraficosTableState.js`
- `frontend-react/src/features/simbolosGraficos/simbolosGraficosApi.js`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoLibrary.jsx`
- `frontend-react/src/features/simbolosGraficos/SimbolosGraficosPage.jsx`
- `frontend/app.js`
- `docs/diagnostico_post_reload_lista_simbolos_graficos.md`
- `docs/homologacao_runtime_post_basico_simbolo_grafico.md`
- `docs/verificacao_funcional_143_simbolos_grade.md`

## Observacao de seguranca
- Se a mesma medicao em outra sessao mostrar registros de outra clinica, isso deve ser tratado como incidente critico.
- Nesta rodada, isso nao foi observado.
