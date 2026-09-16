# Checklist operacional - Onda 1, Subetapas 2 e 3 da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: checklist operacional de execucao

Status: documental e preparatorio

## 2. Objetivo das Subetapas 2 e 3

Estas subetapas servem para evoluir a Onda 1 sem sair da fronteira segura.

Primeiro entra uma superficie visual minima da tela principal.
Depois essa superficie passa a ler o paciente ja existente em uso.

## 3. Escopo permitido

- manter `frontend/js/modules/prontuario.js` como ponto de entrada;
- usar o modulo atual de cabecalho como apoio temporario;
- ler o paciente ja existente na sessao ou no contexto atual;
- manter fallback e layout atual;
- nao criar backend novo;
- nao mexer no banco.

## 4. Escopo proibido

- criar lookup novo por codigo nesta rodada;
- mexer no gate de `Novo tratamento`;
- tocar na toolbar;
- tocar no editor de textos;
- tocar no odontograma;
- criar nova rota;
- remover o modulo de cabecalho atual;
- iniciar persistencia ou gravacao de paciente.

## 5. Checklist de execucao - Subetapa 2

### 5.1 Entrada visual minima

- criar uma area pequena e identificavel da tela principal;
- exibir um titulo simples de tela principal;
- manter um badge de estado visual;
- nao interferir na toolbar nem no workspace legado;
- nao depender de dados novos para renderizar.

Teste esperado:

- a pagina abre normalmente;
- a nova superficie visual aparece sem quebrar o layout;
- a faixa de paciente continua presente;
- nao surge erro novo no console.

### 5.2 Convivencia com o shell

- inserir a entrada visual em local seguro do workspace;
- manter o workspace anterior operando;
- nao substituir nenhum painel existente;
- nao remover elementos ja usados por outros modulos.

Teste esperado:

- navegar na tela sem perceber regressao na estrutura geral;
- continuar conseguindo abrir `Tratamento -> Novo tratamento`;
- continuar vendo a toolbar e o header normalmente.

## 6. Checklist de execucao - Subetapa 3

### 6.1 Leitura do paciente em uso

- fazer o modulo novo consultar o paciente atual;
- priorizar o mesmo contexto que a aplicacao ja usa;
- exibir codigo e nome do paciente quando houver contexto;
- manter estado neutro quando nao houver paciente;
- nao alterar o paciente atual.

Teste esperado:

- com paciente em uso, a nova entrada mostra codigo e nome;
- sem paciente em uso, a area continua neutra e funcional;
- o header de paciente em uso continua sincronizado;
- o fluxo `Novo tratamento` continua dependendo do mesmo contexto.

### 6.2 Validacao de estabilidade

- recarregar a aplicacao depois da leitura do paciente;
- confirmar que o estado nao some;
- confirmar que a leitura nao gerou dependencia circular;
- confirmar que o fallback ainda existe.

Teste esperado:

- refresh nao quebra a tela;
- nenhum erro novo aparece ao resolver o paciente atual;
- o comportamento visual continua previsivel.

## 7. Critério para liberar a proxima etapa

So avancar quando:

- a entrada visual minima estiver aparecendo;
- a leitura do paciente estiver correta;
- a faixa atual continuar funcional;
- o console estiver limpo;
- o fluxo `Novo tratamento` seguir vivo.
