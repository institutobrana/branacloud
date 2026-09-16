# Editor de Textos — auditoria visual comparativa R4

## Escopo e resultado

Esta auditoria é somente visual. Nenhum arquivo funcional foi alterado e nenhuma validação de API, lifecycle, backend ou banco foi reaberta.

Referência: módulo **Convênios e Planos**, modal **Novo convênio**.

Alvos: modal **Abrir modelo** e modal **Novo texto** do Editor de Textos.

## Evidências e arquivos

### Referência

- `frontend-react/src/features/conveniosPlanos/modals/ConvenioModal.jsx`
- `frontend-react/src/features/conveniosPlanos/conveniosPlanos.css`
- `frontend-react/src/components/BranaModal.jsx`
- `frontend-react/src/theme/branaTokens.css`
- `frontend-react/src/styles/globals.css`

O componente usa `BranaModal`, `Tabs`, `Alert` e `Button` do Ant Design. O contrato visual específico usa `rootClassName="convenios-planos-convenio-modal-root"` e `width={560}`.

### Editor

- `frontend-react/src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx`
- `frontend-react/src/features/editorTextos/styles/editorTextos.css`

Os dois modais do Editor são componentes HTML próprios: `div` backdrop, `section` dialog, `input`, `select`, `button`, `table` e radio nativo. Não usam `BranaModal`, `Modal`, `Input`, `Select`, `Radio`, `Table` ou `Button` do Ant Design.

## Valores concretos da referência

### Modal Novo convênio

| Propriedade | Evidência | Valor |
|---|---|---|
| largura | `ConvenioModal.jsx` | `560px` |
| largura máxima | CSS responsivo | `calc(100vw - 24px)` em viewport até 680px |
| altura | Ant Modal + conteúdo | automática pelo conteúdo |
| raio | `.ant-modal-content` | `4px` |
| sombra/borda | Ant Design + wrapper | não sobrescritas no módulo; borda/sombra vêm do `BranaModal`/Ant Design |
| header | `conveniosPlanos.css:57` | `padding: 10px 14px 8px` |
| título | `:58` | `15px / 20px`, cor `var(--brana-text-primary)` |
| body | `:56` | `padding: 8px 10px 10px` |
| footer | `:120` | `padding: 7px 14px 9px`, fundo `#f5f0e6` |
| footer | `ConvenioModal.jsx` | alinhamento à direita, gap `6px` |
| campos | `:68–73` | label `11px/14px`; inputs/selects `25px`, fonte `11px` |
| gap vertical | `:67–68` | pane `gap:3px`, field `gap:2px` |
| tabs | `:61–65` | nav `42px`; tabs `38px`, fonte `12px` |

### Cores da referência

| Papel | Token/CSS | Light efetivo | Dark efetivo |
|---|---|---:|---:|
| fundo do modal | CSS local | `#f5f0e6` | `#142225` |
| fundo de campos | token Ant/tema | `#ffffff` por `--brana-surface-card` | `#142225` |
| texto primário | `--brana-text-primary` | `#163328` | `#e6f0f1` |
| texto secundário | `--brana-text-secondary` | `#808285` | `#a6b0b2` |
| borda sutil | `--brana-border-subtle` | `#d9dfd4` | `#314447` |
| borda padrão | `--brana-border-default` | `#c8d1c8` | `#3b4d4f` |
| teal primário | `--brana-teal` | `#00a79d` | `#00a79d` |
| superfície modal global | `--brana-surface-modal` | `#ffffff` | `#142225` |

Observação: o módulo Convênios força o fundo claro `#f5f0e6` no tema claro e força `#142225` no dark. Isto é diferente do token global de modal claro.

### Tipografia

O módulo não define `font-family`; herda a tipografia global/Ant Design. Os overrides locais são: título `15px/20px`; labels `11px/14px`; campos e seleção `11px`; tabs `12px`; botões Ant Design sem override de família. Não há evidência de herança da fonte do documento Tiptap para o modal.

## Estado atual dos modais do Editor

Após o ajuste R2, o CSS local declara:

| Propriedade | Abrir modelo/Novo texto atual |
|---|---|
| largura | Abrir `min(680px, calc(100vw - 32px))`; Novo `min(390px, calc(100vw - 32px))` |
| raio | `4px` |
| padding | `10px 14px 9px` |
| fundo | `var(--brana-surface-panel, #f5f0e6)`; dark override `#142225` |
| título | `15px/20px`, peso `600` |
| input/select | `25px`, fonte `11px`, padding horizontal `7px`, raio `4px` |
| label/filtros | `11px/14px`, gap `2px`/`6px` |
| botão | `25px`, fonte `11px`, padding horizontal `10px`, raio `4px` |
| footer | gap `6px`, padding superior `7px` |
| tabela | células `25px`, fonte `11px`, padding horizontal `8px`, raio do frame `4px` |

O browser confirmou visualmente os dois modais compactos, com filtros horizontais, tabela com scroll, lista de cinco tipos e footer compacto. A confirmação foi feita no runtime HTTPS já existente; o modal Novo convênio não foi aberto no browser nesta rodada, portanto valores do modal de referência vêm do código e dos tokens, não de inspeção computada no DevTools.

## Matriz: Abrir modelo

| Propriedade | Referência Novo convênio | Atual Abrir modelo | Match | Severidade | Recomendação futura |
|---|---|---|---|---|---|
| componente | `BranaModal`/Ant | HTML custom | Não | P1 | Avaliar wrapper compartilhado somente com testes de eventos |
| largura | 560px | 680px | Não | P1 | Aproximar de 560–620px se a grade continuar legível |
| raio | 4px | 4px | Sim | — | Manter |
| sombra/borda | Ant/wrapper | CSS custom | Parcial | P2 | Usar tokens/wrapper comum se seguro |
| header/título | header separado, 10/14/8, 15px | h2 dentro do body, 10/14/9, 15px | Parcial | P1 | Separar semanticamente header sem mudar fluxo |
| fundo | `#f5f0e6` claro, `#142225` dark | token panel + dark override | Parcial | P2 | Confirmar token efetivo no tema claro |
| body padding | 8/10/10 | 10/14/9 | Não | P2 | Aproximar do padrão de body |
| labels | 11px/14px | 11px/14px | Sim | — | Manter |
| Nome input | Ant Input, 25px | input HTML, 25px | Parcial | P1 | Só trocar após validar preservação do filtro |
| Tipo select | Ant Select, 25px | select HTML, 25px | Parcial | P1 | Só trocar após validar valores e refresh |
| Atualiza | Ant Button | button HTML teal, 25px | Parcial | P1 | Avaliar Button compartilhado |
| grid header | tabela Ant/tema; 32px no módulo | tabela HTML; 25px | Não | P1 | Definir se 25px é aceitável para leitura |
| grid rows | tabela do sistema; 32px | HTML; 25px | Não | P1 | Comparar densidade com tabela real do módulo |
| selected row | tokens globais de tabela | `surface-muted/#eef7f6` | Não | P1 | Usar `--brana-surface-table-row-selected` |
| footer | Ant Modal footer | div custom | Parcial | P1 | Usar Button/Modal footer sem alterar handlers |
| dark mode | override explícito do módulo | override apenas do dialog | Parcial | P2 | Mapear header, grid e inputs também |

## Matriz: Novo texto

| Propriedade | Referência Novo convênio | Atual Novo texto | Match | Severidade | Recomendação futura |
|---|---|---|---|---|---|
| componente | `BranaModal`/Ant | HTML custom | Não | P1 | Avaliar apenas em fase própria |
| largura | 560px | 390px | Não literal | P2 | Manter compacta; conteúdo é menor |
| raio | 4px | 4px | Sim | — | Manter |
| sombra/borda | Ant/wrapper | CSS custom | Parcial | P2 | Alinhar ao wrapper se seguro |
| header/título | header separado, 15px | h2 custom, 15px | Parcial | P1 | Padronizar sem mover estado |
| body/fundo | `#f5f0e6`/padding 8/10/10 | panel token/padding 10/14/9 | Parcial | P2 | Confirmar token efetivo |
| radio | referência não possui radio | input radio nativo, 14px | Não aplicável | P2 | Buscar Radio do design system antes de trocar |
| radio labels | labels 11px | labels 11px/14px, gap 5px | Parcial | P2 | Manter até referência direta existir |
| type list | referência não possui listbox | select nativo size 5, 128px | Não aplicável | P1 | Comparar com lista React existente antes de trocar |
| selected item | não aplicável | seleção nativa do select | Não aplicável | P2 | Não alterar sem componente equivalente |
| list border | não aplicável | border token, raio 4px | Não aplicável | P2 | Manter comportamento nativo |
| footer | Ant Button/footer | div/button custom | Parcial | P1 | Avaliar Button Ant somente com regressão |
| dark mode | override explícito | dialog dark, controles herdados | Parcial | P1 | Validar inputs/lista no dark |

## Matriz de componentes

| Elemento | Referência | Editor atual | Troca funcionalmente segura? | Motivo |
|---|---|---|---|---|
| modal | `BranaModal` | `section` custom | Requer validação | foco, Escape, backdrop e lifecycle diferem |
| input | Ant Input | HTML input | Requer validação | filtro depende de `onChange` e valor controlado |
| select tipo | Ant Select | HTML select | Requer validação | valores e refresh dependem do evento atual |
| radio | Ant/React design system não usado no Convênio | HTML radio | Requer validação | branch Novo usa estado local |
| lista | sem equivalente no modal referência | select `size=5` | Requer validação | seleção e disabled têm contrato próprio |
| grid | tabelas Ant no módulo | table HTML custom | Requer validação | seleção, duplo clique e menu contextual |
| botões | Ant `Button` | HTML button | Requer validação | handlers são simples, mas foco/disabled devem ser preservados |

## Light mode / dark mode

### Light

`Novo convênio` usa fundo local `#f5f0e6`; o Editor usa fallback equivalente, mas quando `--brana-surface-panel` está definido o valor efetivo é o token global `#ffffff`. Portanto há uma divergência concreta de fundo em light mode: o fallback do Editor não prevalece sobre o token.

`Novo convênio` usa campos brancos e texto `#163328`; o Editor usa `--brana-surface-card` e `--brana-text-primary`, que resolvem para os mesmos valores globais. Bordas do Editor usam tokens compatíveis.

### Dark

O modal do Convênio força `#142225` para conteúdo, header, body e footer. O Editor força `#142225` somente no container `.editor-textos-dialog`; inputs, select e tabela usam tokens globais e devem ser validados visualmente antes de qualquer ajuste.

## Font leak

`EDITOR_MODAL_FONT_LEAK = PROVEN_ABSENT` quanto à fonte do documento: o CSS do Editor define `font: inherit` nos campos e não há regra que leia a família do `.ProseMirror`. A família efetiva global não foi materialmente sobrescrita pelo documento editado. A auditoria não identificou regra serif específica nos modais.

## Divergências priorizadas

### Abrir modelo

- P0: nenhuma divergência que impeça uso.
- P1: largura maior que a referência; HTML custom em vez de componentes Brana/Ant; tabela/seleção/footer não usam tokens/componentes de tabela do sistema; dark mode parcial.
- P2: diferença de padding e fundo claro efetivo; sombra/borda não vêm do mesmo wrapper.
- P3: diferenças cosméticas de scrollbar e microtipografia.

### Novo texto

- P0: nenhuma divergência que impeça uso.
- P1: HTML custom em vez de modal/footer/componentes Ant; dark mode dos controles não foi uniformizado.
- P2: largura intencionalmente menor; radio/lista não têm referência direta no modal Convênio; padding difere em 2–6px.
- P3: microajustes de seleção nativa e scrollbar.

## Plano de correção futuro — não executado

1. Confirmar valores computados em light/dark com os três modais abertos.
2. Definir se a largura de Abrir modelo deve convergir para 560px ou permanecer maior por causa das três colunas.
3. Harmonizar tokens de fundo, borda, texto e selected row.
4. Avaliar substituição isolada de `button` por Ant `Button`, mantendo handlers e disabled.
5. Avaliar `Input`/`Select` somente com testes de filtro, Atualiza, seleção e dirty.
6. Harmonizar tabela e footer; preservar duplo clique e menu contextual.
7. Validar dark mode e viewport menor.

## Arquivos previstos para futura alteração

```text
frontend-react/src/features/editorTextos/styles/editorTextos.css
frontend-react/src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx  # somente se troca de componente for aprovada
```

Não alterar arquivos de Convênios e Planos.

## Contratos preservados nesta auditoria

`OPEN` functionality, `NEW` functionality, document lifecycle, API, backend e database não foram alterados. O blocker permanece:

```text
NEW_MODAL_TYPE_BEHAVIOR = FAIL_PREEXISTING_BLOCKER
```

## Fechamento

```text
REFERENCE_STYLE_VALUES_CAPTURED = PASS
REFERENCE_COMPONENTS_CAPTURED = PASS
COMPONENT_DIFFERENCE_MATRIX = PASS
LIGHT_MODE_REFERENCE_MATCH_MATRIX = PASS
DARK_MODE_REFERENCE_MATCH_MATRIX = PASS
FUNCTIONAL_CODE_CHANGED = NÃO
CSS_CHANGED = NÃO
REACT_COMPONENT_CHANGED = NÃO
API_CHANGED = NÃO
LIFECYCLE_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_VISUAL_FIX_PROMPT = SIM
```
