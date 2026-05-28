# Auditoria EasyDental virgem - Subetapa 8W-A - permissoes padrao de usuarios criados posteriormente

## 1. Contexto

- A Subetapa 8V-B resolveu o setup para usuarios posteriores.
- A observacao nova do usuario e que usuarios criados pelo ADM ainda parecem nascer com alguns modulos bloqueados e outros livres.
- A regra desejada preliminar e deixar o novo usuario mais livre em geral, com `Usuarios` e `Opcoes do Sistema` bloqueados por padrao.
- Esta etapa e somente documental e nao implementa nada.

## 2. Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhuma conta foi criada ou excluida.
- `Opcoes do Sistema` nao foram alteradas.
- Permissoes nao foram alteradas.
- O EasyDental nao foi alterado.
- A blindagem textual/mojibake foi respeitada.

## 3. Como `permissoes_json` nasce hoje

### 3.1 Criacao pelo modulo Usuarios

- Em `backend/routes/user_admin_routes.py`, o usuario novo nasce com:
  - `setup_completed = True`;
  - `is_system_user = False`;
  - `permissoes_json = dump_permissions_json(sanitize_permissions({}, tipo_usuario=payload.tipo_usuario, is_admin=bool(payload.is_admin)))`.
- Isso significa que o backend monta a matriz inicial.
- O frontend nao cria o `permissoes_json` de nascimento.
- O frontend apenas edita e envia o payload de permissao depois.

### 3.2 Criacao pelo Superadmin

- Em `backend/routes/superadmin_routes.py`, o usuario novo nasce com:
  - `setup_completed = True`;
  - `is_system_user = False`;
  - `permissoes_json` nao e preenchido explicitamente no create.
- Na pratica, o acesso efetivo depende do estado do usuario, do tipo e da leitura posterior via `sanitize_permissions()` e `get_module_access_level()`.

### 3.3 Papel de `default_permissions`

- `backend/security/permissions.py:default_permissions(tipo_usuario, is_admin)` e a fonte da matriz inicial.
- `sanitize_permissions()` usa o baseline de `default_permissions`.
- `is_admin=True` habilita todos os modulos.
- `tipo_usuario` direciona o baseline quando o usuario nao e admin.

### 3.4 Papel de `tipo_usuario` e `is_admin`

- `tipo_usuario` influencia diretamente o mapa inicial.
- `is_admin` sobrepoe o baseline e libera todos os modulos no mapa interno.
- O frontend nao define a matriz inicial; ele so expõe e edita o resultado.

## 4. Modulos bloqueados/livres atualmente

| Modulo | Estado padrao atual | Origem | Depende do tipo_usuario? | Depende do frontend? | Depende do backend? | Observacao |
| --- | --- | --- | --- | --- | --- | --- |
| Usuarios | Desabilitado para Dentista (CD); protegido para Clinica; habilitado para admin | `default_permissions()` + `require_admin_password_if_user_control_enabled()` | Sim | Nao | Sim | E um modulo administrativo sensivel e separado |
| Prestadores | Desabilitado para Dentista (CD); protegido para Clinica | `default_permissions()` | Sim | Nao | Sim | Pode ficar mais livre em cenarios de admin |
| Agenda | Habilitado nos perfis principais | `default_permissions()` | Sim | Nao | Sim | Normalmente livre no nascimento |
| Financeiro | Protegido ou desabilitado conforme tipo | `default_permissions()` | Sim | Nao | Sim | Area sensivel |
| Materiais | Habilitado ou protegido conforme tipo | `default_permissions()` | Sim | Nao | Sim | Mais aberto que Financeiro |
| Procedimentos | Habilitado ou protegido conforme tipo | `default_permissions()` | Sim | Nao | Sim | Acesso operacional importante |
| Anamnese | Habilitado ou protegido conforme tipo | `default_permissions()` | Sim | Nao | Sim | Area funcional aberta nos perfis principais |
| Relatorios | Protegido ou desabilitado conforme tipo | `default_permissions()` | Sim | Nao | Sim | Pode exigir senha/protecao |
| Configuracao | Desabilitado para Dentista (CD); protegido para Clinica; habilitado para admin | `default_permissions()` + `require_admin_password_if_user_control_enabled()` | Sim | Nao | Sim | Equivale ao bloco administrativo mais sensivel |

## 5. Origem da regra

- `default_permissions`: sim, e a origem primaria da matriz.
- `tipo_usuario`: sim, define o baseline principal.
- `frontend`: nao cria a matriz, apenas exibe e salva edicao.
- `backend`: sim, monta, sanitariza e aplica a regra no nascimento e na leitura.
- Regra especial: `is_admin=True` libera tudo.
- Indefinido: nao foi encontrado um gerador no frontend que substitua o backend.

## 6. Usuarios e Opcoes do Sistema

- `Usuarios` tem protecao propria por modulo via `MODULE_PERMISSION_SCHEMA` e `require_module_access("usuarios")`.
- `Usuarios` tambem passa por `require_admin_password_if_user_control_enabled("usuarios")`.
- `Opcoes do Sistema` / `Configuracao` tem protecao propria por modulo via `MODULE_PERMISSION_SCHEMA` e `require_module_access("configuracao")`.
- `Opcoes do Sistema` / `Configuracao` tambem passa por `require_admin_password_if_user_control_enabled("configuracao")`.
- A senha interna nao substitui permissao de modulo; ela adiciona uma barreira quando o controle interno esta ativo.
- Portanto, sao duas camadas diferentes:
  - permissao de modulo;
  - gate de senha interna/admin password quando o controle esta ligado.

## 7. Checkbox Ativar controle de usuarios e senhas

- Nome tecnico: `seguranca.ativar_controle_usuarios`.
- Onde fica: `clinica.opcoes_sistema_json`.
- Valor default atual no Brana: `True`.
- Como interfere hoje: ativa `require_admin_password_if_user_control_enabled()` nos modulos protegidos.
- Interfere em `permissoes_json`: nao foi encontrado efeito direto na montagem inicial do JSON.
- Interfere em senha/admin password: sim, exige senha protegida ou grant valido quando ativo.
- Divergencia com a regra desejada: o valor padrao atual do Brana e mais fechado do que a leitura do EasyDental virgem registrada na trilha documental.

## 8. Comparacao EasyDental

- Na trilha 8T-C, o `SISTEMA.raw` confirmou `ControleUsuarios=0` e `Auditoria=0`.
- A mesma trilha confirmou `Mestre`, `Clínica` e `Dentista (CD)` na fonte principal.
- A comparacao sustenta que o legado nasce com o controle interno desativado.
- No Brana atual, o controle interno aparece ligado por default e ainda convive com o baseline de permissao por modulo.
- Limitacao: a comparacao aqui e documental e depende dos contratos e da trilha da 8T-C, sem escrita no legado.

## 9. Contrato tecnico proposto

- Usuarios novos nascem com acesso livre aos modulos em geral.
- `Usuarios` e `Opcoes do Sistema` ficam bloqueados ou protegidos por padrao.
- O ADM ajusta depois conforme a regra operacional.
- O controle interno de usuarios/senhas governa a aplicacao detalhada das protecoes.
- Contas existentes continuam preservadas.

## 10. Opcoes de implementacao avaliadas

| Opcao | Arquivos afetados | Risco | Vantagem | Recomendacao |
| --- | --- | --- | --- | --- |
| Apenas mudar o frontend | `frontend/app.js`, `frontend/index.html` | Alto, porque o backend continuaria impondo a regra | Mudanca visual rapida | Nao recomendada |
| Alterar o baseline de `default_permissions()` por tipo | `backend/security/permissions.py`, possivelmente rotas de criacao | Medio | Centraliza o mapa inicial | Boa candidata se o contrato fechar |
| Ajustar somente o gate de senha interna | `backend/security/dependencies.py`, `backend/routes/system_options_routes.py` | Medio/alto | Remove bloqueio de senha sem tocar no JSON | Nao resolve a matriz de acesso sozinha |
| Unificar matriz formal futura | varios arquivos de permissao | Alto | Contrato mais limpo no longo prazo | Apenas com contrato proprio |

## 11. Implementacao recomendada

- Menor alteracao segura: ajustar o baseline de permissao dos usuarios novos de forma isolada, sem mexer em setup, senha interna, unidade, prestadores ou seeds.
- Arquivos provaveis numa futura 8W-B:
  - `backend/security/permissions.py`
  - `backend/routes/user_admin_routes.py`
  - `backend/routes/superadmin_routes.py`
- Checks recomendados:
  - `python -m py_compile` nos arquivos alterados;
  - import seguro dos modulos;
  - teste manual criando usuario posterior e validando acesso aos modulos.

## 12. Riscos identificados

- Liberar modulos demais.
- Bloquear modulos demais.
- Confundir permissao de modulo com senha interna.
- Ignorar o controle de usuarios/senhas.
- Quebrar contas antigas.
- Quebrar usuarios ja existentes.
- Deixar `Usuarios` e `Opcoes do Sistema` acessiveis indevidamente.

## 13. Fora de escopo

- Implementacao nesta etapa.
- Setup.
- Senha interna.
- Auditoria.
- Alteracao de senha.
- Unidade.
- Prestadores.
- Tabelas de procedimentos.
- Frontend, salvo leitura.
- Contas existentes.
- Correcao textual da tela de setup.

## 14. Proxima subetapa recomendada

- `8W-B` para implementacao isolada das permissoes padrao de usuarios novos.
- Se ainda houver duvida de contrato, fazer antes um contrato complementar pequeno e fechado.

## 15. Plano de verificacao

Confirmado:
- somente este documento novo e o roadmap foram alterados;
- frontend nao foi alterado;
- backend nao foi alterado;
- banco/schema/migrations/seeds/endpoints nao foram alterados;
- nenhuma conta foi criada ou excluida;
- permissoes nao foram alteradas;
- EasyDental nao foi alterado;
- blindagem textual/mojibake foi respeitada.
