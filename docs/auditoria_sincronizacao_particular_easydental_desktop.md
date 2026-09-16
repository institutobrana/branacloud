# Auditoria - Sincronizacao da tabela PARTICULAR do EasyDental Desktop

## 1. Escopo

Auditoria somente leitura para localizar a tabela `PARTICULAR` no EasyDental Desktop e verificar a fonte fisica disponivel em `Y:\EDS70`.

## 2. Localizacao fisica encontrada

- Instalacao: `Y:\EDS70`
- DSN: `Y:\EDS70\eds70.dsn`
- Banco declarado no DSN: `eds70`
- Servidor declarado no DSN: `DELL_SERVIDOR\EDS70`
- Arquivo com a lista de tabelas: `Y:\EDS70\Dados\Dist\TAB_PRC.raw`
- Arquivo com os procedimentos da tabela: `Y:\EDS70\Dados\Dist\TAB_PRC_ITEM.raw`

## 3. Evidencia da tabela PARTICULAR

O arquivo `TAB_PRC.raw` contem a entrada textual `Particular` como primeira tabela catalogada.

Leitura binaria observada:

- registro inicial com `NROTAB`/identificador binario `1`
- nome exibido: `Particular`
- o arquivo possui `558` bytes e esta organizado em `9` registros fixos de `62` bytes
- o nome da tabela fica em um campo UTF-16LE fixo de `40` bytes a partir do offset `6`

## 4. Evidencia dos procedimentos

O arquivo `TAB_PRC_ITEM.raw` contem os registros de procedimentos associados ao catalogo de tabelas do desktop.

Exemplos de nomes vistos no dump bruto:

- `Coroa metalo-cerâmica`
- `Coroa metalo-plástica`
- `Coroa Isosit`
- `Coroa metálica total`
- `Restauração metálica-fundida`

## 5. Limite técnico encontrado

Foi possivel ler os dumps brutos com conversao Unicode, mas a consulta direta ao servidor informado no DSN nao foi concluida com as ferramentas disponiveis, por incompatibilidade de autenticacao/driver com o SQL Server legado.

Em complemento, o `TAB_PRC_ITEM.raw` mostrou-se binario legado com segmentos UTF-16LE e campos numericos prefixados, mas o layout completo ainda nao fecha com seguranca suficiente para gerar a extracao canonica dos itens sem heuristica silenciosa.

Portanto, esta etapa fecha:

- localizacao fisica;
- evidencia textual da tabela `Particular`;
- evidencia do catalogo de itens;
- existencia da fonte no desktop.

E deixa pendente:

- extracao SQL direta autenticada;
- contagem fechada por consulta ao servidor;
- snapshot canônico completo;
- comparacao com o Brana;
- apply controlado.

No estado atual, o preview Brana da tabela `PARTICULAR` continua com `336` registros. A fonte legada RAW ainda precisa da decodificacao fechada de `TAB_PRC_ITEM.raw` para confirmar se a fonte fisica entrega o mesmo conjunto ou apenas parte dele.

## 6. Conclusao

A fonte fisica da tabela `PARTICULAR` foi localizada no desktop EasyDental em `Y:\EDS70`, com catalogo em `TAB_PRC.raw` e itens em `TAB_PRC_ITEM.raw`.

O proximo passo seguro e obter acesso de leitura autenticada ao banco legado para consolidar contagem, chave e snapshot sem ambiguidade.

## 7. Fechamento do parser RAW

- O `TAB_PRC_ITEM.raw` passou a ser lido por parser deterministico com cabecalho `NROTAB` + `NROPROCTAB` + tag + tamanho do nome.
- O nome do procedimento inicia em `offset 12` do registro e usa UTF-16LE.
- O sufixo padrao tem `56` bytes na maioria dos registros confirmados.
- A Particular foi confirmada em `NROTAB = 1`.
- O inventario final confirmou `107` registros validos da Particular, com `107` codigos unicos.
- A comparacao inicial com o Brana atual mostrou `107` itens na origem e `336` no destino, com divergencias esperadas de cobertura.
- Snapshot e preview foram gerados em modo somente leitura, sem escrita no EasyDental ou no Brana.

## 8. Correção da leitura parcial

A leitura anterior estava parcial: o parser aceitava apenas a variante de cabeçalho mais comum e parava antes de incluir todos os registros válidos da tabela `Particular`.

Revisando o binário com ancoragem por string UTF-16LE, a fonte legada confirma `112` registros de `NROTAB = 1`, com os seguintes itens antes ignorados por causa da tag `00 00`:

- `1011` - `Restauração de amálgama`
- `1013` - `Restauração de ionômero de vidro`
- `1082` - `Ajustes de prótese`
- `1107` - `Restauração MOD Amálgama`
- `1110` - `Restauração DO Resina`
- `1111` - `Restauração MOD Resina`

Conclusão desta auditoria:

- o snapshot anterior de `107` foi parcial e não deve ser tratado como canonico;
- a leitura corrigida sobe a fonte legada para `112` registros;
- o total `336` permanece como divergencia do destino Brana e nao como prova da fonte fisica;
- o apply continua bloqueado ate a origem da cobertura extra ser comprovada em outra fonte operacional.
## 9. Fechamento operacional SQL

A leitura operacional autenticada do EasyDental foi confirmada em modo somente leitura.

- servidor: `DELL_SERVIDOR\EDS70`
- database: `eds70`
- motor: `Microsoft SQL Server 2000 - 8.00.760`
- tabela operacional: `TAB_PRC`
- tabela de itens: `TAB_PRC_ITEM`
- `NROTAB` operacional da `PARTICULAR`: `10`
- total operacional: `336`

Consulta utilizada:

```sql
SELECT
    NROTAB,
    NROPROCTAB,
    CODCONV,
    DESCRICAO,
    NROSIM,
    ESPECIAL,
    VALOR_REPASSE,
    VALOR_PACIENTE,
    TIPOCOBR,
    OBSERV,
    INATIVO,
    MOSTRAR_SIMBOLO,
    GARANTIA,
    PREFERIDO
FROM TAB_PRC_ITEM
WHERE NROTAB = 10
ORDER BY NROPROCTAB
```

Snapshot operacional e preview de comparacao foram gerados sem qualquer escrita em banco:

- `backend/snapshots/easydental/particular_operacional_336_procedimentos.json`
- `backend/snapshots/easydental/particular_operacional_336_procedimentos.csv`
- `docs/preview_sincronizacao_particular_operacional.json`
- `docs/preview_sincronizacao_particular_operacional.csv`

Comparacao consolidada por codigo com o Brana:

- tabela correspondente: `procedimento_tabela.id=18`, `codigo=4`, `nome=PARTICULAR`
- total Brana: `336`
- classificacao: `A=64`, `C=33`, `D=239`
- correspondencias por codigo: `97`
- somente EasyDental: `239`
- somente Brana: `239`
- idempotencia: confirmada em duas execucoes consecutivas
## 10. Contrato fechado de reconciliação da PARTICULAR

- A reconciliação oficial ficou separada em dois blocos: `167` registros confiáveis e `169` registros bloqueados para validação manual.
- A chave semântica principal é o nome normalizado.
- A origem numérica é híbrida:
  - `103` correspondências confiáveis preservam `CODCONV`;
  - `64` correspondências confiáveis preservam `NROPROCTAB`.
- Não existe uma única chave numérica válida para os `336` itens.
- Nenhum registro bloqueado entra como apto.
- Os artefatos finais desta etapa são:
  - `docs/preview_apply_particular_correspondencias_confiaveis.json`
  - `docs/preview_apply_particular_correspondencias_confiaveis.csv`
  - `docs/reconciliacao_manual_particular_pendencias.json`
  - `docs/reconciliacao_manual_particular_pendencias.csv`
- Idempotência do preview: confirmada em duas execuções consecutivas com hashes iguais.

## 11. Validação dirigida da confiança média

- Os `103` registros de confiança média foram auditados de forma dirigida.
- Nenhum deles recebeu promoção para `PROMOVIDO_ALTA`.
- Todos permaneceram em `MANTIDO_MEDIA`.
- Nenhum caso foi classificado como `BLOQUEADO_CONFLITO`.
- O resultado confirmou que a evidência auxiliar atual ainda é insuficiente para liberar apply.
- Os arquivos de apoio desta etapa são:
  - `docs/preview_validacao_dirigida_particular_confianca_media.json`
  - `docs/preview_validacao_dirigida_particular_confianca_media.csv`
  - `docs/preview_apply_particular_correspondencias_confiaveis_v2.json`
  - `docs/preview_apply_particular_correspondencias_confiaveis_v2.csv`
  - `docs/reconciliacao_particular_pendencias_v2.json`
  - `docs/reconciliacao_particular_pendencias_v2.csv`

## 12. Auditoria da exportação CSV do EasyDental

- Arquivo localizado na Área de Trabalho: `C:\Users\Tel\Desktop\TABELA_PARTICULAR.csv`
- Nome exato: `TABELA_PARTICULAR.csv`
- Extensão real: `.csv`
- Tamanho: `24426` bytes
- Hash SHA-256: `835cc44f3923109e11deee535c66468656f60705f8b7fcfb1cc6e0cb82a72458`
- Encoding real: `cp1252`
- Delimitador real: NUL (`\\x00`) entre campos, com aspas
- Terminador de linha: `CRLF`
- BOM: ausente
- Linhas físicas: `352`
- Registros de dados: `336`
- Cabeçalhos realmente presentes:
  - `Código`
  - `Intervenção`
  - `Especialidade`
  - `Val paciente (R$)`
- Estrutura real:
  - relatório paginado salvo em texto;
  - título de relatório;
  - cabeçalho repetido em quebra de página;
  - rodapé de total;
  - copyright final.
- Código exibido no CSV:
  - `97` linhas vazias;
  - `239` linhas preenchidas;
  - quando preenchido, coincide com `CODCONV`;
  - não coincide com `NROPROCTAB`.
- Comparação CSV x SQL operacional:
  - `336/336` nomes coincidem por ordem normalizada;
  - `336/336` especialidades coincidem por ordem;
  - `336/336` preços coincidem por ordem;
  - o CSV respeita o snapshot operacional como evidência adicional.
- Comparação CSV x Brana:
  - `167` correspondências por nome;
  - `169` permanecem fora do conjunto do Brana com este arquivo;
  - sem conflito novo de mojibake.

## 13. Reabertura da frente para correcao textual da PARTICULAR

- A frente foi reaberta em modo exclusivamente textual para a tabela `PARTICULAR` do Brana Cloud.
- Escopo confirmado nesta reabertura: apenas `procedimento.nome`.
- O preview preparado para esta etapa e somente leitura e esta em:
  - `docs/preview_correcao_textual_particular_operacional.json`
  - `docs/preview_correcao_textual_particular_operacional.csv`
- O script de dry-run/diagnostico foi preparado em:
  - `backend/scripts/preview_correcao_textual_particular_operacional.py`
- Resultado tecnico desta leitura:
  - `336` registros carregados no Brana;
  - `167` nomes ja coincidem com a fonte canonica;
  - `106` nomes apresentam marcador explicito de corrupcao textual;
  - `63` divergencias textuais nao classificadas como mojibake direto;
  - `0` candidatos automaticos seguros para apply nesta passada.
- O apply permanece bloqueado.
- Nenhum `UPDATE` foi executado.

## 14. Promocao dos casos seguros

- A triagem foi refinada para separar:
  - `106` registros com corrupcao textual explicita e correspondencia canonica inequívoca;
  - `63` divergencias textuais mantidas para revisao manual, incluindo `1` bloqueado;
  - `167` nomes mantidos como corretos.
- Os artefatos seguros e de revisao foram gerados em:
  - `docs/preview_correcao_textual_particular_segura.json`
  - `docs/preview_correcao_textual_particular_segura.csv`
  - `docs/revisao_manual_particular_divergencias_textuais.json`
  - `docs/revisao_manual_particular_divergencias_textuais.csv`
- O apply continua bloqueado.
