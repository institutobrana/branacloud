# Fechamento H.CLOSE.1 - Historico do paciente

Data do fechamento: 2026-08-26
Baseline: Ficha Pessoal -> Historico

## Estado homologado

A aba Historico possui toolbar com `Inserir linha`, `Edita linha`, `Elimina linha` e `Propriedades da linha...`, e grade com `Data`, `Cirurgiao`, `Regiao` e `Descricao do procedimento`. A ordenacao por Data e o estado vazio estrutural permanecem funcionais.

Insercao e edicao inline usam data vigente, prestador resolvido por `current_user.prestador_id` e apelido real de `PrestadorOdonto`. Cirurgiao e somente leitura inline; Regiao e texto livre; Descricao e obrigatoria; Enter persiste; ESC cancela sem fechar a Ficha.

O modal `Propriedades do historico` permanece visualmente congelado. Ele usa DateField oficial, primeira linha horizontal alinhada, auditoria readonly/ciano, selecao de Cirurgiao, Regiao livre, Historico editavel, Ok persistente e Cancela sem persistencia. A paleta atual reutiliza `AGENDA_APRESENTACAO_COLORS` e `AgendaColorDropdown`, com 18 cores e Branco `16777215`.

## Backend homologado

Arquitetura: model -> schema -> service -> routes. As rotas existentes sao:

- `GET /cadastros/pacientes/{paciente_id}/historico`
- `GET /cadastros/pacientes/{paciente_id}/historico/{item_id}`
- `POST /cadastros/pacientes/{paciente_id}/historico`
- `PATCH /cadastros/pacientes/{paciente_id}/historico/{item_id}`
- `PUT /cadastros/pacientes/{paciente_id}/historico/{item_id}/propriedades`
- `DELETE /cadastros/pacientes/{paciente_id}/historico/{item_id}`

O contrato usa PK interna do paciente, isolamento por clinica, prestador vinculado ao usuario, `source_id`, `source_intervencao_id` nullable, descricao obrigatoria, cor INTEGER, delete fisico e unicidade `clinica_id/source_id`.

## Regressao corrigida

O fluxo `Propriedades -> Ok -> Elimina -> Sim -> DELETE -> refetch` chegou a desmontar a Ficha porque o modal recebeu `item === undefined` e acessou `item.criado_em`. A correcao homologada fecha o estado de Propriedades antes da conclusao do Delete/refetch e impede o render do formulario quando `open`, `item` ou `draft` nao sao validos. Nao reintroduzir essa referencia insegura.

Durante o diagnostico houve tambem um `ReferenceError` causado por trace que usava `selected` antes da declaracao. A declaracao foi reposicionada e os traces temporarios `[HIST_DELETE_TRACE]` foram removidos.

## EasyDental e migracao

A fonte de verdade dos historicos antigos continua sendo o EasyDental Desktop: `Y:\EDS70\Dados`, SQL Server `DELL_SERVIDOR\EDS70`, database `EDS70`, tabela `dbo.HISTORICO`. O EasyDental permanece somente leitura.

O piloto 214 foi apenas auditado: 648 registros, periodo de 03/11/2008 a 19/08/2026, prestadores Easy 1 (621 linhas) -> Brana 1 e Easy 255 (27 linhas) -> Brana 2, `NROINTPAC` null/0 = 515 e maior que zero = 133, e COR `16777215` em 648/648 linhas. A migracao nao foi iniciada por decisao do usuario.

Antes de qualquer migracao futura, resolver a preservacao de `USER_STAMP_INS`, `TIME_STAMP_INS`, `USER_STAMP_UPD` e `TIME_STAMP_UPD`; nao substituir auditoria historica por timestamps atuais.

## Pendencias adiadas

- Grava global durante edicao inline: pendente de auditoria e homologacao.
- Expansao da paleta alem das 18 cores: melhoria opcional.
- Migracao piloto 214 e migracao global: adiadas, nao autorizadas nesta fase.

## Roadmap

- H.0 contrato legado: concluido.
- H.1 banco/backend CRUD: concluido.
- H.2A shell e consulta React: concluido.
- H.2B CRUD visual React: concluido no escopo atual.
- H.2B.4 Propriedades/Cor: concluido.
- H.2B.5 Delete/estabilizacao: concluido.
- H.CLOSE.1 documentacao e ancora: concluido apos este fechamento.
- H.M1 preparacao de migracao: adiada.
- H.M1 piloto 214: nao executado.
- H.M2 migracao global: nao executado.

## Ancora local

Branch inicial: `modularizacao-segura-fase-1`
HEAD inicial: `ecadb4f00e3564b7412cb1eda25231172673ceac`
Remote: `origin https://github.com/institutobrana/branacloud.git`

O worktree ja continha alteracoes de varias frentes. A ancora deve ser criada por stage seletivo, sem incluir essas alteracoes. Apos a criacao, registrar neste documento o hash completo, hash curto e tag anotada local.

Commit de documentacao: `c6382bc1c3f7426a4d004cefca8a06f2e7f73f2b`
Tag de baseline: `anchor-pacientes-historico-react-homologado-2026-08-26`

Para diagnosticar regressao sem rollback destrutivo:

```text
git show anchor-pacientes-historico-react-homologado-2026-08-26
git diff anchor-pacientes-historico-react-homologado-2026-08-26..HEAD -- frontend-react/src/features/historicoPaciente/
```

Diretorio principal: `frontend-react/src/features/historicoPaciente/`. Integracoes minimas ficam em `FichaPessoalModal.jsx` e `FichaPessoalTabs.jsx`.
