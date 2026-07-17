# Contrato de implementacao - Prestadores no frontend React

## Escopo

Implementar a nova frente React de `Prestadores` acessada por `Cadastro -> Corpo clinico`, sem mexer agora no backend, banco, endpoints, payload ou frontend legado.

## Fronteira funcional confirmada

O modulo principal deve conter:

- listagem com 5 colunas: `Codigo`, `Nome`, `Fone 1`, `Fone 2`, `Status`
- barra superior com:
  - `Novo prestador`
  - `Altera`
  - `Elimina`
  - `Agenda`
  - `Convênios`
  - `Comissões`
- filtro por `Especialidade`
- busca por `Nome` ou `Codigo`

## Regras confirmadas

- O combo de especialidade deve carregar especialidades reais do sistema.
- A busca deve repetir o comportamento real do legado e do backend, sem inventar regras novas.
- O status deve refletir o ativo/inativo real do registro.
- O front nao deve confiar em `clinica_id` vindo da UI.
- Agenda, Convênios e Comissões nao devem nascer como um bloco monolitico do CRUD principal.

## Estrutura modular proposta

Proposta inicial de separacao, sujeita ao contrato final da auditoria:

- `frontend-react/src/features/prestadores/PrestadoresPage.jsx`
- `frontend-react/src/features/prestadores/PrestadoresToolbar.jsx`
- `frontend-react/src/features/prestadores/PrestadoresTable.jsx`
- `frontend-react/src/features/prestadores/PrestadorFormModal.jsx`
- `frontend-react/src/features/prestadores/PrestadorFormPrincipal.jsx`
- `frontend-react/src/features/prestadores/PrestadorEspecialidadesSection.jsx`
- `frontend-react/src/features/prestadores/PrestadorAgendaModal.jsx`
- `frontend-react/src/features/prestadores/PrestadorConveniosModal.jsx`
- `frontend-react/src/features/prestadores/PrestadorComissoesModal.jsx`
- `frontend-react/src/features/prestadores/prestadoresApi.js`
- `frontend-react/src/features/prestadores/prestadoresAdapters.js`
- `frontend-react/src/features/prestadores/prestadoresRules.js`
- `frontend-react/src/features/prestadores/prestadoresColumns.js`
- `frontend-react/src/features/prestadores/usePrestadores.js`
- `frontend-react/src/features/prestadores/usePrestadorForm.js`

## Responsabilidades

### `PrestadoresPage`

- orquestra lista, selecao, filtros e abertura de modais.

### `PrestadoresToolbar`

- concentra a barra de acoes e os eventos dos seis comandos.

### `PrestadoresTable`

- exibe a lista compacta, linhas selecionaveis e status.

### `PrestadorFormModal`

- encapsula criacao e alteracao sem duplicar UI entre novo e editar.

### `PrestadorFormPrincipal`

- concentra dados principais do prestador.

### `PrestadorEspecialidadesSection`

- trata a selecao de especialidades e sua persistencia.

### `PrestadorAgendaModal`

- isola o fluxo de agenda.

### `PrestadorConveniosModal`

- isola credenciamentos/vinculos com convenios.

### `PrestadorComissoesModal`

- isola regras de comissao e repasse.

### `prestadoresApi`

- centraliza chamadas HTTP.

### `prestadoresAdapters`

- adapta payload entre backend e UI.

### `prestadoresRules`

- concentra regras puras de filtro, validacao e habilitacao.

### `prestadoresColumns`

- define a configuracao das colunas da tabela.

### `usePrestadores`

- controla carregamento, selecao, filtros e refresh pos-CRUD.

### `usePrestadorForm`

- controla o estado do modal de inclusao/alteracao.

## Estado local versus compartilhado

Estado local:

- campos do modal;
- tabs internas;
- abas de Agenda, Convênios e Comissões;
- loading e erro do bloco especifico.

Estado compartilhado:

- lista carregada;
- prestador selecionado;
- filtro de especialidade;
- filtro de busca;
- refresh apos CRUD.

## Fronteira UI versus regra de negocio

- UI monta shell, tabela, modal e botoes.
- Regras puras validam:
  - existencia de selecao;
  - habilitacao dos comandos;
  - normalizacao de texto;
  - aplicacao de filtro e busca;
  - payload adaptado.
- HTTP deve ficar fora dos componentes de apresentacao.

## Atualizacao pos-CRUD

Depois de incluir, alterar ou excluir:

- recarregar a lista;
- preservar ou recalcular a selecao com seguranca;
- atualizar os contadores;
- evitar duplicidade de estado entre modal e tabela.

## Agenda, Convênios e Comissões

Decisao recomendada:

- nao entregar como simples botoes mudos;
- nao fundir no formulario principal;
- abrir cada fluxo em modal, drawer ou pagina propria conforme a auditoria confirmar o comportamento real;
- manter cada fluxo com contrato e testes separados.

## Contrato de testes

Antes de considerar a frente madura:

- testes de regras puras;
- testes dos adaptadores;
- testes do servico HTTP;
- testes de renderizacao;
- testes de selecao;
- testes de filtros;
- testes da busca;
- testes de habilitacao dos botoes;
- testes de modal;
- testes de payload;
- testes de erros;
- testes de exclusao protegida;
- testes dos fluxos Agenda, Convênios e Comissões;
- teste de integracao da rota;
- teste de navegador;
- build do frontend.

## Critérios de aceite

- a listagem exibe apenas os cinco campos definidos;
- a busca funciona por nome e codigo;
- o filtro de especialidade usa valores reais;
- os seis comandos abrem o caminho correto;
- o modal nao duplica regras entre novo e editar;
- Agenda, Convênios e Comissões nao ficam acoplados ao CRUD principal;
- nao ha dependencia de `clinica_id` vindo do frontend;
- nao ha componente monolitico.

## Riscos

- misturar comportamento do legado com regras novas sem evidência;
- acoplar Agenda, Convênios e Comissões ao cadastro principal;
- inventar payload antes de fechar o contrato;
- duplicar logica entre novo e editar;
- quebrar o refresh apos CRUD.

## Fora de escopo desta etapa

- qualquer JSX funcional;
- qualquer CSS funcional;
- qualquer rota nova;
- qualquer mudanca no backend;
- qualquer migracao;
- qualquer mudanca de payload;
- qualquer alteracao no frontend legado;
- qualquer alteracao no EasyDental Desktop.
