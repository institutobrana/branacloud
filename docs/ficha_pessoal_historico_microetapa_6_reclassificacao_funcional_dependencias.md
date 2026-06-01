# Ficha Pessoal - Historico - Microetapa 6 - reclassificacao funcional de Cirurgiao, Regiao e dependencias externas

## Objetivo

Reclassificar documentalmente o alvo funcional dos campos da aba `Historico` a partir da confirmacao explicita do usuario sobre o EasyDental real, distinguindo o que ja tem alvo final definido do que ainda depende de outro modulo, cadastro ou vinculo nao fechado no Brana Cloud.

Esta microetapa e documental e classificatoria. Nao altera frontend, backend, banco, schema, migration, seed, endpoint, model ou persistencia.

## Nova diretriz confirmada pelo usuario

- `Cirurgiao` no EasyDental esta relacionado ao cirurgiao/prestador que executou o procedimento.
- Isso confirma a leitura anterior de que o campo se liga ao executante do procedimento, coerente com `ID_PRESTADOR`.
- Existem muitos historicos com prestadores diferentes, o que reforca que o campo nao e apenas texto livre final.
- Se `Regiao` ou outros campos/combo desta tela dependerem de outro modulo ainda nao implementado no Brana, isso deve ser comunicado explicitamente ao usuario para que ele providencie o novo modulo e feche o ciclo.

## Reclassificacao formal de Cirurgiao

### Alvo final

- `Cirurgiao` deve ser tratado como campo funcional ligado ao executante do procedimento.
- A referencia tecnica mais provavel segue sendo `HISTORICO.ID_PRESTADOR -> PRESTADOR`.

### Estado atual no Brana

- Permanece textual/local por enquanto.
- Esse estado atual e temporario e nao deve ser confundido com o alvo final.

### Classificacao formal

- **Alvo final definido**
- **Estado atual temporario**
- **Dependencia funcional de cadastro/mecanismo de prestador/executante fortemente provavel**

## Reclassificacao formal de Regiao

### Alvo final

- `Regiao` segue classificado como campo que provavelmente depende de estrutura odontologica mais especifica.
- O target funcional ainda nao pode ser fechado com a mesma seguranca que `Cirurgiao`.

### Estado atual no Brana

- Permanece textual/local por enquanto.
- Esse estado atual e temporario.

### Classificacao formal

- **Alvo funcional ainda depende de mais evidencias e/ou de modulo externo**
- **Dependencia de estrutura odontologica/regra clinica ainda nao implementada e fortemente provavel**
- **Nao deve ser tratado como final ainda**

## Distincao entre estado atual temporario e alvo final

- O Brana atual ainda usa representacao textual local para os dois campos.
- Isso e aceitavel apenas como etapa transitiva.
- O alvo final precisa manter equivalencia funcional com o EasyDental, mas sem mascarar a ausencia de modulo/cadastro dependente.

## Dependencias externas ou modulares identificadas

### Dependencia de Cirurgiao

- Cadastro ou lookup de prestadores/executantes.
- Possivel reutilizacao de estruturas de prestador ja existentes no Brana, se forem adequadas para o fluxo do Historico.

### Dependencia de Regiao

- Estrutura odontologica/regra clinica ainda nao fechada.
- Pode exigir modulo, cadastro ou lookup especifico que nao existe nesta frente.

### Dependencias adicionais a comunicar ao usuario

- Se a equivalencia completa exigir um modulo de prestador/executante mais formal, esse novo ciclo deve ser aberto.
- Se `Regiao` depender de uma tabela/lookup odontologico ainda ausente, isso tambem deve virar novo ciclo ou novo modulo.
- Nao e seguro tratar esses pontos como fechados com uma solucao provisoria simples.

## O que precisa ser comunicado ao usuario como novo ciclo/modulo necessario

- Para `Cirurgiao`, comunicar que o alvo final e o executante do procedimento e que uma estrutura de prestador/cadastro pode ser necessaria para fechar a equivalencia.
- Para `Regiao`, comunicar que a definicao final ainda depende de evidencias ou de modulo externo ainda nao implementado.
- Se houver necessidade de lookup odontologico formal, esse deve ser aberto como novo ciclo antes de qualquer pretensao de equivalencia total.

## Priorizacao real apos a reclassificacao

1. Tratar `Cirurgiao` como alvo funcional definido, mas ainda temporariamente textual no Brana atual.
2. Tratar `Regiao` como dependencia ainda aberta.
3. Abrir frente de dependencia para os modulos/cadastros que faltam, em vez de seguir insistindo em ajuste textual isolado.

## Recomendacao de proxima subetapa real

- Abrir uma frente de dependencia funcional para mapear exatamente qual modulo/cadastro do Brana vai representar o executante do procedimento e qual modulo/cadastro sera necessario para a regiao odontologica, se ela nao puder ser resolvida localmente.

## Confirmacao de ausencia de mudanca funcional

- Nao houve alteracao de selecao.
- Nao houve alteracao de inserir.
- Nao houve alteracao de editar.
- Nao houve alteracao de eliminar.
- Nao houve alteracao de `TAB` / `Shift+TAB`.
- Nao houve alteracao de `ENTER` / `ESC`.
- Nao houve alteracao da persistencia via `extra.historico_aba`.
- Nao houve alteracao do modal funcional de `Propriedades da linha`.

## Confirmacao de ausencia de alteracao de backend/banco

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.

## Como testar no sistema

1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Observar o campo `Cirurgiao` como representacao do executante do procedimento.
5. Observar `Regiao` como campo ainda dependente de confirmacao funcional.
6. Confirmar que o fluxo atual continua textual e local.
7. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Conclusao

`Cirurgiao` ficou formalmente reclassificado como campo ligado ao executante do procedimento no alvo final, enquanto `Regiao` permaneceu como dependencia ainda aberta, possivelmente exigindo novo modulo ou nova evidencia para fechar equivalencia. A prioridade real agora e abrir a frente de dependencia correspondente, e nao insistir em manter a leitura documental anterior como se o alvo final fosse apenas textual.
