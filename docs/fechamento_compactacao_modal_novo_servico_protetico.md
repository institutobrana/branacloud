# Fechamento da microcompactação visual - `Novo serviço de protético`

## 1. Problema visual

O modal funcional de `Novo serviço de protético` estava correto em contrato, mas ainda alto demais para o padrão compacto do Brana Cloud React. O espaçamento vertical entre os campos deixava o modal mais alongado do que o necessário.

## 2. Organização anterior

- `Protético`
- `Código`
- `Nome do serviço`
- `Índice`
- `Preço`
- `Prazo (Tempo médio em dias)`
- `Descrição`
- rodapé com `Cancelar` e `Salvar`

A estrutura funcionava, mas ocupava mais altura do que o desejável.

## 3. Organização nova

- `Protético`
- `Código`
- `Nome do serviço`
- `Índice | Preço`
- `Prazo (Tempo médio em dias)`
- `Descrição`
- `Cancelar | Salvar`

## 4. Índice e Preço na mesma linha

- Os campos `Índice` e `Preço` foram colocados no mesmo grid interno.
- Cada um mantém sua própria label.
- As larguras ficaram equilibradas.
- Em viewport estreito, a grade pode empilhar de forma segura.

## 5. Redução dos gaps

Foram reduzidos:

- o espaço entre blocos do formulário;
- a distância entre label e campo;
- o espaço acima do rodapé;
- o espaço entre o bloco de protético e o formulário;
- o espaço vertical inicial do modal.

## 6. Redução entre labels e campos

As labels ficaram mais próximas dos controles por meio de regras locais da feature, sem alterar o restante do projeto.

## 7. Redução da altura total

- O modal ficou visualmente mais compacto.
- O `TextArea` passou a iniciar com menos altura.
- O rodapé ficou mais próximo do conteúdo.

## 8. Responsividade

- Em largura normal, `Índice` e `Preço` aparecem lado a lado.
- Em largura menor, a estrutura empilha sem quebrar o layout.
- O modal preserva a largura atual base e continua dentro da tela.

## 9. Tema claro

- Preservado.
- Nenhuma cor global foi alterada.
- O contraste do modal continua compatível com o shell.

## 10. Tema escuro

- Preservado.
- As classes locais continuam usando os tokens existentes da aplicação.

## 11. Testes

Arquivo validado:

- [`frontend-react/tests/servicosProtetico.test.js`](../frontend-react/tests/servicosProtetico.test.js)

Cobertura relevante:

- estrutura em grid de `Índice` e `Preço`;
- presença de `Código`, `Nome do serviço`, `Prazo` e `Descrição`;
- presença da estrutura compactada e das classes locais do modal.

## 12. Build

Comando executado:

```bash
npm.cmd run build
```

Resultado:

- build concluído com sucesso;
- warning de chunk grande mantido, sem regressão funcional.

## 13. Runtime

A validação runtime visual direta não foi executada nesta microetapa. A alteração foi limitada a compactação local do modal e a suíte automatizada permaneceu verde.

## 14. Arquivos alterados

- [`frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicoProteticoModal.jsx)
- [`frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx`](../frontend-react/src/features/servicosProtetico/components/ServicoProteticoForm.jsx)
- [`frontend-react/src/features/servicosProtetico/servicosProtetico.css`](../frontend-react/src/features/servicosProtetico/servicosProtetico.css)
- [`frontend-react/tests/servicosProtetico.test.js`](../frontend-react/tests/servicosProtetico.test.js)

## 15. Confirmação de ausência de mudança funcional

- Nenhum payload foi alterado.
- Nenhuma validação foi alterada.
- Nenhum endpoint foi alterado.
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhuma regra de salvamento foi alterada.
- Nenhum comportamento de seleção, filtro ou listagem foi alterado.

## 16. Conclusão

A microetapa reduziu a altura do modal `Novo serviço de protético` e colocou `Índice` e `Preço` na mesma linha, preservando integralmente o contrato funcional já aprovado.
