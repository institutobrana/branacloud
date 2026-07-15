# Contrato Visual - Plano de Contas no Frontend React

## Objetivo

Formalizar a decisão visual do futuro módulo `Plano de contas` no frontend React.

## Decisão visual final

- A interface não deve usar uma árvore única com sete colunas como contrato principal.
- A interface não deve usar árvore visual com `+/-` como contrato funcional.
- A interface deve usar estrutura mestre-detalhe com duas tabelas lado a lado.
- Grupos ficam à esquerda.
- Categorias ficam à direita.
- A barra lateral do sistema e a barra horizontal do módulo devem formar um `L`.
- Em desktop, os painéis devem ficar lado a lado.
- Em telas menores, os painéis podem empilhar.

## Organização visual

### Painel de grupos

- Tabela de grupos.
- Seleção visual de linha.
- Ações aplicadas ao grupo selecionado.

### Painel de categorias

- Tabela de categorias do grupo selecionado.
- Título identificando o grupo ativo.
- Seleção independente de categoria.
- Ações aplicadas à categoria selecionada.

## Barra horizontal

- Deve ser compacta.
- Deve concentrar os comandos principais do módulo.
- Deve evitar ambiguidade entre ações de grupo e categoria.

## Regras de contexto

- O contexto ativo determina se `Alterar` e `Eliminar` atuam sobre grupo ou categoria.
- O estado visual deve indicar claramente o alvo da ação.
- Botões desabilitados podem ser usados para reduzir ambiguidade.

## Estados mínimos

- Vazio
- Carregando
- Erro
- Seleção de grupo sem categoria
- Categoria selecionada

## Responsividade

- Desktop: painéis lado a lado.
- Menor largura: empilhamento aceitável.
- O título do painel de categorias deve continuar informando o grupo selecionado.

## Pontos não confirmados

- Estilo visual exato dos cards, bordas e espaçamentos.
- Ícones definitivos da barra do módulo.
- Estado visual exato para botões desabilitados.
- Detalhe do comportamento do shell React para a ação de fechar.

## Conclusão

O contrato visual formal do React é mestre-detalhe com duas tabelas, sem árvore única e sem contrato funcional de `+/-`.

## Etapa implementada

- A primeira fundação funcional foi implementada no React em `/app/configuracoes/plano-de-contas`.
- O shell global foi reutilizado, com barra horizontal compacta e layout mestre-detalhe.
- Grupos e categorias passaram a ser carregados do endpoint real `GET /cadastros/grupos`.
- A etapa ficou limitada a visualização, seleção, estados vazios, loading, erro, tema e responsividade básica.
- CRUD permanece pendente por contrato.
