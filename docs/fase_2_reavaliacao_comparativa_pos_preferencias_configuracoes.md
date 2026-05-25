# Fase 2 - Reavaliacao comparativa pos pausa de Preferencias / Configuracoes comuns

## Objetivo
Comparar documentalmente os modulos core/comum candidatos para escolher a proxima frente de menor risco apos o fechamento de `Preferencias / Configuracoes comuns`, sem alterar codigo.

## Contexto das frentes pausadas

- `Agenda de contatos` permanece pausada/consolidada e nao deve ser reaberta.
- `Agenda principal` permanece pausada temporariamente.
- `Preferencias / Configuracoes comuns` permanece pausada/consolidada nesta rodada.

## Resumo da frente Preferencias / Configuracoes comuns

- A frente foi fechada documentalmente na Subetapa 17.
- Commit de referencia: `6fb8180`.
- Documento de fechamento: `docs/fase_2_preferencias_configuracoes_subetapa_17_fechamento_pausa.md`.
- Helpers extraidos e validados:
  - `prefAmbEstiloPadrao`
  - `prefValoresPadraoDados`
  - `prefValoresPadraoOdontograma`
  - `prefAmbienteTextoExemplo`
  - `prefAmbienteDialogoValor`
  - `prefAmbienteEstiloDeDialogo`
- Estado final do modulo:
  - `frontend/js/modules/preferencias-opcoes-sistema.js` permanece passivo;
  - carregado antes de `frontend/app.js`;
  - exposto em `window.BranaPreferenciasOpcoesSistemaModule`;
  - continua parcial;
  - nao recebeu DOM, `requestJson`, payload, salvamento, endpoints, permissões ou logica sensivel;
  - mantem duplicidade controlada/fallback com `frontend/app.js`.

## Modulos avaliados

### Ficha pessoal
- Classificacao aproximada: especifica de area clinica.
- Tamanho aproximado em `frontend/app.js`: muito alto.
- Módulo dedicado em `frontend/js/modules`: nao confirmado como fronteira segura nesta rodada.
- Helpers puros aparentes: existem possiveis helpers textuais, mas o bloco e muito acoplado.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro / impressao / exportacao: integra com varios fluxos, mas nao e o foco principal.
- Texto visivel / mojibake: alto risco de impacto.
- Risco de extração: alto.
- Adequado para nova frente minima: nao.

### Conta corrente
- Classificacao aproximada: financeira.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: nao identificado como fronteira simples nesta rodada.
- Helpers puros aparentes: possiveis helpers de formato, mas com acoplamento alto.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro / impressao / exportacao: sim, com alta sensibilidade.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: alto.
- Adequado para nova frente minima: nao.

### Relatorios
- Classificacao aproximada: transversal, mas nao isolado.
- Tamanho aproximado em `frontend/app.js`: medio/alto.
- Módulo dedicado em `frontend/js/modules`: apenas pecas auxiliares, nao o fluxo inteiro.
- Helpers puros aparentes: alguns de formato, mas o fluxo principal e de preview/export.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro / impressao / exportacao: sim.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: medio-alto.
- Adequado para nova frente minima: nao nesta rodada.

### Indices financeiros
- Classificacao aproximada: financeira.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: nao confirmado como fronteira minima.
- Helpers puros aparentes: poucos e nao prioritarios.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro / impressao / exportacao: sim, com risco sistêmico.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: alto.
- Adequado para nova frente minima: nao.

### Cadastros auxiliares ja modularizados
- Classificacao aproximada: comum / administrativo.
- Tamanho aproximado em `frontend/app.js`: variavel, mas ja muito recortado.
- Módulos dedicados em `frontend/js/modules`: sim, varios.
- Helpers puros aparentes: sim, em varios subdominios.
- DOM / estado global / `requestJson`: variavel por modulo.
- Backend / endpoints / banco / permissoes: variavel por modulo.
- Texto visivel / mojibake: existe em alguns trechos, mas nao e a fronteira nova desta rodada.
- Risco de extração: baixo a medio nos modulos ja consolidados, mas sem novo alvo claro.
- Adequado para nova frente minima: apenas se houver reabertura documentada de um submodulo ja parcialmente iniciado.

### Convênios e Planos
- Classificacao aproximada: comum / administrativo com impacto financeiro indireto.
- Tamanho aproximado em `frontend/app.js`: medio/alto.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: existe normalizacao textual, mas o fluxo e maior.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro / calendario / exclusao: sim.
- Texto visivel / mojibake: risco medio.
- Risco de extração: medio-alto.
- Adequado para nova frente minima: nao como primeira escolha.

### Plano de Contas
- Classificacao aproximada: comum / administrativo.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: sim, mais claros.
- DOM / estado global: medio.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Financeiro: sim, mas com escopo mais controlado que Conta corrente/Indices.
- Texto visivel / mojibake: risco baixo/medio.
- Risco de extração: medio.
- Adequado para nova frente minima: somente se a estrategia for retomar um modulo ja consolidado.

### Medicamentos
- Classificacao aproximada: comum / administrativo-clinico.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: sim.
- DOM / estado global: medio.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Integra com editor de textos e receitas.
- Texto visivel / mojibake: risco baixo/medio.
- Risco de extração: baixo a medio, mas a trilha ja esta praticamente consolidada.
- Adequado para nova frente minima: nao e o melhor candidato agora.

### Materiais
- Classificacao aproximada: comum / administrativo, com impacto em procedimentos.
- Tamanho aproximado em `frontend/app.js`: alto.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: existem, mas o conjunto e grande.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Ligacao com indices, listas e procedimentos.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: alto.
- Adequado para nova frente minima: nao.

### Procedimentos genericos
- Classificacao aproximada: comum / administrativo-clinico.
- Tamanho aproximado em `frontend/app.js`: alto.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: sim, mas a trilha ja e ampla.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Fluxo com materiais e tabelas sensiveis.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: medio-alto.
- Adequado para nova frente minima: nao.

### Tabela de servicos de protese / Tabela de proteticos
- Classificacao aproximada: especifica de area, ja pausada/consolidada.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: existe helper passivo.
- Helpers puros aparentes: sim, mas a frente foi consolidada.
- DOM / estado global: medio.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Texto visivel / mojibake: risco medio.
- Risco de extração: medio.
- Adequado para nova frente minima: nao nesta rodada, pois a frente esta pausada/consolidada.

### Etiquetas
- Classificacao aproximada: comum / relatorios.
- Tamanho aproximado em `frontend/app.js`: medio.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: sim.
- DOM / estado global: medio.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Relatorios / impressao / exportacao: sim.
- Texto visivel / mojibake: risco baixo/medio.
- Risco de extração: baixo a medio, mas a trilha ja esta muito documentada.
- Adequado para nova frente minima: nao como primeira frente desta rodada.

### Simbolos graficos
- Classificacao aproximada: comum / administrativo, mas visualmente sensivel.
- Tamanho aproximado em `frontend/app.js`: medio/alto.
- Módulo dedicado em `frontend/js/modules`: sim.
- Helpers puros aparentes: sim.
- DOM / estado global: alto.
- `requestJson` / payload: sim.
- Backend / endpoints / banco / permissoes: sim.
- Editor / preview / iframe / postMessage: sim.
- Texto visivel / mojibake: risco medio/alto.
- Risco de extração: medio-alto.
- Adequado para nova frente minima: nao nesta rodada.

## Comparacao por risco

### Manter Preferencias / Configuracoes comuns
- Nao recomendado agora.
- A frente ja foi pausada/consolidada na Subetapa 17.
- Os remanescentes ja ficaram em patamar medio/alto.

### Voltar para Agenda principal
- Nao recomendado nesta rodada.
- A agenda continua pausada temporariamente.
- Os helpers restantes da agenda ficaram mais sensiveis que os ja extraidos.

### Escolher Ficha pessoal
- Nao recomendado.
- O bloco e muito grande e acoplado.
- O risco funcional e alto demais para uma retomada minima.

### Escolher Conta corrente
- Nao recomendado.
- O risco financeiro e a sensibilidade de payload e exclusao sao altos.

### Escolher Relatorios
- Nao recomendado como primeira opcao.
- Ha preview/exportacao e integracao com dados de varios dominios.

### Escolher Indices financeiros
- Nao recomendado.
- O risco financeiro e sistêmico supera o beneficio de uma nova rodada minima.

### Escolher Cadastros auxiliares
- Requer especificacao mais fina.
- Alguns modulos ja estao consolidados.
- Nao apareceu um novo alvo claramente inferior em risco nesta rodada.

### Escolher outro modulo core/comum menor
- A melhor alternativa identificada e `Prestadores`.
- E o modulo parcial com menor risco comparativo entre os ainda plausivelmente retomaveis.

## Recomendacao de proxima frente

**Prestadores**

### Classificacao aproximada
- Core / comum no sentido administrativo e transversal.

### Justificativa
- O modulo e parcial, mas pequeno em comparacao com Ficha pessoal, Conta corrente, Relatorios, Indices financeiros, Materiais e Procedimentos.
- Ja existe namespace passivo em `frontend/js/modules/prestadores.js`.
- O helper puro `prestFmtCodigo` ja foi isolado e validado.
- A fronteira e mais clara e o risco comparativo e menor do que nos demais candidatos ainda vivos.
- A superficie funcional restante e mais contida do que em Convênios e Planos, Materiais ou fluxos financeiros.

### Riscos principais
- `frontend/app.js` ainda concentra UI, carregamento, selecao e renderizacao.
- A grade continua dinamica e dependente de `bindStandardGridActivation`.
- Ha consumidores externos da lista de prestadores.
- O fluxo de salvar/excluir ainda nao esta completamente modularizado.

## Proxima subetapa recomendada

`Prestadores - Subetapa 0 de retomada documental / mapeamento tecnico complementar`

### Tipo de subetapa
- Preferencia: mapeamento tecnico complementar, com leitura cuidadosa do bloco monolitico e dos consumidores.
- Se a estrategia exigir continuidade funcional, o helper seguinte mais natural e `prestStatusHtml`, mas isso deve ser decidido somente depois dessa retomada documental.

## Onde testar futuramente

Se houver implementacao futura em `Prestadores`, o teste deve ocorrer em:

- `Cadastro > Prestadores`
- abertura da tela/painel
- listagem
- filtros por nome e especialidade
- selecao de linha
- confirmacao de console sem erro
- validacao dos helpers passivos expostos em `window.BranaPrestadoresModule`

## Riscos remanescentes

- O modulo passivo de `Preferencias / Configuracoes comuns` continua parcial e pausado.
- A comparacao nao remove o risco de modulos maiores que permanecem monoliticos.
- `Prestadores` ainda depende de consumidores externos e de UI dinamica no `app.js`.
- Qualquer nova extracao deve seguir o padrao de extração minima controlada.

## Pendencias futuras

- Se `Prestadores` for retomado, revisar o bloco monolitico e os consumidores antes de tocar em renderizacao ou eventos.
- Se o projeto decidir por outra frente, realizar nova comparacao documental antes de codificar.
- Manter qualquer mojibake ou texto quebrado apenas como pendencia documental.

## Blindagem textual/mojibake

- A blindagem textual/mojibake foi respeitada.
- Nao houve correcao de textos visiveis, labels, placeholders ou mensagens.
- Qualquer texto quebrado ja observado permanece somente como registro futuro.

