# Fase 2B - Conta corrente - Contrato profundo do primeiro recorte medio controlado

## 1. Identificacao da etapa

- Fase 2B.
- Conta corrente.
- Frente comum/core transversal.
- Contrato profundo.
- Etapa exclusivamente documental.
- Sem implementacao.

## 2. Historico e contexto

- `Preferencias`, `Prestadores` e `Convenios e Planos` foram pausados depois de recortes validos.
- `Medicamentos` e `Ficha pessoal` foram pausados sem implementacao depois de contratos profundos que concluem que nao havia recorte medio suficientemente seguro nesta rodada.
- A nova matriz comparativa pos-Ficha pessoal recomendou `Conta corrente` como proxima frente para contrato profundo.
- `Conta corrente` entra com cautela por envolver financeiro e administrativos sensiveis.
- Se houver implementacao futura, ela devera ser pequena, visual/local e precedida por este contrato profundo.

## 3. Mapa das funcoes atuais no app.js

### Funcoes visuais/localmente seguras

- `ccFmt(v)`
- `ccDateISOToBR(x)`
- `ccDiaSemanaISO(x)`
- `ccSelecionado()`

### Funcoes de renderizacao

- `ccRenderTabela(data)`

### Funcoes de tabela/lista

- `ccRenderTabela(data)`
- seletor de linha no `tbody` de `cc`

### Funcoes de filtros/busca

- `ccCarregar()`
- eventos de `cc.mes`, `cc.ano`, `cc.conta` e `cc.filtro`

### Funcoes de selecao

- clique em linha da tabela de `cc`
- `ccSelecionado()`

### Funcoes de modal

- `ccAbrirModal(tipo, l = null)`
- `ccFecharModal()`
- `ccTrocarTipoModal(tipo)`
- `ccAtualizarDiaSemana()`
- `ccAtualizarTipoVisual()`

### Funcoes de validacao

- validacao de valor e historico em `ccSalvarModal()`
- validacao de selecao em `ccExcluirSelecionado()`

### Funcoes de eventos

- abertura do painel `ccAbrir()`
- fechamento do painel via botao
- duplo clique na linha da tabela
- clique nos botoes novo, editar, excluir, imprimir e fechar

### Funcoes que chamam requestJson

- `ccCarregar()`
- `ccCarregarCombosModal()`
- `ccSalvarModal()`
- `ccExcluirSelecionado()`
- `rccAbrir()` e o fluxo interno de pesquisa/relatorio
- `fcxCarregarDados()`

### Funcoes que montam payload

- `ccSalvarModal()`
- `rccEnsureUI()` no fluxo de montagem da pesquisa/saida
- `fcxParams()` apenas monta parametros de consulta, nao payload de escrita

### Funcoes que salvam

- `ccSalvarModal()`

### Funcoes que excluem

- `ccExcluirSelecionado()`

### Funcoes relacionadas a financeiro

- `ccCarregar()`
- `ccRenderTabela(data)`
- `ccSalvarModal()`
- `ccExcluirSelecionado()`
- `ccImprimir()`
- `fcxEnsureUI()`
- `fcxCarregarDados()`
- `fcxRenderGraficos()`

### Funcoes relacionadas a recebimentos

- `ccSalvarModal()` quando o fluxo envolve tipo credito/debito e situacao financeira
- `fcxCarregarDados()` por agregacao financeira

### Funcoes relacionadas a pagamentos

- `ccSalvarModal()`
- `ccCarregarCombosModal()`
- `ccImprimir()`

### Funcoes relacionadas a relatorios

- `ccImprimir()`
- `rccEnsureUI()`
- `rccAbrir()`
- `rccFechar()`
- `fcxEnsureUI()`
- `fcxCarregarDados()`

### Funcoes relacionadas a pacientes/convenios/prestadores/procedimentos

- existem apenas impactos transversais e referencias conceituais no fluxo financeiro
- nao houve alteracao funcional nesta etapa

### Funcoes que dependem de backend/endpoints

- `ccCarregar()`
- `ccCarregarCombosModal()`
- `ccSalvarModal()`
- `ccExcluirSelecionado()`
- `rccEnsureUI()` / `rccAbrir()`
- `fcxCarregarDados()`

### Funcoes que dependem de permissoes

- `ccAbrir()`
- `ccSalvarModal()`
- `ccExcluirSelecionado()`
- os fluxos de relatorio e fluxo de caixa podem depender do modulo financeiro

### Areas proibidas para Fase 2B

- backend
- banco
- endpoints
- permissoes
- `requestJson`
- payload efetivo
- salvamento
- exclusao
- criacao/edicao real de lancamento
- criacao/edicao real de pagamento
- criacao/edicao real de recebimento
- alteracao de valores financeiros
- alteracao de datas financeiras
- alteracao de forma de pagamento
- alteracao de status financeiro
- regras de validacao critica
- relatorios financeiros
- vinculos com pacientes
- vinculos com convenios
- vinculos com prestadores
- vinculos com procedimentos
- vinculos com agenda
- correcoes textuais
- labels/placeholders/mensagens
- mojibake

## 4. Mapa de modulos existentes

- Nao foi encontrado modulo dedicado a `Conta corrente` em `frontend/js/modules`.
- O modulo passivo mais proximo e `frontend/js/modules/plano-contas.js`.
- `plano-contas.js` exporta helpers de validacao e montagem de payload para grupo/categoria de plano de contas.
- O modulo e passivo e nao e a fonte funcional de `Conta corrente`.
- `app.js` continua sendo a fonte funcional da frente.
- Se um recorte futuro exigir extração mais limpa, e mais seguro criar um modulo passivo novo e pequeno do que reaproveitar `plano-contas.js` para uma frente diferente.

## 5. Mapa de DOM

### DOM visual/local

- `#cc-panel`

### DOM de tabela/lista

- `#cc-tbody`

### DOM de contador/resumo

- `#cc-ent`
- `#cc-sai`
- `#cc-saldo`

### DOM de formulario/modal

- `#cc-modal-backdrop`
- `#cc-modal-title`
- `#cc-tab-debito`
- `#cc-tab-credito`
- `#cc-label-venc`
- `#cc-dia-semana`
- `#cc-data-venc`
- `#cc-valor`
- `#cc-data-lanc`
- `#cc-situacao`
- `#cc-historico`
- `#cc-categoria`
- `#cc-forma`
- `#cc-doc`
- `#cc-ref`
- `#cc-comp`
- `#cc-data-inclusao`
- `#cc-data-alteracao`
- `#cc-tributavel`
- `#cc-parcelas-check`
- `#cc-parcelas`

### DOM de filtros/busca

- `#cc-mes`
- `#cc-ano`
- `#cc-conta`
- `#cc-filtro`

### DOM de botoes

- `#cc-btn-nd`
- `#cc-btn-nc`
- `#cc-btn-editar`
- `#cc-btn-excluir`
- `#cc-btn-imprime`
- `#cc-btn-fechar`
- `#cc-modal-ok`
- `#cc-modal-cancelar`

### DOM de valores financeiros

- `#cc-valor`
- `#cc-ent`
- `#cc-sai`
- `#cc-saldo`

### DOM de datas

- `#cc-data-venc`
- `#cc-data-lanc`
- `#cc-data-inclusao`
- `#cc-data-alteracao`
- `#cc-dia-semana`

### DOM de formas de pagamento

- `#cc-forma`

### DOM que dispara eventos

- filtros `mes`, `ano`, `conta`, `filtro`
- linhas do `tbody`
- botoes novo, editar, excluir, imprimir, fechar
- tabs do modal
- campos do modal que atualizam visual de vencimento e tipo

### DOM que participa de requestJson

- filtros de lista
- selects e inputs do modal
- campos usados para montar o payload de lancamento

### DOM que participa de payload/salvamento

- todos os campos do modal em `ccSalvarModal()`

### DOM que participa de exclusao

- selecao de linha no `tbody`

### DOM sensivel/proibido

- qualquer elemento ligado a gravacao financeira real
- qualquer elemento ligado a relatorio/saida/fluxo de caixa
- qualquer elemento que altere valores, datas, formas de pagamento ou status

## 6. Mapa de eventos

### Eventos apenas visuais

- atualizacao do dia da semana ao alterar vencimento
- alternancia visual de tipo debito/credito no modal

### Eventos de selecao

- clique em linha da tabela
- selecao retornada por `ccSelecionado()`

### Eventos de abertura/fechamento

- abrir painel `Conta corrente`
- fechar painel
- abrir modal novo/editar
- fechar modal

### Eventos de filtros/busca

- alteracao de mes
- alteracao de ano
- alteracao de conta
- alteracao de filtro textual

### Eventos de carregamento/listagem

- abertura do painel
- troca de filtros que recarregam a lista

### Eventos de tabela/lista

- clique em linha
- duplo clique para editar

### Eventos de valores financeiros

- alteracao de valor no modal
- alteracao de situacao e forma de pagamento no modal

### Eventos que disparam requestJson

- carregar lista
- carregar combos do modal
- salvar lancamento
- excluir lancamento
- abrir pesquisa/relatorio
- carregar fluxo de caixa

### Eventos que salvam

- confirmar modal

### Eventos que excluem

- botao excluir e confirmacao

### Eventos que podem impactar financeiro, recebimentos, relatorios ou outras areas

- salvar lancamento
- excluir lancamento
- imprimir relatorio
- abrir fluxo de caixa

### Eventos proibidos para o primeiro recorte medio

- todos os eventos de persistencia
- todos os eventos de exclusao
- todos os eventos de relatorio
- todos os eventos de fluxo de caixa
- todos os eventos que alteram valores, datas, status ou formas de pagamento

## 7. Mapa de requestJson / payload / salvamento / exclusao

### `ccCarregar()`

- Função chamadora: `ccCarregar()`
- Endpoint: `GET /financeiro/lancamentos?mes=...&ano=...&conta=...&filtro=...`
- Metodo: `GET`
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Risco: alto por ser leitura do bloco financeiro principal

### `ccCarregarCombosModal()`

- Função chamadora: `ccCarregarCombosModal()`
- Endpoints: `GET /financeiro/categorias?tipo=Saida|Entrada` e `GET /financeiro/formas-pagamento`
- Metodo: `GET`
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Risco: medio-alto por alimentar o modal financeiro

### `ccSalvarModal()`

- Função chamadora: `ccSalvarModal()`
- Endpoint: `POST /financeiro/lancamentos` ou `PUT /financeiro/lancamentos/{id}`
- Metodo: `POST` / `PUT`
- Carrega dados: nao
- Salva dados: sim
- Exclui dados: nao
- Monta payload: sim
- Afeta financeiro: sim
- Afeta relatorios: potencialmente sim
- Afeta recebimentos/pagamentos: sim
- Risco: muito alto

### `ccExcluirSelecionado()`

- Função chamadora: `ccExcluirSelecionado()`
- Endpoint: `DELETE /financeiro/lancamentos/{id}`
- Metodo: `DELETE`
- Carrega dados: nao
- Salva dados: nao
- Exclui dados: sim
- Monta payload: nao
- Afeta financeiro: sim
- Afeta relatorios: potencialmente sim
- Afeta recebimentos/pagamentos: sim
- Risco: muito alto

### `rccAbrir()` / fluxo de relatorio

- Função chamadora: `rccAbrir()`
- Endpoints: pesquisa e saida do fluxo de caixa / relatorio
- Metodo: `GET`
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Afeta financeiro: sim
- Afeta relatorios: sim
- Risco: muito alto

### `fcxCarregarDados()`

- Função chamadora: `fcxCarregarDados()`
- Endpoint: `GET /financeiro/fluxo-caixa?...`
- Metodo: `GET`
- Carrega dados: sim
- Salva dados: nao
- Exclui dados: nao
- Monta payload: nao
- Afeta financeiro: sim
- Afeta relatorios: sim
- Risco: muito alto

Importante: nenhuma dessas chamadas deve ser alterada nesta etapa. O primeiro recorte medio futuro deve permanecer fora de `requestJson`, payload, salvamento e exclusao.

## 8. Mapa de backend / endpoints / permissoes / impactos transversais

- `Conta corrente` se conecta ao backend financeiro e a pontos de relatorio/pesquisa.
- Ha dependencia de permissao do modulo financeiro.
- A frente conversa com clinica, recebimentos, pagamentos e fluxo de caixa.
- Ha impacto transversal com relatorios e com o contexto administrativo do sistema.
- Tambem pode tocar pacientes, convenios, prestadores, procedimentos e agenda de forma indireta, mas isso nao deve ser parte do primeiro recorte.

## 9. Partes proibidas para Fase 2B

- backend
- banco
- endpoints
- permissoes
- `requestJson`
- payload efetivo
- salvamento
- exclusao
- criacao/edicao real de lancamento
- criacao/edicao real de pagamento
- criacao/edicao real de recebimento
- alteracao de valores financeiros
- alteracao de datas financeiras
- alteracao de forma de pagamento
- alteracao de status financeiro
- regras de validacao critica
- relatorios financeiros
- vinculos com pacientes
- vinculos com convenios
- vinculos com prestadores
- vinculos com procedimentos
- vinculos com agenda
- correcoes textuais
- labels/placeholders/mensagens
- mojibake

## 10. Recortes medios possiveis

### Candidato 1 - Renderizacao da tabela e dos totais

- Descricao: extrair a composicao visual/local de `ccRenderTabela(data)`, incluindo linhas e totais/resumo.
- Funcoes envolvidas: `ccRenderTabela(data)`, `ccDateISOToBR`, `ccFmt`, `ccSelecionado()`
- DOM envolvido: `#cc-tbody`, `#cc-ent`, `#cc-sai`, `#cc-saldo`
- Eventos envolvidos: carregamento de lista e selecao de linha
- Toca requestJson: nao
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: nao diretamente
- Toca permissoes: nao diretamente
- Toca financeiro/valores/datas/status: sim, apenas leitura/formatacao
- Toca relatorios: nao
- Toca outras areas: nao
- Risco: medio-alto, mas controlavel
- Ganho esperado: real, porque reduz o peso de renderizacao em `app.js`
- Teste manual possivel: lista, totais, selecao visual, fechar/reabrir
- Rollback mental: devolver a montagem da tabela e dos totais para `app.js`
- Decisao: recomendado

### Candidato 2 - Formato visual do modal debito/credito

- Descricao: extrair apenas a alternancia visual de campos e labels do modal
- Funcoes envolvidas: `ccAtualizarTipoVisual()`, `ccTrocarTipoModal(tipo)`, `ccAtualizarDiaSemana()`
- DOM envolvido: labels, tabs e campos do modal
- Eventos envolvidos: troca de tipo e alteracao de vencimento
- Toca requestJson: nao diretamente
- Toca payload: nao diretamente
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: nao diretamente
- Toca permissoes: nao
- Toca financeiro/valores/datas/status: sim, por refletir o tipo e o vencimento
- Toca relatorios: nao
- Toca outras areas: nao
- Risco: medio, mas menor ganho
- Ganho esperado: baixo a medio
- Teste manual possivel: alternar debito/credito e verificar rotulo
- Rollback mental: reintroduzir a logica visual no `app.js`
- Decisao: rejeitado por enquanto

### Candidato 3 - Helpers puros de data e valor

- Descricao: mover apenas `ccFmt`, `ccDateISOToBR` e `ccDiaSemanaISO`
- Funcoes envolvidas: helpers puros
- DOM envolvido: indireto, via tabela e modal
- Eventos envolvidos: nenhum proprio
- Toca requestJson: nao
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: nao
- Toca permissoes: nao
- Toca financeiro/valores/datas/status: sim, mas apenas formatacao
- Toca relatorios: nao
- Toca outras areas: nao
- Risco: baixo, porem ganho insuficiente
- Ganho esperado: pequeno demais para a Fase 2B
- Teste manual possivel: praticamente o mesmo da renderizacao principal
- Rollback mental: simples
- Decisao: rejeitado por enquanto

### Candidato 4 - Rotina de impressao / relatorio

- Descricao: extrair `ccImprimir()` ou as rotinas de `rcc`/`fcx`
- Funcoes envolvidas: `ccImprimir()`, `rccEnsureUI()`, `rccAbrir()`, `fcxCarregarDados()`
- DOM envolvido: painel de relatorio, preview, graficos
- Eventos envolvidos: imprimir, alternar abas, filtros do relatorio
- Toca requestJson: sim
- Toca payload: nao
- Toca salvamento: nao
- Toca exclusao: nao
- Toca backend/endpoints: sim
- Toca permissoes: possivelmente sim
- Toca financeiro/valores/datas/status: sim
- Toca relatorios: sim
- Toca outras areas: pode tocar financeiro transversal
- Risco: muito alto
- Ganho esperado: alto, mas fora do escopo da rodada
- Teste manual possivel: complexo e amplo demais
- Rollback mental: dificil
- Decisao: rejeitado

## 11. Recomendacao de um unico recorte

- Recorte recomendado: extrair a renderizacao visual/local da tabela de `Conta corrente` e dos totais/resumo mensal.
- Classificacao: `comum/core transversal`.
- Motivo: entrega ganho real de organizacao do `app.js`, tem teste manual claro e mantem fora de escopo `requestJson`, payload, salvamento, exclusao, relatorios e fluxo de caixa.
- Risco: medio-alto por ser financeiro, mas controlavel se o recorte ficar estritamente em leitura/renderizacao.
- Limite futuro: nao tocar valores reais, datas financeiras, forma de pagamento, status, persistencia nem relatorio.
- Se um futuro prompt de implementacao for emitido, ele deve se limitar ao menor trecho possivel de renderizacao da lista e do resumo.

## 12. Teste manual previsto

- Menu/tela: `Financeiro > Conta corrente`.
- Acoes: abrir o painel, verificar a lista, observar totais/summary, clicar em linhas diferentes, fechar e reabrir.
- Comportamento esperado: a lista aparece normalmente, os totais batem com a listagem e a selecao visual continua funcionando.
- O que nao pode quebrar: valores, datas, saldo visual, filtros, modal, abrir/fechar e ordem de listagem.
- Testar salvar: nao.
- Testar exclusao: nao.
- Verificar ausencia de impacto em valores financeiros: sim.
- Verificar ausencia de impacto em relatorios: sim.
- Verificar ausencia de impacto em pacientes/convenios/prestadores/procedimentos/agenda: sim.

## 13. Risco residual e rollback mental

- Riscos principais: regressao de saldo, linha debito/credito, filtro, selecao visual, ou qualquer reflexo indevido em salvar/excluir.
- Como perceber quebra: totais incoerentes, linhas sem formato esperado, saldo incorreto ou modal/fluxo financeiro alterado.
- Como comparar com comportamento anterior: abrir a mesma conta, o mesmo mes e o mesmo filtro antes/depois da futura implementacao.
- Como reverter mentalmente: restaurar a montagem da tabela e dos totais para `app.js` e manter apenas helpers puros no modulo, se algum existir.
- Por que o recorte e aceitavel: e o menor recorte que ainda traz ganho real de organizacao sem tocar persistencia.

## 14. Registro para roadmap

- O contrato profundo de `Conta corrente` foi criado sem implementacao.
- A frente foi classificada como `comum/core transversal`.
- O resultado da matriz pos-Ficha pessoal foi incorporado: `Conta corrente` foi a frente recomendada.
- A auditoria leve do commit anterior foi registrada antes da nova matriz.
- Foram documentados os candidatos avaliados, o recorte recomendado, o teste manual previsto e os limites vigentes da Fase 2B.
- Ficam fora do escopo `requestJson`, payload, salvamento, exclusao, backend, permissoes, financeiro, relatorios e demais integracoes transversais.
- A proxima subetapa continua sendo contrato profundo antes de qualquer implementacao.

