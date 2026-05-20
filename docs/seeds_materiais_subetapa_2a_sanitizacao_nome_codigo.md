# Subetapa 2A - Sanitizacao de Materiais

## Objetivo

Aplicar a sanitizacao dos seeds de Materiais no nascimento de novas contas/clinicas do Brana Cloud, inclusive contas DEMO/trial de 7 dias, sem afetar clinicas existentes.

## Contratos seguidos

Este ajuste segue obrigatoriamente:

- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Planejamento usado como base

O planejamento previa que:

- a origem real dos materiais vem de CSVs carregados pelo `signup_service`;
- o ponto mais seguro para a sanitizacao e `_upsert_materiais_na_lista()`;
- a alteracao deve ficar restrita ao fluxo de novas contas;
- nao deve haver backfill, migration, alteracao de frontend ou impacto em procedimentos, procedimentos genericos e vinculos.

## Arquivos analisados

- `backend/services/signup_service.py`
- `backend/routes/materiais_routes.py`
- `backend/models/material.py`
- `backend/services/vinculos_materiais.py`
- `backend/routes/procedimentos_routes.py`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`

## Arquivos alterados

- `backend/services/signup_service.py`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`

## Funcao alterada

- `_upsert_materiais_na_lista()`

## Alteracao feita

A funcao `_upsert_materiais_na_lista()` passou a sanitizar os dados de material antes da persistencia.

O que mudou:

- cada item de entrada agora e normalizado em um payload minimo;
- `codigo`, `nome` e `lista_id` permanecem como base do cadastro;
- campos financeiros e tecnicos nao obrigatorios sao zerados ou vazios antes do insert/update;
- a persistencia continua ocorrendo apenas no fluxo de carga da lista padrao da nova clinica.

## Campos preservados

- `codigo`
- `nome`
- `lista_id`

## Campos zerados, nulificados ou omitidos

- `relacao` -> `0`
- `custo` -> `0`
- `preco` -> `0`
- `validade_dias` -> `0`
- `unidade_compra` -> `""`
- `unidade_consumo` -> `""`
- `classificacao` -> `""`
- `preferido` -> `False`

Campos nao presentes no model atual, mas tratados como nao desejados caso aparecam em origens futuras:

- `fabricante`
- `estoque`

## Campos obrigatorios mantidos

- `codigo`
- `nome`
- `lista_id`
- os demais campos tecnicos exigidos pelo schema do material/lista, sem expandir o payload com dados sensiveis

## Justificativa tecnica

O ponto mais seguro e `_upsert_materiais_na_lista()` porque ele e o ultimo ponto antes da gravacao dos materiais na nova conta.

Sanitizar ali evita:

- contaminar novas contas com custo, preco e relacao herdados de CSVs ou clinicas base;
- alterar rotas manuais de CRUD de materiais;
- tocar em dados de clinicas existentes;
- mexer em frontend, migrations ou scripts de banco.

## Confirmacao de aplicacao

Esta alteracao vale para novas contas, inclusive DEMO/trial de 7 dias, porque e executada no fluxo de `criar_conta_saas()` por meio de `garantir_lista_padrao_clinica()`.

## Riscos remanescentes

- `backend/routes/procedimentos_routes.py` e `backend/services/vinculos_materiais.py` continuam usando `Material.custo` e `Material.preco` para calculos e exibicoes; nas novas contas, isso passa a refletir zero ate preenchimento manual;
- o fluxo manual de materiais continua existindo e nao foi alterado nesta subetapa;
- a sanitizacao nao faz backfill e nao corrige dados de clinicas antigas, por desenho;
- regras de vinculos entre procedimentos genericos e procedimentos continuam intactas.

## Checks executados

- `git branch --show-current`
- `git status --short` antes
- `git diff --stat` antes
- leitura de `backend/services/signup_service.py`
- leitura de `backend/routes/materiais_routes.py`
- leitura de `backend/models/material.py`
- leitura de `backend/services/vinculos_materiais.py`
- leitura de `backend/routes/procedimentos_routes.py`
- leitura dos documentos de contrato e planejamento
- `python -m py_compile backend/services/signup_service.py`
- `git diff --stat` depois
- `git status --short` depois

## Onde testar depois

Depois da implementacao e antes de qualquer commit futuro, testar em ambiente seguro:

1. Criar nova conta/clinica de teste, inclusive DEMO/trial de 7 dias.
2. Abrir Materiais.
3. Confirmar que os materiais nasceram com `codigo` e `nome`.
4. Confirmar que nao nasceram com `custo`.
5. Confirmar que nao nasceram com `preco`.
6. Confirmar que nao nasceram com `relacao`.
7. Confirmar que nao nasceram com `validade`.
8. Confirmar que nao nasceram com `unidade` ou `classificacao`, salvo se obrigatorias.
9. Editar manualmente um material.
10. Informar valores manualmente.
11. Salvar.
12. Reabrir e confirmar persistencia.
13. Verificar Procedimentos para garantir que nao houve quebra por material zerado.
14. Verificar console do navegador sem erro.
15. Verificar backend sem erro.

## Conclusao

A Subetapa 2A foi implementada no menor ponto seguro e ficou restrita ao fluxo de novas contas/clinicas.

