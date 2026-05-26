# CID - Contrato funcional especifico de compararTextoCid antes de implementacao

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Definir, de forma conservadora e somente documental, o contrato funcional para uma futura implementacao minima de uso do helper `compararTextoCid(texto, termo)` no fluxo de `CID`.

## Contexto

Esta etapa sucede o contrato documental anterior de `CID`.

- `CID` foi classificado como modulo especifico de area profissional.
- O fluxo principal de `CID` continua em `frontend/app.js`.
- O helper `compararTextoCid(texto, termo)` ja existe em `frontend/js/modules/cid.js`, mas ainda nao e usado pelo `app.js`.
- A recomendacao anterior foi criar um contrato funcional especifico antes de qualquer implementacao futura.

## Classificacao do modulo

`CID` continua sendo tratado como modulo especifico de area profissional.

Essa classificacao e apenas documental e de orientacao futura. Ela nao altera permissões, tenant, backend ou qualquer controle multi-area.

## Estado atual exato do helper compararTextoCid

O helper esta definido em:

- `frontend/js/modules/cid.js`

Estado observado:

- esta exposto dentro de `ns.helpers`;
- nao existe alias top-level proprio para `compararTextoCid`;
- assinatura real: `compararTextoCid(texto, termo)`;
- logica atual: converte os dois valores para texto local, faz trim, converte para minusculas e verifica `includes`;
- e puro;
- nao possui dependencias externas;
- nao toca DOM;
- nao toca requestJson;
- nao toca payload;
- nao toca salvamento;
- nao toca backend;
- nao toca banco.

## Estado atual do uso no app.js

Em `frontend/app.js`, o fluxo de `CID` ainda nao usa `compararTextoCid` diretamente.

O ponto atual de comparacao local esta em `cidFiltrar()`, que faz filtro direto por:

- `codigo`
- `descricao`

com comparacao local `toLowerCase().includes(...)`.

Isso significa que:

- existe fallback local equivalente ja funcionando;
- a futura delegacao seria pequena e localizada;
- a delegacao futura reduziria duplicacao e padronizaria o comportamento, mas o ganho funcional e limitado porque o comportamento atual ja e simples e correto.

## Contrato funcional proposto

### Assinatura conceitual

`compararTextoCid(texto, termo)`

### Comportamento esperado

- entrada `texto`: valor bruto da string a comparar;
- entrada `termo`: valor bruto do termo de busca;
- saida: `boolean`;
- se `texto` for vazio, nulo ou `undefined`, ele deve ser tratado como string vazia;
- se `termo` for vazio, nulo ou `undefined`, ele deve ser tratado como string vazia;
- a comparacao deve permanecer case-insensitive;
- a comparacao deve continuar usando a normalizacao local ja existente no helper;
- o comportamento deve preservar a logica atual do `app.js`;
- nao deve alterar o comportamento de busca/filtro.

### Resultado pratico esperado

- termo vazio deve equivaler a "match all" no uso de filtro local;
- texto vazio com termo nao vazio deve resultar em `false`;
- a comparacao deve continuar sendo local e previsivel.

## Limites obrigatorios da futura implementacao

A futura implementacao, se aprovada depois, nao podera:

- alterar DOM;
- alterar renderizacao;
- alterar selecao visual;
- alterar modal;
- alterar eventos;
- alterar requestJson;
- alterar payload;
- alterar salvamento;
- alterar backend;
- alterar banco;
- alterar endpoints;
- alterar permissoes;
- alterar textos visiveis;
- corrigir mojibake;
- alterar a logica de criacao/edicao/exclusao de CID;
- alterar listagem remota;
- alterar console/logs sem necessidade.

## Estrategia de fallback futura

O fallback conceitual futuro deve manter a mesma comparacao local atual de `cidFiltrar()`.

Padrao documental esperado:

```javascript
const comparaCid = window.BranaCidModule?.helpers?.compararTextoCid || fallbackLocalEquivalente;
```

Onde o `fallbackLocalEquivalente` replica apenas a comparacao local existente hoje, sem alterar o resultado e sem criar nova regra.

## Ganho esperado

- reducao real pequena, mas concreta, no trecho local de filtro de `CID`;
- padronizacao da comparacao de busca;
- clareza arquitetural;
- baixo risco de regressao por ser um helper puro;
- teste manual simples se futuramente a delegacao for aplicada no filtro da lista.

O ganho e real, porem limitado. Ainda assim, ele e suficiente para justificar uma implementacao minima futura, desde que permaneça local, passiva e com fallback.

## Riscos remanescentes

- risco de mudar resultado de busca/filtro se a normalizacao divergir;
- risco de afetar selecao e listagem;
- risco de tocar o fluxo de `CID` mais amplo sem necessidade;
- risco de regressao em Medicamentos, Plano de Contas e Unidades se o filtro for alterado de forma indevida;
- risco de inserir alteracao maior do que o beneficio se a futura implementacao deixar de ser minima.

## Decisao conservadora

Escolha: **A. compararTextoCid esta apto para implementacao minima futura.**

## Justificativa tecnica

O helper ja existe, e puro, nao depende de DOM, nao depende de persistencia e replica uma comparacao local simples que hoje esta duplicada em `cidFiltrar()`. A futura implementacao pode ser minima, com fallback local equivalente e sem tocar em qualquer fluxo de salvamento ou modal. O risco e baixo desde que a alteracao seja restrita ao filtro local.

## Proxima subetapa recomendada

Implementacao minima futura de uso de `compararTextoCid(texto, termo)` no filtro local de `CID`, com fallback equivalente e sem alterar persistencia.

## Onde testar futuramente se houver implementacao

Se houver futura implementacao, o teste manual obrigatorio deve ser em `Tabelas > Doencas (CID)`.

Teste futuro provavel:

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

Esta etapa foi exclusivamente documental. Nenhum arquivo de codigo foi alterado.

## Confirmacao de blindagem textual/mojibake

Nao houve correcao de textos visiveis, acentos, labels, placeholders, mensagens de interface ou mojibake.

## Commit seletivo obrigatorio

Se houver commit nesta etapa, ele deve conter somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cid_contrato_comparar_texto_cid.md`

## Registro para roadmap

Registrar no roadmap que:

- foi criado contrato funcional especifico de `compararTextoCid`;
- `CID` continua como modulo especifico de area profissional;
- a decisao conservadora foi aprovar o helper para futura implementacao minima, e nao mexer em mais nada agora;
- nao houve alteracao de codigo;
- a blindagem textual/mojibake foi respeitada;
- a proxima subetapa recomendada e a implementacao minima futura com fallback.
