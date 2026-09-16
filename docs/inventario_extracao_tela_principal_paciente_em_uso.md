# Inventario de extracao - tela principal e faixa de paciente em uso

## 1. Objetivo

Este inventario lista, de forma operacional e segura, os arquivos, estados e dependencias envolvidos na separacao da tela principal e da faixa de paciente em uso do monolito do frontend do Brana Cloude.

O documento nao implementa nada.

O documento nao altera backend, banco, rotas, permissao ou layout ainda.

## 2. Contexto

O contrato tecnico desta trilha ja foi registrado em:

- `docs/contrato_tecnico_extracao_tela_principal_paciente_em_uso.md`

A trilha existe porque a interface principal hoje mistura:

- shell global;
- faixa de paciente em uso;
- sincronizacao de paciente ativo;
- gate de `Novo tratamento`;
- lookup por codigo;
- fallback para `Menu de pacientes`.

## 3. O que deve permanecer no monolito por enquanto

### 3.1 Shell global ainda sensivel

Arquivo principal:

- `frontend/index.html`

Ainda deve manter, nesta fase:

- menu superior;
- toolbar;
- usuario/licenca;
- botao sair;
- workspace raiz;
- ponto de ancoragem temporario para a faixa de paciente, ate o corte final.

### 3.2 Estado global atual

Arquivo principal:

- `frontend/app.js`

Estados que ainda existem e devem continuar funcionando durante a transicao:

- `fichaPacienteAtualId`
- `fichaCodigoUltimoResolvido`
- `fichaMenuPac`
- `sessaoAtual`
- `BranaNovoTratamentoPacienteGate`
- sincronizacao do paciente ativo para odontograma e ficha.

### 3.3 Rotas e helpers de lookup ja existentes

Backend e frontend ja possuem caminhos reaproveitaveis:

- `GET /cadastros/pacientes/por-codigo/{codigo}`
- `GET /cadastros/pacientes/{paciente_id}`
- `GET /cadastros/pacientes/menu`
- `GET /cadastros/pacientes/menu-options`

Esses recursos devem ser reaproveitados antes de qualquer criacao nova.

## 4. Arquivos candidatos a extração

### 4.1 Novo modulo alvo

Arquivo recomendado:

- `frontend/js/modules/prontuario.js`

Responsabilidades esperadas:

- montar a faixa do paciente em uso;
- manter rótulo `Paciente:`;
- renderizar codigo e nome completo;
- capturar `Enter` e `Tab` do campo de codigo;
- consultar paciente por codigo;
- sincronizar paciente em uso;
- expor API para outros modulos consumirem o mesmo contexto.

### 4.2 Módulo de faixa de paciente

Arquivo existente:

- `frontend/js/modules/paciente-em-uso-header.js`

Decisao deste inventario:

- este arquivo pode virar o motor interno da faixa;
- ou pode ser absorvido por `prontuario.js`;
- o importante e evitar duplicidade de fonte visual e de estado.

### 4.3 Gate de novo tratamento

Arquivo existente:

- `frontend/js/modules/novo-tratamento-paciente-gate.js`

Papel durante a transicao:

- continuar como ponte de segurança;
- evitar abrir tratamento sem paciente em uso;
- chamar o modulo novo quando a tela principal ja tiver resolvido o paciente.

### 4.4 Modal de novo tratamento

Arquivo existente:

- `frontend/js/modules/novo-tratamento-modal.js`

Papel durante a transicao:

- permanecer como consumidor do paciente resolvido;
- nao assumir responsabilidade de busca por codigo;
- nao duplicar o gate de paciente.

## 5. Inventario do frontend por camada

### 5.1 Camada de apresentacao

Arquivos:

- `frontend/index.html`
- `frontend/js/modules/prontuario.js` planejado
- `frontend/js/modules/paciente-em-uso-header.js`

Risco:

- alto se removido cedo;
- medio se apenas encapsulado com fallback.

### 5.2 Camada de estado/negocio

Arquivos:

- `frontend/app.js`
- `frontend/js/modules/novo-tratamento-paciente-gate.js`
- `frontend/js/modules/novo-tratamento-modal.js`

Risco:

- muito alto se for refatorado junto com lookup e layout.

### 5.3 Camada de integracao

Arquivos:

- `backend/routes/cadastros_routes.py`
- `backend/routes/tratamentos_routes.py`
- `backend/models/paciente.py`
- `backend/models/tratamento.py`

Risco:

- medio se apenas reutilizar rotas;
- alto se criar nova API sem necessidade.

## 6. O que nao deve ser feito nesta trilha

- nao reescrever `frontend/app.js` inteiro;
- nao mover tratamento antes de fechar o paciente em uso;
- nao criar lookup paralelo sem necessidade;
- nao remover a faixa antiga antes de validar a nova;
- nao misturar essa extracao com toolbar, editor de textos ou odontograma;
- nao mudar banco ou permissao agora;
- nao criar migrations para essa etapa.

## 7. Ondas de execucao sugeridas

### Onda 1 - encapsulamento

- criar `frontend/js/modules/prontuario.js`;
- manter a faixa atual funcionando;
- chamar o novo modulo apenas para montar e observar estado;
- nao remover o fluxo legado.

### Onda 2 - lookup por codigo

- ligar `Enter` e `Tab` ao lookup;
- reaproveitar `GET /cadastros/pacientes/por-codigo/{codigo}`;
- atualizar a faixa com codigo e nome completos;
- garantir que o paciente selecionado vire o paciente em uso.

### Onda 3 - integração com novo tratamento

- garantir que `Novo tratamento` leia o mesmo paciente em uso;
- preservar o gate de fallback para `Menu de pacientes`;
- evitar duplicacao de logica de busca.

### Onda 4 - corte do monolito

- remover o trecho antigo somente depois da validacao;
- manter fallback temporario;
- revisar dependencias diretas de `fichaPacienteAtualId` e `fichaCodigoUltimoResolvido`.

## 8. Dependencias que precisam de confirmacao na proxima etapa

- onde a faixa sera montada definitivamente na tela principal;
- se `prontuario.js` vai importar ou substituir `paciente-em-uso-header.js`;
- se o backend precisa apenas reutilizar a rota atual ou ganhar um wrapper formal;
- qual comportamento visual deve ocorrer quando o codigo nao existir;
- se o `Menu de pacientes` deve ser aberto automaticamente ou apenas sugerido.

## 9. Validacao esperada por etapa

### Antes do corte

- login funcional;
- tela principal abre;
- faixa de paciente aparece ou se mantém neutra;
- `Novo tratamento` ainda funciona via gate atual.

### Depois do lookup

- digitar codigo localiza paciente correto;
- `Enter` e `Tab` disparam a busca;
- nome completo aparece junto ao codigo;
- paciente fica ativo para os modulos dependentes.

### Depois da extracao final

- o monolito antigo nao e mais necessario para a faixa;
- o novo modulo responde sozinho;
- a tela principal continua abrindo sem regressao.

## 10. Pendencias documentais

- definir o nome final do modulo principal de tela;
- definir se o backend precisa ou nao de uma rota facade;
- definir a fronteira final entre faixa de paciente e gate de novo tratamento;
- definir qual arquivo vai hospedar o bootstrap final no HTML.

## 11. Conclusao

Este inventario deixa a extracao em um formato seguro:

- primeiro organiza;
- depois encapsula;
- depois integra;
- por fim corta o legado.

Nada aqui autoriza implementacao imediata.
