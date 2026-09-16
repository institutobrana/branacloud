# Auditoria do botao Novo usuario em ADM Clinicas

## 1. Objetivo

Auditar, somente por leitura, a funcao real do botao `ADM -> Clinicas -> Novo usuario` antes de qualquer implementacao React.

## 2. Arquivos auditados

- `frontend/app.js`
- `frontend/index.html`
- `frontend-react/src/features/admin/clinics/components/ClinicsToolbarContent.jsx`
- `frontend-react/src/features/admin/clinics/ClinicsPage.jsx`
- `frontend-react/src/features/admin/clinics/services/adminClinicActionsApi.js`
- `frontend-react/src/features/admin/clinics/hooks/`
- `backend/routes/superadmin_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/models/usuario.py`
- `backend/models/clinica.py`
- `backend/security/superadmin.py`
- `backend/security/user_context.py`
- `backend/services/platform_admin_service.py`
- `backend/services/signup_service.py`
- `backend/services/tenant_provisioning/`
- `backend/tests/`
- `docs/contrato_acoes_adm_clinicas.md`
- Documentos de auditoria relacionados a usuarios, setup e painel ADM.

## 3. Funcao do legado

No legado, o botao `Novo usuario` fica na tabela de clinicas do Super Admin em `frontend/app.js`, dentro de `saRenderClinicas()`.

O botao renderizado usa:

```html
<button class="btn-mini" data-sa-action="novo-user" data-id="${c.id}" type="button">Novo usuario</button>
```

O listener da tabela identifica `data-sa-action="novo-user"` e chama:

```js
saCriarUsuarioClinica(id)
```

A funcao chamada e:

```js
saCriarUsuarioClinica(clinicaId)
```

Ela cria um usuario vinculado a clinica da linha selecionada, com perfil administrativo fixo.

## 4. Endpoint

O endpoint usado pelo legado e:

```text
/superadmin/usuarios
```

## 5. Metodo

O metodo HTTP usado e:

```text
POST
```

## 6. Payload

O payload enviado pelo legado e:

```json
{
  "clinica_id": "id da linha selecionada",
  "nome": "nome informado no prompt",
  "email": "email informado no prompt",
  "senha": "senha informada no prompt",
  "is_admin": true,
  "ativar_clinica": true
}
```

O frontend legado fixa `is_admin: true`; portanto, o botao nao cria usuario comum pelo fluxo atual.

## 7. Modal legado

Nao ha modal HTML estruturado para esta acao no legado. O fluxo usa prompts nativos do navegador:

- `window.prompt("Nome do novo usuario/admin:", "")`
- `window.prompt("E-mail do novo usuario/admin:", "")`
- `window.prompt("Senha inicial (minimo 6 caracteres):", "")`
- `window.confirm(...)`

## 8. Campos

Campos solicitados:

- Nome
- E-mail
- Senha inicial

Campos obrigatorios:

- Nome nao vazio
- E-mail nao vazio no frontend, e validado no backend por conter `@` e `.`
- Senha com minimo de 6 caracteres

Campos opcionais:

- Nenhum no legado desta acao.

Campos pre-preenchidos:

- Nenhum campo de dado do usuario e pre-preenchido.
- A clinica alvo vem do `data-id` da linha selecionada.

## 9. Entidades criadas

A entidade criada e um registro em:

```text
usuarios
```

O backend instancia `Usuario(...)` em `backend/routes/superadmin_routes.py::superadmin_create_usuario()`.

Campos relevantes definidos no nascimento:

- `nome`
- `email`
- `senha_hash`
- `clinica_id`
- `is_admin`
- `ativo=True`
- `setup_completed=True`
- `is_system_user=False`

## 10. Entidades nao criadas

O botao nao cria:

- nova clinica;
- novo tenant;
- novo plano;
- nova assinatura;
- nova cobranca;
- convite;
- sessao;
- usuario MASTER;
- campo `is_superadmin` persistido;
- owner da clinica;
- migration;
- estrutura de banco.

## 11. Clinica alvo

A clinica alvo e a clinica da linha selecionada em `ADM -> Clinicas`.

No frontend legado:

- o id vem de `data-id="${c.id}"`;
- o payload envia `clinica_id: clinicaId`;
- a confirmacao usa `saNomeClinica(clinicaId)` apenas para rotulo visual.

No backend:

- `superadmin_create_usuario()` busca `Clinica` por `payload.clinica_id`;
- se nao existir, retorna `404 Clinica nao encontrada.`;
- o novo usuario recebe `clinica_id=clinica.id`.

## 12. Perfil do usuario

O perfil criado pelo fluxo legado e administrador da clinica.

Evidencias:

- frontend envia `is_admin: true`;
- backend grava `is_admin=bool(payload.is_admin)`;
- nao ha controle visual no legado para escolher perfil nesta acao.

Embora o schema backend aceite `is_admin`, o fluxo legado nao oferece escolha: ele sempre envia `true`.

## 13. Senha

A senha e informada manualmente pelo operador Super Admin no prompt legado.

Regras:

- frontend exige minimo de 6 caracteres antes de chamar a API;
- backend repete a validacao de minimo de 6 caracteres;
- backend grava `senha_hash=hash_password(senha)`;
- a senha original nao e retornada na resposta;
- nao ha geracao automatica de senha temporaria;
- nao ha envio de senha por e-mail no endpoint auditado.

## 14. Primeiro acesso

O usuario criado pelo Super Admin nasce com:

```python
setup_completed=True
```

Assim, este fluxo nao dispara a tela de setup inicial que e reservada para o usuario inicial da conta em outros fluxos.

O campo `forcar_troca_senha` nao e definido explicitamente neste endpoint e segue o default do modelo, `False`.

## 15. Limite de usuarios

Nao foi localizada regra contratual de limite de usuarios aplicada neste endpoint.

O backend:

- nao consulta `limite_usuarios`;
- nao bloqueia por `usuarios_total`;
- nao bloqueia por `usuarios_ativos`;
- nao atualiza limite;
- nao possui campo de limite no modelo `Clinica` auditado.

A coluna `Usuarios` de ADM Clinicas exibe contagem, nao limite contratual. No backend ela vem de contagens agregadas de usuarios total e ativos por clinica. No frontend legado aparece como:

```text
usuarios_ativos / usuarios_total
```

Exemplo `3/3` nao representa, pelo codigo auditado, limite atingido. Portanto o fluxo atual nao bloqueia criacao quando aparece `3/3`, e o botao nao deve ser desabilitado por esse numero sem a criacao previa de um contrato de limite.

## 16. Autorizacao

Quem pode executar o endpoint:

- usuario owner reconhecido por `is_owner_email()`;
- usuario admin de uma clinica cujo `tipo_conta` seja Super Admin, Master, Owner ou Vitalicia, conforme `is_platform_superadmin_user()`.

Quem nao pode executar:

- usuario sem autenticacao;
- admin comum de clinica comum;
- usuario sem perfil Super Admin de plataforma derivado.

Validacao de clinica alvo:

- o backend valida existencia de `payload.clinica_id`;
- o endpoint cria o usuario na clinica informada no payload.

Observacao de risco:

- ao contrario de endpoints de status/plano/exclusao, `superadmin_create_usuario()` nao possui uma trava explicita para impedir que um Super Admin nao owner crie usuario em uma clinica MASTER/owner;
- esse ponto deve ser tratado antes de conectar a acao no React, se o contrato exigir protecao MASTER tambem para criacao de usuarios.

## 17. Auditoria

O backend registra auditoria com:

```text
acao="usuario_create"
alvo_tipo="usuario"
alvo_id=usuario.id
```

Detalhes gravados:

- `clinica_id`
- `email`
- `is_admin`
- `ativar_clinica`

## 18. Impacto em plano

O endpoint nao altera `tipo_conta`, plano, validade ou regras de plano.

## 19. Impacto em assinatura

O endpoint nao chama sincronizacao de assinatura e nao cria assinatura.

Observacao: se `ativar_clinica` vier verdadeiro, ele marca `clinica.ativo = True`. Isso altera o status operacional da clinica, mas nao altera plano nem recalcula assinatura no trecho auditado.

## 20. Impacto em cobranca

O endpoint nao cria cobranca, boleto, Pix, checkout, pagamento ou registro financeiro.

## 21. Impacto em tenant

O endpoint nao cria tenant novo. Ele cria uma credencial adicional dentro de uma clinica/tenant existente.

## 22. Riscos

- O fluxo legado usa prompts nativos em vez de modal estruturado, o que limita validacao visual e UX.
- O payload permite `is_admin`, embora o legado fixe `true`; no React futuro, isso nao deve virar escolha acidental se o contrato do botao for administrador.
- O endpoint nao aplica limite de usuarios.
- O endpoint nao bloqueia explicitamente clinica MASTER para ator Super Admin nao owner.
- O endpoint retorna erro diferente para e-mail ja cadastrado, o que pode contribuir para enumeracao de e-mails se o acesso Super Admin for indevidamente concedido.
- `ativar_clinica: true` reativa a clinica alvo sem confirmacao especifica alem da confirmacao de criacao de usuario.

## 23. Classificacao final

Classificacao final: C. Novo administrador da clinica selecionada.

Resposta conclusiva:

O botao `Novo usuario` cria um novo registro em `usuarios`, vinculado a clinica selecionada por `clinica_id`, com `is_admin=True`, `ativo=True`, senha informada pelo operador e `setup_completed=True`.

Ele nao cria nova conta, nao cria nova clinica, nao cria novo tenant e nao cria usuario especial de plataforma por campo proprio.

## 24. Recomendacao para futura implementacao React

Para uma futura implementacao React, manter compatibilidade com o contrato real:

- criar modal controlado, nao prompts nativos;
- exigir selecao previa de exatamente uma clinica;
- enviar `POST /superadmin/usuarios`;
- enviar `clinica_id` da linha selecionada;
- manter `is_admin: true` se o botao continuar significando "novo administrador";
- manter `ativar_clinica: true` apenas se confirmado pelo produto;
- mostrar claramente que a acao cria administrador da clinica;
- nao implementar limite de usuarios sem contrato backend;
- proteger clinica MASTER no frontend e, preferencialmente, tambem no backend antes da conexao produtiva;
- nao gerar senha temporaria ou convite sem endpoint/contrato especifico.

## 25. Ausencia de implementacao nesta rodada

Nesta rodada nao foi implementado:

- componente;
- modal;
- hook;
- service;
- endpoint;
- schema;
- migration;
- teste;
- handler funcional;
- alteracao de backend;
- alteracao de frontend legado;
- alteracao de frontend React.

## 26. Sem commit

Nenhum commit foi criado nesta rodada.

## 27. Sem push

Nenhum push foi executado nesta rodada.

## Comparacao de hipoteses

| Hipotese | Confirmada? | Evidencia |
|---|---:|---|
| Cria nova clinica | Nao | `superadmin_create_usuario()` busca `Clinica` existente por `payload.clinica_id` e instancia somente `Usuario(...)`. |
| Cria novo tenant | Nao | Nao chama `signup_service` nem provisionamento de tenant; usa clinica existente. |
| Cria usuario dentro da clinica selecionada | Sim | Frontend envia `clinica_id: clinicaId`; backend grava `clinica_id=clinica.id`. |
| Cria administrador da clinica | Sim | Frontend envia `is_admin: true`; backend grava `is_admin=bool(payload.is_admin)`. |
| Cria usuario comum | Nao no legado | Schema aceitaria `is_admin=False`, mas o fluxo legado fixa `true`. |
| Cria usuario MASTER | Nao | `is_master` e derivado por e-mail owner, nao campo gravado pelo endpoint. |
| Cria usuario Super Admin | Nao diretamente | `is_superadmin` e derivado por usuario admin dentro de clinica Super Admin; o endpoint nao grava campo proprio. |
| Cria convite | Nao | Nao ha chamada de servico de e-mail ou codigo de convite. |
| Gera senha temporaria | Nao | Senha e informada no prompt e enviada no payload. |
| Exige senha informada | Sim | Frontend e backend validam senha minima de 6 caracteres. |
| Respeita limite de usuarios | Nao | Nao ha consulta/bloqueio por limite no endpoint auditado. |
| Cria cobranca | Nao | Nenhuma entidade de cobranca e instanciada. |
| Altera plano | Nao | Nao altera `tipo_conta` nem chama regra de plano. |
| Altera assinatura | Nao | Nao cria nem sincroniza assinatura neste endpoint. |
