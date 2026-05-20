# Investigacao profunda (somente leitura) - Y:\EDS70 - Reajuste de tabela (EasyDental)

## 1) Resumo executivo

Esta investigacao confirmou que **existe implementacao desktop** do recurso de reajuste de tabela no EasyDental/EDS70, mas ela esta **embutida no executavel** (principalmente `Y:\EDS70\EDS70.exe`), e nao apareceu como script SQL nomeado "reajuste" em `Y:\EDS70\Dados\*.sql`.

Evidencias encontradas no `EDS70.exe` incluem:

- titulo de janela `Reajusta tabela de preÃ§os`;
- opcoes `Aumentar preÃ§os em` e `Diminuir preÃ§os em`;
- campo `mePercentual` com valor padrao `1,00`;
- mensagens de confirmacao `Deseja realmente aumentar/diminuir os preços da tabela ... em ... % ?`;
- strings SQL que indicam atualizacao em massa na tabela `TAB_PRC_ITEM`, multiplicando `VALOR_REPASSE` e `VALOR_PACIENTE` por fator percentual.

## 2) Confirmacao de acesso a Y:\EDS70

- Dentro do sandbox: `dir Y:\EDS70` falhou com `O sistema não pode encontrar o caminho especificado.`
- Fora do sandbox (somente leitura, aprovado): `dir Y:\EDS70` funcionou e listou a estrutura esperada.

## 3) Caminhos investigados em Y:\EDS70

- `Y:\EDS70\` (raiz)
- `Y:\EDS70\Dados` (scripts/bancos/backup)
- `Y:\EDS70\Textos` (rtf/txt)
- `Y:\EDS70\Reports` (templates `.fr3`)
- `Y:\EDS70\Icones`
- `Y:\EDS70\Help` (PDFs)

## 4) Limitacoes da investigacao

- Nao foi feita engenharia reversa invasiva em binarios: apenas extracao **somente leitura** de strings (ASCII/Windows-1252) e pequenos trechos de contexto.
- Nao foi feito OCR/extracao de texto de PDFs em `Y:\EDS70\Help` nesta etapa.
- Nao foi executada nenhuma operacao de banco (sem restore; sem UPDATE/DELETE/INSERT).
- Nao foi reproduzido nenhum dado sensivel; esta investigacao focou em strings de UI e templates SQL dentro do executavel.

## 5) Inventario resumido (extensoes)

### 5.1) Y:\EDS70 (top extensoes)

- `.bmp` (1328)
- `.rtf` (101)
- `.dll` (54)
- `.dat` (52)
- `.log` (50)
- `.raw` (48)
- `.txt` (28)
- `.sql` (21)
- `.exe` (20)
- `.fr3` (3)
- `.mdb` (4)
- `.mdf` (1) / `.ldf` (1) / `.bak` (1) em `Dados`

### 5.2) Y:\EDS70\Dados

- `.sql` (21), `.raw` (48), `.bak` (1), `.mdf` (1), `.ldf` (1)

### 5.3) Y:\EDS70\Textos

- `.rtf` (101), `.txt` (24) (alem de `.doc/.mod/.thmx`)

### 5.4) Y:\EDS70\Reports

- `.fr3` (3)

## 6) Arquivos potencialmente relevantes encontrados

### 6.1) Executaveis/DLLs (indicativos)

- `Y:\EDS70\EDS70.exe` (principal; contem as evidencias do reajuste)
- `Y:\EDS70\EDUTL70.exe` (utilitario; poucos hits por texto)
- `Y:\EDS70\EDCAP70.EXE` (sem hits relevantes por texto na amostra)

### 6.2) Dados (existencia, sem abrir/escrever)

- `Y:\EDS70\Dados\eds70dat.mdf` (banco)
- `Y:\EDS70\Dados\eds70log.ldf` (log)
- `Y:\EDS70\Dados\eds70.bak` (backup)
- `Y:\EDS70\Dados\eds70.sql` (script de criacao/objetos; nao contem a regra de reajuste por string)

### 6.3) Icones / UI

- `Y:\EDS70\Icones\cmd_reajusta.bmp` (indicio de comando/acao de reajuste no desktop)

### 6.4) Help

- `Y:\EDS70\Help\Manual_EDS70_Completo.pdf` e capitulos `Manual_EDS70_CAP_01.pdf` ... `CAP_13.pdf` (nao analisados por texto nesta etapa)

## 7) Evidencias textuais encontradas (arquivo, trecho curto, interpretacao)

### 7.1) Tela/formulario do reajuste (dentro do executavel)

Fonte: strings extraidas de `Y:\EDS70\EDS70.exe` (Windows-1252), com contexto curto.

- Titulo da janela: `Reajusta tabela de preÃ§os`
  - Interpretacao: corresponde a janela esperada "Reajusta tabela de preços" (desktop).
- Opcoes:
  - `Aumentar preÃ§os em`
  - `Diminuir preÃ§os em`
- Campo percentual:
  - identificador `mePercentual`
  - `Text` inicial `1,00`
  - `Easy_DefaultValue` / `DefaultValue` `1`
- Identificadores tecnicos do formulario:
  - `TfrReajustaTabela`
  - `fr_ReajustaTabela`
  - radios `rbAumenta` / `rbDiminui`

### 7.2) Confirmacao antes de aplicar

Fonte: strings extraidas de `Y:\EDS70\EDS70.exe`.

- `Deseja realmente aumentar os preços da tabela ... em ... % ?`
- `Deseja realmente diminuir os preços da tabela ... em ... % ?`

Interpretacao: o desktop pedia confirmacao explicita antes de aplicar o reajuste.

### 7.3) Regra de aplicacao (SQL embutido no executavel)

Fonte: strings SQL extraidas de `Y:\EDS70\EDS70.exe`.

Foram encontrados templates que indicam atualizacao em massa na tabela `TAB_PRC_ITEM`:

- Aumento:
  - `Set VALOR_REPASSE = VALOR_REPASSE * ( [pValor1] / 100 + 1), VALOR_PACIENTE = VALOR_PACIENTE * ( [pValor2] / 100 + 1)`
- Diminuicao:
  - `Set VALOR_REPASSE = VALOR_REPASSE * ( 1 - [pValor1] / 100 ), VALOR_PACIENTE = VALOR_PACIENTE * ( 1 - [pValor2] / 100 )`
- Escopo:
  - `Where Nrotab = [pNrotab]` (reajuste por tabela selecionada)

Interpretacao:

- o reajuste afetava **itens da tabela de precos de procedimentos/intervencoes** (`TAB_PRC_ITEM`);
- atualizava **dois campos de valor**: `VALOR_PACIENTE` e `VALOR_REPASSE` (possivelmente para particular/convenio/repasse);
- aplicava por `NROTAB` (tabela atual), o que bate com o texto esperado "Reajustar tabela PARTICULAR" (ou equivalente).

### 7.4) Evidencias em scripts SQL (Y:\EDS70\Dados)

- Nao foram encontradas ocorrencias de `reajust*` em `Y:\EDS70\Dados\*.sql`.
- Foi encontrada `sp_AtualizaPrecoMaterial` em `eds70.sql` e `eds70_build_0603.sql`, mas ela e voltada a **materiais/custos**, nao a reajuste de tabela de procedimentos.

Interpretacao: a regra de reajuste de tabela de precos parece residir no codigo do executavel (query templates), nao em scripts SQL nomeados.

## 8) Conclusao

**Regra parcialmente recuperada.**

- Recuperado: existencia da tela, elementos de UI (aumentar/diminuir, percentual), confirmacao, tabela/campos afetados, e formula percentual (aumento/diminuicao) via strings dentro do `EDS70.exe`.
- Nao recuperado: detalhes finos (arredondamento/formatacao monetaria, tratamento de nulo/zero, preview/rollback/log, e se `pValor1/pValor2` sao sempre iguais no desktop ou se variavam conforme fonte/pagador).

## 9) Recomendacao objetiva da proxima etapa (sem implementar agora)

1. Subetapa documental: confirmar sem alteracoes, por leitura/observacao adicional, se no desktop o usuario informa **um unico percentual** e o sistema aplica o mesmo valor para `VALOR_PACIENTE` e `VALOR_REPASSE`, ou se existem dois percentuais (o executavel sugere dois parametros).
2. Se for implementar no web, fazer em etapa separada com:
   - endpoint backend de **preview** (somente leitura) retornando amostra/contagem antes de aplicar;
   - confirmacao explicita do usuario e registro/auditoria;
   - mecanismo de rollback planejado;
   - testes obrigatorios em tabela correta (PARTICULAR e convenio), nulo/zero e arredondamento.

## 10) Onde testar futuramente

Quando houver implementacao segura no web:

- `Configuracoes > Tabelas > Intervencoes / Procedimentos...`
- Selecionar tabela (ex.: PARTICULAR)
- Abrir modal de reajuste (quando existir), testar cancelar, preview, aplicar, e verificar recarga + console/rede.

