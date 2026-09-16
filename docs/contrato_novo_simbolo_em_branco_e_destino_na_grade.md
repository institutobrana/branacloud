# Contrato funcional - Novo simbolo em branco e destino na grade

Data: 2026-08-03

## Objetivo
Consolidar o contrato funcional do simbolo grafico que nasce sem desenho no EasyDental Desktop e o impacto desse estado na grade do Brana Cloud.

## Regra central
- O simbolo pode existir funcionalmente antes de possuir desenho.
- O estado em branco nao elimina o registro da grade.
- O destino do item e a propria grade de simbolos graficos.

## Fase G.1E
- No fluxo React de `Novo`, a selecao de biblioteca fica opcional.
- O preview vazio passa a ser um estado valido.
- O botao `Ok` habilita apenas com nome, especialidade valida e forma valida.
- O mapper local passa a gerar um draft de cadastro inicial sem exigir imagem.
- Este contrato nao reativa `POST`, nao chama API e nao altera o editor legado.

## Comportamento observado
- O fluxo `Novo` permite iniciar o cadastro sem imagem aplicada.
- O simbolo continua sendo um item da lista mesmo quando o desenho ainda nao foi persistido.
- O usuario pode completar o desenho depois, por alteracao ou edicao posterior.

## Evidencia direta confirmada
- A tabela iniciou com 81 simbolos.
- O `Novo` aceitou `Nome`, `Tipo Definido pelo usuario`, `Especialidade Dentística` e `Forma Dente`.
- A biblioteca podia permanecer sem selecao.
- O preview podia permanecer vazio.
- O `Ok` habilitou sem exigir desenho.
- Ao confirmar, houve mensagem informativa de associacao a intervencao.
- A tabela passou de 81 para 82.
- O novo registro permaneceu selecionavel sem imagem final.
- O `Altera` abriu o editor externo para completar o desenho depois.

## Contrato da grade
- A grade deve aceitar o item novo com representacao visual minima.
- O item em branco precisa aparecer como linha/registro valido.
- A ausencia do desenho nao deve bloquear a percepcao de que o simbolo foi criado.
- O preview pode mostrar vazio ate a persistencia da arte.

## Contrato de edicao posterior
- O estado em branco nao e terminal.
- A edicao posterior pode completar a representacao visual do mesmo simbolo.
- O item na grade nao deve trocar de identidade quando recebe o desenho.

## Implicacao para o Brana Cloud
- A futura tela nao deve tratar desenho ausente como erro fatal.
- A lista precisa ser capaz de exibir o novo simbolo antes da arte final.
- A reativacao de `POST` deve considerar explicitamente o caso de cadastro sem imagem.
- O editor do fluxo futuro pode ser separado do cadastro, desde que a persistencia posterior seja preservada.

## O que nao entra neste contrato
- Nao entra persistencia real.
- Nao entra alteracao de backend.
- Nao entra editor de imagem.
- Nao entra migracao.

## Relacao com a fase G.0E
Este contrato existe para sustentar a engenharia reversa funcional do fluxo `Novo` e `Altera`, deixando claro que o destino do simbolo e a grade mesmo quando ele nasce em branco.
