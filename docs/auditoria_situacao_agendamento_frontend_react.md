# Situação de agendamento - auditoria e implementação no frontend React do Brana Cloud

## Contexto
A tabela `Situação de agendamento` é uma frente de exceção no Brana Cloud. Ela não deve ser tratada como tabela simples padrão.

A auditoria funcional do legado confirmou os campos reais persistidos no Brana Cloud:
- `codigo`
- `descricao`
- `inativo`
- `cor_apresentacao`
- `exibir_anotacao_historico`
- `mensagem_alerta`
- `desativar_paciente_sistema`

## Fonte funcional do Brana Cloud legado
- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`
- `backend/routes/cadastros_routes.py`
- `backend/scripts/sincronizar_auxiliares_easydental.py`
- `backend/routes/agenda_legado_routes.py`

## Referência visual do Terra Relva
- `D:\TERRA RELVA APP\frontend-react\src\pages\admin\TabelasAuxiliaresPage.tsx`

## O que foi implementado no React
- inclusão de `Situação de agendamento` no catálogo de tabelas auxiliares
- modal próprio para a frente de exceção
- campo de código visível
- campo de descrição
- seletor de cor de apresentação
- checkbox de exibição de anotação no histórico
- campo de mensagem/alerta
- checkbox de ocultar agendamento

## O que ficou fora do contrato comprovado
- não foi identificada no legado uma flag separada e explícita para `considerar falta do cliente` além das flags confirmadas acima
- portanto, essa frente foi documentada apenas com os campos efetivamente comprovados no legado e no backend atual

## Validação executada
- navegação autenticada em `http://127.0.0.1:5173/app/tabelas-auxiliares`
- abertura do modal de `Situação de agendamento`
- verificação de que `Grupo de medicamento` não regrediu
- verificação de que uma tabela simples como `Tipos de indicação` não regrediu

## Conclusão
A frente foi tratada como exceção própria e ficou implementada com o contrato funcional confirmado pelo legado, mantendo o visual alinhado ao padrão do Terra Relva e preservando o comportamento das tabelas simples.


## Descoberta adicional da listagem
A listagem do frontend React estava vazia porque a tela buscava o tipo `Situa??o de agendamento`, enquanto o backend/legado retorna os registros sob o tipo can?nico `Situa??o do agendamento`.

### Mapeamento validado
- tipo consumido pela API: `Situa??o do agendamento`
- tipo persistido e retornado pelo backend: `Situa??o do agendamento`
- a variante `Situa??o de agendamento` n?o retorna registros na API atual

### Resultado
Ap?s ajustar o cat?logo do React para usar o tipo can?nico, a tabela passou a carregar os 15 registros reais existentes no banco, sem regress?o no modal ou na paleta de cores.


## Descoberta adicional da grade
A listagem do frontend React passou a refletir o padr??o estrutural de 6 colunas usado nas tabelas auxiliares: C??digo, Nome, Descri????o, Cor, Bloqueio e Status.

### Mapeamento visual validado
- 4?? coluna: cor do item
- 5?? coluna: cadeado visual
- 6?? coluna: status visual

### Observa????o
A tela exibe uma coluna de sele????o ?? esquerda, al??m das 6 colunas de dados/estado, o que preserva o padr??o de intera????o da grade sem alterar a regra de neg??cio.
