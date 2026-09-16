# Fase G.4C.2 - Correção do preview do desenho no modal Altera

Data: 2026-08-05

## Objetivo
Corrigir exclusivamente a cadeia de origem do preview do desenho no modal `Altera` de `Configuracoes -> Simbolos graficos`, preservando o editor 15x15, a especialidade, a biblioteca-base e o CRUD.

## Regra aplicada
- o registro selecionado continua sendo a fonte inicial do modo de edicao;
- o campo real da imagem no registro passa por normalizacao antes de virar `src`;
- o preview usa URL valida e carregavel pelo navegador;
- o editor 15x15 nao foi alterado;
- o contrato de `X`, `Lapis`, `Especialidade` e `imagem_custom` foi preservado.

## Correcao implementada
- o modal agora normaliza a imagem de edicao com `normalizeAssetUrl`;
- o preview passou a usar `resolvedPreviewImageUrl` como fonte unica da imagem renderizada;
- a selecao da biblioteca passou a aceitar o codigo legado do registro quando o item completo nao vem resolvido;
- `editorInitialImage` passou a compartilhar a mesma URL normalizada do preview;
- a biblioteca-base continua vindo do mapper oficial e do manifesto estatico.

## Gate A - prova da causa
- no runtime autenticado, `Aplicação de flúor` entrou no modal `Altera` com `src` efetivo `\/app\/assets\/easy\/int_fluor.bmp`;
- antes da correção, a URL equivalente `\/desktop-assets\/easy\/int_fluor.bmp` retornava `404` no Vite dev;
- a cadeia real ficou visível por Playwright com `srcAttribute`, `src`, `currentSrc`, `complete`, `naturalWidth` e `naturalHeight` capturados no `<img>`;
- a primeira quebra comprovada estava na normalização da URL de preview, não na especialidade nem no editor.

## Gate B - correção mínima
- o normalizador passou a reescrever `\/desktop-assets\/easy\/<arquivo>` para `\/app\/assets\/easy\/<arquivo>`;
- o mapeamento da biblioteca e o preview do modal passaram a compartilhar a mesma origem resolvível pelo browser;
- a correção não alterou editor, `Especialidade`, `X` ou `imagem_custom`.

## Arquivos alterados
- `frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx`
- `frontend-react/src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js`
- `frontend-react/tests/simboloGraficoCreateModal.test.js`
- `frontend-react/tests/simboloGraficoPreviewRuntime.test.js`

## Testes executados
- `node --test frontend-react/tests/simboloGraficoCreateModal.test.js`
- `node --test frontend-react/tests/simboloGraficoPixelEditorUtils.test.js`

## Build executado
- `cmd /c npm.cmd run build`
- warning conhecido de chunk grande permaneceu

## Validacao runtime
- a tela local foi aberta em navegador automatizado;
- `Aplicação de flúor` carregou com `src` efetivo `\/app\/assets\/easy\/int_fluor.bmp`;
- `naturalWidth > 0` e `naturalHeight > 0` foram confirmados no browser;
- a resposta da imagem foi `200` com `Content-Type` de imagem;
- a cadeia de origem da imagem ficou normalizada no ponto de montagem do modal.

## Resultado
- G.4C.2 concluida tecnicamente;
- G.4C.2F homologada no preview do modal `Altera`;
- o preview do Altera agora exibe a figura real do registro selecionado;
- a proxima etapa funcional permanece em `G.4C.3`, sem antecipar a migracao do editor.
