# Fase 2E.1 - Auditoria do editor e imagem_custom

## 1. Resultado
B. CONTRATO COMPLETO, MAS EDITOR EXIGE ADAPTADOR

## 2. Editor encontrado
- arquivo: [frontend/mock_simbolo_editor.html](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/mock_simbolo_editor.html)
- real ou mock: mock funcional local, mas com contrato de editor util
- tecnologia: HTML puro, CSS e JavaScript inline
- estado: aberto por `iframe` no modal principal do React legado
- consumidores: [frontend/app.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js), fluxo legado de simbolos graficos

## 3. Abertura
- URL: `new URL("/frontend/mock_simbolo_editor.html", window.location.origin)`
- iframe: sim, `#simbolos-editor-frame`
- modal: sim, backdrop `#simbolos-editor-backdrop`
- parametros: `nome`, `especialidade`, `forma`, `codigo`, `image`
- estado inicial: modal principal continua aberto, editor abre ocultando o backdrop inferior e recebendo o estado pela query string

## 4. Mensagens
- `simbolo-editor-close`: enviado do editor para o pai ao fechar
- `simbolo-editor-save`: enviado do editor para o pai ao salvar
- `simbolo-editor-error`: enviado do pai para o editor quando o salvamento falha
- `simbolo-editor-saved`: enviado do pai para o editor quando o salvamento conclui
- demais: o mock tambem usa `window.alert` e altera texto de status interno

## 5. Seguranca
- origin: o pai aceita apenas `event.origin === window.location.origin`
- source: nao ha comparacao explicita de `event.source`, apenas validacao por origin e contexto do modal
- sessionId: nao existe
- targetOrigin: o pai usa `window.location.origin` no `postMessage`
- cleanup: o fechamento zera `iframe.src = "about:blank"` no fluxo do pai
- riscos: nao ha nonce, sessao, limite de tamanho, schema forte nem validacao de MIME no `postMessage`

## 6. Entrada
- simbolo base: `codigo`, `nome`, `especialidade`, `forma`
- imagem existente: `image` na query string, vindo de `imagem_custom` ou do fallback visual atual
- tipo_marca: entra como texto de forma, por exemplo `Dente (ex: Coroa)` ou similares
- formato: URL com query string, nao `ImageData` nem `blob`

## 7. Saida
- formato: objeto JSON em `postMessage`
- MIME: o mock gera `data:image/png;base64,...`
- dimensao: `24x24` no preview principal e `144x144` no preview ampliado
- tamanho: nao ha limite validado no front legado
- payload: inclui `type`, `nome`, `especialidade`, `forma`, `saveAs`, `codigo`, `image`

## 8. imagem_custom
- tipo: `TEXT` no model
- formato: texto de imagem, comprovadamente `data:image/png;base64,...` nos dados existentes
- limite: nao comprovado no backend
- prioridade: acima de `icone` e `bitmap1` na listagem e no preview
- consumidores: preview do modal, listagem do backend, retorno do editor, persistencia do simbolo

## 9. Dados existentes
- quantidade: 11 registros com `imagem_custom` preenchida no banco atual
- padroes: todos os exemplos observados sao `data:image/png;base64,...`
- tamanhos: minimo `1234`, medio `1241.64`, maximo `1262` caracteres
- conflitos: nao foram encontrados registros com `imagem_custom` e `codigo` vazio

## 10. Bitmaps
- bitmap1: usado como fallback principal do simbolo base
- bitmap2: campo legado preservado, sem uso funcional comprovado nesta rodada
- bitmap3: campo legado preservado, sem uso funcional comprovado nesta rodada

## 11. Sobreposicao
- significado: campo persistido no backend, mas sem regra visual comprovada nesta frente
- produtor: backend aceita em `POST`/`PUT` quando enviado
- consumidor: nao foi comprovado no fluxo atual do modal novo

## 12. tipo_marca
- Face: suportado no combo legado como contrato textual
- Dente: suportado e default visual do fluxo novo
- Grupo: suportado no combo legado
- Arcada: suportado no combo legado
- Geral: suportado no combo legado
- Segmento: suportado no combo legado

## 13. Execucao isolada
- carregou: sim, o mock abre e recebe estado por query string
- ferramentas: lapis, borracha, desfazer, limpar, paleta e samples
- salvar: emite `simbolo-editor-save`
- cancelar: emite `simbolo-editor-close`
- saida: data URL PNG gerada pelo canvas
- Console: nao foi comprovado erro novo no caminho lido

## 14. Decisao de reutilizacao
- B
- justificativa: o editor existente entrega o contrato necessario e pode ser reutilizado, mas depende de adaptador seguro porque o bridge atual e o mock sao simples e carecem de protecoes extras de source, nonce, timeout, limite e schema

## 15. Contrato futuro React
- entrada: `sessionId`, `sourceImage`, `sourceCode`, `initialCustomImage`, `markType`, `nome`, `especialidade`, `forma`
- saida: `type`, `sessionId`, `imageCustom`, `width`, `height`, `codigo`, `message`
- handshake: `ready`/`init` com origem exata
- validacao: origin, source, sessionId, MIME, tamanho, schema e timeout
- lifecycle: abrir, aguardar pronto, enviar estado, receber resultado, limpar listener, fechar iframe

## 16. Plano de testes
- handshake
- origem permitida e origem invalida
- source valido e invalido
- sessionId valido e invalido
- ready, save, cancel e timeout
- payload malformado
- MIME invalido e tamanho excessivo
- listener cleanup e unmount
- multiplos editores
- atualizacao de preview
- inclusao de `imagem_custom` no payload
- simbolo sem edicao, simbolo editado e limpar apos edicao

## 17. Documentos
- criados: [docs/auditoria_editor_simbolo_grafico_postmessage_imagem_custom.md](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/docs/auditoria_editor_simbolo_grafico_postmessage_imagem_custom.md)
- atualizados: nenhum nesta rodada

## 18. Seguranca da rodada
- POST: nao alterado
- PUT: nao alterado
- PATCH: nao alterado
- DELETE: nao alterado
- banco: somente leitura para auditoria
- backend: somente leitura para auditoria

## 19. Git final
- HEAD: `4525479690f91f8244a014bf4908467a35c38ba3`
- Branch: `modularizacao-segura-fase-1`
- Stage inicial: preexistente e preservado
- Stage final: apenas documento novo planejado
- Commit: nao feito
- Push: nao feito

## 20. Proxima etapa
- BLOQUEADO - requer decisao humana para seguir para adaptacao segura, correcao do editor ou reimplementacao
