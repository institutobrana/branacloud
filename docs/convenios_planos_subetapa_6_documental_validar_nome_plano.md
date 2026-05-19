# Convênios e Planos — Subetapa 6 — Análise documental do helper validarNomePlano

## 1. Objetivo da análise documental
Registrar o estado atual de `validarNomePlano()` no módulo de Convênios e Planos, com foco exclusivo em leitura, isolamento de responsabilidades e avaliação de risco antes de qualquer delegação futura.

## 2. Onde validarNomePlano() está definido
A função está definida em `frontend/js/modules/convenios-planos.js`, dentro da cadeia de helpers textuais do módulo.

## 3. Qual é a assinatura atual da função
A assinatura atual é:

```js
function validarNomePlano(valor)
```

## 4. Qual é a lógica atual da função
A função recebe um valor, chama `normalizarNomePlano(valor)` para obter uma versão limpa do texto e então verifica se o resultado ficou vazio.

Se o nome normalizado estiver vazio, ela retorna um objeto de validação com `ok: false`, `valor: ""` e uma mensagem de orientação para informar o nome do plano.

Se houver conteúdo válido, ela retorna um objeto com `ok: true`, o valor normalizado e mensagem vazia.

## 5. Se validarNomePlano() depende diretamente de normalizarNomePlano()
Sim. A dependência é direta e explícita.

## 6. Se validarNomePlano() depende indiretamente de normalizeText()
Sim. Como `normalizarNomePlano()` chama `normalizeText()`, a validação depende indiretamente desse helper base.

## 7. Quais entradas ela espera receber
Ela espera receber um valor textual de nome de plano, mas aceita qualquer tipo de entrada porque a normalização anterior converte o dado para string de forma defensiva.

## 8. Quais saídas ela retorna
Ela retorna um objeto estruturado de validação.

## 9. Se a saída é estruturada, documentar o formato sem alterar nada
O formato observado é, em linhas gerais:

```js
{ ok: boolean, valor: string, motivo: string }
```

Quando inválido, `ok` é `false`, `valor` vira string vazia e `motivo` carrega a mensagem de validação.
Quando válido, `ok` é `true`, `valor` contém o nome normalizado e `motivo` fica vazio.

## 10. Como trata valores nulos, vazios, indefinidos, numéricos ou não-string
Valores `null`, `undefined`, vazios, numéricos ou não-string passam primeiro pela normalização indireta e acabam convertidos em string. Após `trim()` e compactação de espaços, se o resultado ficar vazio, a função devolve a estrutura de erro de validação.

## 11. Se ela altera DOM
Não.

## 12. Se ela altera estado global
Não.

## 13. Se ela lê ou altera cache global
Não.

## 14. Se ela chama API/requestJson
Não.

## 15. Se ela monta payload
Não diretamente. Ela fornece o resultado usado por etapas superiores de cadastro e payload, mas não monta o payload por conta própria.

## 16. Se ela salva dados
Não.

## 17. Se ela exclui dados
Não.

## 18. Se ela altera vínculo entre convênio e plano
Não.

## 19. Se ela depende de convênio selecionado
Não diretamente. A função valida apenas o nome do plano; o contexto de convênio selecionado é tratado por camadas superiores do módulo.

## 20. Se ela altera paciente
Não.

## 21. Se ela altera procedimento
Não.

## 22. Se ela altera tabela/preço/custo/reajuste/financeiro
Não.

## 23. Se ela depende de evento, clique ou duplo clique
Não há dependência direta. Ela é um helper textual, não um handler de interação.

## 24. Se ela depende de renderização
Não.

## 25. Se ela depende de modal
Não.

## 26. Se ela altera texto visível
Não diretamente. Ela produz um valor e uma mensagem de validação usados por camadas superiores.

## 27. Se ela retorna mensagem, código, flag ou objeto usado em validação
Sim. Ela retorna um objeto de validação com flag `ok`, valor normalizado e mensagem em `motivo`.

## 28. Se existe risco textual/mojibake por envolver mensagem ou texto visível
Existe risco documental, porque a mensagem de validação é texto visível da interface. Nesta subetapa não houve correção nem reescrita, apenas registro do risco como potencial acoplamento textual.

## 29. Se ela pode afetar o salvamento de plano indiretamente
Sim. Se a validação falhar, a etapa de salvamento que consome esse retorno tende a bloquear ou recusar o envio do nome.

## 30. Se ela pode afetar payload de plano indiretamente
Sim. O valor validado alimenta o payload construído por funções superiores, então a função influencia o conteúdo final de cadastro de forma indireta.

## 31. Se existe risco adicional por plano depender de convênio selecionado ou vínculo convênio/plano
Sim. Embora a função não manipule o vínculo, ela atua em um fluxo onde o plano é salvo dentro do contexto de um convênio selecionado. Isso aumenta o risco indireto de regressão se a saída da normalização mudar.

## 32. Quais funções ou helpers dependem dela dentro de frontend/js/modules/convenios-planos.js
Dentro da cadeia local, `validarNomePlano()` depende de:

- `normalizarNomePlano()`
- indiretamente, `normalizeText()`

## 33. Se frontend/app.js chama diretamente validarNomePlano() ou apenas wrapper/fallback
`frontend/app.js` não chama `validarNomePlano()` diretamente; ele usa wrappers locais que consultam o namespace do módulo quando disponível.

## 34. Se já há wrapper/fallback no app.js relacionado à validação de nome de plano
Há wrapper/fallback para normalização textual, que alimenta a etapa de validação/cadastro. Nesta leitura não apareceu um wrapper específico de validação direta para nome de plano; o caminho observado é o de normalização usada pelos payloads e pela validação em camadas superiores.

## 35. Se existe risco de regressão funcional ao futuramente delegar ou consolidar esse helper
Sim. Como o helper alimenta normalização e, por consequência, validação e payload, mudanças de contrato ou de tratamento textual podem alterar o comportamento de cadastro.

## 36. Se existe risco relacionado ao histórico de duplo clique
Não há relação direta com duplo clique. O risco principal aqui é textual e de contrato de normalização.

## 37. Se existe risco por ser uma função textual usada em cadastro, validação ou payload
Sim. Funções textuais em cadastro e payload podem causar regressões de consistência se a normalização mudar.

## 38. Classificação de pureza
`puro`

## 39. Recomendação final
`fazer etapa documental de consolidação das cadeias puras`

## 40. Próxima etapa recomendada
Documentar a cadeia complementar de `validarNomePlano()` em conjunto com a leitura de wrappers/fallbacks de `app.js`, para manter a trilha pura e evitar qualquer aproximação com evento, renderização ou vínculo funcional.

## Observações de segurança
- Esta análise não alterou código.
- Não houve mudança em DOM, eventos, clique, duplo clique, renderização, modal, payload, salvamento, exclusão, backend ou banco.
- Qualquer mensagem textual observada deve ser tratada apenas como risco documental, sem correção nesta etapa.
