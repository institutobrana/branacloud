# 14 - Mapa Funcional Final da Tela de Orcamento do EasyDental

## Objetivo

Este documento consolida a auditoria funcional da tela de **Orcamento** do EasyDental 7.6 BR, com base em:

- prints da interface
- manual do usuario localizado em `D:\UTIL\EasyDental_7.6_BR\EDS75_Server\EDS70\Help`
- analise estatica de binarios e scripts SQL legados

O foco e deixar o modulo descrito de forma fechada para servir como referencia de implementacao.

## Resumo executivo

O modulo Orcamento monta o planejamento financeiro de um **tratamento ativo** de um paciente, com as intervencoes cadastradas no odontograma e seus valores de paciente, convenio, parcelas, comissoes e ortodontia.

Quando o orçamento e aprovado:

- os debitos correspondentes sao gerados na conta corrente do paciente
- o sistema oferece abrir a conta corrente imediatamente
- os pagamentos posteriores seguem o fluxo financeiro normal

## Confirmado

### Estrutura geral da tela

- Existe o campo de **paciente ativo** com atalho para troca via menu de pacientes.
- Existe o combo de **tratamento** na parte superior direita.
- Existe uma grade principal com as intervencoes do tratamento.
- Existem abas na parte inferior:
  - `Principal`
  - `Detalhes`
  - `Convenio`
  - `Ortodontia`
  - `Comissoes`
- Existe uma grade auxiliar a direita com parcelas.
- Existem botoes no topo:
  - `Altera intervencao`
  - `Elimina intervencao`
  - `Aprova tratamento`
  - `Imprime`
  - `Fecha`

### Campos da grade principal

- `Regiao`
- `Codigo`
- `Cirurgiao`
- `Intervencao`
- `Paciente R$`
- `Convenio R$`

### Aba Principal

- `Valor total`
- `% de desconto`
- `Valor corrigido`
- `Total ja pago`
- `Total a pagar`
- `Indice`
- `Parcelas`
- `Calcular juros`
- `Valor da diferenca`
- `Recalcular parcelas`

### Aba Detalhes

- `Nº tratamento`
- `Validade`
- `Criacao do tratamento`
- `Ultima alteracao`
- `Ultima aprovacao`

### Aba Convenio

- `Nº da guia de tratamento`
- `Senha de autorizacao`
- `Total de repasse previsto`
- `Data prevista de pagamento`

### Aba Ortodontia

- `Valor da manutencao`
- `Vencimento`
- `Termino previsto`
- `Ativar manutencao de Ortodontia`

### Aba Comissoes

- botoes:
  - `Insere comissao`
  - `Elimina comissao`
  - `Distribui`
- grade:
  - `Nº`
  - `Valor`
  - `Cirurgiao`
  - `%`
  - `Comissao`

### Modal Propriedades da Intervencao

#### Aba Principal

- `Tabela de precos`
- `Cirurgiao`
- `Intervencao`
- `Regiao`
- `Situacao`
- `Marcacao`
- `Finalizacao`
- `Observacoes`
- `Inclusao`
- `Alteracao`
- botoes:
  - `Grava esta`
  - `Grava todas`
  - `Cancela`

#### Aba Financeiro

- `Receber do paciente`
- `Receber do convenio`
- `Previsao de recebimento`
- `Nao incluir no orcamento`
- `Codigo de glosa`
- `Mensagem de autorizacao`
- botoes:
  - `Grava esta`
  - `Grava todas`
  - `Cancela`

### Modal Eliminacao de Intervencao

- mensagem de confirmacao da exclusao da intervencao selecionada
- botoes:
  - `Sim`
  - `Nao`

### Modal Aprovacao

- mensagem:
  - `Orcamento aprovado. Deseja verificar a conta-corrente do paciente?`
- botoes:
  - `Sim`
  - `Nao`
  - `Ajuda...`

### Modal Impressao de Tratamento

- `Modelo de orcamento`
- `Saida`
- `Endereco`
- `Imprimir odontograma`
- `Imprimir valores das intervencoes`
- `Titulo do relatorio`
- `Mensagem para impressao`
- `Imprimir observacoes do tratamento`
- botoes:
  - `Ok`
  - `Cancela`

### Modal Altera Parcela

- `Parcela`
- `Data`
- `Valor da parcela`
- `Valor ja pago`
- botoes:
  - `Ok`
  - `Cancela`

### Conta corrente do paciente

- Apos aprovacao, o sistema cria os debitos do orçamento na conta corrente.
- Os lançamentos aparecem como:
  - `DB Paciente`
  - `CR Paciente`
- O saldo, total do tratamento e total ja pago passam a refletir o fluxo financeiro real.

## Inferido

### Origem dos dados da grade principal

- `Regiao` vem de `INTERVENCAO.S_DENTES` e, em alguns casos, `S_FACES`.
- `Codigo` vem de `TAB_PRC_ITEM.CODCONV`.
- `Cirurgiao` vem do `PRESTADOR` vinculado a intervencao.
- `Intervencao` vem de `TAB_PRC_ITEM.DESCRICAO`.
- `Paciente R$` vem de `INTERVENCAO.VALOR_PACIENTE`.
- `Convenio R$` vem de `INTERVENCAO.VALOR_REPASSE`.

### Regras de calculo

- `Valor total` e o consolidado do tratamento.
- `% de desconto` altera o valor final.
- `Valor corrigido` e o total apos o desconto.
- `Total ja pago` vem da conta corrente do paciente.
- `Total a pagar` e o saldo restante.
- `Parcelas` define quantas parcelas o orçamento tera, com limite de 36.
- `Valor da diferenca` guarda o ultimo ajuste de reforma do orçamento.
- `Recalcular parcelas` redistribui a diferenca conforme a opcao escolhida pelo sistema.

### Fluxo de aprovacao

- o paciente e o tratamento sao carregados
- as intervencoes sao exibidas
- o usuario pode editar valores, parcelas e dados financeiros
- o orçamento e impresso se necessario
- o usuario aprova o orçamento
- o sistema gera debitos na conta corrente do paciente
- o sistema pode abrir a conta corrente em seguida

### Comportamento de `Grava todas`

- no contexto do tratamento atual, grava as alteracoes para todas as intervencoes correspondentes daquele tratamento
- nao foi observado como alteracao em outros tratamentos

### Comportamento de `Nao incluir no orcamento`

- a intervencao continua existindo no tratamento e no odontograma
- apenas deixa de compor o calculo do orçamento daquele paciente

### Comportamento de ortodontia

- o tratamento pode ativar manutencao mensal
- o sistema usa valor, dia de vencimento e termino previsto para gerar mensalidades

## Pendente

### Ainda sem confirmacao totalmente fechada

- validacao automatica de `Codigo de glosa`
- validacao automatica de `Mensagem de autorizacao`
- formula exata de redistribuicao quando uma parcela individual e alterada
- resultado final visual da saida impressa em todos os cenarios
- efeito pratico de `Grava todas` em casos com multiplas intervencoes marcadas no odontograma, se houver particularidades de grupo

### Ja praticamente fechado, mas ainda sem um caso extra de validacao

- comportamento de `Imprimir valores das intervencoes` em combinacao com `Modelo de orcamento`
- comportamento da opcao `Imprimir observacoes do tratamento` em tratamentos com observacoes extensas
- funcionamento completo do fluxo de convenio em um caso real com repasse efetivo

## Impacto no banco

### `TRATAMENTO`

Campos relevantes:

- `NROTRA`
- `NROPAC`
- `NROTAB`
- `NROIND`
- `ID_PRESTADOR`
- `DATINI`
- `DATFIN`
- `DESCON`
- `STATTRA`
- `STATORC`
- `OBSTRA`
- `NROPAR`
- `TOTCONV`
- `TOTPART`
- `TOTCORCONV`
- `TOTCORPART`
- `CODTRA`
- `SENHA`
- `VALOR_DIFERENCA`
- `VALOR_JUROS`
- `TIPO_JUROS`
- `ID_CONVENIO`
- `USER_STAMP_APROVA`
- `ORTO_ID_INDICE`
- `ORTO_VALOR_MENS`
- `ORTO_ATIVAR_MENS`
- `ORTO_DIA_VENC`
- `ORTO_TERMINO`

### `INTERVENCAO`

Campos relevantes:

- `NROPAC`
- `NROINTPAC`
- `NROTRA`
- `ID_PRESTADOR`
- `NROTAB`
- `NROINT`
- `DATCAD`
- `DATFIN`
- `STATUS`
- `OBSERV`
- `ORCAMENTO`
- `VALOR_PACIENTE`
- `VALOR_REPASSE`
- `DATA_REPASSE`
- `COD_GLOSA`
- `MSG_AUTOR`
- `SEQUENCIA`
- `ID_INDICE_TAB`
- `VALOR_TAB_REP`
- `VALOR_TAB_PAC`
- `VALOR_INDICE`
- `VALOR_COMISSAO`

### `PARCELA`

- guarda as parcelas do orçamento
- campos:
  - `NROTRA`
  - `NROPAR`
  - `DATVEN`
  - `VALOR`
  - `ID_PRESTADOR`

### `TRATAMENTO_COMISSAO`

- guarda as comissoes vinculadas ao tratamento
- campos:
  - `NROTRA`
  - `NROPAR`
  - `ID_PRESTADOR`
  - `PERC_COMISSAO`

### Efeitos pos-aprovacao

- os débitos do orçamento sao criados na conta corrente do paciente
- os créditos de pagamento permanecem preservados em reaprovações
- o orçamento aprovado pode ser reaprovado sem perder pagamentos ja registrados

## Comportamento por aba

### Principal

- mostra valores totais, desconto, índice, parcelas e diferença
- controla o recálculo financeiro do orçamento

### Detalhes

- mostra identificacao temporal e administrativa do tratamento
- exibe numero, validade, criacao, ultima alteracao e ultima aprovacao

### Convenio

- concentra os dados do repasse e autorizacao
- referencia a operadora e sua previsao de pagamento

### Ortodontia

- ativa cobrança mensal
- define valor, vencimento e termino previsto

### Comissoes

- controla comissoes por parcela e por prestador
- permite inserir, remover e distribuir comissao

### Financeiro da intervencao

- ajusta os valores da propria intervencao no contexto do orçamento
- pode alterar o valor base que entra no calculo do orçamento atual

## Comportamento por modal

### Propriedades da intervencao - Principal

- edita dados clinicos da intervencao
- grava apenas a linha atual com `Grava esta`
- grava o conjunto relacionado com `Grava todas`

### Propriedades da intervencao - Financeiro

- ajusta o valor recebido do paciente e do convenio
- permite marcar a intervencao para nao entrar no orçamento
- registra glosa e mensagem de autorizacao

### Elimina intervencao

- pede confirmacao antes de excluir
- remove a intervencao selecionada do fluxo atual

### Aprovacao

- confirma a aprovacao do orçamento
- oferece abrir a conta corrente do paciente

### Impressao de tratamento

- define o modelo do orcamento
- escolhe a saida
- permite imprimir odontograma, valores, observacoes e titulo do relatorio

### Altera parcela

- permite ajustar data e valor de uma parcela
- o valor ja pago e apenas informativo no modal

## Mapa funcional resumido

1. O paciente e escolhido.
2. O tratamento ativo e carregado.
3. As intervencoes sao exibidas.
4. O usuario edita valores, parcelas, convenio, ortodontia ou comissoes.
5. O sistema recalcula o orçamento.
6. O usuario imprime se desejar.
7. O usuario aprova o orçamento.
8. O sistema gera os debitos na conta corrente.
9. O fluxo financeiro do paciente passa a refletir o orçamento aprovado.

## Conclusao

O modulo Orcamento do EasyDental esta funcionalmente descrito o suficiente para replicacao fiel no Brana Cloude, com a principal ressalva de algumas regras finas de validacao e de redistribuicao de parcelas que ainda dependem de validacao adicional no manual ou em outro caso de uso real.

## Especificacao de implementacao para o Brana Cloude

### Principios de modularizacao

- O backend nao deve concentrar a solucao em uma unica rota grande.
- O frontend nao deve concentrar a solucao em um unico arquivo monolitico.
- Cada dominio funcional deve ter arquivo proprio.
- Cada modal deve ter arquivo proprio.
- Os nomes dos arquivos devem ser em ASCII, em `kebab-case`, sem acentos.
- Exemplo de nome de tela: `orcamento.js`.
- Exemplo de nome de modal: `altera-parcela.js`.
- Exemplo de nome de modal: `propriedades-da-intervencao.js`.

### Estrutura sugerida de arquivos

#### Backend

- `backend/routes/orcamento_routes.py`
- `backend/services/orcamento_service.py`
- `backend/services/orcamento_financeiro_service.py`
- `backend/services/orcamento_impressao_service.py`
- `backend/schemas/orcamento_schema.py`
- `backend/models/orcamento.py` apenas se for necessario criar modelos agregadores novos; caso contrario, reutilizar os modelos existentes do dominio

#### Frontend

- `frontend/orcamento/orcamento.js`
- `frontend/orcamento/orcamento-api.js`
- `frontend/orcamento/orcamento-state.js`
- `frontend/orcamento/orcamento-render.js`
- `frontend/orcamento/modals/propriedades-da-intervencao.js`
- `frontend/orcamento/modals/elimina-intervencao.js`
- `frontend/orcamento/modals/aprovacao-orcamento.js`
- `frontend/orcamento/modals/impressao-tratamento.js`
- `frontend/orcamento/modals/altera-parcela.js`

### Modelo de dados

#### Entidades a reutilizar

- `Paciente`
- `Tratamento`
- `PrestadorOdonto`
- `ConvenioOdonto`
- `ProcedimentoTabela`
- `ItemProcedimento` ou equivalente de tabela de procedimentos
- `Parcela`
- `TratamentoComissao`

#### Entidade funcional do orçamento

O modulo de implementacao deve tratar o orçamento como uma visao operacional do tratamento, com os seguintes dados principais:

- identificacao do paciente
- identificacao do tratamento
- lista de intervencoes
- totais financeiros
- parcelas
- comissoes
- dados de convenio
- dados de ortodontia
- metadados de aprovacao e alteracao

#### Campos de negocio que precisam existir

- `valor_total`
- `percentual_desconto`
- `valor_corrigido`
- `total_ja_pago`
- `total_a_pagar`
- `indice_financeiro`
- `quantidade_parcelas`
- `valor_diferenca`
- `receber_paciente`
- `receber_convenio`
- `previsao_recebimento`
- `nao_incluir_orcamento`
- `codigo_glosa`
- `mensagem_autorizacao`
- `orto_ativo`
- `orto_valor_mensal`
- `orto_dia_vencimento`
- `orto_termino_previsto`

### Endpoints

#### Leitura

- `GET /orcamentos/contexto`
  - retorna paciente, tratamento, resumo, status e combinacoes necessarias para renderizacao inicial
- `GET /orcamentos/{tratamento_id}/intervencoes`
  - retorna a grade principal
- `GET /orcamentos/{tratamento_id}/parcelas`
  - retorna a grade auxiliar da direita
- `GET /orcamentos/{tratamento_id}/comissoes`
  - retorna a aba de comissoes
- `GET /orcamentos/{tratamento_id}/detalhes`
  - retorna os dados da aba Detalhes
- `GET /orcamentos/{tratamento_id}/convenio`
  - retorna os dados da aba Convenio
- `GET /orcamentos/{tratamento_id}/ortodontia`
  - retorna os dados da aba Ortodontia

#### Escrita

- `PATCH /orcamentos/{tratamento_id}/principal`
  - atualiza desconto, indice, parcelas, valor corrigido e valor da diferenca
- `PATCH /orcamentos/{tratamento_id}/convenio`
  - atualiza guia, senha, repasse e previsao de pagamento
- `PATCH /orcamentos/{tratamento_id}/ortodontia`
  - atualiza manutencao mensal e vencimentos
- `PATCH /orcamentos/intervencoes/{intervencao_id}`
  - atualiza campos da intervencao
- `DELETE /orcamentos/intervencoes/{intervencao_id}`
  - exclui a intervencao do contexto do tratamento
- `POST /orcamentos/intervencoes/{intervencao_id}/aprovar`
  - aprova a intervencao
- `POST /orcamentos/{tratamento_id}/recalcular-parcelas`
  - aplica a regra de reforma do orcamento
- `PATCH /orcamentos/parcelas/{parcela_id}`
  - atualiza data e valor da parcela individual
- `POST /orcamentos/{tratamento_id}/aprovacao`
  - aprova o orcamento e dispara os lancamentos na conta corrente
- `POST /orcamentos/{tratamento_id}/impressao`
  - gera a configuracao ou saida do relatorio

### Eventos de UI

- abrir o modulo pelo menu `Tratamento -> Orcamento`
- carregar o paciente ativo ao abrir a tela
- trocar paciente pelo botao de busca de pacientes
- trocar tratamento pelo combo superior
- selecionar intervencao na grade principal
- abrir modal de propriedades da intervencao ao editar a linha
- abrir modal de exclusao ao remover intervencao
- abrir modal de aprovacao ao aprovar o orçamento
- abrir modal de impressao ao imprimir
- abrir modal de parcela ao dar duplo clique em uma parcela
- recalcular totais sempre que:
  - desconto mudar
  - valor corrigido mudar
  - parcelas mudarem
  - uma intervencao for excluida ou alterada

### Regras de negocio

- o orçamento sempre pertence ao tratamento ativo do paciente
- um paciente pode ter varios tratamentos
- cada tratamento corresponde a um orçamento
- `Grava esta` salva somente a intervencao atual
- `Grava todas` salva as intervencoes do tratamento atual relacionadas ao contexto em edicao
- `Nao incluir no orcamento` remove a intervencao do calculo financeiro, sem apagar a intervencao do tratamento
- o valor recebido do paciente na aba Financeiro altera o valor da intervencao no contexto do orçamento atual
- `Codigo de glosa` e `Mensagem de autorizacao` devem ser persistidos, mesmo que a validacao automatica ainda precise ser confirmada
- a alteracao de uma parcela deve recalcular as subsequentes
- a reforma de orcamento deve usar o valor da diferenca
- a aprovacao gera os debitos na conta corrente do paciente
- os pagamentos ja registrados devem ser preservados quando o orçamento for reaprovado
- a ortodontia pode gerar mensalidades separadas do fluxo normal de parcelas
- a impressao deve respeitar o modelo escolhido

### Comportamento por aba e por modal

#### Aba Principal

- calcular totais
- aplicar desconto
- recalcular valor corrigido
- distribuir parcelas
- preparar reforma de orcamento

#### Aba Detalhes

- mostrar dados administrativos do tratamento
- mostrar validade e datas de criacao/alteracao/aprovacao

#### Aba Convenio

- controlar guia, senha, repasse e previsao de pagamento

#### Aba Ortodontia

- controlar mensalidade de manutencao
- controlar vencimento e termino previsto

#### Aba Comissoes

- controlar comissao por tratamento e por parcela
- permitir distribuicao entre prestadores

#### Modal Propriedades da Intervencao

- editar dados clinicos
- editar valores financeiros
- editar situacao da intervencao
- gravar uma ou varias intervencoes conforme o contexto

#### Modal Altera Parcela

- alterar data da parcela
- alterar valor da parcela
- preservar o valor ja pago como dado de consulta
- recalcular as parcelas seguintes

#### Modal Impressao de Tratamento

- escolher modelo
- escolher saida
- incluir odontograma se marcado
- incluir valores das intervencoes se marcado
- incluir observacoes se marcado

#### Modal Aprovacao

- confirmar geracao de debitos
- oferecer abertura imediata da conta corrente

#### Modal Eliminacao de Intervencao

- confirmar exclusao da intervencao selecionada

### Dependencias entre modulos

- `orcamento` depende de `odontograma` para a origem das intervencoes
- `orcamento` depende de `tratamentos` para selecao do tratamento ativo
- `orcamento` depende de `financeiro` para lancamento das parcelas e baixa
- `orcamento` depende de `prestadores` para cirurgiao e comissoes
- `orcamento` depende de `convenios_planos` para dados de convenio
- `orcamento` depende de `indices_financeiros` para o indice monetario

### Nota de implementacao

No momento da implementacao, a tela principal pode ser isolada em um arquivo `orcamento.js`, e cada modal deve ficar em um arquivo separado. O `app.js` deve funcionar apenas como ponto de montagem e navegacao, sem concentrar a regra de negocio da feature.
