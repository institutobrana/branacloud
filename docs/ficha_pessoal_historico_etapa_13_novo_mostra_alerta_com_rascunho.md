# Ficha pessoal - Histórico: Novo mostra alerta quando há rascunho ativo

## Objetivo
- Restaurar o aviso visual próprio do Brana Cloud ao tentar inserir uma nova linha com uma linha anterior ainda aberta.
- Preservar o bloqueio de nova linha sem salvar a anterior.

## Regra ajustada
- Se houver uma linha de Histórico em preenchimento, clicar em `Novo` deve exibir a janela própria com a mensagem de validação.
- O bloqueio de inserção continua ativo até a linha atual ser salva ou cancelada.

## Arquivos afetados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

## Segurança
- Não altera o fluxo de gravação.
- Não altera o payload da ficha.
- Só ajusta o feedback visual do bloqueio já existente.

## Backup
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\ficha_pessoal_historico_novo_alerta_rascunho_20260603_052334`

## Validação
- Executar `node --check` no arquivo alterado antes do commit.
