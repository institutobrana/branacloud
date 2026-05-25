# Fase 2 - Preferencias / Configuracoes comuns - Contrato detalhado de `prefAmbienteSecoesAtuais` como recorte medio controlado

## Objetivo

Definir o contrato detalhado de `prefAmbienteSecoesAtuais` como possivel recorte medio controlado, sem implementar nada, para separar de forma segura o merge de estado das secoes de Ambiente da leitura de contexto, do DOM e do preview.

## Contexto

A frente `Preferencias / Configuracoes comuns` foi retomada apenas em modo documental apos a validacao do primeiro recorte medio controlado em `Prestadores`.

O modulo passivo atual e:

- `frontend/js/modules/preferencias-opcoes-sistema.js`

Namespace exposto:

- `window.BranaPreferenciasOpcoesSistemaModule`

Helpers ja extraidos e validados nesta frente:

- `prefAmbEstiloPadrao`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`

## Contrato atual observado

### `prefAmbienteSecoesAtuais()`

Estado atual observado em `frontend/app.js`:

- assinatura sem parametros;
- retorna um objeto de secoes mescladas;
- cria a base a partir de `prefValoresPadraoAmbiente().secoes`;
- le o estado atual a partir de `prefCfg?.ambienteValues?.secoes || {}`;
- faz merge por chave de secao;
- nao acessa `requestJson`;
- nao monta payload;
- nao salva;
- nao mexe em permissao;
- nao fala com backend, banco, schema, migrations ou seeds;
- nao altera texto visivel por si so;
- nao altera abas por si so;
- nao altera preview por si so;
- e consumida por rotinas que depois atualizam preview, dialogo e UI da aba Ambiente.

## Separacao conceitual

### Estado base

O estado base e a origem padrao das secoes de Ambiente, hoje derivada de `prefValoresPadraoAmbiente().secoes`.

### Estado atual

O estado atual e lido de `prefCfg?.ambienteValues?.secoes`, que representa o que foi carregado ou mantido na sessao da tela.

### Merge/fusao

A funcao atual faz a fusao entre base e atual, preservando valores atuais quando existem e completando com o padrao quando faltam.

### DOM e preview

A funcao em si nao deveria lidar com DOM nem preview. O DOM e o preview sao efeitos posteriores executados pelas rotinas que usam o resultado do merge.

### Salvamento

A funcao nao deve participar de salvamento. O salvamento pertence aos fluxos `prefColetarPayload*` e `prefSalvar*`.

## Contrato futuro recomendado

Recomenda-se que a proxima implementacao futura, se aprovada, use contrato explicito:

```js
prefAmbienteSecoesAtuais(baseSecoes, atuais)
```

Onde:

- `baseSecoes` e recebido por parametro;
- `atuais` e recebido por parametro;
- a funcao retorna somente a estrutura mesclada;
- nao le `DOM`;
- nao le `window` nem `document`;
- nao le `requestJson`;
- nao monta payload;
- nao salva;
- nao altera preview;
- nao altera abas;
- nao altera texto visivel;
- nao depende diretamente de `tenant`, `clinica` ou `user_id`;
- nao chama renderizacao;
- nao chama `prefAplicarPreviewAmbiente`;
- nao chama `prefRebuildAmbientePreview`.

## Dependencias

Dependencias hoje observadas:

- `prefValoresPadraoAmbiente`
- `prefCfg`
- fluxo de Ambiente em `frontend/app.js`
- helpers de preview e selecao de contexto que consomem o resultado do merge

Dependencias que devem permanecer fora do helper futuro:

- `DOM`
- `requestJson`
- payload
- salvamento
- permissao
- backend
- banco
- schema
- migrations
- seeds

## Riscos

Riscos remanescentes identificados:

- mudar valores padrao de Ambiente;
- alterar preview da aba Ambiente;
- afetar troca de secao;
- afetar o dialogo de fonte;
- alterar abas;
- afetar o carregamento visual;
- alterar dados salvos de forma indireta;
- criar acoplamento com helpers ja extraidos;
- misturar estado com DOM;
- corrigir acidentalmente textos ou mojibake.

## Recomendacao

Recomenda-se a opcao **A**:

- seguir com a implementacao futura de `prefAmbienteSecoesAtuais` como recorte medio controlado;
- manter contrato explicito `baseSecoes/atuais`;
- preservar fallback local equivalente em `frontend/app.js`;
- manter a parte visual e os fluxos de preview/aba fora do helper;
- manter o modulo passivo.

Essa recomendacao e segura porque:

- a fronteira e clara;
- o ganho real e a separacao do merge de estado do restante da UI;
- o teste futuro e simples;
- nao exige backend, banco, permissao ou payload;
- nao e trabalho pesado amplo.

## Escopo de eventual implementacao futura

Se aprovada em etapa futura, a implementacao deve:

- expor `prefAmbienteSecoesAtuais(baseSecoes, atuais)` no modulo passivo;
- manter `frontend/app.js` como responsavel por ler o estado atual;
- manter `frontend/app.js` como responsavel por montar `baseSecoes` e `atuais`;
- manter fallback local equivalente no `frontend/app.js`;
- nao mexer em `prefRenderCombos`, `prefSincronizarUI`, `prefEnsureUI`, `prefCarregarDados` ou `prefSalvar*`;
- nao mexer em preview, abas ou dialogo de fonte.

Arquivos que provavelmente seriam alterados numa implementacao futura:

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/11_roadmap_desenvolvimento.md`
- documento de implementacao da subetapa
- documento de validacao pos-teste da subetapa

Arquivos que nao devem ser alterados nessa etapa futura:

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissoes
- `package.json`
- arquivos de configuracao

## Proibicoes permanentes nesta linha de trabalho

- nao mexer em salvamento;
- nao mexer em `requestJson`;
- nao mexer em payload;
- nao mexer em senha administrativa;
- nao mexer em `tenant/clinica/user_id`;
- nao mexer em DOM/renderizacao/selecao visual;
- nao mexer em abas;
- nao mexer em preview;
- nao mexer em dialogo de fonte;
- nao implementar multiarea;
- nao reabrir `Agenda de contatos`;
- nao continuar `Agenda principal` em codigo;
- nao continuar `Prestadores` em codigo;
- nao implementar qualquer recorte medio nesta etapa;
- nao iniciar trabalho pesado amplo;
- nao corrigir textos visiveis;
- nao corrigir acentos;
- nao corrigir labels;
- nao corrigir placeholders;
- nao corrigir mensagens de interface;
- nao corrigir mojibake.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Implementacao minima de prefAmbienteSecoesAtuais com contrato explicito baseSecoes/atuais`

## Registro de blindagem textual/mojibake

Esta etapa e exclusivamente documental. Qualquer texto quebrado, erro textual ou mojibake legado deve permanecer apenas como pendencia futura, sem correcao nesta linha de trabalho.
