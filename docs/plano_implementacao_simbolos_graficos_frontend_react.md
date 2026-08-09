# Plano de Implementação - Símbolos Gráficos - Frontend React

## Objetivo
Registrar o caminho de implementação que levou à frente concluída de símbolos gráficos no frontend React, mantendo o histórico técnico da execução.

## Estado final da frente
- A tela React foi implementada e homologada.
- A listagem, a seleção, o modal de criação, o modal de alteração e a exclusão estão funcionais.
- O editor gráfico final está integrado ao fluxo.
- O consumo da listagem usa o endpoint aprovado e o mapeamento de leitura correspondente.

## Componentes consolidados
- `frontend-react/src/features/simbolosGraficos/SimbolosGraficosPage.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimbolosGraficosToolbar.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimbolosGraficosTable.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoDeleteModal.jsx`
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoPixelEditor.jsx`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoPixelEditorUtils.js`

## Implementação concluída
- Shell da página com rotas e layout do módulo.
- Toolbar com `Novo`, `Altera` e `Elimina`.
- Tabela com `Nome` e `Especialidade`.
- Seleção visual de linha única.
- Modal de criação com biblioteca, editor e previews.
- Modal de alteração com hidratação do símbolo selecionado.
- Modal de exclusão com confirmação e cancelamento seguros.
- Editor gráfico 24x24 com 576 células.
- Ferramentas `Lápis`, `Borracha`, `Desfazer` e `Limpar`.
- Paleta de 44 cores.
- Previews `Prévia 1x` e `Prévia ampliada`.
- Botões `Recarregar`, `Salvar como` e `Cancela`.
- Fluxo de persistência via `Salvar como` -> modal pai -> `Ok`.

## Regras que ficaram consolidadas
- A biblioteca não substitui o desenho durante a edição.
- O editor preserva o desenho original até a confirmação do modal pai.
- `Recarregar` apenas restaura `initialImage`.
- `Salvar como` apenas entrega PNG/data URL ao modal pai.
- `Ok` do modal pai é a persistência real.
- `Cancela` descarta o estado temporário.
- `Elimina` respeita bloqueios do backend.

## Validação concluída
- Testes frontend da frente aprovados.
- Build frontend aprovado.
- Runtime validado no navegador.
- Stage permaneceu vazio.

## Itens superados pelo estado final
- A fase puramente estrutural ficou superada.
- A lacuna de modal, preview e editor gráfico foi encerrada.
- A tela deixou de ser apenas contrato e passou a estado funcional final.

## Fontes base
- `docs/auditoria_simbolos_graficos_brana_cloud.md`
- `docs/contrato_funcional_simbolos_graficos_frontend_react.md`
- `docs/contrato_funcional_modal_novo_simbolo_grafico_react.md`
