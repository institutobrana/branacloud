# Comparativo - Simbolos Graficos - EasyDental vs Brana Cloud

## Objetivo
Comparar o que o EasyDental Desktop mostra ou sugere sobre o modulo com o que o Brana Cloud ja implementa hoje.

## Comparativo resumido

| Dimensao | EasyDental Desktop | Brana Cloud | Status |
|---|---|---|---|
| Menu | `Configuracoes > Simbolos graficos` | menu legado em `frontend/index.html` | presente nos dois |
| Listagem | catalogo de simbolos com BMP e especialidade | endpoint + frontend legado | presente nos dois |
| Edição de desenho | editor pixelado / BMP / preview | mock local existe, mas nao ha tela React | legado preservado |
| Catálogo oficial | fonte `_SIMBOLO_ODONTO.raw` | seed baseado no snapshot do EasyDental | alinhado |
| Especialidade | integrado ao catalogo e a assets `esp_*.bmp` | campo no model, payload e filtros | alinhado |
| Odontograma | forte integracao com intervencoes e imagens | consumidores em procedimentos e odontograma | alinhado |
| React novo | nao aplicavel | ainda nao implementado para este modulo | lacuna |

## Pontos em comum comprovados
- Catalogo oficial baseado em BMPs.
- Relacao com especialidade.
- Relacao com odontograma e intervencoes.
- Regra de simbolos de sistema versus simbolos de usuario.
- Uso de preview/imagem.

## Diferencas comprovadas
- EasyDental Desktop:
  - a tela original aparenta ser um editor grafico de pixel/BMP com preview visual.
  - a navegacao, handlers e querys nao puderam ser inspecionados integralmente sem o fonte Delphi.
- Brana Cloud:
  - a implementacao atual esta em backend + frontend legado.
  - o React ainda nao tem pagina oficial do modulo.
  - a logica de dados esta consolidada na API e no seed.

## Diferencas provaveis, mas ainda nao comprovadas
- O Desktop provavelmente permitia edicao visual direta do BMP.
- O Desktop provavelmente tinha previas e selecao de desenho por controle grafico.
- O Brana Cloud hoje depende mais da camada de dados do que de um editor nativo completo.

## Consequencias para a futura tela React
- A tela React deve preservar:
  - tabela compacta
  - nome + especialidade
  - acoes Novo, Altera, Elimina e Fecha
  - preview e, se houver editor, separacao em componente proprio
- A tela React nao deve assumir que o editor grafico original seja simplificado sem contrato.

## Lacunas
- Nao foi possivel confirmar todos os handlers, queries e atalhos do EasyDental.
- Nao foi possivel medir comportamento exato de exclusao, renomeacao e duplicidade no Desktop.
- Nao foi possivel extrair 100% da tela original por ausencia do fonte Delphi nesta varredura.

## Fontes lidas
- `docs/auditoria_simbolos_graficos_brana_cloud.md`
- `docs/auditoria_simbolos_graficos_easydental.md`
- `frontend/index.html`
- `frontend/app.js`
- `frontend/mock_simbolo_editor.html`
- `backend/routes/cadastros_routes.py`
- `backend/services/simbolos_service.py`
