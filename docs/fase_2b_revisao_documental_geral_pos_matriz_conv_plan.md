# Revisao documental geral - Fase 2B apos matriz Convênios e Planos

## 1. Objetivo da revisao documental geral

- Consolidar o estado atual da Fase 2B depois da matriz comparativa pos `Convênios e Planos`.
- Registrar o que ja foi validado, o que permanece pausado, os riscos remanescentes e os criterios de retomada.
- A revisao e somente documental.

## 2. Contexto da pausa tecnica da Fase 2B

- A Fase 2B tecnica ficou pausada apos a decisao `MATRIZ-POS-CONV-C`.
- A conclusao da matriz foi que nao existe, neste momento, uma frente nova com risco suficientemente baixo para avancar automaticamente.
- A maior parte das frentes restantes ficou entre risco medio-alto e critico.

## 3. Decisao de origem

- `MATRIZ-POS-CONV-C`

## 4. Commit de origem

- `bb38b44f290bb03c16b9ad85c5c56697f3c81698`

## 5. Estado consolidado da Fase 2B

- `Preferências / Configurações` ficou consolidada como frente mais controlada, mas ja pausada e sem novo recorte automatico.
- `Prestadores` ficou parcialmente validada e pausada.
- `Convênios e Planos` ficou parcialmente validada e pausada.
- O restante das frentes permanece em avaliacao documental ou com risco alto/critico.
- Nenhum codigo ou banco foi alterado nesta etapa documental.

## 6. Linha do tempo resumida das frentes recentes

### Preferências / Configurações

- Houve contrato, implementacoes minimas e validacoes manuais em recortes visuais/localizados.
- A frente foi consolidada como a mais controlada entre as moduladas, mas nao deve ser retomada automaticamente.

### Prestadores

- Houve contrato profundo, implementacao minima, validacao manual e decisao de pausa.
- A frente ficou parcialmente validada e deve permanecer pausada ate nova auditoria/contrato profundo.

### Convênios e Planos

- Houve contrato profundo, contrato especifico, microcontratos, implementacao minima, validacao manual e decisao final de pausa.
- A frente ficou parcialmente validada e pausada apos `CONVPLAN-SHELL-DEC-C`.

### Matriz pos Convênios e Planos

- A matriz comparativa foi aberta apos a pausa da frente `Convênios e Planos`.
- A decisao final foi `MATRIZ-POS-CONV-C`.
- A Fase 2B tecnica permaneceu pausada por ora.

## 7. Frentes consolidadas

- `Preferências / Configurações` como referencia consolidada e pausada.
- `Prestadores` como frente parcialmente validada e pausada.
- `Convênios e Planos` como frente parcialmente validada e pausada.

## 8. Frentes parcialmente validadas

- `Prestadores`
- `Convênios e Planos`
- `Preferências / Configurações` permanece como referencia consolidada, mas sem novo avanço automatico.

## 9. Frentes pausadas

- `Preferências / Configurações`
- `Prestadores`
- `Convênios e Planos`
- `Agenda principal`
- `Anamnese`
- `Editor de Texto`
- `Medicamentos`

## 10. Frentes nao recomendadas para avanco imediato

- `Conta Corrente`
- `Relatórios`
- `Índices Financeiros`
- `Usuários / Segurança`
- `Agenda principal`
- `Anamnese`
- `Editor de Texto`
- `Medicamentos`
- `Cadastros Gerais / Tabelas auxiliares`, salvo nova delimitacao documental
- qualquer frente com forte dependencia de `requestJson`, payload, salvamento, exclusao, permissões, backend ou banco

## 11. Frentes que exigem contrato profundo antes de qualquer recorte

- `Prestadores`
- `Convênios e Planos`
- `Conta Corrente`
- `Relatórios`
- `Índices Financeiros`
- `Usuários / Segurança`
- `Editor de Texto`
- `Medicamentos`
- `Anamnese`
- `Agenda principal`
- `Cadastros Gerais / Tabelas auxiliares`, quando houver novo avanço

## 12. Frentes que exigem microcontrato antes de qualquer implementacao

- `Convênios e Planos`
- `Prestadores`
- qualquer outro helper visual isolavel que venha a ser apontado em nova revisão

## 13. Principais riscos identificados

- `requestJson`
- `payload`
- `salvamento`
- `exclusão`
- `permissões`
- `backend`
- `banco`
- `calendário/faturamento/agenda`
- `seleção funcional`
- `eventos/wiring`

## 14. Critérios mínimos para retomar uma frente técnica

- Existir documento de contrato profundo ou microcontrato claramente isolado.
- Haver fronteira funcional e visual bem definida.
- O risco não deve exigir abertura imediata de backend, banco, payload ou salvamento.
- O comportamento de fallback deve estar claramente preservado.
- O usuário deve ter validado manualmente a etapa anterior quando aplicável.

## 15. Critérios para pausar uma frente

- Se a fronteira encostar em `requestJson`, payload, salvamento, exclusão, permissões, backend ou banco sem contrato claro.
- Se a seleção funcional estiver acoplada a estado ou fluxo remoto.
- Se a frente for sensível o suficiente para exigir mais uma matriz comparativa.
- Se houver regressão visual ou funcional percebida na validação anterior.

## 16. Critérios para escolher entre as modalidades

- `novo microcontrato`: usar quando existir um helper visual/local claramente isolavel e de baixo risco.
- `contrato profundo`: usar quando a fronteira for ainda incerta, mas existir um bloco pequeno possivelmente seguro.
- `matriz comparativa`: usar quando houver varias frentes candidatas e necessidade de priorizacao por risco relativo.
- `revisao documental`: usar quando a fase precisar consolidar estado, riscos e limites sem novo recorte.
- `implementação mínima`: usar apenas quando o contrato e a fronteira ja estiverem suficientemente fechados.

## 17. Fontes de verdade para a próxima retomada

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_matriz_comparativa_pos_convenios_planos.md`
- `docs/fase_2b_convenios_planos_decisao_pos_validacao_shell_visual_containers.md`
- `docs/fase_2b_convenios_planos_validacao_shell_visual_containers.md`
- `docs/fase_2b_convenios_planos_implementacao_shell_visual_containers.md`
- `docs/fase_2b_convenios_planos_microcontrato_shell_visual.md`
- `docs/fase_2b_convenios_planos_microcontrato_selecao_visual.md`
- `docs/fase_2b_convenios_planos_decisao_pos_validacao_render_listas.md`
- `docs/fase_2b_prestadores_decisao_pos_validacao_lista_selecao_visual.md`
- `docs/fase_2b_prestadores_validacao_lista_selecao_visual.md`
- `docs/fase_2b_prestadores_implementacao_lista_selecao_visual.md`
- `docs/fase_2b_prestadores_contrato_profundo_recorte_remanescente.md`
- `docs/fase_2b_matriz_curta_pos_prestadores_lista_selecao.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 18. Recomendações de governança

- Nao retomar `Convênios e Planos` automaticamente.
- Nao retomar `Prestadores` automaticamente.
- Nao mexer em `Preferências / Configurações` sem nova matriz/contrato.
- Nao tocar backend ou banco sem decisao explicita.
- Nao tocar PostgreSQL nesta trilha.
- Preservar a blindagem textual/mojibake em qualquer novo documento.
- Qualquer retomada deve vir com um contrato novo e bem delimitado.

## 19. Proxima decisao recomendada

- Manter a Fase 2B tecnica pausada.
- A próxima decisão só deve ser tomada após nova análise documental ou nova autorização explícita do usuário.

## 20. Commit seletivo obrigatorio

- Se esta etapa for tratada como somente documental, o commit deve incluir apenas este documento e o roadmap.

## 21. Registro para roadmap

- A revisao documental geral da Fase 2B foi criada após a matriz comparativa pos `Convênios e Planos`.
- A origem foi `MATRIZ-POS-CONV-C`.
- A pausa técnica da Fase 2B foi confirmada.
- Nenhum código ou banco foi alterado nesta etapa documental.
- A próxima decisão recomendada é manter a pausa até nova autorização ou nova análise documental.
