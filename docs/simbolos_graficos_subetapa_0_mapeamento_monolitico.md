# Símbolos Gráficos — Subetapa 0 — Mapeamento monolítico

## 1. Escopo da etapa
Esta etapa é somente documental. Nenhum código funcional foi alterado, nenhum fluxo foi movido e nenhuma correção textual, estrutural ou comportamental foi aplicada.

## 2. Diretório analisado
O trabalho foi feito exclusivamente em `D:\BRANA ARQUIVOS\BRANA CLOUD`.

`D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO` foi considerado apenas como legado de pesquisa, em leitura, sem criação, edição, salvamento, documentação ou cópia de qualquer artefato dentro dele.

## 3. Documentações anteriores encontradas sobre Símbolos Gráficos
Foram encontradas e consideradas as seguintes documentações:

- `docs/frontend_auditoria_appjs.md` - auditoria técnica ampla do `frontend/app.js`; descreve o bloco de Símbolos Gráficos, editor estilo Paint, `iframe`, `postMessage`, `message` e o risco específico da “tela preta”.
- `docs/auditoria_console_pos_reversao_erros_reais.md` - auditoria do console após reversão; registra que Símbolos Gráficos era carregado pelo `app.js` monolítico e que o módulo passivo em `frontend/js/modules/simbolos-graficos.js` não estava ativo no HTML naquele momento.
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md` - recomenda Símbolos Gráficos como próximo módulo, mas com cautela por conter editor embutido, biblioteca visual e ponte visual mais sensível.
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md` - trata Símbolos Gráficos como primeira opção, destacando `requestJson`, editor externo e `postMessage`.
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md` - avalia Símbolos Gráficos como candidato mais arriscado por causa de `window.postMessage`, `iframe` e editor visual.
- `docs/recomendacao_proximo_modulo_pos_prestadores.md` - reforça que o módulo envolve painel, grade, modal, biblioteca visual e possível integração com editor isolado.
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md` - classifica Símbolos Gráficos como terceira opção e lembra o risco elevado do editor e da imagem/preview.
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md` - menciona Símbolos Gráficos como módulo maior, com canvas/desenho e risco superior a alternativas menores.
- `docs/05_banco_dados.md` - registra `simbolo_grafico_catalogo` como tabela crítica e aponta colunas críticas de apoio.
- `docs/03_mapa_codigo.md` - mapeia `cadastros_routes.py` como rota principal que inclui símbolos.
- `docs/11_roadmap_desenvolvimento.md` - confirma que símbolos gráficos existem em `cadastros_routes.py` e entram no roadmap de evolução do sistema.
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md` - referência indireta importante porque o ciclo encerrado ainda manda abrir Símbolos Gráficos para confirmar o botão global `X`.
- `docs/regras_blindagem_correcoes_textuais_mojibake.md` - regra obrigatória de blindagem para evitar que uma correção textual vire alteração estrutural em áreas protegidas.

Pontos sensíveis já registrados nessas fontes:
- editor visual embarcado;
- `iframe`;
- `postMessage` e listener global de `message`;
- risco de “tela preta” ao abrir o editor;
- modal próprio;
- biblioteca visual;
- risco de regressão em clique, duplo clique e `bindStandardGridActivation`;
- dependência de imagem/preview;
- dependência com Procedimentos e Procedimentos Genéricos.

## 4. Localização geral no frontend/app.js
O módulo está espalhado em mais de um bloco, não concentrado em um único trecho curto.

Regiões aproximadas encontradas:
- estado global compartilhado no topo do arquivo, por volta da linha `98`, com `simbolosCfg`, `simbolosCache`, `simbolosBibliotecaCache`, `simbolosSelId` e `simbolosEspecialidadesMap`;
- bloco de UI/listagem inicial entre aproximadamente `11079` e `11243`;
- bloco mais rico de apoio, edição, preview, biblioteca, exclusão e editor entre aproximadamente `23513` e `23937`;
- exportação global no fim, por volta de `25016` e `25017`.

Conclusões do mapeamento:
- o código está parcialmente concentrado em dois grandes blocos, mas não é um bloco único limpo;
- há trechos legados ainda presentes;
- há redefs/reassignments de funções importantes, especialmente `simbolosAbrirModal` e `simbolosVincularEventos`;
- a versão mais tardia das funções é a que prevalece no carregamento do arquivo;
- o módulo depende de estado compartilhado e de helpers do shell comum do `app.js`.

## 5. Função principal de abertura
A função principal de abertura é `simbolosAbrir()`.

Localização aproximada:
- `frontend/app.js`, por volta de `11232` a `11243`.

O que ela faz:
- chama `simbolosEnsureUI()`;
- chama `simbolosVincularEventos()`;
- esconde os demais painéis com `hideAllPanels()`;
- mostra o painel de Símbolos Gráficos;
- carrega especialidades com `simbolosCarregarEspecialidades()`;
- preenche o combo de especialidades com `simbolosPreencherEspecialidades()`;
- preenche formas com `simbolosPreencherFormas()`;
- carrega a lista com `simbolosCarregar()`;
- atualiza o `footerMsg` com mensagem de abertura.

Estados usados:
- `simbolosCfg`;
- `workspaceEmpty`;
- `footerMsg`.

Containers DOM montados ou acionados:
- o painel principal `simbolos-panel`;
- a grade `simbolos-tbody`;
- o modal `simbolos-modal-backdrop`;
- o editor `simbolos-editor-backdrop`.

Dependências:
- `hideAllPanels()`;
- `simbolosEnsureUI()`;
- `simbolosVincularEventos()`;
- `simbolosCarregarEspecialidades()`;
- `simbolosPreencherEspecialidades()`;
- `simbolosPreencherFormas()`;
- `simbolosCarregar()`.

Ela carrega lista automaticamente: sim.
Ela abre modal/editor automaticamente: não diretamente; abre o painel e prepara o fluxo para lista, modal e editor.

## 6. Funções de criação de UI
Funções e responsabilidades principais:

- `simbolosEnsureUI()` - cria/inicializa o objeto `simbolosCfg`, injeta CSS do módulo e resolve os contratos DOM do painel, modal, biblioteca, mensagem e editor; risco alto se movida cedo porque é o ponto que amarra o chrome visual do módulo.
- `simbolosPreencherFormas()` - popula o select de forma/tipo de marca com opções fixas; depende de `SIMBOLOS_TIPO_MARCA_OPCOES`; risco baixo, mas ainda é parte do contrato do modal.
- `simbolosEspecialidadePadrao()` - define a especialidade padrão do modal com base nas opções disponíveis; depende do select de especialidade; risco baixo/medio por depender de DOM.
- `simbolosSetModalForma()` - ajusta o valor do select de forma; depende do modal; risco baixo.
- `simbolosTipoMarcaSelecionado()` - lê o valor selecionado no modal; depende do DOM do modal; risco baixo.
- `simbolosAbrirModal(modo)` - prepara o modal para novo ou edição, limpa imagem editada, fecha editor, preenche campos e atualiza preview; risco alto porque mistura estado, modal, preview e integração com editor.
- `simbolosFecharModal()` - esconde o modal e, se existir, fecha o editor; risco alto se movida cedo porque controla encerramento visual.
- `simbolosFecharEditor()` - esconde o editor e zera o `src` para `about:blank`; risco alto por ser parte da proteção contra tela preta/estado preso.
- `simbolosAbrirEditor(url)` - carrega o `iframe` do editor e exibe o backdrop; risco muito alto por depender de ponte visual e mensageria.
- `simbolosAplicarModoModal(item)` - habilita/desabilita campos, biblioteca e botões conforme símbolo de sistema ou usuário; risco alto por tocar contrato visual e estado de edição.
- `simbolosSelecionarBiblioteca(id)` - aplica seleção da biblioteca, ajusta refId/código, imagem e preview; risco alto porque altera estado visual e edição ao mesmo tempo.
- `simbolosAtualizarSelecaoBiblioteca(ref)` - sincroniza marcação visual da biblioteca; risco alto porque depende de DOM e seleção vigente.
- `simbolosAtualizarPreview(codigo)` - atualiza a área `.simbolos-canvas` com imagem editada ou imagem base; risco alto por ser o coração do preview visual.
- `simbolosDialogPergunta(texto)` e `simbolosDialogInfo(texto)` - abrem o diálogo visual de confirmação/aviso; risco alto por compartilhar backdrop e resolver de promessa.

## 7. Funções de carregamento/listagem
Como os dados são carregados:
- `simbolosCarregarEspecialidades()` usa `requestJson` para buscar especialidades em `/cadastros/auxiliares?tipo=Especialidade`;
- `simbolosCarregar()` usa `requestJson` para buscar o catálogo principal e a biblioteca; se necessário, cai em rota alternativa `scope=amplo`;
- a biblioteca pode cair em lista oficial local quando a API não devolve dados.

Quando são carregados:
- na abertura do módulo (`simbolosAbrir()`);
- após salvar;
- após excluir;
- após remover do cache;
- após operações de editor que alteram o item.

Uso de `requestJson`:
- sim, é a forma dominante no módulo.

Uso de `fetch`:
- não identifiquei `fetch` direto no bloco de Símbolos Gráficos; a leitura aponta uso de `requestJson` como wrapper.

Endpoints observados:
- `GET /cadastros/simbolos-graficos`;
- `GET /cadastros/simbolos-graficos?scope=biblioteca`;
- `GET /cadastros/simbolos-graficos?scope=amplo`;
- `GET /cadastros/simbolos-graficos?scope=procedimentos`;
- `GET /cadastros/simbolos-graficos?scope=genericos`;
- `GET /cadastros/auxiliares?tipo=Especialidade`.

Cache local:
- sim, existe `simbolosCache`, `simbolosBibliotecaCache` e `simbolosEspecialidadesMap`.

Tratamento de erro:
- há fallback de biblioteca;
- há mensagens de alerta e confirmação;
- há `requestJson` com validação de `res.ok`.

Recarregamento após salvar/excluir/inativar:
- salva/exclui recarregam a lista;
- não identifiquei fluxo de inativar/ativar para esse módulo, apenas exclusão e preservação de símbolos de sistema.

## 8. Funções de renderização
Funções mapeadas:

- `simbolosRender()` - renderiza a grade principal com descrição e especialidade; entrada: `simbolosCache`; saída: `tbody` preenchido e total atualizado; DOM afetado: `simbolos-tbody` e `simbolos-total`; risco alto se movida porque está acoplada à seleção e ao cache.
- `simbolosRenderBiblioteca()` - renderiza a biblioteca de símbolos com botões/imagens; entrada: `simbolosBibliotecaCache`; saída: biblioteca atualizada; DOM afetado: `simbolos-biblioteca`; risco alto por depender do preview e da seleção.
- `simbolosSelecionarLinha(tr)` - sincroniza seleção visual na grade; entrada: `tr`; saída: `simbolosSelId` e classes `selected`; DOM afetado: `tbody`; risco alto por amarrar seleção ao rerender.
- `simbolosAtualizarPreview(codigo)` - atualiza área visual do desenho/preview; entrada: código atual; saída: imagem renderizada ou limpa; DOM afetado: `.simbolos-canvas`; risco alto por ser a superfície visual mais sensível.
- `simbolosAtualizarSelecaoBiblioteca(ref)` - atualiza destaque da biblioteca; entrada: id ou código; saída: botão marcado; DOM afetado: botões `data-id`; risco alto porque depende do estado da seleção vigente.
- `simbolosRemoverDoCache(id)` - remove item dos caches e força rerender; entrada: id; saída: listas atualizadas; DOM afetado: grade e biblioteca; risco alto se movida por seu efeito colateral.

Não encontrei uma renderização nativa de `<canvas>` via API do browser no `app.js`; o que existe é uma área visual `.simbolos-canvas` usada como preview.

## 9. Seleção e ativação de linha
O comportamento sensível encontrado foi este:

- a seleção ativa da grade hoje é delegada a `bindStandardGridActivation(simbolosCfg.tbody, ...)` no bloco tardio do módulo;
- o botão `Alterar` chama o modal de edição quando existe seleção;
- o botão `Excluir` remove o símbolo selecionado;
- não identifiquei um handler manual explícito de `dblclick` no bloco ativo de Símbolos Gráficos;
- não identifiquei uma heurística local própria de “segundo clique rápido” dentro do bloco ativo; esse comportamento fica encapsulado pelo helper de grid;
- existe um bloco legado mais antigo, hoje sobrescrito por declarações mais tardias, que usava apenas `click` simples na tabela e alertas de planejamento;
- isso significa que há histórico de manutenção dupla no mesmo módulo, e qualquer mudança na ativação de linha deve ser tratada como risco alto.

Pontos sensíveis já conhecidos em correções anteriores:
- `bindStandardGridActivation` é um contrato compartilhado e não deve ser movido cedo;
- `click`, `duplo clique` e `segundo clique rápido` são áreas recorrentes de regressão em módulos conservadores;
- o módulo de Símbolos Gráficos já foi classificado como mais sensível do que módulos simples justamente por combinar grade, modal e editor embarcado.

## 10. Funções de modal
Mapeamento principal:

- `simbolosAbrirModal(modo)` - abre modal em modo novo ou editar, preenchendo campos e preview;
- `simbolosFecharModal()` - fecha modal e, se preciso, fecha o editor;
- `simbolosDialogPergunta(texto)` - abre pergunta de confirmação;
- `simbolosDialogInfo(texto)` - abre informação e ajusta botões de resposta;
- `simbolosExcluirModalAtual()` - remove o desenho/item corrente a partir do modal, depois limpa imagem, refId e edição;
- `simbolosSalvarModal()` - persiste a edição vinda do modal e encerra modal/editor;
- `simbolosAplicarModoModal(item)` - aplica bloqueios/regras de sistema ou usuário.

Riscos de backdrop, foco e estado:
- o modal e o editor usam backdrops distintos;
- o fechamento incorreto pode deixar `src` de `iframe` carregado ou estado de edição preso;
- o modal é reaproveitado para novo, editar, salvar e excluir desenho;
- há confirmação própria com `msgBackdrop`, `msgSim` e `msgNao`, então evento duplicado pode gerar estado inconsistente.

## 11. Editor visual / iframe / canvas / paint
Este é o ponto mais sensível do módulo.

O que existe no `app.js`:
- `simbolosAbrirEditor(url)`;
- `simbolosFecharEditor()`;
- `simbolosEditorNotificar(type, payload)`;
- `window.addEventListener("message", ...)`;
- `simbolosPersistirEdicao()`;
- `simbolosAplicarImagemEditada()`;
- `simbolosLimparImagemEditada()`;
- uma área visual `.simbolos-canvas`;
- URL do editor em `iframe`: `/frontend/mock_simbolo_editor.html`.

Fluxo pai/filho:
- o pai monta a URL do editor com query params como nome, especialidade, forma, código e imagem;
- o `iframe` abre o editor embarcado;
- o editor envia `simbolo-editor-save` ou `simbolo-editor-close`;
- o pai valida `origin`, compara código corrente e persiste via `simbolosPersistirEdicao()`;
- o pai responde com `simbolo-editor-error` ou `simbolo-editor-saved`.

Risco de tela preta:
- o editor depende de `iframe`, `contentWindow`, `origin`, `dataset` do modal e troca de mensagens;
- o fechamento reseta o `src` para `about:blank`;
- qualquer mudança prematura nessa ponte pode quebrar o editor ou deixar tela preta.

Registro explícito de segurança:
- nesta fase não mover nenhum trecho relacionado a `iframe`, editor, canvas/preview, `postMessage` ou `message`.

## 12. Funções de salvar
Fluxo observado:
- `simbolosSalvarModal()` chama `simbolosPersistirEdicao()`;
- `simbolosPersistirEdicao()` valida nome, especialidade, tipo de marca e, quando aplicável, imagem;
- no caso de símbolo de sistema, o fluxo usa `PUT` restrito para atualizar dados existentes;
- no caso de símbolo do usuário, o fluxo monta payload com `descricao`, `especialidade`, `tipo_simbolo`, `tipo_marca`, `codigo`, `imagem_custom`;
- o payload é enviado via `requestJson` para `POST` ou `PUT` em `/cadastros/simbolos-graficos`;
- após salvar, a lista é recarregada e a seleção é preservada ou reposicionada.

Mensagens exibidas:
- alerta de falha;
- confirmação de sucesso;
- lembrete para associar o novo símbolo a uma intervenção no módulo de Tabelas de Preços.

Impacto no item selecionado e preview:
- o item salvo volta a ser selecionado;
- a biblioteca é ressincronizada;
- o preview é atualizado;
- o modal é fechado ao final.

Não alterei payload nenhum; este registro é apenas analítico.

## 13. Funções de excluir/inativar
Excluir existe.
Inativar/ativar não foi identificado no trecho de Símbolos Gráficos analisado.

Fluxo de exclusão:
- `simbolosExcluirSelecionado()` remove o item selecionado na grade;
- `simbolosExcluirModalAtual()` remove o desenho/item em contexto do modal;
- ambos usam `requestJson("DELETE", /cadastros/simbolos-graficos/{id})`;
- ambos recarregam a lista depois da operação.

Proteção encontrada:
- símbolos de sistema não podem ser excluídos;
- o código usa `simbolosEhSistema(item)` para bloquear a operação.

Risco adicional:
- se um símbolo estiver sendo usado por outros fluxos, a exclusão pode ter efeito colateral; isso deve continuar como risco documental, não como mudança funcional nesta fase.

## 14. Eventos e binds
Eventos e binds encontrados:

- `bindStandardGridActivation(simbolosCfg.tbody, ...)` - ativação principal da grade;
- `simbolosCfg.tbody.addEventListener("click", ...)` no bloco legado de UI inicial;
- `simbolosCfg.btnNovo.addEventListener("click", ...)`;
- `simbolosCfg.btnEditar.addEventListener("click", ...)`;
- `simbolosCfg.btnExcluir.addEventListener("click", ...)`;
- `simbolosCfg.btnFechar.addEventListener("click", ...)`;
- `simbolosCfg.modalCancelar.addEventListener("click", ...)`;
- `simbolosCfg.modalOk.addEventListener("click", ...)`;
- `simbolosCfg.modalBackdrop.addEventListener("click", ...)`;
- `simbolosCfg.editorBackdrop.addEventListener("click", ...)`;
- `simbolosCfg.biblioteca.addEventListener("click", ...)`;
- `simbolosCfg.msgSim.onclick`;
- `simbolosCfg.msgNao.onclick`;
- `simbolosCfg.msgBackdrop.addEventListener("click", ...)`;
- `window.addEventListener("message", ...)`.

Risco de duplicidade ou perda de bind:
- há duas definições do bloco de eventos de símbolos no arquivo, e a tardia sobrescreve a inicial;
- rerender de `tbody` pode apagar contexto visual de seleção se o helper de grid não for respeitado;
- eventos globais, especialmente `message`, merecem cautela porque o editor depende deles.

## 15. Estados/caches globais
Estados globais relevantes:

| Estado | Finalidade | Onde é lido | Onde é alterado | Risco |
|---|---|---|---|---|
| `simbolosCfg` | concentra referências DOM do módulo | quase todas as funções do bloco | `simbolosEnsureUI()` | muito alto, é o contrato central |
| `simbolosCache` | catálogo principal | render, seleção, salvar, excluir | `simbolosCarregar()`, `simbolosRemoverDoCache()`, salvamentos | alto |
| `simbolosBibliotecaCache` | biblioteca visual | render, preview, seleção, editor | `simbolosCarregar()`, `simbolosRemoverDoCache()`, seleção na biblioteca | alto |
| `simbolosSelId` | linha selecionada | render, botões, edição, exclusão | `simbolosSelecionarLinha()`, `simbolosCarregar()`, `simbolosRemoverDoCache()`, salvar | alto |
| `simbolosEspecialidadesMap` | lookup de especialidades | `simbolosEspecialidadeNome()` | `simbolosCarregarEspecialidades()` | médio/alto |
| `simbolosCfg.modalBackdrop.dataset.editId` | modo de edição do modal | salvar, excluir, editor | abrir modal, selecionar biblioteca, persistência | alto |
| `simbolosCfg.modalBackdrop.dataset.customImage` | imagem customizada | preview, salvar, editor | aplicar imagem, limpar imagem, salvar, edição | alto |
| `simbolosCfg.modalBackdrop.dataset.refId` | referência de item base | biblioteca, preview, editor | seleção de biblioteca e modal | médio/alto |
| `simbolosCfg.panel.dataset.bound` | guarda bind duplo de eventos | `simbolosVincularEventos()` | `simbolosVincularEventos()` | médio |

## 16. Endpoints usados
| Endpoint | Método | Função que chama | Payload / retorno aproximado | Risco |
|---|---|---|---|---|
| `/cadastros/simbolos-graficos` | GET | `simbolosCarregar()` | lista do catálogo principal | alto, base do módulo |
| `/cadastros/simbolos-graficos?scope=biblioteca` | GET | `simbolosCarregar()` | biblioteca visual | alto |
| `/cadastros/simbolos-graficos?scope=amplo` | GET | fallback dentro de `simbolosCarregar()` | fallback de catálogo/biblioteca | médio/alto |
| `/cadastros/simbolos-graficos?scope=procedimentos` | GET | `procCarregarCombosEditor()` e blocos correlatos de Procedimentos | símbolos para combo/preview de procedimento | alto por dependência externa |
| `/cadastros/simbolos-graficos?scope=genericos` | GET | `pgenCarregarSimbolos()` | símbolos usados por Procedimentos Genéricos | alto por dependência externa |
| `/cadastros/auxiliares?tipo=Especialidade` | GET | `simbolosCarregarEspecialidades()` | catálogo de especialidades/lookup textual | médio |
| `/cadastros/simbolos-graficos/{id}` | PUT | `simbolosPersistirEdicao()`, caso símbolo de sistema ou edição existente | atualiza descrição/especialidade ou edição persistida | muito alto |
| `/cadastros/simbolos-graficos` | POST | `simbolosPersistirEdicao()`, caso novo símbolo | cria símbolo com payload completo | muito alto |
| `/cadastros/simbolos-graficos/{id}` | DELETE | `simbolosExcluirSelecionado()`, `simbolosExcluirModalAtual()` | exclui item | muito alto |

## 17. Contratos DOM
IDs e classes relevantes encontrados:

- `simbolos-panel`;
- `simbolos-tbody`;
- `simbolos-total`;
- `simbolos-btn-novo`;
- `simbolos-btn-editar`;
- `simbolos-btn-excluir`;
- `simbolos-btn-fechar`;
- `simbolos-modal-backdrop`;
- `simbolos-modal-title`;
- `simbolos-nome`;
- `simbolos-especialidade`;
- `simbolos-forma`;
- `simbolos-modal-ok`;
- `simbolos-modal-cancelar`;
- `simbolos-biblioteca`;
- `simbolos-msg-backdrop`;
- `simbolos-msg-text`;
- `simbolos-msg-sim`;
- `simbolos-msg-nao`;
- `simbolos-editor-backdrop`;
- `simbolos-editor-frame`;
- `.simbolos-canvas`;
- `#simbolos-desenho-clear`;
- `#simbolos-desenho-edit`.

Também há contratos em funções de chrome visual do shell:
- `PANEL_TITLE_DEFAULTS` com `simbolos-panel`;
- `panelInsetsById()` com `simbolos-panel`;
- `modalInsetsById()` com `simbolos-modal-backdrop`;
- `closeModalByBackdropId()` com `simbolos-modal-backdrop`.

Esses contratos DOM não devem ser alterados cedo.

## 18. Dependências com outros módulos
Dependências encontradas no próprio `app.js`:

- `Procedimentos` - usa símbolos para combo de procedimento e preview visual (`procCarregarCombosEditor()`, `procAtualizarPreviewSimbolo()`, `procSimbolosCache`);
- `Procedimentos Genéricos` - usa símbolos como lookup de catálogo (`pgenCarregarSimbolos()`);
- `Configuração / menu global` - o acionador `config-simbolos-graficos` abre o painel;
- `shell comum do app` - `hideAllPanels()`, `closeWorkspacePanel()` e `closeModalByBackdropId()` conhecem o módulo.

Não encontrei dependência direta de Símbolos Gráficos com `Agenda`, `Ficha pessoal`, `Ficha clínica` ou `Editor de textos` no trecho analisado. O risco maior vem dos consumidores externos já citados e do editor embarcado.

Se Símbolos Gráficos for usado por outros fluxos, o risco é automaticamente maior e a modularização deve continuar ainda mais passiva.

## 19. Riscos principais
- duplo clique e segundo clique rápido;
- `bindStandardGridActivation`;
- tabelas dinâmicas e rerender de `tbody`;
- binds manuais no mesmo módulo e duplicidade de definição;
- modais e backdrops reaproveitados;
- editor visual, `iframe`, `canvas`/preview e `postMessage`;
- listener global de `message`;
- risco de tela preta no editor;
- payload de salvar/excluir;
- endpoints de CRUD;
- estado global compartilhado;
- consumidores externos em Procedimentos e Procedimentos Genéricos;
- símbolos usados por outros cadastros;
- mover código cedo demais;
- misturar modularização com correção textual/mojibake;
- mexer em `frontend/index.html` cedo demais sem necessidade futura.

## 20. Helpers puros candidatos
Candidatos pequenos e seguros, sem implementação nesta etapa:

| Helper sugerido | Entrada esperada | Saída esperada | Por que é puro | Por que não depende de DOM | Por que não depende de requestJson/fetch | Por que não depende de eventos / modal / editor / iframe / canvas | Risco de integração futura |
|---|---|---|---|---|---|---|---|
| `normalizarTextoSimbolo` | string | string normalizada e minúscula | só transforma texto | não consulta elementos visuais | não faz I/O | não acopla evento nem tela | baixo |
| `validarTipoMarcaSimbolo` | valor textual/numeral | valor de tipo válido ou vazio | decisão determinística | não lê DOM | não faz I/O | não mexe em modal/editor | baixo |
| `ehSimboloSistema` | item simples | boolean | apenas lê campos do objeto | não consulta DOM | não faz I/O | não depende de evento ou editor | baixo |
| `urlImagemSimbolo` | item simples | string com URL de imagem | apenas calcula string | não consulta DOM | não faz I/O | não depende de editor | baixo/médio |
| `ocultarItemDaBiblioteca` | item simples | boolean | apenas compara código | não consulta DOM | não faz I/O | não depende de evento | baixo |
| `compararBibliotecaPorCodigo` | dois itens | número de ordenação | apenas compara strings | não consulta DOM | não faz I/O | não depende de modal/editor | baixo |

Observação importante:
- `simbolosEspecialidadeNome()` não entrou como candidata principal aqui porque depende de `simbolosEspecialidadesMap`; ele só seria seguro se o lookup fosse passado como argumento explícito.

## 21. O que NÃO deve ser movido cedo
Por segurança, não devem ser movidos agora:

- função principal de abertura;
- criação de UI;
- criação de grade;
- `requestJson` / `fetch`;
- renderização;
- seleção de linha;
- `bindStandardGridActivation`;
- binds de clique;
- binds de duplo clique;
- segundo clique rápido;
- modais;
- backdrop;
- salvar;
- excluir/inativar;
- `iframe`;
- editor visual;
- canvas/preview;
- `postMessage`;
- `window.addEventListener("message", ...)`;
- integração com backend;
- integração com outros cadastros;
- qualquer correção textual/mojibake.

## 22. Recomendação para Subetapa 1
A próxima ação conservadora recomendada é criar:

`D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\simbolos-graficos.js`

com namespace passivo:

`window.BranaSimbolosGraficosModule`

Esse módulo deve conter somente:
- meta;
- `getInfo`;
- `getStatus`;
- talvez constantes descritivas sem uso funcional;
- `status` passivo;
- `ativo: false`;
- `controlaFluxo: false`.

A Subetapa 1 não deve conter:
- DOM;
- `fetch`;
- `requestJson`;
- eventos;
- modal;
- `iframe`;
- canvas;
- `postMessage`;
- renderização;
- seleção;
- salvar;
- excluir;
- integração com backend;
- mudança de comportamento.

Na Subetapa 1, `frontend/index.html` só poderá carregar o arquivo antes de `frontend/app.js` se isso seguir exatamente o padrão dos módulos anteriores e sem alterar fluxo.

## 23. Checks permitidos
Checks executados nesta etapa:

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\anamnese.js`

Resultado:
- todos passaram sem erro de sintaxe.

## Resultado final desta subetapa
Esta etapa produziu somente este documento e não alterou código funcional.
