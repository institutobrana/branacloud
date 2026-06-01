# Ficha Pessoal - Historico - Etapa 5 - navegacao por TAB

## Objetivo
Implementar de forma conservadora a navegacao local por TAB na linha em insercao/edicao da aba Historico, aproximando o fluxo do EasyDental sem ainda salvar ou persistir.

## Escopo aplicado
- A navegacao por TAB ficou concentrada em `frontend/js/modules/ficha-pessoal-aba-historico.js`.
- O foco percorre as colunas da grade em ordem definida.
- A linha ativa continua selecionada durante a navegacao.
- O comportamento foi mantido local, sem alterar backend, banco ou HTML.

## Como a navegacao por TAB foi estruturada
- Cada celula da linha ativa recebe estado de foco local.
- Um handler de `keydown` no `tbody` intercepta `Tab`.
- Ao pressionar `Tab`, o foco avanca para a proxima celula da linha ativa.
- Ao pressionar `Shift+Tab`, o foco retorna para a celula anterior.
- A selecao visual da linha e preservada enquanto o foco muda entre as colunas.

## Ordem de navegacao entre colunas
- Data
- Cirurgiao
- Regiao
- Descricao do procedimento

## Shift+TAB
- Sim, foi implementado.
- O retorno de foco foi tratado de forma local e conservadora, sem sair da grade.

## O que foi deixado para etapas futuras
- Persistencia nova.
- Integracao com `Grava`.
- ENTER.
- ESC.
- Edita linha completo.
- Elimina linha completo.
- Propriedades da linha funcional.
- Fechamento do fluxo de gravacao.

## Confirmacoes
- Nao houve persistencia nova.
- Nao houve alteracao de banco.
- Nao houve alteracao de backend.
- Nao houve alteracao de endpoints, models, schema ou seeds.
- A blindagem textual/mojibake foi respeitada.

## Riscos observados
- A navegacao ainda depende do foco local da grade e do DOM da linha ativa.
- O comportamento foi limitado a TAB e Shift+TAB para reduzir risco.
- O fluxo continua provisorio e nao representa a edicao final do EasyDental.

## Como testar no sistema
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Clicar em Inserir linha.
5. Confirmar que a nova linha aparece e fica selecionada.
6. Pressionar TAB a partir da primeira celula.
7. Confirmar se o foco avanca para as proximas colunas na ordem correta.
8. Repetir o TAB ate a ultima coluna.
9. Confirmar que a tela nao quebra durante a navegacao.
10. Confirmar que nenhuma outra aba da Ficha Pessoal foi afetada.

## Proxima subetapa recomendada
Proxima etapa sugerida: ENTER/ESC.
