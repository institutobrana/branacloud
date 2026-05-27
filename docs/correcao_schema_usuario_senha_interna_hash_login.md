# Correção schema usuário — senha_interna_hash ausente no login

## Contexto

- Após a exclusão segura da conta de teste e o início do sistema, o `POST /login` passou a retornar `500 Internal Server Error`.
- O erro principal foi `psycopg2.errors.UndefinedColumn: coluna usuarios.senha_interna_hash não existe`.
- A senha de login SaaS continua fora de discussão nesta etapa.
- `setup` e senha interna não foram removidos; esta correção existe apenas para restaurar a compatibilidade entre model e schema.

## Diagnóstico

- O model `backend/models/usuario.py` espera a coluna `senha_interna_hash`.
- A rota envolvida no fluxo de login é `backend/routes/auth_routes.py`.
- A leitura do schema real confirmou que `usuarios.senha_interna_hash` estava ausente.
- As demais colunas conferidas no `usuarios` estavam presentes:
  - `setup_completed`
  - `is_system_user`
  - `is_admin`
  - `unidade_atendimento_id`
  - `preferencias_usuario_json`
  - `preferencias_agenda_json`
  - `preferencias_impressora_json`
  - `preferencias_etiqueta_json`
  - `permissoes_json`
- Causa provável: bootstrap/schema de compatibilidade ainda não garantia a coluna de senha interna.

## Correção aplicada

- Arquivos alterados:
  - `backend/main.py`
  - `backend/scripts/aplicar_compatibilidade_schema.py`
- Método usado:
  - startup HTTP passou a chamar o helper idempotente `ensure_user_auth_schema()`;
  - o script manual de compatibilidade também passou a garantir `senha_interna_hash` com `ADD COLUMN IF NOT EXISTS`.
- A correção é idempotente e não gera senha para usuários existentes.
- A coluna nasce `NULL` para registros já existentes.

## Segurança

- Nenhuma senha de login SaaS foi alterada.
- Nenhuma senha interna foi gerada ou redefinida.
- Nenhum usuário foi alterado.
- Nenhuma conta foi criada.
- Nenhum dado foi removido.
- `setup`, `Opções do Sistema`, unidade, seeds de procedimentos e 8J/8K/8P permaneceram fora do escopo.

## Checks executados

- `python -m py_compile backend/main.py backend/scripts/aplicar_compatibilidade_schema.py`
- Verificação segura do schema via `sqlalchemy.inspect(engine)` antes da correção.
- Verificação segura do schema via `ensure_user_auth_schema()` + `sqlalchemy.inspect(engine)` após a correção.
- Conferência de que `senha_interna_hash` passou a existir e que não houve backfill.

## Onde testar

- Reiniciar o backend.
- Acessar `/app`.
- Tentar login com usuário existente.
- Confirmar que o `500` não ocorre mais.
- Depois, criar nova conta com `institutobrana@gmail.com` apenas se o login estiver normal.
- Em seguida, validar 8J/8K/8P na nova conta.

## Fora de escopo

- Remoção do `setup`.
- Alteração da senha interna.
- Correção textual da tela de setup.
- `Opções do Sistema`.
- frontend.
- unidade.
- seeds de procedimentos.

## Próxima subetapa recomendada

- Se o login estiver corrigido: validação manual da nova conta após 8J/8K/8P.
- Se ainda falhar: diagnóstico complementar de schema/login.
