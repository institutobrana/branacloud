# Mapeamento da tela principal do EasyDental para orientar a tela odontológica do Brana

## 1. Objetivo
Mapear a tela principal do EasyDental mostrada no print como referencia funcional e visual para orientar a futura tela principal odontologica do Brana Cloud, preservando a modularizacao e sem acoplar o Brana ao legado visual.

## 2. Escopo
- Mapear campos, blocos e funcoes visiveis no print do EasyDental.
- Separar o que e campo funcional, bloco de apoio, lista, grade ou area de contexto.
- Identificar o que pode ser reproduzido no Brana de forma modular.
- Sinalizar o que ainda depende do modulo Tratamento, que nao existe no Brana.

## 3. Confirmacao de leitura
Esta analise foi feita apenas a partir do print fornecido e do contexto tecnico ja auditado. Nenhum arquivo do sistema foi alterado nesta etapa.

## 4. Mapa funcional da tela

### 4.1 Barra superior de menus
Fato visual:
- Existe uma barra principal com menus como `Cadastro`, `Tratamento`, `Agenda`, `Relatório`, `Especialidade`, `Financeiro`, `Configuração`, `Ferramentas` e `Ajuda`.

Funcao provavel:
- Navegacao global do sistema.
- Acesso aos modulos principais.

Implicacao para o Brana:
- O Brana ja possui menus globais e essa camada deve permanecer fora do modulo odontograma.
- A tela odontologica futura precisa conviver com a shell principal, nao substitui-la.

### 4.2 Toolbar principal
Fato visual:
- Ha uma fileira de icones logo abaixo da barra de menus.
- Os icones funcionam como atalhos de acoes comuns do sistema.

Funcao provavel:
- Acoes rapidas de cadastro, consulta, confirmacao, cancelamento, navegacao e operacoes internas.

Implicacao para o Brana:
- Parte dessa toolbar ja existe no Brana e deve ser completada, nao refeita dentro do odontograma.
- O odontograma deve consumir a shell de toolbar existente, nao duplicar a barra.

### 4.3 Campo de paciente
Fato visual:
- Ha um campo `Paciente:` com area para codigo e nome.
- No print, o usuario pode localizar o paciente por codigo, primeiro nome ou nome completo.

Funcao provavel:
- Pesquisa/seleção do paciente.
- Entrada para abrir a ficha do paciente diretamente na mesma tela.

Implicacao para o Brana:
- Esse e um requisito-chave para a futura tela principal odontologica.
- O Brana precisa de um campo de busca de paciente persistente e rapido, integrado a ficha.

### 4.4 Odontograma principal
Fato visual:
- A area odontologica ocupa o bloco superior esquerdo central.
- Exibe arcada superior e inferior com dentes, numeros e pequenos marcadores.
- Essa area e o foco visual da tela.

Funcao provavel:
- Exibir a situacao odontologica do paciente/tratamento.
- Permitir leitura visual de dentes/posicao/intervencoes.

Implicacao para o Brana:
- Esta area deve ser o centro da nova tela principal odontologica.
- A geometria deve ser modulada, mas o bloco precisa ganhar protagonismo.

### 4.5 Seletor de intervencoes no tratamento
Fato visual:
- Ha uma lista/dropdown com texto como `Todas intervenções no tratamento`.

Funcao provavel:
- Filtro de exibicao de intervencoes/procedimentos.
- Alterna o que e mostrado no odontograma e na lista inferior.

Implicacao para o Brana:
- Mesmo sem o modulo Tratamento pronto, a tela deve prever esse filtro.
- Na V1 pode existir em modo de leitura ou referencia vazia.

### 4.6 Lista de procedimentos do odontograma
Fato visual:
- Abaixo do odontograma ha uma lista de procedimentos, com itens como `Cimentação adesiva`.
- Ao lado/abaixo ha uma faixa de pequenos icones relacionados aos procedimentos.

Funcao provavel:
- Selecionar o procedimento a aplicar/registrar.
- Navegar entre familias de procedimentos odontologicos.

Implicacao para o Brana:
- Essa lista e parte da experiencia odontologica principal, nao um detalhe secundario.
- Na versao sem escrita, pode entrar como lista de leitura e referencia semacao.

### 4.7 Barra de iconografia de procedimento
Fato visual:
- Ha pequenos icones coloridos, alinhados em faixa, logo abaixo da lista de procedimentos.

Funcao provavel:
- Atalho visual para tipos de procedimento, estados ou familias de procedimento.

Implicacao para o Brana:
- Deve ser tratada como camada semantica futura.
- Na V1, pode ser somente referencia ou legenda, sem copiar os BMPs do legado.

### 4.8 Botões laterais do bloco odontologico
Fato visual:
- Ha pequenos botões verticais ao lado da area de procedimentos.

Funcao provavel:
- Acoes curtas do odontograma: confirmar, editar, apagar, avancar, abrir detalhe.

Implicacao para o Brana:
- Se reproduzidos, devem ser modularizados como controles de contexto, nao como logica espalhada.

### 4.9 Painel direito de contexto
Fato visual:
- Ha uma coluna direita com areas rotuladas `Paciente`, `Tratamento`, `Observações`, `Imagens`, `Documentos` e `Agenda`.

Funcao provavel:
- Navegacao entre blocos de informacao do paciente.
- Visao de contexto do atendimento.

Implicacao para o Brana:
- Esse e um dos pontos mais importantes da futura tela principal.
- No Brana, essas areas devem virar cards/painels modulares, cada um com responsabilidade clara.

### 4.10 Agenda
Fato visual:
- Na area direita ha uma agenda com data, hora e um item de disponibilidade/ocupacao.

Funcao provavel:
- Mostrar agendamento do paciente ou agenda geral associada ao contexto.

Implicacao para o Brana:
- Pode ser integrado como painel secundario, mantendo o odontograma no centro.

### 4.11 Grade de historico
Fato visual:
- No rodape existe uma tabela com colunas `Data`, `Cirurgião`, `Região` e `Descrição do procedimento`.

Funcao provavel:
- Historico clinico/procedimental do paciente.
- Lista de eventos executados.

Implicacao para o Brana:
- Essa grade e muito importante para a tela principal odontologica.
- Deve ser modularizada de forma parecida com a ficha pessoal, reutilizando o padrão de tabela/historico sem copiar codigo de forma monolitica.

## 5. Mapeamento resumido por elemento

| Elemento no EasyDental | Função observada/provável | Destino sugerido no Brana |
|---|---|---|
| Barra de menus | Navegação global | Fora do modulo odontograma, na shell principal |
| Toolbar superior | Atalhos e acoes comuns | Reaproveitar a toolbar já existente |
| Campo de paciente | Buscar/abrir paciente | Módulo de busca integrado à tela principal |
| Odontograma | Visual principal odontológico | Area central principal |
| Seletor de intervencoes | Filtro de leitura/seleção | Painel/filtro de contexto |
| Lista de procedimentos | Seleção de procedimento | Painel modular de procedimentos |
| Icones de procedimento | Semântica visual | Legenda/camada futura |
| Botões laterais | Ações curtas | Controles de contexto modularizados |
| Painel direito de contexto | Paciente, tratamento, imagens, docs, agenda | Cards laterais modulares |
| Agenda | Contexto temporal | Painel secundario |
| Grade de histórico | Eventos clínicos | Rodape em tabela modular |

## 6. Fatos confirmados
- A tela do EasyDental mostrada no print e uma tela principal integrada, nao uma tela isolada de odontograma.
- O odontograma e a area central mais importante, mas convive com menus, toolbar, contexto, lista de procedimentos e historico.
- O modulo Tratamento ainda nao existe no Brana, entao o fluxo completo nao pode ser copiado ainda.
- O Brana ja tem parte da shell global e uma toolbar base, o que reduz o trabalho de reconstruir a camada superior.

## 7. Hipoteses de uso
- O campo de paciente deve aceitar codigo, primeiro nome ou nome completo.
- O seletor de tratamentos/procedimentos pode ser adaptado para leitura antes da escrita existir.
- O historico inferior pode ser reusado como estrutura para uma grade clínica modular.
- O painel direito pode virar um conjunto de cards de contexto, cada um responsavel por um tipo de informacao.

## 8. O que o Brana deve reproduzir
- Shell principal com menus globais existentes.
- Toolbar superior completa, reaproveitando a que ja existe.
- Campo de busca de paciente persistente.
- Odontograma como area central dominante.
- Painel lateral de contexto.
- Lista/procedimentos em faixa secundaria.
- Grade de historico inferior.

## 9. O que o Brana nao deve reproduzir literalmente
- Layout monolitico do EasyDental.
- Dependencia direta dos BMPs legados.
- Comportamento de escrita antes do modulo Tratamento existir.
- Mistura de responsabilidades em um unico arquivo.

## 10. Riscos de acoplamento
- Tentar copiar a tela inteira do EasyDental antes de modularizar a estrutura no Brana.
- Misturar busca de paciente, odontograma, procedimentos e historico no mesmo bloco de codigo.
- Repetir assets do legado sem reencaixe visual no Brana.
- Criar uma tela grande e rigida em vez de uma shell modular.

## 11. Plano de ação para o Brana
### Fase 1 - Shell odontologica
- Reaproveitar menus globais e toolbar existente.
- Criar um host odontologico modular, sem `app.js` monolitico.
- Inserir campo de busca do paciente no topo do contexto odontologico.

### Fase 2 - Area central odontograma
- Manter a arcada como foco principal.
- Integrar leitura de tratamento quando o modulo existir.
- Preparar area para odontograma preenchido e vazio.

### Fase 3 - Procedimentos e contexto lateral
- Criar painel modular de procedimentos.
- Criar cards laterais para paciente, tratamento, observações, imagens, documentos e agenda.

### Fase 4 - Historico inferior
- Criar grade historica com quatro colunas semelhantes ao EasyDental.
- Reaproveitar padrao modular de tabela/historico da ficha pessoal, sem mistura com escrita.

### Fase 5 - Tratamento
- Quando o modulo existir, conectar busca do paciente ao tratamento e ao odontograma preenchido.
- Somente depois disso pensar em escrita clinica.

## 12. Recomendacao objetiva para a proxima subetapa
- Antes de codificar a tela principal, consolidar a arquitetura de tela em módulos separados:
  - shell principal odontologica,
  - busca do paciente,
  - area odontograma,
  - painel de procedimentos,
  - painel lateral de contexto,
  - tabela de historico.

## 13. Registro para roadmap
- Mapeamento funcional da tela principal do EasyDental concluido para orientar a futura tela principal odontologica do Brana, preservando modularizacao e sem acoplamento ao legado.
