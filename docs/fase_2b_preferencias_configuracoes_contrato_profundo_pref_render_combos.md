# Fase 2B - Preferências / Configurações - Contrato profundo de prefRenderCombos

## 1. Contexto

- O recorte visual anterior foi validado manualmente.
- A decisão conservadora anterior foi `Opcao C`.
- O módulo continua tratado como `comum/core`.
- Esta etapa é somente documental.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_visual.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/fase_2b_preferencias_consolidacao_parcial_dois_recortes.md`
- `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
- `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
- `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
- `docs/fase_2b_preferencias_segundo_contrato_profundo.md`
- `docs/fase_2b_preferencias_combos_geral_modelos_dados_implementacao_minima.md`
- `docs/fase_2b_preferencias_combos_geral_modelos_dados_validacao_pos_teste.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit anterior conferido: `81590a4013daca3d9a53905a1f56f4f8d9989a0b`.
- Status inicial: apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- Arquivos reais do commit anterior: `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_visual.md`.
- A decisao `Opcao C` ja estava registrada no roadmap.

## 4. Mapeamento de prefRenderCombos

- Localizacao: `frontend/app.js`, por volta das linhas `2266-2276`.
- Tamanho aproximado: cerca de 11 a 13 linhas de fonte, com trechos longos em linha unica.
- Responsabilidade: renderizar os combos gerais da aba `Preferencias` usando dados ja carregados em `prefCfg.geralOptions`.
- Dados lidos:
  - `prefCfg.geralOptions`
  - `pesquisa_padrao_odontograma`
  - `tabelas_intervencoes`
  - `convenios`
- Elementos DOM atualizados:
  - `prefCfg.cboPesquisa`
  - `prefCfg.cboTabela`
  - `prefCfg.cboConvenio`
- Funcao auxiliar chamada:
  - `window.BranaPreferenciasOpcoesSistemaModule.prefRenderSelectOptions`
- Funcoes que chamam `prefRenderCombos`:
  - `prefSincronizarUI()`
- Relacao com carregamento de dados:
  - indireta, porque os dados de `prefCfg.geralOptions` sao populados por `prefCarregarDados()` antes da sincronizacao da UI.
- Relacao com payload/salvamento:
  - nao ha relacao direta; a funcao apenas monta visualmente os selects.
- Relacao com `sysOpt*`:
  - nenhuma relacao direta.
- Relacao com permissões, login, usuários, signup, backend, banco ou seeds:
  - nenhuma relacao direta.
- Partes puramente visuais/DOM:
  - selecao de arrays ja carregados;
  - montagem do `innerHTML` dos tres selects;
  - uso de fallback local quando o modulo passivo nao estiver disponivel.
- Partes que nao devem ser extraidas sozinhas:
  - qualquer leitura remota;
  - qualquer coleta de payload;
  - qualquer salvamento;
  - qualquer alteracao em `prefCarregarDados`;
  - qualquer alteracao em `sysOpt*`.

## 5. Mapeamento do modulo preferencias-opcoes-sistema

- Estrutura atual:
  - modulo passivo autocontido em IIFE;
  - exposto em `window.BranaPreferenciasOpcoesSistemaModule`;
  - marcado como passivo via metadata.
- Helpers ja exportados:
  - `getMetadata`
  - `prefOdontoNorm`
  - `prefValoresPadraoModelos`
  - `prefValoresPadraoDados`
  - `prefValoresPadraoOdontograma`
  - `prefAmbEstiloPadrao`
  - `prefAmbienteDialogoValor`
  - `prefAmbienteEstiloDeDialogo`
  - `prefAmbienteTextoExemplo`
  - `prefAmbienteSecoesAtuais`
  - `prefAmbienteNormalizeStyleId`
  - `prefAmbienteEnsureOverrides`
  - `prefEscHtml`
  - `prefRenderSelectOptions`
  - `prefRenderUfOptions`
  - `prefAmbienteAplicarEstiloElemento`
  - `prefAmbienteRenderLista`
  - `prefAmbienteAplicarPreview`
  - `prefAmbienteMontarPreview`
  - `prefOdontoFindByLabel`
  - `prefAtualizarTituloModal`
  - `prefSelecionarAbaModal`
- Helpers adicionados no recorte anterior:
  - `prefAtualizarTituloModal`
  - `prefSelecionarAbaModal`
- O modulo e passivo.
- Ele ja pode receber helper visual de combos sem alterar comportamento, desde que permaneça no plano de renderizacao DOM.
- Risco de acoplamento com `Opcoes do Sistema`:
  - baixo, porque o modulo nao exporta helpers de `sysOpt*` e o uso atual em Preferencias permanece separado.

## 6. Fronteira permitida

- Helper visual puro/DOM para renderizacao dos combos gerais, se seguro.
- Delegacao pequena e explicita a partir de `prefRenderCombos`.
- Preservacao de `prefRenderCombos` como orquestrador, se isso for mais seguro.
- Fallback local se o modulo nao estiver disponivel.
- Alteracao apenas em `frontend/app.js` e `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Documento de implementacao futura e roadmap.

## 7. Fronteira proibida

- `prefCarregarDados`
- `prefColetarPayload*`
- `prefSalvar*`
- `requestJson`
- `sysOpt*`
- fluxo de `Odontograma`
- login
- usuarios
- signup
- permissões
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- textos e labels
- estrutura de dados
- chamadas de API
- `ativar_controle_usuarios`

## 8. Itens que exigem contrato proprio

- qualquer mudanca que envolva salvamento;
- qualquer mudanca que envolva payload;
- qualquer mudanca que envolva carregamento remoto;
- qualquer mudanca em `sysOpt*`;
- qualquer mudanca funcional em `Opcoes do Sistema`;
- qualquer correcao textual ou mojibake.

## 9. Avaliacao de risco

- Risco: medio.
- Justificativa:
  - o trecho e visual/DOM, mas depende de estado ja carregado;
  - a fronteira e limpa para os tres combos gerais, porem a proximidade com a orquestracao da modal recomenda nao ampliar o recorte alem disso;
  - existe fallback simples, o que reduz o risco de regressao.

## 10. Decisao do contrato

- **Opcao C**.
- `prefRenderCombos` ainda pode ser trabalhada, mas exige um subcontrato ainda menor antes da implementacao.

## 11. Recorte recomendado

- Contrato futuro para a renderizacao dos tres combos gerais da aba `Preferencias`:
  - `pesquisa_padrao_odontograma`
  - `tabelas_intervencoes`
  - `convenios`
- O recorte futuro deve manter `prefRenderCombos` como orquestrador e extrair apenas a parte visual/DOM de montagem dos selects para helper(s) passivos, com fallback local em `frontend/app.js`.
- O recorte futuro nao deve tocar em `prefCarregarDados`, payload, salvamento, `sysOpt*`, `Odontograma` ou qualquer API.

## 12. Arquivos permitidos para implementacao futura

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`
- `docs/11_roadmap_desenvolvimento.md`
- documento de implementacao em `docs/`

## 13. Arquivos proibidos

- `backend/**`
- `frontend/index.html`
- `frontend/js/modules/**` fora de `preferencias-opcoes-sistema.js`
- banco, schema, migrations, seeds e endpoints
- arquivos de login, signup, usuarios e permissoes
- textos de interface fora do escopo

## 14. Onde testar no sistema quando houver implementacao

- Tela `Preferencias`.
- Abertura da modal.
- Abas ligadas aos combos.
- Renderizacao visual dos combos.
- Alternancia de abas.
- Fechamento e reabertura.
- Reabertura sem salvar.
- `Opcoes do Sistema` apenas como nao-regressao.

## 15. Checks obrigatorios para implementacao futura

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`
- `git diff --stat`
- `git diff` seletivo dos arquivos alterados
- confirmacao de ausencia de alteracoes em backend, banco, permissoes e seeds

## 16. Criterio de sucesso

- A renderizacao dos combos gerais continuar correta.
- A modal continuar abrindo normalmente.
- Nenhum comportamento de carregamento, payload, salvamento ou `sysOpt*` mudar.
- A extracao futura permanecer pequena, reversivel e claramente visual.

## 17. Criterio de parada

- Parar antes de implementar se o recorte tocar carregamento remoto, payload, salvamento, `sysOpt*`, `Odontograma`, login, usuarios, signup, permissões, seeds, backend ou banco.
- Parar antes de commit se o diff ultrapassar o recorte visual combinado.
- Parar se surgir necessidade de correcao textual ampla ou ajuste de labels.

## 18. Confirmacoes de escopo desta etapa

- Nenhum codigo alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- Backend nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## 19. Proxima subetapa recomendada

- Implementacao minima futura do recorte de renderizacao visual dos combos gerais, somente depois deste contrato profundo.

## 20. Registro para roadmap

- Contrato profundo aberto para `prefRenderCombos` em `Preferencias / Configuracoes`.
- O modulo continua como `comum/core`.
- Nenhuma implementacao foi feita.
- Nenhum codigo foi alterado.
- Decisao do contrato: `Opcao C`.
- Proxima subetapa recomendada: implementacao minima futura do recorte visual dos combos gerais.
- Blindagem textual/mojibake respeitada.
