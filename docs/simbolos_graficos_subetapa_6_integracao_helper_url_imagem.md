# Símbolos Gráficos — Subetapa 6 — Integração mínima do helper urlImagemSimbolo

## 1. Escopo da etapa

Esta etapa integrou apenas o helper puro `urlImagemSimbolo` no `frontend/app.js`, com fallback local preservado. Nenhum outro fluxo funcional foi movido, refatorado ou alterado.

## 2. Arquivos alterados

- `frontend/app.js`
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md`

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

A função local alterada foi `simbolosImagemUrl`.

Motivo da escolha:
- já existia uma função local pequena e isolada para resolver a URL da imagem;
- a lógica era defensiva;
- a integração não toca em DOM, eventos, modal, editor, iframe, canvas ou postMessage;
- o helper passivo já expunha `window.BranaSimbolosGraficosModule.helpers.urlImagemSimbolo`.

Helper usado:
- `urlImagemSimbolo`

Fallback preservado:
- quando o helper externo não estiver disponível, a função continua usando a lógica local equivalente já existente no `app.js`.

Por que é de baixo risco:
- a mudança ficou restrita a uma função de leitura de URL;
- não altera texto visível;
- não altera payload;
- não altera DOM;
- não altera eventos;
- não altera modal, editor, iframe ou postMessage;
- não altera backend nem endpoints.

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
- comparação de biblioteca;
- ocultação de biblioteca.

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
- risco de alterar visual de preview/biblioteca em etapas futuras.

## 7. Resultado técnico

- `frontend/app.js` passou no `node --check`;
- o módulo `frontend/js/modules/simbolos-graficos.js` passou no `node --check`;
- a integração tem fallback;
- o `app.js` continua funcionando sem depender obrigatoriamente do helper externo.

## 8. Recomendação para próxima subetapa

Recomenda-se uma pausa de consolidação documental da mini sequência de helpers já integrados antes de qualquer nova integração.

Motivo:
- já foram integrados os helpers `normalizarTextoSimbolo`, `ehSimboloSistema` e `urlImagemSimbolo`;
- os principais riscos sensíveis continuam concentrados no editor visual, iframe, modal e eventos;
- uma pausa ajuda a preservar a modularização conservadora e a revisar o impacto visual antes de seguir.

Evitar ainda:
- `compararBibliotecaPorCodigo`, caso altere ordenação visual;
- `ocultarItemDaBiblioteca`, caso altere visibilidade de itens;
- qualquer função ligada ao editor;
- qualquer função ligada ao modal;
- qualquer função ligada a eventos;
- qualquer função ligada a salvar ou excluir.
