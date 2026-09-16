# Implementacao da acao Anual em ADM Clinicas

## Contrato legado auditado

- Funcao legado: `saAlterarPlanoClinica(id, plano)` em `frontend/app.js`.
- Acionamento legado do botao Anual: `saAlterarPlanoClinica(id, "ANUAL")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Metodo: `PATCH`.
- Payload legado: `{ plano: "ANUAL", manter_ativo: true }`, com `dias` opcional quando informado no prompt legado.
- Payload React: `{ plano: "ANUAL", manter_ativo: true }`.
- O React nao envia `dias`; o backend aplica a validade padrao real do plano.

## Semantica backend confirmada

- Valor normalizado: `ANUAL`.
- Tipo de conta gravado: `Anual`.
- Validade padrao: 365 dias.
- `trial_ate`: redefinido para `datetime.utcnow() + timedelta(days=365)`, salvo quando o legado envia `dias`.
- `ativo`: definido como `True` por `aplicar_plano_na_clinica`; o payload React envia `manter_ativo: true`.
- `data_ativacao`: atualizada para planos `MENSAL`, `ANUAL` e `SUPERADMIN`.
- Limite de usuarios: nao e alterado por este endpoint.
- Login, renew, logout e sessoes: nao sao alterados por este endpoint.

## Assinatura e cobranca

- `sync_assinatura_from_clinica` sincroniza `PlataformaAssinatura`.
- Para `ANUAL`, `assinatura.plano` fica `ANUAL`.
- `assinatura.status` fica derivado do estado da clinica.
- `assinatura.fim_em` recebe `clinica.trial_ate`.
- `assinatura.proxima_cobranca_em` recebe `clinica.trial_ate` para planos `MENSAL` e `ANUAL`.
- A acao nao cria registro em `PlataformaCobranca`.
- A acao nao cria boleto.
- A acao nao cria Pix.
- A acao nao inicia checkout.

## Regras por estado

- Clinica ja Anual: backend permite reaplicar e reinicia a validade padrao.
- Clinica Mensal: backend permite mudar para Anual.
- Clinica Demo: backend permite mudar para Anual.
- Clinica suspensa: backend reativa com `manter_ativo: true`.
- Clinica MASTER/protegida: UI bloqueia linha normalizada como `MASTER`; backend continua bloqueando owner/MASTER para ator nao owner.
- Clinica inexistente: backend retorna 404.
- Plano invalido: backend retorna 400.
- Usuario sem perfil MASTER/superadmin autorizado no backend: bloqueado antes de alterar dados.

## Auditoria

- Acao registrada: `clinica_plano_update`.
- Dados registrados hoje: `plano`, `dias`, `manter_ativo`, `tipo_conta`, `trial_ate`.
- O endpoint registra autor, alvo, data/hora pela tabela de auditoria.
- Lacuna preservada: a auditoria atual nao registra explicitamente plano/status/trial anteriores nem assinatura anterior/nova.

## Implementacao React

- Service: `setAdminClinicAnnualPlan`, reutilizando `setAdminClinicPlan`.
- Hook: `useSetClinicAnnualPlan`, com loading proprio e bloqueio de duplicidade via `runningRef`.
- Toolbar: `ClinicsToolbarContent` recebe `annualDisabled`, `annualLoading` e `onAnnual`.
- Pagina: `ClinicsPage` coordena selecao, modal, confirmacao, hook, mensagem, fechamento e refetch.
- Modal: controlado, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Sucesso: fecha modal, mostra mensagem, chama `clinics.refresh()`.
- Erro: mantem modal aberto, libera nova tentativa e exibe a mensagem retornada.
- Nao ha reload e nao ha atualizacao otimista.

## Estados preservados

- Selecao preservada quando o ID permanece apos refetch.
- Busca global preservada.
- Filtros por coluna preservados pelo estado da tabela.
- Ordenacao preservada.
- Colunas visiveis preservadas.
- Tabela, rodape integrado, scroll e toolbar permanecem no padrao atual.

## Acoes preservadas

- `+Teste` preservado.
- `Suspender`/`Ativar` preservado.
- `Demo` preservado.
- `Mensal` preservado.
- `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real nesta etapa.

## Testes

- Teste backend dedicado: `backend/tests/test_superadmin_clinics_annual_plan.py`.
- Testes frontend estruturais e de service: `frontend-react/tests/adminClinics.test.js`.
- Build frontend deve continuar passando.

## Runtime

- Validacao runtime deve ser feita somente localmente com sessao MASTER e clinica descartavel.
- Nao executar em AWS ou producao.
- Roadmap so deve considerar `Anual` operacionalmente completo apos runtime aprovado.

## Rollback

- Reverter o service `setAdminClinicAnnualPlan`, o hook `useSetClinicAnnualPlan`, as props `annual*`, o modal de Anual e esta documentacao.
- Nenhuma migration ou alteracao estrutural de banco foi criada.
- Nenhum endpoint novo foi criado.
- Sem commit e sem push nesta etapa.
