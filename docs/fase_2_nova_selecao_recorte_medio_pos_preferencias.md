# Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias

## Objetivo

Comparar documentalmente os proximos modulos/blocos candidatos apos a validacao de `prefAmbienteSecoesAtuais`, sem alterar codigo, para decidir se existe um novo recorte medio controlado realmente seguro.

## Contexto

Dois recortes medios controlados ja foram implementados, testados e validados:

- `Prestadores / prestFiltrarLista(lista, filtros)`
- `Preferencias / Configuracoes comuns / prefAmbienteSecoesAtuais(baseSecoes, atuais)`

As duas frentes ficaram consolidadas e o restante dos blocos ainda apresenta risco medio-alto ou alto, ou ja esta consolidado sem novo alvo claro.

Frentes pausadas/consolidadas:

- `Agenda de contatos` permanece pausada/consolidada
- `Agenda principal` permanece pausada temporariamente
- `Prestadores` permanece consolidado apos `prestFiltrarLista`
- `Preferencias / Configuracoes comuns` permanece consolidada apos `prefAmbienteSecoesAtuais`

## Modulos/blocos avaliados

### 1. Preferencias / Configuracoes comuns - remanescentes de Ambiente
- Tipo: estado visual e preview
- Dependencias: `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefAmbienteSecaoAtiva`, `prefAmbienteEstiloAtual`, `prefAtualizarTitulo`, `prefRenderCombos*`, `prefAbrirDialogoFonteAmbiente`, `prefSelecionarAba`, `prefRenderListaAmbiente`, `prefAplicarPreviewAmbiente`, `prefRebuildAmbientePreview`, `prefSincronizarUI`, `prefEnsureUI`, `prefColetarPayload*`, `prefCarregarDados`, `prefSalvar*`, `sysOpt*`
- DOM/window/document: sim
- requestJson/payload/salvamento: sim em varios trechos
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/abas/preview: sim
- Risco: medio-alto a alto
- Aceitavel como proximo recorte medio controlado: nao

### 2. Prestadores - remanescentes apos `prestFiltrarLista`
- Tipo: renderizacao, selecao, carga e orquestracao de tela
- Dependencias: `prestRender`, `prestSelecionarLinha`, `prestCarregar`, `prestAcoesPlaceholder`, `prestEnsureUI`, `prestAbrir`
- DOM/window/document: sim
- requestJson/payload/salvamento: sim em varios trechos
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao: sim
- Risco: medio-alto a alto
- Aceitavel como proximo recorte medio controlado: nao, porque a frente ja foi consolidada e o restante esta mais sensivel

### 3. Cadastros auxiliares ja modularizados
- Tipo: familia de submodulos/passivo ja existente
- Dependencias: variam por submodulo; alguns helpers puros ja existem, mas nao ha um novo alvo claramente inferior em risco
- DOM/window/document: variavel
- requestJson/payload/salvamento: variavel
- Permissoes/backend/banco/schema/migrations/seeds: variavel
- Altera texto visivel/abas/preview: depende do submodulo
- Risco: baixo a medio em partes, mas sem fronteira nova clara nesta rodada
- Aceitavel como proximo recorte medio controlado: nao como escolha imediata, pois exige nova especificacao mais fina

### 4. Etiquetas
- Tipo: fluxo de etiquetas e relatorios
- Dependencias: relatorios, impressao e configuracao de modelos
- DOM/window/document: sim
- requestJson/payload/salvamento: sim em fluxos de integracao
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/preview: sim
- Risco: baixo a medio, mas a trilha ja esta muito consolidada e nao apresenta novo alvo minimo claro nesta rodada
- Aceitavel como proximo recorte medio controlado: nao

### 5. Medicamentos
- Tipo: CRUD administrativo-clinico
- Dependencias: grupos, apresentacoes, usos, assistente de receitas
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao: sim
- Risco: baixo a medio, mas a trilha ja esta praticamente consolidada e nao oferece um recorte medio novo claramente inferior aos demais
- Aceitavel como proximo recorte medio controlado: nao

### 6. Plano de Contas
- Tipo: administrativo/financeiro
- Dependencias: scaffold compartilhado, modal comum e campos financeiros
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/abas/renderizacao: sim
- Risco: medio a medio-alto
- Aceitavel como proximo recorte medio controlado: nao nesta rodada

### 7. Convênios e Planos
- Tipo: administrativo com impacto financeiro indireto
- Dependencias: calendario, modelos e rotas de preferencias
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/abas/preview: sim
- Risco: medio-alto
- Aceitavel como proximo recorte medio controlado: nao

### 8. Relatorios
- Tipo: preview/export/transversal
- Dependencias: email, anexos, configuracao, visualizacao
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/preview/exportacao: sim
- Risco: medio-alto
- Aceitavel como proximo recorte medio controlado: nao

### 9. Materiais
- Tipo: lista, modal e indices vinculados
- Dependencias: procedimentos, indices, varias listas e modais
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

### 10. Procedimentos genericos
- Tipo: fluxo clinico-administrativo com materiais e custos
- Dependencias: materiais, tabelas, reajustes e regras de negocio
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

### 11. Ficha pessoal
- Tipo: area clinica central
- Dependencias: paciente, dados sensiveis e varios fluxos cruzados
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/abas/renderizacao: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

### 12. Conta corrente
- Tipo: financeiro
- Dependencias: lancamentos, filtros e exclusoes
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

### 13. Indices financeiros
- Tipo: financeiro sistemico
- Dependencias: calculos, resumos e rotinas de apoio
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/preview/renderizacao: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

### 14. Agenda principal remanescente
- Tipo: agenda central, comparativo apenas
- Dependencias: paciente, prestador, unidade, agenda legado e UI principal
- DOM/window/document: sim
- requestJson/payload/salvamento: sim
- Permissoes/backend/banco/schema/migrations/seeds: sim
- Altera texto visivel/selecao/renderizacao/abas: sim
- Risco: alto
- Aceitavel como proximo recorte medio controlado: nao

## Matriz comparativa

| Candidato | Risco | Permite recorte medio agora? | Observacao |
|---|---:|---|---|
| Preferencias remanescentes | medio-alto/alto | nao | fluxo visual sensivel, preview e salvamento |
| Prestadores remanescentes | medio-alto/alto | nao | frente ja consolidada, restante e mais sensivel |
| Cadastros auxiliares | baixo/medio em partes | nao ainda | pede especificacao mais fina por submodulo |
| Etiquetas | baixo/medio | nao | trilha ja consolidada, sem novo alvo minimo claro |
| Medicamentos | baixo/medio | nao | trilha praticamente consolidada |
| Plano de Contas | medio | nao | scaffold compartilhado e risco financeiro |
| Convênios e Planos | medio-alto | nao | preview e fluxo administrativo com risco |
| Relatorios | medio-alto | nao | preview/exportacao e integracao sensivel |
| Materiais | alto | nao | muita superficie, listas e modais |
| Procedimentos genericos | alto | nao | custos, materiais e regras cruzadas |
| Ficha pessoal | alto | nao | area clinica central |
| Conta corrente | alto | nao | financeiro e exclusoes |
| Indices financeiros | alto | nao | risco sistêmico/financeiro |
| Agenda principal remanescente | alto | nao | fluxo central e muito acoplado |

## Recomendacao

**Opcao D - Recomendar nova comparacao mais restrita antes de escolher.**

### Justificativa

- Nenhum candidato desta rodada aparece com fronteira claramente menor que o contrato ja validado em Prestadores e Preferencias.
- Os blocos mais promissores ou ja estao consolidados, ou ainda dependem de DOM, preview, salvamento, `requestJson` e varios eventos.
- `Cadastros auxiliares` e o unico grupo com partes baixas a medias, mas ainda pede desmembramento mais fino para apontar um recorte seguro.
- Avancar agora seria abrir um novo recorte sem contrato suficientemente estreito.

### Por que e a escolha mais segura

- preserva o ganho dos recortes ja validados;
- evita misturar UI, estado e integracao numa frente grande demais;
- reduz o risco de regressao em abas, preview, dialogos e payloads;
- nao exige implementar nada nesta etapa.

### Ganho real esperado

- produzir uma segunda comparacao restrita, agora focada apenas nos candidatos de risco mais baixo entre os remanescentes;
- deixar pronto um contrato documental mais estreito para o proximo recorte medio controlado;
- evitar avancar com um bloco que ainda esteja amplo demais.

## Proxima subetapa recomendada

`Fase 2 - Comparacao documental restrita entre Cadastros auxiliares, Medicamentos e Plano de Contas`

## Riscos remanescentes

- a maior parte dos candidatos ainda e medio-alto ou alto;
- `Preferencias` e `Prestadores` ja foram consolidados, mas continuam tendo partes sensiveis no `app.js`;
- sem uma comparacao mais restrita, o proximo passo pode voltar a ficar amplo demais;
- qualquer novo recorte continua exigindo contrato documental antes de qualquer implementacao.

## Pendencias futuras

- criar comparacao documental ainda mais restrita entre os poucos candidatos com risco baixo/medio;
- definir, se for o caso, um unico bloco com fronteira realmente pequena;
- manter qualquer mojibake legado apenas como pendencia documental futura.

## Registro de blindagem textual/mojibake

Esta etapa foi exclusivamente documental. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido nesta entrega. Eventuais textos quebrados ou mojibake devem permanecer apenas como pendencia futura.
