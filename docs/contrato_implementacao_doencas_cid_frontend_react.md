# Contrato de implementacao do modulo Doencas (CID) no frontend React

## 1. Objetivo

Estabelecer o contrato tecnico e funcional para a futura implementacao do modulo `Doencas (CID)` no novo frontend React do Brana Cloude, usando exclusivamente as evidencias levantadas na auditoria do legado e nos padroes ja consolidados do shell administrativo.

Este documento nao implementa tela, rota, menu, backend, banco ou migration. Ele apenas define o comportamento esperado da primeira versao React do modulo e os portoes de validacao que continuam pendentes.

## 2. Escopo

Este contrato cobre:

- localizacao do modulo dentro do agrupador `Tabelas`;
- rota React recomendada;
- permissao preservada na primeira implementacao;
- shell visual e referencia estrutural;
- toolbar;
- tabela;
- modal;
- API ja existente;
- tratamento de erros;
- fluxo de estado;
- arquitetura modular sugerida;
- arquivos que devem ser alterados futuramente;
- portoes futuros de validacao.

Fora do escopo desta etapa:

- implementar componentes React;
- criar rota;
- habilitar menu;
- alterar backend;
- alterar model;
- alterar banco;
- criar migration;
- instalar dependencias;
- fazer commit;
- fazer push.

## 3. Fontes da auditoria

Fontes consideradas para este contrato:

- `docs/auditoria_doencas_cid_frontend_legado.md`
- `docs/frontend_react_padrao_shell_modulos_administrativos.md`
- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/cid.js`
- `backend/routes/cid_routes.py`
- `backend/models/doenca_cid.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/components/TableColumnFilterHeader.jsx`
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`
- `docs/11_roadmap_desenvolvimento.md` apenas para verificacao de necessidade de atualizacao, sem alteracao nesta etapa

## 4. Fatos comprovados

- O item legado do modulo aparece como `Doenças (CID)...` dentro do agrupador `Tabelas`.
- O legado funcional ativo esta em `frontend/app.js`.
- O arquivo `frontend/js/modules/cid.js` existe como helper passivo e nao conduz o fluxo principal.
- O backend exposto para o modulo e `/cid`.
- A permissao atual do backend e `anamnese`.
- O React ja possui o item `doencas-cid` listado em `frontend-react/src/app/App.jsx`, mas ele esta desabilitado.
- O padrao estrutural comum dos modulos administrativos usa lateral + barra horizontal integrada + area principal abaixo.
- O componente compartilhado `BranaTable` existe e o cabecalho filtravel compartilhado e `TableColumnFilterHeader`.

## 5. Limitacoes mantidas

As seguintes limitacoes permanecem explicitas e viram portoes futuros de validacao:

1. comportamento visual da tela CID em sessao autenticada nao foi comprovado diretamente;
2. dimensoes exatas da tela e do modal do legado nao foram comprovadas diretamente;
3. contagem real dos registros no PostgreSQL nao foi confirmada por SQL direto;
4. constraints e foreign keys nao foram verificadas diretamente por SQL;
5. dependencias reais de exclusao nao foram verificadas diretamente no banco;
6. retorno real do endpoint observado no navegador autenticado nao foi validado.

Esses pontos nao autorizam invenção de dados, tamanhos ou fluxos. Eles devem permanecer como portoes futuros de validacao.

## 6. Decisoes preservadas

- O modulo continua dentro de `Tabelas`.
- O label funcional permanece `Doenças (CID)`.
- A primeira implementacao deve preservar a permissao `anamnese`.
- Nao deve ser criada permissao nova nesta etapa.
- O frontend nao deve prometer acesso que o backend possa recusar.
- O shell administrativo deve seguir o padrao consolidado do frontend React.
- O modulo nao deve inventar pagina paralela, toolbar paralela ou filtros paralelos fora do shell compartilhado.

## 7. Localizacao no menu

O item deve permanecer no agrupador:

`Tabelas`

Label:

`Doenças (CID)`

Situacao atual no React:

- o item ja existe em `frontend-react/src/app/App.jsx`;
- ele esta desabilitado;
- o contrato recomenda sua habilitacao futura no mesmo arquivo, no bloco `contextualMenus.tabelas`.

Local exato para habilitacao futura:

- `frontend-react/src/app/App.jsx`, no array `contextualMenus.tabelas`, onde hoje existe o objeto `{ key: 'doencas-cid', label: 'Doenças (CID)', disabled: true }`.

## 8. Rota

Rota recomendada:

`/app/tabelas/doencas-cid`

Arquivo onde deve ser declarada futuramente:

- `frontend-react/src/app/App.jsx`

Componente de pagina associado:

- `frontend-react/src/features/doencasCid/DoencasCidPage.jsx`

Comportamento do item ativo:

- ao clicar no item, a tela deve navegar para a rota recomendada;
- a pagina deve carregar a listagem do modulo;
- o estado da rota deve ser refletido no shell padrao;
- o modulo deve manter o item ativo visualmente no contexto `Tabelas`.

Tratamento de permissao:

- o frontend deve respeitar o retorno do backend;
- `401` e `403` devem ser tratados por fluxo padrao de sessao/permissao do React;
- a tela nao deve tentar contornar a recusa do backend;
- a revisao de permissao como regra de produto fica para frente futura independente.

Redirecionamentos aplicaveis:

- sem autenticacao ou com sessao expirada, redirecionar para a tela de login ou fluxo padrao de autenticacao da aplicacao;
- sem permissao, exibir estado de acesso negado dentro do padrao existente do React;
- se a rota nao estiver habilitada ainda, permanecer fora da navegacao ativa.

## 9. Permissao

Contrato obrigatorio para a primeira implementacao:

- preservar `require_module_access("anamnese")`;
- nao criar permissao nova;
- nao alterar backend;
- nao alterar o controle de acesso;
- nao presumir que o acoplamento esta errado;
- registrar a revisao de permissao como frente futura independente.

Tratamento de erros de acesso na interface:

- `401`: tratar como sessao invalida ou expirada, seguindo o fluxo global de autenticacao;
- `403`: tratar como acesso negado ao modulo, com mensagem padrao do projeto;
- modulo indisponivel: mostrar estado de indisponibilidade ou fallback padrao da aplicacao, sem inventar tela substituta;
- sessao expirada: encerrar acesso atual e direcionar para login, conforme o shell autenticado do React.

## 10. Shell

Referencial estrutural principal:

`frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`

Referenciais de apoio:

- `frontend-react/src/features/procedimentos/ProcedimentosPage.jsx`
- `frontend-react/src/features/materiaisEstoque/MateriaisEstoquePage.jsx`

O modulo deve seguir:

- barra lateral existente;
- barra horizontal unica e continua, conectada visualmente a lateral;
- conteudo administrativo abaixo da barra;
- tabela compacta;
- espaco e densidade semelhantes aos modulos administrativos de referencia;
- sem shell paralelo;
- sem tentar reproduzir o legado apenas com CSS local.

### 10.1 Componente de pagina

`DoencasCidPage.jsx` deve:

- orquestrar carregamento;
- manter selecao;
- controlar modal;
- repassar callbacks para toolbar e tabela;
- limpar estado ao sair da rota ou desmontar.

### 10.2 Toolbar

`DoencaCidToolbar.jsx` deve:

- agrupar acoes primarias;
- expor a busca local, se usada;
- mostrar estado de selecao;
- respeitar loading e permissao;
- manter densidade visual alinhada ao shell administrativo.

### 10.3 Area da tabela

`DoencaCidTable.jsx` deve:

- receber os registros filtrados;
- renderizar em `BranaTable` quando compativel;
- reaproveitar `TableColumnFilterHeader` se o contrato de coluna exigir cabeçalho filtravel;
- exibir linha selecionada;
- responder a duplo clique quando comprovado pelo legado;
- manter scroll apropriado;
- nao inventar paginação.

### 10.4 Estados visuais

- `loading`: bloquear a interacao principal e exibir feedback padrao;
- vazio: mostrar estado vazio simples, sem mensagem inventada;
- erro: mostrar mensagem amigavel padrao;
- selecao de linha: destacar a linha ativa;
- responsivo: reduzir densidade sem perder a barra unica nem a legibilidade da tabela;
- limpeza de estado: ao sair da rota, limpar selecao, modal e filtros locais.

## 11. Toolbar

### Acoes disponiveis, conforme o legado comprovado

Ordem visual recomendada:

1. `Nova doença...`
2. `Altera...`
3. `Elimina`
4. `Fecha`

### Detalhamento

- `Nova doença...`
  - icone: `novo.png`
  - estado: habilitado
  - dependencias: nenhuma selecao previa
  - comportamento: abre modal limpo de inclusao

- `Altera...`
  - icone: `editar.png`
  - estado: habilitado apenas quando houver linha selecionada
  - dependencias: selecao de linha
  - comportamento: abre modal preenchido para edicao
  - duplo clique: deve abrir edicao se o padrao da tabela mantiver o comportamento comprovado do legado

- `Elimina`
  - icone: `eliminar.png`
  - estado: habilitado apenas quando houver linha selecionada
  - dependencias: selecao de linha e confirmacao
  - comportamento: dispara confirmacao e, apenas apos confirmar, chama exclusao

- `Fecha`
  - icone: `cancela.png`
  - estado: habilitado
  - comportamento: sai do modulo e retorna ao workspace padrao

### Comportamento durante loading

- enquanto a lista carrega, as acoes que dependem de dados devem ficar desabilitadas ou protegidas;
- `Nova doença...` pode ficar disponivel apenas se o padrao global permitir criar durante carregamento;
- `Altera...` e `Elimina` devem respeitar a ausencia de selecao;
- nenhum botao novo deve ser introduzido sem comprovacao.

### Acoes proibidas

- imprimir;
- exportar;
- atualizar;
- duplicar;
- filtro global fora do contrato;
- acoes em lote.

### Confirmacao de exclusao

O contrato recomenda modal compartilhado ou modal Ant Design para confirmacao. Ficam proibidos:

- `window.alert`;
- `window.confirm`;
- `window.prompt`.

## 12. Tabela

### Estrutura comprovada do legado

Colunas:

1. `Código`
2. `Doença`

### Contrato visual da tabela

- `BranaTable`: usar quando o componente consolidado atender a densidade e interacao esperadas;
- `TableColumnFilterHeader`: usar quando o cabecalho filtravel for compatível com o comportamento do modulo;
- ordenacao inicial: por `codigo`, alinhada ao backend atual;
- selecao: linha unica;
- `rowKey`: `id`;
- duplo clique: abre edicao, caso o comportamento seja mantido no React;
- estado vazio: sem itens visiveis, com feedback simples;
- loading: feedback padrao do shell, sem inventar estado novo;
- scroll: deve preservar o acesso aos registros sem paginação;
- responsivo: tabela deve manter legibilidade e compactacao.

### Campo de origem

- `Código` -> `codigo`
- `Doença` -> `descricao`

### Larguras iniciais sugeridas

As larguras exatas do legado nao foram comprovadas de modo visual autenticado. O contrato apenas recomenda:

- `Código`: largura estreita, compatível com tabela compacta;
- `Doença`: ocupa o restante da largura util.

### Filtros por coluna

Distincao obrigatoria:

- filtro comprovado no legado: busca local por codigo ou descricao;
- filtro visual padrao do React: cabeçalho filtravel, se adotado pelo shell consolidado;
- busca local: permitida sobre os registros ja carregados;
- filtro enviado ao backend: nao previsto para `/cid` nesta etapa.

O contrato nao autoriza adicionar query parameters novos ao endpoint.

## 13. Modal

### Titulo

- inclusao: `Nova doença`
- alteracao: `Alterar doença`

### Largura proposta

- o contrato recomenda seguir o padrao compacto dos modais administrativos React;
- nao copiar automaticamente a largura do legado;
- largura inicial sugerida: compacta, responsiva, com limite maximo controlado pelo shell.

### Campos

Campos comprovados:

1. `Código`
2. `Doença`
3. `Observações`
4. `Incluir na lista de preferidos`

### Matriz de campos

| Label no React | Campo do formulário | Campo no payload | Campo no backend/model | Tipo | Obrigatório | Valor inicial | Validação | Inclusão | Alteração | Observações |
|---|---|---|---|---|---|---|---|---|---|---|
| Código | `codigo` | `codigo` | `codigo` | texto | sim | vazio | nao vazio, trim e normalizacao simples de espacos | editavel | editavel | nao expor `clinica_id` |
| Doença | `descricao` | `descricao` | `descricao` | texto | sim | vazio | nao vazio, trim e normalizacao simples de espacos | editavel | editavel | representa o nome/descrição do CID |
| Observações | `observacoes` | `observacoes` | `observacoes` | texto multilinha | nao | vazio | trim simples | editavel | editavel | campo livre |
| Incluir na lista de preferidos | `preferido` | `preferido` | `preferido` | checkbox | nao | desmarcado | booleano | editavel | editavel | manter o contrato de lista de preferidos |
| Identificador interno | não expor | `id` apenas em resposta/edição | `id` | inteiro | nao | n/a | gerenciado pelo backend | nao editavel | nao editavel | usado para alteracao e selecao |
| Registro legado | não expor | `legacy_registro` em resposta | `legacy_registro` | inteiro | nao | n/a | gerenciado pelo backend | nao editavel | nao editavel | campo tecnico |
| Clínica | não expor | não enviar | `clinica_id` | inteiro | nao | n/a | obtido do usuario autenticado no backend | nao editavel | nao editavel | nao expor no formulario |

### Regras do modal

- foco inicial: `Código`, salvo convencao global diferente do shell;
- valores iniciais: campos vazios e checkbox desmarcado;
- campos bloqueados: nenhum campo editavel tem bloqueio por regra comprovada, exceto identificadores tecnicos nao expostos;
- validacoes: codigo e descricao obrigatorios;
- mensagens: usar mensagem generica padrao se o backend nao fornecer detalhe amigavel;
- carregamento: salvar e excluir devem mostrar estado de processamento;
- cancelamento: fecha o modal sem salvar;
- fechamento pelo `X`: fecha o modal sem salvar;
- apos salvar: fechar modal, atualizar lista e manter ou mover selecao para o registro salvo quando a resposta permitir.

### Normalizacao

- aplicar trim;
- remover espacos redundantes;
- nao transformar em caixa alta ou baixa;
- nao inventar regras de formacao de CID alem do que o backend atual ja faz.

## 14. API

### 14.1 Listagem

Metodo:

- `GET`

Rota:

- `/cid`

Parametros:

- `q` opcional, usado como filtro local do backend por codigo ou descricao

Resposta esperada:

- lista de objetos CID da clinica autenticada

Mapeamento:

- `codigo` -> `codigo`
- `descricao` -> `descricao`
- `observacoes` -> `observacoes`
- `preferido` -> `preferido`
- `id` -> `id`
- `legacy_registro` -> `legacy_registro`

Loading:

- exibir carregamento do modulo durante a consulta

Erros:

- falha de rede;
- `401`;
- `403`;
- mensagem generica quando o backend nao devolver detalhe amigavel

### 14.2 Inclusao

Metodo:

- `POST`

Rota:

- `/cid`

Payload:

- `codigo`
- `descricao`
- `observacoes`
- `preferido`

Campos omitidos:

- `id`
- `legacy_registro`
- `clinica_id`

Resposta esperada:

- objeto criado

Mensagem de sucesso:

- padrao do projeto para cadastro salvo com sucesso

Mensagens de erro:

- falha ao salvar;
- validacao do backend;
- acesso negado;
- sessao expirada

Atualizacao da tabela:

- recarregar listagem apos sucesso

### 14.3 Alteracao

Metodo:

- `PUT`

Rota:

- `/cid/{cid_id}`

Identificador:

- `cid_id`

Payload:

- `codigo`
- `descricao`
- `observacoes`
- `preferido`

Resposta esperada:

- objeto atualizado

Mensagem de sucesso:

- padrao do projeto para alteracao salva com sucesso

Mensagens de erro:

- falha ao salvar;
- registro nao encontrado;
- validacao do backend;
- acesso negado;
- sessao expirada

Atualizacao da tabela:

- recarregar listagem apos sucesso

### 14.4 Exclusao

Metodo:

- `DELETE`

Rota:

- `/cid/{cid_id}`

Identificador:

- `cid_id`

Confirmacao:

- modal compartilhado ou Ant Design, nunca `window.confirm`

Resposta esperada:

- `{"detail":"CID excluido."}` ou mensagem equivalente do backend

Mensagem de sucesso:

- padrao do projeto para exclusao concluida

Mensagens de erro:

- falha ao excluir;
- dependencia que impeca exclusao, se vier a existir;
- acesso negado;
- sessao expirada

Atualizacao da tabela:

- recarregar listagem apos sucesso;
- limpar ou reposicionar selecao conforme o padrao geral da tela

## 15. Tratamento de erros

### Falha ao listar

- mostrar mensagem amigavel padrao;
- manter tela funcional;
- nao apagar a estrutura do modulo.

### Falha ao criar

- manter modal aberto;
- mostrar mensagem amigavel padrao;
- nao limpar o formulario automaticamente.

### Falha ao alterar

- manter modal aberto;
- mostrar mensagem amigavel padrao;
- nao perder o registro em edicao.

### Falha ao excluir

- manter selecao atual quando possivel;
- mostrar mensagem amigavel padrao.

### Registro nao encontrado

- tratar como `404`;
- mostrar retorno padrao do projeto;
- permitir retorno ao grid ou recarregar a lista.

### Codigo duplicado

- o contrato nao comprova regra explicita de duplicidade por `codigo`;
- se o backend vier a devolver `409` ou `422`, a interface deve mostrar mensagem amigavel padrao sem inventar texto.

### Validacao de campo

- `codigo` e `descricao` devem ser obrigatorios;
- mensagens devem ser curtas e consistentes com o projeto.

### Respostas HTTP

- `401`: sessao expirada ou invalida;
- `403`: acesso negado;
- `404`: nao encontrado;
- `409`: conflito, se aplicavel futuramente;
- `422`: validacao;
- `500`: erro interno generico;
- dependencia que impeça exclusao: mensagem generica padrao;
- erro sem mensagem amigavel: fallback generico consistente.

## 16. Estado e fluxo

### Estado minimo necessario

- `registros`
- `loadingLista`
- `erroLista`
- `registroSelecionado`
- `modalAberto`
- `modoModal` `inclusao` ou `alteracao`
- `registroEmEdicao`
- `saving`
- `deleting`
- `filtrosLocais`
- `formulario`

### Fluxo ao entrar na rota

1. validar acesso pelo shell existente;
2. carregar registros;
3. exibir loading;
4. preencher tabela;
5. nao selecionar linha automaticamente, salvo se o padrao de tela exigir o contrario.

### Fluxo ao incluir

1. abrir modal limpo;
2. aplicar valores iniciais;
3. validar;
4. enviar `POST`;
5. apresentar sucesso;
6. fechar modal;
7. atualizar lista;
8. selecionar o registro criado se a resposta permitir.

### Fluxo ao alterar

1. exigir selecao;
2. abrir modal preenchido;
3. preservar `id` fora dos campos editaveis;
4. validar;
5. enviar `PUT`;
6. atualizar lista;
7. manter a linha alterada selecionada.

### Fluxo ao excluir

1. exigir selecao;
2. abrir confirmacao;
3. executar `DELETE` apenas apos confirmacao;
4. tratar dependencias se o backend vier a informar;
5. atualizar lista;
6. limpar ou reposicionar selecao.

## 17. Arquitetura modular

Estrutura sugerida:

```text
frontend-react/src/features/doencasCid/
├── DoencasCidPage.jsx
├── components/
│   ├── DoencaCidToolbar.jsx
│   ├── DoencaCidTable.jsx
│   └── DoencaCidModal.jsx
├── hooks/
│   └── useDoencasCid.js
├── doencasCidApi.js
├── doencasCidMappers.js
└── doencasCid.css
```

### Responsabilidade de cada arquivo

- `DoencasCidPage.jsx`
  - orquestra estado, carregamento, selecao, modal e callbacks;
  - depende de componentes e hook do modulo;
  - recebe estado de rota e auth do shell;
  - existe para evitar monolitico e manter a pagina legivel.

- `DoencaCidToolbar.jsx`
  - concentra a barra de acoes e busca;
  - recebe selecao, loading e callbacks;
  - existe para isolar a composicao visual da faixa superior.

- `DoencaCidTable.jsx`
  - renderiza a listagem;
  - recebe registros, selecao, loading e callbacks;
  - existe para reaproveitar tabela/cabecalho sem misturar com o estado da pagina.

- `DoencaCidModal.jsx`
  - cuida do formulario de inclusao e alteracao;
  - recebe visibilidade, valor atual, callbacks de salvar/cancelar e estado de saving;
  - existe para separar a edicao do grid.

- `useDoencasCid.js`
  - concentra carregamento, selecao, filtros e operacoes CRUD;
  - deve existir apenas se a complexidade justificar extracao;
  - pode ser omitido se a tela permanecer simples.

- `doencasCidApi.js`
  - encapsula chamadas para `/cid`;
  - existe para evitar chamada espalhada pela pagina.

- `doencasCidMappers.js`
  - normaliza payloads e respostas, se necessario;
  - existe apenas se houver transformacao real;
  - pode ser omitido caso a resposta do backend ja sirva diretamente.

- `doencasCid.css`
  - somente se for necessario complementar o shell compartilhado;
  - nao deve redefinir o layout base do sistema.

### Arquivos existentes a alterar futuramente

#### Arquivo comprovadamente necessario

- `frontend-react/src/app/App.jsx`

#### Arquivo possivelmente necessario

- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/features/doencasCid/*` quando o modulo for criado
- `docs/11_roadmap_desenvolvimento.md` apenas se o padrao vigente exigir o registro de contrato novo

#### Arquivo que nao deve ser alterado nesta primeira implementacao

- `backend/routes/cid_routes.py`
- `backend/models/doenca_cid.py`
- qualquer script de banco ligado ao modulo CID

## 18. Portoes de validacao futuros

### 18.1 Validacao React no navegador

Quando a implementacao existir, ela so pode ser considerada concluida depois de:

- login real;
- acesso pelo menu;
- rota ativa;
- listagem com dados reais;
- inclusao real controlada;
- alteracao real controlada;
- exclusao real controlada com registro de teste autorizado;
- mensagens;
- loading;
- selecao;
- duplo clique;
- responsividade;
- comparacao visual com modulos administrativos finalizados.

### 18.2 Comparacao com o legado autenticado

Quando houver sessao disponivel:

- abrir o CID no legado;
- comparar campos;
- comparar colunas;
- comparar acoes;
- comparar valores iniciais;
- comparar validacoes;
- comparar mensagens;
- registrar divergencias.

### 18.3 Banco e dependencias

Antes de alterar qualquer regra de exclusao ou backend:

- confirmar constraints;
- confirmar foreign keys;
- confirmar vinculos;
- confirmar duplicidades;
- confirmar escopo por clinica;
- confirmar exclusao fisica ou logica.

## 19. Itens proibidos nesta etapa

- componentes React;
- rota;
- habilitacao do menu;
- chamadas novas;
- alteracao de endpoint;
- alteracao de permissao;
- alteracao no backend;
- alteracao no model;
- consulta com escrita;
- migration;
- mock;
- dados fake;
- instalacao de dependencias;
- mudanca em outras frentes;
- commit;
- push.

## 20. Riscos

- a rota React ainda nao existe;
- o item do menu permanece desabilitado;
- a permissao backend pode exigir revisao futura de produto;
- o banco nao foi validado por SQL direto neste ambiente;
- a validacao visual autenticada do legado continua pendente;
- nao ha comprovacao de bloqueio de exclusao por dependencias reais;
- o legado atual aceita texto livre e nao uma regra estrita de formato CID;
- o endpoint atual nao usa paginação nem ordenacao interativa.

## 21. Ordem recomendada da implementacao

1. estrutura modular minima e API;
2. rota e item de menu;
3. pagina, toolbar e tabela somente leitura;
4. validacao da listagem no navegador;
5. modal de inclusao e alteracao;
6. validacao funcional;
7. exclusao e mensagens;
8. comparacao autenticada com o legado;
9. ajustes visuais;
10. documentacao de encerramento;
11. commit seletivo somente apos aprovacao do usuario.

## 22. Documento de roadmap

O roadmap nao foi alterado nesta etapa.

Justificativa:

- o documento `docs/11_roadmap_desenvolvimento.md` ja contem entradas historicas sobre CID;
- esta etapa produziu um contrato documental novo, mas nao iniciou implementacao;
- o padrao atual do roadmap nao exigiu nova anotacao para uma frente ainda nao implementada;
- para evitar misturar frentes e inflar o documento com duplicidade, o roadmap permaneceu inalterado.

## 23. Confirmacoes finais

- nenhuma implementacao React foi feita;
- nenhuma rota foi criada;
- nenhuma alteracao no menu foi aplicada;
- nenhuma alteracao no backend foi feita;
- nenhuma alteracao no banco foi feita;
- nenhuma instalacao de dependencia foi feita;
- nenhum commit foi feito;
- nenhum push foi feito.

## 24. Proxima etapa recomendada

A proxima etapa objetiva deve ser a leitura e execucao guiada do contrato para implementar, em ordem pequena, a estrutura modular minima do CID no React, sem alterar backend ou banco nesta primeira passagem.
