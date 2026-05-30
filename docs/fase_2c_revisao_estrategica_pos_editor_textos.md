# Revisao estrategica - Fase 2C apos consolidacao do Editor de Textos

## 1. Objetivo da revisao estrategica

Definir a direcao da Fase 2C depois da consolidacao da rodada do Editor de Textos, usando os resultados obtidos para decidir se o proximo passo deve continuar no mesmo modulo, mudar de modulo ou pausar a fase para nova avaliacao.

## 2. Contexto da Fase 2C

- A Fase 2C foi criada para permitir extracoes reais de `frontend/app.js` com reducao real de monolitos.
- A rodada mais recente foi o Editor de Textos.
- A rodada do Editor de Textos ja foi consolidada em revisao geral documental.
- A decisao de origem desta revisao e `F2C-GERAL-E`.

## 3. Resultado consolidado da rodada do Editor de Textos

- Foram feitas e validadas tres extracoes reais:
  - bootstrap/shell visual;
  - toolbar visual;
  - painel lateral/listagem visual.
- A rodada mostrou que a estrategia de reducao real com backup, fachada/wrapper, teste manual e commit seletivo funciona no projeto atual.
- `frontend/app.js` foi reduzido de forma real nas tres extracoes.

## 4. O que a Fase 2C provou ate agora

- E possivel extrair blocos visuais reais de `frontend/app.js` sem alterar backend ou banco.
- E possivel manter fallback/wrapper para reduzir risco.
- E possivel validar manualmente o recorte antes de seguir.
- E possivel registrar backups controlados e commits seletivos para cada passo.

## 5. Beneficios observados

- Reducao real de `frontend/app.js`.
- Backup antes da alteracao.
- Fachada/wrapper.
- Validacao manual.
- Commit seletivo.
- Roadmap atualizado a cada passo.
- Controle de risco por fronteira pequena.

## 6. Riscos observados

- Sequencia longa de documentos.
- Necessidade de pausas estrategicas.
- Risco de continuar em um modulo ate encostar em areas sensiveis.
- Risco de tocar backend, banco ou payload sem decisao explicita.

## 7. Estado atual dos principais modulos

### Editor de Textos

- Potencial de reducao real de `frontend/app.js`: alto.
- Risco: medio.
- Modulo passivo: sim.
- Historico de extracoes: sim, tres extracoes reais.
- Teste manual possivel: sim.
- Status: ficar em observacao / consolidado, sem novo recorte automatico.

### Ficha Pessoal

- Potencial de reducao real de `frontend/app.js`: medio/alto.
- Risco: alto.
- Modulo passivo: parcial.
- Historico de extracoes: nao nesta rodada.
- Teste manual possivel: dificil.
- Status: pausar.

### Prestadores

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: sim.
- Historico de extracoes: sim, lista e selecao visual.
- Teste manual possivel: sim.
- Status: observar.

### Convênios e Planos

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: sim.
- Historico de extracoes: sim, listas, shell e validacoes documentais.
- Teste manual possivel: sim.
- Status: observar.

### Preferencias / Configuracoes

- Potencial de reducao real de `frontend/app.js`: baixo.
- Risco: baixo.
- Modulo passivo: sim.
- Historico de extracoes: consolidado.
- Teste manual possivel: sim.
- Status: referencia consolidada.

### Usuarios / Seguranca

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: parcial.
- Historico de extracoes: nao.
- Teste manual possivel: sim, mas sensivel.
- Status: pausar.

### Agenda principal

- Potencial de reducao real de `frontend/app.js`: alto.
- Risco: alto/critico.
- Modulo passivo: nao consolidado.
- Historico de extracoes: nao.
- Teste manual possivel: complexo.
- Status: pausar.

### Conta Corrente

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: nao consolidado.
- Historico de extracoes: nao.
- Teste manual possivel: possivel, mas sensivel.
- Status: pausar.

### Relatorios

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: alto/critico.
- Modulo passivo: nao consolidado.
- Historico de extracoes: nao.
- Teste manual possivel: amplo.
- Status: pausar.

### Indices Financeiros

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: nao consolidado.
- Historico de extracoes: nao.
- Teste manual possivel: limitado.
- Status: pausar.

### Proteticos / Tabela de Servicos de Protese

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: nao consolidado.
- Historico de extracoes: nao.
- Teste manual possivel: possivel.
- Status: observar.

### Anamnese

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: alto.
- Modulo passivo: parcial.
- Historico de extracoes: nao nesta rodada.
- Teste manual possivel: dificil.
- Status: pausar.

### Medicamentos

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: medio/alto.
- Modulo passivo: parcial.
- Historico de extracoes: nao nesta rodada.
- Teste manual possivel: sim.
- Status: observar.

### Cadastros Gerais / Tabelas auxiliares

- Potencial de reducao real de `frontend/app.js`: medio.
- Risco: medio.
- Modulo passivo: variavel.
- Historico de extracoes: nao nesta rodada.
- Teste manual possivel: sim.
- Status: observar.

## 8. Para cada modulo, avaliacao sintetica

- Editor de Textos: avancar apenas com novo contrato especifico se surgir bloco visual claro.
- Ficha Pessoal: pausar.
- Prestadores: observar e so avancar com novo contrato pequeno.
- Convênios e Planos: observar e manter consolidado.
- Preferencias / Configuracoes: manter como referencia consolidada.
- Usuarios / Seguranca: pausar.
- Agenda principal: pausar.
- Conta Corrente: pausar.
- Relatorios: pausar.
- Indices Financeiros: pausar.
- Proteticos / Tabela de Servicos de Protese: observar.
- Anamnese: pausar.
- Medicamentos: observar.
- Cadastros Gerais / Tabelas auxiliares: observar.

## 9. Critérios para a proxima implementacao

- Haver reducao real de `frontend/app.js`.
- Haver fronteira tecnica pequena e clara.
- Haver contrato especifico antes de implementar.
- Haver backup antes da alteracao.
- Haver fallback/wrapper quando possivel.
- Nao tocar em backend, banco, payload, `requestJson`, salvamento, PDF, assinatura ou permissões.
- Haver teste manual claro.
- Haver commit seletivo e roadmap.

## 10. Critérios para obrigar nova pausa estrategica

- Se o novo recorte encostar em handlers sensiveis.
- Se tocar backend, banco, payload, `requestJson` ou salvamento.
- Se a fronteira ficar ampla demais.
- Se nao houver reducao real de `frontend/app.js`.
- Se o teste manual nao for claro.
- Se o risco subir acima do controlavel.

## 11. Recomendaçao final

Encerrar a rodada atual do Editor de Textos como consolidada e abrir uma nova matriz operacional curta para escolher o proximo modulo.

## 12. Proxima etapa recomendada

Abrir nova matriz operacional curta da Fase 2C para escolher o proximo modulo.

## 13. Commit seletivo obrigatorio

Se esta revisao for confirmada, o commit deve incluir apenas:

- `docs/fase_2c_revisao_estrategica_pos_editor_textos.md`
- `docs/11_roadmap_desenvolvimento.md`

## 14. Registro para roadmap

- Revisao estrategica pos-rodada do Editor de Textos.
- Origem na decisao `F2C-GERAL-E`.
- Consolidacao da rodada do Editor de Textos.
- Decisao final: `F2C-ESTRAT-D`.
- Proxima etapa recomendada: abrir nova matriz operacional curta da Fase 2C.
- Confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
