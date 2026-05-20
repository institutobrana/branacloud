# Roteiro de extração SQL Server - Anamnese EDS70

## 1. Contexto

Os arquivos `eds70.bak` e `eds70dat.mdf` contêm, por busca binaria, strings relacionadas aos cinco questionarios esperados da Anamnese:

- Principal
- Implante
- Ficha complementar
- Anamnese de Saude
- Anamnese pessoal

Tambem foi localizada a conta `gleissontel@gmail.com`.

No PostgreSQL atual do Brana Cloud:

- a conta `gleissontel@gmail.com` esta na `clinica_id = 1`
- a clinica e `Instuto Brana - Odontologia`
- o endpoint autenticado retorna apenas `Principal`

## 2. Objetivo

Extrair os dados de Anamnese de um ambiente SQL Server isolado, sem alterar o PostgreSQL atual.

Este roteiro cobre:

- restauracao controlada do `.bak` em instancia temporaria
- alternativa de attach do `.mdf` em copia isolada
- descoberta das tabelas reais
- exportacao de questionarios, perguntas e resumo de respostas
- comparacao futura com o PostgreSQL atual

## 3. Estado inicial do projeto atual

Registro do estado atual do projeto Brana Cloud:

- branch: `modularizacao-segura-fase-1`
- `git status --short`: somente docs untracked
- `git diff --stat`: vazio
- `git diff -- frontend/app.js`: vazio
- `git diff -- frontend/index.html`: vazio
- `node --check frontend/app.js`: OK

Confirmacao:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend funcional nao foi alterado
- banco atual nao foi alterado

## 4. Fontes SQL Server localizadas

### `eds70.bak`

- caminho: `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70.bak`
- tamanho: `2105229824` bytes
- data de modificacao: `03/03/2026 07:32:36`
- assinatura detectada: `TAPE`
- tipo: backup SQL Server

### `eds70dat.mdf`

- caminho: `D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70dat.mdf`
- tamanho: `2109210624` bytes
- data de modificacao: `08/03/2026 06:44:20`
- assinatura detectada: arquivo de dados SQL Server
- tipo: MDF SQL Server

## 5. Ambiente isolado recomendado

Recomendacao:

- usar SQL Server Express local ou outra instancia temporaria isolada
- restaurar ou anexar com nome de banco seguro, por exemplo `EDS70_RESTORE_ANAMNESE_READONLY`
- nao usar o PostgreSQL atual
- nao usar qualquer banco de producao
- nao sobrescrever bases existentes
- preferir copia dos arquivos para pasta temporaria antes de anexar o MDF

Pasta temporaria sugerida:

- `D:\\BRANA ARQUIVOS\\BRANA CLOUD\\_TEMP_SQLSERVER_RESTORE`

## 6. Alternativa A - Restaurar `eds70.bak`

Roteiro conceitual:

1. consultar os arquivos logicos com `RESTORE FILELISTONLY`
2. restaurar em banco temporario com `RESTORE DATABASE ... WITH MOVE`
3. apontar MDF/LDF novos para a pasta temporaria
4. evitar `REPLACE` salvo se o nome do banco temporario for unico e confirmado
5. ao final, abrir o banco somente leitura para exportacao

Modelo T-SQL:

```sql
RESTORE FILELISTONLY
FROM DISK = 'D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70.bak';

RESTORE DATABASE EDS70_RESTORE_ANAMNESE_READONLY
FROM DISK = 'D:\\BRANA ARQUIVOS\\PROJETO_PRECIFICACAO_LEGADO\\Dados\\eds70.bak'
WITH
  MOVE 'NOME_LOGICO_DATA' TO 'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\_TEMP_SQLSERVER_RESTORE\\EDS70_RESTORE_ANAMNESE_READONLY.mdf',
  MOVE 'NOME_LOGICO_LOG'  TO 'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\_TEMP_SQLSERVER_RESTORE\\EDS70_RESTORE_ANAMNESE_READONLY_log.ldf',
  RECOVERY;
```

Observacao:

- se houver risco de colisao de nome, nao usar `REPLACE`
- nao restaurar em banco de producao

## 7. Alternativa B - Anexar copia do `eds70dat.mdf`

Roteiro conceitual:

1. copiar `eds70dat.mdf` para a pasta temporaria
2. anexar a copia, nao o arquivo original
3. se houver log associado, localizar ou gerar o par correto em ambiente isolado
4. manter o banco temporario apenas para leitura e exportacao

Modelo T-SQL:

```sql
CREATE DATABASE EDS70_RESTORE_ANAMNESE_READONLY
ON (FILENAME = 'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\_TEMP_SQLSERVER_RESTORE\\eds70dat.mdf')
FOR ATTACH;
```

Observacao:

- anexar o MDF original diretamente e arriscado
- preferir sempre copia isolada

## 8. Script de descoberta de tabelas

O arquivo de descoberta deve ficar em:

- `docs/sqlserver_anamnese_descoberta_eds70.sql`

Ele deve localizar:

- tabelas com nomes relacionados a Anamnese
- colunas relacionadas a questionario, pergunta, resposta, paciente, clinica e email
- registros da conta `gleissontel@gmail.com`
- registros dos nomes esperados

## 9. Estratégia de busca textual

Termos para procurar no banco isolado:

- `gleissontel@gmail.com`
- `Principal`
- `Implante`
- `Ficha complementar`
- `Anamnese de Saúde`
- `Anamnese pessoal`
- `Anamnese de Saude`

## 10. Estratégia de exportação para CSV

Arquivos de analise esperados:

- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_eds70_mapeamento_tabelas.txt`

Os CSVs devem ser analiticos, nao de importacao direta.

Campos sugeridos:

Questionarios:

- fonte
- tabela_origem
- id_origem
- nome
- clinica_id_origem ou conta_id_origem
- usuario/email relacionado
- ativo/inativo/status
- ordem
- created_at/updated_at
- observacoes

Perguntas:

- fonte
- tabela_origem
- id_origem
- questionario_id_origem
- questionario_nome
- ordem
- texto
- tipo
- obrigatoria
- opcoes
- ativo/inativo/status
- created_at/updated_at
- observacoes

Respostas:

- questionario_id_origem
- pergunta_id_origem
- total_respostas
- total_pacientes_distintos, se possivel
- observacoes

## 11. Comparação com PostgreSQL atual

Comparar a extracao do SQL Server com o PostgreSQL atual da clinica 1:

- `Principal` atual x `Principal` do EDS70
- quantidade de perguntas
- existencia dos quatro questionarios ausentes no EDS70
- perguntas por questionario
- ordem
- tipos
- opcoes
- obrigatoriedade

## 12. Plano futuro de restauracao controlada

Se a extracao confirmar a estrutura correta, o plano futuro deve incluir:

1. backup completo do PostgreSQL atual
2. export atual de `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`
3. insercao apenas dos questionarios ausentes
4. remapeamento de ids se necessario
5. insercao das perguntas relacionadas
6. nao importar respostas sem validacao explicita
7. validar `GET /anamnese/questionarios`
8. testar no navegador

## 13. Riscos

- anexar o MDF original por engano
- restaurar para banco errado
- sobrescrever o banco atual
- duplicar questionarios
- alterar a ordem das perguntas
- importar respostas sensiveis sem validacao
- diferencas de charset/acentuacao entre SQL Server e PostgreSQL
- diferencas de tipos de dados e tamanhos de coluna

## 14. O que nao foi alterado

Confirmado:

- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- backend funcional nao foi alterado
- banco PostgreSQL atual nao foi alterado
- `eds70.bak` nao foi alterado
- `eds70dat.mdf` nao foi alterado
- nenhum dado foi importado
- nenhum dado foi apagado
- nenhum commit foi feito

## 15. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `node --check frontend/app.js`

## 16. Próxima decisão necessária

O proximo passo seguro e o usuario escolher uma das opcoes abaixo:

- instalar/usar SQL Server Express local
- restaurar `eds70.bak` em um banco temporario
- anexar uma copia do `eds70dat.mdf` em ambiente isolado

Depois disso, executar o script de descoberta para localizar as tabelas reais de Anamnese e gerar a exportacao analitica.

