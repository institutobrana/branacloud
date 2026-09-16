# Implementacao da acao Demo - ADM Clinicas

## Escopo

Implementacao incremental da acao `Demo` em `ADM -> Clinicas` no frontend React do Brana Cloude.

Esta etapa conecta somente o botao `Demo`. As acoes `Mensal`, `Anual`, `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real.

## Contrato legado auditado

- Funcao legado: `saAlterarPlanoClinica(id, plano)` em `frontend/app.js`.
- Acionamento legado do botao Demo: `saAlterarPlanoClinica(id, "DEMO")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload legado minimo para Demo: `{ "plano": "DEMO", "manter_ativo": true }`.
- Campo `dias`: opcional no legado, informado por `window.prompt`.
- Confirmacao legado: `window.confirm("Aplicar o plano Demo para a clinica ...?")`.
- Mensagem sucesso legado: usa `detail` do backend ou `Plano atualizado.`.
- Mensagem erro legado: usa `detail` do backend ou `Falha ao atualizar plano da clinica.`.

## Contrato backend

- Rota: `superadmin_set_clinica_plano`.
- Payload: `SuperAdminSetPlanoPayload`.
- Service: `aplicar_plano_na_clinica`.
- Normalizacao: `normalize_plano_value("DEMO")` retorna `("DEMO", "DEMO 7 dias", 7)`.
- Efeito em `Clinica.tipo_conta`: define `DEMO 7 dias`.
- Efeito em `Clinica.trial_ate`: define `datetime.utcnow() + dias`, com `7` dias por padrao.
- Efeito em `Clinica.ativo`: define `True`.
- Efeito em `Clinica.data_ativacao`: nao altera para `DEMO`; so mensal, anual e superadmin atualizam.
- Efeito em assinatura: `sync_assinatura_from_clinica` sincroniza plano, status, fim e bloqueio.
- Efeito em cobranca: nao cria nem remove cobranca; apenas a assinatura derivada passa a plano Demo.
- Auditoria: `clinica_plano_update`, alvo `clinica`, detalhes com `plano`, `dias`, `manter_ativo`, `tipo_conta` e `trial_ate`.
- Protecao MASTER: clinica owner/MASTER e bloqueada para ator que nao seja owner.

## Diferenca para +Teste

- `+Teste` acrescenta dias ao periodo atual ou cria base em `datetime.utcnow()` quando expirado.
- `Demo` muda o plano para `DEMO`, define `tipo_conta = "DEMO 7 dias"`, reativa a clinica e reinicia a validade padrao para 7 dias quando `dias` nao e enviado.
- `+Teste` usa `PATCH /superadmin/clinicas/{id}/trial-extra`.
- `Demo` usa `PATCH /superadmin/clinicas/{id}/plano`.

## Implementacao React

- Service: `setAdminClinicDemo` em `adminClinicActionsApi.js`.
- Hook: `useSetClinicDemo`.
- Toolbar: `ClinicsToolbarContent` recebe `demoDisabled`, `demoLoading` e `onDemo`.
- Page: `ClinicsPage` controla o modal, a confirmacao, a chamada do hook, a mensagem de sucesso/erro e o refetch.
- Modal: controlado por estado local, sem `Modal.confirm` estatico, sem `window.confirm`, sem `window.prompt`, sem `alert`.
- Payload React: `{ "plano": "DEMO", "manter_ativo": true }`.
- `dias` nao e enviado pelo React nesta etapa; o backend aplica o padrao real de 7 dias.
- Refetch: apos sucesso, chama `clinics.refresh()`.
- Estados preservados por design: selecao quando o ID permanece, busca, filtros por coluna, ordenacao e colunas visiveis.

## Regras de habilitacao

- Sem clinica selecionada: `Demo` desabilitado.
- Clinica MASTER/protegida: `Demo` desabilitado pela UI quando o plano normalizado e `MASTER`; backend segue como autoridade final.
- Clinica ja Demo: permitida pelo contrato backend; regrava Demo e reinicia validade padrao.
- Clinica suspensa: permitida pelo contrato backend; `aplicar_plano_na_clinica` reativa a clinica.
- Clinica arquivada: nao ha campo estrutural especifico de arquivamento nesta rota; protecao conhecida e a clinica owner/MASTER.

## Impactos

- Plano: passa para `DEMO`.
- Tipo de conta: passa para `DEMO 7 dias`.
- Trial: reinicia para 7 dias por padrao quando o React nao envia `dias`.
- Status: com `ativo = True` e trial futuro, status derivado tende a `trial`.
- Cobranca: nao cria, nao aprova e nao remove cobranca.
- Limite de usuarios: sem alteracao estrutural encontrada neste endpoint.
- Login: nao foi alterado; o acesso futuro depende das regras existentes de clinica ativa e assinatura.
- Sessoes abertas: tokens ja emitidos nao sao revogados por esta acao.
- Recursos pagos: passam a depender do status/plano derivado da assinatura sincronizada.
- Reversibilidade: acoes futuras `Mensal` e `Anual` devem usar o mesmo endpoint de plano.

## Testes

- Backend: `backend/tests/test_superadmin_clinics_demo_plan.py`.
- Frontend: `frontend-react/tests/adminClinics.test.js`.
- Coberturas principais: endpoint, metodo, payload, Bearer, loading/hook, bloqueio de duplicidade, modal controlado, refetch, preservacao de +Teste e Suspender/Ativar, demais botoes sem escrita e textos sem mojibake.

## Runtime

A validacao runtime deve ser feita somente em ambiente local com login MASTER e clinica descartavel/local.

Demo so deve ser marcado como concluido operacionalmente no roadmap apos validar:

- cancelar sem request;
- confirmar com uma unica request;
- endpoint/metodo/payload corretos;
- tabela atualizada por refetch;
- selecao, busca, filtros, ordenacao e colunas preservados;
- console sem erros;
- +Teste e Suspender/Ativar preservados.

## Banco, migration, commit e push

- Endpoint novo: nao.
- Banco alterado: nao.
- Migration criada: nao.
- Commit: nao.
- Push: nao.
