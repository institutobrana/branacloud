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
- `frontend-react/src/app/App.jsx`: controla o roteamento do novo frontend React e agora precisa respeitar `appPath()` para publicar em `/react` sem quebrar `/app`.
- `Dockerfile`: agora faz build multi-stage do React antes de publicar a imagem.
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

### Publicacao do frontend React

1. Manter `/app` no legado ate a validacao final do React.
2. Validar `/react` com login, menus, refresh e assets.
3. Quando aprovar, trocar `/app` para o React e manter `/legado` como contingencia temporaria.
4. Registrar a revisao da task ECS usada em cada corte.

## Como comecar um deploy AWS

1. Ler `docs/deploy/release_contract.md`.
2. Ler `docs/deploy/release_runner.md`.
3. Ler `docs/deploy/release_configuration.md`.
4. Ler `docs/deploy/release_git_audit.md`.
5. Ler `docs/incidente_deploy_ecs_canary_20260729.md` como referencia historica do incidente de 2026-07-29.
6. Confirmar que o servico continua em `default-brana-hml-backend:16` antes de qualquer nova publicacao.
7. Exigir clone limpo, build local e validacao do mecanismo real de promocao antes de escrever em AWS.

### Publicacao AWS com CANARY

1. Tratar `docs/deploy/release_contract.md` como fonte unica do contrato de release.
2. Tratar `docs/deploy/release_runner.md` como entrada operacional de leitura e validacao.
3. Tratar `docs/deploy/release_configuration.md` como fonte de configuracao do ambiente, nao como guia de execucao.
4. Bloquear qualquer deploy que assuma rolling quando o servico estiver em CANARY.
5. Exigir os quatro portoes antes de qualquer escrita em AWS.

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

### Continuidade de schema

O caminho recomendado para evolucao do banco passa a ser:

1. baseline one-shot versionado;
2. validacao em banco descartavel;
3. provisionamento inicial de tenant em comando separado, se necessario;
4. startup permanente sem DDL;
5. revisao antes da publicacao definitiva.

O contrato operacional do passo 3 esta em `docs/contrato_provisionamento_tenant_inicial_aws.md`.

## Corte real da migracao integral

- O corte real da migracao integral foi concluido em `2026-07-18`.
- O snapshot pre-corte foi criado com o identificador `brana-hml-postgres-pre-cut-20260718-073104`.
- O dump final foi transportado temporariamente por S3 criptografado e removido apos o uso.
- A restauracao no RDS foi executada por task ECS one-shot separada, sem alterar o servico permanente.
- O endpoint publico do backend permaneceu ativo e respondeu `200` em `/health`, `/app` e `/frontend/`.
- O login funcional conhecido respondeu `200` em `/login` e `/me` com contexto coerente.
- A validacao read-only posterior encontrou `65` tabelas publicas e conteudo real carregado; `brana_schema_versions` foi restabelecido para `1` apos o ajuste idempotente do marcador.
- O armazenamento local `storage/modelos/clinicas/` foi confirmado com 260 arquivos, ainda tratado como persistencia externa em frente separada.

## Contrato do tenant inicial

- `--plan`: somente leitura, com seis identificadores obrigatorios, sem senha e sem ACK.
- `--apply`: exige os seis identificadores, senha inicial via secret ou prompt autorizado e ACK explicito.
- `--validate`: somente leitura, sem senha original e sem ACK.

## Padrao de entrega para futuras IAs

Ao concluir uma tarefa, informe:

- Arquivos alterados.
- Validacoes executadas.
- O que nao foi validado.
- Riscos remanescentes.
- Acoes manuais para CEO/operador, se houver.

## Regra de ouro

O Brana Cloude manipula dados clinicos, financeiros e documentos. Priorize seguranca, isolamento por clinica e previsibilidade antes de refatoracoes grandes.

## Frente em documentacao

A frente `Conta corrente do cirurgião` possui contrato alvo documentado em `docs/auditoria_conta_corrente_cirurgiao.md`. O proximo micropasso seguro e transformar essa documentacao em plano tecnico de implementacao incremental, sem mexer ainda em backend ou frontend.
O contrato mestre de datas da frente esta em `docs/contrato_mestre_campos_data_brana_cloude.md` e deve ser consultado antes de qualquer futura mudanca em inputs de data, filtros por periodo ou modais financeiros.

## Fechamento-T2B — Frente B Configura horarios de agendamento

`Configura horarios de agendamento` esta **CONCLUIDA / HOMOLOGADA** como
frente independente. O fechamento consolidado esta em
`docs/fechamento_t2b_configura_horarios_agendamento.md`.

O escopo documentado inclui a abertura por Prestador, Escala, Bloqueios,
Apresentacao, Visualizacao, persistencia da configuracao, CRUD de bloqueios,
contratos Ok/Cancelar/X, data/hora e light/dark. O botao Agenda de Prestadores
permanece apenas como ponto de entrada.

Unidades de atendimento e Motivos/Situacao de agendamento permanecem em
frentes separadas. Antes da publicacao ainda ficam a auditoria seletiva do
diff, os testes finais e a preparacao de stage/commit/push.

## Fechamento-T2A — Frente Prestadores

`Cadastro -> Corpo clinico / Prestadores` esta funcionalmente concluido e
homologado para documentacao seletiva. O fechamento consolidado esta em
`docs/fechamento_t2a_prestadores.md`.

O escopo inclui Prestadores, suas quatro abas, Credenciamentos e Comissoes.
O botao `Agenda` e apenas uma entrada para `Configura horarios de
agendamento`, que continua sendo frente independente. O motor financeiro de
aplicacao e precedencia permanece futuro.

## Fechamento da frente DATA

- DATA-P1 a DATA-P5 foram concluídas.
- O parser de datas passou a ser reutilizavel.
- Os dois consumidores validados ficaram homologados em runtime.
- A interacao visual compartilha o mesmo contrato, mas continua local aos consumidores.
- A extracao de componente visual compartilhado fica para DATA-P6 ou frente equivalente futura.
