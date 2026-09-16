# Investigação detalhada da tela principal / odontograma do EasyDental em `Y:\EDS70`

## 1. Objetivo
Mapear com detalhe a tela principal odontológica do EasyDental instalada em `Y:\EDS70`, cobrindo a relaçāo entre menus, toolbar, paciente, odontograma, procedimentos, histórico e demais módulos visíveis, para orientar a equivalência funcional no Brana Cloud sem acoplamento monolítico ao legado.

## 2. Escopo
- Investigar a instalação local em `Y:\EDS70`.
- Ler a DSN, a estrutura de arquivos e a base SQL associada.
- Mapear campos e funções observadas na tela principal odontológica.
- Identificar o que é diretamente reproduzível no Brana e o que depende do módulo `Tratamento`.
- Produzir plano de ação modular para o Brana.

## 3. Confirmação de leitura e método
Esta investigação foi feita em modo somente leitura, usando:
- estrutura física da instalação `Y:\EDS70`;
- DSN do EasyDental;
- SQL Server local para leitura da base `EDS70`;
- inspeção dos diretórios `Bitmaps`, `Objetos` e `Textos`.

Observação importante:
- Não foi possível operar a interface gráfica do EasyDental diretamente nesta sessão.
- A análise abaixo se baseia na instalação viva, na base SQL e no print fornecido pelo usuário, o que permite mapear o comportamento com bastante precisão estrutural, mas não substituir uma sessão guiada por clique.

## 4. Instalação investigada
- Caminho: `Y:\EDS70`
- DSN: `SERVER=DELL_SERVIDOR\\EDS70`, `DATABASE=eds70`
- Base local consultada: `EDS70` via `.\SQLEXPRESS`

## 5. Estrutura observada da instalação

### 5.1 Diretórios relevantes
- `Bitmaps`
- `Dados`
- `Objetos`
- `Textos`
- `Help`
- `Icones`
- `Reports`
- `TISS`
- `Fotos`

### 5.2 Indícios de acervo funcional do odontograma
- `Dados\Dist\_SIMBOLO_ODONTO.raw`
- `Dados\Dist\_STATUS_INTERV.raw`
- `Dados\Dist\TAB_PRC_ITEM.raw`
- `Dados\Dist\TAB_GEN_ITEM.raw`
- `Bitmaps\arc_*`
- `Bitmaps\arc_*_i.bmp`
- `Bitmaps\arc_*_s.bmp`
- `Objetos\arc_dente11.dat` a `Objetos\arc_dente85.dat`

## 6. Mapa funcional da tela principal odontológica

### 6.1 Barra de menus
Fato observado:
- Menus globais: `Cadastro`, `Tratamento`, `Agenda`, `Relatório`, `Especialidade`, `Financeiro`, `Configuração`, `Ferramentas`, `Ajuda`.

Função:
- Navegação global do sistema.
- Acesso aos módulos principais.

Relação com o Brana:
- Deve permanecer como shell global, fora do módulo odontograma.

### 6.2 Toolbar superior
Fato observado:
- Uma fileira de ícones de ação rápida logo abaixo dos menus.

Função:
- Atalhos de operações comuns e contexto do sistema.

Relação com o Brana:
- O Brana já possui uma toolbar base; a próxima evolução precisa completá-la, não duplicá-la dentro do odontograma.

### 6.3 Busca/seleção do paciente
Fato observado:
- Campo `Paciente:` com código e nome.
- O comportamento descrito pelo usuário indica busca por código, primeiro nome ou nome completo.

Campos do Brana que devem equivaler:
- `PESSOAL.NROPAC`
- `PESSOAL.COD_PRONTUARIO`
- `PESSOAL.PRINOM`
- `PESSOAL.SEGNOM`

Função:
- Localizar e abrir a ficha do paciente diretamente na tela principal odontológica.

### 6.4 Odontograma principal
Fato observado:
- Área central com arcada superior e inferior, dentes, números e marcadores.

Campos/tabelas relacionadas:
- `ARCADA.NROPAC`
- `ARCADA.NROTRA`
- `ARCADA.NRODEN`
- `ARCADA.NROODONTO`
- `ARCADA.ANOMALIAS`
- `ARCADA.OBSERV`
- `ARCADA.MATRIZ3D_*`

Função:
- Mostrar a leitura odontológica do tratamento.
- Exibir slots/dentes com posições e estados visuais.

### 6.5 Filtro/selector de intervenções
Fato observado:
- Combobox como `Todas intervenções no tratamento`.

Função:
- Filtrar o que está sendo mostrado no odontograma e na lista de procedimentos.

Dependência:
- Depende da existência de `TRATAMENTO` e `INTERVENCAO`.

### 6.6 Lista de procedimentos
Fato observado:
- Lista com descrições como `Cimentação adesiva`.
- Faixa de pequenos ícones logo abaixo.

Função:
- Selecionar/focar procedimento.
- Navegar entre famílias de procedimento odontológico.

Campos/tabelas relacionadas:
- `TAB_PRC_ITEM.DESCRICAO`
- `TAB_PRC_ITEM.NROSIM`
- `TAB_PRC_ITEM.MOSTRAR_SIMBOLO`
- `TAB_GEN_ITEM.NOME`
- `TAB_GEN_ITEM.ID_SIMBOLO`
- `_SIMBOLO_ODONTO.DESCRICAO`
- `_SIMBOLO_ODONTO.BITMAP1/2/3`
- `_SIMBOLO_ODONTO.ICONE`

### 6.7 Coluna de contexto lateral
Fato observado:
- Painéis/rotulagem para `Paciente`, `Tratamento`, `Observações`, `Imagens`, `Documentos`, `Agenda`.

Função:
- Contexto clínico e navegação entre áreas relacionadas ao atendimento.

Relação com o Brana:
- Deve virar conjunto de cards/painéis modulares.

### 6.8 Agenda
Fato observado:
- Área com data, horário e disponibilidade.

Função:
- Mostrar compromisso e contexto de agenda.

Campos/tabelas relacionadas:
- `AGENDA`
- `AGENDA_BLOQUEIO`
- `COMPROMISSO`
- `_STATUS_AGENDA`

### 6.9 Grade inferior de histórico
Fato observado:
- Tabela com 4 colunas no print: `Data`, `Cirurgião`, `Região`, `Descrição do procedimento`.

Função:
- Registrar a narrativa clínica e os eventos executados.

Campos/tabelas relacionadas:
- `HISTORICO.DATA`
- `HISTORICO.DESCRICAO`
- `HISTORICO.NRODENTE`
- `HISTORICO.ID_PRESTADOR`
- `HISTORICO.COR`
- `HISTORICO.NROINTPAC`

## 7. Evidências reais encontradas no banco

### 7.1 Paciente observado
- `NROPAC = 214`
- Nome: `Walter Jurandir Poceiro Filho`

### 7.2 Tratamento observado
- `NROTRA = 239`
- Data inicial: `2008-11-03`
- Data final: `2008-11-14`
- `ARCADA`: 32 linhas
- `INTERVENCAO`: 17 linhas
- `HISTORICO`: 4 linhas ligadas ao `NROINTPAC` do tratamento

### 7.3 Arcada do tratamento 239
- 32 slots confirmados.
- `NROODONTO` segue a lógica FDI.
- Há slots vazios/separadores com `NROODONTO = 0`.

### 7.4 Intervenções do tratamento 239
Status observados:
- `1 = Observada`
- `2 = Realizada`
- `3 = Realizar`

Exemplos de procedimentos reais ligados ao tratamento 239:
- `90` - Tratamento de Canal - (Incisivos)
- `29` - Exodontia simples - (Posteriores)
- `116` - Implante ósseo integrável - Standard
- `105` - Curativo
- `180` - Coroa metalo-cerâmica

### 7.5 Histórico do paciente 214
Exemplos observados:
- `Profilaxia - (Ultrason e Jato de Bicarbonato)`
- `Remoção de restauração antiga + remoção de tec. cariado + ...`
- `Compareceu e relatou que viu mancha escura nos dentes...`
- `Cicatrização externa ok + pedido de RX PAN + ...`

Fato importante:
- O histórico mistura narrativa clínica, confirmação de agendamento, finalização de atendimento e descrição de procedimento.

## 8. Leitura funcional do comportamento real
- A tela principal do EasyDental não é só o odontograma.
- O odontograma é o centro clínico, mas a tela inteira funciona como shell odontológica integrada.
- O módulo `Tratamento` é estruturalmente importante para preencher a tela com odontograma e procedimentos.
- O histórico inferior funciona como narrativa clínica/operacional e deve ser modelado como grade modular.

## 9. O que o Brana deve reproduzir
- Shell principal odontológica modular.
- Busca persistente do paciente.
- Painel/seleção de tratamento.
- Área central do odontograma.
- Lista de procedimentos.
- Painéis laterais de contexto.
- Grade inferior de histórico.

## 10. O que o Brana não deve reproduzir literalmente
- Layout monolítico do EasyDental.
- Dependência direta de BMPs legados.
- Especificidade de comportamento ainda dependente do módulo `Tratamento` sem existir a base dele.
- Lógica concentrada em `app.js`.

## 11. Plano de ação modular para o Brana

### 11.1 Fase 1 - Shell odontológica
- Reusar menus globais e toolbar já existentes.
- Criar um host odontológico modular.
- Adicionar busca de paciente por código/nome.

### 11.2 Fase 2 - Contexto e tratamento
- Criar módulo `Tratamento`.
- Conectar paciente -> tratamento -> odontograma.
- Exibir seleção/filtro de intervenções.

### 11.3 Fase 3 - Odontograma central
- Manter arcada como área principal.
- Exibir slots/dentes por tratamento.
- Preservar leitura vazia e preenchida.

### 11.4 Fase 4 - Procedimentos e histórico
- Criar painel modular de procedimentos.
- Criar grade de histórico com 4 colunas.
- Reaproveitar padrão de tabela da ficha pessoal, sem monolito.

### 11.5 Fase 5 - Evolução clínica
- Só depois pensar em escrita clínica, edição anatômica e estados mais ricos.

## 12. Recomendação objetiva
- Antes de codificar a tela principal, decompor a futura interface em módulos:
  - `odontograma-shell`
  - `paciente-search`
  - `tratamento-context`
  - `odontograma-canvas`
  - `procedures-panel`
  - `clinical-history-grid`
  - `side-context-panels`

## 13. Limitação explícita desta investigação
- A sessão não permitiu interação direta por clique na GUI do EasyDental.
- Ainda assim, a base viva `Y:\EDS70` e o SQL Server local deram evidência suficiente para mapear o comportamento funcional real com alto grau de confiança.

## 14. Registro para roadmap
- Investigação detalhada da tela principal odontológica do EasyDental concluída para orientar a criação modular da tela principal do Brana Cloud, sem acoplamento monolítico ao legado.
