# Frontend React - Refino dos desenhos dos icones da topbar

## Objetivo da etapa

Refinar os desenhos dos ícones da barra horizontal superior do `frontend-react` para ficarem semanticamente mais próximos da referência visual enviada pelo usuário, mantendo ordem, grupos, separadores e comportamento.

## Problema validado pelo usuário

Alguns desenhos da topbar ainda não correspondiam bem à referência do EasyDental, mesmo já usando `@ant-design/icons`.

## Decisão técnica

- Usar apenas `@ant-design/icons` já instalado no projeto.
- Não instalar dependências novas.
- Não copiar SVGs, imagens ou ícones do EasyDental.

## Arquivos lidos

- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/package.json`
- `docs/frontend_react_icones_semanticos_topbar.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_rail_icones_prontos_semanticos.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Mapeamento antes/depois

### Grupo 1

- Dashboard
  - Antes: `HomeOutlined`
  - Depois: `HomeOutlined`
- Agenda
  - Antes: `CalendarOutlined`
  - Depois: `CalendarOutlined`
- Próximo agendado
  - Antes: `ClockCircleOutlined`
  - Depois: `FieldTimeOutlined`
- Cadastro de pacientes
  - Antes: `UserOutlined`
  - Depois: `UsergroupAddOutlined`
- Novo paciente
  - Antes: `UserAddOutlined`
  - Depois: `UserAddOutlined`
- Anamnese
  - Antes: `SnippetsOutlined`
  - Depois: `SnippetsOutlined`
- Ficha clínica
  - Antes: `FileTextOutlined`
  - Depois: `FileTextOutlined`

### Grupo 2

- Contas a pagar
  - Antes: `DollarOutlined`
  - Depois: `DollarCircleFilled`
- Contas a receber
  - Antes: `MoneyCollectOutlined`
  - Depois: `MoneyCollectOutlined`
- Fluxo de caixa
  - Antes: `TransactionOutlined`
  - Depois: `TransactionOutlined`
- Controle de estoque
  - Antes: `ShoppingCartOutlined`
  - Depois: `ShoppingCartOutlined`

### Grupo 3

- Editor de textos
  - Antes: `FileTextOutlined`
  - Depois: `FileTextOutlined`
- Mala direta
  - Antes: `MailOutlined`
  - Depois: `MailOutlined`
- CRM de vendas
  - Antes: `PartitionOutlined`
  - Depois: `RocketOutlined`

## Justificativa semântica

- `FieldTimeOutlined` aproxima melhor a ideia de agenda/hora marcada.
- `UsergroupAddOutlined` comunica melhor um grupo de pacientes do que um ícone de usuário isolado.
- `DollarCircleFilled` reforça o símbolo financeiro principal com mais força visual.
- `RocketOutlined` dá uma leitura de atalho/lançador e diferencia melhor o bloco de produtividade.

## Confirmações

- Não instalou dependências novas.
- Não copiou SVGs/assets/imagens da internet.
- Não copiou ícones do EasyDental.
- A ordem e os grupos da topbar foram preservados.
- Os separadores verticais foram preservados.
- `Dashboard` continua voltando para `Quadro de Avisos`.
- `Cadastro/Pacientes` continua funcionando.
- `/app` continua abrindo `Quadro de Avisos`.
- A rail lateral não foi alterada.
- A faixa turquesa/quina com rail e o `Quadro de Avisos` não foram alterados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
