# Fase 2B - Preferencias remanescentes - Segundo contrato profundo controlado

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Módulo comum/core: `Preferencias / Configuracoes remanescentes`
- Segundo contrato profundo: sim
- Implementacao: nao
- Commit de implementacao validado: `593a5b63669ad00d80609c2210e83bcc7dd88b89`
- Commit de validacao pos-teste: `5bf60619e29124a9e229b1454407100ac28ce0b1`
- Commit da escolha controlada do proximo recorte: `bc7e1caf42fa6055623bd38587442e32df844a1a`
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
  - `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
  - `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
  - `docs/fase_2b_escolha_proximo_recorte_medio_controlado.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
  - `docs/11_roadmap_desenvolvimento.md`

## 1. Identificacao da etapa

- Esta etapa e exclusivamente documental.
- Nao houve implementacao.
- Nao houve criacao de helper.
- Nao houve movimento de funcao.
- Nao houve alteracao de import/export.
- O objetivo e mapear o restante seguro de `Preferencias remanescentes` e recomendar um unico proximo recorte medio controlado, ainda sem executar nada.
- `Preferencias / Configuracoes remanescentes` continua sendo tratada como modulo comum/core do sistema.

## 2. Estado atual apos o primeiro recorte validado

- O recorte validado anteriormente foi o preview visual da aba `Ambiente`.
- Nesse recorte, saiu parcialmente de `app.js`:
  - montagem visual da lista lateral da aba `Ambiente`;
  - aplicacao visual dos estilos no preview;
  - injeccao do CSS auxiliar do preview;
  - construcao do preview interno da area de exemplo.
- Permaneceram em `app.js`:
  - abertura da modal;
  - carregamento;
  - salvamento;
  - roteamento;
  - fechamento de modal;
  - `prefAbrirDialogoFonteAmbiente()`;
  - `prefSincronizarUI()`;
  - o fluxo `prefCarregarDados()` / `prefSalvar*()`;
  - `sysOpt*`.
- O teste manual foi validado pelo usuario e passou.
- Os limites continuam vigentes:
  - nada de backend;
  - nada de banco;
  - nada de endpoints;
  - nada de permissoes;
  - nada de payload efetivo;
  - nada de requestJson como area de alteracao;
  - nada de salvamento;
  - nada de `sysOpt*`;
  - nada de Odontograma.

## 3. Mapa atualizado das funcoes restantes de Preferencias

### 3.1. Visual/local potencialmente seguro

- `prefTituloAtual()`
- `prefAtualizarTitulo()`
- `prefSelecionarAba(tabId)`
- `prefValoresPadrao()`
- `prefValoresPadraoModelos()`
- `prefValoresPadraoAmbiente()`
- `prefValoresPadraoDados()`
- `prefRenderCombos()`
- `prefRenderCombosModelos()`
- `prefRenderCombosDados()`
- `prefRenderCombosAmbiente()` como wrapper ja muito fino, mas nao como foco deste contrato
- `prefAmbienteSecoesAtuais()` como helper de leitura/merge local

### 3.2. Renderizacao de combos/listas

- `prefRenderCombos()` para a aba Geral
- `prefRenderCombosModelos()` para a aba Modelos
- `prefRenderCombosDados()` para a aba Dados do usuario
- `prefRenderListaAmbiente()` ja esta fora do foco principal deste segundo contrato, por causa do primeiro recorte ja validado

### 3.3. Navegacao entre abas

- `prefSelecionarAba(tabId)`
- `prefAbrir()` apenas como ponto de entrada/orquestracao, nao como candidato de extracao

### 3.4. Titulo e estado visual

- `prefTituloAtual()`
- `prefAtualizarTitulo()`
- `prefSincronizarUI()` como orquestrador visual, nao como area de alteracao funcional neste contrato

### 3.5. Abertura e montagem da UI

- `prefEnsureUI()` permanece grande e sensivel demais para ser o recorte desta etapa
- `prefAbrir(opts)` permanece como entrada da modal e nao deve ser quebrada nesta fase
- `prefAbrirDialogoFonteAmbiente()` permanece no mapa, mas nao e o foco deste contrato

### 3.6. Carregamento, salvamento, payload e requestJson

- `prefCarregarDados()`
- `prefColetarPayload()`
- `prefColetarPayloadModelos()`
- `prefColetarPayloadAmbiente()`
- `prefColetarPayloadDados()`
- `prefColetarPayloadOdontograma()`
- `prefSalvarGeral()`
- `prefSalvarModelos()`
- `prefSalvarAmbiente()`
- `prefSalvarDados()`
- `prefSalvarOdontograma()`
- `requestJson`

### 3.7. Areas proibidas

- `sysOpt*`
- qualquer fluxo de Odontograma
- qualquer fluxo de permissao, seguranca, debug ou financeiro
- qualquer alteracao de backend, banco, endpoints, permissões, payload ou salvamento

## 4. Mapa de DOM

### 4.1. DOM visual/local

- `#config-preferencias-backdrop`
- `.pref-modal`
- `.pref-tabs`
- `.pref-tab`
- `.pref-pane`
- `.pref-footer`
- `#pref-amb-example`
- `#pref-amb-enunciado`
- `#pref-amb-campo-label`
- `#pref-amb-campo-input`
- `#pref-amb-botao-funcao`
- `#pref-amb-lista-1`
- `#pref-amb-lista-2`
- `#pref-amb-lista-3`
- `#pref-amb-lista-4`

### 4.2. DOM de abas e combos

- `data-tab="geral"`
- `data-tab="modelos"`
- `data-tab="ambiente"`
- `data-tab="dados"`
- `data-tab="odontograma"`
- `#pref-geral-pesquisa`
- `#pref-geral-tabela`
- `#pref-geral-convenio`
- `#pref-modelo-atestado`
- `#pref-modelo-receita`
- `#pref-modelo-recibo`
- `#pref-modelo-etiqueta`
- `#pref-modelo-email`
- `#pref-modelo-orcamento`
- `#pref-modelo-whatsapp`
- `#pref-dados-uf`

### 4.3. DOM de carregamento e salvamento

- `#pref-btn-ok`
- `#pref-btn-cancel`
- `#pref-geral-msg`
- `#pref-geral-historico`
- `#pref-geral-quadro`
- `#pref-geral-busca`
- `#pref-geral-alarme`
- `#pref-geral-alarme-min`
- `#pref-dados-nome`
- `#pref-dados-apelido`
- `#pref-dados-email`
- `#pref-dados-endereco`
- `#pref-dados-bairro`
- `#pref-dados-cidade`
- `#pref-dados-cep`
- `#pref-dados-uf`
- `#pref-dados-pais`
- `#pref-dados-telefones`
- `#pref-dados-cro`
- `#pref-dados-cpf`

### 4.4. DOM sensivel/proibido

- `#pref-odonto-especialidade`
- `#pref-odonto-filtro`
- `#pref-odonto-anamnese`
- `#pref-odonto-icones`
- `#pref-odonto-imagens`
- `#pref-odonto-cirurgiao`
- `#pref-odonto-historico-desc`
- `#pref-odonto-dados-paciente`
- `#pref-odonto-dados-tratamento`
- `#pref-odonto-observacoes`
- `#pref-odonto-documentos`
- `#pref-odonto-agenda-dia`
- `#pref-odonto-cor-realizar`
- `#pref-odonto-cor-realizado`
- `#pref-odonto-cor-observada`
- `#pref-odonto-cor-anomalia`
- `#pref-odonto-hint`
- qualquer DOM de `sysOpt*`

## 5. Mapa de eventos

### 5.1. Eventos visuais locais

- clique nas abas da modal:
  - chama `prefSelecionarAba(tabId)`
- clique no backdrop da modal:
  - fecha a modal sem alterar dados
- clique em preview da aba Ambiente:
  - permanece no bloco ja validado pelo primeiro recorte

### 5.2. Eventos de combos e sincronizacao visual

- `prefRenderCombos()`, `prefRenderCombosModelos()` e `prefRenderCombosDados()` nao criam eventos novos por si sÃ³
- sao alimentados por `prefSincronizarUI()`
- o comportamento relevante e a repopulacao visual ao abrir a modal ou trocar o estado interno

### 5.3. Eventos com possivel disparo de carregamento

- `prefAbrir(opts)` inicia `prefCarregarDados()`
- eventuais restauracoes e trocas internas devem continuar sem disparar novas chamadas de rede alem do fluxo atual

### 5.4. Eventos com possivel disparo de salvamento

- clique em `#pref-btn-ok`
  - chama `prefSalvarGeral()` / `prefSalvarModelos()` / `prefSalvarAmbiente()` / `prefSalvarDados()` / `prefSalvarOdontograma()` conforme aba
- este fluxo permanece proibido para alteracao nesta etapa

### 5.5. Eventos proibidos para o proximo recorte

- qualquer listener de `sysOpt*`
- qualquer listener de Odontograma
- qualquer listener que chame `requestJson` fora do fluxo ja existente
- qualquer listener que altere payload, backend, permissões ou salvamento

## 6. Mapa de requestJson / payload / salvamento

- `prefCarregarDados()`
  - usa `requestJson("GET", ...)` nas rotas:
    - `/preferences/general`
    - `/preferences/models`
    - `/preferences/environment`
    - `/preferences/user-data`
    - `/preferences/odontogram`
- `prefColetarPayload()`, `prefColetarPayloadModelos()`, `prefColetarPayloadAmbiente()`, `prefColetarPayloadDados()` e `prefColetarPayloadOdontograma()`
  - montam payload efetivo
  - devem permanecer intocados
- `prefSalvarGeral()`, `prefSalvarModelos()`, `prefSalvarAmbiente()`, `prefSalvarDados()`, `prefSalvarOdontograma()`
  - usam `requestJson("PATCH", ...)`
  - devem permanecer intocados
- `sysOptCarregar()`, `sysOptColetarPayload()`, `sysOptSalvar()`
  - permanecem fora do escopo e nao devem ser alterados

## 7. Candidatos de recorte dentro de Preferencias remanescentes

### Candidato 1 - Recomendado

- Descricao:
  - delegar a renderizacao dos combos das abas `Geral`, `Modelos` e `Dados` para helpers passivos no modulo existente, mantendo `prefSincronizarUI()` como orquestrador.
- Funcoes envolvidas:
  - `prefRenderCombos()`
  - `prefRenderCombosModelos()`
  - `prefRenderCombosDados()`
  - `prefSincronizarUI()` como ponto de chamada
- DOM envolvido:
  - `#pref-geral-pesquisa`
  - `#pref-geral-tabela`
  - `#pref-geral-convenio`
  - `#pref-modelo-atestado`
  - `#pref-modelo-receita`
  - `#pref-modelo-recibo`
  - `#pref-modelo-etiqueta`
  - `#pref-modelo-email`
  - `#pref-modelo-orcamento`
  - `#pref-modelo-whatsapp`
  - `#pref-dados-uf`
- Eventos envolvidos:
  - abertura da modal
  - troca de aba
  - sincronizacao visual apos carregamento
- requestJson:
  - nao toca
- payload:
  - nao toca
- salvamento:
  - nao toca
- risco:
  - baixo a medio
- ganho esperado:
  - reduz duplicacao de montagem visual em `app.js`
  - separa um bloco visual local com teste claro
- teste manual possivel:
  - abrir Preferencias
  - verificar as abas `Geral`, `Modelos` e `Dados`
  - confirmar que os combos continuam populados
  - fechar sem salvar e reabrir
- rollback mental:
  - devolver a montagem dos selects para `app.js`
  - manter os dados carregados e o fluxo de salvamento intactos
- decisao:
  - recomendado

### Candidato 2 - Rejeitado

- Descricao:
  - extrair `prefSelecionarAba()` e `prefAtualizarTitulo()` para um helper visual de navegacao/titulo.
- Funcoes envolvidas:
  - `prefSelecionarAba()`
  - `prefAtualizarTitulo()`
  - `prefTituloAtual()`
- DOM envolvido:
  - `.pref-tab`
  - `.pref-pane`
  - titulo da modal
- Eventos envolvidos:
  - clique nas abas
- requestJson:
  - nao toca
- payload:
  - nao toca
- salvamento:
  - nao toca
- risco:
  - baixo, mas o ganho e pequeno demais para ser o melhor proximo recorte
- ganho esperado:
  - reduz pouco o volume de `app.js`
- teste manual possivel:
  - alternar abas e conferir o titulo
- rollback mental:
  - recolocar a troca de classes e o titulo no `app.js`
- decisao:
  - rejeitado como proximo recorte porque entrega pouco ganho comparado ao bloco de combos

### Candidato 3 - Rejeitado

- Descricao:
  - mover apenas os defaults/normalizacao visual de `prefValoresPadrao*` e `prefAmbienteSecoesAtuais()` para um bloco dedicado.
- Funcoes envolvidas:
  - `prefValoresPadrao()`
  - `prefValoresPadraoModelos()`
  - `prefValoresPadraoAmbiente()`
  - `prefValoresPadraoDados()`
  - `prefAmbienteSecoesAtuais()`
- DOM envolvido:
  - nenhum ou minimo
- Eventos envolvidos:
  - nenhum novo
- requestJson:
  - nao toca
- payload:
  - nao toca
- salvamento:
  - nao toca
- risco:
  - muito baixo
- ganho esperado:
  - baixo demais para um recorte medio controlado
- teste manual possivel:
  - muito limitado, quase invisivel
- rollback mental:
  - simples, mas sem ganho real suficiente
- decisao:
  - rejeitado como proximo recorte por pouca reducao pratica

## 8. Recomendacao de um unico recorte

- Recomendacao:
  - delegar a renderizacao dos combos das abas `Geral`, `Modelos` e `Dados` para o modulo passivo existente, mantendo `prefSincronizarUI()` como orquestrador.
- Módulo/frente:
  - `Preferencias remanescentes`
- Classificacao:
  - comum/core
- Por que foi escolhida:
  - nao toca backend, banco, endpoints, permissões, requestJson, payload ou salvamento
  - tem ganho real de reducao e organizacao do `app.js`
  - permanece visual/local
  - tem teste manual simples e claro
  - tem rollback mental simples
- Por que os demais ficaram em segundo plano:
  - `prefSelecionarAba`/titulo entrega pouco ganho
  - defaults/normalizacao entregam ganho pequeno demais para o custo de uma subetapa media
- Proxima subetapa:
  - implementar minimamente a delegacao dos combos recomendados, apenas depois de novo contrato/aprovacao
- Recorte que deve ser apenas investigado, sem implementar ainda:
  - qualquer expansao para `sysOpt*`
  - qualquer expansao para Odontograma
  - qualquer expansao para salvamento/payload/requestJson

## 9. Teste manual previsto

- Menu/tela:
  - abrir o sistema e entrar em `Configuracao > Preferencias`
- Abas:
  - testar `Geral`, `Modelos`, `Ambiente` e `Dados do usuario`
- Acoes:
  - trocar entre as abas
  - observar os combos de `Geral` e `Modelos`
  - observar o combo de UF em `Dados`
  - confirmar que o preview de `Ambiente` continua funcionando como antes
- Comportamento esperado:
  - modal abre normalmente
  - abas continuam alternando normalmente
  - combos continuam populados
  - o preview de `Ambiente` nao queima
- O que nao pode quebrar:
  - fechamento da modal
  - carregamento
  - salvamento
  - `footerMsg`
  - `sysOpt*`
- Deve testar salvar?
  - nao nesta futura subetapa; o foco e visual/local
- Deve testar fechamento/reabertura?
  - sim, fechar sem salvar e reabrir para confirmar persistencia do comportamento visual

## 10. Risco residual e rollback mental

- Riscos principais:
  - duplicar ou perder alguma opcao visual de combo
  - quebrar a sincronizacao visual de abas
  - alterar sem querer o comportamento de `prefSincronizarUI()`
- Como perceber quebra:
  - select vazio
  - valor incorreto apos troca de aba
  - modal abrindo com aba errada
  - erro visual ao trocar entre `Geral`, `Modelos` e `Dados`
- Como comparar com o comportamento anterior:
  - abrir a modal antes e depois da eventual implementacao
  - verificar se os mesmos combos continuam populados da mesma forma
- Como reverter mentalmente:
  - devolver a montagem dos options para `app.js`
  - manter apenas chamadas de orquestracao e helpers puros
- Por que o recorte e aceitavel:
  - e visual/local
  - nao toca nas fronteiras proibidas
  - tem rollback simples
  - tem ganho real de organizacao

## 11. Registro para roadmap

- O segundo contrato profundo de `Preferencias remanescentes` foi criado.
- Nenhuma implementacao foi feita.
- O recorte analisado e recomendado foi a delegacao da renderizacao dos combos das abas `Geral`, `Modelos` e `Dados`.
- Os limites da Fase 2B continuam vigentes.
- O teste manual previsto e simples e nao inclui salvamento.
- `sysOpt*`, Odontograma, requestJson, payload, salvamento, backend e permissões continuam fora do escopo.
- A blindagem textual/mojibake foi respeitada.
