# Auditoria completa da integracao e persistencia do editor web legado de simbolos graficos

## Resultado
- INTEGRACAO COMPROVADA.

## Escopo
Auditoria somente leitura da ponte entre o host do modulo `Configura simbolos`, o mock legado `frontend/mock_simbolo_editor.html` e a persistencia do simbolo grafico no Brana Cloud.

## Resposta objetiva das perguntas
1. O mock esta integrado.
2. Quem o abre: `frontend/app.js`.
3. Quem recebe as mensagens: o proprio host em `frontend/app.js`, via listener de `message` e `iframe.contentWindow.postMessage`.
4. Payload enviado: `type`, `nome`, `especialidade`, `forma`, `saveAs`, `codigo`, `image`.
5. `image/png` fica em `image` dentro do payload do editor e vira `imagem_custom` no host.
6. `image`, `imageData` e `imagem_custom`: o mock gera `image` via `preview1.toDataURL("image/png")`; o host armazena esse valor como `imagem_custom`.
7. Preview atualiza: no editor durante a pintura e no host quando `simbolosAplicarImagemEditada` recebe a imagem.
8. Persistencia real: ocorre no host `frontend/app.js` quando o POST/PUT para `/cadastros/simbolos-graficos` ou `/cadastros/simbolos-graficos/{id}` conclui com sucesso.
9. Imagem existente e recarregada: o host passa `image` na query string do `iframe`; o mock lê `image` em `applyInitialState()` e faz `loadFromImage()`.
10. Dimensao que deve orientar o novo React: o contrato real observado no desktop e no fluxo funcional final e 15 x 15; o mock legado opera em 24 x 24 como grade interna de edição. Para o React novo, a orientacao de contrato deve seguir 15 x 15, com possibilidade de escala visual.
11. Partes reutilizaveis sem iframe/postMessage: helpers de classificacao, normalizacao, resolucao de imagem, copia da logica de selecao, e o modelo de estrutura de payload. Nao reutilizar o frame/ponte.
12. Partes da tentativa React suspensa a descartar: iframe, postMessage como ponte principal, dependencia do mock remoto como unico editor, qualquer suposicao de `imagem_custom` como obrigatoria no cadastro inicial.

## Integracao ativa encontrada
### No host
- `frontend/app.js` cria o editor com `new URL("/frontend/mock_simbolo_editor.html", window.location.origin)`.
- O host preenche query string com:
  - `nome`
  - `especialidade`
  - `forma`
  - `codigo`
  - `image`
- O host abre o editor com `simbolosAbrirEditor(editorUrl.toString())`.
- O host escuta `message` em `window`.
- O host tambem usa `simbolosCfg.editorFrame.contentWindow.postMessage(...)`.
- O host aplica `simbolosAplicarImagemEditada(...)` quando recebe imagem do editor.
- O host persiste com `requestJson("POST", "/cadastros/simbolos-graficos", ...)` ou `requestJson("PUT", "/cadastros/simbolos-graficos/{id}", ...)`.

### No editor legado
- `frontend/mock_simbolo_editor.html` recebe parametros via query string.
- Constrói grade pixelada interna.
- Exporta PNG com `preview1.toDataURL("image/png")`.
- Envia `simbolo-editor-save` ao host.
- Entende `simbolo-editor-saved` e `simbolo-editor-error`.
- Reabre imagem existente via `loadFromImage(imageUrl)`.

## Estrutura HTML e comportamento do mock
- Janela `Edita simbolo grafico`.
- Grade visual de pixels.
- Ferramentas:
  - lápis
  - borracha
  - desfazer
  - limpar
  - carregar X
  - carregar bracket
  - tela vazia
- Previews:
  - `24 x 24` no canvas 1x
  - `144 x 144` no canvas ampliado
- A saida nao e um arquivo BMP bruto; a saida primaria do mock e PNG em `dataURL`.

## Tabela de funcoes do mock

| Função | Implementação | Estado |
|---|---|---|
| inicialização | `applyInitialState`, `renderPalette`, `renderGrid`, `renderPreview`, `centerWindow` | ativa |
| carregar imagem | `loadFromImage(imageUrl)` | ativa |
| lápis | `drawAt`, tool `pencil` | ativa |
| borracha | `drawAt`, tool `eraser` | ativa |
| limpar | botão `btn-clear` e `sample-empty` | ativa |
| undo | `tool-undo` | ativa |
| redo | não há redo explícito | ausente |
| salvar | `enviarSalvamento(false)` | ativa |
| cancelar | `closeEditor()` | ativa |
| exportar PNG | `preview1.toDataURL("image/png")` | ativa |
| importar existente | `applyInitialState` + `loadFromImage` | ativa |

## Dimensao real
### O que foi comprovado
- O canvas do editor legado usa `24 x 24`.
- O preview ampliado usa `144 x 144`.
- O EasyDental Desktop comprovado em runtime usou `15 x 15`.

### Interpretação segura
- O mock é uma representação tecnica maior do que o desktop.
- O contrato funcional real do desenho do usuário no desktop e no fluxo final deve seguir a referencia de `15 x 15`.
- O `24 x 24` deve ser tratado como detalhe de implementação do mock, nao como contrato final obrigatório.

## Mapeamento do host
| Referência | Arquivo | Função | Ativa |
|---|---|---|---:|
| `mock_simbolo_editor.html` | `frontend/app.js` | URL do editor em iframe | sim |
| `simbolo-editor-save` | `frontend/app.js` | recebe retorno de salvamento | sim |
| `simbolo-editor-saved` | `frontend/app.js` | confirma salvamento ao editor | sim |
| `simbolo-editor-error` | `frontend/app.js` | reporta erro ao editor | sim |
| `postMessage` | `frontend/app.js` | ponte entre host e iframe | sim |
| `contentWindow` | `frontend/app.js` | canal do iframe | sim |
| `iframe` | `frontend/app.js` | container do editor | sim |
| `editorUrl` | `frontend/app.js` | monta a URL com estado inicial | sim |
| `imagem_custom` | `frontend/app.js` e backend | campo persistido | sim |

## Segurança do postMessage
- `targetOrigin` usado: `window.location.origin`.
- O host valida `event.origin`.
- O host só processa `simbolo-editor-save`.
- O fluxo é parcialmente seguro:
  - há validação de origem;
  - não foi comprovada validação robusta de `event.source` além do contexto do iframe do modal;
  - não foi observada proteção explícita contra replay ou múltiplos editores concorrentes.

## Fluxo comprovado
host
-> abre editor
-> envia estado inicial
-> editor carrega
-> usuário edita
-> editor envia save
-> host recebe
-> preview atualiza
-> persistência ocorre

## Persistência
- O editor não grava sozinho.
- A persistência real acontece no host após retorno do editor e sucesso da requisição ao backend.
- O valor exportado pelo editor entra como `imagem_custom`.
- O backend persiste `imagem_custom` no `simbolo_grafico_catalogo`.

## Reabertura de imagem existente
- O host passa `image` na query string.
- O mock lê `image` em `applyInitialState`.
- O mock baixa a imagem e preenche a grade com `loadFromImage`.
- O preview é reconstruído a partir do canvas.

## Conclusao
- O mock não é apenas protótipo isolado.
- Ele está integrado ao host legado do módulo em `frontend/app.js`.
- A integração é ativa, por iframe e `postMessage`.
- O React suspenso anterior deve ser descartado como ponte principal.
- O caminho seguro para o novo React é recriar a funcionalidade com componente próprio e sem depender do iframe legado.
