# Cadastros auxiliares - Contrato documental do proximo helper leve ou transformacao segura

Data: 25/05/2026

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

## Objetivo

Documentar o proximo helper leve ou transformacao segura em Cadastros auxiliares antes de qualquer implementacao futura, mantendo a abordagem conservadora da Fase 2.

## Contexto

Esta etapa vem apos a consolidacao de Etiquetas.

Cadastros auxiliares foi o bloco mais seguro identificado na nova selecao documental depois de Etiquetas, por ainda oferecer helpers puros e fronteira clara.

## Frentes pausadas/consolidadas

As frentes abaixo permanecem pausadas/consolidadas e nao devem ser reabertas sem justificativa forte:

- Agenda de contatos
- Agenda principal
- Prestadores
- Preferencias / Configuracoes comuns
- Plano de Contas
- CID
- Etiquetas

## Classificacao do modulo

Cadastros auxiliares deve ser tratado como modulo comum/core administrativo/transversal.

Essa classificacao serve apenas para documentacao e orientacao futura. Ela nao altera permissao, tenant, backend ou controle multi-area.

## Estado atual conhecido de Cadastros auxiliares

O codigo relacionado a Cadastros auxiliares esta concentrado em:

- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`

No estado atual:

- existe modulo passivo em `frontend/js/modules/auxiliares.js`;
- o namespace `window.BranaAuxiliaresModule` ja esta exposto;
- o fluxo principal ainda passa por `frontend/app.js`;
- ha listagem de tipos e itens;
- ha dialogo/modal para item;
- ha aplicacao de regras por tipo;
- ha `requestJson`;
- ha payload e salvamento;
- ha exclusao;
- ha dependencia de backend/endpoints;
- ha relacao operacional com `planoEnsureUI` e `cadModal` no scaffold compartilhado.

Helpers passivos atualmente expostos pelo modulo:

- `auxTipoEh`
- `auxNormalizarHexCor`
- `auxCorrigirMojibake`
- `auxCorApresentacaoNormLabelKey`
- `auxCorApresentacaoHexPorLabel`
- `auxCorApresentacaoCorLabel`
- `auxCorApresentacaoOpcoesHtml`

## Mapa funcional do fluxo atual

Fluxo atual em alto nivel:

1. Carregamento dos tipos.
2. Carregamento dos itens por tipo.
3. Selecao de tipo e item.
4. Abertura do dialogo para inclusao ou edicao.
5. Aplicacao de regras especificas por tipo.
6. Montagem de payload para salvar.
7. Salvamento via `requestJson`.
8. Exclusao de item.

Funcoes principais ainda mantidas em `frontend/app.js`:

- `auxTipoEh`
- `auxNormalizarHexCor`
- `auxCorrigirMojibake`
- `auxCorApresentacaoFonteSistema`
- `auxCorApresentacaoNormLabelKey`
- `auxCorApresentacaoHexPorLabel`
- `auxCorApresentacaoOpcoesHtml`
- `auxCorApresentacaoCorLabel`
- `auxCorApresentacaoGarantirEstiloCombo`
- `auxCorApresentacaoFecharListas`
- `auxCorApresentacaoMontarCombo`
- `auxAbrir`
- `auxCarregarTipos`
- `auxCarregarItens`
- `auxDialogItem`
- `auxExcluirItem`
- `auxAtualizarTotal`

## Partes proibidas para futura implementacao imediata

Uma futura implementacao nao deve tocar em:

- DOM;
- renderizacao;
- modal;
- selecao visual;
- eventos;
- preview;
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

### 1. `auxNormalizarHexCor(value)`

Responsabilidade:

- normalizar valor de cor em hexadecimal seguro e consistente.

Entradas:

- valor bruto de cor.

Saidas:

- hex normalizado ou string vazia.

Dependencias:

- nenhuma dependencia externa;
- apenas processamento de texto local.

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
- reutilizacao em varios pontos das rotinas de cor.

Facilidade de teste manual:

- alta.

### 2. `auxCorApresentacaoNormLabelKey(texto)`

Responsabilidade:

- normalizar rotulo de cor para comparacao textual.

Risco:

- baixo.

Ganho esperado:

- medio/baixo, por ser um helper de apoio mais localizado.

Facilidade de teste manual:

- media.

### 3. `auxCorApresentacaoOpcoesHtml(corAtual)`

Responsabilidade:

- gerar o HTML das opcoes de cores de apresentacao.

Risco:

- baixo/medio, por gerar HTML usado no dialogo.

Ganho esperado:

- medio, mas com maior proximidade do fluxo visual do que o candidato principal.

Facilidade de teste manual:

- media/alta.

### 4. `auxTipoEh(tipo, chave)`

Responsabilidade:

- classificar tipos auxiliares por chave sem depender de DOM.

Risco:

- baixo.

Ganho esperado:

- pequeno, porem seguro.

Facilidade de teste manual:

- alta.

## Comparacao dos candidatos

- `auxNormalizarHexCor(value)` e o candidato mais seguro, porque e puro, simples e reaproveitado por outros helpers de cor.
- `auxCorApresentacaoNormLabelKey(texto)` tambem e seguro, mas traz ganho menor e depende de uma camada de apoio mais especifica.
- `auxCorApresentacaoOpcoesHtml(corAtual)` traz ganho maior de reducao em `app.js`, mas fica mais perto do fluxo visual.
- `auxTipoEh(tipo, chave)` e seguro, mas com ganho menor do que o helper de cor.

## Candidato recomendado

Recomendacao: `auxNormalizarHexCor(value)`

### Contrato funcional proposto

Assinatura conceitual:

```text
auxNormalizarHexCor(value)
```

O helper deve:

- receber um valor bruto de cor;
- retornar a cor normalizada em hexadecimal seguro ou string vazia;
- manter a mesma regra atual usada em `frontend/app.js`;
- ser puro e passivo;
- manter fallback local equivalente em `frontend/app.js`.

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

- `auxNormalizarHexCor`
- `auxCorApresentacaoOpcoesHtml`
- `auxCorApresentacaoCorLabel`
- `auxCorApresentacaoHexPorLabel`

## Limites da futura implementacao

A futura implementacao, se aprovada depois, precisa ser pequena e passiva. Ela nao pode alterar comportamento visual, salvar dados de forma diferente, mudar a regra de validacao de cor nem introduzir qualquer dependencia nova de backend.

## Riscos remanescentes

- `frontend/app.js` ainda concentra o fluxo principal de Cadastros auxiliares.
- Modal e scaffold compartilhado continuam no fluxo central.
- Futuras alteracoes em normalizacao de cor podem afetar o que aparece no combo ou no preview se a regra nao for preservada exatamente.
- O bloco ainda depende de `requestJson` e salvamento no fluxo principal.

## Onde testar futuramente

Se houver implementacao futura, o teste manual obrigatorio deve ser em:

`Cadastros auxiliares / Tabelas auxiliares`

Teste futuro provavel:

- abrir a tela de Cadastros auxiliares;
- validar listagem de tipos e itens;
- validar abertura do dialogo;
- validar cor/apresentacao quando aplicavel;
- confirmar console limpo;
- fazer regressao rapida em `Etiquetas`, `Plano de Contas`, `CID` e `Medicamentos`;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa e exclusivamente documental. Nenhuma alteracao de codigo foi feita.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel foi corrigido.

## Commit seletivo obrigatorio

O commit desta etapa deve incluir somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_auxiliares_contrato_helper_leve_seguro.md`

## Registro para roadmap

Esta etapa registra a selecao de Cadastros auxiliares como a proxima frente documental, mantendo o modulo como comum/core administrativo/transversal e apontando `auxNormalizarHexCor(value)` como helper mais seguro para uma futura implementacao minima.
