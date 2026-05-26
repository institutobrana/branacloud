# Etiquetas - Contrato documental do proximo helper leve ou transformacao segura

Data: 25/05/2026

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

## Objetivo

Documentar o proximo helper leve ou transformacao segura no bloco de Etiquetas antes de qualquer implementacao futura, mantendo a abordagem conservadora da Fase 2.

## Contexto

Esta etapa vem apos a nova selecao documental de blocos leves depois da consolidacao de CID.

O bloco de Etiquetas foi o recomendado como proxima frente documental por combinar:

- helper passivo remanescente;
- fronteira clara;
- baixo risco;
- ganho arquitetural real sem reabrir frentes mais sensiveis.

Nota operacional: a auditoria posterior confirmou que os dois commits anteriores da selecao de CID existiram, foram enviados ao remoto e nao exigem correcao funcional agora. A entrega dividida em dois commits foi um detalhe operacional, nao um problema tecnico a corrigir nesta etapa.

## Classificacao do modulo

Etiquetas deve ser tratado como modulo comum/core administrativo/transversal.

Essa classificacao serve apenas para documentacao e orientacao futura. Ela nao altera permissao, tenant, backend ou qualquer controle multi-area.

## Estado atual conhecido de Etiquetas

O codigo relacionado a Etiquetas esta concentrado em:

- `frontend/app.js`
- `frontend/js/modules/etiquetas.js`

No estado atual:

- existe modulo passivo em `frontend/js/modules/etiquetas.js`;
- o namespace `window.BranaEtiquetasModule` ja esta exposto;
- o fluxo principal ainda passa por `frontend/app.js`;
- ha listagem de modelos;
- ha configuracao de padroes/modelos;
- ha aplicacao de padrao selecionado;
- ha preview;
- ha modal de edicao/criacao;
- ha `requestJson`;
- ha payload e salvamento;
- ha exclusao;
- ha dependencia de backend/endpoints;
- ha relacao operacional com outros modulos no teste de regressao, especialmente `Plano de Contas`, `CID` e `Medicamentos`.

Helpers passivos atualmente expostos pelo modulo:

- `normalizeNumber`
- `formatNumber`
- `layoutFromItem`

## Mapa funcional do fluxo atual

Fluxo atual em alto nivel:

1. Carregamento dos padroes e modelos.
2. Ordenacao e deduplicacao da lista de arquivos/modelos.
3. Resolucao do arquivo padrao a partir do padrao selecionado.
4. Abertura do modal para novo modelo ou edicao.
5. Aplicacao de padrao.
6. Atualizacao de preview.
7. Salvamento via `requestJson`.
8. Exclusao do modelo selecionado.

Funcoes principais ainda mantidas em `frontend/app.js`:

- `etqNumero`
- `etqFormatNumero`
- `etqArquivosOrdenados`
- `etqResolverArquivoPadrao`
- `etqLayoutFromItem`
- `etqRender`
- `etqRenderCombos`
- `etqAplicarPadraoSelecionado`
- `etqSyncPreview`
- `etqAbrirModal`
- `etqSalvarModal`
- `etqExcluirSelecionado`
- `etqCarregarDados`
- `etqEnsureUI`
- `etqAbrir`

## Partes proibidas para futura implementacao imediata

Uma futura implementacao nao deve tocar em:

- DOM;
- renderizacao;
- preview;
- modal;
- selecao visual;
- eventos;
- `requestJson`;
- payload efetivo;
- salvamento;
- backend;
- banco;
- endpoints;
- permissoes;
- textos visiveis;
- mojibake.

## Candidatos de recorte avaliados

### 1. `etqArquivosOrdenados(lista)`

Responsabilidade:

- ordenar e deduplicar a lista de arquivos/modelos de Etiquetas.

Entradas:

- lista de arquivos/modelos em memoria.

Saidas:

- lista ordenada e sem duplicidade por chave de nome, preservando a prioridade atual de clinica quando houver conflito.

Dependencias:

- comparacao textual local;
- regras atuais de ordenacao;
- regra local de deduplicacao.

Nao toca em:

- DOM;
- preview;
- modal;
- `requestJson`;
- payload;
- salvamento;
- backend/banco.

Risco:

- baixo.

Ganho esperado:

- reducao real, ainda que pequena, de `frontend/app.js`;
- delegacao arquitetural segura;
- reutilizacao em `etqRenderCombos()` e `etqResolverArquivoPadrao()`.

Facilidade de teste manual:

- alta.

### 2. `etqResolverArquivoPadrao(padraoId, arquivos)`

Responsabilidade:

- resolver o arquivo padrao correspondente ao padrao selecionado a partir da lista disponivel.

Entradas:

- id do padrao;
- lista de arquivos/modelos.

Saidas:

- item de arquivo padrao encontrado ou primeiro item disponivel.

Dependencias:

- mapeamento local de padroes;
- lista ordenada de arquivos.

Nao toca em:

- DOM;
- preview;
- modal;
- `requestJson`;
- payload;
- salvamento;
- backend/banco.

Risco:

- baixo/medio, por depender de um segundo passo de resolucao sobre a lista.

Ganho esperado:

- reducao pequena, mas real, de logica repetida em `frontend/app.js`.

Facilidade de teste manual:

- media/alta.

### 3. `layoutFromItem(item)` como baseline ja consolidado

Responsabilidade:

- calcular o layout de impressao a partir do item recebido.

Estado:

- ja existe no modulo e ja funciona como helper passivo.

Conclusao:

- nao e o proximo alvo desta etapa; serve como baseline de helper seguro ja consolidado.

## Comparacao dos candidatos

- `etqArquivosOrdenados(lista)` e o candidato mais seguro, porque e pura transformacao de lista e pode ser delegada sem alterar comportamento visual, modal ou persistencia.
- `etqResolverArquivoPadrao(padraoId, arquivos)` tambem e viavel, mas e um pouco mais acoplado a mapeamento e ordem da lista.
- `layoutFromItem(item)` ja esta consolidado e nao precisa ser retomado agora.

## Candidato recomendado

Recomendacao: `etqArquivosOrdenados(lista)`

### Contrato funcional proposto

Assinatura conceitual:

```text
etqArquivosOrdenados(lista)
```

O helper deve:

- receber uma lista de arquivos/modelos;
- devolver a lista ordenada;
- remover duplicidades pela chave textual usada hoje;
- preservar a prioridade atual quando houver conflito entre itens semelhantes;
- manter o comportamento equivalente ao atual de `frontend/app.js`.

O helper nao deve:

- tocar em DOM;
- tocar em preview;
- tocar em modal;
- tocar em eventos;
- tocar em `requestJson`;
- tocar em payload;
- tocar em salvamento;
- tocar em backend/banco/endpoints/permissoes;
- alterar texto visivel;
- corrigir mojibake.

### Funcoes de `frontend/app.js` que poderiam delegar

- `etqRenderCombos()`
- `etqResolverArquivoPadrao()`

## Limites da futura implementacao

A futura implementacao, se aprovada depois, precisa ser pequena e passiva. Ela nao pode alterar comportamento visual, salvar dados de forma diferente, mudar a ordem efetiva de apresentacao nem introduzir qualquer dependencia nova de backend.

## Riscos remanescentes

- `frontend/app.js` ainda concentra o fluxo principal de Etiquetas.
- preview e modal continuam no fluxo principal.
- futuras alteracoes em ordenacao podem afetar a selecao do arquivo padrao se a regra nao for preservada exatamente.
- o bloco ainda depende de `requestJson` e salvamento no fluxo principal.

## Onde testar futuramente

Se houver implementacao futura, o teste manual obrigatorio deve ser em:

`Etiquetas / Configuracao de modelos de etiqueta`

Teste futuro provavel:

- abrir a tela de Etiquetas / Configuracao de modelos de etiqueta;
- validar abertura da tela;
- validar listagem;
- validar aplicacao de padroes;
- validar comportamento do preview;
- validar modal, se houver no fluxo atual;
- confirmar console limpo;
- fazer regressao rapida em `Plano de Contas`, `CID` e `Medicamentos`;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de nao alteracao de codigo

Nenhuma alteracao de codigo foi feita nesta etapa. Esta etapa foi exclusivamente documental.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel foi corrigido.

## Commit seletivo obrigatorio

O commit desta etapa deve incluir somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_etiquetas_contrato_helper_leve_seguro.md`

## Registro para roadmap

Esta etapa registra a selecao de `Etiquetas` como proxima frente documental, mantendo o bloco como modulo comum/core administrativo/transversal e apontando `etqArquivosOrdenados(lista)` como helper mais seguro para futura implementacao minima.
