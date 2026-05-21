# Access profile subetapa 1 - fonte versionada passiva

## 1. Objetivo
Registrar a criacao de uma fonte versionada passiva no backend para a lista funcional base de Perfis de acesso / `access_profile`, sem aplicar nada no banco.

## 2. Contrato usado como base
- `docs/contrato_funcional_usuarios_novas_contas.md`

## 3. Plano tecnico usado como base
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`

## 4. Arquivo criado
- `backend/seeds/access_profiles_default.py`

## 5. Lista funcional base versionada
A lista passiva versionada contem:
1. Agenda de horarios
2. Controle de estoque
3. Controle de protetico
4. Controle de recibos
5. Creditos na conta corrente
6. Debitos na conta corrente
7. Intervencoes
8. Pacientes
9. Relatorios estatisticos
10. Relatorios financeiros

## 6. O que esta fonte representa
Esta fonte representa apenas os dados base versionados dos perfis funcionais.

Ela e:
- passiva;
- importavel;
- idempotente por desenho;
- sem escrita em banco;
- sem bootstrap;
- sem dependencia de ambiente.

## 7. O que nao foi feito nesta etapa
Nesta subetapa nao houve:
- alteracao de banco;
- criacao de registros em `access_profile`;
- alteracao da clinica 1;
- alteracao de `signup_service.py`;
- alteracao de endpoints;
- alteracao de frontend;
- alteracao de `access_profiles_service.py`;
- execucao de seed;
- execucao de migration;
- execucao de script corretivo.

## 8. Arquivos tocados
- `backend/seeds/access_profiles_default.py`
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`

## 9. Checks executados
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok

## 10. Onde testar
Como esta etapa e passiva, o teste e indireto:
1. confirmar que o sistema continua abrindo normalmente;
2. fazer login como ADM;
3. abrir o modulo Usuarios;
4. confirmar que o fluxo de senha protegida continua igual;
5. abrir um usuario existente;
6. confirmar que o modal abre;
7. confirmar que a aba Perfis de acesso ainda nao foi alterada nesta etapa;
8. confirmar que nenhum perfil foi criado automaticamente no banco nesta etapa.

## 11. Proximos passos
### Subetapa 2
Criar funcao idempotente de bootstrap, ainda controlada.

### Subetapa 3
Acoplar o bootstrap ao signup.

### Subetapa 4
Executar dry-run para clinicas existentes.

### Subetapa 5
Corrigir a clinica 1, se autorizado.

### Depois
Estabilizar a UI e retomar a modularizacao do modulo Usuarios.

## 12. Confirmacoes de escopo
Nesta subetapa:
- nenhum banco foi alterado;
- nenhum seed foi executado;
- nenhuma migration foi executada;
- signup nao foi alterado;
- clinica 1 nao foi corrigida;
- frontend nao foi alterado;
- backend de rotas/endpoints nao foi alterado.

## 13. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- O workspace continua com varios `?? docs/...` antigos do trabalho paralelo.
- Os arquivos desta subetapa ficaram salvos para revisao posterior.

