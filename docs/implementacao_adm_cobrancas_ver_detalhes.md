# Implementacao ADM Cobrancas - Ver detalhes

Data: 2026-07-22

## Contexto

`ADM -> Cobrancas` ja possui listagem read-only, busca, filtros, ordenacao, controle de colunas, rodape, refresh, `Ver conta` e `Exportar CSV`.

O banco local segue com `plataforma_cobrancas` vazia. Isso nao e erro da tela: `GET /superadmin/cobrancas?limit=80` retorna HTTP 200 com `[]` quando nao ha registros.

## Finalidade

Adicionar `Ver detalhes` para inspecionar a cobranca selecionada sem qualquer alteracao de dados.

## Somente leitura

O modal e estritamente read-only. Nao ha campos editaveis, confirmacao, baixa, reprocessamento, cancelamento, reembolso ou pagamento.

## Fonte dos dados

Os detalhes usam somente a linha ja carregada e normalizada pela listagem de `GET /superadmin/cobrancas`.

## Ausencia de request adicional

Nao foi criada chamada de detalhe. Ao abrir o modal, o frontend nao faz request novo.

## Estados do botao

- Desabilitado sem cobranca selecionada.
- Desabilitado durante loading inicial.
- Desabilitado durante refresh.
- Habilitado com cobranca valida selecionada.
- Nao depende de `clinica_id`.

## Toolbar

Ordem da toolbar:

`Atualizar | Exportar CSV | Ver detalhes | Ver conta | Buscar cobranca`

Todos os botoes usam `auxiliary-shell-button` e permanecem integrados a faixa global.

## Modal

- Titulo: `Detalhes da cobranca`.
- Largura: `800px`.
- Altura: natural.
- `max-height`: `calc(100vh - 24px)`.
- Footer: somente `Fechar`.
- Desktop: sem scroll vertical forcado.
- Viewport pequena: scroll vertical interno.

## Blocos

- `Identificacao`: ID, Status, Origem.
- `Conta`: Clinica, ID da clinica, Plano.
- `Pagamento`: Payment ID, Referencia externa, Valor, Moeda.
- `Datas`: Data de criacao, Data de alteracao.

## Grade

O modal usa grid proprio com seis trilhas:

`Rotulo | Valor | Rotulo | Valor | Rotulo | Valor`

Em telas pequenas, a grade empilha para um par por linha.

## Campos

Os campos exibidos sao:

- `id`;
- `clinica_nome`;
- `clinica_id`;
- `plano`;
- `status`;
- `origem`;
- `payment_id`;
- `external_reference`;
- `valor`;
- `moeda`;
- `criado_em`;
- `atualizado_em`.

## Nulls

Valores ausentes usam a convencao unica:

`Nao disponivel`

## Ellipsis e tooltips

Ellipsis com tooltip foi aplicado a campos potencialmente longos:

- Clinica;
- Status;
- Origem;
- Payment ID;
- Referencia externa.

## Protecao de dados

Nao sao exibidos:

- `payload_json`;
- token;
- segredo;
- credencial;
- dados completos de cartao;
- resposta bruta do gateway;
- stack trace;
- objeto JSON integral.

## Responsividade

Desktop usa grid de seis trilhas. Em `max-width: 760px`, o modal usa largura `calc(100vw - 16px)`, scroll vertical interno e grid de duas trilhas.

## Tema

O CSS usa tokens existentes:

- `--brana-border-subtle`;
- `--brana-surface-card`;
- `--brana-surface-muted`;
- `--brana-text-secondary`;
- `--brana-text-primary`.

## Acessibilidade

- Modal possui titulo.
- Botao `Fechar` acessivel.
- Escape fecha via comportamento padrao do Ant Design.
- Tooltips preservam valor completo.
- Valores nao dependem apenas de cor.
- Conteudo e apresentado como leitura.

## Refresh com modal aberto

Ao iniciar refresh, o modal fecha para evitar snapshot possivelmente obsoleto.

Se a selecao desaparecer por filtro, busca ou refresh, o modal tambem fecha.

## Testes

Criado:

- `frontend-react/tests/adminBillingDetails.test.js`.

Atualizado:

- `frontend-react/tests/adminBilling.test.js`.

## Build

`npm.cmd run build` executado com sucesso. O Vite manteve apenas o aviso de chunk acima de 500 kB.

## Runtime

Servicos locais responderam:

- frontend `/app/adm/cobrancas`: HTTP 200;
- backend `/health`: HTTP 200.

Como `plataforma_cobrancas` esta vazia no banco local, nao foi possivel abrir modal com cobranca real sem criar dados artificiais.

## Ausencia de mutacoes

Nao houve:

- backend;
- banco;
- migration;
- seed;
- dados fake;
- endpoint novo;
- request adicional;
- AWS;
- commit;
- push.
