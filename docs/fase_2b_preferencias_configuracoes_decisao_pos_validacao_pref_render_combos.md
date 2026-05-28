# Fase 2B - Preferências / Configurações - Decisão conservadora pós-validação de prefRenderCombos

## 1. Contexto

- O recorte visual da modal foi validado.
- O recorte `prefRenderCombos` foi validado.
- O usuário informou que tudo passou.
- Esta etapa não implementa código.
- O objetivo é decidir o próximo caminho.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_profundo_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_visual.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`
- `docs/fase_2b_auditoria_escolha_proximo_modulo_pos_8w_b.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit anterior conferido: `88ee4bcaa63998468f04dc66eb700b6d3e0fd5bc`.
- Status inicial: apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- Arquivos do commit anterior: `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos.md`.
- A validacao de `prefRenderCombos` ja estava registrada no roadmap.

## 4. Estado consolidado de Preferencias / Configuracoes

- O modulo continua classificado como `comum/core`.
- A sincronizacao visual basica da modal foi validada manualmente.
- A renderizacao visual dos combos gerais foi validada manualmente.
- `prefAtualizarTituloModal` e `prefSelecionarAbaModal` estao delegados ao modulo passivo.
- `prefRenderCombosGeraisModal` estara delegada ao modulo passivo.
- `prefSincronizarUI()` permanece como orquestrador em `frontend/app.js`.
- `prefTituloAtual()` permanece em `frontend/app.js`.
- O carregamento, o payload, o salvamento, `sysOpt*`, permissões, backend, banco e seeds seguem fora de alteracao.

## 5. Estado remanescente

- `frontend/app.js` ainda concentra o restante do fluxo de Preferencias em:
  - `prefRenderCombosModelos`
  - `prefRenderCombosDados`
  - `prefRenderCombosAmbiente`
  - `prefRenderCombosOdontograma`
  - `prefAmbiente*`
  - `prefOdonto*`
  - `prefColetarPayload*`
  - `prefCarregarDados`
  - `prefSalvar*`
  - `prefEnsureUI`
  - `prefAbrir`
  - `sysOpt*`
- O restante mais sensivel continua encostado em carregamento, persistencia, ambiente, odontograma e Opcoes do Sistema.

## 6. Comparacao dos caminhos A, B e C

### Caminho A

- Beneficio: continua reduzindo o monolito com mais uma extracao pequena.
- Risco: medio, porque o trecho restante ja deixou de ser o bloco mais simples e agora encosta em outros conjuntos visuais.
- Impacto esperado em `frontend/app.js`: reducao incremental.
- Clareza de teste manual: media.
- Risco de regressao: medio.
- Dependencia de backend/banco/permissoes: ainda baixa no trecho visual, mas nao nula no contexto geral.
- Necessidade de contrato profundo: sim, antes de mexer no proximo helper.

### Caminho B

- Beneficio: volta para comparacao ampla e reduz o risco de seguir acumulando recortes sem nova pausa.
- Risco: baixo.
- Impacto esperado em `frontend/app.js`: nenhum imediato.
- Clareza de teste manual: alta para a futura escolha.
- Risco de regressao: minimo nesta etapa.
- Dependencia de backend/banco/permissoes: permanece apenas como criterio comparativo.
- Necessidade de contrato profundo: nao agora, porque a trilha volta para matriz.

### Caminho C

- Beneficio: permite continuar em Preferencias sem improviso, mas com fronteira documental mais forte.
- Risco: baixo-medio.
- Impacto esperado em `frontend/app.js`: possivel, porem apenas depois do contrato exato.
- Clareza de teste manual: alta quando o contrato estiver escrito.
- Risco de regressao: baixo, se o contrato delimitar DOM-only e sem persistencia.
- Dependencia de backend/banco/permissoes: deve ser explicitamente excluida.
- Necessidade de contrato profundo: sim, obrigatoria.

## 7. Decisao conservadora

- **Opcao C**.
- `Preferencias / Configuracoes` continua sendo boa candidata, mas o proximo trecho exige contrato profundo antes de qualquer implementacao.

## 8. Proxima subetapa recomendada

- Abrir contrato profundo para `prefRenderCombosModelos`, mantendo a fronteira em renderizacao visual/DOM dos combos de modelos e sem tocar carregamento, payload, salvamento, `sysOpt*`, `Odontograma`, permissões, login, usuarios, signup, seeds, backend ou banco.

## 9. Onde testar no sistema quando houver implementacao futura

- Tela `Preferencias`.
- Abertura da modal.
- Abas ligadas aos combos.
- Renderizacao visual dos combos.
- Alternancia de abas.
- Fechamento e reabertura.
- Reabertura sem salvar.
- `Opcoes do Sistema` apenas como nao-regressao.

## 10. Confirmacoes de escopo

- Nenhum codigo alterado nesta etapa.
- `frontend/app.js` nao alterado nesta etapa.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado nesta etapa.
- Backend nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## 11. Registro para roadmap

- Decisao conservadora pos-validacao de `prefRenderCombos` registrada.
- Os recortes anteriores de `Preferencias` permanecem validados.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Caminho escolhido: `Opcao C`.
- Proxima subetapa recomendada: contrato profundo para `prefRenderCombosModelos`.
- Blindagem textual/mojibake respeitada.
