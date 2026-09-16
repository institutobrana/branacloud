# Contrato de implementacao - Unidades de atendimento - frontend React

## 1. Escopo

Implementar a tela Unidades de atendimento no novo frontend React do Brana Cloude.

Escopo:

- pagina React dedicada;
- shell em L;
- toolbar;
- tabela com cinco colunas iniciais;
- modal de cadastro completo;
- confirmacao de exclusao;
- consumo da API existente;
- estados de loading, vazio e erro;
- divisao modular por feature.

Fora de escopo:

- alterar backend;
- alterar frontend legado;
- alterar banco;
- criar endpoints novos;
- criar migrations;
- modernizar regras sem contrato;
- inventar filtros/pesquisa/impressao sem evidencia.

## 2. Rota e menu

- menu: `Configuracoes -> Unidades de atendimento`
- rota sugerida: `/app/configuracoes/unidades-atendimento`
- identificador: `unidades-atendimento`

Regras:

- item em ordem alfabetica dentro de Configuracoes;
- abrir como pagina interna do shell;
- titulo da pagina: `Unidades de atendimento`.

## 3. Shell em L

Contrato visual obrigatorio:

- barra lateral e barra horizontal formando um L continuo;
- sem recuo visual;
- sem emenda, linha ou sombra entre as barras;
- usar o shell global existente;
- nao criar CSS local para reproduzir o L;
- compatibilidade com tema claro e escuro.

## 4. Toolbar

Acoes iniciais:

- `Nova unidade...`
- `Altera...`
- `Elimina`

Comportamento:

- `Nova unidade...` abre modal vazio;
- `Altera...` exige selecao;
- `Elimina` exige selecao e confirmacao;
- sem selecao, mostrar mensagem objetiva;
- `Fecha` pode ficar fora da toolbar inicial se o shell ja fechar a pagina.

Nao adicionar:

- imprimir;
- pesquisa paralela;
- filtro global paralelo;
- acoes por analogia.

## 5. Tabela

Colunas iniciais:

1. `Codigo`
2. `Nome da unidade`
3. `Telefone 1`
4. `Telefone 2`
5. `Status`

| Coluna | Campo da API | Tipo | Alinhamento | Largura sugerida | Ordenacao | Filtro | Formatacao | Ocultar | Observacao |
| ------ | ------------ | ---- | ----------- | ---------------- | --------- | ------ | ---------- | ------- | ---------- |
| Codigo | `codigo` | texto | centro | estreita | sim | nao nesta fase | zero a esquerda se vier numerico | sim, futuro | manter regra do backend |
| Nome da unidade | `nome` | texto | esquerda | flexivel | sim | nao nesta fase | trim | sim, futuro | principal |
| Telefone 1 | `fone1` | texto | esquerda | media | nao definida | nao nesta fase | texto livre | sim, futuro | sem mascara inventada |
| Telefone 2 | `fone2` | texto | esquerda | media | nao definida | nao nesta fase | texto livre | sim, futuro | sem mascara inventada |
| Status | `ativo` derivado de `inativo` | booleano/texto | centro | estreita | sim | nao nesta fase | ativo/inativo ou simbolo | sim, futuro | simples e legivel |

Estados:

- carregando;
- vazio;
- erro;
- carregado com selecao;
- carregado sem selecao.

## 6. Modal de cadastro

### Campos

| Campo | Componente sugerido | Obrigatorio | Validacao | Fonte da regra | Persistencia |
| ----- | ------------------- | ----------: | --------- | -------------- | ------------ |
| codigo | input texto | nao | maximo 20 caracteres | backend/model | `codigo` |
| nome | input texto | sim | nao vazio | backend/route | `nome` |
| logradouro_tipo | select | nao | opcional | legado/backend | `logradouro_tipo` |
| endereco | input texto | nao | maximo 180 | legado/backend | `endereco` |
| numero | input texto | nao | maximo 30 | legado/backend | `numero` |
| complemento | input texto | nao | maximo 120 | legado/backend | `complemento` |
| bairro | select ou input | nao | opcional | legado/backend | `bairro` |
| cidade | select ou input | nao | opcional | legado/backend | `cidade` |
| cep | input texto | nao | maximo 20 | legado/backend | `cep` |
| uf | select | nao | lista de UFs | legado/frontend | `uf` |
| fone1_tipo | select | nao | opcional | auxiliares | `fone1_tipo` |
| fone1 | input texto | nao | opcional | legado/backend | `fone1` |
| contato1 | input texto | nao | opcional | legado/backend | `contato1` |
| fone2_tipo | select | nao | opcional | auxiliares | `fone2_tipo` |
| fone2 | input texto | nao | opcional | legado/backend | `fone2` |
| contato2 | input texto | nao | opcional | legado/backend | `contato2` |
| fone3_tipo | select | nao | opcional | auxiliares | `fone3_tipo` |
| fone3 | input texto | nao | opcional | legado/backend | `fone3` |
| contato3 | input texto | nao | opcional | legado/backend | `contato3` |
| fone4_tipo | select | nao | opcional | auxiliares | `fone4_tipo` |
| fone4 | input texto | nao | opcional | legado/backend | `fone4` |
| contato4 | input texto | nao | opcional | legado/backend | `contato4` |
| ativo | checkbox | nao | booleano | backend/model | `inativo` invertido |
| inclusao | input texto curto | nao | `dd/mm/aaaa` | backend/route | `data_inclusao` |
| alteracao | input texto curto | nao | `dd/mm/aaaa` | backend/route | `data_alteracao` |

### Imutaveis/tecnicos

- `id` nao entra no modal;
- `clinica_id` nao pode vir do frontend;
- `source_id` deve ser tecnico;
- `qtd_sala` pode ficar oculto se nao houver uso funcional;
- `criado_em` e `atualizado_em` nao entram no modal.

### Inclusao

- exigir somente `nome`;
- usar `GET /cadastros/unidades-atendimento/proximo-codigo` como sugestao;
- salvar na clinica logada;
- recarregar a lista apos salvar.

### Alteracao

- carregar somente a unidade selecionada;
- preservar `id`, `clinica_id` e dados tecnicos;
- salvar e recarregar;
- manter selecao coerente.

### Status

- checkbox de inativacao no modal;
- persistencia booleana em `inativo`;
- grade com exibição sintetica.

### Telefones

- preservar os quatro blocos do legado;
- nao criar mascara obrigatoria sem decisao futura;
- manter select de tipo e campos de numero/contato;
- atalho de WhatsApp apenas se existir suporte compartilhado.

### Unidade principal

- novas contas ja nascem com `Principal / 0001` pelo backend atual;
- o React deve exibir isso sem duplicar a regra;
- a protecao contra exclusao da unidade unica precisa de decisao futura.

## 7. API

Endpoints existentes:

| Metodo | Endpoint | Uso |
| ------ | -------- | --- |
| GET | `/cadastros/unidades-atendimento` | listar unidades |
| GET | `/cadastros/unidades-atendimento/combos` | combos para outros modulos |
| GET | `/cadastros/unidades-atendimento/proximo-codigo` | sugerir codigo |
| POST | `/cadastros/unidades-atendimento` | criar |
| PUT | `/cadastros/unidades-atendimento/{row_id}` | alterar |
| DELETE | `/cadastros/unidades-atendimento/{row_id}` | excluir |

Regras:

- sempre autenticar;
- sempre enviar `Authorization: Bearer <token>`;
- nunca confiar em `clinica_id` do frontend;
- recarregar a lista apos qualquer mutacao;
- priorizar a mensagem da API.

## 8. Estados e erros

Estados obrigatorios:

- loading;
- vazio;
- erro;
- selecao unica;
- modal de inclusao;
- modal de alteracao;
- confirmacao de exclusao;
- cancelamento;
- pos-salvar;
- pos-excluir.

Mensagens:

- `Selecione uma unidade.`
- `Informe o nome da unidade.`
- `Falha ao carregar unidades de atendimento.`
- `Falha ao salvar unidade.`
- `Falha ao eliminar unidade.`

## 9. Arquitetura modular

```text
frontend-react/src/features/unidadesAtendimento/
├── UnidadesAtendimentoPage.jsx
├── components/
│   ├── UnidadesAtendimentoToolbar.jsx
│   ├── UnidadesAtendimentoTable.jsx
│   ├── UnidadeAtendimentoModal.jsx
│   └── UnidadeAtendimentoDeleteDialog.jsx
├── hooks/
│   ├── useUnidadesAtendimento.js
│   └── useUnidadeAtendimentoForm.js
├── services/
│   └── unidadesAtendimentoApi.js
├── utils/
│   ├── unidadeAtendimentoMappers.js
│   └── unidadeAtendimentoValidation.js
└── constants/
    └── unidadeAtendimentoColumns.js
```

## 10. Critérios de aceite

- menu e rota corretos;
- shell em L correto;
- cinco colunas corretas;
- modal completo;
- CRUD autenticado;
- tenant correto;
- confirmacao de exclusao;
- recarga apos salvar/excluir;
- testes basicos definidos.

## 11. Pendencias que exigem decisao

- a unica unidade pode ser excluida?
- a unidade `Principal / 0001` deve ser protegida?
- `Fecha` entra ou nao na toolbar inicial?
- telefone precisa de mascara agora?
- `qtd_sala` fica visivel ou tecnico?

## 12. Fora de escopo

- backend novo;
- migration nova;
- frontend legado;
- reescrita de regras de negocio;
- impressao/pesquisa/filtro sem contrato.
