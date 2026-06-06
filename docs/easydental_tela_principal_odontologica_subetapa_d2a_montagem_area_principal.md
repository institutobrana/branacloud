# Odontograma Brana - Subetapa D2-A: montagem da area principal da tela odontologica

## Objetivo
- Definir e implementar o ponto de montagem da tela odontologica principal na area de workspace do Brana Cloud.
- Preservar a entrada secundaria por botao na Ficha Pessoal > Historico.
- Manter o fallback legado do odontograma V1 sem alterar `frontend/app.js` nem `frontend/index.html`.

## O que foi feito
- Foi criado um fluxo especifico para a montagem da tela odontologica no workspace principal.
- O ponto de montagem passou a usar `#workspace-empty` quando disponivel.
- Quando `#workspace-empty` existe, a montagem substitui seu conteudo por um host tecnico isolado.
- Quando `#workspace-empty` nao existe, o fluxo usa `main.workspace` como fallback de montagem.
- Foi mantida a entrada secundaria `abrirTelaPrincipalOdontologicaPorPaciente(contexto)` para o caminho acionado pelo botao `Odontograma`.
- Foi adicionada a entrada principal `abrirTelaPrincipalOdontologicaNoWorkspace(contexto)` para a area central do sistema.

## Contrato ajustado
- Foi incluido o origen `workspace-principal` no contrato da tela odontologica.
- O contrato continua aceitando a origem `ficha-pessoal-historico` para a entrada secundaria.
- O contexto principal segue sendo normalizado e validado antes da renderizacao.

## Comportamento observado
- A renderizacao principal monta o esqueleto visual odontologico na area de workspace.
- A entrada secundaria segue montando o esqueleto visual em container isolado.
- O marcador tecnico e removido quando a renderizacao visual conclui com sucesso.
- Em caso de indisponibilidade dos modulos visuais, o marcador tecnico continua como fallback.

## Validacao tecnica
- `node --check` passou para:
  - `frontend/js/modules/tela-principal-odontologica-assets.js`
  - `frontend/js/modules/tela-principal-odontologica-odontograma.js`
  - `frontend/js/modules/tela-principal-odontologica-layout.js`
  - `frontend/js/modules/tela-principal-odontologica-estado.js`
  - `frontend/js/modules/tela-principal-odontologica-entrada.js`
  - `frontend/js/modules/tela-principal-odontologica-contratos.js`
  - `frontend/js/modules/odontograma-v1.js`
- Simulacao em DOM fake confirmou:
  - entrada secundaria com `ok: true`
  - entrada principal com `ok: true`
  - origem `workspace-principal` fluindo corretamente
  - host principal montado dentro do workspace
  - entrada secundaria preservada

## Riscos e limites
- Nenhum backend foi alterado.
- Nenhum banco, schema, migration, seed ou endpoint foi alterado.
- Nenhum asset do EasyDental foi copiado.
- Nenhum arquivo do EasyDental foi alterado.
- `frontend/app.js` e `frontend/index.html` permaneceram intactos.
- A trilha legada continua presente como fallback.

## Proxima etapa sugerida
- D2-B: ligar a abertura principal da tela odontologica ao fluxo real de inicializacao do sistema, se essa for a diretriz de produto.
- Alternativamente, validar a experiencia visual no navegador real antes de ampliar a integracao.
