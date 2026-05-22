# Subetapa 6K - Decisao documental para tratamento especifico da clinica 8

Branch: `modularizacao-segura-fase-1`

Commit base: `f2e6d05 - Documenta execucao e validacao da clinica 4`

Objetivo da decisao: definir o tratamento especifico da clinica 8 antes de qualquer execucao real, preservando os perfis existentes e evitando duplicidade.

Estado atual da clinica 1:
- corrigida e validada
- `10/10` em `access_profile`
- `usuario_perfil_acesso` permaneceu `0`

Estado atual da clinica 4:
- corrigida e validada
- `10/10` em `access_profile`
- `usuario_perfil_acesso` permaneceu `0`

Estado atual da clinica 8:
- ainda nao foi corrigida
- permanece `3/10`

Perfis ja existentes na clinica 8:
- Pacientes
- Controle de estoque
- Controle de recibos

Perfis faltantes na clinica 8:
- Agenda de horarios
- Controle de protetico
- Creditos na conta corrente
- Debitos na conta corrente
- Intervencoes
- Relatorios estatisticos
- Relatorios financeiros

Comparacao das opcoes possiveis:

- Opcao A - executar o runner para clinica 8 criando somente os 7 faltantes
- Opcao B - nao corrigir clinica 8 agora e partir para UI
- Opcao C - criar rotina especial apenas para clinica 8
- Opcao D - revisar manualmente os 3 perfis existentes antes de executar qualquer correcao

Riscos da opcao A:
- clinica 8 e parcial
- precisa preservar perfis existentes
- deve evitar duplicidade por `source_id` ou nome
- exige confirmacao previa do dry-run

Beneficios da opcao A:
- o runner ja e idempotente
- o bootstrap compara existentes e cria somente faltantes
- deve preservar os 3 existentes
- completa a base funcional da clinica 8

Riscos da opcao B:
- clinica 8 continuara incompleta
- a UI pode continuar inconsistente nessa clinica
- a trilha de saneamento ficaria aberta

Riscos da opcao C:
- aumenta codigo especifico
- duplica logica ja centralizada no bootstrap
- pode criar divergencia desnecessaria

Riscos da opcao D:
- atrasa a correcao
- pode ser util se houver duvida sobre `source_id` ou nome dos 3 existentes

Recomendacao final:
- usar o mesmo runner idempotente para clinica 8
- antes da execucao, confirmar dry-run com `existing = 3`, `missing = 7`, `would_create_count = 7`
- executar somente para `clinica_id = 8`
- validar que os 3 existentes foram preservados
- validar que somente os 7 faltantes foram criados
- validar que `usuario_perfil_acesso` permaneceu inalterado

Plano recomendado:
- 6L - executar runner somente para clinica 8, com autorizacao explicita
- 6M - validar clinica 8 por leitura/dry-run
- 6N - consolidar saneamento das clinicas existentes
- depois - avaliar UI da aba Perfis de acesso

Critérios para a futura 6L:
- autorizacao explicita
- `clinica_id = 8`
- `current_database = brana_saas`
- dry-run previo confirmando `3/10`
- execucao com `--execute` somente para clinica 8
- alteracao somente em `access_profile` da clinica 8
- preservar os 3 perfis existentes
- criar somente os 7 faltantes
- `usuario_perfil_acesso` nao deve ser alterado
- clinicas 1 e 4 nao devem ser alteradas
- UI nao deve ser alterada

Relacao com a UI:
- nao corrigir UI ainda
- primeiro fechar o saneamento de `access_profile` nas clinicas existentes
- depois testar a aba Perfis de acesso em clinica completa
- so entao tratar comportamento e layout da aba

Confirmacoes de escopo:
- nenhum codigo alterado
- nenhum banco alterado
- runner nao executado
- `--execute` nao usado
- clinica 8 nao corrigida
- `usuario_perfil_acesso` nao alterado
- frontend, UI, rotas e endpoints nao alterados

PONTO DE DECISÃO — clínica 8 é caso parcial 3/10 e deve ser tratada em etapa própria, preservando os perfis existentes e criando somente os faltantes.

Checks obrigatórios:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

