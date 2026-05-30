# Decisao pos-validacao - Editor de Textos - Painel lateral / listagem visual

## 1. Objetivo da decisao

Definir o proximo passo da Fase 2C apos a validacao manual da implementacao do painel lateral/listagem visual do Editor de Textos, sem abrir novo recorte de implementacao nesta etapa documental.

## 2. Contexto da Fase 2C

- A Fase 2C continua sendo a frente de reducao controlada de monolitos com risco medio/medio-alto.
- O Editor de Textos ja acumulou tres extracoes reais validadas:
  - bootstrap/shell visual;
  - toolbar visual;
  - painel lateral/listagem visual.
- A sequencia foi documentada com commits e validacoes manuais aprovadas.

## 3. Implementacao validada

- Painel lateral/listagem visual do Editor de Textos.
- Commit da implementacao validada: `a405449`.
- Commit da validacao manual: `3f7b77b`.
- Relato do usuario: `TESTES PASSARAM, TUDO OK`.

## 4. Estado consolidado do Editor de Textos apos as tres extracoes reais

- `frontend/app.js` foi reduzido de forma real em tres pontos da rodada:
  - bootstrap/shell visual;
  - toolbar visual;
  - painel lateral/listagem visual.
- `frontend/app.js` agora atua como fachada mais curta e defensiva nos pontos extraidos.
- A logica extraida ficou concentrada em `frontend/js/modules/editor_textos_bootstrap.js`.
- `window.BranaEditorTextosToolbarModule` e `window.BranaEditorTextosPanelModule` foram expostos.
- O backup controlado foi criado na implementacao do painel lateral/listagem visual.

## 5. O que continua fora do recorte

- Salvamento.
- PDF.
- Assinatura.
- Payload.
- `requestJson`.
- Backend.
- Banco.
- Carga remota.
- Selecao funcional.
- Permissoes.
- Qualquer novo handler sensivel.

## 6. Riscos remanescentes

- O Editor de Textos ainda possui superfcies acopladas que podem encostar em fluxos sensiveis se novos recortes forem abertos sem fronteira clara.
- As areas de selecao funcional e carga remota permanecem fora do recorte e exigem contrato especifico caso voltem a ser alvo.
- Um novo passo apressado pode reduzir a seguranca da Fase 2C.

## 7. Avaliacao dos proximos candidatos

- CANDIDATO 1: continuar no Editor de Textos com contrato especifico para outro bloco visual complementar, somente se houver fronteira clara e reducao real de `frontend/app.js`.
- CANDIDATO 2: continuar no Editor de Textos com contrato especifico para acoes visuais simples, somente se nao tocar handlers sensiveis, model-first, reancoragem, TAB/Shift+Tab, salvamento, PDF, assinatura, payload, `requestJson`, backend ou banco.
- CANDIDATO 3: pausar momentaneamente o Editor de Textos e voltar para matriz operacional da Fase 2C para escolher outro modulo com reducao real de monolito.
- CANDIDATO 4: fazer revisao documental curta consolidando as tres extracoes reais do Editor de Textos antes de novo recorte.
- CANDIDATO 5: encerrar a rodada atual do Editor de Textos como consolidada e abrir matriz operacional curta para outro modulo.

## 8. Decisao final

`F2C-EDITOR-PAINEL-DEC-D`

## 9. Justificativa

- As tres extracoes reais do Editor de Textos ja validaram a frente de forma conservadora.
- Abrir novo recorte agora ainda pode tocar areas sensiveis sem necessidade imediata.
- A melhor postura neste ponto e consolidar a rodada atual com revisao documental curta antes de qualquer novo recorte.

## 10. Proxima etapa recomendada

Fazer uma revisao documental curta consolidando as tres extracoes reais do Editor de Textos antes de novo recorte.

## 11. Commit seletivo obrigatorio

Se esta decisao for confirmada, o commit deve incluir apenas:

- `docs/fase_2c_editor_textos_decisao_pos_validacao_painel_lateral_listagem_visual.md`
- `docs/11_roadmap_desenvolvimento.md`

## 12. Registro para roadmap

- Decisao pos-validacao do painel lateral/listagem visual do Editor de Textos.
- Commit da implementacao validada: `a405449`.
- Commit da validacao manual: `3f7b77b`.
- Relato do usuario: `TESTES PASSARAM, TUDO OK`.
- Decisao final: `F2C-EDITOR-PAINEL-DEC-D`.
- Proxima etapa recomendada: revisao documental curta consolidando as tres extracoes reais antes de qualquer novo recorte.
- Confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
