# Fechamento do botao Excluir Biblioteca de Simbolos Graficos

## Resultado
- BLOQUEADA PARA ITENS NATIVOS.

## Decisao final
- A Biblioteca-base do modal Novo possui 56 BMPs nativos.
- Esses itens sao catalogo oficial do sistema e continuam protegidos.
- O botao X permanece visivel e desabilitado para esses itens.
- Nao existe exclusao persistente segura para a biblioteca nativa nesta frente.

## Contrato visual final
- sem selecao: X desabilitado com indicacao de selecao obrigatoria.
- com simbolo nativo selecionado: X desabilitado com indicacao de bloqueio.
- title: `Símbolos da biblioteca do sistema não podem ser excluídos`
- aria-label: `Excluir símbolo da biblioteca — indisponível para símbolos do sistema`

## Banco e backend
- DELETE existente: nao serve para BMP oficial.
- simbolos oficiais: protegidos por tipo_simbolo = 1 e pela regra do catalogo.
- storage: public/dist nao sao storage editavel.
- filesystem da task: efemero e inadequado.

## Consequencia
- A exclusao observada no EasyDental Desktop nao sera reproduzida sobre os assets nativos do Brana Cloud.
- Qualquer futura exclusao exigira biblioteca de usuario com storage proprio e contrato separado.

## Estado da frente
- frontend alterado: sim, apenas no contrato visual.
- exclusao implementada: nao.
- fase encerrada: sim, como bloqueio arquitetural.
