# Fechamento CP7 — Cadastro / Convênios e planos React

Status documental: funcionalmente encerrado; fechamento GitHub pendente.

## Escopo e rota

- Módulo: `Cadastro → Convênios e planos`.
- Rota canônica: `/app/cadastro/convenios-planos`.
- Tela React: `frontend-react/src/features/conveniosPlanos/ConveniosPlanosPage.jsx`.
- Permissão: `require_module_access("configuracao")`.
- Escopo de dados: `current_user.clinica_id` em todas as operações do router.

## Convênio

O cadastro possui seleção, Novo, Altera, duplo clique para edição, Elimina,
Principal, Detalhes, CEP, lookups de campos, telefones, calendário e relação
master-detail com planos.

Campos do contrato: `codigo`, `nome`, `razao_social`, `codigo_ans`,
`tipo_logradouro`, `endereco`, `numero`, `complemento`, `bairro`, `cidade`,
`cep`, `uf`, `tipo_fone1..4`, `telefone`, `telefone2`, `telefone3`,
`telefone4`, `contato1..4`, `data_inclusao`, `data_alteracao`, `email`,
`email_tecnico`, `homepage`, `cnpj`, `inscricao_estadual`,
`inscricao_municipal`, `tipo_faturamento`, `observacoes` e `inativo`.

`tipo_logradouro` e `tipo_fone1..4` são índices históricos numéricos. Bairro
e cidade são texto. Inteiros opcionais vazios são normalizados para `null`.
`tipo_faturamento` usa `1 = Parcial` e `2 = Total`. `source_id` é o
identificador legado/backend; `row_id` é a identidade React/backend.

O CEP reutiliza `GET /cadastros/cep/{digits}`, com normalização,
preenchimento de endereço/bairro/cidade/UF, preservação de número e
complemento e edição manual permitida.

## Plano

Planos são listados pelo convênio selecionado e vinculados por
`convenio_row_id`. O contrato possui `codigo`, `nome`, `cobertura` e
`inativo`; `cobertura` é texto livre, sem percentual ou cálculo de preço
implícito. O plano possui Novo, Altera, duplo clique e Elimina.

## Calendário de faturamento

O calendário usa a tabela `calendario_faturamento_odonto` e o pai
`convenio_row_id`. Os campos são `data_fechamento` e `data_pagamento`, no
formato `dd/mm/aaaa`; múltiplas linhas são permitidas.

O contrato não comprova a regra `data_pagamento >= data_fechamento` nem
geração financeira automática. O modal abre pelo convênio selecionado, possui
combo interno com `value = row_id` e `label = nome`, recarrega as linhas ao
trocar o convênio e limpa seleção incompatível. Novo usa
`calendarConvenioRowId`; Altera, duplo clique e Elimina operam sobre
`row_id`; o fechamento é pelo X do modal, sem botão Fecha.

## Backend e endpoints

Router: `backend/routes/convenios_planos_routes.py`, prefixo
`/cadastros/convenios-planos`, protegido por `configuracao` e filtrado por
`current_user.clinica_id`.

- `GET /combos`
- `POST|PUT|DELETE /convenios[/{row_id}]`
- `POST|PUT|DELETE /planos[/{row_id}]`
- `GET|POST|PUT|DELETE /calendario-faturamento[/{row_id}]`

Modelos: `ConvenioOdonto`, `PlanoOdonto` e `CalendarioFaturamentoOdonto` em
`backend/models/convenio_odonto.py`.

## Diferenças React intencionais

- Ant Design em vez dos controles legados.
- Superfície visual React com tabs card e campos readonly cyan.
- WhatsApp verde nos telefones.
- CEP autofill reutilizado da Ficha Pessoal.
- Responsividade validada em 1440, 1024 e 768 px.
- Calendário fecha pelo X, sem botão Fecha.

## Estado de fechamento

- `CONVENIO = COMPLETE`
- `PLANO = COMPLETE`
- `CALENDARIO_FATURAMENTO = COMPLETE`
- `REACT_LEGACY_COMPARISON = PASS`
- `LIGHT_MODE = PASS`
- `DARK_MODE = PASS`
- `RESPONSIVE = PASS`
- `BUILD = PASS`
- `RUNTIME = STABLE`
- `GITHUB_CLOSE = PENDING`
