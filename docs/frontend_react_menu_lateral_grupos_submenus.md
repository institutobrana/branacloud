# `frontend-react` - menu lateral por grupos e submenus

## Escopo da etapa

Nesta etapa a shell do `frontend-react` foi reorganizada para um modelo de navegação lateral por grupos, com:

- rail principal;
- botão inferior para recolher e expandir;
- painel contextual branco lateral;
- menu do usuário no canto superior direito;
- preservação da tela `Pacientes` somente leitura já concluída.

## Referência visual usada

- Sistema odontológico de referência auditado anteriormente.
- Shell operacional atual do `frontend-react`.
- Paleta Brana já registrada no projeto.

## Grupos principais criados

- Início
- Atendimento
- Cadastro
- Financeiro
- Tabelas
- Relatórios
- Configuração
- Ferramentas
- Ajuda

## Submenus por grupo

### Atendimento

- Agenda semanal
- Agenda diária
- Timeline do paciente
- Controle de retornos
- Gerenciar tratamentos
- Ficha clínica
- Ficha de anamnese
- Documentos

### Cadastro

- Pacientes
- Convênios atendidos
- Corpo clínico
- Fornecedores

### Financeiro

- Contas a receber
- Contas a pagar
- Gerenciar recibos
- Controle de estoque
- Fluxo de caixa
- Recebíveis digitais
- Faturamento de convênio
- Serviços protéticos

### Tabelas

- Procedimentos
- Procedimentos genéricos
- Materiais de estoque
- Medicamentos
- Serviços de prótese
- Doenças (CID)

### Relatórios

- Favoritos
- Pacientes
- Atendimentos
- Tabelas
- Financeiros
- Estoque
- Gerenciais

### Configuração

- Usuários do sistema
- Perfis de usuário
- Tabelas auxiliares
- Plano de contas
- Agendas
- Questionários de anamnese
- Unidades de atendimento
- Campos livres
- Taxas de cobrança
- Contas bancárias

### Ferramentas

- Dashboard
- Editor de textos
- Mala direta
- Mensagens enviadas
- Assinatura eletrônica
- Gerenciar avisos
- Orientação ao paciente
- Exportação de dados
- Trilha de auditoria
- CRM de vendas

### Ajuda

- Vídeos tutoriais
- Treinamentos on-line

## Comportamento recolhido / expandido

- Barra recolhida: aproximadamente `72px`, mostrando somente ícones.
- Barra expandida: aproximadamente `184px`, mostrando ícone + texto.
- O botão inferior alterna entre recolher e expandir.

## Comportamento do painel contextual

- Painel branco ao lado da rail.
- Título do grupo ativo.
- Botão pequeno de fechar.
- Lista de submenus.
- Troca de conteúdo ao mudar de grupo.
- Fecha sem quebrar o layout.
- `Cadastro -> Pacientes` continua abrindo a tela somente leitura já implementada.

## Como acessar Pacientes

- Abrir `http://localhost:5173/app`.
- Abrir o grupo `Cadastro`.
- Clicar em `Pacientes`.

## Comportamento do menu do usuário

- O nome/área do usuário no canto superior direito abre um menu.
- Itens do menu:
  - Preferências
  - Alterar senha
  - Opções da conta
  - Sair
- `Preferências`, `Alterar senha` e `Opções da conta` são placeholders visuais.
- `Sair` executa o logout real já existente.

## Confirmações de segurança

- Nenhum backend foi alterado.
- Nenhum frontend legado foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi alterada.
- Nenhum endpoint novo foi criado.
- Nenhuma API nova foi consumida.
- Nenhuma API de escrita foi usada.
- Nenhum token, senha, cookie ou Authorization completo foi registrado.

## Limitações

- Os submenus além de `Pacientes` são visuais nesta etapa.
- O painel contextual não abre módulos reais fora do contrato.
- Não há integração com odontograma, tratamentos ou orçamento.

## Próximos passos

- validar visualmente a abertura do painel contextual;
- refinar espaços e quebra de texto, se necessário;
- seguir para a próxima tela funcional somente após estabilizar este padrão de navegação.
