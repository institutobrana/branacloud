# Simbolos Graficos - Subetapa 0 - Diagnostico de `validarTipoMarcaSimbolo(valor)`

## 1. Objetivo da Subetapa 0

Mapear o estado atual do modulo Simbolos Graficos e avaliar de forma conservadora o helper `validarTipoMarcaSimbolo(valor)`, sem alterar codigo, texto visivel, HTML, backend, banco, seeds, roadmap ou comportamento funcional.

## 2. Confirmacao de que Simbolos Graficos ja havia sido iniciado

Confirmado. Simbolos Graficos nao e um modulo novo. Ele ja possui historico documental proprio, namespace passivo e arquivo modular existente.

## 3. Arquivo modular existente identificado

- `frontend/js/modules/simbolos-graficos.js`

O arquivo existe e esta carregado na pagina antes de `frontend/app.js`.

## 4. Documentos anteriores encontrados sobre Simbolos Graficos

Documentos encontrados e considerados nesta retomada:

- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md`
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md`
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md`
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md`
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md`
- `docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md`
- `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md`
- `docs/simbolos_graficos_retomada_pos_preferencias_estado_atual.md`
- `docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `docs/reavaliacao_pos_fechamento_simbolos_graficos_proximo_modulo.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`

Documentos de contexto geral tambem consultados:

- `README.md`
- `README_WEB.md`
- `backend/README.md`
- `docs/00_master_guide.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/recomendacao_proximo_modulo_pos_pausa_usuarios_admin.md`

## 5. Historico de riscos e problemas ja registrados nesse modulo

Os documentos anteriores registram repetidamente os seguintes riscos:

- editor visual embarcado;
- `iframe`;
- `postMessage` e listener global de `message`;
- risco de tela preta no editor;
- modal proprio e backdrops;
- biblioteca visual e preview;
- salvamento e exclusao;
- selecao, clique, duplo clique e `bindStandardGridActivation`;
- duplicidade/reescrita tardia de blocos no `frontend/app.js`;
- dependencia de consumidores externos, principalmente Procedimentos e Procedimentos Genericos;
- sensibilidade textual protegida pela blindagem de mojibake.

Os registros anteriores tambem marcam `simbolosBibliotecaOculta` e `simbolosCompararBiblioteca` como remanescentes da biblioteca, com cuidado extra para ordenacao/visibilidade visual.

## 6. Estado atual de `frontend/app.js` relacionado a Simbolos Graficos

O `frontend/app.js` continua concentrando o fluxo funcional principal do modulo. O que permanece ali, em alto nivel:

- abertura da tela;
- criacao de UI;
- listagem e renderizacao;
- selecao de linha;
- biblioteca e preview;
- modal;
- editor visual;
- salvar e excluir;
- eventos e binds;
- integracao com backend;
- contrato de `tipo_marca` no fluxo de persistencia.

Pontos observados no arquivo:

- `simbolosNormalizarTexto` usa wrapper para o helper passivo `normalizarTextoSimbolo`;
- `simbolosEhSistema` usa wrapper para o helper passivo `ehSimboloSistema`;
- `simbolosImagemUrl` usa wrapper para o helper passivo `urlImagemSimbolo`;
- `simbolosBibliotecaOculta` e `simbolosCompararBiblioteca` continuam no `app.js`;
- `simbolosTipoMarcaPorTexto`, `simbolosTipoMarcaSelecionado` e `simbolosSetModalForma` continuam no `app.js`;
- a persistencia usa `tipo_marca` no payload;
- nao foi encontrado wrapper/fallback local para `validarTipoMarcaSimbolo(valor)`.

## 7. Estado atual de `frontend/js/modules/simbolos-graficos.js`

O modulo passivo existe e continua em modo conservador.

O arquivo exposto em `window.BranaSimbolosGraficosModule` contem:

- `meta`;
- `getInfo()`;
- `getStatus()`;
- `normalizarTextoSimbolo`;
- `ehSimboloSistema`;
- `ocultarItemDaBiblioteca`;
- `compararBibliotecaPorCodigo`;
- `urlImagemSimbolo`;
- `validarTipoMarcaSimbolo`.

Estado tecnico observado:

- nao usa DOM;
- nao usa `fetch`;
- nao usa `requestJson`;
- nao registra eventos;
- nao abre modal;
- nao abre editor;
- nao usa `iframe`;
- nao usa `canvas`;
- nao usa `postMessage`;
- nao altera estado global do aplicativo.

## 8. Localizacao atual de `validarTipoMarcaSimbolo(valor)`

Localizacao confirmada:

- definido em `frontend/js/modules/simbolos-graficos.js`, linha 71;
- exportado em `window.BranaSimbolosGraficosModule.helpers.validarTipoMarcaSimbolo`;
- carregado na pagina por `frontend/index.html`, linha 3931;
- nao encontrado como definicao propria em `frontend/app.js`;
- nao encontrado como wrapper/fallback local em `frontend/app.js`.

## 9. Avaliacao se `validarTipoMarcaSimbolo(valor)` e helper puro

Sim. A funcao e um helper puro de validacao/apresentacao.

Motivos:

- converte a entrada para string;
- aplica `trim()` e `toLowerCase()`;
- retorna apenas `""`, `"sistema"` ou `"usuario"`;
- nao acessa DOM;
- nao faz I/O;
- nao altera estado;
- nao chama API;
- nao monta payload;
- nao salva;
- nao exclui;
- nao depende de modal, editor, preview, biblioteca ou `postMessage`.

Conclusao tecnica:

- helper puro;
- deterministico;
- baixo acoplamento;
- baixo risco intrinseco.

## 10. Classificacao de risco do recorte

Classificacao do helper em si: **baixo**.

Observacao importante:

- o helper e baixo risco como unidade isolada;
- o risco sobe para **baixo a medio** apenas se houver futura integracao no fluxo de modal/payload, porque o contrato de `tipo_marca` ainda passa por campos visuais e persistencia.

## 11. O que deve ficar explicitamente fora da proxima etapa

Fora do proximo passo devem permanecer:

- editor visual;
- `iframe`;
- `postMessage` e `message`;
- modal inteiro;
- biblioteca visual;
- preview;
- salvar;
- excluir;
- carregamento/listagem;
- renderizacao;
- selecao;
- `bindStandardGridActivation`;
- clique e duplo clique;
- backend;
- banco;
- seeds;
- qualquer correcao textual ou de mojibake;
- qualquer alteracao em `frontend/app.js`, `frontend/index.html` ou `frontend/js/modules/simbolos-graficos.js`.

## 12. Recomendacao da proxima subetapa

Recomendacao: **pausar**.

Motivo:

- o helper ja esta extraido no modulo passivo;
- nao existe wrapper/fallback em `frontend/app.js` para ele;
- nao existe consumo direto por nome no `app.js`;
- os fluxos sensiveis do modulo continuam concentrados em modal, editor, preview, biblioteca, salvar e excluir;
- neste momento nao ha justificativa para ampliar o recorte funcional.

## 13. O que deve entrar no commit depois desta etapa documental

Se esta etapa fosse consolidada em commit, deveria entrar apenas:

- este documento documental;
- nenhuma alteracao de codigo;
- nenhum ajuste em HTML, backend, banco, seeds, roadmap ou textos visiveis.

## 14. O que deve entrar no roadmap se houver futura extracao real

Se houver futura integracao ou reutilizacao real de `validarTipoMarcaSimbolo(valor)`, o roadmap deve registrar apenas:

- qual helper foi usado;
- que o helper e puro e pequeno;
- que a mudanca nao tocou backend, banco, seeds ou permissao;
- que o risco ficou restrito ao contrato de `tipo_marca` no modulo de Simbolos Graficos;
- onde validar manualmente depois da alteracao.

## 15. Onde testar depois de uma futura alteracao de codigo

Teste manual recomendado:

1. Abrir `Simbolos Graficos`.
2. Conferir abertura do modal.
3. Validar selecao de `tipo_marca`.
4. Conferir `Novo` e `Alterar`.
5. Conferir preview e biblioteca.
6. Abrir o editor apenas se o recorte futuro tocar essa area.
7. Observar o console.
8. Confirmar que salvar/excluir continuam sem regressao.

## 16. Checks executados

- `git branch --show-current`
- `git status --short`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/simbolos-graficos.js`

Resultado dos checks:

- branch atual: `modularizacao-segura-fase-1`;
- `git status --short` mostrou pendencias preexistentes fora do escopo desta etapa;
- `node --check frontend/app.js` passou;
- `node --check frontend/js/modules/simbolos-graficos.js` passou.

## 17. Confirmacoes finais

- nenhum codigo foi alterado;
- `frontend/app.js` nao foi alterado;
- `frontend/index.html` nao foi alterado;
- `frontend/js/modules/simbolos-graficos.js` nao foi alterado;
- backend, banco e seeds nao foram alterados;
- roadmap nao foi alterado;
- textos visiveis e mojibake foram preservados;
- nao houve `git add`, `git commit` ou `git push`.
