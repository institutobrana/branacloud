# Contrato de implementacao - Onda 1 da extracao da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: contrato tecnico de implementacao

Status: documental apenas

## 2. Objetivo da Onda 1

Esta Onda 1 tem um objetivo estreito:

- criar um modulo proprio para a tela principal;
- tirar a responsabilidade de montagem da faixa de paciente do monolito direto;
- manter o comportamento atual funcionando por meio de fallback temporario;
- preparar a base para a busca por codigo de paciente sem quebrar o fluxo existente.

Esta Onda 1 nao implementa backend novo.

Esta Onda 1 nao altera banco.

Esta Onda 1 nao remove o monolito antigo ainda.

## 3. Regra central da Onda 1

A Onda 1 e somente encapsulamento com preservacao de comportamento.

Isto significa:

1. o novo modulo passa a concentrar a orquestracao da tela principal;
2. o helper visual atual continua disponivel como motor interno ou fallback;
3. o `app.js` apenas delega o minimo necessario;
4. a interface continua abrindo mesmo se o novo modulo falhar;
5. nenhuma rota nova e criada nesta onda.

## 4. Fronteira exata de arquivos

### 4.1 Arquivo novo alvo

- `frontend/js/modules/prontuario.js`

Responsabilidades da Onda 1 para este arquivo:

- ser o modulo de entrada da tela principal;
- montar e observar a faixa de paciente em uso;
- preparar o campo de codigo do paciente;
- reagir a `Enter` e `Tab`;
- chamar a busca por codigo quando necessario;
- sincronizar o estado de paciente em uso;
- expor uma API simples para os demais modulos consultarem o paciente ativo.

### 4.2 Arquivo auxiliar existente

- `frontend/js/modules/paciente-em-uso-header.js`

Papel nesta onda:

- continuar renderizando a faixa visual;
- fornecer o bloco visual reutilizavel da faixa;
- manter a compatibilidade com o estado atual;
- servir de fallback interno caso o modulo principal ainda nao esteja totalmente acoplado.

### 4.3 Arquivo de gate existente

- `frontend/js/modules/novo-tratamento-paciente-gate.js`

Papel nesta onda:

- continuar como gate de seguranca para `Tratamento -> Novo tratamento`;
- continuar usando paciente em uso ja resolvido;
- nao assumir responsabilidade de lookup por codigo;
- nao ser reescrito nesta onda.

### 4.4 Arquivo de modal existente

- `frontend/js/modules/novo-tratamento-modal.js`

Papel nesta onda:

- continuar consumindo o paciente ja resolvido;
- nao realizar busca por codigo por conta propria;
- nao ser refatorado fora do que for estritamente necessario para consumo de contexto.

### 4.5 Arquivo monolitico de fachada temporaria

- `frontend/app.js`

Papel permitido nesta onda:

- manter apenas a chamada minima para garantir que o modulo novo seja carregado;
- manter os pontos de sincronizacao ja existentes enquanto houver risco de corte;
- evitar duplicacao de regras;
- nao concentrar nova logica de tela principal.

### 4.6 Arquivo de layout global

- `frontend/index.html`

Papel permitido nesta onda:

- manter o ponto de ancoragem temporario da faixa;
- incluir o modulo novo;
- preservar a barra superior, a toolbar e o workspace;
- nao redesenhar o shell nesta onda.

## 5. Reaproveitamento de backend

### 5.1 Rotas existentes que devem ser reutilizadas

- `GET /cadastros/pacientes/por-codigo/{codigo}`
- `GET /cadastros/pacientes/{paciente_id}`
- `GET /cadastros/pacientes/menu`
- `GET /cadastros/pacientes/menu-options`

### 5.2 Regra de backend desta onda

- nenhuma rota nova e criada nesta Onda 1;
- nenhuma facade backend nova e criada nesta Onda 1;
- o backend existente e suficiente para o lookup inicial;
- a separacao de arquivos Python fica para uma onda posterior, apenas se houver justificativa tecnica real.

## 6. Fluxo de implementacao permitido

### 6.1 Entrada

1. o sistema carrega a tela principal;
2. `frontend/index.html` importa `frontend/js/modules/prontuario.js`;
3. o modulo novo inicializa a faixa de paciente;
4. o helper atual pode ser usado como base de render;
5. o `app.js` continua como fachada temporaria.

### 6.2 Busca por codigo

1. o usuario digita o codigo do paciente;
2. pressiona `Enter` ou `Tab`;
3. o modulo chama o lookup existente por codigo;
4. o paciente encontrado torna-se o paciente em uso;
5. a faixa exibe codigo e nome completo;
6. `Novo tratamento` continua consumindo o mesmo contexto.

### 6.3 Fallback temporario

Se o novo modulo nao estiver disponivel ou falhar:

- o `app.js` continua podendo acionar o helper atual;
- o header antigo continua apto a sincronizar o estado;
- o menu de pacientes continua sendo alternativa segura;
- a interface nao pode ficar sem paciente em uso por falha de montagem.

## 7. O que deve sair do monolito nesta onda

Nesta onda, apenas a responsabilidade de orquestracao da faixa de paciente e da busca por codigo deve sair do monolito direto.

Nao deve sair ainda:

- a toolbar global;
- o menu superior;
- o fluxo de logout;
- a sessao do usuario;
- o gate de novo tratamento;
- o modal de novo tratamento;
- o menu de pacientes;
- o resto do workspace.

## 8. O que nao deve ser tocado nesta onda

- backend novo;
- banco;
- migration;
- seed;
- permissao;
- autenticaÃ§Ã£o;
- fluxo de logout;
- toolbar;
- odontograma;
- agenda;
- financeiro;
- editor de textos;
- layout geral da shell;
- criacao de nova regra de paciente em uso fora da tela principal.

## 9. Riscos

- duplicar estado de paciente se `prontuario.js` e `paciente-em-uso-header.js` passarem a competir entre si;
- quebrar o foco/Tab ao capturar o lookup;
- remover o fallback cedo demais;
- fazer o `app.js` virar novamente um orquestrador pesado;
- acoplar a Onda 1 a uma nova rota backend sem necessidade.

## 10. Criterios de aceite

A Onda 1 so pode ser considerada bem-sucedida se:

- a tela principal continuar abrindo;
- a faixa de paciente continuar aparecendo;
- o lookup por codigo continuar funcionando;
- `Enter` e `Tab` dispararem a busca;
- o paciente continuar vindo da mesma sessao/clinica;
- `Novo tratamento` continuar recebendo o contexto correto;
- o fallback temporario continuar disponivel durante toda a transicao.

## 11. Onda seguinte esperada

Depois da Onda 1, a fase natural e:

- consolidar o lookup e a troca de paciente;
- medir se o `app.js` pode perder mais responsabilidade;
- somente depois decidir se vale criar uma fachada backend propria ou se a rota atual continua suficiente.

## 12. Conclusao

Este contrato deixa a Onda 1 limitada, segura e reversivel:

- um arquivo novo centraliza a entrada da tela principal;
- um helper existente continua renderizando a faixa;
- o monolito ainda permanece como fallback;
- nenhuma mudanca de banco ou backend novo e autorizada aqui.
