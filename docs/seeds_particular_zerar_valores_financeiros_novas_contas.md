# Seeds Particular - Zeramento de valores financeiros em novas contas

## 1. Objetivo
Garantir que a tabela de preço `PARTICULAR` continue nascendo com os 336 procedimentos em novas contas, mas sem valores financeiros preenchidos.

## 2. Arquivo alterado
- `backend/services/signup_service.py`

## 3. Função alterada
- `_upsert_procedimentos_particular_na_clinica()`

## 4. Campos financeiros zerados
- `preco` -> `0.0`
- `custo` -> `0.0`
- `custo_lab` -> `0.0`
- `lucro_hora` -> `0.0`
- `valor_repasse` -> `0.0`
- `garantia_meses` -> `0`

## 5. Campo financeiro/operacional preservado
- `forma_cobranca`

## 6. Campos técnicos preservados
- `codigo`
- `nome`
- `clinica_id`
- `tabela_id`
- `procedimento_generico_id`
- `simbolo_grafico`
- `simbolo_grafico_legacy_id`
- `mostrar_simbolo`
- `preferido`
- `inativo`
- `data_inclusao`
- `data_alteracao`
- `especialidade`

## 7. Proteção contra sobrescrita de contas existentes
- A rotina passou a ignorar procedimentos que já existirem para a combinação `clinica_id + tabela_id + codigo`.
- A inserção só ocorre quando o procedimento ainda nao existe.
- Nenhum registro existente é atualizado ou regravado por esta rotina.

## 8. Snapshot JSON e CSV
- `scripts/easy_particular_atual_snapshot.json` nao foi alterado.
- `Dados/particular_336_procedimentos.csv` nao foi alterado.

## 9. Conta `gleissontel@gmail.com`
- A conta `gleissontel@gmail.com` nao foi alterada por esta etapa.

## 10. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `python -m py_compile backend/services/signup_service.py`

## 11. Onde testar no sistema
- Tela: `Intervenções / Procedimentos > Configura tabela de preços`
- Combo: `Tabelas:`
- Nova conta:
  - conferir `Tabela Exemplo`
  - conferir `PARTICULAR`
  - conferir que `Tabela Exemplo` continua com 56 procedimentos sem preço
  - conferir que `PARTICULAR` continua com 336 procedimentos
  - conferir que `preco`, `custo`, `custo_lab`, `lucro_hora`, `valor_repasse` e `garantia_meses` nascem zerados
  - conferir que `forma_cobranca` continua preservada
  - conferir que nomes e codigos nao foram alterados

