# Intervenções / Procedimentos / Seeds — Subetapa 2 — Validação técnica sem gravação

## 1. Objetivo
Validar, somente por leitura e checks de sintaxe, se a correção da Subetapa 1 está coerente para novas contas, sem criar clínica, sem criar conta, sem executar signup real e sem gravar banco.

## 2. Escopo da validação
- Somente leitura de código e documentação.
- Somente checks locais de sintaxe.
- Sem gravação em banco.
- Sem criação real de conta.
- Sem criação de clínica.
- Sem migration.
- Sem UPDATE/INSERT/DELETE manual.
- Sem renomeação retroativa de contas antigas.
- Sem avanço para teste final.

## 3. Subetapas anteriores consultadas
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`

## 4. Arquivos validados
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`

## 5. Validação do nome Brana em novas contas
O nome técnico ficou coerente para novas contas:

- `PRIVATE_TABLE_NAME = "Brana"` em `backend/services/signup_service.py`.
- O fluxo de signup usa essa constante ao garantir a tabela privada.
- A mudança é localizada no fluxo de nascimento de novas contas, não em clínicas antigas.

## 6. Validação da preservação da Tabela exemplo
A Tabela exemplo continua preservada porque:

- `seed_procedimentos(db, clinica_id)` ainda garante a tabela com `codigo = 1` e nome `Tabela Exemplo`.
- O seed canônico continua sendo a origem da Tabela exemplo.
- A lógica da Tabela exemplo não foi substituída pela tabela privada.
- Não há evidência de duplicidade funcional da Tabela exemplo no fluxo validado.

## 7. Validação da materialização dos 336 procedimentos
A materialização dos 336 procedimentos continua coerente porque:

- a trilha de origem permanece em `Dados/particular_336_procedimentos.csv`;
- o snapshot legada continua em `scripts/easy_particular_atual_snapshot.json`;
- `_upsert_procedimentos_particular_na_clinica()` continua sendo a rotina responsável por materializar a tabela privada;
- a rotina usa `procedimento.tabela_id` como vínculo real da tabela privada;
- `PRIVATE_TABLE_CODE = 4` foi preservado, mantendo a compatibilidade do vínculo.

## 8. Validação de ausência de impacto em contas existentes
As contas existentes permanecem preservadas porque:

- não houve execução de signup real;
- não houve gravação em banco;
- não houve UPDATE em massa;
- não houve renomeação retroativa;
- não houve mudança de rotina para migrar clínicas antigas;
- a lógica alterada está restrita ao nascimento de novas contas.

## 9. Validação específica de backend\seeds\procedimentos_padrao.py
A alteração em `backend/seeds/procedimentos_padrao.py` foi tecnicamente segura para a regra nova porque:

- preserva a criação da Tabela exemplo;
- garante a tabela privada no mesmo ciclo de seed;
- usa o mesmo `codigo = 4` necessário ao vínculo histórico;
- não duplica manualmente a lista de 336 procedimentos;
- não altera o conteúdo da Tabela exemplo;
- não executa gravação fora do fluxo de nova conta.

## 10. Checks executados
- `python -m py_compile backend\services\signup_service.py`
- `python -m py_compile backend\seeds\procedimentos_padrao.py`
- `python -m compileall backend`

Resultado:
- todos os checks passaram sem erro.

## 11. Riscos remanescentes
- A validação ainda é técnica e não funcional.
- O signup real não foi executado nesta subetapa.
- Um teste final autorizado ainda é necessário para confirmar o comportamento em runtime.
- Se houver outro caminho externo ao signup para criar tabela privada, ele não foi exercitado aqui.

## 12. Onde testar no sistema antes de prosseguir
No teste final, criar nova conta com institutobrana@gmail.com somente após autorização explícita.
Validar no módulo Intervenções / Procedimentos:
- existe Tabela exemplo;
- existe Brana;
- não existe PARTICULAR na nova conta;
- Brana contém 336 procedimentos;
- contas antigas continuam mantendo PARTICULAR quando já existia.

## 13. Próxima subetapa recomendada
Subetapa 3 — Teste final controlado criando nova conta com institutobrana@gmail.com para validar login/senha interna, Perfis de acesso e Intervenções / Procedimentos com Tabela exemplo + Brana + 336 procedimentos.
