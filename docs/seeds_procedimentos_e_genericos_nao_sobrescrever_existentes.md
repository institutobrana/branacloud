# Seeds de Procedimentos e Genericos - Nao sobrescrever existentes

## 1. Objetivo
Registrar a regra aplicada aos seeds de novas contas para que procedimentos genericos e procedimentos padrao continuem nascendo sanitizados, mas sem sobrescrever registros ja existentes.

## 2. Arquivos de codigo afetados
- `backend/seeds/procedimentos_genericos.py`
- `backend/seeds/procedimentos_padrao.py`

## 3. Funcoes afetadas
- `seed_procedimentos_genericos(db, clinica_id)`
- `seed_procedimentos(db, clinica_id)`

## 4. Regra aplicada
- Inserir novos registros sanitizados.
- Ignorar registros existentes.
- Nao sobrescrever dados reais de usuarios.

## 5. Procedimentos Genericos
- Preserva `codigo`, `descricao` e `clinica_id`.
- Zera ou nulifica campos nao minimos conforme o schema permitir.
- Nao regrava registros existentes por `clinica_id + codigo`.

## 6. Tabela Exemplo / Procedimentos padrao
- Preserva `codigo`, `nome`, `clinica_id` e `tabela_id`.
- Zera ou nulifica campos nao minimos conforme o schema permitir.
- Nao regrava registros existentes por `clinica_id + tabela_id + codigo`.
- Nao cria heranca pronta via `procedimento_generico_codigo`.

## 7. Relacao com o contrato
- A alteracao segue `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`.

## 8. Riscos reduzidos
- Reexecucao acidental nao sobrescreve dados de usuario.
- Contas existentes nao sao regravadas.

## 9. Onde testar
- Criar nova conta de teste.
- Abrir `Intervencoes / Procedimentos > Configura tabela de precos`.
- Conferir `Tabela Exemplo`.
- Conferir `Procedimentos Genericos`.
- Reexecutar o seed em ambiente seguro e confirmar que registros existentes nao sao sobrescritos.

## 10. Checks ja executados
- `python -m py_compile backend/seeds/procedimentos_genericos.py backend/seeds/procedimentos_padrao.py`: `OK`
