# Auditoria runtime - fluxo `Tratamento -> Novo tratamento`

## Objetivo

Registrar a auditoria técnica do fluxo real em runtime para o acionamento `Tratamento -> Novo tratamento`, com foco em:

- abrir o `Menu de pacientes` quando nao existir paciente em uso;
- aplicar o paciente selecionado no contexto real da tela odontologica;
- continuar a abertura do modal `Novo tratamento`;
- evitar o desvio para `Ficha pessoal` nesse fluxo especial.

## Escopo auditado

- `frontend/app.js`
- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/js/modules/tela-principal-odontologica-entrada.js`
- `frontend/js/modules/tela-principal-odontologica-layout.js`
- `frontend/js/modules/tela-principal-odontologica-estado.js`
- `frontend/js/modules/tela-principal-odontologica-contratos.js`
- `frontend/js/modules/paciente-em-uso-header.js`
- `frontend/index.html`

## Descobertas tecnicas

### 1. Causa do desvio para `Ficha pessoal`

O fluxo padrao do menu de pacientes em `frontend/app.js` ainda termina em `fichaMenuPacConfirmar()` com fallback para:

- `fichaCarregarPacientePorId(id, false)`
- `fichaEnsureUI()`
- `hideAllPanels()`
- exibicao do painel da ficha pessoal
- `fichaSetTab("dados")`

Ou seja: sem callback especial, o menu continua orientado para a `Ficha pessoal`.

### 2. Fluxo especial do `Novo tratamento`

O gate `frontend/js/modules/novo-tratamento-paciente-gate.js` foi ajustado para:

- detectar paciente em uso;
- abrir o modal direto quando já houver paciente;
- abrir o `Menu de pacientes` quando nao houver paciente;
- ao selecionar paciente, aplicar o contexto real da tela principal odontologica;
- abrir o modal `Novo tratamento` depois da selecao;
- nao depender do fluxo legado da `Ficha pessoal`.

### 3. Lacuna de integracao encontrada

A auditoria runtime mostrou que o contexto visual da tela principal odontologica nao estava sendo montado porque os modulos de `tela-principal-odontologica-*` nao estavam carregados em `frontend/index.html`.

Sintoma observado antes da correcao:

- o menu de pacientes abria;
- o paciente era selecionado;
- o modal `Novo tratamento` abria;
- a area principal ficava no estado vazio (`Bem-vindo`), sem o host da tela principal.

### 4. Correcao de integracao aplicada

Foram adicionados ao `frontend/index.html` os scripts da tela principal odontologica:

- `tela-principal-odontologica-contratos.js`
- `tela-principal-odontologica-assets.js`
- `tela-principal-odontologica-estado.js`
- `tela-principal-odontologica-odontograma.js`
- `tela-principal-odontologica-layout.js`
- `tela-principal-odontologica-entrada.js`

Com isso, o gate passou a ter os pontos de montagem da tela principal disponiveis no runtime.

## Validacao runtime

Validacao executada em navegador local autenticado com a conta `gleissontel@gmail.com`.

Sequencia confirmada:

1. login concluido;
2. menu `Tratamento` aberto;
3. item `Novo tratamento...` acionado;
4. `Menu de pacientes` aberto;
5. paciente selecionado na grade;
6. modal `Novo tratamento` aberto;
7. tela principal odontologica montada no workspace principal;
8. cabeçalho de paciente em uso visivel com numero e nome;
9. nenhum desvio para `Ficha pessoal`.

## Evidencia visual

- Antes da correcao: o workspace permanecia vazio e o host principal nao era criado.
- Depois da correcao: a tela odontologica isolada ficou visivel no workspace, com:
  - cabecalho `Paciente: #1038 Ademar Ribeiro de Oliveira Oliveira`;
  - layout odontologico local;
  - painel lateral e resumo visual;
  - modal `Novo tratamento` encima do workspace.

## Pendencias residuais

- O teste foi feito com conta de auditoria local e senha temporaria aplicada para validar o runtime.
- Nao houve alteracao de backend, banco, migração ou persistencia de negocio.
- O fluxo da `Ficha pessoal` continua existindo como fallback do menu de pacientes fora deste caso especial.

