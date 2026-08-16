# Checkpoint funcional - Conta corrente do cirurgiao

## Identificacao
- Modulo: Financeiro -> Conta corrente do cirurgiao
- Rota principal: `/app/financeiro/conta-corrente-cirurgiao`
- Feature React: `frontend-react/src/features/contaCorrenteCirurgiao/`
- Referencia EasyDental: conta corrente do cirurgiao e seu fluxo de relatorio/preview
- Branch: `modularizacao-segura-fase-1`
- Checkpoint anterior de datas: `3b95102d845b29c9c58bf7fc19d82c88a181c19e`
- Tag anterior: `checkpoint/campos-data-brana-v1`

## Estado homologado

### Tela principal
- Toolbar global da conta corrente do cirurgiao presente.
- Filtros principais presentes.
- Tabela principal com `Data`, `Lancamento`, `Historico`, `Debito` e `Credito`.
- Selecao de linhas presente.
- Totais do mes presentes: entradas, despesas e saldo.

### Insere lancamento
- Fluxo de `Novo debito` e `Novo credito` preservado.
- Tabs de debito e credito preservadas.
- Campos de data com contrato aprovado de edicao e consolidacao de entrada.
- DatePicker AntD mantido.
- Formato `DD/MM/YYYY` mantido.
- Comportamento de foco, selecao integral, entrada curta e consolidacao por `Tab` mantido.
- Hidracao de edicao via `dayjs` mantida.

### Pesquisa fluxo de caixa
- Abas presentes: `Critérios gerais`, `Critérios adicionais` e `Opções de relatório`.
- Selecao e organizacao das opcoes de relatorio presentes.
- Estado de relatorio conectado ao preview.

### Preferencias
- Persistencia por usuario do bloco de opcoes de relatorio presente.
- `reportName`, `output` e `orientation` mantidos.
- Default aprovado de orientacao: `Retrato`.
- Alternancia `Retrato` <-> `Paisagem` preservada.

### Saida Tela
- Preview presente com `Filtra`, `Imprime`, `Fecha`, `Pagina` e `Zoom`.
- Orientacoes `Retrato` e `Paisagem` preservadas.
- Paginação atual homologada pelo usuario.

### Saida Arquivo
- Exportacao em `CSV`, `PDF` e `Excel` preservada no modulo.

### Saida Imprimir
- Janela isolada de impressao preservada.
- Orientacao enviada para a impressao preservada.

### Paginacao
- Estado atual homologado pelo usuario e estabilizado como checkpoint funcional desta frente.
- Historico de diagnósticos anteriores separado do estado atual aprovado.

### Regressões historicas que nao podem voltar
- Tela branca por `useRef` ausente.
- React #185 / ciclo `useLayoutEffect`.
- Tela branca em `Opções de relatório`.
- Loading/paginacao em diagnosticos anteriores.

## Checkpoint anterior
- Commit: `3b95102d845b29c9c58bf7fc19d82c88a181c19e`
- Tag: `checkpoint/campos-data-brana-v1`

## Proximo passo
- Aguardar orientacao do usuario para a proxima correcao do modulo.
