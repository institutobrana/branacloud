# Auditoria de migracao da Anamnese EasyDental para a Clinica 1

## Contexto

Auditoria documental somente leitura da base legada EasyDental (`\\Dell_servidor\\c\\EDS70`) e da base atual Brana Cloud para avaliar se os dados preenchidos de Anamnese podem ser migrados com seguranca para a clinica 1, com foco no usuario/paciente `gleissontel@gmail.com`.

Esta etapa nao executa qualquer escrita, migracao, importacao, delete, update, insert ou alteracao de schema. O objetivo e apenas registrar o estado real das fontes e concluir se uma migracao automatica pode ser considerada segura neste momento.

## Fontes consultadas

### EasyDental legada

- Share somente leitura: `\\Dell_servidor\\c\\EDS70`
- Arquivo DSN: `\\Dell_servidor\\c\\EDS70\\eds70.dsn`
- Scripts e extracoes legadas ja presentes em `docs/`, incluindo:
  - `docs/anamnese_eds70_descoberta_tabelas.txt`
  - `docs/anamnese_eds70_descoberta_colunas.txt`
  - `docs/anamnese_eds70_mapeamento_tabelas.txt`
  - `docs/anamnese_eds70_extraido_questionarios.csv`
  - `docs/anamnese_eds70_extraido_perguntas.csv`
  - `docs/anamnese_eds70_extraido_respostas_resumo.csv`
  - `docs/sqlserver_anamnese_descoberta_eds70.sql`
  - `docs/sqlserver_restore_eds70_anamnese_readonly.sql`

### Brana Cloud atual

- Banco atual consultado em modo somente leitura via `backend/.env` e a base PostgreSQL local da aplicacao.
- Fonte funcional atual da aba `Anamnese` e do modulo de configuracao de anamnese.

## Resumo dos achados na base legada EasyDental

- Tabelas centrais de Anamnese identificadas: `ANAMNESE_QUEST`, `ANAMNESE_PERG`, `ANAMNESE_RESP`.
- `ANAMNESE_RESP` possui os campos `RESPOSTA` e `COMPLEM`, permitindo resposta e complemento separados.
- O legado confirma questionarios conhecidos como:
  - `Principal`
  - `Implante`
  - `Ficha complementar`
  - `Anamnese de Saude`
  - `Anamnese pessoal`
- As extracoes legadas acumuladas indicam grande volume historico:
  - `15882` respostas brutas no legado
  - `118` grupos de respostas consolidados em extracao resumida
- A base legada continua sendo somente leitura nesta auditoria.

## Resumo dos achados na base Brana Cloud atual

- Clinica consultada: `id = 1`.
- Usuario/paciente consultado: `gleissontel@gmail.com`.
- Paciente localizado em Brana: `id = 646`, `nome_completo = Gleisson Tel`.
- Questionarios atuais da clinica 1:
  - `Principal` (`id = 2`, ordem 1)
  - `Implante` (`id = 8`, ordem 2)
  - `Ficha complementar` (`id = 9`, ordem 3)
  - `Anamnese de Saude` (`id = 10`, ordem 4)
  - `Anamnese pessoal` (`id = 11`, ordem 5)
- Total de questionarios na clinica 1: `5`.
- Total de perguntas na clinica 1: `112`.
- Total de respostas salvas na clinica 1: `15`.
- Respostas salvas por questionario na clinica 1:
  - `Principal`: `3`
  - `Implante`: `2`
  - `Anamnese de Saude`: `10`
- Distinct patients com respostas em Brana: `1`.
- Nao foram encontrados orfaos de resposta na clinica 1 no banco atual.
- O campo `resposta` atual ja usa envelope B2 JSON stringificado, com `paciente_id`, `questionario_id`, `questionario_nome`, `pergunta_id`, `pergunta_texto`, `resposta` e `complemento`.

## Casamento entre legado e Brana

### Casamentos confirmados

- A estrutura conceitual da Anamnese do legado e da Brana convergem em questionario, pergunta e resposta.
- Os cinco questionarios legados esperados aparecem no Brana atual.
- O paciente `Gleisson Tel` foi identificado na base atual com correspondencia razoavel de identidade (`gleissontel@gmail.com`, `Gleisson`, `Tel`, CPF e data de nascimento coerentes com o payload de origem).
- A base atual ja preserva o modelo de pergunta/resultado por paciente/questionario/pergunta.

### Divergencias e limites

- O Brana atual ainda nao possui prova de equivalencia completa 1:1 com o historico legada de Anamnese.
- O legado possui um volume historico muito maior de respostas do que o conjunto atualmente presente no Brana.
- A correspondencia entre todas as respostas brutas legadas e o envelope B2 atual ainda nao foi validada integralmente para importacao automatica.
- A resposta atual do Brana e compatibilizada e estruturada, mas nao prova que todo o historico da fonte legada foi fielmente transportado.
- Esta auditoria nao executa nenhuma tentativa de escrita, logo nao existe validacao de colisao, sobrescrita ou reconstrucao completa de historico.

## Analise de seguranca para migracao

### O que pode ser considerado seguro neste momento

- A estrutura de Anamnese na clinica 1 e consistente para continuar recebendo dados.
- O paciente `Gleisson Tel` esta identificado na base atual de forma consistente.
- Os questionarios principais ja existem na clinica 1.
- A persistencia B2 atual permite salvar respostas por paciente/questionario/pergunta sem criar schema novo.

### O que ainda nao e seguro para automatizar

- Migrar historico completo do legado sem um mapeamento final por pergunta e por resposta.
- Assumir que toda resposta legada possa ser convertida automaticamente para o envelope B2 sem perda semantica.
- Executar qualquer importacao em massa sem um dry-run fechado por paciente e questionario.
- Tratar a base legada como se todos os grupos de resposta fossem equivalentes ao contrato atual da Brana.

## Opcoes avaliadas

- `ANAM-MIG-A`: migracao automatica integral agora. **Nao recomendada**.
- `ANAM-MIG-B`: migracao apenas estrutural ja validada, sem historico de respostas. **Aceitavel** para consolidacao da base atual, mas nao resolve o objetivo de preencher dados legados do paciente.
- `ANAM-MIG-C`: migracao assistida por paciente/questionario com dry-run fechado antes de qualquer escrita. **Recomendada como proximo passo seguro**.
- `ANAM-MIG-D`: manter tudo como esta e nao tocar nos dados legados. **Valida como postura conservadora, mas nao aproveita o historico existente**.
- `ANAM-MIG-E`: bloquear qualquer tentativa de migracao futura. **Nao recomendada** porque impediria evolucao controlada.

## Decisao recomendada

`ANAM-MIG-C`

## Conclusao

- Nao e seguro declarar a migracao automatica completa dos dados preenchidos de Anamnese do EasyDental para a clinica 1 neste momento.
- A base atual do Brana Cloud esta pronta para receber os dados, mas a importacao do historico legada ainda precisa de um dry-run fechado por paciente, questionario e pergunta.
- Para `gleissontel@gmail.com`, a proxima etapa segura e montar uma comparacao paciente a paciente com o export do legado e so depois avaliar qualquer escrita.

## Proxima etapa segura recomendada

- Criar um inventario somente leitura das respostas legadas do paciente `Gleisson Tel` no EDS70.
- Mapear cada grupo de resposta com `questionario_id`, `pergunta_id`, `resposta` e `complemento`.
- Validar se a resposta legada cabe no envelope B2 sem perdas.
- Somente depois disso decidir se existe importacao assistida ou se o historico deve permanecer apenas documental.

## Confirmacoes de nao alteracao

- Nenhum codigo foi alterado.
- Nenhum backend foi alterado.
- Nenhum banco foi alterado.
- Nenhum schema/migration/seed/endpoint foi alterado.
- Nenhum `.env` foi alterado.
- Nenhum `requestJson` foi alterado.
- Nenhum payload foi alterado.
- Nenhum formato de salvamento foi alterado.
- Nenhuma exclusao foi alterada.
- Nenhuma permissao foi alterada.

## Observacao sobre blindagem textual / mojibake

Esta auditoria respeita a blindagem textual e nao corrige acentos, labels ou mensagens fora do escopo.
