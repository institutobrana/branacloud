# Frontend React - Icones semanticos da topbar

## Objetivo da etapa

Ajustar apenas os desenhos dos ícones da barra horizontal superior do `frontend-react`, usando ícones prontos e semânticos do `@ant-design/icons`, sem mudar a ordem funcional, os grupos ou o comportamento dos botões.

## Decisão do usuário

Os ícones não precisam ser iguais aos do EasyDental. Eles precisam apenas fazer sentido visualmente para cada ação ou módulo.

## Biblioteca usada

- `@ant-design/icons`

## Arquivos lidos

- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/app/App.jsx`
- `frontend-react/package.json`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_rail_icones_prontos_semanticos.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Mapeamento antes/depois

### Grupo 1

- Dashboard
  - Antes: `MenuOutlined`
  - Depois: `DashboardOutlined`
- Agenda
  - Antes: `CalendarOutlined`
  - Depois: `CalendarOutlined`
- Próximo agendado
  - Antes: `CalendarOutlined`
  - Depois: `ScheduleOutlined`
- Cadastro de pacientes
  - Antes: `TeamOutlined`
  - Depois: `TeamOutlined`
- Novo paciente
  - Antes: `UserAddOutlined`
  - Depois: `UserAddOutlined`
- Anamnese
  - Antes: `FileTextOutlined`
  - Depois: `FileTextOutlined`
- Ficha clínica
  - Antes: `MedicineBoxOutlined`
  - Depois: `ProfileOutlined`

### Grupo 2

- Contas a pagar
  - Antes: `DollarOutlined`
  - Depois: `DollarOutlined`
- Contas a receber
  - Antes: `DollarOutlined`
  - Depois: `CreditCardOutlined`
- Fluxo de caixa
  - Antes: `ApartmentOutlined`
  - Depois: `ApartmentOutlined`
- Controle de estoque
  - Antes: `InboxOutlined`
  - Depois: `InboxOutlined`

### Grupo 3

- Editor de textos
  - Antes: `FileTextOutlined`
  - Depois: `FileTextOutlined`
- Mala direta
  - Antes: `ShoppingCartOutlined`
  - Depois: `ShoppingCartOutlined`
- CRM de vendas
  - Antes: `PartitionOutlined`
  - Depois: `PartitionOutlined`

## Justificativa semântica

- `DashboardOutlined` comunica melhor a tela inicial do sistema.
- `ScheduleOutlined` distingue o próximo agendamento da agenda principal.
- `ProfileOutlined` fica mais próximo de ficha/registro clínico do que um ícone de caixa de remédio.
- `CreditCardOutlined` ajuda a diferenciar receitas/recebimentos de simples despesas.

## Ajustes visuais feitos

- Os ícones permaneceram turquesa.
- O hover ficou mais discreto.
- A aparência de card pesado foi reduzida.
- Os separadores verticais entre grupos foram preservados.
- A topbar não mudou de altura.

## Confirmações

- Não instalou dependências novas.
- Não copiou SVGs, assets ou imagens da internet.
- Não copiou ícones do EasyDental.
- A ordem e os grupos da topbar foram preservados.
- Os separadores verticais foram preservados.
- `Dashboard` continua voltando para `Quadro de Avisos`.
- `Cadastro/Pacientes` continua funcionando.
- `/app` continua abrindo `Quadro de Avisos`.
- A rail lateral não foi alterada.
- A faixa turquesa, a quina com a rail e o `Quadro de Avisos` não foram alterados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
