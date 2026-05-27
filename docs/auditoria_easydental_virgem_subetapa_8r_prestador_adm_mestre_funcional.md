# Auditoria EasyDental virgem — Subetapa 8R — prestador ADM/Mestre funcional em novas contas

## 1. Contexto

- A Subetapa 8P corrigiu os seeds das tabelas de procedimentos/preços.
- A Unidade Principal / 0001 já nasceu corretamente nas novas contas.
- O erro de signup causado por `PRIVATE_TABLE_NAME` ausente foi corrigido.
- O login de contas antigas voltou a funcionar.
- O teste manual de nova conta avançou, mas revelou uma lacuna funcional no módulo de prestadores.
- No EasyDental virgem, o módulo Prestadores nasce com `Clínica` e `Mestre`.
- No Brana, a nova conta estava nascendo com o prestador sistêmico `Clínica`, mas sem o prestador funcional equivalente ao `Mestre`.
- Esta subetapa não altera a nomenclatura geral do Brana para `Mestre`.

## 2. Regra contratual adicionada

- A nova conta Brana continua nascendo com o prestador sistêmico `Clínica`.
- Além dele, a nova conta passa a nascer com um prestador ADM/Mestre funcional.
- O prestador ADM representa funcionalmente o `Mestre` do EasyDental.
- O nome do prestador ADM vem do nome informado no cadastro da conta.
- O tipo do prestador ADM é `Cirurgião dentista`.
- A regra vale apenas para novas contas.
- Contas existentes permanecem inalteradas.

## 3. Diagnóstico técnico

- Antes desta subetapa, o fluxo de signup já criava o prestador sistêmico `Clínica` e o usuário admin inicial.
- O modelo `PrestadorOdonto` possui `clinica_id`, `source_id`, `usuario_id`, `codigo`, `nome`, `apelido`, `tipo_prestador`, `inativo`, `executa_procedimento` e `is_system_prestador`.
- O tipo `Cirurgião dentista` já existe no catálogo do projeto e é usado em outros pontos do código.
- O novo prestador ADM foi modelado como um registro funcional e não como renomeação do prestador sistêmico.
- O prestador ADM foi implementado com `source_id=1` e `codigo=002`, preservando o `source_id=255` do prestador sistêmico `Clínica`.
- O vínculo com o usuário admin inicial foi aplicado, porque era seguro e não quebra login nem permissões.
- A unidade Principal / 0001 permaneceu sem alteração.

## 4. Implementação

- Arquivo alterado:
  - `backend/services/signup_service.py`
- Helper criado:
  - `_garantir_prestador_adm_funcional_clinica(db, clinica_id, nome_conta, usuario_admin=None)`
- Regra anti-duplicidade:
  - procura `PrestadorOdonto` por `clinica_id` + `source_id=1`;
  - reaproveita o registro se ele já existir;
  - não renomeia prestadores existentes fora desse contexto de nova conta.
- Regra de nome:
  - usa o nome informado no cadastro da conta.
- Regra de tipo:
  - define `tipo_prestador = "Cirurgião dentista"`.
- Regra de vínculo:
  - o usuário admin inicial novo recebe `prestador_id` apontando para o prestador ADM;
  - o prestador ADM recebe `usuario_id` apontando para o admin inicial;
  - isso foi aplicado de forma idempotente.
- O prestador sistêmico `Clínica` foi preservado.

## 5. Fora de escopo

- Renomear Brana para `Mestre`.
- Renomear `Clínica`.
- Permissões.
- Setup e senha interna.
- Texto da tela de setup.
- TISS.
- Seeds e tabelas de procedimentos da 8P.
- Unidade Principal / 0001.
- Frontend.
- Contas existentes.

## 6. Checks executados

- `git status --short`
- `python -m py_compile backend/services/signup_service.py`
- Import seguro do módulo de signup no ambiente Python do projeto.
- Leitura do modelo `backend/models/prestador_odonto.py`.
- Leitura dos contratos anteriores sobre usuários/prestadores e unidade.

## 7. Teste manual obrigatório

- Criar nova conta limpa.
- Abrir o módulo Prestadores.
- Verificar que existe o prestador `Clínica`.
- Verificar que existe o prestador ADM com o nome usado no cadastro da conta.
- Verificar que o prestador ADM tem tipo `Cirurgião dentista`.
- Verificar que a unidade Principal / 0001 continua correta.
- Verificar que as tabelas de procedimentos continuam corretas.
- Verificar que `Tabela Exemplo` não nasce.
- Verificar que setup não foi alterado.
- Verificar que conta antiga não foi alterada.

## 8. Riscos e rollback

- Risco de duplicar prestador em nova conta.
- Risco de vínculo errado com o usuário admin.
- Risco de tipo incorreto.
- Risco de reentrância em signup parcial.
- Mitigação: helper idempotente por `clinica_id` + `source_id`, com vínculo explícito ao admin inicial.
- Rollback: novo commit revertendo apenas esta alteração.
- Se uma conta de teste ficar incorreta, ela deve ser tratada pelo procedimento seguro de exclusão, não por remoção manual improvisada.

## 9. Próxima subetapa recomendada

- Validar manualmente a nova conta após o nascimento do prestador ADM/Mestre funcional.
- Se houver falha, abrir correção pequena e isolada.
- Não avançar para setup/senha interna até validar essa etapa.
