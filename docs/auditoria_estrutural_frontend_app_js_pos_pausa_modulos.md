# Auditoria estrutural do frontend/app.js apos a pausa das trilhas de modulos

## 1. Objetivo da auditoria estrutural
Mapear o `frontend/app.js` por blocos tecnicos, e nao por modulo/tela, para verificar se ainda existe algum recorte pequeno, seguro e independente que possa ser extraido no futuro sem entrar em regra funcional sensivel.

## 2. Motivo da mudanca de estrategia
As auditorias por modulo/tela nao encontraram um candidato novo claramente baixo risco. Os ultimos casos mostraram que nomes aparentemente seguros ja estavam iniciados, ja estavam avancados ou ja haviam esgotado o proximo recorte seguro. Por isso, a leitura agora precisa ser estrutural e nao orientada por tela.

## 3. Estado atual apos o commit `95867f1`

- `95867f1 -- Documenta auditoria ampliada dos modulos frontend`
- nao ha tracked modificados;
- nenhum codigo foi alterado nesta rodada;
- `frontend/app.js`, `frontend/index.html` e `frontend/js/modules/` seguem intactos;
- backend, banco, seeds e roadmap seguem intactos;
- textos visiveis e mojibake foram preservados;
- nao ha modulo/tela novo claramente seguro para iniciar diretamente.

## 4. Confirmacao de que nao sera iniciado modulo diretamente
Esta etapa nao inicia modulo, nao extrai helper e nao altera arquivo JS. O foco e apenas registrar a leitura estrutural do `frontend/app.js` para apoiar uma decisao mais conservadora depois.

## 5. Mapa estrutural geral do frontend/app.js
O arquivo e claramente monolitico e mistura camadas diferentes:

1. bootstrap, login, sessao, token e bloqueio da aplicacao;
2. utilitarios globais e normalizacao textual/mojibake;
3. infraestrutura visual comum de paines, modais, draggables e chrome;
4. blocos de cadastro e tela por dominio;
5. blocos de relatorio, financeiro, agenda, paciente e editor;
6. blocos de configuracao, permissao, superadmin e licenca;
7. wrappers e remanescentes que ainda convivem com modulos ja extraidos.

## 6. Principais blocos tecnicos identificados

### 6.1. Bootstrap, auth e sessao
Bloco inicial com `setLoginStatus`, `showPanel`, `setToken`, `bootstrapOauthFromUrl`, validacoes de login, persistencia de token, bloqueio por licenca/sessao, `hardResetSessionState`, `blockAppAndShowLogin`, `parseSessionIssue`, `enforceSessionIssue`, `startSessionHeartbeat` e `stopSessionHeartbeat`.

Risco: alto. Motivo: login, sessao, licenca, permissao e estado global da aplicacao.

### 6.2. Normalizacao textual e mojibake
Bloco com `canNormalizeMojibake`, `normalizeSessionText`, `fixMojibakeText`, `normalizeMojibakeDom`, `normalizeMojibakeValueDeep`, `initMojibakeAutoFix`.

Risco: medio. Motivo: e tecnico e puro em parte, mas atua globalmente em DOM e texto visivel.

### 6.3. Infraestrutura visual comum
Funcoes como `showScenarioPanel`, `showMateriaisPanel`, `usersAttachOverlay`, `usersDetachOverlay`, `showUsersPanel`, `showSuperAdminPanel`, `closeWorkspacePanel`, `ensureChromeDraggable`, `bindStandardGridActivation`, `ensurePanelChrome`, `ensureModalChrome`, `syncPanelCloseButtons`, `syncModalHeaders`.

Risco: medio/alto. Motivo: e infraestrutura compartilhada e afeta varios fluxos e modais.

### 6.4. Utilitarios numericos e de escape
`toFloat`, `formatNum`, `formatMoney`, `formatScenarioNum`, `esc`, `formatDec2`, `formatDec2Dot`, `parseMaterialNumber`, `formatDec2` e helpers analogos.

Risco: baixo isoladamente, mas medio como bloco. Motivo: sao puros, porem sao cross-cutting e usados por muitas telas e blocos.

### 6.5. Material / Procedimentos
Blocos com `materiais*`, `proc*`, `procRelatorio*`, `procVincula*`, `procReajuste*`, `procNormalizarFormaCobranca`, `procCorrigirRotulosEditor`, `procAplicarDadosEditor`, `procSalvar`, `procAbrirEditor`.

Risco: alto. Motivo: payload, salvar, vinculos, reajuste, relatorios, selecao e dependencias de dados.

### 6.6. Preferencias / Opcoes do Sistema
Blocos com `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefTituloAtual`, `prefValoresPadrao*`, `prefAmb*`, `prefColetarPayload*`, `prefEnsureUI`.

Risco: medio/alto a alto. Motivo: os helpers seguros ja sairam e os remanescentes tocam contexto, payload e UI sensivel.

### 6.7. Opcoes do sistema
Bloco com `sysOptSelecionarAba`, `sysOptRenderSelects`, `sysOptSyncUI`, `sysOptColetarPayload`, `sysOptFechar`, `sysOptEnsureUI`.

Risco: alto. Motivo: configuracao sensivel, interface e payload.

### 6.8. Etquetas, convenios, plano, prestadores, unidades, CID, simbolos, anamnese e medicamentos
Ha blocos ja bem delineados para:

- `etq*`
- `convPlan*`
- `plano*`
- `prest*`
- `unidade*`
- `cid*`
- `simbolos*`
- `anamnese*`
- `medicamentos*`
- `aux*`
- `pgen*`
- `cc*`
- `fcx*`
- `dash*`
- `agenda*`
- `editorTextos*`
- `prot*`
- `ctrlProt*`
- `sa*`
- `users*`
- `ficha*`

Risco: em geral medio, medio/alto ou alto, dependendo da superficie. O ponto comum e que quase todos ja estao em area funcional madura, sensivel ou muito acoplada.

## 7. Candidatos a helpers puros, se houver
Existem helpers tecnicamente puros em `frontend/app.js`, principalmente no bloco utilitario inicial:

- `toFloat`
- `formatNum`
- `formatMoney`
- `formatScenarioNum`
- `esc`
- `formatDec2`
- `formatDec2Dot`
- `parseMaterialNumber`
- `canNormalizeMojibake`
- `normalizeSessionText`
- `fixMojibakeText`
- `normalizeMojibakeDom`
- `normalizeMojibakeValueDeep`

Tambem existem helpers textuais e formatadores em blocos de dominio, mas a maior parte deles ja esta misturada com contexto de tela ou fluxos de dados.

### Classificacao

- risco tecnico intrinseco: baixo;
- risco de extracao agora: medio.

Motivo: mesmo quando o helper e puro, ele faz parte de um bloco cross-cutting e tocaria varios pontos do sistema. Nesta rodada, isso nao fecha como recorte pequeno e independente o suficiente.

## 8. Candidatos descartados e motivo

- `prefColetarPayload*`, `sysOptColetarPayload`, `procSalvar`, `procAbrirEditor`, `usersPermBuildPayload`, `usersPermFlushAutoSave`, `agendaLegadoModalPayload`, `fichaPayloadAtual`, `ccSalvarModal`, `protExecutarRelatorio`, `editorTextosConteudoParaSalvar`

Motivo: payload, salvamento, persistencia, selecao de dados e integracao com backend.

- `usersRenderAdvanced`, `usersPerm*`, `usersPass*`, `protectedPass*`

Motivo: permissao, senha interna, fluxo protegido e risco de bloquear o sistema.

- `agenda*`, `ficha*`, `editorTextos*`, `cc*`, `fcx*`, `dash*`, `prot*`, `ctrlProt*`, `sa*`, `lic*`

Motivo: agenda, paciente, editor visual, financeiro, relatorio, painel administrativo e licenca.

- `simbolos*` e `pref*`

Motivo: ja foram pausados por historico documental e porque o recorte seguro ja se esgotou.

## 9. Blocos sensiveis que devem ficar fora

- payload;
- salvar;
- excluir;
- carregar dados;
- permissao;
- login;
- senha interna;
- sessao;
- backend;
- banco;
- seeds;
- financeiro;
- anamnese;
- agenda;
- paciente;
- editor visual;
- iframe;
- postMessage;
- relatorios.

## 10. Classificacao de risco dos candidatos

| Candidato | Tipo | Risco |
|---|---|---|
| `formatNum`, `formatMoney`, `formatScenarioNum`, `esc` | utilitarios puros | baixo tecnico, medio para extracao agora |
| `formatDec2`, `formatDec2Dot`, `parseMaterialNumber` | utilitarios puros | baixo tecnico, medio para extracao agora |
| `canNormalizeMojibake`, `normalizeSessionText`, `fixMojibakeText` | utilitarios globais | medio |
| `normalizeMojibakeDom`, `normalizeMojibakeValueDeep` | utilitarios globais com DOM | medio |
| demais helpers de dominios ja iniciados | mistos com tela/estado | medio/alto a alto |

## 11. Proximo recorte recomendado
Nao ha, nesta rodada, um recorte pequeno, seguro e independente que mereca extracao imediata.

## 12. Se nao houver recorte baixo risco
A recomendacao e **pausa** da modularizacao tecnica do `frontend/app.js` nesta trilha. Se a evolucao continuar, o proximo passo deve ser uma nova estrategia documental, nao uma extracao direta.

## 13. O que deve entrar em commit depois desta etapa documental
Se esta etapa for versionada, o commit deve conter apenas este documento documental.

## 14. O que deve entrar no roadmap se houver futura extracao real

- o bloco tecnico exato a ser extraido;
- o motivo de ser puro;
- os pontos que ficaram fora;
- os arquivos/camadas impactados;
- o teste manual minimo apos a futura extracao;
- e a confirmacao explicita de que nao houve toque em payload, salvamento, permissao, backend, banco ou seeds.

## 15. Onde testar depois de uma futura alteracao de codigo

- abrir o bloco/tela correspondente;
- confirmar que o layout continua igual;
- verificar console;
- revisar interacoes basicas;
- e checar dois ou mais consumidores se um helper global for movido.

## 16. Conclusao
O `frontend/app.js` possui varios helpers puros, mas eles estao presos a um monolito de alto acoplamento. Nesta auditoria estrutural nao apareceu um recorte novo que fosse suficientemente baixo risco para iniciar agora. A decisao mais segura e pausar a modularizacao tecnica e retomar apenas depois de uma nova estrategia documental.
