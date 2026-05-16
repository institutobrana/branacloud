# Correção do botão de fechar global

## 1. Problema relatado
O botão no canto superior direito de painéis e modais estava aparecendo como `??`.
O usuário confirmou que isso não era botão de ajuda, e sim o botão de fechar.

## 2. Local exato encontrado no código
O texto do botão era definido em `frontend/app.js`, dentro dos cromes genéricos:
- `ensurePanelChrome(panel)`
- `ensureModalChrome(modal)`

Essas funções geravam o botão de fechar padrão quando ele não existia no painel ou modal.

## 3. Correção aplicada
### Antes
- `closeBtn.textContent="??"`

### Depois
- `closeBtn.textContent="X"`

A alteração foi aplicada apenas ao texto do botão de fechar gerado pelos cromes genéricos.

## 4. Arquivos alterados
- `frontend/app.js`
- `docs/frontend_correcao_botao_fechar_global_pos_mojibake.md`

## 5. Confirmações
- Foi alterado somente o texto do botão de fechar.
- Não houve nova modularização.
- Não foram alterados eventos, clique, duplo clique, segundo clique rápido ou `bindStandardGridActivation`.
- Não foram alterados endpoints, backend, banco, `requestJson` ou payloads.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules/convenios-planos.js` não foi alterado.

## 6. Pastas legadas
Nada foi salvo em:
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`

## 7. Onde testar no navegador
Abrir o Brana Cloud e verificar painéis/modais como:
- Convênios e Planos
- Símbolos Gráficos

O botão de fechar no canto superior direito deve aparecer como `X`.
