# Contrato das acoes ADM Clinicas

## Escopo

Este contrato registra as acoes administrativas de `ADM -> Clinicas` migradas ou auditadas para o frontend React do Brana Cloude.

## Acao implementada nesta etapa: +Teste

- Definicao: acrescenta dias ao periodo de teste da clinica selecionada.
- Origem no legado: `frontend/app.js`, funcao `saProrrogarTesteClinica(id, dias)`.
- Campo numerico legado: `input.sa-trial-days`.
- Valor inicial legado: `10`.
- Unidade: dias.
- Minimo: `1`.
- Maximo: `3650`.
- Decimal: o legado arredondava com `Math.round`, mas o React rejeita decimal antes da request conforme regra desta etapa.
- Endpoint: `PATCH /superadmin/clinicas/{clinica_id}/trial-extra`.
- Payload: `{ "dias": <inteiro> }`.
- Autorizacao: `_require_superadmin(current_user)`.
- Protecao MASTER: clinica MASTER so pode ser alterada quando `_is_owner_clinica` permitir pelo e-mail owner.
- Confirmacao: o legado usa `window.confirm`; o React usa um `Modal` controlado do Ant Design em `ClinicsPage.jsx`.
- Mensagem de sucesso: usa `detail` retornado pelo backend ou fallback discreto.
- Mensagem de erro: usa erro real do backend, sem `alert` nativo.
- Auditoria: `registrar_auditoria` com acao `clinica_trial_extend`, alvo `clinica`, detalhes `dias` e `trial_ate`.
- Refetch: apos sucesso, chama o refetch interno de Clinicas.
- Preservacao: busca, filtros por coluna, ordenacao, colunas visiveis, scroll, rodape e selecao sao preservados.
- Selecao: o React normaliza o `rowKey` selecionado para numero antes de habilitar/executar a acao, evitando divergencia string/numero entre selecao visual e estado funcional.

## Regra backend de data

- Se `trial_ate` esta no futuro, a base e o proprio `trial_ate`.
- Se `trial_ate` esta vazio ou expirado, a base e `datetime.utcnow()`.
- O backend soma `dias` a essa base.
- O backend define `tipo_conta = "DEMO 7 dias"`.
- O backend define `ativo = True`.
- O backend sincroniza `PlataformaAssinatura`.

## Acao implementada nesta etapa: Suspender / Ativar

- Legado: `saAlterarStatusClinica(id, ativo)`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/status`.
- Payload: `{ ativo, motivo }`.
- Semantica: clinica ativa exibe `Suspender` e envia `ativo: false`; clinica inativa exibe `Ativar` e envia `ativo: true`.
- Confirmacao: o legado usa `window.confirm`; o React usa um `Modal` controlado em `ClinicsPage.jsx`.
- Motivo: opcional no legado e no backend; React exibe `Motivo (opcional)`.
- Auditoria: `clinica_status_update`.
- Protecao MASTER: `_is_owner_clinica` bloqueia alteracao por ator que nao seja owner.
- Impacto: `Clinica.ativo` altera `assinatura_status`; `sync_assinatura_from_clinica` atualiza assinatura e bloqueio.
- Login/renew: clinica inativa passa a ser bloqueada pelas regras existentes; tokens ja emitidos nao sao revogados nesta etapa.
- Refetch: apos sucesso, chama o refetch interno de Clinicas e preserva selecao/busca/filtros/ordenacao/colunas.
- Service: `updateAdminClinicStatus`.
- Hook: `useUpdateClinicStatus`.
- Endpoint novo: nao.
- Backend/banco/migration: sem alteracao.
- Correcao textual: o modal React deve manter UTF-8 real nos textos `Suspender clínica`, `Usuários dessa clínica`, `Confirmar suspensão`, `Ativar clínica` e `Confirmar ativação`; mojibake nao e aceito como concluido.

## Acoes auditadas e ainda nao implementadas

### Demo

- Legado: `saAlterarPlanoClinica(id, "DEMO")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload: `{ plano: "DEMO", manter_ativo: true }`, com `dias` opcional.
- Confirmacao: `window.confirm`; dias opcionais por `window.prompt`.
- Auditoria: `clinica_plano_update`.
- Riscos: alterar plano, trial, ativacao e cobranca derivada.
- React: implementado com modal controlado em `ClinicsPage.jsx`, service `setAdminClinicDemo` e hook `useSetClinicDemo`.
- Payload React: `{ plano: "DEMO", manter_ativo: true }`; `dias` nao e enviado para preservar o padrao backend de 7 dias.
- Semantica confirmada: muda `tipo_conta` para `DEMO 7 dias`, define `trial_ate = agora + 7 dias`, define `ativo = True` e sincroniza `PlataformaAssinatura`.
- Diferenca para `+Teste`: `+Teste` acrescenta dias; `Demo` altera o plano e reinicia a validade padrao do plano Demo.
- Cobranca: nao cria, nao remove e nao aprova cobranca.
- Limite de usuarios: sem alteracao estrutural neste endpoint.
- MASTER/protegida: UI desabilita quando a linha normalizada e `MASTER`; backend continua bloqueando owner/MASTER para ator nao owner.
- Clinica ja Demo: backend permite reaplicar e reiniciar validade.
- Clinica suspensa: backend permite aplicar Demo e reativar.
- Documentacao detalhada: `docs/implementacao_acao_demo_adm_clinicas.md`.

### Mensal

- Legado: `saAlterarPlanoClinica(id, "MENSAL")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload: `{ plano: "MENSAL", manter_ativo: true }`, com `dias` opcional.
- Auditoria: `clinica_plano_update`.
- Riscos: ativacao comercial, proxima cobranca e status.
- React: implementado com modal controlado em `ClinicsPage.jsx`, service `setAdminClinicMonthlyPlan` e hook `useSetClinicMonthlyPlan`.
- Payload React: `{ plano: "MENSAL", manter_ativo: true }`; `dias` nao e enviado para preservar o padrao backend de 30 dias.
- Semantica confirmada: muda `tipo_conta` para `Mensal`, define `trial_ate = agora + 30 dias`, define `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Cobranca: nao cria boleto, Pix, checkout ou registro de cobranca; apenas sincroniza assinatura derivada.
- Limite de usuarios: sem alteracao estrutural neste endpoint.
- MASTER/protegida: UI desabilita quando a linha normalizada e `MASTER`; backend continua bloqueando owner/MASTER para ator nao owner.
- Clinica ja Mensal: backend permite reaplicar e reiniciar validade.
- Clinica Demo: backend permite mudar para Mensal.
- Clinica suspensa: backend permite aplicar Mensal e reativar.
- Clinica Anual: backend permite mudar para Mensal.
- Documentacao detalhada: `docs/implementacao_acao_mensal_adm_clinicas.md`.

### Anual

- Legado: `saAlterarPlanoClinica(id, "ANUAL")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload: `{ plano: "ANUAL", manter_ativo: true }`, com `dias` opcional.
- Auditoria: `clinica_plano_update`.
- Riscos: ativacao comercial, vencimento anual e cobranca.
- React: implementado com modal controlado em `ClinicsPage.jsx`, service `setAdminClinicAnnualPlan` e hook `useSetClinicAnnualPlan`.
- Payload React: `{ plano: "ANUAL", manter_ativo: true }`; `dias` nao e enviado para preservar o padrao backend de 365 dias.
- Semantica confirmada: muda `tipo_conta` para `Anual`, define `trial_ate = agora + 365 dias`, define `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Cobranca: nao cria boleto, Pix, checkout ou registro de cobranca; apenas sincroniza assinatura derivada e `proxima_cobranca_em`.
- Limite de usuarios: sem alteracao estrutural neste endpoint.
- MASTER/protegida: UI desabilita quando a linha normalizada e `MASTER`; backend continua bloqueando owner/MASTER para ator nao owner.
- Clinica ja Anual: backend permite reaplicar e reiniciar validade.
- Clinica Mensal: backend permite mudar para Anual.
- Clinica Demo: backend permite mudar para Anual.
- Clinica suspensa: backend permite aplicar Anual e reativar.
- Documentacao detalhada: `docs/implementacao_acao_anual_adm_clinicas.md`.

### Super Admin

- Legado: `saAlterarPlanoClinica(id, "SUPERADMIN")`.
- Endpoint: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload: `{ plano: "SUPERADMIN", manter_ativo: true }`.
- Significado auditado: plano/tipo de conta da clinica, nao permissao de usuario.
- Auditoria: `clinica_plano_update`.
- Riscos: conta de plataforma/vitalicia, protecao MASTER e visibilidade de dados.
- Classificacao: A, mudanca apenas de plano da clinica.
- React: implementado com modal controlado em `ClinicsPage.jsx`, service `setAdminClinicSuperAdminPlan` e hook `useSetClinicSuperAdminPlan`.
- Payload React: `{ plano: "SUPERADMIN", manter_ativo: true }`; `dias` nao e enviado para preservar o padrao backend de 365 dias.
- Semantica confirmada: muda `tipo_conta` para `Super Admin`, define `trial_ate = agora + 365 dias`, define `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Usuario: nao altera `is_admin`, nao grava `is_master`, nao grava `is_superadmin`, nao escolhe usuario alvo e nao define owner.
- Acesso ADM: pode ser concedido indiretamente a usuarios admin da clinica porque `is_platform_superadmin_user` deriva acesso de `usuario.is_admin` + `clinica.tipo_conta` Super Admin.
- Cobranca: nao cria boleto, Pix, checkout ou registro de cobranca; assinatura `SUPERADMIN` nao define `proxima_cobranca_em`.
- MASTER/protegida: UI desabilita quando a linha normalizada e `MASTER`; backend continua bloqueando owner/MASTER para ator nao owner.
- Clinica ja Super Admin: backend permite reaplicar e reiniciar validade.
- Clinica Demo/Mensal/Anual: backend permite mudar para Super Admin.
- Clinica suspensa: backend permite aplicar Super Admin e reativar.
- Documentacao detalhada: `docs/implementacao_acao_super_admin_adm_clinicas.md`.

### Novo usuario

- Legado: `saCriarUsuarioClinica(clinicaId)`.
- Endpoint: `POST /superadmin/usuarios`.
- Payload: `{ clinica_id, nome, email, senha, is_admin: true, ativar_clinica: true }`.
- Validacoes: nome, e-mail, senha minima de 6 caracteres.
- Auditoria: `usuario_create`.
- Riscos: senha inicial, limite de usuarios, perfil, usuario sistemico e vinculos.

### Excluir

- Legado: `saExcluirClinica(id)`.
- Endpoint: `DELETE /superadmin/clinicas/{id}`.
- Confirmacoes: `window.confirm` e prompt com `EXCLUIR`.
- Efeito: exclusao definitiva do tenant e dados relacionados conforme `_delete_clinica_definitiva`.
- Auditoria: `clinica_delete_definitivo`.
- Riscos: irreversivel, dependencias, rollback, owner, usuarios, cobrancas e dados clinicos.
