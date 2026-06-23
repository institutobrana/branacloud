# Teste de paleta do shell operacional

## Objetivo da etapa

Testar uma combinação visual mais equilibrada da paleta oficial Brana no shell operacional, reduzindo o peso excessivo da lateral anterior e melhorando contraste e legibilidade.

## Paleta aplicada

- Base da lateral:
  - referência visual: `#006838`
  - apoio em profundidade: `#004B25`
  - apoio secundário e realces: `#007B74`
- Topbar:
  - presença sutil de marca com `#006838` e `#007B74`
- Ícones e botões:
  - texto/ícone inativo em tom claro sobre a lateral escura
  - item ativo em verde institucional com fundo claro

## O que foi corrigido

- A lateral deixou de usar o tom escuro puro como base dominante.
- A rail passou a usar uma combinação mais equilibrada da paleta Brana.
- Os ícones ficaram legíveis com melhor contraste.
- Os rótulos da lateral receberam mais espaço e deixaram de quebrar com tanta facilidade.
- O item ativo ficou mais elegante e evidente.
- A topbar ganhou leve presença Brana e ficou menos branca.
- Os botões da toolbar permaneceram compactos, porém mais integrados.

## Arquivos alterados

- [`frontend-react/src/styles/globals.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\styles\globals.css)
- [`docs/frontend_react_teste_paleta_shell_operacional.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_teste_paleta_shell_operacional.md)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)

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

- Validar visualmente `/app` e confirmar se a lateral, agora mais equilibrada, ficou mais elegante e legível.

