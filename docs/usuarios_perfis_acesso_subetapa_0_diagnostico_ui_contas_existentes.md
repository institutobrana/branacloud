# Usuários / Perfis de acesso — Subetapa 0 — Diagnóstico da UI em contas existentes

## 1. Contexto

Os índices oficiais já existem e já apontam as fontes de verdade do projeto:

- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`

O trabalho desta subetapa considera a blindagem textual/mojibake, os contratos vigentes, a trilha de `access_profile` e a trilha específica de `Usuários / Perfis de acesso`.

As clínicas 8 e 9 não devem ser usadas como referência nesta etapa:

- a clínica 8 foi tratada em exclusão segura;
- a clínica 9 também foi tratada em exclusão segura e não deve ser recriada;
- o novo cadastro manual permanece pausado nesta fase;
- o foco atual é fechar a UI de `Perfis de acesso` em contas existentes.

## 2. Objetivo

Diagnosticar a UI da tela `Perfis de acesso` em contas existentes, sem alteração de código, sem alteração de banco e sem qualquer ação de escrita.

## 3. Documentos consultados

Documentos obrigatórios e de apoio considerados nesta análise:

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/sintese_primeira_separacao_real_usuarios_admin.md`

## 4. Confirmação de escopo

Esta etapa permaneceu em diagnóstico e documentação:

- sem código alterado;
- sem banco alterado;
- sem `DELETE`, `UPDATE` ou `INSERT`;
- sem signup;
- sem seeds;
- sem `access_profile` alterado;
- sem exclusão;
- sem cadastro novo;
- sem UI corrigida nesta etapa.

## 5. Estado dos access_profile nas clínicas 1 e 4

### Clínica 1

- contagem de `access_profile`: 10
- IDs: `61, 62, 63, 64, 65, 66, 67, 68, 69, 70`
- `source_id`: `10, 20, 30, 40, 50, 60, 70, 80, 90, 100`
- nomes exatos:
  - `Agenda de horarios`
  - `Controle de estoque`
  - `Controle de protetico`
  - `Controle de recibos`
  - `Creditos na conta corrente`
  - `Debitos na conta corrente`
  - `Intervencoes`
  - `Pacientes`
  - `Relatorios estatisticos`
  - `Relatorios financeiros`
- duplicidades de nome: não encontradas
- duplicidades de `source_id`: não encontradas
- `usuario_perfil_acesso`: 0 registros

### Clínica 4

- contagem de `access_profile`: 10
- IDs: `71, 72, 73, 74, 75, 76, 77, 78, 79, 80`
- `source_id`: `10, 20, 30, 40, 50, 60, 70, 80, 90, 100`
- nomes exatos:
  - `Agenda de horarios`
  - `Controle de estoque`
  - `Controle de protetico`
  - `Controle de recibos`
  - `Creditos na conta corrente`
  - `Debitos na conta corrente`
  - `Intervencoes`
  - `Pacientes`
  - `Relatorios estatisticos`
  - `Relatorios financeiros`
- duplicidades de nome: não encontradas
- duplicidades de `source_id`: não encontradas
- `usuario_perfil_acesso`: 0 registros

### Leitura conjunta

- as clínicas 1 e 4 estão equivalentes no conjunto de `access_profile`;
- a diferença observada é apenas o conjunto de IDs físicos gerados no banco;
- a lista oficial dos 10 perfis está presente e consistente nas duas clínicas;
- o `usuario_perfil_acesso` está vazio nas duas clínicas, o que indica que a UI não pode depender desse vínculo para provar a existência dos 10 perfis.

## 6. Mapeamento frontend

### Arquivos principais

- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`

### Responsabilidades encontradas

#### `frontend/js/modules/users-admin-modal-visual.js`

- `usersOptions(...)`: monta `option` HTML reutilizável para combos.
- `usersPopularModalCombos(user=null)`: popula os combos do modal de usuário.
- `usersPreencherModal(user=null)`: preenche o modal e reaproveita os combos.

Este arquivo está concentrado no modal visual do usuário, não no carregamento da lista de perfis de acesso.

#### `frontend/app.js`

Funções centrais do fluxo de `Perfis de acesso`:

- `usersPermSetTab(tab)`: alterna entre as abas `acesso` e `perfis`; ao entrar em `perfis`, chama `usersPerfLoad()`.
- `usersPerfRenderProfiles()`: renderiza a lista de perfis carregada da API.
- `usersPerfRenderPrestadores()`: renderiza os prestadores vinculados ao perfil selecionado.
- `usersPerfHandlePrestadorChange()`: envia o `PATCH` para persistir vínculo de prestador.
- `usersPerfLoad()`: faz `GET /admin/users/{id}/profiles` e alimenta `usersPerfProfiles`, `usersPerfPrestadores` e `usersPerfAssignments`.
- `usersFecharPermissoes()`: limpa caches locais da tela de permissões.
- `usersAbrirPermissoes()`: carrega o schema, abre a janela e decide a aba inicial.
- `usersSalvarPermissoes()`: persiste permissões do usuário.

Outros pontos relevantes do mesmo arquivo:

- `usersCanManageSelected(u)`: protege conta base `Clínica`.
- `usersCarregarCombos()`: carrega dados auxiliares do módulo Usuários.
- `usersStartRefresh()`: controla refresh da tela.
- `hideAllPanels()`: fecha painéis e também encerra permissões/refresh.

### Observação de UI importante

Foi identificado um ponto de comportamento que pode impedir o uso esperado da aba `Perfis` em contas específicas:

- em `usersAbrirPermissoes()`, se o usuário selecionado for admin, a aba de perfis é ocultada;
- a chamada de `usersPerfLoad()` só acontece quando a aba `perfis` fica ativa;
- se a conta testada for admin/dono/protegida, a tela pode parecer “incompleta” mesmo com os 10 perfis existentes no banco.

## 7. Mapeamento backend/endpoints

### Arquivos principais

- `backend/routes/user_admin_routes.py`
- `backend/services/access_profiles_service.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/security/user_context.py`
- `backend/security/permissions.py`
- `backend/security/dependencies.py`

### Rotas e responsabilidades

#### `backend/routes/user_admin_routes.py`

- `GET /admin/users/{user_id}/profiles`
  - retorna `profiles`, `prestadores` e `assignments`;
  - chama a garantia de `access_profile` da clínica;
  - lê os vínculos existentes de `usuario_perfil_acesso`.

- `PATCH /admin/users/{user_id}/profiles`
  - persiste vínculos de perfil e prestador;
  - remove vínculos anteriores do mesmo usuário, clínica e perfil antes de inserir os novos registros.

- `GET /admin/users/{user_id}/permissions`
  - retorna permissões e schema.

- `PATCH /admin/users/{user_id}/permissions`
  - persiste permissões do usuário.

- `GET /admin/users/permissions/schema`
  - entrega schema de perfis e permissões para a UI.

### Regras técnicas observadas

- o backend garante os 10 `access_profile` com `ensure_access_profiles(db, clinica_id)`;
- o modelo `AccessProfile` usa `clinica_id` + `source_id` como chave lógica;
- o modelo `UsuarioPerfilAcesso` materializa vínculo entre usuário, perfil e prestador;
- os endpoints exigem autorização de módulo e proteção adicional quando o módulo está controlado por senha/grant;
- a presença de `access_profile` não depende de existir vínculo em `usuario_perfil_acesso`.

### Pontos de permissão/autorização

- `require_module_access("usuarios")`
- `require_admin_password_if_user_control_enabled("usuarios")`
- proteção de conta base `Clínica`
- proteção de usuário admin/dono/protegido conforme a UI e as dependências de segurança

## 8. Fluxo funcional esperado da UI Perfis de acesso

Fluxo esperado, em ordem:

1. o usuário abre o módulo `Usuários`;
2. o sistema carrega a lista de usuários;
3. o sistema identifica a clínica atual;
4. a tela solicita os perfis da clínica;
5. a API retorna os 10 `access_profile`;
6. a UI mostra os perfis disponíveis;
7. o usuário seleciona um usuário;
8. o usuário escolhe a aba `Perfis`;
9. o usuário seleciona um perfil;
10. o sistema carrega/apresenta os prestadores associados;
11. o usuário salva a seleção;
12. o backend persiste o vínculo;
13. o refresh mantém a consistência da tela;
14. restrições de admin/dono/protegido continuam respeitadas.

## 9. Diagnóstico provável

Hipótese principal:

- o problema atual parece estar mais na camada de UI/estado do que na existência dos perfis, porque as clínicas 1 e 4 já têm os 10 `access_profile` corretos e sem duplicidade.

Hipóteses secundárias:

- a aba `Perfis` pode estar sendo escondida para usuário admin, tornando o fluxo invisível para quem testa;
- `usersPerfLoad()` só roda quando a aba `perfis` é ativada, então um problema no botão/estado da aba interrompe o carregamento;
- a UI pode depender de `usuario_perfil_acesso` para renderização parcial, mas o banco está vazio nesse vínculo nas clínicas 1 e 4;
- pode haver descompasso entre o modal visual separado e o estado central de `app.js`;
- um `403/Forbidden` ou grant protegido pode bloquear a abertura sem deixar claro ao usuário;
- um refresh incompleto pode limpar o estado visual e não repintar a lista.

## 10. Riscos

Os principais riscos de mexer na próxima correção são:

- tocar em `signup` por engano e alterar o nascimento da clínica;
- tocar em `seeds` e quebrar a consistência das novas contas;
- alterar o bootstrap de `access_profile` e causar duplicidade;
- mexer em permissões protegidas sem validar admin/dono/protegido;
- preencher `usuario_perfil_acesso` sem regra formal;
- corrigir textos/mojibake junto com lógica, o que é proibido nesta trilha;
- mexer no `frontend/app.js` monolítico sem recorte seguro;
- alterar o módulo visual separado sem sincronizar com o estado principal.

## 11. Próximo recorte seguro recomendado

Menor próxima alteração funcional recomendada:

- corrigir apenas o carregamento e a exibição da aba `Perfis de acesso` para contas existentes, validando o fluxo de `GET /admin/users/{id}/profiles` e a sincronização da aba/refresh;
- sem mexer em signup, seeds, bootstrap ou regras de criação de clínica.

## 12. Onde testar antes de avançar

Na próxima correção futura, o teste recomendado deve ser feito assim:

1. entrar com conta existente da clínica 1 ou 4;
2. abrir o módulo `Usuários`;
3. abrir `Perfis de acesso`;
4. confirmar que os 10 perfis aparecem;
5. selecionar um usuário;
6. selecionar um perfil;
7. salvar;
8. fechar e reabrir;
9. confirmar persistência e consistência do refresh.

## 13. Confirmações da etapa

Registro desta etapa:

- somente este documento foi criado;
- nenhum código foi alterado;
- banco não foi alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT`;
- nenhum arquivo foi renomeado;
- nenhum documento foi movido;
- nenhum documento foi apagado;
- `signup`, `seeds` e `access_profile` não foram alterados;
- `frontend` e `backend` não foram alterados;
- a clínica 9 não foi recriada;
- `institutobrana@gmail.com` não foi usado;
- pastas proibidas não foram tocadas;
- blindagem textual/mojibake respeitada;
- sem `git add`, `git commit` ou `git push`.
