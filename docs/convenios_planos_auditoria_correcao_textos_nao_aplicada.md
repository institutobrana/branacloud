# Convênios e Planos - Auditoria de correção de textos do calendário

## 1. Contexto

O teste no navegador mostrou que a correção anterior não teve efeito visual imediato: os textos do calendário de faturamento continuaram corrompidos após `Ctrl+F5`.

Esta auditoria foi feita para confirmar o caminho real servido pela aplicação e corrigir apenas o arquivo efetivamente usado pelo sistema.

## 2. Diretório de trabalho

- Diretório de trabalho confirmado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- O projeto ativo consultado e corrigido ficou restrito a esse diretório.

## 3. Caminho real do arquivo corrigido

- Arquivo realmente corrigido: `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- A rota `/app` entrega o `index.html` ativo, e ele carrega:
  - `/frontend/js/modules/convenios-planos.js`
  - `/frontend/app.js?v=20260513-medicamentos-sub1`

Não foi encontrado um segundo `app.js` ativo sendo servido por outra rota dentro do projeto ativo.

## 4. Verificação das pastas legadas

Foi feita apenas leitura/pesquisa nas pastas antigas.

- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`: nenhuma gravação foi feita nesta auditoria.
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`: nenhuma gravação foi feita nesta auditoria.

Não houve criação, edição, salvamento, documentação, cópia ou movimentação de arquivos nessas pastas.

## 5. Ocorrências encontradas no projeto ativo

As ocorrências do bloco do calendário de faturamento foram encontradas em `frontend/app.js`, no trecho de Convênios e Planos.

Textos corrompidos localizados nesse bloco:

- `ConfiguraÃ§Ã£o de calendÃ¡rio de faturamento`
- `ConvÃªnio`
- `Ã—`
- `CalendÃ¡rio de faturamento aberto.`
- `calendÃ¡rio` em mensagens do calendário

## 6. Correções aplicadas

No bloco do calendário de faturamento de `frontend/app.js`, foram aplicadas correções pontuais para:

- `ConfiguraÃ§Ã£o de calendÃ¡rio de faturamento` -> `Configuração de calendário de faturamento`
- `ConvÃªnio` -> `Convênio`
- `Ã—` -> `X`
- `CalendÃ¡rio de faturamento aberto.` -> `Calendário de faturamento aberto.`
- demais variações de `calendÃ¡rio` no bloco do calendário -> `calendário`

O log de confirmação foi adicionado no fluxo de abertura do calendário:

- `console.log("[ConvPlan] textos calendario corrigidos pos-subetapa-4");`

Ele aparece em `convPlanCalAbrir()`, logo após `ensurePanelChrome(convPlanCalCfg.panel);` e antes do carregamento dos dados do calendário.

## 7. O que não foi alterado

- Não houve nova modularização.
- `frontend/index.html` não foi alterado nesta auditoria.
- `frontend/js/modules/convenios-planos.js` não foi alterado nesta auditoria.
- Backend, banco, endpoints, `requestJson` e payloads não foram alterados.
- Clique, duplo clique, segundo clique rápido e `bindStandardGridActivation` não foram alterados.
- Não houve alteração de comportamento fora do bloco do calendário de Convênios e Planos.

## 8. Checks executados

- `node --check frontend/app.js` -> OK
- `node --check frontend/js/modules/convenios-planos.js` -> OK
- `node --check frontend/js/modules/prestadores.js` -> OK
- `node --check frontend/js/modules/anamnese.js` -> OK

## 9. Onde testar no navegador

1. Abrir o Brana Cloud.
2. Entrar em `Convênios e Planos`.
3. Abrir `Calendário de faturamento`.
4. Confirmar que aparecem corretamente:
   - `Configuração de calendário de faturamento`
   - `Convênio`
   - `X` no botão de fechar
5. Verificar no console do DevTools a mensagem:
   - `[ConvPlan] textos calendario corrigidos pos-subetapa-4`

