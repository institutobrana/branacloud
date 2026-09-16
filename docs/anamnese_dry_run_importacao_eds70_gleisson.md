# Dry-run de importa??o EDS70 - Anamnese gleissontel@gmail.com

## 1. Contexto
- PostgreSQL atual tem s? Principal; EDS70 tem os cinco questionarios.
- Objetivo: preparar importacao futura dos quatro ausentes sem alterar o banco atual.

## 2. Estado inicial do projeto
- Branch: modularizacao-segura-fase-1
- frontend/app.js sem diff
- frontend/index.html sem diff
- node --check frontend/app.js passou

## 3. Schema PostgreSQL atual
### anamnese_questionarios
- id | integer | nullable=NO | default=nextval('anamnese_questionarios_id_seq'::regclass)
- clinica_id | integer | nullable=NO | default=None
- nome | character varying | nullable=NO | default=None
- ativo | boolean | nullable=NO | default=None
- ordem | integer | nullable=NO | default=None
- criado_em | timestamp with time zone | nullable=NO | default=now()
- atualizado_em | timestamp with time zone | nullable=NO | default=now()
Constraints:
- 2200_19591_1_not_null | CHECK | columns=-
- 2200_19591_2_not_null | CHECK | columns=-
- 2200_19591_3_not_null | CHECK | columns=-
- 2200_19591_4_not_null | CHECK | columns=-
- 2200_19591_5_not_null | CHECK | columns=-
- 2200_19591_6_not_null | CHECK | columns=-
- 2200_19591_7_not_null | CHECK | columns=-
- anamnese_questionarios_clinica_id_fkey | FOREIGN KEY | columns=clinica_id
- anamnese_questionarios_pkey | PRIMARY KEY | columns=id
- uq_anamnese_questionario_clinica_nome | UNIQUE | columns=clinica_id, nome

### anamnese_perguntas
- id | integer | nullable=NO | default=nextval('anamnese_perguntas_id_seq'::regclass)
- clinica_id | integer | nullable=NO | default=None
- questionario_id | integer | nullable=NO | default=None
- numero | integer | nullable=NO | default=None
- texto | character varying | nullable=NO | default=None
- ativo | boolean | nullable=NO | default=None
- criado_em | timestamp with time zone | nullable=NO | default=now()
- atualizado_em | timestamp with time zone | nullable=NO | default=now()
- tipo_pergunta | integer | nullable=NO | default=1
- tipo_resposta | integer | nullable=NO | default=1
- mensagem_alerta | character varying | nullable=YES | default=None
Constraints:
- 2200_19609_10_not_null | CHECK | columns=-
- 2200_19609_1_not_null | CHECK | columns=-
- 2200_19609_2_not_null | CHECK | columns=-
- 2200_19609_3_not_null | CHECK | columns=-
- 2200_19609_4_not_null | CHECK | columns=-
- 2200_19609_5_not_null | CHECK | columns=-
- 2200_19609_6_not_null | CHECK | columns=-
- 2200_19609_7_not_null | CHECK | columns=-
- 2200_19609_8_not_null | CHECK | columns=-
- 2200_19609_9_not_null | CHECK | columns=-
- anamnese_perguntas_clinica_id_fkey | FOREIGN KEY | columns=clinica_id
- anamnese_perguntas_pkey | PRIMARY KEY | columns=id
- anamnese_perguntas_questionario_id_fkey | FOREIGN KEY | columns=questionario_id
- uq_anamnese_pergunta_clinica_questionario_numero | UNIQUE | columns=clinica_id, questionario_id, numero

### anamnese_respostas
- id | integer | nullable=NO | default=nextval('anamnese_respostas_id_seq'::regclass)
- clinica_id | integer | nullable=NO | default=None
- paciente_id | integer | nullable=NO | default=None
- questionario_id | integer | nullable=NO | default=None
- pergunta_id | integer | nullable=NO | default=None
- resposta | text | nullable=YES | default=None
- atualizado_em | timestamp with time zone | nullable=NO | default=now()
Constraints:
- 2200_19656_1_not_null | CHECK | columns=-
- 2200_19656_2_not_null | CHECK | columns=-
- 2200_19656_3_not_null | CHECK | columns=-
- 2200_19656_4_not_null | CHECK | columns=-
- 2200_19656_5_not_null | CHECK | columns=-
- 2200_19656_7_not_null | CHECK | columns=-
- anamnese_respostas_clinica_id_fkey | FOREIGN KEY | columns=clinica_id
- anamnese_respostas_paciente_id_fkey | FOREIGN KEY | columns=paciente_id
- anamnese_respostas_pergunta_id_fkey | FOREIGN KEY | columns=pergunta_id
- anamnese_respostas_pkey | PRIMARY KEY | columns=id
- anamnese_respostas_questionario_id_fkey | FOREIGN KEY | columns=questionario_id
- uq_anamnese_resposta_clinica_paciente_pergunta | UNIQUE | columns=clinica_id, paciente_id, pergunta_id

## 4. Estado atual da cl?nica 1
- Principal atual: id=2, perguntas=17
- respostas agrupadas por questionario_id: 1
- ALERTA: questionario_id sem questionario atual em respostas: [3]
- nenhum dos quatro ausentes presente no PostgreSQL atual

## 5. CSVs EDS70 validados
- questionarios: 5 linhas; nomes: Principal, Implante, Ficha complementar, Anamnese de Saúde, Anamnese pessoal
- perguntas: 130 linhas; por questionario: Principal=35, Implante=12, Ficha complementar=12, Anamnese de Saude=55, Anamnese pessoal=16
- encoding/acentuacao: UTF-8-SIG lido com normalizacao de espacos
- sem nomes duplicados e sem linhas vazias nos questionarios

## 6. Estrat?gia sobre Principal
- Principal atual: 17 perguntas
- Principal EDS70: 35 perguntas
- perguntas faltantes no Principal atual: 18
- Principal N?O ser? alterado nesta primeira importa??o
- perguntas faltantes do Principal EDS70:
  - 18: Sente fadiga ou fraqueza?
  - 19: Tem dor nas articulações?
  - 20: Sente "palpitações " no coração?
  - 21: Sua pressão sanguínea é alta?
  - 22: Sangra, por muito tempo, quando se corta?
  - 23: Tem anemia?
  - 24: Tem tosse persistente?
  - 25: Tem asma?
  - 26: Tem alguma alergia?
  - 27: Já teve alguma reação com anestésicos?
  - 28: Urina com muita frequência?
  - 29: Tem algum diabético em sua família?
  - 30: Costuma desmaiar com frequência?
  - 31: Sente dor de cabeça com frequência?
  - 32: Considera-se nervoso(a)?
  - 33: Está estressado(a)?
  - 34: A senhora está grávida?
  - 35: A senhora está na menopausa?

## 7. Question?rios previstos para importa??o futura
- Implante: 12 perguntas; futuro_id_estimado=3
- Ficha complementar: 12 perguntas; futuro_id_estimado=4
- Anamnese de Saúde: 55 perguntas; futuro_id_estimado=5
- Anamnese pessoal: 16 perguntas; futuro_id_estimado=6

## 8. Script dry-run criado
- backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py
- n?o altera banco; s? gera plano; aborta em inconsist?ncias

## 9. Arquivos de dry-run gerados
- docs/anamnese_dry_run_plano_questionarios_eds70.json
- docs/anamnese_dry_run_plano_perguntas_eds70.json
- docs/anamnese_dry_run_sql_preview_eds70.sql
- docs/anamnese_dry_run_resumo_eds70.txt

## 10. Resultado da execu??o dry-run
- questionarios que seriam criados: 4
- perguntas que seriam criadas: 95
- alertas/abortos: respostas orfas presentes; importacao de respostas bloqueada por plano

## 11. Valida??o de n?o altera??o
- PostgreSQL continuou com s? Principal
- nenhum INSERT/UPDATE/DELETE foi executado

## 12. Plano futuro de execu??o real
1. backup completo do PostgreSQL
2. export das tabelas atuais de Anamnese
3. rodar script real de importa??o com transacao
4. inserir quatro questionarios ausentes
5. inserir perguntas relacionadas
6. n?o importar respostas
7. validar endpoint /anamnese/questionarios
8. testar navegador

## 13. Riscos
- diferen?a do Principal
- risco de duplicidade
- risco de encoding
- risco de mapeamento de tipos
- risco de respostas cl?nicas
- necessidade de backup antes da escrita

## 14. O que n?o foi alterado
- frontend/app.js n?o foi alterado
- frontend/index.html n?o foi alterado
- backend funcional n?o foi alterado
- endpoints n?o foram alterados
- PostgreSQL atual n?o foi alterado
- SQL Server EDS70 n?o foi alterado
- nenhum dado foi importado
- nenhum dado foi apagado
- nenhum commit foi feito

## 15. Checks executados
- node --check frontend/app.js
- python -m py_compile backend/scripts/anamnese_dry_run_importar_eds70_gleisson.py
- git status --short
- git diff --stat

## 16. Pr?xima autoriza??o necess?ria
- criar backup do PostgreSQL atual
- criar script real de importa??o
- executar importa??o transacional dos quatro questionarios ausentes e suas perguntas
- sem mexer no Principal
- sem importar respostas
