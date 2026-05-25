# Preferencias / Configuracoes comuns - Subetapa 11 - Implementacao minima do helper prefAmbienteDialogoValor

## Objetivo da subetapa
Extrair de forma minima o helper `prefAmbienteDialogoValor`, preservando o comportamento atual do dialogo de fonte e mantendo fallback local equivalente em `frontend/app.js`.

## Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_preferencias_configuracoes_subetapa_11_implementacao_pref_ambiente_dialogo_valor.md`

## Helper implementado
- `prefAmbienteDialogoValor(style)`

## Motivo do risco baixo-medio
- Nao usa `requestJson`.
- Nao monta payload.
- Nao faz salvamento.
- Nao altera backend.
- Nao mexe em tenant/clinica/user_id.
- Nao altera abas.
- Nao altera o dialogo de fonte.
- E um helper quase puro, mas ainda ligado ao preview/dialogo e a dependencia opcional de normalize.

## Como a dependencia opcional de normalize foi preservada
- A logica atual continua verificando `window.easyFontNormalizeStyleId`.
- Quando disponivel, usa a normalizacao existente.
- Quando indisponivel, usa `String(ref.fonte_estilo || "normal")` como fallback local.

## Como o fallback foi preservado
- `frontend/app.js` consulta primeiro `window.BranaPreferenciasOpcoesSistemaModule.prefAmbienteDialogoValor(style)`.
- Se o modulo passivo nao estiver disponivel, a implementacao local equivalente continua presente em `app.js`.

## O que nao foi alterado
- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissoes
- `package.json`
- arquivos de configuracao
- salvamento
- `requestJson`
- payload
- senha administrativa
- `tenant/clinica/user_id`
- abas
- preview complexo
- renderizacao sensivel
- multiarea
- `Agenda principal`
- `Agenda de contatos`
- textos visiveis e mojibake

## Checks executados
- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`

## Teste manual recomendado
- Abrir `Preferencias / Configuracoes comuns`.
- Entrar na aba `Ambiente`.
- Abrir o dialogo de fonte.
- Conferir o carregamento do valor inicial do dialogo.
- Ajustar uma fonte e confirmar que o preview continua coerente.

## Riscos remanescentes
- O modulo passivo continua parcial.
- A duplicidade controlada entre `app.js` e o modulo passivo continua existindo.
- Mudancas futuras no preview/dialogo ainda exigem cautela para nao ampliar o acoplamento visual.

## Blindagem textual/mojibake
- A blindagem textual/mojibake foi respeitada.
- Qualquer texto quebrado ou mojibake ja existente deve permanecer apenas como pendencia documental futura.

## Pendencias futuras
- Validar o proximo helper seguro da fila do ambiente.
- Manter acompanhamento da duplicidade controlada entre `app.js` e o modulo passivo.

## Proxima subetapa recomendada
- `Preferencias / Configuracoes comuns - Subetapa 12 - Validacao pos-teste do helper prefAmbienteDialogoValor`
