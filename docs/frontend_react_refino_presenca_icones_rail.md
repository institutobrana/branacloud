# Frontend React - Refino da presença dos ícones da rail

## Objetivo da etapa

Aumentar a presença visual dos ícones SVG locais da rail lateral, deixando-os maiores, mais robustos e menos parecidos com miniaturas centrais.

## Problema validado pelo usuário

- Os ícones locais ficaram pequenos demais.
- Os desenhos ficaram finos/delicados demais.
- A leitura visual ficou fraca e distante da referência EasyDental.

## Arquivos lidos

- `docs/frontend_react_icones_svg_locais_rail.md`
- `docs/frontend_react_troca_desenho_icones_rail.md`
- `docs/frontend_react_refino_icones_rail_estilo_easydental.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/layout/BranaRailIcons.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `docs/frontend_react_refino_presenca_icones_rail.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaRailIcons.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Como os SVGs foram aumentados/refinados

- Os desenhos receberam formas mais cheias e robustas.
- Alguns círculos e traços tiveram raio/espessura aumentados.
- Os documentos empilhados e engrenagem ganharam presença maior.
- Os ícones passaram a ocupar melhor o viewBox.

## Como a presença visual foi aproximada do EasyDental

- Os ícones ficaram mais sólidos e legíveis em branco sobre turquesa.
- A escala visual ficou mais consistente entre os grupos.
- A sensação de miniatura no centro da rail foi reduzida.

## Confirmações

- Não copiou assets, SVGs ou imagens do EasyDental.
- Não instalou dependências novas.
- A ordem e os grupos da rail foram preservados.
- O submenu continua abrindo ao passar o mouse.
- O submenu continua fechando por mouseleave.
- `Cadastro -> Pacientes` foi preservado.
- `Dashboard -> Quadro de Avisos` foi preservado.
- A faixa turquesa e o Quadro de Avisos não foram alterados.
- A topbar horizontal não foi alterada.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
