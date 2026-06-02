# Ficha pessoal - Histórico: rascunho ativo bloqueia ações

## Objetivo
- Impedir que o usuário abandone ou troque de contexto enquanto existir uma linha do Histórico em preenchimento.
- Manter a mensagem própria do Brana Cloud quando a descrição obrigatória estiver vazia.
- Preservar `ENTER`, `Grava` e `ESC` como os únicos caminhos de conclusão da linha aberta.

## Regra refinada
- Se houver uma linha de Histórico em aberto, qualquer tentativa de:
  - mudar de aba;
  - clicar em `Fechar`;
  - clicar em outra linha do Histórico;
  - usar os botões de ação da grade;
  - deve ser bloqueada até a linha ser salva ou cancelada.
- Se a descrição estiver vazia, exibir `Campo descrição do procedimento não pode ser nulo.`.
- Se a linha já estiver preenchida, a ação ainda deve ser bloqueada para evitar abandono acidental.

## Arquivos afetados
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

## Segurança
- Reutiliza a validação visual já existente.
- Não altera o payload nem a persistência da ficha.
- Não mexe no fluxo de gravação do paciente.

## Backup
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\ficha_pessoal_historico_regra_rascunho_ativo_20260602_200312`

## Validação
- `node --check` deve ser executado no arquivo alterado antes do commit.
