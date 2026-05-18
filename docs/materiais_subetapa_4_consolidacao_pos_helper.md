# Materiais - Subetapa 4 - Consolidacao documental pos-helper passivo

## 1. Objetivo da Subetapa 4

Esta etapa e exclusivamente documental.

Confirmacoes centrais:

- nenhum codigo foi alterado nesta consolidacao documental;
- `frontend/app.js` continua como fonte funcional da verdade;
- `frontend/js/modules/materiais.js` continua passivo;
- nao houve integracao funcional nova;
- nao houve alteracao de comportamento.

## 2. Estado atual do modulo Materiais

Estado consolidado apos a Subetapa 3:

- namespace criado: `window.BranaMateriaisModule`;
- carregamento no `index.html` ja existente desde a Subetapa 1;
- helper passivo criado na Subetapa 3;
- `ativo: false`;
- `controlaFluxo: false`;
- sem integracao funcional;
- sem DOM;
- sem eventos;
- sem `requestJson`/`fetch`;
- sem alteracao de fluxo funcional no monolito.

## 3. Inventario do namespace atual

Conteudo publico atual de `window.BranaMateriaisModule`:

- `meta`
- `nome`
- `modulo`
- `versaoSubetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `descricao`
- `riscosPreservados`
- `dependenciasDocumentais`
- `helpersCandidatosFuturos`
- `materiaisUniqueAuxDescricoes(arr)`
- `helpers`
- `getInfo()`
- `info()`

### Confirmacoes

- os metadados continuam expostos;
- `getInfo()` continua disponivel;
- `info()` continua disponivel;
- `materiaisUniqueAuxDescricoes(arr)` permanece exposto;
- o namespace continua passivo.

## 4. Comparacao documental do helper

### Funcao equivalente original no app.js

Localizacao observada:

- `frontend/app.js:647`

Forma funcional observada no monolito:

- recebe um array;
- percorre elementos com `descricao`;
- remove duplicidades por comparacao em caixa baixa;
- preserva a primeira ocorrencia;
- retorna um array novo;
- nao altera o array original;
- entradas nao-array produzem resultado seguro vazio.

### Comparacao com o helper passivo

O helper passivo em `frontend/js/modules/materiais.js` reproduz o mesmo contrato documental:

- aceita um array;
- filtra descricoes vazias;
- normaliza por caixa baixa;
- preserva a primeira ocorrencia;
- devolve array novo;
- nao altera o array recebido;
- nao depende de DOM, eventos, `requestJson`, `fetch` ou estado global.

### Compatibilidade documental

Com base na leitura, o helper passivo parece compatível com o comportamento esperado do original.

Diferenças ou observacoes:

- o helper passivo vive fora do `app.js`;
- a compatibilidade depende apenas da mesma regra de filtragem por `descricao`;
- nao foi feita integracao funcional para validar substituicao real no fluxo.

## 5. Avaliacao de risco para integracao futura

### Frequencia de uso no app.js

- o helper original aparece como utilitario local no bloco de Materiais;
- ele sustenta a carga de auxiliares e listas, mas nao e um ponto de fluxo pesado por si so;
- a chamada relevante e indireta, porque serve de apoio para combos e filtros.

### Impacto em combos auxiliares

- alto o suficiente para merecer cautela, porque a saida alimenta classificacoes e filtros;
- baixo o suficiente para permitir futura integracao minima, se feita com fallback;
- alteracoes aqui podem refletir em filtros do modal e da tela principal.

### Risco de dados duplicados

- o helper existe justamente para remover duplicidade por descricao;
- trocar ou romper essa regra pode recriar duplicados em listas auxiliares;
- o risco e moderado.

### Risco de ordenacao

- o helper preserva a primeira ocorrencia e nao reordena explicitamente;
- qualquer mudanca futura que altere ordenacao pode afetar apresentacao e selecao;
- o risco e moderado.

### Risco de alteracao de retorno

- a compatibilidade depende de retorno em array novo;
- retorno nulo, objeto ou mutacao do array original quebrariam o contrato;
- o risco e baixo no helper passivo atual, mas alto em uma integracao mal feita.

### Risco de entrada invalida

- o helper passivo trata entrada nao-array de forma segura, retornando lista vazia;
- isso e favoravel para integracao futura;
- o risco e baixo.

### Risco de dependencia com strings visiveis

- a logica usa `descricao`, que e string visivel;
- qualquer alteracao textual ou tentativa de "corrigir" string seria proibida nesta fase;
- o risco documental de mojibake existe, mas nao foi tratado nem corrigido.

## 6. Critérios obrigatorios para uma eventual Subetapa 5

Se houver integracao futura, ela deve:

- alterar no maximo um ponto local;
- manter fallback para a funcao original;
- nao alterar DOM;
- nao alterar eventos;
- nao alterar endpoints;
- nao alterar payloads;
- nao alterar calculo de preco, relacao ou custo;
- nao alterar parse numerico;
- nao alterar texto visivel;
- nao alterar fluxo de modal;
- nao alterar selecao ou duplo clique;
- preservar a funcao original ate validacao manual.

## 7. Alternativa conservadora

### Recomendacao comparada

As duas opcoes foram consideradas:

- Opcao A: integracao minima futura do helper com fallback no app.js;
- Opcao B: pausa/encerramento temporario do ciclo de Materiais.

### Avaliacao conservadora

A leitura atual indica que o helper e seguro o bastante para uma eventual integracao minima, mas nao ha necessidade operacional imediata de mover nada agora.

Por isso, a recomendacao mais conservadora nesta consolidacao e:

- manter o helper passivo por enquanto;
- nao integrar ainda;
- considerar a Subetapa 5 somente se houver motivo concreto para reduzir duplicacao local em um unico ponto.

Em termos práticos, isto equivale a uma pausa temporaria com possibilidade de integracao minima futura caso apareca beneficio claro.

## 8. Checklist manual acumulado de testes

Checklist consolidado para validar o ciclo de Materiais antes de qualquer integracao futura:

- abrir o sistema;
- fazer `Ctrl+F5`;
- abrir Materiais;
- confirmar que a listagem carrega;
- confirmar que filtros funcionam;
- confirmar troca de tabela/lista;
- confirmar novo material;
- confirmar alterar material;
- confirmar salvar sem alterar valores indevidamente;
- confirmar preco, relacao e custo;
- confirmar virgula/ponto decimal;
- confirmar selecao de linha;
- confirmar duplo clique;
- confirmar modal principal;
- confirmar modal de tabela/lista;
- confirmar que nao ha erro novo no console;
- confirmar que Procedimentos e Procedimentos Genericos nao foram impactados, se possivel.

## 9. Riscos preservados

- DOM;
- eventos;
- modais;
- renderizacao;
- selecao;
- duplo clique;
- `requestJson`/`fetch`;
- endpoints;
- payloads;
- calculo de preco/relacao/custo;
- parse numerico;
- integracao com Procedimentos;
- integracao com Procedimentos Genericos;
- textos/mojibake.

## 10. Checks executados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

Resultado:

- ambos passaram sem erro.

## 11. Onde testar no navegador

Como esta etapa e apenas documental, nao ha teste funcional novo obrigatorio.

Se for fazer validacao manual acumulada antes de qualquer integracao futura, testar exatamente:

1. Abrir o sistema no navegador.
2. Fazer `Ctrl+F5`.
3. Abrir a tela de Materiais.
4. Confirmar que a listagem continua abrindo.
5. Confirmar que os filtros continuam funcionando.
6. Confirmar que selecao e duplo clique continuam funcionando.
7. Confirmar que o modal continua abrindo e fechando como antes.
8. Confirmar que nao apareceu erro novo no console.

## 12. Recomendacao objetiva para a proxima etapa

Recomendacao conservadora:

- manter o helper passivo sem integracao imediata;
- se houver futura Subetapa 5, ela deve ser uma integracao minima com fallback no `app.js`, em um unico ponto local, sem tocar em DOM, eventos, endpoints, payloads ou calculos;
- se nao houver necessidade pratica clara, encerrar temporariamente o ciclo de Materiais e aguardar novo momento de consolidacao.

## 13. Confirmacao final

- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules/materiais.js` nao foi alterado nesta consolidacao documental;
- backend, banco e endpoints nao foram alterados;
- a blindagem textual/mojibake foi respeitada;
- nenhum texto, acento, mojibake, label, mensagem, placeholder ou string visivel foi alterado.

