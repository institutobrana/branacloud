# Recomendacao de proximo modulo pos-Prestadores

## 1. Objetivo

Recomendar o proximo modulo mais seguro apos o encerramento do mini ciclo de `Prestadores`, mantendo a primeira rodada conservadora.

Esta etapa e apenas documental:

- nao altera codigo;
- nao altera fluxo;
- nao cria modulo novo;
- nao cria helper;
- nao integra helper;
- nao mexe em `frontend/app.js`, `frontend/index.html` ou `frontend/js/modules`.

## 2. Estado atual do projeto

O ciclo conservador atual ja trabalhou:

- Unidades
- Plano de Contas
- CID
- Medicamentos
- Auxiliares / Tabelas auxiliares
- Etiquetas
- Procedimentos Genéricos
- Anamnese
- Prestadores

Estado final relevante de `Prestadores`:

- `frontend/js/modules/prestadores.js` existe;
- `window.BranaPrestadoresModule` foi exposto;
- namespace passivo;
- `status: "passivo"`;
- `ativo: false`;
- `controlaFluxo: false`;
- helper puro `prestFmtCodigo` criado;
- integracao em `frontend/app.js` feita por wrapper local com fallback;
- `prestRender()` continua chamando wrapper local no `app.js`;
- `app.js` continua fonte funcional da verdade.

O mini ciclo de Prestadores foi encerrado e documentado.

## 3. Critérios de avaliacao

Para recomendar o proximo modulo, a avaliacao considerou:

- tamanho aparente do bloco no `app.js`;
- clareza de fronteira;
- dependencia de DOM dinamico;
- dependencia de `requestJson`/`fetch`;
- dependencia de eventos;
- dependencia de modais;
- dependencia de backend/endpoints;
- dependencia de outros modulos;
- risco de mexer em grade/tabela;
- risco de payload sensivel;
- risco de dados financeiros;
- risco de dados clinicos;
- existencia de helpers puros pequenos;
- chance de iniciar com Subetapa 0 documental segura.

## 4. Avaliacao de Convênios e Planos

### Leitura de alto nivel

`Convênios e Planos` parece ter uma fronteira mais legivel do que modulos mais amplos como Agenda, Financeiro, Ficha pessoal ou Procedimentos.

Pelo padrao ja mapeado em `app.js`, o modulo tende a envolver:

- funcoes de abertura/fechamento do painel;
- carregamento de listas e combos;
- grades/tabelas de convênios e planos;
- modais proprios de convênio, plano e possivelmente calendário;
- eventos de selecao, clique e alteracao;
- dependencias com ficha do paciente e faturamento.

### Tipo de UI

- painel de configuracao/cadastro;
- grade/tabela principal;
- submodais para convênio, plano e calendario de faturamento.

### Riscos percebidos

- duas grades ou duas listas relacionadas;
- modais proprios;
- dependencia com ficha do paciente e possiveis pontos de faturamento;
- risco moderado em tabela dinamica e segundo clique rapido;
- risco de payload mais sensivel que um cadastro simples.

### Possiveis helpers puros

- normalizacao textual de nome de convênio;
- formatacao simples de rótulos;
- validacao curta de campos textuais;
- montacao de label textual de plano.

### Adequacao como proximo modulo

Apesar da complexidade moderada, `Convênios e Planos` ainda parece o candidato mais seguro para iniciar uma nova Subetapa 0 documental depois de Prestadores.

Motivo principal:

- tem fronteira relativamente clara;
- a superficie e menor que Agenda, Financeiro, Ficha pessoal e Procedimentos;
- nao exige editor embutido complexo;
- parece oferecer helpers textuais pequenos sem precisar tocar em fluxo clinico pesado de cara.

## 5. Avaliacao de Símbolos Gráficos

### Leitura de alto nivel

`Símbolos Gráficos` tem fronteira aparente, mas o risco sobe por causa do editor e da integracao visual.

Pelos trechos observados em `app.js`, o modulo envolve:

- painel proprio;
- grade/lista de simbolos;
- modal de edicao;
- biblioteca visual;
- editor embutido em `iframe`;
- eventos de selecao, desenho e salvamento;
- possivel uso de `postMessage`/integracao com editor isolado.

### Tipo de UI

- painel de listagem;
- modal de edicao;
- editor visual separado;
- biblioteca de simbolos;
- area de preview/desenho.

### Riscos percebidos

- editor embutido aumenta a superficie de erro;
- `iframe`/mensageria/preview tende a ser mais frágil que um cadastro simples;
- maior chance de dependencias com desenho, imagem e interacao visual;
- risco de regressao de eventos e renderizacao;
- maior complexidade para uma primeira Subetapa 0 segura.

### Possiveis helpers puros

- normalizacao de nome/codigo textual;
- resolucao simples de rotulo de especialidade;
- formatacao de label para a lista;
- validacao textual curta.

### Adequacao como proximo modulo

`Símbolos Gráficos` e viavel, mas parece menos seguro que `Convênios e Planos` para abrir a proxima rodada conservadora.

O principal motivo e o editor embutido e o fluxo visual mais fragil, que aumentam o risco de mexer cedo em algo ainda monolitico.

## 6. Avaliacao breve dos modulos a evitar por enquanto

### Agenda

- grande superficie funcional;
- muitos binds;
- varios subfluxos e telas;
- integrações externas e dados sensiveis;
- alto risco de regressao em selecao e re-render.

### Financeiro / Conta corrente

- dados financeiros;
- risco alto de payload e mutacao;
- integracoes com fluxos de lancamento e baixa;
- nao e um bom candidato para a proxima rodada conservadora.

### Materiais

- modulo grande;
- varias listas, modais e filtros;
- muitos eventos e dependencias;
- maior chance de regressao se mexer cedo.

### Ficha pessoal / ficha clinica

- muito grande;
- envolve dados clinicos sensiveis;
- dependencia com varios outros fluxos;
- risco alto demais para a primeira extracao seguinte.

### Editor de Textos

- grande e complexo;
- muitos componentes e assistentes;
- alto risco de acoplamento visual e funcional;
- nao e recomendado agora.

### Procedimentos

- modulo muito amplo;
- depende de varios outros cadastros;
- varios modais e tabelas;
- alto risco de regressao.

### Índices financeiros

- embora menor que Financeiro completo, ainda esta ligado a logica financeira;
- melhor evitar nesta rodada.

### Cenário financeiro

- pode parecer pequeno, mas esta dentro da area financeira e de regra de negocio;
- nao e prioritario para a proxima extracao segura.

## 7. Ranking recomendado

### 1º recomendado

`Convênios e Planos`

### 2º alternativa

`Símbolos Gráficos`

### 3º alternativa

`Materiais`

### Modulos descartados por enquanto

- Agenda
- Financeiro / Conta corrente
- Ficha pessoal / ficha clínica
- Editor de Textos
- Procedimentos
- Índices financeiros
- Cenário financeiro

## 8. Recomendacao final

### Proximo modulo recomendado

`Convênios e Planos`

### Justificativa curta

- tem fronteira mais legivel que os modulos mais pesados;
- nao parece depender de editor embutido complexo como `Símbolos Gráficos`;
- e mais seguro para uma nova Subetapa 0 documental do que Agenda, Financeiro, Ficha pessoal ou Procedimentos.

### Primeira ação

Comecar com **Subetapa 0 documental**.

### Arquivo documental esperado para a proxima etapa

- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`

## 9. Proximo prompt sugerido

`Subetapa 0 documental de Convênios e Planos`

