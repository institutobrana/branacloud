# Fechamento da largura do combo Protético - Serviços de protético

## 1. Problema recebido
O combo `Protético` da barra horizontal estava estreito demais e truncava prematuramente o texto selecionado.

## 2. Largura anterior
Antes do ajuste, o Select estava renderizando em `280px` no estado base e caía para `240px` no breakpoint de `1280px`.

## 3. Causa
A largura era definida em `frontend-react/src/features/servicosProtetico/servicosProtetico.css` na regra de `.servicos-protetico-field .ant-select`, e o componente Ant Design também aplicava largura padrão menor no render.

## 4. Largura final
O Select passou a usar:
- `clamp(300px, 26vw, 360px)` no desktop amplo
- `clamp(280px, 24vw, 320px)` no breakpoint intermediário
- `min(100%, 280px)` no mobile estreito

## 5. Justificativa
A largura final foi escolhida para exibir integralmente `BORGES - Prótese Odontológica` no viewport normal, sem exagerar o espaço consumido na toolbar.

## 6. Responsividade
O combo continua em uma única linha, com redução controlada em telas menores e sem deslocar os botões da esquerda.

## 7. Texto completo
Validado no navegador com o texto completo visível:
- `BORGES - Prótese Odontológica`

## 8. Tooltip / ellipsis
O texto completo aparece no viewport normal. A proteção por ellipsis continua existindo para nomes maiores do que a largura disponível.

## 9. Altura preservada
A altura da toolbar e do Select foi preservada.

## 10. Toolbar preservada
A toolbar continuou na mesma linha, com os botões à esquerda e o combo à direita.

## 11. Tema claro
Validado no runtime com o tema claro padrão.

## 12. Tema escuro
Não houve navegação manual completa em tema escuro nesta passada.

## 13. Testes
Executado com sucesso:
- `node --test tests/servicosProtetico.test.js`

## 14. Build
Executado com sucesso:
- `npm.cmd run build`

## 15. Validação runtime
Validado em navegador com API mockada apenas para leitura:
- o combo mostrou `BORGES - Prótese Odontológica` completo;
- a seta permaneceu visível;
- o label `Protético` permaneceu à esquerda;
- a toolbar ficou em uma única linha;
- não houve aumento de altura.

## 16. Arquivos alterados
- [frontend-react/src/features/servicosProtetico/servicosProtetico.css](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [frontend-react/tests/servicosProtetico.test.js](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend-react/tests/servicosProtetico.test.js)

## 17. Confirmação de que tabela e filtros não foram alterados
Esta microetapa não alterou a tabela nem os filtros do cabeçalho.

## 18. Confirmação de que CRUD e impressão não foram implementados
Nenhuma operação de CRUD ou impressão foi adicionada nesta passada.
