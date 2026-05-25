# CID - Contrato documental do proximo helper leve ou transformacao segura

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Documentar, de forma conservadora, qual pode ser o proximo helper leve ou transformacao segura do bloco `CID`, sem alterar codigo, sem criar modulo novo e sem mexer no fluxo funcional atual.

## Contexto

Esta etapa sucede a selecao documental de blocos leves apos a consolidacao do Plano de Contas.

- O Plano de Contas ficou pausado/consolidado por ora.
- `CID` foi identificado como o bloco leve mais promissor entre os candidatos remanescentes.
- A recomendacao anterior foi criar um contrato documental para `CID` antes de qualquer implementacao.

## Classificacao do modulo

`CID` deve ser tratado como modulo especifico de area profissional.

Essa classificacao e apenas documental e de orientacao futura. Ela nao altera permissões, tenant, backend ou qualquer controle multi-area.

## Estado atual conhecido de CID

O codigo relacionado ao `CID` esta concentrado principalmente em:

- `frontend/app.js`
- `frontend/js/modules/cid.js`

Estado observado:

- existe um modulo passivo em `frontend/js/modules/cid.js`;
- o fluxo principal ainda passa por `frontend/app.js`;
- ha funcoes de abertura, renderizacao, selecao, carregamento, salvamento, exclusao e modal no app.js;
- ha uso de `requestJson` no salvamento e na exclusao;
- ha dependencia de backend/endpoints para persistencia e carga;
- ha relacao com o painel de CID e com a lista exibida na interface;
- ha helper local passivo no modulo para validacao, payload e comparacao de texto;
- nao ha indicacao de controle multi-area; a classificacao aqui e apenas documental.

### Mapa funcional do fluxo atual

- `cidEnsureUI`
- `cidRender`
- `cidSelecionado`
- `cidSelecionarLinha`
- `cidCarregar`
- `cidSalvarModal`
- `cidExcluirSelecionado`
- `cidAbrirModal`
- `cidFecharModal`
- `cidVincularEventos`
- `cidAbrir`

No modulo passivo:

- `normalizarCodigoCid`
- `validarCodigoCid`
- `validarDescricaoCid`
- `montarPayloadCid`
- `compararTextoCid`

## Partes proibidas para futura implementacao imediata

Uma futura implementacao nao deve tocar em:

- DOM;
- renderizacao;
- modal;
- selecao visual;
- eventos;
- requestJson;
- payload efetivo;
- salvamento;
- backend;
- banco;
- endpoints;
- permissoes;
- textos visiveis;
- mojibake.

## Candidatos de recorte avaliados

### 1. `compararTextoCid(texto, termo)`

- Responsabilidade: comparacao local de texto para busca/filtro.
- Entradas: texto e termo de pesquisa.
- Saida: booleano.
- Dependencias: normalizacao local de string, sem DOM e sem backend.
- Toca DOM: nao.
- Toca requestJson: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca backend/banco: nao.
- Risco: baixo.
- Ganho esperado: baixo/medio, mas real se houver padronizacao de comparacao local em filtros.
- Facilidade de teste manual: alta, se futuramente for ligado a busca/filtro da lista.

### 2. Normalizacao local de termo de busca

- Responsabilidade: preparar texto para comparacao.
- Entradas: texto bruto.
- Saida: texto normalizado.
- Dependencias: string pura.
- Toca DOM: nao.
- Toca requestJson: nao.
- Toca payload: nao.
- Toca salvamento: nao.
- Toca backend/banco: nao.
- Risco: baixo.
- Ganho esperado: pequeno.
- Facilidade de teste manual: alta, mas o ganho real e limitado enquanto nao houver uso adicional.

## Comparacao dos candidatos

- `compararTextoCid(texto, termo)` e o candidato mais util e mais claro, porque ja existe como helper passivo e pode servir de base para um recorte futuro de busca local.
- A normalizacao local de termo de busca e segura, mas tem ganho menor e tende a ser apenas um detalhe interno do comparador.
- Nenhum dos candidatos justifica tocar em modal, renderizacao, `requestJson` ou salvamento.

## Candidato recomendado

Recomendado: `compararTextoCid(texto, termo)`.

### Contrato funcional proposto

- Nome sugerido: `compararTextoCid`.
- Responsabilidade: comparar texto e termo de busca de forma local e pura.
- Assinatura conceitual: `compararTextoCid(texto, termo)`.
- O que entra: texto bruto e termo bruto.
- O que sai: booleano indicando se ha coincidencia local.
- O que fica proibido: DOM, renderizacao, modal, requestJson, payload, salvamento, backend, banco, endpoints, permissoes, texto visivel e correcoes de mojibake.

### Limites da futura implementacao

- Deve ser pequena.
- Deve permanecer passiva.
- Deve preservar comportamento atual.
- Nao deve introduzir efeitos colaterais.
- Nao deve alterar a experiencia visual.
- Nao deve mover o fluxo de CID para fora de `frontend/app.js` sem ganho funcional claro.

### Funcoes de app.js que poderiam delegar futuramente

Se houver ganho real no futuro, apenas a parte de comparacao/filtro local do fluxo de `CID` em `frontend/app.js` poderia delegar para o helper, mantendo fallback equivalente e comportamento atual.

## Riscos remanescentes

- `CID` ainda depende de fluxo amplo em `frontend/app.js`.
- O modulo passivo ja tem helpers consolidados; novas extracoes devem trazer ganho real, nao apenas padronizacao.
- `requestJson`, salvamento e modal continuam no fluxo principal.
- Qualquer futuro recorte precisa manter a comparacao e a listagem exatamente como estao hoje.

## Onde testar futuramente se houver implementacao

Se houver implementacao futura, o teste manual deve ser em `Tabelas > Doencas (CID)`.

Teste futuro provavel:

- abrir `Tabelas > Doencas (CID)`;
- validar abertura do painel;
- validar listagem;
- validar busca/filtro;
- validar selecao;
- validar modal, se houver no fluxo atual;
- confirmar console limpo;
- fazer regressao rapida em Medicamentos, Plano de Contas e Unidades;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa foi exclusivamente documental. Nenhum arquivo de codigo foi alterado.

## Confirmacao de blindagem textual/mojibake

Nao houve correcao de textos visiveis, acentos, labels, placeholders, mensagens de interface ou mojibake.

## Commit seletivo obrigatorio

Se houver commit nesta etapa, ele deve conter somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cid_contrato_helper_leve_seguro.md`

## Registro para roadmap

Registrar no roadmap que:

- `CID` foi escolhido para contrato documental;
- `CID` e classificado como modulo especifico de area profissional;
- `compararTextoCid(texto, termo)` foi o candidato documental mais seguro;
- nao houve alteracao de codigo;
- a blindagem textual/mojibake foi respeitada;
- a proxima subetapa recomendada e seguir com contrato antes de qualquer implementacao futura.
