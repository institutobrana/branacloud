# 03 - Mapa do Codigo

## Leitura em 2 minutos

Se voce precisa se orientar rapido:

- Entrada do backend: `backend/main.py`.
- Conexao com banco: `backend/database.py`.
- Rotas da API: `backend/routes/`.
- Regras reutilizaveis: `backend/services/`.
- Autenticacao e permissoes: `backend/security/`.
- Modelos/tabelas: `backend/models/`.
- Frontend principal: `frontend/index.html` e `frontend/app.js`.
- Configuracao local: `backend/.env`.

## Estrutura principal

```text
BRANA CLOUD/
  backend/              API FastAPI, modelos, rotas, servicos e scripts
  frontend/             HTML e JavaScript estatico servido pelo backend
  assets/               imagens e assets usados pela interface
  local_bridge/         ponte local para integracoes com aplicativos locais
  storage/modelos/base/ modelos/documentos base
  storage/modelos/clinicas/ dados e modelos por clinica; nao versionar
  docs/                 documentacao oficial atual
  .env.example          exemplo seguro de ambiente
  config.web.env.example exemplo especifico do backend web
  README.md             guia rapido
  AGENTS.md             instrucoes para IAs
```

## Papel de cada pasta

`backend/`: contem a aplicacao FastAPI. E onde ficam entrada, rotas, modelos, banco, seguranca e servicos.

`frontend/`: contem a interface web estatica. O backend monta esta pasta em `/frontend` e entrega a aplicacao em `/app`.

`assets/`: imagens e recursos usados pela interface, incluindo assets historicos ainda referenciados.

`local_bridge/`: ponte para tarefas locais, como integracoes com aplicativos do computador. Trate como parte sensivel quando houver configuracao local.

`storage/modelos/base/`: modelos documentais base. Dados por clinica nao devem ser versionados.

`storage/modelos/clinicas/`: storage real por clinica. Para a clinica `1`, os modelos ativos ficam em `storage/modelos/clinicas/1`. O backend pode resolver arquivos por caminho registrado, fallback recursivo dentro da pasta da clinica e, por ultimo, fallback base compativel.

`docs/`: documentacao oficial atual.

## Backend em detalhe

- `backend/main.py`: entrypoint. Carrega `backend/.env`, cria `FastAPI`, registra rotas, configura CORS/middlewares, executa bootstrap quando habilitado e serve frontend.
- `backend/database.py`: le `DATABASE_URL`, cria `engine`, `SessionLocal` e `Base`.
- `backend/requirements.txt`: dependencias Python.
- `backend/models/`: classes SQLAlchemy. Cada arquivo representa uma area do banco.
- `backend/routes/`: endpoints HTTP. Normalmente cada arquivo representa um modulo funcional.
- `backend/services/`: logica reutilizavel fora das rotas, como email, PDF, bootstrap, modelos, indices e Google Calendar.
- `backend/security/`: autenticacao, JWT, permissoes, usuario atual, tenant, superadmin e trial.
- `backend/schemas/`: schemas Pydantic quando separados das rotas.
- `backend/scripts/`: scripts operacionais/migracao. Leia antes de rodar; alguns alteram muitos dados.
- `backend/data/pdf_templates/`: templates PDF usados por servicos de receituario.

## Onde procurar por tipo de tarefa

Alterar login ou `/me`:

```text
backend/routes/auth_routes.py
backend/security/jwt_handler.py
backend/security/dependencies.py
frontend/app.js
```

Alterar permissao:

```text
backend/security/permissions.py
backend/security/dependencies.py
backend/routes/user_admin_routes.py
```

Alterar banco:

```text
backend/models/
backend/database.py
backend/scripts/
docs/05_banco_dados.md
```

Alterar tela ou chamada frontend:

```text
frontend/app.js
frontend/index.html
```

Alterar documentos/PDF:

```text
backend/routes/editor_textos_routes.py
backend/services/editor_pdf_service.py
backend/services/digital_signature_service.py
backend/services/receituario_pdf_template_service.py
storage/modelos/base/
```

## Rotas principais

- `auth_routes.py`: login, logout, Google OAuth, signup, reset, setup e `/me`.
- `cadastros_routes.py`: pacientes, simbolos, grupos/categorias, auxiliares e procedimentos genericos.
- `agenda_legado_routes.py`: agenda, avisos, Google Calendar, horarios livres e combos.
- `agenda_contatos_routes.py`: contatos de agenda.
- `financeiro_routes.py`: lancamentos, relatorios e fluxo de caixa.
- `procedimentos_routes.py`: tabelas, procedimentos, fases e materiais.
- `prestadores_routes.py`: prestadores, credenciamentos e comissoes.
- `convenios_planos_routes.py`: convenios, planos e calendario de faturamento.
- `editor_textos_routes.py`: documentos, mesclagem, PDF, assinatura e Acrobat/local bridge.
- `preferences_routes.py`: preferencias gerais, modelos, ambiente, usuario, odontograma e relatorio.
- `user_admin_routes.py`: usuarios, permissoes, perfis e senhas.
- `superadmin_routes.py`: administracao da plataforma.
- `licenca_routes.py`: licenca, checkout, confirmacao, sincronizacao e webhook.

## Modelos importantes

- `clinica.py`: raiz multi-tenant.
- `usuario.py`: usuarios e login.
- `access_profile.py`, `usuario_perfil_acesso.py`: perfis de acesso.
- `paciente.py`: pacientes.
- `agenda_legado.py`: eventos e bloqueios.
- `financeiro.py`: grupos, categorias, lancamentos e auxiliares.
- `procedimento.py`, `procedimento_generico.py`, `procedimento_tabela.py`: procedimentos.
- `prestador.py`, `prestador_odonto.py`: prestadores.
- `modelo_documento.py`, `etiqueta_modelo.py`, `relatorio_config.py`: documentos e relatorios.
- `plataforma.py`, `plano.py`, `assinatura.py`: plataforma, planos e cobrancas.

## Arquivos sensiveis para manutencao

- `frontend/app.js`: monolitico; alto risco de regressao.
- `backend/main.py`: startup, middlewares e bootstrap.
- `backend/database.py`: conexao com banco.
- `backend/security/dependencies.py`: usuario atual, setup e permissoes.
- `backend/security/jwt_handler.py`: JWT e segredo.
- `backend/security/permissions.py`: matriz de acesso.
- `backend/routes/*`: regras de negocio e filtros por clinica.
- `backend/scripts/*`: scripts podem alterar dados em massa.
