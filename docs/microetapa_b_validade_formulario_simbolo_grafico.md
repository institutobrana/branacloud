# Microetapa B - Validade completa e habilitacao do Ok do simbolo grafico

## Resultado
- APROVADA.

## Regras
- Nome: obrigatorio apos trim e com maximo de 120 caracteres.
- Especialidade: deve existir no catalogo carregado.
- Forma: deve ser um valor entre 1 e 6.
- simbolo: deve haver selecao real na biblioteca-base.
- expressao derivada: `isFormValid`

## Matriz
- vazio + valido + valido + selecionado => Ok desabilitado
- valido + vazio/invalido + valido + selecionado => Ok desabilitado
- valido + valido + invalido + selecionado => Ok desabilitado
- valido + valido + valido + nenhum => Ok desabilitado
- valido + valido + valido + selecionado => Ok habilitado

## Botao Ok
- invalido: desabilitado
- valido: habilitado
- clique: preventDefault apenas
- API: nenhuma
- fechamento: nenhum
- estado: preservado

## Regressao
- Especialidade: preservada
- Forma: preservada
- Biblioteca: preservada
- selecao: preservada
- preview: preservado
- X: preservado e bloqueado
- Editar: preservado e bloqueado
- Cancela: preservado

## Runtime
- inicial: Ok desabilitado
- Nome sem simbolo: desabilitado
- Nome com simbolo: habilitado
- remocao do Nome: desabilita novamente
- clique no Ok: nao salva, nao fecha, nao limpa
- reabertura: Ok desabilitado

## Console e Network
- erros: nenhum esperado
- warnings: nenhum esperado
- POST: nenhum
- outras mutacoes: nenhuma

## Testes
- total: 19
- aprovados: 19
- falhas: 0

## Build
- resultado: aprovado
- warnings: apenas o aviso de chunk grande ja preexistente
- erros: nenhum

## Documentacao
- criada: sim
- atualizada: `docs/rollback_simbolos_graficos_marco_estavel_2c_3_8_1.md`

## Proxima etapa
- Microetapa C: restaurar o mapper puro do payload basico, ainda sem chamar API
