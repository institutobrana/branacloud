# Ficha Pessoal - Historico - Microetapa 3 - auditoria curta de Cirurgiao e Regiao

## Objetivo

Mapear com cuidado como os campos `Cirurgiao` e `Regiao` sao tratados hoje na aba `Historico`, sem implementar melhoria funcional ainda.

Esta microetapa e documental. Nao altera frontend, backend, banco, schema, migration, seed, endpoint ou model.

## Base usada

- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/ficha_pessoal_historico_priorizacao_diferencas_backlog.md`
- `docs/ficha_pessoal_historico_easydental_engenharia_reversa.md`
- `docs/ficha_pessoal_historico_easydental_vs_brana_comparativo_detalhado.md`
- `docs/ficha_pessoal_historico_microetapa_1_harmonizacao_textual_visual.md`
- `docs/ficha_pessoal_historico_microetapa_2_refino_visual_modal_propriedades.md`
- `frontend/js/modules/ficha-pessoal-aba-historico.js`
- `frontend/app.js`

## Perguntas respondidas nesta auditoria

1. Como `Cirurgiao` e tratado hoje no modulo da aba Historico?
2. Como `Regiao` e tratado hoje no modulo da aba Historico?
3. Esses campos sao hoje puramente textuais?
4. Em quais pontos do fluxo eles aparecem?
5. Existe algum gancho seguro para futura lista ou lookup sem quebrar o fluxo?
6. Ha hoje alguma dependencia ou helper reaproveitavel no Brana para prestador/cirurgiao?
7. Ha hoje alguma dependencia ou helper reaproveitavel no Brana para regiao/dente?
8. Qual seria a menor evolucao segura futura?

## Estado atual de Cirurgiao

### Na grade

- O cabecalho da grade exposto pelo modulo segue com a coluna `Cirurgiao`.
- As linhas guardam o valor como texto simples na segunda celula.

### Na edicao inline

- A linha entra em edicao local.
- A celula de `Cirurgiao` recebe `contentEditable = true` junto com as outras celulas da linha.
- Nao existe combo, lookup ou seletor dedicado nesta etapa.

### No modal de Propriedades da linha

- O modal expoe `Cirurgiao` como um campo de texto.
- O valor e carregado da segunda celula da linha.
- O valor e reaplicado diretamente na mesma celula quando o modal e aplicado.

### Na serializacao

- `serializarHistoricoAba()` percorre as linhas da grade e inclui o conteudo textual de cada celula em `rows[].cells`.
- `Cirurgiao` segue como texto livre no segundo slot da lista de celulas.

### Na reaplicacao

- `onPacienteAplicado(extraHistorico)` chama `aplicarHistoricoAba(extraHistorico?.historico_aba ?? null)`.
- Ao reaplicar, o segundo valor de `cells` volta para a segunda celula da linha.

### Leitura atual

- Hoje `Cirurgiao` e tratado como texto local.
- Nao ha, no modulo atual, um seletor dedicado, um helper de lookup ou um adaptador de prestador pronto para uso direto nesta aba.

## Estado atual de Regiao

### Na grade

- O cabecalho da grade exposto pelo modulo segue com a coluna `Regiao`.
- As linhas guardam o valor como texto simples na terceira celula.

### Na edicao inline

- A linha entra em edicao local.
- A celula de `Regiao` recebe `contentEditable = true` junto com as demais celulas.
- Nao existe lookup ou lista fechada nesta etapa.

### No modal de Propriedades da linha

- O modal expoe `Regiao` como um campo de texto.
- O valor e carregado da terceira celula da linha.
- O valor e reaplicado diretamente na mesma celula quando o modal e aplicado.

### Na serializacao

- `serializarHistoricoAba()` inclui o conteudo textual da terceira celula em `rows[].cells`.
- `Regiao` segue como texto livre no terceiro slot da lista de celulas.

### Na reaplicacao

- `onPacienteAplicado(extraHistorico)` reconstrui a grade a partir de `extra.historico_aba`.
- O terceiro valor de `cells` volta para a terceira celula da linha.

### Leitura atual

- Hoje `Regiao` e tratado como texto local.
- Nao ha, no modulo atual, helper de regiao/dente pronto para lookup formal nesta aba.

## Pontos do fluxo em que os campos participam

- grade
- edicao inline
- modal de Propriedades da linha
- serializacao para `extra.historico_aba`
- reaplicacao ao reabrir o paciente

## Como entram no payload e como reaparecem

- O formato da aba Historico e serializado por `serializarHistoricoAba()`.
- O resultado entra em `extra.historico_aba` quando a ficha e gravada.
- Ao reabrir o paciente, `fichaHistoricoAba.onPacienteAplicado(item?.extra || null)` reaplica esse envelope.
- O modulo reconstrui as linhas usando `aplicarHistoricoAba(extraHistorico?.historico_aba ?? null)`.
- Portanto, `Cirurgiao` e `Regiao` reaparecem exatamente como texto guardado nas celulas da linha.

## Ganchos seguros para futura evolucao

- O modulo ja centraliza o ciclo em:
  - `aplicarHistoricoAba()`
  - `serializarHistoricoAba()`
  - `historicoAbrirPropriedadesLinhaSelecionada()`
  - `historicoAplicarPropriedadesLinha()`
- Isso permite, no futuro, substituir apenas a origem/editor de `Cirurgiao` e `Regiao` sem desmontar toda a aba.
- O ponto mais seguro para evolucao futura parece ser um adaptador local no modulo, sem mudar o envelope de persistencia ja em uso.

## Dependencias reaproveitaveis identificadas

### Para Cirurgiao

- Existe no `frontend/app.js` o campo global de ficha `cirurgiao_responsavel`, mas ele nao esta acoplado diretamente ao Historico.
- O modulo do Historico nao expoe hoje nenhum helper de prestador/cirurgiao reutilizavel.
- A maior oportunidade futura e ligar o campo a uma fonte de cadastro ou lista ja existente, sem mudar a serializacao da aba.

### Para Regiao

- Nao foi identificado, neste recorte, um helper local especifico de regiao/dente reutilizavel pelo Historico.
- A oportunidade futura parece ser um lookup local leve, caso a regra clinica do legado precise ser aproximada.

## Riscos de mexer nesses campos

- Trocar `Cirurgiao` ou `Regiao` por combo agora pode quebrar a simplicidade do fluxo local e exigir mapeamento adicional na serializacao.
- Conectar a campos externos sem adapter pode introduzir dependencia cruzada desnecessaria.
- Alterar o tipo de dado sem documentar a compatibilidade pode afetar a reaplicacao do envelope `extra.historico_aba`.

## Menor evolucao segura futura

1. Criar um pequeno contrato local de origem para `Cirurgiao` e `Regiao` no proprio modulo, sem trocar ainda o campo por combo.
2. Se a evidencia pratica confirmar ganho real, transformar um dos campos em seletor assistido leve.
3. Somente depois, integrar com cadastro existente ou lookup mais formal.

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
4. Abrir uma linha ja existente.
5. Conferir o valor de `Cirurgiao` na grade e no modal.
6. Conferir o valor de `Regiao` na grade e no modal.
7. Aplicar uma alteracao textual controlada.
8. Clicar em `Grava`.
9. Fechar e reabrir o paciente.
10. Confirmar que os valores reaparecem exatamente como texto salvo.

## Conclusao

`Cirurgiao` e `Regiao` permanecem hoje como campos textuais locais na aba Historico, com reaplicacao e serializacao ja funcionando pelo envelope `extra.historico_aba`. A menor evolucao segura futura nao parece ser um combo imediato, e sim um contrato local de origem para permitir uma evolucao controlada depois.
