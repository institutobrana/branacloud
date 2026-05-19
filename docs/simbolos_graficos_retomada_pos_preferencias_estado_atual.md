# Símbolos Gráficos — Retomada pós-Preferências — Estado atual

## Objetivo

Consolidar o estado atual do módulo `Símbolos Gráficos` após o fechamento da rodada de `Preferências e Opções do Sistema`, identificando o que já foi trabalhado, o que continua no `app.js`, os riscos conhecidos e a melhor decisão conservadora para a sequência.

## Escopo

- Revalidar o histórico documental já existente sobre `Símbolos Gráficos`.
- Confirmar o estado atual do módulo JS passivo e do carregamento no HTML.
- Identificar helpers já delegados e funções sensíveis ainda concentradas no monólito.
- Registrar os riscos conhecidos, especialmente editor, modal, preview e `postMessage`.
- Recomendar a próxima subetapa sem mover código nesta etapa.

## Arquivos inspecionados

- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/js/modules/simbolos-graficos.js`
- `frontend/app.js`
- `frontend/index.html`

## Checks iniciais

- Branch atual verificada: `modularizacao-segura-fase-1`.
- O commit `ac32b48` aparece como HEAD desta linha de trabalho.
- `git status --short` mostra pendências preexistentes no repositório e o documento novo desta etapa.
- `git diff --stat` sem alterações novas de código nesta rodada documental.
- `git diff --cached --stat` sem diffs staged.
- Nenhum comando destrutivo ou de alteração de repositório foi executado.

## Base documental encontrada

| Documento | Papel aparente | Observação |
|---|---|---|
| `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md` | Mapeamento inicial do monólito | Confirma o histórico sensível do módulo e o risco do editor/iframe. |
| `docs/simbolos_graficos_subetapa_1_namespace_passivo.md` | Namespace passivo | Registra a criação do módulo JS passivo sem mover lógica funcional. |
| `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md` | Fronteiras e contratos | Delimita o que é seguro e o que é crítico no módulo. |
| `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md` | Helpers puros passivos | Primeiro bloco de helpers puros isolados. |
| `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md` | Integração de `normalizarTextoSimbolo` | Mostra wrapper/fallback mínimo em `app.js`. |
| `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md` | Integração de `ehSimboloSistema` | Consolida helper puro com fallback conservador. |
| `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md` | Integração de `urlImagemSimbolo` | Registra a ponte de imagem/base visual. |
| `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md` | Consolidação da rodada | Fecha o ciclo dos helpers puros já delegados até aqui. |

## Estado atual do módulo JS

O arquivo `frontend/js/modules/simbolos-graficos.js` existe e está em modo passivo. O conteúdo atual é um namespace simples, com metadados e helpers puros expostos em `window.BranaSimbolosGraficosModule`.

Estado observado:

- `meta` indica o módulo como passivo, sem fluxo assumido.
- `getInfo()` e `getStatus()` existem para inspeção/telemetria leve.
- Helpers expostos no módulo:
  - `normalizarTextoSimbolo`
  - `ehSimboloSistema`
  - `ocultarItemDaBiblioteca`
  - `compararBibliotecaPorCodigo`
  - `urlImagemSimbolo`
  - `validarTipoMarcaSimbolo`
- Não há DOM, `fetch`, `requestJson`, modal, editor, `iframe`, `canvas` ou `postMessage` dentro do módulo passivo.

## Estado atual do carregamento no index.html

O `frontend/index.html` já carrega o módulo antes de `frontend/app.js`.

Referência observada:

- `frontend/index.html:3931` carrega `/frontend/js/modules/simbolos-graficos.js`

Conclusão:

- o módulo não é novo;
- ele já está integrado no carregamento base da página;
- o `app.js` pode usá-lo como namespace passivo.

## Estado atual no frontend/app.js

O bloco de Símbolos Gráficos continua grande, com estado global, grade, modal, biblioteca, editor embarcado e fluxo de salvamento/exclusão.

Pontos atuais observados:

- `simbolosCfg`, `simbolosCache`, `simbolosBibliotecaCache`, `simbolosSelId` e `simbolosEspecialidadesMap` permanecem no estado global do `app.js`.
- `simbolosNormalizarTexto()` já delega para o módulo passivo.
- `simbolosEhSistema()` já delega para o módulo passivo.
- `simbolosImagemUrl()` já delega para o módulo passivo.
- `simbolosBibliotecaOculta()` e `simbolosCompararBiblioteca()` permanecem locais no `app.js`.
- As rotas de carregamento e persistência continuam no monólito.
- O modal, o editor, o preview e os eventos seguem centralizados no `app.js`.

## Funções/helpers já movidos ou delegados

Delegados no `app.js` para o módulo passivo:

- `simbolosNormalizarTexto` -> `window.BranaSimbolosGraficosModule.helpers.normalizarTextoSimbolo`
- `simbolosEhSistema` -> `window.BranaSimbolosGraficosModule.helpers.ehSimboloSistema`
- `simbolosImagemUrl` -> `window.BranaSimbolosGraficosModule.helpers.urlImagemSimbolo`

Disponíveis no módulo passivo, mas ainda não delegados no `app.js` nesta leitura:

- `ocultarItemDaBiblioteca`
- `compararBibliotecaPorCodigo`
- `validarTipoMarcaSimbolo`

## Funções sensíveis ainda no app.js

As funções abaixo continuam sensíveis e não devem ser tocadas nesta retomada documental:

- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`
- `simbolosExcluirModalAtual`
- `window.addEventListener("message", ...)`
- qualquer fluxo de editor
- qualquer fluxo de salvar/excluir
- qualquer manipulação de DOM
- qualquer comunicação com janela filha
- qualquer payload/API/backend

## Histórico de riscos conhecidos

O módulo tem histórico sensível já documentado:

- modal visual;
- editor tipo paint;
- abertura de editor filho;
- `postMessage`;
- possibilidade de tela preta no editor;
- preview;
- biblioteca visual;
- shapes/formas;
- dependência de `iframe` e janela filha;
- funções de salvar/excluir;
- comportamento visual delicado.

## O que NÃO mover agora

- `simbolosAbrirModal`
- `simbolosFecharModal`
- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosPersistirEdicao`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`
- `simbolosExcluirModalAtual`
- `window.addEventListener("message", ...)`
- qualquer fluxo de editor
- qualquer fluxo de salvar/excluir
- qualquer manipulação de DOM
- qualquer comunicação com janela filha
- qualquer payload/API/backend

## Riscos remanescentes

- O editor embarcado continua sendo a maior superfície de regressão.
- `message`/`postMessage` seguem como ponte sensível.
- O preview e a biblioteca ainda estão fortemente acoplados ao estado da modal.
- Há risco visual relevante se qualquer mexida avançar para o editor ou para o modal.
- O módulo ainda contém fluxo de salvar/excluir e persistência remota.

## Roteiro de teste recomendado

1. `Ctrl+F5`.
2. Abrir `Símbolos Gráficos`.
3. Confirmar abertura do modal/painel.
4. Conferir preview/biblioteca sem salvar.
5. Tentar abrir editor tipo paint somente se o escopo futuro permitir.
6. Não salvar/excluir nada em etapa documental.
7. Verificar console.

## Decisão recomendada

**Continuar com uma subetapa documental específica.**

Motivo:

- o módulo não está “zerado”; já existe um namespace passivo consolidado;
- os helpers puros já conhecidos estão separados do fluxo visual pesado;
- ainda há funções pequenas e puras remanescentes que podem ser reavaliadas com segurança maior do que mexer no editor;
- o bloco sensível deve continuar intocado até haver uma decisão bem delimitada sobre os helpers restantes.

## Próxima etapa recomendada

**Subetapa 8 documental específica para os helpers puros remanescentes da biblioteca, antes de qualquer código.**

Foco sugerido:

- `simbolosBibliotecaOculta`
- `simbolosCompararBiblioteca`
- validação final de se vale a pena seguir para `validarTipoMarcaSimbolo` ou pausar o módulo.

## Confirmação final

Nenhum código foi alterado nesta retomada documental. Não houve mudança em `frontend/app.js`, `frontend/index.html` ou no módulo passivo. Não houve alteração em backend, banco, payload, salvamento, permissões ou textos visíveis.
