# Fase 2 - Preferencias / Configuracoes comuns - Subetapa 6 - Implementacao minima do helper puro prefValoresPadraoOdontograma

## Objetivo

Executar a implementacao minima e controlada do helper puro `prefValoresPadraoOdontograma` no modulo passivo de preferencias, preservando o comportamento atual de `frontend/app.js` por meio de fallback equivalente.

## Arquivos alterados

- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `frontend/app.js`
- `docs/11_roadmap_desenvolvimento.md`

## Helper implementado

O helper `prefValoresPadraoOdontograma` passou a existir tambem em `frontend/js/modules/preferencias-opcoes-sistema.js` e foi exposto em `window.BranaPreferenciasOpcoesSistemaModule`.

O retorno permanece uma estrutura simples de preferencias padrao do odontograma com campos como:

- `especialidade_mais_utilizada`
- `filtro_mais_utilizado`
- `exibir_alerta_anamnese`
- `exibir_icones_alerta`
- `exibir_imagens_easycapture`
- `exibir_coluna_cirurgiao_historico`
- `exibir_historico_ordem_decrescente`
- `exibir_dados_paciente`
- `exibir_dados_tratamento`
- `exibir_observacoes`
- `exibir_documentos`
- `exibir_agenda_dia`
- `cor_a_realizar`
- `cor_realizado`
- `cor_condicao_observada`
- `cor_anomalia`

## Motivo de baixo risco

- e um helper puro;
- nao usa DOM;
- nao usa `requestJson`;
- nao monta payload;
- nao faz salvamento;
- nao depende de `tenant`, `clinica` ou `user_id`;
- nao depende de aba ativa;
- nao altera texto visivel;
- serve como fallback/base de carregamento para o odontograma sem tocar em fluxo sensivel.

## Como o fallback foi preservado

`frontend/app.js` foi mantido com fallback local equivalente. A funcao passou a consultar primeiro `window.BranaPreferenciasOpcoesSistemaModule.prefValoresPadraoOdontograma` quando disponivel e, na ausencia desse helper, continua retornando a mesma estrutura padrao de forma local.

Assim, o comportamento atual do modal de preferencias e do fluxo de odontograma permanece igual.

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

Abrir `Preferencias / Configuracoes comuns` pelo menu, entrar na aba `Odontograma` e confirmar que:

- o modal abre normalmente;
- os campos continuam carregando a estrutura esperada;
- o comportamento visual permanece igual;
- trocar de aba nao gerou regressao;
- o fluxo de abertura continua sem erro.

## Riscos remanescentes

- o modulo passivo ainda e parcial;
- a duplicidade controlada entre `app.js` e o modulo passivo precisa continuar sendo tratada com cuidado nas proximas etapas;
- qualquer ajuste futuro em defaults do odontograma deve manter a paridade entre fallback e exportacao.

## Blindagem textual/mojibake

Nenhum texto visivel foi corrigido nesta etapa.
Se houver mojibake ou texto quebrado em pontos ja existentes, isso deve seguir apenas como pendencia documental futura.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Subetapa 7 - Validacao pos-teste do helper prefValoresPadraoOdontograma`

## Registro para roadmap

- A Subetapa 6 foi concluida com implementacao minima.
- `prefValoresPadraoOdontograma` foi extraido de forma segura para o modulo passivo.
- `frontend/app.js` preservou fallback local equivalente.
- Nenhum backend, banco, endpoints, permissões ou configuracao foi alterado.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.
- O teste manual da aba `Odontograma` foi indicado antes de prosseguir.
