# Reavaliação pós-fechamento de Símbolos Gráficos — Próximo módulo

## Objetivo
Registrar uma nova reavaliação documental comparativa depois do fechamento de `Símbolos Gráficos`, aplicando a regra rígida anti-reciclagem para decidir se ainda existe algum módulo realmente mais seguro para continuidade da modularização conservadora.

## Por que a regra anti-reciclagem foi reforçada
A sequência recente mostrou que módulos já iniciados, pausados, encerrados ou retomados tendem a ser recomendados de novo apenas porque possuem documentação extensa, namespace passivo ou módulo JS existente. Isso distorce a escolha do próximo alvo e faz a rotação voltar para áreas já exploradas sem uma justificativa excepcional forte.

## Documentos consultados
- `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md`
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`
- `docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md`
- `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md`
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Módulos avaliados
- Etiquetas
- Plano de Contas
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares
- Símbolos Gráficos
- Medicamentos
- Prestadores
- Anamnese
- Materiais
- Procedimentos Genéricos
- Intervenções / Procedimentos
- Convênios e Planos
- Agenda
- Editor de Textos
- Índices financeiros
- Cenário financeiro

## Classificação individual

| Módulo | Classificação | Estado atual conhecido | Documentos relevantes | JS/namespace | Helper inédito seguro | Recomendação |
|---|---|---|---|---|---|---|
| Etiquetas | 6. Não recomendado nesta rodada | ciclo encerrado anteriormente | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Plano de Contas | 6. Não recomendado nesta rodada | ciclo encerrado anteriormente | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Preferências e Opções do Sistema | 6. Não recomendado nesta rodada | fechado/pausado nesta rodada | `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Auxiliares / Tabelas auxiliares | 6. Não recomendado nesta rodada | ciclo de helpers puros encerrado | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Símbolos Gráficos | 3. Parcial já iniciado, mas pausado por risco | retomado, helper `validarTipoMarcaSimbolo` só documentado e módulo fechado novamente | `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`, `docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md`, `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md` | sim / sim | helper puro documentado, mas sem base para reabertura funcional agora | bloquear nesta rodada |
| Medicamentos | 4. Mini ciclo encerrado recentemente | pausado/encerrado documentalmente | `docs/medicamentos_fechamento_reavaliacao_proximo_modulo.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Prestadores | 3. Parcial já iniciado, mas pausado por risco | retomado documentalmente e pausado nesta rodada | `docs/prestadores_subetapa_0_retomada_estado_atual.md`, `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md` | sim / sim | não identificado | bloquear |
| Anamnese | 4. Mini ciclo encerrado recentemente | mini ciclo encerrado | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Materiais | 5. Alto risco estrutural | muito sensível por vínculos, listas e valores | `docs/recomendacao_proximo_modulo_pos_materiais.md` | sim / sim | não identificado | bloquear |
| Procedimentos Genéricos | 5. Alto risco estrutural | risco elevado por acoplamento com materiais/procedimentos | `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | sim / sim | não identificado | bloquear |
| Intervenções / Procedimentos | 3. Parcial já iniciado, mas pausado por risco | pausado por materiais, vínculos, custos e reajustes | `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`, `docs/reavaliacao_rigida_proximo_modulo_menor_risco.md` | sim / sim | não identificado | bloquear |
| Convênios e Planos | 4. Mini ciclo encerrado recentemente | mini ciclo encerrado | `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`, `docs/recomendacao_proximo_modulo_pos_convenios_planos.md` | sim / sim | não identificado | bloquear |
| Agenda | 5. Alto risco estrutural | fluxo amplo, visual e dependente de estado/datas | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | sim / sim | não identificado | bloquear |
| Editor de Textos | 5. Alto risco estrutural | editor rico, preview e integrações | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | sim / sim | não identificado | bloquear |
| Índices financeiros | 5. Alto risco estrutural | área financeira sensível | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | sim / sim | não identificado | bloquear |
| Cenário financeiro | 5. Alto risco estrutural | cálculos e contratos monetários | `docs/recomendacao_proximo_modulo_pos_anamnese.md`, `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` | sim / sim | não identificado | bloquear |

## Módulos já explorados, pausados ou encerrados recentemente
- Prestadores
- Convênios e Planos
- Símbolos Gráficos
- Medicamentos
- Intervenções / Procedimentos
- Anamnese
- Etiquetas
- Plano de Contas
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares

## Módulos de alto risco estrutural
- Materiais
- Procedimentos Genéricos
- Agenda
- Editor de Textos
- Índices financeiros
- Cenário financeiro

## Módulos ainda não esgotados documentalmente
Nenhum módulo da lista atual ficou com justificativa objetiva suficientemente forte para avanço funcional sem reciclar um módulo já explorado.

## Candidatos secundários
Não há candidatos secundários seguros para avançar funcionalmente nesta rodada.

## Módulo recomendado como candidato principal
Não há módulo seguro para avanço funcional agora.

## Justificativa curta do candidato principal
A regra anti-reciclagem, aplicada com rigor, elimina os módulos já pausados ou encerrados recentemente, e os demais seguem em alto risco estrutural. O resultado é a ausência de um alvo novo com risco realmente menor.

## Justificativa técnica do candidato principal
- `Símbolos Gráficos` foi fechado novamente após a análise de `validarTipoMarcaSimbolo(valor)`, e não deve ser reaberto sem uma justificativa excepcional nova;
- `Prestadores` continua concentrado em UI, cache, seleção, carregamento e `requestJson`;
- `Convênios e Planos`, `Anamnese`, `Medicamentos` e `Intervenções / Procedimentos` já passaram por ciclos recentes ou foram pausados por risco;
- `Materiais`, `Procedimentos Genéricos`, `Agenda`, `Editor de Textos`, `Índices financeiros` e `Cenário financeiro` permanecem estruturalmente arriscados;
- `Etiquetas`, `Plano de Contas`, `Preferências e Opções do Sistema` e `Auxiliares / Tabelas auxiliares` já tiveram seus ciclos seguros encerrados.

## Por que não há candidato principal menor risco real
Todos os módulos com fronteira mais clara já pertencem ao conjunto explorado/pausado/encerrado recentemente. O que sobra ou já foi esgotado, ou carrega risco alto demais para começar uma nova fase funcional conservadora.

## Se algum módulo já explorado precisasse voltar
Não há justificativa excepcional forte suficiente nesta rodada para retomar `Símbolos Gráficos` ou qualquer outro módulo já explorado. A exigência mínima para uma retomada excepcional não foi atendida de forma nova e superior às etapas anteriores.

## Riscos residuais do cenário atual
- biblioteca visual;
- ordenação;
- visibilidade;
- editor;
- preview;
- `postMessage`;
- modal;
- HTML/SVG/ícones/cores/classes;
- payload;
- salvamento;
- exclusão;
- renderização;
- cache e seleção em módulos já parcialmente modularizados;
- financeiro, custos, preços e reajustes em módulos sensíveis.

## Primeira etapa recomendada
Pausa geral da modularização funcional nesta rodada, mantendo apenas documentação, auditoria e reavaliação comparativa até surgir um módulo realmente novo e não esgotado.

## Confirmação de não alteração funcional
Esta etapa não recomenda alteração de código, não propõe wrapper novo, não retoma helper já fechado e não reabre módulos pausados sem justificativa excepcional forte.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -12`

## Status final do git
No momento da escrita do documento, o branch era `modularizacao-segura-fase-1`, sem diffs rastreados e sem staged files relacionados a esta etapa; o worktree já possuía pendências `??` preexistentes fora do escopo funcional desta rodada.
