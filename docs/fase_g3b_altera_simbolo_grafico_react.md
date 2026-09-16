# Fase G.3B - Altera simbolo grafico React

Data: 2026-08-04

## Objetivo
Implementar exclusivamente o fluxo funcional do botao `Altera` em `Configuracoes -> Simbolos graficos`, reaproveitando o modal existente de criacao como editor compartilhado.

## Escopo executado
- o `App.jsx` passou a refletir a selecao da grade de simbolos graficos;
- o botao `Altera` passou a ser habilitado apenas com item selecionado;
- o clique em `Altera` aciona o modal compartilhado em modo `edit`;
- o modal envia `PUT /cadastros/simbolos-graficos/{id}` no modo de edicao;
- o modal preserva `origem` por contrato de backend;
- o editor preserva `imagem_custom` quando o registro resolver esse valor;
- a tela reexecuta `reload()` e reseleciona o item atualizado após sucesso.

## Evidencias tecnicas
- teste de API atualizado para cobrir `updateSimboloGrafico`;
- teste do modal atualizado para cobrir modo compartilhado `create/edit`;
- build do frontend concluido com sucesso.

## Validacoes executadas
- `node --test frontend-react/tests/simbolosGraficosApi.test.js frontend-react/tests/simboloGraficoCreateModal.test.js`
- `npm.cmd run build`

## Fora de escopo
- backfill de origem;
- apply da camada de origem;
- exclusao;
- qualquer alteracao de banco ou servidor.

## Observacao
O fluxo foi validado em nivel tecnico. A validacao manual em runtime da GUI do EasyDental Desktop permanece como etapa separada, caso seja solicitada.
