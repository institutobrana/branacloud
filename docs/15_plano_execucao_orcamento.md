# 15 - Plano de Execucao do Modulo Orcamento

## Objetivo

Transformar a especificacao funcional do modulo Orcamento em um roteiro tecnico de implementacao para o Brana Cloude, com prioridade, risco, dependencias e criterio de aceite por arquivo.

## Regras de execucao

- Nao iniciar implementacao de codigo nesta etapa.
- Manter o modulo separado em arquivos pequenos e nomeados por responsabilidade.
- Preservar `frontend/app.js` como ponto de entrada minimo.
- Registrar antes de cada onda de implementacao.
- Fazer backup/checkpoint antes da primeira mudanca de codigo.
- Emitir aviso ao usuario antes de qualquer alteracao real em arquivo.
- Atualizar este documento e o roadmap sempre que uma etapa for concluida.

## Mapa de prioridades

### P0 - Base critica

#### `backend/routes/orcamento_routes.py`
- Responsabilidade: expor as rotas do modulo Orcamento.
- Entradas: contexto autenticado, identificador do paciente, identificador do tratamento, payloads de alteracao.
- Saidas: payloads consolidados, confirmacoes de aprovacao, metadados de impressao, respostas de erro padronizadas.
- Dependencias: `orcamento_service.py`, `orcamento_financeiro_service.py`, `orcamento_schema.py`, autenticacao e permissao do Brana Cloude.
- Risco de regressao: alto.
- Criterio de aceite: a rota principal carrega o orcamento correto do tratamento ativo sem contaminar outros tratamentos.

#### `backend/services/orcamento_service.py`
- Responsabilidade: montar o agregado funcional da tela Orcamento.
- Entradas: paciente, tratamento, intervencoes, parcelas, comissoes, dados de convenio e ortodontia.
- Saidas: view model do orcamento, dados de abas, grades e modais.
- Dependencias: modelos de tratamento, intervencao, conta corrente, prestador, convenio e tabelas de preco.
- Risco de regressao: alto.
- Criterio de aceite: a tela recebe um conjunto consistente de dados e cada aba reflete o mesmo tratamento.

#### `backend/services/orcamento_financeiro_service.py`
- Responsabilidade: regras de valor, desconto, parcelas, aprovacao e reflexo financeiro.
- Entradas: valores de paciente, convenio, desconto, parcela, status de aprovacao e alteracoes de intervencao.
- Saidas: total do tratamento, saldo, parcelas recalculadas, lancamentos financeiros e payload de confirmacao.
- Dependencias: conta corrente, historico financeiro, tratamento e intervencao.
- Risco de regressao: muito alto.
- Criterio de aceite: valores batem com o contrato funcional e a aprovacao gera o efeito financeiro esperado.

#### `backend/schemas/orcamento_schema.py`
- Responsabilidade: contratos de entrada e saida do modulo.
- Entradas: payloads de consulta, edicao, aprovacao, parcela e impressao.
- Saidas: schemas validados para backend e frontend.
- Dependencias: estrutura das rotas e dos servicos.
- Risco de regressao: medio.
- Criterio de aceite: contratos documentados e coerentes com os modais e abas.

#### `docs/14_especificacao_tela_orcamento_easy_dental.md`
- Responsabilidade: fonte funcional consolidada do modulo.
- Entradas: auditori as, prints, manual e validacoes.
- Saidas: especificacao fechada e pendencias registradas.
- Dependencias: evidence base do EasyDental e consolidacao tecnica do Brana Cloude.
- Risco de regressao: baixo.
- Criterio de aceite: documento fechado e rastreavel.

### P1 - Experiencia principal

#### `frontend/orcamento/orcamento.js`
- Responsabilidade: orquestrar a tela principal.
- Entradas: contexto de paciente, tratamento, dados do backend e acoes de UI.
- Saidas: abertura da tela, troca de abas, atualizacao da grade e abertura de modais.
- Dependencias: `orcamento-api.js`, `orcamento-state.js`, `orcamento-render.js`.
- Risco de regressao: alto.
- Criterio de aceite: a tela abre e navega sem depender de monolito.

#### `frontend/orcamento/orcamento-api.js`
- Responsabilidade: encapsular chamadas HTTP do modulo.
- Entradas: filtros, IDs de paciente/tratamento e payloads de edicao.
- Saidas: respostas normalizadas para a camada de UI.
- Dependencias: rotas de orcamento do backend.
- Risco de regressao: medio.
- Criterio de aceite: chamadas claras, sem acoplamento ao DOM.

#### `frontend/orcamento/orcamento-state.js`
- Responsabilidade: estado local da tela e sincronizacao entre grade, abas e modais.
- Entradas: dados carregados, selecao do tratamento, edicoes pendentes.
- Saidas: estado consistente para renderizacao.
- Dependencias: API e renderer.
- Risco de regressao: alto.
- Criterio de aceite: a tela nao perde o tratamento ou a intervencao selecionada em navegacao normal.

#### `frontend/orcamento/orcamento-render.js`
- Responsabilidade: construir a UI principal e atualizar as areas da tela.
- Entradas: state consolidado.
- Saidas: DOM renderizado da grade principal, abas e grade lateral de parcelas.
- Dependencias: estado e dados da API.
- Risco de regressao: alto.
- Criterio de aceite: os blocos da tela se mantem coerentes com os prints e com a especificacao.

#### `frontend/orcamento/modals/propriedades-da-intervencao.js`
- Responsabilidade: editar intervencao em abas principal e financeiro.
- Entradas: intervencao selecionada, valores e observacoes.
- Saidas: alteracao da intervencao no estado local e requisicao de salvamento.
- Dependencias: backend de orcamento, regras de financeiro e modal de confirmacao.
- Risco de regressao: alto.
- Criterio de aceite: salvar altera somente a intervencao e respeita `Grava esta` e `Grava todas`.

#### `frontend/orcamento/modals/elimina-intervencao.js`
- Responsabilidade: confirmar exclusao de intervencao.
- Entradas: nome da intervencao e contexto do tratamento.
- Saidas: confirmacao ou cancelamento.
- Dependencias: service de exclusao e estado da tela.
- Risco de regressao: baixo.
- Criterio de aceite: a exclusao e clara e nao remove dados sem confirmacao.

#### `frontend/orcamento/modals/aprovacao-orcamento.js`
- Responsabilidade: confirmar aprovacao e oferecer salto para conta corrente.
- Entradas: estado da aprovacao e resultado do backend.
- Saidas: aprovacao concluida, abertura opcional da conta corrente.
- Dependencias: service financeiro e modulo de conta corrente.
- Risco de regressao: alto.
- Criterio de aceite: apos aprovar, o fluxo financeiro e atualizado e a conta corrente pode ser aberta.

#### `frontend/orcamento/modals/altera-parcela.js`
- Responsabilidade: editar parcela individual.
- Entradas: numero da parcela, data, valor e valor ja pago.
- Saidas: parcela alterada e recalculo do cronograma.
- Dependencias: service financeiro e grade lateral de parcelas.
- Risco de regressao: muito alto.
- Criterio de aceite: a alteracao de uma parcela nao corrompe o restante do plano.

#### `frontend/orcamento/modals/propriedades-da-intervencao-financeiro.js`
- Responsabilidade: editar valores recebidos do paciente e do convenio.
- Entradas: valores financeiros, flag de exclusao do orcamento, codigo de glosa e mensagem de autorizacao.
- Saidas: intervencao com novo valor financeiro e reflexo no total do tratamento.
- Dependencias: service financeiro e persistencia da intervencao.
- Risco de regressao: alto.
- Criterio de aceite: a mudanca financeira se limita ao tratamento corrente.

#### `frontend/orcamento/modals/parcela-list-item.js`
- Responsabilidade: representar um item da grade de parcelas.
- Entradas: parcela corrente.
- Saidas: linha de UI para edicao/selecao.
- Dependencias: renderer principal.
- Risco de regressao: baixo.
- Criterio de aceite: item visual consistente e sem logica de negocio.

### P2 - Acabamento e impressao

#### `backend/services/orcamento_impressao_service.py`
- Responsabilidade: montar os dados e parametros de impressao.
- Entradas: tratamento, intervencoes, modelo de orcamento e opcoes de saida.
- Saidas: estrutura pronta para relatorio/impressao.
- Dependencias: service principal e dados financeiros.
- Risco de regressao: medio.
- Criterio de aceite: a impressao respeita os campos da modal e o modelo selecionado.

#### `frontend/orcamento/modals/impressao-tratamento.js`
- Responsabilidade: coletar as opcoes da impressao.
- Entradas: modelo, saida, endereco, titulo, mensagem e flags.
- Saidas: requisicao de impressao.
- Dependencias: service de impressao e fluxo de aprovacao.
- Risco de regressao: medio.
- Criterio de aceite: a modal reproduz os campos definidos no mapa funcional.

#### `frontend/app.js`
- Responsabilidade: apenas registrar a entrada do modulo, sem virar monolito novamente.
- Entradas: comando de abertura do modulo e contexto do usuario/paciente.
- Saidas: acionar a tela do Orcamento.
- Dependencias: modulo principal `frontend/orcamento/orcamento.js`.
- Risco de regressao: alto se houver refatoracao ampla.
- Criterio de aceite: o app apenas roteia para o modulo.

## Roadmap de execucao

### Fase 1 - Fundacao
- Criar contratos e schemas.
- Criar servico principal do orcamento.
- Criar servico financeiro.
- Registrar checkpoint documental.

### Fase 2 - Tela principal
- Criar a camada de API do frontend.
- Criar estado local.
- Criar renderer principal.
- Integrar a abertura da tela.

### Fase 3 - Modais centrais
- Implementar propriedades da intervencao.
- Implementar eliminacao.
- Implementar aprovacao.
- Implementar alteracao de parcela.

### Fase 4 - Impressao e fechamento
- Implementar a modal de impressao.
- Consolidar os fluxos finais.
- Validar o reflexo em conta corrente.
- Registrar aceite final.

## Protocolo de segurança antes da implementacao

1. Atualizar este documento e o roadmap.
2. Fazer checkpoint de seguranca antes do primeiro arquivo de codigo.
3. Implementar apenas uma onda por vez.
4. Validar comportamento minimo apos cada onda.
5. Fazer commit de marco ao final de cada bloco importante.
6. Se surgir regressao, parar e registrar antes de seguir.

## Status da Onda 1

- Base de backend iniciada com checkpoint fisico criado em `backups_modularizacao/orcamento_onda1_pre_impl_20260617_121407`.
- Novos arquivos isolados criados para schema, services e routes do Orçamento.
- Validacao runtime completa concluida em backend real com login autentico e chamadas principais do modulo.

## Pronto para a Onda 2

- O backend da Onda 1 pode ser tratado como baseline validado.
- O proximo checkpoint deve ser isolado para frontend antes de qualquer alteracao da Onda 2.
- Os arquivos da Onda 2 permanecem os mesmos definidos abaixo.

## Pendencias atuais

- Confirmar se o backend possui modelos ou tabelas suficientes para o agregado do orcamento sem migration nova.
- Confirmar o ponto exato de integracao com a conta corrente no Brana Cloude.
- Confirmar o layout final da impressao antes do P2.
- Confirmar se `Grava todas` deve atuar somente no tratamento atual em todos os cenarios de grupo.
