## Correção segura - falha ao excluir usuario no modulo Usuarios

### 1. Contexto

- O erro foi observado no frontend com o alerta: `Falha ao excluir usuario.`
- O teste ocorreu na tela `Configuracao de usuarios do sistema`.
- O contexto funcional vem apos as Subetapas 8V-B e 8W-B, que ajustaram `setup_completed` e o baseline de permissoes para usuarios novos.
- A auditagem foi feita antes de seguir com novos testes para nao deixar exclusao quebrada em usuarios comuns.

### 2. Diagnostico

- Fluxo frontend identificado: `frontend/app.js` -> funcao `usersExcluirSelecionado()` -> `DELETE /admin/users/{id}`.
- O frontend mostra a mensagem generica `Falha ao excluir usuario.` quando a rota responde erro nao tratado.
- Endpoint backend responsavel: `backend/routes/user_admin_routes.py`, rota `@router.delete("/{user_id}")` em `admin_delete_user()`.
- A rota original fazia `db.delete(usuario)` direto, sem limpar dependencias antes da exclusao.
- O banco mostrou que a falha nao era geral para qualquer usuario: um usuario comum sem dependencia de FK pode ser excluido, enquanto um usuario referenciado por `prestador_odonto.usuario_id` falha.
- No inventario de teste da clinica 15, o usuario `37` falhava por dependencia em `prestador_odonto.usuario_id`; o usuario `36` nao falhava.
- O problema, portanto, afeta usuarios comuns que ainda estao amarrados a prestador, historico ou tabelas auxiliares, e nao apenas uma conta isolada.

### 3. Regra de seguranca de exclusao

- Manter bloqueio para conta base `Clinica` / system user.
- Manter bloqueio para o proprio usuario logado.
- Bloquear a exclusao do ultimo administrador da clinica.
- Permitir exclusao de usuarios comuns criados pelo ADM, desde que as dependencias sejam limpas com seguranca.
- Preservar o historico quando possivel, removendo apenas vinculos e registros auxiliares dependentes do usuario.
- Nao mexer em setup, Opcoes do Sistema, seeds, unidade, prestadores ou contas existentes fora da exclusao solicitada.

### 4. Correcao aplicada

- Arquivo alterado: `backend/routes/user_admin_routes.py`.
- Foram adicionados helpers para:
  - contar administradores restantes na clinica;
  - limpar vinculos do usuario antes da exclusao.
- A exclusao agora:
  - bloqueia o ultimo admin da clinica;
  - desvincula `prestador_odonto.usuario_id` quando ele aponta para o usuario;
  - remove registros em `usuario_perfil_acesso`;
  - remove registros em `relatorio_config`;
  - zera referencias em `controle_protetico.cirurgiao_id`;
  - zera referencias em `tratamento.cirurgiao_responsavel_id`, `cirurgiao_contratado_id`, `cirurgiao_solicitante_id` e `cirurgiao_executante_id`;
  - so depois executa `db.delete(usuario)`.
- A exclusao continua sendo real, nao virou soft delete.
- A mudanca e segura porque limpa apenas dependencias ligadas ao usuario alvo antes do `DELETE`.

### 5. Fora de escopo

- `setup`.
- `senha_interna`.
- `Opcoes do Sistema`.
- baseline da 8W-B.
- criação de conta.
- seeds.
- unidade.
- prestadores fora do desvio necessario para desvinculo.
- EasyDental.
- frontend.

### 6. Checks executados

- `python -m py_compile backend/routes/user_admin_routes.py`
- consulta segura ao banco com `psycopg2` para confirmar o erro de FK no usuario `37`
- transacao descartavel simulando a limpeza de dependencias seguida de exclusao do usuario `37`, que passou com sucesso
- consulta segura de contagem de admins na clinica 15, confirmando que existe 1 admin e portanto o bloqueio do ultimo admin e necessario

### 7. Teste manual obrigatorio

- Criar um usuario comum.
- Excluir o usuario comum.
- Confirmar que ele some da lista ou fica inativo conforme a regra do modulo.
- Tentar excluir o usuario base `Clínica` / system e confirmar bloqueio.
- Tentar excluir o proprio usuario logado e confirmar bloqueio.
- Tentar excluir o ultimo admin da clinica e confirmar bloqueio.
- Confirmar que usuarios novos continuam sem cair no setup.
- Confirmar que as permissoes padrao da 8W-B continuam corretas.

### 8. Riscos e rollback

- Risco de remover dependencia demais e perder historico auxiliar.
- Risco de deixar algum FK novo sem limpeza.
- Risco de bloquear exclusao de admin em excesso se a regra for aplicada fora do contrato.
- Rollback por novo commit.
- Nao usar `git reset`, `git clean` ou `git restore`.

### 9. Proxima subetapa recomendada

- Validacao manual da correcao de exclusao.
- Depois retomar a validacao da 8W-B no fluxo de usuarios novos.

