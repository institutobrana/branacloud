# Fase G.3C - Elimina simbolo grafico React

Data: 2026-08-04

## Objetivo
Implementar exclusivamente o fluxo funcional do botao `Elimina` em `Configuracoes -> Simbolos graficos`.

## Contrato do endpoint
- metodo: `DELETE`
- URL: `/cadastros/simbolos-graficos/{id}`
- autenticacao: obrigatoria via `Bearer token`
- isolamento: por `clinica_id` no backend
- sucesso: `200` com resposta textual normalizada
- nao encontrado: `404`
- bloqueio por regra/protecao: `409`
- exclusao fisica: sim, via `db.delete(item)`

## Regras observadas
- somente um registro por vez;
- a confirmacao identifica o nome/codigo do simbolo selecionado;
- o cancelamento nao chama API;
- o `Elimina` fica desabilitado durante o envio;
- o modal nao fecha antes da resposta;
- em `404`, a grade e recarregada e a selecao obsoleta e limpa;
- em `409`, a confirmacao permanece aberta e a mensagem do backend e exibida;
- em sucesso, a grade e recarregada e a selecao e limpa;
- origem nao e alterada nem apagada pelo frontend.

## Implementacao
- `frontend-react/src/features/simbolosGraficos/simbolosGraficosApi.js`
- `frontend-react/src/features/simbolosGraficos/hooks/useDeleteSimboloGrafico.js`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoDeleteModal.jsx`
- `frontend-react/src/features/simbolosGraficos/SimbolosGraficosPage.jsx`
- `frontend-react/src/app/App.jsx`

## Testes
- `node --test frontend-react/tests/simbolosGraficosApi.test.js frontend-react/tests/simboloGraficoCreateModal.test.js`

## Build
- `npm.cmd run build`
- resultado: aprovado
- warnings: apenas aviso de chunk grande do Vite

## Runtime
- nao validado nesta rodada
- Novo e Altera permanecem intactos por contrato tecnico

## Limitações
- nao implementa exclusao em massa;
- nao altera backend;
- nao toca na trilha de backfill, apply ou origem;
- nao faz inferencia por nome, indice ou descricao sem ID selecionado.
