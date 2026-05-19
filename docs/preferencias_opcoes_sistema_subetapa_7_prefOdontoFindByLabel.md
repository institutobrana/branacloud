# Preferências e Opções do Sistema — Subetapa 7 — prefOdontoFindByLabel

## Objetivo

Registrar a extração mínima e conservadora do helper puro `prefOdontoFindByLabel`, mantendo wrapper/fallback em `frontend/app.js` e exposição do helper no módulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js`.

## Escopo

- Mover apenas `prefOdontoFindByLabel`.
- Preservar `prefOdontoNorm` e `prefValoresPadraoModelos` já delegados nas subetapas anteriores.
- Manter as chamadas existentes no restante de `frontend/app.js`.
- Não alterar comportamento visível, payload, salvamento, backend, permissões ou fluxo de abertura/fechamento.
- Não tocar em `frontend/index.html`, CSS, banco, schema, migrations ou endpoints.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md`

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
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md`
- `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Helper movido

O único helper tratado nesta etapa foi `prefOdontoFindByLabel`.

## Estratégia usada

- A lógica foi copiada de forma literal para o módulo passivo.
- O namespace `window.BranaPreferenciasOpcoesSistemaModule` passou a expor `prefOdontoFindByLabel`.
- A função equivalente permaneceu em `frontend/app.js` como wrapper/fallback conservador.
- As chamadas existentes continuam usando o mesmo nome `prefOdontoFindByLabel`, sem ajuste de contrato.
- Nenhum comportamento real foi alterado fora da delegação.

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
- `prefOdontoNorm`
- `prefValoresPadraoModelos`

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
4. Ir até a aba/área de `Odontograma`.
5. Conferir se a aba abre sem erro.
6. Conferir listas, dropdowns, cores e labels do odontograma sem salvar.
7. Alternar para outras abas de `Preferências`.
8. Fechar `Preferências`.
9. Abrir `Opções do sistema`.
10. Confirmar que abre normalmente.
11. Verificar console do navegador.
12. Não executar salvamento real nesta etapa.

## Riscos remanescentes

- `prefOdontoFindByLabel` usa labels da paleta, então ainda merece wrapper/fallback e uma verificação visual mínima antes de qualquer ampliação.
- O bloco de Preferências ainda tem funções maiores e mais acopladas que não foram tocadas.
- A blindagem textual / mojibake continua necessária porque o bloco ainda contém textos legados.

## Próxima etapa recomendada

Recomendo uma nova etapa documental curta para reavaliar o próximo helper/default, ou pausar se algum teste de navegação indicar risco. O próximo candidato deve continuar sendo pequeno, puro e sem impacto em DOM, payload ou salvamento.

## Confirmação final

Nesta subetapa, apenas `prefOdontoFindByLabel` foi movido/delegado. `prefOdontoNorm` e `prefValoresPadraoModelos` foram preservados. Não houve alteração em `frontend/index.html`, não houve mudança funcional ampla e não houve intervenção em backend, banco, payload, salvamento, permissões ou textos visíveis.
