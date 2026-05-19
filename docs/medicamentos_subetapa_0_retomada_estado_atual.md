# Medicamentos — Subetapa 0 — Retomada documental e estado atual

## Objetivo
Registrar, de forma exclusivamente documental, o estado atual do módulo Medicamentos antes de qualquer extração funcional, namespace passivo adicional, helper novo ou alteração de comportamento.

## Escopo
- Reconfirmar a base documental existente sobre Medicamentos.
- Identificar o estado atual de `frontend/js/modules/medicamentos.js`.
- Confirmar o carregamento em `frontend/index.html`.
- Mapear as funcoes relacionadas em `frontend/app.js`.
- Registrar estados globais, caches, relacoes com receitas/prescricoes, impressao, editor de textos, anamnese e backend.
- Classificar helpers puros candidatos, funcoes com cautela e trechos que nao devem ser movidos agora.
- Manter a blindagem textual/mojibake sem qualquer correcao de strings visiveis.

## Arquivos inspecionados
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md`
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md`
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md`
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md`
- `docs/medicamentos_subetapa_3_helpers_textuais_puros.md`
- `docs/medicamentos_subetapa_4_integracao_validacao_nome.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/medicamentos.js`

## Checks iniciais
- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: havia pendencias preexistentes no worktree, sem alteracoes funcionais desta etapa
- `git log --oneline -10`: o commit recente de referencia foi `49703c5 Recomenda proximo modulo apos Intervencoes`
- `git diff --stat`: vazio no inicio desta retomada
- `git diff --cached --stat`: vazio no inicio desta retomada
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/medicamentos.js`: OK

## Base documental encontrada
- A recomendacao conservadora anterior apontou `Medicamentos` como proximo modulo.
- A documentacao previa ja registrava Medicamentos como modulo parcial conhecido, com ciclo documental completo e modulacao passiva ja iniciada.
- O historico documental indica que a Subetapa 0 anterior mapeou o bloco monolitico e que as subetapas seguintes deixaram um namespace passivo e helpers textuais puros no modulo separado.

## Estado atual do módulo JS
- Existe arquivo proprio em `frontend/js/modules/medicamentos.js`.
- O namespace global passivo atual e `window.BranaMedicamentosModule`.
- O modulo permanece passivo, com `meta`, `nome`, `subetapa`, `status`, `ativo`, `controlaFluxo` e `helpers`.
- Helpers expostos hoje:
  - `normalizarTextoMedicamento(texto)`
  - `validarNomeMedicamento(nome)`
  - `validarGrupoMedicamento(grupo)`
  - `compararTextoMedicamento(texto, termo)`
  - `resumo()`
- O arquivo nao assume DOM, fetch, requestJson, binds de UI, salvamento, exclusao ou fluxo funcional.
- A `meta.versao` observada no arquivo e `subetapa-1`, enquanto `ns.subetapa` e sincronizado ao final com `subetapa-3`.

## Estado atual do carregamento no index.html
- `frontend/index.html` carrega o modulo com:
  - `<script src="/frontend/js/modules/medicamentos.js"></script>`
- O menu de cadastro possui a acao:
  - `data-menu-action="cadastro-medicamentos"`
- Nao houve alteracao neste documento em `frontend/index.html` nesta retomada.

## Estado atual no frontend/app.js
- O bloco de Medicamentos continua em `frontend/app.js`.
- O dispatcher do menu possui tratamento especifico para `cadastro-medicamentos`.
- O override final de `executarAcaoMenu` intercepta `cadastro-medicamentos`, valida permissao, fecha o menu e chama `medicamentosAbrir()`.
- O modulo ainda e funcionalmente controlado pelo `app.js`, nao pelo namespace passivo.

## Funções relacionadas encontradas
- `medicamentosAbrir()`
- `medicamentosEnsureUI()`
- `medicamentosSelecionado()`
- `medicamentosSelecionarLinha(tr)`
- `medicamentosRender()`
- `medicamentosSetSelectOptions(select, itens, placeholder)`
- `medicamentosAplicarTab(tab)`
- `medicamentosLimparModal()`
- `medicamentosAplicarModalDados(item)`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosFecharModal()`
- `medicamentosAbrirModal(modo)`
- `medicamentosPayloadModal()`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosVincularEventos()`

## Variáveis globais/cache/estado identificados
- `medicamentosCfg`
- `medicamentosCache`
- `medicamentoSelId`
- `medicamentosFiltroTimer`
- `medicamentosUltimoCliqueId`
- `medicamentosUltimoCliqueEm`

## Relação com receitas/prescrições
- O bloco de Medicamentos e usado indiretamente pelo editor de textos no assistente de receitas.
- O `frontend/app.js` contem a area de assistente de receitas com selecao de medicamento, prescricao e menu de medicamentos.
- Existem chamadas a rotas de assistente de receitas relacionadas a medicamentos.
- A prescricao aparece como texto de apoio no editor, mas esta etapa nao altera esse fluxo.

## Relação com impressão/editor de textos
- O editor de textos possui assistente de receitas e menu de medicamentos.
- Ha dependencia de Medicamentos para montar selecao, prescricao e exportacao de templates de receita.
- O `app.js` ainda contem o fluxo de UI do assistente de receitas, inclusive campos de medicamento e prescricao.

## Relação com anamnese
- A anamnese referencia medicamentos em perguntas e textos auxiliares.
- O `app.js` tambem possui blocos de anamnese que mencionam uso de medicamentos.
- Essa relacao e conceitual e nao deve ser movida nesta etapa.

## Relação com backend/API/banco
- O fluxo de Medicamentos continua dependente de `requestJson()` e de rotas backend.
- A documentacao anterior registrou os endpoints de lista, opcoes auxiliares, salvar, editar e excluir.
- A persistencia, o payload e o banco permanecem fora de escopo desta retomada documental.

## Possíveis helpers puros candidatos
- `normalizarTextoMedicamento(texto)`
- `validarNomeMedicamento(nome)`
- `validarGrupoMedicamento(grupo)`
- `compararTextoMedicamento(texto, termo)`

## Funções com cautela
- `medicamentosAbrir()`
- `medicamentosEnsureUI()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosAbrirModal(modo)`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosVincularEventos()`
- `medicamentosRender()`
- `medicamentosAplicarTab(tab)`
- `medicamentosSelecionarLinha(tr)`
- qualquer trecho que use `requestJson()`, `ensurePanelChrome()`, `ensureModalChrome()`, `menuEnsurePermission()`, `menuCloseAll()` ou `hideAllPanels()`

## Funções que NÃO devem ser movidas agora
- `medicamentosAbrir()`
- `medicamentosVincularEventos()`
- `medicamentosRender()`
- `medicamentosCarregarLista()`
- `medicamentosCarregarCombosModal()`
- `medicamentosCarregarFiltrosGrupo()`
- `medicamentosAbrirModal(modo)`
- `medicamentosSalvarModal()`
- `medicamentosExcluirSelecionado()`
- `medicamentosExcluirNoModal()`
- `medicamentosFecharModal()`
- `medicamentosSelecionarLinha(tr)`
- qualquer coisa ligada a `medicamentoSelId`
- qualquer coisa ligada a `medicamentosUltimoCliqueId` ou `medicamentosUltimoCliqueEm`
- qualquer bloco de assistente de receitas, impressao ou editor de textos
- qualquer bloco de anamnese relacionado a medicamentos

## Riscos de texto/mojibake
- A base documental e o frontend carregam textos visiveis que podem conter strings antigas ou mojibake.
- Esta etapa nao corrige acentuacao, labels, placeholders, mensagens ou simbolos.
- Nenhuma string foi normalizada neste documento alem da copia do que foi observado.

## Riscos funcionais
- O modulo ainda e monolitico em `app.js` para UI, eventos, lista, modal, salvamento e exclusao.
- O assistente de receitas compartilha contexto com medicamentos, entao uma extracao apressada pode afetar impressao e editor de textos.
- O uso de dupla detecao por tempo no clique da tabela e sensivel a regressao se movido antes da hora.
- Existem dependencias com menu, permissao e shell do app.

## Decisão recomendada
Manter Medicamentos em estado documental por enquanto e nao iniciar extração funcional nesta subetapa.

## Próxima etapa recomendada
Se houver continuidade, o melhor passo e criar um namespace passivo ou outra documentacao documental intermediaria, sem mover fluxo funcional, DOM, payload, salvamento ou rotas.

## Roteiro de teste futuro, se houver alteração funcional
1. Abrir `Cadastro > Medicamentos...`.
2. Confirmar carregamento do painel e da lista.
3. Filtrar por grupo e por nome.
4. Abrir o modal novo e o modal de edicao.
5. Validar salvar, excluir e duplo clique na tabela.
6. Confirmar que o assistente de receitas continua carregando medicamentos.
7. Executar `node --check` nos arquivos JS alterados.

