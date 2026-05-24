# Preferencias e Opcoes do Sistema - Subetapa 0 - Diagnostico de helpers, defaults e fronteiras

## 1. Objetivo da Subetapa 0

Mapear, de forma somente documental e conservadora, o estado atual do modulo Preferencias e Opcoes do Sistema, identificando helpers puros, defaults/configuracoes, fronteiras proibidas e riscos antes de qualquer nova extracao.

## 2. Estado atual apos o commit `46a90e0`

O commit `46a90e0` consolidou a decisao documental de escolher outro modulo mais seguro apos as pausas de Usuarios/Admin e Simbolos Graficos.

Estado resumido:

- Usuarios/Admin continua pausado;
- Simbolos Graficos continua pausado;
- Preferencias e Opcoes do Sistema foi escolhido como proximo modulo recomendado;
- a nova rodada deve iniciar com Subetapa 0 documental, sem alterar codigo;
- o modulo ja possui trilha propria, helpers delegados e um arquivo modular passivo.

## 3. Confirmacao de que Usuarios/Admin e Simbolos Graficos estao pausados

Confirmado.

- Usuarios/Admin foi pausado porque `usersRenderAdvanced()` foi classificado como risco medio.
- Simbolos Graficos foi pausado porque `validarTipoMarcaSimbolo(valor)` ja estava extraido em `frontend/js/modules/simbolos-graficos.js`, e uma integracao real aumentaria o risco.

## 4. Documentos anteriores encontrados sobre Preferencias e Opcoes do Sistema

Documentos lidos e considerados nesta avaliacao:

- `docs/recomendacao_proximo_modulo_pos_pausa_usuarios_admin_simbolos.md`
- `docs/recomendacao_proximo_modulo_pos_pausa_usuarios_admin.md`
- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`
- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md`
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md`
- `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md`
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md`
- `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md`
- `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md`
- `docs/preferencias_opcoes_sistema_subetapa_8_reavaliacao_continuidade.md`
- `docs/preferencias_opcoes_sistema_subetapa_9_fechamento_reavaliacao_modulo.md`

Documentos gerais obrigatorios tambem lidos:

- `README.md`
- `README_WEB.md`
- `backend/README.md`
- `docs/00_master_guide.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 5. Arquivos tecnicos relacionados encontrados

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/js/modules/`

## 6. Arquivo modular existente

Sim, ja existe arquivo modular relacionado ao modulo:

- `frontend/js/modules/preferencias-opcoes-sistema.js`

O modulo esta carregado antes de `frontend/app.js` no `frontend/index.html`.

## 7. Funcoes e trechos encontrados em frontend/app.js

O bloco de Preferencias e Opcoes do Sistema continua concentrado em duas faixas principais:

- `pref*` aproximadamente entre as linhas `2242` e `2865`;
- `sysOpt*` aproximadamente entre as linhas `2867` e `3111`.

Trechos/funcionalidades ainda concentrados em `frontend/app.js`:

- contexto e titulo do modal: `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefTituloAtual`;
- defaults: `prefValoresPadrao`, `prefValoresPadraoModelos`, `prefAmbEstiloPadrao`, `prefValoresPadraoAmbiente`, `prefValoresPadraoDados`, `prefValoresPadraoOdontograma`;
- UI/preview: `prefAtualizarTitulo`, `prefSelecionarAba`, `prefRenderCombos*`, `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva`, `prefAmbienteEstiloAtual`, `prefAmbienteTextoExemplo`, `prefAmbienteDialogoValor`, `prefAmbienteEstiloDeDialogo`, `prefAbrirDialogoFonteAmbiente`, `prefRenderListaAmbiente`, `prefAplicarEstiloAmbiente`, `prefAplicarPreviewAmbiente`, `prefEnsureAmbienteOverrides`, `prefRebuildAmbientePreview`, `prefRenderCombosOdontograma`, `prefSincronizarUI`;
- odontograma/busca: `prefOdontoNorm`, `prefOdontoFindByLabel`, `prefOdontoEnsurePalette`, `prefOdontoCloseLists`, `prefOdontoSyncHeader`, `prefOdontoRenderList`, `prefOdontoEnsureDropdown`, `prefOdontoEnsureColorDropdowns`;
- payload e persistencia: `prefColetarPayload*`, `prefCarregarDados`, `prefSalvarGeral`, `prefSalvarModelos`, `prefSalvarAmbiente`, `prefSalvarDados`, `prefSalvarOdontograma`;
- abertura e montagem da tela: `prefEnsureUI`, `prefAbrir`;
- bloco de sistema: `sysOptSelecionarAba`, `sysOptRenderSelects`, `sysOptSyncUI`, `sysOptColetarPayload`, `sysOptCarregar`, `sysOptSalvar`, `sysOptFechar`, `sysOptAbrir`, `sysOptEnsureUI`;
- gatilhos externos: `usersAbrirPreferencias()` e o dispatcher de `config-preferencias` / `config-opcoes-sistema`.

## 8. Trechos relevantes encontrados em frontend/index.html

Trechos relacionados ao modulo no HTML:

- `frontend/index.html:2650-2651`
  - menu com `Preferências...`
  - menu com `Opções do sistema...`
- `frontend/index.html:3207`
  - botao `Preferências...` dentro do painel de usuarios
- `frontend/index.html:3933`
  - carregamento de `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/index.html:3936`
  - carregamento de `frontend/easy_font_dialog.js`, relevante porque o bloco de Preferencias chama o dialogo de fonte ambiente

## 9. Helpers puros candidatos

### Helpers ja extraidos no modulo passivo

- `prefOdontoNorm`
- `prefValoresPadraoModelos`
- `prefOdontoFindByLabel`

### Helpers puros candidatos remanescentes no `app.js`

| Helper | Risco | Observacao |
|---|---|---|
| `prefValoresPadrao` | medio | E puro, mas carrega defaults gerais e texto interno sensivel ao comportamento global. |
| `prefValoresPadraoDados` | medio | E puro, porem modela dados do usuario e tem maior carga semantica. |
| `prefAmbEstiloPadrao` | medio | E puro, mas define estilo visual global. |
| `prefValoresPadraoAmbiente` | medio/alto | E puro, porem agrupa estilos por secao e influencia visual. |
| `prefValoresPadraoOdontograma` | medio/alto | E puro, mas envolve cores/flags do odontograma e tem impacto visual. |
| `prefContextoPadrao` | alto | E computacional, mas depende de `sessaoAtual`. |
| `prefResolverContexto` | alto | E computacional, mas depende de contexto de usuario/sessao. |
| `prefContextoAtual` | alto | E um fallback de estado global. |
| `prefTituloAtual` | alto | Ainda produz texto visivel da janela. |

## 10. Defaults/configuracoes candidatos

Os defaults/configuracoes que ainda parecem candidatos documentais para futura avaliacao sao:

- `prefValoresPadrao`
- `prefValoresPadraoDados`
- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoOdontograma`

Observacao:

- `prefValoresPadraoModelos` ja foi extraido;
- `prefOdontoNorm` e `prefOdontoFindByLabel` ja foram extraidos;
- os defaults remanescentes ainda sao puros, mas nao sao equivalentes em risco.

## 11. Fronteiras proibidas

Ficam explicitamente fora de qualquer proxima subetapa funcional:

- `prefColetarPayload*`;
- `prefCarregarDados`;
- `prefSalvar*`;
- `prefEnsureUI`;
- `prefAbrir`;
- `sysOptColetarPayload`;
- `sysOptCarregar`;
- `sysOptSalvar`;
- `sysOptAbrir`;
- `sysOptEnsureUI`;
- qualquer regra de permissao ou admin ligada a Opcoes do Sistema;
- qualquer alteracao em `sessaoAtual`;
- qualquer dependencia de backend, banco, seeds ou dados persistidos;
- qualquer alteracao em payload;
- qualquer alteracao em salvamento;
- qualquer alteracao em login ou senha interna;
- qualquer mexida em textos visiveis, labels, placeholders, mensagens ou mojibake.

## 12. Riscos identificados

### Risco visual

- o bloco monta abas, combos, preview e dialogos em runtime;
- defaults de ambiente e odontograma alteram a aparencia do sistema;
- a abertura de dialogo de fonte ambiente depende de integracao externa.

### Risco de estado

- `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual` e `prefTituloAtual` dependem de contexto da sessao;
- `prefSalvarDados` altera `sessaoAtual`;
- `sysOpt` escreve em configuracoes de sistema que podem afetar comportamento global.

### Risco de payload e persistencia

- `prefColetarPayload*` e `sysOptColetarPayload` agregam contratos de envio;
- `prefSalvar*` e `sysOptSalvar` acoplam o bloco a persistencia;
- `prefCarregarDados` e `sysOptCarregar` dependem de endpoints.

### Risco textual / mojibake

- ha strings visiveis com mojibake ou texto legado no bloco;
- esta etapa nao deve corrigir textos, acentos ou placeholders;
- qualquer string estranha deve ser apenas registrada como nao alterada por blindagem textual.

### Risco de permissao

- `sysOptAbrir` e o dispatcher de `config-opcoes-sistema` exigem fluxo admin;
- qualquer mudanca prematura pode afetar controle de acesso.

## 13. Classificacao de risco dos candidatos

| Candidato | Risco | Classificacao |
|---|---|---|
| `prefValoresPadrao` | medio | candidato possivel, mas nao o mais seguro |
| `prefValoresPadraoDados` | medio | candidato possivel, mas requer cautela |
| `prefAmbEstiloPadrao` | medio | candidato possivel, mas com cautela |
| `prefValoresPadraoAmbiente` | medio/alto | cautela |
| `prefValoresPadraoOdontograma` | medio/alto | cautela |
| `prefContextoPadrao` | alto | nao recomendado agora |
| `prefResolverContexto` | alto | nao recomendado agora |
| `prefContextoAtual` | alto | nao recomendado agora |
| `prefTituloAtual` | alto | proibido por enquanto |
| `prefOdontoFindByLabel` | baixo/medio | ja foi extraido; nao e candidato novo nesta rodada |

## 14. Proxima subetapa recomendada

Recomendacao conservadora: **pausar o modulo nesta rodada e nao iniciar nova extracao agora**.

Motivo:

- os helpers puros menores e mais seguros ja foram delegados em etapas anteriores;
- os remanescentes tem maior carga semantica, visual ou de contexto;
- payload, salvamento, backend, permissao e texto visivel continuam em zona proibida;
- nao ha, neste momento, um recorte novo que traga o mesmo nivel de seguranca dos helpers ja extraidos.

## 15. O que deve ficar fora da proxima subetapa

Ficam fora:

- payload;
- salvamento;
- backend;
- permissao/admin;
- `sessaoAtual`;
- DOM de abertura/fechamento;
- `prefEnsureUI`;
- `prefAbrir`;
- `sysOpt*`;
- qualquer mudanca em `frontend/index.html`;
- qualquer mudanca em textos visiveis, labels, placeholders, mensagens ou mojibake.

## 16. O que deve entrar em commit depois desta etapa documental

Se esta etapa documental for versionada, o commit deve conter apenas:

- este documento;
- sem alterar `frontend/app.js`;
- sem alterar `frontend/index.html`;
- sem alterar `frontend/js/modules/preferencias-opcoes-sistema.js`;
- sem incluir backend, banco, seeds ou roadmap.

## 17. O que deve entrar no roadmap se houver futura extracao real

Se houver futura extracao real de um helper puro deste modulo, o roadmap deve registrar:

- qual helper foi movido;
- que o helper era puro;
- que o recorte nao tocou payload, salvamento, backend ou permissao;
- onde validar manualmente depois da alteracao.

## 18. Onde testar depois de uma futura alteracao

Depois de qualquer alteracao futura neste modulo, testar:

1. Abrir `Preferencias...`.
2. Conferir a aba `Modelos`.
3. Conferir a aba `Ambiente`.
4. Conferir a aba `Dados`.
5. Conferir a aba `Odontograma`.
6. Abrir `Opcoes do sistema...`.
7. Trocar abas sem salvar.
8. Fechar e reabrir os modais.
9. Verificar console sem erros novos.

## 19. Blindagem textual e mojibake

A blindagem textual foi respeitada.

- nenhum texto visivel foi corrigido;
- nenhum acento foi reescrito;
- nenhum placeholder foi alterado;
- qualquer mojibake observado foi mantido sem alteracao.

## 20. Confirmacoes finais

- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- Backend, banco e seeds nao foram alterados.
- `docs/11_roadmap_desenvolvimento.md` nao foi alterado.
- Usuarios/Admin continua pausado.
- Simbolos Graficos continua pausado.
- `Preferencias e Opcoes do Sistema` nao foi iniciado funcionalmente nesta etapa.
