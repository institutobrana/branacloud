# Prestadores - Subetapa 1 - Fronteiras e contrato do helper `prestSelecionado`

## Objetivo
Definir, apenas por leitura e documentação, as fronteiras funcionais do helper `prestSelecionado`, confirmar suas dependencias reais e decidir se ele pode ser promovido com seguranca para uma extracao minima futura.

## Contexto
A frente `Prestadores` permanece tratada como aproximadamente `core / comum` administrativa/transversal. A Subetapa 0 consolidou o mapeamento tecnico complementar e confirmou que o modulo passivo existe, mas a maior parte do fluxo restante ainda vive em `frontend/app.js`.

As frentes `Agenda principal`, `Agenda de contatos` e `Preferencias / Configuracoes comuns` continuam pausadas/consolidadas e nao entram nesta decisao.

## Estado atual de Prestadores
- Arquivo de modulo: `frontend/js/modules/prestadores.js`.
- Namespace global: `window.BranaPrestadoresModule`.
- O modulo permanece passivo e carregado antes de `frontend/app.js`.
- O modulo ja expõe `prestFmtCodigo` e `prestStatusHtml`.
- O modulo nao deve receber DOM, `requestJson`, payload, salvamento ou permissões nesta etapa.
- O bloco de `Prestadores` ainda concentra a maior parte do fluxo visual, de selecao e de carregamento em `frontend/app.js`.

## Contrato funcional de `prestSelecionado`
### Assinatura atual
Em `frontend/app.js`, a funcao atual e:

```js
function prestSelecionado(){return prestadoresCache.find(item=>Number(item.id||0)===Number(prestadorSelId))||null}
```

### Entrada e dependencias
- Le `prestadoresCache`.
- Le `prestadorSelId`.
- Nao recebe parametros hoje.
- Nao usa DOM.
- Nao usa `requestJson`.
- Nao monta payload.
- Nao faz salvamento.
- Nao faz exclusao.
- Nao usa permissões.
- Nao usa `tenant`, `clinica` ou `user_id`.
- Nao altera a grade nem o fluxo visual por conta propria.

### Saida esperada
- Retorna o item selecionado do cache quando encontra correspondencia por `id`.
- Retorna `null` quando nao ha selecao, quando o cache esta vazio, ou quando o `prestadorSelId` nao corresponde a nenhum item.

### Comportamento funcional observado
- O helper e usado como leitura de contexto para o texto de apoio do rodape em `prestAcoesPlaceholder`.
- Nao e chamado pelo carregamento, pela filtragem nem pela renderizacao principal da grade.
- A grade continua sendo controlada por `prestRender()` e `prestSelecionarLinha()`.

### Invariantes que nao podem mudar
- O helper nao deve disparar efeitos colaterais.
- O retorno continua sendo um item do cache ou `null`.
- A selecao invalida nao pode gerar erro.
- Cache vazio nao pode gerar excecao.
- O comportamento de `prestAcoesPlaceholder` deve permanecer identico no caso de item encontrado ou ausente.

## Chamadores identificados
- `prestAcoesPlaceholder(rotulo)` e o chamador direto encontrado em `frontend/app.js`.
- A selecao visual e atualizada por `prestSelecionarLinha(tr)`, mas essa funcao nao chama `prestSelecionado` diretamente.
- `prestRender()` usa `prestadorSelId` para destacar a linha, mas nao depende do helper para montar a tabela.

## Recomendacao tecnica
O helper e pequeno o suficiente para uma futura extracao minima, mas ainda depende de estado global de selecao e cache. Para virar helper seguro de modulo, a forma mais conservadora seria transforma-lo em uma funcao pura que receba explicitamente:

- `cache`
- `selId`

Modelo futuro recomendado:

```js
prestSelecionado(cache, selId)
```

Com isso, o modulo passivo poderia devolver o item selecionado sem ler estado externo, e `frontend/app.js` poderia preservar um wrapper/fallback local equivalente que passa os valores atuais de `prestadoresCache` e `prestadorSelId`.

## Riscos
- Risco por dependencia de estado global de selecao.
- Risco por acoplamento com o resumo contextual do rodape.
- Risco baixo-medio de regressao se a assinatura mudar sem ajuste sincronizado do wrapper local.
- Risco de confundir helper de leitura com fluxo de selecao visual.

## Decisao documental
`prestSelecionado` e o unico candidato ainda plausivel como proxima extracao pequena em Prestadores, mas a recomendacao e fazer uma subetapa futura apenas se a assinatura for tornada explicita com parametros. Sem isso, a funcao deve permanecer local no `app.js`.

## Escopo futuro, se houver implementacao
- Mover ou expor `prestSelecionado(cache, selId)` em `frontend/js/modules/prestadores.js`.
- Manter `frontend/app.js` com wrapper/fallback local equivalente.
- Preservar o contrato de retorno `item|null`.
- Nao alterar o restante do bloco de Prestadores.

## O que nao deve ser alterado agora
- DOM e renderizacao da grade.
- `requestJson`.
- payload.
- salvamento.
- exclusao.
- permissões.
- `tenant`, `clinica`, `user_id`.
- `frontend/index.html`.
- backend, banco, schema, migrations e seeds.

## Proxima subetapa recomendada
`Prestadores - Subetapa 2 - Implementacao minima do helper `prestSelecionado` com contrato explicito de cache e selecao, ou confirmacao documental de pausa caso o custo de integracao seja considerado alto demais.`

## Blindagem textual/mojibake
Nesta etapa nenhuma string visivel foi corrigida. Caso exista texto quebrado ou mojibake em documentos ou no bloco legado, ele deve permanecer apenas como pendencia futura documental, sem correcao nesta rodada.
