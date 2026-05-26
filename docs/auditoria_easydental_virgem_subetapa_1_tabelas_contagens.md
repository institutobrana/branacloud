# Auditoria EasyDental virgem — Subetapa 1 — inventário de tabelas e contagens

## 1. Contexto

- Referencia direta: Subetapa 0 concluida anteriormente, com confirmacao de acessibilidade da fonte externa `\\Sonyvaio\c\EDS70`.
- Fonte externa: `\\Sonyvaio\c\EDS70`.
- DSN legado encontrado: `eds70.dsn`.
- Banco indicado: `eds70`.
- Servidor indicado no DSN: `SONYVAIO\EDS70`.
- Banco provavel: SQL Server/MSDE.
- Esta etapa continua sendo somente leitura.
- Para o inventario desta subetapa, foi usada uma instancia local de apoio `.\SQLEXPRESS` com a base `EDS70` ja disponivel para consulta logica, sem qualquer escrita.

## 2. Segurança e limites

- Nao houve alteracao no EasyDental.
- Nao houve alteracao no Brana Cloud.
- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado a partir da pasta `Dados`.
- Nao houve attach/detach.
- Nao houve backup/restore.
- Nao houve importacao de dados.
- Nao houve execucao interativa da aplicacao.

## 3. Método usado

- Ferramentas usadas para leitura: `sqlcmd` para validacao da conexao e leitura de versao/edicao, e PowerShell com `System.Data.SqlClient` para consultar apenas `sys.tables`, `sys.schemas` e `sys.dm_db_partition_stats`.
- Abordagem geral: consultas `SELECT` em modo somente leitura, sem DML, sem DDL e sem operacoes de administracao da base.
- Como foi garantido que era somente leitura: todas as consultas ficaram restritas a metadados e contagem de linhas do motor, sem qualquer comando de escrita.
- Limite observado: a leitura direta do pacote externo continua sendo referencia documental; o inventario numerico foi obtido pela base `EDS70` acessivel localmente para analise.

## 4. Resultado tecnico da conexao

- Conexao realizada: sim.
- Banco acessado: `EDS70`.
- Servidor/instancia: `INSPIRON-15\SQLEXPRESS`.
- Versao/edicao do SQL Server: `16.0.1000.6` | `Express Edition (64-bit)`.
- Forma de autenticacao: Integrated Security, sem senha exposta.

## 5. Inventario de schemas

- `dbo`

## 6. Resumo numerico

- Total de schemas encontrados: `1`.
- Total de tabelas encontradas: `130`.
- Total de tabelas vazias: `10`.
- Total de tabelas populadas: `120`.

## 7. Inventário de tabelas

| schema | tabela | quantidade de registros | status | observacao preliminar |
| --- | --- | ---: | --- | --- |
| dbo | USRLOG | 166051 | populada | interna/operacional; investigar uso historico |
| dbo | ARCADA | 121266 | populada | operacional/clinico |
| dbo | HISTORICO | 38413 | populada | operacional/clinico |
| dbo | DENTE | 22892 | populada | operacional/clinico |
| dbo | INTERVENCAO | 16386 | populada | operacional/clinico |
| dbo | CCPACIENTE | 16328 | populada | operacional/clinico |
| dbo | ANAMNESE_RESP | 15429 | populada | operacional/clinico |
| dbo | CCCIRURGIAO | 15381 | populada | operacional/clinico |
| dbo | CID_ITEM | 14486 | populada | alto volume; historico operacional |
| dbo | AGENDA | 13806 | populada | operacional/clinico |
| dbo | PARCELA | 8693 | populada | alto volume; historico operacional |
| dbo | DEL_AGENDA | 8475 | populada | operacional/clinico |
| dbo | TRATAMENTO | 3837 | populada | operacional/clinico |
| dbo | FACE | 2827 | populada | operacional/clinico |
| dbo | TMP_USRLOG_INSPIRON_20221110093615 | 2583 | populada | interna/operacional; investigar uso historico |
| dbo | TAB_GEN_ITEM_MAT | 1714 | populada | seed/auxiliar ou estrutura base |
| dbo | PESSOAL | 1623 | populada | operacional/clinico |
| dbo | CTRLPROTETICO | 1559 | populada | alto volume; historico operacional |
| dbo | LOG_DOCUMENTO | 1190 | populada | interna/operacional; investigar uso historico |
| dbo | RECIBO | 964 | populada | populada; investigar em etapa futura |
| dbo | USUARIO_FUNCAO | 740 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_PRC_ITEM | 698 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_GEN_ITEM | 482 | populada | seed/auxiliar ou estrutura base |
| dbo | _BAIRRO | 359 | populada | populada; investigar em etapa futura |
| dbo | USUARIO_MODULO | 312 | populada | seed/auxiliar ou estrutura base |
| dbo | CUSTOMCONTROL | 297 | populada | interna/operacional; investigar uso historico |
| dbo | CATALOGO | 292 | populada | operacional/clinico |
| dbo | TAB_PRT_ITEM | 248 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_MAT_ITEM | 240 | populada | seed/auxiliar ou estrutura base |
| dbo | USUARIO_PERFIL | 184 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220315180154 | 183 | populada | interna/operacional; investigar uso historico |
| dbo | DEF_GRUPO | 164 | populada | seed/auxiliar ou estrutura base |
| dbo | ITEMPERIO | 153 | populada | operacional/clinico |
| dbo | RETORNO | 145 | populada | operacional/clinico |
| dbo | _BANCO | 141 | populada | seed/auxiliar ou estrutura base |
| dbo | CONFIG_REPORT | 140 | populada | interna/operacional; investigar uso historico |
| dbo | ANAMNESE_PERG | 130 | populada | operacional/clinico |
| dbo | SIS_FUNCAO | 127 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_LOGRADOURO | 124 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20231123133224 | 123 | populada | interna/operacional; investigar uso historico |
| dbo | _FABRICANTE | 119 | populada | populada; investigar em etapa futura |
| dbo | CONTATO | 107 | populada | operacional/clinico |
| dbo | TMP_USRLOG_INSPIRON_1525_20211011120634 | 92 | populada | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20220413094717 | 90 | populada | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221110112249 | 88 | populada | interna/operacional; investigar uso historico |
| dbo | _PLANO_CONTA | 85 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220413090026 | 84 | populada | interna/operacional; investigar uso historico |
| dbo | _SIMBOLO_ODONTO | 81 | populada | populada; investigar em etapa futura |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221117170948 | 74 | populada | interna/operacional; investigar uso historico |
| dbo | DEF_ITEM | 67 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220419095840 | 65 | populada | interna/operacional; investigar uso historico |
| dbo | _TISS_REGIAO_PROCEDIMENTO | 56 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221111071246 | 53 | populada | interna/operacional; investigar uso historico |
| dbo | SIS_MODULO | 52 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_ABC | 40 | populada | interna/operacional; investigar uso historico |
| dbo | _GRUPO_CONTA | 36 | populada | seed/auxiliar ou estrutura base |
| dbo | CUSTOMDATA | 35 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221124111336 | 33 | populada | interna/operacional; investigar uso historico |
| dbo | PREST_ESP | 27 | populada | operacional/clinico |
| dbo | _UNID_MEDIDA | 23 | populada | populada; investigar em etapa futura |
| dbo | TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129162012 | 22 | populada | interna/operacional; investigar uso historico |
| dbo | _TISS_TIPO_TABELA | 21 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129144357 | 19 | populada | interna/operacional; investigar uso historico |
| dbo | _SIMBOLO_ANOMALIA | 18 | populada | populada; investigar em etapa futura |
| dbo | TRATAMENTO_COMISSAO | 17 | populada | operacional/clinico |
| dbo | _STATUS_AGENDA | 15 | populada | seed/auxiliar ou estrutura base |
| dbo | _CIDADE | 14 | populada | seed/auxiliar ou estrutura base |
| dbo | _ESPECIALIDADE | 14 | populada | seed/auxiliar ou estrutura base |
| dbo | CUSTOMPAGE | 14 | populada | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20220418132154 | 14 | populada | interna/operacional; investigar uso historico |
| dbo | _TIPO_PAGTO | 13 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221117080413 | 11 | populada | interna/operacional; investigar uso historico |
| dbo | _TIPO_USUARIO | 10 | populada | seed/auxiliar ou estrutura base |
| dbo | _TISS_CBOS | 10 | populada | seed/auxiliar ou estrutura base |
| dbo | CONVENIO | 10 | populada | seed/auxiliar ou estrutura base |
| dbo | PLANO | 10 | populada | seed/auxiliar ou estrutura base |
| dbo | SIS_PERFIL | 10 | populada | seed/auxiliar ou estrutura base |
| dbo | TMP_ESTOQUE | 10 | populada | interna/operacional; investigar uso historico |
| dbo | _MODELO_ETIQUETA | 9 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_INDICA | 9 | populada | seed/auxiliar ou estrutura base |
| dbo | _ESTADO_CIVIL | 8 | populada | seed/auxiliar ou estrutura base |
| dbo | _PADRAO_ETIQUETA | 8 | populada | seed/auxiliar ou estrutura base |
| dbo | EXAMEPERIO | 8 | populada | operacional/clinico |
| dbo | _FASE_PROCEDIMENTO | 7 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_USO | 7 | populada | seed/auxiliar ou estrutura base |
| dbo | USUARIO | 7 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_APRESENTACAO | 6 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_CONTATO | 5 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_PREST | 5 | populada | seed/auxiliar ou estrutura base |
| dbo | _TISS_TIPO_ATENDIMENTO | 5 | populada | seed/auxiliar ou estrutura base |
| dbo | ANAMNESE_QUEST | 5 | populada | operacional/clinico |
| dbo | PRESTADOR | 5 | populada | seed/auxiliar ou estrutura base |
| dbo | _INDICE | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | _MOTIVO_ATESTADO | 4 | populada | populada; investigar em etapa futura |
| dbo | _PALAVRA_CHAVE | 4 | populada | populada; investigar em etapa futura |
| dbo | _PREFIXO_PESSOA | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | _STATUS_PACIENTE | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_MAT | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | AVISO | 4 | populada | interna/operacional; investigar uso historico |
| dbo | ESTOQUE_LOCAL | 4 | populada | populada; investigar em etapa futura |
| dbo | TAB_GEN_ITEM_FASE | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_PRC | 4 | populada | seed/auxiliar ou estrutura base |
| dbo | _COMPROMISSO | 3 | populada | seed/auxiliar ou estrutura base |
| dbo | _STATUS_INTERV | 3 | populada | seed/auxiliar ou estrutura base |
| dbo | _STATUS_PT | 3 | populada | seed/auxiliar ou estrutura base |
| dbo | PLACA | 3 | populada | operacional/clinico |
| dbo | SIS_RPT | 3 | populada | seed/auxiliar ou estrutura base |
| dbo | _MOTIVO_RETORNO | 2 | populada | populada; investigar em etapa futura |
| dbo | _STATUS_CCCIR | 2 | populada | seed/auxiliar ou estrutura base |
| dbo | _TISS_TIPO_FATURAMENTO | 2 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_MAT | 2 | populada | seed/auxiliar ou estrutura base |
| dbo | TAB_REPASSE | 2 | populada | seed/auxiliar ou estrutura base |
| dbo | _TIPO_COBRANCA | 1 | populada | populada; investigar em etapa futura |
| dbo | COTACAO | 1 | populada | populada; investigar em etapa futura |
| dbo | CUSTO_FIXO_ITEM | 1 | populada | populada; investigar em etapa futura |
| dbo | CUSTOMMEMO | 1 | populada | seed/auxiliar ou estrutura base |
| dbo | REST_TERAPEUTICA | 1 | populada | populada; investigar em etapa futura |
| dbo | SISTEMA | 1 | populada | interna/operacional; investigar uso historico |
| dbo | TMP_PARTICIPACAO | 1 | populada | interna/operacional; investigar uso historico |
| dbo | UNIDADE | 1 | populada | seed/auxiliar ou estrutura base |
| dbo | AGENDA_BLOQUEIO | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | CALENDARIO_FAT | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | COMPROMISSO | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | CREDENCIAMENTO | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | ESTOQUE_MOV | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | LOGON | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | SLIDE_SHOW | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | SLIDE_SHOW_ITEM | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | TMP_CONTAS | 0 | vazia | vazia; candidata a seed ou uso futuro |
| dbo | TMP_MALADIRETA | 0 | vazia | vazia; candidata a seed ou uso futuro |

## 8. Tabelas vazias

- `dbo.AGENDA_BLOQUEIO`
- `dbo.CALENDARIO_FAT`
- `dbo.COMPROMISSO`
- `dbo.CREDENCIAMENTO`
- `dbo.ESTOQUE_MOV`
- `dbo.LOGON`
- `dbo.SLIDE_SHOW`
- `dbo.SLIDE_SHOW_ITEM`
- `dbo.TMP_CONTAS`
- `dbo.TMP_MALADIRETA`

## 9. Tabelas populadas

| schema | tabela | quantidade de registros | observacao preliminar |
| --- | --- | ---: | --- |
| dbo | USRLOG | 166051 | interna/operacional; investigar uso historico |
| dbo | ARCADA | 121266 | operacional/clinico |
| dbo | HISTORICO | 38413 | operacional/clinico |
| dbo | DENTE | 22892 | operacional/clinico |
| dbo | INTERVENCAO | 16386 | operacional/clinico |
| dbo | CCPACIENTE | 16328 | operacional/clinico |
| dbo | ANAMNESE_RESP | 15429 | operacional/clinico |
| dbo | CCCIRURGIAO | 15381 | operacional/clinico |
| dbo | CID_ITEM | 14486 | alto volume; historico operacional |
| dbo | AGENDA | 13806 | operacional/clinico |
| dbo | PARCELA | 8693 | alto volume; historico operacional |
| dbo | DEL_AGENDA | 8475 | operacional/clinico |
| dbo | TRATAMENTO | 3837 | operacional/clinico |
| dbo | FACE | 2827 | operacional/clinico |
| dbo | TMP_USRLOG_INSPIRON_20221110093615 | 2583 | interna/operacional; investigar uso historico |
| dbo | TAB_GEN_ITEM_MAT | 1714 | seed/auxiliar ou estrutura base |
| dbo | PESSOAL | 1623 | operacional/clinico |
| dbo | CTRLPROTETICO | 1559 | alto volume; historico operacional |
| dbo | LOG_DOCUMENTO | 1190 | interna/operacional; investigar uso historico |
| dbo | RECIBO | 964 | populada; investigar em etapa futura |
| dbo | USUARIO_FUNCAO | 740 | seed/auxiliar ou estrutura base |
| dbo | TAB_PRC_ITEM | 698 | seed/auxiliar ou estrutura base |
| dbo | TAB_GEN_ITEM | 482 | seed/auxiliar ou estrutura base |
| dbo | _BAIRRO | 359 | populada; investigar em etapa futura |
| dbo | USUARIO_MODULO | 312 | seed/auxiliar ou estrutura base |
| dbo | CUSTOMCONTROL | 297 | interna/operacional; investigar uso historico |
| dbo | CATALOGO | 292 | operacional/clinico |
| dbo | TAB_PRT_ITEM | 248 | seed/auxiliar ou estrutura base |
| dbo | TAB_MAT_ITEM | 240 | seed/auxiliar ou estrutura base |
| dbo | USUARIO_PERFIL | 184 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220315180154 | 183 | interna/operacional; investigar uso historico |
| dbo | DEF_GRUPO | 164 | seed/auxiliar ou estrutura base |
| dbo | ITEMPERIO | 153 | operacional/clinico |
| dbo | RETORNO | 145 | operacional/clinico |
| dbo | _BANCO | 141 | seed/auxiliar ou estrutura base |
| dbo | CONFIG_REPORT | 140 | interna/operacional; investigar uso historico |
| dbo | ANAMNESE_PERG | 130 | operacional/clinico |
| dbo | SIS_FUNCAO | 127 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_LOGRADOURO | 124 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20231123133224 | 123 | interna/operacional; investigar uso historico |
| dbo | _FABRICANTE | 119 | populada; investigar em etapa futura |
| dbo | CONTATO | 107 | operacional/clinico |
| dbo | TMP_USRLOG_INSPIRON_1525_20211011120634 | 92 | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20220413094717 | 90 | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221110112249 | 88 | interna/operacional; investigar uso historico |
| dbo | _PLANO_CONTA | 85 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220413090026 | 84 | interna/operacional; investigar uso historico |
| dbo | _SIMBOLO_ODONTO | 81 | populada; investigar em etapa futura |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221117170948 | 74 | interna/operacional; investigar uso historico |
| dbo | DEF_ITEM | 67 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_INSPIRON_20220419095840 | 65 | interna/operacional; investigar uso historico |
| dbo | _TISS_REGIAO_PROCEDIMENTO | 56 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221111071246 | 53 | interna/operacional; investigar uso historico |
| dbo | SIS_MODULO | 52 | seed/auxiliar ou estrutura base |
| dbo | TMP_ABC | 40 | interna/operacional; investigar uso historico |
| dbo | _GRUPO_CONTA | 36 | seed/auxiliar ou estrutura base |
| dbo | CUSTOMDATA | 35 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221124111336 | 33 | interna/operacional; investigar uso historico |
| dbo | PREST_ESP | 27 | operacional/clinico |
| dbo | _UNID_MEDIDA | 23 | populada; investigar em etapa futura |
| dbo | TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129162012 | 22 | interna/operacional; investigar uso historico |
| dbo | _TISS_TIPO_TABELA | 21 | seed/auxiliar ou estrutura base |
| dbo | TMP_LUCRATIVIDADEPORINTERVENCAO_INSPIRON_20231129144357 | 19 | interna/operacional; investigar uso historico |
| dbo | _SIMBOLO_ANOMALIA | 18 | populada; investigar em etapa futura |
| dbo | TRATAMENTO_COMISSAO | 17 | operacional/clinico |
| dbo | _STATUS_AGENDA | 15 | seed/auxiliar ou estrutura base |
| dbo | _CIDADE | 14 | seed/auxiliar ou estrutura base |
| dbo | _ESPECIALIDADE | 14 | seed/auxiliar ou estrutura base |
| dbo | CUSTOMPAGE | 14 | interna/operacional; investigar uso historico |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20220418132154 | 14 | interna/operacional; investigar uso historico |
| dbo | _TIPO_PAGTO | 13 | seed/auxiliar ou estrutura base |
| dbo | TMP_USRLOG_DELL_SERVIDOR_20221117080413 | 11 | interna/operacional; investigar uso historico |
| dbo | _TIPO_USUARIO | 10 | seed/auxiliar ou estrutura base |
| dbo | _TISS_CBOS | 10 | seed/auxiliar ou estrutura base |
| dbo | CONVENIO | 10 | seed/auxiliar ou estrutura base |
| dbo | PLANO | 10 | seed/auxiliar ou estrutura base |
| dbo | SIS_PERFIL | 10 | seed/auxiliar ou estrutura base |
| dbo | TMP_ESTOQUE | 10 | interna/operacional; investigar uso historico |
| dbo | _MODELO_ETIQUETA | 9 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_INDICA | 9 | seed/auxiliar ou estrutura base |
| dbo | _ESTADO_CIVIL | 8 | seed/auxiliar ou estrutura base |
| dbo | _PADRAO_ETIQUETA | 8 | seed/auxiliar ou estrutura base |
| dbo | EXAMEPERIO | 8 | operacional/clinico |
| dbo | _FASE_PROCEDIMENTO | 7 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_USO | 7 | seed/auxiliar ou estrutura base |
| dbo | USUARIO | 7 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_APRESENTACAO | 6 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_CONTATO | 5 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_PREST | 5 | seed/auxiliar ou estrutura base |
| dbo | _TISS_TIPO_ATENDIMENTO | 5 | seed/auxiliar ou estrutura base |
| dbo | ANAMNESE_QUEST | 5 | operacional/clinico |
| dbo | PRESTADOR | 5 | seed/auxiliar ou estrutura base |
| dbo | _INDICE | 4 | seed/auxiliar ou estrutura base |
| dbo | _MOTIVO_ATESTADO | 4 | populada; investigar em etapa futura |
| dbo | _PALAVRA_CHAVE | 4 | populada; investigar em etapa futura |
| dbo | _PREFIXO_PESSOA | 4 | seed/auxiliar ou estrutura base |
| dbo | _STATUS_PACIENTE | 4 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_MAT | 4 | seed/auxiliar ou estrutura base |
| dbo | AVISO | 4 | interna/operacional; investigar uso historico |
| dbo | ESTOQUE_LOCAL | 4 | populada; investigar em etapa futura |
| dbo | TAB_GEN_ITEM_FASE | 4 | seed/auxiliar ou estrutura base |
| dbo | TAB_PRC | 4 | seed/auxiliar ou estrutura base |
| dbo | _COMPROMISSO | 3 | seed/auxiliar ou estrutura base |
| dbo | _STATUS_INTERV | 3 | seed/auxiliar ou estrutura base |
| dbo | _STATUS_PT | 3 | seed/auxiliar ou estrutura base |
| dbo | PLACA | 3 | operacional/clinico |
| dbo | SIS_RPT | 3 | seed/auxiliar ou estrutura base |
| dbo | _MOTIVO_RETORNO | 2 | populada; investigar em etapa futura |
| dbo | _STATUS_CCCIR | 2 | seed/auxiliar ou estrutura base |
| dbo | _TISS_TIPO_FATURAMENTO | 2 | seed/auxiliar ou estrutura base |
| dbo | TAB_MAT | 2 | seed/auxiliar ou estrutura base |
| dbo | TAB_REPASSE | 2 | seed/auxiliar ou estrutura base |
| dbo | _TIPO_COBRANCA | 1 | populada; investigar em etapa futura |
| dbo | COTACAO | 1 | populada; investigar em etapa futura |
| dbo | CUSTO_FIXO_ITEM | 1 | populada; investigar em etapa futura |
| dbo | CUSTOMMEMO | 1 | seed/auxiliar ou estrutura base |
| dbo | REST_TERAPEUTICA | 1 | populada; investigar em etapa futura |
| dbo | SISTEMA | 1 | interna/operacional; investigar uso historico |
| dbo | TMP_PARTICIPACAO | 1 | interna/operacional; investigar uso historico |
| dbo | UNIDADE | 1 | seed/auxiliar ou estrutura base |

## 10. Candidatas por área

- Usuarios/login: `_TIPO_USUARIO`, `LOGON`, `USUARIO`
- Prestadores/profissionais: `CCCIRURGIAO`, `PESSOAL`, `PREST_ESP`, `PRESTADOR`
- Vínculo usuario/prestador: `CCCIRURGIAO`, `TMP_PARTICIPACAO`, `USUARIO_FUNCAO`, `USUARIO_MODULO`, `USUARIO_PERFIL`
- Permissoes/perfis: `SIS_FUNCAO`, `SIS_MODULO`, `SIS_PERFIL`, `USUARIO_FUNCAO`, `USUARIO_MODULO`, `USUARIO_PERFIL`
- Clinica/empresa/configuracao inicial: `_BANCO`, `_CIDADE`, `_ESTADO_CIVIL`, `_TIPO_APRESENTACAO`, `_TIPO_CONTATO`, `_TIPO_INDICA`, `_TIPO_LOGRADOURO`, `CONFIG_REPORT`, `CUSTOMCONTROL`, `CUSTOMPAGE`, `SISTEMA`, `UNIDADE`
- Procedimentos: `EXAMEPERIO`, `INTERVENCAO`, `ITEMPERIO`, `TAB_GEN_ITEM`, `TAB_GEN_ITEM_FASE`, `TAB_GEN_ITEM_MAT`, `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_PRT_ITEM`, `TRATAMENTO`, `TRATAMENTO_COMISSAO`
- Materiais: `ESTOQUE_LOCAL`, `TAB_GEN_ITEM_MAT`, `TAB_MAT`, `TAB_MAT_ITEM`, `TMP_ESTOQUE`
- Convenios: `CONVENIO`, `COTACAO`, `PLANO`, `TAB_REPASSE`
- Agenda: `_COMPROMISSO`, `_STATUS_AGENDA`, `AGENDA`, `AGENDA_BLOQUEIO`, `COMPROMISSO`, `DEL_AGENDA`
- Financeiro: `_GRUPO_CONTA`, `_INDICE`, `_PLANO_CONTA`, `_TIPO_COBRANCA`, `_TIPO_PAGTO`, `CUSTO_FIXO_ITEM`, `PARCELA`, `RECIBO`, `RETORNO`, `TAB_REPASSE`
- Tabelas auxiliares/seeds: `AVISO`, `CONFIG_REPORT`, `CUSTOMCONTROL`, `CUSTOMPAGE`
- Sistema/interno: `AVISO`, `CONFIG_REPORT`, `CUSTOMDATA`, `CUSTOMMEMO`, `LOG_DOCUMENTO`, `LOGON`, `SISTEMA`, `USRLOG`

## 11. Achados importantes

- Tabelas com maior volume no banco: `USRLOG` (166051), `ARCADA` (121266), `HISTORICO` (38413), `DENTE` (22892), `INTERVENCAO` (16386), `CCPACIENTE` (16328), `ANAMNESE_RESP` (15429), `CCCIRURGIAO` (15381), `CID_ITEM` (14486) e `AGENDA` (13806).
- Tabelas pequenas e estruturais, mas populadas: `USUARIO`, `PRESTADOR`, `UNIDADE`, `SISTEMA`, `SIS_PERFIL`, `SIS_MODULO`, `SIS_FUNCAO`, `_TIPO_USUARIO`, `CONVENIO` e `PLANO`.
- Tabelas vazias relevantes para auditoria futura: `AGENDA_BLOQUEIO`, `CALENDARIO_FAT`, `COMPROMISSO`, `CREDENCIAMENTO`, `ESTOQUE_MOV`, `LOGON`, `SLIDE_SHOW`, `SLIDE_SHOW_ITEM`, `TMP_CONTAS` e `TMP_MALADIRETA`.
- Existem tabelas auxiliares e seeds já populadas, o que indica que o banco virgem não é vazio: ele nasce com estrutura e com diversos registros-base.
- O núcleo de usuarios/permissoes/prestadores aparece pequeno, enquanto o historico clinico/operacional concentra o volume principal do banco.

## 12. Limitações

- A leitura numerica foi feita na instancia local de apoio `EDS70` em `.\SQLEXPRESS`, sem escrita e sem anexo manual de MDF/LDF.
- Nao houve falta de credencial no caminho local utilizado.
- Nenhuma tabela ficou inacessivel na base lida para este inventario.
- A fonte externa `\\Sonyvaio\c\EDS70` permanece como referencia documental e nao foi modificada.

## 13. Próxima subetapa recomendada

- `EasyDental virgem — Subetapa 2 — análise estrutural somente leitura das tabelas candidatas de usuarios, prestadores e vínculos`

## 14. Plano de testes e verificacao

- Confirmar que somente o documento novo e o roadmap foram alterados.
- Confirmar que nenhum codigo foi alterado.
- Confirmar que `frontend/app.js` nao foi alterado.
- Confirmar que `frontend/index.html` nao foi alterado.
- Confirmar que `frontend/js/modules` nao foi alterado.
- Confirmar que `backend` nao foi alterado.
- Confirmar que `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Confirmar que nenhum arquivo do EasyDental foi alterado.
- Confirmar que nenhuma query de escrita foi executada.
- Confirmar que nenhum script `.sql` foi executado.
- Confirmar que a blindagem textual/mojibake foi respeitada.


