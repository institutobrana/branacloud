## Atualizacao operacional

A tabela `PARTICULAR` foi reaberta em leitura operacional direta no SQL Server legado e passou a ter a fonte oficial desta correcao:

- servidor: `DELL_SERVIDOR\EDS70`
- database: `eds70`
- total operacional: `336`
- tabela correspondente no Brana: `procedimento_tabela.id=18`, `codigo=4`, `nome=PARTICULAR`

Na comparacao por codigo entre EasyDental e Brana:

- `A = 64`
- `C = 33`
- `D = 239`
- `E = 239`
- `matched = 97`

Os nomes com mojibake continuam sendo registrados apenas quando aparecem no Brana, sem replace manual.

# Auditoria de Mojibake nos Dados das Tabelas de Procedimentos

## Escopo confirmado

- Módulo: `Tabelas -> Procedimentos`
- Rota: `/app/tabelas/procedimentos`
- Frente fora de escopo nesta auditoria: `Procedimentos genéricos`, `Materiais`, `Tabelas auxiliares`, `Tabela exemplo`

## Tabelas técnicas confirmadas

- `PARTICULAR` -> código `4`
- `CAIXA ECONOMICA FEDERAL` -> código `5`
- `EASY - PARTICULAR` -> código `10`
- `UNIMED - ODONTO` -> código `11`

## Evidências de leitura

### Banco

- `server_encoding`: `UTF8`
- `client_encoding`: `UTF8`
- Coluna `procedimento.nome`: `character varying` / `text` conforme tabela legada do ORM, retornando texto já corrompido nas tabelas afetadas.

### API

- Endpoint: `GET /procedimentos`
- O payload do backend repassa exatamente os mesmos textos armazenados no banco.
- Não foi encontrado mapeamento de correção textual no endpoint.

### React

- O frontend renderiza os nomes recebidos da API sem correção textual global.
- Não foi encontrado normalizador de mojibake para os nomes das linhas.

## Matriz resumida de 20 registros

### PARTICULAR

| Tabela | ID | Código | Banco | API | React | Camada da corrupção |
| --- | --- | --- | --- | --- | --- | --- |
| PARTICULAR | 40674 | 3000 | `Abertura de implante - (Giro de retalho)` | igual | igual | nenhuma |
| PARTICULAR | 40675 | 3010 | `Abertura de implante - (Osteotomia)` | igual | igual | nenhuma |
| PARTICULAR | 40676 | 3020 | `Abertura de implante - (Plastia)` | igual | igual | nenhuma |
| PARTICULAR | 40677 | 3030 | `Abertura de implante mand. - (Enxerto Livre)` | igual | igual | nenhuma |
| PARTICULAR | 40678 | 3040 | `Abertura de implante mand. - (Osteotomia e Livre)` | igual | igual | nenhuma |

### CAIXA ECONOMICA FEDERAL

| Tabela | ID | Código | Banco | API | React | Camada da corrupção |
| --- | --- | --- | --- | --- | --- | --- |
| CAIXA ECONOMICA FEDERAL | 51918 | 5052 | `AdequaÆo de meio bucal` | igual | igual | banco/importação |
| CAIXA ECONOMICA FEDERAL | 51941 | 5075 | `Ajuste oclusal` | igual | igual | nenhuma |
| CAIXA ECONOMICA FEDERAL | 51874 | 5008 | `Alveoloplastia` | igual | igual | nenhuma |
| CAIXA ECONOMICA FEDERAL | 51904 | 5038 | `Apicetomia - incisivos e caninos` | igual | igual | nenhuma |
| CAIXA ECONOMICA FEDERAL | 51905 | 5039 | `Apicetomia - molares e pr-molares` | igual | igual | banco/importação |

### EASY - PARTICULAR

| Tabela | ID | Código | Banco | API | React | Camada da corrupção |
| --- | --- | --- | --- | --- | --- | --- |
| EASY - PARTICULAR | 52036 | 1082 | `Ajustes de pr¢tese` | igual | igual | banco/importação |
| EASY - PARTICULAR | 52004 | 1050 | `Apicectomia de anteriores` | igual | igual | nenhuma |
| EASY - PARTICULAR | 52006 | 1052 | `Apicectomia de anteriores + retr¢grada` | igual | igual | banco/importação |
| EASY - PARTICULAR | 52005 | 1051 | `Apicectomia de posteriores` | igual | igual | nenhuma |
| EASY - PARTICULAR | 52007 | 1053 | `Apicectomia de posteriores + retr¢grada` | igual | igual | banco/importação |

### UNIMED - ODONTO

| Tabela | ID | Código | Banco | API | React | Camada da corrupção |
| --- | --- | --- | --- | --- | --- | --- |
| UNIMED - ODONTO | 52067 | 1 | `Acompanhamento de Tratamento/Procedimento Cirurgico` | igual | igual | nenhuma |
| UNIMED - ODONTO | 52190 | 127 | `Ajuste Oclusal por Acrscimo` | igual | igual | banco/importação |
| UNIMED - ODONTO | 52116 | 52 | `Ajuste Oclusal por Desgaste Seletivo` | igual | igual | nenhuma |
| UNIMED - ODONTO | 52068 | 2 | `Alveoloplastia` | igual | igual | nenhuma |
| UNIMED - ODONTO | 52069 | 3 | `AmputaÆo Radicular com ObturaÆo Retr¢grada` | igual | igual | banco/importação |

## Classificação

- Banco correto: não comprovado nas quatro tabelas afetadas.
- API correta: não, porque reproduz os mesmos textos do banco.
- React correto: não corrige nem altera os textos recebidos.
- Camada real da corrupção: banco/importação.

## Hipótese técnica provável

- A origem mais provável é a importação dos procedimentos legados.
- O fluxo de leitura do importador de procedimentos usa extração via `OSQL.EXE` em `backend/scripts/migrar_tabelas_procedimentos_easy.py`.
- A correção definitiva exige reimportação ou atualização controlada dos registros afetados, mas não foi executada nesta etapa por falta de autorização explícita para escrita.

## Pendência

- Preparação concluída para a correção controlada:
  - importador de procedimentos ajustado para ler a saída do `OSQL.EXE` em `cp850`;
  - script de preview/dry-run criado em `backend/scripts/preview_correcao_mojibake_procedimentos.py`;
  - contrato de execução sem escrita registrado em `docs/contrato_correcao_mojibake_procedimentos_brana_cloud.md`.
- Nenhum `UPDATE`, `INSERT`, `DELETE`, `ALTER`, `TRUNCATE` ou reimportação foi executado.
- A execução de qualquer escrita futura continua condicionada à autorização explícita e a backup validado.

## Fechamento do dry-run

- `rows=360` significa o total de linhas comparadas no preview da clínica `1` para as tabelas em escopo `5`, `10` e `11`.
- O preview não usa `rows=461` como número de `UPDATEs`.
- Matriz fechada do preview:
  - tabela `5`: `88` linhas;
  - tabela `10`: `112` linhas;
  - tabela `11`: `160` linhas.
- Classificação consolidada:
  - `A` texto atual já correto: `67`;
  - `B` mojibake comprovado e corrigível: `168`;
  - `C` diferença não atribuível com segurança a encoding: `22`;
  - `D` correspondência ambígua: `0`;
  - `E` sem correspondente na origem: `112`;
  - `F` duplicidade de chave: `0`;
  - `G` mudança vazia ou idêntica: `0`;
  - `H` fora do escopo: `0`;
  - `I` bloqueado por segurança: `0`.
- Totais por tabela:
  - tabela `5`: total `88`, corretos `31`, mojibake `54`, correção segura `54`, não-encoding `3`, sem correspondente `0`;
  - tabela `10`: total `112`, corretos `0`, mojibake `0`, correção segura `0`, não-encoding `0`, sem correspondente `112`;
  - tabela `11`: total `160`, corretos `36`, mojibake `114`, correção segura `114`, não-encoding `10`, sem correspondente `0`.
- A tabela `4` foi reaberta para preview somente leitura nesta etapa e entrou na matriz consolidada como `E=336`, sem candidatos seguros e sem liberar apply.
- Chave de correspondência: `tabela_codigo + procedimento_codigo`, derivada no script a partir de `NROTAB` e `NROPROCTAB`.
- Colisões observadas na chave: `0`.
- Estrategia recomendada: manter a tabela `10` bloqueada, validar novamente a segmentação dos casos `B` versus `C` antes de qualquer escrita e somente então reavaliar `5` e `11`.
- Arquivos de relatório gerados no dry-run:
  - `docs/preview_correcao_mojibake_procedimentos.json`
  - `docs/preview_correcao_mojibake_procedimentos.csv`
- O preview agora exporta `procedimento_id`, `clinica_id`, `tabela_id`, `codigo`, `nome_atual`, `nome_origem`, `categoria` e `chave_origem` para cada linha.
- A geração de backup foi bloqueada pelo contrato porque as contagens atuais do preview não bateram com os números esperados fechados anteriormente.
- A regra final de B ficou restrita a mojibake comprovado no nome atual com fonte única correspondente; C ficou para diferenças editoriais, numéricas, de pontuação ou sem marcador confiável de encoding.
- Os testes locais de classificação executados com os exemplos do contrato passaram.
- Hashes dos relatórios:
  - JSON: `bc09080fafa956cb4f485cb817544e61ee1414fca1bec954a087c4c302f0af62`
  - CSV: `060a4bea1212cf2d6797d05b7be636b435e52d3b6e0a96d51823eaae7ea596d4`
- O backup real da tabela 5 foi gerado em `backend/backups/mojibake_procedimentos/backup_tabela_5.json`, com `54` registros, `schema_version` `1.1` e hash `34e79fd6dc29640d7091422b8e2ba1639a745ebaf4acbfb8c404dc12fbfa212e`.
- A validação do backup passou para os scripts `apply` e `rollback` em modo somente leitura.
- No backup gerado, `tabela_id` guarda a chave técnica interna da tabela (`47` para a tabela código `5`), enquanto `tabela_codigo` preserva o valor de negócio `5`.
- A aplicação controlada da correção foi executada com sucesso para a tabela código `5`, com `54` atualizações e `0` já corretos no lote aplicado.
- A validação final confirmou `GET /me` com `200`, `GET /procedimentos?tabela_id=5` com `200` e `GET /procedimentos/filtros` com `200`; no navegador autenticado a tela `Tabelas -> Procedimentos` abriu com a tabela real, sem mojibake visível e com a coluna `Custo Lab.` presente no cabeçalho.

- A frente 11 foi preparada e validada em continuidade da frente 5: o preview consolidado voltou com `A=36`, `B=114`, `C=10`, `E=0`, `procedimento_id` preenchido em `160/160`, `clinica_id` preenchido em `160/160`, sem duplicidades de chave nem de `procedimento_id`.
- A tabela `4` foi reaberta em leitura pura nesta etapa: o preview especifico gerou `336` linhas, todas classificadas como `E`, com `tabela_id` tecnico `18`, `clinica_id` `1`, zero duplicidades de chave e zero candidatos B seguros.

- O fechamento documental do Painel de Cadastro foi consolidado depois da correcao de mojibake: a frente continua aberta apenas para as proximas etapas funcionais de Financeiro e Materiais.

## Atualizacao recente da frente Particular

- O parser de `TAB_PRC_ITEM.raw` foi fechado em modo deterministico, com leitura somente leitura do arquivo fisico do EasyDental Desktop.
- A Particular foi confirmada em `NROTAB=1` com `107` procedimentos validos e codigos unicos.
- A comparacao inicial com o Brana atual mostrou `107` itens de origem contra `336` no destino, sem escrita em banco.
- O snapshot canonico e o preview de sincronizacao foram gerados fora de qualquer apply.
## Atualizacao da Particular

- A reconciliação definitiva da PARTICULAR passou a separar `167` correspondências confiáveis de `169` pendências manuais.
- A chave semântica principal é o nome normalizado.
- `CODCONV` e `NROPROCTAB` ficaram restritos a evidência auxiliar.
- Não foram detectados nomes com mojibake na tabela Brana ao revisar a PARTICULAR nesta etapa.
- A validação dirigida dos `103` casos médios não adicionou nenhum novo suspeito de mojibake.
- O total suspeito permaneceu em `0`, na clínica `1`, tabela `PARTICULAR` (`tabela_id=18`).
- A exportação CSV do usuário também não trouxe sinais de mojibake: foi lida em `cp1252`, sem BOM, com relatório paginado e campos legíveis.
## Reabertura textual da PARTICULAR

- A PARTICULAR foi reaberta em uma trilha separada de correcao exclusivamente textual do campo `procedimento.nome`.
- A nova leitura do Brana encontrou `336` registros, dos quais:
  - `167` coincidem com a fonte canonica;
  - `106` exibem marcador explicito de corrupcao textual;
  - `63` apresentam divergencias textuais sem reparo automatico seguro nesta passada.
- O preview diagnostico desta reabertura foi gerado sem escrita em:
  - `docs/preview_correcao_textual_particular_operacional.json`
  - `docs/preview_correcao_textual_particular_operacional.csv`
- O dry-run preparado ficou em:
  - `backend/scripts/preview_correcao_textual_particular_operacional.py`
- Nao houve apply, backup nem alteracao de banco nesta passada.

## Promocao segura da PARTICULAR

- A reclassificacao separou:
  - `106` registros como `CORRIGIVEL_SEGURO`;
  - `63` registros como `REVISAR_AMBIGUIDADE` ou `BLOQUEADO`;
  - `167` registros como mantidos corretos.
- Os artefatos finais desta triagem sao:
  - `docs/preview_correcao_textual_particular_segura.json`
  - `docs/preview_correcao_textual_particular_segura.csv`
  - `docs/revisao_manual_particular_divergencias_textuais.json`
  - `docs/revisao_manual_particular_divergencias_textuais.csv`
- O apply continua bloqueado nesta etapa.
