# Fase G.3D - Homologacao runtime do CRUD basico de Simbolos graficos

Data: 2026-08-04

## Objetivo
Validar em runtime, no fluxo `Configuracoes -> Simbolos graficos`, a sequencia de:
- criar simbolo sem desenho;
- editar o simbolo criado;
- excluir o simbolo criado;
- confirmar persistencia e limpeza no banco.

## Resultado
Homologacao concluida com sucesso apos duas correcoes de runtime:
- importacao faltante de `TissTipoTabela` em `backend/routes/cadastros_routes.py`, que causava `500` ao acionar a consulta do fluxo;
- fallback de `codigo` no mapper do create limitado a 30 caracteres, para respeitar o schema de `simbolo_grafico_catalogo`.

## Evidencias tecnicas
- criação validada no banco com o registro `TESTE CRUD 748058`;
- atualização validada pela rota do modulo para `TESTE CRUD 748058 ALT`;
- exclusao validada na mesma rota, com retorno final `after_delete = None`;
- testes direcionados do frontend React aprovados;
- build do frontend React aprovado.

## Limpeza de residuos de teste
- candidatos encontrados: `TESTE CRUD SIMBOLO 189277`, `TESTE CRUD SIMBOLO 3`, `TESTE G3D1 CORRIGIDO 88449`, `TESTE G3D1 DIRECT`, `TESTE G3D1 CORRIGIDO 97342`, `TESTE G3D1 CORRIGIDO 31041`;
- confirmados: todos os seis, por nome exato documentado e correspondencia com as rodadas de teste;
- incertos preservados: nenhum;
- IDs removidos: `1816`, `1817`, `1819`, `1820`, `1821`, `1822`;
- metodo de exclusao: DELETE pontual no banco, apos verificacao de ausencia de vinculacao;
- vinculos: nenhum encontrado na auditacao da tabela `simbolo_grafico_catalogo`;
- estado final: banco voltou a `1113` registros totais, com `origem nula = 1113` e `origem preenchida = 0`.

## Arquivos alterados nesta rodada
- `backend/routes/cadastros_routes.py`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js`
- `frontend-react/tests/simboloGraficoCreateModal.test.js`
- `frontend-react/tests/simbolosGraficosApi.test.js`
- `docs/continuidade_fases_origem_simbolos_graficos.md`

## Observacoes
- `scope=grade` nao foi reintroduzido;
- backfill permanece congelado;
- o cadastro de simbolos graficos continua operando somente pela camada React e pelas rotas operacionais do modulo.
