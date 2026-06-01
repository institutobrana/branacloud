# Ficha Pessoal - Historico - Etapa 6 - ENTER / ESC

## Objetivo
Implementar de forma conservadora o comportamento local de `ENTER` e `ESC` na linha ativa da aba Historico, aproximando o fluxo do EasyDental sem ainda persistir em backend.

## Escopo aplicado
- A logica de `ENTER` e `ESC` ficou concentrada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- A linha ativa pode ser confirmada localmente.
- A linha em rascunho pode ser cancelada localmente.
- Nenhuma alteracao foi feita em backend, banco, endpoints, schema ou HTML.

## Como ENTER foi tratado localmente
- Ao pressionar `ENTER`, a linha ativa e confirmada localmente.
- A linha deixa o estado de edicao e passa a ser tratada como confirmada na estrutura local.
- Quando seguro, o fluxo abre uma nova linha local abaixo da atual, ja selecionada, aproximando o comportamento do EasyDental.

## Como ESC foi tratado localmente
- Em linha de rascunho, `ESC` remove a linha local ainda nao confirmada.
- Em linha ja editada com snapshot local, `ESC` reverte o conteudo para o snapshot conservador guardado no DOM.
- O cancelamento volta a linha ao estado normal sem quebrar a grade.

## ENTER abre nova linha abaixo
- Sim, foi implementado.
- A nova linha e aberta localmente abaixo da linha confirmada, desde que a estrutura esteja em estado seguro para isso.

## Como a selecao/foco ficaram apos ENTER e ESC
- Depois de `ENTER`, o foco vai para a nova linha local aberta abaixo.
- Depois de `ESC`, a linha cancelada volta ao estado normal local e a selecao permanece coerente com a grade.

## O que foi deixado para etapas futuras
- Persistencia nova.
- Integracao com `Grava`.
- Propriedades da linha funcional.
- Edita linha completo.
- Elimina linha completo.
- Fechamento do fluxo de gravacao.

## Confirmacoes
- Nao houve persistencia nova.
- Nao houve alteracao de banco.
- Nao houve alteracao de backend.
- Nao houve alteracao de endpoints, models, schema ou seeds.
- A blindagem textual/mojibake foi respeitada.

## Riscos observados
- O comportamento ainda e local e depende do snapshot em DOM.
- A abertura automatica de nova linha apos `ENTER` foi mantida apenas quando a estrutura estava segura.
- O `ESC` permanece conservador para evitar regressao visual ou quebra da grade.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Clicar em Inserir linha.
5. Preencher ou alterar os campos da linha.
6. Pressionar `ENTER`.
7. Confirmar se a linha e confirmada localmente sem quebrar a grade.
8. Confirmar se apos `ENTER` uma nova linha abaixo e aberta, caso essa parte tenha sido implementada com seguranca.
9. Abrir outra linha nova e pressionar `ESC`.
10. Confirmar se a linha em criacao e cancelada localmente sem quebrar a tela.
11. Confirmar que `TAB` continua funcionando.
12. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: integracao com Grava.
