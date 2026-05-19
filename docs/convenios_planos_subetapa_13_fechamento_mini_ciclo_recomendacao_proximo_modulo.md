# Convênios e Planos — Subetapa 13 — Fechamento do mini ciclo e recomendação do próximo módulo

## 1. Objetivo do fechamento
Registrar o encerramento documental do mini ciclo de Convênios e Planos, consolidando o que foi mapeado sobre helpers, validações, wrappers reais, fallback local e limites de integração, e recomendar o próximo módulo mais seguro para a continuidade da modularização conservadora.

## 2. Resumo das subetapas concluídas em Convênios e Planos
O mini ciclo de Convênios e Planos foi conduzido de forma conservadora, começando por retomada documental e seguindo pela consolidação dos helpers puros, validações e wrappers reais.

Resumo prático:
- Subetapas 0 a 6: documentação da base, helpers puros e validações;
- Subetapa 7: consolidação dos wrappers/fallbacks reais no `app.js`;
- Subetapas 8 a 11: constatação de que os wrappers reais já existiam para normalização e que os wrappers de validação esperados não existiam no `app.js` atual;
- Subetapa 12: consolidação documental final das validações e wrappers reais;
- Subetapa 13: fechamento do mini ciclo e recomendação do próximo módulo.

## 3. Lista dos documentos criados neste mini ciclo
- `docs/convenios_planos_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_1_documental_normalize_text.md`
- `docs/convenios_planos_subetapa_2_documental_normalizar_codigo_registro.md`
- `docs/convenios_planos_subetapa_3_documental_normalizar_nome_convenio.md`
- `docs/convenios_planos_subetapa_4_documental_validar_nome_convenio.md`
- `docs/convenios_planos_subetapa_5_documental_normalizar_nome_plano.md`
- `docs/convenios_planos_subetapa_6_documental_validar_nome_plano.md`
- `docs/convenios_planos_subetapa_7_documental_wrappers_fallbacks_appjs.md`
- `docs/convenios_planos_subetapa_8_integracao_wrapper_codigo_registro.md`
- `docs/convenios_planos_subetapa_9_integracao_wrapper_nome_convenio.md`
- `docs/convenios_planos_subetapa_10_integracao_wrapper_nome_plano.md`
- `docs/convenios_planos_subetapa_11_integracao_wrapper_validar_nome_convenio.md`
- `docs/convenios_planos_subetapa_12_consolidacao_validacoes_wrappers_reais.md`
- este documento de fechamento

## 4. Confirmação de que o módulo JS já existia
Sim. `frontend/js/modules/convenios-planos.js` já existia antes do mini ciclo, com namespace passivo e helpers expostos.

## 5. Confirmação de que o namespace já existia
Sim. `window.BranaConveniosPlanosModule` já existia e é o namespace passivo do módulo.

## 6. Confirmação de que index.html já carregava o módulo
Sim. `frontend/index.html` já carregava `frontend/js/modules/convenios-planos.js` antes de `frontend/app.js`.

## 7. Helpers documentados
Os helpers documentados ao longo do mini ciclo foram:

- `normalizeText()`
- `normalizarCodigoRegistro()`
- `normalizarNomeConvenio()`
- `validarNomeConvenio()`
- `normalizarNomePlano()`
- `validarNomePlano()`

## 8. Wrappers reais existentes no app.js
Os wrappers reais existentes em `frontend/app.js` são:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Além disso, os consumidores diretos observados são:

- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`

## 9. Wrappers esperados que não existem
Não foram encontrados no `app.js` atual:

- `convPlanValidarNomeConvenioLocal(valor)`
- `convPlanValidarNomePlanoLocal(valor)`

## 10. Confirmar que criar wrappers novos de validação seria alteração funcional futura
Sim. Criar wrappers novos de validação seria uma alteração funcional nova, porque introduziria caminhos adicionais de integração entre `app.js` e o módulo passivo.

## 11. Confirmar que não é recomendado criar wrappers novos agora
Confirmado. Não é recomendado criar wrappers novos agora, pois a etapa atual já demonstrou que o `app.js` usa somente normalização local nos payloads e que as validações estruturadas permanecem apenas no módulo passivo.

## 12. Confirmar que não houve alteração funcional relevante neste mini ciclo, se aplicável
Sim. No fechamento documental, o quadro confirmado foi de preservação funcional: o `app.js` permaneceu com wrappers de normalização e fallback local, sem a introdução de wrappers novos de validação.

## 13. Confirmar que payloads foram preservados
Sim. Os payloads foram preservados.

## 14. Confirmar que salvamento foi preservado
Sim. O salvamento foi preservado.

## 15. Confirmar que exclusão foi preservada
Sim. A exclusão foi preservada.

## 16. Confirmar que API/requestJson foi preservado
Sim. API/requestJson foi preservado.

## 17. Confirmar que eventos, clique, duplo clique, seleção e renderização foram preservados
Sim. Eventos, clique, duplo clique, seleção e renderização foram preservados.

## 18. Confirmar que modais foram preservados
Sim. Os modais foram preservados.

## 19. Confirmar que vínculo convênio/plano foi preservado
Sim. O vínculo convênio/plano foi preservado.

## 20. Confirmar que pacientes, procedimentos, materiais, tabelas, preços, custos, reajustes e financeiro foram preservados
Sim. Nada disso foi alterado.

## 21. Confirmar que backend/banco/schema/migrations/endpoints foram preservados
Sim. Backend, banco, schema, migrations e endpoints foram preservados.

## 22. Risco residual de duplo clique
Permanece o histórico sensível de duplo clique, mas ele não foi alterado neste mini ciclo. O risco residual é o de futuras mudanças precisarem manter a mesma cautela, especialmente em telas com seleção e modais.

## 23. Risco residual de validações textuais/mensagens
Existe risco residual porque as mensagens de validação continuam textuais e protegidas pela blindagem textual/mojibake. Elas não devem ser corrigidas nesta trilha.

## 24. Risco residual de payload de convênio
Baixo no estado atual, porque o payload usa normalização local e não validação estruturada no `app.js`.

## 25. Risco residual de payload de plano
Baixo no estado atual, pelo mesmo motivo.

## 26. Risco residual de vínculo convênio/plano
Moderado apenas em mudanças futuras, porque o plano continua dependente do convênio selecionado no fluxo real.

## 27. Risco residual de calendário de faturamento, se aplicável
Existe cautela adicional se o fluxo de faturamento/calendário for retomado no futuro, pois é a parte mais sensível do módulo; nesta consolidação ele permaneceu fora de qualquer alteração.

## 28. Decisão final sobre Convênios e Planos
Decisão final:
- encerrar o mini ciclo nesta rodada;
- não criar wrappers novos agora;
- não mexer em eventos, clique ou duplo clique;
- não mexer em payload, salvamento ou exclusão.

## 29. Próximo módulo mais seguro recomendado
**Prestadores**

## 30. Justificativa da escolha do próximo módulo
Prestadores é o candidato mais seguro porque:
- já possui módulo JS e namespace passivo documentados;
- tem fronteira mais simples do que Agenda, Financeiro, Editor, Materiais e Procedimentos;
- apresenta menor risco de payload complexo e menor acoplamento clínico/financeiro;
- permite retomada documental conservadora por Subetapa 0 sem exigir alteração funcional imediata.

## 31. Módulos que devem permanecer pausados ou evitados agora
Devem permanecer pausados ou evitados:

- Agenda
- Editor de Textos
- Financeiro / Índices financeiros / Cenário financeiro
- Materiais
- Procedimentos Genéricos
- Intervenções / Procedimentos
- qualquer fluxo com forte dependência de payload sensível, backend/banco, ou eventos/duplo clique complexos

## 32. Próxima etapa recomendada para o próximo módulo
Para o próximo módulo recomendado, a etapa inicial deve ser preferencialmente:

- Subetapa 0 documental / retomada;
- sem alterar código inicialmente.

## 33. Riscos do próximo módulo recomendado
Mesmo sendo o mais seguro entre os candidatos restantes, Prestadores ainda exige atenção a:
- DOM e seleção;
- `requestJson` e payloads;
- modais;
- possíveis integrações com agenda e cadastro.

## 34. Checks executados
Checks de leitura executados nesta etapa:

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -12`

Também foram confirmados em leitura:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/convenios-planos.js`
- documentos do mini ciclo de Convênios e Planos
- documentos de recomendação de módulos e varredura comparativa

## 35. Status final
- Nenhum código foi alterado.
- O mini ciclo de Convênios e Planos foi encerrado documentalmente.
- O próximo módulo recomendado é `Prestadores`.
- O worktree permanece com pendências `untracked` preexistentes em `docs/`, sem relação com esta etapa.
