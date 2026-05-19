# Convênios e Planos — Subetapa 9 — Integração funcional mínima do wrapper de nome de convênio

## 1. Objetivo da etapa
Registrar a verificação da integração funcional mínima do wrapper `convPlanNormalizarNomeConvenioLocal(valor)` em `frontend/app.js`, preservando o fallback local e sem alterar payload, validação, salvamento, exclusão, eventos, renderização, modais ou vínculo funcional.

## 2. Arquivos analisados
Foram analisados em leitura:

- `frontend/app.js`
- `frontend/js/modules/convenios-planos.js`
- `frontend/index.html`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/convenios_planos_subetapa_0_retomada_estado_atual.md`
- `docs/convenios_planos_subetapa_1_documental_normalize_text.md`
- `docs/convenios_planos_subetapa_3_documental_normalizar_nome_convenio.md`
- `docs/convenios_planos_subetapa_4_documental_validar_nome_convenio.md`
- `docs/convenios_planos_subetapa_7_documental_wrappers_fallbacks_appjs.md`
- `docs/convenios_planos_subetapa_8_integracao_wrapper_codigo_registro.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`

## 3. Arquivos alterados
Nenhum arquivo funcional foi alterado.

O único arquivo criado nesta etapa foi este documento:

- `docs/convenios_planos_subetapa_9_integracao_wrapper_nome_convenio.md`

## 4. Confirmação da blindagem textual/mojibake
A blindagem textual/mojibake foi respeitada. Não houve correção de textos, acentos, labels, mensagens, placeholders, strings visíveis ou mojibake.

## 5. Estrutura real encontrada em `window.BranaConveniosPlanosModule`
A estrutura real encontrada no módulo passivo é:

- `window.BranaConveniosPlanosModule.meta`
- `window.BranaConveniosPlanosModule.helpers`
- `window.BranaConveniosPlanosModule.getInfo()`
- `window.BranaConveniosPlanosModule.getStatus()`

Os helpers expostos em `helpers` incluem:

- `normalizarNomeConvenio`
- `validarNomeConvenio`
- `normalizarNomePlano`
- `validarNomePlano`
- `normalizarCodigoRegistro`

## 6. Caminho real do helper `normalizarNomeConvenio`
O helper está definido em `frontend/js/modules/convenios-planos.js` como:

```js
function normalizarNomeConvenio(valor)
```

Ele delega diretamente para `normalizeText(valor)`.

## 7. Estado anterior do wrapper `convPlanNormalizarNomeConvenioLocal(valor)`
O wrapper já existia em `frontend/app.js` antes desta etapa e já seguia o padrão conservador esperado:

- consulta `window.BranaConveniosPlanosModule?.helpers`;
- verifica se o helper correspondente existe e é função;
- chama o helper do módulo;
- valida se o retorno é string;
- usa fallback local caso haja ausência, erro ou retorno inesperado.

Em outras palavras, a integração funcional mínima já estava presente antes da etapa, sem necessidade de mudança redundante.

## 8. Alteração realizada, se houve
Não houve alteração funcional no wrapper.

Como o wrapper já estava conforme o padrão conservador solicitado, não foi necessário editar `frontend/app.js`.

## 9. Se o fallback local foi mantido
Sim. O fallback local foi mantido como comportamento principal de segurança.

## 10. Se a assinatura foi preservada
Sim. A assinatura permanece:

```js
function convPlanNormalizarNomeConvenioLocal(valor)
```

## 11. Se chamadas existentes foram preservadas
Sim. As chamadas existentes foram preservadas.

## 12. Se payloads foram preservados
Sim. Não houve alteração em payloads.

## 13. Se validações foram preservadas
Sim. Não houve alteração em validações.

## 14. Se salvamento foi preservado
Sim. Não houve alteração em salvamento.

## 15. Se exclusão foi preservada
Sim. Não houve alteração em exclusão.

## 16. Se API/requestJson foi preservado
Sim. Não houve alteração em API/requestJson.

## 17. Se eventos, clique, duplo clique, seleção e renderização foram preservados
Sim. Não houve alteração em eventos, clique, duplo clique, seleção ou renderização.

## 18. Se modais foram preservados
Sim. Não houve alteração em modais.

## 19. Se vínculo convênio/plano foi preservado
Sim. Não houve alteração no vínculo convênio/plano.

## 20. Se pacientes, procedimentos, tabelas, preços, custos, reajustes e financeiro foram preservados
Sim. Não houve alteração em pacientes, procedimentos, tabelas, preços, custos, reajustes ou financeiro.

## 21. Se backend/banco/schema/migrations/endpoints foram preservados
Sim. Não houve alteração em backend, banco, schema, migrations ou endpoints.

## 22. Resultado dos checks
Verificações realizadas:

- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: apenas pendências untracked preexistentes em `docs/` e arquivos auxiliares fora do escopo desta etapa
- `git diff --stat`: sem diffs rastreados antes da documentação
- `git log --oneline -10`: histórico coerente com as subetapas anteriores de Convênios e Planos
- `node --check frontend/app.js`: sem saída de erro, portanto OK
- `node --check frontend/js/modules/convenios-planos.js`: sem saída de erro, portanto OK
- `git diff -- frontend/app.js`: sem diferenças

## 23. Riscos residuais
- O wrapper já está defensivo, mas qualquer mudança futura no contrato de `window.BranaConveniosPlanosModule.helpers.normalizarNomeConvenio` ainda pode afetar a cadeia de normalização.
- O risco principal permanece na camada superior de validação/payload, não no wrapper em si.
- O texto visível dos validadores continua sujeito à blindagem textual/mojibake documental, sem correção nesta etapa.

## 24. Onde testar no sistema
Como não houve alteração funcional, o teste manual serve apenas como conferência visual opcional:

1. Fazer `Ctrl+F5` no navegador.
2. Abrir o sistema.
3. Ir em `Cadastro > Convênios e Planos`.
4. Confirmar que a tela abre normalmente.
5. Selecionar um convênio existente, sem salvar.
6. Abrir a inclusão/alteração de convênio, se existir botão visual para isso.
7. Conferir ou digitar o campo de nome do convênio, sem salvar.
8. Fechar/cancelar o modal.
9. Confirmar que listas continuam aparecendo.
10. Confirmar que clique simples/seleção visual continua funcionando.
11. Verificar o console do navegador.

Não salvar. Não excluir. Não criar convênio real. Não criar plano real. Não vincular plano. Não testar reajuste. Não testar financeiro. Não testar procedimentos. Não testar pacientes. Não testar duplo clique alterando dados.

## 25. Decisão recomendada para próxima etapa
Manter a integração atual documentada e, se houver continuidade futura, avançar apenas em wrappers isolados ainda não tratados, preservando fallback local e sem tocar em payload, validação, salvamento, exclusão, eventos, seleção, renderização, modais ou vínculo convênio/plano.
