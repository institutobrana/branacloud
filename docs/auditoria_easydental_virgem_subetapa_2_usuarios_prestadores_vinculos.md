# Auditoria EasyDental virgem — Subetapa 2 — usuários, prestadores e vínculos

## 1. Contexto

- Referencia a Subetapa 0: a fonte externa `\\Sonyvaio\c\EDS70` foi confirmada como acessivel.
- Referencia a Subetapa 1: a leitura estrutural foi feita em `INSPIRON-15\SQLEXPRESS`, banco `EDS70`, em modo somente leitura.
- DSN original encontrado: `SERVER=SONYVAIO\EDS70`, `DATABASE=eds70`.
- Esta etapa e somente leitura e serve para validar a identidade da base antes de tirar conclusoes funcionais.

## 2. Validacao da identidade da base

### 2.1 Resultado da conexao

- Servidor consultado: `INSPIRON-15\SQLEXPRESS`
- Banco consultado: `EDS70`
- Versao SQL Server: `Microsoft SQL Server 2022 (RTM) - 16.0.1000.6`
- Edicao: `Express Edition (64-bit)`
- `@@VERSION`: ambiente Windows 10 Pro, instancia Express, leitura local

### 2.2 `sys.databases`

| name | database_id | create_date | compatibility_level | collation_name | recovery_model_desc | state_desc |
| --- | ---: | --- | ---: | --- | --- | --- |
| EDS70 | 5 | 2026-03-17 06:33:55.030 | 100 | Latin1_General_CI_AS | SIMPLE | ONLINE |

### 2.3 `sys.database_files`

| logical name | type | physical name | size (pages) | growth (pages) | percent growth |
| --- | --- | --- | ---: | ---: | --- |
| eds70dat | ROWS | `D:\SQLData\EDS70_2022\eds70dat.mdf` | 257472 | 640 | 0 |
| eds70log | LOG | `D:\SQLData\EDS70_2022\eds70log.ldf` | 1280 | 640 | 0 |

### 2.4 Comparacao com a fonte externa

- A fonte externa apontada no DSN usa `SONYVAIO\EDS70`.
- Os arquivos fisicos da base lida apontam para `D:\SQLData\EDS70_2022\`.
- O nome logico dos arquivos coincide com `eds70dat` e `eds70log`, mas o caminho fisico nao coincide com `\\Sonyvaio\c\EDS70\Dados\...`.
- Conclusao cautelosa: nao foi possivel confirmar correspondencia direta com a pasta externa; ha forte indicio de que a base lida e uma copia/anexo local ou uma restauracao derivada da instalacao externa, nao a share diretamente.

## 3. Alerta sobre a base "virgem"

- A Subetapa 1 encontrou `120` tabelas populadas.
- As maiores tabelas observadas foram `USRLOG`, `ARCADA`, `HISTORICO`, `DENTE`, `INTERVENCAO`, `CCPACIENTE`, `ANAMNESE_RESP`, `CCCIRURGIAO`, `CID_ITEM` e `AGENDA`.
- Isso e incompatível com a ideia de uma base vazia.
- Hipoteses possiveis:
  - dados estruturais do sistema;
  - dados de distribuicao;
  - dados de exemplo;
  - logs internos;
  - base previamente usada;
  - banco restaurado ou anexado de outra origem.
- Nao concluir "virgem" ou "nao virgem" sem evidencias adicionais.

## 4. Tabelas analisadas

| tabela | quantidade de registros | status | observacao |
| --- | ---: | --- | --- |
| `_TIPO_USUARIO` | 10 | populada | seed auxiliar de tipos de usuario |
| `LOGON` | 0 | vazia | tabela de sessao/log, sem linhas |
| `USUARIO` | 7 | populada | tabela clara de login/usuario |
| `CCCIRURGIAO` | 15400 | populada | tabela operacional com `ID_PRESTADOR` por nome |
| `PESSOAL` | 1623 | populada | cadastro amplo de pessoas/pacientes, com vínculo a prestador |
| `PREST_ESP` | 27 | populada | junção formal prestador x especialidade |
| `PRESTADOR` | 5 | populada | tabela clara de prestador/profissional |
| `TMP_PARTICIPACAO` | 1 | populada | tabela temporaria/auxiliar com `ID_PRESTADOR` |
| `USUARIO_FUNCAO` | 745 | populada | vinculo usuario x funcao |
| `USUARIO_MODULO` | 312 | populada | vinculo usuario x modulo |
| `USUARIO_PERFIL` | 184 | populada | vinculo usuario x prestador x perfil |

## 5. Estrutura das tabelas de usuarios/login

### `_TIPO_USUARIO`

- Colunas principais: `REGISTRO int` (PK), `NOME varchar(50)`, `DESCRICAO varchar(255)`, `RESERVADO smallint`
- Chave primaria: `PK___TIPO_USUARIO__04E4BC85` em `REGISTRO`
- Indices secundarios: nenhum observado
- FKs: nenhuma observada
- Amostra controlada: os valores textuais indicam tipos como `Cirurgião dentista`, `Auxiliar odontológico(a)` e `Funcionário(a) administrativo(a)`; valores reproduzidos somente de forma estrutural
- Interpretacao cautelosa: tabela de seeds/auxiliar para classificacao de usuario

### `LOGON`

- Colunas principais: `ESTACAO varchar(20)`, `NROUSR int`, `HORA datetime`, `NROMOD int`, `CONTEXTO1 int`, `ODONTOGRAMA int`, `LIC_CHAVE_SESSAO char(21)`
- Chave primaria: nenhuma observada
- Indices secundarios: nenhum observado
- FKs: nenhuma observada
- Amostra controlada: tabela vazia
- Interpretacao cautelosa: parece registrar sessao/estacao/licenca, nao credencial de login

### `USUARIO`

- Colunas principais: `NROUSR int` (PK), `TIPO int`, `APELIDO varchar(10)`, `NOME varchar(40)`, `CRO varchar(10)`, `CPF varchar(20)`, `INATIVO smallint`, `SENHA varchar(10)`, `PREFUSUARIO text`, `PREFAGENDA text`, `PREFIMPRESSORA text`, `PREFETIQUETA text`, `PERMISSOES text`, `ID_PRESTADOR int`, `ID_UNIDADE int`, `ALTERASENHA smallint`
- Chave primaria: `PK__USUARIO__693CA210` em `NROUSR`
- Indices secundarios: nenhum observado
- FKs formais:
  - `TIPO -> _TIPO_USUARIO.REGISTRO`
  - `ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
  - `ID_UNIDADE -> UNIDADE.ID_UNIDADE`
- Amostra controlada: ha registros com `NROUSR` baixo, um registro com apelido estrutural `Clínica` e outro com `NROUSR=1`; valores pessoais, senha e preferencias detalhadas nao foram reproduzidos
- Interpretacao cautelosa: tabela clara de login/usuario; existe relacao formal com prestador e unidade, mas a identidade do admin inicial nao deve ser afirmada sem corroboracao adicional

## 6. Estrutura das tabelas de prestadores/profissionais

### `CCCIRURGIAO`

- Colunas principais: `REGISTRO int` (PK), `ID_PRESTADOR int`, `DATA datetime`, `HISTORICO varchar(50)`, `NROLAN int`, `NROIND int`, `VALOR float`, `NROCHEQUE varchar(25)`, `NROCCPAC int`, `TRIBUTAVEL smallint`, `TIPO_PAGTO int`, `CODREF varchar(20)`, `CODREF_COMP varchar(20)`, `STATUS int`, `USR_ULT_UPD int`, `DAT_ULT_UPD datetime`, `NROTRANS int`, `USER_STAMP_INS int`, `TIME_STAMP_INS datetime`, `USER_STAMP_UPD int`, `TIME_STAMP_UPD datetime`, `DATA_LANCAMENTO datetime`
- Chave primaria: `PK__CCCIRURGIAO__49C3F6B7` em `REGISTRO`
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `NROIND -> _INDICE.NROIND`
  - `NROLAN -> _PLANO_CONTA.NROCATFIN`
  - `STATUS -> _STATUS_CCCIR.REGISTRO`
  - `NROCCPAC -> CCPACIENTE.REGISTRO`
  - `USER_STAMP_INS -> USUARIO.NROUSR`
  - `USER_STAMP_UPD -> USUARIO.NROUSR`
- Indicio de relacionamento com prestador: a coluna `ID_PRESTADOR` existe, mas nao foi observada FK formal nesta analise
- Amostra controlada: registros operacionais com datas e valores existem; valores pessoais e historico livre nao foram reproduzidos
- Interpretacao cautelosa: tabela operacional/financeira ligada a prestador por nome de coluna, mas o relacionamento formal com `PRESTADOR` nao foi confirmado

### `PESSOAL`

- Colunas principais: `NROPAC int` (PK), `PRINOM varchar(61)`, `SEGNOM varchar(30)`, `ID_PRESTADOR int`, `PUBLICO smallint`, `DATCAD datetime`, `NOMRES varchar(60)`, `CICRES varchar(20)`, `SEXO smallint`, `APELIDO varchar(15)`, `DATNAS datetime`, `ENDRES varchar(40)`, `CIDRES varchar(30)`, `PROFIS varchar(40)`, `STATUS int`, `EMAIL varchar(50)`, `ID_CONVENIO int`, `ID_PLANO int`, `ID_UNIDADE int`, `CD_CNS varchar(15)` e diversos campos auxiliares de contato/endereco
- Chave primaria: `PK__PESSOAL__5DCAEF64` em `NROPAC`
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ESTCIVIL -> _ESTADO_CIVIL.REGISTRO`
  - `STATUS -> _STATUS_PACIENTE.REGISTRO`
  - `TIPO_INDICA -> _TIPO_INDICA.REGISTRO`
  - `ID_CONVENIO -> CONVENIO.NROCONV`
  - `ID_PLANO -> PLANO.NROPLAN`
  - `ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
  - `NROTAB -> TAB_PRC.NROTAB`
  - `ID_UNIDADE -> UNIDADE.ID_UNIDADE`
- Amostra controlada: a linha consultada mostra enderecos, contatos e observacoes livres; esses valores foram omitidos por privacidade
- Interpretacao cautelosa: e uma tabela ampla de pessoas/pacientes, mas participa do vinculo com prestador via FK formal em `ID_PRESTADOR`

### `PREST_ESP`

- Colunas principais: `ID_PRESTADOR int`, `ID_ESPECIALIDADE int`
- Chave primaria: composta em `ID_PRESTADOR` + `ID_ESPECIALIDADE` (`PK_PREST_ESP`)
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ID_ESPECIALIDADE -> _ESPECIALIDADE.REGISTRO`
  - `ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- Amostra controlada: apenas ids tecnicos, sem dados pessoais
- Interpretacao cautelosa: junção formal clara entre prestador e especialidade

### `PRESTADOR`

- Colunas principais: `ID_PRESTADOR int` (PK), `COD_PRESTADOR varchar(30)`, `COD_CONTRATO varchar(10)`, `ID_TIPO_PREST int`, `NOME varchar(50)`, `APELIDO varchar(25)`, `ENDERECO varchar(60)`, `BAIRRO varchar(30)`, `CIDADE varchar(30)`, `CEP varchar(10)`, `UF varchar(2)`, `FONE1 varchar(20)`, `FONE2 varchar(20)`, `CRO_PF varchar(15)`, `CPF_PF varchar(20)`, `RG_PF varchar(20)`, `ID_TIPO_PAGTO int`, `ID_BANCO int`, `AGENCIA varchar(10)`, `CONTA varchar(20)`, `FACULDADE varchar(30)`, `ANO_FORMATURA smallint`, `EMAIL varchar(50)`, `HOMEPAGE varchar(50)`, `INSS varchar(15)`, `CCM varchar(15)`, `DATA_NASC datetime`, `DATA_INI datetime`, `DATA_FIN datetime`, `ID_TIPO_LOGRAD int`, `ID_PREFIXO int`, `ID_EST_CIVIL int`, `SEXO int`, `NUMERO varchar(50)`, `COMPLEM varchar(50)`, `OBSERV text`, `NOME_CONTA varchar(50)`, `ALERTA varchar(50)`, `INATIVO smallint`, `EXECUTA_PROCEDIMENTO smallint`, `TIME_STAMP_INS datetime`, `USER_STAMP_INS int`, `TIME_STAMP_UPD datetime`, `USER_STAMP_UPD int`, `CUSTO_HORA_ATUAL money`, `TOTAL_HORAS_ATUAL money`, `TOTAL_RECEBIDO money`, `ALIQUOTA money`, `INADIMPLENCIA money`, `CD_CRO_UF varchar(2)`, `ID_CBOS int`, `CD_CNES varchar(7)`
- Chave primaria: `PK_PRESTADOR` em `ID_PRESTADOR`
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ID_BANCO -> _BANCO.REGISTRO`
  - `ID_EST_CIVIL -> _ESTADO_CIVIL.REGISTRO`
  - `ID_PREFIXO -> _PREFIXO_PESSOA.REGISTRO`
  - `ID_TIPO_LOGRAD -> _TIPO_LOGRADOURO.REGISTRO`
  - `ID_TIPO_PAGTO -> _TIPO_PAGTO.REGISTRO`
  - `ID_TIPO_PREST -> _TIPO_PREST.REGISTRO`
  - `ID_CBOS -> _TISS_CBOS.REGISTRO`
  - `USER_STAMP_INS -> USUARIO.NROUSR`
  - `USER_STAMP_UPD -> USUARIO.NROUSR`
- Amostra controlada: ha registro com apelido estrutural `Clínica`; outros registros sao profissionais reais e seus campos sensiveis foram omitidos
- Interpretacao cautelosa: tabela clara de prestador/profissional, com estrutura rica de cadastro, financeiro e agenda

## 7. Estrutura das tabelas de vinculo

### `TMP_PARTICIPACAO`

- Colunas principais: `NROTRA int`, `ID_PRESTADOR int`, `TOTTRA float`, `TOTCIR float`, `PART float`, `COMISSAO float`
- Chave primaria: nenhuma observada
- Indices secundarios: nenhum observado
- FKs formais: nenhuma observada
- Amostra controlada: um unico registro com ids e percentuais; sem dados pessoais
- Interpretacao cautelosa: tabela auxiliar/temporaria de participacao, com prestador por nome de coluna, mas sem integridade formal observada

### `USUARIO_FUNCAO`

- Colunas principais: `ID_USUARIO int`, `ID_FUNCAO int`, `NIVEL int`
- Chave primaria: composta em `ID_USUARIO` + `ID_FUNCAO` (`PK_USUARIO_FUNCAO`)
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_FUNCAO -> SIS_FUNCAO.ID_FUNCAO`
- Amostra controlada: entradas com `NIVEL=1`; valores de usuario omitidos
- Interpretacao cautelosa: vinculo formal entre usuario e funcao/permissao

### `USUARIO_MODULO`

- Colunas principais: `ID_USUARIO int`, `ID_MODULO int`, `NIVEL int`
- Chave primaria: composta em `ID_USUARIO` + `ID_MODULO` (`PK_USUARIO_MODULO`)
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_MODULO -> SIS_MODULO.ID_MODULO`
- Amostra controlada: entradas com `NIVEL=1`; valores de usuario omitidos
- Interpretacao cautelosa: vinculo formal entre usuario e modulo/permissao

### `USUARIO_PERFIL`

- Colunas principais: `ID_USUARIO int`, `ID_PRESTADOR int`, `ID_PERFIL int`
- Chave primaria: composta em `ID_USUARIO` + `ID_PRESTADOR` + `ID_PERFIL` (`PK_USUARIO_PERFIL`)
- Indices secundarios: nenhum observado
- FKs formais observadas:
  - `ID_USUARIO -> USUARIO.NROUSR`
  - `ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
  - `ID_PERFIL -> SIS_PERFIL.ID_PERFIL`
- Amostra controlada: perfis pequenos com ids tecnicos; valores pessoais omitidos
- Interpretacao cautelosa: vinculo formal entre usuario, prestador e perfil funcional

## 8. Relacionamentos encontrados

### Forma formal

- `USUARIO.TIPO -> _TIPO_USUARIO.REGISTRO`
- `USUARIO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO.ID_UNIDADE -> UNIDADE.ID_UNIDADE`
- `USUARIO_FUNCAO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_FUNCAO.ID_FUNCAO -> SIS_FUNCAO.ID_FUNCAO`
- `USUARIO_MODULO.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_MODULO.ID_MODULO -> SIS_MODULO.ID_MODULO`
- `USUARIO_PERFIL.ID_USUARIO -> USUARIO.NROUSR`
- `USUARIO_PERFIL.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `USUARIO_PERFIL.ID_PERFIL -> SIS_PERFIL.ID_PERFIL`
- `PREST_ESP.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `PREST_ESP.ID_ESPECIALIDADE -> _ESPECIALIDADE.REGISTRO`
- `PESSOAL.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR`
- `PESSOAL.ID_CONVENIO -> CONVENIO.NROCONV`
- `PESSOAL.ID_PLANO -> PLANO.NROPLAN`
- `PESSOAL.ID_UNIDADE -> UNIDADE.ID_UNIDADE`

### Apenas inferidos por nomenclatura/estrutura

- `LOGON.NROUSR -> USUARIO.NROUSR` nao foi formalizado por FK, mas e fortemente sugerido pela nomenclatura
- `CCCIRURGIAO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR` foi sugerido pela coluna, mas nao houve FK observada
- `TMP_PARTICIPACAO.ID_PRESTADOR -> PRESTADOR.ID_PRESTADOR` foi sugerido pela coluna, mas nao houve FK observada

## 9. Achados importantes

- Existe uma tabela clara de login/usuario: `USUARIO`.
- Existe uma tabela clara de prestador/profissional: `PRESTADOR`.
- Existe separacao entre usuario e prestador, mas tambem existe vinculo formal entre eles via `USUARIO.ID_PRESTADOR`.
- Existe indicio de usuario inicial/admin: ha registros estruturais em `USUARIO` com `NROUSR` baixo e um registro com apelido estrutural `Clínica`, mas nao e possivel afirmar o papel exato do admin original sem correlacao adicional.
- Existe indicio de prestador inicial/sistemico: `PRESTADOR` tem um registro estrutural com apelido `Clínica`.
- Existe vínculo direto usuario/prestador: sim, formal em `USUARIO` e tambem em `USUARIO_PERFIL`.
- Existem tabelas `USUARIO_*` ligadas a permissoes/perfis: sim, `USUARIO_FUNCAO`, `USUARIO_MODULO` e `USUARIO_PERFIL`.
- `LOGON` existe, mas esta vazia e parece ser tabela de sessao/log, nao de credencial.

## 10. Cuidados de privacidade

- Dados pessoais nao foram reproduzidos integralmente.
- Senhas, hashes, tokens e chaves nao foram reproduzidos.
- Campos livres com observacoes longas, emails, telefones, CPFs e enderecos foram mascarados ou omitidos.
- As amostras foram tratadas em nivel tecnico/estrutural.

## 11. Limitacoes

- A identidade da base nao foi validada de forma plena como a pasta externa original; ha divergencia entre o DSN da instalacao externa e a instancia local lida.
- Algumas relacoes foram apenas inferidas por nomenclatura, sem FK formal.
- Algumas tabelas nao possuem chave primaria observada.
- O volume de dados indica que a base pode nao ser "virgem" no sentido literal.
- A amostragem foi contida por privacidade e seguranca.
- A analise permaneceu sem qualquer comando de escrita.

## 12. Conclusao cautelosa

- O que pode ser afirmado com seguranca:
  - `USUARIO` e a tabela clara de login/usuario.
  - `PRESTADOR` e a tabela clara de prestador/profissional.
  - `USUARIO_FUNCAO`, `USUARIO_MODULO` e `USUARIO_PERFIL` sao vinculos formais de acesso/perfil.
  - Existe relacao formal entre usuario e prestador.
  - A base local tem metadados, caminho fisico e data de criacao distintos da referencia UNC externa.

- O que ainda nao pode ser afirmado:
  - que a base lida seja a mesma base fisica da share externa.
  - que o usuario de `NROUSR` baixo seja o admin original.
  - que o prestador `Clínica` seja o unico prestador estrutural.
  - que a base seja "virgem" em sentido literal.

- O que precisa ser investigado na proxima etapa:
  - permissões, perfis, modulos e funcoes com mais profundidade;
  - eventuais seeds e registros estruturais que expliquem o volume populado;
  - qualquer correlacao adicional entre identidade da base e instalacao externa.

## 13. Próxima subetapa recomendada

- `EasyDental virgem — Subetapa 3 — análise estrutural somente leitura de permissões, perfis, módulos e funções`

## 14. Plano de testes e verificacao

- Somente este documento novo e o roadmap foram alterados.
- Nenhum codigo foi alterado.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules` nao foi alterado.
- `backend` nao foi alterado.
- `banco/schema/migrations/seeds/endpoints` nao foram alterados.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nenhum dado sensivel foi exposto indevidamente.
- A blindagem textual/mojibake foi respeitada.
