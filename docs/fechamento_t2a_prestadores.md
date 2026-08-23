# FECHAMENTO-T2A — Cadastro / Corpo clinico / Prestadores

## Status

**Frente A — Prestadores: FUNCIONALMENTE CONCLUIDA E HOMOLOGADA.**

Este documento consolida o estado atual do codigo e dos testes/runtime ja realizados. Ele prevalece sobre propostas antigas quando houver divergencia.

## Fronteira

Inclui tela principal, filtros, tabela, selecao, rodape, estados, Novo, Altera, Elimina, as abas Principal, Contato, Detalhes e Observacoes, Credenciamentos, Comissoes e contratos backend diretamente ligados.

O botao **Agenda** e somente ponto de entrada. `Configura horarios de agendamento` e Frente B independente e nao esta documentada como parte deste fechamento. Unidades de atendimento, ADM, Financeiro e outros modulos ficam fora.

## Prestadores

O shell React usa listagem real, selecao por identidade, toolbar com Novo, Altera, Elimina, Agenda, Convenios e Comissoes, filtro de especialidade, busca, rodape e estados de carregamento, erro e vazio. Novo e Altera compartilham `PrestadorModal`; Elimina usa confirmacao e DELETE por `id`.

### Abas

- **Principal:** campos cadastrais, datas, tipo, status e campos readonly de auditoria.
- **Contato:** telefones, e-mail, home-page e endereco.
- **Detalhes:** dados profissionais, documentos e especialidades.
- **Observacoes:** textarea multiline compartilhado entre Novo e Altera.

Na aba Contato, a distribuicao horizontal homologada e `86px 1.4fr 58px 0.55fr` para Tipo, Endereco residencial, Nº e Complemento, e `0.85fr 1.15fr 110px 72px` para Bairro, Cidade, CEP e UF. Endereco recebeu mais espaco, Complemento foi reduzido, Bairro/Cidade foram reduzidos moderadamente e CEP/UF receberam folga. Alturas, espessuras, ordem, fonte e dimensao geral nao foram alteradas.

### Observacoes multiline

O problema era funcional, nao visual. `_clean_text()` fazia normalizacao equivalente a `" ".join(...split())` e destruia quebras de linha.

O backend usa helper multiline especifico no create e update. `PrestadorOdonto.observacoes` e `Text`; o schema nao precisou de alteracao. LF/CRLF, espacos internos e linhas em branco sao preservados em ciclos de save/reopen.

### Tema

O modal de Prestadores possui header, body, tabs e footer dark, sem faixas claras residuais. Os campos readonly permanecem cianos. O footer usa override dark scoped em `.prestadores-modal .prestadores-modal-footer`. O light mode foi preservado.

## Credenciamentos

Subfluxo concluido: `Cadastro de credenciamentos`.

- Toolbar: Novo, Altera e Elimina.
- Filtros: Convenio e Prestador.
- Tabela: Codigo, Prestador, Convenio, Inicio, Fim e Valor US.
- Filtro Prestador: `<<Todos>>`, ativos, inativos, labels curtos, inativo em vermelho e Clinica.
- Novo: somente ativos, Clinica, sem `<<Todos>>`, codigo opcional, datas, Valor US e auditoria readonly.
- Altera, duplo clique e Elimina usam `credenciamento.id`; cancelamento nao gera PUT e exclusao e fisica por DELETE.

## Comissoes / Fatores

Subfluxo concluido: `Configura fatores de comissão`.

- Toolbar: Novo fator de comissão..., Altera..., Elimina.
- Filtros: Convenio e Prestador.
- Tabela: Vigencia, Prestador, Convenio, Especialidade e Repasse.
- Filtro Prestador inclui `<<Todos>>`, ativos, inativos, labels curtos, inativo vermelho e Clinica.
- Clinica publica `prestador_row_id = 0`; no ORM, `prestador_id` e `prestador_source_id` permanecem `NULL`.
- Novo usa modal compacto aproximado de `680 x 492 px`, com Vigencia/Tipo/Valor e Inclusao/Alteracao na mesma linha.
- Especialidade usa nomes reais, IDs internos e opcao vazia funcional; vazio significa todas as especialidades e nao e substituido por `Gerais`.
- Procedimento generico e opcional, exibido por nome e nao filtrado automaticamente pela Especialidade.
- Tipo 1 = `% sobre valor`; Tipo 2 = `Valor fixo`.
- `repasse` permanece textual. Evidencia: persistido `20`, formulario `20,00` e tabela percentual `20,0000%`. Isso e apresentacao comprovada, nao formula financeira.
- Altera reutiliza o mesmo modal, usa `fator.id`, faz PUT e preserva valores historicos. Duplo clique abre o mesmo fluxo.
- Elimina confirma `Deseja eliminar o fator de comissão de ${prestador_nome} ?` e faz DELETE fisico por `fator.id`.

### Backend e seguranca

- `id` e a identidade da UI; `source_id` e compatibilidade historica.
- `source_id` e sequencial por clinica e usa lock transacional PostgreSQL antes de `max + 1`; o unique `(clinica_id, source_id)` foi preservado.
- GET, filtros, POST, PUT e DELETE sao tenant-scoped.
- Cross-tenant para convenio, prestador, procedimento e fatores foi bloqueado.
- Clinica `0` tambem e tenant-scoped.
- O teste concorrente multiprocesso PostgreSQL nao foi executado; a estrategia, ordem do lock e testes deterministas foram cobertos.

## Pendencia futura — motor financeiro

O cadastro de fatores foi migrado/homologado, mas o motor de aplicacao, calculo, precedencia e consumo dos fatores nao foi localizado/migrado nesta frente. Nenhuma formula foi inventada. `20,0000%` e representacao de cadastro e nao define sozinho base de calculo ou comissao final.

## Testes e runtime

Backend: `test_prestadores_*`, `test_credenciamentos_contract.py`, `test_prestador_comissoes_contract.py` e `test_prestadores_observacoes_contract.py`.

Frontend: `prestadoresModalState.test.js`, `prestadoresContatoTab.test.js`, `prestadoresDetalhesTab.test.js`, `prestadoresObservacoesTab.test.js`, `prestadoresPrincipalContracts.test.js`, `prestadoresApi.test.js`, `prestadorCredenciamentos.contract.test.mjs` e `prestadorComissoesShell.test.mjs`.

Foram realizados runtimes de Prestadores, abas, Credenciamentos, Comissoes, Novo/Altera/Elimina, duplo clique, light/dark, Observacoes multiline e ajuste horizontal de Contato; temporarios de teste foram removidos.

Existe falha preexistente de infraestrutura em testes com caminho relativo `frontend-react/frontend-react/...`; ela nao representa regressao funcional.

## Estado de entrega

Antes de publicar ainda permanecem auditoria seletiva do diff, testes finais e stage/commit/push seletivos. Nenhum desses passos faz parte deste documento.
