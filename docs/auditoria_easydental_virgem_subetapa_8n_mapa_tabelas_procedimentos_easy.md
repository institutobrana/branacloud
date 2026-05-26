# Auditoria EasyDental virgem - Subetapa 8N - mapa TAB_PRC/TAB_PRC_ITEM por tabela

## 1. Contexto

- Referencia a Subetapa 8M, que bloqueou a correcao das tabelas de procedimentos/precos por falta de mapa verificavel suficiente.
- A verificacao foi reaberta com acesso restabelecido ao caminho `\\Sonyvaio\c\EDS70`.
- O objetivo desta etapa foi confirmar a origem virgem do EasyDental e obter o melhor mapa verificavel possivel para `TAB_PRC` e `TAB_PRC_ITEM`.
- Esta etapa e investigativa e documental. Nao ha implementacao de codigo nesta entrega.

## 2. Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum banco Brana foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Setup nao foi alterado.
- Frontend e backend nao foram alterados.
- A blindagem textual / mojibake foi respeitada.

## 3. Fonte EasyDental verificada

- Caminho usado: `\\Sonyvaio\c\EDS70`
- Estado na sessao atual: acessivel por leitura de arquivos.
- Metodo de leitura:
  - listagem de `Dados\Dist`
  - leitura binaria de `TAB_PRC.raw`
  - leitura binaria de `TAB_PRC_ITEM.raw` em arquivo temporario fora do repositorio, apenas para analise
- Confirmacao de que a fonte e a distribuicao/compartilhamento legado do EasyDental:
  - o diretorio contem `EDS70.dsn`
  - o arquivo DSN aponta `SERVER=SONYVAIO\EDS70`
  - o pacote possui `Dados\Dist` com os `.raw` esperados do EasyDental
- Limitacao:
  - o `TAB_PRC_ITEM.raw` nao se comportou como uma lista simples e fechada de registros durante esta sessao
  - o mapa completo por tabela ainda nao ficou fechado com seguranca suficiente para corrigir o seed

## 4. Estrutura `TAB_PRC`

### 4.1 Colunas relevantes observadas

- `NROTAB`
- `NOME`
- `TIPO`
- `NROIND`
- `NROCONV`
- `NROCRED`
- `INATIVO`
- `ID_TAB_PRC`
- `ID_TIPO_TABELA`

### 4.2 Registros confirmados no `TAB_PRC.raw`

O arquivo bruto confirma 9 tabelas nominais do EasyDental virgem, com os codigos abaixo:

| Codigo | Nome real no EasyDental | Observacao |
| --- | --- | --- |
| 1 | `Particular` | tabela herdada; nome real do pacote virgem |
| 2 | `Sindicato` | confirmado |
| 3 | `Bradesco` | confirmado |
| 4 | `Banco do Brasil` | confirmado |
| 5 | `Caixa Econ. Federal` | confirmado; difere do contrato apenas por pontuacao |
| 6 | `Banespa` | confirmado |
| 7 | `Telebrás` | confirmado; difere do contrato apenas por acento |
| 8 | `Petrobrás` | confirmado; difere do contrato apenas por acento |
| 9 | `CNCC` | confirmado |

### 4.3 Comparacao com a lista contratual

Lista contratual atual:

- Banco do Brasil
- Banespa
- Bradesco
- Caixa Econ Federal
- CNCC
- Particular
- Petrobras
- Sindicato
- Telebras

Comparacao:

- todos os 9 nomes contratuais aparecem no `TAB_PRC.raw`
- as divergencias sao apenas ortograficas / de acentuacao:
  - `Caixa Econ Federal` vs `Caixa Econ. Federal`
  - `Petrobras` vs `Petrobrás`
  - `Telebras` vs `Telebrás`
- nao apareceram tabelas extras no `TAB_PRC.raw`
- `Brana` nao aparece no EasyDental, como esperado

## 5. Estrutura `TAB_PRC_ITEM`

### 5.1 Colunas relevantes mapeadas nas fontes de leitura

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

### 5.2 Relacao funcional esperada

- `NROTAB` e a chave da tabela de procedimentos / preco
- `NROPROCTAB` identifica o item dentro da tabela
- `VALOR_PACIENTE` e `VALOR_REPASSE` sao os campos de valor que precisam ser sanitizados no Brana
- `CODCONV`, `ESPECIAL`, `NROSIM`, `TIPOCOBR`, `GARANTIA`, `PREFERIDO`, `OBSERV` e `ID_PRC_GEN` sao campos de suporte relevantes para o mapeamento

### 5.3 Limitacao encontrada

- o `TAB_PRC_ITEM.raw` foi acessivel, mas nao se fechou nesta sessao um parser confiavel o suficiente para consolidar a contagem por tabela sem risco de interpretar blocos/segmentos de forma errada
- por seguranca, nao foi inventado o mapa 1:1 de itens por tabela
- a correcao do seed continua bloqueada ate que a contagem por tabela seja fechada com evidencia segura

## 6. Contagem por tabela

### 6.1 Mapa contratual revisado

| Codigo | Nome contratual | Nome real no EasyDental | Status | Contagem de `TAB_PRC_ITEM` | Observacao |
| --- | --- | --- | --- | --- | --- |
| 4 | Banco do Brasil | Banco do Brasil | confirmado | nao fechado nesta sessao | nome confirmado; item-map ainda incompleto |
| 6 | Banespa | Banespa | confirmado | nao fechado nesta sessao | nome confirmado; item-map ainda incompleto |
| 3 | Bradesco | Bradesco | confirmado | nao fechado nesta sessao | nome confirmado; item-map ainda incompleto |
| 5 | Caixa Econ Federal | Caixa Econ. Federal | confirmado | nao fechado nesta sessao | ajuste apenas de pontuacao |
| 9 | CNCC | CNCC | confirmado | nao fechado nesta sessao | nome confirmado |
| 1 | Particular | Particular | confirmado | nao fechado nesta sessao | nome confirmado; tabela herdada, nao padrao |
| 8 | Petrobras | Petrobrás | confirmado | nao fechado nesta sessao | ajuste apenas de acento |
| 2 | Sindicato | Sindicato | confirmado | nao fechado nesta sessao | nome confirmado |
| 7 | Telebras | Telebrás | confirmado | nao fechado nesta sessao | ajuste apenas de acento |

### 6.2 Status geral

- o mapa nominal de `TAB_PRC` esta confirmado
- o mapa de itens de `TAB_PRC_ITEM` ainda nao esta fechado por tabela
- portanto, a correcao do seed continua bloqueada por seguranca

## 7. Tabelas extras encontradas em comparacao secundaria

Fontes secundarias consultadas nesta investigacao:

- banco SQL vivo acessivel nesta maquina: 4 tabelas ativas apenas
- backup legado local `procedimento.csv`

Achados secundarios:

- no SQL vivo acessivel nesta maquina apareceram apenas:
  - `EASY - Particular` (112)
  - `Caixa Econ. Federal` (88)
  - `PARTICULAR` (336)
  - `UNIMED-ODONTO` (162)
- no backup legado local apareceram grupos de tabela ligados ao legado Brana / conta antiga, com nomes como:
  - `Tabela Exemplo`
  - `PARTICULAR`
  - `EASY - Particular`
  - `UNIMED-ODONTO`
- essas fontes secundarias nao fecham o mapa da fonte virgem e nao podem ser usadas como substitutas da verificacao principal

## 8. Regra para a proxima implementacao

- Brana deve continuar recebendo o seed canonicamente separado
- as 9 tabelas herdadas do EasyDental devem receber seus proprios itens correspondentes
- `Tabela Exemplo` nao deve nascer em novas contas
- os valores financeiros devem continuar sanitizados para zero / null conforme o modelo exigir
- a verificacao ainda precisa fechar a contagem por tabela de `TAB_PRC_ITEM` antes de qualquer correcao de seed

## 9. Situacao da correcao 8J

- a replicacao dos 336 itens da Brana em todas as tabelas continua sendo a regra incorreta observada na implementacao anterior
- esta etapa nao corrigiu codigo
- o que precisa ser corrigido na proxima subetapa e a separacao do seed da Brana em relacao aos seeds herdados do EasyDental por tabela

## 10. Pendencias

- fechar o mapa de itens de `TAB_PRC_ITEM` por tabela EasyDental virgem
- confirmar a contagem de itens de cada uma das 9 tabelas contratuais na fonte principal
- se houver dependencia de outro artefato para o mapeamento, documenta-lo explicitamente antes de qualquer escrita

## 11. Proxima subetapa recomendada

- `EasyDental virgem - Subetapa 8O - complementacao da fonte/mapeamento TAB_PRC antes da correcao`

Justificativa:

- a fonte principal voltou a ficar acessivel
- os nomes das 9 tabelas foram confirmados
- mas a contagem de `TAB_PRC_ITEM` por tabela ainda nao ficou fechada o suficiente para corrigir o seed sem risco

## 12. Plano de verificacao

- somente o documento novo e o roadmap devem ser alterados
- nenhum codigo foi alterado
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules` nao foram alterados
- backend nao foi alterado
- banco/schema/migrations/seeds/endpoints nao foram alterados
- banco Brana nao foi alterado
- nenhum arquivo do EasyDental foi alterado
- nenhum script SQL foi executado
- nenhuma query de escrita foi executada
- nenhuma conta foi criada
- a conta ID 16 nao foi alterada
- setup / senha interna / Opcoes do Sistema nao foram alterados
- unidade Principal / 0001 nao foi alterada
- dados sensiveis nao foram expostos
- a blindagem textual / mojibake foi respeitada
