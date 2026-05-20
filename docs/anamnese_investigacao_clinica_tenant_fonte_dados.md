# Investigação - Clínica, tenant e fonte de dados da Anamnese

## 1. Contexto

A lista de Questionários do módulo Anamnese continua mostrando apenas `Principal`, quando o comportamento esperado é listar também:

- Anamnese de Saúde
- Anamnese pessoal
- Ficha complementar
- Implante
- Principal

Esta etapa foi apenas investigativa. Nenhum código funcional, backend, banco ou endpoint foi alterado.

## 2. Confirmação do diretório correto

Diretório de trabalho confirmado:

- `D:\BRANA ARQUIVOS\BRANA CLOUD`

Verificações feitas:

- o relatório anterior de investigação está no `BRANA CLOUD`
- o caminho antigo `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO` não foi usado para esta investigação
- não houve divergência prática de caminho nesta etapa

## 3. Estado atual do Git

Branch atual:

- `modularizacao-segura-fase-1`

Estado observado:

- `git status --short` ficou apenas com documentos untracked
- `git diff --stat` permaneceu vazio
- `git diff -- frontend/app.js` sem alterações
- `git diff -- frontend/index.html` sem alterações
- `frontend/js/modules/anamnese.js` não existe

Resumo do estado inicial e da inspeção:

- o frontend funcional não estava modificado nesta etapa
- a investigação foi feita sem restaurar ou alterar arquivos de código

## 4. Como a autenticação define `current_user`

Arquivos analisados:

- `backend/security/dependencies.py`
- `backend/routes/auth_routes.py`
- `backend/routes/anamnese_routes.py`
- `backend/models/usuario.py`
- `backend/models/clinica.py`
- `backend/database.py`
- `frontend/app.js`

O que foi confirmado:

- o frontend usa `localStorage["brana_token"]`
- as requisições autenticadas enviam `Authorization: Bearer <token>`
- `/me` existe e usa `get_current_user`
- `get_current_user` depende de `OAuth2PasswordBearer(tokenUrl="login")`
- o usuário autenticado é carregado a partir do token JWT
- o campo de clínica vem de `usuario.clinica_id`
- o endpoint de Anamnese lista questionários filtrando por `current_user.clinica_id`

Sem exposição de segredo, o tipo de fluxo é:

- login gera token
- frontend guarda token
- backend lê o bearer token
- `current_user.clinica_id` controla o tenant

## 5. Usuários e clínicas encontrados

Resultados dos `SELECT`s já executados no banco atual:

Usuários relevantes encontrados:

- `id=1`, `nome=Gleisson Tel`, `clinica_id=1`
- `id=4`, `nome=Alisson Cristóvão Butarelo`, `clinica_id=4`
- `id=8`, `nome=Alisson Cristovão Butarelo`, `clinica_id=1`
- `id=9`, `nome=Jozicler Teodoro Sampaio`, `clinica_id=1`
- `id=10`, `nome=Milene Flor`, `clinica_id=1`
- `id=19`, `nome=Clínica`, `clinica_id=8`
- `id=20`, `nome=Instituto Brana`, `clinica_id=8`

Clínicas encontradas:

- `id=1`, `Instuto Brana - Odontologia`
- `id=4`, `Alisson Cristóvão Butarelo`
- `id=8`, `Instituto Brana`

Usuário provável da sessão:

- não foi possível confirmar com segurança nesta etapa
- o navegador interno abriu a tela de login, sem sessão autenticada utilizável

## 6. Questionários no banco atual

Consulta do banco atual em `anamnese_questionarios`:

- total encontrado: 3 linhas
- nomes encontrados: `Principal`
- clínicas encontradas: `1`, `4`, `8`

Conclusão:

- o banco atual não contém os cinco questionários esperados
- em todas as clínicas verificadas, o questionário presente é apenas `Principal`
- não foi localizada outra clínica com `Anamnese de Saúde`, `Anamnese pessoal`, `Ficha complementar` ou `Implante`

## 7. Endpoint autenticado ou tentativa de autenticação

Endpoint identificado no frontend:

- `GET /anamnese/questionarios`

O que foi observado:

- sem token, o endpoint responde `401 Token nao informado`
- a tentativa de obter a sessão ativa por navegador interno não forneceu um token utilizável
- a página aberta no navegador interno ficou na tela de login

Retorno resumido:

- não foi possível executar uma chamada autenticada válida nesta etapa

## 8. Busca ampla em backups e legado

Fontes consultadas:

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\frontend\app.js`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\*.zip`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\**\anamnese_questionarios.csv`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\**\anamnese_perguntas.csv`
- arquivos locais do Chrome/Edge para tentativa de sessão

Resultado da busca ampla:

- não foi encontrada fonte confiável com os cinco questionários esperados
- os backups acessíveis de `anamnese_questionarios.csv` mostram apenas `Principal`
- os backups acessíveis de `anamnese_perguntas.csv` referenciam apenas o questionário `Principal`
- a busca textual em backups e legado não localizou as strings `Anamnese de Saúde`, `Anamnese pessoal`, `Ficha complementar` ou `Implante` como fonte de dados confiável

Observação sobre a sessão do navegador:

- o `brana_token` apareceu no storage local do Chrome, mas a leitura binária não permitiu extrair um token autenticável de forma segura
- o navegador interno do Codex abriu a aplicação na tela de login, sem sessão reaproveitável

## 9. Comparação da fonte encontrada com o banco atual

Comparação possível:

- banco atual: apenas `Principal`
- backups acessíveis: apenas `Principal`
- legado acessível: sem fonte confiável dos cinco questionários

Conclusão da comparação:

- não apareceu discrepância do tipo "backup com cinco questionários vs banco atual com só Principal"
- a evidência atual aponta ausência da fonte nos backups acessíveis também

## 10. Diagnóstico provável

Classificação mais provável, com base nas evidências:

- dados ausentes no banco atual
- também ausentes nos backups acessíveis já consultados
- filtro por clínica/tenant não pôde ser validado por sessão autenticada
- cache/localStorage não foi confirmado como causa
- frontend e backend mostraram o fluxo correto de tenant por `clinica_id`, sem alteração funcional nesta etapa

Resumo honesto:

- o problema não parece ser causado por uma restauração ou alteração recente já identificável no frontend desta etapa
- a fonte confiável dos cinco questionários não foi localizada

## 11. Plano seguro recomendado

Plano recomendado, sem executar ainda:

1. Criar backup do banco atual antes de qualquer alteração de dados.
2. Confirmar a sessão autenticada real no navegador do usuário.
3. Executar `GET /me` e `GET /anamnese/questionarios` com autenticação válida.
4. Comparar o `clinica_id` da sessão com os registros do banco.
5. Se um backup confiável com os cinco questionários aparecer depois, restaurar apenas os registros ausentes com validação prévia.
6. Se a sessão correta mostrar apenas `Principal` no endpoint, investigar o caminho de criação/filtragem de dados antes de qualquer importação.

## 12. O que NÃO foi alterado

Confirmado:

- `frontend/app.js` não foi alterado
- `frontend/index.html` não foi alterado
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum dado foi inserido
- nenhum dado foi atualizado
- nenhum dado foi apagado

## 13. Checks executados

Checks executados nesta etapa:

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `node --check frontend/app.js`
- leitura dos arquivos de frontend e backend citados acima
- consulta `SELECT` no banco atual
- busca em backups e legado
- tentativa de leitura de armazenamento local do navegador

## 14. Próximo teste recomendado

Se o usuário quiser validar o estado atual antes de qualquer nova ação:

1. Fazer `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir Anamnese.
4. Abrir lista de Questionários.
5. Confirmar se continua aparecendo apenas `Principal`.

Esse teste neste momento só confirma o estado atual, não corrige a causa.

## 15. Confirmação final

Confirmações:

- etapa apenas investigativa
- sem commit
- sem alteração funcional
- sem alteração de banco
- sem alteração de backend
- sem alteração de endpoints

