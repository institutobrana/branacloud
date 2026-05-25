# Preferencias / Configuracoes comuns - Subetapa 16 - Reavaliacao documental da fila restante apos o dialogo de estilo

## Objetivo da reavaliacao
Reavaliar a fila restante do ambiente apos a validacao do helper `prefAmbienteEstiloDeDialogo`, verificando se ainda existe algum candidato pequeno e seguro suficiente para nova extracao minima.

## Historico dos helpers ja validados
- `prefAmbEstiloPadrao`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`

## Candidatos reavaliados
- `prefContextoPadrao`
- `prefResolverContexto`
- `prefContextoAtual`
- `prefAmbienteSecoesAtuais`
- `prefAmbienteSecaoAtiva`
- `prefAmbienteEstiloAtual`
- `prefAtualizarTitulo`
- `prefRenderCombos`
- `prefRenderCombosModelos`
- `prefRenderCombosDados`
- `prefAbrirDialogoFonteAmbiente`
- `usersAbrirPreferencias`

## Analise tecnica individual

### prefContextoPadrao
- Tipo: helper de contexto.
- Usa estado global (`sessaoAtual`).
- Nao usa DOM direto nem `requestJson`.
- Nao monta payload, mas prepara identificadores de usuario/contexto.
- Depende de `tenant`/`user_id`/contexto de sessao.
- Nao altera preview, mas define origem de fluxo.
- Pode ser extraido com fallback local equivalente, mas ja cruza contexto de negocio.
- Deve ir para um arquivo futuro de contexto, nao para o modulo passivo atual.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefResolverContexto
- Tipo: helper de contexto.
- Usa parametro externo e cai em `prefContextoPadrao`.
- Nao usa DOM, `requestJson` ou payload.
- Depende de contexto de usuario/sessao.
- Deve ir para um arquivo futuro de contexto.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefContextoAtual
- Tipo: helper de consulta de contexto.
- Usa estado global (`prefCfg`).
- Nao usa DOM direto.
- Dependente de fluxo global da tela.
- Deve ficar junto do bloco de contexto, nao no modulo passivo atual.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefAmbienteSecoesAtuais
- Tipo: helper quase puro, mas acoplado a estado de tela.
- Usa `prefValoresPadraoAmbiente()` e `prefCfg`.
- Nao usa `requestJson` nem payload.
- Altera estrutura de preview/estado do ambiente de forma indireta.
- Depende de dados ja combinados da UI.
- Poderia ser extraido com fallback local, mas dependeria de mais contexto do ambiente.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefAmbienteSecaoAtiva
- Tipo: helper de contexto/seleção.
- Usa `prefCfg` e opcoes de ambiente.
- Nao usa DOM direto, mas depende de estado global e lista de secoes.
- Nao usa `requestJson` nem payload.
- Pode influenciar o preview e o dialogo.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefAmbienteEstiloAtual
- Tipo: helper de agregacao de estado.
- Depende de `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva` e `prefAmbEstiloPadrao`.
- Nao usa DOM ou `requestJson`.
- E mais um agregador do fluxo visual do ambiente.
- Poderia ser extraido, mas a dependencia em outros helpers de contexto aumenta o acoplamento.
- Risco real de extracao: medio.
- Nao e seguro implementar imediatamente.

### prefAtualizarTitulo
- Tipo: helper visual/DOM.
- Usa DOM para atualizar titulo do modal.
- Depende de `prefCfg`.
- Altera texto visivel.
- Nao usa `requestJson` nem payload.
- E um helper de interface, nao candidato para o modulo passivo atual.
- Risco real de extracao: medio-alto.
- Nao e seguro implementar imediatamente.

### prefRenderCombos
- Tipo: renderizacao visual/DOM.
- Usa DOM e manipula `innerHTML`.
- Depende de estado global da tela.
- Altera texto visivel e opcoes de campos.
- Nao usa `requestJson` nem payload.
- Deve permanecer no bloco da UI.
- Risco real de extracao: alto.
- Nao e seguro implementar imediatamente.

### prefRenderCombosModelos
- Tipo: renderizacao visual/DOM.
- Usa DOM e manipula `innerHTML`.
- Depende de estado global da tela.
- Altera texto visivel e opcoes de campos.
- Nao usa `requestJson` nem payload.
- Deve permanecer no bloco da UI.
- Risco real de extracao: alto.
- Nao e seguro implementar imediatamente.

### prefRenderCombosDados
- Tipo: renderizacao visual/DOM.
- Usa DOM e manipula `innerHTML`.
- Depende de estado global da tela.
- Altera texto visivel.
- Nao usa `requestJson` nem payload.
- Deve permanecer no bloco da UI.
- Risco real de extracao: alto.
- Nao e seguro implementar imediatamente.

### prefAbrirDialogoFonteAmbiente
- Tipo: fluxo visual/integracao.
- Usa DOM, estado global, abertura de dialogo e preview.
- Depende de `prefAmbienteSecaoAtiva`, `prefAmbienteSecoesAtuais`, `prefAmbienteDialogoValor`, `prefAmbienteTextoExemplo`, `prefAmbienteEstiloDeDialogo` e `prefSincronizarUI`.
- Nao usa `requestJson` nem payload, mas orquestra o dialogo de fonte inteiro.
- Altera preview e fluxo visual sensivel.
- Risco real de extracao: alto.
- Nao e seguro implementar imediatamente.

### usersAbrirPreferencias
- Tipo: evento/fluxo visual de abertura.
- Usa DOM, estado global e orquestracao de tela.
- Depende do modo de usuario selecionado e do fluxo da janela de preferencias.
- Nao usa `requestJson` diretamente, mas inicia o fluxo de UI.
- Nao e candidato pequeno.
- Risco real de extracao: alto.
- Nao e seguro implementar imediatamente.

## Comparacao de risco
- `prefContextoPadrao`, `prefResolverContexto`, `prefContextoAtual`, `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva` e `prefAmbienteEstiloAtual` estao no limite entre medio e medio-alto por dependerem de contexto global da tela.
- `prefAtualizarTitulo`, `prefRenderCombos`, `prefRenderCombosModelos`, `prefRenderCombosDados`, `prefAbrirDialogoFonteAmbiente` e `usersAbrirPreferencias` ja entram em DOM/renderizacao/fluxo visual, com risco alto.
- Nao foi identificado nenhum candidato restante pequeno o suficiente para uma nova implementacao minima com o mesmo nivel de seguranca dos helpers ja extraidos.

## Recomendacao de continuidade
- Pausar a frente `Preferencias / Configuracoes comuns` apos as extracoes ja validadas.
- Nao iniciar nova implementacao nesta rodada.
- Registrar a frente como documentalmente consolidada ate uma nova reavaliacao comparativa.

## Justificativa da pausa
- Os helpers de baixo risco ja foram extraidos e validados.
- O restante da fila entra em contexto, estado global ou DOM/fluxo visual de forma mais intensa.
- Manter a extração minima agora aumentaria o blast radius.
- A pausa reduz o risco de regressao em um fluxo que ainda e sensivel.

## Riscos remanescentes
- O modulo passivo continua parcial.
- A duplicidade controlada entre `frontend/app.js` e o modulo passivo continua existindo.
- O fluxo de preferencias ainda carrega helpers médios/altos que exigem novas analises futuras.

## Pendencias futuras
- Reavaliar a frente apenas em nova janela documental, se necessario.
- Comparar novamente com outro modulo core/comum antes de qualquer nova extração.
- Registrar qualquer texto quebrado ou mojibake ja existente apenas como pendencia documental.

## Blindagem textual/mojibake
- A blindagem textual/mojibake foi respeitada.
- Qualquer texto quebrado ou mojibake ja existente deve permanecer apenas como pendencia documental futura.

## Proxima subetapa recomendada
- `Preferencias / Configuracoes comuns - Subetapa 17 - Fechamento documental da frente e consolidacao de pausa`
