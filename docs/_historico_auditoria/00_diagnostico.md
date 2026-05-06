# Diagnostico tecnico - Brana Cloude

Data da auditoria: 2026-05-01.

## Escopo analisado

Esta auditoria considerou o codigo atual como fonte da verdade. Foram lidos a estrutura do projeto, documentacao existente, scripts, backend, frontend, modelos, rotas, servicos, seguranca, deploy e artefatos operacionais.

O diretorio raiz nao e um repositorio Git, mas `saas/` e um repositorio Git proprio com remoto `https://github.com/institutobrana/branagestao.git`. A documentacao desta pasta usa "Brana Cloude" como nome oficial; "SaaS" aparece apenas como apelido tecnico ou nome historico em caminhos.

## O que esta bem documentado

- Ha boa documentacao historica da migracao EasyDental para Brana Cloude em `docs/`, principalmente agenda, usuarios, permissoes, prestadores, convenios, planos, indices financeiros, tabelas auxiliares, etiquetas e relatorios.
- `saas/README.md` descreve corretamente o runtime principal: FastAPI servindo frontend estatico em `/app`, arquivos em `/frontend` e assets em `/desktop-assets`.
- `saas/backend/CRONOGRAMA_ESTABILIZACAO_STARTUP.md` e `saas/backend/OPERACAO_DEPLOY_FASE4.md` documentam bem a separacao entre bootstrap local, scripts manuais e deploy em producao.
- `saas/render.yaml` deixa explicitas as flags de producao que bloqueiam bootstrap automatico pesado.
- Os scripts de migracao em `saas/backend/scripts/` estao nomeados de forma clara e indicam a origem EasyDental dos dados.

## O que esta errado, desatualizado ou em conflito

- O nome oficial aparece inconsistente: `Brana SaaS`, `Brana Gestao`, `BranaCloud` e "SaaS" aparecem em README, titulo HTML, app FastAPI e arquivos de deploy. O nome oficial deve ser "Brana Cloude".
- A documentacao antiga e fragmentada por data e tarefa. Ela e util como evidencia, mas nao substitui um guia atual para manutencao.
- Alguns documentos e fontes tem encoding quebrado/mojibake. O frontend possui funcoes de correcao em runtime, o que confirma que o problema ainda impacta a base.
- `saas/backend/README.md` cita `saas_app.py` como parte do backend, mas no backend atual esse arquivo tem apenas conteudo minimo; o ponto real de entrada e `saas/backend/main.py`, ou `saas_app.py` da raiz para deploy/import.
- O deploy documentado em `render.yaml` executa `python scripts/aplicar_compatibilidade_schema.py` antes do `uvicorn`, mas tambem define `BRANA_ALLOW_SCHEMA_COMPAT_APPLY=0`. Isso sugere que o script sobe em modo bloqueado/no-op em producao. Deve ser confirmado antes de assumir que migracoes sao aplicadas no deploy.
- Existem muitos backups `.bak_*`, arquivos temporarios e dumps dentro do workspace, especialmente em `saas/frontend/`, `saas/backend/routes/`, `tmp_*`, `output/`, `backups/` e `storage/`. Isso dificulta diferenciar codigo ativo de evidencias historicas.
- Foi encontrada credencial real em `saas/backend/.env.render` durante a auditoria inicial. Na Fase A.2 o arquivo foi removido do workspace; a credencial ainda deve ser rotacionada pelo responsavel da infraestrutura.

## O que esta faltando

- Um mapa unico de funcionalidades, rotas, tabelas e responsabilidades tecnicas.
- Um procedimento claro de onboarding para outro desenvolvedor ou IA.
- Uma politica formal de migrations. Hoje ha `Base.metadata.create_all` local, script de compatibilidade manual e varios scripts ad hoc, mas nao ha Alembic ou sequencia unica versionada.
- Testes automatizados. A busca nao encontrou suite de testes de backend/frontend; existem mocks, scripts e arquivos temporarios, mas nao uma malha de verificacao.
- Documentacao de variaveis de ambiente com classificacao por obrigatoria, opcional, sensivel e ambiente.
- Politica de limpeza de backups, artefatos temporarios e dados sensiveis.
- Contrato de API formal. FastAPI gera OpenAPI, mas as rotas usam muitos `dict`/payloads inline, com poucos schemas Pydantic dedicados.

## Principais riscos tecnicos

- Segredo JWT hardcoded em `saas/backend/security/jwt_handler.py`: corrigido na Fase A.2. O codigo agora exige `JWT_SECRET_KEY` via ambiente.
- Credencial de banco que estava em `saas/backend/.env.render`: arquivo removido na Fase A.2, mas a senha deve ser rotacionada.
- Falta de migrations formais. Mudancas de schema dependem de scripts grandes, hotfixes e `create_all`, o que aumenta risco de divergencia entre local, staging e producao.
- Frontend monolitico em `saas/frontend/app.js` com mais de 1 MB. A manutencao e arriscada, dificil de revisar e propensa a regressao.
- Permissoes centralizadas por modulo, mas parte da seguranca depende de convencao por rota. Novas rotas precisam ser auditadas sempre para evitar endpoints sem `require_module_access`.
- Dados multi-tenant dependem de `clinica_id` em quase todas as tabelas e filtros. Qualquer query sem filtro por clinica pode vazar dados entre clinicas.
- Uso de arquivos locais para modelos/documentos em `saas/storage`. Em Render ou ambiente efemero, persistencia local pode ser perdida se nao houver disco persistente configurado.
- Base com muitos arquivos gerados, backups e temporarios. Isso aumenta risco de deploy acidental de artefatos, exposicao de dados e confusao operacional.
