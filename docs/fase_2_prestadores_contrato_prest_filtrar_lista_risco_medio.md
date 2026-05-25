# Fase 2 - Prestadores - Contrato detalhado de prestFiltrarLista como recorte de risco medio controlado

## Objetivo

Definir o contrato detalhado de `prestFiltrarLista` como candidato a primeiro recorte de risco medio controlado, sem implementar nada nesta etapa, sem alterar codigo e sem ampliar o escopo para DOM, requestJson, payload, salvamento ou permissões.

## Contexto

A Fase 2 entrou em transicao formal para recortes de risco medio controlado depois de esgotar a fase de helpers pequenos, puros ou quase puros. As frentes recentes confirmaram esse limite:

- `Agenda de contatos` segue pausada/consolidada.
- `Agenda principal` segue pausada temporariamente.
- `Preferencias / Configuracoes comuns` segue pausada/consolidada.
- `Prestadores` segue pausada/consolidada como frente de helpers pequenos.

Na selecao documental anterior, `Prestadores / prestFiltrarLista` foi o candidato mais plausivel para o primeiro recorte medio controlado. Esta etapa apenas detalha o contrato futuro, para evitar uma implementacao precoce e preservar o padrao conservador.

## Contrato atual observado

O bloco atual em `frontend/app.js` ainda possui a implementacao local:

```js
function prestFiltrarLista(){
  const esp=String(prestCfg?.cboEspecialidade?.value||"").trim();
  const nome=(prestCfg?.txtNome?.value||"").trim().toLowerCase();
  return prestadoresCache.filter(item=>{
    const okEsp=!esp||esp==="__todas__"||String(item.especialidade||"").trim()===esp;
    const alvo=`${String(item.nome||"")} ${String(item.fone1||"")} ${String(item.fone2||"")}`.toLowerCase();
    const okNome=!nome||alvo.includes(nome);
    return okEsp&&okNome
  })
}
```

Contrato atualmente observado:

- assinatura sem parametros;
- leitura direta de `prestCfg`;
- leitura direta de `prestadoresCache`;
- leitura de filtro por especialidade e nome;
- normalizacao interna com `trim()` e `toLowerCase()`;
- retorno de uma lista filtrada;
- chamada a partir de `prestRender()`;
- sem DOM direto dentro da filtragem, mas com dependencia indireta de estado de tela via `prestCfg`.

## Separacao conceitual

Para virar recorte medio controlado, a responsabilidade precisa ficar dividida assim:

1. Filtragem pura: recebe lista e filtros, devolve lista filtrada.
2. Leitura de estado/filtros: fica no `frontend/app.js`.
3. Renderizacao: continua em `prestRender()`.
4. Atualizacao visual: continua fora do helper, sem acoplamento novo.

Isso evita que a filtragem carregue DOM, evento, selecao ou atualizacao de grade.

## Contrato futuro recomendado

Contrato recomendado para implementacao futura:

```js
prestFiltrarLista(lista, filtros)
```

Onde:

- `lista` e a lista/cache recebida por parametro;
- `filtros` e um objeto simples com os campos necessarios, por exemplo `especialidade` e `nome`;
- a funcao nao le DOM;
- a funcao nao le `prestCfg` diretamente;
- a funcao nao chama `prestRender`;
- a funcao nao altera selecao visual;
- a funcao nao salva, nao exclui e nao usa `requestJson`;
- a funcao apenas retorna a lista filtrada.

Para preservar o comportamento atual:

- o tratamento de especialidade continua respeitando `__todas__`;
- o filtro de nome continua usando normalizacao equivalente a `trim()` e `toLowerCase()`;
- a combinacao por nome continua considerando nome e telefones, como hoje;
- qualquer texto visivel existente permanece inalterado.

## Dependencias

Dependencias atuais observadas:

- `prestCfg` para ler os campos de filtro;
- `prestadoresCache` para obter a lista base;
- `prestRender()` como caller atual;
- `prestSelecionado` apenas como contexto do modulo Prestadores, nao como dependencia direta da filtragem.

Dependencias que nao devem existir no helper futuro:

- DOM;
- `window`/`document`;
- `requestJson`;
- payload;
- salvamento;
- exclusao;
- permissões;
- tenant/clinica/user_id.

## Riscos

Riscos identificados para a futura implementacao:

- alterar o resultado da filtragem;
- mexer em acentos, caixa ou normalizacao e mudar correspondencias;
- afetar contagem e listagem exibidas;
- acoplar filtragem a `prestRender`;
- misturar leitura de DOM com regra de negocio;
- alterar texto visivel ou mensagens de interface;
- introduzir regressao no filtro por especialidade ou nome.

O risco ainda e controlado porque a superficie continua pequena, a unica responsabilidade e clara e o teste manual futuro pode ser simples.

## Recomendacao

Recomendacao desta etapa: **A**.

`Prestadores / prestFiltrarLista` deve ser tratado como primeiro recorte medio controlado, **mas apenas com contrato detalhado e implementacao futura separada**.

Por que essa recomendacao e segura:

- e o bloco mais proximo de uma fronteira medio controlada;
- nao exige backend, banco, permissao ou salvamento;
- o ganho no `frontend/app.js` e real, porque remove leitura direta de filtros da funcao local;
- o teste futuro e simples em `Cadastro > Prestadores`, aplicando filtros e conferindo a lista;
- a funcao pode continuar pequena, auditavel e sem DOM.

## Escopo de eventual implementacao futura

Se a equipe decidir implementar depois, o escopo minimo esperado e:

- expor `prestFiltrarLista(lista, filtros)` em `frontend/js/modules/prestadores.js`;
- manter o modulo passivo;
- manter `frontend/app.js` como local de leitura de filtros e fallback;
- manter `prestRender`, `prestSelecionarLinha`, `prestCarregar`, `prestEnsureUI` e `prestAbrir` sem ampliacao de escopo;
- alterar apenas o necessario para o app passar lista e filtros explicitamente.

Arquivos provaveis para uma implementacao futura:

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/11_roadmap_desenvolvimento.md`
- um documento de implementacao e outro de validacao pos-teste

Arquivos que nao devem ser alterados nessa futura implementacao sem nova aprovacao:

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissões
- `package.json`
- arquivos de configuracao

## O que continua proibido

- nao mexer em salvamento;
- nao mexer em `requestJson`;
- nao mexer em payload;
- nao mexer em senha administrativa;
- nao mexer em `tenant/clinica/user_id`;
- nao mexer em DOM/renderizacao/selecao visual nesta etapa;
- nao mexer em `prestRender`, `prestSelecionarLinha`, `prestCarregar`, `prestEnsureUI` e `prestAbrir` em codigo nesta etapa;
- nao iniciar trabalho pesado amplo;
- nao corrigir textos visiveis ou mojibake;
- nao implementar `prestFiltrarLista` agora.

## Proxima subetapa recomendada

`Prestadores - Implementacao minima de prestFiltrarLista com contrato explicito lista/filtros`

Essa proxima subetapa so deve acontecer depois de nova confirmacao documental, se a equipe mantiver a escolha.

## Registro de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada nesta etapa. Se existir texto quebrado ou legado em docs ou no codigo, ele permanece apenas como pendencia futura documental, sem correção nesta rodada.
