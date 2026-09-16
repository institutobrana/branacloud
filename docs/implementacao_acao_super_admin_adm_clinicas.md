# Implementacao da acao Super Admin em ADM Clinicas

## Classificacao

Categoria A: mudanca apenas de plano da clinica.

O botao `Super Admin` do legado nao promove usuario, nao escolhe usuario alvo, nao altera `is_admin`, nao grava `is_master`, nao grava `is_superadmin` e nao define owner. A acao reutiliza a alteracao de plano da clinica.

## Contrato legado auditado

- Funcao legado: `saAlterarPlanoClinica(id, plano)` em `frontend/app.js`.
- Acionamento legado: `saAlterarPlanoClinica(id, "SUPERADMIN")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Metodo: `PATCH`.
- Payload legado: `{ plano: "SUPERADMIN", manter_ativo: true }`.
- `dias`: o legado nao abre prompt de dias para `SUPERADMIN`; o React tambem nao envia `dias`.
- Confirmacao legado: `window.confirm("Aplicar o plano Super Admin para a clinica ...?")`.
- Mensagem de sucesso: `detail` do backend ou `Plano atualizado.`.
- Mensagem de erro: `detail` do backend ou `Falha ao atualizar plano da clinica.`.

## Semantica backend confirmada

- Valor normalizado: `SUPERADMIN`.
- Tipo de conta gravado: `Super Admin`.
- Validade padrao: 365 dias.
- `trial_ate`: redefinido para `datetime.utcnow() + timedelta(days=365)`.
- `ativo`: definido como `True` por `aplicar_plano_na_clinica`.
- `data_ativacao`: atualizada porque `SUPERADMIN` esta no conjunto de planos comerciais/vitalicios.
- Limite de usuarios: nao alterado por este endpoint.
- Usuario: nao alterado por este endpoint.
- Owner: nao alterado por este endpoint.

## Matriz semantica

| Conceito | Antes | Depois | Campo | Entidade | Reversivel |
|---|---|---|---|---|---|
| Plano da clinica | DEMO, MENSAL, ANUAL ou SUPERADMIN | SUPERADMIN | `plano` normalizado da resposta e assinatura derivada | Clinica/Assinatura | Sim, por Demo/Mensal/Anual |
| Tipo de conta | Valor atual da clinica | `Super Admin` | `tipo_conta` | Clinica | Sim, pelo mesmo endpoint de plano |
| is_master | Nao alterado | Nao alterado | Nao existe escrita | Usuario | Nao aplicavel |
| is_superadmin | Nao alterado | Nao alterado | Nao existe coluna/escrita direta | Usuario | Nao aplicavel |
| Owner | Nao alterado | Nao alterado | E-mail owner por configuracao/env | Usuario/Clinica | Nao aplicavel |
| Acesso ADM | Derivado de owner ou usuario admin em clinica Super Admin | Pode passar a ser concedido indiretamente a admins da clinica | `is_admin` + `clinica.tipo_conta` em `is_platform_superadmin_user` | Usuario/Clinica | Sim, ao mudar plano da clinica |
| Trial | Valor atual | Agora + 365 dias | `trial_ate` | Clinica | Sim, por nova acao de plano/trial |
| Status | Ativa/suspensa | Ativa | `ativo` | Clinica | Sim, por Suspender |
| Cobranca | Nao alterada | Nao alterada | Nenhuma escrita em `PlataformaCobranca` | Cobranca | Nao aplicavel |
| Assinatura | Derivada da clinica | Sincronizada para plano `SUPERADMIN` | `plano`, `status`, `fim_em`, `bloqueada` | PlataformaAssinatura | Sim, por nova acao de plano |

## Autorizacao e protecoes

- O endpoint chama `_require_superadmin(current_user)`.
- Request sem token e bloqueado por `get_current_user`.
- Usuario comum e admin comum sem acesso de plataforma sao bloqueados.
- Owner por e-mail e autorizado como superadmin de plataforma.
- Usuario `is_admin` de clinica com `tipo_conta` Super Admin e reconhecido por `is_platform_superadmin_user`.
- Clinica owner/MASTER e bloqueada para ator nao owner por `_is_owner_clinica`.
- A UI bloqueia a acao quando a linha normalizada aparece como `MASTER`.
- O backend permanece a autoridade final.

## Impacto em autenticacao e sessoes

- Login nao e alterado.
- Renew nao e alterado.
- Logout nao e alterado.
- Token nao e manipulado pelo frontend.
- O usuario promovido nao existe nesta acao; nenhum usuario alvo e escolhido.
- O acesso ADM e derivado no backend a cada contexto de usuario, a partir de `is_admin` e do `tipo_conta` da clinica.
- Sessoes abertas podem precisar de nova leitura de `/me` ou novo login para refletir a nova permissao na UI, conforme o fluxo de sessao ativo; esta etapa nao altera BroadcastChannel nem politica de renovacao.

## Assinatura e cobranca

- `sync_assinatura_from_clinica` sincroniza `PlataformaAssinatura`.
- Para `SUPERADMIN`, `assinatura.plano` fica `SUPERADMIN`.
- `assinatura.status` fica `ativa` se a clinica estiver ativa.
- `assinatura.fim_em` recebe `clinica.trial_ate`.
- `assinatura.proxima_cobranca_em` fica `None`, pois so `MENSAL` e `ANUAL` definem proxima cobranca derivada.
- A acao nao cria registro em `PlataformaCobranca`.
- A acao nao cria boleto.
- A acao nao cria Pix.
- A acao nao inicia checkout.

## Auditoria

- Acao registrada: `clinica_plano_update`.
- Dados registrados hoje: `plano`, `dias`, `manter_ativo`, `tipo_conta`, `trial_ate`.
- Lacuna preservada: a auditoria atual nao registra explicitamente plano/status/trial anteriores nem permissao anterior/nova, pois nenhuma permissao de usuario e alterada.

## Implementacao React

- Service: `setAdminClinicSuperAdminPlan`, reutilizando `setAdminClinicPlan`.
- Hook: `useSetClinicSuperAdminPlan`, com loading proprio e bloqueio de duplicidade via `runningRef`.
- Toolbar: `ClinicsToolbarContent` recebe `superAdminDisabled`, `superAdminLoading`, `superAdminLabel` e `onSuperAdmin`.
- Pagina: `ClinicsPage` coordena selecao, modal, confirmacao, hook, mensagem, fechamento e refetch.
- Modal: controlado, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Sucesso: fecha modal, mostra mensagem e chama `clinics.refresh()`.
- Erro: mantem modal aberto, libera nova tentativa e exibe a mensagem retornada.

## Estados preservados

- Selecao preservada quando o ID permanece apos refetch.
- Busca global preservada.
- Filtros por coluna preservados.
- Ordenacao preservada.
- Colunas visiveis preservadas.
- Tabela, rodape integrado, scroll e toolbar permanecem no padrao atual.

## Acoes preservadas

- `+Teste` preservado.
- `Suspender`/`Ativar` preservado.
- `Demo` preservado.
- `Mensal` preservado.
- `Anual` preservado.
- `Novo usuario` e `Excluir` permanecem sem escrita real nesta etapa.

## Runtime

- Validacao runtime deve ser feita somente localmente com sessao MASTER e clinica descartavel.
- Nao executar em AWS ou producao.
- Nao promover usuario real sensivel, pois esta acao nao e promocao de usuario.
- Roadmap so deve considerar `Super Admin` operacionalmente completo apos runtime aprovado.

## Rollback

- Reverter o service `setAdminClinicSuperAdminPlan`, o hook `useSetClinicSuperAdminPlan`, as props `superAdmin*`, o modal de Super Admin e esta documentacao.
- Nenhuma migration ou alteracao estrutural de banco foi criada.
- Nenhum endpoint novo foi criado.
- Sem commit e sem push nesta etapa.
