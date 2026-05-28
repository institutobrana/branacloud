# Auditoria EasyDental virgem - Subetapa 8V-B - implementacao do setup para usuarios criados posteriormente

## 1. Contexto

- A Subetapa 8V-A mostrou que o setup e disparado por `setup_completed = false` no usuario.
- A analise anterior mostrou que usuarios criados posteriormente nasciam com `setup_completed = False` por default.
- Por isso, usuarios posteriores caiam no setup mesmo sem serem o ADM inicial da conta.
- Esta etapa aplica a menor correcao segura para impedir esse comportamento.

## 2. Regra implementada

- O setup permanece para o ADM inicial da nova conta.
- Usuarios criados posteriormente nascem com `setup_completed = True`.
- Usuarios posteriores nao precisam criar senha interna/setup.
- O login SaaS continua obrigatorio.
- Contas existentes nao sao alteradas.

## 3. Diagnostico tecnico

### Fluxos de criacao posterior encontrados

- `backend/routes/user_admin_routes.py:admin_create_user()` cria usuarios comuns da clinica.
- `backend/routes/superadmin_routes.py:superadmin_create_usuario()` cria usuarios pela area superadmin.
- O signup inicial do ADM em `backend/services/signup_service.py:criar_conta_saas()` nao foi alterado.

### Estado anterior

- Os fluxos de criacao posterior instanciavam `Usuario` sem preencher `setup_completed`.
- Como o modelo define `setup_completed` com default `False`, esses usuarios caiam no setup.

### Estado novo

- Os fluxos posteriores passam a criar o usuario com `setup_completed = True` no nascimento.
- O ADM inicial continua sendo criado pelo signup com `setup_completed = False` para passar pelo primeiro acesso.

## 4. Implementacao

### Arquivos alterados

- `backend/routes/user_admin_routes.py`
- `backend/routes/superadmin_routes.py`
- `docs/auditoria_easydental_virgem_subetapa_8vb_implementacao_setup_usuarios_posteriores.md`
- `docs/11_roadmap_desenvolvimento.md`

### Campos definidos

- `setup_completed = True` nos usuarios criados posteriormente.
- `senha_interna_hash` nao foi preenchida.
- `senha_hash` nao foi alterada.
- `forcar_troca_senha` foi preservada conforme o fluxo original.

### Onde `setup_completed = True` foi aplicado

- No `Usuario(...)` do fluxo `admin_create_user()`.
- No `Usuario(...)` do fluxo `superadmin_create_usuario()`.

### Confirmacoes importantes

- O signup do ADM inicial nao foi alterado.
- O helper `_apply_user_links` e os vinculos da 8U permanecem intocados.
- O setup do ADM inicial continua existindo como primeiro acesso da nova conta.

## 5. Fora de escopo

- Remover setup.
- Setup do ADM inicial.
- Opcoes do Sistema.
- Controle de usuarios/senhas.
- Auditoria.
- Alteracao de senha.
- Senha interna.
- Frontend.
- Tabelas de procedimentos.
- Unidade.
- Prestadores.
- Contas existentes.
- Correcao textual da tela de setup.

## 6. Checks executados

Comandos executados:
```powershell
python -m py_compile backend/routes/user_admin_routes.py backend/routes/superadmin_routes.py
.\.venv\Scripts\python.exe -c "import sys; sys.path.insert(0, r'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend'); import routes.user_admin_routes, routes.superadmin_routes; print('ok')"
```

Resultado:
- compilacao Python concluida com sucesso;
- import seguro dos modulos alterados concluido com sucesso;
- nenhuma conta foi criada automaticamente.

## 7. Teste manual obrigatorio

Em uma conta de teste:
- criar usuario novo pelo modulo Usuarios;
- sair do ADM;
- fazer login com o usuario criado;
- confirmar que a tela de setup nao aparece;
- confirmar que o usuario acessa normalmente;
- confirmar que o ADM inicial da conta continua vendo setup quando aplicavel em conta nova;
- confirmar que `/me` do usuario posterior retorna `setup_completed=True`;
- confirmar que Usuarios/Opcoes do Sistema nao foram alterados funcionalmente nesta etapa;
- confirmar que tabelas, unidade e prestadores continuam corretos.

## 8. Riscos e rollback

- Risco de usuario posterior sem setup acessar areas indevidas: mitigado porque tipo_usuario e permissoes continuam sendo controlados pelo cadastro do usuario.
- Risco de confundir setup com senha de login: mitigado porque `senha_hash` nao foi alterada e o login SaaS continua obrigatorio.
- Risco para contas antigas: baixo, porque nao houve backfill nem alteracao de usuarios existentes.
- Rollback: novo commit revertendo apenas esta pequena correcao, se necessario.
- Nao usar reset, clean ou restore.

## 9. Proxima subetapa recomendada

- Validacao manual da 8V-B.
- Depois, se desejado, contrato separado para Opcoes do Sistema > Seguranca.

## 10. Plano de verificacao

Confirmar:
- somente documento novo e roadmap foram alterados;
- frontend nao foi alterado;
- backend nao foi alterado;
- banco/schema/migrations/seeds/endpoints nao foram alterados;
- nenhuma conta foi criada ou excluida;
- setup nao foi alterado;
- EasyDental nao foi alterado.
