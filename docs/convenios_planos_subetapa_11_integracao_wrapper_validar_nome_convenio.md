# Convênios e Planos — Subetapa 11 — Integração funcional mínima do wrapper de validação de nome de convênio

## 1. Objetivo da etapa
Registrar a verificação da integração funcional mínima relacionada à validação de nome de convênio, sem alterar mensagens textuais, formato de retorno, payload, salvamento, exclusão, eventos, renderização, modais ou vínculo funcional.

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
- `docs/convenios_planos_subetapa_9_integracao_wrapper_nome_convenio.md`
- `docs/convenios_planos_subetapa_10_integracao_wrapper_nome_plano.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/frontend_correcao_convenios_duplo_clique.md`

## 3. Arquivos alterados
Nenhum arquivo funcional foi alterado.

O único arquivo criado nesta etapa foi este documento:

- `docs/convenios_planos_subetapa_11_integracao_wrapper_validar_nome_convenio.md`

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

## 6. Caminho real do helper `validarNomeConvenio`
O helper está definido em `frontend/js/modules/convenios-planos.js` como:

```js
function validarNomeConvenio(valor)
```

Ele chama `normalizarNomeConvenio(valor)` e retorna um objeto estruturado com `ok`, `valor` e `motivo`.

## 7. Estado anterior do wrapper `convPlanValidarNomeConvenioLocal(valor)`
Não foi encontrado, em `frontend/app.js`, um wrapper chamado `convPlanValidarNomeConvenioLocal(valor)`.

O trecho analisado do `app.js` contém wrappers de normalização:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Mas não contém um wrapper local de validação de nome de convênio.

## 8. Alteração realizada, se houve
Não houve alteração funcional, porque o wrapper solicitado não existe no `app.js` atual.

Não foi criado wrapper novo, para não ultrapassar o escopo de “alterar somente o corpo do wrapper” e não introduzir comportamento novo fora de uma base já existente.

## 9. Se o fallback local foi mantido
Não aplicável, porque não existe o wrapper local solicitado para editar.

## 10. Se a assinatura foi preservada
Não aplicável, porque não existe a assinatura `convPlanValidarNomeConvenioLocal(valor)` no `app.js` atual.

## 11. Se o formato do objeto retornado foi preservado
Não aplicável no `app.js`, porque não há wrapper local de validação para preservar.

## 12. Se mensagens textuais foram preservadas literalmente
Sim, no módulo passivo a mensagem de validação permanece exatamente como está:

- `Informe o nome do convênio.`

Não houve qualquer correção textual.

## 13. Se chamadas existentes foram preservadas
Sim. Não houve mudança em chamadas existentes, porque não foi alterado código funcional.

## 14. Se payloads foram preservados
Sim. Não houve alteração em payloads.

## 15. Se normalizações foram preservadas
Sim. Não houve alteração em normalizações.

## 16. Se salvamento foi preservado
Sim. Não houve alteração em salvamento.

## 17. Se exclusão foi preservada
Sim. Não houve alteração em exclusão.

## 18. Se API/requestJson foi preservado
Sim. Não houve alteração em API/requestJson.

## 19. Se eventos, clique, duplo clique, seleção e renderização foram preservados
Sim. Não houve alteração em eventos, clique, duplo clique, seleção ou renderização.

## 20. Se modais foram preservados
Sim. Não houve alteração em modais.

## 21. Se vínculo convênio/plano foi preservado
Sim. Não houve alteração no vínculo convênio/plano.

## 22. Se pacientes, procedimentos, tabelas, preços, custos, reajustes e financeiro foram preservados
Sim. Não houve alteração em pacientes, procedimentos, tabelas, preços, custos, reajustes ou financeiro.

## 23. Se backend/banco/schema/migrations/endpoints foram preservados
Sim. Não houve alteração em backend, banco, schema, migrations ou endpoints.

## 24. Resultado dos checks
Verificações realizadas:

- `git branch --show-current`: `modularizacao-segura-fase-1`
- `git status --short`: apenas pendências untracked preexistentes em `docs/` e arquivos auxiliares fora do escopo desta etapa
- `git diff --stat`: sem diffs rastreados antes da documentação
- `git log --oneline -10`: histórico coerente com as subetapas anteriores de Convênios e Planos
- `node --check frontend/app.js`: sem saída de erro, portanto OK
- `node --check frontend/js/modules/convenios-planos.js`: sem saída de erro, portanto OK
- `git diff -- frontend/app.js`: sem diferenças

## 25. Riscos residuais
- O principal risco aqui é de contrato/documentação: o wrapper solicitado não existe hoje no `app.js`, então qualquer integração funcional exigiria criar uma função nova, o que não foi autorizado por esta subetapa.
- A validação de convênio continua existindo apenas no módulo passivo, com retorno estruturado e mensagem textual que não deve ser alterada.
- O texto visível dos validadores continua sujeito à blindagem textual/mojibake documental, sem correção nesta etapa.

## 26. Onde testar no sistema
Como não houve alteração funcional, não há teste funcional obrigatório nesta etapa.

O roteiro abaixo pode ser usado apenas como conferência visual opcional:

1. Fazer `Ctrl+F5` no navegador.
2. Abrir o sistema.
3. Ir em `Cadastro > Convênios e Planos`.
4. Confirmar que a tela abre normalmente.
5. Abrir a inclusão/alteração de convênio, se existir botão visual para isso.
6. Deixar o campo nome do convênio vazio.
7. Tentar acionar a validação sem salvar dados reais, se o sistema permitir.
8. Conferir se a mensagem de validação continua exatamente igual à anterior.
9. Digitar um nome de convênio apenas para teste visual.
10. Não confirmar salvamento.
11. Fechar/cancelar o modal.
12. Confirmar que listas continuam aparecendo.
13. Confirmar que clique simples/seleção visual continua funcionando.
14. Verificar o console do navegador.

Não salvar. Não excluir. Não criar convênio real. Não criar plano real. Não vincular plano. Não testar reajuste. Não testar financeiro. Não testar procedimentos. Não testar pacientes. Não testar duplo clique alterando dados.

## 27. Decisão recomendada para próxima etapa
Manter apenas documentado. Se for desejada integração funcional futura, ela precisará primeiro criar um wrapper novo para validação, o que é uma mudança de escopo distinta desta subetapa.
