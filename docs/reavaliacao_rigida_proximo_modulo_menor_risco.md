# Reavaliação rígida do próximo módulo de menor risco

## Objetivo

Reavaliar, com critério mais duro, qual seria o proximo modulo de menor risco real para a continuidade da modularizacao conservadora, evitando reciclar automaticamente modulos que ja foram iniciados, pausados, encerrados ou retomados recentemente.

## Por que a regra anti-reciclagem foi adicionada

A sequencia recente mostrou um viés perigoso: recomendar de novo modulos que ja tinham ciclo parcial concluido ou pausado apenas porque eles possuem documentacao extensa, namespace passivo ou modulo JS existente.

Isso nao e suficiente. Um modulo so pode voltar a ser recomendado se existir justificativa objetiva, com helper puro especifico e inedito, contrato claro e risco realmente menor do que um modulo ainda nao esgotado.

## Documentos consultados

- `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md`
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`
- `docs/prestadores_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_medicamentos.md`
- `docs/recomendacao_proximo_modulo_pos_materiais.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- documentos de fechamento, retomada e reavaliacao relacionados a Etiquetas, Plano de Contas, Preferencias e Opcoes do Sistema, Auxiliares, Medicamentos, Prestadores, Anamnese, Materiais, Procedimentos Genericos, Intervencoes / Procedimentos, Convênios e Planos, Agenda, Editor de Textos, Indices financeiros e Cenario financeiro

## Modulos avaliados

| Modulo | Estado atual conhecido | JS / namespace | Helpers delegados | Risco principal | Classificacao | Pode ser recomendado agora? |
|---|---|---|---|---|---|---|
| Etiquetas | ciclo ja encerrado; modulo explorado | sim | sim, helpers puros ja extraidos | nao ha helper puro inedito claro; ciclo ja foi esgotado | 6. Nao recomendado nesta rodada | Nao |
| Plano de Contas | ciclo ja encerrado; modulo explorado | sim | sim, helpers puros ja extraidos | ciclo ja consolidado, sem ganho claro para reciclar | 6. Nao recomendado nesta rodada | Nao |
| Preferencias e Opcoes do Sistema | fechado / pausado nesta rodada | sim | sim | bloco ja encerrado nesta rodada | 6. Nao recomendado nesta rodada | Nao |
| Auxiliares / Tabelas auxiliares | ciclo de helpers puros encerrado | sim | sim | conjunto ja consolidado | 6. Nao recomendado nesta rodada | Nao |
| Simbolos Graficos | modulo parcial retomado; ainda com fluxo pesado, mas com um helper puro inedito remanescente | sim | sim, varios helpers ja delegados | editor, biblioteca visual, ordem de exibicao, modal, `postMessage`, salvar/excluir | 2. Parcial ja iniciado com caminho seguro restante | **Sim, com justificativa excepcional** |
| Medicamentos | mini ciclo pausado/encerrado recentemente | sim | sim | CRUD e validacao textual, sem helper puro novo forte | 4. Mini ciclo encerrado recentemente | Nao |
| Prestadores | retomado documentalmente e pausado nesta rodada | sim | sim | UI, renderizacao, selecao, cache, carregamento e `requestJson` | 3. Parcial ja iniciado, mas pausado por risco | Nao |
| Anamnese | mini ciclo encerrado recentemente | sim | sim | fluxo clinico, paciente, questionarios, perguntas e perguntas/respostas | 4. Mini ciclo encerrado recentemente | Nao |
| Materiais | modulo pesado e estruturalmente sensivel | sim | sim | custos, listas, multiplos modais, indices, vinculacao | 5. Alto risco estrutural | Nao |
| Procedimentos Genericos | ciclo inicial ja explorado; segue sensivel | sim | sim | vinculo com procedimentos/materiais e payload sensivel | 5. Alto risco estrutural | Nao |
| Intervencoes / Procedimentos | pausado por risco | sim | sim | materiais, vinculos, custos, preco, repasse, reajuste | 5. Alto risco estrutural | Nao |
| Convênios e Planos | mini ciclo encerrado recentemente | sim | sim | duplo clique, payload e vinculo convênio/plano | 4. Mini ciclo encerrado recentemente | Nao |
| Agenda | muito grande e operacionalmente sensivel | sim | sim | eventos, datas, selecao, estados e integracoes | 5. Alto risco estrutural | Nao |
| Editor de Textos | fluxo rico e altamente acoplado | sim | sim | DOM pesado, imagem, preview, persistencia | 5. Alto risco estrutural | Nao |
| Indices financeiros | area financeira sensivel | sim | sim | cotacoes, exclusao, migracao e valores | 5. Alto risco estrutural | Nao |
| Cenario financeiro | calculos e regras monetarias | sim | sim | financeiro, reajustes e contratos | 5. Alto risco estrutural | Nao |

## Lista dos modulos ja explorados, pausados ou encerrados recentemente

- Prestadores
- Convênios e Planos
- Símbolos Gráficos
- Medicamentos
- Intervenções / Procedimentos
- Anamnese
- Auxiliares / Tabelas auxiliares
- Preferências e Opções do Sistema
- Etiquetas
- Plano de Contas

## Lista dos modulos de alto risco estrutural

- Materiais
- Procedimentos Genericos
- Intervenções / Procedimentos
- Agenda
- Editor de Textos
- Indices financeiros
- Cenario financeiro

## Lista dos modulos ainda nao esgotados documentalmente

- `Símbolos Gráficos`, apenas pela excecao objetiva do helper puro inedito `validarTipoMarcaSimbolo`

## Lista dos candidatos secundarios

- Nenhum candidato secundario superou o corte atual sem reciclar um modulo ja explorado.

## Módulo recomendado como candidato principal

**Símbolos Gráficos**

## Justificativa curta do candidato principal

Entre os modulos ja explorados da fila atual, `Símbolos Gráficos` e o unico que ainda apresenta um helper puro especifico e inedito, `validarTipoMarcaSimbolo`, com contrato claro e sem dependencia direta de DOM, cache, estado, payload ou salvamento.

## Justificativa técnica do candidato principal

- existe o modulo JS passivo `frontend/js/modules/simbolos-graficos.js`;
- existe o namespace `window.BranaSimbolosGraficosModule`;
- os helpers mais sensiveis de desenho, biblioteca e imagem ja foram mapeados em ciclos anteriores;
- o helper `validarTipoMarcaSimbolo(valor)` esta no namespace passivo e tem entrada/saida pequenas e previsiveis: `valor` -> `"sistema"`, `"usuario"` ou `""`;
- esse helper nao usa DOM;
- nao usa cache global;
- nao altera estado;
- nao chama `requestJson`;
- nao monta payload;
- nao salva;
- nao exclui;
- nao depende de evento, clique, duplo clique ou selecao;
- nao depende de renderizacao dinamica;
- nao toca modais, vinculos, pacientes, procedimentos, materiais, tabelas, preco, custos, repasses, comissoes, reajustes, financeiro, backend ou banco;
- a recomendacao excepcional nao depende de "ja existe modulo JS" ou "ja existe documentacao" apenas, e sim de um helper puro concreto ainda nao esgotado na pratica de integracao do `app.js`.

## Por que o candidato principal e menor risco real do que os modulos ja explorados

- `Prestadores`, `Medicamentos`, `Anamnese` e `Convênios e Planos` ja foram retomados, pausados ou encerrados recentemente e ficaram com risco concentrado em UI, cache, selecao, payload ou fluxo clinico;
- `Etiquetas`, `Plano de Contas` e `Auxiliares / Tabelas auxiliares` ja tiveram seus ciclos puros encerrados, sem justificativa objetiva para nova rodada;
- `Símbolos Gráficos` ainda preserva um helper puro especifico com contrato simples e sem amarrar o restante do editor visual.

## Por que o candidato principal e menor risco real do que os modulos de alto risco

- `Materiais` e `Procedimentos Genericos` estao presos a custos, vinculos e payload sensivel;
- `Intervenções / Procedimentos` envolve materiais, custos, preco e reajuste;
- `Agenda` depende de eventos, selecao e integracoes;
- `Editor de Textos` e rico demais em DOM e persistencia;
- `Indices financeiros` e `Cenario financeiro` carregam risco monetario direto;
- `Símbolos Gráficos`, na excecao proposta, permite uma etapa menor do que qualquer um desses blocos.

## Justificativa excepcional para retomar módulo já explorado

`Símbolos Gráficos` ja foi explorado, mas ainda existe justificativa excepcional forte para retomá-lo porque o proximo passo nao e abrir o editor, o modal ou o fluxo de biblioteca. O proximo passo seria olhar apenas o helper puro `validarTipoMarcaSimbolo(valor)` e, se for o caso, documenta-lo ou integrá-lo de forma minima no futuro.

Essa excecao se sustenta nos pontos abaixo:

1. helper puro especifico e inedito: `validarTipoMarcaSimbolo(valor)`;
2. ele ainda nao foi esgotado nas etapas anteriores de integracao funcional no `app.js`;
3. o contrato e claro: recebe um valor bruto e devolve `"sistema"`, `"usuario"` ou `""`;
4. nao toca DOM;
5. nao toca cache;
6. nao toca estado;
7. nao toca payload;
8. nao toca salvamento;
9. nao toca exclusao;
10. nao toca `requestJson`;
11. nao toca eventos;
12. nao toca clique;
13. nao toca duplo clique;
14. nao toca selecao;
15. nao toca renderizacao;
16. nao toca modais;
17. nao toca vinculos;
18. nao toca pacientes;
19. nao toca procedimentos;
20. nao toca materiais;
21. nao toca tabelas, precos, custos, repasses, comissoes, reajustes ou financeiro;
22. nao toca backend ou banco;
23. e mais seguro que abrir um modulo ainda nao esgotado apenas por documentacao, porque o helper alvo tem superficie minima, contrato fechado e risco localizavel.

Sem essa excecao, `Símbolos Gráficos` deveria permanecer pausado. A recomendacao aqui e excepcional e estreita.

## Riscos conhecidos do candidato principal

- editor visual e biblioteca ainda sao superfícies sensiveis;
- `postMessage` continua sendo uma ponte delicada;
- a ordem/visibilidade da biblioteca pode mudar se helper de ordenacao entrar cedo demais;
- salvar/excluir continuam sendo fluxos de alto risco e nao entram nesta etapa;
- o risco textual/mojibake existe historicamente no bloco e nao deve ser corrigido agora.

## Primeira etapa recomendada

Subetapa documental especifica de `validarTipoMarcaSimbolo` dentro de `Símbolos Gráficos`, sem tocar no editor, modal, preview, biblioteca, `postMessage`, salvar ou excluir.

## A próxima etapa deve ser documental, sem alterar código

Sim. A proxima etapa, se houver, deve continuar documental e sem alteracao de codigo funcional.

## Modulos que nao devem ser retomados agora

- Prestadores
- Convênios e Planos
- Medicamentos
- Intervenções / Procedimentos
- Materiais
- Procedimentos Genericos
- Anamnese
- Etiquetas
- Plano de Contas
- Preferências e Opções do Sistema
- Auxiliares / Tabelas auxiliares
- Agenda
- Editor de Textos
- Indices financeiros
- Cenario financeiro

## Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -12`

## Status final do git

Antes da criacao deste documento, o repositorio estava em `modularizacao-segura-fase-1`, com diferencas rastreadas vazias e apenas pendencias untracked preexistentes no worktree. Depois da criacao, este proprio arquivo passa a ser a unica alteracao desta etapa enquanto nao for commitado.
