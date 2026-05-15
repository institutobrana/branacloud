# Importação EDS70 - Anamnese gleissontel@gmail.com

## 1. Contexto
- PostgreSQL atual tinha só Principal;
- EDS70 continha os cinco questionários;
- esta etapa importou apenas os quatro ausentes.

## 2. Estado inicial do projeto
- Branch: modularizacao-segura-fase-1
- frontend/app.js sem diff
- frontend/index.html sem diff
- node --check frontend/app.js passou

## 3. Backup criado antes da escrita
- pasta do backup: D:\BRANA ARQUIVOS\BRANA CLOUD\backend\backups\anamnese_pre_import_eds70_20260515_065554
- arquivos criados: anamnese_questionarios_before_eds70.csv, anamnese_perguntas_before_eds70.csv, anamnese_respostas_before_eds70.csv, anamnese_pre_import_validation.txt
- pg_dump completo: nao disponivel nesta maquina
- exports CSV das tabelas de Anamnese: sim

## 4. Validação pré-importação
- usuário: gleissontel@gmail.com
- clinica_id: 1
- questionário Principal antes: id=2, perguntas=17
- plano esperado: 4 questionários e 95 perguntas
- Principal preservado: sim

## 5. Script criado
- backend/scripts/anamnese_importar_eds70_gleisson.py
- sem --execute nao escreve;
- com --execute executa transacao;
- rollback em erro.

## 6. Resultado da execução sem escrita
Usuario: gleissontel@gmail.com | clinica_id=1
Questionarios atuais: 1
Principal atual: 17 perguntas
Questionarios ausentes previstos: Implante, Ficha complementar, Anamnese de Saúde, Anamnese pessoal
Perguntas previstas: 95
Arquivos dry-run: anamnese_dry_run_plano_questionarios_eds70.json, anamnese_dry_run_plano_perguntas_eds70.json, anamnese_dry_run_resumo_eds70.txt

## 7. Resultado da execução real
- executou com --execute: true
- questionários inseridos: 4
- perguntas inseridas: 95
- commit: true
- rollback: false

## 8. Validação pós-importação no banco
- Principal antes: 17 perguntas
- Principal depois: 17 perguntas
- respostas antes: 1 agrupamentos
- respostas não importadas: sim
- resposta órfã não alterada: sim

## 9. Validação via endpoint
- status: NAO_VALIDADO_NESTA_ETAPA
- quantidade: NAO_VALIDADO_NESTA_ETAPA
- nomes retornados: NAO_VALIDADO_NESTA_ETAPA
- tentativa local de recuperar token do perfil do navegador nao resultou em um token validado com seguranca; por isso o endpoint nao foi confirmado nesta etapa.

## 10. O que não foi alterado
- frontend/app.js não foi alterado;
- frontend/index.html não foi alterado;
- backend funcional/endpoints não foram alterados;
- Principal não foi alterado;
- respostas não foram importadas;
- resposta órfã não foi alterada;
- nenhum dado foi apagado;
- nenhum commit Git foi feito.

## 11. Checks executados
- node --check frontend/app.js
- python -m py_compile backend/scripts/anamnese_importar_eds70_gleisson.py
- git status --short
- git diff --stat

## 12. Onde testar no navegador
1. Fazer Ctrl+F5.
2. Entrar com a conta gleissontel@gmail.com.
3. Abrir Anamnese.
4. Abrir lista de Questionários.
5. Confirmar que aparecem:
   - Principal
   - Implante
   - Ficha complementar
   - Anamnese de Saúde
   - Anamnese pessoal
6. Selecionar Implante e confirmar 12 perguntas.
7. Selecionar Ficha complementar e confirmar 12 perguntas.
8. Selecionar Anamnese de Saúde e confirmar 55 perguntas.
9. Selecionar Anamnese pessoal e confirmar 16 perguntas.
10. Confirmar que Principal continua com 17 perguntas.
11. Abrir ficha de paciente.
12. Validar fluxo de Anamnese.
13. Confirmar console sem ReferenceError ou TypeError.

## 13. Próximas etapas separadas
- analisar as 18 perguntas faltantes do Principal;
- analisar resposta órfã;
- avaliar se respostas do EDS70 devem ou não ser migradas.
