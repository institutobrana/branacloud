# Prestadores - Subetapa 0 - Retomada documental e estado atual

## Objetivo
Registrar a retomada documental do modulo Prestadores como um modulo parcial ja iniciado, para mapear o estado atual antes de qualquer nova decisao funcional.

## Escopo
- Confirmar que Prestadores nao e modulo novo.
- Reunir o historico documental ja existente.
- Revisar `frontend/js/modules/prestadores.js`, `frontend/app.js` e `frontend/index.html` em leitura.
- Classificar o que ja foi delegado, o que ainda vive no monolito e o que segue sensivel.
- Definir se existe algum caminho seguro para a proxima etapa ou se o modulo deve permanecer pausado.

## Arquivos inspecionados
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/prestadores_retomada_pos_varredura_parciais_estado_atual.md`
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_6_documental_prest_status_html.md`
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md`
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/prestadores.js`

## Checks iniciais
- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: havia apenas pendencias `??` preexistentes no worktree
- `git diff --stat`: vazio
- `git log --oneline -12`: topo com `49703c5 Recomenda proximo modulo apos Intervencoes`

## Base documental encontrada
| Documento | Papel aparente | Observacao |
|---|---|---|
| `docs/prestadores_subetapa_0_mapeamento_monolitico.md` | Mapeamento inicial | Confirma o bloco monolitico e os primeiros limites do modulo |
| `docs/prestadores_subetapa_1_namespace_passivo.md` | Namespace passivo | Registra a criacao do namespace `window.BranaPrestadoresModule` |
| `docs/prestadores_subetapa_2_fronteiras_contratos.md` | Fronteiras e contratos | Consolida fronteira entre `app.js` e namespace passivo |
| `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md` | Helper puro | Registra o helper puro `prestFmtCodigo` |
| `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md` | Integracao do helper | Mostra wrapper/fallback em `app.js` para `prestFmtCodigo` |
| `docs/prestadores_subetapa_5_encerramento_ciclo.md` | Encerramento parcial | Resume o mini ciclo anterior de Prestadores |
| `docs/prestadores_subetapa_6_documental_prest_status_html.md` | Analise documental de status | Mapeia `prestStatusHtml` como helper pequeno e puro na pratica |
| `docs/prestadores_subetapa_7_integracao_prest_status_html.md` | Integracao funcional minima | Registra a extracao literal de `prestStatusHtml` para o modulo passivo |
| `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md` | Reavaliacao pos helper | Pausa Prestadores por nao haver novo helper puro claro |
| `docs/prestadores_retomada_pos_varredura_parciais_estado_atual.md` | Retomada anterior do modulo | Reclassifica Prestadores como modulo parcial ja iniciado |
| `docs/recomendacao_proximo_modulo_pos_prestadores.md` | Recomendacao posterior ao mini ciclo | Serve de contexto historico para a rodada seguinte |
| `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md` | Recomendacao apos pausa de Intervencoes | Mantem a linha de reavaliacao conservadora |
| `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md` | Contexto adjacente | Confirma que Prestadores foi o proximo modulo recomendado no ciclo de Convênios e Planos |

## Historico conhecido do modulo Prestadores
Prestadores ja tinha um ciclo parcial anterior, com namespace passivo, helper puro `prestFmtCodigo` e, mais tarde, `prestStatusHtml` tambem extraido de forma literal. Depois disso, o modulo foi reavaliado e pausado porque o restante ficou concentrado em UI, renderizacao, cache, selecao e fluxos sensiveis.

## Onde o ciclo anterior parou
O ciclo anterior parou apos a Subetapa 8, quando a reavaliacao documental concluiu que nao havia novo helper pequeno e claramente puro para extracao imediata acima do nivel ja alcançado por `prestFmtCodigo` e `prestStatusHtml`.

## Motivo conhecido da pausa anterior
Motivos principais:
- o restante do bloco envolve UI e renderizacao;
- existe dependencia de cache e selecao;
- ha botões/fluxos para agenda, convenios e comissoes;
- `prestCarregar` ainda faz request e popula lista;
- `prestEnsureUI` ainda monta a tela dinamicamente;
- qualquer nova extracao seria mais arriscada do que o ganho esperado.

## Existe modulo JS de Prestadores?
Sim. O arquivo `frontend/js/modules/prestadores.js` existe.

Estado observado do modulo:
- `name: "prestadores"`
- `version: "0.2.1"`
- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- `subetapa: "1_namespace_passivo"`

## Existe namespace de Prestadores?
Sim. O namespace exposto e `window.BranaPrestadoresModule`.

Funcoes e dados expostos no modulo:
- `meta`
- `getInfo()`
- `getStatus()`
- `prestFmtCodigo()`
- `prestStatusHtml()`

## index.html ja carrega o modulo?
Sim. `frontend/index.html` carrega `frontend/js/modules/prestadores.js` antes de `frontend/app.js`, entao o namespace passivo esta disponivel quando o monolito executa.

## Acoes/menu/rotas relacionadas no index.html
Itens localizados em `frontend/index.html`:
- menu `data-menu-action="cadastro-prestadores"`
- seletor `#users-modal-prestador`
- bloco `#users-perf-prestadores`
- inclusao do script `/frontend/js/modules/prestadores.js`
- scripts auxiliares de prestadores/agenda carregados depois do modulo principal

## Funcoes relacionadas no frontend/app.js
Funcoes e pontos relacionados a Prestadores atualmente encontrados:
- `prestSelecionado`
- `prestStatusHtml`
- `prestFmtCodigo`
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`

Pontos de abertura/consumo observados:
- `cadastro-prestadores` chama `prestAbrir()`
- `config-agendas` e outros caminhos de apoio chamam `prestEnsureUI()` e `prestCarregar()`
- a selecao corrente e a renderizacao continuam centralizadas no bloco de Prestadores

## Variaveis globais/cache/estado
Variaveis ligadas ao modulo:
- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`
- `prestCredCfg`
- `prestCredItens`
- `prestCredSelId`
- `prestCredConvenios`
- `prestComCfg`
- `prestComItens`
- `prestComSelId`

Estado correlato identificado no monolito:
- `sessaoAtual`
- `usersPrestadoresLookup`
- `usersPerfPrestadores`
- caches de agenda e usuarios que consomem prestador como contexto

## Helpers ja delegados
Helpers que ja estao no modulo passivo:
- `prestFmtCodigo`
- `prestStatusHtml`

## Estado dos helpers prestFmtCodigo e prestStatusHtml
`prestFmtCodigo` e `prestStatusHtml` continuam delegados no namespace passivo e tambem possuem wrapper/fallback em `frontend/app.js`.

Resumo atual:
- `prestFmtCodigo` e um helper simples de formatacao de codigo;
- `prestStatusHtml` retorna o HTML inline da bolinha de status;
- ambos permanecem disponiveis no modulo JS e no wrapper local do monolito;
- o HTML visual de status e preservado no fluxo atual.

## Wrappers/fallbacks no app.js
Existem wrappers/fallbacks locais para:
- `prestFmtCodigo`
- `prestStatusHtml`

Nao foi identificado outro wrapper novo de Prestadores fora desses dois helpers.

## Funcoes que parecem helpers puros candidatos
Nao ha, nesta retomada, um novo helper puro claramente seguro alem dos dois ja delegados.

Possivel candidato teorico:
- `prestSelecionado`

Mas ele nao entra como helper puro forte porque depende de `prestadoresCache` e `prestadorSelId`.

## Funcoes sensiveis que nao devem ser movidas agora
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`

Razao: elas concentram UI, renderizacao, carregamento, selecao e a montagem da tela.

## Funcoes que envolvem renderizacao
- `prestRender`
- parte do fluxo de `prestEnsureUI`
- o ponto de chamada de status dentro da grade

## Funcoes que envolvem eventos, clique ou duplo clique
- `bindStandardGridActivation` dentro de `prestEnsureUI`
- eventos de `change` e `input` ligados a `prestRender`
- botoes `Novo prestador...`, `Altera...`, `Elimina`, `Agenda...`, `Convênios...`, `Comissões...`, `Fecha`

## Funcoes que envolvem modais
Na tela de Prestadores existem subpanes e caminhos de interface, mas o bloco atual trabalha principalmente com painel e nao com modal proprio isolado.

Os pontos sensiveis sao os caminhos de:
- agenda
- convenios
- comissoes

## Funcoes que envolvem payload
Nao foi identificado payload de salvamento real nesta fase do bloco principal. O fluxo atual ainda nao foi movido para uma etapa funcional de persistencia.

## Funcoes que envolvem salvamento
Nao ha salvamento funcional consolidado neste momento no recorte analisado.

## Funcoes que envolvem exclusao
O botao `Elimina` existe no painel, mas nesta retomada ele segue como fluxo sensivel/placeholder historico e nao foi levado para extracao funcional nova.

## Funcoes que envolvem API/requestJson
- `prestCarregar` usa `requestJson("GET", "/cadastros/prestadores", ...)`
- o fallback da carga usa `sessaoAtual` quando a chamada falha

## Funcoes que envolvem cache/estado
- `prestSelecionado`
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`
- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`
- caches de credenciamento/comissao relacionados ao modulo

## Funcoes que envolvem selecao de prestador
- `prestSelecionado`
- `prestSelecionarLinha`
- `prestCarregar` ao garantir selecao corrente
- consumo de `prestadorSelId` na renderizacao

## Relacao com pacientes
Nao existe relacao direta forte neste recorte principal, mas o bloco de usuarios e outros fluxos do sistema consomem prestador como contexto.

## Relacao com procedimentos
Nao ha dependencia funcional direta nova neste recorte principal.

## Relacao com materiais
Nao ha relacao direta com materiais no miolo atual de Prestadores.

## Relacao com tabelas, preços, custos, repasses, comissoes ou financeiro
Existe caminho visual para `Comissões...`, porem nao houve movimento funcional real nesta retomada. Tabelas, preços, custos, repasses e financeiro nao foram tocados e seguem fora do escopo.

## Relacao com backend/API/banco
- frontend consome `GET /cadastros/prestadores`
- nao houve alteracao de backend, banco, schema, migrations ou endpoints nesta etapa

## Risco textual/mojibake
Existe texto legado e HTML inline com mojibake historico em trechos do modulo e da documentacao. Nao corrigir isso agora. A blindagem textual continua obrigatoria.

## Risco especifico de regressao em renderizacao, cache ou selecao
Alto, porque a lista, a selecao e a renderizacao da grade ainda vivem no `app.js` e dependem de caches locais e do estado do painel.

## Risco especifico por se tratar de modulo ja pausado
Tambem alto, porque o modulo ja passou por ciclo parcial suficiente para isolar apenas os helpers pequenos. Reabrir sem um alvo bem delimitado aumenta a chance de retrabalho.

## Ha algum helper puro seguro para analise futura?
Nao foi identificado novo helper puro seguro nesta retomada acima dos dois ja delegados.

## Decisao recomendada
Manter Prestadores pausado nesta rodada.

Justificativa:
- os helpers pequenos e seguros ja foram extraidos;
- o restante e UI, selecao, cache e carga de lista;
- nao apareceu novo alvo puro com contrato simples;
- o risco de mexer no fluxo principal supera o ganho de uma nova extracao imediata.

## Proxima etapa recomendada
Se Prestadores voltar no futuro, a proxima etapa deve ser apenas documental ou um novo mapeamento pontual de um unico helper muito pequeno, caso apareca um contrato de entrada/saida claro.

## Roteiro de teste futuro, se houver extracao funcional
1. `Ctrl+F5`.
2. Abrir a tela de Prestadores.
3. Confirmar que a grade continua abrindo normalmente.
4. Conferir se a coluna de status segue igual.
5. Conferir selecao de linha.
6. Conferir filtros por nome e especialidade.
7. Nao salvar.
8. Nao excluir.
9. Nao acionar agenda, convenios ou comissoes.
10. Verificar o console do navegador.
