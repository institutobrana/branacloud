# Relatorio Fase A.2 - Brana Cloude

Data: 2026-05-01.

Objetivo: corrigir e preparar riscos criticos sem alterar funcionalidades existentes.

## Seguranca

Corrigido:

- Removido segredo JWT hardcoded de `saas/backend/security/jwt_handler.py`.
- `JWT_SECRET_KEY` agora e obrigatorio via variavel de ambiente.
- Sem fallback para segredo padrao.
- `saas/backend/.env.render` foi removido do workspace.
- `saas/.env.example` foi atualizado com variaveis obrigatorias e placeholders sem dados reais.
- `saas/render.yaml` passou a declarar `JWT_SECRET_KEY` como variavel `sync: false`.

Validacao executada:

- Busca pelo segredo antigo e pela credencial exposta nao retornou ocorrencias nos arquivos auditados.
- Criacao e decodificacao de JWT funcionaram com `JWT_SECRET_KEY` definido.
- Criacao de JWT falhou explicitamente sem `JWT_SECRET_KEY`.

Pendente:

- CEO/infra deve configurar `JWT_SECRET_KEY` no Render.
- CEO/infra deve rotacionar a senha do banco que apareceu em `.env.render`.
- Confirmar no GitHub/remoto que `.env.render` nunca foi commitado; se foi, tratar como vazamento definitivo e rotacionar imediatamente.

## Multi-tenant

Pontos seguros:

- Rotas funcionais usam `get_current_user`, `require_module_access` ou ambos.
- A maioria das rotas com banco filtra por `current_user.clinica_id`.
- Modelos operacionais possuem `clinica_id` como separador de tenant.
- `TrialMiddleware` popula tenant a partir do usuario autenticado.
- Rotas superadmin estao isoladas em `superadmin_routes.py` e usam validacao propria.

Pontos que exigem atencao:

- `auth_routes.py`: publico por natureza; manter validacoes fortes e evitar retorno de dados de outras clinicas.
- `licenca_routes.py`: algumas rotas precisam funcionar com licenca vencida; revisar sempre escopo por usuario/clinica.
- `cadastros_routes.py`: permissao e aplicada por endpoint; endpoint novo precisa declarar dependencia correta.
- `relatorios_routes.py`: nao consulta banco nem usa `clinica_id`; risco de tenant baixo, mas endpoint deve continuar autenticado e protegido por `relatorios`.
- `TenantMiddleware`: aceita `X-Tenant-ID`; nao usar esse header como autorizacao.
- `superadmin_routes.py`: consultas globais sao intencionais, mas qualquer endpoint novo deve exigir superadmin.

Nenhuma regra de negocio multi-tenant foi alterada nesta fase.

## Banco de dados

Constatado:

- Nao ha Alembic ou migrations formais.
- Existem scripts manuais de compatibilidade e schema em `saas/backend/scripts/`.
- Existem SQLs pontuais em `saas/backend/scripts/sql/`.
- `render.yaml` chama `aplicar_compatibilidade_schema.py`, mas flags de producao bloqueiam aplicacao automatica.

Plano inicial proposto:

1. Introduzir Alembic em `saas/backend`.
2. Criar migration baseline a partir do schema atual de producao.
3. Congelar scripts antigos como historico operacional.
4. Toda nova mudanca de schema deve ter migration revisavel, idempotente quando possivel e com plano de rollback.
5. Scripts de dados devem ficar separados de migrations de schema.
6. Deploy deve rodar migration em etapa controlada, nao como efeito colateral de import da API.

Nenhuma migration foi aplicada nesta fase.

## Frontend

Constatado:

- `saas/frontend/app.js` tem aproximadamente 1,7 MB e concentra estado, chamadas API, renderizacao e fluxos.
- Existem muitos backups `app.js.bak_*`.
- `saas/frontend/prestadores_override.js` tambem e grande e complementa a agenda/prestadores.
- Existe prototipo Next.js/TipTap em `saas/frontend/prototipos/editor-textos-next/`, fora do runtime principal.

Plano inicial de separacao:

1. Criar inventario de secoes de `app.js` por modulo funcional.
2. Extrair primeiro utilitarios puros: formatacao, datas, moeda, DOM helpers, `requestJson`.
3. Extrair clientes API por dominio: auth, usuarios, agenda, financeiro, procedimentos, materiais, documentos.
4. Extrair componentes/telas de baixo risco, mantendo API publica de funcoes usada pelo HTML.
5. Manter `app.js` como orquestrador temporario.
6. Adicionar smoke tests manuais/automatizados antes de cada extracao.

Nenhuma refatoracao frontend foi feita nesta fase.

## Arquivos alterados

- `saas/backend/security/jwt_handler.py`
- `saas/.env.example`
- `saas/render.yaml`
- `saas/backend/.env.render` removido
- `docs_v2/00_diagnostico.md`
- `docs_v2/06_seguranca.md`
- `docs_v2/07_deploy.md`
- `docs_v2/08_problemas.md`
- `docs_v2/CONTINUIDADE.md`
- `docs_v2/09_relatorio_fase_a2.md`
- `AGENTS.md`
