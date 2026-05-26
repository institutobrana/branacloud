# CID - Implementacao minima de uso de compararTextoCid no filtro local

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Implementar de forma minima e conservadora o uso de `compararTextoCid(texto, termo)` no filtro local de CID, preservando exatamente o comportamento atual da busca.

## Contexto

Esta etapa sucede o contrato funcional especifico de `compararTextoCid`.

- `CID` continua classificado como modulo especifico de area profissional.
- O helper `compararTextoCid(texto, termo)` ja existia em `frontend/js/modules/cid.js` dentro de `ns.helpers`.
- O `app.js` ainda fazia comparacao local direta em `cidFiltrar()`.
- O contrato anterior recomendou implementacao minima com fallback equivalente.

## Classificacao do modulo

`CID` continua sendo tratado como modulo especifico de area profissional.

Essa classificacao e apenas documental e de orientacao futura. Ela nao altera permissoes, tenant, backend ou qualquer controle multi-area.

## Arquivos alterados

- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cid_implementacao_comparar_texto_cid.md`

## Descricao exata da alteracao

A funcao `cidFiltrar()` passou a:

- ler o termo de busca com `trim()` sem criar nova regra de negocio;
- priorizar `window.BranaCidModule?.helpers?.compararTextoCid` quando disponivel;
- manter fallback local equivalente quando o helper nao estiver disponivel;
- continuar comparando `codigo` e `descricao`;
- continuar usando comparacao case-insensitive e `includes`;
- continuar tratando valores vazios/nulos/undefined de forma equivalente ao comportamento anterior.

## Confirmacao de que a alteracao foi minima

A mudanca ficou restrita ao ponto local de filtro de CID. Nao houve criacao de alias top-level, nem alteracao do fluxo visual, nem alteracao do carregamento remoto.

## Confirmacao de que compararTextoCid permaneceu passivo

O helper continua passivo em `frontend/js/modules/cid.js`, dentro de `ns.helpers`, sem DOM, sem `requestJson`, sem payload, sem salvamento e sem dependencia de backend.

## Confirmacao de que o comportamento de busca/filtro foi preservado

A logica continua sendo:

- comparar por `codigo`;
- comparar por `descricao`;
- considerar `includes`;
- ser case-insensitive;
- tratar textos vazios de forma equivalente ao filtro anterior.

## Confirmacao de que nao houve alteracoes colaterais

Nao houve alteracao de:

- DOM;
- renderizacao;
- selecao visual;
- modal;
- eventos;
- `requestJson`;
- payload;
- salvamento;
- backend;
- banco;
- permissões;
- textos visiveis;
- mojibake;
- criacao/edicao/exclusao de CID;
- listagem remota.

## Riscos remanescentes

- o fluxo principal de CID continua em `frontend/app.js`;
- qualquer nova extracao precisa preservar o filtro e a listagem exatamente como estao;
- a futura padronizacao da comparacao deve permanecer minima para nao alterar resultados da busca.

## Onde testar manualmente

O teste manual deve ser feito em `Tabelas > Doencas (CID)`.

Teste recomendado:

- abrir `Tabelas > Doencas (CID)`;
- validar abertura do painel;
- validar listagem;
- validar busca/filtro com termo existente;
- validar busca/filtro com termo inexistente;
- validar busca/filtro com letras maiusculas/minusculas;
- validar selecao;
- validar modal, se houver no fluxo atual;
- confirmar console limpo;
- fazer regressao rapida em Medicamentos, Plano de Contas e Unidades;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa alterou codigo apenas no escopo minimo autorizado de `frontend/app.js`. Nao houve alteracao em outros arquivos de codigo, backend, banco, permissões, DOM, modal ou fluxo visual.

## Confirmacao de blindagem textual/mojibake

Nao houve correcao de textos visiveis, acentos, labels, placeholders, mensagens de interface ou mojibake.

## Commit seletivo obrigatorio

Se houver commit nesta etapa, ele deve conter somente:

- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cid_implementacao_comparar_texto_cid.md`

## Registro para roadmap

Registrar no roadmap que:

- a implementacao minima de uso de `compararTextoCid` no filtro local de CID foi realizada;
- `CID` continua como modulo especifico de area profissional;
- o helper permanece passivo;
- DOM/renderizacao/modal/selecao/eventos nao foram alterados;
- `requestJson`/payload/salvamento/endpoints nao foram alterados;
- backend/banco/permissões nao foram alterados;
- a blindagem textual/mojibake foi respeitada;
- teste manual do usuario e obrigatorio antes da proxima etapa documental.
