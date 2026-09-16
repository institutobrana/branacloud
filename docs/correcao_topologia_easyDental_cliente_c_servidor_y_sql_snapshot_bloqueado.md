# Correcao de topologia - EasyDental cliente C:, servidor Y: e snapshot SQL

Data: 2026-08-03

## Correcao obrigatoria
- Cliente interativo real: `C:\EDS70\EDS70.exe`
- Compartilhamento e auditoria de arquivos: `Y:\EDS70`
- Banco legado: `DELL_SERVIDOR\EDS70` / `EDS70`

## Regra operacional correta
- Toda a interacao GUI deve ocorrer no cliente `C:\EDS70\EDS70.exe`.
- O compartilhamento `Y:\EDS70` serve para auditoria de arquivos, BMPs, logs, `raw` e timestamps.
- O banco deve ser comparado antes e depois das acoes feitas no cliente.

## Validacoes realizadas nesta rodada
- Inventario de `C:\EDS70` feito com exito.
- Inventario de `Y:\EDS70` feito com exito.
- Identificacao do executavel cliente em `C:\EDS70\EDS70.exe` confirmada.
- Identificacao do executavel compartilhado em `Y:\EDS70\EDS70.exe` observada, mas nao tratada como cliente principal.

## Banco
- Foi tentada leitura somente por metadados com `sqlcmd`.
- A conexao falhou por incompatibilidade do driver ODBC com a versao antiga do SQL Server.
- Portanto, o snapshot SQL ficou bloqueado nesta subetapa e nao deve ser inventado.

## Evidencias de arquivo local em `C:`
- `C:\EDS70\eds70.dsn`
- `C:\EDS70\Temp\INSPIRON-15_eds70.log`
- `C:\EDS70\Temp\EDS70Tmp.MDB`
- `C:\EDS70\Temp\EDS70Tmp.ldb`
- `C:\EDS70\Temp\arc_inferior.bmp`
- `C:\EDS70\Temp\arc_superior.bmp`
- `C:\EDS70\Temp\gerais.bmp`

## Evidencias de arquivo compartilhado em `Y:`
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.log`
- `Y:\EDS70\Temp\_SIMBOLO_ANOMALIA.log`
- `Y:\EDS70\Temp\_SIMBOLO_ODONTO.raw`
- `Y:\EDS70\Temp\_ESPECIALIDADE.raw`
- `Y:\EDS70\Temp\_BANCO.log`
- `Y:\EDS70\Temp\_ESPECIALIDADE.log`

## Proxima acao assistida
- O modal `Novo` ja esta aberto.
- O usuario deve digitar um nome sem selecionar simbolo.
- Depois disso sera possivel medir se o `Ok` habilita e se a nova linha aparece.

## Limite atual
- Nao reiniciar o EasyDental.
- Nao trocar para `Y:\EDS70\EDS70.exe` como cliente principal.
- Nao concluir o snapshot SQL sem acesso compativel ao servidor legado.
