# Continuidade - Brana Cloude

## Estado para proxima pessoa ou IA

Brana Cloude tem backend FastAPI funcional, frontend estatico grande e muitos modulos migrados do EasyDental. O codigo atual e a fonte da verdade. A documentacao antiga deve ser lida como historico.

## Proximos passos recomendados

1. Corrigir seguranca critica:
   - Segredo JWT hardcoded: corrigido na Fase A.2.
   - Configurar `JWT_SECRET_KEY` em todos os ambientes.
   - Rotacionar credencial de banco exposta.
   - `.env.render`: removido do workspace na Fase A.2.

2. Padronizar identidade:
   - Trocar titulos e READMEs para "Brana Cloude".
   - Evitar "Brana SaaS", "Brana Gestao" e "BranaCloud" como nomes oficiais.

3. Criar base de testes:
   - Login.
   - `/me`.
   - Rota protegida por modulo.
   - Filtro por `clinica_id`.
   - Healthcheck.

4. Formalizar migrations:
   - Escolher Alembic ou fluxo equivalente.
   - Transformar scripts grandes em migrations auditaveis.
   - Documentar ordem de execucao.

5. Reduzir risco frontend:
   - Mapear secoes de `app.js`.
   - Extrair modulos progressivamente.
   - Criar smoke tests manuais ou automatizados para telas criticas.

6. Limpar workspace:
   - Separar backups/temporarios fora do deploy.
   - Confirmar `.gitignore`.
   - Manter `docs_v2` como fonte consolidada.

## Sequencia segura de trabalho

1. Entrar em `saas/` e verificar `git status`.
2. Ler `docs_v2/00_diagnostico.md`.
3. Rodar app local com banco seguro.
4. Validar `/health`.
5. Fazer alteracoes pequenas.
6. Testar fluxo afetado.
7. Atualizar `docs_v2`.
8. Registrar qualquer script executado.

## Modulos mais sensiveis

- Autenticacao e seguranca: `backend/security/`, `auth_routes.py`.
- Licenca/trial: `licenca_routes.py`, `trial_middleware.py`.
- Multi-tenant: qualquer query com `clinica_id`.
- Editor/PDF/assinatura: `editor_textos_routes.py`, `editor_pdf_service.py`, `digital_signature_service.py`, `local_bridge/`.
- Agenda: `agenda_legado_routes.py`, `prestadores_override.js`.
- Frontend monolitico: `frontend/app.js`.

## Perguntas que ainda precisam de decisao

- O storage de modelos em producao tem disco persistente?
- O script de compatibilidade deve rodar no start do Render ou apenas manualmente?
- O prototipo Next.js do editor sera incorporado ou descartado?
- Qual sera o padrao oficial de migrations?
- Qual politica de retencao para backups e documentos de clinica?

## Definicao de pronto para nova fase

Uma nova fase deve ser considerada pronta quando:

- Segredos estiverem fora do codigo.
- `JWT_SECRET_KEY` estiver configurado no Render/local.
- Credenciais expostas estiverem rotacionadas.
- Ambiente local e deploy estiverem documentados e reproduziveis.
- Houver pelo menos testes de smoke dos fluxos criticos.
- `docs_v2` refletir a mudanca feita.
