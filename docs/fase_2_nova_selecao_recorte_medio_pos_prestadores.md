# Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do primeiro recorte medio controlado

## Objetivo

Selecionar documentalmente o proximo bloco candidato apos a validacao de `prestFiltrarLista` em Prestadores, sem alterar codigo e sem iniciar um novo recorte medio nesta rodada.

## Contexto pos-validacao de `prestFiltrarLista`

A fase de helpers pequenos ja chegou ao limite em varias frentes. Em Prestadores, o primeiro recorte de risco medio controlado foi executado e validado com sucesso, o que permitiu uma consolidacao documental da frente.

O estado atual de Prestadores e:

- helpers extraidos e validados: `prestFmtCodigo`, `prestStatusHtml`, `prestSelecionado`, `prestFiltrarLista`;
- modulo passivo em `frontend/js/modules/prestadores.js`;
- carregado antes de `frontend/app.js`;
- com fallback/duplicidade controlada com `frontend/app.js`;
- sem DOM, `requestJson`, payload, salvamento, endpoints ou permissoes no modulo passivo.

## Modulos / blocos avaliados

### Prestadores / `prestRender`
- Tipo: DOM / renderizacao.
- Dependencias: `prestadoresCache`, `prestadorSelId`, helpers extraidos.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao diretamente.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve exclusao: nao.
- Envolve permissoes: nao.
- Envolve backend/banco/schema/migrations/seeds: nao diretamente.
- Altera texto visivel: sim, por mensagem de lista vazia e status.
- Altera selecao visual: sim.
- Altera renderizacao: sim.
- Impacto visual: alto.
- Ganho estimado no `frontend/app.js`: alto.
- Teste manual futuro: tela de Prestadores completa, incluindo lista e destaque.
- Risco: medio-alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Prestadores / `prestSelecionarLinha`
- Tipo: evento / selecao visual.
- Dependencias: DOM, `prestadorSelId`, `prestRender`.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve exclusao: nao.
- Envolve permissoes: nao.
- Altera texto visivel: nao diretamente.
- Altera selecao visual: sim.
- Altera renderizacao: sim, via `prestRender()`.
- Impacto visual: medio/alto.
- Ganho estimado no `frontend/app.js`: baixo/medio.
- Teste manual futuro: clique em linha e verificacao de destaque.
- Risco: medio-alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Prestadores / `prestAcoesPlaceholder`
- Tipo: feedback textual / fluxo.
- Dependencias: `prestSelecionado`, `footerMsg`.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim, via item selecionado.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve exclusao: nao.
- Envolve permissoes: nao.
- Altera texto visivel: sim.
- Altera selecao visual: nao.
- Altera renderizacao: nao diretamente.
- Impacto visual: medio.
- Ganho estimado no `frontend/app.js`: baixo.
- Teste manual futuro: acionar botoes de acoes e verificar mensagem.
- Risco: medio-alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Prestadores / proximo bloco pequeno possivel
- Situacao: nao ha, nesta rodada, um novo bloco pequeno claramente seguro.
- Risco comparativo: medio-alto ou alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Preferencias / Configuracoes comuns remanescentes
- Tipo: UI por abas / contexto.
- Dependencias: `prefCfg`, abas, preview, helpers ja extraidos.
- Usa DOM: sim.
- Usa `window/document`: sim.
- Usa estado global: sim.
- Usa `requestJson`: em partes.
- Monta payload: em partes.
- Envolve salvamento: em partes.
- Envolve exclusao: nao e o foco principal.
- Envolve permissoes: nao diretamente, mas pode tocar contexto sensivel.
- Envolve backend/banco/schema/migrations/seeds: sim, em partes menores do fluxo.
- Altera texto visivel: sim.
- Altera selecao visual: sim, por abas e dialogos.
- Altera renderizacao: sim.
- Impacto visual: medio.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: abrir preferencias, alternar abas e validar dialogs/preview.
- Risco: medio.
- Aceitavel como proximo recorte medio controlado: **sim, como contrato documental posterior**.

### Convênios e Planos
- Tipo: cadastro com impacto financeiro indireto.
- Dependencias: combos, seletores, vinculos.
- Usa DOM: sim.
- Usa `requestJson`: sim, em partes.
- Monta payload: sim, em partes.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Altera selecao visual: sim.
- Altera renderizacao: sim.
- Impacto visual: medio/alto.
- Ganho estimado no `frontend/app.js`: medio.
- Risco: medio-alto.
- Aceitavel como proximo recorte medio controlado: nao nesta rodada.

### Relatorios
- Tipo: preview / exportacao / filtros.
- Dependencias: UI, saida visual e possiveis endpoints.
- Usa DOM: sim.
- Usa `requestJson`: possivelmente sim.
- Monta payload: possivelmente sim.
- Envolve backend/banco/schema/migrations/seeds: sim em partes.
- Altera texto visivel: sim.
- Altera selecao visual: sim.
- Altera renderizacao: sim.
- Impacto visual: alto.
- Ganho estimado no `frontend/app.js`: alto.
- Risco: medio-alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Etiquetas
- Tipo: relatorios / documentos.
- Dependencias: modulos de modelo e configuracao.
- Usa DOM: sim.
- Usa `requestJson`: sim, em partes.
- Monta payload: sim, em partes.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Risco: baixo/medio, mas com superficie de saida e exportacao.
- Aceitavel como proximo recorte medio controlado: nao como primeira opcao nesta rodada.

### Medicamentos
- Tipo: cadastro administrativo-clinico.
- Dependencias: listas, assistente de receitas e validacoes.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Risco: baixo/medio, mas com trilha ja bem consolidada.
- Aceitavel como proximo recorte medio controlado: nao nesta rodada.

### Plano de Contas
- Tipo: administrativo / financeiro.
- Dependencias: filtros e dados financeiros.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Risco: medio.
- Aceitavel como proximo recorte medio controlado: somente se a estrategia for retomar um modulo ja consolidado.

### Materiais
- Tipo: cadastro / apoio a procedimentos.
- Dependencias: tabelas, combos e regras de vinculacao.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Risco: medio/alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Procedimentos genericos
- Tipo: cadastro grande.
- Dependencias: editor, buscas e vinculos.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim.
- Risco: alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Agenda principal remanescente
- Tipo: fluxo legado sensivel.
- Dependencias: estado global, UI e helpers remanescentes.
- Usa DOM: sim.
- Usa `requestJson`: em partes.
- Risco: alto.
- Aceitavel como proximo recorte medio controlado: nao.

### Cadastros auxiliares ja modularizados
- Tipo: variavel.
- Dependencias: variavel por subdominio.
- Risco: variavel, com muitos blocos ja consolidados.
- Aceitavel como proximo recorte medio controlado: nao apareceu um alvo unico melhor que Preferencias.

### Outro modulo core/comum viavel
- Observacao: nao apareceu um candidato melhor do que `Preferencias / Configuracoes comuns` nesta rodada.

## Matriz comparativa resumida

| Candidato | Risco | Ganho no `app.js` | Teste futuro | Aceitavel agora? |
|---|---|---:|---|---|
| Prestadores / `prestRender` | Medio-alto | Alto | Tela completa | Nao |
| Prestadores / `prestSelecionarLinha` | Medio-alto | Baixo/medio | Clique em linha | Nao |
| Prestadores / `prestAcoesPlaceholder` | Medio-alto | Baixo | Botoes de acao | Nao |
| Prestadores / bloco pequeno novo | Medio-alto/alto | Variavel | Nao definido | Nao |
| Preferencias / remanescentes | Medio | Medio | Abas/dialogos/preview | Sim, como alvo documental |
| Convênios e Planos | Medio-alto | Medio | Combos/vinculos | Nao |
| Relatorios | Medio-alto | Alto | Preview/export | Nao |
| Etiquetas | Baixo/medio | Medio | Documento/saidas | Nao nesta rodada |
| Medicamentos | Baixo/medio | Medio | Assistente de receitas | Nao nesta rodada |
| Plano de Contas | Medio | Medio | Financeiro/contas | Apenas em etapa posterior |
| Materiais | Medio/alto | Alto | Vinculos/procedimentos | Nao |
| Procedimentos genericos | Alto | Alto | Editor/vinculos | Nao |
| Agenda principal remanescente | Alto | Alto | Fluxo legado | Nao |

## Recomendacao

**B. Recomendar um proximo contrato documental em outro modulo/bloco.**

Modulo/bloco recomendado: **Preferencias / Configuracoes comuns**.

### Justificativa

- e o bloco mais equilibrado entre os candidatos ainda viaveis;
- ja possui um modulo parcial em `frontend/js/modules/preferencias-opcoes-sistema.js`;
- a modularizacao conservadora ja produziu helpers seguros nessa frente;
- o risco comparativo e menor do que em `Ficha pessoal`, `Conta corrente`, `Relatorios`, `Materiais` e `Procedimentos genericos`;
- o teste futuro pode ser feito por abas/dialogos/previews, sem depender de um fluxo pesado de negocio;
- nao e trabalho pesado amplo porque a recomendacao e apenas documental, com contrato antes de qualquer implementacao.

### Limites que nao podem ser ultrapassados

- nao implementar nada nesta rodada;
- nao mexer em backend, banco, permissões, migrations ou seeds;
- nao corrigir textos visiveis ou mojibake;
- nao misturar salvamento com renderizacao numa proxima etapa sem contrato proprio;
- nao reabrir `Agenda de contatos`;
- nao retomar `Agenda principal` nesta rodada;
- nao voltar a `Prestadores` para implementacao imediata sem nova selecao documental.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Contrato funcional e fronteiras para o proximo recorte medio controlado`

## Riscos remanescentes

- o restante de Prestadores ainda e mais sensivel do que o primeiro recorte validado;
- a nova frente recomendada tambem tem remanescentes medio/alto, portanto exige contrato;
- qualquer nova extracao sem contrato pode misturar UI, estado e integracao;
- textos quebrados/mojibake ja existentes seguem como pendencia documental futura.

## Pendencias futuras

- definir o contrato funcional da proxima frente recomendada antes de qualquer codigo;
- manter a validacao manual obrigatoria para o futuro recorte;
- registrar qualquer mojibake apenas como pendencia documental, sem correcao nesta rodada.

## Registro de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada nesta etapa. Nenhuma string visivel foi corrigida ou reescrita nesta selecao documental.
