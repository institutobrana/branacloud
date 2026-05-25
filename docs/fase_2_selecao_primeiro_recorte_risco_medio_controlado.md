# Fase 2 - Selecao documental do primeiro recorte de risco medio controlado

## Objetivo
Selecionar documentalmente o primeiro recorte de risco medio controlado, ou concluir que ainda e necessario um contrato detalhado antes de qualquer implementacao futura.

## Contexto da transicao
A fase de helpers pequenos chegou ao limite nas frentes recentes. Os recortes restantes em `frontend/app.js` ja envolvem DOM, selecao visual, `requestJson`, payload, eventos, estado global ou orquestracao.

Essa selecao documental sucede a transicao definida para recortes de risco medio controlado e nao implementa nada.

## Frentes pausadas / consolidadas consideradas
- `Agenda de contatos`
- `Agenda principal`
- `Preferencias / Configuracoes comuns`
- `Prestadores`

## Matriz aplicada
Foram usados os criterios definidos na transicao:
- fronteira clara;
- uma unica responsabilidade;
- teste manual simples;
- ganho real no `frontend/app.js`;
- ausencia de alteracao simultanea em backend, banco ou permissões;
- ausencia de correcao textual/mojibake;
- escopo pequeno o suficiente para auditoria;
- fallback ou rollback mental claro;
- checks obrigatorios quando houver codigo;
- validacao documental pos-teste.

## Candidatos avaliados
### 1. Prestadores / `prestFiltrarLista`
- Modulo/frente: `Prestadores`
- Função/bloco: filtragem da grade por especialidade e nome
- Tipo de bloco: helper quase puro de UI
- Dependencias: `prestCfg`, `prestadoresCache`
- Arquivos provavelmente afetados se implementado futuramente: `frontend/app.js` e possivelmente `frontend/js/modules/prestadores.js`
- Usa DOM: sim, indireto via `prestCfg`
- Usa `window/document`: indireto
- Usa estado global: sim
- Usa `requestJson`: nao
- Monta payload: nao
- Envolve salvamento: nao
- Envolve exclusao: nao
- Envolve permissões: nao
- Envolve backend/banco/schema/migrations/seeds: nao diretamente
- Altera texto visivel: nao diretamente
- Altera selecao visual: nao
- Altera renderizacao: sim, influencia a lista exibida
- Impacto visual: medio
- Ganho estimado no `app.js`: medio
- Teste manual futuro: `Cadastro > Prestadores`, aplicar filtros e confirmar lista/resultados
- Risco: medio
- Aceitavel como primeiro recorte medio controlado: **talvez, mas ainda nao nesta etapa**

### 2. Prestadores / `prestRender`
- Tipo de bloco: DOM/renderizacao
- Dependencias: `prestadoresCache`, `prestadorSelId`, helpers extraidos
- Usa DOM: sim
- Usa `requestJson`: nao diretamente
- Altera renderizacao: sim
- Impacto visual: alto
- Ganho estimado no `app.js`: alto
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao

### 3. Prestadores / `prestSelecionarLinha`
- Tipo de bloco: evento / selecao visual
- Dependencias: `prestadorSelId`, DOM
- Usa DOM: sim
- Usa estado global: sim
- Altera selecao visual: sim
- Altera renderizacao: sim, via `prestRender()`
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao

### 4. Prestadores / `prestAcoesPlaceholder`
- Tipo de bloco: feedback textual / fluxo
- Dependencias: `prestSelecionado`, `footerMsg`
- Usa DOM: sim
- Altera texto visivel: sim
- Altera selecao visual: nao
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao

### 5. Cadastros auxiliares ja modularizados / bloco medio remanescente
- Tipo: variavel
- Dependencias: variavel
- Usa DOM/`requestJson`/payload: depende do bloco
- Risco: variavel
- Aceitavel como primeiro recorte medio controlado: nao ha bloco uniforme o suficiente nesta etapa

### 6. Convênios e Planos / possivel bloco medio sem salvamento
- Tipo: cadastro com seletores e vinculos
- Dependencias: combos, selecao e possivel orquestracao visual
- Usa DOM: sim
- Usa `requestJson`: em partes
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao nesta etapa

### 7. Relatórios / bloco de preview ou filtros
- Tipo: preview/exportacao/filtros
- Dependencias: UI, saida visual e possiveis endpoints
- Usa DOM: sim
- Usa `requestJson`: possivelmente sim
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao

### 8. Agenda principal / helper sensivel remanescente
- Tipo: fluxo legado sensivel
- Dependencias: agenda, estado global, UI
- Risco: alto
- Aceitavel como primeiro recorte medio controlado: nao

### 9. Preferências / remanescentes medios
- Tipo: abas / contexto
- Dependencias: abas, UI, estado de preferencia
- Usa DOM: sim
- Risco: medio-alto
- Aceitavel como primeiro recorte medio controlado: nao nesta etapa

### 10. Outro módulo core/comum citado no roadmap
- Observacao: outros candidatos aparecem em geral como mais acoplados, mais transacionais ou mais visuais.
- Risco: de medio a alto, conforme a frente
- Aceitavel como primeiro recorte medio controlado: nao identificado nesta rodada

## Analise comparativa
### Prestadores / `prestFiltrarLista`
E o candidato mais proximo de um recorte medio controlado porque ainda tem uma responsabilidade unica e um teste manual simples. Contudo, ainda depende de `prestCfg` e do cache, entao a decisao de implementar nao deve ser imediata. Ele pede contrato detalhado para separar claramente leitura de UI e listagem.

### Demais candidatos
`prestRender`, `prestSelecionarLinha`, `prestAcoesPlaceholder` e os demais comparados ja entram em DOM, selecao visual, eventos ou integracao, portanto o risco sobe para medio-alto ou alto. Eles nao devem ser o primeiro recorte medio controlado.

## Recomendacao
A recomendacao desta etapa e:

**A. Recomendar `Prestadores / prestFiltrarLista` como o primeiro recorte de risco medio controlado, mas somente depois de uma subetapa documental de contrato antes da implementacao.**

## Justificativa
- E o menor ganho real ainda disponivel na frente `Prestadores`.
- A responsabilidade e mais delimitada do que em `prestRender` ou `prestAbrir`.
- O teste futuro e claro: abrir `Cadastro > Prestadores`, aplicar filtros e comparar lista/resultados.
- Nao e trabalho pesado amplo porque a proposta nao envolve reescrever a tela inteira.
- Os limites permanecem claros: nao misturar com salvamento, exclusao, permissões, backend ou correcoes textuais.

## Proxima subetapa recomendada
`Prestadores - Contrato detalhado de prestFiltrarLista como recorte medio controlado`

## Riscos remanescentes
- `prestFiltrarLista` ainda depende de `prestCfg` e de `prestadoresCache`.
- A implementacao futura precisa definir se a leitura de `prestCfg` vira parametro ou se permanece wrapper local.
- O restante do bloco de Prestadores continua acima do nivel ideal para helpers pequenos.

## Pendencias futuras
- Definir contrato explicito de entrada para `prestFiltrarLista`.
- Separar o que e leitura de filtro do que e renderizacao da lista.
- Manter qualquer mojibake/texto quebrado apenas como pendencia documental futura.

## Registro de blindagem textual/mojibake
Nesta selecao documental nenhuma string visivel foi corrigida. Qualquer texto quebrado ou mojibake existente permanece apenas como pendencia documental futura, sem ajuste.
