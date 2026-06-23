# Ajuste de cores CMYK da lateral do shell operacional

## Objetivo da etapa

Aplicar o ajuste pontual de cor solicitado pelo usuário na barra lateral do shell operacional, preservando a estrutura atual do `frontend-react`.

## Cores solicitadas e aplicadas

- Barra lateral:
  - CMYK solicitado: `90 30 95 55`
  - RGB aproximado informado: `11 80 6`
  - HEX aplicado: `#0B5006`
- Botões/ícones da lateral:
  - CMYK solicitado: `0 0 0 60`
  - RGB aproximado informado: `102 102 102`
  - HEX aplicado: `#666666`

## O que foi ajustado

- A rail lateral passou a usar `#0B5006` como base visual.
- Os ícones e botões da lateral passaram a usar `#666666` como cor base.
- A estrutura da rail foi preservada.
- O `Home` deixou de parecer solto e passou a seguir a mesma família visual da navegação.
- Pequenos ajustes de overflow/legibilidade foram mantidos para evitar texto cortado na lateral.

## Arquivos alterados

- [`frontend-react/src/styles/globals.css`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend-react\src\styles\globals.css)
- [`docs/frontend_react_ajuste_cores_cmyk_shell_lateral.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_react_ajuste_cores_cmyk_shell_lateral.md)
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

- Validar visualmente `/app` para confirmar se a lateral agora fica sólida e legível com a cor solicitada.

