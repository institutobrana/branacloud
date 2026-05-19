# Auxiliares / Tabelas auxiliares - Retomada pos Intervencoes - Reavaliacao do estado atual

## 1. Objetivo da etapa

- Revalidar o estado atual do modulo `Auxiliares / Tabelas auxiliares` sem alterar comportamento.
- Confirmar o que ja esta consolidado no historico e o que ainda permanece acoplado ao monolito.
- Definir, com base no estado real do codigo, qual seria a proxima etapa correta sem reiniciar a modularizacao.

## 2. Branch e diretorio verificados

- Branch: `modularizacao-segura-fase-1`
- Diretorio real: `D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Checks iniciais executados

Checks de auditoria executados antes da escrita deste documento:

- `git branch --show-current`
- `git status --short`
- `git log --oneline -12`
- `git diff --stat`
- `git diff --cached --stat`
- leitura de `docs/`
- leitura de `frontend/js/modules/`
- busca textual em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules/auxiliares.js` e `docs/`

Resultado resumido:

- branch correta confirmada
- nenhum arquivo staged
- ha varios `??` antigos em `docs/` ja existentes no working tree
- nao houve diff tracked ativo antes da criacao deste documento

## 4. Confirmacao do ultimo commit consolidado

- Commit esperado e confirmado como ultimo ponto consolidado da rodada anterior: `d84638c Recomenda proximo modulo apos Intervencoes`

## 5. Documentos anteriores encontrados sobre Auxiliares / Tabelas auxiliares

Documentos localizados e considerados nesta reavaliacao:

- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/auxiliares_subetapa_3_helpers_puros.md`
- `docs/auxiliares_subetapa_4_integracao_helpers_puros.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_procedimentos.md`

Conclusao importante:

- O historico de `Auxiliares` nao esta parado na Subetapa 0 ou 1.
- Ja existem registros documentais ate a Subetapa 5, o que indica ciclo historico ja encerrado.

## 6. Resumo da Subetapa 0 anterior

Pelo documento `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`, a primeira leitura de `Auxiliares` concluiu que:

- o fluxo funcional ainda estava todo no monolito `frontend/app.js`
- `auxAbrir()`, `auxCarregarTipos()`, `auxCarregarItens()`, `auxDialogItem()`, `auxExcluirItem()` e funcoes relacionadas eram dono do app.js
- havia scaffold compartilhado com `Plano de Contas`
- `cadModal` e `planoEnsureUI()` apareciam como contratos compartilhados
- os helpers textuais/numéricos/visuais foram mapeados como possiveis candidatos futuros
- nenhuma alteracao funcional foi aplicada naquela etapa

## 7. Resumo da Subetapa 1 anterior

Pelo documento `docs/auxiliares_subetapa_1_namespace_passivo.md`, a Subetapa 1 registrou que:

- o namespace passivo `window.BranaAuxiliaresModule` foi criado
- `frontend/js/modules/auxiliares.js` passou a existir
- `frontend/index.html` foi ajustado para carregar o modulo antes de `frontend/app.js`
- o modulo permaneceu passivo, sem controle de fluxo
- `frontend/app.js` continuou dono das funcoes funcionais de `aux*`
- nenhuma regra de negocio, endpoint, modal ou bind foi movida para o modulo novo

## 8. Confirmacao de existencia, carregamento e wrappers/fallbacks

### 8.1 Arquivo de modulo existente

- `frontend/js/modules/auxiliares.js` existe
- o arquivo se apresenta como namespace passivo/controlado
- o meta atual do proprio modulo indica `versao: "subetapa-3"` e `status: "helpers-puros-passivos"`

### 8.2 Carregamento em `frontend/index.html`

- `frontend/index.html` carrega `frontend/js/modules/auxiliares.js` antes de `frontend/app.js`
- a referencia observada esta por volta da linha `3924`

### 8.3 Wrappers / fallbacks em `frontend/app.js`

- `frontend/app.js` possui wrappers com fallback para:
  - `auxTipoEh(tipo, chave)` por meio de `window.BranaAuxiliaresModule?.helpers?.auxTipoEh`
  - `auxNormalizarHexCor(value)` por meio de `window.BranaAuxiliaresModule?.helpers?.auxNormalizarHexCor`
- as demais funcoes operacionais continuam locais no monolito
- o fluxo funcional principal ainda esta em `frontend/app.js`, especialmente por volta das linhas `11470-11915` e `23405`

## 9. Estado atual do modulo Auxiliares

### 9.1 O que ja foi modularizado

- Namespace passivo com metadados e introspeccao:
  - `meta`
  - `nome`
  - `subetapa`
  - `status`
  - `ativo`
  - `controlaFluxo`
  - `helpers`
  - `funcoesMonoliticas`
  - `helpersCandidatosFuturos`
  - `dependenciasCompartilhadas`
  - `endpoints`
  - `getInfo()`
  - `getStatus()`
  - `info()`
- Helpers puros ja presentes no modulo:
  - `auxTipoEh(tipo, chave)`
  - `auxNormalizarHexCor(value)`
  - `auxCorrigirMojibake(texto)`
  - `auxCorApresentacaoNormLabelKey(texto)`
  - `auxCorApresentacaoHexPorLabel(label)`
  - `auxCorApresentacaoCorLabel(hex)`
  - `auxCorApresentacaoOpcoesHtml(corAtual)`

### 9.2 O que permanece no `app.js`

- abertura do painel
- carregamento de tipos
- carregamento de itens
- selecao de tipo e item
- modal generico de item
- exclusao
- totalizacao
- geracao automatica de codigo
- pos-salvamento com agenda
- binds e eventos
- scaffold compartilhado com `Plano de Contas`

### 9.3 O que e apenas namespace passivo

- O modulo `frontend/js/modules/auxiliares.js` nao assume o fluxo funcional da tela.
- Ele apenas expõe contratos, metadados e helpers puros.
- `window.BranaAuxiliaresModule` nao substitui o monolito.

### 9.4 O que ainda parece acoplado

- `auxPosSalvarDependencias(tipo)` continua sensivel por acionar agenda quando o tipo e `situacao_agendamento`
- `auxDialogItem(ed=null)` continua acoplada ao `cadModal`
- `auxAbrir()` continua acoplada ao scaffold compartilhado com `planoEnsureUI()`
- os fluxos de lista, selecao, exclusao e salvamento continuam no monolito

## 10. Mapeamento conservador de possiveis proximos candidatos

| Candidato | Tipo de dependencia | Leitura conservadora | Status |
|---|---|---|---|
| `auxCorrigirMojibake(texto)` | texto puro | transforma apenas a string recebida | seguro |
| `auxCorApresentacaoNormLabelKey(texto)` | texto puro | normaliza chave textual sem DOM nem API | seguro |
| `auxTipoEh(tipo, chave)` | texto puro | ja modularizado e com fallback no `app.js` | ja consolidado |
| `auxNormalizarHexCor(value)` | texto puro | ja modularizado e com fallback no `app.js` | ja consolidado |
| `auxCorApresentacaoHexPorLabel(label)` | leitura de fonte de cor compartilhada | parece puro, mas depende do contrato de fonte externa | cautela |
| `auxCorApresentacaoCorLabel(hex)` | leitura de fonte de cor compartilhada | parece puro, mas depende do mesmo contrato | cautela |
| `auxCorApresentacaoOpcoesHtml(corAtual)` | gera HTML | utilitario, mas ainda ligado a apresentacao de opcoes | cautela |
| `auxCorApresentacaoFonteSistema()` | fonte compartilhada / apresentacao | apoio interno, nao candidato prioritario | cautela |
| `auxAplicarLayoutDesktop()` | DOM / layout | mexe em estrutura visual e estilo | proibido |
| `auxCarregarTipos()` | request / render | depende de endpoint e DOM | proibido |
| `auxCarregarItens()` | request / render | depende de endpoint e DOM | proibido |
| `auxSelecionarTipoLinha(tr, carregar=true)` | DOM / estado | mexe em selecao e recarga | proibido |
| `auxSelecionarItemLinha(tr)` | DOM / estado | mexe em selecao visual | proibido |
| `auxDialogItem(ed=null)` | modal / payload / salvamento | acoplado ao `cadModal` e a payloads por tipo | proibido |
| `auxExcluirItem()` | salvamento / exclusao | acoplado a DELETE e confirmacao | proibido |
| `auxPosSalvarDependencias(tipo)` | pos-salvamento / agenda | efeito colateral real em agenda | proibido |
| `auxGerarCodigoAutomatico()` | estado local | depende de cache de itens | proibido |
| `auxAtualizarTotal()` | DOM | apenas contagem visual, mas ainda DOM ligado | proibido |
| `auxSel()` | estado local | leitura de selecionado, mas parte do fluxo principal | proibido |

## 11. Classificacao dos candidatos

### Seguro

- `auxCorrigirMojibake(texto)`
- `auxCorApresentacaoNormLabelKey(texto)`

### Cautela

- `auxCorApresentacaoHexPorLabel(label)`
- `auxCorApresentacaoCorLabel(hex)`
- `auxCorApresentacaoOpcoesHtml(corAtual)`
- `auxCorApresentacaoFonteSistema()`

### Proibido

- qualquer fluxo de abertura, lista, selecao, modal, exclusao, salvamento, pos-salvamento, totalizacao ou layout
- qualquer alteracao em payload, backend, banco, endpoint ou agenda
- qualquer tentativa de extrair helper que dependa de DOM, `cadModal`, `requestJson` ou estado de tela

## 12. Riscos

### 12.1 Risco visual

- O painel compartilha scaffold com `Plano de Contas`
- Alteracoes de layout podem afetar duas telas ao mesmo tempo

### 12.2 Risco textual / mojibake

- Existe logica de limpeza de texto e labels de cor
- Correcoes textuais nao devem ser misturadas com modularizacao funcional

### 12.3 Risco de payload

- `auxDialogItem()` monta payload diferente por tipo auxiliar
- Um wrapper prematuro pode quebrar campos especificos

### 12.4 Risco de salvamento

- `POST`, `PUT` e `DELETE` seguem no `app.js`
- Qualquer extracao apressada pode alterar o contrato de persistencia

### 12.5 Risco backend / banco

- Mesmo sem mudar backend nesta etapa, a tela conversa com rotas operacionais reais
- Nao mexer em schema, migration, filtro por tenant ou permissao

### 12.6 Risco de dependencia com outros modulos

- O ponto mais sensivel continua sendo a integracao pos-salvar com agenda
- O scaffold com `Plano de Contas` permanece compartilhado
- A fonte externa de cores pode variar e nao deve ser assumida como fixa

## 13. Recomendacao objetiva da proxima etapa

- A leitura atual indica que o ciclo de `Auxiliares / Tabelas auxiliares` ja esta consolidado no historico.
- Portanto, a proxima etapa correta nao e reiniciar a Subetapa 0, nao e duplicar a Subetapa 1 e nao e abrir uma Subetapa 2 funcional aqui.
- A recomendacao mais segura e:
  - pausa documental para este modulo
  - validacao final apenas se houver necessidade de smoke test
  - nova escolha de modulo, caso a modularizacao do frontend deva continuar

Em outras palavras:

- `Auxiliares` nao parece pedir nova subetapa funcional agora
- o proximo movimento mais seguro e sair deste modulo e abrir uma nova varredura documental para outro candidato, se a fila de modularizacao continuar

## 14. O que nao fazer na proxima etapa

- nao criar novo modulo JS
- nao duplicar Subetapa 0
- nao reiniciar a modularizacao de `Auxiliares`
- nao mover helpers sem um recorte minimo e claramente puro
- nao alterar `frontend/app.js`
- nao alterar `frontend/index.html`
- nao alterar `frontend/js/modules/auxiliares.js`
- nao alterar backend
- nao alterar banco, schema, migrations ou endpoints
- nao alterar payload ou salvamento
- nao corrigir textos, labels, acentos ou mojibake nesta frente

## 15. Checks recomendados para a proxima etapa

Se for necessario fazer apenas validacao final, os checks mais uteis sao:

- `git status --short`
- `git diff --stat`
- abrir `Tabelas auxiliares...` no navegador
- confirmar que a lista de tipos carrega
- trocar tipo e selecionar item
- testar `Novo`, `Altera` e `Elimina` em ambiente seguro
- confirmar console sem `ReferenceError` ou `TypeError`
- validar que `window.BranaAuxiliaresModule.getInfo()` continua acessivel

Se a ideia for continuar modularizando o frontend, os checks da proxima escolha de modulo devem voltar a incluir:

- branch
- status
- log recente
- mapeamento textual do novo modulo
- leitura do seu arquivo JS especifico

## 16. Confirmacao de que nenhuma alteracao funcional foi feita

- Nenhuma alteracao funcional foi feita nesta etapa.
- Nenhum arquivo JS foi modificado.
- Nenhum HTML foi modificado.
- Nenhum backend foi modificado.
- Nenhum banco/schema/migration foi modificado.
- Nenhum endpoint foi modificado.
- Nenhum payload foi modificado.
- Nenhum salvamento foi modificado.
- Nenhuma operacao de UPDATE, DELETE ou INSERT foi executada.
- Nenhum reajuste real foi executado.
- Nenhum comando `git add`, `git commit`, `git push`, `git clean`, `git reset` ou `git restore` foi executado.
- Nada foi criado, editado, salvo, documentado, copiado, movido, renomeado ou apagado nas pastas proibidas.
- A blindagem textual / mojibake foi respeitada.

