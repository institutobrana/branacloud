# Símbolos Gráficos — Subetapa 8 — Documental dos helpers remanescentes

## Objetivo

Mapear os helpers remanescentes de `Símbolos Gráficos` de forma conservadora, para decidir se existe algum helper puro seguro para futura análise ou integração mínima, sem mover código funcional nesta etapa.

## Escopo

- Confirmar o estado atual do módulo `Símbolos Gráficos` como continuação documental conservadora.
- Revisar os helpers remanescentes e o que já foi delegado ao módulo passivo.
- Separar o que ainda é fluxo sensível do que pode ser considerado helper puro candidato.
- Registrar riscos visuais, de renderização e de textualização sem corrigir nada.

## Arquivos inspecionados

- `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md`
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/simbolos-graficos.js`

## Checks iniciais

- Branch atual: `modularizacao-segura-fase-1`.
- `git status --short` mostrou pendências preexistentes no repositório, sem diffs rastreados novos nesta rodada documental.
- `git diff --stat` veio vazio antes da criação deste documento.
- `git diff --cached --stat` veio vazio antes da criação deste documento.
- `git log --oneline -12` confirmou a linha de trabalho atual e o histórico recente da retomada de `Prestadores`.

## Base documental encontrada

| Documento | Papel aparente | Observação |
|---|---|---|
| `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md` | Retomada documental do módulo | Confirma que `Símbolos Gráficos` já é módulo parcial retomado, não módulo novo. |
| `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md` | Mapeamento inicial | Mostra o bloco monolítico original e a superfície sensível do módulo. |
| `docs/simbolos_graficos_subetapa_1_namespace_passivo.md` | Namespace passivo | Registra a criação do namespace passivo do módulo JS. |
| `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md` | Fronteiras e contratos | Delimita o que é seguro e o que exige cautela. |
| `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md` | Helpers puros passivos | Primeiro conjunto de helpers extraídos para o namespace. |
| `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md` | Integração de helper textual | Concretiza o wrapper/fallback de `normalizarTextoSimbolo`. |
| `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md` | Integração de helper lógico | Concretiza o wrapper/fallback de `ehSimboloSistema`. |
| `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md` | Integração de helper visual | Concretiza o wrapper/fallback de `urlImagemSimbolo`. |
| `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md` | Consolidação dos helpers já delegados | Fecha a rodada anterior de helpers já migrados. |
| `docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md` | Biblioteca remanescente | Já havia apontado `simbolosBibliotecaOculta` e `simbolosCompararBiblioteca` como candidatos seguros, com cautela visual para a comparação. |
| `docs/recomendacao_proximo_modulo_pos_prestadores_retomada.md` | Recomendação pós-Prestadores | Continua indicando `Símbolos Gráficos` como próximo módulo mais seguro. |
| `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md` | Histórico de fechamento anterior | Ajuda a separar o que foi concluído do que ficou para retomada documental. |

## Histórico conhecido do módulo

- `Símbolos Gráficos` já passou por ciclo anterior de modularização/refatoração.
- O módulo atual não deve ser tratado como novo.
- Há namespace passivo em `frontend/js/modules/simbolos-graficos.js`.
- Já houve delegação de helpers puros para esse namespace.
- O restante do módulo continua concentrado em modal, editor visual, biblioteca, preview, `postMessage`, salvar e excluir.

## Onde o ciclo anterior parou

O ciclo anterior consolidou os helpers já delegados e deixou como remanescentes da biblioteca os helpers de filtragem e ordenação visual, sem avançar para o editor nem para o fluxo de persistência.

## Motivo conhecido da pausa/reavaliação anterior

- O editor visual e o preview seguem sensíveis.
- `postMessage` com janela filha continua como ponte delicada.
- Há fluxo de salvar/excluir ainda concentrado no monólito.
- Qualquer avanço no bloco restante pode afetar ordem visual, biblioteca e modal.

## Estado atual do módulo JS

O arquivo existente é `frontend/js/modules/simbolos-graficos.js`.

O conteúdo atual é passivo e expõe `window.BranaSimbolosGraficosModule` com:

- `meta`
- `getInfo()`
- `getStatus()`
- helpers de biblioteca e imagem:
  - `normalizarTextoSimbolo`
  - `ehSimboloSistema`
  - `ocultarItemDaBiblioteca`
  - `compararBibliotecaPorCodigo`
  - `urlImagemSimbolo`
  - `validarTipoMarcaSimbolo`

Não há DOM, `requestJson`, `fetch`, modal, editor, `iframe`, `canvas` nem `postMessage` dentro do módulo passivo.

## Estado atual do carregamento no index.html

O `frontend/index.html` já carrega o módulo passivo antes de `frontend/app.js`.

Referências observadas:

- `data-menu-action="config-simbolos-graficos"` em `frontend/index.html:2639`
- `id="nproc-simbolo-frame"` e `id="nproc-simbolo-img"` em `frontend/index.html:3015-3016`
- `id="nproc-simbolo"` em `frontend/index.html:3043`
- `<script src="/frontend/js/modules/simbolos-graficos.js"></script>` em `frontend/index.html:3931`

Conclusão:

- o módulo já existe e já está integrado no carregamento base;
- `Símbolos Gráficos` não é módulo novo;
- a página pode usar o namespace passivo disponível.

## Estado atual no frontend/app.js

O bloco de `Símbolos Gráficos` continua grande e centralizado no monólito.

Estado global observado:

- `simbolosCfg`
- `simbolosCache`
- `simbolosBibliotecaCache`
- `simbolosSelId`
- `simbolosEspecialidadesMap`

Funções de suporte, renderização e fluxo ainda presentes no `app.js`:

- `simbolosEnsureUI`
- `simbolosEspecialidadeNome`
- `simbolosCarregarEspecialidades`
- `simbolosRender`
- `simbolosBibliotecaOficial`
- `simbolosRenderBiblioteca`
- `simbolosSelecionadoNaGrade`
- `simbolosSelecionado`
- `simbolosRemoverDoCache`
- `simbolosSelecionarLinha`
- `simbolosCarregar`
- `simbolosPreencherEspecialidades`
- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosVincularEventos`
- `simbolosAbrir`

Funções auxiliares do bloco visual/modal/editor ainda presentes:

- `simbolosSetModalCodigo`
- `simbolosCodigoSelecionado`
- `simbolosSetModalRefId`
- `simbolosRefIdSelecionado`
- `simbolosNormalizarTexto`
- `simbolosEspecialidadePadrao`
- `simbolosPreencherFormas`
- `simbolosSetModalForma`
- `simbolosTipoMarcaSelecionado`
- `simbolosEspecialidadeValorPorTexto`
- `simbolosEspecialidadeResolverValor`
- `simbolosTipoMarcaPorTexto`
- `simbolosEhSistema`
- `simbolosAtualizarAcoesPainel`
- `simbolosAtualizarSelecaoBiblioteca`
- `simbolosLimparImagemEditada`
- `simbolosAplicarImagemEditada`
- `simbolosEditorNotificar`
- `simbolosAtualizarPreview`
- `simbolosImagemUrl`
- `simbolosBibliotecaOculta`
- `simbolosCompararBiblioteca`
- `simbolosDialogFechar`
- `simbolosDialogPergunta`
- `simbolosDialogInfo`
- `simbolosItemModalAtual`
- `simbolosExcluirModalAtual`
- `simbolosPersistirEdicao`
- `simbolosModalEhSistema`
- `simbolosAplicarModoModal`
- `simbolosSelecionarBiblioteca`
- `simbolosTipoSelecionado`
- `simbolosFecharEditor`
- `simbolosAbrirEditor`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`

## Helpers já movidos ou delegados

Delegados para o namespace passivo:

- `simbolosNormalizarTexto` -> `window.BranaSimbolosGraficosModule.helpers.normalizarTextoSimbolo`
- `simbolosEhSistema` -> `window.BranaSimbolosGraficosModule.helpers.ehSimboloSistema`
- `simbolosImagemUrl` -> `window.BranaSimbolosGraficosModule.helpers.urlImagemSimbolo`

## Wrappers/fallbacks existentes

Os wrappers/fallbacks já existentes em `app.js` são os três acima.

Não há wrapper novo para os remanescentes de biblioteca nesta etapa.

## Funções remanescentes e classificação

| Função | Assinatura aparente | Entrada | Saída | DOM | Cache global | Estado | API/requestJson | Payload | Salva | Exclui | Evento/clique | Renderização | Retorna HTML/SVG/cor/classe/texto visível | Risco textual/mojibake | Classificação |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `simbolosBibliotecaOculta` | `function simbolosBibliotecaOculta(item)` | item com `codigo` | boolean | Não | Não | Não | Não | Não | Não | Não | Não | Sim, indiretamente via filtro da biblioteca | Não | Baixo | **Puro candidato seguro** |
| `simbolosCompararBiblioteca` | `function simbolosCompararBiblioteca(a,b)` | dois itens da biblioteca | número de comparação | Não | Não | Não | Não | Não | Não | Não | Não | Sim, indiretamente via ordenação da biblioteca | Não | Baixo | **Puro candidato com cautela visual** |
| `validarTipoMarcaSimbolo` | `function validarTipoMarcaSimbolo(valor)` | valor bruto | `"sistema"`, `"usuario"` ou `""` | Não | Não | Não | Não | Não | Não | Não | Não | Não, mas alimenta fluxo visual se vier a ser usado | Não | Baixo | **Puro candidato do módulo passivo** |

## Funções sensíveis e não recomendadas agora

- `simbolosEnsureUI`
- `simbolosCarregarEspecialidades`
- `simbolosRender`
- `simbolosBibliotecaOficial`
- `simbolosRenderBiblioteca`
- `simbolosSelecionadoNaGrade`
- `simbolosSelecionado`
- `simbolosRemoverDoCache`
- `simbolosSelecionarLinha`
- `simbolosCarregar`
- `simbolosPreencherEspecialidades`
- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosVincularEventos`
- `simbolosAbrir`
- `simbolosSetModalCodigo`
- `simbolosSetModalRefId`
- `simbolosPreencherFormas`
- `simbolosSetModalForma`
- `simbolosAtualizarAcoesPainel`
- `simbolosAtualizarSelecaoBiblioteca`
- `simbolosLimparImagemEditada`
- `simbolosAplicarImagemEditada`
- `simbolosEditorNotificar`
- `simbolosAtualizarPreview`
- `simbolosDialogFechar`
- `simbolosDialogPergunta`
- `simbolosDialogInfo`
- `simbolosItemModalAtual`
- `simbolosExcluirModalAtual`
- `simbolosPersistirEdicao`
- `simbolosModalEhSistema`
- `simbolosAplicarModoModal`
- `simbolosSelecionarBiblioteca`
- `simbolosTipoSelecionado`
- `simbolosFecharEditor`
- `simbolosAbrirEditor`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`

## Funções que envolvem renderização

- `simbolosRender`
- `simbolosBibliotecaOficial`
- `simbolosRenderBiblioteca`
- `simbolosAtualizarPreview`

## Funções que envolvem eventos, clique ou duplo clique

- `simbolosVincularEventos`
- `simbolosSelecionarLinha`
- `simbolosSelecionarBiblioteca`
- `simbolosAbrir`
- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosFecharEditor`
- `simbolosAbrirEditor`

## Funções que envolvem modais

- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosDialogPergunta`
- `simbolosDialogInfo`
- `simbolosDialogFechar`
- `simbolosItemModalAtual`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirModalAtual`

## Funções que envolvem payload

- `simbolosPersistirEdicao`
- `simbolosSalvarModal`

## Funções que envolvem salvamento

- `simbolosPersistirEdicao`
- `simbolosSalvarModal`

## Funções que envolvem exclusão

- `simbolosExcluirModalAtual`
- `simbolosExcluirSelecionado`

## Funções que envolvem API/requestJson

- `simbolosCarregar`
- `simbolosCarregarEspecialidades`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirModalAtual`
- `simbolosExcluirSelecionado`
- `simbolosAbrir`

## Funções que envolvem cache/estado

- `simbolosCfg`
- `simbolosCache`
- `simbolosBibliotecaCache`
- `simbolosSelId`
- `simbolosEspecialidadesMap`
- `simbolosRemoverDoCache`
- `simbolosSelecionadoNaGrade`
- `simbolosSelecionado`
- `simbolosSelecionarLinha`
- `simbolosSelecionarBiblioteca`
- `simbolosAtualizarSelecaoBiblioteca`

## Relação com pacientes

Não há relação direta com paciente no helper remanescente em análise. O bloco do módulo pode aparecer no fluxo clínico do sistema, mas os helpers candidatos aqui não lêem nem escrevem dados de paciente.

## Relação com procedimentos

Há relação indireta com procedimentos porque o símbolo gráfico é consumido no contexto de procedimento e de cadastro visual do sistema. Mesmo assim, os helpers remanescentes em análise não montam payload de procedimento nem alteram cadastro clínico.

## Relação com materiais

Não há relação direta com materiais nos helpers remanescentes em análise.

## Relação com tabelas, preços, custos, repasses, comissões, reajustes ou financeiro

Não há relação direta nos helpers candidatos analisados. O risco financeiro do módulo é baixo nesta etapa, mas o risco visual geral do bloco ainda existe.

## Relação com backend/API/banco

O módulo completo ainda conversa com backend via `requestJson`, principalmente em carga, persistência e exclusão. Os helpers remanescentes analisados aqui não fazem isso diretamente.

## Riscos de texto/mojibake

- Não houve correção de textos, acentos, labels, mensagens, placeholders ou strings visíveis.
- Os helpers candidatos remanescentes não fazem correção textual.
- O risco textual existe mais no bloco funcional antigo do `app.js` do que nos helpers puros aqui documentados.

## Riscos de regressão em renderização, ícones, cores, HTML ou SVG

- `simbolosBibliotecaOculta` é seguro em termos de pureza, mas afeta a visibilidade dos itens na biblioteca.
- `simbolosCompararBiblioteca` é puro, mas altera a ordem visual da biblioteca.
- `validarTipoMarcaSimbolo` é puro, mas pode afetar a forma como o modo do símbolo é interpretado quando vier a ser usado.
- Nenhum dos três retorna HTML, SVG, cor ou classe CSS diretamente.

## Classificação de segurança

- `simbolosBibliotecaOculta`: seguro para futura análise ou integração mínima.
- `simbolosCompararBiblioteca`: seguro, mas com cautela por afetar ordenação visual.
- `validarTipoMarcaSimbolo`: seguro como helper puro do módulo passivo, porém ainda sem consumer no `app.js`.

## Decisão recomendada

**Analisar helper puro específico.**

Mais precisamente:

- avançar primeiro com `simbolosBibliotecaOculta` se houver continuidade funcional;
- manter `simbolosCompararBiblioteca` como próximo passo, por envolver apenas ordenação visual;
- deixar o restante do bloco sensível fora de escopo nesta rodada.

## Próxima etapa recomendada

Se houver continuidade, a próxima etapa deve ser uma análise funcional mínima de `simbolosBibliotecaOculta`, com cópia literal e wrapper/fallback conservador, sem tocar em modal, editor, `postMessage`, salvamento ou exclusão.

## Roteiro de teste futuro, se houver extração funcional

1. `Ctrl+F5`.
2. Abrir `Símbolos Gráficos`.
3. Conferir abertura do modal/painel.
4. Verificar biblioteca e preview.
5. Confirmar que a ordem/visibilidade da biblioteca permanece estável.
6. Não salvar.
7. Não excluir.
8. Não abrir o editor se a etapa futura não tocar nele.
9. Verificar o console.

## Confirmação final

Nesta etapa, nenhum código foi alterado. Não houve mudança em `frontend/app.js`, `frontend/index.html`, `frontend/js/modules/simbolos-graficos.js`, backend, banco, schema, migrations ou endpoints. A blindagem textual/mojibake foi respeitada.
