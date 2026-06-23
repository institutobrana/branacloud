# `frontend-react` - menu contextual lateral na shell operacional

## Escopo da etapa

Esta etapa ajusta a shell do `frontend-react` para um modelo mais próximo da referência observada:

- rail principal;
- painel contextual branco ao lado;
- grupos principais;
- submenus visuais por grupo;
- botão inferior para recolher e expandir a barra.

A implementação preserva a tela **Pacientes somente leitura** já concluída.

## Referência visual usada

- Sistema odontológico de referência auditado anteriormente.
- Padrão visual observado: barra lateral principal com grupos e painel contextual lateral.
- Paleta Brana já usada no shell atual.

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

## Submenus criados

### Atendimento

- Agenda
- Novo atendimento
- Timeline do paciente
- Gerenciar tratamentos
- Ficha clínica
- Ficha de anamnese
- Documentos

### Cadastro

- Pacientes
- Convênios atendidos
- Corpo clínico
- Fornecedores
- Unidades de atendimento

### Financeiro

- Recebimentos
- Contas a pagar
- Caixa
- Formas de pagamento
- Relatórios financeiros

### Tabelas

- Procedimentos
- Índices financeiros
- Convênios
- Materiais
- Bancos

### Relatórios

- Relatórios clínicos
- Relatórios financeiros
- Relatórios estatísticos
- Documentos

### Configuração

- Usuários
- Permissões
- Preferências
- Parâmetros do sistema

### Ferramentas

- Importações
- Utilitários
- Manutenção

### Ajuda

- Suporte
- Sobre o Brana Cloud

## Comportamento expandido / recolhido

- Barra recolhida: largura aproximada de `72px`, com ícones e tooltips.
- Barra expandida: largura aproximada de `184px`, com ícone + texto.
- O botão inferior alterna entre recolher e expandir.
- A identidade visual permanece Brana, sem perder a leitura clínica.

## Comportamento do painel contextual

- O painel abre ao lado da rail.
- O painel tem fundo branco e sombra leve.
- O painel mostra título do grupo.
- O painel lista os submenus do grupo ativo.
- O painel pode ser fechado.
- Pacientes é selecionável dentro de Cadastro.
- Itens fora do contrato permanecem como placeholders visuais.

## Como acessar Pacientes

- Abrir `http://localhost:5173/app`.
- Clicar em `Cadastro`.
- Selecionar `Pacientes`.
- A tela Pacientes somente leitura continua intacta.

## Confirmações de segurança

- Nenhum backend foi alterado.
- Nenhum frontend legado foi alterado.
- Nenhum banco foi alterado.
- Nenhuma migration foi alterada.
- Nenhum endpoint novo foi criado.
- Nenhuma API nova foi consumida.
- Nenhuma API de escrita foi usada.
- Nenhum token, senha ou Authorization completo foi registrado.

## Limitações

- Os submenus fora de `Pacientes` são somente visuais nesta etapa.
- O painel contextual ainda não dispara módulos reais além de `Pacientes`.
- Não há paginação nem novas APIs.

## Próximos passos

- validar visualmente abertura/fechamento da rail;
- ajustar detalhes finos de espaçamento, se necessário;
- seguir com a próxima tela funcional somente após estabilizar este shell contextual.
