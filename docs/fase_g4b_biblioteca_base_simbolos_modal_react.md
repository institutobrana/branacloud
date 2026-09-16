# Fase G.4B - Biblioteca-base de simbolos no modal React

Data: 2026-08-04

## Fonte canonica
- arquivo estatico: [frontend-react/src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\simbolosGraficos\model\simboloGraficoEditorBaseLibrary.js)
- origem: constante `SIMBOLO_GRAFICO_EDITOR_BASE_LIBRARY`
- quantidade: 56 itens
- IDs: derivados do `code` sem extensao `.bmp`
- ordem: deterministica pela ordem declarada no array
- duplicados: nao ha duplicidade no manifesto
- tipo de imagem: BMP publicado em `/app/assets/Icones/`

## Estado mapeado
| Estado/campo | Origem | Uso atual | Uso correto |
|---|---|---|---|
| `bibliotecaSelecionadaId` | estado local do modal | seleciona a base ativa e destaca a celula | referencia da base escolhida, sem persistir a base em si |
| `bibliotecaSelecionada` | item selecionado da biblioteca | mantem o objeto local da base | referencia local do item base |
| `imagem_custom` | editor 15x15 / confirmacao do desenho | tem prioridade no preview e no submit | desenho persistido do usuario |
| `preview` | derivado de `imagem_custom` ou base selecionada | mostra o desenho ativo | mostrar `imagem_custom` > base > vazio |
| `matriz 15x15` | `SimboloGraficoPixelEditor` | estado de edicao da imagem | editor local, sem mutar a base |

## Contrato de selecao
- selecao unica na biblioteca;
- destaque visual da celula selecionada;
- preview atualiza ao selecionar uma base;
- a selecao nao dispara POST/PUT;
- a selecao nao fecha o modal;
- a selecao nao altera o item original.

## Contrato funcional
- base selecionada abre o editor com a imagem base como ponto de partida;
- o editor gera `imagem_custom` sem alterar o item original;
- cancelar descarta mudancas locais;
- salvar persiste o estado atual pelo POST ou PUT;
- reabrir em `Altera` usa o desenho persistido.

## G.4B.1
- o botao textual experimental `Limpar` foi removido;
- os contratos documentados de `X` e `Lápis` permaneceram inalterados;
- nenhum comportamento foi transferido para os demais controles;
- a cobertura de teste foi atualizada para refletir a ausencia do botao textual;
- o build continuou aprovado.

## G.4B.2
- o botao `X` passou a abrir confirmacao propria antes de remover o desenho local;
- a remocao fica restrita ao estado do modal e so persiste quando o usuario confirma em `Ok`;
- o botao `Lápis` continua abrindo o editor React 15x15 com a imagem atual prioritaria;
- o editor confirma PNG e atualiza `imagem_custom` sem usar Paint, iframe ou postMessage;
- o cancelamento da confirmacao preserva preview, biblioteca e matriz local;
- a cobertura de teste foi ajustada para o novo contrato e o build permaneceu aprovado.

## Testes
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js frontend-react/tests/simboloGraficoPixelEditorUtils.test.js`
- 25 testes aprovados
- nenhum skip

## Build
- `cmd /c npm.cmd run build`
- build aprovada
- warning conhecido de chunk grande permaneceu

## Runtime
- runtime direto nao foi concluido nesta rodada por bloqueio de autenticacao no preview local;
- o contrato ficou homologado tecnicamente por codigo, testes e build.

## Limitacoes
- nao retomar backfill;
- nao retomar apply;
- nao criar `scope=grade`;
- nao alterar backend nesta fase.

## Resultado
- G.4B concluida tecnicamente;
- G.4B.1 concluiu a remocao estrita do botao textual experimental `Limpar`;
- G.4B.2 concluiu a implementacao fiel do X e do Lápis no React;
- a proxima etapa funcional permanece em aberto ate a confirmacao correta do fluxo, sem avancar para G.5 por esta intervencao.
