# Checklist operacional - Onda 1, Subetapa 6 da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: checklist operacional de estabilizacao

Status: documental e preparatorio

## 2. Objetivo da Subetapa 6

Esta subetapa fecha a Onda 1 no sentido de estabilizar o que ja foi introduzido.

O foco agora e verificar se:

- a tela principal continua previsivel;
- o paciente em uso continua coerente;
- o lookup por codigo continua funcional;
- o gate de `Novo tratamento` nao perdeu o contexto;
- o fallback antigo continua vivo.

## 3. Escopo permitido

- revisar a coexistencia entre `app.js`, `prontuario.js` e `paciente-em-uso-header.js`;
- confirmar que o carregamento permanece seguro;
- confirmar que o fallback continua disponivel;
- registrar riscos e pendencias de limpeza futura;
- nao criar novo comportamento funcional.

## 4. Escopo proibido

- iniciar nova frente de refatoracao ampla;
- remover o fallback cedo demais;
- tocar em toolbar;
- tocar em editor de textos;
- tocar em odontograma;
- criar backend novo;
- criar dependencia nova para apenas validar limpeza.

## 5. Checklist de execucao

### 5.1 Coexistencia de responsabilidade

- confirmar que a tela principal nova continua sendo a porta de entrada da faixa de paciente;
- confirmar que o cabeçalho atual ainda pode ser sincronizado;
- confirmar que o `app.js` nao passou a concentrar responsabilidade nova demais;
- confirmar que a tela nao ficou dependente de uma unica camada para abrir.

Teste esperado:

- a aplicacao abre igual ao comportamento validado nas subetapas anteriores;
- a faixa de paciente continua aparecendo;
- o lookup continua respondendo.

### 5.2 Estabilidade de runtime

- recarregar a pagina;
- observar se o bootstrap continua sem erro;
- confirmar que o estado de paciente continua vindo do mesmo contexto;
- confirmar que `Novo tratamento` continua abrindo.

Teste esperado:

- sem erro novo no console;
- sem regressao visual;
- sem perda de contexto ao alternar paciente.

### 5.3 Preparacao para encerramento da onda

- registrar o que ainda ficou duplicado por cautela;
- separar o que e pendencia de limpeza futura do que e comportamento essencial;
- evitar qualquer quebra de contrato antes de iniciar a proxima frente.

Teste esperado:

- nao existe item funcional pendente para liberar a Onda 1;
- apenas existem oportunidades de limpeza futura, se houver justificativa.

## 6. Criterio para encerrar a Onda 1

A Onda 1 pode ser considerada estabilizada quando:

- a tela principal estiver funcionando;
- o lookup por codigo estiver funcionando;
- o fallback para Menu de pacientes estiver funcional;
- `Novo tratamento` seguir correto com paciente ativo e sem paciente ativo;
- o console continuar limpo nos caminhos testados.

## 7. Pendencia assumida nesta fase

Nesta fase, a unica pendencia aceitavel e de consolidacao futura:

- revisar se vale simplificar o acoplamento entre `app.js` e o novo modulo de tela principal;
- essa revisao nao e obrigatoria para a Onda 1 ficar utilizavel;
- essa revisao so deve acontecer se houver ganho real de manutenibilidade.
