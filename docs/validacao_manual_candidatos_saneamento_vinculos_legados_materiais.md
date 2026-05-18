# Valida??o manual dos candidatos a saneamento de v?nculos legados de materiais

## 1. Objetivo
Classificar, de forma documental e conservadora, os candidatos a v?nculos legados de materiais identificados na decis?o t?cnica anterior, sem executar qualquer saneamento, limpeza ou escrita no banco.

## 2. Diret?rio real
D:\BRANA ARQUIVOS\BRANA CLOUD

## 3. Confirma??o de etapa documental/valida??o
Esta ? uma etapa documental e de valida??o, sem altera??o funcional, sem aplica??o de patch e sem modifica??o de banco ou c?digo.

## 4. Escopo
- Consolidar a classifica??o dos 224 procedimentos com procedimento_generico_id nulo/vazio e materiais vinculados
- Destacar os 23 casos classificados como seguro prov?vel
- Detalhar os 99 casos classificados como revis?o manual
- Resumir os 102 casos n?o sane?veis automaticamente
- Destacar o caso 5000 / 40595 em Particular

## 5. Fora de escopo
- Apagar dados
- Alterar c?digo
- Alterar banco, schema, migration ou endpoints
- Corrigir comportamento
- Alterar frontend/app.js
- Alterar frontend/js/modules/materiais.js
- Alterar frontend/js/modules/procedimentos-genericos.js
- Alterar backend

## 6. Documentos analisados
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_ampla_generico_selecione_materiais_residuais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\decisao_tecnica_saneamento_vinculos_legados_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_origem_lista_materiais_troca_generico_intervencoes.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\auditoria_arquitetura_origem_materiais_proprio_herdado.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\materiais_mapa_extracao_funcoes_pos_vinculos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`

## 7. Arquivos consultados somente em leitura
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\services\vinculos_materiais.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\procedimentos_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\routes\cadastros_routes.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backend\models\procedimento_generico.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\materiais.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\procedimentos-genericos.js`

## 8. Consultas SELECT executadas
- SELECT de procedimento/interven??o 5000 e seus v?nculos diretos
- SELECT de materiais do gen?rico 00205 - Botox (ids 614, 628, 669)
- SELECT de todos os procedimentos com procedimento_generico_id nulo/vazio e materiais vinculados
- SELECT de todos os procedimentos com procedimento_generico_id preenchido e materiais diretos
- SELECT de contagem distinta de procedimentos por categoria e por tabela
- SELECT de compara??o por footprint (material_id + quantidade, com valida??o derivada de custo/relacao)

## 9. Crit?rios usados
### Seguro prov?vel
- procedimento_generico_id nulo/vazio
- v?nculos diretos presentes
- match exato com exatamente um gen?rico conhecido
- coer?ncia por material_id e quantidade
- sem duplicidade interna
- sem materiais extras
- sem diverg?ncia relevante
- sem evid?ncia de material pr?prio real individualizado

### Revis?o manual
- match parcial
- materiais extras
- diferen?a de quantidade
- duplicidade interna
- m?ltiplos gen?ricos poss?veis
- tabela/descri??o amb?gua
- mistura de pr?prio real + herdado materializado

### N?o sane?vel automaticamente
- sem match claro com gen?rico
- prov?vel material pr?prio real
- informa??o insuficiente
- risco alto de perda de dados
- baixa confian?a no footprint

## 10. Totais gerais
- procedimentos analisados: 224
- v?nculos analisados: 6249
- seguro prov?vel: 23
- revis?o manual: 99
- n?o sane?vel automaticamente: 102

## 11. Tabela dos 23 casos seguro prov?vel
| id interno | c?digo | nome/descri??o | tabela | v?nculos | gen?rico melhor match | match % | motivo | recomenda??o |
| --- | ---: | --- | --- | ---: | --- | ---: | --- | --- |
| 1070 | 6 | CIMENTAÇÃO COROA T | Tabela Exemplo | 19 | 394 - Recolocação de restauração metálica fundida e coroa | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51400 | 6 | CIMENTAÇÃO COROA T |  | 19 | 394 - Recolocação de restauração metálica fundida e coroa | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1073 | 9 | CLAREAMENTO CASEIRO | Tabela Exemplo | 26 | 84 - Coroa "pivot" com base fundida em liga de ouro | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51403 | 9 | CLAREAMENTO CASEIRO |  | 26 | 84 - Coroa "pivot" com base fundida em liga de ouro | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1084 | 20 | ENDO MOLAR | Tabela Exemplo | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51414 | 20 | ENDO MOLAR |  | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1085 | 21 | ENDO PRÉ | Tabela Exemplo | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51415 | 21 | ENDO PRÉ |  | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1097 | 33 | INSTRUÇÃO HIG | Tabela Exemplo | 18 | 156 - Ensino de higiene oral | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51427 | 33 | INSTRUÇÃO HIG |  | 18 | 156 - Ensino de higiene oral | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1102 | 38 | PLACA DE MORDIDA | Tabela Exemplo | 20 | 292 - Placa de mordida | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51432 | 38 | PLACA DE MORDIDA |  | 20 | 292 - Placa de mordida | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1104 | 40 | PPF PROV LAB | Tabela Exemplo | 32 | 105 - Coroa provisória | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51434 | 40 | PPF PROV LAB |  | 32 | 105 - Coroa provisória | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 715 | 43 | PREENCHEDOR | Tabela Exemplo | 15 | 627 - Preenchimento | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1107 | 43 | PREENCHEDOR | Tabela Exemplo | 15 | 613 - Preenchimento | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51437 | 43 | PREENCHEDOR |  | 15 | 613 - Preenchimento | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51493 | 43 | PREENCHEDOR |  | 15 | 627 - Preenchimento | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51439 | 48 | PRÓTESE FIXA ADESIVA |  | 36 | 308 - Prótese adesiva | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51441 | 50 | PRÓTESE TOTAL |  | 22 | 350 - Prótese total | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51442 | 51 | PT IMEDIADA |  | 22 | 350 - Prótese total | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 1120 | 60 | TRAÇÃO ORTO | Tabela Exemplo | 29 | 72 - Cirurgia para tração ortodôntica | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |
| 51450 | 60 | TRAÇÃO ORTO |  | 29 | 72 - Cirurgia para tração ortodôntica | 100.00 | Match exato com um ?nico gen?rico, sem duplicidade interna. | Candidato a saneamento futuro com backup. |

## 12. Tabela dos 99 casos revis?o manual
| id interno | c?digo | nome/descri??o | tabela | v?nculos | gen?rico melhor match | match % | diverg?ncias encontradas | motivo | recomenda??o |
| --- | ---: | --- | --- | ---: | --- | ---: | --- | --- | --- |
| 1065 | 1 | ABERTURA IMPLANTE | Tabela Exemplo | 25 | 62 - Cirurgia de cisto | 96.15 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51395 | 1 | ABERTURA IMPLANTE |  | 25 | 62 - Cirurgia de cisto | 96.15 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1066 | 2 | AUMENTO DE COROA CLINICA | Tabela Exemplo | 27 | 47 - Aumento de coroa clínica | 92.86 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51396 | 2 | AUMENTO DE COROA CLINICA |  | 27 | 47 - Aumento de coroa clínica | 92.86 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1067 | 3 | BIOMATERIAL | Tabela Exemplo | 28 | 233 - Implante laminado (por lâmina) | 93.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51397 | 3 | BIOMATERIAL |  | 28 | 233 - Implante laminado (por lâmina) | 93.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 676 | 4 | BOTOX | Tabela Exemplo | 18 | 628 - Botox | 94.44 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1068 | 4 | BOTOX | Tabela Exemplo | 18 | 614 - Botox | 94.44 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51398 | 4 | BOTOX |  | 18 | 614 - Botox | 94.44 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51454 | 4 | BOTOX |  | 18 | 628 - Botox | 94.44 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1069 | 5 | CIMENTAÇÃO AD. | Tabela Exemplo | 24 | 390 - Recolocação de dente art. em apar. protético rem. | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51399 | 5 | CIMENTAÇÃO AD. |  | 24 | 390 - Recolocação de dente art. em apar. protético rem. | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1071 | 7 | CIRURGIA CISTO | Tabela Exemplo | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51401 | 7 | CIRURGIA CISTO |  | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1072 | 8 | CIRURGIA EXPLORATÓRIA | Tabela Exemplo | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51402 | 8 | CIRURGIA EXPLORATÓRIA |  | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1074 | 10 | CLAREAMENTO CONSULTÓRIO | Tabela Exemplo | 24 | 78 - Clareamento | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51404 | 10 | CLAREAMENTO CONSULTÓRIO |  | 24 | 78 - Clareamento | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1075 | 11 | CONSULTA DE EMERGÊNCIA | Tabela Exemplo | 23 | 149 - Emergência | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51405 | 11 | CONSULTA DE EMERGÊNCIA |  | 23 | 149 - Emergência | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 684 | 12 | CONSULTA INICIAL | Tabela Exemplo | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51406 | 12 | CONSULTA INICIAL |  | 17 | 82 - Consulta | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51462 | 12 | CONSULTA INICIAL |  | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1077 | 13 | COROA METALO-C | Tabela Exemplo | 31 | 105 - Coroa provisória | 96.88 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51407 | 13 | COROA METALO-C |  | 31 | 105 - Coroa provisória | 96.88 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1078 | 14 | COROA PROVISÓRIA IMEDIATA | Tabela Exemplo | 31 | 159 - Enxerto geng. pediculado ou retalho desl. apical | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51408 | 14 | COROA PROVISÓRIA IMEDIATA |  | 31 | 159 - Enxerto geng. pediculado ou retalho desl. apical | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1079 | 15 | COROA PROVISÓRIA LAB | Tabela Exemplo | 32 | 105 - Coroa provisória | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51409 | 15 | COROA PROVISÓRIA LAB |  | 32 | 105 - Coroa provisória | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1080 | 16 | COROA SOB IMP | Tabela Exemplo | 33 | 102 - Coroa metálica total | 83.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51410 | 16 | COROA SOB IMP |  | 33 | 102 - Coroa metálica total | 83.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1081 | 17 | COROA ZIRCONIA | Tabela Exemplo | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51411 | 17 | COROA ZIRCONIA |  | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1082 | 18 | E-MAX INLAY-ONLAY | Tabela Exemplo | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51412 | 18 | E-MAX INLAY-ONLAY |  | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1083 | 19 | ENDO INCISIVOS | Tabela Exemplo | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51413 | 19 | ENDO INCISIVOS |  | 36 | 153 - Endodontia em dentes incisivos e caninos | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1086 | 22 | ENXERTO + TUNELIZAÇÃO | Tabela Exemplo | 31 | 588 - Tunelização | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51416 | 22 | ENXERTO + TUNELIZAÇÃO |  | 31 | 588 - Tunelização | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1087 | 23 | ENXERTO CONJUNTIVO LIVRE | Tabela Exemplo | 29 | 160 - Enxerto gengival livre | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51417 | 23 | ENXERTO CONJUNTIVO LIVRE |  | 29 | 160 - Enxerto gengival livre | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1088 | 24 | EXODONTIA | Tabela Exemplo | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51418 | 24 | EXODONTIA |  | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1089 | 25 | FACETAS | Tabela Exemplo | 31 | 199 - Facetas laminadas de porcelana | 85.71 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51419 | 25 | FACETAS |  | 31 | 199 - Facetas laminadas de porcelana | 85.71 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1090 | 26 | FRENECTOMIA | Tabela Exemplo | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51420 | 26 | FRENECTOMIA |  | 26 | 62 - Cirurgia de cisto | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1091 | 27 | GENGIVECTOMIA | Tabela Exemplo | 25 | 62 - Cirurgia de cisto | 88.89 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51421 | 27 | GENGIVECTOMIA |  | 25 | 62 - Cirurgia de cisto | 88.89 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 700 | 28 | GUIA CIRURGICO | Tabela Exemplo | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1092 | 28 | GUIA CIRURGICO | Tabela Exemplo | 17 | 82 - Consulta | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51422 | 28 | GUIA CIRURGICO |  | 17 | 82 - Consulta | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51478 | 28 | GUIA CIRURGICO |  | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1093 | 29 | IMPLANTE + BIOMATERIAL | Tabela Exemplo | 30 | 233 - Implante laminado (por lâmina) | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51423 | 29 | IMPLANTE + BIOMATERIAL |  | 30 | 233 - Implante laminado (por lâmina) | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1094 | 30 | IMPLANTE OST | Tabela Exemplo | 28 | 233 - Implante laminado (por lâmina) | 93.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51424 | 30 | IMPLANTE OST |  | 28 | 233 - Implante laminado (por lâmina) | 93.33 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1095 | 31 | IMPLANTE+PROTOCOLO | Tabela Exemplo | 42 | 334 - Prótese parcial fixa metalo-plástica | 75.00 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51425 | 31 | IMPLANTE+PROTOCOLO |  | 42 | 334 - Prótese parcial fixa metalo-plástica | 75.00 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1096 | 32 | INLAY-ONLAY | Tabela Exemplo | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51426 | 32 | INLAY-ONLAY |  | 36 | 485 - Restauração inlay de porcelana | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1098 | 34 | LEVANTAMENTO DE SEIO | Tabela Exemplo | 28 | 245 - Levantamento periapical ou série completa | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51428 | 34 | LEVANTAMENTO DE SEIO |  | 28 | 245 - Levantamento periapical ou série completa | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1099 | 35 | NÚCLEO DE PREENCHIMENTO | Tabela Exemplo | 23 | 269 - Núcleo de preenchimento em resina | 95.83 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51429 | 35 | NÚCLEO DE PREENCHIMENTO |  | 23 | 269 - Núcleo de preenchimento em resina | 95.83 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1100 | 36 | NÚCLEO FIBRA DE VIDRO | Tabela Exemplo | 27 | 266 - Núcleo de preenchimento | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51430 | 36 | NÚCLEO FIBRA DE VIDRO |  | 27 | 266 - Núcleo de preenchimento | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1101 | 37 | NÚCLEO METALICO FUNDIDO | Tabela Exemplo | 28 | 271 - Núcleo metálico fundido | 96.43 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51431 | 37 | NÚCLEO METALICO FUNDIDO |  | 28 | 271 - Núcleo metálico fundido | 96.43 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1103 | 39 | PPF MPSI | Tabela Exemplo | 35 | 334 - Prótese parcial fixa metalo-plástica | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51433 | 39 | PPF MPSI |  | 35 | 334 - Prótese parcial fixa metalo-plástica | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1105 | 41 | PPR | Tabela Exemplo | 20 | 336 - Prótese parcial removível | 95.00 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51435 | 41 | PPR |  | 20 | 336 - Prótese parcial removível | 95.00 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1106 | 42 | PPR PROV | Tabela Exemplo | 22 | 339 - Prótese parcial removível provisória | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51436 | 42 | PPR PROV |  | 22 | 339 - Prótese parcial removível provisória | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1108 | 47 | PROFILAXIA | Tabela Exemplo | 27 | 305 - Profilaxia | 81.48 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51438 | 47 | PROFILAXIA |  | 22 | 305 - Profilaxia | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1109 | 48 | PRÓTESE FIXA ADESIVA | Tabela Exemplo | 38 | 308 - Prótese adesiva | 94.74 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1110 | 49 | PRÓTESE PROTOCOLO | Tabela Exemplo | 35 | 334 - Prótese parcial fixa metalo-plástica | 89.19 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51440 | 49 | PRÓTESE PROTOCOLO |  | 31 | 351 - Prótese total acrílica | 96.77 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1111 | 50 | PRÓTESE TOTAL | Tabela Exemplo | 27 | 424 - Reembasamento e repreparo de coroa provisória | 85.19 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1112 | 51 | PT IMEDIADA | Tabela Exemplo | 37 | 465 - Restauração de Amálgama - 1 face | 86.49 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1113 | 52 | RASPAGEM | Tabela Exemplo | 33 | 465 - Restauração de Amálgama - 1 face | 91.18 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51443 | 52 | RASPAGEM |  | 21 | 379 - Raspagem | 90.91 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1114 | 53 | REEMBASAMENTO REPARO | Tabela Exemplo | 37 | 465 - Restauração de Amálgama - 1 face | 86.49 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51444 | 53 | REEMBASAMENTO REPARO |  | 23 | 424 - Reembasamento e repreparo de coroa provisória | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1115 | 54 | RESTAURAÇÃO | Tabela Exemplo | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51445 | 54 | RESTAURAÇÃO |  | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 2865 | 55 | RESTAURAÇÃO 1 | Tabela Exemplo | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51446 | 55 | RESTAURAÇÃO 1 |  | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 2866 | 56 | RESTAURAÇÃO 2 | Tabela Exemplo | 39 | 465 - Restauração de Amálgama - 1 face | 77.50 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51447 | 56 | RESTAURAÇÃO 2 |  | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1118 | 57 | RESTAURAÇÃO 3 | Tabela Exemplo | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51448 | 57 | RESTAURAÇÃO 3 |  | 32 | 465 - Restauração de Amálgama - 1 face | 93.94 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 727 | 58 | RETORNO | Tabela Exemplo | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 1119 | 58 | RETORNO | Tabela Exemplo | 17 | 82 - Consulta | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51449 | 58 | RETORNO |  | 17 | 82 - Consulta | 100.00 | diverg?ncia a revisar | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 51505 | 58 | RETORNO |  | 17 | 627 - Preenchimento | 77.78 | match parcial ou divergente | Match forte/parcial com diverg?ncia ou ambiguidade; revis?o manual obrigat?ria. | N?o sanear automaticamente. |
| 40595 | 5000 | Adequao de meio bucal | PARTICULAR | 18 | 614 - Botox | 100.00 | duplicidade interna: 1; footprint compat?vel com Botox 00205, mas duplicidade impede saneamento autom?tico | Forte ind?cio de materializa??o legada, mas duplicidade impede saneamento autom?tico. | N?o sanear automaticamente. |

## 13. Resumo dos 102 n?o sane?veis automaticamente
| motivo resumido | quantidade | exemplos representativos |
| --- | ---: | --- |
| sem match claro / baixa confian?a | 59 | 3 - BIOMATERIAL, 3 - BIOMATERIAL, 13 - COROA METALO-C, 13 - COROA METALO-C, 14 - COROA PROVISÓRIA IMEDIATA, 14 - COROA PROVISÓRIA IMEDIATA |
| match fraco/parcial abaixo do limiar de saneamento | 43 | 1 - ABERTURA IMPLANTE, 1 - ABERTURA IMPLANTE, 2 - AUMENTO DE COROA CLINICA, 2 - AUMENTO DE COROA CLINICA, 5 - CIMENTAÇÃO AD., 5 - CIMENTAÇÃO AD. |

## 14. Caso 5000 em destaque
- procedimento interno: 40595
- c?digo: 5000
- nome/descri??o: Adequao de meio bucal
- tabela: PARTICULAR
- procedimento_generico_id: null
- v?nculos diretos: 18
- materiais ?nicos: 17
- duplicidade interna: 1
- melhor match: 614 - Botox
- match: 100.00%
- classifica??o: revis?o manual obrigat?ria
- motivo: forte ind?cio de materializa??o legada, mas duplicidade interna impede saneamento autom?tico

### Compara??o do footprint do 5000 com Botox 00205
| origem | itens | observa??o |
| --- | ---: | --- |
| 5000 | 18 | 17 materiais ?nicos + 1 duplicidade |
| gen?rico 00205 id 614 | 17 | footprint compat?vel |
| gen?rico 00205 id 628 | 17 | footprint parcialmente compat?vel; quantidade distinta em itens herdados de outra gera??o |
| gen?rico 00205 id 669 | 0 | sem materiais |

## 15. Motivos de classifica??o
- O grupo `seguro prov?vel` foi reservado aos casos com footprint exato, sem duplicidade e sem diverg?ncia relevante.
- O grupo `revis?o manual` inclui match forte, mas com duplicidade, diverg?ncia ou ambiguidade suficiente para impedir escrita autom?tica.
- O grupo `n?o sane?vel automaticamente` re?ne casos sem match claro ou com confian?a insuficiente.

## 16. Recomenda??o por categoria
- **Seguro prov?vel**: candidato a saneamento futuro com backup e rollback.
- **Revis?o manual**: n?o sanear automaticamente; exigir decis?o humana.
- **N?o sane?vel automaticamente**: n?o tocar sem an?lise humana espec?fica.

## 17. Op??es futuras avaliadas
- **Op??o A**: sanear apenas os 23 seguro prov?vel em etapa futura.
- **Op??o B**: sanear os 23 seguro prov?vel e tratar o 5000 manualmente.
- **Op??o C**: n?o sanear banco agora e apenas documentar o legado.
- **Op??o D**: criar tela/ferramenta de revis?o manual futura para os 99 revis?o manual.

## 18. Recomenda??o t?cnica
A recomenda??o mais conservadora ? n?o escrever nada agora. O pr?ximo passo seguro ? revisar manualmente os candidatos do grupo seguro prov?vel e os itens de revis?o manual antes de qualquer saneamento controlado.

## 19. Menor pr?xima etapa segura
A menor pr?xima etapa segura ? uma etapa separada de valida??o humana dos candidatos, come?ando pelos 23 casos seguro prov?vel, com 5000 tratado individualmente.

## 20. Plano de backup futuro
Antes de qualquer futura escrita, o m?nimo necess?rio ?: backup completo do banco, exporta??o dos procedimentos afetados, exporta??o dos v?nculos afetados, lista dos IDs candidatos, relat?rio antes/depois, rollback revers?vel e valida??o em c?pia/ambiente de teste.

## 21. Riscos preservados
- limpeza direta pode apagar materiais pr?prios reais;
- corre??o s? no frontend mascara o legado;
- corre??o s? no backend sem distinguir origem pode apagar dados v?lidos;
- deixar o legado sem trato mant?m a base confusa e perigosa para futuras manuten??es.

## 22. Confirma??o de que nenhuma escrita foi feita
Confirmado. Esta etapa n?o executou nenhuma escrita no banco.

## 23. Confirma??o de que nenhum INSERT/UPDATE/DELETE/ALTER foi executado
Confirmado. Nenhum `INSERT`, `UPDATE`, `DELETE` ou `ALTER` foi executado.

## 24. Checklist de valida??o futura
1. Revisar um caso de cada categoria antes de qualquer escrita.
2. Validar o caso 5000 separadamente.
3. Confirmar se os candidatos seguro prov?vel mant?m footprint limpo em ambiente de c?pia.
4. Definir rollback antes de qualquer saneamento.
5. Confirmar explicitamente com o usu?rio antes de gravar.
6. Reabrir a interven??o ap?s qualquer eventual escrita de teste.
