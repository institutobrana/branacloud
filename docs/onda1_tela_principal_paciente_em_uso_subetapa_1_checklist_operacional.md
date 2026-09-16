# Checklist operacional - Onda 1, Subetapa 1 da tela principal e da faixa de paciente em uso

## 1. Identificacao

Produto: Brana Cloude

Area: Tela principal / contexto de paciente em uso

Natureza deste documento: checklist operacional de execucao

Status: documental e preparatorio

## 2. Objetivo da Subetapa 1

Esta subetapa serve para iniciar a Onda 1 com o menor risco possivel.

Ela nao busca ainda mudar regra de negocio.

Ela busca apenas criar a fronteira minima da tela principal e manter o comportamento atual intacto.

## 3. Escopo permitido

- criar o arquivo novo `frontend/js/modules/prontuario.js`;
- carregar esse arquivo no frontend sem retirar o apoio atual do cabeçalho de paciente em uso;
- manter `frontend/app.js` fora de reestruturacao ampla;
- manter o backend, banco e rotas sem mudanca;
- manter o fallback visual e funcional existente.

## 4. Escopo proibido

- criar rota nova;
- criar backend novo;
- mexer em banco;
- remover o modulo atual de cabecalho de paciente em uso;
- mover o gate de `Novo tratamento`;
- tocar na toolbar;
- tocar no editor de textos;
- tocar no odontograma nesta subetapa.

## 5. Checklist de execucao

### 5.1 Preparacao

- confirmar que a referencia principal continua sendo o contrato da Onda 1;
- confirmar que o inventario e a ordem de execucao continuam validos;
- confirmar que o arquivo novo ainda nao existe e pode ser criado sem conflito;
- confirmar que o carregamento atual da interface nao depende de nenhum corte estrutural nesta etapa.

Teste esperado:

- a tela continua abrindo como antes antes de qualquer ajuste.

### 5.2 Criacao do modulo novo

- criar `frontend/js/modules/prontuario.js`;
- manter o modulo em formato isolado e autoexecutavel;
- expor uma API pequena para boot, sincronizacao e estado;
- usar o modulo atual de cabecalho como apoio temporario;
- nao implementar lookup novo nesta subetapa.

Teste esperado:

- o arquivo carrega sem erro de sintaxe;
- o bootstrap nao altera a aparencia atual quando a pagina abre.

### 5.3 Integracao minima no shell

- incluir o novo arquivo no final do HTML do frontend em posicao segura;
- manter a ordem de carregamento com o cabecalho de paciente em uso disponivel;
- nao retirar scripts existentes;
- nao mudar a ordem da toolbar ou do workspace.

Teste esperado:

- recarregar a pagina sem erro de importacao;
- confirmar que a faixa de paciente continua renderizando;
- confirmar que a toolbar continua visivel e responsiva.

### 5.4 Validacao funcional minima

- abrir a aplicacao com sessao autenticada;
- confirmar que a faixa de paciente em uso continua aparecendo;
- confirmar que o menu `Tratamento -> Novo tratamento` continua operando;
- confirmar que nenhum comportamento visivel foi perdido;
- conferir o console do navegador.

Teste esperado:

- sem regressao funcional;
- sem erro novo no console;
- sem quebra de layout;
- sem perda do fallback atual.

## 6. Criterio para liberar a proxima subetapa

So avancar quando os itens abaixo estiverem verdadeiros:

- o arquivo novo existir e carregar;
- a tela continuar igual no ponto sensivel;
- o cabeçalho de paciente em uso continuar sincronizando;
- o fluxo de `Novo tratamento` continuar util;
- nao existir regressao de abertura da pagina.

## 7. Sinal de alerta

Se qualquer item abaixo acontecer, a subetapa deve parar:

- erro de sintaxe no arquivo novo;
- tela principal sem faixa de paciente;
- toolbar desaparecendo;
- `Novo tratamento` parando de abrir;
- console mostrando erro novo ligado ao bootstrap.
