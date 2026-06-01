# Anamnese - Adendo de correção de rota e dry-run populacional clínico 1

## 1. Objetivo
- Corrigir a rota da auditoria anterior, deixando claro que Gleisson Tel não é a referência de migração do EasyDental legado.
- Identificar todos os pacientes do EasyDental com anamnese preenchida e comparar com a clínica ID 1 do Brana Cloud em modo somente leitura.
- Produzir um dry-run populacional para orientar, no futuro, apenas migrações seguras e com validação adequada.

## 2. Correção de rota
- O paciente Gleisson Tel permanece como paciente de teste do Brana Cloud e não deve ser usado como base de migração do legado.
- A base de referência real para a migração populacional passa a ser o conjunto de pacientes do EasyDental que possuem respostas em `ANAMNESE_RESP`.
- Esta etapa não executou migração, importação ou escrita em qualquer banco.

## 3. Escopo somente leitura
- EasyDental auditado em modo somente leitura por ODBC SQL Server 2000 no servidor `DELL_SERVIDOR\\EDS70`.
- Brana Cloud consultado em modo somente leitura no PostgreSQL local `brana_saas` via `DATABASE_URL` do projeto.
- Não houve `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `DROP` ou `ALTER`.
- Não houve alteração em arquivos do EasyDental nem em tabelas do Brana.

## 4. Caminho EasyDental auditado
- `\\Dell_servidor\\c\\EDS70`.
- Conexão legada confirmada com credenciais de leitura `easy / ysae` via ODBC SQL Server.
- Fonte identificada: SQL Server 2000 legado da instalação EDS70.

## 5. Fontes consultadas
- `\\Dell_servidor\\c\\EDS70`.
- `D:\\BRANA ARQUIVOS\\BRANA CLOUD`.
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`.
- `docs/anamnese_easy_dell_servidor_auditoria_migracao_clinica_1.md`.
- `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md`.
- `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`.
- `docs/ficha_pessoal_anamnese_implementacao_persistencia_b2_envelope_textual.md`.
- `docs/ficha_pessoal_anamnese_contrato_persistencia_real_sim_nao_complemento.md`.
- `docs/11_roadmap_desenvolvimento.md`.

## 6. Tabelas e colunas encontradas
### EasyDental
- `PESSOAL`: `NROPAC`, `PRINOM`, `SEGNOM`, `DATNAS`, `CIC`, `MATRICULA`, `FONE1`, `FONE2`, `FONE3`, `FONE4`, `EMAIL`, `COD_PRONTUARIO`.
- `ANAMNESE_QUEST`: `NROQUE`, `NOME`.
- `ANAMNESE_PERG`: `NROQUE`, `NROPER`, `TEXPER`, `TIPRES`, `TIPPER`, `TEXMEN`.
- `ANAMNESE_RESP`: `NROPAC`, `NROQUE`, `NROPER`, `RESPOSTA`, `COMPLEM`.
### Brana Cloud
- `pacientes`: `id`, `clinica_id`, `codigo`, `nome`, `sobrenome`, `nome_completo`, `data_nascimento`, `cpf`, `fone1..4`, `matricula`, `cod_prontuario`, `source_payload`, `email`.
- `anamnese_questionarios`: `id`, `clinica_id`, `nome`, `ativo`, `ordem`.
- `anamnese_perguntas`: `id`, `clinica_id`, `questionario_id`, `numero`, `texto`, `ativo`, `tipo_pergunta`, `tipo_resposta`, `mensagem_alerta`.
- `anamnese_respostas`: `id`, `clinica_id`, `paciente_id`, `questionario_id`, `pergunta_id`, `resposta`.

## 7. Contagens do EasyDental
- Total de pacientes na tabela `PESSOAL`: 1627.
- Total de pacientes com pelo menos uma resposta em `ANAMNESE_RESP`: 305.
- Total de respostas brutas em `ANAMNESE_RESP`: 16102.
- Total de respostas não vazias: 16102.
- Total de respostas com complemento: 1875.
- Questionário `Principal`: 1 pacientes, 35 respostas.
- Questionário `Implante`: 0 pacientes, 0 respostas.
- Questionário `Ficha complementar`: 3 pacientes, 36 respostas.
- Questionário `Anamnese de Saúde`: 281 pacientes, 15455 respostas.
- Questionário `Anamnese pessoal`: 36 pacientes, 576 respostas.

## 8. Contagens da clínica ID 1 no Brana
- Total de pacientes da clínica ID 1: 1627.
- Total de questionários da clínica ID 1: 5.
- Total de perguntas da clínica ID 1: 112.
- Total de respostas salvas da clínica ID 1: 15.
- Pacientes da clínica ID 1 com respostas de Anamnese: 1.
- Questionário Brana `Principal`: 1 pacientes, 3 respostas.
- Questionário Brana `Implante`: 1 pacientes, 2 respostas.
- Questionário Brana `Ficha complementar`: 0 pacientes, 0 respostas.
- Questionário Brana `Anamnese de Saúde`: 1 pacientes, 10 respostas.
- Questionário Brana `Anamnese pessoal`: 0 pacientes, 0 respostas.

## 9. Critérios de matching
- `MATCH_ALTO`: CPF igual; ou código/prontuário/matrícula com nome e data de nascimento coerentes; ou nome muito forte com data e segundo identificador sem ambiguidade.
- `MATCH_MEDIO`: nome muito semelhante com data de nascimento; ou nome com telefone/prontuário, com pequena incerteza.
- `MATCH_BAIXO`: apenas nome ou nome muito semelhante, sem confirmação forte.
- `SEM_MATCH`: nenhum correspondente claro no Brana.
- `DUPLICADO/CONFLITO`: um legado aponta para vários Brana ou um Brana aparece como melhor candidato de múltiplos legados com mesma força.

## 10. Resultado do matching
- `MATCH_ALTO`: 304.
- `MATCH_MEDIO`: 0.
- `MATCH_BAIXO`: 0.
- `SEM_MATCH`: 1.
- `DUPLICADO/CONFLITO`: 0.

## 11. Resultado da comparação de questionários / perguntas
- `Principal`: legado 35 perguntas; Brana 17 perguntas; texto igual por número: 17; diferenças de texto por número: 0; `tipo_pergunta` igual: 2; `tipo_resposta` igual: 12; alerta igual: 2; faltantes no Brana: 18; extras no Brana: 0.
- `Implante`: legado 12 perguntas; Brana 12 perguntas; texto igual por número: 12; diferenças de texto por número: 0; `tipo_pergunta` igual: 12; `tipo_resposta` igual: 5; alerta igual: 12; faltantes no Brana: 0; extras no Brana: 0.
- `Ficha complementar`: legado 12 perguntas; Brana 12 perguntas; texto igual por número: 12; diferenças de texto por número: 0; `tipo_pergunta` igual: 12; `tipo_resposta` igual: 0; alerta igual: 12; faltantes no Brana: 0; extras no Brana: 0.
- `Anamnese de Saúde`: legado 55 perguntas; Brana 55 perguntas; texto igual por número: 55; diferenças de texto por número: 0; `tipo_pergunta` igual: 55; `tipo_resposta` igual: 48; alerta igual: 5; faltantes no Brana: 0; extras no Brana: 0.
- `Anamnese pessoal`: legado 16 perguntas; Brana 16 perguntas; texto igual por número: 16; diferenças de texto por número: 0; `tipo_pergunta` igual: 16; `tipo_resposta` igual: 2; alerta igual: 16; faltantes no Brana: 0; extras no Brana: 0.

## 12. Resultado da análise de respostas / complementos
- Formato legada observado em `RESPOSTA`: valores numéricos `1` e `2`, com `COMPLEM` separado para complemento.
- Distribuição dos valores de resposta no legado: {'2': 11377, '1': 4725}.
- Total de respostas com complemento no legado: 1875.
- O envelope B2 atual comporta texto e complemento, mas a conversão exata de `1`/`2` para semântica clínica deve ser validada por pergunta antes de qualquer escrita futura.

## 13. Conflitos com respostas já existentes no Brana
- As respostas atuais da clínica 1 estão concentradas em um paciente de teste e não se sobrepõem à população legada com anamnese preenchida.
- Pacientes da clínica 1 com respostas existentes: 1.
- Conflito direto de população legada x atual: 0 interseções confirmadas com a população de resposta legada.
- O paciente de teste do Brana não deve orientar a migração populacional.

## 14. Análise de riscos
- Risco de nome igual com dados incompletos: médio.
- Risco de códigos coincidentes entre bases sem correspondência clínica real: médio.
- Risco de sobrescrever resposta já existente no Brana: alto.
- Risco de perda de complemento se a conversão for feita sem mapeamento por pergunta: alto.
- Risco de mapeamento direto por `pergunta_id` entre bases: alto e não reutilizável.
- Risco de regressão funcional se houver escrita automática sem dry-run fechado: alto.

## 15. Análise das opções ANAM-MIG-POP-A/B/C/D/E
- `ANAM-MIG-POP-A`: não migrar. Seguro, mas não entrega preparação para a próxima fase.
- `ANAM-MIG-POP-B`: dry-run populacional somente leitura. Cumpre a etapa mínima e é a decisão desta rodada.
- `ANAM-MIG-POP-C`: migração futura apenas para `MATCH_ALTO` e sem sobrescrita. Pode ser a próxima evolução se o dry-run ficar consistente.
- `ANAM-MIG-POP-D`: migração futura assistida com CSV de validação manual. Útil se aparecerem muitos `MATCH_MEDIO`.
- `ANAM-MIG-POP-E`: importar estrutura legada antes das respostas. Só faria sentido se aparecessem divergências estruturais graves.

## 16. Decisão recomendada
- `ANAM-MIG-POP-B`.
- A migração automática futura só deve ser considerada depois de validar a lista de `MATCH_ALTO` e de revisar conflitos/casos médios.

## 17. Próxima subetapa segura
- Consolidar os CSVs de auditoria por paciente e por resposta.
- Revisar manualmente os `MATCH_ALTO`.
- Separar `MATCH_MEDIO`, `MATCH_BAIXO`, `SEM_MATCH` e `DUPLICADO/CONFLITO` para decisão clínica/documental futura.
- Só depois abrir contrato explícito para qualquer escrita futura.

## 18. Conclusão
- O dry-run populacional somente leitura confirmou que o universo legádo com anamnese preenchida é maior que o universo já salvo no Brana.
- A estrutura do Brana está pronta para receber futuro mapeamento, mas ainda não há segurança para migração automática integral.
- A decisão recomendada é manter a trilha em auditoria/validação manual, sem escrita nesta etapa.
