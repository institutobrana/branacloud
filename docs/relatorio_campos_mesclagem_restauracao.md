# Relatorio de restauracao - campos de mesclagem

Data: 2026-05-04

## Fonte usada

Fonte primaria confirmada:

- `storage/modelos/clinicas/1/MergeList.tmp`

Formato encontrado:

- arquivo texto com linhas separadas por quebra de linha;
- primeira linha contem os nomes dos campos separados por tab;
- cada campo usa o formato `Categoria.Campo`;
- segunda linha contem valores de exemplo na mesma ordem, mas nao e necessaria para montar a lista de insercao.

## Snapshot recriado

Snapshot criado:

- `backend/data/editor_textos_mesclagem_snapshot.json`

Estrutura gerada:

- `fonte`
- `gerado_em`
- `formato`
- `total_campos`
- `categorias_ordem_arquivo`
- `campos`

Cada item em `campos` contem:

- `categoria`
- `campo`
- `descricao`
- `token`
- `ordem`

## Totais restaurados

Campos vindos da fonte primaria/snapshot: 107.

Grupos vindos da fonte primaria/snapshot: 9.

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

## Fonte usada pela rota

`_load_merge_fields_payload()` foi ajustado para usar esta ordem:

1. `snapshot_json`
2. `merge_list_tmp`
3. `legacy_fallback`

Validacao direta do payload carregado:

- fonte: `snapshot_json`
- total de grupos na rota: 9
- total de campos na rota: 108
- categoria padrao: `Atestado`

Observacao: a fonte primaria tem 107 campos. A rota preserva o comportamento ja existente de acrescentar `Cirurgiao.AssinaturaDigital` quando o campo de assinatura digital nao esta na fonte, por isso o total disponivel na rota fica 108.

## Validacao final da rota

Validacoes executadas:

- `node --check frontend\app.js`
- `.\.venv\Scripts\python.exe -m py_compile backend\routes\editor_textos_routes.py`
- chamada direta do endpoint `listar_campos_editor_textos()` com dependencia de usuario ja resolvida
- chamada HTTP local para `GET /editor-textos/campos`

Resultado da chamada direta:

- fonte: `snapshot_json`
- campos: 108
- grupos: 9
- grupos: `Atestado`, `Data`, `Clinica`, `Cirurgiao`, `Paciente`, `Contato`, `Receita`, `Recibo`, `Etiqueta`

Resultado da chamada HTTP local:

- o servidor respondeu `401 Nao Autorizado` sem token, confirmando que a rota continua protegida por autenticacao;
- a chamada autenticada real nao foi concluida nesta etapa por falta de token/sessao disponivel no ambiente de linha de comando.

## Validacao visual

A validacao visual completa do modal depende de sessao autenticada no navegador.

O payload que alimenta o frontend voltou a fornecer:

- 9 categorias;
- categoria padrao `Atestado`;
- conjunto completo restaurado a partir do snapshot;
- primeiro grid deixa de ser limitado por origem curta de 2 campos, pois a origem principal deixou de ser `MERGE_FIELDS_LEGACY`.

## Conclusao

A regressao foi corrigida na origem da lista. O backend deixou de usar o fallback curto como caminho principal e passou a usar `snapshot_json`.

Nao foram alterados:

- insercao de campo de mesclagem;
- Tab SAFE;
- cor do texto;
- backend de modelos;
- banco;
- Fase 7.
