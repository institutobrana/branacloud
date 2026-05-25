# Preferencias / Configuracoes comuns - Subetapa 1 - Contrato funcional e fronteiras documentais

## 1. Objetivo
Registrar o contrato funcional inicial de `Preferencias / Configuracoes comuns` e delimitar suas fronteiras antes de qualquer recorte funcional.

## 2. Escopo
Esta subetapa e exclusivamente documental.

Escopo permitido nesta fase:
- leitura de `docs/11_roadmap_desenvolvimento.md`;
- leitura de `docs/fase_2_reavaliacao_pos_agenda_principal_comparacao_modulos.md`;
- leitura de `docs/regras_blindagem_correcoes_textuais_mojibake.md`;
- leitura de `frontend/app.js`;
- leitura de `frontend/index.html`;
- leitura de `frontend/js/modules/preferencias-opcoes-sistema.js`;
- leitura de `frontend/js/modules/`;
- criacao deste documento;
- atualizacao documental do roadmap.

## 3. Confirmacao de classificacao
`Preferencias / Configuracoes comuns` e tratada como modulo `core / comum`.

Nao deve ser classificada como modulo especifico por area profissional.
Nao deve haver controle multiarea, flags multiarea ou separacao de comportamento por area profissional.

## 4. Contexto da decisao pos-Agenda principal
Esta frente foi iniciada depois da reavaliacao documental feita apos a `Agenda principal` atingir a Subetapa 29 e consolidar nove helpers ja validados.

A reavaliacao concluiu que:
- continuar a `Agenda principal` agora tem risco medio-alto, porque os helpers restantes mexem com parse de data, hora e cor;
- `Ficha pessoal` e alto risco por concentrar muito DOM, estado global e CRUD clinico;
- `Conta corrente` e alto risco por envolver financeiro, calculos, lancamentos, exclusao e impressao;
- `Relatorios` ficaram em risco medio-alto;
- `Indices financeiros` ficaram em alto risco;
- `Preferencias / Configuracoes comuns` foi a frente recomendada para continuidade.

## 5. Resumo da reavaliacao que levou a esta frente
A frente recomendada foi escolhida porque combina:
- menor risco comparativo;
- modulo ja existente, ainda que parcial;
- recortes futuros potencialmente mais puros;
- teste manual mais previsivel por abas e contextos;
- menor chance de impacto transacional grave do que outras frentes comparadas.

## 6. Estado atual do modulo existente
Arquivo analisado: `frontend/js/modules/preferencias-opcoes-sistema.js`.

Estado identificado:
- modulo passivo e inicial, nao um modulo funcional completo;
- exposto globalmente em `window.BranaPreferenciasOpcoesSistemaModule`;
- marca `passive: true` e `movedBehavior: false` no metadata;
- exporta apenas quatro pontos:
  - `getMetadata`;
  - `prefOdontoNorm`;
  - `prefValoresPadraoModelos`;
  - `prefOdontoFindByLabel`;
- depende de `PREF_ODONTO_PALETTE`, que esta definido em `frontend/app.js`;
- nao abre tela, nao carrega dados, nao salva estado e nao controla DOM sozinho;
- atua como apoio passivo para o `app.js`;
- e carregado em `frontend/index.html` antes de `frontend/app.js`;
- ha duplicidade parcial de fallback, porque `frontend/app.js` ainda possui implementacoes locais das mesmas funcoes para manter comportamento se o modulo nao estiver disponivel.

Conclusao do estado atual:
- modulo parcial;
- utilitario/passivo;
- ainda nao suficiente para ser considerado completo;
- ja existe como base segura para futura consolidacao, mas nao substitui o bloco central do `app.js`.

## 7. Mapeamento dos blocos relacionados em `frontend/app.js`

### 7.1 Blocos de preferencias do usuario
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefTituloAtual`
- `prefValoresPadrao`
- `prefValoresPadraoModelos`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAtualizarTitulo`
- `prefSelecionarAba`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`
- `prefAmbienteSecoesAtuais`
- `prefAmbienteSecaoAtiva`
- `prefAmbienteEstiloAtual`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`
- `prefAbrirDialogoFonteAmbiente`
- `prefColetarPayload`
- `prefColetarPayloadModelos`
- `prefColetarPayloadAmbiente`
- `prefColetarPayloadDados`
- `prefColetarPayloadOdontograma`
- `prefCarregarDados`
- `prefSalvarGeral`
- `prefSalvarModelos`
- `prefSalvarAmbiente`
- `prefSalvarDados`
- `prefSalvarOdontograma`
- `prefEnsureUI`
- `prefAbrir`

### 7.2 Blocos de opcoes do sistema
- `sysOptSelecionarAba`
- `sysOptRenderSelects`
- `sysOptSyncUI`
- `sysOptColetarPayload`
- `sysOptCarregar`
- `sysOptSalvar`
- `sysOptFechar`
- `sysOptAbrir`
- `sysOptEnsureUI`

### 7.3 Pontos de menu, permissao e entrada
- `MENU_ACTION_MODULE_OVERRIDES`
- `menuActionModule`
- `menuActionAccessLevel`
- `menuEnsurePermission`
- action `config-preferencias`
- action `config-opcoes-sistema`
- `usersAbrirPreferencias`
- `abrirPainelUsuariosConfig(true, true)` a partir das opcoes do sistema

### 7.4 Pontos de dependencia visual e estrutural
- `config-preferencias-backdrop`
- `config-opcoes-sistema-backdrop`
- `ensureModalChrome`
- `ensurePanelChrome`
- `easyFontAbrir`
- `requestJson`
- `protectedGrantCache`
- `usersGrantOverride`
- `sessaoAtual`

## 8. Contrato funcional do modulo
O contrato funcional observado para esta frente e:

- abrir preferencias do usuario a partir do menu global e tambem a partir da janela de usuarios;
- carregar contexto de usuario ou sessao atual;
- organizar a tela em abas de preferencias do usuario;
- carregar, editar e salvar preferencias por aba;
- abrir opcoes do sistema a partir do menu global;
- carregar opcoes da clinica e da plataforma;
- manter o fluxo protegido por permissao `configuracao`;
- respeitar o bloqueio de seguranca quando o controle de usuarios estiver habilitado;
- manter a integracao com o painel de usuarios quando necessario;
- manter o comportamento visual atual do modal/painel;
- preservar o contrato de leitura e escrita dos endpoints ja existentes;
- nao misturar preferencias de usuario com opcoes da clinica sem delimitacao clara.

## 9. Fronteiras do que pertence ao modulo
Pertence a esta frente:

- preferencias gerais do usuario;
- preferencias de modelos padrao;
- preferencias de ambiente/visual da interface;
- preferencias de dados do usuario;
- preferencias do odontograma;
- configuracoes e opcoes de sistema da clinica;
- atalhos de entrada pelo menu e pela janela de usuarios;
- fluxos de leitura e salvamento das preferencias e opcoes ja existentes;
- validacoes de seguranca associadas a `configuracao` e senha administrativa;
- elementos visuais e modais diretamente ligados a essas telas;
- exibicao de avisos e titulos associados a essas configuracoes.

## 10. Fronteiras do que nao pertence ao modulo
Nao pertence a esta frente:

- `Agenda principal`;
- `Agenda de contatos`;
- `Ficha pessoal`;
- `Conta corrente`;
- `Relatorios`;
- `Indices financeiros`;
- qualquer modulo de backend, banco, schema, migrations ou seeds;
- qualquer endpoint novo;
- qualquer permissao nova;
- qualquer comportamento multiarea;
- qualquer correcao textual ou de mojibake;
- qualquer alteracao em regras de negocio de outros modulos;
- qualquer mudanca estrutural em cadastro, financeiro, agenda ou documento fora do contrato desta frente.

## 11. Riscos tecnicos
Riscos identificados:

- DOM grande e centralizado em `frontend/app.js`;
- estado global compartilhado;
- acoplamento com `requestJson`;
- acoplamento com permissao `configuracao`;
- dependencia de fluxo protegido e senha administrativa;
- risco de confundir preferencias do usuario com opcoes da clinica;
- risco de alterar payload sem perceber impacto em outros modulos;
- risco visual em varias abas ao mesmo tempo;
- risco de duplicidade entre fallback do `app.js` e modulo passivo;
- risco de mexer em textos visiveis com mojibake sem autorizacao;
- risco de tocar em `clinica_id`/`user_id` no contexto errado;
- risco de efeito colateral ao salvar ou carregar preferencia em contexto diferente.

## 12. Dependencias encontradas
Dependencias tecnicas e funcionais:

- `frontend/app.js` continua sendo o centro do comportamento;
- `frontend/index.html` carrega o modulo passivo antes do `app.js`;
- `window.BranaPreferenciasOpcoesSistemaModule` serve como exposicao global;
- `PREF_ODONTO_PALETTE` e usado pelo helper passivo de odontograma;
- `requestJson` faz toda a comunicacao com `/preferences/*` e `/system-options`;
- `sessaoAtual` define contexto padrao;
- `ensureModalChrome` e `ensurePanelChrome` estruturam a interface;
- `easyFontAbrir` e usado no dialogo de estilo do ambiente;
- `abrirPainelUsuariosConfig` integra a tela de opcoes do sistema com usuarios;
- `protectedGrantCache` e `usersGrantOverride` participam do acesso protegido.

## 13. Candidatos futuros a helper ou recorte seguro
Nesta subetapa apenas listar candidatos; nao implementar.

Candidatos mais seguros e ainda nao recortados aqui:
- `prefValoresPadrao`
- `prefAmbEstiloPadrao`
- `prefValoresPadraoAmbiente`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteSecoesAtuais`
- `prefAmbienteSecaoAtiva`
- `prefAmbienteEstiloAtual`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`

Observacao:
- os candidatos acima sao apenas sugestoes documentais de helpers puros ou quase puros;
- nenhum foi escolhido para recorte nesta subetapa;
- nenhum foi extraido.

## 14. Recomendacao da proxima subetapa
Proxima subetapa recomendada:

- `Preferencias / Configuracoes comuns - Subetapa 2 - Mapeamento tecnico detalhado por leitura`

Motivo:
- a fronteira funcional ja foi estabelecida;
- agora faz mais sentido detalhar fluxos, fontes de dados, eventos, tabs, payloads e dependencias por trecho;
- isso reduz o risco de qualquer futura extracao e evita misturar leitura com implementacao.

## 15. Itens explicitamente fora do escopo
Fora do escopo desta subetapa:

- alterar `frontend/app.js`;
- alterar `frontend/index.html`;
- alterar qualquer arquivo em `frontend/js/modules`;
- alterar backend;
- alterar banco;
- alterar schema;
- alterar migrations;
- alterar seeds;
- alterar endpoints;
- alterar permissoes;
- reabrir `Agenda de contatos`;
- continuar extracoes da `Agenda principal`;
- corrigir textos visiveis;
- corrigir mojibake;
- implementar helper;
- criar modulo novo;
- aplicar patch funcional;
- implementar multiarea.

## 16. Blindagem textual/mojibake
Regra respeitada integralmente nesta subetapa.

Constatacoes:
- ha textos visiveis com mojibake no codigo lido;
- nenhum texto foi corrigido;
- nenhum acento foi normalizado;
- nenhum label foi renomeado;
- nenhum placeholder foi alterado;
- nenhuma string de interface foi reescrita;
- qualquer texto quebrado permanece como pendencia futura, apenas registrada.

## 17. Registro para roadmap
- A frente `Preferencias / Configuracoes comuns` foi iniciada documentalmente.
- Ela foi classificada como `core / comum`.
- A escolha veio da reavaliacao pos-`Agenda principal`.
- A `Agenda principal` fica temporariamente pausada apos as extraicoes ja validadas.
- A `Agenda de contatos` permanece pausada/consolidada.
- Nenhum codigo foi alterado.
- Nenhum arquivo de frontend, backend, banco, endpoints, seeds ou permissao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- A proxima subetapa recomendada e o mapeamento tecnico detalhado por leitura.

## 18. Commit seletivo obrigatorio
Arquivos autorizados para commit desta etapa:
- `docs/fase_2_preferencias_configuracoes_subetapa_1_contrato_funcional_fronteiras.md`
- `docs/11_roadmap_desenvolvimento.md`

Mensagem sugerida:
`Documenta contrato de preferencias e configuracoes`
