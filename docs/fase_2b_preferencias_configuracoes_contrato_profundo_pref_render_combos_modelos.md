# Fase 2B - Preferências / Configurações - Contrato profundo de prefRenderCombosModelos

## 1. Contexto

- O recorte visual da modal foi validado manualmente.
- O recorte `prefRenderCombos` foi validado manualmente.
- A decisão conservadora anterior foi `Opcao C`.
- O módulo continua tratado como `comum/core`.
- Esta etapa é somente documental.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_profundo_pref_render_combos.md`
- `docs/fase_2b_preferencias_configuracoes_validacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_implementacao_sincronizacao_visual_modal.md`
- `docs/fase_2b_preferencias_configuracoes_contrato_recorte_remanescente.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit anterior conferido: `6bcc443d67b4eef1eef3b3d129823499633e44f0`.
- Status inicial: apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- Arquivos reais do commit anterior: `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_preferencias_configuracoes_decisao_pos_validacao_pref_render_combos.md`.
- A decisao `Opcao C` ja estava registrada no roadmap.

## 4. Mapeamento de prefRenderCombosModelos

- Localizacao: `frontend/app.js`, por volta da linha `2278`.
- Tamanho aproximado: uma linha longa compactando montagem de sete combos de modelos.
- Responsabilidade: renderizar os combos da aba `Modelos` usando `prefCfg.modelosOptions`.
- Dados lidos:
  - `prefCfg.modelosOptions`
  - `modelo_impresso_atestados`
  - `modelo_impresso_receitas`
  - `modelo_impresso_recibos`
  - `modelo_padrao_etiquetas`
  - `modelo_texto_email_agenda`
  - `modelo_padrao_orcamentos`
  - `modelo_texto_whatsapp_agenda`
- Elementos DOM atualizados:
  - `prefCfg.cboModeloAtestado`
  - `prefCfg.cboModeloReceita`
  - `prefCfg.cboModeloRecibo`
  - `prefCfg.cboModeloEtiqueta`
  - `prefCfg.cboModeloEmail`
  - `prefCfg.cboModeloOrcamento`
  - `prefCfg.cboModeloWhatsapp`
- Funcao auxiliar chamada:
  - `window.BranaPreferenciasOpcoesSistemaModule.prefRenderSelectOptions`
- Funcoes que chamam `prefRenderCombosModelos`:
  - `prefSincronizarUI()`
- Relacao com carregamento de dados:
  - indireta, porque `prefCfg.modelosOptions` e preenchido por `prefCarregarDados()` antes da sincronizacao.
- Relacao com payload/salvamento:
  - nao ha relacao direta; a funcao apenas monta visualmente os selects.
- Relacao com `sysOpt*`:
  - nenhuma relacao direta.
- Relacao com permissões, login, usuários, signup, backend, banco ou seeds:
  - nenhuma relacao direta.
- Partes puramente visuais/DOM:
  - selecao de arrays ja carregados;
  - uso de helper passivo para renderizar `<option>`;
  - fallback local com `innerHTML` e `esc`.
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
  - `prefRenderCombosGeraisModal`
- Helpers adicionados nos recortes anteriores:
  - `prefAtualizarTituloModal`
  - `prefSelecionarAbaModal`
  - `prefRenderCombosGeraisModal`
- O modulo e passivo.
- Ele ja pode receber helper visual de combos de modelos sem alterar comportamento, desde que permaneça no plano de renderizacao DOM.
- Risco de acoplamento com `Opcoes do Sistema`:
  - baixo, porque o modulo nao exporta helpers de `sysOpt*` e o uso atual em Preferencias permanece separado.

## 6. Fronteira permitida

- Helper visual puro/DOM para renderizacao dos combos de modelos, se seguro.
- Delegacao pequena e explicita a partir de `prefRenderCombosModelos`.
- Preservacao de `prefRenderCombosModelos` como orquestrador, se isso for mais seguro.
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
  - o trecho e visual/DOM, mas tem mais combinações do que o recorte de combos gerais;
  - a fronteira ainda é clara para os combos de modelos, porém exige uma atenção extra ao fallback e à ordem dos selects;
  - existe helper passivo já existente para renderização de selects, o que reduz o risco de regressão.

## 10. Decisao do contrato

- **Opcao C**.
- `prefRenderCombosModelos` ainda pode ser trabalhada, mas exige um subcontrato ainda menor antes da implementacao.

## 11. Recorte recomendado

- Contrato futuro para a renderização dos combos de modelos da aba `Preferencias`:
  - `modelo_impresso_atestados`
  - `modelo_impresso_receitas`
  - `modelo_impresso_recibos`
  - `modelo_padrao_etiquetas`
  - `modelo_texto_email_agenda`
  - `modelo_padrao_orcamentos`
  - `modelo_texto_whatsapp_agenda`
- O recorte futuro deve manter `prefRenderCombosModelos` como orquestrador e extrair apenas a parte visual/DOM de montagem dos selects para helper(s) passivos, com fallback local em `frontend/app.js`.
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
- Abas ligadas aos modelos.
- Renderizacao visual dos combos de modelos.
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

- A renderizacao dos combos de modelos continuar correta.
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

- Implementacao minima futura do recorte de renderizacao visual dos combos de modelos, somente depois deste contrato profundo.

## 20. Registro para roadmap

- Contrato profundo aberto para `prefRenderCombosModelos` em `Preferencias / Configuracoes`.
- O modulo continua como `comum/core`.
- Nenhuma implementacao foi feita.
- Nenhum codigo foi alterado.
- Decisao do contrato: `Opcao C`.
- Proxima subetapa recomendada: implementacao minima futura do recorte visual dos combos de modelos.
- Blindagem textual/mojibake respeitada.
