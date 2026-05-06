# Instrucoes para IAs - Brana Cloude

## Nome oficial

Use sempre Brana Cloude como nome oficial. Nomes como SaaS aparecem em trechos historicos do codigo, mas nao devem substituir o nome do produto.

## Fonte da verdade

O codigo atual e a fonte da verdade. A documentacao oficial fica em `docs/`. Documentos em `docs/_historico_auditoria/` sao historicos e nao devem ser usados como referencia principal sem conferir o codigo.

Leia primeiro:

1. `README.md`
2. `docs/00_master_guide.md`
3. `docs/02_arquitetura.md`
4. `docs/03_mapa_codigo.md`
5. `docs/06_seguranca.md`
6. `docs/10_continuidade.md`

## Estrutura atual

- Backend: `backend/`
- Ponto de entrada: `backend/main.py`
- Banco: `backend/database.py`
- Rotas: `backend/routes/`
- Modelos: `backend/models/`
- Servicos: `backend/services/`
- Seguranca: `backend/security/`
- Frontend: `frontend/index.html` e `frontend/app.js`
- Documentacao: `docs/`
- Storage base: `storage/modelos/base/`

## Ambiente local

`backend/main.py` carrega automaticamente `backend/.env`.

Variaveis obrigatorias:

- `DATABASE_URL`
- `JWT_SECRET_KEY`

Nao adicionar fallback inseguro para nenhuma das duas.

## Regras de seguranca

- Nunca commitar `backend/.env`, `.env`, `.env.*`, `.venv/`, `venv/`, dumps, bancos, backups ou documentos reais.
- Nunca commitar `storage/modelos/clinicas/`.
- Nunca hardcodar segredo JWT, senha, token ou credencial externa.
- Toda rota operacional deve autenticar usuario.
- Toda rota operacional deve filtrar por `current_user.clinica_id`.
- Nao confiar em `clinica_id` vindo do frontend.
- Frontend nao e barreira de seguranca.
- Rotas novas devem usar `require_module_access` com o modulo correto.

## Como alterar backend

1. Localize a rota em `backend/routes/`.
2. Localize modelos em `backend/models/`.
3. Reuse servicos existentes em `backend/services/`.
4. Valide autenticacao, permissao e tenant.
5. Se alterar schema, crie plano de migration ou script aditivo claro.
6. Teste pelo menos caminho feliz, sem auth, sem permissao e tenant errado quando aplicavel.
7. Atualize `docs/` quando mudar comportamento, arquitetura, banco ou seguranca.

## Como alterar frontend

`frontend/app.js` e monolitico. Faca mudancas pequenas e localizadas.

Antes de editar:

- Localize a funcao ou bloco pelo texto da tela ou endpoint chamado.
- Entenda como `requestJson`, token e estado local sao usados.
- Evite refatoracao ampla junto com correcao funcional.

Depois de editar:

- Teste login.
- Teste a tela alterada.
- Verifique console do navegador quando possivel.

## Banco de dados

O banco web e PostgreSQL. Nao usar SQLite para o projeto web atual.

Nao executar alteracao destrutiva sem backup, plano de rollback, aprovacao explicita e documentacao.

## Scripts

Scripts em `backend/scripts/` podem alterar dados em massa ou depender de dados legados. Leia antes de executar. Nunca rode script de migracao contra banco real sem confirmar `DATABASE_URL` e escopo.

## Entrega esperada

Ao terminar uma tarefa, informe:

- Arquivos alterados.
- Validacoes executadas.
- O que nao foi validado.
- Riscos remanescentes.
- Acoes manuais para CEO/operador, se houver.