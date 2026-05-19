# Convênios e Planos — Subetapa 4 — Análise documental do helper validarNomeConvenio

## 1. Objetivo da análise documental
Registrar o estado atual de `validarNomeConvenio()` no módulo de Convênios e Planos, com foco exclusivo em leitura, isolamento de responsabilidades e avaliação de risco antes de qualquer delegação futura.

## 2. Onde validarNomeConvenio() está definido
A função está definida em `frontend/js/modules/convenios-planos.js`, dentro da cadeia de helpers textuais do módulo.

## 3. Qual é a assinatura atual da função
A assinatura atual é:

```js
function validarNomeConvenio(valor)
```

## 4. Qual é a lógica atual da função
A função recebe um valor, chama `normalizarNomeConvenio(valor)` para obter uma versão limpa do texto e então verifica se o resultado ficou vazio.

Se o nome normalizado estiver vazio, ela retorna um objeto de validação com `ok: false`, `valor: ""` e uma mensagem de orientação para informar o nome do convênio.

Se houver conteúdo válido, ela retorna um objeto com `ok: true`, o valor normalizado e mensagem vazia.

## 5. Se validarNomeConvenio() depende diretamente de normalizarNomeConvenio()
Sim. A dependência é direta e explícita.

## 6. Se validarNomeConvenio() depende indiretamente de normalizeText()
Sim. Como `normalizarNomeConvenio()` chama `normalizeText()`, a validação depende indiretamente desse helper base.

## 7. Quais entradas ela espera receber
Ela espera receber um valor textual de nome de convênio, mas aceita qualquer tipo de entrada porque a normalização anterior converte o dado para string de forma defensiva.

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
Valores `null`, `undefined`, vazios, numéricos ou não-string passam primeiro pela normalização indireta e acabam convertidos em string. Após trim e compactação de espaços, se o resultado ficar vazio, a função devolve a estrutura de erro de validação.

## 11. Se ela altera DOM
Não.

## 12. Se ela altera estado global
Não.

## 13. Se ela lê ou altera cache global
Não.

## 14. Se ela chama API/requestJson
Não.

## 15. Se ela monta payload
Não diretamente. Ela fornece o resultado usado por etapas posteriores de cadastro e payload, mas não monta o payload por conta própria.

## 16. Se ela salva dados
Não.

## 17. Se ela exclui dados
Não.

## 18. Se ela altera vínculo entre convênio e plano
Não.

## 19. Se ela altera paciente
Não.

## 20. Se ela altera procedimento
Não.

## 21. Se ela altera tabela/preço/custo/reajuste/financeiro
Não.

## 22. Se ela depende de evento, clique ou duplo clique
Não há dependência direta. Ela é um helper textual, não um handler de interação.

## 23. Se ela depende de renderização
Não.

## 24. Se ela depende de modal
Não.

## 25. Se ela altera texto visível
Não diretamente. Ela produz um valor e uma mensagem de validação usada por camadas superiores.

## 26. Se ela retorna mensagem, código, flag ou objeto usado em validação
Sim. Ela retorna um objeto de validação com flag `ok`, valor normalizado e mensagem em `motivo`.

## 27. Se existe risco textual/mojibake por envolver mensagem ou texto visível
Existe risco documental, porque a mensagem de validação é texto visível da interface. Nesta subetapa não houve correção nem reescrita, apenas registro do risco como potencial acoplamento textual.

## 28. Se ela pode afetar o salvamento de convênio indiretamente
Sim. Se a validação falhar, a etapa de salvamento que consome esse retorno tende a bloquear ou recusar o envio do nome.

## 29. Se ela pode afetar payload indiretamente
Sim. O valor validado alimenta o payload construído por funções superiores, então a função influencia o conteúdo final de cadastro de forma indireta.

## 30. Quais funções ou helpers dependem dela dentro de frontend/js/modules/convenios-planos.js
Dentro da cadeia local, `validarNomeConvenio()` depende de:

- `normalizarNomeConvenio()`
- indiretamente, `normalizeText()`

Não foi identificada dependência inversa relevante dentro do próprio helper puro; a função atua como consumidor da normalização.

## 31. Se frontend/app.js chama diretamente validarNomeConvenio() ou apenas wrapper/fallback
`frontend/app.js` não chama `validarNomeConvenio()` diretamente; a integração observada ocorre por wrappers e uso indireto do namespace do módulo.

## 32. Se já há wrapper/fallback no app.js relacionado à validação de nome de convênio
Sim. O `app.js` possui wrappers locais para normalização e validação, com fallback para `window.BranaConveniosPlanosModule?.helpers` quando disponível.

## 33. Se existe risco de regressão funcional ao futuramente delegar ou consolidar esse helper
Sim, mas o risco é moderado e controlável. Como a função é usada em validação de cadastro, qualquer mudança de contrato de retorno, mensagem ou normalização pode refletir em salvamento e payload.

## 34. Se existe risco relacionado ao histórico de duplo clique
Não há relação direta com o histórico de duplo clique. O risco principal aqui é textual/contratual, não de interação.

## 35. Se existe risco por ser uma função textual usada em cadastro, validação ou payload
Sim. Funções textuais usadas em cadastro e validação têm risco maior de regressão semântica porque pequenas mudanças de contrato podem alterar o comportamento de aceite/rejeição dos dados.

## 36. Classificação de pureza
`puro`

## 37. Recomendação final
`analisar normalizarNomePlano() antes`

## 38. Próxima etapa recomendada
Documentar a cadeia complementar de `normalizarNomePlano()` e, depois, revisar `validarNomePlano()` para manter a simetria documental do módulo.

## Observações de segurança
- Esta análise não alterou código.
- Não houve mudança em DOM, eventos, clique, duplo clique, renderização, modal, payload, salvamento, exclusão, backend ou banco.
- Qualquer mensagem textual observada deve ser tratada apenas como risco documental, sem correção nesta etapa.
