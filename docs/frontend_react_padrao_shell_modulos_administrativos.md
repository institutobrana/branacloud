# Padrão de shell dos módulos administrativos no frontend React

## Objetivo

Este documento formaliza o padrão visual e estrutural que deve ser seguido pelos módulos administrativos do novo frontend React do Brana Cloude.

O objetivo e evitar novas variações de layout, barras isoladas por página e filtros paralelos fora do shell comum.

## Conceito do shell padrão

O shell visual dos módulos administrativos deve ser composto por:

1. barra lateral fixa ou contextual;
2. barra horizontal superior integrada a essa lateral, formando um "L" visual continuo;
3. area principal de conteudo abaixo da faixa superior;
4. grid ou listagem ocupando toda a largura util disponivel.

O shell nao deve ser montado como blocos independentes e desalinhados.

## Estrutura visual obrigatoria

### 1. Barra lateral + barra horizontal formando um L

- A lateral e a faixa superior devem parecer um unico sistema.
- A barra horizontal nao deve "começar depois" da lateral.
- O encontro lateral + topo deve ser tratado no shell compartilhado, nao em ajustes locais por tela.

### 2. Barra horizontal com acoes

- A faixa superior deve conter os botoes de acao do modulo.
- O lado esquerdo da barra e reservado para acoes primarias.
- O lado direito pode receber filtros principais quando o modulo precisar deles.

### 3. Filtros principais dentro da barra quando aplicavel

- Filtros de contexto ou pesquisa usados com frequencia devem ficar dentro da barra horizontal.
- Nao deve existir uma segunda linha de filtros abaixo da barra se a acao principal ja suportar esse espaco.
- A barra deve continuar sendo uma unica faixa horizontal.

### 4. Grid/listagem ocupando a largura util

- A listagem principal deve ocupar toda a area util do content.
- Nao deve ficar comprimida em faixa estreita nem presa numa lateral artificail.
- Wrappers internos nao podem impor largura indevida.

### 5. Filtro de cabecalho por coluna

- Quando o modulo usar grid tabular, deve reaproveitar o mesmo componente de cabecalho filtravel de `Tabelas Auxiliares`.
- O padrao inclui:
  - botao/menu de filtro no header;
  - ordenacao ascendente e descendente, quando aplicavel;
  - menu de colunas visiveis, quando o modulo ja adotar esse contrato.
- Nao criar um filtro paralelo com visual diferente.

## Componentes e estrutura compartilhada

Os modulos administrativos devem reutilizar, sempre que possivel, os seguintes elementos compartilhados:

- `TableColumnFilterHeader`
- classes de shell visual comum
- classes de toolbar compartilhada
- containers de grade compartilhada
- padroes de espaçamento e borda ja consolidados nos modulos de referencia

## Modulos de referencia atuais

### Tabelas Auxiliares

- e o referencial principal para shell, cabecalho filtravel e menu de colunas.
- deve continuar sendo o padrao base de header de grid e interacao visual.

### Procedimentos genéricos

- deve seguir o mesmo shell base.
- deve usar o mesmo cabeçalho filtravel do grid.
- deve manter a barra de ações/filtros dentro da mesma faixa horizontal.

## Proibicoes

- nao inventar layout paralelo por pagina;
- nao criar toolbar isolada fora do shell compartilhado;
- nao criar filtro paralelo diferente do padrao de Tabelas Auxiliares;
- nao quebrar a ligacao visual entre lateral e barra superior;
- nao reduzir a area principal a uma faixa estreita;
- nao alterar backend, banco ou migrations para resolver problema visual.

## Checklist para novos modulos administrativos

Antes de considerar um novo modulo pronto, verificar:

- a lateral e a barra superior estao unidas visualmente;
- a faixa superior e unica e integra acoes e filtros;
- os filtros principais estao dentro da barra, quando aplicavel;
- a listagem ocupa a largura util completa;
- o grid usa o mesmo header filtravel de Tabelas Auxiliares, quando o contrato pedir;
- nao ha wrappers paralelos limitando a largura;
- o comportamento visual se mantem coerente em telas ja existentes.

## Regra de manutencao

Qualquer novo modulo administrativo deve partir deste shell compartilhado.

Se um ajuste precisar ser repetido em mais de uma tela, a primeira pergunta deve ser se o problema nao pertence ao shell base.
