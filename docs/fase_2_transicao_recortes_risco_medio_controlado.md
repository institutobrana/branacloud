# Fase 2 - Transicao documental para recortes de risco medio controlado

## Objetivo
Definir como a modularizacao conservadora deve sair da fase de helpers pequenos e passar, de forma controlada e documentada, para recortes de risco medio sem abandonar os limites de seguranca ja validos.

## Contexto
A fase de helpers pequenos mostrou bom resultado em varias frentes, com extracoes minimas, namespaces passivos e wrappers locais preservados.

O padrao funcionou bem, mas ja chegou ao limite nas frentes recentes:
- `Agenda principal`
- `Preferencias / Configuracoes comuns`
- `Prestadores`
- `Agenda de contatos` permanece pausada/consolidada e nao entra nesta transicao

## Frentes pausadas ou consolidadas
- `Agenda de contatos`: pausada/consolidada
- `Agenda principal`: pausada temporariamente
- `Preferencias / Configuracoes comuns`: pausada/consolidada
- `Prestadores`: pausada/consolidada

## Limite da fase de helpers pequenos
Os recortes pequenos e mais seguros ja foram aproveitados nas frentes recentes:
- helpers puros
- helpers quase puros
- wrappers simples com fallback local
- validacao manual clara
- namespace passivo ja existente

Os candidatos restantes agora tendem a envolver:
- DOM
- renderizacao
- selecao visual
- requestJson
- payload
- eventos
- estado global
- orquestracao de fluxo

Isso significa que insistir apenas em helpers puros tende a trazer baixo ganho adicional no `frontend/app.js`.

## Definicao de recorte de risco medio controlado
Um recorte de risco medio controlado e uma extracacao futura que ainda e conservadora, mas que aceita um nivel maior de acoplamento do que a fase de helpers pequenos.

Ele deve manter, no minimo:
- fronteira clara;
- uma unica responsabilidade por subetapa;
- teste manual simples e objetivo;
- ganho real na reducao do `frontend/app.js`;
- ausencia de alteracao simultanea em backend, banco ou permissões;
- ausencia de correcao textual/mojibake junto com a refatoracao;
- escopo pequeno o suficiente para auditoria;
- fallback ou rollback mental claro;
- checks obrigatorios quando houver codigo;
- validacao documental pos-teste.

## Criterios de aceitacao para um recorte medio
Um candidato medio so deve ser aceito se:
- nao misturar salvamento com renderizacao;
- nao misturar `requestJson` com DOM na primeira etapa;
- nao alterar payload e UI ao mesmo tempo;
- nao mexer em permissões;
- nao mexer em migrations, seeds ou schema;
- nao corrigir textos visiveis;
- tiver caminho de teste claro;
- tiver arquivos permitidos explicitamente;
- tiver arquivos proibidos explicitamente;
- permitir wrapper local equivalente em `frontend/app.js`.

## Niveis de risco para a nova fase
- **Baixo**: helpers puros restantes, se existirem.
- **Medio controlado**: filtragem, normalizacao, montagem de modelo, pequenas renderizacoes isoladas, wrappers sem backend.
- **Medio-alto**: DOM/renderizacao maior, selecao visual, eventos.
- **Alto**: `requestJson`, salvamento, exclusao, payload, permissões, endpoints, banco.

## Proibições permanentes
Continuam proibidos, nesta transicao e nas proximas extracoes da mesma rodada:
- backend, banco, schema, migrations, seeds;
- permissões;
- `requestJson` misturado com payload ou salvamento sem contrato especifico;
- qualquer correção textual/mojibake;
- alteracao simultanea de UI e dados sensiveis;
- implementacao de multiárea;
- reabertura de `Agenda de contatos`;
- continuidade de `Agenda principal` nesta rodada;
- continuidade de `Preferencias / Configuracoes comuns` nesta rodada;
- continuidade de `Prestadores` nesta rodada;
- alteracao de `frontend/index.html` nesta etapa.

## Matriz de decisao
| Frente / bloco | Tipo | Dependencias | Arquivos afetados | DOM | requestJson | payload | salvamento | Impacto visual | Teste manual | Ganho estimado no `app.js` | Risco | Recomendacao |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Prestadores / `prestFiltrarLista` | Quase puro / filtragem de UI | `prestCfg`, `prestadoresCache` | `frontend/app.js`, possivelmente `frontend/js/modules/prestadores.js` | Sim, indireto | Nao | Nao | Nao | Medio | Simples, mas ligado a lista | Medio | Medio | Candidato medio controlado, mas nao imediato |
| Prestadores / `prestRender` | DOM/renderizacao | `prestadoresCache`, `prestadorSelId`, helpers extraidos | `frontend/app.js` | Sim | Nao | Nao | Nao | Alto | Precisa revisar grade inteira | Alto | Medio-alto | Nao recomendado agora |
| Prestadores / `prestSelecionarLinha` | Evento / selecao visual | `prestadorSelId`, DOM | `frontend/app.js` | Sim | Nao | Nao | Nao | Alto | Simples, mas visual | Baixo-medio | Medio-alto | Nao recomendado agora |
| Prestadores / `prestCarregar` | Integracao / carga | `requestJson`, `sessaoAtual`, cache | `frontend/app.js` | Indireto | Sim | Sim, indiretamente | Nao direto | Medio-alto | Exige lista real | Alto | Alto | Nao recomendado agora |
| Prestadores / `prestAcoesPlaceholder` | Feedback textual / fluxo | `prestSelecionado`, `footerMsg` | `frontend/app.js` | Sim | Nao | Nao | Nao | Medio | Simples | Baixo | Medio-alto | Nao recomendado agora |
| Prestadores / `prestEnsureUI` | DOM / orquestracao | `document`, `prestCfg` | `frontend/app.js` | Sim | Nao | Nao | Nao | Alto | Requer montar UI | Alto | Alto | Nao recomendado agora |
| Prestadores / `prestAbrir` | Fluxo visual / abertura | `prestEnsureUI`, `prestCarregar` | `frontend/app.js` | Sim | Sim, via carga | Nao direto | Nao | Alto | Teste de tela completo | Alto | Alto | Nao recomendado agora |
| `Agenda principal` / proximos helpers sensiveis | Fluxo legado / agenda | Muitos estados, modulos legados | `frontend/app.js` e auxiliares | Sim | Sim em partes | Sim em partes | Sim em partes | Alto | Complexo | Alto | Medio-alto/alto | Seguir pausada nesta rodada |
| `Preferencias / Configuracoes comuns` / remanescentes | UI por abas / contexto | `prefCfg`, abas, helpers ja extraidos | `frontend/app.js`, modulo passivo | Sim | Sim em partes | Sim em partes | Nao direto | Medio-alto | Teste por abas | Medio | Medio-alto/alto | Pausada nesta rodada |
| `Ficha pessoal` | Bloco clinico grande | Muitos estados, combos e fluxo clinico | `frontend/app.js` | Sim | Sim em varias areas | Sim | Sim | Alto | Complexo | Alto | Alto | Nao recomendado agora |
| `Conta corrente` | Financeiro | `financeiro`, filtros, lancamentos | `frontend/app.js` | Sim | Sim | Sim | Sim | Alto | Precisa dados reais | Alto | Alto | Nao recomendado agora |
| `Indices financeiros` | Financeiro / cotacoes | Fluxo transacional | `frontend/app.js` | Sim | Sim | Sim | Sim | Alto | Precisa regra de negocio | Medio-alto | Alto | Nao recomendado agora |
| `Relatorios` | Exportacao / preview | Endpoints, export, impressao | `frontend/app.js` e auxiliares | Sim | Sim | Sim | Nao direto | Alto | Precisa saida fiel | Alto | Medio-alto/alto | Nao recomendado como primeira opcao |
| `Materiais` | Cadastro/uso transversal | Tabelas, combos, regras de apoio | `frontend/app.js` e modulos | Sim | Em partes | Em partes | Em partes | Medio-alto | Variavel | Medio-alto | Medio-alto | Reavaliar em comparacao futura |
| `Procedimentos genericos` | Cadastro grande | Editor, busca, vinculos | `frontend/app.js` | Sim | Sim em partes | Sim | Sim | Alto | Complexo | Alto | Alto | Nao recomendado agora |
| `Cadastros auxiliares ja modularizados` | Varios blocos ja parciais | Variavel | Varios modulos | Variavel | Variavel | Variavel | Variavel | Variavel | Variavel | Variavel | Variavel | Prioridade menor neste momento |
| `Convênios e Planos` | Cadastro/comercial | Planos, convenios, selecionadores | `frontend/app.js` e modulos | Sim | Em partes | Em partes | Em partes | Medio-alto | Precisa revisar vinculos | Medio-alto | Medio-alto | Reavaliar em etapa comparativa |

## Comparacao inicial
### Prestadores / `prestFiltrarLista`
E o primeiro candidato ainda com algum potencial de medio controlado, mas nao agora. Mesmo sendo mais simples que o restante do bloco, ja depende de `prestCfg` e do cache, e a sua extracao teria ganho util apenas se houvesse uma estrategia clara para separar filtro de renderizacao em uma subetapa posterior.

### Agenda principal / helpers restantes
Os remanescentes continuam mais sensiveis e nao sao a melhor entrada para esta transicao. Ja existe bastante modularizacao validada, mas o que sobra envolve fluxos misturados e maior risco operacional.

### Preferencias / Configuracoes comuns / remanescentes
Os remanescentes ja estao acima do patamar de helpers pequenos e tambem nao devem ser a primeira entrada para recortes medios nesta fase.

### Cadastros auxiliares ja modularizados
Ha vrios modulos, mas eles ja estao distribuídos e nao formam um unico hotspot imediato. Sao mais bons candidatos para comparacao futura do que para decisao imediata.

### Convênios e Planos, Relatorios, Ficha pessoal, Conta corrente, Indices financeiros, Materiais, Procedimentos genericos
Todos esses blocos ainda se comportam como frentes de maior risco comparativo. Alguns podem ter recortes medios, mas exigem nova etapa documental antes de qualquer implementacao.

## Resultado comparativo inicial
- Nao ha, nesta etapa, um bloco medio controlado que ja esteja maduro o suficiente para implementacao.
- `Prestadores / prestFiltrarLista` e o candidato mais proximo de um recorte medio controlado, mas ainda nao e decisao de implementacao.
- O melhor movimento agora e documentar a selecao do primeiro bloco medio controlado, com criterios mais claros, antes de codificar.

## Recomendacao de proxima etapa
**Fase 2 - Selecao documental do primeiro recorte de risco medio controlado**

Essa etapa futura deve:
- escolher o primeiro bloco medio com criterios objetivos;
- manter o protocolo conservador;
- definir arquivo(s) permitidos e proibidos;
- exigir teste manual claro;
- manter a blindagem textual/mojibake;
- nao alterar backend, banco, permissões, migrations ou seeds.

## Riscos remanescentes
- A variacao de risco entre blocos ainda e alta.
- Sem uma selecao documental previa, o recorte medio pode misturar UI, estado e integracao.
- A presenca de mojibake em trechos legados segue como pendencia documental, nao de correcao.

## Registro de blindagem textual/mojibake
Nesta transicao nenhuma string visivel foi corrigida. Qualquer texto quebrado ou mojibake existente permanece apenas como pendencia documental futura, sem ajuste nesta rodada.
