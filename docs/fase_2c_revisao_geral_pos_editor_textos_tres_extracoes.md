# Revisao geral - Fase 2C apos tres extracoes reais do Editor de Textos

## 1. Objetivo da revisao geral

Consolidar o estado atual da estrategia de reducao real de monolitos da Fase 2C, registrar os resultados obtidos ate aqui, o padrao de backup/retorno, os riscos remanescentes e os criterios para escolher o proximo recorte.

## 2. Contexto da transicao da Fase 2B para Fase 2C

- A Fase 2B consolidou validacoes e decisoes conservadoras em areas sensiveis como Ficha pessoal, Prestadores e Convênios e Planos.
- A Fase 2C foi aberta como uma frente especifica para reducao controlada de monolitos com risco medio/medio-alto.
- O objetivo foi permitir extracoes reais de `frontend/app.js` com escopo pequeno, backup, fallback quando possivel e teste manual.

## 3. Motivo da revisao geral apos tres extracoes reais

- O Editor de Textos acumulou tres extracoes reais validadas.
- A rodada precisou ser consolidada para evitar abertura apressada de novo recorte.
- Era necessario registrar o que ja foi provado funcionar e o que ainda exige cuidado.

## 4. Estado atual da Fase 2C

- A Fase 2C provou que reduzcoes reais em `frontend/app.js` sao possiveis no projeto atual.
- O Editor de Textos eh a rodada mais avancada e ja passou por tres extracoes reais com validacao manual.
- A fase continua viva, mas a rodada atual deve ser tratada como consolidada antes de novo recorte.

## 5. Resumo da matriz operacional original da Fase 2C

- A matriz original abriu a Fase 2C como estrategia de reducao real de monolitos.
- O primeiro fluxo recomendado foi o Editor de Textos por ser o maior bloco concentrado e por ja ter bootstrap passivo.
- Os candidatos iniciais mais pesados ficaram como futuras possibilidades, nao como primeira escolha.

## 6. Resumo da rodada do Editor de Textos

- Rodada executada de forma incremental.
- Primeira extracao: bootstrap/shell visual.
- Segunda extracao: toolbar visual.
- Terceira extracao: painel lateral/listagem visual.
- Cada extracao teve implementacao, backup e validacao manual.

## 7. Extracoes reais ja validadas

- Bootstrap/shell visual.
- Toolbar visual.
- Painel lateral/listagem visual.

## 8. Commits principais

- `7760283`
- `8e16fd3`
- `3d5b2c8`
- `27e990d`
- `eb70773`
- `a405449`
- `3f7b77b`
- `72b0e5c`

## 9. Backups criados e funcao de cada backup

- `backups_modularizacao/fase_2c/editor_textos_bootstrap_shell_visual/`
  - Backup da extracao do bootstrap/shell visual.
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/`
  - Backup da extracao da toolbar visual.
- `backups_modularizacao/fase_2c/editor_textos_painel_lateral_listagem_visual/`
  - Backup da extracao da listagem visual do painel lateral.

## 10. O que a Fase 2C provou funcionar

- A extracao real de blocos visuais de `frontend/app.js` funcionou sem quebrar o fluxo validado.
- A estrategia de fachada/wrapper com fallback foi util.
- O uso de modulo passivo com namespace exposto foi suficiente para manter o comportamento visual.
- O teste manual continuo foi capaz de confirmar estabilidade visual percebida.

## 11. O que continua exigindo cuidado

- Fluxos acoplados a selecao funcional.
- Fluxos que encostam em carga remota.
- Fluxos que possam tocar salvamento, PDF, assinatura, payload ou handlers sensiveis.
- Rodadas futuras sem fronteira tecnica pequena e clara.

## 12. Limites obrigatorios para proximas implementacoes

- Backup antes da alteracao.
- Reducao real de `frontend/app.js`.
- Fachada/wrapper.
- Teste manual.
- Commit seletivo.
- Roadmap.
- Blindagem textual/mojibake.

## 13. Fronteiras proibidas sem decisao explicita

- Backend.
- Banco.
- Migrations.
- Seeds.
- `requestJson`.
- Payload.
- Salvamento.
- Exclusao.
- PDF.
- Assinatura.
- Permissoes.
- Autenticacao.
- `frontend/index.html`.
- PostgreSQL.

## 14. Avaliacao dos modulos candidatos para proxima rodada

### Editor de Textos

- Potencial real para reduzir `frontend/app.js`: alto.
- Risco: medio.
- Modulo passivo: sim.
- Extracao anterior: sim.
- Teste manual claro: sim.
- Exige contrato especifico: sim.
- Decisao: pausar a rodada atual e consolidar antes de novo recorte.

### Ficha Pessoal

- Potencial real para reduzir `frontend/app.js`: medio/alto, mas com superficie muito ampla.
- Risco: alto.
- Modulo passivo: apenas namespaces parciais.
- Extracao anterior: nao nesta rodada.
- Teste manual claro: dificil.
- Exige contrato especifico: sim.
- Decisao: pausar e observar.

### Prestadores

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: sim.
- Extracao anterior: sim, em lista/selecao visual.
- Teste manual claro: sim.
- Exige contrato especifico: sim.
- Decisao: observar e so avancar com novo contrato pequeno.

### Convênios e Planos

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: sim.
- Extracao anterior: sim, em listas, shell visual e leitura documental.
- Teste manual claro: sim.
- Exige contrato especifico: sim.
- Decisao: observar e manter consolidado.

### Preferencias / Configuracoes

- Potencial real para reduzir `frontend/app.js`: baixo neste momento.
- Risco: baixo.
- Modulo passivo: sim.
- Extracao anterior: sim.
- Teste manual claro: sim.
- Exige contrato especifico: apenas se houver novo recorte.
- Decisao: manter como referencia consolidada.

### Usuarios / Seguranca

- Potencial real para reduzir `frontend/app.js`: medio, mas sensivel.
- Risco: alto.
- Modulo passivo: nao consolidado aqui.
- Extracao anterior: nao.
- Teste manual claro: existe, mas sensivel.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Agenda principal

- Potencial real para reduzir `frontend/app.js`: alto, mas altamente acoplado.
- Risco: alto/critico.
- Modulo passivo: nao consolidado.
- Extracao anterior: nao.
- Teste manual claro: complexo.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Conta Corrente

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: nao consolidado.
- Extracao anterior: nao.
- Teste manual claro: possivel, mas sensivel.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Relatorios

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: alto/critico.
- Modulo passivo: nao consolidado.
- Extracao anterior: nao.
- Teste manual claro: amplo.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Indices Financeiros

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: nao consolidado.
- Extracao anterior: nao.
- Teste manual claro: limitado.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Proteticos / Tabela de Servicos de Protese

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: nao consolidado.
- Extracao anterior: nao.
- Teste manual claro: possivel.
- Exige contrato especifico: sim.
- Decisao: observar.

### Anamnese

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: parcial.
- Extracao anterior: nao nesta rodada.
- Teste manual claro: dificil.
- Exige contrato especifico: sim.
- Decisao: pausar.

### Medicamentos

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: parcial.
- Extracao anterior: nao nesta rodada.
- Teste manual claro: existe.
- Exige contrato especifico: sim.
- Decisao: observar.

### Cadastros Gerais / Tabelas auxiliares

- Potencial real para reduzir `frontend/app.js`: medio.
- Risco: medio.
- Modulo passivo: variavel.
- Extracao anterior: nao.
- Teste manual claro: sim.
- Exige contrato especifico: sim.
- Decisao: observar.

## 15. Critérios para escolher o proximo recorte

- Reducao real de `frontend/app.js`.
- Fronteira tecnica pequena e clara.
- Possibilidade de wrapper/fachada.
- Teste manual praticavel.
- Ausencia de toque em salvamento, PDF, assinatura, payload, `requestJson`, backend ou banco.
- Manutencao de backup controlado.

## 16. Recomendacao final

Consolidar a rodada atual do Editor de Textos e nao abrir novo recorte imediatamente sem uma fronteira nova e pequena.

## 17. Proxima etapa recomendada

Fazer nova revisao estrategica antes de abrir um novo recorte.

## 18. Commit seletivo obrigatorio

Se esta revisao for confirmada, o commit deve incluir apenas:

- `docs/fase_2c_revisao_geral_pos_editor_textos_tres_extracoes.md`
- `docs/11_roadmap_desenvolvimento.md`

## 19. Registro para roadmap

- Revisao geral da Fase 2C apos tres extracoes reais do Editor de Textos.
- Consolidacao dos resultados da Fase 2C.
- Decisao final: `F2C-GERAL-E`.
- Proxima etapa recomendada: nova revisao estrategica antes de novo recorte.
- Confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
