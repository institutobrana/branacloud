# Fase 2B - Preferencias remanescentes - Implementacao minima dos combos Geral, Modelos e Dados

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Módulo comum/core: `Preferencias / Configuracoes remanescentes`
- Recorte implementado: combos das abas `Geral`, `Modelos` e `Dados`
- Commit de referencia anterior: `37bafa0c052ddbefa0e70fd6b351abd5ff0ded0a`
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
  - `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
  - `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
  - `docs/fase_2b_escolha_proximo_recorte_medio_controlado.md`
  - `docs/fase_2b_preferencias_segundo_contrato_profundo.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
  - `docs/11_roadmap_desenvolvimento.md`

## Objetivo da etapa

- Esta etapa implementou a menor delegacao minima do segundo recorte medio controlado da Fase 2B.
- O foco foi apenas a montagem/renderizacao visual local dos combos das abas `Geral`, `Modelos` e `Dados do usuario`.
- `prefSincronizarUI()` continua sendo o orquestrador do fluxo visual da modal.
- O preview da aba `Ambiente` permaneceu compativel com o comportamento ja validado anteriormente.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/fase_2b_preferencias_combos_geral_modelos_dados_implementacao_minima.md`
- `docs/11_roadmap_desenvolvimento.md`

## Funcoes tocadas

### No `frontend/app.js`

- `prefRenderCombos()`
- `prefRenderCombosModelos()`
- `prefRenderCombosDados()`
- `prefSincronizarUI()` apenas como orquestrador, sem mudar a sequencia de leitura/escrita

### No modulo passivo

- `prefEscHtml()`
- `prefRenderSelectOptions(select, items, config)`
- `prefRenderUfOptions(select, ufs, currentValue)`

## O que saiu parcialmente do `app.js`

- A montagem visual dos combos da aba `Geral` passou a ser delegada ao modulo passivo.
- A montagem visual dos combos da aba `Modelos` passou a ser delegada ao modulo passivo.
- A montagem visual do select de UF da aba `Dados do usuario` passou a ser delegada ao modulo passivo.

## O que permaneceu no `app.js`

- A orquestracao de `prefSincronizarUI()`.
- A abertura da modal.
- O carregamento dos dados.
- O salvamento.
- O roteamento entre abas.
- O fechamento da modal.
- O dialogo de fonte da aba `Ambiente`.
- O preview da aba `Ambiente` ja validado anteriormente.
- O restante de `sysOpt*`.

## Confirmacoes tecnicas

- `requestJson` nao foi alterado.
- O payload efetivo nao foi alterado.
- O salvamento nao foi alterado.
- Backend nao foi alterado.
- Banco nao foi alterado.
- Endpoints nao foram alterados.
- Permissoes nao foram alteradas.
- `sysOpt*` nao foi alterado.
- `Odontograma` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- A blindagem textual/mojibake foi respeitada.
- Textos visiveis, labels, placeholders e mensagens de interface nao foram corrigidos.

## Riscos

- A principal regiao de risco e manter exatamente a mesma ordem e o mesmo conjunto de options nos combos.
- Um erro de escape poderia afetar labels visuais, embora o fluxo funcional permaneça o mesmo.
- Um erro na delegacao poderia deixar combos vazios ao abrir ou trocar de aba.

## Rollback mental

- Reintroduzir a montagem de `innerHTML` no `app.js` para os tres combos.
- Manter os helpers do modulo passivo como fallback ou removê-los depois, sem mexer em carregamento, salvamento ou payload.
- Revalidar apenas a abertura da modal e a troca entre `Geral`, `Modelos`, `Dados` e `Ambiente`.

## Teste manual obrigatorio

1. Abrir o sistema.
2. Ir em `Configuracao > Preferencias`.
3. Abrir a aba `Geral`.
4. Conferir se os combos/selects da aba `Geral` continuam populados corretamente.
5. Alternar para a aba `Modelos`.
6. Conferir se os combos/selects da aba `Modelos` continuam populados corretamente.
7. Alternar para a aba `Dados do usuario`.
8. Conferir se os combos/selects da aba `Dados do usuario` continuam populados corretamente.
9. Alternar para a aba `Ambiente`.
10. Confirmar que o preview de `Ambiente` continua igual ao teste anterior.
11. Fechar sem salvar.
12. Reabrir Preferencias.
13. Confirmar que modal abre normalmente, modal fecha normalmente, abas alternam normalmente, combos continuam populados, valores selecionados continuam coerentes, preview de `Ambiente` nao quebrou, salvamento nao foi afetado, Opcoes do sistema nao foi afetado, Odontograma nao foi afetado e mensagens/footerMsg nao mudaram.
