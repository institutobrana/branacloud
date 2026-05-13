# Plano de Contas - Diagnóstico final do `400` no teste manual

## 1. Branch atual
`modularizacao-segura-fase-1`

## 2. git status --short antes
```text
 M frontend/app.js
 M frontend/index.html
?? docs/plano_contas_subetapa_0_mapeamento_monolitico.md
?? docs/plano_contas_subetapa_1_estrutura_modular_passiva.md
?? docs/plano_contas_subetapa_2_fronteiras_contratos.md
?? docs/plano_contas_subetapa_3_helpers_puros.md
?? docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md
?? docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md
?? frontend/js/modules/plano-contas.js
```

## 3. Contexto do teste manual
- O teste foi feito no navegador após a integração opcional dos helpers puros no ciclo de Plano de Contas.
- O objetivo do teste era confirmar que `Novo/Alterar` continuavam estáveis e que a exclusão/migração respeitava as regras do backend.
- Durante a navegação, apareceu no console a mensagem genérica:
  - `Failed to load resource: the server responded with a status of 400 (Bad Request)`

## 4. Sequência observada no Network
Sequência aproximada observada:

1. `tipos` - 200
2. `auxiliares?tipo=Bairro` - 200
3. `auxiliares?tipo=Tipos de cobrança` - 200
4. `auxiliares?tipo=Tipos de apresentação` - 200
5. `me` - 200
6. `auxiliares?tipo=Situação do agendamento` - 200
7. `grupos` - 200
8. `grupos` - 200
9. `grupos` - 200
10. `me` - 200
11. `categorias` - 200
12. `grupos` - 200
13. `174` - 400
14. `em-uso` - 200
15. `1146` - 200
16. `grupos` - 200
17. `174` - 200
18. `grupos` - 200

## 5. Interpretação provável do `400`
- O `400` é compatível com uma regra de negócio de exclusão/proteção do Plano de Contas.
- O trecho relevante de `frontend/app.js` mostra que a exclusão de grupo e categoria continua sendo controlada no monolito:
  - `planoExcluirGrupo()` faz `DELETE /cadastros/grupos/${g.id}`
  - `planoExcluirCategoria()` faz `GET /cadastros/categorias/${c.id}/em-uso` e depois `DELETE` ou `POST /migrar-e-excluir`, conforme a regra de uso
- Portanto, o `400` observado tende a representar rejeição do backend para uma operação de exclusão que não passou pela regra esperada.

## 6. Confirmação de que os endpoints de salvar grupo/categoria não parecem ter falhado
- Não há evidência de falha nos endpoints de salvar:
  - `POST /cadastros/grupos`
  - `PUT /cadastros/grupos/{id}`
  - `POST /cadastros/categorias`
  - `PUT /cadastros/categorias/{id}`
- Os helpers integrados na Subetapa 4 só participam dos dialogs de salvar/alterar.
- O evento de `400` apareceu na parte do fluxo de exclusão/regra de uso, não na etapa de montagem de payload dos dialogs.

## 7. Confirmação de que o `400` apareceu no fluxo de exclusão/regra de uso, não na integração dos helpers
- Confirmado.
- A integração dos helpers afeta apenas:
  - validação de nome do grupo
  - validação de nome da categoria
  - montagem dos payloads de salvar
- O `400` observado se encaixa melhor em:
  - `DELETE /cadastros/grupos/{id}`
  - `DELETE /cadastros/categorias/{id}`
  - ou em uma etapa de migração/exclusão controlada por regra de uso
- Isso está fora do escopo dos helpers integrados.

## 8. Confirmação de que não houve alteração funcional
- Confirmado.
- Não houve nova alteração em `frontend/app.js`, `frontend/index.html` ou `frontend/js/modules/plano-contas.js` por causa deste diagnóstico.
- Este relatório apenas documenta a interpretação do `400`.

## 9. Resultado dos checks
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/plano-contas.js`: OK

## 10. Conclusão sobre o ciclo
- O ciclo continua apto para commit.
- O `400` observado é compatível com a regra de exclusão/proteção do backend e não indica, por si só, regressão da integração dos helpers.
- Não foi encontrado indício de quebra nos fluxos de salvar grupo/categoria.

## 11. Onde testar novamente, se necessário
1. Fazer `Ctrl+F5`.
2. Abrir `Cadastros > Plano de contas...`.
3. Repetir apenas os fluxos de exclusão para confirmar a regra:
   - excluir grupo
   - excluir categoria não utilizada
   - excluir categoria em uso com migração
4. Repetir `Novo grupo` e `Nova categoria` apenas se houver suspeita adicional de payload.
5. Conferir o console para ver se o erro reaparece apenas na operação de exclusão protegida.

## Observação final
- A leitura atual aponta para um `400` esperado de regra de negócio em exclusão/proteção, não para um problema nos helpers do ciclo de Plano de Contas.
