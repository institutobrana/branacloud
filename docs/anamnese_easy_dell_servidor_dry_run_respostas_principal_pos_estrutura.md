# Ficha Pessoal - Anamnese - Dry-run das respostas do questionario Principal apos a expansao estrutural

## 1. Objetivo
- Executar um dry-run somente leitura das respostas do questionario Principal do EasyDental agora que a estrutura da clinica 1 esta completa.
- Verificar se a futura migracao das respostas do Principal pode ser feita sem perda, sem sobrescrita e sem novo backend/banco.

## 2. Contexto
- A estrutura do questionario Principal da clinica 1 ja foi expandida e validada manualmente.
- O commit da expansao estrutural foi `d161a4ad3303ae564f22c14b3092b0edc02d9ccc`.
- O commit da validacao manual estrutural foi `f79f779882468e9879231a286c2f7129d11185a4`.
- O documento da expansao estrutural foi `docs/anamnese_easy_dell_servidor_implementacao_estrutural_principal_clinica_1.md`.
- O documento da validacao manual foi `docs/anamnese_easy_dell_servidor_validacao_estrutural_principal_clinica_1.md`.
- O usuario ja confirmou manualmente: `teste passou`.

## 3. Confirmacao de que nenhuma migracao foi executada
- Nenhuma resposta foi migrada.
- Nenhum `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP` ou `TRUNCATE` foi executado.
- Nao houve escrita no EasyDental nem no Brana.
- Nenhum arquivo do EasyDental foi alterado.
- Nenhum frontend, backend funcional, schema, migration, seed, endpoint, `.env`, payload, formato de salvamento ou permissao foi alterado.

## 4. Fontes consultadas
- `\Dell_servidor\c\EDS70` somente em leitura.
- `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- `docs/anamnese_easy_dell_servidor_implementacao_estrutural_principal_clinica_1.md`.
- `docs/anamnese_easy_dell_servidor_validacao_estrutural_principal_clinica_1.md`.
- `docs/anamnese_easy_dell_servidor_contrato_estrutural_principal_clinica_1.md`.
- `docs/anamnese_easy_dell_servidor_revisao_dry_run_principal_antes_migracao.md`.
- `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv`.
- `docs/anamnese_easy_dell_servidor_principal_respostas_perguntas_faltantes.csv`.
- `docs/anamnese_easy_dell_servidor_matches_pacientes_clinica_1.csv`.
- `docs/anamnese_easy_dell_servidor_respostas_candidatas_clinica_1.csv`.
- `docs/11_roadmap_desenvolvimento.md`.

## 5. Contagem das respostas do Principal no legado
- Pacientes do legado com respostas no Principal: 1.
- Respostas totais do Principal no legado: 35.
- Respostas com complemento: 0.
- Respostas com mensagem_alerta: 33.
- Distribuicao de `tipo_resposta` no legado: `1=27`, `2=6`, `3=2`.

## 6. Contagem de pacientes afetados
- Paciente legado com respostas no Principal: `273` - `Joon Yun Lee Lee`.
- Match Brana correspondente: `273` - `Joon Yun Lee Lee`.
- O conjunto do Principal continua concentrado em um unico paciente.

## 7. Situacao estrutural do Principal na clinica 1 apos expansao
- O Principal da clinica 1 possui 35 perguntas.
- As perguntas 1..17 foram preservadas.
- As perguntas 18..35 agora existem e estao em ordem correta.
- O destino estrutural do Principal na clinica 1 esta completo.
- Nenhuma resposta foi migrada antes deste dry-run.

## 8. Mapeamento pergunta a pergunta
| Numero legado | Texto legado | Numero Brana | Texto Brana | Situacao |
|---|---|---:|---|---|
| 1 | Está bem de saúde no momento? | 1 | Esta bem de saude no momento? | MIGRAVEL_SEM_CONFLITO |
| 2 | Quando fez seu último tratamento médico? | 2 | Quando fez seu ultimo tratamento medico? | MIGRAVEL_SEM_CONFLITO |
| 3 | Está atualmente em tratamento médico? | 3 | Esta atualmente em tratamento medico? | MIGRAVEL_SEM_CONFLITO |
| 4 | Apresenta alergia a  medicamentos? Quais? | 4 | Apresenta alergia a medicamentos? Quais? | MIGRAVEL_SEM_CONFLITO |
| 5 | Possui alguma doença grave? Qual? | 5 | Possui alguma doenca grave? Qual? | MIGRAVEL_SEM_CONFLITO |
| 6 | Está tomando algum medicamento? Qual? | 6 | Esta tomando algum medicamento? Qual? | MIGRAVEL_SEM_CONFLITO |
| 7 | Quando fez seu último tratamento dentário? | 7 | Quando fez seu ultimo tratamento dentario? | MIGRAVEL_SEM_CONFLITO |
| 8 | Sente dificuldade em abrir a boca | 8 | Sente dificuldade em abrir a boca | MIGRAVEL_SEM_CONFLITO |
| 9 | Range os dentes à noite? | 9 | Range os dentes a noite? | MIGRAVEL_SEM_CONFLITO |
| 10 | Aperta os dentes costumeiramente? | 10 | Aperta os dentes costumeiramente? | MIGRAVEL_SEM_CONFLITO |
| 11 | Alguma complicação durante tratamento odontológico? | 11 | Alguma complicacao durante tratamento odontologico? | MIGRAVEL_SEM_CONFLITO |
| 12 | Tem sinusite? | 12 | Tem sinusite? | MIGRAVEL_SEM_CONFLITO |
| 13 | Tem perdido peso nos últimos meses? | 13 | Tem perdido peso nos ultimos meses? | MIGRAVEL_SEM_CONFLITO |
| 14 | Tem ganho peso nos últimos meses? | 14 | Tem ganho peso nos ultimos meses? | MIGRAVEL_SEM_CONFLITO |
| 15 | Já foi hospitalizado(a) alguma vez? | 15 | Ja foi hospitalizado(a) alguma vez? | MIGRAVEL_SEM_CONFLITO |
| 16 | Foi submetido(a) à cirurgia? | 16 | Foi submetido(a) a cirurgia? | MIGRAVEL_SEM_CONFLITO |
| 17 | Já recebeu transfusão de sangue? | 17 | Ja recebeu transfusao de sangue? | MIGRAVEL_SEM_CONFLITO |
| 18 | Sente fadiga ou fraqueza? | 18 | Sente fadiga ou fraqueza? | MIGRAVEL_SEM_CONFLITO |
| 19 | Tem dor nas articulações? | 19 | Tem dor nas articulações? | MIGRAVEL_SEM_CONFLITO |
| 20 | Sente "palpitações " no coração? | 20 | Sente "palpitações " no coração? | MIGRAVEL_SEM_CONFLITO |
| 21 | Sua pressão sanguínea é alta? | 21 | Sua pressão sanguínea é alta? | MIGRAVEL_SEM_CONFLITO |
| 22 | Sangra, por muito tempo, quando se corta? | 22 | Sangra, por muito tempo, quando se corta? | MIGRAVEL_SEM_CONFLITO |
| 23 | Tem anemia? | 23 | Tem anemia? | MIGRAVEL_SEM_CONFLITO |
| 24 | Tem tosse persistente? | 24 | Tem tosse persistente? | MIGRAVEL_SEM_CONFLITO |
| 25 | Tem asma? | 25 | Tem asma? | MIGRAVEL_SEM_CONFLITO |
| 26 | Tem alguma alergia? | 26 | Tem alguma alergia? | MIGRAVEL_SEM_CONFLITO |
| 27 | Já teve alguma reação com anestésicos? | 27 | Já teve alguma reação com anestésicos? | MIGRAVEL_SEM_CONFLITO |
| 28 | Urina com muita frequência? | 28 | Urina com muita frequência? | MIGRAVEL_SEM_CONFLITO |
| 29 | Tem algum diabético em sua família? | 29 | Tem algum diabético em sua família? | MIGRAVEL_SEM_CONFLITO |
| 30 | Costuma desmaiar com frequência? | 30 | Costuma desmaiar com frequência? | MIGRAVEL_SEM_CONFLITO |
| 31 | Sente dor de cabeça com frequência? | 31 | Sente dor de cabeça com frequência? | MIGRAVEL_SEM_CONFLITO |
| 32 | Considera-se nervoso(a)? | 32 | Considera-se nervoso(a)? | MIGRAVEL_SEM_CONFLITO |
| 33 | Está estressado(a)? | 33 | Está estressado(a)? | MIGRAVEL_SEM_CONFLITO |
| 34 | A senhora está grávida? | 34 | A senhora está grávida? | MIGRAVEL_SEM_CONFLITO |
| 35 | A senhora está na menopausa? | 35 | A senhora está na menopausa? | MIGRAVEL_SEM_CONFLITO |

## 9. Mapeamento resposta a resposta
- Total de respostas candidatas analisadas: 35.
- Respostas migraveis sem conflito: 35.
- Conflitos com resposta existente no Brana: 0.
- Respostas sem destino estrutural: 0.
- Respostas com paciente duvidoso: 0.
- Outros bloqueios: 0.

| Pergunta | Resposta legado | Complemento legado | Alerta legado | Brana pergunta_id | Situacao |
|---|---|---|---|---:|---|
| 1 | 1 | - | A saúde do paciente não está boa. | 18 | MIGRAVEL_SEM_CONFLITO |
| 2 | 1 | - | - | 19 | MIGRAVEL_SEM_CONFLITO |
| 3 | 2 | - | O paciente está em tratamento médico. | 20 | MIGRAVEL_SEM_CONFLITO |
| 4 | 2 | - | Alergia a medicamento(s). | 21 | MIGRAVEL_SEM_CONFLITO |
| 5 | 2 | - | Paciente apresenta doença grave. | 22 | MIGRAVEL_SEM_CONFLITO |
| 6 | 2 | - | Paciente tomando medicamento. | 23 | MIGRAVEL_SEM_CONFLITO |
| 7 | 1 | - | - | 24 | MIGRAVEL_SEM_CONFLITO |
| 8 | 2 | - | Dificuldade em abrir a boca. | 25 | MIGRAVEL_SEM_CONFLITO |
| 9 | 2 | - | Bruxômano(a). | 26 | MIGRAVEL_SEM_CONFLITO |
| 10 | 2 | - | Apertamento dental. | 27 | MIGRAVEL_SEM_CONFLITO |
| 11 | 2 | - | Apresentou complicações em tratamento odontológico | 28 | MIGRAVEL_SEM_CONFLITO |
| 12 | 2 | - | Paciente com Sinusite. | 29 | MIGRAVEL_SEM_CONFLITO |
| 13 | 2 | - | Paciente tem perdido peso. | 30 | MIGRAVEL_SEM_CONFLITO |
| 14 | 2 | - | Paciente tem ganho peso. | 31 | MIGRAVEL_SEM_CONFLITO |
| 15 | 2 | - | Paciente já foi hospitalizado(a). | 32 | MIGRAVEL_SEM_CONFLITO |
| 16 | 2 | - | Já sofreu intervenção cirúrgica. | 33 | MIGRAVEL_SEM_CONFLITO |
| 17 | 2 | - | Paciente já tomou tranfusão de sangue. | 34 | MIGRAVEL_SEM_CONFLITO |
| 18 | 2 | - | Paciente com fadiga. | 558 | MIGRAVEL_SEM_CONFLITO |
| 19 | 2 | - | Dores articulares no corpo. | 559 | MIGRAVEL_SEM_CONFLITO |
| 20 | 2 | - | Palpitações no coração. | 560 | MIGRAVEL_SEM_CONFLITO |
| 21 | 2 | - | Pressão arterial ALTA. | 561 | MIGRAVEL_SEM_CONFLITO |
| 22 | 2 | - | Tempo de sangramento alterado. | 562 | MIGRAVEL_SEM_CONFLITO |
| 23 | 2 | - | Paciente anêmico. | 563 | MIGRAVEL_SEM_CONFLITO |
| 24 | 2 | - | Tosse persistente. | 564 | MIGRAVEL_SEM_CONFLITO |
| 25 | 2 | - | Asma. | 565 | MIGRAVEL_SEM_CONFLITO |
| 26 | 2 | - | Paciente apresenta alergia(as). | 566 | MIGRAVEL_SEM_CONFLITO |
| 27 | 2 | - | Alergia a anestésicos. | 567 | MIGRAVEL_SEM_CONFLITO |
| 28 | 2 | - | Urina com frequência. | 568 | MIGRAVEL_SEM_CONFLITO |
| 29 | 2 | - | Familiar(es) diabético(s). | 569 | MIGRAVEL_SEM_CONFLITO |
| 30 | 2 | - | Sofre desmaios frequentes. | 570 | MIGRAVEL_SEM_CONFLITO |
| 31 | 2 | - | Dor de cabeça. | 571 | MIGRAVEL_SEM_CONFLITO |
| 32 | 2 | - | Nervoso(a). | 572 | MIGRAVEL_SEM_CONFLITO |
| 33 | 2 | - | STRESS. | 573 | MIGRAVEL_SEM_CONFLITO |
| 34 | 2 | - | Grávida. | 574 | MIGRAVEL_SEM_CONFLITO |
| 35 | 2 | - | Paciente na menopausa. | 575 | MIGRAVEL_SEM_CONFLITO |

## 10. Conflitos encontrados
- Nenhum conflito com respostas existentes foi encontrado para o paciente legado `273` no questionario Principal.
- As 3 respostas de Principal existentes no Brana pertencem ao paciente `646` (`Gleisson Tel`) e nao colidem com o paciente legado `273`.
- As 15 respostas totais atualmente salvas no Brana permanecem inalteradas.

## 11. Regra proposta de nao sobrescrita
- Nunca sobrescrever resposta ja existente.
- Registrar conflito em relatorio.
- Somente migrar campo vazio se houver contrato futuro explicitamente autorizado.
- Priorizar migracao assistida, paciente por paciente, pergunta por pergunta.

## 12. Compatibilidade com envelope B2
- O envelope B2 atual comporta as respostas do Principal sem perda para esta migracao assistida.
- Os codigos de resposta do legado presentes no Principal sao `1, 2, 3` e podem ser preservados na escrita assistida sem criar novo schema.
- `tipo_pergunta` e `mensagem_alerta` continuam como atributos estruturais da pergunta, nao como dados migratorios obrigatorios por resposta.
- Nao foi identificado campo do legado que bloqueie o uso do envelope B2 nesta etapa.

## 13. Analise das opcoes
- `ANAM-MIG-PRINC-DRY-A`: nao aprovado; a estrutura agora esta completa e os conflitos nao impedem seguir.
- `ANAM-MIG-PRINC-DRY-B`: aprovado; o dry-run mostra destino completo e ausencia de conflito para o Principal.
- `ANAM-MIG-PRINC-DRY-C`: nao necessario nesta etapa, porque nao ha subconjunto conflitante identificado.
- `ANAM-MIG-PRINC-DRY-D`: nao necessario, porque nao foi encontrado buraco estrutural restante no Principal.

## 14. Decisao recomendada
- `ANAM-MIG-PRINC-DRY-B`.
- O Principal pode seguir para contrato de escrita assistida, sem executar migracao ainda.

## 15. Proxima subetapa segura
- Abrir contrato de escrita assistida do Principal, mantendo a regra de nao sobrescrita e migrando apenas com autorizacao explicita.
- Antes disso, se necessario, revisar a mec?nica do `tipo_resposta` e a forma exata de persistencia assistida por paciente.

## 16. Conclusao
- O dry-run somente leitura do Principal, com a estrutura ja completa, confirmou destino estrutural completo, ausencia de conflitos e compatibilidade com o envelope B2.
- Nenhuma migracao foi executada nesta etapa.
- A migracao do Principal pode avan?ar para contrato de escrita assistida.
