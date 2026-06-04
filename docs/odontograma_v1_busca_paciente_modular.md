# Odontograma V1 - busca de paciente em modulo proprio

## 1. Objetivo
Separar a busca de paciente do fluxo principal do odontograma V1, permitindo localizar e abrir o paciente por codigo, primeiro nome ou nome completo sem concentrar comportamento em `frontend/app.js`.

## 2. Escopo
- Campo de busca no bloco `Paciente` da shell odontologica.
- Pesquisa de pacientes por `q` no backend de cadastros.
- Lista de resultados com selecao.
- Abertura do paciente no contexto atual da ficha e do odontograma.
- Preservacao do modo somente leitura.

## 3. Confirmacao de etapa
Esta etapa foi executada com foco em modularizacao do frontend, sem alteracao de banco e sem criar escrita.

## 4. Arquivos envolvidos
- `frontend/js/modules/odontograma-v1-paciente-search.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/index.html`

## 5. Contrato funcional
- O usuario digita codigo, primeiro nome ou nome completo.
- O modulo consulta `/cadastros/pacientes?q=...`.
- O resultado renderiza lista clicavel de pacientes.
- Ao selecionar um item, o paciente e aberto no contexto da ficha.
- O odontograma reaproveita o paciente aberto para atualizar sua leitura.

## 6. O que o modulo passou a concentrar
- Render do input de busca.
- Render da lista de resultados.
- Estado visual do paciente atual.
- Abertura de paciente via contrato existente da ficha.

## 7. O que permaneceu fora do modulo
- Regras de carregamento do odontograma.
- Resumo de intervencoes.
- Arcada.
- Tratamentos.
- Escrita clinica.

## 8. Validacoes tecnicas
- `node --check` em `frontend/js/modules/odontograma-v1-paciente-search.js`
- `node --check` em `frontend/js/modules/odontograma-v1.js`
- Conferencia da ordem de carregamento no `frontend/index.html`

## 9. Confirmacoes operacionais
- Nenhuma escrita foi executada.
- Nenhum banco foi alterado.
- `frontend/app.js` nao foi alterado.
- A modularizacao foi preservada.
- O comportamento esperado continua sendo de leitura e abertura de contexto.

## 10. Riscos ou pontos de atencao
- Evitar duplicar a logica de carregamento de paciente ja existente na ficha principal.
- Evitar converter a busca em modal monolitico.
- Manter a lista de resultados leve e previsivel.

## 11. Recomendacao para a proxima subetapa
Seguir para o contexto de tratamento, que deve depender da busca de paciente ja modularizada.

## 12. Registro para roadmap
Busca de paciente do Odontograma V1 separada em modulo proprio, com pesquisa por texto e abertura de paciente reaproveitando o contrato da ficha principal.
