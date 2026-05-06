# 09 - Problemas e Riscos

## Sem migrations formais

O projeto ainda depende de `Base.metadata.create_all`, hotfixes aditivos no startup e scripts manuais.

Risco: schema divergir entre ambientes.

Prioridade: alta. Criar migrations com Alembic ou equivalente.

## Frontend monolitico

`frontend/app.js` tem mais de 23 mil linhas.

Risco: alteracoes pequenas podem causar regressao em modulos distantes.

Prioridade: alta. Separar gradualmente por modulos, com camada comum de API/auth/estado.

## Rotas grandes

Arquivos grandes: `editor_textos_routes.py`, `agenda_legado_routes.py`, `cadastros_routes.py`, `procedimentos_routes.py`, `prestadores_routes.py`, `preferences_routes.py`.

Risco: manutencao dificil e poucos limites claros.

Prioridade: media/alta. Extrair servicos e schemas por dominio.

## Referencias historicas

Ainda existem nomes como `Brana SaaS`, `SAAS_DIR` e comentarios antigos.

Risco: confusao em manutencao e quebra ao mover pastas.

Prioridade: media. Corrigir aos poucos, com teste por modulo.

## Dados sensiveis

O sistema manipula pacientes, financeiro, documentos e modelos por clinica.

Risco: versionar dados reais acidentalmente.

Prioridade: alta. Nunca commitar `backend/.env`, dumps, `Dados/`, documentos reais ou `storage/modelos/clinicas/`.

## Multi-tenant

A regra correta e filtrar por `current_user.clinica_id`.

Risco: vazamento entre clinicas.

Prioridade: critica. Criar testes automatizados de tenant para rotas principais.

## Webhook e integracoes externas

Mercado Pago, Google, WhatsApp, email e assinatura PDF dependem de variaveis externas.

Risco: falhas silenciosas, credenciais vazadas ou endpoints expostos sem validacao.

Prioridade: media/alta. Validar segredos, origem de webhook e logs sem dados sensiveis.

## Healthcheck

Em validacao local, `/health` pode responder 401 dependendo de middleware/configuracao.

Risco: monitoramento interpretar API saudavel como indisponivel.

Prioridade: media. Revisar excecao explicita de `/health` se houver monitoramento publico.

## Ambientes virtuais locais

`.venv/` e `venv/` podem existir localmente para execucao. Elas nao devem ir para GitHub.

Risco: commit acidental de dependencias e arquivos enormes.

Prioridade: media. Confirmar `.gitignore` e revisar antes de commit.

## Testes automatizados insuficientes

Nao ha suite robusta cobrindo login, multi-tenant, financeiro, agenda, documentos e permissoes.

Risco: regressao funcional.

Prioridade: alta. Criar testes de smoke e testes por dominio.