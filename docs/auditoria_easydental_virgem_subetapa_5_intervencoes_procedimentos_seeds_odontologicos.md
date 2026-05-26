# Auditoria EasyDental virgem - Subetapa 5 - Intervencoes, Procedimentos e seeds odontologicos

## 1. Contexto

- Frente: `Auditoria comparativa EasyDental virgem x Brana Cloud - usuarios, prestadores, permissoes e seeds iniciais`.
- Referencias anteriores: Subetapas 0, 1, 2, 3 e 4.
- Fonte externa de referencia: `\\Sonyvaio\\c\\EDS70`.
- A base analisada continua sendo tratada como referencia da forma virgem do sistema.
- Mesmo com muitas tabelas populadas e muitos registros, o contexto documental do usuario orienta a tratar parte desse volume como possiveis seeds estruturais do proprio EasyDental, especialmente no dominio odontologico.
- Ja existe divergencia documental registrada entre o DSN externo `SERVER=SONYVAIO\\EDS70, DATABASE=eds70` e a leitura executada em `INSPIRON-15\\SQLEXPRESS`, banco `EDS70`.
- Esta etapa e somente leitura.

## 2. Seguranca e limites

- Nenhuma query de escrita foi executada.
- Nenhum script `.sql` foi executado.
- Nenhum dado foi alterado no EasyDental.
- Nenhum dado foi alterado no Brana Cloud.
- Nenhum dado sensivel foi exposto de forma indevida.
- A blindagem textual / mojibake foi respeitada.

## 3. Metodo de descoberta

- As tabelas candidatas foram verificadas em `sys.tables` antes da analise.
- Tambem foi feita busca por padroes de nome com foco em:
  - `PROC`
  - `INTERV`
  - `DENT`
  - `ARC`
  - `FACE`
  - `ODONTO`
  - `HIST`
  - `CID`
  - `TAB`
  - `MATERIAL`
  - `SIMB`
  - `ESPEC`
  - `CONV`
  - `PLANO`
- O resultado mostrou tanto tabelas exatamente nomeadas quanto varias tabelas auxiliares / estruturais com prefixos `_`, `TAB_` e relacao odontologica direta.

## 4. Existencia das tabelas candidatas

| tabela candidata | existe | observacao |
|---|---:|---|
| `INTERVENCAO` | sim | tabela central do fluxo odontologico / clinico |
| `DENTE` | sim | estrutura associada ao odontograma |
| `ARCADA` | sim | estrutura associada ao odontograma |
| `HISTORICO` | sim | registro historico clinico, potencialmente sensivel |
| `CCPACIENTE` | sim | relacao financeira / contabil clinica |
| `CCCIRURGIAO` | sim | relacao financeira / cirurgiao / prestador |
| `CID_ITEM` | sim | tabela auxiliar de CID |
| `TABELA` | nao | nao encontrada como nome exato |
| `TABELA_ITEM` | nao | nao encontrada como nome exato |
| `PROCEDIMENTO` | nao | nao encontrada como nome exato |
| `PROCEDIMENTOS` | nao | nao encontrada como nome exato |
| `SERVICO` | nao | nao encontrada como nome exato |
| `SERVICOS` | nao | nao encontrada como nome exato |
| `ESPECIALIDADE` | nao | nao encontrada como nome exato; existe `_ESPECIALIDADE` |
| `PREST_ESP` | sim | relacao prestador / especialidade |
| `PRESTADOR` | sim | cadastro estrutural de prestador |
| `PLANO` | sim | plano / cobertura / convenio |
| `CONVENIO` | sim | convenio / operadora |
| `MATERIAL` | nao | nao encontrada como nome exato |
| `MATERIAIS` | nao | nao encontrada como nome exato |
| `SIMBOLO` | nao | nao encontrada como nome exato |
| `SIMBOLOS` | nao | nao encontrada como nome exato |
| `ODONTOGRAMA` | nao | nao encontrada como nome exato |
| `FACE` | sim | faces associadas a intervencoes |
| `REGIAO` | nao | nao encontrada como nome exato; existe `_TISS_REGIAO_PROCEDIMENTO` |
| `REGIOES` | nao | nao encontrada como nome exato |
| `ANAMNESE_RESP` | sim | respostas de anamnese, potencialmente sensivel |
| `ANAMNESE_PERG` | sim | perguntas de anamnese |
| `ANAMNESE_QUEST` | sim | questionarios de anamnese |
| `CUSTOMPAGE` | sim | estrutura de formularios / paginas clinicas |
| `CUSTOMCONTROL` | sim | estrutura de controles / formularios clinicos |
| `TRATAMENTO` | sim | tabela pai de tratamento clinico |
| `TRATAMENTO_COMISSAO` | sim | comissao vinculada a tratamento |
| `TAB_PRC` | sim | tabela de preco / tabela de procedimentos |
| `TAB_PRC_ITEM` | sim | itens da tabela de preco / procedimentos |
| `TAB_GEN_ITEM` | sim | procedimentos genericos estruturais |
| `TAB_GEN_ITEM_FASE` | sim | fases de procedimento generico |
| `TAB_GEN_ITEM_MAT` | sim | materiais ligados ao procedimento generico |
| `TAB_MAT` | sim | tabela de materiais |
| `TAB_MAT_ITEM` | sim | item de material / insumo |
| `TAB_PRT_ITEM` | sim | itens de proteses / servicos correlatos |
| `TAB_REPASSE` | sim | regras de repasse / comissao |
| `_ESPECIALIDADE` | sim | especialidades estruturais |
| `_FASE_PROCEDIMENTO` | sim | fases de procedimento estruturais |
| `_STATUS_INTERV` | sim | status da intervencao estruturais |
| `_SIMBOLO_ODONTO` | sim | simbolos odontologicos estruturais |
| `_SIMBOLO_ANOMALIA` | sim | simbolos de anomalia estruturais |
| `_TISS_REGIAO_PROCEDIMENTO` | sim | regioes TISS estruturais |
| `_TISS_TIPO_TABELA` | sim | tipo de tabela TISS estruturais |

## 5. Tabelas analisadas

- `INTERVENCAO`
- `DENTE`
- `ARCADA`
- `HISTORICO`
- `CCPACIENTE`
- `CCCIRURGIAO`
- `CID_ITEM`
- `PREST_ESP`
- `PRESTADOR`
- `PLANO`
- `CONVENIO`
- `FACE`
- `ANAMNESE_RESP`
- `ANAMNESE_PERG`
- `ANAMNESE_QUEST`
- `CUSTOMPAGE`
- `CUSTOMCONTROL`
- `TRATAMENTO`
- `TRATAMENTO_COMISSAO`
- `TAB_PRC`
- `TAB_PRC_ITEM`
- `TAB_GEN_ITEM`
- `TAB_GEN_ITEM_FASE`
- `TAB_GEN_ITEM_MAT`
- `TAB_MAT`
- `TAB_MAT_ITEM`
- `TAB_PRT_ITEM`
- `TAB_REPASSE`
- `_ESPECIALIDADE`
- `_FASE_PROCEDIMENTO`
- `_STATUS_INTERV`
- `_SIMBOLO_ODONTO`
- `_SIMBOLO_ANOMALIA`
- `_TISS_REGIAO_PROCEDIMENTO`
- `_TISS_TIPO_TABELA`

## 6. Contagens

| tabela | quantidade de registros | status | observacao preliminar |
|---|---:|---|---|
| `ARCADA` | 121266 | populada | volume muito alto; estrutura odontologica central |
| `HISTORICO` | 38413 | populada | historico clinico volumoso; pode misturar seed e uso operacional |
| `DENTE` | 22892 | populada | estrutura odontograma / arcadas por paciente e tratamento |
| `INTERVENCAO` | 16386 | populada | tabela central de intervencoes/procedimentos |
| `CCPACIENTE` | 16328 | populada | financeiro clinico / lancamentos |
| `CCCIRURGIAO` | 15381 | populada | financeiro / prestador / cirurgiao |
| `CID_ITEM` | 14486 | populada | tabela auxiliar CID populada |
| `ANAMNESE_RESP` | 15429 | populada | respostas clinicas por paciente; sensivel |
| `TAB_GEN_ITEM_MAT` | 1714 | populada | materiais ligados a procedimentos genericos |
| `TAB_MAT_ITEM` | 240 | populada | itens de material / insumo |
| `TAB_PRC_ITEM` | 698 | populada | tabela de preco com procedimentos cadastrados |
| `TAB_PRC` | 4 | populada | tabelas base de procedimentos / preco |
| `TAB_GEN_ITEM` | 482 | populada | procedimentos genericos estruturais |
| `TAB_PRT_ITEM` | 248 | populada | itens de proteses / servicos correlatos |
| `FACE` | 2827 | populada | faces odontologicas vinculadas a intervencao |
| `TRATAMENTO` | 3837 | populada | cabecalho de tratamento clinico |
| `TRATAMENTO_COMISSAO` | 17 | populada | comissao associada ao tratamento |
| `ANAMNESE_PERG` | 130 | populada | perguntas de anamnese |
| `ANAMNESE_QUEST` | 5 | populada | questionarios de anamnese |
| `CONVENIO` | 10 | populada | operadoras / convenios estruturados |
| `PLANO` | 10 | populada | planos vinculados a convenio |
| `PREST_ESP` | 27 | populada | relacao prestador / especialidade |
| `_ESPECIALIDADE` | 14 | populada | seeds de especialidade |
| `_FASE_PROCEDIMENTO` | 7 | populada | seeds de fases |
| `_STATUS_INTERV` | 3 | populada | seeds de status de intervencao |
| `_SIMBOLO_ODONTO` | 81 | populada | seeds de simbolos odontologicos |
| `_SIMBOLO_ANOMALIA` | 18 | populada | seeds de anomalias odontologicas |
| `_TISS_REGIAO_PROCEDIMENTO` | 56 | populada | seeds de regioes TISS |
| `_TISS_TIPO_TABELA` | 21 | populada | seeds de tipo de tabela TISS |
| `TAB_MAT` | 2 | populada | tabelas de materiais base |
| `TAB_REPASSE` | 2 | populada | regras de repasse / comissao |

## 7. Tabelas clinicas mais volumosas

- `ARCADA` - 121266
- `HISTORICO` - 38413
- `DENTE` - 22892
- `INTERVENCAO` - 16386
- `CCPACIENTE` - 16328
- `CCCIRURGIAO` - 15381
- `CID_ITEM` - 14486
- `ANAMNESE_RESP` - 15429
- `TRATAMENTO` - 3837
- `FACE` - 2827
- `TAB_GEN_ITEM_MAT` - 1714
- `TAB_PRC_ITEM` - 698
- `TAB_GEN_ITEM` - 482

## 8. Estrutura de INTERVENCAO

- Colunas principais observadas:
  - `NROPAC`
  - `NROINTPAC`
  - `NROTRA`
  - `ID_PRESTADOR`
  - `NROTAB`
  - `NROINT`
  - `DATCAD`
  - `DATFIN`
  - `STATUS`
  - `OBSERV`
  - `ORCAMENTO`
  - `VALOR_PACIENTE`
  - `VALOR_REPASSE`
  - `DATA_REPASSE`
  - `COD_GLOSA`
  - `MSG_AUTOR`
  - `SEQUENCIA`
  - `ID_INDICE_TAB`
  - `ID_INDICE_COMISSAO`
  - `TIPO_COMISSAO`
  - `CD_GUIA_TISS`
  - `S_DENTES`
  - `S_FACES`
- Chave primaria: composta em `NROPAC` + `NROINTPAC`.
- Indices observados:
  - `idxNroIntPac`
  - `idxNroPac`
  - `idxNroTra`
  - `IntervencaoNROTAB`
- Foreign keys formais:
  - `_INDICE` por `ID_INDICE_TAB`
  - `_INDICE` por `ID_INDICE_COMISSAO`
  - `_STATUS_INTERV` por `STATUS`
  - `PRESTADOR` por `ID_PRESTADOR`
  - `TAB_PRC_ITEM` por `NROTAB` + `NROINT`
  - `TRATAMENTO` por `NROTRA`
  - `USUARIO` por `USER_STAMP_INS` e `USER_STAMP_UPD`
- Amostra controlada:
  - estrutura de intervencao mostra associacao direta com tratamento, tabela de preco, prestador, usuario e status;
  - sample seguro indicou registros com `NROPAC`, `NROINTPAC`, `NROTRA`, `ID_PRESTADOR`, `NROTAB`, `NROINT`, `STATUS`, `ID_INDICE_TAB` e valores monetarios;
  - detalhes numericos sensiveis foram tratados com cautela documental.
- Interpretacao cautelosa:
  - a tabela parece seed estrutural central do modulo odontologico e, ao mesmo tempo, recebe um volume operacional muito alto.

## 9. Estrutura de DENTE

- Colunas principais:
  - `NROPAC`
  - `NROINTPAC`
  - `NRODEN`
  - `BITMAP`
- Chave primaria: `NROPAC` + `NROINTPAC` + `NRODEN`.
- Indices:
  - `idxNroDen`
  - `idxNrointpac`
  - `idxNropac`
- Foreign key formal:
  - `INTERVENCAO` por `NROPAC` + `NROINTPAC`
- Finalidade aparente:
  - mapeamento de dentes por paciente / intervencao, com bitmap de evento odontologico.
- Interpretacao cautelosa:
  - forte indicio de estrutura do odontograma.

## 10. Estrutura de ARCADA

- Colunas principais:
  - `NROPAC`
  - `NROTRA`
  - `NRODEN`
  - `NROODONTO`
  - `OBSERV`
  - `ANOMALIAS`
  - `MATRIZ3D_00` a `MATRIZ3D_33`
- Chave primaria: `NROPAC` + `NROTRA` + `NRODEN`.
- Indice:
  - `idxNroDen`
- Foreign key formal:
  - `TRATAMENTO` por `NROTRA`
- Finalidade aparente:
  - arcada odontologica com matriz tridimensional e marcacoes de anomalias.
- Interpretacao cautelosa:
  - parece estrutura nativa de odontograma / arcada.

## 11. Estrutura de HISTORICO

- Colunas principais:
  - `REGISTRO`
  - `NROPAC`
  - `NROINTPAC`
  - `DATA`
  - `DESCRICAO`
  - `NRODENTE`
  - `ID_PRESTADOR`
  - `COR`
  - `USER_STAMP_INS`
  - `TIME_STAMP_INS`
  - `USER_STAMP_UPD`
  - `TIME_STAMP_UPD`
- Chave primaria: `REGISTRO`.
- Indice:
  - `idxNroPac`
- Foreign keys formais:
  - `INTERVENCAO` por `NROPAC` + `NROINTPAC`
  - `PESSOAL` por `NROPAC`
  - `PRESTADOR` por `ID_PRESTADOR`
  - `USUARIO` por `USER_STAMP_INS` e `USER_STAMP_UPD`
- Finalidade aparente:
  - historico clinico ou operacional ligado ao paciente / intervencao.
- Cautela:
  - a tabela e sensivel; amostras foram tratadas sem expor dados pessoais.

## 12. Estrutura de CID_ITEM

- Colunas principais:
  - `REGISTRO`
  - `CODIGO`
  - `NOME`
  - `PREFERIDO`
  - `OBSERV`
- Chave primaria: `REGISTRO`.
- Indices:
  - `idxCODIGO`
  - `idxNOME`
- Finalidade aparente:
  - seed auxiliar de CID para apoio clinico.
- Interpretacao cautelosa:
  - parece tabela estrutural populada de referencia, nao registro transacional.

## 13. Estrutura de tabelas de procedimentos / tabelas de preco

### `TAB_PRC`

- Colunas principais:
  - `NROTAB`
  - `NOME`
  - `TIPO`
  - `NROIND`
  - `NROCONV`
  - `NROCRED`
  - `INATIVO`
  - `ID_TAB_PRC`
  - `ID_TIPO_TABELA`
- Chave primaria: `NROTAB`.
- Indice:
  - `idxNome`
- Foreign keys:
  - `_INDICE`
  - `_TISS_TIPO_TABELA`
- Amostra controlada:
  - `EASY - Particular`
  - `PARTICULAR`
  - `UNIMED-ODONTO`
  - `Caixa Econ. Federal`
- Interpretacao cautelosa:
  - parece tabela base de precificacao / catalogacao de procedimentos.

### `TAB_PRC_ITEM`

- Colunas principais:
  - `NROTAB`
  - `NROPROCTAB`
  - `CODCONV`
  - `DESCRICAO`
  - `NROSIM`
  - `ESPECIAL`
  - `VALOR_REPASSE`
  - `VALOR_PACIENTE`
  - `TIPOCOBR`
  - `OBSERV`
  - `INATIVO`
  - `MOSTRAR_SIMBOLO`
  - `GARANTIA`
  - `PREFERIDO`
  - `ID_PRC_TAB`
  - `ID_TAB_PRC`
  - `ID_PRC_GEN`
- Chave primaria: `NROTAB` + `NROPROCTAB`.
- Indice:
  - `idxDescricao`
- Foreign keys:
  - `TAB_PRC`
  - `_ESPECIALIDADE`
  - `_SIMBOLO_ODONTO`
- Amostra controlada:
  - `Coroa metalo-ceramica`
  - `Coroa metalo-plastica`
  - `Restauracao metalica-fundida`
- Interpretacao cautelosa:
  - parece tabela operacional de precos/procedimentos da area odontologica.

### `TAB_GEN_ITEM`

- Colunas principais:
  - `ID_PRC_GEN`
  - `CODIGO`
  - `NOME`
  - `ID_SIMBOLO`
  - `ID_ESPECIALIDADE`
  - `INATIVO`
  - `MOSTRAR_SIMBOLO`
  - `TEMPO`
  - `TIPO_EVENTO`
  - `PESO`
  - `CUSTO_PROTETICO`
  - `CUSTO_MATERIAL`
  - `OBSERV`
  - stamps de usuario / tempo
- Chave primaria: `ID_PRC_GEN`.
- Foreign keys:
  - `_ESPECIALIDADE`
  - `_SIMBOLO_ODONTO`
  - `USUARIO` nos stamps
- Amostra controlada:
  - `Abertura e drenagem cirurgica de abscesso`
  - `Adequacao de meio bucal`
  - `Adequacao do meio bucal com ionomero de vidro`
- Interpretacao cautelosa:
  - seed odontologico generico com forte cara de catalogo estrutural.

### `TAB_GEN_ITEM_FASE`

- Colunas principais:
  - `ID_REGISTRO`
  - `ID_PRC_GEN`
  - `ID_FASE`
  - `NROSEQ`
  - `TEMPO`
- Foreign keys:
  - `_FASE_PROCEDIMENTO`
  - `TAB_GEN_ITEM`
- Interpretacao cautelosa:
  - relaciona procedimento generico a fases e tempo.

### `TAB_GEN_ITEM_MAT`

- Colunas principais:
  - `ID_PRC_GEN`
  - `ID_MATERIAL`
  - `QTD_MEDIA`
  - `CUSTO_MEDIO`
- Foreign keys:
  - `TAB_GEN_ITEM`
  - `TAB_MAT_ITEM`
- Interpretacao cautelosa:
  - liga procedimento generico a materiais / custo medio.

### `TAB_MAT` e `TAB_MAT_ITEM`

- `TAB_MAT`:
  - `ID_TAB_MAT`
  - `NOME`
  - `NROIND`
  - `RESERVADO`
  - parece tabela de agrupamento de materiais.
- `TAB_MAT_ITEM`:
  - `ID_MATERIAL`
  - `ID_TAB_MAT`
  - `CODIGO`
  - `NOME`
  - `TIPO`
  - `VALOR_CUSTO`
  - `UNID_CONSUMO`
  - `UNID_COMPRA`
  - `QTD_COMPRA`
  - `VALIDADE`
  - `OBSERV`
  - `PREFERIDO`
  - `NROFAB`
  - `APRESENT`
  - `CUSTO_INICIAL`
  - FKs para `TAB_MAT` e tabelas auxiliares de fabricante / tipo / unidade.
- Interpretacao cautelosa:
  - material e insumo estruturais, com custo e apresentacao.

### `TAB_PRT_ITEM`

- Colunas principais:
  - `NROPRO`
  - `NROSER`
  - `DESCRICAO`
  - `NROIND`
  - `PRECO`
  - `PRAZO`
- Foreign keys:
  - `_INDICE`
  - tabela de contatos / suporte protesico por `NROPRO`
- Interpretacao cautelosa:
  - aparenta tabela de itens proteticos / servicos correlatos.

### `TAB_REPASSE`

- Colunas principais:
  - `ID_FATOR_REPASSE`
  - `ID_CONVENIO`
  - `ID_PRESTADOR`
  - `ID_ESPECIALIDADE`
  - `ID_PRC_GEN`
  - `TIPO`
  - `VALOR`
  - `VIGENCIA`
  - stamps
- Foreign keys:
  - `_ESPECIALIDADE`
  - `CONVENIO`
  - `PRESTADOR`
  - `TAB_GEN_ITEM`
  - `USUARIO`
- Interpretacao cautelosa:
  - regra de repasse / comissao ligada ao contexto clinico.

## 14. Estrutura de especialidades / prestadores

### `PREST_ESP`

- Relaciona `ID_PRESTADOR` e `ID_ESPECIALIDADE`.
- Funciona como tabela ponte entre prestador e especialidade.
- Mostra que especialidade e prestador se cruzam formalmente.

### `PRESTADOR`

- Tabela existe e esta populada.
- Aparece como entidade estrutural do sistema.
- E referenciada por `USUARIO`, `INTERVENCAO`, `HISTORICO`, `TRATAMENTO`, `TAB_REPASSE`, `USUARIO_PERFIL` e outros fluxos.
- Interpretação cautelosa:
  - parece haver prestadores estruturais e nao apenas prestadores comerciais.

### `CONVENIO` e `PLANO`

- `CONVENIO` contem cadastros como `Particular`, `Sindicato`, `Bradesco`, `Banco do Brasil` e `Caixa Econ. Federal`.
- `PLANO` contem planos derivados do convenio, com `NOME = Principal` em varias linhas.
- Isso reforca a natureza estrutural dos seeds de cobertura / atendimento.

## 15. Estrutura de simbolos / odontograma / face / regiao

### `_SIMBOLO_ODONTO`

- 81 registros.
- Campos:
  - `NROSIM`
  - `DESCRICAO`
  - `ESPECIAL`
  - `TIPMARCA`
  - `TIPSIMB`
  - `SOBREPOS`
  - `ICONE`
  - `BITMAP1`
  - `BITMAP2`
  - `BITMAP3`
- Exemplos estruturais:
  - `Coroa`
  - `Restauracao metalica-fundida`
  - `Selante`
  - `Restauracao`
  - `Protese parcial fixa`
- Interpretacao:
  - seed grafico / clinico do odontograma.

### `_SIMBOLO_ANOMALIA`

- 18 registros.
- Estrutura semelhante a simbolos odontologicos, com marcador de anomalia.
- Exemplos:
  - `Dente semi-incluso`
  - `Dente incluso`
  - `Dente incluso-impactado`
  - `Descalcificacao`
  - `Migracao distal`
- Interpretacao:
  - seed estrutural de anomalias odontologicas.

### `FACE`

- 2827 registros.
- Campos:
  - `NROPAC`
  - `NROINTPAC`
  - `NRODEN`
  - `FACE1` a `FACE5`
- FK para `INTERVENCAO`.
- Interpretacao:
  - estrutura de faces do odontograma, com flags binarios por face.

### `_TISS_REGIAO_PROCEDIMENTO`

- 56 registros.
- Campos:
  - `ID_MNEMONICO`
  - `CD_MNEMONICO`
  - `TX_REGIAO`
  - `TX_DESCRICAO`
  - `ID_FORMA_MARCACAO`
  - `FL_ODONTOGRAMA`
  - `BITMASK`
- Exemplos:
  - `rmpe`
  - `rmpd`
  - `as`
  - `ai`
  - `hasd`
- Interpretacao:
  - seed de regiao / marcacao TISS para odontograma e procedimentos.

## 16. Estrutura de anamnese e formularios clinicos

### `ANAMNESE_QUEST`

- 5 registros.
- Nomes:
  - `Principal`
  - `Implante`
  - `Ficha complementar`
  - `Anamnese de Saude`
  - `Anamnese pessoal`
- Interpretação:
  - questionarios estruturais de entrada clinica.

### `ANAMNESE_PERG`

- 130 registros.
- Campos:
  - `NROQUE`
  - `NROPER`
  - `TIPRES`
  - `TIPPER`
  - `TEXPER`
  - `TEXMEN`
- Amostra controlada:
  - `Esta bem de saude no momento?`
  - `Quando fez seu ultimo tratamento medico?`
  - `Esta atualmente em tratamento medico?`
  - `Apresenta alergia a medicamentos? Quais?`
  - `Possui alguma doenca grave? Qual?`
- Interpretacao:
  - perguntas clinicas estruturais, com redacao de usuario final ja embarcada.

### `ANAMNESE_RESP`

- 15429 registros.
- Campos:
  - `NROPAC`
  - `NROQUE`
  - `NROPER`
  - `RESPOSTA`
  - `COMPLEM`
- Amostra controlada:
  - apenas resposta numerica e comprimento de complemento foram observados nesta etapa;
  - dados pessoais / clinicos nao foram reproduzidos.
- Interpretacao:
  - respostas clinicas por paciente, fortemente sensivel.

## 17. Relacao com CUSTOMPAGE / CUSTOMCONTROL

- `CUSTOMPAGE` e `CUSTOMCONTROL` continuam parecendo a camada de formulario / interface clinica observada na Subetapa 4.
- A combinacao dos nomes de pagina e captions sugere formularios como:
  - semiologia
  - vitalidade
  - exames radiograficos
  - diagnostico
  - odontometria
  - tratamento conservador
  - pos-operatorio
  - livre
- Relacao com a Subetapa 5:
  - e uma relacao inferida, mas consistente com o dominio odontologico e com os seeds de procedimento / anamnese.

## 18. Relacionamentos formais encontrados

- `INTERVENCAO` -> `_INDICE`, `_STATUS_INTERV`, `PRESTADOR`, `TAB_PRC_ITEM`, `TRATAMENTO`, `USUARIO`
- `DENTE` -> `INTERVENCAO`
- `ARCADA` -> `TRATAMENTO`
- `FACE` -> `INTERVENCAO`
- `HISTORICO` -> `INTERVENCAO`, `PESSOAL`, `PRESTADOR`, `USUARIO`
- `CCPACIENTE` -> `PESSOAL`, `PARCELA`, `TRATAMENTO`, `USUARIO`, `_INDICE`, `_PLANO_CONTA`, `_TIPO_COBRANCA`, `_TIPO_PAGTO`
- `CCCIRURGIAO` -> `CCPACIENTE`, `USUARIO`, `_INDICE`, `_PLANO_CONTA`, `_STATUS_CCCIR`
- `TRATAMENTO` -> `CONVENIO`, `PESSOAL`, `PRESTADOR`, `TAB_PRC`, `UNIDADE`, `USUARIO`, `_INDICE`, `_STATUS_PT`, `_TISS_TIPO_ATENDIMENTO`
- `TRATAMENTO_COMISSAO` -> `TRATAMENTO`
- `TAB_PRC` -> `_INDICE`, `_TISS_TIPO_TABELA`
- `TAB_PRC_ITEM` -> `TAB_PRC`, `_ESPECIALIDADE`, `_SIMBOLO_ODONTO`
- `TAB_GEN_ITEM` -> `_ESPECIALIDADE`, `_SIMBOLO_ODONTO`, `USUARIO`
- `TAB_GEN_ITEM_FASE` -> `_FASE_PROCEDIMENTO`, `TAB_GEN_ITEM`
- `TAB_GEN_ITEM_MAT` -> `TAB_GEN_ITEM`, `TAB_MAT_ITEM`
- `TAB_MAT` -> `_INDICE`
- `TAB_MAT_ITEM` -> `TAB_MAT`, `_FABRICANTE`, `_TIPO_MAT`, `_UNID_MEDIDA`
- `TAB_REPASSE` -> `CONVENIO`, `PRESTADOR`, `TAB_GEN_ITEM`, `_ESPECIALIDADE`, `USUARIO`
- `PREST_ESP` -> `PRESTADOR`, `_ESPECIALIDADE`
- `UNIDADE` -> `USUARIO` pelos campos de auditoria
- `USUARIO` -> `_TIPO_USUARIO`, `PRESTADOR`, `UNIDADE`
- `USUARIO_PERFIL` -> `USUARIO`, `PRESTADOR`, `SIS_PERFIL`
- `USUARIO_MODULO` -> `USUARIO`, `SIS_MODULO`
- `USUARIO_FUNCAO` -> `USUARIO`, `SIS_FUNCAO`

## 19. Relacionamentos inferidos

- `INTERVENCAO` parece ser o centro operacional que amarra tratamento, tabela de preco, prestador, usuario e status.
- `DENTE`, `FACE` e `ARCADA` parecem variar em torno do mesmo eixo odontografico.
- `TAB_GEN_ITEM`, `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_MAT`, `TAB_MAT_ITEM`, `TAB_REPASSE` e `TAB_GEN_ITEM_MAT` formam uma malha de procedimentos, custos, materiais e repasse.
- `ANAMNESE_QUEST`, `ANAMNESE_PERG` e `ANAMNESE_RESP` formam o fluxo de entrada clinica.
- `CUSTOMPAGE` / `CUSTOMCONTROL` parecem suportar formulários clínicos que conversam com anamnese e procedimentos.
- `CONVENIO` / `PLANO` parecem estruturar cobertura e regras comerciais.

## 20. Registros proprios / estruturais provaveis

- Seeds odontologicos de `INTERVENCAO`, `TAB_GEN_ITEM`, `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_MAT`, `TAB_MAT_ITEM`, `TAB_PRT_ITEM`, `TAB_REPASSE`.
- Estruturas nativas de odontograma: `DENTE`, `ARCADA`, `FACE`, `_SIMBOLO_ODONTO`, `_SIMBOLO_ANOMALIA`, `_TISS_REGIAO_PROCEDIMENTO`.
- Seeds clinicos de apoio: `CID_ITEM`, `_ESPECIALIDADE`, `_FASE_PROCEDIMENTO`, `_STATUS_INTERV`, `_TISS_TIPO_TABELA`.
- Estruturas de formulario: `CUSTOMPAGE`, `CUSTOMCONTROL`, `ANAMNESE_QUEST`, `ANAMNESE_PERG`.
- Registro operacional e financeiro com alto potencial de ser estrutural: `TRATAMENTO`, `CCPACIENTE`, `CCCIRURGIAO`, `HISTORICO`.
- Prestador estrutural e relacoes de especialidade: `PRESTADOR`, `PREST_ESP`.

## 21. Comparacao preliminar com necessidade futura do Brana Cloud

- O Brana Cloud provavelmente hoje nasce com menos estrutura odontologica do que o EasyDental virgem de referencia.
- Uma nova conta / clinica no Brana pode precisar nascer com seeds odontologicos mais completos para evitar lacunas em Intervencoes / Procedimentos.
- A tabela / conceito de `PARTICULAR` deve ser avaliada separadamente, sem assumir que deve receber os mesmos seeds financeiros ou de tabela do EasyDental.
- Contas existentes nao devem ser alteradas automaticamente.
- Procedimentos com preco exigem cuidado para nao importar valores indevidos.
- Estruturas odontologicas podem ser globais ou por conta; essa decisao ainda e futura.
- Deve-se separar o que e estrutura odontologica obrigatoria do que e dado comercial / configuravel.

## 22. Impacto futuro provavel no Brana Cloud

- Seeds odontologicos podem precisar nascer por nova conta.
- Seeds globais podem precisar ficar protegidos contra exclusao.
- Tabelas estruturais podem precisar ser bloqueadas para nao quebrar o fluxo odontologico.
- Alguns registros devem permanecer editaveis apenas em administracao.
- Sem esses registros, ha risco de tela vazia, odontograma incompleto, tabela de preco vazia ou fluxo de procedimento sem suporte.

## 23. Limitacoes

- A identidade fisica da base ainda nao foi plenamente comprovada em relacao a `\\Sonyvaio\\c\\EDS70`.
- Ha relacoes sem FK formal em algumas areas auxiliares.
- Dados foram mascarados onde havia risco de sensibilidade.
- Nao e possivel concluir a decisao definitiva para o Brana Cloud sem comparacao profunda futura.
- Algumas tabelas candidatas nao existem com o nome exato esperado.
- Esta etapa nao decide implementacao.

## 24. Conclusao cautelosa

- O EasyDental parece nascer com um conjunto odontologico rico e fortemente estruturado, com tabelas de intervencao, odontograma, tabelas de preco, materiais, simbolos e anamnese ja populadas.
- `INTERVENCAO` e a tabela central do fluxo clinico / odontologico.
- `DENTE`, `ARCADA` e `FACE` formam o eixo de odontograma.
- `TAB_PRC`, `TAB_PRC_ITEM`, `TAB_GEN_ITEM`, `TAB_GEN_ITEM_MAT` e `TAB_MAT_ITEM` indicam seeds estruturais de procedimento e material.
- `ANAMNESE_*` e `CUSTOMPAGE` / `CUSTOMCONTROL` indicam que a interface e a coleta clinica ja nascem preparadas.
- Isso ajuda a futura regra de nascimento de nova conta / clinica no Brana Cloud, porque permite separar o que e seed estrutural do que e dado operacional.

## 25. Proxima subetapa recomendada

- `EasyDental virgem - Subetapa 6 - comparacao documental inicial com seeds atuais do Brana Cloud, sem implementacao`

## 26. Plano de testes / verificacao

- Somente este documento novo e o roadmap devem ser alterados.
- Nenhum codigo deve ser alterado.
- `frontend/app.js` nao deve ser alterado.
- `frontend/index.html` nao deve ser alterado.
- `frontend/js/modules` nao deve ser alterado.
- `backend` nao deve ser alterado.
- `banco/schema/migrations/seeds/endpoints` nao devem ser alterados.
- Nenhum arquivo do EasyDental deve ser alterado.
- Nenhuma query de escrita deve ser executada.
- Nenhum script `.sql` deve ser executado.
- Nenhum dado sensivel deve ser exposto indevidamente.
- A blindagem textual / mojibake deve ser respeitada.
