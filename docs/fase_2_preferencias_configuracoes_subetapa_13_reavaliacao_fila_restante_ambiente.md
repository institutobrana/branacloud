# Preferencias / Configuracoes comuns - Subetapa 13 - Reavaliacao documental da fila restante apos o dialogo de fonte

## Objetivo da reavaliacao
Reavaliar a fila restante do ambiente apos a validacao do helper `prefAmbienteDialogoValor`, confirmando qual proximo helper ainda pode ser tratado com risco controlado.

## Historico dos helpers ja validados
- `prefAmbEstiloPadrao`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`

## Candidato principal reavaliado
- `prefAmbienteEstiloDeDialogo`

## Analise tecnica individual
- `prefAmbienteEstiloDeDialogo` e um helper quase puro, nao um helper totalmente literal.
- Nao usa DOM diretamente.
- Nao usa `window/document` para acesso a elementos; apenas depende de `window.easyFontNormalizeStyleId` de forma opcional na transformacao final do `styleId`.
- Nao usa estado global para leitura de dados de negocio.
- Nao usa `requestJson`.
- Nao monta payload.
- Nao depende de `tenant`, `clinica`, `user_id` ou contexto de backend.
- Nao altera texto visivel por conta propria.
- Nao altera preview diretamente; ele prepara o valor final que sera aplicado no dialogo de fonte.
- Depende de `prefAmbEstiloPadrao` para o baseline do objeto.
- Depende de `normalize` apenas de forma opcional para `styleId`.
- Depende de uma base de estilo (`base`) que e combinada com o valor do dialogo.
- Pode ser extraido com fallback local equivalente.
- Deve ir para `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Risco real de extracao: baixo-medio.
- E seguro implementar na proxima subetapa, desde que permaneça minima e com fallback preservado.

## Verificacao de outro candidato ainda mais seguro
- Nao foi identificado outro helper da mesma fila com superficie menor e mais segura do que `prefAmbienteEstiloDeDialogo`.
- Os helpers restantes com menor risco continuam sendo os candidatos anteriores de ambiente, ja validados ou reavaliados.

## Candidato recomendado para a proxima implementacao
- `prefAmbienteEstiloDeDialogo`

## Justificativa
- E o proximo helper da fila de ambiente com menor blast radius apos os helpers ja validados.
- Nao toca em salvamento, payload, endpoints, permissao ou backend.
- A logica central permanece uma transformacao de objeto de estilo, com dependencias pequenas e previsiveis.
- A dependencia opcional de `normalize` e o baseline de `prefAmbEstiloPadrao` ja estao claros e podem ser preservados com fallback simples.

## Escopo exato recomendado para a proxima implementacao
- Extrair apenas `prefAmbienteEstiloDeDialogo(base, valor)` para `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Expor o helper em `window.BranaPreferenciasOpcoesSistemaModule`.
- Em `frontend/app.js`, consultar primeiro o helper do modulo passivo.
- Preservar fallback local equivalente no `app.js`.
- Preservar a dependencia de `prefAmbEstiloPadrao`.
- Preservar a dependencia opcional de `window.easyFontNormalizeStyleId`.
- Arquivos provavelmente alterados: `frontend/app.js`, `frontend/js/modules/preferencias-opcoes-sistema.js`, `docs/11_roadmap_desenvolvimento.md` e o documento da proxima subetapa.
- Arquivos que nao devem ser alterados: `frontend/index.html`, backend, banco, schema, migrations, seeds, endpoints, permissoes, `package.json`, arquivos de configuracao, salvamento, `requestJson`, payload, senha administrativa, `tenant/clinica/user_id`, abas e preview complexo.

## Checks futuros
- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`

## Teste manual futuro
- Abrir `Preferencias / Configuracoes comuns`.
- Entrar na aba `Ambiente`.
- Abrir o dialogo de fonte.
- Alterar um estilo e confirmar que o preview continua coerente.
- Fechar e reabrir o dialogo para validar o valor inicial e a aplicacao do estilo.

## Riscos remanescentes
- O modulo passivo continua parcial.
- A duplicidade controlada entre `frontend/app.js` e o modulo passivo continua existindo.
- O dialogo de fonte continua sendo um ponto sensivel de UX e deve ser tratado com extracoes pequenas.

## Pendencias futuras
- Seguir a fila de helpers do ambiente com extractions minimas e testadas.
- Registrar qualquer texto quebrado ou mojibake ja existente apenas como pendencia documental.
- O texto de exemplo do helper ja extraido permanece com indicio de encoding quebrado na forma como foi lido e nao deve ser corrigido nesta trilha.

## Blindagem textual/mojibake
- A blindagem textual/mojibake foi respeitada.
- Qualquer texto quebrado ou mojibake ja existente deve permanecer apenas como pendencia documental futura.

## Proxima subetapa recomendada
- `Preferencias / Configuracoes comuns - Subetapa 14 - Implementacao minima do helper prefAmbienteEstiloDeDialogo`
