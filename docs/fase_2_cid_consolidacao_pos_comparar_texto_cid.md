# CID - Consolidacao documental pos-validacao de compararTextoCid

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Consolidar documentalmente a validacao pos-teste de `compararTextoCid` no filtro local de CID, sem alterar codigo e sem iniciar novo recorte.

## Contexto

Esta etapa sucede a validacao pos-teste de `compararTextoCid`.

- `CID` continua classificado como modulo especifico de area profissional.
- O helper `compararTextoCid(texto, termo)` ja existia em `frontend/js/modules/cid.js` dentro de `ns.helpers`.
- O `app.js` passou a delegar o filtro local ao helper com fallback equivalente.
- O teste manual do usuario passou em `Tabelas > Doencas (CID)`.

## Classificacao do modulo

`CID` continua sendo tratado como modulo especifico de area profissional.

Essa classificacao e apenas documental e de orientacao futura. Ela nao altera permissoes, tenant, backend ou qualquer controle multi-area.

## Decisao consolidada

- `compararTextoCid` fica consolidado no filtro local de CID;
- manter o uso via `window.BranaCidModule?.helpers?.compararTextoCid`;
- manter fallback local equivalente;
- nao criar alias top-level agora;
- nao alterar `frontend/js/modules/cid.js`;
- nao fazer nova implementacao em CID nesta etapa.

## Motivo tecnico

- o helper ja existia e era passivo;
- a alteracao foi minima em `cidFiltrar()`;
- o comportamento de busca/filtro foi preservado;
- o teste manual passou;
- o ganho foi arquitetural/de delegacao segura;
- nao era esperado grande ganho visivel de tamanho nesta subetapa.

## Estado consolidado do CID

- CID permanece parcialmente modularizado;
- o fluxo principal ainda continua em `frontend/app.js`;
- `requestJson`, salvamento, modal, renderizacao e selecao continuam no fluxo principal;
- `compararTextoCid` fica validado como ponto seguro de delegacao;
- qualquer novo recorte em CID exige nova decisao documental.

## Riscos remanescentes

- o fluxo principal de CID continua amplo em `frontend/app.js`;
- futuras delegacoes precisam preservar exatamente o resultado de busca/filtro;
- normalizacoes futuras podem alterar comportamento;
- qualquer alteracao em modal, salvamento, renderizacao ou selecao exige contrato proprio.

## Recomendacao futura

Recomenda-se de forma conservadora pausar/consolidar CID por ora e, se houver novo avanço, voltar primeiro a uma decisao documental antes de outra implementacao.

## Onde testar futuramente se houver nova implementacao

Qualquer futura implementacao em CID deve ser testada em `Tabelas > Doencas (CID)`.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa foi exclusivamente documental. Nenhum arquivo de codigo foi alterado nesta rodada.

## Confirmacao de blindagem textual/mojibake

Nao houve correcao de textos visiveis, acentos, labels, placeholders, mensagens de interface ou mojibake.

## Commit seletivo obrigatorio

Se houver commit nesta etapa, ele deve conter somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cid_consolidacao_pos_comparar_texto_cid.md`

## Registro para roadmap

Registrar no roadmap que:

- `compararTextoCid` foi consolidado no filtro local de CID;
- o teste manual passou;
- CID continua como modulo especifico de area profissional;
- o ganho foi arquitetural/de delegacao segura;
- nao houve alteracao de codigo nesta etapa;
- a blindagem textual/mojibake foi respeitada;
- CID fica pausado/consolidado por ora;
- a proxima subetapa recomendada e nova decisao documental antes de qualquer novo recorte.
