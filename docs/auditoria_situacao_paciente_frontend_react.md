# Situação do paciente - auditoria funcional e técnica

## Contexto
A tabela `Situação do paciente` é uma exceção própria no Brana Cloud e não deve ser tratada como tabela simples padrão.

O legado do Brana Cloud usa um modal próprio com:
- `Código`
- `Descrição`
- `Mensagem / alerta`
- checkbox `Desativar paciente no sistema`

## Fontes consultadas
### Brana Cloud
- `frontend/app.js`
- `frontend/js/modules/auxiliares.js`
- `backend/routes/cadastros_routes.py`
- `backend/models/financeiro.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`

### Novo frontend React
- `frontend-react/src/features/tabelasAuxiliares/TiposIndicacaoPage.jsx`
- `frontend-react/src/features/tabelasAuxiliares/auxiliaresApi.js`
- `frontend-react/src/components/BranaTable.jsx`
- `frontend-react/src/styles/globals.css`

### EasyDental Desktop / EDS70
- `Y:\EDS70\Dados\eds70.sql`

## Achados no Brana Cloud
O backend atual persiste os campos da auxiliar em `item_auxiliar`:
- `codigo`
- `descricao`
- `inativo`
- `cor_apresentacao`
- `exibir_anotacao_historico`
- `mensagem_alerta`
- `desativar_paciente_sistema`

No frontend antigo, a frente de `situacao_paciente`:
- abre modal próprio;
- exibe `Código` e `Descrição`;
- permite editar `Mensagem / alerta`;
- persiste `desativar_paciente_sistema`;
- reutiliza `item_auxiliar`.

## Achados no EDS70
Foi localizada a tabela de desktop equivalente:
- `_STATUS_PACIENTE`

Estrutura confirmada no SQL:
- `REGISTRO`
- `NOME`
- `CODIGO`
- `DESCRICAO`
- `BLOQUEAR`
- `MENSAGEM`
- `RESERVADO`

Também foi localizada relação funcional com `PESSOAL` por `STATUS`, indicando que a tabela interfere diretamente no cadastro/paciente.

## Diagnóstico funcional
`Situação do paciente` é uma frente de exceção própria.

### Campos confirmados para o novo frontend React
- `codigo`
- `descricao`
- `mensagem_alerta`
- `desativar_paciente_sistema`

### Campos com tratamento visual ou fallback esperado
- `Nome` pode ser tratado como rótulo visual derivado de `descricao`, se necessário para aderência de layout
- `inativo` é persistido no backend, mas o modal legado apontou controle específico de desativação do paciente

### Comportamentos confirmados
- há persistência real em `item_auxiliar`
- o campo `mensagem_alerta` é salvo e devolvido pelo backend
- o checkbox `desativar_paciente_sistema` é persistido no backend
- existe relação com paciente/cadastro via status
- a tabela não deve entrar no lote de tabelas simples

## Limitações encontradas
- não foi localizada, nos artefatos consultados, uma tela visual completa do desktop EasyDental além da definição estrutural da tabela `_STATUS_PACIENTE`
- por isso, a equivalência visual com o desktop deve ser tratada com cautela e validada na implementação futura

## Recomendação
Abrir um contrato próprio de implementação para `Situação do paciente`, com:
- modal específico
- mapeamento explícito dos campos confirmados
- validação do efeito de `desativar_paciente_sistema`
- eventual fallback visual para `Nome`, se necessário
