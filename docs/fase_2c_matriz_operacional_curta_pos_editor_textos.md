# Fase 2C - Matriz operacional curta apos a rodada inicial do Editor de Textos

## 1. Objetivo

Escolher o proximo recorte real da Fase 2C com foco em reducao real de `frontend/app.js`, fronteira clara, teste manual simples, backup possivel e baixa chance de tocar backend/banco.

## 2. Contexto da rodada inicial do Editor de Textos

- A rodada inicial do Editor de Textos foi consolidada como concluida e validada.
- Duas extracoes reais ja foram implementadas e aprovadas:
  - bootstrap/shell visual;
  - toolbar visual.
- A rodada foi encerrada documentalmente pela decisao `F2C-EDITOR-REV-E`.
- O objetivo desta matriz curta e abrir a proxima fronteira sem perder o ganho ja obtido.

## 3. Motivo da nova matriz operacional curta

- A rodada inicial do Editor de Textos ja entregou reducao real.
- Agora e necessario decidir se a proxima extracao continua no Editor de Textos ou se a Fase 2C deve trocar de modulo.
- A decisao precisa considerar risco, fronteira e capacidade de reducao real de monolito.

## 4. Critérios da Fase 2C

- reduzir `frontend/app.js` de forma real;
- ter fronteira visual clara;
- permitir backup antes da alteracao;
- permitir teste manual simples;
- preservar fachada/wrapper quando possivel;
- evitar backend, banco, payload, `requestJson`, salvamento, PDF e assinatura;
- evitar helper sem consumo e arquivo vazio;
- evitar mistura de multiplos fluxos sensiveis.

## 5. Candidatos avaliados

### 5.1 Editor de Textos

**Estado atual**

- Rodada inicial consolidada.
- Bootstrap/shell visual validado.
- Toolbar visual validada.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`

**Ja houve extracao anterior**

- Sim, duas extracoes reais.

**Ja existe modulo passivo**

- Sim, `window.BranaEditorTextosBootstrapModule` e `window.BranaEditorTextosToolbarModule`.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Sim, se houver nova fronteira visual limpa.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- medio controlado, podendo subir se encostar em handlers sensiveis.

**Tipo de risco**

- DOM, selecao/caret, eventos/wiring, model-first e reancoragem.

**Teste manual possivel**

- Sim, visual e simples se o recorte for apenas de interface.

**Plano de retorno provavel**

- usar backup controlado da etapa e a fachada em `app.js`.

**Avanco sugerido**

- observar como candidato prioritario, mas somente com contrato pequeno e muito claro.

### 5.2 Ficha Pessoal

**Estado atual**

- Classificada como modulo comum/core.
- Contrato profundo mostrou forte acoplamento.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- rotas de cadastros/anamnese apenas por leitura futura, se necessario.

**Ja houve extracao anterior**

- Nao houve extracao real segura.

**Ja existe modulo passivo**

- Apenas namespaces auxiliares de anamnese; o shell principal continua acoplado.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Baixa no curto prazo, porque o contrato profundo indicou superficie grande e acoplada.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim, extremamente rigido.

**Risco estimado**

- alto.

**Tipo de risco**

- backend, banco, model-first, reancoragem, agenda e financeiro no mesmo fluxo.

**Teste manual possivel**

- Existe, mas tende a ser amplo demais para esta rodada curta.

**Plano de retorno provavel**

- backup da etapa e reversao documental/manual, se vier a existir.

**Avanco sugerido**

- pausar como candidato imediato.

### 5.3 Prestadores

**Estado atual**

- Lista e selecao visual ja foram validadas.
- Frente parcial, com avancos pequenos ja consolidados.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/prestadores.js`

**Ja houve extracao anterior**

- Sim.

**Ja existe modulo passivo**

- Sim, `window.BranaPrestadoresModule`.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Sim, mas os proximos passos tendem a subir para filtros, shell misto e acoes mais sensiveis.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- medio-alto controlado.

**Tipo de risco**

- eventos/wiring, filtros, shell, agenda, convenios e comissoes.

**Teste manual possivel**

- Sim, mas o beneficio incremental agora e menor.

**Plano de retorno provavel**

- backup controlado da etapa.

**Avanco sugerido**

- manter em observacao; nao lidera a proxima rodada.

### 5.4 Convênios e Planos

**Estado atual**

- Renderizacao e shell visual ja foram parcialmente validados.
- Frente parcialmente consolidada e pausada.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/convenios-planos.js`

**Ja houve extracao anterior**

- Sim.

**Ja existe modulo passivo**

- Sim, com helpers de lista/render e shell visual.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas os proximos passos ja encostam em selecao e areas mais sensiveis.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- medio-alto controlado.

**Tipo de risco**

- selecao funcional, shell, eventos e possivel agenda/faturamento.

**Teste manual possivel**

- Sim, mas a fronteira segura ficou mais estreita.

**Plano de retorno provavel**

- backup controlado da etapa.

**Avanco sugerido**

- permanecer em observacao; nao lidera a proxima rodada.

### 5.5 Preferências / Configurações

**Estado atual**

- Consolidada como frente estavel e referencia.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

**Ja houve extracao anterior**

- Sim, a frente ja foi estabilizada documentalmente.

**Ja existe modulo passivo**

- Sim.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Baixa como prioridade, porque a frente ja foi consolidada.

**Exigiria backup**

- Sim, se voltasse.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- baixo a medio, mas sem prioridade agora.

**Tipo de risco**

- estado/configuracao visual e possivel acoplamento com `sysOpt*`.

**Teste manual possivel**

- Sim, mas nao e o melhor uso da rodada atual.

**Plano de retorno provavel**

- manter como referencia.

**Avanco sugerido**

- ficar em observacao.

### 5.6 Usuários / Segurança

**Estado atual**

- Area sensivel.

**Arquivos provaveis**

- `frontend/app.js`
- rotinas de admin/seguranca.

**Ja houve extracao anterior**

- Nao relevante para a rodad atual.

**Ja existe modulo passivo**

- Existem modulos auxiliares de visual/modais, mas o fluxo principal continua sensivel.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas dificil de isolar.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- critico.

**Tipo de risco**

- permissões, autenticacao, persistencia e impacto de acesso.

**Teste manual possivel**

- Sim, mas exige muito mais cautela do que esta matriz curta comporta.

**Plano de retorno provavel**

- backup controlado e consolidacao documental.

**Avanco sugerido**

- pausar.

### 5.7 Agenda principal

**Estado atual**

- Area sensivel e com integrações.

**Arquivos provaveis**

- `frontend/app.js`
- modulos de agenda existentes.

**Ja houve extracao anterior**

- Nao para esta rodada.

**Ja existe modulo passivo**

- Existem helpers/modulos de agenda, mas o fluxo e amplo.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas com alto acoplamento.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- critico.

**Tipo de risco**

- calendário, eventos e integrações.

**Teste manual possivel**

- Sim, mas amplo e menos apropriado para esta matriz curta.

**Plano de retorno provavel**

- backup e verificacao manual extensa.

**Avanco sugerido**

- pausar.

### 5.8 Conta Corrente

**Estado atual**

- Area financeira sensivel.

**Arquivos provaveis**

- `frontend/app.js`
- rotinas financeiras.

**Ja houve extracao anterior**

- Nao relevante.

**Ja existe modulo passivo**

- Parcial/auxiliar, mas o fluxo principal permanece delicado.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas o risco financeiro e alto.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- critico.

**Tipo de risco**

- financeiro, payload, banco e relatórios.

**Teste manual possivel**

- Sim, mas nao e o melhor candidato agora.

**Plano de retorno provavel**

- backup controlado e validacao financeira.

**Avanco sugerido**

- pausar.

### 5.9 Relatórios

**Estado atual**

- Area de consultas/exportacoes sensivel.

**Arquivos provaveis**

- `frontend/app.js`
- rotinas de relatorio/exportacao.

**Ja houve extracao anterior**

- Nao para esta rodada.

**Ja existe modulo passivo**

- Pode haver helpers, mas o fluxo continua sensivel.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas tende a tocar filtros, exportacao e backend.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- critico.

**Tipo de risco**

- filtros, consultas, PDF/exportacao e backend.

**Teste manual possivel**

- Sim, mas amplo e menos indicado para o proximo passo.

**Plano de retorno provavel**

- backup e revisao documental.

**Avanco sugerido**

- pausar.

### 5.10 Índices Financeiros

**Estado atual**

- Area financeira delicada.

**Arquivos provaveis**

- `frontend/app.js`
- rotinas financeiras/indices.

**Ja houve extracao anterior**

- Nao relevante.

**Ja existe modulo passivo**

- Possivelmente auxiliar, mas nao como fronteira clara de rodad atual.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas alto risco.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- critico.

**Tipo de risco**

- financeiro, calculos, banco e integracao.

**Teste manual possivel**

- Sim, mas nao e o melhor candidato imediato.

**Plano de retorno provavel**

- backup e revisao documental.

**Avanco sugerido**

- pausar.

### 5.11 Protéticos / Tabela de Serviços de Prótese

**Estado atual**

- Area de tabelas e historico, sensivel.

**Arquivos provaveis**

- `frontend/app.js`
- modulos de proteticos existentes.

**Ja houve extracao anterior**

- Nao para esta rodada.

**Ja existe modulo passivo**

- Sim, ha modulos auxiliares relacionados.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas com risco mais alto.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- alto.

**Tipo de risco**

- tabelas, payload, banco e historico anterior.

**Teste manual possivel**

- Sim, mas menos simples do que o ideal para esta matriz curta.

**Plano de retorno provavel**

- backup controlado.

**Avanco sugerido**

- observar.

### 5.12 Anamnese

**Estado atual**

- Existe historico de helpers e descoberta de dados, mas a superficie principal segue sensivel.

**Arquivos provaveis**

- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- possiveis scripts/documentos de restauração/analise.

**Ja houve extracao anterior**

- Nao como recorte real desta Fase 2C.

**Ja existe modulo passivo**

- Sim, helpers e namespace auxiliares.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas com risco de tocar em dados e fluxos de cadastro.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- alto.

**Tipo de risco**

- dados de anamnese, perguntas/respostas, persistencia e restauracao.

**Teste manual possivel**

- Sim, mas não simples o suficiente para esta matriz curta.

**Plano de retorno provavel**

- backup e validacao separada.

**Avanco sugerido**

- pausar.

### 5.13 Medicamentos

**Estado atual**

- Area de cadastro e lista com alguma modularizacao auxiliar.

**Arquivos provaveis**

- `frontend/app.js`
- modulos de medicamentos existentes.

**Ja houve extracao anterior**

- Nao para esta rodada.

**Ja existe modulo passivo**

- Sim, ha namespace auxiliar.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Possivel, mas ainda com risco de fluxo funcional.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- medio-alto.

**Tipo de risco**

- cadastro, lista e possivel persistencia.

**Teste manual possivel**

- Sim.

**Plano de retorno provavel**

- backup e fachada.

**Avanco sugerido**

- pode ficar como alternativa, mas nao lidera.

### 5.14 Cadastros Gerais / Tabelas auxiliares

**Estado atual**

- Area ampla e heterogenea.

**Arquivos provaveis**

- `frontend/app.js`
- modulos auxiliares diversos.

**Ja houve extracao anterior**

- Parcialmente em outras frentes, nao como foco da rodada.

**Ja existe modulo passivo**

- Sim, em varias subareas.

**Possibilidade de reduzir `frontend/app.js` de forma real**

- Sim, mas depende muito do subfluxo escolhido.

**Exigiria backup**

- Sim.

**Exigiria contrato especifico**

- Sim.

**Risco estimado**

- medio-alto.

**Tipo de risco**

- varia conforme a tabela e o fluxo.

**Teste manual possivel**

- Sim, desde que o subfluxo seja bem pequeno.

**Plano de retorno provavel**

- backup controlado.

**Avanco sugerido**

- observar como alternativa secundaria.

## 6. Tabela comparativa

| Candidato | Reduz `frontend/app.js` de forma real | Fronteira clara | Módulo passivo | Backup possível | Teste manual simples | Risco | Situação |
|---|---|---|---|---|---|---|---|
| Editor de Textos | Sim | Sim, se o bloco for visual puro | Sim | Sim | Sim | médio controlado | Continuar com contrato específico |
| Ficha Pessoal | Dificilmente no curto prazo | Nao muito | Parcial | Sim | Nao muito | critico | Pausar |
| Prestadores | Sim, mas menor ganho agora | Media | Sim | Sim | Sim | medio-alto controlado | Observacao |
| Convênios e Planos | Sim, mas fronteira estreita | Media | Sim | Sim | Sim | medio-alto controlado | Observacao |
| Preferências / Configurações | Nao prioritario | Ja consolidada | Sim | Sim | Sim | baixo a medio | Referência |
| Usuários / Segurança | Sim, mas sensivel | Baixa | Parcial | Sim | Nao simples | critico | Pausar |
| Agenda principal | Sim, mas sensivel | Baixa | Parcial | Sim | Nao simples | critico | Pausar |
| Conta Corrente | Sim | Baixa | Parcial | Sim | Nao simples | critico | Pausar |
| Relatórios | Sim | Baixa | Parcial | Sim | Nao simples | critico | Pausar |
| Índices Financeiros | Sim | Baixa | Parcial | Sim | Nao simples | critico | Pausar |
| Protéticos | Sim | Media | Sim | Sim | Media | alto | Observacao |
| Anamnese | Sim | Baixa | Parcial | Sim | Nao simples | alto | Pausar |
| Medicamentos | Sim | Media | Sim | Sim | Media | medio-alto | Observacao |
| Cadastros Gerais | Sim | Variavel | Sim | Sim | Media | medio-alto | Observacao |

## 7. Ranking dos melhores proximos recortes

1. Editor de Textos - painel lateral/listagem visual
2. Editor de Textos - outro bloco visual complementar
3. Editor de Textos - acoes visuais simples
4. Prestadores - proximo fluxo real pequeno
5. Medicações / Cadastros Gerais como alternativa secundaria, se o subfluxo for pequeno

## 8. Decisao final

- Decisao final: `F2C-CURTA-A`
- Interpretacao: continuar no Editor de Textos com contrato especifico para painel lateral/listagem visual.
- Justificativa:
  - o Editor de Textos ja absorveu duas extracoes reais e validadas;
  - ainda ha superficie visual clara no proprio Editor de Textos, especialmente em torno de painel/listagem/abrir modelos;
  - a fronteira parece mais clara do que iniciar um novo modulo sensivel;
  - a reducao de `frontend/app.js` pode continuar real sem tocar em salvamento, PDF, assinatura, backend ou banco;
  - isso preserva a continuidade da rodada e respeita o ritmo conservador da Fase 2C.

## 9. Módulo recomendado

- Editor de Textos.

## 10. Fluxo recomendado

- Contrato especifico para painel lateral/listagem visual do Editor de Textos.

## 11. Risco classificado

- médio controlado.

## 12. Próximo documento obrigatório

- Documento de contrato especifico para painel lateral/listagem visual do Editor de Textos.

## 13. Arquivos prováveis

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`

## 14. Arquivos proibidos

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- `.env`
- scripts de migração
- dumps/backups fora da pasta controlada da etapa

## 15. Backup futuro necessário

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- qualquer novo módulo apenas se realmente existir para o recorte visual escolhido

## 16. Teste manual esperado

- Abrir o sistema normalmente.
- Entrar no Editor de Textos.
- Confirmar que o novo painel/listagem visual funciona como antes.
- Confirmar que a toolbar e a área de edição continuam estáveis.
- Recarregar a tela e reabrir o Editor de Textos.
- Verificar se a fronteira escolhida reduz `frontend/app.js` de forma real sem regressao visual.

## 17. Commit seletivo obrigatório

Arquivos alvo do commit seletivo desta etapa:

- `docs/fase_2c_matriz_operacional_curta_pos_editor_textos.md`
- `docs/11_roadmap_desenvolvimento.md`

## 18. Registro para roadmap

Registrar no roadmap:

- abertura da matriz operacional curta apos a rodada inicial do Editor de Textos;
- consolidacao das duas extracoes reais ja validadas;
- decisao final `F2C-CURTA-A`;
- módulo recomendado: Editor de Textos;
- fluxo recomendado: painel lateral/listagem visual;
- confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental;
- proximo passo recomendado.
