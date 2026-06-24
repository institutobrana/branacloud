# Refino do submenu lateral estilo EasyDental

## Objetivo

Registrar o refino visual do submenu lateral do `frontend-react` para um padrão mais enxuto, com leitura operacional semelhante ao EasyDental, sem criar novas telas nem alterar backend, banco, migrations ou frontend legado.

## O que foi ajustado

- O painel contextual lateral passou a usar uma lista simples de ações, sem o visual de cartões.
- Os itens deixaram de exibir textos repetidos de apoio como `em breve` na própria modelagem de dados da UI.
- O hover passou a ser uma faixa horizontal leve em cinza, ocupando a linha inteira.
- O espaçamento vertical foi reduzido para aproximar o painel de um menu operacional compacto.
- O título e o botão de fechar foram mantidos.
- O tooltip da rail lateral foi silenciado quando o painel está aberto, para evitar sobreposição visual.

## Comportamento preservado

- `Dashboard -> Início` continua funcionando.
- `Cadastro -> Pacientes` continua abrindo `Pacientes` em modo somente leitura.
- O fechamento por mouseleave no conjunto rail + painel continua ativo.
- O login/logout e a sessão do `frontend-react` não foram alterados.

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/styles/globals.css`

## Validações e risco remanescente

- O refino é visual e local ao `frontend-react`.
- Não houve alteração em backend, banco, migrations ou frontend legado.
- Risco remanescente: o comportamento final do tooltip e do hover ainda depende da validação visual no navegador.

## Próximo passo recomendado

- Validar manualmente a navegação lateral no `frontend-react` e confirmar que o submenu agora se comporta como lista compacta, sem aparência de cartão.
