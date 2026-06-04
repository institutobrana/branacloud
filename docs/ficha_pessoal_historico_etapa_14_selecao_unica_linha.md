# Ficha pessoal - Histórico: seleção única de linha

## Objetivo
- Garantir que apenas uma linha do Histórico fique marcada como selecionada por vez.
- Ao clicar em outra linha, a seleção anterior deve ser removida automaticamente.

## Regra ajustada
- Um clique seleciona a linha.
- Um novo clique em outra linha troca a seleção.
- A linha anterior deixa de ficar destacada.
- Não pode existir acumulação de linhas selecionadas visualmente.

## Arquivo afetado
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

## Segurança
- Não altera persistência, gravação ou validação.
- Apenas normaliza o estado visual da seleção.

## Backup
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\ficha_pessoal_historico_selecao_unica_20260604_053201`

## Validação
- `node --check` executado com sucesso no arquivo alterado.
