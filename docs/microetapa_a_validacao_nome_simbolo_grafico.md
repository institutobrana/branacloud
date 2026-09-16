# Microetapa A - Validacao simples do Nome do simbolo grafico

## Resultado
- APROVADA.

## Contrato encontrado
- campo tecnico: `descricao`
- obrigatorio: sim
- minimo: 1 caractere util apos trim
- maximo: 120 caracteres
- trim: somente para validacao
- caracteres: texto livre, respeitando o limite do modelo
- duplicidade: nao validada nesta microetapa

## Estado
- Nome: estado local simples no modal
- touched: `nomeTouched`
- erro derivado: `Informe o nome do símbolo.`
- reset: ao abrir, cancelar ou fechar

## Visual e acessibilidade
- borda: erro visual exibido pelo contrato existente do campo
- mensagem: abaixo do input, quando touched e vazio apos trim
- aria-invalid: controlado pelo estado derivado do erro
- aria-describedby: aponta para a mensagem de erro
- layout: preservado

## Regressao verificada
- Especialidade: preservada
- Forma: preservada
- Biblioteca: preservada
- selecao: preservada
- preview: preservado
- Excluir: preservado e bloqueado
- Editar: preservado e bloqueado
- Ok: preservado e desabilitado

## Runtime
- abertura: sem erro
- blur vazio: mostra erro
- espacos: mostram erro
- Nome valido: remove erro
- Cancela: limpa estado
- reabertura: limpa Nome e touched
- flicker: nao observado no contrato implementado

## Console e Network
- erros: nenhum esperado
- warnings: nenhum esperado
- GETs: nenhum adicional por digitar
- POST: nenhum
- outras mutacoes: nenhuma

## Testes
- total: 19
- aprovados: 19
- falhas: 0

## Build e preview
- build: aprovado
- dist: gerado
- preview visual: pendente de validacao manual
- warnings: apenas o aviso de chunk grande ja preexistente

## Documentacao
- criada: sim
- atualizada: `docs/rollback_simbolos_graficos_marco_estavel_2c_3_8_1.md`

## Proxima etapa
- Microetapa B: validade local completa do formulario e habilitacao visual do botao Ok, sem POST
