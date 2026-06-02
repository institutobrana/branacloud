# Ficha pessoal - Histórico: bloqueio de saída com linha vazia

## Objetivo
- Manter o aviso visual próprio do Brana Cloud quando a descrição do procedimento estiver vazia.
- Bloquear saída da tela e troca de aba enquanto existir rascunho vazio no Histórico.
- Preservar o fluxo já existente de `ENTER`, `Grava` e criação de nova linha.

## Regras cobertas
- `Inserir linha` com rascunho vazio continua mostrando a janela própria de aviso.
- `ENTER` com descrição vazia continua mostrando a janela própria de aviso.
- `Grava` com descrição vazia continua mostrando a janela própria de aviso.
- `Fechar` com descrição vazia agora também mostra a janela própria de aviso e impede a saída.
- Troca de aba enquanto o Histórico estiver com rascunho vazio também passa pela mesma validação.

## Arquivos alterados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`

## Estratégia de segurança
- Reaproveitar a mesma validação já usada por `ENTER` e `Grava`.
- Centralizar a decisão de saída/troca de aba no `app.js`.
- Evitar duplicação de lógica entre botões e atalhos.

## Backup
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\ficha_pessoal_historico_regra_saida_navegacao_20260602_195422`

## Validação
- `node --check` executado com sucesso em:
  - `frontend/js/modules/ficha-pessoal-aba-historico.js`
  - `frontend/app.js`
