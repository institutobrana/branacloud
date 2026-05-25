# Plano de Contas - Contrato documental de montarPayloadCategoria

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Definir documentalmente se `montarPayloadCategoria` pode ser o proximo recorte seguro de Plano de Contas, sem alterar codigo.

## Contexto

Esta etapa sucede a implementacao minima de `montarPayloadGrupo(nome, tipo)` e sua validacao pos-teste em `Cadastros > Plano de contas`, que consolidaram a extracao conservadora inicial em Plano de Contas.

## Classificacao do modulo

Plano de Contas continua classificado como modulo comum/core administrativo/transversal.

## Estado atual do fluxo de categoria

- O fluxo de categoria continua concentrado em `frontend/app.js`, na funcao `planoDialogCategoria`.
- O modulo [frontend/js/modules/plano-contas.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/plano-contas.js) ja possui `ns.helpers.montarPayloadCategoria`.
- No momento, `planoDialogCategoria` ainda usa o helper passivo via `window.BranaPlanoContasModule?.helpers?.montarPayloadCategoria`.
- O helper existe, mas esta como helper passivo; a categoria continua dependendo do fluxo visual e do dialogo definido em `app.js`.

## Comparacao com montarPayloadGrupo

- `montarPayloadGrupo` ficou restrito a `nome` e `tipo`, com payload simples e menor superficie.
- `montarPayloadCategoria` amplia a superficie porque inclui `nome`, `grupo_id`, `tipo` e `tributavel`.
- A categoria depende de grupo selecionado e do estado corrente do dialogo.
- O risco de alterar comportamento e maior por envolver `grupo_id` e `tributavel`, alem da edicao/criacao de categoria.
- O payload atual precisa ser preservado exatamente.

## Contrato funcional proposto

Assinatura conceitual:

`montarPayloadCategoria(nome, grupo_id, tipo, tributavel)`

Contrato conceitual proposto:

`{ nome, grupo_id, tipo, tributavel }`

O contrato deve apenas reproduzir o comportamento atual, sem normalizacoes adicionais indevidas.

## Limites da futura implementacao

A futura implementacao, se aprovada depois, nao podera:

- alterar DOM;
- alterar modal;
- alterar renderizacao;
- alterar scaffold `cadModalAbrir`;
- alterar `requestJson`;
- alterar salvamento;
- alterar endpoint;
- alterar backend;
- alterar banco;
- alterar permissoes;
- alterar textos visiveis;
- corrigir mojibake;
- alterar comportamento visual;
- alterar payload efetivo.

## Riscos especificos de categoria

- dependencia de grupo selecionado;
- uso de `grupo_id`;
- uso de `tipo`;
- uso de `tributavel`;
- criacao de categoria;
- edicao de categoria;
- impacto no salvamento;
- impacto em categorias ja existentes;
- risco de normalizacao indevida mudar o comportamento atual;
- risco de acoplamento com o fluxo visual do dialogo.

## Recomendacao final

**B. `montarPayloadCategoria` precisa de mais auditoria antes de implementacao.**

Motivos:

- o helper ja existe, mas a categoria tem superficie maior que o grupo;
- o fluxo depende do dialogo e de campos adicionais;
- antes de qualquer implementacao minima, e mais seguro consolidar o contrato com uma auditoria adicional do comportamento atual.

## Justificativa tecnica

O helper parece elegivel para futura extracao minima, mas a presenca de `grupo_id` e `tributavel` torna o recorte mais sensivel que `montarPayloadGrupo`. A recomendacao conservadora e manter a validacao documental antes de qualquer alteracao funcional.

## Proxima subetapa recomendada

`Plano de Contas - Nova auditoria documental de montarPayloadCategoria antes de qualquer implementacao`

## Onde testar futuramente se houver implementacao

Em `Cadastros > Plano de contas`, validando:

- abrir `Cadastros > Plano de contas`;
- validar listagem;
- criar categoria;
- editar categoria;
- conferir grupo vinculado;
- conferir tipo;
- conferir tributavel, se aplicavel no fluxo atual;
- confirmar que grupo continua funcionando;
- confirmar que salvamento e comportamento visual permanecem iguais.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Nenhum arquivo de codigo foi alterado nesta etapa. A etapa foi exclusivamente documental.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido.

## Commit seletivo obrigatorio

Seletivamente, esta etapa deve entrar apenas com:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_plano_contas_contrato_montar_payload_categoria.md`

## Registro para roadmap

Registrar que o contrato documental de `montarPayloadCategoria` foi criado, que `Plano de Contas` continua como modulo comum/core administrativo/transversal, que a recomendacao conservadora foi pedir mais auditoria antes de implementar, que nenhuma alteracao de codigo foi feita e que a blindagem textual/mojibake foi respeitada.
