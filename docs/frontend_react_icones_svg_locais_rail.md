# Frontend React - Ícones SVG locais para a rail

## Objetivo da etapa

Criar ícones locais em SVG/React próprios para a rail lateral, com desenhos mais robustos e mais próximos da referência EasyDental, sem copiar assets proprietários e sem instalar dependências novas.

## Problema validado pelo usuário

- Os ícones da rail ainda estavam diferentes da referência.
- O problema não era só estilo, mas também desenho/representação.

## Decisão adotada

- Criar SVGs React locais próprios para a rail.
- Manter a rail turquesa, o comportamento e a ordem dos grupos.
- Substituir os glyphs genéricos por desenhos mais robustos e semânticos.

## Confirmações

- Não foram copiados assets, SVGs ou imagens do EasyDental.
- Nenhuma dependência nova foi instalada.

## Arquivos lidos

- `docs/frontend_react_troca_desenho_icones_rail.md`
- `docs/frontend_react_refino_icones_rail_estilo_easydental.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/package.json`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `frontend-react/src/layout/BranaRailIcons.jsx`
- `docs/frontend_react_icones_svg_locais_rail.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaIconRail.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Mapeamento dos grupos para os novos ícones

- Atendimento -> grupo de pessoas/profissionais.
- Cadastro -> busto/paciente.
- Financeiro -> cifrão dentro de círculo.
- Tabelas -> documentos/folhas empilhadas.
- Relatórios -> documento textual.
- Configuração -> engrenagem.
- Ferramentas -> ferramentas cruzadas.
- Ajuda -> suporte/boia/alvo.

## Equivalência semântica com a referência EasyDental

- Os desenhos foram escolhidos para parecerem mais “pesados” e legíveis em branco sobre turquesa.
- A linguagem visual ficou mais sólida e mais próxima de desktop/ERP.
- A ordem e a função dos grupos foram preservadas.

## Confirmações

- A ordem e os grupos da rail foram preservados.
- O hover/mouseleave do submenu foi preservado.
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
