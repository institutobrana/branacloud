# Matriz de Testes - Indices Financeiros Frontend React

## 1. Objetivo

Definir a matriz de verificacao futura para o modulo `Configuracoes -> Indices financeiros`, cobrindo leitura, selecao, toolbar, dialogs, exclusao, migracao, erros, tema e build.

## 2. Regras

- Esta matriz nao cria testes executaveis.
- Ela serve como guia de cobertura futura.
- Nenhum dado real deve ser alterado.
- Nenhum `clinica_id` deve ser controlado manualmente pelo frontend.

## 3. Estrutura

Cada item contem:

- ID;
- micropasso;
- cenario;
- camada;
- entrada;
- acao;
- resultado esperado;
- arquivo futuro;
- dependencias;
- grava dados?;
- seguro local?;
- obrigatorio antes do commit?;
- obrigatorio antes do push?;
- obrigatorio antes do deploy?.

## 4. Matriz

| ID | Micropasso | Cenario | Camada | Entrada | Acao | Resultado esperado | Arquivo futuro | Dependencias | Grava dados? | Seguro local? | Antes do commit? | Antes do push? | Antes do deploy? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IF-T01 | 6.1 | rota lateral do modulo | integracao | clique no item lateral | abrir a screen | pagina carrega no shell correto | `IndicesFinanceirosPage.jsx` | App, routes | nao | sim | sim | sim | sim |
| IF-T02 | 6.1 | rota direta | integracao | URL direta | abrir a screen | modulo acessa a mesma pagina | `IndicesFinanceirosPage.jsx` | App, routes | nao | sim | sim | sim | sim |
| IF-T03 | 6.1 | recarga | runtime | pagina aberta | atualizar navegador | estado inicial sem quebra | `IndicesFinanceirosPage.jsx` | App, shell | nao | sim | sim | sim | sim |
| IF-T04 | 6.2 | toolbar sem `Fecha` | UI | pagina carregada | inspecionar toolbar | botao `Fecha` ausente | `IndicesFinanceirosToolbar.jsx` | shell, page | nao | sim | sim | sim | sim |
| IF-T05 | 6.2 | ordem da toolbar | UI | pagina carregada | inspecionar ordem | ordem exata dos botoes definida no contrato | `IndicesFinanceirosToolbar.jsx` | shell, page | nao | sim | sim | sim | sim |
| IF-T06 | 6.2 | barra em L | visual | tela aberta | inspecionar layout | shell em L consistente | `IndicesFinanceirosPage.jsx` | shell, theme | nao | sim | sim | sim | sim |
| IF-T07 | 6.3 | loading dos indices | componente | API pendente | abrir pagina | spinner/estado loading visivel | `IndicesFinanceirosPage.jsx` | api, hook | nao | sim | sim | sim | sim |
| IF-T08 | 6.3 | vazio de indices | componente | lista vazia | abrir pagina | empty state claro | `IndicesFinanceirosPage.jsx` | api, hook | nao | sim | sim | sim | sim |
| IF-T09 | 6.3 | erro de indices | componente | 500 ou rede | carregar pagina | erro visivel e sem crash | `IndicesFinanceirosPage.jsx` | api, hook | nao | sim | sim | sim | sim |
| IF-T10 | 6.3 | selecao de indice | componente | lista com itens | clicar linha | indice ativo muda | `IndicesFinanceirosTable.jsx` | hook, selection | nao | sim | sim | sim | sim |
| IF-T11 | 6.3 | valor atual backend | integracao | indice com cotacao | carregar item | valor exibido vem da API, nao calculo local | `IndicesFinanceirosTable.jsx` | api, mapper | nao | sim | sim | sim | sim |
| IF-T12 | 6.4 | loading das cotacoes | componente | indice ativo sem detalhe | trocar indice | detalhe carrega em separado | `IndicesCotacoesTable.jsx` | hook detalhe | nao | sim | sim | sim | sim |
| IF-T13 | 6.4 | vazio de cotacoes | componente | indice sem cotacoes | abrir detalhe | empty state do detalhe | `IndicesCotacoesTable.jsx` | hook detalhe | nao | sim | sim | sim | sim |
| IF-T14 | 6.4 | erro de cotacoes | componente | 500 no detalhe | carregar detalhe | erro visivel e separavel | `IndicesCotacoesTable.jsx` | api, hook detalhe | nao | sim | sim | sim | sim |
| IF-T15 | 6.4 | resposta fora de ordem | integracao | troca rapida de indice | alternar selecao | apenas o ultimo indice prevalece | `useIndicesFinanceirosCotacoes.js` | abort/sequence | nao | sim | sim | sim | sim |
| IF-T16 | 6.5 | novo indice valido | dialog | dados validos | salvar | POST executado e lista recarregada | `IndicesFinanceirosIndexDialog.jsx` | validators, api | sim | sim | sim | sim | sim |
| IF-T17 | 6.5 | novo indice invalido | dialog | nome vazio | tentar salvar | erro local e dialog permanece aberto | `IndicesFinanceirosIndexDialog.jsx` | validators | nao | sim | sim | sim | sim |
| IF-T18 | 6.6 | altera indice reservado | dialog | indice reservado | abrir edicao | campos ou acao bloqueados conforme contrato | `IndicesFinanceirosIndexDialog.jsx` | reserved | nao | sim | sim | sim | sim |
| IF-T19 | 6.6 | altera indice comum | dialog | indice editavel | salvar alteracao | PATCH executado e lista recarregada | `IndicesFinanceirosIndexDialog.jsx` | api, validators | sim | sim | sim | sim | sim |
| IF-T20 | 6.7 | exclusao simples permitida | fluxo | indice sem uso | confirmar exclusao | DELETE executado, selecao seguinte preservada | `useIndicesFinanceirosDeletion.js` | api, selection | sim | sim | sim | sim | sim |
| IF-T21 | 6.7 | exclusao bloqueada por uso | fluxo | indice em uso | tentar excluir | erro tratado e orientacao visivel | `useIndicesFinanceirosDeletion.js` | consult usage | nao | sim | sim | sim | sim |
| IF-T22 | 6.7 | tratamento 403 | fluxo | sem permissao | tentar excluir | acesso negado sem quebrar pagina | `useIndicesFinanceirosDeletion.js` | auth, permission | nao | sim | sim | sim | sim |
| IF-T23 | 6.8 | migracao de indice em uso | dialog | 409 | abrir fluxo de migracao | modal mostra destino elegivel | `IndicesFinanceirosMigrationDialog.jsx` | api, reserved | nao | sim | sim | sim | sim |
| IF-T24 | 6.8 | destino invalido | dialog | destino sem elegibilidade | tentar migrar | validacao local impede submit | `IndicesFinanceirosMigrationDialog.jsx` | validators | nao | sim | sim | sim | sim |
| IF-T25 | 6.8 | migracao concluida | fluxo | indice em uso com destino | confirmar | migrar e excluir executado e listas recarregam | `useIndicesFinanceirosMigration.js` | api, selection | sim | sim | sim | sim | sim |
| IF-T26 | 6.9 | novo valor valido | dialog | cotacao valida | salvar | POST de cotacao e recarga do valor atual | `IndicesFinanceirosQuotationDialog.jsx` | api, validators | sim | sim | sim | sim | sim |
| IF-T27 | 6.10 | altera valor | dialog | cotacao existente | editar e salvar | PATCH e recarga do detalhe | `IndicesFinanceirosQuotationDialog.jsx` | api, validators | sim | sim | sim | sim | sim |
| IF-T28 | 6.11 | elimina cotacao | fluxo | cotacao selecionada | confirmar exclusao | DELETE e selecao seguinte | `useIndicesFinanceirosQuotationDeletion.js` | api, selection | sim | sim | sim | sim | sim |
| IF-T29 | 6.12 | tema claro | visual | tema claro ativo | abrir pagina | superfices e tabelas coerentes | `globals.css`, `branaTokens.css` | theme | nao | sim | sim | sim | sim |
| IF-T30 | 6.12 | tema escuro | visual | tema escuro ativo | abrir pagina | contraste, bordas e foco corretos | `globals.css`, `branaTokens.css` | theme | nao | sim | sim | sim | sim |
| IF-T31 | 6.12 | contraste e desabilitado | visual | botao desabilitado | inspecionar | estados visuais legiveis | `IndicesFinanceirosToolbar.jsx` | theme | nao | sim | sim | sim | sim |
| IF-T32 | 6.13 | runtime real | integracao | backend real | navegar e salvar | console sem erros criticos | pagina inteira | backend real | sim | nao | sim | sim | sim |
| IF-T33 | 6.13 | rede e timeout | runtime | conexao instavel | recarregar e operar | mensagens de rede consistentes | pagina inteira | api, error normalizer | nao | sim | sim | sim | sim |
| IF-T34 | 6.13 | nenhuma alteracao no backend | integridade | operacao UI | executar fluxo | backend so e acionado pelos endpoints previstos | pagina inteira | api | sim | sim | sim | sim | sim |
| IF-T35 | build | geral | build | codigo final | rodar build | build conclui com sucesso | projeto frontend | todos os passos | nao | sim | sim | sim | sim |

## 5. Cobertura minima por area

### Rota

- item lateral;
- rota direta;
- screen;
- recarga.

### Toolbar

- ordem;
- labels;
- separador;
- ausencia de `Fecha`;
- estados habilitados;
- reservados.

### Indices

- loading;
- vazio;
- erro;
- selecao;
- valor atual;
- novo;
- altera;
- protecao;
- exclusao;
- migracao.

### Cotacoes

- sem indice;
- loading;
- vazio;
- erro;
- ordenacao;
- troca rapida;
- novo;
- altera;
- elimina;
- recarga do valor atual.

### Erros

- 400;
- 401;
- 403;
- 404;
- 409;
- 500;
- rede.

### Tema

- claro;
- escuro;
- contraste;
- selecao;
- desabilitado.

### Integridade

- nenhum `clinica_id` manual;
- nenhum calculo local;
- nenhum dado fake;
- nenhuma alteracao de backend.

## 6. Observacoes operacionais

- Testes de UI devem priorizar selecao, recarga e resposta fora de ordem.
- Se houver divergencia entre contrato e backend, o backend continua sendo a referencia operacional.
- Se o modulo ainda nao existir, a matriz serve como checklist de implementacao futura.

## 7. Fechamento da matriz

Esta matriz reflete a cobertura minima e o encerramento da homologacao:

- `35` testes da feature passaram;
- o build passou;
- o runtime autenticado foi confirmado;
- `Cancelar` e `Esc` nao geraram mutacao;
- a base documental agora serve como checklist para manutencao e regressao.
