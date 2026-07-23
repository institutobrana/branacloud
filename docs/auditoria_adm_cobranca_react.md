# Auditoria ADM Cobranca React

Data: 2026-07-22

## 1. Objetivo

Esta auditoria inicia a frente `ADM -> Cobranca` no frontend React do Brana Cloude.

Esta rodada e exclusivamente documental e tecnica. Nao foram implementados tela, rota, endpoint, migration, menu, modal ou acao de escrita.

## 2. Significado de Cobranca no codigo atual

No Brana Cloude atual, `Cobrança` no contexto do Painel ADM significa a observabilidade administrativa dos registros financeiros de plataforma, especialmente checkouts e pagamentos de licenca/plano.

Nao se confunde com:

- financeiro operacional da clinica;
- conta corrente;
- fluxo de caixa;
- plano de contas;
- formas de cobranca de procedimentos;
- convenio/plano odontologico;
- faturamento clinico de pacientes.

## 3. Fontes auditadas

- `frontend/index.html`;
- `frontend/app.js`;
- `backend/routes/superadmin_routes.py`;
- `backend/routes/licenca_routes.py`;
- `backend/models/plataforma.py`;
- `backend/models/assinatura.py`;
- `backend/models/plano.py`;
- `backend/models/clinica.py`;
- `backend/services/platform_admin_service.py`;
- `frontend-react/src/features/admin/billing/BillingPage.jsx`;
- `frontend-react/src/features/admin/adminNavigation.js`;
- `docs/matriz_paridade_painel_adm_legado_react.md`;
- `docs/plano_migracao_funcional_painel_adm_react.md`;
- `docs/04_funcionalidades.md`;
- `docs/07_fluxos.md`;
- `docs/11_roadmap_desenvolvimento.md`.

## 4. Legado ADM

O Painel ADM legado renderiza uma tabela de cobrancas dentro do `superadmin-panel`.

HTML legado:

- tabela com `tbody id="sa-cobrancas-tbody"`;
- colunas visuais: `ID`, `Clínica`, `Plano`, `Status`, `Valor`, `Origem`, `Data`.

JavaScript legado:

- `saRenderCobrancas(lista)`;
- `saCarregarCobrancas()`;
- endpoint: `GET /superadmin/cobrancas?limit=80`;
- atualizacao integrada em `saRecarregarTudo()`.

O legado nao oferece acoes de escrita na tabela de cobrancas. Nao ha botao de confirmar pagamento, cancelar cobranca, gerar boleto, abrir checkout, sincronizar Mercado Pago ou editar valor dentro dessa tabela.

## 5. Backend ADM existente

Endpoint principal:

- `GET /superadmin/cobrancas`;
- arquivo: `backend/routes/superadmin_routes.py`;
- permissao: `_require_superadmin(current_user)`;
- parametros: `status` opcional e `limit` entre 1 e 1000;
- ordenacao: `criado_em desc`, `id desc`;
- tabela: `plataforma_cobrancas`;
- retorno: lista read-only.

Campos retornados:

- `id`;
- `clinica_id`;
- `clinica_nome`;
- `payment_id`;
- `external_reference`;
- `plano`;
- `status`;
- `valor`;
- `moeda`;
- `origem`;
- `criado_em`;
- `atualizado_em`.

Endpoint complementar:

- `GET /superadmin/assinaturas`;
- tabela: `plataforma_assinaturas`;
- permissao: `_require_superadmin(current_user)`;
- retorno: plano/status/vigencia/proxima cobranca por clinica.

Esse endpoint nao aparece renderizado no legado de cobrancas, mas existe como dado administrativo de plataforma e pode compor uma fase posterior ou painel complementar.

## 6. Tabelas e modelos

Modelo `PlataformaCobranca`:

- tabela: `plataforma_cobrancas`;
- campos principais: `clinica_id`, `payment_id`, `external_reference`, `plano`, `status`, `valor`, `moeda`, `origem`, `payload_json`, `criado_em`, `atualizado_em`.

Modelo `PlataformaAssinatura`:

- tabela: `plataforma_assinaturas`;
- campos principais: `clinica_id`, `plano`, `status`, `inicio_em`, `fim_em`, `proxima_cobranca_em`, `bloqueada`, `atualizado_em`.

Modelo historico `Assinatura`:

- tabela: `assinaturas`;
- campos simples: `clinica_id`, `plano_id`, `status`, `trial_ate`, `vencimento`, `ativo`.

Para o painel ADM React, a fonte mais aderente ao legado e `PlataformaCobranca` via `/superadmin/cobrancas`.

## 7. Origem dos dados

Os registros de `plataforma_cobrancas` sao criados/atualizados por:

- `registrar_checkout_cobranca`;
- `registrar_pagamento_cobranca`;
- fluxo `/licenca/checkout`;
- fluxo `/licenca/confirmar`;
- fluxo `/licenca/sincronizar`;
- webhook `/licenca/mercadopago/webhook`.

Os registros de `plataforma_assinaturas` sao sincronizados por:

- `sync_assinatura_from_clinica`;
- alteracoes administrativas de plano/trial/status em `ADM -> Clinicas`;
- fluxos de licenca/pagamento.

## 8. Regras financeiras existentes

Planos de plataforma:

- `DEMO`: 7 dias;
- `MENSAL`: 30 dias;
- `ANUAL`: 365 dias;
- `SUPERADMIN`: 365 dias no contrato atual de plano administrativo.

Valores usados por licenca:

- mensal: variavel `PLANO_MENSAL_VALOR`, padrao `149.90`;
- anual: variavel `PLANO_ANUAL_VALOR`, padrao `1499.00`.

Indicadores do overview:

- `mrr_estimado` usa valores fixos `149.90` e `1499.00 / 12`;
- `arr_estimado` usa `mensal * 149.90 * 12 + anual * 1499.00`;
- `cobrancas_aprovadas_hoje` conta registros de `PlataformaCobranca.status == "approved"` criados no dia.

Observacao: os indicadores do overview sao estimativas por plano atual da clinica, nao uma soma contabil de recebimentos confirmados.

## 9. Licenca e Mercado Pago

O dominio de licenca fica em `backend/routes/licenca_routes.py`.

Rotas existentes:

- `GET /licenca/info`;
- `POST /licenca/checkout`;
- `POST /licenca/confirmar`;
- `POST /licenca/sincronizar`;
- `POST/GET /licenca/mercadopago/webhook`.

Essas rotas podem criar checkout, consultar Mercado Pago, aplicar pagamento aprovado e alterar dados de clinica/licenca. Portanto, nao devem entrar na primeira fase de `ADM -> Cobranca`.

## 10. Contrato funcional proposto

Primeira fase segura de `ADM -> Cobranca`:

- habilitar rota React `/app/adm/cobrancas`;
- exibir listagem read-only de `/superadmin/cobrancas`;
- usar tabela compacta no padrao ADM React;
- exibir as mesmas 7 colunas do legado como base;
- permitir filtro por coluna no frontend;
- permitir ordenacao por coluna;
- preservar controle de colunas visiveis;
- exibir rodape de contagem;
- ter botao `Atualizar`;
- opcionalmente incluir filtro textual por status se houver contrato visual;
- nao criar acao mutavel;
- nao chamar rotas de licenca;
- nao abrir checkout;
- nao sincronizar Mercado Pago;
- nao confirmar pagamento;
- nao expor `payload_json` bruto na tabela principal.

Colunas iniciais recomendadas:

- `ID`;
- `Clínica`;
- `Plano`;
- `Status`;
- `Valor`;
- `Origem`;
- `Data`.

Campos tecnicos que podem ficar ocultos ou em detalhe futuro:

- `clinica_id`;
- `payment_id`;
- `external_reference`;
- `moeda`;
- `atualizado_em`.

## 11. Fora do escopo inicial

Nao implementar na primeira fase:

- checkout;
- Pix;
- boleto;
- cartao;
- baixa manual;
- cancelamento;
- reembolso;
- conciliacao;
- edicao de valor;
- webhooks;
- chamada direta ao Mercado Pago;
- criacao de cobranca;
- exportacao financeira;
- dashboard financeiro completo;
- assinatura detalhada;
- modal de payload bruto.

## 12. Riscos

- Dados financeiros podem conter identificadores externos como `payment_id` e `external_reference`.
- `payload_json` pode conter retorno bruto do provedor e nao deve ser exibido sem contrato especifico.
- `status` vem do Mercado Pago ou do fluxo de checkout e nao deve ser reinterpretado livremente no frontend.
- `assinaturas` e `cobrancas` representam visoes diferentes: assinatura e estado derivado; cobranca e evento/registro financeiro.
- Overview usa estimativas por plano, nao soma de pagamentos.
- A tabela legado lista somente as ultimas 80 cobrancas; o backend permite `limit` ate 1000.

## 13. Recomendacao de implementacao futura

Fase 1 recomendada:

1. Criar service `adminBillingApi` consumindo apenas `GET /superadmin/cobrancas`.
2. Criar hook `useAdminBilling`.
3. Criar normalizer/formatters para valor, data, status e fallback de clinica.
4. Criar `BillingTable` read-only com as 7 colunas do legado.
5. Habilitar `ADM -> Cobranças` no submenu.
6. Usar toolbar global com `Atualizar` e, se confirmado, busca/filtro textual.
7. Cobrir com testes estruturais que nao ha POST/PUT/PATCH/DELETE, checkout, sincronizacao ou webhook.

Fase posterior:

- avaliar se `GET /superadmin/assinaturas` deve aparecer como segunda tabela, aba ou detalhe de clinica;
- avaliar exportacao CSV;
- avaliar filtro backend por status;
- avaliar paginação se o volume real superar o limite de 1000.

## 14. Decisao desta rodada

A frente `ADM -> Cobranca` esta contratada para iniciar por leitura de cobrancas de plataforma.

## 15. Implementacao Fase 1 - leitura React

Data: 2026-07-22

A primeira fase funcional de `ADM -> Cobrancas` foi implementada no frontend React sem alteracao de backend, banco, migration ou endpoint.

Escopo entregue:

- rota interna `/app/adm/cobrancas` reaproveitada no shell global ADM;
- item `Cobrancas` habilitado no submenu ADM;
- guard ADM preservado via `AdminRoutes` e `useAdminAccess`;
- toolbar global em L com apenas `Atualizar` e `Buscar cobranca`;
- service `adminBillingApi` consumindo somente `GET /superadmin/cobrancas`;
- normalizer especifico para os campos retornados por `PlataformaCobranca`;
- tabela compacta read-only com as colunas do legado: `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem`, `Data`;
- selecao unica por radio;
- filtros por coluna;
- ordenacao por coluna, incluindo data e valor;
- controle de colunas visiveis;
- rodape de contagem e selecao;
- estados de loading, vazio, erro total e alerta de erro em refresh;
- busca textual local no frontend, sem enviar `q` para o backend.

Fora do escopo preservado:

- modal de detalhes;
- exportacao CSV;
- `Ver conta`;
- cards financeiros;
- checkout, Pix, boleto, cartao;
- confirmacao manual de pagamento;
- sincronizacao Mercado Pago;
- webhook;
- cancelamento;
- reembolso;
- qualquer acao mutavel financeira.

Arquivos principais:

- `frontend-react/src/features/admin/billing/BillingPage.jsx`;
- `frontend-react/src/features/admin/billing/services/adminBillingApi.js`;
- `frontend-react/src/features/admin/billing/hooks/useAdminBilling.js`;
- `frontend-react/src/features/admin/billing/hooks/useAdminBillingTableState.js`;
- `frontend-react/src/features/admin/billing/normalizers/adminBillingNormalizer.js`;
- `frontend-react/src/features/admin/billing/constants/adminBillingColumns.js`;
- `frontend-react/src/features/admin/billing/components/BillingTable.jsx`;
- `frontend-react/src/features/admin/billing/components/BillingToolbarContent.jsx`;
- `frontend-react/src/features/admin/adminNavigation.js`;
- `frontend-react/src/features/admin/admin.css`;
- `frontend-react/tests/adminBilling.test.js`.

Validacao automatizada adicionada:

- contrato do endpoint real e autenticado;
- ausencia de `q` no contrato backend;
- ausencia de metodos `POST`, `PUT`, `PATCH` e `DELETE`;
- ausencia de chamadas de licenca, assinatura, Mercado Pago e payload bruto;
- menu/rota disponiveis no shell global;
- toolbar restrita a `Atualizar` e `Buscar cobranca`;
- normalizacao, formatacao, filtros, ordenacao, visibilidade de colunas e rodape.

## 16. Correcao runtime visual - estado vazio e Unicode

Data: 2026-07-22

O runtime manual apontou duas regresssoes visuais na Fase 1:

- endpoint sem registros fazia a tabela desaparecer;
- strings acentuadas apareciam escapadas como `cobran\u00e7a`.

Causa:

- `BillingPage` condicionava a renderizacao de `BillingTable` a `billing.rows.length`;
- quando a lista vinha vazia, a pagina renderizava um estado vazio externo e nao a grade;
- alguns textos tinham sido escritos como escapes Unicode literais em JSX.

Ajuste:

- a tabela agora permanece renderizada quando nao ha erro total;
- `locale.emptyText` mostra o vazio dentro do corpo da tabela;
- `Nenhuma cobrança encontrada.` representa zero registros reais;
- `Nenhuma cobrança corresponde aos filtros aplicados.` representa zero resultados por busca/filtro;
- cabecalhos, filtros, ordenacao, selecao, controle de colunas e rodape permanecem visiveis;
- textos visiveis foram corrigidos para UTF-8 real.

Validacao runtime nesta sessao:

- o Browser Use abriu `/app/adm/cobrancas`, mas sem sessao autenticada a aplicacao redirecionou para `/app/login`;
- a validacao visual autenticada ficou pendente porque a ferramenta bloqueou preparacao de sessao via URL `javascript:`;
- testes automatizados, build e diff-check devem ser usados como validacao tecnica ate nova validacao manual autenticada.

Nao houve alteracao de backend, banco, migration, endpoint, menu, rota, tela, modal, dado fake, commit, push ou AWS nesta rodada.

## 17. Auditoria curta - dados vazios e proximas funcoes read-only

Data: 2026-07-22

### Git inicial

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch: `modularizacao-segura-fase-1`.
- Remote: `https://github.com/institutobrana/branacloud.git`.
- HEAD: `95cc1cf7a60e085ec9574c5584f120abdc312069`.
- Ahead/behind: `0 0`.
- Stage inicial: vazio.
- Worktree: sujo, com alteracoes preexistentes de varias frentes e muitos arquivos untracked.

### Endpoint auditado

- Arquivo: `backend/routes/superadmin_routes.py`.
- Funcao: `superadmin_list_cobrancas`.
- Metodo/rota: `GET /superadmin/cobrancas`.
- Autenticacao: `get_current_user`.
- Autorizacao: `_require_superadmin(current_user)`.
- Parametro `status`: opcional, `max_length=40`; quando presente aplica igualdade case-insensitive sobre `PlataformaCobranca.status`.
- Parametro `limit`: default `200`, minimo `1`, maximo `1000`.
- Tabela principal consultada: `plataforma_cobrancas`, model `PlataformaCobranca`.
- Joins: nenhum join SQL. A rota carrega `Clinica.id`/`Clinica.nome` separadamente para preencher `clinica_nome`.
- Ordenacao: `criado_em desc`, `id desc`.
- Resposta: lista JSON, sem envelope e sem campo `total`.
- Lista vazia: retorna HTTP 200 com `[]`.
- Erro esperado sem sessao/permissao: 401/403 antes da query.

Shape de cada item:

```json
{
  "id": 0,
  "clinica_id": 0,
  "clinica_nome": "Nome da clinica",
  "payment_id": null,
  "external_reference": null,
  "plano": null,
  "status": "checkout_open",
  "valor": 0.0,
  "moeda": "BRL",
  "origem": "checkout",
  "criado_em": "ISO datetime",
  "atualizado_em": "ISO datetime"
}
```

### Runtime local do endpoint

Validacao local com token temporario de usuario MASTER/Owner gerado a partir do banco local, sem expor token:

- Request: `GET http://localhost:8000/superadmin/cobrancas?limit=80`.
- Status: `200 OK`.
- Content-Type: `application/json; charset=utf-8`.
- Tempo observado: aproximadamente `2161.58 ms`.
- Corpo: `[]`.
- Tipo do payload: array.
- Quantidade de registros: `0`.
- Campo `total`: ausente.
- Erro: ausente.
- `clinica_id`: nao aparece porque nao ha itens; o campo existe no shape quando houver registros.
- Content-Length: `2`.
- Server: `uvicorn`.

### Banco local auditado

Conexao observada:

- Banco: `brana_saas`.
- Usuario: `postgres`.
- Host: `::1/128`.
- Porta: `5432`.

Contagens:

- `plataforma_cobrancas`: `0`.
- `plataforma_assinaturas`: `8`.
- `assinaturas`: `0`.
- `clinicas`: `8`.

Conclusao: o painel esta vazio porque a tabela principal de cobrancas esta vazia no banco local. Existem dados de assinatura em `plataforma_assinaturas`, mas eles representam estado derivado de plano/licenca, nao eventos de cobranca.

### Estrutura real de `plataforma_cobrancas`

| Campo | Tipo | Nullable | Default | FK | Uso |
|---|---|---:|---|---|---|
| `id` | integer | nao | sequence `plataforma_cobrancas_id_seq` | PK | identificador da cobranca |
| `clinica_id` | integer | nao | nenhum | `clinicas.id` | vinculo para Ver conta |
| `payment_id` | varchar | sim | nenhum | nao | id do pagamento/gateway; unico/indexado |
| `external_reference` | varchar | sim | nenhum | nao | referencia `BRANA|clinica|plano|timestamp`; indexada |
| `plano` | varchar | sim | nenhum | nao | plano cobrado (`MENSAL`, `ANUAL`, etc.) |
| `status` | varchar | nao | model define `checkout_open`; schema local sem default SQL | nao | status financeiro/checkpoint |
| `valor` | double precision | sim | nenhum | nao | valor da cobranca |
| `moeda` | varchar | sim | model define `BRL`; schema local sem default SQL | nao | moeda |
| `origem` | varchar | nao | model define `checkout`; schema local sem default SQL | nao | origem do registro |
| `payload_json` | text | sim | nenhum | nao | payload bruto do gateway; nao expor na tabela principal |
| `criado_em` | timestamptz | sim | `now()` | nao | data de criacao/listagem |
| `atualizado_em` | timestamptz | sim | `now()` | nao | data de atualizacao/detalhe futuro |

Indices/constraints:

- PK `plataforma_cobrancas_pkey` em `id`;
- FK `plataforma_cobrancas_clinica_id_fkey` para `clinicas.id`;
- index em `clinica_id`;
- unique index em `payment_id`;
- index em `external_reference`;
- index em `id`;
- checks not-null gerados para `id`, `clinica_id`, `status`, `origem`.

### Fluxos que alimentam a tabela

Arquivos:

- `backend/services/platform_admin_service.py`;
- `backend/routes/licenca_routes.py`.

Funcoes de gravacao:

- `registrar_checkout_cobranca`: cria linha com `status="checkout_open"`, `payment_id=None`, `external_reference`, `plano`, `valor`, `moeda="BRL"` e `origem`.
- `registrar_pagamento_cobranca`: procura por `payment_id` ou `external_reference`; se nao encontrar, cria linha; atualiza `clinica_id`, `payment_id`, `external_reference`, `plano`, `status`, `valor`, `moeda`, `origem` e `payload_json`.

Rotas que chamam esses fluxos:

- `POST /licenca/checkout`: cria cobranca tanto no modo fallback quanto no modo Mercado Pago, antes de retornar URL de checkout.
- `POST /licenca/confirmar`: chama `_processar_pagamento`, consulta Mercado Pago por `payment_id` e registra pagamento.
- `POST /licenca/sincronizar`: busca pagamento aprovado e chama `_processar_pagamento`.
- `POST/GET /licenca/mercadopago/webhook`: extrai `payment_id` e chama `_processar_pagamento`.

Conclusao funcional: a tabela e alimentada automaticamente por fluxos de licenca/checkout/pagamento quando eles sao executados. Nao ha seed ou alimentacao manual padrao detectada. Como nenhum desses fluxos foi executado com sucesso no banco local atual, `plataforma_cobrancas` permanece vazia.

### Outras tabelas financeiras relevantes

- `plataforma_assinaturas`: possui 8 registros e pode alimentar uma visao complementar read-only de assinaturas/estado de plano.
- `assinaturas`: possui 0 registros no banco local atual.
- `clinicas`: possui os campos de plano/licenca usados para derivar assinaturas e status, mas nao e tabela de evento financeiro.

### Campos para proximas funcoes read-only

`Ver conta`:

- Pode usar `clinica_id` quando houver registros de cobranca.
- Como a lista vazia nao possui itens, a acao deve depender de selecao valida.

`Ver detalhes`:

- Campos seguros para detalhe: `id`, `clinica_id`, `clinica_nome`, `payment_id`, `external_reference`, `plano`, `status`, `valor`, `moeda`, `origem`, `criado_em`, `atualizado_em`.
- `payload_json` existe no banco, mas nao e retornado por `GET /superadmin/cobrancas`; se um detalhe futuro precisar dele, exige contrato especifico e cuidado por conter payload bruto do gateway.

`Exportar CSV`:

- Pode ser implementado no frontend usando o GET atual, exportando as colunas ja retornadas.
- Limite atual do endpoint permite ate `1000`; para volumes maiores, seria melhor contrato especifico de exportacao/paginacao.
- Nao exige backend novo para uma primeira exportacao simples dos dados carregados/consultados.

### Proxima funcionalidade segura recomendada

A proxima etapa mais segura e `Ver conta`, porque:

- usa `clinica_id` ja retornado pelo endpoint;
- segue o padrao read-only ja aplicado em `ADM -> Usuarios`;
- nao exige endpoint novo;
- nao altera dados financeiros;
- fica naturalmente desabilitada quando nao houver cobranca selecionada.

Segunda opcao segura: `Exportar CSV` client-side dos dados carregados por `GET /superadmin/cobrancas`. `Ver detalhes` deve vir depois, porque pode gerar pressao para expor `payload_json`, que requer contrato adicional.

### Respostas objetivas

1. O endpoint retorna lista vazia, nao erro, no banco local atual.
2. Nao existem registros em `plataforma_cobrancas` localmente.
3. Os fluxos que criam registros sao checkout, confirmacao, sincronizacao e webhook de licenca.
4. A tabela e alimentada automaticamente por esses fluxos, nao por seed/manual padrao.
5. Existem dados financeiros/contratuais em `plataforma_assinaturas`, mas nao sao cobrancas.
6. Campos reais disponiveis: os 12 campos da tabela listados acima; a API retorna todos exceto `payload_json`.
7. `clinica_id` esta disponivel para `Ver conta` quando houver item.
8. `Ver detalhes` pode usar os campos retornados pela API; `payload_json` fica fora sem novo contrato.
9. `Exportar CSV` pode ser implementado com o GET atual para ate 1000 registros/consulta simples.
10. Proxima funcionalidade segura recomendada: `Ver conta`.

## 18. Implementacao incremental - Ver detalhes

Data: 2026-07-22

`ADM -> Cobrancas -> Ver detalhes` foi implementado em modo somente leitura.

- Fonte dos dados: linha selecionada ja carregada por `GET /superadmin/cobrancas`.
- Request adicional: nenhuma.
- Modal: `Detalhes da cobranca`, largura `800px`, altura natural e `max-height: calc(100vh - 24px)`.
- Blocos: `Identificacao`, `Conta`, `Pagamento`, `Datas`.
- `payload_json`: permanece fora do modal.
- Acoes mutaveis: nenhuma.
- Documento especifico: `docs/implementacao_adm_cobrancas_ver_detalhes.md`.
