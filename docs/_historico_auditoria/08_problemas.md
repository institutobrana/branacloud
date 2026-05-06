# Problemas, bugs e dividas tecnicas - Brana Cloude

## Criticos

1. Falta de migrations formais para PostgreSQL.
2. Risco multi-tenant se novas rotas nao filtrarem por `clinica_id`.
3. Senha do banco que apareceu em `saas/backend/.env.render` precisa ser rotacionada, mesmo apos remocao do arquivo.

## Altos

1. Frontend principal concentrado em `saas/frontend/app.js` com mais de 1 MB.
2. Muitos arquivos `.bak_*`, temporarios e dumps no workspace.
3. Ausencia de suite de testes automatizados.
4. Uso de storage local para documentos/modelos sem garantia explicita de persistencia no deploy.
5. `render.yaml` chama script de compatibilidade no start, mas flags de producao bloqueiam aplicacao. Precisa confirmar o comportamento esperado.

## Corrigidos na Fase A.2

1. JWT deixou de usar segredo hardcoded; `JWT_SECRET_KEY` agora e obrigatorio por variavel de ambiente.
2. `saas/backend/.env.render` foi removido do workspace.
3. `saas/.env.example` foi atualizado com placeholders e variaveis obrigatorias.
4. Foi criado relatorio multi-tenant em `docs_v2/09_relatorio_fase_a2.md`.

## Medios

1. Nome do produto inconsistente em README, titulo HTML, FastAPI e deploy.
2. Encoding quebrado em documentos e parte do codigo/textos.
3. Poucos schemas Pydantic dedicados; muitos payloads sao tratados inline.
4. Prototipo Next.js do editor convive com frontend estatico sem plano de integracao claro.
5. Rotas e scripts grandes dificultam revisao.

## Baixos

1. Documentacao antiga tem valor historico, mas e dificil de navegar.
2. Existem arquivos de debug como `tmp_*`, dumps HTML e relatorios grandes na raiz.
3. README do backend ainda usa nome antigo e estrutura parcialmente desatualizada.

## Plano recomendado de correcao

Prioridade 1:

- Rotacionar credenciais expostas.
- Configurar `JWT_SECRET_KEY` em todos os ambientes.
- Remover `.env.render` e validar `.gitignore`.
- Criar teste simples de login, `/me`, tenant e uma rota protegida.

Prioridade 2:

- Introduzir Alembic ou outro fluxo formal de migrations.
- Separar `app.js` por modulos ou iniciar migracao controlada para arquitetura frontend modular.
- Criar checklist obrigatorio para novas rotas.
- Revisar persistencia de `saas/storage` no deploy.

Prioridade 3:

- Padronizar nome "Brana Cloude" em UI/docs/deploy.
- Limpar backups/temporarios do workspace ativo.
- Corrigir encoding de docs/codigo quando nao causar regressao.
- Consolidar scripts de migracao com dry-run, logs e idempotencia documentada.
