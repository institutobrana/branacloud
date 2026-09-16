# Contrato Funcional da Tela Principal do Brana Cloude

## 1. Objetivo

Definir o contrato funcional da tela principal odontologica do Brana Cloude, usando como referencia de equivalencia a tela principal do EasyDental, sem acoplamento ao legado visual e sem alterar o backend alem do necessario.

## 2. Escopo funcional da tela

A tela principal do Brana Cloude deve ser composta pelos seguintes blocos:

### 2.1 Camada global da aplicacao

- barra de menus global;
- toolbar global de atalhos;
- usuario autenticado e acao de sair;
- shell da aplicacao.

Esses elementos pertencem a aplicacao como um todo e nao ao odontograma isolado.

### 2.2 Camada de prontuario e paciente em uso

- identificacao do paciente em uso;
- campo de codigo do paciente;
- campo de nome do paciente;
- acao de busca/seleção de paciente;
- indicacao visual de paciente ativo ou sem paciente ativo.

### 2.3 Camada odontologica principal

- seletor de tratamento ativo;
- contagem resumida de intervencoes;
- area central do odontograma / arcada clinica;
- area de contexto clinico lateral;
- lista de procedimentos registrados;
- historico clinico inferior;
- feedback/status de carregamento.

## 3. Estados obrigatorios da tela

### 3.1 Estado sem paciente

Comportamento esperado:

- a tela permanece aberta;
- a faixa de paciente indica ausencia de paciente;
- o odontograma mostra estado vazio;
- o tratamento nao e selecionavel como caso carregado;
- os blocos laterais exibem estados vazios coerentes;
- a grade inferior nao deve simular dados clinicos inexistentes.

### 3.2 Estado com paciente ativo

Comportamento esperado:

- o paciente em uso fica visivel;
- o contexto de prontuario e odontograma aponta para o mesmo paciente;
- o sistema pode listar tratamentos disponiveis desse paciente;
- a tela nao perde o contexto ao alternar entre blocos.

### 3.3 Estado com tratamento selecionado

Comportamento esperado:

- o tratamento selecionado passa a ser a referencia da tela;
- o odontograma e os blocos relacionados refletem esse tratamento;
- a contagem de intervencoes e o historico ficam sincronizados;
- a troca de tratamento atualiza a tela sem recarregar indevidamente o paciente.

### 3.4 Estado com odontograma preenchido

Comportamento esperado:

- as arcadas e os dentes refletem o caso real do paciente;
- as intervencoes aparecem no odontograma;
- o historico e a lista de procedimentos ficam coerentes com o tratamento;
- o layout nao deve perder legibilidade quando houver muitos registros.

## 4. Fonte de dados por bloco

| Bloco | Fonte principal | Observacao |
|---|---|---|
| Barra global | `frontend/index.html` + shell principal | Pertence ao sistema inteiro |
| Toolbar global | `frontend/js/modules/toolbar-principal-primeira-onda.js` e shell existente | Reaproveitar, nao duplicar |
| Paciente em uso | `frontend/js/modules/paciente-em-uso-header.js` + prontuario | Deve sincronizar com odontograma |
| Busca de paciente | backend de pacientes + `frontend/js/modules/prontuario.js` | Lookup por codigo/nome |
| Seletor de tratamento | backend de tratamentos por paciente | Tratamento ativo governa a tela |
| Odontograma / arcada | backend de resumo odontologico | Eixo visual da tela |
| Contexto clinico | backend de paciente, tratamento, agenda, imagens e documentos | Pode receber campos vazios com estado claro |
| Procedimentos registrados | backend de intervencoes/procedimentos | Lista clinica de leitura |
| Historico clinico | backend de eventos e procedimentos | Grade inferior |
| Feedback/status | estado local do frontend | Deve informar carregamento e erro |

## 5. Comportamento esperado por bloco

### 5.1 Barra global

- permanecer fora do odontograma isolado;
- nao ser duplicada pelo modulo odontologico;
- continuar funcional durante navegação da aplicacao.

### 5.2 Paciente em uso

- apresentar o paciente ativo com codigo e nome;
- sincronizar com ficha e odontograma;
- refletir troca de paciente sem estado divergente.

### 5.3 Busca de paciente

- permitir localizar paciente pelo codigo;
- quando aplicavel, permitir busca por nome completo;
- atualizar o contexto ativo quando a busca for bem sucedida;
- exibir estado vazio ou falha de forma clara.

### 5.4 Odontograma / arcada

- mostrar a leitura clinica do caso selecionado;
- respeitar o tratamento ativo;
- nao inventar intervencoes ou faces ausentes;
- exibir estado vazio real quando nao houver dados.

### 5.5 Contexto clinico

- paciente, tratamento, observacoes, imagens, documentos e agenda devem ficar coerentes;
- blocos vazios devem ser explicitamente vazios;
- nenhuma area deve sugerir dado inexistente como se fosse real.

### 5.6 Procedimentos registrados

- listar os eventos do caso selecionado;
- manter ordenacao e legibilidade;
- nao misturar procedimentos de pacientes diferentes.

### 5.7 Historico clinico

- exibir os registros inferiores vinculados ao paciente/tratamento;
- preservar tabelas e colunas previsiveis;
- suportar textos longos sem quebrar o painel.

### 5.8 Feedback/status

- informar carregamento;
- informar erro de forma legivel;
- nao bloquear a navegação por mensagens incorretas.

## 6. Inventario consolidado dos quadros

1. Barra global da aplicacao.
2. Toolbar global.
3. Faixa de paciente em uso.
4. Campo de busca/localizacao de paciente.
5. Seletor de tratamento.
6. Odontograma / arcada clinica.
7. Contexto clinico lateral.
8. Procedimentos registrados.
9. Historico clinico inferior.
10. Feedback/status.

## 7. Regras de aceite da Fase 1

A Fase 1 so pode ser considerada fechada quando:

- os quadros obrigatorios estiverem listados;
- os estados obrigatorios estiverem descritos;
- a fonte de dados por bloco estiver definida;
- o comportamento esperado por bloco estiver definido;
- o inventario consolidado estiver registrado;
- a matriz EasyDental x Brana estiver alinhada com esse contrato.

## 8. Relacao com o roadmap

Este contrato alimenta as proximas fases:

- auditoria bloco a bloco;
- shell visual;
- blocos clinicos principais;
- backend complementar quando necessario;
- validacao comparativa;
- limpeza final do legado.
