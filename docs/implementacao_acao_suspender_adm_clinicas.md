# Implementacao da acao Suspender em ADM Clinicas

## Definicao

`Suspender` altera o campo `Clinica.ativo` para `false` na clinica selecionada. Quando a clinica ja esta inativa, o legado exibe `Ativar` e envia `ativo: true` pelo mesmo endpoint.

## Legado auditado

- Arquivo: `frontend/app.js`.
- Renderizacao: botoes com `data-sa-action="toggle"`.
- Rotulo legado: `${c.ativo ? "Suspender" : "Ativar"}`.
- Funcao chamada: `saAlterarStatusClinica(id, ativo)`.
- Chamada do clique: `saAlterarStatusClinica(id, !item.ativo)`.

## Endpoint

- `PATCH /superadmin/clinicas/{clinica_id}/status`

## Payload

```json
{ "ativo": false, "motivo": "texto opcional" }
```

Para ativar novamente:

```json
{ "ativo": true, "motivo": "texto opcional" }
```

## Motivo

- No legado, o motivo e solicitado por `window.prompt("Motivo (opcional):", "")`.
- No backend, `SuperAdminSetStatusPayload` define `motivo: str | None = None`.
- Portanto, o motivo nao e obrigatorio.
- O React usa campo `Motivo (opcional)` em modal controlado.
- O React limita preventivamente a 500 caracteres; o backend nao possui limite explicito.

## Confirmacao e modal

- O legado usa `window.confirm` antes do prompt.
- O React nao usa `Modal.confirm` estatico.
- O React usa modal controlado em `ClinicsPage.jsx`.
- Cancelar fecha o modal e nao faz request.
- Erro nao fecha o modal e preserva o motivo digitado.
- Sucesso fecha o modal, limpa o motivo, mostra mensagem e faz refetch.

## Semantica de status

- `ativo: false`: suspende a clinica.
- `ativo: true`: ativa novamente a clinica.
- `assinatura_status_from_clinica` retorna `suspensa` quando `clinica.ativo` e falso.
- `sync_assinatura_from_clinica` atualiza `PlataformaAssinatura.status` e `bloqueada`.

## Autorizacao e protecoes

- O endpoint exige `_require_superadmin(current_user)`.
- A clinica MASTER e bloqueada para usuario que nao seja owner por `_is_owner_clinica`.
- O frontend nao usa e-mail hardcoded e nao tenta contornar a autoridade backend.

## Auditoria

- Acao: `clinica_status_update`.
- Alvo: `clinica`.
- Detalhes: `ativo` e `motivo` trimado.
- IP: `request.client.host`, quando disponivel.

## Impacto no login e sessoes

- Novos logins/renovacoes sao bloqueados quando a clinica esta inativa: `auth_routes.py` retorna `Conta suspensa`.
- O middleware de trial tambem bloqueia requisicoes operacionais de clinicas inativas, exceto caminhos de licenca.
- Tokens ja emitidos nao sao revogados nesta etapa.
- Sessoes abertas passam a receber bloqueio nas proximas chamadas protegidas conforme regras existentes.
- Reativar restaura o acesso sem alterar login, renew, logout ou `/me`.

## Arquitetura frontend

- Service: `frontend-react/src/features/admin/clinics/services/adminClinicActionsApi.js`.
- Hook: `frontend-react/src/features/admin/clinics/hooks/useUpdateClinicStatus.js`.
- Orquestracao: `ClinicsPage.jsx`.
- Toolbar: `ClinicsToolbarContent.jsx`, sem HTTP e sem modal.

## Estados preservados

- Selecao.
- Busca.
- Filtros por coluna.
- Ordenacao.
- Colunas visiveis.
- Scroll e rodape.
- `+Teste`.
- Demais acoes permanecem sem escrita real.

## Backend e banco

- Endpoint reutilizado: sim.
- Endpoint novo: nao.
- Backend alterado: nao.
- Banco alterado: nao.
- Migration criada: nao.

## Testes

- Backend: `backend/tests/test_superadmin_clinics_status.py`.
- Frontend: `frontend-react/tests/adminClinics.test.js`.
- Auth deve continuar passando por nao haver alteracao em login/renew/logout.

## Runtime

- Validacao runtime deve ser feita somente em ambiente local e com clinica descartavel.
- Nao executar em AWS/producao.
- Confirmar uma unica request PATCH, payload correto, mensagem, refetch e ausencia de erro no Console.

## Riscos e rollback

- Risco principal: suspender clinica usada para acesso de teste local.
- Rollback funcional: selecionar a mesma clinica inativa e executar `Ativar`.
- Rollback tecnico: remover hook/service de status e voltar o botao `Suspender` para desabilitado.

## Git

- Sem commit.
- Sem push.

## Correcao textual UTF-8 do modal

- Defeito observado em runtime: o modal exibia `Suspender clÃƒÂ­nica`, `UsuÃƒÂ¡rios dessa clÃƒÂ­nica` e `Confirmar suspensÃƒÂ£o`.
- Causa raiz: strings fixas do JSX foram salvas ja corrompidas por dupla conversao de UTF-8; nao houve evidencia de erro no endpoint, payload, resposta da API, Vite ou charset do HTML.
- Correcao aplicada: os literais do modal, mensagens de selecao, sucesso e erro foram regravados na fonte em UTF-8 real.
- Textos finais: `Suspender clínica`, `Suspender a clínica "{nome}"? Usuários dessa clínica podem perder acesso ao sistema.`, `Motivo (opcional)`, `Cancelar`, `Confirmar suspensão`, `Ativar clínica` e `Confirmar ativação`.
- Nao foi criado helper de encode/decode, `.replace()` corretivo ou conversao em runtime.
- Teste de regressao textual: `frontend-react/tests/adminClinics.test.js` verifica textos corretos e ausencia de `clÃ`, `clÃƒ`, `UsuÃ`, `suspensÃ`, `ativaÃ`, `confirmaÃ`, `Ã‚` e `�` nos arquivos ativos da frente.
- Validacao runtime funcional de suspender/ativar segue pendente ate execucao autenticada em ambiente local seguro.
