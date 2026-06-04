# Odontograma EasyDental - Validacao documental de DENTE, FACE e _STATUS_INTERV

## 1. Objetivo

Validar, em modo somente leitura, o papel real de `DENTE`, `FACE` e `_STATUS_INTERV` no EasyDental em uso, usando pacientes e tratamentos que realmente possuem `INTERVENCAO`.

O foco desta etapa e reduzir as ultimas incertezas antes de qualquer futura implementacao do odontograma Brana.

## 2. Escopo

- Nao e implementacao
- Nao e migration
- Nao e endpoint
- Nao e tela
- Nao altera banco
- Nao altera codigo
- Nao altera frontend
- Nao altera backend
- Nao altera seeds
- Nao altera arquivos do EasyDental
- Nao mexe em `app.js`
- Nao mexe em JS, HTML, CSS ou Python

## 3. Confirmacao de etapa somente documental/investigativa

- Foram executadas apenas consultas de leitura e introspecao de schema
- Nenhum `UPDATE`, `DELETE`, `INSERT`, `ALTER`, `DROP`, `CREATE` ou `TRUNCATE` foi executado
- Nenhum dado do Brana foi modificado
- Nenhum dado do EasyDental foi modificado
- Nenhuma migration foi criada ou aplicada

## 4. Classificacao do modulo

- Odontograma = modulo especifico de Odontologia
- Nao tratar como modulo core/comum
- Sem controle multiarea nesta etapa

## 5. Base e documentos consultados

- `docs/odontograma_easydental_auditoria_armazenamento_estados_cores_tabelas.md`
- `docs/odontograma_easydental_diagrama_relacional_contrato_modelagem_brana.md`
- `docs/odontograma_easydental_diagramas_mermaid.md`
- `docs/odontograma_brana_contrato_modelagem_futura.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Base de dados usada na investigacao:
- Servidor: `INSPIRON-15\SQLEXPRESS`
- Base: `EDS70`

Observacao:
- O documento de aprofundamento citado em etapa anterior nao existe no workspace com esse nome.
- Esta validacao usa somente documentos realmente existentes.

## 6. Metodologia de consulta

- Inspecao de schema com `sys.tables`, `sys.columns` e `sys.foreign_keys`
- Contagem total de registros por tabela
- Agrupamento por `STATUS`, `NROTRA`, `NROPAC` e `NROINTPAC`
- Cruzamento de `INTERVENCAO` com `DENTE`, `FACE`, `HISTORICO`, `TAB_PRC_ITEM`, `PRESTADOR` e `_STATUS_INTERV`
- Amostras tecnicas sem nomes completos de pacientes
- Uso de IDs tecnicos sempre que possivel
- Nenhuma escrita no banco

## 7. Casos tecnicos analisados

### Caso A - simples

- `tratamento_id`: `11`
- `paciente_id`: `7`
- `total_intervencoes`: `1`
- `status`: somente `Realizada`
- `ARCADA`: `32` linhas
- `DENTE`: `0` linhas
- `FACE`: `1` linha
- `HISTORICO`: `1` linha

### Caso B - multiplo com mistura de DENTE, FACE e HISTORICO

- `tratamento_id`: `638`
- `paciente_id`: `271`
- `total_intervencoes`: `46`
- `status`: `30 Observada`, `15 Realizada`, `1 Realizar`
- `ARCADA`: `32` linhas
- `DENTE`: `40` linhas em `14` intervencoes
- `FACE`: `28` linhas em `28` intervencoes
- `HISTORICO`: `15` linhas em `15` intervencoes

### Caso C - multiplo com variedade de status

- `tratamento_id`: `3025`
- `paciente_id`: `726`
- `total_intervencoes`: `55`
- `status`: `18 Observada`, `36 Realizada`, `1 Realizar`
- `ARCADA`: `32` linhas
- `DENTE`: `78` linhas em `50` intervencoes
- `FACE`: `4` linhas em `4` intervencoes
- `HISTORICO`: `36` linhas em `36` intervencoes

### Caso D - multiplo com status variados e combinacao visual/narrativa

- `tratamento_id`: `4035`
- `paciente_id`: `1576`
- `total_intervencoes`: `54`
- `status`: `22 Observada`, `1 Realizada`, `31 Realizar`
- `ARCADA`: `32` linhas
- `DENTE`: `57` linhas em `18` intervencoes
- `FACE`: `34` linhas em `34` intervencoes
- `HISTORICO`: `1` linha em `1` intervencao

## 8. Estrutura e papel de _STATUS_INTERV

### Estrutura encontrada

| coluna | tipo | observacao |
| --- | --- | --- |
| `REGISTRO` | `int` | chave primaria / id do status |
| `CODIGO` | `varchar(20)` | codigo curto do status |
| `NOME` | `varchar(255)` | descricao legivel do status |
| `RESERVADO` | `smallint` | flag auxiliar, sem papel claro na amostra |

### Registros encontrados

| id | codigo | descricao | intervencoes usando o status | interpretacao tecnica | certeza |
| --- | --- | --- | --- | --- | --- |
| `1` | `CO` | `Observada` | `2596` | estado observado / em acompanhamento | media-alta |
| `2` | `FN` | `Realizada` | `8886` | procedimento executado | alta |
| `3` | `RE` | `Realizar` | `4918` | procedimento planejado / pendente | media-alta |

### Leitura tecnica

- `INTERVENCAO.STATUS` aponta para `_STATUS_INTERV.REGISTRO`
- Nao foi encontrada categoria explicitamente nomeada como cancelado
- Nao foram encontrados campos de cor, ordem ou inativo na tabela, apenas `RESERVADO`
- Em `INTERVENCAO`, o status `2` quase sempre aparece com `DATFIN` preenchido
- Os status `1` e `3` aparecem majoritariamente com `DATFIN` nulo

### Distribuicao observada em `INTERVENCAO`

- `1 Observada`: `2596` linhas, `2593` com `DATFIN` nulo
- `2 Realizada`: `8886` linhas, `8886` com `DATFIN` preenchido
- `3 Realizar`: `4918` linhas, `4917` com `DATFIN` nulo

## 9. Estrutura e papel de DENTE

### Estrutura encontrada

| coluna | tipo | observacao |
| --- | --- | --- |
| `NROPAC` | `int` | paciente |
| `NROINTPAC` | `int` | intervencao vinculada |
| `NRODEN` | `smallint` | numero/posicao do dente no legado |
| `BITMAP` | `varchar(20)` | chave textual de bitmap / desenho |

### Papel observado

- `DENTE` se liga diretamente a `INTERVENCAO` por `NROPAC` + `NROINTPAC`
- Nao foi encontrada FK direta com `TRATAMENTO` ou `ARCADA`
- A tabela guarda 23.077 linhas
- Existem 10.098 intervencoes com pelo menos uma linha em `DENTE`
- `NRODEN` usa 32 valores distintos, em faixa de `1` a `32`
- `BITMAP` usa chaves textuais de desenho; foram encontrados 245 valores distintos
- O padrao mais frequente inclui chaves como `sim_BRA`, `arc_BRACKET_s`, `arc_RASPAGEM_s`, `arc_TOTAL2_s`, `sim_PROV`

### Leitura tecnica

- `DENTE` nao parece ser redundante com `ARCADA`
- A granularidade e por intervencao, nao por tratamento
- O volume medio e de `2,29` linhas por intervencao vinculada
- O maximo observado por intervencao foi `16` linhas
- `DENTE` parece representar marcacao/estado de dente com apoio visual, nao apenas entidade anatomica pura

## 10. Estrutura e papel de FACE

### Estrutura encontrada

| coluna | tipo | observacao |
| --- | --- | --- |
| `NROPAC` | `int` | paciente |
| `NROINTPAC` | `int` | intervencao vinculada |
| `NRODEN` | `smallint` | referencia do dente/posicao |
| `FACE1`..`FACE5` | `smallint` | flags das faces |

### Papel observado

- `FACE` se liga diretamente a `INTERVENCAO` por `NROPAC` + `NROINTPAC`
- Nao foi encontrada FK direta com `TRATAMENTO` ou `ARCADA`
- A tabela guarda 2.844 linhas
- Existem 2.844 intervencoes com pelo menos uma linha em `FACE`
- Em toda a base analisada, cada intervencao com `FACE` tem exatamente uma linha em `FACE`
- Foram encontrados 30 padroes distintos de flags nas cinco colunas de face
- Os valores observados nas flags sao apenas `0` e `-1`

### Leitura tecnica

- `FACE` parece uma linha unica de marcacao por intervencao, com flags internas
- `FACE` nao apareceu junto com `DENTE` na mesma intervencao nesta base
- O volume medio e exatamente `1,00` linha por intervencao vinculada
- A cardinalidade observada e `INTERVENCAO -> FACE` como `0..1` por intervencao

## 11. Cruzamento INTERVENCAO x DENTE x FACE x _STATUS_INTERV

### Resultado global

- `INTERVENCAO` total: `16400`
- Intervencoes com `DENTE`: `10098`
- Intervencoes com `FACE`: `2844`
- Intervencoes com `HISTORICO` ligado: `8499`
- Intervencoes com `DENTE` e `FACE` ao mesmo tempo: `0`
- Intervencoes com `DENTE` e `HISTORICO`: `3913`
- Intervencoes com `FACE` e `HISTORICO`: `1557`
- Intervencoes com os tres ao mesmo tempo: `0`

### Amostras representativas

| tratamento_id | intervencao_id | status | procedimento | prestador | dente | face | historico | leitura |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `11` | `123` | `Realizada` | `Restauração em Resina Direta - (2 Faces)` | `Tel` | `0` | `1` | `1` | caso simples com FACE e HISTORICO |
| `638` | `3149` | `Realizada` | `Tratamento de Canal - (Molares)` | `Clínica` | `1` | `0` | `1` | caso com DENTE e HISTORICO |
| `4035` | `18749` | `Realizada` | `Consulta Inicial para Exame clínico` | `Tel` | `0` | `0` | `1` | narrativa sem DENTE/FACE |
| `4035` | `18750` | `Realizar` | `Raspagem Supra-gengival - (por segmento)` | `Tel` | `1` | `0` | `0` | marcacao por DENTE, sem HISTORICO |
| `4035` | `18753` | `Observada` | `Restauração de Amálgama - 1 face` | `Tel` | `0` | `1` | `0` | marcacao por FACE, sem DENTE |

### Leitura tecnica

- `DENTE` e `FACE` nao aparecem juntos na mesma intervencao nesta base
- Isso reforca que sao camadas distintas de detalhamento
- `HISTORICO` pode acompanhar tanto `DENTE` quanto `FACE`, mas nao os obriga
- O modelo futuro do Brana nao deve assumir DENTE e FACE como colunas dependentes da mesma linha

## 12. Cardinalidades observadas

### TRATAMENTO x ARCADA

- Cardinalidade observada: `1 : 32`
- Total de tratamentos: `3837`
- Total de linhas em `ARCADA`: `122784`
- `ARCADA` por tratamento: sempre `32` linhas
- `ARCADA.NRODEN` tambem tem 32 valores distintos por tratamento

### TRATAMENTO x INTERVENCAO

- Cardinalidade observada: `1 : 0..N`
- Total de tratamentos: `3837`
- Tratamentos com pelo menos uma intervencao: `3809`
- Tratamentos sem intervencao: `28`
- Total de intervencoes: `16400`
- Minimo por tratamento: `0`
- Maximo por tratamento: `88`
- Media por tratamento: `4,27`

### INTERVENCAO x DENTE

- Cardinalidade observada: `1 : 0..N`
- Intervencoes com DENTE: `10098`
- Total de linhas em DENTE: `23077`
- Minimo por intervencao vinculada: `1`
- Maximo por intervencao vinculada: `16`
- Media por intervencao vinculada: `2,29`

### INTERVENCAO x FACE

- Cardinalidade observada: `1 : 0..1`
- Intervencoes com FACE: `2844`
- Total de linhas em FACE: `2844`
- Minimo por intervencao vinculada: `1`
- Maximo por intervencao vinculada: `1`
- Media por intervencao vinculada: `1,00`

### INTERVENCAO x _STATUS_INTERV

- Cardinalidade observada: `N : 1`
- `INTERVENCAO.STATUS` referencia `_STATUS_INTERV.REGISTRO`
- Somente tres status foram encontrados na tabela

### INTERVENCAO x HISTORICO

- Cardinalidade observada: `1 : 0..N`
- `HISTORICO` total: `38432`
- Linhas com `NROINTPAC` nulo: `29929`
- Linhas com `NROINTPAC` preenchido: `8503`
- Intervencoes distintas com historico ligado: `8499`
- Minimo por intervencao vinculada: `1`
- Maximo por intervencao vinculada: `3`
- Media por intervencao vinculada: `1,00` arredondado

## 13. Fatos confirmados

- `ARCADA` e filha de `TRATAMENTO` e nao de `INTERVENCAO`
- `ARCADA` guarda sempre 32 linhas por tratamento na base analisada
- `INTERVENCAO` e a tabela central de procedimentos
- `INTERVENCAO.STATUS` referencia `_STATUS_INTERV.REGISTRO`
- `_STATUS_INTERV` tem somente `Observada`, `Realizada` e `Realizar`
- Nao foi encontrado status cancelado ou equivalente explicito nessa tabela
- `DENTE` e `FACE` ligam diretamente a `INTERVENCAO`
- `DENTE` e `FACE` nao ligam diretamente a `ARCADA`
- `DENTE` e `FACE` nao aparecem juntos na mesma intervencao nesta base
- `FACE` e uma linha unica com cinco flags, nao uma tabela de multiplas linhas por face
- `DENTE` usa bitmap textual de apoio visual
- `HISTORICO` e em grande parte independente do vinculo com intervencao
- `INTERVENCAO.S_DENTES` e `INTERVENCAO.S_FACES` existem, mas ficaram todas `NULL` na base analisada

## 14. Inferencias

- `DENTE` deve ser tratado como detalhamento clinico/visual por intervencao, nao como copia de `ARCADA`
- `FACE` parece ser uma camada compacta de flags por intervencao
- O modelo legado prefere uma intervencao com uma ou outra camada de detalhe, nao ambas ao mesmo tempo
- `HISTORICO` continua sendo narrativa clinica/textual e nao substitui a intervencao
- O contrato futuro do Brana deve preservar `DENTE` e `FACE` como estruturas separadas e nao como simples atributos de `ARCADA`
- A ausencia de qualquer uso de `S_DENTES` e `S_FACES` sugere que esses campos nao devem guiar a modelagem futura sem nova evidencia

## 15. Impacto sobre o contrato futuro do Brana

### O que ficou reforcado

- `ARCADA` continua sendo uma entidade propria de slots visuais
- `INTERVENCAO` continua sendo a entidade central de procedimento
- `DENTE` e `FACE` precisam existir como camadas separadas de detalhe
- `HISTORICO` deve continuar separado de procedimento executado
- `STATUS` de intervencao precisa de camada propria

### O que talvez precise de ajuste

- O futuro contrato do Brana nao deve assumir `DENTE` e `FACE` juntos na mesma linha de intervencao
- `FACE` pode ser uma entidade compacta com flags, e nao uma colecao de linhas
- O suporte a cor e bitmap continua sem campo mestre unico

### O que passa a ser obrigatorio antes de codificar

- validar `DENTE` e `FACE` em pacientes com intervencoes reais
- validar `STATUS` reais em `_STATUS_INTERV`
- validar como planejado, observado e executado aparecem visualmente
- validar se o Brana possui tratamento compativel com odontologia
- validar o vinculo com o catalogo de procedimentos do Brana

### O que o contrato futuro deve respeitar

- futura implementacao deve seguir padrao modularizado no backend e frontend
- evitar monolitos
- separar arquivos e responsabilidades por camada

## 16. Riscos restantes antes da primeira implementacao

- Cardinalidade real pode variar em outras bases ou versoes
- `DENTE` e `FACE` ainda podem ter usos pontuais fora do padrao observado
- A ausencia de overlap entre `DENTE` e `FACE` pode ser regra do legado ou efeito da amostra
- A portabilidade de bitmap e simbolo ainda precisa validacao propria
- A regra visual pode depender da aplicacao, nao apenas do banco
- A migracao de dados pode exigir etapa separada
- Integracao com procedimentos do Brana pode impactar financeiro e orcamento
- Ainda existe risco de confundir procedimento planejado com executado
- Ainda existe risco de confundir narrativa clinica com intervencao

## 17. Registro para roadmap

- Validacao documental de `DENTE`, `FACE` e `_STATUS_INTERV` no EasyDental em uso
- Fechamento parcial das cardinalidades do odontograma
- Etapa somente leitura
- Modulo especifico de Odontologia
- Nenhum codigo alterado
- Nenhum banco alterado
- Futura implementacao deve seguir padrao modularizado no backend e frontend, evitando monolitos
