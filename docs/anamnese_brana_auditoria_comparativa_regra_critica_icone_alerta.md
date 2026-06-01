# Anamnese Brana - Auditoria comparativa da regra critica e icone de alerta

## Objetivo
Comparar, em leitura somente, o comportamento atual da aba Anamnese no Brana Cloud com a regra critica do EasyDental legado, para verificar se o alerta visual e o uso de icone estao corretos, parciais ou ausentes.

## Base documental usada
- `docs/anamnese_easydental_auditoria_regra_pergunta_critica_icone_alerta.md`
- `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md`
- `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`
- `docs/ficha_pessoal_anamnese_implementacao_persistencia_b2_envelope_textual.md`
- `docs/ficha_pessoal_anamnese_validacao_grava_integrado_remocao_controle_temporario.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- `frontend/app.js`
- `frontend/js/modules/anamnese.js`
- `backend/models/anamnese.py`
- `backend/models/anamnese_resposta.py`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\ico_dedo.bmp`
- outros icones correlatos presentes em `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy`

## Resumo da regra do legado
- O legado contem `ANAMNESE_PERG` com `TIPPER`, `TIPRES` e `TEXMEN`.
- `TIPPER = 1` corresponde a pergunta nao critica.
- `TIPPER = 2` corresponde a pergunta critica para resposta afirmativa.
- `TIPPER = 3` corresponde a pergunta critica para resposta negativa.
- `TIPRES = 1` corresponde a pergunta de resposta sim/nao.
- `TIPRES = 2` corresponde a pergunta de resposta sim/nao/texto.
- `TIPRES = 3` corresponde a pergunta de resposta texto.
- `TEXMEN` guarda a mensagem de alerta da pergunta critica.
- O legado possui recursos visuais de alerta, incluindo `ico_dedo.bmp`, `ico_dedoanamnese.bmp` e `ico_alert.bmp`.
- A rotina visual exata de renderizacao do icone nao foi localizada em codigo legivel acessivel.

## Mapeamento do que existe hoje no Brana
- A configuracao da Anamnese em `frontend/app.js` grava e edita `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta` nas perguntas do questionario.
- A aba clinica em `frontend/js/modules/ficha-pessoal-aba-anamnese.js` le e usa `tipo_resposta` para decidir o tipo de controle visual da resposta.
- A aba clinica serializa e desserializa respostas no envelope B2, preservando `tipo_resposta`, `resposta` e `complemento`.
- A aba clinica nao mostrou, no codigo inspecionado, uso de `tipo_pergunta` para regras de alerta.
- A aba clinica nao mostrou, no codigo inspecionado, uso de `mensagem_alerta` para renderizacao visual.
- A aba clinica nao mostrou, no codigo inspecionado, referencia direta a `assets/easy/ico_dedo.bmp` ou a qualquer outro icone de alerta.

## Recursos visuais encontrados no Brana
- O arquivo `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\ico_dedo.bmp` existe.
- O arquivo `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\ico_dedoanamnese.bmp` existe.
- O arquivo `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\ico_alert.bmp` existe.
- Foram encontrados outros arquivos de alerta correlatos em `assets/easy`.
- Apesar disso, nao foi encontrado, na aba clinica da Anamnese, o binding de renderizacao que consuma esses recursos.

## Analise do uso atual de tipo_pergunta
- `tipo_pergunta` existe no modelo `backend/models/anamnese.py`.
- `tipo_pergunta` e usado na tela de configuracao para gravar a pergunta.
- Na aba clinica analisada, `tipo_pergunta` nao e usado para decidir exibicao de alerta, exibicao de icone ou mensagem contextual.
- Conclusao parcial: o campo existe e e persistido, mas o uso clinico atual observado e incompleto para regra critica.

## Analise do uso atual de tipo_resposta
- `tipo_resposta` existe no modelo de pergunta e no modelo de resposta como parte do contrato da Anamnese.
- A aba clinica usa `tipo_resposta` para decidir se a pergunta mostra Sim/Nao, Sim/Nao/Texto ou Texto.
- A aba clinica usa `tipo_resposta` ao serializar e desserializar o envelope B2.
- Conclusao: o uso de `tipo_resposta` esta aderente ao fluxo de resposta, mas nao fecha sozinho a regra de alerta critico.

## Analise do uso atual de mensagem_alerta
- `mensagem_alerta` existe no modelo de pergunta e e editada na configuracao.
- A tela de configuracao grava `mensagem_alerta` na pergunta.
- Na aba clinica nao foi localizado uso visual de `mensagem_alerta` no render atual.
- Conclusao: o campo esta preservado e configuravel, mas nao aparece visualmente no fluxo clinico inspecionado.

## Analise da exibicao do icone
- Nao foi encontrado no codigo da aba clinica um trecho que mostre o icone de alerta quando a resposta coincide com a condicao critica.
- Nao foi encontrado no codigo da aba clinica um trecho que esconda ou mostre o icone conforme `TIPPER` ou `TEXMEN`.
- Nao foi encontrado no codigo da aba clinica um trecho que use `ico_dedo.bmp` ou outro arquivo de icone de alerta.
- Portanto, o comportamento visual atual nao pode ser confirmado como aderente ao legado apenas pelo codigo inspecionado.
- O print mostrado pelo usuario faz sentido como evidenca de uma regra desejada, mas nao foi possivel confirmar que o caminho atual do codigo o reproduz integralmente.

## Aderencia atual do Brana ao legado
- Aderencia estrutural: parcial.
- Aderencia de dados: boa para `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta` como campos persistidos.
- Aderencia visual do alerta critico: incompleta.
- Aderencia ao icone do alerta: nao confirmada no codigo inspecionado.
- Aderencia a regra critica completa do legado: parcial, pois falta o comportamento visual e a decisao de exibicao do alerta no fluxo clinico.

## Lacunas encontradas
- Falta vincular a decisao critica da pergunta ao render da aba clinica.
- Falta mostrar o icone de alerta quando a resposta satisfaz a condicao critica.
- Falta confirmar ou implementar o uso visual de `mensagem_alerta` na aba clinica.
- Falta confirmar se `TIPPER = 2` e `TIPPER = 3` estao sendo tratados de forma distinta no fluxo visual.
- Falta confirmar se o icone exibido pelo usuario e realmente `assets/easy/ico_dedo.bmp` ou outro recurso correlato.
- Falta uma evidencia de comportamento visual por teste automatizado ou manual focado no alerta critico.

## Conclusao
O Brana Cloud atual reproduz parcialmente a base de dados e o contrato de resposta da Anamnese, mas nao reproduz de forma comprovada a regra visual de alerta critico do EasyDental legado.
A leitura atual mostra suporte para `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`, mas o render da aba clinica nao demonstra o uso do alerta visual nem a associacao confirmada com o icone.

## Proxima recomendacao
Abrir uma implementacao/correcao do alerta visual da Anamnese no Brana, focando no contrato funcional para:
- diferenciar critica para sim e critica para nao;
- exibir o icone apenas quando a resposta bater com a criticidade;
- mostrar `mensagem_alerta` de forma visual coerente;
- confirmar se o icone final deve ser `assets/easy/ico_dedo.bmp` ou um recurso alternativo do proprio projeto.
