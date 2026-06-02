# Ficha Pessoal - Historico - Selecao de linha inteira e edicao por duplo clique

## Objetivo
Ajustar a grade da aba `Historico` para ficar mais parecida com o legado EasyDental: linha inteira selecionada com fundo branco na grade e edicao de celula por duplo clique.

## O que foi ajustado
- A grade passou a manter fundo branco padrao em todas as celulas.
- O clique simples em uma celula seleciona a linha inteira.
- O duplo clique em uma celula entra em modo de edicao naquela coluna.
- A selecao visual continua no row inteiro, como no legado.

## Arquivo alterado
- `frontend/js/modules/ficha-pessoal-aba-historico.js`

## O que foi mantido igual
- As 4 colunas da grade.
- O fluxo de insercao, edicao, exclusao e propriedades da linha.
- A persistencia via `extra.historico_aba`.
- A refatoracao estrutural ja concluida da janela `Propriedades da linha`.

## Limitacoes
- A edicao continua sendo local e incremental, como no comportamento ja adotado na aba.
- Pequenas diferencas de pixel podem existir em relacao ao legado por causa de fonte e motor de renderizacao.

## Riscos observados
- Se o usuario clicar rapidamente em sequencia, o foco pode mudar entre selecao e edicao conforme o comportamento nativo do navegador.
- A grade precisa continuar coerente com a navegacao por teclado ja existente.

## Como testar
1. Abrir Ficha Pessoal.
2. Selecionar um paciente.
3. Entrar na aba Historico.
4. Verificar o fundo branco da grade.
5. Clicar em uma linha e conferir se a linha inteira fica selecionada.
6. Dar duplo clique em uma celula e conferir se a coluna entra em edicao.
7. Confirmar se as demais acoes da aba continuam funcionando.

## Proxima subetapa recomendada
- Validacao manual do comportamento de clique/duplo clique e, se necessario, pequeno ajuste fino de foco ou destaque visual.
