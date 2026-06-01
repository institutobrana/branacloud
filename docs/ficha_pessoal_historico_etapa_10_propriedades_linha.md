# Ficha Pessoal - Historico - Etapa 10 - Propriedades da linha

## Objetivo

Implementar a primeira versao funcional e conservadora de `Propriedades da linha` para a aba Historico, atuando sobre a linha selecionada sem criar backend novo.

## Escopo aplicado

- O botao `Propriedades da linha` passou a abrir uma janela modal local sobre a linha atualmente selecionada.
- A janela foi criada no proprio modulo da aba Historico, sem alterar HTML base.
- A implementacao ficou concentrada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- Nao houve alteracao de backend, banco, schema, migration, seed ou endpoint.

## Estrutura adotada

- Foi usado um modal local com backdrop e formulario simples.
- A janela foi construida dinamicamente pelo modulo quando necessario.
- O modal oferece salvamento e cancelamento locais, com foco inicial no campo `Data`.

## Campos funcionais nesta etapa

- `Data`
- `Cirurgiao`
- `Regiao`
- `Historico / Descricao`

## Campos do EasyDental que ficaram pendentes

- `Cor de fundo`
- `Data de insercao`
- `Data de atualizacao`

Esses campos ficaram documentados no proprio modal como pendentes nesta etapa, sem improvisar backend, banco ou nova arquitetura de persistencia.

## Como o botao passou a atuar

- Ao clicar em `Propriedades da linha`, o sistema abre a janela modal da linha selecionada.
- Se nao houver linha selecionada, a tela nao quebra e apenas exibe feedback simples.
- Ao aplicar as alteracoes, os valores sao gravados na linha local da grade.
- A selecao e o foco voltam para a linha apos fechar o modal.

## Compatibilidade com a persistencia da Etapa 7

- A persistencia continua passando pelo envelope existente `extra.historico_aba`.
- Como a janela altera a linha no DOM local, a serializacao posterior reflete os valores atualizados sem criar caminho novo.

## O que nao mudou

- Nao houve alteracao de backend.
- Nao houve alteracao de banco, schema, migration, seed ou endpoint.
- Nao houve alteracao de outras abas da Ficha Pessoal.
- Nao foi reaberta a estrategia de persistencia da Etapa 7.

## Riscos observados

- A janela ainda nao cobre todos os campos visiveis do EasyDental.
- Os campos pendentes foram explicitamente deixados fora para reduzir risco de regressao.
- O modal precisa ser validado manualmente para confirmar que o foco e o fechamento estao corretos.

## Como testar no sistema

- Abrir Ficha Pessoal.
- Selecionar um paciente.
- Entrar na aba Historico.
- Confirmar primeiro se o conteudo gravado anteriormente reaparece apos reabrir o paciente.
- Selecionar uma linha existente.
- Clicar em `Propriedades da linha`.
- Confirmar se a janela abre sem quebrar a tela.
- Confirmar quais campos podem ser visualizados e editados.
- Alterar um campo suportado.
- Confirmar localmente a alteracao.
- Clicar no botao geral `Grava`.
- Fechar e reabrir a Ficha Pessoal do mesmo paciente.
- Confirmar se a alteracao feita em Propriedades da linha permaneceu gravada.
- Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada

Validacao final manual.
