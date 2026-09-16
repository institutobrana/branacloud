# Implementacao da acao +Teste em ADM Clinicas

## Definicao

`+Teste` prorroga o periodo de teste da clinica selecionada a partir da quantidade inteira de dias informada no Spin.

## Legado auditado

- `frontend/app.js`
- `frontend/index.html`
- `backend/routes/superadmin_routes.py`
- `backend/services/platform_admin_service.py`

No legado, a linha da clinica renderiza:

- `input.sa-trial-days`
- `type="number"`
- `min="1"`
- `max="3650"`
- `value="10"`
- botao `+Teste` com `data-sa-action="trial-extra"`

## Endpoint

- `PATCH /superadmin/clinicas/{clinica_id}/trial-extra`

## Payload

```json
{ "dias": 10 }
```

## Autorizacao

- O endpoint exige `_require_superadmin(current_user)`.
- Clinica MASTER e protegida por `_is_owner_clinica`.
- O frontend nao usa e-mail hardcoded e nao substitui a autoridade do backend.

## Spin

- Componente React: `InputNumber`.
- Valor inicial: `10`.
- Minimo: `1`.
- Maximo: `3650`.
- Unidade: dias.
- Inteiro obrigatório.
- Sem selecao: desabilitado.
- Com selecao: habilitado, salvo loading da acao.

## Fluxo

1. Selecionar uma clinica.
2. Informar dias.
3. Clicar `+Teste`.
4. Validar selecao e dias no frontend.
5. Confirmar via `Modal` controlado renderizado em `ClinicsPage.jsx`.
6. Enviar `PATCH` autenticado.
7. Exibir loading apenas em `+Teste`.
8. Bloquear clique duplicado.
9. Exibir sucesso ou erro real.
10. Recarregar a listagem pelo refetch interno.

## Efeito no trial

- Trial ativo: soma os dias ao `trial_ate` atual.
- Trial expirado: soma os dias a partir de `datetime.utcnow()`.
- Backend define `tipo_conta = "DEMO 7 dias"` e `ativo = True`.
- Backend sincroniza assinatura.

## Atualizacao da tabela

- Nao ha update otimista.
- A tabela e atualizada somente apos resposta de sucesso do servidor.
- Busca, filtros por coluna, ordenacao, colunas visiveis, rodape, scroll e selecao permanecem.

## Auditoria

- Backend registra `clinica_trial_extend`.
- Detalhes: `dias` e `trial_ate`.

## Erros

- Frontend bloqueia vazio, decimal, abaixo de `1`, acima de `3650` e clinica ausente.
- Backend permanece autoridade final para 401, 403, 404 e 400.
- Nao ha `alert` nativo no React.

## Arquitetura frontend

- Service: `frontend-react/src/features/admin/clinics/services/adminClinicActionsApi.js`.
- Hook: `frontend-react/src/features/admin/clinics/hooks/useExtendClinicTrial.js`.
- Orquestracao: `ClinicsPage.jsx`.
- Toolbar: `ClinicsToolbarContent.jsx`, sem fetch direto.

## Correcao runtime do clique +Teste

- Falha observada: ao selecionar uma clinica, informar `1` no Spin e clicar `+Teste`, nada acontecia em runtime.
- Primeiro ponto de risco localizado: a confirmacao dependia da API estatica `Modal.confirm`; ela foi substituida por um `Modal` controlado no fluxo real da pagina.
- Segundo ponto de risco localizado: a selecao visual aceitava comparacao numerica, mas a preservacao de estado usava igualdade estrita entre IDs possivelmente string/numero.
- Ajuste aplicado: o radio da tabela normaliza `rowKey` para numero e os efeitos/refetches preservam selecao com `Number(row.id) === Number(current)`.
- Resultado esperado: clique abre modal visivel; confirmar chama `useExtendClinicTrial`; service envia `PATCH /superadmin/clinicas/{id}/trial-extra` com `{ "dias": 1 }`; sucesso faz refetch.

## Backend e banco

- Backend alterado: nao.
- Banco alterado: nao.
- Migration criada: nao.

## Remocao do Atualizar

- Botao `Atualizar` removido da toolbar de Clinicas.
- Props `onRefresh` e `refreshing` removidas de `ClinicsToolbarContent`.
- Refetch interno mantido em `useAdminClinics` para carregamento, busca e mutacoes reais.

## Proximas acoes

- Suspender.
- Demo.
- Mensal.
- Anual.
- Super Admin.
- Novo usuario.
- Excluir.

## Git

- Sem commit.
- Sem push.
