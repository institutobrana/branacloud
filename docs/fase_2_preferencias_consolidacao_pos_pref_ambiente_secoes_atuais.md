# Fase 2 - Preferencias / Configuracoes comuns - Consolidacao documental apos validacao de `prefAmbienteSecoesAtuais`

## Objetivo

Consolidar documentalmente a frente `Preferencias / Configuracoes comuns` apos a validacao bem-sucedida de `prefAmbienteSecoesAtuais(baseSecoes, atuais)` como recorte de risco medio controlado.

## Historico resumido

Helpers pequenos ja extraidos e validados nesta frente:

- `prefAmbEstiloPadrao`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`
- `prefAmbienteSecoesAtuais`

Recorte medio controlado validado:

- `prefAmbienteSecoesAtuais(baseSecoes, atuais)`

## Testes passados

- a tela de `Preferencias / Configuracoes comuns` abriu normalmente;
- a aba `Ambiente` funcionou;
- a troca de secoes funcionou;
- o dialogo de fonte funcionou;
- o preview permaneceu coerente;
- a troca de abas nao apresentou regressao;
- nao houve erro relatado;
- o recorte medio controlado nao quebrou o fluxo.

## Estado final do modulo

Arquivo:

- `frontend/js/modules/preferencias-opcoes-sistema.js`

Estado:

- permanece passivo;
- e carregado antes de `frontend/app.js`;
- expõe `window.BranaPreferenciasOpcoesSistemaModule`;
- contém os helpers extraidos e validados;
- não contém DOM;
- não contém `requestJson`;
- não contém payload;
- não contém salvamento;
- não contém endpoints;
- não contém permissões;
- mantém fallback/duplicidade controlada com `frontend/app.js`.

## O que permanece no app.js

Ainda permanecem em `frontend/app.js`:

- `prefContextoPadrao`;
- `prefResolverContexto`;
- `prefContextoAtual`;
- `prefAmbienteSecaoAtiva`;
- `prefAmbienteEstiloAtual`;
- `prefAtualizarTitulo`;
- `prefRenderCombos`;
- `prefRenderCombosModelos`;
- `prefRenderCombosDados`;
- `prefAbrirDialogoFonteAmbiente`;
- `usersAbrirPreferencias`;
- `prefSelecionarAba`;
- `prefRenderListaAmbiente`;
- `prefAplicarPreviewAmbiente`;
- `prefRebuildAmbientePreview`;
- `prefOdontoEnsureColorDropdowns`;
- `prefSincronizarUI`;
- `prefEnsureUI`;
- `prefColetarPayload*`;
- `prefCarregarDados`;
- `prefSalvar*`;
- `sysOptColetarPayload`;
- `sysOptCarregar`;
- `sysOptSalvar`;
- `sysOptEnsureUI`;
- DOM/renderização;
- abas;
- preview;
- diálogo de fonte;
- `requestJson`;
- payload;
- salvamento;
- permissões;
- endpoints;
- orquestração visual.

## Riscos remanescentes

- `Preferencias / Configuracoes comuns` ainda concentra grande parte do fluxo visual em `frontend/app.js`;
- próximos recortes podem entrar em médio-alto ou alto;
- preview, abas, diálogo de fonte e carregamento/salvamento exigem contrato próprio;
- `requestJson`/salvamento/payload devem continuar fora de recorte imediato;
- qualquer novo recorte deve passar por seleção e contrato documental antes de implementar.

## Recomendacao de continuidade

Recomenda-se a opcao **A**:

- pausar/consolidar `Preferencias / Configuracoes comuns` novamente;
- fazer nova selecao documental entre modulos/blocos antes de qualquer proximo recorte.

Essa recomendacao e a mais segura porque preserva o ganho obtido, evita ampliar demais o escopo na mesma frente e reduz o risco de misturar estado, preview e orquestracao visual com novas extracoes.

## Proxima subetapa recomendada

`Fase 2 - Nova selecao documental entre modulos/blocos apos validacao do recorte medio de Preferencias`

## Registro de blindagem textual/mojibake

Esta etapa e exclusivamente documental. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido nesta entrega. Eventuais textos quebrados ou mojibake devem permanecer apenas como pendencia futura.
