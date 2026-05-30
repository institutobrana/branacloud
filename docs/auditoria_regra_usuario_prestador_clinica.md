# Auditoria - Regra de associação de usuário ao prestador Clínica

## 1. Contexto

O relato funcional informa que, no módulo Usuários, existe um combo para associar o usuário a um prestador. Ao tentar selecionar o prestador sistêmico `Clínica`, o sistema apresenta mensagem de que o prestador é exclusivo/reservado do sistema.

A hipótese funcional desta auditoria é separar duas regras distintas:

- o prestador `Clínica` deve continuar protegido contra exclusão e alterações estruturais;
- o vínculo operacional de um usuário ao prestador `Clínica` deve ser permitido para uso de agenda e conta da clínica.

## 2. Escopo

Auditoria somente leitura. Nenhum código, banco, dado, schema, migration, endpoint ou serviço foi alterado.

## 3. Evidências documentais

### Encontradas

- [`docs/auditoria_fina_user_admin_cadastro_edicao.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_fina_user_admin_cadastro_edicao.md)
  - registra que o fluxo de criação/edição de usuário já carrega `prestador_row_id`;
  - afirma que o usuário pode sair com `prestador_id`, `unidade_atendimento_id` e, quando aplicável, `usuario_id` do prestador;
  - documenta que a regra de conta base `Clínica` é bloqueada por código reservado.
- [`docs/auditoria_fina_users_combos_vinculos.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_fina_users_combos_vinculos.md)
  - registra que `usersCarregarCombos()` carrega `prestadores` para o modal de usuários;
  - não descreve bloqueio de seleção do prestador `Clínica` no frontend;
  - indica que o combo de prestadores é parte do vínculo cadastral.
- [`docs/contrato_funcional_usuarios_novas_contas.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/contrato_funcional_usuarios_novas_contas.md)
  - afirma que toda nova conta nasce com o prestador sistêmico `Clínica`;
  - trata o vínculo usuário/prestador como identidade operacional do usuário dentro da clínica;
  - separa esse vínculo da aba de perfis de acesso.
- [`docs/11_roadmap_desenvolvimento.md`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)
  - já registra `Clínica` como referência documental do prestador/usuário sistêmico;
  - reforça a existência de usuário e prestador sistêmicos com `source_id=255`.

### Lacuna documental

Não foi encontrada, nesta rodada, uma regra documental explícita dizendo que o usuário comum deve ou não pode ser vinculado ao prestador `Clínica` pelo modal de Usuários. A documentação existente protege o prestador como entidade sistêmica, mas não fecha totalmente a regra do vínculo operacional.

## 4. Mapeamento frontend

### Combo de prestador no modal de usuários

- [`frontend/app.js`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)
  - `usersCarregarCombos()` em torno da linha 12018 chama `GET /cadastros/prestadores`;
  - `usersAbrirModalNovo()` e `usersAbrirModalEditar()` chamam o carregamento antes de preencher o modal;
  - `usersSalvarEstrutural()` envia `prestador_row_id` no payload para `POST /admin/users` e `PATCH /admin/users/{id}`.
- [`frontend/js/modules/users-admin-modal-visual.js`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/js/modules/users-admin-modal-visual.js)
  - `usersPopularModalCombos()` preenche `usersModalPrestador` com `usersPrestadoresLookup`;
  - o frontend não filtra o prestador `Clínica` nessa montagem;
  - `usersPreencherModal()` apenas repassa os valores para o modal.

### Mensagem e bloqueio

- O frontend mostra mensagens de proteção para a conta base `Clínica` quando o usuário selecionado é o sistema, mas isso é proteção de usuário base, não bloqueio específico do combo de prestador.
- Não foi localizado bloqueio frontend específico que impeça a seleção do prestador `Clínica` no combo de usuários.

## 5. Mapeamento backend

### Onde o vínculo é validado

- [`backend/routes/user_admin_routes.py`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/user_admin_routes.py)
  - `AdminCreateUserRequest` e `AdminUpdateUserRequest` aceitam `prestador_row_id`;
  - `_load_prestador_from_same_clinic()` valida o prestador da mesma clínica;
  - esse helper retorna erro `Prestador base 'Clínica' é reservado.` quando `is_system_prestador(prestador)` é verdadeiro;
  - `admin_create_user()` e `admin_update_user()` chamam esse helper antes de persistir;
  - `_apply_user_links()` aplica `usuario.prestador_id` e também sincroniza `prestador.usuario_id`.

### Onde a proteção estrutural existe

- [`backend/routes/prestadores_routes.py`](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/prestadores_routes.py)
  - `_buscar_prestador_ou_none()` e os fluxos de alterar/excluir recusam o prestador sistêmico;
  - `alterar_prestador()` e `excluir_prestador()` bloqueiam a conta `Clínica` por proteção estrutural;
  - `listar_prestadores()` expõe o prestador sistêmico no retorno do combo/listagem.

## 6. Estado por SELECT

SELECT somente leitura executado no `brana_saas` oficial do PostgreSQL 17.

### Prestadores sistêmicos encontrados

- `id=2`, `clinica_id=1`, `nome=Clínica`, `codigo=001`, `source_id=255`, `usuario_id=5`, `is_system_prestador=true`, `inativo=false`
- `id=4`, `clinica_id=4`, `nome=Clínica`, `codigo=001`, `source_id=255`, `usuario_id=7`, `is_system_prestador=true`, `inativo=false`
- `id=19`, `clinica_id=13`, `nome=Clínica`, `codigo=001`, `source_id=255`, `usuario_id=30`, `is_system_prestador=true`, `inativo=false`
- `id=23`, `clinica_id=17`, `nome=Clínica`, `codigo=001`, `source_id=255`, `usuario_id=39`, `is_system_prestador=true`, `inativo=false`
- `id=24`, `clinica_id=18`, `nome=Clínica`, `codigo=001`, `source_id=255`, `usuario_id=42`, `is_system_prestador=true`, `inativo=false`

### Usuários vinculados a prestadores sistêmicos encontrados

- `id=5`, `nome=Clínica`, `email=clinica.255.c1@system.brana.local`, `clinica_id=1`, `prestador_id=2`
- `id=7`, `nome=Clínica`, `email=clinica.255.c4@system.brana.local`, `clinica_id=4`, `prestador_id=4`
- `id=30`, `nome=Clínica`, `email=clinica.255.c13@system.brana.local`, `clinica_id=13`, `prestador_id=19`
- `id=39`, `nome=Clínica`, `email=clinica.255.c17@system.brana.local`, `clinica_id=17`, `prestador_id=23`
- `id=42`, `nome=Clínica`, `email=clinica.255.c18@system.brana.local`, `clinica_id=18`, `prestador_id=24`

### Leitura funcional do banco

O banco confirma que o par usuário/prestador sistêmico já existe e é utilizado no contrato atual. Isso reforça a separação entre proteção estrutural do prestador e vínculo operacional de usuário.

## 7. Separação das regras

### Regra A - proteção estrutural do prestador Clínica

- não excluir;
- não transformar em prestador comum;
- não permitir alterações estruturais indevidas;
- preservar integridade do sistema.

### Regra B - associação operacional de usuário ao prestador Clínica

- permitir vínculo de usuário ao prestador `Clínica`;
- manter o uso operacional de agenda e conta da clínica;
- tratar o vínculo como dado cadastral/operacional, não como edição estrutural do prestador.

## 8. Conclusão

- A associação usuário -> prestador `Clínica` não ficou confirmada como permitida no contrato atual do CRUD de usuários.
- A proteção estrutural do prestador `Clínica` deve permanecer.
- O bloqueio observado está no backend, no helper `_load_prestador_from_same_clinic()` usado por `POST/PATCH /admin/users`.
- O frontend monta o combo e não filtra o item por conta própria.
- A correção, se aprovada depois da comparação documental, provavelmente ficará no módulo de Usuários e não no módulo de Prestadores.

## 9. Necessidade de EasyDental virgem

Sim. A documentação e o código já mostram a proteção estrutural e o vínculo sistêmico existente, mas ainda não fecham com absoluta clareza se o CRUD de usuários deve liberar o prestador `Clínica` como vínculo operacional comum. A comparação com EasyDental virgem continua útil para decidir a regra final sem risco de interpretar errado o contrato legado.

## 10. Classificação

- `REGRA-B`
- `REGRA-F`

## 11. Próxima etapa recomendada

Abrir comparação documental com EasyDental virgem antes de qualquer correção, para confirmar se o vínculo ao prestador `Clínica` deve ser liberado no cadastro de usuários ou se a proteção do CRUD atual é intencional.

## 12. Confirmações de escopo

- nenhum código alterado;
- nenhum dado de banco alterado;
- `frontend/app.js` não alterado;
- `frontend/index.html` não alterado;
- `frontend/js/modules` não alterado;
- backend não alterado;
- `.env` não alterado;
- banco/schema/migrations/seeds/endpoints não alterados;
- PostgreSQL 18 não excluído/desativado;
- backups preservados;
- blindagem textual/mojibake respeitada.

## 13. Registro para roadmap

Auditoria concluída para registro no roadmap como análise documental do vínculo usuário -> prestador `Clínica`, com bloqueio localizado no backend e necessidade de comparação com EasyDental virgem antes de qualquer correção.
