# Plano de Implementacao - Indices Financeiros Frontend React

## 1. Objetivo

Definir a arquitetura modular, a sequencia de implementacao e os criterios operacionais para o futuro modulo `Configuracoes -> Indices financeiros` no novo frontend React.

## 2. Escopo

- Apenas planejamento tecnico e operacional.
- Nenhum codigo deve ser implementado nesta fase.
- Nenhuma rota, menu, componente, teste executavel, backend, banco, build, commit, push ou deploy deve ser alterado nesta etapa.

## 3. Fontes

- [`docs/auditoria_indices_financeiros_brana_cloud.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_brana_cloud.md)
- [`docs/auditoria_indices_financeiros_easydental_desktop.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_indices_financeiros_easydental_desktop.md)
- [`docs/comparativo_indices_financeiros_easydental_brana_cloud_react.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/comparativo_indices_financeiros_easydental_brana_cloud_react.md)
- [`docs/contrato_funcional_indices_financeiros.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_indices_financeiros.md)
- [`docs/contrato_funcional_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/contrato_funcional_plano_de_contas.md)
- [`docs/auditoria_padroes_react_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_padroes_react_plano_de_contas.md)
- [`docs/lista_pratica_stage_seletivo_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/lista_pratica_stage_seletivo_plano_de_contas.md)
- [`docs/matriz_commits_seletivos_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/matriz_commits_seletivos_plano_de_contas.md)
- [`docs/roteiro_operacional_stage_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/roteiro_operacional_stage_plano_de_contas.md)
- [`docs/plano_final_execucao_stage_plano_de_contas.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/plano_final_execucao_stage_plano_de_contas.md)
- [`docs/11_roadmap_desenvolvimento.md`](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)

## 4. Pre-condicoes

- Branch de trabalho: `modularizacao-segura-fase-1`.
- Workspace pode estar sujo.
- O contrato funcional ja aprovado permanece como fonte de verdade desta frente.
- Nenhum arquivo de codigo deve ser alterado nesta etapa documental.

## 5. Estado atual

- O modulo existe apenas como frente planejada.
- O frontend React ainda nao recebeu a implementacao modular definitiva desta area.
- O contrato funcional confirma:
  - shell em `L`;
  - toolbar sem botao `Fecha`;
  - duas tabelas empilhadas;
  - `Cotacoes para reais` como titulo inferior;
  - `UPO` tratado como indice nativo;
  - valor atual sempre vindo do backend.

## 6. Principios arquiteturais

1. Nao criar componente monolitico.
2. A pagina deve orquestrar, nao concentrar regra.
3. Toolbar deve ser separada da pagina.
4. Tabela de indices deve ser propria.
5. Tabela de cotacoes deve ser propria.
6. API deve ficar isolada.
7. Mappers e validators devem ficar isolados.
8. A regra de reservado deve ficar centralizada.
9. Nao duplicar calculo de valor atual no React.
10. Tenant nao deve ser controlado manualmente pelo frontend.
11. Fluxos destrutivos nao devem ser embutidos integralmente na pagina.
12. Plano de contas serve como referencia estrutural, nao funcional.

## 7. Referencias React

Padrões estruturais a observar na implementacao futura:

- `frontend-react/src/app/routes.jsx`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaShell.jsx`
- `frontend-react/src/layout/BranaSidebar.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/features/planoContas/`

Classificacao resumida:

- Reutilizavel diretamente: shell, tokens globais, padrao geral de tabela e modal.
- Reutilizavel conceitualmente: layout mestre/detalhe, toolbar compacta, selecao controlada.
- Exige adaptacao: fluxos destrutivos e selecao de detalhe.
- Especifico de Plano de contas: regras de grupos/categorias e migracao daquele dominio.
- Nao apropriado: copiar o modulo como monolito.

## 8. Reutilizacao permitida

- Shell global.
- Table patterns.
- Modal wrapper patterns.
- Loading, erro e empty states.
- Helpers de data e decimal compartilhados, se ja existirem.

## 9. Reutilizacao proibida

- Calculo local de valor atual.
- Controle manual de `clinica_id`.
- Copia literal do modulo de Plano de contas.
- Regra de backend duplicada no frontend.
- Arquitetura monolitica.

## 10. Arquitetura proposta

Sugestao de feature dedicada:

`frontend-react/src/features/indicesFinanceiros/`

Estrutura possivel:

- `IndicesFinanceirosPage.jsx`
- `indicesFinanceirosApi.js`
- `indicesFinanceirosMappers.js`
- `indicesFinanceirosValidators.js`
- `indicesFinanceirosReserved.js`
- `indicesFinanceirosFormatters.js`
- `components/`
- `hooks/`
- `dialogs/`

Essa arvore e apenas proposta. A convencao final de nomes deve seguir o padrao real do repo quando a implementacao iniciar.

## 11. Arvore planejada

| Caminho | Responsabilidade | Dependencias permitidas | Dependencias proibidas | Entrada | Saida | Teste associado | Micropasso |
|---|---|---|---|---|---|---|---|
| `frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx` | orquestracao da pagina | hooks, dialogs, tables | regra de negocio pura, API direta espalhada | estado e callbacks | layout montado | teste de integracao de pagina | 6.1 e 6.2 |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosApi.js` | chamada de backend | client de API | estado visual | params e payloads | respostas normalizadas | teste de API | 6.3 |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosMappers.js` | adaptacao de dados | respostas da API | regra de dominio | DTOs | modelos UI | teste unitario | 6.3 |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosValidators.js` | validacao local | dados de formulario | duplicacao de backend | valores de formulario | lista de erros | teste unitario | 6.5, 6.6 |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosReserved.js` | indices reservados | constantes e funcoes puras | API e estado | lista de indices | flags de reserva | teste unitario | 6.1 |
| `frontend-react/src/features/indicesFinanceiros/indicesFinanceirosFormatters.js` | data/decimal pt-BR | helpers puros | regra de dominio | valores crus | strings formatadas | teste unitario | 6.3 |

## 12. Fronteiras

- Pagina: composi; selecao atual; abertura de dialogs; integracao entre hooks.
- Hook de indices: carregamento, recarga, loading, erro, mutacoes de indice.
- Hook de cotacoes: indice ativo, carregamento, resposta fora de ordem, loading, erro, mutacoes de cotacao.
- Hook de selecao: indice selecionado, cotacao selecionada, limpeza segura.
- Toolbar: recebe estado pronto, nao consulta API, emite acoes.
- Tabelas: renderizam e selecionam, sem mutacao.
- Dialogs: validam localmente e submetem por callback ou hook.
- API: endpoints e payloads, sem estado visual.
- Mappers: adaptacao de resposta.
- Validators: obrigatoriedade e formato.
- Reserved: numero confirmado e funcoes puras.
- Formatters: data e decimal em pt-BR.

## 13. Estado da pagina

Estado minimo previsto:

- `selectedIndexNumber` ou chave equivalente
- `selectedQuotationId`
- indice ativo
- dialog aberto
- acao em andamento
- erro de submit
- request ativa do detalhe
- estado da consulta de uso
- destino da migracao

Evitar:

- duplicar listas em estado local;
- armazenar `clinica_id`;
- armazenar valor atual calculado;
- manter selecao de cotacao ao trocar indice.

## 14. Fluxo mestre/detalhe

1. A pagina abre.
2. Lista de indices carrega.
3. Um indice fica selecionado.
4. Cotacoes daquele indice carregam.
5. Troca de indice limpa detalhe anterior.
6. Recarga preserva selecao quando possivel.
7. Criacao altera a lista e recarrega detalhe.
8. Alteracao preserva contexto atual.
9. Exclusao confirma uso e decide fluxo.
10. Migracao resolve 409 e recarrega.
11. Falhas mantem estado visivel.
12. Cancelamentos fecham dialog sem perder contexto invalido.

## 15. API

Camada isolada deve cobrir:

- listar indices;
- criar indice;
- alterar indice;
- excluir indice;
- consultar uso;
- migrar e excluir;
- listar cotacoes;
- criar cotacao;
- alterar cotacao;
- excluir cotacao.

Regras:

- sem estado visual;
- sem tenant manual;
- sem calculo local de valor atual;
- erro tecnico normalizado de forma consistente.

## 16. Mappers

Responsabilidades:

- adaptar nomes de resposta;
- converter datas para o formato esperado pela UI;
- preservar valores de dominio;
- nao calcular valor atual;
- nao decidir regra de reserva.

## 17. Validators

Responsabilidades:

- obrigatoriedade;
- formato;
- limites simples;
- mensagem local de formulario.

Nao devem:

- duplicar validacao de backend;
- decidir regras de uso ou migracao;
- calcular valor atual.

## 18. Reserved

Indice reservado deve ficar centralizado em funcoes puras.

Confirmados para o contrato atual:

- `R$`
- `UHO`
- `UPO`
- `USO`

## 19. Formatters

- Data em `pt-BR`.
- Decimal em `pt-BR`.
- Sem alterar valor de dominio.
- Sem aplicar arredondamento funcional secreto.

## 20. Toolbar

Toolbar futura deve:

- receber estado pronto;
- nao consultar API;
- nao conter regra de dominio;
- emitir acoes;
- respeitar desabilitacao por selecao e carregamento.

## 21. Tabelas

- Tabela de indices: leitura, selecao, estado vazio, loading, erro.
- Tabela de cotacoes: leitura por indice, selecao, ordenacao coerente e recarga.
- Nenhuma tabela deve efetuar mutacoes diretamente.

## 22. Dialogs

- Dialog de indice: incluir e alterar.
- Dialog de cotacao: incluir e alterar.
- Dialog de exclusao: confirmar.
- Dialog de migracao: resolver 409 com destino.

Se houver erro, o dialog deve permanecer aberto.

## 23. Exclusao

- Consultar uso antes de excluir.
- Tratar 409 de forma guiada.
- Recarregar listas apos sucesso.
- Preservar selecao seguinte quando possivel.

## 24. Migracao

- Fluxo separado da exclusao simples.
- Destino precisa ser elegivel.
- Operacao deve ser atômica do ponto de vista da UI.
- Retorno 409 precisa ser tratado sem perda de contexto.

## 25. Estrategia de erro

- Normalizar erro tecnico na API.
- Exibir erro de forma visivel.
- Manter modal aberto em submit falho.
- Separar erro de carregamento, erro de submit e erro de rede.

## 26. Estrategia de loading

- Loading da lista principal.
- Loading do detalhe.
- Loading de submit.
- Desabilitar acoes enquanto mutacao estiver ativa.

## 27. Estrategia de selecao

- Selecionar por chave, nao por objeto inteiro.
- Limpar detalhe ao trocar indice.
- Preservar selecao quando a lista ainda contiver o item.
- Nao manter cotacao selecionada ao trocar indice.

## 28. Micropassos

### 6.0 - preparacao documental e revisao

- Objetivo: confirmar contratos e documentos-base.
- Arquivos previstos: documentos novos e existentes apenas para leitura.
- Arquivos proibidos: codigo, roadmap oficial, backend, testes executaveis.
- Testes: nenhum.
- Critério de aceite: plano aprovado e consistente.

### 6.1 - registro passivo de rota e feature

- Objetivo: registrar rota e feature vazia.
- Arquivos previstos: pagina, rota, registro minimo de menu.
- Arquivos proibidos: CRUD, API, dados fake.
- Testes: rota e shell.
- Critério de aceite: pagina abre sem mutacao.

### 6.2 - shell visual e toolbar passiva

- Objetivo: exibir barra em `L` e toolbar sem acao.
- Arquivos previstos: shell da pagina e toolbar.
- Arquivos proibidos: chamadas de API.
- Testes: ordem da toolbar, labels, ausencia de `Fecha`.
- Critério de aceite: estrutura visual correta.

### 6.3 - tabela de indices em leitura

- Objetivo: carregar indices.
- Arquivos previstos: API, hook, mapper, tabela principal.
- Arquivos proibidos: mutacao e migracao.
- Testes: loading, vazio, erro, selecao.

### 6.4 - tabela de cotacoes em leitura

- Objetivo: carregar cotacoes por indice.
- Arquivos previstos: API, hook, tabela secundaria.
- Arquivos proibidos: CRUD destrutivo.
- Testes: resposta fora de ordem, selecao e recarga.

### 6.5 - modal Novo indice

- Objetivo: criar indice.
- Arquivos previstos: dialog e validacao.
- Arquivos proibidos: migracao e exclusao de outro fluxo.
- Testes: submit, erro, preservacao de selecao.

### 6.6 - modal Altera indice

- Objetivo: editar indice, com protecao de reservado.
- Arquivos previstos: dialog, validators e hook.
- Arquivos proibidos: migracao.
- Testes: reservado, alteracao, reload.

### 6.7 - exclusao simples de indice

- Objetivo: remover indice sem migracao.
- Arquivos previstos: consulta de uso, confirmacao, delete.
- Arquivos proibidos: modal de destino.
- Testes: 200, 409, 403 e recarga.

### 6.8 - migracao e exclusao

- Objetivo: resolver 409 com migracao.
- Arquivos previstos: modal, hook e helpers de destino.
- Arquivos proibidos: juntar com outro CRUD.
- Testes: destino, 409, recarga total.

### 6.9 - modal Novo valor

- Objetivo: criar cotacao.
- Arquivos previstos: dialog, api e validator.
- Arquivos proibidos: mudar backend.
- Testes: submit e recarga das duas tabelas.

### 6.10 - modal Altera valor

- Objetivo: alterar cotacao.
- Arquivos previstos: dialog e api.
- Arquivos proibidos: calculo local.
- Testes: patch e recarga.

### 6.11 - exclusao de valor

- Objetivo: remover cotacao.
- Arquivos previstos: confirmacao e recarga.
- Arquivos proibidos: alterar valor atual no React.
- Testes: delete e selecao seguinte.

### 6.12 - tema, acessibilidade e responsividade

- Objetivo: estabilizar layout.
- Arquivos previstos: estilos e ajustes visuais.
- Arquivos proibidos: mutacao funcional.
- Testes: claro, escuro, teclado e foco.

### 6.13 - homologacao integrada

- Objetivo: validar com backend real.
- Arquivos previstos: nenhum novo.
- Arquivos proibidos: alteracao de escopo.
- Testes: runtime, console, rede e regressao.

### 6.14 - documentacao, roadmap e encerramento

- Objetivo: fechar etapa e registrar resultados.
- Arquivos previstos: docs de fechamento.
- Arquivos proibidos: misturar outras frentes.
- Testes: apenas verificacao documental.

## 29. Dependencias entre passos

- 6.1 depende apenas de definicao de rota e shell.
- 6.2 depende de 6.1.
- 6.3 depende de 6.2.
- 6.4 depende de 6.3.
- 6.5 depende de 6.3.
- 6.6 depende de 6.5.
- 6.7 depende de 6.6.
- 6.8 depende de 6.7.
- 6.9 depende de 6.4.
- 6.10 depende de 6.9.
- 6.11 depende de 6.10.
- 6.12 depende do fluxo funcional principal.
- 6.13 depende de todos os passos funcionais anteriores.
- 6.14 depende da homologacao.

## 30. Testes por passo

- 6.1: rota, shell e estado inicial.
- 6.2: toolbar, labels e ausencia de `Fecha`.
- 6.3: api, loader, empty e erro.
- 6.4: leitura por indice e ordem de resposta.
- 6.5: validacao e submit de indice.
- 6.6: reservado e alteracao.
- 6.7: exclusao simples.
- 6.8: migracao e 409.
- 6.9: criacao de cotacao.
- 6.10: alteracao de cotacao.
- 6.11: exclusao de cotacao.
- 6.12: visual e acessibilidade.
- 6.13: runtime real e regressao.
- 6.14: verificacao documental.

## 31. Build por passo

- 6.1: build obrigatorio se houver alteracao de shell.
- 6.2: build obrigatorio.
- 6.3 a 6.11: build obrigatorio em cada entrega funcional.
- 6.12: build obrigatorio.
- 6.13: build obrigatorio.
- 6.14: nao aplicavel.

## 32. Criterios de aceite

- shell correto;
- toolbar correta;
- leitura de indices;
- leitura de cotacoes;
- CRUD separado;
- migracao separada;
- valor atual sem calculo local;
- tenant sem controle manual;
- estados de erro e loading claros.

## 33. Criterios de parada

- qualquer calculo de dominio no React;
- qualquer uso manual de `clinica_id`;
- qualquer fluxo destrutivo embutido na pagina;
- qualquer modal que feche em erro e perca contexto;
- qualquer commit misturando outra frente.

## 34. Riscos

- worktree sujo;
- arquivos compartilhados;
- mistura com Plano de contas;
- calculo local indevido;
- tenant manual;
- regra de reservado duplicada;
- resposta fora de ordem;
- valor atual desatualizado;
- exclusao sem consulta de uso;
- migracao incompleta;
- 409 ignorado;
- modal fechando em erro;
- perda de selecao;
- mojibake;
- tabela sem altura;
- commit misturado.

## 35. Homologacao

### Tecnica

- testes;
- build;
- console;
- rede;
- endpoints.

### Funcional

- seis acoes;
- migracao;
- reservados;
- selecao;
- valor atual;
- vazio;
- erro.

### Visual

- barra em L;
- toolbar;
- tabelas;
- tema;
- responsividade;
- densidade;
- alinhamento.

### Seguranca

- tenant;
- permissao;
- ausencia de `clinica_id` manual;
- ausencia de exposicao tecnica indevida.

### Regressao

- Plano de contas;
- menu Configuracoes;
- shell;
- modulos dependentes;
- mojibake.

## 36. Roadmap futuro

Nao alterar `docs/11_roadmap_desenvolvimento.md` nesta etapa.

Atualizacoes futuras sugeridas:

- inicio formal da implementacao;
- conclusao da leitura inicial;
- conclusao do CRUD;
- homologacao;
- encerramento.

Preservar:

- estado atual do roadmap geral;
- marcos ja registrados;
- limitacoes de seguranca e stage seletivo.

## 37. Commits futuros

Matriz planejada de commits seletivos:

- fundacao;
- grupos;
- categorias;
- exclusao simples;
- migracao;
- shell global;
- documentacao.

Cada commit deve ser pequeno, rastreavel e sem misturar frentes.

## 38. Fora de escopo

- alterar codigo;
- criar rota agora;
- criar menu agora;
- criar componente agora;
- criar teste executavel agora;
- alterar backend;
- alterar banco;
- alterar roadmap oficial;
- fazer commit.

## 39. Conclusao

O modulo `Indices financeiros` deve ser implementado de forma modular, com pagina orquestradora, toolbar separada, tabelas dedicadas, API isolada, helpers puros para reservas e formatacao, e fluxo destrutivo separado por etapas.

## 40. Primeira etapa recomendada

Comecar pela etapa 6.1, apenas com roteamento e feature passiva, sem API de escrita, sem CRUD e sem calculos de dominio no frontend.

## 41. Fechamento desta frente

O planejamento foi superado pelo estado real homologado da feature.

Decisao documental desta rodada:

- a arquitetura e o contrato agora servem como referencia de manutencao e nao mais como plano futuro;
- `brana_token` e a verificacao em `/api/me` sao o contrato de autenticacao do runtime validado;
- `App.jsx`, `basePath.js` e `vite.config.js` permanecem como alteracoes de integracao a auditar separadamente no futuro;
- `SimboloGraficoCreateModal.jsx` pertence a outra frente e nao deve ser absorvido pela documentacao ou por qualquer matriz de commit desta feature.
