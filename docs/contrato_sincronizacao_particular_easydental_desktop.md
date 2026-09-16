## 7. Fechamento operacional SQL

O contrato permanece somente leitura, mas a fonte operacional correta agora esta confirmada no SQL Server legado.

- servidor: `DELL_SERVIDOR\EDS70`
- database: `eds70`
- tabela operacional: `TAB_PRC_ITEM`
- `NROTAB`: `10`
- total operacional: `336`
- tabela correspondente no Brana: `procedimento_tabela.id=18`, `codigo=4`, `nome=PARTICULAR`

Arquivos gerados nesta etapa:

- `backend/snapshots/easydental/particular_operacional_336_procedimentos.json`
- `backend/snapshots/easydental/particular_operacional_336_procedimentos.csv`
- `docs/preview_sincronizacao_particular_operacional.json`
- `docs/preview_sincronizacao_particular_operacional.csv`

Resultado consolidado:

- classificacao: `A=64`, `C=33`, `D=239`
- correspondencias por codigo: `97`
- somente EasyDental: `239`
- somente Brana: `239`
- idempotencia: confirmada
- apply: continua bloqueado

# Contrato - Sincronizacao da tabela PARTICULAR do EasyDental Desktop

## 1. Regra

A tabela `PARTICULAR` do EasyDental Desktop e a fonte candidata para atualizar a tabela tecnica do Brana Cloud somente quando a leitura autenticada do legado confirmar a equivalencia sem ambiguidade.

## 2. Fonte fisica

- `Y:\EDS70\Dados\Dist\TAB_PRC.raw`
- `Y:\EDS70\Dados\Dist\TAB_PRC_ITEM.raw`

## 2.1 Evidencia estrutural ja comprovada

- `TAB_PRC.raw` tem `558` bytes e se divide em `9` registros de `62` bytes.
- O nome de cada tabela em `TAB_PRC.raw` esta em UTF-16LE, campo fixo de `40` bytes, apos um cabecalho binario inicial.
- `TAB_PRC_ITEM.raw` contem cadeias UTF-16LE e campos numericos prefixados, mas o layout total ainda nao fechou com seguranca suficiente para uma extracao canonica dos itens sem heuristica.

## 3. Estrategia segura

- nao alterar EasyDental;
- nao alterar outras tabelas do Brana;
- nao recriar registros;
- nao mudar IDs;
- nao apagar vinculos locais;
- nao executar apply sem leitura autenticada e preview fechado.

## 4. Situação atual

Nesta etapa, a fonte fisica foi localizada, mas a consulta SQL direta ao servidor legado nao foi concluida com as ferramentas disponiveis.

Logo:

- nao existe snapshot canonico final;
- nao existe backup de apply;
- nao existe preview fechado;
- nao existe autorizacao tecnica suficiente para escrita;
- a etapa permanece em auditoria.

Em paralelo, a comparacao Brana ja dispoe de preview com `336` registros para a tabela `PARTICULAR`, o que confirma a necessidade de fechar o parser RAW antes de qualquer tentativa de sincronizacao.

## 5. Proximo passo

Obter uma via autentica de leitura do banco legado e fechar:

- contagem exata;
- chave de correspondencia;
- snapshot UTF-8;
- hash;
- preview de divergencias.

## 6. Fechamento tecnico do parser

- Estrutura confirmada no RAW: `NROTAB` + `NROPROCTAB` + tag + tamanho UTF-16LE do nome + nome + sufixo binario.
- `NROTAB` ficou confirmado em `1` para a Particular.
- `NROPROCTAB` ficou confirmado como chave unica dos 112 registros validos recuperados do arquivo.
- O nome permanece em UTF-16LE a partir do `offset 12`.
- O sufixo binario padrao tem `56` bytes na maioria dos registros.
- Snapshot/preview foram produzidos apenas em leitura, sem nenhum apply.

## 7. Observacao de correção

O inventario anterior de `107` itens era parcial. A varredura corrigida incluiu as entradas com tag `00 00` e fechou `112` registros validos da Particular no RAW.

O total `336` permanece como divergencia do destino Brana, nao como prova de que a fonte fisica do EasyDental contenha esse mesmo volume na particula `PARTICULAR`.
## 8. Contrato definitivo de reconciliação segura da PARTICULAR

- O contrato final separa a tabela em dois grupos:
  - `167` correspondências automáticas confiáveis;
  - `169` pendências bloqueadas para validação manual.
- A chave semântica principal é o nome normalizado.
- A chave numérica é híbrida e apenas auxiliar:
  - `103` casos confiáveis batem com `CODCONV`;
  - `64` casos confiáveis batem com `NROPROCTAB`.
- Não existe chave numérica única para os `336` itens.
- Apply futuro somente pode considerar registros:
  - com correspondência única;
  - sem ambiguidade;
  - com confiança alta ou média documentada;
  - sem alteração de chaves protegidas;
  - com preview aprovado.
- Apply futuro não pode tocar em:
  - `id`;
  - `tabela_id`;
  - `codigo` atual;
  - `procedimento_generico_id`;
  - vínculos com materiais;
  - vínculos clínicos;
  - históricos;
  - chaves estrangeiras;
  - qualquer campo sem correspondência comprovada.
- Artefatos gerados:
  - `docs/preview_apply_particular_correspondencias_confiaveis.json`
  - `docs/preview_apply_particular_correspondencias_confiaveis.csv`
  - `docs/reconciliacao_manual_particular_pendencias.json`
  - `docs/reconciliacao_manual_particular_pendencias.csv`

## 9. Fechamento da confiança média

- Os `103` registros classificados como confiança média foram reavaliados individualmente.
- Nenhum deles foi promovido para alta.
- Nenhum deles foi bloqueado por conflito funcional novo.
- O contrato continua exigindo `nome normalizado` como chave semântica principal.
- `CODCONV` e `NROPROCTAB` seguem apenas como evidência auxiliar.
- Apply permanece bloqueado enquanto não surgir evidência adicional objetiva.
- Artefatos gerados:
  - `docs/preview_validacao_dirigida_particular_confianca_media.json`
  - `docs/preview_validacao_dirigida_particular_confianca_media.csv`
  - `docs/preview_apply_particular_correspondencias_confiaveis_v2.json`
  - `docs/preview_apply_particular_correspondencias_confiaveis_v2.csv`
  - `docs/reconciliacao_particular_pendencias_v2.json`
  - `docs/reconciliacao_particular_pendencias_v2.csv`

## 10. Contrato da exportação CSV do EasyDental

- O arquivo exportado do usuário é um relatório texto/CSV em `cp1252`, com campos separados por `NUL` (`\\x00`).
- O nome real confirmado é `TABELA_PARTICULAR.csv`.
- O arquivo não foi renomeado, editado ou sobrescrito.
- A estrutura é de relatório paginado, não de CSV puro.
- O código exibido no arquivo:
  - fica vazio em `97` linhas;
  - coincide com `CODCONV` em `239` linhas;
  - não coincide com `NROPROCTAB`.
- A evidência reforça que:
  - `nome normalizado` continua sendo a chave semântica principal;
  - `CODCONV` é a evidência auxiliar exibida no CSV;
  - `NROPROCTAB` continua sendo a chave operacional do SQL, não a coluna exportada.

## 11. Contrato de preparacao da correcao textual da PARTICULAR

- Esta frente permanece **somente preparatoria** e nao autoriza apply.
- Escopo textual confirmado: apenas `procedimento.nome` da tabela `PARTICULAR` do Brana Cloud.
- O preview de leitura foi preparado em:
  - `docs/preview_correcao_textual_particular_operacional.json`
  - `docs/preview_correcao_textual_particular_operacional.csv`
- O dry-run diagnostico foi preparado em:
  - `backend/scripts/preview_correcao_textual_particular_operacional.py`
- O backup planejado para uma futura escrita, se aprovada, deve seguir o padrão:
  - `backend/backups/particular_nomes_antes_correcao_<data>.json`
  - `backend/backups/particular_nomes_antes_correcao_<data>.csv`
- O apply futuro somente pode ser considerado depois de:
  - backup validado;
  - preview aprovado;
  - correspondencia tecnica fechada por nome canonico;
  - autorizacao explicita do usuario.
- Nesta passada:
  - nao houve `UPDATE`;
  - nao houve `INSERT`;
  - nao houve `DELETE`;
  - nao houve `apply`.

## 12. Contrato de promocao segura

- A promocao segura separa os `106` casos de corrupcao textual explicita dos `63` casos que devem permanecer em revisao manual.
- Os `63` casos de revisao manual incluem o bloqueado `Procedimento 5200`.
- O preview seguro final e os artefatos de revisao manual sao:
  - `docs/preview_correcao_textual_particular_segura.json`
  - `docs/preview_correcao_textual_particular_segura.csv`
  - `docs/revisao_manual_particular_divergencias_textuais.json`
  - `docs/revisao_manual_particular_divergencias_textuais.csv`
- O apply futuro continua condicionado a:
  - backup validado;
  - preview seguro aprovado;
  - revisao manual dos 63 divergentes;
  - autorizacao explicita do usuario.
