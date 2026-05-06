# 10 - Continuidade

## Como um novo dev deve comecar

1. Ler `README.md`.
2. Ler `docs/00_master_guide.md`.
3. Rodar o projeto localmente com `backend/.env`.
4. Testar login, `/me`, uma tela de cadastro e uma tela operacional.
5. Ler a rota do modulo que sera alterado.
6. Localizar modelos envolvidos em `backend/models/`.
7. Verificar permissoes em `backend/security/permissions.py`.
8. Alterar pouco, testar e documentar.

## REGRAS PARA NAO QUEBRAR O SISTEMA

### Nao altere sem cuidado

- `backend/main.py`: mexe em startup, bootstrap, middlewares, CORS e servico de frontend.
- `backend/database.py`: qualquer erro impede toda a API de conectar ao banco.
- `backend/security/jwt_handler.py`: erro aqui quebra login, `/me` e toda rota autenticada.
- `backend/security/dependencies.py`: controla usuario atual, setup, conta sistemica e permissoes.
- `backend/security/permissions.py`: matriz de acesso dos modulos.
- `frontend/app.js`: arquivo monolitico; mudancas podem afetar telas distantes.
- `backend/routes/editor_textos_routes.py`: documentos, PDFs, assinatura e local bridge.
- `backend/routes/agenda_legado_routes.py`: agenda, repeticao, avisos e integracoes.
- `backend/scripts/`: scripts podem alterar dados em massa.

### Dependencias criticas

- `DATABASE_URL`: sem ela o banco nao conecta.
- `JWT_SECRET_KEY`: sem ela o JWT nao funciona; nao criar fallback.
- `clinica_id`: base do multi-tenant; nao pode ser ignorado.
- `Authorization: Bearer <token>`: padrao de autenticacao do frontend.
- `current_user`: fonte confiavel para usuario, clinica e permissao.
- PostgreSQL: banco oficial do web atual.

### Pontos sensiveis

- Login e reset de senha.
- Controle de usuarios e perfis.
- Rotas de superadmin.
- Queries sem filtro por `clinica_id`.
- Webhooks e integracoes externas.
- Geracao de PDF/documentos com dados reais.
- Storage por clinica em `storage/modelos/clinicas/`.
- Bootstrap de schema/dados no startup.

### Onde e seguro mexer primeiro

Para uma primeira contribuicao, prefira:

- Documentacao em `docs/`.
- Pequenos textos de UI em `frontend/index.html` ou bloco localizado de `frontend/app.js`.
- Ajustes de validacao simples em uma rota bem delimitada.
- Correcoes em servicos isolados, com teste manual do endpoint.
- Melhorias em `.env.example`, sem credenciais reais.

Evite como primeira tarefa:

- Refatorar `frontend/app.js` inteiro.
- Alterar JWT/autenticacao.
- Alterar schema sem migration.
- Rodar scripts de migracao.
- Mudar filtros de tenant.

## Onde comecar uma nova funcionalidade

1. Defina o modulo funcional: pacientes, agenda, financeiro, documentos, usuarios etc.
2. Ache a rota em `backend/routes/`.
3. Ache o modelo em `backend/models/`.
4. Veja se ja existe servico em `backend/services/`.
5. Confira permissao em `backend/security/permissions.py`.
6. No frontend, procure endpoint ou texto de tela em `frontend/app.js`.
7. Implemente primeiro no backend, depois conecte o frontend.
8. Teste login, permissao, sucesso, erro esperado e tenant.
9. Atualize `docs/` se mudar comportamento.

## Checklist para alterar uma rota

- Identificar modulo de permissao correto.
- Exigir usuario autenticado.
- Filtrar por `current_user.clinica_id`.
- Nao aceitar `clinica_id` do frontend como fonte de verdade.
- Validar dados de entrada.
- Usar commit/transacao com cuidado.
- Retornar erros claros sem vazar detalhes sensiveis.
- Testar sucesso, sem auth, sem permissao e tenant errado quando aplicavel.
- Atualizar documentacao se mudar comportamento.

## Checklist para alterar banco

- Ler modelo atual.
- Procurar rotas e servicos que usam a tabela.
- Criar migration formal ou script aditivo claro.
- Nunca remover coluna/tabela sem plano de rollback.
- Fazer backup antes de migration destrutiva.
- Documentar impacto.

## PROXIMOS PASSOS SUGERIDOS

### Prioridade 1 - seguranca e previsibilidade

1. Criar migrations formais com Alembic ou ferramenta equivalente.
2. Criar testes de smoke para login, `/me`, pacientes, agenda e financeiro.
3. Criar testes de isolamento multi-tenant para rotas principais.
4. Revisar rotas publicas e webhooks antes de exposicao externa.
5. Garantir que nenhum dado real entre no GitHub.

### Prioridade 2 - manutencao

1. Modularizar `frontend/app.js` por dominio.
2. Extrair servicos de rotas grandes.
3. Separar schemas Pydantic hoje embutidos em rotas grandes.
4. Padronizar respostas de erro.
5. Criar convencao para logs sem dados sensiveis.

### Prioridade 3 - evolucao do produto

1. Fortalecer multi-tenant com testes e revisao sistematica de queries.
2. Melhorar configuracoes por clinica e permissoes por perfil.
3. Evoluir area de documentos/PDF com armazenamento controlado.
4. Formalizar integracoes Google, WhatsApp, Mercado Pago e assinatura digital.
5. Melhorar experiencia de setup para novas clinicas.

### Dividas tecnicas importantes

- Ausencia de migrations formais.
- `frontend/app.js` muito grande.
- Rotas de dominio muito extensas.
- Alguns nomes historicos ainda usam SaaS internamente.
- Bootstrap de schema/dados ainda mistura inicializacao e compatibilidade.
- Cobertura automatizada insuficiente.

## Padrao de entrega para futuras IAs

Ao concluir uma tarefa, informe:

- Arquivos alterados.
- Validacoes executadas.
- O que nao foi validado.
- Riscos remanescentes.
- Acoes manuais para CEO/operador, se houver.

## Regra de ouro

O Brana Cloude manipula dados clinicos, financeiros e documentos. Priorize seguranca, isolamento por clinica e previsibilidade antes de refatoracoes grandes.