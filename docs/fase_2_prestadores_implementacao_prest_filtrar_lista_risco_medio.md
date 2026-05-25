# Fase 2 - Prestadores - Implementacao minima de prestFiltrarLista com contrato explicito lista/filtros

## Objetivo

Implementar de forma minima e controlada o helper `prestFiltrarLista(lista, filtros)` como primeiro recorte de risco medio controlado da frente Prestadores, preservando fallback local em `frontend/app.js` e sem ampliar o escopo para DOM, requestJson, payload, salvamento ou permissoes.

## Contexto de risco medio controlado

A Fase 2 chegou ao limite da estrategia de helpers pequenos em frentes recentes. A transicao para risco medio controlado ja havia sido formalizada documentalmente e o candidato escolhido foi `Prestadores / prestFiltrarLista`, desde que o contrato explicitasse entrada por lista e filtros.

## Contrato implementado

O contrato aplicado nesta etapa foi:

```js
prestFiltrarLista(lista, filtros)
```

Comportamento implementado:

- recebe `lista` por parametro;
- recebe `filtros` por parametro;
- nao le DOM;
- nao le `prestCfg` dentro do modulo;
- nao chama `prestRender`;
- nao altera selecao visual;
- nao salva, nao exclui e nao usa `requestJson`;
- retorna apenas a lista filtrada;
- preserva a logica atual de especialidade e nome/texto;
- preserva a normalizacao com `trim()` e `toLowerCase()`;
- preserva o tratamento de lista vazia, filtros vazios e itens incompletos.

## Arquivos alterados

- [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js)
- [frontend/js/modules/prestadores.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/prestadores.js)
- [docs/11_roadmap_desenvolvimento.md](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)
- [docs/fase_2_prestadores_implementacao_prest_filtrar_lista_risco_medio.md](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/fase_2_prestadores_implementacao_prest_filtrar_lista_risco_medio.md)

## Como lista/filtros foram explicitados

No modulo passivo, `prestFiltrarLista` passou a receber:

- `lista`: a lista base a ser filtrada;
- `filtros`: um objeto com os valores necessarios para especialidade e nome.

No `frontend/app.js`:

- a leitura de `prestCfg` continuou no app;
- a montagem do objeto `filtros` ficou no app;
- a funcao local passou a chamar `window.BranaPrestadoresModule.prestFiltrarLista(lista, filtros)` quando disponivel;
- o fallback local equivalente foi preservado.

## Como o fallback foi preservado

O `frontend/app.js` continua contendo a versao local equivalente da filtragem. Se o modulo passivo nao estiver disponivel ou falhar, a filtragem continua funcionando com a mesma regra observada antes da extraçao.

## O que nao foi alterado

- frontend/index.html;
- backend;
- banco;
- schema;
- migrations;
- seeds;
- endpoints;
- permissoes;
- package.json;
- arquivos de configuracao;
- salvamento;
- `requestJson`;
- payload;
- senha administrativa;
- `tenant/clinica/user_id`;
- DOM/renderizacao/selecao visual fora do contrato minimo;
- `prestSelecionarLinha`;
- `prestCarregar`;
- `prestEnsureUI`;
- `prestAbrir`;
- mensagens visiveis e textos legados;
- mojibake.

## Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/prestadores.js`

Resultado:

- ambos os checks passaram.

## Teste manual recomendado

Validar em `Cadastro > Prestadores`:

- abertura da tela;
- filtro por especialidade;
- filtro por nome;
- contagem da lista;
- preservacao da selecao visual;
- ausencia de regressao no console.

## Riscos remanescentes

- alterar o resultado da filtragem;
- mudar comportamento de caixa, acentos ou normalizacao;
- afetar a contagem ou a lista exibida;
- acoplar filtragem a renderizacao;
- misturar regra de negocio com leitura de DOM;
- introduzir regressao no filtro por especialidade ou nome.

## Pendencias futuras

- validar manualmente o recorte apos a implementacao;
- decidir se ha mais algum recorte medio controlado aceitavel na frente Prestadores;
- registrar eventual texto quebrado ou mojibake apenas como pendencia documental futura.

## Registro de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada nesta etapa. Nenhum texto visivel foi corrigido ou reescrito como parte desta implementacao.

## Proxima subetapa recomendada

`Prestadores - Validacao pos-teste de prestFiltrarLista como recorte de risco medio controlado`
