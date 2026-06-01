# Anamnese EasyDental - Auditoria da regra de pergunta critica e icone de alerta

## Objetivo
Auditar, em leitura somente, se o EasyDental legado possui a regra de pergunta critica na Anamnese, incluindo `tipo_pergunta`, `tipo_resposta`, `mensagem_alerta` e a indicacao visual por icone quando a resposta coincide com a condicao critica.

## Contexto
Auditoria executada sobre a base legada `\\Dell_servidor\c\EDS70`, sem escrita, sem alteracao de banco e sem alteracao de arquivos do legado.
A analise usou artefatos de descoberta ja extraidos no workspace, tabelas do legado, arquivos de distribuicao e recursos de icones.

## Commit validado
Nao se aplica. Esta e uma etapa documental de auditoria, ainda sem commit de implementacao funcional anterior nesta frente.

## Base documental validada
- `docs/anamnese_eds70_descoberta_tabelas.txt`
- `docs/anamnese_eds70_descoberta_colunas.txt`
- `docs/anamnese_eds70_extraido_questionarios.csv`
- `docs/anamnese_eds70_extraido_perguntas.csv`
- `docs/anamnese_easy_dell_servidor_respostas_candidatas_clinica_1.csv`
- `backend/estrutura_eds70.txt`
- `backend/estrutura_precificacao.txt`
- `\\Dell_servidor\\c\\EDS70\\Icones\\ico_dedo.bmp`
- `\\Dell_servidor\\c\\EDS70\\Icones\\ico_dedoanamnese.bmp`
- `\\Dell_servidor\\c\\EDS70\\Icones\\ico_alert.bmp`
- `\\Dell_servidor\\c\\EDS70\\Dados\\Dist\\ANAMNESE_PERG.raw`
- `\\Dell_servidor\\c\\EDS70\\Dados\\Dist\\ANAMNESE_QUEST.raw`

## Confirmacoes da auditoria
- A tabela `ANAMNESE_PERG` existe e contem `TIPPER`, `TIPRES` e `TEXMEN`.
- A tabela `ANAMNESE_RESP` existe e armazena `RESPOSTA` e `COMPLEM` por paciente/questionario/pergunta.
- O legado tem dados suficientes para distinguir pergunta critica, tipo de resposta e mensagem de alerta.
- O legado possui recursos de icone associados a Anamnese, incluindo `ico_dedo.bmp` e `ico_dedoanamnese.bmp`.
- Nao foi encontrado, nos arquivos legiveis acessiveis, o codigo-fonte humano que explicita a rotina de renderizacao do icone.

## Regra de pergunta critica observada no legado
- `TIPPER = 1`: pergunta nao critica.
- `TIPPER = 2`: pergunta critica para resposta afirmativa.
- `TIPPER = 3`: pergunta critica para resposta negativa.

## Regra de tipo de resposta observada no legado
- `TIPRES = 1`: resposta sim/nao.
- `TIPRES = 2`: resposta sim/nao/texto.
- `TIPRES = 3`: resposta texto.

## Mensagem de alerta
- `TEXMEN` guarda a mensagem de alerta associada a pergunta critica.
- Em perguntas nao criticas, `TEXMEN` aparece vazio.
- Nos exemplos revisados, a mensagem de alerta e coerente com a condicao critica da pergunta.

## Evidencia visual de icone
- A existencia de `ico_dedo.bmp`, `ico_dedoanamnese.bmp` e `ico_alert.bmp` no legado sustenta visualmente a regra de alerta da Anamnese.
- A auditoria confirmou que ha base de recursos para o icone de alerta, mas nao conseguiu provar a rotina de exibicao a partir de fonte legivel acessivel.
- Portanto, a conclusao segura e: o icone esta suportado por recursos e dados, mas a implementacao exata da renderizacao nao foi inspecionada diretamente.

## Comparacao preliminar com o Brana Cloud
- O Brana Cloud ja possui campos e fluxo analogos para `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta` na trilha de Anamnese.
- O legado confirma que esses tres campos sao suficientes para descrever a regra critica.
- O ponto em aberto e a equivalencia visual completa do icone de alerta e do comportamento de exibicao por condicao critica.

## Resultado da auditoria
- A regra critica da Anamnese existe no EasyDental legado.
- O modelo de dados contem os elementos necessarios para `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`.
- Ha recursos de icone associados ao fluxo de Anamnese.
- O mecanismo visual exato do icone nao foi encontrado em fonte legivel acessivel.

## Recomendacao de proxima etapa
Abrir uma auditoria comparativa entre o comportamento atual da Anamnese no Brana Cloud e a regra critica do legado, focando em como o alerta visual deve aparecer quando a resposta coincide com a condicao critica, sem alterar dados nem codigo nesta fase.
