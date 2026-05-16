# Símbolos Gráficos — Subetapa 5 — Integração mínima do helper ehSimboloSistema

## 1. Escopo da etapa

Esta etapa integrou apenas o helper puro `ehSimboloSistema` no `frontend/app.js`, com fallback local preservado. Nenhum outro fluxo funcional foi movido, refatorado ou alterado.

## 2. Arquivos alterados

- `frontend/app.js`
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md`

Confirma-se que:
- `frontend/index.html` não foi alterado;
- `frontend/js/modules/simbolos-graficos.js` não foi alterado;
- backend, banco e endpoints não foram alterados.

## 3. Blindagem textual/mojibake

Foi respeitado o documento:

`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirma-se que:
- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 4. Ponto de integração

A função local alterada foi `simbolosEhSistema`.

Motivo da escolha:
- já existia uma verificação local pequena e isolada;
- a lógica é defensiva e pura;
- a integração não toca em DOM, eventos, modal, editor, iframe, canvas ou postMessage;
- o helper passivo já expunha `window.BranaSimbolosGraficosModule.helpers.ehSimboloSistema`.

Helper usado:
- `ehSimboloSistema`

Fallback preservado:
- quando o helper externo não estiver disponível, a função continua usando a lógica local equivalente já existente no `app.js`.

Por que é de baixo risco:
- a mudança ficou restrita a uma função de leitura booleana;
- não altera texto visível;
- não altera payload;
- não altera DOM;
- não altera eventos;
- não altera modal, editor, iframe ou postMessage.

## 5. O que permaneceu fora do escopo

Continuaram intocados:
- modal;
- salvar;
- excluir;
- payload;
- endpoints;
- `requestJson`/`fetch`;
- renderização;
- seleção;
- `bindStandardGridActivation`;
- clique;
- duplo clique;
- segundo clique rápido;
- editor visual;
- iframe;
- canvas;
- `postMessage`/`message`;
- `window.addEventListener("message", ...)`;
- ordenação;
- comparação de biblioteca.

## 6. Riscos preservados

Continuam preservados os riscos já conhecidos:
- tela preta no editor;
- iframe;
- ponte `postMessage`/`message`;
- rerender de `tbody`;
- `bindStandardGridActivation`;
- duplo clique;
- segundo clique rápido;
- modais/backdrops;
- payload de salvar/excluir;
- consumidores externos;
- risco de alterar comportamento visual da biblioteca em etapas futuras.

## 7. Resultado técnico

- `frontend/app.js` passou no `node --check`;
- o módulo `frontend/js/modules/simbolos-graficos.js` passou no `node --check`;
- a integração tem fallback;
- o `app.js` continua funcionando sem depender obrigatoriamente do helper externo.

## 8. Recomendação para próxima subetapa

Seguir de forma conservadora para a Subetapa 6, integrando apenas outro helper puro de baixo risco, se houver ponto seguro, como `ocultarItemDaBiblioteca` ou `urlImagemSimbolo`, sempre com fallback.

Evitar ainda:
- `compararBibliotecaPorCodigo`, caso altere ordenação visual;
- qualquer função ligada ao editor;
- qualquer função ligada ao modal;
- qualquer função ligada a eventos;
- qualquer função ligada a salvar ou excluir.
