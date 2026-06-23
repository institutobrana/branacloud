# Recomposição estrutural do Shell Operacional Odontológico

## Problema reportado

O novo teste visual mostrou que o shell ainda parecia um dashboard administrativo. A lateral esquerda seguia quase invisível e o topo ainda parecia uma sequência de botões soltos, com branco em excesso e pouca presença da marca Brana.

## O que foi recomposto na lateral

- A rail lateral passou a ter hierarquia visual real.
- A marca ficou integrada ao bloco lateral.
- A navegação foi organizada em seções.
- O item ativo passou a ter destaque mais forte.
- O ícone `Home` deixou de ficar isolado.
- O logout foi mantido no rodapé.

## O que foi recomposto no topo

- O topo virou uma barra de ferramentas única e compacta.
- A busca passou a conviver na mesma faixa dos botões de ação.
- As ações rápidas ficaram agrupadas visualmente.
- O usuário logado e o `Sair` permanecem à direita.
- O excesso de branco foi reduzido.

## Workspace central

- A área central permaneceu com a tela `Início`.
- Os cards ficaram um pouco mais compactos.
- O bloco de apoio operacional foi reduzido para harmonizar com o shell.

## Paleta Brana aplicada

- `#004B25`
- `#006838`
- `#007B74`
- `#00A79D`
- `#939598`
- `#808285`

## Arquivos alterados

- [`frontend-react/src/layout/BranaIconRail.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaIconRail.jsx)
- [`frontend-react/src/layout/BranaActionTopbar.jsx`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\layout\BranaActionTopbar.jsx)
- [`frontend-react/src/styles/globals.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\styles\globals.css)
- [`frontend-react/src/features/inicio/inicio.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\features\inicio\inicio.css)

## Confirmações

- Nenhuma nova API foi consumida.
- Pacientes não foi migrado.
- Odontograma não foi migrado.
- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco e as migrations não foram alterados.
- Nenhuma senha ou token foi exibida.

## Resultado do build

- `npm.cmd run build` em `frontend-react`: sucesso.
- Não havia script `lint` configurado no pacote.

## Próximos passos recomendados

- Validar visualmente `/app`.
- Confirmar se a rail agora parece menu principal de software clínico e se o topo parece uma toolbar desktop.
- Só depois avançar para módulos reais.

