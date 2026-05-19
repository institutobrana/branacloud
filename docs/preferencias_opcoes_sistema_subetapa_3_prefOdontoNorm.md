# Preferências e Opções do Sistema — Subetapa 3 — prefOdontoNorm

## Objetivo

Registrar a extração mínima e conservadora do helper puro `prefOdontoNorm`, mantendo wrapper/fallback em `frontend/app.js` e exposição do helper no módulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.

## Escopo

- Mover apenas `prefOdontoNorm`.
- Preservar chamadas existentes no restante de `frontend/app.js`.
- Não alterar comportamento visível, payload, salvamento, backend, permissões ou fluxo de abertura/fechamento.
- Não tocar em `frontend/index.html`, CSS, banco, schema, migrations ou endpoints.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md`

## Arquivos não alterados

- `frontend/index.html`
- `frontend/js/modules/*` além do módulo de Preferências e Opções do Sistema
- backend
- banco
- schema
- migrations
- endpoints
- payload
- salvamento
- permissões
- DOM estrutural
- `sysOpt*`
- textos visíveis
- mojibake

## Base documental usada

- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`
- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Helper movido

O único helper tratado nesta etapa foi `prefOdontoNorm`.

## Estratégia usada

- A lógica foi copiada de forma literal para o módulo passivo.
- O namespace `window.BranaPreferenciasOpcoesSistemaModule` passou a expor `prefOdontoNorm`.
- A função equivalente permaneceu em `frontend/app.js` como wrapper/fallback conservador.
- As chamadas já existentes continuam usando o mesmo nome `prefOdontoNorm`, sem ajuste de contratos.

## O que NÃO foi alterado

- payload
- salvamento
- backend/API
- permissões
- DOM
- `sysOpt*`
- abertura/fechamento
- `frontend/index.html`
- CSS
- strings visíveis
- mojibake
- banco/schema/migrations/endpoints
- `prefOdontoFindByLabel`
- qualquer outro helper

## Checks executados

- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js` -> ok
- `git status --short` -> exibiu apenas as pendências preexistentes do repositório e os dois arquivos de código alterados nesta etapa, além deste documento ao ser criado
- `git diff --stat` -> mostrou apenas `frontend/app.js` e `frontend/js/modules/preferencias-opcoes-sistema.js`
- `git diff --cached --stat` -> vazio

## Roteiro de teste no navegador

1. Fazer `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir `Preferências`.
4. Ir até a aba ou área de `Odontograma`, se existir no fluxo.
5. Verificar se a tela abre sem erro.
6. Verificar listas, dropdowns e cores relacionados ao odontograma, sem salvar.
7. Alternar abas de `Preferências`.
8. Fechar `Preferências`.
9. Abrir `Opções do sistema` para garantir que o carregamento geral continua íntegro.
10. Verificar o console do navegador.
11. Não executar salvamento real nesta etapa.

## Riscos remanescentes

- O helper foi extraído com wrapper, mas ainda existe dependência de carregamento correto do módulo antes do `app.js`.
- A área de Preferências ainda tem blocos maiores e mais acoplados que não foram tocados.
- A blindagem textual / mojibake continua necessária porque o bloco ainda contém textos legados.

## Próxima etapa recomendada

Se os testes de navegação e console passarem, a próxima etapa pode ser documental ou funcional mínima, mas sempre em helper puro isolado. Os próximos candidatos mais naturais continuam sendo defaults literais ou helpers puros do mesmo bloco, sem encostar em DOM, payload ou salvamento.

## Confirmação final

Nesta subetapa, apenas `prefOdontoNorm` foi movido/delegado. Não houve alteração em `frontend/index.html`, não houve mudança funcional ampla e não houve intervenção em backend, banco, payload, salvamento ou permissões.
