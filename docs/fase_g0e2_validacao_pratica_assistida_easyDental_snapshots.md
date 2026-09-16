# FASE G.0E.2 - Validacao pratica assistida do EasyDental com snapshots antes e depois

Data: 2026-08-03

## Status da rodada
- EXECUCAO PARCIAL.
- A etapa de preparacao documental e estrutural foi concluida.
- A interacao GUI manual ainda depende da operacao do usuario no EasyDental Desktop.

## Contexto confirmado
- Projeto: Brana Cloud
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch esperada: `modularizacao-segura-fase-1`
- HEAD informado: `0abb0f94ae94a5e60026f253d5e82187183aa22c`

## EasyDental confirmado
- Instalacao: `Y:\EDS70`
- Executavel: `Y:\EDS70\EDS70.exe`
- Aplicacao: `EasyDental 7.0`
- SQL Server: `DELL_SERVIDOR\EDS70`
- Banco: `EDS70`

## Artefatos localizados
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.log`
- `Y:\EDS70\Temp\_SIMBOLO_ANOMALIA.log`
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.raw`
- `Y:\EDS70\Temp\_ESPECIALIDADE.raw`

## Evidencia estatica registrada
- `_SIMBOLO_ODONTO.log` registra extracao de 80 linhas.
- `_SIMBOLO_ANOMALIA.log` registra extracao de 18 linhas.
- O catalogo de simbolos possui estruturas proprias no legado.

## Schema observado em `Y:\EDS70\Dados\eds70.sql`

### Tabela `_SIMBOLO_ODONTO`
- `NROSIM` `int` not null
- `DESCRICAO` `varchar(30)` not null
- `ESPECIAL` `int` null
- `TIPMARCA` `smallint` null
- `TIPSIMB` `smallint` null
- `BITMAP1` `varchar(20)` null
- `BITMAP2` `varchar(20)` null
- `BITMAP3` `varchar(20)` null
- `SOBREPOS` `smallint` null
- `ICONE` `varchar(20)` null

### Tabela `_SIMBOLO_ANOMALIA`
- mesma estrutura base de `_SIMBOLO_ODONTO`
- acrescida de `BITANOMALIA` `smallint` null

### Tabela `_ESPECIALIDADE`
- `REGISTRO` `int` not null
- `CODIGO` `varchar(20)` null
- `NOME` `varchar(255)` null
- `RESERVADO` `smallint` null
- `ORDEM` `smallint` null
- `IMAGE_INDEX` `smallint` null
- `INATIVO` `smallint` null

## Relacoes relevantes localizadas no schema
- `_SIMBOLO_ODONTO` aparece referenciada por tabelas de itens de tabela geral e tabela de procedimentos.
- `_ESPECIALIDADE` e base referenciada por outros cadastros do sistema.
- O schema textual confirma o papel de `BITMAP1`, `BITMAP2`, `BITMAP3`, `ICONE`, `TIPMARCA` e `TIPSIMB` no contrato legado.

## Snapshot inicial somente leitura
- Nao foi realizado insert, update, delete, merge ou alteracao no banco do EasyDental.
- Nao foi capturada a interacao GUI completa ainda.
- Nao foi criado registro de teste nesta subetapa.
- Nao foi confirmada a existencia de um novo item na tabela via operacao manual, porque a parte interativa ainda depende do usuario.

## Log de trabalho
- O terminal confirmou a existencia do executavel e dos diretórios do EasyDental.
- O terminal confirmou a estrutura textual do schema.
- O terminal confirmou a limitacao de nao conseguir concluir sozinho login, clique em Novo e clique em Altera.

## Limite atual
- A etapa assistida precisa ser concluida com o usuario operando o EasyDental Desktop.
- A partir daqui, a rodada depende da abertura da tela e da confirmacao manual do usuario.

## Instrucoes de pausa operacional
Abra `Y:\EDS70\EDS70.exe`, faca o login normalmente e entre na tela de `Simbos graficos`. Nao crie nada ainda. Avise quando a tabela estiver aberta.
