# Fase 2C - Matriz operacional curta apos revisao geral de Prestadores

## 1. Objetivo

- Escolher o proximo recorte real da Fase 2C apos a revisao geral consolidada das rodadas de `Editor de Textos` e `Prestadores`.
- Priorizar reducao real de `frontend/app.js` com risco controlado.
- Evitar novo avanço sem fronteira clara, backup e teste manual possivel.

## 2. Contexto da revisao geral pos-Prestadores

- A Fase 2C consolidou duas rodadas reais:
  - `Editor de Textos`
  - `Prestadores`
- A consolidacao provou que a estrategia funciona quando ha fronteira clara e fachada/wrapper.
- O estado atual pede cautela, pois muitos candidatos restantes estao acoplados a fluxo remoto, banco, permissões ou financeiro.

## 3. Decisao de origem

- A decisao de origem e `F2C-GERAL2-E`.

## 4. Estado consolidado da Fase 2C

- `Editor de Textos` foi reduzido em tres extracoes reais validas e consolidado.
- `Prestadores` foi reduzido em extracao real validada e consolidado.
- `frontend/app.js` ja encolheu de forma real em ambas as rodadas.
- Os padroes que funcionaram foram backup, fachada/wrapper, fallback, teste manual e commit seletivo.

## 5. Criterios da Fase 2C

- Reducao real de `frontend/app.js`.
- Fronteira clara.
- Backup controlado.
- Fachada/wrapper quando possivel.
- Fallback quando aplicavel.
- Teste manual claro.
- Commit seletivo.
- Roadmap atualizado.
- Blindagem textual/mojibake respeitada.

## 6. Candidatos avaliados

### 6.1 Editor de Textos

- Estado atual: consolidado.
- Arquivos provaveis: `frontend/app.js` e `frontend/js/modules/editor_textos_bootstrap.js`.
- Extracao anterior: sim, tres extracoes reais.
- Modulo passivo: sim.
- Reducao real de `frontend/app.js`: ja ocorreu.
- Backup exigido: sim, se houver novo bloco.
- Contrato especifico: sim, se houver novo recorte.
- Risco: medio.
- Tipo de risco: visual/local/monolito residual.
- Teste manual possivel: sim.
- Plano de retorno: backup controlado.
- Acao: observar.

### 6.2 Prestadores

- Estado atual: consolidado.
- Arquivos provaveis: `frontend/app.js` e `frontend/js/modules/prestadores.js`.
- Extracao anterior: sim, listagem/painel + filtros locais simples.
- Modulo passivo: sim.
- Reducao real de `frontend/app.js`: ja ocorreu.
- Backup exigido: sim, se houver novo bloco.
- Contrato especifico: sim.
- Risco: medio controlado.
- Tipo de risco: visual/local com acoplamento restante.
- Teste manual possivel: sim.
- Plano de retorno: backup controlado.
- Acao: observar.

### 6.3 Ficha Pessoal

- Estado atual: fortemente acoplado.
- Arquivos provaveis: `frontend/app.js`, `frontend/js/modules/anamnese.js`, rotas de backend.
- Extracao anterior: nao, apenas contrato profundo e namespace passivo.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: ainda nao ha recorte pequeno seguro.
- Backup exigido: sim.
- Contrato especifico: sim, rigido.
- Risco: alto.
- Tipo de risco: core transversal, backend, anamnese, agenda e financeiro.
- Teste manual possivel: dificil sem escopo pequeno real.
- Plano de retorno: backup manual, sem tocar no namespace passivo vazio.
- Acao: pausar.

### 6.4 Convênios e Planos

- Estado atual: parcialmente validado e em observacao.
- Arquivos provaveis: `frontend/app.js`, `frontend/js/modules/convenios-planos.js`.
- Extracao anterior: sim, listagem/render, shell e microcontratos.
- Modulo passivo: sim.
- Reducao real de `frontend/app.js`: ja ocorreu parcialmente.
- Backup exigido: sim.
- Contrato especifico: sim.
- Risco: medio-alto.
- Tipo de risco: seleção funcional, calendario/faturamento e fluxos sensiveis.
- Teste manual possivel: sim, mas com risco de retorno.
- Plano de retorno: backup controlado.
- Acao: observar.

### 6.5 Preferências / Configurações

- Estado atual: consolidada como referencia.
- Arquivos provaveis: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Extracao anterior: sim, validada.
- Modulo passivo: sim.
- Reducao real de `frontend/app.js`: ja ocorreu.
- Backup exigido: apenas se houver novo bloco.
- Contrato especifico: so se houver novo recorte.
- Risco: baixo.
- Tipo de risco: visual/local.
- Teste manual possivel: sim.
- Plano de retorno: backup controlado.
- Acao: observar.

### 6.6 Usuários / Segurança

- Estado atual: area sensivel.
- Arquivos provaveis: `frontend/app.js`, modulos de usuarios/segurança, possivel backend.
- Extracao anterior: parcial e nao consolidada como bloco unico novo.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel, mas com risco alto.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: alto.
- Tipo de risco: permissões, autenticação, vínculo usuario/prestador.
- Teste manual possivel: dificil e sensivel.
- Plano de retorno: backup completo.
- Acao: pausar.

### 6.7 Agenda principal

- Estado atual: area sensivel.
- Arquivos provaveis: `frontend/app.js`, modulos de agenda.
- Extracao anterior: parcial.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: critico.
- Tipo de risco: calendarios, eventos e integracoes.
- Teste manual possivel: complexo.
- Plano de retorno: backup completo.
- Acao: pausar.

### 6.8 Conta Corrente

- Estado atual: area sensivel.
- Arquivos provaveis: `frontend/app.js`, financeiro.
- Extracao anterior: nao consolidada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: alto.
- Tipo de risco: financeiro, payload, banco e relatórios.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: pausar.

### 6.9 Relatórios

- Estado atual: area sensivel.
- Arquivos provaveis: `frontend/app.js`, filtros e exportacoes.
- Extracao anterior: nao consolidada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: alto.
- Tipo de risco: filtros, consultas, PDF/exportacao e backend.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: pausar.

### 6.10 Índices Financeiros

- Estado atual: area sensivel.
- Arquivos provaveis: `frontend/app.js`, calculos financeiros.
- Extracao anterior: nao consolidada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: alto.
- Tipo de risco: financeiro, calculos e banco.
- Teste manual possivel: dificil.
- Plano de retorno: backup completo.
- Acao: pausar.

### 6.11 Protéticos / Tabela de Serviços de Prótese

- Estado atual: area moderadamente sensivel.
- Arquivos provaveis: `frontend/app.js`, tabela e historico.
- Extracao anterior: nao consolidada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: medio-alto.
- Tipo de risco: tabelas, payload e banco.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: observar.

### 6.12 Anamnese

- Estado atual: area parcialmente mapeada.
- Arquivos provaveis: `frontend/app.js`, `frontend/js/modules/anamnese.js`, backend.
- Extracao anterior: contrato profundo e namespace passivo apenas.
- Modulo passivo: sim.
- Reducao real de `frontend/app.js`: possivel, mas nao consolidada.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: medio-alto.
- Tipo de risco: questionarios, respostas e backend.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: observar.

### 6.13 Medicamentos

- Estado atual: parcialmente mapeado.
- Arquivos provaveis: `frontend/app.js`, cadastros auxiliares.
- Extracao anterior: nao consolidada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: medio-alto.
- Tipo de risco: cadastro, payload e integracao auxiliar.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: observar.

### 6.14 Cadastros Gerais / Tabelas auxiliares

- Estado atual: moderadamente sensivel.
- Arquivos provaveis: `frontend/app.js`, modulos de auxiliares.
- Extracao anterior: parcial e espalhada.
- Modulo passivo: parcial.
- Reducao real de `frontend/app.js`: possivel.
- Backup exigido: sim.
- Contrato especifico: obrigatorio.
- Risco: medio.
- Tipo de risco: tabelas, listas e integrações auxiliares.
- Teste manual possivel: moderado.
- Plano de retorno: backup completo.
- Acao: observar.

## 7. Tabela comparativa

| Candidato | Reducao real de app.js | Risco | Modulo passivo | Extracao anterior | Teste manual claro | Contrato especifico | Acao |
|---|---|---:|---|---|---|---|---|
| Editor de Textos | baixa agora | medio | sim | sim | sim | sim | observar |
| Prestadores | baixa agora | medio controlado | sim | sim | sim | sim | observar |
| Ficha Pessoal | alta, mas acoplada | alto | parcial | nao consolidada | dificil | obrigatorio | pausar |
| Convênios e Planos | media | medio-alto | sim | sim | sim | sim | observar |
| Preferências / Configurações | baixa | baixo | sim | sim | sim | opcional | observar |
| Usuários / Segurança | media | alto | parcial | parcial | dificil | obrigatorio | pausar |
| Agenda principal | alta | critico | parcial | parcial | complexo | obrigatorio | pausar |
| Conta Corrente | media | alto | parcial | nao consolidada | moderado | obrigatorio | pausar |
| Relatórios | media | alto | parcial | nao consolidada | moderado | obrigatorio | pausar |
| Índices Financeiros | media | alto | parcial | nao consolidada | dificil | obrigatorio | pausar |
| Protéticos / Prótese | media | medio-alto | parcial | nao consolidada | moderado | obrigatorio | observar |
| Anamnese | media | medio-alto | sim | parcial | moderado | obrigatorio | observar |
| Medicamentos | media | medio-alto | parcial | nao consolidada | moderado | obrigatorio | observar |
| Cadastros Gerais | media | medio | parcial | parcial | moderado | obrigatorio | observar |

## 8. Ranking dos melhores proximos recortes

1. Nenhum candidato supera claramente o ganho já consolidado com risco suficientemente baixo.
2. `Prestadores` e `Editor de Textos` já estão consolidados e nao pedem novo recorte imediato.
3. `Preferências / Configurações` continua a mais controlada, mas e referencia consolidada, nao um novo alvo.
4. Entre os candidatos ainda observaveis, `Anamnese` e `Cadastros Gerais` ficam mais próximos de futuros contratos, mas ainda pedem nova analise.

## 9. Decisao final

- A decisao final registrada e `F2C-CURTA3-E`.
- A Fase 2C nao deve abrir novo recorte agora.
- O melhor caminho e consolidar e manter em observacao até nova autorização ou novo contexto.

## 10. Módulo recomendado

- Nenhum modulo novo imediatamente.

## 11. Fluxo recomendado

- Manutenção/correções apenas, sem nova implementação da Fase 2C por ora.

## 12. Risco classificado

- Risco classificado da decisão: medio controlado.

## 13. Próximo documento obrigatório

- Se houver retomada, o próximo documento deve ser um novo contrato especifico ou uma nova matriz operacional curta, conforme a próxima autorização.

## 14. Arquivos prováveis

- `frontend/app.js`
- `frontend/js/modules/*.js`
- `docs/11_roadmap_desenvolvimento.md`
- futuro documento documental da próxima rodada

## 15. Arquivos proibidos

- `frontend/index.html`
- backend
- banco
- schema/migrations/seeds/endpoints
- `.env`
- scripts de migração
- dumps/backups fora da pasta controlada

## 16. Backup futuro necessário

- Se a Fase 2C for retomada com implementacao real, um backup controlado dos arquivos afetados sera necessario antes de qualquer alteracao.

## 17. Teste manual esperado

- Nesta decisão, nao ha novo teste manual de codigo.
- O teste manual continua sendo a referencia das rodadas ja consolidadas.

## 18. Commit seletivo obrigatório

- O commit desta etapa documental deve incluir somente:
  - [`docs/fase_2c_matriz_operacional_curta_pos_prestadores.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\fase_2c_matriz_operacional_curta_pos_prestadores.md)
  - [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)

## 19. Registro para roadmap

- Registrar a abertura da nova matriz operacional curta pos-Prestadores.
- Registrar a origem `F2C-GERAL2-E`.
- Registrar a consolidacao das rodadas `Editor de Textos` e `Prestadores`.
- Registrar a decisao final `F2C-CURTA3-E`.
- Registrar a recomendacao de manutenção/correções apenas neste momento.
- Registrar a confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
