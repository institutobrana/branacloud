# Plano tecnico - access_profile e Perfis de acesso - Modulo Usuarios

## 1. Titulo
Plano tecnico - access_profile e Perfis de acesso - Modulo Usuarios

## 2. Objetivo
Documentar, de forma tecnica e somente documental, o plano futuro para alinhar a aba Perfis de acesso e a estrutura `access_profile` ao contrato funcional definitivo do modulo Usuarios para novas contas.

## 3. Status
Plano tecnico documental, sem implementacao.

## 4. Documento base
- `docs/contrato_funcional_usuarios_novas_contas.md`

## 5. Branch conferida
- `modularizacao-segura-fase-1`

## 6. Estado inicial do git
- Branch atual confirmada: `modularizacao-segura-fase-1`
- O workspace ja continha varios `?? docs/...` antigos e nao relacionados a este plano.
- Nao havia alteracoes rastreadas em codigo nesta etapa.

## 7. Arquivos analisados
### 7.1 Contrato e auditorias
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

### 7.2 Codigo Brana Cloud
- `backend/services/access_profiles_service.py`
- `backend/routes/user_admin_routes.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/services/signup_service.py`
- `backend/routes/auth_routes.py`
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`

## 8. Documentos analisados
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`

## 9. Estado atual de `access_profile`
### 9.1 Modelo e leitura atual
`backend/models/access_profile.py` define `access_profile` com:
- `clinica_id`
- `source_id`
- `nome`
- `reservado`

### 9.2 Bootstrap atual
`backend/services/access_profiles_service.py`:
- le `sis_perfil_sql.csv` na raiz do projeto;
- ignora o bootstrap se o arquivo nao existir;
- cria/atualiza perfis por `clinica_id` e `source_id`;
- marca os perfis como `reservado=True`.

### 9.3 Estado observado
Pelas auditorias anteriores:
- `access_profile` existe para a clinica 8;
- a clinica 1 nao possui `access_profile`;
- o endpoint de perfis devolve `profiles: []` na clinica 1.

## 10. Estado atual de `usuario_perfil_acesso`
### 10.1 Modelo
`backend/models/usuario_perfil_acesso.py` amarra:
- `clinica_id`
- `usuario_id`
- `prestador_id`
- `perfil_id`

### 10.2 Estado observado
Pelas auditorias anteriores:
- a tabela esta vazia no banco atual;
- `GET /admin/users/{id}/profiles` devolve `assignments: {}` para a clinica 1;
- a UI da aba Perfis de acesso fica sem vinculacoes persistidas.

## 11. Estado atual da clinica 1
### 11.1 Observacao atual
A clinica 1 e o melhor exemplo do problema estrutural atual:
- existe usuario;
- existe prestador sistemico `Clínica`;
- existe fluxo de usuarios e permissao;
- porem nao existe `access_profile` funcional base;
- e `usuario_perfil_acesso` esta vazio.

### 11.2 Conclusao operacional
A aba Perfis de acesso nao esta quebrada por renderizacao; ela esta vazia por falta da base funcional na clinica 1.

## 12. Regra contratual aplicavel
O contrato funcional definitivo ja estabelece que:
- Perfis de acesso nao sao cargos;
- `access_profile` e base funcional obrigatoria para novas clinicas;
- `usuario_perfil_acesso` representa o vinculo usuario + perfil funcional + prestador;
- nova clinica nao deve nascer com cargos padrao;
- nova clinica deve nascer com base funcional de perfis;
- a fonte oficial dos perfis deve ser versionada no backend ou em bootstrap controlado.

## 13. Lista funcional base proposta
Lista base oficial proposta para `access_profile`:
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

## 14. Fonte oficial versionada recomendada
### Recomendacao tecnica
Nao depender de `sis_perfil_sql.csv` solto na raiz do projeto.

Recomendacao:
- seed versionado no backend, ou
- arquivo JSON/CSV versionado dentro do backend, ou
- bootstrap controlado e idempotente versionado no repositorio.

### Regras da fonte oficial
- deve ser versionada;
- deve ser idempotente;
- deve criar apenas o que estiver ausente;
- nao deve sobrescrever perfis existentes sem regra explicita;
- deve respeitar `clinica_id`;
- deve documentar mapeamento de nomes/codigos.

## 15. Plano para novas clinicas
### 15.1 Momento do bootstrap
O bootstrap de `access_profile` deve rodar no fluxo de criacao da nova conta, dentro do nascimento da clinica.

### 15.2 Ordem sugerida
Ordem segura sugerida:
1. criar clinica;
2. garantir prestador sistemico `Clínica`;
3. garantir usuario ADM/dono;
4. garantir `access_profile` base;
5. concluir setup inicial;
6. liberar tela de usuarios/perfis para o ADM.

### 15.3 Comportamento esperado
- o bootstrap deve ser transacional ou, no minimo, compensavel;
- falha de bootstrap deve gerar erro controlado e nao deixar a conta em estado parcial silencioso;
- nao deve duplicar perfis quando reexecutado;
- deve preservar as vinculacoes futuras criadas pelo ADM.

## 16. Plano para clinicas existentes
### 16.1 Regra
Clinicas existentes sem `access_profile` nao devem ser corrigidas automaticamente neste plano.

### 16.2 Procedimento futuro
1. identificar clinicas sem `access_profile`;
2. gerar dry-run;
3. validar lista a ser criada;
4. executar apenas com autorizacao explicita;
5. nao apagar perfis existentes;
6. nao recriar vinculacoes sem regra;
7. registrar antes/depois.

## 17. Plano especifico futuro para clinica 1, sem executar
A clinica 1 deve ser tratada em etapa separada:
- primeiro com levantamento;
- depois com dry-run;
- depois com aprovacao explicita;
- por fim, com execucao controlada, se autorizado.

Este plano nao autoriza correcao da clinica 1 agora.

## 18. Impacto esperado na UI
Quando a base funcional existir:
- o quadro superior da aba Perfis de acesso deve listar os perfis funcionais;
- ao selecionar um perfil, o quadro inferior deve listar os prestadores;
- checkbox marcado/desmarcado deve representar o vinculo usuario + perfil + prestador;
- salvar deve persistir `usuario_perfil_acesso`;
- reabrir usuario deve recarregar `assignments`;
- a tela nao deve ficar vazia quando `access_profile` existir.

Se `access_profile` estiver vazio:
- a UI deve tratar o estado explicitamente;
- nao deve fingir que a aba esta pronta;
- nao deve criar perfis automaticamente sem contrato.

## 19. Endpoints impactados
Endpoints que provavelmente entram na etapa futura:
- `GET /admin/users/{id}/profiles`
- `PATCH /admin/users/{id}/profiles`
- eventual bootstrap do signup que chama `ensure_access_profiles`

## 20. Arquivos que provavelmente serao alterados em etapa futura
Provaveis arquivos futuros:
- `backend/services/access_profiles_service.py`
- `backend/services/signup_service.py`
- `backend/routes/user_admin_routes.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- possivelmente `frontend/app.js`
- possivelmente docs de contrato e auditoria

## 21. Riscos
- criar perfis duplicados;
- sobrescrever perfis existentes sem validacao;
- misturar cargo, tipo do usuario, permissao por modulo e perfil funcional;
- tentar corrigir clinica existente sem plano proprio;
- manter dependencia de arquivo solto ausente na raiz;
- deixar a UI vazia mesmo com contrato afirmando base obrigatoria;
- quebrar a modularizacao se o bootstrap for inserido sem controle transacional.

## 22. Ordem segura de implementacao futura
1. definir fonte oficial versionada;
2. implementar bootstrap idempotente para novas clinicas;
3. validar comportamento em ambiente de teste;
4. tratar clinicas existentes em plano separado;
5. estabilizar UI da aba Perfis de acesso;
6. so depois retomar recortes da modularizacao do modulo Usuarios.

## 23. Testes manuais obrigatorios
Quando houver implementacao futura, o usuario devera testar:
1. login como ADM;
2. abrir modulo Usuarios;
3. informar senha protegida se solicitado;
4. editar usuario existente;
5. abrir aba Perfis de acesso;
6. confirmar quadro superior com perfis funcionais;
7. selecionar `Agenda de horarios`;
8. confirmar quadro inferior com prestadores;
9. marcar/desmarcar prestador;
10. salvar;
11. reabrir usuario;
12. confirmar persistencia;
13. repetir com `Controle de estoque`;
14. confirmar variacao por perfil funcional;
15. testar com usuario comum em cenario seguro;
16. confirmar que Permissoes de acesso continuam separadas de Perfis de acesso.

## 24. Relação com retomada da modularização
A modularizacao do modulo Usuarios deve ser retomada somente depois de:
- contrato funcional fechado;
- plano tecnico de `access_profile` aprovado;
- estrategia de seed/bootstrap aprovada;
- UI de Perfis de acesso estabilizada ou pelo menos planejada tecnicamente;
- escopo do proximo recorte definido.

### Sugestao de proximo recorte seguro
Se a retomada for autorizada, o proximo recorte mais seguro tende a ser:
- funcoes visuais da aba Perfis de acesso;
- renderizacao de perfis e prestadores;
- helpers de estado visual;
- sem mexer em salvar, senha, exclusao, backend ou protected grant.

## 25. O que nao deve ser feito agora
- nao alterar `access_profiles_service.py`;
- nao criar `access_profile` na clinica 1;
- nao alterar endpoint;
- nao mexer em `frontend/app.js`;
- nao mexer em `users-admin-modal-visual.js`;
- nao executar scripts corretivos;
- nao mexer em banco;
- nao mexer em seed;
- nao mexer em migration;
- nao iniciar nova modularizacao antes da aprovacao deste plano.

## 26. Confirmacao de que nenhum codigo foi alterado
Confirmado. Esta etapa foi somente documental e de planejamento.

## 27. Confirmacao de que banco/seeds/migrations nao foram alterados
Confirmado. Nao houve escrita em banco, seed ou migration.

## 28. Confirmacao de que frontend/backend nao foram alterados
Confirmado. Nao houve alteracao em frontend ou backend.

## 29. Confirmacao de blindagem textual/mojibake
Confirmado. Nenhum ajuste textual foi executado; eventuais diferencas de grafia foram apenas registradas.

## 30. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 31. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- `git status --short` permanece com varios `?? docs/...` antigos do workspace e o novo plano desta etapa.
- `git diff --stat` nao mostra alteracoes rastreadas em codigo.

## 32. Próximo passo recomendado
Se este plano for aprovado, o proximo passo deve ser a definicao da implementacao futura do bootstrap de `access_profile` em etapa separada, antes de qualquer nova modularizacao do modulo Usuarios.

