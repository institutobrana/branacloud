# Implementacao do adaptador seguro do editor de simbolos grafico

## Arquitetura
- O modal Novo do fluxo de simbolos graficos passou a abrir um dialogo secundario controlado para o editor legado.
- O editor legado continua sendo o mock funcional em [frontend/mock_simbolo_editor.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/mock_simbolo_editor.html).
- O React controla a abertura, o fechamento, o timeout, o listener e a validacao de mensagens.
- A imagem editada fica apenas em memoria nesta fase.

## Arquivos
- [frontend-react/src/features/simbolosGraficos/editor/simboloGraficoEditorContract.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/simbolosGraficos/editor/simboloGraficoEditorContract.js)
- [frontend-react/src/features/simbolosGraficos/hooks/useSimboloGraficoEditor.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/simbolosGraficos/hooks/useSimboloGraficoEditor.js)
- [frontend-react/src/features/simbolosGraficos/components/SimboloGraficoEditorDialog.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/simbolosGraficos/components/SimboloGraficoEditorDialog.jsx)
- [frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx)
- [frontend/mock_simbolo_editor.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/mock_simbolo_editor.html)
- [frontend-react/tests/simboloGraficoCreateModal.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/simboloGraficoCreateModal.test.js)

## Contrato
- Entrada conceitual: `sessionId`, `sourceCode`, `sourceImageUrl`, `initialCustomImage`, `markType`, `nome`, `especialidade`, `forma`
- Saida conceitual: `sessionId`, `imageCustom`, `width`, `height`
- O POST real continua sem `imagem_custom`.

## Mensagens
- `simbolo-editor-ready`
- `simbolo-editor-init`
- `simbolo-editor-save`
- `simbolo-editor-close`
- `simbolo-editor-error`
- `simbolo-editor-saved`

## Seguranca
- `sessionId` novo por abertura.
- `event.origin` validado contra `window.location.origin`.
- `event.source` validado contra `iframe.contentWindow`.
- timeout de 45 segundos.
- cleanup ao salvar, cancelar, fechar ou desmontar.
- nenhuma mensagem tardia deve alterar o estado.

## Lifecycle
1. Abrir o modal Novo.
2. Selecionar um simbolo.
3. Clicar em Editar.
4. Gerar `sessionId`.
5. Abrir o iframe.
6. Aguardar `ready`.
7. Enviar `init`.
8. Receber `save` ou `close`.
9. Atualizar preview local, sem persistir.
10. Encerrar o editor e remover listener.

## Preview
- A imagem editada substitui apenas o preview local enquanto o modal estiver aberto.
- Ao trocar o simbolo ou limpar o desenho, o estado local de `imagemCustom` e removido.

## Omissao no POST
- Nesta fase o mapper final de criacao continua sem `imagem_custom`.
- O contrato de persistencia real fica para a Fase 2E.3.

## Pendencias da Fase 2E.3
- Persistir `imagem_custom` no backend.
- Homologar a inclusao da imagem editada no POST.
- Confirmar o fluxo completo de reabertura e persistencia do desenho editado.
