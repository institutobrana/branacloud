# Implementacao - Convênios e Planos shell visual de containers

## Objetivo

- Registrar a implementacao minima e conservadora do recorte permitido pela decisao `CONVPLAN-SHELL-A`.
- O foco foi isolar apenas apoio visual/passivo de containers do shell de `Convênios e Planos`.
- Nenhum comportamento funcional foi alterado.

## Decisao de origem

- A decisao de origem foi `CONVPLAN-SHELL-A`.
- O shell continua misto em `frontend/app.js`, entao o recorte ficou limitado a um helper passivo e ao uso defensivo dele com fallback local.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/convenios-planos.js`
- `docs/fase_2b_convenios_planos_implementacao_shell_visual_containers.md`
- `docs/11_roadmap_desenvolvimento.md`

## Helper criado ou ajustado

- Foi criado no modulo passivo `frontend/js/modules/convenios-planos.js` o helper `resolverShellVisualContainers`.
- O helper apenas retorna os ids dos containers/controles do shell visual.
- Ele nao chama `requestJson`, nao carrega dados, nao altera estado global, nao seleciona convênio/plano, nao salva e nao exclui nada.
- Em `frontend/app.js`, a montagem do shell passou a consultar `window.BranaConveniosPlanosModule?.helpers?.resolverShellVisualContainers()` de forma defensiva.
- O fallback local equivalente foi preservado, usando os ids atuais quando o helper nao existe.

## Como o fallback foi preservado

- Se o modulo passivo nao estiver disponivel, `frontend/app.js` continua usando os ids literais ja existentes.
- O fluxo de abertura do painel, carregamento, selecao, eventos e calendario permanece inalterado.
- O helper apenas organiza a referencia visual do container principal do shell.

## O que nao foi alterado

- `convPlanAbrir` em comportamento funcional.
- `convPlanEnsureUI` em comportamento funcional.
- `convPlanVincularEventos` em comportamento funcional.
- `convPlanSelecionarConvenio`.
- `convPlanSelecionarPlano`.
- `convPlanCarregar`.
- `convPlanCal*`.
- `requestJson`.
- payload.
- salvamento.
- exclusao.
- edicao.
- calendario/faturamento.
- permissões.
- backend.
- banco.
- schema.
- migrations.
- seeds.
- endpoints.
- `.env`.
- `frontend/index.html`.

## Riscos evitados

- Evitou-se mexer em carregamento remoto.
- Evitou-se mexer em wiring/eventos.
- Evitou-se mexer em selecao funcional.
- Evitou-se mexer em salvamento, exclusao e calendario/faturamento.
- Evitou-se mexer em backend e banco.
- Evitou-se remover o fallback local.

## Comandos de check executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/convenios-planos.js`
- `git diff -- frontend/app.js frontend/js/modules/convenios-planos.js docs/fase_2b_convenios_planos_implementacao_shell_visual_containers.md docs/11_roadmap_desenvolvimento.md`
- `git status --short`

## Onde testar

- Abrir a tela `Convênios e Planos` normalmente.
- Confirmar que a lista de convênios aparece como antes.
- Confirmar que a lista de planos aparece como antes.
- Abrir e fechar o painel.
- Recarregar a tela sem salvar.
- Observar calendario/faturamento apenas como nao-regressao visual.
- Nao usar esta etapa para validar salvamento ou exclusao.

## Commit seletivo obrigatorio

- Se a etapa for confirmada como somente implementacao minima e documental, o commit deve incluir apenas os arquivos efetivamente alterados dentro do escopo permitido.

## Registro para roadmap

- A implementacao minima do helper visual/passivo de containers foi concluida.
- A origem da decisao foi `CONVPLAN-SHELL-A`.
- O fallback local em `frontend/app.js` foi preservado.
- Nenhum backend, banco, `frontend/index.html`, `requestJson`, payload, salvamento, exclusao, calendario/faturamento ou permissao foi alterado.
- O proximo passo recomendado e a validacao manual pelo usuario antes de qualquer novo avanço.
