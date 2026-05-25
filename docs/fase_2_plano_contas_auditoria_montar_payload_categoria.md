# Plano de Contas - Auditoria documental de montarPayloadCategoria antes de implementacao

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Auditar documentalmente o uso atual de `montarPayloadCategoria` para decidir se uma futura implementacao minima seria segura, necessaria ou inadequada.

## Contexto

Esta etapa sucede o contrato documental de `montarPayloadCategoria`, que apontou a categoria como fluxo mais sensivel que o grupo e recomendou mais auditoria antes de qualquer implementacao.

## Classificacao do modulo

Plano de Contas continua classificado como modulo comum/core administrativo/transversal.

## Estado real do uso atual

- `montarPayloadCategoria` esta definido em [frontend/js/modules/plano-contas.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/plano-contas.js) dentro de `ns.helpers`.
- No momento, o helper esta passivo e nao possui alias top-level em `ns`.
- Em [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js), `planoDialogCategoria` chama `window.BranaPlanoContasModule?.helpers?.montarPayloadCategoria`.
- Ja existe fallback local equivalente no proprio fluxo de categoria:
  - se o helper existir, ele monta o payload;
  - se nao existir, o `app.js` recai para `{nome,tipo,grupo_id,tributavel}`.
- O `app.js` ja delega parcialmente para o helper, sem precisar de nova intermediacao para funcionar.

## Diferença entre a situação atual e uma possível implementação futura

Uma futura implementacao minima faria apenas:

- criar alias top-level: `ns.montarPayloadCategoria = ns.helpers.montarPayloadCategoria`;
- trocar a chamada do `app.js` de `window.BranaPlanoContasModule?.helpers?.montarPayloadCategoria` para `window.BranaPlanoContasModule?.montarPayloadCategoria`;
- manter fallback equivalente.

## Avaliação de ganho real

- A reducao efetiva em `frontend/app.js` seria minima.
- A clareza arquitetural melhoraria pouco, porque o helper ja esta acessivel e passivo.
- A consistencia com `montarPayloadGrupo` seria apenas parcial, pois o ganho seria mais estetico do que funcional.
- O risco de regressao existe porque o fluxo de categoria continua acoplado ao dialogo e ao salvamento real.
- A mudanca tenderia a ser principalmente organizacional, nao funcional.
- O ganho real nao parece suficiente para justificar a alteracao agora.

## Auditoria dos campos sensiveis

- `nome`: vem do input do dialogo, com trim/nome validado.
- `grupo_id`: vem do grupo selecionado no fluxo da categoria.
- `tipo`: vem do select do dialogo.
- `tributavel`: vem do checkbox do dialogo.
- Os valores sao lidos diretamente do estado atual do dialogo antes da montagem do payload.
- O helper atual faz apenas a montagem passiva do objeto; qualquer coerção adicional indevida poderia alterar payload ou comportamento.

## Auditoria do fluxo de categoria

- abertura do dialogo de categoria em `planoDialogCategoria`;
- obtenção do grupo selecionado;
- montagem do payload via helper passivo;
- envio por `requestJson`;
- salvamento;
- atualização/listagem posterior.

## Riscos identificados

- dependencia de grupo selecionado;
- uso de `grupo_id`;
- uso de `tipo`;
- uso de `tributavel`;
- criacao de categoria;
- edicao de categoria;
- impacto no salvamento;
- impacto em categorias ja existentes;
- risco de alteracao de comportamento se houver normalizacao indevida;
- risco de alterar um fluxo ja funcional sem ganho prático relevante;
- risco de mexer apenas por padronizacao estetica.

## Decisão conservadora

**C. `montarPayloadCategoria` precisa continuar sem alteração porque o risco é maior que o ganho.**

## Justificativa tecnica

O uso atual já está seguro o suficiente para o fluxo funcionar, com helper passivo em `ns.helpers` e fallback local equivalente no `app.js`. Criar alias top-level e trocar a chamada agora traria pouca reducao real de complexidade, mas introduziria uma alteracao desnecessaria em um fluxo de categoria que ja opera corretamente.

## Próxima subetapa recomendada

`Plano de Contas - Consolidacao documental: manter montarPayloadCategoria como esta`

## Onde testar futuramente se houver implementação

Em `Cadastros > Plano de contas`, validando:

- abrir `Cadastros > Plano de contas`;
- validar listagem;
- criar categoria;
- editar categoria;
- conferir grupo vinculado;
- conferir tipo;
- conferir tributavel, se aplicavel no fluxo atual;
- confirmar que grupo continua funcionando;
- confirmar que salvamento e comportamento visual permanecem iguais;
- confirmar que nao houve regressao na criacao/edicao de grupo.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Nenhum arquivo de codigo foi alterado nesta etapa. A etapa foi exclusivamente documental.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido.

## Commit seletivo obrigatorio

Seletivamente, esta etapa deve entrar apenas com:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_plano_contas_auditoria_montar_payload_categoria.md`

## Registro para roadmap

Registrar que a auditoria documental de `montarPayloadCategoria` concluiu que o helper deve permanecer como esta, sem implementacao nova, que `Plano de Contas` continua como modulo comum/core administrativo/transversal, que a blindagem textual/mojibake foi respeitada e que a proxima subetapa e consolidar documentalmente a permanencia do fluxo atual.
