# Ficha Pessoal - Anamnese - Implementacao estrutural do questionario Principal na clinica 1

## 1. Objetivo
- Executar a escrita estrutural controlada do questionario Principal da clinica ID 1, acrescentando as 18 perguntas faltantes (18..35) sem migrar respostas.
- Preservar integralmente as perguntas 1..17 atuais e as 15 respostas ja existentes no Brana.

## 2. Decisao contratual
- Decisao aplicada: `ANAM-MIG-STRUCT-B1`.

## 3. Backup criado
- Backup manual criado em `D:\BRANA ARQUIVOS\BRANA CLOUD\backups_modularizacao\fase_2c\anamnese_principal_estrutura_clinica_1_acrescimo_18_35`.
- Artefatos de backup: `anamnese_questionarios_before.csv`, `anamnese_perguntas_before.csv`, `anamnese_respostas_before.csv`, `manifest_before.json`.

## 4. Metodo utilizado
- Script auxiliar controlado: `expandir_principal_clinica1_18_35.py`.
- Modo de operacao: `execute`.
- Fonte das perguntas acrescidas: `docs/anamnese_easy_dell_servidor_principal_perguntas_faltantes.csv`.
- A escrita foi executada somente para `anamnese_perguntas` do Principal da clinica 1.

## 5. Validacao do dry-run
- Questionario Principal identificado na clinica 1 com id `2`.
- Total antes: `17` perguntas.
- Numeros existentes antes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].
- Inexistencia previa de 18..35 confirmada antes da escrita.
- As 15 respostas atuais do Brana permaneceram fora do escopo.
- Outros questionarios presentes na clinica 1 antes da escrita: Implante, Ficha complementar, Anamnese de Saúde, Anamnese pessoal.

## 6. Confirmacao da execucao real unica
- Execucao real realizada: sim.
- Perguntas inseridas: 18.
- Nenhuma resposta foi migrada.

## 7. Total de perguntas antes
- Principal antes da escrita: 17.

## 8. Total de perguntas depois
- Principal depois da escrita: 35.

## 9. Perguntas 18..35 acrescentadas
- 18. Sente fadiga ou fraqueza? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Paciente com fadiga.
- 19. Tem dor nas articulações? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Dores articulares no corpo.
- 20. Sente "palpitações " no coração? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Palpitações no coração.
- 21. Sua pressão sanguínea é alta? | tipo_pergunta=2 | tipo_resposta=2 | alerta=Pressão arterial ALTA.
- 22. Sangra, por muito tempo, quando se corta? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Tempo de sangramento alterado.
- 23. Tem anemia? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Paciente anêmico.
- 24. Tem tosse persistente? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Tosse persistente.
- 25. Tem asma? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Asma.
- 26. Tem alguma alergia? | tipo_pergunta=2 | tipo_resposta=2 | alerta=Paciente apresenta alergia(as).
- 27. Já teve alguma reação com anestésicos? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Alergia a anestésicos.
- 28. Urina com muita frequência? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Urina com frequência.
- 29. Tem algum diabético em sua família? | tipo_pergunta=2 | tipo_resposta=2 | alerta=Familiar(es) diabético(s).
- 30. Costuma desmaiar com frequência? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Sofre desmaios frequentes.
- 31. Sente dor de cabeça com frequência? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Dor de cabeça.
- 32. Considera-se nervoso(a)? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Nervoso(a).
- 33. Está estressado(a)? | tipo_pergunta=2 | tipo_resposta=1 | alerta=STRESS.
- 34. A senhora está grávida? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Grávida.
- 35. A senhora está na menopausa? | tipo_pergunta=2 | tipo_resposta=1 | alerta=Paciente na menopausa.

## 10. Preservacao das perguntas 1..17
- As 17 perguntas originais permanecem com os mesmos numeros e na mesma ordem.
- Nenhuma pergunta 1..17 foi apagada, renumerada ou sobrescrita.

## 11. Respostas
- Nenhuma resposta foi migrada.
- As respostas existentes no Brana nao foram alteradas.
- A tabela `anamnese_respostas` permaneceu inalterada nesta etapa.

## 12. Outros questionarios e outras clinicas
- Outros questionarios da clinica 1 permanecem inalterados: Implante, Ficha complementar, Anamnese de Saúde, Anamnese pessoal.
- Outras clinicas nao foram alteradas.

## 13. Riscos residuais
- A migracao das respostas ainda precisa de novo dry-run somente leitura apos a estrutura completa.
- Eventual divergencia de `tipo_resposta`, `tipo_pergunta` ou `mensagem_alerta` nas 17 primeiras perguntas deve ser tratada em contrato separado, se vier a ser exigida.
- A aba clinica pode exigir refresh manual para refletir a estrutura completa.

## 14. Onde testar no sistema
- Abrir o sistema e entrar na clinica 1.
- Ir em `Configuracao -> Anamnese`.
- Abrir o questionario `Principal`.
- Confirmar que agora existem 35 perguntas.
- Confirmar que as perguntas 1..17 antigas permanecem.
- Confirmar que as perguntas 18..35 aparecem na ordem correta.
- Abrir `Ficha Pessoal`.
- Selecionar um paciente da clinica 1.
- Entrar na aba `Anamnese` e selecionar o questionario `Principal`.
- Confirmar que a lista carrega sem erro e que o botao `Grava` continua funcionando.
- Confirmar que nenhuma resposta antiga foi apagada.

## 15. Checks e resultados
- Estado antes validado via leitura somente leitura do banco.
- Script auxiliar validado com dry-run antes da escrita.
- Escrita real executada uma unica vez, sem erros.
- Estado depois validado via leitura somente leitura do banco.
- Outros questionarios e respostas conferidos como inalterados.
- Nenhuma migracao de respostas foi feita.
- Nenhum backend, frontend, schema, endpoint ou seed foi alterado.
