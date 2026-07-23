# Implementacao ADM Cobrancas - Fase 1 leitura

Data: 2026-07-22

## Escopo

Primeira fase funcional de `ADM -> Cobrancas` no frontend React do Brana Cloude.

A entrega e exclusivamente read-only e usa apenas o endpoint existente `GET /superadmin/cobrancas`.

## Entregue

- rota `/app/adm/cobrancas`;
- item `Cobrancas` habilitado no menu ADM;
- shell global em L preservado;
- guard administrativo preservado;
- toolbar com `Atualizar` e `Buscar cobranca`;
- listagem real de cobrancas de plataforma;
- tabela compacta com selecao unica;
- filtros por coluna;
- ordenacao;
- controle de colunas visiveis;
- rodape;
- refresh manual;
- busca textual local;
- estados de carregamento, vazio e erro;
- testes contratuais em `frontend-react/tests/adminBilling.test.js`.

## Colunas

- `ID`;
- `Clinica`;
- `Plano`;
- `Status`;
- `Valor`;
- `Origem`;
- `Data`.

## Fora do escopo

- modal de detalhes;
- exportar CSV;
- `Ver conta`;
- cards financeiros;
- checkout;
- Pix;
- boleto;
- confirmacao de pagamento;
- sincronizacao Mercado Pago;
- webhook;
- cancelamento;
- reembolso;
- qualquer mutacao financeira.

## Observacoes tecnicas

- A busca `Buscar cobranca` e local no frontend, porque `GET /superadmin/cobrancas` nao contrata parametro `q`.
- O service envia apenas `status` opcional e `limit`.
- A tabela nao expoe `payload_json`.
- `GET /superadmin/assinaturas` permanece como dado complementar para fase futura, nao usado nesta etapa.

## Correcao runtime visual - estado vazio e UTF-8

Data: 2026-07-22

Falha encontrada em runtime:

- quando `GET /superadmin/cobrancas` retornava zero registros, `BillingPage` substituia a tabela por um estado vazio externo;
- os cabecalhos `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data` desapareciam;
- o rodape tambem desaparecia;
- textos com acento foram salvos em JSX como escapes literais, fazendo o browser exibir `cobran\u00e7a` em vez de `cobrança`.

Correcao aplicada:

- `BillingTable` passa a renderizar mesmo com `rows=[]`;
- o estado vazio usa `locale.emptyText` do Ant Design, dentro do corpo da tabela;
- vazio real do endpoint mostra `Nenhuma cobrança encontrada.`;
- vazio apos busca/filtro mostra `Nenhuma cobrança corresponde aos filtros aplicados.`;
- rodape permanece visivel com `0 cobrança(s)` ou `0 de N cobrança(s)`;
- textos visiveis da frente Billing foram corrigidos para UTF-8 real.

Escopo preservado:

- backend, endpoint, banco, migration, rota, menu, toolbar, busca, selecao, filtros, ordenacao, controle de colunas, tema, shell, AWS, commit e push nao foram alterados nesta correcao.

Validacao runtime:

- a rota local abriu no navegador sem sessao e redirecionou para `/app/login`;
- a sessao MASTER/Owner nao estava disponivel na superficie controlavel do Browser Use;
- a politica do Browser Use bloqueou tentativa de usar URL `javascript:` para preparar sessao local de teste;
- a validacao visual autenticada deve ser repetida manualmente ou com o navegador ja autenticado.

## Auditoria complementar - dados vazios e proximas funcoes

Data: 2026-07-22

Foi realizada auditoria curta, somente leitura, para explicar o estado vazio validado em runtime.

Resultado:

- `GET /superadmin/cobrancas?limit=80` retorna HTTP 200 com array vazio (`[]`) no banco local atual.
- A tabela `plataforma_cobrancas` possui 0 registros localmente.
- A tabela `plataforma_assinaturas` possui registros, mas representa estado derivado de plano/licenca, nao evento de cobranca.
- As cobrancas sao alimentadas automaticamente pelos fluxos de licenca/checkout/pagamento em `backend/routes/licenca_routes.py` e `backend/services/platform_admin_service.py`.
- Nao foi encontrado seed ou fluxo manual padrao para popular `plataforma_cobrancas`.
- `clinica_id` faz parte do contrato retornado por `GET /superadmin/cobrancas` quando houver itens e pode alimentar uma acao read-only `Ver conta`.
- `Ver detalhes` pode usar os campos ja retornados pela API; `payload_json` existe no banco, mas nao e retornado e exige contrato especifico antes de qualquer exposicao.
- `Exportar CSV` pode ser implementado inicialmente no frontend com os dados retornados pelo GET atual, respeitando o limite do endpoint.

Proxima funcionalidade segura recomendada: `Ver conta`, por usar `clinica_id` ja existente no contrato, sem endpoint novo e sem mutacao financeira.

## Implementacao incremental - Ver conta

Data: 2026-07-22

Foi adicionada a acao read-only `Ver conta` na toolbar de `ADM -> Cobrancas`.

Escopo entregue:

- toolbar final da etapa: `Atualizar`, `Ver conta`, `Buscar cobranca`;
- o botao `Ver conta` fica desabilitado quando nao ha cobranca selecionada;
- o botao tambem fica desabilitado quando a cobranca selecionada nao possui `clinica_id` valido ou durante refresh;
- ao clicar, a tela navega para `ADM -> Clinicas` via `onAdminNavigate('adm-clinicas', { selectedClinicId })`;
- `ClinicsPage` reaproveita o fluxo existente de selecao por `selectedClinicId`;
- nenhuma informacao financeira, clinica, assinatura ou pagamento e alterada.

Fora do escopo preservado:

- exportar CSV;
- ver detalhes;
- registrar pagamento;
- alterar plano;
- suspender/ativar;
- checkout;
- webhook;
- backend;
- banco;
- migration;
- AWS;
- commit;
- push.

## Implementacao incremental - Exportar CSV

Data: 2026-07-22

Foi adicionada a acao read-only `Exportar CSV` na toolbar de `ADM -> Cobrancas`.

Escopo entregue:

- toolbar final da etapa: `Atualizar`, `Exportar CSV`, `Ver conta`, `Buscar cobranca`;
- o CSV e gerado exclusivamente a partir das linhas ja carregadas e visiveis no frontend;
- nao ha nova requisicao HTTP para exportar;
- nao ha endpoint novo;
- o arquivo usa separador `;` e BOM UTF-8 para compatibilidade com planilhas;
- o botao usa a classe visual `auxiliary-shell-button`, integrado a mesma faixa da toolbar.

Campos exportados:

- `ID`;
- `Clinica`;
- `Plano`;
- `Status`;
- `Valor`;
- `Origem`;
- `Data`;
- `Clinica ID`;
- `Payment ID`;
- `External Reference`;
- `Moeda`;
- `Atualizado em`.

Fora do escopo preservado:

- ver detalhes;
- nova cobranca;
- registrar pagamento;
- baixa manual;
- alterar status;
- alterar valor;
- checkout;
- Pix;
- boleto;
- sincronizacao Mercado Pago;
- webhook;
- assinaturas;
- cards financeiros;
- filtros avancados;
- backend;
- banco;
- migration;
- seed;
- AWS;
- commit;
- push.

## Implementacao incremental - Ver detalhes

Data: 2026-07-22

Foi adicionada a acao read-only `Ver detalhes` na toolbar de `ADM -> Cobrancas`.

Escopo entregue:

- toolbar final da etapa: `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Ver conta`, `Buscar cobranca`;
- modal `Detalhes da cobranca` somente leitura;
- dados vindos exclusivamente da linha ja carregada e normalizada;
- nenhuma request adicional ao abrir o modal;
- fechamento automatico do modal em refresh ou quando a selecao deixa de existir;
- `payload_json` fora do modal e fora do contrato visual.

Documento especifico:

- `docs/implementacao_adm_cobrancas_ver_detalhes.md`.
