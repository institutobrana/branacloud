# Extração EDS70 SQL Server - Resultado Anamnese

## 1. Contexto

A conta `gleissontel@gmail.com` da clínica `1` no PostgreSQL atual tinha apenas `Principal` na Anamnese, com 17 perguntas. A fonte SQL Server EDS70 restaurada/consultada em modo lógico contém os cinco questionários esperados e foi usada como base analítica para extração sem tocar no PostgreSQL atual.

Questionários esperados/localizados:
- Principal
- Implante
- Ficha complementar
- Anamnese de Saúde
- Anamnese pessoal

## 2. Estado inicial do projeto atual

- Branch: `modularizacao-segura-fase-1`
- `frontend/app.js` sem diff
- `frontend/index.html` sem diff
- `node --check frontend/app.js` passou
- Nenhum backend funcional foi alterado nesta etapa
- Nenhum banco foi alterado nesta etapa

## 3. Conexão SQL Server usada

- Instância local: `.\SQLEXPRESS` (acesso via PowerShell/.NET `System.Data.SqlClient`)
- Autenticação: Integrated Security
- `sqlcmd` não estava disponível no PATH, então a leitura foi feita com acesso .NET somente leitura
- `TrustServerCertificate=True` para a conexão local

## 4. Banco temporário usado

- Banco acessado para análise: `EDS70`
- Estado: `ONLINE`
- `is_read_only = False`
- O banco esperado `EDS70_RESTORE_ANAMNESE_READONLY` não precisou ser criado nesta sessão porque o `EDS70` já estava presente e acessível para leitura lógica
- O script-modelo de restore isolado foi preparado, mas não executado por não ser necessário para a análise

## 5. Tabelas reais identificadas

Tabelas relevantes encontradas no SQL Server EDS70:
- `dbo.ANAMNESE_QUEST`
- `dbo.ANAMNESE_PERG`
- `dbo.ANAMNESE_RESP`
- `dbo.USUARIO`
- `dbo.CCPACIENTE`

Mapeamento funcional observado:
- `ANAMNESE_QUEST` -> questionários
- `ANAMNESE_PERG` -> perguntas
- `ANAMNESE_RESP` -> respostas

## 6. Questionários encontrados

Questionários localizados em `ANAMNESE_QUEST`:
- `1` - `Principal`
- `2` - `Implante`
- `3` - `Ficha complementar`
- `4` - `Anamnese de Saúde`
- `5` - `Anamnese pessoal`

Total encontrado: `5`

## 7. Perguntas encontradas

Total de perguntas em `ANAMNESE_PERG`: `130`

Quantidade por questionário:
- `Principal`: `35`
- `Implante`: `12`
- `Ficha complementar`: `12`
- `Anamnese de Saúde`: `55`
- `Anamnese pessoal`: `16`

A exportação analítica foi feita sem trazer conteúdo clínico sensível de respostas completas.

## 8. Respostas encontradas

- Registros brutos em `ANAMNESE_RESP`: `15882`
- Resumos agrupados exportados: `118`
- Os dados de resposta foram exportados apenas como resumo agregado, sem conteúdo clínico completo

## 9. CSVs criados

- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_eds70_extraido_respostas_resumo.csv`
- `docs/anamnese_eds70_mapeamento_tabelas.txt`
- `docs/anamnese_eds70_descoberta_tabelas.txt`
- `docs/anamnese_eds70_descoberta_colunas.txt`
- `docs/anamnese_eds70_busca_strings.txt`
- `docs/anamnese_eds70_restore_filelistonly.txt`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

## 10. Comparação com PostgreSQL atual

PostgreSQL atual, clínica `1`:
- Usuário `gleissontel@gmail.com` identificado com `clinica_id = 1`
- Questionários atuais: `1`
- Questionário presente: `Principal` (`id = 2`)
- Perguntas atuais do `Principal`: `17`

Comparação direta:
- EDS70 possui os cinco questionários esperados
- PostgreSQL atual da clínica `1` possui apenas `Principal`
- Diferença principal: faltam `Implante`, `Ficha complementar`, `Anamnese de Saúde` e `Anamnese pessoal` no banco atual
- A estrutura de perguntas do `Principal` no EDS70 é maior que a do PostgreSQL atual, confirmando divergência de conteúdo entre as fontes

## 11. Diagnóstico

Fonte correta localizada:
- SQL Server EDS70 contém a Anamnese completa da conta/clínica analisada

Diagnóstico mais provável:
- o PostgreSQL atual da clínica `1` está incompleto para Anamnese
- o frontend não é o problema principal nesta etapa, porque a API atual devolve apenas o que o banco tem
- a restauração deve ser feita a partir do SQL Server EDS70, com mapeamento controlado e sem reutilizar ids legados de forma cega

## 12. Plano recomendado para dry-run de importação

1. Fazer backup completo do PostgreSQL atual antes de qualquer inserção
2. Exportar o estado atual das tabelas `anamnese_questionarios`, `anamnese_perguntas` e `anamnese_respostas`
3. Rodar um dry-run de mapeamento entre EDS70 e PostgreSQL
4. Inserir primeiro apenas os quatro questionários ausentes
5. Inserir as perguntas correspondentes em seguida, preservando ordem, tipo e obrigatoriedade
6. Não importar respostas clínicas automaticamente
7. Validar o endpoint autenticado `GET /anamnese/questionarios`
8. Testar no navegador antes de considerar qualquer carga adicional

## 13. O que não foi alterado

- PostgreSQL atual não foi alterado
- `frontend/app.js` não foi alterado
- `frontend/index.html` não foi alterado
- backend funcional não foi alterado
- endpoints não foram alterados
- nenhum dado foi importado no sistema atual
- nenhum dado foi atualizado
- nenhum dado foi apagado
- nenhum commit foi feito

## 14. Checks executados

- `node --check frontend/app.js`
- `git status --short`
- `git diff --stat`
- leitura do SQL Server EDS70 em modo lógico somente leitura
- comparação com PostgreSQL atual da clínica `1`
- exportação analítica para CSVs e TXT de apoio

## 15. Próxima ação necessária

Executar um dry-run de restauração controlada, com mapeamento de ids e validação final no endpoint e no navegador, antes de qualquer importação real.
