# Plano de Contas - Consolidacao documental de manter montarPayloadCategoria como esta

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Registrar formalmente que `montarPayloadCategoria` deve permanecer como esta neste momento, sem nova implementacao.

## Contexto

Esta etapa sucede a auditoria documental de `montarPayloadCategoria`, que concluiu que a mudanca proposta teria ganho real pequeno e risco desnecessario para um fluxo ja funcional.

## Classificacao do modulo

Plano de Contas continua classificado como modulo comum/core administrativo/transversal.

## Decisao consolidada

- manter `montarPayloadCategoria` em `ns.helpers`;
- manter o uso atual via `window.BranaPlanoContasModule?.helpers?.montarPayloadCategoria`;
- nao criar alias top-level agora;
- nao alterar `frontend/app.js`;
- nao alterar `frontend/js/modules/plano-contas.js`.

## Motivo tecnico

- o ganho real seria pequeno;
- a reducao do `app.js` seria apenas marginal;
- a mudanca seria mais organizacional do que funcional;
- o fluxo de categoria e mais sensivel que o de grupo;
- envolve `grupo_id`, `tipo`, `tributavel`, grupo selecionado e estado do dialogo;
- o risco e maior que o beneficio neste momento.

## Estado consolidado do Plano de Contas

- `montarPayloadGrupo` foi implementado, testado e consolidado;
- `montarPayloadCategoria` permanece existente e usado via `ns.helpers`;
- `Plano de Contas` permanece parcialmente modularizado e seguro;
- o fluxo visual, o modal, o scaffold, `requestJson`, o salvamento e o payload efetivo permanecem intocados.

## Riscos remanescentes

- o modal e o scaffold compartilhado continuam em `frontend/app.js`;
- categorias continuam sensiveis;
- futuras alteracoes exigem contrato proprio;
- nao avancar em categoria sem ganho tecnico claro.

## Recomendacao futura

**A. Encerrar Plano de Contas por enquanto e voltar para nova selecao documental de blocos leves.**

Justificativa:

- `Plano de Contas` ja entregou ganho tecnico suficiente por agora;
- continuar mexendo em categoria nao traz beneficio proporcional;
- o melhor proximo passo e reabrir a selecao documental entre blocos mais leves.

## Onde testar futuramente se houver nova implementacao

Nao ha novo teste manual obrigatório nesta etapa, pois nenhuma implementacao foi feita.

Qualquer futura implementacao em Plano de Contas deve ser testada em `Cadastros > Plano de contas`.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Nenhum arquivo de codigo foi alterado nesta etapa. A etapa foi exclusivamente documental.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido.

## Commit seletivo obrigatorio

Seletivamente, esta etapa deve entrar apenas com:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_plano_contas_consolidacao_montar_payload_categoria_sem_alteracao.md`

## Registro para roadmap

Registrar que `montarPayloadCategoria` foi consolidado sem alteração, que o uso atual via `ns.helpers` sera mantido, que `Plano de Contas` teve `montarPayloadGrupo` implementado/testado/consolidado, que a frente fica pausada/consolidada por ora e que a blindagem textual/mojibake foi respeitada.
