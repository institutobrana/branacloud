-- Roteiro somente leitura para descoberta de Anamnese no SQL Server EDS70
-- Base-alvo: EDS70_RESTORE_ANAMNESE_READONLY
-- Nao alterar dados, nao executar INSERT/UPDATE/DELETE.

SET NOCOUNT ON;
GO

/* 1) Tabelas candidatas */
SELECT
    s.name AS schema_name,
    t.name AS table_name
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE LOWER(t.name) LIKE '%anam%'
   OR LOWER(t.name) LIKE '%question%'
   OR LOWER(t.name) LIKE '%perg%'
   OR LOWER(t.name) LIKE '%resp%'
   OR LOWER(t.name) LIKE '%pac%'
   OR LOWER(t.name) LIKE '%cli%'
   OR LOWER(t.name) LIKE '%usu%'
ORDER BY s.name, t.name;
GO

/* 2) Colunas candidatas */
SELECT
    s.name AS schema_name,
    t.name AS table_name,
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.is_nullable
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id
WHERE LOWER(t.name) LIKE '%anam%'
   OR LOWER(c.name) LIKE '%anam%'
   OR LOWER(c.name) LIKE '%question%'
   OR LOWER(c.name) LIKE '%perg%'
   OR LOWER(c.name) LIKE '%resp%'
   OR LOWER(c.name) LIKE '%pac%'
   OR LOWER(c.name) LIKE '%cli%'
   OR LOWER(c.name) LIKE '%email%'
ORDER BY s.name, t.name, c.column_id;
GO

/* 3) Pesquisas de nomes esperados em metadados */
SELECT
    s.name AS schema_name,
    t.name AS table_name
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE EXISTS (
    SELECT 1
    FROM sys.columns c
    JOIN sys.types ty ON ty.user_type_id = c.user_type_id
    WHERE c.object_id = t.object_id
      AND ty.name IN ('varchar','nvarchar','char','nchar','text','ntext','xml')
)
ORDER BY s.name, t.name;
GO

/* 4) Consulta base para localizar a conta por email */
SELECT TOP (50) *
FROM (
    SELECT * FROM usuarios
) U
WHERE LOWER(CAST(U.email AS nvarchar(4000))) = LOWER('gleissontel@gmail.com');
GO

/* 5) Questionarios da clinica 1, se a tabela existir */
SELECT *
FROM anamnese_questionarios
WHERE clinica_id = 1
ORDER BY id;
GO

/* 6) Perguntas da clinica 1, se a tabela existir */
SELECT *
FROM anamnese_perguntas
WHERE questionario_id IN (
    SELECT id
    FROM anamnese_questionarios
    WHERE clinica_id = 1
)
ORDER BY questionario_id, ordem, id;
GO

/* 7) Respostas da clinica 1, se a tabela existir */
SELECT *
FROM anamnese_respostas
WHERE clinica_id = 1
ORDER BY questionario_id, pergunta_id, id;
GO

/* 8) Resumo por questionario */
SELECT
    q.id AS questionario_id,
    q.nome AS questionario_nome,
    COUNT(p.id) AS total_perguntas
FROM anamnese_questionarios q
LEFT JOIN anamnese_perguntas p
    ON p.questionario_id = q.id
WHERE q.clinica_id = 1
GROUP BY q.id, q.nome
ORDER BY q.id;
GO

/* 9) Busca textual limitada por colunas de texto.
   Ajuste a lista de tabelas/colunas depois da descoberta.
*/
DECLARE @sql nvarchar(max) = N'';

SELECT @sql = @sql +
    N'IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N''' + QUOTENAME(s.name) + N'.' + QUOTENAME(t.name) + N''') AND system_type_id IN (35,99,167,175,231,239)) ' +
    N'BEGIN ' +
    N'  SELECT ''' + REPLACE(s.name,'''','''''') + N'.' + REPLACE(t.name,'''','''''') + N''' AS table_name, * ' +
    N'  FROM ' + QUOTENAME(s.name) + N'.' + QUOTENAME(t.name) + N' ' +
    N'  WHERE 1 = 0 ' +
    N'END;'
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE LOWER(t.name) LIKE '%anam%'
   OR LOWER(t.name) LIKE '%question%'
   OR LOWER(t.name) LIKE '%perg%'
   OR LOWER(t.name) LIKE '%resp%';

PRINT @sql;
GO

/* Termos de interesse:
   - gleissontel@gmail.com
   - Principal
   - Implante
   - Ficha complementar
   - Anamnese de Saúde
   - Anamnese pessoal
   - Anamnese de Saude
*/
