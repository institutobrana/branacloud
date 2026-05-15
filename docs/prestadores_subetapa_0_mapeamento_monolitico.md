# Prestadores - Subetapa 0 - Mapeamento monolitico

## 1. Contexto

Esta Subetapa 0 e somente documental.
O objetivo aqui e mapear o bloco de `Prestadores` existente em `frontend/app.js`, sem mover codigo, sem criar modulo novo e sem alterar comportamento.

## 2. Arquivos consultados

- `frontend/app.js`
- `frontend/index.html`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/anamnese_subetapa_5_encerramento_ciclo_helpers_textuais.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`
- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md`
- `docs/auxiliares_subetapa_1_namespace_passivo.md`
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`

## 3. Confirmacao de escopo

Esta etapa nao alterou:

- `frontend/app.js`
- `frontend/index.html`
- backend
- banco
- endpoints
- comportamento funcional

Tambem nao foi criado `frontend/js/modules/prestadores.js`.

## 4. Localizacao geral no `app.js`

### Termos encontrados

Os termos `prestador`, `prestadores` e variacoes aparecem em varios pontos do arquivo, mas o bloco funcional do modulo esta concentrado perto do fim de `frontend/app.js`.

Pontos principais observados:

- `requestJson("GET","/cadastros/prestadores",...)` em carga do bloco e em consumidores externos.
- `MENU_ACTION_MODULE_OVERRIDES["cadastro-prestadores"] = "prestadores"`.
- `if(action==="cadastro-prestadores"){ await prestAbrir(); return; }`.
- `function prestSelecionado()`, `prestStatusHtml()`, `prestFmtCodigo()`, `prestFiltrarLista()`, `prestRender()`, `prestSelecionarLinha()`, `prestCarregar()`, `prestAcoesPlaceholder()`, `prestEnsureUI()`, `prestAbrir()`.
- referencias de painel e contrato em `closeWorkspacePanel`, `PANEL_TITLE_DEFAULTS`, `panelInsetsById`, `modalInsetsById`, `closeModalByBackdropId` e `modalTitleByBackdropId`.

### Regiao aproximada do bloco

- O nucleo do modulo esta aproximadamente entre as linhas `23068` e `23077`.
- O disparo do menu aparece por volta da linha `22776`.
- A dependencia de carga em outros modulos aparece em pontos como `5435`, `10705`, `11771` e `11794-11797`.

### Concentrado ou espalhado

- O bloco proprio de `Prestadores` esta concentrado e monolitico.
- Ha referencias espalhadas em outros modulos que consomem a lista de prestadores ou reconhecem o painel pelo nome.

### Trechos legados / duplicidades

- Nao foi identificado um segundo bloco funcional de `Prestadores` com a mesma responsabilidade.
- Nao foi identificada reassignment posterior das funcoes `prest*` encontradas.
- O que existe fora do bloco principal sao contratos de shell, mapas de painel e consumidores externos.
- Os botoes `Agenda...`, `Convênios...` e `Comissões...` hoje estao como placeholders, o que sugere expansao futura ainda nao implementada.

## 5. Funcao principal de abertura

### Funcao encontrada

- `prestAbrir()`

### Fluxo ativo

O fluxo ativo atual e:

1. `prestEnsureUI()` cria a UI dinamica se ainda nao existir.
2. `hideAllPanels()` fecha os demais paineis.
3. `prestCfg.panel.classList.remove("hidden")` mostra o painel.
4. `workspaceEmpty.classList.add("hidden")` oculta a area vazia.
5. `ensurePanelChrome(prestCfg.panel)` garante o chrome do painel.
6. `await prestCarregar()` carrega e monta a lista.
7. `footerMsg.textContent="Cadastro > Prestadores aberto."`

### Disparo pelo menu

O dispatcher encaminha `action==="cadastro-prestadores"` para `prestAbrir()`.

## 6. Funcoes de criacao de UI

### Funcao de tela/painel

- `prestEnsureUI()`

O que ela faz:

- injeta um `<style>` com regras do painel;
- cria a estrutura HTML do painel `#prestadores-panel`;
- cria a barra de botoes;
- cria filtros por especialidade e nome;
- cria a grade/tabela;
- cria o total de registros;
- captura referencias DOM em `prestCfg`;
- chama `ensurePanelChrome(prestCfg.panel)`;
- instala a ativacao padrao da grade com `bindStandardGridActivation`.

### Funcoes de modal

- Nao ha criacao de modal real dentro do bloco principal de `Prestadores`.
- Os contratos `prest-modal-backdrop`, `prest-agenda-backdrop`, `prest-agenda-bloqueio-backdrop`, `prest-agenda-fonte-backdrop`, `prest-cred-modal-backdrop` e `prest-com-modal-backdrop` aparecem apenas em mapas genericos do shell.
- Nao foram encontradas funcoes concretas de abrir/preencher/limpar esses modais nesta Subetapa 0.

## 7. Funcoes de carregamento / listagem

### Funcao encontrada

- `prestCarregar()`

### Como carrega os dados

- Usa `requestJson("GET","/cadastros/prestadores", undefined, true)`.
- Espera `data.itens`.
- Normaliza cada item para um formato interno com:
  - `id`
  - `codigo`
  - `nome`
  - `fone1`
  - `fone2`
  - `ativo`
  - `especialidade`
  - `especialidades_exec`

### Quando carrega

- No `prestAbrir()`, logo apos o painel ser exibido.

### Cache local

- Usa `prestadoresCache`.
- Usa `prestadorSelId` para manter a linha selecionada.
- Recria o combo de especialidade com base no cache carregado.

### Fallback observado

Se o request falhar, ha fallback local:

- se existir `sessaoAtual`, entra um registro sintetico com o usuario logado;
- se nada existir, entra um item `"Clínica"`.

Esse fallback e importante porque mascara falha de rede com uma lista minima e precisa ser tratado com cautela em etapas futuras.

## 8. Funcoes de renderizacao

### Funcao encontrada

- `prestRender()`

### O que renderiza

- monta `tbody` da tabela;
- destaca a linha selecionada com classe `selected`;
- mostra status visual com ponto verde/vermelho;
- atualiza o total exibido em `prestCfg.total`.

### Funcoes auxiliares de render

- `prestStatusHtml(ativo)` monta o indicador visual de status.
- `prestFmtCodigo(valor, idx)` formata o codigo exibido.
- `prestFiltrarLista()` aplica filtro por especialidade e por texto do nome/fone.

### Estado vazio

- Quando nao ha itens, `prestRender()` exibe:
  - `Nenhum prestador encontrado.`

### Status visual

- O status hoje e apenas visual.
- Nao existe aqui uma maquina de status mais complexa, apenas ativo/inativo no marcador.

## 9. Selecao e ativacao de linha

### Funcao encontrada

- `prestSelecionarLinha(tr)`

### Comportamento

- Armazena o `data-id` da linha em `prestadorSelId`.
- Reexecuta `prestRender()` para manter destaque visual.

### Bind usado

- `bindStandardGridActivation(prestCfg.tbody, tr => prestSelecionarLinha(tr), () => prestAcoesPlaceholder("Altera"))`

### Observacao sobre clique simples e segundo clique rapido

- Nao foi usado `dblclick` nativo no bloco.
- O comportamento de ativacao da grade fica centralizado em `bindStandardGridActivation`.
- Isso atende o padrao conservador desta rodada e evita espalhar logica de clique rapido no modulo.

### Risco em tabela dinamica

- Como `prestRender()` recria o `tbody`, qualquer estrategia dependente de DOM persistente pode ficar sensivel.
- O uso de `bindStandardGridActivation` reduz esse risco, mas a tabela continua dinamica e precisa ser preservada com cuidado em futuras extracoes.

## 10. Funcoes de modal

### Situacao atual

Nao foram encontradas funcoes reais de modal para o modulo principal de `Prestadores`.

### Contratos existentes no shell

Os seguintes contratos aparecem nos mapas genericos:

- `prest-modal-backdrop`
- `prest-agenda-backdrop`
- `prest-agenda-bloqueio-backdrop`
- `prest-agenda-fonte-backdrop`
- `prest-cred-modal-backdrop`
- `prest-com-modal-backdrop`

Eles hoje servem como contratos de fechamento/titulos/insets, nao como fluxo completo de modal mapeado aqui.

### Modo novo/alterar

- Nao identificado nesta Subetapa 0.
- Os botoes `Novo prestador...` e `Altera...` atualmente so chamam `prestAcoesPlaceholder()`.

## 11. Funcoes de salvar

### Situacao atual

- Nao existe fluxo de salvar implementado para `Prestadores` neste bloco.
- Nao foram encontrados:
  - validacao de formulario;
  - montagem de payload;
  - `POST`;
  - `PATCH`;
  - `PUT`;
  - atualizacao de lista apos salvar;
  - mensagens de salvamento reais.

### Botoes relacionados

- `prest-btn-novo`
- `prest-btn-editar`

Hoje ambos usam somente `prestAcoesPlaceholder()`.

## 12. Funcoes de excluir / inativar

### Situacao atual

- Nao existe exclusao/inativacao funcional mapeada para o modulo principal.
- O botao `Elimina` tambem aponta para `prestAcoesPlaceholder()`.
- Nao foram encontrados endpoints de exclusao, confirmacoes ou refresh pos-exclusao para `Prestadores`.

### Status

- Existe apenas indicacao visual de ativo/inativo na grade.
- Nao ha toggle funcional de status nesta etapa.

## 13. Eventos e binds

### Eventos identificados no bloco principal

| Evento | Alvo | Papel |
|---|---|---|
| `click` | linha da grade via `bindStandardGridActivation` | seleciona linha e prepara segundo clique rapido |
| `change` | `prest-cbo-especialidade` | re-renderiza a lista |
| `input` | `prest-txt-nome` | re-renderiza a lista |
| `click` | `prest-btn-novo` | placeholder de novo prestador |
| `click` | `prest-btn-editar` | placeholder de alteracao |
| `click` | `prest-btn-excluir` | placeholder de eliminacao |
| `click` | `prest-btn-agenda` | placeholder de agenda |
| `click` | `prest-btn-convenios` | placeholder de convenios |
| `click` | `prest-btn-comissoes` | placeholder de comissoes |
| `click` | `prest-btn-fechar` | fecha o painel |

### Observacao sobre `bindStandardGridActivation`

- Ele e o ponto mais importante de ativacao da grade.
- Deve ser preservado em futuras etapas porque concentra selecao e segundo clique rapido.

### Teclado

- Nao foi identificado bind de teclado especifico para o bloco principal de `Prestadores`.

## 14. Estados / caches globais

### Estados encontrados

- `prestCfg`
- `prestadoresCache`
- `prestadorSelId`

### Estados correlatos e dependencias de contexto

- `sessaoAtual` e usada como fallback quando o carregamento falha.
- `footerMsg` recebe mensagens do fluxo.
- `workspaceEmpty` e alternado na abertura/fechamento.

### Observacao

- Nao foram identificados caches auxiliares adicionais no bloco principal, como timers ou flags especificos.
- O modulo hoje e pequeno do ponto de vista de estado local, embora seja consumido por outros fluxos do sistema.

## 15. Endpoints usados

### Endpoint direto do modulo

- `GET /cadastros/prestadores`

### O que nao foi encontrado

- Nenhum `POST` para criar.
- Nenhum `PUT`/`PATCH` para atualizar.
- Nenhum `DELETE` para excluir.
- Nenhum endpoint auxiliar de modal no bloco principal.

### Endpoints relacionados em outros consumidores

Fora do modulo principal, a lista de prestadores e reutilizada por:

- `GET /cadastros/prestadores` em `usersCarregarCombos()`
- `GET /cadastros/prestadores` em outras cargas de apoio
- `GET /agenda-legado/prestadores` em agenda legado
- `GET /agenda-legado/prestadores` em agenda da semana

Esses consumidores reforcam que `Prestadores` e um dado central, nao apenas uma tela isolada.

## 16. Contratos DOM

### IDs criados dinamicamente pelo painel

- `prestadores-panel`
- `prest-btn-novo`
- `prest-btn-editar`
- `prest-btn-excluir`
- `prest-btn-agenda`
- `prest-btn-convenios`
- `prest-btn-comissoes`
- `prest-btn-fechar`
- `prest-cbo-especialidade`
- `prest-txt-nome`
- `prest-tbody`
- `prest-total`

### Classes relevantes

- `.prest-panel`
- `.prest-toolbar`
- `.prest-filtros`
- `.prest-grid`
- `.prest-total`
- `.sep`

### Estrutura da tabela

- Coluna 1: `Código`
- Coluna 2: `Nome`
- Coluna 3: `Fone 1`
- Coluna 4: `Fone 2`
- Coluna 5: `Status`

### Observacao sobre `index.html`

- O painel de `Prestadores` nao aparece como markup estatico no `frontend/index.html` consultado nesta etapa.
- A estrutura e injetada dinamicamente por `prestEnsureUI()` no `app.js`.

## 17. Dependencias com outros modulos

### Dependencias que usam a lista de prestadores

- `usersCarregarCombos()` usa `GET /cadastros/prestadores` para popular o combo de prestador no cadastro de usuarios.
- `usersBuildFallbackProfiles()` e `usersBuildFallbackFunctionsByModule()` usam o nome `prestadores` em permissoes e funcoes de fallback.
- `agenda-legado` e `agenda-semana` consomem prestadores para filtros, agenda e selecao de horarios.
- O dispatcher e o shell conhecem `cadastro-prestadores` e `prestadores-panel`.

### Dependencias de cadastros vizinhos

- `prest-cred-panel` e `prest-com-panel` aparecem no shell como subpaines previstos.
- `convênios e planos` aparece como contexto vizinho, mas nao foi movido.
- `agenda` usa prestador como dado de apoio, o que aumenta a sensibilidade do modulo.

## 18. Riscos

### Riscos de evento e duplo clique

- A tabela e dinamica e depende de `bindStandardGridActivation`.
- Extrair ou recriar binds cedo demais pode quebrar selecao e ativacao por segundo clique rapido.

### Riscos de renderizacao

- `prestRender()` recria o `tbody`.
- Filtros mudam a lista enquanto a selecao pode estar ativa.
- O status e somente visual e pode gerar falsa impressao de fluxo completo.

### Riscos de payload

- Ainda nao existe payload funcional de salvar, entao mover validacoes cedo seria especulativo.

### Riscos de endpoint

- O unico endpoint direto encontrado e de leitura.
- Se a extracao antecipar salvar/excluir, o contrato real ainda precisara ser descoberto antes de codificar.

### Riscos de estado global

- `prestadoresCache` e `prestadorSelId` sao globais.
- Se houver futura modularizacao, esse estado precisara de contrato claro para nao quebrar consumidores externos.

### Riscos com modulos ainda monoliticos

- `users`, `agenda` e futuras subetapas de `credenciamento/comissao` ainda dependem do dado `prestadores`.
- Mexer cedo na superficie do modulo pode impactar fluxos que ainda estao monoliticos.

### Riscos de mover cedo demais

- Nao mover cedo:
  - abertura principal;
  - criacao de UI;
  - `requestJson`/`fetch`;
  - renderizacao;
  - selecao de linha;
  - `bindStandardGridActivation`;
  - modais;
  - salvar;
  - excluir;
  - integracoes com backend;
  - integracoes com outros cadastros.

## 19. Helpers puros candidatos

### Candidatos seguros e pequenos

- `prestFmtCodigo(valor, idx)` 
- `prestStatusHtml(ativo)`
- `prestNormalizarNomePrestador(texto)`
- `prestValidarNomePrestador(texto)`
- `prestNormalizarEspecialidade(texto)`
- `prestMontarLabelPrestador(item)`

### Observacao

- Nesta Subetapa 0 nao foi identificado um fluxo de conselho/registro, email ou telefone com validacao dedicada no modulo principal.
- Se essas regras aparecerem depois, elas devem entrar como helpers separados e pequenos.

## 20. O que nao deve ser movido cedo

Por seguranca, nao devem ser movidos agora:

- abertura principal;
- criacao de UI;
- `requestJson`/`fetch`;
- renderizacao;
- selecao de linha;
- `bindStandardGridActivation`;
- modais;
- salvar;
- excluir;
- integracoes com backend;
- integracoes com outros cadastros.

## 21. Recomendacao para a proxima etapa

### Subetapa 1 recomendada

Criar `frontend/js/modules/prestadores.js` como namespace passivo, sem extracao de comportamento ainda.

### Contrato recomendado do namespace

- `window.BranaPrestadoresModule`
- `meta`
- `getInfo()`
- `getStatus()`
- `status: "passivo"`
- `ativo: false`
- `controlaFluxo: false`

### Regras da Subetapa 1

- sem DOM;
- sem `fetch`/`requestJson`;
- sem eventos;
- sem controle de fluxo;
- carregar no `index.html` antes de `app.js`.

### Intencao

Essa proxima fase deve apenas preparar a fronteira documental e estrutural do modulo, mantendo o comportamento inteiro no `app.js`.

