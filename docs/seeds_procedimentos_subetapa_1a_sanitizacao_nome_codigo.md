# Contrato funcional - Subetapa 1A

## Objetivo

Formalizar a primeira subetapa de sanitizacao dos seeds de novas contas/clinicas no Brana Cloud, focada apenas em Procedimentos Padrao.

## Contrato seguido

Esta subetapa segue o contrato funcional definido em:

- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`

E usa como base a auditoria:

- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`

Regra aplicada nesta subetapa:

- novas contas/clinicas devem nascer com procedimentos padronizados contendo somente `codigo`, se existir, `nome` e campos tecnicos obrigatorios do schema;
- nao devem nascer com preco, custo, custo de material, custo de laboratorio, lucro, margem, tempo, garantia, valor de repasse, especialidade nao obrigatoria, simbolo grafico nao obrigatorio, observacoes, `procedimento_generico_id`, materiais vinculados, fases, composicao pronta ou qualquer outro campo financeiro/tecnico nao obrigatorio;
- esta alteracao vale somente para novas contas/clinicas;
- dados de clinicas existentes nao devem ser alterados.

## Arquivos analisados

- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `backend/models/procedimento.py`
- `backend/routes/procedimentos_routes.py`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Arquivos alterados

- `backend/seeds/procedimentos_padrao.py`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`

## Alteracao feita

O seed de procedimentos padrao foi sanitizado na origem do payload inserido para novas contas/clinicas. O fluxo passou a manter somente os campos tecnicos obrigatorios e os identificadores essenciais do procedimento, removendo a propagacao de valores financeiros e de heranca de composicao.

## Campos preservados

- `codigo`
- `nome`
- `clinica_id`
- `tabela_id`

## Campos zerados, nulificados ou omitidos

Nesta subetapa, os campos abaixo foram ajustados para nao levar dados sensiveis para novas contas/clinicas, mantendo valores seguros compatíveis com o schema:

- `tempo`
- `preco`
- `custo`
- `custo_lab`
- `lucro_hora`
- `garantia_meses`
- `valor_repasse`
- `especialidade`
- `procedimento_generico_id`
- `simbolo_grafico`
- `simbolo_grafico_legacy_id`
- `forma_cobranca`
- `observacoes`
- `data_inclusao`
- `data_alteracao`
- `mostrar_simbolo`
- `preferido`
- `inativo`

## Campos obrigatorios mantidos

- `codigo`
- `nome`
- `clinica_id`
- `tabela_id`

## Justificativa tecnica

O ponto mais seguro para esta subetapa e o arquivo de seed de procedimentos, porque ele define o payload base que entra no cadastro inicial de novas contas. Como o fluxo de signup consome esse seed, sanitizar a origem do payload reduz o risco de herdar preco, custo, tempo, fase, material vinculado ou composicao sem tocar em dados de clinicas existentes.

## Se `backend/seeds/procedimentos_padrao.py` foi suficiente

Sim. Para a Subetapa 1A, o arquivo de seed foi suficiente para impedir que novos procedimentos padrao nascam com campos financeiros/tecnicos nao obrigatorios.

## Se `backend/services/signup_service.py` precisa de Subetapa 1B

Nao nesta subetapa. O `signup_service` consome o seed sanitizado e nao foi alterado. Se um ajuste futuro for necessario para endurecer ainda mais o fluxo de cadastro inicial, isso deve ser tratado como Subetapa 1B separada, sem misturar com esta entrega.

## Riscos remanescentes

- outros fluxos manuais ou scripts de manutencao podem inserir procedimentos com dados mais completos;
- heranca de `procedimento_generico` e vinculos relacionados continua existindo em outras rotas e sera tratada em subetapas posteriores;
- a validacao funcional final depende de teste em ambiente seguro com nova conta/clinica.

## Checks executados

- `git branch --show-current`
- `git status --short` antes
- `git diff --stat` antes
- `python -m py_compile backend/seeds/procedimentos_padrao.py`
- `git diff --stat` depois
- `git status --short` depois

## Onde testar depois

Depois desta subetapa e antes de qualquer commit futuro, testar em ambiente seguro:

1. Criar nova conta/clinica de teste, inclusive fluxo DEMO/trial de 7 dias.
2. Abrir Procedimentos.
3. Confirmar que os procedimentos nasceram com nome/codigo.
4. Confirmar que nao nasceram com preco.
5. Confirmar que nao nasceram com custo.
6. Confirmar que nao nasceram com tempo/duracao.
7. Confirmar que nao nasceram com `procedimento_generico_id`.
8. Confirmar que nao nasceram com fases.
9. Confirmar que nao nasceram com materiais vinculados.
10. Editar manualmente um procedimento.
11. Informar valores manualmente.
12. Salvar.
13. Reabrir e confirmar persistencia.
14. Verificar console do navegador sem erro.
15. Verificar backend sem erro.

