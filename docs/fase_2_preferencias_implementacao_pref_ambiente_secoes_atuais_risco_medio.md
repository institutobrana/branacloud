# Fase 2 - Preferencias / Configuracoes comuns - Implementacao minima de `prefAmbienteSecoesAtuais` com contrato explicito `baseSecoes`/`atuais`

## Objetivo

Implementar de forma minima o helper `prefAmbienteSecoesAtuais(baseSecoes, atuais)` como recorte de risco medio controlado, mantendo fallback local equivalente e sem alterar preview, abas ou salvamento.

## Contexto de risco medio controlado

Esta implementacao segue a transicao documental ja aprovada para recortes de risco medio controlado.

O contrato detalhado desta fronteira foi definido antes da implementacao, com foco em separar o merge das secoes de Ambiente da leitura de contexto e da aplicacao visual posterior.

## Contrato implementado

### No modulo passivo

Arquivo:

- `frontend/js/modules/preferencias-opcoes-sistema.js`

Helper adicionado:

- `prefAmbienteSecoesAtuais(baseSecoes, atuais)`

Comportamento:

- recebe `baseSecoes` explicitamente;
- recebe `atuais` explicitamente;
- retorna apenas a estrutura mesclada por secao;
- preserva a estrutura da base;
- sobrepoe valores atuais quando presentes;
- nao le DOM;
- nao le `requestJson`;
- nao monta payload;
- nao salva;
- nao altera preview;
- nao altera abas;
- nao altera dialogo de fonte;
- nao mexe em permissao;
- nao mexe em backend, banco, schema, migrations ou seeds.

### No app

Arquivo:

- `frontend/app.js`

Funcao local atualizada:

- `prefAmbienteSecoesAtuais()`

Comportamento:

- continua lendo a base via `prefValoresPadraoAmbiente().secoes`;
- continua lendo o estado atual via `prefCfg?.ambienteValues?.secoes || {}`;
- chama primeiro `window.BranaPreferenciasOpcoesSistemaModule.prefAmbienteSecoesAtuais(baseSecoes, atuais)` quando disponivel;
- preserva fallback local equivalente;
- nao altera preview;
- nao altera abas;
- nao altera dialogo de fonte;
- nao altera salvamento;
- nao altera `requestJson`;
- nao altera payload;
- nao altera textos visiveis;
- nao altera funcoes de renderizacao.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_preferencias_implementacao_pref_ambiente_secoes_atuais_risco_medio.md`

## Como `baseSecoes`/`atuais` foram explicitados

O app continua responsavel por montar:

- `baseSecoes` a partir de `prefValoresPadraoAmbiente().secoes`
- `atuais` a partir de `prefCfg?.ambienteValues?.secoes || {}`

O modulo passivo recebe os dois objetos explicitamente e devolve apenas o merge.

## Como o fallback foi preservado

Se o helper do modulo nao estiver disponivel, `frontend/app.js` executa o merge local equivalente com a mesma regra anterior:

- percorre as chaves da base;
- mescla `baseSecoes[chave]` com `atuais[chave]`;
- retorna a estrutura resultante.

## O que nao foi alterado

- `frontend/index.html`
- `frontend/js/modules` fora do arquivo passivo ja existente
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- permissões
- `package.json`
- arquivos de configuracao
- salvamento
- `requestJson`
- payload
- senha administrativa
- `tenant/clinica/user_id`
- DOM/renderizacao/selecao visual
- abas
- preview
- dialogo de fonte
- `prefAplicarPreviewAmbiente`
- `prefRebuildAmbientePreview`
- `prefAbrirDialogoFonteAmbiente`
- `prefSelecionarAba`
- `prefRenderListaAmbiente`
- `prefSincronizarUI`
- `prefEnsureUI`
- `prefSalvar*`
- `prefCarregarDados`
- `sysOpt*`

## Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`

## Teste manual recomendado

Validar em `Preferencias / Configuracoes comuns`, aba `Ambiente`:

- abrir a tela;
- alternar seções;
- abrir o dialogo de fonte;
- conferir o preview;
- confirmar que a mescla de seções permanece consistente;
- confirmar que o salvamento nao mudou.

## Riscos remanescentes

- alterar o comportamento de merge das secoes;
- afetar preview da aba Ambiente;
- afetar troca de secao;
- afetar o dialogo de fonte;
- misturar DOM com regra de estado;
- introduzir regressao silenciosa na tela de Preferencias;
- alterar textos visiveis ou mojibake por acidente.

## Pendencias futuras

- avaliar se existe outro recorte medio controlado na frente de Preferencias;
- manter qualquer mojibake legado apenas como pendencia documental futura;
- validar manualmente a tela antes de qualquer novo recorte.

## Registro de blindagem textual/mojibake

Esta etapa seguiu a blindagem textual. Nenhum texto visivel, acento, label, placeholder ou mensagem de interface foi corrigido nesta entrega. Eventuais textos quebrados ou mojibake devem permanecer apenas como pendencia futura.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Validacao pos-teste de prefAmbienteSecoesAtuais`
