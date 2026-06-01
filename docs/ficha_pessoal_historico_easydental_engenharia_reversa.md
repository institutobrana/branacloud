# Ficha Pessoal - Historico - Engenharia reversa do EasyDental

## Objetivo

Registrar a engenharia reversa tecnica da aba Historico no EasyDental legado, usando somente fontes de leitura do ambiente externo e do banco legado.

Este documento nao altera o codigo do Brana Cloud, nao altera o banco, nao altera backend e nao altera frontend. Ele serve como base para comparacao funcional futura.

## Fontes consultadas

- `\\Dell_servidor\c\EDS70`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\eds70.sql`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\Dados\auxiliares_easydental_seed.json`
- `\\Dell_servidor\c\EDS70\Textos`
- `\\Dell_servidor\c\EDS70\Reports`
- `\\Dell_servidor\c\EDS70\Objetos`

## Metodologia

- Leitura somente consulta.
- Mapeamento por nomes de tabelas, colunas, FKs, indices e placeholders legados.
- Classificacao dos achados em:
  - `Confirmado`
  - `Fortemente provavel`
  - `Hipotese`
  - `Nao encontrado`

## Resumo executivo

- O Historico do EasyDental e sustentado por uma tabela propria, `HISTORICO`, com chave primaria, indice por paciente/data e ligacoes formais para paciente, intervencao, prestador e usuario.
- A estrutura confirma que a linha do historico nao e apenas texto livre: ela carrega data, descricao, dente/regiao, cor e auditoria de criacao/alteracao.
- O mapeamento tecnico mais provavel para a interface do Brana Cloud e:
  - `Data` -> `HISTORICO.DATA`
  - `Cirurgiao` -> `HISTORICO.ID_PRESTADOR`
  - `Regiao` -> `HISTORICO.NRODENTE`
  - `Descricao` -> `HISTORICO.DESCRICAO`
- Os campos `COR`, `USER_STAMP_INS`, `TIME_STAMP_INS`, `USER_STAMP_UPD` e `TIME_STAMP_UPD` parecem ser metadados de linha e nao campos principais da edicao clinica.
- Nao foi localizado, nas fontes de texto acessiveis, um artefato legivel que mostre a tela original do Historico com os botoes e atalhos, entao a camada visual continua como inferencia controlada.

## Achados por classificacao

### Confirmado

- A tabela `HISTORICO` existe em `eds70.sql`.
- A chave primaria da tabela `HISTORICO` e `REGISTRO`.
- `HISTORICO.NROPAC` identifica o paciente e referencia `PESSOAL.NROPAC`.
- `HISTORICO.NROINTPAC` referencia `INTERVENCAO.NROINTPAC` quando existe vinculo com uma intervencao.
- `HISTORICO.ID_PRESTADOR` referencia `PRESTADOR.ID_PRESTADOR`.
- `HISTORICO.COR` existe e possui default `16777215`.
- `HISTORICO.USER_STAMP_INS`, `HISTORICO.TIME_STAMP_INS`, `HISTORICO.USER_STAMP_UPD` e `HISTORICO.TIME_STAMP_UPD` existem.
- Existe indice `idxNroPac` em `(NROPAC, DATA)`.
- O relacionamento com `INTERVENCAO` possui `ON DELETE CASCADE`.
- O relacionamento com `PESSOAL` possui `ON UPDATE CASCADE` e `ON DELETE CASCADE`.
- O relacionamento com `PRESTADOR` confirma que o historico conhece o profissional responsavel.

### Fortemente provavel

- `Cirurgiao` na interface corresponde a `ID_PRESTADOR`, porque o campo aponta para `PRESTADOR` e o legado usa `Cirurgiao.*` em placeholders de documentos.
- `Regiao` na interface corresponde a `NRODENTE`, porque o dado legado grava um identificador odontologico curto associado a dente/regiao.
- A listagem do Historico deve ser ordenada ou consultada por paciente e data, pois o indice principal favorece exatamente esse uso.
- A aba visual atual do Brana que mostra `Data`, `Cirurgiao`, `Regiao` e `Descricao do procedimento` esta alinhada com a modelagem do legado.

### Hipotese

- `Data de insercao` e `Data de atualizacao` aparecem como metadados de auditoria e podem ser expostas apenas na janela de propriedades, nao na grade principal.
- `Cor de fundo` e controlada por `COR`, mas sua exibicao na interface pode ser apenas complementar ou restrita ao estado da linha.
- A experiencia visual do EasyDental deve ter tratamento de linha selecionada, propriedades e edicao inline, mas a fonte legivel acessivel nao permitiu fechar esta parte como fato.

### Nao encontrado

- Nao foi localizado, nas fontes de texto acessiveis, o script/fonte legivel da tela de Historico com os botoes originais.
- Nao foi localizado, nas fontes de texto acessiveis, o fluxo exato de atalhos `TAB`, `ENTER` e `ESC` do Historico original.
- Nao foi localizado, nas fontes de texto acessiveis, um contrato visual claro que mostre `Propriedades da linha` como janela formal do legado.
- Nao foi localizado, nas fontes de texto acessiveis, um exemplo de registro de Historico que comprove o uso de `COR` na interface.

## Mapeamento tecnico da linha de Historico

| Interface / conceito | Coluna ou relacao legada | Classificacao | Observacao |
| --- | --- | --- | --- |
| `Data` | `HISTORICO.DATA` | Confirmado | Campo principal da linha e chave de ordenacao natural. |
| `Cirurgiao` | `HISTORICO.ID_PRESTADOR` -> `PRESTADOR` | Fortemente provavel | A relacao com prestador e a nomenclatura dos placeholders apontam para esse mapeamento. |
| `Regiao` | `HISTORICO.NRODENTE` | Fortemente provavel | Campo odontologico curto, tipico de dente/regiao. |
| `Descricao` / `Historico` | `HISTORICO.DESCRICAO` | Confirmado | Texto principal da linha. |
| `Cor de fundo` | `HISTORICO.COR` | Hipotese | Existe na tabela, mas o papel de UI nao foi fechado pelas fontes acessiveis. |
| `Data de insercao` | `HISTORICO.TIME_STAMP_INS` | Hipotese | Metadado de auditoria, possivelmente exibido apenas em propriedades. |
| `Data de atualizacao` | `HISTORICO.TIME_STAMP_UPD` | Hipotese | Metadado de auditoria, possivelmente exibido apenas em propriedades. |
| `Usuario de insercao` | `HISTORICO.USER_STAMP_INS` | Hipotese | Metadado de auditoria. |
| `Usuario de atualizacao` | `HISTORICO.USER_STAMP_UPD` | Hipotese | Metadado de auditoria. |
| Linha vinculada a tratamento | `HISTORICO.NROPAC + HISTORICO.NROINTPAC` -> `INTERVENCAO` | Confirmado | O historico pode ficar amarrado a uma intervencao especifica. |

## Leitura funcional sugerida

- A grade principal do Historico deve priorizar o uso clinico rapido: data, profissional, regiao e descricao.
- A janela de propriedades deve concentrar metadados e edicao detalhada.
- O modelo de persistencia do legado e compativel com o envelope atual do Brana Cloud via `extra.historico_aba`, desde que a serializacao preserve os campos mapeados.

## Pendencias para a proxima comparacao

- Comparar comportamento visual e de teclado com uma execucao real do EasyDental, caso a fonte legivel da UI seja localizada.
- Confirmar se `COR` altera cor da linha ou apenas guarda um valor de contexto.
- Confirmar se `NRODENTE` aceita valores livres, lista fechada ou codigo de regiao.
- Confirmar se a janela de propriedades trata campos de auditoria como somente leitura.

## Conclusao

A engenharia reversa confirma a espinha dorsal tecnica do Historico no EasyDental: uma tabela propria, relacao forte com paciente, intervencao e prestador, e campos de auditoria suficientes para sustentar uma janela de propriedades. O que falta para fechar a comparacao e a evidencia legivel da camada visual original.
