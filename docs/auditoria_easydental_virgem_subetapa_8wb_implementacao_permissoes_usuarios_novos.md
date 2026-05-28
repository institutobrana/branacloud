# Auditoria EasyDental virgem - Subetapa 8W-B - implementacao das permissoes padrao de usuarios novos

## 1. Contexto

- A Subetapa 8W-A mostrou que `permissoes_json` nasce no backend e que `default_permissions()` define o baseline.
- A regra revisada pelo usuario pede que usuarios novos nao-admin nascam com os modulos comuns livres, mas com `Usuarios` e `Opcoes do Sistema/Configuracao` protegidos por padrao.
- Esta etapa nao altera `ativar_controle_usuarios`.
- O checkbox e sua persistencia continuam separados desta mudanca.

## 2. Regra implementada

- Usuarios novos nao-admin nascem com modulos comuns liberados por padrao.
- `Usuarios` permanece protegido por padrao.
- `Opcoes do Sistema/Configuracao` permanece protegido por padrao.
- `is_admin=True` continua com tudo habilitado.
- Contas existentes permanecem preservadas.

## 3. Diagnostico tecnico

### Antes

- `default_permissions()` tinha mapas diferentes por tipo, com varios modulos ainda bloqueados ou protegidos.
- Isso fazia usuarios posteriores nascerem mais fechados do que o desejado.

### Depois

- `default_permissions()` passou a devolver um baseline comum para todos os tipos nao-admin.
- O baseline comum habilita os modulos operacionais/comuns e preserva `usuarios` e `configuracao` como protegidos.
- O frontend nao define o baseline de nascimento; ele apenas consome o schema de permissao e salva edicoes posteriores.

### Tipos afetados

- Dentista (CD)
- Clínica
- Gerente administrativo
- Funcionário(a) administrativo(a)
- Qualquer outro tipo nao-admin que caia no fallback

## 4. Implementacao

### Arquivos alterados

- `backend/security/permissions.py`
- `docs/auditoria_easydental_virgem_subetapa_8wb_implementacao_permissoes_usuarios_novos.md`
- `docs/11_roadmap_desenvolvimento.md`

### Funcoes alteradas

- `default_permissions()`

### Valores antes/depois

- Antes: alguns perfis nao-admin ainda nasciam com varios modulos bloqueados.
- Depois: modulos comuns nascem `habilitado`.
- `usuarios` e `configuracao` nascem `protegido`.
- `admin` continua com tudo `habilitado`.

### Alteracao em rotas

- `backend/routes/user_admin_routes.py` nao precisou ser alterado, porque ja monta `permissoes_json` chamando `sanitize_permissions()`.
- `backend/routes/superadmin_routes.py` tambem nao precisou ser alterado; o comportamento efetivo segue a derivacao do backend em leitura e nao existia outra regra paralela a corrigir.

## 5. Relacao com `Ativar controle de usuarios e senhas`

- O checkbox nao foi alterado.
- O default do Brana permanece como esta hoje.
- A flag continua sendo uma camada separada de senha/admin password.
- Esta etapa nao implementa a regra de "desmarcou, liberou tudo" no checkbox; ela apenas ajusta o baseline dos usuarios novos.

## 6. Fora de escopo

- Alterar o checkbox.
- Opcoes do Sistema.
- Auditoria.
- Senha interna.
- Alteracao de senha.
- Setup.
- Frontend.
- Contas existentes.
- Unidade.
- Prestadores.
- Tabelas de procedimentos.
- EasyDental.

## 7. Checks executados

Comandos executados:
```powershell
python -m py_compile backend/security/permissions.py
.\.venv\Scripts\python.exe -c "import sys; sys.path.insert(0, r'D:\\BRANA ARQUIVOS\\BRANA CLOUD\\backend'); from security.permissions import default_permissions; print(default_permissions('Dentista (CD)', False)); print(default_permissions('Clínica', False)); print(default_permissions('Gerente administrativo', False)); print(default_permissions('Funcionário(a) administrativo(a)', False)); print(default_permissions(None, False)); print(default_permissions('Qualquer', True))"
```

Resultado:
- compilacao Python concluida com sucesso;
- import seguro do modulo `security.permissions` concluido com sucesso;
- `default_permissions()` retornou:
  - nao-admin: `usuarios=protegido`, `configuracao=protegido` e modulos comuns `habilitado`;
  - admin: todos os modulos `habilitado`.

## 8. Teste manual obrigatorio

Em uma conta de teste:
- criar um novo usuario nao-admin pelo modulo Usuarios;
- verificar no modal/edicao de usuario as permissoes iniciais;
- confirmar modulos comuns liberados;
- confirmar `Usuarios` bloqueado/protegido;
- confirmar `Opcoes do Sistema/Configuracao` bloqueado/protegido;
- confirmar que o usuario posterior nao cai no setup;
- confirmar que o frontend nao quebrou;
- confirmar que o ADM ainda pode ajustar permissões manualmente.

## 9. Riscos e rollback

- Risco de liberar demais.
- Risco de bloquear menos que o esperado.
- Risco de confundir matriz de permissao com checkbox de controle interno.
- Rollback por novo commit, sem `reset`, `clean` ou `restore`.

## 10. Proxima subetapa recomendada

- Validacao manual da 8W-B.
- Depois, contrato separado se o usuario quiser tratar a regra do checkbox `Ativar controle de usuarios e senhas` como liberacao ampla quando desmarcado.

## 11. Plano de verificacao

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- frontend nao foi alterado;
- backend funcional fora do arquivo de permissao nao foi alterado;
- banco/schema/migrations/seeds/endpoints nao foram alterados;
- nenhuma conta foi criada automaticamente;
- permissões das contas existentes nao foram alteradas;
- EasyDental nao foi alterado;
- blindagem textual/mojibake foi respeitada.
