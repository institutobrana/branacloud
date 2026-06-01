# Anamnese Brana - Contrato funcional do alerta visual por pergunta critica

## Objetivo
Definir, sem alterar codigo, como o alerta visual da Anamnese deve funcionar na aba clinica da Ficha Pessoal do Brana Cloud quando a resposta do paciente satisfaz a condicao critica da pergunta.

## Contexto e base documental
Este contrato parte da auditoria do legado EasyDental e da auditoria comparativa do Brana j? conclu?das, usando como base:
- `docs/anamnese_easydental_auditoria_regra_pergunta_critica_icone_alerta.md`
- `docs/anamnese_brana_auditoria_comparativa_regra_critica_icone_alerta.md`
- `docs/ficha_pessoal_anamnese_contrato_manual_easydental_fluxo_configuracao_clinica.md`
- `docs/ficha_pessoal_anamnese_implementacao_tipo_resposta_manual_b.md`
- `docs/11_roadmap_desenvolvimento.md`
- leitura em modo somente de `frontend/js/modules/ficha-pessoal-aba-anamnese.js`
- leitura em modo somente de `frontend/app.js`
- leitura em modo somente de `frontend/js/modules/anamnese.js`
- leitura em modo somente de `backend/models/anamnese.py`
- leitura em modo somente de `backend/models/anamnese_resposta.py`
- recursos visuais em `D:\BRANA ARQUIVOS\BRANA CLOUD\assets\easy\ico_dedo.bmp`, `ico_dedoanamnese.bmp` e `ico_alert.bmp`

## Resumo da regra critica do legado
- O legado contem `ANAMNESE_PERG` com `TIPPER`, `TIPRES` e `TEXMEN`.
- `TIPPER = 1` significa pergunta nao critica.
- `TIPPER = 2` significa pergunta critica para resposta afirmativa.
- `TIPPER = 3` significa pergunta critica para resposta negativa.
- `TIPRES = 1` corresponde a pergunta de resposta sim/nao.
- `TIPRES = 2` corresponde a pergunta de resposta sim/nao/texto.
- `TIPRES = 3` corresponde a pergunta de resposta texto.
- `TEXMEN` guarda a mensagem de alerta associada a pergunta critica.
- O legado possui recursos visuais de alerta, incluindo `ico_dedo.bmp`, `ico_dedoanamnese.bmp` e `ico_alert.bmp`.
- A rotina visual exata do icone nao foi localizada em codigo legivel acessivel, mas a regra visual e sustentada por dados e recursos.

## Estado atual do Brana
- A configuracao da Anamnese grava `tipo_pergunta`, `tipo_resposta` e `mensagem_alerta`.
- A aba clinica da Anamnese le e usa `tipo_resposta` para montar a interface e serializar/deserializar respostas.
- A aba clinica nao mostrou, no codigo inspecionado, uso de `tipo_pergunta` para acionar alerta visual.
- A aba clinica nao mostrou, no codigo inspecionado, uso de `mensagem_alerta` para renderizacao visual.
- A aba clinica nao mostrou, no codigo inspecionado, binding direto para `assets/easy/ico_dedo.bmp` ou outro icone de alerta.
- Portanto, a aderencia atual ao legado e parcial: base estrutural existe, comportamento visual nao esta comprovado.

## Definicao funcional de quando o alerta visual deve aparecer
- O alerta visual deve aparecer somente quando a pergunta for critica e a resposta marcada satisfizer a condicao critica definida em `tipo_pergunta`.
- Para `TIPPER = 2`, o alerta deve aparecer quando a resposta do paciente for `sim`.
- Para `TIPPER = 3`, o alerta deve aparecer quando a resposta do paciente for `nao`.
- `TIPPER = 1` nao deve gerar alerta visual.
- O alerta visual deve ser calculado por pergunta individual, nao por bloco nem por questionario inteiro.
- O alerta visual deve aparecer ao lado da pergunta, mantendo a leitura do layout do legado/print do usuario.

## Definicao funcional de quando o alerta deve desaparecer
- O alerta deve desaparecer imediatamente quando a resposta deixa de satisfazer a condicao critica.
- Se a pergunta critica para `sim` mudar de `sim` para `nao`, o icone deve sumir.
- Se a pergunta critica para `nao` mudar de `nao` para `sim`, o icone deve sumir.
- Em pergunta tipo texto pura, a regra critica nao deve produzir alerta visual nesta primeira etapa.
- O recalculo deve ocorrer em tempo real, enquanto o usuario altera a resposta.
- Ao recarregar uma anamnese ja salva, o alerta deve reaparecer somente nas perguntas cuja resposta salva continue critica.

## Relacao com tipo_pergunta
- `tipo_pergunta` e o gatilho funcional da regra critica.
- `TIPPER = 2` ativa a condicao critica para resposta afirmativa.
- `TIPPER = 3` ativa a condicao critica para resposta negativa.
- `TIPPER = 1` nunca ativa alerta visual.
- A regra critica nao deve ser aplicada de forma global ao questionario inteiro.

## Relacao com tipo_resposta
- `tipo_resposta` continua sendo o campo que define a forma de entrada da resposta.
- Respostas `sim/nao` e `sim/nao/texto` participam da regra critica.
- Resposta `texto` pura nao participa do alerta visual nesta primeira etapa.
- O alerta visual nao deve alterar o envelope B2 nem o formato de salvamento existente.

## Decisao sobre mensagem_alerta nesta primeira etapa
- A mensagem_alerta nao deve ser exibida visualmente nesta primeira etapa funcional.
- A mensagem_alerta pode continuar armazenada e preservada como dado de configuracao e de leitura futura.
- Se houver necessidade posterior de tooltip, linha extra ou painel de detalhe, isso deve ser tratado em contrato separado.
- Portanto, nesta etapa o alerta fica restrito ao icone visual, sem texto exibido ao usuario.

## Decisao sobre o recurso visual/icone a usar
- O recurso prioritario deve ser `assets/easy/ico_dedo.bmp`, pois foi o arquivo indicado pelo usuario e ja existe no Brana.
- `ico_dedoanamnese.bmp` pode ser considerado recurso correlato ou fallback visual, se necessario em evolucao posterior.
- `ico_alert.bmp` pode ser tratado como fallback generico de alerta, nao como primeira opcao desta etapa.
- Nesta fase contratual, o contrato nao obriga troca de asset; apenas define a prioridade funcional do `ico_dedo.bmp`.

## Comportamento esperado ao salvar e reabrir
- O alerta visual nao deve impactar a persistencia nem o envelope B2.
- Ao salvar a anamnese, a resposta deve permanecer no mesmo formato atual.
- Ao reabrir a aba, as respostas ja salvas devem ser recarregadas e o icone deve reaparecer nas perguntas que continuarem criticas.
- O contrato nao exige nenhuma migracao de dados.

## Comportamento esperado na troca de resposta em tempo real
- Se o usuario trocar a resposta de `sim` para `nao` ou de `nao` para `sim`, o alerta deve ser recalculado imediatamente.
- Se a pergunta nao for critica, a mudanca de resposta nao deve exibir icone.
- Se a pergunta for texto pura, o alerta visual deve permanecer desligado nesta primeira etapa.
- O comportamento deve ficar limitado a reacao visual local da aba Anamnese.

## Escopo permitido da futura implementacao
- Ajustar apenas a aba clinica da Anamnese na Ficha Pessoal.
- Inserir logica visual para mostrar e ocultar o icone por pergunta.
- Preservar o envelope B2 e o formato atual de salvamento.
- Preservar a configuracao de perguntas e respostas existente.
- Preservar a regra de mensagem_alerta como dado, sem exibicao nesta primeira etapa.

## Escopo proibido da futura implementacao
- Backend novo.
- Banco novo.
- Migration nova.
- Seeds novos.
- Endpoints novos.
- Mudanca no formato de salvamento.
- Mudanca no envelope B2.
- Mudanca em Odontograma ou Preferencias.
- Mudanca em outros modulos da Ficha Pessoal fora da aba Anamnese.
- Mudanca de texto, perguntas ou mensagens do legado.
- Qualquer escrita no EasyDental legado.

## Analise das opcoes ANAM-ALERTA-VISUAL-A/B/C/D
- `ANAM-ALERTA-VISUAL-A`: apenas icone por pergunta critica satisfeita. Atende a menor implementacao segura e respeita o print do usuario sem ampliar escopo.
- `ANAM-ALERTA-VISUAL-B`: icone + mensagem_alerta visivel localmente. Mais rico, mas nao e o minimo necessario nesta fase.
- `ANAM-ALERTA-VISUAL-C`: apenas mensagem, sem icone. Nao recomendado porque foge da evid?ncia principal do legado/print.
- `ANAM-ALERTA-VISUAL-D`: integracao futura com outras areas. Nao recomendada agora.

## Decisao recomendada
- `ANAM-ALERTA-VISUAL-A`
- Justificativa: e a menor implementacao segura, aderente ao legado observado e suficiente para validar a regra critica visual sem mexer em persistencia nem ampliar o escopo para Odontograma ou Preferencias.

## Riscos
- Exibir icone em pergunta nao critica: risco de falso positivo visual.
- Nao esconder o icone quando a resposta mudar: risco de falso positivo persistente.
- Misturar mensagem_alerta com a etapa inicial: risco de ampliar escopo e confundir a validacao.
- Tentar reutilizar o alerta em outras areas do sistema agora: risco de regressao fora da Anamnese.
- Alterar o envelope B2 por engano: risco alto e fora do contrato.

## Proxima subetapa segura
- Implementar apenas o gatilho visual do icone na aba clinica da Anamnese, seguindo `ANAM-ALERTA-VISUAL-A`.
- Validar manualmente que o icone aparece e desaparece em tempo real conforme a resposta e a criticidade.
- Deixar a mensagem_alerta para contrato posterior, se necessario.

## Conclusao
O Brana Cloud ja tem a base estrutural da regra critica, mas ainda nao reproduz de forma comprovada o comportamento visual do EasyDental.
Este contrato define a menor implementacao segura para o alerta visual: mostrar um icone por pergunta critica satisfeita, somente na aba Anamnese, sem mensagem visual nesta primeira etapa e sem alterar persistencia.
