# Símbolos Gráficos — Subetapa 4 — Integração mínima de helper puro

## 1. Escopo da etapa
Esta etapa integrou de forma mínima o helper puro `normalizarTextoSimbolo` e não alterou o comportamento funcional esperado do módulo.

## 2. Arquivos alterados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md`

Confirmações:
- `frontend/index.html` não foi alterado;
- `frontend/js/modules/simbolos-graficos.js` não foi alterado;
- backend, banco e endpoints não foram alterados.

## 3. Blindagem textual/mojibake
Esta etapa respeitou obrigatoriamente:

`D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`

Confirmações:
- nenhum texto foi corrigido;
- nenhum acento foi corrigido;
- nenhum mojibake foi corrigido;
- nenhuma string visível foi alterada;
- nenhum label, mensagem ou placeholder foi alterado.

## 4. Ponto de integração
Função local alterada:

- `simbolosNormalizarTexto`

Motivo da escolha:
- era o ponto interno mais pequeno e seguro para normalização textual do módulo;
- já existia como função local clara de comparação interna;
- podia receber uma delegação mínima sem mexer em DOM, eventos, modal, editor ou backend.

Helper usado:

- `window.BranaSimbolosGraficosModule.helpers.normalizarTextoSimbolo`

Fallback preservado:
- quando o helper não existe, a função continua usando a lógica local anterior;
- quando o helper existe, a saída final continua sendo normalizada pela lógica local antiga, preservando o comportamento esperado.

Por que a integração é de baixo risco:
- não altera texto visível;
- não altera payload;
- não altera DOM;
- não altera eventos;
- não toca em modal, editor visual, iframe, canvas ou postMessage;
- não altera endpoints.

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
- `window.addEventListener("message", ...)`.

## 6. Riscos preservados
Continuam preservados:

- tela preta no editor;
- iframe;
- ponte `postMessage`/`message`;
- rerender de `tbody`;
- `bindStandardGridActivation`;
- duplo clique;
- segundo clique rápido;
- modais/backdrops;
- payload de salvar/excluir;
- consumidores externos.

## 7. Resultado técnico
Checks executados:

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` -> passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\simbolos-graficos.js` -> passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\prestadores.js` -> passou
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\anamnese.js` -> passou

Resultado:
- a integração tem fallback;
- o `app.js` continua funcionando sem depender obrigatoriamente do helper externo;
- o fluxo funcional esperado foi preservado.

## 8. Recomendação para próxima subetapa
Recomendação conservadora:

- Subetapa 5: integrar um segundo helper puro de baixo risco, como `ehSimboloSistema` ou `compararBibliotecaPorCodigo`, somente se houver ponto seguro e com fallback.

Se o risco aumentar, a alternativa mais segura é documentação/teste antes de nova integração.
