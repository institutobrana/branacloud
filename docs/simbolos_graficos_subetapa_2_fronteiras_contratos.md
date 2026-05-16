# Símbolos Gráficos — Subetapa 2 — Fronteiras, contratos e plano de extração segura

## 1. Escopo da etapa
Esta etapa é somente documental. Nenhum código funcional foi alterado, nenhum fluxo foi movido e nenhuma correção textual, estrutural ou comportamental foi aplicada.

## 2. Arquivos analisados
Arquivos analisados nesta etapa:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/simbolos-graficos.js`
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/auditoria_console_pos_reversao_erros_reais.md`
- `docs/recomendacao_proximo_modulo_pos_convenios_planos.md`
- `docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/recomendacao_proximo_modulo_pos_prestadores.md`
- `docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/05_banco_dados.md`
- `docs/03_mapa_codigo.md`
- `docs/11_roadmap_desenvolvimento.md`

Outras documentações antigas de Símbolos Gráficos encontradas e consideradas:

- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md` - referência indireta ao uso de Símbolos Gráficos como confirmação de comportamento global.

## 3. Conferência da Subetapa 1
Foi conferido que:

- `window.BranaSimbolosGraficosModule` existe;
- o módulo continua passivo;
- `active`/`ativo` permanece `false`;
- `controlaFluxo` permanece `false`;
- o módulo não usa DOM;
- o módulo não usa `fetch`/`requestJson`;
- o módulo não usa eventos;
- o módulo não usa modal;
- o módulo não usa iframe;
- o módulo não usa canvas;
- o módulo não usa `postMessage` ou `message`;
- o módulo não faz reassignment de funções globais do `app.js`;
- o `index.html` carrega `frontend/js/modules/simbolos-graficos.js` antes de `frontend/app.js`.

Importante: esta conferência foi apenas documental. Nada foi corrigido.

## 4. Fonte funcional da verdade
Após a Subetapa 1:

- `frontend/app.js` continua sendo a fonte funcional da verdade;
- `frontend/js/modules/simbolos-graficos.js` é apenas namespace passivo;
- nenhuma função de Símbolos Gráficos foi movida;
- nenhum fluxo foi assumido pelo módulo novo.

## 5. Fronteiras funcionais do módulo

### 5.1 Cadastro/listagem
Fronteira atual:

- abertura da tela;
- carregamento de lista;
- renderização da grade;
- seleção;
- ações Novo/Alterar/Excluir.

### 5.2 Modal de cadastro/edição
Fronteira atual:

- abertura;
- fechamento;
- preenchimento;
- validação;
- salvar;
- excluir no modal, se existir;
- preview.

### 5.3 Biblioteca/preview
Fronteira atual:

- carregamento da biblioteca;
- renderização de miniaturas;
- seleção visual;
- atualização de preview.

### 5.4 Editor visual
Fronteira atual:

- abertura do editor;
- fechamento do editor;
- iframe;
- comunicação pai/filho;
- `message`/`postMessage`;
- persistência da edição visual;
- risco de tela preta.

### 5.5 Integrações externas
Fronteira atual:

- consumidores externos;
- Procedimentos;
- Procedimentos Genéricos;
- Prestadores;
- Convênios e Planos;
- Ficha clínica/ficha pessoal;
- Agenda;
- outros consumidores encontrados no `app.js`.

## 6. Contratos que não podem quebrar

### 6.1 Contratos DOM
Contratos DOM observados:

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

Contratos de shell visual que também dependem do módulo:

- `PANEL_TITLE_DEFAULTS["simbolos-panel"]`;
- `panelInsetsById("simbolos-panel")`;
- `modalInsetsById("simbolos-modal-backdrop")`;
- `closeModalByBackdropId("simbolos-modal-backdrop")`.

### 6.2 Contratos de eventos
Contratos de eventos observados:

- clique;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- listeners de botão;
- listeners de backdrop;
- listeners globais;
- `window.addEventListener("message", ...)`.

### 6.3 Contratos de dados
Contratos de dados observados:

- estrutura de símbolo com `id`, `codigo`, `descricao`, `especialidade`, `tipo_simbolo`, `tipo_marca` e campos correlatos;
- `imagem_custom`;
- `imagem_url`;
- `refId`;
- `editId`;
- `customImage`;
- `dataset.bound`;
- `dataset.codigo`;
- `dataset.refId`;
- `dataset.editId`.

### 6.4 Contratos de endpoints
Os endpoints abaixo foram encontrados no `app.js` atual e continuam como contratos ativos observados:

- `GET /cadastros/simbolos-graficos`
- `GET /cadastros/simbolos-graficos?scope=biblioteca`
- `GET /cadastros/simbolos-graficos?scope=amplo`
- `GET /cadastros/simbolos-graficos?scope=procedimentos`
- `GET /cadastros/simbolos-graficos?scope=genericos`
- `GET /cadastros/auxiliares?tipo=Especialidade`
- `POST /cadastros/simbolos-graficos`
- `PUT /cadastros/simbolos-graficos/{id}`
- `DELETE /cadastros/simbolos-graficos/{id}`

Todos os endpoints acima foram encontrados no `app.js` atual, incluindo consumidores externos em Procedimentos e Procedimentos Genéricos.

## 7. Mapa de funções por risco

| Função | Responsabilidade | Usa DOM? | Usa requestJson/fetch? | Usa evento? | Usa modal? | Usa editor/iframe/message? | Risco | Pode ser movida agora? | Observação |
|---|---|---|---|---|---|---|---|---|---|
| `simbolosNormalizarTexto` | normalização textual simples | não | não | não | não | não | baixo | sim, se virar helper exportado puro | candidata mais segura |
| `simbolosBibliotecaOculta` | filtra itens ocultos da biblioteca | não | não | não | não | não | baixo | sim, se usada como helper exportado puro | depende só de string/código |
| `simbolosCompararBiblioteca` | ordena biblioteca por código | não | não | não | não | não | baixo | sim, se usada como helper exportado puro | puro e determinístico |
| `simbolosEhSistema` | identifica símbolo de sistema | não | não | não | não | não | baixo | sim, se isolada como helper puro | lê apenas campos do item |
| `simbolosImagemUrl` | resolve URL de imagem base | não | não | não | não | não | baixo/médio | talvez, com cuidado | ainda depende do contrato do item |
| `simbolosEspecialidadeNome` | resolve nome textual de especialidade | não | não | não | não | não | médio | talvez, com cuidado | puro no formato atual, mas depende de lookup global |
| `simbolosEnsureUI` | cria contrato DOM do painel | sim | não | não | sim | sim | alto | não | contrato estrutural central |
| `simbolosCarregarEspecialidades` | carrega lookup de especialidades | sim | sim | não | não | não | alto | não | depende de backend e estado |
| `simbolosCarregar` | carrega catálogo e biblioteca | sim | sim | não | não | não | alto | não | base da tela |
| `simbolosRender` | renderiza a grade | sim | não | não | não | não | alto | não | depende de cache e seleção |
| `simbolosRenderBiblioteca` | renderiza miniaturas | sim | não | não | não | não | alto | não | depende da biblioteca e preview |
| `simbolosSelecionarLinha` | sincroniza seleção da grade | sim | não | não | não | não | alto | não | muito acoplada ao rerender |
| `simbolosAbrir` | abre a tela do módulo | sim | não | não | não | não | alto | não | função principal de abertura |
| `simbolosAbrirModal` | abre modal de novo/editar | sim | não | não | sim | sim | alto | não | mistura modal, preview e editor |
| `simbolosFecharModal` | fecha modal | sim | não | não | sim | sim | alto | não | controla encerramento visual |
| `simbolosSalvarModal` | salva pelo modal | sim | sim | não | sim | sim | crítico | não | persiste e fecha editor/modal |
| `simbolosExcluirSelecionado` | exclui item na grade | sim | sim | sim | não | não | alto | não | mutação direta em backend |
| `simbolosExcluirModalAtual` | exclui item dentro do modal | sim | sim | sim | sim | sim | alto | não | depende do modal e do editor |
| `simbolosAbrirEditor` | abre iframe do editor | sim | não | não | sim | sim | crítico | não | ponto sensível da tela preta |
| `simbolosFecharEditor` | fecha iframe do editor | sim | não | não | sim | sim | crítico | não | reseta `src` para `about:blank` |
| `simbolosEditorNotificar` | envia mensagem ao editor | sim | não | não | não | sim | crítico | não | bridge pai/filho |
| `simbolosPersistirEdicao` | monta e salva payload | sim | sim | não | sim | sim | crítico | não | concentra regras de persistência |
| `simbolosVincularEventos` | registra listeners do módulo | sim | não | sim | sim | sim | alto/crítico | não | inclui `bindStandardGridActivation` e `message` |
| `window.addEventListener("message", ...)` | recebe mensagens do editor | sim | não | sim | sim | sim | crítico | não | contrato global do editor |

## 8. Helpers puros candidatos para Subetapa 3
Helpers que continuam como candidatos realmente seguros:

| Helper sugerido | Entrada | Saída | Trecho atual onde a lógica parece existir | É 100% puro? | Risco | Recomendação |
|---|---|---|---|---|---|---|
| `normalizarTextoSimbolo` | string | string normalizada | `simbolosNormalizarTexto` | sim | baixo | mover agora, se a futura Subetapa 3 quiser começar por helper isolado |
| `validarTipoMarcaSimbolo` | valor textual/numeral | tipo válido ou vazio | lógica de `simbolosSetModalForma` / `simbolosTipoMarcaSelecionado` | sim, se isolado em comparação pura | baixo | mover só se a função for criada sem tocar no modal |
| `ehSimboloSistema` | item simples | boolean | `simbolosEhSistema` | sim | baixo | mover agora é plausível |
| `urlImagemSimbolo` | item simples | string | `simbolosImagemUrl` | sim | baixo/médio | mover se a regra de fallback for mantida idêntica |
| `ocultarItemDaBiblioteca` | item simples | boolean | `simbolosBibliotecaOculta` | sim | baixo | mover agora é plausível |
| `compararBibliotecaPorCodigo` | dois itens | número | `simbolosCompararBiblioteca` | sim | baixo | mover agora é plausível |

Observação:
- `simbolosEspecialidadeNome` continua como candidato apenas condicional, porque hoje depende de lookup global e não é o primeiro alvo ideal para extração.

## 9. Helpers que não devem ser movidos ainda
Não devem ser movidos ainda:

- `simbolosEnsureUI`;
- `simbolosCarregarEspecialidades`;
- `simbolosCarregar`;
- `simbolosRender`;
- `simbolosRenderBiblioteca`;
- `simbolosSelecionarLinha`;
- `simbolosAbrir`;
- `simbolosAbrirModal`;
- `simbolosFecharModal`;
- `simbolosSalvarModal`;
- `simbolosExcluirSelecionado`;
- `simbolosExcluirModalAtual`;
- `simbolosAbrirEditor`;
- `simbolosFecharEditor`;
- `simbolosEditorNotificar`;
- `simbolosPersistirEdicao`;
- `simbolosVincularEventos`;
- `window.addEventListener("message", ...)`.

Motivos para não mover ainda:

- dependem de DOM;
- dependem de estado global;
- dependem de `requestJson`/`fetch`;
- dependem de modal;
- dependem de eventos;
- dependem de editor visual/iframe/message;
- dependem de payload sensível;
- dependem de consumidores externos.

## 10. Plano conservador para Subetapa 3
Recomendação preferencial para a Subetapa 3:

- criar no módulo passivo apenas helpers puros, pequenos e sem uso funcional imediato;
- manter `frontend/app.js` intacto;
- evitar integrar qualquer helper cedo demais.

Se houver integração futura, ela deve obedecer a estas travas:

- não alterar DOM;
- não alterar texto visível;
- não alterar payload;
- não alterar endpoints;
- não alterar eventos;
- não alterar modal/editor;
- ter fallback claro;
- ser fácil de reverter;
- ter teste claro no navegador.

Se houver qualquer dúvida sobre impacto, a recomendação correta é seguir com a Subetapa 3 apenas exportando helpers e sem integração funcional.

## 11. Riscos preservados para etapas futuras
Continuam fora do escopo:

- modal;
- salvar;
- excluir;
- renderização;
- seleção;
- `bindStandardGridActivation`;
- clique;
- duplo clique;
- segundo clique rápido;
- iframe;
- editor visual;
- canvas;
- `postMessage`/`message`;
- `window.addEventListener("message", ...)`;
- correção textual/mojibake.

## 12. Blindagem textual aplicada
Esta etapa respeitou obrigatoriamente:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirmações desta etapa:

- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 13. Conclusão
A Subetapa 1 está consistente: o namespace passivo existe, está carregado antes do `app.js` e não assumiu fluxo funcional.

O módulo passivo está seguro para continuar a modularização conservadora, desde que a próxima rodada permaneça em helpers puros ou em documentação de fronteiras.

Helpers mais seguros para futura Subetapa 3:

- `normalizarTextoSimbolo`;
- `ehSimboloSistema`;
- `ocultarItemDaBiblioteca`;
- `compararBibliotecaPorCodigo`;
- `urlImagemSimbolo`, com um pouco mais de cautela;
- `validarTipoMarcaSimbolo`, se for extraído como pura comparação e sem tocar no modal.

Próxima ação recomendada:

- seguir para uma Subetapa 3 muito pequena e controlada, preferencialmente só com helpers puros exportados, sem integração funcional imediata.
