# Prestadores - Subetapa 2 - Fronteiras e contratos

## 1. Objetivo da Subetapa 2

Esta etapa documenta as fronteiras e contratos do modulo `Prestadores` antes de qualquer extracao funcional.

Objetivos desta fase:

- documentar a fronteira atual entre `frontend/app.js` e o namespace passivo;
- registrar os contratos de abertura, UI, carregamento, renderizacao, selecao, filtros e acoes;
- preparar futuras extracoes seguras, pequenas e puros;
- manter o comportamento inalterado.

## 2. Estado atual do modulo

Estado confirmado nesta etapa:

- `frontend/js/modules/prestadores.js` existe;
- `window.BranaPrestadoresModule` existe;
- `status: "passivo"`;
- `ativo: false`;
- `controlaFluxo: false`;
- `subetapa: "1_namespace_passivo"`;
- sem DOM;
- sem `fetch`/`requestJson`;
- sem eventos.

O namespace continua sendo apenas uma fronteira passiva e nao interfere no fluxo funcional do sistema.

## 3. Fronteira atual entre `app.js` e o modulo

Hoje, `frontend/app.js` continua sendo a fonte funcional da verdade para Prestadores.

O namespace passivo:

- nao controla fluxo;
- nao renderiza;
- nao carrega dados;
- nao valida payload;
- nao interfere na grade;
- nao abre nem fecha telas;
- nao altera cache;
- nao registra eventos.

Em outras palavras, o modulo existe como contrato estrutural, mas a implementacao funcional ainda mora em `app.js`.

## 4. Contrato de abertura

### Funcao contratada

- `prestAbrir()`

### O que ela espera existir

- `prestEnsureUI()`;
- `hideAllPanels()`;
- `workspaceEmpty`;
- `ensurePanelChrome(prestCfg.panel)`;
- `prestCarregar()`;
- `footerMsg`.

### Fluxo atual

1. garante a UI com `prestEnsureUI()`;
2. fecha os demais paineis com `hideAllPanels()`;
3. mostra `prestCfg.panel`;
4. oculta `workspaceEmpty`;
5. reforca o chrome do painel;
6. chama `await prestCarregar()`;
7. atualiza o rodape com `Cadastro > Prestadores aberto.`.

### O que nao deve ser movido ainda

- a abertura principal;
- o fechamento dos demais paineis;
- a chamada a `prestEnsureUI()`;
- a chamada a `prestCarregar()`;
- a atualizacao de `footerMsg`.

Esses pontos ainda fazem parte do contrato funcional central e nao devem ser extraidos cedo.

## 5. Contrato de UI

### Funcao contratada

- `prestEnsureUI()`

### O que ela cria

- injecao de estilo para a classe `.prest-panel` e afins;
- `<section id="prestadores-panel">`;
- barra de acoes;
- filtros;
- grade/tabela;
- totalizador;
- referencias em `prestCfg`.

### Elementos relevantes

- painel: `#prestadores-panel`
- botao novo: `#prest-btn-novo`
- botao editar: `#prest-btn-editar`
- botao excluir: `#prest-btn-excluir`
- botao agenda: `#prest-btn-agenda`
- botao convenios: `#prest-btn-convenios`
- botao comissoes: `#prest-btn-comissoes`
- botao fechar: `#prest-btn-fechar`
- filtro especialidade: `#prest-cbo-especialidade`
- filtro nome: `#prest-txt-nome`
- tbody: `#prest-tbody`
- total: `#prest-total`

### Classes relevantes

- `.prest-panel`
- `.prest-toolbar`
- `.prest-filtros`
- `.prest-grid`
- `.prest-total`
- `.sep`

### Dependencia com workspace e paines

- a UI e criada dinamicamente apos `workspaceEmpty`;
- a abertura depende do mecanismo geral de paineis;
- o painel usa `ensurePanelChrome()`.

### O que nao deve ser movido ainda

- criacao do painel;
- criacao dos filtros;
- criacao da grade;
- criacao dos botoes;
- injecao de estilo;
- captura de referencias DOM;
- `bindStandardGridActivation`.

## 6. Contrato de carregamento

### Funcao contratada

- `prestCarregar()`

### Contrato atual

- endpoint direto: `GET /cadastros/prestadores`;
- o retorno esperado contem `data.itens`;
- os itens sao normalizados para um cache local;
- o cache e armazenado em `prestadoresCache`;
- a selecao e ajustada via `prestadorSelId`;
- a lista e re-renderizada por `prestRender()`.

### Uso de `requestJson`/`fetch`

- a carga usa `requestJson("GET","/cadastros/prestadores", undefined, true)`;
- se o request falhar, ha fallback local;
- o fallback nao deve ser interpretado como contrato de persistencia real.

### Fallback observado

Se houver `sessaoAtual`, e inserido um registro sintetico com base no usuario logado.
Se nao houver, e inserido um item `"Clínica"`.

### Tratamento de erro

- o erro e absorvido pelo fluxo local;
- nao ha painel de erro especifico;
- o modulo tenta seguir com uma lista minima.

### O que nao deve ser movido ainda

- o endpoint de listagem;
- o uso de `requestJson`;
- a normalizacao dos itens;
- a atribuicao do cache;
- a chamada a `prestRender()`;
- o fallback de emergencia.

## 7. Contrato de renderizacao

### Funcao contratada

- `prestRender()`

### Contrato atual

- lê `prestadoresCache`;
- lê filtros de `prestCfg.cboEspecialidade` e `prestCfg.txtNome`;
- usa `prestadorSelId` para destacar a linha atual;
- recria integralmente o `tbody`;
- atualiza o total em `prestCfg.total`;
- mostra estado vazio quando nao houver itens.

### Status visual

- o status e exibido por `prestStatusHtml(ativo)`;
- a linha selecionada recebe classe `selected`.

### Dependencia com DOM

- a funcao depende diretamente de `prestCfg`;
- depende da tabela viva do painel;
- o `tbody` e recriado a cada render.

### O que nao deve ser movido ainda

- a renderizacao inteira;
- o uso de `prestadoresCache`;
- o uso de `prestadorSelId`;
- a logica do estado vazio;
- o marcador visual de status;
- o rerender da tabela.

## 8. Contrato de selecao e ativacao da grade

### Contrato atual

- a grade usa `bindStandardGridActivation(prestCfg.tbody, ...)`;
- a selecao chama `prestSelecionarLinha(tr)`;
- a acao de edicao usa `prestAcoesPlaceholder("Altera")`.

### Comportamento de clique

- clique simples seleciona a linha;
- segundo clique rapido e tratado pelo helper da grade;
- duplo clique nativo nao aparece como handler separado neste bloco.

### Riscos por rerender do `tbody`

- o `tbody` e recriado por `prestRender()`;
- qualquer extracao precoce pode quebrar a selecao ou a ativacao;
- a tabela dinamica exige cuidado com contexto e tempo de clique.

### Por que nao mover cedo

- `bindStandardGridActivation` e parte do contrato conservador da tabela;
- ele concentra o padrao de ativacao usado no modulo;
- mexer nisso cedo tende a quebrar a experiencia de selecao.

## 9. Contrato de filtros

### Filtros atuais

- filtro por nome: `prest-txt-nome`;
- filtro por especialidade: `prest-cbo-especialidade`.

### Eventos associados

- `change` em especialidade chama `prestRender()`;
- `input` em nome chama `prestRender()`.

### Dependencia com `prestRender()`

- os filtros nao possuem fluxo proprio;
- eles apenas alteram a leitura que `prestRender()` faz sobre `prestadoresCache`.

### Riscos desta fase

- transformar filtro em helper separado cedo demais pode desalinhá-lo do rerender;
- o filtro e simples, mas ainda acoplado ao painel.

## 10. Contrato de acoes / botoes

### Botoes atuais

- `Novo` -> `prestAcoesPlaceholder("Novo prestador")`
- `Editar` -> `prestAcoesPlaceholder("Altera")`
- `Excluir` -> `prestAcoesPlaceholder("Elimina")`
- `Agenda` -> `prestAcoesPlaceholder("Agenda")`
- `Convênios` -> `prestAcoesPlaceholder("Convênios")`
- `Comissões` -> `prestAcoesPlaceholder("Comissões")`
- `Fechar` -> fecha o painel

### O que e placeholder hoje

- Novo
- Editar
- Excluir
- Agenda
- Convênios
- Comissões

### O que tem fluxo real hoje

- Fechar painel.

### Dependencias com outros modulos

- `Agenda`, `Convênios` e `Comissões` sao sinais de futuros subfluxos;
- hoje nao ha implementacao funcional real desses botões.

## 11. Contrato de estado / cache

### Estados centrais

- `prestCfg`;
- `prestadoresCache`;
- `prestadorSelId`.

### Estados de contexto usados pelo fluxo

- `sessaoAtual` como fallback de carregamento;
- `footerMsg` para mensagens;
- `workspaceEmpty` para alternar visibilidade do workspace.

### Observacao

- nao foi identificado outro cache auxiliar relevante para a Subetapa 2;
- o estado continua pequeno e centralizado no bloco monolitico do `app.js`.

## 12. Contrato com endpoints

### Endpoint direto do modulo

- `GET /cadastros/prestadores`

### Endpoints ausentes nesta fase

- nao foi encontrado `POST` funcional para criar;
- nao foi encontrado `PUT` ou `PATCH` funcional para atualizar;
- nao foi encontrado `DELETE` funcional para excluir;
- nao foi encontrado endpoint auxiliar de modal.

### Endpoints em consumidores externos

- consumidores externos tambem usam `GET /cadastros/prestadores`;
- os contratos de consumidores ainda sao leitura e apoio, nao CRUD do modulo principal.

### Cuidado

- nao inventar contratos que ainda nao existem;
- qualquer futura extracao de salvar/excluir precisa partir de uma descoberta concreta do backend.

## 13. Contrato com consumidores externos

### Consumidores identificados

- `usersCarregarCombos()`
- `agenda-legado`
- `agenda-semana`
- dispatcher `cadastro-prestadores`
- shell/paines/mapas de `Prestadores`

### Papel de cada consumidor

- `usersCarregarCombos()` usa a lista para popular o combo de prestador;
- `agenda-legado` usa prestadores como filtro e contexto de agenda;
- `agenda-semana` usa prestadores para montar a agenda e elegibilidade;
- o dispatcher aponta o menu para `prestAbrir()`;
- o shell reconhece `prestadores-panel` em titulos, insets e fechamento.

### Impacto de fronteira

- o dado de prestadores nao e local apenas do painel;
- existem leitores externos que dependem da lista e do formato atual.

## 14. Contrato DOM

### IDs e estruturas relevantes

- painel: `#prestadores-panel`
- tabela: `<table>` do painel
- tbody: `#prest-tbody`
- filtros: `#prest-cbo-especialidade`, `#prest-txt-nome`
- botoes: `#prest-btn-novo`, `#prest-btn-editar`, `#prest-btn-excluir`, `#prest-btn-agenda`, `#prest-btn-convenios`, `#prest-btn-comissoes`, `#prest-btn-fechar`
- containers: `.prest-panel`, `.prest-toolbar`, `.prest-filtros`, `.prest-grid`, `.prest-total`
- mensagens: `footerMsg`

### Observacao de contrato

- o DOM do modulo e criado dinamicamente em `prestEnsureUI()`;
- por isso a dependencia de fronteira e forte, e a extracao deve ser muito cautelosa.

## 15. Riscos preservados

Riscos que permanecem preservados e documentados:

- grade dinamica;
- dependencia de `bindStandardGridActivation`;
- rerender do `tbody`;
- consumidores externos;
- ausencia de salvar/excluir completo;
- fallback de carregamento;
- endpoints ainda limitados;
- risco de extracao especulativa.

## 16. Candidatos seguros para a Subetapa 3

### 16.1 `prestFmtCodigo`

- entrada esperada: `valor`, `idx`;
- saida esperada: codigo textual com preenchimento a esquerda;
- por que e puro: usa apenas numeros e `String`;
- por que nao depende de DOM: nao acessa elementos nem estado visual;
- por que nao depende de `requestJson`/`fetch`: nao faz I/O;
- risco de integracao futura: baixo, mas precisa continuar consistente com o formato exibido na grade.

### 16.2 `prestStatusHtml` ou alternativa textual segura

- entrada esperada: booleano de ativo;
- saida esperada: rotulo/indicador visual simples;
- por que e puro: deriva a saida somente da entrada;
- por que nao depende de DOM: retorna string;
- por que nao depende de `requestJson`/`fetch`: nao consulta backend;
- risco de integracao futura: medio, porque o marcador visual pode ser substituido por contrato de estilo diferente.

### 16.3 `prestNormalizarNomePrestador`

- entrada esperada: texto livre;
- saida esperada: nome aparado e saneado;
- por que e puro: transformacao textual deterministica;
- por que nao depende de DOM: recebe e devolve string;
- por que nao depende de `requestJson`/`fetch`: nenhum I/O;
- risco de integracao futura: medio, porque pode impactar comparacao, filtro e exibicao.

### 16.4 `prestValidarNomePrestador`

- entrada esperada: texto livre;
- saida esperada: valido/invalido ou mensagem;
- por que e puro: regra textual e deterministica;
- por que nao depende de DOM: nenhuma interacao com UI;
- por que nao depende de `requestJson`/`fetch`: nenhuma chamada externa;
- risco de integracao futura: medio, porque validacao pode afetar salvamento quando existir.

### 16.5 `prestNormalizarEspecialidade`

- entrada esperada: texto de especialidade;
- saida esperada: especialidade aparada e normalizada;
- por que e puro: transformatacao textual simples;
- por que nao depende de DOM: sem UI;
- por que nao depende de `requestJson`/`fetch`: sem backend;
- risco de integracao futura: medio, porque o filtro da grade depende desse campo.

### 16.6 `prestMontarLabelPrestador`

- entrada esperada: objeto simples ou campos de texto;
- saida esperada: rotulo curto legivel;
- por que e puro: formata texto sem side effects;
- por que nao depende de DOM: retorna string;
- por que nao depende de `requestJson`/`fetch`: nao acessa rede;
- risco de integracao futura: medio, porque pode ser usado em varios consumidores.

## 17. Recomendacao para a Subetapa 3

O helper mais seguro para comecar parece ser `prestFmtCodigo`.

Motivos:

- e pequeno;
- e textual;
- e puro;
- nao depende de DOM;
- nao depende de `requestJson`/`fetch`;
- tem risco baixo de regressao.

Depois dele, a proxima alternativa ainda conservadora seria `prestStatusHtml` ou uma alternativa textual equivalente, desde que o contrato visual fique bem definido.

Nao recomendar nesta fase:

- mover renderizacao;
- mover eventos;
- mover `requestJson`;
- mover selecao de linha;
- mover `bindStandardGridActivation`.

