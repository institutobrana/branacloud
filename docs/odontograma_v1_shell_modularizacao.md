# Odontograma V1 - shell odontologica modular

## 1. Objetivo
Separar a moldura visual principal do odontograma V1 em um modulo proprio, mantendo a tela em leitura, sem escrita e sem concentrar a montagem em `frontend/app.js`.

## 2. Escopo
- Extracao da shell visual principal do odontograma V1.
- Separacao da estrutura de tela em modulo dedicado.
- Preservacao do fluxo de leitura atual.
- Integracao com o layout e com o render da arcada sem monolito.

## 3. Confirmacao de etapa
Esta etapa foi executada como evolucao tecnica da tela, com foco em modularizacao e sem alteracao de banco.

## 4. Arquivos envolvidos
- `frontend/js/modules/odontograma-v1-shell.js`
- `frontend/js/modules/odontograma-v1.js`
- `frontend/index.html`

## 5. O que a shell passou a concentrar
- Hero principal do odontograma V1.
- Barra de contexto com paciente e tratamento.
- Area central de arcada.
- Rail lateral de legenda e intervencoes.
- Linha de feedback e estado visual da tela.

## 6. O que permaneceu fora da shell
- Leitura de paciente.
- Leitura de tratamentos.
- Leitura de resumo.
- Render da arcada.
- Render de intervencoes.
- Regras de estado e refresh.

## 7. Validacoes tecnicas
- `node --check` em `frontend/js/modules/odontograma-v1-shell.js`
- `node --check` em `frontend/js/modules/odontograma-v1.js`
- Conferencia da ordem de carregamento no `frontend/index.html`

## 8. Confimacoes operacionais
- Nenhuma escrita foi executada.
- Nenhum banco foi alterado.
- `frontend/app.js` nao foi alterado.
- A modularizacao foi preservada.
- A tela continua em modo de leitura.

## 9. Riscos ou pontos de atencao
- Evitar que novas responsabilidades voltem para o modulo principal.
- Evitar duplicacao desnecessaria de estilos entre shell e render.
- Manter a shell apenas como moldura da tela.

## 10. Recomendacao para a proxima subetapa
Seguir para a busca de paciente em modulo proprio, mantendo a shell como base estavel da tela principal odontologica.

## 11. Registro para roadmap
Shell odontologica modular do Odontograma V1 separada em arquivo proprio, com index atualizado para carregar a moldura antes do fluxo principal.
