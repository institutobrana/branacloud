# Implementação - Prestadores lista e selecao visual

## 1. Contexto

- O contrato profundo de `Prestadores remanescentes` foi concluido.
- A decisao registrada para o recorte foi `PREST-CONTRATO-A`.
- O recorte minimo implementado aqui e de lista e selecao visual.
- `Prestadores` foi tratado como frente mista, com fronteiras sensiveis preservadas.

## 2. Escopo implementado

### 2.1. Delegacao para `frontend/js/modules/prestadores.js`

- Foi mantida a delegacao visual da listagem para `prestRenderLista`.
- Foi adicionado o helper passivo `prestSelecionarLinhaVisual`.
- O modulo continua passivo, sem side effects e sem buscar dados.

### 2.2. O que permaneceu em `frontend/app.js`

- `prestRender` continuou como orquestrador.
- `prestSelecionarLinha` continuou existindo como orquestrador do estado de selecao.
- O fallback local foi preservado.
- `prestCarregar`, `prestAcoesPlaceholder`, `requestJson`, payload, salvamento e fluxos sensiveis nao foram tocados.

### 2.3. Delegacao efetiva

- `prestRender` continua delegando a montagem da lista para `prestRenderLista` quando o modulo esta disponivel.
- `prestSelecionarLinha` passou a delegar a atualizacao visual da selecao para `prestSelecionarLinhaVisual` quando o modulo esta disponivel.
- Se o helper nao estiver disponivel, o fallback local com `prestRender` permanece preservado.

## 3. Arquivos alterados

- [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js)
- [`frontend/js/modules/prestadores.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js)
- [`docs/fase_2b_prestadores_implementacao_lista_selecao_visual.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\fase_2b_prestadores_implementacao_lista_selecao_visual.md)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)

## 4. O que nao foi alterado

- `prestCarregar`
- `requestJson`
- payload
- salvamento
- `prestAcoesPlaceholder`
- `Agenda...`
- `Convênios...`
- `Comissões...`
- permissões
- backend
- banco
- schema/migrations/seeds/endpoints
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)
- textos/labels
- PostgreSQL 18

## 5. Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/prestadores.js`
- `git diff --stat`

## 6. Onde testar no sistema

- Abrir o painel de Prestadores.
- Conferir a lista principal.
- Conferir status e codigo na lista.
- Selecionar linha.
- Conferir o destaque visual da selecao.
- Abrir e fechar o painel.
- Recarregar sem salvar.
- Checar apenas como nao-regressao que Agenda/Convenios/Comissoes continuam fora do recorte.

## 7. Proxima etapa recomendada

- Validacao manual pos-implementacao do recorte de lista e selecao visual.

## 8. Confirmacoes de escopo

- codigo alterado somente nos arquivos permitidos;
- frontend/index.html nao alterado;
- backend nao alterado;
- .env nao alterado;
- banco/schema/migrations/seeds/endpoints nao alterados;
- dados de banco nao alterados;
- PostgreSQL 18 nao excluido/desativado;
- blindagem textual/mojibake respeitada.

## 9. Registro para roadmap

Implementacao minima do recorte de `Prestadores` concluida para lista e selecao visual, com delegacao para o modulo passivo e fallback preservado em `frontend/app.js`.
