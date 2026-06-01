# Ficha Pessoal - Historico - Etapa 4 - inserir linha

## Objetivo
Implementar de forma conservadora o fluxo local de Inserir linha na aba Historico, aproximando o comportamento do EasyDental apenas no que cabe nesta subetapa.

## Escopo aplicado
- A criacao da nova linha ficou concentrada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- A nova linha e criada localmente na grade.
- A nova linha nasce selecionada e com a data atual padrao.
- A insercao ocorre de forma previsivel, abaixo da linha ativa quando houver uma selecao local.
- O foco local foi encaminhado para a primeira celula da nova linha.
- Nenhuma alteracao foi feita em backend, banco, endpoints ou schema.

## Como a nova linha e criada
- O botao `Inserir linha` chama a rotina local do modulo do Historico.
- A rotina monta um `tr` novo com os quatro campos visuais atuais da grade.
- A linha e inserida abaixo da linha selecionada quando existe uma selecao valida.
- Se nao houver linha ativa, a insercao cai para o fim da tabela de forma previsivel.

## Como a data padrao foi definida
- A coluna `Data` recebe `new Date().toLocaleDateString("pt-BR")`.
- O formato fica coerente com o restante da grade atual.
- A data nasce apenas como valor local de interface, sem persistencia.

## Como a selecao da linha inserida foi tratada
- A selecao anterior e limpa antes da nova linha assumir o estado ativo.
- A linha nova recebe a classe visual de selecionada.
- A primeira celula da linha nova recebe foco local para preparar a edicao posterior sem depender ainda de TAB/ENTER/ESC.

## O que foi deixado para etapas futuras
- Persistencia nova.
- Integracao com `Grava`.
- TAB completo.
- ENTER.
- ESC.
- Edita linha completo.
- Elimina linha completo.
- Propriedades da linha funcional.
- Edicao real equivalente ao EasyDental.

## Confirmacoes
- Nao houve persistencia nova.
- Nao houve alteracao de banco.
- Nao houve alteracao de backend.
- Nao houve alteracao de endpoints, models, schema ou seeds.
- A blindagem textual/mojibake foi respeitada.

## Riscos observados
- A linha ainda e local e depende do DOM da grade atual.
- O foco na primeira celula e apenas preparatorio e nao representa edicao completa.
- Os demais botoes continuam propositalmente em fluxo provisorio.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Clicar em Inserir linha.
5. Confirmar se uma nova linha aparece na grade.
6. Confirmar se a nova linha fica selecionada.
7. Confirmar se a Data nasce preenchida por padrao.
8. Confirmar se a tela nao quebra ao inserir mais de uma linha.
9. Confirmar se os demais botoes continuam aparecendo normalmente.
10. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: navegacao por TAB ou preparacao de edicao local, conforme o resultado tecnico encontrado.
