# Intervenções / Procedimentos / Seeds — Subetapa 3A — Correção da duplicidade no signup

## 1. Objetivo
Diagnosticar a falha de `POST /signup/confirm` observada no teste manual com `institutobrana@gmail.com` e aplicar a menor correção segura para evitar duplicidade de procedimento no nascimento de novas contas, preservando a regra funcional de `Tabela exemplo` + `Brana` com 336 procedimentos.

## 2. Erro observado no teste manual
No teste manual, após informar o código de ativação e clicar em confirmar cadastro, a tela retornou `Falha ao confirmar cadastro.`.

No console apareceu:
- `CRIANDO TABELA Tabela Exemplo`
- `CRIANDO TABELA Brana`

Em seguida ocorreu erro 500 em `POST /signup/confirm`, com `psycopg2.errors.UniqueViolation` na restrição `uq_procedimento_clinica_tabela_codigo`.

Chave afetada informada no erro:
- `(clinica_id, tabela_id, codigo) = (13, 1, 1)`

## 3. Diagnóstico da causa
A causa técnica identificada foi a dependência de `_upsert_procedimentos_na_clinica()` de um `tabela_exemplo_id = 1` fixo.

Com a Subetapa 1, o fluxo passou a executar:
- `seed_procedimentos(db, clinica.id)`
- `garantir_procedimentos_padrao_clinica(db, clinica.id)`

O primeiro passo já garante a `Tabela Exemplo` e insere seu seed canônico. O segundo passo tentava reenxergar a `Tabela Exemplo` usando um id fixo, o que tornava o upsert sensível a inconsistências de resolução da tabela e podia tentar reinserir procedimento com a mesma chave `(clinica_id, tabela_id, codigo)`.

A correção aplicada passou a resolver o `id` real da `Tabela Exemplo` da própria clínica antes do upsert.

## 4. Verificação somente leitura de possíveis resíduos da clínica 13
Foi feita consulta somente leitura no banco configurado em `backend/.env`.

Resultado:
- não existe registro de `clinicas.id = 13`;
- não existe clínica com e-mail `institutobrana@gmail.com`;
- não existe usuário com esse e-mail;
- não existem `procedimento_tabela` da clínica 13;
- não existem `procedimento` da clínica 13;
- existem 3 registros em `email_codes` para `institutobrana@gmail.com`, todos `used = false`.

Conclusão objetiva:
- não houve persistência da clínica 13 nem do cadastro;
- o e-mail não ficou estruturalmente preso por usuário/clínica existente;
- os `email_codes` pendentes são resíduos do fluxo abortado de confirmação.

## 5. Arquivos consultados
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/routes/auth_routes.py`

## 6. Arquivos alterados
- `backend/services/signup_service.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`

## 7. Correção aplicada
Foi adicionada em `backend/services/signup_service.py` a função `_resolver_tabela_exemplo_id(db, clinica_id)` para localizar o `id` real da `Tabela Exemplo` da clínica antes do upsert.

Em seguida, `_upsert_procedimentos_na_clinica()` deixou de usar `tabela_exemplo_id = 1` fixo e passou a operar com o `id` resolvido dinamicamente.

A chamada a `garantir_procedimentos_padrao_clinica(db, clinica.id)` foi mantida no signup, porque a correção aqui foi tornar o upsert idempotente no contexto da própria clínica.

## 8. Como a correção evita duplicidade
O upsert agora consulta a Tabela exemplo correta da clínica antes de verificar os procedimentos já existentes.

Isso evita:
- tentativa de inserir procedimentos em tabela errada;
- reprocessamento duplicado do mesmo conjunto de códigos;
- violação de unicidade em `(clinica_id, tabela_id, codigo)`.

## 9. Como a correção preserva Tabela exemplo + Brana
- `seed_procedimentos(db, clinica.id)` continua garantindo a `Tabela Exemplo`.
- `PRIVATE_TABLE_NAME` continua sendo `Brana`.
- `PRIVATE_TABLE_CODE` continua sendo `4`.
- a tabela privada continua sendo criada/garantida no fluxo de nova conta.

## 10. Como a correção preserva os 336 procedimentos
Os 336 procedimentos continuam vindo da trilha já mapeada:
- `Dados/particular_336_procedimentos.csv`
- `scripts/easy_particular_atual_snapshot.json`

A rotina legada `_upsert_procedimentos_particular_na_clinica()` continua sendo a responsável pela materialização da tabela privada.

## 11. Como contas existentes permanecem preservadas
Não houve:
- renomeação retroativa de `PARTICULAR`;
- `UPDATE` em massa;
- `DELETE` em massa;
- gravação em banco nesta etapa;
- criação de nova conta após o erro;
- alteração de clínicas antigas.

## 12. Checks executados
- `python -m py_compile backend\services\signup_service.py`
- `python -m py_compile backend\seeds\procedimentos_padrao.py`
- `python -m compileall backend`

Resultado:
- todos os checks passaram sem erro.

## 13. Situação do e-mail institutobrana@gmail.com após a falha
O e-mail não ficou preso por usuário ou clínica existente, porque não há persistência da clínica 13 nem de usuário associado.

Há, porém, 3 registros pendentes em `email_codes` para `institutobrana@gmail.com`, todos sem uso. Isso é resíduo do fluxo abortado de confirmação e não representa cadastro concluído.

## 14. Onde testar manualmente antes de prosseguir
O próximo teste deve ser manual pelo usuário.
Não executar signup pelo Codex.

Após eventual limpeza segura, se necessária, o usuário deve testar:
- criar nova conta com `institutobrana@gmail.com`;
- confirmar cadastro;
- validar login com senha de login;
- validar que senha interna não entra no login comum;
- validar senha interna em ação sensível;
- validar os 10 perfis padrão;
- validar layout Perfis em cima e Prestadores abaixo;
- validar Tabela exemplo;
- validar Brana;
- validar ausência de PARTICULAR na nova conta;
- validar Brana com 336 procedimentos.

## 15. Próxima subetapa recomendada
Subetapa 3B — limpeza segura e controlada dos registros temporários de `email_codes` do teste abortado, somente se houver autorização operacional, sem afetar contas ou clínicas existentes.
