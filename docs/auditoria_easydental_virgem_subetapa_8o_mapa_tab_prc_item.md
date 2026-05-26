# Auditoria EasyDental virgem - Subetapa 8O - complementacao do mapa TAB_PRC_ITEM

## 1. Contexto

- Referencia direta a Subetapas 8M e 8N.
- A 8M bloqueou a correcao porque a 8J replicou os 336 itens da Brana em todas as tabelas herdadas.
- A 8N confirmou a fonte virgem `\\Sonyvaio\c\EDS70` e fechou o mapa nominal de `TAB_PRC`, mas `TAB_PRC_ITEM` ainda precisava de complementacao por tabela.
- Esta 8O e documental / investigativa. Nao ha implementacao de codigo nesta entrega.

## 2. Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum backend ou frontend foi alterado.
- Nenhum banco Brana foi alterado.
- Nenhum arquivo EasyDental foi alterado.
- Nenhuma query de escrita foi executada.
- Nenhum script SQL foi executado.
- Nenhuma conta foi criada.
- A conta ID 16 nao foi alterada.
- Setup / senha interna / Opcoes do Sistema nao foram alterados.
- A unidade Principal / 0001 nao foi alterada.
- A blindagem textual / mojibake foi respeitada.

## 3. Fonte verificada

- Caminho usado: `\\Sonyvaio\c\EDS70`
- Arquivos lidos:
  - `Dados\Dist\TAB_PRC.raw`
  - `Dados\Dist\TAB_PRC_ITEM.raw`
  - `eds70.dsn`
  - arquivos auxiliares ja documentados em etapas anteriores
- Metodo de leitura:
  - listagem do diretorio `Dados\Dist`
  - leitura binaria dos `.raw`
  - copia temporaria dos `.raw` para pasta temporaria fora do repositorio apenas para analise local
- Limitacoes:
  - o layout de `TAB_PRC_ITEM.raw` nao e um CSV nem um dump simples
  - o arquivo se comporta como uma sequencia legado-binaria com campos textuais UTF-16LE e blocos de tamanho variavel
  - por isso a contagem por tabela precisou ser obtida por reconhecimento de registros e prefixos validos de `NROTAB` / `NROPROCTAB`

## 4. Estrutura inferida de `TAB_PRC_ITEM.raw`

- Tamanho do arquivo: `246394` bytes
- Formato provavel: sequencia binaria legado com strings UTF-16LE e registros com campos fixos iniciais e payload variavel
- Campos identificados com confianca alta:
  - `NROTAB` - vinculo da tabela
  - `NROPROCTAB` - codigo do procedimento dentro da tabela
  - campo textual legado logo apos o cabecalho numerico, contendo codigo legado / rotulo e descricao
  - `VALOR_PACIENTE` e `VALOR_REPASSE` como campos de valor presentes na familia documental e no mapeamento legato conhecido
  - `CODCONV`, `ESPECIAL`, `NROSIM`, `TIPOCOBR`, `GARANTIA`, `PREFERIDO`, `OBSERV`, `INATIVO`, `MOSTRAR_SIMBOLO`, `ID_PRC_GEN` como campos de suporte ja conhecidos pela leitura documental e pelos scripts de migracao
- Campo de vinculo com `TAB_PRC`:
  - `NROTAB`
- Campo de codigo de procedimento:
  - `NROPROCTAB`
- Campo de descricao:
  - cadeia textual UTF-16LE presente logo apos o cabecalho numerico, terminando antes do bloco de campos auxiliares
- Campo de preco / valor:
  - `VALOR_PACIENTE`
  - `VALOR_REPASSE`
- Grau de confianca da estrutura:
  - alto para o vinculo, o codigo do item, a descricao e os campos de valor
  - medio para a interpretacao de alguns bytes auxiliares do payload legado

## 5. Mapa final por tabela

| Codigo TAB_PRC | Nome real EasyDental | Nome contratual Brana | Quantidade de itens | Campo usado para vinculo | Confianca | Observacao |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Particular | Particular | 112 | `NROTAB` | alta | tabela herdada; nao e a tabela padrao privada do Brana |
| 2 | Sindicato | Sindicato | 238 | `NROTAB` | alta | confirmada na fonte virgem |
| 3 | Bradesco | Bradesco | 94 | `NROTAB` | alta | confirmada na fonte virgem |
| 4 | Banco do Brasil | Banco do Brasil | 188 | `NROTAB` | alta | confirmada na fonte virgem |
| 5 | Caixa Econ. Federal | Caixa Econ Federal | 88 | `NROTAB` | alta | ajuste apenas de pontuacao |
| 6 | Banespa | Banespa | 32 | `NROTAB` | alta | confirmada na fonte virgem |
| 7 | Telebrás | Telebras | 101 | `NROTAB` | alta | ajuste apenas de acento |
| 8 | Petrobrás | Petrobras | 174 | `NROTAB` | alta | ajuste apenas de acento |
| 9 | CNCC | CNCC | 236 | `NROTAB` | alta | confirmada na fonte virgem |

## 6. Amostra segura por tabela

### 6.1 Particular

- `1001` - Coroa metalo-cerâmica
- `1002` - Coroa metalo-plástica
- `1003` - Coroa Isosit
- `1004` - Coroa metálica total
- `1005` - Restauração metálica-fundida (Liga de Ouro)

### 6.2 Sindicato

- `2001` - Consulta Inicial (exame clínico e orçamento)
- `2002` - Urgência Noturna - Sáb, Dom e feriados
- `2003` - Perícia Inicial e Final
- `2004` - Consulta (falta não justificada)
- `2005` - Rx periapical

### 6.3 Bradesco

- `3001` - Consulta inicial
- `3002` - Consulta devida (falta consulta sem justificativa)
- `3003` - Consulta de emergência
- `3004` - Ulotomia
- `3005` - Extração de dentes decíduos

### 6.4 Banco do Brasil

- `4001` - Consulta para plano de tratamento e orçamento
- `4002` - Consulta avulsa (recolocação de restauração, etc)
- `4003` - Perícia
- `4004` - Modelos de estudo (par)
- `4005` - Drenagem de abcesso por via intra-oral

### 6.5 Caixa Econ. Federal

- `5001` - Consulta
- `5002` - Controle de placa bacteriana
- `5003` - Falta
- `5004` - Modelos de estudo
- `5005` - Perícia

### 6.6 Banespa

- `6001` - Consulta
- `6002` - Condicionamento pediátrico
- `6003` - Dentisteria em amálgama e resina quimipolimerizável
- `6004` - Exodontia simples
- `6005` - Profilaxia - raspagem de cálculo supra-gengival e polimento

### 6.7 Telebrás

- `7001` - Consulta para o empregado
- `7002` - Consulta para o dependente
- `7003` - Perícia inicial/final
- `7004` - Urgência noturna (das 22:00 às 6:00 hs)
- `7005` - Curativo

### 6.8 Petrobrás

- `8001` - Raspagem e alisamento radicular
- `8002` - Gengivectomia, gengivoplastia
- `8003` - Aumento de coroa clínica
- `8004` - Cirur. period. a ret, gengivec, gengivop - 3 elementos
- `8005` - Cirur. period. a ret, gengivec, gengivop

### 6.9 CNCC

- `9001` - Exame clínico
- `9002` - Consulta inicial (Exame Clínico e Orçamento)
- `9003` - Urgência noturna - sábado, domingo e feriados
- `9004` - Perícia inicial e final
- `9005` - Consulta (falta não justificada)

## 7. Divergencias e duvidas

- A comparacao com o banco vivo acessivel em outra sessao e com o backup legado local continua sendo secundaria e nao substitui a fonte virgem.
- O `TAB_PRC_ITEM.raw` se mostrou mais rico do que a leitura anterior sugeria: o mapa por tabela ficou fechado, mas alguns bytes auxiliares do payload ainda nao foram traduzidos por completo.
- Os nomes `Caixa Econ. Federal`, `Telebrás` e `Petrobrás` aparecem com acentuacao / pontuacao do pacote virgem; o contrato Brana usa as formas sem acento e sem ponto.
- Nao foram encontradas tabelas extras na fonte virgem de `TAB_PRC`.

## 8. Regra para a futura correção

- Brana continua com seu seed proprio.
- As 9 tabelas herdadas do EasyDental devem receber seus itens correspondentes.
- Os valores financeiros devem continuar sanitizados para zero / null conforme o modelo exigir.
- `Tabela Exemplo` continua fora do nascimento de novas contas.
- O mapa obtido nesta etapa ja e suficiente para permitir a proxima correcao isolada do seed.

## 9. Situacao da correcao 8J

- A replicacao dos 336 itens da Brana em todas as tabelas herdadas continua sendo a regra incorreta da 8J ate a correcao futura.
- Esta etapa nao alterou o codigo.
- O que precisa ser corrigido na proxima subetapa e a separacao definitiva do seed da Brana em relacao aos seeds herdados do EasyDental por tabela.

## 10. Pendencias

- Converter esta leitura em seed separado por tabela no Brana Cloud.
- Manter os valores sanitizados.
- Confirmar apenas a traducao dos campos auxiliares restantes se a futura implementacao exigir mais algum mapeamento.

## 11. Proxima subetapa recomendada

- `EasyDental virgem - Subetapa 8P - correcao isolada dos seeds por tabela EasyDental`

Justificativa:

- o mapa nominal de `TAB_PRC` esta fechado
- o mapa por tabela de `TAB_PRC_ITEM` agora possui contagem e amostra verificaveis
- a correcao do seed pode seguir com risco reduzido

## 12. Plano de verificacao

- somente o documento novo e o roadmap foram alterados
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
