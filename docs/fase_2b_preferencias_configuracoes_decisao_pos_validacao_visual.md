# Fase 2B - Preferencias / Configuracoes - Decisao conservadora pos-validacao visual

## 1. Contexto

- O contrato, a implementacao e a validacao do recorte visual foram concluidos.
- O usuario informou que tudo passou.
- Esta etapa nao implementa codigo.
- O objetivo e decidir o proximo caminho com base em documentacao, estado do codigo e risco.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`
- `docs/fase_2b_auditoria_escolha_proximo_modulo_pos_8w_b.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- Documentos anteriores de `Preferencias / Configuracoes` sobre consolidacao, preview Ambiente, combos Gerais/Modelos/Dados e segundo contrato profundo.
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit anterior conferido: `61ba8074def2fb1fcadb91456c478824f8f7ebbc`.
- Status inicial: apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- Arquivos do commit anterior: `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`.
- A validacao visual aprovada ja estava registrada no roadmap.

## 4. Estado consolidado de Preferencias / Configuracoes

- O modulo continua classificado como `comum/core`.
- O recorte visual basico da modal de Preferencias foi implementado e validado manualmente.
- Os helpers `prefAtualizarTituloModal` e `prefSelecionarAbaModal` ja estao delegados ao modulo passivo existente.
- `prefSincronizarUI()` permanece como orquestrador em `frontend/app.js`.
- `prefTituloAtual()` permanece em `frontend/app.js`.
- O carregamento, o payload, o salvamento, `sysOpt*`, permissões, backend, banco e seeds seguem fora de alteracao.

## 5. Estado remanescente

- `frontend/app.js` ainda concentra o restante do fluxo de Preferencias em:
  - `prefRenderCombos`
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

- Beneficio: continua reduzindo o monolito dentro de uma frente ja consolidada e validada.
- Risco: medio, porque o restante mais obvio ja passou e o proximo recorte pode encostar em combinacao de DOM, dados e persistencia.
- Impacto esperado em `frontend/app.js`: reducao incremental, mas com fronteira menos limpa do que no recorte anterior.
- Clareza de teste manual: media.
- Risco de regressao: medio.
- Dependencia de backend/banco/permissoes: possivel em partes do restante.
- Necessidade de contrato profundo: sim.

### Caminho B

- Beneficio: volta para comparacao ampla e evita avancar em area ja parcialmente complexa.
- Risco: baixo.
- Impacto esperado em `frontend/app.js`: nenhum imediato.
- Clareza de teste manual: alta para a futura escolha.
- Risco de regressao: minimo nesta etapa.
- Dependencia de backend/banco/permissoes: continua apenas como criterio comparativo.
- Necessidade de contrato profundo: nao agora, porque a trilha volta para matriz.

### Caminho C

- Beneficio: permite continuar em Preferencias sem improviso, mas com fronteira documental mais forte.
- Risco: baixo-medio.
- Impacto esperado em `frontend/app.js`: possivel, porem apenas depois do contrato exato.
- Clareza de teste manual: alta quando o contrato estiver escrito.
- Risco de regressao: baixo, desde que o contrato delimite DOM-only e sem persistencia.
- Dependencia de backend/banco/permissoes: deve ser explicitamente excluida.
- Necessidade de contrato profundo: sim, obrigatoria.

## 7. Decisao conservadora

- **Opcao C**.
- `Preferencias / Configuracoes` continua sendo uma boa candidata, mas o proximo trecho exige contrato profundo antes de qualquer implementacao.

## 8. Proxima subetapa recomendada

- Abrir contrato profundo para um proximo recorte visual/DOM de `Preferencias / Configuracoes`, com fronteira explicita em `prefRenderCombos` e helpers visuais associados, sem tocar carregamento, payload, salvamento, `sysOpt*`, `Odontograma`, permissões, login, usuarios, signup, seeds, backend ou banco.

## 9. Onde testar no sistema quando houver implementacao futura

- Tela `Preferencias`.
- Abas de preferencias ligadas ao recorte contratado.
- Abertura e fechamento da modal.
- Atualizacao visual do componente contratado.
- Reabertura sem salvar.
- `Opcoes do Sistema` apenas como verificacao de nao-regressao, se continuar fora do recorte.

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

- Decisao conservadora pos-validacao visual registrada.
- O recorte visual anterior permanece validado.
- Nenhuma alteracao de codigo foi feita nesta etapa.
- Caminho escolhido: Opcao C.
- Proxima subetapa recomendada: contrato profundo para novo recorte visual/DOM em `Preferencias / Configuracoes`.
- Blindagem textual/mojibake respeitada.
