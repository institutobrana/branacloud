# Auditoria EasyDental em uso - Odontograma

## 1. Objetivo

Investigar, em modo somente leitura, como o EasyDental em uso armazena o odontograma, quais tabelas participam, quais estados visuais existem, quais cores ou regras visuais aparecem e como a tela do odontograma se relaciona com a grade inferior de procedimentos e histórico.

## 2. Fonte analisada

- Fonte documental de referência anterior: `\\Sonyvaio\c\EDS70`
- Leitura técnica realizada nesta auditoria: `INSPIRON-15\SQLEXPRESS` / base `EDS70`
- Forma de acesso: `sqlcmd` com autenticação integrada

## 3. Confirmação de somente leitura

- Foram executados apenas `SELECT` e introspecção de schema.
- Não houve `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `CREATE`, `TRUNCATE`, `RESTORE`, `ATTACH`, `DETACH` ou migration.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum banco foi alterado.
- Nenhum código do Brana Cloud foi alterado.

## 4. Classificação funcional

- O odontograma deve ser tratado como módulo **específico de Odontologia**.
- Não há evidência técnica para tratá-lo como módulo core/comum multiárea.

## 5. Resumo visual do print informado

- Menu superior com áreas de cadastro, tratamento, agenda, relatório, especialidade, financeiro, configuração, ferramentas e ajuda.
- Odontograma na parte superior esquerda.
- Paciente selecionado no centro do fluxo.
- Grade inferior com colunas como `Data`, `Cirurgião`, `Região` e `Descrição do procedimento`.
- Painel lateral com abas de paciente, tratamento, observações, imagens, documentos e agenda.
- Exemplos de procedimentos mostrados no print:
  - Cimentação adesiva
  - Cimentação de Coroa Total Definitiva
  - Cimentação de Coroa Total Provisória
  - Cimentação de Núcleo Metálico Fundido
  - Cimentação de Prótese Parcial Fixa
- Exemplos de histórico no print:
  - Receitado Azitromicina
  - Receitado Codaten
  - Receitado Tramal
  - Receitado Tylex

## 6. Tabelas candidatas encontradas

### Núcleo odontograma

- `ARCADA`
- `DENTE`
- `FACE`
- `HISTORICO`
- `TRATAMENTO`
- `INTERVENCAO`
- `CCPACIENTE`

### Cadastro clínico e apoio

- `PESSOAL`
- `PRESTADOR`
- `TAB_PRC`
- `TAB_PRC_ITEM`
- `TAB_GEN_ITEM`
- `TAB_GEN_ITEM_FASE`
- `TAB_GEN_ITEM_MAT`
- `TAB_MAT`
- `TAB_MAT_ITEM`

### Códigos visuais e status

- `_SIMBOLO_ODONTO`
- `_SIMBOLO_ANOMALIA`
- `_STATUS_INTERV`
- `_STATUS_PT`
- `_STATUS_PACIENTE`
- `_FASE_PROCEDIMENTO`
- `_TISS_REGIAO_PROCEDIMENTO`

## 7. Tabelas confirmadas como participantes

| tabela | papel técnico | observação |
| --- | --- | --- |
| `PESSOAL` | paciente | armazena o paciente 646 |
| `TRATAMENTO` | tratamento/plano | existe 1 tratamento para o paciente 646 |
| `ARCADA` | desenho do odontograma | 32 linhas para o paciente 646 |
| `HISTORICO` | histórico clínico/textual | 6 registros para o paciente 646 |
| `INTERVENCAO` | execução de procedimento | existe na base, mas sem linhas para o paciente 646 nesta leitura |
| `DENTE` | marcações por dente | estrutura confirmada, porém sem linhas para o paciente 646 nesta leitura |
| `FACE` | marcações por face | estrutura confirmada, porém sem linhas para o paciente 646 nesta leitura |
| `TAB_PRC` | tabela de procedimento | contém as tabelas particulares e convênios |
| `TAB_PRC_ITEM` | catálogo de procedimentos | contém os procedimentos exibidos na grade |
| `TAB_GEN_ITEM` | procedimento genérico | liga procedimento a símbolo odontológico |
| `_SIMBOLO_ODONTO` | legenda visual | define ícones/bitmaps do odontograma |
| `_SIMBOLO_ANOMALIA` | legenda de anomalias | define ícones/bitmaps de anomalias |
| `_TISS_REGIAO_PROCEDIMENTO` | regiões TISS/odontograma | mapeia regiões e bitmasks |
| `_STATUS_INTERV` | status de intervenção | fornece o rótulo do status da intervenção |
| `_STATUS_PT` | status do tratamento | fornece o rótulo do status do tratamento |

## 8. Relação entre paciente, tratamento, procedimento, dente, face e histórico

### Paciente 646

- `PESSOAL.NROPAC = 646`
- `TRATAMENTO.NROPAC = 646`
- `ARCADA.NROPAC = 646` com 32 registros
- `HISTORICO.NROPAC = 646` com 6 registros
- `INTERVENCAO`, `DENTE`, `FACE` e `CCPACIENTE` não trouxeram linhas para `NROPAC = 646` nesta fotografia da base

### Tratamento do paciente 646

- `TRATAMENTO.NROTRA = 2620`
- `TRATAMENTO.NROTAB = 10`
- `TRATAMENTO.NROIND = 255`
- `TRATAMENTO.ID_PRESTADOR = 1`
- `TRATAMENTO.DATINI = 2021-10-10`
- `TRATAMENTO.DATVAL = 2022-01-13`
- `TRATAMENTO.DATCONV = 2021-12-29`
- `TRATAMENTO.STATTRA = 1`
- `TRATAMENTO.STATORC = 1`

### Histórico do paciente 646

- Foram encontrados 6 registros, todos com `COR = 16777215`.
- Os textos são entradas de prescrição/histórico, por exemplo:
  - `Receitado: Azitromicina - 500 mg, Celebra - 200 mg`
  - `Receitado: Codaten 50 mg`
  - `Receitado: Floxacin - 400mg`
  - `Receitado: Tramal 50mg`
  - `Receitado: Tylex 30mg`

### Desenho do odontograma

- `ARCADA` guarda o par `NRODEN` / `NROODONTO`, permitindo reconstituir a sequência dos dentes.
- No paciente 646, os 32 registros formam a arcada com a numeração FDI usual:
  - 18, 17, 16, 15, 14, 13, 12, 11
  - 21, 22, 23, 24, 25, 26, 27, 28
  - um separador/posição nula em `NRODEN = 17` com `NROODONTO = 0`
  - 47, 46, 45, 44, 43, 42, 41
  - 31, 32, 33, 34, 35, 36, 37, 38

### Procedimentos e grade inferior

- `TAB_PRC_ITEM` contém o catálogo de procedimentos que aparecem na grade inferior.
- O conjunto consultado mostra ligações diretas entre descrição e símbolo odontológico, por exemplo:
  - `Cimentação de Coroa Total Definitiva` -> símbolo `1` (`Coroa`)
  - `Cimentação de Coroa Total Provisória` -> símbolo `30` (`Provisório por elemento`)
  - `Cimentação de Núcleo Metálico Fundido` -> símbolo `14` (`Núcleo`)
  - `Cimentação de Prótese Parcial Fixa` -> símbolo `5` (`Prótese parcial fixa`)
- `TAB_GEN_ITEM.ID_SIMBOLO` referencia `_SIMBOLO_ODONTO.NROSIM`, confirmando que o catálogo é visualmente ligado ao odontograma.

## 9. Estados encontrados

### Status já catalogados em tabelas de apoio

| tabela | valor | rótulo observado |
| --- | --- | --- |
| `_STATUS_INTERV` | `1` | Observada |
| `_STATUS_INTERV` | `2` | Realizada |
| `_STATUS_INTERV` | `3` | Realizar |
| `_STATUS_PT` | `1` | Aberto |
| `_STATUS_PT` | `2` | Finalizado |
| `_STATUS_PT` | `3` | Interrompido |
| `_STATUS_PACIENTE` | `1` | Inativo |
| `_STATUS_PACIENTE` | `2` | Ativo |
| `_STATUS_PACIENTE` | `3` | Em tratamento |
| `_STATUS_PACIENTE` | `4` | Faleceu |

### Campos de estado observados na prática

- `INTERVENCAO.STATUS` tem FK para `_STATUS_INTERV.REGISTRO`.
- `TRATAMENTO.STATTRA` tem FK para `_STATUS_PT.REGISTRO`.
- `TRATAMENTO.STATORC` não apareceu com lookup explícito nesta leitura; os valores observados foram `NULL`, `1` e `2`.
- `INTERVENCAO.ORCAMENTO` foi observado com `0` e `-1`.
- Distribuição observada na base para os campos principais:
  - `TRATAMENTO.STATTRA`: `1=835`, `2=2705`, `3=297`
  - `TRATAMENTO.STATORC`: `NULL=258`, `1=1038`, `2=2541`
  - `INTERVENCAO.STATUS`: `1=2596`, `2=8886`, `3=4918`
  - `INTERVENCAO.ORCAMENTO`: `0=16386`, `-1=14`
  - `HISTORICO.COR`: `16777215=38432`
- `ARCADA.ANOMALIAS` funciona como bitmask, com valores como `0`, `16`, `64`, `128`, `512`, `1024`, `4096`, `8192`, `65536`, `66560`, `69632`, `133120` e outros compostos.
- `FACE.FACE1` a `FACE5` alternam entre `0` e `-1`, sugerindo flags binárias por face.
- `DENTE.BITMAP` guarda chaves textuais de bitmap, não um status numérico simples.

### Leitura do paciente 646

- `ARCADA.ANOMALIAS = 0` em todos os 32 registros do paciente 646.
- `DENTE`, `FACE` e `INTERVENCAO` não tinham linhas para o paciente 646 nesta captura, então não foi possível extrair um estado clínico por dente ou por face para esse paciente específico.

## 10. Cores e regras visuais encontradas ou inferidas

### O que foi confirmado

- `HISTORICO.COR` existe e, no recorte consultado, está fixado em `16777215`.
- `_SIMBOLO_ODONTO` usa `BITMAP1`, `BITMAP2`, `BITMAP3` e `ICONE`, o que mostra uma lógica visual baseada em bitmap/ícone, não apenas em cor.
- `_SIMBOLO_ANOMALIA` segue a mesma lógica de símbolo/ícone para anomalias.
- `TAB_PRC_ITEM.MOSTRAR_SIMBOLO`, `GARANTIA` e `PREFERIDO` são metadados de exibição e seleção.
- `_TISS_REGIAO_PROCEDIMENTO.FL_ODONTOGRAMA = 1` em várias regiões confirma a natureza odontológica da marcação.

### Hipótese fundamentada

- A cor do odontograma não parece vir de um único campo RGB central.
- O modelo visual parece combinar:
  - bitmaps/ícones de símbolo;
  - bitmasks de anomalia;
  - flags binárias por face;
  - status textuais/numericos de tratamento e intervenção;
  - cor de histórico para textos/linhas de grade.

### Evidência dos símbolos

- `_SIMBOLO_ODONTO` contém, entre outros:
  - `1` = Coroa
  - `5` = Prótese parcial fixa
  - `7` = Prótese adesiva
  - `14` = Núcleo
  - `30` = Provisório por elemento
  - `49` = Aumento de coroa clínica
  - `56` = Prótese (diversos)
- Isso reforça que a tela usa uma legenda simbólica, não apenas cor plana.

## 11. Comparação com o EasyDental virgem

- A documentação anterior do EDS70 virgem já listava o mesmo núcleo estrutural de tabelas odontológicas:
  - `ARCADA`
  - `DENTE`
  - `FACE`
  - `HISTORICO`
  - `TRATAMENTO`
  - `INTERVENCAO`
  - `TAB_PRC`
  - `TAB_PRC_ITEM`
  - `TAB_GEN_ITEM`
  - `_SIMBOLO_ODONTO`
  - `_SIMBOLO_ANOMALIA`
  - `_TISS_REGIAO_PROCEDIMENTO`
- Nesta leitura do banco em uso, a estrutura confirmada é compatível com a do virgem.
- Diferença observada nesta fotografia:
  - o banco em uso tem o paciente 646 e dados clínicos populados;
  - a lógica do odontograma já está sustentada por tabelas e símbolos no mesmo esquema.
- Inferência: o diferencial prático entre virgem e em uso está mais na população dos registros do que na existência das tabelas principais.

## 12. SQL utilizado

### Metadados

```sql
SELECT @@SERVERNAME, DB_NAME(), COUNT(*) FROM sys.tables;
SELECT s.name, t.name
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE t.name LIKE '%ODONTO%' OR t.name LIKE '%DENTE%' OR t.name LIKE '%FACE%';
SELECT s.name, t.name, c.name, ty.name, c.is_nullable
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id;
```

### Estrutura e relações

```sql
SELECT OBJECT_NAME(fkc.parent_object_id), c1.name, OBJECT_NAME(fkc.referenced_object_id), c2.name
FROM sys.foreign_key_columns fkc
JOIN sys.columns c1 ON c1.object_id = fkc.parent_object_id AND c1.column_id = fkc.parent_column_id
JOIN sys.columns c2 ON c2.object_id = fkc.referenced_object_id AND c2.column_id = fkc.referenced_column_id;
```

### Paciente 646

```sql
SELECT * FROM PESSOAL WHERE NROPAC = 646;
SELECT * FROM TRATAMENTO WHERE NROPAC = 646;
SELECT * FROM ARCADA WHERE NROPAC = 646;
SELECT * FROM HISTORICO WHERE NROPAC = 646;
SELECT * FROM INTERVENCAO WHERE NROPAC = 646;
SELECT * FROM DENTE WHERE NROPAC = 646;
SELECT * FROM FACE WHERE NROPAC = 646;
```

### Estados e visuais

```sql
SELECT STATTRA, COUNT(*) FROM TRATAMENTO GROUP BY STATTRA;
SELECT STATORC, COUNT(*) FROM TRATAMENTO GROUP BY STATORC;
SELECT STATUS, COUNT(*) FROM INTERVENCAO GROUP BY STATUS;
SELECT COR, COUNT(*) FROM HISTORICO GROUP BY COR;
SELECT ANOMALIAS, COUNT(*) FROM ARCADA GROUP BY ANOMALIAS;
SELECT FACE1, FACE2, FACE3, FACE4, FACE5 FROM FACE;
SELECT NROSIM, DESCRICAO, BITMAP1, BITMAP2, BITMAP3, ICONE FROM _SIMBOLO_ODONTO;
SELECT ID_MNEMONICO, CD_MNEMONICO, TX_REGIAO, FL_ODONTOGRAMA, BITMASK FROM _TISS_REGIAO_PROCEDIMENTO;
```

## 13. Riscos e incertezas

- `TRATAMENTO.STATTRA` está bem explicado por FK, mas `STATORC` não apareceu com lookup explícito nesta fotografia.
- Não foi possível provar que a grade inferior do print já está persistida para o paciente 646 em `INTERVENCAO`; nesta base, a tabela está vazia para esse paciente.
- `DENTE` e `FACE` existem e são claramente parte do modelo odontológico, mas não há linhas para o paciente 646 na leitura feita aqui.
- A cor visual exata de cada símbolo não foi derivada diretamente do banco; o que ficou claro foi a dependência de bitmaps, ícones e flags.
- A comparação com o virgem é estrutural e documental; não houve um segundo restore/consulta ao virgem nesta mesma execução para gerar diff binário de dados.

## 14. O que ainda precisa ser validado manualmente no EasyDental

- Se a grade inferior do odontograma cria `INTERVENCAO` apenas após uma ação específica do operador.
- Se `DENTE` e `FACE` passam a receber linhas somente depois de registrar intervenção ou procedimento.
- Como o aplicativo pinta a arcada na tela quando há símbolos como coroa, núcleo, prótese, implante e extração.
- Se os campos `FACE1` a `FACE5` representam marcação/ausência de marcação em cada face do dente.
- Se `STATORC` aparece em algum formulário como status de orçamento, aprovação ou etapa interna.
- Se o símbolo visual exibido no odontograma vem de `_SIMBOLO_ODONTO.ICONE` ou dos bitmaps associados.

## 15. Impacto futuro para o Brana Cloud

- O odontograma deve ser modelado como módulo odontológico específico, com persistência, legenda visual e regras próprias.
- A migração futura deve respeitar a separação entre:
  - catálogo de procedimentos;
  - símbolos visuais;
  - estados de tratamento/intervenção;
  - desenho de arcada;
  - histórico clínico.
- A grade inferior do EasyDental sugere que o Brana Cloud precisará de uma representação clara entre catálogo de procedimentos e execução clínica.
- O uso de bitmaps/ícones e bitmasks indica que o futuro módulo não deve depender só de texto; ele precisa de uma camada de legenda visual.

## 16. Registro para roadmap

- Esta auditoria foi iniciada para documentar o odontograma do EasyDental em uso.
- O módulo foi classificado como específico de Odontologia.
- O objetivo foi mapear armazenamento, estados, cores e tabelas participantes.
- A etapa foi somente leitura.
- Nenhum código foi alterado.
- Nenhum banco foi alterado.
- Nenhum arquivo do EasyDental foi alterado.
