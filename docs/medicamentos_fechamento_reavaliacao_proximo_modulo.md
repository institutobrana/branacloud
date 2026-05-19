# Medicamentos — Fechamento, reavaliação e recomendação do próximo módulo

## Objetivo
Fechar e reavaliar o estado de Medicamentos, registrando por que o ciclo atual deve ser pausado nesta rodada e qual e o proximo modulo mais seguro para continuidade da modularizacao conservadora.

## Escopo
Esta etapa foi exclusivamente documental.

- leu arquivos do projeto Brana Cloud;
- consultou documentos anteriores de Medicamentos e de comparacao entre modulos;
- consultou `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/medicamentos.js` apenas para leitura;
- nao alterou codigo;
- nao alterou comportamento;
- nao criou modulo JS;
- nao mexeu em backend, banco, schema, migrations ou endpoints.

## Checks iniciais
Comandos de leitura e validacao executados nesta rodada:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -6`
- `git diff --stat`
- `git diff --cached --stat`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/medicamentos.js`

## Documentos consultados
- `docs/medicamentos_subetapa_0_retomada_estado_atual.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_3_helpers_textuais_puros.md`
- `docs/medicamentos_subetapa_4_integracao_validacao_nome.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`

## Estado atual de Medicamentos
- existe modulo JS em `frontend/js/modules/medicamentos.js`;
- o namespace existente e `window.BranaMedicamentosModule`;
- os helpers existentes sao:
  - `normalizarTextoMedicamento`
  - `validarNomeMedicamento`
  - `validarGrupoMedicamento`
  - `compararTextoMedicamento`
  - `resumo`
  - `getStatus`
  - `info`
- o modulo continua passivo;
- o carregamento no `frontend/index.html` ja existe;
- o `frontend/app.js` ainda centraliza UI, DOM, lista, modal, filtros, cache, selecao, salvamento, exclusao e integracao com receitas/prescricoes, impressao, editor de textos e anamnese.

## O que já foi feito em Medicamentos
O ciclo anterior de Medicamentos ja passou por:

- estrutura modular passiva;
- fronteiras e contratos;
- helpers textuais puros;
- integracao da validacao de nome com fallback;
- encerramento do ciclo de helpers;
- retomada documental e estado atual.

## O que NÃO deve avançar agora
Bloqueado nesta rodada:

- `medicamentosAbrir()`
- `medicamentosEnsureUI()`
- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`
- `medicamentosRender()`
- `medicamentosSetSelectOptions(select, itens, placeholder)`
- `medicamentosAplicarTab(tab)`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosFecharModal()`
- `medicamentosAbrirModal(modo)`
- `medicamentosPayloadModal()`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosVincularEventos()`

Tambem bloqueado:

- qualquer coisa ligada a `medicamentoSelId`;
- qualquer coisa ligada a `medicamentosCache`;
- qualquer coisa ligada a `medicamentosFiltroTimer`;
- qualquer coisa ligada a `medicamentosUltimoCliqueId`;
- qualquer coisa ligada a `medicamentosUltimoCliqueEm`;
- qualquer fluxo de duplo clique;
- qualquer fluxo de modal;
- qualquer fluxo de salvar/excluir;
- qualquer fluxo de receitas/prescricoes;
- qualquer fluxo de impressao;
- qualquer fluxo de editor de textos;
- qualquer fluxo de anamnese;
- qualquer payload;
- qualquer backend/API/banco.

## Riscos funcionais
Medicamentos segue com risco funcional relevante em:

- listagem;
- filtros;
- validacao;
- modal;
- duplo clique;
- salvamento;
- exclusao;
- receitas/prescricoes;
- impressao/editor;
- anamnese;
- dependencias de shell, permissao e `requestJson`.

## Riscos de texto/mojibake
Medicamentos tambem segue com risco textual porque os helpers existentes trabalham com normalizacao de texto e validacao textual simples.

- mexer em `normalizarTextoMedicamento` pode alterar comportamento de busca/entrada;
- mexer em `validarNomeMedicamento` pode alterar mensagens e bloqueios de salvamento;
- mexer em `validarGrupoMedicamento` pode afetar filtros e combos;
- mexer em `compararTextoMedicamento` pode alterar resultado de pesquisa;
- nenhuma correcao textual ou de mojibake foi feita nesta etapa.

## Decisão sobre Medicamentos
**Medicamentos deve ser pausado nesta rodada.**

Justificativa conservadora:

- o ciclo de helpers de Medicamentos ja foi encerrado documentalmente;
- o modulo JS e o namespace passivo ja existem;
- os helpers pequenos existentes ja foram mapeados e nao apareceu um helper puro novo claramente seguro para extracao funcional minima;
- o restante do bloco continua fortemente amarrado ao `app.js`, ao DOM, ao modal, aos filtros, ao cache, ao salvamento e a chamadas de API;
- receitas/prescricoes, impressao/editor e anamnese aumentam o risco de regressao silenciosa;
- portanto, a decisao mais segura e nao abrir nova extracao funcional em Medicamentos agora.

## Candidatos a próximo módulo
Classificacao documental dos candidatos ainda disponiveis ou possiveis nesta rodada:

| Modulo | Classificacao | Observacao |
|---|---|---|
| Anamnese | parcialmente seguro | tem documentacao extensa e fronteira conhecida, mas continua sensivel por dados clinicos, dois fluxos e renumeracao |
| Convenios e Planos | sensivel | fronteira legivel, porem com maior risco de billing/calendario e duas grades |
| Etiquetas | pausado/encerrado | ciclo de helpers ja fechado |
| Plano de Contas | pausado/encerrado | ciclo de helpers ja fechado |
| Simbolos Graficos | pausado | visual/editor sensivel, nao avancar automaticamente nesta rodada |
| Prestadores | pausado | UI, renderizacao, cache, selecao e fluxos sensiveis ja devem ficar em espera |
| Materiais | muito sensivel | risco alto por DOM, modais, listas e dependencias de negocio |
| Procedimentos Genéricos | muito sensivel | risco alto por payload, rotas e dependencias cruzadas |
| Intervenções / Procedimentos | pausado | ja reavaliado e deixado em espera por risco funcional |
| Auxiliares / Tabelas auxiliares | pausado/encerrado | ciclo de helpers ja encerrado |
| Preferências e Opções do Sistema | pausado/encerrado | ciclo recente fechado/pausado |

## Módulos que devem permanecer pausados
Permanecem pausados nesta rodada:

- Prestadores: pausado por UI, renderizacao, cache, selecao e fluxos sensiveis.
- Intervenções / Procedimentos: pausado por payload, materiais, vinculos, custos, formas de cobrança, Procedimentos Genéricos e reajustes.
- Medicamentos: pausado nesta etapa.
- Materiais: muito sensivel.
- Procedimentos Genéricos: muito sensivel.
- Símbolos Gráficos: visual/editor sensível, não avançar automaticamente.
- Auxiliares / Tabelas auxiliares: ciclo de helpers puros já encerrado.
- Preferências e Opções do Sistema: ciclo recente fechado/pausado.

## Próximo módulo recomendado
**Anamnese**

## Justificativa da escolha
Anamnese e o melhor proximo modulo entre os candidatos ainda disponiveis porque:

- tem fronteira mais clara do que Convenios e Planos;
- nao depende de custo, reajuste ou materiais;
- ja possui base documental extensa e historico de recuperacao controlado;
- permite uma nova retomada conservadora por documento antes de qualquer movimento funcional;
- apresenta risco menor do que Convênios e Planos, Materiais, Procedimentos Genéricos e qualquer bloco financeiro/editorial;
- ainda e mais previsivel para uma nova rodada documental do que os blocos visuais sensiveis.

## Próxima etapa recomendada
**Anamnese — Subetapa 0 — retomada documental e estado atual**

## Roteiro de teste
Como esta etapa e apenas documental, nao ha teste funcional obrigatorio no navegador.

Se houver futura alteracao funcional em qualquer proximo modulo, o roteiro conservador deve indicar exatamente onde testar antes de prosseguir.

