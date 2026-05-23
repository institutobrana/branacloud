# Intervenções / Procedimentos / Seeds — Subetapa 1 — Correção controlada da tabela Brana em novas contas

## 1. Objetivo
Registrar a correção controlada do nascimento da tabela privada de procedimentos em novas contas/clínicas, substituindo a antiga referência legada de PARTICULAR por Brana apenas no fluxo de criação de novas contas.

## 2. Escopo da correção
- Correção somente para novas contas/clínicas.
- Não altera clínicas existentes.
- Não renomeia PARTICULAR em contas antigas.
- Não altera banco diretamente.
- Não executa migration.
- Não cria clínica de teste.
- Não executa signup real.
- Não faz UPDATE em massa.
- Não faz git add, commit ou push.

## 3. Subetapa 0 consultada
Consultada e validada:

- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`

## 4. Arquivos consultados
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`

## 5. Arquivos alterados
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`

## 6. Alteração realizada
- O nome técnico da tabela privada passou a nascer como `Brana` no fluxo de novas contas.
- O signup de nova clínica passou a acionar a rotina idempotente que materializa a tabela privada com os 336 procedimentos.
- A criação da tabela base foi mantida e a Tabela exemplo continua nascendo no mesmo fluxo.
- O nome interno legado da função `_upsert_procedimentos_particular_na_clinica()` foi preservado por segurança.

## 7. Como a correção preserva contas existentes
- A alteração vale apenas para o fluxo de nascimento de novas contas.
- O código de busca da tabela privada continua usando `codigo = 4`, então uma clínica antiga que já tenha PARTICULAR não é renomeada por esta etapa.
- Não houve script de massa nem atualização retroativa.
- Nenhuma clínica já criada foi tocada.

## 8. Como a correção garante Brana em novas contas
- `backend/seeds/procedimentos_padrao.py` passou a garantir a tabela privada com nome `Brana` no nascimento.
- `backend/services/signup_service.py` passou a tratar a tabela privada como `Brana` no fluxo de signup.
- O fluxo de criação de nova clínica agora chama a rotina que materializa a tabela privada após o seed base.

## 9. Como a correção garante ou preserva a materialização dos 336 procedimentos
- A origem dos 336 procedimentos continua sendo a trilha já mapeada:
  - `Dados/particular_336_procedimentos.csv`
  - `scripts/easy_particular_atual_snapshot.json`
- A materialização continua ocorrendo pela rotina `_upsert_procedimentos_particular_na_clinica()`.
- A rotina foi reutilizada, sem duplicar manualmente a lista.
- O vínculo continua dependente de `procedimento.tabela_id`.

## 10. Checks executados
- `python -m py_compile backend\services\signup_service.py`
- `python -m py_compile backend\seeds\procedimentos_padrao.py`

## 11. Riscos remanescentes
- O fluxo real de signup ainda não foi executado nesta etapa.
- A validação funcional final depende de teste manual autorizado em nova conta.
- Se houver outro caminho operacional fora do signup para criação de tabelas de procedimentos, ele não foi exercitado aqui.

## 12. Onde testar antes de prosseguir
Testar criando uma nova conta com o e-mail institutobrana@gmail.com somente depois da autorização para teste final.

No teste final validar:
- nova conta nasce com Tabela exemplo;
- nova conta nasce com Brana;
- nova conta não nasce com PARTICULAR;
- Brana contém 336 procedimentos;
- contas antigas continuam podendo manter PARTICULAR.

## 13. Próxima subetapa recomendada
Subetapa 2 — Validação técnica sem criação real de conta, com checks de sintaxe e, se possível, simulação/dry-run sem gravação para confirmar que novas contas receberiam Tabela exemplo + Brana com 336 procedimentos.
