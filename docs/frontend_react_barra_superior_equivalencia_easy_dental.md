# Matriz de equivalencia - barra superior EasyDental Cloud x Brana Cloud

## 1. Objetivo

Este documento registra apenas o diagnostico da barra superior do EasyDental Cloud comparada com a barra superior do Brana Cloud em `frontend-react`.

Nao ha alteracao de frontend, backend, banco, migrations ou assets nesta rodada.

## 2. Fonte de observacao

### 2.1 EasyDental Cloud

- Sessao autenticada confirmada no navegador interno do Codex.
- A leitura foi feita diretamente na barra superior do sistema.
- Os identificadores de botao observados vieram do DOM seguro da pagina autenticada.

### 2.2 Brana Cloud

- A barra superior atual foi inspecionada em `frontend-react/src/layout/BranaActionTopbar.jsx`.
- As acoes da barra sao roteadas em `frontend-react/src/app/App.jsx`.
- Os rotulos visuais e tooltips do Brana sao definidos no proprio componente React.

## 3. Estrutura observada no EasyDental Cloud

### 3.1 Agrupamento

- Grupo 1: `home`, `agenda`, `prox-agendado`, `paciente`, `novo-paciente`, `anamnese`, `prontuario`
- Separador visual
- Grupo 2: `contas-pagar`, `contas-receber`, `fluxo-caixa`, `estoque`
- Separador visual
- Grupo 3: `editor`, `mala-direta`, `crm-vendas`

### 3.2 Campos auxiliares

- Campo de busca de paciente no topo.
- Area do usuario no canto direito.

## 4. Matriz de equivalencia

| EasyDental icone/classe | Tooltip EasyDental | Ordem | Funcao EasyDental | Equivalente Brana | Status | Diferenca visual | Diferenca funcional | Acao recomendada |
|---|---|---:|---|---|---|---|---|---|
| `icon-toolbar-home` / `btnToolbarHome` | Home / dashboard | 1 | Abrir painel inicial | `Dashboard` (`HomeOutlined`) | Confirmado equivalente | Desenho diferente, sem fidelidade literal ao shell legado | Mesma intencao de navegacao | Nao mexer agora |
| `icon-toolbar-agenda` / `btnAgenda` | Agenda | 2 | Abrir agenda principal | `Agenda` (`CalendarOutlined`) | Confirmado equivalente | Diferenca de estilo, mas leitura funcional equivalente | Sem diferenca funcional relevante | Nao mexer agora |
| `icon-toolbar-prox-agendado` / `btnProximoAgendado` | Proximo agendado | 3 | Abrir o proximo agendamento | `Próximo agendado` (`FieldTimeOutlined`) | Confirmado equivalente | Desenho moderno no Brana, mais simples que o EasyDental | Funcao equivalente no mapa atual | Nao mexer agora |
| `icon-toolbar-paciente` / `btnPaciente` | Paciente | 4 | Acesso rapido ao paciente | Busca de paciente + `Cadastro de pacientes` | Ausente | Brana nao tem icone dedicado 1:1 | Acesso existe de forma fragmentada, nao como botao dedicado | Criar entrada/icone dedicado de paciente |
| `icon-toolbar-novo-paciente` / `btnNovoPaciente` | Novo paciente | 5 | Abrir cadastro de novo paciente | `Novo paciente` (`UserAddOutlined`) | Confirmado equivalente | Diferenca de desenho apenas | Navegacao equivalente | Nao mexer agora |
| `icon-toolbar-anamnese` / `btnAnamnese` | Anamnese | 6 | Abrir modulo de anamnese | `Anamnese` (`SnippetsOutlined`) | Confirmado equivalente | Diferenca de desenho apenas | Mesma intencao de acesso | Nao mexer agora |
| `icon-toolbar-prontuario` / `btnProntuario` | Prontuario | 7 | Abrir prontuario clinico | `Ficha clínica` (`FileTextOutlined`) | Pendente de validação | Desenho e semanticamente proximos, mas nao idênticos ao legado | A rota existe, mas a fidelidade visual ainda precisa de confirmacao fina | Refinar visual do icone de prontuario/ficha clinica |
| `icon-toolbar-contas-pagar` / `btnContasPagar` | Contas a pagar | 8 | Abrir contas a pagar | `Contas a pagar` (`DollarCircleFilled`) | Confirmado equivalente | Estilo diferente, mas conceito igual | Mesma categoria funcional | Nao mexer agora |
| `icon-toolbar-contas-receber` / `btnContasReceber` | Contas a receber | 9 | Abrir contas a receber | `Contas a receber` (`MoneyCollectOutlined`) | Confirmado equivalente | Desenho diferente | Mesma categoria funcional | Nao mexer agora |
| `icon-toolbar-fluxo-caixa` / `btnFluxoCaixa` | Fluxo de caixa | 10 | Abrir fluxo de caixa | `Fluxo de caixa` (`TransactionOutlined`) | Confirmado equivalente | Desenho diferente | Mesma categoria funcional | Nao mexer agora |
| `icon-toolbar-estoque` / `btnEstoque` | Estoque | 11 | Abrir estoque | `Controle de estoque` (`ShoppingCartOutlined`) | Parcial | O Brana representa estoque com outro simbolo e outra leitura visual | A funcao existe no mapa, mas a fidelidade visual pode ser melhorada | Refinar visual do icon/atalho de estoque |
| `icon-toolbar-editor` / `btnEditor` | Editor | 12 | Abrir editor de textos | `Editor de textos` (`FileTextOutlined`) | Confirmado equivalente | Diferenca de desenho apenas | Mesma categoria funcional | Nao mexer agora |
| `icon-toolbar-mala-direta` / `btnMalaDireta` | Mala direta | 13 | Abrir mala direta | `Mala direta` (`MailOutlined`) | Confirmado equivalente | Diferenca de desenho apenas | Mesma categoria funcional | Nao mexer agora |
| `icon-toolbar-crm-vendas` / `btnCRMVendas` | CRM vendas | 14 | Abrir CRM de vendas | `CRM de vendas` (`RocketOutlined`) | Confirmado equivalente | Diferença de desenho apenas | Mesma categoria funcional | Nao mexer agora |

## 5. Classificacao por prioridade

### A. Ja equivalentes

- Dashboard
- Agenda
- Proximo agendado
- Novo paciente
- Anamnese
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Editor de textos
- Mala direta
- CRM de vendas

### B. Parcial visual

- Estoque

### C. Parcial funcional

- Nenhum item adicional identificado nesta leitura

### D. Ausente

- Paciente, no sentido de acesso dedicado e atalho 1:1

### E. Pendente

- Prontuario / Ficha clinica, para confirmacao fina de desenho e fidelidade visual

## 6. Leitura objetiva do Brana Cloud

- A barra superior do Brana ja cobre a maior parte da semantica do EasyDental Cloud.
- O componente atual ja tem agrupamento em tres blocos, com separadores e tooltip por label.
- O maior gap visual segue sendo o desenho especifico de alguns atalhos, nao o fluxo de navegação.
- O ponto funcional mais claro que ainda falta como entrada dedicada e o atalho `Paciente`.

## 7. Recomendacao de proxima etapa

Proxima etapa recomendada: ajustar visualmente apenas os atalhos `Paciente`, `Prontuario / Ficha clinica` e `Estoque`, sem alterar rotas nem backend.

## Ajuste visual dos atalhos parciais da barra superior

### Paciente

- Foi adicionado um atalho dedicado `Paciente` na barra superior do `frontend-react`.
- O atalho usa um icone de usuario e segue o padrao visual dos demais botoes da barra.
- A acao aproveita a rota ja existente de pacientes.
- O tooltip e o aria-label seguem o texto `Paciente`.

### Prontuario / Ficha clinica

- O atalho de `Ficha clinica` foi mantido como entrada principal do prontuario no `frontend-react`.
- A navegacao continua apontando para `/app/ficha-clinica`.
- O rótulo permanece coerente com o padrao ja adotado no Brana.

### Estoque

- O atalho `Controle de estoque` recebeu ajuste visual no icone, para ficar mais coerente com a leitura de estoque do EasyDental e do Brana.
- A acao existente foi preservada.
- Nao houve alteracao do modulo de estoque em si.

### Confirmacoes

- Rotas nao foram alteradas fora do que ja existia.
- Backend nao foi alterado.
- Banco e migrations nao foram alterados.

### Pendencias remanescentes

- O atalho `Paciente` ainda compartilha o mesmo destino funcional geral da area de pacientes, sem um fluxo novo exclusivo.
- O atalho `Controle de estoque` continua sendo um refinamento visual, sem novo modulo operacional.

## Correção efetiva dos ícones próprios da barra superior

### Diagnóstico da rodada anterior

- A rodada anterior melhorou a presença dos atalhos, mas ainda dependia de ícones genéricos do `@ant-design/icons`.
- O componente real renderizado pela aplicação é `frontend-react/src/layout/BranaActionTopbar.jsx`, integrado em `frontend-react/src/app/App.jsx`.
- A validação visual local continuou bloqueada pela autenticação, então a fidelidade ficou dependente apenas da leitura de código.
- O problema não era a ausência dos botões em si, e sim a falta de ícones próprios da Brana no padrão visual esperado.

### Ícones criados

- Arquivo novo: `frontend-react/src/layout/branaTopbarIcons.jsx`
- `Paciente`: silhueta com cartão/ficha lateral.
- `Ficha clínica / Prontuário`: folha/prontuário com detalhe clínico discreto.
- `Controle de estoque`: caixa/estoque com leitura de empilhamento.

### Aplicação na barra real

- `Paciente` passou a usar `BranaPacienteIcon`.
- `Ficha clínica` passou a usar `BranaFichaClinicaIcon`.
- `Controle de estoque` passou a usar `BranaEstoqueIcon`.
- A rota e a ação de cada atalho foram preservadas.

### Confirmações

- EasyDental foi usado apenas como referência visual/conceitual.
- Nenhum asset do EasyDental foi copiado.
- Nenhum backend, banco ou migration foi alterado.

### Pendências remanescentes

- Validação visual final no navegador local continua dependente de uma sessão autenticada válida.
- A barra superior ainda pode receber microajustes de desenho, se a revisão visual posterior mostrar necessidade.
