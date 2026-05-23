# Intervenções / Procedimentos / Seeds — Subetapa 3E — Diagnóstico pós-teste manual combinado

## 1. Objetivo
Registrar, apenas por leitura, o estado do Git, da nova clínica criada no teste manual e do fluxo de seed de procedimentos após o teste combinado dos Problemas 1 e 2, sem alterar código, banco ou documentos existentes.

## 2. Contexto do teste manual
O teste manual combinado foi executado pelo usuário com `institutobrana@gmail.com`.

Resultado observado:
- o Problema 1 foi validado manualmente;
- o login com senha de login funcionou;
- a senha interna ficou separada da senha de login;
- a nova clínica foi criada com sucesso;
- o Problema 2 ainda ficou incorreto;
- `Tabela exemplo` nasceu com 681 procedimentos;
- `Brana` nasceu com 0 procedimentos;
- a nova conta não nasceu com `PARTICULAR`.

## 3. Confirmação de que o Problema 1 foi validado manualmente
Pelo estado atual do banco e pela observação do teste, a nova conta `institutobrana@gmail.com` foi criada com:
- login funcionando;
- senha interna separada;
- `setup_completed = true`;
- `senha_interna_hash` preenchida.

Isso confirma o Problema 1 como funcionalmente validado no teste manual recente.

## 4. Descrição do erro atual do Problema 2
O Problema 2 não foi resolvido funcionalmente.

Estado observado na nova clínica:
- `Tabela exemplo` = 681 procedimentos;
- `Brana` = 0 procedimentos;
- não existe `PARTICULAR` nessa nova conta;
- o esperado era `Tabela exemplo` com seu conjunto próprio e `Brana` com os 336 procedimentos privados.

## 5. Observação do Problema 3 mojibake/UTF-8 sem correção
Foram observados nomes de procedimentos com mojibake/encoding quebrado em várias amostras do banco, por exemplo:
- `Amputaç釅...`
- `Pr┤ese...`
- `CIMENTAÇÃO...` com acentuação inconsistênte em algumas entradas

Isso foi apenas registrado como observação. Nenhuma correção textual foi feita nesta etapa, em respeito a `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

## 6. Observação do Problema 4 Git atrasado/desorganizado
O Git segue com:
- 8 arquivos tracked modificados já existentes antes desta etapa;
- muitos untracked antigos e de trilhas paralelas;
- documentação de Problemas 1, 2, exclusões seguras e auditorias auxiliares espalhada no workspace.

Nesta etapa não houve `git add`, `git commit`, `git push`, `git reset`, `git restore` ou `git clean`.

## 7. Comandos de leitura executados
Comandos somente leitura executados nesta Subetapa 3E:
- `git branch --show-current`
- `git status --short`
- `git diff --name-only`
- `git diff --stat`
- `git log --oneline -20`
- `Get-Content` em documentos de blindagem, auditoria e subetapas anteriores
- `Get-Content` em `backend/services/signup_service.py`
- `Get-Content` em `backend/seeds/procedimentos_padrao.py`
- `Get-Content` em `backend/models/procedimento.py`
- `Get-Content` em `backend/models/procedimento_tabela.py`
- `Get-Content` em `backend/routes/procedimentos_routes.py`
- `Get-Content` em `backend/database.py`
- `Get-Content` em `backend/.env`

## 8. SELECTs executados
SELECTs somente leitura executados no PostgreSQL local `brana_saas`:
- busca da clínica por e-mail `institutobrana@gmail.com`;
- busca da clínica mais recente por `id`;
- busca de usuários por e-mail e por `clinica_id`;
- listagem das tabelas `procedimento_tabela` da clínica nova;
- contagem de procedimentos por tabela;
- verificação de duplicidade por `clinica_id + tabela_id + codigo`;
- verificação de duplicidade por `clinica_id + tabela_id + nome`;
- verificação de `procedimento` cruzado entre clínicas;
- verificação de `email_codes` do e-mail do teste;
- consulta de metadados de colunas de `clinicas` e `usuarios`.

## 9. Identificação da clínica criada
Clínica recém-criada identificada:
- `clinica_id = 15`
- nome: `Tel`
- e-mail: `institutobrana@gmail.com`
- `criado_em = 2026-05-23 15:44:57.179972-03:00`
- `data_ativacao = null`
- `ativo = true`
- `trial_ate = 2026-05-30 18:44:57.184422`
- `nome_tabela_procedimentos = Tabela Exemplo`

Usuário principal/admin encontrado:
- `usuario_id = 35`
- nome: `Tel`
- e-mail: `institutobrana@gmail.com`
- `is_admin = true`
- `setup_completed = true`
- `senha_interna_hash` preenchida

Também existe o usuário de sistema da clínica:
- `usuario_id = 34`
- e-mail de sistema: `clinica.255.c15@system.brana.local`

## 10. Tabelas de procedimentos encontradas
Tabelas reais da clínica 15:
- `id = 71`, `codigo = 1`, `nome = Tabela Exemplo`
- `id = 72`, `codigo = 4`, `nome = Brana`

Não existe `PARTICULAR` na clínica nova.

## 11. Contagem por tabela
Contagem observada na clínica 15:
- total de procedimentos da clínica: 681
- `Tabela exemplo` (`tabela_id = 71`): 681
- `Brana` (`tabela_id = 72`): 0

Não foram encontrados outros `tabela_id` na clínica 15.

## 12. Análise de duplicidades
Resultado dos SELECTs de duplicidade:
- não houve duplicidade real de `clinica_id + tabela_id + codigo`;
- não houve duplicidade real de `codigo` dentro da mesma clínica;
- houve duplicidade de nomes em `Tabela exemplo`, por exemplo:
  - `Pulpotomia`
  - `Ulectomia`
  - `Alveoloplastia`
  - `Attachment`
  - `Bandagem (Tubo bracket)`
  - `Bracket (Bracket 0,18" x 0,25")`
  - `Bridectomia`
  - `Controle de placa bacteriana`

Conclusão:
- o problema não é uma violação clássica de chave duplicada nesta nova clínica;
- o problema é de direcionamento/seed do conteúdo da tabela.

## 13. Análise de mistura entre clínicas
Não foi encontrada mistura entre clínicas:
- nenhum `procedimento` da clínica 15 aponta para `tabela_id` de outra clínica;
- nenhum `procedimento` de outra clínica aponta para `tabela_id` da clínica 15;
- os `tabela_id` da clínica 15 pertencem realmente à clínica 15.

Portanto, não houve cópia indevida cruzando `clinica_id`.

## 14. Amostras relevantes dos 681 procedimentos
Amostras da `Tabela exemplo` da clínica 15:
- primeiros códigos: `1` a `30`
- últimos códigos observados: `9050`, `9040`, `9030`, `9020`, `9010`, `9000`, `8500`, `8490`, `8482`, `8481`, `8480`, `8470`, `8460`, `8450`, `8440`, `8430`, `8420`, `8410`, `8400`, `8390`, `8380`, `8370`, `8361`, `8360`, `8350`, `8340`, `8330`, `8320`, `8315`, `8310`

Observação textual:
- há mojibake em vários nomes retornados pelo banco;
- isso foi apenas registrado, sem correção.

Leitura funcional da amostra:
- a `Tabela exemplo` contém itens de várias faixas de código, inclusive itens que parecem pertencer ao universo privado/estético;
- isso indica conteúdo misturado na tabela errada da nova clínica.

## 15. Análise do fluxo de código
Trechos-chave observados:
- `backend/services/signup_service.py`:
  - `criar_conta_saas()` chama `seed_procedimentos(db, clinica.id)`
  - depois chama `garantir_procedimentos_padrao_clinica(db, clinica.id)`
  - `seed_procedimentos()` garante `Tabela Exemplo` e `Brana`
  - `_upsert_procedimentos_na_clinica()` escreve sempre na `Tabela Exemplo`
  - `_upsert_procedimentos_particular_na_clinica()` escreve na tabela privada `PRIVATE_TABLE_CODE = 4`
  - `_carregar_seed_procedimentos()` usa seed hospedado se existir; caso contrário, cai para o seed por clínica
  - no checkout atual, os arquivos de seed hospedado/particular referenciados pelo código não foram encontrados localmente, então a trilha particular resolve vazia
- `backend/seeds/procedimentos_padrao.py`:
  - `seed_procedimentos()` garante `Tabela Exemplo`
  - `seed_procedimentos()` garante `Brana` como tabela
  - o `PROCEDIMENTOS_PADRAO` local tem apenas 56 entradas
- `backend/routes/procedimentos_routes.py`:
  - o route usa `_codigo_tabela_do_procedimento()` com `clinica_id + tabela_id` da própria clínica
  - não foi encontrado cruzamento entre clínicas no route

Hipótese técnica mais provável:
- o signup está executando duas trilhas de seed para novas contas:
  - a trilha canônica local de `Tabela Exemplo` com 56 itens;
  - a trilha adicional de `garantir_procedimentos_padrao_clinica()` que puxa outro seed e o direciona para `Tabela Exemplo`;
- ao mesmo tempo, a trilha privada de `Brana` não encontra sua fonte de dados no checkout atual e fica vazia;
- o resultado final é `Tabela exemplo = 681` e `Brana = 0`.

## 16. Hipótese técnica mais provável
A causa mais provável do estado final observado é:
- o fluxo de signup está aplicando um seed adicional de procedimentos à `Tabela Exemplo`, sem separar corretamente o conteúdo privado da `Brana`;
- a fonte particular esperada para `Brana` não está sendo carregada neste checkout, então a tabela é criada mas não recebe procedimentos;
- não houve duplicidade de chave `clinica_id + tabela_id + codigo`, mas houve direcionamento incorreto do conteúdo para a tabela errada.

## 17. Recomendação da próxima subetapa
Subetapa 3F — correção controlada para separar definitivamente:
- `Tabela exemplo` com seu seed próprio;
- `Brana` com os 336 procedimentos privados;
- sem alterar contas existentes e sem renomeação retroativa de `PARTICULAR`.

## 18. Onde testar depois da futura correção
Depois da próxima correção, o teste deve voltar a ser manual com `institutobrana@gmail.com`, validando:
- criação sem erro 500;
- login com senha de login;
- senha interna separada;
- `Tabela exemplo` com seu seed correto;
- `Brana` com 336 procedimentos;
- ausência de `PARTICULAR` na nova conta.

## 19. Confirmação de que nada foi alterado além deste documento
Nesta Subetapa 3E:
- nenhum código foi alterado;
- nenhum banco foi alterado;
- nenhum `UPDATE`, `DELETE` ou `INSERT` foi executado;
- nenhuma clínica foi criada;
- nenhum `email_codes` foi limpo;
- nenhum frontend foi modificado.

## 20. Confirmação de blindagem textual/mojibake
As strings com mojibake foram apenas observadas e registradas.
Não houve correção textual, normalização de acentos, reescrita de labels ou alteração de mensagens nesta etapa.
