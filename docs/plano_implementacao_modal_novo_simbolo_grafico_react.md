# Plano de Implementacao - Modal Novo Simbolo Grafico React

## Objetivo
Implementar futuramente o modal `Novo` de simbolos graficos em React sem romper o contrato funcional aprovado.

## Premissas
- O backend atual permanece fonte da verdade.
- O fluxo novo deve reaproveitar o contrato ja existente.
- O editor grafico precisa continuar isolado da tela principal.
- Nao ha autorizacao nesta rodada para editar o codigo ainda.

## Fase 1 - Estrutura visual
- Criar o shell do modal.
- Inserir titulo, campos e botoes obrigatorios.
- Garantir abertura e fechamento consistentes.
- Manter a mesma semantica do fluxo legado.

## Fase 2 - Biblioteca e preview
- Renderizar a biblioteca visual.
- Mostrar preview do simbolo selecionado.
- Permitir selecao segura de itens.
- Preparar o modal para receber imagem editada.

## Fase 3 - Editor isolado
- Integrar o editor grafico como componente isolado ou iframe.
- Padronizar mensagens de entrada e saida.
- Proteger o contexto do simbolo ativo.
- Atualizar o preview quando o editor salvar.

## Fase 4 - Persistencia
- Conectar o modal aos endpoints autenticados existentes.
- Respeitar o contrato de `descricao`, `especialidade`, `tipo_marca` e `tipo_simbolo`.
- Atualizar a lista apos salvar.
- Tratar criacao e edicao sem quebrar o fluxo.

## Fase 5 - Validacao
- Testar abertura do modal.
- Testar cancelamento.
- Testar salvamento com e sem editor.
- Testar retorno visual da biblioteca e do preview.
- Testar erro de validacao e erro de autorizacao.

## Critérios de aceite
- O usuario consegue abrir `Novo`.
- O usuario encontra os campos esperados.
- O usuario consegue acionar o editor sem perder contexto.
- O usuario consegue salvar e voltar para a listagem.
- O modal nao expõe dependencias inseguras.

## Riscos remanescentes
- Divergencia visual entre o legado e o React final.
- Ruptura no contrato de mensagens do editor.
- Mudanca acidental nas regras de tenant.
- Simplificacao excessiva do desenho.

## Dependencias
- `docs/contrato_funcional_modal_novo_simbolo_grafico_react.md`
- `docs/auditoria_editor_simbolo_grafico_postmessage.md`
- `docs/auditoria_fluxo_novo_simbolo_grafico_brana_legado.md`

## Resultado esperado
Ao final da implementacao, o React deve reproduzir o contrato estrutural aprovado sem alterar o backend nem a regra de isolamento por clinica.
