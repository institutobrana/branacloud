# Microetapa C - Mapper puro do payload basico do simbolo grafico

## Resultado
- APROVADA.

## Assinatura
- arquivo: `frontend-react/src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js`
- entrada: `nome`, `especialidade`, `formaMarcacao`, `bibliotecaSelecionada`
- saida: payload basico em memoria

## Contrato
- `descricao`: nome com trim nas extremidades
- `codigo`: `fileName` do simbolo-base selecionado
- `especialidade`: codigo tecnico da opcao selecionada
- `tipo_simbolo`: 2
- `tipo_marca`: valor tecnico da Forma

## Normalizacoes
- trim em `descricao`
- preservacao de acentos
- preservacao de espacos internos
- preservacao exata do `fileName`
- preservacao do codigo tecnico da Especialidade

## Campos incluidos
- descricao
- codigo
- especialidade
- tipo_simbolo
- tipo_marca

## Campos omitidos
- imagem_custom
- icone
- bitmap1
- bitmap2
- bitmap3
- imagem_url
- sobreposicao
- clinica_id
- tenantId
- userId
- legacy_id
- sessionId
- campos de UI
- objeto completo da Biblioteca

## Erros
- entrada vazia: rejeitada com retorno nulo
- nome acima de 120: rejeitado
- especialidade invalida: rejeitada
- forma fora de 1..6: rejeitada
- simbolo sem fileName/imageUrl: rejeitado

## Integracao local
- o Ok chama o mapper
- o modal permanece aberto
- o estado permanece intacto
- nenhuma API e chamada

## Testes
- mapper: cobrindo payload valido e entradas invalidas
- modal: cobrindo integracao local do Ok e ausencia de efeitos colaterais

## Ausencia de API
- nenhum POST
- nenhum GET
- nenhum reload
- nenhum loading

## Proxima etapa
- Microetapa D: reintroduzir o POST basico com loading, erro, sucesso, reload e reset
