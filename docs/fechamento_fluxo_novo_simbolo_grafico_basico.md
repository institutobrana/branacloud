# Fechamento do fluxo Novo basico de simbolo grafico

Data: 2026-08-03

## Status
- NAO CONGELADO - RETORNADO AO MARCO C

## Motivo
- A Microetapa D foi revertida ao marco C.
- O fluxo Novo voltou ao contrato puramente local do mapper, sem POST ativo no modal.
- A grade retornou a `scope=catalogo`.

## Base confirmada
- `scope=catalogo` volta a ser o contrato da grade nesta restauracao.
- O marco C preserva modal, mapper e validacao local.
- Nao houve alteracao de banco ou backend neste rollback.

## O que ficou alinhado
- O fluxo Novo permanece sem API ativa.
- O clique em Ok chama apenas o mapper local.
- A grade nao deve usar `scope=biblioteca` nesta estabilizacao.

## O que ficou alinhado com o rollback
- Modal visualmente estavel.
- Nome validado.
- Especialidade e Forma estaveis.
- Preview e selecao preservados.
- Cancela limpa estado.

## Documentacao relacionada
- `docs/microetapa_d_post_basico_simbolo_grafico.md`
- `docs/diagnostico_post_reload_lista_simbolos_graficos.md`
- `docs/homologacao_runtime_post_basico_simbolo_grafico.md`
- `docs/auditoria_composicao_grade_simbolos_graficos_scope_biblioteca.md`

## Proxima etapa
- Aguardar homologacao visual do rollback antes de iniciar a Fase G.0.

## Atualizacao de fase
- A leitura funcional da FASE G.0E confirmou um ponto importante: o simbolo grafico pode nascer em branco e seguir para a grade sem desenho pronto.
- O contrato do fluxo Novo permanece sem `POST` ativo nesta rodada.
- A documentacao nova passa a separar o nascimento do simbolo da posterior persistencia do desenho.
