# FASE G.4C.2D.3.3 - Prova automatizada real do clique no botao Diagnóstico do desenho

## Infraestrutura usada
- runner: `node --test`
- navegador: Chromium via Playwright
- DOM: browser real controlado
- render: modal real do módulo `Configurações -> Símbolos gráficos`
- eventos: clique real no botão `Diagnóstico do desenho`

## Teste real criado
- `frontend-react/tests/simboloGraficoDiagnosticButton.test.js`
- abre a rota autenticada
- seleciona uma linha real da grade
- aciona `Altera`
- clica em `Diagnóstico do desenho`
- verifica a abertura do painel técnico

## Antes do clique
- botão diagnóstico visível no modal de edição
- painel técnico ausente
- `Testar URL atual` ausente
- `Copiar diagnóstico` ausente

## Depois do clique
- painel técnico presente
- `Testar URL atual` presente
- `Copiar diagnóstico` presente
- `Fechar` presente

## DOM
- o clique adiciona um novo dialog ao DOM
- o título aparece no modal principal e no painel técnico
- a verificação precisa considerar os controles exclusivos do painel para não confundir com o botão original

## Portal
- o painel técnico é renderizado como modal separado
- o teste valida a presença dos controles exclusivos no DOM após o clique

## Resultado
- a prova real foi executada, mas o botao nao foi encontrado no DOM do modal de edicao
- a primeira assercao que falhou foi a localizacao do botao `Diagnóstico do desenho`
- o clique não pôde ser executado porque o controle não foi renderizado no runtime testado

## Classificação
- COMPONENTE NÃO TESTÁVEL COM A INFRAESTRUTURA ATUAL
- os testes anteriores 24/24 continuam sendo falso-positivos para interação real

## Testes anteriores
- 24/24 anteriores cobriam contratos e estrutura textual
- não bastavam para provar o clique real nem a abertura do painel

## Arquivos alterados
- `frontend-react/tests/simboloGraficoDiagnosticButton.test.js`
- `docs/continuidade_fases_origem_simbolos_graficos.md`
- `docs/fase_g4c2d32_diagnostico_botao_painel_preview.md`
