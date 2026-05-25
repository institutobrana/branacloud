# Fase 2 - Preferencias / Configuracoes comuns - Subetapa 4 - Implementacao minima do helper puro prefAmbEstiloPadrao

## Objetivo

Executar a implementacao minima e controlada do helper puro `prefAmbEstiloPadrao` no modulo passivo de preferencias, preservando o comportamento atual de `frontend/app.js` por meio de fallback equivalente.

## Arquivos alterados

- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`

## Helper implementado

O helper `prefAmbEstiloPadrao` passou a existir tambem em `frontend/js/modules/preferencias-opcoes-sistema.js` e foi exposto em `window.BranaPreferenciasOpcoesSistemaModule`.

O retorno permanece um objeto simples de estilo padrao de ambiente com:

- `fonte_nome`
- `fonte_tamanho`
- `fonte_estilo`
- `cor_texto`
- `riscado`
- `sublinhado`
- `script`

## Motivo de baixo risco

- e um helper puro;
- nao usa DOM;
- nao usa `requestJson`;
- nao monta payload;
- nao faz salvamento;
- nao depende de `tenant`, `clinica` ou `user_id`;
- nao depende de aba ativa;
- nao altera texto visivel;
- serve como base de outros helpers de ambiente sem tocar em fluxo sensivel.

## Como o fallback foi preservado

`frontend/app.js` foi mantido com fallback local equivalente. A funcao passou a consultar primeiro `window.BranaPreferenciasOpcoesSistemaModule.prefAmbEstiloPadrao` quando disponivel e, na ausencia desse helper, continua retornando o mesmo objeto padrao de forma local.

Assim, o comportamento atual do modal de preferencias e do fluxo de ambiente permanece igual.

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
- `tenant`/`clinica`/`user_id`
- abas
- preview complexo
- renderizacao sensivel
- qualquer texto visivel ou mojibake

## Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`

## Teste manual recomendado

Abrir `Preferencias / Configuracoes comuns` pelo menu, entrar na aba `Ambiente` e confirmar que:

- o modal abre normalmente;
- a lista/preview de ambiente continua igual;
- o botao de restaurar estilo padrao continua funcionando;
- trocar de aba nao gerou regressao;
- o comportamento visual nao mudou.

## Riscos remanescentes

- o modulo passivo ainda e parcial;
- a duplicidade controlada entre `app.js` e o modulo passivo precisa continuar sendo tratada com cuidado nas proximas etapas;
- qualquer ajuste futuro em estilo de ambiente deve manter a paridade entre fallback e exportacao.

## Blindagem textual/mojibake

Nenhum texto visivel foi corrigido nesta etapa.
Se houver mojibake ou texto quebrado em pontos ja existentes, isso deve seguir apenas como pendencia documental futura.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Subetapa 5 - Implementacao minima do helper puro prefValoresPadraoDados e validacao manual do fluxo de dados`

## Registro para roadmap

- A Subetapa 4 foi concluida com implementacao minima.
- `prefAmbEstiloPadrao` foi extraido de forma segura para o modulo passivo.
- `frontend/app.js` preservou fallback local equivalente.
- Nenhum backend, banco, endpoints, permissões ou configuracao foi alterado.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Ambiente` foi indicado antes de prosseguir.
