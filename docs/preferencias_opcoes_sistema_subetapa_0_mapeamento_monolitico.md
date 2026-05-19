# Preferências e Opções do Sistema — Subetapa 0 — Mapeamento monolítico

## Objetivo

Mapear, de forma conservadora e somente documental, o bloco de Preferências e Opções do Sistema que ainda vive dentro de `frontend/app.js`.

Esta etapa identifica:
- onde o bloco fica;
- quais funções existem;
- quais entradas de menu/painel o abrem;
- quais trechos parecem visuais;
- quais trechos mexem com DOM, estado, payload, salvamento e backend;
- quais partes podem virar helper puro ou namespace passivo numa etapa futura.

## Escopo

Esta Subetapa 0 é exclusivamente documental.

Não houve:
- criação de código funcional;
- criação de `frontend/js/modules/preferencias.js`;
- alteração de `frontend/app.js`;
- alteração de `frontend/index.html`;
- alteração de backend, banco, schema, migrations ou endpoints;
- alteração de payload, salvamento ou permissões;
- correção de textos, acentos ou mojibake;
- UPDATE, DELETE ou INSERT;
- reajuste real.

## Arquivos inspecionados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/`
- `docs/varredura_proximo_modulo_pos_intervencoes_auxiliares.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`
- HEAD atual: `9a5ff18` `Recomenda Preferencias e Opcoes do Sistema como proximo modulo`
- `origin/modularizacao-segura-fase-1` aponta para o mesmo commit
- Há pendências no working tree, mas elas são untracked e fora desta etapa; não há diff funcional pendente em arquivos rastreados
- `git diff --stat` vazio
- `git diff --cached --stat` vazio

### Observação sobre pendências

O `git status --short` mostra várias entradas `?? docs/...` já existentes no ambiente, além de `git` e `modularizacao-segura-fase-1` no diretório raiz. Nada disso foi tocado nesta etapa.

## Localização inicial no frontend/app.js

O bloco está concentrado em duas regiões principais:

- `pref*` aproximadamente entre as linhas `2242` e `2851`
- `sysOpt*` aproximadamente entre as linhas `2853` e `3097`

Há também gatilhos externos no dispatcher e no HTML:

- `config-preferencias` e `config-opcoes-sistema` no menu lateral/shell;
- botão `users-btn-preferencias` no painel de usuários;
- `prefAbrir()` e `sysOptAbrir()` como portas de entrada do modal.

## Entradas de menu/painel

- `frontend/index.html:2650-2651`
  - `Preferências...`
  - `Opções do sistema...`
- `frontend/index.html:3207`
  - botão `Preferências...` dentro do painel de usuários
- `frontend/app.js:23119-23132`
  - `config-preferencias` chama `prefAbrir()`
  - `config-opcoes-sistema` chama `sysOptAbrir()`
  - `config-opcoes-sistema` exige perfil admin (`sessaoAtual?.is_admin`)
- `frontend/app.js:12003`
  - `usersAbrirPreferencias()` abre Preferências para o usuário selecionado

## Funções encontradas

| Função | Linha aproximada | Papel aparente | DOM | Estado | API/backend | Payload/salvamento | Classificação | Observações |
|---|---:|---|---|---|---|---|---|---|
| `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefTituloAtual` | 2242-2245 | contexto do modal e título | não | sim | não | não | cautela | lê `sessaoAtual`/contexto global |
| `prefValoresPadrao`, `prefValoresPadraoModelos`, `prefAmbEstiloPadrao`, `prefValoresPadraoAmbiente`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma` | 2246-2267 | defaults locais | não | não | não | não | seguro | bons candidatos a helper puro |
| `prefAtualizarTitulo`, `prefSelecionarAba` | 2268-2269 | atualização visual do modal | sim | sim | não | não | cautela | troca título, abas e footer |
| `prefRenderCombos`, `prefRenderCombosModelos`, `prefRenderCombosDados`, `prefRenderCombosAmbiente`, `prefRenderCombosOdontograma` | 2270-2434 | renderização de opções/combos | sim | sim | não | não | cautela | dependem de `prefCfg` e listas carregadas |
| `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva`, `prefAmbienteEstiloAtual` | 2282-2294 | leitura/normalização do estado de ambiente | não | sim | não | não | cautela | não persistem nada, mas leem estado do modal |
| `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor`, `prefAmbienteEstiloDeDialogo` | 2298-2306 | transformação de dados de estilo | não | não/indireto | não | não | seguro/cautela | `prefAmbienteEstiloDeDialogo` tem dependência opcional de helper externo |
| `prefAbrirDialogoFonteAmbiente` | 2310 | integra diálogo de fonte externa | sim | sim | não | não | cautela | depende de `window.easyFontAbrir` |
| `prefRenderListaAmbiente`, `prefAplicarEstiloAmbiente`, `prefAplicarPreviewAmbiente` | 2316-2333 | preview visual do ambiente | sim | sim | não | não | cautela | mexe com DOM e estilos, sem salvar |
| `prefEnsureAmbienteOverrides`, `prefRebuildAmbientePreview` | 2352-2374 | montagem de CSS/preview | sim | sim | não | não | cautela | injeta estilo e HTML no modal |
| `prefOdontoNorm`, `prefOdontoFindByLabel` | 2455-2456 | normalização e busca textual | não | não | não | não | seguro | bons candidatos a helper puro |
| `prefOdontoEnsurePalette`, `prefOdontoCloseLists`, `prefOdontoSyncHeader`, `prefOdontoRenderList`, `prefOdontoEnsureDropdown`, `prefOdontoEnsureColorDropdowns` | 2457-2532 | suporte ao seletor de cores do odontograma | sim | sim | não | não | cautela | DOM pesado, mas ainda sem payload |
| `prefSincronizarUI` | 2541 | sincroniza estado para DOM | sim | sim | não | não | cautela | núcleo visual de leitura/escrita de controles |
| `prefColetarPayload`, `prefColetarPayloadModelos`, `prefColetarPayloadAmbiente`, `prefColetarPayloadDados`, `prefColetarPayloadOdontograma` | 2614-2637 | monta payloads | sim/indireto | sim | não | sim | proibido nesta fase | fronteira que não deve ser extraída agora |
| `prefCarregarDados` | 2638 | carrega dados do backend | sim | sim | sim | não | proibido nesta fase | lê `/preferences/*` |
| `prefSalvarGeral`, `prefSalvarModelos`, `prefSalvarAmbiente`, `prefSalvarDados`, `prefSalvarOdontograma` | 2639-2643 | grava preferências | sim | sim | sim | sim | proibido nesta fase | atualizam backend e, no caso de dados, também `sessaoAtual` |
| `prefEnsureUI` | 2644-2849 | cria modal, estilo, campos e binds | sim | sim | não | não | cautela | monta o bloco inteiro em runtime |
| `prefAbrir` | 2851 | abre o modal e recarrega dados | sim | sim | sim | não | cautela/proibido por dependência | é a porta de entrada da tela, mas acopla carregamento |
| `sysOptSelecionarAba` | 2853 | troca abas e texto do modal | sim | sim | não | não | cautela | visual e de estado |
| `sysOptRenderSelects` | 2868 | popula selects por opções externas | sim | sim | indireta | não | cautela | usa `procPreencherSelect` e dados carregados |
| `sysOptSyncUI` | 2924 | sincroniza valores para DOM | sim | sim | não | não | cautela | espelha `values` no formulário |
| `sysOptColetarPayload` | 2991 | monta payload de opções do sistema | sim/indireto | sim | não | sim | proibido nesta fase | inclui blocos de clínica, financeiro, segurança, data e avançado |
| `sysOptCarregar` | 3048 | GET de opções do sistema | sim | sim | sim | não | proibido nesta fase | endpoint `/system-options` |
| `sysOptSalvar` | 3061 | PATCH de opções do sistema | sim | sim | sim | sim | proibido nesta fase | impacto sistêmico e de permissões |
| `sysOptFechar` | 3081 | fecha modal com regra de bloqueio | sim | sim | não | não | cautela | respeita `usersPanelOverlay` |
| `sysOptAbrir` | 3089 | abre modal e carrega dados | sim | sim | sim | não | cautela/proibido por dependência | porta de entrada do modal |
| `sysOptEnsureUI` | 3097 | cria CSS, modal, controles e binds | sim | sim | não | não | cautela | constrói a interface inteira em runtime |

### Funções de abertura e menu correlatas

- `usersAbrirPreferencias()` é um atalho administrativo para `prefAbrir({ targetUser: u, origin: "usuarios" })`.
- O dispatcher do shell abre:
  - Preferências sem bloqueio administrativo explícito;
  - Opções do sistema somente para admin.
- O botão de permissões dentro de Opções do sistema não salva preferências; ele chama `abrirPainelUsuariosConfig(true, true)`.

## Blocos visuais

São os trechos mais claramente visuais e sem persistência direta:

- `prefSelecionarAba`
- `prefRenderCombos*`
- `prefRenderListaAmbiente`
- `prefAplicarEstiloAmbiente`
- `prefAplicarPreviewAmbiente`
- `prefEnsureAmbienteOverrides`
- `prefRebuildAmbientePreview`
- `prefOdontoEnsurePalette`
- `prefOdontoCloseLists`
- `prefOdontoSyncHeader`
- `prefOdontoRenderList`
- `prefOdontoEnsureDropdown`
- `prefOdontoEnsureColorDropdowns`
- `prefSincronizarUI`
- `sysOptSelecionarAba`
- `sysOptRenderSelects`
- `sysOptSyncUI`
- `sysOptFechar`

Classificação prática:
- `SEGURO`: apenas os geradores de defaults e normalizações puras
- `CAUTELA`: os blocos acima, porque mexem com DOM, classes, texto, preview ou estado visual

## Blocos de estado

Estado relevante encontrado:

- `prefCfg`
- `sysOptCfg`
- `sessaoAtual`
- `usersPanelOverlay`
- `footerMsg`
- `prefCfg.context`
- `prefCfg.targetUser`
- `prefCfg.tabAtual`
- `prefCfg.geralValues`, `prefCfg.modelosValues`, `prefCfg.ambienteValues`, `prefCfg.dadosValues`, `prefCfg.odontogramaValues`
- `sysOptCfg.values`
- `sysOptCfg.options`
- `sysOptCfg.tabAtual`

Pontos de atenção:

- `prefContextoPadrao` e `prefResolverContexto` dependem da sessão global;
- `prefSalvarDados` altera `sessaoAtual.nome` e `sessaoAtual.apelido`;
- `sysOptFechar` não fecha se houver painel de usuários sobreposto;
- `sysOptSalvar` reescreve `values` e pode mudar comportamento do sistema inteiro.

## Blocos de payload/salvamento

### Preferências

- `prefColetarPayload`
- `prefColetarPayloadModelos`
- `prefColetarPayloadAmbiente`
- `prefColetarPayloadDados`
- `prefColetarPayloadOdontograma`
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`

### Opções do sistema

- `sysOptColetarPayload`
- `sysOptCarregar`
- `sysOptSalvar`

Classificação:
- `PROIBIDO NESTA FASE` para qualquer extração, refatoração ou modificação desses blocos

## Dependências externas/API

Dependências confirmadas:

- `requestJson("GET", "/preferences/general", ...)`
- `requestJson("GET", "/preferences/models", ...)`
- `requestJson("GET", "/preferences/environment", ...)`
- `requestJson("GET", "/preferences/user-data", ...)`
- `requestJson("GET", "/preferences/odontogram", ...)`
- `requestJson("PATCH", "/preferences/general", ...)`
- `requestJson("PATCH", "/preferences/models", ...)`
- `requestJson("PATCH", "/preferences/environment", ...)`
- `requestJson("PATCH", "/preferences/user-data", ...)`
- `requestJson("PATCH", "/preferences/odontogram", ...)`
- `requestJson("GET", "/system-options", ...)`
- `requestJson("PATCH", "/system-options", ...)`

Dependências indiretas:

- `window.easyFontAbrir`
- `window.easyFontNormalizeStyleId`
- `procPreencherSelect`
- `abrirPainelUsuariosConfig`

## Possíveis helpers puros futuros

Melhores candidatos para helper puro, sem DOM/API/payload/salvamento:

- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefOdontoNorm`
- `prefOdontoFindByLabel`

Possíveis, mas com cautela:

- `prefAmbienteEstiloDeDialogo`
- `prefContextoPadrao`
- `prefResolverContexto`

## Candidatos para namespace passivo futuro

Existe um candidato claro para uma Subetapa 1 de namespace passivo, limitado a:

- builders de defaults;
- normalizadores textuais;
- funções de conversão sem DOM;
- funções sem API, sem payload e sem persistência.

Esse namespace passivo não deve incluir:
- criação de modal;
- renderização de tabs;
- sincronização de formulário;
- carregamento ou salvamento;
- qualquer regra de permissão;
- qualquer alteração em `sessaoAtual`.

## Itens que NÃO devem ser movidos agora

Não mover nesta fase:

- `prefColetarPayload*`
- `prefCarregarDados`
- `prefSalvar*`
- `prefEnsureUI`
- `prefAbrir`
- `sysOptRenderSelects`
- `sysOptSyncUI`
- `sysOptColetarPayload`
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptFechar`
- `sysOptAbrir`
- qualquer regra de admin/segurança ligada a Opções do sistema
- qualquer trecho que atualize `sessaoAtual`
- qualquer trecho que dependa de `requestJson`

## Riscos

### Visual

- o bloco monta HTML, CSS e preview em runtime;
- mudanças pequenas em classe, estrutura ou ordem de elementos podem quebrar abas, layout e botões;
- o ambiente de pré-visualização de fonte é especialmente sensível.

### Textual / mojibake

- há strings visíveis no bloco com encoding inconsistente em alguns pontos do frontend;
- esta etapa não deve corrigir acentos, labels ou placeholders;
- qualquer limpeza textual futura precisa passar pela blindagem documental antes de tocar no código.

### Payload

- os payloads de Preferências e Opções do sistema são extensos e têm formatos diferentes por aba;
- `prefColetarPayloadDados` e `prefSalvarDados` mexem com dados que refletem na sessão atual;
- `sysOptColetarPayload` agrega configurações amplas do sistema.

### Salvamento

- Preferências grava por abas separadas;
- Opções do sistema grava um conjunto amplo e potencialmente sistêmico;
- um erro de estrutura pode atualizar campos errados ou persistir estado incompleto.

### Backend / API

- o bloco depende de múltiplos endpoints;
- qualquer mudança de contrato exige coordenação com backend antes de qualquer modularização funcional;
- `sysOptCarregar` e `sysOptSalvar` são especialmente sensíveis.

### Permissões

- Opções do sistema exige admin no dispatcher;
- o botão de permissões dentro desse modal abre fluxo protegido de usuários;
- qualquer mudança prematura pode afrouxar ou quebrar controle de acesso.

### Preferências globais do sistema

- `prefSalvarAmbiente` altera aparência global de vários controles;
- `prefSalvarDados` pode afetar identidade exibida em outras telas;
- `sysOptSalvar` altera regras que podem impactar todo o sistema.

### Impacto em outros módulos

- `prefSalvarDados` pode influenciar cabeçalhos, relatórios e identificação de usuário;
- `prefSalvarAmbiente` afeta visual compartilhado;
- `sysOptSalvar` pode alterar comportamento de agenda, auditoria, CPF, CEP, captura de imagem e permissões.

## Roteiro futuro de testes no navegador

Como esta etapa é documental, não houve teste funcional agora. Para uma etapa futura:

- abrir com `Ctrl+F5`;
- abrir `Preferências...`;
- abrir `Opções do sistema...`;
- testar abertura e fechamento do modal;
- trocar abas e observar o preenchimento visual;
- verificar botões principais;
- não salvar nada no primeiro teste, salvo autorização explícita posterior.

## Próxima etapa recomendada

Subetapa 1 de namespace passivo, somente para helper puro e defaults locais, se e somente se a separação puder ocorrer sem tocar em DOM, payload, salvamento, backend ou permissões.

## Confirmação de segurança

Esta Subetapa 0 foi concluída apenas como mapeamento documental. O bloco foi identificado, classificado e delimitado sem alteração funcional.

Classificação inicial:

- `SEGURO`: defaults puros e normalizações locais
- `CAUTELA`: DOM, abas, preview, estado visual e abertura/fechamento de modal
- `PROIBIDO`: payload, salvamento, backend/API, permissões e preferências globais sistêmicas
