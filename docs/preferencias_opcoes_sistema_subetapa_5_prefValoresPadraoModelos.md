# Preferências e Opções do Sistema — Subetapa 5 — prefValoresPadraoModelos

## Objetivo

Registrar a extração mínima e conservadora do helper/default puro `prefValoresPadraoModelos`, mantendo wrapper/fallback em `frontend/app.js` e exposição do helper no módulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.

## Escopo

- Mover apenas `prefValoresPadraoModelos`.
- Preservar `prefOdontoNorm` já delegado na subetapa anterior.
- Manter as chamadas existentes no restante de `frontend/app.js`.
- Não alterar comportamento visível, payload, salvamento, backend, permissões ou fluxo de abertura/fechamento.
- Não tocar em `frontend/index.html`, CSS, banco, schema, migrations ou endpoints.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md`

## Arquivos não alterados

- `frontend/index.html`
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
- strings visíveis
- mojibake

## Base documental usada

- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md`
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md`
- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md`
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md`
- `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Helper/default movido

O único helper/default tratado nesta etapa foi `prefValoresPadraoModelos`.

## Estratégia usada

- A lógica foi copiada de forma literal para o módulo passivo.
- O namespace `window.BranaPreferenciasOpcoesSistemaModule` passou a expor `prefValoresPadraoModelos`.
- A função equivalente permaneceu em `frontend/app.js` como wrapper/fallback conservador.
- As chamadas existentes continuam usando o mesmo nome `prefValoresPadraoModelos`, sem ajuste de contrato.
- `prefOdontoNorm` foi preservado no módulo e no wrapper já existente.

## O que NÃO foi alterado

- DOM
- abertura/fechamento
- payload
- salvamento
- backend/API
- permissões
- `sysOpt*`
- `frontend/index.html`
- CSS
- strings visíveis
- mojibake
- banco/schema/migrations/endpoints
- qualquer outro helper

## Checks executados

- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js` -> ok
- `git status --short` -> exibiu as pendências preexistentes do repositório e os dois arquivos de código alterados nesta etapa, além deste documento ao ser criado
- `git diff --stat` -> mostrou apenas `frontend/app.js` e `frontend/js/modules/preferencias-opcoes-sistema.js`
- `git diff --cached --stat` -> vazio

## Roteiro de teste no navegador

1. Fazer `Ctrl+F5`.
2. Abrir o sistema.
3. Abrir `Preferências`.
4. Ir até a aba ou área de `Modelos`.
5. Conferir se a aba abre sem erro.
6. Conferir os campos e listas de modelos exibidos sem salvar.
7. Alternar para outras abas de `Preferências`.
8. Fechar `Preferências`.
9. Abrir `Opções do sistema`.
10. Confirmar que abre normalmente.
11. Verificar console do navegador.
12. Não executar salvamento real nesta etapa.

## Riscos remanescentes

- O helper é simples e puro, mas ainda depende do carregamento correto do módulo antes de `app.js`.
- A área de Preferências ainda tem blocos maiores e mais acoplados que não foram tocados.
- A blindagem textual / mojibake continua necessária porque o bloco ainda contém textos legados.

## Próxima etapa recomendada

Recomendo uma nova etapa documental curta para reavaliar o próximo helper/default, ou pausar se algum teste de navegação indicar risco. O próximo candidato deve continuar sendo pequeno, puro e sem impacto em DOM, payload ou salvamento.

## Confirmação final

Nesta subetapa, apenas `prefValoresPadraoModelos` foi movido/delegado. `prefOdontoNorm` foi preservado. Não houve alteração em `frontend/index.html`, não houve mudança funcional ampla e não houve intervenção em backend, banco, payload, salvamento, permissões ou textos visíveis.
