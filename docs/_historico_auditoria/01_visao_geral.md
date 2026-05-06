# Visao geral - Brana Cloude

## O que e

Brana Cloude e um sistema web para gestao odontologica, com foco em clinicas que precisam administrar pacientes, agenda, procedimentos, tabelas, materiais, financeiro, prestadores, anamnese, documentos, licenca e configuracoes operacionais.

O produto atual roda como uma aplicacao FastAPI com frontend HTML/CSS/JavaScript estatico. O codigo tambem mantem um aplicativo desktop legado em PySide2/SQLite e muitos scripts de migracao EasyDental. O sistema web e a frente principal; o desktop e referencia historica e operacional.

## Para quem serve

- Clinicas odontologicas.
- Cirurgioes dentistas e prestadores vinculados.
- Equipe administrativa de clinica.
- Operadores responsaveis por migrar dados do EasyDental.
- Time tecnico que mantem deploy, banco, licenciamento, documentos e seguranca.

## Principais objetivos

- Reproduzir fluxos importantes do EasyDental em ambiente web.
- Manter dados separados por clinica.
- Permitir cadastro e operacao de usuarios com permissoes por modulo.
- Gerenciar procedimentos, materiais, tabelas, agenda, prestadores, pacientes, tratamentos e financeiro.
- Emitir documentos e PDFs a partir de modelos.
- Controlar licenca, trial, pagamentos e status de conta.

## Componentes principais

- `saas/backend/`: API FastAPI, modelos SQLAlchemy, seguranca, servicos, scripts e deploy.
- `saas/frontend/`: frontend estatico servido pelo backend.
- `saas/storage/`: modelos de documentos/textos por base e por clinica.
- `saas/local_bridge/`: ponte local para operacoes que dependem da maquina do usuario, como assinatura PDF local.
- `docs/`: historico de levantamentos e migracoes.
- `docs_v2/`: documentacao consolidada atual.
- `app/`, `ui/`, `main.py`: aplicativo desktop legado.

## Estado atual

Brana Cloude esta em fase avancada de migracao/adaptacao do EasyDental. Ha varios modulos funcionais, mas tambem ha sinais claros de produto em evolucao: scripts de compatibilidade, hotfixes, backups, prototipos e arquivos temporarios ainda convivem com codigo de producao.

O codigo atual deve ser tratado como fonte da verdade. Documentos antigos devem ser usados como evidencias, nao como especificacao final.
