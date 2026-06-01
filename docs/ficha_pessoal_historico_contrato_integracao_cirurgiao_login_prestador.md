# Ficha Pessoal - Historico - Contrato de integracao de Cirurgiao responsavel com login/prestador

## Objetivo

Definir documental e tecnicamente o contrato da futura integracao do campo `Cirurgiao responsavel` da aba `Historico` com o contexto de login/prestador ja existente no Brana Cloud, sem alterar ainda o comportamento funcional.

Esta etapa e exclusivamente contratual/documental. Nao altera frontend, backend, banco, schema, migration, seed, endpoint, model ou persistencia.

## Base ja existente no Brana que sera reaproveitada

### Confirmado

- Existe cadastro de prestadores em `PrestadorOdonto`.
- Existe vinculo explicito entre usuario e prestador via `Usuario.prestador_id` e `PrestadorOdonto.usuario_id`.
- O contexto de sessao ja expõe `prestador_id` em `GET /me` e no objeto `sessaoAtual` do frontend.
- O frontend ja consome `GET /cadastros/prestadores` e ja trabalha com a lista de prestadores em outras telas.
- O dominio de tratamento ja possui campo de cirurgiao responsavel e ja defaulta esse campo a partir do usuario logado.
- A aba `Historico` ja persiste seus dados em `extra.historico_aba` e reaplica esse envelope ao reabrir o paciente.

### Fortemente provavel

- O mesmo contexto que hoje sustenta o default de cirurgiao no tratamento pode servir como ponto de partida para o Historico.
- A lista de prestadores ja existente e suficiente como catalogo base de opcoes para a combo do campo.

## Contrato funcional proposto para o campo Cirurgiao responsavel na aba Historico

### Proposta central

- O campo `Cirurgiao responsavel` deve passar a representar o prestador/executante do procedimento dentro da aba `Historico`.
- A integracao inicial deve usar o contexto de sessao/prestador ja existente como fonte principal de default.
- O campo continua editavel manualmente depois do preenchimento inicial.

### Alternativas documentadas

#### Alternativa A - default por sessao/prestador logado

- Usar `sessaoAtual.prestador_id` no frontend como valor inicial.
- No backend, esse mesmo valor corresponde a `current_user.prestador_id` no payload de `/me`.
- Se existir prestador vinculado ao usuario, o valor inicia com esse prestador.

Vantagem:

- Reaproveita a estrutura que ja existe no login e na sessao.
- Segue o caminho mais conservador e mais previsivel.

Risco:

- Se o usuario logado nao tiver prestador vinculado, o campo pode nascer vazio.

#### Alternativa B - default por lista de prestadores, com heranca indireta do tratamento

- Usar o catalogo de prestadores ja existente como base visual.
- Buscar o default do tratamento como referencia de comportamento.
- Permitir preenchimento inicial por heuristica adicional.

Vantagem:

- Traz mais proximidade com o dominio clinico do tratamento.

Risco:

- Mistura duas regras de dominio que ainda nao estao fechadas para o Historico.
- Aumenta a chance de improvisar equivalencia antes de fechar a regra real.

### Recomendacao final

- Adotar a **Alternativa A** como regra minima segura.
- Deixar o catalogo de prestadores como origem visual de opcoes.
- Nao herdar o default de tratamento nesta primeira integracao.

## Regra minima segura de default

- Se houver `prestador_id` na sessao, o campo pode nascer com esse prestador.
- Se nao houver `prestador_id` na sessao, o campo deve nascer vazio.
- Se houver usuario associado a prestador, isso ja aparece no proprio contexto de sessao e nao precisa de uma segunda regra paralela nesta etapa.
- Nao inventar default por tratamento, nem por Regiao, nem por outro campo clinico ainda nao fechado.

## Regra de editabilidade manual

- O campo deve continuar editavel manualmente apos o preenchimento inicial.
- O default nao pode bloquear a troca pelo usuario.
- A edicao manual deve funcionar na janela de `Propriedades da linha` e na criacao/insercao de nova linha.
- A integracao nao deve transformar o campo em leitura apenas.

## Origem proposta do catalogo/lista

### Recomendacao

- O catalogo deve vir do cadastro de prestadores ja existente, reutilizando `GET /cadastros/prestadores`.
- A ordenacao e a lista devem seguir o catalogo ja disponivel no sistema, sem criar novo endpoint nesta primeira fase.
- Se o catalogo retornar o prestador sistemico `Clinica`, ele deve ser tratado apenas como parte do retorno atual do cadastro, sem criar regra nova de exclusao manual nesta etapa.

### Observacao

- O uso de lista catalogada nao significa que o campo deixe de ser editavel manualmente.
- O catalogo e apenas a origem de opcoes para selecao, nao a regra de default.

## O que entra na primeira integracao

- Preenchimento inicial do campo `Cirurgiao responsavel`.
- Disponibilizacao da lista de prestadores do cadastro existente.
- Persistencia do valor escolhido no envelope atual da aba Historico.
- Reaplicacao do valor ao reabrir o paciente.
- Manutencao da edicao manual.
- Atualizacao do modal `Propriedades da linha`.

## O que fica fora da primeira integracao

- Qualquer integracao com `Regiao`.
- Qualquer dependencia com tratamento/intervencao na aba Historico.
- Qualquer auto-preenchimento que tente reproduzir sem prova visual o comportamento exato do EasyDental.
- Qualquer nova regra de backend, novo endpoint, nova migration ou novo modelo.
- Qualquer tentativa de substituir a persistencia atual da aba Historico por outro esquema nesta fase.

## Riscos observados

- Default incorreto se a sessao estiver sem prestador vinculado.
- Mistura de contrato entre Historico e Tratamento caso o default de tratamento seja importado sem criterio.
- Confusao do usuario se o campo virar somente lista sem permitir edicao manual.
- Divergencia semantica se a lista incluir itens estruturais sem regra clara de uso.

## Dependencias ainda abertas

- Confirmacao visual futura do comportamento exato do EasyDental para auto-preenchimento.
- Confirmacao visual futura da origem da combo/lista do legado.
- Decisao posterior sobre se `Regiao` ou o tratamento devem ou nao influenciar alguma heuristica adicional.
- Eventual necessidade de um pequeno helper compartilhado entre Tratamento e Historico para resolver default de executante.

## Menor subetapa segura de implementacao depois deste contrato

- Criar um helper local e conservador na aba Historico para:
  - ler `sessaoAtual.prestador_id`;
  - usar o catalogo de `GET /cadastros/prestadores`;
  - preencher o campo `Cirurgiao responsavel` somente quando houver prestador na sessao;
  - manter a troca manual livre;
  - reaplicar o valor persistido no envelope atual.

## Resposta objetiva do contrato

- A origem funcional do campo deve ser o contexto de sessao/prestador ja existente.
- A regra minima segura de default deve usar `sessaoAtual.prestador_id` quando houver valor, e deixar vazio quando nao houver.
- O catalogo/lista deve vir do cadastro de prestadores ja existente.
- A edicao manual continua obrigatoria.
- A primeira integracao nao deve misturar `Regiao` nem a logica de tratamento.

## Conclusao

O Brana ja possui base suficiente para sustentar o contrato funcional do campo `Cirurgiao responsavel` sem improviso: prestadores, vinculo usuario/prestador, contexto de sessao e uma lista catalogada de prestadores. O contrato recomendado e conservador: default pela sessao, catalogo de prestadores como lista, edicao manual preservada e exclusao total de qualquer dependencia com Regiao ou com uma heuristica de tratamento nesta primeira fase.
