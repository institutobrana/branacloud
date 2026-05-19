# Convênios e Planos — Subetapa 12 — Consolidação documental das validações e wrappers reais

## 1. Objetivo da consolidação
Registrar a fotografia real da camada de wrappers, normalizações e validações de Convênios e Planos, distinguindo claramente o que existe de fato em `frontend/app.js`, o que existe apenas no módulo passivo, e o que não existe ainda como wrapper local.

## 2. Wrappers/fallbacks reais existentes em frontend/app.js
Foram identificados de fato no `app.js`:

- `convPlanNormalizeTextLocal(valor)`
- `convPlanNormalizarCampoTextoLocal(valor, helperName)`
- `convPlanNormalizarNomeConvenioLocal(valor)`
- `convPlanNormalizarNomePlanoLocal(valor)`
- `convPlanNormalizarCodigoRegistroLocal(valor)`

Também existem os consumidores diretos desses wrappers:

- `convPlanConvenioPayloadV2()`
- `convPlanPlanoPayloadV2()`

## 3. Wrappers/fallbacks esperados que não existem em frontend/app.js
Não foram encontrados no `app.js`:

- `convPlanValidarNomeConvenioLocal(valor)`
- `convPlanValidarNomePlanoLocal(valor)`

## 4. Se `convPlanValidarNomeConvenioLocal(valor)` existe ou não
Não existe em `frontend/app.js`.

## 5. Se `convPlanValidarNomePlanoLocal(valor)` existe ou não
Não existe em `frontend/app.js`.

## 6. Onde `validarNomeConvenio()` existe no módulo passivo
No módulo `frontend/js/modules/convenios-planos.js`, como:

```js
function validarNomeConvenio(valor)
```

Ela chama `normalizarNomeConvenio(valor)` e retorna um objeto estruturado com `ok`, `valor` e `motivo`.

## 7. Onde `validarNomePlano()` existe no módulo passivo
No módulo `frontend/js/modules/convenios-planos.js`, como:

```js
function validarNomePlano(valor)
```

Ela chama `normalizarNomePlano(valor)` e retorna um objeto estruturado com `ok`, `valor` e `motivo`.

## 8. Se frontend/app.js chama diretamente `validarNomeConvenio()`
Não. O `app.js` não chama `validarNomeConvenio()` diretamente.

## 9. Se frontend/app.js chama diretamente `validarNomePlano()`
Não. O `app.js` não chama `validarNomePlano()` diretamente.

## 10. Se frontend/app.js usa apenas normalização local nos payloads
Sim. O caminho observado nos payloads usa wrappers locais de normalização de texto e código/registro, não wrappers locais de validação estruturada.

## 11. Como `convPlanConvenioPayloadV2()` trata nome de convênio atualmente
Ele monta o payload com:

- `nome: convPlanNormalizarNomeConvenioLocal(m.nome.value)`

Ou seja, o nome de convênio é normalizado localmente antes de compor o objeto do payload.

## 12. Como `convPlanPlanoPayloadV2()` trata nome de plano atualmente
Ele monta o payload com:

- `nome: convPlanNormalizarNomePlanoLocal(m.nome.value)`

Ou seja, o nome do plano é normalizado localmente antes de compor o objeto do payload.

## 13. Se a validação estruturada do módulo está integrada ao fluxo real ou apenas disponível no namespace
Ela está apenas disponível no namespace passivo do módulo. Não há wrapper local de validação no `app.js` atual que a consuma diretamente.

## 14. Se criar wrappers novos seria alteração funcional nova
Sim. Criar wrappers novos para validação seria alteração funcional nova, porque introduziria novas funções e novo caminho de integração no `app.js`.

## 15. Se criar wrappers novos poderia afetar payload, salvamento ou mensagens
Sim. Um wrapper novo de validação pode influenciar o caminho de aceitação/rejeição antes do payload e, portanto, o salvamento e as mensagens exibidas ao usuário.

## 16. Se criar wrappers novos deve ser tratado em etapa futura separada, caso recomendado
Sim. Se houver interesse futuro, isso deve ser tratado como etapa funcional separada, não como continuação documental desta consolidação.

## 17. Se há duplicação intencional de lógica como fallback
Sim. Há duplicação intencional e conservadora na normalização textual, com fallback local replicando o comportamento base do módulo quando necessário.

## 18. Se os wrappers existentes já consultam o módulo passivo de forma defensiva
Sim. Os wrappers existentes consultam `window.BranaConveniosPlanosModule?.helpers`, verificam se o helper é função, validam o tipo de retorno e caem no fallback local quando algo foge do esperado.

## 19. Se há qualquer necessidade real de alteração funcional neste momento
Não. Com base no estado real encontrado, não há necessidade funcional imediata para alterar `app.js`.

## 20. Risco envolvendo mensagens textuais de validação
Existe risco documental, porque as mensagens de validação permanecem no módulo passivo e não devem ser corrigidas nem “melhoradas” nesta fase.

## 21. Risco envolvendo blindagem textual/mojibake
Existe risco documental, inclusive porque o módulo passivo contém texto visível que já foi identificado como sensível e não deve ser alterado.

## 22. Risco envolvendo payload de convênio
Baixo na situação atual, porque o payload usa somente normalização local e não validação estruturada.

## 23. Risco envolvendo payload de plano
Baixo na situação atual, pelo mesmo motivo: o payload usa somente normalização local.

## 24. Risco envolvendo vínculo convênio/plano
Baixo nesta consolidação documental, porque não houve alteração em seleção, vínculo ou salvamento.

## 25. Risco envolvendo duplo clique
Baixo nesta etapa, porque não houve alteração de eventos, clique ou heurística de interação.

## 26. Risco envolvendo renderização
Baixo nesta etapa, porque não houve alteração de renderização.

## 27. Risco envolvendo modais
Baixo nesta etapa, porque não houve alteração de modais.

## 28. Risco envolvendo backend/API/banco
Baixo nesta etapa, porque não houve alteração em backend, API, banco, schema, migrations ou endpoints.

## 29. Classificação da situação atual
`wrappers existentes suficientes`

## 30. Decisão recomendada
`encerrar mini ciclo de Convênios e Planos`

## 31. Próxima etapa recomendada
Encerrar a trilha de documentação e passar ao próximo módulo recomendado, sem criar wrappers novos para validação nesta fase.

## Observações de segurança
- Não houve alteração funcional.
- Não foram criados wrappers novos.
- Não houve mudança em payloads, salvamento, exclusão, eventos, clique, duplo clique, seleção, renderização, modais, vínculo convênio/plano, pacientes, procedimentos, tabelas, preços, custos, reajustes, financeiro, backend, banco, schema, migrations ou endpoints.
- Qualquer mensagem textual observada deve continuar apenas documentada, sem correção.
