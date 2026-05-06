# Relatorio de diagnostico - campos de mesclagem

Data: 2026-05-04

## Objetivo

Diagnosticar a regressao na lista de campos de mesclagem do editor de textos sem alterar banco, fonte primaria, importacao ou backend funcional de insercao/mesclagem.

## Origem atual da lista

A lista usada pela UI e carregada no frontend por `editorTextosCarregarCampos()` em `frontend/app.js`.

Fluxo atual:

1. Botao `editor-textos-btn-inserir-campo` chama `editorTextosAbrirModalMesclagem()`.
2. Os campos ja devem estar carregados por `editorTextosCarregarCampos()`.
3. `editorTextosCarregarCampos()` chama `GET /editor-textos/campos`.
4. O endpoint `listar_campos_editor_textos()` em `backend/routes/editor_textos_routes.py` retorna `MERGE_FIELDS_PAYLOAD`.
5. `MERGE_FIELDS_PAYLOAD` e montado no import do modulo por `_load_merge_fields_payload()`.
6. `_load_merge_fields_payload()` tenta ler `backend/data/editor_textos_mesclagem_snapshot.json`.
7. Como esse arquivo nao existe no projeto atual, o codigo cai em `MERGE_FIELDS_LEGACY`.

Endpoint atual:

- `GET /editor-textos/campos`
- Arquivo: `backend/routes/editor_textos_routes.py`
- Dependencias: `require_module_access("configuracao")` no router e `get_current_user` no endpoint.

## Total bruto encontrado na origem atual

Origem atual efetiva: fallback `MERGE_FIELDS_LEGACY` + campo de assinatura digital acrescentado automaticamente.

Total atual retornado pela API: 9 campos.

Grupos atuais:

| Grupo | Total |
| --- | ---: |
| Geral | 2 |
| AGENDA | 2 |
| CIRURGIAO | 1 |
| PACIENTE | 3 |
| Cirurgiao/Cirurgiao acentuado | 1 |

Observacao: ha tambem inconsistencia historica de acentuacao/encoding no codigo para `Cirurgiao/Cirurgiao acentuado`, mas ela nao e a causa principal da perda dos demais grupos.

## Total exibido na UI

A UI renderiza um grupo por vez no modal.

Com a resposta atual de 9 campos:

- Total carregado em `editorTextosCfg.campos`: 9.
- Total agrupado em `editorTextosCfg.mergeCategorias`: 5 grupos.
- Total exibido inicialmente no grid: depende da categoria padrao resolvida.
- Como `categoria_padrao` vem como `Atestado`, mas `Atestado` nao existe no fallback legado, o frontend usa a primeira categoria disponivel.
- Na pratica, o grid inicial tende a mostrar apenas os 2 campos de `Geral`.

## Estrutura de grupos/categorias

O backend envia:

- `campos`: lista plana para compatibilidade com o antigo select.
- `categorias`: lista agrupada usada pelo modal atual.
- `categoria_padrao`: categoria preferida.

O frontend normaliza com `editorTextosMesclagemNormalizarCategorias(campos, categoriasRaw)`.

Se `categoriasRaw` vier preenchido, o frontend usa essa estrutura diretamente. Se vier vazio, agrupa a lista plana por `item.categoria`.

## Fonte primaria/original encontrada

Fonte primaria disponivel no projeto:

- `storage/modelos/clinicas/1/MergeList.tmp`
- `storage/modelos/clinicas/1/Textos/MergeList.tmp`

Os dois arquivos encontrados tem o mesmo total.

Total na fonte primaria: 107 campos.

Grupos na fonte primaria:

| Grupo | Total |
| --- | ---: |
| Atestado | 1 |
| Data | 7 |
| Clinica | 11 |
| Cirurgiao | 3 |
| Paciente | 57 |
| Contato | 6 |
| Receita | 1 |
| Recibo | 12 |
| Etiqueta | 9 |

## Diferenca entre lista atual e fonte primaria

Fonte atual efetiva:

- 9 campos.
- 5 grupos, com nomes parcialmente em caixa alta por causa do fallback legado.

Fonte primaria encontrada:

- 107 campos.
- 9 grupos reais.

Diferenca:

- 98 campos nao chegam na API atual.
- Grupos ausentes integralmente na API atual: `Atestado`, `Data`, `Clinica`, `Contato`, `Receita`, `Recibo`, `Etiqueta`.
- Grupo `Paciente` existe na fonte primaria com 57 campos, mas o fallback atual so expoe 3 tokens `PACIENTE.*`.
- Grupo `Cirurgiao` existe na fonte primaria com 3 campos, mas o fallback atual expoe 1 token sem acento e 1 campo de assinatura digital adicionado separadamente.

## Filtros aplicados

Nao foi encontrado filtro por:

- clinica na listagem de campos;
- tipo de documento;
- categoria no backend;
- permissao especifica alem do acesso ao modulo `configuracao`;
- dados do paciente ou documento.

Filtro real aplicado na UI:

- O modal exibe apenas a categoria selecionada no `select`.
- Esse filtro nao remove dados do conjunto carregado, apenas decide quais linhas aparecem no grid.

Conclusao sobre filtro: a perda principal nao parece ser um filtro de UI. Os campos ja chegam reduzidos do backend porque a fonte atual caiu no fallback legado.

## Normalizacao e descarte

No backend, `_load_merge_fields_payload()` descarta itens sem `categoria` ou sem `campo` quando le o snapshot JSON.

No estado atual, essa regra nao esta descartando a fonte primaria porque o snapshot JSON nem existe. O descarte nao e a causa observada.

No frontend, `editorTextosMesclagemNormalizarCategorias()` descarta linhas sem `token`. A resposta atual ja vem com tokens. Portanto, tambem nao parece ser a causa da perda.

## Instrumentacao adicionada

Foram adicionados logs atras da flag de debug existente (`window.DEBUG_TAB_ENGINE = true`, `EDITOR_TEXTOS_DEBUG` ou `brana_editor_textos_debug=1`):

- `MERGE FIELDS SOURCE RAW`
- `MERGE FIELDS GROUPED RESULT`
- `MERGE FIELDS FILTER APPLIED`
- `MERGE FIELDS MODAL RENDER`

Esses logs mostram:

- endpoint chamado;
- status da resposta;
- total bruto de campos recebidos;
- total de categorias recebidas;
- resumo dos grupos;
- categoria filtrada/renderizada;
- total exibido no modal.

## Causa provavel

A causa provavel da regressao e a ausencia de `backend/data/editor_textos_mesclagem_snapshot.json`, que faz o backend usar `MERGE_FIELDS_LEGACY`, uma lista curta de apenas 8 campos historicos. Depois o backend acrescenta automaticamente `Cirurgiao.AssinaturaDigital`, chegando a 9 campos.

A fonte primaria original ainda existe no projeto como `MergeList.tmp`, mas a rota atual nao le esse arquivo.

## Recomendacao de correcao

Recomendacao para a proxima etapa:

1. Restaurar/criar uma fonte estruturada oficial para `backend/data/editor_textos_mesclagem_snapshot.json` a partir do `MergeList.tmp` primario, preservando os 107 campos e os grupos.
2. Ou ajustar `_load_merge_fields_payload()` para usar `MergeList.tmp` como fallback antes de cair em `MERGE_FIELDS_LEGACY`.
3. Manter `MERGE_FIELDS_LEGACY` apenas como ultimo fallback de emergencia.
4. Preservar a estrutura agrupada (`categorias`) para o modal e a lista plana (`campos`) para compatibilidade.
5. Antes de aplicar, validar se todos os 107 tokens possuem suporte de substituicao esperado em `_build_merge_values()` ou se alguns devem aparecer como placeholders preservados.

## Necessidade de voltar a fonte primaria

Sim. Para recuperar a lista completa, sera necessario voltar a usar a fonte primaria ou recriar o snapshot estruturado a partir dela.

Nesta etapa, nenhuma alteracao foi feita na fonte primaria, banco, importacao, Fase 7, Tab SAFE, cor do texto ou backend funcional de insercao.

## Atualizacao de restauracao

Em 2026-05-04, a lista completa foi restaurada criando `backend/data/editor_textos_mesclagem_snapshot.json` a partir de `storage/modelos/clinicas/1/MergeList.tmp`.

O loader do backend passou a usar a ordem:

1. `snapshot_json`
2. `merge_list_tmp`
3. `legacy_fallback`

Resultado validado no payload:

- fonte: `snapshot_json`;
- 107 campos restaurados da fonte primaria;
- 9 grupos restaurados;
- 108 campos disponiveis na rota por preservacao do campo adicional de assinatura digital ja existente.

Relatorio de restauracao: `docs/relatorio_campos_mesclagem_restauracao.md`.
