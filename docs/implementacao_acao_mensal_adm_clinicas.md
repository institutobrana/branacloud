# Implementacao da acao Mensal - ADM Clinicas

## Escopo

Implementacao incremental da acao `Mensal` em `ADM -> Clinicas` no frontend React do Brana Cloude.

Esta etapa conecta somente o botao `Mensal`. As acoes `Anual`, `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real.

## Contrato legado auditado

- Funcao legado: `saAlterarPlanoClinica(id, plano)` em `frontend/app.js`.
- Acionamento legado do botao Mensal: `saAlterarPlanoClinica(id, "MENSAL")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload legado minimo para Mensal: `{ "plano": "MENSAL", "manter_ativo": true }`.
- Campo `dias`: opcional no legado, informado por `window.prompt`.
- Confirmacao legado: `window.confirm("Aplicar o plano Mensal para a clinica ...?")`.
- Mensagem sucesso legado: usa `detail` do backend ou `Plano atualizado.`.
- Mensagem erro legado: usa `detail` do backend ou `Falha ao atualizar plano da clinica.`.

## Contrato backend

- Rota: `superadmin_set_clinica_plano`.
- Payload: `SuperAdminSetPlanoPayload`.
- Service: `aplicar_plano_na_clinica`.
- Normalizacao: `normalize_plano_value("MENSAL")` retorna `("MENSAL", "Mensal", 30)`.
- Efeito em `Clinica.tipo_conta`: define `Mensal`.
- Efeito em `Clinica.trial_ate`: define `datetime.utcnow() + dias`, com `30` dias por padrao.
- Efeito em `Clinica.ativo`: define `True`.
- Efeito em `Clinica.data_ativacao`: atualiza para `datetime.utcnow()` porque Mensal e plano comercial.
- Efeito em assinatura: `sync_assinatura_from_clinica` sincroniza plano, status, fim, proxima cobranca derivada e bloqueio.
- Efeito em cobranca: nao cria, nao aprova, nao remove e nao abre checkout. Apenas a assinatura derivada passa a plano Mensal.
- Auditoria: `clinica_plano_update`, alvo `clinica`, detalhes com `plano`, `dias`, `manter_ativo`, `tipo_conta` e `trial_ate`.
- Protecao MASTER: clinica owner/MASTER e bloqueada para ator que nao seja owner.

## Semantica de Mensal

- `Mensal` muda o plano administrativo da clinica para `MENSAL`.
- O backend define `tipo_conta = "Mensal"`.
- O backend define um novo vencimento padrao de 30 dias quando `dias` nao e enviado.
- O backend reativa a clinica com `ativo = True`.
- O backend sincroniza `PlataformaAssinatura`.
- O endpoint nao executa cobranca financeira.

## Implementacao React

- Service generico seguro: `setAdminClinicPlan`.
- Wrapper Mensal: `setAdminClinicMonthlyPlan`.
- Hook: `useSetClinicMonthlyPlan`.
- Toolbar: `ClinicsToolbarContent` recebe `monthlyDisabled`, `monthlyLoading` e `onMonthly`.
- Page: `ClinicsPage` controla o modal, a confirmacao, a chamada do hook, a mensagem e o refetch.
- Modal: controlado por estado local, sem `Modal.confirm` estatico, sem `window.confirm`, sem `window.prompt`, sem `alert`.
- Payload React: `{ "plano": "MENSAL", "manter_ativo": true }`.
- `dias` nao e enviado pelo React nesta etapa; o backend aplica o padrao real de 30 dias.
- Refetch: apos sucesso, chama `clinics.refresh()`.
- Estados preservados por design: selecao quando o ID permanece, busca, filtros por coluna, ordenacao e colunas visiveis.

## Regras de habilitacao

- Sem clinica selecionada: `Mensal` desabilitado.
- Clinica MASTER/protegida: `Mensal` desabilitado pela UI quando o plano normalizado e `MASTER`; backend segue como autoridade final.
- Clinica ja Mensal: permitida pelo contrato backend; regrava Mensal e reinicia validade padrao.
- Clinica Demo: permitida pelo contrato backend; muda para Mensal.
- Clinica suspensa: permitida pelo contrato backend; `aplicar_plano_na_clinica` reativa a clinica.
- Clinica Anual: permitida pelo contrato backend; muda para Mensal.
- Clinica arquivada: nao ha campo estrutural especifico de arquivamento nesta rota; protecao conhecida e a clinica owner/MASTER.

## Impactos

- Plano: passa para `MENSAL`.
- Tipo de conta: passa para `Mensal`.
- Trial/validade: reinicia para 30 dias por padrao quando o React nao envia `dias`.
- Status: com `ativo = True` e plano Mensal, status derivado tende a `ativa`.
- Assinatura: sincronizada para plano Mensal.
- Cobranca: nao cria cobranca, boleto, Pix ou checkout.
- Limite de usuarios: sem alteracao estrutural encontrada neste endpoint.
- Login: nao foi alterado; o acesso futuro depende das regras existentes de clinica ativa e assinatura.
- Sessoes abertas: tokens ja emitidos nao sao revogados por esta acao.
- Recursos pagos: passam a depender do status/plano derivado da assinatura sincronizada.
- Reversibilidade: acoes `Demo` e futura `Anual` usam o mesmo endpoint de plano.

## Testes

- Backend: `backend/tests/test_superadmin_clinics_monthly_plan.py`.
- Frontend: `frontend-react/tests/adminClinics.test.js`.
- Coberturas principais: endpoint, metodo, payload, Bearer, loading/hook, bloqueio de duplicidade, modal controlado, refetch, preservacao de +Teste, Suspender/Ativar e Demo, demais botoes sem escrita e textos sem mojibake.

## Runtime

A validacao runtime deve ser feita somente em ambiente local com login MASTER e clinica descartavel/local.

Mensal so deve ser marcado como concluido operacionalmente no roadmap apos validar:

- cancelar sem request;
- confirmar com uma unica request;
- endpoint/metodo/payload corretos;
- tabela atualizada por refetch;
- selecao, busca, filtros, ordenacao e colunas preservados;
- console sem erros;
- +Teste, Suspender/Ativar e Demo preservados.

## Banco, migration, commit e push

- Endpoint novo: nao.
- Banco alterado: nao.
- Migration criada: nao.
- Commit: nao.
- Push: nao.
