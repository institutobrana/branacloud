# Convênios e Planos - Subetapa 4 - Integração mínima com fallback local

## Objetivo
Integrar de forma mínima e conservadora os helpers puros da Subetapa 3 ao `frontend/app.js`, mantendo fallback local obrigatório e sem mover a fonte funcional da verdade para o namespace passivo.

## O que foi analisado
- Bloco principal de Convênios e Planos em `frontend/app.js`.
- Funções de payload de convênio e plano.
- Funções de abertura de modal, renderização, seleção, exclusão, carregamento e calendário.
- Presença de `bindStandardGridActivation` e de lógica manual de segundo clique/duplo clique.

## Wrappers criados ou ajustados
- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

## Helpers integrados
- `window.BranaConveniosPlanosModule.helpers.normalizarNomeConvenio`
- `window.BranaConveniosPlanosModule.helpers.normalizarNomePlano`
- `window.BranaConveniosPlanosModule.helpers.normalizarCodigoRegistro`

## Pontos efetivamente integrados no app.js
- Normalização textual simples do código do convênio no payload.
- Normalização textual simples do nome do convênio no payload.
- Normalização textual simples do código do plano no payload.
- Normalização textual simples do nome do plano no payload.

## Fallback local preservado
- Se o namespace passivo não existir, o helper não existir, o helper lançar exceção ou o retorno vier em formato inválido, o `app.js` usa o fallback local equivalente.
- O fallback local preserva a regra textual simples:
  - `null`/`undefined` viram string vazia;
  - `String(valor)`;
  - `trim()`;
  - redução de espaços internos repetidos para um espaço.

## Pontos analisados mas não alterados
- `convPlanAbrir()`
- criação de UI/painel
- renderização de grades
- seleção de linha
- modais
- exclusão/inativação
- calendário de faturamento
- `requestJson` e endpoints
- `bindStandardGridActivation`
- clique simples, duplo clique e segundo clique rápido

Motivo: essas áreas são sensíveis, têm comportamento de fluxo, DOM, eventos ou integração remota e não tinham equivalência textual simples suficiente para uma troca conservadora nesta etapa.

## Confirmações
- `frontend/app.js` continua sendo a fonte funcional da verdade.
- O namespace `window.BranaConveniosPlanosModule` continua passivo, com `ativo: false` e `controlaFluxo: false`.
- Não houve alteração em DOM, eventos, `bindStandardGridActivation`, duplo clique, segundo clique rápido, renderização, modais, `requestJson`, endpoints, backend ou banco.
- `frontend/index.html` não foi alterado nesta etapa.
- Nada foi salvo em:
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`

## Próxima etapa recomendada
Se os testes de console confirmarem a normalização no payload sem regressão, o próximo passo deve ser apenas documentar e, se houver novo ponto textual realmente equivalente, avaliar uma integração adicional pequena e local. Caso contrário, manter o escopo parado nesta camada e evitar avançar para funções de fluxo ou renderização.
