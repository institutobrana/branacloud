# Fase 2B - Preferências / Configurações - Contrato do recorte remanescente comum/core

## 1. Contexto

- A exclusão de usuário comum já foi validada manualmente.
- A validação manual da 8W-B foi aprovada pelo usuário.
- A auditoria pós-8W-B escolheu `Preferências / Configurações` como próximo módulo.
- O módulo é tratado nesta etapa como `comum/core`.
- Esta etapa não implementa código.
- Esta etapa não altera `frontend/app.js`, `frontend/index.html` ou qualquer módulo existente.

## 2. Fontes consultadas

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2b_auditoria_escolha_proximo_modulo_pos_8w_b.md`
- `docs/fase_2b_validacao_8w_b_usuarios_novos_aprovada.md`
- `docs/fase_2b_validacao_manual_exclusao_usuario_comum_aprovada.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/fase_2b_preferencias_consolidacao_parcial_dois_recortes.md`
- `docs/fase_2b_preferencias_remanescentes_contrato_profundo.md`
- `docs/fase_2b_preferencias_preview_ambiente_implementacao_minima.md`
- `docs/fase_2b_preferencias_preview_ambiente_validacao_pos_teste.md`
- `docs/fase_2b_preferencias_segundo_contrato_profundo.md`
- `docs/fase_2b_preferencias_combos_geral_modelos_dados_implementacao_minima.md`
- `docs/fase_2b_preferencias_combos_geral_modelos_dados_validacao_pos_teste.md`
- `docs/fase_2b_escolha_proximo_recorte_medio_controlado.md`
- `docs/fase_2b_nova_matriz_comparativa_pos_preferencias.md`
- `docs/fase_2_nova_selecao_recorte_medio_pos_preferencias.md`
- `docs/auditoria_global_modulos_frontend_pos_pausas_usuarios_simbolos_preferencias.md`
- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

## 3. Estado Git

- Branch: `modularizacao-segura-fase-1`.
- Commit anterior conferido: `10cf61123b27491a6f88c634a8d83b9acdbded58`.
- Status inicial: apenas untracked antigos preservados em `docs/` e `storage/modelos/clinicas/15/`.
- Confirmação do commit anterior: contém somente `docs/11_roadmap_desenvolvimento.md` e `docs/fase_2b_auditoria_escolha_proximo_modulo_pos_8w_b.md`.
- Não havia alteração de código antes desta etapa.

## 4. Estado atual de `frontend/app.js`

- O arquivo segue com cerca de `24.252` linhas e `1.778.569` bytes.
- O monólito ainda concentra o fluxo principal de Preferências em:
  - `prefContextoPadrao`
  - `prefResolverContexto`
  - `prefContextoAtual`
  - `prefTituloAtual`
  - `prefValoresPadrao*`
  - `prefAtualizarTitulo`
  - `prefSelecionarAba`
  - `prefRenderCombos*`
  - `prefAmbiente*`
  - `prefOdonto*`
  - `prefSincronizarUI`
  - `prefColetarPayload*`
  - `prefCarregarDados`
  - `prefSalvar*`
  - `prefEnsureUI`
  - `prefAbrir`
  - `sysOpt*`
- O bloco remanescente mais seguro ainda é o da sincronização visual básica da modal, especialmente título e abas, sem tocar persistência.

## 5. Histórico dos recortes anteriores de Preferências

- O preview visual da aba `Ambiente` já foi extraído, implementado e validado.
- Os combos das abas `Geral`, `Modelos` e `Dados` já foram extraídos, implementados e validados.
- O módulo passivo `frontend/js/modules/preferencias-opcoes-sistema.js` já concentra helpers puros e defaults seguros.
- Permanecem no `app.js` o carregamento, o salvamento, o payload, a orquestração geral da modal, a integração com `sysOpt*` e o fluxo de `Odontograma`, todos fora de escopo para este recorte.

## 6. Fronteiras do módulo

### Permitido no próximo recorte

- Sincronização visual básica da modal de Preferências.
- Atualização de título da modal.
- Alternância visual entre abas da modal.
- Delegação de helpers visuais e puros relacionados à navegação da modal.
- Manter `prefSincronizarUI()` como orquestrador, sem alterar persistência.

### Proibido no próximo recorte

- `prefCarregarDados`
- `prefColetarPayload*`
- `prefSalvar*`
- `requestJson`
- `sysOpt*`
- `prefAbrirDialogoFonteAmbiente`
- fluxo de `Odontograma`
- alteração de permissões
- alteração de login, usuários ou signup
- alteração de seeds
- alteração de backend, banco, schema, migrations ou endpoints
- alteração de textos visíveis, labels, placeholders ou mensagens

### Exige contrato próprio

- Qualquer expansão para `sysOpt*`.
- Qualquer alteração de salvamento/payload.
- Qualquer expansão para `Odontograma`.
- Qualquer alteração funcional de permissões, usuários, login ou signup.

### Fora de escopo

- Backend.
- Banco.
- Endpoints.
- Seeds.
- Migrations.
- Login.
- Usuários.
- Signup.
- Permissões.
- Ajustes textuais ou de mojibake.

## 7. Contrato do próximo recorte

- Recorte recomendado: delegar a sincronização visual básica da modal de Preferências para um helper passivo, mantendo `prefSincronizarUI()` como orquestrador.
- Funções candidatas:
  - `prefTituloAtual`
  - `prefAtualizarTitulo`
  - `prefSelecionarAba`
- Objetivo funcional:
  - reduzir o miolo visual direto de `frontend/app.js` sem tocar em carregamento, payload ou salvamento;
  - manter a mesma experiência visual ao abrir Preferências e alternar abas;
  - manter o contrato comum/core estável.
- Critério de segurança:
  - o recorte só é válido se continuar sem tocar `requestJson`, `payload`, `save`, `sysOpt*`, `Odontograma`, login, usuários, signup, seeds ou backend.

## 8. Arquivos permitidos para implementação futura

- `frontend/app.js`
- `frontend/js/modules/preferencias-opcoes-sistema.js`

### Arquivos que não precisam ser criados agora

- Nenhum novo arquivo é obrigatório nesta fase.
- Um novo arquivo em `frontend/js/modules` só seria justificado se a separação do helper visual exigir isolamento adicional.

## 9. Arquivos proibidos

- `backend/**`
- `docs/**` fora do roadmap desta etapa
- `frontend/index.html`
- `frontend/js/modules/**` fora de `preferencias-opcoes-sistema.js` e sem justificativa documental nova
- banco, schema, migrations, seeds e endpoints
- arquivos de login, signup, usuários e permissões
- textos de interface fora do escopo

## 10. Riscos

- Risco de mexer acidentalmente em fluxo visual e contaminar o resto da modal.
- Risco de alterar a troca de abas e quebrar a percepção do usuário.
- Risco de criar dependência nova desnecessária se a delegação for maior do que o combinado.
- Mitigação:
  - manter a alteração apenas no bloco visual;
  - preservar carregamento, salvamento e payload;
  - testar a modal inteira antes de aprovar o recorte.

## 11. Onde testar futuramente

- Tela `Preferências`.
- Tela `Opções do Sistema` apenas como verificação de não-regressão, sem alterá-la.
- Abertura e fechamento da modal de Preferências.
- Alternância entre abas.
- Atualização do título da modal.
- Carregamento visual ao abrir o fluxo.
- Fechamento sem salvar e reabertura.

## 12. Checks obrigatórios para implementação futura

- `node --check frontend/app.js`
- `node --check` nos módulos JS alterados
- `git diff --stat`
- conferência manual do recorte
- confirmação da ausência de alteração em backend, banco, permissões e seeds

## 13. Critério de sucesso

- A modal de Preferências continuar abrindo normalmente.
- O título e a alternância de abas continuarem corretos.
- Nenhum comportamento de carregamento ou salvamento mudar.
- Nenhuma dependência nova tocar `sysOpt*`, `Odontograma`, login, usuários, signup, seeds ou backend.
- O monólito `frontend/app.js` reduzir um bloco visual real, ainda que pequeno.

## 14. Critério de parada

- Parar imediatamente se houver qualquer aproximação com `requestJson`, payload, salvamento, `sysOpt*`, `Odontograma`, login, usuários, permissões, signup, seeds, backend ou banco.
- Parar se a alteração exigir correção textual ampla ou ajuste de textos visíveis.
- Parar se o helper visual deixar de ser pequeno e reversível.

## 15. Confirmações de escopo desta etapa

- Nenhum código alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- Banco/schema/migrations/seeds/endpoints não alterados.
- Permissões não alteradas.
- Seeds não alteradas.
- Blindagem textual/mojibake respeitada.

## 16. Próxima subetapa recomendada

- Implementação mínima da sincronização visual básica da modal de Preferências, somente se a execução futura mantiver o recorte estritamente dentro das fronteiras acima.

## 17. Commit seletivo obrigatório

- A próxima implementação futura também deverá usar commit seletivo.
- Não usar `git add .` ou `git add -A`.
- Confirmar antes do commit que apenas os arquivos previstos entraram na stage.

## 18. Registro para roadmap

- Contrato documental aberto para `Preferências / Configurações`.
- Módulo classificado como `comum/core`.
- Recorte remanescente recomendado: sincronização visual básica da modal, com título e alternância de abas.
- Nenhuma implementação foi feita.
- Nenhum código foi alterado.
- Documento criado para orientar a próxima etapa.
- Blindagem textual/mojibake respeitada.
