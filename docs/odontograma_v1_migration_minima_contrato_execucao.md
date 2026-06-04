# Odontograma Brana - Migration minima V1 e contrato de execucao

## 1. Objetivo da subetapa

Criar apenas a estrutura persistente minima da V1 do odontograma Brana, sem implementar backend funcional, frontend, UI ou logica de tela.

Esta subetapa existe para preparar a base relacional que sera usada pelas proximas leituras do odontograma, mantendo a modularizacao futura separada por responsabilidade.

## 2. Escopo exato

- criar migration minima controlada
- manter o modulo como especifico de Odontologia
- nao criar tela
- nao criar rota funcional
- nao criar service funcional
- nao criar renderizacao frontend
- nao mexer em `app.js`
- nao alterar seeds separadas
- nao alterar arquivos do EasyDental

## 3. O que foi criado na migration

A migration minima cria cinco estruturas:

- `odontograma_intervencao_status`
- `odontograma_arcada_slots`
- `odontograma_intervencoes`
- `odontograma_dentes`
- `odontograma_faces`

Tambem foram criados indices minimos de apoio e o seed basico dos status de intervencao da V1:

- `Observada`
- `Realizar`
- `Realizada`

Aplicacao local da migration:

- concluida no banco local do projeto nesta rodada

## 4. O que ficou de fora

- backend funcional de leitura
- rotas do odontograma
- services do odontograma
- schemas do odontograma
- qualquer tela nova
- qualquer alteracao em frontend
- qualquer alteracao em `app.js`
- qualquer importacao de bitmap legado
- qualquer paridade visual completa com EasyDental
- qualquer automacao clinica avancada

## 5. Justificativa do conjunto minimo de tabelas

O conjunto foi mantido pequeno para cobrir apenas o necessario da V1:

- `odontograma_intervencao_status` guarda o lookup basico de status
- `odontograma_arcada_slots` guarda a arcada base por tratamento
- `odontograma_intervencoes` guarda o procedimento principal da V1
- `odontograma_dentes` guarda o vinculo anatomico por dente
- `odontograma_faces` deixa a face preparada como apoio opcional

O contrato tecnico final da V1 ja havia separado claramente:

- estrutura visual
- procedimentos
- status
- dente
- face opcional

Esta migration segue essa separacao sem misturar narrativa clinica, renderizacao ou simbolos avançados.

## 6. Chaves e vinculos principais

- `odontograma_arcada_slots.tratamento_id -> tratamento.id`
- `odontograma_arcada_slots.paciente_id -> pacientes.id`
- `odontograma_arcada_slots.clinica_id -> clinicas.id`
- `odontograma_intervencoes.tratamento_id -> tratamento.id`
- `odontograma_intervencoes.paciente_id -> pacientes.id`
- `odontograma_intervencoes.clinica_id -> clinicas.id`
- `odontograma_intervencoes.prestador_id -> prestador_odonto.id`
- `odontograma_intervencoes.procedimento_id -> procedimento.id`
- `odontograma_intervencoes.status_id -> odontograma_intervencao_status.id`
- `odontograma_dentes.intervencao_id -> odontograma_intervencoes.id`
- `odontograma_faces.intervencao_id -> odontograma_intervencoes.id`

Restricoes adicionais:

- unicidade de `codigo` em status
- unicidade de `tratamento_id + slot_ordem` na arcada
- unicidade de `intervencao_id + numero_dente_fdi` em dentes e faces

## 7. Riscos controlados

- evitar tabelas supérfluas
- evitar depender de bitmap legado
- evitar tratar arcada como dente clinico puro
- evitar tratar historico como tabela principal de procedimento
- evitar concentrar logica em monolito backend
- evitar front-end prematuro sem contrato de dados

## 8. Onde testar antes de avancar

Antes da proxima subetapa, testar:

- se a migration criou as cinco tabelas esperadas
- se os indices foram criados sem erro
- se os tres status basicos foram seedados
- se as FKs apontam para as tabelas existentes do Brana
- se nada do frontend foi impactado
- se `app.js` permaneceu inalterado
- se nenhuma tela nova foi criada

## 9. Registro para roadmap

- inicio da subetapa tecnica do odontograma Brana
- criacao da migration minima da V1
- manutencao da diretriz de modularizacao futura
- sem frontend nesta etapa
- sem tela nesta etapa
- proxima subetapa sugerida: contratos, models e schemas backend de leitura
