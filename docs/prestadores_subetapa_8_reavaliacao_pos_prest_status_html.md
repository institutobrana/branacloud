# Prestadores — Subetapa 8 — Reavaliação pós-extração de prestStatusHtml

## Objetivo

Reavaliar documentalmente o estado atual do modulo Prestadores apos a extracao literal de `prestStatusHtml`, para decidir se ainda existe algum helper pequeno, puro e seguro para uma proxima extracao ou se o modulo deve ser pausado nesta rodada.

## Escopo

Esta etapa e exclusivamente documental.

Foram analisados o estado do namespace passivo, as funcoes restantes em `frontend/app.js` e os documentos anteriores de Prestadores.

Nao houve alteracao de codigo, DOM, payload, backend, banco, schema, migrations, endpoints, agenda, permissao, convênios, comissões ou textos visiveis.

## Arquivos inspecionados

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md`
- `docs/prestadores_subetapa_1_namespace_passivo.md`
- `docs/prestadores_subetapa_2_fronteiras_contratos.md`
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md`
- `docs/prestadores_subetapa_5_encerramento_ciclo.md`
- `docs/prestadores_subetapa_6_documental_prest_status_html.md`
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Checks iniciais

- branch atual: `modularizacao-segura-fase-1`
- `git status --short` apresentava apenas pendencias nao relacionadas ja existentes no worktree
- `git log --oneline -6` mostrava `dedb67e Move prestStatusHtml para modulo de Prestadores` no topo
- `git diff --stat` estava vazio antes das alteracoes desta etapa
- `git diff --cached --stat` estava vazio antes das alteracoes desta etapa
- `node --check frontend/app.js` executado com sucesso
- `node --check frontend/js/modules/prestadores.js` executado com sucesso

## Estado atual do módulo JS

O arquivo `frontend/js/modules/prestadores.js` segue existente e o namespace `window.BranaPrestadoresModule` continua passivo.

Estado observado:

- `name: "prestadores"`
- `version: "0.2.1"`
- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`
- `subetapa: "1_namespace_passivo"`

Helpers atualmente delegados ao modulo:

- `prestFmtCodigo`
- `prestStatusHtml`

## Helpers já delegados

### `prestFmtCodigo`

- já delegado anteriormente;
- helper puro;
- sem DOM;
- sem API;
- sem estado global;
- permanece seguro como extracao literal consolidada.

### `prestStatusHtml`

- já delegado na Subetapa 7;
- helper puro na pratica;
- retorna HTML inline para a coluna de status;
- permanece como a extracao mais recente e a referencia principal desta reavaliacao.

## Funções ainda no app.js

Funcoes relacionadas a Prestadores ainda concentradas em `frontend/app.js`:

- `prestSelecionado`
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`
- `prestStatusHtml` como wrapper/fallback
- `prestFmtCodigo` como wrapper/fallback

Estados e caches ainda em `app.js`:

- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`

## Classificação das funções remanescentes

### Já delegado

- `prestFmtCodigo`
- `prestStatusHtml`

### Helper puro candidato

- nenhum novo helper puro ficou claramente mais seguro que os dois ja delegados

### Helper com cautela

- `prestSelecionado`
  - pequeno, mas depende de `prestadoresCache` e `prestadorSelId`
  - e simples, porem ainda acoplado ao estado de selecao

### Fluxo/UI sensível

- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`

### Não mover agora

- `prestCarregar`
- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`

## Possíveis candidatos puros

O unico candidato potencialmente pequeno seria `prestSelecionado`, mas ele nao e realmente puro no sentido forte porque lê estado global de selecao e cache.

Por isso, nesta reavaliacao nao ficou nenhum helper novo com seguranca suficiente para extracao literal imediata acima do nivel ja alcançado por `prestFmtCodigo` e `prestStatusHtml`.

## Funções com cautela

- `prestSelecionado`
  - pequeno e simples;
  - porém ainda usa `prestadoresCache` e `prestadorSelId`;
  - extracao futura exigiria contrato claro de entrada para perder dependencias globais.

## Funções que NÃO devem ser movidas agora

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

Motivo: essas funcoes fazem parte do fluxo de UI, carregamento, renderizacao, selecao ou estado centralizado. Mover agora aumentaria risco de regressao sem ganho proporcional.

## Riscos de UI/renderização

- `prestRender` ainda e o centro da grade;
- qualquer separacao prematura de renderizacao pode afetar linha selecionada, filtro e coluna de status;
- a UI do painel ainda e criada dinamicamente em `prestEnsureUI`;
- os botões de acao continuam sendo parte do fluxo visual do modulo.

## Riscos de estado global/cache

- `prestCfg`, `prestadoresCache` e `prestadorSelId` ainda sustentam o modulo;
- `prestSelecionado` e `prestFiltrarLista` dependem desse estado;
- uma extracao apressada criaria contrato indireto e fragil.

## Riscos de agenda/permissões/convênios/comissões

- existem botoes e caminhos de interface para agenda, convenios e comissoes;
- embora ainda nao haja persistencia real nessas acoes, o tema e sensivel;
- qualquer mexida estrutural sem necessidade pode ampliar risco de regressao em fluxos correlatos e dependentes da lista de prestadores.

## Riscos de texto/mojibake

- a blindagem textual continua obrigatoria;
- nao houve correcao de textos, acentos, labels, mensagens, placeholders ou strings visiveis;
- o simbolo visual e o HTML inline de status permanecem preservados nas extracoes ja feitas;
- reescrita textual agora seria fora de escopo.

## Decisão recomendada

Pausar Prestadores nesta rodada.

Justificativa:

- os helpers verdadeiramente pequenos e seguros ja foram extraidos;
- o que resta e, em sua maioria, fluxo/UI sensivel;
- `prestSelecionado` e um candidato pequeno, mas ainda dependente de cache e estado global;
- mover mais algo agora traria risco de expandir o escopo para renderizacao, selecao ou carregamento.

## Próxima etapa recomendada

Se o projeto voltar a Prestadores futuramente, a proxima etapa deve ser documental ou uma nova reavaliacao focada em um unico helper bem delimitado, somente se houver um contrato de entrada claro para remover dependencia de estado global.

## Roteiro de teste futuro, se houver extração funcional

Se algum helper novo for extraido depois, o teste minimo recomendado sera:

1. `Ctrl+F5`.
2. Abrir a tela de Prestadores.
3. Confirmar que a grade continua carregando normalmente.
4. Confirmar que os status visualmente continuam iguais.
5. Conferir selecao de linha.
6. Conferir filtro por nome e especialidade.
7. Nao salvar.
8. Nao excluir.
9. Nao acionar agenda, convênios ou comissões.
10. Verificar o console do navegador.

## Observacao final

Nesta reavaliacao nao ficou nenhum helper novo com seguranca suficiente para extracao literal imediata. O melhor proximo passo e pausar Prestadores nesta rodada.
