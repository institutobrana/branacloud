# Contrato tecnico - extracao segura da tela principal e faixa de paciente

## 1. Identificacao

Produto: Brana Cloude

Area funcional: Tela principal / shell global

Natureza deste documento: contrato tecnico e inventario de lacunas

Status: documental apenas

## 2. Objetivo

Este contrato formaliza a separacao segura dos dois campos globais de paciente que hoje estao acoplados ao monolito do frontend:

- campo de codigo do paciente;
- campo de nome completo do paciente.

Tambem formaliza o comportamento esperado quando o usuario digita o codigo do paciente e pressiona `Enter` ou `Tab`:

- o sistema deve localizar o paciente;
- o paciente deve ser aberto como contexto ativo;
- a interface principal deve refletir esse paciente em uso;
- o fluxo de `Novo tratamento` deve reutilizar esse contexto.

Este documento nao implementa nada.

Este documento nao autoriza alteracao de codigo sem a etapa de planejamento e validacao.

## 3. Motivacao funcional

A regra descrita pelo usuario exige que a tela principal nao seja apenas visual:

- o campo de codigo deve aceitar digitacao humana;
- `Enter` ou `Tab` devem acionar busca;
- o paciente retornado deve passar a ser o paciente em uso;
- o campo de nome deve refletir o nome completo do paciente encontrado;
- a tela de tratamento deve receber esse mesmo contexto.

Isso significa que a extração precisa envolver:

- frontend;
- uma dependencia minima de backend para lookup por codigo;
- conservacao do estado de paciente em uso.

## 4. Estado atual do Brana Cloude

### 4.1 O que ja existe

- o shell principal do sistema ja existe em `frontend/index.html`;
- a faixa visual de paciente em uso ja foi prototipada no frontend;
- existe sincronizacao de paciente em uso via `frontend/js/modules/paciente-em-uso-header.js`;
- existe um gate de tratamento dependente de paciente em uso em `frontend/js/modules/novo-tratamento-paciente-gate.js`;
- existe busca de paciente por codigo no backend em `GET /cadastros/pacientes/por-codigo/{codigo}`;
- existe menu de pacientes funcional em `fichaMenuPac`;
- existe contexto de paciente usado por odontograma e ficha pessoal;
- existem filtros por `clinica_id` e autenticacao nas rotas de pacientes.

### 4.2 O que ainda esta acoplado ao monolito

- montagem do shell principal dentro de `frontend/index.html`;
- sincronizacao do cabeçalho de paciente pelo `app.js`;
- dependencias visuais e de estado espalhadas em mais de um arquivo;
- falta um modulo unico e proprio para a tela principal como porta de entrada da faixa de paciente.

## 5. Diretriz de separacao segura

O objetivo nao e reescrever o sistema.

O objetivo e retirar a responsabilidade da faixa global de paciente do monolito e colocar essa responsabilidade em um modulo proprio, com transicao controlada.

Diretriz principal:

1. manter o comportamento atual funcionando durante a transicao;
2. criar um modulo proprio para a tela principal;
3. reaproveitar a rota de lookup de paciente ja existente;
4. so depois remover o trecho antigo do monolito.

## 6. Arquitetura alvo

### 6.1 Frontend

Arquivo alvo recomendado:

- `frontend/js/modules/prontuario.js`

Responsabilidades desse modulo:

- montar a faixa de paciente em uso;
- exibir `Paciente:`;
- manter o campo de codigo do paciente;
- manter o campo de nome completo do paciente;
- tratar `Enter` e `Tab` no campo de codigo;
- disparar lookup por codigo;
- sincronizar o paciente ativo na tela principal;
- expor uma API simples para outros modulos consumirem o mesmo contexto.

### 6.2 Backend

O backend ja possui a rota de lookup:

- `GET /cadastros/pacientes/por-codigo/{codigo}`

Portanto, a decisao segura e:

- primeiro tentar reutilizar essa rota existente;
- so criar um novo arquivo de backend se houver necessidade real de uma fachada propria para a tela principal.

Se um arquivo novo de backend for criado, a convencao do projeto recomenda uso de nome Python com underscore, por exemplo:

- `backend/routes/tela_principal_routes.py`

Observacao:

- o nome `tela-principal.py` nao e o padrao do repositorio para arquivos Python;
- o contrato considera essa diferenca para evitar problema de convencao e importacao.

## 7. Fluxo funcional esperado

### 7.1 Quando o usuario digita um codigo valido

1. o usuario informa o codigo do paciente no campo de codigo;
2. o usuario pressiona `Enter` ou `Tab`;
3. o frontend executa lookup seguro;
4. o backend retorna o paciente da clinica atual;
5. o modulo da tela principal atualiza codigo e nome;
6. o paciente passa a ser o paciente em uso;
7. `Novo tratamento` pode usar esse contexto.

### 7.2 Quando o codigo nao existe

Fluxo de fallback recomendado:

1. manter o foco no contexto de paciente;
2. exibir mensagem clara de nao encontrado;
3. abrir o `Menu de pacientes` como alternativa segura, se o desenho do fluxo exigir;
4. nunca criar paciente silenciosamente neste passo.

### 7.3 Quando nao ha paciente em uso

Fluxo recomendado:

1. a tela principal deve continuar visivel;
2. os campos podem ficar vazios ou em estado neutro;
3. `Novo tratamento` deve depender do gate existente;
4. a selecao de paciente pode ser feita via lookup por codigo ou menu.

## 8. Regras de comportamento do campo de codigo

- deve aceitar entrada numerica de forma simples;
- `Enter` deve acionar busca;
- `Tab` deve acionar busca antes de mover o foco;
- a busca deve ser autentica e filtrada por `clinica_id`;
- o frontend nao deve decidir sozinho qual paciente pertence a qual clinica;
- a resposta do backend e a fonte de verdade.

## 9. Regras de comportamento do campo de nome

- o campo de nome completo e derivado do paciente localizado;
- nao deve ser tratado como entrada primaria no fluxo inicial por codigo;
- deve refletir o paciente ativo;
- deve permanecer sincronizado quando outro modulo trocar o paciente em uso.

## 10. Relacao com o modulo de tratamento

O modulo de tratamento nao deve duplicar a responsabilidade do paciente em uso.

Nesse contrato:

- `prontuario.js` passa a ser a porta de entrada visual do contexto do paciente;
- `novo-tratamento-paciente-gate.js` continua como ponte de decisao enquanto a extracao nao estiver fechada;
- `BranaNovoTratamentoModal` continua recebendo o paciente ja resolvido;
- o tratamento nao deve tentar resolver paciente por conta propria se a tela principal ja o tiver resolvido.

## 11. O que fica fora do escopo

Este contrato nao inclui:

- redesenho da toolbar;
- refatoracao geral de `frontend/app.js`;
- troca do modelo de paciente;
- alteracao de tabelas;
- criacao de migration;
- alteracao do fluxo de agenda, financeiro ou odontograma;
- alterar o menu de pacientes;
- criar novo paciente automaticamente ao digitar codigo invalido;
- persistencia de tratamento;
- alteracao de permissao.

## 12. Dependencias confirmadas

- usuario autenticado;
- `clinica_id` da sessao;
- endpoint de lookup por codigo do paciente;
- menu de pacientes existente;
- contexto de paciente em uso;
- modulo de tratamento ja existente;
- regras de permissao da area de pacientes.

## 13. Riscos remanescentes

- duplicar a logica de paciente em mais de um modulo;
- criar outro lookup paralelo e perder a fonte de verdade;
- quebrar o foco/Tab da interface ao tratar a busca;
- deixar a tela principal dependente de estado espalhado;
- remover cedo demais o trecho antigo do monolito antes da validacao.

## 14. Plano de extracao segura

### Onda 1 - encapsulamento

- criar `frontend/js/modules/prontuario.js`;
- manter o comportamento atual ativo;
- fazer o novo modulo apenas observar e renderizar o estado.

### Onda 2 - lookup por codigo

- ligar `Enter` e `Tab` ao lookup seguro;
- reutilizar `GET /cadastros/pacientes/por-codigo/{codigo}`;
- abrir o paciente em uso ao retornar sucesso.

### Onda 3 - corte do monolito

- retirar a montagem antiga do shell;
- reduzir o uso direto do cabeçalho antigo;
- manter um fallback temporario caso algo falhe.

### Onda 4 - estabilizacao

- testar login;
- testar busca por codigo;
- testar selecao de paciente;
- testar `Novo tratamento`;
- testar logout;
- validar se a tela principal continua funcional apos refresh.

## 15. Critérios de aceite

A extracao so pode ser considerada segura quando:

- o campo de codigo abre o paciente correto via `Enter` ou `Tab`;
- o nome completo reflete o paciente encontrado;
- o paciente em uso fica consistente entre tela principal, menu de pacientes e novo tratamento;
- o backend continua filtrando por `clinica_id`;
- o monolito antigo pode ser removido sem perder o fluxo;
- a interface continua abrindo sem regressao visual ou funcional.

## 16. Proxima etapa recomendada

Proxima etapa recomendada:

- transformar este contrato em inventario detalhado de arquivos e depois iniciar a primeira onda de extracao com shim temporario.
