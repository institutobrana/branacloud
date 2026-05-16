# Convênios e Planos - Subetapa 5 - Encerramento documental do mini ciclo

## 1. Objetivo do ciclo
O objetivo deste mini ciclo foi iniciar a modularização conservadora do módulo Convênios e Planos sem mover cedo o fluxo sensível para fora de `frontend/app.js`, preservando comportamento, DOM, eventos, endpoints, payloads e integrações existentes.

## 2. Resumo das subetapas concluídas
### Subetapa 0 - Mapeamento monolítico
- Foi produzido o mapa documental do bloco de Convênios e Planos em `frontend/app.js`.
- Foram identificadas a função principal de abertura, as áreas de UI, carregamento, renderização, seleção, modais, salvar, excluir e consumidores externos.

### Subetapa 1 - Namespace passivo
- Foi criado `frontend/js/modules/convenios-planos.js`.
- Foi exposto `window.BranaConveniosPlanosModule`.
- O namespace ficou passivo, com `status: "passivo"`, `ativo: false` e `controlaFluxo: false`.

### Subetapa 2 - Fronteiras e contratos
- Foram documentadas as fronteiras entre `frontend/app.js`, DOM, endpoints, estados/caches e consumidores externos.
- Foi registrado o que permanecia intencionalmente fora do namespace passivo.

### Subetapa 3 - Helpers puros
- Foram criados helpers textuais puros:
  - `normalizarNomeConvenio`
  - `validarNomeConvenio`
  - `normalizarNomePlano`
  - `validarNomePlano`
  - `normalizarCodigoRegistro`

### Correção da exposição dos helpers
- A exposição dos helpers em `window.BranaConveniosPlanosModule.helpers` foi corrigida e validada no navegador.

### Subetapa 4 - Integração mínima com fallback
- Foram criados wrappers locais pequenos em `frontend/app.js`.
- A integração com os helpers ocorreu com fallback local obrigatório.
- `frontend/app.js` continuou como fonte funcional da verdade.

### Correções pontuais pós-teste
- O status das grades foi corrigido para `Ativo` / `Inativo`.
- O cabeçalho/menu solto da janela `Nova data de faturamento` foi corrigido.
- Os textos corrompidos do calendário de faturamento foram corrigidos.
- Foi feita uma auditoria de caminho quando a correção textual anterior não apareceu no navegador.
- O botão global de fechar foi restaurado para `X`.

### Regra de blindagem textual
- Foi criada a regra de blindagem em `docs/regras_blindagem_correcoes_textuais_mojibake.md`.
- Essa regra passou a orientar futuras correções textuais para evitar mudança estrutural ou funcional acidental.

## 3. Arquivos criados/alterados no ciclo
- `frontend/js/modules/convenios-planos.js`
- `frontend/index.html`
- `frontend/app.js`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`
- `docs/convenios_planos_subetapa_3_correcao_exposicao_helpers.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/convenios_planos_correcao_bugs_status_calendario_pos_subetapa_4.md`
- `docs/convenios_planos_correcao_textos_calendario_pos_subetapa_4.md`
- `docs/convenios_planos_auditoria_correcao_textos_nao_aplicada.md`
- `docs/frontend_correcao_botao_fechar_global_pos_mojibake.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 4. Estado atual do namespace
- `window.BranaConveniosPlanosModule` existe.
- O status segue passivo.
- `ativo` permanece `false`.
- `controlaFluxo` permanece `false`.
- Os helpers existem e estão expostos.
- O namespace não controla fluxo.
- O namespace não usa DOM.
- O namespace não usa `requestJson`.
- O namespace não usa eventos.
- O namespace não controla renderização.

## 5. Helpers criados
- `normalizarNomeConvenio`
- `validarNomeConvenio`
- `normalizarNomePlano`
- `validarNomePlano`
- `normalizarCodigoRegistro`

## 6. Integração feita no app.js
Foram criados wrappers locais em `frontend/app.js`:
- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Características da integração:
- foi mínima;
- manteve fallback local;
- não moveu fluxo sensível;
- não transformou o namespace em controlador de fluxo;
- manteve `frontend/app.js` como fonte funcional da verdade.

## 7. Pontos preservados sem extração
Continuaram no `frontend/app.js`:
- `convPlanAbrir()`;
- criação de UI;
- renderização;
- seleção;
- grades;
- clique;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- modais;
- calendário de faturamento;
- `requestJson`;
- endpoints;
- salvar;
- excluir/inativar;
- consumidores externos.

## 8. Correções pontuais realizadas
- Status com texto corrompido corrigido para `Ativo` / `Inativo`.
- Cabeçalho/menu solto da `Nova data de faturamento` corrigido.
- Textos corrompidos do calendário corrigidos.
- Auditoria de caminho feita quando a correção anterior não apareceu no navegador.
- Botão global de fechar restaurado para `X`.
- Regra de blindagem textual criada.

## 9. Riscos preservados para futura rodada
Os seguintes itens continuam como alto risco e devem permanecer protegidos em futuras mudanças:
- eventos;
- duplo clique;
- segundo clique rápido;
- `bindStandardGridActivation`;
- renderização de `tbody`;
- modais;
- calendário de faturamento;
- `requestJson`;
- endpoints;
- payloads;
- consumidores externos;
- funções globais de chrome/painel/modal;
- correções textuais amplas.

## 10. Regra obrigatória para futuras correções textuais
Toda correção textual futura deve seguir obrigatoriamente:
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 11. Testes realizados
Ao longo do ciclo, foram validados:
- `window.BranaConveniosPlanosModule.getStatus()` no console;
- helpers no console;
- abertura de Convênios e Planos;
- clique e duplo clique nas grades;
- criação/edição com normalização textual;
- calendário de faturamento;
- `Nova data de faturamento`;
- status `Ativo` / `Inativo`;
- botão `X` em Convênios e Planos;
- botão `X` em Símbolos Gráficos;
- ausência de erro novo no console.

## 12. Recomendação final
Este mini ciclo deve ser encerrado.
Não há recomendação para extrair mais nada de Convênios e Planos nesta rodada.
Se o módulo voltar a ser trabalhado no futuro, a próxima ação deve ser uma auditoria específica e bem delimitada, ou a recomendação documental de outro módulo mais seguro para continuar a modularização conservadora.

## 13. Onde testar antes de considerar encerrado
Validar no navegador:
- abrir Convênios e Planos;
- conferir o status das grades;
- clicar e duplo clicar nas grades;
- abrir Calendário de faturamento;
- abrir `Nova data de faturamento`;
- confirmar o botão `X`;
- abrir Símbolos Gráficos para confirmar o `X` global;
- conferir o console sem erros novos.

## 14. Pastas legadas
Nada foi salvo em:
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO`
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO`

## 15. Confirmações finais
- Nenhum código foi alterado nesta etapa documental.
- `frontend/app.js` não foi alterado nesta etapa.
- `frontend/index.html` não foi alterado nesta etapa.
- `frontend/js/modules/convenios-planos.js` não foi alterado nesta etapa.
- Backend, banco e endpoints não foram alterados nesta etapa.
- Não houve nova modularização nesta etapa.
- Não houve correção textual nesta etapa.
