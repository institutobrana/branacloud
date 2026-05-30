# Fase 2C - Revisao curta da rodada inicial do Editor de Textos

## 1. Objetivo da revisao curta

Consolidar a rodada inicial da Fase 2C no Editor de Textos, registrando as duas extracoes reais ja validadas, o que foi reduzido em `frontend/app.js`, o que foi concentrado no modulo passivo e quais criterios devem orientar o proximo recorte.

## 2. Contexto da Fase 2C

- A Fase 2C continua sendo uma frente de reducao controlada de monolitos com risco medio/medio-alto.
- A rodada atual ficou centrada no Editor de Textos.
- As duas extracoes reais da rodada ja foram implementadas e validadas manualmente:
  - bootstrap/shell visual;
  - toolbar visual.

## 3. Motivo da revisao

- Decisao de origem: `F2C-EDITOR-TOOLBAR-DEC-E`
- A decisao pos-validacao da toolbar visual recomendou revisao documental curta antes de qualquer novo recorte.
- Esta revisao serve para consolidar a rodada inicial antes de abrir uma nova fronteira.

## 4. Linha do tempo da rodada do Editor de Textos

1. A Fase 2C foi iniciada com a matriz operacional de reducao de monolitos.
2. Foi validada a primeira implementacao real: separacao inicial de bootstrap/shell visual.
3. Foi validada a extracao da atualizacao visual da toolbar.
4. Foi registrada a decisao pos-validacao da toolbar visual.
5. Agora a rodada inicial e consolidada por revisao documental curta.

## 5. Extracao 1: bootstrap/shell visual

- Fluxo validado: `Editor de Textos - separacao inicial de bootstrap/shell visual`
- Commit da implementacao: `8e16fd3`
- Commit da validacao manual: `3d5b2c8`
- Resultado: `testes passaram, tudo ok, nao foram encontrados problemas`
- Impacto principal:
  - o grande bloco inicial de bootstrap/shell visual saiu de `frontend/app.js`;
  - `frontend/js/modules/editor_textos_bootstrap.js` assumiu a preparacao base do Editor de Textos;
  - a fachada em `frontend/app.js` ficou mais fina.

## 6. Extracao 2: toolbar visual

- Fluxo validado: extracao da atualizacao visual da toolbar do Editor de Textos
- Commit da implementacao: `27e990d`
- Commit da validacao manual: `eb70773`
- Resultado: `PASSOU SEM PROBLEMAS`
- Impacto principal:
  - os corpos de atualizacao visual da toolbar e do agendamento sairam do monolito;
  - `frontend/app.js` passou a delegar a atualizacao visual;
  - `window.BranaEditorTextosToolbarModule` foi exposto pelo bootstrap do Editor de Textos.

## 7. Commits de implementacao e validacao

- Implementacao bootstrap/shell visual: `8e16fd3`
- Validacao bootstrap/shell visual: `3d5b2c8`
- Decisao pos-validacao bootstrap/shell visual: `56e245b`
- Implementacao toolbar visual: `27e990d`
- Validacao toolbar visual: `eb70773`
- Decisao pos-validacao toolbar visual: `a332f80`

## 8. Backups criados

- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/`

Arquivos copiados no backup da toolbar visual:

- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/app.js`
- `backups_modularizacao/fase_2c/editor_textos_toolbar_visual/frontend/js/modules/editor_textos_bootstrap.js`

## 9. Reducoes reais feitas em `frontend/app.js`

- O bloco grande de bootstrap inicial foi enxugado.
- A atualizacao visual da toolbar foi deslocada para o modulo passivo.
- O agendamento da sincronizacao visual da toolbar deixou de ficar concentrado no monolito.
- `frontend/app.js` permaneceu como fachada/wrapper defensiva para os nomes publicos antigos.

## 10. O que foi concentrado em `frontend/js/modules/editor_textos_bootstrap.js`

- Bootstrap/base visual inicial do Editor de Textos.
- Preparacao do shell.
- Estado inicial do editor.
- Helpers visuais da toolbar.
- Namespace passivo `window.BranaEditorTextosToolbarModule`.

## 11. O que permanece no `app.js`

- Fachada/wrapper das funcoes publicas.
- Delegacao defensiva para o modulo passivo.
- Fallback local minimo quando aplicavel.
- Acesso aos handlers e fluxos sensiveis que nao foram tocados nesta rodada.

## 12. O que continua proibido sem contrato especifico

- salvamento
- PDF
- assinatura
- payload
- `requestJson`
- backend
- banco
- permissões
- handlers de edicao sensiveis
- model-first
- reancoragem
- TAB/Shift+Tab

## 13. Riscos remanescentes

- O Editor de Textos continua amplo e com varias superficies acopladas.
- Novos recortes ainda podem encostar em selecao/caret, comandos de edicao ou fluxos sensiveis se nao houver contrato bem definido.
- A rodada atual prova reducao real, mas nao esgota o monolito.

## 14. Criterios para decidir o proximo recorte

- precisa haver fronteira visual clara;
- precisa haver reducao real de `frontend/app.js`;
- nao pode tocar em salvamento, PDF, assinatura, payload, `requestJson`, backend ou banco;
- deve haver backup obrigatorio antes de alterar codigo;
- deve haver teste manual claro e documento de validacao;
- se a fronteira ficar ambigua, a pausa ou a nova matriz operacional e a melhor escolha.

## 15. Candidatos possiveis para proxima etapa

### Candidato 1

- Contrato especifico para painel lateral/listagem visual.

### Candidato 2

- Contrato especifico para outro bloco visual complementar.

### Candidato 3

- Contrato especifico de acoes visuais simples, sem tocar handlers sensiveis.

### Candidato 4

- Pausar a rodada do Editor de Textos e voltar para matriz operacional da Fase 2C.

### Candidato 5

- Encerrar a rodada inicial do Editor de Textos como consolidada e abrir nova matriz operacional curta.

## 16. Recomendacao final

- Encerrar a rodada inicial do Editor de Textos como consolidada e abrir uma nova matriz operacional curta.
- A rodada atual ja entregou duas reducoes reais validadas e merece ser encerrada documentalmente antes de novo recorte.

## 17. Proximo documento obrigatorio

- Documento de nova matriz operacional curta da Fase 2C, para escolher o proximo modulo ou a proxima fronteira com novo contrato.

## 18. Commit seletivo obrigatorio

Arquivos alvo do commit seletivo desta etapa:

- `docs/fase_2c_editor_textos_revisao_curta_rodada_inicial.md`
- `docs/11_roadmap_desenvolvimento.md`

## 19. Registro para roadmap

Registrar no roadmap:

- revisao documental curta da rodada inicial do Editor de Textos na Fase 2C;
- extracoes reais ja validadas;
- commits principais;
- decisao final `F2C-EDITOR-REV-E`;
- proxima etapa recomendada;
- confirmacao de que nenhum codigo ou banco foi alterado nesta etapa documental.
