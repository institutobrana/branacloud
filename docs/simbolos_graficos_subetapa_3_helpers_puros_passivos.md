# Símbolos Gráficos — Subetapa 3 — Helpers puros passivos

## 1. Escopo da etapa
Esta etapa adicionou apenas helpers puros ao namespace passivo e não integrou nada ao `app.js`.

## 2. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\simbolos-graficos.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\simbolos_graficos_subetapa_3_helpers_puros_passivos.md`

Confirmações:
- `frontend/app.js` não foi alterado;
- `frontend/index.html` não foi alterado.

## 3. Blindagem textual/mojibake
Esta etapa respeitou obrigatoriamente:

`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirmações:
- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 4. Helpers implementados

### `normalizarTextoSimbolo(valor)`
- Entrada: qualquer valor.
- Saída: string normalizada com `trim()` e `toLowerCase()`.
- Por que é puro: apenas transforma a entrada em string e normaliza para comparação interna futura.
- Por que não usa DOM: não lê nem escreve elementos.
- Por que não usa `fetch`/`requestJson`: não faz I/O.
- Por que não usa eventos: não registra nem consome eventos.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: está apenas exportado no namespace passivo.
- Risco residual: baixo.

### `ehSimboloSistema(item)`
- Entrada: objeto.
- Saída: boolean.
- Por que é puro: só avalia campos já existentes no objeto.
- Por que não usa DOM: não consulta elementos visuais.
- Por que não usa `fetch`/`requestJson`: não faz I/O.
- Por que não usa eventos: não instala nem consome listeners.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: não é integrado ao `app.js`.
- Risco residual: baixo.

### `ocultarItemDaBiblioteca(item)`
- Entrada: objeto.
- Saída: boolean.
- Por que é puro: só compara o código do item.
- Por que não usa DOM: não lê nem escreve elementos.
- Por que não usa `fetch`/`requestJson`: não faz I/O.
- Por que não usa eventos: não registra nem consome eventos.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: permanece apenas exportado.
- Risco residual: baixo.

### `compararBibliotecaPorCodigo(a, b)`
- Entrada: dois objetos.
- Saída: número compatível com `sort`.
- Por que é puro: usa apenas comparação de strings.
- Por que não usa DOM: não consulta elementos.
- Por que não usa `fetch`/`requestJson`: não faz I/O.
- Por que não usa eventos: não registra nem consome eventos.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: não está acoplado ao `app.js`.
- Risco residual: baixo.

### `urlImagemSimbolo(item)`
- Entrada: objeto.
- Saída: string.
- Por que é puro: retorna caminho calculado sem acessar rede.
- Por que não usa DOM: não consulta elementos.
- Por que não usa `fetch`/`requestJson`: não valida rede nem faz requisição.
- Por que não usa eventos: não registra nem consome eventos.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: não foi integrado ao fluxo ativo.
- Risco residual: médio, porque a regra de fallback ainda pode precisar de ajuste futuro.

### `validarTipoMarcaSimbolo(valor)`
- Entrada: valor.
- Saída: string normalizada compatível com `sistema`/`usuario`, ou string vazia.
- Por que é puro: faz apenas normalização determinística.
- Por que não usa DOM: não consulta elementos.
- Por que não usa `fetch`/`requestJson`: não faz I/O.
- Por que não usa eventos: não registra nem consome eventos.
- Por que não usa modal/editor/iframe/canvas/postMessage: não toca em fluxo visual.
- Por que não altera comportamento atual: não está ligado ao `app.js`.
- Risco residual: baixo.

## 5. Helpers adiados por cautela
Nenhum helper foi adiado nesta subetapa. Os candidatos avaliados foram considerados seguros o suficiente para exportação passiva.

## 6. Confirmação de passividade
O módulo continua com as flags passivas:

- `ativo: false`
- `controlaFluxo: false`
- `usaDOM: false`
- `usaFetch: false`
- `usaRequestJson: false`
- `usaEventos: false`
- `usaModal: false`
- `usaEditorVisual: false`
- `usaIframe: false`
- `usaCanvas: false`
- `usaPostMessage: false`
- `moveuLogicaDoApp: false`

## 7. O que permaneceu no app.js
Continuam no `app.js`:

- abertura da tela;
- criação de UI;
- renderização;
- listagem;
- seleção;
- modal;
- salvar;
- excluir;
- biblioteca;
- preview;
- editor visual;
- iframe;
- `postMessage`/`message`;
- `bindStandardGridActivation`;
- eventos de clique/duplo clique/segundo clique rápido;
- integração com backend.

## 8. Riscos preservados
Continuam preservados:

- tela preta no editor;
- iframe;
- ponte `postMessage`/`message`;
- `window.addEventListener("message", ...)`;
- rerender de `tbody`;
- `bindStandardGridActivation`;
- duplo clique;
- segundo clique rápido;
- modais/backdrops;
- payload de salvar/excluir;
- consumidores externos.

## 9. Recomendação para próxima subetapa
Recomendação conservadora para a próxima etapa:

- Subetapa 4: integrar apenas um helper puro de baixíssimo risco, com fallback, sem mexer em modal, editor, eventos ou payload.

Se houver qualquer dúvida na validação futura, a alternativa mais segura é ampliar testes/documentação antes de qualquer integração.
