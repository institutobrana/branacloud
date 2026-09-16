# Auditoria do editor web legado de simbolos graficos

## Resultado
- RELACAO COMPROVADA.

## Arquivos localizados
- [frontend/mock_simbolo_editor.html](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/mock_simbolo_editor.html)
- [frontend/js/modules/simbolos-graficos.js](D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/js/modules/simbolos-graficos.js)

## Estrutura de arquitetura
### `frontend/mock_simbolo_editor.html`
- Camada visual do editor legado.
- Janela com titulo `Edita simbolo grafico`.
- Controles de nome, especialidade, forma, ferramentas, paleta, area de pixels e preview.
- Usa `canvas` para as duas previas.
- Editor de pixels com grade `24 x 24`.
- Salvar e salvar como emitem payload com `image` em `image/png` via `toDataURL`.
- Comunicação com o host via `postMessage`.

### `frontend/js/modules/simbolos-graficos.js`
- Namespace passivo.
- Nao assume fluxo, DOM, fetch, modal, iframe, canvas ou postMessage.
- Exponha apenas helpers puros e classificacao de imagem.

## Formato de imagem
- O editor visual trabalha internamente como bitmap/pixel grid.
- A saida enviada ao host e `image/png` em `dataURL`.
- A visualizacao do editor usa canvas, mas o contrato pratico indica imagem persistida/transportada em texto de imagem.

## Persistencia e integracao
- O mock envia `simbolo-editor-save` ao host.
- O payload contem:
  - nome;
  - especialidade;
  - forma;
  - codigo;
  - image;
  - flag `saveAs`.
- O fluxo legado pode receber retorno de `simbolo-editor-saved` ou erro por `simbolo-editor-error`.
- O editor nao persiste sozinho: ele entrega a imagem ao host para a etapa seguinte.

## Biblioteca, preview e edicao
- A biblioteca no Desktop e o editor nao sao a mesma coisa.
- A biblioteca seleciona uma base visual.
- O editor transforma essa base em bitmap editavel.
- O preview no modal acompanha a arte em memoria antes da confirmacao final.

## Conclusao
- O editor web legado existe no workspace e e o principal candidato documental para futura adaptacao React.
- Ele usa canvas, pixel grid e `postMessage`.
- Ele nao deve ser confundido com o namespace passivo `frontend/js/modules/simbolos-graficos.js`.
