# Fase 2C - Decisao pos-validacao do bootstrap/shell visual do Editor de Textos

## 1. Objetivo da decisao

- Registrar a decisao posterior a validacao da primeira implementacao real da Fase 2C no Editor de Textos.
- Definir se a proxima reducao deve continuar no proprio Editor de Textos ou voltar para a matriz operacional.

## 2. Decisao de origem

- Decisao de origem: `F2C-MATRIZ-D`.

## 3. Implementacao validada

- Fluxo validado: `Editor de Textos - separacao inicial de bootstrap/shell visual`.
- Documento da implementacao: `docs/fase_2c_editor_textos_implementacao_bootstrap_shell_visual.md`
- Commit da implementacao: `8e16fd3`

## 4. Commit da validacao manual

- Commit da validacao manual: `3d5b2c8`

## 5. Relato do usuario

- Relato do usuario: `testes passaram, tudo ok, nao encontrei problemas`.

## 6. Estado consolidado do Editor de Textos apos a extracao

- A primeira reducao real da Fase 2C foi concluida e validada manualmente.
- `frontend/app.js` foi reduzido de forma real.
- `editorTextosEnsureUI()` deixou de concentrar o grande bloco inicial de bootstrap/shell visual.
- `frontend/js/modules/editor_textos_bootstrap.js` passou a assumir o bootstrap/base visual inicial.
- O Editor de Textos permanece funcionalmente aberto para novas reducoes pequenas, desde que com contrato especifico.

## 7. O que foi reduzido em frontend/app.js

- A funcao `editorTextosEnsureUI()` foi enxugada.
- O grande bloco inicial de `Object.assign(...)` e preparação do shell visual deixou de morar em `frontend/app.js`.
- A fachada ficou mais fina, delegando a inicializacao base ao modulo passivo.

## 8. O que foi movido ou concentrado em frontend/js/modules/editor_textos_bootstrap.js

- Inicializacao visual/base do Editor de Textos.
- Preparacao de estado base do shell.
- Criacao do model inicial quando a factory e fornecida.
- Populacao do combo inicial do modal de abertura.
- Aplicacao do bootstrap visual dos modais com `ensureChromeDraggable`, quando disponivel.

## 9. O que continua fora do recorte

- Salvamento.
- PDF.
- Assinatura.
- Payload.
- `requestJson`.
- Backend.
- Banco.
- Permissoes.
- `frontend/index.html`.
- Editor de conteudo rico, anexos, impressao e demais fluxos sensiveis.

## 10. Riscos remanescentes

- O Editor de Textos continua sendo um monolito grande.
- A inicializacao visual agora depende mais do modulo passivo.
- Uma nova extracao pode encostar em toolbar, acoes, carregamento ou areas sensiveis se nao houver contrato especifico.

## 11. Avaliacao dos proximos candidatos de extracao real

- CANDIDATO 1: novo recorte de bootstrap/shell visual complementar.
  - Viavel apenas se existir bloco claro ainda delegado em `frontend/app.js`.
  - Risco: medio.
- CANDIDATO 2: recorte de toolbar/acoes visuais.
  - Tem fronteira mais clara e teste manual simples.
  - Risco: medio.
- CANDIDATO 3: recorte de painel lateral/listagem visual.
  - Possivel, mas deve evitar carregamento remoto sensivel, salvamento, PDF, assinatura ou payload.
  - Risco: medio-alto.
- CANDIDATO 4: pausar o Editor de Textos e voltar para a matriz operacional da Fase 2C.
  - Menor risco imediato, menor ganho de reducao.
- CANDIDATO 5: abrir contrato especifico do proximo recorte antes de qualquer nova implementacao.
  - E a forma adequada de prosseguir se a frente continuar.

## 12. Decisao final

- Decisao registrada: `F2C-EDITOR-DEC-B`
- Interpretacao: continuar no Editor de Textos com novo contrato especifico para toolbar/acoes visuais.
- Justificativa:
  - a frente ja teve reducao real aprovada;
  - o próximo passo ainda pode reduzir `frontend/app.js` de forma real;
  - toolbar/acoes visuais oferece fronteira mais clara que retornar imediatamente à matriz;
  - a continuidade permanece dentro do mesmo modulo, sem abrir backend, banco, salvamento, PDF ou assinatura.

## 13. Proxima etapa recomendada

- Abrir um contrato especifico para toolbar/acoes visuais do Editor de Textos antes de qualquer nova implementacao.
- Nao iniciar implementacao direta sem o novo documento/contrato.

## 14. Commit seletivo obrigatorio

- Arquivos que devem entrar no commit, se alterados:
  - `docs/fase_2c_editor_textos_decisao_pos_validacao_bootstrap_shell_visual.md`
  - `docs/11_roadmap_desenvolvimento.md`

## 15. Registro para roadmap

- A primeira implementacao real da Fase 2C foi validada manualmente.
- Modulo: Editor de Textos.
- Fluxo validado: bootstrap/shell visual.
- Commit da implementacao: `8e16fd3`.
- Commit da validacao manual: `3d5b2c8`.
- Relato do usuario: `testes passaram, tudo ok, nao encontrei problemas`.
- A decisão final registrada foi `F2C-EDITOR-DEC-B`.
- A proxima etapa recomendada e abrir um contrato especifico para toolbar/acoes visuais antes de qualquer nova implementacao.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A blindagem textual/mojibake foi respeitada.

