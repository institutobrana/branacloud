# Intervenções / Procedimentos / Seeds — Subetapa 3D — Correção da duplicidade do código 1010 no signup

## 1. Objetivo
Corrigir de forma mínima e segura a duplicidade remanescente observada no `POST /signup/confirm` durante o nascimento de novas contas, sem criar conta, sem alterar banco fora desta edição de código e sem afetar contas existentes.

## 2. Erro observado no novo teste manual
No novo teste manual com `institutobrana@gmail.com`, a confirmação do cadastro falhou novamente com:
- `Falha ao confirmar cadastro.`
- `signup/confirm: 500 Internal Server Error`

O erro principal foi:
- `psycopg2.errors.UniqueViolation`
- restrição `uq_procedimento_clinica_tabela_codigo`
- chave `(clinica_id, tabela_id, codigo) = (14, 69, 1010)`

Procedimento informado no stack:
- `codigo = 1010`
- `nome = Selante por elemento`
- `tabela_id = 69`
- `clinica_id = 14`

## 3. Diferença em relação ao erro anterior
O erro anterior estava associado ao `tabela_id = 1`. Nesta nova tentativa, o sistema chegou a criar `Tabela Exemplo` e `Brana`, mas a duplicidade apareceu em outra tabela real da clínica, `tabela_id = 69`, com o código `1010`.

Isso mostrou que a correção anterior avançou, mas ainda havia uma falha de idempotência no caminho de seed/upsert de procedimentos.

## 4. Diagnóstico da causa
A causa técnica mais segura identificada foi a falta de atualização do mapa `existentes` logo após novos `INSERT`s nos fluxos de seed/upsert.

Na prática:
- o fluxo cria a tabela padrão da nova clínica;
- percorre a lista de procedimentos;
- mas, se o mesmo código reaparecer na mesma execução ou se o seed for atravessado de novo no mesmo contexto transacional, o mapa inicial de existência não “aprende” sobre o item recém-inserido a tempo de impedir uma nova tentativa de `INSERT`.

Foi verificado também que o arquivo local `backend/seeds/procedimentos_padrao.py` não contém o literal `1010`, então a causa não foi confirmada como duplicidade textual nesse arquivo. O problema ficou caracterizado como falha de idempotência do upsert/seed no fluxo de signup.

## 5. Verificação somente leitura de possíveis resíduos da clínica 14
Consulta somente leitura no banco configurado em `backend/.env`.

Resultado:
- `clinicas.id = 14`: não existe
- clínica com e-mail `institutobrana@gmail.com`: não existe
- usuário com esse e-mail: não existe
- `procedimento_tabela` da clínica 14: não existe
- `procedimento` da clínica 14: não existe
- `prestador_odonto` da clínica 14: não existe
- `access_profile` da clínica 14: não existe

Conclusão:
- a clínica 14 não ficou persistida;
- o cadastro falhou antes de concluir;
- não houve resíduo de clínica/usuário/procedimentos/prestadores/perfis na tentativa abortada.

## 6. Verificação somente leitura de email_codes para institutobrana@gmail.com
Resultado da leitura:
- quantidade encontrada: 1
- ID encontrado: 25
- `used = false`
- `purpose = signup`
- `expires_at = 2026-05-23 18:41:47.297691`
- `created_at = 2026-05-23 15:31:47.297773-03:00`

Conclusão:
- o e-mail não ficou preso por clínica/usuário;
- existe apenas 1 código temporário pendente do teste abortado.

## 7. Arquivos consultados
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`
- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/routes/auth_routes.py`

## 8. Arquivos alterados
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md`

## 9. Correção aplicada
Ajustei os fluxos de inserção para registrar imediatamente no mapa em memória o procedimento recém-criado:
- em `backend/seeds/procedimentos_padrao.py`, o `seed_procedimentos()` passa a registrar o novo item em `existentes` assim que adiciona o procedimento;
- em `backend/services/signup_service.py`, `_upsert_procedimentos_na_clinica()` passa a registrar o novo item em `existentes` após inserir;
- em `backend/services/signup_service.py`, `_upsert_procedimentos_particular_na_clinica()` também passa a registrar o novo item em `existentes` após inserir.

## 10. Como a correção evita duplicidade por clinica_id + tabela_id + codigo
A correção mantém a chave lógica de unicidade alinhada ao banco:
- `clinica_id`
- `tabela_id`
- `codigo`

Assim que um procedimento novo entra no fluxo, ele passa a existir também no mapa de memória da própria execução, evitando que uma repetição do mesmo código na mesma transação tente novo `INSERT`.

## 11. Como a correção preserva Tabela exemplo + Brana
Preservado:
- `PRIVATE_TABLE_NAME = "Brana"`
- `PRIVATE_TABLE_CODE = 4`
- criação da `Tabela Exemplo`
- criação da `Brana` para novas contas

O fluxo continua separado:
- `seed_procedimentos()` garante a `Tabela Exemplo`;
- `garantir_procedimentos_padrao_clinica()` garante a tabela privada `Brana` e os procedimentos privados;
- contas antigas continuam sem renomeação retroativa.

## 12. Como a correção preserva os 336 procedimentos
A trilha dos 336 procedimentos permanece a mesma:
- `Dados/particular_336_procedimentos.csv`
- `scripts/easy_particular_atual_snapshot.json`

A rotina legada `_upsert_procedimentos_particular_na_clinica()` continua sendo a responsável pela materialização da tabela privada, agora com proteção adicional contra repetição de `INSERT` na mesma execução.

## 13. Como contas existentes permanecem preservadas
Não houve:
- renomeação retroativa de `PARTICULAR`;
- `UPDATE` em massa;
- `DELETE` em massa;
- alteração de clínicas antigas;
- criação de conta real nesta etapa;
- gravação de banco por esta edição.

## 14. Checks executados
Executados com sucesso:
- `python -m py_compile backend\services\signup_service.py`
- `python -m py_compile backend\seeds\procedimentos_padrao.py`
- `python -m compileall backend`

Resultado:
- sem erro de sintaxe após a correção.

## 15. Situação do e-mail institutobrana@gmail.com após a falha
O e-mail não ficou preso por clínica ou usuário persistido, mas ainda restou 1 `email_code` temporário pendente do teste abortado (`id = 25`, `used = false`).

## 16. Se será necessária nova limpeza segura de email_codes
Sim, pode ser necessária nova limpeza segura e separada do `email_codes` pendente antes de um novo teste manual, porque ainda existe 1 registro temporário do teste abortado.

## 17. Onde testar manualmente antes de prosseguir
O próximo teste deve ser manual pelo usuário.
Não executar signup pelo Codex.

Após eventual limpeza segura, se necessária, o usuário deve testar:
- criar nova conta com `institutobrana@gmail.com`;
- confirmar cadastro sem erro 500;
- validar login com senha de login;
- validar que senha interna não entra no login comum;
- validar senha interna em ação sensível;
- validar os 10 perfis padrão;
- validar layout Perfis em cima e Prestadores abaixo;
- validar Tabela exemplo;
- validar Brana;
- validar ausência de PARTICULAR na nova conta;
- validar Brana com 336 procedimentos.

## 18. Próxima subetapa recomendada
Subetapa 3E — limpeza segura do `email_codes` residual do teste abortado, seguida da validação manual combinada dos Problemas 1 e 2.
