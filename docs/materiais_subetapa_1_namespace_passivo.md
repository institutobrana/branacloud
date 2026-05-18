# Materiais - Subetapa 1 - Namespace passivo

## 1. Objetivo da subetapa

Criar apenas o namespace passivo do modulo Materiais, sem mover logica funcional do monolito e sem alterar comportamento do sistema.

## 2. Diretorio real usado

- `D:\BRANA ARQUIVOS\BRANA CLOUD`

## 3. Arquivos criados/alterados

Criados:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_1_namespace_passivo.md`

Alterado minimamente:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`

## 4. Confirmacao de que `frontend/app.js` nao foi alterado

`frontend/app.js` permaneceu intocado nesta subetapa.

## 5. Confirmacao de que `index.html` foi alterado apenas para carregar o modulo passivo

O `index.html` recebeu somente a inclusao do script `frontend/js/modules/materiais.js`, posicionada antes de `frontend/app.js`, sem alteracao de texto visivel, estrutura visual, CSS ou ordem funcional dos demais modulos.

## 6. Confirmacao de que backend, banco e endpoints nao foram alterados

Backend, banco e endpoints nao foram alterados.

## 7. Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto, acento, label, mensagem, placeholder ou string visivel foi corrigido ou modificado.

## 8. Descricao do namespace criado

Namespace criado:

- `window.BranaMateriaisModule`

O arquivo foi construido como IIFE segura e passiva, sem import/export, sem DOM, sem eventos, sem `fetch`, sem `requestJson`, sem modal e sem integracao funcional.

## 9. Conteudo publico exposto pelo namespace

O namespace expoe:

- `meta`
- `nome`
- `modulo`
- `versaoSubetapa`
- `status`
- `ativo`
- `controlaFluxo`
- `descricao`
- `riscosPreservados`
- `dependenciasDocumentais`
- `helpersCandidatosFuturos`
- `getInfo()`
- `info()`

## 10. Confirmacao de que `ativo` permanece false

`ativo` permanece `false`.

## 11. Confirmacao de que `controlaFluxo` permanece false

`controlaFluxo` permanece `false`.

## 12. Confirmacao de que nao ha DOM, eventos, fetch/requestJson, modal, renderizacao ou integracao funcional

O novo arquivo nao acessa DOM, nao registra eventos, nao usa `fetch`, nao usa `requestJson`, nao abre ou fecha modal, nao renderiza tabela, nao seleciona linha e nao integra com `app.js`.

## 13. Riscos preservados

- DOM, grade e modal continuam no monolito.
- `requestJson` e `fetch` continuam no monolito.
- Payloads e endpoints continuam no monolito.
- Calculos de preco, relacao e custo continuam no monolito.
- Integracao com Procedimentos e Procedimentos Genericos continua no monolito.
- Selecao de linha, clique e duplo clique continuam no monolito.
- Formatar numeros e risco numerico continuam documentados, nao implementados aqui.

## 14. Checks executados

- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `node --check D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`

## 15. Onde testar no navegador

1. Abrir o sistema no navegador.
2. Fazer `Ctrl+F5` para limpar cache.
3. Abrir a tela de Materiais.
4. Confirmar que a listagem de materiais continua abrindo como antes.
5. Confirmar que filtros, selecao, duplo clique e modal continuam funcionando como antes.
6. Confirmar que nao apareceu erro novo no console do navegador.
7. Nao testar alteracao funcional nova, pois nenhuma funcionalidade foi movida.

## 16. Recomendacao para Subetapa 2

Seguir para a documentacao de fronteiras e contratos do modulo Materiais antes de mover qualquer helper ou logica funcional.

## 17. Confirmacao final

- `frontend/app.js` nao foi alterado.
- `frontend/index.html` foi alterado apenas para carregar o modulo passivo.
- `frontend/js/modules/materiais.js` foi criado como namespace passivo.
- Nenhum comportamento funcional foi alterado.
- Nenhum backend, banco ou endpoint foi alterado.

